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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL3NjaGVtYS5qcyJdLCJuYW1lcyI6WyJTY2hlbWEiLCJ2ZXJzaW9uIiwia2V5IiwicHJvcGVydGllcyIsImxvYWRQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYSIsIm5vZGUiLCJwYXJlbnQiLCJhY2N1bXVsYXRvciIsIl9nZXRQcm9wZXJ0eVZhbHVlRnJvbVNjaGVtYSIsInNhdmVQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYSIsIm9wZXJhdGlvbiIsImludGVybmFsIiwibG9hZGVkIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsImFjY3UiLCJfaXNDdXJyZW50VmVyc2lvbiIsIm91dGRhdGVkVmVyc2lvbkVycm9yIiwiZXJyb3IiLCJfc2F2ZSIsInNhdmUiLCJfbG9hZCIsImxvYWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBOzs7O0lBRXFCQSxNO0FBQ25CLG9CQUE2QztBQUFBLG1GQUFKLEVBQUk7QUFBQSxRQUFoQ0MsT0FBZ0MsUUFBaENBLE9BQWdDO0FBQUEsUUFBdkJDLEdBQXVCLFFBQXZCQSxHQUF1QjtBQUFBLFFBQWxCQyxVQUFrQixRQUFsQkEsVUFBa0I7O0FBQUE7O0FBQzNDLFNBQUtGLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUtFLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0QsR0FBTCxHQUFXQSxHQUFYO0FBQ0Q7O21CQUVERSwyQix3Q0FBNEJDLEksRUFBTUMsTSxFQUFRQyxXLEVBQWE7QUFDckQsV0FBTyxLQUFLQywyQkFBTCxDQUFpQyxNQUFqQyxFQUF5Q0gsSUFBekMsRUFBK0NDLE1BQS9DLEVBQXVEQyxXQUF2RCxDQUFQO0FBQ0QsRzs7bUJBRURFLDJCLHdDQUE0QkosSSxFQUFNQyxNLEVBQVFDLFcsRUFBYTtBQUNyRCxXQUFPLEtBQUtDLDJCQUFMLENBQWlDLE1BQWpDLEVBQXlDSCxJQUF6QyxFQUErQ0MsTUFBL0MsRUFBdURDLFdBQXZELENBQVA7QUFDRCxHOzttQkFFREMsMkIsd0NBQTRCRSxTLEVBQVdMLEksRUFBTUMsTSxFQUFRQyxXLEVBQWE7QUFBQTtBQUFBOztBQUNoRSxRQUFNSSxpQkFBZUQsU0FBckI7QUFDQSxRQUFNRSxnQ0FDSCxLQUFLVixHQURGLElBQ1EsS0FBS0MsVUFBTCxHQUNSVSxPQUFPQyxJQUFQLENBQVksS0FBS1gsVUFBakIsRUFBNkJZLE1BQTdCLENBQW9DLFVBQUNDLElBQUQsRUFBT2QsR0FBUCxFQUFlO0FBQUE7O0FBQ2pELHdDQUNLYyxJQURMLEVBRU1kLE9BQU9HLElBQVAsR0FDQSxNQUFLRixVQUFMLENBQWdCRCxHQUFoQixJQUNFO0FBQ0EsWUFBS0MsVUFBTCxDQUFnQkQsR0FBaEIsRUFBcUJRLFNBQXJCLElBQ0U7QUFDQSxZQUFLUCxVQUFMLENBQWdCRCxHQUFoQixFQUFxQlMsUUFBckIsRUFBK0JOLEtBQUtILEdBQUwsQ0FBL0IsRUFBMENHLElBQTFDLEVBQWdEVyxJQUFoRCxDQUZGLEdBR0UsRUFMSixzQkFNSWQsR0FOSixJQU1VRyxLQUFLSCxHQUFMLENBTlYsUUFEQSxHQVFBLEVBVk47QUFZRCxLQWJELEVBYUcsRUFiSCxDQURRLEdBZVJHLElBaEJBLFVBQU47O0FBbUJBLFdBQU9PLE1BQVA7QUFDRCxHOzttQkFFREssaUIsZ0NBQW9CO0FBQ2xCLFdBQU8sS0FBS2hCLE9BQUwsOEJBQVA7QUFDRCxHOzttQkFFRGlCLG9CLG1DQUF1QjtBQUNyQixRQUFJLENBQUMsS0FBS0QsaUJBQUwsRUFBTCxFQUErQjtBQUM3QixzQkFBUUUsS0FBUixDQUNLLEtBQUtqQixHQURWLFNBRUksS0FBS0QsT0FGVDtBQUtEO0FBQ0YsRzs7bUJBRURtQixLLG9CQUFlO0FBQ2I7QUFDQSxTQUFLRixvQkFBTDtBQUNBLFdBQU8sS0FBS0csSUFBTCx1QkFBUDtBQUNELEc7O21CQUVEQSxJLGlCQUFLaEIsSSxFQUFNQyxNLEVBQTBCO0FBQUEsUUFBbEJDLFdBQWtCLHVFQUFKLEVBQUk7O0FBQ25DLFdBQU8sS0FBS0UsMkJBQUwsQ0FBaUNKLElBQWpDLEVBQXVDQyxNQUF2QyxFQUErQ0MsV0FBL0MsQ0FBUDtBQUNELEc7O21CQUVEZSxLLG9CQUFlO0FBQ2IsV0FBTyxLQUFLQyxJQUFMLHVCQUFQO0FBQ0QsRzs7bUJBRURBLEksaUJBQUtsQixJLEVBQU1DLE0sRUFBMEI7QUFBQSxRQUFsQkMsV0FBa0IsdUVBQUosRUFBSTs7QUFDbkMsV0FBTyxLQUFLSCwyQkFBTCxDQUFpQ0MsSUFBakMsRUFBdUNDLE1BQXZDLEVBQStDQyxXQUEvQyxDQUFQO0FBQ0QsRzs7Ozs7a0JBckVrQlAsTSIsImZpbGUiOiJzY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5cbmltcG9ydCB7Q1VSUkVOVF9WRVJTSU9OfSBmcm9tICcuL3ZlcnNpb25zJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NoZW1hIHtcbiAgY29uc3RydWN0b3Ioe3ZlcnNpb24sIGtleSwgcHJvcGVydGllc30gPSB7fSkge1xuICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb247XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICB0aGlzLmtleSA9IGtleTtcbiAgfVxuXG4gIGxvYWRQcm9wZXJ0aWVzT3JBcHBseVNjaGVtYShub2RlLCBwYXJlbnQsIGFjY3VtdWxhdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFByb3BlcnR5VmFsdWVGcm9tU2NoZW1hKCdsb2FkJywgbm9kZSwgcGFyZW50LCBhY2N1bXVsYXRvcik7XG4gIH1cblxuICBzYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEobm9kZSwgcGFyZW50LCBhY2N1bXVsYXRvcikge1xuICAgIHJldHVybiB0aGlzLl9nZXRQcm9wZXJ0eVZhbHVlRnJvbVNjaGVtYSgnc2F2ZScsIG5vZGUsIHBhcmVudCwgYWNjdW11bGF0b3IpO1xuICB9XG5cbiAgX2dldFByb3BlcnR5VmFsdWVGcm9tU2NoZW1hKG9wZXJhdGlvbiwgbm9kZSwgcGFyZW50LCBhY2N1bXVsYXRvcikge1xuICAgIGNvbnN0IGludGVybmFsID0gYF8ke29wZXJhdGlvbn1gO1xuICAgIGNvbnN0IGxvYWRlZCA9IHtcbiAgICAgIFt0aGlzLmtleV06IHRoaXMucHJvcGVydGllc1xuICAgICAgICA/IE9iamVjdC5rZXlzKHRoaXMucHJvcGVydGllcykucmVkdWNlKChhY2N1LCBrZXkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgICAgIC4uLihrZXkgaW4gbm9kZVxuICAgICAgICAgICAgICAgID8gdGhpcy5wcm9wZXJ0aWVzW2tleV1cbiAgICAgICAgICAgICAgICAgID8gLy8gaWYgaXQncyBhbm90aGVyIHNjaGVtYVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXNba2V5XVtvcGVyYXRpb25dXG4gICAgICAgICAgICAgICAgICAgID8gLy8gY2FsbCBzYXZlIG9yIGxvYWRcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXNba2V5XVtpbnRlcm5hbF0obm9kZVtrZXldLCBub2RlLCBhY2N1KVxuICAgICAgICAgICAgICAgICAgICA6IHt9XG4gICAgICAgICAgICAgICAgICA6IHtba2V5XTogbm9kZVtrZXldfVxuICAgICAgICAgICAgICAgIDoge30pXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sIHt9KVxuICAgICAgICA6IG5vZGVcbiAgICB9O1xuXG4gICAgcmV0dXJuIGxvYWRlZDtcbiAgfVxuXG4gIF9pc0N1cnJlbnRWZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLnZlcnNpb24gPT09IENVUlJFTlRfVkVSU0lPTjtcbiAgfVxuXG4gIG91dGRhdGVkVmVyc2lvbkVycm9yKCkge1xuICAgIGlmICghdGhpcy5faXNDdXJyZW50VmVyc2lvbigpKSB7XG4gICAgICBDb25zb2xlLmVycm9yKFxuICAgICAgICBgJHt0aGlzLmtleX0gJHtcbiAgICAgICAgICB0aGlzLnZlcnNpb25cbiAgICAgICAgfSBpcyBvdXRkYXRlZC4gc2F2ZSBzaG91bGQgbm90IGJlIGNhbGxlZCBhbnltb3JlYFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBfc2F2ZSguLi5hcmdzKSB7XG4gICAgLy8gbWFrZSBzdXJlIG5vdGhpbmcgaXMgc2F2ZWQgdG8gYW4gb3V0ZGF0ZWQgdmVyc2lvblxuICAgIHRoaXMub3V0ZGF0ZWRWZXJzaW9uRXJyb3IoKTtcbiAgICByZXR1cm4gdGhpcy5zYXZlKC4uLmFyZ3MpO1xuICB9XG5cbiAgc2F2ZShub2RlLCBwYXJlbnQsIGFjY3VtdWxhdG9yID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5zYXZlUHJvcGVydGllc09yQXBwbHlTY2hlbWEobm9kZSwgcGFyZW50LCBhY2N1bXVsYXRvcik7XG4gIH1cblxuICBfbG9hZCguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMubG9hZCguLi5hcmdzKTtcbiAgfVxuXG4gIGxvYWQobm9kZSwgcGFyZW50LCBhY2N1bXVsYXRvciA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMubG9hZFByb3BlcnRpZXNPckFwcGx5U2NoZW1hKG5vZGUsIHBhcmVudCwgYWNjdW11bGF0b3IpO1xuICB9XG59XG4iXX0=