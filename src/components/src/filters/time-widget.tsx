// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
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
    index,
    readOnly,
    showTimeDisplay,
    setFilterAnimationTime,
    onClose,
    resetAnimation,
    isAnimatable,
    updateAnimationSpeed,
    toggleAnimation,
    setFilterPlot,
    setFilterAnimationWindow,
    timeline
  }: TimeWidgetProps) => {
    const [isMinified, setMinified] = useState(false);

    const _updateAnimationSpeed = useCallback(speed => updateAnimationSpeed(index, speed), [
      updateAnimationSpeed,
      index
    ]);

    const _toggleAnimation = useCallback(() => toggleAnimation(index), [toggleAnimation, index]);

    const _onToggleMinify = useCallback(() => setMinified(!isMinified), [setMinified, isMinified]);

    const _setFilterAnimationWindow = useCallback(
      animationWindow => setFilterAnimationWindow({id: filter.id, animationWindow}),
      [setFilterAnimationWindow, filter.id]
    );

    const timeSliderOnChange = useCallback(value => setFilterAnimationTime(index, 'value', value), [
      setFilterAnimationTime,
      index
    ]);

    return (
      <TimeBottomWidgetInner className="bottom-widget--inner">
        <TimeWidgetTop
          filter={filter}
          readOnly={readOnly}
          datasets={datasets}
          setFilterPlot={setFilterPlot}
          index={index}
          onClose={onClose}
          onToggleMinify={_onToggleMinify}
          isMinified={isMinified}
        />
        {/* Once AnimationControl is able to display large timeline*/}
        {/* we can replace TimeRangeSlider with AnimationControl*/}
        <TimeRangeSlider
          {...timeRangeSliderFieldsSelector(filter)}
          onChange={timeSliderOnChange}
          toggleAnimation={_toggleAnimation}
          updateAnimationSpeed={_updateAnimationSpeed}
          setFilterAnimationWindow={_setFilterAnimationWindow}
          hideTimeTitle={showTimeDisplay}
          resetAnimation={resetAnimation}
          isAnimatable={isAnimatable}
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
