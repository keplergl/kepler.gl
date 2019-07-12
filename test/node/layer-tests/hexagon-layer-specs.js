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
  preparedDataset,
  preparedDatasetWithNull,
  dataId,
  rows,
  rowsWithNull,
  fieldsWithNull
} from 'test/helpers/layer-utils';

import HexagonLayer from 'layers/hexagon-layer/hexagon-layer';

test('#HexagonLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test hexagon layer'
        },
        test: layer => {
          t.ok(
            layer.config.dataId === 'smoothie',
            'HexagonLayer dataId should be correct'
          );
          t.ok(layer.type === 'hexagon', 'type should be hexagon');
          t.ok(layer.isAggregated === true, 'HexagonLayer is aggregated');
        }
      }
    ]
  };

  testCreateCases(t, HexagonLayer, TEST_CASES.CREATE);
  t.end();
});

test('#HexagonLayer -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];
  const datasetWithNull = {
    ...preparedDatasetWithNull,
    filteredIndex,
    filteredIndexForDomain: [0, 2, 4, 5, 6, 7, 8, 9, 10]
  };

  const lightSettingMeta = {
    ambientRatio: 0.4,
    diffuseRatio: 0.6,
    specularRatio: 0.3,
    lightsStrength: [0.9, 0, 0.8, 0],
    numberOfLights: 2
  };
  const expectedLayerMeta = {
    bounds: [31.2148748, 29.9870074, 31.2590542, 30.0614122],
    lightSettings: {
      lightsPosition: [
        31.2148748,
        29.9870074,
        8000,
        31.2590542,
        30.0614122,
        8000
      ],
      ...lightSettingMeta
    }
  };

  const expectedLayerMetaNull = {
    bounds: [31.2149361, 29.9870074, 31.2590542, 30.0292134],
    lightSettings: {
      lightsPosition: [
        31.2149361,
        29.9870074,
        8000,
        31.2590542,
        30.0292134,
        8000
      ],
      ...lightSettingMeta
    }
  };

  const TEST_CASES = [
    {
      name: 'hexagon layer gps point.1',
      layer: {
        type: 'hexagon',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'some geometry file',
          columns: {
            lat: 'gps_data.lat',
            lng: 'gps_data.lng'
          }
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
          data: [rows[0], rows[2], rows[4]],
          getPosition: () => {}
        };

        t.deepEqual(
          Object.keys(layerData),
          ['data', 'getPosition'],
          'layerData should have 2 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct hexagon layerData'
        );
        t.ok(
          typeof layerData.getPosition === 'function',
          'should have getPosition'
        );
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [31.2590542, 29.9900937],
          'getPosition should return correct lat lng'
        );
        t.deepEqual(
          layer.meta,
          expectedLayerMeta,
          'should format correct grid layerData'
        );
      }
    },
    {
      name: 'hexagon layer gps point.2 Data With Nulls',
      layer: {
        type: 'hexagon',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'some geometry file',
          columns: {
            lat: 'gps_data.lat',
            lng: 'gps_data.lng'
          },
          // color by id(int)
          colorField: fieldsWithNull[6]
        }
      },
      datasets: {
        [dataId]: datasetWithNull
      },
      assert: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: [rowsWithNull[0], rowsWithNull[2], rowsWithNull[4]],
          getPosition: () => {},
          getColorValue: () => {}
        };

        t.deepEqual(
          Object.keys(layerData),
          ['data', 'getPosition', 'getColorValue'],
          'layerData should have 2 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should not filter out nulls, format correct hexagon layerData'
        );
        t.ok(
          typeof layerData.getPosition === 'function',
          'should have getPosition'
        );
        t.ok(
          typeof layerData.getColorValue === 'function',
          'should have getColorValue'
        );
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [31.2590542, 29.9900937],
          'getPosition should return correct lat lng'
        );
        t.deepEqual(
          layer.meta,
          expectedLayerMetaNull,
          'should format correct grid layerData'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, HexagonLayer, TEST_CASES);
  t.end();
});
