// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled, {withTheme} from 'styled-components';
import {SketchPicker, ColorChangeHandler} from 'react-color';
import useOnClickOutside from '../../hooks/use-on-click-outside';

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

const CustomPicker: React.FC<CustomPickerProps> = props => {
  const {color, onChange, theme} = props;
  const ref = useOnClickOutside<HTMLDivElement>(props.onSwatchClose);
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
    <StyledPicker ref={ref}>
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

export default withTheme(CustomPicker as React.FC<CustomPickerProps>);
