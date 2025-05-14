// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled, {withTheme} from 'styled-components';
import {SketchPicker, ColorChangeHandler} from 'react-color';

import {HexColor} from '@kepler.gl/types';
import {panelBackground} from '@kepler.gl/styles';

import {BaseComponentProps} from '../../types';

// This was put in because 3rd party library react-color doesn't yet cater for customized color of child component <SketchField> which contains HEX/RGB input text box
// Issue raised: https://github.com/casesandberg/react-color/issues/631

type StyledPickerProps = {
  type?: string;
  active?: boolean;
} & BaseComponentProps;

const StyledPicker = styled.div<StyledPickerProps>`
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

      &:hover {
        cursor: ${props => (props.type === 'number' || props.type === 'text' ? 'text' : 'pointer')};
        background-color: ${props =>
          props.active ? props.theme.inputBgdActive : props.theme.inputBgdHover};
        border-color: ${props =>
          props.active ? props.theme.inputBorderActiveColor : props.theme.inputBorderHoverColor};
      }

      &:active,
      &:focus,
      &.focus,
      &.active {
        outline: 0;
        background-color: ${props => props.theme.inputBgdActive};
        border-color: ${props => props.theme.inputBorderActiveColor};
        box-shadow: ${props => props.theme.inputBoxShadowActive};
      }
    }
    label {
      color: ${props => props.theme.subtextColor} !important;
    }
  }
`;

const PRESET_COLORS = [];

type CustomPickerProps = {
  color: HexColor;
  theme: {
    panelBackground: string;
  };
  onChange: ColorChangeHandler;
};

const defaultProps: CustomPickerProps = {
  color: '#f00',
  theme: {
    panelBackground
  },
  onChange: () => {
    // no-op
  }
};

// Note: When using SketchPicker, the parent component CustomPicker can be invoked as a function without props by ReactDOM.
const CustomPicker: React.FC<CustomPickerProps> = (props = defaultProps) => {
  const {color, onChange, theme} = props;

  const pickerStyle = useMemo(
    () => ({
      picker: {
        width: '200px',
        padding: '10px 10px 8px',
        boxSizing: 'initial',
        background: theme.panelBackground
      }
    }),
    [theme.panelBackground]
  );

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
};

export default withTheme(CustomPicker) as React.FC<Omit<CustomPickerProps, 'theme'>>;
