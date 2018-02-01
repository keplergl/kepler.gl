import ActionTypes from '../constants/action-types';
import {handleActions} from 'redux-actions';

// updater functions
import {
  INITIAL_VIS_STATE,
  addFilterUpdater,
  addLayerUpdater,
  enlargeFilterUpdater,
  layerClickUpdater,
  layerHoverUpdater,
  mapClickUpdater,
  toggleFilterAnimationUpdater,
  updateAnimationSpeedUpdater,
  receiveMapConfigUpdater,
  resetMapConfigUpdater,
  loadFilesUpdater,
  loadFilesErrUpdater,
  updateVisDataUpdater,
  removeDatasetUpdater,
  removeFilterUpdater,
  removeLayerUpdater,
  reorderLayerUpdater,
  showDatasetTableUpdater,
  setFilterUpdater,
  setFilterPlotUpdater,
  interactionConfigChangeUpdater,
  updateLayerBlendingUpdater,
  layerConfigChangeUpdater,
  layerTypeChangeUpdater,
  toggleSplitMapUpdater,
  setVisibleLayersForMapUpdater,
  toggleLayerForMapUpdater,
  layerVisConfigChangeUpdater,
  layerVisualChannelChangeUpdater
} from './vis-state-updaters';

// construct vis-state reducer
const rootReducer = handleActions(
  {
    [ActionTypes.ADD_FILTER]: addFilterUpdater,

    [ActionTypes.ADD_LAYER]: addLayerUpdater,

    [ActionTypes.ENLARGE_FILTER]: enlargeFilterUpdater,

    [ActionTypes.INTERACTION_CONFIG_CHANGE]: interactionConfigChangeUpdater,

    [ActionTypes.LAYER_CLICK]: layerClickUpdater,

    [ActionTypes.LAYER_CONFIG_CHANGE]: layerConfigChangeUpdater,

    [ActionTypes.LAYER_HOVER]: layerHoverUpdater,

    [ActionTypes.LAYER_TYPE_CHANGE]: layerTypeChangeUpdater,

    [ActionTypes.LAYER_VIS_CONFIG_CHANGE]: layerVisConfigChangeUpdater,

    [ActionTypes.LAYER_VISUAL_CHANNEL_CHANGE]: layerVisualChannelChangeUpdater,

    [ActionTypes.LOAD_FILES]: loadFilesUpdater,

    [ActionTypes.LOAD_FILES_ERR]: loadFilesErrUpdater,

    [ActionTypes.MAP_CLICK]: mapClickUpdater,

    [ActionTypes.RECEIVE_MAP_CONFIG]: receiveMapConfigUpdater,

    [ActionTypes.REMOVE_DATASET]: removeDatasetUpdater,

    [ActionTypes.REMOVE_FILTER]: removeFilterUpdater,

    [ActionTypes.REMOVE_LAYER]: removeLayerUpdater,

    [ActionTypes.REORDER_LAYER]: reorderLayerUpdater,

    [ActionTypes.RESET_MAP_CONFIG]: resetMapConfigUpdater,

    [ActionTypes.SET_FILTER]: setFilterUpdater,

    [ActionTypes.SET_FILTER_PLOT]: setFilterPlotUpdater,

    [ActionTypes.SET_VISIBLE_LAYERS_FOR_MAP]: setVisibleLayersForMapUpdater,

    [ActionTypes.SHOW_DATASET_TABLE]: showDatasetTableUpdater,

    [ActionTypes.TOGGLE_FILTER_ANIMATION]: toggleFilterAnimationUpdater,
    [ActionTypes.UPDATE_FILTER_ANIMATION_SPEED]: updateAnimationSpeedUpdater,

    [ActionTypes.TOGGLE_LAYER_FOR_MAP]: toggleLayerForMapUpdater,

    [ActionTypes.TOGGLE_SPLIT_MAP]: toggleSplitMapUpdater,

    [ActionTypes.UPDATE_LAYER_BLENDING]: updateLayerBlendingUpdater,

    [ActionTypes.UPDATE_VIS_DATA]: updateVisDataUpdater
  },
  INITIAL_VIS_STATE
);

export default rootReducer;
