// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Table, vectorFromArray} from 'apache-arrow';
import KeplerTable from '@kepler.gl/table';
import {ALL_FIELD_TYPES, DEFAULT_TEXT_LABEL} from '@kepler.gl/constants';
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

function renderedTextLabel(layer: PointLayer, data) {
  return layer.renderTextLabelLayer(
    {getPixelOffset: () => [0, 0], updateTriggers: {}, sharedProps: {}},
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
