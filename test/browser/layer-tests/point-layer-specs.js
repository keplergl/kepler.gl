// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {LayerManager, MapView, _GlobeView} from '@deck.gl/core';
import {device} from '@deck.gl/test-utils';
import {visStateSchemaV1} from '@kepler.gl/schemas';
import PulseRippleExtension from '../../../src/layers/src/point-layer/pulse-ripple-extension';
import PointGlowExtension from '../../../src/layers/src/point-layer/point-glow-extension';
import moment from 'moment';
import {getDistanceScales, zoomToScale} from '@math.gl/web-mercator';
import {scaleQuantize} from 'd3-scale';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import * as arrow from 'apache-arrow';

import {DEFAULT_TEXT_LABEL, PROJECTED_PIXEL_SIZE_MULTIPLIER} from '@kepler.gl/constants';
import {EnhancedMultiIconLayer, EnhancedTextBackgroundLayer} from '@kepler.gl/deckgl-layers';
import {GeoArrowScatterplotLayer} from '@kepler.gl/deckgl-arrow-layers';
import {KeplerGlLayers} from '@kepler.gl/layers';
import {arrowSchemaToFields, processArrowBatches, processGeojson} from '@kepler.gl/processors';
import {
  findDefaultLayer,
  INITIAL_MAP_STATE,
  INITIAL_VIS_STATE,
  layerFilteredItemsChangeUpdater,
  renderDeckGlLayer
} from '@kepler.gl/reducers';
import {copyTableAndUpdate, KeplerTable} from '@kepler.gl/table';
import {hexToRgb} from '@kepler.gl/utils';

import {geoJsonWithStyle, geojsonData} from 'test/fixtures/geojson';
import testArcData, {pointFromNeighbor} from 'test/fixtures/test-arc-data';
import {StateWArcNeighbors} from 'test/helpers/mock-state';
import {createNewDataEntryMock} from 'test/helpers/table-utils';
import {
  testCreateCases,
  testCreateLayerFromConfig,
  testFormatLayerData,
  testFormatLayerDataCases,
  testRenderLayerCases,
  testRenderDeckLayer,
  testUpdateLayer,
  preparedDataset,
  dataId,
  testRows,
  pointLayerMeta,
  fieldDomain
} from 'test/helpers/layer-utils';

const {PointLayer} = KeplerGlLayers;

[PointLayer, KeplerGlLayers.ArcLayer, KeplerGlLayers.LineLayer].forEach(LayerClass => {
  test(`#${LayerClass.name} -> progressive numeric Arrow coordinates render and pick`, async t => {
    const rows = [
      [99, 89, 99, 89, 99], // Padding excluded by the Arrow slices below.
      [10, 20, 30, 40, 5],
      [0, 0, 50, 60, -5],
      [null, 25, 70, null, 10],
      [-10, -20, -30, -40, 15],
      [99, 89, 99, 89, 99]
    ];
    const names = ['lng0', 'lat0', 'lng1', 'lat1', 'altitude'];
    const makeTable = values =>
      new arrow.Table(
        Object.fromEntries(
          names.map((name, index) => [
            name,
            arrow.vectorFromArray(
              values.map(row => row[index]),
              new arrow.Float64()
            )
          ])
        )
      );
    const source = makeTable(rows);
    const empty = new arrow.Table(
      new arrow.RecordBatch(
        Object.fromEntries(
          names.map(name => [
            name,
            arrow.makeData({type: new arrow.Float64(), data: new Float64Array(0)})
          ])
        )
      )
    );
    const first = source.slice(1, 2);
    const appended = new arrow.Table(source.schema, [
      ...first.batches,
      ...empty.batches,
      ...source.slice(2, 4).batches
    ]);
    const complete = new arrow.Table(source.schema, [
      ...appended.batches,
      ...source.slice(4, 5).batches
    ]);
    const dataset = new KeplerTable({info: {id: 'progressive-numeric'}, color: [0, 0, 0]});
    await dataset.importData({data: processArrowBatches(first.batches, {compact: false})});
    const layer = new LayerClass({dataId: dataset.id});
    const isPoint = LayerClass === PointLayer;
    layer.updateLayerConfig({
      columns: Object.fromEntries(
        (isPoint
          ? [
              ['lng', 0],
              ['lat', 1],
              ['altitude', 4]
            ]
          : names.slice(0, 4).map((name, index) => [name, index])
        ).map(([key, fieldIdx]) => [key, {value: names[fieldIdx], fieldIdx}])
      )
    });
    let formatted;
    for (const [label, table, compact] of [
      ['initial', first, false],
      ['appended', appended, false],
      ['appended again', complete, false],
      ['completed', complete, true],
      ['empty', empty, false]
    ]) {
      const data = processArrowBatches(table.batches, {compact});
      await dataset.update(compact ? data : {...data, arrowTable: table});
      dataset.filteredIndex = dataset.allIndexes.filter(index => index !== 1);
      const actualTable = dataset.dataContainer.getTable();
      const expectedLengths = compact ? [4] : table.batches.map(batch => batch.numRows);
      t.deepEqual(
        actualTable.batches.map(batch => batch.numRows),
        expectedLengths,
        `${label}: import batch lengths`
      );
      formatted = layer.formatLayerData({[dataset.id]: dataset}, formatted);
      const [composite] = layer.renderLayer({
        data: formatted,
        dataset,
        idx: 0,
        layerInteraction: {},
        mapState: INITIAL_MAP_STATE,
        gpuFilter: dataset.gpuFilter,
        interactionConfig: INITIAL_VIS_STATE.interactionConfig,
        visible: true,
        layerCallbacks: {}
      });
      let sublayers;
      t.doesNotThrow(() => {
        sublayers = composite.renderLayers();
      }, `${label}: constructs every Arrow sublayer without a batch-count assertion`);
      if (!sublayers) continue;
      t.deepEqual(
        sublayers.map(sublayer => sublayer.props.data.length),
        expectedLengths,
        `${label}: rendered batch lengths`
      );
      let offset = 0;
      for (const sublayer of sublayers) {
        const batchData = sublayer.props.data;
        for (let index = 0; index < batchData.length; index++) {
          const globalIndex = offset + index;
          const row = rows[globalIndex + 1];
          const expected = isPoint
            ? {getPosition: [row[0], row[1], row[4]]}
            : {getSourcePosition: [row[0], row[1], 0], getTargetPosition: [row[2], row[3], 0]};
          for (const [accessor, position] of Object.entries(expected)) {
            const attribute = batchData.attributes[accessor];
            t.deepEqual(
              Array.from(
                attribute.value.slice(index * attribute.size, (index + 1) * attribute.size)
              ),
              position.map(value => Number(value)),
              `${label}: ${accessor} remains aligned, including nullable coordinates`
            );
          }
          t.equal(
            sublayer.props.getFiltered(null, {index, data: batchData}),
            globalIndex === 1 ? 0 : 1,
            `${label}: filter uses global index`
          );
          const picked = composite.getPickingInfo({
            info: {index, picked: true},
            sourceLayer: sublayer
          });
          t.equal(picked.index, globalIndex, `${label}: picking uses global index`);
          t.deepEqual(
            layer.getHoverData(picked.object, dataset.dataContainer, dataset.fields, {}, picked),
            dataset.dataContainer.row(globalIndex),
            `${label}: hover reads the picked source row`
          );
        }
        offset += batchData.length;
      }
    }
    t.end();
  });
});

test('#PointLayer -> native separated points preserve every coordinate through import', async t => {
  for (const dimensions of [2, 3]) {
    for (const separated of [true, false]) {
      const names = ['x', 'y', 'z'].slice(0, dimensions);
      const type = separated
        ? new arrow.Struct(names.map(name => new arrow.Field(name, new arrow.Float64(), false)))
        : new arrow.FixedSizeList(dimensions, new arrow.Field('coords', new arrow.Float64()));
      const coordinates = [
        [10, 20, 5],
        [30, 40, 15],
        [50, 60, 25]
      ].map(p => p.slice(0, dimensions));
      const batches = [coordinates.slice(0, 2), coordinates.slice(2)].map(points => {
        const table = new arrow.Table({
          geometry: arrow.vectorFromArray(
            separated
              ? points.map(point => Object.fromEntries(names.map((name, i) => [name, point[i]])))
              : points,
            type
          )
        });
        table.schema.fields[0].metadata.set('ARROW:extension:name', 'geoarrow.point');
        return table;
      });
      const table = arrow.tableFromIPC(arrow.tableToIPC(batches[0].concat(batches[1]), 'file'));
      const originalBytes = arrow.tableToIPC(table, 'file');
      const dataset = new KeplerTable({info: {id: 'native-points'}, color: [0, 0, 0]});
      await dataset.importData({data: processArrowBatches(table.batches)});
      const [geojson] = findDefaultLayer(dataset, {geojson: KeplerGlLayers.GeojsonLayer});
      t.ok(geojson, 'native point metadata discovers the default GeoJSON layer');
      geojson.formatLayerData({[dataset.id]: dataset});
      t.deepEqual(
        Array.from(geojson.dataToFeature[0].points.positions.value),
        coordinates.flat(),
        'default GeoJSON positions contain every axis'
      );
      t.equal(geojson.dataToFeature[0].points.positions.size, dimensions, 'GeoJSON position size');
      t.deepEqual(
        geojson.meta.bounds,
        [10, 20, 50, 60],
        'GeoJSON bounds use longitude and latitude'
      );

      // Progressive imports retain unequal record batches, including Arrow slices.
      const sliced = table.slice(1);
      await dataset.update({cols: [sliced.getChildAt(0)], arrowTable: sliced});
      const layer = new PointLayer({dataId: dataset.id, columnMode: 'geoarrow'});
      layer.config.columns.geoarrow = {value: 'geometry', fieldIdx: 0};
      const formatted = layer.formatLayerData({[dataset.id]: dataset});
      const [composite] = layer.renderLayer({
        data: formatted,
        dataset,
        idx: 0,
        layerInteraction: {},
        mapState: INITIAL_MAP_STATE,
        gpuFilter: dataset.gpuFilter,
        interactionConfig: INITIAL_VIS_STATE.interactionConfig,
        visible: true,
        layerCallbacks: {}
      });
      const sublayers = composite.renderLayers();
      t.equal(sublayers.length, 2, 'Point retains both sliced batches');
      sublayers.forEach((sublayer, i) => {
        const position = sublayer.props.data.attributes.getPosition;
        t.deepEqual(
          Array.from(position.value),
          coordinates[i + 1],
          'Point positions include latitude and altitude'
        );
        t.equal(position.size, dimensions, 'Point position size');
        t.equal(
          composite.getPickingInfo({info: {index: 0}, sourceLayer: sublayer}).index,
          i,
          'picking remains aligned'
        );
      });
      t.deepEqual(layer.meta.bounds, [30, 40, 50, 60], 'Point bounds reflect the slice');
      t.deepEqual(arrow.tableToIPC(table, 'file'), originalBytes, 'rendering preserves the source');
    }
  }
  t.end();
});

['point', 'multipoint'].forEach(geometryType => {
  [false, true].forEach(gpu => {
    test(`#PointLayer -> batched Arrow ${geometryType} accessors (${
      gpu ? 'GPU' : 'CPU'
    })`, async t => {
      const pointType = new arrow.FixedSizeList(2, new arrow.Field('xy', new arrow.Float64()));
      const type =
        geometryType === 'multipoint'
          ? new arrow.List(new arrow.Field('points', pointType))
          : pointType;
      const coordinates =
        geometryType === 'multipoint'
          ? [
              [
                [
                  [0, 0],
                  [1, 1]
                ],
                [],
                [[2, 2]]
              ],
              [
                [
                  [3, 3],
                  [4, 4]
                ],
                [[5, 5]]
              ]
            ]
          : [
              [
                [0, 0],
                [1, 1],
                [2, 2]
              ],
              [
                [3, 3],
                [4, 4]
              ]
            ];
      const values = [
        [10, 50, 20],
        [90, 30]
      ];
      const batches = coordinates.map((coords, index) => {
        const table = new arrow.Table({
          geometry: arrow.vectorFromArray(coords, type),
          value: arrow.vectorFromArray(values[index], new arrow.Float64())
        });
        table.schema.fields[0].metadata.set('ARROW:extension:name', `geoarrow.${geometryType}`);
        return table;
      });
      // IPC buffers can contain alignment padding after the logical offsets.
      const table = arrow.tableFromIPC(arrow.tableToIPC(batches[0].concat(batches[1]), 'file'));
      const originalBytes = arrow.tableToIPC(table, 'file');
      const dataset = new KeplerTable({info: {id: 'batched'}, color: [0, 0, 0]});
      await dataset.importData({
        data: {
          fields: arrowSchemaToFields(table),
          cols: batches[0].schema.fields.map((field, index) => batches[0].getChildAt(index))
        }
      });
      // Progressive updates preserve batches; completed imports compact them.
      await dataset.update({
        cols: table.schema.fields.map((field, index) => table.getChildAt(index)),
        arrowTable: table
      });
      const layer = new PointLayer({dataId: dataset.id});
      layer.config.columnMode = 'geoarrow';
      layer.config.columns.geoarrow = {value: 'geometry', fieldIdx: 0};
      layer.config.colorField = dataset.fields[1];
      layer.config.sizeField = dataset.fields[1];
      layer.config.sizeScale = 'linear';
      layer.config.visConfig.radiusRange = [10, 90];
      layer.updateLayerDomain({[dataset.id]: dataset});
      dataset.filterTable(
        [
          {
            id: 'later-batch',
            dataId: ['unrelated', dataset.id],
            name: ['other', 'value'],
            fieldIdx: [0, 1],
            type: 'range',
            value: [80, 100],
            domain: [10, 90],
            enabled: true,
            fixedDomain: true,
            gpu,
            gpuChannel: [2, 0]
          }
        ],
        [layer]
      );
      const formatted = layer.formatLayerData({[dataset.id]: dataset});
      const onFilteredItemsChange = () => {};
      const render = () =>
        layer.renderLayer({
          data: formatted,
          dataset,
          idx: 0,
          layerInteraction: {},
          mapState: INITIAL_MAP_STATE,
          gpuFilter: dataset.gpuFilter,
          interactionConfig: INITIAL_VIS_STATE.interactionConfig,
          visible: true,
          layerCallbacks: {onFilteredItemsChange}
        });
      const rowIndices =
        geometryType === 'multipoint'
          ? [
              [0, 0, 2],
              [3, 3, 4]
            ]
          : [
              [0, 1, 2],
              [3, 4]
            ];
      for (const {pulseEnabled, glowEnabled} of [
        {pulseEnabled: false, glowEnabled: false},
        {pulseEnabled: false, glowEnabled: true},
        {pulseEnabled: true, glowEnabled: true},
        {pulseEnabled: true, glowEnabled: false},
        {pulseEnabled: false, glowEnabled: false}
      ]) {
        layer.updateLayerVisConfig({
          pulseEnabled,
          glowEnabled,
          glowExtent: 3,
          glowStrength: 0.7,
          pulseMode: 'ripple',
          pulseSpeed: 2,
          pulseExpansion: 3
        });
        const rendered = render();
        t.equal(rendered.length, glowEnabled ? 2 : 1, 'only enabled glow adds a renderer');
        for (const composite of rendered) {
          const isGlow = composite.id.endsWith('-glow');
          const sublayers = composite.renderLayers();
          t.equal(sublayers.length, 2, 'renders both Arrow record batches');
          sublayers.forEach((sublayer, batchIndex) => {
            const {props} = sublayer;
            t.equal(
              props.extensions.some(extension => extension instanceof PulseRippleExtension),
              pulseEnabled && !isGlow,
              'only the ordinary Arrow points animate'
            );
            t.equal(
              props.extensions.some(extension => extension instanceof PointGlowExtension),
              isGlow,
              'only the halo batch has glow shaders'
            );
            if (isGlow) {
              t.notOk(props.pickable, 'halo batches do not change picking');
              t.equal(props.glowExtent, 3, 'Arrow batch inherits extent');
              t.equal(props.glowStrength, 0.7, 'Arrow batch inherits strength');
              t.notOk(props.onFilteredItemsChange, 'halo batches do not report data counts');
            } else {
              t.equal(
                props.onFilteredItemsChange,
                onFilteredItemsChange,
                'core batches retain count reporting'
              );
            }
            t.equal(props.pulseMode, 'ripple', 'Arrow batch inherits effect style');
            t.equal(props.pulseSpeed, 2, 'Arrow batch inherits speed');
            t.equal(props.pulseExpansion, 3, 'Arrow batch inherits expansion');
            t.equal(
              props.data.length,
              rowIndices[batchIndex].length,
              'empty features add no points'
            );
            rowIndices[batchIndex].forEach((rowIndex, index) => {
              const context = {index, data: props.data, target: []};
              const expected = {index: rowIndex};
              t.equal(
                props.getRadius(null, context),
                formatted.getRadius(expected),
                'radius uses the feature row'
              );
              t.deepEqual(
                props.getFillColor(null, context),
                formatted.getFillColor(expected),
                'color uses the feature row'
              );
              t.equal(
                props.getFiltered(null, context),
                formatted.getFiltered(expected),
                'CPU mask uses the feature row'
              );
              const filterValues = props.getFilterValue(null, context);
              t.deepEqual(
                filterValues,
                formatted.getFilterValue(expected),
                'GPU values use the feature row'
              );
              const [min, max] = dataset.gpuFilter.filterRange[0];
              const visible =
                Boolean(props.getFiltered(null, context)) &&
                filterValues[0] >= min &&
                filterValues[0] <= max;
              t.equal(visible, rowIndex === 3, 'only the matching later-batch feature is visible');
              const picked = composite.getPickingInfo({info: {index}, sourceLayer: sublayer});
              t.equal(picked.index, rowIndex, 'rendered attributes agree with the picked feature');
            });
          });
          t.equal(
            sublayers[1].props.getRadius(null, {
              index: 0,
              data: sublayers[1].props.data,
              target: []
            }),
            90,
            'later batch reads 90 rather than the first batch value 10'
          );
        }
      }
      const vectorLayer = new GeoArrowScatterplotLayer({
        id: 'batched-vector-radius',
        data: table,
        getPosition: table.getChild('geometry'),
        getRadius: table.getChild('value')
      });
      vectorLayer.renderLayers().forEach((sublayer, batchIndex) => {
        t.deepEqual(
          Array.from(sublayer.props.data.attributes.getRadius.value),
          rowIndices[batchIndex].map(index => values.flat()[index]),
          'vector radius uses the correct row across unequal batches'
        );
      });
      t.deepEqual(
        arrow.tableToIPC(table, 'file'),
        originalBytes,
        'rendering preserves source data'
      );
      t.end();
    });
  });
});

test('#PointLayer -> MultiPoint IPC offset padding and vector attributes', async t => {
  const pointType = new arrow.FixedSizeList(2, new arrow.Field('xy', new arrow.Float64()));
  const type = new arrow.List(new arrow.Field('points', pointType));
  const colorType = new arrow.FixedSizeList(3, new arrow.Field('rgb', new arrow.Uint8()));
  const cases = [
    {name: 'two rows', coords: [[[0, 0]], [[1, 1]]]},
    {name: 'three rows', coords: [[[0, 0]], [[1, 1]], [[2, 2]]]},
    {name: 'empty first row', coords: [[], [[1, 1]]]},
    {name: 'empty last row', coords: [[[0, 0]], []]},
    {name: 'all empty', coords: [[], []]}
  ];
  for (const {name, coords} of cases) {
    const values = coords.map((_, index) => 10 + index * 40);
    const colors = values.map(value => [value, value + 1, value + 2]);
    const input = new arrow.Table({
      geometry: arrow.vectorFromArray(coords, type),
      value: arrow.vectorFromArray(values, new arrow.Float32()),
      color: arrow.vectorFromArray(colors, colorType)
    });
    input.schema.fields[0].metadata.set('ARROW:extension:name', 'geoarrow.multipoint');
    const bytes = arrow.tableToIPC(input, 'file');
    const table = arrow.tableFromIPC(bytes);
    const originalBytes = bytes.slice();
    const dataset = new KeplerTable({info: {id: name}, color: [0, 0, 0]});
    await dataset.importData({data: processArrowBatches(table.batches)});
    const layer = new PointLayer({dataId: dataset.id, columnMode: 'geoarrow'});
    layer.config.columns.geoarrow = {value: 'geometry', fieldIdx: 0};
    layer.config.sizeField = dataset.fields[1];
    layer.config.sizeScale = 'linear';
    layer.config.visConfig.radiusRange = [10, values[values.length - 1]];
    layer.updateLayerDomain({[dataset.id]: dataset});
    const formatted = layer.formatLayerData({[dataset.id]: dataset});
    const [composite] = layer.renderLayer({
      data: formatted,
      dataset,
      idx: 0,
      layerInteraction: {},
      mapState: INITIAL_MAP_STATE,
      gpuFilter: dataset.gpuFilter,
      interactionConfig: INITIAL_VIS_STATE.interactionConfig,
      visible: true,
      layerCallbacks: {}
    });
    const [sublayer] = composite.renderLayers();
    const rowIndices = coords.flatMap((points, index) => points.map(() => index));
    t.equal(sublayer.props.data.length, rowIndices.length, `${name}: empty rows add no points`);
    rowIndices.forEach((row, index) => {
      const context = {index, data: sublayer.props.data, target: []};
      t.equal(sublayer.props.getRadius(null, context), values[row], `${name}: correct radius`);
      t.equal(sublayer.props.getFiltered(null, context), 1, `${name}: point remains visible`);
      t.equal(
        composite.getPickingInfo({info: {index}, sourceLayer: sublayer}).index,
        row,
        `${name}: correct picked row`
      );
    });
    const vectorLayer = new GeoArrowScatterplotLayer({
      id: `${name}-vectors`,
      data: table,
      getPosition: table.getChild('geometry'),
      getRadius: table.getChild('value'),
      getFillColor: table.getChild('color')
    });
    const [vectorSublayer] = vectorLayer.renderLayers();
    t.deepEqual(
      Array.from(vectorSublayer.props.data.attributes.getRadius.value),
      rowIndices.map(index => values[index]),
      `${name}: expands numeric Arrow attributes`
    );
    t.deepEqual(
      Array.from(vectorSublayer.props.data.attributes.getFillColor.value),
      rowIndices.flatMap(index => colors[index]),
      `${name}: expands vector Arrow attributes`
    );
    t.deepEqual(bytes, originalBytes, `${name}: leaves the source IPC buffer unchanged`);
    t.deepEqual(arrow.tableToIPC(table, 'file'), originalBytes, `${name}: preserves source values`);
  }
  t.end();
});

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
          t.ok(layer.config.dataId === 'smoothie', 'PointLayer dataId should be correct');
          t.ok(layer.type === 'point', 'type should be point');
          t.equal(layer.config.visConfig.pulseEnabled, false, 'point animation is off by default');
          t.ok(layer.isAggregated === false, 'PointLayer is not aggregated');
          t.ok(layer.config.label === 'test point layer', 'label should be correct');
          t.deepEqual(
            layer.columnPairs,
            {
              lat: {pair: ['lng', 'altitude'], fieldPairKey: 'lat'},
              lng: {pair: ['lat', 'altitude'], fieldPairKey: 'lng'},
              altitude: {pair: ['lng', 'lat'], fieldPairKey: 'altitude'}
            },
            'columnPairs should be correct'
          );
        }
      }
    ]
  };

  testCreateCases(t, PointLayer, TEST_CASES.CREATE);
  t.end();
});

test('#PointLayer -> formatLayerData', t => {
  const filteredIndex = [0, 2, 4];
  const filterDomain0 = 1474071056000;
  const TEST_CASES = [
    {
      name: 'Point gps point.1',
      layer: {
        config: {
          dataId,
          label: 'gps point',
          columns: {
            lat: 'lat',
            lng: 'lng',
            altitude: 'id'
          },
          textLabel: [
            {
              field: {
                name: 'types',
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
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
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
              index: 0,
              position: [testRows[0][2], testRows[0][1], testRows[0][7]]
            },
            {
              index: 4,
              position: [testRows[4][2], testRows[4][1], testRows[4][7]]
            }
          ],
          getFilterValue: () => {},
          getFiltered: () => {},
          getFillColor: () => {},
          getLineColor: () => {},
          getRadius: () => {},
          getPosition: () => {}
        };

        t.deepEqual(
          Object.keys(layerData).sort(),
          Object.keys(expectedLayerData).sort(),
          'layerData should have 7 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct point layerData data'
        );
        // getPosition
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [testRows[0][2], testRows[0][1], testRows[0][7]],
          'getPosition should return correct position'
        );
        // getFillColor
        t.deepEqual(
          layerData.getFillColor,
          layer.config.color,
          'getFillColor should be a constant'
        );
        // getLineColor
        t.deepEqual(layerData.getLineColor, [1, 2, 3], 'getLineColor should be a constant');
        // getRadius
        t.equal(layerData.getRadius, 1, 'getRadius should be a constant');
        // getFilterValue
        t.deepEqual(
          layerData.data.map(layerData.getFilterValue),
          [
            [Number.MIN_SAFE_INTEGER, 0, 0, 0],
            [moment.utc(testRows[4][0]).valueOf() - filterDomain0, 0, 0, 0]
          ],
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
          ['d', 'r', 'i', 'v', 'e', '_', 'a', 'n', 'l', 'y', 't', 'c', 's', '0'],
          'textLabels should have correct characterSet'
        );
        t.deepEqual(
          layerData.textLabels[0].getText(layerData.data[0]),
          'driver_analytics_0',
          'textLabels getText should have correct text'
        );
        // layerMeta
        t.deepEqual(layer.meta, pointLayerMeta, 'should format correct point layer meta');
      }
    },
    {
      name: 'Test gps point.2 Data colorFields. sizeField and fixedRadius',
      layer: {
        type: 'point',
        id: 'test_layer_2',
        config: {
          dataId,
          label: 'some point file',
          columns: {
            lat: 'lat',
            lng: 'lng'
          },
          visConfig: {
            outline: true,
            fixedRadius: true,
            colorRange: {
              colors: ['#010101', '#020202', '#030303']
            },
            strokeColor: [4, 5, 6]
          },
          // color by id(integer)
          colorField: {
            type: 'integer',
            name: 'id'
          },
          // size by id(integer)
          sizeField: {
            type: 'integer',
            name: 'id'
          }
        }
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
              position: [testRows[0][2], testRows[0][1], 0]
            },
            {
              index: 4,
              position: [testRows[4][2], testRows[4][1], 0]
            }
          ],
          getFilterValue: () => {},
          getFiltered: () => {},
          getLineColor: () => {},
          getFillColor: () => {},
          getRadius: () => {},
          getPosition: () => {},
          textLabels: []
        };
        t.deepEqual(
          Object.keys(layerData).sort,
          Object.keys(expectedLayerData).sort,
          'layerData should have 7 keys'
        );
        t.deepEqual(layer.config.colorDomain, fieldDomain.id, 'should update layer color domain');
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should filter out nulls, format correct point layerData'
        );
        // getPosition
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [testRows[0][2], testRows[0][1], 0],
          'getPosition should return correct lat lng'
        );
        // layerMeta
        t.deepEqual(layer.meta, pointLayerMeta, 'should format correct layerMeta');
        // getFillColor
        t.deepEqual(
          layerData.getFillColor(layerData.data[0]),
          [1, 1, 1],
          'getFillColor should return correct color'
        );
        // getLineColor
        t.deepEqual(layerData.getLineColor, [4, 5, 6], 'getLineColor should return correct color');
        // getRadius
        // domain [1, 12124]
        t.equal(layerData.getRadius(layerData.data[0]), 1, 'getRadius should return fixed radius');
      }
    },
    {
      name: 'Test gps point.2 Data strokeColorFields and SizeField',
      layer: {
        type: 'point',
        id: 'test_layer_2',
        config: {
          dataId,
          label: 'some point file',
          columns: {
            lat: 'lat',
            lng: 'lng'
          },
          color: [10, 10, 10],
          visConfig: {
            outline: true,
            colorRange: {
              colors: ['#010101', '#020202', '#030303']
            },
            strokeColorRange: {
              colors: ['#040404', '#050505', '#060606']
            },
            strokeColor: [4, 5, 6],
            radiusRange: [10, 100]
          },
          // color by id(integer)
          strokeColorField: {
            type: 'integer',
            name: 'id'
          },
          // size by id(integer)
          sizeField: {
            type: 'integer',
            name: 'id'
          }
        }
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
              position: [testRows[0][2], testRows[0][1], 0]
            },
            {
              index: 4,
              position: [testRows[4][2], testRows[4][1], 0]
            }
          ],
          getFilterValue: () => {},
          getFiltered: () => {},
          getLineColor: () => {},
          getFillColor: () => {},
          getRadius: () => {},
          getPosition: () => {},
          textLabels: []
        };

        t.deepEqual(
          Object.keys(layerData).sort(),
          Object.keys(expectedLayerData).sort(),
          'layerData should have 6 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct point layerData data'
        );
        t.deepEqual(
          layer.config.sizeDomain,
          [fieldDomain.id[0], fieldDomain.id[fieldDomain.id.length - 1]],
          'should update layer sizeDomain'
        );
        // getFillColor
        t.deepEqual(
          layerData.getFillColor,
          [10, 10, 10],
          'getFillColor should return correct color'
        );
        // getLineColor
        t.deepEqual(
          layerData.getLineColor(layerData.data[0]),
          [4, 4, 4],
          'getLineColor should return correct color'
        );
        // getRadius
        // domain [1, 12124]
        // range [10, 100]
        t.equal(
          layerData.getRadius(layerData.data[0]),
          10,
          'getRadius should return corrent radius'
        );
      }
    },
    {
      name: 'Test gps point.2 Data with fixed radius and null SizeField',
      layer: {
        type: 'point',
        id: 'test_layer_2',
        config: {
          dataId,
          label: 'some point file',
          columns: {
            lat: 'lat',
            lng: 'lng'
          },
          color: [10, 10, 10],
          visConfig: {
            outline: true,
            fixedRadius: true
          },
          // size by id(integer)
          sizeField: null
        }
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
              position: [testRows[0][2], testRows[0][1], 0]
            },
            {
              index: 4,
              position: [testRows[4][2], testRows[4][1], 0]
            }
          ],
          getFilterValue: () => {},
          getFiltered: () => {},
          getLineColor: () => {},
          getFillColor: () => {},
          getRadius: () => {},
          getPosition: () => {},
          textLabels: []
        };

        t.deepEqual(
          Object.keys(layerData).sort(),
          Object.keys(expectedLayerData).sort(),
          'layerData should have 6 keys'
        );
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct point layerData data'
        );
        t.deepEqual(layer.config.sizeDomain, [0, 1], 'should update layer sizeDomain');
        // getRadius should be a constant because sizeField is null
        t.equal(layerData.getRadius, 1, 'getRadius should return current radius');
      }
    },
    {
      name: 'Arc data from neighbors',
      layer: pointFromNeighbor,
      datasets: StateWArcNeighbors.visState.datasets,
      assert: result => {
        const {layerData} = result;
        const expectedLayerData = {
          data: [
            {
              index: 0,
              position: [testArcData[0].longitude, testArcData[0].latitude, 0],
              neighbors: testArcData[0].neighbors
            },
            {
              index: 1,
              position: [testArcData[1].longitude, testArcData[1].latitude, 0],
              neighbors: testArcData[1].neighbors
            }
          ]
        };

        for (let i = 0; i < 2; i++) {
          t.deepEqual(
            layerData.data[i],
            expectedLayerData.data[i],
            'should format correct point layerData data with neighbors'
          );
        }
      }
    },
    {
      name: 'Test gps point.2 Data colorFields, domainStops',
      layer: {
        type: 'point',
        id: 'test_layer_2',
        config: {
          dataId,
          label: 'some point file',
          columns: {
            lat: 'lat',
            lng: 'lng'
          },
          visConfig: {
            outline: true,
            fixedRadius: true,
            colorRange: {
              colors: ['#010101', '#020202', '#030303', '#040404', '#050505', '#060606', '#070707']
            },
            strokeColor: [4, 5, 6]
          },
          // color by id(integer)
          colorField: {
            type: 'integer',
            name: 'id'
          },
          colorScale: 'quantize'
        }
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: result => {
        const {layer} = result;
        layer.config.colorDomain = {
          z: [2, 3, 4, 5],
          stops: [
            [0, 20],
            [0, 30],
            [0, 40],
            [0, 50]
          ]
        };

        const layerData = layer.formatLayerData({
          [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
        });

        // get scale function
        const getFillColor0 = layerData.getFillColor(1);
        const getFillColor = layerData.getFillColor(1);
        t.equal(layerData.getFillColorByZoom, true, 'should set getFillColorByZoom to truthy');
        t.equal(getFillColor0, getFillColor, 'function should be memoized');

        const expectedScale = scaleQuantize()
          .domain([0, 20])
          .range(layer.config.visConfig.colorRange.colors);

        const expectedColors = [
          hexToRgb(expectedScale(preparedDataset.dataContainer.row(0).valueAt(7))),
          [0, 0, 0, 0],
          hexToRgb(expectedScale(preparedDataset.dataContainer.row(2).valueAt(7))),
          hexToRgb(expectedScale(preparedDataset.dataContainer.row(3).valueAt(7))),
          hexToRgb(expectedScale(preparedDataset.dataContainer.row(4).valueAt(7))),
          hexToRgb(expectedScale(preparedDataset.dataContainer.row(5).valueAt(7)))
        ];
        for (let i = 0; i < 6; i++) {
          t.deepEqual(
            getFillColor({
              data: preparedDataset.dataContainer.row(i),
              index: i
            }),
            expectedColors[i],
            `Should get corrent value from zoom scale for ${preparedDataset.dataContainer
              .row(i)
              .valueAt(7)}`
          );
        }
        // should use domain [0, 20]
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
            lat: 'lat',
            lng: 'lng',
            altitude: null
          },
          strokeColorField: {
            type: 'string',
            name: 'types'
          },
          color: [1, 2, 3],
          visConfig: {
            strokeColorRange: {
              colors: ['#040404', '#050505', '#060606']
            },
            thickness: 3
          }
        }
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: (deckLayers, layer) => {
        t.equal(deckLayers.length, 1, 'Should create 1 deck.gl layer');
        const {props} = deckLayers[0];
        const expectedProps = {
          opacity: layer.config.visConfig.opacity,
          stroked: layer.config.visConfig.outline,
          filled: layer.config.visConfig.filled,
          radiusScale: layer.getRadiusScaleByZoom(INITIAL_MAP_STATE),
          lineWidthScale: layer.config.visConfig.thickness,
          filterRange: preparedDataset.gpuFilter.filterRange
        };
        Object.keys(expectedProps).forEach(key => {
          t.deepEqual(props[key], expectedProps[key], `should have correct props.${key}`);
        });
      }
    },
    {
      name: 'Point gps point.1 with text labels',
      layer: {
        config: {
          dataId,
          label: 'gps point',
          columns: {
            lat: 'lat',
            lng: 'lng',
            altitude: 'id'
          },
          textLabel: [
            {
              field: {
                name: 'types',
                type: 'string'
              }
              // default anchor: start, alignment: center
            },
            {
              field: {
                name: 'has_result',
                type: 'boolean'
              },
              anchor: 'middle',
              alignment: 'bottom'
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
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: (deckLayers, layer, layerData) => {
        t.equal(deckLayers.length, 5, 'Should create 5 deck.gl layer');
        t.deepEqual(
          deckLayers.map(l => l.id),
          [
            'test_layer_1',
            'test_layer_1-label-types',
            'test_layer_1-label-types-characters',
            'test_layer_1-label-has_result',
            'test_layer_1-label-has_result-characters'
          ],
          'Should create 5 deck.gl layers'
        );
        // test test_layer_1-label-types-characters
        const {getPosition, getColor, getSize, getPixelOffset, getFilterValue} =
          deckLayers[2].props;
        const {getPixelOffset: getPixelOffset1} = deckLayers[4].props;

        const distanceScale = getDistanceScales(INITIAL_MAP_STATE);
        const radiusScale = layer.getRadiusScaleByZoom(INITIAL_MAP_STATE);
        const pixelRadius =
          radiusScale * distanceScale.unitsPerMeter[0] * zoomToScale(INITIAL_MAP_STATE.zoom);

        const padding = 20;

        // anchor: start, alignment: center
        const expectedPixelOffset0 = [1 * (pixelRadius + padding), 0 * (pixelRadius + padding + 0)];

        // anchor: 'middle', alignment: 'bottom'
        const expectedPixelOffset1 = [
          0 * (pixelRadius + padding),
          1 * (pixelRadius + padding + DEFAULT_TEXT_LABEL.size)
        ];

        t.deepEqual(
          getPosition(layerData.data[0]),
          [testRows[0][2], testRows[0][1], 1],
          'Should calculate correct getPosition'
        );
        t.deepEqual(getColor, DEFAULT_TEXT_LABEL.color, 'Should calculate correct getColor');
        t.deepEqual(getSize, PROJECTED_PIXEL_SIZE_MULTIPLIER, 'Should calculate correct getSize');
        t.deepEqual(
          getPixelOffset,
          expectedPixelOffset0,
          'Should calculate correct instancePixelOffset'
        );
        t.deepEqual(
          getPixelOffset1,
          expectedPixelOffset1,
          'Should calculate correct instancePixelOffset'
        );
        t.deepEqual(
          getFilterValue(layerData.data[0]),
          [Number.MIN_SAFE_INTEGER, 0, 0, 0],
          'Should calculate correct instancePixelOffset'
        );
        t.notOk(
          (deckLayers[1].props.extensions || []).some(
            ext => ext.constructor.extensionName === 'CollisionFilterExtension'
          ),
          'Should not add CollisionFilterExtension when collision is off'
        );
        t.notOk(
          deckLayers[1].props.collisionEnabled,
          'Should leave collision filtering disabled by default'
        );
      }
    },
    {
      name: 'Point gps point.1 with text labels and collision filtering',
      layer: {
        config: {
          dataId,
          label: 'gps point',
          columns: {
            lat: 'lat',
            lng: 'lng',
            altitude: 'id'
          },
          textLabel: [
            {
              field: {
                name: 'types',
                type: 'string'
              },
              collisionEnabled: true
            }
          ]
        },
        type: 'point',
        id: 'test_layer_1'
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: deckLayers => {
        const labelLayer = deckLayers.find(l => l.id === 'test_layer_1-label-types-collision');
        t.ok(labelLayer, 'Should create a text label layer');
        t.ok(
          labelLayer.props.extensions.some(
            ext => ext.constructor.extensionName === 'CollisionFilterExtension'
          ),
          'Should add CollisionFilterExtension to the text label layer'
        );
        t.equal(labelLayer.props.collisionEnabled, true, 'Should enable collision filtering');
        t.equal(
          labelLayer.props.collisionGroup,
          'test_layer_1-text-label-0',
          'Should use a per-label collision group'
        );
        t.equal(
          labelLayer.constructor.layerName,
          'CollisionTextLayer',
          'Should use CollisionTextLayer so the hit area covers the anchor'
        );
        t.equal(labelLayer.props.background, true, 'Should enable a collision background');
        t.equal(
          labelLayer.props.collisionShowBackground,
          false,
          'Should hide the collision-only background in the color pass'
        );
      }
    },
    {
      name: 'Point gps point.1 with text labels, collision filtering and visible background',
      layer: {
        config: {
          dataId,
          label: 'gps point',
          columns: {
            lat: 'lat',
            lng: 'lng',
            altitude: 'id'
          },
          textLabel: [
            {
              field: {
                name: 'types',
                type: 'string'
              },
              background: true,
              collisionEnabled: true
            }
          ]
        },
        type: 'point',
        id: 'test_layer_1'
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: deckLayers => {
        const labelLayer = deckLayers.find(l => l.id === 'test_layer_1-label-types-collision');
        t.ok(labelLayer, 'Should create a text label layer');
        t.equal(
          labelLayer.constructor.layerName,
          'CollisionTextLayer',
          'Should use CollisionTextLayer so the hit area covers the anchor'
        );
        t.equal(labelLayer.props.background, true, 'Should keep the user background enabled');
        t.equal(
          labelLayer.props.collisionShowBackground,
          true,
          'Should still draw the user background in the color pass'
        );
      }
    },
    {
      name: 'Point gps point.1 with text labels, color and sizeField',
      layer: {
        config: {
          dataId,
          label: 'gps point',
          columns: {
            lat: 'lat',
            lng: 'lng',
            altitude: 'id'
          },
          textLabel: [
            {
              field: {
                name: 'types',
                type: 'string'
              },
              color: [2, 2, 2],
              size: 10,
              anchor: 'start',
              alignment: 'bottom'
            }
          ],
          // size by id(integer)
          sizeField: {
            type: 'integer',
            name: 'id'
          },
          visConfig: {
            strokeColor: [1, 2, 3]
          }
        },
        type: 'point',
        id: 'test_layer_1'
      },
      datasets: {
        [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
      },
      assert: (deckLayers, layer, layerData) => {
        t.deepEqual(
          deckLayers.map(l => l.id),
          ['test_layer_1', 'test_layer_1-label-types', 'test_layer_1-label-types-characters'],
          'Should create 3 deck.gl layers'
        );
        // test test_layer_1-label-types
        const {getColor, getSize, getPixelOffset} = deckLayers[2].props;

        const distanceScale = getDistanceScales(INITIAL_MAP_STATE);
        const radiusScale = layer.getRadiusScaleByZoom(INITIAL_MAP_STATE);
        const pixelRadius =
          radiusScale * distanceScale.unitsPerMeter[0] * zoomToScale(INITIAL_MAP_STATE.zoom);

        const padding = 20;

        // anchor: start, alignment: center
        const getRadius = layerData.getRadius(layerData.data[1]);

        const expectedPixelOffset1 = [
          getRadius * pixelRadius + padding,
          getRadius * pixelRadius + padding + 10
        ];
        t.deepEqual(getColor, [2, 2, 2], 'Should calculate correct getColor');
        t.deepEqual(getSize, PROJECTED_PIXEL_SIZE_MULTIPLIER, 'Should calculate correct getSize');
        t.deepEqual(
          getPixelOffset(layerData.data[1]),
          expectedPixelOffset1,
          'Should calculate correct instancePixelOffset multiplied by getRadius'
        );
      }
    }
  ];

  testRenderLayerCases(t, PointLayer, TEST_CASES);
  t.end();
});

test('#PointLayer -> renderLayer split map label visibility', t => {
  const filteredIndex = [0, 2, 4];
  const tc = {
    layer: {
      config: {
        dataId,
        label: 'gps point',
        columns: {
          lat: 'lat',
          lng: 'lng',
          altitude: 'id'
        },
        textLabel: [
          {
            field: {
              name: 'types',
              type: 'string'
            }
          }
        ]
      },
      type: 'point',
      id: 'test_layer_1'
    },
    datasets: {
      [dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex})
    }
  };

  const layer = testCreateLayerFromConfig(t, tc, {point: PointLayer});
  const data = testFormatLayerData(t, layer, tc.datasets);

  const renderWithMapLayers = mapLayers =>
    renderDeckGlLayer(
      {
        datasets: tc.datasets,
        layer,
        layerIndex: 0,
        data,
        mapState: INITIAL_MAP_STATE,
        interactionConfig: INITIAL_VIS_STATE.interactionConfig,
        mapLayers
      },
      {}
    );

  const assertVisible = (deckLayers, expected, message) => {
    const labelLayers = deckLayers.filter(l => String(l.id).includes('-label-'));
    t.ok(labelLayers.length > 0, `should create text label layers (${message})`);
    t.equal(deckLayers[0].props.visible, expected, `geometry ${message}`);
    labelLayers.forEach(l => {
      t.equal(l.props.visible, expected, `${l.id} ${message}`);
    });
  };

  assertVisible(
    renderWithMapLayers(undefined),
    true,
    'should be visible when mapLayers is not set'
  );
  assertVisible(
    renderWithMapLayers({[layer.id]: true}),
    true,
    'should be visible when the panel entry is true'
  );
  assertVisible(
    renderWithMapLayers({[layer.id]: false}),
    false,
    'should be hidden when the panel entry is false'
  );
  assertVisible(renderWithMapLayers({}), false, 'should be hidden when the panel entry is missing');

  t.end();
});

test('#PointLayer -> renderLayer globe mode text labels', t => {
  const tc = {
    layer: {
      config: {
        dataId,
        label: 'gps point',
        columns: {
          lat: 'lat',
          lng: 'lng',
          altitude: 'id'
        },
        textLabel: [
          {
            field: {
              name: 'types',
              type: 'string'
            },
            background: true
          }
        ]
      },
      type: 'point',
      id: 'test_layer_1'
    },
    datasets: {
      [dataId]: preparedDataset
    }
  };

  const layer = testCreateLayerFromConfig(t, tc, {point: PointLayer});
  const data = testFormatLayerData(t, layer, tc.datasets);

  const renderWithMapState = mapState =>
    renderDeckGlLayer(
      {
        datasets: tc.datasets,
        layer,
        layerIndex: 0,
        data,
        mapState,
        interactionConfig: INITIAL_VIS_STATE.interactionConfig
      },
      {}
    ).find(l => String(l.id).includes('-label-'));

  const flatLabel = renderWithMapState(INITIAL_MAP_STATE);
  t.ok(flatLabel, 'should create a text label layer in flat mode');
  t.equal(
    flatLabel.props.parameters.depthTest,
    false,
    'should not depth-test labels outside globe mode'
  );
  t.notOk('cull' in flatLabel.props.parameters, 'should not touch culling outside globe mode');
  t.notOk(
    flatLabel.props._subLayerProps.characters,
    'should not override the glyph sublayer outside globe mode'
  );
  t.equal(
    flatLabel.props._subLayerProps.background.parameters.depthTest,
    false,
    'should not depth-test the label background outside globe mode'
  );

  // globe mode sets a global `cull: true`, which would otherwise discard the glyph quads
  const globeLabel = renderWithMapState({...INITIAL_MAP_STATE, globe: {enabled: true}});
  t.equal(globeLabel.props.parameters.cull, false, 'should disable culling in globe mode');
  t.equal(
    globeLabel.props.parameters.depthTest,
    true,
    'should depth-test labels against the globe depth disk'
  );
  t.equal(
    globeLabel.props.parameters.depthMask,
    false,
    'should not write depth so labels do not occlude each other'
  );
  t.equal(
    globeLabel.props._subLayerProps.characters.type,
    EnhancedMultiIconLayer,
    'should render glyphs with the globe back-face culling sublayer'
  );
  t.equal(
    globeLabel.props._subLayerProps.background.type,
    EnhancedTextBackgroundLayer,
    'should render the label background with the globe back-face culling sublayer'
  );
  t.equal(
    globeLabel.props._subLayerProps.background.parameters.depthTest,
    true,
    'should depth-test the label background against the globe depth disk'
  );
  t.equal(
    globeLabel.props._subLayerProps.background.parameters.depthMask,
    false,
    'should not write depth from the label background'
  );

  t.end();
});

test('#PointLayer -> updateLayer', t => {
  const layerConfig = {
    id: 'test1',
    type: 'point',
    config: {
      dataId,
      label: 'some point file',
      columns: {
        lat: 'lat',
        lng: 'lng'
      },
      visConfig: {
        outline: true,
        filled: true,
        colorRange: {
          colors: ['#010101', '#020202', '#030303']
        },
        strokeColor: [4, 5, 6]
      }
    },
    visualChannels: {
      // color by id(integer)
      colorField: {
        type: 'string',
        name: 'types'
      },
      // size by id(integer)
      sizeField: {
        type: 'integer',
        name: 'id'
      }
    }
  };

  const shouldUpdate = {
    gpuFilter: {},
    dynamicGpuFilter: {instanceRadius: true}
  };

  testUpdateLayer(t, {layerConfig, shouldUpdate});
  t.end();
});

test('#PointLayer -> formatLayerData -> Geojson column mode', async t => {
  // create a mockup GeoJson dataset with Point and MultiPoint geometry
  const geoJsonWithMultiPoint = cloneDeep(geoJsonWithStyle);
  geoJsonWithMultiPoint.features.push({
    type: 'Feature',
    properties: {
      fillColor: [1, 2, 3],
      lineColor: [4, 5, 6],
      lineWidth: 1,
      elevation: 10,
      radius: 5
    },
    geometry: {
      type: 'MultiPoint',
      coordinates: [
        [-122.0, 37.4],
        [-121.9, 37.5]
      ]
    }
  });

  const geoJsonWithGeometryCollection = cloneDeep(geoJsonWithStyle);
  geoJsonWithGeometryCollection.features.push({
    type: 'Feature',
    properties: {
      fillColor: [1, 2, 3],
      lineColor: [4, 5, 6],
      lineWidth: 1,
      elevation: 10,
      radius: 5
    },
    geometry: {
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Point',
          coordinates: [-121.8, 37.6]
        },
        {
          type: 'MultiPoint',
          coordinates: [
            [-122.0, 37.4],
            [-121.9, 37.5]
          ]
        }
      ]
    }
  });

  const geoJsonWithNull = cloneDeep(geoJsonWithStyle);

  const geojsonPointDataset = processGeojson(geoJsonWithStyle);
  const geojsonPolygonDataset = processGeojson(geojsonData);
  const geojsonMultiPolygonDataset = processGeojson(geoJsonWithMultiPoint);
  const geojsonGeometryCollectionDataset = processGeojson(geoJsonWithGeometryCollection);

  // mockup invalid geojson object or string geojson object
  const geojsonPointWithNullDataset = processGeojson(geoJsonWithNull);
  geojsonPointWithNullDataset.rows.push([undefined, [7, 8, 9], [4, 5, 6], 3, 10, 5]);
  geojsonPointWithNullDataset.rows.push(['', [7, 8, 9], [4, 5, 6], 3, 10, 5]);

  const TEST_CASES = [
    {
      name: 'Geojson point.1',
      layer: {
        type: 'point',
        id: 'test_geojson_layer_1',
        config: {
          color: [1, 2, 3],
          dataId,
          label: 'some geometry file',
          columnMode: 'geojson',
          columns: {
            geojson: '_geojson'
          }
        }
      },
      datasets: await createNewDataEntryMock({
        info: {id: dataId},
        data: geojsonPointDataset
      }),
      assert: result => {
        const {layerData} = result;
        // ! layerData is empty here
        const expectedLayerData = {
          data: [
            {
              index: 0,
              position: [-122.1, 37.3]
            },
            {
              index: 1,
              position: [-122.2, 37.2]
            },
            {
              index: 2,
              position: [-122.3, 37.1]
            }
          ],
          getFilterValue: () => {},
          getLineColor: () => {},
          getFillColor: () => {},
          getRadius: () => {},
          getPosition: () => {},
          textLabels: []
        };
        t.deepEqual(
          Object.keys(layerData).sort,
          Object.keys(expectedLayerData).sort,
          'layerData should have 7 keys'
        );
        // data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );

        // getPosition
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [-122.1, 37.3],
          'getPosition should return correct lat lng'
        );
      }
    },
    {
      name: 'Geojson polygon.2',
      layer: {
        type: 'point',
        id: 'test_geojson_layer_2',
        config: {
          color: [1, 2, 3],
          dataId,
          label: 'some geometry file',
          columnMode: 'geojson',
          columns: {
            geojson: '_geojson'
          }
        }
      },
      datasets: await createNewDataEntryMock({
        info: {id: dataId},
        data: geojsonPolygonDataset
      }),
      assert: result => {
        const {layerData} = result;
        const expectedLayerData = {
          data: [],
          getFilterValue: () => {},
          getLineColor: () => {},
          getFillColor: () => {},
          getRadius: () => {},
          getPosition: () => {},
          textLabels: []
        };
        t.deepEqual(
          Object.keys(layerData).sort,
          Object.keys(expectedLayerData).sort,
          'layerData should have 7 keys'
        );
        // data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        // empty data since Point layer only supports GeoJson column with Point geometries
        t.equal(layerData.data.length, 0, 'geojson layerData.data should be empty');
      }
    },
    {
      name: 'Geojson point.3',
      layer: {
        type: 'point',
        id: 'test_geojson_layer_3',
        config: {
          color: [1, 2, 3],
          dataId,
          label: 'some geometry file',
          columnMode: 'geojson',
          columns: {
            geojson: '_geojson'
          }
        }
      },
      datasets: await createNewDataEntryMock({
        info: {id: dataId},
        data: geojsonMultiPolygonDataset
      }),
      assert: result => {
        const {layerData} = result;
        const expectedLayerData = {
          data: [
            {
              index: 0,
              position: [-122.1, 37.3]
            },
            {
              index: 1,
              position: [-122.2, 37.2]
            },
            {
              index: 2,
              position: [-122.3, 37.1]
            },
            {
              index: 3,
              position: [-122.0, 37.4]
            },
            {
              index: 3,
              position: [-121.9, 37.5]
            }
          ],
          getFilterValue: () => {},
          getLineColor: () => {},
          getFillColor: () => {},
          getRadius: () => {},
          getPosition: () => {},
          textLabels: []
        };
        t.deepEqual(
          Object.keys(layerData).sort,
          Object.keys(expectedLayerData).sort,
          'layerData should have 7 keys'
        );
        // data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        // getPosition
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [-122.1, 37.3],
          'getPosition should return correct lat lng'
        );
      }
    },
    {
      name: 'Geojson GeometryCollection point.4',
      layer: {
        type: 'point',
        id: 'test_geojson_layer_4',
        config: {
          color: [1, 2, 3],
          dataId,
          label: 'some geometry file',
          columnMode: 'geojson',
          columns: {
            geojson: '_geojson'
          }
        }
      },
      datasets: await createNewDataEntryMock({
        info: {id: dataId},
        data: geojsonGeometryCollectionDataset
      }),
      assert: result => {
        const {layerData} = result;
        const expectedLayerData = {
          data: [
            {
              index: 0,
              position: [-122.1, 37.3]
            },
            {
              index: 1,
              position: [-122.2, 37.2]
            },
            {
              index: 2,
              position: [-122.3, 37.1]
            },
            {
              index: 3,
              position: [-121.8, 37.6]
            },
            {
              index: 3,
              position: [-122.0, 37.4]
            },
            {
              index: 3,
              position: [-121.9, 37.5]
            }
          ],
          getFilterValue: () => {},
          getLineColor: () => {},
          getFillColor: () => {},
          getRadius: () => {},
          getPosition: () => {},
          textLabels: []
        };
        t.deepEqual(
          Object.keys(layerData).sort,
          Object.keys(expectedLayerData).sort,
          'layerData should have 7 keys'
        );
        // data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        // getPosition
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [-122.1, 37.3],
          'getPosition should return correct lat lng'
        );
      }
    },
    {
      name: 'Geojson with null point.5',
      layer: {
        type: 'point',
        id: 'test_geojson_layer_5',
        config: {
          color: [1, 2, 3],
          dataId,
          label: 'some geometry file',
          columnMode: 'geojson',
          columns: {
            geojson: '_geojson'
          }
        }
      },
      datasets: await createNewDataEntryMock({
        info: {id: dataId},
        data: geojsonPointWithNullDataset
      }),
      assert: result => {
        const {layerData} = result;
        const expectedLayerData = {
          data: [
            {
              index: 0,
              position: [-122.1, 37.3]
            },
            {
              index: 1,
              position: [-122.2, 37.2]
            },
            {
              index: 2,
              position: [-122.3, 37.1]
            }
          ],
          getFilterValue: () => {},
          getLineColor: () => {},
          getFillColor: () => {},
          getRadius: () => {},
          getPosition: () => {},
          textLabels: []
        };
        t.deepEqual(
          Object.keys(layerData).sort,
          Object.keys(expectedLayerData).sort,
          'layerData should have 7 keys'
        );
        // data
        t.deepEqual(
          layerData.data,
          expectedLayerData.data,
          'should format correct geojson layerData'
        );
        // getPosition
        t.deepEqual(
          layerData.getPosition(layerData.data[0]),
          [-122.1, 37.3],
          'getPosition should return correct lat lng'
        );
      }
    }
  ];

  testFormatLayerDataCases(t, PointLayer, TEST_CASES);
  t.end();
});

test('#PointLayer -> Glow and Pulse / Ripple rendering and saved settings', t => {
  const datasets = {[dataId]: copyTableAndUpdate(preparedDataset, {filteredIndex: [0, 2, 4]})};
  const layer = testCreateLayerFromConfig(
    t,
    {
      layer: {
        type: 'point',
        id: 'pulse-point',
        config: {
          dataId,
          columns: {lat: 'lat', lng: 'lng'},
          colorField: {name: 'id', type: 'integer'},
          sizeField: {name: 'id', type: 'integer'},
          visConfig: {outline: true, opacity: 0.6},
          textLabel: [{field: {name: 'types', type: 'string'}}]
        }
      },
      datasets
    },
    {point: PointLayer}
  );
  const data = testFormatLayerData(t, layer, datasets);
  let filteredState = {...INITIAL_VIS_STATE, layers: [layer]};
  const onFilteredItemsChange = event => {
    filteredState = layerFilteredItemsChangeUpdater(filteredState, {layer, event});
  };
  // Simulate DataFilterExtension notifications in draw order, without requiring a GPU.
  const reportCounts = (deckLayers, count) => {
    deckLayers.forEach(deckLayer => {
      deckLayer.props.onFilteredItemsChange?.({id: deckLayer.id, count});
    });
  };
  const render = (globe = false, mapLayers) =>
    renderDeckGlLayer(
      {
        datasets,
        layer,
        layerIndex: 0,
        data,
        mapState: {...INITIAL_MAP_STATE, globe: {enabled: globe}},
        interactionConfig: {
          ...INITIAL_VIS_STATE.interactionConfig,
          brush: {...INITIAL_VIS_STATE.interactionConfig.brush, enabled: true}
        },
        hoverInfo: {picked: true, layer: {props: {id: layer.id}}, object: data.data[0], index: 0},
        mapLayers
      },
      {onFilteredItemsChange}
    );
  const hasAnimation = deckLayer =>
    deckLayer.props.extensions.some(extension => extension instanceof PulseRippleExtension);
  t.notOk(hasAnimation(render()[0]), 'default points use the unchanged renderer');
  for (const globe of [false, true]) {
    const viewport = new (globe ? _GlobeView : MapView)().makeViewport({
      width: 800,
      height: 600,
      viewState: {longitude: -122.4, latitude: 37.75, zoom: 10}
    });
    const manager = new LayerManager(device, {viewport});
    try {
      const regular = render(globe);
      testRenderDeckLayer(t, 'regular point before animation', regular, {layerManager: manager});
      const snapshot = deckLayers =>
        deckLayers
          .filter(deckLayer => deckLayer.id === layer.id || deckLayer.id === `${layer.id}-hovered`)
          .map(deckLayer => ({
            id: deckLayer.id,
            props: Object.fromEntries(
              [
                'data',
                'getPosition',
                'getRadius',
                'getFillColor',
                'getLineColor',
                'getFilterValue',
                'filterRange',
                'brushingEnabled',
                'brushingRadius',
                'radiusScale',
                'radiusMaxPixels',
                'radiusMinPixels',
                'radiusUnits',
                'lineWidthScale',
                'lineWidthUnits',
                'filled',
                'stroked',
                'billboard',
                'opacity',
                'pickable',
                'parameters'
              ].map(key => [key, deckLayer.props[key]])
            ),
            attributes: Object.fromEntries(
              [
                'instancePositions',
                'instanceRadius',
                'instanceFillColors',
                'instancePickingColors'
              ].map(key => [
                key,
                deckLayer.getAttributeManager().getAttributes()[key].value?.slice()
              ])
            ),
            vs: deckLayer.state.model.vs,
            fs: deckLayer.state.model.fs
          }));
      const baseline = snapshot(regular);
      t.equal(baseline.length, 2, 'regular points include the hover renderer');
      t.ok(regular[0].props.brushingEnabled, 'brushing is active in this regression case');
      const assertRegular = deckLayers => {
        t.deepEqual(
          snapshot(deckLayers),
          baseline,
          'restores regular point and hover shaders, attributes and rendering settings'
        );
        t.equal(
          deckLayers[0].getPickingInfo({info: {index: 0}}).object,
          data.data[0],
          'regular picking still returns the filtered point'
        );
        t.notOk(hasAnimation(deckLayers[0]), 'regular points have no animation extension');
        t.notOk(hasAnimation(deckLayers[1]), 'regular hover has no animation extension');
      };
      assertRegular(regular);
      t.equal(layer.config.visConfig.glowEnabled, false, 'glow is off for older maps');
      const assertGlow = deckLayers => {
        const halos = deckLayers.filter(deckLayer => deckLayer.id.endsWith('-glow'));
        t.equal(halos.length, 2, 'adds a halo behind the point and hover renderers');
        for (const halo of halos) {
          const core = deckLayers.find(deckLayer => `${deckLayer.id}-glow` === halo.id);
          t.ok(deckLayers.indexOf(halo) < deckLayers.indexOf(core), 'halo is behind its core');
          t.notOk(halo.props.pickable, 'halo does not expand the picking area');
          t.notOk(halo.props.onFilteredItemsChange, 'halo does not report data counts');
          if (core.id === layer.id) {
            t.equal(
              core.props.onFilteredItemsChange,
              onFilteredItemsChange,
              'core keeps count reporting'
            );
          }
          t.notOk(halo.props.parameters.depthWriteEnabled, 'halo does not occlude other points');
          t.notOk(hasAnimation(halo), 'halo stays static with either animation mode');
          for (const key of [
            'data',
            'getPosition',
            'getRadius',
            'getFillColor',
            'getLineColor',
            'getFilterValue',
            'filterRange',
            'brushingEnabled',
            'brushingRadius',
            'radiusScale',
            'radiusMinPixels',
            'radiusMaxPixels',
            'radiusUnits',
            'lineWidthScale',
            'lineWidthUnits',
            'stroked',
            'billboard',
            'opacity',
            'visible'
          ]) {
            // Both halo channels use the point fill; outline width is still respected.
            if (key !== 'getLineColor') {
              t.deepEqual(halo.props[key], core.props[key], `halo preserves ${key}`);
            }
          }
          t.ok(
            halo.props.extensions.some(e => e instanceof PointGlowExtension),
            'halo shader enabled'
          );
          t.notOk(
            core.props.extensions.some(e => e instanceof PointGlowExtension),
            'ordinary core shader unchanged'
          );
        }
        const labels = deckLayers.filter(deckLayer => deckLayer.id.includes('-label-'));
        t.ok(labels.length, 'labels remain available');
        labels.forEach(label =>
          t.notOk(
            label.props.extensions.some(e => e instanceof PointGlowExtension),
            'labels have no glow'
          )
        );
      };
      // A saved map can first draw with glow enabled, before any core count is recorded.
      layer.filteredItemCount = {};
      layer.updateLayerVisConfig({glowEnabled: true, glowExtent: 3, glowStrength: 0.7});
      const glowing = render(globe);
      testRenderDeckLayer(t, 'glowing points', glowing, {layerManager: manager});
      assertGlow(glowing);
      reportCounts(glowing, 3);
      t.equal(layer.getFilteredItemCount(), 3, 'initial count is correct with glow enabled');
      t.deepEqual(
        snapshot(glowing),
        baseline,
        'glow leaves core/hover shaders, attributes and props unchanged'
      );
      const core = glowing.find(deckLayer => deckLayer.id === layer.id);
      t.equal(
        core.getPickingInfo({info: {index: 0}}).object,
        data.data[0],
        'glow preserves core picking'
      );
      t.ok(
        render(globe, {[layer.id]: false}).every(deckLayer => !deckLayer.props.visible),
        'hidden points and halos stay hidden'
      );
      layer.updateLayerVisConfig({glowEnabled: false});
      const disabledGlow = render(globe);
      testRenderDeckLayer(t, 'disabled glow', disabledGlow, {layerManager: manager});
      assertRegular(disabledGlow);
      reportCounts(disabledGlow, 1);
      t.equal(
        layer.getFilteredItemCount(),
        1,
        'count updates after glow is removed and GPU filters change'
      );
      t.equal(disabledGlow.length, regular.length, 'disabled glow removes its renderers');
      t.equal(layer.config.visConfig.glowExtent, 3, 'disabling retains extent');
      t.equal(layer.config.visConfig.glowStrength, 0.7, 'disabling retains strength');
      for (const pulseMode of ['pulse', 'ripple']) {
        layer.updateLayerVisConfig({
          pulseEnabled: true,
          pulseMode,
          pulseSpeed: 2,
          pulseExpansion: 3
        });
        const deckLayers = render(globe);
        testRenderDeckLayer(t, `point ${pulseMode}`, deckLayers, {layerManager: manager});
        const points = deckLayers[0];
        t.ok(hasAnimation(points), 'point renderer enables the effect');
        t.ok(hasAnimation(deckLayers[1]), 'hover renderer enables the same effect');
        t.equal(
          points.getNumInstances(),
          regular[0].props.data.length,
          'all filtered points remain drawable'
        );
        t.equal(
          points.getPickingInfo({info: {index: 0}}).object,
          data.data[0],
          'animated picking returns the same filtered point'
        );
        t.equal(points.props.pulseMode, pulseMode, 'selected effect reaches the renderer');
        t.equal(points.props.data, data.data, 'animation reuses filtered point data');
        t.equal(points.props.getRadius, data.getRadius, 'animation preserves radius mapping');
        t.equal(points.props.getFillColor, data.getFillColor, 'animation preserves color mapping');
        t.equal(
          points.props.getFilterValue,
          data.getFilterValue,
          'animation preserves GPU filters'
        );
        const labels = deckLayers.filter(deckLayer => deckLayer.id.includes('-label-'));
        t.ok(labels.length, 'text labels remain available');
        labels.forEach(label => t.notOk(hasAnimation(label), 'labels do not pulse'));
        t.equal(
          render(globe, {[layer.id]: false})[0].props.visible,
          false,
          'hidden points stay hidden'
        );
        const animatedBaseline = snapshot(deckLayers);
        layer.updateLayerVisConfig({glowEnabled: true});
        const combined = render(globe);
        testRenderDeckLayer(t, 'glow with animation', combined, {layerManager: manager});
        assertGlow(combined);
        reportCounts(combined, 2);
        t.equal(layer.getFilteredItemCount(), 2, 'count updates after glow is reenabled');
        t.deepEqual(snapshot(combined), animatedBaseline, 'glow preserves existing animation');
        layer.updateLayerVisConfig({glowEnabled: false, pulseEnabled: false});
        const staticLayers = render(globe);
        testRenderDeckLayer(t, 'disabled pulse', staticLayers, {layerManager: manager});
        assertRegular(staticLayers);
        reportCounts(staticLayers, 0);
        t.equal(
          layer.getFilteredItemCount(),
          0,
          'empty filter results update after glow is disabled again'
        );
        t.equal(layer.config.visConfig.pulseExpansion, 3, 'turning off retains effect settings');
      }
    } finally {
      manager.finalize();
    }
  }
  layer.updateLayerVisConfig({pulseEnabled: true, glowEnabled: true});
  const saved = visStateSchemaV1.save({
    ...INITIAL_VIS_STATE,
    layers: [layer],
    layerOrder: [layer.id]
  }).visState;
  const loaded = visStateSchemaV1.load(JSON.parse(JSON.stringify(saved))).visState;
  const restored = testCreateLayerFromConfig(
    t,
    {layer: loaded.layers[0], datasets},
    {point: PointLayer}
  );
  for (const key of [
    'pulseEnabled',
    'pulseMode',
    'pulseSpeed',
    'pulseExpansion',
    'glowEnabled',
    'glowExtent',
    'glowStrength'
  ]) {
    t.equal(restored.config.visConfig[key], layer.config.visConfig[key], `restores ${key}`);
  }
  layer.updateLayerVisConfig({filled: false, outline: true, fixedRadius: true, billboard: true});
  const outlined = render();
  const halo = outlined.find(deckLayer => deckLayer.id === `${layer.id}-glow`);
  const point = outlined.find(deckLayer => deckLayer.id === layer.id);
  t.equal(halo.props.getFillColor, point.props.getLineColor, 'unfilled halo uses outline colors');
  t.deepEqual(
    halo.props.updateTriggers.getFillColor,
    point.props.updateTriggers.getLineColor,
    'outline color changes refresh the halo'
  );
  t.equal(
    halo.props.radiusMaxPixels,
    point.props.radiusMaxPixels,
    'fixed radii retain pixel limits'
  );
  t.equal(halo.props.radiusUnits, point.props.radiusUnits, 'fixed radii retain units');
  t.equal(halo.props.billboard, true, 'halo follows billboard orientation');
  layer.updateLayerVisConfig({outline: false});
  t.notOk(
    render().some(deckLayer => deckLayer.id.endsWith('-glow')),
    'invisible fill and outline have no halo'
  );
  t.end();
});
