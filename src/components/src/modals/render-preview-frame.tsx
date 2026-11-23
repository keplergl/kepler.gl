// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {createRoot, type Root} from 'react-dom/client';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import cloneDeepWith from 'es-toolkit/compat/cloneDeepWith';
import {theme} from '@kepler.gl/styles';
import {messages} from '@kepler.gl/localization';
import {MapSplitMode} from '@kepler.gl/constants';
import {calculateLayerData, visStateUpdaters} from '@kepler.gl/reducers';
import {getFieldValueAccessor, type Datasets} from '@kepler.gl/table';
import {cameraForMap, evaluateCameraTour, getCameraTourDuration} from '@kepler.gl/utils';
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

/** Snapshot mutable layer/table caches before reducers prepare the requested data frame. */
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
  // Effects own GPU resources: use their supported clone operation, never copy
  // an existing deck effect into another renderer. All other mutable caches are isolated.
  const snapshot = cloneDeep({
    ...mapData,
    visState: {...mapData.visState, effects: [], layers: [], layerData: []}
  });
  const datasets = snapshot.visState.datasets as Datasets;
  for (const dataset of Object.values(datasets)) {
    if (!dataset.dataContainer || !dataset.fields) continue;
    const cachedFields = dataset.fields.filter(field => field.filterProps).map(field => field.name);
    // cloneDeep retains functions, including accessors bound to the live table.
    // Bind fields and their cached filter mappings to the copied container.
    dataset.fields = dataset.fields.map((field, index) => {
      const {filterProps: _filterProps, ...rest} = field;
      return {...rest, valueAccessor: getFieldValueAccessor(field, index, dataset.dataContainer)};
    });
    dataset.filteredIdxCPU = undefined;
    dataset.filterRecord = undefined;
    dataset.filterRecordCPU = undefined;
    dataset.changedFilters = undefined;
    cachedFields.forEach(name => dataset.getColumnFilterProps(name));
  }
  snapshot.visState.layers = mapData.visState.layers.map(layer => {
    if (layer.config.isVisible && layer.type === 'zarr') {
      throw new Error(
        'Preview frames do not yet support visible Zarr layers. Hide the Zarr layer before previewing.'
      );
    }
    // Arrow callbacks/memoizers close over their owning layer. A deep copy
    // would retain callbacks bound to the live instance, so construct anew.
    const LayerClass = layer.constructor;
    const dataset = datasets[layer.config.dataId];
    const config = cloneDeepWith(layer.config, value => {
      const field =
        value && typeof value.valueAccessor === 'function'
          ? dataset?.fields.find(field => field.name === value.name)
          : undefined;
      return field
        ? {...cloneDeep(value), valueAccessor: field.valueAccessor, filterProps: field.filterProps}
        : undefined;
    });
    const copy = new LayerClass({...config, id: layer.id});
    copy.config = config;
    copy.meta = cloneDeep(layer.meta);
    return copy;
  });
  for (const dataset of Object.values(datasets)) {
    // Rebuild GPU accessors and CPU records using snapshot fields and layers.
    dataset.filterTable?.(snapshot.visState.filters || [], snapshot.visState.layers);
  }
  snapshot.visState.layerData = snapshot.visState.layers.map((original, index) => {
    if (original.config.isVisible === false) return {};
    const {layer, layerData} = calculateLayerData(original, snapshot.visState);
    snapshot.visState.layers[index] = layer;
    if (!layer.isValid)
      throw new Error(
        `Preview layer "${layer.config.label || layer.id}" could not render: ${layer.errorMessage}`
      );
    return layerData;
  });
  snapshot.visState.effects = (mapData.visState.effects || []).map(effect => effect.clone());
  if (cameraTimeMs !== undefined) {
    const duration = getCameraTourDuration(snapshot.visState.cameraTour);
    if (!duration || cameraTimeMs > duration) {
      throw new Error(
        'Preview cameraTimeMs requires a camera tour and must be within its duration.'
      );
    }
    const camera = evaluateCameraTour(snapshot.visState.cameraTour, cameraTimeMs);
    snapshot.mapState = {
      ...snapshot.mapState,
      ...cameraForMap(camera!, Boolean(snapshot.mapState.globe?.enabled))
    };
  }
  if (dataTime !== undefined) {
    for (const filter of getAnimatableFilters(snapshot)) {
      const idx = snapshot.visState.filters.findIndex(candidate => candidate.id === filter.id);
      const [start, end] = filter.value;
      let value: number[];
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
      snapshot.visState = visStateUpdaters.setFilterAnimationTimeUpdater(snapshot.visState, {
        idx,
        prop: 'value',
        value
      });
    }
    snapshot.visState = visStateUpdaters.setLayerAnimationTimeUpdater(snapshot.visState, {
      value: dataTime
    });
  }
  return snapshot;
}

/**
 * Render one still through the video export's native canvases and annotation
 * compositor. This owns an isolated offscreen root; it never dispatches to the live map.
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
  const snapshot = preparePreviewFrame(mapData, options);
  previewActive = true;
  let mount: HTMLDivElement | undefined;
  let root: Root | undefined;
  const capture = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let abort: () => void = noop;
  let frameReady = false;
  let capturing = false;
  const isGlobe = Boolean(snapshot.mapState.globe?.enabled);
  const isSwipe =
    snapshot.mapState.isSplit && snapshot.mapState.mapSplitMode === MapSplitMode.SWIPE_COMPARE;
  try {
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
      const onRender = (panel: any) => {
        if (!frameReady || capturing || capture.signal.aborted || !panel) return;
        try {
          const preview = panel.previewRef?.current;
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
            if (!preview) return;
            preview.onAfterRender(() => {
              source = preview.getCanvas();
            });
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
            const [r, g, b] = getGlobeClearColor(snapshot.mapState.globe?.config?.backgroundColor);
            context.fillStyle = `rgb(${r},${g},${b})`;
            context.fillRect(0, 0, canvas.width, canvas.height);
            if (snapshot.mapState.globe?.config?.stars) {
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
                {...snapshot}
                exportVideo={{
                  ...snapshot.uiState?.exportVideo,
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
    }
  }
}
