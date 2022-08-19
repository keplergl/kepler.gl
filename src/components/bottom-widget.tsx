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

import React, {useCallback, forwardRef, useMemo} from 'react';
import styled from 'styled-components';
import TimeWidgetFactory from './filters/time-widget';
import AnimationControlFactory from './common/animation-control/animation-control';
import AnimationControllerFactory from './common/animation-control/animation-controller';
import {ANIMATION_WINDOW, DIMENSIONS, FILTER_TYPES} from '@kepler.gl/constants';
import {getIntervalBins} from 'reducers/layer-utils/filter-utils';
import {media} from '@kepler.gl/styles';
import {AnimationConfig, TimeRangeFilter} from '@kepler.gl/types';
import {bottomWidgetSelector} from './kepler-gl';

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

interface FilterAnimationControllerProps {
  filter: TimeRangeFilter & {animationWindow?: string};
  filterIdx: number;
  setFilterAnimationTime: (idx: number, value: string, a: any[]) => void;
}

FilterAnimationControllerFactory.deps = [AnimationControllerFactory];
export function FilterAnimationControllerFactory(
  AnimationController: ReturnType<typeof AnimationControllerFactory>
) {
  const FilterAnimationController: React.FC<FilterAnimationControllerProps> = ({
    filter,
    filterIdx,
    setFilterAnimationTime,
    children
  }) => {
    const intervalBins = useMemo(() => getIntervalBins(filter), [filter]);

    const steps = useMemo(() => (intervalBins ? intervalBins.map(x => x.x0) : null), [
      intervalBins
    ]);

    const updateAnimation = useCallback(
      value => {
        switch (filter.animationWindow) {
          case ANIMATION_WINDOW.interval:
            const idx = value[1];
            setFilterAnimationTime(filterIdx, 'value', [
              intervalBins[idx].x0,
              intervalBins[idx].x1 - 1
            ]);
            break;
          default:
            setFilterAnimationTime(filterIdx, 'value', value);
            break;
        }
      },
      [filterIdx, intervalBins, filter.animationWindow, setFilterAnimationTime]
    );

    return (
      <AnimationController
        key="filter-control"
        value={filter.value}
        domain={filter.domain}
        speed={filter.speed}
        isAnimating={filter.isAnimating}
        animationWindow={filter.animationWindow}
        steps={steps}
        updateAnimation={updateAnimation}
        children={children}
      />
    );
  };
  return FilterAnimationController;
}

interface LayerAnimationControllerProps {
  animationConfig: AnimationConfig & {timeSteps?: number[] | null};
  setLayerAnimationTime: (x: number) => void;
}

LayerAnimationControllerFactory.deps = [AnimationControllerFactory];
export function LayerAnimationControllerFactory(
  AnimationController: ReturnType<typeof AnimationControllerFactory>
) {
  const LayerAnimationController: React.FC<LayerAnimationControllerProps> = ({
    animationConfig,
    setLayerAnimationTime,
    children
  }) => (
    <AnimationController<number>
      key="layer-control"
      value={Number(animationConfig.currentTime)}
      domain={animationConfig.domain}
      speed={animationConfig.speed}
      isAnimating={animationConfig.isAnimating}
      updateAnimation={setLayerAnimationTime}
      steps={animationConfig.timeSteps}
      animationWindow={
        animationConfig.timeSteps ? ANIMATION_WINDOW.interval : ANIMATION_WINDOW.point
      }
      children={children}
    />
  );
  return LayerAnimationController;
}

type BottomWidgetProps = {
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
) {
  const BottomWidget = (props: BottomWidgetProps) => {
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

    const enlargedFilterIdx = useMemo(
      () => filters.findIndex(f => f.enlarged && f.type === FILTER_TYPES.timeRange),
      [filters]
    );
    const animatedFilterIdx = useMemo(() => filters.findIndex(f => f.isAnimating), [filters]);
    const animatedFilter = animatedFilterIdx > -1 ? filters[animatedFilterIdx] : null;

    const isLegendPinned =
      uiState.mapControls?.mapLegend?.show && uiState.mapControls?.mapLegend?.active;
    const spaceForLegendWidth = isLegendPinned
      ? DIMENSIONS.mapControl.width + DIMENSIONS.mapControl.mapLegend.pinned.right
      : 0;

    const enlargedFilterWidth =
      (isOpen ? containerW - sidePanelWidth : containerW) - spaceForLegendWidth;

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

    return (
      <BottomWidgetContainer
        width={Math.min(maxWidth, enlargedFilterWidth)}
        style={{marginRight: spaceForLegendWidth}}
        className="bottom-widget--container"
        hasPadding={showAnimationControl || showTimeWidget}
      >
        <LayerAnimationController
          animationConfig={animationConfig}
          setLayerAnimationTime={visStateActions.setLayerAnimationTime}
        >
          {(isAnimating, start, pause, reset) =>
            showAnimationControl ? (
              <AnimationControl
                animationConfig={animationConfig}
                setLayerAnimationTime={visStateActions.setLayerAnimationTime}
                updateAnimationSpeed={visStateActions.updateLayerAnimationSpeed}
                toggleAnimation={visStateActions.toggleLayerAnimation}
                isAnimatable={!animatedFilter}
                isAnimating={isAnimating}
                resetAnimation={reset}
              />
            ) : null
          }
        </LayerAnimationController>
        {filter && (
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
                  enlargeFilter={visStateActions.enlargeFilter}
                  resetAnimation={resetAnimation}
                  isAnimatable={!animationConfig || !animationConfig.isAnimating}
                />
              ) : null
            }
          </FilterAnimationController>
        )}
      </BottomWidgetContainer>
    );
  };

  /* eslint-disable react/display-name */
  // @ts-ignore
  return forwardRef((props: BottomWidgetProps, ref) => <BottomWidget {...props} rootRef={ref} />);
  /* eslint-enable react/display-name */
}
/* eslint-enable complexity */
