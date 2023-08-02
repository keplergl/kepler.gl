import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {injectIntl, IntlShape} from 'react-intl';

import {LIGHT_AND_SHADOW_EFFECT} from '@kepler.gl/constants';
import {isNumber} from '@kepler.gl/utils';
import {Effect, EffectUpdateProps} from '@kepler.gl/types';

import {PanelLabel} from '../common/styled-components';
import RangeSliderFactory from '../common/range-slider';
import ColorSelectorFactory from '../side-panel/layer-panel/color-selector';
import EffectTimeConfiguratorFactory from './effect-time-configurator';

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
  margin-top: ${props => props.theme.effectConfiguratorMargin};
  padding: ${props => props.theme.effectConfiguratorPadding};
`;

export const PanelLabelWrapper = styled.div.attrs({
  className: 'side-panel-panel__label-wrapper'
})`
  display: flex;
  align-items: self-start;

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

const COMMON_SLIDER_PROPS = {
  showInput: true,
  isRanged: false,
  step: 0.001,
  label: 'value'
};

EffectConfiguratorFactory.deps = [
  RangeSliderFactory,
  ColorSelectorFactory,
  EffectTimeConfiguratorFactory
];

export default function EffectConfiguratorFactory(
  RangeSlider: ReturnType<typeof RangeSliderFactory>,
  ColorSelector: ReturnType<typeof ColorSelectorFactory>,
  EffectTimeConfigurator: ReturnType<typeof EffectTimeConfiguratorFactory>
): React.FC<EffectConfiguratorProps> {
  const EffectConfigurator = ({
    effect,
    updateEffectConfig
  }: EffectConfiguratorProps & {intl: IntlShape}) => {
    const renderShadowEffectConfigurator = useCallback(() => {
      const {parameters} = effect;

      const sliderProps = useMemo(() => {
        const propNames = ['shadowIntensity', 'ambientLightIntensity', 'sunLightIntensity'];
        return propNames.map(propName => {
          return {
            value1: parameters[propName],
            range: [0, 1],
            value0: 0,
            onChange: (value: number[], event?: Event) => {
              updateEffectConfig(event, effect.id, {parameters: {[propName]: value[1]}});
            }
          };
        });
      }, [effect.id, parameters, updateEffectConfig]);

      const onDateTimeChange = useCallback(
        value => {
          updateEffectConfig(null, effect.id, {parameters: {timestamp: value}});
        },
        [effect.id, updateEffectConfig]
      );

      const onTimeModeChange = useCallback(
        value => {
          updateEffectConfig(null, effect.id, {
            parameters: {timeMode: value}
          });
        },
        [effect.id, updateEffectConfig]
      );

      const colorPickerProps = useMemo(() => {
        const propNames = ['ambientLightColor', 'sunLightColor', 'shadowColor'];
        return propNames.map(propName => {
          return {
            colorSets: [
              {
                selectedColor: parameters[propName],
                setColor: v => updateEffectConfig(null, effect.id, {parameters: {[propName]: v}})
              }
            ]
          };
        });
      }, [effect.id, parameters, updateEffectConfig]);

      return (
        <StyledEffectConfigurator key={effect.id}>
          <PanelLabelWrapper>
            <PanelLabel>{'Date & Time'}</PanelLabel>
          </PanelLabelWrapper>
          <EffectTimeConfigurator
            timestamp={parameters.timestamp}
            onDateTimeChange={onDateTimeChange}
            timeMode={parameters.timeMode}
            onTimeModeChange={onTimeModeChange}
          />
          <PanelLabelWrapper>
            <PanelLabel>{'Shadow intensity'}</PanelLabel>
          </PanelLabelWrapper>
          <RangeSlider {...COMMON_SLIDER_PROPS} {...sliderProps[0]} />
          <PanelLabelWrapper>
            <PanelLabel>{'Shadow color'}</PanelLabel>
          </PanelLabelWrapper>
          <StyledColorSelectorWrapper>
            <ColorSelector {...colorPickerProps[2]} />
          </StyledColorSelectorWrapper>
          <PanelLabelWrapper>
            <PanelLabel>{'Ambient light intensity'}</PanelLabel>
          </PanelLabelWrapper>
          <RangeSlider {...COMMON_SLIDER_PROPS} {...sliderProps[1]} />
          <PanelLabelWrapper>
            <PanelLabel>{'Ambient light color'}</PanelLabel>
          </PanelLabelWrapper>
          <StyledColorSelectorWrapper>
            <ColorSelector {...colorPickerProps[0]} />
          </StyledColorSelectorWrapper>
          <PanelLabelWrapper>
            <PanelLabel>{'Sun light intensity'}</PanelLabel>
          </PanelLabelWrapper>
          <RangeSlider {...COMMON_SLIDER_PROPS} {...sliderProps[2]} />
          <PanelLabelWrapper>
            <PanelLabel>{'Sun light color'}</PanelLabel>
          </PanelLabelWrapper>
          <StyledColorSelectorWrapper>
            <ColorSelector {...colorPickerProps[1]} />
          </StyledColorSelectorWrapper>
        </StyledEffectConfigurator>
      );
    }, [effect, effect.parameters, updateEffectConfig]);

    const renderPostProcessingEffectConfigurator = useCallback(() => {
      const uniforms = effect.deckEffect?.module.uniforms || {};
      const propNames = useMemo(() => Object.keys(uniforms), [uniforms]);

      const slidersForProps = useMemo(() => {
        return propNames.map(propName => {
          const uniform = uniforms[propName];
          if ((!uniform && uniform !== 0) || uniform.private) {
            return null;
          }

          const sliders: {
            value0: number;
            value1: number;
            range: [number, number];
            onChange: (value: number[], e?: Event) => void;
          }[] = [];
          const prevValue = effect.parameters[propName];

          // the uniform is [0, 1] array
          if (uniform.length === 2) {
            sliders.push({
              value1: prevValue[0] || 0,
              range: [0, 1],
              value0: 0,
              onChange: (newValue, event) => {
                updateEffectConfig(event, effect.id, {
                  parameters: {[propName]: [newValue[1], prevValue[1]]}
                });
              }
            });

            sliders.push({
              value1: prevValue[1] || 0,
              range: [0, 1],
              value0: 0,
              onChange: (newValue, event) => {
                updateEffectConfig(event, effect.id, {
                  parameters: {[propName]: [prevValue[0], newValue[1]]}
                });
              }
            });
          }
          // the uniform is a plain number without any description
          else if (isNumber(uniform)) {
            sliders.push({
              value1: prevValue || 0,
              range: [0, 500],
              value0: 0,
              onChange: (newValue, event) => {
                updateEffectConfig(event, effect.id, {parameters: {[propName]: newValue[1]}});
              }
            });
          }
          // the uniform description is {value: 0, min: 0, max: 1, ...}
          else if (isNumber(uniform.value)) {
            sliders.push({
              value1: prevValue || 0,
              range: [uniform.min ?? uniform.softMin ?? 0, uniform.max ?? uniform.softMax ?? 1],
              value0: uniform.min ?? uniform.softMin ?? 0,
              onChange: (newValue, event) => {
                updateEffectConfig(event, effect.id, {parameters: {[propName]: newValue[1]}});
              }
            });
          } else {
            return null;
          }

          return sliders;
        });
      }, [propNames, effect, effect.parameters, updateEffectConfig]);

      return (
        <StyledEffectConfigurator key={effect.id}>
          {propNames.map((propName, uniformIndex) => {
            const slidersForProp = slidersForProps[uniformIndex];
            if (!slidersForProp) {
              return null;
            }

            return (
              <div key={`${effect.id}-${uniformIndex}`}>
                <PanelLabelWrapper>
                  <PanelLabel>{propName}</PanelLabel>
                </PanelLabelWrapper>
                {slidersForProp.map((sliderProp, sliderIndex) => {
                  return <RangeSlider key={sliderIndex} {...COMMON_SLIDER_PROPS} {...sliderProp} />;
                })}
              </div>
            );
          })}
        </StyledEffectConfigurator>
      );
    }, [effect, effect.parameters, updateEffectConfig]);

    if (effect.type === LIGHT_AND_SHADOW_EFFECT.type) return renderShadowEffectConfigurator();
    return renderPostProcessingEffectConfigurator();
  };

  return injectIntl(EffectConfigurator);
}
