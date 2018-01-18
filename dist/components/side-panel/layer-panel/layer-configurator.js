'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisConfigSlider = exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Color = require('d3-color');

var _reactSwitch = require('@uber/react-switch');

var _rangeSlider = require('../../common/range-slider');

var _rangeSlider2 = _interopRequireDefault(_rangeSlider);

var _styledComponents = require('../../common/styled-components');

var _infoHelper = require('../../common/info-helper');

var _infoHelper2 = _interopRequireDefault(_infoHelper);

var _itemSelector = require('../../common/item-selector/item-selector');

var _itemSelector2 = _interopRequireDefault(_itemSelector);

var _visConfigByFieldSelector = require('./vis-config-by-field-selector');

var _visConfigByFieldSelector2 = _interopRequireDefault(_visConfigByFieldSelector);

var _layerColumnConfig = require('./layer-column-config');

var _layerColumnConfig2 = _interopRequireDefault(_layerColumnConfig);

var _colorRangeSelector = require('./color-range-selector');

var _colorRangeSelector2 = _interopRequireDefault(_colorRangeSelector);

var _dimensionScaleSelector = require('./dimension-scale-selector');

var _dimensionScaleSelector2 = _interopRequireDefault(_dimensionScaleSelector);

var _colorSingleSelector = require('./color-single-selector');

var _colorSingleSelector2 = _interopRequireDefault(_colorSingleSelector);

var _sourceDataSelector = require('../source-data-selector');

var _sourceDataSelector2 = _interopRequireDefault(_sourceDataSelector);

var _layerFactory = require('../../../keplergl-layers/layer-factory');

var _utils = require('../../../utils/utils');

var _colorUtils = require('../../../utils/color-utils');

var _defaultSettings = require('../../../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  layer: _propTypes2.default.object.isRequired,
  datasets: _propTypes2.default.object.isRequired,
  openModal: _propTypes2.default.func.isRequired,
  panelWidth: _propTypes2.default.number.isRequired,
  updateLayerConfig: _propTypes2.default.func.isRequired,
  updateLayerType: _propTypes2.default.func.isRequired,
  updateLayerVisConfig: _propTypes2.default.func.isRequired,
  updateLayerVisualChannelConfig: _propTypes2.default.func.isRequired
};

var LayerConfigurator = function (_Component) {
  (0, _inherits3.default)(LayerConfigurator, _Component);

  function LayerConfigurator() {
    (0, _classCallCheck3.default)(this, LayerConfigurator);
    return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
  }

  LayerConfigurator.prototype._renderPointLayerConfig = function _renderPointLayerConfig(props) {
    return this._renderScatterplotLayerConfig(props);
  };

  LayerConfigurator.prototype._renderIconLayerConfig = function _renderIconLayerConfig(props) {
    return this._renderScatterplotLayerConfig(props);
  };

  LayerConfigurator.prototype._renderScatterplotLayerConfig = function _renderScatterplotLayerConfig(_ref) {
    var layer = _ref.layer,
        visConfiguratorProps = _ref.visConfiguratorProps,
        layerChannelConfigProps = _ref.layerChannelConfigProps,
        layerConfiguratorProps = _ref.layerConfiguratorProps;

    return _react2.default.createElement(
      'div',
      { className: 'push-small--top' },
      _react2.default.createElement(LayerColorSelector, layerConfiguratorProps),
      _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
        channel: layer.visualChannels.color
      }, layerChannelConfigProps)),
      layer.config.colorField ? _react2.default.createElement(ColorRangeConfig, visConfiguratorProps) : null,
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps)),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.radius, visConfiguratorProps, {
        disabled: Boolean(layer.config.sizeField) })),
      _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
        channel: layer.visualChannels.size
      }, layerChannelConfigProps)),
      _react2.default.createElement(VisConfigSwitch, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.fixedRadius, visConfiguratorProps, {
        disabled: !layer.config.sizeField
      })),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.radiusRange, visConfiguratorProps, {
        disabled: !layer.config.sizeField || layer.config.visConfig.fixedRadius
      })),
      layer.type === _defaultSettings.LAYER_TYPES.point ? _react2.default.createElement(VisConfigSwitch, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.outline, visConfiguratorProps)) : null,
      layer.type === _defaultSettings.LAYER_TYPES.point ? _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.thickness, visConfiguratorProps, {
        label: '', disabled: !layer.config.visConfig.outline })) : null,
      _react2.default.createElement(HighPrecisionSwitch, visConfiguratorProps)
    );
  };

  LayerConfigurator.prototype._renderClusterLayerConfig = function _renderClusterLayerConfig(_ref2) {
    var layer = _ref2.layer,
        visConfiguratorProps = _ref2.visConfiguratorProps,
        layerConfiguratorProps = _ref2.layerConfiguratorProps,
        layerChannelConfigProps = _ref2.layerChannelConfigProps;


    return _react2.default.createElement(
      'div',
      { className: 'push-small--top' },
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.clusterRadius, visConfiguratorProps)),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.clusterRadiusRange, visConfiguratorProps)),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps)),
      _react2.default.createElement(ColorRangeConfig, visConfiguratorProps),
      _react2.default.createElement(AggrColorScaleSelector, layerConfiguratorProps),
      _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
        channel: layer.visualChannels.color
      }, layerChannelConfigProps)),
      _react2.default.createElement(AggregationTypeSelector, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.aggregation, visConfiguratorProps, {
        field: layer.config.colorField }))
    );
  };

  LayerConfigurator.prototype._renderGridLayerConfig = function _renderGridLayerConfig(props) {
    return this._renderAggregationLayerConfig(props);
  };

  LayerConfigurator.prototype._renderHexagonLayerConfig = function _renderHexagonLayerConfig(props) {
    return this._renderAggregationLayerConfig(props);
  };

  LayerConfigurator.prototype._renderAggregationLayerConfig = function _renderAggregationLayerConfig(_ref3) {
    var layer = _ref3.layer,
        visConfiguratorProps = _ref3.visConfiguratorProps,
        layerConfiguratorProps = _ref3.layerConfiguratorProps,
        layerChannelConfigProps = _ref3.layerChannelConfigProps;
    var type = layer.type,
        config = layer.config;
    var enable3d = config.visConfig.enable3d,
        colorField = config.colorField,
        sizeField = config.sizeField;

    var elevationByDescription = 'When off, height is based on count of points';
    var colorByDescription = 'When off, color is based on count of points';

    return _react2.default.createElement(
      'div',
      { className: 'push-small--top' },
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps)),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.worldUnitSize, visConfiguratorProps, {
        label: (type === _defaultSettings.LAYER_TYPES.grid ? 'Grid Size' : 'Hexagon Radius') + ' (km)' })),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.coverage, visConfiguratorProps)),
      _react2.default.createElement(ColorRangeConfig, visConfiguratorProps),
      _react2.default.createElement(AggrColorScaleSelector, layerConfiguratorProps),
      _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
        channel: layer.visualChannels.color
      }, layerChannelConfigProps)),
      _react2.default.createElement(AggregationTypeSelector, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.aggregation, visConfiguratorProps, {
        descreiption: colorByDescription,
        field: colorField })),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.percentile, visConfiguratorProps)),
      _react2.default.createElement(VisConfigSwitch, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.enable3d, visConfiguratorProps)),
      enable3d ? _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({}, layerChannelConfigProps, {
        channel: layer.visualChannels.size,
        description: elevationByDescription })) : null,
      _react2.default.createElement(AggregationTypeSelector, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.aggregation, visConfiguratorProps, {
        property: 'sizeAggregation',
        field: sizeField })),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.percentile, visConfiguratorProps, {
        property: 'elevationPercentile',
        disabled: !enable3d || !colorField && !sizeField })),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.elevationScale, visConfiguratorProps)),
      _react2.default.createElement(HighPrecisionSwitch, visConfiguratorProps)
    );
  };

  LayerConfigurator.prototype._renderHexagonIdLayerConfig = function _renderHexagonIdLayerConfig(_ref4) {
    var layer = _ref4.layer,
        visConfiguratorProps = _ref4.visConfiguratorProps,
        layerConfiguratorProps = _ref4.layerConfiguratorProps,
        layerChannelConfigProps = _ref4.layerChannelConfigProps;


    return _react2.default.createElement(
      'div',
      { className: 'push-small--top' },
      _react2.default.createElement(LayerColorSelector, layerConfiguratorProps),
      _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
        channel: layer.visualChannels.color
      }, layerChannelConfigProps)),
      layer.config.colorField ? _react2.default.createElement(ColorRangeConfig, visConfiguratorProps) : null,
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps)),
      _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
        channel: layer.visualChannels.size
      }, layerChannelConfigProps)),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.elevationScale, visConfiguratorProps)),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.elevationRange, visConfiguratorProps, {
        label: 'Height Range',
        disabled: !layer.config.sizeField })),
      _react2.default.createElement(HighPrecisionSwitch, visConfiguratorProps)
    );
  };

  LayerConfigurator.prototype._renderArcLayerConfig = function _renderArcLayerConfig(args) {
    return this._renderLineLayerConfig(args);
  };

  LayerConfigurator.prototype._renderLineLayerConfig = function _renderLineLayerConfig(_ref5) {
    var layer = _ref5.layer,
        visConfiguratorProps = _ref5.visConfiguratorProps,
        layerConfiguratorProps = _ref5.layerConfiguratorProps,
        layerChannelConfigProps = _ref5.layerChannelConfigProps;


    return _react2.default.createElement(
      'div',
      { className: 'push-small--top' },
      _react2.default.createElement(LayerColorSelector, (0, _extends3.default)({}, layerConfiguratorProps, {
        label: 'Source Color'
      })),
      _react2.default.createElement(VisColorSelector, (0, _extends3.default)({}, visConfiguratorProps, _layerFactory.LAYER_VIS_CONFIGS.targetColor)),
      _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
        channel: layer.visualChannels.color
      }, layerChannelConfigProps)),
      layer.config.colorField ? _react2.default.createElement(ColorRangeConfig, visConfiguratorProps) : null,
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps)),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.thickness, visConfiguratorProps)),
      _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
        channel: layer.visualChannels.size
      }, layerChannelConfigProps)),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.strokeWidthRange, visConfiguratorProps, {
        disabled: !layer.config.sizeField })),
      _react2.default.createElement(HighPrecisionSwitch, visConfiguratorProps)
    );
  };

  LayerConfigurator.prototype._renderGeojsonLayerConfig = function _renderGeojsonLayerConfig(_ref6) {
    var layer = _ref6.layer,
        visConfiguratorProps = _ref6.visConfiguratorProps,
        layerConfiguratorProps = _ref6.layerConfiguratorProps,
        layerChannelConfigProps = _ref6.layerChannelConfigProps;
    var _layer$meta$featureTy = layer.meta.featureTypes,
        featureTypes = _layer$meta$featureTy === undefined ? {} : _layer$meta$featureTy,
        visConfig = layer.config.visConfig;


    return _react2.default.createElement(
      'div',
      { className: 'push-small--top' },
      _react2.default.createElement(LayerColorSelector, layerConfiguratorProps),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps)),
      featureTypes.polygon ? _react2.default.createElement(VisConfigSwitch, (0, _extends3.default)({}, visConfiguratorProps, _layerFactory.LAYER_VIS_CONFIGS.filled)) : null,
      _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
        channel: layer.visualChannels.color
      }, layerChannelConfigProps)),
      layer.config.colorField ? _react2.default.createElement(ColorRangeConfig, visConfiguratorProps) : null,
      featureTypes.polygon ? _react2.default.createElement(VisConfigSwitch, (0, _extends3.default)({}, visConfiguratorProps, _layerFactory.LAYER_VIS_CONFIGS.stroked)) : null,
      featureTypes.line || featureTypes.polygon && visConfig.stroked ? _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.thickness, visConfiguratorProps)),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.size
        }, layerChannelConfigProps)),
        _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.strokeWidthRange, visConfiguratorProps, {
          disabled: !layer.config.sizeField }))
      ) : null,
      featureTypes.polygon && visConfig.filled ? _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(VisConfigSwitch, (0, _extends3.default)({}, visConfiguratorProps, _layerFactory.LAYER_VIS_CONFIGS.enable3d)),
        _react2.default.createElement(VisConfigSwitch, (0, _extends3.default)({}, visConfiguratorProps, _layerFactory.LAYER_VIS_CONFIGS.wireframe, {
          disabled: !visConfig.enable3d
        })),
        visConfig.enable3d ? _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.height
        }, layerChannelConfigProps)) : null,
        _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.elevationScale, visConfiguratorProps, {
          disabled: !visConfig.enable3d }))
      ) : null,
      featureTypes.point ? _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.radius, visConfiguratorProps, {
          label: 'Point Radius',
          disabled: Boolean(layer.config.radiusField) })),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.radius
        }, layerChannelConfigProps)),
        _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.radiusRange, visConfiguratorProps, {
          disabled: !layer.config.radiusField }))
      ) : null,
      _react2.default.createElement(HighPrecisionSwitch, visConfiguratorProps)
    );
  };

  LayerConfigurator.prototype.render = function render() {
    var _props = this.props,
        layer = _props.layer,
        datasets = _props.datasets,
        panelWidth = _props.panelWidth,
        isAdding = _props.isAdding,
        updateLayerConfig = _props.updateLayerConfig;

    var _ref7 = layer.config.dataId ? datasets[layer.config.dataId] : {},
        _ref7$fields = _ref7.fields,
        fields = _ref7$fields === undefined ? [] : _ref7$fields,
        fieldPairs = _ref7.fieldPairs;

    var config = layer.config;


    var commonConfigProp = {
      layer: layer,
      panelWidth: panelWidth,
      fields: fields
    };

    var visConfiguratorProps = (0, _extends3.default)({}, commonConfigProp, {
      onChange: this.props.updateLayerVisConfig
    });

    var layerConfiguratorProps = (0, _extends3.default)({}, commonConfigProp, {
      onChange: updateLayerConfig
    });

    var layerChannelConfigProps = (0, _extends3.default)({}, commonConfigProp, {
      onChange: this.props.updateLayerVisualChannelConfig
    });

    var renderTemplate = layer.type && '_render' + (0, _utils.capitalizeFirstLetter)(layer.type) + 'LayerConfig';

    return _react2.default.createElement(
      'div',
      { className: 'soft-tiny layer-panel__config' },
      Object.keys(datasets).length > 1 && _react2.default.createElement(_sourceDataSelector2.default, {
        datasets: datasets,
        id: layer.id,
        disabled: layer.tyep && config.columns,
        dataId: config.dataId,
        onSelect: function onSelect(value) {
          return updateLayerConfig({ dataId: value });
        } }),
      _react2.default.createElement(_layerColumnConfig2.default, {
        layer: layer,
        fields: fields,
        fieldPairs: fieldPairs,
        updateLayerConfig: updateLayerConfig,
        updateLayerType: this.props.updateLayerType,
        openModal: this.props.openModal }),
      !isAdding && this[renderTemplate] && this[renderTemplate]({
        layer: layer,
        visConfiguratorProps: visConfiguratorProps,
        layerChannelConfigProps: layerChannelConfigProps,
        layerConfiguratorProps: layerConfiguratorProps
      })
    );
  };

  return LayerConfigurator;
}(_react.Component);

exports.default = LayerConfigurator;


LayerConfigurator.propTypes = propTypes;

/*
 * Componentize config component into pure functional components
 */
var VisConfigSwitch = function VisConfigSwitch(_ref8) {
  var _ref8$layer = _ref8.layer,
      id = _ref8$layer.id,
      config = _ref8$layer.config,
      property = _ref8.property,
      _onChange2 = _ref8.onChange,
      label = _ref8.label,
      description = _ref8.description,
      disabled = _ref8.disabled;
  return _react2.default.createElement(
    _styledComponents.SidePanelSection,
    { disabled: Boolean(disabled) },
    _react2.default.createElement(
      _styledComponents.PanelLabel,
      null,
      label || (0, _utils.capitalizeFirstLetter)(property)
    ),
    description ? _react2.default.createElement(
      'div',
      { className: 'display--inline-block' },
      _react2.default.createElement(_infoHelper2.default, { description: description, id: id + '-' + property })
    ) : null,
    _react2.default.createElement(
      'div',
      { className: 'display--inline-block float--right' },
      _react2.default.createElement(_reactSwitch.Switch, {
        className: 'micro text-uber-black-40',
        style: { marginBottom: 0, marginRight: '-10px' },
        checked: config.visConfig[property],
        id: id + '-' + property,
        label: ' ',
        onChange: function onChange() {
          var _onChange;

          return _onChange2((_onChange = {}, _onChange[property] = !config.visConfig[property], _onChange));
        },
        size: 'small'
      })
    )
  );
};

/* eslint-disable max-params */
var VisConfigSlider = exports.VisConfigSlider = function VisConfigSlider(_ref9) {
  var config = _ref9.layer.config,
      property = _ref9.property,
      label = _ref9.label,
      range = _ref9.range,
      step = _ref9.step,
      isRanged = _ref9.isRanged,
      disabled = _ref9.disabled,
      _onChange4 = _ref9.onChange;
  return _react2.default.createElement(
    _styledComponents.SidePanelSection,
    { disabled: Boolean(disabled) },
    _react2.default.createElement(
      _styledComponents.PanelLabel,
      null,
      typeof label === 'string' ? label : typeof label === 'function' ? label(config) : (0, _utils.capitalizeFirstLetter)(property)
    ),
    _react2.default.createElement(_rangeSlider2.default, {
      minValue: range[0],
      maxValue: range[1],
      value0: isRanged ? config.visConfig[property][0] : range[0],
      value1: isRanged ? config.visConfig[property][1] : config.visConfig[property],
      step: step,
      isRanged: Boolean(isRanged),
      showInput: true,
      onChange: function onChange(value) {
        var _onChange3;

        return _onChange4((_onChange3 = {}, _onChange3[property] = isRanged ? value : value[1], _onChange3));
      } })
  );
};
/* eslint-enable max-params */

var HighPrecisionSwitch = function HighPrecisionSwitch(_ref10) {
  var layer = _ref10.layer,
      onChange = _ref10.onChange;
  return _react2.default.createElement(VisConfigSwitch, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS['hi-precision'], {
    layer: layer,
    onChange: onChange }));
};

var LayerColorSelector = function LayerColorSelector(_ref11) {
  var layer = _ref11.layer,
      panelWidth = _ref11.panelWidth,
      onChange = _ref11.onChange,
      label = _ref11.label;
  return _react2.default.createElement(
    _styledComponents.SidePanelSection,
    { disabled: layer.config.colorField },
    _react2.default.createElement(
      _styledComponents.PanelLabel,
      null,
      label || 'Layer Color'
    ),
    _react2.default.createElement(_colorSingleSelector2.default, {
      width: panelWidth,
      setColor: function setColor(hex) {
        return onChange({ color: (0, _colorUtils.hexToRgb)(hex) });
      },
      selectedColor: _d3Color.rgb.apply(undefined, layer.config.color).toString().toUpperCase() })
  );
};

var VisColorSelector = function VisColorSelector(_ref12) {
  var layer = _ref12.layer,
      panelWidth = _ref12.panelWidth,
      onChange = _ref12.onChange,
      label = _ref12.label,
      property = _ref12.property;
  return _react2.default.createElement(
    _styledComponents.SidePanelSection,
    {
      disabled: layer.config.colorField },
    _react2.default.createElement(
      _styledComponents.PanelLabel,
      null,
      label || 'Target Color'
    ),
    _react2.default.createElement(_colorSingleSelector2.default, {
      width: panelWidth,
      setColor: function setColor(hex) {
        var _onChange5;

        return onChange((_onChange5 = {}, _onChange5[property] = (0, _colorUtils.hexToRgb)(hex), _onChange5));
      },
      selectedColor: _d3Color.rgb.apply(undefined, layer.config.visConfig[property] || layer.config.color).toString().toUpperCase() })
  );
};

var ColorRangeConfig = function ColorRangeConfig(_ref13) {
  var layer = _ref13.layer,
      panelWidth = _ref13.panelWidth,
      onChange = _ref13.onChange;
  return _react2.default.createElement(
    _styledComponents.SidePanelSection,
    null,
    _react2.default.createElement(
      _styledComponents.PanelLabel,
      null,
      'Color Palette'
    ),
    _react2.default.createElement(_colorRangeSelector2.default, {
      width: panelWidth,
      selectedColorRange: layer.config.visConfig.colorRange,
      onSelectColorRange: onChange })
  );
};

var ChannelByValueSelector = function ChannelByValueSelector(_ref14) {
  var layer = _ref14.layer,
      channel = _ref14.channel,
      panelWidth = _ref14.panelWidth,
      onChange = _ref14.onChange,
      fields = _ref14.fields,
      description = _ref14.description;
  var channelScaleType = channel.channelScaleType,
      domain = channel.domain,
      field = channel.field,
      key = channel.key,
      property = channel.property,
      range = channel.range,
      scale = channel.scale;

  var supportedFieldTypes = _defaultSettings.CHANNEL_SCALE_SUPPORTED_FIELDS[channelScaleType];
  var supportedFields = fields.filter(function (_ref15) {
    var type = _ref15.type;
    return supportedFieldTypes.includes(type);
  });
  var selectedField = layer.config[field];
  var scaleOptions = selectedField && _defaultSettings.FIELD_OPTS[selectedField.type].scale[channelScaleType] || [];
  var showScale = !layer.isAggregated && scaleOptions.length > 1;
  var defaultDescription = 'Calculate ' + property + ' based on selected field';

  return _react2.default.createElement(_visConfigByFieldSelector2.default, {
    channel: channel.key,
    description: description || defaultDescription,
    domain: layer.config[domain],
    fields: supportedFields,
    id: layer.id,
    innerPanelWidth: panelWidth,
    key: key + '-channel-selector',
    property: property,
    range: layer.config.visConfig[range],
    scaleOptions: scaleOptions,
    scaleType: layer.config[scale],
    selectedField: layer.config[field],
    showScale: showScale,
    updateField: function updateField(val) {
      var _onChange6;

      return onChange((_onChange6 = {}, _onChange6[field] = val, _onChange6), key);
    },
    updateScale: function updateScale(val) {
      var _onChange7;

      return onChange((_onChange7 = {}, _onChange7[scale] = val, _onChange7), key);
    }
  });
};

var AggrColorScaleSelector = function AggrColorScaleSelector(_ref16) {
  var config = _ref16.layer.config,
      onChange = _ref16.onChange;
  return _react2.default.createElement(_dimensionScaleSelector2.default, {
    label: 'Color Scale',
    options: config.colorField ? _defaultSettings.FIELD_OPTS[config.colorField.type].scale.colorAggr : _defaultSettings.FIELD_OPTS.integer.scale.colorAggr,
    scaleType: config.colorScale,
    onSelect: function onSelect(val) {
      return onChange({ colorScale: val }, 'color');
    } });
};

var AggregationTypeSelector = function AggregationTypeSelector(_ref17) {
  var visConfig = _ref17.layer.config.visConfig,
      field = _ref17.field,
      property = _ref17.property,
      options = _ref17.options,
      _onChange9 = _ref17.onChange;
  return _react2.default.createElement(
    _styledComponents.SidePanelSection,
    null,
    _react2.default.createElement(
      _styledComponents.PanelLabel,
      null,
      'Aggregate ' + (field ? field.name : '') + ' by'
    ),
    _react2.default.createElement(_itemSelector2.default, {
      disabled: !field,
      selectedItems: visConfig[property],
      options: options,
      multiSelect: false,
      searchable: false,
      onChange: function onChange(value) {
        var _onChange8;

        return _onChange9((_onChange8 = {}, _onChange8[property] = value, _onChange8));
      } })
  );
};
/* eslint-enable max-params */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29uZmlndXJhdG9yLmpzIl0sIm5hbWVzIjpbInByb3BUeXBlcyIsImxheWVyIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImRhdGFzZXRzIiwib3Blbk1vZGFsIiwiZnVuYyIsInBhbmVsV2lkdGgiLCJudW1iZXIiLCJ1cGRhdGVMYXllckNvbmZpZyIsInVwZGF0ZUxheWVyVHlwZSIsInVwZGF0ZUxheWVyVmlzQ29uZmlnIiwidXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnIiwiTGF5ZXJDb25maWd1cmF0b3IiLCJfcmVuZGVyUG9pbnRMYXllckNvbmZpZyIsInByb3BzIiwiX3JlbmRlclNjYXR0ZXJwbG90TGF5ZXJDb25maWciLCJfcmVuZGVySWNvbkxheWVyQ29uZmlnIiwidmlzQ29uZmlndXJhdG9yUHJvcHMiLCJsYXllckNoYW5uZWxDb25maWdQcm9wcyIsImxheWVyQ29uZmlndXJhdG9yUHJvcHMiLCJ2aXN1YWxDaGFubmVscyIsImNvbG9yIiwiY29uZmlnIiwiY29sb3JGaWVsZCIsIm9wYWNpdHkiLCJyYWRpdXMiLCJCb29sZWFuIiwic2l6ZUZpZWxkIiwic2l6ZSIsImZpeGVkUmFkaXVzIiwicmFkaXVzUmFuZ2UiLCJ2aXNDb25maWciLCJ0eXBlIiwicG9pbnQiLCJvdXRsaW5lIiwidGhpY2tuZXNzIiwiX3JlbmRlckNsdXN0ZXJMYXllckNvbmZpZyIsImNsdXN0ZXJSYWRpdXMiLCJjbHVzdGVyUmFkaXVzUmFuZ2UiLCJhZ2dyZWdhdGlvbiIsIl9yZW5kZXJHcmlkTGF5ZXJDb25maWciLCJfcmVuZGVyQWdncmVnYXRpb25MYXllckNvbmZpZyIsIl9yZW5kZXJIZXhhZ29uTGF5ZXJDb25maWciLCJlbmFibGUzZCIsImVsZXZhdGlvbkJ5RGVzY3JpcHRpb24iLCJjb2xvckJ5RGVzY3JpcHRpb24iLCJ3b3JsZFVuaXRTaXplIiwiZ3JpZCIsImNvdmVyYWdlIiwicGVyY2VudGlsZSIsImVsZXZhdGlvblNjYWxlIiwiX3JlbmRlckhleGFnb25JZExheWVyQ29uZmlnIiwiZWxldmF0aW9uUmFuZ2UiLCJfcmVuZGVyQXJjTGF5ZXJDb25maWciLCJhcmdzIiwiX3JlbmRlckxpbmVMYXllckNvbmZpZyIsInRhcmdldENvbG9yIiwic3Ryb2tlV2lkdGhSYW5nZSIsIl9yZW5kZXJHZW9qc29uTGF5ZXJDb25maWciLCJtZXRhIiwiZmVhdHVyZVR5cGVzIiwicG9seWdvbiIsImZpbGxlZCIsInN0cm9rZWQiLCJsaW5lIiwid2lyZWZyYW1lIiwiaGVpZ2h0IiwicmFkaXVzRmllbGQiLCJyZW5kZXIiLCJpc0FkZGluZyIsImRhdGFJZCIsImZpZWxkcyIsImZpZWxkUGFpcnMiLCJjb21tb25Db25maWdQcm9wIiwib25DaGFuZ2UiLCJyZW5kZXJUZW1wbGF0ZSIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJpZCIsInR5ZXAiLCJjb2x1bW5zIiwidmFsdWUiLCJWaXNDb25maWdTd2l0Y2giLCJwcm9wZXJ0eSIsImxhYmVsIiwiZGVzY3JpcHRpb24iLCJkaXNhYmxlZCIsIm1hcmdpbkJvdHRvbSIsIm1hcmdpblJpZ2h0IiwiVmlzQ29uZmlnU2xpZGVyIiwicmFuZ2UiLCJzdGVwIiwiaXNSYW5nZWQiLCJIaWdoUHJlY2lzaW9uU3dpdGNoIiwiTGF5ZXJDb2xvclNlbGVjdG9yIiwiaGV4IiwidG9TdHJpbmciLCJ0b1VwcGVyQ2FzZSIsIlZpc0NvbG9yU2VsZWN0b3IiLCJDb2xvclJhbmdlQ29uZmlnIiwiY29sb3JSYW5nZSIsIkNoYW5uZWxCeVZhbHVlU2VsZWN0b3IiLCJjaGFubmVsIiwiY2hhbm5lbFNjYWxlVHlwZSIsImRvbWFpbiIsImZpZWxkIiwia2V5Iiwic2NhbGUiLCJzdXBwb3J0ZWRGaWVsZFR5cGVzIiwic3VwcG9ydGVkRmllbGRzIiwiZmlsdGVyIiwiaW5jbHVkZXMiLCJzZWxlY3RlZEZpZWxkIiwic2NhbGVPcHRpb25zIiwic2hvd1NjYWxlIiwiaXNBZ2dyZWdhdGVkIiwiZGVmYXVsdERlc2NyaXB0aW9uIiwidmFsIiwiQWdnckNvbG9yU2NhbGVTZWxlY3RvciIsImNvbG9yQWdnciIsImludGVnZXIiLCJjb2xvclNjYWxlIiwiQWdncmVnYXRpb25UeXBlU2VsZWN0b3IiLCJvcHRpb25zIiwibmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBR0E7O0FBRUE7O0FBQ0E7O0FBRUE7Ozs7QUFNQSxJQUFNQSxZQUFZO0FBQ2hCQyxTQUFPLG9CQUFVQyxNQUFWLENBQWlCQyxVQURSO0FBRWhCQyxZQUFVLG9CQUFVRixNQUFWLENBQWlCQyxVQUZYO0FBR2hCRSxhQUFXLG9CQUFVQyxJQUFWLENBQWVILFVBSFY7QUFJaEJJLGNBQVksb0JBQVVDLE1BQVYsQ0FBaUJMLFVBSmI7QUFLaEJNLHFCQUFtQixvQkFBVUgsSUFBVixDQUFlSCxVQUxsQjtBQU1oQk8sbUJBQWlCLG9CQUFVSixJQUFWLENBQWVILFVBTmhCO0FBT2hCUSx3QkFBc0Isb0JBQVVMLElBQVYsQ0FBZUgsVUFQckI7QUFRaEJTLGtDQUFnQyxvQkFBVU4sSUFBVixDQUFlSDtBQVIvQixDQUFsQjs7SUFXcUJVLGlCOzs7Ozs7Ozs4QkFFbkJDLHVCLG9DQUF3QkMsSyxFQUFPO0FBQzdCLFdBQU8sS0FBS0MsNkJBQUwsQ0FBbUNELEtBQW5DLENBQVA7QUFDRCxHOzs4QkFFREUsc0IsbUNBQXVCRixLLEVBQU87QUFDNUIsV0FBTyxLQUFLQyw2QkFBTCxDQUFtQ0QsS0FBbkMsQ0FBUDtBQUNELEc7OzhCQUVEQyw2QixnREFBOEc7QUFBQSxRQUEvRWYsS0FBK0UsUUFBL0VBLEtBQStFO0FBQUEsUUFBeEVpQixvQkFBd0UsUUFBeEVBLG9CQUF3RTtBQUFBLFFBQWxEQyx1QkFBa0QsUUFBbERB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O0FBQ0UsZ0JBQVUsQ0FBQ25CLEtBRGI7QUFFRSxxQkFBZTNFLFVBQVVxRCxRQUFWLENBRmpCO0FBR0UsZUFBU3dDLE9BSFg7QUFJRSxtQkFBYSxLQUpmO0FBS0Usa0JBQVksS0FMZDtBQU1FLGdCQUFVO0FBQUE7O0FBQUEsZUFBU2xELHdDQUFXVSxRQUFYLElBQXNCRixLQUF0QixjQUFUO0FBQUEsT0FOWjtBQUZGLEdBRDhCO0FBQUEsQ0FBaEM7QUFZQSIsImZpbGUiOiJsYXllci1jb25maWd1cmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge3JnYn0gZnJvbSAnZDMtY29sb3InO1xuaW1wb3J0IHtTd2l0Y2h9IGZyb20gJ0B1YmVyL3JlYWN0LXN3aXRjaCc7XG5cbmltcG9ydCBSYW5nZVNsaWRlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9yYW5nZS1zbGlkZXInO1xuaW1wb3J0IHtQYW5lbExhYmVsLCBTaWRlUGFuZWxTZWN0aW9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgSW5mb0hlbHBlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pbmZvLWhlbHBlcic7XG5pbXBvcnQgSXRlbVNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2l0ZW0tc2VsZWN0b3IvaXRlbS1zZWxlY3Rvcic7XG5cbmltcG9ydCBWaXNDb25maWdCeUZpZWxkU2VsZWN0b3IgZnJvbSAnLi92aXMtY29uZmlnLWJ5LWZpZWxkLXNlbGVjdG9yJztcbmltcG9ydCBMYXllckNvbHVtbkNvbmZpZyBmcm9tICcuL2xheWVyLWNvbHVtbi1jb25maWcnO1xuaW1wb3J0IENvbG9yUmFuZ2VTZWxlY3RvciBmcm9tICcuL2NvbG9yLXJhbmdlLXNlbGVjdG9yJztcbmltcG9ydCBEaW1lbnNpb25TY2FsZVNlbGVjdG9yIGZyb20gJy4vZGltZW5zaW9uLXNjYWxlLXNlbGVjdG9yJztcbmltcG9ydCBDb2xvclNpbmdsZVNlbGVjdG9yIGZyb20gJy4vY29sb3Itc2luZ2xlLXNlbGVjdG9yJztcbmltcG9ydCBTb3VyY2VEYXRhU2VsZWN0b3IgZnJvbSAnLi4vc291cmNlLWRhdGEtc2VsZWN0b3InO1xuXG5cbmltcG9ydCB7TEFZRVJfVklTX0NPTkZJR1N9IGZyb20gJ2tlcGxlcmdsLWxheWVycy9sYXllci1mYWN0b3J5JztcblxuaW1wb3J0IHtjYXBpdGFsaXplRmlyc3RMZXR0ZXJ9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcblxuaW1wb3J0IHtcbiAgRklFTERfT1BUUyxcbiAgTEFZRVJfVFlQRVMsXG4gIENIQU5ORUxfU0NBTEVfU1VQUE9SVEVEX0ZJRUxEU1xufSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgbGF5ZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgb3Blbk1vZGFsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBwYW5lbFdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHVwZGF0ZUxheWVyQ29uZmlnOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB1cGRhdGVMYXllclR5cGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHVwZGF0ZUxheWVyVmlzQ29uZmlnOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB1cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyQ29uZmlndXJhdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBfcmVuZGVyUG9pbnRMYXllckNvbmZpZyhwcm9wcykge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJTY2F0dGVycGxvdExheWVyQ29uZmlnKHByb3BzKTtcbiAgfVxuXG4gIF9yZW5kZXJJY29uTGF5ZXJDb25maWcocHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyU2NhdHRlcnBsb3RMYXllckNvbmZpZyhwcm9wcyk7XG4gIH1cblxuICBfcmVuZGVyU2NhdHRlcnBsb3RMYXllckNvbmZpZyh7bGF5ZXIsIHZpc0NvbmZpZ3VyYXRvclByb3BzLCBsYXllckNoYW5uZWxDb25maWdQcm9wcywgbGF5ZXJDb25maWd1cmF0b3JQcm9wc30pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdXNoLXNtYWxsLS10b3BcIj5cbiAgICAgICAge1xuICAgICAgICAgIC8qIENvbG9yICovXG4gICAgICAgIH1cbiAgICAgICAgPExheWVyQ29sb3JTZWxlY3RvclxuICAgICAgICAgIHsuLi5sYXllckNvbmZpZ3VyYXRvclByb3BzfS8+XG4gICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuY29sb3J9XG4gICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfS8+XG4gICAgICAgIHtsYXllci5jb25maWcuY29sb3JGaWVsZCA/XG4gICAgICAgICAgPENvbG9yUmFuZ2VDb25maWcgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPiA6IG51bGx9XG4gICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3BhY2l0eX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9Lz5cbiAgICAgICAge1xuICAgICAgICAgIC8qIFJhZGl1cyAqL1xuICAgICAgICB9XG4gICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MucmFkaXVzfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICBkaXNhYmxlZD17Qm9vbGVhbihsYXllci5jb25maWcuc2l6ZUZpZWxkKX0vPlxuICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfS8+XG4gICAgICAgIDxWaXNDb25maWdTd2l0Y2hcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZml4ZWRSYWRpdXN9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXIuY29uZmlnLnNpemVGaWVsZH1cbiAgICAgICAgLz5cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5yYWRpdXNSYW5nZX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgZGlzYWJsZWQ9eyFsYXllci5jb25maWcuc2l6ZUZpZWxkIHx8IGxheWVyLmNvbmZpZy52aXNDb25maWcuZml4ZWRSYWRpdXN9XG4gICAgICAgIC8+XG4gICAgICAgIHtcbiAgICAgICAgICAvKiBvdXRsaW5lICovXG4gICAgICAgIH1cbiAgICAgICAge2xheWVyLnR5cGUgPT09IExBWUVSX1RZUEVTLnBvaW50ID9cbiAgICAgICAgICA8VmlzQ29uZmlnU3dpdGNoXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3V0bGluZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30vPiA6IG51bGx9XG4gICAgICAgIHtsYXllci50eXBlID09PSBMQVlFUl9UWVBFUy5wb2ludCA/XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnRoaWNrbmVzc31cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIGxhYmVsPXsnJ30gZGlzYWJsZWQ9eyFsYXllci5jb25maWcudmlzQ29uZmlnLm91dGxpbmV9Lz4gOiBudWxsfVxuICAgICAgICB7XG4gICAgICAgICAgLyogaGlnaCBwcmVjaXNpb24gKi9cbiAgICAgICAgfVxuICAgICAgICA8SGlnaFByZWNpc2lvblN3aXRjaFxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIF9yZW5kZXJDbHVzdGVyTGF5ZXJDb25maWcoe2xheWVyLCB2aXNDb25maWd1cmF0b3JQcm9wcywgbGF5ZXJDb25maWd1cmF0b3JQcm9wcywgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9KSB7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdXNoLXNtYWxsLS10b3BcIj5cbiAgICAgICAge1xuICAgICAgICAgIC8qIENsdXN0ZXIgUmFkaXVzICovXG4gICAgICAgIH1cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5jbHVzdGVyUmFkaXVzfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30vPlxuICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmNsdXN0ZXJSYWRpdXNSYW5nZX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9Lz5cbiAgICAgICAge1xuICAgICAgICAgIC8qIE9wYWNpdHkgKi9cbiAgICAgICAgfVxuICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm9wYWNpdHl9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfS8+XG4gICAgICAgIHtcbiAgICAgICAgICAvKiBDb2xvciAqL1xuICAgICAgICB9XG4gICAgICAgIDxDb2xvclJhbmdlQ29uZmlnXG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfS8+XG4gICAgICAgIDxBZ2dyQ29sb3JTY2FsZVNlbGVjdG9yXG4gICAgICAgICAgey4uLmxheWVyQ29uZmlndXJhdG9yUHJvcHN9Lz5cbiAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9Lz5cbiAgICAgICAgPEFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmFnZ3JlZ2F0aW9ufVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICBmaWVsZD17bGF5ZXIuY29uZmlnLmNvbG9yRmllbGR9Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBfcmVuZGVyR3JpZExheWVyQ29uZmlnKHByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlckFnZ3JlZ2F0aW9uTGF5ZXJDb25maWcocHJvcHMpO1xuICB9XG5cbiAgX3JlbmRlckhleGFnb25MYXllckNvbmZpZyhwcm9wcykge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJBZ2dyZWdhdGlvbkxheWVyQ29uZmlnKHByb3BzKTtcbiAgfVxuXG4gIF9yZW5kZXJBZ2dyZWdhdGlvbkxheWVyQ29uZmlnKHtsYXllciwgdmlzQ29uZmlndXJhdG9yUHJvcHMsIGxheWVyQ29uZmlndXJhdG9yUHJvcHMsIGxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfSkge1xuICAgIGNvbnN0IHt0eXBlLCBjb25maWd9ID0gbGF5ZXI7XG4gICAgY29uc3Qge3Zpc0NvbmZpZzoge2VuYWJsZTNkfSwgY29sb3JGaWVsZCwgc2l6ZUZpZWxkfSA9IGNvbmZpZztcbiAgICBjb25zdCBlbGV2YXRpb25CeURlc2NyaXB0aW9uID0gJ1doZW4gb2ZmLCBoZWlnaHQgaXMgYmFzZWQgb24gY291bnQgb2YgcG9pbnRzJztcbiAgICBjb25zdCBjb2xvckJ5RGVzY3JpcHRpb24gPSAnV2hlbiBvZmYsIGNvbG9yIGlzIGJhc2VkIG9uIGNvdW50IG9mIHBvaW50cyc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdXNoLXNtYWxsLS10b3BcIj5cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5vcGFjaXR5fVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30vPlxuICAgICAgICB7XG4gICAgICAgICAgLyogQ2VsbCBzaXplICovXG4gICAgICAgIH1cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy53b3JsZFVuaXRTaXplfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICBsYWJlbD17YCR7dHlwZSA9PT0gTEFZRVJfVFlQRVMuZ3JpZCA/ICdHcmlkIFNpemUnIDogJ0hleGFnb24gUmFkaXVzJ30gKGttKWB9Lz5cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5jb3ZlcmFnZX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9Lz5cbiAgICAgICAge1xuICAgICAgICAgIC8qIENvbG9yICovXG4gICAgICAgIH1cbiAgICAgICAgPENvbG9yUmFuZ2VDb25maWdcbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9Lz5cbiAgICAgICAgPEFnZ3JDb2xvclNjYWxlU2VsZWN0b3Igey4uLmxheWVyQ29uZmlndXJhdG9yUHJvcHN9Lz5cbiAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9Lz5cbiAgICAgICAgPEFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmFnZ3JlZ2F0aW9ufVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICBkZXNjcmVpcHRpb249e2NvbG9yQnlEZXNjcmlwdGlvbn1cbiAgICAgICAgICBmaWVsZD17Y29sb3JGaWVsZH0vPlxuICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnBlcmNlbnRpbGV9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfS8+XG4gICAgICAgIHtcbiAgICAgICAgICAvKiBFbGV2YXRpb24gKi9cbiAgICAgICAgfVxuICAgICAgICA8VmlzQ29uZmlnU3dpdGNoXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmVuYWJsZTNkfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30vPlxuICAgICAgICB7ZW5hYmxlM2QgPyA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5zaXplfVxuICAgICAgICAgIGRlc2NyaXB0aW9uPXtlbGV2YXRpb25CeURlc2NyaXB0aW9ufS8+IDogbnVsbH1cbiAgICAgICAgPEFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmFnZ3JlZ2F0aW9ufVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICBwcm9wZXJ0eT17J3NpemVBZ2dyZWdhdGlvbid9XG4gICAgICAgICAgZmllbGQ9e3NpemVGaWVsZH0vPlxuICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnBlcmNlbnRpbGV9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIHByb3BlcnR5PXsnZWxldmF0aW9uUGVyY2VudGlsZSd9XG4gICAgICAgICAgZGlzYWJsZWQ9eyFlbmFibGUzZCB8fCAoIWNvbG9yRmllbGQgJiYgIXNpemVGaWVsZCl9Lz5cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5lbGV2YXRpb25TY2FsZX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9Lz5cbiAgICAgICAgPEhpZ2hQcmVjaXNpb25Td2l0Y2hcbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9Lz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIF9yZW5kZXJIZXhhZ29uSWRMYXllckNvbmZpZyh7bGF5ZXIsIHZpc0NvbmZpZ3VyYXRvclByb3BzLCBsYXllckNvbmZpZ3VyYXRvclByb3BzLCBsYXllckNoYW5uZWxDb25maWdQcm9wc30pIHtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1c2gtc21hbGwtLXRvcFwiPlxuICAgICAgICB7XG4gICAgICAgICAgLyogQ29sb3IgKi9cbiAgICAgICAgfVxuICAgICAgICA8TGF5ZXJDb2xvclNlbGVjdG9yXG4gICAgICAgICAgey4uLmxheWVyQ29uZmlndXJhdG9yUHJvcHN9Lz5cbiAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9Lz5cbiAgICAgICAge2xheWVyLmNvbmZpZy5jb2xvckZpZWxkID9cbiAgICAgICAgICA8Q29sb3JSYW5nZUNvbmZpZ1xuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPiA6IG51bGx9XG4gICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3BhY2l0eX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9Lz5cbiAgICAgICAge1xuICAgICAgICAgIC8qIGhlaWdodCAqL1xuICAgICAgICB9XG4gICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZX1cbiAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9Lz5cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5lbGV2YXRpb25TY2FsZX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9Lz5cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5lbGV2YXRpb25SYW5nZX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgbGFiZWw9eydIZWlnaHQgUmFuZ2UnfVxuICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXIuY29uZmlnLnNpemVGaWVsZH0vPlxuICAgICAgICA8SGlnaFByZWNpc2lvblN3aXRjaCB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBfcmVuZGVyQXJjTGF5ZXJDb25maWcoYXJncykge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJMaW5lTGF5ZXJDb25maWcoYXJncyk7XG4gIH1cblxuICBfcmVuZGVyTGluZUxheWVyQ29uZmlnKHtsYXllciwgdmlzQ29uZmlndXJhdG9yUHJvcHMsIGxheWVyQ29uZmlndXJhdG9yUHJvcHMsIGxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfSkge1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVzaC1zbWFsbC0tdG9wXCI+XG5cbiAgICAgICAge1xuICAgICAgICAgIC8qIENvbG9yICovXG4gICAgICAgIH1cbiAgICAgICAgPExheWVyQ29sb3JTZWxlY3RvclxuICAgICAgICAgIHsuLi5sYXllckNvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIGxhYmVsPVwiU291cmNlIENvbG9yXCJcbiAgICAgICAgLz5cbiAgICAgICAgPFZpc0NvbG9yU2VsZWN0b3JcbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnRhcmdldENvbG9yfVxuICAgICAgICAvPlxuICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc30vPlxuICAgICAgICB7bGF5ZXIuY29uZmlnLmNvbG9yRmllbGQgP1xuICAgICAgICAgIDxDb2xvclJhbmdlQ29uZmlnIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz4gOiBudWxsfVxuICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm9wYWNpdHl9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfS8+XG5cbiAgICAgICAge1xuICAgICAgICAgIC8qIHRoaWNrbmVzcyAqL1xuICAgICAgICB9XG4gICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MudGhpY2tuZXNzfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30vPlxuICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfS8+XG4gICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Muc3Ryb2tlV2lkdGhSYW5nZX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgZGlzYWJsZWQ9eyFsYXllci5jb25maWcuc2l6ZUZpZWxkfS8+XG4gICAgICAgIHtcbiAgICAgICAgICAvKiBoaWdoIHByZWNpc2lvbiAqL1xuICAgICAgICB9XG4gICAgICAgIDxIaWdoUHJlY2lzaW9uU3dpdGNoXG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfS8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlckdlb2pzb25MYXllckNvbmZpZyh7bGF5ZXIsIHZpc0NvbmZpZ3VyYXRvclByb3BzLCBsYXllckNvbmZpZ3VyYXRvclByb3BzLCBsYXllckNoYW5uZWxDb25maWdQcm9wc30pIHtcbiAgICBjb25zdCB7XG4gICAgICBtZXRhOiB7ZmVhdHVyZVR5cGVzID0ge319LFxuICAgICAgY29uZmlnOiB7dmlzQ29uZmlnfVxuICAgIH0gPSBsYXllcjtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1c2gtc21hbGwtLXRvcFwiPlxuICAgICAgICA8TGF5ZXJDb2xvclNlbGVjdG9yIHsuLi5sYXllckNvbmZpZ3VyYXRvclByb3BzfS8+XG4gICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3BhY2l0eX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9Lz5cblxuICAgICAgICB7XG4gICAgICAgICAgLyogQ29sb3IgQnkgKi9cbiAgICAgICAgfVxuXG4gICAgICAgIHtmZWF0dXJlVHlwZXMucG9seWdvbiA/XG4gICAgICAgICAgPFZpc0NvbmZpZ1N3aXRjaFxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmZpbGxlZH0vPiA6IG51bGx9XG4gICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuY29sb3J9XG4gICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfS8+XG4gICAgICAgIHtsYXllci5jb25maWcuY29sb3JGaWVsZCA/IDxDb2xvclJhbmdlQ29uZmlnIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30vPiA6IG51bGx9XG5cbiAgICAgICAge1xuICAgICAgICAgIC8qIFN0cm9rZSBXaWR0aCAqL1xuICAgICAgICB9XG4gICAgICAgIHtmZWF0dXJlVHlwZXMucG9seWdvbiA/IDxWaXNDb25maWdTd2l0Y2hcbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnN0cm9rZWR9Lz4gOiBudWxsfVxuXG4gICAgICAgIHtmZWF0dXJlVHlwZXMubGluZSB8fCAoZmVhdHVyZVR5cGVzLnBvbHlnb24gJiYgdmlzQ29uZmlnLnN0cm9rZWQpID9cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MudGhpY2tuZXNzfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfS8+XG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9Lz5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Muc3Ryb2tlV2lkdGhSYW5nZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXIuY29uZmlnLnNpemVGaWVsZH0vPlxuICAgICAgICA8L2Rpdj4gOiBudWxsfVxuXG4gICAgICAgIHtcbiAgICAgICAgICAvKiBFbGV2YXRpb24gKi9cbiAgICAgICAgfVxuICAgICAgICB7ZmVhdHVyZVR5cGVzLnBvbHlnb24gJiYgdmlzQ29uZmlnLmZpbGxlZCA/XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxWaXNDb25maWdTd2l0Y2hcbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZW5hYmxlM2R9Lz5cbiAgICAgICAgICAgIDxWaXNDb25maWdTd2l0Y2hcbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mud2lyZWZyYW1lfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IXZpc0NvbmZpZy5lbmFibGUzZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7dmlzQ29uZmlnLmVuYWJsZTNkID8gPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuaGVpZ2h0fVxuICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9Lz4gOiBudWxsfVxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZWxldmF0aW9uU2NhbGV9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9eyF2aXNDb25maWcuZW5hYmxlM2R9Lz5cbiAgICAgICAgICA8L2Rpdj4gOiBudWxsfVxuXG4gICAgICAgIHtcbiAgICAgICAgICAvKiBSYWRpdXMgKi9cbiAgICAgICAgfVxuICAgICAgICB7ZmVhdHVyZVR5cGVzLnBvaW50ID9cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MucmFkaXVzfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgbGFiZWw9XCJQb2ludCBSYWRpdXNcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e0Jvb2xlYW4obGF5ZXIuY29uZmlnLnJhZGl1c0ZpZWxkKX0vPlxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5yYWRpdXN9XG4gICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9Lz5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MucmFkaXVzUmFuZ2V9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyLmNvbmZpZy5yYWRpdXNGaWVsZH0vPlxuICAgICAgICAgPC9kaXY+IDogbnVsbH1cblxuICAgICAgICB7XG4gICAgICAgICAgLyogdmlzIFN3aXRjaGVzICovXG4gICAgICAgIH1cbiAgICAgICAgPEhpZ2hQcmVjaXNpb25Td2l0Y2ggey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfS8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtsYXllciwgZGF0YXNldHMsIHBhbmVsV2lkdGgsIGlzQWRkaW5nLCB1cGRhdGVMYXllckNvbmZpZ30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtmaWVsZHMgPSBbXSwgZmllbGRQYWlyc30gPSBsYXllci5jb25maWcuZGF0YUlkID8gZGF0YXNldHNbbGF5ZXIuY29uZmlnLmRhdGFJZF0gOiB7fTtcbiAgICBjb25zdCB7Y29uZmlnfSA9IGxheWVyO1xuXG4gICAgY29uc3QgY29tbW9uQ29uZmlnUHJvcCA9IHtcbiAgICAgIGxheWVyLFxuICAgICAgcGFuZWxXaWR0aCxcbiAgICAgIGZpZWxkc1xuICAgIH07XG5cbiAgICBjb25zdCB2aXNDb25maWd1cmF0b3JQcm9wcyA9IHtcbiAgICAgIC4uLmNvbW1vbkNvbmZpZ1Byb3AsXG4gICAgICBvbkNoYW5nZTogdGhpcy5wcm9wcy51cGRhdGVMYXllclZpc0NvbmZpZ1xuICAgIH07XG5cbiAgICBjb25zdCBsYXllckNvbmZpZ3VyYXRvclByb3BzID0ge1xuICAgICAgLi4uY29tbW9uQ29uZmlnUHJvcCxcbiAgICAgIG9uQ2hhbmdlOiB1cGRhdGVMYXllckNvbmZpZ1xuICAgIH07XG5cbiAgICBjb25zdCBsYXllckNoYW5uZWxDb25maWdQcm9wcyA9IHtcbiAgICAgIC4uLmNvbW1vbkNvbmZpZ1Byb3AsXG4gICAgICBvbkNoYW5nZTogdGhpcy5wcm9wcy51cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWdcbiAgICB9O1xuXG4gICAgY29uc3QgcmVuZGVyVGVtcGxhdGUgPSBsYXllci50eXBlICYmXG4gICAgICBgX3JlbmRlciR7Y2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGxheWVyLnR5cGUpfUxheWVyQ29uZmlnYDtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNvZnQtdGlueSBsYXllci1wYW5lbF9fY29uZmlnXCI+XG4gICAgICAgIHtPYmplY3Qua2V5cyhkYXRhc2V0cykubGVuZ3RoID4gMSAmJiA8U291cmNlRGF0YVNlbGVjdG9yXG4gICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgIGlkPXtsYXllci5pZH1cbiAgICAgICAgICBkaXNhYmxlZD17bGF5ZXIudHllcCAmJiBjb25maWcuY29sdW1uc31cbiAgICAgICAgICBkYXRhSWQ9e2NvbmZpZy5kYXRhSWR9XG4gICAgICAgICAgb25TZWxlY3Q9e3ZhbHVlID0+IHVwZGF0ZUxheWVyQ29uZmlnKHtkYXRhSWQ6IHZhbHVlfSl9Lz59XG4gICAgICAgIDxMYXllckNvbHVtbkNvbmZpZ1xuICAgICAgICAgIGxheWVyPXtsYXllcn1cbiAgICAgICAgICBmaWVsZHM9e2ZpZWxkc31cbiAgICAgICAgICBmaWVsZFBhaXJzPXtmaWVsZFBhaXJzfVxuICAgICAgICAgIHVwZGF0ZUxheWVyQ29uZmlnPXt1cGRhdGVMYXllckNvbmZpZ31cbiAgICAgICAgICB1cGRhdGVMYXllclR5cGU9e3RoaXMucHJvcHMudXBkYXRlTGF5ZXJUeXBlfVxuICAgICAgICAgIG9wZW5Nb2RhbD17dGhpcy5wcm9wcy5vcGVuTW9kYWx9Lz5cbiAgICAgICAgeyFpc0FkZGluZyAmJiB0aGlzW3JlbmRlclRlbXBsYXRlXSAmJiB0aGlzW3JlbmRlclRlbXBsYXRlXSh7XG4gICAgICAgICAgbGF5ZXIsXG4gICAgICAgICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgICAgICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHMsXG4gICAgICAgICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wc1xuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuTGF5ZXJDb25maWd1cmF0b3IucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG4vKlxuICogQ29tcG9uZW50aXplIGNvbmZpZyBjb21wb25lbnQgaW50byBwdXJlIGZ1bmN0aW9uYWwgY29tcG9uZW50c1xuICovXG5jb25zdCBWaXNDb25maWdTd2l0Y2ggPSAoe2xheWVyOiB7aWQsIGNvbmZpZ30sIHByb3BlcnR5LCBvbkNoYW5nZSwgbGFiZWwsIGRlc2NyaXB0aW9uLCBkaXNhYmxlZH0pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24gZGlzYWJsZWQ9e0Jvb2xlYW4oZGlzYWJsZWQpfT5cbiAgICA8UGFuZWxMYWJlbD57bGFiZWwgfHwgY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKHByb3BlcnR5KX08L1BhbmVsTGFiZWw+XG4gICAge2Rlc2NyaXB0aW9uID8gPGRpdiBjbGFzc05hbWU9XCJkaXNwbGF5LS1pbmxpbmUtYmxvY2tcIj5cbiAgICAgIDxJbmZvSGVscGVyIGRlc2NyaXB0aW9uPXtkZXNjcmlwdGlvbn0gaWQ9e2Ake2lkfS0ke3Byb3BlcnR5fWB9Lz5cbiAgICA8L2Rpdj4gOiBudWxsfVxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlzcGxheS0taW5saW5lLWJsb2NrIGZsb2F0LS1yaWdodFwiPlxuICAgICAgPFN3aXRjaFxuICAgICAgICBjbGFzc05hbWU9XCJtaWNybyB0ZXh0LXViZXItYmxhY2stNDBcIlxuICAgICAgICBzdHlsZT17e21hcmdpbkJvdHRvbTogMCwgbWFyZ2luUmlnaHQ6ICctMTBweCd9fVxuICAgICAgICBjaGVja2VkPXtjb25maWcudmlzQ29uZmlnW3Byb3BlcnR5XX1cbiAgICAgICAgaWQ9e2Ake2lkfS0ke3Byb3BlcnR5fWB9XG4gICAgICAgIGxhYmVsPXsnICd9XG4gICAgICAgIG9uQ2hhbmdlPXsoKSA9PiBvbkNoYW5nZSh7W3Byb3BlcnR5XTogIWNvbmZpZy52aXNDb25maWdbcHJvcGVydHldfSkgfVxuICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuKTtcblxuLyogZXNsaW50LWRpc2FibGUgbWF4LXBhcmFtcyAqL1xuZXhwb3J0IGNvbnN0IFZpc0NvbmZpZ1NsaWRlciA9ICh7bGF5ZXI6IHtjb25maWd9LCBwcm9wZXJ0eSwgbGFiZWwsIHJhbmdlLCBzdGVwLCBpc1JhbmdlZCwgZGlzYWJsZWQsIG9uQ2hhbmdlfSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbiBkaXNhYmxlZD17Qm9vbGVhbihkaXNhYmxlZCl9PlxuICAgIDxQYW5lbExhYmVsPnt0eXBlb2YgbGFiZWwgPT09ICdzdHJpbmcnID8gbGFiZWwgOlxuICAgICAgdHlwZW9mIGxhYmVsID09PSAnZnVuY3Rpb24nID8gbGFiZWwoY29uZmlnKSA6XG4gICAgICBjYXBpdGFsaXplRmlyc3RMZXR0ZXIocHJvcGVydHkpfTwvUGFuZWxMYWJlbD5cbiAgICA8UmFuZ2VTbGlkZXJcbiAgICAgIG1pblZhbHVlPXtyYW5nZVswXX1cbiAgICAgIG1heFZhbHVlPXtyYW5nZVsxXX1cbiAgICAgIHZhbHVlMD17aXNSYW5nZWQgPyBjb25maWcudmlzQ29uZmlnW3Byb3BlcnR5XVswXSA6IHJhbmdlWzBdfVxuICAgICAgdmFsdWUxPXtpc1JhbmdlZCA/IGNvbmZpZy52aXNDb25maWdbcHJvcGVydHldWzFdIDogY29uZmlnLnZpc0NvbmZpZ1twcm9wZXJ0eV19XG4gICAgICBzdGVwPXtzdGVwfVxuICAgICAgaXNSYW5nZWQ9e0Jvb2xlYW4oaXNSYW5nZWQpfVxuICAgICAgc2hvd0lucHV0PXt0cnVlfVxuICAgICAgb25DaGFuZ2U9e3ZhbHVlID0+IG9uQ2hhbmdlKFxuICAgICAgICB7W3Byb3BlcnR5XTogaXNSYW5nZWQgPyB2YWx1ZSA6IHZhbHVlWzFdfSl9Lz5cbiAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuKTtcbi8qIGVzbGludC1lbmFibGUgbWF4LXBhcmFtcyAqL1xuXG5jb25zdCBIaWdoUHJlY2lzaW9uU3dpdGNoID0gKHtsYXllciwgb25DaGFuZ2V9KSA9PiAoXG4gIDxWaXNDb25maWdTd2l0Y2hcbiAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1NbJ2hpLXByZWNpc2lvbiddfVxuICAgIGxheWVyPXtsYXllcn1cbiAgICBvbkNoYW5nZT17b25DaGFuZ2V9Lz5cbik7XG5cbmNvbnN0IExheWVyQ29sb3JTZWxlY3RvciA9ICh7bGF5ZXIsIHBhbmVsV2lkdGgsIG9uQ2hhbmdlLCBsYWJlbH0pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24gZGlzYWJsZWQ9e2xheWVyLmNvbmZpZy5jb2xvckZpZWxkfT5cbiAgICA8UGFuZWxMYWJlbD57bGFiZWwgfHwgJ0xheWVyIENvbG9yJ308L1BhbmVsTGFiZWw+XG4gICAgPENvbG9yU2luZ2xlU2VsZWN0b3JcbiAgICAgIHdpZHRoPXtwYW5lbFdpZHRofVxuICAgICAgc2V0Q29sb3I9e2hleCA9PiBvbkNoYW5nZSh7Y29sb3I6IGhleFRvUmdiKGhleCl9KX1cbiAgICAgIHNlbGVjdGVkQ29sb3I9e3JnYiguLi5sYXllci5jb25maWcuY29sb3IpLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKX0vPlxuICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4pO1xuXG5jb25zdCBWaXNDb2xvclNlbGVjdG9yID0gKHtsYXllciwgcGFuZWxXaWR0aCwgb25DaGFuZ2UsIGxhYmVsLCBwcm9wZXJ0eX0pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb25cbiAgICBkaXNhYmxlZD17bGF5ZXIuY29uZmlnLmNvbG9yRmllbGR9PlxuICAgIDxQYW5lbExhYmVsPntsYWJlbCB8fCAnVGFyZ2V0IENvbG9yJ308L1BhbmVsTGFiZWw+XG4gICAgPENvbG9yU2luZ2xlU2VsZWN0b3JcbiAgICAgIHdpZHRoPXtwYW5lbFdpZHRofVxuICAgICAgc2V0Q29sb3I9e2hleCA9PiBvbkNoYW5nZSh7W3Byb3BlcnR5XTogaGV4VG9SZ2IoaGV4KX0pfVxuICAgICAgc2VsZWN0ZWRDb2xvcj17XG4gICAgICAgIHJnYiguLi4obGF5ZXIuY29uZmlnLnZpc0NvbmZpZ1twcm9wZXJ0eV0gfHwgbGF5ZXIuY29uZmlnLmNvbG9yKSkudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpfS8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbmNvbnN0IENvbG9yUmFuZ2VDb25maWcgPSAoe2xheWVyLCBwYW5lbFdpZHRoLCBvbkNoYW5nZX0pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgPFBhbmVsTGFiZWw+Q29sb3IgUGFsZXR0ZTwvUGFuZWxMYWJlbD5cbiAgICA8Q29sb3JSYW5nZVNlbGVjdG9yXG4gICAgICB3aWR0aD17cGFuZWxXaWR0aH1cbiAgICAgIHNlbGVjdGVkQ29sb3JSYW5nZT17bGF5ZXIuY29uZmlnLnZpc0NvbmZpZy5jb2xvclJhbmdlfVxuICAgICAgb25TZWxlY3RDb2xvclJhbmdlPXtvbkNoYW5nZX0vPlxuICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4pO1xuXG5jb25zdCBDaGFubmVsQnlWYWx1ZVNlbGVjdG9yID0gKHtsYXllciwgY2hhbm5lbCwgcGFuZWxXaWR0aCwgb25DaGFuZ2UsIGZpZWxkcywgZGVzY3JpcHRpb259KSA9PiB7XG4gIGNvbnN0IHtcbiAgICBjaGFubmVsU2NhbGVUeXBlLFxuICAgIGRvbWFpbixcbiAgICBmaWVsZCxcbiAgICBrZXksXG4gICAgcHJvcGVydHksXG4gICAgcmFuZ2UsXG4gICAgc2NhbGVcbiAgfSA9IGNoYW5uZWw7XG4gIGNvbnN0IHN1cHBvcnRlZEZpZWxkVHlwZXMgPSBDSEFOTkVMX1NDQUxFX1NVUFBPUlRFRF9GSUVMRFNbY2hhbm5lbFNjYWxlVHlwZV07XG4gIGNvbnN0IHN1cHBvcnRlZEZpZWxkcyA9IGZpZWxkcy5maWx0ZXIoKHt0eXBlfSkgPT4gc3VwcG9ydGVkRmllbGRUeXBlcy5pbmNsdWRlcyh0eXBlKSk7XG4gIGNvbnN0IHNlbGVjdGVkRmllbGQgPSBsYXllci5jb25maWdbZmllbGRdO1xuICBjb25zdCBzY2FsZU9wdGlvbnMgPSBzZWxlY3RlZEZpZWxkICYmIEZJRUxEX09QVFNbc2VsZWN0ZWRGaWVsZC50eXBlXS5zY2FsZVtjaGFubmVsU2NhbGVUeXBlXSB8fCBbXTtcbiAgY29uc3Qgc2hvd1NjYWxlID0gIWxheWVyLmlzQWdncmVnYXRlZCAmJiBzY2FsZU9wdGlvbnMubGVuZ3RoID4gMTtcbiAgY29uc3QgZGVmYXVsdERlc2NyaXB0aW9uICA9IGBDYWxjdWxhdGUgJHtwcm9wZXJ0eX0gYmFzZWQgb24gc2VsZWN0ZWQgZmllbGRgO1xuXG4gIHJldHVybiAoXG4gICAgPFZpc0NvbmZpZ0J5RmllbGRTZWxlY3RvclxuICAgICAgY2hhbm5lbD17Y2hhbm5lbC5rZXl9XG4gICAgICBkZXNjcmlwdGlvbj17ZGVzY3JpcHRpb24gfHwgZGVmYXVsdERlc2NyaXB0aW9ufVxuICAgICAgZG9tYWluPXtsYXllci5jb25maWdbZG9tYWluXX1cbiAgICAgIGZpZWxkcz17c3VwcG9ydGVkRmllbGRzfVxuICAgICAgaWQ9e2xheWVyLmlkfVxuICAgICAgaW5uZXJQYW5lbFdpZHRoPXtwYW5lbFdpZHRofVxuICAgICAga2V5PXtgJHtrZXl9LWNoYW5uZWwtc2VsZWN0b3JgfVxuICAgICAgcHJvcGVydHk9e3Byb3BlcnR5fVxuICAgICAgcmFuZ2U9e2xheWVyLmNvbmZpZy52aXNDb25maWdbcmFuZ2VdfVxuICAgICAgc2NhbGVPcHRpb25zPXtzY2FsZU9wdGlvbnN9XG4gICAgICBzY2FsZVR5cGU9e2xheWVyLmNvbmZpZ1tzY2FsZV19XG4gICAgICBzZWxlY3RlZEZpZWxkPXtsYXllci5jb25maWdbZmllbGRdfVxuICAgICAgc2hvd1NjYWxlPXtzaG93U2NhbGV9XG4gICAgICB1cGRhdGVGaWVsZD17dmFsID0+IG9uQ2hhbmdlKHtbZmllbGRdOiB2YWx9LCBrZXkpfVxuICAgICAgdXBkYXRlU2NhbGU9e3ZhbCA9PiBvbkNoYW5nZSh7W3NjYWxlXTogdmFsfSwga2V5KX1cbiAgICAvPlxuICApO1xufTtcblxuY29uc3QgQWdnckNvbG9yU2NhbGVTZWxlY3RvciA9ICh7bGF5ZXI6IHtjb25maWd9LCBvbkNoYW5nZX0pID0+IChcbiAgPERpbWVuc2lvblNjYWxlU2VsZWN0b3JcbiAgICBsYWJlbD1cIkNvbG9yIFNjYWxlXCJcbiAgICBvcHRpb25zPXtjb25maWcuY29sb3JGaWVsZCA/IEZJRUxEX09QVFNbY29uZmlnLmNvbG9yRmllbGQudHlwZV0uc2NhbGUuY29sb3JBZ2dyIDpcbiAgICAgIEZJRUxEX09QVFMuaW50ZWdlci5zY2FsZS5jb2xvckFnZ3J9XG4gICAgc2NhbGVUeXBlPXtjb25maWcuY29sb3JTY2FsZX1cbiAgICBvblNlbGVjdD17dmFsID0+IG9uQ2hhbmdlKHtjb2xvclNjYWxlOiB2YWx9LCAnY29sb3InKX0vPlxuKTtcblxuY29uc3QgQWdncmVnYXRpb25UeXBlU2VsZWN0b3IgPSAoe2xheWVyOiB7Y29uZmlnOiB7dmlzQ29uZmlnfX0sIGZpZWxkLCBwcm9wZXJ0eSwgb3B0aW9ucywgb25DaGFuZ2V9KSA9PiAoXG4gIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgIDxQYW5lbExhYmVsPntgQWdncmVnYXRlICR7ZmllbGQgPyBmaWVsZC5uYW1lIDogJyd9IGJ5YH08L1BhbmVsTGFiZWw+XG4gICAgPEl0ZW1TZWxlY3RvclxuICAgICAgZGlzYWJsZWQ9eyFmaWVsZH1cbiAgICAgIHNlbGVjdGVkSXRlbXM9e3Zpc0NvbmZpZ1twcm9wZXJ0eV19XG4gICAgICBvcHRpb25zPXtvcHRpb25zfVxuICAgICAgbXVsdGlTZWxlY3Q9e2ZhbHNlfVxuICAgICAgc2VhcmNoYWJsZT17ZmFsc2V9XG4gICAgICBvbkNoYW5nZT17dmFsdWUgPT4gb25DaGFuZ2Uoe1twcm9wZXJ0eV06IHZhbHVlfSl9Lz5cbiAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuKTtcbi8qIGVzbGludC1lbmFibGUgbWF4LXBhcmFtcyAqL1xuIl19