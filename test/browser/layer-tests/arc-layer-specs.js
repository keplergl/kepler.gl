// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import moment from 'moment';
import * as arrow from 'apache-arrow';

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
import {copyTableAndUpdate, KeplerTable} from '@kepler.gl/table';
import {arrowSchemaToFields} from '@kepler.gl/processors';
import {cellToLatLng} from 'h3-js';

const {ArcLayer, LineLayer} = KeplerGlLayers;
const columns = {
  lat0: 'lat',
  lng0: 'lng',
  lat1: 'lat_1',
  lng1: 'lng_1'
};

const geoArrowBoundsCases = [ArcLayer, LineLayer].flatMap(LayerClass =>
  [2, 3, 4].map(dimensions => ({LayerClass, dimensions}))
);

geoArrowBoundsCases.forEach(({LayerClass, dimensions}) => {
  test(`#${LayerClass.name} -> GeoArrow ${dimensions}D endpoint bounds across batches`, async t => {
    const pointType = new arrow.FixedSizeList(
      dimensions,
      new arrow.Field('coordinate', new arrow.Float64())
    );
    const coordinates = points =>
      arrow.vectorFromArray(
        points.map(point => (point === null ? null : [...point, 70, 80].slice(0, dimensions))),
        pointType
      );
    const makeTable = (source, target) => {
      const table = new arrow.Table({source: coordinates(source), target: coordinates(target)});
      table.schema.fields.forEach(field =>
        field.metadata.set('ARROW:extension:name', 'geoarrow.point')
      );
      return table;
    };
    const first = makeTable([[10, 20]], [[30, 40]]);
    const dataset = new KeplerTable({info: {id: 'arc-geoarrow-bounds'}, color: [0, 0, 0]});
    await dataset.importData({
      data: {
        fields: arrowSchemaToFields(first),
        cols: first.schema.fields.map((field, index) => first.getChildAt(index))
      }
    });
    const layer = new LayerClass({dataId: dataset.id, columnMode: 'geoarrow'});
    layer.config.columns.geoarrow0 = {value: 'source', fieldIdx: 0};
    layer.config.columns.geoarrow1 = {value: 'target', fieldIdx: 1};
    layer.updateLayerMeta(dataset);
    t.deepEqual(
      layer.getPositionAccessor(dataset.dataContainer)({index: 0}),
      [10, 20, 0, 30, 40, 0],
      'reads longitude and latitude from both point vectors'
    );
    t.deepEqual(layer.meta.bounds, [10, 20, 30, 40], 'bounds include the destination');

    const table = first.concat(
      makeTable(
        [
          [0, 5],
          [12, 22]
        ],
        [
          [50, 60],
          [null, null]
        ]
      )
    );
    // Progressive updates preserve batches; completed imports compact them.
    await dataset.update({
      cols: table.schema.fields.map((field, index) => table.getChildAt(index)),
      arrowTable: table
    });
    t.equal(dataset.dataContainer.getTable().batches.length, 2, 'uses two Arrow record batches');
    layer.updateLayerMeta(dataset);
    t.deepEqual(
      layer.getPositionAccessor(dataset.dataContainer)({index: 1}),
      [0, 5, 0, 50, 60, 0],
      'reads endpoints from the later batch with a global row index'
    );
    t.deepEqual(
      layer.meta.bounds,
      [0, 5, 50, 60],
      'bounds include later destinations and valid zero longitude, excluding null coordinates'
    );

    const nullableTable = table.concat(
      makeTable([null, [-10, -20], null], [[70, 80], null, null])
    );
    await dataset.update({
      cols: nullableTable.schema.fields.map((field, index) => nullableTable.getChildAt(index)),
      arrowTable: nullableTable
    });
    t.doesNotThrow(
      () => layer.updateLayerMeta(dataset),
      'null source, destination, and both endpoint cells do not crash bounds calculation'
    );
    t.deepEqual(
      layer.meta.bounds,
      [-10, -20, 70, 80],
      'valid endpoints still contribute when the other endpoint cell is null'
    );

    const emptyTable = makeTable([null], [null]);
    await dataset.update({
      cols: emptyTable.schema.fields.map((field, index) => emptyTable.getChildAt(index)),
      arrowTable: emptyTable
    });
    t.doesNotThrow(() => layer.updateLayerMeta(dataset), 'all-null endpoint cells are accepted');
    t.equal(layer.meta.bounds, null, 'all-null endpoints have no bounds');
    t.end();
  });
});

[ArcLayer, LineLayer].forEach(LayerClass => {
  ['geoarrow', 'points'].forEach(columnMode => {
    test(`#${LayerClass.name} -> ${columnMode} destination coordinate pairs`, async t => {
      const cases = [
        {target: [null, 80], bounds: [10, 20, 30, 40]},
        {target: [150, null], bounds: [10, 20, 30, 40]},
        {target: [NaN, 80], bounds: [10, 20, 30, 40]},
        {target: [150, NaN], bounds: [10, 20, 30, 40]},
        {target: [Infinity, 80], bounds: [10, 20, 30, 40]},
        {target: [150, Infinity], bounds: [10, 20, 30, 40]},
        {target: [-Infinity, -80], bounds: [10, 20, 30, 40]},
        {target: [-150, -Infinity], bounds: [10, 20, 30, 40]},
        {firstTarget: [150, null], target: [null, 80], bounds: [10, 20, 12, 22]},
        {target: [0, 45], bounds: [0, 20, 30, 45]},
        {target: [35, 0], bounds: [10, 0, 35, 40]},
        {target: [0, 0], bounds: [0, 0, 30, 40]}
      ];
      for (const {target, bounds, firstTarget = [30, 40]} of cases) {
        const pointType = new arrow.FixedSizeList(
          2,
          new arrow.Field('coordinate', new arrow.Float64())
        );
        const table = new arrow.Table({
          source: arrow.vectorFromArray(
            [
              [10, 20],
              [12, 22]
            ],
            pointType
          ),
          target: arrow.vectorFromArray([firstTarget, target], pointType)
        });
        table.schema.fields.forEach(field =>
          field.metadata.set('ARROW:extension:name', 'geoarrow.point')
        );
        const numericTable = new arrow.Table({
          lng0: arrow.vectorFromArray([10, 12], new arrow.Float64()),
          lat0: arrow.vectorFromArray([20, 22], new arrow.Float64()),
          lng1: arrow.vectorFromArray([firstTarget[0], target[0]], new arrow.Float64()),
          lat1: arrow.vectorFromArray([firstTarget[1], target[1]], new arrow.Float64())
        });
        const dataset = new KeplerTable({info: {id: 'endpoint-pairs'}, color: [0, 0, 0]});
        await dataset.importData({
          data:
            columnMode === 'geoarrow'
              ? {
                  fields: arrowSchemaToFields(table),
                  cols: table.schema.fields.map((field, index) => table.getChildAt(index))
                }
              : {
                  fields: arrowSchemaToFields(numericTable),
                  rows: [
                    [10, 20, ...firstTarget],
                    [12, 22, ...target]
                  ]
                }
        });
        const layer = new LayerClass({dataId: dataset.id, columnMode});
        const names =
          columnMode === 'geoarrow' ? ['source', 'target'] : ['lng0', 'lat0', 'lng1', 'lat1'];
        const keys = columnMode === 'geoarrow' ? ['geoarrow0', 'geoarrow1'] : names;
        keys.forEach((key, fieldIdx) => {
          layer.config.columns[key] = {value: names[fieldIdx], fieldIdx};
        });
        layer.updateLayerMeta(dataset);
        t.deepEqual(layer.meta.bounds, bounds, `bounds for target [${target.join(', ')}]`);
      }
      t.end();
    });
  });
});

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
          t.equal(layer.config.visConfig.targetArrowEnabled, false, 'target arrow is off');
          t.equal(layer.config.visConfig.targetArrowShape, 'chevron', 'default arrow shape');
          t.equal(layer.config.visConfig.targetArrowSize, 16, 'default arrow size');
          t.equal(
            layer.visConfigSettings.targetArrowSize.allowCustomValue,
            false,
            'arrow size has no custom input'
          );
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
              sourcePosition: [...cellToLatLng(testArcData[0]['source hex_id']).reverse(), 0],
              targetPosition: [...cellToLatLng(testArcData[0]['target hex_id']).reverse(), 0]
            },
            {
              index: 1,
              sourcePosition: [...cellToLatLng(testArcData[1]['source hex_id']).reverse(), 0],
              targetPosition: [...cellToLatLng(testArcData[1]['target hex_id']).reverse(), 0]
            },
            {
              index: 2,
              sourcePosition: [...cellToLatLng(testArcData[2]['source hex_id']).reverse(), 0],
              targetPosition: [...cellToLatLng(testArcData[2]['target hex_id']).reverse(), 0]
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
    },
    {
      name: 'Arc render layer.3 target arrow',
      layer: {
        config: {
          dataId,
          label: 'trip arcs',
          columns,
          color: [10, 10, 10],
          visConfig: {
            targetArrowEnabled: true,
            targetArrowShape: 'chevron',
            targetArrowSize: 24,
            targetColor: [200, 30, 30]
          }
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
      assert: deckLayers => {
        t.equal(deckLayers.length, 2, 'Should create the arc and an arrow head');
        const arrowLayer = deckLayers[deckLayers.length - 1];
        t.equal(arrowLayer.id, 'test_layer_0-arrow-head-chevron', 'arrow layer id');
        t.equal(arrowLayer.props.pickable, false, 'arrow head does not take the line hover');
        const radius =
          typeof arrowLayer.props.getRadius === 'function'
            ? arrowLayer.props.getRadius(arrowLayer.props.data[0])
            : arrowLayer.props.getRadius;
        t.equal(radius, 24, 'arrow size is the vis config value in pixels');
        t.equal(arrowLayer.props.iconGeometry.length, 18, 'chevron is two triangles');
        const angle = arrowLayer.props.getAngle(arrowLayer.props.data[0]);
        t.equal(typeof angle, 'number', 'arrow angle is computed');
        t.ok(Number.isFinite(angle), 'arrow angle is finite');
        const fill =
          typeof arrowLayer.props.getFillColor === 'function'
            ? arrowLayer.props.getFillColor(arrowLayer.props.data[0])
            : arrowLayer.props.getFillColor;
        t.deepEqual(fill, [200, 30, 30], 'arrow uses the target color');
      }
    },
    {
      name: 'Arc render layer.4 target arrow hover',
      layer: {
        config: {
          dataId,
          label: 'trip arcs',
          columns,
          color: [10, 10, 10],
          visConfig: {
            targetArrowEnabled: true,
            targetArrowShape: 'triangle',
            targetArrowSize: 24
          }
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
        t.equal(arrowLayer.props.opacity, 1, 'highlight arrow is fully opaque');
        const color =
          typeof arrowLayer.props.getFillColor === 'function'
            ? arrowLayer.props.getFillColor(arrowLayer.props.data[0])
            : arrowLayer.props.getFillColor;
        t.deepEqual(color, [252, 242, 26, 255], 'highlight arrow uses the layer highlight color');
      }
    }
  ];

  testRenderLayerCases(t, ArcLayer, TEST_CASES);
  t.end();
});
