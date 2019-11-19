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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TimeWidgetFactory from './filters/time-widget';
import AnimationControlFactory from './common/animation-control/animation-control';
import {FILTER_TYPES} from 'utils/filter-utils';

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

const BottomWidgetContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  padding-top: ${props => props.theme.sidePanel.margin.top}px;
  padding-right: ${props => props.theme.sidePanel.margin.right}px;
  padding-bottom: ${props => props.theme.sidePanel.margin.bottom}px;
  padding-left: ${props => props.theme.sidePanel.margin.left}px;
  width: ${props => props.width}px;
  bottom: 0;
  right: 0;
  z-index: 1;
`;

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

    const {activeSidePanel, readOnly} = uiState;
    const isOpen = Boolean(activeSidePanel);

    const enlargedFilterIdx = filters.findIndex(f => f.enlarged && f.type === FILTER_TYPES.timeRange);
    const isAnyFilterAnimating = filters.some(f => f.isAnimating);
    const enlargedFilterWidth = isOpen
      ? containerW - sidePanelWidth
      : containerW;

    // show playback control if layers contain trip layer & at least one trip layer is visible
    const animatedLayer = layers.filter(
      l =>
        l.config.animation && l.config.animation.enabled && l.config.isVisible
    );

    const readToAnimation = Array.isArray(animationConfig.domain) && animationConfig.currentTime;
    // if animation control is showing, hide time display in time slider
    const showFloatingTimeDisplay = !animatedLayer.length;
    return (
      <BottomWidgetContainer
        width={Math.min(maxWidth, enlargedFilterWidth)}
        className="bottom-widget--container"
      >
        {animatedLayer.length && readToAnimation ? (
          <AnimationControl
            animationConfig={animationConfig}
            updateAnimationTime={visStateActions.updateAnimationTime}
            updateAnimationSpeed={visStateActions.updateLayerAnimationSpeed}
          />
        ) : null}
        {enlargedFilterIdx > -1 && Object.keys(datasets).length > 0 ? (
          <TimeWidget
            filter={filters[enlargedFilterIdx]}
            index={enlargedFilterIdx}
            isAnyFilterAnimating={isAnyFilterAnimating}
            datasets={datasets}
            readOnly={readOnly}
            showTimeDisplay={showFloatingTimeDisplay}
            setFilterPlot={visStateActions.setFilterPlot}
            setFilter={visStateActions.setFilter}
            toggleAnimation={visStateActions.toggleFilterAnimation}
            updateAnimationSpeed={visStateActions.updateFilterAnimationSpeed}
            enlargeFilter={visStateActions.enlargeFilter}
          />
        ) : null}
      </BottomWidgetContainer>
    );
  };

  BottomWidget.propTypes = propTypes;

  return BottomWidget;
}
