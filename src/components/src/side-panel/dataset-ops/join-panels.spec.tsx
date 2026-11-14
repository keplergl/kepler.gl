// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import {fireEvent, within} from '@testing-library/react';
import {Datasets, JoinOp} from '@kepler.gl/table';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';
import JoinPanelFactory from './join-panel';
import SpatialJoinPanelFactory from './spatial-join-panel';

jest.mock('../common/source-data-selector', () => ({
  __esModule: true,
  default: () => () => null
}));

// Keep panel state and table helpers real; isolate dropdown rendering/portals.
jest.mock('../../common/item-selector/item-selector', () => ({
  __esModule: true,
  default: ({options, selectedItems, onChange, disabled}: any) => (
    <select
      aria-label="option"
      disabled={disabled}
      value={selectedItems?.id || ''}
      onChange={event => onChange(event.target.value)}
    >
      <option value="">None</option>
      {options.map((option: any) => (
        <option key={option.id} value={option.id}>
          {option.id}
        </option>
      ))}
    </select>
  )
}));

function SourceSelector({datasets, dataId, onSelect}: any) {
  return (
    <select aria-label="dataset" value={dataId || ''} onChange={e => onSelect(e.target.value)}>
      <option value="">None</option>
      {Object.keys(datasets).map(id => (
        <option key={id} value={id}>
          {id}
        </option>
      ))}
    </select>
  );
}
function FieldSelector({fields, value, onSelect}: any) {
  return (
    <select aria-label="key" value={value || ''} onChange={e => onSelect({name: e.target.value})}>
      <option value="">None</option>
      {fields.map((field: any) => (
        <option key={field.name} value={field.name}>
          {field.name}
        </option>
      ))}
    </select>
  );
}
const JoinPanel = JoinPanelFactory(FieldSelector as any, SourceSelector as any);
const SpatialPanel = SpatialJoinPanelFactory(
  SourceSelector as any,
  (() => null) as any,
  (() => null) as any
);
const field = (name: string, type: string) => ({name, displayName: name, type});
const datasets = {
  left: {
    id: 'left',
    type: 'local',
    fields: [field('shape', 'geojson'), field('id', 'integer'), field('name', 'string')]
  },
  right: {
    id: 'right',
    type: 'local',
    fields: [
      field('point', 'point'),
      field('amount', 'real'),
      field('category', 'string'),
      field('opaque', 'object')
    ]
  },
  alternate: {
    id: 'alternate',
    type: 'externally-hosted',
    fields: [field('latitude', 'real'), field('longitude', 'real'), field('value', 'integer')]
  },
  h3: {id: 'h3', type: 'local', fields: [field('hex', 'h3'), field('value', 'real')]},
  tiles: {id: 'tiles', type: 'vector-tile', fields: []},
  disabled: {id: 'disabled', type: 'local', disableDataOperation: true, fields: []}
} as unknown as Datasets;
const baseOp: JoinOp = {
  id: 'join',
  implementation: 'simple',
  leftDataId: 'left',
  rightDataId: 'right',
  leftField: 'id',
  rightField: 'amount',
  type: 'LEFT',
  aggregations: {},
  leftGeo: {kind: 'geojson', fieldName: 'shape'},
  rightGeo: {kind: 'geojson', fieldName: 'point'},
  resultId: 'result',
  resultLabel: 'Joined',
  isConfigActive: true
};

function setup(spatial = false, overrides: Partial<JoinOp> = {}, sources: Datasets = datasets) {
  const change = jest.fn();
  const run = jest.fn();
  const remove = jest.fn();
  function Harness() {
    const [op, setOp] = useState({...baseOp, ...overrides});
    const update = (id: string, config: Partial<JoinOp>) => {
      change(id, config);
      setOp(previous => ({...previous, ...config}));
    };
    return spatial ? (
      <SpatialPanel
        op={op}
        datasets={sources}
        setSpatialJoinConfig={update}
        runSpatialJoin={run}
        removeDatasetOp={remove}
      />
    ) : (
      <JoinPanel
        op={op}
        datasets={sources}
        setJoinConfig={update}
        runJoin={run}
        removeDatasetOp={remove}
      />
    );
  }
  return {
    ...renderWithTheme(
      <IntlWrapper>
        <Harness />
      </IntlWrapper>
    ),
    change,
    run,
    remove
  };
}
function openColumns(container: HTMLElement) {
  container
    .querySelectorAll('.dataset-ops-collapsible__header')
    .forEach(header => fireEvent.click(header));
  return Array.from(container.querySelectorAll<HTMLElement>('.dataset-ops-column-list'));
}
function runButton(container: HTMLElement) {
  return container.querySelector('.dataset-ops-panel__run') as HTMLButtonElement;
}

describe('Join panel configuration', () => {
  test.each([false, true])('excludes non-tabular and opposite datasets (spatial=%s)', spatial => {
    const {getAllByLabelText} = setup(spatial);
    const [left, right] = getAllByLabelText('dataset');
    expect(Array.from((left as HTMLSelectElement).options).map(o => o.value)).toEqual([
      '',
      'left',
      'alternate',
      'h3'
    ]);
    expect(Array.from((right as HTMLSelectElement).options).map(o => o.value)).toEqual([
      '',
      'right',
      'alternate',
      'h3'
    ]);
  });

  test('changing datasets clears stale keys/column selections and requires new keys to run', () => {
    const {getAllByLabelText, container, change, run} = setup(false, {
      leftColumns: ['id'],
      rightColumns: ['amount']
    });
    fireEvent.change(getAllByLabelText('dataset')[0], {target: {value: 'alternate'}});
    expect(change).toHaveBeenLastCalledWith('join', {
      leftDataId: 'alternate',
      leftField: null,
      leftColumns: undefined
    });
    expect(runButton(container).disabled).toBe(true);
    fireEvent.change(getAllByLabelText('key')[0], {target: {value: 'value'}});
    expect(change).toHaveBeenLastCalledWith('join', {leftField: 'value'});
    fireEvent.change(getAllByLabelText('dataset')[1], {target: {value: 'h3'}});
    expect(change).toHaveBeenLastCalledWith('join', {
      rightDataId: 'h3',
      rightField: null,
      rightColumns: undefined
    });
    expect(runButton(container).disabled).toBe(true);
    fireEvent.change(getAllByLabelText('key')[1], {target: {value: 'hex'}});
    fireEvent.click(runButton(container));
    expect(run).toHaveBeenCalledWith('join');
  });

  test('column toggles preserve source order and support empty/all selections on both sides', () => {
    const {container, change} = setup();
    const [left, right] = openColumns(container);
    fireEvent.click(within(left).getAllByRole('checkbox')[1]);
    expect(change).toHaveBeenLastCalledWith('join', {leftColumns: ['shape', 'name']});
    fireEvent.click(within(right).getAllByRole('checkbox')[0]);
    expect(change).toHaveBeenLastCalledWith('join', {
      rightColumns: ['amount', 'category', 'opaque']
    });
    const selectAll = container.querySelectorAll('.dataset-ops-collapsible__select-all');
    fireEvent.click(selectAll[0]);
    expect(change).toHaveBeenLastCalledWith('join', {leftColumns: ['shape', 'id', 'name']});
    fireEvent.click(selectAll[0]);
    expect(change).toHaveBeenLastCalledWith('join', {leftColumns: []});
    expect(
      within(left)
        .getAllByRole('checkbox')
        .every(box => !(box as HTMLInputElement).checked)
    ).toBe(true);
  });

  test('updates join type and output name, and cancels the current operation', () => {
    const {getByRole, container, change, remove} = setup();
    fireEvent.click(getByRole('button', {name: 'FULL'}));
    expect(change).toHaveBeenLastCalledWith('join', {type: 'FULL'});
    fireEvent.change(getByRole('textbox'), {target: {value: 'New result'}});
    expect(change).toHaveBeenLastCalledWith('join', {resultLabel: 'New result'});
    fireEvent.click(container.querySelector('.dataset-ops-panel__back') as HTMLElement);
    expect(remove).toHaveBeenCalledWith('join');
  });

  test.each([false, true])('missing left dataset renders nothing (spatial=%s)', spatial => {
    const {container} = setup(spatial, {leftDataId: 'removed'});
    expect(container.querySelector('.dataset-ops-panel')).toBeNull();
  });
});

describe('Spatial join configuration', () => {
  test('switching target infers coordinates and resets included columns', () => {
    const {getAllByLabelText, container, change} = setup(true, {leftColumns: ['id']});
    fireEvent.change(getAllByLabelText('dataset')[0], {target: {value: 'alternate'}});
    expect(change).toHaveBeenLastCalledWith('join', {
      leftDataId: 'alternate',
      leftGeo: {kind: 'latlng', latField: 'latitude', lngField: 'longitude'},
      leftColumns: undefined
    });
    expect((getAllByLabelText('option')[0] as HTMLSelectElement).value).toBe(
      'latlng:latitude:longitude'
    );
    const [columns] = openColumns(container);
    expect(columns.textContent).toBe('value');
    fireEvent.click(within(columns).getByRole('checkbox'));
    expect(change).toHaveBeenLastCalledWith('join', {leftColumns: []});
    fireEvent.click(container.querySelector('.dataset-ops-collapsible__select-all') as HTMLElement);
    expect(change).toHaveBeenLastCalledWith('join', {leftColumns: ['value']});
  });

  test('switching join dataset infers H3 geometry and resets aggregations to field defaults', () => {
    const {getAllByLabelText, change} = setup(true, {aggregations: {amount: 'sum'}});
    fireEvent.change(getAllByLabelText('dataset')[1], {target: {value: 'h3'}});
    expect(change).toHaveBeenLastCalledWith('join', {
      rightDataId: 'h3',
      rightGeo: {kind: 'h3', fieldName: 'hex'},
      aggregations: {hex: 'countUnique', value: 'average'}
    });
    expect((getAllByLabelText('option')[2] as HTMLSelectElement).value).toBe('h3:hex');
  });

  test('geometry selection and predicate changes update config and gate execution', () => {
    const {getAllByLabelText, container, change, run} = setup(true);
    fireEvent.change(getAllByLabelText('option')[0], {target: {value: ''}});
    expect(change).toHaveBeenLastCalledWith('join', {leftGeo: null});
    expect(runButton(container).disabled).toBe(true);
    fireEvent.change(getAllByLabelText('option')[0], {target: {value: 'geojson:shape'}});
    fireEvent.change(getAllByLabelText('option')[1], {target: {value: 'within'}});
    expect(change).toHaveBeenLastCalledWith('join', {predicate: 'within'});
    fireEvent.change(getAllByLabelText('option')[2], {target: {value: ''}});
    expect(change).toHaveBeenLastCalledWith('join', {rightGeo: null});
    expect(runButton(container).disabled).toBe(true);
    fireEvent.change(getAllByLabelText('option')[2], {target: {value: 'geojson:point'}});
    fireEvent.click(runButton(container));
    expect(run).toHaveBeenCalledWith('join');
  });

  test('aggregation toggles and edits preserve other rules and exclude unsupported fields', () => {
    const {container, change} = setup(true, {
      aggregations: {amount: 'sum', category: 'countUnique'}
    });
    const [, aggregations] = openColumns(container);
    expect(aggregations.textContent).not.toContain('opaque');
    const rows = Array.from(aggregations.children) as HTMLElement[];
    expect(rows).toHaveLength(3);
    expect((within(rows[0]).getByRole('combobox') as HTMLSelectElement).disabled).toBe(true);
    fireEvent.click(within(rows[0]).getByRole('checkbox'));
    expect(change).toHaveBeenLastCalledWith('join', {
      aggregations: {amount: 'sum', category: 'countUnique', point: 'merge'}
    });
    fireEvent.change(within(rows[1]).getByRole('combobox'), {target: {value: 'maximum'}});
    expect(change).toHaveBeenLastCalledWith('join', {
      aggregations: {amount: 'maximum', category: 'countUnique', point: 'merge'}
    });
    fireEvent.click(within(rows[2]).getByRole('checkbox'));
    expect(change).toHaveBeenLastCalledWith('join', {
      aggregations: {amount: 'maximum', point: 'merge'}
    });
    const all = container.querySelectorAll('.dataset-ops-collapsible__select-all')[1];
    fireEvent.click(all);
    expect(change).toHaveBeenLastCalledWith('join', {
      aggregations: {point: 'merge', amount: 'average', category: 'countUnique'}
    });
    fireEvent.click(all);
    expect(change).toHaveBeenLastCalledWith('join', {aggregations: {}});
  });
});

describe('Join panel incomplete and restored configuration', () => {
  test.each([false, true])(
    'waits for a right dataset instead of running stale config (spatial=%s)',
    spatial => {
      const {container, queryAllByLabelText, getAllByLabelText, change, run} = setup(spatial, {
        rightDataId: null
      });
      expect(runButton(container).disabled).toBe(true);
      fireEvent.click(runButton(container));
      expect(run).not.toHaveBeenCalled();
      expect(queryAllByLabelText('key')).toHaveLength(0);
      fireEvent.change(getAllByLabelText('dataset')[1], {target: {value: 'right'}});
      expect(change).toHaveBeenCalledWith('join', expect.objectContaining({rightDataId: 'right'}));
      // Spatial joins infer a geometry, attribute joins require selecting a new key.
      expect(runButton(container).disabled).toBe(!spatial);
    }
  );

  test.each([false, true])(
    'ignores empty/current target selections without discarding saved configuration (spatial=%s)',
    spatial => {
      const {getAllByLabelText, change, container} = setup(spatial, {leftColumns: ['id']});
      const target = getAllByLabelText('dataset')[0];
      fireEvent.change(target, {target: {value: 'left'}});
      fireEvent.change(target, {target: {value: ''}});
      expect(change).not.toHaveBeenCalled();
      expect(runButton(container).disabled).toBe(false);
      const [columns] = openColumns(container);
      const boxes = within(columns).getAllByRole('checkbox') as HTMLInputElement[];
      expect(boxes.filter(box => box.checked)).toHaveLength(1);
    }
  );

  test('restores intentionally empty column lists and inserts individual columns in source order', () => {
    const {container, change} = setup(false, {leftColumns: [], rightColumns: []});
    const [left, right] = openColumns(container);
    expect(
      within(left)
        .getAllByRole('checkbox')
        .some(box => (box as HTMLInputElement).checked)
    ).toBe(false);
    expect(
      within(right)
        .getAllByRole('checkbox')
        .some(box => (box as HTMLInputElement).checked)
    ).toBe(false);
    fireEvent.click(within(left).getAllByRole('checkbox')[2]);
    fireEvent.click(within(left).getAllByRole('checkbox')[0]);
    expect(change).toHaveBeenLastCalledWith('join', {leftColumns: ['shape', 'name']});
    fireEvent.click(within(right).getAllByRole('checkbox')[1]);
    expect(change).toHaveBeenLastCalledWith('join', {rightColumns: ['amount']});
  });

  test('spatial columns can be re-enabled without including the active geometry', () => {
    const {container, change} = setup(true, {leftColumns: []});
    const [left] = openColumns(container);
    expect(left.textContent).not.toContain('shape');
    const boxes = within(left).getAllByRole('checkbox');
    fireEvent.click(boxes[1]);
    fireEvent.click(boxes[0]);
    expect(change).toHaveBeenLastCalledWith('join', {leftColumns: ['id', 'name']});
    const selectAll = container.querySelector(
      '.dataset-ops-collapsible__select-all'
    ) as HTMLElement;
    fireEvent.click(selectAll);
    expect(change).toHaveBeenLastCalledWith('join', {leftColumns: []});
    expect(
      within(left)
        .getAllByRole('checkbox')
        .every(box => !(box as HTMLInputElement).checked)
    ).toBe(true);
  });

  const nonSpatial = {
    ...datasets,
    plain: {
      id: 'plain',
      type: 'local',
      fields: [field('value', 'integer'), field('name', 'string')]
    }
  } as unknown as Datasets;

  test('switching the spatial target to non-spatial data clears the old geometry and prevents execution', () => {
    const {getAllByLabelText, container, change, run} = setup(true, {}, nonSpatial);
    fireEvent.change(getAllByLabelText('dataset')[0], {target: {value: 'plain'}});
    expect(change).toHaveBeenLastCalledWith('join', {
      leftDataId: 'plain',
      leftGeo: null,
      leftColumns: undefined
    });
    expect((getAllByLabelText('option')[0] as HTMLSelectElement).options).toHaveLength(1);
    expect(runButton(container).disabled).toBe(true);
    fireEvent.click(runButton(container));
    expect(run).not.toHaveBeenCalled();
  });

  test('switching the spatial join source to non-spatial data clears geometry and replaces old aggregations', () => {
    const {getAllByLabelText, container, change} = setup(
      true,
      {aggregations: {amount: 'sum'}},
      nonSpatial
    );
    fireEvent.change(getAllByLabelText('dataset')[1], {target: {value: 'plain'}});
    expect(change).toHaveBeenLastCalledWith('join', {
      rightDataId: 'plain',
      rightGeo: null,
      aggregations: {value: 'average', name: 'countUnique'}
    });
    expect(runButton(container).disabled).toBe(true);
  });

  test.each([false, true])(
    'clearing the right dataset selector does not erase the active operation (spatial=%s)',
    spatial => {
      const {getAllByLabelText, change, container} = setup(spatial);
      fireEvent.change(getAllByLabelText('dataset')[1], {target: {value: ''}});
      expect(change).not.toHaveBeenCalled();
      expect(runButton(container).disabled).toBe(false);
    }
  );
});
