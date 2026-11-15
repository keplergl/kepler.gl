// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled, {DefaultTheme, ThemeProvider} from 'styled-components';
import throttle from 'es-toolkit/compat/throttle';
import {
  ANIMATION_WINDOW,
  DEFAULT_TIME_FORMAT,
  FILTER_TYPES,
  FILTER_VIEW_TYPES
} from '@kepler.gl/constants';
import {
  clamp,
  datetimeFormatter,
  formatNumber,
  getNumericRangeMinimum,
  getTimelineFromFilter,
  intervalBinFromMarks
} from '@kepler.gl/utils';
import {BottomWidgetInner, Button, PanelLabel} from '../common/styled-components';
import TimeRangeSliderFactory from '../common/time-range-slider';
import FloatingTimeDisplayFactory from '../common/animation-control/floating-time-display';
import {timeRangeSliderFieldsSelector} from './time-range-filter';
import {TimeWidgetProps} from './types';
import TimeWidgetTopFactory from './time-widget-top';
import TimeWidgetSettingsFactory from './time-widget-settings';
import {rangesEqual, clampRange, clampWindowToDomain} from '../common/timeline-helpers';

const TimeBottomWidgetInner = styled(BottomWidgetInner)`
  padding: 0;
  border: 0;
  min-width: 0;

  .time-widget__hide-settings {
    opacity: 0;
    pointer-events: none;
  }

  &:hover .time-widget__hide-settings,
  .time-widget__hide-settings:focus-visible {
    opacity: 1;
    pointer-events: auto;
  }

  @media (hover: none) {
    .time-widget__hide-settings {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .animation-widget--inner .animation-control__time-slider {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 8px;
    min-width: 0;
    height: auto;
  }

  .animation-control__slider {
    grid-column: 1 / -1;
    grid-row: 1;
    min-width: 0;
    margin: 0;

    .kg-range-slider__bar {
      background-color: ${props => props.theme.histogramFillInRange};
    }

    .kg-range-slider__bar--active {
      background-color: ${props => props.theme.sliderBarHoverColor};
    }
  }

  .animation-control__time-domain {
    grid-row: 2;
    position: static;
    color: ${props => props.theme.textColor};
    font-size: ${props => props.theme.selectFontSize};
    line-height: 16px;
    white-space: normal;
    overflow-wrap: anywhere;

    &.domain-end {
      text-align: right;
    }
  }
`;

const TimelineSection = styled.div`
  position: relative;
  margin: 4px 12px 12px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
`;

const TimelineContainer = styled.div`
  touch-action: none;
`;

// The playback row already separates the chart from the title. Remove the
// legacy top plot margin and its reserved height only within this widget.
const timelinePlotTheme = (theme: DefaultTheme) => ({
  ...theme,
  rangePlotMargin: {...theme.rangePlotMargin, top: 0},
  rangePlotMarginLarge: {...theme.rangePlotMarginLarge, top: 0},
  rangePlotContainerH: Math.max(
    theme.rangePlotH,
    theme.rangePlotContainerH - theme.rangePlotMargin.top
  ),
  rangePlotContainerHLarge: Math.max(
    theme.rangePlotHLarge,
    theme.rangePlotContainerHLarge - theme.rangePlotMarginLarge.top
  ),
  rangePlotContainerHLargePalm: Math.max(
    theme.rangePlotHLargePalm,
    theme.rangePlotContainerHLargePalm - theme.rangePlotMarginLarge.top
  )
});

const TimelineStatusBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 12px;
  font-size: 11px;
  color: ${props => props.theme.subtextColor};

  .side-panel-panel__label {
    margin-bottom: 0;
  }
`;

const TimelineStatusRange = styled.span`
  color: ${props => props.theme.textColorHl || props.theme.textColor};
  font-weight: 500;
  overflow-wrap: anywhere;
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
    setFilterAnimationTime,
    onClose,
    onToggleMinify,
    resetAnimation,
    isAnimatable,
    updateAnimationSpeed,
    toggleAnimation,
    exportAnimation,
    setFilterPlot,
    setFilterAnimationTimeConfig,
    setFilterAnimationWindow,
    animationConfig,
    timeline
  }: TimeWidgetProps) => {
    const [showSettings, setShowSettings] = useState(false);
    const widgetRef = useRef<HTMLDivElement>(null);
    const isTimeFilter = filter.type === FILTER_TYPES.timeRange;
    const timeFilter = isTimeFilter ? filter : null;
    const filterTimeline = useMemo(
      () => timeline || getTimelineFromFilter(filter),
      [filter, timeline]
    );

    const _updateAnimationSpeed = useCallback(
      speed => updateAnimationSpeed(index, speed),
      [updateAnimationSpeed, index]
    );

    const _toggleAnimation = useCallback(() => toggleAnimation(index), [toggleAnimation, index]);
    const _exportAnimation = useCallback(() => exportAnimation?.(), [exportAnimation]);

    const isMinified = useMemo(() => filter.view === FILTER_VIEW_TYPES.minified, [filter]);
    const timeDisplayConfig = isMinified ? filterTimeline : timeFilter;

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

    const _onTimezoneChange = useCallback(
      (timezone: string) => setFilterAnimationTimeConfig(index, {timezone}),
      [index, setFilterAnimationTimeConfig]
    );

    const _onTimeFormatChange = useCallback(
      (timeFormat: string) => setFilterAnimationTimeConfig(index, {timeFormat}),
      [index, setFilterAnimationTimeConfig]
    );

    const _onToggleSettings = useCallback(() => {
      setShowSettings(prev => !prev);
    }, []);

    const _hideSettings = useCallback(() => {
      setShowSettings(false);
      widgetRef.current?.querySelector<HTMLButtonElement>('button.time-widget-settings')?.focus();
    }, []);

    const timeRangeSlideProps = useMemo(
      () => timeRangeSliderFieldsSelector(filter, datasets, layers),
      [filter, datasets, layers]
    );

    const fullDomain = Array.isArray(timeRangeSlideProps.domain)
      ? (timeRangeSlideProps.domain as [number, number])
      : null;
    const minimumRangeWidth = useMemo(() => {
      if (isTimeFilter || !fullDomain) {
        return 1;
      }
      return getNumericRangeMinimum(fullDomain);
    }, [fullDomain, isTimeFilter]);
    const rangeEqualityEpsilon = isTimeFilter ? 1 : 0;

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
        const clamped = clampRange(timelineDomain, fullDomain, minimumRangeWidth);
        if (!rangesEqual(clamped, timelineDomain, rangeEqualityEpsilon)) {
          setTimelineDomain(clamped);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fullDomain, minimumRangeWidth, rangeEqualityEpsilon]);

    const sliderDomain = timelineDomain ?? fullDomain ?? undefined;
    const displayedTimelineDomain = sliderDomain ?? null;

    const timelineZoomed = useMemo(() => {
      if (!timelineDomain || !fullDomain) {
        return false;
      }
      return !rangesEqual(timelineDomain, fullDomain, rangeEqualityEpsilon);
    }, [timelineDomain, fullDomain, rangeEqualityEpsilon]);

    const timeFormat =
      timeRangeSlideProps.timeFormat ||
      timeFilter?.timeFormat ||
      timeFilter?.defaultTimeFormat ||
      DEFAULT_TIME_FORMAT;
    const formatTimestamp = useMemo(() => {
      const formatter = datetimeFormatter(timeFilter?.timezone);
      return (value: number) => formatter(timeFormat)(value);
    }, [timeFilter?.timezone, timeFormat]);
    const formatNumeric = useCallback(
      (value: number) => formatNumber(value, filter.fieldType),
      [filter.fieldType]
    );
    const formatTimelineValue = isTimeFilter ? formatTimestamp : formatNumeric;

    const timelineRangeLabel = useMemo(() => {
      if (!displayedTimelineDomain) {
        return '';
      }
      return `${formatTimelineValue(displayedTimelineDomain[0])} – ${formatTimelineValue(
        displayedTimelineDomain[1]
      )}`;
    }, [displayedTimelineDomain, formatTimelineValue]);

    const [filterStart, filterEnd] = filter.value;

    const handleWindowZoom = useCallback(
      (factor: number, center: number) => {
        // Interval mode keeps the selection on one histogram bin.
        if (!fullDomain || filter.animationWindow === ANIMATION_WINDOW.interval) {
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
        const minWidth = isTimeFilter
          ? Math.max(domainWidth / 100, 1)
          : Math.max(domainWidth / 100, minimumRangeWidth);
        const nextWidth = clamp([minWidth, domainWidth], windowWidth / factor);
        const clampedCenter = clamp(domainRange, center);
        const ratio = clamp(
          [0, 1],
          windowWidth > 0 ? (clampedCenter - filterStart) / windowWidth : 0.5
        );
        const nextStart = clampedCenter - ratio * nextWidth;
        const nextEnd = nextStart + nextWidth;
        const [clampedStart, clampedEnd] = clampWindowToDomain(
          nextStart,
          nextEnd,
          domainRange,
          minimumRangeWidth
        );
        if (clampedStart !== filterStart || clampedEnd !== filterEnd) {
          setFilterAnimationTime(index, 'value', [clampedStart, clampedEnd]);
        }
      },
      [
        filter.animationWindow,
        filterEnd,
        filterStart,
        fullDomain,
        index,
        isTimeFilter,
        minimumRangeWidth,
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
        const baseWidth = isTimeFilter
          ? Math.max(domainRange[1] - domainRange[0], 1)
          : domainRange[1] - domainRange[0];
        const clampedCenter = clamp(domainRange, center);
        const minWidth = isTimeFilter
          ? Math.max(fullWidth / 20, 1)
          : Math.max(fullWidth / 20, minimumRangeWidth);
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
        const nextRange: [number, number] = clampRange(
          [nextStart, nextEnd],
          fullDomain,
          minimumRangeWidth
        );
        setTimelineDomain(prev =>
          rangesEqual(prev, nextRange, rangeEqualityEpsilon) ? prev : nextRange
        );

        // Pinch-zoom only changes the visible domain. The selected bin stays put.
        if (filter.animationWindow === ANIMATION_WINDOW.interval) {
          return;
        }

        let windowStart = filterStart;
        let windowEnd = filterEnd;
        const rangeWidth = nextRange[1] - nextRange[0];
        if (rangeWidth < windowEnd - windowStart) {
          const windowWidth = Math.max(windowEnd - windowStart, minimumRangeWidth);
          const windowRatio = clamp([0, 1], (clampedCenter - windowStart) / windowWidth);
          const adjustedStart = clampedCenter - windowRatio * rangeWidth;
          const adjustedEnd = clampedCenter + (1 - windowRatio) * rangeWidth;
          [windowStart, windowEnd] = clampWindowToDomain(
            adjustedStart,
            adjustedEnd,
            nextRange,
            minimumRangeWidth
          );
        } else {
          [windowStart, windowEnd] = clampWindowToDomain(
            windowStart,
            windowEnd,
            nextRange,
            minimumRangeWidth
          );
        }
        if (windowStart !== filterStart || windowEnd !== filterEnd) {
          setFilterAnimationTime(index, 'value', [windowStart, windowEnd]);
        }
      },
      [
        filter.animationWindow,
        filterEnd,
        filterStart,
        fullDomain,
        index,
        isTimeFilter,
        minimumRangeWidth,
        rangeEqualityEpsilon,
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
        // Overlays such as the animation JSON editor sit inside this container.
        // Don't steal their scroll / pointer input for timeline zoom.
        const target = event.target;
        if (
          target instanceof Element &&
          target.closest(
            'textarea, input, select, [data-testid="json-editor"], .animation-json-editor'
          )
        ) {
          return;
        }
        const isPinch = event.ctrlKey || event.metaKey || Math.abs(event.deltaZ || 0) > 0;
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
        const sliderTrack = node.querySelector('.kg-range-slider__slider') as HTMLElement | null;
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

    const stepRanges = useMemo(() => {
      const domainRange = timelineDomain ?? fullDomain;
      const nextRange = (direction: -1 | 1): [number, number] | null => {
        if (
          !domainRange ||
          !domainRange.every(Number.isFinite) ||
          !Number.isFinite(filterStart) ||
          !Number.isFinite(filterEnd)
        ) {
          return null;
        }
        if (filter.animationWindow === ANIMATION_WINDOW.interval) {
          const marks = filterTimeline.marks || [];
          const currentIdx = marks.indexOf(intervalBinFromMarks(marks, filterStart)[0]);
          const nextIdx = currentIdx + direction;
          if (currentIdx < 0 || nextIdx < 0 || nextIdx >= marks.length - 1) {
            return null;
          }
          return intervalBinFromMarks(marks, marks[nextIdx], isTimeFilter ? 1 : 0);
        }
        const windowWidth = filterEnd - filterStart;
        if (!(windowWidth > 0)) {
          return null;
        }
        const range = clampWindowToDomain(
          filterStart + direction * windowWidth,
          filterEnd + direction * windowWidth,
          domainRange,
          minimumRangeWidth
        );
        return range[0] === filterStart && range[1] === filterEnd ? null : range;
      };
      return {backward: nextRange(-1), forward: nextRange(1)};
    }, [
      filter.animationWindow,
      filterEnd,
      filterStart,
      fullDomain,
      isTimeFilter,
      minimumRangeWidth,
      filterTimeline.marks,
      timelineDomain
    ]);

    const stepSelection = useCallback(
      (direction: 'backward' | 'forward') => {
        const range = stepRanges[direction];
        if (!isAnimatable || !range) {
          return;
        }
        setFilterAnimationTime(index, 'value', range);
      },
      [index, isAnimatable, setFilterAnimationTime, stepRanges]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (
          event.defaultPrevented ||
          !(event.ctrlKey || event.metaKey) ||
          (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') ||
          !isAnimatable
        ) {
          return;
        }
        const target = event.target;
        // Keep shortcuts local to the focused timeline and leave editing and
        // portaled dialogs to their own keyboard handlers.
        if (
          !(target instanceof Element) ||
          !event.currentTarget.contains(target) ||
          target.closest('input, textarea, select, [contenteditable], [role="textbox"]')
        ) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        stepSelection(event.key === 'ArrowRight' ? 'forward' : 'backward');
      },
      [isAnimatable, stepSelection]
    );

    const handleResetTimeline = useCallback(() => {
      setTimelineDomain(null);
    }, []);

    return (
      <TimeBottomWidgetInner
        className="bottom-widget--inner"
        ref={widgetRef}
        onKeyDown={handleKeyDown}
      >
        <TimeWidgetTop
          filter={filter}
          readOnly={readOnly}
          onClose={onClose}
          onToggleMinify={onToggleMinify}
          onToggleSettings={_onToggleSettings}
          settingsOpen={showSettings && !isMinified}
          isMinified={isMinified}
          rangeDisplay={
            <FloatingTimeDisplay
              currentTime={isMinified ? filterTimeline.value : filter.value}
              defaultTimeFormat={timeDisplayConfig?.defaultTimeFormat}
              timeFormat={timeDisplayConfig?.timeFormat}
              timezone={timeDisplayConfig?.timezone}
              formatValue={isTimeFilter ? undefined : formatNumeric}
              displayLabel={
                isTimeFilter ? undefined : Array.isArray(filter.name) ? filter.name[0] : filter.name
              }
            />
          }
          playbackControls={{
            isAnimatable,
            isAnimating: filter.isAnimating,
            speed: isMinified ? filterTimeline.speed : filter.speed,
            animationWindow: isMinified ? filterTimeline.animationWindow : filter.animationWindow,
            toggleAnimation: _toggleAnimation,
            resetAnimation,
            stepBackward: () => stepSelection('backward'),
            stepForward: () => stepSelection('forward'),
            canStepBackward: Boolean(stepRanges.backward),
            canStepForward: Boolean(stepRanges.forward),
            updateAnimationSpeed: _updateAnimationSpeed,
            setFilterAnimationWindow: _setFilterAnimationWindow,
            exportAnimation: exportAnimation ? _exportAnimation : undefined
          }}
        />
        {showSettings && !isMinified ? (
          <TimeWidgetSettings
            onClose={_hideSettings}
            filter={filter}
            datasets={datasets}
            layers={layers}
            setFilterPlot={_setFilterPlot}
            onTimezoneChange={_onTimezoneChange}
            onTimeFormatChange={_onTimeFormatChange}
          />
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
          <TimelineContainer
            ref={timelineContainerRef}
            data-testid="time-widget-timeline-container"
          >
            <ThemeProvider theme={timelinePlotTheme}>
              <TimeRangeSlider
                {...timeRangeSlideProps}
                showControls={false}
                domain={sliderDomain}
                onChange={timeSliderOnChange}
                toggleAnimation={_toggleAnimation}
                exportAnimation={_exportAnimation}
                updateAnimationSpeed={_updateAnimationSpeed}
                setFilterAnimationWindow={_setFilterAnimationWindow}
                hideTimeTitle
                resetAnimation={resetAnimation}
                isAnimatable={isAnimatable}
                setFilterPlot={_setFilterPlot}
                animationConfig={animationConfig}
                isMinified={isMinified}
                timeline={filterTimeline}
                formatValue={isTimeFilter ? undefined : formatNumeric}
              />
            </ThemeProvider>
          </TimelineContainer>
        </TimelineSection>
      </TimeBottomWidgetInner>
    );
  };

  return React.memo(TimeWidget);
}

export default TimeWidgetFactory;
