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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled, {withTheme} from 'styled-components';
import {SketchPicker} from 'react-color';
import onClickOutside from 'react-onclickoutside';
import {createSelector} from 'reselect';
// This was put in because 3rd party library react-color doesn't yet cater for customized color of child component <SketchField> which contains HEX/RGB input text box
// Issue raised: https://github.com/casesandberg/react-color/issues/631

const StyledPicker = styled.div`
  .sketch-picker {
    span {
      color: ${props => props.theme.labelColor} !important;
      font-family: ${props => props.theme.fontFamily};
    }
    input {
      text-align: center;
      font-family: ${props => props.theme.fontFamily};
      color: ${props => props.theme.inputColor} !important;
      border-color: ${props => props.theme.secondaryInputBgd} !important;
      box-shadow: none !important;
      background-color: ${props => props.theme.inputBgdHover} !important;
    }
  }
`;

const PRESET_COLORS = [];

class CustomPicker extends Component {
  static propTypes = {
    color: PropTypes.string,
    onChange: PropTypes.func,
    onSwatchClose: PropTypes.func
  };

  themeSelector = props => props.theme;
  pickerStyleSelector = createSelector(this.themeSelector, theme => ({
    picker: {
      width: '200px',
      padding: '10px 10px 8px',
      boxSizing: 'initial',
      background: theme.panelBackground
    }
  }));

  handleClickOutside = e => {
    this.props.onSwatchClose();
  };

  render() {
    const {color, onChange} = this.props;
    /** @type {any} - TS complains this doesn't match SketchPickerStylesProps */
    const pickerStyle = this.pickerStyleSelector(this.props);
    return (
      <StyledPicker>
        <SketchPicker
          color={color}
          onChange={onChange}
          presetColors={PRESET_COLORS}
          styles={pickerStyle}
          disableAlpha
        />
      </StyledPicker>
    );
  }
}

export default withTheme(onClickOutside(CustomPicker));
