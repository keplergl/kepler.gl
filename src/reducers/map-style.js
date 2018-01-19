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
