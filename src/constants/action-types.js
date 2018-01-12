import keyMirror from 'keymirror';
import {ACTION_PREFIX} from './default-settings';

const ActionTypes = keyMirror({

  // visState
  ADD_DATA: null,
  ADD_FILTER: null,
  ADD_LAYER: null,
  INTERACTION_CONFIG_CHANGE: null,
  LAYER_CONFIG_CHANGE: null,
  LAYER_VISUAL_CHANNEL_CONFIG_CHANGE: null,
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
  MAP_BUILDING_CHANGE: null,

  // uiState
  TOGGLE_SIDE_PANEL: null,
  TOGGLE_MODAL: null,
  OPEN_DELETE_MODAL: null,

  // buildingData
  UPDATE_BUILDING_TILES: null,
  LOAD_BUILDING_TILE: null,
  LOAD_BUILDING_TILE_START: null,
  LOAD_BUILDING_TILE_SUCCESS: null,
  LOAD_BUILDING_TILE_ERROR: null,
  INITIATE_BUILDING_DATA: null,

  // all
  INIT: null,
  RECEIVE_MAP_CONFIG: null,
  RESET_MAP_CONFIG: null
});

const addPrefix = actions =>
  Object.keys(actions).reduce((accu, key) => ({
    ...accu,
    [key]: `${ACTION_PREFIX}${actions[key]}`
  }), {});

export default addPrefix(ActionTypes);
