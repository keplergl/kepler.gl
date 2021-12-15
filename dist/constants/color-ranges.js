"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_COLOR_RANGE = exports.COLOR_RANGES = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _colorbrewer = _interopRequireDefault(require("colorbrewer"));

var _customColorRanges = require("./custom-color-ranges");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Add colorbrewer color schemes (Data Science requirement)
// See http://colorbrewer2.org/
var colorBrewerMap = Object.entries(_colorbrewer["default"].schemeGroups).reduce(function (accu, _ref) {
  var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
      type = _ref2[0],
      palettes = _ref2[1];

  return _objectSpread(_objectSpread({}, accu), palettes.reduce(function (group, name) {
    return _objectSpread(_objectSpread({}, group), {}, (0, _defineProperty2["default"])({}, name, type));
  }, {}));
}, {});
var colorRanges = (0, _toConsumableArray2["default"])(_customColorRanges.VizColorPalette);

for (var _i = 0, _Object$entries = Object.entries(_colorbrewer["default"]); _i < _Object$entries.length; _i++) {
  var _Object$entries$_i = (0, _slicedToArray2["default"])(_Object$entries[_i], 2),
      keyName = _Object$entries$_i[0],
      colorScheme = _Object$entries$_i[1];

  if (keyName !== 'schemeGroups') {
    for (var _i2 = 0, _Object$entries2 = Object.entries(colorScheme); _i2 < _Object$entries2.length; _i2++) {
      var _Object$entries2$_i = (0, _slicedToArray2["default"])(_Object$entries2[_i2], 2),
          lenKey = _Object$entries2$_i[0],
          colors = _Object$entries2$_i[1];

      colorRanges.push({
        name: "ColorBrewer ".concat(keyName, "-").concat(lenKey),
        type: colorBrewerMap[keyName],
        category: 'ColorBrewer',
        colors: colors
      });
    }
  }
}

var COLOR_RANGES = colorRanges;
exports.COLOR_RANGES = COLOR_RANGES;
var DEFAULT_COLOR_RANGE = colorRanges.find(function (_ref3) {
  var name = _ref3.name;
  return name === 'Global Warming';
}) || {
  name: 'Global Warming',
  type: 'SEQ',
  category: 'Uber',
  colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
};
exports.DEFAULT_COLOR_RANGE = DEFAULT_COLOR_RANGE;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdGFudHMvY29sb3ItcmFuZ2VzLmpzIl0sIm5hbWVzIjpbImNvbG9yQnJld2VyTWFwIiwiT2JqZWN0IiwiZW50cmllcyIsImNvbG9yYnJld2VyIiwic2NoZW1lR3JvdXBzIiwicmVkdWNlIiwiYWNjdSIsInR5cGUiLCJwYWxldHRlcyIsImdyb3VwIiwibmFtZSIsImNvbG9yUmFuZ2VzIiwiVml6Q29sb3JQYWxldHRlIiwia2V5TmFtZSIsImNvbG9yU2NoZW1lIiwibGVuS2V5IiwiY29sb3JzIiwicHVzaCIsImNhdGVnb3J5IiwiQ09MT1JfUkFOR0VTIiwiREVGQVVMVF9DT0xPUl9SQU5HRSIsImZpbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7Ozs7O0FBRUE7QUFDQTtBQUVBLElBQU1BLGNBQWMsR0FBR0MsTUFBTSxDQUFDQyxPQUFQLENBQWVDLHdCQUFZQyxZQUEzQixFQUF5Q0MsTUFBekMsQ0FDckIsVUFBQ0MsSUFBRDtBQUFBO0FBQUEsTUFBUUMsSUFBUjtBQUFBLE1BQWNDLFFBQWQ7O0FBQUEseUNBQ0tGLElBREwsR0FFS0UsUUFBUSxDQUFDSCxNQUFULENBQ0QsVUFBQ0ksS0FBRCxFQUFRQyxJQUFSO0FBQUEsMkNBQ0tELEtBREwsNENBRUdDLElBRkgsRUFFVUgsSUFGVjtBQUFBLEdBREMsRUFLRCxFQUxDLENBRkw7QUFBQSxDQURxQixFQVdyQixFQVhxQixDQUF2QjtBQWNBLElBQU1JLFdBQVcsdUNBQU9DLGtDQUFQLENBQWpCOztBQUVBLG1DQUFxQ1gsTUFBTSxDQUFDQyxPQUFQLENBQWVDLHVCQUFmLENBQXJDLHFDQUFrRTtBQUFBO0FBQUEsTUFBdERVLE9BQXNEO0FBQUEsTUFBN0NDLFdBQTZDOztBQUNoRSxNQUFJRCxPQUFPLEtBQUssY0FBaEIsRUFBZ0M7QUFDOUIseUNBQStCWixNQUFNLENBQUNDLE9BQVAsQ0FBZVksV0FBZixDQUEvQix3Q0FBNEQ7QUFBQTtBQUFBLFVBQWhEQyxNQUFnRDtBQUFBLFVBQXhDQyxNQUF3Qzs7QUFDMURMLE1BQUFBLFdBQVcsQ0FBQ00sSUFBWixDQUFpQjtBQUNmUCxRQUFBQSxJQUFJLHdCQUFpQkcsT0FBakIsY0FBNEJFLE1BQTVCLENBRFc7QUFFZlIsUUFBQUEsSUFBSSxFQUFFUCxjQUFjLENBQUNhLE9BQUQsQ0FGTDtBQUdmSyxRQUFBQSxRQUFRLEVBQUUsYUFISztBQUlmRixRQUFBQSxNQUFNLEVBQU5BO0FBSmUsT0FBakI7QUFNRDtBQUNGO0FBQ0Y7O0FBRU0sSUFBTUcsWUFBWSxHQUFHUixXQUFyQjs7QUFFQSxJQUFNUyxtQkFBbUIsR0FBR1QsV0FBVyxDQUFDVSxJQUFaLENBQWlCO0FBQUEsTUFBRVgsSUFBRixTQUFFQSxJQUFGO0FBQUEsU0FBWUEsSUFBSSxLQUFLLGdCQUFyQjtBQUFBLENBQWpCLEtBQTJEO0FBQzVGQSxFQUFBQSxJQUFJLEVBQUUsZ0JBRHNGO0FBRTVGSCxFQUFBQSxJQUFJLEVBQUUsS0FGc0Y7QUFHNUZXLEVBQUFBLFFBQVEsRUFBRSxNQUhrRjtBQUk1RkYsRUFBQUEsTUFBTSxFQUFFLENBQUMsU0FBRCxFQUFZLFNBQVosRUFBdUIsU0FBdkIsRUFBa0MsU0FBbEMsRUFBNkMsU0FBN0MsRUFBd0QsU0FBeEQ7QUFKb0YsQ0FBdkYiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgY29sb3JicmV3ZXIgZnJvbSAnY29sb3JicmV3ZXInO1xuaW1wb3J0IHtWaXpDb2xvclBhbGV0dGV9IGZyb20gJy4vY3VzdG9tLWNvbG9yLXJhbmdlcyc7XG5cbi8vIEFkZCBjb2xvcmJyZXdlciBjb2xvciBzY2hlbWVzIChEYXRhIFNjaWVuY2UgcmVxdWlyZW1lbnQpXG4vLyBTZWUgaHR0cDovL2NvbG9yYnJld2VyMi5vcmcvXG5cbmNvbnN0IGNvbG9yQnJld2VyTWFwID0gT2JqZWN0LmVudHJpZXMoY29sb3JicmV3ZXIuc2NoZW1lR3JvdXBzKS5yZWR1Y2UoXG4gIChhY2N1LCBbdHlwZSwgcGFsZXR0ZXNdKSA9PiAoe1xuICAgIC4uLmFjY3UsXG4gICAgLi4ucGFsZXR0ZXMucmVkdWNlKFxuICAgICAgKGdyb3VwLCBuYW1lKSA9PiAoe1xuICAgICAgICAuLi5ncm91cCxcbiAgICAgICAgW25hbWVdOiB0eXBlXG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKVxuICB9KSxcbiAge31cbik7XG5cbmNvbnN0IGNvbG9yUmFuZ2VzID0gWy4uLlZpekNvbG9yUGFsZXR0ZV07XG5cbmZvciAoY29uc3QgW2tleU5hbWUsIGNvbG9yU2NoZW1lXSBvZiBPYmplY3QuZW50cmllcyhjb2xvcmJyZXdlcikpIHtcbiAgaWYgKGtleU5hbWUgIT09ICdzY2hlbWVHcm91cHMnKSB7XG4gICAgZm9yIChjb25zdCBbbGVuS2V5LCBjb2xvcnNdIG9mIE9iamVjdC5lbnRyaWVzKGNvbG9yU2NoZW1lKSkge1xuICAgICAgY29sb3JSYW5nZXMucHVzaCh7XG4gICAgICAgIG5hbWU6IGBDb2xvckJyZXdlciAke2tleU5hbWV9LSR7bGVuS2V5fWAsXG4gICAgICAgIHR5cGU6IGNvbG9yQnJld2VyTWFwW2tleU5hbWVdLFxuICAgICAgICBjYXRlZ29yeTogJ0NvbG9yQnJld2VyJyxcbiAgICAgICAgY29sb3JzXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IENPTE9SX1JBTkdFUyA9IGNvbG9yUmFuZ2VzO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9DT0xPUl9SQU5HRSA9IGNvbG9yUmFuZ2VzLmZpbmQoKHtuYW1lfSkgPT4gbmFtZSA9PT0gJ0dsb2JhbCBXYXJtaW5nJykgfHwge1xuICBuYW1lOiAnR2xvYmFsIFdhcm1pbmcnLFxuICB0eXBlOiAnU0VRJyxcbiAgY2F0ZWdvcnk6ICdVYmVyJyxcbiAgY29sb3JzOiBbJyM1QTE4NDYnLCAnIzkwMEMzRicsICcjQzcwMDM5JywgJyNFMzYxMUMnLCAnI0YxOTIwRScsICcjRkZDMzAwJ11cbn07XG4iXX0=