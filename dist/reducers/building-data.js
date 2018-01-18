'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _handleActions;

var _reduxActions = require('redux-actions');

var _reactPalm = require('react-palm');

var _actionTypes = require('../constants/action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

var _mapzenUtils = require('../utils/mapzen-utils');

var _buildingDataActions = require('../actions/building-data-actions');

var _tasks = require('../tasks/tasks');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOAD_BUILDING_TILE = _actionTypes2.default.LOAD_BUILDING_TILE,
    LOAD_BUILDING_TILE_START = _actionTypes2.default.LOAD_BUILDING_TILE_START,
    LOAD_BUILDING_TILE_SUCCESS = _actionTypes2.default.LOAD_BUILDING_TILE_SUCCESS,
    LOAD_BUILDING_TILE_ERROR = _actionTypes2.default.LOAD_BUILDING_TILE_ERROR,
    UPDATE_BUILDING_TILES = _actionTypes2.default.UPDATE_BUILDING_TILES,
    INIT = _actionTypes2.default.INIT;

/**
 * Get building polygons
 * @param loaded
 * @returns {Array}
 */

function getBuildingData(loaded) {
  var buildingData = [];

  for (var l = 0; l < loaded.length; l++) {
    var tile = loaded[l];

    if (tile.features.length) {
      // create one layer per tile
      // using id to signify unique layers
      // if layer id is the same and data shallow equals
      // deck.gl will not update that layer
      buildingData.push({
        tileId: tile.x + '-' + tile.y + '-' + tile.z,
        data: tile.features
      });
    }
  }
  return buildingData;
}

var onUpdateBuildingTiles = function onUpdateBuildingTiles(state, _ref) {
  var payload = _ref.payload;
  return (0, _extends3.default)({}, state, payload, {
    buildingData: getBuildingData(payload.loaded),
    loadProgress: state.tiles.size ? payload.loaded.length / state.tiles.size : 1
  });
};

/*
* load building data into view
*/
var onLoadBuildingTile = function onLoadBuildingTile(state, action) {
  var mapState = action.payload;
  var tiles = state.tiles;

  var newTiles = new _mapzenUtils.TilesCollection(mapState);

  if (tiles.size === 0 && newTiles.size === 0 || tiles.contains(newTiles)) {
    // no need to load new tiles
    return state;
  }

  var loaded = [];
  var toLoad = [];
  var cache = state.cache;

  newTiles.tiles.forEach(function (_ref2) {
    var x = _ref2.x,
        y = _ref2.y,
        z = _ref2.z;

    if (cache.has(x, y, z)) {
      var data = cache.get(x, y, z);
      if (data.features) {
        loaded.push(data);
      }
    } else {
      // required tile not in cache, pull from API
      cache = cache.set(x, y, z, { x: x, y: y, z: z });
      toLoad.push({ x: x, y: y, z: z });
    }
  });

  var newState = (0, _extends3.default)({}, state, { cache: cache, tiles: newTiles });

  if (loaded.length) {
    newState = onUpdateBuildingTiles(newState, { payload: { loaded: loaded } });
  }

  return toLoad.length ? (0, _reactPalm.withTask)(newState, toLoad.map(function (_ref3) {
    var x = _ref3.x,
        y = _ref3.y,
        z = _ref3.z;
    return (0, _tasks.LOAD_BUILDING_TILE_TASK)({ x: x, y: y, z: z }).bimap(function (result) {
      return (0, _buildingDataActions.loadBuildingTileSuccess)({ x: x, y: y, z: z, result: result });
    }, function (error) {
      return (0, _buildingDataActions.loadBuildingTileError)(error);
    });
  })) : newState;
};

var onInitiateCache = function onInitiateCache(state) {
  return (0, _extends3.default)({}, state, {
    cache: new _mapzenUtils.TilesCache(),
    tiles: new _mapzenUtils.TilesCollection()
  });
};

var onLoadBuildingTileStart = function onLoadBuildingTileStart(state, _ref4) {
  var _ref4$payload = _ref4.payload,
      x = _ref4$payload.x,
      y = _ref4$payload.y,
      z = _ref4$payload.z;
  return (0, _extends3.default)({}, state, {
    cache: state.cache.set(x, y, z, { x: x, y: y, z: z })
  });
};

var onLoadBuildingTileSuccess = function onLoadBuildingTileSuccess(state, _ref5) {
  var _ref5$payload = _ref5.payload,
      x = _ref5$payload.x,
      y = _ref5$payload.y,
      z = _ref5$payload.z,
      result = _ref5$payload.result;

  if (!result) {
    return state;
  }

  var data = { x: x, y: y, z: z, features: result };

  var newState = state;
  if (state.tiles.contains(x, y, z)) {
    newState = onUpdateBuildingTiles(state, { payload: { loaded: [].concat(state.loaded, [data]) } });
  }

  return (0, _extends3.default)({}, newState, {
    cache: newState.cache.set(x, y, z, data)
  });
};

var onLoadBuildingTileError = function onLoadBuildingTileError(state, _ref6) {
  var error = _ref6.payload;
  return (0, _extends3.default)({}, state, {
    error: error
  });
};

var buildingDataReducer = (0, _reduxActions.handleActions)((_handleActions = {}, _handleActions[LOAD_BUILDING_TILE] = onLoadBuildingTile, _handleActions[LOAD_BUILDING_TILE_START] = onLoadBuildingTileStart, _handleActions[LOAD_BUILDING_TILE_SUCCESS] = onLoadBuildingTileSuccess, _handleActions[LOAD_BUILDING_TILE_ERROR] = onLoadBuildingTileError, _handleActions[UPDATE_BUILDING_TILES] = onUpdateBuildingTiles, _handleActions[INIT] = onInitiateCache, _handleActions), {
  cache: {},
  tiles: {},
  loaded: [],
  error: null,
  buildingData: [],
  loadProgress: 0
});

exports.default = buildingDataReducer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9idWlsZGluZy1kYXRhLmpzIl0sIm5hbWVzIjpbIkxPQURfQlVJTERJTkdfVElMRSIsIkxPQURfQlVJTERJTkdfVElMRV9TVEFSVCIsIkxPQURfQlVJTERJTkdfVElMRV9TVUNDRVNTIiwiTE9BRF9CVUlMRElOR19USUxFX0VSUk9SIiwiVVBEQVRFX0JVSUxESU5HX1RJTEVTIiwiSU5JVCIsImdldEJ1aWxkaW5nRGF0YSIsImxvYWRlZCIsImJ1aWxkaW5nRGF0YSIsImwiLCJsZW5ndGgiLCJ0aWxlIiwiZmVhdHVyZXMiLCJwdXNoIiwidGlsZUlkIiwieCIsInkiLCJ6IiwiZGF0YSIsIm9uVXBkYXRlQnVpbGRpbmdUaWxlcyIsInN0YXRlIiwicGF5bG9hZCIsImxvYWRQcm9ncmVzcyIsInRpbGVzIiwic2l6ZSIsIm9uTG9hZEJ1aWxkaW5nVGlsZSIsImFjdGlvbiIsIm1hcFN0YXRlIiwibmV3VGlsZXMiLCJjb250YWlucyIsInRvTG9hZCIsImNhY2hlIiwiZm9yRWFjaCIsImhhcyIsImdldCIsInNldCIsIm5ld1N0YXRlIiwibWFwIiwiYmltYXAiLCJyZXN1bHQiLCJlcnJvciIsIm9uSW5pdGlhdGVDYWNoZSIsIm9uTG9hZEJ1aWxkaW5nVGlsZVN0YXJ0Iiwib25Mb2FkQnVpbGRpbmdUaWxlU3VjY2VzcyIsIm9uTG9hZEJ1aWxkaW5nVGlsZUVycm9yIiwiYnVpbGRpbmdEYXRhUmVkdWNlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7QUFDQTs7QUFJQTs7OztJQUdFQSxrQix5QkFBQUEsa0I7SUFDQUMsd0IseUJBQUFBLHdCO0lBQ0FDLDBCLHlCQUFBQSwwQjtJQUNBQyx3Qix5QkFBQUEsd0I7SUFDQUMscUIseUJBQUFBLHFCO0lBQ0FDLEkseUJBQUFBLEk7O0FBR0Y7Ozs7OztBQUtBLFNBQVNDLGVBQVQsQ0FBeUJDLE1BQXpCLEVBQWlDO0FBQy9CLE1BQU1DLGVBQWUsRUFB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bmctZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aGFuZGxlQWN0aW9uc30gZnJvbSAncmVkdXgtYWN0aW9ucyc7XG5pbXBvcnQge3dpdGhUYXNrfSBmcm9tICdyZWFjdC1wYWxtJ1xuXG5pbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnLi4vY29uc3RhbnRzL2FjdGlvbi10eXBlcyc7XG5pbXBvcnQge1RpbGVzQ2FjaGUsIFRpbGVzQ29sbGVjdGlvbn0gZnJvbSAnLi4vdXRpbHMvbWFwemVuLXV0aWxzJztcbmltcG9ydCB7XG4gIGxvYWRCdWlsZGluZ1RpbGVFcnJvcixcbiAgbG9hZEJ1aWxkaW5nVGlsZVN1Y2Nlc3Ncbn0gZnJvbSBcIi4uL2FjdGlvbnMvYnVpbGRpbmctZGF0YS1hY3Rpb25zXCI7XG5pbXBvcnQge0xPQURfQlVJTERJTkdfVElMRV9UQVNLfSBmcm9tICcuLi90YXNrcy90YXNrcyc7XG5cbmNvbnN0IHtcbiAgTE9BRF9CVUlMRElOR19USUxFLFxuICBMT0FEX0JVSUxESU5HX1RJTEVfU1RBUlQsXG4gIExPQURfQlVJTERJTkdfVElMRV9TVUNDRVNTLFxuICBMT0FEX0JVSUxESU5HX1RJTEVfRVJST1IsXG4gIFVQREFURV9CVUlMRElOR19USUxFUyxcbiAgSU5JVFxufSA9IEFjdGlvblR5cGVzO1xuXG4vKipcbiAqIEdldCBidWlsZGluZyBwb2x5Z29uc1xuICogQHBhcmFtIGxvYWRlZFxuICogQHJldHVybnMge0FycmF5fVxuICovXG5mdW5jdGlvbiBnZXRCdWlsZGluZ0RhdGEobG9hZGVkKSB7XG4gIGNvbnN0IGJ1aWxkaW5nRGF0YSA9IFtdO1xuXG4gIGZvciAobGV0IGwgPSAwOyBsIDwgbG9hZGVkLmxlbmd0aDsgbCsrKSB7XG4gICAgY29uc3QgdGlsZSA9IGxvYWRlZFtsXTtcblxuICAgIGlmICh0aWxlLmZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgLy8gY3JlYXRlIG9uZSBsYXllciBwZXIgdGlsZVxuICAgICAgLy8gdXNpbmcgaWQgdG8gc2lnbmlmeSB1bmlxdWUgbGF5ZXJzXG4gICAgICAvLyBpZiBsYXllciBpZCBpcyB0aGUgc2FtZSBhbmQgZGF0YSBzaGFsbG93IGVxdWFsc1xuICAgICAgLy8gZGVjay5nbCB3aWxsIG5vdCB1cGRhdGUgdGhhdCBsYXllclxuICAgICAgYnVpbGRpbmdEYXRhLnB1c2goe1xuICAgICAgICB0aWxlSWQ6IGAke3RpbGUueH0tJHt0aWxlLnl9LSR7dGlsZS56fWAsXG4gICAgICAgIGRhdGE6IHRpbGUuZmVhdHVyZXNcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYnVpbGRpbmdEYXRhO1xufVxuXG5jb25zdCBvblVwZGF0ZUJ1aWxkaW5nVGlsZXMgPSAoc3RhdGUsIHtwYXlsb2FkfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIC4uLnBheWxvYWQsXG4gIGJ1aWxkaW5nRGF0YTogZ2V0QnVpbGRpbmdEYXRhKHBheWxvYWQubG9hZGVkKSxcbiAgbG9hZFByb2dyZXNzOiBzdGF0ZS50aWxlcy5zaXplID8gcGF5bG9hZC5sb2FkZWQubGVuZ3RoIC8gc3RhdGUudGlsZXMuc2l6ZSA6IDFcbn0pO1xuXG4vKlxuKiBsb2FkIGJ1aWxkaW5nIGRhdGEgaW50byB2aWV3XG4qL1xuY29uc3Qgb25Mb2FkQnVpbGRpbmdUaWxlID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgbWFwU3RhdGUgPSBhY3Rpb24ucGF5bG9hZDtcbiAgY29uc3Qge3RpbGVzfSA9IHN0YXRlO1xuICBjb25zdCBuZXdUaWxlcyA9IG5ldyBUaWxlc0NvbGxlY3Rpb24obWFwU3RhdGUpO1xuXG4gIGlmICgodGlsZXMuc2l6ZSA9PT0gMCAmJiBuZXdUaWxlcy5zaXplID09PSAwKSB8fCB0aWxlcy5jb250YWlucyhuZXdUaWxlcykpIHtcbiAgICAvLyBubyBuZWVkIHRvIGxvYWQgbmV3IHRpbGVzXG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3QgbG9hZGVkID0gW107XG4gIGNvbnN0IHRvTG9hZCA9IFtdO1xuICBsZXQgY2FjaGUgPSBzdGF0ZS5jYWNoZTtcblxuICBuZXdUaWxlcy50aWxlcy5mb3JFYWNoKCh7eCwgeSwgen0pID0+IHtcbiAgICBpZiAoY2FjaGUuaGFzKHgsIHksIHopKSB7XG4gICAgICBjb25zdCBkYXRhID0gY2FjaGUuZ2V0KHgsIHksIHopO1xuICAgICAgaWYgKGRhdGEuZmVhdHVyZXMpIHtcbiAgICAgICAgbG9hZGVkLnB1c2goZGF0YSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJlcXVpcmVkIHRpbGUgbm90IGluIGNhY2hlLCBwdWxsIGZyb20gQVBJXG4gICAgICBjYWNoZSA9IGNhY2hlLnNldCh4LCB5LCB6LCB7eCwgeSwgen0pO1xuICAgICAgdG9Mb2FkLnB1c2goe3gsIHksIHp9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGxldCBuZXdTdGF0ZSA9IHsuLi5zdGF0ZSwgY2FjaGUsIHRpbGVzOiBuZXdUaWxlc307XG5cbiAgaWYgKGxvYWRlZC5sZW5ndGgpIHtcbiAgICBuZXdTdGF0ZSA9IG9uVXBkYXRlQnVpbGRpbmdUaWxlcyhuZXdTdGF0ZSwge3BheWxvYWQ6IHtsb2FkZWR9fSk7XG4gIH1cblxuICByZXR1cm4gdG9Mb2FkLmxlbmd0aCA/IHdpdGhUYXNrKFxuICAgIG5ld1N0YXRlLFxuICAgIHRvTG9hZC5tYXAoKHt4LCB5LCB6fSkgPT5cbiAgICAgIExPQURfQlVJTERJTkdfVElMRV9UQVNLKHt4LCB5LCB6fSkuYmltYXAoXG4gICAgICAgIHJlc3VsdCA9PiBsb2FkQnVpbGRpbmdUaWxlU3VjY2Vzcyh7eCwgeSwgeiwgcmVzdWx0fSksXG4gICAgICAgIGVycm9yID0+IGxvYWRCdWlsZGluZ1RpbGVFcnJvcihlcnJvcilcbiAgICAgIClcbiAgICApXG4gICkgOiBuZXdTdGF0ZTtcbn07XG5cbmNvbnN0IG9uSW5pdGlhdGVDYWNoZSA9IHN0YXRlID0+ICh7XG4gIC4uLnN0YXRlLFxuICBjYWNoZTogbmV3IFRpbGVzQ2FjaGUoKSxcbiAgdGlsZXM6IG5ldyBUaWxlc0NvbGxlY3Rpb24oKVxufSk7XG5cbmNvbnN0IG9uTG9hZEJ1aWxkaW5nVGlsZVN0YXJ0ID0gKHN0YXRlLCB7cGF5bG9hZDoge3gsIHksIHp9fSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGNhY2hlOiBzdGF0ZS5jYWNoZS5zZXQoeCwgeSwgeiwge3gsIHksIHp9KVxufSk7XG5cbmNvbnN0IG9uTG9hZEJ1aWxkaW5nVGlsZVN1Y2Nlc3MgPSAoc3RhdGUsIHtwYXlsb2FkOiB7eCwgeSwgeiwgcmVzdWx0fX0pID0+IHtcbiAgaWYgKCFyZXN1bHQpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBkYXRhID0ge3gsIHksIHosIGZlYXR1cmVzOiByZXN1bHR9O1xuXG4gIGxldCBuZXdTdGF0ZSA9IHN0YXRlO1xuICBpZiAoc3RhdGUudGlsZXMuY29udGFpbnMoeCwgeSwgeikpIHtcbiAgICBuZXdTdGF0ZSA9IG9uVXBkYXRlQnVpbGRpbmdUaWxlcyhcbiAgICAgIHN0YXRlLFxuICAgICAge3BheWxvYWQ6IHtsb2FkZWQ6IFsuLi5zdGF0ZS5sb2FkZWQsIGRhdGFdfX0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5uZXdTdGF0ZSxcbiAgICBjYWNoZTogbmV3U3RhdGUuY2FjaGUuc2V0KHgsIHksIHosIGRhdGEpXG4gIH07XG59O1xuXG5jb25zdCBvbkxvYWRCdWlsZGluZ1RpbGVFcnJvciA9IChzdGF0ZSwge3BheWxvYWQ6IGVycm9yfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGVycm9yXG59KTtcblxuY29uc3QgYnVpbGRpbmdEYXRhUmVkdWNlciA9IGhhbmRsZUFjdGlvbnMoe1xuICBbTE9BRF9CVUlMRElOR19USUxFXTogb25Mb2FkQnVpbGRpbmdUaWxlLFxuICBbTE9BRF9CVUlMRElOR19USUxFX1NUQVJUXTogb25Mb2FkQnVpbGRpbmdUaWxlU3RhcnQsXG4gIFtMT0FEX0JVSUxESU5HX1RJTEVfU1VDQ0VTU106IG9uTG9hZEJ1aWxkaW5nVGlsZVN1Y2Nlc3MsXG4gIFtMT0FEX0JVSUxESU5HX1RJTEVfRVJST1JdOiBvbkxvYWRCdWlsZGluZ1RpbGVFcnJvcixcbiAgW1VQREFURV9CVUlMRElOR19USUxFU106IG9uVXBkYXRlQnVpbGRpbmdUaWxlcyxcbiAgW0lOSVRdOiBvbkluaXRpYXRlQ2FjaGVcbn0sIHtcbiAgY2FjaGU6IHt9LFxuICB0aWxlczoge30sXG4gIGxvYWRlZDogW10sXG4gIGVycm9yOiBudWxsLFxuICBidWlsZGluZ0RhdGE6IFtdLFxuICBsb2FkUHJvZ3Jlc3M6IDBcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBidWlsZGluZ0RhdGFSZWR1Y2VyO1xuIl19