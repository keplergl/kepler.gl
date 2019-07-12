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
import moment from 'moment';

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
import {COLOR_RANGES} from 'constants/color-ranges';

const {PointLayer} = KeplerGlLayers;

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

test('#PointLayer -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];

  const datasetWithNull = {
    ...preparedDatasetWithNull,
    filteredIndex,
    filteredIndexForDomain: [0, 2, 4, 5, 6, 7, 8, 9, 10]
  };

  const TEST_CASES = [
    {
      name: 'Point gps point.1',
      layer: {
        config: {
          dataId,
          label: 'gps point',
          columns: {
            lat: 'gps_data.lat',
            lng: 'gps_data.lng'
          },
          textLabel: [
            {
              field: {
                name: 'gps_data.types',
                type: 'string'
              }
            },
            {
              field: {
                name: 'has_result',
                type: 'boolean'
              }
            }
          ],
          visConfig: {
            strokeColor: [1, 2, 3]
          }
        },
        type: 'point',
        id: 'test_layer_1'
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
          textLabels: [
            {
              characterSet: [],
              getText: () => {}
            },
            {
              characterSet: [],
              getText: () => {}
            }
          ],
          data: [
            {
              data: rows[0],
              index: 0,
              position: [rows[0][2], rows[0][1], 0]
            },
            {
              data: rows[2],
              index: 2,
              position: [rows[2][2], rows[2][1], 0]
            },
            {
              data: rows[4],
              index: 4,
              position: [rows[4][2], rows[4][1], 0]
            }
          ],
          getFilterValue: () => {},
          getFillColor: () => {},
          getLineColor: () => {},
          getRadius: () => {},
          getPosition: () => {}
        };
        const expectedDataKeys = [
          'data',
          'getFillColor',
          'getFilterValue',
          'getLineColor',
          'getPosition',
          'getRadius',
          'textLabels'
        ];

        t.deepEqual(
          Object.keys(layerData).sort(),
          expectedDataKeys,
          'layerData should have 6 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct point layerData data'
        );
        // getPosition
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [rows[0][2], rows[0][1], 0],
          'getPosition should return correct position'
        );
        // getFillColor
        t.deepEqual(
          layerData.getFillColor,
          layer.config.color,
          'getFillColor should be a constant'
        );
        // getLineColor
        t.deepEqual(
          layerData.getLineColor,
          [1, 2, 3],
          'getLineColor should be a constant'
        );
        // getRadius
        t.equal(layerData.getRadius, 1, 'getRadius should be a constant');
        // getFilterValue
        t.deepEqual(
          layerData.getFilterValue(layerData.data[0]),
          [moment.utc(rows[0][0]).valueOf(), 0, 0, 0],
          'getFilterValue should return [0, 0, 0, 0]'
        );
        // textLabels
        t.deepEqual(
          layerData.textLabels.length,
          expectedLayerData.textLabels.length,
          'textLabels should have 2 items'
        );
        t.deepEqual(
          layerData.textLabels[0].characterSet,
          [
            'd',
            'r',
            'i',
            'v',
            'e',
            '_',
            'a',
            'n',
            'l',
            'y',
            't',
            'c',
            's',
            '0'
          ],
          'textLabels should have correct characterSet'
        );
        t.deepEqual(
          layerData.textLabels[0].getText(layerData.data[0]),
          'driver_analytics_0',
          'textLabels getText should have correct text'
        );
        // layerMeta
        t.deepEqual(
          layer.meta,
          {
            bounds: [31.2148748, 29.9870074, 31.2590542, 30.0614122]
          },
          'should format correct point layer meta'
        );
      }
    },
    {
      name: 'Test gps point.2 Data With Nulls',
      layer: {
        type: 'point',
        id: 'test_layer_2',
        config: {
          dataId,
          label: 'some point file',
          columns: {
            lat: 'gps_data.lat',
            lng: 'gps_data.lng'
          },
          visConfig: {
            outline: true,
            fixedRadius: true
          },
          // color by id(int)
          colorField: fieldsWithNull[6],
          // size by id(int)
          sizeField: fieldsWithNull[6]
        }
      },
      datasets: {
        [dataId]: datasetWithNull
      },
      assert: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: [
            {
              data: rowsWithNull[0],
              index: 0,
              position: [31.2590542, 29.9900937, 0]
            },
            {
              data: rowsWithNull[4],
              index: 4,
              position: [31.2154899, 29.9923041, 0]
            }
          ],
          getFilterValue: () => {},
          getLineColor: () => {},
          getFillColor: () => {},
          getRadius: () => {},
          getText: () => {},
          getPosition: () => {}
        };
        t.deepEqual(
          layer.config.colorDomain,
          [1, 3, 5, 222, 345, 12124],
          'should update layer color domain'
        );
        t.deepEqual(
          Object.keys(layerData).sort,
          Object.keys(expectedLayerData).sort,
          'layerData should have 6 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should filter out nulls, format correct point layerData'
        );
        t.ok(
          ['getFillColor', 'getRadius', 'getFilterValue'].every(
            k => typeof layerData[k] === 'function'
          ),
          'should have getFillColor, getRadius accessor as function'
        );
        t.ok(layerData.getLineColor, 'should have getLineColor');
        // getPosition
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [31.2590542, 29.9900937, 0],
          'getPosition should return correct lat lng'
        );
        // layerMeta
        t.deepEqual(
          layer.meta,
          {bounds: [31.2149361, 29.9870074, 31.2590542, 30.0292134]},
          'should format correct layerMeta'
        );
        // getFillColor
        t.deepEqual(
          layerData.getFillColor(layerData.data[0]),
          [90, 24, 70],
          'getFillColor should return correct color'
        );
        // getRadius
        // domain [1, 12124]
        t.equal(
          layerData.getRadius(layerData.data[0]),
          1,
          'getRadius should return fixed radius'
        );
        // getFilterValue
        t.deepEqual(
          layerData.getFilterValue(layerData.data[0]),
          [Number.MIN_SAFE_INTEGER, 0, 0, 0],
          'getFilterValue should return correct value'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, PointLayer, TEST_CASES);
  t.end();
});

test('#PointLayer -> renderLayer', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'Test render point.1',
      layer: {
        id: 'test_layer_1',
        type: 'point',
        config: {
          dataId,
          label: 'gps point',
          columns: {
            lat: 'gps_data.lat',
            lng: 'gps_data.lng',
            altitude: null
          },
          strokeColorField: {
            type: 'string',
            name: 'gps_data.types'
          },
          color: [1, 2, 3],
          visConfig: {
            strokeColorRange: COLOR_RANGES.find(
              ({name}) => name === 'Ice And Fire 4'
            ),
            thickness: 3
          }
        }
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },

      assert: deckLayers => {
        // test instanceAttributes
        t.equal(deckLayers.length, 1, 'Should create 1 deck.gl layer');
        const {attributes} = deckLayers[0].state.attributeManager;

        t.deepEqual(
          Object.keys(attributes).sort(),
          [
            'instanceFillColors',
            'instanceFilterValues',
            'instanceLineColors',
            'instanceLineWidths',
            'instancePickingColors',
            'instancePositions',
            'instancePositions64xyLow',
            'instanceRadius'
          ],
          'Should create 8 instance attributes'
        );
        // test instancePositions
        t.deepEqual(
          attributes.instancePositions.value,
          new Float32Array([
            31.2590542,
            29.9900937,
            0,
            31.2312742,
            29.9907261,
            0,
            31.2154899,
            29.9923041,
            0
          ]),
          'Should calculate correct instancePosition'
        );
        // test instanceFillColors
        t.deepEqual(
          attributes.instanceFillColors.value,
          new Float32Array([1, 2, 3, 255]),
          'Should calculate correct instanceFillColor'
        );
        // test instanceFilterValues
        t.deepEqual(
          attributes.instanceFilterValues.value,
          new Float32Array([
            moment.utc(rows[0][0]).valueOf(),
            0,
            0,
            0,
            moment.utc(rows[2][0]).valueOf(),
            0,
            0,
            0,
            moment.utc(rows[4][0]).valueOf(),
            0,
            0,
            0
          ]),
          'Should calculate correct instanceFilterValues'
        );
        // test instanceLineColors
        // range:[[1, 152, 189], [232, 254, 181], [254, 173, 84], [213, 2, 85]]
        // domain: ['driver_analytics', 'driver_analytics_0', 'driver_gps']
        t.deepEqual(
          attributes.instanceLineColors.value,
          new Float32Array([
            232,
            254,
            181,
            255,
            1,
            152,
            189,
            255,
            1,
            152,
            189,
            255
          ]),
          'Should calculate correct instanceLineColors'
        );
        // test instanceLineWidths
        t.deepEqual(
          attributes.instanceLineWidths.value,
          [1],
          'Should calculate correct instanceLineWidths'
        );
        // test instanceRadius
        t.deepEqual(
          attributes.instanceRadius.value,
          [1],
          'Should calculate correct instanceRadius'
        );
      }
    },
    {
      name: 'Test render point.2.Null values',
      layer: {
        id: 'test_layer_2',
        type: 'point',
        config: {
          dataId,
          label: 'gps point',
          columns: {
            lat: 'gps_data.lat',
            lng: 'gps_data.lng',
            altitude: null
          },
          // color by id contain null
          strokeColorField: {
            type: 'string',
            name: 'gps_data.types'
          },
          // color by id contain null
          colorField: {
            name: 'id',
            type: 'integer'
          },
          // size by id contain null
          sizeField: {
            name: 'id',
            type: 'integer'
          },
          color: [1, 2, 3],
          visConfig: {
            strokeColorRange: {
              colors: ['#010101', '#020202', '#030303', '#040404']
            },
            colorRange: {
              colors: ['#050505', '#060606', '#070707', '#080808']
            }
          }
        }
      },
      datasets: {
        [dataId]: {
          ...preparedDatasetWithNull,
          filteredIndex: [0, 1, 2, 4],
          filteredIndexForDomain: [0, 1, 2, 4, 5, 6, 7]
        }
      },

      assert: (deckLayers, layer) => {
        // test instanceAttributes
        t.equal(deckLayers.length, 1, 'Should create 1 deck.gl layer');
        const {attributes} = deckLayers[0].state.attributeManager;

        t.deepEqual(
          Object.keys(attributes).sort(),
          [
            'instanceFillColors',
            'instanceFilterValues',
            'instanceLineColors',
            'instanceLineWidths',
            'instancePickingColors',
            'instancePositions',
            'instancePositions64xyLow',
            'instanceRadius'
          ],
          'Should create 8 instance attributes'
        );
        // test instancePositions
        // 0, 1, 4
        t.deepEqual(
          attributes.instancePositions.value,
          new Float32Array([
            31.2590542,
            29.9900937,
            0,
            31.2461142,
            29.9927699,
            0,
            31.2154899,
            29.9923041,
            0
          ]),
          'Should filter out null values in instancePosition'
        );
        // test instanceFillColors
        t.deepEqual(
          attributes.instanceFillColors.value,
          // i: 0, 1, 4,
          // 1, null, 5
          new Float32Array([5, 5, 5, 255, 0, 0, 0, 0, 6, 6, 6, 255]),
          'Should use default null color in instanceFillColor'
        );
        // test instanceFilterValues
        // i: 0, 1, 4,
        t.deepEqual(
          attributes.instanceFilterValues.value,
          new Float32Array([
            Number.MIN_SAFE_INTEGER,
            0,
            0,
            0,
            moment.utc(rows[1][0]).valueOf(),
            0,
            0,
            0,
            moment.utc(rows[4][0]).valueOf(),
            0,
            0,
            0
          ]),
          'Should calculate correct instanceFilterValues'
        );
        // test instanceLineColors
        // i: 0, 1, 4,
        // domain: ['driver_analytics', 'driver_analytics_0', 'driver_gps']
        t.deepEqual(
          attributes.instanceLineColors.value,
          new Float32Array([2, 2, 2, 255, 0, 0, 0, 0, 1, 1, 1, 255]),
          'Should calculate correct instanceLineColors'
        );
        // test instanceLineWidths
        t.deepEqual(
          attributes.instanceLineWidths.value,
          [1],
          'Should calculate correct instanceLineWidths'
        );
        // test instanceRadius
        // domain: [1, 12124] range: [0, 500] scale: sqrt
        t.deepEqual(
          attributes.instanceRadius.value,
          [0, 0, 0.5664370059967041],
          'Should calculate correct instanceRadius'
        );
      }
    }
  ];

  testRenderLayerCases(t, PointLayer, TEST_CASES);
  t.end();
});

