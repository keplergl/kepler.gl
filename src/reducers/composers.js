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

import ActionTypes from 'constants/action-types';
import {fitBoundsUpdater} from './map-state-updaters';
import {toggleModalUpdater} from './ui-state-updaters';
import {updateVisDataUpdater} from './vis-state-updaters';
import {receiveMapConfigUpdater as stateMapConfigUpdater} from './map-state-updaters';
import {receiveMapConfigUpdater as styleMapConfigUpdater} from './map-style-updaters';
import {findMapBounds} from 'utils/data-utils';
// compose action to apply result multiple reducers, with the output of one

/**
 * Apply map bounds to mapState from received vis data
 * @param state
 * @param action {options, config: {}}
 * @returns state new reducer state
 */
export const updateVisDataComposed = (state, action) => {
  // keep a copy of oldLayers
  const oldLayers = state.visState.layers.map(l => l.id);

  const visState = updateVisDataUpdater(state.visState, action);

  const defaultOptions = {
    centerMap: true,
    // this will hide the left panel completely
    readOnly: false
  };
  const options = {
    ...defaultOptions,
    ...action.options
  };

  let bounds;
  if (options.centerMap) {
    // find map bounds for new layers
    const newLayers = visState.layers.filter(l => !oldLayers.includes(l.id));
    bounds = findMapBounds(newLayers);
  }

  return {
    ...state,
    visState,
    mapState: bounds
      ? fitBoundsUpdater(state.mapState, {
          payload: bounds
        })
      : state.mapState,
    uiState: {
      ...toggleModalUpdater(state.uiState, {payload: null}),
      readOnly: options.readOnly
    }
  };
};

/**
 * Combine data and full configuration update in a single action
 * @param state
 * @param action {datasets, options, config}
 * @returns state
 */
export const addDataToMapComposed = (state, action) => {

  const {datasets, options, config} = action.payload;

  // Update visState store
  let mergedState = updateVisDataComposed(state, {datasets, options, config: config && config.visState});

  // Update mapState store
  mergedState = {
    ...mergedState,
    mapState: stateMapConfigUpdater(mergedState.mapState, {payload: {mapState: config && config.mapState}})
  };

  // Update mapStyle store
  mergedState = {
    ...mergedState,
    mapStyle: styleMapConfigUpdater(mergedState.mapStyle, {payload: {mapStyle: config && config.mapStyle}})
  };

  return mergedState
};

const compostedUpdaters = {
  [ActionTypes.UPDATE_VIS_DATA]: updateVisDataComposed,
  [ActionTypes.ADD_DATA_TO_MAP]: addDataToMapComposed
};

export default compostedUpdaters;
