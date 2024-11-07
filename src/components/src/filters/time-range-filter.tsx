// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import TimeRangeSliderFactory from '../common/time-range-slider';
import {DEFAULT_TIME_FORMAT, FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import {TimeRangeFilter} from '@kepler.gl/types';
import {Datasets} from '@kepler.gl/table';
import {Layer} from '@kepler.gl/layers';
import {TimeRangeFilterProps} from './types';
/*
 * TimeRangeFilter -> TimeRangeSlider -> RangeSlider
 */
export function timeRangeSliderFieldsSelector(
  filter: TimeRangeFilter,
  datasets: Datasets,
  layers: readonly Layer[]
) {
  const hasUserFormat = typeof filter.timeFormat === 'string';
  const timeFormat =
    (hasUserFormat ? filter.timeFormat : filter.defaultTimeFormat) || DEFAULT_TIME_FORMAT;

  return {
    id: filter.id,
    domain: filter.domain,
    timeBins: filter.timeBins,
    value: filter.value,
    plotType: filter.plotType,
    lineChart: filter.lineChart,
    yAxis: filter.yAxis,
    step: filter.step,
    speed: filter.speed,
    animationWindow: filter.animationWindow,
    isAnimating: filter.isAnimating,
    timezone: filter.timezone,
    timeFormat,
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
    hideTimeTitle,
    timeline
  }) => (
    <TimeRangeSlider
      {...timeRangeSliderFieldsSelector(filter, datasets, layers)}
      onChange={setFilter}
      setFilterPlot={setFilterPlot}
      toggleAnimation={toggleAnimation}
      isAnimatable={isAnimatable}
      hideTimeTitle={hideTimeTitle}
      timeline={timeline}
    />
  );

  return TimeRangeFilterComponent;
}

export default TimeRangeFilterFactory;
