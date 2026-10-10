// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';

import KeplerTable, {showAllTableColumns, toggleHiddenTableColumn} from './kepler-table';

function makeTable() {
  const table = new KeplerTable({
    info: {id: 'places', label: 'places'},
    color: [0, 0, 0]
  });
  table.updateSchema({
    fields: [
      {name: 'name', type: ALL_FIELD_TYPES.string, analyzerType: ALL_FIELD_TYPES.string},
      {name: 'secret', type: ALL_FIELD_TYPES.string, analyzerType: ALL_FIELD_TYPES.string}
    ],
    rows: [['Harbor', 'hidden-value']]
  });
  return table;
}

describe('hidden table columns', () => {
  test('toggle hides a column and show all restores it', () => {
    const hidden = toggleHiddenTableColumn(makeTable(), 'secret');
    expect(hidden.hiddenColumns).toEqual(['secret']);

    const shown = toggleHiddenTableColumn(hidden, 'secret');
    expect(shown.hiddenColumns).toEqual([]);

    const both = toggleHiddenTableColumn(toggleHiddenTableColumn(makeTable(), 'secret'), 'name');
    expect(showAllTableColumns(both).hiddenColumns).toEqual([]);
  });

  test('ignores a column that is not on the dataset', () => {
    const table = makeTable();
    expect(toggleHiddenTableColumn(table, 'missing')).toBe(table);
  });
});
