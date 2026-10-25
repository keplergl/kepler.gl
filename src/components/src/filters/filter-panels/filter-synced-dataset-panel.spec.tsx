// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen} from '@testing-library/react';

import {ALL_FIELD_TYPES, FILTER_TYPES} from '@kepler.gl/constants';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

// Break DatasetTag's package-index cycle when testing these factories directly.
jest.mock('../../side-panel/common/dataset-tag', () => () => () => null);

import FilterSyncedDatasetPanelFactory, {
  DatasetItemFactory,
  SyncedDatasetButtonFactory
} from './filter-synced-dataset-panel';
import FieldPanelWithFieldSelectFactory from './filter-panel-with-field-select';

const MockDatasetItem = ({dataId, datasets, fields, index, onFieldSelector, addButton}) => (
  <div
    data-testid={`dataset-${dataId}`}
    data-datasets={Object.keys(datasets).join(',')}
    data-fields={fields.map(field => field.name).join(',')}
  >
    {fields.map(field => (
      <button key={field.name} onClick={() => onFieldSelector(field, index)}>
        {field.name}
      </button>
    ))}
    {addButton}
  </div>
);
const MockLayerTimeline = () => <div data-testid="layer-timeline" />;
const MockSourceDataSelector = () => <div data-testid="source-data-selector" />;
const MockSyncedDatasetButton = ({onAddSyncedFilter}) => (
  <button onClick={onAddSyncedFilter}>Sync dataset</button>
);
const MockSyncLayerTimelineButton = () => <div data-testid="sync-layer-timeline" />;

const FilterSyncedDatasetPanel = FilterSyncedDatasetPanelFactory(
  MockDatasetItem,
  MockLayerTimeline,
  MockSourceDataSelector,
  MockSyncedDatasetButton,
  MockSyncLayerTimelineButton
);

const integerField = name => ({name, type: ALL_FIELD_TYPES.integer});
const realField = name => ({name, type: ALL_FIELD_TYPES.real});
const stringField = name => ({name, type: ALL_FIELD_TYPES.string});

const datasets = {
  first: {
    id: 'first',
    fields: [integerField('count')],
    supportedFilterTypes: [ALL_FIELD_TYPES.integer]
  },
  incompatible: {
    id: 'incompatible',
    fields: [stringField('count')],
    supportedFilterTypes: [ALL_FIELD_TYPES.string]
  },
  second: {
    id: 'second',
    fields: [integerField('amount'), realField('ratio')],
    supportedFilterTypes: [ALL_FIELD_TYPES.integer, ALL_FIELD_TYPES.real]
  },
  realOnly: {
    id: 'realOnly',
    fields: [realField('count'), realField('ratio')],
    supportedFilterTypes: [ALL_FIELD_TYPES.real]
  },
  third: {
    id: 'third',
    fields: [integerField('count')],
    supportedFilterTypes: [ALL_FIELD_TYPES.integer]
  }
};

const defaultProps = {
  datasets,
  filter: {
    id: 'filter',
    dataId: ['first'],
    name: ['count'],
    fieldType: ALL_FIELD_TYPES.integer,
    type: FILTER_TYPES.range
  },
  idx: 2,
  setFilter: jest.fn(),
  onFieldSelector: jest.fn(),
  onSourceDataSelector: jest.fn()
};

describe('FilterSyncedDatasetPanel', () => {
  test('places the add control beside the current data source', () => {
    renderWithTheme(<FilterSyncedDatasetPanel {...defaultProps} />);

    expect(screen.getByTestId('source-data-selector').parentElement).toBe(
      screen.getByRole('button', {name: 'Sync dataset'}).parentElement
    );
  });

  test('waits for a field selection when multiple compatible fields do not match by name', () => {
    const setFilter = jest.fn();
    renderWithTheme(<FilterSyncedDatasetPanel {...defaultProps} setFilter={setFilter} />);

    fireEvent.click(screen.getByRole('button', {name: 'Sync dataset'}));

    expect(setFilter).not.toHaveBeenCalled();
    expect(screen.getByTestId('dataset-second')).toHaveAttribute('data-fields', 'amount,ratio');

    fireEvent.click(screen.getByRole('button', {name: 'ratio'}));

    expect(setFilter).toHaveBeenCalledWith(2, ['dataId', 'name'], ['second', 'ratio'], 1);
  });

  test('automatically uses an exact-name field across compatible numeric types', () => {
    const setFilter = jest.fn();
    renderWithTheme(
      <FilterSyncedDatasetPanel
        {...defaultProps}
        datasets={{first: datasets.first, realOnly: datasets.realOnly}}
        setFilter={setFilter}
      />
    );

    fireEvent.click(screen.getByRole('button', {name: 'Sync dataset'}));

    expect(setFilter).toHaveBeenCalledWith(2, ['dataId', 'name'], ['realOnly', 'count'], 1);
  });

  test('limits synced rows to compatible fields and unselected datasets', () => {
    const filter = {
      ...defaultProps.filter,
      dataId: ['first', 'second'],
      name: ['count', 'amount']
    };
    renderWithTheme(<FilterSyncedDatasetPanel {...defaultProps} filter={filter} />);

    expect(screen.getByTestId('dataset-first')).toHaveAttribute(
      'data-datasets',
      'first,realOnly,third'
    );
    expect(screen.getByTestId('dataset-first')).toHaveAttribute('data-fields', 'count');
    expect(screen.getByTestId('dataset-second')).toHaveAttribute(
      'data-datasets',
      'second,realOnly,third'
    );
    expect(screen.getByTestId('dataset-second')).toHaveAttribute('data-fields', 'amount,ratio');
    expect(screen.getByTestId('dataset-second')).toContainElement(
      screen.getByRole('button', {name: 'Sync dataset'})
    );
    expect(screen.queryByTestId('sync-layer-timeline')).not.toBeInTheDocument();
  });
});

describe('SyncedDatasetButton', () => {
  const SyncedDatasetButton = SyncedDatasetButtonFactory();

  test('renders a centered accessible icon without a filled button treatment', () => {
    const onAddSyncedFilter = jest.fn();
    renderWithTheme(<SyncedDatasetButton onAddSyncedFilter={onAddSyncedFilter} />);

    const button = screen.getByRole('button', {
      name: 'Add synced filter'
    });
    expect(button).toHaveTextContent('');
    expect(button).toHaveStyle({
      width: '16px',
      height: '34px',
      marginLeft: '4px',
      padding: '0px',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: '0px'
    });
    expect(button.querySelector('svg')).toHaveAttribute('height', '16px');
    expect(button.querySelector('svg')).toHaveStyle({marginRight: '0px'});

    fireEvent.click(button);
    expect(onAddSyncedFilter).toHaveBeenCalledTimes(1);
  });
});

describe('DatasetItem', () => {
  const MockSourceSelector = ({className}) => (
    <div className={className} data-testid="synced-source-selector" />
  );
  const MockPanelHeaderAction = ({tooltip, onClick, IconComponent}) => (
    <button aria-label={tooltip} onClick={onClick}>
      <IconComponent />
    </button>
  );
  const DatasetItem = DatasetItemFactory(MockSourceSelector, MockPanelHeaderAction);

  test('shows only the delete action for a synced dataset source', () => {
    const onRemoveSyncedFilter = jest.fn();
    renderWithTheme(
      <DatasetItem
        dataId="second"
        datasets={datasets}
        fields={datasets.second.fields}
        filter={{...defaultProps.filter, dataId: ['first', 'second']}}
        index={1}
        onRemoveSyncedFilter={onRemoveSyncedFilter}
        filterDatasetsNum={2}
        compatibleDatasetsNum={3}
        onSelectSyncedDataset={jest.fn()}
        onFieldSelector={jest.fn()}
        addButton={null}
      />
    );

    const sourceSelector = screen.getByTestId('synced-source-selector');
    expect(sourceSelector).toHaveStyle({minWidth: '0', overflow: 'hidden'});
    expect(sourceSelector.parentElement).toHaveStyle({width: '100%', minWidth: '0'});
    expect(screen.queryByRole('button', {name: 'tooltip.editFilterJson'})).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', {name: 'tooltip.delete'}));
    expect(onRemoveSyncedFilter).toHaveBeenCalledWith(1);
  });
});

describe('FilterPanelWithFieldSelect', () => {
  const MockFilterPanelHeader = ({children}) => <div>{children}</div>;
  const MockFieldSelector = () => <div data-testid="field-selector" />;
  const MockPanelHeaderAction = () => null;
  const MockFilterSyncedDatasetPanel = () => <div data-testid="synced-dataset-panel" />;
  const MockSyncedFieldSelector = ({type}) => <div data-testid="synced-field">{type}</div>;

  const FilterPanelWithFieldSelect = FieldPanelWithFieldSelectFactory(
    MockFilterPanelHeader as any,
    MockFieldSelector as any,
    MockPanelHeaderAction as any,
    MockFilterSyncedDatasetPanel as any,
    MockSyncedFieldSelector as any
  );

  test('uses the synced dataset UI for a non-time filter', () => {
    const filter = {
      ...defaultProps.filter,
      dataId: ['first', 'second'],
      name: ['count', 'amount'],
      enabled: true,
      inverted: false
    };

    renderWithTheme(
      <FilterPanelWithFieldSelect
        allAvailableFields={datasets.first.fields as any}
        datasets={datasets as any}
        filter={filter as any}
        idx={0}
        removeFilter={jest.fn()}
        setFilter={jest.fn()}
      >
        <div />
      </FilterPanelWithFieldSelect>
    );

    expect(screen.getByTestId('synced-field')).toHaveTextContent(ALL_FIELD_TYPES.integer);
    expect(screen.getByTestId('synced-dataset-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('field-selector')).not.toBeInTheDocument();
  });
});
