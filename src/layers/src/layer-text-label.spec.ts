// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DataFilterExtension} from '@deck.gl/extensions';
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
