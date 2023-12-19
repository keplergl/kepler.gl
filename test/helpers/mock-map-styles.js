// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {BASE_MAP_COLOR_MODES, DEFAULT_LAYER_GROUPS} from '@kepler.gl/constants';

/** @type {import('@kepler.gl/reducers').BaseMapStyle} */
export const MOCK_MAP_STYLE = {
  id: 'dark-matter',
  label: 'DarkMatter',
  url: 'mapbox://styles/xxxxx/abcdefg',
  icon: 'https://my.icon.net/kepler.gl/test/taro.png',
  layerGroups: DEFAULT_LAYER_GROUPS,
  colorMode: BASE_MAP_COLOR_MODES.DARK,
  complimentaryStyleId: 'positron',
  style: {
    version: 8,
    name: 'Dark Matter',
    metadata: {'maputnik:renderer': 'mbgljs'},
    sources: {
      carto: {
        type: 'vector',
        url: 'https://tiles.basemaps.cartocdn.com/vector/carto.streets/v1/tiles.json'
      }
    },
    sprite: 'https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/sprite',
    glyphs: 'https://tiles.basemaps.cartocdn.com/fonts/{fontstack}/{range}.pbf',
    layers: [
      {
        id: 'background',
        type: 'background',
        layout: {visibility: 'visible'},
        paint: {'background-color': '#0e0e0e', 'background-opacity': 1}
      },

      {
        id: 'road_path',
        type: 'line',
        source: 'carto',
        'source-layer': 'transportation'
      },
      {
        id: 'roadname_minor',
        minzoom: 13,
        source: 'carto',
        type: 'symbol',
        'source-layer': 'transportation_name'
      },
      {
        type: 'symbol',
        source: 'composite',
        id: 'country-label-sm',
        'source-layer': 'country_label'
      }
    ],
    id: 'voyager',
    owner: 'Carto'
  }
};

/** @type {import('@kepler.gl/reducers').BaseMapStyle} */
export const MOCK_MAP_STYLE_LIGHT = {
  id: 'positron',
  label: 'Positron',
  url: 'mapbox://styles/xxxxx/hijklmn',
  icon: 'https://my.icon.net/kepler.gl/test/blue.png',
  layerGroups: DEFAULT_LAYER_GROUPS,
  colorMode: BASE_MAP_COLOR_MODES.LIGHT,
  complimentaryStyleId: 'dark-matter',
  style: {
    version: 8,
    name: 'Positron',
    metadata: {},
    sources: {
      carto: {
        type: 'vector',
        url: 'https://tiles.basemaps.cartocdn.com/vector/carto.streets/v1/tiles.json'
      }
    },
    sprite: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/sprite',
    glyphs: 'https://tiles.basemaps.cartocdn.com/fonts/{fontstack}/{range}.pbf',
    layers: [
      {
        id: 'background',
        type: 'background',
        layout: {visibility: 'visible'},
        paint: {'background-color': '#ff0000', 'background-opacity': 1}
      },

      {
        id: 'road_path',
        type: 'line',
        source: 'carto',
        'source-layer': 'transportation'
      },
      {
        id: 'roadname_minor',
        minzoom: 13,
        source: 'carto',
        type: 'symbol',
        'source-layer': 'transportation_name'
      },
      {
        type: 'symbol',
        source: 'composite',
        id: 'admin-label-lg',
        'source-layer': 'country_label'
      }
    ],
    id: 'voyager',
    owner: 'Carto'
  }
};

/** @type {import('@kepler.gl/reducers').MapStyles} */
export const MOCK_MAP_STYLES = {
  [MOCK_MAP_STYLE.id]: MOCK_MAP_STYLE,
  [MOCK_MAP_STYLE_LIGHT.id]: MOCK_MAP_STYLE_LIGHT
};
