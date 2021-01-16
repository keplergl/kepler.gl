// Copyright (c) 2021 Uber Technologies, Inc.
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

import {_actionFor, _updateProperty} from '../actions/action-wrapper';
import {keplerGlInit} from '../actions/actions';
import {coreReducerFactory} from './core';
import ActionTypes from 'constants/action-types';

// INITIAL_STATE
const initialCoreState = {};

export function provideInitialState(initialState) {
  const coreReducer = coreReducerFactory(initialState);

  const handleRegisterEntry = (
    state,
    {
      payload: {
        id,
        mint,
        mapboxApiAccessToken,
        mapboxApiUrl,
        mapStylesReplaceDefault,
        initialUiState
      }
    }
  ) => {
    // by default, always create a mint state even if the same id already exist
    // if state.id exist and mint=false, keep the existing state
    const previousState = state[id] && mint === false ? state[id] : undefined;

    return {
      // register entry to kepler.gl passing in mapbox config to mapStyle
      ...state,
      [id]: coreReducer(
        previousState,
        keplerGlInit({mapboxApiAccessToken, mapboxApiUrl, mapStylesReplaceDefault, initialUiState})
      )
    };
  };

  const handleDeleteEntry = (state, {payload: id}) =>
    Object.keys(state).reduce(
      (accu, curr) => ({
        ...accu,
        ...(curr === id ? {} : {[curr]: state[curr]})
      }),
      {}
    );

  const handleRenameEntry = (state, {payload: {oldId, newId}}) =>
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
      const updateItemState = coreReducer(state[id], _actionFor(id, action));
      state = _updateProperty(state, id, updateItemState);
    });

    // perform additional state reducing (e.g. switch action.type etc...)
    const handlers = {
      [ActionTypes.REGISTER_ENTRY]: handleRegisterEntry,
      [ActionTypes.DELETE_ENTRY]: handleDeleteEntry,
      [ActionTypes.RENAME_ENTRY]: handleRenameEntry
    };

    // @ts-ignore
    return handleActions(handlers, initialCoreState)(state, action);
  };
}

const _keplerGlReducer = provideInitialState();

function mergeInitialState(saved = {}, provided = {}) {
  const keys = ['mapState', 'mapStyle', 'visState', 'uiState'];

  // shallow merge each reducer
  return keys.reduce(
    (accu, key) => ({
      ...accu,
      ...(saved[key] && provided[key]
        ? {[key]: {...saved[key], ...provided[key]}}
        : {[key]: saved[key] || provided[key] || {}})
    }),
    {}
  );
}

function decorate(target, savedInitialState = {}) {
  const targetInitialState = savedInitialState;

  /**
   * Returns a kepler.gl reducer that will also pass each action through additional reducers spiecified.
   * The parameter should be either a reducer map or a reducer function.
   * The state passed into the additional action handler is the instance state.
   * It will include all the subreducers `visState`, `uiState`, `mapState` and `mapStyle`.
   * `.plugin` is only meant to be called once when mounting the keplerGlReducer to the store.
   * **Note** This is an advanced option to give you more freedom to modify the internal state of the kepler.gl instance.
   * You should only use this to adding additional actions instead of replacing default actions.
   *
   * @mixin keplerGlReducer.plugin
   * @memberof keplerGlReducer
   * @param {Object|Function} customReducer - A reducer map or a reducer
   * @public
   * @example
   * const myKeplerGlReducer = keplerGlReducer
   *  .plugin({
   *    // 1. as reducer map
   *    HIDE_AND_SHOW_SIDE_PANEL: (state, action) => ({
   *      ...state,
   *      uiState: {
   *        ...state.uiState,
   *        readOnly: !state.uiState.readOnly
   *      }
   *    })
   *  })
   * .plugin(handleActions({
   *   // 2. as reducer
   *   'HIDE_MAP_CONTROLS': (state, action) => ({
   *     ...state,
   *     uiState: {
   *       ...state.uiState,
   *       mapControls: hiddenMapControl
   *     }
   *   })
   * }, {}));
   */
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
        nextState = _updateProperty(
          nextState,
          id,
          customReducer(nextState[id], _actionFor(id, action))
        );
      });

      return nextState;
    });
  };

  /**
   * Return a reducer that initiated with custom initial state.
   * The parameter should be an object mapping from `subreducer` name to custom subreducer state,
   * which will be shallow **merged** with default initial state.
   *
   * Default subreducer state:
   *  - [`visState`](./vis-state.md#INITIAL_VIS_STATE)
   *  - [`mapState`](./map-state.md#INITIAL_MAP_STATE)
   *  - [`mapStyle`](./map-style.md#INITIAL_MAP_STYLE)
   *  - [`uiState`](./ui-state.md#INITIAL_UI_STATE)
   * @mixin keplerGlReducer.initialState
   * @memberof keplerGlReducer
   * @param {Object} iniSt - custom state to be merged with default initial state
   * @public
   * @example
   * const myKeplerGlReducer = keplerGlReducer
   *  .initialState({
   *    uiState: {readOnly: true}
   *  });
   */
  target.initialState = function initialState(iniSt) {
    const merged = mergeInitialState(targetInitialState, iniSt);
    const targetReducer = provideInitialState(merged);

    return decorate(targetReducer, merged);
  };

  return target;
}

/**
 * Kepler.gl reducer to be mounted to your store. You can mount `keplerGlReducer` at property `keplerGl`, if you choose
 * to mount it at another address e.g. `foo` you will need to specify it when you mount `KeplerGl` component in your app with `getState: state => state.foo`
 * @public
 * @example
 * import keplerGlReducer from 'kepler.gl/reducers';
 * import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
 * import {taskMiddleware} from 'react-palm/tasks';
 *
 * const initialState = {};
 * const reducers = combineReducers({
 *   // <-- mount kepler.gl reducer in your app
 *   keplerGl: keplerGlReducer,
 *
 *   // Your other reducers here
 *   app: appReducer
 * });
 *
 * // using createStore
 * export default createStore(reducer, initialState, applyMiddleware(taskMiddleware));
 */
const keplerGlReducer = decorate(_keplerGlReducer);
export default keplerGlReducer;
