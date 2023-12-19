// Copyright (c) 2023 Uber Technologies, Inc.
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
