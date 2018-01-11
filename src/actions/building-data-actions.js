import {createAction} from 'redux-actions';
import ActionTypes from '../constants/action-types';

export const [
  loadBuildingTile,
  updateBuildingTiles,
  loadBuildingTileStart,
  loadBuildingTileSuccess,
  loadBuildingTileError
] = [
  ActionTypes.LOAD_BUILDING_TILE,
  ActionTypes.UPDATE_BUILDING_TILES,
  ActionTypes.LOAD_BUILDING_TILE_START,
  ActionTypes.LOAD_BUILDING_TILE_SUCCESS,
  ActionTypes.LOAD_BUILDING_TILE_ERROR
].map(action => createAction(action));
