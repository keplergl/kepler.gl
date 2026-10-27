// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import sinon from 'sinon';
import Supercluster from 'supercluster';
import {LayerManager, WebMercatorViewport} from '@deck.gl/core';
import {device} from '@deck.gl/test-utils';
import {DeckGLClusterLayer} from '@kepler.gl/deckgl-layers';

import {
  testCreateCases,
  testFormatLayerDataCases,
  testRenderLayerCases,
  preparedDataset,
  dataId,
  testRows,
  pointLayerMeta
} from 'test/helpers/layer-utils';

import {KeplerGlLayers} from '@kepler.gl/layers';
import {INITIAL_MAP_STATE} from '@kepler.gl/reducers';

const {ClusterLayer} = KeplerGlLayers;

const columns = {
  lat: 'lat',
  lng: 'lng'
};

test('#ClusterLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'taro',
          isVisible: true,
          label: 'test cluster layer'
        },
        test: layer => {
          t.ok(layer.config.dataId === 'taro', 'clusterLayer dataId should be correct');
          t.ok(layer.type === 'cluster', 'type should be cluster');
          t.ok(layer.isAggregated === true, 'clusterLayer is aggregated');
          t.ok(layer.config.label === 'test cluster layer', 'label should be correct');
          t.ok(Object.keys(layer.columnPairs).length, 'should have columnPairs');
        }
      }
    ]
  };

  testCreateCases(t, ClusterLayer, TEST_CASES.CREATE);
  t.end();
});

test('#ClusterLayer -> formatLayerData', t => {
  const filteredIndex = [0, 1, 2, 4, 5, 7];

  const TEST_CASES = [
    {
      name: 'Cluster gps point.1',
      layer: {
        type: 'cluster',
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
        t.equal(
          // getColorValue now counts only filtered points within the bin
          layerData.getColorValue(expectedLayerData.data),
          3,
          'should return filtered point count'
        );
        t.equal(
          // getElevationValue now counts only filtered points within the bin
          layerData.getElevationValue(expectedLayerData.data),
          3,
          'should return filtered point count'
        );
        t.deepEqual(
          layerData.data.map(layerData._filterData),
          [false, false, true, true, true],
          '_filterData should filter data correctly'
        );
        // test layer.meta
        t.deepEqual(layer.meta, pointLayerMeta, 'should format correct grid layer meta');
      }
    },
    {
      name: 'Cluster gps point.2',
      layer: {
        type: 'cluster',
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
        // test getColorValue aggregate by mode
        // 0: driver_analytics_0 - 0
        // 1: null  - 0
        // 4: driver_analytics - 1
        // 5: driver_analytics - 1
        // 7: driver_analytics - 1
        // wrapOrdinalAccessor converts the string mode result to a stable
        // numeric index (required by deck.gl 9's Float32Array aggregation).
        // 'driver_analytics' is the first unique value → index 0.
        t.equal(
          layerData.getColorValue(expectedLayerData.data),
          0,
          'should return filtered mode of (types)'
        );
        t.deepEqual(
          layerData.data.map(layerData._filterData),
          [false, false, true, true, true],
          '_filterData should filter data correctly'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, ClusterLayer, TEST_CASES);
  t.end();
});

test('#ClusterLayer -> renderLayer', t => {
  const filteredIndex = [0, 1, 2, 4, 5, 7];
  const spyLayerCallbacks = sinon.spy();

  // 0 2016-09-17 00:09:55: 1474070995000 - false
  // 1 2016-09-17 00:10:56: 1474071056000 - false
  // 2 2016-09-17 00:11:56: 1474071116000 - true
  // 4 2016-09-17 00:14:00: 1474071240000 - true
  // 5 2016-09-17 00:15:01: 1474071301000 - true
  // 7 2016-09-17 00:17:05: 1474071425000 - true

  // timeFilter [1474071095000, 1474071608000]
  const TEST_CASES = [
    {
      name: 'Cluster gps point.1',
      layer: {
        type: 'cluster',
        id: 'test_layer_1',
        config: {
          dataId,
          label: 'some geometry file',
          columns,
          color: [1, 2, 3],
          visConfig: {
            worldUnitSize: 20,
            colorRange: {
              colors: ['#080808', '#090909', '#070707']
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
          ['test_layer_1', 'test_layer_1-cluster', 'test_layer_1-label-pointCount-collision'],
          'Should create the cluster layer, bubbles, and count labels'
        );
        const [clusterLayer, scatterplotLayer] = deckLayers;
        const {props} = clusterLayer;
        const scatterplotLayerProp = scatterplotLayer.props;

        const expectedProps = {
          colorRange: [
            [8, 8, 8],
            [9, 9, 9],
            [7, 7, 7]
          ],
          radiusScale: 1,
          radiusRange: layer.config.visConfig.radiusRange,
          clusterRadius: layer.config.visConfig.clusterRadius,
          colorScaleType: layer.config.colorScale,
          zoom: Math.round(INITIAL_MAP_STATE.zoom),
          width: INITIAL_MAP_STATE.width,
          height: INITIAL_MAP_STATE.height
        };

        Object.keys(expectedProps).forEach(key => {
          t.deepEqual(props[key], expectedProps[key], `should have correct props.${key}`);
        });

        const expectedScatterplotData = [
          {
            points: [
              {
                index: 4
              }
            ],
            position: [-122.136795, 37.456535],
            index: 0,
            filteredPoints: null
          },
          {
            points: [
              {
                index: 5
              }
            ],
            position: [-122.10239, 37.40066],
            index: 1,
            filteredPoints: null
          },
          {
            points: [
              {
                index: 7
              }
            ],
            position: [-122.26108, 37.879066],
            index: 2,
            filteredPoints: null
          }
        ];
        const expectedColorBins = [
          {i: 0, value: 1, counts: 1},
          {i: 1, value: 1, counts: 1},
          {i: 2, value: 1, counts: 1}
        ];

        t.deepEqual(
          scatterplotLayerProp.data,
          expectedScatterplotData,
          'should pass correct data to cluster layer'
        );

        const labelLayer = deckLayers.find(l => l.id === 'test_layer_1-label-pointCount-collision');
        t.equal(
          labelLayer.constructor.layerName,
          'CollisionTextLayer',
          'count labels use collision'
        );
        t.equal(labelLayer.props.collisionEnabled, true, 'collision is on by default');
        t.equal(labelLayer.props.getTextAnchor, 'middle', 'count is centered on the bubble');
        t.equal(labelLayer.props.getAlignmentBaseline, 'center', 'count is centered on the bubble');
        t.equal(
          labelLayer.props.parameters.depthTest,
          false,
          'labels draw on top of geometry, like geojson text'
        );
        t.deepEqual(
          labelLayer.props.data.map(d => ({
            position: labelLayer.props.getPosition(d),
            text: labelLayer.props.getText(d)
          })),
          expectedScatterplotData.map(d => ({position: d.position, text: '1'})),
          'each bubble is labeled with its point count'
        );

        const expectedColorDomain = {
          domain: [1, 1, 1],
          aggregatedBins: {
            0: {i: 0, value: 1, counts: 1},
            1: {i: 1, value: 1, counts: 1},
            2: {i: 2, value: 1, counts: 1}
          }
        };
        t.deepEqual(
          spyLayerCallbacks.args[0][0],
          expectedColorDomain,
          'should call onSetLayerDomain with correct domain'
        );

        // fillColor
        t.deepEqual(
          clusterLayer.state.aggregatorState.dimensions.fillColor.sortedBins.sortedBins,
          expectedColorBins,
          'should create correct color bins sortedBins'
        );
        t.deepEqual(
          clusterLayer.state.aggregatorState.dimensions.fillColor.valueDomain,
          [1, 1, 1],
          'should create correct radius valueDomain based on filteredPoints'
        );

        // radius
        t.deepEqual(
          clusterLayer.state.aggregatorState.dimensions.radius.valueDomain,
          [0, 1],
          'should create correct radius valueDomain based on filteredPoints'
        );
      }
    }
  ];

  testRenderLayerCases(t, ClusterLayer, TEST_CASES);
  t.end();
});

test('#ClusterLayer -> minClusterSize hides small clusters', t => {
  // zoom 8 merges rows 4 and 5 into one cluster and leaves row 7 on its own
  const renderArgs = {
    mapState: {...INITIAL_MAP_STATE, zoom: 8},
    layerCallbacks: {onSetLayerDomain: () => {}}
  };
  const datasets = {
    [dataId]: {
      ...preparedDataset,
      filteredIndex: [0, 1, 2, 4, 5, 7]
    }
  };
  const clusterConfig = minClusterSize => ({
    type: 'cluster',
    id: `test_cutoff_${minClusterSize}`,
    config: {
      dataId,
      label: 'cluster cutoff',
      columns,
      color: [1, 2, 3],
      visConfig: {
        minClusterSize,
        colorRange: {
          colors: ['#080808', '#090909', '#070707']
        }
      }
    }
  });
  const clusterCounts = deckLayers => {
    const scatterplot = deckLayers.find(l => l.id.endsWith('-cluster'));
    return scatterplot.props.data.map(d => d.points.length);
  };

  testRenderLayerCases(t, ClusterLayer, [
    {
      name: 'cluster without a cutoff',
      layer: clusterConfig(1),
      datasets,
      renderArgs,
      assert: deckLayers => {
        t.deepEqual(
          clusterCounts(deckLayers).sort(),
          [1, 2],
          'the default keeps the single point cluster'
        );
      }
    },
    {
      name: 'cluster with a cutoff of 2',
      layer: clusterConfig(2),
      datasets,
      renderArgs,
      assert: deckLayers => {
        const clusterLayer = deckLayers[0];
        t.equal(clusterLayer.props.minPointCount, 2, 'should pass the cutoff to the deck layer');

        const scatterplot = deckLayers.find(l => l.id.endsWith('-cluster'));
        t.deepEqual(
          scatterplot.props.data.map(d => ({count: d.points.length, index: d.index})),
          [{count: 2, index: 0}],
          'should drop the single point cluster and reindex the rest'
        );

        const labelLayer = deckLayers.find(l => l.id.includes('-label-'));
        t.deepEqual(
          labelLayer.props.data.map(labelLayer.props.getText),
          ['2'],
          'only the remaining cluster is labeled'
        );
      }
    },
    {
      name: 'cluster with a cutoff above every cluster',
      layer: clusterConfig(10),
      datasets,
      renderArgs,
      assert: deckLayers => {
        t.deepEqual(clusterCounts(deckLayers), [], 'should render nothing instead of failing');
      }
    }
  ]);
  t.end();
});

test('#ClusterLayer -> count labels follow the text label field', t => {
  testRenderLayerCases(t, ClusterLayer, [
    {
      name: 'cluster without a count label',
      layer: {
        type: 'cluster',
        id: 'test_layer_nolabel',
        config: {
          dataId,
          label: 'no labels',
          columns,
          color: [1, 2, 3],
          textLabel: [
            {
              field: null,
              collisionEnabled: true
            }
          ],
          visConfig: {
            colorRange: {
              colors: ['#080808', '#090909', '#070707']
            }
          }
        }
      },
      datasets: {
        [dataId]: {
          ...preparedDataset,
          filteredIndex: [0, 1, 2, 4, 5, 7]
        }
      },
      assert: deckLayers => {
        t.deepEqual(
          deckLayers.map(l => l.id),
          ['test_layer_nolabel', 'test_layer_nolabel-cluster'],
          'clearing the label field removes the count text'
        );
      }
    }
  ]);
  t.end();
});

test('#ClusterLayer -> membership survives cached zooms and filtered rebuilds', t => {
  const points = Object.freeze(
    Array.from({length: 24}, (_, index) =>
      Object.freeze({index, value: index + 1, position: [index < 12 ? 0 : 0.0002, 0]})
    )
  );
  const viewport = new WebMercatorViewport({
    longitude: 0,
    latitude: 0,
    zoom: 0,
    width: 2048,
    height: 2048
  });
  const manager = new LayerManager(device, {viewport});
  const load = sinon.spy(Supercluster.prototype, 'load');
  let labels = [];
  let layer = new DeckGLClusterLayer({
    id: 'cluster-membership-updates',
    data: points,
    getPosition: point => point.position,
    getColorValue: members => members.reduce((sum, point) => sum + point.value, 0),
    colorRange: [
      [0, 0, 0],
      [255, 255, 255]
    ],
    clusterRadius: 40,
    zoom: 20,
    width: 2048,
    height: 2048,
    renderCountLabels: data => {
      labels = data;
      return [];
    }
  });
  const update = (patch, expected, rebuilds) => {
    const before = load.callCount;
    layer = layer.clone(patch);
    manager.setLayers([layer]);
    const cells = layer.state.aggregatorState.layerData.data;
    t.equal(load.callCount - before, rebuilds, 'only changed inputs build a cluster index');
    t.deepEqual(
      cells.flatMap(cell => cell.points).sort((a, b) => a.index - b.index),
      expected,
      'membership contains exactly the retained source rows'
    );
    t.equal(
      labels.reduce((sum, label) => sum + label.count, 0),
      expected.length,
      'labels count members'
    );
    cells.forEach(cell => {
      const picked = layer.getPickingInfo({info: {picked: true, index: cell.index}}).object;
      t.deepEqual(picked.points, cell.points, 'picking returns the ordered cluster members');
      t.equal(picked.radiusValue, cell.points.length, 'radius uses the member count');
      t.equal(
        picked.colorValue,
        cell.points.reduce((sum, point) => sum + point.value, 0),
        'color aggregates the same members'
      );
    });
  };
  try {
    update({}, points, 1);
    update({zoom: 4}, points, 0);
    update(
      {filterData: point => point.index % 2 === 0, updateTriggers: {filterData: 1}},
      points.filter(point => point.index % 2 === 0),
      1
    );
    update({filterData: () => false, updateTriggers: {filterData: 2}}, [], 1);
    update({filterData: null, updateTriggers: {filterData: 3}}, points, 1);
    update({clusterRadius: 60}, points, 1);
    update({clusterRadius: 40}, points, 0);
    update({zoom: 20}, points, 0);
    update({data: points.slice(0, 8)}, points.slice(0, 8), 1);
  } finally {
    load.restore();
    manager.finalize();
  }
  t.end();
});
