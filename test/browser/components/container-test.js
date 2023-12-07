// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable max-statements, enzyme-deprecation/no-mount */
import React from 'react';
import test from 'tape';
import {mount} from 'enzyme';
import {combineReducers} from 'redux';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import sinon from 'sinon';
import {console as Console} from 'global/window';
import {
  keplerGlReducer as rootReducer,
  keplerGlReducerCore as coreReducer
} from '@kepler.gl/reducers';
import {keplerGlInit} from '@kepler.gl/actions';

import Container, {ERROR_MSG} from '@kepler.gl/components';
import {DEFAULT_MAPBOX_API_URL} from '@kepler.gl/constants';
const initialCoreState = coreReducer(undefined, keplerGlInit());
const initialState = {
  keplerGl: {}
};
const mockStore = configureStore();

test('Components -> Container -> Mount with mint:true', t => {
  // mount with empty store
  let store = mockStore({});
  const spy = sinon.spy(Console, 'error');

  // mount without id or a kepler.gl state
  mount(
    <Provider store={store}>
      <Container />
    </Provider>
  );

  t.ok(spy.calledOnce, 'should call console.error once');
  t.equal(
    spy.getCall(0).args[0],
    ERROR_MSG.noState,
    'should warn when cannot find kepler.gl state'
  );

  // mount with kepler.gl state
  store = mockStore(initialState);
  let appReducer = combineReducers({
    keplerGl: rootReducer
  });
  t.doesNotThrow(() => {
    mount(
      <Provider store={store}>
        <Container />
      </Provider>
    );
  }, 'Should not throw error');

  let actions = store.getActions();

  let expectedActions0 = {
    type: '@@kepler.gl/REGISTER_ENTRY',
    payload: {
      id: 'map',
      mint: true,
      mapboxApiAccessToken: undefined,
      mapboxApiUrl: undefined,
      mapStylesReplaceDefault: undefined,
      initialUiState: undefined
    }
  };

  t.deepEqual(actions, [expectedActions0], 'should register entry and request map style');

  // dispatch register action to reducer
  let nextState = appReducer({}, expectedActions0);
  let expectedState = {
    keplerGl: {
      map: initialCoreState
    }
  };

  t.deepEqual(nextState, expectedState, 'should register map to root reducer by default');

  // mount with custom state
  store = mockStore({smoothie: {}});
  appReducer = combineReducers({
    smoothie: rootReducer
  });

  let wrapper;
  const testId = {
    id: 'milkshake',
    mapboxApiAccessToken: 'pk.smoothie'
  };

  // mount with mint: true
  t.doesNotThrow(() => {
    wrapper = mount(
      <Provider store={store}>
        <Container
          getState={s => s.smoothie}
          id={testId.id}
          mapboxApiAccessToken={testId.mapboxApiAccessToken}
        />
      </Provider>
    );
  }, 'Should not throw error when mount');

  actions = store.getActions();

  expectedActions0 = {
    type: '@@kepler.gl/REGISTER_ENTRY',
    payload: {
      id: 'milkshake',
      mint: true,
      mapboxApiAccessToken: 'pk.smoothie',
      mapboxApiUrl: undefined,
      mapStylesReplaceDefault: undefined,
      initialUiState: undefined
    }
  };

  t.deepEqual(actions, [expectedActions0], 'should register entry and request map style');
  actions.splice(0, 2);

  nextState = appReducer({}, expectedActions0);
  expectedState = {
    smoothie: {
      milkshake: {
        ...initialCoreState,
        mapStyle: {
          ...initialCoreState.mapStyle,
          mapboxApiAccessToken: 'pk.smoothie'
        }
      }
    }
  };

  t.deepEqual(nextState, expectedState, 'should register milkshake to root reducer');

  // unmount
  wrapper.unmount();
  expectedActions0 = {type: '@@kepler.gl/DELETE_ENTRY', payload: 'milkshake'};

  actions = store.getActions();
  t.deepEqual(actions, [expectedActions0], 'should call unmount');

  nextState = appReducer(nextState, expectedActions0);
  expectedState = {
    smoothie: {}
  };
  t.deepEqual(nextState, expectedState, 'should delete milkshake from root reducer');

  spy.restore();
  t.end();
});

test('Components -> Container -> Mount with mint:false', t => {
  const spy = sinon.spy(Console, 'error');

  // mount with custom state
  const store = mockStore({smoothie: {}});
  const appReducer = combineReducers({
    smoothie: rootReducer
  });

  let wrapper;
  const testId = {
    id: 'milkshake'
  };

  // mount with mint: false
  t.doesNotThrow(() => {
    wrapper = mount(
      <Provider store={store}>
        <Container
          getState={s => s.smoothie}
          id={testId.id}
          mint={false}
          mapboxApiAccessToken="hello.world"
        />
      </Provider>
    );
  }, 'Should not throw error when mount');

  let actions = store.getActions();

  const expectedActions0 = {
    type: '@@kepler.gl/REGISTER_ENTRY',
    payload: {
      id: 'milkshake',
      mint: false,
      mapboxApiAccessToken: 'hello.world',
      mapboxApiUrl: undefined,
      mapStylesReplaceDefault: undefined,
      initialUiState: undefined
    }
  };

  t.deepEqual(actions, [expectedActions0], 'should register entry and request map style');
  actions.splice(0, 2);

  const nextState = appReducer({}, expectedActions0);
  const expectedState = {
    smoothie: {
      milkshake: {
        ...initialCoreState,
        mapStyle: {
          ...initialCoreState.mapStyle,
          // should replace access token
          mapboxApiAccessToken: 'hello.world',
          mapboxApiUrl: DEFAULT_MAPBOX_API_URL
        }
      }
    }
  };
  t.deepEqual(nextState, expectedState, 'should register milkshake to root reducer');

  // unmount
  wrapper.unmount();

  actions = store.getActions();
  t.deepEqual(actions, [], 'should not call unmount');

  spy.restore();
  t.end();
});

test('Components -> Container -> Mount then rename', t => {
  const dispatch = sinon.spy();

  // mount with custom state
  const store = mockStore({smoothie: {}});
  const appReducer = combineReducers({
    smoothie: rootReducer
  });

  let wrapper;
  const testId = {
    id: 'milkshake'
  };

  // mount with mint: false
  t.doesNotThrow(() => {
    wrapper = mount(
      <Container
        getState={s => s.smoothie}
        id={testId.id}
        mapboxApiAccessToken="hello.world"
        dispatch={dispatch}
        store={store}
      />
    );
  }, 'Should not throw error when mount');

  const expectedActions0 = {
    type: '@@kepler.gl/REGISTER_ENTRY',
    payload: {
      id: 'milkshake',
      mint: true,
      mapboxApiAccessToken: 'hello.world',
      mapboxApiUrl: undefined,
      mapStylesReplaceDefault: undefined,
      initialUiState: undefined
    }
  };

  t.deepEqual(store.getActions().pop(), expectedActions0, 'should register entry');

  const nextState = appReducer({}, expectedActions0);
  const expectedState = {
    smoothie: {
      milkshake: {
        ...initialCoreState,
        mapStyle: {
          ...initialCoreState.mapStyle,
          // should replace access token
          mapboxApiAccessToken: 'hello.world'
        }
      }
    }
  };
  t.deepEqual(nextState, expectedState, 'should register milkshake to root reducer');

  wrapper.setProps({id: 'milkshake-2'});
  // actions = store.getActions();
  const expectedActions1 = {
    type: '@@kepler.gl/RENAME_ENTRY',
    payload: {oldId: 'milkshake', newId: 'milkshake-2'}
  };

  t.deepEqual(store.getActions().pop(), expectedActions1, 'should rename entry');

  const nextState1 = appReducer(nextState, expectedActions1);
  const expectedState1 = {
    smoothie: {
      'milkshake-2': nextState.smoothie.milkshake
    }
  };

  t.deepEqual(nextState1, expectedState1, 'should rename milkshake to milkshake-2');
  // unmount
  wrapper.unmount();

  const expectedActions2 = {type: '@@kepler.gl/DELETE_ENTRY', payload: 'milkshake-2'};

  t.deepEqual(store.getActions().pop(), expectedActions2, 'should call unmount milkshake-2');

  t.end();
});
/* eslint-enable max-statements */
