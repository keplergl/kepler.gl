// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import {injectIntl, IntlShape} from 'react-intl';

import {LIGHT_AND_SHADOW_EFFECT} from '@kepler.gl/constants';
import {isNumber} from '@kepler.gl/utils';
import {Effect, EffectUpdateProps} from '@kepler.gl/types';

import RangeSliderFactory from '../common/range-slider';
import {ArrowDownSmall, VertThreeDots} from '../common/icons';
import {Tooltip} from '../common/styled-components';
import EffectTimeConfiguratorFactory from './effect-time-configurator';
import CompactColorPicker from './compact-color-picker';

export type EffectConfiguratorProps = {
  effect: Effect;
  updateEffectConfig: (
    e: Event | null | undefined,
    id: string,
    config: Partial<EffectUpdateProps>
  ) => void;
};

const StyledEffectConfigurator = styled.div.attrs({
  className: 'effect-panel__config'
})`
  position: relative;
  margin: ${props => props.theme.effectConfiguratorMargin};
  padding: ${props => props.theme.effectConfiguratorPadding};
`;

export const PanelLabelWrapper = styled.div.attrs({
  className: 'side-panel-panel__label-wrapper'
})`
  display: flex;
  align-items: self-start;
  margin-bottom: 11px;

  .side-panel-panel__label {
    margin-top: 2px;
    margin-bottom: 0px;
  }
`;

export const StyledColorSelectorWrapper = styled.div`
  margin-right: 5px;
  margin-left: 5px;
  margin-bottom: 6px;
  margin-top: 2px;
`;

const StyledVerticalSeparator = styled.div`
  height: 1px;
  background-color: ${props => props.theme.inputBgd};
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: -20px;
`;

type StyledWrapperProps = {
  marginBottom?: number;
};
const StyledWrapper = styled.div<StyledWrapperProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.marginBottom ?? 9}px;
`;

const StyledConfigSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.div`
  font-size: ${props => props.theme.inputFontSize};
  color: ${props => props.theme.effectPanelTextSecondary1};
  margin-bottom: 5px;
  text-transform: capitalize;
`;

const SectionSubTitle = styled.div`
  font-size: ${props => props.theme.inputFontSize};
  color: ${props => props.theme.effectPanelTextSecondary2};
  margin-bottom: 8px;
  margin-left: 6px;
`;

const StyleSliderWrapper = styled.div`
  align-self: flex-start;
  width: 199px;
  height: 32px;
  display: flex;
  align-items: center;
  .kg-range-slider__input {
    height: 32px;
    text-align: center;
    padding: 3px 6px;
  }
  .kg-slider {
    padding-left: 6px;
  }
  .kg-range-slider {
    padding: 0px !important;
  }
`;

const RegularOuterWrapper = styled.div.attrs({
  className: 'effect-configurator__pp-section'
})`
  margin-bottom: 8px;
`;

const RegularSectionTitleWrapper = styled.div.attrs({
  className: 'effect-configurator__pp-section-title'
})`
  font-size: ${props => props.theme.inputFontSize};
  color: ${props => props.theme.effectPanelTextSecondary1};
  text-transform: capitalize;
  margin-bottom: -3px;
`;

const RegularSliderWrapper = styled.div.attrs({
  className: 'effect-configurator__pp-section-control'
})`
  height: 32px;
  .kg-range-slider__input {
    height: 32px;
    text-align: center;
    padding: 3px 6px;
  }
  .kg-slider {
    padding-left: 6px;
  }
  .kg-range-slider {
    padding: 0px !important;
  }
`;

const StyledCheckboxWrapper = styled.div.attrs({
  className: 'effect-configurator__pp-section-checkbox'
})`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const StyledCheckbox = styled.input`
  margin-right: 6px;
  cursor: pointer;
  accent-color: ${props => props.theme.activeColor};
`;

const StyledCheckboxLabel = styled.label`
  font-size: ${props => props.theme.inputFontSize};
  color: ${props => props.theme.effectPanelTextSecondary1};
  cursor: pointer;
  white-space: nowrap;
`;

const StyledHintTooltip = styled(Tooltip)`
  &.__react_component_tooltip {
    max-width: 220px;
    white-space: normal;
    line-height: 1.4;
    text-align: left;
  }
`;

const StyledHintIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-left: 6px;
  border-radius: 50%;
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
  color: ${props => props.theme.labelColor};
  border: 1px solid ${props => props.theme.labelColor};
  cursor: help;
  &:hover {
    color: ${props => props.theme.textColorHl};
    border-color: ${props => props.theme.textColorHl};
  }
`;

const StyledCollapsibleSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 4px;
  &:hover {
    .effect-section__title {
      color: ${props => props.theme.textColorHl};
    }
    .effect-section__dots {
      color: ${props => props.theme.textColorHl};
    }
  }
`;

const StyledElevationSectionTitle = styled.div`
  border-left: ${props => props.theme.layerConfigGroupLabelBorderLeft} solid
    ${props => props.theme.labelColor};
  line-height: 12px;
  padding-left: ${props => props.theme.layerConfigGroupLabelPadding};
  font-size: ${props => props.theme.layerConfigGroupLabelLabelFontSize};
  color: ${props => props.theme.textColor};
  font-weight: 500;
  letter-spacing: 0.2px;
  text-transform: capitalize;
`;

const StyledDotsWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.textColor};
`;

const StyledCollapsibleContent = styled.div<{$collapsed: boolean}>`
  overflow: hidden;
  max-height: ${props => (props.$collapsed ? '0' : '200px')};
  transition: max-height 0.3s ease-out;
`;

const StyledDisabledSlider = styled.div<{$disabled: boolean}>`
  ${props =>
    props.$disabled
      ? `
    opacity: 0.3;
    pointer-events: none;
  `
      : ''}
`;

const StyledColorCheckboxRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const COMMON_SLIDER_PROPS = {
  showInput: true,
  isRanged: false,
  step: 0.001,
  label: 'value'
};

type EffectParameterDescriptionFlattened = {
  name: string;
  type?: 'number' | 'array' | 'color' | 'checkbox';
  label?: string | false | (string | false)[];
  min: number;
  max: number;
  defaultValue?: number | number[] | boolean;
  index?: number;
};

EffectConfiguratorFactory.deps = [RangeSliderFactory, EffectTimeConfiguratorFactory];

export default function EffectConfiguratorFactory(
  RangeSlider: ReturnType<typeof RangeSliderFactory>,
  EffectTimeConfigurator: ReturnType<typeof EffectTimeConfiguratorFactory>
): React.FC<EffectConfiguratorProps> {
  const ShadowEffectConfigurator: React.FC<EffectConfiguratorProps> = ({
    effect,
    updateEffectConfig
  }) => {
    const {parameters, id} = effect;

    const sliderProps = useMemo(() => {
      const propNames = ['shadowIntensity', 'ambientLightIntensity', 'sunLightIntensity'];
      const descriptions = effect.getParameterDescriptions();
      return propNames.map(propName => {
        const desc = descriptions.find(d => d.name === propName);
        const min = desc?.min ?? 0;
        const max = desc?.max ?? 1;
        return {
          value1: parameters[propName],
          range: [min, max],
          value0: min,
          onChange: (value: number[], event?: Event | null) => {
            updateEffectConfig(event, id, {parameters: {[propName]: value[1]}});
          }
        };
      });
    }, [id, effect, parameters, updateEffectConfig]);

    const onTimeParametersChanged = useCallback(
      parameters => {
        updateEffectConfig(null, id, {
          parameters: {
            ...(parameters.timestamp ? {timestamp: parameters.timestamp} : null),
            ...(parameters.timezone ? {timezone: parameters.timezone} : null),
            ...(parameters.timeMode ? {timeMode: parameters.timeMode} : null)
          }
        });
      },
      [id, updateEffectConfig]
    );

    const colorPickerProps = useMemo(() => {
      const propNames = ['ambientLightColor', 'sunLightColor', 'shadowColor'];
      return propNames.map(propName => {
        return {
          colorSets: [
            {
              selectedColor: parameters[propName],
              setColor: v => updateEffectConfig(null, id, {parameters: {[propName]: v}})
            }
          ]
        };
      });
    }, [id, parameters, updateEffectConfig]);

    return (
      <StyledEffectConfigurator key={effect.id}>
        <PanelLabelWrapper>
          <SectionTitle>{'Date & Time'}</SectionTitle>
        </PanelLabelWrapper>
        <EffectTimeConfigurator
          timestamp={parameters.timestamp}
          timezone={parameters.timezone}
          timeMode={parameters.timeMode}
          onChange={onTimeParametersChanged}
        />

        <StyledVerticalSeparator />

        <StyledWrapper marginBottom={0}>
          <SectionTitle>{'Shadow'}</SectionTitle>
        </StyledWrapper>
        <StyledWrapper marginBottom={16}>
          <CompactColorPicker
            label={'Color'}
            color={colorPickerProps[2].colorSets[0].selectedColor}
            onSetColor={colorPickerProps[2].colorSets[0].setColor}
            Icon={ArrowDownSmall}
          />
          <StyledConfigSection>
            <SectionSubTitle>Intensity</SectionSubTitle>
            <StyleSliderWrapper>
              <RangeSlider {...COMMON_SLIDER_PROPS} {...sliderProps[0]} />
            </StyleSliderWrapper>
          </StyledConfigSection>
        </StyledWrapper>

        <StyledWrapper marginBottom={0}>
          <SectionTitle>{'Ambient light'}</SectionTitle>
        </StyledWrapper>
        <StyledWrapper marginBottom={16}>
          <CompactColorPicker
            label={'Color'}
            color={colorPickerProps[0].colorSets[0].selectedColor}
            onSetColor={colorPickerProps[0].colorSets[0].setColor}
            Icon={ArrowDownSmall}
          />
          <StyledConfigSection>
            <SectionSubTitle>Intensity</SectionSubTitle>
            <StyleSliderWrapper>
              <RangeSlider {...COMMON_SLIDER_PROPS} {...sliderProps[1]} />
            </StyleSliderWrapper>
          </StyledConfigSection>
        </StyledWrapper>

        <StyledWrapper marginBottom={0}>
          <SectionTitle>{'Sun light'}</SectionTitle>
        </StyledWrapper>
        <StyledWrapper marginBottom={0}>
          <CompactColorPicker
            label={'Color'}
            color={colorPickerProps[1].colorSets[0].selectedColor}
            onSetColor={colorPickerProps[1].colorSets[0].setColor}
            Icon={ArrowDownSmall}
          />
          <StyledConfigSection>
            <SectionSubTitle>Intensity</SectionSubTitle>
            <StyleSliderWrapper>
              <RangeSlider {...COMMON_SLIDER_PROPS} {...sliderProps[2]} />
            </StyleSliderWrapper>
          </StyledConfigSection>
        </StyledWrapper>
      </StyledEffectConfigurator>
    );
  };
  const defaultUniforms = {};

  const PostProcessingEffectConfigurator: React.FC<EffectConfiguratorProps> = ({
    effect,
    updateEffectConfig
  }) => {
    const uniforms = effect.deckEffect?.module.propTypes || defaultUniforms;
    const parameterDescriptions = effect.getParameterDescriptions();
    const {parameters, id} = effect;

    const isAnimateHeight = Boolean(parameters.animateHeight);

    const flatParameterDescriptions = useMemo(() => {
      return parameterDescriptions.reduce((acc, description) => {
        if (
          description.name === 'heightEnd' ||
          description.name === 'animateHeight' ||
          description.name === 'linearEasing'
        )
          return acc;

        if (description.type === 'color') {
          acc.push(description);
        } else if (description.type === 'array') {
          if (Array.isArray(description.defaultValue)) {
            description.defaultValue.forEach((_, index) => {
              acc.push({
                ...description,
                index,
                label: description.label?.[index]
              });
            });
          }
        } else {
          acc.push(description);
        }

        return acc;
      }, [] as EffectParameterDescriptionFlattened[]);
    }, [parameterDescriptions]);

    const heightEndDesc = parameterDescriptions.find(d => d.name === 'heightEnd');
    const hasAnimateHeight = parameterDescriptions.some(d => d.name === 'animateHeight');
    const hasLinearEasing = parameterDescriptions.some(d => d.name === 'linearEasing');

    const controls = useMemo(() => {
      return flatParameterDescriptions.map(desc => {
        if (desc.type === 'color') {
          return {
            isColor: true as const,
            label: desc.label || desc.name,
            paramName: desc.name,
            color: parameters[desc.name] || desc.defaultValue || [255, 255, 255],
            onSetColor: (v: [number, number, number]) =>
              updateEffectConfig(null, id, {parameters: {[desc.name]: v}})
          };
        }

        if (desc.type === 'checkbox') {
          const label =
            desc.name === 'pattern'
              ? 'Pattern'
              : typeof desc.label === 'string'
              ? desc.label
              : desc.name;
          const tooltip =
            desc.name === 'pattern'
              ? 'Adds a noise pattern to the fog for a more natural, volumetric look.'
              : undefined;
          return {
            isCheckbox: true as const,
            label,
            paramName: desc.name,
            checked: Boolean(parameters[desc.name]),
            tooltip,
            onChange: () =>
              updateEffectConfig(null, id, {parameters: {[desc.name]: !parameters[desc.name]}})
          };
        }

        const paramName = desc.name;

        // Elevation section: main slider + collapsible animate checkbox + end slider
        if (paramName === 'height' && hasAnimateHeight && heightEndDesc) {
          const rangeMin = desc.min ?? -200;
          const rangeMax = desc.max ?? 3000;
          const rangeSpan = rangeMax - rangeMin;
          const step = rangeSpan > 10 ? 1 : 0.001;

          const endMin = heightEndDesc.min ?? rangeMin;
          const endMax = heightEndDesc.max ?? rangeMax;
          const endSpan = endMax - endMin;
          const endStep = endSpan > 10 ? 1 : 0.001;

          return {
            isElevationSection: true as const,
            label: desc.label || desc.name,
            value1: parameters.height ?? desc.defaultValue ?? 0,
            value0: rangeMin,
            range: [rangeMin, rangeMax] as [number, number],
            step,
            onChange: (newValue: number[], event?: Event | null) => {
              updateEffectConfig(event, id, {parameters: {height: newValue[1]}});
            },
            animateChecked: isAnimateHeight,
            onAnimateChange: () => {
              const enabling = !parameters.animateHeight;
              const currentEnd = parameters.heightEnd ?? heightEndDesc.max ?? rangeMax;
              const currentHeight = parameters.height ?? desc.defaultValue ?? 0;
              const updatedParams: Record<string, any> = {animateHeight: enabling};
              if (enabling && Math.abs(currentEnd - currentHeight) < 10) {
                updatedParams.heightEnd = rangeMax;
              }
              updateEffectConfig(null, id, {parameters: updatedParams});
            },
            endValue1: parameters.heightEnd ?? heightEndDesc.defaultValue ?? endMax,
            endValue0: endMin,
            endRange: [endMin, endMax] as [number, number],
            endStep,
            onEndChange: (newValue: number[], event?: Event | null) => {
              updateEffectConfig(event, id, {parameters: {heightEnd: newValue[1]}});
            },
            linearEasingChecked: Boolean(parameters.linearEasing),
            hasLinearEasing,
            onLinearEasingChange: () => {
              updateEffectConfig(null, id, {parameters: {linearEasing: !parameters.linearEasing}});
            }
          };
        }

        const rawUniform = uniforms[desc.name];
        if (rawUniform && rawUniform.private) {
          return null;
        }

        // luma.gl 9 wraps array propTypes as {value: [...]}
        const uniform =
          rawUniform && typeof rawUniform === 'object' && Array.isArray(rawUniform.value)
            ? rawUniform.value
            : rawUniform;

        const prevValue = parameters[paramName];

        const label = desc.label === false ? false : desc.label || desc.name;

        // the uniform is [number, number] array
        if (Array.isArray(uniform) && uniform.length === 2) {
          return {
            label,
            value1: prevValue[desc.index || 0] || 0,
            range: [0, 1],
            value0: 0,
            onChange: (newValue: number[], event) => {
              updateEffectConfig(event, id, {
                parameters: {
                  [paramName]:
                    desc.index === 0 ? [newValue[1], prevValue[1]] : [prevValue[0], newValue[1]]
                }
              });
            }
          };
        }
        // the uniform is a plain number without any description
        else if (isNumber(uniform)) {
          return {
            label,
            value1: prevValue ?? 0,
            range: [desc.min ?? 0, desc.max ?? 500],
            value0: desc.min ?? 0,
            onChange: (newValue: number[], event) => {
              updateEffectConfig(event, id, {parameters: {[paramName]: newValue[1]}});
            }
          };
        }
        // the uniform description is {value: 0, min: 0, max: 1, ...}
        else if (uniform && isNumber(uniform.value)) {
          const rangeMin = desc.min ?? uniform.min ?? uniform.softMin ?? 0;
          const rangeMax = desc.max ?? uniform.max ?? uniform.softMax ?? 1;
          const rangeSpan = rangeMax - rangeMin;
          const step = rangeSpan > 10 ? 1 : 0.001;
          return {
            label,
            value1: prevValue || 0,
            range: [rangeMin, rangeMax],
            value0: rangeMin,
            step,
            onChange: (newValue: number[], event) => {
              updateEffectConfig(event, id, {parameters: {[paramName]: newValue[1]}});
            }
          };
        }
        // Parameter defined in effect description but not in shader propTypes
        // (e.g. user-facing props that the effect maps to different GLSL uniforms)
        else if (desc.min !== undefined && desc.max !== undefined) {
          const rangeSpan = desc.max - desc.min;
          const step = rangeSpan > 10 ? 1 : 0.001;
          return {
            label,
            value1: prevValue ?? desc.defaultValue ?? 0,
            range: [desc.min, desc.max],
            value0: desc.min,
            step,
            onChange: (newValue: number[], event) => {
              updateEffectConfig(event, id, {parameters: {[paramName]: newValue[1]}});
            }
          };
        }

        // ignore everything else for now
        return null;
      });
    }, [
      flatParameterDescriptions,
      id,
      parameters,
      updateEffectConfig,
      uniforms,
      isAnimateHeight,
      hasAnimateHeight,
      heightEndDesc,
      hasLinearEasing
    ]);

    const [elevationExpanded, setElevationExpanded] = useState(false);
    const onToggleElevationExpanded = useCallback(() => {
      setElevationExpanded(prev => !prev);
    }, []);

    return (
      <StyledEffectConfigurator key={effect.id}>
        {(() => {
          const elements: React.ReactNode[] = [];
          let i = 0;
          while (i < flatParameterDescriptions.length) {
            const control = controls[i];
            if (!control) {
              i++;
              continue;
            }

            if ('isColor' in control) {
              const nextControl = i + 1 < controls.length ? controls[i + 1] : null;
              if (nextControl && 'isCheckbox' in nextControl) {
                const cbTooltipId = nextControl.tooltip
                  ? `effect-cb-hint-${effect.id}-${i}`
                  : undefined;
                elements.push(
                  <StyledColorCheckboxRow key={`${effect.id}-${i}`}>
                    <CompactColorPicker
                      label={typeof control.label === 'string' ? control.label : 'Color'}
                      color={control.color}
                      onSetColor={
                        control.onSetColor ??
                        (() => {
                          /* noop */
                        })
                      }
                      Icon={ArrowDownSmall}
                    />
                    <StyledCheckboxWrapper
                      onClick={() => (nextControl as {onChange: () => void}).onChange()}
                    >
                      <StyledCheckbox
                        type="checkbox"
                        checked={nextControl.checked}
                        onChange={() => (nextControl as {onChange: () => void}).onChange()}
                        onClick={e => e.stopPropagation()}
                      />
                      <StyledCheckboxLabel>{nextControl.label}</StyledCheckboxLabel>
                      {nextControl.tooltip ? (
                        <>
                          <StyledHintIcon
                            data-tip
                            data-for={cbTooltipId}
                            onClick={e => e.stopPropagation()}
                          >
                            ?
                          </StyledHintIcon>
                          <StyledHintTooltip id={cbTooltipId} effect="solid" delayShow={200}>
                            {nextControl.tooltip}
                          </StyledHintTooltip>
                        </>
                      ) : null}
                    </StyledCheckboxWrapper>
                  </StyledColorCheckboxRow>
                );
                i += 2;
                continue;
              }

              elements.push(
                <RegularOuterWrapper key={`${effect.id}-${i}`}>
                  <CompactColorPicker
                    label={typeof control.label === 'string' ? control.label : 'Color'}
                    color={control.color}
                    onSetColor={
                      control.onSetColor ??
                      (() => {
                        /* noop */
                      })
                    }
                    Icon={ArrowDownSmall}
                  />
                </RegularOuterWrapper>
              );
              i++;
              continue;
            }

            if ('isElevationSection' in control) {
              const tooltipId = `effect-elevation-hint-${effect.id}`;
              elements.push(
                <RegularOuterWrapper key={`${effect.id}-${i}`}>
                  <StyledCollapsibleSectionHeader onClick={onToggleElevationExpanded}>
                    <StyledElevationSectionTitle className="effect-section__title">
                      Elevation
                    </StyledElevationSectionTitle>
                    <StyledDotsWrapper className="effect-section__dots">
                      <VertThreeDots height="18px" />
                    </StyledDotsWrapper>
                  </StyledCollapsibleSectionHeader>
                  <RegularSliderWrapper>
                    <RangeSlider
                      {...COMMON_SLIDER_PROPS}
                      value1={control.value1 as number}
                      value0={control.value0 as number}
                      range={control.range}
                      step={control.step}
                      onChange={control.onChange}
                    />
                  </RegularSliderWrapper>
                  <StyledCollapsibleContent $collapsed={!elevationExpanded}>
                    <RegularOuterWrapper style={{marginTop: 8}}>
                      <StyledCheckboxWrapper onClick={control.onAnimateChange}>
                        <StyledCheckbox
                          type="checkbox"
                          checked={control.animateChecked}
                          onChange={control.onAnimateChange}
                          onClick={e => e.stopPropagation()}
                        />
                        <StyledCheckboxLabel>Animate elevation</StyledCheckboxLabel>
                        <StyledHintIcon
                          data-tip
                          data-for={tooltipId}
                          onClick={e => e.stopPropagation()}
                        >
                          ?
                        </StyledHintIcon>
                        <StyledHintTooltip id={tooltipId} effect="solid" delayShow={200}>
                          Animates elevation from start to end value during video export preview and
                          recording.
                        </StyledHintTooltip>
                      </StyledCheckboxWrapper>
                    </RegularOuterWrapper>
                    <StyledDisabledSlider $disabled={!control.animateChecked}>
                      <RegularSectionTitleWrapper>End elevation</RegularSectionTitleWrapper>
                      <RegularSliderWrapper>
                        <RangeSlider
                          {...COMMON_SLIDER_PROPS}
                          value1={control.endValue1 as number}
                          value0={control.endValue0 as number}
                          range={control.endRange}
                          step={control.endStep}
                          onChange={control.onEndChange}
                        />
                      </RegularSliderWrapper>
                    </StyledDisabledSlider>
                    {control.hasLinearEasing ? (
                      <StyledDisabledSlider $disabled={!control.animateChecked}>
                        <RegularOuterWrapper style={{marginTop: 4}}>
                          <StyledCheckboxWrapper onClick={control.onLinearEasingChange}>
                            <StyledCheckbox
                              type="checkbox"
                              checked={control.linearEasingChecked}
                              onChange={control.onLinearEasingChange}
                              onClick={e => e.stopPropagation()}
                            />
                            <StyledCheckboxLabel>Linear easing</StyledCheckboxLabel>
                            <StyledHintIcon
                              data-tip
                              data-for={`effect-linear-hint-${effect.id}`}
                              onClick={e => e.stopPropagation()}
                            >
                              ?
                            </StyledHintIcon>
                            <StyledHintTooltip
                              id={`effect-linear-hint-${effect.id}`}
                              effect="solid"
                              delayShow={200}
                            >
                              Uses constant speed instead of smooth ease-in / ease-out during
                              elevation animation.
                            </StyledHintTooltip>
                          </StyledCheckboxWrapper>
                        </RegularOuterWrapper>
                      </StyledDisabledSlider>
                    ) : null}
                  </StyledCollapsibleContent>
                </RegularOuterWrapper>
              );
              i++;
              continue;
            }

            if ('isCheckbox' in control) {
              elements.push(
                <RegularOuterWrapper key={`${effect.id}-${i}`}>
                  <StyledCheckboxWrapper
                    onClick={() => (control as {onChange: () => void}).onChange()}
                  >
                    <StyledCheckbox
                      type="checkbox"
                      checked={control.checked}
                      onChange={() => (control as {onChange: () => void}).onChange()}
                      onClick={e => e.stopPropagation()}
                    />
                    <StyledCheckboxLabel>{control.label}</StyledCheckboxLabel>
                  </StyledCheckboxWrapper>
                </RegularOuterWrapper>
              );
              i++;
              continue;
            }

            elements.push(
              <RegularOuterWrapper key={`${effect.id}-${i}`}>
                {control.label ? (
                  <RegularSectionTitleWrapper>{control.label}</RegularSectionTitleWrapper>
                ) : null}
                <RegularSliderWrapper>
                  <RangeSlider key={i} {...COMMON_SLIDER_PROPS} {...control} />
                </RegularSliderWrapper>
              </RegularOuterWrapper>
            );
            i++;
          }
          return elements;
        })()}
      </StyledEffectConfigurator>
    );
  };

  const EffectConfigurator = ({
    effect,
    updateEffectConfig
  }: EffectConfiguratorProps & {intl: IntlShape}) => {
    return effect.type === LIGHT_AND_SHADOW_EFFECT.type ? (
      <ShadowEffectConfigurator effect={effect} updateEffectConfig={updateEffectConfig} />
    ) : (
      <PostProcessingEffectConfigurator effect={effect} updateEffectConfig={updateEffectConfig} />
    );
  };

  return injectIntl(EffectConfigurator);
}
