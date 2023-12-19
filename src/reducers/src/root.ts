// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ActionTypes, keplerGlInit, _actionFor, _updateProperty} from '@kepler.gl/actions';
import {handleActions} from 'redux-actions';

import {coreReducerFactory} from './core';

// INITIAL_STATE
const initialCoreState = {};

export function provideInitialState(initialState, extraReducers?) {
  const coreReducer = coreReducerFactory(initialState, extraReducers);

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

    // TODO: Understand why the Lint sees an error here, while the IDE does not.
    return handleActions(handlers, initialCoreState)(state, action);
  };
}

const _keplerGlReducer = provideInitialState(initialCoreState);

function mergeInitialState(saved = {}, provided = {}, extraInitialStateKeys: string[] = []) {
  const keys = ['mapState', 'mapStyle', 'visState', 'uiState', ...extraInitialStateKeys];

  // shallow merge each reducer
  const newState = keys.reduce(
    (accu, key) => ({
      ...accu,
      ...(saved[key] && provided[key]
        ? {[key]: {...saved[key], ...provided[key]}}
        : {[key]: saved[key] || provided[key] || {}})
    }),
    {}
  );

  return newState;
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
   * @param {Object} options - options to be applied to custom reducer logic
   * @param {Object} options.override - objects that describe which action to override, e.g. {[ActionTypes.LAYER_TYPE_CHANGE]: true}
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
  target.plugin = function plugin(customReducer, options) {
    if (typeof customReducer === 'object') {
      // if only provided a reducerMap, wrap it in a reducer
      customReducer = handleActions(customReducer, {});
    }

    // use 'function' keyword to enable 'this'
    return decorate((state = {}, action: {type?: string} = {}) => {
      let nextState = state;
      if (action.type && !options?.override?.[action.type]) {
        nextState = this(state, action);
      }

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
   * @param {Object} extraReducers - optional custom reducers in addition to the default `visState`, `mapState`, `mapStyle`, and `uiState`
   * @public
   * @example
   * const myKeplerGlReducer = keplerGlReducer
   *  .initialState({
   *    uiState: {readOnly: true}
   *  });
   */
  target.initialState = function initialState(iniSt, extraReducers = {}) {
    // passing through extraInitialStateKeys and extraReducers allows external customization by adding additional subreducers and state beyond the default `visState`, `mapState`, `mapStyle`, and `uiState`
    const extraInitialStateKeys = Object.keys(extraReducers);
    const merged = mergeInitialState(targetInitialState, iniSt, extraInitialStateKeys);
    const targetReducer = provideInitialState(merged, extraReducers);

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
