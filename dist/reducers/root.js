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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9yb290LmpzIl0sIm5hbWVzIjpbImluaXRpYWxDb3JlU3RhdGUiLCJoYW5kbGVSZWdpc3RlckVudHJ5Iiwic3RhdGUiLCJpZCIsInBheWxvYWQiLCJ1bmRlZmluZWQiLCJoYW5kbGVEZWxldGVFbnRyeSIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhY2N1IiwiY3VyciIsImtlcGxlckdsUmVkdWNlciIsImFjdGlvbiIsImZvckVhY2giLCJ1cGRhdGVJdGVtU3RhdGUiLCJkZWNvcmF0ZSIsInRhcmdldCIsInBsdWdpbiIsImN1c3RvbVJlZHVjZXIiLCJuZXh0U3RhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7OztBQUVBOztBQUtBOzs7O0FBQ0E7Ozs7O0FBS0E7QUFDQSxJQUFNQSxtQkFBbUIsRUFBekI7O0FBRUEsSUFBTUMsc0JBQXNCLFNBQXRCQSxtQkFBc0IsQ0FBQ0MsS0FBRDtBQUFBOztBQUFBLE1BQWtCQyxFQUFsQixRQUFTQyxPQUFUO0FBQUEsb0NBRXZCRixLQUZ1Qiw2QkFHekJDLEVBSHlCLCtCQUlyQixvQkFBWUUsU0FBWixFQUF1QiwyQkFBYUYsRUFBYixDQUF2QixDQUpxQjtBQUFBLENBQTVCOztBQVFBLElBQU1HLG9CQUFvQixTQUFwQkEsaUJBQW9CLENBQUNKLEtBQUQsU0FBMEI7QUFBQSxNQUFSQyxFQUFRLFNBQWpCQyxPQUFpQjs7QUFDbEQsU0FBT0csT0FBT0MsSUFBUCxDQUFZTixLQUFaLEVBQW1CTyxNQUFuQixDQUEwQixVQUFDQyxJQUFELEVBQU9DLElBQVA7QUFBQTs7QUFBQSxzQ0FDNUJELElBRDRCLEVBRTNCQyxTQUFTUixFQUFULEdBQWMsRUFBZCxzQkFBcUJRLElBQXJCLElBQTRCVCxNQUFNUyxJQUFOLENBQTVCLFFBRjJCO0FBQUEsR0FBMUIsRUFHSCxFQUhHLENBQVA7QUFJRCxDQUxEOztBQU9BLElBQU1DLGtCQUFrQixTQUFsQkEsZUFBa0IsR0FBc0M7QUFBQTs7QUFBQSxNQUFyQ1YsS0FBcUMsdUVBQTdCRixnQkFBNkI7QUFBQSxNQUFYYSxNQUFXOztBQUM1RDtBQUNBTixTQUFPQyxJQUFQLENBQVlOLEtBQVosRUFBbUJZLE9BQW5CLENBQTJCLGNBQU07QUFDL0IsUUFBTUMsa0JBQWtCLG9CQUFZYixNQUFNQyxFQUFOLENBQVosRUFBdUIsOEJBQVVBLEVBQVYsRUFBY1UsTUFBZCxDQUF2QixDQUF4QjtBQUNBWCxZQUFRLG1DQUFlQSxLQUFmLEVBQXNCQyxFQUF0QixFQUEwQlksZUFBMUIsQ0FBUjtBQUNELEdBSEQ7O0FBS0E7QUFDQSxTQUFPLHlHQUNhZCxtQkFEYixrREFFV0ssaUJBRlgsbUJBR0pOLGdCQUhJLEVBR2NFLEtBSGQsRUFHcUJXLE1BSHJCLENBQVA7QUFJRCxDQVpEOztBQWNBLFNBQVNHLFFBQVQsQ0FBa0JDLE1BQWxCLEVBQTBCOztBQUV4QjtBQUNBQSxTQUFPQyxNQUFQLEdBQWdCLFNBQVNBLE1BQVQsQ0FBZ0JDLGFBQWhCLEVBQStCO0FBQUE7O0FBRTdDO0FBQ0EsV0FBT0gsU0FBUyxZQUE2QjtBQUFBLFVBQTVCZCxLQUE0Qix1RUFBcEIsRUFBb0I7QUFBQSxVQUFoQlcsTUFBZ0IsdUVBQVAsRUFBTzs7QUFDekMsVUFBSU8sWUFBWSxNQUFLbEIsS0FBTCxFQUFZVyxNQUFaLENBQWhCOztBQUVBO0FBQ0FOLGFBQU9DLElBQVAsQ0FBWVksU0FBWixFQUF1Qk4sT0FBdkIsQ0FBK0IsY0FBTTtBQUNuQztBQUNBTSxvQkFBWSxtQ0FDVkEsU0FEVSxFQUVWakIsRUFGVSxFQUdWZ0IsY0FBY0MsVUFBVWpCLEVBQVYsQ0FBZCxFQUE2Qiw4QkFBVUEsRUFBVixFQUFjVSxNQUFkLENBQTdCLENBSFUsQ0FBWjtBQUtELE9BUEQ7O0FBU0EsYUFBT08sU0FBUDtBQUNELEtBZEksQ0FBUDtBQWdCRCxHQW5CRDs7QUFxQkEsU0FBT0gsTUFBUDtBQUNEOztrQkFFY0QsU0FBU0osZUFBVCxDIiwiZmlsZSI6InJvb3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2hhbmRsZUFjdGlvbnN9IGZyb20gJ3JlZHV4LWFjdGlvbnMnO1xuXG5pbXBvcnQge2FjdGlvbkZvciwgdXBkYXRlUHJvcGVydHl9IGZyb20gJy4uL2FjdGlvbnMvYWN0aW9uLXdyYXBwZXInO1xuaW1wb3J0IGNvcmVSZWR1Y2VyIGZyb20gJy4vY29yZSc7XG5cbmltcG9ydCB7XG4gIFJFR0lTVEVSX0VOVFJZLFxuICBERUxFVEVfRU5UUllcbn0gZnJvbSAnLi4vYWN0aW9ucy9pZGVudGl0eS1hY3Rpb25zJztcblxuaW1wb3J0IHtrZXBsZXJHbEluaXR9IGZyb20gJy4uL2FjdGlvbnMvYWN0aW9ucyc7XG4vKlxuICogdm95YWdlciByZWR1Y2VyIHdyYXBwZXIsXG4gKiB3cmFwcyBtdWx0aXBsZSB2b3lhZ2VyIHN0YXRlIGluIG9uZSB2b3lhZ2VyXG4gKi9cblxuLy8gSU5JVElBTF9TVEFURVxuY29uc3QgaW5pdGlhbENvcmVTdGF0ZSA9IHt9O1xuXG5jb25zdCBoYW5kbGVSZWdpc3RlckVudHJ5ID0gKHN0YXRlLCB7cGF5bG9hZDogaWR9KSA9PiAoe1xuICAvLyByZWdpc3RlciBhIG5ldyBlbnRyeSB0byB2b3lhZ2VyIHJlZHVjZXJcbiAgLi4uc3RhdGUsXG4gIFtpZF06IHtcbiAgICAuLi5jb3JlUmVkdWNlcih1bmRlZmluZWQsIGtlcGxlckdsSW5pdChpZCkpXG4gIH1cbn0pO1xuXG5jb25zdCBoYW5kbGVEZWxldGVFbnRyeSA9IChzdGF0ZSwge3BheWxvYWQ6IGlkfSkgPT4ge1xuICByZXR1cm4gT2JqZWN0LmtleXMoc3RhdGUpLnJlZHVjZSgoYWNjdSwgY3VycikgPT4gKHtcbiAgICAuLi5hY2N1LFxuICAgIC4uLihjdXJyID09PSBpZCA/IHt9IDoge1tjdXJyXTogc3RhdGVbY3Vycl19KVxuICB9KSwge30pO1xufTtcblxuY29uc3Qga2VwbGVyR2xSZWR1Y2VyID0gKHN0YXRlID0gaW5pdGlhbENvcmVTdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIC8vIHVwZGF0ZSBjaGlsZCBzdGF0ZXNcbiAgT2JqZWN0LmtleXMoc3RhdGUpLmZvckVhY2goaWQgPT4ge1xuICAgIGNvbnN0IHVwZGF0ZUl0ZW1TdGF0ZSA9IGNvcmVSZWR1Y2VyKHN0YXRlW2lkXSwgYWN0aW9uRm9yKGlkLCBhY3Rpb24pKTtcbiAgICBzdGF0ZSA9IHVwZGF0ZVByb3BlcnR5KHN0YXRlLCBpZCwgdXBkYXRlSXRlbVN0YXRlKTtcbiAgfSk7XG5cbiAgLy8gcGVyZm9ybSBhZGRpdGlvbmFsIHN0YXRlIHJlZHVjaW5nIChlLmcuIHN3aXRjaCBhY3Rpb24udHlwZSBldGMuLi4pXG4gIHJldHVybiBoYW5kbGVBY3Rpb25zKHtcbiAgICBbUkVHSVNURVJfRU5UUlldOiBoYW5kbGVSZWdpc3RlckVudHJ5LFxuICAgIFtERUxFVEVfRU5UUlldOiBoYW5kbGVEZWxldGVFbnRyeVxuICB9LCBpbml0aWFsQ29yZVN0YXRlKShzdGF0ZSwgYWN0aW9uKTtcbn07XG5cbmZ1bmN0aW9uIGRlY29yYXRlKHRhcmdldCkge1xuXG4gIC8vIHBsdWdpbiB0byBjb3JlIHJlZHVjZXJcbiAgdGFyZ2V0LnBsdWdpbiA9IGZ1bmN0aW9uIHBsdWdpbihjdXN0b21SZWR1Y2VyKSB7XG5cbiAgICAvLyB1c2UgJ2Z1bmN0aW9uJyBrZXl3b3JkIHRvIGVuYWJsZSAndGhpcydcbiAgICByZXR1cm4gZGVjb3JhdGUoKHN0YXRlID0ge30sIGFjdGlvbiA9IHt9KSA9PiB7XG4gICAgICAgIGxldCBuZXh0U3RhdGUgPSB0aGlzKHN0YXRlLCBhY3Rpb24pO1xuXG4gICAgICAgIC8vIGZvciBlYWNoIGVudHJ5IGluIHRoZSBzdGF0ZW5cbiAgICAgICAgT2JqZWN0LmtleXMobmV4dFN0YXRlKS5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgICAvLyB1cGRhdGUgY2hpbGQgc3RhdGVzXG4gICAgICAgICAgbmV4dFN0YXRlID0gdXBkYXRlUHJvcGVydHkoXG4gICAgICAgICAgICBuZXh0U3RhdGUsXG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIGN1c3RvbVJlZHVjZXIobmV4dFN0YXRlW2lkXSwgYWN0aW9uRm9yKGlkLCBhY3Rpb24pKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBuZXh0U3RhdGU7XG4gICAgICB9XG4gICAgKVxuICB9O1xuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlY29yYXRlKGtlcGxlckdsUmVkdWNlcik7XG4iXX0=