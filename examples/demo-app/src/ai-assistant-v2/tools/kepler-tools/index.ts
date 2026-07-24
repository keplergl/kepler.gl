import {KeplerContext} from '../../types';
import {getBasemapTool} from './basemap-tool';
import {getMapBoundaryTool} from './boundary-tool';
import {getAddLayerTool} from './layer-creation-tool';
import {getUpdateLayerColorTool} from './layer-style-tool';
import {getLoadDataTool} from './load-data-tool';
import {getSaveDataTool} from './save-data-tool';
import {getTableTool} from './table-tool';

export function getKeplerTools(ctx: KeplerContext) {
  return {
    basemap: getBasemapTool(ctx),
    addLayer: getAddLayerTool(ctx),
    updateLayerColor: getUpdateLayerColorTool(ctx),
    loadData: getLoadDataTool(ctx),
    mapBoundary: getMapBoundaryTool(ctx),
    saveDataToMap: getSaveDataTool(ctx),
    tableTool: getTableTool(ctx)
  };
}

export {getBasemapTool} from './basemap-tool';
export {getMapBoundaryTool} from './boundary-tool';
export {getAddLayerTool, guessDefaultLayer} from './layer-creation-tool';
export {getUpdateLayerColorTool} from './layer-style-tool';
export {getLoadDataTool} from './load-data-tool';
export {getSaveDataTool} from './save-data-tool';
export {getTableTool} from './table-tool';
