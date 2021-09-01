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

export const MOCK_MAP_STYLE = {
  id: 'dark',
  label: 'Dark',
  url: 'mapbox://styles/xxxxx/abcdefg',
  icon: 'https://my.icon.net/kepler.gl/test/taro.png',
  layerGroups: [
    {
      slug: 'water',
      defaultVisibility: true
    },
    {
      slug: 'land',
      defaultVisibility: true
    }
  ],
  style: {
    version: 8,
    name: 'Mock-Map-Style',
    metadata: {},
    center: [-73.96109142750214, 40.74028310359776],
    zoom: 12.624759221889015,
    bearing: 23.936999544510627,
    pitch: 0,
    light: {
      anchor: 'viewport'
    },
    sources: {
      composite: {
        url: 'mapbox://mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7,eklimcz.00zz64mq',
        type: 'vector'
      }
    },
    sprite: 'mapbox://sprites',
    glyphs: 'mapbox://fonts',
    layers: [
      {
        id: 'background',
        type: 'background',
        layout: {},
        paint: {
          'background-color': '#09101D'
        },
        interactive: true
      },
      {
        id: 'water',
        type: 'fill',
        source: 'composite',
        'source-layer': 'water',
        layout: {},
        paint: {
          'fill-color': '#112330'
        },
        interactive: true
      }
    ]
  }
};
