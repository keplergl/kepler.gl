import ActionTypes from '../constants/action-types';
import {handleActions} from 'redux-actions';

// updater functions
import {
  INITIAL_VIS_STATE,
  addFilter,
  addLayer,
  enlargeFilter,
  handleLayerClick,
  handleLayerHover,
  handleMapClick,
  onToggleFilterAnimation,
  handleReceiveMapConfig,
  handleResetConfig,
  onFileUpload,
  onFileUploadError,
  receiveVisData,
  removeDataset,
  removeFilter,
  removeLayer,
  reorderLayer,
  showDatasetTable,
  updateFilter,
  updateFilterPlot,
  updateInteractionConfig,
  updateLayerBlending,
  updateLayerConfig,
  updateLayerType,
  handleSplitToggle,
  setVisibleLayersForMap,
  toggleLayerForMap,
  updateLayerVisConfig,
  updateLayerVisualChannelConfig
} from './vis-state-updaters';

// construct vis-state reducer
const rootReducer = handleActions({
  [ActionTypes.ADD_FILTER]: addFilter,

  [ActionTypes.ADD_LAYER]: addLayer,

  [ActionTypes.ENLARGE_FILTER]: enlargeFilter,

  [ActionTypes.INTERACTION_CONFIG_CHANGE]: updateInteractionConfig,

  [ActionTypes.LAYER_CLICK]: handleLayerClick,

  [ActionTypes.LAYER_CONFIG_CHANGE]: updateLayerConfig,

  [ActionTypes.LAYER_HOVER]: handleLayerHover,

  [ActionTypes.LAYER_TYPE_CHANGE]: updateLayerType,

  [ActionTypes.LAYER_VIS_CONFIG_CHANGE]: updateLayerVisConfig,

  [ActionTypes.LAYER_VISUAL_CHANNEL_CONFIG_CHANGE]: updateLayerVisualChannelConfig,

  [ActionTypes.LOAD_FILES]: onFileUpload,

  [ActionTypes.LOAD_FILES_ERR]: onFileUploadError,

  [ActionTypes.MAP_CLICK]: handleMapClick,

  [ActionTypes.RECEIVE_MAP_CONFIG]: handleReceiveMapConfig,

  [ActionTypes.REMOVE_DATASET]: removeDataset,

  [ActionTypes.REMOVE_FILTER]: removeFilter,

  [ActionTypes.REMOVE_LAYER]: removeLayer,

  [ActionTypes.REORDER_LAYER]: reorderLayer,

  [ActionTypes.RESET_MAP_CONFIG]: handleResetConfig,

  [ActionTypes.SET_FILTER]: updateFilter,

  [ActionTypes.SET_FILTER_PLOT]: updateFilterPlot,

  [ActionTypes.SET_VISIBLE_LAYERS_FOR_MAP]: setVisibleLayersForMap,

  [ActionTypes.SHOW_DATASET_TABLE]: showDatasetTable,

  [ActionTypes.TOGGLE_FILTER_ANIMATION]: onToggleFilterAnimation,

  [ActionTypes.TOGGLE_LAYER_FOR_MAP]: toggleLayerForMap,

  [ActionTypes.TOGGLE_SPLIT_MAP]: handleSplitToggle,

  [ActionTypes.UPDATE_LAYER_BLENDING]: updateLayerBlending,

  [ActionTypes.UPDATE_VIS_DATA]: receiveVisData

}, INITIAL_VIS_STATE);

export default rootReducer;
