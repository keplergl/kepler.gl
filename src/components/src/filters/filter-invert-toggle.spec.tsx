// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, fireEvent, screen} from '@testing-library/react';

import {renderWithTheme} from 'test/helpers/component-jest-utils';

import FilterInvertToggle from './filter-invert-toggle';

describe('FilterInvertToggle', () => {
  const filter = {
    id: 'rate',
    type: 'multiSelect',
    inverted: false
  };

  test('turns filter out on', () => {
    const setFilter = jest.fn();
    renderWithTheme(<FilterInvertToggle filter={filter as any} idx={1} setFilter={setFilter} />);

    expect(screen.getByRole('checkbox', {name: 'filterManager.filterOut'})).toBeInTheDocument();
    const helpButton = screen.getByRole('button', {
      name: 'Filter out help'
    });
    expect(helpButton).toHaveAttribute('aria-describedby', 'filter-out-hint-rate');
    act(() => helpButton.focus());
    expect(helpButton).toHaveFocus();
    expect(document.getElementById('filter-out-hint-rate')).toHaveTextContent(
      'filterManager.filterOutHint'
    );
    fireEvent.click(screen.getByRole('checkbox'));

    expect(setFilter).toHaveBeenCalledWith(1, 'inverted', true);
  });

  test('turns filter out off', () => {
    const setFilter = jest.fn();
    renderWithTheme(
      <FilterInvertToggle
        filter={{...filter, inverted: true} as any}
        idx={2}
        setFilter={setFilter}
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));
    expect(setFilter).toHaveBeenCalledWith(2, 'inverted', false);
  });

  test('stays hidden until a field is chosen', () => {
    const setFilter = jest.fn();
    const {container} = renderWithTheme(
      <FilterInvertToggle filter={{id: 'new', type: null} as any} idx={0} setFilter={setFilter} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('stays hidden when the dataset cannot run CPU filters', () => {
    const setFilter = jest.fn();
    const {container} = renderWithTheme(
      <FilterInvertToggle
        filter={filter as any}
        idx={0}
        setFilter={setFilter}
        isSupported={false}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
