// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import Layer, {OVERLAY_TYPE_CONST} from './base-layer';
import {Feature} from 'geojson';

import {findById} from '@kepler.gl/utils';

/**
 * This function will convert layers to mapbox layers
 * @param layers the layers to be converted
 * @param layerData extra layer information
 * @param layerOrder the order by which we should convert layers
 * @param layersToRender {[id]: true | false} object whether each layer should be rendered
 * @returns
 */
export function generateMapboxLayers(
  layers: Layer[] = [],
  layerData: any[] = [],
  layerOrder: string[] = [],
  layersToRender: {[key: string]: boolean} = {}
): {[key: string]: Layer} {
  if (layerData.length > 0) {
    return layerOrder
      .slice()
      .reverse()
      .filter(layerId => {
        const layer = findById(layerId)(layers);
        return layer?.overlayType === OVERLAY_TYPE_CONST.mapboxgl && layersToRender[layerId];
      })
      .reduce((acc, layerId) => {
        const layerIndex = layers.findIndex(l => l.id === layerId);
        if (layerIndex === -1) {
          return acc;
        }

        const layer = layers[layerIndex];

        if (!(layer.overlayType === OVERLAY_TYPE_CONST.mapboxgl && layersToRender[layerId])) {
          return acc;
        }

        return {
          ...acc,
          [layer.id]: {
            id: layer.id,
            data: layerData[layerIndex].data,
            isVisible: layer.config.isVisible,
            config: layerData[layerIndex].config,
            hidden: layer.config.hidden,
            sourceId: layerData[layerIndex].config.source
          }
        };
      }, {});
  }

  return {};
}

type newLayersType = {
  [key: string]: Layer & Partial<{data: any; sourceId: any; isVisible: boolean}>;
};
type oldLayersType = {[key: string]: Layer & {data?: any}};
/**
 * Update mapbox layers on the given map
 * @param map
 * @param newLayers Map of new mapbox layers to be displayed
 * @param oldLayers Map of the old layers to be compare with the current ones to detect deleted layers
 *                  {layerId: sourceId}
 */
export function updateMapboxLayers(
  map,
  newLayers: newLayersType = {},
  oldLayers: oldLayersType | null = null
) {
  // delete no longer existed old layers
  if (oldLayers) {
    checkAndRemoveOldLayers(map, oldLayers, newLayers);
  }

  // insert or update new layer
  Object.values(newLayers).forEach(overlay => {
    const {id: layerId, config, data, sourceId, isVisible} = overlay;
    if (!data && !config) {
      return;
    }

    const {data: oldData, config: oldConfig} = (oldLayers && oldLayers[layerId]) || {};

    if (data && data !== oldData) {
      updateSourceData(map, sourceId, data);
    }

    // compare with previous configs
    if (oldConfig !== config) {
      updateLayerConfig(map, layerId, config, isVisible);
    }
  });
}

function checkAndRemoveOldLayers(map, oldLayers: oldLayersType, newLayers: newLayersType) {
  Object.keys(oldLayers).forEach(layerId => {
    if (!newLayers[layerId]) {
      map.removeLayer(layerId);
    }
  });
}

function updateLayerConfig(map, layerId, config, isVisible) {
  const mapboxLayer = map.getLayer(layerId);

  if (mapboxLayer) {
    // check if layer already is set
    // remove it if exists
    map.removeLayer(layerId);
  }

  map.addLayer(config);
  map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
}

function updateSourceData(map, sourceId, data) {
  const source = map.getSource(sourceId);

  if (!source) {
    map.addSource(sourceId, {
      type: 'geojson',
      data
    });
  } else {
    source.setData(data);
  }
}

/**
 *
 * @param filteredIndex
 * @param getGeometry {({index: number}) => any}
 * @param getProperties {({index: number}) => any}
 * @returns FeatureCollection
 */
export function geoJsonFromData(
  filteredIndex: number[] = [],
  getGeometry: (arg: {index: number}) => any,
  getProperties: (arg: {index: number}) => object
) {
  const geojson: {type: string; features: Feature[]} = {
    type: 'FeatureCollection',
    features: []
  };

  for (let i = 0; i < filteredIndex.length; i++) {
    const index = filteredIndex[i];
    const rowIndex = {index};
    const geometry = getGeometry(rowIndex);

    if (geometry) {
      geojson.features.push({
        type: 'Feature',
        properties: {
          index,
          ...getProperties(rowIndex)
        },
        geometry
      });
    }
  }

  return geojson;
}

export const prefixGpuField = name => `gpu:${name}`;

export function gpuFilterToMapboxFilter(gpuFilter) {
  const {filterRange, filterValueUpdateTriggers} = gpuFilter;

  const hasFilter = Object.values(filterValueUpdateTriggers).filter(d => d);

  if (!hasFilter.length) {
    return null;
  }

  const condition = ['all'];

  // [">=", key, value]
  // ["<=", key, value]
  const expressions = Object.values(filterValueUpdateTriggers as ({name: string} | null)[]).reduce(
    (accu: any[], gpu, i) =>
      gpu?.name
        ? [
            ...accu,
            ['>=', prefixGpuField(gpu.name), filterRange[i][0]],
            ['<=', prefixGpuField(gpu.name), filterRange[i][1]]
          ]
        : accu,
    condition
  );

  return expressions;
}
