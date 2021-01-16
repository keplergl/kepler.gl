// Copyright (c) 2021 Uber Technologies, Inc.
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

import cloneDeep from 'lodash.clonedeep';

/**
 * Add new layers to both existing maps
 * @param {Object} splitMaps
 * @param {Object|Array<Object>} layers
 * @returns {Array<Object>} new splitMaps
 */
export function addNewLayersToSplitMap(splitMaps, layers) {
  const newLayers = Array.isArray(layers) ? layers : [layers];

  if (!splitMaps.length || !newLayers.length) {
    return splitMaps;
  }

  // add new layer to both maps,
  // don't override, if layer.id is already in splitMaps
  return splitMaps.map(settings => ({
    ...settings,
    layers: {
      ...settings.layers,
      ...newLayers.reduce(
        (accu, newLayer) =>
          // @ts-ignore
          newLayer.id in settings.layers || !newLayer.config.isVisible
            ? accu
            : {
                ...accu,
                [newLayer.id]: newLayer.config.isVisible
              },
        {}
      )
    }
  }));
}

/**
 * Remove an existing layer from split map settings
 * @param {Object} splitMaps
 * @param {Object} layer
 * @returns {Object} Maps of custom layer objects
 */
export function removeLayerFromSplitMaps(splitMaps, layer) {
  if (!splitMaps.length) {
    return splitMaps;
  }
  return splitMaps.map(settings => {
    // eslint-disable-next-line no-unused-vars
    const {[layer.id]: _, ...newLayers} = settings.layers;
    return {
      ...settings,
      layers: newLayers
    };
  });
}

/**
 * This method will compute the default maps layer settings
 * based on the current layers visibility
 * @param {Array<Object>} layers
 * @returns {Array<Object>} layer visibility for each panel
 */
export function getInitialMapLayersForSplitMap(layers) {
  return layers
    .filter(layer => layer.config.isVisible)
    .reduce(
      (newLayers, currentLayer) => ({
        ...newLayers,
        [currentLayer.id]: currentLayer.config.isVisible
      }),
      {}
    );
}

/**
 * This method will get default splitMap settings based on existing layers
 * @param {Array<Object>} layers
 * @returns {Array<Object>} split map settings
 */
export function computeSplitMapLayers(layers) {
  const mapLayers = getInitialMapLayersForSplitMap(layers);

  return [{layers: mapLayers}, {layers: cloneDeep(mapLayers)}];
}
