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

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {
  SelectTextBold,
  IconRoundSmall,
  CenterFlexbox,
  BottomWidgetInner
} from 'components/common/styled-components';
import {Close, Clock, LineChart} from 'components/common/icons';
import TimeRangeSliderFactory from 'components/common/time-range-slider';
import FieldSelectorFactory from 'components/common/field-selector';
import FloatingTimeDisplayFactory from 'components/common/animation-control/floating-time-display';
import {Field} from '../../utils';
import {timeRangeSliderFieldsSelector} from './time-range-filter';
import {TimeWidgetProps, TimeWidgetTopProps, TopSectionWrapperProps} from './types';

const TOP_SECTION_HEIGHT = '36px';

const TimeBottomWidgetInner = styled(BottomWidgetInner)`
  padding: 6px 32px 24px 32px;
`;
const TopSectionWrapper = styled.div.attrs({
  className: 'time-widget--top'
})<TopSectionWrapperProps>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: ${props => props.theme.labelColor};
  height: ${TOP_SECTION_HEIGHT};

  .bottom-widget__y-axis {
    flex-grow: 1;
    margin-left: 20px;
  }

  .bottom-widget__field-select {
    width: 160px;
    display: inline-block;

    .item-selector__dropdown {
      background: transparent;
      padding: 4px 10px 4px 4px;
      border-color: transparent;

      :active,
      :focus,
      &.focus,
      &.active {
        background: transparent;
        border-color: transparent;
      }
    }

    .item-selector__dropdown:hover {
      background: transparent;
      border-color: transparent;

      .item-selector__dropdown__value {
        color: ${props =>
          props.hoverColor ? props.theme[props.hoverColor] : props.theme.textColorHl};
      }
    }
  }

  .animation-control__speed-control {
    margin-right: -12px;

    .animation-control__speed-slider {
      right: calc(0% - 48px);
    }
  }
`;

const StyledTitle = styled(CenterFlexbox)`
  flex-grow: 0;
  color: ${props => props.theme.textColor};
  margin-right: 10px;

  .bottom-widget__icon {
    margin-right: 6px;
  }
  .bottom-widget__icon.speed {
    margin-right: 0;
  }
`;

TimeWidgetTopFactory.deps = [FieldSelectorFactory];
export function TimeWidgetTopFactory(FieldSelector: ReturnType<typeof FieldSelectorFactory>) {
  const TimeWidgetTop: React.FC<TimeWidgetTopProps> = ({
    filter,
    readOnly,
    datasets,
    setFilterPlot,
    index,
    onClose
  }) => {
    const yAxisFields = useMemo(
      () =>
        ((datasets[filter.dataId[0]] || {}).fields || []).filter(
          (f: Field) => f.type === 'integer' || f.type === 'real'
        ),
      [datasets, filter.dataId]
    );
    const _setFilterPlotYAxis = useCallback(value => setFilterPlot(index, {yAxis: value}), [
      setFilterPlot,
      index
    ]);
    return (
      <TopSectionWrapper>
        <StyledTitle className="bottom-widget__field">
          <CenterFlexbox className="bottom-widget__icon">
            <Clock height="15px" />
          </CenterFlexbox>
          <SelectTextBold>{filter.name}</SelectTextBold>
        </StyledTitle>
        <StyledTitle className="bottom-widget__y-axis">
          <CenterFlexbox className="bottom-widget__icon">
            <LineChart height="15px" />
          </CenterFlexbox>
          <div className="bottom-widget__field-select">
            <FieldSelector
              fields={yAxisFields}
              placement="top"
              value={filter.yAxis ? filter.yAxis.name : null}
              onSelect={_setFilterPlotYAxis}
              placeholder="placeholder.yAxis"
              erasable
              showToken={false}
            />
          </div>
        </StyledTitle>
        {!readOnly ? (
          <CenterFlexbox>
            <IconRoundSmall>
              <Close height="12px" onClick={onClose} />
            </IconRoundSmall>
          </CenterFlexbox>
        ) : null}
      </TopSectionWrapper>
    );
  };
  return TimeWidgetTop;
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
    index,
    readOnly,
    showTimeDisplay,
    setFilterAnimationTime,
    resetAnimation,
    isAnimatable,
    updateAnimationSpeed,
    toggleAnimation,
    enlargeFilter,
    setFilterPlot,
    setFilterAnimationWindow
  }: TimeWidgetProps) => {
    const _updateAnimationSpeed = useCallback(speed => updateAnimationSpeed(index, speed), [
      updateAnimationSpeed,
      index
    ]);

    const _toggleAnimation = useCallback(() => toggleAnimation(index), [toggleAnimation, index]);

    const _onClose = useCallback(() => enlargeFilter(index), [enlargeFilter, index]);

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
          onClose={_onClose}
        />
        <TimeRangeSlider
          {...timeRangeSliderFieldsSelector(filter)}
          onChange={timeSliderOnChange}
          toggleAnimation={_toggleAnimation}
          updateAnimationSpeed={_updateAnimationSpeed}
          setFilterAnimationWindow={_setFilterAnimationWindow}
          hideTimeTitle={showTimeDisplay}
          resetAnimation={resetAnimation}
          isAnimatable={isAnimatable}
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
