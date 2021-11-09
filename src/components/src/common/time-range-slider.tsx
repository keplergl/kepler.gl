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

import React, {useMemo} from 'react';
import throttle from 'lodash.throttle';
import styled from 'styled-components';

import RangeSliderFactory from './range-slider';
import TimeSliderMarkerFactory from './time-slider-marker';
import PlaybackControlsFactory from './animation-control/playback-controls';
import TimeRangeSliderTimeTitleFactory from './time-range-slider-time-title';
import {HistogramBin, LineChart} from '@kepler.gl/types';
import AnimationControlFactory from './animation-control/animation-control';

const animationControlWidth = 176;

interface StyledSliderContainerProps {
  isEnlarged?: boolean;
}

type TimeRangeSliderProps = {
  domain?: [number, number];
  value: [number, number];
  isEnlarged?: boolean;
  isMinified?: boolean;
  hideTimeTitle?: boolean;
  isAnimating: boolean;
  timeFormat: string;
  timezone?: string | null;
  histogram?: HistogramBin[];
  plotType?: string;
  lineChart?: LineChart;
  step: number;
  isAnimatable?: boolean;
  speed: number;
  animationWindow: string;
  resetAnimation?: () => void;
  toggleAnimation: () => void;
  updateAnimationSpeed?: (val: number) => void;
  setFilterAnimationWindow?: (id: string) => void;
  onChange: (v: number[]) => void;
};

const StyledSliderContainer = styled.div<StyledSliderContainerProps>`
  align-items: flex-end;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: ${props => (props.isEnlarged ? 24 : 0)}px;

  .timeline-container .kg-slider {
    display: none;
  }

  .playback-controls {
    margin-left: 22px;
  }
`;

const ANIMATION_CONTROL_STYLE = {flex: 1};

TimeRangeSliderFactory.deps = [
  PlaybackControlsFactory,
  RangeSliderFactory,
  TimeSliderMarkerFactory,
  TimeRangeSliderTimeTitleFactory,
  AnimationControlFactory
];

export default function TimeRangeSliderFactory(
  PlaybackControls: ReturnType<typeof PlaybackControlsFactory>,
  RangeSlider: ReturnType<typeof RangeSliderFactory>,
  TimeSliderMarker: ReturnType<typeof TimeSliderMarkerFactory>,
  TimeRangeSliderTimeTitle: ReturnType<typeof TimeRangeSliderTimeTitleFactory>,
  AnimationControl: ReturnType<typeof AnimationControlFactory>
) {
  const TimeRangeSlider: React.FC<TimeRangeSliderProps> = props => {
    const {
      domain,
      value,
      isEnlarged,
      isMinified,
      hideTimeTitle,
      isAnimating,
      resetAnimation,
      timeFormat,
      timezone,
      histogram,
      plotType,
      lineChart,
      step,
      isAnimatable,
      speed,
      animationWindow,
      updateAnimationSpeed,
      setFilterAnimationWindow,
      toggleAnimation,
      onChange
    } = props;

    const throttledOnchange = useMemo(() => throttle(onChange, 20), [onChange]);

    const style = useMemo(
      () => ({
        width: isEnlarged ? `calc(100% - ${animationControlWidth}px)` : '100%'
      }),
      [isEnlarged]
    );

    return (
      <div className="time-range-slider">
        {!hideTimeTitle && isEnlarged ? (
          <div className="time-range-slider__title" style={style}>
            <TimeRangeSliderTimeTitle
              timeFormat={timeFormat}
              timezone={timezone}
              value={value}
              isEnlarged={isEnlarged}
            />
          </div>
        ) : null}
        <StyledSliderContainer className="time-range-slider__container" isEnlarged={isEnlarged}>
          {!isMinified ? (
            <div className="timeline-container" style={style}>
              <RangeSlider
                range={domain}
                value0={value[0]}
                value1={value[1]}
                histogram={histogram}
                lineChart={lineChart}
                plotType={plotType}
                isEnlarged={isEnlarged}
                showInput={false}
                step={step}
                onChange={throttledOnchange}
                xAxis={TimeSliderMarker}
                timezone={timezone}
                timeFormat={timeFormat}
              />
            </div>
          ) : (
            // @ts-expect-error
            <AnimationControl
              style={ANIMATION_CONTROL_STYLE}
              isAnimatable={isAnimatable}
              isAnimating={isAnimating}
              resetAnimation={resetAnimation}
              toggleAnimation={toggleAnimation}
              updateAnimationSpeed={updateAnimationSpeed}
              showTimeDisplay={false}
            />
          )}

          {isEnlarged && !isMinified ? (
            <PlaybackControls
              isAnimatable={isAnimatable}
              width={animationControlWidth}
              speed={speed}
              animationWindow={animationWindow}
              updateAnimationSpeed={updateAnimationSpeed}
              setFilterAnimationWindow={setFilterAnimationWindow}
              pauseAnimation={toggleAnimation}
              resetAnimation={resetAnimation}
              isAnimating={isAnimating}
              startAnimation={toggleAnimation}
            />
          ) : null}
        </StyledSliderContainer>
      </div>
    );
  };

  return React.memo(TimeRangeSlider);
}
