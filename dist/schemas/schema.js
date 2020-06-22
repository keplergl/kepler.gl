"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _window = require("global/window");

var _versions = require("./versions");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/** @type {typeof import('./schema').Schema} */
var Schema =
/*#__PURE__*/
function () {
  function Schema() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$version = _ref.version,
        version = _ref$version === void 0 ? _versions.CURRENT_VERSION : _ref$version,
        _ref$key = _ref.key,
        key = _ref$key === void 0 ? '' : _ref$key,
        _ref$properties = _ref.properties,
        properties = _ref$properties === void 0 ? null : _ref$properties;

    (0, _classCallCheck2["default"])(this, Schema);
    this.version = version;
    this.properties = properties;
    this.key = key;
  }

  (0, _createClass2["default"])(Schema, [{
    key: "loadPropertiesOrApplySchema",
    value: function loadPropertiesOrApplySchema(node) {
      var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var accumulator = arguments.length > 2 ? arguments[2] : undefined;
      return this._getPropertyValueFromSchema('load', node, parents, accumulator);
    }
  }, {
    key: "savePropertiesOrApplySchema",
    value: function savePropertiesOrApplySchema(node) {
      var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var accumulator = arguments.length > 2 ? arguments[2] : undefined;
      return this._getPropertyValueFromSchema('save', node, parents, accumulator);
    }
  }, {
    key: "_getPropertyValueFromSchema",
    value: function _getPropertyValueFromSchema(operation, node) {
      var _this = this;

      var parents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var accumulator = arguments.length > 3 ? arguments[3] : undefined;
      var internal = "_".concat(operation);
      return (0, _defineProperty2["default"])({}, this.key, this.properties ? Object.keys(this.properties).reduce(function (accu, key) {
        return _objectSpread({}, accu, {}, key in node ? _this.properties[key] ? // if it's another schema
        _this.properties[key][operation] ? // call save or load
        _this.properties[key][internal](node[key], [].concat((0, _toConsumableArray2["default"])(parents), [node]), accu) : {} : (0, _defineProperty2["default"])({}, key, node[key]) : {});
      }, {}) : node);
    }
  }, {
    key: "_isCurrentVersion",
    value: function _isCurrentVersion() {
      return this.version === _versions.CURRENT_VERSION;
    }
  }, {
    key: "outdatedVersionError",
    value: function outdatedVersionError() {
      if (!this._isCurrentVersion()) {
        _window.console.error("".concat(this.key, " ").concat(this.version, " is outdated. save should not be called anymore"));
      }
    }
  }, {
    key: "_save",
    value: function _save() {
      // make sure nothing is saved to an outdated version
      this.outdatedVersionError();
      return this.save.apply(this, arguments);
    }
  }, {
    key: "save",
    value: function save(node) {
      var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var accumulator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.savePropertiesOrApplySchema(node, parents, accumulator);
    }
  }, {
    key: "_load",
    value: function _load() {
      return this.load.apply(this, arguments);
    }
  }, {
    key: "load",
    value: function load(node) {
      var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var accumulator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.loadPropertiesOrApplySchema(node, parents, accumulator);
    }
  }]);
  return Schema;
}();

exports["default"] = Schema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL3NjaGVtYS5qcyJdLCJuYW1lcyI6WyJTY2hlbWEiLCJ2ZXJzaW9uIiwiQ1VSUkVOVF9WRVJTSU9OIiwia2V5IiwicHJvcGVydGllcyIsIm5vZGUiLCJwYXJlbnRzIiwiYWNjdW11bGF0b3IiLCJfZ2V0UHJvcGVydHlWYWx1ZUZyb21TY2hlbWEiLCJvcGVyYXRpb24iLCJpbnRlcm5hbCIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhY2N1IiwiX2lzQ3VycmVudFZlcnNpb24iLCJDb25zb2xlIiwiZXJyb3IiLCJvdXRkYXRlZFZlcnNpb25FcnJvciIsInNhdmUiLCJzYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEiLCJsb2FkIiwibG9hZFByb3BlcnRpZXNPckFwcGx5U2NoZW1hIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFFQTs7Ozs7O0FBRUE7SUFDcUJBLE07OztBQUNuQixvQkFBMkU7QUFBQSxtRkFBSixFQUFJO0FBQUEsNEJBQTlEQyxPQUE4RDtBQUFBLFFBQTlEQSxPQUE4RCw2QkFBcERDLHlCQUFvRDtBQUFBLHdCQUFuQ0MsR0FBbUM7QUFBQSxRQUFuQ0EsR0FBbUMseUJBQTdCLEVBQTZCO0FBQUEsK0JBQXpCQyxVQUF5QjtBQUFBLFFBQXpCQSxVQUF5QixnQ0FBWixJQUFZOztBQUFBO0FBQ3pFLFNBQUtILE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUtHLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0QsR0FBTCxHQUFXQSxHQUFYO0FBQ0Q7Ozs7Z0RBRTJCRSxJLEVBQWlDO0FBQUEsVUFBM0JDLE9BQTJCLHVFQUFqQixFQUFpQjtBQUFBLFVBQWJDLFdBQWE7QUFDM0QsYUFBTyxLQUFLQywyQkFBTCxDQUFpQyxNQUFqQyxFQUF5Q0gsSUFBekMsRUFBK0NDLE9BQS9DLEVBQXdEQyxXQUF4RCxDQUFQO0FBQ0Q7OztnREFFMkJGLEksRUFBaUM7QUFBQSxVQUEzQkMsT0FBMkIsdUVBQWpCLEVBQWlCO0FBQUEsVUFBYkMsV0FBYTtBQUMzRCxhQUFPLEtBQUtDLDJCQUFMLENBQWlDLE1BQWpDLEVBQXlDSCxJQUF6QyxFQUErQ0MsT0FBL0MsRUFBd0RDLFdBQXhELENBQVA7QUFDRDs7O2dEQUUyQkUsUyxFQUFXSixJLEVBQWlDO0FBQUE7O0FBQUEsVUFBM0JDLE9BQTJCLHVFQUFqQixFQUFpQjtBQUFBLFVBQWJDLFdBQWE7QUFDdEUsVUFBTUcsUUFBUSxjQUFPRCxTQUFQLENBQWQ7QUFDQSxrREFDRyxLQUFLTixHQURSLEVBQ2MsS0FBS0MsVUFBTCxHQUNSTyxNQUFNLENBQUNDLElBQVAsQ0FBWSxLQUFLUixVQUFqQixFQUE2QlMsTUFBN0IsQ0FBb0MsVUFBQ0MsSUFBRCxFQUFPWCxHQUFQLEVBQWU7QUFDakQsaUNBQ0tXLElBREwsTUFFTVgsR0FBRyxJQUFJRSxJQUFQLEdBQ0EsS0FBSSxDQUFDRCxVQUFMLENBQWdCRCxHQUFoQixJQUNFO0FBQ0EsUUFBQSxLQUFJLENBQUNDLFVBQUwsQ0FBZ0JELEdBQWhCLEVBQXFCTSxTQUFyQixJQUNFO0FBQ0EsUUFBQSxLQUFJLENBQUNMLFVBQUwsQ0FBZ0JELEdBQWhCLEVBQXFCTyxRQUFyQixFQUErQkwsSUFBSSxDQUFDRixHQUFELENBQW5DLGdEQUE4Q0csT0FBOUMsSUFBdURELElBQXZELElBQThEUyxJQUE5RCxDQUZGLEdBR0UsRUFMSix3Q0FNSVgsR0FOSixFQU1VRSxJQUFJLENBQUNGLEdBQUQsQ0FOZCxDQURBLEdBUUEsRUFWTjtBQVlELE9BYkQsRUFhRyxFQWJILENBRFEsR0FlUkUsSUFoQk47QUFrQkQ7Ozt3Q0FFbUI7QUFDbEIsYUFBTyxLQUFLSixPQUFMLEtBQWlCQyx5QkFBeEI7QUFDRDs7OzJDQUVzQjtBQUNyQixVQUFJLENBQUMsS0FBS2EsaUJBQUwsRUFBTCxFQUErQjtBQUM3QkMsd0JBQVFDLEtBQVIsV0FBaUIsS0FBS2QsR0FBdEIsY0FBNkIsS0FBS0YsT0FBbEM7QUFDRDtBQUNGOzs7NEJBRWM7QUFDYjtBQUNBLFdBQUtpQixvQkFBTDtBQUNBLGFBQU8sS0FBS0MsSUFBTCx1QkFBUDtBQUNEOzs7eUJBRUlkLEksRUFBc0M7QUFBQSxVQUFoQ0MsT0FBZ0MsdUVBQXRCLEVBQXNCO0FBQUEsVUFBbEJDLFdBQWtCLHVFQUFKLEVBQUk7QUFDekMsYUFBTyxLQUFLYSwyQkFBTCxDQUFpQ2YsSUFBakMsRUFBdUNDLE9BQXZDLEVBQWdEQyxXQUFoRCxDQUFQO0FBQ0Q7Ozs0QkFFYztBQUNiLGFBQU8sS0FBS2MsSUFBTCx1QkFBUDtBQUNEOzs7eUJBRUloQixJLEVBQXNDO0FBQUEsVUFBaENDLE9BQWdDLHVFQUF0QixFQUFzQjtBQUFBLFVBQWxCQyxXQUFrQix1RUFBSixFQUFJO0FBQ3pDLGFBQU8sS0FBS2UsMkJBQUwsQ0FBaUNqQixJQUFqQyxFQUF1Q0MsT0FBdkMsRUFBZ0RDLFdBQWhELENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcblxuaW1wb3J0IHtDVVJSRU5UX1ZFUlNJT059IGZyb20gJy4vdmVyc2lvbnMnO1xuXG4vKiogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vc2NoZW1hJykuU2NoZW1hfSAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZW1hIHtcbiAgY29uc3RydWN0b3Ioe3ZlcnNpb24gPSBDVVJSRU5UX1ZFUlNJT04sIGtleSA9ICcnLCBwcm9wZXJ0aWVzID0gbnVsbH0gPSB7fSkge1xuICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb247XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICB0aGlzLmtleSA9IGtleTtcbiAgfVxuXG4gIGxvYWRQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShub2RlLCBwYXJlbnRzID0gW10sIGFjY3VtdWxhdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFByb3BlcnR5VmFsdWVGcm9tU2NoZW1hKCdsb2FkJywgbm9kZSwgcGFyZW50cywgYWNjdW11bGF0b3IpO1xuICB9XG5cbiAgc2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hKG5vZGUsIHBhcmVudHMgPSBbXSwgYWNjdW11bGF0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0UHJvcGVydHlWYWx1ZUZyb21TY2hlbWEoJ3NhdmUnLCBub2RlLCBwYXJlbnRzLCBhY2N1bXVsYXRvcik7XG4gIH1cblxuICBfZ2V0UHJvcGVydHlWYWx1ZUZyb21TY2hlbWEob3BlcmF0aW9uLCBub2RlLCBwYXJlbnRzID0gW10sIGFjY3VtdWxhdG9yKSB7XG4gICAgY29uc3QgaW50ZXJuYWwgPSBgXyR7b3BlcmF0aW9ufWA7XG4gICAgcmV0dXJuIHtcbiAgICAgIFt0aGlzLmtleV06IHRoaXMucHJvcGVydGllc1xuICAgICAgICA/IE9iamVjdC5rZXlzKHRoaXMucHJvcGVydGllcykucmVkdWNlKChhY2N1LCBrZXkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgICAgIC4uLihrZXkgaW4gbm9kZVxuICAgICAgICAgICAgICAgID8gdGhpcy5wcm9wZXJ0aWVzW2tleV1cbiAgICAgICAgICAgICAgICAgID8gLy8gaWYgaXQncyBhbm90aGVyIHNjaGVtYVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXNba2V5XVtvcGVyYXRpb25dXG4gICAgICAgICAgICAgICAgICAgID8gLy8gY2FsbCBzYXZlIG9yIGxvYWRcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXNba2V5XVtpbnRlcm5hbF0obm9kZVtrZXldLCBbLi4ucGFyZW50cywgbm9kZV0sIGFjY3UpXG4gICAgICAgICAgICAgICAgICAgIDoge31cbiAgICAgICAgICAgICAgICAgIDoge1trZXldOiBub2RlW2tleV19XG4gICAgICAgICAgICAgICAgOiB7fSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSwge30pXG4gICAgICAgIDogbm9kZVxuICAgIH07XG4gIH1cblxuICBfaXNDdXJyZW50VmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy52ZXJzaW9uID09PSBDVVJSRU5UX1ZFUlNJT047XG4gIH1cblxuICBvdXRkYXRlZFZlcnNpb25FcnJvcigpIHtcbiAgICBpZiAoIXRoaXMuX2lzQ3VycmVudFZlcnNpb24oKSkge1xuICAgICAgQ29uc29sZS5lcnJvcihgJHt0aGlzLmtleX0gJHt0aGlzLnZlcnNpb259IGlzIG91dGRhdGVkLiBzYXZlIHNob3VsZCBub3QgYmUgY2FsbGVkIGFueW1vcmVgKTtcbiAgICB9XG4gIH1cblxuICBfc2F2ZSguLi5hcmdzKSB7XG4gICAgLy8gbWFrZSBzdXJlIG5vdGhpbmcgaXMgc2F2ZWQgdG8gYW4gb3V0ZGF0ZWQgdmVyc2lvblxuICAgIHRoaXMub3V0ZGF0ZWRWZXJzaW9uRXJyb3IoKTtcbiAgICByZXR1cm4gdGhpcy5zYXZlKC4uLmFyZ3MpO1xuICB9XG5cbiAgc2F2ZShub2RlLCBwYXJlbnRzID0gW10sIGFjY3VtdWxhdG9yID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5zYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEobm9kZSwgcGFyZW50cywgYWNjdW11bGF0b3IpO1xuICB9XG5cbiAgX2xvYWQoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLmxvYWQoLi4uYXJncyk7XG4gIH1cblxuICBsb2FkKG5vZGUsIHBhcmVudHMgPSBbXSwgYWNjdW11bGF0b3IgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmxvYWRQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShub2RlLCBwYXJlbnRzLCBhY2N1bXVsYXRvcik7XG4gIH1cbn1cbiJdfQ==