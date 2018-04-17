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

import test from 'tape';
import {
  testCreateCases,
  testFormatLayerDataCases
} from 'test/helpers/layer-utils';
import {processCsvData} from "processors/data-processor";
import csvData from 'test/fixtures/test-csv-data';

import HeatmapLayer from 'layers/heatmap-layer/heatmap-layer';

test('#HeatmapLayer -> contructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'heatmap',
          isVisible: true,
          label: 'test heatmap layer'
        },
        test: layer => {
          // test constructor
          t.equal(
            layer.config.visConfig.weight,
            1,
            'Heatmap default layer weight should be 1'
          )
        }
      }
    ]
  };

  testCreateCases(t, HeatmapLayer, TEST_CASES.CREATE);
  t.end()
});


test('#Heatmaplayer -> formatLayerData', t => {
  const {rows} = processCsvData(csvData);
  const filteredIndex = Array(rows.length).fill().map((_, index) => index);
  const data = rows;
  const columns = {
    lat: {
      name: 'gps_data.lat',
      fieldIdx: 1
    },
    lng: {
      name: 'gps_data.lng',
      fieldIdx: 2
    }
  };
  const TEST_CASES = [
    {
      props: {
        dataId: 'heatmap',
        label: 'mapbox heatmap',
        isVisible: true,
        columns
      },
      data: [data, rows, filteredIndex, undefined],
      test: result => {
        const {layerData,  layer} = result;
        // log(layer);
        // log(layerData);

        const expectedLayerData = {
          columns,
          config:  {
            type: 'heatmap',
            source: 'heatmap',
            layout: {
              visibility: 'visible'
            },
            maxzoom: 18,
            paint: {
              'heatmap-weight': 1,
              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 1,
                18, 3
              ],
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density']
              ],
              'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 2,
                18, 20 // radius
              ],
              'heatmap-opacity': 0.8
            }
          },
          data: {
            type: 'FeatureCollection',
            features: [
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2590542, 29.9900937, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2461142, 29.9927699, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2312742, 29.9907261, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2175827, 29.9870074, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2154899, 29.9923041, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2149361, 29.9968249, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2164035, 30.0037217, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2179346, 30.0116207, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2179556, 30.0208925, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2178842, 30.0218999, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2179138, 30.0229344, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2179415, 30.0264237, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2181809, 30.0292134, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2193991, 30.034391, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2181803, 30.0352752, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2195902, 30.0395918, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2174421, 30.0497387, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2165983, 30.0538936, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2148748, 30.060911, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2212278, 30.060334, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2288985, 30.0554663, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2187021, 30.0614122, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2191059, 30.0612697, 0 ] } },
              { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [ 31.2194728, 30.0610977, 0 ] } }
            ]
          },
          weightField: null
        };

        t.deepEqual(layerData.data, expectedLayerData.data,
          "should format correct geojson layerData")
      }
    }
  ];

  testFormatLayerDataCases(t, HeatmapLayer, TEST_CASES);
  t.end()
});

// todo: make sure data is created correctly
// todo: define heatmap weight based on property
// todo: make sure data is recomputed when weight property is changed
// todo: make sure data is not recomputed if things don't change
// todo: make sure config is the same when things don't change
