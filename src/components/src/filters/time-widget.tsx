// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled from 'styled-components';
import {DEFAULT_TIME_FORMAT, FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import throttle from 'lodash/throttle';
import {clamp, datetimeFormatter} from '@kepler.gl/utils';
import {BottomWidgetInner, Button, PanelLabel} from '../common/styled-components';
import TimeRangeSliderFactory from '../common/time-range-slider';
import FloatingTimeDisplayFactory from '../common/animation-control/floating-time-display';
import {timeRangeSliderFieldsSelector} from './time-range-filter';
import {TimeWidgetProps} from './types';
import TimeWidgetTopFactory from './time-widget-top';

const TimeBottomWidgetInner = styled(BottomWidgetInner)`
  padding: 6px 32px 24px 32px;
`;

const TimelineSection = styled.div`
  position: relative;
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
`;

const TimelineContainer = styled.div`
  touch-action: none;
`;

const TimelineStatusBar = styled.div`
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: ${props => props.theme.subtextColor};
`;

const TimelineStatusRange = styled.span`
  color: ${props => props.theme.textColorHl || props.theme.textColor};
  font-weight: 500;
  white-space: nowrap;
`;

function rangesEqual(a: [number, number] | null, b: [number, number] | null, eps = 1): boolean {
  if (!a || !b) {
    return false;
  }
  return Math.abs(a[0] - b[0]) <= eps && Math.abs(a[1] - b[1]) <= eps;
}

function clampRange(
  [start, end]: [number, number],
  [min, max]: [number, number]
): [number, number] {
  const clampedStart = clamp([min, max], start);
  let clampedEnd = clamp([min, max], end);
  if (clampedEnd <= clampedStart) {
    clampedEnd = Math.min(max, clampedStart + 1);
  }
  return [clampedStart, clampedEnd];
}

TimeWidgetFactory.deps = [TimeRangeSliderFactory, FloatingTimeDisplayFactory, TimeWidgetTopFactory];

function TimeWidgetFactory(
  TimeRangeSlider: ReturnType<typeof TimeRangeSliderFactory>,
  FloatingTimeDisplay: ReturnType<typeof FloatingTimeDisplayFactory>,
  TimeWidgetTop: ReturnType<typeof TimeWidgetTopFactory>
) {
  const TimeWidget: React.FC<TimeWidgetProps> = ({
    datasets,
    filter,
    layers,
    index,
    readOnly,
    showTimeDisplay,
    setFilterAnimationTime,
    onClose,
    onToggleMinify,
    resetAnimation,
    isAnimatable,
    updateAnimationSpeed,
    toggleAnimation,
    setFilterPlot,
    setFilterAnimationWindow,
    animationConfig,
    timeline
  }: TimeWidgetProps) => {
    const _updateAnimationSpeed = useCallback(
      speed => updateAnimationSpeed(index, speed),
      [updateAnimationSpeed, index]
    );

    const _toggleAnimation = useCallback(() => toggleAnimation(index), [toggleAnimation, index]);

    const isMinified = useMemo(() => filter.view === FILTER_VIEW_TYPES.minified, [filter]);

    const _setFilterAnimationWindow = useCallback(
      animationWindow => setFilterAnimationWindow({id: filter.id, animationWindow}),
      [setFilterAnimationWindow, filter.id]
    );

    const timeSliderOnChange = useCallback(
      value => setFilterAnimationTime(index, 'value', value),
      [setFilterAnimationTime, index]
    );

    const _setFilterPlot = useCallback(
      (newProp, valueIndex) => setFilterPlot(index, newProp, valueIndex),
      [index, setFilterPlot]
    );

    const timeRangeSlideProps = useMemo(
      () => timeRangeSliderFieldsSelector(filter, datasets, layers),
      [filter, datasets, layers]
    );

    const fullDomain = Array.isArray(timeRangeSlideProps.domain)
      ? (timeRangeSlideProps.domain as [number, number])
      : null;

    const [timelineDomain, setTimelineDomain] = useState<[number, number] | null>(null);
    const timelineContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!fullDomain) {
        if (timelineDomain) {
          setTimelineDomain(null);
        }
        return;
      }
      if (timelineDomain) {
        const clamped = clampRange(timelineDomain, fullDomain);
        if (!rangesEqual(clamped, timelineDomain)) {
          setTimelineDomain(clamped);
        }
      }
    }, [fullDomain, timelineDomain]);

    const sliderDomain = timelineDomain ?? fullDomain ?? undefined;
    const displayedTimelineDomain = sliderDomain ?? null;

    const timelineZoomed = useMemo(() => {
      if (!timelineDomain || !fullDomain) {
        return false;
      }
      return !rangesEqual(timelineDomain, fullDomain);
    }, [timelineDomain, fullDomain]);

    const timeFormat =
      timeRangeSlideProps.timeFormat ||
      filter.timeFormat ||
      filter.defaultTimeFormat ||
      DEFAULT_TIME_FORMAT;
    const formatTimestamp = useMemo(() => {
      const formatter = datetimeFormatter(filter.timezone);
      return (value: number) => formatter(timeFormat)(value);
    }, [filter.timezone, timeFormat]);

    const timelineRangeLabel = useMemo(() => {
      if (!displayedTimelineDomain) {
        return '';
      }
      return `${formatTimestamp(displayedTimelineDomain[0])} – ${formatTimestamp(
        displayedTimelineDomain[1]
      )}`;
    }, [displayedTimelineDomain, formatTimestamp]);

    const [filterStart, filterEnd] = filter.value;

    const clampWindowToDomain = useCallback(
      (windowStart: number, windowEnd: number, domainRange: [number, number]) => {
        const [domainStart, domainEnd] = domainRange;
        let nextStart = clamp(domainRange, windowStart);
        let nextEnd = clamp(domainRange, windowEnd);
        if (nextEnd <= nextStart) {
          const width = Math.max(windowEnd - windowStart, 1);
          const maxStart = Math.max(domainStart, domainEnd - width);
          nextStart = clamp([domainStart, maxStart], windowStart);
          nextEnd = nextStart + width;
          if (nextEnd > domainEnd) {
            nextEnd = domainEnd;
            nextStart = Math.max(domainStart, nextEnd - width);
          }
        }
        if (nextEnd <= nextStart) {
          nextEnd = Math.min(domainEnd, nextStart + 1);
        }
        return [nextStart, nextEnd] as [number, number];
      },
      []
    );

    const handleWindowZoom = useCallback(
      (factor: number, center: number) => {
        const domainRange = timelineDomain ?? fullDomain;
        if (!domainRange) {
          return;
        }
        const domainWidth = Math.max(domainRange[1] - domainRange[0], 1);
        const clampedCenter = clamp(domainRange, center);

        const windowStart = filterStart;
        const windowEnd = filterEnd;
        const currentWidth = Math.max(windowEnd - windowStart, 1);
        const newWidth = clamp([1, domainWidth], currentWidth / factor);
        const ratio = clamp([0, 1], (clampedCenter - windowStart) / currentWidth);

        const nextStart = clampedCenter - ratio * newWidth;
        const nextEnd = clampedCenter + (1 - ratio) * newWidth;

        const [clampedStart, clampedEnd] = clampWindowToDomain(nextStart, nextEnd, domainRange);
        setFilterAnimationTime(index, 'value', [clampedStart, clampedEnd]);
      },
      [
        clampWindowToDomain,
        filterEnd,
        filterStart,
        fullDomain,
        index,
        setFilterAnimationTime,
        timelineDomain
      ]
    );

    const handleTimelineZoom = useCallback(
      (factor: number, center: number) => {
        if (!fullDomain) {
          return;
        }
        const domainRange: [number, number] = timelineDomain ?? fullDomain;
        const [domainStart, domainEnd] = fullDomain;
        const fullWidth = domainEnd - domainStart;
        if (!(fullWidth > 0)) {
          return;
        }
        const baseWidth = Math.max(domainRange[1] - domainRange[0], 1);
        const clampedCenter = clamp(domainRange, center);
        const minWidth = Math.max(fullWidth / 20, 1);
        const nextWidth = clamp([minWidth, fullWidth], baseWidth / factor);
        const ratio = clamp(
          [0, 1],
          baseWidth > 0 ? (clampedCenter - domainRange[0]) / baseWidth : 0.5
        );

        let nextStart = clampedCenter - ratio * nextWidth;
        let nextEnd = nextStart + nextWidth;

        if (nextStart < domainStart) {
          const shift = domainStart - nextStart;
          nextStart = domainStart;
          nextEnd += shift;
        }
        if (nextEnd > domainEnd) {
          const shift = nextEnd - domainEnd;
          nextEnd = domainEnd;
          nextStart -= shift;
        }
        const nextRange: [number, number] = clampRange([nextStart, nextEnd], fullDomain);
        setTimelineDomain(prev => (rangesEqual(prev, nextRange) ? prev : nextRange));

        let windowStart = filterStart;
        let windowEnd = filterEnd;
        const rangeWidth = nextRange[1] - nextRange[0];
        if (rangeWidth < windowEnd - windowStart) {
          const windowWidth = Math.max(windowEnd - windowStart, 1);
          const windowRatio = clamp([0, 1], (clampedCenter - windowStart) / windowWidth);
          const adjustedStart = clampedCenter - windowRatio * rangeWidth;
          const adjustedEnd = clampedCenter + (1 - windowRatio) * rangeWidth;
          [windowStart, windowEnd] = clampWindowToDomain(adjustedStart, adjustedEnd, nextRange);
        } else {
          [windowStart, windowEnd] = clampWindowToDomain(windowStart, windowEnd, nextRange);
        }
        if (windowStart !== filterStart || windowEnd !== filterEnd) {
          setFilterAnimationTime(index, 'value', [windowStart, windowEnd]);
        }
      },
      [
        clampWindowToDomain,
        filterEnd,
        filterStart,
        fullDomain,
        index,
        setFilterAnimationTime,
        timelineDomain
      ]
    );

    const throttledWindowZoom = useMemo(
      () => throttle(handleWindowZoom, 40, {leading: true, trailing: false}),
      [handleWindowZoom]
    );

    const throttledTimelineZoom = useMemo(
      () => throttle(handleTimelineZoom, 40, {leading: true, trailing: false}),
      [handleTimelineZoom]
    );

    useEffect(() => () => throttledWindowZoom.cancel(), [throttledWindowZoom]);
    useEffect(() => () => throttledTimelineZoom.cancel(), [throttledTimelineZoom]);

    const handleWheel = useCallback(
      (event: React.WheelEvent<HTMLDivElement>) => {
        if (isMinified || !sliderDomain) {
          return;
        }
        const nativeEvent = event.nativeEvent as WheelEvent;
        const isPinch =
          event.ctrlKey ||
          nativeEvent.ctrlKey ||
          nativeEvent.metaKey ||
          Math.abs(nativeEvent.deltaZ || 0) > 0;
        const zoomFn = isPinch ? throttledTimelineZoom : throttledWindowZoom;
        if (!zoomFn) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (event.deltaY === 0) {
          return;
        }

        const baseStep = isPinch ? 0.02 : 0.08;
        const factor = event.deltaY < 0 ? 1 + baseStep : 1 / (1 + baseStep);
        const container = timelineContainerRef.current;
        if (!container) {
          return;
        }
        const sliderTrack = container.querySelector(
          '.kg-range-slider__slider'
        ) as HTMLElement | null;
        const rect = sliderTrack?.getBoundingClientRect() ?? container.getBoundingClientRect();
        if (!rect || rect.width === 0) {
          return;
        }
        const ratio = clamp([0, 1], (event.clientX - rect.left) / rect.width);
        const center = sliderDomain[0] + ratio * (sliderDomain[1] - sliderDomain[0]);
        zoomFn(factor, center);
      },
      [isMinified, sliderDomain, throttledTimelineZoom, throttledWindowZoom]
    );

    useEffect(() => {
      const node = timelineContainerRef.current;
      if (!node) {
        return undefined;
      }
      const preventBrowserZoom = (event: WheelEvent) => {
        const isPinch = event.ctrlKey || event.metaKey || Math.abs(event.deltaZ || 0) > 0;
        if (isPinch) {
          event.preventDefault();
        }
      };
      node.addEventListener('wheel', preventBrowserZoom, {passive: false});
      return () => node.removeEventListener('wheel', preventBrowserZoom);
    }, [timelineContainerRef]);

    const panTimelineBy = useCallback(
      (delta: number) => {
        if (!fullDomain) {
          return;
        }
        const [domainStart, domainEnd] = fullDomain;
        const currentRange: [number, number] = timelineDomain ?? fullDomain;
        let nextStart = currentRange[0] + delta;
        let nextEnd = currentRange[1] + delta;
        if (nextStart < domainStart) {
          nextEnd += domainStart - nextStart;
          nextStart = domainStart;
        }
        if (nextEnd > domainEnd) {
          nextStart -= nextEnd - domainEnd;
          nextEnd = domainEnd;
        }
        const nextRange: [number, number] = clampRange([nextStart, nextEnd], fullDomain);
        setTimelineDomain(prev => (rangesEqual(prev, nextRange) ? prev : nextRange));

        let windowStart = filterStart + delta;
        let windowEnd = filterEnd + delta;
        [windowStart, windowEnd] = clampWindowToDomain(windowStart, windowEnd, fullDomain);
        if (windowStart !== filterStart || windowEnd !== filterEnd) {
          setFilterAnimationTime(index, 'value', [windowStart, windowEnd]);
        }
      },
      [
        clampWindowToDomain,
        filterEnd,
        filterStart,
        fullDomain,
        index,
        setFilterAnimationTime,
        timelineDomain
      ]
    );

    useEffect(() => {
      const handler = (event: KeyboardEvent) => {
        if (!(event.ctrlKey || event.metaKey)) {
          return;
        }
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
          return;
        }
        const domainRange = timelineDomain ?? fullDomain;
        if (!domainRange) {
          return;
        }
        const span = domainRange[1] - domainRange[0];
        if (!(span > 0)) {
          return;
        }
        event.preventDefault();
        const step = span * (event.shiftKey ? 0.2 : 0.1);
        const delta = event.key === 'ArrowLeft' ? -step : step;
        panTimelineBy(delta);
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, [fullDomain, panTimelineBy, timelineDomain]);

    const handleResetTimeline = useCallback(() => {
      setTimelineDomain(null);
    }, []);

    return (
      <TimeBottomWidgetInner className="bottom-widget--inner">
        <TimeWidgetTop
          filter={filter}
          readOnly={readOnly}
          datasets={datasets}
          setFilterPlot={_setFilterPlot}
          index={index}
          onClose={onClose}
          onToggleMinify={onToggleMinify}
          isMinified={isMinified}
        />
        <TimelineSection>
          {timelineZoomed && timelineRangeLabel ? (
            <TimelineStatusBar>
              <PanelLabel>Showing</PanelLabel>
              <TimelineStatusRange>{timelineRangeLabel}</TimelineStatusRange>
              <Button
                small
                type="button"
                onClick={handleResetTimeline}
                aria-label="Reset timeline selection"
                data-testid="time-widget-timeline-reset"
              >
                Reset
              </Button>
            </TimelineStatusBar>
          ) : null}
          <TimelineContainer ref={timelineContainerRef} onWheel={handleWheel}>
            <TimeRangeSlider
              {...timeRangeSlideProps}
              domain={sliderDomain}
              onChange={timeSliderOnChange}
              toggleAnimation={_toggleAnimation}
              updateAnimationSpeed={_updateAnimationSpeed}
              setFilterAnimationWindow={_setFilterAnimationWindow}
              hideTimeTitle={showTimeDisplay}
              resetAnimation={resetAnimation}
              isAnimatable={isAnimatable}
              setFilterPlot={_setFilterPlot}
              animationConfig={animationConfig}
              isMinified={isMinified}
              timeline={timeline}
            />
          </TimelineContainer>
        </TimelineSection>
        {showTimeDisplay ? (
          <FloatingTimeDisplay
            currentTime={filter.value}
            defaultTimeFormat={filter.defaultTimeFormat}
            timeFormat={filter.timeFormat}
            timezone={filter.timezone}
          />
        ) : null}
      </TimeBottomWidgetInner>
    );
  };

  return React.memo(TimeWidget);
}

export default TimeWidgetFactory;
