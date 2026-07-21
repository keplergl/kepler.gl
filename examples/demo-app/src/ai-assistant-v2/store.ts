import {
  AiSettingsSliceConfig,
  AiSettingsSliceState,
  AiSliceConfig,
  AiSliceState,
  createAiSettingsSlice,
  createAiSlice,
  createDefaultAiTools,
  createDefaultAiToolRenderers,
  createDefaultAiSettingsConfig,
  createDefaultAiConfig,
} from '@sqlrooms/ai';
import {
  createRoomStore,
  persistSliceConfigs,
  BaseRoomStoreState,
  createBaseRoomSlice,
} from '@sqlrooms/room-store';
import {
  createDuckDbSlice,
  DuckDbSliceState,
} from '@sqlrooms/duckdb';
import {z} from 'zod';
import type {ToolRendererRegistry} from '@sqlrooms/ai';
import {AI_SETTINGS} from './config';
import {createKeplerAiInstructions} from './instructions';
import {getAllTools} from './tools/tools';
import {getEchartsToolRenderers, setHistogramSelectionHandler} from './tools/echarts-renderers';
import {highlightRows} from './tools/utils';
import {layerSetIsValid} from '@kepler.gl/actions';
import type {KeplerContext} from './types';

export type RoomState = BaseRoomStoreState & DuckDbSliceState & AiSliceState & AiSettingsSliceState;

let reduxStore: any = null;

export function setReduxStore(store: any) {
  reduxStore = store;
  // Wire the histogram brush-selection callback now that redux is available, so
  // the standalone chart renderer can highlight the brushed rows on the map.
  setHistogramSelectionHandler((datasetName, selectedIndices) => {
    const visState = reduxStore?.getState()?.demo?.keplerGl?.map?.visState;
    if (!visState) return;
    highlightRows(
      visState.datasets,
      visState.layers,
      datasetName,
      selectedIndices,
      (layer: any, isValid: boolean) => reduxStore?.dispatch(layerSetIsValid(layer, isValid))
    );
  });
}

export function getReduxStore() {
  return reduxStore;
}

export function getReduxDispatch() {
  return reduxStore?.dispatch;
}

export function getKeplerVisState() {
  return reduxStore?.getState()?.demo?.keplerGl?.map?.visState;
}

function getKeplerContext(): KeplerContext {
  return {
    getVisState: () => reduxStore?.getState()?.demo?.keplerGl?.map?.visState,
    getMapBoundary: () => reduxStore?.getState()?.demo?.aiAssistant?.keplerGl?.mapBoundary,
    getMapboxToken: () => {
      const apiKey = typeof window !== 'undefined' ? localStorage.getItem('mapbox-token') : null;
      return apiKey || undefined;
    },
    dispatch: (action: any) => reduxStore?.dispatch(action),
  };
}

export const {roomStore, useRoomStore} = createRoomStore<RoomState>(
  persistSliceConfigs<RoomState>(
    {
      name: 'kepler-ai-assistant-state',
      version: 1,
      migrate: (persistedState: unknown, version: number): RoomState => {
        if (version >= 1) return persistedState as RoomState;
        if (
          typeof persistedState !== 'object' ||
          persistedState === null ||
          !('aiSettings' in persistedState)
        ) {
          return persistedState as RoomState;
        }
        const defaults = createDefaultAiSettingsConfig(AI_SETTINGS);
        const state = persistedState as Record<string, unknown>;
        return {
          ...state,
          aiSettings: AiSettingsSliceConfig.parse({
            defaults,
            persisted: state.aiSettings,
          }),
        } as unknown as RoomState;
      },
      sliceConfigSchemas: {
        ai: AiSliceConfig,
        aiSettings: AiSettingsSliceConfig,
      },
    },
    (set, get, store) => ({
      ...createBaseRoomSlice()(set, get, store),

      ...createDuckDbSlice()(set, get, store),

      ...createAiSettingsSlice({config: AI_SETTINGS})(set, get, store),

      ...createAiSlice({
        config: createDefaultAiConfig(),

        getInstructions: () => {
          return createKeplerAiInstructions(store);
        },

        toolRenderers: {
          ...createDefaultAiToolRenderers(),
          ...getEchartsToolRenderers(),
        } as ToolRendererRegistry,

        tools: {
          ...createDefaultAiTools(store, {query: {}, commands: false, tables: false}),
          ...getAllTools(getKeplerContext()),
        },
      })(set, get, store),
    }),
  ),
);
