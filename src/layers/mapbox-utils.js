// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {OVERLAY_TYPE} from './base-layer';

/**
 * This function will convert layers to mapbox layers
 * @param layers the layers to be converted
 * @param layerData extra layer information
 * @param layerOrder the order by which we should convert layers
 * @returns {*}
 */
export function generateMapboxLayers(
  layers = [],
  layerData = [],
  layerOrder = [],
  layersToRender = {}
) {
  if (layerData.length > 0) {
    return layerOrder
      .slice()
      .reverse()
      .filter(
        idx =>
          layers[idx].overlayType === OVERLAY_TYPE.mapboxgl &&
          layersToRender[layers[idx].id]
      )
      .map(idx => {
        const layer = layers[idx];
        return {
          id: layer.id,
          data: layerData[idx].data,
          isVisible: layer.config.isVisible,
          config: layerData[idx].config,
          datasetId: layer.config.dataId
        };
      });
  }

  return [];
}

/**
 * Update mapbox layers on the given map
 * @param map
 * @param newLayers Array of new mapbox layers to be displayed
 * @param oldLayers Map of the old layers to be compare with the current ones to detect deleted layers
 *                  {layerId: datasetId}
 * @param mapLayers carries information about split map view
 */
export function updateMapboxLayers(
  map,
  newLayers = [],
  oldLayers = null,
  mapLayers = null,
  opt = {force: true}
) {
  // delete no longer existed old layers
  if (oldLayers) {
    const newLayerIds = newLayers.reduce(
      (accu, l) => ({
        ...accu,
        [l.id]: true
      }),
      {}
    );

    Object.keys(oldLayers).forEach(layerId => {
      if (!newLayerIds[layerId]) {
        map.removeLayer(layerId);
      }
    });
  }

  // insert or update new layer
  newLayers.forEach(overlay => {
    const {id: layerId, config, data, datasetId, isVisible} = overlay;
    if (!data && !config) {
      return;
    }

    if (data) {
      updateSourceData(map, datasetId, data);
    }

    const oldConfig = oldLayers[layerId];
    const mapboxLayer = map.getLayer(layerId);

    // compare with previous configs
    if (!oldConfig || oldConfig !== config || !mapboxLayer || opt.force) {

      if (mapboxLayer) {
        // check if layer already is set
        // remove it if exists
        map.removeLayer(layerId);
      }

      map.addLayer(config);
      map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
      // add if visible and available
      // if (isAvailableAndVisible) {
      //   map.addLayer(config);
      // }
    }
  });
}

function updateSourceData(map, datasetId, data) {
  console.log('mapbox updateSourceData')
  const source = map.getSource(datasetId);

  if (!source) {
    map.addSource(datasetId, {
      type: 'geojson',
      data
    });
  } else {
    source.setData(data);
  }
}
/**
 *
 * @param points
 * @param columns {
 * lat: {fieldIdx},
 * lng: {fieldIdx},
 * alt: {fieldIdx}
 * }
 * @param properties [{label: {fieldIdx}]
 * @returns {{type: string, properties: {}, features: {type: string, properties: {}, geometry: {type: string, coordinates: *[]}}[]}}
 */
export function geojsonFromPoints(
  allData = [],
  filteredIndex = [],
  columns = {},
  properties = []
) {
  const geojson = {
    type: 'FeatureCollection',
    features: []
  };

  for (let i = 0; i < filteredIndex.length; i++) {
    const point = allData[filteredIndex[i]];
    geojson.features.push({
      type: 'Feature',
      properties: properties.reduce(
        (final, property) => ({
          ...final,
          [property.name]: point[property.tableFieldIndex - 1]
        }),
        {}
      ),
      geometry: {
        type: 'Point',
        coordinates: [
          columns.lng ? point[columns.lng.fieldIdx] : null, // lng
          columns.lat ? point[columns.lat.fieldIdx] : null // lat
          // columns.altitude ? point[columns.altitude.fieldIdx] : 0 // altitude
        ]
      }
    });
  }

  return geojson;
}
