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

// Copyright (c) 2020 Uber Technologies, Inc.
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
    payload: _objectSpread({}, action, {
      meta: _objectSpread({}, action.meta, {
        _id_: id
      })
    }),
    // add forward signature to meta
    meta: _objectSpread({}, action.meta || {}, {
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
  return state[id] === nextState ? state : _objectSpread({}, state, (0, _defineProperty2["default"])({}, id, nextState));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2FjdGlvbi13cmFwcGVyLmpzIl0sIm5hbWVzIjpbIkZPUldBUkQiLCJBRERSRVNTX1BSRUZJWCIsImdldEFjdGlvbkZvcndhcmRBZGRyZXNzIiwiaWQiLCJ0b1VwcGVyQ2FzZSIsIndyYXBUbyIsImFjdGlvbiIsInR5cGUiLCJwYXlsb2FkIiwibWV0YSIsIl9pZF8iLCJfZm9yd2FyZF8iLCJfYWRkcl8iLCJpc0ZvcndhcmRBY3Rpb24iLCJCb29sZWFuIiwidW53cmFwIiwiX2FjdGlvbkZvciIsImZvcndhcmRUbyIsImRpc3BhdGNoIiwiX3VwZGF0ZVByb3BlcnR5Iiwic3RhdGUiLCJuZXh0U3RhdGUiLCJmb3J3YXJkQWN0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUF1QkE7Ozs7OztBQXZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVPLElBQU1BLE9BQU8sR0FBRyx3QkFBaEI7O0FBQ0EsSUFBTUMsY0FBYyxHQUFHLE9BQXZCOzs7QUFJQSxJQUFNQyx1QkFBdUIsR0FBRyxTQUExQkEsdUJBQTBCLENBQUFDLEVBQUU7QUFBQSxtQkFBT0YsY0FBUCxTQUF3QkUsRUFBRSxDQUFDQyxXQUFILEVBQXhCO0FBQUEsQ0FBbEM7QUFFUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJDTyxJQUFNQyxNQUFNLEdBQUcsd0JBQU0sVUFBQ0YsRUFBRCxFQUFLRyxNQUFMO0FBQUEsU0FBaUI7QUFDM0M7QUFDQUMsSUFBQUEsSUFBSSxFQUFFRCxNQUFNLENBQUNDLElBRjhCO0FBSTNDO0FBQ0FDLElBQUFBLE9BQU8sb0JBQ0ZGLE1BREU7QUFFTEcsTUFBQUEsSUFBSSxvQkFDQ0gsTUFBTSxDQUFDRyxJQURSO0FBRUZDLFFBQUFBLElBQUksRUFBRVA7QUFGSjtBQUZDLE1BTG9DO0FBYTNDO0FBQ0FNLElBQUFBLElBQUksb0JBQ0VILE1BQU0sQ0FBQ0csSUFBUCxJQUFlLEVBRGpCO0FBRUZFLE1BQUFBLFNBQVMsRUFBRVgsT0FGVDtBQUdGWSxNQUFBQSxNQUFNLEVBQUVWLHVCQUF1QixDQUFDQyxFQUFEO0FBSDdCO0FBZHVDLEdBQWpCO0FBQUEsQ0FBTixDQUFmO0FBcUJQOzs7Ozs7Ozs7O0FBT08sSUFBTVUsZUFBZSxHQUFHLFNBQWxCQSxlQUFrQixDQUFBUCxNQUFNLEVBQUk7QUFDdkMsU0FBT1EsT0FBTyxDQUFDUixNQUFNLElBQUlBLE1BQU0sQ0FBQ0csSUFBakIsSUFBeUJILE1BQU0sQ0FBQ0csSUFBUCxDQUFZRSxTQUFaLEtBQTBCWCxPQUFwRCxDQUFkO0FBQ0QsQ0FGTTtBQUlQOzs7Ozs7Ozs7OztBQU9PLElBQU1lLE1BQU0sR0FBRyxTQUFUQSxNQUFTLENBQUFULE1BQU07QUFBQSxTQUFLTyxlQUFlLENBQUNQLE1BQUQsQ0FBZixHQUEwQlMsTUFBTSxDQUFDVCxNQUFNLENBQUNFLE9BQVIsQ0FBaEMsR0FBbURGLE1BQXhEO0FBQUEsQ0FBckI7QUFFUDs7Ozs7Ozs7Ozs7O0FBUU8sSUFBTVUsVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBQ2IsRUFBRCxFQUFLRyxNQUFMO0FBQUEsU0FDeEJPLGVBQWUsQ0FBQ1AsTUFBRCxDQUFmLEdBQ0lBLE1BQU0sQ0FBQ0csSUFBUCxDQUFZRyxNQUFaLEtBQXVCVix1QkFBdUIsQ0FBQ0MsRUFBRCxDQUE5QyxHQUNFRyxNQUFNLENBQUNFLE9BRFQsR0FFRSxFQUhOLEdBSUlGLE1BTG9CO0FBQUEsQ0FBbkI7QUFPUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0Qk8sSUFBTVcsU0FBUyxHQUFHLFNBQVpBLFNBQVksQ0FBQ2QsRUFBRCxFQUFLZSxRQUFMO0FBQUEsU0FBa0IsVUFBQVosTUFBTTtBQUFBLFdBQUlZLFFBQVEsQ0FBQ2IsTUFBTSxDQUFDRixFQUFELEVBQUtHLE1BQUwsQ0FBUCxDQUFaO0FBQUEsR0FBeEI7QUFBQSxDQUFsQjtBQUVQOzs7Ozs7Ozs7Ozs7QUFRTyxJQUFNYSxlQUFlLEdBQUcsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQsRUFBUWpCLEVBQVIsRUFBWWtCLFNBQVo7QUFBQSxTQUM3QkQsS0FBSyxDQUFDakIsRUFBRCxDQUFMLEtBQWNrQixTQUFkLEdBQ0lELEtBREoscUJBR1NBLEtBSFQsdUNBSU9qQixFQUpQLEVBSVlrQixTQUpaLEVBRDZCO0FBQUEsQ0FBeEI7QUFRUDs7OztBQUdBOzs7OztBQUlBO0FBQ0E7Ozs7QUFDQSxJQUFNQyxjQUFjLEdBQUcsSUFBdkI7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmV4cG9ydCBjb25zdCBGT1JXQVJEID0gJ0ByZWR1eC1mb3J3YXJkL0ZPUldBUkQnO1xuZXhwb3J0IGNvbnN0IEFERFJFU1NfUFJFRklYID0gJ0BAS0dfJztcblxuaW1wb3J0IGN1cnJ5IGZyb20gJ2xvZGFzaC5jdXJyeSc7XG5cbmV4cG9ydCBjb25zdCBnZXRBY3Rpb25Gb3J3YXJkQWRkcmVzcyA9IGlkID0+IGAke0FERFJFU1NfUFJFRklYfSR7aWQudG9VcHBlckNhc2UoKX1gO1xuXG4vKipcbiAqIFdyYXAgYW4gYWN0aW9uIGludG8gYSBmb3J3YXJkIGFjdGlvbiB0aGF0IG9ubHkgbW9kaWZ5IHRoZSBzdGF0ZSBvZiBhIHNwZWNpZmljXG4gKiBrZXBsZXIuZ2wgaW5zdGFuY2UuIGtlcGxlci5nbCByZWR1Y2VyIHdpbGwgbG9vayBmb3Igc2lnbmF0dXJlcyBpbiB0aGUgYWN0aW9uIHRvXG4gKiBkZXRlcm1pbmUgd2hldGhlciBpdCBuZWVkcyB0byBiZSBmb3J3YXJkZWQgdG8gYSBzcGVjaWZpYyBpbnN0YW5jZSByZWR1Y2VyLlxuICpcbiAqIHdyYXBUbyBjYW4gYmUgY3VycmllZC4gWW91IGNhbiBjcmVhdGUgYSBjdXJyaWVkIGFjdGlvbiB3cmFwcGVyIGJ5IG9ubHkgc3VwcGx5IHRoZSBgaWRgIGFyZ3VtZW50XG4gKlxuICogQSBmb3J3YXJkIGFjdGlvbiBsb29rcyBsaWtlIHRoaXNcbiAqIGBgYGpzXG4gKiAge1xuICogICAgdHlwZTogXCJAQGtlcGxlci5nbC9MQVlFUl9DT05GSUdfQ0hBTkdFXCIsXG4gKiAgICBwYXlsb2FkOiB7XG4gKiAgICAgIHR5cGU6ICdAQGtlcGxlci5nbC9MQVlFUl9DT05GSUdfQ0hBTkdFJyxcbiAqICAgICAgcGF5bG9hZDoge30sXG4gKiAgICAgIG1ldGE6IHtcbiAqICAgICAgIC8vIGlkIG9mIGluc3RhbmNlXG4gKiAgICAgICAgX2lkXzogaWRcbiAqICAgICAgIC8vIG90aGVyIG1ldGFcbiAqICAgICAgfVxuICogICAgfSxcbiAqICAgIG1ldGE6IHtcbiAqICAgICAgX2ZvcndhcmRfOiAnQHJlZHV4LWZvcndhcmQvRk9SV0FSRCcsXG4gKiAgICAgIF9hZGRyXzogJ0BAS0dfaWQnXG4gKiAgICB9XG4gKiAgfTtcbiAqIGBgYFxuICpcbiAqIEBtZW1iZXJvZiBmb3J3YXJkQWN0aW9uc1xuICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gVGhlIGlkIHRvIGZvcndhcmQgdG9cbiAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb24gLSB0aGUgYWN0aW9uIG9iamVjdCB7dHlwZTogc3RyaW5nLCBwYXlsb2FkOiAqfVxuICogQHJldHVybnMge3t0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IHt0eXBlOiBzdHJpbmcsIHBheWxvYWQ6ICosIG1ldGE6IHtfaWRfOiBzdHJpbmd9LCBtZXRhOiB7X2ZvcndhcmRfOiBzdHJpbmcsIF9hZGRyXzogc3RyaW5nfX19fVxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqXG4gKiBpbXBvcnQge3dyYXBUbywgdG9nZ2xlUGVyc3BlY3RpdmV9IGZyb20gJ2tlcGxlci5nbC9hY3Rpb25zJztcbiAqXG4gKiAvLyBUaGlzIGFjdGlvbiB3aWxsIG9ubHkgZGlzcGF0Y2ggdG8gdGhlIEtlcGxlckdsIGluc3RhbmNlIHdpdGggYGlkOiBtYXBfMWBcbiAqIHRoaXMucHJvcHMuZGlzcGF0Y2god3JhcFRvKCdtYXBfMScsIHRvZ2dsZVBlcnNwZWN0aXZlKCkpKTtcbiAqXG4gKiAvLyBZb3UgY2FuIGFsc28gY3JlYXRlIGEgY3VycmllZCBhY3Rpb24gZm9yIGVhY2ggaW5zdGFuY2VcbiAqIGNvbnN0IHdyYXBUb01hcDEgPSB3cmFwVG8oJ21hcF8xJyk7XG4gKiB0aGlzLnByb3BzLmRpc3BhdGNoKHdyYXBUb01hcDEodG9nZ2xlUGVyc3BlY3RpdmUoKSkpO1xuICovXG5leHBvcnQgY29uc3Qgd3JhcFRvID0gY3VycnkoKGlkLCBhY3Rpb24pID0+ICh7XG4gIC8vIGtlZXAgb3JpZ2luYWwgYWN0aW9uLnR5cGVcbiAgdHlwZTogYWN0aW9uLnR5cGUsXG5cbiAgLy8gYWN0dWFsIGFjdGlvblxuICBwYXlsb2FkOiB7XG4gICAgLi4uYWN0aW9uLFxuICAgIG1ldGE6IHtcbiAgICAgIC4uLmFjdGlvbi5tZXRhLFxuICAgICAgX2lkXzogaWRcbiAgICB9XG4gIH0sXG5cbiAgLy8gYWRkIGZvcndhcmQgc2lnbmF0dXJlIHRvIG1ldGFcbiAgbWV0YToge1xuICAgIC4uLihhY3Rpb24ubWV0YSB8fCB7fSksXG4gICAgX2ZvcndhcmRfOiBGT1JXQVJELFxuICAgIF9hZGRyXzogZ2V0QWN0aW9uRm9yd2FyZEFkZHJlc3MoaWQpXG4gIH1cbn0pKTtcblxuLyoqXG4gKiBXaGV0aGVyIGFuIGFjdGlvbiBpcyBhIGZvcndhcmQgYWN0aW9uXG4gKiBAbWVtYmVyb2YgZm9yd2FyZEFjdGlvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb24gLSB0aGUgYWN0aW9uIG9iamVjdFxuICogQHJldHVybnMge2Jvb2xlYW59IGJvb2xlYW4gLSB3aGV0aGVyIHRoZSBhY3Rpb24gaXMgYSBmb3J3YXJkIGFjdGlvblxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgaXNGb3J3YXJkQWN0aW9uID0gYWN0aW9uID0+IHtcbiAgcmV0dXJuIEJvb2xlYW4oYWN0aW9uICYmIGFjdGlvbi5tZXRhICYmIGFjdGlvbi5tZXRhLl9mb3J3YXJkXyA9PT0gRk9SV0FSRCk7XG59O1xuXG4vKipcbiAqIFVud3JhcCBhbiBhY3Rpb25cbiAqIEBtZW1iZXJvZiBmb3J3YXJkQWN0aW9uc1xuICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbiAtIHRoZSBhY3Rpb24gb2JqZWN0XG4gKiBAcmV0dXJucyB7T2JqZWN0fSAtIHVud3JhcHBlZCBhY3Rpb25cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHVud3JhcCA9IGFjdGlvbiA9PiAoaXNGb3J3YXJkQWN0aW9uKGFjdGlvbikgPyB1bndyYXAoYWN0aW9uLnBheWxvYWQpIDogYWN0aW9uKTtcblxuLyoqXG4gKiBHaXZlbiBhbiBpZCwgcmV0dXJucyB0aGUgYWN0aW9uIGZvciB0aGF0IGlkLlxuICogSWYgdGhlIGFjdGlvbiBpcyBub3QgYSBmb3J3YXJkIGFjdGlvbiwgcmV0dXJuIHRoZSBhY3Rpb25cbiAqIEBtZW1iZXJvZiBmb3J3YXJkQWN0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IGlkXG4gKiBAcGFyYW0ge09iamVjdH0gYWN0aW9uXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgX2FjdGlvbkZvciA9IChpZCwgYWN0aW9uKSA9PlxuICBpc0ZvcndhcmRBY3Rpb24oYWN0aW9uKVxuICAgID8gYWN0aW9uLm1ldGEuX2FkZHJfID09PSBnZXRBY3Rpb25Gb3J3YXJkQWRkcmVzcyhpZClcbiAgICAgID8gYWN0aW9uLnBheWxvYWRcbiAgICAgIDoge31cbiAgICA6IGFjdGlvbjtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFjdGlvbiBkaXNwYXRjaGVyIHRoYXQgd3JhcHMgYW5kIGZvcndhcmRzIHRoZSBhY3Rpb25zIHRvIGEgc3BlY2lmaWMgaW5zdGFuY2VcbiAqIEBtZW1iZXJvZiBmb3J3YXJkQWN0aW9uc1xuICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gaW5zdGFuY2UgaWRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGRpc3BhdGNoIC0gYWN0aW9uIGRpc3BhdGNoZXJcbiAqIEBwdWJsaWNcbiAqIEBleGFtcGxlXG4gKlxuICogLy8gYWN0aW9uIGFuZCBmb3J3YXJkIGRpc3BhdGNoZXJcbiAqIGltcG9ydCB7dG9nZ2xlU3BsaXRNYXAsIGZvcndhcmRUb30gZnJvbSAna2VwbGVyLmdsL2FjdGlvbnMnO1xuICogaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG4gKlxuICogY29uc3QgTWFwQ29udGFpbmVyID0gcHJvcHMgPT4gKFxuICogIDxkaXY+XG4gKiAgIDxidXR0b24gb25DbGljaz17KCkgPT4gcHJvcHMua2VwbGVyR2xEaXNwYXRjaCh0b2dnbGVTcGxpdE1hcCgpKX0vPlxuICogIDwvZGl2PlxuICogKVxuICpcbiAqIGNvbnN0IG1hcERpc3BhdGNoVG9Qcm9wcyA9IChkaXNwYXRjaCwgcHJvcHMpID0+ICh7XG4gKiAgZGlzcGF0Y2gsXG4gKiAga2VwbGVyR2xEaXNwYXRjaDogZm9yd2FyZFRvKOKAmGZvb+KAmSwgZGlzcGF0Y2gpXG4gKiB9KTtcbiAqXG4gKiBleHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICogIHN0YXRlID0+IHN0YXRlLFxuICogIG1hcERpc3BhdGNoVG9Qcm9wc1xuICogKShNYXBDb250YWluZXIpO1xuICovXG5leHBvcnQgY29uc3QgZm9yd2FyZFRvID0gKGlkLCBkaXNwYXRjaCkgPT4gYWN0aW9uID0+IGRpc3BhdGNoKHdyYXBUbyhpZCwgYWN0aW9uKSk7XG5cbi8qKlxuICogVXBkYXRlIHRoZSBzdGF0ZSBvZiBhIGtlcGxlci5nbCBpbnN0YW5jZVxuICogQG1lbWJlcm9mIGZvcndhcmRBY3Rpb25zXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICogQHBhcmFtIHtPYmplY3R9IG5leHRTdGF0ZVxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IF91cGRhdGVQcm9wZXJ0eSA9IChzdGF0ZSwgaWQsIG5leHRTdGF0ZSkgPT5cbiAgc3RhdGVbaWRdID09PSBuZXh0U3RhdGVcbiAgICA/IHN0YXRlXG4gICAgOiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBbaWRdOiBuZXh0U3RhdGVcbiAgICAgIH07XG5cbi8qKlxuICogVGhpcyBkZWNsYXJhdGlvbiBpcyBuZWVkZWQgdG8gZ3JvdXAgYWN0aW9ucyBpbiBkb2NzXG4gKi9cbi8qKlxuICogQSBzZXQgb2YgaGVscGVycyB0byBmb3J3YXJkIGRpc3BhdGNoIGFjdGlvbnMgdG8gYSBzcGVjaWZpYyBpbnN0YW5jZSByZWR1Y2VyXG4gKiBAcHVibGljXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vLyBAdHMtaWdub3JlXG5jb25zdCBmb3J3YXJkQWN0aW9ucyA9IG51bGw7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4iXX0=