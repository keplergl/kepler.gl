// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import KeplerTable from '@kepler.gl/table';
import {ALL_FIELD_TYPES, DEFAULT_TEXT_LABEL} from '@kepler.gl/constants';
import PointLayer from './point-layer/point-layer';
import {formatTextLabelData, getSingleTextLabelValue} from './layer-text-label';

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
