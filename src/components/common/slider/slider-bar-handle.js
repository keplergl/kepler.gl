// Copyright (c) 2020 Uber Technologies, Inc.
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

const StyledSlider = styled.div`
  position: relative;
  background-color: ${props =>
    props.active ? props.theme.sliderBarHoverColor : props.theme.sliderBarColor};
  ${props => `${props.vertical ? 'width' : 'height'}: ${props.theme.sliderBarHeight}px`};
  border-radius: ${props => props.theme.sliderBarRadius};

  :hover {
    cursor: pointer;
  }
`;

function nope() {}

export default class SliderBarHandle extends Component {
  static propTypes = {
    width: PropTypes.number,
    left: PropTypes.string,
    sliderBarListener: PropTypes.func,
    enableBarDrag: PropTypes.bool,
    vertical: PropTypes.bool
  };

  static defaultProps = {
    sliderBarListener: nope,
    enableBarDrag: false,
    vertical: false
  };

  constructor(props) {
    super(props);
    this.mouseEvent = new MouseEventHandler({
      vertical: props.vertical,
      valueListener: props.sliderBarListener,
      toggleMouseOver: this.toggleMouseOver
    });
  }

  state = {mouseOver: false};

  toggleMouseOver = () => {
    this.setState({mouseOver: !this.state.mouseOver});
  };

  render() {
    const {width, v0Left} = this.props;

    const style = this.props.vertical
      ? {
          height: `${width}%`,
          bottom: `${-100 + width + v0Left}%`
        }
      : {
          width: `${width}%`,
          left: `${v0Left}%`
        };

    return (
      <StyledSlider
        active={this.state.mouseOver}
        className={classnames('kg-range-slider__bar', {
          'kg-range-slider__bar--active': this.state.mouseOver
        })}
        style={style}
        onMouseDown={this.props.enableBarDrag ? this.mouseEvent.handleMouseDown : nope}
        onTouchStart={this.props.enableBarDrag ? this.mouseEvent.handleTouchStart : nope}
      />
    );
  }
}
