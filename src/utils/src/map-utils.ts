// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import WebMercatorViewport from 'viewport-mercator-project';

import {TRANSITION_DURATION} from '@kepler.gl/constants';
import {SplitMapLayers, SplitMap, Viewport, MapState} from '@kepler.gl/types';

import {validateLatitude, validateLongitude} from './data-utils';

/**
 * Validates a ViewPort object.
 * It retains all properties of the original ViewPort object,
 * but ensures that the latitude is within the defined bounds.
 * @param viewport - The ViewPort object to validate.
 * @returns A new ViewPort object with validated latitude.
 */
export const validateViewPort = <T extends Pick<Viewport, 'latitude' | 'longitude'>>(
  viewport: T
): T => {
  return {
    ...viewport,
    // make sure to process latitude to avoid 90, -90 values
    // Uncaught Error: Pixel project matrix not invertible
    ...(viewport.latitude ? {latitude: validateLatitude(viewport.latitude)} : {}),
    ...(viewport.longitude ? {longitude: validateLongitude(viewport.longitude)} : {})
  };
};

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
 * @param mapState
 * @returns A viewport.
 */
export const getViewportFromMapState = (mapState: MapState): Viewport => {
  // Make sure we capture error
  // e.g. Error message: "Pixel project matrix not invertible"
  let viewPort;
  try {
    viewPort = new WebMercatorViewport(mapState);
  } catch {
    // catch error and fallback to default map state
    viewPort = new WebMercatorViewport(validateViewPort(mapState));
  }

  return viewPort;
};
