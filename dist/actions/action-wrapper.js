'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateProperty = exports.forwardTo = exports.actionFor = exports.unwrap = exports.isForwardAction = exports.wrapTo = exports.getActionForwardAddress = exports.ADDRESS_PREFIX = exports.FORWARD = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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
  return state[id] === value ? state : (0, _extends4.default)({}, state, (0, _defineProperty3.default)({}, id, value));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2FjdGlvbi13cmFwcGVyLmpzIl0sIm5hbWVzIjpbIkZPUldBUkQiLCJBRERSRVNTX1BSRUZJWCIsImdldEFjdGlvbkZvcndhcmRBZGRyZXNzIiwiaWQiLCJ0b1VwcGVyQ2FzZSIsIndyYXBUbyIsImFjdGlvbiIsInR5cGUiLCJwYXlsb2FkIiwibWV0YSIsIl9pZF8iLCJfZm9yd2FyZF8iLCJfYWRkcl8iLCJpc0ZvcndhcmRBY3Rpb24iLCJ1bndyYXAiLCJhY3Rpb25Gb3IiLCJmb3J3YXJkVG8iLCJkaXNwYXRjaCIsInVwZGF0ZVByb3BlcnR5Iiwic3RhdGUiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7Ozs7OztBQUhPLElBQU1BLDRCQUFVLHdCQUFoQjtBQUNBLElBQU1DLDBDQUFpQixPQUF2Qjs7QUFJUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJPLElBQU1DLDREQUEwQixTQUExQkEsdUJBQTBCO0FBQUEsY0FDbENELGNBRGtDLEdBQ2pCRSxHQUFHQyxXQUFILEVBRGlCO0FBQUEsQ0FBaEM7O0FBR0EsSUFBTUMsMEJBQVMscUJBQU0sVUFBQ0YsRUFBRCxFQUFLRyxNQUFMO0FBQUEsU0FBaUI7QUFDM0M7QUFDQUMsVUFBTUQsT0FBT0MsSUFGOEI7O0FBSTNDO0FBQ0FDLHdDQUNLRixNQURMO0FBRUVHLHVDQUNLSCxPQUFPRyxJQURaO0FBRUVDLGNBQU1QO0FBRlI7QUFGRixNQUwyQzs7QUFhM0M7QUFDQU0scUNBQ01ILE9BQU9HLElBQVAsSUFBZSxFQURyQjtBQUVFRSxpQkFBV1gsT0FGYjtBQUdFWSxjQUFRVix3QkFBd0JDLEVBQXhCO0FBSFY7QUFkMkMsR0FBakI7QUFBQSxDQUFOLENBQWY7O0FBcUJBLElBQU1VLDRDQUFrQixTQUFsQkEsZUFBa0IsU0FBVTtBQUN2QyxTQUFPUCxVQUFVQSxPQUFPRyxJQUFqQixJQUF5QkgsT0FBT0csSUFBUCxDQUFZRSxTQUFaLEtBQTBCWCxPQUExRDtBQUNELENBRk07O0FBSUEsSUFBTWMsMEJBQVMsU0FBVEEsTUFBUztBQUFBLFNBQ3BCRCxnQkFBZ0JQLE1BQWhCLElBQTBCUSxPQUFPUixPQUFPRSxPQUFkLENBQTFCLEdBQW1ERixNQUQvQjtBQUFBLENBQWY7O0FBR1A7QUFDTyxJQUFNUyxnQ0FBWSxTQUFaQSxTQUFZLENBQUNaLEVBQUQsRUFBS0csTUFBTDtBQUFBLFNBQ3ZCTyxnQkFBZ0JQLE1BQWhCLElBQ0lBLE9BQU9HLElBQVAsQ0FBWUcsTUFBWixLQUF1QlYsd0JBQXdCQyxFQUF4QixDQUF2QixHQUFxREcsT0FBT0UsT0FBNUQsR0FBc0UsRUFEMUUsR0FFSUYsTUFIbUI7QUFBQSxDQUFsQjs7QUFLUDtBQUNPLElBQU1VLGdDQUFZLFNBQVpBLFNBQVksQ0FBQ2IsRUFBRCxFQUFLYyxRQUFMO0FBQUEsU0FBa0I7QUFBQSxXQUN6Q0EsU0FBU1osT0FBT0YsRUFBUCxFQUFXRyxNQUFYLENBQVQsQ0FEeUM7QUFBQSxHQUFsQjtBQUFBLENBQWxCOztBQUdBLElBQU1ZLDBDQUFpQixTQUFqQkEsY0FBaUIsQ0FBQ0MsS0FBRCxFQUFRaEIsRUFBUixFQUFZaUIsS0FBWjtBQUFBLFNBQzVCRCxNQUFNaEIsRUFBTixNQUFjaUIsS0FBZCxHQUNJRCxLQURKLDhCQUdTQSxLQUhULG9DQUlPaEIsRUFKUCxFQUlZaUIsS0FKWixFQUQ0QjtBQUFBLENBQXZCIiwiZmlsZSI6ImFjdGlvbi13cmFwcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IEZPUldBUkQgPSAnQHJlZHV4LWZvcndhcmQvRk9SV0FSRCc7XG5leHBvcnQgY29uc3QgQUREUkVTU19QUkVGSVggPSAnQEBLR18nO1xuXG5pbXBvcnQgY3VycnkgZnJvbSAnY3VycnknO1xuXG4vKlxuICogd3JhcCBhbiBhY3Rpb24gaW50byBhIGZvcndhcmQgYWN0aW9uXG4gKiAgQSBmb3J3YXJkIGFjdGlvbiBsb29rcyBsaWtlIHRoaXM6XG4gKlxuICogIHtcbiAqICAgIHR5cGU6IFwiQEBrZXBsZXIuZ2wvTEFZRVJfQ09ORklHX0NIQU5HRVwiLFxuICogICAgcGF5bG9hZDoge1xuICogICAgICB0eXBlOiAnQEBrZXBsZXIuZ2wvTEFZRVJfQ09ORklHX0NIQU5HRScsXG4gKiAgICAgIHBheWxvYWQ6IHt9LFxuICogICAgICBtZXRhOiB7XG4gKiAgICAgICAgLy8gb3RoZXIgbWV0YSxcbiAqICAgICAgICBfaWRfOiBpZFxuICogICAgICB9XG4gKiAgICB9LFxuICogICAgbWV0YToge1xuICogICAgICBmb3J3YXJkOiAnQHJlZHV4LWZvcndhcmQvRk9SV0FSRCcsXG4gKiAgICAgIGlkOiAnQEBLR19pZCdcbiAqICAgIH1cbiAqICB9O1xuICovXG5cbmV4cG9ydCBjb25zdCBnZXRBY3Rpb25Gb3J3YXJkQWRkcmVzcyA9IGlkID0+XG4gIGAke0FERFJFU1NfUFJFRklYfSR7aWQudG9VcHBlckNhc2UoKX1gO1xuXG5leHBvcnQgY29uc3Qgd3JhcFRvID0gY3VycnkoKGlkLCBhY3Rpb24pID0+ICh7XG4gIC8vIGtlZXAgb3JpZ2luYWwgYWN0aW9uLnR5cGVcbiAgdHlwZTogYWN0aW9uLnR5cGUsXG5cbiAgLy8gYWN0dWFsIGFjdGlvblxuICBwYXlsb2FkOiB7XG4gICAgLi4uYWN0aW9uLFxuICAgIG1ldGE6IHtcbiAgICAgIC4uLmFjdGlvbi5tZXRhLFxuICAgICAgX2lkXzogaWRcbiAgICB9XG4gIH0sXG5cbiAgLy8gYWRkIGZvcndhcmQgc2lnbmF0dXJlIHRvIG1ldGFcbiAgbWV0YToge1xuICAgIC4uLihhY3Rpb24ubWV0YSB8fCB7fSksXG4gICAgX2ZvcndhcmRfOiBGT1JXQVJELFxuICAgIF9hZGRyXzogZ2V0QWN0aW9uRm9yd2FyZEFkZHJlc3MoaWQpXG4gIH1cbn0pKTtcblxuZXhwb3J0IGNvbnN0IGlzRm9yd2FyZEFjdGlvbiA9IGFjdGlvbiA9PiB7XG4gIHJldHVybiBhY3Rpb24gJiYgYWN0aW9uLm1ldGEgJiYgYWN0aW9uLm1ldGEuX2ZvcndhcmRfID09PSBGT1JXQVJEO1xufTtcblxuZXhwb3J0IGNvbnN0IHVud3JhcCA9IGFjdGlvbiA9PlxuICBpc0ZvcndhcmRBY3Rpb24oYWN0aW9uKSA/IHVud3JhcChhY3Rpb24ucGF5bG9hZCkgOiBhY3Rpb247XG5cbi8vIGdpdmVuIGEgaWQgdG8gZm9yd2FyZCB0bywgcmV0dXJucyB0aGUgYWN0aW9uIGZvciB0aGF0IGlkXG5leHBvcnQgY29uc3QgYWN0aW9uRm9yID0gKGlkLCBhY3Rpb24pID0+XG4gIGlzRm9yd2FyZEFjdGlvbihhY3Rpb24pXG4gICAgPyBhY3Rpb24ubWV0YS5fYWRkcl8gPT09IGdldEFjdGlvbkZvcndhcmRBZGRyZXNzKGlkKSA/IGFjdGlvbi5wYXlsb2FkIDoge31cbiAgICA6IGFjdGlvbjtcblxuLy8gcmV0dXJucyBhIG5ldyBkaXNwYXRjaCB0aGF0IHdyYXBzIGFuZCBmb3J3YXJkcyB0aGUgYWN0aW9ucyB3aXRoIHRoZSBnaXZlbiBpZFxuZXhwb3J0IGNvbnN0IGZvcndhcmRUbyA9IChpZCwgZGlzcGF0Y2gpID0+IGFjdGlvbiA9PlxuICBkaXNwYXRjaCh3cmFwVG8oaWQsIGFjdGlvbikpO1xuXG5leHBvcnQgY29uc3QgdXBkYXRlUHJvcGVydHkgPSAoc3RhdGUsIGlkLCB2YWx1ZSkgPT5cbiAgc3RhdGVbaWRdID09PSB2YWx1ZVxuICAgID8gc3RhdGVcbiAgICA6IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIFtpZF06IHZhbHVlXG4gICAgICB9O1xuIl19