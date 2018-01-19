"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexToRgb = hexToRgb;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jb2xvci11dGlscy5qcyJdLCJuYW1lcyI6WyJoZXhUb1JnYiIsImhleCIsInJlc3VsdCIsImV4ZWMiLCJyIiwicGFyc2VJbnQiLCJnIiwiYiJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFNZ0JBLFEsR0FBQUEsUTtBQU5oQjs7Ozs7O0FBTU8sU0FBU0EsUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUI7QUFDNUIsTUFBTUMsU0FBUyw0Q0FBNENDLElBQTVDLENBQWlERixHQUFqRCxDQUFmOztBQUVBLE1BQU1HLElBQUlDLFNBQVNILE9BQU8sQ0FBUCxDQUFULEVBQW9CLEVBQXBCLENBQVY7QUFDQSxNQUFNSSxJQUFJRCxTQUFTSCxPQUFPLENBQVAsQ0FBVCxFQUFvQixFQUFwQixDQUFWO0FBQ0EsTUFBTUssSUFBSUYsU0FBU0gsT0FBTyxDQUFQLENBQVQsRUFBb0IsRUFBcEIsQ0FBVjs7QUFFQSxTQUFPLENBQUNFLENBQUQsRUFBSUUsQ0FBSixFQUFPQyxDQUFQLENBQVA7QUFDRCIsImZpbGUiOiJjb2xvci11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogZ2V0IHIgZyBiIGZyb20gaGV4IGNvZGVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaGV4XG4gKiBAcmV0dXJucyB7YXJyYXl9IGFycmF5IG9mIHIgZyBic1xuICovXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9SZ2IoaGV4KSB7XG4gIGNvbnN0IHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuXG4gIGNvbnN0IHIgPSBwYXJzZUludChyZXN1bHRbMV0sIDE2KTtcbiAgY29uc3QgZyA9IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpO1xuICBjb25zdCBiID0gcGFyc2VJbnQocmVzdWx0WzNdLCAxNik7XG5cbiAgcmV0dXJuIFtyLCBnLCBiXTtcbn1cbiJdfQ==