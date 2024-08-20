// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useEffect, createContext} from 'react';
import isEqual from 'lodash.isequal';
import pick from 'lodash.pick';
import {MapViewState} from '@deck.gl/core/typed';
import {pickViewportPropsFromMapState} from '@kepler.gl/reducers';

import {MapState} from '@kepler.gl/types';

export type MapViewStateContextType = {
  getInternalViewState: (index?: number) => MapViewState;
  setInternalViewState: (viewState?: MapViewState, index?: number) => void;
};

export const MapViewStateContext: React.Context<MapViewStateContextType> = createContext({
  getInternalViewState: () => ({latitude: 0, longitude: 0, zoom: 0}),
  setInternalViewState: () => {
    return;
  }
});

/**
 * This context provider is used to localize the map view state so
 * that changes to the map view state do not affect the rest of the app,
 * mainly to prevent issues we experienced with basemap/deck viewport syncing.
 */

export const MapViewStateContextProvider = ({
  mapState,
  children
}: {
  mapState: MapState;
  children: React.ReactNode;
}) => {
  const {isSplit, isViewportSynced} = mapState || {};

  // Store locally map view states by mapIndex
  const [viewStates, setViewStates] = useState([mapState]);

  // Detect and apply outside viewport changes
  // (e.g. from geocoder or when switching to 3d mode)
  useEffect(() => {
    if (!mapState) return;
    const primaryState = viewStates[0];
    if (primaryState === mapState) return;
    const props = Object.keys(primaryState).filter(key => !key.startsWith('transition'));
    const hasChanged = (a, b) => !isEqual(pick(a, props), pick(b, props));
    if (isSplit && !isViewportSynced) {
      if (mapState.splitMapViewports?.some((s, i) => hasChanged(s, viewStates[i]))) {
        setViewStates(mapState.splitMapViewports as MapState[]);
      }
    } else if (hasChanged(primaryState, mapState)) {
      setViewStates([pickViewportPropsFromMapState(mapState)] as MapState[]);
    }
    // Only update internalViewState when viewState changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapState]);

  const value = {
    getInternalViewState: (index = 0) => viewStates[index] ?? viewStates[0],
    setInternalViewState: (newViewState, index = 0) => {
      setViewStates(prevViewStates => {
        if (isSplit && !isViewportSynced) {
          const nextViewStates = [...prevViewStates];
          nextViewStates[index] = newViewState as MapState;
          return nextViewStates;
        }
        return [newViewState] as MapState[];
      });
    }
  } as MapViewStateContextType;
  return <MapViewStateContext.Provider value={value}>{children}</MapViewStateContext.Provider>;
};
