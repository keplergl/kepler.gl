// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import throttle from 'lodash.throttle';
import styled from 'styled-components';

import RangeSliderFactory from './range-slider';
import TimeSliderMarkerFactory from './time-slider-marker';
import PlaybackControlsFactory from './animation-control/playback-controls';
import TimeRangeSliderTimeTitleFactory from './time-range-slider-time-title';
import {LineChart, Timeline, AnimationConfig} from '@kepler.gl/types';
import {ActionHandler, setFilterPlot} from '@kepler.gl/actions';
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
  timeBins?: object;
  plotType?: {
    [key: string]: any;
  };
  lineChart?: LineChart;
  step: number;
  isAnimatable?: boolean;
  speed: number;
  animationWindow: string;
  resetAnimation?: () => void;
  toggleAnimation: () => void;
  updateAnimationSpeed?: (val: number) => void;
  setFilterAnimationWindow?: (id: string) => void;
  setFilterPlot?: ActionHandler<typeof setFilterPlot>;
  onChange: (v: number[]) => void;
  timeline: Timeline;
  invertTrendColor?: boolean;
  animationConfig?: AnimationConfig;
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

export function getTimeBinsForInterval(timeBins, interval) {
  if (!timeBins) return {};
  return Object.keys(timeBins).reduce((acc, dataId) => {
    acc[dataId] = timeBins[dataId][interval];
    return acc;
  }, {});
}

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
      timeBins,
      plotType,
      lineChart,
      invertTrendColor,
      step,
      isAnimatable,
      speed,
      animationWindow,
      updateAnimationSpeed,
      setFilterAnimationWindow,
      toggleAnimation,
      onChange,
      setFilterPlot,
      timeline
    } = props;

    const throttledOnchange = useMemo(() => throttle(onChange, 20), [onChange]);
    const binsForInterval = useMemo(() => getTimeBinsForInterval(timeBins, plotType?.interval), [
      timeBins,
      plotType?.interval
    ]);

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
                bins={binsForInterval}
                lineChart={lineChart}
                invertTrendColor={invertTrendColor}
                plotType={plotType}
                isEnlarged={isEnlarged}
                showInput={false}
                step={step}
                onChange={throttledOnchange}
                xAxis={TimeSliderMarker}
                timezone={timezone}
                timeFormat={timeFormat}
                setFilterPlot={setFilterPlot}
              />
            </div>
          ) : (
            <AnimationControl
              style={ANIMATION_CONTROL_STYLE}
              isAnimatable={isAnimatable}
              isAnimating={isAnimating}
              resetAnimation={resetAnimation}
              toggleAnimation={toggleAnimation}
              updateAnimationSpeed={updateAnimationSpeed}
              setTimelineValue={throttledOnchange}
              setAnimationWindow={setFilterAnimationWindow}
              showTimeDisplay={false}
              timeline={timeline}
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
