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

import keyMirror from 'keymirror';
import {ACTION_PREFIX} from './default-settings';

const ActionTypes = keyMirror({
  // visState
  ADD_DATA: null,
  ADD_FILTER: null,
  ADD_LAYER: null,
  INTERACTION_CONFIG_CHANGE: null,
  LAYER_CONFIG_CHANGE: null,
  LAYER_VISUAL_CHANNEL_CHANGE: null,
  LAYER_TYPE_CHANGE: null,
  LAYER_VIS_CONFIG_CHANGE: null,
  LAYER_HOVER: null,
  LAYER_CLICK: null,
  MAP_CLICK: null,
  REMOVE_FILTER: null,
  REMOVE_LAYER: null,
  REMOVE_DATASET: null,
  REORDER_LAYER: null,
  SET_FILTER: null,
  SHOW_DATASET_TABLE: null,
  UPDATE_LAYER_BLENDING: null,
  UPDATE_VIS_DATA: null,
  TOGGLE_FILTER_ANIMATION: null,
  UPDATE_FILTER_ANIMATION_SPEED: null,
  TOGGLE_LAYER_CONFIG_ACTIVE: null,
  ENLARGE_FILTER: null,
  SET_VISIBLE_LAYERS_FOR_MAP: null,
  TOGGLE_LAYER_FOR_MAP: null,
  SET_FILTER_PLOT: null,
  LOAD_FILES: null,
  LOAD_FILES_ERR: null,

  // mapState
  UPDATE_MAP: null,
  FIT_BOUNDS: null,
  TOGGLE_PERSPECTIVE: null,
  TOGGLE_SPLIT_MAP: null,
  TOGGLE_FULLSCREEN: null,

  // mapStyle
  MAP_CONFIG_CHANGE: null,
  SET_DEFAULT_MAP_STYLE: null,
  MAP_STYLE_CHANGE: null,
  LOAD_MAP_STYLES: null,
  LOAD_MAP_STYLE_ERR: null,
  INPUT_MAP_STYLE: null,
  LOAD_CUSTOM_MAP_STYLE: null,
  ADD_CUSTOM_MAP_STYLE: null,

  // uiState
  TOGGLE_SIDE_PANEL: null,
  TOGGLE_MODAL: null,
  SHOW_EXPORT_DROPDOWN: null,
  HIDE_EXPORT_DROPDOWN: null,
  OPEN_DELETE_MODAL: null,
  TOGGLE_MAP_CONTROL: null,

  // uiState > export image
  SET_RATIO: null,
  SET_RESOLUTION: null,
  TOGGLE_LEGEND: null,
  START_EXPORTING_IMAGE: null,
  SET_EXPORT_IMAGE_DATA_URI: null,
  CLEANUP_EXPORT_IMAGE: null,

  // uiState > export data
  SET_EXPORT_SELECTED_DATASET: null,
  SET_EXPORT_DATA_TYPE: null,
  SET_EXPORT_FILTERED: null,
  SET_EXPORT_CONFIG: null,
  SET_EXPORT_DATA: null,

  // all
  INIT: null,
  ADD_DATA_TO_MAP: null,
  RECEIVE_MAP_CONFIG: null,
  RESET_MAP_CONFIG: null
});

const addPrefix = actions =>
  Object.keys(actions).reduce(
    (accu, key) => ({
      ...accu,
      [key]: `${ACTION_PREFIX}${actions[key]}`
    }),
    {}
  );

export default addPrefix(ActionTypes);
