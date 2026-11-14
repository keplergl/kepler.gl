// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useContext} from 'react';
import {LinearInterpolator} from '@deck.gl/core';
import {fireEvent, render, screen} from '@testing-library/react';
import {toggleSplitMapViewport, updateMap} from '@kepler.gl/actions';
import {INITIAL_MAP_STATE, mapStateUpdaters} from '@kepler.gl/reducers';
import {MapState} from '@kepler.gl/types';
import {cameraTransition} from './camera-navigation';
import {MapViewStateContext, MapViewStateContextProvider} from './map-view-state-context';

const camera = {longitude: 10, latitude: 20, zoom: 6, bearing: 30, pitch: 45};

test('does not notify camera consumers on parent renders or a Redux echo of the live view', () => {
  const read = jest.fn();
  const Consumer = React.memo(() => {
    const {getInternalViewState, setInternalViewState} = useContext(MapViewStateContext);
    const view = getInternalViewState();
    read(view);
    return <button onClick={() => setInternalViewState(camera)}>{view.longitude}</button>;
  });
  const tree = (mapState: MapState) => (
    <MapViewStateContextProvider mapState={mapState}>
      <Consumer />
    </MapViewStateContextProvider>
  );
  const {rerender} = render(tree(INITIAL_MAP_STATE));
  expect(read).toHaveBeenCalledTimes(1);
  rerender(tree(INITIAL_MAP_STATE));
  expect(read).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveTextContent('10');
  expect(read).toHaveBeenCalledTimes(2);
  rerender(tree(mapStateUpdaters.updateMapUpdater(INITIAL_MAP_STATE, updateMap(camera))));
  expect(read).toHaveBeenCalledTimes(2);
  rerender(tree({...INITIAL_MAP_STATE, ...camera, longitude: 50}));
  expect(screen.getByRole('button')).toHaveTextContent('50');
  expect(read).toHaveBeenCalledTimes(3);
});

test('updates live camera routing when split viewport synchronization changes', () => {
  const left = {...INITIAL_MAP_STATE, ...camera};
  const right = {...left, longitude: 100};
  const Consumer = React.memo(() => {
    const {getInternalViewState, setInternalViewState} = useContext(MapViewStateContext);
    return (
      <button onClick={() => setInternalViewState({...camera, longitude: 150}, 1)}>
        {getInternalViewState(0).longitude},{getInternalViewState(1).longitude}
      </button>
    );
  });
  const tree = (isViewportSynced: boolean) => (
    <MapViewStateContextProvider
      mapState={{
        ...left,
        isSplit: true,
        isViewportSynced,
        splitMapViewports: [left, right]
      }}
    >
      <Consumer />
    </MapViewStateContextProvider>
  );
  const {rerender} = render(tree(false));
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveTextContent('10,150');
  rerender(tree(true));
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveTextContent('150,150');
});

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

test.each([false, true])(
  'split pane navigation preserves the other center and respects zoom lock %s',
  isZoomLocked => {
    const left = {...camera, width: 400, height: 600};
    const right = {...left, longitude: 100, zoom: 9};
    let state = {
      ...INITIAL_MAP_STATE,
      ...right,
      isSplit: true,
      isViewportSynced: false,
      isZoomLocked,
      splitMapViewports: [left, right]
    };
    const read = jest.fn();
    function Consumer() {
      const {getInternalViewState} = useContext(MapViewStateContext);
      read([getInternalViewState(0), getInternalViewState(1)]);
      return null;
    }
    const tree = () => (
      <MapViewStateContextProvider mapState={state}>
        <Consumer />
      </MapViewStateContextProvider>
    );
    const {rerender} = render(tree());
    expect(read.mock.lastCall[0][0].longitude).toBe(10);
    expect(read.mock.lastCall[0][1].longitude).toBe(100);
    state = mapStateUpdaters.updateMapUpdater(
      state,
      updateMap({...camera, longitude: 150, zoom: 12, transitionDuration: 0}, 1)
    ) as typeof state;
    rerender(tree());
    expect(read.mock.lastCall[0][0]).toMatchObject({longitude: 10, zoom: isZoomLocked ? 12 : 6});
    expect(read.mock.lastCall[0][1]).toMatchObject({
      longitude: 150,
      zoom: 12,
      transitionDuration: 0
    });
  }
);

test.each([0, 1])('resyncs both panes after the last interaction in pane %s', mapIndex => {
  const left = {...camera, width: 400, height: 600};
  const right = {...left, longitude: 100, zoom: 9};
  let state: MapState = {
    ...INITIAL_MAP_STATE,
    ...[left, right][mapIndex],
    isSplit: true,
    isViewportSynced: false,
    splitMapViewports: [left, right]
  };
  const read = jest.fn();
  function Consumer() {
    const {getInternalViewState} = useContext(MapViewStateContext);
    read([getInternalViewState(0), getInternalViewState(1)]);
    return null;
  }
  const tree = () => (
    <MapViewStateContextProvider mapState={state}>
      <Consumer />
    </MapViewStateContextProvider>
  );
  const {rerender} = render(tree());
  expect(read.mock.lastCall[0]).toEqual([left, right]);
  state = mapStateUpdaters.toggleSplitMapViewportUpdater(
    state,
    toggleSplitMapViewport({isViewportSynced: true})
  );
  rerender(tree());
  expect(read.mock.lastCall[0][0]).toMatchObject([left, right][mapIndex]);
  expect(read.mock.lastCall[0][1]).toBe(read.mock.lastCall[0][0]);
});

test('globe bookmarks animate with finite geographic frames near the poles', () => {
  const target = {...camera, latitude: 89, longitude: -179};
  const viewport = cameraTransition(target, {
    ...INITIAL_MAP_STATE,
    globe: {...INITIAL_MAP_STATE.globe!, enabled: true}
  });
  expect(viewport.transitionDuration).toBe(1000);
  expect(viewport.transitionInterpolator).toBeInstanceOf(LinearInterpolator);
  expect(viewport).toMatchObject({latitude: 75, pitch: 0, bearing: 0});
  const interpolator = viewport.transitionInterpolator!;
  // The globe controller adjusts -179 to 181 for shortest-path dateline travel.
  const {start, end} = interpolator.initializeProps(
    {...viewport, longitude: 179, latitude: 74},
    {...viewport, longitude: 181}
  );
  const frame = interpolator.interpolateProps(start, end, 0.5);
  expect(frame.longitude).toBe(180);
  expect(frame.latitude).toBe(74.5);
  expect(Object.values(frame).every(Number.isFinite)).toBe(true);
  expect(target).toEqual({...camera, latitude: 89, longitude: -179});
});
