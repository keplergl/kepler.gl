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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TimeWidgetFactory from './filters/time-widget';

const propsTypes = {
  filters: PropTypes.array,
  datasets: PropTypes.object,
  uiState: PropTypes.object,
  visStateActions: PropTypes.object,
  sidePanelWidth: PropTypes.number,
  containerW: PropTypes.number
};

const MaxWidth = 1080;

BottomWidgetFactory.deps = [TimeWidgetFactory];

export default function BottomWidgetFactory(TimeWidget) {

  class BottomWidget extends Component {
    render() {
      const {
        datasets,
        filters,
        visStateActions,
        containerW,
        uiState,
        sidePanelWidth
      } = this.props;
      const {activeSidePanel} = uiState;
      const isOpen = Boolean(activeSidePanel);

      const enlargedFilterIdx = filters.findIndex(f => f.enlarged);
      const isAnyFilterAnimating = filters.some(f => f.isAnimating);
      const enlargedFilterWidth = isOpen ? containerW - sidePanelWidth : containerW;

      if (enlargedFilterIdx < 0) {
        return null;
      }

      return (
        <TimeWidget
          fields={datasets[filters[enlargedFilterIdx].dataId].fields}
          setFilterPlot={visStateActions.setFilterPlot}
          setFilter={visStateActions.setFilter}
          toggleAnimation={visStateActions.toggleAnimation}
          updateAnimationSpeed={visStateActions.updateAnimationSpeed}
          enlargeFilter={visStateActions.enlargeFilter}
          width={Math.min(MaxWidth, enlargedFilterWidth)}
          isAnyFilterAnimating={isAnyFilterAnimating}
          enlargedIdx={enlargedFilterIdx}
          filter={filters[enlargedFilterIdx]}
        />
      );
    }
  }

  BottomWidget.propsTypes = propsTypes;

  return BottomWidget;
}
