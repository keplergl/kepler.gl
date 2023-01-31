// Copyright (c) 2023 Uber Technologies, Inc.
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

import React, {PureComponent} from 'react';
import {Grid, GridProps} from 'react-virtualized';
import isEqual from 'lodash.isequal';

export default class GridHack extends PureComponent<GridProps> {
  grid: Grid | null = null;

  _preventScrollBack = e => {
    const {scrollLeft} = this.props;
    if (scrollLeft !== undefined && scrollLeft <= 0 && e.deltaX < 0) {
      // Prevent Scroll On Scrollable Elements, avoid browser backward navigation
      // https://alvarotrigo.com/blog/prevent-scroll-on-scrollable-element-js/
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    return;
  };
  _updateRef = x => {
    if (!this.grid && x) {
      this.grid = x;
      /*
       * This hack exists because we need to add wheel event listener to the div rendered by Grid
       *
       */
      //@ts-expect-error _scrollingContainer not typed in Grid
      this.grid?._scrollingContainer?.addEventListener('wheel', this._preventScrollBack, {
        passive: false
      });
    }
  };
  componentWillUnmount() {
    //@ts-expect-error _scrollingContainer not typed in Grid
    this.grid?._scrollingContainer?.removeEventListener('wheel', this._preventScrollBack, {
      passive: false
    });
  }

  componentDidUpdate(preProps) {
    /*
     * This hack exists because in react-virtualized the
     * _columnWidthGetter is only called in the constructor
     * even though it is reassigned with new props resulting in
     * a new width for cells not being calculated so we must
     * force trigger a resize.
     *
     * https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/Grid.js#L322
     *
     */
    if (!isEqual(preProps.cellSizeCache, this.props.cellSizeCache)) {
      this.grid?.recomputeGridSize();
    }
  }

  render() {
    const {setGridRef, ...rest} = this.props;
    return (
      <Grid
        ref={x => {
          if (setGridRef) setGridRef(x);
          this._updateRef(x);
        }}
        key="grid-hack"
        {...rest}
      />
    );
  }
}
