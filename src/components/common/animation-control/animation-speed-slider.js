// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {Component} from 'react';
import styled from 'styled-components';
import RangeSliderFactory from 'components/common/range-slider';
import onClickOutside from 'react-onclickoutside';
import {SPEED_CONTROL_RANGE, SPEED_CONTROL_STEP} from 'constants/default-settings';

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

export default function AnimationSpeedSliderFactory(RangeSlider) {
  class AnimationSpeedSlider extends Component {
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
              showTooltip
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
