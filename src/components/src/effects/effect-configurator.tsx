import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';

import {LIGHT_AND_SHADOW_EFFECT} from '@kepler.gl/constants';
import {isNumber} from '@kepler.gl/utils';
import {Effect, EffectConfig} from '@kepler.gl/types';

import {PanelLabel} from '../common/styled-components';
import RangeSliderFactory from '../common/range-slider';
import ColorSelectorFactory from '../side-panel/layer-panel/color-selector';
import EffectTimeConfiguratorFactory from './effect-time-configurator';

export type EffectConfiguratorProps = {
  effect: Effect;
  updateEffectConfig: (
    e: Event | null | undefined,
    id: string,
    config: Partial<EffectConfig>
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
  const EffectConfigurator = ({effect, updateEffectConfig}: EffectConfiguratorProps) => {
    const renderShadowEffectConfigurator = useCallback(() => {
      const {config} = effect;

      const sliderProps = useMemo(() => {
        const propNames = ['shadowIntensity', 'ambientLightIntensity', 'sunLightIntensity'];
        return propNames.map(propName => {
          return {
            value1: effect.config.params[propName],
            range: [0, 1],
            value0: 0,
            onChange: (value: number[], e?: Event) => {
              updateEffectConfig(e, effect.id, {params: {[propName]: value[1]}});
            }
          };
        });
      }, [effect, config.params, updateEffectConfig]);

      const onDateTimeChange = useCallback(
        value => {
          updateEffectConfig(null, effect.id, {params: {timestamp: value}});
        },
        [effect, updateEffectConfig]
      );

      const onUseCurrentTimeChange = useCallback(
        value => {
          updateEffectConfig(null, effect.id, {
            params: {useCurrentTime: value}
          });
        },
        [effect, updateEffectConfig]
      );

      const colorPickerProps = useMemo(() => {
        const propNames = ['ambientLightColor', 'sunLightColor'];
        return propNames.map(propName => {
          return {
            colorSets: [
              {
                selectedColor: config.params[propName],
                setColor: v => updateEffectConfig(null, effect.id, {params: {[propName]: v}})
              }
            ]
          };
        });
      }, [effect, config.params, updateEffectConfig]);

      return (
        <StyledEffectConfigurator key={effect.id}>
          <PanelLabelWrapper>
            <PanelLabel>{'Date & Time'}</PanelLabel>
          </PanelLabelWrapper>
          <EffectTimeConfigurator
            timestamp={config.params.timestamp}
            onDateTimeChange={onDateTimeChange}
            useCurrentTime={config.params.useCurrentTime}
            onUseCurrentTimeChange={onUseCurrentTimeChange}
          />
          <PanelLabelWrapper>
            <PanelLabel>{'Shadow intensity'}</PanelLabel>
          </PanelLabelWrapper>
          <RangeSlider {...COMMON_SLIDER_PROPS} {...sliderProps[0]} />
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
    }, [effect, updateEffectConfig]);

    const renderPostProcessingEffectConfigurator = useCallback(() => {
      const {config} = effect;
      const uniforms = effect.deckEffect?.module.uniforms || {};
      const propNames = Object.keys(uniforms);

      const slidersForProps = useMemo(() => {
        return propNames.map(propName => {
          const uniform = uniforms[propName];
          if (!uniform || uniform.private) {
            return null;
          }

          const sliders: {
            value0: number;
            value1: number;
            range: [number, number];
            onChange: (value: number[], e?: Event) => void;
          }[] = [];
          const prevValue = config.params[propName];

          // the uniform is [0, 1] array
          if (uniform.length === 2) {
            sliders.push({
              value1: prevValue[0] || 0,
              range: [0, 1],
              value0: 0,
              onChange: (newValue, e) => {
                updateEffectConfig(e, effect.id, {
                  params: {[propName]: [newValue[1], prevValue[1]]}
                });
              }
            });

            sliders.push({
              value1: prevValue[1] || 0,
              range: [0, 1],
              value0: 0,
              onChange: (newValue, e) => {
                updateEffectConfig(e, effect.id, {
                  params: {[propName]: [prevValue[0], newValue[1]]}
                });
              }
            });
          }
          // the uniform plain number without any desc
          else if (isNumber(uniform)) {
            sliders.push({
              value1: prevValue || 0,
              range: [0, 500],
              value0: 0,
              onChange: (newValue, e) => {
                updateEffectConfig(e, effect.id, {params: {[propName]: newValue[1]}});
              }
            });
          }
          // the uniform description is {value: 0, min: 0, max: 1, ...}
          else if (isNumber(uniform.value)) {
            sliders.push({
              value1: prevValue || 0,
              range: [uniform.min ?? uniform.softMin ?? 0, uniform.max ?? uniform.softMax ?? 1],
              value0: uniform.min ?? uniform.softMin ?? 0,
              onChange: (newValue, e) => {
                updateEffectConfig(e, effect.id, {params: {[propName]: newValue[1]}});
              }
            });
          } else {
            return null;
          }

          return sliders;
        });
      }, [propNames, effect, effect.config.params, updateEffectConfig]);

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
    }, [effect, updateEffectConfig]);

    const {config} = effect;
    if (config.type === LIGHT_AND_SHADOW_EFFECT.type) return renderShadowEffectConfigurator();
    return renderPostProcessingEffectConfigurator();
  };

  return EffectConfigurator;
}
