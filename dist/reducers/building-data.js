'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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
    newState = onUpdateBuildingTiles(state, {
      payload: { loaded: [].concat((0, _toConsumableArray3.default)(state.loaded), [data]) }
    });
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

var buildingDataReducer = (0, _reduxActions.handleActions)((_handleActions = {}, (0, _defineProperty3.default)(_handleActions, LOAD_BUILDING_TILE, onLoadBuildingTile), (0, _defineProperty3.default)(_handleActions, LOAD_BUILDING_TILE_START, onLoadBuildingTileStart), (0, _defineProperty3.default)(_handleActions, LOAD_BUILDING_TILE_SUCCESS, onLoadBuildingTileSuccess), (0, _defineProperty3.default)(_handleActions, LOAD_BUILDING_TILE_ERROR, onLoadBuildingTileError), (0, _defineProperty3.default)(_handleActions, UPDATE_BUILDING_TILES, onUpdateBuildingTiles), (0, _defineProperty3.default)(_handleActions, INIT, onInitiateCache), _handleActions), {
  cache: {},
  tiles: {},
  loaded: [],
  error: null,
  buildingData: [],
  loadProgress: 0
});

exports.default = buildingDataReducer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9idWlsZGluZy1kYXRhLmpzIl0sIm5hbWVzIjpbIkxPQURfQlVJTERJTkdfVElMRSIsIkxPQURfQlVJTERJTkdfVElMRV9TVEFSVCIsIkxPQURfQlVJTERJTkdfVElMRV9TVUNDRVNTIiwiTE9BRF9CVUlMRElOR19USUxFX0VSUk9SIiwiVVBEQVRFX0JVSUxESU5HX1RJTEVTIiwiSU5JVCIsImdldEJ1aWxkaW5nRGF0YSIsImxvYWRlZCIsImJ1aWxkaW5nRGF0YSIsImwiLCJsZW5ndGgiLCJ0aWxlIiwiZmVhdHVyZXMiLCJwdXNoIiwidGlsZUlkIiwieCIsInkiLCJ6IiwiZGF0YSIsIm9uVXBkYXRlQnVpbGRpbmdUaWxlcyIsInN0YXRlIiwicGF5bG9hZCIsImxvYWRQcm9ncmVzcyIsInRpbGVzIiwic2l6ZSIsIm9uTG9hZEJ1aWxkaW5nVGlsZSIsImFjdGlvbiIsIm1hcFN0YXRlIiwibmV3VGlsZXMiLCJjb250YWlucyIsInRvTG9hZCIsImNhY2hlIiwiZm9yRWFjaCIsImhhcyIsImdldCIsInNldCIsIm5ld1N0YXRlIiwibWFwIiwiYmltYXAiLCJyZXN1bHQiLCJlcnJvciIsIm9uSW5pdGlhdGVDYWNoZSIsIm9uTG9hZEJ1aWxkaW5nVGlsZVN0YXJ0Iiwib25Mb2FkQnVpbGRpbmdUaWxlU3VjY2VzcyIsIm9uTG9hZEJ1aWxkaW5nVGlsZUVycm9yIiwiYnVpbGRpbmdEYXRhUmVkdWNlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7OztBQUNBOztBQUNBOztBQUlBOzs7O0lBR0VBLGtCLHlCQUFBQSxrQjtJQUNBQyx3Qix5QkFBQUEsd0I7SUFDQUMsMEIseUJBQUFBLDBCO0lBQ0FDLHdCLHlCQUFBQSx3QjtJQUNBQyxxQix5QkFBQUEscUI7SUFDQUMsSSx5QkFBQUEsSTs7QUFHRjs7Ozs7O0FBS0EsU0FBU0MsZUFBVCxDQUF5QkMsTUFBekIsRUFBaUM7QUFDL0IsTUFBTUMs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ZSI6ImJ1aWxkaW5nLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2hhbmRsZUFjdGlvbnN9IGZyb20gJ3JlZHV4LWFjdGlvbnMnO1xuaW1wb3J0IHt3aXRoVGFza30gZnJvbSAncmVhY3QtcGFsbSc7XG5cbmltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICcuLi9jb25zdGFudHMvYWN0aW9uLXR5cGVzJztcbmltcG9ydCB7VGlsZXNDYWNoZSwgVGlsZXNDb2xsZWN0aW9ufSBmcm9tICcuLi91dGlscy9tYXB6ZW4tdXRpbHMnO1xuaW1wb3J0IHtcbiAgbG9hZEJ1aWxkaW5nVGlsZUVycm9yLFxuICBsb2FkQnVpbGRpbmdUaWxlU3VjY2Vzc1xufSBmcm9tICcuLi9hY3Rpb25zL2J1aWxkaW5nLWRhdGEtYWN0aW9ucyc7XG5pbXBvcnQge0xPQURfQlVJTERJTkdfVElMRV9UQVNLfSBmcm9tICcuLi90YXNrcy90YXNrcyc7XG5cbmNvbnN0IHtcbiAgTE9BRF9CVUlMRElOR19USUxFLFxuICBMT0FEX0JVSUxESU5HX1RJTEVfU1RBUlQsXG4gIExPQURfQlVJTERJTkdfVElMRV9TVUNDRVNTLFxuICBMT0FEX0JVSUxESU5HX1RJTEVfRVJST1IsXG4gIFVQREFURV9CVUlMRElOR19USUxFUyxcbiAgSU5JVFxufSA9IEFjdGlvblR5cGVzO1xuXG4vKipcbiAqIEdldCBidWlsZGluZyBwb2x5Z29uc1xuICogQHBhcmFtIGxvYWRlZFxuICogQHJldHVybnMge0FycmF5fVxuICovXG5mdW5jdGlvbiBnZXRCdWlsZGluZ0RhdGEobG9hZGVkKSB7XG4gIGNvbnN0IGJ1aWxkaW5nRGF0YSA9IFtdO1xuXG4gIGZvciAobGV0IGwgPSAwOyBsIDwgbG9hZGVkLmxlbmd0aDsgbCsrKSB7XG4gICAgY29uc3QgdGlsZSA9IGxvYWRlZFtsXTtcblxuICAgIGlmICh0aWxlLmZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgLy8gY3JlYXRlIG9uZSBsYXllciBwZXIgdGlsZVxuICAgICAgLy8gdXNpbmcgaWQgdG8gc2lnbmlmeSB1bmlxdWUgbGF5ZXJzXG4gICAgICAvLyBpZiBsYXllciBpZCBpcyB0aGUgc2FtZSBhbmQgZGF0YSBzaGFsbG93IGVxdWFsc1xuICAgICAgLy8gZGVjay5nbCB3aWxsIG5vdCB1cGRhdGUgdGhhdCBsYXllclxuICAgICAgYnVpbGRpbmdEYXRhLnB1c2goe1xuICAgICAgICB0aWxlSWQ6IGAke3RpbGUueH0tJHt0aWxlLnl9LSR7dGlsZS56fWAsXG4gICAgICAgIGRhdGE6IHRpbGUuZmVhdHVyZXNcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYnVpbGRpbmdEYXRhO1xufVxuXG5jb25zdCBvblVwZGF0ZUJ1aWxkaW5nVGlsZXMgPSAoc3RhdGUsIHtwYXlsb2FkfSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIC4uLnBheWxvYWQsXG4gIGJ1aWxkaW5nRGF0YTogZ2V0QnVpbGRpbmdEYXRhKHBheWxvYWQubG9hZGVkKSxcbiAgbG9hZFByb2dyZXNzOiBzdGF0ZS50aWxlcy5zaXplID8gcGF5bG9hZC5sb2FkZWQubGVuZ3RoIC8gc3RhdGUudGlsZXMuc2l6ZSA6IDFcbn0pO1xuXG4vKlxuKiBsb2FkIGJ1aWxkaW5nIGRhdGEgaW50byB2aWV3XG4qL1xuY29uc3Qgb25Mb2FkQnVpbGRpbmdUaWxlID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3QgbWFwU3RhdGUgPSBhY3Rpb24ucGF5bG9hZDtcbiAgY29uc3Qge3RpbGVzfSA9IHN0YXRlO1xuICBjb25zdCBuZXdUaWxlcyA9IG5ldyBUaWxlc0NvbGxlY3Rpb24obWFwU3RhdGUpO1xuXG4gIGlmICgodGlsZXMuc2l6ZSA9PT0gMCAmJiBuZXdUaWxlcy5zaXplID09PSAwKSB8fCB0aWxlcy5jb250YWlucyhuZXdUaWxlcykpIHtcbiAgICAvLyBubyBuZWVkIHRvIGxvYWQgbmV3IHRpbGVzXG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3QgbG9hZGVkID0gW107XG4gIGNvbnN0IHRvTG9hZCA9IFtdO1xuICBsZXQgY2FjaGUgPSBzdGF0ZS5jYWNoZTtcblxuICBuZXdUaWxlcy50aWxlcy5mb3JFYWNoKCh7eCwgeSwgen0pID0+IHtcbiAgICBpZiAoY2FjaGUuaGFzKHgsIHksIHopKSB7XG4gICAgICBjb25zdCBkYXRhID0gY2FjaGUuZ2V0KHgsIHksIHopO1xuICAgICAgaWYgKGRhdGEuZmVhdHVyZXMpIHtcbiAgICAgICAgbG9hZGVkLnB1c2goZGF0YSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJlcXVpcmVkIHRpbGUgbm90IGluIGNhY2hlLCBwdWxsIGZyb20gQVBJXG4gICAgICBjYWNoZSA9IGNhY2hlLnNldCh4LCB5LCB6LCB7eCwgeSwgen0pO1xuICAgICAgdG9Mb2FkLnB1c2goe3gsIHksIHp9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGxldCBuZXdTdGF0ZSA9IHsuLi5zdGF0ZSwgY2FjaGUsIHRpbGVzOiBuZXdUaWxlc307XG5cbiAgaWYgKGxvYWRlZC5sZW5ndGgpIHtcbiAgICBuZXdTdGF0ZSA9IG9uVXBkYXRlQnVpbGRpbmdUaWxlcyhuZXdTdGF0ZSwge3BheWxvYWQ6IHtsb2FkZWR9fSk7XG4gIH1cblxuICByZXR1cm4gdG9Mb2FkLmxlbmd0aFxuICAgID8gd2l0aFRhc2soXG4gICAgICAgIG5ld1N0YXRlLFxuICAgICAgICB0b0xvYWQubWFwKCh7eCwgeSwgen0pID0+XG4gICAgICAgICAgTE9BRF9CVUlMRElOR19USUxFX1RBU0soe3gsIHksIHp9KS5iaW1hcChcbiAgICAgICAgICAgIHJlc3VsdCA9PiBsb2FkQnVpbGRpbmdUaWxlU3VjY2Vzcyh7eCwgeSwgeiwgcmVzdWx0fSksXG4gICAgICAgICAgICBlcnJvciA9PiBsb2FkQnVpbGRpbmdUaWxlRXJyb3IoZXJyb3IpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgOiBuZXdTdGF0ZTtcbn07XG5cbmNvbnN0IG9uSW5pdGlhdGVDYWNoZSA9IHN0YXRlID0+ICh7XG4gIC4uLnN0YXRlLFxuICBjYWNoZTogbmV3IFRpbGVzQ2FjaGUoKSxcbiAgdGlsZXM6IG5ldyBUaWxlc0NvbGxlY3Rpb24oKVxufSk7XG5cbmNvbnN0IG9uTG9hZEJ1aWxkaW5nVGlsZVN0YXJ0ID0gKHN0YXRlLCB7cGF5bG9hZDoge3gsIHksIHp9fSkgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGNhY2hlOiBzdGF0ZS5jYWNoZS5zZXQoeCwgeSwgeiwge3gsIHksIHp9KVxufSk7XG5cbmNvbnN0IG9uTG9hZEJ1aWxkaW5nVGlsZVN1Y2Nlc3MgPSAoc3RhdGUsIHtwYXlsb2FkOiB7eCwgeSwgeiwgcmVzdWx0fX0pID0+IHtcbiAgaWYgKCFyZXN1bHQpIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBjb25zdCBkYXRhID0ge3gsIHksIHosIGZlYXR1cmVzOiByZXN1bHR9O1xuXG4gIGxldCBuZXdTdGF0ZSA9IHN0YXRlO1xuICBpZiAoc3RhdGUudGlsZXMuY29udGFpbnMoeCwgeSwgeikpIHtcbiAgICBuZXdTdGF0ZSA9IG9uVXBkYXRlQnVpbGRpbmdUaWxlcyhzdGF0ZSwge1xuICAgICAgcGF5bG9hZDoge2xvYWRlZDogWy4uLnN0YXRlLmxvYWRlZCwgZGF0YV19XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLm5ld1N0YXRlLFxuICAgIGNhY2hlOiBuZXdTdGF0ZS5jYWNoZS5zZXQoeCwgeSwgeiwgZGF0YSlcbiAgfTtcbn07XG5cbmNvbnN0IG9uTG9hZEJ1aWxkaW5nVGlsZUVycm9yID0gKHN0YXRlLCB7cGF5bG9hZDogZXJyb3J9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZXJyb3Jcbn0pO1xuXG5jb25zdCBidWlsZGluZ0RhdGFSZWR1Y2VyID0gaGFuZGxlQWN0aW9ucyhcbiAge1xuICAgIFtMT0FEX0JVSUxESU5HX1RJTEVdOiBvbkxvYWRCdWlsZGluZ1RpbGUsXG4gICAgW0xPQURfQlVJTERJTkdfVElMRV9TVEFSVF06IG9uTG9hZEJ1aWxkaW5nVGlsZVN0YXJ0LFxuICAgIFtMT0FEX0JVSUxESU5HX1RJTEVfU1VDQ0VTU106IG9uTG9hZEJ1aWxkaW5nVGlsZVN1Y2Nlc3MsXG4gICAgW0xPQURfQlVJTERJTkdfVElMRV9FUlJPUl06IG9uTG9hZEJ1aWxkaW5nVGlsZUVycm9yLFxuICAgIFtVUERBVEVfQlVJTERJTkdfVElMRVNdOiBvblVwZGF0ZUJ1aWxkaW5nVGlsZXMsXG4gICAgW0lOSVRdOiBvbkluaXRpYXRlQ2FjaGVcbiAgfSxcbiAge1xuICAgIGNhY2hlOiB7fSxcbiAgICB0aWxlczoge30sXG4gICAgbG9hZGVkOiBbXSxcbiAgICBlcnJvcjogbnVsbCxcbiAgICBidWlsZGluZ0RhdGE6IFtdLFxuICAgIGxvYWRQcm9ncmVzczogMFxuICB9XG4pO1xuXG5leHBvcnQgZGVmYXVsdCBidWlsZGluZ0RhdGFSZWR1Y2VyO1xuIl19