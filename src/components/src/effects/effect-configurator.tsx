// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {injectIntl, IntlShape} from 'react-intl';

import {LIGHT_AND_SHADOW_EFFECT} from '@kepler.gl/constants';
import {isNumber} from '@kepler.gl/utils';
import {Effect, EffectUpdateProps} from '@kepler.gl/types';

import RangeSliderFactory from '../common/range-slider';
import {ArrowDownSmall} from '../common/icons';
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
      return propNames.map(propName => {
        return {
          value1: parameters[propName],
          range: [0, 1],
          value0: 0,
          onChange: (value: number[], event?: Event | null) => {
            updateEffectConfig(event, id, {parameters: {[propName]: value[1]}});
          }
        };
      });
    }, [id, parameters, updateEffectConfig]);

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
    const flatParameterDescriptions = useMemo(() => {
      return parameterDescriptions.reduce((acc, description) => {
        if (description.type === 'color') {
          // color parameters are rendered separately via CompactColorPicker
          acc.push(description);
        } else if (description.type === 'array') {
          // split arrays of controls into a separate controls for each component
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
          return {
            isCheckbox: true as const,
            label: typeof desc.label === 'string' ? desc.label : desc.name,
            paramName: desc.name,
            checked: Boolean(parameters[desc.name]),
            onChange: () =>
              updateEffectConfig(null, id, {parameters: {[desc.name]: !parameters[desc.name]}})
          };
        }

        const paramName = desc.name;

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
    }, [flatParameterDescriptions, id, parameters, updateEffectConfig, uniforms]);

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
