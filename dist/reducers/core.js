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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9jb3JlLmpzIl0sIm5hbWVzIjpbImNvbWJpbmVkIiwiYnVpbGRpbmdEYXRhIiwidmlzU3RhdGUiLCJtYXBTdGF0ZSIsIm1hcFN0eWxlIiwidWlTdGF0ZSIsImNvbXBvc2VkUmVkdWNlciIsInN0YXRlIiwiYWN0aW9uIiwidHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFFQSxJQUFNQSxXQUFXLDRCQUFnQjtBQUMvQkMsc0NBRCtCO0FBRS9CQyw4QkFGK0I7QUFHL0JDLDhCQUgrQjtBQUkvQkMsOEJBSitCO0FBSy9CQztBQUwrQixDQUFoQixDQUFqQjs7QUFRQSxJQUFNQyxrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQsRUFBUUMsTUFBUixFQUFtQjtBQUN6QyxNQUFJLG9CQUFVQSxPQUFPQyxJQUFqQixDQUFKLEVBQTRCO0FBQzFCLFdBQU8sb0JBQVVELE9BQU9DLElBQWpCLEVBQXVCRixLQUF2QixFQUE4QkMsTUFBOUIsQ0FBUDtBQUNEO0FBQ0QsU0FBT1IsU0FBU08sS0FBVCxFQUFnQkMsTUFBaEIsQ0FBUDtBQUNELENBTEQ7O2tCQU9lRixlIiwiZmlsZSI6ImNvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7Y29tYmluZVJlZHVjZXJzfSBmcm9tICdyZWR1eCc7XG5cbmltcG9ydCB2aXNTdGF0ZSBmcm9tICcuL3Zpcy1zdGF0ZSc7XG5pbXBvcnQgbWFwU3RhdGUgZnJvbSAnLi9tYXAtc3RhdGUnO1xuaW1wb3J0IG1hcFN0eWxlIGZyb20gJy4vbWFwLXN0eWxlJztcbmltcG9ydCBidWlsZGluZ0RhdGEgZnJvbSAnLi9idWlsZGluZy1kYXRhJztcbmltcG9ydCB1aVN0YXRlIGZyb20gJy4vdWktc3RhdGUnO1xuXG5pbXBvcnQgY29tcG9zZXJzIGZyb20gJy4vY29tcG9zZXJzJztcblxuY29uc3QgY29tYmluZWQgPSBjb21iaW5lUmVkdWNlcnMoe1xuICBidWlsZGluZ0RhdGEsXG4gIHZpc1N0YXRlLFxuICBtYXBTdGF0ZSxcbiAgbWFwU3R5bGUsXG4gIHVpU3RhdGVcbn0pO1xuXG5jb25zdCBjb21wb3NlZFJlZHVjZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBpZiAoY29tcG9zZXJzW2FjdGlvbi50eXBlXSkge1xuICAgIHJldHVybiBjb21wb3NlcnNbYWN0aW9uLnR5cGVdKHN0YXRlLCBhY3Rpb24pO1xuICB9XG4gIHJldHVybiBjb21iaW5lZChzdGF0ZSwgYWN0aW9uKVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29tcG9zZWRSZWR1Y2VyO1xuIl19