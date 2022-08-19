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

import React, {Component, createRef} from 'react';
import styled, {withTheme} from 'styled-components';
import {select, Selection} from 'd3-selection';
import {BrushBehavior, brushX} from 'd3-brush';
import {normalizeSliderValue} from '../../utils';

interface StyledGProps {
  isRanged?: boolean;
}

const StyledG = styled.g<StyledGProps>`
  .selection {
    stroke: none;
    fill: ${props => (props.isRanged ? props.theme.rangeBrushBgd : props.theme.BLUE2)};
    fill-opacity: ${props => (props.isRanged ? 0.3 : 1)};
  }
  .handle {
    fill: ${props => props.theme.BLUE2};
    fill-opacity: 0.3;
  }
`;

function moveRight(startSel, selection) {
  const [startSel0] = startSel;
  const [sel0] = selection;

  return Boolean(startSel0 === sel0);
}
// style brush resize handle
// https://github.com/crossfilter/crossfilter/blob/gh-pages/index.html#L466
const getHandlePath = (props: RangeBrushProps) => {
  return function brushResizePath(d) {
    const e = Number(d.type === 'e');
    const x = e ? 1 : -1;
    const h = 39;
    const w = 4.5;
    const y = (props.height - h) / 2;
    return `M${0.5 * x},${y}c${2.5 * x},0,${w * x},2,${w * x},${w}v${h - w * 2}c0,2.5,${-2 *
      x},${w},${-w * x},${w}V${y}z`;
  };
};

export type OnBrush = (val0: number, val1: number) => void;

export interface RangeBrushProps {
  isRanged?: boolean;
  theme?: any;
  range: number[];
  value: number[];
  onBrushStart: () => void;
  onBrushEnd: () => void;
  width: number;
  height: number;
  onBrush: OnBrush;
  step?: number;
  marks?: number[];
  onMouseoverHandle: () => void;
  onMouseoutHandle: () => void;
}

function RangeBrushFactory(): React.ComponentType<RangeBrushProps> {
  class RangeBrush extends Component<RangeBrushProps> {
    static defaultProps = {
      isRanged: true
    };

    rootContainer = createRef<SVGGElement>();

    brushing: boolean = false;
    moving: boolean = false;

    root = this.rootContainer.current ? select(this.rootContainer.current) : undefined;
    brush: BrushBehavior<any> | undefined;
    _startSel: number[] | undefined;
    _lastSel: number[] | undefined;

    handle: Selection<SVGPathElement, {type: string}, SVGGElement | null, unknown> | undefined;

    componentDidMount() {
      // We want the React app to respond to brush state and vice-versa
      // but d3-brush fires the same events for both user-initiated brushing
      // and programmatic brushing (brush.move). We need these flags to
      // distinguish between the uses.
      //
      // We don't use state because that would trigger another `componentDidUpdate`
      const {theme, isRanged, onMouseoverHandle, onMouseoutHandle} = this.props;

      this.root = this.rootContainer.current ? select(this.rootContainer.current) : undefined;
      this.brush = brushX()
        .handleSize(3)
        .on('start', event => {
          if (typeof this.props.onBrushStart === 'function') this.props.onBrushStart();
          this._startSel = event.selection;
        })
        .on('brush', event => {
          if (this.moving) {
            return;
          }
          if (event.selection) {
            this._lastSel = event.selection;
            this.brushing = true;
            this._brushed(event);
          }
        })
        .on('end', event => {
          if (!event.selection) {
            if (this.brushing) {
              // handle null selection
              this._click(this._lastSel);
            } else if (this._startSel) {
              // handle click
              this._click(this._startSel);
            }
          }

          if (typeof this.props.onBrushEnd === 'function') this.props.onBrushEnd();

          this.brushing = false;
          this.moving = false;
        });

      this.root?.call(this.brush);
      const brushResizePath = getHandlePath(this.props);
      this.handle = this.root
        ?.selectAll('.handle--custom')
        .data([{type: 'w'}, {type: 'e'}])
        .enter()
        .append('path')
        .attr('class', 'handle--custom')
        .attr('display', isRanged ? null : 'none')
        .attr('fill', theme ? theme.sliderHandleColor : '#D3D8E0')
        .attr('cursor', 'ew-resize')
        .attr('d', brushResizePath)
        .on('mouseover', () => {
          if (onMouseoverHandle) onMouseoverHandle();
        })
        .on('mouseout', () => {
          if (onMouseoutHandle) onMouseoutHandle();
        });

      const {
        value: [val0, val1]
      } = this.props;
      this.moving = true;
      this._move(val0, val1);
    }

    componentDidUpdate(prevProps) {
      const {
        value: [val0, val1],
        width
      } = this.props;
      const [prevVal0, prevVal1] = prevProps.value;

      if (prevProps.width !== width) {
        // width change should not trigger this._brushed
        this.moving = true;
        if (this.brush) this.root?.call(this.brush);
        this._move(val0, val1);
      }

      if (!this.brushing && !this.moving) {
        if (prevVal0 !== val0 || prevVal1 !== val1) {
          this.moving = true;
          this._move(val0, val1);
        }
      }

      if (!this.props.isRanged && this.handle) {
        this.handle.attr('display', 'none');
      }
    }

    _click(selection) {
      // fake brush
      this.brushing = true;
      this._brushed({sourceEvent: {}, selection});
    }

    _move(val0: number = 0, val1: number = 0) {
      const {
        range: [min, max],
        width,
        isRanged
      } = this.props;

      if (width && max - min && this.brush && this.handle) {
        const scale = (x: number) => ((x - min) * width) / (max - min);
        if (!isRanged) {
          // only draw a 1 pixel line
          if (this.root) this.brush.move(this.root, [scale(val0), scale(val0) + 1]);
        } else {
          if (this.root) this.brush.move(this.root, [scale(val0), scale(val1)]);

          this.handle
            .attr('display', null)
            .attr('transform', (d, i) => `translate(${[i === 0 ? scale(val0) : scale(val1), 0]})`);
        }
      }
    }

    _brushed = (evt: {sourceEvent: any; selection: number[]}) => {
      // Ignore brush events which don't have an underlying sourceEvent
      if (!evt.sourceEvent) return;
      const [sel0, sel1] = evt.selection;
      const right = moveRight(this._startSel, evt.selection);

      const {
        range: [min, max],
        step = 0,
        width,
        marks,
        isRanged
      } = this.props;
      const invert = (x: number) => (x * (max - min)) / width + min;
      let d0 = invert(sel0);
      let d1 = invert(sel1);

      d0 = normalizeSliderValue(d0, min, step, marks);
      d1 = normalizeSliderValue(d1, min, step, marks);

      if (isRanged) this._move(d0, d1);
      else this._move(...(right ? [d1, d1] : [d0, d0]));

      if (isRanged) this._onBrush(d0, d1);
      else this._onBrush(right ? d1 : d0);
    };

    _onBrush(val0: number = 0, val1: number = 0) {
      const {
        isRanged,
        value: [currentVal0, currentVal1]
      } = this.props;

      if (currentVal0 === val0 && currentVal1 === val1) {
        return;
      }

      if (isRanged) {
        this.props.onBrush(val0, val1);
      } else {
        this.props.onBrush(val0, val0);
      }
    }

    render() {
      const {isRanged} = this.props;
      return (
        <StyledG className="kg-range-slider__brush" isRanged={isRanged} ref={this.rootContainer} />
      );
    }
  }
  return withTheme(RangeBrush);
}

export default RangeBrushFactory;
