// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {
  updateMap,
  togglePerspective,
  fitBounds,
  toggleSplitMap,
  toggleSplitMapViewport,
  receiveMapConfig
} from '@kepler.gl/actions';

import {
  mapStateReducer as reducer,
  mapStateReducerFactory,
  INITIAL_MAP_STATE
} from '@kepler.gl/reducers';

const InitialMapState = reducer(undefined, {});
test('#mapStateReducer', t => {
  const newState = reducer(undefined, {});

  t.deepEqual(
    newState,
    {...INITIAL_MAP_STATE, initialState: {}},
    'should return the initial state'
  );

  t.end();
});

test('#mapStateReducerFactory', t => {
  const mapStateReducer = mapStateReducerFactory({dragRotate: true});
  const newState = mapStateReducer(undefined, {});

  t.deepEqual(
    newState,
    {...INITIAL_MAP_STATE, dragRotate: true, initialState: {dragRotate: true}},
    'should return the initial state'
  );

  t.end();
});

test('#mapStateReducer -> UPDATE_MAP', t => {
  const mapUpdate = {
    latitude: 24.123,
    longitude: 120.839,
    zoom: 2.3
  };
  const expectedState = {...InitialMapState, ...mapUpdate};

  const newState = reducer(undefined, updateMap(mapUpdate, 0));

  t.deepEqual(newState, expectedState, 'should update map longitude and latitude');

  t.end();
});

// eslint-disable-next-line max-statements
test('#mapStateReducer -> UPDATE_MAP - minZoom/maxZoom', t => {
  let mapUpdate = {
    zoom: 9,
    maxZoom: 12
  };
  let expectedState = {...InitialMapState, ...mapUpdate};
  let newState = reducer(undefined, updateMap(mapUpdate, 0));
  t.deepEqual(newState, expectedState, 'If zoom < maxZoom - zoom should stay the same');

  mapUpdate = {
    zoom: 14,
    maxZoom: 12
  };
  expectedState = {...InitialMapState, ...mapUpdate, ...{zoom: mapUpdate.maxZoom}};
  newState = reducer(undefined, updateMap(mapUpdate, 0));
  t.deepEqual(newState, expectedState, 'If zoom > maxZoom - zoom should be equal to maxZoom');

  mapUpdate = {
    zoom: 15,
    minZoom: 12
  };
  expectedState = {...InitialMapState, ...mapUpdate};
  newState = reducer(undefined, updateMap(mapUpdate, 0));
  t.deepEqual(newState, expectedState, 'If zoom > minZoom - zoom should stay the same');

  mapUpdate = {
    zoom: 9,
    minZoom: 12
  };
  expectedState = {...InitialMapState, ...mapUpdate, ...{zoom: mapUpdate.minZoom}};
  newState = reducer(undefined, updateMap(mapUpdate, 0));
  t.deepEqual(newState, expectedState, 'If zoom < minZoom - zoom should be equal to minZoom');

  mapUpdate = {
    zoom: 9,
    minZoom: 3,
    maxZoom: 15
  };
  expectedState = {...InitialMapState, ...mapUpdate};
  newState = reducer(undefined, updateMap(mapUpdate, 0));
  t.deepEqual(newState, expectedState, 'If minZoom < zoom < maxZoom - zoom should stay the same');

  mapUpdate = {
    zoom: 9,
    minZoom: 9,
    maxZoom: 9
  };
  expectedState = {...InitialMapState, ...mapUpdate};
  newState = reducer(undefined, updateMap(mapUpdate, 0));
  t.deepEqual(
    newState,
    expectedState,
    'If minZoom === zoom === maxZoom - zoom should stay the same'
  );

  mapUpdate = {
    zoom: 15,
    minZoom: 3,
    maxZoom: 12
  };
  expectedState = {...InitialMapState, ...mapUpdate, ...{zoom: mapUpdate.maxZoom}};
  newState = reducer(undefined, updateMap(mapUpdate, 0));
  t.deepEqual(
    newState,
    expectedState,
    'If minZoom < maxZoom < zoom - zoom should be equal to maxZoom'
  );

  mapUpdate = {
    zoom: 3,
    minZoom: 6,
    maxZoom: 12
  };
  expectedState = {...InitialMapState, ...mapUpdate, ...{zoom: mapUpdate.minZoom}};
  newState = reducer(undefined, updateMap(mapUpdate, 0));
  t.deepEqual(
    newState,
    expectedState,
    'If zoom < minZoom < maxZoom - zoom should be equal to minZoom'
  );

  t.end();
});

test('#mapStateReducer -> UPDATE_MAP - maxBounds', t => {
  let state = {
    ...InitialMapState,
    latitude: 37.685430657228906,
    longitude: -122.20643775128097,
    zoom: 5,
    width: 640,
    height: 480
  };
  let mapUpdate = {
    maxBounds: [-122.47705311445556, 37.52481163037179, -121.93582238810639, 37.846049684086026]
  };
  let expectedState = {
    ...state,
    ...mapUpdate,
    ...{
      latitude: 37.68560457001023,
      longitude: -122.20643775128097,
      zoom: 9.699465540852673
    }
  };
  let newState = reducer(state, updateMap(mapUpdate, 0));
  t.deepEqual(newState, expectedState, 'maxBounds is snapped to the viewport');

  state = {
    ...InitialMapState,
    latitude: 37.685430657228906,
    longitude: -122.20643775128097,
    zoom: 9,
    width: 640,
    height: 480,
    maxBounds: [-122.47705311445556, 37.52481163037179, -121.93582238810639, 37.846049684086026]
  };
  mapUpdate = {
    zoom: 12
  };
  expectedState = {...state, ...mapUpdate};
  newState = reducer(state, updateMap(mapUpdate, 0));
  t.deepEqual(newState, expectedState, 'Viewport is within maxBounds - zoomed in');

  state = {
    ...InitialMapState,
    latitude: 37.685430657228906,
    longitude: -122.20643775128097,
    zoom: 9,
    width: 640,
    height: 480,
    maxBounds: [-122.47705311445556, 37.52481163037179, -121.93582238810639, 37.846049684086026]
  };
  mapUpdate = {
    zoom: 8
  };
  expectedState = {...state};
  newState = reducer(state, updateMap(mapUpdate, 0));
  t.deepEqual(newState, expectedState, 'Viewport is outside the maxBounds - zoomed out');

  t.end();
});

test('#mapStateReducer -> UPDATE_MAP - split map and unsynced viewports', t => {
  // toggle to split mode
  let newState = reducer(INITIAL_MAP_STATE, toggleSplitMap());
  // change to unsynced viewports and retain default isZoomLocked
  newState = reducer(newState, toggleSplitMapViewport({isViewportSynced: false}));
  // and then update map for unsynced viewport of mapIndex 0
  let mapUpdate = {
    latitude: 24.123,
    longitude: 120.839,
    zoom: 2.3
  };
  const firstUnsyncedSplitMapViewportBeforeUpdatingMapState = {...newState.splitMapViewports[0]};
  newState = reducer(newState, updateMap(mapUpdate, 0));

  t.notDeepEqual(
    newState.splitMapViewports[0],
    firstUnsyncedSplitMapViewportBeforeUpdatingMapState,
    'unlocked zoom: updating mapIndex 0 should change the same split map viewport'
  );

  t.deepEqual(
    newState.splitMapViewports[1],
    firstUnsyncedSplitMapViewportBeforeUpdatingMapState,
    'unlocked zoom: updating mapIndex 0 should not change the other split map viewport'
  );

  t.notEqual(
    newState.splitMapViewports[0].zoom,
    newState.splitMapViewports[1].zoom,
    'unlocked zoom: should not set both viewports to the same zoom prop'
  );

  // retain unsycned viewports and change to isZoomLocked true
  newState = reducer(newState, toggleSplitMapViewport({isZoomLocked: true}));
  // and then update map for unsynced viewport and locked zoom of mapIndex 1
  mapUpdate = {
    latitude: 25,
    longitude: 123,
    zoom: 10
  };
  const expectedFistUnsyncedSplitMapViewportWithLockedZoom = {
    ...newState.splitMapViewports[0],
    zoom: mapUpdate.zoom
  };
  const secondUnsyncedSplitMapViewportBeforeUpdatingMapState = {...newState.splitMapViewports[1]};
  newState = reducer(newState, updateMap(mapUpdate, 1));

  t.notDeepEqual(
    newState.splitMapViewports[1],
    secondUnsyncedSplitMapViewportBeforeUpdatingMapState,
    'locked zoom: updating mapIndex 1 should change the same split map viewport'
  );

  t.deepEqual(
    newState.splitMapViewports[0],
    expectedFistUnsyncedSplitMapViewportWithLockedZoom,
    'locked zoom: updating mapIndex 1 should only change the zoom property of the other split map viewport but not other properties'
  );

  t.equal(
    newState.splitMapViewports[0].zoom,
    newState.splitMapViewports[1].zoom,
    'locked zoom: should set both viewports to the same zoom'
  );

  t.end();
});

test('#mapStateReducer -> TOGGLE_PERSPECTIVE', t => {
  const newState = reducer(undefined, {});
  t.equal(newState.dragRotate, false, 'dragRotate should default to false');

  const newState2 = reducer(undefined, togglePerspective());
  t.equal(newState2.dragRotate, true, 'dragRotate toggle should set it to true');
  t.equal(newState2.pitch, 50, 'pitch should set to default');
  t.equal(newState2.bearing, 24, 'bearing should set to default');

  const newState3 = reducer(newState2, togglePerspective());
  t.equal(newState3.dragRotate, false, 'dragRotate 2nd toggle should set it to false');
  t.equal(newState3.pitch, 0, 'pitch should set to zero');
  t.equal(newState3.bearing, 0, 'bearing should set to zero');

  t.end();
});

test('#mapStateReducer -> TOGGLE_PERSPECTIVE - split map and unsynced viewports', t => {
  // toggle to split mode
  let newState = reducer(INITIAL_MAP_STATE, toggleSplitMap());
  // change to unsynced viewports
  newState = reducer(
    newState,
    toggleSplitMapViewport({isViewportSynced: false, isZoomLocked: false})
  );
  // and then toggle perspective
  newState = reducer(newState, togglePerspective());

  t.equal(
    newState.dragRotate,
    newState.splitMapViewports[0].dragRotate,
    'split map with unsynced viewports: dragRotate should be copied to the first split viewport'
  );
  t.equal(
    newState.dragRotate,
    newState.splitMapViewports[1].dragRotate,
    'split map with unsynced viewports: dragRotate should be copied to the second split viewport'
  );
  t.equal(
    newState.pitch,
    newState.splitMapViewports[0].pitch,
    'split map with unsynced viewports: pitch should be copied to the first split viewport'
  );
  t.equal(
    newState.pitch,
    newState.splitMapViewports[1].pitch,
    'split map with unsynced viewports: pitch should be copied to the second split viewport'
  );
  t.equal(
    newState.bearing,
    newState.splitMapViewports[0].bearing,
    'split map with unsynced viewports: bearing should be copied to the first split viewport'
  );
  t.equal(
    newState.bearing,
    newState.splitMapViewports[1].bearing,
    'split map with unsynced viewports: bearing should be copied to the second split viewport'
  );

  t.end();
});

test('#mapStateReducer -> FIT_BOUNDS', t => {
  // default input and output in @mapbox/geo-viewport
  // https://github.com/mapbox/geo-viewport

  const bounds = [5.668343999999995, 45.111511000000014, 5.852471999999996, 45.26800200000002];

  const mapUpdate = {
    width: 640,
    height: 480
  };

  const expected = {
    center: [5.7604079999999955, 45.189756500000016],
    zoom: 10
  };

  const stateWidthMapDimension = reducer(undefined, updateMap(mapUpdate, 0));
  const updatedState = reducer(stateWidthMapDimension, fitBounds(bounds));

  t.equal(updatedState.latitude, expected.center[1], 'should fit latitude');
  t.equal(updatedState.longitude, expected.center[0], 'should fit longitude');
  t.equal(updatedState.zoom, expected.zoom, 'should fit zoom');

  t.end();
});

test('#mapStateReducer -> FIT_BOUNDS - split map and unsynced viewports', t => {
  // default input and output in @mapbox/geo-viewport
  // https://github.com/mapbox/geo-viewport

  const bounds = [5.668343999999995, 45.111511000000014, 5.852471999999996, 45.26800200000002];

  // toggle to split mode
  let newState = reducer(INITIAL_MAP_STATE, toggleSplitMap());
  // change to unsynced viewports
  newState = reducer(
    newState,
    toggleSplitMapViewport({isViewportSynced: false, isZoomLocked: false})
  );
  // and then fit bounds
  newState = reducer(newState, fitBounds(bounds));

  t.equal(
    newState.latitude,
    newState.splitMapViewports[0].latitude,
    'split map with unsynced viewports: latitude should be copied to the first split viewport'
  );
  t.equal(
    newState.latitude,
    newState.splitMapViewports[1].latitude,
    'split map with unsynced viewports: latitude should be copied to the second split viewport'
  );
  t.equal(
    newState.longitude,
    newState.splitMapViewports[0].longitude,
    'split map with unsynced viewports: longitude should be copied to the first split viewport'
  );
  t.equal(
    newState.longitude,
    newState.splitMapViewports[1].longitude,
    'split map with unsynced viewports: longitude should be copied to the second split viewport'
  );
  t.equal(
    newState.zoom,
    newState.splitMapViewports[0].zoom,
    'split map with unsynced viewports: zoom should be copied to the first split viewport'
  );
  t.equal(
    newState.zoom,
    newState.splitMapViewports[1].zoom,
    'split map with unsynced viewports: zoom should be copied to the second split viewport'
  );

  t.end();
});

test('#mapStateReducer -> FIT_BOUNDS.invalid', t => {
  // default input and output in @mapbox/geo-viewport
  // https://github.com/mapbox/geo-viewport

  const mapUpdate = {
    width: 640,
    height: 480
  };

  const stateWidthMapDimension = reducer(undefined, updateMap(mapUpdate, 0));
  const updatedState = reducer(stateWidthMapDimension, fitBounds(null));
  t.equal(updatedState, stateWidthMapDimension, 'should not update state when bounds is invalid');
  const updatedState2 = reducer(stateWidthMapDimension, fitBounds([500, -100, 322, 9]));
  t.equal(updatedState2, stateWidthMapDimension, 'should not update state when bounds is invalid');

  t.end();
});

test('#mapStateReducer -> SPLIT_MAP: toggle', t => {
  let newState = reducer(INITIAL_MAP_STATE, toggleSplitMap());

  const expectedState = {
    ...INITIAL_MAP_STATE,
    isSplit: true,
    width: 400
  };

  // validate the first split
  t.deepEqual(newState, expectedState, 'should validate toggle split view');

  // go back to single view
  newState = reducer(newState, toggleSplitMap());
  t.deepEqual(newState, INITIAL_MAP_STATE, 'should validate toggle back from split view');

  t.end();
});

test('#mapStateReducer -> SPLIT_MAP: upload mapState config to update split map state', t => {
  let state = {
    ...INITIAL_MAP_STATE,
    isSplit: true,
    width: 400
  };

  // cases:

  // 1. state split: true - isSplit: true
  // do nothing
  let newState = reducer(state, receiveMapConfig({mapState: {isSplit: true}}));
  t.deepEqual(
    newState,
    state,
    'setting isSplit to true when state is already split should not change the state'
  );

  // 2. state split: false - isSplit: false
  // do nothing
  state = {
    ...state,
    isSplit: false,
    width: 800
  };
  newState = reducer(state, receiveMapConfig({mapState: {isSplit: false}}));
  t.deepEqual(
    newState,
    state,
    'setting isSplit to false when state is not split should not change the state'
  );

  // 3. state split: true - isSplit: false
  // double width
  state = {
    ...state,
    isSplit: true,
    width: 400
  };
  newState = reducer(state, receiveMapConfig({mapState: {isSplit: false}}));
  t.deepEqual(
    newState,
    {
      ...state,
      width: 800,
      isSplit: false
    },
    'setting isSplit to false when state is already split should double width'
  );

  // 4. state split: false - isSplit: true
  // split width
  state = {
    ...state,
    isSplit: false,
    width: 800
  };
  newState = reducer(state, receiveMapConfig({mapState: {isSplit: true}}));
  t.deepEqual(
    newState,
    {
      ...state,
      width: 400,
      isSplit: true
    },
    'setting isSplit to true when state is already split should reduce width by half'
  );

  t.end();
});

test('#mapStateReducer -> SPLIT_MAP: close map at specific point', t => {
  let newState = reducer(INITIAL_MAP_STATE, toggleSplitMap());

  const expectedState = {
    ...INITIAL_MAP_STATE,
    isSplit: true,
    width: 400
  };

  // validate the first split
  t.deepEqual(newState, expectedState, 'should validate toggle split view');

  // go back to single view
  newState = reducer(newState, toggleSplitMap(1));
  t.deepEqual(newState, INITIAL_MAP_STATE, 'should validate toggle back from split view');

  t.end();
});

test('#mapStateReducer -> TOGGLE_SPLIT_MAP_VIEWPORT', t => {
  let newState = reducer(INITIAL_MAP_STATE, {});

  let expectedState = {
    ...INITIAL_MAP_STATE,
    isSplit: false,
    isViewportSynced: true,
    isZoomLocked: false,
    splitMapViewports: []
  };

  // validate defaults before making state changes
  t.deepEqual(
    newState,
    expectedState,
    'should retain default initial state values for isSplit, isViewportSynced, isZoomLocked, and splitMapViewports'
  );

  // toggle to split mode and retain defaults of synced viewports and unlocked zoom
  newState = reducer(newState, toggleSplitMap());
  newState = reducer(
    newState,
    toggleSplitMapViewport({isViewportSynced: true, isZoomLocked: false})
  );

  expectedState = {
    ...newState,
    isSplit: true,
    isViewportSynced: true,
    isZoomLocked: false,
    splitMapViewports: []
  };

  t.deepEqual(
    newState,
    expectedState,
    'toggling isSplit to true and setting isViewportSynced to true and isZoomLocked to false should retain default related initial state values'
  );

  // keep split mode and change synced viewports, but keep zoom lock as false
  const splitMapViewportsBeforeOnlyChangingIsViewportSyncedFalse = [...newState.splitMapViewports];
  newState = reducer(newState, toggleSplitMapViewport({isViewportSynced: false}));

  t.equal(
    newState.isViewportSynced,
    false,
    'changing isViewportSynced to false should update the same prop in next state'
  );

  t.notDeepEqual(
    newState.splitMapViewports,
    splitMapViewportsBeforeOnlyChangingIsViewportSyncedFalse,
    'changing isViewportSynced to false while retaining isZoomLocked as false should modify the splitMapViewports array'
  );

  // change one of the split viewports' zoom levels
  // then switch on locked zoom while retaining unsynced
  newState = reducer(newState, updateMap({zoom: 5}, 1));
  newState = reducer(newState, toggleSplitMapViewport({isZoomLocked: true}));

  t.equal(
    newState.isZoomLocked,
    true,
    'changing isZoomLocked to true should update the same prop in next state'
  );

  // and test if they both now have the same zoom
  t.equal(
    newState.splitMapViewports[0].zoom,
    newState.splitMapViewports[1].zoom,
    'while isViewportSynced is false, changing isZoomLocked to true should modify the splitMapViewports array to have matching zoom values'
  );

  // switch off locked zoom while retaining unsynced
  const splitMapViewportsBeforeOnlyChangingIsZoomLockedFalse = [...newState.splitMapViewports];
  newState = reducer(newState, toggleSplitMapViewport({isZoomLocked: false}));

  t.equal(
    newState.isZoomLocked,
    false,
    'changing isZoomLocked to false should update the same prop in next state'
  );

  t.deepEqual(
    newState.splitMapViewports,
    splitMapViewportsBeforeOnlyChangingIsZoomLockedFalse,
    'while isViewportSynced is false, changing isZoomLocked to false should not modify the splitMapViewports array'
  );

  // toggle from unsynced to synced viewports while retaining zoom lock as false
  newState = reducer(newState, toggleSplitMapViewport({isViewportSynced: true}));

  t.deepEqual(
    newState.splitMapViewports,
    [],
    'changing isViewportSynced to false should change the splitMapViewports array to be empty'
  );

  t.equal(
    newState.isZoomLocked,
    false,
    'changing isViewportSynced to false should also retain isZoomLocked as false'
  );

  t.end();
});
