'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexToRgb = hexToRgb;
exports.rgbToHex = rgbToHex;
/**
 * get r g b from hex code
 *
 * @param {string} hex
 * @returns {array} array of r g bs
 */
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  return [r, g, b];
}

function PadNum(c) {
  var hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

/**
 * get hex from r g b
 *
 * @param {array} rgb
 * @returns {string} hex string
 */
function rgbToHex(_ref) {
  var r = _ref[0],
      g = _ref[1],
      b = _ref[2];

  return ('#' + [r, g, b].map(function (n) {
    return PadNum(n);
  }).join('')).toUpperCase();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jb2xvci11dGlscy5qcyJdLCJuYW1lcyI6WyJoZXhUb1JnYiIsInJnYlRvSGV4IiwiaGV4IiwicmVzdWx0IiwiZXhlYyIsInIiLCJwYXJzZUludCIsImciLCJiIiwiUGFkTnVtIiwiYyIsInRvU3RyaW5nIiwibGVuZ3RoIiwibWFwIiwibiIsImpvaW4iLCJ0b1VwcGVyQ2FzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFNZ0JBLFEsR0FBQUEsUTtRQXNCQUMsUSxHQUFBQSxRO0FBNUJoQjs7Ozs7O0FBTU8sU0FBU0QsUUFBVCxDQUFrQkUsR0FBbEIsRUFBdUI7QUFDNUIsTUFBTUMsU0FBUyw0Q0FBNENDLElBQTVDLENBQWlERixHQUFqRCxDQUFmOztBQUVBLE1BQU1HLElBQUlDLFNBQVNILE9BQU8sQ0FBUCxDQUFULEVBQW9CLEVBQXBCLENBQVY7QUFDQSxNQUFNSSxJQUFJRCxTQUFTSCxPQUFPLENBQVAsQ0FBVCxFQUFvQixFQUFwQixDQUFWO0FBQ0EsTUFBTUssSUFBSUYsU0FBU0gsT0FBTyxDQUFQLENBQVQsRUFBb0IsRUFBcEIsQ0FBVjs7QUFFQSxTQUFPLENBQUNFLENBQUQsRUFBSUUsQ0FBSixFQUFPQyxDQUFQLENBQVA7QUFDRDs7QUFHRCxTQUFTQyxNQUFULENBQWdCQyxDQUFoQixFQUFtQjtBQUNqQixNQUFNUixNQUFNUSxFQUFFQyxRQUFGLENBQVcsRUFBWCxDQUFaO0FBQ0EsU0FBT1QsSUFBSVUsTUFBSixLQUFlLENBQWYsU0FBdUJWLEdBQXZCLEdBQStCQSxHQUF0QztBQUNEOztBQUVEOzs7Ozs7QUFNTyxTQUFTRCxRQUFULE9BQTZCO0FBQUEsTUFBVkksQ0FBVTtBQUFBLE1BQVBFLENBQU87QUFBQSxNQUFKQyxDQUFJOztBQUNsQyxTQUFPLE9BQUksQ0FBQ0gsQ0FBRCxFQUFJRSxDQUFKLEVBQU9DLENBQVAsRUFBVUssR0FBVixDQUFjO0FBQUEsV0FBS0osT0FBT0ssQ0FBUCxDQUFMO0FBQUEsR0FBZCxFQUE4QkMsSUFBOUIsQ0FBbUMsRUFBbkMsQ0FBSixFQUE2Q0MsV0FBN0MsRUFBUDtBQUNEIiwiZmlsZSI6ImNvbG9yLXV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBnZXQgciBnIGIgZnJvbSBoZXggY29kZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBoZXhcbiAqIEByZXR1cm5zIHthcnJheX0gYXJyYXkgb2YgciBnIGJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoZXhUb1JnYihoZXgpIHtcbiAgY29uc3QgcmVzdWx0ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XG5cbiAgY29uc3QgciA9IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpO1xuICBjb25zdCBnID0gcGFyc2VJbnQocmVzdWx0WzJdLCAxNik7XG4gIGNvbnN0IGIgPSBwYXJzZUludChyZXN1bHRbM10sIDE2KTtcblxuICByZXR1cm4gW3IsIGcsIGJdO1xufVxuXG5cbmZ1bmN0aW9uIFBhZE51bShjKSB7XG4gIGNvbnN0IGhleCA9IGMudG9TdHJpbmcoMTYpO1xuICByZXR1cm4gaGV4Lmxlbmd0aCA9PT0gMSA/IGAwJHtoZXh9YCA6IGhleDtcbn1cblxuLyoqXG4gKiBnZXQgaGV4IGZyb20gciBnIGJcbiAqXG4gKiBAcGFyYW0ge2FycmF5fSByZ2JcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGhleCBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJnYlRvSGV4KFtyLCBnLCBiXSkge1xuICByZXR1cm4gYCMke1tyLCBnLCBiXS5tYXAobiA9PiBQYWROdW0obikpLmpvaW4oJycpfWAudG9VcHBlckNhc2UoKTtcbn1cbiJdfQ==