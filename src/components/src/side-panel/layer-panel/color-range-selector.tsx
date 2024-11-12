// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import uniq from 'lodash.uniq';
import React, {MouseEvent, useCallback, useMemo} from 'react';
import styled from 'styled-components';

import {COLOR_RANGES, ColorRange} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import {ColorUI, NestedPartial} from '@kepler.gl/types';
import {hasColorMap, numberSort, reverseColorRange, updateColorRange} from '@kepler.gl/utils';
import ItemSelector from '../../common/item-selector/item-selector';
import {PanelLabel, Tooltip} from '../../common/styled-components';
import Switch from '../../common/switch';
import ColorPalette from './color-palette';
import CustomPaletteFactory from './custom-palette';

type ColorRangeSelectorProps = {
  colorRanges?: ColorRange[];
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

type ColorPaletteGroupProps = {
  reversed?: boolean;
  selected: ColorRange;
  colorRanges: ColorRange[];
  onSelect: (p: ColorRange, e: MouseEvent) => void;
};

export const ALL_TYPES: string[] = uniq(
  COLOR_RANGES.map(c => c.type)
    .filter(ctype => ctype)
    .concat(['all', 'custom']) as string[]
);

export const ALL_STEPS: number[] = uniq(COLOR_RANGES.map(d => d.colors.length)).sort(numberSort);

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
  custom: {
    label: 'customPalette',
    type: 'switch',
    options: [true, false]
  }
};

ColorRangeSelectorFactory.deps = [CustomPaletteFactory];
function ColorRangeSelectorFactory(
  CustomPalette: ReturnType<typeof CustomPaletteFactory>
): React.FC<ColorRangeSelectorProps> {
  const ColorRangeSelector: React.FC<ColorRangeSelectorProps> = ({
    colorRanges,
    colorPaletteUI,
    setColorPaletteUI,
    onSelectColorRange,
    selectedColorRange
  }) => {
    const {customPalette, showSketcher, colorRangeConfig} = colorPaletteUI;
    const {type, steps} = colorRangeConfig;

    const filteredColorRanges = useMemo(() => {
      return (
        colorRanges?.filter(colorRange => {
          const isType = type === 'all' || type === colorRange.type;
          const isStep = Number(steps) === colorRange.colors.length;

          return isType && isStep;
        }) ?? []
      );
    }, [colorRanges, type, steps]);

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

    const onSelectFromList = useCallback(
      (colorRange, e) => {
        const newColorRange = updateColorRange(selectedColorRange, colorRange);
        onSelectColorRange(newColorRange, e);
      },
      [selectedColorRange, onSelectColorRange]
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
              <ColorPalette colors={customPalette.colors} />
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
          <ColorPaletteGroup
            colorRanges={filteredColorRanges}
            onSelect={onSelectFromList}
            selected={selectedColorRange}
            reversed={colorRangeConfig.reversed}
          />
        )}
      </StyledColorRangeSelector>
    );
  };

  ColorRangeSelector.defaultProps = {
    colorRanges: COLOR_RANGES,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSelectColorRange: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setColorPaletteUI: () => {}
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
  :hover {
    background-color: ${props => props.theme.panelBackgroundHover};
    cursor: pointer;
  }
`;

export const ColorPaletteGroup: React.FC<ColorPaletteGroupProps> = ({
  reversed,
  onSelect,
  selected,
  colorRanges
}) => (
  <div className="color-palette__group">
    {colorRanges.map((colorRange, i) => (
      <StyledColorRange
        key={`${colorRange.name}-${i}`}
        onClick={e =>
          onSelect(reversed ? (reverseColorRange(true, colorRange) as ColorRange) : colorRange, e)
        }
      >
        <ColorPalette
          colors={colorRange.colors}
          isReversed={reversed}
          isSelected={colorRange.name === selected.name && reversed === Boolean(selected.reversed)}
        />
      </StyledColorRange>
    ))}
  </div>
);

export default ColorRangeSelectorFactory;
