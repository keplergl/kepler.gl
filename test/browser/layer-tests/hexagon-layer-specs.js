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

        // Verify attributes exist on the cell sublayer
        t.ok(cellData.attributes, 'cell data should have attributes');
        if (cellData.attributes) {
          const attrKeys = Object.keys(cellData.attributes);
          t.ok(attrKeys.length > 0, 'cell data should have binary attributes');
        }

        Object.keys(expectedProps).forEach(key => {
          t.deepEqual(props[key], expectedProps[key], `should have correct props.${key}`);
        });

        // deck.gl 9: onSetColorDomain receives [min, max] tuple
        t.ok(spyLayerCallbacks.called, 'should call onSetLayerDomain');
        const domainArg = spyLayerCallbacks.args[0][0];
        t.ok(Array.isArray(domainArg), 'onSetLayerDomain arg should be an array');
        t.equal(domainArg.length, 2, 'domain should be [min, max]');
        t.ok(
          typeof domainArg[0] === 'number' && typeof domainArg[1] === 'number',
          'domain values should be numbers'
        );
        t.ok(domainArg[0] <= domainArg[1], 'domain min should be <= max');

        // Verify aggregator state
        const aggregator = deckHexLayer.state?.aggregator;
        t.ok(aggregator, 'deckHexLayer should have aggregator state');
        if (aggregator) {
          t.ok(aggregator.binCount > 0, 'aggregator should have bins');
          t.equal(
            aggregator.binCount,
            expectedHexCellData.length,
            'bin count should match expected cells'
          );

          const colorDomain = aggregator.getResultDomain(0);
          t.ok(Array.isArray(colorDomain), 'color domain should be an array');
          t.equal(colorDomain.length, 2, 'color domain should be [min, max]');
          t.ok(colorDomain[0] <= colorDomain[1], 'color domain min should be <= max');

          const elevationDomain = aggregator.getResultDomain(1);
          t.ok(Array.isArray(elevationDomain), 'elevation domain should be an array');
          t.equal(elevationDomain.length, 2, 'elevation domain should be [min, max]');
          t.ok(elevationDomain[0] <= elevationDomain[1], 'elevation domain min should be <= max');
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

        // deck.gl 9: onSetColorDomain receives [min, max] tuple
        t.ok(spyLayerCallbacks.called, 'should call onSetLayerDomain');
        const lastCallIdx = spyLayerCallbacks.args.length - 1;
        const domainArg = spyLayerCallbacks.args[lastCallIdx][0];
        t.ok(Array.isArray(domainArg), 'onSetLayerDomain arg should be an array');
        t.equal(domainArg.length, 2, 'domain should be [min, max]');
        t.ok(domainArg[0] <= domainArg[1], 'domain min should be <= max');

        // Verify aggregator state
        const aggregator = deckHexLayer.state?.aggregator;
        t.ok(aggregator, 'deckHexLayer should have aggregator state');
        if (aggregator) {
          t.ok(aggregator.binCount > 0, 'aggregator should have bins');
          t.equal(
            aggregator.binCount,
            expectedHexCellData.length,
            'bin count should match expected cells'
          );

          const colorDomain = aggregator.getResultDomain(0);
          t.ok(Array.isArray(colorDomain), 'color domain should be an array');
          t.equal(colorDomain.length, 2, 'color domain should be [min, max]');
          t.ok(colorDomain[0] <= colorDomain[1], 'color domain min should be <= max');
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

        const hoverLayer = deckLayers.find(l => l.id === 'test_layer_1-hovered');
        t.ok(hoverLayer, 'Should find the hovered layer');
        if (hoverLayer) {
          t.ok(hoverLayer.props.data.length > 0, 'hover layer should have data');
          const hoverGeom = hoverLayer.props.data[0];
          t.equal(
            hoverGeom.geometry.type,
            'LineString',
            'hover data should be a LineString geometry'
          );
          t.equal(
            hoverGeom.geometry.coordinates.length,
            7,
            'hover outline should have 7 coordinates (closed hexagon)'
          );
        }
      }
    }
  ];

  testRenderLayerCases(t, HexagonLayer, TEST_CASES);
  t.end();
});
