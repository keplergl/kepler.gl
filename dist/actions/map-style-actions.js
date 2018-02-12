'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapBuildingChange = exports.loadMapStyleErr = exports.loadMapStyles = exports.mapStyleChange = exports.mapConfigChange = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _reduxActions = require('redux-actions');

var _actionTypes = require('../constants/action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MAP_CONFIG_CHANGE = _actionTypes2.default.MAP_CONFIG_CHANGE,
    MAP_STYLE_CHANGE = _actionTypes2.default.MAP_STYLE_CHANGE,
    LOAD_MAP_STYLES = _actionTypes2.default.LOAD_MAP_STYLES,
    LOAD_MAP_STYLE_ERR = _actionTypes2.default.LOAD_MAP_STYLE_ERR,
    MAP_BUILDING_CHANGE = _actionTypes2.default.MAP_BUILDING_CHANGE;

// second argument of createAction is expected to be payloadCreator or undefined

var _map = [MAP_CONFIG_CHANGE, LOAD_MAP_STYLES, LOAD_MAP_STYLE_ERR, MAP_STYLE_CHANGE, MAP_BUILDING_CHANGE].map(function (a) {
  return (0, _reduxActions.createAction)(a);
}),
    _map2 = (0, _slicedToArray3.default)(_map, 5),
    mapConfigChange = _map2[0],
    loadMapStyles = _map2[1],
    loadMapStyleErr = _map2[2],
    mapStyleChange = _map2[3],
    mapBuildingChange = _map2[4];

exports.mapConfigChange = mapConfigChange;
exports.mapStyleChange = mapStyleChange;
exports.loadMapStyles = loadMapStyles;
exports.loadMapStyleErr = loadMapStyleErr;
exports.mapBuildingChange = mapBuildingChange;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL21hcC1zdHlsZS1hY3Rpb25zLmpzIl0sIm5hbWVzIjpbIk1BUF9DT05GSUdfQ0hBTkdFIiwiTUFQX1NUWUxFX0NIQU5HRSIsIkxPQURfTUFQX1NUWUxFUyIsIkxPQURfTUFQX1NUWUxFX0VSUiIsIk1BUF9CVUlMRElOR19DSEFOR0UiLCJtYXAiLCJhIiwibWFwQ29uZmlnQ2hhbmdlIiwibG9hZE1hcFN0eWxlcyIsImxvYWRNYXBTdHlsZUVyciIsIm1hcFN0eWxlQ2hhbmdlIiwibWFwQnVpbGRpbmdDaGFuZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7OztJQUdFQSxpQix5QkFBQUEsaUI7SUFDQUMsZ0IseUJBQUFBLGdCO0lBQ0FDLGUseUJBQUFBLGU7SUFDQUMsa0IseUJBQUFBLGtCO0lBQ0FDLG1CLHlCQUFBQSxtQjs7QUFHRjs7V0FPSSxDQUNGSixpQkFERSxFQUVGRSxlQUZFLEVBR0ZDLGtCQUhFLEVBSUZGLGdCQUpFLEVBS0ZHLG1CQUxFLEVBTUZDLEdBTkUsQ0FNRTtBQUFBLFNBQUssZ0NBQWFDLENBQWIsQ0FBTDtBQUFBLENBTkYsQzs7SUFMRkMsZTtJQUNBQyxhO0lBQ0FDLGU7SUFDQUMsYztJQUNBQyxpQjs7UUFVQUosZSxHQUFBQSxlO1FBQ0FHLGMsR0FBQUEsYztRQUNBRixhLEdBQUFBLGE7UUFDQUMsZSxHQUFBQSxlO1FBQ0FFLGlCLEdBQUFBLGlCIiwiZmlsZSI6Im1hcC1zdHlsZS1hY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjcmVhdGVBY3Rpb259IGZyb20gJ3JlZHV4LWFjdGlvbnMnO1xuaW1wb3J0IEFjdGlvblR5cGVzIGZyb20gJy4uL2NvbnN0YW50cy9hY3Rpb24tdHlwZXMnO1xuXG5jb25zdCB7XG4gIE1BUF9DT05GSUdfQ0hBTkdFLFxuICBNQVBfU1RZTEVfQ0hBTkdFLFxuICBMT0FEX01BUF9TVFlMRVMsXG4gIExPQURfTUFQX1NUWUxFX0VSUixcbiAgTUFQX0JVSUxESU5HX0NIQU5HRVxufSA9IEFjdGlvblR5cGVzO1xuXG4vLyBzZWNvbmQgYXJndW1lbnQgb2YgY3JlYXRlQWN0aW9uIGlzIGV4cGVjdGVkIHRvIGJlIHBheWxvYWRDcmVhdG9yIG9yIHVuZGVmaW5lZFxuY29uc3QgW1xuICBtYXBDb25maWdDaGFuZ2UsXG4gIGxvYWRNYXBTdHlsZXMsXG4gIGxvYWRNYXBTdHlsZUVycixcbiAgbWFwU3R5bGVDaGFuZ2UsXG4gIG1hcEJ1aWxkaW5nQ2hhbmdlXG5dID0gW1xuICBNQVBfQ09ORklHX0NIQU5HRSxcbiAgTE9BRF9NQVBfU1RZTEVTLFxuICBMT0FEX01BUF9TVFlMRV9FUlIsXG4gIE1BUF9TVFlMRV9DSEFOR0UsXG4gIE1BUF9CVUlMRElOR19DSEFOR0Vcbl0ubWFwKGEgPT4gY3JlYXRlQWN0aW9uKGEpKTtcblxuZXhwb3J0IHtcbiAgbWFwQ29uZmlnQ2hhbmdlLFxuICBtYXBTdHlsZUNoYW5nZSxcbiAgbG9hZE1hcFN0eWxlcyxcbiAgbG9hZE1hcFN0eWxlRXJyLFxuICBtYXBCdWlsZGluZ0NoYW5nZVxufTtcbiJdfQ==