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

import GridLayer from 'layers/grid-layer/grid-layer';
import {processCsvData} from 'processors/data-processor';

test('#GridLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test grid layer'
        },
        test: layer => {
          t.ok(
            layer.config.dataId === 'smoothie',
            'gridLayer dataId should be correct'
          );
          t.ok(layer.type === 'grid', 'type should be grid');
          t.ok(layer.isAggregated === true, 'gridLayer is aggregated');
        }
      }
    ]
  };

  testCreateCases(t, GridLayer, TEST_CASES.CREATE);
  t.end();
});

test('#GridLayer -> formatLayerData', t => {
  const {rows} = processCsvData(csvData);

  const filteredIndex = [0, 2, 4];
  const allDataWithNull = [[null, null, '12']].concat(rows);

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
      ambientRatio: 0.4,
      diffuseRatio: 0.6,
      specularRatio: 0.3,
      lightsStrength: [0.9, 0, 0.8, 0],
      numberOfLights: 2
    }
  };

  const TEST_CASES = [
    {
      props: {
        dataId: '0dj3h',
        label: 'some geometry file',
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
      data: [rows, filteredIndex, undefined],
      test: result => {
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
          'should format correct grid layerData'
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
      props: {
        dataId: '0dj3h',
        label: 'some geometry file',
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
          args: [{allData: allDataWithNull}, 'color']
        }
      ],
      data: [allDataWithNull, filteredIndex, undefined],
      test: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: [rows[1], rows[3]],
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
          'should filter out nulls, format correct grid layerData'
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
          [31.2461142, 29.9927699],
          'getPosition should return correct lat lng'
        );
        t.deepEqual(
          layer.meta,
          expectedLayerMeta,
          'should format correct grid layerData'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, GridLayer, TEST_CASES);
  t.end();
});
