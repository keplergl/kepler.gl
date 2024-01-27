// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {MouseEvent} from 'react';
import {range} from 'd3-array';
import styled from 'styled-components';
import {hexToRgb} from '@kepler.gl/utils';

import {ColorsByTheme, Themes, ColorRange} from '@kepler.gl/constants';
import {RGBColor} from '@kepler.gl/types';

export type SingleColorPaletteProps = {
  onSelectColor: (color: RGBColor | ColorRange, e: MouseEvent) => void;
  // hex value
  selectedColor: string;
};

const PALETTE_HEIGHT = '8px';
const ROWS = 22;

const StyledColorPalette = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px;

  :hover {
    cursor: pointer;
  }
`;

const StyledColorColumn = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledColorBlock = styled.div<{selected: boolean}>`
  flex-grow: 1;
  height: ${PALETTE_HEIGHT};
  border-width: 1px;
  border-style: solid;
`;

const SingleColorPalette: React.FC<SingleColorPaletteProps> = ({selectedColor, onSelectColor}) => (
  <StyledColorPalette className="single-color-palette">
    {Themes.map((theme, col) => (
      <StyledColorColumn key={theme} className="single-color-palette__column">
        {range(1, ROWS + 1, 1).map((key, i) => (
          <StyledColorBlock
            className="single-color-palette__block"
            style={{
              backgroundColor: ColorsByTheme[theme][key],
              borderColor:
                selectedColor === ColorsByTheme[theme][key].toUpperCase()
                  ? 'white'
                  : ColorsByTheme[theme][key]
            }}
            key={`${theme}_${key}`}
            selected={selectedColor === ColorsByTheme[theme][key].toUpperCase()}
            onClick={e => onSelectColor(hexToRgb(ColorsByTheme[theme][key]), e)}
          />
        ))}
      </StyledColorColumn>
    ))}
  </StyledColorPalette>
);

export default SingleColorPalette;
