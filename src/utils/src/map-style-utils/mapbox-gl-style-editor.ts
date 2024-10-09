// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import memoize from 'lodash.memoize';
import clondDeep from 'lodash.clonedeep';
import {
  DEFAULT_LAYER_GROUPS,
  DEFAULT_MAPBOX_API_URL,
  NO_MAP_ID,
  EMPTY_MAPBOX_STYLE
} from '@kepler.gl/constants';
import {BaseMapStyle, LayerGroup, MapState} from '@kepler.gl/types';

export function getDefaultLayerGroupVisibility({layerGroups = []}: {layerGroups: LayerGroup[]}) {
  return layerGroups.reduce(
    (accu, layer) => ({
      ...accu,
      [layer.slug]: layer.defaultVisibility
    }),
    {}
  );
}

const resolver = ({
  id,
  visibleLayerGroups = {}
}: {
  id?: string;
  mapStyle: BaseMapStyle;
  visibleLayerGroups: {[id: string]: LayerGroup | boolean} | false;
}) =>
  `${id}:${Object.keys(visibleLayerGroups)
    .filter(d => visibleLayerGroups[d])
    .sort()
    .join('-')}`;

/**
 * Edit preset map style to keep only visible layers
 *
 * @param mapStyle - preset map style
 * @param visibleLayerGroups - visible layers of top map
 * @returns top map style
 */
export const editTopMapStyle = memoize(
  ({
    mapStyle,
    visibleLayerGroups
  }: {
    id?: string;
    mapStyle: BaseMapStyle;
    visibleLayerGroups: {[id: string]: LayerGroup | boolean} | false;
  }) => {
    const visibleFilters = (mapStyle.layerGroups || [])
      .filter(lg => visibleLayerGroups[lg.slug])
      .map(lg => lg.filter);

    // if top map
    // keep only visible layers
    // @ts-expect-error
    const filteredLayers = mapStyle.style.layers.filter(layer =>
      visibleFilters.some(match => match(layer))
    );

    return {
      ...mapStyle.style,
      layers: filteredLayers
    };
  },
  resolver
);

/**
 * Edit preset map style to filter out invisible layers
 *
 * @param {Object} mapStyle - preset map style
 * @param {Object} visibleLayerGroups - visible layers of bottom map
 * @returns {Object} bottom map style
 */
export const editBottomMapStyle = memoize(({id, mapStyle, visibleLayerGroups}) => {
  if (id === NO_MAP_ID) {
    return EMPTY_MAPBOX_STYLE;
  }

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

export function getStyleDownloadUrl(styleUrl, accessToken, mapboxApiUrl) {
  if (styleUrl.startsWith('http')) {
    return styleUrl;
  }

  // mapbox://styles/jckr/cjhcl0lxv13di2rpfoytdbdyj
  if (styleUrl.startsWith('mapbox://styles')) {
    const styleId = styleUrl.replace('mapbox://styles/', '');

    // https://api.mapbox.com/styles/v1/heshan0131/cjg1bfumo1cwm2rlrjxkinfgw?pluginName=Keplergl&access_token=<token>
    return `${
      mapboxApiUrl || DEFAULT_MAPBOX_API_URL
    }/styles/v1/${styleId}?pluginName=Keplergl&access_token=${accessToken}`;
  }

  // style url not recognized
  return null;
}

/**
 * Generate static map image from style Url to be used as icon
 * @param param
 * @param param.styleUrl
 * @param param.mapboxApiAccessToken
 * @param param.mapboxApiUrl
 * @param param.mapState
 * @param param.mapW
 * @param param.mapH
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
}: {
  styleUrl: string;
  mapboxApiAccessToken: string;
  mapboxApiUrl?: string;
  mapState?: Partial<MapState>;
  mapW?: number;
  mapH?: number;
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
      ...(Object.prototype.hasOwnProperty.call(currentLayerGroup, key)
        ? {[key]: currentLayerGroup[key]}
        : {})
    }),
    defaultLayerGroup
  );
}
