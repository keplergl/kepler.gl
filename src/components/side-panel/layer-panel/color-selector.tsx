// Copyright (c) 2022 Uber Technologies, Inc.
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

import React, {Component, createRef, MouseEvent} from 'react';
import styled from 'styled-components';
import {rgbToHex} from '../../../utils';
import SingleColorPalette from './single-color-palette';
import ColorRangeSelector from './color-range-selector';
import ColorPalette from './color-palette';
import {StyledPanelDropdown} from 'components/common/styled-components';
import onClickOutside from 'react-onclickoutside';
import {ColorRange} from '@kepler.gl/constants';
import {NestedPartial, RGBColor, ColorUI} from '@kepler.gl/types';

type ColorSelectorInputProps = {
  active: boolean;
  disabled?: boolean;
  inputTheme?: string;
};

type ColorSelectorProps = {
  colorSets: {
    selectedColor: RGBColor | ColorRange;
    setColor: ((v: RGBColor) => void) | ((v: ColorRange) => void);
    isRange?: boolean;
    label?: string;
  }[];
  colorUI?: ColorUI;
  inputTheme?: string;
  disabled?: boolean;
  setColorUI?: (newConfig: NestedPartial<ColorUI>) => void;
};

export const ColorBlock = styled.div<{backgroundcolor: RGBColor}>`
  width: 32px;
  height: 18px;
  border-radius: 1px;
  background-color: ${props => `rgb(${props.backgroundcolor.slice(0, 3).join(',')})`};
`;

export const ColorSelectorInput = styled.div<ColorSelectorInputProps>`
  ${props => (props.inputTheme === 'secondary' ? props.theme.secondaryInput : props.theme.input)};
  height: ${props => props.theme.inputBoxHeight};

  .color-selector__selector__label {
    text-transform: capitalize;
    font-size: 12px;
    text-align: center;
    color: ${props => props.theme.inputPlaceholderColor};
  }
`;

export const InputBoxContainer = styled.div`
  display: flex;
  justify-content: space-between;

  .color-select__input-group {
    flex-grow: 1;
  }
  .color-select__input-group:nth-child(2) {
    margin-left: 12px;
  }
`;

class ColorSelector extends Component<ColorSelectorProps> {
  static defaultProps = {
    colorSets: []
  };

  state = {
    showDropdown: false
  };

  node = createRef<HTMLDivElement>();

  handleClickOutside = e => {
    if (this.props.colorUI && Number.isInteger(this.props.colorUI.showSketcher)) {
      // if sketcher is open, let sketch to close itself first
      return;
    }

    this._closePanelDropdown();
  };

  _getEditing = () => {
    return this.props.colorUI ? this.props.colorUI.showDropdown : this.state.showDropdown;
  };

  _closePanelDropdown = () => {
    if (this._getEditing() === false) {
      return;
    }

    if (this.props.setColorUI) {
      this.props.setColorUI({showDropdown: false, showSketcher: false});
    } else {
      this.setState({showDropdown: false});
    }
  };

  _onSelectColor = (color: RGBColor | ColorRange, e: MouseEvent) => {
    e.stopPropagation();

    const editing = this._getEditing();

    if (typeof editing === 'number' && this.props.colorSets[editing]) {
      // @ts-ignore
      this.props.colorSets[editing].setColor(color);
    }
  };

  _showDropdown = (e, i) => {
    e.stopPropagation();
    e.preventDefault();

    if (this.props.setColorUI) {
      this.props.setColorUI({showDropdown: i});
    } else {
      this.setState({showDropdown: i});
    }
  };

  render() {
    const {colorSets, disabled, inputTheme, colorUI} = this.props;

    const editing = this._getEditing();
    const currentEditing =
      typeof editing === 'number' && colorSets[editing] && typeof colorSets[editing] === 'object';

    return (
      <div className="color-selector" ref={this.node}>
        <InputBoxContainer>
          {colorSets.map((cSet, i) => (
            <div className="color-select__input-group" key={i}>
              <ColorSelectorInput
                className="color-selector__selector"
                active={editing === i}
                disabled={disabled}
                inputTheme={inputTheme}
                onMouseDown={e => this._showDropdown(e, i)}
              >
                {cSet.isRange ? (
                  <ColorPalette colors={(cSet.selectedColor as ColorRange).colors} />
                ) : (
                  <ColorBlock
                    className="color-selector__selector__block"
                    backgroundcolor={cSet.selectedColor as RGBColor}
                  />
                )}
                {cSet.label ? (
                  <div className="color-selector__selector__label">{cSet.label}</div>
                ) : null}
              </ColorSelectorInput>
            </div>
          ))}
        </InputBoxContainer>
        {currentEditing ? (
          <StyledPanelDropdown className="color-selector__dropdown">
            {colorSets[editing as number].isRange ? (
              <ColorRangeSelector
                selectedColorRange={colorSets[editing as number].selectedColor as ColorRange}
                onSelectColorRange={this._onSelectColor}
                setColorPaletteUI={this.props.setColorUI}
                colorPaletteUI={colorUI as ColorUI}
              />
            ) : (
              <SingleColorPalette
                selectedColor={rgbToHex(colorSets[editing as number].selectedColor as RGBColor)}
                onSelectColor={this._onSelectColor}
              />
            )}
          </StyledPanelDropdown>
        ) : null}
      </div>
    );
  }
}

export default onClickOutside(ColorSelector);
