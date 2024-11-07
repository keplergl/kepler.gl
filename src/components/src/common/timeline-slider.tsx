// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled from 'styled-components';
import throttle from 'lodash.throttle';
import classnames from 'classnames';
import {clamp, datetimeFormatter} from '@kepler.gl/utils';
import {media} from '@kepler.gl/styles';
import {DEFAULT_TIME_FORMAT, ANIMATION_WINDOW} from '@kepler.gl/constants';
import {Timeline} from '@kepler.gl/types';
import Slider from './slider/slider';

function noop() {
  return;
}

const SLIDER_MARGIN_PALM = 6;

const AnimationControlSlider = styled.div`
  display: flex;
  align-items: center;
`;

const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
  margin: 0 24px;

  ${media.palm`
    margin: 0 ${SLIDER_MARGIN_PALM}px;
  `}
`;

const StyledSlider = styled(Slider)`
  .kg-range-slider__bar {
    // change colors
  }
`;

const StyledDomain = styled.div.attrs(props => ({
  className: classnames('animation-control__time-domain', props.className)
}))`
  color: ${props => props.theme.titleTextColor};
  font-weight: 400;
  font-size: 10px;
`;

const PROGRESS_BAR_HEIGHT = 8;

interface TimelineSliderProps {
  timeline: Timeline;
  setTimelineValue: (value: [number] | [number, number]) => void;
  enableBarDrag?: boolean;
  showDomainTimes?: boolean;
  height?: number;
  className?: string | null;
  style?: object;
}

function TimelineSliderFactory() {
  const TimelineSlider: React.FC<TimelineSliderProps> = ({
    timeline, // timeline can be a union of filter and animationConfig
    // we can pass timeline to a hook and get back values and controllers
    setTimelineValue,
    enableBarDrag = true,
    showDomainTimes = true,
    height = PROGRESS_BAR_HEIGHT,
    className = null,
    style
  }) => {
    const onThrottleUpdate = useMemo(() => throttle(setTimelineValue, 20), [setTimelineValue]);

    const {step, domain, value, timeFormat, defaultTimeFormat, timezone, animationWindow} =
      timeline;

    const isRanged = useMemo(
      () =>
        Array.isArray(value) && value.length === 2 && animationWindow !== ANIMATION_WINDOW.interval,
      [animationWindow, value]
    );

    const [value0, value1]: [number, number] = useMemo(
      () => [isRanged ? value[0] : null, isRanged ? value[1] : value[0]],
      [isRanged, value]
    );

    const [onSlider0Change, onSlider1Change] = useMemo(() => {
      if (!domain) return [noop, noop];
      return [
        isRanged ? (newValue: number) => onThrottleUpdate([clamp(domain, newValue), value1]) : noop,
        isRanged
          ? (newValue: number) => onThrottleUpdate([value0, clamp(domain, newValue)])
          : (newValue: number) =>
              onThrottleUpdate(
                animationWindow === ANIMATION_WINDOW.interval
                  ? // filter requires an array with 2 values
                    [clamp(domain, newValue), clamp(domain, newValue)]
                  : // animationConfig only requires one value
                    [clamp(domain, newValue)]
              )
      ];
    }, [animationWindow, domain, isRanged, value0, value1, onThrottleUpdate]);

    const timelineSliderStyle = useMemo(() => ({height: `${height}px`}), [height]);

    const [timeStart, timeEnd] = useMemo(() => {
      if (!showDomainTimes) {
        return [null, null];
      }

      const hasUserFormat = typeof timeFormat === 'string';
      const currentFormat = (hasUserFormat ? timeFormat : defaultTimeFormat) || DEFAULT_TIME_FORMAT;
      const dateFunc = datetimeFormatter(timezone)(currentFormat);

      return [domain ? dateFunc(domain[0]) : '', domain ? dateFunc(domain[1]) : ''];
    }, [domain, timezone, timeFormat, defaultTimeFormat, showDomainTimes]);

    const requiresRangeSlider = isRanged && animationWindow !== ANIMATION_WINDOW.interval;

    return (
      <AnimationControlSlider
        style={style}
        className={classnames('animation-control__time-slider', className)}
      >
        {timeStart ? (
          <StyledDomain className="domain-start">
            <span>{timeStart}</span>
          </StyledDomain>
        ) : null}
        <SliderWrapper className="animation-control__slider">
          <StyledSlider
            isRanged={requiresRangeSlider}
            step={step || undefined}
            minValue={domain ? domain[0] : 0}
            maxValue={domain ? domain[1] : 1}
            enableBarDrag={enableBarDrag}
            style={timelineSliderStyle}
            onSlider0Change={onSlider0Change}
            onSlider1Change={onSlider1Change}
            value0={value0}
            value1={value1}
          />
        </SliderWrapper>
        {timeEnd ? (
          <StyledDomain className="domain-end">
            <span>{timeEnd}</span>
          </StyledDomain>
        ) : null}
      </AnimationControlSlider>
    );
  };

  return TimelineSlider;
}

export default TimelineSliderFactory;
