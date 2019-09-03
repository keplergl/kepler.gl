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

// TODO: still need to fix the issue with gl

import {
  testCreateCases,
  testFormatLayerDataCases
} from 'test/helpers/layer-utils';
import csvData, {testFields} from 'test/fixtures/test-csv-data';

import GridLayer from 'layers/grid-layer/grid-layer';
import {processCsvData} from 'processors/data-processor';

it('#GridLayer -> constructor', () => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test grid layer'
        },
        test: layer => {
         expect(layer.config.dataId).toBe('smoothie');
         expect(layer.type).toBe('grid');
         expect(layer.isAggregated).toBe(true);
        }
      }
    ]
  };

  testCreateCases(GridLayer, TEST_CASES.CREATE);
});

it('#GridLayer -> formatLayerData', () => {
  const {rows} = processCsvData(csvData);

  const filteredIndex = [0, 2, 4];
  const data = [rows[0], rows[2], rows[4]];

  const dataWithNull = [[null, null, '12']].concat(data);
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
      data: [data, rows, filteredIndex, undefined],
      test: result => {
        const {layerData, layer} = result;
        const expectedLayerData = {
          data: [rows[0], rows[2], rows[4]],
          getPosition: () => {}
        };

        expect(Object.keys(layerData)).toEqual(['data', 'getPosition']);
        expect(layerData.data).toEqual(expectedLayerData.data);

        expect(typeof layerData.getPosition).toBe('function');
        expect(layerData.getPosition(layerData.data[0])).toEqual([31.2590542, 29.9900937]);
        expect(layer.meta).toEqual(expectedLayerMeta);
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
          args: [{data: dataWithNull, allData: allDataWithNull}, 'color']
        }
      ],
      data: [dataWithNull, allDataWithNull, filteredIndex, undefined],
      test: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: [rows[1], rows[3]],
          getPosition: () => {},
          getColorValue: () => {}
        };

        expect(Object.keys(layerData)).toEqual(['data', 'getPosition', 'getColorValue']);
        expect(layerData.data).toEqual(expectedLayerData.data);
        expect(typeof layerData.getPosition).toBe('function');
        expect(typeof layerData.getColorValue).toBe('function');
        expect(layerData.getPosition(layerData.data[0])).toEqual([31.2461142, 29.9927699]);
        expect(layer.meta).toEqual(expectedLayerMeta);
      }
    }
  ];

  testFormatLayerDataCases(GridLayer, TEST_CASES);
});
