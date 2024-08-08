// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import WebMercatorViewport from 'viewport-mercator-project';

import {TRANSITION_DURATION} from '@kepler.gl/constants';
import {SplitMapLayers, SplitMap, Viewport, MapState} from '@kepler.gl/types';

export const onViewPortChange = (
  viewState: Viewport,
  onUpdateMap: (next: any, mapIndex: number) => any,
  onViewStateChange?: (next: any) => void | null,
  primary = false,
  mapIndex = 0
): void => {
  const {width = 0, height = 0, ...restViewState} = viewState;
  // react-map-gl sends 0,0 dimensions during initialization
  // after we have received proper dimensions from observeDimensions
  const next = {
    ...(width > 0 && height > 0 ? viewState : restViewState),
    // enabling transition in two maps may lead to endless update loops
    transitionDuration: primary ? TRANSITION_DURATION : 0
  };
  if (onViewStateChange && typeof onViewStateChange === 'function') {
    onViewStateChange(next);
  }

  onUpdateMap(next, mapIndex);
};

export const getMapLayersFromSplitMaps = (
  splitMaps: SplitMap[],
  mapIndex?: number
): SplitMapLayers | undefined | null => {
  return splitMaps[mapIndex || 0]?.layers;
};

/**
 * Generates a viewport from a map state.
 * @param {*} mapState
 * @returns A viewport.
 */
export const getViewportFromMapState = (mapState: MapState): Viewport => {
  return new WebMercatorViewport(mapState);
};
