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
  testFormatLayerDataCases
} from 'test/helpers/layer-utils';
import csvData, {testFields} from 'test/fixtures/test-csv-data';
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
  const {rows} = processCsvData(csvData);

  const filteredIndex = [0, 2, 4];
  const data = [rows[0], rows[2], rows[4]];

  const dataWithNull = [[null, null, '12']].concat(data);
  const allDataWithNull = [[null, null, '12']].concat(rows);

  const expectedLayerMeta = {
    bounds: [31.2148748, 29.9870074, 31.2590542, 30.0614122]
  };
  const dataset = {
    data: dataWithNull,
    allData: allDataWithNull,
    filteredIndexForDomain: [0, 2, 4, 5, 6, 7, 8, 9, 10]
  };

  const TEST_CASES = [
    {
      props: {
        dataId: '0dj3h',
        label: 'gps 3d',
        columns: {
          lat: {
            value: 'gps_data.lat',
            fieldIdx: 1
          },
          lng: {
            value: 'gps_data.lng',
            fieldIdx: 2
          }
        }
      },
      data: [{'0dj3h': {allData: rows, filteredIndex}}, undefined],
      test: result => {
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
      props: {
        dataId: '0dj3h',
        label: 'some 3d file',
        columns: {
          lat: {
            value: 'gps_data.lat',
            fieldIdx: 1
          },
          lng: {
            value: 'gps_data.lng',
            fieldIdx: 2
          }
        }
      },
      updates: [
        // update layer config to an integer field
        {method: 'updateLayerConfig', args: [{colorField: testFields[6]}]},
        {
          method: 'updateLayerVisualChannel',
          args: [dataset, 'color']
        },
        {method: 'updateLayerConfig', args: [{sizeField: testFields[6]}]},
        {
          method: 'updateLayerVisualChannel',
          args: [dataset, 'size']
        },
        {
          method: 'updateLayerVisConfig',
          args: [{fixedRadius: true}]
        }
      ],
      data: [{'0dj3h': {allData: allDataWithNull, filteredIndex}}, undefined],
      test: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: [
            {
              data: rows[1]
            },
            {
              data: rows[3]
            }
          ],
          getPosition: () => {}
        };
        t.deepEqual(
          layer.config.colorDomain,
          [2, 4, 5, 222, 345, 12124],
          'should update layer color domain'
        );
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
          [31.2461142, 29.9927699, 0],
          'getPosition should return correct lat lng'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, ScenegraphLayer, TEST_CASES);
  t.end();
});
