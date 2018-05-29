import test from 'tape';

import reducer, {INITIAL_MAP_STYLE} from 'reducers/map-style';
import {keplerGlInit, receiveMapConfig} from 'actions/actions';
import SchemaManager from 'schemas';
import {
  drainTasksForTesting,
  succeedTaskInTest,
  errorTaskInTest
} from 'react-palm/tasks';

// helpers
import {StateWCustomMapStyle} from 'test/helpers/mock-state';

const InitialMapStyle = reducer(undefined, {});

test('#mapStyleReducer', t => {
  const newState = reducer(undefined, {});

  t.deepEqual(newState, {
    ...INITIAL_MAP_STYLE,
    initialState: {}
    }, 'should return the initial map style');

  t.end();
});

test('#mapStyleReducer -> INIT', t => {
  const newState = reducer(InitialMapStyle, keplerGlInit({mapboxApiAccessToken: 'smoothies_secret_token'}));

  t.deepEqual(newState, {
    ...INITIAL_MAP_STYLE,
    initialState: {},
    mapboxApiAccessToken: 'smoothies_secret_token'
  }, 'initialie map style with mapboxApiAccessToken');

  t.end();
});

test('#mapStyleReducer -> RECEIVE_MAP_CONFIG', t => {
  const stateWithToken = reducer(InitialMapStyle, keplerGlInit({mapboxApiAccessToken: 'smoothies_secret_token'}));

  const stateToSave = StateWCustomMapStyle.toJS();
  // save state
  const savedState = SchemaManager.getConfigToSave(stateToSave);

  // load state
  const stateLoaded = SchemaManager.parseSavedConfig(savedState);
  console.log(stateLoaded);

  const stateWithConfig= reducer(
    stateWithToken,
    receiveMapConfig(stateLoaded)
  );
  const [task1, ...more] = drainTasksForTesting();

  t.equal(more.length, 0, 'should return 1 task');

  // TODO: ask btford how to test Task.all

  t.end();
});
