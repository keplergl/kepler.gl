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
import csvData, {testFields} from 'test/fixtures/test-csv-data';

import {PointLayer} from 'keplergl-layers';
import {processCsvData} from 'processors/data-processor';

test('#PointLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test point layer'
        },
        test: layer => {
          t.ok(
            layer.config.dataId === 'smoothie',
            'PointLayer dataId should be correct'
          );
          t.ok(layer.type === 'point', 'type should be grid');
          t.ok(layer.isAggregated === false, 'PointLayer is not aggregated');
        }
      }
    ]
  };

  testCreateCases(t, PointLayer, TEST_CASES.CREATE);
  t.end();
});

test('#PointLayer -> formatLayerData', async t => {
  const {rows} = await processCsvData(csvData);

  const filteredIndex = [0, 2, 4];
  const data = [rows[0], rows[2], rows[4]];

  const dataWithNull = [[null, null, '12']].concat(data);
  const allDataWithNull = [[null, null, '12']].concat(rows);

  const expectedLayerMeta = {
    bounds: [31.2148748, 29.9870074, 31.2590542, 30.0614122]
  };

  const TEST_CASES = [
    {
      props: {
        dataId: '0dj3h',
        label: 'gps point',
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
      data: [data, rows, filteredIndex, undefined],
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
          getPosition: () => {},
          getColor: () => {},
          getRadius: () => {}
        };

        t.deepEqual(
          Object.keys(layerData),
          ['data', 'getPosition', 'getColor', 'getRadius'],
          'layerData should have 3 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct grid layerData'
        );
        t.ok(
          ['getPosition', 'getColor', 'getRadius'].every(
            k => typeof layerData[k] === 'function'
          ),
          'should have getPosition, getColor, getRadius accessor as function'
        );
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [31.2590542, 29.9900937, 0],
          'getPosition should return correct lat lng'
        );
        t.deepEqual(
          layer.meta,
          expectedLayerMeta,
          'should format correct point layer meta'
        );
      }
    },
    {
      props: {
        dataId: '0dj3h',
        label: 'some point file',
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
        {method: 'updateLayerConfig', args: [{colorField: testFields[6]}]},
        {
          method: 'updateLayerVisualChannel',
          args: [{data: dataWithNull, allData: allDataWithNull}, 'color']
        },
        {method: 'updateLayerConfig', args: [{sizeField: testFields[6]}]},
        {
          method: 'updateLayerVisualChannel',
          args: [{data: dataWithNull, allData: allDataWithNull}, 'size']
        },
        {
          method: 'updateLayerVisConfig',
          args: [{fixedRadius: true}]
        }
      ],
      data: [dataWithNull, allDataWithNull, filteredIndex, undefined],
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
          getPosition: () => {},
          getColor: () => {},
          getRadius: () => {}
        };
        t.deepEqual(
          layer.config.colorDomain,
          [1, 3, 5],
          'should update layer color domain'
        );
        t.deepEqual(
          Object.keys(layerData),
          ['data', 'getPosition', 'getColor', 'getRadius'],
          'layerData should have 4 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should filter out nulls, format correct point layerData'
        );
        t.ok(
          ['getPosition', 'getColor', 'getRadius'].every(
            k => typeof layerData[k] === 'function'
          ),
          'should have getPosition, getColor, getRadius accessor as function'
        );
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [31.2461142, 29.9927699, 0],
          'getPosition should return correct lat lng'
        );
        t.deepEqual(
          layer.meta,
          expectedLayerMeta,
          'should format correct grid layerData'
        );
        t.deepEqual(
          layerData.getColor(layerData.data[0]),
          [144, 12, 63],
          'getColor should return correct lat lng'
        );
        t.equal(
          layerData.getRadius(layerData.data[0]),
          2,
          'getRadius should return fixed radius'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, PointLayer, TEST_CASES);
  t.end();
});
