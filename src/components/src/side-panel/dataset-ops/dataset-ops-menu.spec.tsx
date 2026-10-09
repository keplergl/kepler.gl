// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent} from '@testing-library/react';
import {Datasets} from '@kepler.gl/table';
import {Field} from '@kepler.gl/types';
import {initApplicationConfig} from '@kepler.gl/utils';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import {DatasetOpsMenu} from './dataset-ops-menu';
import GroupByPanelFactory from './group-by-panel';
import DatasetOpPanel, {CollapsibleSection, fieldNameFromSelector} from './dataset-op-panel';
import SuitabilityPanelFactory from './suitability-panel';

function MockFieldSelector({
  fields,
  value,
  onSelect
}: {
  fields: {name: string}[];
  value?: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <select
      aria-label="group-by-field"
      value={value || ''}
      onChange={event => onSelect(event.target.value)}
    >
      <option value="">Select</option>
      {fields.map(field => (
        <option key={field.name} value={field.name}>
          {field.name}
        </option>
      ))}
    </select>
  );
}

function MockRangeSlider({
  value1,
  onChange
}: {
  value1: number;
  onChange: (value: [number, number]) => void;
}) {
  return (
    <input
      type="number"
      className="mock-range-slider"
      value={value1}
      onChange={event => onChange([0, Number(event.target.value)])}
    />
  );
}

describe('DatasetOpsMenu', () => {
  beforeEach(() => {
    initApplicationConfig({enableDatasetOps: true});
  });

  afterEach(() => {
    initApplicationConfig({enableDatasetOps: true});
  });

  test('replaces a dataset from the menu', () => {
    const replaceDataset = jest.fn();
    const {container} = renderWithTheme(
      <DatasetOpsMenu
        datasetId="cities"
        dataset={{type: 'local'}}
        addGroupBy={jest.fn()}
        addJoin={jest.fn()}
        addSpatialJoin={jest.fn()}
        replaceDataset={replaceDataset}
      />
    );

    fireEvent.click(container.querySelector('.dataset-ops-menu__toggle') as HTMLElement);
    fireEvent.click(document.querySelector('.dataset-ops-menu__replace') as HTMLButtonElement);
    expect(replaceDataset).toHaveBeenCalledWith('cities');
  });

  test('hides replace for derived datasets and vector tiles', () => {
    const {container: derived} = renderWithTheme(
      <DatasetOpsMenu
        datasetId="grouped"
        dataset={{type: 'local', metadata: {derivedDataset: {type: 'groupBy'}}}}
        addGroupBy={jest.fn()}
        replaceDataset={jest.fn()}
      />
    );
    fireEvent.click(derived.querySelector('.dataset-ops-menu__toggle') as HTMLElement);
    expect(document.querySelector('.dataset-ops-menu__replace')).toBeNull();

    const {container: tiles} = renderWithTheme(
      <DatasetOpsMenu
        datasetId="tiles"
        dataset={{type: 'vector-tile'}}
        replaceDataset={jest.fn()}
        showDeleteDataset
        removeDataset={jest.fn()}
      />
    );
    fireEvent.click(tiles.querySelector('.dataset-ops-menu__toggle') as HTMLElement);
    expect(document.querySelector('.dataset-ops-menu__replace')).toBeNull();
  });

  test('shows group-by and join actions for local datasets', () => {
    const addGroupBy = jest.fn();
    const {container} = renderWithTheme(
      <DatasetOpsMenu
        datasetId="cities"
        dataset={{type: 'local'}}
        addGroupBy={addGroupBy}
        addJoin={jest.fn()}
        addSpatialJoin={jest.fn()}
      />
    );

    const toggle = container.querySelector('.dataset-ops-menu__toggle') as HTMLButtonElement;
    expect(toggle.getAttribute('data-for')).toBe('dataset-ops-cities');
    expect(toggle.querySelector('svg')?.getAttribute('height')).toBe('16px');
    expect(container.querySelector('#dataset-ops-cities')).toBeTruthy();

    fireEvent.click(toggle);
    fireEvent.click(document.querySelector('.dataset-ops-menu__group-by') as HTMLButtonElement);
    expect(addGroupBy).toHaveBeenCalledWith('cities');
  });

  test('offers suitability analysis for local datasets', () => {
    const addSuitability = jest.fn();
    const {container} = renderWithTheme(
      <DatasetOpsMenu
        datasetId="cities"
        dataset={{type: 'local'}}
        addSuitability={addSuitability}
      />
    );

    fireEvent.click(container.querySelector('.dataset-ops-menu__toggle') as HTMLElement);
    fireEvent.click(document.querySelector('.dataset-ops-menu__suitability') as HTMLButtonElement);
    expect(addSuitability).toHaveBeenCalledWith('cities');
  });

  test('moves remove dataset into the more settings menu', () => {
    const removeDataset = jest.fn();
    const {container} = renderWithTheme(
      <DatasetOpsMenu
        datasetId="cities"
        dataset={{type: 'local'}}
        addGroupBy={jest.fn()}
        addJoin={jest.fn()}
        addSpatialJoin={jest.fn()}
        showDeleteDataset
        removeDataset={removeDataset}
      />
    );

    fireEvent.click(container.querySelector('.dataset-ops-menu__toggle') as HTMLElement);
    fireEvent.click(document.querySelector('.dataset-ops-menu__remove') as HTMLButtonElement);
    expect(removeDataset).toHaveBeenCalledWith('cities');
  });

  test('shows a delete-only overflow menu for vector tiles', () => {
    const removeDataset = jest.fn();
    const {container} = renderWithTheme(
      <DatasetOpsMenu
        datasetId="tiles"
        dataset={{type: 'vector-tile'}}
        addGroupBy={jest.fn()}
        addJoin={jest.fn()}
        addSpatialJoin={jest.fn()}
        showDeleteDataset
        removeDataset={removeDataset}
      />
    );

    fireEvent.click(container.querySelector('.dataset-ops-menu__toggle') as HTMLElement);
    expect(document.querySelector('.dataset-ops-menu__group-by')).toBeNull();
    expect(document.querySelector('.dataset-ops-menu__join')).toBeNull();
    expect(document.querySelector('.dataset-ops-menu__spatial-join')).toBeNull();
    fireEvent.click(document.querySelector('.dataset-ops-menu__remove') as HTMLButtonElement);
    expect(removeDataset).toHaveBeenCalledWith('tiles');
  });

  test('hides menu for vector tiles and when ops are disabled', () => {
    const {container: tiles} = renderWithTheme(
      <DatasetOpsMenu
        datasetId="tiles"
        dataset={{type: 'vector-tile'}}
        addGroupBy={jest.fn()}
        addJoin={jest.fn()}
        addSpatialJoin={jest.fn()}
      />
    );
    expect(tiles.querySelector('.dataset-ops-menu__toggle')).toBeNull();

    initApplicationConfig({enableDatasetOps: false});
    const {container: disabled} = renderWithTheme(
      <DatasetOpsMenu
        datasetId="cities"
        dataset={{type: 'local'}}
        addGroupBy={jest.fn()}
        addJoin={jest.fn()}
        addSpatialJoin={jest.fn()}
      />
    );
    expect(disabled.querySelector('.dataset-ops-menu__toggle')).toBeNull();

    const removeDataset = jest.fn();
    const {container: deleteOnly} = renderWithTheme(
      <DatasetOpsMenu
        datasetId="cities"
        dataset={{type: 'local'}}
        addGroupBy={jest.fn()}
        addJoin={jest.fn()}
        addSpatialJoin={jest.fn()}
        showDeleteDataset
        removeDataset={removeDataset}
      />
    );
    expect(deleteOnly.querySelector('.dataset-ops-menu__toggle')).toBeNull();
    expect(document.querySelector('.dataset-ops-menu__group-by')).toBeNull();
    fireEvent.click(deleteOnly.querySelector('.dataset-ops-menu__remove') as HTMLElement);
    expect(removeDataset).toHaveBeenCalledWith('cities');
  });
});

describe('GroupByPanel field selection', () => {
  test('fieldNameFromSelector reads string and field objects', () => {
    expect(fieldNameFromSelector('region')).toBe('region');
    expect(fieldNameFromSelector({name: 'pop'})).toBe('pop');
    expect(fieldNameFromSelector(['city'])).toBe('city');
  });

  test('selecting a grouping field updates the op config', () => {
    const GroupByPanel = GroupByPanelFactory(MockFieldSelector as any);
    const setGroupByConfig = jest.fn();
    const {getByLabelText} = renderWithTheme(
      <GroupByPanel
        op={{
          id: 'op-1',
          dataId: 'cities',
          fieldName: null,
          aggregations: {pop: 'sum'},
          resultId: 'out',
          resultLabel: 'cities grouped',
          isConfigActive: true
        }}
        datasets={
          {
            cities: {
              id: 'cities',
              label: 'cities',
              fields: [
                {name: 'region', displayName: 'region', type: 'string'},
                {name: 'pop', displayName: 'pop', type: 'integer'}
              ] as Field[]
            }
          } as unknown as Datasets
        }
        setGroupByConfig={setGroupByConfig}
        runGroupBy={jest.fn()}
        removeDatasetOp={jest.fn()}
      />
    );

    fireEvent.change(getByLabelText('group-by-field'), {target: {value: 'region'}});
    expect(setGroupByConfig).toHaveBeenCalledWith(
      'op-1',
      expect.objectContaining({fieldName: 'region'})
    );
  });

  test('aggregation columns stay in the scrollable panel body', () => {
    const GroupByPanel = GroupByPanelFactory(MockFieldSelector as any);
    const fields = Array.from({length: 24}, (_, i) => ({
      name: `col_${i}`,
      displayName: `col_${i}`,
      type: 'integer'
    })) as Field[];
    const {container} = renderWithTheme(
      <GroupByPanel
        op={{
          id: 'op-1',
          dataId: 'wide',
          fieldName: 'col_0',
          aggregations: {},
          resultId: 'out',
          resultLabel: 'wide grouped',
          isConfigActive: true
        }}
        datasets={{wide: {id: 'wide', label: 'wide', fields}} as unknown as Datasets}
        setGroupByConfig={jest.fn()}
        runGroupBy={jest.fn()}
        removeDatasetOp={jest.fn()}
      />
    );

    fireEvent.click(container.querySelector('.dataset-ops-collapsible__header') as HTMLElement);

    const list = container.querySelector('.dataset-ops-column-list') as HTMLElement;
    const body = container.querySelector('.dataset-ops-panel__body') as HTMLElement;
    expect(list).toBeTruthy();
    expect(list.children.length).toBe(23);
    expect(body).toBeTruthy();
    expect(getComputedStyle(body).overflowY).toBe('auto');
  });
});

describe('DatasetOpPanel help', () => {
  test('shows a help control when titleHelpId is provided', () => {
    const {container, getByLabelText} = renderWithTheme(
      <DatasetOpPanel
        titleId="datasetOps.spatialJoin"
        titleHelpId="datasetOps.spatialJoinHelp"
        onClose={jest.fn()}
        onRun={jest.fn()}
        canRun={false}
      >
        <div />
      </DatasetOpPanel>
    );

    expect(getByLabelText('Help')).toBeTruthy();
    expect(container.querySelector('.dataset-ops-panel__help')).toBeTruthy();
  });

  test('omits the help control when titleHelpId is not provided', () => {
    const {queryByLabelText} = renderWithTheme(
      <DatasetOpPanel titleId="datasetOps.groupBy" onClose={jest.fn()} onRun={jest.fn()} canRun>
        <div />
      </DatasetOpPanel>
    );
    expect(queryByLabelText('Help')).toBeNull();
  });

  test('shows description text instead of title help when descriptionId is provided', () => {
    const {container, queryByLabelText} = renderWithTheme(
      <DatasetOpPanel
        titleId="datasetOps.spatialJoin"
        descriptionId="datasetOps.spatialJoinHelp"
        onClose={jest.fn()}
        onRun={jest.fn()}
        canRun={false}
      >
        <div />
      </DatasetOpPanel>
    );

    expect(queryByLabelText('Help')).toBeNull();
    expect(container.querySelector('.dataset-ops-panel__description')).toBeTruthy();
    expect(container.querySelector('.data-ex-icons-spatial-join')).toBeNull();
  });

  test('shows join description text when descriptionId is provided', () => {
    const {container, queryByLabelText} = renderWithTheme(
      <DatasetOpPanel
        titleId="datasetOps.join"
        descriptionId="datasetOps.joinHelp"
        onClose={jest.fn()}
        onRun={jest.fn()}
        canRun={false}
      >
        <div />
      </DatasetOpPanel>
    );

    expect(queryByLabelText('Help')).toBeNull();
    expect(container.querySelector('.dataset-ops-panel__description')).toBeTruthy();
  });
});

describe('CollapsibleSection', () => {
  test('hides content until the header is clicked', () => {
    const {container, getByText} = renderWithTheme(
      <CollapsibleSection titleId="datasetOps.columnsToInclude">
        <div className="collapsed-body">columns</div>
      </CollapsibleSection>
    );

    expect(container.querySelector('.collapsed-body')).toBeNull();
    fireEvent.click(container.querySelector('.dataset-ops-collapsible__header') as HTMLElement);
    expect(container.querySelector('.collapsed-body')).toBeTruthy();
    expect(getByText('columns')).toBeTruthy();
  });
});

describe('DatasetOpPanel layout', () => {
  test('keeps the form in a scrollable body', () => {
    const {container} = renderWithTheme(
      <DatasetOpPanel titleId="datasetOps.spatialJoin" onClose={jest.fn()} onRun={jest.fn()} canRun>
        <div className="form-content">form</div>
      </DatasetOpPanel>
    );

    const body = container.querySelector('.dataset-ops-panel__body') as HTMLElement;
    expect(body).toBeTruthy();
    expect(body.querySelector('.form-content')).toBeTruthy();
    expect(getComputedStyle(body).overflowY).toBe('auto');
  });

  test('shows a back button instead of a close icon', () => {
    const onClose = jest.fn();
    const {container, queryByLabelText} = renderWithTheme(
      <DatasetOpPanel titleId="datasetOps.spatialJoin" onClose={onClose} onRun={jest.fn()} canRun>
        <div />
      </DatasetOpPanel>
    );

    expect(queryByLabelText('Close')).toBeNull();
    const back = container.querySelector('.dataset-ops-panel__back') as HTMLButtonElement;
    expect(back).toBeTruthy();
    fireEvent.click(back);
    expect(onClose).toHaveBeenCalled();
  });
});

describe('SuitabilityPanel', () => {
  const SuitabilityPanel = SuitabilityPanelFactory(MockRangeSlider as any);

  const datasets = {
    sites: {
      id: 'sites',
      label: 'sites',
      fields: [
        {name: 'name', displayName: 'name', type: 'string'},
        {name: 'access', displayName: 'access', type: 'integer'},
        {name: 'cost', displayName: 'cost', type: 'real'}
      ] as Field[]
    }
  } as unknown as Datasets;

  const op = (overrides = {}) => ({
    id: 'op-1',
    dataId: 'sites',
    weights: {access: 1, cost: 1},
    weightStandardization: 'normalize' as const,
    dataStandardization: 'range' as const,
    outputFieldName: 'score',
    resultId: 'out',
    resultLabel: 'sites suitability',
    isConfigActive: true,
    ...overrides
  });

  test('lists only numeric fields as weights and toggles them off', () => {
    const setSuitabilityConfig = jest.fn();
    const {container} = renderWithTheme(
      <SuitabilityPanel
        op={op()}
        datasets={datasets}
        setSuitabilityConfig={setSuitabilityConfig}
        runSuitability={jest.fn()}
        removeDatasetOp={jest.fn()}
      />
    );

    const list = container.querySelector('.dataset-ops-column-list') as HTMLElement;
    expect(list.textContent).toContain('access');
    expect(list.textContent).toContain('cost');
    expect(list.textContent).not.toContain('name');

    fireEvent.click(list.querySelectorAll('input[type="checkbox"]')[0]);
    expect(setSuitabilityConfig).toHaveBeenCalledWith('op-1', {weights: {cost: 1}});
  });

  test('cannot run without a weighted field', () => {
    const runButtonFor = (weights: Record<string, number>) => {
      const {container} = renderWithTheme(
        <SuitabilityPanel
          op={op({weights})}
          datasets={datasets}
          setSuitabilityConfig={jest.fn()}
          runSuitability={jest.fn()}
          removeDatasetOp={jest.fn()}
        />
      );
      return container.querySelector('.dataset-ops-panel__run') as HTMLButtonElement;
    };

    expect(runButtonFor({}).disabled).toBe(true);
    expect(runButtonFor({access: 1}).disabled).toBe(false);
  });

  test('select all restores a default weight for every numeric field', () => {
    const setSuitabilityConfig = jest.fn();
    const {container} = renderWithTheme(
      <SuitabilityPanel
        op={op({weights: {access: 0.5}})}
        datasets={datasets}
        setSuitabilityConfig={setSuitabilityConfig}
        runSuitability={jest.fn()}
        removeDatasetOp={jest.fn()}
      />
    );

    fireEvent.click(container.querySelector('.dataset-ops-suitability__select-all') as HTMLElement);
    expect(setSuitabilityConfig).toHaveBeenCalledWith('op-1', {weights: {access: 1, cost: 1}});
  });

  test('moving a slider updates only that field weight', () => {
    const setSuitabilityConfig = jest.fn();
    const {container} = renderWithTheme(
      <SuitabilityPanel
        op={op()}
        datasets={datasets}
        setSuitabilityConfig={setSuitabilityConfig}
        runSuitability={jest.fn()}
        removeDatasetOp={jest.fn()}
      />
    );

    fireEvent.change(container.querySelectorAll('.mock-range-slider')[1], {
      target: {value: '0.25'}
    });
    expect(setSuitabilityConfig).toHaveBeenCalledWith('op-1', {
      weights: {access: 1, cost: 0.25}
    });
  });

  test('the column picker includes every source column, not just numeric ones', () => {
    const setSuitabilityConfig = jest.fn();
    const {container} = renderWithTheme(
      <SuitabilityPanel
        op={op()}
        datasets={datasets}
        setSuitabilityConfig={setSuitabilityConfig}
        runSuitability={jest.fn()}
        removeDatasetOp={jest.fn()}
      />
    );

    fireEvent.click(container.querySelector('.dataset-ops-collapsible__header') as HTMLElement);
    const lists = container.querySelectorAll('.dataset-ops-column-list');
    const picker = lists[lists.length - 1] as HTMLElement;
    expect(picker.children.length).toBe(3);

    fireEvent.click(picker.querySelectorAll('input[type="checkbox"]')[0]);
    expect(setSuitabilityConfig).toHaveBeenCalledWith('op-1', {columns: ['access', 'cost']});
  });
});
