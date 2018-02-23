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

// Actions
import ActionTypes from 'constants/action-types';

import {
  mapConfigChangeUpdater,
  mapStyleChangeUpdater,
  mapBuildingChangeUpdater,
  loadMapStylesUpdater,
  loadMapStyleErrUpdater,
  receiveMapConfigUpdater
} from './map-style-updaters';
import {hexToRgb} from 'utils/color-utils';

// Constants
import {
  INITIAL_STYLE_TYPE,
  DEFAULT_BLDG_COLOR
} from 'constants/default-settings';

// bedrock browserInit flattens our immutable object into a plain object
// we have to recreate the state after the app is loaded
const getDefaultState = () => {
  const visibleLayerGroups = {};
  const styleType = INITIAL_STYLE_TYPE;
  const topLayerGroups = {};

  return {
    styleType,
    visibleLayerGroups,
    topLayerGroups,
    mapStyles: {},
    buildingLayer: {
      isVisible: false,
      color: hexToRgb(DEFAULT_BLDG_COLOR),
      opacity: 0.7
    }
  };
};

export const INITIAL_MAP_STYLE = getDefaultState();

const mapStyleReducer = handleActions(
  {
    [ActionTypes.MAP_CONFIG_CHANGE]: mapConfigChangeUpdater,
    [ActionTypes.MAP_STYLE_CHANGE]: mapStyleChangeUpdater,
    [ActionTypes.MAP_BUILDING_CHANGE]: mapBuildingChangeUpdater,
    [ActionTypes.LOAD_MAP_STYLES]: loadMapStylesUpdater,
    [ActionTypes.LOAD_MAP_STYLE_ERR]: loadMapStyleErrUpdater,
    [ActionTypes.RECEIVE_MAP_CONFIG]: receiveMapConfigUpdater
  },
  INITIAL_MAP_STYLE
);

export default mapStyleReducer;
