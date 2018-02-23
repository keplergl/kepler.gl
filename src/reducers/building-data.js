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
import {withTask} from 'react-palm';

import ActionTypes from '../constants/action-types';
import {TilesCache, TilesCollection} from '../utils/mapzen-utils';
import {
  loadBuildingTileError,
  loadBuildingTileSuccess
} from '../actions/building-data-actions';
import {LOAD_BUILDING_TILE_TASK} from '../tasks/tasks';

const {
  LOAD_BUILDING_TILE,
  LOAD_BUILDING_TILE_START,
  LOAD_BUILDING_TILE_SUCCESS,
  LOAD_BUILDING_TILE_ERROR,
  UPDATE_BUILDING_TILES,
  INIT
} = ActionTypes;

/**
 * Get building polygons
 * @param loaded
 * @returns {Array}
 */
function getBuildingData(loaded) {
  const buildingData = [];

  for (let l = 0; l < loaded.length; l++) {
    const tile = loaded[l];

    if (tile.features.length) {
      // create one layer per tile
      // using id to signify unique layers
      // if layer id is the same and data shallow equals
      // deck.gl will not update that layer
      buildingData.push({
        tileId: `${tile.x}-${tile.y}-${tile.z}`,
        data: tile.features
      });
    }
  }
  return buildingData;
}

const onUpdateBuildingTiles = (state, {payload}) => ({
  ...state,
  ...payload,
  buildingData: getBuildingData(payload.loaded),
  loadProgress: state.tiles.size ? payload.loaded.length / state.tiles.size : 1
});

/*
* load building data into view
*/
const onLoadBuildingTile = (state, action) => {
  const mapState = action.payload;
  const {tiles} = state;
  const newTiles = new TilesCollection(mapState);

  if ((tiles.size === 0 && newTiles.size === 0) || tiles.contains(newTiles)) {
    // no need to load new tiles
    return state;
  }

  const loaded = [];
  const toLoad = [];
  let cache = state.cache;

  newTiles.tiles.forEach(({x, y, z}) => {
    if (cache.has(x, y, z)) {
      const data = cache.get(x, y, z);
      if (data.features) {
        loaded.push(data);
      }
    } else {
      // required tile not in cache, pull from API
      cache = cache.set(x, y, z, {x, y, z});
      toLoad.push({x, y, z});
    }
  });

  let newState = {...state, cache, tiles: newTiles};

  if (loaded.length) {
    newState = onUpdateBuildingTiles(newState, {payload: {loaded}});
  }

  return toLoad.length
    ? withTask(
        newState,
        toLoad.map(({x, y, z}) =>
          LOAD_BUILDING_TILE_TASK({x, y, z}).bimap(
            result => loadBuildingTileSuccess({x, y, z, result}),
            error => loadBuildingTileError(error)
          )
        )
      )
    : newState;
};

const onInitiateCache = state => ({
  ...state,
  cache: new TilesCache(),
  tiles: new TilesCollection()
});

const onLoadBuildingTileStart = (state, {payload: {x, y, z}}) => ({
  ...state,
  cache: state.cache.set(x, y, z, {x, y, z})
});

const onLoadBuildingTileSuccess = (state, {payload: {x, y, z, result}}) => {
  if (!result) {
    return state;
  }

  const data = {x, y, z, features: result};

  let newState = state;
  if (state.tiles.contains(x, y, z)) {
    newState = onUpdateBuildingTiles(state, {
      payload: {loaded: [...state.loaded, data]}
    });
  }

  return {
    ...newState,
    cache: newState.cache.set(x, y, z, data)
  };
};

const onLoadBuildingTileError = (state, {payload: error}) => ({
  ...state,
  error
});

const buildingDataReducer = handleActions(
  {
    [LOAD_BUILDING_TILE]: onLoadBuildingTile,
    [LOAD_BUILDING_TILE_START]: onLoadBuildingTileStart,
    [LOAD_BUILDING_TILE_SUCCESS]: onLoadBuildingTileSuccess,
    [LOAD_BUILDING_TILE_ERROR]: onLoadBuildingTileError,
    [UPDATE_BUILDING_TILES]: onUpdateBuildingTiles,
    [INIT]: onInitiateCache
  },
  {
    cache: {},
    tiles: {},
    loaded: [],
    error: null,
    buildingData: [],
    loadProgress: 0
  }
);

export default buildingDataReducer;
