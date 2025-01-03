// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled from 'styled-components';
import {useDismiss, useFloating, useInteractions} from '@floating-ui/react';

import {SPEED_CONTROL_RANGE, SPEED_CONTROL_STEP} from '@kepler.gl/constants';

import RangeSliderFactory from '../range-slider';

const SliderWrapper = styled.div`
  position: relative;
`;

const SpeedSliderContainer = styled.div`
  position: absolute;
  bottom: 50px;
  right: calc(0% - 32px);
  width: 180px;
  padding: 2px 8px 2px 12px;
  background-color: ${props => props.theme.bottomWidgetBgd};
  box-shadow: -2px -2px 0 0 rgba(0, 0, 0, 0.1);

  .kg-range-slider__input {
    width: 48px;
    padding: 6px;
  }
`;

AnimationSpeedSliderFactory.deps = [RangeSliderFactory];

interface AnimationSpeedSliderProps {
  onHide: () => void;
  speed: number;
  updateAnimationSpeed: (val: number) => void;
}

export default function AnimationSpeedSliderFactory(
  RangeSlider: ReturnType<typeof RangeSliderFactory>
): React.FC<AnimationSpeedSliderProps> {
  const AnimationSpeedSlider: React.FC<AnimationSpeedSliderProps> = ({
    onHide,
    speed,
    updateAnimationSpeed
  }: AnimationSpeedSliderProps) => {
    // floating-ui boilerplate to establish close on outside click
    const {refs, context} = useFloating({
      open: true,
      onOpenChange: v => {
        if (!v) {
          onHide();
        }
      }
    });
    const dismiss = useDismiss(context);
    const {getFloatingProps} = useInteractions([dismiss]);

    const onChange = useCallback(v => updateAnimationSpeed(v[1]), [updateAnimationSpeed]);

    return (
      <SpeedSliderContainer
        className="animation-control__speed-slider"
        ref={refs.setFloating}
        {...getFloatingProps()}
      >
        <SliderWrapper>
          <RangeSlider
            range={SPEED_CONTROL_RANGE}
            step={SPEED_CONTROL_STEP}
            value0={0}
            value1={speed}
            onChange={onChange}
            isRanged={false}
            showInput
            inputTheme="secondary"
            inputSize="tiny"
          />
        </SliderWrapper>
      </SpeedSliderContainer>
    );
  };
  return AnimationSpeedSlider;
}
