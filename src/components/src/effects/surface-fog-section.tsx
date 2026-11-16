// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {Effect, EffectUpdateProps} from '@kepler.gl/types';
import RangeSliderFactory from '../common/range-slider';
import EffectAnimationControl from './effect-animation-control';

export const ELEVATION_SECTION_TYPE = 'elevation-section';

const Section = styled.div.attrs({className: 'effect-configurator__pp-section'})`
  margin-bottom: 8px;
`;

const Title = styled.div`
  font-size: ${props => props.theme.inputFontSize};
  color: ${props => props.theme.effectPanelTextSecondary1};
`;

const SliderWrapper = styled.div`
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

export type SurfaceFogElevationSectionProps = {
  effect: Effect;
  updateEffectConfig: (
    e: Event | null | undefined,
    id: string,
    config: Partial<EffectUpdateProps>
  ) => void;
  RangeSlider: ReturnType<typeof RangeSliderFactory>;
};

SurfaceFogElevationSectionFactory.deps = [RangeSliderFactory];

export default function SurfaceFogElevationSectionFactory(
  RangeSlider: ReturnType<typeof RangeSliderFactory>
): React.FC<Omit<SurfaceFogElevationSectionProps, 'RangeSlider'>> {
  return function SurfaceFogElevationSection({effect, updateEffectConfig}) {
    const description = effect.getParameterDescriptions().find(d => d.name === 'height');
    if (!description) return null;
    const min = description.min ?? -200;
    const max = description.max ?? 6000;
    const step = max - min > 10 ? 1 : 0.001;
    return (
      <Section>
        <Title>
          Elevation
          <EffectAnimationControl
            effect={effect}
            name="height"
            RangeSlider={RangeSlider}
            step={step}
            updateEffectConfig={updateEffectConfig}
          />
        </Title>
        <SliderWrapper>
          <RangeSlider
            showInput
            isRanged={false}
            value0={min}
            value1={effect.parameters.height ?? description.defaultValue ?? 0}
            range={[min, max]}
            step={step}
            onChange={(value, event) =>
              updateEffectConfig(event, effect.id, {parameters: {height: value[1]}})
            }
          />
        </SliderWrapper>
      </Section>
    );
  };
}
