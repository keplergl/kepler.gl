import Immutable from 'immutable';
import memoize from 'lodash.memoize';

import {LayerGroups} from '../../constants/mapbox-gl-styles';

const LayerFilters = LayerGroups.reduce((accu, group) => ({
  ...accu,
  [group.slug]: group.filter
}), {});

/**
 * Process loaded map styles
 * @param {Array[]} styles
 * @returns {object} map styles object
 */
export function processMapStyles(styles) {
  return styles.reduce((accu, style) => ({
    ...accu,
    ...style
  }));
}

export function getDefaultLayerGroupVisibility() {
  return LayerGroups
    .reduce((accu, layer) => ({
      ...accu,
      [layer.slug]: layer.defaultVisibility
    }), {});
}

const resolver = ({id, mapStyle, visibleLayerGroups = {}}) =>
  `${id}:${Object.keys(visibleLayerGroups)
    .filter(d => visibleLayerGroups[d]).sort().join('-')}`;

/**
 * Edit preset map style to keep only visible layers
 *
 * @param {object} mapStyle - preset map style
 * @param {object} visibleLayerGroups - visible layers of top map
 * @returns {Immutable.Map} top map style
 */
export const editTopMapStyle = memoize(({id, mapStyle, visibleLayerGroups}) => {

  // an array of layer filters
  // visibleLayerGroups = {land: true, road: false}
  const visibleFilters = Object.keys(visibleLayerGroups)
    .reduce((accu, slug) => [
      ...accu,
      ...visibleLayerGroups[slug] ? [LayerFilters[slug]] : []
    ], []);

  // if top map
  // keep only visible layers
  const filteredLayers = mapStyle.layers
    .filter(layer => visibleFilters.some(match => match(layer)));

  return Immutable.fromJS({
    ...mapStyle,
    layers: filteredLayers
  });
}, resolver);

/**
 * Edit preset map style to filter out invisible layers
 *
 * @param {object} mapStyle - preset map style
 * @param {object} visibleLayerGroups - visible layers of bottom map
 * @returns {Immutable.Map} bottom map style
 */
export const editBottomMapStyle = memoize(({id, mapStyle, visibleLayerGroups}) => {

  const invisibleFilters = Object.keys(visibleLayerGroups)
    .reduce((accu, slug) => [
      ...accu,
      ...!visibleLayerGroups[slug] ? [LayerFilters[slug]] : []
    ], []);

  // if bottom map
  // filter out invisible layers
  const filteredLayers = mapStyle.layers
    .filter(layer => invisibleFilters.every(match => !match(layer)));
  return Immutable.fromJS({
    ...mapStyle,
    layers: filteredLayers
  });
}, resolver);
