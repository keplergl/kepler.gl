// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useMemo} from 'react';
import throttle from 'es-toolkit/compat/throttle';
import styled, {IStyledComponent} from 'styled-components';

import RangeSliderFactory from './range-slider';
import TimeSliderMarkerFactory from './time-slider-marker';
import PlaybackControlsFactory from './animation-control/playback-controls';
import TimeRangeSliderTimeTitleFactory from './time-range-slider-time-title';
import {LineChart, Timeline, AnimationConfig, TimeBins, Filter} from '@kepler.gl/types';
import {ActionHandler, setFilterPlot} from '@kepler.gl/actions';
import {ANIMATION_WINDOW} from '@kepler.gl/constants';
import {getBinThresholds, intervalBinFromMarks} from '@kepler.gl/utils';
import AnimationControlFactory from './animation-control/animation-control';
import {BaseComponentProps} from '../types';

const animationControlWidth = 176;
const animationControlExportWidth = 19;

type TimeRangeSliderProps = {
  domain?: [number, number];
  value: [number, number];
  isEnlarged?: boolean;
  isMinified?: boolean;
  hideTimeTitle?: boolean;
  isAnimating: boolean;
  timeFormat: string;
  timezone?: string | null;
  timeBins?: TimeBins;
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
  exportAnimation?: () => void;
  updateAnimationSpeed?: (val: number) => void;
  setFilterAnimationWindow?: (id: string) => void;
  setFilterPlot?: ActionHandler<typeof setFilterPlot>;
  onChange: (v: number[]) => void;
  timeline: Timeline;
  invertTrendColor?: boolean;
  animationConfig?: AnimationConfig;
  filter?: Filter;
};

export type StyledSliderContainerProps = BaseComponentProps & {
  $isEnlarged?: boolean;
  $interval?: boolean;
};

const StyledSliderContainer: IStyledComponent<
  'web',
  StyledSliderContainerProps
> = styled.div<StyledSliderContainerProps>`
  align-items: flex-end;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: ${props => (props.$isEnlarged ? 24 : 0)}px;

  .timeline-container .kg-slider {
    display: none;
  }

  .playback-controls {
    margin-left: 22px;
  }

  ${props =>
    props.$interval
      ? `
    .kg-range-slider__bar {
      background-color: transparent;
    }
  `
      : ''}
`;

const ANIMATION_CONTROL_STYLE = {flex: 1, padding: 0, marginTop: 0};

TimeRangeSliderFactory.deps = [
  PlaybackControlsFactory,
  RangeSliderFactory,
  TimeSliderMarkerFactory,
  TimeRangeSliderTimeTitleFactory,
  AnimationControlFactory
];

export function getTimeBinsForInterval(timeBins: TimeBins | undefined, interval: number) {
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
      exportAnimation,
      onChange,
      setFilterPlot,
      timeline,
      filter
    } = props;

    const binMarks = useMemo(() => {
      if (animationWindow !== ANIMATION_WINDOW.interval || !plotType?.interval || !domain) {
        return null;
      }
      const thresholds = getBinThresholds(plotType.interval, domain);
      return thresholds.length > 1 ? thresholds : null;
    }, [animationWindow, domain, plotType?.interval]);

    const byInterval = Boolean(binMarks);
    const sliderRange = useMemo(() => {
      if (!domain) {
        return domain;
      }
      if (binMarks) {
        return [domain[0], Math.max(binMarks[binMarks.length - 1], domain[1])] as [number, number];
      }
      return domain;
    }, [binMarks, domain]);

    const onSliderChange = useCallback(
      (val: number[]) => {
        if (byInterval && binMarks) {
          // A point brush reports the same mark twice. The single handle reports
          // [domain start, handle], so the moving edge picks the bin.
          const anchor = val[0] === val[1] ? val[0] : val[1];
          onChange(intervalBinFromMarks(binMarks, anchor));
          return;
        }
        onChange(val);
      },
      [binMarks, byInterval, onChange]
    );

    const throttledOnchange = useMemo(() => throttle(onSliderChange, 20), [onSliderChange]);
    useEffect(() => () => throttledOnchange.cancel(), [throttledOnchange]);

    const binsForInterval = useMemo(
      () => getTimeBinsForInterval(timeBins, plotType?.interval),
      [timeBins, plotType?.interval]
    );
    const width = animationControlWidth + (exportAnimation ? animationControlExportWidth : 0);

    const style = useMemo(
      () => ({
        width: isEnlarged ? `calc(100% - ${width}px)` : '100%'
      }),
      [isEnlarged, width]
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
        <StyledSliderContainer
          className="time-range-slider__container"
          $isEnlarged={isEnlarged}
          $interval={byInterval}
        >
          {!isMinified ? (
            <div className="timeline-container" style={style}>
              <RangeSlider
                range={byInterval ? sliderRange : domain}
                value0={byInterval && sliderRange ? sliderRange[0] : value[0]}
                value1={byInterval ? value[0] : value[1]}
                plotValue={byInterval ? value : undefined}
                bins={binsForInterval}
                lineChart={lineChart}
                invertTrendColor={invertTrendColor}
                plotType={plotType}
                isEnlarged={isEnlarged}
                showInput={false}
                step={step}
                isRanged={!byInterval}
                marks={byInterval ? binMarks || undefined : undefined}
                animationWindow={animationWindow}
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
              exportAnimation={exportAnimation}
              showTimeDisplay={false}
              timeline={timeline}
              filter={filter}
            />
          )}
          {isEnlarged && !isMinified ? (
            <PlaybackControls
              isAnimatable={isAnimatable}
              width={width}
              speed={speed}
              animationWindow={animationWindow}
              updateAnimationSpeed={updateAnimationSpeed}
              setFilterAnimationWindow={setFilterAnimationWindow}
              pauseAnimation={toggleAnimation}
              resetAnimation={resetAnimation}
              exportAnimation={exportAnimation}
              isAnimating={isAnimating}
              startAnimation={toggleAnimation}
              filter={filter}
            />
          ) : null}
        </StyledSliderContainer>
      </div>
    );
  };

  return React.memo(TimeRangeSlider);
}
