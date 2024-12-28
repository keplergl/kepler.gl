// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {HexColor, RGBColor} from '@kepler.gl/types';
import styled from 'styled-components';
import classnames from 'classnames';

type ColorPaletteProps = {
  colors: RGBColor | HexColor[];
  colorWidths?: number[];
  height?: number;
  className?: string;
  isSelected?: boolean;
  isReversed?: boolean;
};

const PaletteWrapper = styled.div.attrs({
  className: 'color-range-palette__inner'
})`
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-between;
  overflow: hidden;
`;

const PaletteContainer = styled.div.attrs(props => ({
  className: classnames('color-range-palette', props.className)
}))<{isSelected?: boolean; isColorChart?: boolean}>`
  display: flex;
  flex-grow: 1;
  border-width: ${props => (props.isColorChart ? '0px' : '1px')};
  border-style: solid;
  border-color: ${props => (props.isSelected ? '#FFFFFF' : 'transparent')};
  padding: ${props => (props.isColorChart ? '0px' : '4px')};
  border-radius: 4px;
`;

const StyledColorBlock = styled.div.attrs({
  className: 'color-range-palette__block'
})`
  flex-grow: 1;
`;

const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors = [],
  height = 10,
  colorWidths = null,
  className = '',
  isSelected = false,
  isReversed = false
}) => (
  <PaletteContainer
    className={className}
    isSelected={isSelected}
    isColorChart={Boolean(colorWidths)}
  >
    <PaletteWrapper style={{height, transform: `scale(${isReversed ? -1 : 1}, 1)`}}>
      {colors.map((color: number | string, index: number) =>
        colorWidths && colorWidths[index] ? (
          <StyledColorBlock
            key={`${color}-${index}`}
            style={{backgroundColor: String(color), width: colorWidths[index]}}
          />
        ) : (
          <StyledColorBlock key={`${color}-${index}`} style={{backgroundColor: String(color)}} />
        )
      )}
    </PaletteWrapper>
  </PaletteContainer>
);

export default ColorPalette;
