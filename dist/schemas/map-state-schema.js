'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propertiesV1 = exports.propertiesV0 = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _mapStateSchema;

var _versions = require('./versions');

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// version v0
var propertiesV0 = exports.propertiesV0 = {
  bearing: null,
  dragRotate: null,
  latitude: null,
  longitude: null,
  pitch: null,
  zoom: null
};

var propertiesV1 = exports.propertiesV1 = (0, _extends3.default)({}, propertiesV0, {
  isSplit: null
});

var mapStateSchema = (_mapStateSchema = {}, (0, _defineProperty3.default)(_mapStateSchema, _versions.VERSIONS.v0, new _schema2.default({
  version: _versions.VERSIONS.v0,
  properties: propertiesV0,
  key: 'mapState'
})), (0, _defineProperty3.default)(_mapStateSchema, _versions.VERSIONS.v1, new _schema2.default({
  version: _versions.VERSIONS.v1,
  properties: propertiesV1,
  key: 'mapState'
})), _mapStateSchema);

exports.default = mapStateSchema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL21hcC1zdGF0ZS1zY2hlbWEuanMiXSwibmFtZXMiOlsicHJvcGVydGllc1YwIiwiYmVhcmluZyIsImRyYWdSb3RhdGUiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsInBpdGNoIiwiem9vbSIsInByb3BlcnRpZXNWMSIsImlzU3BsaXQiLCJtYXBTdGF0ZVNjaGVtYSIsInYwIiwidmVyc2lvbiIsInByb3BlcnRpZXMiLCJrZXkiLCJ2MSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7O0FBRUE7QUFDTyxJQUFNQSxzQ0FBZTtBQUMxQkMsV0FBUyxJQURpQjtBQUUxQkMsY0FBWSxJQUZjO0FBRzFCQyxZQUFVLElBSGdCO0FBSTFCQyxhQUFXLElBSmU7QUFLMUJDLFNBQU8sSUFMbUI7QUFNMUJDLFFBQU07QUFOb0IsQ0FBckI7O0FBU0EsSUFBTUMsaUVBQ1JQLFlBRFE7QUFFWFEsV0FBUztBQUZFLEVBQU47O0FBS1AsSUFBTUMsdUZBQ0gsbUJBQVNDLEVBRE4sRUFDVyxxQkFBVztBQUN4QkMsV0FBUyxtQkFBU0QsRUFETTtBQUV4QkUsY0FBWVosWUFGWTtBQUd4QmEsT0FBSztBQUhtQixDQUFYLENBRFgsa0RBTUgsbUJBQVNDLEVBTk4sRUFNVyxxQkFBVztBQUN4QkgsV0FBUyxtQkFBU0csRUFETTtBQUV4QkYsY0FBWUwsWUFGWTtBQUd4Qk0sT0FBSztBQUhtQixDQUFYLENBTlgsbUJBQU47O2tCQWFlSixjIiwiZmlsZSI6Im1hcC1zdGF0ZS1zY2hlbWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1ZFUlNJT05TfSBmcm9tICcuL3ZlcnNpb25zJztcbmltcG9ydCBTY2hlbWEgZnJvbSAnLi9zY2hlbWEnO1xuXG4vLyB2ZXJzaW9uIHYwXG5leHBvcnQgY29uc3QgcHJvcGVydGllc1YwID0ge1xuICBiZWFyaW5nOiBudWxsLFxuICBkcmFnUm90YXRlOiBudWxsLFxuICBsYXRpdHVkZTogbnVsbCxcbiAgbG9uZ2l0dWRlOiBudWxsLFxuICBwaXRjaDogbnVsbCxcbiAgem9vbTogbnVsbFxufTtcblxuZXhwb3J0IGNvbnN0IHByb3BlcnRpZXNWMSA9IHtcbiAgLi4ucHJvcGVydGllc1YwLFxuICBpc1NwbGl0OiBudWxsXG59O1xuXG5jb25zdCBtYXBTdGF0ZVNjaGVtYSA9IHtcbiAgW1ZFUlNJT05TLnYwXTogbmV3IFNjaGVtYSh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjAsXG4gICAgcHJvcGVydGllczogcHJvcGVydGllc1YwLFxuICAgIGtleTogJ21hcFN0YXRlJ1xuICB9KSxcbiAgW1ZFUlNJT05TLnYxXTogbmV3IFNjaGVtYSh7XG4gICAgdmVyc2lvbjogVkVSU0lPTlMudjEsXG4gICAgcHJvcGVydGllczogcHJvcGVydGllc1YxLFxuICAgIGtleTogJ21hcFN0YXRlJ1xuICB9KVxufTtcblxuZXhwb3J0IGRlZmF1bHQgbWFwU3RhdGVTY2hlbWE7XG4iXX0=