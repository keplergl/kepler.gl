// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {KeplerContext} from '../types';
import {getEchartsTools} from './echarts-tools';
import {getGeoTools} from './geo-tools';
import {getKeplerTools} from './kepler-tools';
import {getLisaTools} from './lisa-tool';
import {getQueryTools} from './query-tool';

export function getAllTools(ctx: KeplerContext) {
  return {
    ...getKeplerTools(ctx),
    ...getEchartsTools(ctx),
    ...getGeoTools(ctx),
    ...getLisaTools(ctx),
    ...getQueryTools(ctx)
  };
}

export {getKeplerTools} from './kepler-tools';
export {getEchartsTools} from './echarts-tools';
export {getGeoTools} from './geo-tools';
export {getLisaTools} from './lisa-tool';
export {getQueryTools} from './query-tool';
