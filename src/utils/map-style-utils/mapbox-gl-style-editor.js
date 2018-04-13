// Copyright (c) 2018 Uber Technologies, Inc.
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

import Immutable from 'immutable';
import memoize from 'lodash.memoize';

export function getDefaultLayerGroupVisibility({layerGroups = []}) {
  return layerGroups.reduce(
    (accu, layer) => ({
      ...accu,
      [layer.slug]: layer.defaultVisibility
    }),
    {}
  );
}

const resolver = ({id, mapStyle, visibleLayerGroups = {}}) =>
  `${id}:${Object.keys(visibleLayerGroups)
    .filter(d => visibleLayerGroups[d])
    .sort()
    .join('-')}`;

/**
 * Edit preset map style to keep only visible layers
 *
 * @param {object} mapStyle - preset map style
 * @param {object} visibleLayerGroups - visible layers of top map
 * @returns {Immutable.Map} top map style
 */
export const editTopMapStyle = memoize(({id, mapStyle, visibleLayerGroups}) => {
  const visibleFilters = (mapStyle.layerGroups || [])
    .filter(lg => visibleLayerGroups[lg.slug])
    .map(lg => lg.filter);

  // if top map
  // keep only visible layers
  const filteredLayers = mapStyle.style.layers.filter(layer =>
    visibleFilters.some(match => match(layer))
  );

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
export const editBottomMapStyle = memoize(
  ({id, mapStyle, visibleLayerGroups}) => {
    const invisibleFilters = (mapStyle.layerGroups || [])
      .filter(lg => !visibleLayerGroups[lg.slug])
      .map(lg => lg.filter);

    // if bottom map
    // filter out invisible layers
    const filteredLayers = mapStyle.style.layers.filter(layer =>
      invisibleFilters.every(match => !match(layer))
    );

    return Immutable.fromJS({
      ...mapStyle.style,
      layers: filteredLayers
    });
  },
  resolver
);
