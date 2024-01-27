// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, createRef, MouseEvent, ComponentType} from 'react';
import styled from 'styled-components';
import {FormattedMessage} from 'react-intl';
import {rgbToHex} from '@kepler.gl/utils';
import SingleColorPalette from './single-color-palette';
import ColorRangeSelector from './color-range-selector';
import ColorPalette from './color-palette';
import {StyledPanelDropdown, PanelLabel} from '../../common/styled-components';
import onClickOutside from 'react-onclickoutside';
import {ColorRange} from '@kepler.gl/constants';
import RangeSliderFactory from '../../common/range-slider';
import {NestedPartial, RGBColor, RGBAColor, ColorUI} from '@kepler.gl/types';

type ColorSelectorInputProps = {
  active: boolean;
  disabled?: boolean;
  inputTheme?: string;
};

export type ColorSet = {
  selectedColor: RGBColor | RGBAColor | ColorRange;
  setColor: (v: RGBColor | RGBAColor | ColorRange) => void;
  isRange?: boolean;
  label?: string;
};

type ColorSelectorProps = {
  colorSets: ColorSet[];
  colorUI?: ColorUI;
  inputTheme?: string;
  disabled?: boolean;
  useOpacity?: boolean;
  setColorUI?: (newConfig: NestedPartial<ColorUI>) => void;
};

const OpacitySliderWrapper = styled.div`
  padding: 0px 12px 12px 12px;
`;

const OPACITY_SLIDER_PROPS = {
  type: 'number',
  range: [0, 1],
  value0: 0,
  step: 0.01,
  isRanged: false,
  label: 'Opacity',
  showInput: true
};

export const ColorBlock = styled.div<{backgroundcolor: RGBColor}>`
  width: 32px;
  height: 18px;
  border-radius: 1px;
  background-color: ${props =>
    Array.isArray(props.backgroundcolor)
      ? `rgb(${props.backgroundcolor.slice(0, 3).join(',')})`
      : 'transparent'};
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

ColorSelectorFactory.deps = [RangeSliderFactory];

function ColorSelectorFactory(RangeSlider): ComponentType<ColorSelectorProps> {
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
      const colorSet = typeof editing === 'number' && this.props.colorSets[editing];
      if (colorSet) {
        this._setColor(colorSet, color, colorSet.selectedColor[3]);
      }
    };

    _onSelectOpacity = (opacity: number[], e: MouseEvent) => {
      if (e) e.stopPropagation();
      const editing = this._getEditing();
      const colorSet = typeof editing === 'number' && this.props.colorSets[editing];
      if (colorSet) {
        this._setColor(colorSet, colorSet.selectedColor, Math.round(opacity[1] * 255));
      }
    };

    _setColor = (colorSet: ColorSet, color: RGBColor | RGBAColor | ColorRange, opacity: number) => {
      if (this.props.useOpacity && Array.isArray(color)) {
        colorSet.setColor([...color.slice(0, 3), opacity] as RGBAColor);
      } else {
        colorSet.setColor(color);
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
      const {colorSets, useOpacity, disabled, inputTheme, colorUI} = this.props;

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
              {useOpacity ? (
                <OpacitySliderWrapper>
                  <PanelLabel>
                    <FormattedMessage id="color.opacity" />
                  </PanelLabel>
                  <RangeSlider
                    {...OPACITY_SLIDER_PROPS}
                    value1={colorSets[editing as number].selectedColor[3] / 255}
                    onChange={this._onSelectOpacity}
                  />
                </OpacitySliderWrapper>
              ) : null}
            </StyledPanelDropdown>
          ) : null}
        </div>
      );
    }
  }
  return onClickOutside(ColorSelector) as ComponentType<ColorSelectorProps>;
}

export default ColorSelectorFactory;
