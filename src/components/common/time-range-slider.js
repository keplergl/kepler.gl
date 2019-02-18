// Copyright (c) 2019 Uber Technologies, Inc.
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
import {requestAnimationFrame, cancelAnimationFrame} from 'global/window';
import classnames from 'classnames';
import throttle from 'lodash.throttle';
import styled from 'styled-components';
import {createSelector} from 'reselect';
import {Play, Reset, Pause, Minus} from 'components/common/icons';
import {SelectTextBold, SelectText, Button, ButtonGroup} from 'components/common/styled-components';
import {getTimeWidgetTitleFormatter, BASE_SPEED} from 'utils/filter-utils';
import RangeSlider from './range-slider';
import TimeSliderMarker from './time-slider-marker';

const defaultTimeFormat = val => moment.utc(val).format('MM/DD/YY hh:mma');
const animationControlWidth = 140;

const StyledSliderContainer = styled.div`
  margin-top: ${props => props.isEnlarged ? '12px' : '0px'};
  align-items: flex-end;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export default class TimeRangeSlider extends Component {
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
    speed: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      isAnimating: false,
      width: 288
    };
    this._animation = null;
    this._sliderThrottle = throttle((...value) => this.props.onChange(...value), 20);
  }

  componentDidUpdate() {
    if (!this._animation && this.state.isAnimating) {
      this._animation = requestAnimationFrame(this._nextFrame);
    }
  }

  domainSelector = props => props.domain;
  titleFormatter = createSelector(this.domainSelector, domain =>
    getTimeWidgetTitleFormatter(domain)
  );

  _sliderUpdate = args => {
    this._sliderThrottle.cancel();
    this._sliderThrottle(args);
  };

  _resetAnimation = () => {
    const {domain, value} = this.props;
    const value0 = domain[0];
    const value1 = value0 + value[1] - value[0];
    this.props.onChange([value0, value1]);
  };

  _startAnimation = () => {
    this._pauseAnimation();
    this.props.toggleAnimation();
    this.setState({isAnimating: true});
  };

  _pauseAnimation = () => {
    if (this._animation) {
      cancelAnimationFrame(this._animation);
      this.props.toggleAnimation();
      this._animation = null;
    }
    this.setState({isAnimating: false});
  };

  _nextFrame = () => {
    this._animation = null;

    const {domain, value} = this.props;
    const speed = ((domain[1] - domain[0]) / BASE_SPEED) * this.props.speed;

    // loop when reaches the end
    const value0 = value[1] + speed > domain[1] ? domain[0] : value[0] + speed;
    const value1 = value0 + value[1] - value[0];
    this.props.onChange([value0, value1]);
  };

  render() {
    const {domain, value, isEnlarged} = this.props;
    const {isAnimating} = this.state;

    return (
      <div className="time-range-slider">
        <TimeTitle
          timeFormat={this.titleFormatter(this.props)}
          value={value}
          isEnlarged={isEnlarged}
        />
        <StyledSliderContainer
          className="time-range-slider__container"
          isEnlarged={isEnlarged}>
          {isEnlarged ? <AnimationControls
            isAnimatable={this.props.isAnimatable}
            isEnlarged={isEnlarged}
            isAnimating={isAnimating}
            pauseAnimation={this._pauseAnimation}
            resetAnimation={this._resetAnimation}
            startAnimation={this._startAnimation}
          /> : null}
          <div style={{width: isEnlarged ? `calc(100% - ${animationControlWidth}px)` : '100%'}}>
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

const TimeValueWrapper = styled.div`
  display: flex;
  height: ${props => props.theme.secondaryInputHeight};
  align-items: center;
  font-size: 11px;
  justify-content: ${props => props.isEnlarged ? 'center' : 'space-between'};
  color: ${props => props.theme.labelColor};

  .horizontal-bar {
    padding: 0 12px;
  }

  .time-value {
    display: flex;
    flex-direction: ${props => props.isEnlarged ? 'row' : 'column'};
    align-items: flex-start;
  }

  .time-value:last-child {
    align-items: flex-end;
  }
`;

const TimeTitle = ({value, isEnlarged, timeFormat = defaultTimeFormat}) => (
  <TimeValueWrapper isEnlarged={isEnlarged}>
    <TimeValue key={0} value={moment.utc(value[0]).format(timeFormat)} split={!isEnlarged}/>
    {isEnlarged ? (
      <div className="horizontal-bar">
        <Minus height="12px"/>
      </div>
    ) : null}
    <TimeValue key={1} value={moment.utc(value[1]).format(timeFormat)} split={!isEnlarged}/>
  </TimeValueWrapper>
);

const TimeValue = ({value, split}) => (
  // render two lines if not enlarged
  <div className="time-value">
    {split ? value.split(' ').map((v, i) => (
      <div key={i}>
        {i === 0 ? <SelectText>{v}</SelectText> :
        <SelectTextBold>{v}</SelectTextBold>}
      </div>
    )) : <SelectTextBold>{value}</SelectTextBold>}
  </div>
);

const StyledAnimationControls = styled.div`
  margin-bottom: 12px;
  margin-right: 42px;

  &.disabled {
    opacity: 0.4;
    pointer-events: none;
  }
`;

const IconButton = styled(Button)`
  svg {
    margin: 0 6px;
  }
`;

const AnimationControls = ({
  isAnimatable,
  isAnimating,
  pauseAnimation,
  resetAnimation,
  startAnimation
}) => (
  <StyledAnimationControls
    className={classnames('time-range-slider__control', {disabled: !isAnimatable})}
  >
    <ButtonGroup>
      <IconButton className="playback-control-button"
        onClick={resetAnimation} secondary>
        <Reset height="12px"/>
      </IconButton>
      <IconButton className={classnames('playback-control-button', {active: isAnimating})}
        onClick={isAnimating ? pauseAnimation : startAnimation} secondary>
        {isAnimating ? <Pause height="12px"/> : <Play height="12px"/>}
      </IconButton>
    </ButtonGroup>
  </StyledAnimationControls>
);
