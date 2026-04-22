// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {AiSliceConfig, AiSliceState, createAiSlice} from '@sqlrooms/ai-core';
import {
  AiSettingsSliceConfig,
  AiSettingsSliceState,
  createAiSettingsSlice
} from '@sqlrooms/ai-settings';
import {
  createBaseRoomSlice,
  createRoomStore,
  BaseRoomStoreState,
  persistSliceConfigs
} from '@sqlrooms/room-store';
import {VisState} from '@kepler.gl/schemas';
import {Dispatch} from 'redux';

import {AI_SETTINGS} from './config/models';
import {INSTRUCTIONS} from './constants';
import {getDatasetContext} from './tools/utils';
import {KeplerContext} from './types';
import {keplerAgentTool} from './agents/KeplerAgent';
import {echartsAgentTool} from './agents/EchartsAgent';
import {geoAgentTool} from './agents/GeoAgent';
import {lisaAgentTool} from './agents/LisaAgent';

export type AiAssistantStoreState = BaseRoomStoreState & AiSliceState & AiSettingsSliceState;

/**
 * Bridge interface for connecting the Zustand AI store to the kepler.gl Redux store.
 * The host app provides these callbacks to give tools access to kepler state and dispatch.
 */
export type KeplerBridge = {
  getVisState: () => VisState;
  getMapBoundary: () =>
    | {nw: [number, number]; se: [number, number]}
    | undefined;
  getMapboxToken: () => string | undefined;
  dispatch: Dispatch;
};

/**
 * Creates the AI assistant Zustand store with all slices composed together.
 * The keplerBridge provides access to kepler.gl's Redux state from within tools.
 */
export function createAiAssistantStore(keplerBridge: KeplerBridge) {
  const ctx: KeplerContext = {
    getVisState: keplerBridge.getVisState,
    getMapBoundary: keplerBridge.getMapBoundary,
    getMapboxToken: keplerBridge.getMapboxToken,
    dispatch: keplerBridge.dispatch
  };

  const {roomStore, useRoomStore} = createRoomStore<AiAssistantStoreState>(
    persistSliceConfigs(
      {
        name: 'kepler-ai-assistant-state',
        sliceConfigSchemas: {
          ai: AiSliceConfig,
          aiSettings: AiSettingsSliceConfig
        }
      },
      (set, get, store) => ({
        ...createBaseRoomSlice()(set, get, store),
        ...createAiSettingsSlice({config: AI_SETTINGS})(set, get, store),
        ...createAiSlice({
          getInstructions: () => {
            const visState = keplerBridge.getVisState();
            const datasetContext = getDatasetContext(visState?.datasets, visState?.layers);
            return `${INSTRUCTIONS}\n\n${datasetContext}`;
          },
          tools: {
            'agent-kepler': keplerAgentTool(store, ctx),
            'agent-echarts': echartsAgentTool(store, ctx),
            'agent-geo': geoAgentTool(store, ctx),
            'agent-lisa': lisaAgentTool(store, ctx)
          },
          toolRenderers: {}
        })(set, get, store)
      })
    )
  );

  return {roomStore, useRoomStore};
}
