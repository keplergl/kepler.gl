// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import styled, {withTheme} from 'styled-components';
import {SketchPicker, ColorChangeHandler} from 'react-color';
import onClickOutside from 'react-onclickoutside';
import {createSelector} from 'reselect';
// This was put in because 3rd party library react-color doesn't yet cater for customized color of child component <SketchField> which contains HEX/RGB input text box
// Issue raised: https://github.com/casesandberg/react-color/issues/631

type CustomPickerProps = {
  color: string;
  theme: {
    panelBackground: string;
  };
  onChange: ColorChangeHandler;
  onSwatchClose: () => void;
};

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

class CustomPicker extends Component<CustomPickerProps> {
  themeSelector = (props: CustomPickerProps) => props.theme;
  pickerStyleSelector = createSelector(this.themeSelector, theme => ({
    picker: {
      width: '200px',
      padding: '10px 10px 8px',
      boxSizing: 'initial',
      background: theme.panelBackground
    }
  }));

  handleClickOutside = (e: Event) => {
    this.props.onSwatchClose();
  };

  render() {
    const {color, onChange} = this.props;
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

export default withTheme(onClickOutside(CustomPicker) as React.ComponentType<CustomPickerProps>);
