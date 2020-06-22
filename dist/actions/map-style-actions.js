"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set3dBuildingColor = exports.loadCustomMapStyle = exports.mapStyleChange = exports.loadMapStyleErr = exports.loadMapStyles = exports.requestMapStyles = exports.mapConfigChange = exports.inputMapStyle = exports.addCustomMapStyle = void 0;

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
 * Add map style from user input to reducer and set it to current style
 * This action is called when user click confirm after putting in a valid style url in the custom map style dialog.
 * It should not be called from outside kepler.gl without a valid `inputStyle` in the `mapStyle` reducer.
 * param {void}
 * @memberof mapStyleActions
 * @type {typeof import('./map-style-actions').addCustomMapStyle}
 * @public
 */
var addCustomMapStyle = (0, _reduxActions.createAction)(_actionTypes["default"].ADD_CUSTOM_MAP_STYLE);
/**
 * Input a custom map style object
 * @memberof mapStyleActions
 * @param inputStyle
 * @param inputStyle.url - style url e.g. `'mapbox://styles/heshan/xxxxxyyyyzzz'`
 * @param inputStyle.id - style id e.g. `'custom_style_1'`
 * @param inputStyle.style - actual mapbox style json
 * @param inputStyle.label - style name
 * @param inputStyle.accessToken - mapbox access token
 * @param inputStyle.icon - icon image data url
 * @param [mapState] - mapState is optional
 * @type {typeof import('./map-style-actions').inputMapStyle}
 * @public
 */

exports.addCustomMapStyle = addCustomMapStyle;
var inputMapStyle = (0, _reduxActions.createAction)(_actionTypes["default"].INPUT_MAP_STYLE, function (inputStyle, mapState) {
  return {
    inputStyle: inputStyle,
    mapState: mapState
  };
});
/**
 * Update `visibleLayerGroups`to change layer group visibility
 * @memberof mapStyleActions
 * @param mapStyle new config `{visibleLayerGroups: {label: false, road: true, background: true}}`
 * @type {typeof import('./map-style-actions').mapConfigChange}
 * @public
 */

exports.inputMapStyle = inputMapStyle;
var mapConfigChange = (0, _reduxActions.createAction)(_actionTypes["default"].MAP_CONFIG_CHANGE, function (mapStyle) {
  return mapStyle;
});
/**
 * Request map style style object based on style.url.
 * @memberof mapStyleActions
 * @type {typeof import('./map-style-actions').requestMapStyles}
 * @public
 */

exports.mapConfigChange = mapConfigChange;
var requestMapStyles = (0, _reduxActions.createAction)(_actionTypes["default"].REQUEST_MAP_STYLES, function (mapStyles) {
  return mapStyles;
});
/**
 * Callback when load map style success
 * @memberof mapStyleActions
 * @param newStyles a `{[id]: style}` mapping
 * @type {typeof import('./map-style-actions').loadMapStyles}
 * @public
 */

exports.requestMapStyles = requestMapStyles;
var loadMapStyles = (0, _reduxActions.createAction)(_actionTypes["default"].LOAD_MAP_STYLES, function (newStyles) {
  return newStyles;
});
/**
 * Callback when load map style error
 * @memberof mapStyleActions
 * @param error
 * @type {typeof import('./map-style-actions').loadMapStyleErr}
 * @public
 */

exports.loadMapStyles = loadMapStyles;
var loadMapStyleErr = (0, _reduxActions.createAction)(_actionTypes["default"].LOAD_MAP_STYLE_ERR, function (error) {
  return error;
});
/**
 * Change to another map style. The selected style should already been loaded into `mapStyle.mapStyles`
 * @memberof mapStyleActions
 * @param styleType the style to change to
 * @type {typeof import('./map-style-actions').mapStyleChange}
 * @public
 */

exports.loadMapStyleErr = loadMapStyleErr;
var mapStyleChange = (0, _reduxActions.createAction)(_actionTypes["default"].MAP_STYLE_CHANGE, function (styleType) {
  return styleType;
});
/**
 * Callback when a custom map style object is received
 * @memberof mapStyleActions
 * @param customMapStyle
 * @param customMapStyle.icon
 * @param customMapStyle.style
 * @param customMapStyle.error
 * @type {typeof import('./map-style-actions').loadCustomMapStyle}
 * @public
 */

exports.mapStyleChange = mapStyleChange;
var loadCustomMapStyle = (0, _reduxActions.createAction)(_actionTypes["default"].LOAD_CUSTOM_MAP_STYLE, function (customMapStyle) {
  return customMapStyle;
}); // SET_3D_BUILDING_COLOR

/**
 * Set 3d building layer group color
 * @memberof mapStyleActions
 * @param color - [r, g, b]
 * @type {typeof import('./map-style-actions').set3dBuildingColor}
 * @public
 */

exports.loadCustomMapStyle = loadCustomMapStyle;
var set3dBuildingColor = (0, _reduxActions.createAction)(_actionTypes["default"].SET_3D_BUILDING_COLOR, function (color) {
  return color;
});
/**
 * Actions handled mostly by  `mapStyle` reducer.
 * They manage the display of base map, such as loading and receiving base map styles,
 * hiding and showing map layers, user input of custom map style url.
 *
 * @public
 */

/* eslint-disable no-unused-vars */
// @ts-ignore

exports.set3dBuildingColor = set3dBuildingColor;
var mapStyleActions = null;
/* eslint-enable no-unused-vars */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL21hcC1zdHlsZS1hY3Rpb25zLmpzIl0sIm5hbWVzIjpbImFkZEN1c3RvbU1hcFN0eWxlIiwiQWN0aW9uVHlwZXMiLCJBRERfQ1VTVE9NX01BUF9TVFlMRSIsImlucHV0TWFwU3R5bGUiLCJJTlBVVF9NQVBfU1RZTEUiLCJpbnB1dFN0eWxlIiwibWFwU3RhdGUiLCJtYXBDb25maWdDaGFuZ2UiLCJNQVBfQ09ORklHX0NIQU5HRSIsIm1hcFN0eWxlIiwicmVxdWVzdE1hcFN0eWxlcyIsIlJFUVVFU1RfTUFQX1NUWUxFUyIsIm1hcFN0eWxlcyIsImxvYWRNYXBTdHlsZXMiLCJMT0FEX01BUF9TVFlMRVMiLCJuZXdTdHlsZXMiLCJsb2FkTWFwU3R5bGVFcnIiLCJMT0FEX01BUF9TVFlMRV9FUlIiLCJlcnJvciIsIm1hcFN0eWxlQ2hhbmdlIiwiTUFQX1NUWUxFX0NIQU5HRSIsInN0eWxlVHlwZSIsImxvYWRDdXN0b21NYXBTdHlsZSIsIkxPQURfQ1VTVE9NX01BUF9TVFlMRSIsImN1c3RvbU1hcFN0eWxlIiwic2V0M2RCdWlsZGluZ0NvbG9yIiwiU0VUXzNEX0JVSUxESU5HX0NPTE9SIiwiY29sb3IiLCJtYXBTdHlsZUFjdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBS0E7Ozs7Ozs7OztBQVNPLElBQU1BLGlCQUFpQixHQUFHLGdDQUFhQyx3QkFBWUMsb0JBQXpCLENBQTFCO0FBRVA7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjTyxJQUFNQyxhQUFhLEdBQUcsZ0NBQWFGLHdCQUFZRyxlQUF6QixFQUEwQyxVQUFDQyxVQUFELEVBQWFDLFFBQWI7QUFBQSxTQUEyQjtBQUNoR0QsSUFBQUEsVUFBVSxFQUFWQSxVQURnRztBQUVoR0MsSUFBQUEsUUFBUSxFQUFSQTtBQUZnRyxHQUEzQjtBQUFBLENBQTFDLENBQXRCO0FBS1A7Ozs7Ozs7OztBQU9PLElBQU1DLGVBQWUsR0FBRyxnQ0FBYU4sd0JBQVlPLGlCQUF6QixFQUE0QyxVQUFBQyxRQUFRO0FBQUEsU0FBSUEsUUFBSjtBQUFBLENBQXBELENBQXhCO0FBRVA7Ozs7Ozs7O0FBTU8sSUFBTUMsZ0JBQWdCLEdBQUcsZ0NBQzlCVCx3QkFBWVUsa0JBRGtCLEVBRTlCLFVBQUFDLFNBQVM7QUFBQSxTQUFJQSxTQUFKO0FBQUEsQ0FGcUIsQ0FBekI7QUFJUDs7Ozs7Ozs7O0FBT08sSUFBTUMsYUFBYSxHQUFHLGdDQUFhWix3QkFBWWEsZUFBekIsRUFBMEMsVUFBQUMsU0FBUztBQUFBLFNBQUlBLFNBQUo7QUFBQSxDQUFuRCxDQUF0QjtBQUVQOzs7Ozs7Ozs7QUFPTyxJQUFNQyxlQUFlLEdBQUcsZ0NBQWFmLHdCQUFZZ0Isa0JBQXpCLEVBQTZDLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFKO0FBQUEsQ0FBbEQsQ0FBeEI7QUFFUDs7Ozs7Ozs7O0FBT08sSUFBTUMsY0FBYyxHQUFHLGdDQUFhbEIsd0JBQVltQixnQkFBekIsRUFBMkMsVUFBQUMsU0FBUztBQUFBLFNBQUlBLFNBQUo7QUFBQSxDQUFwRCxDQUF2QjtBQUVQOzs7Ozs7Ozs7Ozs7QUFVTyxJQUFNQyxrQkFBa0IsR0FBRyxnQ0FDaENyQix3QkFBWXNCLHFCQURvQixFQUVoQyxVQUFBQyxjQUFjO0FBQUEsU0FBSUEsY0FBSjtBQUFBLENBRmtCLENBQTNCLEMsQ0FLUDs7QUFDQTs7Ozs7Ozs7O0FBT08sSUFBTUMsa0JBQWtCLEdBQUcsZ0NBQWF4Qix3QkFBWXlCLHFCQUF6QixFQUFnRCxVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSjtBQUFBLENBQXJELENBQTNCO0FBRVA7Ozs7Ozs7O0FBT0E7QUFDQTs7O0FBQ0EsSUFBTUMsZUFBZSxHQUFHLElBQXhCO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge2NyZWF0ZUFjdGlvbn0gZnJvbSAncmVkdXgtYWN0aW9ucyc7XG5pbXBvcnQgQWN0aW9uVHlwZXMgZnJvbSAnY29uc3RhbnRzL2FjdGlvbi10eXBlcyc7XG5cbi8qKlxuICogQWRkIG1hcCBzdHlsZSBmcm9tIHVzZXIgaW5wdXQgdG8gcmVkdWNlciBhbmQgc2V0IGl0IHRvIGN1cnJlbnQgc3R5bGVcbiAqIFRoaXMgYWN0aW9uIGlzIGNhbGxlZCB3aGVuIHVzZXIgY2xpY2sgY29uZmlybSBhZnRlciBwdXR0aW5nIGluIGEgdmFsaWQgc3R5bGUgdXJsIGluIHRoZSBjdXN0b20gbWFwIHN0eWxlIGRpYWxvZy5cbiAqIEl0IHNob3VsZCBub3QgYmUgY2FsbGVkIGZyb20gb3V0c2lkZSBrZXBsZXIuZ2wgd2l0aG91dCBhIHZhbGlkIGBpbnB1dFN0eWxlYCBpbiB0aGUgYG1hcFN0eWxlYCByZWR1Y2VyLlxuICogcGFyYW0ge3ZvaWR9XG4gKiBAbWVtYmVyb2YgbWFwU3R5bGVBY3Rpb25zXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3R5bGUtYWN0aW9ucycpLmFkZEN1c3RvbU1hcFN0eWxlfVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgYWRkQ3VzdG9tTWFwU3R5bGUgPSBjcmVhdGVBY3Rpb24oQWN0aW9uVHlwZXMuQUREX0NVU1RPTV9NQVBfU1RZTEUpO1xuXG4vKipcbiAqIElucHV0IGEgY3VzdG9tIG1hcCBzdHlsZSBvYmplY3RcbiAqIEBtZW1iZXJvZiBtYXBTdHlsZUFjdGlvbnNcbiAqIEBwYXJhbSBpbnB1dFN0eWxlXG4gKiBAcGFyYW0gaW5wdXRTdHlsZS51cmwgLSBzdHlsZSB1cmwgZS5nLiBgJ21hcGJveDovL3N0eWxlcy9oZXNoYW4veHh4eHh5eXl5enp6J2BcbiAqIEBwYXJhbSBpbnB1dFN0eWxlLmlkIC0gc3R5bGUgaWQgZS5nLiBgJ2N1c3RvbV9zdHlsZV8xJ2BcbiAqIEBwYXJhbSBpbnB1dFN0eWxlLnN0eWxlIC0gYWN0dWFsIG1hcGJveCBzdHlsZSBqc29uXG4gKiBAcGFyYW0gaW5wdXRTdHlsZS5sYWJlbCAtIHN0eWxlIG5hbWVcbiAqIEBwYXJhbSBpbnB1dFN0eWxlLmFjY2Vzc1Rva2VuIC0gbWFwYm94IGFjY2VzcyB0b2tlblxuICogQHBhcmFtIGlucHV0U3R5bGUuaWNvbiAtIGljb24gaW1hZ2UgZGF0YSB1cmxcbiAqIEBwYXJhbSBbbWFwU3RhdGVdIC0gbWFwU3RhdGUgaXMgb3B0aW9uYWxcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdHlsZS1hY3Rpb25zJykuaW5wdXRNYXBTdHlsZX1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGlucHV0TWFwU3R5bGUgPSBjcmVhdGVBY3Rpb24oQWN0aW9uVHlwZXMuSU5QVVRfTUFQX1NUWUxFLCAoaW5wdXRTdHlsZSwgbWFwU3RhdGUpID0+ICh7XG4gIGlucHV0U3R5bGUsXG4gIG1hcFN0YXRlXG59KSk7XG5cbi8qKlxuICogVXBkYXRlIGB2aXNpYmxlTGF5ZXJHcm91cHNgdG8gY2hhbmdlIGxheWVyIGdyb3VwIHZpc2liaWxpdHlcbiAqIEBtZW1iZXJvZiBtYXBTdHlsZUFjdGlvbnNcbiAqIEBwYXJhbSBtYXBTdHlsZSBuZXcgY29uZmlnIGB7dmlzaWJsZUxheWVyR3JvdXBzOiB7bGFiZWw6IGZhbHNlLCByb2FkOiB0cnVlLCBiYWNrZ3JvdW5kOiB0cnVlfX1gXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3R5bGUtYWN0aW9ucycpLm1hcENvbmZpZ0NoYW5nZX1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IG1hcENvbmZpZ0NoYW5nZSA9IGNyZWF0ZUFjdGlvbihBY3Rpb25UeXBlcy5NQVBfQ09ORklHX0NIQU5HRSwgbWFwU3R5bGUgPT4gbWFwU3R5bGUpO1xuXG4vKipcbiAqIFJlcXVlc3QgbWFwIHN0eWxlIHN0eWxlIG9iamVjdCBiYXNlZCBvbiBzdHlsZS51cmwuXG4gKiBAbWVtYmVyb2YgbWFwU3R5bGVBY3Rpb25zXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3R5bGUtYWN0aW9ucycpLnJlcXVlc3RNYXBTdHlsZXN9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCByZXF1ZXN0TWFwU3R5bGVzID0gY3JlYXRlQWN0aW9uKFxuICBBY3Rpb25UeXBlcy5SRVFVRVNUX01BUF9TVFlMRVMsXG4gIG1hcFN0eWxlcyA9PiBtYXBTdHlsZXNcbik7XG4vKipcbiAqIENhbGxiYWNrIHdoZW4gbG9hZCBtYXAgc3R5bGUgc3VjY2Vzc1xuICogQG1lbWJlcm9mIG1hcFN0eWxlQWN0aW9uc1xuICogQHBhcmFtIG5ld1N0eWxlcyBhIGB7W2lkXTogc3R5bGV9YCBtYXBwaW5nXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3R5bGUtYWN0aW9ucycpLmxvYWRNYXBTdHlsZXN9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBsb2FkTWFwU3R5bGVzID0gY3JlYXRlQWN0aW9uKEFjdGlvblR5cGVzLkxPQURfTUFQX1NUWUxFUywgbmV3U3R5bGVzID0+IG5ld1N0eWxlcyk7XG5cbi8qKlxuICogQ2FsbGJhY2sgd2hlbiBsb2FkIG1hcCBzdHlsZSBlcnJvclxuICogQG1lbWJlcm9mIG1hcFN0eWxlQWN0aW9uc1xuICogQHBhcmFtIGVycm9yXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3R5bGUtYWN0aW9ucycpLmxvYWRNYXBTdHlsZUVycn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGxvYWRNYXBTdHlsZUVyciA9IGNyZWF0ZUFjdGlvbihBY3Rpb25UeXBlcy5MT0FEX01BUF9TVFlMRV9FUlIsIGVycm9yID0+IGVycm9yKTtcblxuLyoqXG4gKiBDaGFuZ2UgdG8gYW5vdGhlciBtYXAgc3R5bGUuIFRoZSBzZWxlY3RlZCBzdHlsZSBzaG91bGQgYWxyZWFkeSBiZWVuIGxvYWRlZCBpbnRvIGBtYXBTdHlsZS5tYXBTdHlsZXNgXG4gKiBAbWVtYmVyb2YgbWFwU3R5bGVBY3Rpb25zXG4gKiBAcGFyYW0gc3R5bGVUeXBlIHRoZSBzdHlsZSB0byBjaGFuZ2UgdG9cbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1zdHlsZS1hY3Rpb25zJykubWFwU3R5bGVDaGFuZ2V9XG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBtYXBTdHlsZUNoYW5nZSA9IGNyZWF0ZUFjdGlvbihBY3Rpb25UeXBlcy5NQVBfU1RZTEVfQ0hBTkdFLCBzdHlsZVR5cGUgPT4gc3R5bGVUeXBlKTtcblxuLyoqXG4gKiBDYWxsYmFjayB3aGVuIGEgY3VzdG9tIG1hcCBzdHlsZSBvYmplY3QgaXMgcmVjZWl2ZWRcbiAqIEBtZW1iZXJvZiBtYXBTdHlsZUFjdGlvbnNcbiAqIEBwYXJhbSBjdXN0b21NYXBTdHlsZVxuICogQHBhcmFtIGN1c3RvbU1hcFN0eWxlLmljb25cbiAqIEBwYXJhbSBjdXN0b21NYXBTdHlsZS5zdHlsZVxuICogQHBhcmFtIGN1c3RvbU1hcFN0eWxlLmVycm9yXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3R5bGUtYWN0aW9ucycpLmxvYWRDdXN0b21NYXBTdHlsZX1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IGxvYWRDdXN0b21NYXBTdHlsZSA9IGNyZWF0ZUFjdGlvbihcbiAgQWN0aW9uVHlwZXMuTE9BRF9DVVNUT01fTUFQX1NUWUxFLFxuICBjdXN0b21NYXBTdHlsZSA9PiBjdXN0b21NYXBTdHlsZVxuKTtcblxuLy8gU0VUXzNEX0JVSUxESU5HX0NPTE9SXG4vKipcbiAqIFNldCAzZCBidWlsZGluZyBsYXllciBncm91cCBjb2xvclxuICogQG1lbWJlcm9mIG1hcFN0eWxlQWN0aW9uc1xuICogQHBhcmFtIGNvbG9yIC0gW3IsIGcsIGJdXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtc3R5bGUtYWN0aW9ucycpLnNldDNkQnVpbGRpbmdDb2xvcn1cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHNldDNkQnVpbGRpbmdDb2xvciA9IGNyZWF0ZUFjdGlvbihBY3Rpb25UeXBlcy5TRVRfM0RfQlVJTERJTkdfQ09MT1IsIGNvbG9yID0+IGNvbG9yKTtcblxuLyoqXG4gKiBBY3Rpb25zIGhhbmRsZWQgbW9zdGx5IGJ5ICBgbWFwU3R5bGVgIHJlZHVjZXIuXG4gKiBUaGV5IG1hbmFnZSB0aGUgZGlzcGxheSBvZiBiYXNlIG1hcCwgc3VjaCBhcyBsb2FkaW5nIGFuZCByZWNlaXZpbmcgYmFzZSBtYXAgc3R5bGVzLFxuICogaGlkaW5nIGFuZCBzaG93aW5nIG1hcCBsYXllcnMsIHVzZXIgaW5wdXQgb2YgY3VzdG9tIG1hcCBzdHlsZSB1cmwuXG4gKlxuICogQHB1YmxpY1xuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuLy8gQHRzLWlnbm9yZVxuY29uc3QgbWFwU3R5bGVBY3Rpb25zID0gbnVsbDtcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiJdfQ==