"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renameEntry = exports.deleteEntry = exports.registerEntry = void 0;

var _reduxActions = require("redux-actions");

var _actionTypes = _interopRequireDefault(require("../constants/action-types"));

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

/**
 *
 * Add a new kepler.gl instance in `keplerGlReducer`. This action is called under-the-hood when a `KeplerGl` component is **mounted** to the dom.
 * Note that if you dispatch actions such as adding data to a kepler.gl instance before the React component is mounted, the action will not be
 * performed. Instance reducer can only handle actions when it is instantiated.
 * @memberof rootActions
 * @param payload
 * @param payload.id - ***required** The id of the instance
 * @param payload.mint - Whether to use a fresh empty state, when `mint: true` it will *always* load a fresh state when the component is re-mounted.
 * When `mint: false` it will register with existing instance state under the same `id`, when the component is unmounted then mounted again. Default: `true`
 * @param payload.mapboxApiAccessToken - mapboxApiAccessToken to be saved in `map-style` reducer.
 * @param payload.mapboxApiUrl - mapboxApiUrl to be saved in `map-style` reducer.
 * @param payload.mapStylesReplaceDefault - mapStylesReplaceDefault to be saved in `map-style` reducer.
 * @param payload.initialUiState - initial ui state
 * @type {typeof import('./identity-actions').registerEntry}
 * @public
 */
var registerEntry = (0, _reduxActions.createAction)(_actionTypes["default"].REGISTER_ENTRY, function (payload) {
  return payload;
});
/**
 *
 * Delete an instance from `keplerGlReducer`. This action is called under-the-hood when a `KeplerGl` component is **un-mounted** to the dom.
 * If `mint` is set to be `true` in the component prop, the instance state will be deleted from the root reducer. Otherwise, the root reducer will keep
 * the instance state and later transfer it to a newly mounted component with the same `id`
 * @memberof rootActions
 * @param {string} id - the id of the instance to be deleted
 * @public
 */

exports.registerEntry = registerEntry;
var deleteEntry = (0, _reduxActions.createAction)(_actionTypes["default"].DELETE_ENTRY, function (id) {
  return id;
});
/**
 *
 * Rename an instance in the root reducer, keep its entire state
 *
 * @memberof rootActions
 * @param {string} oldId - ***required** old id
 * @param {string} newId - ***required** new id
 * @public
 */

exports.deleteEntry = deleteEntry;
var renameEntry = (0, _reduxActions.createAction)(_actionTypes["default"].RENAME_ENTRY, function (oldId, newId) {
  return {
    oldId: oldId,
    newId: newId
  };
});
/**
 * This declaration is needed to group actions in docs
 */

/**
 * Root actions managers adding and removing instances in root reducer.
 * Under-the-hood, when a `KeplerGl` component is mounted or unmounted,
 * it will automatically calls these actions to add itself to the root reducer.
 * However, sometimes the data is ready before the component is registered in the reducer,
 * in this case, you can manually call these actions or the corresponding updater to add it to the reducer.
 *
 * @public
 */

/* eslint-disable no-unused-vars */
// @ts-ignore

exports.renameEntry = renameEntry;
var rootActions = null;
/* eslint-enable no-unused-vars */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2lkZW50aXR5LWFjdGlvbnMuanMiXSwibmFtZXMiOlsicmVnaXN0ZXJFbnRyeSIsIkFjdGlvblR5cGVzIiwiUkVHSVNURVJfRU5UUlkiLCJwYXlsb2FkIiwiZGVsZXRlRW50cnkiLCJERUxFVEVfRU5UUlkiLCJpZCIsInJlbmFtZUVudHJ5IiwiUkVOQU1FX0VOVFJZIiwib2xkSWQiLCJuZXdJZCIsInJvb3RBY3Rpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxJQUFNQSxhQUFhLEdBQUcsZ0NBQWFDLHdCQUFZQyxjQUF6QixFQUF5QyxVQUFBQyxPQUFPO0FBQUEsU0FBSUEsT0FBSjtBQUFBLENBQWhELENBQXRCO0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxJQUFNQyxXQUFXLEdBQUcsZ0NBQWFILHdCQUFZSSxZQUF6QixFQUF1QyxVQUFBQyxFQUFFO0FBQUEsU0FBSUEsRUFBSjtBQUFBLENBQXpDLENBQXBCO0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxJQUFNQyxXQUFXLEdBQUcsZ0NBQWFOLHdCQUFZTyxZQUF6QixFQUF1QyxVQUFDQyxLQUFELEVBQVFDLEtBQVI7QUFBQSxTQUFtQjtBQUNuRkQsSUFBQUEsS0FBSyxFQUFMQSxLQURtRjtBQUVuRkMsSUFBQUEsS0FBSyxFQUFMQTtBQUZtRixHQUFuQjtBQUFBLENBQXZDLENBQXBCO0FBS1A7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBOzs7QUFDQSxJQUFNQyxXQUFXLEdBQUcsSUFBcEI7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7Y3JlYXRlQWN0aW9ufSBmcm9tICdyZWR1eC1hY3Rpb25zJztcbmltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICdjb25zdGFudHMvYWN0aW9uLXR5cGVzJztcblxuLyoqXG4gKlxuICogQWRkIGEgbmV3IGtlcGxlci5nbCBpbnN0YW5jZSBpbiBga2VwbGVyR2xSZWR1Y2VyYC4gVGhpcyBhY3Rpb24gaXMgY2FsbGVkIHVuZGVyLXRoZS1ob29kIHdoZW4gYSBgS2VwbGVyR2xgIGNvbXBvbmVudCBpcyAqKm1vdW50ZWQqKiB0byB0aGUgZG9tLlxuICogTm90ZSB0aGF0IGlmIHlvdSBkaXNwYXRjaCBhY3Rpb25zIHN1Y2ggYXMgYWRkaW5nIGRhdGEgdG8gYSBrZXBsZXIuZ2wgaW5zdGFuY2UgYmVmb3JlIHRoZSBSZWFjdCBjb21wb25lbnQgaXMgbW91bnRlZCwgdGhlIGFjdGlvbiB3aWxsIG5vdCBiZVxuICogcGVyZm9ybWVkLiBJbnN0YW5jZSByZWR1Y2VyIGNhbiBvbmx5IGhhbmRsZSBhY3Rpb25zIHdoZW4gaXQgaXMgaW5zdGFudGlhdGVkLlxuICogQG1lbWJlcm9mIHJvb3RBY3Rpb25zXG4gKiBAcGFyYW0gcGF5bG9hZFxuICogQHBhcmFtIHBheWxvYWQuaWQgLSAqKipyZXF1aXJlZCoqIFRoZSBpZCBvZiB0aGUgaW5zdGFuY2VcbiAqIEBwYXJhbSBwYXlsb2FkLm1pbnQgLSBXaGV0aGVyIHRvIHVzZSBhIGZyZXNoIGVtcHR5IHN0YXRlLCB3aGVuIGBtaW50OiB0cnVlYCBpdCB3aWxsICphbHdheXMqIGxvYWQgYSBmcmVzaCBzdGF0ZSB3aGVuIHRoZSBjb21wb25lbnQgaXMgcmUtbW91bnRlZC5cbiAqIFdoZW4gYG1pbnQ6IGZhbHNlYCBpdCB3aWxsIHJlZ2lzdGVyIHdpdGggZXhpc3RpbmcgaW5zdGFuY2Ugc3RhdGUgdW5kZXIgdGhlIHNhbWUgYGlkYCwgd2hlbiB0aGUgY29tcG9uZW50IGlzIHVubW91bnRlZCB0aGVuIG1vdW50ZWQgYWdhaW4uIERlZmF1bHQ6IGB0cnVlYFxuICogQHBhcmFtIHBheWxvYWQubWFwYm94QXBpQWNjZXNzVG9rZW4gLSBtYXBib3hBcGlBY2Nlc3NUb2tlbiB0byBiZSBzYXZlZCBpbiBgbWFwLXN0eWxlYCByZWR1Y2VyLlxuICogQHBhcmFtIHBheWxvYWQubWFwYm94QXBpVXJsIC0gbWFwYm94QXBpVXJsIHRvIGJlIHNhdmVkIGluIGBtYXAtc3R5bGVgIHJlZHVjZXIuXG4gKiBAcGFyYW0gcGF5bG9hZC5tYXBTdHlsZXNSZXBsYWNlRGVmYXVsdCAtIG1hcFN0eWxlc1JlcGxhY2VEZWZhdWx0IHRvIGJlIHNhdmVkIGluIGBtYXAtc3R5bGVgIHJlZHVjZXIuXG4gKiBAcGFyYW0gcGF5bG9hZC5pbml0aWFsVWlTdGF0ZSAtIGluaXRpYWwgdWkgc3RhdGVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2lkZW50aXR5LWFjdGlvbnMnKS5yZWdpc3RlckVudHJ5fVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgcmVnaXN0ZXJFbnRyeSA9IGNyZWF0ZUFjdGlvbihBY3Rpb25UeXBlcy5SRUdJU1RFUl9FTlRSWSwgcGF5bG9hZCA9PiBwYXlsb2FkKTtcblxuLyoqXG4gKlxuICogRGVsZXRlIGFuIGluc3RhbmNlIGZyb20gYGtlcGxlckdsUmVkdWNlcmAuIFRoaXMgYWN0aW9uIGlzIGNhbGxlZCB1bmRlci10aGUtaG9vZCB3aGVuIGEgYEtlcGxlckdsYCBjb21wb25lbnQgaXMgKip1bi1tb3VudGVkKiogdG8gdGhlIGRvbS5cbiAqIElmIGBtaW50YCBpcyBzZXQgdG8gYmUgYHRydWVgIGluIHRoZSBjb21wb25lbnQgcHJvcCwgdGhlIGluc3RhbmNlIHN0YXRlIHdpbGwgYmUgZGVsZXRlZCBmcm9tIHRoZSByb290IHJlZHVjZXIuIE90aGVyd2lzZSwgdGhlIHJvb3QgcmVkdWNlciB3aWxsIGtlZXBcbiAqIHRoZSBpbnN0YW5jZSBzdGF0ZSBhbmQgbGF0ZXIgdHJhbnNmZXIgaXQgdG8gYSBuZXdseSBtb3VudGVkIGNvbXBvbmVudCB3aXRoIHRoZSBzYW1lIGBpZGBcbiAqIEBtZW1iZXJvZiByb290QWN0aW9uc1xuICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gdGhlIGlkIG9mIHRoZSBpbnN0YW5jZSB0byBiZSBkZWxldGVkXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBkZWxldGVFbnRyeSA9IGNyZWF0ZUFjdGlvbihBY3Rpb25UeXBlcy5ERUxFVEVfRU5UUlksIGlkID0+IGlkKTtcblxuLyoqXG4gKlxuICogUmVuYW1lIGFuIGluc3RhbmNlIGluIHRoZSByb290IHJlZHVjZXIsIGtlZXAgaXRzIGVudGlyZSBzdGF0ZVxuICpcbiAqIEBtZW1iZXJvZiByb290QWN0aW9uc1xuICogQHBhcmFtIHtzdHJpbmd9IG9sZElkIC0gKioqcmVxdWlyZWQqKiBvbGQgaWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBuZXdJZCAtICoqKnJlcXVpcmVkKiogbmV3IGlkXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCByZW5hbWVFbnRyeSA9IGNyZWF0ZUFjdGlvbihBY3Rpb25UeXBlcy5SRU5BTUVfRU5UUlksIChvbGRJZCwgbmV3SWQpID0+ICh7XG4gIG9sZElkLFxuICBuZXdJZFxufSkpO1xuXG4vKipcbiAqIFRoaXMgZGVjbGFyYXRpb24gaXMgbmVlZGVkIHRvIGdyb3VwIGFjdGlvbnMgaW4gZG9jc1xuICovXG4vKipcbiAqIFJvb3QgYWN0aW9ucyBtYW5hZ2VycyBhZGRpbmcgYW5kIHJlbW92aW5nIGluc3RhbmNlcyBpbiByb290IHJlZHVjZXIuXG4gKiBVbmRlci10aGUtaG9vZCwgd2hlbiBhIGBLZXBsZXJHbGAgY29tcG9uZW50IGlzIG1vdW50ZWQgb3IgdW5tb3VudGVkLFxuICogaXQgd2lsbCBhdXRvbWF0aWNhbGx5IGNhbGxzIHRoZXNlIGFjdGlvbnMgdG8gYWRkIGl0c2VsZiB0byB0aGUgcm9vdCByZWR1Y2VyLlxuICogSG93ZXZlciwgc29tZXRpbWVzIHRoZSBkYXRhIGlzIHJlYWR5IGJlZm9yZSB0aGUgY29tcG9uZW50IGlzIHJlZ2lzdGVyZWQgaW4gdGhlIHJlZHVjZXIsXG4gKiBpbiB0aGlzIGNhc2UsIHlvdSBjYW4gbWFudWFsbHkgY2FsbCB0aGVzZSBhY3Rpb25zIG9yIHRoZSBjb3JyZXNwb25kaW5nIHVwZGF0ZXIgdG8gYWRkIGl0IHRvIHRoZSByZWR1Y2VyLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbi8vIEB0cy1pZ25vcmVcbmNvbnN0IHJvb3RBY3Rpb25zID0gbnVsbDtcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiJdfQ==