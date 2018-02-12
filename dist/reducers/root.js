'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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
  var id = _ref.payload;
  return (0, _extends4.default)({}, state, (0, _defineProperty3.default)({}, id, (0, _extends4.default)({}, (0, _core2.default)(undefined, (0, _actions.keplerGlInit)(id)))));
};

var handleDeleteEntry = function handleDeleteEntry(state, _ref2) {
  var id = _ref2.payload;

  return Object.keys(state).reduce(function (accu, curr) {
    return (0, _extends4.default)({}, accu, curr === id ? {} : (0, _defineProperty3.default)({}, curr, state[curr]));
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
  return (0, _reduxActions.handleActions)((_handleActions = {}, (0, _defineProperty3.default)(_handleActions, _identityActions.REGISTER_ENTRY, handleRegisterEntry), (0, _defineProperty3.default)(_handleActions, _identityActions.DELETE_ENTRY, handleDeleteEntry), _handleActions), initialCoreState)(state, action);
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

      // for each entry in the staten
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9yb290LmpzIl0sIm5hbWVzIjpbImluaXRpYWxDb3JlU3RhdGUiLCJoYW5kbGVSZWdpc3RlckVudHJ5Iiwic3RhdGUiLCJpZCIsInBheWxvYWQiLCJ1bmRlZmluZWQiLCJoYW5kbGVEZWxldGVFbnRyeSIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhY2N1IiwiY3VyciIsImtlcGxlckdsUmVkdWNlciIsImFjdGlvbiIsImZvckVhY2giLCJ1cGRhdGVJdGVtU3RhdGUiLCJkZWNvcmF0ZSIsInRhcmdldCIsInBsdWdpbiIsImN1c3RvbVJlZHVjZXIiLCJuZXh0U3RhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7Ozs7QUFFQTs7QUFFQTs7OztBQUNBOzs7OztBQUtBO0FBQ0EsSUFBTUEsbUJBQW1CLEVBQXpCOztBQUVBLElBQU1DLHNCQUFzQixTQUF0QkEsbUJBQXNCLENBQUNDLEtBQUQ7QUFBQSxNQUFrQkMsRUFBbEIsUUFBU0MsT0FBVDtBQUFBLG9DQUV2QkYsS0FGdUIsb0NBR3pCQyxFQUh5Qiw2QkFJckIsb0JBQVlFLFNBQVosRUFBdUIsMkJBQWFGLEVBQWIsQ0FBdkIsQ0FKcUI7QUFBQSxDQUE1Qjs7QUFRQSxJQUFNRyxvQkFBb0IsU0FBcEJBLGlCQUFvQixDQUFDSixLQUFELFNBQTBCO0FBQUEsTUFBUkMsRUFBUSxTQUFqQkMsT0FBaUI7O0FBQ2xELFNBQU9HLE9BQU9DLElBQVAsQ0FBWU4sS0FBWixFQUFtQk8sTUFBbkIsQ0FDTCxVQUFDQyxJQUFELEVBQU9DLElBQVA7QUFBQSxzQ0FDS0QsSUFETCxFQUVNQyxTQUFTUixFQUFULEdBQWMsRUFBZCxxQ0FBcUJRLElBQXJCLEVBQTRCVCxNQUFNUyxJQUFOLENBQTVCLENBRk47QUFBQSxHQURLLEVBS0wsRUFMSyxDQUFQO0FBT0QsQ0FSRDs7QUFVQSxJQUFNQyxrQkFBa0IsU0FBbEJBLGVBQWtCLEdBQXNDO0FBQUE7O0FBQUEsTUFBckNWLEtBQXFDLHVFQUE3QkYsZ0JBQTZCO0FBQUEsTUFBWGEsTUFBVzs7QUFDNUQ7QUFDQU4sU0FBT0MsSUFBUCxDQUFZTixLQUFaLEVBQW1CWSxPQUFuQixDQUEyQixjQUFNO0FBQy9CLFFBQU1DLGtCQUFrQixvQkFBWWIsTUFBTUMsRUFBTixDQUFaLEVBQXVCLDhCQUFVQSxFQUFWLEVBQWNVLE1BQWQsQ0FBdkIsQ0FBeEI7QUFDQVgsWUFBUSxtQ0FBZUEsS0FBZixFQUFzQkMsRUFBdEIsRUFBMEJZLGVBQTFCLENBQVI7QUFDRCxHQUhEOztBQUtBO0FBQ0EsU0FBTyxzSUFFZWQsbUJBRmYsZ0ZBR2FLLGlCQUhiLG9CQUtMTixnQkFMSyxFQU1MRSxLQU5LLEVBTUVXLE1BTkYsQ0FBUDtBQU9ELENBZkQ7O0FBaUJBLFNBQVNHLFFBQVQsQ0FBa0JDLE1BQWxCLEVBQTBCO0FBQ3hCO0FBQ0FBLFNBQU9DLE1BQVAsR0FBZ0IsU0FBU0EsTUFBVCxDQUFnQkMsYUFBaEIsRUFBK0I7QUFBQTs7QUFDN0M7QUFDQSxXQUFPSCxTQUFTLFlBQTZCO0FBQUEsVUFBNUJkLEtBQTRCLHVFQUFwQixFQUFvQjtBQUFBLFVBQWhCVyxNQUFnQix1RUFBUCxFQUFPOztBQUMzQyxVQUFJTyxZQUFZLE1BQUtsQixLQUFMLEVBQVlXLE1BQVosQ0FBaEI7O0FBRUE7QUFDQU4sYUFBT0MsSUFBUCxDQUFZWSxTQUFaLEVBQXVCTixPQUF2QixDQUErQixjQUFNO0FBQ25DO0FBQ0FNLG9CQUFZLG1DQUNWQSxTQURVLEVBRVZqQixFQUZVLEVBR1ZnQixjQUFjQyxVQUFVakIsRUFBVixDQUFkLEVBQTZCLDhCQUFVQSxFQUFWLEVBQWNVLE1BQWQsQ0FBN0IsQ0FIVSxDQUFaO0FBS0QsT0FQRDs7QUFTQSxhQUFPTyxTQUFQO0FBQ0QsS0FkTSxDQUFQO0FBZUQsR0FqQkQ7O0FBbUJBLFNBQU9ILE1BQVA7QUFDRDs7a0JBRWNELFNBQVNKLGVBQVQsQyIsImZpbGUiOiJyb290LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtoYW5kbGVBY3Rpb25zfSBmcm9tICdyZWR1eC1hY3Rpb25zJztcblxuaW1wb3J0IHthY3Rpb25Gb3IsIHVwZGF0ZVByb3BlcnR5fSBmcm9tICcuLi9hY3Rpb25zL2FjdGlvbi13cmFwcGVyJztcbmltcG9ydCBjb3JlUmVkdWNlciBmcm9tICcuL2NvcmUnO1xuXG5pbXBvcnQge1JFR0lTVEVSX0VOVFJZLCBERUxFVEVfRU5UUll9IGZyb20gJy4uL2FjdGlvbnMvaWRlbnRpdHktYWN0aW9ucyc7XG5cbmltcG9ydCB7a2VwbGVyR2xJbml0fSBmcm9tICcuLi9hY3Rpb25zL2FjdGlvbnMnO1xuLypcbiAqIHZveWFnZXIgcmVkdWNlciB3cmFwcGVyLFxuICogd3JhcHMgbXVsdGlwbGUgdm95YWdlciBzdGF0ZSBpbiBvbmUgdm95YWdlclxuICovXG5cbi8vIElOSVRJQUxfU1RBVEVcbmNvbnN0IGluaXRpYWxDb3JlU3RhdGUgPSB7fTtcblxuY29uc3QgaGFuZGxlUmVnaXN0ZXJFbnRyeSA9IChzdGF0ZSwge3BheWxvYWQ6IGlkfSkgPT4gKHtcbiAgLy8gcmVnaXN0ZXIgYSBuZXcgZW50cnkgdG8gdm95YWdlciByZWR1Y2VyXG4gIC4uLnN0YXRlLFxuICBbaWRdOiB7XG4gICAgLi4uY29yZVJlZHVjZXIodW5kZWZpbmVkLCBrZXBsZXJHbEluaXQoaWQpKVxuICB9XG59KTtcblxuY29uc3QgaGFuZGxlRGVsZXRlRW50cnkgPSAoc3RhdGUsIHtwYXlsb2FkOiBpZH0pID0+IHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHN0YXRlKS5yZWR1Y2UoXG4gICAgKGFjY3UsIGN1cnIpID0+ICh7XG4gICAgICAuLi5hY2N1LFxuICAgICAgLi4uKGN1cnIgPT09IGlkID8ge30gOiB7W2N1cnJdOiBzdGF0ZVtjdXJyXX0pXG4gICAgfSksXG4gICAge31cbiAgKTtcbn07XG5cbmNvbnN0IGtlcGxlckdsUmVkdWNlciA9IChzdGF0ZSA9IGluaXRpYWxDb3JlU3RhdGUsIGFjdGlvbikgPT4ge1xuICAvLyB1cGRhdGUgY2hpbGQgc3RhdGVzXG4gIE9iamVjdC5rZXlzKHN0YXRlKS5mb3JFYWNoKGlkID0+IHtcbiAgICBjb25zdCB1cGRhdGVJdGVtU3RhdGUgPSBjb3JlUmVkdWNlcihzdGF0ZVtpZF0sIGFjdGlvbkZvcihpZCwgYWN0aW9uKSk7XG4gICAgc3RhdGUgPSB1cGRhdGVQcm9wZXJ0eShzdGF0ZSwgaWQsIHVwZGF0ZUl0ZW1TdGF0ZSk7XG4gIH0pO1xuXG4gIC8vIHBlcmZvcm0gYWRkaXRpb25hbCBzdGF0ZSByZWR1Y2luZyAoZS5nLiBzd2l0Y2ggYWN0aW9uLnR5cGUgZXRjLi4uKVxuICByZXR1cm4gaGFuZGxlQWN0aW9ucyhcbiAgICB7XG4gICAgICBbUkVHSVNURVJfRU5UUlldOiBoYW5kbGVSZWdpc3RlckVudHJ5LFxuICAgICAgW0RFTEVURV9FTlRSWV06IGhhbmRsZURlbGV0ZUVudHJ5XG4gICAgfSxcbiAgICBpbml0aWFsQ29yZVN0YXRlXG4gICkoc3RhdGUsIGFjdGlvbik7XG59O1xuXG5mdW5jdGlvbiBkZWNvcmF0ZSh0YXJnZXQpIHtcbiAgLy8gcGx1Z2luIHRvIGNvcmUgcmVkdWNlclxuICB0YXJnZXQucGx1Z2luID0gZnVuY3Rpb24gcGx1Z2luKGN1c3RvbVJlZHVjZXIpIHtcbiAgICAvLyB1c2UgJ2Z1bmN0aW9uJyBrZXl3b3JkIHRvIGVuYWJsZSAndGhpcydcbiAgICByZXR1cm4gZGVjb3JhdGUoKHN0YXRlID0ge30sIGFjdGlvbiA9IHt9KSA9PiB7XG4gICAgICBsZXQgbmV4dFN0YXRlID0gdGhpcyhzdGF0ZSwgYWN0aW9uKTtcblxuICAgICAgLy8gZm9yIGVhY2ggZW50cnkgaW4gdGhlIHN0YXRlblxuICAgICAgT2JqZWN0LmtleXMobmV4dFN0YXRlKS5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgLy8gdXBkYXRlIGNoaWxkIHN0YXRlc1xuICAgICAgICBuZXh0U3RhdGUgPSB1cGRhdGVQcm9wZXJ0eShcbiAgICAgICAgICBuZXh0U3RhdGUsXG4gICAgICAgICAgaWQsXG4gICAgICAgICAgY3VzdG9tUmVkdWNlcihuZXh0U3RhdGVbaWRdLCBhY3Rpb25Gb3IoaWQsIGFjdGlvbikpXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWNvcmF0ZShrZXBsZXJHbFJlZHVjZXIpO1xuIl19