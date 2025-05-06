// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState, MouseEvent} from 'react';
import {FormattedMessage} from 'react-intl';
import styled from 'styled-components';
import {useDismiss, useFloating, useInteractions} from '@floating-ui/react';

import {ColorRange} from '@kepler.gl/types';
import {ColorUI, NestedPartial, RGBAColor, RGBColor} from '@kepler.gl/types';
import {rgbToHex} from '@kepler.gl/utils';

import RangeSliderFactory from '../../common/range-slider';
import {PanelLabel, shouldForwardProp, StyledPanelDropdown} from '../../common/styled-components';
import ColorPalette from './color-palette';
import ColorRangeSelectorFactory from './color-range-selector';
import SingleColorPalette from './single-color-palette';

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

export const ColorBlock = styled.div.withConfig({
  shouldForwardProp
})<{backgroundcolor: RGBColor}>`
  width: 32px;
  height: 18px;
  border-radius: 1px;
  background-color: ${props =>
    Array.isArray(props.backgroundcolor)
      ? `rgb(${props.backgroundcolor.slice(0, 3).join(',')})`
      : 'transparent'};
`;

const StyledColorSelectorWrapper = styled.div`
  .selector__dropdown {
    max-height: 600px; /* increase from the default 500px defined by StyledPanelDropdown */
  }
`;

export const ColorSelectorInput = styled.div.withConfig({
  shouldForwardProp
})<ColorSelectorInputProps>`
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

function ColorSelectorFactory(
  ColorRangeSelector: ReturnType<typeof ColorRangeSelectorFactory>,
  RangeSlider: ReturnType<typeof RangeSliderFactory>
): React.FC<ColorSelectorProps> {
  const ColorSelector: React.FC<ColorSelectorProps> = ({
    colorSets = [],
    colorUI,
    inputTheme,
    disabled,
    useOpacity,
    setColorUI
  }: ColorSelectorProps) => {
    const [showDropdown, setShowDropdown] = useState(colorUI ? colorUI.showDropdown : false);
    const showSketcher = colorUI ? colorUI.showSketcher : false;
    const editingLookup = colorUI ? colorUI.showDropdown : showDropdown;
    const editingColorSet: ColorSet | false =
      typeof editingLookup === 'number' && colorSets[editingLookup]
        ? colorSets[editingLookup]
        : false;

    const closePanelDropdown = useCallback(() => {
      if (editingLookup === false) {
        return;
      }
      if (setColorUI) {
        setColorUI({showDropdown: false, showSketcher: false});
      } else {
        setShowDropdown(false);
      }
    }, [editingLookup, setColorUI, setShowDropdown]);

    const handleClickOutside = useCallback(() => {
      if (Number.isInteger(showSketcher)) {
        // if sketcher is open, let sketch to close itself first
        return;
      }
      closePanelDropdown();
    }, [showSketcher, closePanelDropdown]);

    // floating-ui boilerplate to establish close on outside click
    const {refs, context} = useFloating({
      open: true,
      onOpenChange: v => {
        if (!v) {
          handleClickOutside();
        }
      }
    });
    const dismiss = useDismiss(context);
    const {getFloatingProps} = useInteractions([dismiss]);

    const setColor = useCallback(
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
        const colorSet = editingColorSet;
        if (colorSet) {
          setColor(colorSet, color, colorSet.selectedColor[3]);
        }
      },
      [editingColorSet, setColor]
    );

    const onSelectOpacity = useCallback(
      (opacity: number[], e: Event | null | undefined) => {
        if (e) e.stopPropagation();
        const colorSet = editingColorSet;
        if (colorSet) {
          setColor(colorSet, colorSet.selectedColor, Math.round(opacity[1] * 255));
        }
      },
      [editingColorSet, setColor]
    );

    const onToggleDropdown = useCallback(
      (e, i) => {
        e.stopPropagation();
        e.preventDefault();
        const showDropdownValue =
          editingLookup === false
            ? i // open it for the specific color set index
            : false; // close it
        if (setColorUI) {
          setColorUI({showDropdown: showDropdownValue});
        } else {
          setShowDropdown(showDropdownValue);
        }
      },
      [editingLookup, setColorUI, setShowDropdown]
    );

    return (
      <StyledColorSelectorWrapper
        className="color-selector"
        ref={refs.setFloating}
        {...getFloatingProps()}
      >
        <InputBoxContainer>
          {colorSets.map((cSet, i) => (
            <div className="color-select__input-group" key={i}>
              <ColorSelectorInput
                className="color-selector__selector"
                active={editingLookup === i}
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
        {editingColorSet ? (
          <StyledPanelDropdown className="color-selector__dropdown">
            {editingColorSet.isRange && colorUI && setColorUI ? (
              <ColorRangeSelector
                selectedColorRange={editingColorSet.selectedColor as ColorRange}
                onSelectColorRange={onSelectColor}
                setColorPaletteUI={setColorUI}
                colorPaletteUI={colorUI as ColorUI}
              />
            ) : (
              <SingleColorPalette
                selectedColor={rgbToHex(editingColorSet.selectedColor as RGBColor)}
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
                  value1={editingColorSet.selectedColor[3] / 255}
                  onChange={onSelectOpacity}
                />
              </OpacitySliderWrapper>
            ) : null}
          </StyledPanelDropdown>
        ) : null}
      </StyledColorSelectorWrapper>
    );
  };

  return ColorSelector;
}

export default ColorSelectorFactory;
