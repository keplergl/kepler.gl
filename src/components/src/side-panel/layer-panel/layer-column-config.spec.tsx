// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import LayerColumnConfigFactory from './layer-column-config';

const ColumnSelector = ({label}: any) => <div data-testid="column">{label}</div>;
const LayerColumnConfig = LayerColumnConfigFactory(ColumnSelector as any);
const empty = {value: null, fieldIdx: -1};
const groups = [
  {key: 'coordinates', label: 'Coordinates', columns: ['lat', 'lng']},
  {key: 'geometry', label: 'Geometry', columns: ['geojson']},
  {key: 'cell', label: 'Cell', columns: ['h3']}
];
const makeProps = () => {
  const columns = {
    lat: {...empty},
    lng: {...empty},
    geojson: {...empty},
    h3: {...empty},
    altitude: {value: 'height', fieldIdx: 4}
  };
  return {
    columns,
    columnGroups: groups,
    columnLabels: null,
    fields: [],
    isActive: true,
    assignColumn: jest.fn((key: string) => ({...columns, [key]: {...columns[key], ...empty}})),
    assignColumnPairs: jest.fn(),
    updateLayerConfig: jest.fn()
  };
};
const visible = () => screen.getAllByTestId('column').map(element => element.textContent);

describe('coordinate column group tabs', () => {
  test('shows the first group plus unrelated attributes and exposes selected-tab semantics', () => {
    render(<LayerColumnConfig {...makeProps()} />);
    const tab = screen.getByRole('tab', {name: 'Coordinates'});
    expect(tab.getAttribute('aria-selected')).toBe('true');
    expect(tab.tabIndex).toBe(0);
    expect(screen.getByRole('tabpanel').getAttribute('aria-labelledby')).toBe(tab.id);
    expect(visible()).toEqual(['lat', 'lng', 'altitude']);
  });

  test('clears all other position groups but preserves unrelated attributes and original columns', () => {
    const props = makeProps();
    props.columns.lat = {value: 'latitude', fieldIdx: 0} as any;
    props.columns.lng = {value: 'longitude', fieldIdx: 1} as any;
    render(<LayerColumnConfig {...props} />);
    fireEvent.click(screen.getByRole('tab', {name: 'Geometry'}));
    expect(props.assignColumn).toHaveBeenCalledWith('lat', null);
    expect(props.updateLayerConfig).toHaveBeenCalledWith({
      columns: {
        ...props.columns,
        lat: empty,
        lng: empty,
        h3: empty
      }
    });
    expect(props.columns.lng.value).toBe('longitude');
    // Parent applies the returned config; no mutations are made to the original object.
  });

  test.each([
    ['ArrowRight', 'Coordinates', 'Geometry'],
    ['ArrowDown', 'Coordinates', 'Geometry'],
    ['ArrowLeft', 'Coordinates', 'Cell'],
    ['ArrowUp', 'Coordinates', 'Cell'],
    ['Home', 'Cell', 'Coordinates'],
    ['End', 'Coordinates', 'Cell']
  ])('%s selects and focuses the appropriate tab', (key, from, to) => {
    render(<LayerColumnConfig {...makeProps()} />);
    const source = screen.getByRole('tab', {name: from});
    source.focus();
    fireEvent.keyDown(source, {key});
    const target = screen.getByRole('tab', {name: to});
    expect(document.activeElement).toBe(target);
    expect(target.getAttribute('aria-selected')).toBe('true');
    expect(target.tabIndex).toBe(0);
  });

  test.each(['Enter', ' '])('activates a focused unselected tab with %s', key => {
    render(<LayerColumnConfig {...makeProps()} />);
    const tab = screen.getByRole('tab', {name: 'Geometry'});
    fireEvent.keyDown(tab, {key});
    expect(tab.getAttribute('aria-selected')).toBe('true');
    expect(visible()).toEqual(['geojson', 'altitude']);
  });

  test('ignores unrelated keys and reselecting the active group', () => {
    const props = makeProps();
    render(<LayerColumnConfig {...props} />);
    const tab = screen.getByRole('tab', {name: 'Coordinates'});
    fireEvent.keyDown(tab, {key: 'Escape'});
    fireEvent.click(tab);
    expect(props.updateLayerConfig).not.toHaveBeenCalled();
    expect(props.assignColumn).not.toHaveBeenCalled();
  });

  test('follows externally populated columns but does not reset an intentionally empty selection', () => {
    const props = makeProps();
    const {rerender} = render(<LayerColumnConfig {...props} />);
    fireEvent.click(screen.getByRole('tab', {name: 'Geometry'}));
    rerender(<LayerColumnConfig {...props} columns={{...props.columns}} />);
    expect(visible()).toEqual(['geojson', 'altitude']);
    rerender(
      <LayerColumnConfig {...props} columns={{...props.columns, h3: {value: 'hex', fieldIdx: 0}}} />
    );
    expect(screen.getByRole('tab', {name: 'Cell'}).getAttribute('aria-selected')).toBe('true');
    expect(visible()).toEqual(['h3', 'altitude']);
  });

  test('ungrouped layers expose every column without a tablist', () => {
    render(<LayerColumnConfig {...makeProps()} columnGroups={null} />);
    expect(screen.queryByRole('tablist')).toBeNull();
    expect(visible()).toEqual(['lat', 'lng', 'geojson', 'h3', 'altitude']);
  });
});
