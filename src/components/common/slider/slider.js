// Copyright (c) 2018 Uber Technologies, Inc.
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
import classnames from 'classnames';
import styled from 'styled-components';

import SliderHandle from './slider-handle';
import SliderBarHandle from './slider-bar-handle';

function noop() {}

const StyledRangeSlider = styled.div`
  position: relative;
  margin-bottom: 12px;
  background-color: ${props => props.theme.sliderBarBgd};
  height: ${props => props.theme.sliderBarHeight};
`;

const SliderWrapper = styled.div`
  flex-grow: 1;
  margin-top: ${props => props.isRanged ? 0 : 10}px;
`;

export default class Slider extends Component {
  static propTypes = {
    title: PropTypes.string,
    isRanged: PropTypes.bool,
    value0: PropTypes.number,
    value1: PropTypes.number,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    sliderHandleWidth: PropTypes.number,
    onSlider0Change: PropTypes.func,
    onInput0Change: PropTypes.func,
    onSlider1Change: PropTypes.func,
    onInput1Change: PropTypes.func,
    onSliderBarChange: PropTypes.func,
    step: PropTypes.number,
    enableBarDrag: PropTypes.bool
  };

  static defaultProps = {
    title: '',
    isRanged: true,
    value0: 0,
    value1: 100,
    minValue: 0,
    maxValue: 100,
    step: 1,
    sliderHandleWidth: 12,
    enableBarDrag: false,
    onSlider0Change: noop,
    onInput0Change: noop,
    onSlider1Change: noop,
    onInput1Change: noop,
    onSliderBarChange: noop,
    disabled: false
  };

  ref = undefined;

  _saveRef = ref => {
    this.ref = ref;
  };

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

  calcHandleLeft0 = (w, l, num) => {
    return w === 0 ? `calc(${l}% - ${this.props.sliderHandleWidth / 2}px)` :
      `calc(${l}% - ${this.props.sliderHandleWidth / 2}px)`;
  };

  calcHandleLeft1 = (w, l) => {
    return this.props.isRanged && w === 0
      ? `${l}%`
      : `calc(${l + w}% - ${this.props.sliderHandleWidth / 2}px)`;
  };

  createSlider = (width, v0Left) => {
    return (
      <div>
        <StyledRangeSlider className="kg-range-slider">
          <SliderHandle
            className="kg-range-slider__handle"
            left={this.calcHandleLeft0(width, v0Left)}
            valueListener={this.slide0Listener}
            sliderHandleWidth={this.props.sliderHandleWidth}
            display={this.props.isRanged}
          />
          <SliderHandle
            className="kg-range-slider__handle"
            left={this.calcHandleLeft1(width, v0Left)}
            valueListener={this.slide1Listener}
            sliderHandleWidth={this.props.sliderHandleWidth}
          />
          <SliderBarHandle
            width={width}
            v0Left={v0Left}
            enableBarDrag={this.props.enableBarDrag}
            sliderBarListener={this.sliderBarListener}
          />
        </StyledRangeSlider>
      </div>
    );
  };

  render() {
    const {
      classSet,
      isRanged,
      maxValue,
      minValue,
      value1
    } = this.props;
    const value0 = !isRanged && minValue > 0 ? minValue : this.props.value0;
    const currValDelta = value1 - value0;
    const maxDelta = maxValue - minValue;
    const width = currValDelta / maxDelta * 100;

    const v0Left = (value0 - minValue) / maxDelta * 100;

    return (
      <SliderWrapper
        className={classnames('kg-slider', {...classSet})}
        innerRef={this._saveRef}
        isRanged={isRanged}
      >
        {this.createSlider(width, v0Left)}
      </SliderWrapper>
    );
  }
}
