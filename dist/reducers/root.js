'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _reduxActions = require('redux-actions');

var _actionWrapper = require('../actions/action-wrapper');

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _identityActions = require('../actions/identity-actions');

var _actions = require('../actions/actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * voyager reducer wrapper,
 * wraps multiple voyager state in one voyager
 */

// INITIAL_STATE
var initialCoreState = {};

var handleRegisterEntry = function handleRegisterEntry(state, _ref) {
  var _extends2;

  var id = _ref.payload;
  return (0, _extends4.default)({}, state, (_extends2 = {}, _extends2[id] = (0, _extends4.default)({}, (0, _core2.default)(undefined, (0, _actions.keplerGlInit)(id))), _extends2));
};

var handleDeleteEntry = function handleDeleteEntry(state, _ref2) {
  var id = _ref2.payload;

  return Object.keys(state).reduce(function (accu, curr) {
    var _ref3;

    return (0, _extends4.default)({}, accu, curr === id ? {} : (_ref3 = {}, _ref3[curr] = state[curr], _ref3));
  }, {});
};

var keplerGlReducer = function keplerGlReducer() {
  var _handleActions;

  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialCoreState;
  var action = arguments[1];

  // update child states
  Object.keys(state).forEach(function (id) {
    var updateItemState = (0, _core2.default)(state[id], (0, _actionWrapper.actionFor)(id, action));
    state = (0, _actionWrapper.updateProperty)(state, id, updateItemState);
  });

  // perform additional state reducing (e.g. switch action.type etc...)
  return (0, _reduxActions.handleActions)((_handleActions = {}, _handleActions[_identityActions.REGISTER_ENTRY] = handleRegisterEntry, _handleActions[_identityActions.DELETE_ENTRY] = handleDeleteEntry, _handleActions), initialCoreState)(state, action);
};

function decorate(target) {

  // plugin to core reducer
  target.plugin = function plugin(customReducer) {
    var _this = this;

    // use 'function' keyword to enable 'this'
    return decorate(function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var nextState = _this(state, action);
      Object.keys(nextState).forEach(function (id) {
        // update child states
        nextState = (0, _actionWrapper.updateProperty)(nextState, id, customReducer(nextState[id], (0, _actionWrapper.actionFor)(id, action)));
      });

      return nextState;
    });
  };

  return target;
}

exports.default = decorate(keplerGlReducer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9yb290LmpzIl0sIm5hbWVzIjpbImluaXRpYWxDb3JlU3RhdGUiLCJoYW5kbGVSZWdpc3RlckVudHJ5Iiwic3RhdGUiLCJpZCIsInBheWxvYWQiLCJ1bmRlZmluZWQiLCJoYW5kbGVEZWxldGVFbnRyeSIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhY2N1IiwiY3VyciIsImtlcGxlckdsUmVkdWNlciIsImFjdGlvbiIsImZvckVhY2giLCJ1cGRhdGVJdGVtU3RhdGUiLCJkZWNvcmF0ZSIsInRhcmdldCIsInBsdWdpbiIsImN1c3RvbVJlZHVjZXIiLCJuZXh0U3RhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7OztBQUVBOztBQUtBOzs7O0FBQ0E7Ozs7O0FBS0E7QUFDQSxJQUFNQSxtQkFBbUIsRUFBekI7O0FBRUEsSUFBTUMsc0JBQXNCLFNBQXRCQSxtQkFBc0IsQ0FBQ0MsS0FBRDtBQUFBOztBQUFBLE1BQWtCQyxFQUFsQixRQUFTQyxPQUFUO0FBQUEsb0NBRXZCRixLQUZ1Qiw2QkFHekJDLEVBSHlCLCtCQUlyQixvQkFBWUUsU0FBWixFQUF1QiwyQkFBYUYsRUFBYixDQUF2QixDQUpxQjtBQUFBLENBQTVCOztBQVFBLElBQU1HLG9CQUFvQixTQUFwQkEsaUJBQW9CLENBQUNKLEtBQUQsU0FBMEI7QUFBQSxNQUFSQyxFQUFRLFNBQWpCQyxPQUFpQjs7QUFDbEQsU0FBT0csT0FBT0MsSUFBUCxDQUFZTixLQUFaLEVBQW1CTyxNQUFuQixDQUEwQixVQUFDQyxJQUFELEVBQU9DLElBQVA7QUFBQTs7QUFBQSxzQ0FDNUJELElBRDRCLEVBRTNCQyxTQUFTUixFQUFULEdBQWMsRUFBZCxzQkFBcUJRLElBQXJCLElBQTRCVCxNQUFNUyxJQUFOLENBQTVCLFFBRjJCO0FBQUEsR0FBMUIsRUFHSCxFQUhHLENBQVA7QUFJRCxDQUxEOztBQU9BLElBQU1DLGtCQUFrQixTQUFsQkEsZUFBa0IsR0FBc0M7QUFBQTs7QUFBQSxNQUFyQ1YsS0FBcUMsdUVBQTdCRixnQkFBNkI7QUFBQSxNQUFYYSxNQUFXOztBQUM1RDtBQUNBTixTQUFPQyxJQUFQLENBQVlOLEtBQVosRUFBbUJZLE9BQW5CLENBQTJCLGNBQU07QUFDL0IsUUFBTUMsa0JBQWtCLG9CQUFZYixNQUFNQyxFQUFOLENBQVosRUFBdUIsOEJBQVVBLEVBQVYsRUFBY1UsTUFBZCxDQUF2QixDQUF4QjtBQUNBWCxZQUFRLG1DQUFlQSxLQUFmLEVBQXNCQyxFQUF0QixFQUEwQlksZUFBMUIsQ0FBUjtBQUNELEdBSEQ7O0FBS0E7QUFDQSxTQUFPLHlHQUNhZCxtQkFEYixrREFFV0ssaUJBRlgsbUJBR0pOLGdCQUhJLEVBR2NFLEtBSGQsRUFHcUJXLE1BSHJCLENBQVA7QUFJRCxDQVpEOztBQWNBLFNBQVNHLFFBQVQsQ0FBa0JDLE1BQWxCLEVBQTBCOztBQUV4QjtBQUNBQSxTQUFPQyxNQUFQLEdBQWdCLFNBQVNBLE1BQVQsQ0FBZ0JDLGFBQWhCLEVBQStCO0FBQUE7O0FBRTdDO0FBQ0EsV0FBT0gsU0FBUyxZQUE2QjtBQUFBLFVBQTVCZCxLQUE0Qix1RUFBcEIsRUFBb0I7QUFBQSxVQUFoQlcsTUFBZ0IsdUVBQVAsRUFBTzs7QUFDekMsVUFBSU8sWUFBWSxNQUFLbEIsS0FBTCxFQUFZVyxNQUFaLENBQWhCO0FBQ0FOLGFBQU9DLElBQVAsQ0FBWVksU0FBWixFQUF1Qk4sT0FBdkIsQ0FBK0IsY0FBTTtBQUNuQztBQUNBTSxvQkFBWSxtQ0FDVkEsU0FEVSxFQUVWakIsRUFGVSxFQUdWZ0IsY0FBY0MsVUFBVWpCLEVBQVYsQ0FBZCxFQUE2Qiw4QkFBVUEsRUFBVixFQUFjVSxNQUFkLENBQTdCLENBSFUsQ0FBWjtBQUtELE9BUEQ7O0FBU0EsYUFBT08sU0FBUDtBQUNELEtBWkksQ0FBUDtBQWNELEdBakJEOztBQW1CQSxTQUFPSCxNQUFQO0FBQ0Q7O2tCQUVjRCxTQUFTSixlQUFULEMiLCJmaWxlIjoicm9vdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aGFuZGxlQWN0aW9uc30gZnJvbSAncmVkdXgtYWN0aW9ucyc7XG5cbmltcG9ydCB7YWN0aW9uRm9yLCB1cGRhdGVQcm9wZXJ0eX0gZnJvbSAnLi4vYWN0aW9ucy9hY3Rpb24td3JhcHBlcic7XG5pbXBvcnQgY29yZVJlZHVjZXIgZnJvbSAnLi9jb3JlJztcblxuaW1wb3J0IHtcbiAgUkVHSVNURVJfRU5UUlksXG4gIERFTEVURV9FTlRSWVxufSBmcm9tICcuLi9hY3Rpb25zL2lkZW50aXR5LWFjdGlvbnMnO1xuXG5pbXBvcnQge2tlcGxlckdsSW5pdH0gZnJvbSAnLi4vYWN0aW9ucy9hY3Rpb25zJztcbi8qXG4gKiB2b3lhZ2VyIHJlZHVjZXIgd3JhcHBlcixcbiAqIHdyYXBzIG11bHRpcGxlIHZveWFnZXIgc3RhdGUgaW4gb25lIHZveWFnZXJcbiAqL1xuXG4vLyBJTklUSUFMX1NUQVRFXG5jb25zdCBpbml0aWFsQ29yZVN0YXRlID0ge307XG5cbmNvbnN0IGhhbmRsZVJlZ2lzdGVyRW50cnkgPSAoc3RhdGUsIHtwYXlsb2FkOiBpZH0pID0+ICh7XG4gIC8vIHJlZ2lzdGVyIGEgbmV3IGVudHJ5IHRvIHZveWFnZXIgcmVkdWNlclxuICAuLi5zdGF0ZSxcbiAgW2lkXToge1xuICAgIC4uLmNvcmVSZWR1Y2VyKHVuZGVmaW5lZCwga2VwbGVyR2xJbml0KGlkKSlcbiAgfVxufSk7XG5cbmNvbnN0IGhhbmRsZURlbGV0ZUVudHJ5ID0gKHN0YXRlLCB7cGF5bG9hZDogaWR9KSA9PiB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhzdGF0ZSkucmVkdWNlKChhY2N1LCBjdXJyKSA9PiAoe1xuICAgIC4uLmFjY3UsXG4gICAgLi4uKGN1cnIgPT09IGlkID8ge30gOiB7W2N1cnJdOiBzdGF0ZVtjdXJyXX0pXG4gIH0pLCB7fSk7XG59O1xuXG5jb25zdCBrZXBsZXJHbFJlZHVjZXIgPSAoc3RhdGUgPSBpbml0aWFsQ29yZVN0YXRlLCBhY3Rpb24pID0+IHtcbiAgLy8gdXBkYXRlIGNoaWxkIHN0YXRlc1xuICBPYmplY3Qua2V5cyhzdGF0ZSkuZm9yRWFjaChpZCA9PiB7XG4gICAgY29uc3QgdXBkYXRlSXRlbVN0YXRlID0gY29yZVJlZHVjZXIoc3RhdGVbaWRdLCBhY3Rpb25Gb3IoaWQsIGFjdGlvbikpO1xuICAgIHN0YXRlID0gdXBkYXRlUHJvcGVydHkoc3RhdGUsIGlkLCB1cGRhdGVJdGVtU3RhdGUpO1xuICB9KTtcblxuICAvLyBwZXJmb3JtIGFkZGl0aW9uYWwgc3RhdGUgcmVkdWNpbmcgKGUuZy4gc3dpdGNoIGFjdGlvbi50eXBlIGV0Yy4uLilcbiAgcmV0dXJuIGhhbmRsZUFjdGlvbnMoe1xuICAgIFtSRUdJU1RFUl9FTlRSWV06IGhhbmRsZVJlZ2lzdGVyRW50cnksXG4gICAgW0RFTEVURV9FTlRSWV06IGhhbmRsZURlbGV0ZUVudHJ5XG4gIH0sIGluaXRpYWxDb3JlU3RhdGUpKHN0YXRlLCBhY3Rpb24pO1xufTtcblxuZnVuY3Rpb24gZGVjb3JhdGUodGFyZ2V0KSB7XG5cbiAgLy8gcGx1Z2luIHRvIGNvcmUgcmVkdWNlclxuICB0YXJnZXQucGx1Z2luID0gZnVuY3Rpb24gcGx1Z2luKGN1c3RvbVJlZHVjZXIpIHtcblxuICAgIC8vIHVzZSAnZnVuY3Rpb24nIGtleXdvcmQgdG8gZW5hYmxlICd0aGlzJ1xuICAgIHJldHVybiBkZWNvcmF0ZSgoc3RhdGUgPSB7fSwgYWN0aW9uID0ge30pID0+IHtcbiAgICAgICAgbGV0IG5leHRTdGF0ZSA9IHRoaXMoc3RhdGUsIGFjdGlvbik7XG4gICAgICAgIE9iamVjdC5rZXlzKG5leHRTdGF0ZSkuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgICAgLy8gdXBkYXRlIGNoaWxkIHN0YXRlc1xuICAgICAgICAgIG5leHRTdGF0ZSA9IHVwZGF0ZVByb3BlcnR5KFxuICAgICAgICAgICAgbmV4dFN0YXRlLFxuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBjdXN0b21SZWR1Y2VyKG5leHRTdGF0ZVtpZF0sIGFjdGlvbkZvcihpZCwgYWN0aW9uKSlcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbmV4dFN0YXRlO1xuICAgICAgfVxuICAgIClcbiAgfTtcblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWNvcmF0ZShrZXBsZXJHbFJlZHVjZXIpO1xuIl19