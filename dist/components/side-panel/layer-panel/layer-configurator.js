"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = LayerConfiguratorFactory;
exports.AggregationTypeSelector = exports.AggrScaleSelector = exports.ChannelByValueSelector = exports.LayerColorRangeSelector = exports.ArcLayerColorSelector = exports.LayerColorSelector = exports.HowToButton = exports.getLayerChannelConfigProps = exports.getVisConfiguratorProps = exports.getLayerConfiguratorProps = exports.getLayerFields = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactIntl = require("react-intl");

var _styledComponents2 = require("../../common/styled-components");

var _itemSelector = _interopRequireDefault(require("../../common/item-selector/item-selector"));

var _visConfigByFieldSelector = _interopRequireDefault(require("./vis-config-by-field-selector"));

var _layerColumnConfig = _interopRequireDefault(require("./layer-column-config"));

var _layerTypeSelector = _interopRequireDefault(require("./layer-type-selector"));

var _dimensionScaleSelector = _interopRequireDefault(require("./dimension-scale-selector"));

var _colorSelector = _interopRequireDefault(require("./color-selector"));

var _sourceDataSelector = _interopRequireDefault(require("../common/source-data-selector"));

var _visConfigSwitch = _interopRequireDefault(require("./vis-config-switch"));

var _visConfigSlider = _interopRequireDefault(require("./vis-config-slider"));

var _layerConfigGroup = _interopRequireWildcard(require("./layer-config-group"));

var _textLabelPanel = _interopRequireDefault(require("./text-label-panel"));

var _utils = require("../../../utils/utils");

var _defaultSettings = require("../../../constants/default-settings");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n  right: 12px;\n  top: -4px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-top: 12px;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: relative;\n  margin-top: 12px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledLayerConfigurator = _styledComponents["default"].div.attrs({
  className: 'layer-panel__config'
})(_templateObject());

var StyledLayerVisualConfigurator = _styledComponents["default"].div.attrs({
  className: 'layer-panel__config__visualC-config'
})(_templateObject2());

var getLayerFields = function getLayerFields(datasets, layer) {
  return datasets[layer.config.dataId] ? datasets[layer.config.dataId].fields : [];
};

exports.getLayerFields = getLayerFields;

var getLayerConfiguratorProps = function getLayerConfiguratorProps(props) {
  return {
    layer: props.layer,
    fields: getLayerFields(props.datasets, props.layer),
    onChange: props.updateLayerConfig,
    setColorUI: props.updateLayerColorUI
  };
};

exports.getLayerConfiguratorProps = getLayerConfiguratorProps;

var getVisConfiguratorProps = function getVisConfiguratorProps(props) {
  return {
    layer: props.layer,
    fields: getLayerFields(props.datasets, props.layer),
    onChange: props.updateLayerVisConfig,
    setColorUI: props.updateLayerColorUI
  };
};

exports.getVisConfiguratorProps = getVisConfiguratorProps;

var getLayerChannelConfigProps = function getLayerChannelConfigProps(props) {
  return {
    layer: props.layer,
    fields: getLayerFields(props.datasets, props.layer),
    onChange: props.updateLayerVisualChannelConfig
  };
};

exports.getLayerChannelConfigProps = getLayerChannelConfigProps;
LayerConfiguratorFactory.deps = [_sourceDataSelector["default"], _visConfigSlider["default"], _textLabelPanel["default"]];

function LayerConfiguratorFactory(SourceDataSelector, VisConfigSlider, TextLabelPanel) {
  var LayerConfigurator =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(LayerConfigurator, _Component);

    function LayerConfigurator() {
      (0, _classCallCheck2["default"])(this, LayerConfigurator);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(LayerConfigurator).apply(this, arguments));
    }

    (0, _createClass2["default"])(LayerConfigurator, [{
      key: "_renderPointLayerConfig",
      value: function _renderPointLayerConfig(props) {
        return this._renderScatterplotLayerConfig(props);
      }
    }, {
      key: "_renderIconLayerConfig",
      value: function _renderIconLayerConfig(props) {
        return this._renderScatterplotLayerConfig(props);
      }
    }, {
      key: "_renderScatterplotLayerConfig",
      value: function _renderScatterplotLayerConfig(_ref) {
        var layer = _ref.layer,
            visConfiguratorProps = _ref.visConfiguratorProps,
            layerChannelConfigProps = _ref.layerChannelConfigProps,
            layerConfiguratorProps = _ref.layerConfiguratorProps;
        return _react["default"].createElement(StyledLayerVisualConfigurator, null, _react["default"].createElement(_layerConfigGroup["default"], (0, _extends2["default"])({}, layer.visConfigSettings.filled || {
          label: 'layer.color'
        }, visConfiguratorProps, {
          collapsible: true
        }), layer.config.colorField ? _react["default"].createElement(LayerColorRangeSelector, visConfiguratorProps) : _react["default"].createElement(LayerColorSelector, layerConfiguratorProps), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.color
        }, layerChannelConfigProps)), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.opacity, visConfiguratorProps)))), layer.type === _defaultSettings.LAYER_TYPES.point ? _react["default"].createElement(_layerConfigGroup["default"], (0, _extends2["default"])({}, layer.visConfigSettings.outline, visConfiguratorProps, {
          collapsible: true
        }), layer.config.strokeColorField ? _react["default"].createElement(LayerColorRangeSelector, (0, _extends2["default"])({}, visConfiguratorProps, {
          property: "strokeColorRange"
        })) : _react["default"].createElement(LayerColorSelector, (0, _extends2["default"])({}, visConfiguratorProps, {
          selectedColor: layer.config.visConfig.strokeColor,
          property: "strokeColor"
        })), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.strokeColor
        }, layerChannelConfigProps)), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.thickness, visConfiguratorProps, {
          disabled: !layer.config.visConfig.outline
        })))) : null, _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.radius',
          collapsible: true
        }, !layer.config.sizeField ? _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.radius, visConfiguratorProps, {
          label: false,
          disabled: Boolean(layer.config.sizeField)
        })) : _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.radiusRange, visConfiguratorProps, {
          label: false,
          disabled: !layer.config.sizeField || layer.config.visConfig.fixedRadius
        })), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.size
        }, layerChannelConfigProps)), layer.config.sizeField ? _react["default"].createElement(_visConfigSwitch["default"], (0, _extends2["default"])({}, layer.visConfigSettings.fixedRadius, visConfiguratorProps)) : null)), _react["default"].createElement(TextLabelPanel, {
          fields: visConfiguratorProps.fields,
          updateLayerTextLabel: this.props.updateLayerTextLabel,
          textLabel: layer.config.textLabel,
          colorPalette: visConfiguratorProps.colorPalette,
          setColorPaletteUI: visConfiguratorProps.setColorPaletteUI
        }));
      }
    }, {
      key: "_renderClusterLayerConfig",
      value: function _renderClusterLayerConfig(_ref2) {
        var layer = _ref2.layer,
            visConfiguratorProps = _ref2.visConfiguratorProps,
            layerConfiguratorProps = _ref2.layerConfiguratorProps,
            layerChannelConfigProps = _ref2.layerChannelConfigProps;
        return _react["default"].createElement(StyledLayerVisualConfigurator, null, _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.color',
          collapsible: true
        }, _react["default"].createElement(LayerColorRangeSelector, visConfiguratorProps), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(AggrScaleSelector, (0, _extends2["default"])({}, layerConfiguratorProps, {
          channel: layer.visualChannels.color
        })), _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.color
        }, layerChannelConfigProps)), layer.visConfigSettings.colorAggregation.condition(layer.config) ? _react["default"].createElement(AggregationTypeSelector, (0, _extends2["default"])({}, layer.visConfigSettings.colorAggregation, layerChannelConfigProps, {
          channel: layer.visualChannels.color
        })) : null, _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.opacity, visConfiguratorProps)))), _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.radius',
          collapsible: true
        }, _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.clusterRadius, visConfiguratorProps)), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.radiusRange, visConfiguratorProps)))));
      }
    }, {
      key: "_renderHeatmapLayerConfig",
      value: function _renderHeatmapLayerConfig(_ref3) {
        var layer = _ref3.layer,
            visConfiguratorProps = _ref3.visConfiguratorProps,
            layerConfiguratorProps = _ref3.layerConfiguratorProps,
            layerChannelConfigProps = _ref3.layerChannelConfigProps;
        return _react["default"].createElement(StyledLayerVisualConfigurator, null, _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.color',
          collapsible: true
        }, _react["default"].createElement(LayerColorRangeSelector, visConfiguratorProps), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.opacity, visConfiguratorProps)))), _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.radius'
        }, _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.radius, visConfiguratorProps, {
          label: false
        }))), _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.weight'
        }, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.weight
        }, layerChannelConfigProps))));
      }
    }, {
      key: "_renderGridLayerConfig",
      value: function _renderGridLayerConfig(props) {
        return this._renderAggregationLayerConfig(props);
      }
    }, {
      key: "_renderHexagonLayerConfig",
      value: function _renderHexagonLayerConfig(props) {
        return this._renderAggregationLayerConfig(props);
      }
    }, {
      key: "_renderAggregationLayerConfig",
      value: function _renderAggregationLayerConfig(_ref4) {
        var layer = _ref4.layer,
            visConfiguratorProps = _ref4.visConfiguratorProps,
            layerConfiguratorProps = _ref4.layerConfiguratorProps,
            layerChannelConfigProps = _ref4.layerChannelConfigProps;
        var config = layer.config;
        var enable3d = config.visConfig.enable3d;
        var elevationByDescription = 'layer.elevationByDescription';
        var colorByDescription = 'layer.colorByDescription';
        return _react["default"].createElement(StyledLayerVisualConfigurator, null, _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.color',
          collapsible: true
        }, _react["default"].createElement(LayerColorRangeSelector, visConfiguratorProps), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(AggrScaleSelector, (0, _extends2["default"])({}, layerConfiguratorProps, {
          channel: layer.visualChannels.color
        })), _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.color
        }, layerChannelConfigProps)), layer.visConfigSettings.colorAggregation.condition(layer.config) ? _react["default"].createElement(AggregationTypeSelector, (0, _extends2["default"])({}, layer.visConfigSettings.colorAggregation, layerChannelConfigProps, {
          description: colorByDescription,
          channel: layer.visualChannels.color
        })) : null, layer.visConfigSettings.percentile && layer.visConfigSettings.percentile.condition(layer.config) ? _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.percentile, visConfiguratorProps)) : null, _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.opacity, visConfiguratorProps)))), _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.radius',
          collapsible: true
        }, _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.worldUnitSize, visConfiguratorProps)), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.coverage, visConfiguratorProps)))), layer.visConfigSettings.enable3d ? _react["default"].createElement(_layerConfigGroup["default"], (0, _extends2["default"])({}, layer.visConfigSettings.enable3d, visConfiguratorProps, {
          collapsible: true
        }), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.elevationScale, visConfiguratorProps)), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(AggrScaleSelector, (0, _extends2["default"])({}, layerConfiguratorProps, {
          channel: layer.visualChannels.size
        })), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.sizeRange, visConfiguratorProps)), _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({}, layerChannelConfigProps, {
          channel: layer.visualChannels.size,
          description: elevationByDescription,
          disabled: !enable3d
        })), layer.visConfigSettings.sizeAggregation.condition(layer.config) ? _react["default"].createElement(AggregationTypeSelector, (0, _extends2["default"])({}, layer.visConfigSettings.sizeAggregation, layerChannelConfigProps, {
          channel: layer.visualChannels.size
        })) : null, layer.visConfigSettings.elevationPercentile.condition(layer.config) ? _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.elevationPercentile, visConfiguratorProps)) : null)) : null);
      } // TODO: Shan move these into layer class

    }, {
      key: "_renderHexagonIdLayerConfig",
      value: function _renderHexagonIdLayerConfig(_ref5) {
        var layer = _ref5.layer,
            visConfiguratorProps = _ref5.visConfiguratorProps,
            layerConfiguratorProps = _ref5.layerConfiguratorProps,
            layerChannelConfigProps = _ref5.layerChannelConfigProps;
        return _react["default"].createElement(StyledLayerVisualConfigurator, null, _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.color',
          collapsible: true
        }, layer.config.colorField ? _react["default"].createElement(LayerColorRangeSelector, visConfiguratorProps) : _react["default"].createElement(LayerColorSelector, layerConfiguratorProps), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.color
        }, layerChannelConfigProps)), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.opacity, visConfiguratorProps)))), _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.coverage',
          collapsible: true
        }, !layer.config.coverageField ? _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.coverage, visConfiguratorProps, {
          label: false
        })) : _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.coverageRange, visConfiguratorProps, {
          label: false
        })), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.coverage
        }, layerChannelConfigProps)))), _react["default"].createElement(_layerConfigGroup["default"], (0, _extends2["default"])({}, layer.visConfigSettings.enable3d, visConfiguratorProps, {
          collapsible: true
        }), _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.size
        }, layerChannelConfigProps)), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.elevationScale, visConfiguratorProps)), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.sizeRange, visConfiguratorProps, {
          label: "layerVisConfigs.heightRange"
        })))));
      }
    }, {
      key: "_renderArcLayerConfig",
      value: function _renderArcLayerConfig(args) {
        return this._renderLineLayerConfig(args);
      }
    }, {
      key: "_renderLineLayerConfig",
      value: function _renderLineLayerConfig(_ref6) {
        var layer = _ref6.layer,
            visConfiguratorProps = _ref6.visConfiguratorProps,
            layerConfiguratorProps = _ref6.layerConfiguratorProps,
            layerChannelConfigProps = _ref6.layerChannelConfigProps;
        return _react["default"].createElement(StyledLayerVisualConfigurator, null, _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.color',
          collapsible: true
        }, layer.config.colorField ? _react["default"].createElement(LayerColorRangeSelector, visConfiguratorProps) : _react["default"].createElement(ArcLayerColorSelector, {
          layer: layer,
          setColorUI: layerConfiguratorProps.setColorUI,
          onChangeConfig: layerConfiguratorProps.onChange,
          onChangeVisConfig: visConfiguratorProps.onChange
        }), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.color
        }, layerChannelConfigProps)), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.opacity, visConfiguratorProps)))), _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.stroke',
          collapsible: true
        }, layer.config.sizeField ? _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.sizeRange, visConfiguratorProps, {
          disabled: !layer.config.sizeField,
          label: false
        })) : _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.thickness, visConfiguratorProps, {
          label: false
        })), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.size
        }, layerChannelConfigProps)))));
      }
    }, {
      key: "_renderTripLayerConfig",
      value: function _renderTripLayerConfig(_ref7) {
        var layer = _ref7.layer,
            visConfiguratorProps = _ref7.visConfiguratorProps,
            layerConfiguratorProps = _ref7.layerConfiguratorProps,
            layerChannelConfigProps = _ref7.layerChannelConfigProps;
        var _layer$meta$featureTy = layer.meta.featureTypes,
            featureTypes = _layer$meta$featureTy === void 0 ? {} : _layer$meta$featureTy;
        return _react["default"].createElement(StyledLayerVisualConfigurator, null, _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.color',
          collapsible: true
        }, layer.config.colorField ? _react["default"].createElement(LayerColorRangeSelector, visConfiguratorProps) : _react["default"].createElement(LayerColorSelector, layerConfiguratorProps), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.color
        }, layerChannelConfigProps)), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.opacity, visConfiguratorProps)))), _react["default"].createElement(_layerConfigGroup["default"], (0, _extends2["default"])({}, visConfiguratorProps, {
          label: "layer.strokeWidth",
          collapsible: true
        }), layer.config.sizeField ? _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.sizeRange, visConfiguratorProps, {
          label: false
        })) : _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.thickness, visConfiguratorProps, {
          label: false
        })), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.size
        }, layerChannelConfigProps)))), _react["default"].createElement(_layerConfigGroup["default"], (0, _extends2["default"])({}, visConfiguratorProps, featureTypes.polygon ? layer.visConfigSettings.stroked : {}, {
          label: "layer.trailLength",
          description: "layer.trailLengthDescription"
        }), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.trailLength, visConfiguratorProps, {
          label: false
        }))));
      }
    }, {
      key: "_renderGeojsonLayerConfig",
      value: function _renderGeojsonLayerConfig(_ref8) {
        var layer = _ref8.layer,
            visConfiguratorProps = _ref8.visConfiguratorProps,
            layerConfiguratorProps = _ref8.layerConfiguratorProps,
            layerChannelConfigProps = _ref8.layerChannelConfigProps;
        var _layer$meta$featureTy2 = layer.meta.featureTypes,
            featureTypes = _layer$meta$featureTy2 === void 0 ? {} : _layer$meta$featureTy2,
            visConfig = layer.config.visConfig;
        return _react["default"].createElement(StyledLayerVisualConfigurator, null, featureTypes.polygon || featureTypes.point ? _react["default"].createElement(_layerConfigGroup["default"], (0, _extends2["default"])({}, layer.visConfigSettings.filled, visConfiguratorProps, {
          label: "layer.fillColor",
          collapsible: true
        }), layer.config.colorField ? _react["default"].createElement(LayerColorRangeSelector, visConfiguratorProps) : _react["default"].createElement(LayerColorSelector, layerConfiguratorProps), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.color
        }, layerChannelConfigProps)), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.opacity, visConfiguratorProps)))) : null, _react["default"].createElement(_layerConfigGroup["default"], (0, _extends2["default"])({}, layer.visConfigSettings.stroked, visConfiguratorProps, {
          label: "layer.strokeColor",
          collapsible: true
        }), layer.config.strokeColorField ? _react["default"].createElement(LayerColorRangeSelector, (0, _extends2["default"])({}, visConfiguratorProps, {
          property: "strokeColorRange"
        })) : _react["default"].createElement(LayerColorSelector, (0, _extends2["default"])({}, visConfiguratorProps, {
          selectedColor: layer.config.visConfig.strokeColor,
          property: "strokeColor"
        })), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.strokeColor
        }, layerChannelConfigProps)), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.strokeOpacity, visConfiguratorProps)))), _react["default"].createElement(_layerConfigGroup["default"], (0, _extends2["default"])({}, visConfiguratorProps, featureTypes.polygon ? layer.visConfigSettings.stroked : {}, {
          label: "layer.strokeWidth",
          collapsible: true
        }), layer.config.sizeField ? _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.sizeRange, visConfiguratorProps, {
          label: false
        })) : _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.thickness, visConfiguratorProps, {
          label: false
        })), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.size
        }, layerChannelConfigProps)))), featureTypes.polygon ? _react["default"].createElement(_layerConfigGroup["default"], (0, _extends2["default"])({}, visConfiguratorProps, layer.visConfigSettings.enable3d, {
          disabled: !visConfig.filled,
          collapsible: true
        }), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.elevationScale, visConfiguratorProps, {
          label: false
        })), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.height
        }, layerChannelConfigProps)), _react["default"].createElement(_visConfigSwitch["default"], (0, _extends2["default"])({}, visConfiguratorProps, layer.visConfigSettings.wireframe)))) : null, featureTypes.point ? _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.radius',
          collapsible: true
        }, !layer.config.radiusField ? _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.radius, visConfiguratorProps, {
          label: false,
          disabled: Boolean(layer.config.radiusField)
        })) : _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.radiusRange, visConfiguratorProps, {
          label: false,
          disabled: !layer.config.radiusField
        })), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.radius
        }, layerChannelConfigProps)))) : null);
      }
    }, {
      key: "_render3DLayerConfig",
      value: function _render3DLayerConfig(_ref9) {
        var layer = _ref9.layer,
            visConfiguratorProps = _ref9.visConfiguratorProps;
        return _react["default"].createElement(_react.Fragment, null, _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.3DModel',
          collapsible: true
        }, _react["default"].createElement(_styledComponents2.Input, {
          type: "file",
          accept: ".glb,.gltf",
          onChange: function onChange(e) {
            if (e.target.files && e.target.files[0]) {
              var url = URL.createObjectURL(e.target.files[0]);
              visConfiguratorProps.onChange({
                scenegraph: url
              });
            }
          }
        })), _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.3DModelOptions',
          collapsible: true
        }, _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.sizeScale, visConfiguratorProps, {
          disabled: false
        })), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.angleX, visConfiguratorProps, {
          disabled: false
        })), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.angleY, visConfiguratorProps, {
          disabled: false
        })), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.angleZ, visConfiguratorProps, {
          disabled: false
        }))));
      }
    }, {
      key: "_renderS2LayerConfig",
      value: function _renderS2LayerConfig(_ref10) {
        var layer = _ref10.layer,
            visConfiguratorProps = _ref10.visConfiguratorProps,
            layerConfiguratorProps = _ref10.layerConfiguratorProps,
            layerChannelConfigProps = _ref10.layerChannelConfigProps;
        var visConfig = layer.config.visConfig;
        return _react["default"].createElement(StyledLayerVisualConfigurator, null, _react["default"].createElement(_layerConfigGroup["default"], (0, _extends2["default"])({}, layer.visConfigSettings.filled, visConfiguratorProps, {
          label: "layer.fillColor",
          collapsible: true
        }), layer.config.colorField ? _react["default"].createElement(LayerColorRangeSelector, visConfiguratorProps) : _react["default"].createElement(LayerColorSelector, layerConfiguratorProps), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.color
        }, layerChannelConfigProps)), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.opacity, visConfiguratorProps)))), _react["default"].createElement(_layerConfigGroup["default"], (0, _extends2["default"])({}, layer.visConfigSettings.stroked, visConfiguratorProps, {
          label: "layer.strokeColor",
          collapsible: true
        }), layer.config.strokeColorField ? _react["default"].createElement(LayerColorRangeSelector, (0, _extends2["default"])({}, visConfiguratorProps, {
          property: "strokeColorRange"
        })) : _react["default"].createElement(LayerColorSelector, (0, _extends2["default"])({}, visConfiguratorProps, {
          selectedColor: layer.config.visConfig.strokeColor,
          property: "strokeColor"
        })), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.strokeColor
        }, layerChannelConfigProps)))), _react["default"].createElement(_layerConfigGroup["default"], (0, _extends2["default"])({}, visConfiguratorProps, {
          label: "layer.strokeWidth",
          collapsible: true
        }), layer.config.sizeField ? _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.sizeRange, visConfiguratorProps, {
          label: false
        })) : _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.thickness, visConfiguratorProps, {
          label: false
        })), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.size
        }, layerChannelConfigProps)))), _react["default"].createElement(_layerConfigGroup["default"], (0, _extends2["default"])({}, visConfiguratorProps, layer.visConfigSettings.enable3d, {
          disabled: !visConfig.filled,
          collapsible: true
        }), _react["default"].createElement(ChannelByValueSelector, (0, _extends2["default"])({
          channel: layer.visualChannels.height
        }, layerChannelConfigProps)), _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.elevationScale, visConfiguratorProps, {
          label: "layerVisConfigs.elevationScale"
        })), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, _react["default"].createElement(VisConfigSlider, (0, _extends2["default"])({}, layer.visConfigSettings.heightRange, visConfiguratorProps, {
          label: "layerVisConfigs.heightRange"
        })), _react["default"].createElement(_visConfigSwitch["default"], (0, _extends2["default"])({}, visConfiguratorProps, layer.visConfigSettings.wireframe)))));
      }
    }, {
      key: "render",
      value: function render() {
        var _this = this;

        var _this$props = this.props,
            layer = _this$props.layer,
            datasets = _this$props.datasets,
            updateLayerConfig = _this$props.updateLayerConfig,
            layerTypeOptions = _this$props.layerTypeOptions,
            updateLayerType = _this$props.updateLayerType;

        var _ref11 = layer.config.dataId ? datasets[layer.config.dataId] : {},
            _ref11$fields = _ref11.fields,
            fields = _ref11$fields === void 0 ? [] : _ref11$fields,
            fieldPairs = _ref11.fieldPairs;

        var config = layer.config;
        var visConfiguratorProps = getVisConfiguratorProps(this.props);
        var layerConfiguratorProps = getLayerConfiguratorProps(this.props);
        var layerChannelConfigProps = getLayerChannelConfigProps(this.props);
        var renderTemplate = layer.type && "_render".concat((0, _utils.capitalizeFirstLetter)(layer.type), "LayerConfig");
        return _react["default"].createElement(StyledLayerConfigurator, null, layer.layerInfoModal ? _react["default"].createElement(HowToButton, {
          onClick: function onClick() {
            return _this.props.openModal(layer.layerInfoModal);
          }
        }) : null, _react["default"].createElement(_layerConfigGroup["default"], {
          label: 'layer.basic',
          collapsible: true,
          expanded: !layer.hasAllColumns()
        }, _react["default"].createElement(_layerTypeSelector["default"], {
          layer: layer,
          layerTypeOptions: layerTypeOptions,
          onSelect: updateLayerType
        }), _react["default"].createElement(_layerConfigGroup.ConfigGroupCollapsibleContent, null, Object.keys(datasets).length > 1 && _react["default"].createElement(SourceDataSelector, {
          datasets: datasets,
          id: layer.id,
          disabled: layer.type && config.columns,
          dataId: config.dataId,
          onSelect: function onSelect(value) {
            return updateLayerConfig({
              dataId: value
            });
          }
        }), _react["default"].createElement(_layerColumnConfig["default"], {
          columnPairs: layer.columnPairs,
          columns: layer.config.columns,
          assignColumnPairs: layer.assignColumnPairs.bind(layer),
          assignColumn: layer.assignColumn.bind(layer),
          columnLabels: layer.columnLabels,
          fields: fields,
          fieldPairs: fieldPairs,
          updateLayerConfig: updateLayerConfig,
          updateLayerType: this.props.updateLayerType
        }))), this[renderTemplate] && this[renderTemplate]({
          layer: layer,
          visConfiguratorProps: visConfiguratorProps,
          layerChannelConfigProps: layerChannelConfigProps,
          layerConfiguratorProps: layerConfiguratorProps
        }));
      }
    }]);
    return LayerConfigurator;
  }(_react.Component);

  (0, _defineProperty2["default"])(LayerConfigurator, "propTypes", {
    layer: _propTypes["default"].object.isRequired,
    datasets: _propTypes["default"].object.isRequired,
    layerTypeOptions: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
    openModal: _propTypes["default"].func.isRequired,
    updateLayerConfig: _propTypes["default"].func.isRequired,
    updateLayerType: _propTypes["default"].func.isRequired,
    updateLayerVisConfig: _propTypes["default"].func.isRequired,
    updateLayerVisualChannelConfig: _propTypes["default"].func.isRequired,
    updateLayerColorUI: _propTypes["default"].func.isRequired
  });
  return LayerConfigurator;
}
/*
 * Componentize config component into pure functional components
 */


var StyledHowToButton = _styledComponents["default"].div(_templateObject3());

var HowToButton = function HowToButton(_ref12) {
  var onClick = _ref12.onClick;
  return _react["default"].createElement(StyledHowToButton, null, _react["default"].createElement(_styledComponents2.Button, {
    link: true,
    small: true,
    onClick: onClick
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'layerConfiguration.howTo'
  })));
};

exports.HowToButton = HowToButton;

var LayerColorSelector = function LayerColorSelector(_ref13) {
  var layer = _ref13.layer,
      onChange = _ref13.onChange,
      label = _ref13.label,
      selectedColor = _ref13.selectedColor,
      _ref13$property = _ref13.property,
      property = _ref13$property === void 0 ? 'color' : _ref13$property,
      _setColorUI = _ref13.setColorUI;
  return _react["default"].createElement(_styledComponents2.SidePanelSection, null, _react["default"].createElement(_colorSelector["default"], {
    colorSets: [{
      selectedColor: selectedColor || layer.config.color,
      setColor: function setColor(rgbValue) {
        return onChange((0, _defineProperty2["default"])({}, property, rgbValue));
      }
    }],
    colorUI: layer.config.colorUI[property],
    setColorUI: function setColorUI(newConfig) {
      return _setColorUI(property, newConfig);
    }
  }));
};

exports.LayerColorSelector = LayerColorSelector;

var ArcLayerColorSelector = function ArcLayerColorSelector(_ref14) {
  var layer = _ref14.layer,
      onChangeConfig = _ref14.onChangeConfig,
      onChangeVisConfig = _ref14.onChangeVisConfig,
      _ref14$property = _ref14.property,
      property = _ref14$property === void 0 ? 'color' : _ref14$property,
      _setColorUI2 = _ref14.setColorUI;
  return _react["default"].createElement(_styledComponents2.SidePanelSection, null, _react["default"].createElement(_colorSelector["default"], {
    colorSets: [{
      selectedColor: layer.config.color,
      setColor: function setColor(rgbValue) {
        return onChangeConfig({
          color: rgbValue
        });
      },
      label: 'Source'
    }, {
      selectedColor: layer.config.visConfig.targetColor || layer.config.color,
      setColor: function setColor(rgbValue) {
        return onChangeVisConfig({
          targetColor: rgbValue
        });
      },
      label: 'Target'
    }],
    colorUI: layer.config.colorUI[property],
    setColorUI: function setColorUI(newConfig) {
      return _setColorUI2(property, newConfig);
    }
  }));
};

exports.ArcLayerColorSelector = ArcLayerColorSelector;

var LayerColorRangeSelector = function LayerColorRangeSelector(_ref15) {
  var layer = _ref15.layer,
      onChange = _ref15.onChange,
      _ref15$property = _ref15.property,
      property = _ref15$property === void 0 ? 'colorRange' : _ref15$property,
      _setColorUI3 = _ref15.setColorUI;
  return _react["default"].createElement(_styledComponents2.SidePanelSection, null, _react["default"].createElement(_colorSelector["default"], {
    colorSets: [{
      selectedColor: layer.config.visConfig[property],
      isRange: true,
      setColor: function setColor(colorRange) {
        return onChange((0, _defineProperty2["default"])({}, property, colorRange));
      }
    }],
    colorUI: layer.config.colorUI[property],
    setColorUI: function setColorUI(newConfig) {
      return _setColorUI3(property, newConfig);
    }
  }));
};

exports.LayerColorRangeSelector = LayerColorRangeSelector;

var ChannelByValueSelector = function ChannelByValueSelector(_ref16) {
  var layer = _ref16.layer,
      channel = _ref16.channel,
      onChange = _ref16.onChange,
      fields = _ref16.fields,
      description = _ref16.description;
  var channelScaleType = channel.channelScaleType,
      domain = channel.domain,
      field = channel.field,
      key = channel.key,
      property = channel.property,
      range = channel.range,
      scale = channel.scale,
      defaultMeasure = channel.defaultMeasure,
      supportedFieldTypes = channel.supportedFieldTypes;
  var channelSupportedFieldTypes = supportedFieldTypes || _defaultSettings.CHANNEL_SCALE_SUPPORTED_FIELDS[channelScaleType];
  var supportedFields = fields.filter(function (_ref17) {
    var type = _ref17.type;
    return channelSupportedFieldTypes.includes(type);
  });
  var scaleOptions = layer.getScaleOptions(channel.key);
  var showScale = !layer.isAggregated && layer.config[scale] && scaleOptions.length > 1;
  var defaultDescription = 'layerConfiguration.defaultDescription';
  return _react["default"].createElement(_visConfigByFieldSelector["default"], {
    channel: channel.key,
    description: description || defaultDescription,
    domain: layer.config[domain],
    fields: supportedFields,
    id: layer.id,
    key: "".concat(key, "-channel-selector"),
    property: property,
    placeholder: defaultMeasure || 'placeholder.selectField',
    range: layer.config.visConfig[range],
    scaleOptions: scaleOptions,
    scaleType: scale ? layer.config[scale] : null,
    selectedField: layer.config[field],
    showScale: showScale,
    updateField: function updateField(val) {
      return onChange((0, _defineProperty2["default"])({}, field, val), key);
    },
    updateScale: function updateScale(val) {
      return onChange((0, _defineProperty2["default"])({}, scale, val), key);
    }
  });
};

exports.ChannelByValueSelector = ChannelByValueSelector;

var AggrScaleSelector = function AggrScaleSelector(_ref18) {
  var channel = _ref18.channel,
      layer = _ref18.layer,
      onChange = _ref18.onChange;
  var scale = channel.scale,
      key = channel.key;
  var scaleOptions = layer.getScaleOptions(key);
  return Array.isArray(scaleOptions) && scaleOptions.length > 1 ? _react["default"].createElement(_dimensionScaleSelector["default"], {
    label: "".concat(key, " Scale"),
    options: scaleOptions,
    scaleType: layer.config[scale],
    onSelect: function onSelect(val) {
      return onChange((0, _defineProperty2["default"])({}, scale, val), key);
    }
  }) : null;
};

exports.AggrScaleSelector = AggrScaleSelector;

var AggregationTypeSelector = function AggregationTypeSelector(_ref19) {
  var layer = _ref19.layer,
      channel = _ref19.channel,
      _onChange6 = _ref19.onChange;
  var field = channel.field,
      aggregation = channel.aggregation,
      key = channel.key;
  var selectedField = layer.config[field];
  var visConfig = layer.config.visConfig; // aggregation should only be selectable when field is selected

  var aggregationOptions = layer.getAggregationOptions(key);
  return _react["default"].createElement(_styledComponents2.SidePanelSection, null, _react["default"].createElement(_styledComponents2.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'layer.aggregateBy',
    values: {
      field: selectedField.name
    }
  })), _react["default"].createElement(_itemSelector["default"], {
    selectedItems: visConfig[aggregation],
    options: aggregationOptions,
    multiSelect: false,
    searchable: false,
    onChange: function onChange(value) {
      return _onChange6({
        visConfig: _objectSpread({}, layer.config.visConfig, (0, _defineProperty2["default"])({}, aggregation, value))
      }, channel.key);
    }
  }));
};
/* eslint-enable max-params */


exports.AggregationTypeSelector = AggregationTypeSelector;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29uZmlndXJhdG9yLmpzIl0sIm5hbWVzIjpbIlN0eWxlZExheWVyQ29uZmlndXJhdG9yIiwic3R5bGVkIiwiZGl2IiwiYXR0cnMiLCJjbGFzc05hbWUiLCJTdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvciIsImdldExheWVyRmllbGRzIiwiZGF0YXNldHMiLCJsYXllciIsImNvbmZpZyIsImRhdGFJZCIsImZpZWxkcyIsImdldExheWVyQ29uZmlndXJhdG9yUHJvcHMiLCJwcm9wcyIsIm9uQ2hhbmdlIiwidXBkYXRlTGF5ZXJDb25maWciLCJzZXRDb2xvclVJIiwidXBkYXRlTGF5ZXJDb2xvclVJIiwiZ2V0VmlzQ29uZmlndXJhdG9yUHJvcHMiLCJ1cGRhdGVMYXllclZpc0NvbmZpZyIsImdldExheWVyQ2hhbm5lbENvbmZpZ1Byb3BzIiwidXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnIiwiTGF5ZXJDb25maWd1cmF0b3JGYWN0b3J5IiwiZGVwcyIsIlNvdXJjZURhdGFTZWxlY3RvckZhY3RvcnkiLCJWaXNDb25maWdTbGlkZXJGYWN0b3J5IiwiVGV4dExhYmVsUGFuZWxGYWN0b3J5IiwiU291cmNlRGF0YVNlbGVjdG9yIiwiVmlzQ29uZmlnU2xpZGVyIiwiVGV4dExhYmVsUGFuZWwiLCJMYXllckNvbmZpZ3VyYXRvciIsIl9yZW5kZXJTY2F0dGVycGxvdExheWVyQ29uZmlnIiwidmlzQ29uZmlndXJhdG9yUHJvcHMiLCJsYXllckNoYW5uZWxDb25maWdQcm9wcyIsImxheWVyQ29uZmlndXJhdG9yUHJvcHMiLCJ2aXNDb25maWdTZXR0aW5ncyIsImZpbGxlZCIsImxhYmVsIiwiY29sb3JGaWVsZCIsInZpc3VhbENoYW5uZWxzIiwiY29sb3IiLCJvcGFjaXR5IiwidHlwZSIsIkxBWUVSX1RZUEVTIiwicG9pbnQiLCJvdXRsaW5lIiwic3Ryb2tlQ29sb3JGaWVsZCIsInZpc0NvbmZpZyIsInN0cm9rZUNvbG9yIiwidGhpY2tuZXNzIiwic2l6ZUZpZWxkIiwicmFkaXVzIiwiQm9vbGVhbiIsInJhZGl1c1JhbmdlIiwiZml4ZWRSYWRpdXMiLCJzaXplIiwidXBkYXRlTGF5ZXJUZXh0TGFiZWwiLCJ0ZXh0TGFiZWwiLCJjb2xvclBhbGV0dGUiLCJzZXRDb2xvclBhbGV0dGVVSSIsImNvbG9yQWdncmVnYXRpb24iLCJjb25kaXRpb24iLCJjbHVzdGVyUmFkaXVzIiwid2VpZ2h0IiwiX3JlbmRlckFnZ3JlZ2F0aW9uTGF5ZXJDb25maWciLCJlbmFibGUzZCIsImVsZXZhdGlvbkJ5RGVzY3JpcHRpb24iLCJjb2xvckJ5RGVzY3JpcHRpb24iLCJwZXJjZW50aWxlIiwid29ybGRVbml0U2l6ZSIsImNvdmVyYWdlIiwiZWxldmF0aW9uU2NhbGUiLCJzaXplUmFuZ2UiLCJzaXplQWdncmVnYXRpb24iLCJlbGV2YXRpb25QZXJjZW50aWxlIiwiY292ZXJhZ2VGaWVsZCIsImNvdmVyYWdlUmFuZ2UiLCJhcmdzIiwiX3JlbmRlckxpbmVMYXllckNvbmZpZyIsIm1ldGEiLCJmZWF0dXJlVHlwZXMiLCJwb2x5Z29uIiwic3Ryb2tlZCIsInRyYWlsTGVuZ3RoIiwic3Ryb2tlT3BhY2l0eSIsImhlaWdodCIsIndpcmVmcmFtZSIsInJhZGl1c0ZpZWxkIiwiZSIsInRhcmdldCIsImZpbGVzIiwidXJsIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwic2NlbmVncmFwaCIsInNpemVTY2FsZSIsImFuZ2xlWCIsImFuZ2xlWSIsImFuZ2xlWiIsImhlaWdodFJhbmdlIiwibGF5ZXJUeXBlT3B0aW9ucyIsInVwZGF0ZUxheWVyVHlwZSIsImZpZWxkUGFpcnMiLCJyZW5kZXJUZW1wbGF0ZSIsImxheWVySW5mb01vZGFsIiwib3Blbk1vZGFsIiwiaGFzQWxsQ29sdW1ucyIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJpZCIsImNvbHVtbnMiLCJ2YWx1ZSIsImNvbHVtblBhaXJzIiwiYXNzaWduQ29sdW1uUGFpcnMiLCJiaW5kIiwiYXNzaWduQ29sdW1uIiwiY29sdW1uTGFiZWxzIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImFycmF5T2YiLCJhbnkiLCJmdW5jIiwiU3R5bGVkSG93VG9CdXR0b24iLCJIb3dUb0J1dHRvbiIsIm9uQ2xpY2siLCJMYXllckNvbG9yU2VsZWN0b3IiLCJzZWxlY3RlZENvbG9yIiwicHJvcGVydHkiLCJzZXRDb2xvciIsInJnYlZhbHVlIiwiY29sb3JVSSIsIm5ld0NvbmZpZyIsIkFyY0xheWVyQ29sb3JTZWxlY3RvciIsIm9uQ2hhbmdlQ29uZmlnIiwib25DaGFuZ2VWaXNDb25maWciLCJ0YXJnZXRDb2xvciIsIkxheWVyQ29sb3JSYW5nZVNlbGVjdG9yIiwiaXNSYW5nZSIsImNvbG9yUmFuZ2UiLCJDaGFubmVsQnlWYWx1ZVNlbGVjdG9yIiwiY2hhbm5lbCIsImRlc2NyaXB0aW9uIiwiY2hhbm5lbFNjYWxlVHlwZSIsImRvbWFpbiIsImZpZWxkIiwia2V5IiwicmFuZ2UiLCJzY2FsZSIsImRlZmF1bHRNZWFzdXJlIiwic3VwcG9ydGVkRmllbGRUeXBlcyIsImNoYW5uZWxTdXBwb3J0ZWRGaWVsZFR5cGVzIiwiQ0hBTk5FTF9TQ0FMRV9TVVBQT1JURURfRklFTERTIiwic3VwcG9ydGVkRmllbGRzIiwiZmlsdGVyIiwiaW5jbHVkZXMiLCJzY2FsZU9wdGlvbnMiLCJnZXRTY2FsZU9wdGlvbnMiLCJzaG93U2NhbGUiLCJpc0FnZ3JlZ2F0ZWQiLCJkZWZhdWx0RGVzY3JpcHRpb24iLCJ2YWwiLCJBZ2dyU2NhbGVTZWxlY3RvciIsIkFycmF5IiwiaXNBcnJheSIsIkFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yIiwiYWdncmVnYXRpb24iLCJzZWxlY3RlZEZpZWxkIiwiYWdncmVnYXRpb25PcHRpb25zIiwiZ2V0QWdncmVnYXRpb25PcHRpb25zIiwibmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QW5ELElBREYsQ0FERixFQUlFLGdDQUFDLHdCQUFEO0FBQ0UsSUFBQSxhQUFhLEVBQUU3SCxTQUFTLENBQUN5SCxXQUFELENBRDFCO0FBRUUsSUFBQSxPQUFPLEVBQUVFLGtCQUZYO0FBR0UsSUFBQSxXQUFXLEVBQUUsS0FIZjtBQUlFLElBQUEsVUFBVSxFQUFFLEtBSmQ7QUFLRSxJQUFBLFFBQVEsRUFBRSxrQkFBQTFELEtBQUs7QUFBQSxhQUNibEcsVUFBUSxDQUNOO0FBQ0VpQyxRQUFBQSxTQUFTLG9CQUNKdkMsS0FBSyxDQUFDQyxNQUFOLENBQWFzQyxTQURULHVDQUVOeUgsV0FGTSxFQUVReEQsS0FGUjtBQURYLE9BRE0sRUFPTitCLE9BQU8sQ0FBQ0ssR0FQRixDQURLO0FBQUE7QUFMakIsSUFKRixDQURGO0FBd0JELENBaENNO0FBaUNQIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50LCBGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdyZWFjdC1pbnRsJztcblxuaW1wb3J0IHtCdXR0b24sIElucHV0LCBQYW5lbExhYmVsLCBTaWRlUGFuZWxTZWN0aW9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgSXRlbVNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2l0ZW0tc2VsZWN0b3IvaXRlbS1zZWxlY3Rvcic7XG5cbmltcG9ydCBWaXNDb25maWdCeUZpZWxkU2VsZWN0b3IgZnJvbSAnLi92aXMtY29uZmlnLWJ5LWZpZWxkLXNlbGVjdG9yJztcbmltcG9ydCBMYXllckNvbHVtbkNvbmZpZyBmcm9tICcuL2xheWVyLWNvbHVtbi1jb25maWcnO1xuaW1wb3J0IExheWVyVHlwZVNlbGVjdG9yIGZyb20gJy4vbGF5ZXItdHlwZS1zZWxlY3Rvcic7XG5pbXBvcnQgRGltZW5zaW9uU2NhbGVTZWxlY3RvciBmcm9tICcuL2RpbWVuc2lvbi1zY2FsZS1zZWxlY3Rvcic7XG5pbXBvcnQgQ29sb3JTZWxlY3RvciBmcm9tICcuL2NvbG9yLXNlbGVjdG9yJztcbmltcG9ydCBTb3VyY2VEYXRhU2VsZWN0b3JGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvc2lkZS1wYW5lbC9jb21tb24vc291cmNlLWRhdGEtc2VsZWN0b3InO1xuaW1wb3J0IFZpc0NvbmZpZ1N3aXRjaCBmcm9tICcuL3Zpcy1jb25maWctc3dpdGNoJztcbmltcG9ydCBWaXNDb25maWdTbGlkZXJGYWN0b3J5IGZyb20gJy4vdmlzLWNvbmZpZy1zbGlkZXInO1xuaW1wb3J0IExheWVyQ29uZmlnR3JvdXAsIHtDb25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudH0gZnJvbSAnLi9sYXllci1jb25maWctZ3JvdXAnO1xuaW1wb3J0IFRleHRMYWJlbFBhbmVsRmFjdG9yeSBmcm9tICcuL3RleHQtbGFiZWwtcGFuZWwnO1xuXG5pbXBvcnQge2NhcGl0YWxpemVGaXJzdExldHRlcn0gZnJvbSAndXRpbHMvdXRpbHMnO1xuXG5pbXBvcnQge0NIQU5ORUxfU0NBTEVfU1VQUE9SVEVEX0ZJRUxEUywgTEFZRVJfVFlQRVN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuY29uc3QgU3R5bGVkTGF5ZXJDb25maWd1cmF0b3IgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnbGF5ZXItcGFuZWxfX2NvbmZpZydcbn0pYFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIG1hcmdpbi10b3A6IDEycHg7XG5gO1xuXG5jb25zdCBTdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvciA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdsYXllci1wYW5lbF9fY29uZmlnX192aXN1YWxDLWNvbmZpZydcbn0pYFxuICBtYXJnaW4tdG9wOiAxMnB4O1xuYDtcblxuZXhwb3J0IGNvbnN0IGdldExheWVyRmllbGRzID0gKGRhdGFzZXRzLCBsYXllcikgPT5cbiAgZGF0YXNldHNbbGF5ZXIuY29uZmlnLmRhdGFJZF0gPyBkYXRhc2V0c1tsYXllci5jb25maWcuZGF0YUlkXS5maWVsZHMgOiBbXTtcblxuZXhwb3J0IGNvbnN0IGdldExheWVyQ29uZmlndXJhdG9yUHJvcHMgPSBwcm9wcyA9PiAoe1xuICBsYXllcjogcHJvcHMubGF5ZXIsXG4gIGZpZWxkczogZ2V0TGF5ZXJGaWVsZHMocHJvcHMuZGF0YXNldHMsIHByb3BzLmxheWVyKSxcbiAgb25DaGFuZ2U6IHByb3BzLnVwZGF0ZUxheWVyQ29uZmlnLFxuICBzZXRDb2xvclVJOiBwcm9wcy51cGRhdGVMYXllckNvbG9yVUlcbn0pO1xuXG5leHBvcnQgY29uc3QgZ2V0VmlzQ29uZmlndXJhdG9yUHJvcHMgPSBwcm9wcyA9PiAoe1xuICBsYXllcjogcHJvcHMubGF5ZXIsXG4gIGZpZWxkczogZ2V0TGF5ZXJGaWVsZHMocHJvcHMuZGF0YXNldHMsIHByb3BzLmxheWVyKSxcbiAgb25DaGFuZ2U6IHByb3BzLnVwZGF0ZUxheWVyVmlzQ29uZmlnLFxuICBzZXRDb2xvclVJOiBwcm9wcy51cGRhdGVMYXllckNvbG9yVUlcbn0pO1xuXG5leHBvcnQgY29uc3QgZ2V0TGF5ZXJDaGFubmVsQ29uZmlnUHJvcHMgPSBwcm9wcyA9PiAoe1xuICBsYXllcjogcHJvcHMubGF5ZXIsXG4gIGZpZWxkczogZ2V0TGF5ZXJGaWVsZHMocHJvcHMuZGF0YXNldHMsIHByb3BzLmxheWVyKSxcbiAgb25DaGFuZ2U6IHByb3BzLnVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ1xufSk7XG5cbkxheWVyQ29uZmlndXJhdG9yRmFjdG9yeS5kZXBzID0gW1xuICBTb3VyY2VEYXRhU2VsZWN0b3JGYWN0b3J5LFxuICBWaXNDb25maWdTbGlkZXJGYWN0b3J5LFxuICBUZXh0TGFiZWxQYW5lbEZhY3Rvcnlcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExheWVyQ29uZmlndXJhdG9yRmFjdG9yeShcbiAgU291cmNlRGF0YVNlbGVjdG9yLFxuICBWaXNDb25maWdTbGlkZXIsXG4gIFRleHRMYWJlbFBhbmVsXG4pIHtcbiAgY2xhc3MgTGF5ZXJDb25maWd1cmF0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBsYXllcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGxheWVyVHlwZU9wdGlvbnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLmlzUmVxdWlyZWQsXG4gICAgICBvcGVuTW9kYWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICB1cGRhdGVMYXllckNvbmZpZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIHVwZGF0ZUxheWVyVHlwZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIHVwZGF0ZUxheWVyVmlzQ29uZmlnOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgdXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgdXBkYXRlTGF5ZXJDb2xvclVJOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gICAgfTtcblxuICAgIF9yZW5kZXJQb2ludExheWVyQ29uZmlnKHByb3BzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVuZGVyU2NhdHRlcnBsb3RMYXllckNvbmZpZyhwcm9wcyk7XG4gICAgfVxuXG4gICAgX3JlbmRlckljb25MYXllckNvbmZpZyhwcm9wcykge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlclNjYXR0ZXJwbG90TGF5ZXJDb25maWcocHJvcHMpO1xuICAgIH1cblxuICAgIF9yZW5kZXJTY2F0dGVycGxvdExheWVyQ29uZmlnKHtcbiAgICAgIGxheWVyLFxuICAgICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgICBsYXllckNoYW5uZWxDb25maWdQcm9wcyxcbiAgICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHNcbiAgICB9KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICAgICAgey8qIEZpbGwgQ29sb3IgKi99XG4gICAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICAgIHsuLi4obGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuZmlsbGVkIHx8IHtsYWJlbDogJ2xheWVyLmNvbG9yJ30pfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgY29sbGFwc2libGVcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7bGF5ZXIuY29uZmlnLmNvbG9yRmllbGQgPyAoXG4gICAgICAgICAgICAgIDxMYXllckNvbG9yUmFuZ2VTZWxlY3RvciB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8TGF5ZXJDb2xvclNlbGVjdG9yIHsuLi5sYXllckNvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxDb25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXIgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLm9wYWNpdHl9IHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICAgIDwvQ29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQ+XG4gICAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuXG4gICAgICAgICAgey8qIG91dGxpbmUgY29sb3IgKi99XG4gICAgICAgICAge2xheWVyLnR5cGUgPT09IExBWUVSX1RZUEVTLnBvaW50ID8gKFxuICAgICAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLm91dGxpbmV9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgY29sbGFwc2libGVcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2xheWVyLmNvbmZpZy5zdHJva2VDb2xvckZpZWxkID8gKFxuICAgICAgICAgICAgICAgIDxMYXllckNvbG9yUmFuZ2VTZWxlY3RvciB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IHByb3BlcnR5PVwic3Ryb2tlQ29sb3JSYW5nZVwiIC8+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPExheWVyQ29sb3JTZWxlY3RvclxuICAgICAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRDb2xvcj17bGF5ZXIuY29uZmlnLnZpc0NvbmZpZy5zdHJva2VDb2xvcn1cbiAgICAgICAgICAgICAgICAgIHByb3BlcnR5PVwic3Ryb2tlQ29sb3JcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDxDb25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc3Ryb2tlQ29sb3J9XG4gICAgICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MudGhpY2tuZXNzfVxuICAgICAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFsYXllci5jb25maWcudmlzQ29uZmlnLm91dGxpbmV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgIHsvKiBSYWRpdXMgKi99XG4gICAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydsYXllci5yYWRpdXMnfSBjb2xsYXBzaWJsZT5cbiAgICAgICAgICAgIHshbGF5ZXIuY29uZmlnLnNpemVGaWVsZCA/IChcbiAgICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5yYWRpdXN9XG4gICAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICAgIGxhYmVsPXtmYWxzZX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17Qm9vbGVhbihsYXllci5jb25maWcuc2l6ZUZpZWxkKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MucmFkaXVzUmFuZ2V9XG4gICAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICAgIGxhYmVsPXtmYWxzZX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyLmNvbmZpZy5zaXplRmllbGQgfHwgbGF5ZXIuY29uZmlnLnZpc0NvbmZpZy5maXhlZFJhZGl1c31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8Q29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQ+XG4gICAgICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZX1cbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIHtsYXllci5jb25maWcuc2l6ZUZpZWxkID8gKFxuICAgICAgICAgICAgICAgIDxWaXNDb25maWdTd2l0Y2hcbiAgICAgICAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5maXhlZFJhZGl1c31cbiAgICAgICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIDwvQ29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQ+XG4gICAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuXG4gICAgICAgICAgey8qIHRleHQgbGFiZWwgKi99XG4gICAgICAgICAgPFRleHRMYWJlbFBhbmVsXG4gICAgICAgICAgICBmaWVsZHM9e3Zpc0NvbmZpZ3VyYXRvclByb3BzLmZpZWxkc31cbiAgICAgICAgICAgIHVwZGF0ZUxheWVyVGV4dExhYmVsPXt0aGlzLnByb3BzLnVwZGF0ZUxheWVyVGV4dExhYmVsfVxuICAgICAgICAgICAgdGV4dExhYmVsPXtsYXllci5jb25maWcudGV4dExhYmVsfVxuICAgICAgICAgICAgY29sb3JQYWxldHRlPXt2aXNDb25maWd1cmF0b3JQcm9wcy5jb2xvclBhbGV0dGV9XG4gICAgICAgICAgICBzZXRDb2xvclBhbGV0dGVVST17dmlzQ29uZmlndXJhdG9yUHJvcHMuc2V0Q29sb3JQYWxldHRlVUl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgX3JlbmRlckNsdXN0ZXJMYXllckNvbmZpZyh7XG4gICAgICBsYXllcixcbiAgICAgIHZpc0NvbmZpZ3VyYXRvclByb3BzLFxuICAgICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyxcbiAgICAgIGxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzXG4gICAgfSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICAgICAgIHsvKiBDb2xvciAqL31cbiAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2xheWVyLmNvbG9yJ30gY29sbGFwc2libGU+XG4gICAgICAgICAgICA8TGF5ZXJDb2xvclJhbmdlU2VsZWN0b3Igey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICA8QWdnclNjYWxlU2VsZWN0b3Igey4uLmxheWVyQ29uZmlndXJhdG9yUHJvcHN9IGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfSAvPlxuICAgICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAge2xheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmNvbG9yQWdncmVnYXRpb24uY29uZGl0aW9uKGxheWVyLmNvbmZpZykgPyAoXG4gICAgICAgICAgICAgICAgPEFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuY29sb3JBZ2dyZWdhdGlvbn1cbiAgICAgICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5vcGFjaXR5fSB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgICA8L0NvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICAgIHsvKiBDbHVzdGVyIFJhZGl1cyAqL31cbiAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2xheWVyLnJhZGl1cyd9IGNvbGxhcHNpYmxlPlxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlciB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuY2x1c3RlclJhZGl1c30gey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5yYWRpdXNSYW5nZX0gey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgIDwvU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICApO1xuICAgIH1cblxuICAgIF9yZW5kZXJIZWF0bWFwTGF5ZXJDb25maWcoe1xuICAgICAgbGF5ZXIsXG4gICAgICB2aXNDb25maWd1cmF0b3JQcm9wcyxcbiAgICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICAgIH0pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICAgICAgICB7LyogQ29sb3IgKi99XG4gICAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydsYXllci5jb2xvcid9IGNvbGxhcHNpYmxlPlxuICAgICAgICAgICAgPExheWVyQ29sb3JSYW5nZVNlbGVjdG9yIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICAgIDxDb25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlciB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3Mub3BhY2l0eX0gey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgICAgey8qIFJhZGl1cyAqL31cbiAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2xheWVyLnJhZGl1cyd9PlxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MucmFkaXVzfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGxhYmVsPXtmYWxzZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICAgIHsvKiBXZWlnaHQgKi99XG4gICAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydsYXllci53ZWlnaHQnfT5cbiAgICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLndlaWdodH1cbiAgICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgIDwvU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICApO1xuICAgIH1cblxuICAgIF9yZW5kZXJHcmlkTGF5ZXJDb25maWcocHJvcHMpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJBZ2dyZWdhdGlvbkxheWVyQ29uZmlnKHByb3BzKTtcbiAgICB9XG5cbiAgICBfcmVuZGVySGV4YWdvbkxheWVyQ29uZmlnKHByb3BzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVuZGVyQWdncmVnYXRpb25MYXllckNvbmZpZyhwcm9wcyk7XG4gICAgfVxuXG4gICAgX3JlbmRlckFnZ3JlZ2F0aW9uTGF5ZXJDb25maWcoe1xuICAgICAgbGF5ZXIsXG4gICAgICB2aXNDb25maWd1cmF0b3JQcm9wcyxcbiAgICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICAgIH0pIHtcbiAgICAgIGNvbnN0IHtjb25maWd9ID0gbGF5ZXI7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHZpc0NvbmZpZzoge2VuYWJsZTNkfVxuICAgICAgfSA9IGNvbmZpZztcbiAgICAgIGNvbnN0IGVsZXZhdGlvbkJ5RGVzY3JpcHRpb24gPSAnbGF5ZXIuZWxldmF0aW9uQnlEZXNjcmlwdGlvbic7XG4gICAgICBjb25zdCBjb2xvckJ5RGVzY3JpcHRpb24gPSAnbGF5ZXIuY29sb3JCeURlc2NyaXB0aW9uJztcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICAgICAgIHsvKiBDb2xvciAqL31cbiAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2xheWVyLmNvbG9yJ30gY29sbGFwc2libGU+XG4gICAgICAgICAgICA8TGF5ZXJDb2xvclJhbmdlU2VsZWN0b3Igey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICA8QWdnclNjYWxlU2VsZWN0b3Igey4uLmxheWVyQ29uZmlndXJhdG9yUHJvcHN9IGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfSAvPlxuICAgICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAge2xheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmNvbG9yQWdncmVnYXRpb24uY29uZGl0aW9uKGxheWVyLmNvbmZpZykgPyAoXG4gICAgICAgICAgICAgICAgPEFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuY29sb3JBZ2dyZWdhdGlvbn1cbiAgICAgICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uPXtjb2xvckJ5RGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAge2xheWVyLnZpc0NvbmZpZ1NldHRpbmdzLnBlcmNlbnRpbGUgJiZcbiAgICAgICAgICAgICAgbGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MucGVyY2VudGlsZS5jb25kaXRpb24obGF5ZXIuY29uZmlnKSA/IChcbiAgICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MucGVyY2VudGlsZX1cbiAgICAgICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlciB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3Mub3BhY2l0eX0gey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgICB7LyogQ2VsbCBzaXplICovfVxuICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnbGF5ZXIucmFkaXVzJ30gY29sbGFwc2libGU+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy53b3JsZFVuaXRTaXplfSB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgICA8Q29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQ+XG4gICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXIgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmNvdmVyYWdlfSB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgICA8L0NvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICAgIHsvKiBFbGV2YXRpb24gKi99XG4gICAgICAgICAge2xheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmVuYWJsZTNkID8gKFxuICAgICAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmVuYWJsZTNkfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGNvbGxhcHNpYmxlXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuZWxldmF0aW9uU2NhbGV9XG4gICAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8Q29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgPEFnZ3JTY2FsZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5zaXplUmFuZ2V9IHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZX1cbiAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uPXtlbGV2YXRpb25CeURlc2NyaXB0aW9ufVxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFlbmFibGUzZH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIHtsYXllci52aXNDb25maWdTZXR0aW5ncy5zaXplQWdncmVnYXRpb24uY29uZGl0aW9uKGxheWVyLmNvbmZpZykgPyAoXG4gICAgICAgICAgICAgICAgICA8QWdncmVnYXRpb25UeXBlU2VsZWN0b3JcbiAgICAgICAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLnNpemVBZ2dyZWdhdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5zaXplfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgICB7bGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuZWxldmF0aW9uUGVyY2VudGlsZS5jb25kaXRpb24obGF5ZXIuY29uZmlnKSA/IChcbiAgICAgICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmVsZXZhdGlvblBlcmNlbnRpbGV9XG4gICAgICAgICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIDwvQ29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQ+XG4gICAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFNoYW4gbW92ZSB0aGVzZSBpbnRvIGxheWVyIGNsYXNzXG4gICAgX3JlbmRlckhleGFnb25JZExheWVyQ29uZmlnKHtcbiAgICAgIGxheWVyLFxuICAgICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgICBsYXllckNvbmZpZ3VyYXRvclByb3BzLFxuICAgICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHNcbiAgICB9KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICAgICAgey8qIENvbG9yICovfVxuICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnbGF5ZXIuY29sb3InfSBjb2xsYXBzaWJsZT5cbiAgICAgICAgICAgIHtsYXllci5jb25maWcuY29sb3JGaWVsZCA/IChcbiAgICAgICAgICAgICAgPExheWVyQ29sb3JSYW5nZVNlbGVjdG9yIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxMYXllckNvbG9yU2VsZWN0b3Igey4uLmxheWVyQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlciB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3Mub3BhY2l0eX0gey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgICB7LyogQ292ZXJhZ2UgKi99XG4gICAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydsYXllci5jb3ZlcmFnZSd9IGNvbGxhcHNpYmxlPlxuICAgICAgICAgICAgeyFsYXllci5jb25maWcuY292ZXJhZ2VGaWVsZCA/IChcbiAgICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5jb3ZlcmFnZX1cbiAgICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgICAgbGFiZWw9e2ZhbHNlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5jb3ZlcmFnZVJhbmdlfVxuICAgICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgICBsYWJlbD17ZmFsc2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvdmVyYWdlfVxuICAgICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvQ29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQ+XG4gICAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuXG4gICAgICAgICAgey8qIGhlaWdodCAqL31cbiAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmVuYWJsZTNkfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgY29sbGFwc2libGVcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5zaXplfVxuICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmVsZXZhdGlvblNjYWxlfVxuICAgICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5zaXplUmFuZ2V9XG4gICAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICAgIGxhYmVsPVwibGF5ZXJWaXNDb25maWdzLmhlaWdodFJhbmdlXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvQ29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQ+XG4gICAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICA8L1N0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBfcmVuZGVyQXJjTGF5ZXJDb25maWcoYXJncykge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlckxpbmVMYXllckNvbmZpZyhhcmdzKTtcbiAgICB9XG5cbiAgICBfcmVuZGVyTGluZUxheWVyQ29uZmlnKHtcbiAgICAgIGxheWVyLFxuICAgICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgICBsYXllckNvbmZpZ3VyYXRvclByb3BzLFxuICAgICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHNcbiAgICB9KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICAgICAgey8qIENvbG9yICovfVxuICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnbGF5ZXIuY29sb3InfSBjb2xsYXBzaWJsZT5cbiAgICAgICAgICAgIHtsYXllci5jb25maWcuY29sb3JGaWVsZCA/IChcbiAgICAgICAgICAgICAgPExheWVyQ29sb3JSYW5nZVNlbGVjdG9yIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxBcmNMYXllckNvbG9yU2VsZWN0b3JcbiAgICAgICAgICAgICAgICBsYXllcj17bGF5ZXJ9XG4gICAgICAgICAgICAgICAgc2V0Q29sb3JVST17bGF5ZXJDb25maWd1cmF0b3JQcm9wcy5zZXRDb2xvclVJfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlQ29uZmlnPXtsYXllckNvbmZpZ3VyYXRvclByb3BzLm9uQ2hhbmdlfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlVmlzQ29uZmlnPXt2aXNDb25maWd1cmF0b3JQcm9wcy5vbkNoYW5nZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8Q29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQ+XG4gICAgICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuY29sb3J9XG4gICAgICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5vcGFjaXR5fSB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgICA8L0NvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICAgIHsvKiB0aGlja25lc3MgKi99XG4gICAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydsYXllci5zdHJva2UnfSBjb2xsYXBzaWJsZT5cbiAgICAgICAgICAgIHtsYXllci5jb25maWcuc2l6ZUZpZWxkID8gKFxuICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLnNpemVSYW5nZX1cbiAgICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFsYXllci5jb25maWcuc2l6ZUZpZWxkfVxuICAgICAgICAgICAgICAgIGxhYmVsPXtmYWxzZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MudGhpY2tuZXNzfVxuICAgICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgICBsYWJlbD17ZmFsc2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgIDwvU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICApO1xuICAgIH1cblxuICAgIF9yZW5kZXJUcmlwTGF5ZXJDb25maWcoe1xuICAgICAgbGF5ZXIsXG4gICAgICB2aXNDb25maWd1cmF0b3JQcm9wcyxcbiAgICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICAgIH0pIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgbWV0YToge2ZlYXR1cmVUeXBlcyA9IHt9fVxuICAgICAgfSA9IGxheWVyO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICAgICAgey8qIENvbG9yICovfVxuICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnbGF5ZXIuY29sb3InfSBjb2xsYXBzaWJsZT5cbiAgICAgICAgICAgIHtsYXllci5jb25maWcuY29sb3JGaWVsZCA/IChcbiAgICAgICAgICAgICAgPExheWVyQ29sb3JSYW5nZVNlbGVjdG9yIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxMYXllckNvbG9yU2VsZWN0b3Igey4uLmxheWVyQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlciB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3Mub3BhY2l0eX0gey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgICB7LyogU3Ryb2tlIFdpZHRoICovfVxuICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gbGFiZWw9XCJsYXllci5zdHJva2VXaWR0aFwiIGNvbGxhcHNpYmxlPlxuICAgICAgICAgICAge2xheWVyLmNvbmZpZy5zaXplRmllbGQgPyAoXG4gICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3Muc2l6ZVJhbmdlfVxuICAgICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgICBsYWJlbD17ZmFsc2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLnRoaWNrbmVzc31cbiAgICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgICAgbGFiZWw9e2ZhbHNlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgICB7LyogVHJhaWwgTGVuZ3RoKi99XG4gICAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIHsuLi4oZmVhdHVyZVR5cGVzLnBvbHlnb24gPyBsYXllci52aXNDb25maWdTZXR0aW5ncy5zdHJva2VkIDoge30pfVxuICAgICAgICAgICAgbGFiZWw9XCJsYXllci50cmFpbExlbmd0aFwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbj1cImxheWVyLnRyYWlsTGVuZ3RoRGVzY3JpcHRpb25cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLnRyYWlsTGVuZ3RofVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGxhYmVsPXtmYWxzZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICA8L1N0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBfcmVuZGVyR2VvanNvbkxheWVyQ29uZmlnKHtcbiAgICAgIGxheWVyLFxuICAgICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgICBsYXllckNvbmZpZ3VyYXRvclByb3BzLFxuICAgICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHNcbiAgICB9KSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIG1ldGE6IHtmZWF0dXJlVHlwZXMgPSB7fX0sXG4gICAgICAgIGNvbmZpZzoge3Zpc0NvbmZpZ31cbiAgICAgIH0gPSBsYXllcjtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICAgICAgIHsvKiBGaWxsIENvbG9yICovfVxuICAgICAgICAgIHtmZWF0dXJlVHlwZXMucG9seWdvbiB8fCBmZWF0dXJlVHlwZXMucG9pbnQgPyAoXG4gICAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuZmlsbGVkfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGxhYmVsPVwibGF5ZXIuZmlsbENvbG9yXCJcbiAgICAgICAgICAgICAgY29sbGFwc2libGVcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2xheWVyLmNvbmZpZy5jb2xvckZpZWxkID8gKFxuICAgICAgICAgICAgICAgIDxMYXllckNvbG9yUmFuZ2VTZWxlY3RvciB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPExheWVyQ29sb3JTZWxlY3RvciB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXIgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLm9wYWNpdHl9IHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgIHsvKiBzdHJva2UgY29sb3IgKi99XG4gICAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5zdHJva2VkfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgbGFiZWw9XCJsYXllci5zdHJva2VDb2xvclwiXG4gICAgICAgICAgICBjb2xsYXBzaWJsZVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtsYXllci5jb25maWcuc3Ryb2tlQ29sb3JGaWVsZCA/IChcbiAgICAgICAgICAgICAgPExheWVyQ29sb3JSYW5nZVNlbGVjdG9yIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gcHJvcGVydHk9XCJzdHJva2VDb2xvclJhbmdlXCIgLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxMYXllckNvbG9yU2VsZWN0b3JcbiAgICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRDb2xvcj17bGF5ZXIuY29uZmlnLnZpc0NvbmZpZy5zdHJva2VDb2xvcn1cbiAgICAgICAgICAgICAgICBwcm9wZXJ0eT1cInN0cm9rZUNvbG9yXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8Q29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQ+XG4gICAgICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc3Ryb2tlQ29sb3J9XG4gICAgICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLnN0cm9rZU9wYWNpdHl9XG4gICAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgICB7LyogU3Ryb2tlIFdpZHRoICovfVxuICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwXG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICB7Li4uKGZlYXR1cmVUeXBlcy5wb2x5Z29uID8gbGF5ZXIudmlzQ29uZmlnU2V0dGluZ3Muc3Ryb2tlZCA6IHt9KX1cbiAgICAgICAgICAgIGxhYmVsPVwibGF5ZXIuc3Ryb2tlV2lkdGhcIlxuICAgICAgICAgICAgY29sbGFwc2libGVcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7bGF5ZXIuY29uZmlnLnNpemVGaWVsZCA/IChcbiAgICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5zaXplUmFuZ2V9XG4gICAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICAgIGxhYmVsPXtmYWxzZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MudGhpY2tuZXNzfVxuICAgICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgICBsYWJlbD17ZmFsc2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgICB7LyogRWxldmF0aW9uICovfVxuICAgICAgICAgIHtmZWF0dXJlVHlwZXMucG9seWdvbiA/IChcbiAgICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwXG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmVuYWJsZTNkfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IXZpc0NvbmZpZy5maWxsZWR9XG4gICAgICAgICAgICAgIGNvbGxhcHNpYmxlXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuZWxldmF0aW9uU2NhbGV9XG4gICAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICAgIGxhYmVsPXtmYWxzZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5oZWlnaHR9XG4gICAgICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8VmlzQ29uZmlnU3dpdGNoIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLndpcmVmcmFtZX0gLz5cbiAgICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgIHsvKiBSYWRpdXMgKi99XG4gICAgICAgICAge2ZlYXR1cmVUeXBlcy5wb2ludCA/IChcbiAgICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnbGF5ZXIucmFkaXVzJ30gY29sbGFwc2libGU+XG4gICAgICAgICAgICAgIHshbGF5ZXIuY29uZmlnLnJhZGl1c0ZpZWxkID8gKFxuICAgICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5yYWRpdXN9XG4gICAgICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgICAgICBsYWJlbD17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17Qm9vbGVhbihsYXllci5jb25maWcucmFkaXVzRmllbGQpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLnJhZGl1c1JhbmdlfVxuICAgICAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICAgICAgbGFiZWw9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFsYXllci5jb25maWcucmFkaXVzRmllbGR9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5yYWRpdXN9XG4gICAgICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9TdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgX3JlbmRlcjNETGF5ZXJDb25maWcoe2xheWVyLCB2aXNDb25maWd1cmF0b3JQcm9wc30pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2xheWVyLjNETW9kZWwnfSBjb2xsYXBzaWJsZT5cbiAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgICAgIGFjY2VwdD1cIi5nbGIsLmdsdGZcIlxuICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmZpbGVzICYmIGUudGFyZ2V0LmZpbGVzWzBdKSB7XG4gICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGUudGFyZ2V0LmZpbGVzWzBdKTtcbiAgICAgICAgICAgICAgICAgIHZpc0NvbmZpZ3VyYXRvclByb3BzLm9uQ2hhbmdlKHtzY2VuZWdyYXBoOiB1cmx9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2xheWVyLjNETW9kZWxPcHRpb25zJ30gY29sbGFwc2libGU+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5zaXplU2NhbGV9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2ZhbHNlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmFuZ2xlWH1cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17ZmFsc2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuYW5nbGVZfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtmYWxzZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5hbmdsZVp9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2ZhbHNlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICApO1xuICAgIH1cblxuICAgIF9yZW5kZXJTMkxheWVyQ29uZmlnKHtcbiAgICAgIGxheWVyLFxuICAgICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgICBsYXllckNvbmZpZ3VyYXRvclByb3BzLFxuICAgICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHNcbiAgICB9KSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGNvbmZpZzoge3Zpc0NvbmZpZ31cbiAgICAgIH0gPSBsYXllcjtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICAgICAgIHsvKiBDb2xvciAqL31cbiAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmZpbGxlZH1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIGxhYmVsPVwibGF5ZXIuZmlsbENvbG9yXCJcbiAgICAgICAgICAgIGNvbGxhcHNpYmxlXG4gICAgICAgICAgPlxuICAgICAgICAgICAge2xheWVyLmNvbmZpZy5jb2xvckZpZWxkID8gKFxuICAgICAgICAgICAgICA8TGF5ZXJDb2xvclJhbmdlU2VsZWN0b3Igey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPExheWVyQ29sb3JTZWxlY3RvciB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8Q29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQ+XG4gICAgICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuY29sb3J9XG4gICAgICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5vcGFjaXR5fSB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgICA8L0NvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICAgIHsvKiBTdHJva2UgKi99XG4gICAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5zdHJva2VkfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgbGFiZWw9XCJsYXllci5zdHJva2VDb2xvclwiXG4gICAgICAgICAgICBjb2xsYXBzaWJsZVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtsYXllci5jb25maWcuc3Ryb2tlQ29sb3JGaWVsZCA/IChcbiAgICAgICAgICAgICAgPExheWVyQ29sb3JSYW5nZVNlbGVjdG9yIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gcHJvcGVydHk9XCJzdHJva2VDb2xvclJhbmdlXCIgLz5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxMYXllckNvbG9yU2VsZWN0b3JcbiAgICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRDb2xvcj17bGF5ZXIuY29uZmlnLnZpc0NvbmZpZy5zdHJva2VDb2xvcn1cbiAgICAgICAgICAgICAgICBwcm9wZXJ0eT1cInN0cm9rZUNvbG9yXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8Q29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQ+XG4gICAgICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc3Ryb2tlQ29sb3J9XG4gICAgICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgICB7LyogU3Ryb2tlIFdpZHRoICovfVxuICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gbGFiZWw9XCJsYXllci5zdHJva2VXaWR0aFwiIGNvbGxhcHNpYmxlPlxuICAgICAgICAgICAge2xheWVyLmNvbmZpZy5zaXplRmllbGQgPyAoXG4gICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3Muc2l6ZVJhbmdlfVxuICAgICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgICBsYWJlbD17ZmFsc2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLnRoaWNrbmVzc31cbiAgICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgICAgbGFiZWw9e2ZhbHNlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxDb25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5zaXplfVxuICAgICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvQ29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQ+XG4gICAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuXG4gICAgICAgICAgey8qIEVsZXZhdGlvbiAqL31cbiAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmVuYWJsZTNkfVxuICAgICAgICAgICAgZGlzYWJsZWQ9eyF2aXNDb25maWcuZmlsbGVkfVxuICAgICAgICAgICAgY29sbGFwc2libGVcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5oZWlnaHR9XG4gICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5lbGV2YXRpb25TY2FsZX1cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICBsYWJlbD1cImxheWVyVmlzQ29uZmlncy5lbGV2YXRpb25TY2FsZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmhlaWdodFJhbmdlfVxuICAgICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgICBsYWJlbD1cImxheWVyVmlzQ29uZmlncy5oZWlnaHRSYW5nZVwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxWaXNDb25maWdTd2l0Y2ggey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3Mud2lyZWZyYW1lfSAvPlxuICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgIDwvU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtsYXllciwgZGF0YXNldHMsIHVwZGF0ZUxheWVyQ29uZmlnLCBsYXllclR5cGVPcHRpb25zLCB1cGRhdGVMYXllclR5cGV9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHtmaWVsZHMgPSBbXSwgZmllbGRQYWlyc30gPSBsYXllci5jb25maWcuZGF0YUlkID8gZGF0YXNldHNbbGF5ZXIuY29uZmlnLmRhdGFJZF0gOiB7fTtcbiAgICAgIGNvbnN0IHtjb25maWd9ID0gbGF5ZXI7XG5cbiAgICAgIGNvbnN0IHZpc0NvbmZpZ3VyYXRvclByb3BzID0gZ2V0VmlzQ29uZmlndXJhdG9yUHJvcHModGhpcy5wcm9wcyk7XG4gICAgICBjb25zdCBsYXllckNvbmZpZ3VyYXRvclByb3BzID0gZ2V0TGF5ZXJDb25maWd1cmF0b3JQcm9wcyh0aGlzLnByb3BzKTtcbiAgICAgIGNvbnN0IGxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzID0gZ2V0TGF5ZXJDaGFubmVsQ29uZmlnUHJvcHModGhpcy5wcm9wcyk7XG5cbiAgICAgIGNvbnN0IHJlbmRlclRlbXBsYXRlID0gbGF5ZXIudHlwZSAmJiBgX3JlbmRlciR7Y2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGxheWVyLnR5cGUpfUxheWVyQ29uZmlnYDtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZExheWVyQ29uZmlndXJhdG9yPlxuICAgICAgICAgIHtsYXllci5sYXllckluZm9Nb2RhbCA/IChcbiAgICAgICAgICAgIDxIb3dUb0J1dHRvbiBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9wZW5Nb2RhbChsYXllci5sYXllckluZm9Nb2RhbCl9IC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydsYXllci5iYXNpYyd9IGNvbGxhcHNpYmxlIGV4cGFuZGVkPXshbGF5ZXIuaGFzQWxsQ29sdW1ucygpfT5cbiAgICAgICAgICAgIDxMYXllclR5cGVTZWxlY3RvclxuICAgICAgICAgICAgICBsYXllcj17bGF5ZXJ9XG4gICAgICAgICAgICAgIGxheWVyVHlwZU9wdGlvbnM9e2xheWVyVHlwZU9wdGlvbnN9XG4gICAgICAgICAgICAgIG9uU2VsZWN0PXt1cGRhdGVMYXllclR5cGV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50PlxuICAgICAgICAgICAgICB7T2JqZWN0LmtleXMoZGF0YXNldHMpLmxlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgICAgICAgIDxTb3VyY2VEYXRhU2VsZWN0b3JcbiAgICAgICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgICAgIGlkPXtsYXllci5pZH1cbiAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtsYXllci50eXBlICYmIGNvbmZpZy5jb2x1bW5zfVxuICAgICAgICAgICAgICAgICAgZGF0YUlkPXtjb25maWcuZGF0YUlkfVxuICAgICAgICAgICAgICAgICAgb25TZWxlY3Q9e3ZhbHVlID0+IHVwZGF0ZUxheWVyQ29uZmlnKHtkYXRhSWQ6IHZhbHVlfSl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPExheWVyQ29sdW1uQ29uZmlnXG4gICAgICAgICAgICAgICAgY29sdW1uUGFpcnM9e2xheWVyLmNvbHVtblBhaXJzfVxuICAgICAgICAgICAgICAgIGNvbHVtbnM9e2xheWVyLmNvbmZpZy5jb2x1bW5zfVxuICAgICAgICAgICAgICAgIGFzc2lnbkNvbHVtblBhaXJzPXtsYXllci5hc3NpZ25Db2x1bW5QYWlycy5iaW5kKGxheWVyKX1cbiAgICAgICAgICAgICAgICBhc3NpZ25Db2x1bW49e2xheWVyLmFzc2lnbkNvbHVtbi5iaW5kKGxheWVyKX1cbiAgICAgICAgICAgICAgICBjb2x1bW5MYWJlbHM9e2xheWVyLmNvbHVtbkxhYmVsc31cbiAgICAgICAgICAgICAgICBmaWVsZHM9e2ZpZWxkc31cbiAgICAgICAgICAgICAgICBmaWVsZFBhaXJzPXtmaWVsZFBhaXJzfVxuICAgICAgICAgICAgICAgIHVwZGF0ZUxheWVyQ29uZmlnPXt1cGRhdGVMYXllckNvbmZpZ31cbiAgICAgICAgICAgICAgICB1cGRhdGVMYXllclR5cGU9e3RoaXMucHJvcHMudXBkYXRlTGF5ZXJUeXBlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9Db25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudD5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgICAge3RoaXNbcmVuZGVyVGVtcGxhdGVdICYmXG4gICAgICAgICAgICB0aGlzW3JlbmRlclRlbXBsYXRlXSh7XG4gICAgICAgICAgICAgIGxheWVyLFxuICAgICAgICAgICAgICB2aXNDb25maWd1cmF0b3JQcm9wcyxcbiAgICAgICAgICAgICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHMsXG4gICAgICAgICAgICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHNcbiAgICAgICAgICAgIH0pfVxuICAgICAgICA8L1N0eWxlZExheWVyQ29uZmlndXJhdG9yPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTGF5ZXJDb25maWd1cmF0b3I7XG59XG4vKlxuICogQ29tcG9uZW50aXplIGNvbmZpZyBjb21wb25lbnQgaW50byBwdXJlIGZ1bmN0aW9uYWwgY29tcG9uZW50c1xuICovXG5cbmNvbnN0IFN0eWxlZEhvd1RvQnV0dG9uID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMTJweDtcbiAgdG9wOiAtNHB4O1xuYDtcblxuZXhwb3J0IGNvbnN0IEhvd1RvQnV0dG9uID0gKHtvbkNsaWNrfSkgPT4gKFxuICA8U3R5bGVkSG93VG9CdXR0b24+XG4gICAgPEJ1dHRvbiBsaW5rIHNtYWxsIG9uQ2xpY2s9e29uQ2xpY2t9PlxuICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydsYXllckNvbmZpZ3VyYXRpb24uaG93VG8nfSAvPlxuICAgIDwvQnV0dG9uPlxuICA8L1N0eWxlZEhvd1RvQnV0dG9uPlxuKTtcblxuZXhwb3J0IGNvbnN0IExheWVyQ29sb3JTZWxlY3RvciA9ICh7XG4gIGxheWVyLFxuICBvbkNoYW5nZSxcbiAgbGFiZWwsXG4gIHNlbGVjdGVkQ29sb3IsXG4gIHByb3BlcnR5ID0gJ2NvbG9yJyxcbiAgc2V0Q29sb3JVSVxufSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICA8Q29sb3JTZWxlY3RvclxuICAgICAgY29sb3JTZXRzPXtbXG4gICAgICAgIHtcbiAgICAgICAgICBzZWxlY3RlZENvbG9yOiBzZWxlY3RlZENvbG9yIHx8IGxheWVyLmNvbmZpZy5jb2xvcixcbiAgICAgICAgICBzZXRDb2xvcjogcmdiVmFsdWUgPT4gb25DaGFuZ2Uoe1twcm9wZXJ0eV06IHJnYlZhbHVlfSlcbiAgICAgICAgfVxuICAgICAgXX1cbiAgICAgIGNvbG9yVUk9e2xheWVyLmNvbmZpZy5jb2xvclVJW3Byb3BlcnR5XX1cbiAgICAgIHNldENvbG9yVUk9e25ld0NvbmZpZyA9PiBzZXRDb2xvclVJKHByb3BlcnR5LCBuZXdDb25maWcpfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbmV4cG9ydCBjb25zdCBBcmNMYXllckNvbG9yU2VsZWN0b3IgPSAoe1xuICBsYXllcixcbiAgb25DaGFuZ2VDb25maWcsXG4gIG9uQ2hhbmdlVmlzQ29uZmlnLFxuICBwcm9wZXJ0eSA9ICdjb2xvcicsXG4gIHNldENvbG9yVUlcbn0pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgPENvbG9yU2VsZWN0b3JcbiAgICAgIGNvbG9yU2V0cz17W1xuICAgICAgICB7XG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcjogbGF5ZXIuY29uZmlnLmNvbG9yLFxuICAgICAgICAgIHNldENvbG9yOiByZ2JWYWx1ZSA9PiBvbkNoYW5nZUNvbmZpZyh7Y29sb3I6IHJnYlZhbHVlfSksXG4gICAgICAgICAgbGFiZWw6ICdTb3VyY2UnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzZWxlY3RlZENvbG9yOiBsYXllci5jb25maWcudmlzQ29uZmlnLnRhcmdldENvbG9yIHx8IGxheWVyLmNvbmZpZy5jb2xvcixcbiAgICAgICAgICBzZXRDb2xvcjogcmdiVmFsdWUgPT4gb25DaGFuZ2VWaXNDb25maWcoe3RhcmdldENvbG9yOiByZ2JWYWx1ZX0pLFxuICAgICAgICAgIGxhYmVsOiAnVGFyZ2V0J1xuICAgICAgICB9XG4gICAgICBdfVxuICAgICAgY29sb3JVST17bGF5ZXIuY29uZmlnLmNvbG9yVUlbcHJvcGVydHldfVxuICAgICAgc2V0Q29sb3JVST17bmV3Q29uZmlnID0+IHNldENvbG9yVUkocHJvcGVydHksIG5ld0NvbmZpZyl9XG4gICAgLz5cbiAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuKTtcblxuZXhwb3J0IGNvbnN0IExheWVyQ29sb3JSYW5nZVNlbGVjdG9yID0gKHtsYXllciwgb25DaGFuZ2UsIHByb3BlcnR5ID0gJ2NvbG9yUmFuZ2UnLCBzZXRDb2xvclVJfSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICA8Q29sb3JTZWxlY3RvclxuICAgICAgY29sb3JTZXRzPXtbXG4gICAgICAgIHtcbiAgICAgICAgICBzZWxlY3RlZENvbG9yOiBsYXllci5jb25maWcudmlzQ29uZmlnW3Byb3BlcnR5XSxcbiAgICAgICAgICBpc1JhbmdlOiB0cnVlLFxuICAgICAgICAgIHNldENvbG9yOiBjb2xvclJhbmdlID0+IG9uQ2hhbmdlKHtbcHJvcGVydHldOiBjb2xvclJhbmdlfSlcbiAgICAgICAgfVxuICAgICAgXX1cbiAgICAgIGNvbG9yVUk9e2xheWVyLmNvbmZpZy5jb2xvclVJW3Byb3BlcnR5XX1cbiAgICAgIHNldENvbG9yVUk9e25ld0NvbmZpZyA9PiBzZXRDb2xvclVJKHByb3BlcnR5LCBuZXdDb25maWcpfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbmV4cG9ydCBjb25zdCBDaGFubmVsQnlWYWx1ZVNlbGVjdG9yID0gKHtsYXllciwgY2hhbm5lbCwgb25DaGFuZ2UsIGZpZWxkcywgZGVzY3JpcHRpb259KSA9PiB7XG4gIGNvbnN0IHtcbiAgICBjaGFubmVsU2NhbGVUeXBlLFxuICAgIGRvbWFpbixcbiAgICBmaWVsZCxcbiAgICBrZXksXG4gICAgcHJvcGVydHksXG4gICAgcmFuZ2UsXG4gICAgc2NhbGUsXG4gICAgZGVmYXVsdE1lYXN1cmUsXG4gICAgc3VwcG9ydGVkRmllbGRUeXBlc1xuICB9ID0gY2hhbm5lbDtcbiAgY29uc3QgY2hhbm5lbFN1cHBvcnRlZEZpZWxkVHlwZXMgPVxuICAgIHN1cHBvcnRlZEZpZWxkVHlwZXMgfHwgQ0hBTk5FTF9TQ0FMRV9TVVBQT1JURURfRklFTERTW2NoYW5uZWxTY2FsZVR5cGVdO1xuICBjb25zdCBzdXBwb3J0ZWRGaWVsZHMgPSBmaWVsZHMuZmlsdGVyKCh7dHlwZX0pID0+IGNoYW5uZWxTdXBwb3J0ZWRGaWVsZFR5cGVzLmluY2x1ZGVzKHR5cGUpKTtcbiAgY29uc3Qgc2NhbGVPcHRpb25zID0gbGF5ZXIuZ2V0U2NhbGVPcHRpb25zKGNoYW5uZWwua2V5KTtcbiAgY29uc3Qgc2hvd1NjYWxlID0gIWxheWVyLmlzQWdncmVnYXRlZCAmJiBsYXllci5jb25maWdbc2NhbGVdICYmIHNjYWxlT3B0aW9ucy5sZW5ndGggPiAxO1xuICBjb25zdCBkZWZhdWx0RGVzY3JpcHRpb24gPSAnbGF5ZXJDb25maWd1cmF0aW9uLmRlZmF1bHREZXNjcmlwdGlvbic7XG5cbiAgcmV0dXJuIChcbiAgICA8VmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yXG4gICAgICBjaGFubmVsPXtjaGFubmVsLmtleX1cbiAgICAgIGRlc2NyaXB0aW9uPXtkZXNjcmlwdGlvbiB8fCBkZWZhdWx0RGVzY3JpcHRpb259XG4gICAgICBkb21haW49e2xheWVyLmNvbmZpZ1tkb21haW5dfVxuICAgICAgZmllbGRzPXtzdXBwb3J0ZWRGaWVsZHN9XG4gICAgICBpZD17bGF5ZXIuaWR9XG4gICAgICBrZXk9e2Ake2tleX0tY2hhbm5lbC1zZWxlY3RvcmB9XG4gICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICBwbGFjZWhvbGRlcj17ZGVmYXVsdE1lYXN1cmUgfHwgJ3BsYWNlaG9sZGVyLnNlbGVjdEZpZWxkJ31cbiAgICAgIHJhbmdlPXtsYXllci5jb25maWcudmlzQ29uZmlnW3JhbmdlXX1cbiAgICAgIHNjYWxlT3B0aW9ucz17c2NhbGVPcHRpb25zfVxuICAgICAgc2NhbGVUeXBlPXtzY2FsZSA/IGxheWVyLmNvbmZpZ1tzY2FsZV0gOiBudWxsfVxuICAgICAgc2VsZWN0ZWRGaWVsZD17bGF5ZXIuY29uZmlnW2ZpZWxkXX1cbiAgICAgIHNob3dTY2FsZT17c2hvd1NjYWxlfVxuICAgICAgdXBkYXRlRmllbGQ9e3ZhbCA9PiBvbkNoYW5nZSh7W2ZpZWxkXTogdmFsfSwga2V5KX1cbiAgICAgIHVwZGF0ZVNjYWxlPXt2YWwgPT4gb25DaGFuZ2Uoe1tzY2FsZV06IHZhbH0sIGtleSl9XG4gICAgLz5cbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBBZ2dyU2NhbGVTZWxlY3RvciA9ICh7Y2hhbm5lbCwgbGF5ZXIsIG9uQ2hhbmdlfSkgPT4ge1xuICBjb25zdCB7c2NhbGUsIGtleX0gPSBjaGFubmVsO1xuICBjb25zdCBzY2FsZU9wdGlvbnMgPSBsYXllci5nZXRTY2FsZU9wdGlvbnMoa2V5KTtcblxuICByZXR1cm4gQXJyYXkuaXNBcnJheShzY2FsZU9wdGlvbnMpICYmIHNjYWxlT3B0aW9ucy5sZW5ndGggPiAxID8gKFxuICAgIDxEaW1lbnNpb25TY2FsZVNlbGVjdG9yXG4gICAgICBsYWJlbD17YCR7a2V5fSBTY2FsZWB9XG4gICAgICBvcHRpb25zPXtzY2FsZU9wdGlvbnN9XG4gICAgICBzY2FsZVR5cGU9e2xheWVyLmNvbmZpZ1tzY2FsZV19XG4gICAgICBvblNlbGVjdD17dmFsID0+IG9uQ2hhbmdlKHtbc2NhbGVdOiB2YWx9LCBrZXkpfVxuICAgIC8+XG4gICkgOiBudWxsO1xufTtcblxuZXhwb3J0IGNvbnN0IEFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yID0gKHtsYXllciwgY2hhbm5lbCwgb25DaGFuZ2V9KSA9PiB7XG4gIGNvbnN0IHtmaWVsZCwgYWdncmVnYXRpb24sIGtleX0gPSBjaGFubmVsO1xuICBjb25zdCBzZWxlY3RlZEZpZWxkID0gbGF5ZXIuY29uZmlnW2ZpZWxkXTtcbiAgY29uc3Qge3Zpc0NvbmZpZ30gPSBsYXllci5jb25maWc7XG5cbiAgLy8gYWdncmVnYXRpb24gc2hvdWxkIG9ubHkgYmUgc2VsZWN0YWJsZSB3aGVuIGZpZWxkIGlzIHNlbGVjdGVkXG4gIGNvbnN0IGFnZ3JlZ2F0aW9uT3B0aW9ucyA9IGxheWVyLmdldEFnZ3JlZ2F0aW9uT3B0aW9ucyhrZXkpO1xuXG4gIHJldHVybiAoXG4gICAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydsYXllci5hZ2dyZWdhdGVCeSd9IHZhbHVlcz17e2ZpZWxkOiBzZWxlY3RlZEZpZWxkLm5hbWV9fSAvPlxuICAgICAgPC9QYW5lbExhYmVsPlxuICAgICAgPEl0ZW1TZWxlY3RvclxuICAgICAgICBzZWxlY3RlZEl0ZW1zPXt2aXNDb25maWdbYWdncmVnYXRpb25dfVxuICAgICAgICBvcHRpb25zPXthZ2dyZWdhdGlvbk9wdGlvbnN9XG4gICAgICAgIG11bHRpU2VsZWN0PXtmYWxzZX1cbiAgICAgICAgc2VhcmNoYWJsZT17ZmFsc2V9XG4gICAgICAgIG9uQ2hhbmdlPXt2YWx1ZSA9PlxuICAgICAgICAgIG9uQ2hhbmdlKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB2aXNDb25maWc6IHtcbiAgICAgICAgICAgICAgICAuLi5sYXllci5jb25maWcudmlzQ29uZmlnLFxuICAgICAgICAgICAgICAgIFthZ2dyZWdhdGlvbl06IHZhbHVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFubmVsLmtleVxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgLz5cbiAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICk7XG59O1xuLyogZXNsaW50LWVuYWJsZSBtYXgtcGFyYW1zICovXG4iXX0=