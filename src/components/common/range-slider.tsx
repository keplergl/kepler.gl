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

import React, {Component, createRef, ElementType} from 'react';
import {polyfill} from 'react-lifecycles-compat';
import {createSelector} from 'reselect';
import styled from 'styled-components';
import RangePlotFactory from './range-plot';
import Slider from 'components/common/slider/slider';
import {Input} from 'components/common/styled-components';

import {roundValToStep, clamp} from 'utils/data-utils';
import {observeDimensions, unobserveDimensions} from '../../utils/observe-dimensions';
import { LineChart } from 'reducers';

interface SliderInputProps {
  flush?: boolean;
  elementSize?: string;
}

const SliderInput = styled(Input)<SliderInputProps>`
  width: ${props => props.theme.sliderInputWidth}px;
  margin-left: ${props => (props.flush ? 0 : props.elementSize === 'tiny' ? 12 : 18)}px;
  font-size: ${props => props.theme.sliderInputFontSize}; // 10px // 12px;
  padding: ${props => props.theme.sliderInputPadding}; // 4px 6px; // 6px 12px;
`;

interface SliderWrapperProps {
  isRanged?: boolean;
  showInput?: boolean;
}

const SliderWrapper = styled.div<SliderWrapperProps>`
  display: flex;
  position: relative;
  align-items: ${props => (!props.isRanged && props.showInput ? 'center' : 'flex-start')};
`;

const RangeInputWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
`;


interface RangeSliderProps {
  range?: number[];
  value0: number;
  value1: number;
  onChange: (val: number[]) => void; //TODO 
  histogram?: any[];
  isRanged?: boolean,
  isEnlarged?: boolean,
  showInput?: boolean,
  inputTheme?: string,
  inputSize?: string,
  step?: number,
  sliderHandleWidth?: number,
  xAxis?: ElementType;
  timezone?: string,
  timeFormat: string;
  playbackControlWidth?: number;
  lineChart: LineChart;
  marks?: number[];
  plotType?: string;
  plotValue?: number[];
};

RangeSliderFactory.deps = [RangePlotFactory];

export default function RangeSliderFactory(RangePlot: ReturnType<typeof RangePlotFactory>) {
  class RangeSlider extends Component<RangeSliderProps> {

    static defaultProps = {
      isEnlarged: false,
      isRanged: true,
      showInput: true,
      sliderHandleWidth: 12,
      inputTheme: '',
      inputSize: 'small',
      onChange: () => {}
    };

    static getDerivedStateFromProps(props, state) {
      let update: { value1?: any; prevValue1?: any; value0?: any; prevValue0?: any; } | null = null;
      const {value0, value1} = props;
      if (props.value0 !== state.prevValue0 && !isNaN(value0)) {
        update = {...(update || {}), value0, prevValue0: value0};
      }
      if (props.value1 !== state.prevValue1 && !isNaN(value1)) {
        update = {...(update || {}), value1, prevValue1: value1};
      }
      return update;
    }

    state = {
      value0: 0,
      value1: 1,
      prevValue0: 0,
      prevValue1: 1,
      width: 288
    };

    sliderContainer: HTMLDivElement | null = null

    componentDidMount() {
      if (this.sliderContainer instanceof Element) {
        observeDimensions(this.sliderContainer, this._resize);
      }
    }

    componentDidUpdate() {
      this._resize();
    }

    componentWillUnmount() {
      if (this.sliderContainer instanceof Element) {
        unobserveDimensions(this.sliderContainer);
      }
    }

    setSliderContainer: React.LegacyRef<HTMLDivElement> = element => {
      this.sliderContainer = element;
      this._resize();
    };
    inputValue0 = createRef<HTMLInputElement>();
    inputValue1 = createRef<HTMLInputElement>();
    value0Selector = props => props.value0;
    value1Selector = props => props.value1;
    filterValueSelector = createSelector(
      this.value0Selector,
      this.value1Selector,
      (value0, value1) => [value0, value1]
    );

    _roundValToStep = val => {
      const {range, step} = this.props;
      if (!range || !step) return
      return roundValToStep(range[0], step, val);
    };

    _setRangeVal1 = val => {
      const {value0, range, onChange} = this.props;
      if (!range) return
      const val1 = Number(val);
      onChange([value0, clamp([value0, range[1]], this._roundValToStep(val1))]);
      return true;
    };

    _setRangeVal0 = val => {
      const {value1, range, onChange} = this.props;
      if (!range) return
      const val0 = Number(val);
      onChange([clamp([range[0], value1], this._roundValToStep(val0)), value1]);
      return true;
    };

    _resize = () => {
      if (this.sliderContainer) {
        const width = this.sliderContainer.offsetWidth;
        if (width !== this.state.width) {
          this.setState({width});
        }
      }
    };

    _onChangeInput = (key, e) => {
      this.setState({[key]: e.target.value});
    };

    _renderInput(key) {
      const setRange = key === 'value0' ? this._setRangeVal0 : this._setRangeVal1;
      const ref = key === 'value0' ? this.inputValue0 : this.inputValue1;
      const update = e => {
        if (!setRange(e.target.value)) {
          this.setState({[key]: this.state[key]});
        }
      };

      const onChange = this._onChangeInput.bind(this, key);

      return (
        <SliderInput
          className="kg-range-slider__input"
          type="number"
          ref={ref}
          id={`slider-input-${key}`}
          key={key}
          value={this.state[key]}
          onChange={onChange}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              update(e);
              (ref.current as any).blur();
            }
          }}
          onBlur={update}
          flush={key === 'value0'}
          elementSize={this.props.inputSize}
          secondary={this.props.inputTheme === 'secondary'}
        />
      );
    }

    // eslint-disable-next-line complexity
    render() {
      const {
        isRanged,
        showInput,
        histogram,
        lineChart,
        range,
        onChange,
        sliderHandleWidth,
        step,
        timezone,
        timeFormat,
        playbackControlWidth
      } = this.props;

      const {width} = this.state;
      const plotWidth = Math.max(width - Number(sliderHandleWidth), 0);
      const renderPlot = (histogram && histogram.length) || lineChart;
      return (
        <div
          className="kg-range-slider"
          style={{width: '100%', padding: `0 ${Number(sliderHandleWidth) / 2}px`}}
          ref={this.setSliderContainer}
        >
          {Array.isArray(range) && range.every(Number.isFinite) && (
            <>
              {renderPlot ? (
                <RangePlot
                  histogram={histogram}
                  lineChart={this.props.lineChart}
                  plotType={this.props.plotType}
                  isEnlarged={this.props.isEnlarged}
                  onBrush={(val0, val1) => onChange([val0, val1])}
                  marks={this.props.marks}
                  range={range}
                  value={this.props.plotValue || this.filterValueSelector(this.props)}
                  width={plotWidth}
                  isRanged={isRanged}
                  step={step}
                  timezone={timezone}
                  timeFormat={timeFormat}
                  playbackControlWidth={playbackControlWidth}
                />
              ) : null}
              <SliderWrapper
                className="kg-range-slider__slider"
                isRanged={isRanged}
                showInput={showInput}
              >
                {this.props.xAxis ? (
                  <div style={{height: '30px'}}>
                    <this.props.xAxis
                      width={plotWidth}
                      timezone={timezone}
                      domain={range}
                      isEnlarged={this.props.isEnlarged}
                    />
                  </div>
                ) : null}
                <Slider
                  marks={this.props.marks}
                  showValues={false}
                  isRanged={isRanged}
                  minValue={range[0]}
                  maxValue={range[1]}
                  value0={this.props.value0}
                  value1={this.props.value1}
                  step={step}
                  handleWidth={sliderHandleWidth}
                  onSlider0Change={this._setRangeVal0}
                  onSlider1Change={this._setRangeVal1}
                  onSliderBarChange={(val0, val1) => {
                    onChange([val0, val1]);
                  }}
                  enableBarDrag
                />
                {!isRanged && showInput ? this._renderInput('value1') : null}
              </SliderWrapper>
              {isRanged && showInput ? (
                <RangeInputWrapper className="range-slider__input-group">
                  {this._renderInput('value0')}
                  {this._renderInput('value1')}
                </RangeInputWrapper>
              ) : null}
            </>
          )}
        </div>
      );
    }
  }

  polyfill(RangeSlider);

  return RangeSlider;
}
