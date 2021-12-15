"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = GeocoderPanelFactory;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _processors = _interopRequireDefault(require("../processors"));

var _core = require("@deck.gl/core");

var _schemas = _interopRequireDefault(require("../schemas"));

var _projectionUtils = require("../utils/projection-utils");

var _geocoder = _interopRequireDefault(require("./geocoder/geocoder"));

var _defaultSettings = require("../constants/default-settings");

var _templateObject;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ICON_LAYER = {
  id: _defaultSettings.GEOCODER_LAYER_ID,
  type: 'icon',
  config: {
    label: 'Geocoder Layer',
    color: _defaultSettings.GEOCODER_ICON_COLOR,
    dataId: _defaultSettings.GEOCODER_DATASET_NAME,
    columns: {
      lat: 'lt',
      lng: 'ln',
      icon: 'icon',
      label: 'text'
    },
    isVisible: true,
    hidden: true,
    visConfig: {
      radius: _defaultSettings.GEOCODER_ICON_SIZE
    }
  }
};

var PARSED_CONFIG = _schemas["default"].parseSavedConfig({
  version: 'v1',
  config: {
    visState: {
      layers: [ICON_LAYER]
    }
  }
});

var StyledGeocoderPanel = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n  top: ", "px;\n  right: ", "px;\n  width: ", "px;\n  box-shadow: ", ";\n  z-index: 100;\n"])), function (props) {
  return props.theme.geocoderTop;
}, function (props) {
  return props.theme.geocoderRight;
}, function (props) {
  return Number.isFinite(props.width) ? props.width : props.theme.geocoderWidth;
}, function (props) {
  return props.theme.boxShadow;
});

function generateGeocoderDataset(lat, lon, text) {
  return {
    data: _processors["default"].processRowObject([{
      lt: lat,
      ln: lon,
      icon: 'place',
      text: text
    }]),
    id: _defaultSettings.GEOCODER_DATASET_NAME,
    info: {
      hidden: true,
      id: _defaultSettings.GEOCODER_DATASET_NAME,
      label: _defaultSettings.GEOCODER_DATASET_NAME
    }
  };
}

function isValid(key) {
  return /pk\..*\..*/.test(key);
}

function GeocoderPanelFactory() {
  var GeocoderPanel = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(GeocoderPanel, _Component);

    var _super = _createSuper(GeocoderPanel);

    function GeocoderPanel() {
      var _this;

      (0, _classCallCheck2["default"])(this, GeocoderPanel);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onSelected", function () {
        var viewport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var geoItem = arguments.length > 1 ? arguments[1] : undefined;

        var _geoItem$center = (0, _slicedToArray2["default"])(geoItem.center, 2),
            lon = _geoItem$center[0],
            lat = _geoItem$center[1],
            text = geoItem.text,
            bbox = geoItem.bbox;

        _this.removeGeocoderDataset();

        _this.props.updateVisData([generateGeocoderDataset(lat, lon, text)], {
          keepExistingConfig: true
        }, PARSED_CONFIG);

        var bounds = bbox || [lon - _defaultSettings.GEOCODER_GEO_OFFSET, lat - _defaultSettings.GEOCODER_GEO_OFFSET, lon + _defaultSettings.GEOCODER_GEO_OFFSET, lat + _defaultSettings.GEOCODER_GEO_OFFSET];
        var centerAndZoom = (0, _projectionUtils.getCenterAndZoomFromBounds)(bounds, {
          width: _this.props.mapState.width,
          height: _this.props.mapState.height
        });

        if (!centerAndZoom) {
          // failed to fit bounds
          return;
        }

        _this.props.updateMap(_objectSpread(_objectSpread({
          latitude: centerAndZoom.center[1],
          longitude: centerAndZoom.center[0]
        }, Number.isFinite(centerAndZoom.zoom) ? {
          zoom: centerAndZoom.zoom
        } : {}), {}, {
          pitch: 0,
          bearing: 0,
          transitionDuration: _this.props.transitionDuration,
          transitionInterpolator: new _core.FlyToInterpolator()
        }));
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "removeMarker", function () {
        _this.removeGeocoderDataset();
      });
      return _this;
    }

    (0, _createClass2["default"])(GeocoderPanel, [{
      key: "removeGeocoderDataset",
      value: function removeGeocoderDataset() {
        this.props.removeDataset(_defaultSettings.GEOCODER_DATASET_NAME);
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            isGeocoderEnabled = _this$props.isGeocoderEnabled,
            mapboxApiAccessToken = _this$props.mapboxApiAccessToken,
            width = _this$props.width;
        return /*#__PURE__*/_react["default"].createElement(StyledGeocoderPanel, {
          className: "geocoder-panel",
          width: width,
          style: {
            display: isGeocoderEnabled ? 'block' : 'none'
          }
        }, isValid(mapboxApiAccessToken) && /*#__PURE__*/_react["default"].createElement(_geocoder["default"], {
          mapboxApiAccessToken: mapboxApiAccessToken,
          onSelected: this.onSelected,
          onDeleteMarker: this.removeMarker,
          width: width
        }));
      }
    }]);
    return GeocoderPanel;
  }(_react.Component);

  (0, _defineProperty2["default"])(GeocoderPanel, "propTypes", {
    isGeocoderEnabled: _propTypes["default"].bool.isRequired,
    mapboxApiAccessToken: _propTypes["default"].string.isRequired,
    mapState: _propTypes["default"].object.isRequired,
    updateVisData: _propTypes["default"].func.isRequired,
    removeDataset: _propTypes["default"].func.isRequired,
    updateMap: _propTypes["default"].func.isRequired,
    transitionDuration: _propTypes["default"].number,
    width: _propTypes["default"].number
  });
  GeocoderPanel.defaultProps = {
    transitionDuration: 3000
  };
  return GeocoderPanel;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2dlb2NvZGVyLXBhbmVsLmpzIl0sIm5hbWVzIjpbIklDT05fTEFZRVIiLCJpZCIsIkdFT0NPREVSX0xBWUVSX0lEIiwidHlwZSIsImNvbmZpZyIsImxhYmVsIiwiY29sb3IiLCJHRU9DT0RFUl9JQ09OX0NPTE9SIiwiZGF0YUlkIiwiR0VPQ09ERVJfREFUQVNFVF9OQU1FIiwiY29sdW1ucyIsImxhdCIsImxuZyIsImljb24iLCJpc1Zpc2libGUiLCJoaWRkZW4iLCJ2aXNDb25maWciLCJyYWRpdXMiLCJHRU9DT0RFUl9JQ09OX1NJWkUiLCJQQVJTRURfQ09ORklHIiwiS2VwbGVyR2xTY2hlbWEiLCJwYXJzZVNhdmVkQ29uZmlnIiwidmVyc2lvbiIsInZpc1N0YXRlIiwibGF5ZXJzIiwiU3R5bGVkR2VvY29kZXJQYW5lbCIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJnZW9jb2RlclRvcCIsImdlb2NvZGVyUmlnaHQiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsIndpZHRoIiwiZ2VvY29kZXJXaWR0aCIsImJveFNoYWRvdyIsImdlbmVyYXRlR2VvY29kZXJEYXRhc2V0IiwibG9uIiwidGV4dCIsImRhdGEiLCJQcm9jZXNzb3JzIiwicHJvY2Vzc1Jvd09iamVjdCIsImx0IiwibG4iLCJpbmZvIiwiaXNWYWxpZCIsImtleSIsInRlc3QiLCJHZW9jb2RlclBhbmVsRmFjdG9yeSIsIkdlb2NvZGVyUGFuZWwiLCJ2aWV3cG9ydCIsImdlb0l0ZW0iLCJjZW50ZXIiLCJiYm94IiwicmVtb3ZlR2VvY29kZXJEYXRhc2V0IiwidXBkYXRlVmlzRGF0YSIsImtlZXBFeGlzdGluZ0NvbmZpZyIsImJvdW5kcyIsIkdFT0NPREVSX0dFT19PRkZTRVQiLCJjZW50ZXJBbmRab29tIiwibWFwU3RhdGUiLCJoZWlnaHQiLCJ1cGRhdGVNYXAiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsInpvb20iLCJwaXRjaCIsImJlYXJpbmciLCJ0cmFuc2l0aW9uRHVyYXRpb24iLCJ0cmFuc2l0aW9uSW50ZXJwb2xhdG9yIiwiRmx5VG9JbnRlcnBvbGF0b3IiLCJyZW1vdmVEYXRhc2V0IiwiaXNHZW9jb2RlckVuYWJsZWQiLCJtYXBib3hBcGlBY2Nlc3NUb2tlbiIsImRpc3BsYXkiLCJvblNlbGVjdGVkIiwicmVtb3ZlTWFya2VyIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiYm9vbCIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJvYmplY3QiLCJmdW5jIiwibnVtYmVyIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBUUEsSUFBTUEsVUFBVSxHQUFHO0FBQ2pCQyxFQUFBQSxFQUFFLEVBQUVDLGtDQURhO0FBRWpCQyxFQUFBQSxJQUFJLEVBQUUsTUFGVztBQUdqQkMsRUFBQUEsTUFBTSxFQUFFO0FBQ05DLElBQUFBLEtBQUssRUFBRSxnQkFERDtBQUVOQyxJQUFBQSxLQUFLLEVBQUVDLG9DQUZEO0FBR05DLElBQUFBLE1BQU0sRUFBRUMsc0NBSEY7QUFJTkMsSUFBQUEsT0FBTyxFQUFFO0FBQ1BDLE1BQUFBLEdBQUcsRUFBRSxJQURFO0FBRVBDLE1BQUFBLEdBQUcsRUFBRSxJQUZFO0FBR1BDLE1BQUFBLElBQUksRUFBRSxNQUhDO0FBSVBSLE1BQUFBLEtBQUssRUFBRTtBQUpBLEtBSkg7QUFVTlMsSUFBQUEsU0FBUyxFQUFFLElBVkw7QUFXTkMsSUFBQUEsTUFBTSxFQUFFLElBWEY7QUFZTkMsSUFBQUEsU0FBUyxFQUFFO0FBQ1RDLE1BQUFBLE1BQU0sRUFBRUM7QUFEQztBQVpMO0FBSFMsQ0FBbkI7O0FBcUJBLElBQU1DLGFBQWEsR0FBR0Msb0JBQWVDLGdCQUFmLENBQWdDO0FBQ3BEQyxFQUFBQSxPQUFPLEVBQUUsSUFEMkM7QUFFcERsQixFQUFBQSxNQUFNLEVBQUU7QUFD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Q0UsVUFBQSxvQkFBb0IsRUFBRUEsb0JBRHhCO0FBRUUsVUFBQSxVQUFVLEVBQUUsS0FBS0UsVUFGbkI7QUFHRSxVQUFBLGNBQWMsRUFBRSxLQUFLQyxZQUh2QjtBQUlFLFVBQUEsS0FBSyxFQUFFM0M7QUFKVCxVQU5KLENBREY7QUFnQkQ7QUFuRjBDO0FBQUE7QUFBQSxJQUNqQjRDLGdCQURpQjs7QUFBQSxtQ0FDdkM1QixhQUR1QyxlQUV4QjtBQUNqQnVCLElBQUFBLGlCQUFpQixFQUFFTSxzQkFBVUMsSUFBVixDQUFlQyxVQURqQjtBQUVqQlAsSUFBQUEsb0JBQW9CLEVBQUVLLHNCQUFVRyxNQUFWLENBQWlCRCxVQUZ0QjtBQUdqQnBCLElBQUFBLFFBQVEsRUFBRWtCLHNCQUFVSSxNQUFWLENBQWlCRixVQUhWO0FBSWpCekIsSUFBQUEsYUFBYSxFQUFFdUIsc0JBQVVLLElBQVYsQ0FBZUgsVUFKYjtBQUtqQlQsSUFBQUEsYUFBYSxFQUFFTyxzQkFBVUssSUFBVixDQUFlSCxVQUxiO0FBTWpCbEIsSUFBQUEsU0FBUyxFQUFFZ0Isc0JBQVVLLElBQVYsQ0FBZUgsVUFOVDtBQVFqQlosSUFBQUEsa0JBQWtCLEVBQUVVLHNCQUFVTSxNQVJiO0FBU2pCbkQsSUFBQUEsS0FBSyxFQUFFNkMsc0JBQVVNO0FBVEEsR0FGd0I7QUFzRjdDbkMsRUFBQUEsYUFBYSxDQUFDb0MsWUFBZCxHQUE2QjtBQUMzQmpCLElBQUFBLGtCQUFrQixFQUFFO0FBRE8sR0FBN0I7QUFJQSxTQUFPbkIsYUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUHJvY2Vzc29ycyBmcm9tICdwcm9jZXNzb3JzJztcbmltcG9ydCB7Rmx5VG9JbnRlcnBvbGF0b3J9IGZyb20gJ0BkZWNrLmdsL2NvcmUnO1xuaW1wb3J0IEtlcGxlckdsU2NoZW1hIGZyb20gJ3NjaGVtYXMnO1xuaW1wb3J0IHtnZXRDZW50ZXJBbmRab29tRnJvbUJvdW5kc30gZnJvbSAndXRpbHMvcHJvamVjdGlvbi11dGlscyc7XG5cbmltcG9ydCBHZW9jb2RlciBmcm9tICcuL2dlb2NvZGVyL2dlb2NvZGVyJztcbmltcG9ydCB7XG4gIEdFT0NPREVSX0RBVEFTRVRfTkFNRSxcbiAgR0VPQ09ERVJfTEFZRVJfSUQsXG4gIEdFT0NPREVSX0dFT19PRkZTRVQsXG4gIEdFT0NPREVSX0lDT05fQ09MT1IsXG4gIEdFT0NPREVSX0lDT05fU0laRVxufSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IElDT05fTEFZRVIgPSB7XG4gIGlkOiBHRU9DT0RFUl9MQVlFUl9JRCxcbiAgdHlwZTogJ2ljb24nLFxuICBjb25maWc6IHtcbiAgICBsYWJlbDogJ0dlb2NvZGVyIExheWVyJyxcbiAgICBjb2xvcjogR0VPQ09ERVJfSUNPTl9DT0xPUixcbiAgICBkYXRhSWQ6IEdFT0NPREVSX0RBVEFTRVRfTkFNRSxcbiAgICBjb2x1bW5zOiB7XG4gICAgICBsYXQ6ICdsdCcsXG4gICAgICBsbmc6ICdsbicsXG4gICAgICBpY29uOiAnaWNvbicsXG4gICAgICBsYWJlbDogJ3RleHQnXG4gICAgfSxcbiAgICBpc1Zpc2libGU6IHRydWUsXG4gICAgaGlkZGVuOiB0cnVlLFxuICAgIHZpc0NvbmZpZzoge1xuICAgICAgcmFkaXVzOiBHRU9DT0RFUl9JQ09OX1NJWkVcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IFBBUlNFRF9DT05GSUcgPSBLZXBsZXJHbFNjaGVtYS5wYXJzZVNhdmVkQ29uZmlnKHtcbiAgdmVyc2lvbjogJ3YxJyxcbiAgY29uZmlnOiB7XG4gICAgdmlzU3RhdGU6IHtcbiAgICAgIGxheWVyczogW0lDT05fTEFZRVJdXG4gICAgfVxuICB9XG59KTtcblxuY29uc3QgU3R5bGVkR2VvY29kZXJQYW5lbCA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmdlb2NvZGVyVG9wfXB4O1xuICByaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5nZW9jb2RlclJpZ2h0fXB4O1xuICB3aWR0aDogJHtwcm9wcyA9PiAoTnVtYmVyLmlzRmluaXRlKHByb3BzLndpZHRoKSA/IHByb3BzLndpZHRoIDogcHJvcHMudGhlbWUuZ2VvY29kZXJXaWR0aCl9cHg7XG4gIGJveC1zaGFkb3c6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuYm94U2hhZG93fTtcbiAgei1pbmRleDogMTAwO1xuYDtcblxuZnVuY3Rpb24gZ2VuZXJhdGVHZW9jb2RlckRhdGFzZXQobGF0LCBsb24sIHRleHQpIHtcbiAgcmV0dXJuIHtcbiAgICBkYXRhOiBQcm9jZXNzb3JzLnByb2Nlc3NSb3dPYmplY3QoW1xuICAgICAge1xuICAgICAgICBsdDogbGF0LFxuICAgICAgICBsbjogbG9uLFxuICAgICAgICBpY29uOiAncGxhY2UnLFxuICAgICAgICB0ZXh0XG4gICAgICB9XG4gICAgXSksXG4gICAgaWQ6IEdFT0NPREVSX0RBVEFTRVRfTkFNRSxcbiAgICBpbmZvOiB7XG4gICAgICBoaWRkZW46IHRydWUsXG4gICAgICBpZDogR0VPQ09ERVJfREFUQVNFVF9OQU1FLFxuICAgICAgbGFiZWw6IEdFT0NPREVSX0RBVEFTRVRfTkFNRVxuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZChrZXkpIHtcbiAgcmV0dXJuIC9wa1xcLi4qXFwuLiovLnRlc3Qoa2V5KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2VvY29kZXJQYW5lbEZhY3RvcnkoKSB7XG4gIGNsYXNzIEdlb2NvZGVyUGFuZWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBpc0dlb2NvZGVyRW5hYmxlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBtYXBTdGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgdXBkYXRlVmlzRGF0YTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIHJlbW92ZURhdGFzZXQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICB1cGRhdGVNYXA6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyXG4gICAgfTtcblxuICAgIHJlbW92ZUdlb2NvZGVyRGF0YXNldCgpIHtcbiAgICAgIHRoaXMucHJvcHMucmVtb3ZlRGF0YXNldChHRU9DT0RFUl9EQVRBU0VUX05BTUUpO1xuICAgIH1cblxuICAgIG9uU2VsZWN0ZWQgPSAodmlld3BvcnQgPSBudWxsLCBnZW9JdGVtKSA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGNlbnRlcjogW2xvbiwgbGF0XSxcbiAgICAgICAgdGV4dCxcbiAgICAgICAgYmJveFxuICAgICAgfSA9IGdlb0l0ZW07XG4gICAgICB0aGlzLnJlbW92ZUdlb2NvZGVyRGF0YXNldCgpO1xuICAgICAgdGhpcy5wcm9wcy51cGRhdGVWaXNEYXRhKFxuICAgICAgICBbZ2VuZXJhdGVHZW9jb2RlckRhdGFzZXQobGF0LCBsb24sIHRleHQpXSxcbiAgICAgICAge1xuICAgICAgICAgIGtlZXBFeGlzdGluZ0NvbmZpZzogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBQQVJTRURfQ09ORklHXG4gICAgICApO1xuICAgICAgY29uc3QgYm91bmRzID0gYmJveCB8fCBbXG4gICAgICAgIGxvbiAtIEdFT0NPREVSX0dFT19PRkZTRVQsXG4gICAgICAgIGxhdCAtIEdFT0NPREVSX0dFT19PRkZTRVQsXG4gICAgICAgIGxvbiArIEdFT0NPREVSX0dFT19PRkZTRVQsXG4gICAgICAgIGxhdCArIEdFT0NPREVSX0dFT19PRkZTRVRcbiAgICAgIF07XG4gICAgICBjb25zdCBjZW50ZXJBbmRab29tID0gZ2V0Q2VudGVyQW5kWm9vbUZyb21Cb3VuZHMoYm91bmRzLCB7XG4gICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLm1hcFN0YXRlLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMubWFwU3RhdGUuaGVpZ2h0XG4gICAgICB9KTtcblxuICAgICAgaWYgKCFjZW50ZXJBbmRab29tKSB7XG4gICAgICAgIC8vIGZhaWxlZCB0byBmaXQgYm91bmRzXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9wcy51cGRhdGVNYXAoe1xuICAgICAgICBsYXRpdHVkZTogY2VudGVyQW5kWm9vbS5jZW50ZXJbMV0sXG4gICAgICAgIGxvbmdpdHVkZTogY2VudGVyQW5kWm9vbS5jZW50ZXJbMF0sXG4gICAgICAgIC8vIEZvciBtYXJnaW5hbCBvciBpbnZhbGlkIGJvdW5kcywgem9vbSBtYXkgYmUgTmFOLiBNYWtlIHN1cmUgdG8gcHJvdmlkZSBhIHZhbGlkIHZhbHVlIGluIG9yZGVyXG4gICAgICAgIC8vIHRvIGF2b2lkIGNvcnJ1cHQgc3RhdGUgYW5kIHBvdGVudGlhbCBjcmFzaGVzIGFzIHpvb20gaXMgZXhwZWN0ZWQgdG8gYmUgYSBudW1iZXJcbiAgICAgICAgLi4uKE51bWJlci5pc0Zpbml0ZShjZW50ZXJBbmRab29tLnpvb20pID8ge3pvb206IGNlbnRlckFuZFpvb20uem9vbX0gOiB7fSksXG4gICAgICAgIHBpdGNoOiAwLFxuICAgICAgICBiZWFyaW5nOiAwLFxuICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb246IHRoaXMucHJvcHMudHJhbnNpdGlvbkR1cmF0aW9uLFxuICAgICAgICB0cmFuc2l0aW9uSW50ZXJwb2xhdG9yOiBuZXcgRmx5VG9JbnRlcnBvbGF0b3IoKVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJlbW92ZU1hcmtlciA9ICgpID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlR2VvY29kZXJEYXRhc2V0KCk7XG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtpc0dlb2NvZGVyRW5hYmxlZCwgbWFwYm94QXBpQWNjZXNzVG9rZW4sIHdpZHRofSA9IHRoaXMucHJvcHM7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkR2VvY29kZXJQYW5lbFxuICAgICAgICAgIGNsYXNzTmFtZT1cImdlb2NvZGVyLXBhbmVsXCJcbiAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgc3R5bGU9e3tkaXNwbGF5OiBpc0dlb2NvZGVyRW5hYmxlZCA/ICdibG9jaycgOiAnbm9uZSd9fVxuICAgICAgICA+XG4gICAgICAgICAge2lzVmFsaWQobWFwYm94QXBpQWNjZXNzVG9rZW4pICYmIChcbiAgICAgICAgICAgIDxHZW9jb2RlclxuICAgICAgICAgICAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbj17bWFwYm94QXBpQWNjZXNzVG9rZW59XG4gICAgICAgICAgICAgIG9uU2VsZWN0ZWQ9e3RoaXMub25TZWxlY3RlZH1cbiAgICAgICAgICAgICAgb25EZWxldGVNYXJrZXI9e3RoaXMucmVtb3ZlTWFya2VyfVxuICAgICAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvU3R5bGVkR2VvY29kZXJQYW5lbD5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgR2VvY29kZXJQYW5lbC5kZWZhdWx0UHJvcHMgPSB7XG4gICAgdHJhbnNpdGlvbkR1cmF0aW9uOiAzMDAwXG4gIH07XG5cbiAgcmV0dXJuIEdlb2NvZGVyUGFuZWw7XG59XG4iXX0=