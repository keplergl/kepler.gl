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

import HexagonLayer from 'layers/hexagon-layer/hexagon-layer';

const columns = {
  lat: 'lat',
  lng: 'lng'
};

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
          t.ok(
            layer.config.dataId === 'blue',
            'HexagonLayer dataId should be correct'
          );
          t.ok(layer.type === 'hexagon', 'type should be hexagon');
          t.ok(layer.isAggregated === true, 'HexagonLayer is aggregated');
          t.ok(
            layer.config.label === 'test hexagon layer',
            'label should be correct'
          );
          t.ok(
            Object.keys(layer.columnPairs).length,
            'should have columnPairs'
          );
        }
      }
    ]
  };

  testCreateCases(t, HexagonLayer, TEST_CASES.CREATE);
  t.end();
});

test('#HexagonLayer -> formatLayerData', t => {
  const filteredIndex = [0, 1, 2, 4, 5, 7];

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
            data: testRows[index],
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
        t.equal(
          // assume all points fall into one bin
          layerData.getColorValue(expectedLayerData.data),
          5,
          'should return filtered point count'
        );
        t.equal(
          // assume all points fall into one bin
          layerData.getElevationValue(expectedLayerData.data),
          5,
          'should return filtered point count'
        );
        t.deepEqual(
          layerData.data.map(layerData._filterData),
          [false, false, true, true, true],
          '_filterData should filter data correctly'
        );
        // test layer.meta
        t.deepEqual(
          layer.meta,
          pointLayerMeta,
          'should format correct hexagon layer meta'
        );
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
            data: testRows[index],
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
        t.equal(
          // assume all points fall into one bin
          layerData.getColorValue(expectedLayerData.data),
          'driver_analytics',
          'should return filtered mode of (types)'
        );
        t.deepEqual(
          layerData.data.map(layerData._filterData),
          [false, false, true, true, true],
          '_filterData should filter data correctly'
        );
        // test getColorValue aggregate by avg
        // 0: 1.59 - 0
        // 1: 2.38  - 0
        // 4: 2.37 - 1
        // 5: 7.13 - 1
        // 7: 11 - 1
        t.equal(
          // assume all points fall into one bin
          layerData.getElevationValue(expectedLayerData.data),
          (1.59 + 2.38 + 2.37 + 7.13 + 11) / 5,
          'should return filtered avg trip_distance'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, HexagonLayer, TEST_CASES);
  t.end();
});

test('#HexagonLayer -> renderLayer', t => {
  const filteredIndex = [0, 1, 2, 4, 5, 7];
  const spyLayerCallbacks = sinon.spy();
  const {allData} = preparedDataset;

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
        layerCallbacks: {
          onSetLayerDomain: spyLayerCallbacks
        }
      },
      assert: (deckLayers, layer) => {
        t.deepEqual(
          deckLayers.map(l => l.id),
          ['test_layer_1', 'test_layer_1-hexagon-cell'],
          'Should create 2 deck.gl layers'
        );

        const [deckHexLayer, hexCellLayer] = deckLayers;
        const {props, state} = deckHexLayer;

        // deckGl default pointToHexbin reads viewport set to width: 1 and height: 1 on initial render
        const pt0 = {
          screenCoord: [41949.62272711111, 101320.76889147105],
          index: 0,
          data: allData[0]
        };
        const pt1 = {
          screenCoord: [41936.53009066667, 101311.85384886562],
          index: 1,
          data: allData[1]
        };
        const pt4 = {
          screenCoord: [42134.70003199999, 101616.81008745039],
          index: 4,
          data: allData[4]
        };
        const pt5 = {
          screenCoord: [42159.752988444445, 101668.04589451979],
          index: 5,
          data: allData[5]
        };
        const pt7 = {
          screenCoord: [42044.19845688889, 101228.11376437404],
          index: 7,
          data: allData[7]
        };

        const expectedHexCellData = [
          {
            position: [-122.47496374709492, 37.71932315011047],
            points: [pt0, pt1],
            index: 0,
            filteredPoints: []
          },
          {
            position: [-122.2779601982836, 37.44892081775436],
            points: [pt4, pt5],
            index: 1,
            filteredPoints: [pt4, pt5]
          },
          {
            position: [-122.2779601982836, 37.98874207331562],
            points: [pt7],
            index: 2,
            filteredPoints: [pt7]
          }
        ];

        // assigned by d3-hexbin
        expectedHexCellData[0].points.x = 41888.45306522654;
        expectedHexCellData[0].points.y = 101375.32539537722;
        expectedHexCellData[1].points.x = 42031.9066716143;
        expectedHexCellData[1].points.y = 101623.79433016981;
        expectedHexCellData[2].points.x = 42031.9066716143;
        expectedHexCellData[2].points.y = 101126.85646058463;

        const expectedProps = {
          coverage: layer.config.visConfig.coverage,
          radius: layer.config.visConfig.worldUnitSize * 1000,
          colorRange: [
            [8, 8, 8],
            [9, 9, 9],
            [7, 7, 7]
          ],
          colorScaleType: layer.config.colorScale,
          elevationScaleType: layer.config.sizeScale,
          elevationScale: layer.config.visConfig.elevationScale,
          upperPercentile: layer.config.visConfig.percentile[1],
          lowerPercentile: layer.config.visConfig.percentile[0]
        };

        const expectedColorBins = [
          {i: 2, value: 1, counts: 1},
          {i: 1, value: 2, counts: 2},
        ];
        const expectedElevationBins = [
          {i: 2, value: 1, counts: 1},
          {i: 1, value: 2, counts: 2},
        ];

        t.deepEqual(
          hexCellLayer.props.data,
          expectedHexCellData,
          'should pass correct data to hexagon cell layer'
        );

        Object.keys(expectedProps).forEach(key => {
          t.deepEqual(
            props[key],
            expectedProps[key],
            `should have correct props.${key}`
          );
        });

        t.deepEqual(
          spyLayerCallbacks.args[0][0],
          [1, 2],
          'should call onSetLayerDomain with correct domain'
        );

        t.deepEqual(
          state.aggregatorState.dimensions.fillColor.sortedBins.sortedBins,
          expectedColorBins,
          'should create correct color bins'
        );

        t.deepEqual(
          state.aggregatorState.dimensions.elevation.sortedBins.sortedBins,
          expectedElevationBins,
          'should create correct elevation bins'
        );
      }
    }
  ];

  testRenderLayerCases(t, HexagonLayer, TEST_CASES);
  t.end();
});
