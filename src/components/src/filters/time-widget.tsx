// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import {DEFAULT_TIME_FORMAT, FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import {clamp, datetimeFormatter} from '@kepler.gl/utils';
import {BottomWidgetInner, Button, PanelLabel} from '../common/styled-components';
import TimeRangeSliderFactory from '../common/time-range-slider';
import FloatingTimeDisplayFactory from '../common/animation-control/floating-time-display';
import {timeRangeSliderFieldsSelector} from './time-range-filter';
import {TimeWidgetProps} from './types';
import TimeWidgetTopFactory from './time-widget-top';
import TimeWidgetSettingsFactory from './time-widget-settings';
import {rangesEqual, clampRange, clampWindowToDomain} from '../common/timeline-helpers';

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

  .side-panel-panel__label {
    margin-bottom: 0;
  }
`;

const TimelineStatusRange = styled.span`
  color: ${props => props.theme.textColorHl || props.theme.textColor};
  font-weight: 500;
  white-space: nowrap;
`;

TimeWidgetFactory.deps = [
  TimeRangeSliderFactory,
  FloatingTimeDisplayFactory,
  TimeWidgetTopFactory,
  TimeWidgetSettingsFactory
];

function TimeWidgetFactory(
  TimeRangeSlider: ReturnType<typeof TimeRangeSliderFactory>,
  FloatingTimeDisplay: ReturnType<typeof FloatingTimeDisplayFactory>,
  TimeWidgetTop: ReturnType<typeof TimeWidgetTopFactory>,
  TimeWidgetSettings: ReturnType<typeof TimeWidgetSettingsFactory>
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
    exportAnimation,
    setFilterPlot,
    setFilterAnimationWindow,
    animationConfig,
    timeline
  }: TimeWidgetProps) => {
    const [showSettings, setShowSettings] = useState(false);

    const _updateAnimationSpeed = useCallback(
      speed => updateAnimationSpeed(index, speed),
      [updateAnimationSpeed, index]
    );

    const _toggleAnimation = useCallback(() => toggleAnimation(index), [toggleAnimation, index]);
    const _exportAnimation = useCallback(() => exportAnimation?.(), [exportAnimation]);

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

    const _onToggleSettings = useCallback(() => {
      setShowSettings(prev => !prev);
    }, []);

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fullDomain]);

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

    const handleWindowZoom = useCallback(
      (factor: number, center: number) => {
        if (!fullDomain) {
          return;
        }
        const domainRange: [number, number] = timelineDomain ?? fullDomain;
        const domainWidth = domainRange[1] - domainRange[0];
        if (!(domainWidth > 0)) {
          return;
        }
        const windowWidth = filterEnd - filterStart;
        if (!(windowWidth > 0)) {
          return;
        }
        const minWidth = Math.max(domainWidth / 100, 1);
        const nextWidth = clamp([minWidth, domainWidth], windowWidth / factor);
        const clampedCenter = clamp(domainRange, center);
        const ratio = clamp(
          [0, 1],
          windowWidth > 0 ? (clampedCenter - filterStart) / windowWidth : 0.5
        );
        const nextStart = clampedCenter - ratio * nextWidth;
        const nextEnd = nextStart + nextWidth;
        const [clampedStart, clampedEnd] = clampWindowToDomain(nextStart, nextEnd, domainRange);
        if (clampedStart !== filterStart || clampedEnd !== filterEnd) {
          setFilterAnimationTime(index, 'value', [clampedStart, clampedEnd]);
        }
      },
      [
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

    useEffect(() => {
      const node = timelineContainerRef.current;
      if (!node) {
        return undefined;
      }
      const handleNativeWheel = (event: WheelEvent) => {
        if (isMinified || !sliderDomain) {
          return;
        }
        const isPinch =
          event.ctrlKey || event.metaKey || Math.abs(event.deltaZ || 0) > 0;
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
        const sliderTrack = node.querySelector(
          '.kg-range-slider__slider'
        ) as HTMLElement | null;
        const rect = sliderTrack?.getBoundingClientRect() ?? node.getBoundingClientRect();
        if (!rect || rect.width === 0) {
          return;
        }
        const ratio = clamp([0, 1], (event.clientX - rect.left) / rect.width);
        const center = sliderDomain[0] + ratio * (sliderDomain[1] - sliderDomain[0]);
        zoomFn(factor, center);
      };
      node.addEventListener('wheel', handleNativeWheel, {passive: false});
      return () => node.removeEventListener('wheel', handleNativeWheel);
    }, [isMinified, sliderDomain, throttledTimelineZoom, throttledWindowZoom]);

    useEffect(() => {
      if (isMinified) {
        return undefined;
      }
      const handler = (event: KeyboardEvent) => {
        if (!(event.ctrlKey || event.metaKey)) {
          return;
        }
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
          return;
        }
        const activeEl = document.activeElement;
        if (
          activeEl instanceof HTMLInputElement ||
          activeEl instanceof HTMLTextAreaElement ||
          (activeEl as HTMLElement)?.isContentEditable
        ) {
          return;
        }
        const domainRange = timelineDomain ?? fullDomain;
        if (!domainRange) {
          return;
        }
        const windowWidth = filterEnd - filterStart;
        if (!(windowWidth > 0)) {
          return;
        }
        event.preventDefault();
        let nextStart: number;
        let nextEnd: number;
        if (event.key === 'ArrowRight') {
          nextStart = filterEnd;
          nextEnd = filterEnd + windowWidth;
        } else {
          nextStart = filterStart - windowWidth;
          nextEnd = filterStart;
        }
        [nextStart, nextEnd] = clampWindowToDomain(nextStart, nextEnd, domainRange);
        if (nextStart !== filterStart || nextEnd !== filterEnd) {
          setFilterAnimationTime(index, 'value', [nextStart, nextEnd]);
        }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, [filterEnd, filterStart, fullDomain, index, isMinified, setFilterAnimationTime, timelineDomain]);

    const handleResetTimeline = useCallback(() => {
      setTimelineDomain(null);
    }, []);

    return (
      <TimeBottomWidgetInner className="bottom-widget--inner">
        <TimeWidgetTop
          filter={filter}
          readOnly={readOnly}
          onClose={onClose}
          onToggleMinify={onToggleMinify}
          onToggleSettings={_onToggleSettings}
          isMinified={isMinified}
        />
        {showSettings && !isMinified ? (
          <TimeWidgetSettings filter={filter} datasets={datasets} setFilterPlot={_setFilterPlot} />
        ) : null}
        <TimelineSection>
          {timelineZoomed && timelineRangeLabel ? (
            <TimelineStatusBar>
              <PanelLabel>Showing</PanelLabel>
              <TimelineStatusRange>{timelineRangeLabel}</TimelineStatusRange>
              <Button
                small
                secondary
                type="button"
                onClick={handleResetTimeline}
                aria-label="Reset timeline selection"
                data-testid="time-widget-timeline-reset"
              >
                Reset
              </Button>
            </TimelineStatusBar>
          ) : null}
          <TimelineContainer ref={timelineContainerRef}>
            <TimeRangeSlider
              {...timeRangeSlideProps}
              domain={sliderDomain}
              onChange={timeSliderOnChange}
              toggleAnimation={_toggleAnimation}
              exportAnimation={_exportAnimation}
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
