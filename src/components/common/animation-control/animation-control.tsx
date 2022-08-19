// Copyright (c) 2022 Uber Technologies, Inc.
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

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import Slider from 'components/common/slider/slider';
import {BottomWidgetInner} from 'components/common/styled-components';
import PlaybackControlsFactory from './playback-controls';
import FloatingTimeDisplayFactory from './floating-time-display';import {datetimeFormatter, snapToMarks} from '@kepler.gl/utils';
import {DEFAULT_TIME_FORMAT} from '@kepler.gl/constants';

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

const StyledDomain = styled.div.attrs(props => ({
  className: classnames('animation-control__time-domain', props.className)
}))`
  color: ${props => props.theme.titleTextColor};
  font-weight: 400;
  font-size: 10px;
`;

AnimationControlFactory.deps = [PlaybackControlsFactory, FloatingTimeDisplayFactory];

function AnimationControlFactory(
  PlaybackControls: ReturnType<typeof PlaybackControlsFactory>,
  FloatingTimeDisplay: ReturnType<typeof FloatingTimeDisplayFactory>
) {
  const AnimationControl = ({
    isAnimatable,
    isAnimating,
    resetAnimation,
    toggleAnimation,
    setLayerAnimationTime,
    updateAnimationSpeed,
    animationConfig
  }) => {
    const {
      currentTime,
      domain,
      speed,
      step,
      timeSteps,
      timeFormat,
      timezone,
      defaultTimeFormat
    } = animationConfig;
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

    const dateFunc = useMemo(() => {
      const hasUserFormat = typeof timeFormat === 'string';
      const currentFormat = (hasUserFormat ? timeFormat : defaultTimeFormat) || DEFAULT_TIME_FORMAT;
      return datetimeFormatter(timezone)(currentFormat);
    }, [timeFormat, defaultTimeFormat, timezone]);

    const timeStart = useMemo(() => (domain ? dateFunc(domain[0]) : ''), [domain, dateFunc]);
    const timeEnd = useMemo(() => (domain ? dateFunc(domain[1]) : ''), [domain, dateFunc]);

    return (
      <BottomWidgetInner className="bottom-widget--inner">
        <AnimationWidgetInner className="animation-widget--inner">
          <PlaybackControls
            startAnimation={toggleAnimation}
            isAnimating={isAnimating}
            pauseAnimation={toggleAnimation}
            resetAnimation={resetAnimation}
            speed={speed}
            isAnimatable={isAnimatable}
            updateAnimationSpeed={updateAnimationSpeed}
          />
          <StyledDomain className="domain-start">
            <span>{timeStart}</span>
          </StyledDomain>
          <SliderWrapper className="animation-control__slider">
            <Slider
              isRanged={false}
              step={step}
              minValue={domain ? domain[0] : 0}
              maxValue={domain ? domain[1] : 1}
              value1={currentTime}
              onSlider1Change={onSlider1Change}
              enableBarDrag={true}
            />
          </SliderWrapper>
          <StyledDomain className="domain-end">
            <span>{timeEnd}</span>
          </StyledDomain>
        </AnimationWidgetInner>
        <FloatingTimeDisplay
          currentTime={currentTime}
          defaultTimeFormat={defaultTimeFormat}
          timeFormat={timeFormat}
          timezone={timezone}
        />
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
