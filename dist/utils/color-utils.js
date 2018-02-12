'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.hexToRgb = hexToRgb;
exports.rgbToHex = rgbToHex;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  var _ref2 = (0, _slicedToArray3.default)(_ref, 3),
      r = _ref2[0],
      g = _ref2[1],
      b = _ref2[2];

  return ('#' + [r, g, b].map(function (n) {
    return PadNum(n);
  }).join('')).toUpperCase();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jb2xvci11dGlscy5qcyJdLCJuYW1lcyI6WyJoZXhUb1JnYiIsInJnYlRvSGV4IiwiaGV4IiwicmVzdWx0IiwiZXhlYyIsInIiLCJwYXJzZUludCIsImciLCJiIiwiUGFkTnVtIiwiYyIsInRvU3RyaW5nIiwibGVuZ3RoIiwibWFwIiwibiIsImpvaW4iLCJ0b1VwcGVyQ2FzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztRQU1nQkEsUSxHQUFBQSxRO1FBcUJBQyxRLEdBQUFBLFE7Ozs7QUEzQmhCOzs7Ozs7QUFNTyxTQUFTRCxRQUFULENBQWtCRSxHQUFsQixFQUF1QjtBQUM1QixNQUFNQyxTQUFTLDRDQUE0Q0MsSUFBNUMsQ0FBaURGLEdBQWpELENBQWY7O0FBRUEsTUFBTUcsSUFBSUMsU0FBU0gsT0FBTyxDQUFQLENBQVQsRUFBb0IsRUFBcEIsQ0FBVjtBQUNBLE1BQU1JLElBQUlELFNBQVNILE9BQU8sQ0FBUCxDQUFULEVBQW9CLEVBQXBCLENBQVY7QUFDQSxNQUFNSyxJQUFJRixTQUFTSCxPQUFPLENBQVAsQ0FBVCxFQUFvQixFQUFwQixDQUFWOztBQUVBLFNBQU8sQ0FBQ0UsQ0FBRCxFQUFJRSxDQUFKLEVBQU9DLENBQVAsQ0FBUDtBQUNEOztBQUVELFNBQVNDLE1BQVQsQ0FBZ0JDLENBQWhCLEVBQW1CO0FBQ2pCLE1BQU1SLE1BQU1RLEVBQUVDLFFBQUYsQ0FBVyxFQUFYLENBQVo7QUFDQSxTQUFPVCxJQUFJVSxNQUFKLEtBQWUsQ0FBZixTQUF1QlYsR0FBdkIsR0FBK0JBLEdBQXRDO0FBQ0Q7O0FBRUQ7Ozs7OztBQU1PLFNBQVNELFFBQVQsT0FBNkI7QUFBQTtBQUFBLE1BQVZJLENBQVU7QUFBQSxNQUFQRSxDQUFPO0FBQUEsTUFBSkMsQ0FBSTs7QUFDbEMsU0FBTyxPQUFJLENBQUNILENBQUQsRUFBSUUsQ0FBSixFQUFPQyxDQUFQLEVBQVVLLEdBQVYsQ0FBYztBQUFBLFdBQUtKLE9BQU9LLENBQVAsQ0FBTDtBQUFBLEdBQWQsRUFBOEJDLElBQTlCLENBQW1DLEVBQW5DLENBQUosRUFBNkNDLFdBQTdDLEVBQVA7QUFDRCIsImZpbGUiOiJjb2xvci11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogZ2V0IHIgZyBiIGZyb20gaGV4IGNvZGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaGV4XG4gKiBAcmV0dXJucyB7YXJyYXl9IGFycmF5IG9mIHIgZyBic1xuICovXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9SZ2IoaGV4KSB7XG4gIGNvbnN0IHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuXG4gIGNvbnN0IHIgPSBwYXJzZUludChyZXN1bHRbMV0sIDE2KTtcbiAgY29uc3QgZyA9IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpO1xuICBjb25zdCBiID0gcGFyc2VJbnQocmVzdWx0WzNdLCAxNik7XG5cbiAgcmV0dXJuIFtyLCBnLCBiXTtcbn1cblxuZnVuY3Rpb24gUGFkTnVtKGMpIHtcbiAgY29uc3QgaGV4ID0gYy50b1N0cmluZygxNik7XG4gIHJldHVybiBoZXgubGVuZ3RoID09PSAxID8gYDAke2hleH1gIDogaGV4O1xufVxuXG4vKipcbiAqIGdldCBoZXggZnJvbSByIGcgYlxuICpcbiAqIEBwYXJhbSB7YXJyYXl9IHJnYlxuICogQHJldHVybnMge3N0cmluZ30gaGV4IHN0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmdiVG9IZXgoW3IsIGcsIGJdKSB7XG4gIHJldHVybiBgIyR7W3IsIGcsIGJdLm1hcChuID0+IFBhZE51bShuKSkuam9pbignJyl9YC50b1VwcGVyQ2FzZSgpO1xufVxuIl19