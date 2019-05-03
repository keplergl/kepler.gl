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
import classnames from 'classnames';
import styled from 'styled-components';
import MouseEventHandler from './mouse-event';

const StyledSliderHandle = styled.span`
  position: absolute;
  z-index: 10;
  display: ${props => (props.hidden ? 'none' : 'block')};
  margin-${props => (props.vertical ? 'left' : 'top')}: -${props =>
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
  border-width: 1px;
  border-style: solid;
  border-color: ${props =>
    props.active
      ? props.theme.selectBorderColor
      : props.theme.sliderHandleColor};

  :hover {
    background-color: ${props => props.theme.sliderHandleHoverColor};
    cursor: pointer;
  }
`;

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
    valueListener: function valueListenerFn() {}
  };

  constructor(props) {
    super(props);

    this.mouseEvent = new MouseEventHandler({
      vertical: props.vertical,
      valueListener: props.valueListener,
      toggleMouseOver: this.toggleMouseOver
    });
  }

  state = {mouseOver: false};

  toggleMouseOver = () => {
    this.setState({mouseOver: !this.state.mouseOver});
  };

  render() {
    const style = {[this.props.vertical ? 'bottom' : 'left']: this.props.left};

    return (
      <StyledSliderHandle
        className={classnames('kg-range-slider__handle', {
          'kg-range-slider__handle--active': this.state.mouseOver
        })}
        sliderHandleWidth={this.props.sliderHandleWidth}
        active={this.state.mouseOver}
        hidden={!this.props.display}
        vertical={this.props.vertical}
        style={style}
        onMouseDown={this.mouseEvent.handleMouseDown}
        onTouchStart={this.mouseEvent.handleTouchStart}
      />
    );
  }
}
