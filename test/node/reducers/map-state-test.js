// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';

import {
  updateMap,
  togglePerspective,
  fitBounds,
  toggleSplitMap,
  toggleSplitMapViewport,
  receiveMapConfig,
  setMapSplitMode,
  setSwipeComparePercentage,
  setMapViewMode,
  globeConfigChange
} from '@kepler.gl/actions';

import {
  mapStateReducer as reducer,
  mapStateReducerFactory,
  INITIAL_MAP_STATE
} from '@kepler.gl/reducers';

import {
  MapViewMode,
  GLOBE_MIN_ZOOM,
  GLOBE_MAX_ZOOM,
  DEFAULT_GLOBE_CONFIG
} from '@kepler.gl/constants';

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
    zoom: 10.569800116329509
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
    width: 400,
    mapSplitMode: 'DUAL_MAP'
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
    width: 400,
    mapSplitMode: 'DUAL_MAP'
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

test('#mapStateReducer -> SET_MAP_SPLIT_MODE: single to swipe', t => {
  const newState = reducer(INITIAL_MAP_STATE, setMapSplitMode({mapSplitMode: 'SWIPE_COMPARE'}));

  t.equal(newState.isSplit, true, 'should set isSplit to true');
  t.equal(newState.mapSplitMode, 'SWIPE_COMPARE', 'should set mapSplitMode to SWIPE_COMPARE');
  t.equal(newState.swipeComparePercentage, 50, 'should keep default swipe percentage');
  t.equal(newState.isViewportSynced, true, 'should force viewport sync in swipe mode');
  t.equal(newState.width, 800, 'should NOT halve width in swipe mode');

  t.end();
});

test('#mapStateReducer -> SET_MAP_SPLIT_MODE: single to dual', t => {
  const newState = reducer(INITIAL_MAP_STATE, setMapSplitMode({mapSplitMode: 'DUAL_MAP'}));

  t.equal(newState.isSplit, true, 'should set isSplit to true');
  t.equal(newState.mapSplitMode, 'DUAL_MAP', 'should set mapSplitMode to DUAL_MAP');
  t.equal(newState.width, 400, 'should halve width in dual mode');

  t.end();
});

test('#mapStateReducer -> SET_MAP_SPLIT_MODE: swipe to single', t => {
  let state = reducer(INITIAL_MAP_STATE, setMapSplitMode({mapSplitMode: 'SWIPE_COMPARE'}));
  state = reducer(state, setMapSplitMode({mapSplitMode: 'SINGLE_MAP'}));

  t.equal(state.isSplit, false, 'should set isSplit to false');
  t.equal(state.mapSplitMode, 'SINGLE_MAP', 'should set mapSplitMode to SINGLE_MAP');
  t.equal(state.width, 800, 'should restore full width');

  t.end();
});

test('#mapStateReducer -> SET_MAP_SPLIT_MODE: dual to swipe', t => {
  let state = reducer(INITIAL_MAP_STATE, setMapSplitMode({mapSplitMode: 'DUAL_MAP'}));
  t.equal(state.width, 400, 'dual mode should halve width');

  state = reducer(state, setMapSplitMode({mapSplitMode: 'SWIPE_COMPARE'}));

  t.equal(state.isSplit, true, 'should remain split');
  t.equal(state.mapSplitMode, 'SWIPE_COMPARE', 'should switch to SWIPE_COMPARE');
  t.equal(state.width, 800, 'should restore full width in swipe mode');
  t.equal(state.isViewportSynced, true, 'should force viewport sync');

  t.end();
});

test('#mapStateReducer -> SET_MAP_SPLIT_MODE: swipe to dual', t => {
  let state = reducer(INITIAL_MAP_STATE, setMapSplitMode({mapSplitMode: 'SWIPE_COMPARE'}));
  state = reducer(state, setMapSplitMode({mapSplitMode: 'DUAL_MAP'}));

  t.equal(state.isSplit, true, 'should remain split');
  t.equal(state.mapSplitMode, 'DUAL_MAP', 'should switch to DUAL_MAP');
  t.equal(state.width, 400, 'should halve width in dual mode');

  t.end();
});

test('#mapStateReducer -> SET_MAP_SPLIT_MODE: same mode is no-op', t => {
  const state = reducer(INITIAL_MAP_STATE, setMapSplitMode({mapSplitMode: 'SINGLE_MAP'}));

  t.equal(state, INITIAL_MAP_STATE, 'should return same state reference when mode unchanged');

  t.end();
});

test('#mapStateReducer -> SET_SWIPE_COMPARE_PERCENTAGE', t => {
  let state = reducer(INITIAL_MAP_STATE, setSwipeComparePercentage({percentage: 30}));

  t.equal(state.swipeComparePercentage, 30, 'should update swipe percentage');

  // same value is no-op
  const state2 = reducer(state, setSwipeComparePercentage({percentage: 30}));
  t.equal(state2, state, 'should return same state reference when percentage unchanged');

  // clamps to 0
  state = reducer(INITIAL_MAP_STATE, setSwipeComparePercentage({percentage: -10}));
  t.equal(state.swipeComparePercentage, 0, 'should clamp negative values to 0');

  // clamps to 100
  state = reducer(INITIAL_MAP_STATE, setSwipeComparePercentage({percentage: 150}));
  t.equal(state.swipeComparePercentage, 100, 'should clamp values above 100 to 100');

  t.end();
});

test('#mapStateReducer -> toggleSplitMapViewport in SWIPE_COMPARE mode', t => {
  let state = reducer(INITIAL_MAP_STATE, setMapSplitMode({mapSplitMode: 'SWIPE_COMPARE'}));

  const stateBeforeToggle = state;
  state = reducer(state, toggleSplitMapViewport({isViewportSynced: false}));

  t.equal(state, stateBeforeToggle, 'should not allow unsyncing viewports in swipe mode');

  t.end();
});

test('#mapStateReducer -> SET_MAP_VIEW_MODE: enter globe mode', t => {
  const state = reducer(INITIAL_MAP_STATE, setMapViewMode(MapViewMode.MODE_GLOBE));

  t.equal(state.mapViewMode, MapViewMode.MODE_GLOBE, 'should set mapViewMode to globe');
  t.equal(state.globe.enabled, true, 'should enable globe');
  t.equal(state.pitch, 0, 'should reset pitch entering globe');
  t.equal(state.bearing, 0, 'should reset bearing entering globe');
  t.equal(state.dragRotate, true, 'should enable dragRotate in globe');
  t.equal(state.minZoom, GLOBE_MIN_ZOOM, 'should apply globe minZoom');
  t.equal(state.maxZoom, GLOBE_MAX_ZOOM, 'should apply globe maxZoom');

  t.end();
});

test('#mapStateReducer -> SET_MAP_VIEW_MODE: globe clamps zoom into range', t => {
  // zoom above the cap should clamp down to GLOBE_MAX_ZOOM
  let state = reducer(
    {...INITIAL_MAP_STATE, zoom: GLOBE_MAX_ZOOM + 5},
    setMapViewMode(MapViewMode.MODE_GLOBE)
  );
  t.equal(state.zoom, GLOBE_MAX_ZOOM, 'zoom above cap should clamp to GLOBE_MAX_ZOOM');

  // zoom below the floor should clamp up to GLOBE_MIN_ZOOM
  state = reducer(
    {...INITIAL_MAP_STATE, zoom: GLOBE_MIN_ZOOM - 5},
    setMapViewMode(MapViewMode.MODE_GLOBE)
  );
  t.equal(state.zoom, GLOBE_MIN_ZOOM, 'zoom below floor should clamp to GLOBE_MIN_ZOOM');

  // zoom already in range should be preserved
  state = reducer({...INITIAL_MAP_STATE, zoom: 6}, setMapViewMode(MapViewMode.MODE_GLOBE));
  t.equal(state.zoom, 6, 'zoom within range should be preserved');

  t.end();
});

test('#mapStateReducer -> SET_MAP_VIEW_MODE: leaving globe clears globe zoom bounds', t => {
  // enter globe (which sets min/maxZoom to globe bounds)
  const globeState = reducer(INITIAL_MAP_STATE, setMapViewMode(MapViewMode.MODE_GLOBE));
  t.equal(globeState.minZoom, GLOBE_MIN_ZOOM, 'sanity: globe minZoom set');
  t.equal(globeState.maxZoom, GLOBE_MAX_ZOOM, 'sanity: globe maxZoom set');

  // globe -> 2D should clear the globe-only bounds so the flat map isn't clamped
  const to2d = reducer(globeState, setMapViewMode(MapViewMode.MODE_2D));
  t.equal(to2d.globe.enabled, false, '2D should disable globe');
  t.equal(to2d.minZoom, undefined, 'globe -> 2D should clear minZoom');
  t.equal(to2d.maxZoom, undefined, 'globe -> 2D should clear maxZoom');
  t.equal(to2d.pitch, 0, 'globe -> 2D should reset pitch');
  t.equal(to2d.bearing, 0, 'globe -> 2D should reset bearing');

  // globe -> 3D should also clear the globe-only bounds
  const to3d = reducer(globeState, setMapViewMode(MapViewMode.MODE_3D));
  t.equal(to3d.globe.enabled, false, '3D should disable globe');
  t.equal(to3d.minZoom, undefined, 'globe -> 3D should clear minZoom');
  t.equal(to3d.maxZoom, undefined, 'globe -> 3D should clear maxZoom');
  t.equal(to3d.pitch, 50, 'globe -> 3D should set 3D pitch');
  t.equal(to3d.bearing, 24, 'globe -> 3D should set 3D bearing');

  t.end();
});

test('#mapStateReducer -> SET_MAP_VIEW_MODE: preserves custom zoom bounds when globe never enabled', t => {
  // App configured custom bounds and never entered globe: switching 2D/3D must
  // NOT wipe those bounds (only leaving globe clears them).
  const customState = {...INITIAL_MAP_STATE, minZoom: 3, maxZoom: 15};

  const to3d = reducer(customState, setMapViewMode(MapViewMode.MODE_3D));
  t.equal(to3d.minZoom, 3, '2D -> 3D should preserve custom minZoom');
  t.equal(to3d.maxZoom, 15, '2D -> 3D should preserve custom maxZoom');

  const to2d = reducer(
    {...customState, mapViewMode: MapViewMode.MODE_3D},
    setMapViewMode(MapViewMode.MODE_2D)
  );
  t.equal(to2d.minZoom, 3, '3D -> 2D should preserve custom minZoom');
  t.equal(to2d.maxZoom, 15, '3D -> 2D should preserve custom maxZoom');

  t.end();
});

test('#mapStateReducer -> SET_MAP_VIEW_MODE: invalid mode is no-op', t => {
  const state = reducer(INITIAL_MAP_STATE, setMapViewMode('NOT_A_MODE'));
  t.equal(state, INITIAL_MAP_STATE, 'unknown view mode should return same state reference');

  t.end();
});

test('#mapStateReducer -> TOGGLE_PERSPECTIVE: leaving globe clears globe zoom bounds', t => {
  // enter globe first, then toggle perspective (which forces globe off)
  const globeState = reducer(INITIAL_MAP_STATE, setMapViewMode(MapViewMode.MODE_GLOBE));
  const toggled = reducer(globeState, togglePerspective());

  t.equal(toggled.globe.enabled, false, 'togglePerspective should disable globe');
  t.equal(toggled.minZoom, undefined, 'leaving globe via togglePerspective should clear minZoom');
  t.equal(toggled.maxZoom, undefined, 'leaving globe via togglePerspective should clear maxZoom');

  t.end();
});

test('#mapStateReducer -> TOGGLE_PERSPECTIVE: preserves custom zoom bounds when globe never enabled', t => {
  const customState = {...INITIAL_MAP_STATE, minZoom: 4, maxZoom: 14};
  const toggled = reducer(customState, togglePerspective());

  t.equal(toggled.minZoom, 4, 'togglePerspective without globe should preserve custom minZoom');
  t.equal(toggled.maxZoom, 14, 'togglePerspective without globe should preserve custom maxZoom');
  t.equal(toggled.dragRotate, true, 'togglePerspective should still flip dragRotate');

  t.end();
});

test('#mapStateReducer -> GLOBE_CONFIG_CHANGE: merges partial config', t => {
  const globeState = reducer(INITIAL_MAP_STATE, setMapViewMode(MapViewMode.MODE_GLOBE));

  const updated = reducer(
    globeState,
    globeConfigChange({atmosphere: false, backgroundColor: [10, 20, 30]})
  );

  t.equal(updated.globe.config.atmosphere, false, 'should update atmosphere');
  t.deepEqual(updated.globe.config.backgroundColor, [10, 20, 30], 'should update backgroundColor');
  // untouched keys should be preserved from the defaults
  t.equal(
    updated.globe.config.terminator,
    DEFAULT_GLOBE_CONFIG.terminator,
    'should preserve unrelated config keys'
  );
  t.equal(
    updated.globe.config.water,
    DEFAULT_GLOBE_CONFIG.water,
    'should preserve unrelated config keys'
  );
  // changing config must not toggle globe enabled state
  t.equal(updated.globe.enabled, true, 'should not change globe enabled flag');

  t.end();
});
