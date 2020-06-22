"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleSplitMap = exports.updateMap = exports.fitBounds = exports.togglePerspective = void 0;

var _reduxActions = require("redux-actions");

var _actionTypes = _interopRequireDefault(require("../constants/action-types"));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL21hcC1zdGF0ZS1hY3Rpb25zLmpzIl0sIm5hbWVzIjpbInRvZ2dsZVBlcnNwZWN0aXZlIiwiQWN0aW9uVHlwZXMiLCJUT0dHTEVfUEVSU1BFQ1RJVkUiLCJmaXRCb3VuZHMiLCJGSVRfQk9VTkRTIiwiYm91bmRzIiwidXBkYXRlTWFwIiwiVVBEQVRFX01BUCIsInZpZXdwb3J0IiwidG9nZ2xlU3BsaXRNYXAiLCJUT0dHTEVfU1BMSVRfTUFQIiwiaW5kZXgiLCJtYXBTdGF0ZUFjdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBS0E7Ozs7Ozs7OztBQVNPLElBQU1BLGlCQUFpQixHQUFHLGdDQUFhQyx3QkFBWUMsa0JBQXpCLENBQTFCO0FBRVA7Ozs7Ozs7Ozs7O0FBU08sSUFBTUMsU0FBUyxHQUFHLGdDQUFhRix3QkFBWUcsVUFBekIsRUFBcUMsVUFBQUMsTUFBTTtBQUFBLFNBQUlBLE1BQUo7QUFBQSxDQUEzQyxDQUFsQjtBQUVQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JPLElBQU1DLFNBQVMsR0FBRyxnQ0FBYUwsd0JBQVlNLFVBQXpCLEVBQXFDLFVBQUFDLFFBQVE7QUFBQSxTQUFJQSxRQUFKO0FBQUEsQ0FBN0MsQ0FBbEI7QUFFUDs7Ozs7Ozs7Ozs7QUFTTyxJQUFNQyxjQUFjLEdBQUcsZ0NBQWFSLHdCQUFZUyxnQkFBekIsRUFBMkMsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUo7QUFBQSxDQUFoRCxDQUF2QjtBQUVQOzs7O0FBR0E7Ozs7Ozs7O0FBT0E7QUFDQTs7O0FBQ0EsSUFBTUMsZUFBZSxHQUFHLElBQXhCO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge2NyZWF0ZUFjdGlvbn0gZnJvbSAncmVkdXgtYWN0aW9ucyc7XG5pbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnY29uc3RhbnRzL2FjdGlvbi10eXBlcyc7XG5cbi8qKlxuICpcbiAqIFRvZ2dsZSBiZXR3ZWVuIDNkIGFuZCAyZCBtYXAuXG4gKiBAbWVtYmVyb2YgbWFwU3RhdGVBY3Rpb25zXG4gKiBAcHVibGljXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHt0b2dnbGVQZXJzcGVjdGl2ZX0gZnJvbSAna2VwbGVyLmdsL2FjdGlvbnMnO1xuICogdGhpcy5wcm9wcy5kaXNwYXRjaCh0b2dnbGVQZXJzcGVjdGl2ZSgpKTtcbiAqL1xuZXhwb3J0IGNvbnN0IHRvZ2dsZVBlcnNwZWN0aXZlID0gY3JlYXRlQWN0aW9uKEFjdGlvblR5cGVzLlRPR0dMRV9QRVJTUEVDVElWRSk7XG5cbi8qKlxuICogRml0IG1hcCB2aWV3cG9ydCB0byBib3VuZHNcbiAqIEBtZW1iZXJvZiBtYXBTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSB7QXJyYXk8TnVtYmVyPn0gYm91bmRzIGFzIGBbbG5nTWluLCBsYXRNaW4sIGxuZ01heCwgbGF0TWF4XWBcbiAqIEBwdWJsaWNcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQge2ZpdEJvdW5kc30gZnJvbSAna2VwbGVyLmdsL2FjdGlvbnMnO1xuICogdGhpcy5wcm9wcy5kaXNwYXRjaChmaXRCb3VuZHMoWy0xMjIuMjMsIDM3LjEyNywgLTEyMi4xMSwgMzcuNDU2XSkpO1xuICovXG5leHBvcnQgY29uc3QgZml0Qm91bmRzID0gY3JlYXRlQWN0aW9uKEFjdGlvblR5cGVzLkZJVF9CT1VORFMsIGJvdW5kcyA9PiBib3VuZHMpO1xuXG4vKipcbiAqIFVwZGF0ZSBtYXAgdmlld3BvcnRcbiAqIEBtZW1iZXJvZiBtYXBTdGF0ZUFjdGlvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSB2aWV3cG9ydCB2aWV3cG9ydCBvYmplY3QgY29udGFpbmVyIG9uZSBvciBhbnkgb2YgdGhlc2UgcHJvcGVydGllcyBgd2lkdGhgLCBgaGVpZ2h0YCwgYGxhdGl0dWRlYCBgbG9uZ2l0dWRlYCwgYHpvb21gLCBgcGl0Y2hgLCBgYmVhcmluZ2AsIGBkcmFnUm90YXRlYFxuICogQHBhcmFtIHtOdW1iZXJ9IFt2aWV3cG9ydC53aWR0aF0gV2lkdGggb2Ygdmlld3BvcnRcbiAqIEBwYXJhbSB7TnVtYmVyfSBbdmlld3BvcnQuaGVpZ2h0XSBIZWlnaHQgb2Ygdmlld3BvcnRcbiAqIEBwYXJhbSB7TnVtYmVyfSBbdmlld3BvcnQuem9vbV0gWm9vbSBvZiB2aWV3cG9ydFxuICogQHBhcmFtIHtOdW1iZXJ9IFt2aWV3cG9ydC5waXRjaF0gQ2FtZXJhIGFuZ2xlIGluIGRlZ3JlZXMgKDAgaXMgc3RyYWlnaHQgZG93bilcbiAqIEBwYXJhbSB7TnVtYmVyfSBbdmlld3BvcnQuYmVhcmluZ10gTWFwIHJvdGF0aW9uIGluIGRlZ3JlZXMgKDAgbWVhbnMgbm9ydGggaXMgdXApXG4gKiBAcGFyYW0ge051bWJlcn0gW3ZpZXdwb3J0LmxhdGl0dWRlXSBMYXRpdHVkZSBjZW50ZXIgb2Ygdmlld3BvcnQgb24gbWFwIGluIG1lcmNhdG9yIHByb2plY3Rpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBbdmlld3BvcnQubG9uZ2l0dWRlXSBMb25naXR1ZGUgQ2VudGVyIG9mIHZpZXdwb3J0IG9uIG1hcCBpbiBtZXJjYXRvciBwcm9qZWN0aW9uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFt2aWV3cG9ydC5kcmFnUm90YXRlXSBXaGV0aGVyIHRvIGVuYWJsZSBkcmFnIGFuZCByb3RhdGUgbWFwIGludG8gcGVyc3BlY3RpdmUgdmlld3BvcnRcbiAqIEBwdWJsaWNcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQge3VwZGF0ZU1hcH0gZnJvbSAna2VwbGVyLmdsL2FjdGlvbnMnO1xuICogdGhpcy5wcm9wcy5kaXNwYXRjaCh1cGRhdGVNYXAoe2xhdGl0dWRlOiAzNy43NTA0MywgbG9uZ2l0dWRlOiAtMTIyLjM0Njc5LCB3aWR0aDogODAwLCBoZWlnaHQ6IDEyMDB9KSk7XG4gKi9cblxuZXhwb3J0IGNvbnN0IHVwZGF0ZU1hcCA9IGNyZWF0ZUFjdGlvbihBY3Rpb25UeXBlcy5VUERBVEVfTUFQLCB2aWV3cG9ydCA9PiB2aWV3cG9ydCk7XG5cbi8qKlxuICogVG9nZ2xlIGJldHdlZW4gc2luZ2xlIG1hcCBvciBzcGxpdCBtYXBzXG4gKiBAbWVtYmVyb2YgbWFwU3RhdGVBY3Rpb25zXG4gKiBAcGFyYW0ge051bWJlcn0gW2luZGV4XSBpbmRleCBpcyBwcm92aWRlZCwgY2xvc2Ugc3BsaXQgbWFwIGF0IGluZGV4XG4gKiBAcHVibGljXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHt0b2dnbGVTcGxpdE1hcH0gZnJvbSAna2VwbGVyLmdsL2FjdGlvbnMnO1xuICogdGhpcy5wcm9wcy5kaXNwYXRjaCh0b2dnbGVTcGxpdE1hcCgpKTtcbiAqL1xuZXhwb3J0IGNvbnN0IHRvZ2dsZVNwbGl0TWFwID0gY3JlYXRlQWN0aW9uKEFjdGlvblR5cGVzLlRPR0dMRV9TUExJVF9NQVAsIGluZGV4ID0+IGluZGV4KTtcblxuLyoqXG4gKiBUaGlzIGRlY2xhcmF0aW9uIGlzIG5lZWRlZCB0byBncm91cCBhY3Rpb25zIGluIGRvY3NcbiAqL1xuLyoqXG4gKiBBY3Rpb25zIGhhbmRsZWQgbW9zdGx5IGJ5ICBgbWFwU3RhdGVgIHJlZHVjZXIuXG4gKiBUaGV5IG1hbmFnZSBtYXAgdmlld3BvcnQgdXBkYXRlLCB0b2dnbGUgYmV0d2VlbiAyZCBhbmQgM2QgbWFwLFxuICogdG9nZ2xlIGJldHdlZW4gc2luZ2xlIGFuZCBzcGxpdCBtYXBzLlxuICpcbiAqIEBwdWJsaWNcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbi8vIEB0cy1pZ25vcmVcbmNvbnN0IG1hcFN0YXRlQWN0aW9ucyA9IG51bGw7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4iXX0=