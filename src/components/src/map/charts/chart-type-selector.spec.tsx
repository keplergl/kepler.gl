// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {theme} from '@kepler.gl/styles';
import {DEFAULT_CHART_TYPE_OPTIONS} from '@kepler.gl/charts';
import ChartTypeSelectorFactory from './chart-type-selector';

// Exercise the selector's custom option renderers and the ItemSelector callback contract.
jest.mock('../../common/item-selector/item-selector', () => ({
  __esModule: true,
  default: ({
    options,
    selectedItems,
    onChange,
    onOpen,
    onBlur,
    DropDownLineItemRenderComponent: Selected,
    DropDownRenderComponent: List,
    displayOption,
    getOptionValue
  }) => (
    <div>
      <button onClick={onOpen} onBlur={onBlur}>
        <Selected value={selectedItems[0]} />
      </button>
      <List options={options} selectionIndex={0} onOptionSelected={onChange} />
      {options.map(option => (
        <button
          key={getOptionValue(option)}
          aria-label={`Select ${displayOption(option)} by id`}
          onClick={() => onChange(getOptionValue(option))}
        >
          <Selected value={option} />
        </button>
      ))}
      {[null, undefined, '', 'dummy', {id: 'dummy'}].map((value, index) => (
        <button key={index} onClick={() => onChange(value)}>
          Empty selection {index}
        </button>
      ))}
    </div>
  )
}));
const Selector = ChartTypeSelectorFactory();
function setup() {
  const onSelect = jest.fn();
  const onOpen = jest.fn();
  const onBlur = jest.fn();
  render(
    <ThemeProvider theme={theme}>
      <IntlProvider locale="en">
        <Selector onSelect={onSelect} onOpen={onOpen} onBlur={onBlur} />
      </IntlProvider>
    </ThemeProvider>
  );
  return {onSelect, onOpen, onBlur};
}
describe('ChartTypeSelector', () => {
  test.each(DEFAULT_CHART_TYPE_OPTIONS)(
    'selects $id from its dropdown option and string id',
    option => {
      const {onSelect} = setup();
      fireEvent.mouseDown(screen.getAllByText(option.label)[0]);
      expect(onSelect).toHaveBeenLastCalledWith(option.id);
      fireEvent.click(screen.getByRole('button', {name: `Select ${option.label} by id`}));
      expect(onSelect).toHaveBeenCalledTimes(2);
      expect(onSelect).toHaveBeenLastCalledWith(option.id);
    }
  );
  test('ignores absent and placeholder selections', () => {
    const {onSelect} = setup();
    screen
      .getAllByRole('button', {name: /Empty selection/})
      .forEach(button => fireEvent.click(button));
    expect(onSelect).not.toHaveBeenCalled();
  });
  test('forwards open and blur without selecting the Add placeholder', () => {
    const {onOpen, onBlur, onSelect} = setup();
    const add = screen.getByRole('button', {name: 'Add'});
    fireEvent.click(add);
    fireEvent.blur(add);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
