// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import test from 'tape';
import {mount} from 'enzyme';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import sinon from 'sinon';
import {console as Console} from 'global/window';
import rootReducer from 'reducers/root';
import coreReducer from 'reducers/core';
import {keplerGlInit} from 'actions/actions';

import {combineReducers} from 'redux';

const initialCoreState = coreReducer(undefined, keplerGlInit());

const initialState = {
  keplerGl: {}
};
const mockStore = configureStore();

import Container, {errorMsg} from 'components/container';

test('Components -> Container -> Mount', t => {
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
    errorMsg.noState,
    'should warn when cannot find kepler.gl state'
  );

  // mount with kepler.gl state
  store = mockStore({keplerGl: {}});
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

  let expectedActions0 = {type: '@@kepler.gl/REGISTER_ENTRY', payload: 'map'};

  t.deepEqual(
    actions,
    [expectedActions0],
    'should register entry and request map style'
  );

  // dispatch register action to reducer
  let nextState = appReducer({}, expectedActions0);
  let expectedState = {
    keplerGl: {
      map: initialCoreState
    }
  };

  t.deepEqual(
    nextState,
    expectedState,
    'should register map to root reducer by default'
  );

  // mount with custom state
  store = mockStore({smoothie: {}});
  appReducer = combineReducers({
    smoothie: rootReducer
  });

  let wrapper;
  const testId = {
    id: 'milkshake'
  };
  t.doesNotThrow(() => {
    wrapper = mount(
      <Provider store={store}>
        <Container getState={s => s.smoothie} id={testId.id} />
      </Provider>
    );
  }, 'Should not throw error when mount');

  actions = store.getActions();

  expectedActions0 = {type: '@@kepler.gl/REGISTER_ENTRY', payload: 'milkshake'};

  t.deepEqual(
    actions,
    [expectedActions0],
    'should register entry and request map style'
  );
  actions.splice(0, 2);

  nextState = appReducer({}, expectedActions0);
  expectedState = {
    smoothie: {
      milkshake: initialCoreState
    }
  };
  t.deepEqual(
    nextState,
    expectedState,
    'should register milkshake to root reducer'
  );

  // unmount
  wrapper.unmount();
  expectedActions0 = {type: '@@kepler.gl/DELETE_ENTRY', payload: 'milkshake'};

  actions = store.getActions();
  t.deepEqual(actions, [expectedActions0], 'should call unmount');

  nextState = appReducer(nextState, expectedActions0);
  expectedState = {
    smoothie: {}
  };
  t.deepEqual(
    nextState,
    expectedState,
    'should delete milkshake from root reducer'
  );

  spy.restore();
  t.end();
});
