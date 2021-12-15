"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.propertiesV1 = exports.propertiesV0 = exports.customMapStylePropsV1 = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _versions = require("./versions");

var _schema = _interopRequireDefault(require("./schema"));

var _mapStyleSchema;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var customMapStylePropsV1 = {
  accessToken: null,
  custom: null,
  icon: null,
  id: null,
  label: null,
  url: null
};
exports.customMapStylePropsV1 = customMapStylePropsV1;
var CustomMapStyleSchema = new _schema["default"]({
  version: _versions.VERSIONS.v1,
  key: 'customStyle',
  properties: customMapStylePropsV1
});

var MapStyleSchemaV1 = /*#__PURE__*/function (_Schema) {
  (0, _inherits2["default"])(MapStyleSchemaV1, _Schema);

  var _super = _createSuper(MapStyleSchemaV1);

  function MapStyleSchemaV1() {
    var _this;

    (0, _classCallCheck2["default"])(this, MapStyleSchemaV1);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "version", _versions.VERSIONS.v1);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "key", 'mapStyles');
    return _this;
  }

  (0, _createClass2["default"])(MapStyleSchemaV1, [{
    key: "save",
    value: function save(mapStyles) {
      // save all custom styles
      var saveCustomStyle = Object.keys(mapStyles).reduce(function (accu, key) {
        return _objectSpread(_objectSpread({}, accu), mapStyles[key].custom ? (0, _defineProperty2["default"])({}, key, CustomMapStyleSchema.save(mapStyles[key]).customStyle) : {});
      }, {});
      return (0, _defineProperty2["default"])({}, this.key, saveCustomStyle);
    }
  }, {
    key: "load",
    value: function load(mapStyles) {
      // If mapStyle is an empty object, do not load it
      return (0, _typeof2["default"])(mapStyles) === 'object' && Object.keys(mapStyles).length ? (0, _defineProperty2["default"])({}, this.key, mapStyles) : {};
    }
  }]);
  return MapStyleSchemaV1;
}(_schema["default"]); // version v0


var propertiesV0 = {
  styleType: null,
  topLayerGroups: null,
  visibleLayerGroups: null,
  buildingLayer: null,
  mapStyles: new MapStyleSchemaV1()
};
exports.propertiesV0 = propertiesV0;
var propertiesV1 = {
  styleType: null,
  topLayerGroups: null,
  visibleLayerGroups: null,
  threeDBuildingColor: null,
  mapStyles: new MapStyleSchemaV1()
};
exports.propertiesV1 = propertiesV1;
var mapStyleSchema = (_mapStyleSchema = {}, (0, _defineProperty2["default"])(_mapStyleSchema, _versions.VERSIONS.v0, new _schema["default"]({
  version: _versions.VERSIONS.v0,
  properties: propertiesV0,
  key: 'mapStyle'
})), (0, _defineProperty2["default"])(_mapStyleSchema, _versions.VERSIONS.v1, new _schema["default"]({
  version: _versions.VERSIONS.v1,
  properties: propertiesV1,
  key: 'mapStyle'
})), _mapStyleSchema);
var _default = mapStyleSchema;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL21hcC1zdHlsZS1zY2hlbWEuanMiXSwibmFtZXMiOlsiY3VzdG9tTWFwU3R5bGVQcm9wc1YxIiwiYWNjZXNzVG9rZW4iLCJjdXN0b20iLCJpY29uIiwiaWQiLCJsYWJlbCIsInVybCIsIkN1c3RvbU1hcFN0eWxlU2NoZW1hIiwiU2NoZW1hIiwidmVyc2lvbiIsIlZFUlNJT05TIiwidjEiLCJrZXkiLCJwcm9wZXJ0aWVzIiwiTWFwU3R5bGVTY2hlbWFWMSIsIm1hcFN0eWxlcyIsInNhdmVDdXN0b21TdHlsZSIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhY2N1Iiwic2F2ZSIsImN1c3RvbVN0eWxlIiwibGVuZ3RoIiwicHJvcGVydGllc1YwIiwic3R5bGVUeXBlIiwidG9wTGF5ZXJHcm91cHMiLCJ2aXNpYmxlTGF5ZXJHcm91cHMiLCJidWlsZGluZ0xheWVyIiwicHJvcGVydGllc1YxIiwidGhyZWVEQnVpbGRpbmdDb2xvciIsIm1hcFN0eWxlU2NoZW1hIiwidjAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVPLElBQU1BLHFCQUFxQixHQUFHO0FBQ25DQyxFQUFBQSxXQUFXLEVBQUUsSUFEc0I7QUFFbkNDLEVBQUFBLE1BQU0sRUFBRSxJQUYyQjtBQUduQ0MsRUFBQUEsSUFBSSxFQUFFLElBSDZCO0FBSW5DQyxFQUFBQSxFQUFFLEVBQUUsSUFKK0I7QUFLbkNDLEVBQUFBLEtBQUssRUFBRSxJQUw0QjtBQU1uQ0MsRUFBQUEsR0FBRyxFQUFFO0FBTjhCLENBQTlCOztBQVNQLElBQU1DLG9CQUFvQixHQUFHLElBQUlDLGtCQUFKLENBQVc7QUFDdENDLEVBQUFBLE9BQU8sRUFBRUMsbUJBQVNDLEVBRG9CO0FBRXRDQyxFQUFBQSxHQUFHLEVBQUUsYUFGaUM7QUFHdENDLEVBQUFBLFVBQVUsRUFBRWI7QUFIMEIsQ0FBWCxDQUE3Qjs7SUFNTWMsZ0I7Ozs7Ozs7Ozs7Ozs7OztnR0FDTUosbUJBQVNDLEU7NEZBQ2IsVzs7Ozs7O1dBQ04sY0FBS0ksU0FBTCxFQUFnQjtBQUNkO0FBQ0EsVUFBTUMsZUFBZSxHQUFHQyxNQUFNLENBQUNDLElBQVAsQ0FBWUgsU0FBWixFQUF1QkksTUFBdkIsQ0FDdEIsVUFBQ0MsSUFBRCxFQUFPUixHQUFQO0FBQUEsK0NBQ0tRLElBREwsR0FFTUwsU0FBUyxDQUFDSCxHQUFELENBQVQsQ0FBZVYsTUFBZix3Q0FDRVUsR0FERixFQUNRTCxvQkFBb0IsQ0FBQ2MsSUFBckIsQ0FBMEJOLFNBQVMsQ0FBQ0gsR0FBRCxDQUFuQyxFQUEwQ1UsV0FEbEQsSUFFQSxFQUpOO0FBQUEsT0FEc0IsRUFPdEIsRUFQc0IsQ0FBeEI7QUFVQSxrREFBUyxLQUFLVixHQUFkLEVBQW9CSSxlQUFwQjtBQUNEOzs7V0FFRCxjQUFLRCxTQUFMLEVBQWdCO0FBQ2Q7QUFDQSxhQUFPLHlCQUFPQSxTQUFQLE1BQXFCLFFBQXJCLElBQWlDRSxNQUFNLENBQUNDLElBQVAsQ0FBWUgsU0FBWixFQUF1QlEsTUFBeEQsd0NBQ0QsS0FBS1gsR0FESixFQUNVRyxTQURWLElBRUgsRUFGSjtBQUdEOzs7RUF2QjRCUCxrQixHQTBCL0I7OztBQUNPLElBQU1nQixZQUFZLEdBQUc7QUFDMUJDLEVBQUFBLFNBQVMsRUFBRSxJQURlO0FBRTFCQyxFQUFBQSxjQUFjLEVBQUUsSUFGVTtBQUcxQkMsRUFBQUEsa0JBQWtCLEVBQUUsSUFITTtBQUkxQkMsRUFBQUEsYUFBYSxFQUFFLElBSlc7QUFLMUJiLEVBQUFBLFNBQVMsRUFBRSxJQUFJRCxnQkFBSjtBQUxlLENBQXJCOztBQVFBLElBQU1lLFlBQVksR0FBRztBQUMxQkosRUFBQUEsU0FBUyxFQUFFLElBRGU7QUFFMUJDLEVBQUFBLGNBQWMsRUFBRSxJQUZVO0FBRzFCQyxFQUFBQSxrQkFBa0IsRUFBRSxJQUhNO0FBSTFCRyxFQUFBQSxtQkFBbUIsRUFBRSxJQUpLO0FBSzFCZixFQUFBQSxTQUFTLEVBQUUsSUFBSUQsZ0JBQUo7QUFMZSxDQUFyQjs7QUFRUCxJQUFNaUIsY0FBYyw0RUFDakJyQixtQkFBU3NCLEVBRFEsRUFDSCxJQUFJeEIsa0JBQUosQ0FBVztBQUN4QkMsRUFBQUEsT0FBTyxFQUFFQyxtQkFBU3NCLEVBRE07QUFFeEJuQixFQUFBQSxVQUFVLEVBQUVXLFlBRlk7QUFHeEJaLEVBQUFBLEdBQUcsRUFBRTtBQUhtQixDQUFYLENBREcscURBTWpCRixtQkFBU0MsRUFOUSxFQU1ILElBQUlILGtCQUFKLENBQVc7QUFDeEJDLEVBQUFBLE9BQU8sRUFBRUMsbUJBQVNDLEVBRE07QUFFeEJFLEVBQUFBLFVBQVUsRUFBRWdCLFlBRlk7QUFHeEJqQixFQUFBQSxHQUFHLEVBQUU7QUFIbUIsQ0FBWCxDQU5HLG1CQUFwQjtlQWFlbUIsYyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7VkVSU0lPTlN9IGZyb20gJy4vdmVyc2lvbnMnO1xuaW1wb3J0IFNjaGVtYSBmcm9tICcuL3NjaGVtYSc7XG5cbmV4cG9ydCBjb25zdCBjdXN0b21NYXBTdHlsZVByb3BzVjEgPSB7XG4gIGFjY2Vzc1Rva2VuOiBudWxsLFxuICBjdXN0b206IG51bGwsXG4gIGljb246IG51bGwsXG4gIGlkOiBudWxsLFxuICBsYWJlbDogbnVsbCxcbiAgdXJsOiBudWxsXG59O1xuXG5jb25zdCBDdXN0b21NYXBTdHlsZVNjaGVtYSA9IG5ldyBTY2hlbWEoe1xuICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAga2V5OiAnY3VzdG9tU3R5bGUnLFxuICBwcm9wZXJ0aWVzOiBjdXN0b21NYXBTdHlsZVByb3BzVjFcbn0pO1xuXG5jbGFzcyBNYXBTdHlsZVNjaGVtYVYxIGV4dGVuZHMgU2NoZW1hIHtcbiAgdmVyc2lvbiA9IFZFUlNJT05TLnYxO1xuICBrZXkgPSAnbWFwU3R5bGVzJztcbiAgc2F2ZShtYXBTdHlsZXMpIHtcbiAgICAvLyBzYXZlIGFsbCBjdXN0b20gc3R5bGVzXG4gICAgY29uc3Qgc2F2ZUN1c3RvbVN0eWxlID0gT2JqZWN0LmtleXMobWFwU3R5bGVzKS5yZWR1Y2UoXG4gICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAuLi5hY2N1LFxuICAgICAgICAuLi4obWFwU3R5bGVzW2tleV0uY3VzdG9tXG4gICAgICAgICAgPyB7W2tleV06IEN1c3RvbU1hcFN0eWxlU2NoZW1hLnNhdmUobWFwU3R5bGVzW2tleV0pLmN1c3RvbVN0eWxlfVxuICAgICAgICAgIDoge30pXG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcblxuICAgIHJldHVybiB7W3RoaXMua2V5XTogc2F2ZUN1c3RvbVN0eWxlfTtcbiAgfVxuXG4gIGxvYWQobWFwU3R5bGVzKSB7XG4gICAgLy8gSWYgbWFwU3R5bGUgaXMgYW4gZW1wdHkgb2JqZWN0LCBkbyBub3QgbG9hZCBpdFxuICAgIHJldHVybiB0eXBlb2YgbWFwU3R5bGVzID09PSAnb2JqZWN0JyAmJiBPYmplY3Qua2V5cyhtYXBTdHlsZXMpLmxlbmd0aFxuICAgICAgPyB7W3RoaXMua2V5XTogbWFwU3R5bGVzfVxuICAgICAgOiB7fTtcbiAgfVxufVxuXG4vLyB2ZXJzaW9uIHYwXG5leHBvcnQgY29uc3QgcHJvcGVydGllc1YwID0ge1xuICBzdHlsZVR5cGU6IG51bGwsXG4gIHRvcExheWVyR3JvdXBzOiBudWxsLFxuICB2aXNpYmxlTGF5ZXJHcm91cHM6IG51bGwsXG4gIGJ1aWxkaW5nTGF5ZXI6IG51bGwsXG4gIG1hcFN0eWxlczogbmV3IE1hcFN0eWxlU2NoZW1hVjEoKVxufTtcblxuZXhwb3J0IGNvbnN0IHByb3BlcnRpZXNWMSA9IHtcbiAgc3R5bGVUeXBlOiBudWxsLFxuICB0b3BMYXllckdyb3VwczogbnVsbCxcbiAgdmlzaWJsZUxheWVyR3JvdXBzOiBudWxsLFxuICB0aHJlZURCdWlsZGluZ0NvbG9yOiBudWxsLFxuICBtYXBTdHlsZXM6IG5ldyBNYXBTdHlsZVNjaGVtYVYxKClcbn07XG5cbmNvbnN0IG1hcFN0eWxlU2NoZW1hID0ge1xuICBbVkVSU0lPTlMudjBdOiBuZXcgU2NoZW1hKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MCxcbiAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzVjAsXG4gICAga2V5OiAnbWFwU3R5bGUnXG4gIH0pLFxuICBbVkVSU0lPTlMudjFdOiBuZXcgU2NoZW1hKHtcbiAgICB2ZXJzaW9uOiBWRVJTSU9OUy52MSxcbiAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzVjEsXG4gICAga2V5OiAnbWFwU3R5bGUnXG4gIH0pXG59O1xuXG5leHBvcnQgZGVmYXVsdCBtYXBTdHlsZVNjaGVtYTtcbiJdfQ==