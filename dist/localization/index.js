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
exports.messages = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _en = _interopRequireDefault(require("./en"));

var _localeUtils = require("../utils/locale-utils");

var _locales = require("./locales");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var en_flat = (0, _localeUtils.flattenMessages)(_en["default"]);
var messages = Object.keys(_locales.LOCALE_CODES).reduce(function (acc, key) {
  return _objectSpread({}, acc, (0, _defineProperty2["default"])({}, key, key === 'en' ? en_flat : _objectSpread({}, en_flat, {}, (0, _localeUtils.flattenMessages)(require("./".concat(key))["default"]))));
}, {});
exports.messages = messages;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2NhbGl6YXRpb24vaW5kZXguanMiXSwibmFtZXMiOlsiZW5fZmxhdCIsImVuIiwibWVzc2FnZXMiLCJPYmplY3QiLCJrZXlzIiwiTE9DQUxFX0NPREVTIiwicmVkdWNlIiwiYWNjIiwia2V5IiwicmVxdWlyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE9BQU8sR0FBRyxrQ0FBZ0JDLGNBQWhCLENBQWhCO0FBRU8sSUFBTUMsUUFBUSxHQUFHQyxNQUFNLENBQUNDLElBQVAsQ0FBWUMscUJBQVosRUFBMEJDLE1BQTFCLENBQ3RCLFVBQUNDLEdBQUQsRUFBTUMsR0FBTjtBQUFBLDJCQUNLRCxHQURMLHVDQUVHQyxHQUZILEVBRVNBLEdBQUcsS0FBSyxJQUFSLEdBQWVSLE9BQWYscUJBQTZCQSxPQUE3QixNQUF5QyxrQ0FBZ0JTLE9BQU8sYUFBTUQsR0FBTixFQUFQLFdBQWhCLENBQXpDLENBRlQ7QUFBQSxDQURzQixFQUt0QixFQUxzQixDQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBlbiBmcm9tICcuL2VuJztcbmltcG9ydCB7ZmxhdHRlbk1lc3NhZ2VzfSBmcm9tICd1dGlscy9sb2NhbGUtdXRpbHMnO1xuaW1wb3J0IHtMT0NBTEVfQ09ERVN9IGZyb20gJy4vbG9jYWxlcyc7XG5cbmNvbnN0IGVuX2ZsYXQgPSBmbGF0dGVuTWVzc2FnZXMoZW4pO1xuXG5leHBvcnQgY29uc3QgbWVzc2FnZXMgPSBPYmplY3Qua2V5cyhMT0NBTEVfQ09ERVMpLnJlZHVjZShcbiAgKGFjYywga2V5KSA9PiAoe1xuICAgIC4uLmFjYyxcbiAgICBba2V5XToga2V5ID09PSAnZW4nID8gZW5fZmxhdCA6IHsuLi5lbl9mbGF0LCAuLi5mbGF0dGVuTWVzc2FnZXMocmVxdWlyZShgLi8ke2tleX1gKS5kZWZhdWx0KX1cbiAgfSksXG4gIHt9XG4pO1xuXG5leHBvcnQge0xPQ0FMRV9DT0RFUywgTE9DQUxFU30gZnJvbSAnLi9sb2NhbGVzJztcbiJdfQ==