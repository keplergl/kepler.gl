// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import PropTypes from 'prop-types';
import {range} from 'd3-array';
import styled from 'styled-components';
import {hexToRgb} from 'utils/color-utils';

import {ColorsByTheme, Themes} from 'constants/color-palette';

const propTypes = {
  onSelectColor: PropTypes.func.isRequired,
  // hex value
  selectedColor: PropTypes.string.isRequired
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

const StyledColorBlock = styled.div`
  flex-grow: 1;
  height: ${PALETTE_HEIGHT};
  border-width: 1px;
  border-style: solid;
`;

const SingleColorPalette = ({selectedColor, onSelectColor}) => (
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

SingleColorPalette.propTypes = propTypes;

export default SingleColorPalette;
