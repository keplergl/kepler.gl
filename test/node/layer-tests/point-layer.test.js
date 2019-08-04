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

import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases
} from 'test/helpers/layer-utils';
import csvData, {testFields} from 'test/fixtures/test-csv-data';
import {KeplerGlLayers} from 'layers';
const {PointLayer} = KeplerGlLayers;

import {processCsvData} from 'processors/data-processor';

it('#PointLayer -> constructor', () => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test point layer'
        },
        test: layer => {
          expect(layer.config.dataId).toBe('smoothie');
          expect(layer.type).toBe('point');
          expect(layer.isAggregated).toBe(false);
        }
      }
    ]
  };

  testCreateCases(PointLayer, TEST_CASES.CREATE);
});

it('#PointLayer -> formatLayerData', () => {
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
          textLabels: {
            characterSet: [],
            getText: () => {}
          },
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
          getFillColor: () => {},
          getLineColor: () => {},
          getRadius: () => {}
        };

        expect(Object.keys(layerData).sort()).toEqual(Object.keys(expectedLayerData).sort());
        expect(layerData.data).toEqual(expectedLayerData.data);
        expect(typeof layerData.getPosition).toBe('function');
        expect(layerData.getFillColor).toBe(layer.config.color);
        expect(layerData.getRadius).toBe(1);
        expect(layerData.getPosition(layerData.data[0])).toEqual([31.2590542, 29.9900937, 0]);
        expect(layer.meta).toEqual(expectedLayerMeta);
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
          getLineColor: () => {},
          getFillColor: () => {},
          getRadius: () => {},
          getText: () => {}
        };
        expect(layer.config.colorDomain).toEqual([2, 4, 5, 222, 345, 12124]);
        expect(Object.keys(layerData).sort).toEqual(Object.keys(expectedLayerData).sort);
        expect(layerData.data).toEqual(expectedLayerData.data);
        ['getPosition', 'getFillColor', 'getRadius'].every(
          k => expect(typeof layerData[k]).toBe('function')
        );
        expect(layerData.getPosition(layerData.data[0])).toEqual([31.2461142, 29.9927699, 0]);
        expect(layer.meta).toEqual(expectedLayerMeta);
        expect(layerData.getFillColor(layerData.data[0])).toEqual([90, 24, 70]);
        expect(layerData.getRadius(layerData.data[0])).toBe(2);
      }
    }
  ];

  testFormatLayerDataCases(PointLayer, TEST_CASES);
});

it('#PointLayer -> renderLayer', () => {
  const {rows} = processCsvData(csvData);

  const filteredIndex = [0, 2, 4];
  const data = [rows[0], rows[2], rows[4]];

  const TEST_CASES = [{
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
        },
        altitude: {
          value: null,
          fieldIdx: -1,
          optional: true
        }
      }
    },
    data: [data, rows, filteredIndex, undefined]
  }];

  testRenderLayerCases(PointLayer, TEST_CASES);
});
