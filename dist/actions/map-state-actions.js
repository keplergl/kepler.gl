"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleSplitMap = exports.updateMap = exports.fitBounds = exports.togglePerspective = void 0;

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
 * Toggle between 3d and 2d map.
 * @memberof mapStateActions
 * @public
 * @example
 * import {togglePerspective} from 'kepler.gl/actions';
 * this.props.dispatch(togglePerspective());
 */
var togglePerspective = (0, _reduxActions.createAction)(_actionTypes["default"].TOGGLE_PERSPECTIVE);
/**
 * Fit map viewport to bounds
 * @memberof mapStateActions
 * @param {Array<Number>} bounds as `[lngMin, latMin, lngMax, latMax]`
 * @public
 * @example
 * import {fitBounds} from 'kepler.gl/actions';
 * this.props.dispatch(fitBounds([-122.23, 37.127, -122.11, 37.456]));
 */

exports.togglePerspective = togglePerspective;
var fitBounds = (0, _reduxActions.createAction)(_actionTypes["default"].FIT_BOUNDS, function (bounds) {
  return bounds;
});
/**
 * Update map viewport
 * @memberof mapStateActions
 * @param {Object} viewport viewport object container one or any of these properties `width`, `height`, `latitude` `longitude`, `zoom`, `pitch`, `bearing`, `dragRotate`
 * @param {Number} [viewport.width] Width of viewport
 * @param {Number} [viewport.height] Height of viewport
 * @param {Number} [viewport.zoom] Zoom of viewport
 * @param {Number} [viewport.pitch] Camera angle in degrees (0 is straight down)
 * @param {Number} [viewport.bearing] Map rotation in degrees (0 means north is up)
 * @param {Number} [viewport.latitude] Latitude center of viewport on map in mercator projection
 * @param {Number} [viewport.longitude] Longitude Center of viewport on map in mercator projection
 * @param {boolean} [viewport.dragRotate] Whether to enable drag and rotate map into perspective viewport
 * @public
 * @example
 * import {updateMap} from 'kepler.gl/actions';
 * this.props.dispatch(updateMap({latitude: 37.75043, longitude: -122.34679, width: 800, height: 1200}));
 */

exports.fitBounds = fitBounds;
var updateMap = (0, _reduxActions.createAction)(_actionTypes["default"].UPDATE_MAP, function (viewport) {
  return viewport;
});
/**
 * Toggle between single map or split maps
 * @memberof mapStateActions
 * @param {Number} [index] index is provided, close split map at index
 * @public
 * @example
 * import {toggleSplitMap} from 'kepler.gl/actions';
 * this.props.dispatch(toggleSplitMap());
 */

exports.updateMap = updateMap;
var toggleSplitMap = (0, _reduxActions.createAction)(_actionTypes["default"].TOGGLE_SPLIT_MAP, function (index) {
  return index;
});
/**
 * This declaration is needed to group actions in docs
 */

/**
 * Actions handled mostly by  `mapState` reducer.
 * They manage map viewport update, toggle between 2d and 3d map,
 * toggle between single and split maps.
 *
 * @public
 */

/* eslint-disable no-unused-vars */
// @ts-ignore

exports.toggleSplitMap = toggleSplitMap;
var mapStateActions = null;
/* eslint-enable no-unused-vars */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL21hcC1zdGF0ZS1hY3Rpb25zLmpzIl0sIm5hbWVzIjpbInRvZ2dsZVBlcnNwZWN0aXZlIiwiQWN0aW9uVHlwZXMiLCJUT0dHTEVfUEVSU1BFQ1RJVkUiLCJmaXRCb3VuZHMiLCJGSVRfQk9VTkRTIiwiYm91bmRzIiwidXBkYXRlTWFwIiwiVVBEQVRFX01BUCIsInZpZXdwb3J0IiwidG9nZ2xlU3BsaXRNYXAiLCJUT0dHTEVfU1BMSVRfTUFQIiwiaW5kZXgiLCJtYXBTdGF0ZUFjdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sSUFBTUEsaUJBQWlCLEdBQUcsZ0NBQWFDLHdCQUFZQyxrQkFBekIsQ0FBMUI7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLElBQU1DLFNBQVMsR0FBRyxnQ0FBYUYsd0JBQVlHLFVBQXpCLEVBQXFDLFVBQUFDLE1BQU07QUFBQSxTQUFJQSxNQUFKO0FBQUEsQ0FBM0MsQ0FBbEI7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFFTyxJQUFNQyxTQUFTLEdBQUcsZ0NBQWFMLHdCQUFZTSxVQUF6QixFQUFxQyxVQUFBQyxRQUFRO0FBQUEsU0FBSUEsUUFBSjtBQUFBLENBQTdDLENBQWxCO0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxJQUFNQyxjQUFjLEdBQUcsZ0NBQWFSLHdCQUFZUyxnQkFBekIsRUFBMkMsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUo7QUFBQSxDQUFoRCxDQUF2QjtBQUVQO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBOzs7QUFDQSxJQUFNQyxlQUFlLEdBQUcsSUFBeEI7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7Y3JlYXRlQWN0aW9ufSBmcm9tICdyZWR1eC1hY3Rpb25zJztcbmltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICdjb25zdGFudHMvYWN0aW9uLXR5cGVzJztcblxuLyoqXG4gKlxuICogVG9nZ2xlIGJldHdlZW4gM2QgYW5kIDJkIG1hcC5cbiAqIEBtZW1iZXJvZiBtYXBTdGF0ZUFjdGlvbnNcbiAqIEBwdWJsaWNcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQge3RvZ2dsZVBlcnNwZWN0aXZlfSBmcm9tICdrZXBsZXIuZ2wvYWN0aW9ucyc7XG4gKiB0aGlzLnByb3BzLmRpc3BhdGNoKHRvZ2dsZVBlcnNwZWN0aXZlKCkpO1xuICovXG5leHBvcnQgY29uc3QgdG9nZ2xlUGVyc3BlY3RpdmUgPSBjcmVhdGVBY3Rpb24oQWN0aW9uVHlwZXMuVE9HR0xFX1BFUlNQRUNUSVZFKTtcblxuLyoqXG4gKiBGaXQgbWFwIHZpZXdwb3J0IHRvIGJvdW5kc1xuICogQG1lbWJlcm9mIG1hcFN0YXRlQWN0aW9uc1xuICogQHBhcmFtIHtBcnJheTxOdW1iZXI+fSBib3VuZHMgYXMgYFtsbmdNaW4sIGxhdE1pbiwgbG5nTWF4LCBsYXRNYXhdYFxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7Zml0Qm91bmRzfSBmcm9tICdrZXBsZXIuZ2wvYWN0aW9ucyc7XG4gKiB0aGlzLnByb3BzLmRpc3BhdGNoKGZpdEJvdW5kcyhbLTEyMi4yMywgMzcuMTI3LCAtMTIyLjExLCAzNy40NTZdKSk7XG4gKi9cbmV4cG9ydCBjb25zdCBmaXRCb3VuZHMgPSBjcmVhdGVBY3Rpb24oQWN0aW9uVHlwZXMuRklUX0JPVU5EUywgYm91bmRzID0+IGJvdW5kcyk7XG5cbi8qKlxuICogVXBkYXRlIG1hcCB2aWV3cG9ydFxuICogQG1lbWJlcm9mIG1hcFN0YXRlQWN0aW9uc1xuICogQHBhcmFtIHtPYmplY3R9IHZpZXdwb3J0IHZpZXdwb3J0IG9iamVjdCBjb250YWluZXIgb25lIG9yIGFueSBvZiB0aGVzZSBwcm9wZXJ0aWVzIGB3aWR0aGAsIGBoZWlnaHRgLCBgbGF0aXR1ZGVgIGBsb25naXR1ZGVgLCBgem9vbWAsIGBwaXRjaGAsIGBiZWFyaW5nYCwgYGRyYWdSb3RhdGVgXG4gKiBAcGFyYW0ge051bWJlcn0gW3ZpZXdwb3J0LndpZHRoXSBXaWR0aCBvZiB2aWV3cG9ydFxuICogQHBhcmFtIHtOdW1iZXJ9IFt2aWV3cG9ydC5oZWlnaHRdIEhlaWdodCBvZiB2aWV3cG9ydFxuICogQHBhcmFtIHtOdW1iZXJ9IFt2aWV3cG9ydC56b29tXSBab29tIG9mIHZpZXdwb3J0XG4gKiBAcGFyYW0ge051bWJlcn0gW3ZpZXdwb3J0LnBpdGNoXSBDYW1lcmEgYW5nbGUgaW4gZGVncmVlcyAoMCBpcyBzdHJhaWdodCBkb3duKVxuICogQHBhcmFtIHtOdW1iZXJ9IFt2aWV3cG9ydC5iZWFyaW5nXSBNYXAgcm90YXRpb24gaW4gZGVncmVlcyAoMCBtZWFucyBub3J0aCBpcyB1cClcbiAqIEBwYXJhbSB7TnVtYmVyfSBbdmlld3BvcnQubGF0aXR1ZGVdIExhdGl0dWRlIGNlbnRlciBvZiB2aWV3cG9ydCBvbiBtYXAgaW4gbWVyY2F0b3IgcHJvamVjdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IFt2aWV3cG9ydC5sb25naXR1ZGVdIExvbmdpdHVkZSBDZW50ZXIgb2Ygdmlld3BvcnQgb24gbWFwIGluIG1lcmNhdG9yIHByb2plY3Rpb25cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3ZpZXdwb3J0LmRyYWdSb3RhdGVdIFdoZXRoZXIgdG8gZW5hYmxlIGRyYWcgYW5kIHJvdGF0ZSBtYXAgaW50byBwZXJzcGVjdGl2ZSB2aWV3cG9ydFxuICogQHB1YmxpY1xuICogQGV4YW1wbGVcbiAqIGltcG9ydCB7dXBkYXRlTWFwfSBmcm9tICdrZXBsZXIuZ2wvYWN0aW9ucyc7XG4gKiB0aGlzLnByb3BzLmRpc3BhdGNoKHVwZGF0ZU1hcCh7bGF0aXR1ZGU6IDM3Ljc1MDQzLCBsb25naXR1ZGU6IC0xMjIuMzQ2NzksIHdpZHRoOiA4MDAsIGhlaWdodDogMTIwMH0pKTtcbiAqL1xuXG5leHBvcnQgY29uc3QgdXBkYXRlTWFwID0gY3JlYXRlQWN0aW9uKEFjdGlvblR5cGVzLlVQREFURV9NQVAsIHZpZXdwb3J0ID0+IHZpZXdwb3J0KTtcblxuLyoqXG4gKiBUb2dnbGUgYmV0d2VlbiBzaW5nbGUgbWFwIG9yIHNwbGl0IG1hcHNcbiAqIEBtZW1iZXJvZiBtYXBTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbaW5kZXhdIGluZGV4IGlzIHByb3ZpZGVkLCBjbG9zZSBzcGxpdCBtYXAgYXQgaW5kZXhcbiAqIEBwdWJsaWNcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQge3RvZ2dsZVNwbGl0TWFwfSBmcm9tICdrZXBsZXIuZ2wvYWN0aW9ucyc7XG4gKiB0aGlzLnByb3BzLmRpc3BhdGNoKHRvZ2dsZVNwbGl0TWFwKCkpO1xuICovXG5leHBvcnQgY29uc3QgdG9nZ2xlU3BsaXRNYXAgPSBjcmVhdGVBY3Rpb24oQWN0aW9uVHlwZXMuVE9HR0xFX1NQTElUX01BUCwgaW5kZXggPT4gaW5kZXgpO1xuXG4vKipcbiAqIFRoaXMgZGVjbGFyYXRpb24gaXMgbmVlZGVkIHRvIGdyb3VwIGFjdGlvbnMgaW4gZG9jc1xuICovXG4vKipcbiAqIEFjdGlvbnMgaGFuZGxlZCBtb3N0bHkgYnkgIGBtYXBTdGF0ZWAgcmVkdWNlci5cbiAqIFRoZXkgbWFuYWdlIG1hcCB2aWV3cG9ydCB1cGRhdGUsIHRvZ2dsZSBiZXR3ZWVuIDJkIGFuZCAzZCBtYXAsXG4gKiB0b2dnbGUgYmV0d2VlbiBzaW5nbGUgYW5kIHNwbGl0IG1hcHMuXG4gKlxuICogQHB1YmxpY1xuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuLy8gQHRzLWlnbm9yZVxuY29uc3QgbWFwU3RhdGVBY3Rpb25zID0gbnVsbDtcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiJdfQ==