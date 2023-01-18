// Copyright (c) 2023 Uber Technologies, Inc.
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

import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import {media} from '@kepler.gl/styles';
import {Timeline} from '@kepler.gl/types';

import TimelineSliderFactory from '../timeline-slider';
import PlaybackControlsFactory from './playback-controls';
import FloatingTimeDisplayFactory from './floating-time-display';

const SLIDER_MARGIN_PALM = 6;

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

const TIMELINE_PLAYBACK_STYLE = {flex: 1};

type AnimationControlProps = {
  timeline: Timeline;
  isAnimatable?: boolean;
  isAnimating?: boolean;
  updateAnimationSpeed?: (val: number) => void;
  setAnimationWindow?: (id: string) => void;
  toggleAnimation: () => void;
  resetAnimation?: () => void;
  setTimelineValue: (value: number[]) => void;
  showTimeDisplay?: boolean;
  showTimeline?: boolean;
  showControls?: boolean;
  className?: string;
  style?: object;
};

AnimationControlFactory.deps = [
  PlaybackControlsFactory,
  FloatingTimeDisplayFactory,
  TimelineSliderFactory
];

function AnimationControlFactory(
  PlaybackControls: ReturnType<typeof PlaybackControlsFactory>,
  FloatingTimeDisplay: ReturnType<typeof FloatingTimeDisplayFactory>,
  TimelineSlider: ReturnType<typeof TimelineSliderFactory>
) {
  const AnimationControl: React.FC<AnimationControlProps> = ({
    className,
    style,
    isAnimatable,
    isAnimating,
    resetAnimation,
    toggleAnimation,
    updateAnimationSpeed,
    setTimelineValue,
    setAnimationWindow,
    timeline,
    showTimeline = true,
    showControls = true,
    showTimeDisplay = true
  }) => {
    if (!timeline) {
      return null;
    }

    const {animationWindow, value, speed, defaultTimeFormat, timeFormat, timezone} = timeline;

    return (
      <AnimationControlContainer
        style={style}
        className={classnames('animation-control-container', className)}
      >
        <AnimationWidgetInner className="animation-widget--inner">
          {showTimeline ? (
            <TimelineSlider
              style={TIMELINE_PLAYBACK_STYLE}
              timeline={timeline}
              setTimelineValue={setTimelineValue}
            />
          ) : null}
          {showControls ? (
            <PlaybackControls
              className="animation-control-playpause"
              isAnimatable={isAnimatable}
              startAnimation={toggleAnimation}
              isAnimating={isAnimating}
              pauseAnimation={toggleAnimation}
              resetAnimation={resetAnimation}
              speed={speed}
              updateAnimationSpeed={updateAnimationSpeed}
              setFilterAnimationWindow={setAnimationWindow}
              animationWindow={animationWindow}
            />
          ) : null}
        </AnimationWidgetInner>
        {showTimeDisplay ? (
          <FloatingTimeDisplay
            currentTime={value}
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
    updateAnimationSpeed: () => {}
  };

  return AnimationControl;
}

export default AnimationControlFactory;
