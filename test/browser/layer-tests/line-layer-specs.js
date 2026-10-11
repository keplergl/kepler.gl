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
  arcLayerMeta
} from 'test/helpers/layer-utils';

import {PROJECTED_PIXEL_SIZE_MULTIPLIER} from '@kepler.gl/constants';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {copyTable, copyTableAndUpdate} from '@kepler.gl/table';

const {LineLayer} = KeplerGlLayers;
const columns = {
  lat0: 'lat',
  lng0: 'lng',
  lat1: 'lat_1',
  lng1: 'lng_1'
};

test('#LineLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'smoothie',
          isVisible: true,
          label: 'test line layer'
        },
        test: layer => {
          t.ok(layer.config.dataId === 'smoothie', 'LineLayer dataId should be correct');
          t.ok(layer.type === 'line', 'type should be line');
          t.ok(layer.isAggregated === false, 'LineLayer is not aggregated');
          t.ok(layer.config.label === 'test line layer', 'label should be correct');
          t.ok(Object.keys(layer.columnPairs).length, 'should have columnPairs');
          t.equal(layer.config.visConfig.targetArrowEnabled, false, 'target arrow is off');
          t.equal(
            layer.visConfigSettings.targetArrowSize.allowCustomValue,
            false,
            'arrow size has no custom input'
          );
        }
      }
    ]
  };

  testCreateCases(t, LineLayer, TEST_CASES.CREATE);
  t.end();
});

test('#LineLayer -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];
  const filterDomain0 = 1474071056000;

  const TEST_CASES = [
    {
      name: 'Line trip data.1',
      layer: {
        config: {
          dataId,
          label: 'trip lines',
          columns,
          color: [10, 10, 10]
        },
        type: 'line',
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
          getColor: () => {},
          getTargetColor: () => {},
          getWidth: () => {}
        };
        const expectedDataKeys = Object.keys(expectedLayerData).sort();

        t.deepEqual(
          Object.keys(layerData).sort(),
          expectedDataKeys,
          'layerData should have 6 keys'
        );
        t.deepEqual(layerData.data, expectedLayerData.data, 'should format correct line layerData');
        // getColor
        t.deepEqual(layerData.getColor, layer.config.color, 'getColor should be a constant');
        // getTargetColor
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
            [moment.utc(testRows[4][0]).valueOf() - filterDomain0, 0, 0, 0]
          ],
          'getFilterValue should return [value, 0, 0, 0]'
        );

        // layerMeta
        t.deepEqual(layer.meta, arcLayerMeta, 'should format correct arc layer meta');
      }
    },
    {
      name: 'Lind trip data.2 targetColor',
      layer: {
        config: {
          dataId,
          label: 'trip lines',
          columns,
          color: [10, 10, 10],
          visConfig: {
            targetColor: [1, 2, 3]
          }
        },
        type: 'line',
        id: 'test_layer_2'
      },
      datasets: {
        [dataId]: copyTable(preparedDataset)
      },
      assert: result => {
        const {layerData, layer} = result;

        const expectedLayerData = {
          data: [],
          getFilterValue: () => {},
          getFiltered: () => {},
          getColor: () => {},
          getTargetColor: () => {},
          getWidth: () => {}
        };
        const expectedDataKeys = Object.keys(expectedLayerData).sort();

        t.deepEqual(
          Object.keys(layerData).sort(),
          expectedDataKeys,
          'layerData should have 6 keys'
        );
        // getColor
        t.deepEqual(layerData.getColor, layer.config.color, 'getColor should be a constant');
        // getColor
        t.deepEqual(layerData.getTargetColor, [1, 2, 3], 'getTargetColors should be a constant');
      }
    },
    {
      name: 'Line trip data. with colorField and sizeField',
      layer: {
        config: {
          dataId,
          label: 'trip lines',
          columns,
          color: [10, 10, 10],
          // color by id(integer)
          colorField: {
            type: 'string',
            name: 'types'
          },
          // size by id(integer)
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
        type: 'line',
        id: 'test_layer_1'
      },
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
          getColor: () => {},
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
          'should format correct line layerData data'
        );
        // getColor
        // domain: ['driver_analytics', 'driver_analytics_0', 'driver_gps']
        // range ['#010101', '#020202', '#030303']
        t.deepEqual(
          layerData.data.map(layerData.getColor),
          [
            [2, 2, 2],
            [1, 1, 1]
          ],
          'getColor should be correct'
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
            [moment.utc(testRows[4][0]).valueOf() - filterDomain0, 0, 0, 0]
          ],
          'getFilterValue should return [value, 0, 0, 0]'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, LineLayer, TEST_CASES);
  t.end();
});

test('#LineLayer -> renderLayer', t => {
  const filteredIndex = [0, 2, 4];

  const TEST_CASES = [
    {
      name: 'Line render layer.1',
      layer: {
        config: {
          dataId,
          label: 'trip lines',
          columns,
          color: [10, 10, 10]
        },
        type: 'line',
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
        // test instancePositions
        t.equal(props.opacity, layer.config.visConfig.opacity, 'should calculate correct opacity');
        t.equal(
          props.widthScale,
          layer.config.visConfig.thickness * PROJECTED_PIXEL_SIZE_MULTIPLIER,
          'should apply correct widthScale'
        );
        t.equal(
          props.filterRange,
          preparedDataset.gpuFilter.filterRange,
          'should supply correct filterRange'
        );
      }
    },
    {
      name: 'Line render layer.2 brushing',
      layer: {
        config: {
          dataId,
          label: 'trip lines',
          columns,
          color: [10, 10, 10]
        },
        type: 'line',
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

        t.equal(props.brushingRadius, 2500, 'should supply brushingRadius');
        t.equal(props.brushingEnabled, true, 'should have brushingEnabled: true');
        t.equal(props.brushingTarget, 'source_target', 'brushingTarget: should be source');
      }
    },
    {
      name: 'Line render layer.3 target arrow',
      layer: {
        config: {
          dataId,
          label: 'trip lines',
          columns,
          color: [10, 10, 10],
          visConfig: {
            targetArrowEnabled: true,
            targetArrowShape: 'triangle',
            targetArrowSize: 20,
            targetColor: [200, 30, 30]
          }
        },
        type: 'line',
        id: 'test_layer_0'
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
      assert: deckLayers => {
        t.equal(deckLayers.length, 2, 'Should create the line and an arrow head');
        const arrowLayer = deckLayers[deckLayers.length - 1];
        t.equal(arrowLayer.id, 'test_layer_0-arrow-head-triangle', 'arrow layer id');
        t.equal(arrowLayer.props.pickable, false, 'arrow head does not take the line hover');
        const radius =
          typeof arrowLayer.props.getRadius === 'function'
            ? arrowLayer.props.getRadius(arrowLayer.props.data[0])
            : arrowLayer.props.getRadius;
        t.equal(radius, 20, 'arrow size is the vis config value in pixels');
        t.equal(arrowLayer.props.iconGeometry.length, 9, 'triangle is one triangle');
        t.ok(
          Number.isFinite(arrowLayer.props.getAngle(arrowLayer.props.data[0])),
          'arrow angle is finite'
        );
        const fill =
          typeof arrowLayer.props.getFillColor === 'function'
            ? arrowLayer.props.getFillColor(arrowLayer.props.data[0])
            : arrowLayer.props.getFillColor;
        t.deepEqual(fill, [200, 30, 30], 'arrow uses the target color');
      }
    },
    {
      name: 'Line render layer.4 target arrow hover',
      layer: {
        config: {
          dataId,
          label: 'trip lines',
          columns,
          color: [10, 10, 10],
          visConfig: {
            targetArrowEnabled: true,
            targetArrowShape: 'triangle',
            targetArrowSize: 20
          }
        },
        type: 'line',
        id: 'test_layer_0'
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
      renderArgs: {
        objectHovered: {
          picked: true,
          object: {
            index: 0,
            sourcePosition: [-122.4, 37.8, 0],
            targetPosition: [-122.3, 37.9, 0]
          },
          layer: {props: {id: 'test_layer_0'}}
        }
      },
      assert: deckLayers => {
        t.equal(deckLayers.length, 4, 'Should add a highlight stroke and a highlight arrow');
        const arrowLayer = deckLayers[deckLayers.length - 1];
        t.equal(arrowLayer.id, 'test_layer_0-arrow-head-triangle-hovered', 'highlight arrow id');
        t.equal(arrowLayer.props.data.length, 1, 'highlight arrow is only the hovered stroke');
        const color =
          typeof arrowLayer.props.getFillColor === 'function'
            ? arrowLayer.props.getFillColor(arrowLayer.props.data[0])
            : arrowLayer.props.getFillColor;
        t.deepEqual(color, [252, 242, 26, 255], 'highlight arrow uses the layer highlight color');
      }
    }
  ];

  testRenderLayerCases(t, LineLayer, TEST_CASES);
  t.end();
});
