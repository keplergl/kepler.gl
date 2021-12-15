"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._updateProperty = exports.forwardTo = exports._actionFor = exports.unwrap = exports.isForwardAction = exports.wrapTo = exports.getActionForwardAddress = exports.ADDRESS_PREFIX = exports.FORWARD = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = _interopRequireDefault(require("lodash.curry"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var FORWARD = '@redux-forward/FORWARD';
exports.FORWARD = FORWARD;
var ADDRESS_PREFIX = '@@KG_';
exports.ADDRESS_PREFIX = ADDRESS_PREFIX;

var getActionForwardAddress = function getActionForwardAddress(id) {
  return "".concat(ADDRESS_PREFIX).concat(id.toUpperCase());
};
/**
 * Wrap an action into a forward action that only modify the state of a specific
 * kepler.gl instance. kepler.gl reducer will look for signatures in the action to
 * determine whether it needs to be forwarded to a specific instance reducer.
 *
 * wrapTo can be curried. You can create a curried action wrapper by only supply the `id` argument
 *
 * A forward action looks like this
 * ```js
 *  {
 *    type: "@@kepler.gl/LAYER_CONFIG_CHANGE",
 *    payload: {
 *      type: '@@kepler.gl/LAYER_CONFIG_CHANGE',
 *      payload: {},
 *      meta: {
 *       // id of instance
 *        _id_: id
 *       // other meta
 *      }
 *    },
 *    meta: {
 *      _forward_: '@redux-forward/FORWARD',
 *      _addr_: '@@KG_id'
 *    }
 *  };
 * ```
 *
 * @memberof forwardActions
 * @param {string} id - The id to forward to
 * @param {Object} action - the action object {type: string, payload: *}
 * @returns {{type: string, payload: {type: string, payload: *, meta: {_id_: string}, meta: {_forward_: string, _addr_: string}}}}
 * @public
 * @example
 *
 * import {wrapTo, togglePerspective} from 'kepler.gl/actions';
 *
 * // This action will only dispatch to the KeplerGl instance with `id: map_1`
 * this.props.dispatch(wrapTo('map_1', togglePerspective()));
 *
 * // You can also create a curried action for each instance
 * const wrapToMap1 = wrapTo('map_1');
 * this.props.dispatch(wrapToMap1(togglePerspective()));
 */


exports.getActionForwardAddress = getActionForwardAddress;
var wrapTo = (0, _lodash["default"])(function (id, action) {
  return {
    // keep original action.type
    type: action.type,
    // actual action
    payload: _objectSpread(_objectSpread({}, action), {}, {
      meta: _objectSpread(_objectSpread({}, action.meta), {}, {
        _id_: id
      })
    }),
    // add forward signature to meta
    meta: _objectSpread(_objectSpread({}, action.meta || {}), {}, {
      _forward_: FORWARD,
      _addr_: getActionForwardAddress(id)
    })
  };
});
/**
 * Whether an action is a forward action
 * @memberof forwardActions
 * @param {Object} action - the action object
 * @returns {boolean} boolean - whether the action is a forward action
 * @public
 */

exports.wrapTo = wrapTo;

var isForwardAction = function isForwardAction(action) {
  return Boolean(action && action.meta && action.meta._forward_ === FORWARD);
};
/**
 * Unwrap an action
 * @memberof forwardActions
 * @param {Object} action - the action object
 * @returns {Object} - unwrapped action
 * @public
 */


exports.isForwardAction = isForwardAction;

var unwrap = function unwrap(action) {
  return isForwardAction(action) ? unwrap(action.payload) : action;
};
/**
 * Given an id, returns the action for that id.
 * If the action is not a forward action, return the action
 * @memberof forwardActions
 * @param {String} id
 * @param {Object} action
 * @private
 */


exports.unwrap = unwrap;

var _actionFor = function _actionFor(id, action) {
  return isForwardAction(action) ? action.meta._addr_ === getActionForwardAddress(id) ? action.payload : {} : action;
};
/**
 * Returns an action dispatcher that wraps and forwards the actions to a specific instance
 * @memberof forwardActions
 * @param {string} id - instance id
 * @param {Function} dispatch - action dispatcher
 * @public
 * @example
 *
 * // action and forward dispatcher
 * import {toggleSplitMap, forwardTo} from 'kepler.gl/actions';
 * import {connect} from 'react-redux';
 *
 * const MapContainer = props => (
 *  <div>
 *   <button onClick={() => props.keplerGlDispatch(toggleSplitMap())}/>
 *  </div>
 * )
 *
 * const mapDispatchToProps = (dispatch, props) => ({
 *  dispatch,
 *  keplerGlDispatch: forwardTo(‘foo’, dispatch)
 * });
 *
 * export default connect(
 *  state => state,
 *  mapDispatchToProps
 * )(MapContainer);
 */


exports._actionFor = _actionFor;

var forwardTo = function forwardTo(id, dispatch) {
  return function (action) {
    return dispatch(wrapTo(id, action));
  };
};
/**
 * Update the state of a kepler.gl instance
 * @memberof forwardActions
 * @param {Object} state
 * @param {string} id
 * @param {Object} nextState
 * @private
 */


exports.forwardTo = forwardTo;

var _updateProperty = function _updateProperty(state, id, nextState) {
  return state[id] === nextState ? state : _objectSpread(_objectSpread({}, state), {}, (0, _defineProperty2["default"])({}, id, nextState));
};
/**
 * This declaration is needed to group actions in docs
 */

/**
 * A set of helpers to forward dispatch actions to a specific instance reducer
 * @public
 */

/* eslint-disable no-unused-vars */
// @ts-ignore


exports._updateProperty = _updateProperty;
var forwardActions = null;
/* eslint-enable no-unused-vars */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2FjdGlvbi13cmFwcGVyLmpzIl0sIm5hbWVzIjpbIkZPUldBUkQiLCJBRERSRVNTX1BSRUZJWCIsImdldEFjdGlvbkZvcndhcmRBZGRyZXNzIiwiaWQiLCJ0b1VwcGVyQ2FzZSIsIndyYXBUbyIsImFjdGlvbiIsInR5cGUiLCJwYXlsb2FkIiwibWV0YSIsIl9pZF8iLCJfZm9yd2FyZF8iLCJfYWRkcl8iLCJpc0ZvcndhcmRBY3Rpb24iLCJCb29sZWFuIiwidW53cmFwIiwiX2FjdGlvbkZvciIsImZvcndhcmRUbyIsImRpc3BhdGNoIiwiX3VwZGF0ZVByb3BlcnR5Iiwic3RhdGUiLCJuZXh0U3RhdGUiLCJmb3J3YXJkQWN0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUF1QkE7Ozs7OztBQXZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVPLElBQU1BLE9BQU8sR0FBRyx3QkFBaEI7O0FBQ0EsSUFBTUMsY0FBYyxHQUFHLE9BQXZCOzs7QUFJQSxJQUFNQyx1QkFBdUIsR0FBRyxTQUExQkEsdUJBQTBCLENBQUFDLEVBQUU7QUFBQSxtQkFBT0YsY0FBUCxTQUF3QkUsRUFBRSxDQUFDQyxXQUFILEVBQXhCO0FBQUEsQ0FBbEM7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUNPLElBQU1DLE1BQU0sR0FBRyx3QkFBTSxVQUFDRixFQUFELEVBQUtHLE1BQUw7QUFBQSxTQUFpQjtBQUMzQztBQUNBQyxJQUFBQSxJQUFJLEVBQUVELE1BQU0sQ0FBQ0MsSUFGOEI7QUFJM0M7QUFDQUMsSUFBQUEsT0FBTyxrQ0FDRkYsTUFERTtBQUVMRyxNQUFBQSxJQUFJLGtDQUNDSCxNQUFNLENBQUNHLElBRFI7QUFFRkMsUUFBQUEsSUFBSSxFQUFFUDtBQUZKO0FBRkMsTUFMb0M7QUFhM0M7QUFDQU0sSUFBQUEsSUFBSSxrQ0FDRUgsTUFBTSxDQUFDRyxJQUFQLElBQWUsRUFEakI7QUFFRkUsTUFBQUEsU0FBUyxFQUFFWCxPQUZUO0FBR0ZZLE1BQUFBLE1BQU0sRUFBRVYsdUJBQXVCLENBQUNDLEVBQUQ7QUFIN0I7QUFkdUMsR0FBakI7QUFBQSxDQUFOLENBQWY7QUFxQlA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFDTyxJQUFNVSxlQUFlLEdBQUcsU0FBbEJBLGVBQWtCLENBQUFQLE1BQU0sRUFBSTtBQUN2QyxTQUFPUSxPQUFPLENBQUNSLE1BQU0sSUFBSUEsTUFBTSxDQUFDRyxJQUFqQixJQUF5QkgsTUFBTSxDQUFDRyxJQUFQLENBQVlFLFNBQVosS0FBMEJYLE9BQXBELENBQWQ7QUFDRCxDQUZNO0FBSVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBQ08sSUFBTWUsTUFBTSxHQUFHLFNBQVRBLE1BQVMsQ0FBQVQsTUFBTTtBQUFBLFNBQUtPLGVBQWUsQ0FBQ1AsTUFBRCxDQUFmLEdBQTBCUyxNQUFNLENBQUNULE1BQU0sQ0FBQ0UsT0FBUixDQUFoQyxHQUFtREYsTUFBeEQ7QUFBQSxDQUFyQjtBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBQ08sSUFBTVUsVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBQ2IsRUFBRCxFQUFLRyxNQUFMO0FBQUEsU0FDeEJPLGVBQWUsQ0FBQ1AsTUFBRCxDQUFmLEdBQ0lBLE1BQU0sQ0FBQ0csSUFBUCxDQUFZRyxNQUFaLEtBQXVCVix1QkFBdUIsQ0FBQ0MsRUFBRCxDQUE5QyxHQUNFRyxNQUFNLENBQUNFLE9BRFQsR0FFRSxFQUhOLEdBSUlGLE1BTG9CO0FBQUEsQ0FBbkI7QUFPUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFDTyxJQUFNVyxTQUFTLEdBQUcsU0FBWkEsU0FBWSxDQUFDZCxFQUFELEVBQUtlLFFBQUw7QUFBQSxTQUFrQixVQUFBWixNQUFNO0FBQUEsV0FBSVksUUFBUSxDQUFDYixNQUFNLENBQUNGLEVBQUQsRUFBS0csTUFBTCxDQUFQLENBQVo7QUFBQSxHQUF4QjtBQUFBLENBQWxCO0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFDTyxJQUFNYSxlQUFlLEdBQUcsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQsRUFBUWpCLEVBQVIsRUFBWWtCLFNBQVo7QUFBQSxTQUM3QkQsS0FBSyxDQUFDakIsRUFBRCxDQUFMLEtBQWNrQixTQUFkLEdBQ0lELEtBREosbUNBR1NBLEtBSFQsNENBSU9qQixFQUpQLEVBSVlrQixTQUpaLEVBRDZCO0FBQUEsQ0FBeEI7QUFRUDtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTs7OztBQUNBLElBQU1DLGNBQWMsR0FBRyxJQUF2QjtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuZXhwb3J0IGNvbnN0IEZPUldBUkQgPSAnQHJlZHV4LWZvcndhcmQvRk9SV0FSRCc7XG5leHBvcnQgY29uc3QgQUREUkVTU19QUkVGSVggPSAnQEBLR18nO1xuXG5pbXBvcnQgY3VycnkgZnJvbSAnbG9kYXNoLmN1cnJ5JztcblxuZXhwb3J0IGNvbnN0IGdldEFjdGlvbkZvcndhcmRBZGRyZXNzID0gaWQgPT4gYCR7QUREUkVTU19QUkVGSVh9JHtpZC50b1VwcGVyQ2FzZSgpfWA7XG5cbi8qKlxuICogV3JhcCBhbiBhY3Rpb24gaW50byBhIGZvcndhcmQgYWN0aW9uIHRoYXQgb25seSBtb2RpZnkgdGhlIHN0YXRlIG9mIGEgc3BlY2lmaWNcbiAqIGtlcGxlci5nbCBpbnN0YW5jZS4ga2VwbGVyLmdsIHJlZHVjZXIgd2lsbCBsb29rIGZvciBzaWduYXR1cmVzIGluIHRoZSBhY3Rpb24gdG9cbiAqIGRldGVybWluZSB3aGV0aGVyIGl0IG5lZWRzIHRvIGJlIGZvcndhcmRlZCB0byBhIHNwZWNpZmljIGluc3RhbmNlIHJlZHVjZXIuXG4gKlxuICogd3JhcFRvIGNhbiBiZSBjdXJyaWVkLiBZb3UgY2FuIGNyZWF0ZSBhIGN1cnJpZWQgYWN0aW9uIHdyYXBwZXIgYnkgb25seSBzdXBwbHkgdGhlIGBpZGAgYXJndW1lbnRcbiAqXG4gKiBBIGZvcndhcmQgYWN0aW9uIGxvb2tzIGxpa2UgdGhpc1xuICogYGBganNcbiAqICB7XG4gKiAgICB0eXBlOiBcIkBAa2VwbGVyLmdsL0xBWUVSX0NPTkZJR19DSEFOR0VcIixcbiAqICAgIHBheWxvYWQ6IHtcbiAqICAgICAgdHlwZTogJ0BAa2VwbGVyLmdsL0xBWUVSX0NPTkZJR19DSEFOR0UnLFxuICogICAgICBwYXlsb2FkOiB7fSxcbiAqICAgICAgbWV0YToge1xuICogICAgICAgLy8gaWQgb2YgaW5zdGFuY2VcbiAqICAgICAgICBfaWRfOiBpZFxuICogICAgICAgLy8gb3RoZXIgbWV0YVxuICogICAgICB9XG4gKiAgICB9LFxuICogICAgbWV0YToge1xuICogICAgICBfZm9yd2FyZF86ICdAcmVkdXgtZm9yd2FyZC9GT1JXQVJEJyxcbiAqICAgICAgX2FkZHJfOiAnQEBLR19pZCdcbiAqICAgIH1cbiAqICB9O1xuICogYGBgXG4gKlxuICogQG1lbWJlcm9mIGZvcndhcmRBY3Rpb25zXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBUaGUgaWQgdG8gZm9yd2FyZCB0b1xuICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbiAtIHRoZSBhY3Rpb24gb2JqZWN0IHt0eXBlOiBzdHJpbmcsIHBheWxvYWQ6ICp9XG4gKiBAcmV0dXJucyB7e3R5cGU6IHN0cmluZywgcGF5bG9hZDoge3R5cGU6IHN0cmluZywgcGF5bG9hZDogKiwgbWV0YToge19pZF86IHN0cmluZ30sIG1ldGE6IHtfZm9yd2FyZF86IHN0cmluZywgX2FkZHJfOiBzdHJpbmd9fX19XG4gKiBAcHVibGljXG4gKiBAZXhhbXBsZVxuICpcbiAqIGltcG9ydCB7d3JhcFRvLCB0b2dnbGVQZXJzcGVjdGl2ZX0gZnJvbSAna2VwbGVyLmdsL2FjdGlvbnMnO1xuICpcbiAqIC8vIFRoaXMgYWN0aW9uIHdpbGwgb25seSBkaXNwYXRjaCB0byB0aGUgS2VwbGVyR2wgaW5zdGFuY2Ugd2l0aCBgaWQ6IG1hcF8xYFxuICogdGhpcy5wcm9wcy5kaXNwYXRjaCh3cmFwVG8oJ21hcF8xJywgdG9nZ2xlUGVyc3BlY3RpdmUoKSkpO1xuICpcbiAqIC8vIFlvdSBjYW4gYWxzbyBjcmVhdGUgYSBjdXJyaWVkIGFjdGlvbiBmb3IgZWFjaCBpbnN0YW5jZVxuICogY29uc3Qgd3JhcFRvTWFwMSA9IHdyYXBUbygnbWFwXzEnKTtcbiAqIHRoaXMucHJvcHMuZGlzcGF0Y2god3JhcFRvTWFwMSh0b2dnbGVQZXJzcGVjdGl2ZSgpKSk7XG4gKi9cbmV4cG9ydCBjb25zdCB3cmFwVG8gPSBjdXJyeSgoaWQsIGFjdGlvbikgPT4gKHtcbiAgLy8ga2VlcCBvcmlnaW5hbCBhY3Rpb24udHlwZVxuICB0eXBlOiBhY3Rpb24udHlwZSxcblxuICAvLyBhY3R1YWwgYWN0aW9uXG4gIHBheWxvYWQ6IHtcbiAgICAuLi5hY3Rpb24sXG4gICAgbWV0YToge1xuICAgICAgLi4uYWN0aW9uLm1ldGEsXG4gICAgICBfaWRfOiBpZFxuICAgIH1cbiAgfSxcblxuICAvLyBhZGQgZm9yd2FyZCBzaWduYXR1cmUgdG8gbWV0YVxuICBtZXRhOiB7XG4gICAgLi4uKGFjdGlvbi5tZXRhIHx8IHt9KSxcbiAgICBfZm9yd2FyZF86IEZPUldBUkQsXG4gICAgX2FkZHJfOiBnZXRBY3Rpb25Gb3J3YXJkQWRkcmVzcyhpZClcbiAgfVxufSkpO1xuXG4vKipcbiAqIFdoZXRoZXIgYW4gYWN0aW9uIGlzIGEgZm9yd2FyZCBhY3Rpb25cbiAqIEBtZW1iZXJvZiBmb3J3YXJkQWN0aW9uc1xuICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbiAtIHRoZSBhY3Rpb24gb2JqZWN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYm9vbGVhbiAtIHdoZXRoZXIgdGhlIGFjdGlvbiBpcyBhIGZvcndhcmQgYWN0aW9uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBpc0ZvcndhcmRBY3Rpb24gPSBhY3Rpb24gPT4ge1xuICByZXR1cm4gQm9vbGVhbihhY3Rpb24gJiYgYWN0aW9uLm1ldGEgJiYgYWN0aW9uLm1ldGEuX2ZvcndhcmRfID09PSBGT1JXQVJEKTtcbn07XG5cbi8qKlxuICogVW53cmFwIGFuIGFjdGlvblxuICogQG1lbWJlcm9mIGZvcndhcmRBY3Rpb25zXG4gKiBAcGFyYW0ge09iamVjdH0gYWN0aW9uIC0gdGhlIGFjdGlvbiBvYmplY3RcbiAqIEByZXR1cm5zIHtPYmplY3R9IC0gdW53cmFwcGVkIGFjdGlvblxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgdW53cmFwID0gYWN0aW9uID0+IChpc0ZvcndhcmRBY3Rpb24oYWN0aW9uKSA/IHVud3JhcChhY3Rpb24ucGF5bG9hZCkgOiBhY3Rpb24pO1xuXG4vKipcbiAqIEdpdmVuIGFuIGlkLCByZXR1cm5zIHRoZSBhY3Rpb24gZm9yIHRoYXQgaWQuXG4gKiBJZiB0aGUgYWN0aW9uIGlzIG5vdCBhIGZvcndhcmQgYWN0aW9uLCByZXR1cm4gdGhlIGFjdGlvblxuICogQG1lbWJlcm9mIGZvcndhcmRBY3Rpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gaWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb25cbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBfYWN0aW9uRm9yID0gKGlkLCBhY3Rpb24pID0+XG4gIGlzRm9yd2FyZEFjdGlvbihhY3Rpb24pXG4gICAgPyBhY3Rpb24ubWV0YS5fYWRkcl8gPT09IGdldEFjdGlvbkZvcndhcmRBZGRyZXNzKGlkKVxuICAgICAgPyBhY3Rpb24ucGF5bG9hZFxuICAgICAgOiB7fVxuICAgIDogYWN0aW9uO1xuXG4vKipcbiAqIFJldHVybnMgYW4gYWN0aW9uIGRpc3BhdGNoZXIgdGhhdCB3cmFwcyBhbmQgZm9yd2FyZHMgdGhlIGFjdGlvbnMgdG8gYSBzcGVjaWZpYyBpbnN0YW5jZVxuICogQG1lbWJlcm9mIGZvcndhcmRBY3Rpb25zXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBpbnN0YW5jZSBpZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZGlzcGF0Y2ggLSBhY3Rpb24gZGlzcGF0Y2hlclxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBhY3Rpb24gYW5kIGZvcndhcmQgZGlzcGF0Y2hlclxuICogaW1wb3J0IHt0b2dnbGVTcGxpdE1hcCwgZm9yd2FyZFRvfSBmcm9tICdrZXBsZXIuZ2wvYWN0aW9ucyc7XG4gKiBpbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbiAqXG4gKiBjb25zdCBNYXBDb250YWluZXIgPSBwcm9wcyA9PiAoXG4gKiAgPGRpdj5cbiAqICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBwcm9wcy5rZXBsZXJHbERpc3BhdGNoKHRvZ2dsZVNwbGl0TWFwKCkpfS8+XG4gKiAgPC9kaXY+XG4gKiApXG4gKlxuICogY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoLCBwcm9wcykgPT4gKHtcbiAqICBkaXNwYXRjaCxcbiAqICBrZXBsZXJHbERpc3BhdGNoOiBmb3J3YXJkVG8o4oCYZm9v4oCZLCBkaXNwYXRjaClcbiAqIH0pO1xuICpcbiAqIGV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gKiAgc3RhdGUgPT4gc3RhdGUsXG4gKiAgbWFwRGlzcGF0Y2hUb1Byb3BzXG4gKiApKE1hcENvbnRhaW5lcik7XG4gKi9cbmV4cG9ydCBjb25zdCBmb3J3YXJkVG8gPSAoaWQsIGRpc3BhdGNoKSA9PiBhY3Rpb24gPT4gZGlzcGF0Y2god3JhcFRvKGlkLCBhY3Rpb24pKTtcblxuLyoqXG4gKiBVcGRhdGUgdGhlIHN0YXRlIG9mIGEga2VwbGVyLmdsIGluc3RhbmNlXG4gKiBAbWVtYmVyb2YgZm9yd2FyZEFjdGlvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gKiBAcGFyYW0ge09iamVjdH0gbmV4dFN0YXRlXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgX3VwZGF0ZVByb3BlcnR5ID0gKHN0YXRlLCBpZCwgbmV4dFN0YXRlKSA9PlxuICBzdGF0ZVtpZF0gPT09IG5leHRTdGF0ZVxuICAgID8gc3RhdGVcbiAgICA6IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIFtpZF06IG5leHRTdGF0ZVxuICAgICAgfTtcblxuLyoqXG4gKiBUaGlzIGRlY2xhcmF0aW9uIGlzIG5lZWRlZCB0byBncm91cCBhY3Rpb25zIGluIGRvY3NcbiAqL1xuLyoqXG4gKiBBIHNldCBvZiBoZWxwZXJzIHRvIGZvcndhcmQgZGlzcGF0Y2ggYWN0aW9ucyB0byBhIHNwZWNpZmljIGluc3RhbmNlIHJlZHVjZXJcbiAqIEBwdWJsaWNcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbi8vIEB0cy1pZ25vcmVcbmNvbnN0IGZvcndhcmRBY3Rpb25zID0gbnVsbDtcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiJdfQ==