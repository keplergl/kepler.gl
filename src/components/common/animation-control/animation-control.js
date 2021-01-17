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

import React, {useCallback} from 'react';
import styled from 'styled-components';
import moment from 'moment';

import Slider from 'components/common/slider/slider';
import {BottomWidgetInner} from 'components/common/styled-components';
import PlaybackControlsFactory from './playback-controls';
import FloatingTimeDisplayFactory from './floating-time-display';
import {snapToMarks} from 'utils/data-utils';
import {DEFAULT_TIME_FORMAT} from 'constants/default-settings';

const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
  margin-right: 24px;
  margin-left: 24px;
`;

const AnimationWidgetInner = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 32px;

  .playback-controls {
    margin-left: -8px;
    margin-right: 16px;
  }
`;

const StyledDomain = styled.div`
  color: ${props => props.theme.titleTextColor};
  font-weight: 400;
  font-size: 10px;
`;

AnimationControlFactory.deps = [PlaybackControlsFactory, FloatingTimeDisplayFactory];

function AnimationControlFactory(PlaybackControls, FloatingTimeDisplay) {
  const AnimationControl = ({
    isAnimatable,
    animationControlProps,
    toggleAnimation,
    setLayerAnimationTime,
    updateAnimationSpeed,
    animationConfig
  }) => {
    const {currentTime, domain, speed, step, timeSteps} = animationConfig;
    const onSlider1Change = useCallback(
      val => {
        if (Array.isArray(timeSteps)) {
          setLayerAnimationTime(snapToMarks(val, timeSteps));

          // TODO: merge slider in to avoid this step
        } else if (val >= domain[0] && val <= domain[1]) {
          setLayerAnimationTime(val);
        }
      },
      [domain, timeSteps, setLayerAnimationTime]
    );

    return (
      <BottomWidgetInner className="bottom-widget--inner">
        <AnimationWidgetInner className="animation-widget--inner">
          <PlaybackControls
            className="animation-control-playpause"
            startAnimation={toggleAnimation}
            isAnimating={animationControlProps.isAnimating}
            pauseAnimation={toggleAnimation}
            resetAnimation={animationControlProps.reset}
            speed={speed}
            isAnimatable={isAnimatable}
            updateAnimationSpeed={updateAnimationSpeed}
          />
          <StyledDomain className="animation-control__time-domain">
            <span>{domain ? moment.utc(domain[0]).format(DEFAULT_TIME_FORMAT) : ''}</span>
          </StyledDomain>
          <SliderWrapper className="animation-control__slider">
            <Slider
              showValues={false}
              isRanged={false}
              step={step}
              minValue={domain ? domain[0] : 0}
              maxValue={domain ? domain[1] : 1}
              value1={currentTime}
              onSlider1Change={onSlider1Change}
              enableBarDrag={true}
            />
          </SliderWrapper>
          <StyledDomain className="animation-control__time-domain">
            <span>{domain ? moment.utc(domain[1]).format(DEFAULT_TIME_FORMAT) : ''}</span>
          </StyledDomain>
        </AnimationWidgetInner>
        <FloatingTimeDisplay currentTime={currentTime} />
      </BottomWidgetInner>
    );
  };

  AnimationControl.defaultProps = {
    toggleAnimation: () => {},
    updateAnimationSpeed: () => {},
    animationControlProps: {},
    animationConfig: {}
  };

  return AnimationControl;
}

export default AnimationControlFactory;
