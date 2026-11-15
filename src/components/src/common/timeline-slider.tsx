// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import styled, {IStyledComponent} from 'styled-components';
import throttle from 'es-toolkit/compat/throttle';
import classnames from 'classnames';
import {bisectRight} from 'd3-array';
import {clamp, datetimeFormatter} from '@kepler.gl/utils';
import {media} from '@kepler.gl/styles';
import {DEFAULT_TIME_FORMAT, ANIMATION_WINDOW} from '@kepler.gl/constants';
import {Timeline} from '@kepler.gl/types';
import Slider from './slider/slider';
import {BaseComponentProps} from '../types';

function noop() {
  return;
}

const SLIDER_MARGIN_PALM = 6;

export type AnimationControlSliderProps = BaseComponentProps;

const AnimationControlSlider: IStyledComponent<'web', AnimationControlSliderProps> = styled.div`
  display: flex;
  align-items: center;
`;

const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
  margin: 0 4px;
  padding: 0 6px;

  ${media.palm`
    margin: 0 ${SLIDER_MARGIN_PALM}px;
  `}
`;

const StyledSlider = styled(Slider)<{$rangeDraggable: boolean}>`
  ${props =>
    props.$rangeDraggable
      ? `
    .kg-range-slider__bar,
    .kg-range-slider__bar:hover {
      cursor: grab;
      touch-action: none;
    }

    .kg-range-slider__bar::before {
      content: '';
      position: absolute;
      inset: -6px 0;
    }

    .kg-range-slider__bar--active,
    .kg-range-slider__bar--active:hover {
      cursor: grabbing;
    }
  `
      : ''}
`;

const StyledDomain = styled.div.attrs(props => ({
  className: classnames('animation-control__time-domain', props.className)
}))`
  color: ${props => props.theme.titleTextColor};
  font-weight: 400;
  font-size: 10px;
  flex-shrink: 0;
  white-space: nowrap;
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
  formatValue?: (value: number) => string;
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
    style,
    formatValue
  }) => {
    const onThrottleUpdate = useMemo(() => throttle(setTimelineValue, 20), [setTimelineValue]);
    useEffect(() => () => onThrottleUpdate.cancel(), [onThrottleUpdate]);

    const {step, domain, value, timeFormat, defaultTimeFormat, timezone, animationWindow, marks} =
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

    const [displayValue0, displayValue1]: [number, number] = useMemo(() => {
      if (!domain) {
        return [value0, value1];
      }

      return [isRanged ? clamp(domain, value0) : value0, clamp(domain, value1)];
    }, [domain, isRanged, value0, value1]);

    const dragStartOffset = useRef(0);
    const onRangeDragStart = useCallback(() => {
      // The slider measures movement from the visible edge. Keep the hidden
      // part of a clipped start attached to it throughout controlled updates.
      dragStartOffset.current = isRanged ? value0 - displayValue0 : 0;
    }, [isRanged, value0, displayValue0]);

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

    const onIntervalKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (
          event.defaultPrevented ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey ||
          animationWindow !== ANIMATION_WINDOW.interval ||
          !domain ||
          !marks ||
          marks.length < 2 ||
          !Number.isFinite(value1)
        ) {
          return;
        }
        // The final mark closes the last bin; it is not another interval.
        const lastIndex = marks.length - 2;
        const currentIndex = clamp([0, lastIndex], bisectRight(marks, value1) - 1);
        let nextIndex: number;
        switch (event.key) {
          case 'Home':
            nextIndex = 0;
            break;
          case 'End':
            nextIndex = lastIndex;
            break;
          case 'ArrowLeft':
          case 'ArrowDown':
          case 'PageDown':
            nextIndex = Math.max(0, currentIndex - 1);
            break;
          case 'ArrowRight':
          case 'ArrowUp':
          case 'PageUp':
            nextIndex = Math.min(lastIndex, currentIndex + 1);
            break;
          default:
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const nextMark = marks[nextIndex];
        if (nextMark !== value1) {
          // Calendar bins may begin before the raw data domain. Keep the mark
          // for selection; only the rendered handle position should be clamped.
          onThrottleUpdate([nextMark, nextMark]);
        }
      },
      [animationWindow, domain, marks, onThrottleUpdate, value1]
    );

    const onSliderBarChange = useCallback(
      (nextStart: number) => {
        if (!domain || !isRanged) return;
        // Calendar bins can extend beyond the displayed domain. Preserve the
        // selected duration, limiting it only when the entire window cannot fit.
        const width = Math.min(value1 - value0, domain[1] - domain[0]);
        const start = clamp([domain[0], domain[1] - width], nextStart + dragStartOffset.current);
        onThrottleUpdate([start, start + width]);
      },
      [domain, isRanged, value0, value1, onThrottleUpdate]
    );

    const timelineSliderStyle = useMemo(() => ({height: `${height}px`}), [height]);

    const [timeStart, timeEnd] = useMemo(() => {
      if (!showDomainTimes) {
        return [null, null];
      }

      const valueFormatter =
        formatValue ||
        (() => {
          const hasUserFormat = typeof timeFormat === 'string';
          const currentFormat =
            (hasUserFormat ? timeFormat : defaultTimeFormat) || DEFAULT_TIME_FORMAT;
          return datetimeFormatter(timezone)(currentFormat);
        })();

      return [domain ? valueFormatter(domain[0]) : '', domain ? valueFormatter(domain[1]) : ''];
    }, [domain, timezone, timeFormat, defaultTimeFormat, showDomainTimes, formatValue]);

    const requiresRangeSlider = isRanged && animationWindow !== ANIMATION_WINDOW.interval;
    const rangeDraggable = enableBarDrag && requiresRangeSlider && Boolean(domain);

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
        <SliderWrapper
          className="animation-control__slider"
          onMouseDownCapture={onRangeDragStart}
          onTouchStartCapture={onRangeDragStart}
          onKeyDownCapture={onIntervalKeyDown}
        >
          <StyledSlider
            $rangeDraggable={rangeDraggable}
            title={formatValue ? 'Range' : 'Time'}
            formatValue={
              formatValue ||
              datetimeFormatter(timezone)(timeFormat || defaultTimeFormat || DEFAULT_TIME_FORMAT)
            }
            isRanged={requiresRangeSlider}
            step={step || undefined}
            minValue={domain ? domain[0] : 0}
            maxValue={domain ? domain[1] : 1}
            enableBarDrag={rangeDraggable}
            style={timelineSliderStyle}
            onSlider0Change={onSlider0Change}
            onSlider1Change={onSlider1Change}
            onSliderBarChange={onSliderBarChange}
            value0={displayValue0}
            value1={displayValue1}
            marks={marks}
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
