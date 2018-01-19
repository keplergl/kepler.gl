'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _visState = require('./vis-state');

var _visState2 = _interopRequireDefault(_visState);

var _mapState = require('./map-state');

var _mapState2 = _interopRequireDefault(_mapState);

var _mapStyle = require('./map-style');

var _mapStyle2 = _interopRequireDefault(_mapStyle);

var _buildingData = require('./building-data');

var _buildingData2 = _interopRequireDefault(_buildingData);

var _uiState = require('./ui-state');

var _uiState2 = _interopRequireDefault(_uiState);

var _composers = require('./composers');

var _composers2 = _interopRequireDefault(_composers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var combined = (0, _redux.combineReducers)({
  buildingData: _buildingData2.default,
  visState: _visState2.default,
  mapState: _mapState2.default,
  mapStyle: _mapStyle2.default,
  uiState: _uiState2.default
});

var composedReducer = function composedReducer(state, action) {
  if (_composers2.default[action.type]) {
    return _composers2.default[action.type](state, action);
  }
  return combined(state, action);
};

exports.default = composedReducer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9jb3JlLmpzIl0sIm5hbWVzIjpbImNvbWJpbmVkIiwiYnVpbGRpbmdEYXRhIiwidmlzU3RhdGUiLCJtYXBTdGF0ZSIsIm1hcFN0eWxlIiwidWlTdGF0ZSIsImNvbXBvc2VkUmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFFQSxJQUFNQSxXQUFXLDRCQUFnQjtBQUMvQkMsc0NBRCtCO0FBRS9CQyw4QkFGK0I7QUFHL0JDLDhCQUgrQjtBQUkvQkMsOEJBSitCO0FBSy9CQztBQUwrQixDQUFoQixDQUFqQjs7QUFRQSxJQUFNQyxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQsRUFBUUMsTUFBUixFQUFtQjtBQUN6QyxNQUFJLG9CQUFVQSxPQUFPQyxJQUFqQixDQUFKLEVBQTRCO0FBQzFCLFdBQU8sb0JBQVVELE9BQU9DLElBQWpCLEVBQXVCRixLQUF2QixFQUE4QkMsTUFBOUIsQ0FBUDtBQUNEO0FBQ0QsU0FBT1IsU0FBU08sS0FBVCxFQUFnQkMsTUFBaEIsQ0FBUDtBQUNELENBTEQ7O2tCQU9lRixlIiwiZmlsZSI6ImNvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2NvbWJpbmVSZWR1Y2Vyc30gZnJvbSAncmVkdXgnO1xuXG5pbXBvcnQgdmlzU3RhdGUgZnJvbSAnLi92aXMtc3RhdGUnO1xuaW1wb3J0IG1hcFN0YXRlIGZyb20gJy4vbWFwLXN0YXRlJztcbmltcG9ydCBtYXBTdHlsZSBmcm9tICcuL21hcC1zdHlsZSc7XG5pbXBvcnQgYnVpbGRpbmdEYXRhIGZyb20gJy4vYnVpbGRpbmctZGF0YSc7XG5pbXBvcnQgdWlTdGF0ZSBmcm9tICcuL3VpLXN0YXRlJztcblxuaW1wb3J0IGNvbXBvc2VycyBmcm9tICcuL2NvbXBvc2Vycyc7XG5cbmNvbnN0IGNvbWJpbmVkID0gY29tYmluZVJlZHVjZXJzKHtcbiAgYnVpbGRpbmdEYXRhLFxuICB2aXNTdGF0ZSxcbiAgbWFwU3RhdGUsXG4gIG1hcFN0eWxlLFxuICB1aVN0YXRlXG59KTtcblxuY29uc3QgY29tcG9zZWRSZWR1Y2VyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgaWYgKGNvbXBvc2Vyc1thY3Rpb24udHlwZV0pIHtcbiAgICByZXR1cm4gY29tcG9zZXJzW2FjdGlvbi50eXBlXShzdGF0ZSwgYWN0aW9uKTtcbiAgfVxuICByZXR1cm4gY29tYmluZWQoc3RhdGUsIGFjdGlvbik7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb21wb3NlZFJlZHVjZXI7XG4iXX0=