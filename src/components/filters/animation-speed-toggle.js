// Copyright (c) 2019 Uber Technologies, Inc.
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
import Slider from 'components/common/slider/slider';
import onClickOutside from 'react-onclickoutside';

const SliderWrapper = styled.div`
  position: relative;
  width: 20px;
  height: 120px;
  flex-direction: column;
  display: flex;
`;

const VerticalSliderContainer = styled.div`
  position: absolute;
  bottom: 10px;
  width: 40px;
  padding-left: 50px;
`;

class AnimationSpeedToggle extends Component {
  handleClickOutside = e => {
    this.props.onHide();
  };

  render() {
    const {updateAnimationSpeed, speed} = this.props;
    return (
      <VerticalSliderContainer>
        <SliderWrapper>
          <Slider
            minValue={0}
            maxValue={10}
            step={0.1}
            value1={speed}
            onSlider1Change={updateAnimationSpeed}
            isRanged={false}
            vertical
            showTooltip
          />
        </SliderWrapper>
      </VerticalSliderContainer>
    );
  }
}

export default onClickOutside(AnimationSpeedToggle);
