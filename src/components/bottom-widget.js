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

import React from 'react';
import PropTypes from 'prop-types';
import TimeWidgetFactory from './filters/time-widget';
import AnimationControlFactory from './common/animation-control/animation-slider';
import {WidgetContainer} from './common/styled-components';

const propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object),
  datasets: PropTypes.object,
  uiState: PropTypes.object,
  layers: PropTypes.arrayOf(PropTypes.object),
  animationConfig: PropTypes.object,
  visStateActions: PropTypes.object,
  sidePanelWidth: PropTypes.number,
  containerW: PropTypes.number
};

const maxWidth = 1080;

BottomWidgetFactory.deps = [TimeWidgetFactory, AnimationControlFactory];

export default function BottomWidgetFactory(TimeWidget, AnimationControl) {
  const BottomWidget = props => {
    const {
      datasets,
      filters,
      animationConfig,
      visStateActions,
      containerW,
      uiState,
      sidePanelWidth,
      layers
    } = props;

    const {activeSidePanel} = uiState;
    const isOpen = Boolean(activeSidePanel);

    const enlargedFilterWidth = isOpen ? containerW - sidePanelWidth : containerW;

    const animatedLayer = layers.filter(
      l => l.config.animation && l.config.animation.enabled && l.config.isVisible
    );

    // show playback control if layers contain trip layer & at least one trip layer is visible
    return (
      <WidgetContainer>
        {animatedLayer.length >= 1 ? (
          <AnimationControl
            animation={animationConfig}
            width={Math.min(maxWidth, enlargedFilterWidth)}
            updateAnimationTime={visStateActions.updateAnimationTime}
            updateAnimationSpeed={visStateActions.updateLayerAnimationSpeed}
          />
        ) : (
          <TimeWidget
            filters={filters}
            setFilterPlot={visStateActions.setFilterPlot}
            setFilter={visStateActions.setFilter}
            toggleAnimation={visStateActions.toggleAnimation}
            updateAnimationSpeed={visStateActions.updateAnimationSpeed}
            enlargeFilter={visStateActions.enlargeFilter}
            width={Math.min(maxWidth, enlargedFilterWidth)}
            datasets={datasets}
          />
        )}
      </WidgetContainer>
    );
  };

  BottomWidget.propTypes = propTypes;

  return BottomWidget;
}
