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

import memoize from 'lodash.memoize';
import clondDeep from 'lodash.clonedeep';
import {DEFAULT_LAYER_GROUPS, DEFAULT_MAPBOX_API_URL} from 'constants/default-settings';

const mapUrlRg = /^mapbox:\/\/styles\/[-a-z0-9]{2,256}\/[-a-z0-9]{2,256}/;
const httpRg = /^(?=(http:|https:))/;

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
 * @param {Object} mapStyle - preset map style
 * @param {Object} visibleLayerGroups - visible layers of top map
 * @returns {Object} top map style
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

  return {
    ...mapStyle.style,
    layers: filteredLayers
  };
}, resolver);

/**
 * Edit preset map style to filter out invisible layers
 *
 * @param {Object} mapStyle - preset map style
 * @param {Object} visibleLayerGroups - visible layers of bottom map
 * @returns {Object} bottom map style
 */
export const editBottomMapStyle = memoize(({id, mapStyle, visibleLayerGroups}) => {
  const invisibleFilters = (mapStyle.layerGroups || [])
    .filter(lg => !visibleLayerGroups[lg.slug])
    .map(lg => lg.filter);

  // if bottom map
  // filter out invisible layers
  const filteredLayers = mapStyle.style.layers.filter(layer =>
    invisibleFilters.every(match => !match(layer))
  );

  return {
    ...mapStyle.style,
    layers: filteredLayers
  };
}, resolver);

// valid style url
// mapbox://styles/uberdata/cjfyl03kp1tul2smf5v2tbdd4
// lowercase letters, numbers and dashes only.
export function isValidStyleUrl(url) {
  return typeof url === 'string' && Boolean(url.match(mapUrlRg) || url.match(httpRg));
}

export function getStyleDownloadUrl(styleUrl, accessToken, mapboxApiUrl) {
  if (styleUrl.startsWith('http')) {
    return styleUrl;
  }

  // mapbox://styles/jckr/cjhcl0lxv13di2rpfoytdbdyj
  if (styleUrl.startsWith('mapbox://styles')) {
    const styleId = styleUrl.replace('mapbox://styles/', '');

    // https://api.mapbox.com/styles/v1/heshan0131/cjg1bfumo1cwm2rlrjxkinfgw?pluginName=Keplergl&access_token=<token>
    return `${mapboxApiUrl ||
      DEFAULT_MAPBOX_API_URL}/styles/v1/${styleId}?pluginName=Keplergl&access_token=${accessToken}`;
  }

  // style url not recognized
  return null;
}

/**
 * Generate static map image from style Url to be used as icon
 * @param {Object} param
 * @param {string} param.styleUrl
 * @param {string} param.mapboxApiAccessToken
 * @param {string} param.mapboxApiUrl
 * @param {Object} param.mapState
 * @param {number} param.mapW
 * @param {number} param.mapH
 */
export function getStyleImageIcon({
  styleUrl,
  mapboxApiAccessToken,
  mapboxApiUrl = DEFAULT_MAPBOX_API_URL,
  mapState = {
    longitude: -122.3391,
    latitude: 37.7922,
    zoom: 9
  },
  mapW = 400,
  mapH = 300
}) {
  const styleId = styleUrl.replace('mapbox://styles/', '');

  return (
    `${mapboxApiUrl}/styles/v1/${styleId}/static/` +
    `${mapState.longitude},${mapState.latitude},${mapState.zoom},0,0/` +
    `${mapW}x${mapH}` +
    `?access_token=${mapboxApiAccessToken}&logo=false&attribution=false`
  );
}

export function scaleMapStyleByResolution(mapboxStyle, scale) {
  if (scale !== 1 && mapboxStyle) {
    const labelLayerGroup = DEFAULT_LAYER_GROUPS.find(lg => lg.slug === 'label');
    // @ts-ignore
    const {filter: labelLayerFilter} = labelLayerGroup;
    const zoomOffset = Math.log2(scale);

    const copyStyle = clondDeep(mapboxStyle);
    (copyStyle.layers || []).forEach(d => {
      // edit minzoom and maxzoom
      if (d.maxzoom) {
        d.maxzoom = Math.max(d.maxzoom + zoomOffset, 1);
      }

      if (d.minzoom) {
        d.minzoom = Math.max(d.minzoom + zoomOffset, 1);
      }

      // edit text size
      if (labelLayerFilter(d)) {
        if (d.layout && d.layout['text-size'] && Array.isArray(d.layout['text-size'].stops)) {
          d.layout['text-size'].stops.forEach(stop => {
            // zoom
            stop[0] = Math.max(stop[0] + zoomOffset, 1);
            // size
            stop[1] *= scale;
          });
        }
      }
    });

    return copyStyle;
  }

  return mapboxStyle;
}

/**
 * When switch to a new style, try to keep current layer group visibility
 * by merging default and current
 * @param {Object} defaultLayerGroup
 * @param {Object} currentLayerGroup
 * @return {Object} mergedLayerGroups
 */
export function mergeLayerGroupVisibility(defaultLayerGroup, currentLayerGroup) {
  return Object.keys(defaultLayerGroup).reduce(
    (accu, key) => ({
      ...accu,
      ...(currentLayerGroup.hasOwnProperty(key) ? {[key]: currentLayerGroup[key]} : {})
    }),
    defaultLayerGroup
  );
}
