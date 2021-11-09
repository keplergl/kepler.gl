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

import Slider from '../slider/slider';
import PlaybackControlsFactory from './playback-controls';
import FloatingTimeDisplayFactory from './floating-time-display';
import {datetimeFormatter, snapToMarks, toArray} from '@kepler.gl/utils';
import {DEFAULT_TIME_FORMAT} from '@kepler.gl/constants';
import {media} from '@kepler.gl/styles';
import {AnimationConfig} from '@kepler.gl/types';

const SLIDER_MARGIN_PALM = 6;

const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
  margin: 0 24px;
  ${media.palm`
    margin: 0 ${SLIDER_MARGIN_PALM}px;
  `}
`;

const AnimationControlContainer = styled.div`
  padding: ${props => `${props.theme.bottomInnerPdVert}px ${props.theme.bottomInnerPdSide}px`};
  position: relative;
  margin-top: ${props => props.theme.bottomPanelGap}px;

  ${media.portable`
    border-top: 1px solid ${props => props.theme.panelBorderColor};
    border-left: 1px solid ${props => props.theme.panelBorderColor};
    padding: 12px 12px;
    margin-top: 0;
  `}
`;

const AnimationWidgetInner = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .animation-control__time-slider {
    display: flex;
    align-items: center;
    height: 32px;
    width: 100%;
  }
  .playback-controls {
    margin-left: 16px;
  }

  ${media.palm`
    flex-direction: column;
    .playback-controls {
      margin: 0;
    }
    .animation-control__time-slider {
      width: 100%;
      position: relative;
    }
    .animation-control__time-domain {
      position: absolute;
      top: -24px;

      &.domain-start {
        left: ${SLIDER_MARGIN_PALM}px;
      }
      &.domain-end {
        right: ${SLIDER_MARGIN_PALM}px;
      }
    }
  `};
`;

const StyledDomain = styled.div.attrs(props => ({
  className: classnames('animation-control__time-domain', props.className)
}))`
  color: ${props => props.theme.titleTextColor};
  font-weight: 400;
  font-size: 10px;
`;

type AnimationControlProps = {
  animationConfig: AnimationConfig;
  isAnimatable?: boolean;
  isAnimating?: boolean;
  updateAnimationSpeed?: (val: number) => void;
  toggleAnimation: () => void;
  resetAnimation?: () => void;
  setLayerAnimationTime: (x: number) => void;
  showTimeDisplay?: boolean;
  className?: string;
  style?: object;
};

AnimationControlFactory.deps = [PlaybackControlsFactory, FloatingTimeDisplayFactory];

function AnimationControlFactory(
  PlaybackControls: ReturnType<typeof PlaybackControlsFactory>,
  FloatingTimeDisplay: ReturnType<typeof FloatingTimeDisplayFactory>
) {
  const AnimationControl: React.FC<AnimationControlProps> = ({
    className,
    style,
    isAnimatable,
    isAnimating,
    resetAnimation,
    toggleAnimation,
    setLayerAnimationTime,
    updateAnimationSpeed,
    animationConfig,
    showTimeDisplay
  }) => {
    const {
      currentTime,
      domain,
      speed,
      // @ts-expect-error
      step,
      // @ts-expect-error
      timeSteps,
      timeFormat,
      timezone,
      defaultTimeFormat
    } = animationConfig;
    const onSlider1Change = useCallback(
      val => {
        // TODO: can we move this logic into setLayerAnimationTimeUpdater
        if (Array.isArray(timeSteps)) {
          setLayerAnimationTime(snapToMarks(toArray(val)[0], timeSteps));

          // TODO: merge slider in to avoid this step
        } else if (domain && val >= domain[0] && val <= domain[1]) {
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
      <AnimationControlContainer
        style={style}
        className={classnames('animation-control-container', className)}
      >
        <AnimationWidgetInner className="animation-widget--inner">
          <div className="animation-control__time-slider">
            <StyledDomain className="domain-start">
              <span>{timeStart}</span>
            </StyledDomain>
            <SliderWrapper className="animation-control__slider">
              <Slider
                isRanged={false}
                step={step}
                minValue={domain ? domain[0] : 0}
                maxValue={domain ? domain[1] : 1}
                // @ts-expect-error
                value1={currentTime}
                onSlider1Change={onSlider1Change}
                enableBarDrag={true}
              />
            </SliderWrapper>
            <StyledDomain className="domain-end">
              <span>{timeEnd}</span>
            </StyledDomain>
          </div>
          <PlaybackControls
            className="animation-control-playpause"
            startAnimation={toggleAnimation}
            isAnimating={isAnimating}
            pauseAnimation={toggleAnimation}
            resetAnimation={resetAnimation}
            speed={speed}
            isAnimatable={isAnimatable}
            updateAnimationSpeed={updateAnimationSpeed}
          />
        </AnimationWidgetInner>
        {showTimeDisplay ? (
          <FloatingTimeDisplay
            // @ts-expect-error
            currentTime={currentTime}
            defaultTimeFormat={defaultTimeFormat}
            timeFormat={timeFormat}
            timezone={timezone}
          />
        ) : null}
      </AnimationControlContainer>
    );
  };

  AnimationControl.defaultProps = {
    toggleAnimation: () => {},
    updateAnimationSpeed: () => {},
    animationControlProps: {},
    // @ts-expect-error
    animationConfig: {}
  };

  return AnimationControl;
}

export default AnimationControlFactory;
