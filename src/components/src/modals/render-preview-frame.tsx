// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {createRoot, type Root} from 'react-dom/client';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {theme} from '@kepler.gl/styles';
import {messages} from '@kepler.gl/localization';
import {MapSplitMode} from '@kepler.gl/constants';
import {calculateLayerData} from '@kepler.gl/reducers';
import {copyTable} from '@kepler.gl/table';
import type {TimeRangeFilter} from '@kepler.gl/types';
import {
  applyFiltersToDatasets,
  cameraForMap,
  evaluateCameraTour,
  getCameraTourDuration
} from '@kepler.gl/utils';
import {drawStarsBackground, getGlobeClearColor} from '@kepler.gl/deckgl-layers';
import ExportVideoModalFactory from './export-video-modal';
import {getAnimatableFilters} from './hubble-utils';
import {getAnnotationReadoutValues} from '../annotations/annotation-readout';
import {compositeVideoAnnotations} from './video-annotation-overlay';

export type PreviewFrameOptions = {
  width: number;
  height: number;
  /** Data timeline timestamp in Unix milliseconds. */
  dataTime?: number;
  /** Elapsed authored camera/effect/layer/annotation timeline time in milliseconds. */
  cameraTimeMs?: number;
};

type PreviewMapData = {mapState: any; mapStyle: any; visState: any; uiState?: any};

export type FramePreviewCallbacks = {
  width: number;
  height: number;
  animationTimeMs?: number;
  onReady: (panel: any) => void;
  onRender: (panel: any, map?: any) => void;
  onError: (error: unknown) => void;
};

const noop = () => undefined;
let previewActive = false;

/** Prepare independent frame settings over the loaded data; never copy dataset payloads. */
export function preparePreviewFrame(mapData: PreviewMapData, options: PreviewFrameOptions) {
  const {width, height, dataTime, cameraTimeMs} = options;
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width <= 0 ||
    height <= 0 ||
    width > 8192 ||
    height > 8192 ||
    width * height > 33554432
  )
    throw new Error(
      'Preview dimensions must be positive integers up to 8192, with at most 32 megapixels.'
    );
  if (dataTime !== undefined && !Number.isFinite(dataTime)) {
    throw new Error('Preview dataTime must be finite.');
  }
  if (cameraTimeMs !== undefined && (!Number.isFinite(cameraTimeMs) || cameraTimeMs < 0)) {
    throw new Error('Preview cameraTimeMs must be a finite, nonnegative number.');
  }
  const frame = {
    ...mapData,
    mapState: {...mapData.mapState},
    visState: {
      ...mapData.visState,
      animationConfig: {
        ...mapData.visState.animationConfig,
        ...(dataTime === undefined ? {} : {currentTime: dataTime})
      },
      // filterTable replaces table properties. Its raw buffers, fields and
      // cached time mappings remain shared and read-only during capture.
      datasets: Object.fromEntries(
        Object.entries(mapData.visState.datasets).map(([id, table]: [string, any]) => [
          id,
          copyTable(table)
        ])
      ),
      layers: mapData.visState.layers.map(layer => {
        if (layer.config.isVisible && layer.type === 'zarr') {
          throw new Error(
            'Preview frames do not yet support visible Zarr layers. Hide the Zarr layer before previewing.'
          );
        }
        // New instances own their callbacks and render caches. Keep source
        // fields/buffers shared, and isolate only mutable layer settings.
        const config = {
          ...layer.config,
          animation: {
            ...layer.config.animation,
            ...(dataTime !== undefined && layer.config.animation?.enabled
              ? {currentTime: dataTime}
              : {})
          }
        };
        const copy = new layer.constructor({...config, id: layer.id});
        copy.config = config;
        copy.meta = {...layer.meta};
        return copy;
      })
    }
  };
  if (cameraTimeMs !== undefined) {
    const duration = getCameraTourDuration(frame.visState.cameraTour);
    if (!duration || cameraTimeMs > duration) {
      throw new Error(
        'Preview cameraTimeMs requires a camera tour and must be within its duration.'
      );
    }
    const camera = evaluateCameraTour(frame.visState.cameraTour, cameraTimeMs);
    frame.mapState = {
      ...frame.mapState,
      ...cameraForMap(camera!, Boolean(frame.mapState.globe?.enabled))
    };
  }
  const changedFilters: TimeRangeFilter[] = [];
  if (dataTime !== undefined) {
    for (const filter of getAnimatableFilters(frame)) {
      const [start, end] = filter.value;
      let value: [number, number];
      if (filter.animationWindow === 'point') value = [dataTime, dataTime];
      else if (filter.animationWindow === 'incremental') value = [start, dataTime];
      else if (filter.animationWindow === 'interval') {
        const bins = filter.timeBins?.[filter.dataId[0]]?.[filter.plotType?.interval];
        const bin = bins?.find(bin => dataTime >= bin.x0 && dataTime < bin.x1);
        if (!bin) throw new Error('Preview dataTime does not belong to a loaded filter interval.');
        // Time filters include both endpoints; histogram bins exclude x1.
        value = [bin.x0, Math.max(bin.x0, bin.x1 - 1)];
      } else {
        value =
          filter.syncTimelineMode === 0
            ? [dataTime, dataTime + end - start]
            : [dataTime - (end - start), dataTime];
      }
      changedFilters.push({...filter, value});
    }
    frame.visState.filters = frame.visState.filters.map(
      filter => changedFilters.find(changed => changed.id === filter.id) || filter
    );
    // Use the normal data filter path without rebuilding sidebar histograms.
    frame.visState.datasets = applyFiltersToDatasets(
      [...new Set<string>(changedFilters.flatMap(filter => filter.dataId))],
      frame.visState.datasets,
      frame.visState.filters,
      frame.visState.layers
    );
  }
  frame.visState.layerData = frame.visState.layers.map((layer, index) => {
    if (layer.config.isVisible === false) return {};
    const domainFilter = changedFilters.find(
      filter => !filter.fixedDomain && filter.dataId.includes(layer.config.dataId)
    );
    if (domainFilter) layer.updateLayerDomain(frame.visState.datasets, domainFilter);
    const {layer: renderedLayer, layerData} = calculateLayerData(layer, frame.visState);
    frame.visState.layers[index] = renderedLayer;
    if (!renderedLayer.isValid)
      throw new Error(
        `Preview layer "${renderedLayer.config.label || renderedLayer.id}" could not render: ${
          renderedLayer.errorMessage
        }`
      );
    return layerData;
  });
  return frame;
}

/**
 * Render one still through the video export's native canvases and annotation
 * compositor. The host must cancel via signal if shared dataset contents change.
 * This owns an offscreen root and never dispatches to the live map.
 */
export async function renderPreviewFrame(
  mapData: PreviewMapData,
  options: PreviewFrameOptions,
  {
    mapboxApiAccessToken,
    mapboxApiUrl,
    containerW = mapData.mapState.width,
    signal
  }: {
    mapboxApiAccessToken: string;
    mapboxApiUrl?: string;
    containerW?: number;
    signal?: AbortSignal;
  }
): Promise<{data: string; mimeType: 'image/png'; width: number; height: number}> {
  if (previewActive)
    throw new Error('A preview frame is already rendering. Try again when it finishes.');
  if (signal?.aborted) throw new DOMException('Preview frame canceled', 'AbortError');
  const frame = preparePreviewFrame(mapData, options);
  previewActive = true;
  const pixelRatio = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio');
  let mount: HTMLDivElement | undefined;
  let root: Root | undefined;
  const capture = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let abort: () => void = noop;
  let frameReady = false;
  let capturing = false;
  const isGlobe = Boolean(frame.mapState.globe?.enabled);
  const isSwipe =
    frame.mapState.isSplit && frame.mapState.mapSplitMode === MapSplitMode.SWIPE_COMPARE;
  try {
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      writable: true,
      value: 1
    });
    mount = document.createElement('div');
    mount.style.cssText = 'position:fixed;left:-100000px;top:0;pointer-events:none;width:1080px;';
    mount.setAttribute('aria-hidden', 'true');
    document.body.appendChild(mount);
    root = createRoot(mount);
    return await new Promise((resolve, reject) => {
      const fail = (error: unknown) => {
        capture.abort();
        reject(
          error instanceof Error ? error : new Error(`Preview rendering failed: ${String(error)}`)
        );
      };
      abort = () => fail(new DOMException('Preview frame canceled', 'AbortError'));
      signal?.addEventListener('abort', abort, {once: true});
      timeout = setTimeout(
        () =>
          fail(
            new Error(
              'Preview frame did not become ready within 45 seconds. Check basemap, tile, model and font resources.'
            )
          ),
        45000
      );
      const onRender = (panel: any, map?: any) => {
        if (!frameReady || capturing || capture.signal.aborted || !panel) return;
        try {
          const preview = panel.previewRef?.current;
          const deck = panel.state.adapter?.deck;
          let source: HTMLCanvasElement | null = null;
          if (isSwipe) {
            if (!preview) return;
            // Native swipe capture verifies both maps, layers and tile sets.
            preview.onAfterRender(() => {
              source = preview.getCompositeCanvas();
            });
          } else if (isGlobe) {
            if (!preview?.areLayersLoaded()) return;
            source = preview.getCanvas();
          } else {
            if (!map?.isStyleLoaded() || !map.areTilesLoaded() || !deck) return;
            const layers = (deck.props.layers || []).flat(Infinity);
            if (!layers.every(layer => !layer || layer.props?.visible === false || layer.isLoaded))
              return;
            source = map.getCanvas();
          }
          if (!source) return;
          // MapLibre rounds its CSS container to integer pixels before applying
          // the export DPR. Permit that bounded rounding only; never accept a
          // stale small preview buffer. Normalize to the exact output size just
          // as the globe/swipe video compositors do.
          const rounding = Math.ceil(options.width / panel.props.exportVideoWidth) + 1;
          if (
            Math.abs(source.width - options.width) > rounding ||
            Math.abs(source.height - options.height) > rounding
          )
            return;
          capturing = true;
          const canvas = document.createElement('canvas');
          canvas.width = options.width;
          canvas.height = options.height;
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Preview capture requires a 2D canvas.');
          if (isGlobe && !isSwipe) {
            const [r, g, b] = getGlobeClearColor(frame.mapState.globe?.config?.backgroundColor);
            context.fillStyle = `rgb(${r},${g},${b})`;
            context.fillRect(0, 0, canvas.width, canvas.height);
            if (frame.mapState.globe?.config?.stars) {
              drawStarsBackground(context, canvas.width, canvas.height, panel.state.viewState);
            }
          }
          // Freeze the WebGL buffer synchronously inside the native render callback.
          context.drawImage(source, 0, 0, options.width, options.height);
          const frameData = panel.props.mapData;
          void compositeVideoAnnotations(
            canvas,
            {
              annotations: frameData.visState.annotations || [],
              readoutValues: getAnnotationReadoutValues(
                frameData.visState.annotations || [],
                frameData.visState
              ),
              interactionConfig: frameData.visState.interactionConfig,
              mapState: {...frameData.mapState, ...panel.state.viewState},
              ...panel._getContainer(),
              animationTimeMs: options.cameraTimeMs,
              ...(isSwipe ? {swipePercentage: preview._getCurrentSwipePercentage()} : {})
            },
            capture.signal
          )
            .then(() => {
              if (capture.signal.aborted) return;
              const url = canvas.toDataURL('image/png');
              if (!url.startsWith('data:image/png;base64,'))
                throw new Error('The browser could not encode the preview PNG.');
              resolve({
                data: url.slice('data:image/png;base64,'.length),
                mimeType: 'image/png',
                width: options.width,
                height: options.height
              });
            })
            .catch(fail);
        } catch (error) {
          fail(error);
        }
      };
      const framePreview: FramePreviewCallbacks = {
        width: options.width,
        height: options.height,
        animationTimeMs: options.cameraTimeMs,
        onReady: panel => {
          frameReady = true;
          // The same camera is already committed. Request a fresh native draw
          // so capture never uses the constructor's initial camera or buffer.
          panel.state.adapter?.deck?.redraw('preview frame committed');
        },
        onRender,
        onError: fail
      };
      const ExportVideoModal = ExportVideoModalFactory();
      class PreviewErrorBoundary extends React.Component<
        {children: React.ReactNode},
        {failed: boolean}
      > {
        state = {failed: false};
        static getDerivedStateFromError() {
          return {failed: true};
        }
        componentDidCatch(error: Error) {
          fail(error);
        }
        render() {
          return this.state.failed ? null : this.props.children;
        }
      }
      root!.render(
        <PreviewErrorBoundary>
          <ThemeProvider theme={theme}>
            <IntlProvider locale="en" messages={messages.en}>
              <ExportVideoModal
                {...frame}
                exportVideo={{
                  ...frame.uiState?.exportVideo,
                  resolution: `${options.width}x${options.height}`,
                  mediaType: 'png'
                }}
                mapboxApiAccessToken={mapboxApiAccessToken}
                mapboxApiUrl={mapboxApiUrl}
                containerW={containerW || 1080}
                visStateActions={{setFilterAnimationTime: noop, setLayerAnimationTime: noop} as any}
                uiStateActions={{setExportVideoSetting: noop} as any}
                onClose={noop}
                framePreview={framePreview}
              />
            </IntlProvider>
          </ThemeProvider>
        </PreviewErrorBoundary>
      );
    });
  } finally {
    if (timeout) clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
    capture.abort();
    try {
      root?.unmount();
    } finally {
      mount?.remove();
      previewActive = false;
      if (pixelRatio) Object.defineProperty(window, 'devicePixelRatio', pixelRatio);
      else delete (window as {devicePixelRatio?: number}).devicePixelRatio;
    }
  }
}
