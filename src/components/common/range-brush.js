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

import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {event, select} from 'd3-selection';
import {brushX} from 'd3-brush';

const StyledG = styled.g`
  .selection {
    stroke: none;
    fill: ${props => props.theme.rangeBrushBgd};
    opacity: 1;
  }
`;

export default class RangeBrush extends Component {
  static propTypes = {
    domain: PropTypes.arrayOf(PropTypes.number).isRequired,
    onBrush: PropTypes.func.isRequired,
    range: PropTypes.arrayOf(PropTypes.number).isRequired,
    value: PropTypes.arrayOf(PropTypes.number).isRequired,
    width: PropTypes.number.isRequired
  };

  componentDidMount() {
    // We want the React app to respond to brush state and vice-versa
    // but d3-brush fires the same events for both user-initiated brushing
    // and programmatic brushing (brush.move). We need these flags to
    // distinguish between the uses.
    //
    // We don't use state because that would trigger another `componentDidUpdate`

    this.brushing = false;
    this.moving = false;

    this.root = select(this.rootContainer.current);
    this.brush = brushX()
      .on('start', () => {
        this.brushing = true;
      })
      .on('brush', () => {
        if (this.moving) {
          return;
        }
        event.selection === null ? this._reset() : this._brush(event.selection);
      })
      .on('end', () => {
        if (!this.moving && event.selection === null) {
          this._reset();
        }

        this.brushing = false;
        this.moving = false;
      });

    this.root.call(this.brush);
  }

  componentDidUpdate(prevProps) {
    const {
      value: [val0, val1],
      width
    } = this.props;
    const [prevVal0, prevVal1] = prevProps.value;

    if (prevProps.width !== width) {
      // width change should not trigger this._brush
      this.moving = true;
      this.root.call(this.brush);
      this._move(val0, val1);
    }

    if (!this.brushing && !this.moving) {
      if (prevVal0 !== val0 || prevVal1 !== val1) {
        this.moving = true;
        this._move(val0, val1);
      }
    }
  }

  rootContainer = createRef();

  _reset() {
    const [minValue, maxValue] = this.props.range;
    this._onBrush(minValue, maxValue);
  }

  _move(val0, val1) {
    const {
      domain: [min, max],
      width
    } = this.props;
    const scale = x => ((x - min) * width) / (max - min);
    this.brush.move(this.root, [scale(val0), scale(val1)]);
  }

  _brush([sel0, sel1]) {
    const {
      domain: [min, max],
      width
    } = this.props;
    const invert = x => (x * (max - min)) / width + min;
    this._onBrush(invert(sel0), invert(sel1));
  }

  _onBrush(val0, val1) {
    const {
      value: [currentVal0, currentVal1]
    } = this.props;

    if (currentVal0 === val0 && currentVal1 === val1) {
      return;
    }

    this.props.onBrush(val0, val1);
  }
  render() {
    return <StyledG className="kg-range-slider__brush" ref={this.rootContainer} />;
  }
}
