// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import * as arrow from 'apache-arrow';
import {act, cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {getApplicationConfig, initApplicationConfig} from '@kepler.gl/utils';
import {theme} from '@kepler.gl/styles';
import {SqlPanel} from './sql-panel';
import {SchemaPanel} from './schema-panel';
import {PreviewDataPanel} from './preview-data-panel';
import {tableFromFile} from '../table/duckdb-table-utils';

jest.mock('@duckdb/duckdb-wasm', () => ({DuckDBDataProtocol: {BROWSER_FILEREADER: 2}}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => undefined
}));

// Isolate Monaco, layout and virtualized cells, not SQL processing or panel state.
jest.mock('./monaco-editor', () => ({
  __esModule: true,
  default: ({code, onChange, onRunQuery, isReadOnly, tableSchema}: any) => (
    <>
      <textarea
        aria-label="SQL"
        value={code}
        readOnly={isReadOnly}
        onChange={e => onChange(e.target.value)}
      />
      <button onClick={onRunQuery} disabled={isReadOnly}>
        Execute editor query
      </button>
      <output aria-label="suggestions">{JSON.stringify(tableSchema)}</output>
    </>
  )
}));
jest.mock('react-resizable-panels', () => ({
  Panel: ({children}: any) => <div>{children}</div>,
  PanelGroup: ({children}: any) => <div>{children}</div>,
  PanelResizeHandle: ({className}: any) => <div className={className} />
}));
jest.mock('@kepler.gl/components', () => ({
  Button: ({children, onClick}: any) => <button onClick={onClick}>{children}</button>,
  IconButton: ({children, onClick, disabled}: any) => (
    <button aria-label="Run query" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
  Icons: {Play: () => null, Add: () => null, ArrowRight: () => null},
  FieldToken: ({type}: any) => <span>{type}</span>,
  Tooltip: () => null,
  LoadingSpinner: () => <div role="status">Loading</div>,
  FileDrop: ({children, onDrop, className}: any) => (
    <div className={className}>
      <input
        aria-label="Import file"
        type="file"
        multiple
        onChange={e => onDrop(e.target.files, e)}
      />
      {children}
    </div>
  ),
  renderedSize: () => 100,
  DataTable: ({
    columns,
    colMeta,
    dataContainer,
    pinnedColumns,
    copyTableColumn,
    pinTableColumn
  }: any) => (
    <div>
      <output aria-label="preview rows">
        {JSON.stringify(
          dataContainer.mapIndex(row =>
            columns.map((_: string, index: number) => dataContainer.valueAt(row.index, index))
          )
        )}
      </output>
      {columns.map((column: string) => (
        <div key={column}>
          <span>
            {column}: {colMeta[column].type}
          </span>
          <button onClick={() => copyTableColumn(column)}>Copy {column}</button>
          <button
            aria-pressed={pinnedColumns.includes(column)}
            onClick={() => pinTableColumn(column)}
          >
            Pin {column}
          </button>
        </div>
      ))}
    </div>
  )
}));
jest.mock('../table/duckdb-table-utils', () => ({
  ...jest.requireActual('../table/duckdb-table-utils'),
  tableFromFile: jest.fn()
}));

const originalDatabase = getApplicationConfig().database;
const empty = () => new arrow.Table();
const schema = () => arrow.tableFromArrays({name: ['city', 'count'], type: ['VARCHAR', 'INTEGER']});
const result = () =>
  new arrow.Table({
    city: arrow.vectorFromArray(['Lviv', 'Kyiv'], new arrow.Utf8()),
    count: arrow.vectorFromArray(new Int32Array([0, 2]))
  });

function configureDatabase() {
  const query = jest.fn(async (sql: string): Promise<arrow.Table> => {
    if (sql === 'SHOW TABLES;') return empty();
    if (sql.startsWith('EXPLAIN')) return arrow.tableFromArrays({plan: ['select']});
    if (sql.startsWith('PRAGMA')) return schema();
    if (sql.startsWith('SELECT')) return result();
    return empty();
  });
  const close = jest.fn().mockResolvedValue(undefined);
  const connect = jest.fn().mockResolvedValue({query, close});
  initApplicationConfig({database: {connect} as any});
  return {query, close, connect};
}
function mount(component: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
}
async function execute() {
  fireEvent.click(screen.getByRole('button', {name: 'Execute editor query'}));
  await waitFor(() => expect(screen.getByLabelText('SQL')).not.toHaveAttribute('readonly'));
}

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  mockDispatch.mockClear();
  jest.mocked(tableFromFile).mockReset().mockResolvedValue(null);
});
afterEach(() => {
  cleanup();
  initApplicationConfig({database: originalDatabase});
  jest.restoreAllMocks();
  window.history.replaceState({}, '', '/');
});

it('restores SQL from the URL, updates it without navigation and removes empty SQL', async () => {
  configureDatabase();
  window.history.replaceState({}, '', '/?other=kept&sql=SELECT+42');
  mount(<SqlPanel initialSql="SELECT 1" />);
  expect(screen.getByLabelText('SQL')).toHaveValue('SELECT 42');
  fireEvent.change(screen.getByLabelText('SQL'), {target: {value: 'SELECT 2'}});
  expect(new URL(window.location.href).searchParams.get('sql')).toBe('SELECT 2');
  fireEvent.change(screen.getByLabelText('SQL'), {target: {value: ''}});
  expect(new URL(window.location.href).searchParams.has('sql')).toBe(false);
  expect(new URL(window.location.href).searchParams.get('other')).toBe('kept');
  expect(screen.getByRole('button', {name: 'Run query'})).toBeDisabled();
  await screen.findByText('Add files to DuckDB');
});

it('executes setup statements before the final select and adds the real Arrow result to the map', async () => {
  const {query, close} = configureDatabase();
  mount(
    <SqlPanel initialSql={'CREATE TABLE cities AS SELECT 1; -- comment\nSELECT * FROM cities'} />
  );
  await execute();
  expect(await screen.findByText('2 rows')).toBeInTheDocument();
  const statements = query.mock.calls.map(([sql]) => sql).filter(sql => sql !== 'SHOW TABLES;');
  expect(statements).toEqual([
    'CREATE TABLE cities AS SELECT 1',
    'EXPLAIN (SELECT * FROM cities)',
    "CREATE OR REPLACE TABLE 'temp_keplergl_table' AS SELECT * FROM cities",
    'PRAGMA table_info("temp_keplergl_table")',
    'SELECT "city", "count" FROM "temp_keplergl_table"',
    'DROP TABLE temp_keplergl_table;'
  ]);
  expect(close).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', {name: 'Add to Map'}));
  fireEvent.click(screen.getByRole('button', {name: 'Add to Map'}));
  const datasets = mockDispatch.mock.calls.map(([action]) => action.payload.datasets[0]);
  expect(datasets.map(d => d.info.label)).toEqual(['query_result', 'query_result_1']);
  expect(datasets[0].data.rows).toBeInstanceOf(arrow.Table);
  expect(datasets[0].data.fields.map((f: any) => [f.name, f.type])).toEqual([
    ['city', 'string'],
    ['count', 'integer']
  ]);
});

it('holds the editor read-only until the database query finishes', async () => {
  const {query} = configureDatabase();
  let resolveQuery!: (table: arrow.Table) => void;
  const pending = new Promise<arrow.Table>(resolve => {
    resolveQuery = resolve;
  });
  const original = query.getMockImplementation();
  if (!original) throw new Error('Expected configured query mock');
  query.mockImplementation(sql => (sql.startsWith('SELECT') ? pending : original(sql)));
  mount(<SqlPanel initialSql="SELECT * FROM cities" />);
  fireEvent.click(screen.getByRole('button', {name: 'Run query'}));
  await waitFor(() =>
    expect(query).toHaveBeenCalledWith('SELECT "city", "count" FROM "temp_keplergl_table"')
  );
  expect(screen.getByLabelText('SQL')).toHaveAttribute('readonly');
  expect(screen.getByRole('button', {name: 'Run query'})).toBeDisabled();
  expect(screen.getByText('Loading')).toBeInTheDocument();
  await act(async () => resolveQuery(result()));
  expect(await screen.findByText('2 rows')).toBeInTheDocument();
  expect(screen.getByRole('button', {name: 'Run query'})).toBeEnabled();
});

it('shows query errors and clears them after a successful retry', async () => {
  const {query} = configureDatabase();
  const original = query.getMockImplementation();
  if (!original) throw new Error('Expected configured query mock');
  query.mockImplementation(sql =>
    sql.startsWith('CREATE OR REPLACE')
      ? Promise.reject(new Error('Query unavailable'))
      : original(sql)
  );
  mount(<SqlPanel initialSql="SELECT * FROM cities" />);
  await execute();
  expect(await screen.findByText('Query unavailable')).toBeInTheDocument();
  query.mockImplementation(original);
  await execute();
  expect(await screen.findByText('2 rows')).toBeInTheDocument();
  expect(screen.queryByText('Query unavailable')).not.toBeInTheDocument();
});

it('rejects comment-only queries before connecting and reports a missing database', async () => {
  const {connect} = configureDatabase();
  mount(<SqlPanel initialSql="-- no statement" />);
  await waitFor(() => expect(connect).toHaveBeenCalledTimes(1)); // schema refresh only
  await execute();
  expect(screen.getByText('Query is empty')).toBeInTheDocument();
  expect(connect).toHaveBeenCalledTimes(1);
  initApplicationConfig({database: undefined});
  fireEvent.change(screen.getByLabelText('SQL'), {target: {value: 'SELECT 1'}});
  await execute();
  expect(screen.getByText('The database is not configured properly.')).toBeInTheDocument();
});

it('executes a non-select without attempting to preview or add a result', async () => {
  const {query} = configureDatabase();
  const original = query.getMockImplementation();
  if (!original) throw new Error('Expected configured query mock');
  query.mockImplementation(sql =>
    sql.startsWith('EXPLAIN') ? Promise.reject(new Error('not selectable')) : original(sql)
  );
  mount(<SqlPanel initialSql="DELETE FROM cities" />);
  await execute();
  expect(query).toHaveBeenCalledWith('DELETE FROM cities');
  expect(screen.queryByRole('button', {name: 'Add to Map'})).not.toBeInTheDocument();
});

it('validates dropped files and recovers after an import error', async () => {
  configureDatabase();
  mount(<SqlPanel />);
  const input = screen.getByLabelText('Import file');
  fireEvent.change(input, {target: {files: [new File([''], 'bad.exe')]}});
  expect(screen.getByText('Unsupported file formats: bad.exe')).toBeInTheDocument();
  expect(tableFromFile).not.toHaveBeenCalled();
  jest.mocked(tableFromFile).mockResolvedValueOnce(new Error('Invalid CSV'));
  const first = new File(['city\nLviv'], 'cities.csv');
  fireEvent.change(input, {target: {files: [first]}});
  expect(await screen.findByText('Invalid CSV')).toBeInTheDocument();
  const second = new File(['{}'], 'fixed.json');
  fireEvent.change(input, {target: {files: [second, first]}});
  await waitFor(() => expect(screen.queryByText('Invalid CSV')).not.toBeInTheDocument());
  expect(jest.mocked(tableFromFile).mock.calls.map(([file]) => file)).toEqual([first, second]);
});

it('loads table/column suggestions, renders their types and refreshes after database changes', async () => {
  const {query, close} = configureDatabase();
  const original = query.getMockImplementation();
  if (!original) throw new Error('Expected configured query mock');
  query.mockImplementation(sql => {
    if (sql === 'SHOW TABLES;') return Promise.resolve(arrow.tableFromArrays({name: ['cities']}));
    if (sql.startsWith('Select')) return Promise.resolve(result());
    return original(sql);
  });
  const setTableSchema = jest.fn();
  const view = mount(
    <SchemaPanel setTableSchema={setTableSchema} droppedFile={null} schemaUpdateTrigger={0} />
  );
  await waitFor(() =>
    expect(setTableSchema).toHaveBeenCalledWith([
      {column_name: 'city', table_name: 'cities'},
      {column_name: 'count', table_name: 'cities'}
    ])
  );
  fireEvent.click(screen.getByText('cities'));
  expect(screen.getByText('city')).toBeInTheDocument();
  expect(screen.getByText('integer')).toBeInTheDocument();
  expect(close).toHaveBeenCalledTimes(1);
  query.mockImplementation(sql =>
    sql === 'SHOW TABLES;' ? Promise.resolve(empty()) : original(sql)
  );
  view.rerender(
    <ThemeProvider theme={theme}>
      <SchemaPanel setTableSchema={setTableSchema} droppedFile={null} schemaUpdateTrigger={1} />
    </ThemeProvider>
  );
  await screen.findByText('Add files to DuckDB');
  expect(setTableSchema).toHaveBeenLastCalledWith([]);
  expect(close).toHaveBeenCalledTimes(2);
});

it('shows loading while a dropped file has no schema and handles an unconfigured database', () => {
  initApplicationConfig({database: undefined});
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  const setTableSchema = jest.fn();
  mount(
    <SchemaPanel
      setTableSchema={setTableSchema}
      droppedFile={new File([''], 'data.csv')}
      schemaUpdateTrigger={0}
    />
  );
  expect(screen.getByText('Loading')).toBeInTheDocument();
  expect(setTableSchema).not.toHaveBeenCalled();
  expect(error).toHaveBeenCalledWith('The database is not configured properly.');
});

it('previews Arrow values, copies a column, toggles pins and replaces stale result data', () => {
  const writeText = jest.fn().mockResolvedValue(undefined);
  const previous = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
  Object.defineProperty(navigator, 'clipboard', {configurable: true, value: {writeText}});
  try {
    const props = {dataTableStyle: {}, onAddResultToMap: jest.fn(), defaultPinnedColumns: ['city']};
    const view = mount(
      <PreviewDataPanel
        {...props}
        result={{table: result(), tableDuckDBTypes: {count: 'INTEGER'}}}
      />
    );
    expect(screen.getByLabelText('preview rows')).toHaveTextContent('[["Lviv",0],["Kyiv",2]]');
    expect(screen.getByRole('button', {name: 'Pin city'})).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', {name: 'Copy count'}));
    expect(writeText).toHaveBeenCalledWith('0\n2');
    fireEvent.click(screen.getByRole('button', {name: 'Pin city'}));
    expect(screen.getByRole('button', {name: 'Pin city'})).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(screen.getByRole('button', {name: 'Pin count'}));
    expect(screen.getByRole('button', {name: 'Pin count'})).toHaveAttribute('aria-pressed', 'true');
    view.rerender(
      <ThemeProvider theme={theme}>
        <PreviewDataPanel
          {...props}
          result={{
            table: new arrow.Table({
              city: arrow.vectorFromArray(['Odesa'], new arrow.Utf8())
            }),
            tableDuckDBTypes: {}
          }}
        />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', {name: 'Copy city'}));
    expect(writeText).toHaveBeenLastCalledWith('Odesa');
    expect(screen.queryByRole('button', {name: 'Copy count'})).not.toBeInTheDocument();
  } finally {
    if (previous) Object.defineProperty(navigator, 'clipboard', previous);
    else Reflect.deleteProperty(navigator, 'clipboard');
  }
});
