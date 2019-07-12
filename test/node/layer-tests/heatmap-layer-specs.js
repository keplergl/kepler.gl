// Copyright (c) 2019 Uber Technologies, Inc.
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
  testFormatLayerDataCases,
  testRenderLayerCases,
  preparedDataset,
  preparedDatasetWithNull,
  dataId,
  rows,
  rowsWithNull,
  fieldsWithNull
} from 'test/helpers/layer-utils';
import {processCsvData} from 'processors/data-processor';
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
            layer.config.visConfig.radius,
            20,
            'Heatmap default radius should be 20'
          );
        }
      }
    ]
  };

  testCreateCases(t, HeatmapLayer, TEST_CASES.CREATE);
  t.end();
});

test('#Heatmaplayer -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];
  const columns = {
    lat: 'gps_data.lat',
    lng: 'gps_data.lng'
  };
  const TEST_CASES = [
    {
      name: 'Heatmap gps point.1',
      layer: {
        type: 'heatmap',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'mapbox heatmap',
          isVisible: true,
          columns
        }
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
      assert: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          columns,
          config: {
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
                0,
                1,
                18,
                3
              ],
              'heatmap-color': ['interpolate', ['linear'], ['heatmap-density']],
              'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                2,
                18,
                20 // radius
              ],
              'heatmap-opacity': 0.8
            }
          },
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: [31.2590542, 29.9900937, 0]
                }
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: [31.2312742, 29.9907261, 0]
                }
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: [31.2154899, 29.9923041, 0]
                }
              }
            ]
          },
          weightField: null
        };

        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, HeatmapLayer, TEST_CASES);
  t.end();
});

// todo: make sure data is created correctly
// todo: define heatmap weight based on property
// todo: make sure data is recomputed when weight property is changed
// todo: make sure data is not recomputed if things don't change
// todo: make sure config is the same when things don't change
