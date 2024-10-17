// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {range} from 'd3-array';

import {ColorsByTheme} from '@kepler.gl/constants';
import {HexColor} from '@kepler.gl/types';

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

type StyledColorBlockProps = {
  selected?: boolean;
};

const StyledColorBlock = styled.div<StyledColorBlockProps>`
  flex-grow: 1;
  height: ${PALETTE_HEIGHT};
  border-width: 1px;
  border-style: solid;
`;

export type PresetColorPaletteProps = {
  themes: string[];
  selectedColor: HexColor;
  onSelectColor: (c: HexColor, e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const PresetColorPalette: React.FC<PresetColorPaletteProps> = ({
  themes,
  onSelectColor,
  selectedColor
}: PresetColorPaletteProps) => (
  <StyledColorPalette>
    {themes.map(theme => (
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
            onClick={e => onSelectColor(ColorsByTheme[theme][key], e)}
          />
        ))}
      </StyledColorColumn>
    ))}
  </StyledColorPalette>
);

export default PresetColorPalette;
