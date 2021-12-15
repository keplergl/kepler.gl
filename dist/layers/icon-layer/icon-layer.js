"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.pointVisConfigs = exports.iconOptionalColumns = exports.iconRequiredColumns = exports.iconAccessor = exports.iconPosAccessor = exports.SVG_ICON_URL = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _window = _interopRequireDefault(require("global/window"));

var _extensions = require("@deck.gl/extensions");

var _svgIconLayer = _interopRequireDefault(require("../../deckgl-layers/svg-icon-layer/svg-icon-layer"));

var _iconLayerIcon = _interopRequireDefault(require("./icon-layer-icon"));

var _defaultSettings = require("../../constants/default-settings");

var _iconInfoModal = _interopRequireDefault(require("./icon-info-modal"));

var _baseLayer = _interopRequireDefault(require("../base-layer"));

var _layerTextLabel = require("../layer-text-label");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var brushingExtension = new _extensions.BrushingExtension();
var SVG_ICON_URL = "".concat(_defaultSettings.CLOUDFRONT, "/icons/svg-icons.json");
exports.SVG_ICON_URL = SVG_ICON_URL;

var iconPosAccessor = function iconPosAccessor(_ref) {
  var lat = _ref.lat,
      lng = _ref.lng,
      altitude = _ref.altitude;
  return function (d) {
    return [d.data[lng.fieldIdx], d.data[lat.fieldIdx], (altitude === null || altitude === void 0 ? void 0 : altitude.fieldIdx) > -1 ? d.data[altitude.fieldIdx] : 0];
  };
};

exports.iconPosAccessor = iconPosAccessor;

var iconAccessor = function iconAccessor(_ref2) {
  var icon = _ref2.icon;
  return function (d) {
    return d.data[icon.fieldIdx];
  };
};

exports.iconAccessor = iconAccessor;
var iconRequiredColumns = ['lat', 'lng', 'icon'];
exports.iconRequiredColumns = iconRequiredColumns;
var iconOptionalColumns = ['altitude'];
exports.iconOptionalColumns = iconOptionalColumns;
var pointVisConfigs = {
  radius: 'radius',
  fixedRadius: 'fixedRadius',
  opacity: 'opacity',
  colorRange: 'colorRange',
  radiusRange: 'radiusRange'
};
exports.pointVisConfigs = pointVisConfigs;

function flatterIconPositions(icon) {
  // had to flip y, since @luma modal has changed
  return icon.mesh.cells.reduce(function (prev, cell) {
    cell.forEach(function (p) {
      prev.push.apply(prev, [icon.mesh.positions[p][0], -icon.mesh.positions[p][1], icon.mesh.positions[p][2]]);
    });
    return prev;
  }, []);
}

var IconLayer = /*#__PURE__*/function (_Layer) {
  (0, _inherits2["default"])(IconLayer, _Layer);

  var _super = _createSuper(IconLayer);

  function IconLayer() {
    var _this;

    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, IconLayer);
    _this = _super.call(this, props);

    _this.registerVisConfig(pointVisConfigs);

    _this.getPositionAccessor = function () {
      return iconPosAccessor(_this.config.columns);
    };

    _this.getIconAccessor = function () {
      return iconAccessor(_this.config.columns);
    }; // prepare layer info modal


    _this._layerInfoModal = (0, _iconInfoModal["default"])();
    _this.iconGeometry = props.iconGeometry || null;

    _this.getSvgIcons();

    return _this;
  }

  (0, _createClass2["default"])(IconLayer, [{
    key: "type",
    get: function get() {
      return 'icon';
    }
  }, {
    key: "requiredLayerColumns",
    get: function get() {
      return iconRequiredColumns;
    }
  }, {
    key: "optionalColumns",
    get: function get() {
      return iconOptionalColumns;
    }
  }, {
    key: "columnPairs",
    get: function get() {
      return this.defaultPointColumnPairs;
    }
  }, {
    key: "layerIcon",
    get: function get() {
      return _iconLayerIcon["default"];
    }
  }, {
    key: "visualChannels",
    get: function get() {
      return {
        color: _objectSpread(_objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(IconLayer.prototype), "visualChannels", this).color), {}, {
          accessor: 'getFillColor',
          defaultValue: function defaultValue(config) {
            return config.color;
          }
        }),
        size: _objectSpread(_objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(IconLayer.prototype), "visualChannels", this).size), {}, {
          property: 'radius',
          range: 'radiusRange',
          channelScaleType: 'radius',
          accessor: 'getRadius',
          defaultValue: 1
        })
      };
    }
  }, {
    key: "layerInfoModal",
    get: function get() {
      return {
        id: 'iconInfo',
        template: this._layerInfoModal,
        modalProps: {
          title: 'modal.iconInfo.title'
        }
      };
    }
  }, {
    key: "getSvgIcons",
    value: function getSvgIcons() {
      var _this2 = this;

      var fetchConfig = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      };

      if (_window["default"].fetch) {
        _window["default"].fetch(SVG_ICON_URL, fetchConfig).then(function (response) {
          return response.json();
        }).then(function () {
          var parsed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var _parsed$svgIcons = parsed.svgIcons,
              svgIcons = _parsed$svgIcons === void 0 ? [] : _parsed$svgIcons;
          _this2.iconGeometry = svgIcons.reduce(function (accu, curr) {
            return _objectSpread(_objectSpread({}, accu), {}, (0, _defineProperty2["default"])({}, curr.id, flatterIconPositions(curr)));
          }, {});
          _this2._layerInfoModal = (0, _iconInfoModal["default"])(svgIcons);
        });
      }
    }
  }, {
    key: "calculateDataAttribute",
    value: function calculateDataAttribute(_ref3, getPosition) {
      var allData = _ref3.allData,
          filteredIndex = _ref3.filteredIndex;
      var getIcon = this.getIconAccessor();
      var data = [];

      for (var i = 0; i < filteredIndex.length; i++) {
        var index = filteredIndex[i];
        var pos = getPosition({
          data: allData[index]
        });
        var icon = getIcon({
          data: allData[index]
        }); // if doesn't have point lat or lng, do not add the point
        // deck.gl can't handle position = null

        if (pos.every(Number.isFinite) && typeof icon === 'string') {
          data.push({
            index: index,
            icon: icon,
            data: allData[index]
          });
        }
      }

      return data;
    }
  }, {
    key: "formatLayerData",
    value: function formatLayerData(datasets, oldLayerData) {
      var textLabel = this.config.textLabel;
      var getPosition = this.getPositionAccessor();
      var gpuFilter = datasets[this.config.dataId].gpuFilter;

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data,
          triggerChanged = _this$updateData.triggerChanged; // get all distinct characters in the text labels


      var textLabels = (0, _layerTextLabel.formatTextLabelData)({
        textLabel: textLabel,
        triggerChanged: triggerChanged,
        oldLayerData: oldLayerData,
        data: data
      });
      var accessors = this.getAttributeAccessors();
      return _objectSpread({
        data: data,
        getPosition: getPosition,
        getFilterValue: gpuFilter.filterValueAccessor(),
        textLabels: textLabels
      }, accessors);
    }
  }, {
    key: "updateLayerMeta",
    value: function updateLayerMeta(allData, getPosition) {
      var bounds = this.getPointsBounds(allData, function (d) {
        return getPosition({
          data: d
        });
      });
      this.updateMeta({
        bounds: bounds
      });
    }
  }, {
    key: "renderLayer",
    value: function renderLayer(opts) {
      var _this$config$columns$,
          _this3 = this;

      var data = opts.data,
          gpuFilter = opts.gpuFilter,
          objectHovered = opts.objectHovered,
          mapState = opts.mapState,
          interactionConfig = opts.interactionConfig;
      var radiusScale = this.getRadiusScaleByZoom(mapState);

      var layerProps = _objectSpread({
        radiusScale: radiusScale
      }, this.config.visConfig.fixedRadius ? {} : {
        radiusMaxPixels: 500
      });

      var updateTriggers = _objectSpread({
        getPosition: this.config.columns,
        getFilterValue: gpuFilter.filterValueUpdateTriggers
      }, this.getVisualChannelUpdateTriggers());

      var defaultLayerProps = this.getDefaultDeckLayerProps(opts);
      var brushingProps = this.getBrushingExtensionProps(interactionConfig);
      var getPixelOffset = (0, _layerTextLabel.getTextOffsetByRadius)(radiusScale, data.getRadius, mapState);
      var extensions = [].concat((0, _toConsumableArray2["default"])(defaultLayerProps.extensions), [brushingExtension]); // shared Props between layer and label layer

      var sharedProps = _objectSpread({
        getFilterValue: data.getFilterValue,
        extensions: extensions,
        filterRange: defaultLayerProps.filterRange
      }, brushingProps);

      var labelLayers = (0, _toConsumableArray2["default"])(this.renderTextLabelLayer({
        getPosition: data.getPosition,
        sharedProps: sharedProps,
        getPixelOffset: getPixelOffset,
        updateTriggers: updateTriggers
      }, opts));
      var hoveredObject = this.hasHoveredObject(objectHovered);
      var parameters = {
        // icons will be flat on the map when the altitude column is not used
        depthTest: ((_this$config$columns$ = this.config.columns.altitude) === null || _this$config$columns$ === void 0 ? void 0 : _this$config$columns$.fieldIdx) > -1
      };
      return !this.iconGeometry ? [] : [new _svgIconLayer["default"](_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, defaultLayerProps), brushingProps), layerProps), data), {}, {
        parameters: parameters,
        getIconGeometry: function getIconGeometry(id) {
          return _this3.iconGeometry[id];
        },
        // update triggers
        updateTriggers: updateTriggers,
        extensions: extensions
      }))].concat((0, _toConsumableArray2["default"])(hoveredObject ? [new _svgIconLayer["default"](_objectSpread(_objectSpread(_objectSpread({}, this.getDefaultHoverLayerProps()), layerProps), {}, {
        data: [hoveredObject],
        parameters: parameters,
        getPosition: data.getPosition,
        getRadius: data.getRadius,
        getFillColor: this.config.highlightColor,
        getIconGeometry: function getIconGeometry(id) {
          return _this3.iconGeometry[id];
        }
      }))] : []), (0, _toConsumableArray2["default"])(labelLayers));
    }
  }], [{
    key: "findDefaultLayerProps",
    value: function findDefaultLayerProps(_ref4) {
      var _ref4$fieldPairs = _ref4.fieldPairs,
          fieldPairs = _ref4$fieldPairs === void 0 ? [] : _ref4$fieldPairs,
          _ref4$fields = _ref4.fields,
          fields = _ref4$fields === void 0 ? [] : _ref4$fields;
      var notFound = {
        props: []
      };

      if (!fieldPairs.length || !fields.length) {
        return notFound;
      }

      var iconFields = fields.filter(function (_ref5) {
        var name = _ref5.name;
        return name.replace(/[_,.]+/g, ' ').trim().split(' ').some(function (seg) {
          return _defaultSettings.ICON_FIELDS.icon.some(function (t) {
            return t.includes(seg);
          });
        });
      });

      if (!iconFields.length) {
        return notFound;
      } // create icon layers for first point pair


      var ptPair = fieldPairs[0];
      var props = iconFields.map(function (iconField) {
        return {
          label: iconField.name.replace(/[_,.]+/g, ' ').trim(),
          columns: {
            lat: ptPair.pair.lat,
            lng: ptPair.pair.lng,
            icon: {
              value: iconField.name,
              fieldIdx: iconField.fieldIdx
            }
          },
          isVisible: true
        };
      });
      return {
        props: props
      };
    }
  }]);
  return IconLayer;
}(_baseLayer["default"]);

exports["default"] = IconLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvaWNvbi1sYXllci9pY29uLWxheWVyLmpzIl0sIm5hbWVzIjpbImJydXNoaW5nRXh0ZW5zaW9uIiwiQnJ1c2hpbmdFeHRlbnNpb24iLCJTVkdfSUNPTl9VUkwiLCJDTE9VREZST05UIiwiaWNvblBvc0FjY2Vzc29yIiwibGF0IiwibG5nIiwiYWx0aXR1ZGUiLCJkIiwiZGF0YSIsImZpZWxkSWR4IiwiaWNvbkFjY2Vzc29yIiwiaWNvbiIsImljb25SZXF1aXJlZENvbHVtbnMiLCJpY29uT3B0aW9uYWxDb2x1bW5zIiwicG9pbnRWaXNDb25maWdzIiwicmFkaXVzIiwiZml4ZWRSYWRpdXMiLCJvcGFjaXR5IiwiY29sb3JSYW5nZSIsInJhZGl1c1JhbmdlIiwiZmxhdHRlckljb25Qb3NpdGlvbnMiLCJtZXNoIiwiY2VsbHMiLCJyZWR1Y2UiLCJwcmV2IiwiY2VsbCIsImZvckVhY2giLCJwIiwicHVzaCIsInBvc2l0aW9ucyIsIkljb25MYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiY29uZmlnIiwiY29sdW1ucyIsImdldEljb25BY2Nlc3NvciIsIl9sYXllckluZm9Nb2RhbCIsImljb25HZW9tZXRyeSIsImdldFN2Z0ljb25zIiwiZGVmYXVsdFBvaW50Q29sdW1uUGFpcnMiLCJJY29uTGF5ZXJJY29uIiwiY29sb3IiLCJhY2Nlc3NvciIsImRlZmF1bHRWYWx1ZSIsInNpemUiLCJwcm9wZXJ0eSIsInJhbmdlIiwiY2hhbm5lbFNjYWxlVHlwZSIsImlkIiwidGVtcGxhdGUiLCJtb2RhbFByb3BzIiwidGl0bGUiLCJmZXRjaENvbmZpZyIsIm1ldGhvZCIsIm1vZGUiLCJjYWNoZSIsIndpbmRvdyIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsInBhcnNlZCIsInN2Z0ljb25zIiwiYWNjdSIsImN1cnIiLCJnZXRQb3NpdGlvbiIsImFsbERhdGEiLCJmaWx0ZXJlZEluZGV4IiwiZ2V0SWNvbiIsImkiLCJsZW5ndGgiLCJpbmRleCIsInBvcyIsImV2ZXJ5IiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJkYXRhc2V0cyIsIm9sZExheWVyRGF0YSIsInRleHRMYWJlbCIsImdwdUZpbHRlciIsImRhdGFJZCIsInVwZGF0ZURhdGEiLCJ0cmlnZ2VyQ2hhbmdlZCIsInRleHRMYWJlbHMiLCJhY2Nlc3NvcnMiLCJnZXRBdHRyaWJ1dGVBY2Nlc3NvcnMiLCJnZXRGaWx0ZXJWYWx1ZSIsImZpbHRlclZhbHVlQWNjZXNzb3IiLCJib3VuZHMiLCJnZXRQb2ludHNCb3VuZHMiLCJ1cGRhdGVNZXRhIiwib3B0cyIsIm9iamVjdEhvdmVyZWQiLCJtYXBTdGF0ZSIsImludGVyYWN0aW9uQ29uZmlnIiwicmFkaXVzU2NhbGUiLCJnZXRSYWRpdXNTY2FsZUJ5Wm9vbSIsImxheWVyUHJvcHMiLCJ2aXNDb25maWciLCJyYWRpdXNNYXhQaXhlbHMiLCJ1cGRhdGVUcmlnZ2VycyIsImZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnMiLCJnZXRWaXN1YWxDaGFubmVsVXBkYXRlVHJpZ2dlcnMiLCJkZWZhdWx0TGF5ZXJQcm9wcyIsImdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyIsImJydXNoaW5nUHJvcHMiLCJnZXRCcnVzaGluZ0V4dGVuc2lvblByb3BzIiwiZ2V0UGl4ZWxPZmZzZXQiLCJnZXRSYWRpdXMiLCJleHRlbnNpb25zIiwic2hhcmVkUHJvcHMiLCJmaWx0ZXJSYW5nZSIsImxhYmVsTGF5ZXJzIiwicmVuZGVyVGV4dExhYmVsTGF5ZXIiLCJob3ZlcmVkT2JqZWN0IiwiaGFzSG92ZXJlZE9iamVjdCIsInBhcmFtZXRlcnMiLCJkZXB0aFRlc3QiLCJTdmdJY29uTGF5ZXIiLCJnZXRJY29uR2VvbWV0cnkiLCJnZXREZWZhdWx0SG92ZXJMYXllclByb3BzIiwiZ2V0RmlsbENvbG9yIiwiaGlnaGxpZ2h0Q29sb3IiLCJmaWVsZFBhaXJzIiwiZmllbGRzIiwibm90Rm91bmQiLCJpY29uRmllbGRzIiwiZmlsdGVyIiwibmFtZSIsInJlcGxhY2UiLCJ0cmltIiwic3BsaXQiLCJzb21lIiwic2VnIiwiSUNPTl9GSUVMRFMiLCJ0IiwiaW5jbHVkZXMiLCJwdFBhaXIiLCJtYXAiLCJpY29uRmllbGQiLCJsYWJlbCIsInBhaXIiLCJ2YWx1ZSIsImlzVmlzaWJsZSIsIkxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsaUJBQWlCLEdBQUcsSUFBSUMsNkJBQUosRUFBMUI7QUFFTyxJQUFNQyxZQUFZLGFBQU1DLDJCQUFOLDBCQUFsQjs7O0FBRUEsSUFBTUMsZUFBZSxHQUFHLFNBQWxCQSxlQUFrQjtBQUFBLE1BQUVDLEdBQUYsUUFBRUEsR0FBRjtBQUFBLE1BQU9DLEdBQVAsUUFBT0EsR0FBUDtBQUFBLE1BQVlDLFFBQVosUUFBWUEsUUFBWjtBQUFBLFNBQTBCLFVBQUFDLENBQUM7QUFBQSxXQUFJLENBQzVEQSxDQUFDLENBQUNDLElBQUYsQ0FBT0gsR0FBRyxDQUFDSSxRQUFYLENBRDRELEVBRTVERixDQUFDLENBQUNDLElBQUYsQ0FBT0osR0FBRyxDQUFDSyxRQUFYLENBRjRELEVBRzVELENBQUFILFFBQVEsU0FBUixJQUFBQSxRQUFRLFdBQVIsWUFBQUEsUUFBUSxDQUFFRyxRQUFWLElBQXFCLENBQUMsQ0FBdEIsR0FBMEJGLENBQUMsQ0FBQ0MsSUFBRixDQUFPRixRQUFRLENBQUNHLFFBQWhCLENBQTFCLEdBQXNELENBSE0sQ0FBSjtBQUFBLEdBQTNCO0FBQUEsQ0FBeEI7Ozs7QUFLQSxJQUFNQyxZQUFZLEdBQUcsU0FBZkEsWUFBZTtBQUFBLE1BQUVDLElBQUYsU0FBRUEsSUFBRjtBQUFBLFNBQVksVUFBQUosQ0FBQztBQUFBLFdBQUlBLENBQUMsQ0FBQ0MsSUFBRixDQUFPRyxJQUFJLENBQUNGLFFBQVosQ0FBSjtBQUFBLEdBQWI7QUFBQSxDQUFyQjs7O0FBRUEsSUFBTUcsbUJBQW1CLEdBQUcsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLE1BQWYsQ0FBNUI7O0FBQ0EsSUFBTUMsbUJBQW1CLEdBQUcsQ0FBQyxVQUFELENBQTVCOztBQUVBLElBQU1DLGVBQWUsR0FBRztBQUM3QkMsRUFBQUEsTUFBTSxFQUFFLFFBRHFCO0FBRTdCQyxFQUFBQSxXQUFXLEVBQUUsYUFGZ0I7QUFHN0JDLEVBQUFBLE9BQU8sRUFBRSxTQUhvQjtBQUk3QkMsRUFBQUEsVUFBVSxFQUFFLFlBSmlCO0FBSzdCQyxFQUFBQSxXQUFXLEVBQUU7QUFMZ0IsQ0FBeEI7OztBQVFQLFNBQVNDLG9CQUFULENBQThCVCxJQUE5QixFQUFvQztBQUNsQztBQUNBLFNBQU9BLElBQUksQ0FBQ1UsSUFBTCxDQUFVQyxLQUFWLENBQWdCQyxNQUFoQixDQUF1QixVQUFDQyxJQUFELEVBQU9DLElBQVAsRUFBZ0I7QUFDNUNBLElBQUFBLElBQUksQ0FBQ0MsT0FBTCxDQUFhLFVBQUFDLENBQUMsRUFBSTtBQUNoQkgsTUFBQUEsSUFBSSxDQUFDSSxJQUFMLE9BQUFKLElBQUksRUFDQyxDQUFDYixJQUFJLENBQUNVLElBQUwsQ0FBVVEsU0FBVixDQUFvQkYsQ0FBcEIsRUFBdUIsQ0FBdkIsQ0FBRCxFQUE0QixDQUFDaEIsSUFBSSxDQUFDVSxJQUFMLENBQVVRLFNBQVYsQ0FBb0JGLENBQXBCLEVBQXVCLENBQXZCLENBQTdCLEVBQXdEaEIsSUFBSSxDQUFDVSxJQUFMLENBQVVRLFNBQVYsQ0FBb0JGLENBQXBCLEVBQXVCLENBQXZCLENBQXhELENBREQsQ0FBSjtBQUdELEtBSkQ7QUFLQSxXQUFPSCxJQUFQO0FBQ0QsR0FQTSxFQU9KLEVBUEksQ0FBUDtBQVFEOztJQUVvQk0sUzs7Ozs7QUFDbkIsdUJBQXdCO0FBQUE7O0FBQUEsUUFBWkMsS0FBWSx1RUFBSixFQUFJO0FBQUE7QUFDdEIsOEJBQU1BLEtBQU47O0FBRUEsVUFBS0MsaUJBQUwsQ0FBdUJsQixlQUF2Qjs7QUFDQSxVQUFLbUIsbUJBQUwsR0FBMkI7QUFBQSxhQUFNOUIsZUFBZSxDQUFDLE1BQUsrQixNQUFMLENBQVlDLE9BQWIsQ0FBckI7QUFBQSxLQUEzQjs7QUFDQSxVQUFLQyxlQUFMLEdBQXVCO0FBQUEsYUFBTTFCLFlBQVksQ0FBQyxNQUFLd0IsTUFBTCxDQUFZQyxPQUFiLENBQWxCO0FBQUEsS0FBdkIsQ0FMc0IsQ0FPdEI7OztBQUNBLFVBQUtFLGVBQUwsR0FBdUIsZ0NBQXZCO0FBQ0EsVUFBS0MsWUFBTCxHQUFvQlAsS0FBSyxDQUFDTyxZQUFOLElBQXNCLElBQTFDOztBQUNBLFVBQUtDLFdBQUw7O0FBVnNCO0FBV3ZCOzs7O1NBRUQsZUFBVztBQUNULGFBQU8sTUFBUDtBQUNEOzs7U0FFRCxlQUEyQjtBQUN6QixhQUFPM0IsbUJBQVA7QUFDRDs7O1NBRUQsZUFBc0I7QUFDcEIsYUFBT0MsbUJBQVA7QUFDRDs7O1NBRUQsZUFBa0I7QUFDaEIsYUFBTyxLQUFLMkIsdUJBQVo7QUFDRDs7O1NBRUQsZUFBZ0I7QUFDZCxhQUFPQyx5QkFBUDtBQUNEOzs7U0FFRCxlQUFxQjtBQUNuQixhQUFPO0FBQ0xDLFFBQUFBLEtBQUssa0NBQ0EscUdBQXFCQSxLQURyQjtBQUVIQyxVQUFBQSxRQUFRLEVBQUUsY0FGUDtBQUdIQyxVQUFBQSxZQUFZLEVBQUUsc0JBQUFWLE1BQU07QUFBQSxtQkFBSUEsTUFBTSxDQUFDUSxLQUFYO0FBQUE7QUFIakIsVUFEQTtBQU1MRyxRQUFBQSxJQUFJLGtDQUNDLHFHQUFxQkEsSUFEdEI7QUFFRkMsVUFBQUEsUUFBUSxFQUFFLFFBRlI7QUFHRkMsVUFBQUEsS0FBSyxFQUFFLGFBSEw7QUFJRkMsVUFBQUEsZ0JBQWdCLEVBQUUsUUFKaEI7QUFLRkwsVUFBQUEsUUFBUSxFQUFFLFdBTFI7QUFNRkMsVUFBQUEsWUFBWSxFQUFFO0FBTlo7QUFOQyxPQUFQO0FBZUQ7OztTQUVELGVBQXFCO0FBQ25CLGFBQU87QUFDTEssUUFBQUEsRUFBRSxFQUFFLFVBREM7QUFFTEMsUUFBQUEsUUFBUSxFQUFFLEtBQUtiLGVBRlY7QUFHTGMsUUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLFVBQUFBLEtBQUssRUFBRTtBQURHO0FBSFAsT0FBUDtBQU9EOzs7V0FFRCx1QkFBYztBQUFBOztBQUNaLFVBQU1DLFdBQVcsR0FBRztBQUNsQkMsUUFBQUEsTUFBTSxFQUFFLEtBRFU7QUFFbEJDLFFBQUFBLElBQUksRUFBRSxNQUZZO0FBR2xCQyxRQUFBQSxLQUFLLEVBQUU7QUFIVyxPQUFwQjs7QUFNQSxVQUFJQyxtQkFBT0MsS0FBWCxFQUFrQjtBQUNoQkQsMkJBQ0dDLEtBREgsQ0FDU3pELFlBRFQsRUFDdUJvRCxXQUR2QixFQUVHTSxJQUZILENBRVEsVUFBQUMsUUFBUTtBQUFBLGlCQUFJQSxRQUFRLENBQUNDLElBQVQsRUFBSjtBQUFBLFNBRmhCLEVBR0dGLElBSEgsQ0FHUSxZQUFpQjtBQUFBLGNBQWhCRyxNQUFnQix1RUFBUCxFQUFPO0FBQUEsaUNBQ0dBLE1BREgsQ0FDZEMsUUFEYztBQUFBLGNBQ2RBLFFBRGMsaUNBQ0gsRUFERztBQUVyQixVQUFBLE1BQUksQ0FBQ3pCLFlBQUwsR0FBb0J5QixRQUFRLENBQUN4QyxNQUFULENBQ2xCLFVBQUN5QyxJQUFELEVBQU9DLElBQVA7QUFBQSxtREFDS0QsSUFETCw0Q0FFR0MsSUFBSSxDQUFDaEIsRUFGUixFQUVhN0Isb0JBQW9CLENBQUM2QyxJQUFELENBRmpDO0FBQUEsV0FEa0IsRUFLbEIsRUFMa0IsQ0FBcEI7QUFRQSxVQUFBLE1BQUksQ0FBQzVCLGVBQUwsR0FBdUIsK0JBQXFCMEIsUUFBckIsQ0FBdkI7QUFDRCxTQWRIO0FBZUQ7QUFDRjs7O1dBdUNELHVDQUFpREcsV0FBakQsRUFBOEQ7QUFBQSxVQUF0Q0MsT0FBc0MsU0FBdENBLE9BQXNDO0FBQUEsVUFBN0JDLGFBQTZCLFNBQTdCQSxhQUE2QjtBQUM1RCxVQUFNQyxPQUFPLEdBQUcsS0FBS2pDLGVBQUwsRUFBaEI7QUFDQSxVQUFNNUIsSUFBSSxHQUFHLEVBQWI7O0FBRUEsV0FBSyxJQUFJOEQsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsYUFBYSxDQUFDRyxNQUFsQyxFQUEwQ0QsQ0FBQyxFQUEzQyxFQUErQztBQUM3QyxZQUFNRSxLQUFLLEdBQUdKLGFBQWEsQ0FBQ0UsQ0FBRCxDQUEzQjtBQUNBLFlBQU1HLEdBQUcsR0FBR1AsV0FBVyxDQUFDO0FBQUMxRCxVQUFBQSxJQUFJLEVBQUUyRCxPQUFPLENBQUNLLEtBQUQ7QUFBZCxTQUFELENBQXZCO0FBQ0EsWUFBTTdELElBQUksR0FBRzBELE9BQU8sQ0FBQztBQUFDN0QsVUFBQUEsSUFBSSxFQUFFMkQsT0FBTyxDQUFDSyxLQUFEO0FBQWQsU0FBRCxDQUFwQixDQUg2QyxDQUs3QztBQUNBOztBQUNBLFlBQUlDLEdBQUcsQ0FBQ0MsS0FBSixDQUFVQyxNQUFNLENBQUNDLFFBQWpCLEtBQThCLE9BQU9qRSxJQUFQLEtBQWdCLFFBQWxELEVBQTREO0FBQzFESCxVQUFBQSxJQUFJLENBQUNvQixJQUFMLENBQVU7QUFDUjRDLFlBQUFBLEtBQUssRUFBTEEsS0FEUTtBQUVSN0QsWUFBQUEsSUFBSSxFQUFKQSxJQUZRO0FBR1JILFlBQUFBLElBQUksRUFBRTJELE9BQU8sQ0FBQ0ssS0FBRDtBQUhMLFdBQVY7QUFLRDtBQUNGOztBQUVELGFBQU9oRSxJQUFQO0FBQ0Q7OztXQUVELHlCQUFnQnFFLFFBQWhCLEVBQTBCQyxZQUExQixFQUF3QztBQUFBLFVBQy9CQyxTQUQrQixHQUNsQixLQUFLN0MsTUFEYSxDQUMvQjZDLFNBRCtCO0FBRXRDLFVBQU1iLFdBQVcsR0FBRyxLQUFLakMsbUJBQUwsRUFBcEI7QUFGc0MsVUFJL0IrQyxTQUorQixHQUlsQkgsUUFBUSxDQUFDLEtBQUszQyxNQUFMLENBQVkrQyxNQUFiLENBSlUsQ0FJL0JELFNBSitCOztBQUFBLDZCQUtQLEtBQUtFLFVBQUwsQ0FBZ0JMLFFBQWhCLEVBQTBCQyxZQUExQixDQUxPO0FBQUEsVUFLL0J0RSxJQUwrQixvQkFLL0JBLElBTCtCO0FBQUEsVUFLekIyRSxjQUx5QixvQkFLekJBLGNBTHlCLEVBT3RDOzs7QUFDQSxVQUFNQyxVQUFVLEdBQUcseUNBQW9CO0FBQ3JDTCxRQUFBQSxTQUFTLEVBQVRBLFNBRHFDO0FBRXJDSSxRQUFBQSxjQUFjLEVBQWRBLGNBRnFDO0FBR3JDTCxRQUFBQSxZQUFZLEVBQVpBLFlBSHFDO0FBSXJDdEUsUUFBQUEsSUFBSSxFQUFKQTtBQUpxQyxPQUFwQixDQUFuQjtBQU9BLFVBQU02RSxTQUFTLEdBQUcsS0FBS0MscUJBQUwsRUFBbEI7QUFFQTtBQUNFOUUsUUFBQUEsSUFBSSxFQUFKQSxJQURGO0FBRUUwRCxRQUFBQSxXQUFXLEVBQVhBLFdBRkY7QUFHRXFCLFFBQUFBLGNBQWMsRUFBRVAsU0FBUyxDQUFDUSxtQkFBVixFQUhsQjtBQUlFSixRQUFBQSxVQUFVLEVBQVZBO0FBSkYsU0FLS0MsU0FMTDtBQU9EOzs7V0FFRCx5QkFBZ0JsQixPQUFoQixFQUF5QkQsV0FBekIsRUFBc0M7QUFDcEMsVUFBTXVCLE1BQU0sR0FBRyxLQUFLQyxlQUFMLENBQXFCdkIsT0FBckIsRUFBOEIsVUFBQTVELENBQUM7QUFBQSxlQUFJMkQsV0FBVyxDQUFDO0FBQUMxRCxVQUFBQSxJQUFJLEVBQUVEO0FBQVAsU0FBRCxDQUFmO0FBQUEsT0FBL0IsQ0FBZjtBQUNBLFdBQUtvRixVQUFMLENBQWdCO0FBQUNGLFFBQUFBLE1BQU0sRUFBTkE7QUFBRCxPQUFoQjtBQUNEOzs7V0FFRCxxQkFBWUcsSUFBWixFQUFrQjtBQUFBO0FBQUE7O0FBQUEsVUFDVHBGLElBRFMsR0FDc0RvRixJQUR0RCxDQUNUcEYsSUFEUztBQUFBLFVBQ0h3RSxTQURHLEdBQ3NEWSxJQUR0RCxDQUNIWixTQURHO0FBQUEsVUFDUWEsYUFEUixHQUNzREQsSUFEdEQsQ0FDUUMsYUFEUjtBQUFBLFVBQ3VCQyxRQUR2QixHQUNzREYsSUFEdEQsQ0FDdUJFLFFBRHZCO0FBQUEsVUFDaUNDLGlCQURqQyxHQUNzREgsSUFEdEQsQ0FDaUNHLGlCQURqQztBQUdoQixVQUFNQyxXQUFXLEdBQUcsS0FBS0Msb0JBQUwsQ0FBMEJILFFBQTFCLENBQXBCOztBQUVBLFVBQU1JLFVBQVU7QUFDZEYsUUFBQUEsV0FBVyxFQUFYQTtBQURjLFNBRVYsS0FBSzlELE1BQUwsQ0FBWWlFLFNBQVosQ0FBc0JuRixXQUF0QixHQUFvQyxFQUFwQyxHQUF5QztBQUFDb0YsUUFBQUEsZUFBZSxFQUFFO0FBQWxCLE9BRi9CLENBQWhCOztBQUtBLFVBQU1DLGNBQWM7QUFDbEJuQyxRQUFBQSxXQUFXLEVBQUUsS0FBS2hDLE1BQUwsQ0FBWUMsT0FEUDtBQUVsQm9ELFFBQUFBLGNBQWMsRUFBRVAsU0FBUyxDQUFDc0I7QUFGUixTQUdmLEtBQUtDLDhCQUFMLEVBSGUsQ0FBcEI7O0FBTUEsVUFBTUMsaUJBQWlCLEdBQUcsS0FBS0Msd0JBQUwsQ0FBOEJiLElBQTlCLENBQTFCO0FBQ0EsVUFBTWMsYUFBYSxHQUFHLEtBQUtDLHlCQUFMLENBQStCWixpQkFBL0IsQ0FBdEI7QUFDQSxVQUFNYSxjQUFjLEdBQUcsMkNBQXNCWixXQUF0QixFQUFtQ3hGLElBQUksQ0FBQ3FHLFNBQXhDLEVBQW1EZixRQUFuRCxDQUF2QjtBQUNBLFVBQU1nQixVQUFVLGlEQUFPTixpQkFBaUIsQ0FBQ00sVUFBekIsSUFBcUMvRyxpQkFBckMsRUFBaEIsQ0FuQmdCLENBcUJoQjs7QUFDQSxVQUFNZ0gsV0FBVztBQUNmeEIsUUFBQUEsY0FBYyxFQUFFL0UsSUFBSSxDQUFDK0UsY0FETjtBQUVmdUIsUUFBQUEsVUFBVSxFQUFWQSxVQUZlO0FBR2ZFLFFBQUFBLFdBQVcsRUFBRVIsaUJBQWlCLENBQUNRO0FBSGhCLFNBSVpOLGFBSlksQ0FBakI7O0FBT0EsVUFBTU8sV0FBVyx1Q0FDWixLQUFLQyxvQkFBTCxDQUNEO0FBQ0VoRCxRQUFBQSxXQUFXLEVBQUUxRCxJQUFJLENBQUMwRCxXQURwQjtBQUVFNkMsUUFBQUEsV0FBVyxFQUFYQSxXQUZGO0FBR0VILFFBQUFBLGNBQWMsRUFBZEEsY0FIRjtBQUlFUCxRQUFBQSxjQUFjLEVBQWRBO0FBSkYsT0FEQyxFQU9EVCxJQVBDLENBRFksQ0FBakI7QUFXQSxVQUFNdUIsYUFBYSxHQUFHLEtBQUtDLGdCQUFMLENBQXNCdkIsYUFBdEIsQ0FBdEI7QUFFQSxVQUFNd0IsVUFBVSxHQUFHO0FBQ2pCO0FBQ0FDLFFBQUFBLFNBQVMsRUFBRSwrQkFBS3BGLE1BQUwsQ0FBWUMsT0FBWixDQUFvQjdCLFFBQXBCLGdGQUE4QkcsUUFBOUIsSUFBeUMsQ0FBQztBQUZwQyxPQUFuQjtBQUtBLGFBQU8sQ0FBQyxLQUFLNkIsWUFBTixHQUNILEVBREcsSUFHRCxJQUFJaUYsd0JBQUosMkVBQ0tmLGlCQURMLEdBRUtFLGFBRkwsR0FHS1IsVUFITCxHQUlLMUYsSUFKTDtBQUtFNkcsUUFBQUEsVUFBVSxFQUFWQSxVQUxGO0FBTUVHLFFBQUFBLGVBQWUsRUFBRSx5QkFBQXZFLEVBQUU7QUFBQSxpQkFBSSxNQUFJLENBQUNYLFlBQUwsQ0FBa0JXLEVBQWxCLENBQUo7QUFBQSxTQU5yQjtBQVFFO0FBQ0FvRCxRQUFBQSxjQUFjLEVBQWRBLGNBVEY7QUFVRVMsUUFBQUEsVUFBVSxFQUFWQTtBQVZGLFNBSEMsNkNBZ0JHSyxhQUFhLEdBQ2IsQ0FDRSxJQUFJSSx3QkFBSiwrQ0FDSyxLQUFLRSx5QkFBTCxFQURMLEdBRUt2QixVQUZMO0FBR0UxRixRQUFBQSxJQUFJLEVBQUUsQ0FBQzJHLGFBQUQsQ0FIUjtBQUlFRSxRQUFBQSxVQUFVLEVBQVZBLFVBSkY7QUFLRW5ELFFBQUFBLFdBQVcsRUFBRTFELElBQUksQ0FBQzBELFdBTHBCO0FBTUUyQyxRQUFBQSxTQUFTLEVBQUVyRyxJQUFJLENBQUNxRyxTQU5sQjtBQU9FYSxRQUFBQSxZQUFZLEVBQUUsS0FBS3hGLE1BQUwsQ0FBWXlGLGNBUDVCO0FBUUVILFFBQUFBLGVBQWUsRUFBRSx5QkFBQXZFLEVBQUU7QUFBQSxpQkFBSSxNQUFJLENBQUNYLFlBQUwsQ0FBa0JXLEVBQWxCLENBQUo7QUFBQTtBQVJyQixTQURGLENBRGEsR0FhYixFQTdCSCx1Q0FnQ0VnRSxXQWhDRixFQUFQO0FBa0NEOzs7V0E1S0Qsc0NBQTZEO0FBQUEsbUNBQS9CVyxVQUErQjtBQUFBLFVBQS9CQSxVQUErQixpQ0FBbEIsRUFBa0I7QUFBQSwrQkFBZEMsTUFBYztBQUFBLFVBQWRBLE1BQWMsNkJBQUwsRUFBSztBQUMzRCxVQUFNQyxRQUFRLEdBQUc7QUFBQy9GLFFBQUFBLEtBQUssRUFBRTtBQUFSLE9BQWpCOztBQUNBLFVBQUksQ0FBQzZGLFVBQVUsQ0FBQ3JELE1BQVosSUFBc0IsQ0FBQ3NELE1BQU0sQ0FBQ3RELE1BQWxDLEVBQTBDO0FBQ3hDLGVBQU91RCxRQUFQO0FBQ0Q7O0FBRUQsVUFBTUMsVUFBVSxHQUFHRixNQUFNLENBQUNHLE1BQVAsQ0FBYztBQUFBLFlBQUVDLElBQUYsU0FBRUEsSUFBRjtBQUFBLGVBQy9CQSxJQUFJLENBQ0RDLE9BREgsQ0FDVyxTQURYLEVBQ3NCLEdBRHRCLEVBRUdDLElBRkgsR0FHR0MsS0FISCxDQUdTLEdBSFQsRUFJR0MsSUFKSCxDQUlRLFVBQUFDLEdBQUc7QUFBQSxpQkFBSUMsNkJBQVk1SCxJQUFaLENBQWlCMEgsSUFBakIsQ0FBc0IsVUFBQUcsQ0FBQztBQUFBLG1CQUFJQSxDQUFDLENBQUNDLFFBQUYsQ0FBV0gsR0FBWCxDQUFKO0FBQUEsV0FBdkIsQ0FBSjtBQUFBLFNBSlgsQ0FEK0I7QUFBQSxPQUFkLENBQW5COztBQVFBLFVBQUksQ0FBQ1AsVUFBVSxDQUFDeEQsTUFBaEIsRUFBd0I7QUFDdEIsZUFBT3VELFFBQVA7QUFDRCxPQWhCMEQsQ0FrQjNEOzs7QUFDQSxVQUFNWSxNQUFNLEdBQUdkLFVBQVUsQ0FBQyxDQUFELENBQXpCO0FBRUEsVUFBTTdGLEtBQUssR0FBR2dHLFVBQVUsQ0FBQ1ksR0FBWCxDQUFlLFVBQUFDLFNBQVM7QUFBQSxlQUFLO0FBQ3pDQyxVQUFBQSxLQUFLLEVBQUVELFNBQVMsQ0FBQ1gsSUFBVixDQUFlQyxPQUFmLENBQXVCLFNBQXZCLEVBQWtDLEdBQWxDLEVBQXVDQyxJQUF2QyxFQURrQztBQUV6Q2hHLFVBQUFBLE9BQU8sRUFBRTtBQUNQL0IsWUFBQUEsR0FBRyxFQUFFc0ksTUFBTSxDQUFDSSxJQUFQLENBQVkxSSxHQURWO0FBRVBDLFlBQUFBLEdBQUcsRUFBRXFJLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZekksR0FGVjtBQUdQTSxZQUFBQSxJQUFJLEVBQUU7QUFDSm9JLGNBQUFBLEtBQUssRUFBRUgsU0FBUyxDQUFDWCxJQURiO0FBRUp4SCxjQUFBQSxRQUFRLEVBQUVtSSxTQUFTLENBQUNuSTtBQUZoQjtBQUhDLFdBRmdDO0FBVXpDdUksVUFBQUEsU0FBUyxFQUFFO0FBVjhCLFNBQUw7QUFBQSxPQUF4QixDQUFkO0FBYUEsYUFBTztBQUFDakgsUUFBQUEsS0FBSyxFQUFMQTtBQUFELE9BQVA7QUFDRDs7O0VBM0hvQ2tILHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7QnJ1c2hpbmdFeHRlbnNpb259IGZyb20gJ0BkZWNrLmdsL2V4dGVuc2lvbnMnO1xuXG5pbXBvcnQgU3ZnSWNvbkxheWVyIGZyb20gJ2RlY2tnbC1sYXllcnMvc3ZnLWljb24tbGF5ZXIvc3ZnLWljb24tbGF5ZXInO1xuaW1wb3J0IEljb25MYXllckljb24gZnJvbSAnLi9pY29uLWxheWVyLWljb24nO1xuaW1wb3J0IHtJQ09OX0ZJRUxEUywgQ0xPVURGUk9OVH0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IEljb25JbmZvTW9kYWxGYWN0b3J5IGZyb20gJy4vaWNvbi1pbmZvLW1vZGFsJztcbmltcG9ydCBMYXllciBmcm9tICcuLi9iYXNlLWxheWVyJztcbmltcG9ydCB7Z2V0VGV4dE9mZnNldEJ5UmFkaXVzLCBmb3JtYXRUZXh0TGFiZWxEYXRhfSBmcm9tICcuLi9sYXllci10ZXh0LWxhYmVsJztcblxuY29uc3QgYnJ1c2hpbmdFeHRlbnNpb24gPSBuZXcgQnJ1c2hpbmdFeHRlbnNpb24oKTtcblxuZXhwb3J0IGNvbnN0IFNWR19JQ09OX1VSTCA9IGAke0NMT1VERlJPTlR9L2ljb25zL3N2Zy1pY29ucy5qc29uYDtcblxuZXhwb3J0IGNvbnN0IGljb25Qb3NBY2Nlc3NvciA9ICh7bGF0LCBsbmcsIGFsdGl0dWRlfSkgPT4gZCA9PiBbXG4gIGQuZGF0YVtsbmcuZmllbGRJZHhdLFxuICBkLmRhdGFbbGF0LmZpZWxkSWR4XSxcbiAgYWx0aXR1ZGU/LmZpZWxkSWR4ID4gLTEgPyBkLmRhdGFbYWx0aXR1ZGUuZmllbGRJZHhdIDogMFxuXTtcbmV4cG9ydCBjb25zdCBpY29uQWNjZXNzb3IgPSAoe2ljb259KSA9PiBkID0+IGQuZGF0YVtpY29uLmZpZWxkSWR4XTtcblxuZXhwb3J0IGNvbnN0IGljb25SZXF1aXJlZENvbHVtbnMgPSBbJ2xhdCcsICdsbmcnLCAnaWNvbiddO1xuZXhwb3J0IGNvbnN0IGljb25PcHRpb25hbENvbHVtbnMgPSBbJ2FsdGl0dWRlJ107XG5cbmV4cG9ydCBjb25zdCBwb2ludFZpc0NvbmZpZ3MgPSB7XG4gIHJhZGl1czogJ3JhZGl1cycsXG4gIGZpeGVkUmFkaXVzOiAnZml4ZWRSYWRpdXMnLFxuICBvcGFjaXR5OiAnb3BhY2l0eScsXG4gIGNvbG9yUmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgcmFkaXVzUmFuZ2U6ICdyYWRpdXNSYW5nZSdcbn07XG5cbmZ1bmN0aW9uIGZsYXR0ZXJJY29uUG9zaXRpb25zKGljb24pIHtcbiAgLy8gaGFkIHRvIGZsaXAgeSwgc2luY2UgQGx1bWEgbW9kYWwgaGFzIGNoYW5nZWRcbiAgcmV0dXJuIGljb24ubWVzaC5jZWxscy5yZWR1Y2UoKHByZXYsIGNlbGwpID0+IHtcbiAgICBjZWxsLmZvckVhY2gocCA9PiB7XG4gICAgICBwcmV2LnB1c2goXG4gICAgICAgIC4uLltpY29uLm1lc2gucG9zaXRpb25zW3BdWzBdLCAtaWNvbi5tZXNoLnBvc2l0aW9uc1twXVsxXSwgaWNvbi5tZXNoLnBvc2l0aW9uc1twXVsyXV1cbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIFtdKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSWNvbkxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWdpc3RlclZpc0NvbmZpZyhwb2ludFZpc0NvbmZpZ3MpO1xuICAgIHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvciA9ICgpID0+IGljb25Qb3NBY2Nlc3Nvcih0aGlzLmNvbmZpZy5jb2x1bW5zKTtcbiAgICB0aGlzLmdldEljb25BY2Nlc3NvciA9ICgpID0+IGljb25BY2Nlc3Nvcih0aGlzLmNvbmZpZy5jb2x1bW5zKTtcblxuICAgIC8vIHByZXBhcmUgbGF5ZXIgaW5mbyBtb2RhbFxuICAgIHRoaXMuX2xheWVySW5mb01vZGFsID0gSWNvbkluZm9Nb2RhbEZhY3RvcnkoKTtcbiAgICB0aGlzLmljb25HZW9tZXRyeSA9IHByb3BzLmljb25HZW9tZXRyeSB8fCBudWxsO1xuICAgIHRoaXMuZ2V0U3ZnSWNvbnMoKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnaWNvbic7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIGljb25SZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgb3B0aW9uYWxDb2x1bW5zKCkge1xuICAgIHJldHVybiBpY29uT3B0aW9uYWxDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IGNvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRQb2ludENvbHVtblBhaXJzO1xuICB9XG5cbiAgZ2V0IGxheWVySWNvbigpIHtcbiAgICByZXR1cm4gSWNvbkxheWVySWNvbjtcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sb3I6IHtcbiAgICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMuY29sb3IsXG4gICAgICAgIGFjY2Vzc29yOiAnZ2V0RmlsbENvbG9yJyxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBjb25maWcgPT4gY29uZmlnLmNvbG9yXG4gICAgICB9LFxuICAgICAgc2l6ZToge1xuICAgICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscy5zaXplLFxuICAgICAgICBwcm9wZXJ0eTogJ3JhZGl1cycsXG4gICAgICAgIHJhbmdlOiAncmFkaXVzUmFuZ2UnLFxuICAgICAgICBjaGFubmVsU2NhbGVUeXBlOiAncmFkaXVzJyxcbiAgICAgICAgYWNjZXNzb3I6ICdnZXRSYWRpdXMnLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IDFcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZ2V0IGxheWVySW5mb01vZGFsKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogJ2ljb25JbmZvJyxcbiAgICAgIHRlbXBsYXRlOiB0aGlzLl9sYXllckluZm9Nb2RhbCxcbiAgICAgIG1vZGFsUHJvcHM6IHtcbiAgICAgICAgdGl0bGU6ICdtb2RhbC5pY29uSW5mby50aXRsZSdcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZ2V0U3ZnSWNvbnMoKSB7XG4gICAgY29uc3QgZmV0Y2hDb25maWcgPSB7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgY2FjaGU6ICduby1jYWNoZSdcbiAgICB9O1xuXG4gICAgaWYgKHdpbmRvdy5mZXRjaCkge1xuICAgICAgd2luZG93XG4gICAgICAgIC5mZXRjaChTVkdfSUNPTl9VUkwsIGZldGNoQ29uZmlnKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgIC50aGVuKChwYXJzZWQgPSB7fSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHtzdmdJY29ucyA9IFtdfSA9IHBhcnNlZDtcbiAgICAgICAgICB0aGlzLmljb25HZW9tZXRyeSA9IHN2Z0ljb25zLnJlZHVjZShcbiAgICAgICAgICAgIChhY2N1LCBjdXJyKSA9PiAoe1xuICAgICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgICBbY3Vyci5pZF06IGZsYXR0ZXJJY29uUG9zaXRpb25zKGN1cnIpXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHRoaXMuX2xheWVySW5mb01vZGFsID0gSWNvbkluZm9Nb2RhbEZhY3Rvcnkoc3ZnSWNvbnMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZmluZERlZmF1bHRMYXllclByb3BzKHtmaWVsZFBhaXJzID0gW10sIGZpZWxkcyA9IFtdfSkge1xuICAgIGNvbnN0IG5vdEZvdW5kID0ge3Byb3BzOiBbXX07XG4gICAgaWYgKCFmaWVsZFBhaXJzLmxlbmd0aCB8fCAhZmllbGRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG5vdEZvdW5kO1xuICAgIH1cblxuICAgIGNvbnN0IGljb25GaWVsZHMgPSBmaWVsZHMuZmlsdGVyKCh7bmFtZX0pID0+XG4gICAgICBuYW1lXG4gICAgICAgIC5yZXBsYWNlKC9bXywuXSsvZywgJyAnKVxuICAgICAgICAudHJpbSgpXG4gICAgICAgIC5zcGxpdCgnICcpXG4gICAgICAgIC5zb21lKHNlZyA9PiBJQ09OX0ZJRUxEUy5pY29uLnNvbWUodCA9PiB0LmluY2x1ZGVzKHNlZykpKVxuICAgICk7XG5cbiAgICBpZiAoIWljb25GaWVsZHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbm90Rm91bmQ7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGljb24gbGF5ZXJzIGZvciBmaXJzdCBwb2ludCBwYWlyXG4gICAgY29uc3QgcHRQYWlyID0gZmllbGRQYWlyc1swXTtcblxuICAgIGNvbnN0IHByb3BzID0gaWNvbkZpZWxkcy5tYXAoaWNvbkZpZWxkID0+ICh7XG4gICAgICBsYWJlbDogaWNvbkZpZWxkLm5hbWUucmVwbGFjZSgvW18sLl0rL2csICcgJykudHJpbSgpLFxuICAgICAgY29sdW1uczoge1xuICAgICAgICBsYXQ6IHB0UGFpci5wYWlyLmxhdCxcbiAgICAgICAgbG5nOiBwdFBhaXIucGFpci5sbmcsXG4gICAgICAgIGljb246IHtcbiAgICAgICAgICB2YWx1ZTogaWNvbkZpZWxkLm5hbWUsXG4gICAgICAgICAgZmllbGRJZHg6IGljb25GaWVsZC5maWVsZElkeFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaXNWaXNpYmxlOiB0cnVlXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHtwcm9wc307XG4gIH1cblxuICBjYWxjdWxhdGVEYXRhQXR0cmlidXRlKHthbGxEYXRhLCBmaWx0ZXJlZEluZGV4fSwgZ2V0UG9zaXRpb24pIHtcbiAgICBjb25zdCBnZXRJY29uID0gdGhpcy5nZXRJY29uQWNjZXNzb3IoKTtcbiAgICBjb25zdCBkYXRhID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbHRlcmVkSW5kZXgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gZmlsdGVyZWRJbmRleFtpXTtcbiAgICAgIGNvbnN0IHBvcyA9IGdldFBvc2l0aW9uKHtkYXRhOiBhbGxEYXRhW2luZGV4XX0pO1xuICAgICAgY29uc3QgaWNvbiA9IGdldEljb24oe2RhdGE6IGFsbERhdGFbaW5kZXhdfSk7XG5cbiAgICAgIC8vIGlmIGRvZXNuJ3QgaGF2ZSBwb2ludCBsYXQgb3IgbG5nLCBkbyBub3QgYWRkIHRoZSBwb2ludFxuICAgICAgLy8gZGVjay5nbCBjYW4ndCBoYW5kbGUgcG9zaXRpb24gPSBudWxsXG4gICAgICBpZiAocG9zLmV2ZXJ5KE51bWJlci5pc0Zpbml0ZSkgJiYgdHlwZW9mIGljb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgaWNvbixcbiAgICAgICAgICBkYXRhOiBhbGxEYXRhW2luZGV4XVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGZvcm1hdExheWVyRGF0YShkYXRhc2V0cywgb2xkTGF5ZXJEYXRhKSB7XG4gICAgY29uc3Qge3RleHRMYWJlbH0gPSB0aGlzLmNvbmZpZztcbiAgICBjb25zdCBnZXRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvcigpO1xuXG4gICAgY29uc3Qge2dwdUZpbHRlcn0gPSBkYXRhc2V0c1t0aGlzLmNvbmZpZy5kYXRhSWRdO1xuICAgIGNvbnN0IHtkYXRhLCB0cmlnZ2VyQ2hhbmdlZH0gPSB0aGlzLnVwZGF0ZURhdGEoZGF0YXNldHMsIG9sZExheWVyRGF0YSk7XG5cbiAgICAvLyBnZXQgYWxsIGRpc3RpbmN0IGNoYXJhY3RlcnMgaW4gdGhlIHRleHQgbGFiZWxzXG4gICAgY29uc3QgdGV4dExhYmVscyA9IGZvcm1hdFRleHRMYWJlbERhdGEoe1xuICAgICAgdGV4dExhYmVsLFxuICAgICAgdHJpZ2dlckNoYW5nZWQsXG4gICAgICBvbGRMYXllckRhdGEsXG4gICAgICBkYXRhXG4gICAgfSk7XG5cbiAgICBjb25zdCBhY2Nlc3NvcnMgPSB0aGlzLmdldEF0dHJpYnV0ZUFjY2Vzc29ycygpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGEsXG4gICAgICBnZXRQb3NpdGlvbixcbiAgICAgIGdldEZpbHRlclZhbHVlOiBncHVGaWx0ZXIuZmlsdGVyVmFsdWVBY2Nlc3NvcigpLFxuICAgICAgdGV4dExhYmVscyxcbiAgICAgIC4uLmFjY2Vzc29yc1xuICAgIH07XG4gIH1cblxuICB1cGRhdGVMYXllck1ldGEoYWxsRGF0YSwgZ2V0UG9zaXRpb24pIHtcbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFBvaW50c0JvdW5kcyhhbGxEYXRhLCBkID0+IGdldFBvc2l0aW9uKHtkYXRhOiBkfSkpO1xuICAgIHRoaXMudXBkYXRlTWV0YSh7Ym91bmRzfSk7XG4gIH1cblxuICByZW5kZXJMYXllcihvcHRzKSB7XG4gICAgY29uc3Qge2RhdGEsIGdwdUZpbHRlciwgb2JqZWN0SG92ZXJlZCwgbWFwU3RhdGUsIGludGVyYWN0aW9uQ29uZmlnfSA9IG9wdHM7XG5cbiAgICBjb25zdCByYWRpdXNTY2FsZSA9IHRoaXMuZ2V0UmFkaXVzU2NhbGVCeVpvb20obWFwU3RhdGUpO1xuXG4gICAgY29uc3QgbGF5ZXJQcm9wcyA9IHtcbiAgICAgIHJhZGl1c1NjYWxlLFxuICAgICAgLi4uKHRoaXMuY29uZmlnLnZpc0NvbmZpZy5maXhlZFJhZGl1cyA/IHt9IDoge3JhZGl1c01heFBpeGVsczogNTAwfSlcbiAgICB9O1xuXG4gICAgY29uc3QgdXBkYXRlVHJpZ2dlcnMgPSB7XG4gICAgICBnZXRQb3NpdGlvbjogdGhpcy5jb25maWcuY29sdW1ucyxcbiAgICAgIGdldEZpbHRlclZhbHVlOiBncHVGaWx0ZXIuZmlsdGVyVmFsdWVVcGRhdGVUcmlnZ2VycyxcbiAgICAgIC4uLnRoaXMuZ2V0VmlzdWFsQ2hhbm5lbFVwZGF0ZVRyaWdnZXJzKClcbiAgICB9O1xuXG4gICAgY29uc3QgZGVmYXVsdExheWVyUHJvcHMgPSB0aGlzLmdldERlZmF1bHREZWNrTGF5ZXJQcm9wcyhvcHRzKTtcbiAgICBjb25zdCBicnVzaGluZ1Byb3BzID0gdGhpcy5nZXRCcnVzaGluZ0V4dGVuc2lvblByb3BzKGludGVyYWN0aW9uQ29uZmlnKTtcbiAgICBjb25zdCBnZXRQaXhlbE9mZnNldCA9IGdldFRleHRPZmZzZXRCeVJhZGl1cyhyYWRpdXNTY2FsZSwgZGF0YS5nZXRSYWRpdXMsIG1hcFN0YXRlKTtcbiAgICBjb25zdCBleHRlbnNpb25zID0gWy4uLmRlZmF1bHRMYXllclByb3BzLmV4dGVuc2lvbnMsIGJydXNoaW5nRXh0ZW5zaW9uXTtcblxuICAgIC8vIHNoYXJlZCBQcm9wcyBiZXR3ZWVuIGxheWVyIGFuZCBsYWJlbCBsYXllclxuICAgIGNvbnN0IHNoYXJlZFByb3BzID0ge1xuICAgICAgZ2V0RmlsdGVyVmFsdWU6IGRhdGEuZ2V0RmlsdGVyVmFsdWUsXG4gICAgICBleHRlbnNpb25zLFxuICAgICAgZmlsdGVyUmFuZ2U6IGRlZmF1bHRMYXllclByb3BzLmZpbHRlclJhbmdlLFxuICAgICAgLi4uYnJ1c2hpbmdQcm9wc1xuICAgIH07XG5cbiAgICBjb25zdCBsYWJlbExheWVycyA9IFtcbiAgICAgIC4uLnRoaXMucmVuZGVyVGV4dExhYmVsTGF5ZXIoXG4gICAgICAgIHtcbiAgICAgICAgICBnZXRQb3NpdGlvbjogZGF0YS5nZXRQb3NpdGlvbixcbiAgICAgICAgICBzaGFyZWRQcm9wcyxcbiAgICAgICAgICBnZXRQaXhlbE9mZnNldCxcbiAgICAgICAgICB1cGRhdGVUcmlnZ2Vyc1xuICAgICAgICB9LFxuICAgICAgICBvcHRzXG4gICAgICApXG4gICAgXTtcbiAgICBjb25zdCBob3ZlcmVkT2JqZWN0ID0gdGhpcy5oYXNIb3ZlcmVkT2JqZWN0KG9iamVjdEhvdmVyZWQpO1xuXG4gICAgY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgICAgIC8vIGljb25zIHdpbGwgYmUgZmxhdCBvbiB0aGUgbWFwIHdoZW4gdGhlIGFsdGl0dWRlIGNvbHVtbiBpcyBub3QgdXNlZFxuICAgICAgZGVwdGhUZXN0OiB0aGlzLmNvbmZpZy5jb2x1bW5zLmFsdGl0dWRlPy5maWVsZElkeCA+IC0xXG4gICAgfTtcblxuICAgIHJldHVybiAhdGhpcy5pY29uR2VvbWV0cnlcbiAgICAgID8gW11cbiAgICAgIDogW1xuICAgICAgICAgIG5ldyBTdmdJY29uTGF5ZXIoe1xuICAgICAgICAgICAgLi4uZGVmYXVsdExheWVyUHJvcHMsXG4gICAgICAgICAgICAuLi5icnVzaGluZ1Byb3BzLFxuICAgICAgICAgICAgLi4ubGF5ZXJQcm9wcyxcbiAgICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgICBwYXJhbWV0ZXJzLFxuICAgICAgICAgICAgZ2V0SWNvbkdlb21ldHJ5OiBpZCA9PiB0aGlzLmljb25HZW9tZXRyeVtpZF0sXG5cbiAgICAgICAgICAgIC8vIHVwZGF0ZSB0cmlnZ2Vyc1xuICAgICAgICAgICAgdXBkYXRlVHJpZ2dlcnMsXG4gICAgICAgICAgICBleHRlbnNpb25zXG4gICAgICAgICAgfSksXG5cbiAgICAgICAgICAuLi4oaG92ZXJlZE9iamVjdFxuICAgICAgICAgICAgPyBbXG4gICAgICAgICAgICAgICAgbmV3IFN2Z0ljb25MYXllcih7XG4gICAgICAgICAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRIb3ZlckxheWVyUHJvcHMoKSxcbiAgICAgICAgICAgICAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBbaG92ZXJlZE9iamVjdF0sXG4gICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzLFxuICAgICAgICAgICAgICAgICAgZ2V0UG9zaXRpb246IGRhdGEuZ2V0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICBnZXRSYWRpdXM6IGRhdGEuZ2V0UmFkaXVzLFxuICAgICAgICAgICAgICAgICAgZ2V0RmlsbENvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcixcbiAgICAgICAgICAgICAgICAgIGdldEljb25HZW9tZXRyeTogaWQgPT4gdGhpcy5pY29uR2VvbWV0cnlbaWRdXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgOiBbXSksXG5cbiAgICAgICAgICAvLyB0ZXh0IGxhYmVsIGxheWVyXG4gICAgICAgICAgLi4ubGFiZWxMYXllcnNcbiAgICAgICAgXTtcbiAgfVxufVxuIl19