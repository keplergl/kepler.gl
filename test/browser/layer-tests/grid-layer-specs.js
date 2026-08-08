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

        // deck.gl 9: sublayer data is {length, attributes} with typed arrays
        const cellData = gridCellLayer.props.data;
        t.ok(cellData && typeof cellData.length === 'number', 'cell data should have length');
        t.equal(
          cellData.length,
          expectedGridCellData.length,
          'should have correct number of grid cells'
        );

        // Verify typed-array attributes on the cell sublayer
        t.ok(cellData.attributes, 'cell data should have attributes');
        t.ok(
          cellData.attributes.getColorValue?.value instanceof Float32Array,
          'getColorValue should be a Float32Array'
        );
        t.ok(
          cellData.attributes.getElevationValue?.value instanceof Float32Array,
          'getElevationValue should be a Float32Array'
        );
        t.equal(
          cellData.attributes.getColorValue.value.length,
          expectedGridCellData.length,
          'getColorValue array length should match bin count'
        );

        // Verify actual attribute array values (deck.gl 9 equivalent of instanceFillColors/instanceElevations)
        // cellData.attributes contain SCALED values (processed through AttributeWithScale),
        // not raw aggregated weights. For quantize scale with 3 bins [0, 1, 2],
        // values are mapped to percentile-like range [0, 50, 99].
        const colorValues = Array.from(cellData.attributes.getColorValue.value);
        const elevationValues = Array.from(cellData.attributes.getElevationValue.value);
        t.deepEqual(
          colorValues.slice().sort((a, b) => a - b),
          [0, 50, 99],
          'getColorValue typed array should contain scaled values [0, 50, 99] (sorted)'
        );
        // Elevation uses linear scale (default), so raw values pass through
        t.deepEqual(
          elevationValues.slice().sort((a, b) => a - b),
          [0, 1, 2],
          'getElevationValue typed array should contain raw counts [0, 1, 2] (sorted)'
        );

        // getBin contains [col, row] integer IDs per bin (size=2)
        const binAttr = cellData.attributes.getBin;
        t.ok(binAttr?.value instanceof Float32Array, 'getBin should be a Float32Array');
        t.equal(
          binAttr.value.length,
          expectedGridCellData.length * 2,
          'getBin array length should be binCount * 2 (col, row pairs)'
        );

        // onSetColorDomain fires twice: first the parent's [min, max], then our
        // enriched {domain, aggregatedBins}.  The last call is the one that sticks.
        // count aggregation: bins have 0, 2, and 1 filtered points
        t.ok(spyLayerCallbacks.called, 'should call onSetLayerDomain');
        const lastIdx0 = spyLayerCallbacks.args.length - 1;
        const enrichedArg0 = spyLayerCallbacks.args[lastIdx0][0];
        t.ok(
          !Array.isArray(enrichedArg0),
          'callback should receive enriched object, not plain array'
        );
        // Default colorScale is 'quantile', so the enriched domain is the full
        // sorted array of per-bin values (not just [min, max]).
        t.deepEqual(
          enrichedArg0.domain,
          [0, 1, 2],
          'enriched domain should be full sorted bin values for quantile scale'
        );
        t.ok(enrichedArg0.aggregatedBins, 'enriched call should include aggregatedBins');

        // Verify aggregator state and per-bin values
        const aggregator = cpuGridLayer.state?.aggregator;
        t.ok(aggregator, 'cpuGridLayer should have aggregator state');
        if (aggregator) {
          t.equal(
            aggregator.binCount,
            expectedGridCellData.length,
            'bin count should match expected cells'
          );

          const colorDomain = aggregator.getResultDomain(0);
          t.deepEqual(colorDomain, [0, 2], 'color domain should be [0, 2]');

          const elevationDomain = aggregator.getResultDomain(1);
          t.deepEqual(elevationDomain, [0, 2], 'elevation domain should be [0, 2]');

          // Verify per-bin data: collect bins and match by count
          const binCounts = [];
          const binColorValues = [];
          const binElevationValues = [];
          for (let i = 0; i < aggregator.binCount; i++) {
            const bin = aggregator.getBin(i);
            t.ok(bin, `bin ${i} should exist`);
            binCounts.push(bin.count);
            binColorValues.push(bin.value[0]);
            binElevationValues.push(bin.value[1]);
          }
          t.deepEqual(
            binCounts.slice().sort(),
            [1, 2, 2],
            'bin counts (total points per bin) should be [1, 2, 2] (sorted)'
          );
          t.deepEqual(
            binColorValues.slice().sort(),
            [0, 1, 2],
            'bin color values (filtered count agg) should be [0, 1, 2] (sorted)'
          );
          t.deepEqual(
            binElevationValues.slice().sort(),
            [0, 1, 2],
            'bin elevation values (filtered count agg) should be [0, 1, 2] (sorted)'
          );

          // Verify raw result arrays
          const colorResult = aggregator.getResult(0);
          t.ok(colorResult?.value instanceof Float32Array, 'color result should be Float32Array');
          const sortedColorResult = Array.from(
            colorResult.value.slice(0, aggregator.binCount)
          ).sort();
          t.deepEqual(sortedColorResult, [0, 1, 2], 'color result values should be [0, 1, 2]');
        }
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

        const cellData = gridCellLayer.props.data;
        t.equal(
          cellData.length,
          expectedGridCellData.length,
          'should have correct number of grid cells'
        );

        // Verify typed-array attributes
        t.ok(
          cellData.attributes?.getColorValue?.value instanceof Float32Array,
          'getColorValue should be a Float32Array'
        );

        // Verify actual attribute array values for "color by" max trip_distance
        // bins with filtered points have max trip_distance 7.13 and 11; empty bin has NaN
        const colorValues = Array.from(cellData.attributes.getColorValue.value);
        const realColorValues = colorValues.filter(v => !isNaN(v)).sort((a, b) => a - b);
        t.equal(realColorValues.length, 2, 'should have 2 non-NaN color attribute values');
        t.ok(
          Math.abs(realColorValues[0] - 7.13) < 0.001,
          `first color value should be ~7.13 (got ${realColorValues[0]})`
        );
        t.equal(realColorValues[1], 11, 'second color value should be 11');
        t.equal(
          colorValues.filter(v => isNaN(v)).length,
          1,
          'should have exactly 1 NaN color value (empty bin)'
        );

        // onSetColorDomain fires twice: first the parent's [min, max], then our
        // enriched {domain, aggregatedBins}.  The last call is the one that sticks.
        // max aggregation of trip_distance: bins with filtered points have max 7.13 and 11
        // Float32 precision: 7.13 may become 7.130000114440918
        t.ok(spyLayerCallbacks.called, 'should call onSetLayerDomain');
        const lastCallIdx = spyLayerCallbacks.args.length - 1;
        const domainCallArg = spyLayerCallbacks.args[lastCallIdx][0];
        t.ok(!Array.isArray(domainCallArg), 'callback should receive enriched object');
        const domainArg = domainCallArg.domain;
        t.equal(domainArg.length, 2, 'domain should have 2 elements');
        t.ok(
          Math.abs(domainArg[0] - 7.13) < 0.001,
          `domain[0] should be ~7.13 (got ${domainArg[0]})`
        );
        t.equal(domainArg[1], 11, 'domain[1] should be 11');
        t.ok(domainCallArg.aggregatedBins, 'enriched call should include aggregatedBins');

        // Verify aggregator state and per-bin values
        const aggregator = cpuGridLayer.state?.aggregator;
        t.ok(aggregator, 'cpuGridLayer should have aggregator state');
        if (aggregator) {
          t.equal(
            aggregator.binCount,
            expectedGridCellData.length,
            'bin count should match expected cells'
          );

          const colorDomain = aggregator.getResultDomain(0);
          t.equal(colorDomain.length, 2, 'color domain should have 2 elements');
          t.ok(
            Math.abs(colorDomain[0] - 7.13) < 0.001,
            `color domain[0] should be ~7.13 (got ${colorDomain[0]})`
          );
          t.equal(colorDomain[1], 11, 'color domain[1] should be 11');

          // Verify per-bin color values (max trip_distance per cell)
          // One bin is empty (NaN), two bins have real values
          const binColorValues = [];
          for (let i = 0; i < aggregator.binCount; i++) {
            const bin = aggregator.getBin(i);
            t.ok(bin, `bin ${i} should exist`);
            binColorValues.push(bin.value[0]);
          }
          const realValues = binColorValues.filter(v => !isNaN(v)).sort((a, b) => a - b);
          t.equal(realValues.length, 2, 'should have 2 non-NaN bin color values');
          t.ok(
            Math.abs(realValues[0] - 7.13) < 0.001,
            `first real bin value should be ~7.13 (got ${realValues[0]})`
          );
          t.equal(realValues[1], 11, 'second real bin value should be 11');

          // Verify raw result array
          const colorResult = aggregator.getResult(0);
          t.ok(colorResult?.value instanceof Float32Array, 'color result should be Float32Array');
          const resultValues = Array.from(colorResult.value.slice(0, aggregator.binCount))
            .filter(v => !isNaN(v))
            .sort((a, b) => a - b);
          t.equal(resultValues.length, 2, 'should have 2 non-NaN result values');
          t.ok(
            Math.abs(resultValues[0] - 7.13) < 0.001,
            `first result value should be ~7.13 (got ${resultValues[0]})`
          );
          t.equal(resultValues[1], 11, 'second result value should be 11');
        }
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
