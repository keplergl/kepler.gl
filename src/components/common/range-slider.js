import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import RangePlot from './range-plot';
import Slider from 'components/common/slider/slider';
import {Input} from 'components/common/styled-components';

import {roundValToStep} from 'utils/data-utils';

const propTypes = {
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  value0: PropTypes.number.isRequired,
  value1: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  histogram: PropTypes.array,
  isRanged: PropTypes.bool,
  isEnlarged: PropTypes.bool,
  showInput: PropTypes.bool,
  inputTheme: PropTypes.string,
  step: PropTypes.number,
  width: PropTypes.number,
  xAxis: PropTypes.element
};

const SliderInput = Input.extend`
  height: 24px;
  width: 40px;
  padding: 4px 6px;
  margin-left: ${props => props.flush ? 0 : 12}px;
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
  constructor(props) {
    super(props);
    this.state = {value0: 0, value1: 1};
  }

  componentDidMount() {
    this._setValueFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._setValueFromProps(nextProps);
  }

  _setValueFromProps = props => {
    const {value0, value1} = props;

    if (!isNaN(value0) && !isNaN(value1)) {
      this.setState({value0, value1});
    }
  };

  _isVal0InRange = val => {
    const {value1, minValue} = this.props;

    return Boolean(val >= minValue && val <= value1);
  };

  _isVal1InRange = val => {
    const {maxValue, value0} = this.props;

    return Boolean(val <= maxValue && val >= value0);
  };

  _roundValToStep = val => {
    const {minValue, step} = this.props;

    return roundValToStep(minValue, step, val);
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

  _renderSlider() {
    const {
      isRanged,
      minValue,
      maxValue,
      onChange,
      value0,
      value1,
      xAxis,
      showInput
    } = this.props;
    const height = xAxis ? '24px' : '16px';
    return (
      <SliderWrapper style={{height}} className="range-slider__slider">
        {xAxis}
        <Slider
          showValues={false}
          isRanged={isRanged}
          enableBarDrag={true}
          minValue={minValue}
          maxValue={maxValue}
          value0={value0}
          value1={value1}
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
        />
        {!isRanged && showInput ? this._renderInput('value1') : null}
      </SliderWrapper>
    );
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
        className="range-slider__input"
        type="number"
        id={`filter-${key}`}
        value={this.state[key]}
        onChange={e => {
          this.setState({[key]: e.target.value});
        }}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            update(e);
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
      maxValue,
      minValue,
      onChange,
      value0,
      value1,
      width
    } = this.props;

    return (
      <div className="range-slider">
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
            range={[minValue, maxValue]}
            value={[value0, value1]}
            width={width}
          />
        ) : null}
        {this._renderSlider()}
        {isRanged && showInput ? <RangeInputWrapper className="range-slider__input-group">
          {this._renderInput('value0')}
          {this._renderInput('value1')}
        </RangeInputWrapper> : null}
      </div>
    );
  }
}

RangeSlider.propTypes = propTypes;
