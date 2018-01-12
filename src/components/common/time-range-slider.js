import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {requestAnimationFrame, cancelAnimationFrame} from 'global/window';
import classnames from 'classnames';
import throttle from 'lodash.throttle';
import styled from 'styled-components';
import {createSelector} from 'reselect';

import {SelectTextBold, Button} from 'components/common/styled-components';
import {getTimeWidgetTitleFormatter} from 'utils/filter-utils';

import RangeSlider from './range-slider';
import TimeSliderMarker from './time-slider-marker';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  domain: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  step: PropTypes.number.isRequired,
  plotType: PropTypes.string,
  histogram: PropTypes.array,
  lineChart: PropTypes.object,
  toggleAnimation: PropTypes.func.isRequired,
  isAnimatable: PropTypes.bool,
  isEnlarged: PropTypes.bool
};

const defaultTimeFormat = val => moment.utc(val).format('MM/DD/YY hh:mma');

export default class TimeRangeSlider extends Component {
  domainSelector = props => props.domain;
  titleFormatter = createSelector(
    this.domainSelector,
    domain => getTimeWidgetTitleFormatter(domain)
  );

  constructor(props) {
    super(props);
    this.state = {
      isAnimating: false,
      width: 288
    };
    this._animation = null;
    this._animationSpeed = 120;
    this._sliderThrottle = throttle(this.props.onChange, 20);
  }

  componentDidMount() {
    this._resize();
  }

  componentDidUpdate() {
    if (!this._animation && this.state.isAnimating) {
      this._animation = requestAnimationFrame(this._nextFrame);
    }
    this._resize();
  }

  _sliderUpdate = (args) => {
    this._sliderThrottle.cancel();
    this._sliderThrottle(args);
  };

  _resize() {
    const width = this.props.isEnlarged ? this.refs.sliderContainer.offsetWidth : 288;
    if (width !== this.state.width) {
      this.setState({width});
    }
  }

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

  _increaseAnimationSpeed = () => {
    this._animationSpeed = Math.round(this._animationSpeed *
      Math.pow(0.75, 1));
  };

  _reduceAnimationSpeed = () => {
    this._animationSpeed = Math.round(this._animationSpeed *
      Math.pow(0.75, -1));
  };

  _nextFrame = () => {
    this._animation = null;

    const {domain, value} = this.props;
    const speed = (domain[1] - domain[0]) / this._animationSpeed;

    // loop when reaches the end
    const value0 = (value[1] + speed > domain[1]) ? domain[0] :
    value[0] + speed;
    const value1 = value0 + value[1] - value[0];
    this.props.onChange([value0, value1]);
  };

  render() {
    const {domain, value, isEnlarged} = this.props;
    const {width, isAnimating} = this.state;
    const controlWidth = 130;

    const sliderWidth = isEnlarged ? width - controlWidth : width;

    const style = {
      marginTop: isEnlarged ? '12px' : '0px',
      alignItems: 'center',
      display: 'flex',
      flexDirection: isEnlarged ? 'row' : 'column',
      justifyContent: 'space-between'
    };

    return (
      <div>
        <TimeTitle
          timeFormat={this.titleFormatter(this.props)}
          value={value}
          isEnlarged={isEnlarged}
        />
        <div ref="sliderContainer" style={style}>
          <RangeSlider
            minValue={domain[0]}
            maxValue={domain[1]}
            value0={value[0]}
            value1={value[1]}
            histogram={this.props.histogram}
            lineChart={this.props.lineChart}
            plotType={this.props.plotType}
            isRanged={true}
            isEnlarged={isEnlarged}
            showInput={false}
            step={this.props.step}
            onChange={this._sliderUpdate}
            width={sliderWidth}
            xAxis={
              <TimeSliderMarker
                width={sliderWidth}
                domain={domain}
              />
            }
          />
         <AnimationControls
           isAnimatable={this.props.isAnimatable}
           isEnlarged={isEnlarged}
           isAnimating={isAnimating}
           reduceAnimationSpeed={this._reduceAnimationSpeed}
           pauseAnimation={this._pauseAnimation}
           startAnimation={this._startAnimation}
           increaseAnimationSpeed={this._increaseAnimationSpeed}
         />
        </div>
      </div>
    );
  }
}

const TimeValueWrapper = styled.div`
  display: flex;
  font-size: 11px;
  justify-content: ${props => props.isEnlarged ? 'center' : 'space-between'};
  .horizontal-bar {
    padding: 0 6px;
  }
`;

const TimeTitle = ({value, isEnlarged, timeFormat = defaultTimeFormat}) => (
  <TimeValueWrapper isEnlarged={isEnlarged}>
    <TimeValue key={0} value={moment.utc(value[0]).format(timeFormat)}/>
    {isEnlarged ? <div className="horizontal-bar"><SelectTextBold>―</SelectTextBold></div> : null}
    <TimeValue key={1} value={moment.utc(value[0]).format(timeFormat)}/>
  </TimeValueWrapper>
);

const TimeValue = ({value}) => (
  <div><SelectTextBold>{value}</SelectTextBold></div>
);

const AnimationControls = ({
  isAnimatable,
  isAnimating,
  isEnlarged,
  increaseAnimationSpeed,
  reduceAnimationSpeed,
  pauseAnimation,
  startAnimation
}) => (
  <div className={classnames(
    'soft-micro--top', {
      'text--center': !isEnlarged,
      'text--right': isEnlarged})} style={isAnimatable ? {
    display: 'flex',
    marginTop: isEnlarged ? 0 : 14
  } : {
    opacity: 0.4,
    pointerEvents: 'none'
  }}>
    <Button onClick={reduceAnimationSpeed}>
      <i className="icon icon_previous"/>
    </Button>
    <Button size="tiny"
            onClick={isAnimating ? pauseAnimation : startAnimation}>
      <i className={classnames({
        'icon icon_pause': isAnimating,
        'icon icon_play': !isAnimating
      })}/>
    </Button>
    <Button onClick={increaseAnimationSpeed}>
      <i className="icon icon_skip"/>
    </Button>
  </div>
);

TimeRangeSlider.propTypes = propTypes;
TimeRangeSlider.displayName = 'TimeRangeSlider';
