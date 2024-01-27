// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import {Grid, GridProps} from 'react-virtualized';
import isEqual from 'lodash.isequal';

export default class GridHack extends PureComponent<GridProps> {
  grid: Grid | null = null;

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

  componentWillUnmount() {
    // @ts-expect-error _scrollingContainer not typed in Grid
    this.grid?._scrollingContainer?.removeEventListener('wheel', this._preventScrollBack, {
      passive: false
    });
  }

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
      // @ts-expect-error _scrollingContainer not typed in Grid
      this.grid?._scrollingContainer?.addEventListener('wheel', this._preventScrollBack, {
        passive: false
      });
    }
  };

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
