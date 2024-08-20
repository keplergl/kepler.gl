// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
 * @param {Object} options
 * @returns {Array<Object>} split map settings
 */
export function computeSplitMapLayers(layers, options?: {duplicate: boolean}) {
  const mapLayers = getInitialMapLayersForSplitMap(layers);
  const {duplicate} = options || {};
  // show all visible layers in left map, leave right map empty
  return [{layers: mapLayers}, {layers: duplicate ? cloneDeep(mapLayers) : {}}];
}
