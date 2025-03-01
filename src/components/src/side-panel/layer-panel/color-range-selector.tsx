// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {MouseEvent, useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {KEPLER_COLOR_PALETTES, PALETTE_TYPES, ColorPalette} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import {ColorRange, ColorUI, NestedPartial} from '@kepler.gl/types';
import {
  hasColorMap,
  updateColorRangeBySelectedPalette,
  paletteIsSteps,
  paletteIsType,
  paletteIsColorBlindSafe
} from '@kepler.gl/utils';
import ItemSelector from '../../common/item-selector/item-selector';
import {PanelLabel, Tooltip} from '../../common/styled-components';
import Switch from '../../common/switch';
import ColorPalettePanel from './color-palette';
import CustomPaletteFactory from './custom-palette';

import {capitalizeFirstLetter} from '@kepler.gl/utils';
import {range} from 'd3-array';

type ColorRangeSelectorProps = {
  colorPalettes?: ColorPalette[];
  colorPaletteUI: ColorUI;
  selectedColorRange: ColorRange;
  onSelectColorRange: (p: ColorRange, e: MouseEvent) => void;
  setColorPaletteUI: (newConfig: NestedPartial<ColorUI>) => void;
};

type PaletteConfigProps = {
  label: string;
  value: string | number | boolean;
  config: {
    type: string;
    options: (string | number | boolean)[];
  };
  onChange: (v: any) => void;
  disabled?: boolean;
  prop: string;
  reason?: string;
};

// @ts-ignore cant concat 'all' to PALETTE_TYPES values
export const ALL_TYPES = Object.values(PALETTE_TYPES).concat(['all']);
const MAX_STEPS = 20;
const ALL_STEPS = range(2, MAX_STEPS + 1, 1);

const StyledColorConfig = styled.div`
  padding: 12px 12px 0 12px;
`;

const StyledColorRangeSelector = styled.div.attrs({
  className: 'color-range-selector'
})`
  padding-bottom: 12px;
`;
const StyledColorPalette = styled.div`
  padding: 0 8px 8px 8px;
`;

const StyledPaletteConfig = styled.div`
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .color-palette__config__select {
    width: 40%;
    display: flex;
    flex-direction: row-reverse;

    .item-selector {
      width: 100%;
    }
  }
`;

const CONFIG_SETTINGS = {
  type: {
    type: 'select',
    options: ALL_TYPES
  },
  steps: {
    type: 'select',
    options: ALL_STEPS,
    disabled: colorRange => hasColorMap(colorRange),
    reason: 'color.disableStepReason'
  },
  reversed: {
    type: 'switch',
    options: [true, false]
  },
  colorBlindSafe: {
    type: 'switch',
    options: [true, false]
  },
  custom: {
    label: 'customPalette',
    type: 'switch',
    options: [true, false]
  }
};
const displayOption = d => capitalizeFirstLetter(d);
const getOptionValue = d => d;
const noop = () => {
  // do nothing
};

ColorRangeSelectorFactory.deps = [CustomPaletteFactory];
function ColorRangeSelectorFactory(
  CustomPalette: ReturnType<typeof CustomPaletteFactory>
): React.FC<ColorRangeSelectorProps> {
  const ColorRangeSelector: React.FC<ColorRangeSelectorProps> = ({
    colorPalettes = KEPLER_COLOR_PALETTES,
    colorPaletteUI,
    setColorPaletteUI = noop,
    onSelectColorRange = noop,
    selectedColorRange
  }) => {
    const {customPalette, showSketcher, colorRangeConfig} = colorPaletteUI;
    const {type, steps, colorBlindSafe, reversed} = colorRangeConfig;

    const filteredColorPalettes = useMemo(() => {
      return (
        colorPalettes?.filter(
          palette =>
            paletteIsType(palette, type) &&
            paletteIsSteps(palette, steps) &&
            paletteIsColorBlindSafe(palette, colorBlindSafe)
        ) ?? []
      );
    }, [colorPalettes, colorBlindSafe, steps, type]);

    const _updateConfig = useCallback(
      ({key, value}) => {
        setColorPaletteUI({colorRangeConfig: {[key]: value}});
      },
      [setColorPaletteUI]
    );

    const _onCustomPaletteCancel = useCallback(() => {
      setColorPaletteUI({
        showSketcher: false,
        colorRangeConfig: {custom: false}
      });
    }, [setColorPaletteUI]);

    const _onApply = useCallback(
      e => onSelectColorRange(customPalette, e),
      [customPalette, onSelectColorRange]
    );

    const _onSelectPalette = useCallback(
      (colorPalette, e) => {
        const newColorRange = updateColorRangeBySelectedPalette(selectedColorRange, colorPalette, {
          steps,
          reversed
        });

        onSelectColorRange(newColorRange, e);
      },
      [selectedColorRange, reversed, steps, onSelectColorRange]
    );
    return (
      <StyledColorRangeSelector>
        <StyledColorConfig>
          {(colorRangeConfig.custom ? ['custom'] : Object.keys(colorRangeConfig)).map(key =>
            CONFIG_SETTINGS[key] ? (
              <PaletteConfig
                key={key}
                prop={key}
                label={CONFIG_SETTINGS[key].label || key}
                config={CONFIG_SETTINGS[key]}
                value={colorRangeConfig[key]}
                onChange={_updateConfig}
                disabled={
                  CONFIG_SETTINGS[key].disabled
                    ? CONFIG_SETTINGS[key].disabled(selectedColorRange)
                    : false
                }
                reason={CONFIG_SETTINGS[key].reason}
              />
            ) : null
          )}
        </StyledColorConfig>
        {colorRangeConfig.custom ? (
          <>
            <StyledColorPalette>
              <ColorPalettePanel colors={customPalette.colors} />
            </StyledColorPalette>
            <CustomPalette
              customPalette={customPalette}
              showSketcher={showSketcher}
              onApply={_onApply}
              setColorPaletteUI={setColorPaletteUI}
              onCancel={_onCustomPaletteCancel}
            />
          </>
        ) : (
          <div className="color-palette__group">
            {filteredColorPalettes.map((colorPalette, i) => (
              <ColorPaletteItem
                key={`${colorPalette.name}-${i}`}
                colorPalette={colorPalette}
                selectedColorRange={selectedColorRange}
                onSelect={_onSelectPalette}
                reversed={reversed}
                steps={steps}
              />
            ))}
          </div>
        )}
      </StyledColorRangeSelector>
    );
  };

  return ColorRangeSelector;
}

export const PaletteConfig: React.FC<PaletteConfigProps> = ({
  prop,
  label,
  value,
  config: {type, options},
  onChange,
  disabled,
  reason
}) => {
  const updateSelect = useCallback(val => onChange({key: prop, value: val}), [onChange, prop]);
  const updateSwitch = useCallback(
    () => onChange({key: prop, value: !value}),
    [onChange, prop, value]
  );

  return (
    <StyledPaletteConfig className="color-palette__config" onClick={e => e.stopPropagation()}>
      <div className="color-palette__config__label">
        <PanelLabel>
          <FormattedMessage id={`color.${label}`} />
        </PanelLabel>
      </div>
      <div
        className="color-palette__config__select"
        data-tip
        data-for={`color-range-config-${prop}`}
      >
        {type === 'select' && (
          <ItemSelector
            selectedItems={value}
            options={options}
            multiSelect={false}
            searchable={false}
            onChange={updateSelect}
            disabled={disabled}
            inputTheme="secondary"
            displayOption={displayOption}
            getOptionValue={getOptionValue}
          />
        )}
        {type === 'switch' && (
          <Switch
            checked={Boolean(value)}
            id={`${label}-toggle`}
            onChange={updateSwitch}
            disabled={disabled}
            secondary
          />
        )}
        {disabled && reason ? (
          <Tooltip id={`color-range-config-${prop}`} place="right">
            <div style={{maxWidth: '214px'}}>
              <FormattedMessage id={reason} />
            </div>
          </Tooltip>
        ) : null}
      </div>
    </StyledPaletteConfig>
  );
};
const StyledColorRange = styled.div.attrs({
  className: 'color-palette-outer'
})`
  padding: 0 8px;
  &:hover {
    background-color: ${props => props.theme.panelBackgroundHover};
    cursor: pointer;
  }
`;

type ColorPaletteItemProps = {
  reversed?: boolean;
  selected?: ColorRange;
  colorPalette: ColorPalette;
  selectedColorRange: ColorRange;
  onSelect: (colorPalette: ColorPalette, e: MouseEvent) => void;
  steps: number;
};

export const ColorPaletteItem: React.FC<ColorPaletteItemProps> = ({
  colorPalette,
  steps,
  selectedColorRange,
  onSelect,
  reversed
}) => {
  const colors = useMemo(() => colorPalette.colors(steps), [colorPalette, steps]);
  const onClick = useCallback(e => onSelect(colorPalette, e), [colorPalette, onSelect]);
  return (
    <StyledColorRange onClick={onClick}>
      <ColorPalettePanel
        colors={colors}
        isReversed={reversed}
        isSelected={colorPalette.name === selectedColorRange.name}
      />
    </StyledColorRange>
  );
};

export default ColorRangeSelectorFactory;
