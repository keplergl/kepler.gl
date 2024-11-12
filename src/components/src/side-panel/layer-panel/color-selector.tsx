// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ColorRange} from '@kepler.gl/constants';
import {ColorUI, NestedPartial, RGBAColor, RGBColor} from '@kepler.gl/types';
import {rgbToHex} from '@kepler.gl/utils';
import React, {MouseEvent, ComponentType, useState, useCallback} from 'react';
import {FormattedMessage} from 'react-intl';
import styled from 'styled-components';
import RangeSliderFactory from '../../common/range-slider';
import {PanelLabel, StyledPanelDropdown} from '../../common/styled-components';
import ColorPalette from './color-palette';
import ColorRangeSelectorFactory from './color-range-selector';
import SingleColorPalette from './single-color-palette';

import useOnClickOutside from '../../hooks/use-on-click-outside';

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

ColorSelectorFactory.deps = [ColorRangeSelectorFactory, RangeSliderFactory];

function ColorSelectorFactory(ColorRangeSelector, RangeSlider): ComponentType<ColorSelectorProps> {
  const ColorSelector: React.FC<ColorSelectorProps> = ({
    colorSets = [],
    colorUI,
    inputTheme,
    disabled,
    useOpacity,
    setColorUI
  }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const showSketcher = colorUI ? colorUI.showSketcher : false;

    const editing = colorUI ? colorUI.showDropdown : showDropdown;
    const currentEditing =
      typeof editing === 'number' && colorSets[editing] && typeof colorSets[editing] === 'object';

    const closePanelDropdown = useCallback(() => {
      if (editing === false) {
        return;
      }

      if (setColorUI) {
        setColorUI({showDropdown: false, showSketcher: false});
      } else {
        setShowDropdown(false);
      }
    }, [editing, setColorUI, setShowDropdown]);

    const handleClickOutside = useCallback(() => {
      if (Number.isInteger(showSketcher)) {
        // if sketcher is open, let sketch to close itself first
        return;
      }
      closePanelDropdown();
    }, [showSketcher, closePanelDropdown]);

    const ref = useOnClickOutside<HTMLDivElement>(handleClickOutside);

    const onSetColor = useCallback(
      (colorSet: ColorSet, color: RGBColor | RGBAColor | ColorRange, opacity: number) => {
        const {setColor} = colorSet || {};
        if (!setColor) {
          return;
        }
        if (useOpacity && Array.isArray(color)) {
          setColor([...color.slice(0, 3), opacity] as RGBAColor);
        } else {
          setColor(color);
        }
      },
      [useOpacity]
    );

    const onSelectColor = useCallback(
      (color: RGBColor | ColorRange, e: MouseEvent) => {
        if (e) e.stopPropagation();
        const colorSet = typeof editing === 'number' && colorSets[editing];
        if (colorSet) {
          onSetColor(colorSet, color, colorSet.selectedColor[3]);
        }
      },
      [editing, colorSets, onSetColor]
    );

    const onSelectOpacity = useCallback(
      (opacity: number[], e: MouseEvent) => {
        if (e) e.stopPropagation();
        const colorSet = typeof editing === 'number' && colorSets[editing];
        if (colorSet) {
          onSetColor(colorSet, colorSet.selectedColor, Math.round(opacity[1] * 255));
        }
      },
      [onSetColor, colorSets, editing]
    );

    const onToggleDropdown = useCallback(
      (e, i) => {
        e.stopPropagation();
        e.preventDefault();

        if (setColorUI) {
          setColorUI({showDropdown: i});
        } else {
          setShowDropdown(i);
        }
      },
      [setColorUI, setShowDropdown]
    );

    return (
      <div className="color-selector">
        <InputBoxContainer>
          {colorSets.map((cSet, i) => (
            <div className="color-select__input-group" key={i}>
              <ColorSelectorInput
                className="color-selector__selector"
                active={editing === i}
                disabled={disabled}
                inputTheme={inputTheme}
                onClick={e => onToggleDropdown(e, i)}
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
          <StyledPanelDropdown className="color-selector__dropdown" ref={ref}>
            {colorSets[editing as number].isRange ? (
              <ColorRangeSelector
                selectedColorRange={colorSets[editing as number].selectedColor as ColorRange}
                onSelectColorRange={onSelectColor}
                setColorPaletteUI={setColorUI}
                colorPaletteUI={colorUI as ColorUI}
              />
            ) : (
              <SingleColorPalette
                selectedColor={rgbToHex(colorSets[editing as number].selectedColor as RGBColor)}
                onSelectColor={onSelectColor}
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
                  onChange={onSelectOpacity}
                />
              </OpacitySliderWrapper>
            ) : null}
          </StyledPanelDropdown>
        ) : null}
      </div>
    );
  };

  return ColorSelector;
}

export default ColorSelectorFactory;
