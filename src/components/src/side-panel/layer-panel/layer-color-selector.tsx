// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';

import {ColorRange} from '@kepler.gl/constants';
import {Layer} from '@kepler.gl/layers';
import {NestedPartial, RGBColor, ColorUI} from '@kepler.gl/types';

import ColorSelectorFactory from './color-selector';
import {SidePanelSection} from '../../common/styled-components';

type LayerColorSelectorProps = {
  layer: Layer;
  onChange: (v: Record<string, RGBColor>) => void;
  selectedColor?: RGBColor;
  property?: string;
  setColorUI: (prop: string, newConfig: NestedPartial<ColorUI>) => void;
};

type ArcLayerColorSelectorProps = {
  layer: Layer;
  onChangeConfig: (v: {color: RGBColor}) => void;
  onChangeVisConfig: (v: {targetColor: RGBColor}) => void;
  property?: string;
  setColorUI: (prop: string, newConfig: NestedPartial<ColorUI>) => void;
};

type LayerColorRangeSelectorProps = {
  layer: Layer;
  onChange: (v: Record<string, ColorRange>) => void;
  property?: string;
  setColorUI: (prop: string, newConfig: NestedPartial<ColorUI>) => void;
};

LayerColorSelectorFactory.deps = [ColorSelectorFactory];
export function LayerColorSelectorFactory(ColorSelector) {
  const LayerColorSelector = ({
    layer,
    onChange,
    selectedColor,
    property = 'color',
    setColorUI
  }: LayerColorSelectorProps) => {
    const onSetColorUI = useCallback(
      newConfig => setColorUI(property, newConfig),
      [setColorUI, property]
    );

    return (
      <SidePanelSection>
        <ColorSelector
          colorSets={[
            {
              selectedColor: selectedColor || layer.config.color,
              setColor: (rgbValue: RGBColor) => onChange({[property]: rgbValue})
            }
          ]}
          colorUI={layer.config.colorUI[property]}
          setColorUI={onSetColorUI}
        />
      </SidePanelSection>
    );
  };
  return LayerColorSelector;
}

LayerColorRangeSelectorFactory.deps = [ColorSelectorFactory];
export function LayerColorRangeSelectorFactory(ColorSelector) {
  const LayerColorRangeSelector = ({
    layer,
    onChange,
    property = 'colorRange',
    setColorUI
  }: LayerColorRangeSelectorProps) => {
    const onSetColorUI = useCallback(
      newConfig => setColorUI(property, newConfig),
      [setColorUI, property]
    );

    return (
      <SidePanelSection>
        <ColorSelector
          colorSets={[
            {
              selectedColor: layer.config.visConfig[property],
              isRange: true,
              setColor: (colorRange: ColorRange) => onChange({[property]: colorRange})
            }
          ]}
          colorUI={layer.config.colorUI[property]}
          setColorUI={onSetColorUI}
        />
      </SidePanelSection>
    );
  };
  return LayerColorRangeSelector;
}

ArcLayerColorSelectorFactory.deps = [ColorSelectorFactory];
export function ArcLayerColorSelectorFactory(ColorSelector) {
  const ArcLayerColorSelector = ({
    layer,
    onChangeConfig,
    onChangeVisConfig,
    property = 'color',
    setColorUI
  }: ArcLayerColorSelectorProps) => {
    const onSetColorUI = useCallback(
      newConfig => setColorUI(property, newConfig),
      [setColorUI, property]
    );

    return (
      <SidePanelSection>
        <ColorSelector
          colorSets={[
            {
              selectedColor: layer.config.color,
              setColor: (rgbValue: RGBColor) => onChangeConfig({color: rgbValue}),
              label: 'Source'
            },
            {
              selectedColor: layer.config.visConfig.targetColor || layer.config.color,
              setColor: (rgbValue: RGBColor) => onChangeVisConfig({targetColor: rgbValue}),
              label: 'Target'
            }
          ]}
          colorUI={layer.config.colorUI[property]}
          setColorUI={onSetColorUI}
        />
      </SidePanelSection>
    );
  };
  return ArcLayerColorSelector;
}
