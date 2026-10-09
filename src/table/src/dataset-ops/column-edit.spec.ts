// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import KeplerTable from '../kepler-table';
import {buildDeleteColumnData, buildRenameColumnData} from './column-edit';

function makeTable() {
  const table = new KeplerTable({
    info: {id: 'cities', label: 'cities', type: 'local'},
    color: [0, 0, 0]
  });
  table.updateSchema({
    fields: [
      {name: 'region', type: ALL_FIELD_TYPES.string, displayName: 'Region'},
      {name: 'pop', type: ALL_FIELD_TYPES.integer}
    ],
    rows: [
      ['west', 10],
      ['east', 40]
    ]
  });
  return table;
}

describe('column edit payloads', () => {
  test('rename keeps values and records the old name', () => {
    const payload = buildRenameColumnData(makeTable(), 'region', 'area');
    expect(payload?.renames).toEqual({region: 'area'});
    expect(payload?.data.fields.map(field => field.name)).toEqual(['area', 'pop']);
    expect(payload?.data.fields[0].displayName).toBe('area');
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
});
