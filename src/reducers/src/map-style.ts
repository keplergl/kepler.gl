// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {handleActions} from 'redux-actions';
import {ActionTypes} from '@kepler.gl/actions';
import * as mapStyleUpdaters from './map-style-updaters';

/**
 * Important: Do not rename `actionHandler` or the assignment pattern of property value.
 * It is used to generate documentation
 */
const actionHandler = {
  [ActionTypes.INIT]: mapStyleUpdaters.initMapStyleUpdater,
  [ActionTypes.INPUT_MAP_STYLE]: mapStyleUpdaters.inputMapStyleUpdater,
  [ActionTypes.MAP_CONFIG_CHANGE]: mapStyleUpdaters.mapConfigChangeUpdater,
  [ActionTypes.MAP_STYLE_CHANGE]: mapStyleUpdaters.mapStyleChangeUpdater,
  [ActionTypes.REQUEST_MAP_STYLES]: mapStyleUpdaters.requestMapStylesUpdater,
  [ActionTypes.LOAD_MAP_STYLES]: mapStyleUpdaters.loadMapStylesUpdater,
  [ActionTypes.LOAD_MAP_STYLE_ERR]: mapStyleUpdaters.loadMapStyleErrUpdater,
  [ActionTypes.RECEIVE_MAP_CONFIG]: mapStyleUpdaters.receiveMapConfigUpdater,
  [ActionTypes.LOAD_CUSTOM_MAP_STYLE]: mapStyleUpdaters.loadCustomMapStyleUpdater,
  [ActionTypes.ADD_CUSTOM_MAP_STYLE]: mapStyleUpdaters.addCustomMapStyleUpdater,
  [ActionTypes.EDIT_CUSTOM_MAP_STYLE]: mapStyleUpdaters.editCustomMapStyleUpdater,
  [ActionTypes.REMOVE_CUSTOM_MAP_STYLE]: mapStyleUpdaters.removeCustomMapStyleUpdater,
  [ActionTypes.RESET_MAP_CONFIG]: mapStyleUpdaters.resetMapConfigMapStyleUpdater,
  [ActionTypes.SET_3D_BUILDING_COLOR]: mapStyleUpdaters.set3dBuildingColorUpdater,
  [ActionTypes.SET_BACKGROUND_COLOR]: mapStyleUpdaters.setBackgroundColorUpdater,
  [ActionTypes.RESET_MAP_CONFIG]: mapStyleUpdaters.resetMapConfigMapStyleUpdater
};

export const mapStyleReducerFactory = (initialState = {}) =>
  // @ts-expect-error
  handleActions(actionHandler, {
    ...mapStyleUpdaters.INITIAL_MAP_STYLE,
    ...initialState,
    initialState
  });

export default mapStyleReducerFactory();
