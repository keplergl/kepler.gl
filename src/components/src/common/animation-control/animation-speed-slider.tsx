// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, ComponentType} from 'react';
import styled from 'styled-components';
import RangeSliderFactory from '../range-slider';
import onClickOutside from 'react-onclickoutside';
import {SPEED_CONTROL_RANGE, SPEED_CONTROL_STEP} from '@kepler.gl/constants';

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
): ComponentType<AnimationSpeedSliderProps> {
  class AnimationSpeedSlider extends Component<AnimationSpeedSliderProps> {
    handleClickOutside = e => {
      this.props.onHide();
    };

    _onChange = v => this.props.updateAnimationSpeed(v[1]);

    render() {
      return (
        <SpeedSliderContainer className="animation-control__speed-slider">
          <SliderWrapper>
            <RangeSlider
              range={SPEED_CONTROL_RANGE}
              step={SPEED_CONTROL_STEP}
              value0={0}
              value1={this.props.speed}
              onChange={this._onChange}
              isRanged={false}
              showInput
              inputTheme="secondary"
              inputSize="tiny"
            />
          </SliderWrapper>
        </SpeedSliderContainer>
      );
    }
  }

  return onClickOutside(AnimationSpeedSlider);
}
