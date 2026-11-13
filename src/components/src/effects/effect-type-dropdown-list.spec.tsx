// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {
  EffectTypeDropdownListFactory,
  EffectTypeDropdownListItem
} from './effect-type-dropdown-list';

const List = EffectTypeDropdownListFactory();
const fog = {type: 'fog', name: 'Fog', disabled: false};
const lighting = {type: 'lighting', name: 'Lighting', disabled: false};
const Item: React.FC<{value: EffectTypeDropdownListItem}> = ({value}) => <span>{value.name}</span>;
const props = {
  options: [fog, lighting],
  selectedItems: [],
  selectionIndex: -1,
  customListItemComponent: Item
};

test('selects the requested effect on mouse down while preventing focus loss', () => {
  const onOptionSelected = jest.fn();
  render(<List {...props} onOptionSelected={onOptionSelected} />);
  const allowed = fireEvent.mouseDown(screen.getByText('Lighting'));
  expect(allowed).toBe(false);
  expect(onOptionSelected).toHaveBeenCalledTimes(1);
  expect(onOptionSelected).toHaveBeenCalledWith(lighting);
});

test('uses the current selection handler after rerender when an effect is clicked', () => {
  const previous = jest.fn();
  const current = jest.fn();
  const {rerender} = render(<List {...props} onOptionSelected={previous} />);
  rerender(<List {...props} onOptionSelected={current} />);
  fireEvent.click(screen.getByText('Fog'));
  expect(current).toHaveBeenCalledTimes(1);
  expect(current).toHaveBeenCalledWith(fog);
  expect(previous).not.toHaveBeenCalled();
});
