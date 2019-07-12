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
import GeojsonLayer, {defaultElevation} from 'layers/geojson-layer/geojson-layer';

import {
  updatedLayerSimplifiedShape,
  updatedLayerV2
} from 'test/fixtures/test-csv-data';
import {
  dataId,
  preparedGeoDataset,
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases,
  prepareGeojsonDataset
} from 'test/helpers/layer-utils';
import {updatedGeoJsonLayer} from 'test/fixtures/geojson';

test('#GeojsonLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test geojson layer'
        },
        test: layer => {
          t.ok(
            layer.config.dataId === 'smoothie',
            'geojsonLayer dataId should be correct'
          );
          t.ok(layer.type === 'geojson', 'type should be geojson');
          t.ok(layer.isAggregated === false, 'geojsonLayer is not aggregated');
        }
      }
    ]
  };

  testCreateCases(t, GeojsonLayer, TEST_CASES.CREATE);
  t.end();
});

test('#GeojsonLayer -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'Geojson wkt polygon.1',
      layer: {
        type: 'geojson',
        id: 'test_geojson_layer_1',
        config: {
          color: [1, 2, 3],
          dataId,
          label: 'some geometry file',
          columns: {
            geojson: 'simplified_shape_v2'
          }
        }
      },
      datasets: {
        [dataId]: {
          ...preparedGeoDataset,
          filteredIndex
        }
      },
      assert: result => {
        const {layerData, layer} = result;
        const expectedLayerData = {
          data: [
            updatedLayerV2.dataToFeature[2],
            updatedLayerV2.dataToFeature[4]
          ]
        };
        const expectedDataKeys = [
          'data',
          'getElevation',
          'getFillColor',
          'getFilterValue',
          'getLineColor',
          'getLineWidth',
          'getRadius'
        ];
        const expectedLayerMeta = updatedLayerV2.meta;
        const expectedDataToFeature = updatedLayerV2.dataToFeature;

        t.deepEqual(
          Object.keys(layerData).sort(),
          expectedDataKeys,
          'layerData should have 7 keys'
        );
        // data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        t.equal(
          typeof layerData.getElevation,
          'function',
          'getElevation should be a function'
        );
        t.equal(
          typeof layerData.getFillColor,
          'function',
          'getFillColor should be a function'
        );
        t.equal(
          typeof layerData.getFilterValue,
          'function',
          'getFilterValue should be a function'
        );
        t.equal(
          typeof layerData.getLineColor,
          'function',
          'getLineColor should be a function'
        );
        t.equal(
          typeof layerData.getLineWidth,
          'function',
          'getLineWidth should be a function'
        );
        t.equal(
          typeof layerData.getRadius,
          'function',
          'getRadius should be a function'
        );

        // meta
        t.deepEqual(
          layer.meta,
          expectedLayerMeta,
          'should format correct geojson layer meta'
        );
        // dataToFeature
        t.deepEqual(
          layer.dataToFeature,
          expectedDataToFeature,
          'should format correct geojson dataToFeature'
        );
      }
    },
    {
      name: 'Geojson wkt polygon.2',
      layer: {
        type: 'geojson',
        id: 'test_geojson_layer_2',
        config: {
          dataId,
          label: 'some geometry file',
          columns: {
            geojson: 'simplified_shape'
          }
        }
      },
      datasets: {
        [dataId]: {
          ...preparedGeoDataset,
          filteredIndex
        }
      },
      assert: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: [
            updatedLayerSimplifiedShape.dataToFeature[0],
            updatedLayerSimplifiedShape.dataToFeature[2],
            updatedLayerSimplifiedShape.dataToFeature[4]
          ]
        };
        const expectedDataKeys = [
          'data',
          'getElevation',
          'getFillColor',
          'getFilterValue',
          'getLineColor',
          'getLineWidth',
          'getRadius'
        ];
        const expectedLayerMeta = updatedLayerSimplifiedShape.meta;
        const expectedDataToFeature = updatedLayerSimplifiedShape.dataToFeature;

        t.deepEqual(
          Object.keys(layerData).sort(),
          expectedDataKeys,
          'layerData should have 7 keys'
        );
        // data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        t.equal(
          typeof layerData.getElevation,
          'function',
          'getElevation should be a function'
        );
        t.equal(
          typeof layerData.getFillColor,
          'function',
          'getFillColor should be a function'
        );
        t.equal(
          typeof layerData.getFilterValue,
          'function',
          'getFilterValue should be a function'
        );
        t.equal(
          typeof layerData.getLineColor,
          'function',
          'getLineColor should be a function'
        );
        t.equal(
          typeof layerData.getLineWidth,
          'function',
          'getLineWidth should be a function'
        );
        t.equal(
          typeof layerData.getRadius,
          'function',
          'getRadius should be a function'
        );
        // meta
        t.deepEqual(
          layer.meta,
          expectedLayerMeta,
          'should format correct geojson layerData'
        );
        // dataToFeature
        t.deepEqual(
          layer.dataToFeature,
          expectedDataToFeature,
          'should format correct geojson layerData'
        );
      }
    },
    {
      name: 'Geojson wkt polygon.3',
      layer: {
        type: 'geojson',
        id: 'test_geojson_layer_3',
        config: {
          dataId,
          label: 'some geometry file',
          columns: {
            geojson: '_geojson'
          }
        }
      },
      datasets: {
        [dataId]: {
          ...prepareGeojsonDataset,
          filteredIndex
        }
      },
      assert: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: [
            updatedGeoJsonLayer.dataToFeature[0],
            updatedGeoJsonLayer.dataToFeature[2],
            updatedGeoJsonLayer.dataToFeature[4]
          ]
        };
        const expectedDataKeys = [
          'data',
          'getElevation',
          'getFillColor',
          'getFilterValue',
          'getLineColor',
          'getLineWidth',
          'getRadius'
        ];
        const expectedLayerMeta = updatedGeoJsonLayer.meta;
        const expectedDataToFeature = updatedGeoJsonLayer.dataToFeature;

        t.deepEqual(
          Object.keys(layerData).sort(),
          expectedDataKeys,
          'layerData should have 7 keys'
        );
        // // data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        t.equal(
          typeof layerData.getElevation,
          'function',
          'getElevation should be a function'
        );
        t.equal(
          typeof layerData.getFillColor,
          'function',
          'getFillColor should be a function'
        );
        t.equal(
          typeof layerData.getFilterValue,
          'function',
          'getFilterValue should be a function'
        );
        t.equal(
          typeof layerData.getLineColor,
          'function',
          'getLineColor should be a function'
        );
        t.equal(
          typeof layerData.getLineWidth,
          'function',
          'getLineWidth should be a function'
        );
        t.equal(
          typeof layerData.getRadius,
          'function',
          'getRadius should be a function'
        );

        // meta
        t.deepEqual(
          layer.meta,
          expectedLayerMeta,
          'should format correct geojson layer meta'
        );
        // dataToFeature
        t.deepEqual(
          layer.dataToFeature,
          expectedDataToFeature,
          'should format correct geojson layer dataToFeature'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, GeojsonLayer, TEST_CASES);
  t.end();
});

test('#GeojsonLayer -> renderLayer', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'Test render geojson.1',
      layer: {
        id: 'test_layer_1',
        type: 'geojson',
        config: {
          dataId,
          color: [1, 2, 3],
          label: 'gps point',
          columns: {
            geojson: '_geojson'
          },
          visConfig: {
            strokeColor: [4, 5, 6]
          }
        }
      },
      datasets: {
        [dataId]: {
          ...prepareGeojsonDataset,
          filteredIndex
        }
      },

      assert: deckLayers => {
        const ids = [
          'test_layer_1',
          'test_layer_1-polygons-fill',
          'test_layer_1-polygons-stroke',
          'test_layer_1-points'
        ];
        t.deepEqual(
          deckLayers.map(l => l.id),
          ids,
          'Should render 4 deck layers'
        );
        // polygon fill attributes;
        const {attributes} = deckLayers[1].state.attributeManager;

        t.deepEqual(
          Object.keys(attributes).sort(),
          [
            'elevations',
            'fillColors',
            'indices',
            'instanceFilterValues',
            'lineColors',
            'pickingColors',
            'positions',
            'positions64xyLow',
            'vertexValid'
          ],
          'Should create 10 instance attributes'
        );
        const indices = attributes.indices.value.length;
        // test elevation
        t.deepEqual(
          attributes.elevations.value,
          new Float32Array(indices - 1).fill(defaultElevation),
          'Should have correct elevation'
        );

        const expectedFillColors = new Float32Array((indices - 1) * 4);
        const expectedLineColors = new Float32Array((indices - 1) * 4);

        for (let i = 0; i < indices - 1; i++) {
          expectedFillColors[i * 4] = 1;
          expectedFillColors[i * 4 + 1] = 2;
          expectedFillColors[i * 4 + 2] = 3;
          expectedFillColors[i * 4 + 3] = 255;
          expectedLineColors[i * 4] = 4;
          expectedLineColors[i * 4 + 1] = 5;
          expectedLineColors[i * 4 + 2] = 6;
          expectedLineColors[i * 4 + 3] = 255;
        }
        // test fillColors
        t.deepEqual(
          attributes.fillColors.value,
          expectedFillColors,
          'Should have correct fillColors'
        );
        // test instanceFilterValues
        const expectedFilterValues = new Float32Array([
          11, 0, 0, 0,
          11, 0, 0, 0,
          11, 0, 0, 0,
          11, 0, 0, 0,
          11, 0, 0, 0,
          11, 0, 0, 0,
          20, 0, 0, 0,
          20, 0, 0, 0,
          20, 0, 0, 0,
          20, 0, 0, 0,
          Number.MIN_SAFE_INTEGER, 0, 0, 0,
          Number.MIN_SAFE_INTEGER, 0, 0, 0,
          Number.MIN_SAFE_INTEGER, 0, 0, 0,
          Number.MIN_SAFE_INTEGER, 0, 0, 0
        ]);
        t.deepEqual(
          attributes.instanceFilterValues.value,
          expectedFilterValues,
          'Should have correct instanceFilterValues'
        );
        // test lineColors
        t.deepEqual(
          attributes.lineColors.value,
          expectedLineColors,
          'Should have correct lineColors'
        );
        // test positions
        t.deepEqual(
          attributes.positions.value.length,
          42,
          'Should have 42 positions'
        );
      }
    }
  ];

  testRenderLayerCases(t, GeojsonLayer, TEST_CASES);
  t.end();
});
