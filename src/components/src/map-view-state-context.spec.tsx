// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useContext} from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {updateMap} from '@kepler.gl/actions';
import {INITIAL_MAP_STATE, mapStateUpdaters} from '@kepler.gl/reducers';
import {MapState} from '@kepler.gl/types';
import {cameraTransition} from './camera-navigation';
import {MapViewStateContext, MapViewStateContextProvider} from './map-view-state-context';

const camera = {longitude: 10, latitude: 20, zoom: 6, bearing: 30, pitch: 45};

function setup() {
  const read = jest.fn();
  function Consumer() {
    const {getInternalViewState, setInternalViewState} = useContext(MapViewStateContext);
    read(getInternalViewState());
    return (
      <button type="button" onClick={() => setInternalViewState(camera)}>
        Move map
      </button>
    );
  }
  const tree = (mapState: MapState) => (
    <MapViewStateContextProvider mapState={mapState}>
      <Consumer />
    </MapViewStateContextProvider>
  );
  const {rerender} = render(tree(INITIAL_MAP_STATE));
  return {read, sync: (mapState: MapState) => rerender(tree(mapState))};
}

test('passes bookmark transition settings through the provider to the map consumer', () => {
  const {read, sync} = setup();
  const viewport = cameraTransition(camera);
  sync(mapStateUpdaters.updateMapUpdater(INITIAL_MAP_STATE, updateMap(viewport)));
  expect(read.mock.lastCall[0]).toMatchObject(viewport);
  expect(read.mock.lastCall[0].transitionInterpolator).toBe(viewport.transitionInterpolator);
});

test('preserves an explicit zero-duration update and removes absent transition settings', () => {
  const {read, sync} = setup();
  const animated = mapStateUpdaters.updateMapUpdater(
    INITIAL_MAP_STATE,
    updateMap(cameraTransition(camera))
  );
  sync(animated);
  sync(
    mapStateUpdaters.updateMapUpdater(
      animated,
      updateMap({...camera, zoom: 8, transitionDuration: 0})
    )
  );
  expect(read.mock.lastCall[0]).toMatchObject({zoom: 8, transitionDuration: 0});
  sync({...INITIAL_MAP_STATE, ...camera, zoom: 9});
  expect(read.mock.lastCall[0].transitionDuration).toBeUndefined();
  expect(read.mock.lastCall[0].transitionInterpolator).toBeUndefined();
});

test('acknowledging the current live view does not restart a saved transition', () => {
  const {read, sync} = setup();
  fireEvent.click(screen.getByRole('button', {name: 'Move map'}));
  sync(mapStateUpdaters.updateMapUpdater(INITIAL_MAP_STATE, updateMap(cameraTransition(camera))));
  expect(read.mock.lastCall[0]).toEqual(camera);
});
