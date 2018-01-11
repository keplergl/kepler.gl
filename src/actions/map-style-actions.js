import {createAction} from 'redux-actions';
import ActionTypes from '../constants/action-types';

const {
  MAP_CONFIG_CHANGE,
  MAP_STYLE_CHANGE,
  LOAD_MAP_STYLES,
  LOAD_MAP_STYLE_ERR,
  MAP_BUILDING_CHANGE
} = ActionTypes;

// second argument of createAction is expected to be payloadCreator or undefined
const [
  mapConfigChange,
  loadMapStyles,
  loadMapStyleErr,
  mapStyleChange,
  mapBuildingChange
] = [
  MAP_CONFIG_CHANGE,
  LOAD_MAP_STYLES,
  LOAD_MAP_STYLE_ERR,
  MAP_STYLE_CHANGE,
  MAP_BUILDING_CHANGE
].map(a => createAction(a));

export {
  mapConfigChange,
  mapStyleChange,
  loadMapStyles,
  loadMapStyleErr,
  mapBuildingChange
};
