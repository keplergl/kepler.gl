// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useCallback, useEffect} from 'react';
import {useIntl} from 'react-intl';
import styled from 'styled-components';

import {Edit, Settings} from '../../common/icons';
import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import RangeSliderFactory from '../../common/range-slider';
import InfoHelperFactory from '../../common/info-helper';
import {FormattedMessage} from '@kepler.gl/localization';
import {Layer, LayerBaseConfig} from '@kepler.gl/layers';
import {isInRange, clamp, createSliderScale} from '@kepler.gl/utils';

type LazyInputProps = {
  value: string | [string, string];
  name: string;
  onChange: (n: string | [string, string], v?: string | [string, string]) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
};

type CustomInputProps = {
  value: string | [string, string];
  isRanged: boolean;
  onChangeCustomInput: (v: [string, string]) => void;
  autoFocus: boolean;
  disabled?: boolean;
  ariaLabel: string;
};

type VisConfigSliderProps = {
  layer: Layer;
  property: string;
  onChange: (v: Record<string, number | string | number[] | string[]>) => void;
  label?: string | ((c: LayerBaseConfig) => string);
  description?: string;
  range: [number, number];
  step?: number;
  isRanged: boolean;
  disabled?: boolean;
  inputTheme?: string;
  allowCustomValue?: boolean;
  /** i18n id or plain label for the custom-value edit button. */
  customInputLabel?: string;
  focusRange?: [number, number];
  focusWeight?: number;
};

const LabelRow = styled.div`
  display: flex;
  align-items: center;
`;

const CustomInputWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const CustomInputLabel = styled.label`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 4px;
  color: ${props => props.theme.textColor};
  font-size: ${props => props.theme.layerConfigGroupLabelLabelFontSize};
`;

const RangeInput = styled.input`
  ${props => props.theme.input};
  font-size: ${props => props.theme.sliderInputFontSize};
  width: 100%;
  min-width: 0;
  height: ${props => props.theme.sliderInputHeight}px;
`;

const ModeButton = styled.button<{$custom: boolean}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 18px;
  height: ${props => props.theme.sliderInputHeight}px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${props => props.theme.labelColor};
  cursor: pointer;
  opacity: ${props => (props.$custom ? 1 : 0)};

  &:hover,
  &:focus-visible {
    color: ${props => props.theme.textColorHl};
    opacity: 1;
  }

  @media (hover: none) {
    opacity: 1;
  }

  &:disabled {
    visibility: hidden;
  }
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;

  > :first-child {
    flex: 1;
    min-width: 0;
  }

  &:hover ${ModeButton} {
    opacity: 1;
  }
`;

const ValueReadout = styled.span<{$isRanged: boolean}>`
  width: ${props => (props.$isRanged ? '14ch' : '8ch')};
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  color: ${props => props.theme.textColor};
  font-size: calc(${props => props.theme.sliderInputFontSize} * 0.9);
  font-variant-numeric: tabular-nums;
`;

const LazyInput: React.FC<LazyInputProps> = ({
  value,
  onChange,
  name,
  autoFocus,
  disabled,
  ariaLabel
}) => {
  const [stateValue, setValue] = useState(value);
  useEffect(() => {
    setValue(value);
  }, [value]);

  const _onChange = useCallback(e => setValue(e.target.value), [setValue]);
  const onBlur = useCallback(() => onChange(name, stateValue), [onChange, name, stateValue]);

  return (
    <RangeInput
      type="number"
      autoFocus={autoFocus}
      disabled={disabled}
      aria-label={ariaLabel}
      value={stateValue}
      onChange={_onChange}
      onBlur={onBlur}
      onKeyDown={event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
    />
  );
};

const CustomInput: React.FC<CustomInputProps> = ({
  isRanged,
  value,
  onChangeCustomInput,
  autoFocus,
  disabled,
  ariaLabel
}) => {
  const onChangeInput = useCallback(
    (name, v) => {
      const prevValue = isRanged ? (name === 'value1' ? value[0] : value[1]) : value;
      const valueAsNumber = Number(v);
      const convertedValue =
        typeof prevValue === 'number' ? (isNaN(valueAsNumber) ? prevValue : valueAsNumber) : v;
      if (isRanged)
        onChangeCustomInput(
          name === 'value0' ? [convertedValue, value[1]] : [value[0], convertedValue]
        );
      else onChangeCustomInput(convertedValue);
    },
    [isRanged, value, onChangeCustomInput]
  );

  return (
    <CustomInputWrapper>
      {isRanged ? (
        <>
          <CustomInputLabel>
            <FormattedMessage id="mapLegend.min" />
            <LazyInput
              name="value0"
              value={value[0]}
              onChange={onChangeInput}
              autoFocus={autoFocus}
              disabled={disabled}
            />
          </CustomInputLabel>
          <CustomInputLabel>
            <FormattedMessage id="mapLegend.max" />
            <LazyInput
              name="value1"
              value={value[1]}
              onChange={onChangeInput}
              disabled={disabled}
            />
          </CustomInputLabel>
        </>
      ) : (
        <LazyInput
          name="value"
          value={value}
          onChange={onChangeInput}
          autoFocus={autoFocus}
          disabled={disabled}
          ariaLabel={ariaLabel}
        />
      )}
    </CustomInputWrapper>
  );
};

VisConfigSliderFactory.deps = [RangeSliderFactory, InfoHelperFactory];

export default function VisConfigSliderFactory(
  RangeSlider: ReturnType<typeof RangeSliderFactory>,
  InfoHelper: ReturnType<typeof InfoHelperFactory>
) {
  const VisConfigSlider: React.FC<VisConfigSliderProps> = ({
    layer: {id, config},
    property,
    label,
    description,
    range,
    step,
    isRanged,
    allowCustomValue,
    customInputLabel,
    disabled,
    onChange,
    inputTheme,
    focusRange,
    focusWeight
  }) => {
    const intl = useIntl();
    const value = config.visConfig[property];
    const [mode, setMode] = useState<'slider' | 'editing' | 'saved'>(() =>
      isInRange(value, range) ? 'slider' : 'saved'
    );
    const custom = mode !== 'slider';
    const scaleConfig = createSliderScale(focusRange, focusWeight);
    const labelId = typeof label === 'function' ? label(config) : label || `property.${property}`;
    const displayedValue = Array.isArray(value) ? value.join(' – ') : String(value);
    const modeLabel = custom
      ? intl.formatMessage({id: 'layerVisConfigs.useSlider', defaultMessage: 'Use slider'})
      : intl.formatMessage({
          id: customInputLabel || 'layerVisConfigs.enterCustomValue',
          defaultMessage: customInputLabel || 'Enter custom value'
        });

    const toggleMode = () => {
      if (custom) {
        const adjustedValue = isRanged
          ? [clamp(range, value[0]), clamp(range, value[1])]
          : clamp(range, value);
        onChange({[property]: adjustedValue});
      }
      setMode(custom ? 'slider' : 'editing');
    };

    return (
      <SidePanelSection disabled={Boolean(disabled)}>
        {label ? (
          <LabelRow>
            <PanelLabel>
              <FormattedMessage id={labelId} />
            </PanelLabel>
            {description ? (
              <InfoHelper description={description} id={`${id}-${property}-description`} />
            ) : null}
          </LabelRow>
        ) : null}

        <SliderRow>
          {custom ? (
            <CustomInput
              isRanged={isRanged}
              value={value}
              onChangeCustomInput={v => onChange({[property]: v})}
              autoFocus={mode === 'editing'}
              disabled={disabled}
              ariaLabel={intl.formatMessage({id: labelId, defaultMessage: property})}
            />
          ) : (
            <RangeSlider
              range={range}
              value0={isRanged ? value[0] : range[0]}
              value1={isRanged ? value[1] : value}
              step={step}
              isRanged={Boolean(isRanged)}
              onChange={v => onChange({[property]: isRanged ? v : v[1]})}
              inputTheme={inputTheme}
              showInput={!allowCustomValue}
              scaleConfig={scaleConfig}
            />
          )}
          {allowCustomValue && !custom ? (
            <ValueReadout $isRanged={isRanged} title={displayedValue}>
              {displayedValue}
            </ValueReadout>
          ) : null}
          {allowCustomValue ? (
            <ModeButton
              $custom={custom}
              type="button"
              title={modeLabel}
              aria-label={modeLabel}
              disabled={disabled}
              onClick={toggleMode}
            >
              {custom ? <Settings height="16px" aria-hidden="true" /> : <Edit aria-hidden="true" />}
            </ModeButton>
          ) : null}
        </SliderRow>
      </SidePanelSection>
    );
  };

  return VisConfigSlider;
}
