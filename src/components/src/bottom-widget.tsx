// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {forwardRef, useMemo, useCallback, useRef, useState, useLayoutEffect} from 'react';
import styled, {withTheme, IStyledComponent} from 'styled-components';
import {useMergeRefs} from '@floating-ui/react';

import {DatasetType, FILTER_TYPES, FILTER_VIEW_TYPES, EXPORT_VIDEO_ID} from '@kepler.gl/constants';
import {FormattedMessage} from 'react-intl';
import {
  hasPortableWidth,
  isSideFilter,
  mergeFilterWithTimeline,
  observeDimensions,
  unobserveDimensions
} from '@kepler.gl/utils';
import {media, breakPointValues} from '@kepler.gl/styles';
import {
  Filter,
  MultiSelectFilter as CategoryFilter,
  RangeFilter,
  TimeRangeFilter
} from '@kepler.gl/types';

import TimeWidgetFactory from './filters/time-widget';
import MultiSelectFilterFactory from './filters/multi-select-filter';
import {Close} from './common/icons';
import {IconRoundSmall, SelectTextBold} from './common/styled-components';
import {bottomWidgetSelector} from './kepler-gl';
import FilterAnimationControllerFactory from './filter-animation-controller';
import LayerAnimationControllerFactory from './layer-animation-controller';
import AnimationControlFactory from './common/animation-control/animation-control';
import ZarrAxisAnimationFactory from './zarr-axis-animation';
import {getZarrVariable, isExplicitZarrAxis} from '@kepler.gl/table';
import {BaseComponentProps} from './types';

const maxWidth = 1080;
const allowedLegendOverlap = 30;

function isChartFilter(filter?: Filter): filter is RangeFilter | TimeRangeFilter {
  return filter?.type === FILTER_TYPES.timeRange || filter?.type === FILTER_TYPES.range;
}

function isCategoryFilter(filter?: Filter): filter is CategoryFilter {
  return (
    filter?.type === FILTER_TYPES.multiSelect &&
    Array.isArray(filter.domain) &&
    Array.isArray(filter.value)
  );
}

export type BottomWidgetContainerProps = BaseComponentProps & {
  $hasPadding?: boolean;
  width: number;
  ref: React.ForwardedRef<HTMLDivElement>;
};

const BottomWidgetContainer: IStyledComponent<
  'web',
  BottomWidgetContainerProps
> = styled.div<BottomWidgetContainerProps>`
  display: flex;
  flex-direction: column;
  padding-top: ${props => (props.$hasPadding ? props.theme.bottomWidgetPaddingTop : 0)}px;
  padding-right: ${props => (props.$hasPadding ? props.theme.bottomWidgetPaddingRight : 0)}px;
  padding-bottom: ${props => (props.$hasPadding ? props.theme.bottomWidgetPaddingBottom : 0)}px;
  padding-left: ${props => (props.$hasPadding ? props.theme.bottomWidgetPaddingLeft : 0)}px;
  pointer-events: none !important; /* prevent padding from blocking input */
  & > * {
    /* all children should allow input */
    pointer-events: all;
  }
  width: ${props => props.width}px;
  margin-left: auto;
  z-index: 1;
  ${media.portable`padding: 0;`}
`;

const CategoryFilterBox = styled.div`
  align-self: flex-end;
  width: 100%;
  max-width: 360px;
  box-sizing: border-box;
  padding: 12px;
  background-color: ${props => props.theme.sidePanelBg};
`;

const CategoryFilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const CategoryFilterTitle = styled(SelectTextBold)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export type BottomWidgetProps = {
  rootRef: React.ForwardedRef<HTMLDivElement>;
  containerW: number;
  readOnly?: boolean;
} & ReturnType<typeof bottomWidgetSelector>;
type ThemeProp = {
  theme: any;
};
type BottomWidgetThemedProps = BottomWidgetProps & ThemeProp;

BottomWidgetFactory.deps = [
  TimeWidgetFactory,
  AnimationControlFactory,
  FilterAnimationControllerFactory,
  LayerAnimationControllerFactory,
  ZarrAxisAnimationFactory,
  MultiSelectFilterFactory
];

/* eslint-disable complexity */
export default function BottomWidgetFactory(
  TimeWidget: ReturnType<typeof TimeWidgetFactory>,
  AnimationControl: ReturnType<typeof AnimationControlFactory>,
  FilterAnimationController: ReturnType<typeof FilterAnimationControllerFactory>,
  LayerAnimationController: ReturnType<typeof LayerAnimationControllerFactory>,
  ZarrAxisAnimation: ReturnType<typeof ZarrAxisAnimationFactory>,
  MultiSelectFilter: ReturnType<typeof MultiSelectFilterFactory> = MultiSelectFilterFactory()
): React.FC<BottomWidgetThemedProps> {
  const LayerAnimationControl = styled(AnimationControl)`
    background-color: ${props => props.theme.sidePanelBg};
  `;

  const CloseButton = styled(IconRoundSmall)`
    flex: none;
    border: 0;
    background: none;
    color: ${props => props.theme.textColor};
  `;

  const BottomWidget: React.FC<BottomWidgetThemedProps> = (props: BottomWidgetThemedProps) => {
    const {
      datasets,
      filters,
      animationConfig,
      toggleModal,
      visStateActions,
      containerW,
      uiState,
      sidePanelWidth,
      layers,
      rootRef,
      readOnly: readOnlyOverride,
      theme
    } = props;

    const {activeSidePanel, readOnly} = uiState;
    const isOpen = Boolean(activeSidePanel);
    const containerRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs([rootRef, containerRef]);
    const [timelineHeight, setTimelineHeight] = useState(0);

    const enlargedFilterIdx = useMemo(() => filters.findIndex(f => !isSideFilter(f)), [filters]);
    const animatedFilterIdx = useMemo(() => filters.findIndex(f => f.isAnimating), [filters]);
    const animatedFilter = animatedFilterIdx > -1 ? filters[animatedFilterIdx] : null;
    // we need to hide layer timeline when filter is synced and not enlarged
    const isTimelineLinkedWithFilter = useMemo(
      () => (filters as TimeRangeFilter[]).some(f => f.syncedWithLayerTimeline),
      [filters]
    );

    const availableWidth = Math.max(0, isOpen ? containerW - sidePanelWidth : containerW);
    const legend = uiState.mapControls?.mapLegend;
    const position = legend?.settings?.position;
    const reservedLegendWidth =
      theme.mapControl?.width +
      theme.mapControl?.mapLegend?.pinned?.right * 2 -
      theme.bottomWidgetPaddingRight;
    const isLegendInCorner =
      !position ||
      (position.anchorX === 'right' &&
        position.anchorY === 'bottom' &&
        position.x < reservedLegendWidth - allowedLegendOverlap &&
        position.y < timelineHeight - theme.bottomWidgetPaddingTop - allowedLegendOverlap);
    const spaceForLegendWidth =
      !hasPortableWidth(breakPointValues) && legend?.show && legend.active && isLegendInCorner
        ? Math.min(availableWidth, reservedLegendWidth)
        : 0;
    const enlargedFilterWidth = availableWidth - spaceForLegendWidth;
    useLayoutEffect(() => {
      const container = containerRef.current;
      if (!container) return undefined;
      const measureHeight = () => setTimelineHeight(container.offsetHeight);
      measureHeight();
      // Settings and other child-local changes can resize the timeline without new props.
      observeDimensions(container, measureHeight, 0);
      return () => unobserveDimensions(container);
    }, []);

    // show playback control if layers contain trip layer & at least one trip layer is visible
    const animatableLayer = useMemo(
      () =>
        layers.filter(l => l.config.animation && l.config.animation.enabled && l.config.isVisible),
      [layers]
    );

    const readyToAnimation = useMemo(
      () => Array.isArray(animationConfig.domain) && Number.isFinite(animationConfig.currentTime),
      [animationConfig.domain, animationConfig.currentTime]
    );

    const dimensionLayers = layers.filter(
      layer =>
        layer.type === 'zarr' &&
        layer.config.isVisible &&
        isExplicitZarrAxis(layer.config.visConfig.zarrAxis) &&
        layer.config.visConfig.zarrAxis.kind !== 'off'
    );

    // Preserve the legacy display flag for injected TimeWidget implementations.
    // The default TimeWidget always shows its selected range inline.
    const showFloatingTimeDisplay = !animatableLayer.length;
    const showAnimationControl =
      animatableLayer.length && readyToAnimation && !animationConfig.hideControl;
    const enlargedFilter = filters[enlargedFilterIdx];
    const categoryFilter =
      isCategoryFilter(enlargedFilter) && datasets[enlargedFilter.dataId[0]]
        ? enlargedFilter
        : null;
    const showTimeWidget = isChartFilter(enlargedFilter) && Object.keys(datasets).length > 0;

    // if filter is not animating, pass in enlarged filter here because
    // animation controller needs to call reset on it
    const filter = useMemo(
      () => animatedFilter || enlargedFilter,
      [animatedFilter, enlargedFilter]
    );
    const chartFilter = isChartFilter(filter) ? filter : null;

    // we merge filter and timeline if filter is synced
    const {filter: enhancedFilter, animationConfig: enhancedAnimationConfig} = useMemo(
      () =>
        chartFilter?.type === FILTER_TYPES.timeRange && chartFilter.syncedWithLayerTimeline
          ? mergeFilterWithTimeline(chartFilter as TimeRangeFilter, animationConfig)
          : {filter: chartFilter, animationConfig},
      [chartFilter, animationConfig]
    );

    const exportAnimation = useCallback(() => toggleModal(EXPORT_VIDEO_ID), [toggleModal]);

    const onClose = useCallback(
      () => visStateActions.setFilterView(enlargedFilterIdx, FILTER_VIEW_TYPES.side),
      [visStateActions, enlargedFilterIdx]
    );

    const setCategoryValue = useCallback(
      value => visStateActions.setFilter(enlargedFilterIdx, 'value', value),
      [visStateActions, enlargedFilterIdx]
    );

    const onToggleMinify = useCallback(
      () =>
        visStateActions.setFilterView(
          enlargedFilterIdx,
          filter.view === FILTER_VIEW_TYPES.enlarged
            ? FILTER_VIEW_TYPES.minified
            : FILTER_VIEW_TYPES.enlarged
        ),
      [enlargedFilterIdx, visStateActions, filter]
    );

    return (
      <BottomWidgetContainer
        width={Math.min(maxWidth, enlargedFilterWidth)}
        style={{marginRight: spaceForLegendWidth}}
        className="bottom-widget--container"
        $hasPadding={
          showAnimationControl ||
          showTimeWidget ||
          Boolean(categoryFilter) ||
          dimensionLayers.length > 0
        }
        ref={mergedRef}
      >
        {dimensionLayers.map(layer => {
          const {visConfig, dataId} = layer.config;
          const variable = getZarrVariable(
            datasets[dataId ?? '']?.metadata,
            visConfig.zarrVariable ?? undefined
          );
          return variable ? (
            <ZarrAxisAnimation
              key={layer.id}
              variable={variable}
              config={visConfig.zarrAxis}
              pins={visConfig.dimensionIndexes}
              frameIndex={visConfig.zarrFrame}
              label={layer.config.label}
              onFrameChange={zarrFrame => visStateActions.layerVisConfigChange(layer, {zarrFrame})}
            />
          ) : null;
        })}
        {!isTimelineLinkedWithFilter ? (
          <LayerAnimationController
            animationConfig={enhancedAnimationConfig}
            setLayerAnimationTime={visStateActions.setLayerAnimationTime}
          >
            {(isAnimating, start, pause, resetAnimation, timeline, setTimelineValue) =>
              showAnimationControl ? (
                <LayerAnimationControl
                  updateAnimationSpeed={visStateActions.updateLayerAnimationSpeed}
                  toggleAnimation={visStateActions.toggleLayerAnimation}
                  exportAnimation={exportAnimation}
                  isAnimatable={!animatedFilter}
                  isAnimating={isAnimating}
                  resetAnimation={resetAnimation}
                  setTimelineValue={setTimelineValue}
                  timeline={timeline}
                />
              ) : null
            }
          </LayerAnimationController>
        ) : null}
        {categoryFilter ? (
          <CategoryFilterBox
            role="group"
            aria-label={categoryFilter.name[0]}
            key={categoryFilter.id}
          >
            <CategoryFilterHeader>
              <CategoryFilterTitle title={categoryFilter.name[0]}>
                {categoryFilter.name[0]}
              </CategoryFilterTitle>
              {readOnly || readOnlyOverride ? null : (
                <FormattedMessage id="tooltip.closePanel">
                  {label => (
                    <CloseButton
                      as="button"
                      type="button"
                      aria-label={String(label)}
                      onClick={onClose}
                    >
                      <Close height="14px" />
                    </CloseButton>
                  )}
                </FormattedMessage>
              )}
            </CategoryFilterHeader>
            <MultiSelectFilter
              filter={categoryFilter}
              setFilter={setCategoryValue}
              allowCustomValues={categoryFilter.dataId.some(
                id => datasets[id]?.type === DatasetType.VECTOR_TILE
              )}
            />
          </CategoryFilterBox>
        ) : null}
        {enhancedFilter ? (
          <FilterAnimationController
            filter={enhancedFilter}
            filterIdx={animatedFilterIdx > -1 ? animatedFilterIdx : enlargedFilterIdx}
            setFilterAnimationTime={visStateActions.setFilterAnimationTime}
          >
            {(isAnimating, start, pause, resetAnimation, timeline, setTimelineValue) =>
              showTimeWidget && timeline ? (
                <TimeWidget
                  // TimeWidget uses React.memo, here we pass width
                  // even though it doesnt use it, to force rerender
                  filter={enhancedFilter}
                  index={enlargedFilterIdx}
                  datasets={datasets}
                  layers={layers}
                  readOnly={readOnly}
                  showTimeDisplay={showFloatingTimeDisplay}
                  setFilterPlot={visStateActions.setFilterPlot}
                  setFilterAnimationTime={setTimelineValue}
                  setFilterAnimationTimeConfig={visStateActions.setFilterAnimationTimeConfig}
                  setFilterAnimationWindow={visStateActions.setFilterAnimationWindow}
                  setFilterSyncTimelineMode={visStateActions.setTimeFilterSyncTimelineMode}
                  toggleAnimation={visStateActions.toggleFilterAnimation}
                  exportAnimation={exportAnimation}
                  updateAnimationSpeed={visStateActions.updateFilterAnimationSpeed}
                  resetAnimation={resetAnimation}
                  isAnimatable={!animationConfig || !animationConfig.isAnimating}
                  animationConfig={animationConfig}
                  onClose={onClose}
                  timeline={timeline}
                  onToggleMinify={onToggleMinify}
                />
              ) : null
            }
          </FilterAnimationController>
        ) : null}
      </BottomWidgetContainer>
    );
  };

  return React.memo(
    withTheme(
      forwardRef((props: BottomWidgetThemedProps, ref: React.ForwardedRef<HTMLDivElement>) => (
        <BottomWidget {...props} rootRef={ref} />
      ))
    )
  );
}
/* eslint-enable complexity */
