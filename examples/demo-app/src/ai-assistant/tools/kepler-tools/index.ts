// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {VisState} from '@kepler.gl/schemas';

import {basemap} from './basemap-tool';
import {addLayer, AddLayerTool} from './layer-creation-tool';
import {updateLayerColor} from './layer-style-tool';
import {loadData, LoadDataTool, LoadDataToolComponent} from './loaddata-tool';
import {mapBoundary} from './boundary-tool';
import {saveToolResults} from './save-data-tool';
import {AiAssistantState} from '../../reducers';

export function getKeplerTools(visState: VisState, aiAssistant: AiAssistantState) {
  // context for tools
  const getDatasets = () => {
    return visState.datasets;
  };

  const getLayers = () => {
    return visState.layers;
  };

  const getLoaders = () => {
    return {
      loaders: visState.loaders,
      loadOptions: visState.loadOptions
    };
  };

  // tool: addLayer
  const addLayerTool: AddLayerTool = {
    ...addLayer,
    context: {
      getDatasets
    }
  };

  // tool: updateLayerColor
  const updateLayerColorTool = {
    ...updateLayerColor,
    context: {
      getLayers
    }
  };

  // tool: loadData
  const loadDataTool: LoadDataTool = {
    ...loadData,
    context: {
      getLoaders
    },
    component: LoadDataToolComponent
  };

  // tool: mapBoundary
  const mapBoundaryTool = {
    ...mapBoundary,
    context: {
      getMapBoundary: () => {
        return aiAssistant.keplerGl?.mapBoundary;
      }
    }
  };

  return {
    basemap,
    addLayer: addLayerTool,
    updateLayerColor: updateLayerColorTool,
    loadData: loadDataTool,
    mapBoundary: mapBoundaryTool,
    saveDataToMap: saveToolResults
  };
}
