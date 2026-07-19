// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {VisState} from '@kepler.gl/schemas';
import {Dispatch} from 'redux';

import {AiAssistantState} from '../reducers';
import {getEchartsTools} from './echarts-tools';
import {getGeoTools} from './geo-tools';
import {getKeplerTools} from './kepler-tools';
import {getQueryTool} from './query-tool';

export function setupLLMTools({
  visState,
  aiAssistant,
  dispatch
}: {
  visState: VisState;
  aiAssistant: AiAssistantState;
  dispatch: Dispatch;
}) {
  return {
    ...getKeplerTools(visState, aiAssistant),
    ...getEchartsTools(visState.datasets, visState.layers, dispatch),
    ...getGeoTools(aiAssistant, visState.datasets, visState.layers, visState.layerData),
    ...getQueryTool(visState.datasets, visState.layers)
  };
}
