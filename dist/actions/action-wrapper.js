'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateProperty = exports.forwardTo = exports.actionFor = exports.unwrap = exports.isForwardAction = exports.wrapTo = exports.getActionForwardAddress = exports.ADDRESS_PREFIX = exports.FORWARD = undefined;

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _curry = require('curry');

var _curry2 = _interopRequireDefault(_curry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FORWARD = exports.FORWARD = '@redux-forward/FORWARD';
var ADDRESS_PREFIX = exports.ADDRESS_PREFIX = '@@KG_';

/*
 * wrap an action into a forward action
 *  A forward action looks like this:
 *
 *  {
 *    type: "@@kepler.gl/LAYER_CONFIG_CHANGE",
 *    payload: {
 *      type: '@@kepler.gl/LAYER_CONFIG_CHANGE',
 *      payload: {},
 *      meta: {}
 *    },
 *    meta: {
 *      forward: '@redux-forward/FORWARD',
 *      id: '@@KG_id'
 *    }
 *  };
 */

var getActionForwardAddress = exports.getActionForwardAddress = function getActionForwardAddress(id) {
  return '' + ADDRESS_PREFIX + id.toUpperCase();
};

var wrapTo = exports.wrapTo = (0, _curry2.default)(function (id, action) {
  return {
    // keep original action.type
    type: action.type,

    // actual action
    payload: action,

    // add forward signature to meta
    meta: (0, _extends4.default)({}, action.meta || {}, {
      _forward_: FORWARD,
      _id_: getActionForwardAddress(id)
    })
  };
});

var isForwardAction = exports.isForwardAction = function isForwardAction(action) {
  return action && action.meta && action.meta._forward_ === FORWARD;
};

var unwrap = exports.unwrap = function unwrap(action) {
  return isForwardAction(action) ? unwrap(action.payload) : action;
};

// given a id to forward to, returns the action for that id
var actionFor = exports.actionFor = function actionFor(id, action) {
  return isForwardAction(action) ? action.meta._id_ === getActionForwardAddress(id) ? action.payload : {} : action;
};

// returns a new dispatch that wraps and forwards the actions with the given id
var forwardTo = exports.forwardTo = function forwardTo(id, dispatch) {
  return function (action) {
    return dispatch(wrapTo(id, action));
  };
};

var updateProperty = exports.updateProperty = function updateProperty(state, id, value) {
  var _extends2;

  return state[id] === value ? state : (0, _extends4.default)({}, state, (_extends2 = {}, _extends2[id] = value, _extends2));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2FjdGlvbi13cmFwcGVyLmpzIl0sIm5hbWVzIjpbIkZPUldBUkQiLCJBRERSRVNTX1BSRUZJWCIsImdldEFjdGlvbkZvcndhcmRBZGRyZXNzIiwiaWQiLCJ0b1VwcGVyQ2FzZSIsIndyYXBUbyIsImFjdGlvbiIsInR5cGUiLCJwYXlsb2FkIiwibWV0YSIsIl9mb3J3YXJkXyIsIl9pZF8iLCJpc0ZvcndhcmRBY3Rpb24iLCJ1bndyYXAiLCJhY3Rpb25Gb3IiLCJmb3J3YXJkVG8iLCJkaXNwYXRjaCIsInVwZGF0ZVByb3BlcnR5Iiwic3RhdGUiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFHQTs7Ozs7O0FBSE8sSUFBTUEsNEJBQVUsd0JBQWhCO0FBQ0EsSUFBTUMsMENBQWlCLE9BQXZCOztBQUlQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQk8sSUFBTUMsNERBQTBCLFNBQTFCQSx1QkFBMEI7QUFBQSxjQUNsQ0QsY0FEa0MsR0FDakJFLEdBQUdDLFdBQUgsRUFEaUI7QUFBQSxDQUFoQzs7QUFHQSxJQUFNQywwQkFBUyxxQkFBTSxVQUFDRixFQUFELEVBQUtHLE1BQUw7QUFBQSxTQUFpQjtBQUMzQztBQUNBQyxVQUFNRCxPQUFPQyxJQUY4Qjs7QUFJM0M7QUFDQUMsYUFBU0YsTUFMa0M7O0FBTzNDO0FBQ0FHLHFDQUNNSCxPQUFPRyxJQUFQLElBQWUsRUFEckI7QUFFRUMsaUJBQVdWLE9BRmI7QUFHRVcsWUFBTVQsd0JBQXdCQyxFQUF4QjtBQUhSO0FBUjJDLEdBQWpCO0FBQUEsQ0FBTixDQUFmOztBQWVBLElBQU1TLDRDQUFrQixTQUFsQkEsZUFBa0IsU0FBVTtBQUN2QyxTQUFPTixVQUFVQSxPQUFPRyxJQUFqQixJQUF5QkgsT0FBT0csSUFBUCxDQUFZQyxTQUFaLEtBQTBCVixPQUExRDtBQUNELENBRk07O0FBSUEsSUFBTWEsMEJBQVMsU0FBVEEsTUFBUztBQUFBLFNBQ3BCRCxnQkFBZ0JOLE1BQWhCLElBQTBCTyxPQUFPUCxPQUFPRSxPQUFkLENBQTFCLEdBQW1ERixNQUQvQjtBQUFBLENBQWY7O0FBR1A7QUFDTyxJQUFNUSxnQ0FBWSxTQUFaQSxTQUFZLENBQUNYLEVBQUQsRUFBS0csTUFBTDtBQUFBLFNBQ3ZCTSxnQkFBZ0JOLE1BQWhCLElBQ0lBLE9BQU9HLElBQVAsQ0FBWUUsSUFBWixLQUFxQlQsd0JBQXdCQyxFQUF4QixDQUFyQixHQUFtREcsT0FBT0UsT0FBMUQsR0FBb0UsRUFEeEUsR0FFSUYsTUFIbUI7QUFBQSxDQUFsQjs7QUFLUDtBQUNPLElBQU1TLGdDQUFZLFNBQVpBLFNBQVksQ0FBQ1osRUFBRCxFQUFLYSxRQUFMO0FBQUEsU0FBa0I7QUFBQSxXQUN6Q0EsU0FBU1gsT0FBT0YsRUFBUCxFQUFXRyxNQUFYLENBQVQsQ0FEeUM7QUFBQSxHQUFsQjtBQUFBLENBQWxCOztBQUdBLElBQU1XLDBDQUFpQixTQUFqQkEsY0FBaUIsQ0FBQ0MsS0FBRCxFQUFRZixFQUFSLEVBQVlnQixLQUFaO0FBQUE7O0FBQUEsU0FDNUJELE1BQU1mLEVBQU4sTUFBY2dCLEtBQWQsR0FDSUQsS0FESiw4QkFHU0EsS0FIVCw2QkFJT2YsRUFKUCxJQUlZZ0IsS0FKWixhQUQ0QjtBQUFBLENBQXZCIiwiZmlsZSI6ImFjdGlvbi13cmFwcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IEZPUldBUkQgPSAnQHJlZHV4LWZvcndhcmQvRk9SV0FSRCc7XG5leHBvcnQgY29uc3QgQUREUkVTU19QUkVGSVggPSAnQEBLR18nO1xuXG5pbXBvcnQgY3VycnkgZnJvbSAnY3VycnknO1xuXG4vKlxuICogd3JhcCBhbiBhY3Rpb24gaW50byBhIGZvcndhcmQgYWN0aW9uXG4gKiAgQSBmb3J3YXJkIGFjdGlvbiBsb29rcyBsaWtlIHRoaXM6XG4gKlxuICogIHtcbiAqICAgIHR5cGU6IFwiQEBrZXBsZXIuZ2wvTEFZRVJfQ09ORklHX0NIQU5HRVwiLFxuICogICAgcGF5bG9hZDoge1xuICogICAgICB0eXBlOiAnQEBrZXBsZXIuZ2wvTEFZRVJfQ09ORklHX0NIQU5HRScsXG4gKiAgICAgIHBheWxvYWQ6IHt9LFxuICogICAgICBtZXRhOiB7fVxuICogICAgfSxcbiAqICAgIG1ldGE6IHtcbiAqICAgICAgZm9yd2FyZDogJ0ByZWR1eC1mb3J3YXJkL0ZPUldBUkQnLFxuICogICAgICBpZDogJ0BAS0dfaWQnXG4gKiAgICB9XG4gKiAgfTtcbiAqL1xuXG5leHBvcnQgY29uc3QgZ2V0QWN0aW9uRm9yd2FyZEFkZHJlc3MgPSBpZCA9PlxuICBgJHtBRERSRVNTX1BSRUZJWH0ke2lkLnRvVXBwZXJDYXNlKCl9YDtcblxuZXhwb3J0IGNvbnN0IHdyYXBUbyA9IGN1cnJ5KChpZCwgYWN0aW9uKSA9PiAoe1xuICAvLyBrZWVwIG9yaWdpbmFsIGFjdGlvbi50eXBlXG4gIHR5cGU6IGFjdGlvbi50eXBlLFxuXG4gIC8vIGFjdHVhbCBhY3Rpb25cbiAgcGF5bG9hZDogYWN0aW9uLFxuXG4gIC8vIGFkZCBmb3J3YXJkIHNpZ25hdHVyZSB0byBtZXRhXG4gIG1ldGE6IHtcbiAgICAuLi4oYWN0aW9uLm1ldGEgfHwge30pLFxuICAgIF9mb3J3YXJkXzogRk9SV0FSRCxcbiAgICBfaWRfOiBnZXRBY3Rpb25Gb3J3YXJkQWRkcmVzcyhpZClcbiAgfVxufSkpO1xuXG5leHBvcnQgY29uc3QgaXNGb3J3YXJkQWN0aW9uID0gYWN0aW9uID0+IHtcbiAgcmV0dXJuIGFjdGlvbiAmJiBhY3Rpb24ubWV0YSAmJiBhY3Rpb24ubWV0YS5fZm9yd2FyZF8gPT09IEZPUldBUkQ7XG59O1xuXG5leHBvcnQgY29uc3QgdW53cmFwID0gYWN0aW9uID0+XG4gIGlzRm9yd2FyZEFjdGlvbihhY3Rpb24pID8gdW53cmFwKGFjdGlvbi5wYXlsb2FkKSA6IGFjdGlvbjtcblxuLy8gZ2l2ZW4gYSBpZCB0byBmb3J3YXJkIHRvLCByZXR1cm5zIHRoZSBhY3Rpb24gZm9yIHRoYXQgaWRcbmV4cG9ydCBjb25zdCBhY3Rpb25Gb3IgPSAoaWQsIGFjdGlvbikgPT5cbiAgaXNGb3J3YXJkQWN0aW9uKGFjdGlvbilcbiAgICA/IGFjdGlvbi5tZXRhLl9pZF8gPT09IGdldEFjdGlvbkZvcndhcmRBZGRyZXNzKGlkKSA/IGFjdGlvbi5wYXlsb2FkIDoge31cbiAgICA6IGFjdGlvbjtcblxuLy8gcmV0dXJucyBhIG5ldyBkaXNwYXRjaCB0aGF0IHdyYXBzIGFuZCBmb3J3YXJkcyB0aGUgYWN0aW9ucyB3aXRoIHRoZSBnaXZlbiBpZFxuZXhwb3J0IGNvbnN0IGZvcndhcmRUbyA9IChpZCwgZGlzcGF0Y2gpID0+IGFjdGlvbiA9PlxuICBkaXNwYXRjaCh3cmFwVG8oaWQsIGFjdGlvbikpO1xuXG5leHBvcnQgY29uc3QgdXBkYXRlUHJvcGVydHkgPSAoc3RhdGUsIGlkLCB2YWx1ZSkgPT5cbiAgc3RhdGVbaWRdID09PSB2YWx1ZVxuICAgID8gc3RhdGVcbiAgICA6IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIFtpZF06IHZhbHVlXG4gICAgICB9O1xuIl19