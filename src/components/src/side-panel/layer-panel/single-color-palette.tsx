// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {MouseEvent, useCallback, useState} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import {hexToRgb} from '@kepler.gl/utils';
import {FormattedMessage} from '@kepler.gl/localization';
import {Themes, ColorRange} from '@kepler.gl/constants';
import {RGBColor, HexColor} from '@kepler.gl/types';

import CustomPicker from './custom-picker';
import PresetColorPalette from './color-palette-preset';

const MODE = {
  preset: 'preset',
  picker: 'picker'
};

export type SingleColorPaletteProps = {
  selectedColor: HexColor;
  onSelectColor: (color: RGBColor | ColorRange, e: MouseEvent) => void;
};

const StyledColorPickerTop = styled.div`
  border-bottom: 1px solid ${({theme}) => theme.dropdownListBorderTop};
  display: flex;
  padding-top: 2px 4px 0 4px;
  .color-palette-tab {
    padding: 8px 0;
    margin: 0 8px;
    color: ${({theme}) => theme.subtextColor};
    border-bottom: 2px;
    border-bottom-style: solid;
    border-bottom-color: transparent;
    &.active {
      color: ${({theme}) => theme.textColorHl};
      border-bottom-color: ${({theme}) => theme.panelToggleBorderColor};
    }
    :hover {
      cursor: pointer;
      color: ${props => props.theme.textColorHl};
    }
  }
`;

const ColorPickerTop = ({setMode, mode}) => (
  <StyledColorPickerTop>
    {Object.keys(MODE).map(modeId => (
      <div
        onClick={() => setMode(modeId)}
        key={modeId}
        className={classnames('color-palette-tab', {active: mode === modeId})}
      >
        <FormattedMessage id={`color.${modeId}`} />
      </div>
    ))}
  </StyledColorPickerTop>
);

// eslint-disable-next-line @typescript-eslint/no-empty-function
const nop = () => {};

const SingleColorPalette: React.FC<SingleColorPaletteProps> = ({
  selectedColor,
  onSelectColor
}: SingleColorPaletteProps) => {
  const [mode, setMode] = useState(MODE.preset);
  const onSetColor = useCallback(
    (color, e) => {
      // color picker return an object, with color.hex
      const hex = color.hex || color;
      onSelectColor(hexToRgb(hex), e);
    },
    [onSelectColor]
  );
  return (
    <div className="single-color-palette">
      <ColorPickerTop mode={mode} setMode={setMode} />
      {mode === MODE.preset ? (
        <PresetColorPalette
          themes={Themes}
          onSelectColor={onSetColor}
          selectedColor={selectedColor}
        />
      ) : null}
      {mode === MODE.picker ? (
        <CustomPicker color={selectedColor} onChange={onSetColor} onSwatchClose={nop} />
      ) : null}
    </div>
  );
};

export default SingleColorPalette;
