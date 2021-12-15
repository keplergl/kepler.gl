"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PlotContainerFactory;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

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

var _reselect = require("reselect");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactMapGl = require("react-map-gl");

var _lodash = _interopRequireDefault(require("lodash.debounce"));

var _notificationsUtils = require("../utils/notifications-utils");

var _mapContainer = _interopRequireDefault(require("./map-container"));

var _exportUtils = require("../utils/export-utils");

var _mapboxGlStyleEditor = require("../utils/map-style-utils/mapbox-gl-style-editor");

var _dataUtils = require("../utils/data-utils");

var _projectionUtils = require("../utils/projection-utils");

var _defaultSettings = require("../constants/default-settings");

var _templateObject, _templateObject2;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var CLASS_FILTER = ['mapboxgl-control-container', 'attrition-link', 'attrition-logo'];

var DOM_FILTER_FUNC = function DOM_FILTER_FUNC(node) {
  return !CLASS_FILTER.includes(node.className);
};

var OUT_OF_SCREEN_POSITION = -9999;
var propTypes = {
  width: _propTypes["default"].number.isRequired,
  height: _propTypes["default"].number.isRequired,
  exportImageSetting: _propTypes["default"].object.isRequired,
  addNotification: _propTypes["default"].func.isRequired,
  mapFields: _propTypes["default"].object.isRequired,
  setExportImageSetting: _propTypes["default"].object.isRequired,
  setExportImageDataUri: _propTypes["default"].func.isRequired,
  setExportImageError: _propTypes["default"].func.isRequired,
  splitMaps: _propTypes["default"].arrayOf(_propTypes["default"].object)
};
PlotContainerFactory.deps = [_mapContainer["default"]]; // Remove mapbox logo in exported map, because it contains non-ascii characters

var StyledPlotContainer = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  .mapboxgl-ctrl-bottom-left,\n  .mapboxgl-ctrl-bottom-right,\n  .mapbox-attribution-container {\n    display: none;\n  }\n\n  position: absolute;\n  top: ", "px;\n  left: ", "px;\n"])), OUT_OF_SCREEN_POSITION, OUT_OF_SCREEN_POSITION);

var StyledMapContainer = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  width: ", "px;\n  height: ", "px;\n  display: flex;\n"])), function (props) {
  return props.width;
}, function (props) {
  return props.height;
});

var deckGlProps = {
  glOptions: {
    preserveDrawingBuffer: true,
    useDevicePixels: false
  }
};

function PlotContainerFactory(MapContainer) {
  var PlotContainer = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(PlotContainer, _Component);

    var _super = _createSuper(PlotContainer);

    function PlotContainer(_props) {
      var _this;

      (0, _classCallCheck2["default"])(this, PlotContainer);
      _this = _super.call(this, _props);
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "plottingAreaRef", /*#__PURE__*/(0, _react.createRef)());
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "mapStyleSelector", function (props) {
        return props.mapFields.mapStyle;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "mapScaleSelector", function (props) {
        var imageSize = props.exportImageSetting.imageSize;
        var mapState = props.mapFields.mapState;

        if (imageSize.scale) {
          return imageSize.scale;
        }

        var scale = (0, _exportUtils.getScaleFromImageSize)(imageSize.imageW, imageSize.imageH, mapState.width * (mapState.isSplit ? 2 : 1), mapState.height);
        return scale > 0 ? scale : 1;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "scaledMapStyleSelector", (0, _reselect.createSelector)(_this.mapStyleSelector, _this.mapScaleSelector, function (mapStyle, scale) {
        return _objectSpread(_objectSpread({}, mapStyle), {}, {
          bottomMapStyle: (0, _mapboxGlStyleEditor.scaleMapStyleByResolution)(mapStyle.bottomMapStyle, scale),
          topMapStyle: (0, _mapboxGlStyleEditor.scaleMapStyleByResolution)(mapStyle.topMapStyle, scale)
        });
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onMapRender", function (map) {
        if (map.isStyleLoaded()) {
          _this._retrieveNewScreenshot();
        }
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_retrieveNewScreenshot", function () {
        if (_this.plottingAreaRef.current) {
          (0, _exportUtils.convertToPng)(_this.plottingAreaRef.current, {
            filter: DOM_FILTER_FUNC
          }).then(_this.props.setExportImageDataUri)["catch"](function (err) {
            _this.props.setExportImageError(err);

            if (_this.props.enableErrorNotification) {
              _this.props.addNotification((0, _notificationsUtils.exportImageError)({
                err: err
              }));
            }
          });
        }
      });
      _this._onMapRender = (0, _lodash["default"])(_this._onMapRender, 500);
      _this._retrieveNewScreenshot = (0, _lodash["default"])(_this._retrieveNewScreenshot, 500);
      return _this;
    }

    (0, _createClass2["default"])(PlotContainer, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.props.setExportImageSetting({
          processing: true
        });
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        var _this2 = this;

        // re-fetch the new screenshot only when ratio legend or resolution changes
        var checks = ['ratio', 'resolution', 'legend'];
        var shouldRetrieveScreenshot = checks.some(function (item) {
          return _this2.props.exportImageSetting[item] !== prevProps.exportImageSetting[item];
        });

        if (shouldRetrieveScreenshot) {
          this.props.setExportImageSetting({
            processing: true
          });

          this._retrieveNewScreenshot();
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            exportImageSetting = _this$props.exportImageSetting,
            mapFields = _this$props.mapFields,
            splitMaps = _this$props.splitMaps;
        var _exportImageSetting$i = exportImageSetting.imageSize,
            imageSize = _exportImageSetting$i === void 0 ? {} : _exportImageSetting$i,
            legend = exportImageSetting.legend;
        var mapState = mapFields.mapState;
        var isSplit = splitMaps && splitMaps.length > 1;
        var size = {
          width: imageSize.imageW || 1,
          height: imageSize.imageH || 1
        };
        var width = size.width / (isSplit ? 2 : 1);
        var height = size.height;
        var scale = this.mapScaleSelector(this.props);

        var newMapState = _objectSpread(_objectSpread({}, mapState), {}, {
          width: width,
          height: height,
          zoom: mapState.zoom + (Math.log2(scale) || 0)
        }); // center and all layer bounds


        if (exportImageSetting.center) {
          var renderedLayers = mapFields.layers.filter(function (layer, idx) {
            return layer.id !== _defaultSettings.GEOCODER_LAYER_ID && layer.shouldRenderLayer(mapFields.layerData[idx]);
          });
          var bounds = (0, _dataUtils.findMapBounds)(renderedLayers);
          var centerAndZoom = (0, _projectionUtils.getCenterAndZoomFromBounds)(bounds, {
            width: width,
            height: height
          });

          if (centerAndZoom) {
            var zoom = Number.isFinite(centerAndZoom.zoom) ? centerAndZoom.zoom : mapState.zoom;
            newMapState.longitude = centerAndZoom.center[0];
            newMapState.latitude = centerAndZoom.center[1];
            newMapState.zoom = zoom + Number(Math.log2(scale) || 0);
          }
        }

        var mapProps = _objectSpread(_objectSpread({}, mapFields), {}, {
          mapStyle: this.scaledMapStyleSelector(this.props),
          // override viewport based on export settings
          mapState: newMapState,
          mapControls: {
            // override map legend visibility
            mapLegend: {
              show: legend,
              active: true
            }
          },
          MapComponent: _reactMapGl.StaticMap,
          onMapRender: this._onMapRender,
          isExport: true,
          deckGlProps: deckGlProps
        });

        var mapContainers = !isSplit ? /*#__PURE__*/_react["default"].createElement(MapContainer, (0, _extends2["default"])({
          index: 0
        }, mapProps)) : splitMaps.map(function (settings, index) {
          return /*#__PURE__*/_react["default"].createElement(MapContainer, (0, _extends2["default"])({
            key: index,
            index: index
          }, mapProps, {
            mapLayers: splitMaps[index].layers
          }));
        });
        return /*#__PURE__*/_react["default"].createElement(StyledPlotContainer, {
          className: "export-map-instance"
        }, /*#__PURE__*/_react["default"].createElement(StyledMapContainer, {
          ref: this.plottingAreaRef,
          width: size.width,
          height: size.height
        }, mapContainers));
      }
    }]);
    return PlotContainer;
  }(_react.Component);

  PlotContainer.propsTypes = propTypes;
  return PlotContainer;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL3Bsb3QtY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbIkNMQVNTX0ZJTFRFUiIsIkRPTV9GSUxURVJfRlVOQyIsIm5vZGUiLCJpbmNsdWRlcyIsImNsYXNzTmFtZSIsIk9VVF9PRl9TQ1JFRU5fUE9TSVRJT04iLCJwcm9wVHlwZXMiLCJ3aWR0aCIsIlByb3BUeXBlcyIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJoZWlnaHQiLCJleHBvcnRJbWFnZVNldHRpbmciLCJvYmplY3QiLCJhZGROb3RpZmljYXRpb24iLCJmdW5jIiwibWFwRmllbGRzIiwic2V0RXhwb3J0SW1hZ2VTZXR0aW5nIiwic2V0RXhwb3J0SW1hZ2VEYXRhVXJpIiwic2V0RXhwb3J0SW1hZ2VFcnJvciIsInNwbGl0TWFwcyIsImFycmF5T2YiLCJQbG90Q29udGFpbmVyRmFjdG9yeSIsImRlcHMiLCJNYXBDb250YWluZXJGYWN0b3J5IiwiU3R5bGVkUGxvdENvbnRhaW5lciIsInN0eWxlZCIsImRpdiIsIlN0eWxlZE1hcENvbnRhaW5lciIsInByb3BzIiwiZGVja0dsUHJvcHMiLCJnbE9wdGlvbnMiLCJwcmVzZXJ2ZURyYXdpbmdCdWZmZXIiLCJ1c2VEZXZpY2VQaXhlbHMiLCJNYXBDb250YWluZXIiLCJQbG90Q29udGFpbmVyIiwibWFwU3R5bGUiLCJpbWFnZVNpemUiLCJtYXBTdGF0ZSIsInNjYWxlIiwiaW1hZ2VXIiwiaW1hZ2VIIiwiaXNTcGxpdCIsIm1hcFN0eWxlU2VsZWN0b3IiLCJtYXBTY2FsZVNlbGVjdG9yIiwiYm90dG9tTWFwU3R5bGUiLCJ0b3BNYXBTdHlsZSIsIm1hcCIsImlzU3R5bGVMb2FkZWQiLCJfcmV0cmlldmVOZXdTY3JlZW5zaG90IiwicGxvdHRpbmdBcmVhUmVmIiwiY3VycmVudCIsImZpbHRlciIsInRoZW4iLCJlcnIiLCJlbmFibGVFcnJvck5vdGlmaWNhdGlvbiIsIl9vbk1hcFJlbmRlciIsInByb2Nlc3NpbmciLCJwcmV2UHJvcHMiLCJjaGVja3MiLCJzaG91bGRSZXRyaWV2ZVNjcmVlbnNob3QiLCJzb21lIiwiaXRlbSIsImxlZ2VuZCIsImxlbmd0aCIsInNpemUiLCJuZXdNYXBTdGF0ZSIsInpvb20iLCJNYXRoIiwibG9nMiIsImNlbnRlciIsInJlbmRlcmVkTGF5ZXJzIiwibGF5ZXJzIiwibGF5ZXIiLCJpZHgiLCJpZCIsIkdFT0NPREVSX0xBWUVSX0lEIiwic2hvdWxkUmVuZGVyTGF5ZXIiLCJsYXllckRhdGEiLCJib3VuZHMiLCJjZW50ZXJBbmRab29tIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJsb25naXR1ZGUiLCJsYXRpdHVkZSIsIm1hcFByb3BzIiwic2NhbGVkTWFwU3R5bGVTZWxlY3RvciIsIm1hcENvbnRyb2xzIiwibWFwTGVnZW5kIiwic2hvdyIsImFjdGl2ZSIsIk1hcENvbXBvbmVudCIsIlN0YXRpY01hcCIsIm9uTWFwUmVuZGVyIiwiaXNFeHBvcnQiLCJtYXBDb250YWluZXJzIiwic2V0dGluZ3MiLCJpbmRleCIsIkNvbXBvbmVudCIsInByb3BzVHlwZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZLEdBQUcsQ0FBQyw0QkFBRCxFQUErQixnQkFBL0IsRUFBaUQsZ0JBQWpELENBQXJCOztBQUNBLElBQU1DLGVBQWUsR0FBRyxTQUFsQkEsZUFBa0IsQ0FBQUMsSUFBSTtBQUFBLFNBQUksQ0FBQ0YsWUFBWSxDQUFDRyxRQUFiLENBQXNCRCxJQUFJLENBQUNFLFNBQTNCLENBQUw7QUFBQSxDQUE1Qjs7QUFDQSxJQUFNQyxzQkFBc0IsR0FBRyxDQUFDLElBQWhDO0FBRUEsSUFBTUMsU0FBUyxHQUFHO0FBQ2hCQyxFQUFBQSxLQUFLLEVBQUVDLHNCQUFVQyxNQUFWLENBQWlCQyxVQURSO0FBRWhCQyxFQUFBQSxNQUFNLEVBQUVILHNCQUFVQyxNQUFWLENBQWlCQyxVQUZUO0FBR2hCRSxFQUFBQSxrQkFBa0IsRUFBRUosc0JBQVVLLE1BQVYsQ0FBaUJILFVBSHJCO0FBSWhCSSxFQUFBQSxlQUFlLEVBQUVOLHNCQUFVTyxJQUFWLENBQWVMLFVBSmhCO0FBS2hCTSxFQUFBQSxTQUFTLEVBQUVSLHNCQUFVSyxNQUFWLENBQWlCSCxVQUxaO0FBTWhCTyxFQUFBQSxxQkFBcUIsRUFBRVQsc0JBQVVLLE1BQVYsQ0FBaUJILFVBTnhCO0FBT2hCUSxFQUFBQSxxQkFBcUIsRUFBRVYsc0JBQVVPLElBQVYsQ0FBZUwsVUFQdEI7QUFRaEJTLEVBQUFBLG1CQUFtQixFQUFFWCxzQkFBVU8sSUFBVixDQUFlTCxVQVJwQjtBQVNoQlUsRUFBQUEsU0FBUyxFQUFFWixzQkFBVWEsT0FBVixDQUFrQmIsc0JBQVVLLE1BQTVCO0FBVEssQ0FBbEI7QUFZQVMsb0JBQW9CLENBQUNDLElBQXJCLEdBQTRCLENBQUNDLHdCQUFELENBQTVCLEMsQ0FFQTs7QUFDQSxJQUFNQyxtQkFBbUIsR0FBR0MsNkJBQU9DLEdBQVYsOFFBUWhCdEIsc0JBUmdCLEVBU2ZBLHNCQVRlLENBQXpCOztBQVlBLElBQU11QixrQkFBa0IsR0FBR0YsNkJBQU9DLEdBQVYsa0pBQ2IsVUFBQUUsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ3RCLEtBQVY7QUFBQSxDQURRLEVBRVosVUFBQXNCLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNsQixNQUFWO0FBQUEsQ0FGTyxDQUF4Qjs7QUFNQSxJQUFNbUIsV0FBVyxHQUFHO0FBQ2xCQyxFQUFBQSxTQUFTLEVBQUU7QUFDVEMsSUFBQUEscUJBQXFCLEVBQUUsSUFEZDtBQUVUQyxJQUFBQSxlQUFlLEVBQUU7QUFGUjtBQURPLENBQXBCOztBQU9lLFNBQVNYLG9CQUFULENBQThCWSxZQUE5QixFQUE0QztBQUFBLE1BQ25EQyxhQURtRDtBQUFBOztBQUFBOztBQUV2RCwyQkFBWU4sTUFBWixFQUFtQjtBQUFBOztBQUFBO0FBQ2pCLGdDQUFNQSxNQUFOO0FBRGlCLHVIQXNCRCx1QkF0QkM7QUFBQSwyR0F3QkEsVUFBQUEsS0FBSztBQUFBLGVBQUlBLEtBQUssQ0FBQ2IsU0FBTixDQUFnQm9CLFFBQXBCO0FBQUEsT0F4Qkw7QUFBQSwyR0F5QkEsVUFBQVAsS0FBSyxFQUFJO0FBQUEsWUFDbkJRLFNBRG1CLEdBQ05SLEtBQUssQ0FBQ2pCLGtCQURBLENBQ25CeUIsU0FEbUI7QUFBQSxZQUVuQkMsUUFGbUIsR0FFUFQsS0FBSyxDQUFDYixTQUZDLENBRW5Cc0IsUUFGbUI7O0FBRzFCLFlBQUlELFNBQVMsQ0FBQ0UsS0FBZCxFQUFxQjtBQUNuQixpQkFBT0YsU0FBUyxDQUFDRSxLQUFqQjtBQUNEOztBQUVELFlBQU1BLEtBQUssR0FBRyx3Q0FDWkYsU0FBUyxDQUFDRyxNQURFLEVBRVpILFNBQVMsQ0FBQ0ksTUFGRSxFQUdaSCxRQUFRLENBQUMvQixLQUFULElBQWtCK0IsUUFBUSxDQUFDSSxPQUFULEdBQW1CLENBQW5CLEdBQXVCLENBQXpDLENBSFksRUFJWkosUUFBUSxDQUFDM0IsTUFKRyxDQUFkO0FBT0EsZUFBTzRCLEtBQUssR0FBRyxDQUFSLEdBQVlBLEtBQVosR0FBb0IsQ0FBM0I7QUFDRCxPQXhDa0I7QUFBQSxpSEEwQ00sOEJBQ3ZCLE1BQUtJLGdCQURrQixFQUV2QixNQUFLQyxnQkFGa0IsRUFHdkIsVUFBQ1IsUUFBRCxFQUFXRyxLQUFYO0FBQUEsK0NBQ0tILFFBREw7QUFFRVMsVUFBQUEsY0FBYyxFQUFFLG9EQUEwQlQsUUFBUSxDQUFDUyxjQUFuQyxFQUFtRE4sS0FBbkQsQ0FGbEI7QUFHRU8sVUFBQUEsV0FBVyxFQUFFLG9EQUEwQlYsUUFBUSxDQUFDVSxXQUFuQyxFQUFnRFAsS0FBaEQ7QUFIZjtBQUFBLE9BSHVCLENBMUNOO0FBQUEsdUdBb0RKLFVBQUFRLEdBQUcsRUFBSTtBQUNwQixZQUFJQSxHQUFHLENBQUNDLGFBQUosRUFBSixFQUF5QjtBQUN2QixnQkFBS0Msc0JBQUw7QUFDRDtBQUNGLE9BeERrQjtBQUFBLGlIQTBETSxZQUFNO0FBQzdCLFlBQUksTUFBS0MsZUFBTCxDQUFxQkMsT0FBekIsRUFBa0M7QUFDaEMseUNBQWEsTUFBS0QsZUFBTCxDQUFxQkMsT0FBbEMsRUFBMkM7QUFBQ0MsWUFBQUEsTUFBTSxFQUFFbkQ7QUFBVCxXQUEzQyxFQUNHb0QsSUFESCxDQUNRLE1BQUt4QixLQUFMLENBQVdYLHFCQURuQixXQUVTLFVBQUFvQyxHQUFHLEVBQUk7QUFDWixrQkFBS3pCLEtBQUwsQ0FBV1YsbUJBQVgsQ0FBK0JtQyxHQUEvQjs7QUFDQSxnQkFBSSxNQUFLekIsS0FBTCxDQUFXMEIsdUJBQWYsRUFBd0M7QUFDdEMsb0JBQUsxQixLQUFMLENBQVdmLGVBQVgsQ0FBMkIsMENBQWlCO0FBQUN3QyxnQkFBQUEsR0FBRyxFQUFIQTtBQUFELGVBQWpCLENBQTNCO0FBQ0Q7QUFDRixXQVBIO0FBUUQ7QUFDRixPQXJFa0I7QUFFakIsWUFBS0UsWUFBTCxHQUFvQix3QkFBUyxNQUFLQSxZQUFkLEVBQTRCLEdBQTVCLENBQXBCO0FBQ0EsWUFBS1Asc0JBQUwsR0FBOEIsd0JBQVMsTUFBS0Esc0JBQWQsRUFBc0MsR0FBdEMsQ0FBOUI7QUFIaUI7QUFJbEI7O0FBTnNEO0FBQUE7QUFBQSxhQVF2RCw2QkFBb0I7QUFDbEIsYUFBS3BCLEtBQUwsQ0FBV1oscUJBQVgsQ0FBaUM7QUFBQ3dDLFVBQUFBLFVBQVUsRUFBRTtBQUFiLFNBQWpDO0FBQ0Q7QUFWc0Q7QUFBQTtBQUFBLGFBWXZELDRCQUFtQkMsU0FBbkIsRUFBOEI7QUFBQTs7QUFDNUI7QUFDQSxZQUFNQyxNQUFNLEdBQUcsQ0FBQyxPQUFELEVBQVUsWUFBVixFQUF3QixRQUF4QixDQUFmO0FBQ0EsWUFBTUMsd0JBQXdCLEdBQUdELE1BQU0sQ0FBQ0UsSUFBUCxDQUMvQixVQUFBQyxJQUFJO0FBQUEsaUJBQUksTUFBSSxDQUFDakMsS0FBTCxDQUFXakIsa0JBQVgsQ0FBOEJrRCxJQUE5QixNQUF3Q0osU0FBUyxDQUFDOUMsa0JBQVYsQ0FBNkJrRCxJQUE3QixDQUE1QztBQUFBLFNBRDJCLENBQWpDOztBQUdBLFlBQUlGLHdCQUFKLEVBQThCO0FBQzVCLGVBQUsvQixLQUFMLENBQVdaLHFCQUFYLENBQWlDO0FBQUN3QyxZQUFBQSxVQUFVLEVBQUU7QUFBYixXQUFqQzs7QUFDQSxlQUFLUixzQkFBTDtBQUNEO0FBQ0Y7QUF0QnNEO0FBQUE7QUFBQSxhQXlFdkQsa0JBQVM7QUFBQSwwQkFDNEMsS0FBS3BCLEtBRGpEO0FBQUEsWUFDQWpCLGtCQURBLGVBQ0FBLGtCQURBO0FBQUEsWUFDb0JJLFNBRHBCLGVBQ29CQSxTQURwQjtBQUFBLFlBQytCSSxTQUQvQixlQUMrQkEsU0FEL0I7QUFBQSxvQ0FFMEJSLGtCQUYxQixDQUVBeUIsU0FGQTtBQUFBLFlBRUFBLFNBRkEsc0NBRVksRUFGWjtBQUFBLFlBRWdCMEIsTUFGaEIsR0FFMEJuRCxrQkFGMUIsQ0FFZ0JtRCxNQUZoQjtBQUFBLFlBR0F6QixRQUhBLEdBR1l0QixTQUhaLENBR0FzQixRQUhBO0FBSVAsWUFBTUksT0FBTyxHQUFHdEIsU0FBUyxJQUFJQSxTQUFTLENBQUM0QyxNQUFWLEdBQW1CLENBQWhEO0FBRUEsWUFBTUMsSUFBSSxHQUFHO0FBQ1gxRCxVQUFBQSxLQUFLLEVBQUU4QixTQUFTLENBQUNHLE1BQVYsSUFBb0IsQ0FEaEI7QUFFWDdCLFVBQUFBLE1BQU0sRUFBRTBCLFNBQVMsQ0FBQ0ksTUFBVixJQUFvQjtBQUZqQixTQUFiO0FBSUEsWUFBTWxDLEtBQUssR0FBRzBELElBQUksQ0FBQzFELEtBQUwsSUFBY21DLE9BQU8sR0FBRyxDQUFILEdBQU8sQ0FBNUIsQ0FBZDtBQUNBLFlBQU0vQixNQUFNLEdBQUdzRCxJQUFJLENBQUN0RCxNQUFwQjtBQUNBLFlBQU00QixLQUFLLEdBQUcsS0FBS0ssZ0JBQUwsQ0FBc0IsS0FBS2YsS0FBM0IsQ0FBZDs7QUFDQSxZQUFNcUMsV0FBVyxtQ0FDWjVCLFFBRFk7QUFFZi9CLFVBQUFBLEtBQUssRUFBTEEsS0FGZTtBQUdmSSxVQUFBQSxNQUFNLEVBQU5BLE1BSGU7QUFJZndELFVBQUFBLElBQUksRUFBRTdCLFFBQVEsQ0FBQzZCLElBQVQsSUFBaUJDLElBQUksQ0FBQ0MsSUFBTCxDQUFVOUIsS0FBVixLQUFvQixDQUFyQztBQUpTLFVBQWpCLENBYk8sQ0FvQlA7OztBQUNBLFlBQUkzQixrQkFBa0IsQ0FBQzBELE1BQXZCLEVBQStCO0FBQzdCLGNBQU1DLGNBQWMsR0FBR3ZELFNBQVMsQ0FBQ3dELE1BQVYsQ0FBaUJwQixNQUFqQixDQUNyQixVQUFDcUIsS0FBRCxFQUFRQyxHQUFSO0FBQUEsbUJBQ0VELEtBQUssQ0FBQ0UsRUFBTixLQUFhQyxrQ0FBYixJQUFrQ0gsS0FBSyxDQUFDSSxpQkFBTixDQUF3QjdELFNBQVMsQ0FBQzhELFNBQVYsQ0FBb0JKLEdBQXBCLENBQXhCLENBRHBDO0FBQUEsV0FEcUIsQ0FBdkI7QUFJQSxjQUFNSyxNQUFNLEdBQUcsOEJBQWNSLGNBQWQsQ0FBZjtBQUNBLGNBQU1TLGFBQWEsR0FBRyxpREFBMkJELE1BQTNCLEVBQW1DO0FBQUN4RSxZQUFBQSxLQUFLLEVBQUxBLEtBQUQ7QUFBUUksWUFBQUEsTUFBTSxFQUFOQTtBQUFSLFdBQW5DLENBQXRCOztBQUNBLGNBQUlxRSxhQUFKLEVBQW1CO0FBQ2pCLGdCQUFNYixJQUFJLEdBQUdjLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkYsYUFBYSxDQUFDYixJQUE5QixJQUFzQ2EsYUFBYSxDQUFDYixJQUFwRCxHQUEyRDdCLFFBQVEsQ0FBQzZCLElBQWpGO0FBRUFELFlBQUFBLFdBQVcsQ0FBQ2lCLFNBQVosR0FBd0JILGFBQWEsQ0FBQ1YsTUFBZCxDQUFxQixDQUFyQixDQUF4QjtBQUNBSixZQUFBQSxXQUFXLENBQUNrQixRQUFaLEdBQXVCSixhQUFhLENBQUNWLE1BQWQsQ0FBcUIsQ0FBckIsQ0FBdkI7QUFDQUosWUFBQUEsV0FBVyxDQUFDQyxJQUFaLEdBQW1CQSxJQUFJLEdBQUdjLE1BQU0sQ0FBQ2IsSUFBSSxDQUFDQyxJQUFMLENBQVU5QixLQUFWLEtBQW9CLENBQXJCLENBQWhDO0FBQ0Q7QUFDRjs7QUFFRCxZQUFNOEMsUUFBUSxtQ0FDVHJFLFNBRFM7QUFFWm9CLFVBQUFBLFFBQVEsRUFBRSxLQUFLa0Qsc0JBQUwsQ0FBNEIsS0FBS3pELEtBQWpDLENBRkU7QUFJWjtBQUNBUyxVQUFBQSxRQUFRLEVBQUU0QixXQUxFO0FBTVpxQixVQUFBQSxXQUFXLEVBQUU7QUFDWDtBQUNBQyxZQUFBQSxTQUFTLEVBQUU7QUFDVEMsY0FBQUEsSUFBSSxFQUFFMUIsTUFERztBQUVUMkIsY0FBQUEsTUFBTSxFQUFFO0FBRkM7QUFGQSxXQU5EO0FBYVpDLFVBQUFBLFlBQVksRUFBRUMscUJBYkY7QUFjWkMsVUFBQUEsV0FBVyxFQUFFLEtBQUtyQyxZQWROO0FBZVpzQyxVQUFBQSxRQUFRLEVBQUUsSUFmRTtBQWdCWmhFLFVBQUFBLFdBQVcsRUFBWEE7QUFoQlksVUFBZDs7QUFtQkEsWUFBTWlFLGFBQWEsR0FBRyxDQUFDckQsT0FBRCxnQkFDcEIsZ0NBQUMsWUFBRDtBQUFjLFVBQUEsS0FBSyxFQUFFO0FBQXJCLFdBQTRCMkMsUUFBNUIsRUFEb0IsR0FHcEJqRSxTQUFTLENBQUMyQixHQUFWLENBQWMsVUFBQ2lELFFBQUQsRUFBV0MsS0FBWDtBQUFBLDhCQUNaLGdDQUFDLFlBQUQ7QUFDRSxZQUFBLEdBQUcsRUFBRUEsS0FEUDtBQUVFLFlBQUEsS0FBSyxFQUFFQTtBQUZULGFBR01aLFFBSE47QUFJRSxZQUFBLFNBQVMsRUFBRWpFLFNBQVMsQ0FBQzZFLEtBQUQsQ0FBVCxDQUFpQnpCO0FBSjlCLGFBRFk7QUFBQSxTQUFkLENBSEY7QUFhQSw0QkFDRSxnQ0FBQyxtQkFBRDtBQUFxQixVQUFBLFNBQVMsRUFBQztBQUEvQix3QkFDRSxnQ0FBQyxrQkFBRDtBQUFvQixVQUFBLEdBQUcsRUFBRSxLQUFLdEIsZUFBOUI7QUFBK0MsVUFBQSxLQUFLLEVBQUVlLElBQUksQ0FBQzFELEtBQTNEO0FBQWtFLFVBQUEsTUFBTSxFQUFFMEQsSUFBSSxDQUFDdEQ7QUFBL0UsV0FDR29GLGFBREgsQ0FERixDQURGO0FBT0Q7QUFySnNEO0FBQUE7QUFBQSxJQUM3QkcsZ0JBRDZCOztBQXdKekQvRCxFQUFBQSxhQUFhLENBQUNnRSxVQUFkLEdBQTJCN0YsU0FBM0I7QUFDQSxTQUFPNkIsYUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuLy8gbGlicmFyaWVzXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnQsIGNyZWF0ZVJlZn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtTdGF0aWNNYXB9IGZyb20gJ3JlYWN0LW1hcC1nbCc7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnbG9kYXNoLmRlYm91bmNlJztcbmltcG9ydCB7ZXhwb3J0SW1hZ2VFcnJvcn0gZnJvbSAndXRpbHMvbm90aWZpY2F0aW9ucy11dGlscyc7XG5pbXBvcnQgTWFwQ29udGFpbmVyRmFjdG9yeSBmcm9tICcuL21hcC1jb250YWluZXInO1xuaW1wb3J0IHtjb252ZXJ0VG9Qbmd9IGZyb20gJ3V0aWxzL2V4cG9ydC11dGlscyc7XG5pbXBvcnQge3NjYWxlTWFwU3R5bGVCeVJlc29sdXRpb259IGZyb20gJ3V0aWxzL21hcC1zdHlsZS11dGlscy9tYXBib3gtZ2wtc3R5bGUtZWRpdG9yJztcbmltcG9ydCB7Z2V0U2NhbGVGcm9tSW1hZ2VTaXplfSBmcm9tICd1dGlscy9leHBvcnQtdXRpbHMnO1xuaW1wb3J0IHtmaW5kTWFwQm91bmRzfSBmcm9tICd1dGlscy9kYXRhLXV0aWxzJztcbmltcG9ydCB7Z2V0Q2VudGVyQW5kWm9vbUZyb21Cb3VuZHN9IGZyb20gJ3V0aWxzL3Byb2plY3Rpb24tdXRpbHMnO1xuaW1wb3J0IHtHRU9DT0RFUl9MQVlFUl9JRH0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBDTEFTU19GSUxURVIgPSBbJ21hcGJveGdsLWNvbnRyb2wtY29udGFpbmVyJywgJ2F0dHJpdGlvbi1saW5rJywgJ2F0dHJpdGlvbi1sb2dvJ107XG5jb25zdCBET01fRklMVEVSX0ZVTkMgPSBub2RlID0+ICFDTEFTU19GSUxURVIuaW5jbHVkZXMobm9kZS5jbGFzc05hbWUpO1xuY29uc3QgT1VUX09GX1NDUkVFTl9QT1NJVElPTiA9IC05OTk5O1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBleHBvcnRJbWFnZVNldHRpbmc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgYWRkTm90aWZpY2F0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBtYXBGaWVsZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgc2V0RXhwb3J0SW1hZ2VTZXR0aW5nOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHNldEV4cG9ydEltYWdlRGF0YVVyaTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgc2V0RXhwb3J0SW1hZ2VFcnJvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgc3BsaXRNYXBzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KVxufTtcblxuUGxvdENvbnRhaW5lckZhY3RvcnkuZGVwcyA9IFtNYXBDb250YWluZXJGYWN0b3J5XTtcblxuLy8gUmVtb3ZlIG1hcGJveCBsb2dvIGluIGV4cG9ydGVkIG1hcCwgYmVjYXVzZSBpdCBjb250YWlucyBub24tYXNjaWkgY2hhcmFjdGVyc1xuY29uc3QgU3R5bGVkUGxvdENvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIC5tYXBib3hnbC1jdHJsLWJvdHRvbS1sZWZ0LFxuICAubWFwYm94Z2wtY3RybC1ib3R0b20tcmlnaHQsXG4gIC5tYXBib3gtYXR0cmlidXRpb24tY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG5cbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6ICR7T1VUX09GX1NDUkVFTl9QT1NJVElPTn1weDtcbiAgbGVmdDogJHtPVVRfT0ZfU0NSRUVOX1BPU0lUSU9OfXB4O1xuYDtcblxuY29uc3QgU3R5bGVkTWFwQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMud2lkdGh9cHg7XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy5oZWlnaHR9cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG5gO1xuXG5jb25zdCBkZWNrR2xQcm9wcyA9IHtcbiAgZ2xPcHRpb25zOiB7XG4gICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlLFxuICAgIHVzZURldmljZVBpeGVsczogZmFsc2VcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGxvdENvbnRhaW5lckZhY3RvcnkoTWFwQ29udGFpbmVyKSB7XG4gIGNsYXNzIFBsb3RDb250YWluZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICBzdXBlcihwcm9wcyk7XG4gICAgICB0aGlzLl9vbk1hcFJlbmRlciA9IGRlYm91bmNlKHRoaXMuX29uTWFwUmVuZGVyLCA1MDApO1xuICAgICAgdGhpcy5fcmV0cmlldmVOZXdTY3JlZW5zaG90ID0gZGVib3VuY2UodGhpcy5fcmV0cmlldmVOZXdTY3JlZW5zaG90LCA1MDApO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgdGhpcy5wcm9wcy5zZXRFeHBvcnRJbWFnZVNldHRpbmcoe3Byb2Nlc3Npbmc6IHRydWV9KTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgICAvLyByZS1mZXRjaCB0aGUgbmV3IHNjcmVlbnNob3Qgb25seSB3aGVuIHJhdGlvIGxlZ2VuZCBvciByZXNvbHV0aW9uIGNoYW5nZXNcbiAgICAgIGNvbnN0IGNoZWNrcyA9IFsncmF0aW8nLCAncmVzb2x1dGlvbicsICdsZWdlbmQnXTtcbiAgICAgIGNvbnN0IHNob3VsZFJldHJpZXZlU2NyZWVuc2hvdCA9IGNoZWNrcy5zb21lKFxuICAgICAgICBpdGVtID0+IHRoaXMucHJvcHMuZXhwb3J0SW1hZ2VTZXR0aW5nW2l0ZW1dICE9PSBwcmV2UHJvcHMuZXhwb3J0SW1hZ2VTZXR0aW5nW2l0ZW1dXG4gICAgICApO1xuICAgICAgaWYgKHNob3VsZFJldHJpZXZlU2NyZWVuc2hvdCkge1xuICAgICAgICB0aGlzLnByb3BzLnNldEV4cG9ydEltYWdlU2V0dGluZyh7cHJvY2Vzc2luZzogdHJ1ZX0pO1xuICAgICAgICB0aGlzLl9yZXRyaWV2ZU5ld1NjcmVlbnNob3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwbG90dGluZ0FyZWFSZWYgPSBjcmVhdGVSZWYoKTtcblxuICAgIG1hcFN0eWxlU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5tYXBGaWVsZHMubWFwU3R5bGU7XG4gICAgbWFwU2NhbGVTZWxlY3RvciA9IHByb3BzID0+IHtcbiAgICAgIGNvbnN0IHtpbWFnZVNpemV9ID0gcHJvcHMuZXhwb3J0SW1hZ2VTZXR0aW5nO1xuICAgICAgY29uc3Qge21hcFN0YXRlfSA9IHByb3BzLm1hcEZpZWxkcztcbiAgICAgIGlmIChpbWFnZVNpemUuc2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGltYWdlU2l6ZS5zY2FsZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2NhbGUgPSBnZXRTY2FsZUZyb21JbWFnZVNpemUoXG4gICAgICAgIGltYWdlU2l6ZS5pbWFnZVcsXG4gICAgICAgIGltYWdlU2l6ZS5pbWFnZUgsXG4gICAgICAgIG1hcFN0YXRlLndpZHRoICogKG1hcFN0YXRlLmlzU3BsaXQgPyAyIDogMSksXG4gICAgICAgIG1hcFN0YXRlLmhlaWdodFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIHNjYWxlID4gMCA/IHNjYWxlIDogMTtcbiAgICB9O1xuXG4gICAgc2NhbGVkTWFwU3R5bGVTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgdGhpcy5tYXBTdHlsZVNlbGVjdG9yLFxuICAgICAgdGhpcy5tYXBTY2FsZVNlbGVjdG9yLFxuICAgICAgKG1hcFN0eWxlLCBzY2FsZSkgPT4gKHtcbiAgICAgICAgLi4ubWFwU3R5bGUsXG4gICAgICAgIGJvdHRvbU1hcFN0eWxlOiBzY2FsZU1hcFN0eWxlQnlSZXNvbHV0aW9uKG1hcFN0eWxlLmJvdHRvbU1hcFN0eWxlLCBzY2FsZSksXG4gICAgICAgIHRvcE1hcFN0eWxlOiBzY2FsZU1hcFN0eWxlQnlSZXNvbHV0aW9uKG1hcFN0eWxlLnRvcE1hcFN0eWxlLCBzY2FsZSlcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIF9vbk1hcFJlbmRlciA9IG1hcCA9PiB7XG4gICAgICBpZiAobWFwLmlzU3R5bGVMb2FkZWQoKSkge1xuICAgICAgICB0aGlzLl9yZXRyaWV2ZU5ld1NjcmVlbnNob3QoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3JldHJpZXZlTmV3U2NyZWVuc2hvdCA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnBsb3R0aW5nQXJlYVJlZi5jdXJyZW50KSB7XG4gICAgICAgIGNvbnZlcnRUb1BuZyh0aGlzLnBsb3R0aW5nQXJlYVJlZi5jdXJyZW50LCB7ZmlsdGVyOiBET01fRklMVEVSX0ZVTkN9KVxuICAgICAgICAgIC50aGVuKHRoaXMucHJvcHMuc2V0RXhwb3J0SW1hZ2VEYXRhVXJpKVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5zZXRFeHBvcnRJbWFnZUVycm9yKGVycik7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5lbmFibGVFcnJvck5vdGlmaWNhdGlvbikge1xuICAgICAgICAgICAgICB0aGlzLnByb3BzLmFkZE5vdGlmaWNhdGlvbihleHBvcnRJbWFnZUVycm9yKHtlcnJ9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtleHBvcnRJbWFnZVNldHRpbmcsIG1hcEZpZWxkcywgc3BsaXRNYXBzfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCB7aW1hZ2VTaXplID0ge30sIGxlZ2VuZH0gPSBleHBvcnRJbWFnZVNldHRpbmc7XG4gICAgICBjb25zdCB7bWFwU3RhdGV9ID0gbWFwRmllbGRzO1xuICAgICAgY29uc3QgaXNTcGxpdCA9IHNwbGl0TWFwcyAmJiBzcGxpdE1hcHMubGVuZ3RoID4gMTtcblxuICAgICAgY29uc3Qgc2l6ZSA9IHtcbiAgICAgICAgd2lkdGg6IGltYWdlU2l6ZS5pbWFnZVcgfHwgMSxcbiAgICAgICAgaGVpZ2h0OiBpbWFnZVNpemUuaW1hZ2VIIHx8IDFcbiAgICAgIH07XG4gICAgICBjb25zdCB3aWR0aCA9IHNpemUud2lkdGggLyAoaXNTcGxpdCA/IDIgOiAxKTtcbiAgICAgIGNvbnN0IGhlaWdodCA9IHNpemUuaGVpZ2h0O1xuICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLm1hcFNjYWxlU2VsZWN0b3IodGhpcy5wcm9wcyk7XG4gICAgICBjb25zdCBuZXdNYXBTdGF0ZSA9IHtcbiAgICAgICAgLi4ubWFwU3RhdGUsXG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICAgIHpvb206IG1hcFN0YXRlLnpvb20gKyAoTWF0aC5sb2cyKHNjYWxlKSB8fCAwKVxuICAgICAgfTtcblxuICAgICAgLy8gY2VudGVyIGFuZCBhbGwgbGF5ZXIgYm91bmRzXG4gICAgICBpZiAoZXhwb3J0SW1hZ2VTZXR0aW5nLmNlbnRlcikge1xuICAgICAgICBjb25zdCByZW5kZXJlZExheWVycyA9IG1hcEZpZWxkcy5sYXllcnMuZmlsdGVyKFxuICAgICAgICAgIChsYXllciwgaWR4KSA9PlxuICAgICAgICAgICAgbGF5ZXIuaWQgIT09IEdFT0NPREVSX0xBWUVSX0lEICYmIGxheWVyLnNob3VsZFJlbmRlckxheWVyKG1hcEZpZWxkcy5sYXllckRhdGFbaWR4XSlcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYm91bmRzID0gZmluZE1hcEJvdW5kcyhyZW5kZXJlZExheWVycyk7XG4gICAgICAgIGNvbnN0IGNlbnRlckFuZFpvb20gPSBnZXRDZW50ZXJBbmRab29tRnJvbUJvdW5kcyhib3VuZHMsIHt3aWR0aCwgaGVpZ2h0fSk7XG4gICAgICAgIGlmIChjZW50ZXJBbmRab29tKSB7XG4gICAgICAgICAgY29uc3Qgem9vbSA9IE51bWJlci5pc0Zpbml0ZShjZW50ZXJBbmRab29tLnpvb20pID8gY2VudGVyQW5kWm9vbS56b29tIDogbWFwU3RhdGUuem9vbTtcblxuICAgICAgICAgIG5ld01hcFN0YXRlLmxvbmdpdHVkZSA9IGNlbnRlckFuZFpvb20uY2VudGVyWzBdO1xuICAgICAgICAgIG5ld01hcFN0YXRlLmxhdGl0dWRlID0gY2VudGVyQW5kWm9vbS5jZW50ZXJbMV07XG4gICAgICAgICAgbmV3TWFwU3RhdGUuem9vbSA9IHpvb20gKyBOdW1iZXIoTWF0aC5sb2cyKHNjYWxlKSB8fCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXBQcm9wcyA9IHtcbiAgICAgICAgLi4ubWFwRmllbGRzLFxuICAgICAgICBtYXBTdHlsZTogdGhpcy5zY2FsZWRNYXBTdHlsZVNlbGVjdG9yKHRoaXMucHJvcHMpLFxuXG4gICAgICAgIC8vIG92ZXJyaWRlIHZpZXdwb3J0IGJhc2VkIG9uIGV4cG9ydCBzZXR0aW5nc1xuICAgICAgICBtYXBTdGF0ZTogbmV3TWFwU3RhdGUsXG4gICAgICAgIG1hcENvbnRyb2xzOiB7XG4gICAgICAgICAgLy8gb3ZlcnJpZGUgbWFwIGxlZ2VuZCB2aXNpYmlsaXR5XG4gICAgICAgICAgbWFwTGVnZW5kOiB7XG4gICAgICAgICAgICBzaG93OiBsZWdlbmQsXG4gICAgICAgICAgICBhY3RpdmU6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIE1hcENvbXBvbmVudDogU3RhdGljTWFwLFxuICAgICAgICBvbk1hcFJlbmRlcjogdGhpcy5fb25NYXBSZW5kZXIsXG4gICAgICAgIGlzRXhwb3J0OiB0cnVlLFxuICAgICAgICBkZWNrR2xQcm9wc1xuICAgICAgfTtcblxuICAgICAgY29uc3QgbWFwQ29udGFpbmVycyA9ICFpc1NwbGl0ID8gKFxuICAgICAgICA8TWFwQ29udGFpbmVyIGluZGV4PXswfSB7Li4ubWFwUHJvcHN9IC8+XG4gICAgICApIDogKFxuICAgICAgICBzcGxpdE1hcHMubWFwKChzZXR0aW5ncywgaW5kZXgpID0+IChcbiAgICAgICAgICA8TWFwQ29udGFpbmVyXG4gICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgey4uLm1hcFByb3BzfVxuICAgICAgICAgICAgbWFwTGF5ZXJzPXtzcGxpdE1hcHNbaW5kZXhdLmxheWVyc31cbiAgICAgICAgICAvPlxuICAgICAgICApKVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZFBsb3RDb250YWluZXIgY2xhc3NOYW1lPVwiZXhwb3J0LW1hcC1pbnN0YW5jZVwiPlxuICAgICAgICAgIDxTdHlsZWRNYXBDb250YWluZXIgcmVmPXt0aGlzLnBsb3R0aW5nQXJlYVJlZn0gd2lkdGg9e3NpemUud2lkdGh9IGhlaWdodD17c2l6ZS5oZWlnaHR9PlxuICAgICAgICAgICAge21hcENvbnRhaW5lcnN9XG4gICAgICAgICAgPC9TdHlsZWRNYXBDb250YWluZXI+XG4gICAgICAgIDwvU3R5bGVkUGxvdENvbnRhaW5lcj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgUGxvdENvbnRhaW5lci5wcm9wc1R5cGVzID0gcHJvcFR5cGVzO1xuICByZXR1cm4gUGxvdENvbnRhaW5lcjtcbn1cbiJdfQ==