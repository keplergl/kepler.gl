// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo, useReducer} from 'react';
import {createRoot} from 'react-dom/client';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import {createVideoExportService} from '@kepler.gl/mcp';
import type {VideoExportSettings} from '@kepler.gl/mcp';
import {copyTable} from '@kepler.gl/table';
import {EXPORT_VIDEO_ID} from '@kepler.gl/constants';

const services = new WeakMap<object, ReturnType<typeof createVideoExportService>>();

/** Tables and layers are mutable even though the containing Redux state is replaced. */
export function snapshotVideoMap(map: any) {
  const visState = map.visState;
  return {
    ...map,
    mapState: cloneDeep(map.mapState),
    mapStyle: cloneDeep(map.mapStyle),
    uiState: {...map.uiState, exportVideo: cloneDeep(map.uiState?.exportVideo)},
    visState: {
      ...visState,
      filters: cloneDeep(visState.filters),
      animationConfig: cloneDeep(visState.animationConfig),
      cameraTour: cloneDeep(visState.cameraTour),
      annotations: cloneDeep(visState.annotations),
      interactionConfig: cloneDeep(visState.interactionConfig),
      effects: visState.effects.map(effect => effect.clone()),
      layers: visState.layers.map(layer =>
        Object.assign(Object.create(Object.getPrototypeOf(layer)), layer, {
          config: cloneDeep(layer.config),
          meta: cloneDeep(layer.meta)
        })
      ),
      datasets: Object.fromEntries(
        Object.entries(visState.datasets).map(([id, table]: [string, any]) => [
          id,
          Object.assign(copyTable(table), {
            fields: cloneDeep(table.fields),
            gpuFilter: cloneDeep(table.gpuFilter),
            filterRecord: cloneDeep(table.filterRecord)
          })
        ])
      )
    }
  };
}

/** Shared by WebMCP and the socket bridge; only one native renderer runs per map. */
export function getVideoExportService(reduxStore: any) {
  let service = services.get(reduxStore);
  if (service) return service;
  service = createVideoExportService({
    getCapabilities: async size => {
      const {getNativeVideoExportCapabilities} = await import('@kepler.gl/components');
      return getNativeVideoExportCapabilities(size?.width, size?.height);
    },
    render: (settings, callbacks) => {
      const map = reduxStore.getState()?.demo?.keplerGl?.map;
      if (!map) throw new Error('The map is not initialized. Load a project before exporting.');
      if (map.uiState?.currentModal === EXPORT_VIDEO_ID) {
        throw new Error('Close the video export dialog before starting an MCP video export.');
      }
      // Snapshot before asynchronous module loading, including the private mutable tables.
      const snapshot = snapshotVideoMap(map);
      return renderVideoSnapshot(snapshot, settings, callbacks);
    }
  });
  services.set(reduxStore, service);
  return service;
}

/** Release retained files and renderer resources when the owning map app closes. */
export function disposeVideoExportService(reduxStore: any) {
  services.get(reduxStore)?.dispose();
  services.delete(reduxStore);
}

class VideoRendererBoundary extends React.Component<
  {onError: (error: Error) => void; children: React.ReactNode},
  {failed: boolean}
> {
  state = {failed: false};
  static getDerivedStateFromError() {
    return {failed: true};
  }
  componentDidCatch(error: Error) {
    this.props.onError(new Error(`Cannot render this map to video: ${error.message}`));
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

async function renderVideoSnapshot(
  snapshot: any,
  settings: VideoExportSettings,
  callbacks: {
    signal: AbortSignal;
    onProgress: (progress: number, phase?: 'rendering' | 'encoding') => void;
  }
): Promise<Blob> {
  const [components, reducers, actions, styles, localization] = await Promise.all([
    import('@kepler.gl/components'),
    import('@kepler.gl/reducers'),
    import('@kepler.gl/actions'),
    import('@kepler.gl/styles'),
    import('@kepler.gl/localization')
  ]);
  if (callbacks.signal.aborted) throw new DOMException('Video export cancelled', 'AbortError');
  const ExportVideo = components.ExportVideoModalFactory();
  const container = document.createElement('div');
  container.dataset.keplerVideoExport = 'true';
  container.setAttribute('aria-hidden', 'true');
  container.inert = true;
  container.style.cssText = 'position:fixed;left:-10000px;top:0;width:1080px;pointer-events:none;';
  document.body.appendChild(container);
  const root = createRoot(container);
  let token = process.env.MapboxAccessToken || '';
  try {
    token = localStorage.getItem('mapbox-token') || token;
  } catch {
    // The configured app token remains available when storage is disabled.
  }
  try {
    return await new Promise<Blob>((resolve, reject) => {
      const abort = () => reject(new DOMException('Video export cancelled', 'AbortError'));
      callbacks.signal.addEventListener('abort', abort, {once: true});
      const finish = (error?: Error, blob?: Blob) => {
        callbacks.signal.removeEventListener('abort', abort);
        if (error) reject(error);
        else resolve(blob!);
      };
      const programmaticExport = {
        ...callbacks,
        onComplete: (blob: Blob) => finish(undefined, blob),
        onError: (error: Error) => finish(error)
      };
      function Renderer() {
        const [visState, dispatch] = useReducer(reducers.visStateReducer, snapshot.visState);
        const visStateActions = useMemo(
          () => ({
            setFilterAnimationTime: (
              ...args: Parameters<typeof actions.setFilterAnimationTime>
            ) => {
              if (settings.dataAnimation !== false)
                dispatch(actions.setFilterAnimationTime(...args));
            },
            setLayerAnimationTime: (...args: Parameters<typeof actions.setLayerAnimationTime>) => {
              if (settings.dataAnimation !== false)
                dispatch(actions.setLayerAnimationTime(...args));
            }
          }),
          []
        );
        return (
          <ThemeProvider theme={styles.theme}>
            <IntlProvider locale="en" messages={localization.messages.en}>
              <ExportVideo
                mapboxApiAccessToken={token}
                mapState={snapshot.mapState}
                mapStyle={snapshot.mapStyle}
                visState={visState}
                exportVideo={{
                  ...reducers.DEFAULT_EXPORT_VIDEO,
                  ...snapshot.uiState?.exportVideo,
                  resolution: `${settings.width}x${settings.height}`,
                  durationMs: settings.durationMs,
                  mediaType: settings.format,
                  cameraPreset:
                    settings.cameraAnimation === false
                      ? 'None'
                      : snapshot.visState.cameraTour?.stops?.length > 1
                      ? 'Camera Animation'
                      : 'None'
                }}
                cameraAnimationEnabled={settings.cameraAnimation !== false}
                containerW={1080}
                visStateActions={visStateActions as any}
                uiStateActions={{setExportVideoSetting: () => undefined} as any}
                onClose={() => finish(new Error('Video export closed before completion.'))}
                programmaticExport={programmaticExport}
              />
            </IntlProvider>
          </ThemeProvider>
        );
      }
      root.render(
        <VideoRendererBoundary onError={programmaticExport.onError}>
          <Renderer />
        </VideoRendererBoundary>
      );
    });
  } finally {
    root.unmount();
    container.remove();
  }
}
