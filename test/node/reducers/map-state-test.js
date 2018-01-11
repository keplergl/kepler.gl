import test from 'tape';
import {DIMENSIONS} from '../../../../constants/default-settings';

import {
  updateMap,
  togglePerspective,
  fitBounds,
  toggleSplitMap,
  toggleFullScreen
} from '../../../src/actions/map-state-actions';

import reducer, {INITIAL_MAP_STATE} from '../../../src/reducers/map-state';

test('#mapStateReducer', t => {

  const newState = reducer(undefined, {});

  t.deepEqual(newState, INITIAL_MAP_STATE,
    'should return the initial state');

  t.end();
});

test('#mapStateReducer -> UPDATE_MAP', t => {
  const mapUpdate = {
    latitude: 24.123,
    longitude: 120.839,
    zoom: 2.3
  };
  const expectedState = {...INITIAL_MAP_STATE, ...mapUpdate};

  const newState = reducer(undefined, updateMap(mapUpdate));

  t.deepEqual(newState, expectedState,
    'should update map longitude and latitude');

  t.end();
});

test('#mapStateReducer -> TOGGLE_PERSPECTIVE', t => {

  const newState = reducer(undefined, {});
  t.equal(newState.dragRotate, false,
    'dragRotate should default to false');

  const newState2 = reducer(undefined, togglePerspective());
  t.equal(newState2.dragRotate, true,
    'dragRotate toggle should set it to true');
  t.equal(newState2.pitch, 50,
    'pitch should set to default');
  t.equal(newState2.bearing, 24,
    'bearing should set to default');

  const newState3 = reducer(newState2, togglePerspective());
  t.equal(newState3.dragRotate, false,
    'dragRotate 2nd toggle should set it to false');
  t.equal(newState3.pitch, 0,
    'pitch should set to zero');
  t.equal(newState3.bearing, 0,
    'bearing should set to zero');

  t.end();
});

test('#mapStateReducer -> FIT_BOUNDS', t => {

  // default input and output in @mapbox/geo-viewport
  // https://github.com/mapbox/geo-viewport

  const bounds = [5.668343999999995,
    45.111511000000014,
    5.852471999999996,
    45.26800200000002];

  const mapUpdate = {
    width: 640,
    height: 480
  };

  const expected = {
    center: [5.7604079999999955, 45.189756500000016],
    zoom: 11
  };

  const stateWidthMapDimension = reducer(undefined, updateMap(mapUpdate));
  const updatedState = reducer(stateWidthMapDimension, fitBounds(bounds));

  t.equal(updatedState.latitude, expected.center[1], 'should fit latitude');
  t.equal(updatedState.longitude, expected.center[0], 'should fit longitude');
  t.equal(updatedState.zoom, expected.zoom, 'should fit zoom');

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
  t.deepEqual(
    newState,
    expectedState,
    'should validate toggle split view'
  );

  // go back to single view
  newState = reducer(newState, toggleSplitMap());
  t.deepEqual(
    newState,
    INITIAL_MAP_STATE,
    'should validate toggle back from split view'
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
  t.deepEqual(
    newState,
    expectedState,
    'should validate toggle split view'
  );

  // go back to single view
  newState = reducer(newState, toggleSplitMap(1));
  t.deepEqual(
    newState,
    INITIAL_MAP_STATE,
    'should validate toggle back from split view'
  );

  t.end();
});

test('#mapStateReducer -> toggle map full screen', t => {
  let newState = reducer(INITIAL_MAP_STATE, toggleFullScreen());

  const expectedState = {
    ...INITIAL_MAP_STATE,
    isFullScreen: true,
    height: INITIAL_MAP_STATE.height + (DIMENSIONS.qbHeight + DIMENSIONS.headerHeight)
  };

  // toggle full screen
  t.deepEqual(
    newState,
    expectedState,
    'should validate toggle full screen'
  );

  // toggle back
  newState = reducer(newState, toggleFullScreen());

  t.deepEqual(
    INITIAL_MAP_STATE,
    newState,
    'should validate toggle back to normal screen'
  );

  t.end();
});
