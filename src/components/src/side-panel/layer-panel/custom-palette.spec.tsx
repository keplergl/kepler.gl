// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import CustomPaletteFactory, {ColorPaletteInput, CategoricalSelector} from './custom-palette';
import type {CustomPaletteProps} from './custom-palette';

// jsdom does not provide the observer used by the dropdown's pagination sentinel.
beforeAll(() => {
  window.IntersectionObserver = class {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = '';
    thresholds = [];
  };
});

const CustomPalette = CustomPaletteFactory();
const colors = ['#ff0000', '#00ff00', '#0000ff'];

function renderPalette(
  type: string,
  values: (number | string | number[] | null)[],
  ordinalDomain: number[] | string[] = [0, 1, 2, 3]
) {
  const setColorPaletteUI = jest.fn();
  const customPalette = {
    name: 'Custom',
    type,
    category: 'Custom',
    colors,
    colorMap: values.map((value, index) => [value, colors[index]])
  } as CustomPaletteProps['customPalette'];
  const view = renderWithTheme(
    <CustomPalette
      customPalette={customPalette}
      setColorPaletteUI={setColorPaletteUI}
      showSketcher={false}
      ordinalDomain={ordinalDomain}
      onApply={jest.fn()}
      onCancel={jest.fn()}
    />
  );
  return {...view, setColorPaletteUI, customPalette};
}

function openCategory(container: HTMLElement, index: number) {
  fireEvent.click(container.querySelector(`[data-for="category-values-${index}"]`) as Element);
}

function selectOption(value: string) {
  const option = Array.from(document.querySelectorAll('.list__item')).find(
    item => item.textContent === value
  );
  expect(option).toBeDefined();
  fireEvent.click(option as Element);
}

describe('custom palette numeric editing', () => {
  test('keeps typing local, commits on blur or Enter, and accepts updated values', () => {
    const onChange = jest.fn();
    const props = {
      id: 'break',
      value: 1,
      onChange,
      editable: true,
      width: '54px',
      textAlign: 'end'
    };
    const {rerender} = renderWithTheme(<ColorPaletteInput {...props} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, {target: {value: '-2.5'}});
    fireEvent.keyDown(input, {key: 'ArrowLeft', keyCode: 37});
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.blur(input);
    expect(onChange).toHaveBeenLastCalledWith('-2.5');
    fireEvent.change(input, {target: {value: '0'}});
    fireEvent.keyDown(input, {key: 'Enter', keyCode: 13});
    expect(onChange).toHaveBeenLastCalledWith('0');
    rerender(<ColorPaletteInput {...props} value={12} />);
    expect(screen.getByRole('textbox')).toHaveValue('12');
  });

  test('read-only values have no editable input', () => {
    renderWithTheme(
      <ColorPaletteInput
        id="readonly"
        value={0}
        onChange={jest.fn()}
        editable={false}
        width="54px"
        textAlign="end"
      />
    );
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test.each(['left', 'right'])(
    'edits the shared boundary from its %s input without changing colors',
    side => {
      const {container, setColorPaletteUI, customPalette} = renderPalette('custom', [0, 10, null]);
      expect(screen.getByText('Less')).toBeInTheDocument();
      expect(screen.getByText('More')).toBeInTheDocument();
      const index = side === 'left' ? 1 : 0;
      const input = container.querySelector(`#color-palette-input-${index}-${side}`) as Element;
      fireEvent.change(input, {target: {value: '-2.5'}});
      fireEvent.blur(input);
      expect(setColorPaletteUI.mock.lastCall[0].customPalette.colorMap).toEqual([
        [-2.5, colors[0]],
        [10, colors[1]],
        [null, colors[2]]
      ]);
      expect(customPalette.colorMap).toEqual([
        [0, colors[0]],
        [10, colors[1]],
        [null, colors[2]]
      ]);
    }
  );

  test('sorts a boundary moved past another break numerically and retains the open final range', () => {
    const {container, setColorPaletteUI} = renderPalette('custom', [0, 10, null]);
    const input = container.querySelector('#color-palette-input-0-right') as Element;
    fireEvent.change(input, {target: {value: '20'}});
    fireEvent.keyDown(input, {key: 'Enter', keyCode: 13});
    expect(setColorPaletteUI.mock.lastCall[0].customPalette.colorMap).toEqual([
      [10, colors[0]],
      [20, colors[1]],
      [null, colors[2]]
    ]);
  });
});

describe('custom palette category editing', () => {
  test('extends a swatch holding zero and moves an assigned value out of another swatch', () => {
    const {container, setColorPaletteUI, customPalette} = renderPalette('customOrdinal', [
      0,
      1,
      null
    ]);
    openCategory(container, 0);
    fireEvent.change(screen.getByPlaceholderText('Search'), {target: {value: '1'}});
    selectOption('1');
    expect(setColorPaletteUI.mock.lastCall[0].customPalette.colorMap).toEqual([
      [[0, 1], colors[0]],
      [null, colors[1]],
      [null, colors[2]]
    ]);
    expect(customPalette.colorMap).toEqual([
      [0, colors[0]],
      [1, colors[1]],
      [null, colors[2]]
    ]);
  });

  test('assigns zero to an empty swatch and clears its previous assignment', () => {
    const {container, setColorPaletteUI} = renderPalette('customOrdinal', [0, 1, null]);
    openCategory(container, 2);
    fireEvent.change(screen.getByPlaceholderText('Search'), {target: {value: '0'}});
    selectOption('0');
    expect(setColorPaletteUI.mock.lastCall[0].customPalette.colorMap).toEqual([
      [null, colors[0]],
      [1, colors[1]],
      [[0], colors[2]]
    ]);
  });

  test('selects only unassigned domain values and closes the dropdown', () => {
    const {container, setColorPaletteUI} = renderPalette(
      'customOrdinal',
      ['a', 'b', null],
      ['a', 'b', 'c', 'd']
    );
    openCategory(container, 2);
    fireEvent.click(screen.getByText('Select the Rest'));
    expect(setColorPaletteUI.mock.lastCall[0].customPalette.colorMap).toEqual([
      ['a', colors[0]],
      ['b', colors[1]],
      [['c', 'd'], colors[2]]
    ]);
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
  });

  test('resets one assignment without affecting other swatches', () => {
    const {container, setColorPaletteUI} = renderPalette('customOrdinal', [0, [1, 2], null]);
    openCategory(container, 1);
    fireEvent.click(screen.getByText('Reset'));
    expect(setColorPaletteUI.mock.lastCall[0].customPalette.colorMap).toEqual([
      [0, colors[0]],
      [null, colors[1]],
      [null, colors[2]]
    ]);
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
  });

  test('removes an individual zero chip while retaining other assignments', () => {
    const {container, setColorPaletteUI} = renderPalette('customOrdinal', [[0, 1], 2, null]);
    openCategory(container, 0);
    const chip = document.querySelector('.custom-palette-chickleted-input svg') as Element;
    fireEvent.click(chip);
    expect(setColorPaletteUI.mock.lastCall[0].customPalette.colorMap).toEqual([
      [[1], colors[0]],
      [2, colors[1]],
      [null, colors[2]]
    ]);
  });

  test('does not expose category editing in read-only mode', () => {
    renderWithTheme(
      <CategoricalSelector index={0} selectedValues={[0]} allValues={[0, 1]} editable={false} />
    );
    fireEvent.click(screen.getByText('0'));
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
  });
});
