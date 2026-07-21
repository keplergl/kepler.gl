
import {KeplerContext} from '../types';
import {getEchartsTools} from './echarts-tools';
import {getGeoTools} from './geo-tools';
import {getKeplerTools} from './kepler-tools';
import {getSpatialAnalysisTools} from './spatial-analysis-tools';
import {getQueryTools} from './query-tool';

export function getAllTools(ctx: KeplerContext) {
  return {
    ...getKeplerTools(ctx),
    ...getEchartsTools(ctx),
    ...getGeoTools(ctx),
    ...getSpatialAnalysisTools(ctx),
    ...getQueryTools(ctx)
  };
}

export {getKeplerTools} from './kepler-tools';
export {getEchartsTools} from './echarts-tools';
export {getGeoTools} from './geo-tools';
export {getSpatialAnalysisTools} from './spatial-analysis-tools';
export {getQueryTools} from './query-tool';
