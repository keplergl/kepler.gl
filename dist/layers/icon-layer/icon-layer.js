"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.pointVisConfigs = exports.iconRequiredColumns = exports.iconAccessor = exports.iconPosAccessor = exports.SVG_ICON_URL = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _window = _interopRequireDefault(require("global/window"));

var _extensions = require("@deck.gl/extensions");

var _colorUtils = require("../../utils/color-utils");

var _svgIconLayer = _interopRequireDefault(require("../../deckgl-layers/svg-icon-layer/svg-icon-layer"));

var _iconLayerIcon = _interopRequireDefault(require("./icon-layer-icon"));

var _defaultSettings = require("../../constants/default-settings");

var _iconInfoModal = _interopRequireDefault(require("./icon-info-modal"));

var _baseLayer = _interopRequireDefault(require("../base-layer"));

var _layerTextLabel = require("../layer-text-label");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var brushingExtension = new _extensions.BrushingExtension();
var SVG_ICON_URL = "".concat(_defaultSettings.CLOUDFRONT, "/icons/svg-icons.json");
exports.SVG_ICON_URL = SVG_ICON_URL;

var iconPosAccessor = function iconPosAccessor(_ref) {
  var lat = _ref.lat,
      lng = _ref.lng;
  return function (d) {
    return [d.data[lng.fieldIdx], d.data[lat.fieldIdx]];
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

var IconLayer =
/*#__PURE__*/
function (_Layer) {
  (0, _inherits2["default"])(IconLayer, _Layer);

  function IconLayer() {
    var _this;

    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, IconLayer);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(IconLayer).call(this, props));

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
            return _objectSpread({}, accu, (0, _defineProperty2["default"])({}, curr.id, flatterIconPositions(curr)));
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
      var _this3 = this;

      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var _this$config = this.config,
          colorScale = _this$config.colorScale,
          colorDomain = _this$config.colorDomain,
          colorField = _this$config.colorField,
          color = _this$config.color,
          sizeField = _this$config.sizeField,
          sizeScale = _this$config.sizeScale,
          sizeDomain = _this$config.sizeDomain,
          textLabel = _this$config.textLabel,
          _this$config$visConfi = _this$config.visConfig,
          radiusRange = _this$config$visConfi.radiusRange,
          colorRange = _this$config$visConfi.colorRange;
      var getPosition = this.getPositionAccessor();
      var gpuFilter = datasets[this.config.dataId].gpuFilter;

      var _this$updateData = this.updateData(datasets, oldLayerData),
          data = _this$updateData.data,
          triggerChanged = _this$updateData.triggerChanged; // point color


      var cScale = colorField && this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(_colorUtils.hexToRgb)); // point radius

      var rScale = sizeField && this.getVisChannelScale(sizeScale, sizeDomain, radiusRange, 0);
      var getRadius = rScale ? function (d) {
        return _this3.getEncodedChannelValue(rScale, d.data, sizeField);
      } : 1;
      var getFillColor = cScale ? function (d) {
        return _this3.getEncodedChannelValue(cScale, d.data, colorField);
      } : color; // get all distinct characters in the text labels

      var textLabels = (0, _layerTextLabel.formatTextLabelData)({
        textLabel: textLabel,
        triggerChanged: triggerChanged,
        oldLayerData: oldLayerData,
        data: data
      });
      return {
        data: data,
        getPosition: getPosition,
        getFillColor: getFillColor,
        getFilterValue: gpuFilter.filterValueAccessor(),
        getRadius: getRadius,
        textLabels: textLabels
      };
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
      var _this4 = this;

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

      var updateTriggers = {
        getFilterValue: gpuFilter.filterValueUpdateTriggers,
        getRadius: {
          sizeField: this.config.colorField,
          radiusRange: this.config.visConfig.radiusRange,
          sizeScale: this.config.sizeScale
        },
        getFillColor: {
          color: this.config.color,
          colorField: this.config.colorField,
          colorRange: this.config.visConfig.colorRange,
          colorScale: this.config.colorScale
        }
      };
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
      return !this.iconGeometry ? [] : [new _svgIconLayer["default"](_objectSpread({}, defaultLayerProps, {}, brushingProps, {}, layerProps, {}, data, {
        getIconGeometry: function getIconGeometry(id) {
          return _this4.iconGeometry[id];
        },
        // update triggers
        updateTriggers: updateTriggers,
        extensions: extensions
      }))].concat((0, _toConsumableArray2["default"])(this.isLayerHovered(objectHovered) ? [new _svgIconLayer["default"](_objectSpread({}, this.getDefaultHoverLayerProps(), {}, layerProps, {
        data: [objectHovered.object],
        getPosition: data.getPosition,
        getRadius: data.getRadius,
        getFillColor: this.config.highlightColor,
        getIconGeometry: function getIconGeometry(id) {
          return _this4.iconGeometry[id];
        }
      }))] : []), (0, _toConsumableArray2["default"])(labelLayers));
    }
  }, {
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
      return _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(IconLayer.prototype), "visualChannels", this), {
        size: _objectSpread({}, (0, _get2["default"])((0, _getPrototypeOf2["default"])(IconLayer.prototype), "visualChannels", this).size, {
          range: 'radiusRange',
          property: 'radius',
          channelScaleType: 'radius'
        })
      });
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
              fieldIdx: iconField.tableFieldIndex - 1
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvaWNvbi1sYXllci9pY29uLWxheWVyLmpzIl0sIm5hbWVzIjpbImJydXNoaW5nRXh0ZW5zaW9uIiwiQnJ1c2hpbmdFeHRlbnNpb24iLCJTVkdfSUNPTl9VUkwiLCJDTE9VREZST05UIiwiaWNvblBvc0FjY2Vzc29yIiwibGF0IiwibG5nIiwiZCIsImRhdGEiLCJmaWVsZElkeCIsImljb25BY2Nlc3NvciIsImljb24iLCJpY29uUmVxdWlyZWRDb2x1bW5zIiwicG9pbnRWaXNDb25maWdzIiwicmFkaXVzIiwiZml4ZWRSYWRpdXMiLCJvcGFjaXR5IiwiY29sb3JSYW5nZSIsInJhZGl1c1JhbmdlIiwiZmxhdHRlckljb25Qb3NpdGlvbnMiLCJtZXNoIiwiY2VsbHMiLCJyZWR1Y2UiLCJwcmV2IiwiY2VsbCIsImZvckVhY2giLCJwIiwicHVzaCIsInBvc2l0aW9ucyIsIkljb25MYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbkFjY2Vzc29yIiwiY29uZmlnIiwiY29sdW1ucyIsImdldEljb25BY2Nlc3NvciIsIl9sYXllckluZm9Nb2RhbCIsImljb25HZW9tZXRyeSIsImdldFN2Z0ljb25zIiwiZmV0Y2hDb25maWciLCJtZXRob2QiLCJtb2RlIiwiY2FjaGUiLCJ3aW5kb3ciLCJmZXRjaCIsInRoZW4iLCJyZXNwb25zZSIsImpzb24iLCJwYXJzZWQiLCJzdmdJY29ucyIsImFjY3UiLCJjdXJyIiwiaWQiLCJnZXRQb3NpdGlvbiIsImFsbERhdGEiLCJmaWx0ZXJlZEluZGV4IiwiZ2V0SWNvbiIsImkiLCJsZW5ndGgiLCJpbmRleCIsInBvcyIsImV2ZXJ5IiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJkYXRhc2V0cyIsIm9sZExheWVyRGF0YSIsIm9wdCIsImNvbG9yU2NhbGUiLCJjb2xvckRvbWFpbiIsImNvbG9yRmllbGQiLCJjb2xvciIsInNpemVGaWVsZCIsInNpemVTY2FsZSIsInNpemVEb21haW4iLCJ0ZXh0TGFiZWwiLCJ2aXNDb25maWciLCJncHVGaWx0ZXIiLCJkYXRhSWQiLCJ1cGRhdGVEYXRhIiwidHJpZ2dlckNoYW5nZWQiLCJjU2NhbGUiLCJnZXRWaXNDaGFubmVsU2NhbGUiLCJjb2xvcnMiLCJtYXAiLCJoZXhUb1JnYiIsInJTY2FsZSIsImdldFJhZGl1cyIsImdldEVuY29kZWRDaGFubmVsVmFsdWUiLCJnZXRGaWxsQ29sb3IiLCJ0ZXh0TGFiZWxzIiwiZ2V0RmlsdGVyVmFsdWUiLCJmaWx0ZXJWYWx1ZUFjY2Vzc29yIiwiYm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwidXBkYXRlTWV0YSIsIm9wdHMiLCJvYmplY3RIb3ZlcmVkIiwibWFwU3RhdGUiLCJpbnRlcmFjdGlvbkNvbmZpZyIsInJhZGl1c1NjYWxlIiwiZ2V0UmFkaXVzU2NhbGVCeVpvb20iLCJsYXllclByb3BzIiwicmFkaXVzTWF4UGl4ZWxzIiwidXBkYXRlVHJpZ2dlcnMiLCJmaWx0ZXJWYWx1ZVVwZGF0ZVRyaWdnZXJzIiwiZGVmYXVsdExheWVyUHJvcHMiLCJnZXREZWZhdWx0RGVja0xheWVyUHJvcHMiLCJicnVzaGluZ1Byb3BzIiwiZ2V0QnJ1c2hpbmdFeHRlbnNpb25Qcm9wcyIsImdldFBpeGVsT2Zmc2V0IiwiZXh0ZW5zaW9ucyIsInNoYXJlZFByb3BzIiwiZmlsdGVyUmFuZ2UiLCJsYWJlbExheWVycyIsInJlbmRlclRleHRMYWJlbExheWVyIiwiU3ZnSWNvbkxheWVyIiwiZ2V0SWNvbkdlb21ldHJ5IiwiaXNMYXllckhvdmVyZWQiLCJnZXREZWZhdWx0SG92ZXJMYXllclByb3BzIiwib2JqZWN0IiwiaGlnaGxpZ2h0Q29sb3IiLCJkZWZhdWx0UG9pbnRDb2x1bW5QYWlycyIsIkljb25MYXllckljb24iLCJzaXplIiwicmFuZ2UiLCJwcm9wZXJ0eSIsImNoYW5uZWxTY2FsZVR5cGUiLCJ0ZW1wbGF0ZSIsIm1vZGFsUHJvcHMiLCJ0aXRsZSIsImZpZWxkUGFpcnMiLCJmaWVsZHMiLCJub3RGb3VuZCIsImljb25GaWVsZHMiLCJmaWx0ZXIiLCJuYW1lIiwicmVwbGFjZSIsInRyaW0iLCJzcGxpdCIsInNvbWUiLCJzZWciLCJJQ09OX0ZJRUxEUyIsInQiLCJpbmNsdWRlcyIsInB0UGFpciIsImljb25GaWVsZCIsImxhYmVsIiwicGFpciIsInZhbHVlIiwidGFibGVGaWVsZEluZGV4IiwiaXNWaXNpYmxlIiwiTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGlCQUFpQixHQUFHLElBQUlDLDZCQUFKLEVBQTFCO0FBRU8sSUFBTUMsWUFBWSxhQUFNQywyQkFBTiwwQkFBbEI7OztBQUVBLElBQU1DLGVBQWUsR0FBRyxTQUFsQkEsZUFBa0I7QUFBQSxNQUFFQyxHQUFGLFFBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFFBQU9BLEdBQVA7QUFBQSxTQUFnQixVQUFBQyxDQUFDO0FBQUEsV0FBSSxDQUFDQSxDQUFDLENBQUNDLElBQUYsQ0FBT0YsR0FBRyxDQUFDRyxRQUFYLENBQUQsRUFBdUJGLENBQUMsQ0FBQ0MsSUFBRixDQUFPSCxHQUFHLENBQUNJLFFBQVgsQ0FBdkIsQ0FBSjtBQUFBLEdBQWpCO0FBQUEsQ0FBeEI7Ozs7QUFDQSxJQUFNQyxZQUFZLEdBQUcsU0FBZkEsWUFBZTtBQUFBLE1BQUVDLElBQUYsU0FBRUEsSUFBRjtBQUFBLFNBQVksVUFBQUosQ0FBQztBQUFBLFdBQUlBLENBQUMsQ0FBQ0MsSUFBRixDQUFPRyxJQUFJLENBQUNGLFFBQVosQ0FBSjtBQUFBLEdBQWI7QUFBQSxDQUFyQjs7O0FBRUEsSUFBTUcsbUJBQW1CLEdBQUcsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLE1BQWYsQ0FBNUI7O0FBRUEsSUFBTUMsZUFBZSxHQUFHO0FBQzdCQyxFQUFBQSxNQUFNLEVBQUUsUUFEcUI7QUFFN0JDLEVBQUFBLFdBQVcsRUFBRSxhQUZnQjtBQUc3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eXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7QnJ1c2hpbmdFeHRlbnNpb259IGZyb20gJ0BkZWNrLmdsL2V4dGVuc2lvbnMnO1xuXG5pbXBvcnQge2hleFRvUmdifSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQgU3ZnSWNvbkxheWVyIGZyb20gJ2RlY2tnbC1sYXllcnMvc3ZnLWljb24tbGF5ZXIvc3ZnLWljb24tbGF5ZXInO1xuaW1wb3J0IEljb25MYXllckljb24gZnJvbSAnLi9pY29uLWxheWVyLWljb24nO1xuaW1wb3J0IHtJQ09OX0ZJRUxEUywgQ0xPVURGUk9OVH0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IEljb25JbmZvTW9kYWxGYWN0b3J5IGZyb20gJy4vaWNvbi1pbmZvLW1vZGFsJztcbmltcG9ydCBMYXllciBmcm9tICcuLi9iYXNlLWxheWVyJztcbmltcG9ydCB7Z2V0VGV4dE9mZnNldEJ5UmFkaXVzLCBmb3JtYXRUZXh0TGFiZWxEYXRhfSBmcm9tICcuLi9sYXllci10ZXh0LWxhYmVsJztcblxuY29uc3QgYnJ1c2hpbmdFeHRlbnNpb24gPSBuZXcgQnJ1c2hpbmdFeHRlbnNpb24oKTtcblxuZXhwb3J0IGNvbnN0IFNWR19JQ09OX1VSTCA9IGAke0NMT1VERlJPTlR9L2ljb25zL3N2Zy1pY29ucy5qc29uYDtcblxuZXhwb3J0IGNvbnN0IGljb25Qb3NBY2Nlc3NvciA9ICh7bGF0LCBsbmd9KSA9PiBkID0+IFtkLmRhdGFbbG5nLmZpZWxkSWR4XSwgZC5kYXRhW2xhdC5maWVsZElkeF1dO1xuZXhwb3J0IGNvbnN0IGljb25BY2Nlc3NvciA9ICh7aWNvbn0pID0+IGQgPT4gZC5kYXRhW2ljb24uZmllbGRJZHhdO1xuXG5leHBvcnQgY29uc3QgaWNvblJlcXVpcmVkQ29sdW1ucyA9IFsnbGF0JywgJ2xuZycsICdpY29uJ107XG5cbmV4cG9ydCBjb25zdCBwb2ludFZpc0NvbmZpZ3MgPSB7XG4gIHJhZGl1czogJ3JhZGl1cycsXG4gIGZpeGVkUmFkaXVzOiAnZml4ZWRSYWRpdXMnLFxuICBvcGFjaXR5OiAnb3BhY2l0eScsXG4gIGNvbG9yUmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgcmFkaXVzUmFuZ2U6ICdyYWRpdXNSYW5nZSdcbn07XG5cbmZ1bmN0aW9uIGZsYXR0ZXJJY29uUG9zaXRpb25zKGljb24pIHtcbiAgLy8gaGFkIHRvIGZsaXAgeSwgc2luY2UgQGx1bWEgbW9kYWwgaGFzIGNoYW5nZWRcbiAgcmV0dXJuIGljb24ubWVzaC5jZWxscy5yZWR1Y2UoKHByZXYsIGNlbGwpID0+IHtcbiAgICBjZWxsLmZvckVhY2gocCA9PiB7XG4gICAgICBwcmV2LnB1c2goXG4gICAgICAgIC4uLltpY29uLm1lc2gucG9zaXRpb25zW3BdWzBdLCAtaWNvbi5tZXNoLnBvc2l0aW9uc1twXVsxXSwgaWNvbi5tZXNoLnBvc2l0aW9uc1twXVsyXV1cbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIFtdKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSWNvbkxheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWdpc3RlclZpc0NvbmZpZyhwb2ludFZpc0NvbmZpZ3MpO1xuICAgIHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvciA9ICgpID0+IGljb25Qb3NBY2Nlc3Nvcih0aGlzLmNvbmZpZy5jb2x1bW5zKTtcbiAgICB0aGlzLmdldEljb25BY2Nlc3NvciA9ICgpID0+IGljb25BY2Nlc3Nvcih0aGlzLmNvbmZpZy5jb2x1bW5zKTtcblxuICAgIC8vIHByZXBhcmUgbGF5ZXIgaW5mbyBtb2RhbFxuICAgIHRoaXMuX2xheWVySW5mb01vZGFsID0gSWNvbkluZm9Nb2RhbEZhY3RvcnkoKTtcbiAgICB0aGlzLmljb25HZW9tZXRyeSA9IHByb3BzLmljb25HZW9tZXRyeSB8fCBudWxsO1xuICAgIHRoaXMuZ2V0U3ZnSWNvbnMoKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnaWNvbic7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIGljb25SZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgY29sdW1uUGFpcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdFBvaW50Q29sdW1uUGFpcnM7XG4gIH1cblxuICBnZXQgbGF5ZXJJY29uKCkge1xuICAgIHJldHVybiBJY29uTGF5ZXJJY29uO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscyxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZSxcbiAgICAgICAgcmFuZ2U6ICdyYWRpdXNSYW5nZScsXG4gICAgICAgIHByb3BlcnR5OiAncmFkaXVzJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogJ3JhZGl1cydcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZ2V0IGxheWVySW5mb01vZGFsKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogJ2ljb25JbmZvJyxcbiAgICAgIHRlbXBsYXRlOiB0aGlzLl9sYXllckluZm9Nb2RhbCxcbiAgICAgIG1vZGFsUHJvcHM6IHtcbiAgICAgICAgdGl0bGU6ICdtb2RhbC5pY29uSW5mby50aXRsZSdcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZ2V0U3ZnSWNvbnMoKSB7XG4gICAgY29uc3QgZmV0Y2hDb25maWcgPSB7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgY2FjaGU6ICduby1jYWNoZSdcbiAgICB9O1xuXG4gICAgaWYgKHdpbmRvdy5mZXRjaCkge1xuICAgICAgd2luZG93XG4gICAgICAgIC5mZXRjaChTVkdfSUNPTl9VUkwsIGZldGNoQ29uZmlnKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgIC50aGVuKChwYXJzZWQgPSB7fSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHtzdmdJY29ucyA9IFtdfSA9IHBhcnNlZDtcbiAgICAgICAgICB0aGlzLmljb25HZW9tZXRyeSA9IHN2Z0ljb25zLnJlZHVjZShcbiAgICAgICAgICAgIChhY2N1LCBjdXJyKSA9PiAoe1xuICAgICAgICAgICAgICAuLi5hY2N1LFxuICAgICAgICAgICAgICBbY3Vyci5pZF06IGZsYXR0ZXJJY29uUG9zaXRpb25zKGN1cnIpXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHRoaXMuX2xheWVySW5mb01vZGFsID0gSWNvbkluZm9Nb2RhbEZhY3Rvcnkoc3ZnSWNvbnMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZmluZERlZmF1bHRMYXllclByb3BzKHtmaWVsZFBhaXJzID0gW10sIGZpZWxkcyA9IFtdfSkge1xuICAgIGNvbnN0IG5vdEZvdW5kID0ge3Byb3BzOiBbXX07XG4gICAgaWYgKCFmaWVsZFBhaXJzLmxlbmd0aCB8fCAhZmllbGRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG5vdEZvdW5kO1xuICAgIH1cblxuICAgIGNvbnN0IGljb25GaWVsZHMgPSBmaWVsZHMuZmlsdGVyKCh7bmFtZX0pID0+XG4gICAgICBuYW1lXG4gICAgICAgIC5yZXBsYWNlKC9bXywuXSsvZywgJyAnKVxuICAgICAgICAudHJpbSgpXG4gICAgICAgIC5zcGxpdCgnICcpXG4gICAgICAgIC5zb21lKHNlZyA9PiBJQ09OX0ZJRUxEUy5pY29uLnNvbWUodCA9PiB0LmluY2x1ZGVzKHNlZykpKVxuICAgICk7XG5cbiAgICBpZiAoIWljb25GaWVsZHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbm90Rm91bmQ7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGljb24gbGF5ZXJzIGZvciBmaXJzdCBwb2ludCBwYWlyXG4gICAgY29uc3QgcHRQYWlyID0gZmllbGRQYWlyc1swXTtcblxuICAgIGNvbnN0IHByb3BzID0gaWNvbkZpZWxkcy5tYXAoaWNvbkZpZWxkID0+ICh7XG4gICAgICBsYWJlbDogaWNvbkZpZWxkLm5hbWUucmVwbGFjZSgvW18sLl0rL2csICcgJykudHJpbSgpLFxuICAgICAgY29sdW1uczoge1xuICAgICAgICBsYXQ6IHB0UGFpci5wYWlyLmxhdCxcbiAgICAgICAgbG5nOiBwdFBhaXIucGFpci5sbmcsXG4gICAgICAgIGljb246IHtcbiAgICAgICAgICB2YWx1ZTogaWNvbkZpZWxkLm5hbWUsXG4gICAgICAgICAgZmllbGRJZHg6IGljb25GaWVsZC50YWJsZUZpZWxkSW5kZXggLSAxXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBpc1Zpc2libGU6IHRydWVcbiAgICB9KSk7XG5cbiAgICByZXR1cm4ge3Byb3BzfTtcbiAgfVxuXG4gIGNhbGN1bGF0ZURhdGFBdHRyaWJ1dGUoe2FsbERhdGEsIGZpbHRlcmVkSW5kZXh9LCBnZXRQb3NpdGlvbikge1xuICAgIGNvbnN0IGdldEljb24gPSB0aGlzLmdldEljb25BY2Nlc3NvcigpO1xuICAgIGNvbnN0IGRhdGEgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsdGVyZWRJbmRleC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaW5kZXggPSBmaWx0ZXJlZEluZGV4W2ldO1xuICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGE6IGFsbERhdGFbaW5kZXhdfSk7XG4gICAgICBjb25zdCBpY29uID0gZ2V0SWNvbih7ZGF0YTogYWxsRGF0YVtpbmRleF19KTtcblxuICAgICAgLy8gaWYgZG9lc24ndCBoYXZlIHBvaW50IGxhdCBvciBsbmcsIGRvIG5vdCBhZGQgdGhlIHBvaW50XG4gICAgICAvLyBkZWNrLmdsIGNhbid0IGhhbmRsZSBwb3NpdGlvbiA9IG51bGxcbiAgICAgIGlmIChwb3MuZXZlcnkoTnVtYmVyLmlzRmluaXRlKSAmJiB0eXBlb2YgaWNvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAgICBpbmRleCxcbiAgICAgICAgICBpY29uLFxuICAgICAgICAgIGRhdGE6IGFsbERhdGFbaW5kZXhdXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZm9ybWF0TGF5ZXJEYXRhKGRhdGFzZXRzLCBvbGRMYXllckRhdGEsIG9wdCA9IHt9KSB7XG4gICAgY29uc3Qge1xuICAgICAgY29sb3JTY2FsZSxcbiAgICAgIGNvbG9yRG9tYWluLFxuICAgICAgY29sb3JGaWVsZCxcbiAgICAgIGNvbG9yLFxuICAgICAgc2l6ZUZpZWxkLFxuICAgICAgc2l6ZVNjYWxlLFxuICAgICAgc2l6ZURvbWFpbixcbiAgICAgIHRleHRMYWJlbCxcbiAgICAgIHZpc0NvbmZpZzoge3JhZGl1c1JhbmdlLCBjb2xvclJhbmdlfVxuICAgIH0gPSB0aGlzLmNvbmZpZztcbiAgICBjb25zdCBnZXRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb25BY2Nlc3NvcigpO1xuXG4gICAgY29uc3Qge2dwdUZpbHRlcn0gPSBkYXRhc2V0c1t0aGlzLmNvbmZpZy5kYXRhSWRdO1xuICAgIGNvbnN0IHtkYXRhLCB0cmlnZ2VyQ2hhbmdlZH0gPSB0aGlzLnVwZGF0ZURhdGEoZGF0YXNldHMsIG9sZExheWVyRGF0YSk7XG5cbiAgICAvLyBwb2ludCBjb2xvclxuICAgIGNvbnN0IGNTY2FsZSA9XG4gICAgICBjb2xvckZpZWxkICYmXG4gICAgICB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShjb2xvclNjYWxlLCBjb2xvckRvbWFpbiwgY29sb3JSYW5nZS5jb2xvcnMubWFwKGhleFRvUmdiKSk7XG5cbiAgICAvLyBwb2ludCByYWRpdXNcbiAgICBjb25zdCByU2NhbGUgPSBzaXplRmllbGQgJiYgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoc2l6ZVNjYWxlLCBzaXplRG9tYWluLCByYWRpdXNSYW5nZSwgMCk7XG5cbiAgICBjb25zdCBnZXRSYWRpdXMgPSByU2NhbGUgPyBkID0+IHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShyU2NhbGUsIGQuZGF0YSwgc2l6ZUZpZWxkKSA6IDE7XG5cbiAgICBjb25zdCBnZXRGaWxsQ29sb3IgPSBjU2NhbGVcbiAgICAgID8gZCA9PiB0aGlzLmdldEVuY29kZWRDaGFubmVsVmFsdWUoY1NjYWxlLCBkLmRhdGEsIGNvbG9yRmllbGQpXG4gICAgICA6IGNvbG9yO1xuXG4gICAgLy8gZ2V0IGFsbCBkaXN0aW5jdCBjaGFyYWN0ZXJzIGluIHRoZSB0ZXh0IGxhYmVsc1xuICAgIGNvbnN0IHRleHRMYWJlbHMgPSBmb3JtYXRUZXh0TGFiZWxEYXRhKHtcbiAgICAgIHRleHRMYWJlbCxcbiAgICAgIHRyaWdnZXJDaGFuZ2VkLFxuICAgICAgb2xkTGF5ZXJEYXRhLFxuICAgICAgZGF0YVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGEsXG4gICAgICBnZXRQb3NpdGlvbixcbiAgICAgIGdldEZpbGxDb2xvcixcbiAgICAgIGdldEZpbHRlclZhbHVlOiBncHVGaWx0ZXIuZmlsdGVyVmFsdWVBY2Nlc3NvcigpLFxuICAgICAgZ2V0UmFkaXVzLFxuICAgICAgdGV4dExhYmVsc1xuICAgIH07XG4gIH1cblxuICB1cGRhdGVMYXllck1ldGEoYWxsRGF0YSwgZ2V0UG9zaXRpb24pIHtcbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFBvaW50c0JvdW5kcyhhbGxEYXRhLCBkID0+IGdldFBvc2l0aW9uKHtkYXRhOiBkfSkpO1xuICAgIHRoaXMudXBkYXRlTWV0YSh7Ym91bmRzfSk7XG4gIH1cblxuICByZW5kZXJMYXllcihvcHRzKSB7XG4gICAgY29uc3Qge2RhdGEsIGdwdUZpbHRlciwgb2JqZWN0SG92ZXJlZCwgbWFwU3RhdGUsIGludGVyYWN0aW9uQ29uZmlnfSA9IG9wdHM7XG5cbiAgICBjb25zdCByYWRpdXNTY2FsZSA9IHRoaXMuZ2V0UmFkaXVzU2NhbGVCeVpvb20obWFwU3RhdGUpO1xuXG4gICAgY29uc3QgbGF5ZXJQcm9wcyA9IHtcbiAgICAgIHJhZGl1c1NjYWxlLFxuICAgICAgLi4uKHRoaXMuY29uZmlnLnZpc0NvbmZpZy5maXhlZFJhZGl1cyA/IHt9IDoge3JhZGl1c01heFBpeGVsczogNTAwfSlcbiAgICB9O1xuXG4gICAgY29uc3QgdXBkYXRlVHJpZ2dlcnMgPSB7XG4gICAgICBnZXRGaWx0ZXJWYWx1ZTogZ3B1RmlsdGVyLmZpbHRlclZhbHVlVXBkYXRlVHJpZ2dlcnMsXG4gICAgICBnZXRSYWRpdXM6IHtcbiAgICAgICAgc2l6ZUZpZWxkOiB0aGlzLmNvbmZpZy5jb2xvckZpZWxkLFxuICAgICAgICByYWRpdXNSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLnJhZGl1c1JhbmdlLFxuICAgICAgICBzaXplU2NhbGU6IHRoaXMuY29uZmlnLnNpemVTY2FsZVxuICAgICAgfSxcbiAgICAgIGdldEZpbGxDb2xvcjoge1xuICAgICAgICBjb2xvcjogdGhpcy5jb25maWcuY29sb3IsXG4gICAgICAgIGNvbG9yRmllbGQ6IHRoaXMuY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICAgIGNvbG9yUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5jb2xvclJhbmdlLFxuICAgICAgICBjb2xvclNjYWxlOiB0aGlzLmNvbmZpZy5jb2xvclNjYWxlXG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGRlZmF1bHRMYXllclByb3BzID0gdGhpcy5nZXREZWZhdWx0RGVja0xheWVyUHJvcHMob3B0cyk7XG4gICAgY29uc3QgYnJ1c2hpbmdQcm9wcyA9IHRoaXMuZ2V0QnJ1c2hpbmdFeHRlbnNpb25Qcm9wcyhpbnRlcmFjdGlvbkNvbmZpZyk7XG4gICAgY29uc3QgZ2V0UGl4ZWxPZmZzZXQgPSBnZXRUZXh0T2Zmc2V0QnlSYWRpdXMocmFkaXVzU2NhbGUsIGRhdGEuZ2V0UmFkaXVzLCBtYXBTdGF0ZSk7XG4gICAgY29uc3QgZXh0ZW5zaW9ucyA9IFsuLi5kZWZhdWx0TGF5ZXJQcm9wcy5leHRlbnNpb25zLCBicnVzaGluZ0V4dGVuc2lvbl07XG5cbiAgICAvLyBzaGFyZWQgUHJvcHMgYmV0d2VlbiBsYXllciBhbmQgbGFiZWwgbGF5ZXJcbiAgICBjb25zdCBzaGFyZWRQcm9wcyA9IHtcbiAgICAgIGdldEZpbHRlclZhbHVlOiBkYXRhLmdldEZpbHRlclZhbHVlLFxuICAgICAgZXh0ZW5zaW9ucyxcbiAgICAgIGZpbHRlclJhbmdlOiBkZWZhdWx0TGF5ZXJQcm9wcy5maWx0ZXJSYW5nZSxcbiAgICAgIC4uLmJydXNoaW5nUHJvcHNcbiAgICB9O1xuXG4gICAgY29uc3QgbGFiZWxMYXllcnMgPSBbXG4gICAgICAuLi50aGlzLnJlbmRlclRleHRMYWJlbExheWVyKFxuICAgICAgICB7XG4gICAgICAgICAgZ2V0UG9zaXRpb246IGRhdGEuZ2V0UG9zaXRpb24sXG4gICAgICAgICAgc2hhcmVkUHJvcHMsXG4gICAgICAgICAgZ2V0UGl4ZWxPZmZzZXQsXG4gICAgICAgICAgdXBkYXRlVHJpZ2dlcnNcbiAgICAgICAgfSxcbiAgICAgICAgb3B0c1xuICAgICAgKVxuICAgIF07XG5cbiAgICByZXR1cm4gIXRoaXMuaWNvbkdlb21ldHJ5XG4gICAgICA/IFtdXG4gICAgICA6IFtcbiAgICAgICAgICBuZXcgU3ZnSWNvbkxheWVyKHtcbiAgICAgICAgICAgIC4uLmRlZmF1bHRMYXllclByb3BzLFxuICAgICAgICAgICAgLi4uYnJ1c2hpbmdQcm9wcyxcbiAgICAgICAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgZ2V0SWNvbkdlb21ldHJ5OiBpZCA9PiB0aGlzLmljb25HZW9tZXRyeVtpZF0sXG5cbiAgICAgICAgICAgIC8vIHVwZGF0ZSB0cmlnZ2Vyc1xuICAgICAgICAgICAgdXBkYXRlVHJpZ2dlcnMsXG4gICAgICAgICAgICBleHRlbnNpb25zXG4gICAgICAgICAgfSksXG5cbiAgICAgICAgICAuLi4odGhpcy5pc0xheWVySG92ZXJlZChvYmplY3RIb3ZlcmVkKVxuICAgICAgICAgICAgPyBbXG4gICAgICAgICAgICAgICAgbmV3IFN2Z0ljb25MYXllcih7XG4gICAgICAgICAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRIb3ZlckxheWVyUHJvcHMoKSxcbiAgICAgICAgICAgICAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAgICAgICAgICAgICBkYXRhOiBbb2JqZWN0SG92ZXJlZC5vYmplY3RdLFxuICAgICAgICAgICAgICAgICAgZ2V0UG9zaXRpb246IGRhdGEuZ2V0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICBnZXRSYWRpdXM6IGRhdGEuZ2V0UmFkaXVzLFxuICAgICAgICAgICAgICAgICAgZ2V0RmlsbENvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcixcbiAgICAgICAgICAgICAgICAgIGdldEljb25HZW9tZXRyeTogaWQgPT4gdGhpcy5pY29uR2VvbWV0cnlbaWRdXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgOiBbXSksXG5cbiAgICAgICAgICAvLyB0ZXh0IGxhYmVsIGxheWVyXG4gICAgICAgICAgLi4ubGFiZWxMYXllcnNcbiAgICAgICAgXTtcbiAgfVxufVxuIl19