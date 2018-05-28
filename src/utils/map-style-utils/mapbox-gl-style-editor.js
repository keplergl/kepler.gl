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
import {
  DEFAULT_LAYER_GROUPS,
  RESOLUTIONS,
  RESOLUTION_OPTIONS
} from 'constants/default-settings';

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

    // console.log(filteredLayers)
    return Immutable.fromJS({
      ...mapStyle.style,
      layers: filteredLayers
    });
  },
  resolver
);

const mapUrlRg = /^mapbox:\/\/styles\/[-a-z0-9]{2,256}\/[-a-z0-9]{2,256}/;
const httpRg = /^(?=(http:|https:))/;
const mapboxStyleApiUrl = 'https://api.mapbox.com/styles/v1/';

// valid style url
// mapbox://styles/uberdata/cjfyl03kp1tul2smf5v2tbdd4
// lowercase letters, numbers and dashes only.
export function isValidStyleUrl(url) {
  return typeof url === 'string' && Boolean(url.match(mapUrlRg) || url.match(httpRg));
}

export function getStyleDownloadUrl(styleUrl, accessToken) {
  if (styleUrl.startsWith('http')) {
    return styleUrl;
  }

  // mapbox://styles/jckr/cjhcl0lxv13di2rpfoytdbdyj
  if (styleUrl.startsWith('mapbox://styles')) {
    const styleId = styleUrl.replace('mapbox://styles/', '');

    // https://api.mapbox.com/styles/v1/heshan0131/cjg1bfumo1cwm2rlrjxkinfgw?pluginName=Keplergl&access_token=<token>
    return `${mapboxStyleApiUrl}${styleId}?pluginName=Keplergl&access_token=${accessToken}`
  }

  // style url not recognized
  return null;
}

export function scaleMapStyleByResolution(mapboxStyle, resolution) {
  const labelLayerGroup = DEFAULT_LAYER_GROUPS.find(lg => lg.slug === 'label');
  const {filter: labelLayerFilter} = labelLayerGroup;

  if (resolution !== RESOLUTIONS.ONE_X && mapboxStyle) {
    const {scale, zoomOffset} = RESOLUTION_OPTIONS.find(
      r => r.id === resolution
    );
    const copyStyle = mapboxStyle.toJS();
    (copyStyle.layers || []).forEach(d => {
      // edit minzoom and maxzoom
      if (d.maxzoom) {
        d.maxzoom += zoomOffset;
      }

      if (d.minzoom) {
        d.minzoom += zoomOffset;
      }

      // edit text size
      if (labelLayerFilter(d)) {
        if (
          d.layout &&
          d.layout['text-size'] &&
          Array.isArray(d.layout['text-size'].stops)
        ) {
          d.layout['text-size'].stops.forEach(stop => {
            // zoom
            stop[0] += Math.log2(scale);
            // size
            stop[1] *= scale;
          });
        }
      }
    });

    return Immutable.fromJS(copyStyle);
  }

  return mapboxStyle;
}

/**
 * When switch to a new style, try to keep current layer group visibility
 * by merging default and current
 * @param {object} defaultLayerGroup
 * @param {object} currentLayerGroup
 * @return {object} mergedLayerGroups
 */
export function mergeLayerGroupVisibility(defaultLayerGroup, currentLayerGroup) {
  return Object.keys(currentLayerGroup)
    .reduce((accu, key) => ({
      ...accu,
      ...(defaultLayerGroup.hasOwnProperty(key) ? {[key]: currentLayerGroup[key]} : {})
    }), defaultLayerGroup);
}

