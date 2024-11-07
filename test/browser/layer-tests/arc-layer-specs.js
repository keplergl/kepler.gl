// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import moment from 'moment';

import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases,
  dataId,
  testRows,
  preparedDataset,
  preparedFilterDomain0,
  arcLayerMeta
} from 'test/helpers/layer-utils';
import testArcData, {arcFromHex, arcFromNeighbor} from 'test/fixtures/test-arc-data';
import {StateWArcNeighbors} from 'test/helpers/mock-state';
import {PROJECTED_PIXEL_SIZE_MULTIPLIER} from '@kepler.gl/constants';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {copyTableAndUpdate} from '@kepler.gl/table';
import {h3ToGeo} from 'h3-js';

const {ArcLayer} = KeplerGlLayers;
const columns = {
  lat0: 'lat',
  lng0: 'lng',
  lat1: 'lat_1',
  lng1: 'lng_1'
};

test('#ArcLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test arc layer'
        },
        test: layer => {
          t.ok(layer.config.dataId === 'smoothie', 'ArcLayer dataId should be correct');
          t.ok(layer.type === 'arc', 'type should be arc');
          t.ok(layer.isAggregated === false, 'ArcLayer is not aggregated');
          t.ok(layer.config.label === 'test arc layer', 'label should be correct');
          t.ok(Object.keys(layer.columnPairs).length, 'should have columnPairs');
        }
      }
    ]
  };

  testCreateCases(t, ArcLayer, TEST_CASES.CREATE);
  t.end();
});

test('#ArcLayer -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];

  // filter.domain: [ 1474071056000, 1474071489000 ]
  // filterRange: [ [ 39000, 552000 ]
  // create a clone from preparedDataset
  const TEST_CASES = [
    {
      name: 'Arc trip data.1',
      layer: {
        config: {
          dataId,
          label: 'trip arcs',
          columns,
          color: [10, 10, 10]
        },
        type: 'arc',
        id: 'test_layer_0'
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: [
            {
              index: 0,
              sourcePosition: [testRows[0][2], testRows[0][1], 0],
              targetPosition: [testRows[0][4], testRows[0][3], 0]
            },
            {
              index: 4,
              sourcePosition: [testRows[4][2], testRows[4][1], 0],
              targetPosition: [testRows[4][4], testRows[4][3], 0]
            }
          ],
          getFilterValue: () => {},
          getFiltered: () => {},
          getSourceColor: () => {},
          getTargetColor: () => {},
          getWidth: () => {}
        };
        const expectedDataKeys = Object.keys(expectedLayerData).sort();

        t.deepEqual(
          Object.keys(layerData).sort(),
          expectedDataKeys,
          'layerData should have 6 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct arc layerData data'
        );
        // getSourceColor
        t.deepEqual(
          layerData.getSourceColor,
          layer.config.color,
          'getSourceColor should be a constant'
        );
        // getSourceColor
        t.deepEqual(
          layerData.getTargetColor,
          layer.config.color,
          'getTargetColors should be a constant'
        );
        // getWidth
        t.equal(layerData.getWidth, 1, 'getWidth should be a constant');
        // getFilterValue
        t.deepEqual(
          layerData.data.map(layerData.getFilterValue),
          [
            [Number.MIN_SAFE_INTEGER, 0, 0, 0],
            [moment.utc(testRows[4][0]).valueOf() - preparedFilterDomain0, 0, 0, 0]
          ],
          'getFilterValue should return [value, 0, 0, 0]'
        );

        // layerMeta
        t.deepEqual(layer.meta, arcLayerMeta, 'should format correct arc layer meta');
      }
    },
    {
      name: 'Arc trip data.2 targetColor',
      layer: {
        config: {
          dataId,
          label: 'trip arcs',
          columns,
          color: [10, 10, 10],
          visConfig: {
            targetColor: [1, 2, 3]
          }
        },
        type: 'arc',
        id: 'test_layer_2'
      },
      datasets: {
        [dataId]: preparedDataset
      },
      assert: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: [],
          getFilterValue: () => {},
          getFiltered: () => {},
          getSourceColor: () => {},
          getTargetColor: () => {},
          getWidth: () => {}
        };
        const expectedDataKeys = Object.keys(expectedLayerData).sort();

        t.deepEqual(
          Object.keys(layerData).sort(),
          expectedDataKeys,
          'layerData should have 6 keys'
        );

        // getSourceColor
        t.deepEqual(
          layerData.getSourceColor,
          layer.config.color,
          'getSourceColor should be a constant'
        );
        // getSourceColor
        t.deepEqual(layerData.getTargetColor, [1, 2, 3], 'getTargetColors should be a constant');
      }
    },
    {
      name: 'Arc trip data. with colorField and sizeField',
      layer: {
        config: {
          dataId,
          label: 'trip arcs',
          columns,
          color: [10, 10, 10],
          // color by types(string)
          colorField: {
            type: 'string',
            name: 'types'
          },
          // size by trip_distance(real)
          sizeField: {
            type: 'real',
            name: 'trip_distance'
          },
          visConfig: {
            colorRange: {
              colors: ['#010101', '#020202', '#030303']
            },
            sizeRange: [10, 20]
          }
        },
        type: 'arc',
        id: 'test_layer_1'
      },
      // modify preparedDataset
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: result => {
        const {layerData} = result;
        const expectedLayerData = {
          data: [
            {
              index: 0,
              sourcePosition: [testRows[0][2], testRows[0][1], 0],
              targetPosition: [testRows[0][4], testRows[0][3], 0]
            },
            {
              index: 4,
              sourcePosition: [testRows[4][2], testRows[4][1], 0],
              targetPosition: [testRows[4][4], testRows[4][3], 0]
            }
          ],
          getFilterValue: () => {},
          getFiltered: () => {},
          getSourceColor: () => {},
          getTargetColor: () => {},
          getWidth: () => {}
        };
        const expectedDataKeys = Object.keys(expectedLayerData).sort();

        t.deepEqual(
          Object.keys(layerData).sort(),
          expectedDataKeys,
          'layerData should have 6 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct arc layerData data'
        );
        // getSourceColor
        // domain: ['driver_analytics', 'driver_analytics_0', 'driver_gps']
        // range ['#010101', '#020202', '#030303']
        t.deepEqual(
          layerData.data.map(layerData.getSourceColor),
          [
            [2, 2, 2],
            [1, 1, 1]
          ],
          'getSourceColor should be correct'
        );
        // getTargetColor
        // domain: ['driver_analytics', 'driver_analytics_0', 'driver_gps']
        // range ['#010101', '#020202', '#030303']
        t.deepEqual(
          layerData.data.map(layerData.getTargetColor),
          [
            [2, 2, 2],
            [1, 1, 1]
          ],
          'getTargetColors  be correct'
        );
        // getWidth
        // domain: [1.59, 11]
        // range: [10, 20]
        // value [1.59, 2.37]
        t.deepEqual(
          layerData.data.map(layerData.getWidth),
          [10, (2.37 - 1.59) * (10 / 9.41) + 10],
          'getWidth should be a constant'
        );
        // getFilterValue
        t.deepEqual(
          layerData.data.map(layerData.getFilterValue),
          [
            [Number.MIN_SAFE_INTEGER, 0, 0, 0],
            [moment.utc(testRows[4][0]).valueOf() - preparedFilterDomain0, 0, 0, 0]
          ],
          'getFilterValue should return [value, 0, 0, 0]'
        );
      }
    },
    {
      name: 'Arc data from neighbors',
      layer: arcFromNeighbor,
      datasets: StateWArcNeighbors.visState.datasets,
      assert: result => {
        const {layerData} = result;
        const expectedLayerData = {
          data: [
            {
              index: 0,
              sourcePosition: [testArcData[0].longitude, testArcData[0].latitude, 0],
              targetPosition: [testArcData[1].longitude, testArcData[1].latitude, 0]
            },
            {
              index: 0,
              sourcePosition: [testArcData[0].longitude, testArcData[0].latitude, 0],
              targetPosition: [testArcData[2].longitude, testArcData[2].latitude, 0]
            },
            {
              index: 1,
              sourcePosition: [testArcData[1].longitude, testArcData[1].latitude, 0],
              targetPosition: [testArcData[2].longitude, testArcData[2].latitude, 0]
            }
          ],
          getFilterValue: () => {},
          getFiltered: () => {},
          getSourceColor: () => {},
          getTargetColor: () => {},
          getWidth: () => {}
        };
        // index 18, 19 does not have valid neighbors
        t.equal(layerData.data.length, 38, 'should format 41 rows');

        for (let i = 0; i < 3; i++) {
          t.deepEqual(
            layerData.data[i],
            expectedLayerData.data[i],
            'should format correct arc layerData data'
          );
        }
      }
    },
    {
      name: 'Arc data from hex',
      layer: arcFromHex,
      datasets: StateWArcNeighbors.visState.datasets,
      assert: result => {
        const {layerData} = result;
        const expectedLayerData = {
          data: [
            {
              index: 0,
              sourcePosition: [...h3ToGeo(testArcData[0]['source hex_id']).reverse(), 0],
              targetPosition: [...h3ToGeo(testArcData[0]['target hex_id']).reverse(), 0]
            },
            {
              index: 1,
              sourcePosition: [...h3ToGeo(testArcData[1]['source hex_id']).reverse(), 0],
              targetPosition: [...h3ToGeo(testArcData[1]['target hex_id']).reverse(), 0]
            },
            {
              index: 2,
              sourcePosition: [...h3ToGeo(testArcData[2]['source hex_id']).reverse(), 0],
              targetPosition: [...h3ToGeo(testArcData[2]['target hex_id']).reverse(), 0]
            }
          ],
          getFilterValue: () => {},
          getFiltered: () => {},
          getSourceColor: () => {},
          getTargetColor: () => {},
          getWidth: () => {}
        };
        // index 18, 19 does not have valid neighbors
        t.equal(layerData.data.length, 20, 'should format 20 rows');

        for (let i = 0; i < 3; i++) {
          t.deepEqual(
            layerData.data[i],
            expectedLayerData.data[i],
            'should format correct arc layerData data'
          );
        }
      }
    }
  ];

  testFormatLayerDataCases(t, ArcLayer, TEST_CASES);
  t.end();
});

test('#ArcLayer -> renderLayer', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'Arc render layer.1',
      layer: {
        config: {
          dataId,
          label: 'trip arcs',
          columns,
          color: [10, 10, 10]
        },
        type: 'arc',
        id: 'test_layer_0'
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
      assert: (deckLayers, layer) => {
        t.equal(deckLayers.length, 1, 'Should create 1 deck.gl layer');
        const {props} = deckLayers[0];

        const expectedProps = {
          opacity: layer.config.visConfig.opacity,
          widthScale: layer.config.visConfig.thickness * PROJECTED_PIXEL_SIZE_MULTIPLIER,
          filterRange: preparedDataset.gpuFilter.filterRange
        };
        Object.keys(expectedProps).forEach(key => {
          t.equal(props[key], expectedProps[key], `should have correct props.${key}`);
        });
      }
    },
    {
      name: 'Arc render layer.2 brushing',
      layer: {
        config: {
          dataId,
          label: 'trip arcs',
          columns,
          color: [10, 10, 10]
        },
        type: 'arc',
        id: 'test_layer_0'
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
      renderArgs: {
        interactionConfig: {
          brush: {
            enabled: true,
            config: {
              size: 2.5
            }
          }
        }
      },
      assert: deckLayers => {
        t.equal(deckLayers.length, 1, 'Should create 1 deck.gl layer');
        const {props} = deckLayers[0];
        // test instancePositions
        const expectedProps = {
          brushingRadius: 2500,
          brushingEnabled: true,
          brushingTarget: 'source_target'
        };
        Object.keys(expectedProps).forEach(key => {
          t.equal(props[key], expectedProps[key], `should have correct props.${key}`);
        });
      }
    }
  ];

  testRenderLayerCases(t, ArcLayer, TEST_CASES);
  t.end();
});
