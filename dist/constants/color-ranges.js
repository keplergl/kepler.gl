'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.COLOR_RANGES = undefined;

var _colorbrewer = require('colorbrewer');

var _colorbrewer2 = _interopRequireDefault(_colorbrewer);

var _uberVizColors = require('./uber-viz-colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Uber branded' color schemes
var colorBrewerMap = {
  YlGn: _uberVizColors.SEQ,
  YlGnBu: _uberVizColors.SEQ,
  GnBu: _uberVizColors.SEQ,
  BuGn: _uberVizColors.SEQ,
  PuBuGn: _uberVizColors.SEQ,
  PuBu: _uberVizColors.SEQ,
  BuPu: _uberVizColors.SEQ,
  RdPu: _uberVizColors.SEQ,
  PuRd: _uberVizColors.SEQ,
  OrRd: _uberVizColors.SEQ,
  YlOrRd: _uberVizColors.SEQ,
  YlOrBr: _uberVizColors.SEQ,
  Purples: _uberVizColors.SEQ,
  Blues: _uberVizColors.SEQ,
  Greens: _uberVizColors.SEQ,
  Oranges: _uberVizColors.SEQ,
  Reds: _uberVizColors.SEQ,
  Greys: _uberVizColors.SEQ,
  PuOr: _uberVizColors.DIV,
  BrBG: _uberVizColors.DIV,
  PRGn: _uberVizColors.DIV,
  PiYG: _uberVizColors.DIV,
  RdBu: _uberVizColors.DIV,
  RdGy: _uberVizColors.DIV,
  RdYlBu: _uberVizColors.DIV,
  Spectral: _uberVizColors.DIV,
  RdYlGn: _uberVizColors.DIV,
  Accent: _uberVizColors.QUA,
  Dark2: _uberVizColors.QUA,
  Paired: _uberVizColors.QUA,
  Pastel1: _uberVizColors.QUA,
  Pastel2: _uberVizColors.QUA,
  Set1: _uberVizColors.QUA,
  Set2: _uberVizColors.QUA,
  Set3: _uberVizColors.QUA
};

var colorRanges = [].concat(_uberVizColors.UberVizColorPalette);

// Add colorbrewer color schemes (Data Science requirement)
// See http://colorbrewer2.org/
function entries(obj) {
  return Object.keys(obj).map(function (k) {
    return [k, obj[k]];
  });
}

for (var _iterator = entries(_colorbrewer2.default), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
  var _ref;

  if (_isArray) {
    if (_i >= _iterator.length) break;
    _ref = _iterator[_i++];
  } else {
    _i = _iterator.next();
    if (_i.done) break;
    _ref = _i.value;
  }

  var _ref2 = _ref,
      keyName = _ref2[0],
      colorScheme = _ref2[1];

  for (var _iterator2 = entries(colorScheme), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
    var _ref3;

    if (_isArray2) {
      if (_i2 >= _iterator2.length) break;
      _ref3 = _iterator2[_i2++];
    } else {
      _i2 = _iterator2.next();
      if (_i2.done) break;
      _ref3 = _i2.value;
    }

    var _ref4 = _ref3,
        lenKey = _ref4[0],
        colors = _ref4[1];

    colorRanges.push({
      name: 'ColorBrewer ' + keyName + '-' + lenKey,
      type: colorBrewerMap[keyName],
      category: 'ColorBrewer',
      colors: colors
    });
  }
}

var COLOR_RANGES = exports.COLOR_RANGES = colorRanges;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdGFudHMvY29sb3ItcmFuZ2VzLmpzIl0sIm5hbWVzIjpbImNvbG9yQnJld2VyTWFwIiwiWWxHbiIsIllsR25CdSIsIkduQnUiLCJCdUduIiwiUHVCdUduIiwiUHVCdSIsIkJ1UHUiLCJSZFB1IiwiUHVSZCIsIk9yUmQiLCJZbE9yUmQiLCJZbE9yQnIiLCJQdXJwbGVzIiwiQmx1ZXMiLCJHcmVlbnMiLCJPcmFuZ2VzIiwiUmVkcyIsIkdyZXlzIiwiUHVPciIsIkJyQkciLCJQUkduIiwiUGlZRyIsIlJkQnUiLCJSZEd5IiwiUmRZbEJ1IiwiU3BlY3RyYWwiLCJSZFlsR24iLCJBY2NlbnQiLCJEYXJrMiIsIlBhaXJlZCIsIlBhc3RlbDEiLCJQYXN0ZWwyIiwiU2V0MSIsIlNldDIiLCJTZXQzIiwiY29sb3JSYW5nZXMiLCJlbnRyaWVzIiwib2JqIiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsImsiLCJrZXlOYW1lIiwiY29sb3JTY2hlbWUiLCJsZW5LZXkiLCJjb2xvcnMiLCJwdXNoIiwibmFtZSIsInR5cGUiLCJjYXRlZ29yeSIsIkNPTE9SX1JBTkdFUyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFQTtBQUNBLElBQU1BLGlCQUFpQjtBQUNyQkMsMEJBRHFCO0FBRXJCQyw0QkFGcUI7QUFHckJDLDBCQUhxQjtBQUlyQkMsMEJBSnFCO0FBS3JCQyw0QkFMcUI7QUFNckJDLDBCQU5xQjtBQU9yQkMsMEJBUHFCO0FBUXJCQywwQkFScUI7QUFTckJDLDBCQVRxQjtBQVVyQkMsMEJBVnFCO0FBV3JCQyw0QkFYcUI7QUFZckJDLDRCQVpxQjtBQWFyQkMsNkJBYnFCO0FBY3JCQywyQkFkcUI7QUFlckJDLDRCQWZxQjtBQWdCckJDLDZCQWhCcUI7QUFpQnJCQywwQkFqQnFCO0FBa0JyQkMsMkJBbEJxQjtBQW1CckJDLDBCQW5CcUI7QUFvQnJCQywwQkFwQnFCO0FBcUJyQkMsMEJBckJxQjtBQXNCckJDLDBCQXRCcUI7QUF1QnJCQywwQkF2QnFCO0FBd0JyQkMsMEJBeEJxQjtBQXlCckJDLDRCQXpCcUI7QUEwQnJCQyw4QkExQnFCO0FBMkJyQkMsNEJBM0JxQjtBQTRCckJDLDRCQTVCcUI7QUE2QnJCQywyQkE3QnFCO0FBOEJyQkMsNEJBOUJxQjtBQStCckJDLDZCQS9CcUI7QUFnQ3JCQyw2QkFoQ3FCO0FBaUNyQkMsMEJBakNxQjtBQWtDckJDLDBCQWxDcUI7QUFtQ3JCQztBQW5DcUIsQ0FBdkI7O0FBc0NBLElBQU1DLDJEQUFOOztBQUVBO0FBQ0E7QUFDQSxTQUFTQyxPQUFULENBQWlCQyxHQUFqQixFQUFzQjtBQUNwQixTQUFPQyxPQUFPQyxJQUFQLENBQVlGLEdBQVosRUFBaUJHLEdBQWpCLENBQXFCO0FBQUEsV0FBSyxDQUFDQyxDQUFELEVBQUlKLElBQUlJLENBQUosQ0FBSixDQUFMO0FBQUEsR0FBckIsQ0FBUDtBQUNEOztBQUVELHFCQUFxQ0wsOEJBQXJDLGtIQUEyRDtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUEvQ00sT0FBK0M7QUFBQSxNQUF0Q0MsV0FBc0M7O0FBQ3pELHdCQUErQlAsUUFBUU8sV0FBUixDQUEvQix5SEFBcUQ7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsUUFBekNDLE1BQXlDO0FBQUEsUUFBakNDLE1BQWlDOztBQUNuRFYsZ0JBQVlXLElBQVosQ0FBaUI7QUFDZkMsNkJBQXFCTCxPQUFyQixTQUFnQ0UsTUFEakI7QUFFZkksWUFBTWpELGVBQWUyQyxPQUFmLENBRlM7QUFHZk8sZ0JBQVUsYUFISztBQUlmSjtBQUplLEtBQWpCO0FBTUQ7QUFDRjs7QUFFTSxJQUFNSyxzQ0FBZWYsV0FBckIiLCJmaWxlIjoiY29sb3ItcmFuZ2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbG9yYnJld2VyIGZyb20gJ2NvbG9yYnJld2VyJztcbmltcG9ydCB7U0VRLCBRVUEsIERJViwgVWJlclZpekNvbG9yUGFsZXR0ZX0gZnJvbSAnLi91YmVyLXZpei1jb2xvcnMnO1xuXG4vLyBVYmVyIGJyYW5kZWQnIGNvbG9yIHNjaGVtZXNcbmNvbnN0IGNvbG9yQnJld2VyTWFwID0ge1xuICBZbEduOiBTRVEsXG4gIFlsR25CdTogU0VRLFxuICBHbkJ1OiBTRVEsXG4gIEJ1R246IFNFUSxcbiAgUHVCdUduOiBTRVEsXG4gIFB1QnU6IFNFUSxcbiAgQnVQdTogU0VRLFxuICBSZFB1OiBTRVEsXG4gIFB1UmQ6IFNFUSxcbiAgT3JSZDogU0VRLFxuICBZbE9yUmQ6IFNFUSxcbiAgWWxPckJyOiBTRVEsXG4gIFB1cnBsZXM6IFNFUSxcbiAgQmx1ZXM6IFNFUSxcbiAgR3JlZW5zOiBTRVEsXG4gIE9yYW5nZXM6IFNFUSxcbiAgUmVkczogU0VRLFxuICBHcmV5czogU0VRLFxuICBQdU9yOiBESVYsXG4gIEJyQkc6IERJVixcbiAgUFJHbjogRElWLFxuICBQaVlHOiBESVYsXG4gIFJkQnU6IERJVixcbiAgUmRHeTogRElWLFxuICBSZFlsQnU6IERJVixcbiAgU3BlY3RyYWw6IERJVixcbiAgUmRZbEduOiBESVYsXG4gIEFjY2VudDogUVVBLFxuICBEYXJrMjogUVVBLFxuICBQYWlyZWQ6IFFVQSxcbiAgUGFzdGVsMTogUVVBLFxuICBQYXN0ZWwyOiBRVUEsXG4gIFNldDE6IFFVQSxcbiAgU2V0MjogUVVBLFxuICBTZXQzOiBRVUFcbn07XG5cbmNvbnN0IGNvbG9yUmFuZ2VzID0gWy4uLlViZXJWaXpDb2xvclBhbGV0dGVdO1xuXG4vLyBBZGQgY29sb3JicmV3ZXIgY29sb3Igc2NoZW1lcyAoRGF0YSBTY2llbmNlIHJlcXVpcmVtZW50KVxuLy8gU2VlIGh0dHA6Ly9jb2xvcmJyZXdlcjIub3JnL1xuZnVuY3Rpb24gZW50cmllcyhvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubWFwKGsgPT4gW2ssIG9ialtrXV0pO1xufVxuXG5mb3IgKGNvbnN0IFtrZXlOYW1lLCBjb2xvclNjaGVtZV0gb2YgZW50cmllcyhjb2xvcmJyZXdlcikpIHtcbiAgZm9yIChjb25zdCBbbGVuS2V5LCBjb2xvcnNdIG9mIGVudHJpZXMoY29sb3JTY2hlbWUpKSB7XG4gICAgY29sb3JSYW5nZXMucHVzaCh7XG4gICAgICBuYW1lOiBgQ29sb3JCcmV3ZXIgJHtrZXlOYW1lfS0ke2xlbktleX1gLFxuICAgICAgdHlwZTogY29sb3JCcmV3ZXJNYXBba2V5TmFtZV0sXG4gICAgICBjYXRlZ29yeTogJ0NvbG9yQnJld2VyJyxcbiAgICAgIGNvbG9yc1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBDT0xPUl9SQU5HRVMgPSBjb2xvclJhbmdlcztcbiJdfQ==