// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useCallback, useEffect} from 'react';
import {useIntl} from 'react-intl';
import styled from 'styled-components';

import {Edit, Settings} from '../../common/icons';
import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import RangeSliderFactory from '../../common/range-slider';
import InfoHelperFactory from '../../common/info-helper';
import TippyTooltip from '../../common/tippy-tooltip';
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

const ModeButton = styled.button`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  place-items: center;
  flex: 0 0 auto;
  width: 55px;
  height: ${props => props.theme.sliderInputHeight}px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${props => props.theme.labelColor};
  font-family: inherit;
  font-size: calc(${props => props.theme.sliderInputFontSize} * 0.9 - 1px);
  font-variant-numeric: tabular-nums;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    color: ${props => props.theme.textColorHl};
  }

  &:disabled {
    cursor: default;
  }
`;

const ValueReadout = styled.span`
  grid-area: 1 / 1;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props => props.theme.textColor};
  visibility: var(--slider-value-visibility, visible);
`;

const Pencil = styled.span`
  grid-area: 1 / 1;
  display: flex;
  visibility: var(--slider-pencil-visibility, hidden);
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;

  > :first-child {
    flex: 1;
    min-width: 0;
  }

  ${ModeButton}:focus-visible {
    --slider-value-visibility: hidden;
    --slider-pencil-visibility: visible;
  }

  @media (hover: hover) {
    &:not(:has(.kg-range-slider__handle--active, .kg-range-slider__bar--active))
      ${ModeButton}:enabled:hover {
      --slider-value-visibility: hidden;
      --slider-pencil-visibility: visible;
    }
  }
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
  type SliderControlProps = Omit<
    VisConfigSliderProps,
    'layer' | 'label' | 'range' | 'focusRange'
  > & {
    id: string;
    labelId: string;
    showLabel: boolean;
    hasSettingLabel: boolean;
    value0: number;
    value1: number;
    range0: number;
    range1: number;
    focus0?: number;
    focus1?: number;
  };

  const SliderControl = React.memo(function SliderControl({
    id,
    property,
    labelId,
    showLabel,
    hasSettingLabel,
    description,
    value0,
    value1,
    range0,
    range1,
    step,
    isRanged,
    allowCustomValue,
    customInputLabel,
    disabled,
    onChange,
    inputTheme,
    focus0,
    focus1,
    focusWeight
  }: SliderControlProps) {
    const intl = useIntl();
    const range: [number, number] = [range0, range1];
    const value = isRanged ? [value0, value1] : value1;
    const [mode, setMode] = useState<'slider' | 'editing' | 'saved'>(() =>
      isInRange(value, range) ? 'slider' : 'saved'
    );
    const custom = mode !== 'slider';
    const scaleConfig = createSliderScale(
      focus0 === undefined || focus1 === undefined ? undefined : [focus0, focus1],
      focusWeight
    );
    const settingName = intl.formatMessage({
      id: labelId,
      defaultMessage: hasSettingLabel ? labelId : property
    });
    const displayedValue = Array.isArray(value) ? value.join(' – ') : String(value);
    const modeLabel = custom
      ? intl.formatMessage({id: 'layerVisConfigs.useSlider', defaultMessage: 'Use slider'})
      : intl.formatMessage({
          id: customInputLabel || 'layerVisConfigs.enterCustomValue',
          defaultMessage: customInputLabel || 'Enter custom value'
        });
    const accessibleModeLabel = intl.formatMessage(
      {id: 'layerVisConfigs.sliderAction', defaultMessage: '{action} for {setting}'},
      {action: modeLabel, setting: settingName}
    );

    const toggleMode = () => {
      if (custom) {
        const adjustedValue = isRanged
          ? [clamp(range, value0), clamp(range, value1)]
          : clamp(range, value1);
        onChange({[property]: adjustedValue});
      }
      setMode(custom ? 'slider' : 'editing');
    };

    return (
      <SidePanelSection disabled={Boolean(disabled)}>
        {showLabel ? (
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
              value={value as unknown as CustomInputProps['value']}
              onChangeCustomInput={v => onChange({[property]: v})}
              autoFocus={mode === 'editing'}
              disabled={disabled}
              ariaLabel={settingName}
            />
          ) : (
            <RangeSlider
              range={range}
              value0={isRanged ? value0 : range0}
              value1={value1}
              step={step}
              isRanged={Boolean(isRanged)}
              onChange={v => onChange({[property]: isRanged ? v : v[1]})}
              inputTheme={inputTheme}
              showInput={!allowCustomValue}
              scaleConfig={scaleConfig}
            />
          )}
          {allowCustomValue ? (
            <TippyTooltip
              placement="top"
              delay={[500, 0]}
              render={() => (
                <span role="tooltip">
                  {custom ? modeLabel : `${modeLabel} (${displayedValue})`}
                </span>
              )}
            >
              <ModeButton
                type="button"
                aria-label={accessibleModeLabel}
                aria-description={custom ? undefined : displayedValue}
                disabled={disabled}
                onClick={toggleMode}
              >
                {custom ? (
                  <Settings height="16px" aria-hidden="true" />
                ) : (
                  <>
                    <ValueReadout>{displayedValue}</ValueReadout>
                    <Pencil>
                      <Edit aria-hidden="true" />
                    </Pencil>
                  </>
                )}
              </ModeButton>
            </TippyTooltip>
          ) : null}
        </SliderRow>
      </SidePanelSection>
    );
  });

  const VisConfigSlider: React.FC<VisConfigSliderProps> = ({
    layer,
    label,
    range,
    focusRange,
    ...props
  }) => {
    // Layers and their settings can mutate in place. Read their current values before
    // the memo boundary, including individual range endpoints.
    const {id, config, visConfigSettings} = layer;
    const value = config.visConfig[props.property];
    const settingLabel = label || visConfigSettings[props.property]?.label;
    const labelId =
      typeof settingLabel === 'function'
        ? settingLabel(config)
        : settingLabel || `property.${props.property}`;

    return (
      <SliderControl
        {...props}
        id={id}
        labelId={labelId}
        showLabel={Boolean(label)}
        hasSettingLabel={Boolean(settingLabel)}
        value0={props.isRanged ? value[0] : range[0]}
        value1={props.isRanged ? value[1] : value}
        range0={range[0]}
        range1={range[1]}
        focus0={focusRange?.[0]}
        focus1={focusRange?.[1]}
      />
    );
  };

  return VisConfigSlider;
}
