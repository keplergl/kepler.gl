// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import sinon from 'sinon';

import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases,
  preparedDataset,
  dataId,
  testRows,
  pointLayerMeta
} from 'test/helpers/layer-utils';

import {pointToPolygonGeo, KeplerGlLayers} from '@kepler.gl/layers';
const {GridLayer} = KeplerGlLayers;
import {INITIAL_MAP_STATE} from '@kepler.gl/reducers';

const columns = {
  lat: 'lat',
  lng: 'lng'
};
const filteredIndex = [0, 1, 2, 4, 5, 7];

const expectedGridCellData = [
  {
    index: 0,
    position: [-122.59661271087748, 37.743177277521255],
    count: 2,
    points: [
      {
        source: {
          index: 0
        },
        index: 0
      },
      {
        source: {
          index: 1
        },
        index: 1
      }
    ],
    lonIdx: 253,
    latIdx: 711,
    filteredPoints: []
  },
  {
    index: 1,
    position: [-122.14283099317691, 37.38384344551697],
    count: 2,
    points: [
      {
        source: {
          index: 4
        },
        index: 2
      },
      {
        source: {
          index: 5
        },
        index: 3
      }
    ],
    lonIdx: 255,
    latIdx: 709,
    filteredPoints: [
      {
        source: {
          index: 4
        },
        index: 2
      },
      {
        source: {
          index: 5
        },
        index: 3
      }
    ]
  },
  {
    index: 2,
    position: [-122.3697218520272, 37.743177277521255],
    count: 1,
    points: [
      {
        source: {
          index: 7
        },

        index: 4
      }
    ],
    lonIdx: 254,
    latIdx: 711,
    filteredPoints: [
      {
        source: {
          index: 7
        },
        index: 4
      }
    ]
  }
];

test('#GridLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'taro',
          isVisible: true,
          label: 'test grid layer'
        },
        test: layer => {
          t.ok(layer.config.dataId === 'taro', 'gridLayer dataId should be correct');
          t.ok(layer.type === 'grid', 'type should be grid');
          t.ok(layer.isAggregated === true, 'gridLayer is aggregated');
          t.ok(layer.config.label === 'test grid layer', 'label should be correct');
          t.ok(Object.keys(layer.columnPairs).length, 'should have columnPairs');
        }
      }
    ]
  };

  testCreateCases(t, GridLayer, TEST_CASES.CREATE);
  t.end();
});

test('#GridLayer -> formatLayerData', t => {
  const TEST_CASES = [
    {
      name: 'Grid gps point.1',
      layer: {
        type: 'grid',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'some geometry file',
          columns,
          color: [1, 2, 3]
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
          data: [0, 1, 4, 5, 7].map(index => ({
            index
          })),
          _filterData: () => {},
          getColorValue: () => {},
          getElevationValue: () => {},
          getPosition: () => {}
        };

        t.deepEqual(
          Object.keys(layerData).sort(),
          Object.keys(expectedLayerData).sort(),
          'layerData should have 4 keys'
        );
        t.deepEqual(layerData.data, expectedLayerData.data, 'should format correct grid layerData');
        // test getPosition
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [testRows[0][2], testRows[0][1]],
          'getPosition should return correct position'
        );
        // test getColorValue  [1474071095000, 1474071608000]
        // 0: Null - 0
        // 1: 2016-09-17 00:10:56 1474071056000 - 0
        // 4: 2016-09-17 00:14:00 1474071240000 - 1
        // 5: 2016-09-17 00:15:01 1474071301000 - 1
        // 7: 2016-09-17 00:17:05 1474071425000 - 1
        // test layer.meta
        t.deepEqual(layer.meta, pointLayerMeta, 'should format correct grid layer meta');
      }
    },
    {
      name: 'Grid gps point.2',
      layer: {
        type: 'grid',
        id: 'test_layer_2',
        config: {
          dataId,
          label: 'some geometry file',
          columns,
          color: [1, 2, 3],
          // color by types(string)
          colorField: {
            type: 'string',
            name: 'types'
          },
          // size by id(integer)
          sizeField: {
            type: 'real',
            name: 'trip_distance'
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
        const {layerData} = result;
        const expectedLayerData = {
          data: [0, 1, 4, 5, 7].map(index => ({
            index
          })),
          _filterData: () => {},
          getColorValue: () => {},
          getElevationValue: () => {},
          getPosition: () => {}
        };

        t.deepEqual(
          Object.keys(layerData).sort(),
          Object.keys(expectedLayerData).sort(),
          'layerData should have 4 keys'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, GridLayer, TEST_CASES);
  t.end();
});

test('#GridLayer -> renderLayer', t => {
  const spyLayerCallbacks = sinon.spy();

  const TEST_CASES = [
    {
      name: 'Grid gps point.1',
      layer: {
        type: 'grid',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'some geometry file',
          columns,
          color: [1, 2, 3],
          visConfig: {
            worldUnitSize: 20,
            colorRange: {
              colors: ['#010101', '#020202', '#030303']
            }
          }
        }
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
      renderArgs: {
        layerCallbacks: {
          onSetLayerDomain: spyLayerCallbacks
        }
      },
      assert: (deckLayers, layer) => {
        t.deepEqual(
          deckLayers.map(l => l.id),
          ['test_layer_1', 'test_layer_1-cells'],
          'Should create 2 deck.gl layers'
        );
        const [cpuGridLayer, gridCellLayer] = deckLayers;
        const {props} = cpuGridLayer;

        const expectedProps = {
          coverage: layer.config.visConfig.coverage,
          cellSize: layer.config.visConfig.worldUnitSize * 1000,
          colorRange: [
            [1, 1, 1],
            [2, 2, 2],
            [3, 3, 3]
          ],
          colorScaleType: layer.config.colorScale,
          elevationScaleType: layer.config.sizeScale,
          elevationScale: layer.config.visConfig.elevationScale,
          upperPercentile: layer.config.visConfig.percentile[1],
          lowerPercentile: layer.config.visConfig.percentile[0]
        };

        Object.keys(expectedProps).forEach(key => {
          t.deepEqual(props[key], expectedProps[key], `should have correct props.${key}`);
        });

        // In deck.gl 9, sublayer data is {length, attributes} not an array
        const gridCellLayerProp = gridCellLayer.props;
        t.ok(
          gridCellLayerProp.data && typeof gridCellLayerProp.data.length === 'number',
          'should pass correct data to grid cell layer'
        );
        t.equal(
          gridCellLayerProp.data.length,
          expectedGridCellData.length,
          'should have correct number of grid cells'
        );
      }
    },
    {
      name: 'Grid gps point.color by',
      layer: {
        type: 'grid',
        id: 'test_layer_2',
        config: {
          dataId,
          label: 'some geometry file',
          columns,
          color: [1, 2, 3],
          colorField: {
            name: 'trip_distance',
            type: 'real'
          },
          colorScale: 'quantize',
          visConfig: {
            worldUnitSize: 20,
            colorRange: {
              colors: ['#010101', '#020202', '#030303']
            },
            colorAggregation: 'maximum'
          }
        }
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex
        }
      },
      renderArgs: {
        layerCallbacks: {
          onSetLayerDomain: spyLayerCallbacks
        }
      },
      assert: deckLayers => {
        t.deepEqual(
          deckLayers.map(l => l.id),
          ['test_layer_2', 'test_layer_2-cells'],
          'Should create 2 deck.gl layers'
        );
        const [cpuGridLayer, gridCellLayer] = deckLayers;
        const {props} = cpuGridLayer;

        t.equal(props.colorScaleType, 'quantize', 'should pass colorScaleType');

        const gridCellLayerProp = gridCellLayer.props;
        t.equal(
          gridCellLayerProp.data.length,
          expectedGridCellData.length,
          'should pass correct data to grid cell layer'
        );
      }
    }
  ];

  testRenderLayerCases(t, GridLayer, TEST_CASES);
  t.end();
});

test('#GridLayer -> pointToPolygonGeo', t => {
  const polygonGeo = pointToPolygonGeo({
    object: {
      position: [-122.39096, 37.769897]
    },
    cellSize: 20000,
    coverage: 1,
    properties: {
      name: 'a'
    },
    mapState: INITIAL_MAP_STATE
  });

  const expected = {
    geometry: {
      coordinates: [
        [-122.39095999999999, 37.769897000000014],
        [-122.1634200224827, 37.769897000000014],
        [-122.16286655375738, 37.94954323177784],
        [-122.39095999999999, 37.94954323177784],
        [-122.39095999999999, 37.769897000000014]
      ],
      type: 'LineString'
    },
    properties: {name: 'a'}
  };

  t.deepEqual(polygonGeo, expected, 'should create correct polygonGeo');
  t.end();
});
