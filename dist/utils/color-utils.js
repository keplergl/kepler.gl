"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexToRgb = hexToRgb;
exports.isHexColor = isHexColor;
exports.rgbToHex = rgbToHex;
exports.getColorGroupByName = getColorGroupByName;
exports.reverseColorRange = reverseColorRange;
exports.createLinearGradient = createLinearGradient;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

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

/**
 * get r g b from hex code
 *
 * @param {string} hex
 * @returns {import('reducers/types').RGBColor} array of r g bs
 */
function hexToRgb(hex) {
  var result = isHexColor(hex);

  if (!result) {
    return [0, 0, 0];
  }

  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);
  return [r, g, b];
}

function isHexColor(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result;
}

function PadNum(c) {
  var hex = c.toString(16);
  return hex.length === 1 ? "0".concat(hex) : hex;
}
/**
 * get hex from r g b
 *
 * @param {array} rgb
 * @returns {string} hex string
 */


function rgbToHex(_ref) {
  var _ref2 = (0, _slicedToArray2["default"])(_ref, 3),
      r = _ref2[0],
      g = _ref2[1],
      b = _ref2[2];

  return "#".concat([r, g, b].map(function (n) {
    return PadNum(n);
  }).join('')).toUpperCase();
}
/**
 * Get color group name by parsing name, discard step in the name
 * e.g. Global Warming 6 -> Global Warming
 *
 * @param {Object} colorRange
 * @return {string | null}
 */


function getColorGroupByName(colorRange) {
  if (!colorRange || typeof colorRange.name !== 'string') {
    return null;
  }

  return colorRange.name.replace(/\b[^a-zA-Z]+$/, '');
}
/**
 * Get a reversed colorRange
 * @param {Boolean} reversed
 * @param {Object} colorRange
 */


function reverseColorRange(reversed, colorRange) {
  if (!colorRange) return null; // if (colorRange.reversed) return colorRange;

  return _objectSpread(_objectSpread({}, colorRange), {}, {
    reversed: reversed,
    colors: colorRange.colors.slice().reverse()
  });
}
/**
 * given a list of rgb arrays it will generate a linear gradient css rule
 * @param direction
 * @param {Array} colors
 * @return {string}
 */


function createLinearGradient(direction, colors) {
  var step = parseFloat((100.0 / colors.length).toFixed(2));
  var bands = colors.map(function (rgb, index) {
    return "rgba(".concat(rgb.join(','), ", 1) ").concat(step * index, "%, rgba(").concat(rgb.join(','), ", 1) ").concat(step * (index + 1), "%");
  });
  return "linear-gradient(to ".concat(direction, ", ").concat(bands.join(','), ")");
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jb2xvci11dGlscy5qcyJdLCJuYW1lcyI6WyJoZXhUb1JnYiIsImhleCIsInJlc3VsdCIsImlzSGV4Q29sb3IiLCJyIiwicGFyc2VJbnQiLCJnIiwiYiIsImV4ZWMiLCJQYWROdW0iLCJjIiwidG9TdHJpbmciLCJsZW5ndGgiLCJyZ2JUb0hleCIsIm1hcCIsIm4iLCJqb2luIiwidG9VcHBlckNhc2UiLCJnZXRDb2xvckdyb3VwQnlOYW1lIiwiY29sb3JSYW5nZSIsIm5hbWUiLCJyZXBsYWNlIiwicmV2ZXJzZUNvbG9yUmFuZ2UiLCJyZXZlcnNlZCIsImNvbG9ycyIsInNsaWNlIiwicmV2ZXJzZSIsImNyZWF0ZUxpbmVhckdyYWRpZW50IiwiZGlyZWN0aW9uIiwic3RlcCIsInBhcnNlRmxvYXQiLCJ0b0ZpeGVkIiwiYmFuZHMiLCJyZ2IiLCJpbmRleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVNBLFFBQVQsQ0FBa0JDLEdBQWxCLEVBQXVCO0FBQzVCLE1BQU1DLE1BQU0sR0FBR0MsVUFBVSxDQUFDRixHQUFELENBQXpCOztBQUVBLE1BQUksQ0FBQ0MsTUFBTCxFQUFhO0FBQ1gsV0FBTyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUFQO0FBQ0Q7O0FBRUQsTUFBTUUsQ0FBQyxHQUFHQyxRQUFRLENBQUNILE1BQU0sQ0FBQyxDQUFELENBQVAsRUFBWSxFQUFaLENBQWxCO0FBQ0EsTUFBTUksQ0FBQyxHQUFHRCxRQUFRLENBQUNILE1BQU0sQ0FBQyxDQUFELENBQVAsRUFBWSxFQUFaLENBQWxCO0FBQ0EsTUFBTUssQ0FBQyxHQUFHRixRQUFRLENBQUNILE1BQU0sQ0FBQyxDQUFELENBQVAsRUFBWSxFQUFaLENBQWxCO0FBRUEsU0FBTyxDQUFDRSxDQUFELEVBQUlFLENBQUosRUFBT0MsQ0FBUCxDQUFQO0FBQ0Q7O0FBRU0sU0FBU0osVUFBVCxDQUFvQkYsR0FBcEIsRUFBeUI7QUFDOUIsTUFBTUMsTUFBTSxHQUFHLDRDQUE0Q00sSUFBNUMsQ0FBaURQLEdBQWpELENBQWY7QUFFQSxTQUFPQyxNQUFQO0FBQ0Q7O0FBRUQsU0FBU08sTUFBVCxDQUFnQkMsQ0FBaEIsRUFBbUI7QUFDakIsTUFBTVQsR0FBRyxHQUFHUyxDQUFDLENBQUNDLFFBQUYsQ0FBVyxFQUFYLENBQVo7QUFDQSxTQUFPVixHQUFHLENBQUNXLE1BQUosS0FBZSxDQUFmLGNBQXVCWCxHQUF2QixJQUErQkEsR0FBdEM7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU1ksUUFBVCxPQUE2QjtBQUFBO0FBQUEsTUFBVlQsQ0FBVTtBQUFBLE1BQVBFLENBQU87QUFBQSxNQUFKQyxDQUFJOztBQUNsQyxTQUFPLFdBQUksQ0FBQ0gsQ0FBRCxFQUFJRSxDQUFKLEVBQU9DLENBQVAsRUFBVU8sR0FBVixDQUFjLFVBQUFDLENBQUM7QUFBQSxXQUFJTixNQUFNLENBQUNNLENBQUQsQ0FBVjtBQUFBLEdBQWYsRUFBOEJDLElBQTlCLENBQW1DLEVBQW5DLENBQUosRUFBNkNDLFdBQTdDLEVBQVA7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxtQkFBVCxDQUE2QkMsVUFBN0IsRUFBeUM7QUFDOUMsTUFBSSxDQUFDQSxVQUFELElBQWUsT0FBT0EsVUFBVSxDQUFDQyxJQUFsQixLQUEyQixRQUE5QyxFQUF3RDtBQUN0RCxXQUFPLElBQVA7QUFDRDs7QUFFRCxTQUFPRCxVQUFVLENBQUNDLElBQVgsQ0FBZ0JDLE9BQWhCLENBQXdCLGVBQXhCLEVBQXlDLEVBQXpDLENBQVA7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLGlCQUFULENBQTJCQyxRQUEzQixFQUFxQ0osVUFBckMsRUFBaUQ7QUFDdEQsTUFBSSxDQUFDQSxVQUFMLEVBQWlCLE9BQU8sSUFBUCxDQURxQyxDQUV0RDs7QUFDQSx5Q0FDS0EsVUFETDtBQUVFSSxJQUFBQSxRQUFRLEVBQVJBLFFBRkY7QUFHRUMsSUFBQUEsTUFBTSxFQUFFTCxVQUFVLENBQUNLLE1BQVgsQ0FBa0JDLEtBQWxCLEdBQTBCQyxPQUExQjtBQUhWO0FBS0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLG9CQUFULENBQThCQyxTQUE5QixFQUF5Q0osTUFBekMsRUFBaUQ7QUFDdEQsTUFBTUssSUFBSSxHQUFHQyxVQUFVLENBQUMsQ0FBQyxRQUFRTixNQUFNLENBQUNaLE1BQWhCLEVBQXdCbUIsT0FBeEIsQ0FBZ0MsQ0FBaEMsQ0FBRCxDQUF2QjtBQUNBLE1BQU1DLEtBQUssR0FBR1IsTUFBTSxDQUFDVixHQUFQLENBQVcsVUFBQ21CLEdBQUQsRUFBTUMsS0FBTixFQUFnQjtBQUN2QywwQkFBZUQsR0FBRyxDQUFDakIsSUFBSixDQUFTLEdBQVQsQ0FBZixrQkFBb0NhLElBQUksR0FBR0ssS0FBM0MscUJBQTJERCxHQUFHLENBQUNqQixJQUFKLENBQVMsR0FBVCxDQUEzRCxrQkFBZ0ZhLElBQUksSUFDakZLLEtBQUssR0FBRyxDQUR5RSxDQUFwRjtBQUVELEdBSGEsQ0FBZDtBQUtBLHNDQUE2Qk4sU0FBN0IsZUFBMkNJLEtBQUssQ0FBQ2hCLElBQU4sQ0FBVyxHQUFYLENBQTNDO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG4vKipcbiAqIGdldCByIGcgYiBmcm9tIGhleCBjb2RlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGhleFxuICogQHJldHVybnMge2ltcG9ydCgncmVkdWNlcnMvdHlwZXMnKS5SR0JDb2xvcn0gYXJyYXkgb2YgciBnIGJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoZXhUb1JnYihoZXgpIHtcbiAgY29uc3QgcmVzdWx0ID0gaXNIZXhDb2xvcihoZXgpO1xuXG4gIGlmICghcmVzdWx0KSB7XG4gICAgcmV0dXJuIFswLCAwLCAwXTtcbiAgfVxuXG4gIGNvbnN0IHIgPSBwYXJzZUludChyZXN1bHRbMV0sIDE2KTtcbiAgY29uc3QgZyA9IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpO1xuICBjb25zdCBiID0gcGFyc2VJbnQocmVzdWx0WzNdLCAxNik7XG5cbiAgcmV0dXJuIFtyLCBnLCBiXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSGV4Q29sb3IoaGV4KSB7XG4gIGNvbnN0IHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIFBhZE51bShjKSB7XG4gIGNvbnN0IGhleCA9IGMudG9TdHJpbmcoMTYpO1xuICByZXR1cm4gaGV4Lmxlbmd0aCA9PT0gMSA/IGAwJHtoZXh9YCA6IGhleDtcbn1cblxuLyoqXG4gKiBnZXQgaGV4IGZyb20gciBnIGJcbiAqXG4gKiBAcGFyYW0ge2FycmF5fSByZ2JcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGhleCBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJnYlRvSGV4KFtyLCBnLCBiXSkge1xuICByZXR1cm4gYCMke1tyLCBnLCBiXS5tYXAobiA9PiBQYWROdW0obikpLmpvaW4oJycpfWAudG9VcHBlckNhc2UoKTtcbn1cblxuLyoqXG4gKiBHZXQgY29sb3IgZ3JvdXAgbmFtZSBieSBwYXJzaW5nIG5hbWUsIGRpc2NhcmQgc3RlcCBpbiB0aGUgbmFtZVxuICogZS5nLiBHbG9iYWwgV2FybWluZyA2IC0+IEdsb2JhbCBXYXJtaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbG9yUmFuZ2VcbiAqIEByZXR1cm4ge3N0cmluZyB8IG51bGx9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb2xvckdyb3VwQnlOYW1lKGNvbG9yUmFuZ2UpIHtcbiAgaWYgKCFjb2xvclJhbmdlIHx8IHR5cGVvZiBjb2xvclJhbmdlLm5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gY29sb3JSYW5nZS5uYW1lLnJlcGxhY2UoL1xcYlteYS16QS1aXSskLywgJycpO1xufVxuXG4vKipcbiAqIEdldCBhIHJldmVyc2VkIGNvbG9yUmFuZ2VcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcmV2ZXJzZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb2xvclJhbmdlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXZlcnNlQ29sb3JSYW5nZShyZXZlcnNlZCwgY29sb3JSYW5nZSkge1xuICBpZiAoIWNvbG9yUmFuZ2UpIHJldHVybiBudWxsO1xuICAvLyBpZiAoY29sb3JSYW5nZS5yZXZlcnNlZCkgcmV0dXJuIGNvbG9yUmFuZ2U7XG4gIHJldHVybiB7XG4gICAgLi4uY29sb3JSYW5nZSxcbiAgICByZXZlcnNlZCxcbiAgICBjb2xvcnM6IGNvbG9yUmFuZ2UuY29sb3JzLnNsaWNlKCkucmV2ZXJzZSgpXG4gIH07XG59XG5cbi8qKlxuICogZ2l2ZW4gYSBsaXN0IG9mIHJnYiBhcnJheXMgaXQgd2lsbCBnZW5lcmF0ZSBhIGxpbmVhciBncmFkaWVudCBjc3MgcnVsZVxuICogQHBhcmFtIGRpcmVjdGlvblxuICogQHBhcmFtIHtBcnJheX0gY29sb3JzXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMaW5lYXJHcmFkaWVudChkaXJlY3Rpb24sIGNvbG9ycykge1xuICBjb25zdCBzdGVwID0gcGFyc2VGbG9hdCgoMTAwLjAgLyBjb2xvcnMubGVuZ3RoKS50b0ZpeGVkKDIpKTtcbiAgY29uc3QgYmFuZHMgPSBjb2xvcnMubWFwKChyZ2IsIGluZGV4KSA9PiB7XG4gICAgcmV0dXJuIGByZ2JhKCR7cmdiLmpvaW4oJywnKX0sIDEpICR7c3RlcCAqIGluZGV4fSUsIHJnYmEoJHtyZ2Iuam9pbignLCcpfSwgMSkgJHtzdGVwICpcbiAgICAgIChpbmRleCArIDEpfSVgO1xuICB9KTtcblxuICByZXR1cm4gYGxpbmVhci1ncmFkaWVudCh0byAke2RpcmVjdGlvbn0sICR7YmFuZHMuam9pbignLCcpfSlgO1xufVxuIl19