// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import {HexColor, RGBColor} from '@kepler.gl/types';
import styled, {IStyledComponent} from 'styled-components';
import classnames from 'classnames';
import {BaseComponentProps} from '../../types';

type ColorPaletteProps = BaseComponentProps & {
  colors: RGBColor | HexColor[];
  colorWidths?: number[] | null;
  height?: number;
  isSelected?: boolean;
  isReversed?: boolean;
  className?: string;
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

export type PaletteContainerProps = BaseComponentProps & {
  $isColorChart?: boolean;
  $isSelected?: boolean;
};

const PaletteContainer: IStyledComponent<'web', PaletteContainerProps> = styled.div.attrs(
  props => ({
    className: classnames('color-range-palette', props.className)
  })
)<PaletteContainerProps>`
  display: flex;
  flex-grow: 1;
  border-width: ${props => (props.$isColorChart ? '0px' : '1px')};
  border-style: solid;
  border-color: ${props => (props.$isSelected ? '#FFFFFF' : 'transparent')};
  padding: ${props => (props.$isColorChart ? '0px' : '4px')};
  border-radius: 4px;
`;

const StyledColorBlock = styled.div.attrs({
  className: 'color-range-palette__block'
})`
  flex-grow: 1;
`;

const ColorPalette = ({
  colors = [],
  height = 10,
  colorWidths = null,
  className = '',
  isSelected = false,
  isReversed = false
}: ColorPaletteProps) => {
  const paletteWrapperStyle = useMemo(
    () => ({height, transform: `scale(${isReversed ? -1 : 1}, 1)`}),
    [height, isReversed]
  );
  return (
    <PaletteContainer
      className={className}
      $isSelected={isSelected}
      $isColorChart={Boolean(colorWidths)}
    >
      <PaletteWrapper style={paletteWrapperStyle}>
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
};

export default ColorPalette;
