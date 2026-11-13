// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, fireEvent, screen} from '@testing-library/react';
import {makeQualifiedTableName, type DataTable} from '@sqlrooms/duckdb-core';
import {IntlWrapper, renderWithTheme} from 'test/helpers/rtl-utils';
import type {KeplerTableSelectionOptions} from '../keplerTableSelection';
import type {KeplerTableSourceSelectorProps} from './KeplerTableSourceSelector';
import {CustomSourceDataSelectorFactory} from './CustomSourceDataSelector';

jest.mock('@duckdb/duckdb-wasm', () => ({DuckDBDataProtocol: {BROWSER_FILEREADER: 2}}));
// Keep option construction and loading orchestration real. The store and popup UI
// are boundaries: tests operate the emitted choices without requiring DuckDB or portals.
jest.mock('../KeplerSlice', () => ({useStoreWithKepler: selector => selector(mockState)}));
jest.mock('@sqlrooms/ui', () => ({
  Button: ({variant: _variant, ...props}) => <button {...props} />,
  cn: (...values) => values.filter(Boolean).join(' ')
}));
jest.mock('./KeplerTableSourceSelector', () => ({
  KeplerTableSourceSelector: ({
    disabled = false,
    options,
    selectedValue,
    onSelect,
    renderTrigger
  }: KeplerTableSourceSelectorProps) => (
    <div>
      {renderTrigger?.({
        disabled,
        open: false,
        selectedOption: options.find(option => option.value === selectedValue)
      })}
      <fieldset disabled={disabled} aria-label="Sources">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onSelect(option)}
          >{`Choose ${option.label}`}</button>
        ))}
      </fieldset>
    </div>
  )
}));

const Selector = CustomSourceDataSelectorFactory(() => null);
const loaded = {id: 'loaded', label: 'Loaded', color: [10, 20, 30] as [number, number, number]};
const addTableToMap = jest.fn();
let mockState: {
  db: {tables: DataTable[]};
  kepler: {
    addTableToMap: typeof addTableToMap;
    tableSelection: KeplerTableSelectionOptions;
    map: Record<
      string,
      {visState: {layers: {id: string}[]; datasets: Record<string, typeof loaded>}}
    >;
  };
};
const table: DataTable = {
  table: makeQualifiedTableName({database: 'workspace', schema: 'main', table: 'roads'}),
  schema: 'main',
  tableName: 'roads',
  isView: false,
  columns: []
};
function view(props: Partial<React.ComponentProps<typeof Selector>> = {}) {
  return (
    <IntlWrapper>
      <Selector dataId="loaded" datasets={{loaded}} onSelect={jest.fn()} {...props} />
    </IntlWrapper>
  );
}
function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {promise, resolve, reject};
}

beforeEach(() => {
  addTableToMap.mockReset().mockResolvedValue(undefined);
  mockState = {
    db: {tables: [table]},
    kepler: {
      addTableToMap,
      tableSelection: {defaultDbSchema: {database: 'workspace', schema: 'main'}},
      map: {
        other: {visState: {layers: [{id: 'other-layer'}], datasets: {}}},
        target: {visState: {layers: [{id: 'target-layer'}], datasets: {loaded}}}
      }
    }
  };
});
afterEach(() => jest.restoreAllMocks());

describe('SQLRooms source selector loading', () => {
  test('filter and unmatched-layer selectors only expose already loaded datasets', () => {
    const onSelect = jest.fn();
    const {rerender} = renderWithTheme(view({onSelect}));
    expect(screen.queryByRole('button', {name: 'Choose roads'})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: 'Choose Loaded'}));
    expect(onSelect).toHaveBeenCalledWith('loaded');
    rerender(view({id: 'missing-layer', onSelect}));
    expect(screen.queryByRole('button', {name: 'Choose roads'})).not.toBeInTheDocument();
    expect(addTableToMap).not.toHaveBeenCalled();
  });

  test('selects loaded data immediately and loads new data into the owning map before selecting', async () => {
    const pending = deferred();
    addTableToMap.mockReturnValue(pending.promise);
    const onSelect = jest.fn();
    renderWithTheme(view({id: 'target-layer', onSelect}));
    fireEvent.click(screen.getByRole('button', {name: 'Choose Loaded'}));
    expect(onSelect).toHaveBeenCalledWith('loaded');
    expect(addTableToMap).not.toHaveBeenCalled();
    onSelect.mockClear();
    fireEvent.click(screen.getByRole('button', {name: 'Choose roads'}));
    expect(addTableToMap).toHaveBeenCalledWith({
      mapId: 'target',
      tableName: 'roads',
      options: {autoCreateLayers: false, centerMap: false}
    });
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('button', {name: 'Choose roads'})).toBeDisabled();
    await act(async () => {
      pending.resolve();
      await pending.promise;
    });
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('roads');
    expect(screen.getByRole('button', {name: 'Choose roads'})).toBeEnabled();
  });

  test('reports failed loading without selecting and permits a successful retry', async () => {
    const error = new Error('unavailable table');
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    addTableToMap.mockRejectedValueOnce(error);
    const onSelect = jest.fn();
    renderWithTheme(view({id: 'target-layer', onSelect}));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Choose roads'}));
    });
    expect(log).toHaveBeenCalledWith('Failed to load layer data source:', error);
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('button', {name: 'Choose roads'})).toBeEnabled();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', {name: 'Choose roads'}));
    });
    expect(addTableToMap).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith('roads');
  });

  test('honors a disabled selector and disables an empty catalog', () => {
    const onSelect = jest.fn();
    const {rerender} = renderWithTheme(view({id: 'target-layer', disabled: true, onSelect}));
    expect(screen.getByRole('button', {name: 'Choose roads'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Loaded'})).toBeDisabled();
    expect(onSelect).not.toHaveBeenCalled();
    rerender(view({datasets: {}, dataId: null, defaultValue: 'Choose source'}));
    expect(screen.getByRole('button', {name: 'Choose source'})).toBeDisabled();
    expect(addTableToMap).not.toHaveBeenCalled();
  });

  test('uses map-wide loaded ids to avoid offering a hidden loaded table as a new source', () => {
    mockState.kepler.map.target.visState.datasets = {roads: {...loaded, id: 'roads'}};
    renderWithTheme(view({id: 'target-layer'}));
    expect(screen.queryByRole('button', {name: 'Choose roads'})).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Choose Loaded'})).toBeEnabled();
  });

  test('resolves selected arrays and falls back to the saved id when the dataset is missing', () => {
    const {rerender} = renderWithTheme(view({dataId: ['loaded']}));
    expect(screen.getByRole('button', {name: 'Loaded'})).toBeInTheDocument();
    rerender(view({dataId: 'missing'}));
    expect(screen.getByRole('button', {name: 'missing'})).toBeInTheDocument();
    rerender(view({dataId: [], defaultValue: 'Choose source'}));
    expect(screen.getByRole('button', {name: 'Choose source'})).toBeInTheDocument();
  });
});
