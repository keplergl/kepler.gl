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

import document from 'global/document';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';

const StyledSlider = styled.div`
  position: relative;
  background-color: ${props =>
    props.active
      ? props.theme.sliderBarHoverColor
      : props.theme.sliderBarColor};
  height: ${props => props.theme.sliderBarHeight};
  border-radius: ${props => props.theme.sliderBarRadius};

  :hover {
    cursor: pointer;
  }
`;
/**
 *
 * props:
 *  width : default 23
 *  height : default 23
 *  left
 *  onMove
 *  sliderBarListener
 */
export default class SliderHandle extends Component {
  static propTypes = {
    width: PropTypes.number,
    left: PropTypes.string,
    sliderBarListener: PropTypes.func,
    enableBarDrag: PropTypes.bool
  };

  static defaultProps = {
    sliderBarListener: function sliderBarListenerTn() {},
    enableBarDrag: false
  };

  state = {mouseOver: false};
  prevX = 0;

  handleMouseDown = () => {
    document.addEventListener('mouseup', this.mouseup);
    document.addEventListener('mousemove', this.mousemove);
    this.setState({mouseOver: true});
  };

  mouseup = () => {
    document.removeEventListener('mouseup', this.mouseup);
    document.removeEventListener('mousemove', this.mousemove);
    this.setState({mouseOver: false});
  };

  mousemove = e => {
    e.preventDefault();
    this.props.sliderBarListener(e.movementX);
  };

  handleTouchStart = e => {
    document.addEventListener('touchend', this.touchend);
    document.addEventListener('touchmove', this.touchmove);
    this.prevX = e.touches[0].clientX;
    this.setState({mouseOver: true});
  };

  touchmove = e => {
    const deltaX = e.touches[0].clientX - this.prevX;
    this.prevX = e.touches[0].clientX;
    this.props.sliderBarListener(deltaX);
  };

  touchend = () => {
    document.removeEventListener('touchend', this.touchend);
    document.removeEventListener('touchmove', this.touchmove);
    this.setState({mouseOver: false});
  };

  render() {
    return (
      <StyledSlider
        active={this.state.mouseOver}
        className={classnames('kg-range-slider__bar', {
          'kg-range-slider__bar--active': this.state.mouseOver
        })}
        style={{
          width: `${this.props.width}%`,
          left: `${this.props.v0Left}%`
        }}
        onMouseDown={this.props.enableBarDrag && this.handleMouseDown}
        onTouchStart={this.props.enableBarDrag && this.handleTouchStart}
      />
    );
  }
};
