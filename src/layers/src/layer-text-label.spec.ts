// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Int32, Int64, Table, vectorFromArray} from 'apache-arrow';
import {DataFilterExtension} from '@deck.gl/extensions';
import KeplerTable from '@kepler.gl/table';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';
import {ALL_FIELD_TYPES, DEFAULT_TEXT_LABEL} from '@kepler.gl/constants';
import {
  EnhancedMultiIconLayer,
  EnhancedTextBackgroundLayer,
  KeplerGlobeView
} from '@kepler.gl/deckgl-layers';
import PointLayer from './point-layer/point-layer';
import {
  formatTextLabelData,
  getSingleTextLabelValue,
  textLabelDeckLayerId
} from './layer-text-label';

describe('textLabelDeckLayerId', () => {
  const pointCount = {field: {name: 'pointCount'}};

  test('keeps the single-label id used by collision sublayers', () => {
    expect(textLabelDeckLayerId('jaca149', [pointCount], 0, true)).toBe(
      'jaca149-label-pointCount-collision'
    );
    expect(textLabelDeckLayerId('jaca149', [pointCount], 0, false)).toBe(
      'jaca149-label-pointCount'
    );
  });

  test('suffixes the index when the same field is labeled twice', () => {
    const labels = [pointCount, pointCount];
    expect(textLabelDeckLayerId('jaca149', labels, 0, true)).toBe(
      'jaca149-label-pointCount-0-collision'
    );
    expect(textLabelDeckLayerId('jaca149', labels, 1, true)).toBe(
      'jaca149-label-pointCount-1-collision'
    );
  });
});

async function makeTable() {
  const table = new KeplerTable({color: [255, 0, 0]} as any);
  await table.importData({
    data: {
      rows: [
        [37.77, -122.42, '2021-01-01 03:12:00', 3.5],
        [37.78, -122.41, null, 1.25],
        [37.79, -122.4, '1970-01-01 00:00:00', 2.5]
      ],
      fields: [
        {name: 'latitude', type: ALL_FIELD_TYPES.real},
        {name: 'longitude', type: ALL_FIELD_TYPES.real},
        {name: 'time', type: ALL_FIELD_TYPES.timestamp, format: 'YYYY-M-D H:m:s'},
        {name: 'value', type: ALL_FIELD_TYPES.real}
      ]
    } as any
  });
  return table;
}

function getTextLabels(table: KeplerTable, field) {
  return formatTextLabelData({
    textLabel: [{field}],
    oldLayerData: null,
    data: [{index: 0}, {index: 1}, {index: 2}],
    dataContainer: table.dataContainer
  });
}

const findField = (table: KeplerTable, name: string) => table.fields.find(f => f.name === name);

describe('formatTextLabelData', () => {
  test('shows timestamp labels as a date time instead of unix milliseconds', async () => {
    const table = await makeTable();
    const [{getText}] = getTextLabels(table, findField(table, 'time'));

    expect(getText({index: 0})).toBe('01/01/2021 3:12:00 AM');
    expect(getText({index: 1})).toBe('');
    expect(getText({index: 2})).toBe('01/01/1970 12:00:00 AM');
  });

  test('uses the display format of a timestamp field', async () => {
    const table = await makeTable();
    const field = {...findField(table, 'time'), displayFormat: 'YYYY-MM-DD HH:mm'};
    const [{getText, characterSet}] = getTextLabels(table, field);

    expect(getText({index: 0})).toBe('2021-01-01 03:12');
    expect(characterSet).toEqual(expect.arrayContaining(['2', '0', '1', '-', ' ', '3', ':']));
  });

  test('keeps the raw value for labels of other field types', async () => {
    const table = await makeTable();
    const [{getText}] = getTextLabels(table, findField(table, 'value'));

    expect(getText({index: 0})).toBe('3.5');
    expect(getText({index: 1})).toBe('1.25');
  });
});

describe('getSingleTextLabelValue', () => {
  test('formats a timestamp read from a materialized row', async () => {
    const table = await makeTable();
    const field = findField(table, 'time');
    const row = table.dataContainer.rowAsArray(0);

    expect(getSingleTextLabelValue({field, format: ''}, row)).toBe('01/01/2021 3:12:00 AM');
  });
});

describe('renderTextLabelLayer', () => {
  test.each([false, true])(
    'disables inherited globe face culling for glyphs and backgrounds (collision=%s)',
    async collisionEnabled => {
      const table = await makeTable();
      const layer = new PointLayer({id: 'point', dataId: table.id});
      layer.updateLayerConfig({
        textLabel: [
          {...DEFAULT_TEXT_LABEL, field: table.fields[3], background: true, collisionEnabled}
        ]
      });
      const view = new KeplerGlobeView();

      for (const globeEnabled of [false, true]) {
        const [text] = layer.renderTextLabelLayer(
          {getPixelOffset: () => [0, 0], updateTriggers: {}, sharedProps: {}},
          {
            data: {data: [], textLabels: [{getText: () => 'label', characterSet: ['l']}]},
            mapState: {globe: {enabled: globeEnabled}},
            visible: true
          }
        );
        for (const id of ['characters', 'background']) {
          // Use deck.gl's real sublayer inheritance before merging the view's
          // parameters, as LayersPass does for each rendered primitive layer.
          const props = (text as any).getSubLayerProps({id});
          const parameters = {
            ...(globeEnabled ? view.props.parameters : {}),
            ...props.parameters
          };
          if (globeEnabled) {
            expect(parameters.cullMode).toBe('none');
            expect(parameters).toMatchObject({depthTest: true, depthMask: false});
            // Disabling GPU face culling must retain the far-side shader guard.
            expect(props.type).toBe(
              id === 'characters' ? EnhancedMultiIconLayer : EnhancedTextBackgroundLayer
            );
          } else {
            expect(parameters.cullMode).toBeUndefined();
            expect(parameters.depthTest).toBe(false);
            expect(props.type).toBeUndefined();
          }
        }
      }
    }
  );

  test('includes the display format in the deck.gl text update trigger', async () => {
    const table = await makeTable();
    const field = {...findField(table, 'time')!, displayFormat: 'YYYY'};
    const layer = new PointLayer({id: 'point', dataId: 'data'});
    layer.updateLayerConfig({
      textLabel: [{...DEFAULT_TEXT_LABEL, field}]
    });

    const [textLayer] = layer.renderTextLabelLayer(
      {
        getPixelOffset: () => [0, 0],
        updateTriggers: {},
        sharedProps: {}
      },
      {
        data: {
          data: [],
          textLabels: [{getText: () => '', characterSet: []}]
        },
        mapState: {},
        visible: true
      }
    );

    expect(textLayer.props.updateTriggers.getText).toEqual({
      field: 'time',
      displayFormat: 'YYYY'
    });
  });
});

function labelSnapshot(labels: string[], useArrow: boolean) {
  const fields = [
    {name: 'latitude', type: ALL_FIELD_TYPES.real},
    {name: 'longitude', type: ALL_FIELD_TYPES.real},
    {name: 'label', type: ALL_FIELD_TYPES.string}
  ];
  const rows = labels.map((label, index) => [37 + index, -122, label]);
  if (!useArrow) return {fields, rows};
  const latitude = vectorFromArray(labels.map((_, index) => 37 + index));
  const longitude = vectorFromArray(labels.map(() => -122));
  const label = vectorFromArray(labels);
  return {
    fields,
    rows: [],
    cols: [latitude, longitude, label],
    arrowTable: new Table({latitude, longitude, label})
  };
}

function makeLabelLayer(table: KeplerTable, field = table.fields[2]) {
  const layer = new PointLayer({
    id: 'labels',
    dataId: table.id,
    columns: {
      lat: {value: 'latitude', fieldIdx: 0},
      lng: {value: 'longitude', fieldIdx: 1}
    }
  });
  layer.updateLayerConfig({textLabel: [{...DEFAULT_TEXT_LABEL, field}]});
  return layer;
}

function renderedTextLabel(layer: PointLayer, data, getPosition = undefined) {
  return layer.renderTextLabelLayer(
    {getPosition, getPixelOffset: () => [0, 0], updateTriggers: {}, sharedProps: {}},
    {data, mapState: {}, visible: true}
  )[0];
}

describe.each([false, true])('text label data refresh (Arrow: %s)', useArrow => {
  const readLabel = (rendered, index = 0) =>
    useArrow ? rendered.props.getText.get(index) : rendered.props.getText({index});

  test('updates same-container and same-row-count replacement labels and glyphs', async () => {
    const table = new KeplerTable({color: [0, 0, 0]}).updateSchema(labelSnapshot(['A'], useArrow));
    const layer = makeLabelLayer(table);
    const container = table.dataContainer;
    let data = layer.formatLayerData({[table.id]: table}, null);
    expect(readLabel(renderedTextLabel(layer, data))).toBe('A');

    await table.update(labelSnapshot(['B'], useArrow));
    expect(table.dataContainer).toBe(container);
    data = layer.formatLayerData({[table.id]: table}, data);
    expect(readLabel(renderedTextLabel(layer, data))).toBe('B');
    expect(renderedTextLabel(layer, data).props.characterSet).toEqual(['B']);

    table.updateSchema(labelSnapshot(['C'], useArrow));
    expect(table.dataContainer).not.toBe(container);
    layer.updateLayerConfig({textLabel: [{...DEFAULT_TEXT_LABEL, field: table.fields[2]}]});
    data = layer.formatLayerData({[table.id]: table}, data);
    expect(readLabel(renderedTextLabel(layer, data))).toBe('C');
    expect(renderedTextLabel(layer, data).props.characterSet).toEqual(['C']);
  });

  test.each([false, true])(
    'refreshes glyphs as filters narrow, empty, and clear (per-layer: %s)',
    perLayer => {
      const table = new KeplerTable({color: [0, 0, 0]}).updateSchema(
        labelSnapshot(['A', 'Ω'], useArrow)
      );
      const layer = makeLabelLayer(table);
      let data;
      for (const [indices, glyphs] of [
        [[0], ['A']],
        [[1], ['Ω']],
        [[], []],
        [
          [0, 1],
          ['A', 'Ω']
        ]
      ] as [number[], string[]][]) {
        if (perLayer) {
          table.filteredIndexByLayer = indices.length === 2 ? {} : {[layer.id]: indices};
        } else {
          table.filteredIndex = indices;
        }
        data = layer.formatLayerData({[table.id]: table}, data);
        expect(renderedTextLabel(layer, data).props.characterSet).toEqual(glyphs);
        if (useArrow) {
          expect(data.getFiltered({index: 0})).toBe(indices.includes(0) ? 1 : 0);
          expect(data.getFiltered({index: 1})).toBe(indices.includes(1) ? 1 : 0);
        } else {
          expect(data.data.map(row => row.index)).toEqual(indices);
        }
      }
      expect(readLabel(renderedTextLabel(layer, data), 1)).toBe('Ω');
    }
  );

  test('reuses text and glyph caches without rescanning on unrelated styling', () => {
    const table = new KeplerTable({color: [0, 0, 0]}).updateSchema(
      labelSnapshot(['A', 'Ω'], useArrow)
    );
    const layer = makeLabelLayer(table);
    const data = layer.formatLayerData({[table.id]: table}, null);
    const valueAccessor = jest.spyOn(table.fields[2], 'valueAccessor');
    layer.updateLayerVisConfig({opacity: 0.25});
    layer.updateLayerConfig({textLabel: [{...layer.config.textLabel[0], color: [0, 255, 0]}]});
    const unchanged = layer.formatLayerData({[table.id]: table}, data);
    const previous = renderedTextLabel(layer, data).props;
    const next = renderedTextLabel(layer, unchanged).props;
    expect(next.getText).toBe(previous.getText);
    expect(next.characterSet).toBe(previous.characterSet);
    expect(valueAccessor).not.toHaveBeenCalled();
    valueAccessor.mockRestore();
  });
});

test('changing timestamp display format rebuilds rendered labels without changing data', async () => {
  const table = await makeTable();
  const field = {...table.fields[2], displayFormat: 'YYYY'};
  const layer = makeLabelLayer(table, field);
  const data = layer.formatLayerData({[table.id]: table}, null);
  expect(renderedTextLabel(layer, data).props.getText({index: 0})).toBe('2021');
  layer.updateLayerConfig({
    textLabel: [{...DEFAULT_TEXT_LABEL, field: {...field, displayFormat: 'YYYY/MM'}}]
  });
  const updated = layer.formatLayerData({[table.id]: table}, data);
  expect(renderedTextLabel(layer, updated).props.data).toBe(
    renderedTextLabel(layer, data).props.data
  );
  expect(renderedTextLabel(layer, updated).props.getText({index: 0})).toBe('2021/01');
  expect(renderedTextLabel(layer, updated).props.characterSet).toContain('/');
});

test('collision labels preserve shared extensions without mutating another layer', async () => {
  const table = await makeTable();
  const field = table.fields[2];
  const layer = new PointLayer({id: 'point', dataId: table.id});
  layer.updateLayerConfig({
    textLabel: [{...DEFAULT_TEXT_LABEL, field, collisionEnabled: true}]
  });
  const extension = new DataFilterExtension();
  const extensions = Object.freeze([extension]);
  const [text] = layer.renderTextLabelLayer(
    {getPixelOffset: () => [0, 0], updateTriggers: {}, sharedProps: {extensions}},
    {
      data: {data: [], textLabels: [{getText: () => 'label', characterSet: ['l']}]},
      mapState: {},
      visible: true
    }
  );
  expect(extensions).toEqual([extension]);
  expect(text.props.extensions).toHaveLength(2);
  expect(text.props.extensions[0]).toBe(extension);
  expect(text.props.extensions[1].constructor.extensionName).toBe('CollisionFilterExtension');
});

describe.each([false, true])('point label rotation (Arrow: %s)', useArrow => {
  let priorMaxArrowBatches: number;
  beforeEach(() => {
    priorMaxArrowBatches = getApplicationConfig().maxArrowBatches;
    initApplicationConfig({maxArrowBatches: 2});
  });
  afterEach(() => initApplicationConfig({maxArrowBatches: priorMaxArrowBatches}));

  test('resolves angle fields per row and restores the default when cleared', () => {
    const base = labelSnapshot(['A', 'BC', 'D'], useArrow);
    const heading = vectorFromArray([12.5, -450, null]);
    const other = vectorFromArray([70, 30, 10], new Int32());
    const large = vectorFromArray([70n, 9007199254740993n, null], new Int64());
    const fields = [
      ...base.fields,
      {name: 'heading', type: ALL_FIELD_TYPES.real},
      {name: 'other', type: ALL_FIELD_TYPES.integer},
      {name: 'large', type: ALL_FIELD_TYPES.integer}
    ];
    const arrowTable = base.cols
      ? new Table<Record<string, any>>({
          ...Object.fromEntries(base.fields.map((field, index) => [field.name, base.cols![index]])),
          heading,
          other,
          large
        })
      : undefined;
    const chunks = arrowTable?.slice(0, 1).concat(arrowTable.slice(1));
    const table = new KeplerTable({color: [0, 0, 0]}).updateSchema(
      chunks
        ? {
            ...base,
            fields,
            cols: fields.map(field => chunks.getChild(field.name)),
            arrowTable: chunks
          }
        : {
            ...base,
            fields,
            rows: base.rows.map((row, index) => [
              ...row,
              heading.get(index),
              other.get(index),
              large.get(index)
            ])
          }
    );
    const layer = makeLabelLayer(table);
    const render = (angleField: string | null, oldData: object | null = null) => {
      layer.updateLayerConfig({textLabel: [{...layer.config.textLabel[0], angleField}]});
      const data = layer.formatLayerData({[table.id]: table}, oldData);
      const text = renderedTextLabel(
        layer,
        data,
        useArrow ? (layer as any).geoArrowVector : undefined
      );
      return {text, data};
    };

    const first = render('heading');
    const read = text => [0, 1, 2].map(index => text.props.getAngle({index}));
    expect(read(first.text)).toEqual([12.5, -90, 0]);
    const readBatches = text => {
      const batches = text.renderLayers();
      expect(batches).toHaveLength(2);
      return batches.flatMap(batch =>
        Array.from({length: batch.props.data.length}, (_, index) =>
          batch.props.getAngle(null, {index, data: batch.props.data})
        )
      );
    };
    if (useArrow) expect(readBatches(first.text)).toEqual([12.5, -90, 0]);

    const second = render('other', first.data);
    expect(read(second.text)).toEqual([70, 30, 10]);
    if (useArrow) expect(readBatches(second.text)).toEqual([70, 30, 10]);
    expect(second.text.props.updateTriggers.getAngle).not.toEqual(
      first.text.props.updateTriggers.getAngle
    );

    const last = render('large', second.data);
    expect(read(last.text)).toEqual([70, 33, 0]);
    if (useArrow) expect(readBatches(last.text)).toEqual([70, 33, 0]);

    const cleared = render(null, last.data);
    expect(cleared.text.props.getAngle).toBe(0);
    expect(cleared.text.props.updateTriggers.getAngle).toBeNull();
    expect(render('missing', cleared.data).text.props.getAngle).toBe(0);
    expect(render('label', cleared.data).text.props.getAngle).toBe(0);
  });
});
