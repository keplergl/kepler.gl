'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _window = require('global/window');

var _versions = require('./versions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = function () {
  function Schema() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        version = _ref.version,
        key = _ref.key,
        properties = _ref.properties;

    (0, _classCallCheck3.default)(this, Schema);

    this.version = version;
    this.properties = properties;
    this.key = key;
  }

  (0, _createClass3.default)(Schema, [{
    key: 'loadPropertiesOrApplySchema',
    value: function loadPropertiesOrApplySchema(node, parent, accumulator) {
      return this._getPropertyValueFromSchema('load', node, parent, accumulator);
    }
  }, {
    key: 'savePropertiesOrApplySchema',
    value: function savePropertiesOrApplySchema(node, parent, accumulator) {
      return this._getPropertyValueFromSchema('save', node, parent, accumulator);
    }
  }, {
    key: '_getPropertyValueFromSchema',
    value: function _getPropertyValueFromSchema(operation, node, parent, accumulator) {
      var _this = this;

      var internal = '_' + operation;
      var loaded = (0, _defineProperty3.default)({}, this.key, this.properties ? Object.keys(this.properties).reduce(function (accu, key) {
        return (0, _extends3.default)({}, accu, key in node ? _this.properties[key] ? // if it's another schema
        _this.properties[key][operation] ? // call save or load
        _this.properties[key][internal](node[key], node, accu) : {} : (0, _defineProperty3.default)({}, key, node[key]) : {});
      }, {}) : node);

      return loaded;
    }
  }, {
    key: '_isCurrentVersion',
    value: function _isCurrentVersion() {
      return this.version === _versions.CURRENT_VERSION;
    }
  }, {
    key: 'outdatedVersionError',
    value: function outdatedVersionError() {
      if (!this._isCurrentVersion()) {
        _window.console.error(this.key + ' ' + this.version + ' is outdated. save should not be called anymore');
      }
    }
  }, {
    key: '_save',
    value: function _save() {
      // make sure nothing is saved to an outdated version
      this.outdatedVersionError();
      return this.save.apply(this, arguments);
    }
  }, {
    key: 'save',
    value: function save(node, parent) {
      var accumulator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.savePropertiesOrApplySchema(node, parent, accumulator);
    }
  }, {
    key: '_load',
    value: function _load() {
      return this.load.apply(this, arguments);
    }
  }, {
    key: 'load',
    value: function load(node, parent) {
      var accumulator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.loadPropertiesOrApplySchema(node, parent, accumulator);
    }
  }]);
  return Schema;
}();

exports.default = Schema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL3NjaGVtYS5qcyJdLCJuYW1lcyI6WyJTY2hlbWEiLCJ2ZXJzaW9uIiwia2V5IiwicHJvcGVydGllcyIsIm5vZGUiLCJwYXJlbnQiLCJhY2N1bXVsYXRvciIsIl9nZXRQcm9wZXJ0eVZhbHVlRnJvbVNjaGVtYSIsIm9wZXJhdGlvbiIsImludGVybmFsIiwibG9hZGVkIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsImFjY3UiLCJfaXNDdXJyZW50VmVyc2lvbiIsImVycm9yIiwib3V0ZGF0ZWRWZXJzaW9uRXJyb3IiLCJzYXZlIiwic2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hIiwibG9hZCIsImxvYWRQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7OztJQUVxQkEsTTtBQUNuQixvQkFBNkM7QUFBQSxtRkFBSixFQUFJO0FBQUEsUUFBaENDLE9BQWdDLFFBQWhDQSxPQUFnQztBQUFBLFFBQXZCQyxHQUF1QixRQUF2QkEsR0FBdUI7QUFBQSxRQUFsQkMsVUFBa0IsUUFBbEJBLFVBQWtCOztBQUFBOztBQUMzQyxTQUFLRixPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLRSxVQUFMLEdBQWtCQSxVQUFsQjtBQUNBLFNBQUtELEdBQUwsR0FBV0EsR0FBWDtBQUNEOzs7O2dEQUUyQkUsSSxFQUFNQyxNLEVBQVFDLFcsRUFBYTtBQUNyRCxhQUFPLEtBQUtDLDJCQUFMLENBQWlDLE1BQWpDLEVBQXlDSCxJQUF6QyxFQUErQ0MsTUFBL0MsRUFBdURDLFdBQXZELENBQVA7QUFDRDs7O2dEQUUyQkYsSSxFQUFNQyxNLEVBQVFDLFcsRUFBYTtBQUNyRCxhQUFPLEtBQUtDLDJCQUFMLENBQWlDLE1BQWpDLEVBQXlDSCxJQUF6QyxFQUErQ0MsTUFBL0MsRUFBdURDLFdBQXZELENBQVA7QUFDRDs7O2dEQUUyQkUsUyxFQUFXSixJLEVBQU1DLE0sRUFBUUMsVyxFQUFhO0FBQUE7O0FBQ2hFLFVBQU1HLGlCQUFlRCxTQUFyQjtBQUNBLFVBQU1FLDJDQUNILEtBQUtSLEdBREYsRUFDUSxLQUFLQyxVQUFMLEdBQ1JRLE9BQU9DLElBQVAsQ0FBWSxLQUFLVCxVQUFqQixFQUE2QlUsTUFBN0IsQ0FBb0MsVUFBQ0MsSUFBRCxFQUFPWixHQUFQLEVBQWU7QUFDakQsMENBQ0tZLElBREwsRUFFTVosT0FBT0UsSUFBUCxHQUNBLE1BQUtELFVBQUwsQ0FBZ0JELEdBQWhCLElBQ0U7QUFDQSxjQUFLQyxVQUFMLENBQWdCRCxHQUFoQixFQUFxQk0sU0FBckIsSUFDRTtBQUNBLGNBQUtMLFVBQUwsQ0FBZ0JELEdBQWhCLEVBQXFCTyxRQUFyQixFQUErQkwsS0FBS0YsR0FBTCxDQUEvQixFQUEwQ0UsSUFBMUMsRUFBZ0RVLElBQWhELENBRkYsR0FHRSxFQUxKLHFDQU1JWixHQU5KLEVBTVVFLEtBQUtGLEdBQUwsQ0FOVixDQURBLEdBUUEsRUFWTjtBQVlELE9BYkQsRUFhRyxFQWJILENBRFEsR0FlUkUsSUFoQkEsQ0FBTjs7QUFtQkEsYUFBT00sTUFBUDtBQUNEOzs7d0NBRW1CO0FBQ2xCLGFBQU8sS0FBS1QsT0FBTCw4QkFBUDtBQUNEOzs7MkNBRXNCO0FBQ3JCLFVBQUksQ0FBQyxLQUFLYyxpQkFBTCxFQUFMLEVBQStCO0FBQzdCLHdCQUFRQyxLQUFSLENBQ0ssS0FBS2QsR0FEVixTQUVJLEtBQUtELE9BRlQ7QUFLRDtBQUNGOzs7NEJBRWM7QUFDYjtBQUNBLFdBQUtnQixvQkFBTDtBQUNBLGFBQU8sS0FBS0MsSUFBTCx1QkFBUDtBQUNEOzs7eUJBRUlkLEksRUFBTUMsTSxFQUEwQjtBQUFBLFVBQWxCQyxXQUFrQix1RUFBSixFQUFJOztBQUNuQyxhQUFPLEtBQUthLDJCQUFMLENBQWlDZixJQUFqQyxFQUF1Q0MsTUFBdkMsRUFBK0NDLFdBQS9DLENBQVA7QUFDRDs7OzRCQUVjO0FBQ2IsYUFBTyxLQUFLYyxJQUFMLHVCQUFQO0FBQ0Q7Ozt5QkFFSWhCLEksRUFBTUMsTSxFQUEwQjtBQUFBLFVBQWxCQyxXQUFrQix1RUFBSixFQUFJOztBQUNuQyxhQUFPLEtBQUtlLDJCQUFMLENBQWlDakIsSUFBakMsRUFBdUNDLE1BQXZDLEVBQStDQyxXQUEvQyxDQUFQO0FBQ0Q7Ozs7O2tCQXJFa0JOLE0iLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5pbXBvcnQge0NVUlJFTlRfVkVSU0lPTn0gZnJvbSAnLi92ZXJzaW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKHt2ZXJzaW9uLCBrZXksIHByb3BlcnRpZXN9ID0ge30pIHtcbiAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgdGhpcy5rZXkgPSBrZXk7XG4gIH1cblxuICBsb2FkUHJvcGVydGllc09yQXBwbHlTY2hlbWEobm9kZSwgcGFyZW50LCBhY2N1bXVsYXRvcikge1xuICAgIHJldHVybiB0aGlzLl9nZXRQcm9wZXJ0eVZhbHVlRnJvbVNjaGVtYSgnbG9hZCcsIG5vZGUsIHBhcmVudCwgYWNjdW11bGF0b3IpO1xuICB9XG5cbiAgc2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hKG5vZGUsIHBhcmVudCwgYWNjdW11bGF0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0UHJvcGVydHlWYWx1ZUZyb21TY2hlbWEoJ3NhdmUnLCBub2RlLCBwYXJlbnQsIGFjY3VtdWxhdG9yKTtcbiAgfVxuXG4gIF9nZXRQcm9wZXJ0eVZhbHVlRnJvbVNjaGVtYShvcGVyYXRpb24sIG5vZGUsIHBhcmVudCwgYWNjdW11bGF0b3IpIHtcbiAgICBjb25zdCBpbnRlcm5hbCA9IGBfJHtvcGVyYXRpb259YDtcbiAgICBjb25zdCBsb2FkZWQgPSB7XG4gICAgICBbdGhpcy5rZXldOiB0aGlzLnByb3BlcnRpZXNcbiAgICAgICAgPyBPYmplY3Qua2V5cyh0aGlzLnByb3BlcnRpZXMpLnJlZHVjZSgoYWNjdSwga2V5KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgICAuLi4oa2V5IGluIG5vZGVcbiAgICAgICAgICAgICAgICA/IHRoaXMucHJvcGVydGllc1trZXldXG4gICAgICAgICAgICAgICAgICA/IC8vIGlmIGl0J3MgYW5vdGhlciBzY2hlbWFcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzW2tleV1bb3BlcmF0aW9uXVxuICAgICAgICAgICAgICAgICAgICA/IC8vIGNhbGwgc2F2ZSBvciBsb2FkXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzW2tleV1baW50ZXJuYWxdKG5vZGVba2V5XSwgbm9kZSwgYWNjdSlcbiAgICAgICAgICAgICAgICAgICAgOiB7fVxuICAgICAgICAgICAgICAgICAgOiB7W2tleV06IG5vZGVba2V5XX1cbiAgICAgICAgICAgICAgICA6IHt9KVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LCB7fSlcbiAgICAgICAgOiBub2RlXG4gICAgfTtcblxuICAgIHJldHVybiBsb2FkZWQ7XG4gIH1cblxuICBfaXNDdXJyZW50VmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy52ZXJzaW9uID09PSBDVVJSRU5UX1ZFUlNJT047XG4gIH1cblxuICBvdXRkYXRlZFZlcnNpb25FcnJvcigpIHtcbiAgICBpZiAoIXRoaXMuX2lzQ3VycmVudFZlcnNpb24oKSkge1xuICAgICAgQ29uc29sZS5lcnJvcihcbiAgICAgICAgYCR7dGhpcy5rZXl9ICR7XG4gICAgICAgICAgdGhpcy52ZXJzaW9uXG4gICAgICAgIH0gaXMgb3V0ZGF0ZWQuIHNhdmUgc2hvdWxkIG5vdCBiZSBjYWxsZWQgYW55bW9yZWBcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgX3NhdmUoLi4uYXJncykge1xuICAgIC8vIG1ha2Ugc3VyZSBub3RoaW5nIGlzIHNhdmVkIHRvIGFuIG91dGRhdGVkIHZlcnNpb25cbiAgICB0aGlzLm91dGRhdGVkVmVyc2lvbkVycm9yKCk7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZSguLi5hcmdzKTtcbiAgfVxuXG4gIHNhdmUobm9kZSwgcGFyZW50LCBhY2N1bXVsYXRvciA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hKG5vZGUsIHBhcmVudCwgYWNjdW11bGF0b3IpO1xuICB9XG5cbiAgX2xvYWQoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLmxvYWQoLi4uYXJncyk7XG4gIH1cblxuICBsb2FkKG5vZGUsIHBhcmVudCwgYWNjdW11bGF0b3IgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmxvYWRQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShub2RlLCBwYXJlbnQsIGFjY3VtdWxhdG9yKTtcbiAgfVxufVxuIl19