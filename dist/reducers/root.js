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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9yb290LmpzIl0sIm5hbWVzIjpbImluaXRpYWxDb3JlU3RhdGUiLCJoYW5kbGVSZWdpc3RlckVudHJ5Iiwic3RhdGUiLCJpZCIsInBheWxvYWQiLCJ1bmRlZmluZWQiLCJoYW5kbGVEZWxldGVFbnRyeSIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhY2N1IiwiY3VyciIsImtlcGxlckdsUmVkdWNlciIsImFjdGlvbiIsImZvckVhY2giLCJ1cGRhdGVJdGVtU3RhdGUiLCJkZWNvcmF0ZSIsInRhcmdldCIsInBsdWdpbiIsImN1c3RvbVJlZHVjZXIiLCJuZXh0U3RhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7OztBQUVBOztBQUVBOzs7O0FBQ0E7Ozs7O0FBS0E7QUFDQSxJQUFNQSxtQkFBbUIsRUFBekI7O0FBRUEsSUFBTUMsc0JBQXNCLFNBQXRCQSxtQkFBc0IsQ0FBQ0MsS0FBRDtBQUFBOztBQUFBLE1BQWtCQyxFQUFsQixRQUFTQyxPQUFUO0FBQUEsb0NBRXZCRixLQUZ1Qiw2QkFHekJDLEVBSHlCLCtCQUlyQixvQkFBWUUsU0FBWixFQUF1QiwyQkFBYUYsRUFBYixDQUF2QixDQUpxQjtBQUFBLENBQTVCOztBQVFBLElBQU1HLG9CQUFvQixTQUFwQkEsaUJBQW9CLENBQUNKLEtBQUQsU0FBMEI7QUFBQSxNQUFSQyxFQUFRLFNBQWpCQyxPQUFpQjs7QUFDbEQsU0FBT0csT0FBT0MsSUFBUCxDQUFZTixLQUFaLEVBQW1CTyxNQUFuQixDQUNMLFVBQUNDLElBQUQsRUFBT0MsSUFBUDtBQUFBOztBQUFBLHNDQUNLRCxJQURMLEVBRU1DLFNBQVNSLEVBQVQsR0FBYyxFQUFkLHNCQUFxQlEsSUFBckIsSUFBNEJULE1BQU1TLElBQU4sQ0FBNUIsUUFGTjtBQUFBLEdBREssRUFLTCxFQUxLLENBQVA7QUFPRCxDQVJEOztBQVVBLElBQU1DLGtCQUFrQixTQUFsQkEsZUFBa0IsR0FBc0M7QUFBQTs7QUFBQSxNQUFyQ1YsS0FBcUMsdUVBQTdCRixnQkFBNkI7QUFBQSxNQUFYYSxNQUFXOztBQUM1RDtBQUNBTixTQUFPQyxJQUFQLENBQVlOLEtBQVosRUFBbUJZLE9BQW5CLENBQTJCLGNBQU07QUFDL0IsUUFBTUMsa0JBQWtCLG9CQUFZYixNQUFNQyxFQUFOLENBQVosRUFBdUIsOEJBQVVBLEVBQVYsRUFBY1UsTUFBZCxDQUF2QixDQUF4QjtBQUNBWCxZQUFRLG1DQUFlQSxLQUFmLEVBQXNCQyxFQUF0QixFQUEwQlksZUFBMUIsQ0FBUjtBQUNELEdBSEQ7O0FBS0E7QUFDQSxTQUFPLHlHQUVlZCxtQkFGZixrREFHYUssaUJBSGIsbUJBS0xOLGdCQUxLLEVBTUxFLEtBTkssRUFNRVcsTUFORixDQUFQO0FBT0QsQ0FmRDs7QUFpQkEsU0FBU0csUUFBVCxDQUFrQkMsTUFBbEIsRUFBMEI7QUFDeEI7QUFDQUEsU0FBT0MsTUFBUCxHQUFnQixTQUFTQSxNQUFULENBQWdCQyxhQUFoQixFQUErQjtBQUFBOztBQUM3QztBQUNBLFdBQU9ILFNBQVMsWUFBNkI7QUFBQSxVQUE1QmQsS0FBNEIsdUVBQXBCLEVBQW9CO0FBQUEsVUFBaEJXLE1BQWdCLHVFQUFQLEVBQU87O0FBQzNDLFVBQUlPLFlBQVksTUFBS2xCLEtBQUwsRUFBWVcsTUFBWixDQUFoQjs7QUFFQTtBQUNBTixhQUFPQyxJQUFQLENBQVlZLFNBQVosRUFBdUJOLE9BQXZCLENBQStCLGNBQU07QUFDbkM7QUFDQU0sb0JBQVksbUNBQ1ZBLFNBRFUsRUFFVmpCLEVBRlUsRUFHVmdCLGNBQWNDLFVBQVVqQixFQUFWLENBQWQsRUFBNkIsOEJBQVVBLEVBQVYsRUFBY1UsTUFBZCxDQUE3QixDQUhVLENBQVo7QUFLRCxPQVBEOztBQVNBLGFBQU9PLFNBQVA7QUFDRCxLQWRNLENBQVA7QUFlRCxHQWpCRDs7QUFtQkEsU0FBT0gsTUFBUDtBQUNEOztrQkFFY0QsU0FBU0osZUFBVCxDIiwiZmlsZSI6InJvb3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2hhbmRsZUFjdGlvbnN9IGZyb20gJ3JlZHV4LWFjdGlvbnMnO1xuXG5pbXBvcnQge2FjdGlvbkZvciwgdXBkYXRlUHJvcGVydHl9IGZyb20gJy4uL2FjdGlvbnMvYWN0aW9uLXdyYXBwZXInO1xuaW1wb3J0IGNvcmVSZWR1Y2VyIGZyb20gJy4vY29yZSc7XG5cbmltcG9ydCB7UkVHSVNURVJfRU5UUlksIERFTEVURV9FTlRSWX0gZnJvbSAnLi4vYWN0aW9ucy9pZGVudGl0eS1hY3Rpb25zJztcblxuaW1wb3J0IHtrZXBsZXJHbEluaXR9IGZyb20gJy4uL2FjdGlvbnMvYWN0aW9ucyc7XG4vKlxuICogdm95YWdlciByZWR1Y2VyIHdyYXBwZXIsXG4gKiB3cmFwcyBtdWx0aXBsZSB2b3lhZ2VyIHN0YXRlIGluIG9uZSB2b3lhZ2VyXG4gKi9cblxuLy8gSU5JVElBTF9TVEFURVxuY29uc3QgaW5pdGlhbENvcmVTdGF0ZSA9IHt9O1xuXG5jb25zdCBoYW5kbGVSZWdpc3RlckVudHJ5ID0gKHN0YXRlLCB7cGF5bG9hZDogaWR9KSA9PiAoe1xuICAvLyByZWdpc3RlciBhIG5ldyBlbnRyeSB0byB2b3lhZ2VyIHJlZHVjZXJcbiAgLi4uc3RhdGUsXG4gIFtpZF06IHtcbiAgICAuLi5jb3JlUmVkdWNlcih1bmRlZmluZWQsIGtlcGxlckdsSW5pdChpZCkpXG4gIH1cbn0pO1xuXG5jb25zdCBoYW5kbGVEZWxldGVFbnRyeSA9IChzdGF0ZSwge3BheWxvYWQ6IGlkfSkgPT4ge1xuICByZXR1cm4gT2JqZWN0LmtleXMoc3RhdGUpLnJlZHVjZShcbiAgICAoYWNjdSwgY3VycikgPT4gKHtcbiAgICAgIC4uLmFjY3UsXG4gICAgICAuLi4oY3VyciA9PT0gaWQgPyB7fSA6IHtbY3Vycl06IHN0YXRlW2N1cnJdfSlcbiAgICB9KSxcbiAgICB7fVxuICApO1xufTtcblxuY29uc3Qga2VwbGVyR2xSZWR1Y2VyID0gKHN0YXRlID0gaW5pdGlhbENvcmVTdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIC8vIHVwZGF0ZSBjaGlsZCBzdGF0ZXNcbiAgT2JqZWN0LmtleXMoc3RhdGUpLmZvckVhY2goaWQgPT4ge1xuICAgIGNvbnN0IHVwZGF0ZUl0ZW1TdGF0ZSA9IGNvcmVSZWR1Y2VyKHN0YXRlW2lkXSwgYWN0aW9uRm9yKGlkLCBhY3Rpb24pKTtcbiAgICBzdGF0ZSA9IHVwZGF0ZVByb3BlcnR5KHN0YXRlLCBpZCwgdXBkYXRlSXRlbVN0YXRlKTtcbiAgfSk7XG5cbiAgLy8gcGVyZm9ybSBhZGRpdGlvbmFsIHN0YXRlIHJlZHVjaW5nIChlLmcuIHN3aXRjaCBhY3Rpb24udHlwZSBldGMuLi4pXG4gIHJldHVybiBoYW5kbGVBY3Rpb25zKFxuICAgIHtcbiAgICAgIFtSRUdJU1RFUl9FTlRSWV06IGhhbmRsZVJlZ2lzdGVyRW50cnksXG4gICAgICBbREVMRVRFX0VOVFJZXTogaGFuZGxlRGVsZXRlRW50cnlcbiAgICB9LFxuICAgIGluaXRpYWxDb3JlU3RhdGVcbiAgKShzdGF0ZSwgYWN0aW9uKTtcbn07XG5cbmZ1bmN0aW9uIGRlY29yYXRlKHRhcmdldCkge1xuICAvLyBwbHVnaW4gdG8gY29yZSByZWR1Y2VyXG4gIHRhcmdldC5wbHVnaW4gPSBmdW5jdGlvbiBwbHVnaW4oY3VzdG9tUmVkdWNlcikge1xuICAgIC8vIHVzZSAnZnVuY3Rpb24nIGtleXdvcmQgdG8gZW5hYmxlICd0aGlzJ1xuICAgIHJldHVybiBkZWNvcmF0ZSgoc3RhdGUgPSB7fSwgYWN0aW9uID0ge30pID0+IHtcbiAgICAgIGxldCBuZXh0U3RhdGUgPSB0aGlzKHN0YXRlLCBhY3Rpb24pO1xuXG4gICAgICAvLyBmb3IgZWFjaCBlbnRyeSBpbiB0aGUgc3RhdGVuXG4gICAgICBPYmplY3Qua2V5cyhuZXh0U3RhdGUpLmZvckVhY2goaWQgPT4ge1xuICAgICAgICAvLyB1cGRhdGUgY2hpbGQgc3RhdGVzXG4gICAgICAgIG5leHRTdGF0ZSA9IHVwZGF0ZVByb3BlcnR5KFxuICAgICAgICAgIG5leHRTdGF0ZSxcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjdXN0b21SZWR1Y2VyKG5leHRTdGF0ZVtpZF0sIGFjdGlvbkZvcihpZCwgYWN0aW9uKSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlY29yYXRlKGtlcGxlckdsUmVkdWNlcik7XG4iXX0=