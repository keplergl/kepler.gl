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
import styled from 'styled-components';

import RangePlot from './range-plot';
import Slider from 'components/common/slider/slider';
import {Input} from 'components/common/styled-components';

import {roundValToStep} from 'utils/data-utils';

const SliderInput = styled(Input)`
  height: ${props => props.theme.sliderInputHeight}px;
  width: ${props => props.theme.sliderInputWidth}px;
  padding: 4px 6px;
  margin-left: ${props => props.flush ? 0 : 24}px;
`;

const SliderWrapper = styled.div`
  display: flex;
  position: relative;
`;

const RangeInputWrapper =styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
`;

export default class RangeSlider extends Component {
  static propTypes = {
    range: PropTypes.arrayOf(PropTypes.number).isRequired,
    value0: PropTypes.number.isRequired,
    value1: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    histogram: PropTypes.arrayOf(PropTypes.any),
    isRanged: PropTypes.bool,
    isEnlarged: PropTypes.bool,
    showInput: PropTypes.bool,
    inputTheme: PropTypes.string,
    step: PropTypes.number,
    sliderHandleWidth: PropTypes.number,
    xAxis: PropTypes.func
  };

  static defaultProps = {
    isEnlarged: false,
    isRanged: true,
    showInput: true,
    sliderHandleWidth: 12,
    onChange: () => {}
  };

  state = {value0: 0, value1: 1, width: 288};

  componentDidMount() {
    this._setValueFromProps(this.props);
    this._resize();
  }

  componentWillReceiveProps(nextProps) {
    this._setValueFromProps(nextProps);
  }

  componentDidUpdate() {
    this._resize();
  }

  _setValueFromProps = props => {
    const {value0, value1} = props;

    if (!isNaN(value0) && !isNaN(value1)) {
      this.setState({value0, value1});
    }
  };

  _isVal0InRange = val => {
    const {value1, range} = this.props;

    return Boolean(val >= range[0] && val <= value1);
  };

  _isVal1InRange = val => {
    const {range, value0} = this.props;

    return Boolean(val <= range[1] && val >= value0);
  };

  _roundValToStep = val => {
    const {range, step} = this.props;

    return roundValToStep(range[0], step, val);
  };

  _setRangeVal1 = val => {
    const {value0, onChange} = this.props;
    val = Number(val);

    if (this._isVal1InRange(val)) {
      onChange([value0, this._roundValToStep(val)]);
      return true;
    }
    return false;
  };

  _setRangeVal0 = val => {
    const {value1, onChange} = this.props;
    val = Number(val);

    if (this._isVal0InRange(val)) {
      onChange([this._roundValToStep(val), value1]);
      return true;
    }
    return false;
  };

  _resize() {
    const width = this.sliderContainer.offsetWidth;
    if (width !== this.state.width) {
      this.setState({width});
    }
  }

  _renderInput(key) {
    const setRange = key === 'value0' ? this._setRangeVal0 : this._setRangeVal1;
    const update = e => {
      if (!setRange(e.target.value)) {
        this.setState({[key]: this.state[key]});
      }
    };

    return (
      <SliderInput
        className="kg-range-slider__input"
        type="number"
        innerRef={comp => {
          this[`input-${key}`] = comp;
        }}
        id={`filter-${key}`}
        value={this.state[key]}
        onChange={e => {
          this.setState({[key]: e.target.value});
        }}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            update(e);
            this[`input-${key}`].blur();
          }
        }}
        onBlur={update}
        flush={key === 'value0'}
        secondary={this.props.inputTheme === 'secondary'}
      />
    );
  }

  render() {
    const {
      isRanged,
      showInput,
      histogram,
      lineChart,
      plotType,
      isEnlarged,
      range,
      onChange,
      value0,
      value1,
      sliderHandleWidth
    } = this.props;

    const height = isRanged && showInput ? '16px' : '24px';
    const {width} = this.state;
    const plotWidth =  width - sliderHandleWidth;

    return (
      <div
        className="kg-range-slider" style={{width: '100%', padding: `0 ${sliderHandleWidth / 2}px`}}
        ref={comp => {
          this.sliderContainer = comp;
        }}>
        {histogram && histogram.length ? (
          <RangePlot
            histogram={histogram}
            lineChart={lineChart}
            plotType={plotType}
            isEnlarged={isEnlarged}
            onBrush={(val0, val1) => {
              onChange([
                this._roundValToStep(val0),
                this._roundValToStep(val1)
              ]);
            }}
            range={range}
            value={[value0, value1]}
            width={plotWidth}
          />
        ) : null}
        <SliderWrapper
          style={{height}}
          className="kg-range-slider__slider">
          {this.props.xAxis ? <this.props.xAxis width={plotWidth} domain={range}/> : null}
          <Slider
            showValues={false}
            isRanged={isRanged}
            minValue={range[0]}
            maxValue={range[1]}
            value0={value0}
            value1={value1}
            handleWidth={sliderHandleWidth}
            onSlider0Change={this._setRangeVal0}
            onSlider1Change={this._setRangeVal1}
            onSliderBarChange={(val0, val1) => {
              if (this._isVal1InRange(val1) && this._isVal0InRange(val0)) {
                onChange([
                  this._roundValToStep(val0),
                  this._roundValToStep(val1)
                ]);
              }
            }}
            enableBarDrag
          />
          {!isRanged && showInput ? this._renderInput('value1') : null}
        </SliderWrapper>
        {isRanged && showInput ? <RangeInputWrapper className="range-slider__input-group">
          {this._renderInput('value0')}
          {this._renderInput('value1')}
        </RangeInputWrapper> : null}
      </div>
    );
  }
};
