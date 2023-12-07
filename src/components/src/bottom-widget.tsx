// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {forwardRef, useMemo, useCallback} from 'react';
import styled, {withTheme} from 'styled-components';

import {FILTER_VIEW_TYPES} from '@kepler.gl/constants';
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

export type BottomWidgetProps = {
  rootRef: React.ForwardedRef<HTMLDivElement>;
  containerW: number;
} & ReturnType<typeof bottomWidgetSelector>;
type ThemeProp = {
  theme: Record<string, any>;
};
type BottomWidgetThemedProps = BottomWidgetProps & ThemeProp;

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
): React.FC<BottomWidgetThemedProps> {
  const LayerAnimationControl = styled(AnimationControl)`
    background-color: ${props => props.theme.sidePanelBg};
  `;

  const BottomWidget: React.FC<BottomWidgetThemedProps> = (props: BottomWidgetThemedProps) => {
    const {
      datasets,
      filters,
      animationConfig,
      visStateActions,
      containerW,
      uiState,
      sidePanelWidth,
      layers,
      rootRef,
      theme
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
      ? theme.mapControl?.width +
        theme.mapControl?.mapLegend?.pinned?.right * 2 -
        theme.bottomWidgetPaddingRight
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
          {(isAnimating, start, pause, resetAnimation, timeline, setTimelineValue) =>
            showAnimationControl ? (
              <LayerAnimationControl
                updateAnimationSpeed={visStateActions.updateLayerAnimationSpeed}
                toggleAnimation={visStateActions.toggleLayerAnimation}
                isAnimatable={!animatedFilter}
                isAnimating={isAnimating}
                resetAnimation={resetAnimation}
                setTimelineValue={setTimelineValue}
                timeline={timeline}
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
            {(isAnimating, start, pause, resetAnimation, timeline, setTimelineValue) =>
              showTimeWidget && timeline ? (
                <TimeWidget
                  // TimeWidget uses React.memo, here we pass width
                  // even though it doesnt use it, to force rerender
                  filter={filters[enlargedFilterIdx] as TimeRangeFilter}
                  index={enlargedFilterIdx}
                  datasets={datasets}
                  readOnly={readOnly}
                  showTimeDisplay={showFloatingTimeDisplay}
                  setFilterPlot={visStateActions.setFilterPlot}
                  setFilterAnimationTime={setTimelineValue}
                  setFilterAnimationWindow={visStateActions.setFilterAnimationWindow}
                  toggleAnimation={visStateActions.toggleFilterAnimation}
                  updateAnimationSpeed={visStateActions.updateFilterAnimationSpeed}
                  resetAnimation={resetAnimation}
                  isAnimatable={!animationConfig || !animationConfig.isAnimating}
                  onClose={onClose}
                  timeline={timeline}
                />
              ) : null
            }
          </FilterAnimationController>
        ) : null}
      </BottomWidgetContainer>
    );
  };

  /* eslint-disable react/display-name */
  return withTheme(
    // @ts-ignore
    forwardRef((props: BottomWidgetThemedProps, ref) => <BottomWidget {...props} rootRef={ref} />)
  );
  /* eslint-enable react/display-name */
}
/* eslint-enable complexity */
