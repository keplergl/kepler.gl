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

import {handleActions} from 'redux-actions';

import {actionFor, updateProperty} from '../actions/action-wrapper';
import {coreReducerFactory} from './core';

import {
  REGISTER_ENTRY,
  DELETE_ENTRY,
  RENAME_ENTRY
} from '../actions/identity-actions';

import {keplerGlInit} from '../actions/actions';
/*
 * voyager reducer wrapper,
 * wraps multiple voyager state in one voyager
 */

// INITIAL_STATE
const initialCoreState = {};

export function provideInitialState(initialState) {
  const coreReducer = coreReducerFactory(initialState);

  const handleRegisterEntry = (state, {payload: {id, mint, mapboxApiAccessToken}}) => ({
    // register a new entry to voyager reducer
    // by default, always create a mint state even if the same id already exist
    // if state.id exist and mint=false, keep the existing state
    ...state,
    [id]: state[id] && mint === false ? state[id] : {
      ...coreReducer(undefined, keplerGlInit({mapboxApiAccessToken}))
    }
  });

  const handleDeleteEntry = (state, {payload: id}) =>
    Object.keys(state).reduce(
      (accu, curr) => ({
        ...accu,
        ...(curr === id ? {} : {[curr]: state[curr]})
      }),
      {}
    );

  const handleRenameEntry = (state, {payload: [oldId, newId]}) =>
    Object.keys(state).reduce(
      (accu, curr) => ({
        ...accu,
        ...{[curr === oldId ? newId : curr]: state[curr]}
      }),
      {}
    );

  return (state = initialCoreState, action) => {
    // update child states
    Object.keys(state).forEach(id => {
      const updateItemState = coreReducer(state[id], actionFor(id, action));
      state = updateProperty(state, id, updateItemState);
    });

    // perform additional state reducing (e.g. switch action.type etc...)
    return handleActions(
      {
        [REGISTER_ENTRY]: handleRegisterEntry,
        [DELETE_ENTRY]: handleDeleteEntry,
        [RENAME_ENTRY]: handleRenameEntry
      },
      initialCoreState
    )(state, action);
  };
}

const keplerGlReducer = provideInitialState();

function mergeInitialState(saved = {}, provided = {}) {
  const keys = ['mapState', 'mapStyle', 'visState', 'uiState'];

  // shallow merge each reducer
  return keys.reduce((accu, key) => ({
    ...accu,
    ...(saved[key] && provided[key] ?
        {[key]: {...saved[key], ...provided[key]}} :
        {[key]: saved[key] || provided[key] || {}})
  }), {});
}

function decorate(target, savedInitialState = {}) {
  const targetInitialState = savedInitialState;

  // plugin to core reducer
  target.plugin = function plugin(customReducer) {
    if (typeof customReducer === 'object') {
      // if only provided a reducerMap, wrap it in a reducer
      customReducer = handleActions(customReducer, {});
    }

    // use 'function' keyword to enable 'this'
    return decorate((state = {}, action = {}) => {
      let nextState = this(state, action);

      // for each entry in the staten
      Object.keys(nextState).forEach(id => {
        // update child states
        nextState = updateProperty(
          nextState,
          id,
          customReducer(nextState[id], actionFor(id, action))
        );
      });

      return nextState;
    });
  };

  // pass in initialState for reducer slices
  // e.g. initialState = {uiState: {currentModal : null}}
  target.initialState = function initialState(iniSt) {
    const merged = mergeInitialState(targetInitialState, iniSt);
    const targetReducer = provideInitialState(merged);

    return decorate(targetReducer, merged);
  }

  return target;
}

export default decorate(keplerGlReducer);
