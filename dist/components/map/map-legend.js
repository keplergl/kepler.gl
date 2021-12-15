"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.LayerColorLegend = exports.SingleColorLegend = exports.LayerSizeLegend = exports.VisualChannelMetric = exports.StyledMapControlLegend = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _d3Color = require("d3-color");

var _colorLegend = _interopRequireDefault(require("../common/color-legend"));

var _defaultSettings = require("../../constants/default-settings");

var _localization = require("../../localization");

var _templateObject;

var StyledMapControlLegend = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 10px ", "px 10px\n    ", "px;\n  font-size: 11px;\n  border-bottom-color: ", ";\n  border-bottom-style: solid;\n  border-bottom-width: ", ";\n  width: ", "px;\n\n  .legend--layer_name {\n    font-size: 12px;\n    padding-right: ", "px;\n    color: ", ";\n    font-weight: 500;\n  }\n  .legend--layer_type {\n    color: ", ";\n    font-weight: 500;\n    font-size: 11px;\n    padding-right: ", "px;\n  }\n\n  .legend--layer__title {\n    padding-right: ", "px;\n  }\n\n  .legend--layer_by {\n    color: ", ";\n  }\n\n  .legend--layer_color_field {\n    color: ", ";\n    font-weight: 500;\n  }\n\n  .legend--layer_color-legend {\n    margin-top: 6px;\n  }\n"])), function (props) {
  return props.theme.mapControl.padding;
}, function (props) {
  return props.theme.mapControl.padding;
}, function (props) {
  return props.theme.panelBorderColor;
}, function (props) {
  return props.last ? 0 : '1px';
}, function (props) {
  return props.width;
}, function (props) {
  return props.theme.mapControl.padding;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.subtextColor;
}, function (props) {
  return props.theme.mapControl.padding;
}, function (props) {
  return props.theme.mapControl.padding;
}, function (props) {
  return props.theme.subtextColor;
}, function (props) {
  return props.theme.textColorHl;
});

exports.StyledMapControlLegend = StyledMapControlLegend;

var VisualChannelMetric = function VisualChannelMetric(_ref) {
  var name = _ref.name;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "legend--layer__title"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "legend--layer_color_field"
  }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: name
  })));
};

exports.VisualChannelMetric = VisualChannelMetric;

var LayerSizeLegend = function LayerSizeLegend(_ref2) {
  var label = _ref2.label,
      name = _ref2.name;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "legend--layer_size-schema"
  }, /*#__PURE__*/_react["default"].createElement("p", null, /*#__PURE__*/_react["default"].createElement("span", {
    className: "legend--layer_by"
  }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: label
  })), /*#__PURE__*/_react["default"].createElement("span", {
    className: "legend--layer_by"
  }, " by ")), /*#__PURE__*/_react["default"].createElement(VisualChannelMetric, {
    name: name
  }));
};

exports.LayerSizeLegend = LayerSizeLegend;
var SINGLE_COLOR_DOMAIN = [''];
/** @type {typeof import('./map-legend').SingleColorLegend} */

var SingleColorLegend = /*#__PURE__*/_react["default"].memo(function (_ref3) {
  var width = _ref3.width,
      color = _ref3.color;
  return /*#__PURE__*/_react["default"].createElement(_colorLegend["default"], {
    scaleType: "ordinal",
    displayLabel: false,
    domain: SINGLE_COLOR_DOMAIN,
    fieldType: null,
    range: {
      colors: [_d3Color.rgb.apply(void 0, (0, _toConsumableArray2["default"])(color)).toString()]
    },
    width: width
  });
});

exports.SingleColorLegend = SingleColorLegend;
SingleColorLegend.displayName = 'SingleColorLegend';
/** @type {typeof import('./map-legend').LayerColorLegend} */

var LayerColorLegend = /*#__PURE__*/_react["default"].memo(function (_ref4) {
  var description = _ref4.description,
      config = _ref4.config,
      width = _ref4.width,
      colorChannel = _ref4.colorChannel;
  var enableColorBy = description.measure;
  var scale = colorChannel.scale,
      field = colorChannel.field,
      domain = colorChannel.domain,
      range = colorChannel.range,
      property = colorChannel.property;

  var _map = [scale, field, domain].map(function (k) {
    return config[k];
  }),
      _map2 = (0, _slicedToArray2["default"])(_map, 3),
      colorScale = _map2[0],
      colorField = _map2[1],
      colorDomain = _map2[2];

  var colorRange = config.visConfig[range];
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "legend--layer_color-schema"
  }, /*#__PURE__*/_react["default"].createElement("div", null, enableColorBy ? /*#__PURE__*/_react["default"].createElement(VisualChannelMetric, {
    name: enableColorBy
  }) : null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "legend--layer_color-legend"
  }, enableColorBy ? /*#__PURE__*/_react["default"].createElement(_colorLegend["default"], {
    scaleType: colorScale,
    displayLabel: true,
    domain: colorDomain,
    fieldType: colorField && colorField.type || 'real',
    range: colorRange,
    width: width
  }) : /*#__PURE__*/_react["default"].createElement(SingleColorLegend, {
    color: config.visConfig[property] || config[property] || config.color,
    width: width
  })))));
});

exports.LayerColorLegend = LayerColorLegend;
LayerColorLegend.displayName = 'LayerColorLegend';

var isColorChannel = function isColorChannel(visualChannel) {
  return [_defaultSettings.CHANNEL_SCALES.color, _defaultSettings.CHANNEL_SCALES.colorAggr].includes(visualChannel.channelScaleType);
};
/** @type {typeof import('./map-legend').default }> */


var MapLegend = function MapLegend(_ref5) {
  var _ref5$layers = _ref5.layers,
      layers = _ref5$layers === void 0 ? [] : _ref5$layers,
      width = _ref5.width,
      options = _ref5.options;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "map-legend"
  }, layers.map(function (layer, index) {
    if (!layer.isValidToSave() || layer.config.hidden) {
      return null;
    }

    var containerW = width || _defaultSettings.DIMENSIONS.mapControl.width;
    var colorChannels = Object.values(layer.visualChannels).filter(isColorChannel);
    var nonColorChannels = Object.values(layer.visualChannels).filter(function (vc) {
      return !isColorChannel(vc);
    });
    return /*#__PURE__*/_react["default"].createElement(StyledMapControlLegend, {
      className: "legend--layer",
      last: index === layers.length - 1,
      key: index,
      width: containerW
    }, (options === null || options === void 0 ? void 0 : options.showLayerName) !== false ? /*#__PURE__*/_react["default"].createElement("div", {
      className: "legend--layer_name"
    }, layer.config.label) : null, colorChannels.map(function (colorChannel) {
      return !colorChannel.condition || colorChannel.condition(layer.config) ? /*#__PURE__*/_react["default"].createElement(LayerColorLegend, {
        key: colorChannel.key,
        description: layer.getVisualChannelDescription(colorChannel.key),
        config: layer.config,
        width: containerW - 2 * _defaultSettings.DIMENSIONS.mapControl.padding,
        colorChannel: colorChannel
      }) : null;
    }), nonColorChannels.map(function (visualChannel) {
      var matchCondition = !visualChannel.condition || visualChannel.condition(layer.config);
      var enabled = layer.config[visualChannel.field] || visualChannel.defaultMeasure;
      var description = layer.getVisualChannelDescription(visualChannel.key);
      return matchCondition && enabled ? /*#__PURE__*/_react["default"].createElement(LayerSizeLegend, {
        key: visualChannel.key,
        label: description.label,
        name: description.measure
      }) : null;
    }));
  }));
};
/** @type {typeof import('./map-legend').default }> */


var _default = MapLegend;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21hcC9tYXAtbGVnZW5kLmpzIl0sIm5hbWVzIjpbIlN0eWxlZE1hcENvbnRyb2xMZWdlbmQiLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwibWFwQ29udHJvbCIsInBhZGRpbmciLCJwYW5lbEJvcmRlckNvbG9yIiwibGFzdCIsIndpZHRoIiwidGV4dENvbG9yIiwic3VidGV4dENvbG9yIiwidGV4dENvbG9ySGwiLCJWaXN1YWxDaGFubmVsTWV0cmljIiwibmFtZSIsIkxheWVyU2l6ZUxlZ2VuZCIsImxhYmVsIiwiU0lOR0xFX0NPTE9SX0RPTUFJTiIsIlNpbmdsZUNvbG9yTGVnZW5kIiwiUmVhY3QiLCJtZW1vIiwiY29sb3IiLCJjb2xvcnMiLCJyZ2IiLCJ0b1N0cmluZyIsImRpc3BsYXlOYW1lIiwiTGF5ZXJDb2xvckxlZ2VuZCIsImRlc2NyaXB0aW9uIiwiY29uZmlnIiwiY29sb3JDaGFubmVsIiwiZW5hYmxlQ29sb3JCeSIsIm1lYXN1cmUiLCJzY2FsZSIsImZpZWxkIiwiZG9tYWluIiwicmFuZ2UiLCJwcm9wZXJ0eSIsIm1hcCIsImsiLCJjb2xvclNjYWxlIiwiY29sb3JGaWVsZCIsImNvbG9yRG9tYWluIiwiY29sb3JSYW5nZSIsInZpc0NvbmZpZyIsInR5cGUiLCJpc0NvbG9yQ2hhbm5lbCIsInZpc3VhbENoYW5uZWwiLCJDSEFOTkVMX1NDQUxFUyIsImNvbG9yQWdnciIsImluY2x1ZGVzIiwiY2hhbm5lbFNjYWxlVHlwZSIsIk1hcExlZ2VuZCIsImxheWVycyIsIm9wdGlvbnMiLCJsYXllciIsImluZGV4IiwiaXNWYWxpZFRvU2F2ZSIsImhpZGRlbiIsImNvbnRhaW5lclciLCJESU1FTlNJT05TIiwiY29sb3JDaGFubmVscyIsIk9iamVjdCIsInZhbHVlcyIsInZpc3VhbENoYW5uZWxzIiwiZmlsdGVyIiwibm9uQ29sb3JDaGFubmVscyIsInZjIiwibGVuZ3RoIiwic2hvd0xheWVyTmFtZSIsImNvbmRpdGlvbiIsImtleSIsImdldFZpc3VhbENoYW5uZWxEZXNjcmlwdGlvbiIsIm1hdGNoQ29uZGl0aW9uIiwiZW5hYmxlZCIsImRlZmF1bHRNZWFzdXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFTyxJQUFNQSxzQkFBc0IsR0FBR0MsNkJBQU9DLEdBQVYsb3ZCQUNqQixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFVBQVosQ0FBdUJDLE9BQTNCO0FBQUEsQ0FEWSxFQUU3QixVQUFBSCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFVBQVosQ0FBdUJDLE9BQTNCO0FBQUEsQ0FGd0IsRUFJVixVQUFBSCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlHLGdCQUFoQjtBQUFBLENBSkssRUFNVixVQUFBSixLQUFLO0FBQUEsU0FBS0EsS0FBSyxDQUFDSyxJQUFOLEdBQWEsQ0FBYixHQUFpQixLQUF0QjtBQUFBLENBTkssRUFPeEIsVUFBQUwsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ00sS0FBVjtBQUFBLENBUG1CLEVBV2QsVUFBQU4sS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxVQUFaLENBQXVCQyxPQUEzQjtBQUFBLENBWFMsRUFZdEIsVUFBQUgsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZTSxTQUFoQjtBQUFBLENBWmlCLEVBZ0J0QixVQUFBUCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlPLFlBQWhCO0FBQUEsQ0FoQmlCLEVBbUJkLFVBQUFSLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsVUFBWixDQUF1QkMsT0FBM0I7QUFBQSxDQW5CUyxFQXVCZCxVQUFBSCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFVBQVosQ0FB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LEdBaERBLENBREgsQ0FEZ0I7QUFBQSxDQUFsQjtBQXNEQTs7O2VBQ2VvQixTIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtyZ2J9IGZyb20gJ2QzLWNvbG9yJztcbmltcG9ydCBDb2xvckxlZ2VuZCBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9jb2xvci1sZWdlbmQnO1xuaW1wb3J0IHtDSEFOTkVMX1NDQUxFUywgRElNRU5TSU9OU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuXG5leHBvcnQgY29uc3QgU3R5bGVkTWFwQ29udHJvbExlZ2VuZCA9IHN0eWxlZC5kaXZgXG4gIHBhZGRpbmc6IDEwcHggJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tYXBDb250cm9sLnBhZGRpbmd9cHggMTBweFxuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubWFwQ29udHJvbC5wYWRkaW5nfXB4O1xuICBmb250LXNpemU6IDExcHg7XG4gIGJvcmRlci1ib3R0b20tY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCb3JkZXJDb2xvcn07XG4gIGJvcmRlci1ib3R0b20tc3R5bGU6IHNvbGlkO1xuICBib3JkZXItYm90dG9tLXdpZHRoOiAke3Byb3BzID0+IChwcm9wcy5sYXN0ID8gMCA6ICcxcHgnKX07XG4gIHdpZHRoOiAke3Byb3BzID0+IHByb3BzLndpZHRofXB4O1xuXG4gIC5sZWdlbmQtLWxheWVyX25hbWUge1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBwYWRkaW5nLXJpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1hcENvbnRyb2wucGFkZGluZ31weDtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIH1cbiAgLmxlZ2VuZC0tbGF5ZXJfdHlwZSB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3VidGV4dENvbG9yfTtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICBwYWRkaW5nLXJpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1hcENvbnRyb2wucGFkZGluZ31weDtcbiAgfVxuXG4gIC5sZWdlbmQtLWxheWVyX190aXRsZSB7XG4gICAgcGFkZGluZy1yaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tYXBDb250cm9sLnBhZGRpbmd9cHg7XG4gIH1cblxuICAubGVnZW5kLS1sYXllcl9ieSB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3VidGV4dENvbG9yfTtcbiAgfVxuXG4gIC5sZWdlbmQtLWxheWVyX2NvbG9yX2ZpZWxkIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgfVxuXG4gIC5sZWdlbmQtLWxheWVyX2NvbG9yLWxlZ2VuZCB7XG4gICAgbWFyZ2luLXRvcDogNnB4O1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgVmlzdWFsQ2hhbm5lbE1ldHJpYyA9ICh7bmFtZX0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImxlZ2VuZC0tbGF5ZXJfX3RpdGxlXCI+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJsZWdlbmQtLWxheWVyX2NvbG9yX2ZpZWxkXCI+XG4gICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXtuYW1lfSAvPlxuICAgICAgPC9zcGFuPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IExheWVyU2l6ZUxlZ2VuZCA9ICh7bGFiZWwsIG5hbWV9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwibGVnZW5kLS1sYXllcl9zaXplLXNjaGVtYVwiPlxuICAgIDxwPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibGVnZW5kLS1sYXllcl9ieVwiPlxuICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17bGFiZWx9IC8+XG4gICAgICA8L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJsZWdlbmQtLWxheWVyX2J5XCI+IGJ5IDwvc3Bhbj5cbiAgICA8L3A+XG4gICAgPFZpc3VhbENoYW5uZWxNZXRyaWMgbmFtZT17bmFtZX0gLz5cbiAgPC9kaXY+XG4pO1xuXG5jb25zdCBTSU5HTEVfQ09MT1JfRE9NQUlOID0gWycnXTtcblxuLyoqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL21hcC1sZWdlbmQnKS5TaW5nbGVDb2xvckxlZ2VuZH0gKi9cbmV4cG9ydCBjb25zdCBTaW5nbGVDb2xvckxlZ2VuZCA9IFJlYWN0Lm1lbW8oKHt3aWR0aCwgY29sb3J9KSA9PiAoXG4gIDxDb2xvckxlZ2VuZFxuICAgIHNjYWxlVHlwZT1cIm9yZGluYWxcIlxuICAgIGRpc3BsYXlMYWJlbD17ZmFsc2V9XG4gICAgZG9tYWluPXtTSU5HTEVfQ09MT1JfRE9NQUlOfVxuICAgIGZpZWxkVHlwZT17bnVsbH1cbiAgICByYW5nZT17e2NvbG9yczogW3JnYiguLi5jb2xvcikudG9TdHJpbmcoKV19fVxuICAgIHdpZHRoPXt3aWR0aH1cbiAgLz5cbikpO1xuXG5TaW5nbGVDb2xvckxlZ2VuZC5kaXNwbGF5TmFtZSA9ICdTaW5nbGVDb2xvckxlZ2VuZCc7XG5cbi8qKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9tYXAtbGVnZW5kJykuTGF5ZXJDb2xvckxlZ2VuZH0gKi9cbmV4cG9ydCBjb25zdCBMYXllckNvbG9yTGVnZW5kID0gUmVhY3QubWVtbygoe2Rlc2NyaXB0aW9uLCBjb25maWcsIHdpZHRoLCBjb2xvckNoYW5uZWx9KSA9PiB7XG4gIGNvbnN0IGVuYWJsZUNvbG9yQnkgPSBkZXNjcmlwdGlvbi5tZWFzdXJlO1xuICBjb25zdCB7c2NhbGUsIGZpZWxkLCBkb21haW4sIHJhbmdlLCBwcm9wZXJ0eX0gPSBjb2xvckNoYW5uZWw7XG4gIGNvbnN0IFtjb2xvclNjYWxlLCBjb2xvckZpZWxkLCBjb2xvckRvbWFpbl0gPSBbc2NhbGUsIGZpZWxkLCBkb21haW5dLm1hcChrID0+IGNvbmZpZ1trXSk7XG4gIGNvbnN0IGNvbG9yUmFuZ2UgPSBjb25maWcudmlzQ29uZmlnW3JhbmdlXTtcblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImxlZ2VuZC0tbGF5ZXJfY29sb3Itc2NoZW1hXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAge2VuYWJsZUNvbG9yQnkgPyA8VmlzdWFsQ2hhbm5lbE1ldHJpYyBuYW1lPXtlbmFibGVDb2xvckJ5fSAvPiA6IG51bGx9XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsZWdlbmQtLWxheWVyX2NvbG9yLWxlZ2VuZFwiPlxuICAgICAgICAgICAge2VuYWJsZUNvbG9yQnkgPyAoXG4gICAgICAgICAgICAgIDxDb2xvckxlZ2VuZFxuICAgICAgICAgICAgICAgIHNjYWxlVHlwZT17Y29sb3JTY2FsZX1cbiAgICAgICAgICAgICAgICBkaXNwbGF5TGFiZWxcbiAgICAgICAgICAgICAgICBkb21haW49e2NvbG9yRG9tYWlufVxuICAgICAgICAgICAgICAgIGZpZWxkVHlwZT17KGNvbG9yRmllbGQgJiYgY29sb3JGaWVsZC50eXBlKSB8fCAncmVhbCd9XG4gICAgICAgICAgICAgICAgcmFuZ2U9e2NvbG9yUmFuZ2V9XG4gICAgICAgICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPFNpbmdsZUNvbG9yTGVnZW5kXG4gICAgICAgICAgICAgICAgY29sb3I9e2NvbmZpZy52aXNDb25maWdbcHJvcGVydHldIHx8IGNvbmZpZ1twcm9wZXJ0eV0gfHwgY29uZmlnLmNvbG9yfVxuICAgICAgICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59KTtcblxuTGF5ZXJDb2xvckxlZ2VuZC5kaXNwbGF5TmFtZSA9ICdMYXllckNvbG9yTGVnZW5kJztcblxuY29uc3QgaXNDb2xvckNoYW5uZWwgPSB2aXN1YWxDaGFubmVsID0+XG4gIFtDSEFOTkVMX1NDQUxFUy5jb2xvciwgQ0hBTk5FTF9TQ0FMRVMuY29sb3JBZ2dyXS5pbmNsdWRlcyh2aXN1YWxDaGFubmVsLmNoYW5uZWxTY2FsZVR5cGUpO1xuXG4vKiogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLWxlZ2VuZCcpLmRlZmF1bHQgfT4gKi9cbmNvbnN0IE1hcExlZ2VuZCA9ICh7bGF5ZXJzID0gW10sIHdpZHRoLCBvcHRpb25zfSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cIm1hcC1sZWdlbmRcIj5cbiAgICB7bGF5ZXJzLm1hcCgobGF5ZXIsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoIWxheWVyLmlzVmFsaWRUb1NhdmUoKSB8fCBsYXllci5jb25maWcuaGlkZGVuKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgY29uc3QgY29udGFpbmVyVyA9IHdpZHRoIHx8IERJTUVOU0lPTlMubWFwQ29udHJvbC53aWR0aDtcbiAgICAgIGNvbnN0IGNvbG9yQ2hhbm5lbHMgPSBPYmplY3QudmFsdWVzKGxheWVyLnZpc3VhbENoYW5uZWxzKS5maWx0ZXIoaXNDb2xvckNoYW5uZWwpO1xuICAgICAgY29uc3Qgbm9uQ29sb3JDaGFubmVscyA9IE9iamVjdC52YWx1ZXMobGF5ZXIudmlzdWFsQ2hhbm5lbHMpLmZpbHRlcihcbiAgICAgICAgdmMgPT4gIWlzQ29sb3JDaGFubmVsKHZjKVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZE1hcENvbnRyb2xMZWdlbmRcbiAgICAgICAgICBjbGFzc05hbWU9XCJsZWdlbmQtLWxheWVyXCJcbiAgICAgICAgICBsYXN0PXtpbmRleCA9PT0gbGF5ZXJzLmxlbmd0aCAtIDF9XG4gICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICB3aWR0aD17Y29udGFpbmVyV31cbiAgICAgICAgPlxuICAgICAgICAgIHtvcHRpb25zPy5zaG93TGF5ZXJOYW1lICE9PSBmYWxzZSA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGVnZW5kLS1sYXllcl9uYW1lXCI+e2xheWVyLmNvbmZpZy5sYWJlbH08L2Rpdj5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICB7Y29sb3JDaGFubmVscy5tYXAoY29sb3JDaGFubmVsID0+XG4gICAgICAgICAgICAhY29sb3JDaGFubmVsLmNvbmRpdGlvbiB8fCBjb2xvckNoYW5uZWwuY29uZGl0aW9uKGxheWVyLmNvbmZpZykgPyAoXG4gICAgICAgICAgICAgIDxMYXllckNvbG9yTGVnZW5kXG4gICAgICAgICAgICAgICAga2V5PXtjb2xvckNoYW5uZWwua2V5fVxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uPXtsYXllci5nZXRWaXN1YWxDaGFubmVsRGVzY3JpcHRpb24oY29sb3JDaGFubmVsLmtleSl9XG4gICAgICAgICAgICAgICAgY29uZmlnPXtsYXllci5jb25maWd9XG4gICAgICAgICAgICAgICAgd2lkdGg9e2NvbnRhaW5lclcgLSAyICogRElNRU5TSU9OUy5tYXBDb250cm9sLnBhZGRpbmd9XG4gICAgICAgICAgICAgICAgY29sb3JDaGFubmVsPXtjb2xvckNoYW5uZWx9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogbnVsbFxuICAgICAgICAgICl9XG4gICAgICAgICAge25vbkNvbG9yQ2hhbm5lbHMubWFwKHZpc3VhbENoYW5uZWwgPT4ge1xuICAgICAgICAgICAgY29uc3QgbWF0Y2hDb25kaXRpb24gPVxuICAgICAgICAgICAgICAhdmlzdWFsQ2hhbm5lbC5jb25kaXRpb24gfHwgdmlzdWFsQ2hhbm5lbC5jb25kaXRpb24obGF5ZXIuY29uZmlnKTtcbiAgICAgICAgICAgIGNvbnN0IGVuYWJsZWQgPSBsYXllci5jb25maWdbdmlzdWFsQ2hhbm5lbC5maWVsZF0gfHwgdmlzdWFsQ2hhbm5lbC5kZWZhdWx0TWVhc3VyZTtcblxuICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBsYXllci5nZXRWaXN1YWxDaGFubmVsRGVzY3JpcHRpb24odmlzdWFsQ2hhbm5lbC5rZXkpO1xuXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hDb25kaXRpb24gJiYgZW5hYmxlZCA/IChcbiAgICAgICAgICAgICAgPExheWVyU2l6ZUxlZ2VuZFxuICAgICAgICAgICAgICAgIGtleT17dmlzdWFsQ2hhbm5lbC5rZXl9XG4gICAgICAgICAgICAgICAgbGFiZWw9e2Rlc2NyaXB0aW9uLmxhYmVsfVxuICAgICAgICAgICAgICAgIG5hbWU9e2Rlc2NyaXB0aW9uLm1lYXN1cmV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogbnVsbDtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9TdHlsZWRNYXBDb250cm9sTGVnZW5kPlxuICAgICAgKTtcbiAgICB9KX1cbiAgPC9kaXY+XG4pO1xuXG4vKiogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vbWFwLWxlZ2VuZCcpLmRlZmF1bHQgfT4gKi9cbmV4cG9ydCBkZWZhdWx0IE1hcExlZ2VuZDtcbiJdfQ==