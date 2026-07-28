// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ActionTypes} from '@kepler.gl/actions';
import * as combinedUpdaters from './combined-updaters';

/**
 * Important: Do not rename `actionHandler` or the assignment pattern of property value.
 * It is used to generate documentation
 */
const actionHandler = {
  [ActionTypes.ADD_DATA_TO_MAP]: combinedUpdaters.addDataToMapUpdater,
  [ActionTypes.MAP_STYLE_CHANGE]: combinedUpdaters.combinedMapStyleChangeUpdater,
  [ActionTypes.SET_MAP_VIEW_MODE]: combinedUpdaters.combinedSetMapViewModeUpdater,
  [ActionTypes.LAYER_TYPE_CHANGE]: combinedUpdaters.combinedLayerTypeChangeUpdater,
  [ActionTypes.LOAD_FILES_SUCCESS]: combinedUpdaters.loadFilesSuccessUpdater,
  [ActionTypes.TOGGLE_SPLIT_MAP]: combinedUpdaters.toggleSplitMapUpdater,
  [ActionTypes.SET_MAP_SPLIT_MODE]: combinedUpdaters.setMapSplitModeUpdater,
  [ActionTypes.REPLACE_DATA_IN_MAP]: combinedUpdaters.replaceDataInMapUpdater
};

export default actionHandler;
