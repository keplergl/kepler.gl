// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent} from '@testing-library/react';
import {initApplicationConfig} from '@kepler.gl/utils';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import {DatasetOpsMenu} from './dataset-ops-menu';
import GroupByPanelFactory from './group-by-panel';
import {fieldNameFromSelector} from './dataset-op-panel';

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

describe('DatasetOpsMenu', () => {
  afterEach(() => {
    initApplicationConfig({enableDatasetOps: true});
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

    fireEvent.click(container.querySelector('.dataset-ops-menu__toggle') as HTMLButtonElement);
    fireEvent.click(document.querySelector('.dataset-ops-menu__group-by') as HTMLButtonElement);
    expect(addGroupBy).toHaveBeenCalledWith('cities');
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
        datasets={{
          cities: {
            id: 'cities',
            label: 'cities',
            fields: [
              {name: 'region', displayName: 'region', type: 'string'},
              {name: 'pop', displayName: 'pop', type: 'integer'}
            ]
          }
        }}
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
});
