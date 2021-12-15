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
var Schema = /*#__PURE__*/function () {
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
        return _objectSpread(_objectSpread({}, accu), key in node ? _this.properties[key] ? // if it's another schema
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL3NjaGVtYS5qcyJdLCJuYW1lcyI6WyJTY2hlbWEiLCJ2ZXJzaW9uIiwiQ1VSUkVOVF9WRVJTSU9OIiwia2V5IiwicHJvcGVydGllcyIsIm5vZGUiLCJwYXJlbnRzIiwiYWNjdW11bGF0b3IiLCJfZ2V0UHJvcGVydHlWYWx1ZUZyb21TY2hlbWEiLCJvcGVyYXRpb24iLCJpbnRlcm5hbCIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhY2N1IiwiX2lzQ3VycmVudFZlcnNpb24iLCJDb25zb2xlIiwiZXJyb3IiLCJvdXRkYXRlZFZlcnNpb25FcnJvciIsInNhdmUiLCJzYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEiLCJsb2FkIiwibG9hZFByb3BlcnRpZXNPckFwcGx5U2NoZW1hIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFFQTs7Ozs7O0FBRUE7SUFDcUJBLE07QUFDbkIsb0JBQTJFO0FBQUEsbUZBQUosRUFBSTtBQUFBLDRCQUE5REMsT0FBOEQ7QUFBQSxRQUE5REEsT0FBOEQsNkJBQXBEQyx5QkFBb0Q7QUFBQSx3QkFBbkNDLEdBQW1DO0FBQUEsUUFBbkNBLEdBQW1DLHlCQUE3QixFQUE2QjtBQUFBLCtCQUF6QkMsVUFBeUI7QUFBQSxRQUF6QkEsVUFBeUIsZ0NBQVosSUFBWTs7QUFBQTtBQUN6RSxTQUFLSCxPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLRyxVQUFMLEdBQWtCQSxVQUFsQjtBQUNBLFNBQUtELEdBQUwsR0FBV0EsR0FBWDtBQUNEOzs7O1dBRUQscUNBQTRCRSxJQUE1QixFQUE2RDtBQUFBLFVBQTNCQyxPQUEyQix1RUFBakIsRUFBaUI7QUFBQSxVQUFiQyxXQUFhO0FBQzNELGFBQU8sS0FBS0MsMkJBQUwsQ0FBaUMsTUFBakMsRUFBeUNILElBQXpDLEVBQStDQyxPQUEvQyxFQUF3REMsV0FBeEQsQ0FBUDtBQUNEOzs7V0FFRCxxQ0FBNEJGLElBQTVCLEVBQTZEO0FBQUEsVUFBM0JDLE9BQTJCLHVFQUFqQixFQUFpQjtBQUFBLFVBQWJDLFdBQWE7QUFDM0QsYUFBTyxLQUFLQywyQkFBTCxDQUFpQyxNQUFqQyxFQUF5Q0gsSUFBekMsRUFBK0NDLE9BQS9DLEVBQXdEQyxXQUF4RCxDQUFQO0FBQ0Q7OztXQUVELHFDQUE0QkUsU0FBNUIsRUFBdUNKLElBQXZDLEVBQXdFO0FBQUE7O0FBQUEsVUFBM0JDLE9BQTJCLHVFQUFqQixFQUFpQjtBQUFBLFVBQWJDLFdBQWE7QUFDdEUsVUFBTUcsUUFBUSxjQUFPRCxTQUFQLENBQWQ7QUFDQSxrREFDRyxLQUFLTixHQURSLEVBQ2MsS0FBS0MsVUFBTCxHQUNSTyxNQUFNLENBQUNDLElBQVAsQ0FBWSxLQUFLUixVQUFqQixFQUE2QlMsTUFBN0IsQ0FBb0MsVUFBQ0MsSUFBRCxFQUFPWCxHQUFQLEVBQWU7QUFDakQsK0NBQ0tXLElBREwsR0FFTVgsR0FBRyxJQUFJRSxJQUFQLEdBQ0EsS0FBSSxDQUFDRCxVQUFMLENBQWdCRCxHQUFoQixJQUNFO0FBQ0EsUUFBQSxLQUFJLENBQUNDLFVBQUwsQ0FBZ0JELEdBQWhCLEVBQXFCTSxTQUFyQixJQUNFO0FBQ0EsUUFBQSxLQUFJLENBQUNMLFVBQUwsQ0FBZ0JELEdBQWhCLEVBQXFCTyxRQUFyQixFQUErQkwsSUFBSSxDQUFDRixHQUFELENBQW5DLGdEQUE4Q0csT0FBOUMsSUFBdURELElBQXZELElBQThEUyxJQUE5RCxDQUZGLEdBR0UsRUFMSix3Q0FNSVgsR0FOSixFQU1VRSxJQUFJLENBQUNGLEdBQUQsQ0FOZCxDQURBLEdBUUEsRUFWTjtBQVlELE9BYkQsRUFhRyxFQWJILENBRFEsR0FlUkUsSUFoQk47QUFrQkQ7OztXQUVELDZCQUFvQjtBQUNsQixhQUFPLEtBQUtKLE9BQUwsS0FBaUJDLHlCQUF4QjtBQUNEOzs7V0FFRCxnQ0FBdUI7QUFDckIsVUFBSSxDQUFDLEtBQUthLGlCQUFMLEVBQUwsRUFBK0I7QUFDN0JDLHdCQUFRQyxLQUFSLFdBQWlCLEtBQUtkLEdBQXRCLGNBQTZCLEtBQUtGLE9BQWxDO0FBQ0Q7QUFDRjs7O1dBRUQsaUJBQWU7QUFDYjtBQUNBLFdBQUtpQixvQkFBTDtBQUNBLGFBQU8sS0FBS0MsSUFBTCx1QkFBUDtBQUNEOzs7V0FFRCxjQUFLZCxJQUFMLEVBQTJDO0FBQUEsVUFBaENDLE9BQWdDLHVFQUF0QixFQUFzQjtBQUFBLFVBQWxCQyxXQUFrQix1RUFBSixFQUFJO0FBQ3pDLGFBQU8sS0FBS2EsMkJBQUwsQ0FBaUNmLElBQWpDLEVBQXVDQyxPQUF2QyxFQUFnREMsV0FBaEQsQ0FBUDtBQUNEOzs7V0FFRCxpQkFBZTtBQUNiLGFBQU8sS0FBS2MsSUFBTCx1QkFBUDtBQUNEOzs7V0FFRCxjQUFLaEIsSUFBTCxFQUEyQztBQUFBLFVBQWhDQyxPQUFnQyx1RUFBdEIsRUFBc0I7QUFBQSxVQUFsQkMsV0FBa0IsdUVBQUosRUFBSTtBQUN6QyxhQUFPLEtBQUtlLDJCQUFMLENBQWlDakIsSUFBakMsRUFBdUNDLE9BQXZDLEVBQWdEQyxXQUFoRCxDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmltcG9ydCB7Q1VSUkVOVF9WRVJTSU9OfSBmcm9tICcuL3ZlcnNpb25zJztcblxuLyoqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL3NjaGVtYScpLlNjaGVtYX0gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKHt2ZXJzaW9uID0gQ1VSUkVOVF9WRVJTSU9OLCBrZXkgPSAnJywgcHJvcGVydGllcyA9IG51bGx9ID0ge30pIHtcbiAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgdGhpcy5rZXkgPSBrZXk7XG4gIH1cblxuICBsb2FkUHJvcGVydGllc09yQXBwbHlTY2hlbWEobm9kZSwgcGFyZW50cyA9IFtdLCBhY2N1bXVsYXRvcikge1xuICAgIHJldHVybiB0aGlzLl9nZXRQcm9wZXJ0eVZhbHVlRnJvbVNjaGVtYSgnbG9hZCcsIG5vZGUsIHBhcmVudHMsIGFjY3VtdWxhdG9yKTtcbiAgfVxuXG4gIHNhdmVQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShub2RlLCBwYXJlbnRzID0gW10sIGFjY3VtdWxhdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFByb3BlcnR5VmFsdWVGcm9tU2NoZW1hKCdzYXZlJywgbm9kZSwgcGFyZW50cywgYWNjdW11bGF0b3IpO1xuICB9XG5cbiAgX2dldFByb3BlcnR5VmFsdWVGcm9tU2NoZW1hKG9wZXJhdGlvbiwgbm9kZSwgcGFyZW50cyA9IFtdLCBhY2N1bXVsYXRvcikge1xuICAgIGNvbnN0IGludGVybmFsID0gYF8ke29wZXJhdGlvbn1gO1xuICAgIHJldHVybiB7XG4gICAgICBbdGhpcy5rZXldOiB0aGlzLnByb3BlcnRpZXNcbiAgICAgICAgPyBPYmplY3Qua2V5cyh0aGlzLnByb3BlcnRpZXMpLnJlZHVjZSgoYWNjdSwga2V5KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgICAuLi4oa2V5IGluIG5vZGVcbiAgICAgICAgICAgICAgICA/IHRoaXMucHJvcGVydGllc1trZXldXG4gICAgICAgICAgICAgICAgICA/IC8vIGlmIGl0J3MgYW5vdGhlciBzY2hlbWFcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzW2tleV1bb3BlcmF0aW9uXVxuICAgICAgICAgICAgICAgICAgICA/IC8vIGNhbGwgc2F2ZSBvciBsb2FkXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzW2tleV1baW50ZXJuYWxdKG5vZGVba2V5XSwgWy4uLnBhcmVudHMsIG5vZGVdLCBhY2N1KVxuICAgICAgICAgICAgICAgICAgICA6IHt9XG4gICAgICAgICAgICAgICAgICA6IHtba2V5XTogbm9kZVtrZXldfVxuICAgICAgICAgICAgICAgIDoge30pXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sIHt9KVxuICAgICAgICA6IG5vZGVcbiAgICB9O1xuICB9XG5cbiAgX2lzQ3VycmVudFZlcnNpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudmVyc2lvbiA9PT0gQ1VSUkVOVF9WRVJTSU9OO1xuICB9XG5cbiAgb3V0ZGF0ZWRWZXJzaW9uRXJyb3IoKSB7XG4gICAgaWYgKCF0aGlzLl9pc0N1cnJlbnRWZXJzaW9uKCkpIHtcbiAgICAgIENvbnNvbGUuZXJyb3IoYCR7dGhpcy5rZXl9ICR7dGhpcy52ZXJzaW9ufSBpcyBvdXRkYXRlZC4gc2F2ZSBzaG91bGQgbm90IGJlIGNhbGxlZCBhbnltb3JlYCk7XG4gICAgfVxuICB9XG5cbiAgX3NhdmUoLi4uYXJncykge1xuICAgIC8vIG1ha2Ugc3VyZSBub3RoaW5nIGlzIHNhdmVkIHRvIGFuIG91dGRhdGVkIHZlcnNpb25cbiAgICB0aGlzLm91dGRhdGVkVmVyc2lvbkVycm9yKCk7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZSguLi5hcmdzKTtcbiAgfVxuXG4gIHNhdmUobm9kZSwgcGFyZW50cyA9IFtdLCBhY2N1bXVsYXRvciA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hKG5vZGUsIHBhcmVudHMsIGFjY3VtdWxhdG9yKTtcbiAgfVxuXG4gIF9sb2FkKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkKC4uLmFyZ3MpO1xuICB9XG5cbiAgbG9hZChub2RlLCBwYXJlbnRzID0gW10sIGFjY3VtdWxhdG9yID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkUHJvcGVydGllc09yQXBwbHlTY2hlbWEobm9kZSwgcGFyZW50cywgYWNjdW11bGF0b3IpO1xuICB9XG59XG4iXX0=