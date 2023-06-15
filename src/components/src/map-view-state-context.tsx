import React, {useState, useEffect, createContext} from 'react';
import isEqual from 'lodash.isequal';
import pick from 'lodash.pick';

import {MapState} from '@kepler.gl/types';

export const MapViewStateContext: React.Context<any> = createContext(null);

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
    } else {
      if (hasChanged(primaryState, mapState)) {
        setViewStates([mapState]);
      }
    }
    // Only update internalViewState when viewState changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapState]);

  return (
    <MapViewStateContext.Provider
      value={{
        getInternalViewState: index => viewStates[index] ?? viewStates[0],
        setInternalViewState: (newViewState, index) => {
          setViewStates(prevViewStates => {
            const nextViewStates = [...prevViewStates];
            nextViewStates[index] = newViewState;
            return nextViewStates;
          });
        }
      }}
    >
      {children}
    </MapViewStateContext.Provider>
  );
};
