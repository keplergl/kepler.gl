// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {KeplerTable} from '@kepler.gl/table';

import {renderWithTheme} from 'test/helpers/component-jest-utils';
import DataTableModalFactory from './data-table-modal';

jest.mock('../common/data-table/cell-size', () => ({
  renderedSize: () => ({row: 80, header: 80})
}));

const tableProps: {current: Record<string, unknown> | null} = {current: null};

function StubDataTable(props: {
  createFilterFromColumn?: (column: string) => void;
  renameTableColumn?: (column: string, newName: string) => void;
  deleteTableColumn?: (column: string) => void;
}) {
  tableProps.current = props;
  return (
    <button type="button" onClick={() => props.createFilterFromColumn?.('region')}>
      create-filter
    </button>
  );
}

const DataTableModal = DataTableModalFactory(StubDataTable as never, (() => null) as never);

function makeDataset(type: string) {
  const table = new KeplerTable({
    info: {id: 'cities', label: 'cities', type},
    color: [0, 0, 0]
  });
  table.updateSchema({
    fields: [
      {name: 'region', type: ALL_FIELD_TYPES.string},
      {name: 'pop', type: ALL_FIELD_TYPES.integer}
    ],
    rows: [['west', 1]]
  });
  return table;
}

function renderModal(type: string) {
  const createFilterFromColumn = jest.fn();
  const renameTableColumn = jest.fn();
  const deleteTableColumn = jest.fn();
  const toggleSidePanel = jest.fn();
  const toggleModal = jest.fn();
  const view = renderWithTheme(
    <DataTableModal
      dataId="cities"
      datasets={{cities: makeDataset(type)}}
      showTab={false}
      sortTableColumn={jest.fn()}
      pinTableColumn={jest.fn()}
      copyTableColumn={jest.fn()}
      renameTableColumn={renameTableColumn}
      deleteTableColumn={deleteTableColumn}
      createFilterFromColumn={createFilterFromColumn}
      showDatasetTable={jest.fn()}
      setColumnDisplayFormat={jest.fn()}
      uiStateActions={{toggleSidePanel, toggleModal} as never}
      uiState={{} as never}
    />
  );
  return {...view, createFilterFromColumn, toggleSidePanel, toggleModal};
}

describe('data table column edits', () => {
  test('create filter opens the filter panel and closes the table', () => {
    const {createFilterFromColumn, toggleSidePanel, toggleModal} = renderModal('local');

    expect(tableProps.current?.renameTableColumn).toEqual(expect.any(Function));
    expect(tableProps.current?.deleteTableColumn).toEqual(expect.any(Function));

    fireEvent.click(screen.getByRole('button', {name: 'create-filter'}));
    expect(createFilterFromColumn).toHaveBeenCalledWith('cities', 'region');
    expect(toggleSidePanel).toHaveBeenCalledWith('filter');
    expect(toggleModal).toHaveBeenCalledWith(null);
  });

  test('externally hosted datasets can create a filter but not rename or delete', () => {
    renderModal('externally-hosted');

    expect(tableProps.current?.createFilterFromColumn).toEqual(expect.any(Function));
    expect(tableProps.current?.renameTableColumn).toBeUndefined();
    expect(tableProps.current?.deleteTableColumn).toBeUndefined();
  });
});
