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

import {DEFAULT_LIGHT_SETTINGS} from 'constants/default-settings';
import {dataToTimeStamp} from 'layers/geojson-layer/geojson-utils';
/**
 * Find default layers from fields
 *
 * @param {Object} dataset
 * @param {Object} layerClasses
 * @returns {Array} found layers
 */
export function findDefaultLayer(dataset, layerClasses) {
  if (!dataset) {
    return [];
  }

  let layers = [];
  Object.keys(layerClasses).forEach(lc => {
    const {props: layerProps, foundLayers} = layerClasses[lc].findDefaultLayerProps(
      dataset,
      layers
    );

    if (layerProps) {
      const newLayers = (Array.isArray(layerProps) ? layerProps : [layerProps]).map(
        props => {
          const layer = new layerClasses[lc]({...props, dataId: dataset.id});

          return typeof layer.setInitialLayerConfig === 'function'
            ? layer.setInitialLayerConfig(dataset.allData)
            : layer;
        }
      );

      layers = foundLayers.concat(newLayers);
    }
  });

  return layers;
}

/**
 * calculate layer data based on layer type, col Config,
 * return updated layer if colorDomain, dataMap has changed
 * @param {object} layer
 * @param {object} state
 * @param {object} oldLayerData
 * @param {object} opt
 * @returns {object} {layerData: {}, layer: {} || undefined}
 */
export function calculateLayerData(layer, state, oldLayerData, opt = {}) {
  const {type} = layer;
  const {datasets} = state;

  const {data, filteredIndex, allData} = datasets[layer.config.dataId] || {};

  if (!type || !layer.hasAllColumns()) {
    return {layer, layerData: {}};
  }

  const layerData = layer.formatLayerData(
    data,
    allData,
    filteredIndex,
    oldLayerData,
    opt
  );
  return {layerData, layer};
}

export function getLightSettingsFromBounds(bounds) {
  return Array.isArray(bounds) && bounds.length >= 4
    ? {
        ...DEFAULT_LIGHT_SETTINGS,
        lightsPosition: [
          ...bounds.slice(0, 2),
          DEFAULT_LIGHT_SETTINGS.lightsPosition[2],
          ...bounds.slice(2, 4),
          DEFAULT_LIGHT_SETTINGS.lightsPosition[5]
        ]
      }
    : DEFAULT_LIGHT_SETTINGS;
}

export function getTimeAnimationDomainForTripLayer(layer, datasets) {
  const {columns, dataId} = layer.config;
  const dataContent = datasets[dataId].allData;
  const geojsonFieldIdx = columns.geojson.fieldIdx;
  const features = dataContent.map(d => d[geojsonFieldIdx]);
  const unixTimestamps = dataToTimeStamp(features);

  const findMin = timestamps =>
    timestamps.reduce((accu, ts) => (accu < ts ? accu : ts));
  const findMax = timestamps =>
    timestamps.reduce((accu, ts) => (accu > ts ? accu : ts));

  const domain = unixTimestamps.reduce(
    (accu, ts) => [
      Math.min(accu[0], findMin(ts)),
      Math.max(accu[1], findMax(ts))
    ],
    [Number(Infinity), -Infinity]
  );

  return domain;
}
