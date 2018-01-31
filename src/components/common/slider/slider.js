import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';

import SliderHandle from './slider-handle';
import SliderBarHandle from './slider-bar-handle';

function noop() {}

const propTypes = {
  title: PropTypes.string,
  isRanged: PropTypes.bool,
  value0: PropTypes.number,
  value1: PropTypes.number,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  showValues: PropTypes.bool,
  onSlider0Change: PropTypes.func,
  onInput0Change: PropTypes.func,
  onSlider1Change: PropTypes.func,
  onInput1Change: PropTypes.func,
  onSliderBarChange: PropTypes.func,
  step: PropTypes.number,
  enableBarDrag: PropTypes.bool
};

const defaultProps = {
  title: '',
  isRanged: true,
  value0: 0,
  value1: 100,
  minValue: 0,
  maxValue: 100,
  showValues: true,
  step: 1,
  enableBarDrag: false,
  onSlider0Change: noop,
  onInput0Change: noop,
  onSlider1Change: noop,
  onInput1Change: noop,
  onSliderBarChange: noop,
  disabled: false
};

const StyledRangeSlider = styled.div`
  position: relative;
  margin-bottom: 12px;
  background-color: ${props => props.theme.sliderBarBgd};
  height: ${props => props.theme.sliderBarHeight};
`;

const SliderInput = styled.div`
  ${props => props.theme.input};
`;

const SliderWrapper = styled.div`
  flex-grow: 1;
`;

class Slider extends React.Component {

  _saveRef = ref => {
    this.ref = ref;
  };

  componentDidMount() {
    this.handleWidth = this.ref.getElementsByClassName(
      'range-slider__handle'
    )[1].offsetWidth;
  }

  handleWidth = 12;
  ref = undefined;

  slide0Listener = x => {
    const xPercent = x / this.ref.offsetWidth;
    const maxDelta = this.props.maxValue - this.props.minValue;
    const val = xPercent * maxDelta;
    this.props.onSlider0Change.call(this, val + this.props.value0);
  };

  slide1Listener = x => {
    const xPercent = x / this.ref.offsetWidth;
    const maxDelta = this.props.maxValue - this.props.minValue;
    const val = xPercent * maxDelta;
    this.props.onSlider1Change(val + this.props.value1);
  };

  sliderBarListener = x => {
    const xPercent = x / this.ref.offsetWidth;
    const maxDelta = this.props.maxValue - this.props.minValue;
    const val = xPercent * maxDelta;
    const val0 = val + this.props.value0;
    const val1 = val + this.props.value1;
    this.props.onSliderBarChange(val0, val1);
  };

  input0Listener = e => {
    this.props.onInput0Change(Number(e.target.value), true);
  };

  input1Listener = e => {
    this.props.onInput1Change(Number(e.target.value), true);
  };

  calcHandleLeft0 = (w, l, num) => {
    return w === 0 ? `calc(l% - ${this.handleWidth / 2} px)` : `${l}%`;
  };

  calcHandleLeft1 = (w, l) => {
    return this.props.isRanged && w === 0
      ? `calc(l% - ${this.handleWidth}px)`
      : `calc(${l + w}% - ${this.handleWidth}px)`;
  };

  onBlur0 = () => {
    this.props.onInput0Change(this.props.value0, false);
  };

  onBlur1 = () => {
    this.props.onInput1Change(this.props.value1, false);
  };

  createSlider = (width, length) => {
    return (
      <div>
        <StyledRangeSlider className="range-slider">
          <SliderHandle
            className="range-slider__handle"
            left={this.calcHandleLeft0(width, length)}
            valueListener={this.slide0Listener}
            display={this.props.isRanged}
          />
          <SliderHandle
            className="range-slider__handle"
            left={this.calcHandleLeft1(width, length)}
            valueListener={this.slide1Listener}
          />
          <SliderBarHandle
            width={width}
            length={length}
            enableBarDrag={this.props.enableBarDrag}
            sliderBarListener={this.sliderBarListener}
          />
        </StyledRangeSlider>
      </div>
    );
  };

  createInput0 = () => {
    return (
      <span
        className={classnames({
          'position--relative': true,
          hidden: !this.props.showValues || !this.props.isRanged
        })}
      >
        <input
          className="range-slider__input hard text-input borderless one-quarter float--left bg-transparent"
          step={this.props.step}
          type={'number'}
          value={this.props.value0}
          onChange={this.input0Listener}
          onBlur={this.onBlur0}
          disabled={this.props.disabled}
        />
      </span>
    );
  };

  createInput1 = () => {
    return (
      <span
        className={classnames({
          hidden: !this.props.showValues
        })}
      >
        <SliderInput
          className="range-slider__input"
          step={this.props.step}
          type={'number'}
          value={this.props.value1}
          onChange={this.input1Listener}
          onBlur={this.onBlur1}
          disabled={this.props.disabled}
        />
      </span>
    );
  };

  render() {
    const {
      classSet,
      isRanged,
      maxValue,
      minValue,
      value0,
      value1
    } = this.props;
    const value = !isRanged && minValue > 0 ? minValue : value0;
    const currValDelta = value1 - value;
    const maxDelta = maxValue - minValue;
    const width = currValDelta / maxDelta * 100;

    const length = (value - minValue) / maxDelta * 100;
    return (
      <SliderWrapper
        className={classnames({...classSet, slider: true})}
        innerRef={this._saveRef}
      >
        {this.createSlider(width, length)}
        {/*this.createInput0()*/}
        {/*this.createInput1()*/}
      </SliderWrapper>
    );
  }
}

Slider.defaultProps = defaultProps;
Slider.propTypes = propTypes;

export default Slider;
