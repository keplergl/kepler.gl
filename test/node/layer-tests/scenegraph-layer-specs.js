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
import {KeplerGlLayers} from 'layers';
const {ScenegraphLayer} = KeplerGlLayers;

import {processCsvData} from 'processors/data-processor';

test('#ScenegraphLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test 3d layer'
        },
        test: layer => {
          t.ok(
            layer.config.dataId === 'smoothie',
            'ScenegraphLayer dataId should be correct'
          );
          t.ok(layer.type === '3D', 'type should be 3D');
          t.ok(
            layer.isAggregated === false,
            'ScenegraphLayer is not aggregated'
          );
        }
      }
    ]
  };

  testCreateCases(t, ScenegraphLayer, TEST_CASES.CREATE);
  t.end();
});

test('#ScenegraphLayer -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];

  const datasetWithNull = {
    ...preparedDatasetWithNull,
    filteredIndex,
    filteredIndexForDomain: [0, 2, 4, 5, 6, 7, 8, 9, 10]
  };

  const expectedLayerMeta = {
    bounds: [31.2148748, 29.9870074, 31.2590542, 30.0614122]
  };

  const TEST_CASES = [
    {
      name: 'Scenegraph gps point.1',
      layer: {
        type: '3D',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'gps 3d',
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
          data: [
            {
              data: rows[0]
            },
            {
              data: rows[2]
            },
            {
              data: rows[4]
            }
          ],
          getPosition: () => {}
        };

        t.deepEqual(
          Object.keys(layerData).sort(),
          Object.keys(expectedLayerData).sort(),
          'layerData should have 2 keys'
        );
        t.ok(
          typeof layerData.getPosition === 'function',
          'should have getPosition accessor as function'
        );
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [31.2590542, 29.9900937, 0],
          'getPosition should return correct lat lng'
        );
        t.deepEqual(
          layer.meta,
          expectedLayerMeta,
          'should format correct 3d layer meta'
        );
      }
    },
    {
      name: 'Scenegraph gps point.2 Data With Nulls',
      layer: {
        type: '3D',
        id: 'test_layer_2',
        config: {
          dataId,
          label: 'some 3d file',
          columns: {
            lat: 'gps_data.lat',
            lng: 'gps_data.lng'
          }
        }
      },
      datasets: {
        [dataId]: datasetWithNull
      },
      assert: result => {
        const {layerData} = result;

        const expectedLayerData = {
          data: [
            {
              data: rowsWithNull[0]
            },
            {
              data: rowsWithNull[4]
            }
          ],
          getPosition: () => {}
        };
        t.deepEqual(
          Object.keys(layerData).sort(),
          Object.keys(expectedLayerData).sort(),
          'layerData should have 2 keys'
        );
        t.ok(
          ['getPosition'].every(k => typeof layerData[k] === 'function'),
          'should have getPosition accessor as function'
        );
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [31.2590542, 29.9900937, 0],
          'getPosition should return correct lat lng'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, ScenegraphLayer, TEST_CASES);
  t.end();
});
