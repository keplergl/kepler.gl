// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, createRef, RefObject} from 'react';
import classnames from 'classnames';
import styled from 'styled-components';

import SliderHandle from './slider-handle';
import SliderBarHandle from './slider-bar-handle';
import {normalizeSliderValue, clamp} from '@kepler.gl/utils';

function noop() {
  return;
}

interface StyledRangeSliderProps {
  vertical?: boolean;
}

const StyledRangeSlider = styled.div<StyledRangeSliderProps>`
  position: relative;
  background-color: ${props => props.theme.sliderBarBgd};
  ${props => `${props.vertical ? 'width' : 'height'}: ${props.theme.sliderBarHeight}px`};
  ${props => `${props.vertical ? 'height' : 'width'}: 100%`};
`;

export type StyleRangeSliderType = typeof StyledRangeSlider & HTMLDivElement;

interface SliderWrapperProps {
  isRanged?: boolean;
  vertical?: boolean;
}

const SliderWrapper = styled.div<SliderWrapperProps>`
  flex-grow: 1;
`;

type SliderProps = {
  title: string;
  isRanged: boolean;
  value0: number;
  value1: number;
  minValue: number;
  maxValue: number;
  sliderHandleWidth: number;
  onSlider0Change: (val: number) => any;
  onSlider1Change: (val: number) => any;
  onSliderBarChange: (val0: number, val1: number) => void;
  step: number;
  enableBarDrag: boolean;
  showTooltip: boolean;
  vertical: boolean;
  marks?: number[];
  classSet?: {[key: string]: boolean};
  disabled: boolean;
  className?: string;
  style?: object;
};

export default class Slider extends Component<SliderProps> {
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
    onSlider1Change: noop,
    onSliderBarChange: noop,
    disabled: false,
    vertical: false,
    showTooltip: false
  };

  private anchor = 0;

  public ref: RefObject<typeof SliderWrapper & HTMLDivElement> = createRef<
    typeof SliderWrapper & HTMLDivElement
  >();
  public track: RefObject<StyleRangeSliderType> = createRef<StyleRangeSliderType>();

  constructor(public props: SliderProps) {
    super(props);
  }

  private setAnchor = (x: number) => {
    // used to calculate delta
    this.anchor = x;
  };

  private getBaseDistance() {
    if (!this.ref.current) {
      return 0;
    }
    return this.props.vertical ? this.ref.current.offsetHeight : this.ref.current.offsetWidth;
  }

  private getDeltaVal(x: number) {
    const percent = x / this.getBaseDistance();
    const maxDelta = this.props.maxValue - this.props.minValue;
    return percent * maxDelta;
  }
  private getDeltaX(v: number) {
    const percent = v / (this.props.maxValue - this.props.minValue);
    const maxDelta = this.getBaseDistance();
    return percent * maxDelta;
  }

  private getValue(baseV: number, offset: number) {
    // offset is the distance between slider handle and track left
    const rawValue = baseV + this.getDeltaVal(offset);

    return this.normalizeValue(rawValue);
  }

  private normalizeValue(val: number) {
    const {minValue, step, marks} = this.props;
    return normalizeSliderValue(val, minValue, step, marks);
  }

  slide0Listener = (x: number) => {
    const {value1, minValue} = this.props;
    const val = this.getValue(minValue, x);
    this.props.onSlider0Change(clamp([minValue, value1], val));
  };

  slide1Listener = (x: number) => {
    const {minValue, maxValue, value0} = this.props;
    const val = this.getValue(minValue, x);
    this.props.onSlider1Change(clamp([value0, maxValue], val));
  };

  sliderBarListener = (x: number) => {
    const {value0, value1, minValue, maxValue} = this.props;
    // for slider bar, we use distance delta
    const anchor = this.anchor;
    const length = value1 - value0; // the length of the selected range shouldn't change when clamping
    const val0 = clamp([minValue, maxValue - length], this.getValue(value0, x - anchor));
    const val1 = clamp([val0 + length, maxValue], this.getValue(value1, x - anchor));

    const deltaX = this.getDeltaX(val0 - this.props.value0);
    this.props.onSliderBarChange(val0, val1);
    // update anchor
    this.anchor = this.anchor + deltaX;
  };

  calcHandleLeft0 = (w: number, l: number) => {
    return w === 0
      ? `calc(${l}% - ${this.props.sliderHandleWidth / 2}px)`
      : `calc(${l}% - ${this.props.sliderHandleWidth / 2}px)`;
  };

  calcHandleLeft1 = (w: number, l: number) => {
    return this.props.isRanged && w === 0
      ? `${l}%`
      : `calc(${l + w}% - ${this.props.sliderHandleWidth / 2}px)`;
  };

  render() {
    const {
      className,
      classSet,
      disabled,
      isRanged,
      maxValue,
      minValue,
      value1,
      vertical,
      sliderHandleWidth,
      showTooltip,
      style
    } = this.props;
    const value0 = !isRanged && minValue > 0 ? minValue : this.props.value0;
    const currValDelta = value1 - value0;
    const maxDelta = maxValue - minValue;
    const width = (currValDelta / maxDelta) * 100;

    const v0Left = ((value0 - minValue) / maxDelta) * 100;

    return (
      <SliderWrapper
        className={classnames('kg-slider', {...classSet, disabled}, className)}
        ref={this.ref}
        isRanged={isRanged}
        vertical={vertical}
        style={style}
      >
        <StyledRangeSlider className="kg-range-slider" vertical={vertical} ref={this.track}>
          <SliderHandle
            left={this.calcHandleLeft0(width, v0Left)}
            valueListener={this.slide0Listener}
            sliderHandleWidth={sliderHandleWidth}
            display={isRanged}
            vertical={vertical}
            showTooltip={showTooltip}
            track={this.track}
          />
          <SliderHandle
            left={this.calcHandleLeft1(width, v0Left)}
            valueListener={this.slide1Listener}
            sliderHandleWidth={sliderHandleWidth}
            vertical={vertical}
            value={value1}
            showTooltip={showTooltip}
            track={this.track}
          />
          <SliderBarHandle
            width={width}
            v0Left={v0Left}
            enableBarDrag={this.props.enableBarDrag}
            sliderBarListener={this.sliderBarListener}
            vertical={vertical}
            track={this.track}
            setAnchor={this.setAnchor}
          />
        </StyledRangeSlider>
      </SliderWrapper>
    );
  }
}
