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

import React, {forwardRef, useMemo, useCallback} from 'react';
import styled from 'styled-components';

import {DIMENSIONS, FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import {hasPortableWidth, isSideFilter} from '@kepler.gl/utils';
import {media, breakPointValues} from '@kepler.gl/styles';
import {TimeRangeFilter} from '@kepler.gl/types';

import TimeWidgetFactory from './filters/time-widget';
import {bottomWidgetSelector} from './kepler-gl';
import FilterAnimationControllerFactory from './filter-animation-controller';
import LayerAnimationControllerFactory from './layer-animation-controller';
import AnimationControlFactory from './common/animation-control/animation-control';

const maxWidth = 1080;

interface BottomWidgetContainerProps {
  hasPadding?: boolean;
  width?: number;
}

const BottomWidgetContainer = styled.div<BottomWidgetContainerProps>`
  display: flex;
  flex-direction: column;
  padding-top: ${props => (props.hasPadding ? props.theme.bottomWidgetPaddingTop : 0)}px;
  padding-right: ${props => (props.hasPadding ? props.theme.bottomWidgetPaddingRight : 0)}px;
  padding-bottom: ${props => (props.hasPadding ? props.theme.bottomWidgetPaddingBottom : 0)}px;
  padding-left: ${props => (props.hasPadding ? props.theme.bottomWidgetPaddingLeft : 0)}px;
  pointer-events: none !important; /* prevent padding from blocking input */
  & > * {
    /* all children should allow input */
    pointer-events: all;
  }
  width: ${props => props.width}px;
  z-index: 1;
  ${media.portable`padding: 0;`}
`;

type BottomWidgetProps = {
  rootRef: React.ForwardedRef<HTMLDivElement>;
  containerW: number;
} & ReturnType<typeof bottomWidgetSelector>;

BottomWidgetFactory.deps = [
  TimeWidgetFactory,
  AnimationControlFactory,
  FilterAnimationControllerFactory,
  LayerAnimationControllerFactory
];

/* eslint-disable complexity */
export default function BottomWidgetFactory(
  TimeWidget: ReturnType<typeof TimeWidgetFactory>,
  AnimationControl: ReturnType<typeof AnimationControlFactory>,
  FilterAnimationController: ReturnType<typeof FilterAnimationControllerFactory>,
  LayerAnimationController: ReturnType<typeof LayerAnimationControllerFactory>
): React.FC<BottomWidgetProps> {
  const LayerAnimationControl = styled(AnimationControl)`
    background-color: ${props => props.theme.sidePanelBg};
  `;

  const BottomWidget: React.FC<BottomWidgetProps> = (props: BottomWidgetProps) => {
    const {
      datasets,
      filters,
      animationConfig,
      visStateActions,
      containerW,
      uiState,
      sidePanelWidth,
      layers,
      rootRef
    } = props;

    const {activeSidePanel, readOnly} = uiState;
    const isOpen = Boolean(activeSidePanel);

    const enlargedFilterIdx = useMemo(() => filters.findIndex(f => !isSideFilter(f)), [filters]);

    const isMobile = hasPortableWidth(breakPointValues);

    const animatedFilterIdx = useMemo(() => filters.findIndex(f => f.isAnimating), [filters]);
    const animatedFilter = animatedFilterIdx > -1 ? filters[animatedFilterIdx] : null;

    const isLegendPinned =
      uiState.mapControls?.mapLegend?.show && uiState.mapControls?.mapLegend?.active;
    const spaceForLegendWidth = isLegendPinned
      ? DIMENSIONS.mapControl.width + DIMENSIONS.mapControl.mapLegend.pinned.right
      : 0;

    const enlargedFilterWidth =
      (isOpen && !isMobile ? containerW - sidePanelWidth : containerW) - spaceForLegendWidth;

    // show playback control if layers contain trip layer & at least one trip layer is visible
    const animatableLayer = useMemo(
      () =>
        layers.filter(l => l.config.animation && l.config.animation.enabled && l.config.isVisible),
      [layers]
    );

    const readyToAnimation =
      Array.isArray(animationConfig.domain) && Number.isFinite(animationConfig.currentTime);
    // if animation control is showing, hide time display in time slider
    const showFloatingTimeDisplay = !animatableLayer.length;
    const showAnimationControl =
      animatableLayer.length && readyToAnimation && !animationConfig.hideControl;
    const showTimeWidget = enlargedFilterIdx > -1 && Object.keys(datasets).length > 0;

    // if filter is not animating, pass in enlarged filter here because
    // animation controller needs to call reset on it
    const filter = (animatedFilter as TimeRangeFilter) || filters[enlargedFilterIdx];

    const onClose = useCallback(
      () => visStateActions.setFilterView(enlargedFilterIdx, FILTER_VIEW_TYPES.side),
      [visStateActions, enlargedFilterIdx]
    );

    return (
      <BottomWidgetContainer
        width={Math.min(maxWidth, enlargedFilterWidth)}
        style={{marginRight: spaceForLegendWidth}}
        className="bottom-widget--container"
        hasPadding={showAnimationControl || showTimeWidget}
        ref={rootRef}
      >
        <LayerAnimationController
          animationConfig={animationConfig}
          setLayerAnimationTime={visStateActions.setLayerAnimationTime}
        >
          {(isAnimating, start, pause, resetAnimation) =>
            showAnimationControl ? (
              <LayerAnimationControl
                animationConfig={animationConfig}
                setLayerAnimationTime={visStateActions.setLayerAnimationTime}
                updateAnimationSpeed={visStateActions.updateLayerAnimationSpeed}
                toggleAnimation={visStateActions.toggleLayerAnimation}
                isAnimatable={!animatedFilter}
                isAnimating={isAnimating}
                resetAnimation={resetAnimation}
              />
            ) : null
          }
        </LayerAnimationController>
        {filter ? (
          <FilterAnimationController
            filter={filter}
            filterIdx={animatedFilterIdx > -1 ? animatedFilterIdx : enlargedFilterIdx}
            setFilterAnimationTime={visStateActions.setFilterAnimationTime}
          >
            {(isAnimating, start, pause, resetAnimation) =>
              showTimeWidget ? (
                <TimeWidget
                  // TimeWidget uses React.memo, here we pass width
                  // even though it doesnt use it, to force rerender
                  filter={filters[enlargedFilterIdx] as TimeRangeFilter}
                  index={enlargedFilterIdx}
                  datasets={datasets}
                  readOnly={readOnly}
                  showTimeDisplay={showFloatingTimeDisplay}
                  setFilterPlot={visStateActions.setFilterPlot}
                  setFilterAnimationTime={visStateActions.setFilterAnimationTime}
                  setFilterAnimationWindow={visStateActions.setFilterAnimationWindow}
                  toggleAnimation={visStateActions.toggleFilterAnimation}
                  updateAnimationSpeed={visStateActions.updateFilterAnimationSpeed}
                  resetAnimation={resetAnimation}
                  isAnimatable={!animationConfig || !animationConfig.isAnimating}
                  onClose={onClose}
                />
              ) : null
            }
          </FilterAnimationController>
        ) : null}
      </BottomWidgetContainer>
    );
  };

  /* eslint-disable react/display-name */
  // @ts-ignore
  return forwardRef((props: BottomWidgetProps, ref) => <BottomWidget {...props} rootRef={ref} />);
  /* eslint-enable react/display-name */
}
/* eslint-enable complexity */
