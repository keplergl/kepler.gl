'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.COLOR_RANGES = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var colorRanges = [].concat((0, _toConsumableArray3.default)(_uberVizColors.UberVizColorPalette));

// Add colorbrewer color schemes (Data Science requirement)
// See http://colorbrewer2.org/
function entries(obj) {
  return Object.keys(obj).map(function (k) {
    return [k, obj[k]];
  });
}

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = entries(_colorbrewer2.default)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
        keyName = _step$value[0],
        colorScheme = _step$value[1];

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = entries(colorScheme)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _step2$value = (0, _slicedToArray3.default)(_step2.value, 2),
            lenKey = _step2$value[0],
            colors = _step2$value[1];

        colorRanges.push({
          name: 'ColorBrewer ' + keyName + '-' + lenKey,
          type: colorBrewerMap[keyName],
          category: 'ColorBrewer',
          colors: colors
        });
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

var COLOR_RANGES = exports.COLOR_RANGES = colorRanges;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdGFudHMvY29sb3ItcmFuZ2VzLmpzIl0sIm5hbWVzIjpbImNvbG9yQnJld2VyTWFwIiwiWWxHbiIsIllsR25CdSIsIkduQnUiLCJCdUduIiwiUHVCdUduIiwiUHVCdSIsIkJ1UHUiLCJSZFB1IiwiUHVSZCIsIk9yUmQiLCJZbE9yUmQiLCJZbE9yQnIiLCJQdXJwbGVzIiwiQmx1ZXMiLCJHcmVlbnMiLCJPcmFuZ2VzIiwiUmVkcyIsIkdyZXlzIiwiUHVPciIsIkJyQkciLCJQUkduIiwiUGlZRyIsIlJkQnUiLCJSZEd5IiwiUmRZbEJ1IiwiU3BlY3RyYWwiLCJSZFlsR24iLCJBY2NlbnQiLCJEYXJrMiIsIlBhaXJlZCIsIlBhc3RlbDEiLCJQYXN0ZWwyIiwiU2V0MSIsIlNldDIiLCJTZXQzIiwiY29sb3JSYW5nZXMiLCJlbnRyaWVzIiwib2JqIiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsImsiLCJrZXlOYW1lIiwiY29sb3JTY2hlbWUiLCJsZW5LZXkiLCJjb2xvcnMiLCJwdXNoIiwibmFtZSIsInR5cGUiLCJjYXRlZ29yeSIsIkNPTE9SX1JBTkdFUyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBO0FBQ0EsSUFBTUEsaUJBQWlCO0FBQ3JCQywwQkFEcUI7QUFFckJDLDRCQUZxQjtBQUdyQkMsMEJBSHFCO0FBSXJCQywwQkFKcUI7QUFLckJDLDRCQUxxQjtBQU1yQkMsMEJBTnFCO0FBT3JCQywwQkFQcUI7QUFRckJDLDBCQVJxQjtBQVNyQkMsMEJBVHFCO0FBVXJCQywwQkFWcUI7QUFXckJDLDRCQVhxQjtBQVlyQkMsNEJBWnFCO0FBYXJCQyw2QkFicUI7QUFjckJDLDJCQWRxQjtBQWVyQkMsNEJBZnFCO0FBZ0JyQkMsNkJBaEJxQjtBQWlCckJDLDBCQWpCcUI7QUFrQnJCQywyQkFsQnFCO0FBbUJyQkMsMEJBbkJxQjtBQW9CckJDLDBCQXBCcUI7QUFxQnJCQywwQkFyQnFCO0FBc0JyQkMsMEJBdEJxQjtBQXVCckJDLDBCQXZCcUI7QUF3QnJCQywwQkF4QnFCO0FBeUJyQkMsNEJBekJxQjtBQTBCckJDLDhCQTFCcUI7QUEyQnJCQyw0QkEzQnFCO0FBNEJyQkMsNEJBNUJxQjtBQTZCckJDLDJCQTdCcUI7QUE4QnJCQyw0QkE5QnFCO0FBK0JyQkMsNkJBL0JxQjtBQWdDckJDLDZCQWhDcUI7QUFpQ3JCQywwQkFqQ3FCO0FBa0NyQkMsMEJBbENxQjtBQW1DckJDO0FBbkNxQixDQUF2Qjs7QUFzQ0EsSUFBTUMsNkZBQU47O0FBRUE7QUFDQTtBQUNBLFNBQVNDLE9BQVQsQ0FBaUJDLEdBQWpCLEVBQXNCO0FBQ3BCLFNBQU9DLE9BQU9DLElBQVAsQ0FBWUYsR0FBWixFQUFpQkcsR0FBakIsQ0FBcUI7QUFBQSxXQUFLLENBQUNDLENBQUQsRUFBSUosSUFBSUksQ0FBSixDQUFKLENBQUw7QUFBQSxHQUFyQixDQUFQO0FBQ0Q7Ozs7Ozs7QUFFRCx1QkFBcUNMLDhCQUFyQyw4SEFBMkQ7QUFBQTtBQUFBLFFBQS9DTSxPQUErQztBQUFBLFFBQXRDQyxXQUFzQzs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDekQsNEJBQStCUCxRQUFRTyxXQUFSLENBQS9CLG1JQUFxRDtBQUFBO0FBQUEsWUFBekNDLE1BQXlDO0FBQUEsWUFBakNDLE1BQWlDOztBQUNuRFYsb0JBQVlXLElBQVosQ0FBaUI7QUFDZkMsaUNBQXFCTCxPQUFyQixTQUFnQ0UsTUFEakI7QUFFZkksZ0JBQU1qRCxlQUFlMkMsT0FBZixDQUZTO0FBR2ZPLG9CQUFVLGFBSEs7QUFJZko7QUFKZSxTQUFqQjtBQU1EO0FBUndEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFTMUQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFTSxJQUFNSyxzQ0FBZWYsV0FBckIiLCJmaWxlIjoiY29sb3ItcmFuZ2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbG9yYnJld2VyIGZyb20gJ2NvbG9yYnJld2VyJztcbmltcG9ydCB7U0VRLCBRVUEsIERJViwgVWJlclZpekNvbG9yUGFsZXR0ZX0gZnJvbSAnLi91YmVyLXZpei1jb2xvcnMnO1xuXG4vLyBVYmVyIGJyYW5kZWQnIGNvbG9yIHNjaGVtZXNcbmNvbnN0IGNvbG9yQnJld2VyTWFwID0ge1xuICBZbEduOiBTRVEsXG4gIFlsR25CdTogU0VRLFxuICBHbkJ1OiBTRVEsXG4gIEJ1R246IFNFUSxcbiAgUHVCdUduOiBTRVEsXG4gIFB1QnU6IFNFUSxcbiAgQnVQdTogU0VRLFxuICBSZFB1OiBTRVEsXG4gIFB1UmQ6IFNFUSxcbiAgT3JSZDogU0VRLFxuICBZbE9yUmQ6IFNFUSxcbiAgWWxPckJyOiBTRVEsXG4gIFB1cnBsZXM6IFNFUSxcbiAgQmx1ZXM6IFNFUSxcbiAgR3JlZW5zOiBTRVEsXG4gIE9yYW5nZXM6IFNFUSxcbiAgUmVkczogU0VRLFxuICBHcmV5czogU0VRLFxuICBQdU9yOiBESVYsXG4gIEJyQkc6IERJVixcbiAgUFJHbjogRElWLFxuICBQaVlHOiBESVYsXG4gIFJkQnU6IERJVixcbiAgUmRHeTogRElWLFxuICBSZFlsQnU6IERJVixcbiAgU3BlY3RyYWw6IERJVixcbiAgUmRZbEduOiBESVYsXG4gIEFjY2VudDogUVVBLFxuICBEYXJrMjogUVVBLFxuICBQYWlyZWQ6IFFVQSxcbiAgUGFzdGVsMTogUVVBLFxuICBQYXN0ZWwyOiBRVUEsXG4gIFNldDE6IFFVQSxcbiAgU2V0MjogUVVBLFxuICBTZXQzOiBRVUFcbn07XG5cbmNvbnN0IGNvbG9yUmFuZ2VzID0gWy4uLlViZXJWaXpDb2xvclBhbGV0dGVdO1xuXG4vLyBBZGQgY29sb3JicmV3ZXIgY29sb3Igc2NoZW1lcyAoRGF0YSBTY2llbmNlIHJlcXVpcmVtZW50KVxuLy8gU2VlIGh0dHA6Ly9jb2xvcmJyZXdlcjIub3JnL1xuZnVuY3Rpb24gZW50cmllcyhvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubWFwKGsgPT4gW2ssIG9ialtrXV0pO1xufVxuXG5mb3IgKGNvbnN0IFtrZXlOYW1lLCBjb2xvclNjaGVtZV0gb2YgZW50cmllcyhjb2xvcmJyZXdlcikpIHtcbiAgZm9yIChjb25zdCBbbGVuS2V5LCBjb2xvcnNdIG9mIGVudHJpZXMoY29sb3JTY2hlbWUpKSB7XG4gICAgY29sb3JSYW5nZXMucHVzaCh7XG4gICAgICBuYW1lOiBgQ29sb3JCcmV3ZXIgJHtrZXlOYW1lfS0ke2xlbktleX1gLFxuICAgICAgdHlwZTogY29sb3JCcmV3ZXJNYXBba2V5TmFtZV0sXG4gICAgICBjYXRlZ29yeTogJ0NvbG9yQnJld2VyJyxcbiAgICAgIGNvbG9yc1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBDT0xPUl9SQU5HRVMgPSBjb2xvclJhbmdlcztcbiJdfQ==