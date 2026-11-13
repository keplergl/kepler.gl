// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {makeQualifiedTableName, type DataTable} from '@sqlrooms/duckdb-core';
import {
  buildKeplerTableLayerOptions,
  buildKeplerTableSourceOptions,
  findKeplerTableForDatasetId,
  getKeplerDatasetIdForTable,
  getKeplerTableLabel,
  type KeplerTableSelectionOptions
} from './keplerTableSelection';

jest.mock('@duckdb/duckdb-wasm', () => ({DuckDBDataProtocol: {BROWSER_FILEREADER: 2}}));

function table(name: string, database = 'workspace', schema = 'main'): DataTable {
  return {
    table: makeQualifiedTableName({database, schema, table: name}),
    schema,
    tableName: name,
    isView: false,
    columns: []
  };
}

const policy = {defaultDbSchema: {database: 'workspace', schema: 'main'}};

describe('SQLRooms catalog identity and source options', () => {
  test('uses bare ids only in the complete default namespace and keeps qualified ids distinct', () => {
    const local = table('places');
    const attached = table('places', 'archive');
    const otherSchema = table('places', 'workspace', 'staging');
    expect(getKeplerDatasetIdForTable(local, policy)).toBe('places');
    expect(getKeplerDatasetIdForTable(attached, policy)).toBe('"archive"."main"."places"');
    expect(getKeplerDatasetIdForTable(otherSchema, policy)).toBe('"workspace"."staging"."places"');
    expect(getKeplerDatasetIdForTable(local, {defaultDbSchema: {database: 'workspace'}})).toBe(
      '"workspace"."main"."places"'
    );
    expect(findKeplerTableForDatasetId([attached, local], 'places', policy)).toBe(local);
    expect(
      findKeplerTableForDatasetId([local, attached], '"archive"."main"."places"', policy)
    ).toBe(attached);
    expect(findKeplerTableForDatasetId([local], 'places')).toBeUndefined();
    expect(findKeplerTableForDatasetId([local], 'missing', policy)).toBeUndefined();
  });

  test('resolves the current default namespace while labels omit only matching qualifiers', () => {
    let database = 'workspace';
    const dynamicPolicy = {defaultDbSchema: () => ({database, schema: 'main'})};
    const local = table('city places');
    expect(getKeplerDatasetIdForTable(local, dynamicPolicy)).toBe('city places');
    expect(getKeplerTableLabel(local, dynamicPolicy)).toBe('city places');
    expect(getKeplerTableLabel(table('places', 'workspace', 'staging'), policy)).toBe(
      'staging.places'
    );
    expect(getKeplerTableLabel(table('places', 'archive', 'staging'), policy)).toBe(
      'archive.staging.places'
    );
    expect(getKeplerTableLabel(local)).toBe('workspace.main.city places');
    database = 'archive';
    expect(getKeplerDatasetIdForTable(local, dynamicPolicy)).toBe(
      '"workspace"."main"."city places"'
    );
    expect(getKeplerTableLabel(local, dynamicPolicy)).toBe('workspace.city places');
  });

  test('preserves loaded aliases and colors without adding the same table a second time', () => {
    const places = table('places');
    const datasets = {
      '"workspace"."main"."places"': {
        id: '"workspace"."main"."places"',
        label: 'Old label',
        color: [1, 2, 3] as [number, number, number]
      },
      uploaded: {id: 'uploaded', label: 'Uploaded file'}
    };
    const before = JSON.stringify(datasets);
    expect(
      buildKeplerTableSourceOptions({
        dbTables: [places, table('roads')],
        datasets,
        tableSelection: policy
      })
    ).toEqual([
      {value: '"workspace"."main"."places"', label: 'places', color: [1, 2, 3], isLoaded: true},
      {value: 'roads', label: 'roads', color: [143, 149, 161], isLoaded: false},
      {value: 'uploaded', label: 'Uploaded file', color: [143, 149, 161], isLoaded: true}
    ]);
    expect(JSON.stringify(datasets)).toBe(before);
  });

  test('uses all map-loaded ids for deduplication even when the visible selector datasets are filtered', () => {
    expect(
      buildKeplerTableSourceOptions({
        dbTables: [table('places'), table('roads')],
        datasets: {},
        loadedDatasetIds: ['"workspace"."main"."places"'],
        tableSelection: policy
      }).map(option => option.value)
    ).toEqual(['roads']);
    expect(
      buildKeplerTableSourceOptions({
        dbTables: [table('roads')],
        datasets: {upload: {id: 'upload'}},
        includeUnloadedTables: false,
        tableSelection: policy
      })
    ).toEqual([{value: 'upload', label: 'upload', color: [143, 149, 161], isLoaded: true}]);
  });

  test('applies inclusion policy consistently to saved ids and both source menus', () => {
    const hidden = table('private');
    const visible = table('places');
    const selection: KeplerTableSelectionOptions = {
      ...policy,
      includeTable: item => item !== hidden
    };
    expect(findKeplerTableForDatasetId([hidden], 'private', selection)).toBeUndefined();
    const datasets = {private: {id: 'private'}, upload: {id: 'upload'}};
    expect(
      buildKeplerTableSourceOptions({
        dbTables: [hidden, visible],
        datasets,
        tableSelection: selection
      }).map(option => option.value)
    ).toEqual(['places', 'upload']);
    expect(
      buildKeplerTableLayerOptions([hidden, visible], ['private', 'upload', 'places'], selection)
    ).toEqual([
      {value: 'places', label: 'places'},
      {value: 'upload', label: 'upload'}
    ]);
  });

  test('supports custom saved identities and labels while still enforcing table visibility', () => {
    const places = table('places');
    const selection: KeplerTableSelectionOptions = {
      getDatasetIdForTable: () => 'catalog:places',
      getTableLabel: () => 'Places',
      findTableForDatasetId: (_tables, id) => (id === 'legacy' ? places : undefined)
    };
    expect(findKeplerTableForDatasetId([places], 'legacy', selection)).toBe(places);
    expect(
      buildKeplerTableSourceOptions({
        dbTables: [places],
        datasets: {legacy: {id: 'legacy'}},
        tableSelection: selection
      })
    ).toEqual([{value: 'legacy', label: 'Places', color: [143, 149, 161], isLoaded: true}]);
    expect(buildKeplerTableLayerOptions([places], ['legacy'], selection)).toEqual([
      {value: 'catalog:places', label: 'Places'}
    ]);
    expect(
      findKeplerTableForDatasetId([places], 'legacy', {...selection, includeTable: () => false})
    ).toBeUndefined();
  });

  test('sorts equal labels by stable id and prevents collisions from replacing loaded options', () => {
    const selection = {...policy, getTableLabel: () => 'Same'};
    expect(buildKeplerTableLayerOptions([table('z'), table('a')], ['a'], selection)).toEqual([
      {label: 'Same', value: 'a'},
      {label: 'Same', value: 'z'}
    ]);
    expect(
      buildKeplerTableSourceOptions({
        dbTables: [table('z'), table('a')],
        tableSelection: selection
      }).map(option => option.value)
    ).toEqual(['a', 'z']);
    expect(
      buildKeplerTableSourceOptions({
        dbTables: [table('new')],
        datasets: {saved: {id: 'saved', label: 'Saved'}},
        tableSelection: {getDatasetIdForTable: () => 'saved'}
      })
    ).toEqual([{value: 'saved', label: 'Saved', color: [143, 149, 161], isLoaded: true}]);
    expect(buildKeplerTableSourceOptions({dbTables: []})).toEqual([]);
  });
});
