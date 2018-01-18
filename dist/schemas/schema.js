'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

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

  Schema.prototype.loadPropertiesOrApplySchema = function loadPropertiesOrApplySchema(node, parent, accumulator) {
    return this._getPropertyValueFromSchema('load', node, parent, accumulator);
  };

  Schema.prototype.savePropertiesOrApplySchema = function savePropertiesOrApplySchema(node, parent, accumulator) {
    return this._getPropertyValueFromSchema('save', node, parent, accumulator);
  };

  Schema.prototype._getPropertyValueFromSchema = function _getPropertyValueFromSchema(operation, node, parent, accumulator) {
    var _this = this,
        _loaded;

    var internal = '_' + operation;
    var loaded = (_loaded = {}, _loaded[this.key] = this.properties ? Object.keys(this.properties).reduce(function (accu, key) {
      var _ref2;

      return (0, _extends3.default)({}, accu, key in node ? _this.properties[key] ? // if it's another schema
      _this.properties[key][operation] ? // call save or load
      _this.properties[key][internal](node[key], node, accu) : {} : (_ref2 = {}, _ref2[key] = node[key], _ref2) : {});
    }, {}) : node, _loaded);

    return loaded;
  };

  Schema.prototype._isCurrentVersion = function _isCurrentVersion() {
    return this.version === _versions.CURRENT_VERSION;
  };

  Schema.prototype.outdatedVersionError = function outdatedVersionError() {
    if (!this._isCurrentVersion()) {
      _window.console.error(this.key + ' ' + this.version + ' is outdated. save should not be called anymore');
    }
  };

  Schema.prototype._save = function _save() {
    // make sure nothing is saved to an outdated version
    this.outdatedVersionError();
    return this.save.apply(this, arguments);
  };

  Schema.prototype.save = function save(node, parent) {
    var accumulator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return this.savePropertiesOrApplySchema(node, parent, accumulator);
  };

  Schema.prototype._load = function _load() {
    return this.load.apply(this, arguments);
  };

  Schema.prototype.load = function load(node, parent) {
    var accumulator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return this.loadPropertiesOrApplySchema(node, parent, accumulator);
  };

  return Schema;
}();

exports.default = Schema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL3NjaGVtYS5qcyJdLCJuYW1lcyI6WyJTY2hlbWEiLCJ2ZXJzaW9uIiwia2V5IiwicHJvcGVydGllcyIsImxvYWRQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYSIsIm5vZGUiLCJwYXJlbnQiLCJhY2N1bXVsYXRvciIsIl9nZXRQcm9wZXJ0eVZhbHVlRnJvbVNjaGVtYSIsInNhdmVQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYSIsIm9wZXJhdGlvbiIsImludGVybmFsIiwibG9hZGVkIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsImFjY3UiLCJfaXNDdXJyZW50VmVyc2lvbiIsIm91dGRhdGVkVmVyc2lvbkVycm9yIiwiZXJyb3IiLCJfc2F2ZSIsInNhdmUiLCJfbG9hZCIsImxvYWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBOzs7O0lBRXFCQSxNO0FBQ25CLG9CQUE2QztBQUFBLG1GQUFKLEVBQUk7QUFBQSxRQUFoQ0MsT0FBZ0MsUUFBaENBLE9BQWdDO0FBQUEsUUFBdkJDLEdBQXVCLFFBQXZCQSxHQUF1QjtBQUFBLFFBQWxCQyxVQUFrQixRQUFsQkEsVUFBa0I7O0FBQUE7O0FBQzNDLFNBQUtGLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUtFLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0QsR0FBTCxHQUFXQSxHQUFYO0FBQ0Q7O21CQUVERSwyQix3Q0FBNEJDLEksRUFBTUMsTSxFQUFRQyxXLEVBQWE7QUFDckQsV0FBTyxLQUFLQywyQkFBTCxDQUFpQyxNQUFqQyxFQUF5Q0gsSUFBekMsRUFBK0NDLE1BQS9DLEVBQXVEQyxXQUF2RCxDQUFQO0FBQ0QsRzs7bUJBRURFLDJCLHdDQUE0QkosSSxFQUFNQyxNLEVBQVFDLFcsRUFBYTtBQUNyRCxXQUFPLEtBQUtDLDJCQUFMLENBQWlDLE1BQWpDLEVBQXlDSCxJQUF6QyxFQUErQ0MsTUFBL0MsRUFBdURDLFdBQXZELENBQVA7QUFDRCxHOzttQkFFREMsMkIsd0NBQTRCRSxTLEVBQVdMLEksRUFBTUMsTSxFQUFRQyxXLEVBQWE7QUFBQTtBQUFBOztBQUNoRSxRQUFNSSxpQkFBZUQsU0FBckI7QUFDQSxRQUFNRSxnQ0FDSCxLQUFLVixHQURGLElBRUYsS0FBS0MsVUFBTCxHQUFrQlUsT0FBT0MsSUFBUCxDQUFZLEtBQUtYLFVBQWpCLEVBQTZCWSxNQUE3QixDQUNoQixVQUFDQyxJQUFELEVBQU9kLEdBQVAsRUFBZTtBQUFBOztBQUNiLHdDQUNLYyxJQURMLEVBRU1kLE9BQU9HLElBQVAsR0FDQSxNQUFLRixVQUFMLENBQWdCRCxHQUFoQixJQUNFO0FBQ0YsWUFBS0MsVUFBTCxDQUFnQkQsR0FBaEIsRUFBcUJRLFNBQXJCLElBQ0k7QUFDRixZQUFLUCxVQUFMLENBQWdCRCxHQUFoQixFQUFxQlMsUUFBckIsRUFBK0JOLEtBQUtILEdBQUwsQ0FBL0IsRUFBMENHLElBQTFDLEVBQWdEVyxJQUFoRCxDQUZGLEdBSUUsRUFORixzQkFPSWQsR0FQSixJQU9VRyxLQUFLSCxHQUFMLENBUFYsUUFEQSxHQVNBLEVBWE47QUFhRCxLQWZlLEVBZ0JoQixFQWhCZ0IsQ0FBbEIsR0FpQkVHLElBbkJBLFVBQU47O0FBc0JBLFdBQU9PLE1BQVA7QUFDRCxHOzttQkFFREssaUIsZ0NBQW9CO0FBQ2xCLFdBQU8sS0FBS2hCLE9BQUwsOEJBQVA7QUFDRCxHOzttQkFFRGlCLG9CLG1DQUF1QjtBQUNyQixRQUFJLENBQUMsS0FBS0QsaUJBQUwsRUFBTCxFQUErQjtBQUM3QixzQkFBUUUsS0FBUixDQUFpQixLQUFLakIsR0FBdEIsU0FBNkIsS0FBS0QsT0FBbEM7QUFDRDtBQUNGLEc7O21CQUVEbUIsSyxvQkFBZTtBQUNiO0FBQ0EsU0FBS0Ysb0JBQUw7QUFDQSxXQUFPLEtBQUtHLElBQUwsdUJBQVA7QUFDRCxHOzttQkFFREEsSSxpQkFBS2hCLEksRUFBTUMsTSxFQUEwQjtBQUFBLFFBQWxCQyxXQUFrQix1RUFBSixFQUFJOztBQUNuQyxXQUFPLEtBQUtFLDJCQUFMLENBQWlDSixJQUFqQyxFQUF1Q0MsTUFBdkMsRUFBK0NDLFdBQS9DLENBQVA7QUFDRCxHOzttQkFFRGUsSyxvQkFBZTtBQUNiLFdBQU8sS0FBS0MsSUFBTCx1QkFBUDtBQUNELEc7O21CQUVEQSxJLGlCQUFLbEIsSSxFQUFNQyxNLEVBQTBCO0FBQUEsUUFBbEJDLFdBQWtCLHVFQUFKLEVBQUk7O0FBQ25DLFdBQU8sS0FBS0gsMkJBQUwsQ0FBaUNDLElBQWpDLEVBQXVDQyxNQUF2QyxFQUErQ0MsV0FBL0MsQ0FBUDtBQUNELEc7Ozs7O2tCQXBFa0JQLE0iLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5pbXBvcnQge0NVUlJFTlRfVkVSU0lPTn0gZnJvbSAnLi92ZXJzaW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKHt2ZXJzaW9uLCBrZXksIHByb3BlcnRpZXN9ID0ge30pIHtcbiAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgdGhpcy5rZXkgPSBrZXk7XG4gIH1cblxuICBsb2FkUHJvcGVydGllc09yQXBwbHlTY2hlbWEobm9kZSwgcGFyZW50LCBhY2N1bXVsYXRvcikge1xuICAgIHJldHVybiB0aGlzLl9nZXRQcm9wZXJ0eVZhbHVlRnJvbVNjaGVtYSgnbG9hZCcsIG5vZGUsIHBhcmVudCwgYWNjdW11bGF0b3IpO1xuICB9XG5cbiAgc2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hKG5vZGUsIHBhcmVudCwgYWNjdW11bGF0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0UHJvcGVydHlWYWx1ZUZyb21TY2hlbWEoJ3NhdmUnLCBub2RlLCBwYXJlbnQsIGFjY3VtdWxhdG9yKTtcbiAgfVxuXG4gIF9nZXRQcm9wZXJ0eVZhbHVlRnJvbVNjaGVtYShvcGVyYXRpb24sIG5vZGUsIHBhcmVudCwgYWNjdW11bGF0b3IpIHtcbiAgICBjb25zdCBpbnRlcm5hbCA9IGBfJHtvcGVyYXRpb259YDtcbiAgICBjb25zdCBsb2FkZWQgPSB7XG4gICAgICBbdGhpcy5rZXldOlxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPyBPYmplY3Qua2V5cyh0aGlzLnByb3BlcnRpZXMpLnJlZHVjZShcbiAgICAgICAgICAoYWNjdSwga2V5KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgICAuLi4oa2V5IGluIG5vZGVcbiAgICAgICAgICAgICAgICA/IHRoaXMucHJvcGVydGllc1trZXldXG4gICAgICAgICAgICAgICAgICA/IC8vIGlmIGl0J3MgYW5vdGhlciBzY2hlbWFcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllc1trZXldW29wZXJhdGlvbl1cbiAgICAgICAgICAgICAgICAgICAgPyAvLyBjYWxsIHNhdmUgb3IgbG9hZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXNba2V5XVtpbnRlcm5hbF0obm9kZVtrZXldLCBub2RlLCBhY2N1KVxuICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgIHt9XG4gICAgICAgICAgICAgICAgICA6IHtba2V5XTogbm9kZVtrZXldfVxuICAgICAgICAgICAgICAgIDoge30pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7fVxuICAgICAgKSA6IG5vZGVcbiAgICB9O1xuXG4gICAgcmV0dXJuIGxvYWRlZDtcbiAgfVxuXG4gIF9pc0N1cnJlbnRWZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLnZlcnNpb24gPT09IENVUlJFTlRfVkVSU0lPTjtcbiAgfVxuXG4gIG91dGRhdGVkVmVyc2lvbkVycm9yKCkge1xuICAgIGlmICghdGhpcy5faXNDdXJyZW50VmVyc2lvbigpKSB7XG4gICAgICBDb25zb2xlLmVycm9yKGAke3RoaXMua2V5fSAke3RoaXMudmVyc2lvbn0gaXMgb3V0ZGF0ZWQuIHNhdmUgc2hvdWxkIG5vdCBiZSBjYWxsZWQgYW55bW9yZWApXG4gICAgfVxuICB9XG5cbiAgX3NhdmUoLi4uYXJncykge1xuICAgIC8vIG1ha2Ugc3VyZSBub3RoaW5nIGlzIHNhdmVkIHRvIGFuIG91dGRhdGVkIHZlcnNpb25cbiAgICB0aGlzLm91dGRhdGVkVmVyc2lvbkVycm9yKCk7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZSguLi5hcmdzKTtcbiAgfVxuXG4gIHNhdmUobm9kZSwgcGFyZW50LCBhY2N1bXVsYXRvciA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMuc2F2ZVByb3BlcnRpZXNPckFwcGx5U2NoZW1hKG5vZGUsIHBhcmVudCwgYWNjdW11bGF0b3IpO1xuICB9XG5cbiAgX2xvYWQoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLmxvYWQoLi4uYXJncyk7XG4gIH1cblxuICBsb2FkKG5vZGUsIHBhcmVudCwgYWNjdW11bGF0b3IgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmxvYWRQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShub2RlLCBwYXJlbnQsIGFjY3VtdWxhdG9yKTtcbiAgfVxufVxuIl19