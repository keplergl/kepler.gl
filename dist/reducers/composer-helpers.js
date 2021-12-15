"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = log;
exports.payload_ = payload_;
exports.apply_ = apply_;
exports.with_ = with_;
exports.if_ = if_;
exports.compose_ = compose_;
exports.merge_ = merge_;
exports.pick_ = pick_;
exports.swap_ = swap_;
exports.findById = findById;
exports.map_ = map_;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _console = _interopRequireDefault(require("global/console"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var identity = function identity(state) {
  return state;
};
/* eslint-disable no-unused-vars */
// @ts-ignore


function log(text) {
  return function (value) {
    return _console["default"].log(text, value);
  };
}
/* eslint-enable no-unused-vars */


function payload_(p) {
  return {
    payload: p
  };
}

function apply_(updater, payload) {
  return function (state) {
    return updater(state, payload);
  };
}

function with_(fn) {
  return function (state) {
    return fn(state)(state);
  };
}

function if_(pred, fn) {
  return pred ? fn : identity;
}

function compose_(fns) {
  return function (state) {
    return fns.reduce(function (state2, fn) {
      return fn(state2);
    }, state);
  };
}

function merge_(obj) {
  return function (state) {
    return _objectSpread(_objectSpread({}, state), obj);
  };
}

function pick_(prop) {
  return function (fn) {
    return function (state) {
      return _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, prop, fn(state[prop])));
    };
  };
}

function swap_(item) {
  return function (arr) {
    return arr.map(function (a) {
      return a.id === item.id ? item : a;
    });
  };
}

function findById(id) {
  return function (arr) {
    return arr.find(function (a) {
      return a.id === id;
    });
  };
}

function map_(fn) {
  return function (arr) {
    return arr.map(function (e) {
      return fn(e);
    });
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9jb21wb3Nlci1oZWxwZXJzLmpzIl0sIm5hbWVzIjpbImlkZW50aXR5Iiwic3RhdGUiLCJsb2ciLCJ0ZXh0IiwidmFsdWUiLCJDb25zb2xlIiwicGF5bG9hZF8iLCJwIiwicGF5bG9hZCIsImFwcGx5XyIsInVwZGF0ZXIiLCJ3aXRoXyIsImZuIiwiaWZfIiwicHJlZCIsImNvbXBvc2VfIiwiZm5zIiwicmVkdWNlIiwic3RhdGUyIiwibWVyZ2VfIiwib2JqIiwicGlja18iLCJwcm9wIiwic3dhcF8iLCJpdGVtIiwiYXJyIiwibWFwIiwiYSIsImlkIiwiZmluZEJ5SWQiLCJmaW5kIiwibWFwXyIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7Ozs7O0FBRUEsSUFBTUEsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUo7QUFBQSxDQUF0QjtBQUVBO0FBQ0E7OztBQUNPLFNBQVNDLEdBQVQsQ0FBYUMsSUFBYixFQUFtQjtBQUN4QixTQUFPLFVBQUFDLEtBQUs7QUFBQSxXQUFJQyxvQkFBUUgsR0FBUixDQUFZQyxJQUFaLEVBQWtCQyxLQUFsQixDQUFKO0FBQUEsR0FBWjtBQUNEO0FBQ0Q7OztBQUVPLFNBQVNFLFFBQVQsQ0FBa0JDLENBQWxCLEVBQXFCO0FBQzFCLFNBQU87QUFBQ0MsSUFBQUEsT0FBTyxFQUFFRDtBQUFWLEdBQVA7QUFDRDs7QUFFTSxTQUFTRSxNQUFULENBQWdCQyxPQUFoQixFQUF5QkYsT0FBekIsRUFBa0M7QUFDdkMsU0FBTyxVQUFBUCxLQUFLO0FBQUEsV0FBSVMsT0FBTyxDQUFDVCxLQUFELEVBQVFPLE9BQVIsQ0FBWDtBQUFBLEdBQVo7QUFDRDs7QUFFTSxTQUFTRyxLQUFULENBQWVDLEVBQWYsRUFBbUI7QUFDeEIsU0FBTyxVQUFBWCxLQUFLO0FBQUEsV0FBSVcsRUFBRSxDQUFDWCxLQUFELENBQUYsQ0FBVUEsS0FBVixDQUFKO0FBQUEsR0FBWjtBQUNEOztBQUVNLFNBQVNZLEdBQVQsQ0FBYUMsSUFBYixFQUFtQkYsRUFBbkIsRUFBdUI7QUFDNUIsU0FBT0UsSUFBSSxHQUFHRixFQUFILEdBQVFaLFFBQW5CO0FBQ0Q7O0FBRU0sU0FBU2UsUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUI7QUFDNUIsU0FBTyxVQUFBZixLQUFLO0FBQUEsV0FBSWUsR0FBRyxDQUFDQyxNQUFKLENBQVcsVUFBQ0MsTUFBRCxFQUFTTixFQUFUO0FBQUEsYUFBZ0JBLEVBQUUsQ0FBQ00sTUFBRCxDQUFsQjtBQUFBLEtBQVgsRUFBdUNqQixLQUF2QyxDQUFKO0FBQUEsR0FBWjtBQUNEOztBQUVNLFNBQVNrQixNQUFULENBQWdCQyxHQUFoQixFQUFxQjtBQUMxQixTQUFPLFVBQUFuQixLQUFLO0FBQUEsMkNBQVNBLEtBQVQsR0FBbUJtQixHQUFuQjtBQUFBLEdBQVo7QUFDRDs7QUFFTSxTQUFTQyxLQUFULENBQWVDLElBQWYsRUFBcUI7QUFDMUIsU0FBTyxVQUFBVixFQUFFO0FBQUEsV0FBSSxVQUFBWCxLQUFLO0FBQUEsNkNBQVNBLEtBQVQsNENBQWlCcUIsSUFBakIsRUFBd0JWLEVBQUUsQ0FBQ1gsS0FBSyxDQUFDcUIsSUFBRCxDQUFOLENBQTFCO0FBQUEsS0FBVDtBQUFBLEdBQVQ7QUFDRDs7QUFFTSxTQUFTQyxLQUFULENBQWVDLElBQWYsRUFBcUI7QUFDMUIsU0FBTyxVQUFBQyxHQUFHO0FBQUEsV0FBSUEsR0FBRyxDQUFDQyxHQUFKLENBQVEsVUFBQUMsQ0FBQztBQUFBLGFBQUtBLENBQUMsQ0FBQ0MsRUFBRixLQUFTSixJQUFJLENBQUNJLEVBQWQsR0FBbUJKLElBQW5CLEdBQTBCRyxDQUEvQjtBQUFBLEtBQVQsQ0FBSjtBQUFBLEdBQVY7QUFDRDs7QUFFTSxTQUFTRSxRQUFULENBQWtCRCxFQUFsQixFQUFzQjtBQUMzQixTQUFPLFVBQUFILEdBQUc7QUFBQSxXQUFJQSxHQUFHLENBQUNLLElBQUosQ0FBUyxVQUFBSCxDQUFDO0FBQUEsYUFBSUEsQ0FBQyxDQUFDQyxFQUFGLEtBQVNBLEVBQWI7QUFBQSxLQUFWLENBQUo7QUFBQSxHQUFWO0FBQ0Q7O0FBRU0sU0FBU0csSUFBVCxDQUFjbkIsRUFBZCxFQUFrQjtBQUN2QixTQUFPLFVBQUFhLEdBQUc7QUFBQSxXQUFJQSxHQUFHLENBQUNDLEdBQUosQ0FBUSxVQUFBTSxDQUFDO0FBQUEsYUFBSXBCLEVBQUUsQ0FBQ29CLENBQUQsQ0FBTjtBQUFBLEtBQVQsQ0FBSjtBQUFBLEdBQVY7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBDb25zb2xlIGZyb20gJ2dsb2JhbC9jb25zb2xlJztcblxuY29uc3QgaWRlbnRpdHkgPSBzdGF0ZSA9PiBzdGF0ZTtcblxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbi8vIEB0cy1pZ25vcmVcbmV4cG9ydCBmdW5jdGlvbiBsb2codGV4dCkge1xuICByZXR1cm4gdmFsdWUgPT4gQ29uc29sZS5sb2codGV4dCwgdmFsdWUpO1xufVxuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG5leHBvcnQgZnVuY3Rpb24gcGF5bG9hZF8ocCkge1xuICByZXR1cm4ge3BheWxvYWQ6IHB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlfKHVwZGF0ZXIsIHBheWxvYWQpIHtcbiAgcmV0dXJuIHN0YXRlID0+IHVwZGF0ZXIoc3RhdGUsIHBheWxvYWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aF8oZm4pIHtcbiAgcmV0dXJuIHN0YXRlID0+IGZuKHN0YXRlKShzdGF0ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpZl8ocHJlZCwgZm4pIHtcbiAgcmV0dXJuIHByZWQgPyBmbiA6IGlkZW50aXR5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcG9zZV8oZm5zKSB7XG4gIHJldHVybiBzdGF0ZSA9PiBmbnMucmVkdWNlKChzdGF0ZTIsIGZuKSA9PiBmbihzdGF0ZTIpLCBzdGF0ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZV8ob2JqKSB7XG4gIHJldHVybiBzdGF0ZSA9PiAoey4uLnN0YXRlLCAuLi5vYmp9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBpY2tfKHByb3ApIHtcbiAgcmV0dXJuIGZuID0+IHN0YXRlID0+ICh7Li4uc3RhdGUsIFtwcm9wXTogZm4oc3RhdGVbcHJvcF0pfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzd2FwXyhpdGVtKSB7XG4gIHJldHVybiBhcnIgPT4gYXJyLm1hcChhID0+IChhLmlkID09PSBpdGVtLmlkID8gaXRlbSA6IGEpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRCeUlkKGlkKSB7XG4gIHJldHVybiBhcnIgPT4gYXJyLmZpbmQoYSA9PiBhLmlkID09PSBpZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBfKGZuKSB7XG4gIHJldHVybiBhcnIgPT4gYXJyLm1hcChlID0+IGZuKGUpKTtcbn1cbiJdfQ==