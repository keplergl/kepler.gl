// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {createArrowVector} from '@kepler.gl/utils';
import KeplerTable from '../kepler-table';
import {
  buildChangeColumnTypeData,
  buildDeleteColumnData,
  buildRenameColumnData,
  formatColumnTypeConversionError,
  getCompatibleColumnTypes
} from './column-edit';

function makeTable() {
  const table = new KeplerTable({
    info: {id: 'cities', label: 'cities', type: 'local'},
    color: [0, 0, 0]
  });
  table.updateSchema({
    fields: [
      {name: 'region', type: ALL_FIELD_TYPES.string, displayName: 'Region'},
      {name: 'pop', type: ALL_FIELD_TYPES.integer, displayName: 'Population'}
    ],
    rows: [
      ['west', 10],
      ['east', 40]
    ]
  });
  return table;
}

function makeColumnTable(
  values: unknown[],
  type: string = ALL_FIELD_TYPES.string,
  analyzerType?: string
) {
  const table = new KeplerTable({
    info: {id: 'typed', label: 'typed', type: 'local'},
    color: [0, 0, 0]
  });
  table.updateSchema({
    fields: [{name: 'value', type, analyzerType}],
    rows: values.map(value => [value])
  });
  return table;
}

describe('column edit payloads', () => {
  test('rename keeps values and records the old name', () => {
    const payload = buildRenameColumnData(makeTable(), 'region', 'area');
    expect(payload?.renames).toEqual({region: 'area'});
    expect(payload?.data.fields.map(field => field.name)).toEqual(['area', 'pop']);
    expect(payload?.data.fields[0].displayName).toBe('area');
    expect(payload?.data.fields[1].displayName).toBe('Population');
    expect(payload?.data.rows).toEqual([
      ['west', 10],
      ['east', 40]
    ]);
  });

  test('rename rejects a blank or duplicate name', () => {
    const table = makeTable();
    expect(buildRenameColumnData(table, 'region', '  ')).toBeNull();
    expect(buildRenameColumnData(table, 'region', 'pop')).toBeNull();
    expect(buildRenameColumnData(table, 'region', 'region')).toBeNull();
    expect(buildRenameColumnData(table, 'missing', 'area')).toBeNull();
  });

  test('rename keeps arrow columns as vectors', () => {
    const table = makeTable();
    const vectors = ['west-col', 'pop-col'];
    const payload = buildRenameColumnData(
      {
        fields: table.fields,
        dataContainer: {
          numRows: () => 2,
          getColumn: index => vectors[index],
          rowAsArray: () => {
            throw new Error('row materialization');
          }
        } as unknown as typeof table.dataContainer
      },
      'region',
      'area'
    );
    expect(payload?.data.cols).toEqual(vectors);
    expect(payload?.data.rows).toEqual([]);
  });

  test('delete drops the column and refuses the last field', () => {
    const payload = buildDeleteColumnData(makeTable(), 'pop');
    expect(payload?.data.fields.map(field => field.name)).toEqual(['region']);
    expect(payload?.data.fields[0].displayName).toBe('Region');
    expect(payload?.data.rows).toEqual([['west'], ['east']]);
    expect(payload?.renames).toEqual({});

    const oneColumn = new KeplerTable({
      info: {id: 'one', label: 'one', type: 'local'},
      color: [0, 0, 0]
    });
    oneColumn.updateSchema({
      fields: [{name: 'region', type: ALL_FIELD_TYPES.string}],
      rows: [['west']]
    });
    expect(buildDeleteColumnData(oneColumn, 'region')).toBeNull();
  });

  test('type change converts every value and updates field metadata', () => {
    const table = makeColumnTable(['10', '-2', null], ALL_FIELD_TYPES.string, 'STRING');
    table.fields[0].displayFormat = '.2f';

    const result = buildChangeColumnTypeData(table, 'value', ALL_FIELD_TYPES.integer);
    expect(result?.payload?.data.rows).toEqual([[10], [-2], [null]]);
    expect(result?.payload?.data.fields[0]).toMatchObject({
      name: 'value',
      type: ALL_FIELD_TYPES.integer,
      analyzerType: 'INT',
      format: ''
    });
    expect(
      (result?.payload?.data.fields[0] as {displayFormat?: string} | undefined)?.displayFormat
    ).toBeUndefined();
  });

  test('type change reports the first invalid row without mutating the table', () => {
    const table = makeColumnTable(['10', 'not-a-number', '30'], ALL_FIELD_TYPES.string, 'STRING');

    const result = buildChangeColumnTypeData(table, 'value', ALL_FIELD_TYPES.integer);
    expect(result).toEqual({
      error: {rowIndex: 1, value: 'not-a-number', reason: 'is not a safe integer'}
    });
    expect(table.fields[0].type).toBe(ALL_FIELD_TYPES.string);
    expect(table.dataContainer.rowAsArray(0)[0]).toBe('10');
    expect(getCompatibleColumnTypes(table.dataContainer, 0, ALL_FIELD_TYPES.string)).toEqual([
      ALL_FIELD_TYPES.string
    ]);
    expect(result?.error && formatColumnTypeConversionError(result.error)).toBe(
      'row 2 value “not-a-number” is not a safe integer'
    );
  });

  test('type change parses timestamps and rejects types outside the initial scope', () => {
    const table = makeColumnTable(
      ['2024-01-01T12:30:00Z', '2025-02-02T01:02:03Z'],
      ALL_FIELD_TYPES.string,
      'STRING'
    );

    const timestamp = buildChangeColumnTypeData(table, 'value', ALL_FIELD_TYPES.timestamp);
    expect(timestamp?.payload?.data.fields[0]).toMatchObject({
      type: ALL_FIELD_TYPES.timestamp,
      analyzerType: 'DATETIME',
      format: 'YYYY-M-DTH:m:s'
    });

    expect(buildChangeColumnTypeData(table, 'value', ALL_FIELD_TYPES.boolean)).toBeNull();
    expect(buildChangeColumnTypeData(table, 'value', ALL_FIELD_TYPES.array)).toBeNull();
  });

  test.each([
    {type: ALL_FIELD_TYPES.integer, values: [1_700_000_000, 1_700_000_001]},
    {type: ALL_FIELD_TYPES.real, values: [1_700_000_000.4, 1_700_000_001.6]},
    {type: ALL_FIELD_TYPES.string, values: ['1700000000.4', '1700000001.6']}
  ])('timestamp conversion preserves plausible $type epochs without rounding', ({type, values}) => {
    const table = makeColumnTable(values, type);
    const converted = buildChangeColumnTypeData(table, 'value', ALL_FIELD_TYPES.timestamp);
    expect(converted?.payload?.data.rows).toEqual(
      type === ALL_FIELD_TYPES.integer
        ? [[1_700_000_000], [1_700_000_001]]
        : [[1_700_000_000.4], [1_700_000_001.6]]
    );
    expect(converted?.payload?.data.fields[0]).toMatchObject({
      type: ALL_FIELD_TYPES.timestamp,
      analyzerType: 'TIME',
      format: 'x'
    });
    expect(getCompatibleColumnTypes(table.dataContainer, 0, type)).toContain(
      ALL_FIELD_TYPES.timestamp
    );
  });

  test('timestamp conversion rejects measurements', () => {
    const measurements = makeColumnTable([3.1, 4], ALL_FIELD_TYPES.real);
    expect(buildChangeColumnTypeData(measurements, 'value', ALL_FIELD_TYPES.timestamp)).toEqual({
      error: {
        rowIndex: 0,
        value: 3.1,
        reason: 'is not a plausible epoch timestamp'
      }
    });
    expect(getCompatibleColumnTypes(measurements.dataContainer, 0, ALL_FIELD_TYPES.real)).toEqual([
      ALL_FIELD_TYPES.real,
      ALL_FIELD_TYPES.string
    ]);
  });

  test('type changes omit numeric conversions that do not change column behavior', () => {
    const integers = makeColumnTable([1_700_000_000, 1_700_000_001], ALL_FIELD_TYPES.integer);
    expect(getCompatibleColumnTypes(integers.dataContainer, 0, ALL_FIELD_TYPES.integer)).toEqual([
      ALL_FIELD_TYPES.integer,
      ALL_FIELD_TYPES.string,
      ALL_FIELD_TYPES.timestamp
    ]);
    expect(buildChangeColumnTypeData(integers, 'value', ALL_FIELD_TYPES.real)).toBeNull();

    const timestamp = buildChangeColumnTypeData(integers, 'value', ALL_FIELD_TYPES.timestamp);
    expect(timestamp?.payload).toBeTruthy();
    if (!timestamp?.payload) {
      throw new Error('Expected timestamp conversion to succeed');
    }
    const timestamps = makeColumnTable([]);
    timestamps.updateSchema(timestamp.payload.data);
    expect(
      getCompatibleColumnTypes(timestamps.dataContainer, 0, ALL_FIELD_TYPES.timestamp)
    ).toEqual([ALL_FIELD_TYPES.integer, ALL_FIELD_TYPES.string, ALL_FIELD_TYPES.timestamp]);
    expect(buildChangeColumnTypeData(timestamps, 'value', ALL_FIELD_TYPES.real)).toBeNull();
  });

  test('real conversion does not silently round large integer strings', () => {
    for (const value of [
      '9007199254740993',
      '9007199254740993.0',
      '9007199254740993e0',
      '9.007199254740993e15'
    ]) {
      const table = makeColumnTable([value]);

      expect(buildChangeColumnTypeData(table, 'value', ALL_FIELD_TYPES.real)).toEqual({
        error: {
          rowIndex: 0,
          value,
          reason: 'loses integer precision as a real number'
        }
      });
      expect(getCompatibleColumnTypes(table.dataContainer, 0, ALL_FIELD_TYPES.string)).toEqual([
        ALL_FIELD_TYPES.string
      ]);
    }
  });

  test('type change preserves untouched Arrow vectors', () => {
    const table = new KeplerTable({
      info: {id: 'arrow', label: 'arrow', type: 'local'},
      color: [0, 0, 0]
    });
    table.updateSchema({
      fields: [
        {name: 'value', type: ALL_FIELD_TYPES.string},
        {name: 'label', type: ALL_FIELD_TYPES.string}
      ],
      rows: [],
      cols: [createArrowVector(['10', '20']), createArrowVector(['a', 'b'])]
    });
    const untouched = table.dataContainer.getColumn?.(1);

    const result = buildChangeColumnTypeData(table, 'value', ALL_FIELD_TYPES.integer);
    expect(result?.payload?.data.rows).toEqual([]);
    expect(result?.payload?.data.cols?.[1]).toBe(untouched);
    expect(Array.from(result?.payload?.data.cols?.[0] as Iterable<unknown>)).toEqual([10, 20]);
  });
});
