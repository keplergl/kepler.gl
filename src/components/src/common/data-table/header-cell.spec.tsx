// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import {fireEvent, screen} from '@testing-library/react';

import {renderWithTheme} from 'test/helpers/component-jest-utils';
import HeaderCellFactory, {HeaderCellProps} from './header-cell';

beforeAll(() => {
  if (typeof window.IntersectionObserver === 'undefined') {
    window.IntersectionObserver = class {
      observe() {
        return undefined;
      }
      unobserve() {
        return undefined;
      }
      disconnect() {
        return undefined;
      }
      takeRecords() {
        return [];
      }
      root = null;
      rootMargin = '';
      thresholds: number[] = [];
    } as unknown as typeof IntersectionObserver;
  }
});

const HeaderCell = HeaderCellFactory(
  () => <span />,
  () => null,
  () => null
);

const columns = ['region', 'pop'];
const colMeta = {
  region: {name: 'region', type: 'string', colIdx: 0},
  pop: {name: 'pop', type: 'integer', colIdx: 1}
};

function ColumnHeader({
  renameTableColumn,
  changeTableColumnType,
  deleteTableColumn,
  createFilterFromColumn,
  metadata = colMeta,
  typeChangeValues
}: {
  renameTableColumn?: (column: string, newName: string) => void;
  changeTableColumnType?: (column: string, newType: string) => void;
  deleteTableColumn?: (column: string) => void;
  createFilterFromColumn?: (column: string) => void;
  metadata?: typeof colMeta;
  typeChangeValues?: unknown[];
}) {
  const [moreOptionsColumn, setMoreOptionsColumn] = useState<string | null>(null);
  const props = {
    colMeta: metadata,
    typeChangeDataContainer: typeChangeValues
      ? {
          numRows: () => typeChangeValues.length,
          numColumns: () => 1,
          valueAt: (rowIndex: number) => typeChangeValues[rowIndex]
        }
      : undefined,
    sortColumn: {},
    pinTableColumn: jest.fn(),
    copyTableColumn: jest.fn(),
    sortTableColumn: jest.fn(),
    renameTableColumn,
    changeTableColumnType,
    deleteTableColumn,
    createFilterFromColumn
  } as unknown as HeaderCellProps['props'];

  return (
    <HeaderCell
      cellInfo={{
        columnIndex: 0,
        key: 'region',
        style: {},
        isScrolling: false,
        isVisible: true,
        parent: null,
        rowIndex: 0
      }}
      columns={columns}
      isPinned={false}
      showStats={false}
      moreOptionsColumn={moreOptionsColumn}
      toggleMoreOptions={column =>
        setMoreOptionsColumn(current => (current === column ? null : column))
      }
      style={{}}
      props={props}
    />
  );
}

function openMenu(container: HTMLElement) {
  fireEvent.click(container.querySelector('.more') as HTMLElement);
}

function startRename(container: HTMLElement) {
  openMenu(container);
  fireEvent.click(screen.getByText('Rename'));
  return screen.getByLabelText('Rename column') as HTMLInputElement;
}

describe('column header menu', () => {
  test('commits a rename on enter and on blur after an edit', () => {
    const renameTableColumn = jest.fn();
    const {container} = renderWithTheme(<ColumnHeader renameTableColumn={renameTableColumn} />);

    const input = startRename(container);
    fireEvent.change(input, {target: {value: 'area'}});
    fireEvent.keyDown(input, {key: 'Enter'});
    expect(renameTableColumn).toHaveBeenCalledWith('region', 'area');

    renameTableColumn.mockClear();
    const next = startRename(container);
    fireEvent.change(next, {target: {value: 'zone'}});
    fireEvent.blur(next);
    expect(renameTableColumn).toHaveBeenCalledWith('region', 'zone');
  });

  test('cancels a rename on escape and ignores a blur that did not edit', () => {
    const renameTableColumn = jest.fn();
    const {container} = renderWithTheme(<ColumnHeader renameTableColumn={renameTableColumn} />);

    const input = startRename(container);
    fireEvent.change(input, {target: {value: 'area'}});
    fireEvent.keyDown(input, {key: 'Escape'});
    expect(renameTableColumn).not.toHaveBeenCalled();
    expect(screen.getByText('region')).toBeTruthy();

    const untouched = startRename(container);
    fireEvent.blur(untouched);
    expect(renameTableColumn).not.toHaveBeenCalled();
  });

  test('rejects a blank, unchanged, or duplicate name', () => {
    const renameTableColumn = jest.fn();
    const {container} = renderWithTheme(<ColumnHeader renameTableColumn={renameTableColumn} />);

    const blank = startRename(container);
    fireEvent.change(blank, {target: {value: '   '}});
    fireEvent.keyDown(blank, {key: 'Enter'});

    const same = startRename(container);
    fireEvent.keyDown(same, {key: 'Enter'});

    const duplicate = startRename(container);
    fireEvent.change(duplicate, {target: {value: 'pop'}});
    fireEvent.keyDown(duplicate, {key: 'Enter'});

    expect(renameTableColumn).not.toHaveBeenCalled();
  });

  test('resets delete confirmation when the menu closes', () => {
    const deleteTableColumn = jest.fn();
    const {container} = renderWithTheme(
      <ColumnHeader deleteTableColumn={deleteTableColumn} renameTableColumn={jest.fn()} />
    );

    openMenu(container);
    fireEvent.click(screen.getByText('Delete Column'));
    expect(screen.getByText('Delete this column?')).toBeTruthy();

    fireEvent.click(document.querySelector('.ReactModal__Overlay') as HTMLElement);
    expect(screen.queryByText('Delete this column?')).toBeNull();

    openMenu(container);
    expect(screen.getByText('Delete Column')).toBeTruthy();
    expect(screen.queryByText('Delete this column?')).toBeNull();

    fireEvent.click(screen.getByText('Delete Column'));
    fireEvent.click(screen.getByRole('button', {name: 'Delete'}));
    expect(deleteTableColumn).toHaveBeenCalledWith('region');
  });

  test('creates a filter from the column menu', () => {
    const createFilterFromColumn = jest.fn();
    const {container} = renderWithTheme(
      <ColumnHeader createFilterFromColumn={createFilterFromColumn} renameTableColumn={jest.fn()} />
    );

    openMenu(container);
    fireEvent.click(screen.getByText('Create Filter'));
    expect(createFilterFromColumn).toHaveBeenCalledWith('region');
  });

  test('changes the column data type from the column menu', () => {
    const changeTableColumnType = jest.fn();
    const {container} = renderWithTheme(
      <ColumnHeader changeTableColumnType={changeTableColumnType} renameTableColumn={jest.fn()} />
    );

    openMenu(container);
    fireEvent.click(screen.getByText('Change Data Type'));
    expect(screen.queryByText('Boolean')).toBeNull();
    expect(screen.queryByText('GeoJSON')).toBeNull();
    fireEvent.click(screen.getByText('Integer'));
    expect(changeTableColumnType).toHaveBeenCalledWith('region', 'integer');
  });

  test.each([false, true])(
    'does not scan the existing menu (type changes enabled: %s)',
    enabled => {
      const readValue = jest.fn(() => '10');
      const values = [null];
      Object.defineProperty(values, 0, {get: readValue});
      const {container} = renderWithTheme(
        <ColumnHeader
          changeTableColumnType={enabled ? jest.fn() : undefined}
          typeChangeValues={values}
        />
      );

      openMenu(container);
      expect(readValue).not.toHaveBeenCalled();
      expect(screen.getByText('Copy Column')).toBeTruthy();
      if (enabled) {
        fireEvent.click(screen.getByText('Change Data Type'));
        expect(readValue).toHaveBeenCalled();
      } else {
        expect(screen.queryByText('Change Data Type')).toBeNull();
      }
    }
  );

  test.each([
    {type: 'string', values: ['ML', 'MW'], omitted: ['Integer', 'Real', 'Timestamp']},
    {type: 'real', values: [3.1, 4], omitted: ['Integer', 'Timestamp']},
    {type: 'real', values: [1_700_000_000.4, 1_700_000_001.6], omitted: ['Integer']},
    {type: 'integer', values: [1, 2], omitted: ['Real', 'Timestamp']}
  ])('offers compatible types for $type values $values', ({type, values, omitted}) => {
    const changeTableColumnType = jest.fn();
    const {container} = renderWithTheme(
      <ColumnHeader
        changeTableColumnType={changeTableColumnType}
        metadata={{...colMeta, region: {...colMeta.region, type}}}
        typeChangeValues={values}
      />
    );

    openMenu(container);
    fireEvent.click(screen.getByText('Change Data Type'));
    omitted.forEach(label => expect(screen.queryByText(label)).toBeNull());
    if (!omitted.includes('Timestamp')) expect(screen.getByText('Timestamp')).toBeTruthy();
    fireEvent.click(screen.getByText('String'));
    if (type === 'string') expect(changeTableColumnType).not.toHaveBeenCalled();
    else expect(changeTableColumnType).toHaveBeenCalledWith('region', 'string');
  });

  test('hides type changes for field types outside the initial scope', () => {
    const metadata = {
      ...colMeta,
      region: {...colMeta.region, type: 'boolean'}
    };
    const {container} = renderWithTheme(
      <ColumnHeader
        changeTableColumnType={jest.fn()}
        metadata={metadata}
        typeChangeValues={[true, false]}
      />
    );

    openMenu(container);
    expect(screen.queryByText('Change Data Type')).toBeNull();
  });
});
