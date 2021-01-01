// Copyright (c) 2021 Uber Technologies, Inc.
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

import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import MouseEventHandler from './mouse-event';

const StyledSliderHandle = styled.span.attrs({
  className: 'kg-range-slider__handle'
})`
  position: absolute;
  z-index: 10;
  ${props => (props.vertical ? 'margin-left' : 'margin-top')}: -${props =>
  (props.sliderHandleWidth - props.theme.sliderBarHeight) / 2}px;

  height: ${props =>
    Number.isFinite(props.sliderHandleWidth)
      ? props.sliderHandleWidth
      : props.theme.sliderHandleHeight}px;
  width: ${props =>
    Number.isFinite(props.sliderHandleWidth)
      ? props.sliderHandleWidth
      : props.theme.sliderHandleHeight}px;
  box-shadow: ${props => props.theme.sliderHandleShadow};
  background-color: ${props => props.theme.sliderHandleColor};
  color: ${props => props.theme.sliderHandleTextColor};

  border-width: 1px;
  border-radius: ${props => props.theme.sliderBorderRadius};
  border-style: solid;
  border-color: ${props =>
    props.active ? props.theme.selectBorderColor : props.theme.sliderInactiveBorderColor};

  :hover {
    background-color: ${props => props.theme.sliderHandleHoverColor};
    cursor: pointer;
  }

  line-height: 10px;
  font-size: 6px;
  padding: 0 3px;
  letter-spacing: 1px;
  :after {
    content: '${props => props.theme.sliderHandleAfterContent}';
  }
`;

const StyledSliderTooltip = styled.div`
  position: absolute;
  border-radius: 3px;
  display: inline-block;
  pointer-events: none;
  transition: opacity 0.3s ease-out;
  z-index: 999;
  margin-left: ${props => props.sliderHandleWidth + 12}px;
  font-size: 9.5px;
  font-weight: 500;
  padding: 7px 10px;
  background-color: ${props => props.theme.tooltipBg};
  color: ${props => props.theme.tooltipColor};
  margin-bottom: -6px;
  width: 50px;

  :before,
  :after {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
  }

  :before {
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    left: -8px;
    top: 50%;
  }

  :after {
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    left: -6px;
    top: 50%;
    margin-top: -4px;
    border-right-color: ${props => props.theme.tooltipBg};
    border-right-style: solid;
    border-right-width: 6px;
  }
`;

const SliderTooltip = ({value, format = val => val, style, sliderHandleWidth}) => {
  return (
    <StyledSliderTooltip sliderHandleWidth={sliderHandleWidth} style={style}>
      {format(value)}
    </StyledSliderTooltip>
  );
};

export default class SliderHandle extends Component {
  static propTypes = {
    sliderHandleWidth: PropTypes.number,
    left: PropTypes.string,
    display: PropTypes.bool,
    valueListener: PropTypes.func,
    vertical: PropTypes.bool
  };

  static defaultProps = {
    sliderHandleWidth: 12,
    left: '50%',
    display: true,
    vertical: false,
    valueListener: function valueListenerFn() {},
    showTooltip: false
  };

  constructor(props) {
    super(props);

    this.mouseEvent = new MouseEventHandler({
      vertical: props.vertical,
      valueListener: props.valueListener,
      toggleMouseOver: this.toggleMouseOver,
      track: props.track
    });
  }

  state = {mouseOver: false};
  ref = createRef();

  toggleMouseOver = () => {
    this.setState({mouseOver: !this.state.mouseOver});
  };

  render() {
    const style = {[this.props.vertical ? 'bottom' : 'left']: this.props.left};

    return (
      <div style={{display: this.props.display ? 'block' : 'none'}}>
        {this.props.showTooltip && this.state.mouseOver ? (
          <SliderTooltip
            style={style}
            sliderHandleWidth={this.props.sliderHandleWidth}
            value={Number.isFinite(this.props.value) ? this.props.value : null}
          />
        ) : null}
        <StyledSliderHandle
          className={classnames({
            'kg-range-slider__handle--active': this.state.mouseOver
          })}
          ref={this.ref}
          sliderHandleWidth={this.props.sliderHandleWidth}
          active={this.state.mouseOver}
          vertical={this.props.vertical}
          style={style}
          onMouseDown={this.mouseEvent.handleMouseDown}
          onTouchStart={this.mouseEvent.handleTouchStart}
        />
      </div>
    );
  }
}
