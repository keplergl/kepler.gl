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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jb2xvci11dGlscy5qcyJdLCJuYW1lcyI6WyJoZXhUb1JnYiIsImhleCIsInJlc3VsdCIsImV4ZWMiLCJyIiwicGFyc2VJbnQiLCJnIiwiYiJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFPZ0JBLFEsR0FBQUEsUTs7QUFOaEI7Ozs7OztBQU1PLFNBQVNBLFFBQVQsQ0FBa0JDLEdBQWxCLEVBQXVCO0FBQzVCLE1BQU1DLFNBQVUsMkNBQUQsQ0FBOENDLElBQTlDLENBQW1ERixHQUFuRCxDQUFmOztBQUVBLE1BQU1HLElBQUlDLFNBQVNILE9BQU8sQ0FBUCxDQUFULEVBQW9CLEVBQXBCLENBQVY7QUFDQSxNQUFNSSxJQUFJRCxTQUFTSCxPQUFPLENBQVAsQ0FBVCxFQUFvQixFQUFwQixDQUFWO0FBQ0EsTUFBTUssSUFBSUYsU0FBU0gsT0FBTyxDQUFQLENBQVQsRUFBb0IsRUFBcEIsQ0FBVjs7QUFFQSxTQUFPLENBQUNFLENBQUQsRUFBSUUsQ0FBSixFQUFPQyxDQUFQLENBQVA7QUFDRCIsImZpbGUiOiJjb2xvci11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBnZXQgciBnIGIgZnJvbSBoZXggY29kZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBoZXhcbiAqIEByZXR1cm5zIHthcnJheX0gYXJyYXkgb2YgciBnIGJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoZXhUb1JnYihoZXgpIHtcbiAgY29uc3QgcmVzdWx0ID0gKC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kpLmV4ZWMoaGV4KTtcblxuICBjb25zdCByID0gcGFyc2VJbnQocmVzdWx0WzFdLCAxNik7XG4gIGNvbnN0IGcgPSBwYXJzZUludChyZXN1bHRbMl0sIDE2KTtcbiAgY29uc3QgYiA9IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpO1xuXG4gIHJldHVybiBbciwgZywgYl07XG59XG4iXX0=