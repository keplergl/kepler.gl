import React from 'react';
import TimeRangeSlider from 'components/common/time-range-slider';

/*
 * TimeRangeFilter -> TimeRangeSlider -> RangeSlider
 */
const TimeRangeFilter = ({
  filter,
  setFilter,
  isAnyFilterAnimating,
  toggleAnimation
}) => (
  <div>
    <TimeRangeSlider
      domain={filter.domain}
      value={filter.value}
      plotType={filter.plotType}
      lineChart={filter.lineChart}
      step={filter.step}
      speed={filter.speed}
      histogram={filter.enlarged ? filter.enlargedHistogram : filter.histogram}
      onChange={setFilter}
      toggleAnimation={toggleAnimation}
      isAnimatable={!isAnyFilterAnimating || filter.isAnimating}
      isEnlarged={filter.enlarged}
    />
  </div>
);

export default TimeRangeFilter;
