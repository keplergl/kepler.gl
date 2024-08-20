// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {combineReducers} from 'redux';

import {visStateReducerFactory} from './vis-state';
import {mapStateReducerFactory} from './map-state';
import {mapStyleReducerFactory} from './map-style';
import {uiStateReducerFactory} from './ui-state';
import {providerStateReducerFactory} from './provider-state';

import composers from './composers';

import {VisState} from '@kepler.gl/schemas';
import {MapState, UiState} from '@kepler.gl/types';
import {MapStyle} from './map-style-updaters';
import {ProviderState} from './provider-state-updaters';

export type KeplerGlState = {
  visState: VisState;
  mapState: MapState;
  mapStyle: MapStyle;
  uiState: UiState;
  providerState: ProviderState;
};

const combined = (
  initialState: Partial<KeplerGlState> = {},
  extraReducers: {[x: string]: unknown} = {}
) => {
  return combineReducers({
    visState: visStateReducerFactory(initialState.visState),
    mapState: mapStateReducerFactory(initialState.mapState),
    mapStyle: mapStyleReducerFactory(initialState.mapStyle),
    uiState: uiStateReducerFactory(initialState.uiState),
    providerState: providerStateReducerFactory(initialState.providerState),
    ...extraReducers
  });
};

export const coreReducerFactory =
  (initialState: Partial<KeplerGlState> = {}, extraReducers = {}) =>
  (state, action) => {
    if (composers[action.type]) {
      return composers[action.type](state, action);
    }
    return combined(initialState, extraReducers)(state, action);
  };

export default coreReducerFactory();

/**
 * Connect subreducer `mapState`, used with `injectComponents`. Learn more at
 * [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)
 *
 * @param {*} reduxState
 * @public
 */
export const mapStateLens = (reduxState: KeplerGlState) => ({mapState: reduxState.mapState});

/**
 * Connect subreducer `mapStyle`, used with `injectComponents`. Learn more at
 * [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)
 *
 * @param {*} reduxState
 * @public
 */
export const mapStyleLens = (reduxState: KeplerGlState) => ({mapStyle: reduxState.mapStyle});

/**
 * Connect subreducer `visState`, used with `injectComponents`. Learn more at
 * [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)
 *
 * @param {*} reduxState
 * @public
 */
export const visStateLens = (reduxState: KeplerGlState) => ({visState: reduxState.visState});

/**
 * Connect subreducer `uiState`, used with `injectComponents`. Learn more at
 * [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)
 *
 * @param {*} reduxState
 * @public
 */
export const uiStateLens = (reduxState: KeplerGlState) => ({uiState: reduxState.uiState});

/**
 * Connect subreducer `providerState`, used with `injectComponents`. Learn more at
 * [Replace UI Component](../advanced-usages/replace-ui-component.md#pass-custom-component-props)
 *
 * @param {*} reduxState
 * @public
 */
export const providerStateLens = (reduxState: KeplerGlState) => ({
  providerState: reduxState.providerState
});
