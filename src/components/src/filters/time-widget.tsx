// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import {BottomWidgetInner} from '../common/styled-components';
import TimeRangeSliderFactory from '../common/time-range-slider';
import FloatingTimeDisplayFactory from '../common/animation-control/floating-time-display';
import {timeRangeSliderFieldsSelector} from './time-range-filter';
import {TimeWidgetProps} from './types';
import TimeWidgetTopFactory from './time-widget-top';

const TimeBottomWidgetInner = styled(BottomWidgetInner)`
  padding: 6px 32px 24px 32px;
`;

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
        {/* Once AnimationControl is able to display large timeline*/}
        {/* we can replace TimeRangeSlider with AnimationControl*/}
        <TimeRangeSlider
          {...timeRangeSlideProps}
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
