import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {range} from 'd3-array';
import styled from 'styled-components';
import {hexToRgb} from 'utils/color-utils';

// TODO: remove uber colors, replace with generic color schemes
import {ColorsByTheme, Themes} from 'constants/uber-colors';

const propTypes = {
  onSelectColor: PropTypes.func.isRequired,
  // hex value
  selectedColor: PropTypes.string.isRequired
};

const PALETTE_HEIGHT = '8px';
const ROWS = 16;

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

const StyledColorBlock = styled.div`
  flex-grow: 1;
  height: ${PALETTE_HEIGHT};
  border-width: 1px;
  border-style: solid;
`;

const SingleColorPalette = ({selectedColor, onSelectColor}) => (
  <StyledColorPalette className="single-color-palette">
    {Themes.map((theme, col) => (
      <StyledColorColumn key={theme}>
        {range(1, ROWS + 1, 1).map((key, i) => (
          <StyledColorBlock
            style={{
              backgroundColor: ColorsByTheme[theme][String(key)],
              borderColor:
                selectedColor ===
                ColorsByTheme[theme][String(key)].toUpperCase()
                  ? 'white'
                  : ColorsByTheme[theme][String(key)]
            }}
            key={`${theme}_${key}`}
            selected={
              selectedColor === ColorsByTheme[theme][String(key)].toUpperCase()
            }
            onClick={e =>
              onSelectColor(hexToRgb(ColorsByTheme[theme][String(key)]), e)
            }
          />
        ))}
      </StyledColorColumn>
    ))}
  </StyledColorPalette>
);

SingleColorPalette.propTypes = propTypes;

export default SingleColorPalette;
