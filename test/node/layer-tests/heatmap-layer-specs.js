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
  // const {rows} = processCsvData(csvData);
  const filteredIndex = [0, 2, 4];
  const columns = {
    lat: 'gps_data.lat',
    lng: 'gps_data.lng'
  };
  const expectedConfig = {
    type: 'heatmap',
    id: 'assign_from_layer',
    source: 'heatmap-1-2',
    layout: {visibility: 'visible'},
    maxzoom: 18,
    paint: {
      'heatmap-weight': 1,
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 18, 3],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(0,0,0,0)',
        0.14285714285714285,
        'rgb(90,24,70)',
        0.2857142857142857,
        'rgb(144,12,63)',
        0.42857142857142855,
        'rgb(199,0,57)',
        0.5714285714285714,
        'rgb(227,97,28)',
        0.7142857142857143,
        'rgb(241,146,14)',
        0.8571428571428571,
        'rgb(255,195,0)'
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 18, 20],
      'heatmap-opacity': 0.8
    }
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
      test: result => {
        const {layerData, layer} = result;

        const expectedLayerMeta = {
          bounds: [31.2148748, 29.9870074, 31.2590542, 30.0614122]
        };
        const expectedLayerData = {
          columns,
          config: expectedConfig,
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2590542, 29.9900937]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2461142, 29.9927699]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2312742, 29.9907261]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2175827, 29.9870074]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2154899, 29.9923041]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2149361, 29.9968249]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2164035, 30.0037217]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2179346, 30.0116207]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2179556, 30.0208925]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2178842, 30.0218999]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2179138, 30.0229344]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2179415, 30.0264237]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2181809, 30.0292134]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2193991, 30.034391]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2181803, 30.0352752]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2195902, 30.0395918]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2174421, 30.0497387]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2165983, 30.0538936]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2148748, 30.060911]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2212278, 30.060334]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2288985, 30.0554663]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2187021, 30.0614122]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2191059, 30.0612697]}
              },
              {
                type: 'Feature',
                properties: {},
                geometry: {type: 'Point', coordinates: [31.2194728, 30.0610977]}
              }
            ]
          },
          weightField: null,
          getPosition: () => {}
        };

        t.deepEqual(
          Object.keys(layerData).sort(),
          Object.keys(expectedLayerData).sort(),
          'lheatmap ayerData should have correct keys'
        );

        // test data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct heatmap layerData.data'
        );

        // test columns,
        t.deepEqual(
          layerData.columns,
          expectedLayerData.columns,
          'should format correct heatmap layerData.columns'
        );
        expectedLayerData.config.id = layer.id;
        // test config
        t.deepEqual(
          layerData.config,
          expectedLayerData.config,
          'should format correct heatmap layerData.config'
        );
        // test weightField
        t.deepEqual(
          layerData.weightField,
          expectedLayerData.weightField,
          'should format correct heatmap weightField'
        );
        // test layer.meta
        t.deepEqual(
          layer.meta,
          expectedLayerMeta,
          'should format correct heatmap layer.meta'
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
