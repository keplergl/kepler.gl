// Copyright (c) 2020 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import throttle from 'lodash.throttle';
import styled from 'styled-components';
import {createSelector} from 'reselect';

import {Minus} from 'components/common/icons';
import RangeSliderFactory from 'components/common/range-slider';
import TimeSliderMarkerFactory from 'components/common/time-slider-marker';
import PlaybackControlsFactory from 'components/common/animation-control/playback-controls';
import AnimationControllerFactory from 'components/common/animation-control/animation-controller';

import {DEFAULT_TIME_FORMAT} from 'constants/default-settings';

const animationControlWidth = 140;

const StyledSliderContainer = styled.div`
  align-items: flex-end;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .time-range-slider__control {
    margin-bottom: 12px;
    margin-right: 30px;
  }

  .playback-control-button {
    padding: 9px 12px;
  }
`;

TimeRangeSliderFactory.deps = [
  PlaybackControlsFactory,
  RangeSliderFactory,
  TimeSliderMarkerFactory,
  AnimationControllerFactory
];

export default function TimeRangeSliderFactory(
  PlaybackControls,
  RangeSlider,
  TimeSliderMarker,
  AnimationController
) {
  class TimeRangeSlider extends Component {
    static propTypes = {
      onChange: PropTypes.func.isRequired,
      domain: PropTypes.arrayOf(PropTypes.number).isRequired,
      value: PropTypes.arrayOf(PropTypes.number).isRequired,
      step: PropTypes.number.isRequired,
      plotType: PropTypes.string,
      histogram: PropTypes.arrayOf(PropTypes.any),
      lineChart: PropTypes.object,
      toggleAnimation: PropTypes.func.isRequired,
      isAnimatable: PropTypes.bool,
      isEnlarged: PropTypes.bool,
      speed: PropTypes.number,
      timeFormat: PropTypes.string,
      hideTimeTitle: PropTypes.bool
    };

    constructor(props) {
      super(props);
      this._sliderThrottle = throttle((...value) => this.props.onChange(...value), 20);
    }

    timeSelector = props => props.currentTime;
    formatSelector = props => props.format;
    displayTimeSelector = createSelector(
      this.timeSelector,
      this.formatSelector,
      (currentTime, format) => {
        const groupTime = Array.isArray(currentTime) ? currentTime : [currentTime];
        return groupTime.reduce(
          (accu, curr) => {
            const displayDateTime = moment.utc(curr).format(format);
            const [displayDate, displayTime] = displayDateTime.split(' ');

            if (!accu.displayDate.includes(displayDate)) {
              accu.displayDate.push(displayDate);
            }
            accu.displayTime.push(displayTime);

            return accu;
          },
          {displayDate: [], displayTime: []}
        );
      }
    );

    _sliderUpdate = args => {
      this._sliderThrottle.cancel();
      this._sliderThrottle(args);
    };

    render() {
      const {domain, value, isEnlarged, hideTimeTitle} = this.props;

      return (
        <div className="time-range-slider">
          {!hideTimeTitle ? (
            <TimeTitle timeFormat={this.props.timeFormat} value={value} isEnlarged={isEnlarged} />
          ) : null}
          <StyledSliderContainer className="time-range-slider__container" isEnlarged={isEnlarged}>
            {isEnlarged ? (
              <AnimationController
                value={this.props.value}
                domain={this.props.domain}
                speed={this.props.speed}
                startAnimation={this.props.toggleAnimation}
                pauseAnimation={this.props.toggleAnimation}
                updateAnimation={this.props.onChange}
              >
                {(isAnimating, start, pause, reset) => (
                  <PlaybackControls
                    isAnimatable={this.props.isAnimatable}
                    isAnimating={isAnimating}
                    width={animationControlWidth}
                    pauseAnimation={pause}
                    resetAnimation={reset}
                    startAnimation={start}
                    buttonHeight="12px"
                    buttonStyle="secondary"
                  />
                )}
              </AnimationController>
            ) : null}
            <div
              style={{
                width: isEnlarged ? `calc(100% - ${animationControlWidth}px)` : '100%'
              }}
            >
              <RangeSlider
                range={domain}
                value0={value[0]}
                value1={value[1]}
                histogram={this.props.histogram}
                lineChart={this.props.lineChart}
                plotType={this.props.plotType}
                isEnlarged={isEnlarged}
                showInput={false}
                step={this.props.step}
                onChange={this._sliderUpdate}
                xAxis={TimeSliderMarker}
              />
            </div>
          </StyledSliderContainer>
        </div>
      );
    }
  }

  TimeRangeSlider.defaultProps = {
    timeFormat: DEFAULT_TIME_FORMAT
  };

  return TimeRangeSlider;
}

const TimeValueWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: ${props => props.theme.timeTitleFontSize};
  justify-content: ${props => (props.isEnlarged ? 'center' : 'space-between')};

  .horizontal-bar {
    padding: 0 12px;
    color: ${props => props.theme.textColor};
  }

  .time-value {
    display: flex;
    flex-direction: ${props => (props.isEnlarged ? 'row' : 'column')};
    align-items: flex-start;

    span {
      color: ${props => props.theme.textColor};
    }
  }

  .time-value:last-child {
    align-items: flex-end;
  }
`;

const TimeTitle = ({value, isEnlarged, timeFormat = DEFAULT_TIME_FORMAT}) => (
  <TimeValueWrapper isEnlarged={isEnlarged} className="time-range-slider__time-title">
    <TimeValue key={0} value={moment.utc(value[0]).format(timeFormat)} split={!isEnlarged} />
    {isEnlarged ? (
      <div className="horizontal-bar">
        <Minus height="12px" />
      </div>
    ) : null}
    <TimeValue key={1} value={moment.utc(value[1]).format(timeFormat)} split={!isEnlarged} />
  </TimeValueWrapper>
);

const TimeValue = ({value, split}) => (
  // render two lines if not enlarged
  <div className="time-value">
    {split ? (
      value
        .split(' ')
        .map((v, i) => <div key={i}>{i === 0 ? <span>{v}</span> : <span>{v}</span>}</div>)
    ) : (
      <span>{value}</span>
    )}
  </div>
);
