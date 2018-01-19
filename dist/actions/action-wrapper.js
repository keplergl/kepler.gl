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
 *      meta: {
 *        // other meta,
 *        _id_: id
 *      }
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
    payload: (0, _extends4.default)({}, action, {
      meta: (0, _extends4.default)({}, action.meta, {
        _id_: id
      })
    }),

    // add forward signature to meta
    meta: (0, _extends4.default)({}, action.meta || {}, {
      _forward_: FORWARD,
      _addr_: getActionForwardAddress(id)
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
  return isForwardAction(action) ? action.meta._addr_ === getActionForwardAddress(id) ? action.payload : {} : action;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2FjdGlvbi13cmFwcGVyLmpzIl0sIm5hbWVzIjpbIkZPUldBUkQiLCJBRERSRVNTX1BSRUZJWCIsImdldEFjdGlvbkZvcndhcmRBZGRyZXNzIiwiaWQiLCJ0b1VwcGVyQ2FzZSIsIndyYXBUbyIsImFjdGlvbiIsInR5cGUiLCJwYXlsb2FkIiwibWV0YSIsIl9pZF8iLCJfZm9yd2FyZF8iLCJfYWRkcl8iLCJpc0ZvcndhcmRBY3Rpb24iLCJ1bndyYXAiLCJhY3Rpb25Gb3IiLCJmb3J3YXJkVG8iLCJkaXNwYXRjaCIsInVwZGF0ZVByb3BlcnR5Iiwic3RhdGUiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFHQTs7Ozs7O0FBSE8sSUFBTUEsNEJBQVUsd0JBQWhCO0FBQ0EsSUFBTUMsMENBQWlCLE9BQXZCOztBQUlQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQk8sSUFBTUMsNERBQTBCLFNBQTFCQSx1QkFBMEI7QUFBQSxjQUNsQ0QsY0FEa0MsR0FDakJFLEdBQUdDLFdBQUgsRUFEaUI7QUFBQSxDQUFoQzs7QUFHQSxJQUFNQywwQkFBUyxxQkFBTSxVQUFDRixFQUFELEVBQUtHLE1BQUw7QUFBQSxTQUFpQjtBQUMzQztBQUNBQyxVQUFNRCxPQUFPQyxJQUY4Qjs7QUFJM0M7QUFDQUMsd0NBQ0tGLE1BREw7QUFFRUcsdUNBQ0tILE9BQU9HLElBRFo7QUFFRUMsY0FBTVA7QUFGUjtBQUZGLE1BTDJDOztBQWEzQztBQUNBTSxxQ0FDTUgsT0FBT0csSUFBUCxJQUFlLEVBRHJCO0FBRUVFLGlCQUFXWCxPQUZiO0FBR0VZLGNBQVFWLHdCQUF3QkMsRUFBeEI7QUFIVjtBQWQyQyxHQUFqQjtBQUFBLENBQU4sQ0FBZjs7QUFxQkEsSUFBTVUsNENBQWtCLFNBQWxCQSxlQUFrQixTQUFVO0FBQ3ZDLFNBQU9QLFVBQVVBLE9BQU9HLElBQWpCLElBQXlCSCxPQUFPRyxJQUFQLENBQVlFLFNBQVosS0FBMEJYLE9BQTFEO0FBQ0QsQ0FGTTs7QUFJQSxJQUFNYywwQkFBUyxTQUFUQSxNQUFTO0FBQUEsU0FDcEJELGdCQUFnQlAsTUFBaEIsSUFBMEJRLE9BQU9SLE9BQU9FLE9BQWQsQ0FBMUIsR0FBbURGLE1BRC9CO0FBQUEsQ0FBZjs7QUFHUDtBQUNPLElBQU1TLGdDQUFZLFNBQVpBLFNBQVksQ0FBQ1osRUFBRCxFQUFLRyxNQUFMO0FBQUEsU0FDdkJPLGdCQUFnQlAsTUFBaEIsSUFDSUEsT0FBT0csSUFBUCxDQUFZRyxNQUFaLEtBQXVCVix3QkFBd0JDLEVBQXhCLENBQXZCLEdBQXFERyxPQUFPRSxPQUE1RCxHQUFzRSxFQUQxRSxHQUVJRixNQUhtQjtBQUFBLENBQWxCOztBQUtQO0FBQ08sSUFBTVUsZ0NBQVksU0FBWkEsU0FBWSxDQUFDYixFQUFELEVBQUtjLFFBQUw7QUFBQSxTQUFrQjtBQUFBLFdBQ3pDQSxTQUFTWixPQUFPRixFQUFQLEVBQVdHLE1BQVgsQ0FBVCxDQUR5QztBQUFBLEdBQWxCO0FBQUEsQ0FBbEI7O0FBR0EsSUFBTVksMENBQWlCLFNBQWpCQSxjQUFpQixDQUFDQyxLQUFELEVBQVFoQixFQUFSLEVBQVlpQixLQUFaO0FBQUE7O0FBQUEsU0FDNUJELE1BQU1oQixFQUFOLE1BQWNpQixLQUFkLEdBQ0lELEtBREosOEJBR1NBLEtBSFQsNkJBSU9oQixFQUpQLElBSVlpQixLQUpaLGFBRDRCO0FBQUEsQ0FBdkIiLCJmaWxlIjoiYWN0aW9uLXdyYXBwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgRk9SV0FSRCA9ICdAcmVkdXgtZm9yd2FyZC9GT1JXQVJEJztcbmV4cG9ydCBjb25zdCBBRERSRVNTX1BSRUZJWCA9ICdAQEtHXyc7XG5cbmltcG9ydCBjdXJyeSBmcm9tICdjdXJyeSc7XG5cbi8qXG4gKiB3cmFwIGFuIGFjdGlvbiBpbnRvIGEgZm9yd2FyZCBhY3Rpb25cbiAqICBBIGZvcndhcmQgYWN0aW9uIGxvb2tzIGxpa2UgdGhpczpcbiAqXG4gKiAge1xuICogICAgdHlwZTogXCJAQGtlcGxlci5nbC9MQVlFUl9DT05GSUdfQ0hBTkdFXCIsXG4gKiAgICBwYXlsb2FkOiB7XG4gKiAgICAgIHR5cGU6ICdAQGtlcGxlci5nbC9MQVlFUl9DT05GSUdfQ0hBTkdFJyxcbiAqICAgICAgcGF5bG9hZDoge30sXG4gKiAgICAgIG1ldGE6IHtcbiAqICAgICAgICAvLyBvdGhlciBtZXRhLFxuICogICAgICAgIF9pZF86IGlkXG4gKiAgICAgIH1cbiAqICAgIH0sXG4gKiAgICBtZXRhOiB7XG4gKiAgICAgIGZvcndhcmQ6ICdAcmVkdXgtZm9yd2FyZC9GT1JXQVJEJyxcbiAqICAgICAgaWQ6ICdAQEtHX2lkJ1xuICogICAgfVxuICogIH07XG4gKi9cblxuZXhwb3J0IGNvbnN0IGdldEFjdGlvbkZvcndhcmRBZGRyZXNzID0gaWQgPT5cbiAgYCR7QUREUkVTU19QUkVGSVh9JHtpZC50b1VwcGVyQ2FzZSgpfWA7XG5cbmV4cG9ydCBjb25zdCB3cmFwVG8gPSBjdXJyeSgoaWQsIGFjdGlvbikgPT4gKHtcbiAgLy8ga2VlcCBvcmlnaW5hbCBhY3Rpb24udHlwZVxuICB0eXBlOiBhY3Rpb24udHlwZSxcblxuICAvLyBhY3R1YWwgYWN0aW9uXG4gIHBheWxvYWQ6IHtcbiAgICAuLi5hY3Rpb24sXG4gICAgbWV0YToge1xuICAgICAgLi4uYWN0aW9uLm1ldGEsXG4gICAgICBfaWRfOiBpZFxuICAgIH1cbiAgfSxcblxuICAvLyBhZGQgZm9yd2FyZCBzaWduYXR1cmUgdG8gbWV0YVxuICBtZXRhOiB7XG4gICAgLi4uKGFjdGlvbi5tZXRhIHx8IHt9KSxcbiAgICBfZm9yd2FyZF86IEZPUldBUkQsXG4gICAgX2FkZHJfOiBnZXRBY3Rpb25Gb3J3YXJkQWRkcmVzcyhpZClcbiAgfVxufSkpO1xuXG5leHBvcnQgY29uc3QgaXNGb3J3YXJkQWN0aW9uID0gYWN0aW9uID0+IHtcbiAgcmV0dXJuIGFjdGlvbiAmJiBhY3Rpb24ubWV0YSAmJiBhY3Rpb24ubWV0YS5fZm9yd2FyZF8gPT09IEZPUldBUkQ7XG59O1xuXG5leHBvcnQgY29uc3QgdW53cmFwID0gYWN0aW9uID0+XG4gIGlzRm9yd2FyZEFjdGlvbihhY3Rpb24pID8gdW53cmFwKGFjdGlvbi5wYXlsb2FkKSA6IGFjdGlvbjtcblxuLy8gZ2l2ZW4gYSBpZCB0byBmb3J3YXJkIHRvLCByZXR1cm5zIHRoZSBhY3Rpb24gZm9yIHRoYXQgaWRcbmV4cG9ydCBjb25zdCBhY3Rpb25Gb3IgPSAoaWQsIGFjdGlvbikgPT5cbiAgaXNGb3J3YXJkQWN0aW9uKGFjdGlvbilcbiAgICA/IGFjdGlvbi5tZXRhLl9hZGRyXyA9PT0gZ2V0QWN0aW9uRm9yd2FyZEFkZHJlc3MoaWQpID8gYWN0aW9uLnBheWxvYWQgOiB7fVxuICAgIDogYWN0aW9uO1xuXG4vLyByZXR1cm5zIGEgbmV3IGRpc3BhdGNoIHRoYXQgd3JhcHMgYW5kIGZvcndhcmRzIHRoZSBhY3Rpb25zIHdpdGggdGhlIGdpdmVuIGlkXG5leHBvcnQgY29uc3QgZm9yd2FyZFRvID0gKGlkLCBkaXNwYXRjaCkgPT4gYWN0aW9uID0+XG4gIGRpc3BhdGNoKHdyYXBUbyhpZCwgYWN0aW9uKSk7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVQcm9wZXJ0eSA9IChzdGF0ZSwgaWQsIHZhbHVlKSA9PlxuICBzdGF0ZVtpZF0gPT09IHZhbHVlXG4gICAgPyBzdGF0ZVxuICAgIDoge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgW2lkXTogdmFsdWVcbiAgICAgIH07XG4iXX0=