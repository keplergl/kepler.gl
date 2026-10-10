// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import KeplerTable from '@kepler.gl/table';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {formatTextLabelData, getSingleTextLabelValue} from './layer-text-label';

async function makeTable() {
  const table = new KeplerTable({color: [255, 0, 0]} as any);
  await table.importData({
    data: {
      rows: [
        [37.77, -122.42, '2021-01-01 03:12:00', 3.5],
        [37.78, -122.41, null, 1.25]
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
    data: [{index: 0}, {index: 1}],
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
