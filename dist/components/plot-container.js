"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PlotContainerFactory;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  .mapboxgl-ctrl-bottom-left,\n  .mapboxgl-ctrl-bottom-right {\n    display: none;\n  }\n\n  position: absolute;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var propTypes = {
  width: _propTypes["default"].number.isRequired,
  height: _propTypes["default"].number.isRequired,
  exportImageSetting: _propTypes["default"].object.isRequired,
  addNotification: _propTypes["default"].func.isRequired,
  mapFields: _propTypes["default"].object.isRequired
};
PlotContainerFactory.deps = [_mapContainer["default"]]; // Remove mapbox logo in exported map, because it contains non-ascii characters

var StyledPlotContainer = _styledComponents["default"].div(_templateObject());

var deckGlProps = {
  glOptions: {
    preserveDrawingBuffer: true,
    useDevicePixels: false
  }
};

function PlotContainerFactory(MapContainer) {
  var PlotContainer =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(PlotContainer, _Component);

    function PlotContainer(_props) {
      var _this;

      (0, _classCallCheck2["default"])(this, PlotContainer);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PlotContainer).call(this, _props));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "plottingAreaRef", (0, _react.createRef)());
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
        return _objectSpread({}, mapStyle, {
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
          _this.props.startExportingImage();

          var filter = function filter(node) {
            return node.className !== 'mapboxgl-control-container';
          };

          (0, _exportUtils.convertToPng)(_this.plottingAreaRef.current, {
            filter: filter
          }).then(_this.props.setExportImageDataUri)["catch"](function (err) {
            _this.props.setExportImageError(err);

            _this.props.addNotification((0, _notificationsUtils.exportImageError)({
              err: err
            }));
          });
        }
      });
      _this._onMapRender = (0, _lodash["default"])(_this._onMapRender, 500);
      return _this;
    }

    (0, _createClass2["default"])(PlotContainer, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.props.startExportingImage();
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
        var isSplit = splitMaps && splitMaps.length > 1;
        var size = {
          width: imageSize.imageW || 1,
          height: imageSize.imageH || 1
        };
        var scale = this.mapScaleSelector(this.props);

        var mapProps = _objectSpread({}, mapFields, {
          mapStyle: this.scaledMapStyleSelector(this.props),
          // override viewport based on export settings
          mapState: _objectSpread({}, mapFields.mapState, {
            width: size.width / (isSplit ? 2 : 1),
            height: size.height,
            zoom: mapFields.mapState.zoom + (Math.log2(scale) || 0)
          }),
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

        var mapContainers = !isSplit ? _react["default"].createElement(MapContainer, (0, _extends2["default"])({
          index: 0
        }, mapProps)) : splitMaps.map(function (settings, index) {
          return _react["default"].createElement(MapContainer, (0, _extends2["default"])({
            key: index,
            index: index
          }, mapProps, {
            mapLayers: splitMaps[index].layers
          }));
        });
        return _react["default"].createElement(StyledPlotContainer, {
          style: {
            position: 'absolute',
            top: -9999,
            left: -9999
          },
          className: "export-map-instance"
        }, _react["default"].createElement("div", {
          ref: this.plottingAreaRef,
          style: {
            width: "".concat(size.width, "px"),
            height: "".concat(size.height, "px"),
            display: 'flex'
          }
        }, mapContainers));
      }
    }]);
    return PlotContainer;
  }(_react.Component);

  PlotContainer.propsTypes = propTypes;
  return PlotContainer;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL3Bsb3QtY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbInByb3BUeXBlcyIsIndpZHRoIiwiUHJvcFR5cGVzIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImhlaWdodCIsImV4cG9ydEltYWdlU2V0dGluZyIsIm9iamVjdCIsImFkZE5vdGlmaWNhdGlvbiIsImZ1bmMiLCJtYXBGaWVsZHMiLCJQbG90Q29udGFpbmVyRmFjdG9yeSIsImRlcHMiLCJNYXBDb250YWluZXJGYWN0b3J5IiwiU3R5bGVkUGxvdENvbnRhaW5lciIsInN0eWxlZCIsImRpdiIsImRlY2tHbFByb3BzIiwiZ2xPcHRpb25zIiwicHJlc2VydmVEcmF3aW5nQnVmZmVyIiwidXNlRGV2aWNlUGl4ZWxzIiwiTWFwQ29udGFpbmVyIiwiUGxvdENvbnRhaW5lciIsInByb3BzIiwibWFwU3R5bGUiLCJpbWFnZVNpemUiLCJtYXBTdGF0ZSIsInNjYWxlIiwiaW1hZ2VXIiwiaW1hZ2VIIiwiaXNTcGxpdCIsIm1hcFN0eWxlU2VsZWN0b3IiLCJtYXBTY2FsZVNlbGVjdG9yIiwiYm90dG9tTWFwU3R5bGUiLCJ0b3BNYXBTdHlsZSIsIm1hcCIsImlzU3R5bGVMb2FkZWQiLCJfcmV0cmlldmVOZXdTY3JlZW5zaG90IiwicGxvdHRpbmdBcmVhUmVmIiwiY3VycmVudCIsInN0YXJ0RXhwb3J0aW5nSW1hZ2UiLCJmaWx0ZXIiLCJub2RlIiwiY2xhc3NOYW1lIiwidGhlbiIsInNldEV4cG9ydEltYWdlRGF0YVVyaSIsImVyciIsInNldEV4cG9ydEltYWdlRXJyb3IiLCJfb25NYXBSZW5kZXIiLCJwcmV2UHJvcHMiLCJjaGVja3MiLCJzaG91bGRSZXRyaWV2ZVNjcmVlbnNob3QiLCJzb21lIiwiaXRlbSIsInNwbGl0TWFwcyIsImxlZ2VuZCIsImxlbmd0aCIsInNpemUiLCJtYXBQcm9wcyIsInNjYWxlZE1hcFN0eWxlU2VsZWN0b3IiLCJ6b29tIiwiTWF0aCIsImxvZzIiLCJtYXBDb250cm9scyIsIm1hcExlZ2VuZCIsInNob3ciLCJhY3RpdmUiLCJNYXBDb21wb25lbnQiLCJTdGF0aWNNYXAiLCJvbk1hcFJlbmRlciIsImlzRXhwb3J0IiwibWFwQ29udGFpbmVycyIsInNldHRpbmdzIiwiaW5kZXgiLCJsYXllcnMiLCJwb3NpdGlvbiIsInRvcCIsImxlZnQiLCJkaXNwbGF5IiwiQ29tcG9uZW50IiwicHJvcHNUeXBlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxJQUFNQSxTQUFTLEdBQUc7QUFDaEJDLEVBQUFBLEtBQUssRUFBRUMsc0JBQVVDLE1BQVYsQ0FBaUJDLFVBRFI7QUFFaEJDLEVBQUFBLE1BQU0sRUFBRUgsc0JBQVVDLE1BQVYsQ0FBaUJDLFVBRlQ7QUFHaEJFLEVBQUFBLGtCQUFrQixFQUFFSixzQkFBVUssTUFBVixDQUFpQkgsVUFIckI7QUFJaEJJLEVBQUFBLGVBQWUsRUFBRU4sc0JBQVVPLElBQVYsQ0FBZUwsVUFKaEI7QUFLaEJNLEVBQUFBLFNBQVMsRUFBRVIsc0JBQVVLLE1BQVYsQ0FBaUJIO0FBTFosQ0FBbEI7QUFRQU8sb0JBQW9CLENBQUNDLElBQXJCLEdBQTRCLENBQUNDLHdCQUFELENBQTVCLEMsQ0FFQTs7QUFDQSxJQUFNQyxtQkFBbUIsR0FBR0MsNkJBQU9DLEdBQVYsbUJBQXpCOztBQVNBLElBQU1DLFdBQVcsR0FBRztBQUNsQkMsRUFBQUEsU0FBUyxFQUFFO0FBQ1RDLElBQUFBLHFCQUFxQixFQUFFLElBRGQ7QUFFVEMsSUFBQUEsZUFBZSxFQUFFO0FBRlI7QUFETyxDQUFwQjs7QUFPZSxTQUFTVCxvQkFBVCxDQUE4QlUsWUFBOUIsRUFBNEM7QUFBQSxNQUNuREMsYUFEbUQ7QUFBQTtBQUFBO0FBQUE7O0FBRXZELDJCQUFZQyxNQUFaLEVBQW1CO0FBQUE7O0FBQUE7QUFD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QSxPQUFPLEVBQUU7QUFISjtBQUZULFdBUUdQLGFBUkgsQ0FKRixDQURGO0FBaUJEO0FBeElzRDtBQUFBO0FBQUEsSUFDN0JRLGdCQUQ2Qjs7QUEySXpEekQsRUFBQUEsYUFBYSxDQUFDMEQsVUFBZCxHQUEyQmhGLFNBQTNCO0FBQ0EsU0FBT3NCLGFBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8vIGxpYnJhcmllc1xuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50LCBjcmVhdGVSZWZ9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7U3RhdGljTWFwfSBmcm9tICdyZWFjdC1tYXAtZ2wnO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ2xvZGFzaC5kZWJvdW5jZSc7XG5pbXBvcnQge2V4cG9ydEltYWdlRXJyb3J9IGZyb20gJ3V0aWxzL25vdGlmaWNhdGlvbnMtdXRpbHMnO1xuaW1wb3J0IE1hcENvbnRhaW5lckZhY3RvcnkgZnJvbSAnLi9tYXAtY29udGFpbmVyJztcbmltcG9ydCB7Y29udmVydFRvUG5nfSBmcm9tICd1dGlscy9leHBvcnQtdXRpbHMnO1xuaW1wb3J0IHtzY2FsZU1hcFN0eWxlQnlSZXNvbHV0aW9ufSBmcm9tICd1dGlscy9tYXAtc3R5bGUtdXRpbHMvbWFwYm94LWdsLXN0eWxlLWVkaXRvcic7XG5pbXBvcnQge2dldFNjYWxlRnJvbUltYWdlU2l6ZX0gZnJvbSAndXRpbHMvZXhwb3J0LXV0aWxzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgZXhwb3J0SW1hZ2VTZXR0aW5nOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGFkZE5vdGlmaWNhdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgbWFwRmllbGRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn07XG5cblBsb3RDb250YWluZXJGYWN0b3J5LmRlcHMgPSBbTWFwQ29udGFpbmVyRmFjdG9yeV07XG5cbi8vIFJlbW92ZSBtYXBib3ggbG9nbyBpbiBleHBvcnRlZCBtYXAsIGJlY2F1c2UgaXQgY29udGFpbnMgbm9uLWFzY2lpIGNoYXJhY3RlcnNcbmNvbnN0IFN0eWxlZFBsb3RDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICAubWFwYm94Z2wtY3RybC1ib3R0b20tbGVmdCxcbiAgLm1hcGJveGdsLWN0cmwtYm90dG9tLXJpZ2h0IHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG5cbiAgcG9zaXRpb246IGFic29sdXRlO1xuYDtcblxuY29uc3QgZGVja0dsUHJvcHMgPSB7XG4gIGdsT3B0aW9uczoge1xuICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZSxcbiAgICB1c2VEZXZpY2VQaXhlbHM6IGZhbHNlXG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBsb3RDb250YWluZXJGYWN0b3J5KE1hcENvbnRhaW5lcikge1xuICBjbGFzcyBQbG90Q29udGFpbmVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgdGhpcy5fb25NYXBSZW5kZXIgPSBkZWJvdW5jZSh0aGlzLl9vbk1hcFJlbmRlciwgNTAwKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIHRoaXMucHJvcHMuc3RhcnRFeHBvcnRpbmdJbWFnZSgpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICAgIC8vIHJlLWZldGNoIHRoZSBuZXcgc2NyZWVuc2hvdCBvbmx5IHdoZW4gcmF0aW8gbGVnZW5kIG9yIHJlc29sdXRpb24gY2hhbmdlc1xuICAgICAgY29uc3QgY2hlY2tzID0gWydyYXRpbycsICdyZXNvbHV0aW9uJywgJ2xlZ2VuZCddO1xuICAgICAgY29uc3Qgc2hvdWxkUmV0cmlldmVTY3JlZW5zaG90ID0gY2hlY2tzLnNvbWUoXG4gICAgICAgIGl0ZW0gPT4gdGhpcy5wcm9wcy5leHBvcnRJbWFnZVNldHRpbmdbaXRlbV0gIT09IHByZXZQcm9wcy5leHBvcnRJbWFnZVNldHRpbmdbaXRlbV1cbiAgICAgICk7XG4gICAgICBpZiAoc2hvdWxkUmV0cmlldmVTY3JlZW5zaG90KSB7XG4gICAgICAgIHRoaXMuX3JldHJpZXZlTmV3U2NyZWVuc2hvdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBsb3R0aW5nQXJlYVJlZiA9IGNyZWF0ZVJlZigpO1xuXG4gICAgbWFwU3R5bGVTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLm1hcEZpZWxkcy5tYXBTdHlsZTtcbiAgICBtYXBTY2FsZVNlbGVjdG9yID0gcHJvcHMgPT4ge1xuICAgICAgY29uc3Qge2ltYWdlU2l6ZX0gPSBwcm9wcy5leHBvcnRJbWFnZVNldHRpbmc7XG4gICAgICBjb25zdCB7bWFwU3RhdGV9ID0gcHJvcHMubWFwRmllbGRzO1xuICAgICAgaWYgKGltYWdlU2l6ZS5zY2FsZSkge1xuICAgICAgICByZXR1cm4gaW1hZ2VTaXplLnNjYWxlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzY2FsZSA9IGdldFNjYWxlRnJvbUltYWdlU2l6ZShcbiAgICAgICAgaW1hZ2VTaXplLmltYWdlVyxcbiAgICAgICAgaW1hZ2VTaXplLmltYWdlSCxcbiAgICAgICAgbWFwU3RhdGUud2lkdGggKiAobWFwU3RhdGUuaXNTcGxpdCA/IDIgOiAxKSxcbiAgICAgICAgbWFwU3RhdGUuaGVpZ2h0XG4gICAgICApO1xuXG4gICAgICByZXR1cm4gc2NhbGUgPiAwID8gc2NhbGUgOiAxO1xuICAgIH07XG5cbiAgICBzY2FsZWRNYXBTdHlsZVNlbGVjdG9yID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgICB0aGlzLm1hcFN0eWxlU2VsZWN0b3IsXG4gICAgICB0aGlzLm1hcFNjYWxlU2VsZWN0b3IsXG4gICAgICAobWFwU3R5bGUsIHNjYWxlKSA9PiAoe1xuICAgICAgICAuLi5tYXBTdHlsZSxcbiAgICAgICAgYm90dG9tTWFwU3R5bGU6IHNjYWxlTWFwU3R5bGVCeVJlc29sdXRpb24obWFwU3R5bGUuYm90dG9tTWFwU3R5bGUsIHNjYWxlKSxcbiAgICAgICAgdG9wTWFwU3R5bGU6IHNjYWxlTWFwU3R5bGVCeVJlc29sdXRpb24obWFwU3R5bGUudG9wTWFwU3R5bGUsIHNjYWxlKVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgX29uTWFwUmVuZGVyID0gbWFwID0+IHtcbiAgICAgIGlmIChtYXAuaXNTdHlsZUxvYWRlZCgpKSB7XG4gICAgICAgIHRoaXMuX3JldHJpZXZlTmV3U2NyZWVuc2hvdCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfcmV0cmlldmVOZXdTY3JlZW5zaG90ID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMucGxvdHRpbmdBcmVhUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5zdGFydEV4cG9ydGluZ0ltYWdlKCk7XG4gICAgICAgIGNvbnN0IGZpbHRlciA9IG5vZGUgPT4gbm9kZS5jbGFzc05hbWUgIT09ICdtYXBib3hnbC1jb250cm9sLWNvbnRhaW5lcic7XG5cbiAgICAgICAgY29udmVydFRvUG5nKHRoaXMucGxvdHRpbmdBcmVhUmVmLmN1cnJlbnQsIHtmaWx0ZXJ9KVxuICAgICAgICAgIC50aGVuKHRoaXMucHJvcHMuc2V0RXhwb3J0SW1hZ2VEYXRhVXJpKVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5zZXRFeHBvcnRJbWFnZUVycm9yKGVycik7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmFkZE5vdGlmaWNhdGlvbihleHBvcnRJbWFnZUVycm9yKHtlcnJ9KSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtleHBvcnRJbWFnZVNldHRpbmcsIG1hcEZpZWxkcywgc3BsaXRNYXBzfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCB7aW1hZ2VTaXplID0ge30sIGxlZ2VuZH0gPSBleHBvcnRJbWFnZVNldHRpbmc7XG4gICAgICBjb25zdCBpc1NwbGl0ID0gc3BsaXRNYXBzICYmIHNwbGl0TWFwcy5sZW5ndGggPiAxO1xuXG4gICAgICBjb25zdCBzaXplID0ge1xuICAgICAgICB3aWR0aDogaW1hZ2VTaXplLmltYWdlVyB8fCAxLFxuICAgICAgICBoZWlnaHQ6IGltYWdlU2l6ZS5pbWFnZUggfHwgMVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5tYXBTY2FsZVNlbGVjdG9yKHRoaXMucHJvcHMpO1xuICAgICAgY29uc3QgbWFwUHJvcHMgPSB7XG4gICAgICAgIC4uLm1hcEZpZWxkcyxcbiAgICAgICAgbWFwU3R5bGU6IHRoaXMuc2NhbGVkTWFwU3R5bGVTZWxlY3Rvcih0aGlzLnByb3BzKSxcblxuICAgICAgICAvLyBvdmVycmlkZSB2aWV3cG9ydCBiYXNlZCBvbiBleHBvcnQgc2V0dGluZ3NcbiAgICAgICAgbWFwU3RhdGU6IHtcbiAgICAgICAgICAuLi5tYXBGaWVsZHMubWFwU3RhdGUsXG4gICAgICAgICAgd2lkdGg6IHNpemUud2lkdGggLyAoaXNTcGxpdCA/IDIgOiAxKSxcbiAgICAgICAgICBoZWlnaHQ6IHNpemUuaGVpZ2h0LFxuICAgICAgICAgIHpvb206IG1hcEZpZWxkcy5tYXBTdGF0ZS56b29tICsgKE1hdGgubG9nMihzY2FsZSkgfHwgMClcbiAgICAgICAgfSxcbiAgICAgICAgbWFwQ29udHJvbHM6IHtcbiAgICAgICAgICAvLyBvdmVycmlkZSBtYXAgbGVnZW5kIHZpc2liaWxpdHlcbiAgICAgICAgICBtYXBMZWdlbmQ6IHtcbiAgICAgICAgICAgIHNob3c6IGxlZ2VuZCxcbiAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgTWFwQ29tcG9uZW50OiBTdGF0aWNNYXAsXG4gICAgICAgIG9uTWFwUmVuZGVyOiB0aGlzLl9vbk1hcFJlbmRlcixcbiAgICAgICAgaXNFeHBvcnQ6IHRydWUsXG4gICAgICAgIGRlY2tHbFByb3BzXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBtYXBDb250YWluZXJzID0gIWlzU3BsaXQgPyAoXG4gICAgICAgIDxNYXBDb250YWluZXIgaW5kZXg9ezB9IHsuLi5tYXBQcm9wc30gLz5cbiAgICAgICkgOiAoXG4gICAgICAgIHNwbGl0TWFwcy5tYXAoKHNldHRpbmdzLCBpbmRleCkgPT4gKFxuICAgICAgICAgIDxNYXBDb250YWluZXJcbiAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICB7Li4ubWFwUHJvcHN9XG4gICAgICAgICAgICBtYXBMYXllcnM9e3NwbGl0TWFwc1tpbmRleF0ubGF5ZXJzfVxuICAgICAgICAgIC8+XG4gICAgICAgICkpXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkUGxvdENvbnRhaW5lclxuICAgICAgICAgIHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogLTk5OTksIGxlZnQ6IC05OTk5fX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJleHBvcnQtbWFwLWluc3RhbmNlXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHJlZj17dGhpcy5wbG90dGluZ0FyZWFSZWZ9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogYCR7c2l6ZS53aWR0aH1weGAsXG4gICAgICAgICAgICAgIGhlaWdodDogYCR7c2l6ZS5oZWlnaHR9cHhgLFxuICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCdcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge21hcENvbnRhaW5lcnN9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvU3R5bGVkUGxvdENvbnRhaW5lcj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgUGxvdENvbnRhaW5lci5wcm9wc1R5cGVzID0gcHJvcFR5cGVzO1xuICByZXR1cm4gUGxvdENvbnRhaW5lcjtcbn1cbiJdfQ==