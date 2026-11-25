// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent} from '@testing-library/react';
import {DEFAULT_COLOR_RANGE, DEFAULT_COLOR_UI} from '@kepler.gl/constants';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import ColorRangeSelectorFactory from './color-range-selector';
import CustomPaletteFactory from './custom-palette';

const ColorRangeSelector = ColorRangeSelectorFactory(CustomPaletteFactory());

const spectrum = [
  '#000064',
  '#0000A5',
  '#0000E6',
  '#0021FF',
  '#0057FF',
  '#008CFF',
  '#00C2FF',
  '#00F8FF',
  '#2EFFD0',
  '#64FF9A',
  '#9AFF78',
  '#D0FF2E',
  '#FFF800',
  '#FFC200',
  '#FF8C00',
  '#FF5700',
  '#FF2100',
  '#E60000',
  '#A50000',
  '#640000'
];

function getSpectrumSwatch(container: HTMLElement) {
  return Array.from(container.querySelectorAll('.color-palette-outer')).find(swatch => {
    const colors = Array.from(swatch.querySelectorAll<HTMLElement>('.color-range-palette__block'));
    return (
      colors.length === 20 &&
      colors[0].style.backgroundColor === 'rgb(0, 0, 100)' &&
      colors[19].style.backgroundColor === 'rgb(100, 0, 0)'
    );
  });
}

test.each([
  {reversed: false, colorBlindSafe: false, expected: spectrum},
  {reversed: true, colorBlindSafe: false, expected: [...spectrum].reverse()},
  {reversed: false, colorBlindSafe: true, expected: null}
])(
  'offers the spectrum in the color picker: reversed=$reversed, colorBlindSafe=$colorBlindSafe',
  ({reversed, colorBlindSafe, expected}) => {
    const onSelectColorRange = jest.fn();
    const {container} = renderWithTheme(
      <ColorRangeSelector
        colorPaletteUI={{
          ...DEFAULT_COLOR_UI,
          colorRangeConfig: {
            ...DEFAULT_COLOR_UI.colorRangeConfig,
            type: 'diverging',
            steps: 20,
            reversed,
            colorBlindSafe
          }
        }}
        selectedColorRange={DEFAULT_COLOR_RANGE}
        onSelectColorRange={onSelectColorRange}
        setColorPaletteUI={jest.fn()}
      />
    );
    const swatch = getSpectrumSwatch(container);
    if (!expected) {
      expect(swatch).toBeUndefined();
    } else {
      expect(swatch).toBeDefined();
      fireEvent.click(swatch!);
      expect(onSelectColorRange.mock.lastCall[0].colors).toEqual(expected);
    }
  }
);
