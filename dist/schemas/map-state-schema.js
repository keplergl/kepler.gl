'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propertiesV1 = exports.propertiesV0 = undefined;

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

var mapStateSchema = (_mapStateSchema = {}, _mapStateSchema[_versions.VERSIONS.v0] = new _schema2.default({
  version: _versions.VERSIONS.v0,
  properties: propertiesV0,
  key: 'mapState'
}), _mapStateSchema[_versions.VERSIONS.v1] = new _schema2.default({
  version: _versions.VERSIONS.v1,
  properties: propertiesV1,
  key: 'mapState'
}), _mapStateSchema);

exports.default = mapStateSchema;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL21hcC1zdGF0ZS1zY2hlbWEuanMiXSwibmFtZXMiOlsicHJvcGVydGllc1YwIiwiYmVhcmluZyIsImRyYWdSb3RhdGUiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsInBpdGNoIiwiem9vbSIsInByb3BlcnRpZXNWMSIsImlzU3BsaXQiLCJtYXBTdGF0ZVNjaGVtYSIsInYwIiwidmVyc2lvbiIsInByb3BlcnRpZXMiLCJrZXkiLCJ2MSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFFQTtBQUNPLElBQU1BLHNDQUFlO0FBQzFCQyxXQUFTLElBRGlCO0FBRTFCQyxjQUFZLElBRmM7QUFHMUJDLFlBQVUsSUFIZ0I7QUFJMUJDLGFBQVcsSUFKZTtBQUsxQkMsU0FBTyxJQUxtQjtBQU0xQkMsUUFBTTtBQU5vQixDQUFyQjs7QUFTQSxJQUFNQyxpRUFDUlAsWUFEUTtBQUVYUSxXQUFTO0FBRkUsRUFBTjs7QUFLUCxJQUFNQyx3REFDSCxtQkFBU0MsRUFETixJQUNXLHFCQUFXO0FBQ3hCQyxXQUFTLG1CQUFTRCxFQURNO0FBRXhCRSxjQUFZWixZQUZZO0FBR3hCYSxPQUFLO0FBSG1CLENBQVgsQ0FEWCxrQkFNSCxtQkFBU0MsRUFOTixJQU1XLHFCQUFXO0FBQ3hCSCxXQUFTLG1CQUFTRyxFQURNO0FBRXhCRixjQUFZTCxZQUZZO0FBR3hCTSxPQUFLO0FBSG1CLENBQVgsQ0FOWCxrQkFBTjs7a0JBYWVKLGMiLCJmaWxlIjoibWFwLXN0YXRlLXNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VkVSU0lPTlN9IGZyb20gJy4vdmVyc2lvbnMnO1xuaW1wb3J0IFNjaGVtYSBmcm9tICcuL3NjaGVtYSc7XG5cbi8vIHZlcnNpb24gdjBcbmV4cG9ydCBjb25zdCBwcm9wZXJ0aWVzVjAgPSB7XG4gIGJlYXJpbmc6IG51bGwsXG4gIGRyYWdSb3RhdGU6IG51bGwsXG4gIGxhdGl0dWRlOiBudWxsLFxuICBsb25naXR1ZGU6IG51bGwsXG4gIHBpdGNoOiBudWxsLFxuICB6b29tOiBudWxsXG59O1xuXG5leHBvcnQgY29uc3QgcHJvcGVydGllc1YxID0ge1xuICAuLi5wcm9wZXJ0aWVzVjAsXG4gIGlzU3BsaXQ6IG51bGxcbn07XG5cbmNvbnN0IG1hcFN0YXRlU2NoZW1hID0ge1xuICBbVkVSU0lPTlMudjBdOiBuZXcgU2NoZW1hKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MCxcbiAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzVjAsXG4gICAga2V5OiAnbWFwU3RhdGUnXG4gIH0pLFxuICBbVkVSU0lPTlMudjFdOiBuZXcgU2NoZW1hKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzVjEsXG4gICAga2V5OiAnbWFwU3RhdGUnXG4gIH0pXG59O1xuXG5leHBvcnQgZGVmYXVsdCBtYXBTdGF0ZVNjaGVtYTtcbiJdfQ==