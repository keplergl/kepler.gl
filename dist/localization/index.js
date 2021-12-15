"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "LOCALE_CODES", {
  enumerable: true,
  get: function get() {
    return _locales.LOCALE_CODES;
  }
});
Object.defineProperty(exports, "LOCALES", {
  enumerable: true,
  get: function get() {
    return _locales.LOCALES;
  }
});
Object.defineProperty(exports, "FormattedMessage", {
  enumerable: true,
  get: function get() {
    return _formattedMessage["default"];
  }
});
exports.messages = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _en = _interopRequireDefault(require("./en"));

var _localeUtils = require("../utils/locale-utils");

var _locales = require("./locales");

var _formattedMessage = _interopRequireDefault(require("./formatted-message"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var enFlat = (0, _localeUtils.flattenMessages)(_en["default"]);
var messages = Object.keys(_locales.LOCALE_CODES).reduce(function (acc, key) {
  return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, key, key === 'en' ? enFlat : _objectSpread(_objectSpread({}, enFlat), (0, _localeUtils.flattenMessages)(require("./".concat(key))["default"]))));
}, {});
exports.messages = messages;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2NhbGl6YXRpb24vaW5kZXguanMiXSwibmFtZXMiOlsiZW5GbGF0IiwiZW4iLCJtZXNzYWdlcyIsIk9iamVjdCIsImtleXMiLCJMT0NBTEVfQ09ERVMiLCJyZWR1Y2UiLCJhY2MiLCJrZXkiLCJyZXF1aXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFjQTs7Ozs7O0FBWkEsSUFBTUEsTUFBTSxHQUFHLGtDQUFnQkMsY0FBaEIsQ0FBZjtBQUVPLElBQU1DLFFBQVEsR0FBR0MsTUFBTSxDQUFDQyxJQUFQLENBQVlDLHFCQUFaLEVBQTBCQyxNQUExQixDQUN0QixVQUFDQyxHQUFELEVBQU1DLEdBQU47QUFBQSx5Q0FDS0QsR0FETCw0Q0FFR0MsR0FGSCxFQUVTQSxHQUFHLEtBQUssSUFBUixHQUFlUixNQUFmLG1DQUE0QkEsTUFBNUIsR0FBdUMsa0NBQWdCUyxPQUFPLGFBQU1ELEdBQU4sRUFBUCxXQUFoQixDQUF2QyxDQUZUO0FBQUEsQ0FEc0IsRUFLdEIsRUFMc0IsQ0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgZW4gZnJvbSAnLi9lbic7XG5pbXBvcnQge2ZsYXR0ZW5NZXNzYWdlc30gZnJvbSAndXRpbHMvbG9jYWxlLXV0aWxzJztcbmltcG9ydCB7TE9DQUxFX0NPREVTfSBmcm9tICcuL2xvY2FsZXMnO1xuXG5jb25zdCBlbkZsYXQgPSBmbGF0dGVuTWVzc2FnZXMoZW4pO1xuXG5leHBvcnQgY29uc3QgbWVzc2FnZXMgPSBPYmplY3Qua2V5cyhMT0NBTEVfQ09ERVMpLnJlZHVjZShcbiAgKGFjYywga2V5KSA9PiAoe1xuICAgIC4uLmFjYyxcbiAgICBba2V5XToga2V5ID09PSAnZW4nID8gZW5GbGF0IDogey4uLmVuRmxhdCwgLi4uZmxhdHRlbk1lc3NhZ2VzKHJlcXVpcmUoYC4vJHtrZXl9YCkuZGVmYXVsdCl9XG4gIH0pLFxuICB7fVxuKTtcblxuZXhwb3J0IHtMT0NBTEVfQ09ERVMsIExPQ0FMRVN9IGZyb20gJy4vbG9jYWxlcyc7XG5cbmV4cG9ydCB7ZGVmYXVsdCBhcyBGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICcuL2Zvcm1hdHRlZC1tZXNzYWdlJztcbiJdfQ==