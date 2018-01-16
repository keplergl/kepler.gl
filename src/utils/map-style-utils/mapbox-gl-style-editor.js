import Immutable from 'immutable';
import memoize from 'lodash.memoize';

export function getDefaultLayerGroupVisibility({layerGroups = []}) {
  return layerGroups
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

  const visibleFilters = mapStyle.layerGroups
    .filter(lg => visibleLayerGroups[lg.slug])
    .map(lg => lg.filter);

  // if top map
  // keep only visible layers
  const filteredLayers = mapStyle.style.layers
    .filter(layer => visibleFilters.some(match => match(layer)));

  return Immutable.fromJS({
    ...mapStyle.style,
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

  const invisibleFilters = mapStyle.layerGroups
    .filter(lg => !visibleLayerGroups[lg.slug])
    .map(lg => lg.filter);

  // if bottom map
  // filter out invisible layers
  const filteredLayers = mapStyle.style.layers
    .filter(layer => invisibleFilters.every(match => !match(layer)));

  return Immutable.fromJS({
    ...mapStyle.style,
    layers: filteredLayers
  });
}, resolver);
