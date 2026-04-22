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

import {KeplerGlLayers} from '@kepler.gl/layers';
const {HexagonLayer} = KeplerGlLayers;

const columns = {
  lat: 'lat',
  lng: 'lng'
};
const {dataContainer} = preparedDataset;
const filteredIndex = [0, 1, 2, 4, 5, 7];

// deckGl default pointToHexbin reads viewport set to width: 1 and height: 1 on initial render
const pt0 = {
  screenCoord: [81.93285590277779, 314.10787407420145],
  index: 0,
  source: {
    index: 0
  }
};
const pt1 = {
  screenCoord: [81.90728081597221, 314.125282797666],
  index: 1,
  source: {
    index: 1
  }
};
const pt4 = {
  screenCoord: [82.29433593749998, 313.5296684059477],
  index: 2,
  source: {
    index: 4
  }
};
const pt5 = {
  screenCoord: [82.34327256944445, 313.4296004913215],
  index: 3,
  source: {
    index: 5
  }
};
const pt7 = {
  screenCoord: [82.11757812499998, 314.2888411459387],
  index: 4,
  source: {
    index: 7
  }
};

const expectedHexCellData = [
  {
    position: [-122.56068191457787, 37.71853775731428],
    points: [pt0, pt1],
    index: 0,
    filteredPoints: []
  },
  {
    position: [-121.9705519342482, 37.44853622864796],
    points: [pt4, pt5],
    index: 1,
    filteredPoints: [pt4, pt5]
  },
  {
    position: [-122.36397192113466, 37.98755881236511],
    points: [pt7],
    index: 2,
    filteredPoints: [pt7]
  }
];

// assigned by d3-hexbin
expectedHexCellData[0].points.x = 81.69147461037814;
expectedHexCellData[0].points.y = 313.99990548499255;
expectedHexCellData[1].points.x = 82.53077058240257;
expectedHexCellData[1].points.y = 313.5153377296145;
expectedHexCellData[2].points.x = 81.97123993438628;
expectedHexCellData[2].points.y = 314.4844732403706;

test('#HexagonLayer -> constructor', t => {
  const TEST_CASES = {
    CREATE: [
      {
        props: {
          dataId: 'blue',
          isVisible: true,
          label: 'test hexagon layer'
        },
        test: layer => {
          t.ok(layer.config.dataId === 'blue', 'HexagonLayer dataId should be correct');
          t.ok(layer.type === 'hexagon', 'type should be hexagon');
          t.ok(layer.isAggregated === true, 'HexagonLayer is aggregated');
          t.ok(layer.config.label === 'test hexagon layer', 'label should be correct');
          t.ok(Object.keys(layer.columnPairs).length, 'should have columnPairs');
        }
      }
    ]
  };

  testCreateCases(t, HexagonLayer, TEST_CASES.CREATE);
  t.end();
});

test('#HexagonLayer -> formatLayerData', t => {
  const TEST_CASES = [
    {
      name: 'hexagon layer gps point.1',
      layer: {
        type: 'hexagon',
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
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct hexagon layerData'
        );
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
        t.deepEqual(layer.meta, pointLayerMeta, 'should format correct hexagon layer meta');
      }
    },
    {
      name: 'Hexagon layer gps point.2',
      layer: {
        type: 'hexagon',
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

        // test getColorValue aggregate by avg
        // 0: 1.59 - 0
        // 1: 2.38  - 0
        // 4: 2.37 - 1
        // 5: 7.13 - 1
        // 7: 11 - 1
      }
    }
  ];

  testFormatLayerDataCases(t, HexagonLayer, TEST_CASES);
  t.end();
});

test('#HexagonLayer -> renderLayer', t => {
  const spyLayerCallbacks = sinon.spy();

  const TEST_CASES = [
    {
      name: 'Hexagon gps point.1',
      layer: {
        type: 'hexagon',
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

        const [deckHexLayer, hexCellLayer] = deckLayers;
        const {props} = deckHexLayer;

        const expectedProps = {
          coverage: layer.config.visConfig.coverage,
          radius: layer.config.visConfig.worldUnitSize * 1000,
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

        // deck.gl 9: sublayer data is {length, attributes} with typed arrays
        const cellData = hexCellLayer.props.data;
        t.ok(cellData && typeof cellData.length === 'number', 'cell data should have length');
        t.equal(
          cellData.length,
          expectedHexCellData.length,
          'should have correct number of hex cells'
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
          expectedHexCellData.length,
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
          expectedHexCellData.length * 2,
          'getBin array length should be binCount * 2 (col, row pairs)'
        );

        Object.keys(expectedProps).forEach(key => {
          t.deepEqual(props[key], expectedProps[key], `should have correct props.${key}`);
        });

        // onSetColorDomain fires twice: first the parent's [min, max], then our
        // enriched {domain, aggregatedBins}.  The last call is the one that sticks.
        // count aggregation: bins have 0, 2, and 1 filtered points
        t.ok(spyLayerCallbacks.called, 'should call onSetLayerDomain');
        const lastIdx = spyLayerCallbacks.args.length - 1;
        const enrichedArg = spyLayerCallbacks.args[lastIdx][0];
        t.ok(
          !Array.isArray(enrichedArg),
          'callback should receive enriched object, not plain array'
        );
        t.deepEqual(enrichedArg.domain, [0, 2], 'enriched domain should be [0, 2]');
        t.ok(enrichedArg.aggregatedBins, 'enriched call should include aggregatedBins');

        // Verify aggregator state and per-bin values
        const aggregator = deckHexLayer.state?.aggregator;
        t.ok(aggregator, 'deckHexLayer should have aggregator state');
        if (aggregator) {
          t.equal(
            aggregator.binCount,
            expectedHexCellData.length,
            'bin count should match expected cells'
          );

          const colorDomain = aggregator.getResultDomain(0);
          t.deepEqual(colorDomain, [0, 2], 'color domain should be [0, 2]');

          const elevationDomain = aggregator.getResultDomain(1);
          t.deepEqual(elevationDomain, [0, 2], 'elevation domain should be [0, 2]');

          // Verify per-bin data
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
      name: 'Hexagon gps point.1',
      layer: {
        type: 'hexagon',
        id: 'test_layer_1',
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
          ['test_layer_1', 'test_layer_1-cells'],
          'Should create 2 deck.gl layers'
        );

        const [deckHexLayer, hexCellLayer] = deckLayers;
        const {props} = deckHexLayer;
        t.equal(props.colorScaleType, 'quantize', 'should pass colorScaleType');

        const cellData = hexCellLayer.props.data;
        t.equal(
          cellData.length,
          expectedHexCellData.length,
          'should have correct number of hex cells'
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
        const aggregator = deckHexLayer.state?.aggregator;
        t.ok(aggregator, 'deckHexLayer should have aggregator state');
        if (aggregator) {
          t.equal(
            aggregator.binCount,
            expectedHexCellData.length,
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

  testRenderLayerCases(t, HexagonLayer, TEST_CASES);
  t.end();
});

function creatLayerObjectHovered({layerId, data, object}) {
  return {
    color: [],
    layer: {
      props: {id: layerId}
    },
    index: data.index,
    picked: true,
    // mock
    x: 200,
    y: 200,
    pixel: [200, 200],
    coordinate: [-117.986, 34.173],
    lngLat: [-117.986, 34.173],
    devicePixel: [1449, 759],
    pixelRatio: 2,
    object,
    handled: false
  };
}

test('#HexagonLayer -> renderHover', t => {
  const testObjectHovered = creatLayerObjectHovered({
    layerId: 'test_layer_1',
    data: dataContainer.row(0),
    object: {
      colorValue: 1,
      elevationValue: 1,
      position: [-122.56068191457787, 37.71853775731428],
      index: 0,
      points: [{}, {}],
      cellOutline: [
        [-122.36376320555154, 37.80841570626016],
        [-122.56068191457787, 37.898184393157855],
        [-122.75760062360423, 37.80841570626016],
        [-122.75760062360423, 37.628550634764665],
        [-122.56068191457787, 37.538454428239675],
        [-122.36376320555154, 37.628550634764665],
        [-122.36376320555154, 37.80841570626016]
      ]
    }
  });

  const TEST_CASES = [
    {
      name: 'Hexagon gps point.1',
      layer: {
        type: 'hexagon',
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
        objectHovered: testObjectHovered
      },
      assert: deckLayers => {
        const layerIds = deckLayers.map(l => l.id);
        t.ok(layerIds.includes('test_layer_1'), 'Should create main hexagon layer');
        t.ok(
          layerIds.includes('test_layer_1-hovered'),
          'Should create hovered layer when objectHovered has cellOutline'
        );
        t.ok(
          layerIds.includes('test_layer_1-hovered-linestrings'),
          'Should create hovered-linestrings sublayer'
        );

        const expectedHoverData = [
          {
            geometry: {
              coordinates: [
                [-122.36376320555154, 37.80841570626016],
                [-122.56068191457787, 37.898184393157855],
                [-122.75760062360423, 37.80841570626016],
                [-122.75760062360423, 37.628550634764665],
                [-122.56068191457787, 37.538454428239675],
                [-122.36376320555154, 37.628550634764665],
                [-122.36376320555154, 37.80841570626016]
              ],
              type: 'LineString'
            }
          }
        ];

        const hoverLayer = deckLayers.find(l => l.id === 'test_layer_1-hovered');
        t.ok(hoverLayer, 'Should find the hovered layer');
        if (hoverLayer) {
          t.equal(hoverLayer.props.data.length, 1, 'hover layer should have 1 data item');
          const hoverGeom = hoverLayer.props.data[0];
          t.deepEqual(
            hoverGeom.geometry,
            expectedHoverData[0].geometry,
            'should send correct hover geometry with exact coordinates'
          );
        }
      }
    }
  ];

  testRenderLayerCases(t, HexagonLayer, TEST_CASES);
  t.end();
});
