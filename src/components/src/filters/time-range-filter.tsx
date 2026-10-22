// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import TimeRangeSliderFactory from '../common/time-range-slider';
import {DEFAULT_TIME_FORMAT, FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import {RangeFilter, TimeRangeFilter} from '@kepler.gl/types';
import {Datasets} from '@kepler.gl/table';
import {Layer} from '@kepler.gl/layers';
import {TimeRangeFilterProps} from './types';
/*
 * TimeRangeFilter -> TimeRangeSlider -> RangeSlider
 */
export function timeRangeSliderFieldsSelector(
  filter: TimeRangeFilter | RangeFilter,
  datasets: Datasets,
  layers: readonly Layer[]
) {
  const isTime = filter.type === 'timeRange';
  const timeFilter = isTime ? filter : null;
  const hasUserFormat = typeof timeFilter?.timeFormat === 'string';
  const timeFormat = isTime
    ? (hasUserFormat ? timeFilter?.timeFormat : timeFilter?.defaultTimeFormat) ||
      DEFAULT_TIME_FORMAT
    : '';

  return {
    id: filter.id,
    domain: filter.domain as [number, number],
    timeBins: timeFilter?.timeBins,
    bins: !isTime ? filter.bins : undefined,
    value: filter.value,
    plotType: filter.plotType,
    lineChart: filter.lineChart,
    yAxis: filter.yAxis,
    step: filter.step,
    speed: filter.speed,
    animationWindow: filter.animationWindow,
    isAnimating: filter.isAnimating,
    timezone: timeFilter?.timezone,
    timeFormat,
    isTime,
    filter,
    datasets,
    layers,
    isMinified: filter.view === FILTER_VIEW_TYPES.minified,
    isEnlarged: filter.view === FILTER_VIEW_TYPES.enlarged
  };
}

TimeRangeFilterFactory.deps = [TimeRangeSliderFactory];

function TimeRangeFilterFactory(TimeRangeSlider: ReturnType<typeof TimeRangeSliderFactory>) {
  const TimeRangeFilterComponent: React.FC<TimeRangeFilterProps> = ({
    filter,
    datasets,
    layers,
    setFilter,
    setFilterPlot,
    isAnimatable,
    toggleAnimation,
    exportAnimation,
    hideTimeTitle,
    timeline
  }) => (
    <TimeRangeSlider
      {...timeRangeSliderFieldsSelector(filter, datasets, layers)}
      onChange={setFilter}
      setFilterPlot={setFilterPlot}
      toggleAnimation={toggleAnimation}
      exportAnimation={exportAnimation}
      isAnimatable={isAnimatable}
      hideTimeTitle={hideTimeTitle}
      timeline={timeline}
    />
  );

  return TimeRangeFilterComponent;
}

export default TimeRangeFilterFactory;
