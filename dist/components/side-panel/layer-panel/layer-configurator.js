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
        disabled: Boolean(layer.config.sizeField)
      })),
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
        label: '',
        disabled: !layer.config.visConfig.outline
      })) : null,
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
        field: layer.config.colorField
      }))
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
        label: (type === _defaultSettings.LAYER_TYPES.grid ? 'Grid Size' : 'Hexagon Radius') + ' (km)'
      })),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.coverage, visConfiguratorProps)),
      _react2.default.createElement(ColorRangeConfig, visConfiguratorProps),
      _react2.default.createElement(AggrColorScaleSelector, layerConfiguratorProps),
      _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
        channel: layer.visualChannels.color
      }, layerChannelConfigProps)),
      _react2.default.createElement(AggregationTypeSelector, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.aggregation, visConfiguratorProps, {
        descreiption: colorByDescription,
        field: colorField
      })),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.percentile, visConfiguratorProps)),
      _react2.default.createElement(VisConfigSwitch, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.enable3d, visConfiguratorProps)),
      enable3d ? _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({}, layerChannelConfigProps, {
        channel: layer.visualChannels.size,
        description: elevationByDescription
      })) : null,
      _react2.default.createElement(AggregationTypeSelector, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.aggregation, visConfiguratorProps, {
        property: 'sizeAggregation',
        field: sizeField
      })),
      _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.percentile, visConfiguratorProps, {
        property: 'elevationPercentile',
        disabled: !enable3d || !colorField && !sizeField
      })),
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
        disabled: !layer.config.sizeField
      })),
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
      _react2.default.createElement(LayerColorSelector, (0, _extends3.default)({}, layerConfiguratorProps, { label: 'Source Color' })),
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
        disabled: !layer.config.sizeField
      })),
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
          disabled: !layer.config.sizeField
        }))
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
          disabled: !visConfig.enable3d
        }))
      ) : null,
      featureTypes.point ? _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.radius, visConfiguratorProps, {
          label: 'Point Radius',
          disabled: Boolean(layer.config.radiusField)
        })),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.radius
        }, layerChannelConfigProps)),
        _react2.default.createElement(VisConfigSlider, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.radiusRange, visConfiguratorProps, {
          disabled: !layer.config.radiusField
        }))
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
        }
      }),
      _react2.default.createElement(_layerColumnConfig2.default, {
        layer: layer,
        fields: fields,
        fieldPairs: fieldPairs,
        updateLayerConfig: updateLayerConfig,
        updateLayerType: this.props.updateLayerType,
        openModal: this.props.openModal
      }),
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
      }
    })
  );
};
/* eslint-enable max-params */

var HighPrecisionSwitch = function HighPrecisionSwitch(_ref10) {
  var layer = _ref10.layer,
      onChange = _ref10.onChange;
  return _react2.default.createElement(VisConfigSwitch, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS['hi-precision'], {
    layer: layer,
    onChange: onChange
  }));
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
      selectedColor: _d3Color.rgb.apply(undefined, layer.config.color).toString().toUpperCase()
    })
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
    { disabled: layer.config.colorField },
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
      selectedColor: _d3Color.rgb.apply(undefined, layer.config.visConfig[property] || layer.config.color).toString().toUpperCase()
    })
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
      onSelectColorRange: onChange
    })
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
    }
  });
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
      }
    })
  );
};
/* eslint-enable max-params */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29uZmlndXJhdG9yLmpzIl0sIm5hbWVzIjpbInByb3BUeXBlcyIsImxheWVyIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImRhdGFzZXRzIiwib3Blbk1vZGFsIiwiZnVuYyIsInBhbmVsV2lkdGgiLCJudW1iZXIiLCJ1cGRhdGVMYXllckNvbmZpZyIsInVwZGF0ZUxheWVyVHlwZSIsInVwZGF0ZUxheWVyVmlzQ29uZmlnIiwidXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnIiwiTGF5ZXJDb25maWd1cmF0b3IiLCJfcmVuZGVyUG9pbnRMYXllckNvbmZpZyIsInByb3BzIiwiX3JlbmRlclNjYXR0ZXJwbG90TGF5ZXJDb25maWciLCJfcmVuZGVySWNvbkxheWVyQ29uZmlnIiwidmlzQ29uZmlndXJhdG9yUHJvcHMiLCJsYXllckNoYW5uZWxDb25maWdQcm9wcyIsImxheWVyQ29uZmlndXJhdG9yUHJvcHMiLCJ2aXN1YWxDaGFubmVscyIsImNvbG9yIiwiY29uZmlnIiwiY29sb3JGaWVsZCIsIm9wYWNpdHkiLCJyYWRpdXMiLCJCb29sZWFuIiwic2l6ZUZpZWxkIiwic2l6ZSIsImZpeGVkUmFkaXVzIiwicmFkaXVzUmFuZ2UiLCJ2aXNDb25maWciLCJ0eXBlIiwicG9pbnQiLCJvdXRsaW5lIiwidGhpY2tuZXNzIiwiX3JlbmRlckNsdXN0ZXJMYXllckNvbmZpZyIsImNsdXN0ZXJSYWRpdXMiLCJjbHVzdGVyUmFkaXVzUmFuZ2UiLCJhZ2dyZWdhdGlvbiIsIl9yZW5kZXJHcmlkTGF5ZXJDb25maWciLCJfcmVuZGVyQWdncmVnYXRpb25MYXllckNvbmZpZyIsIl9yZW5kZXJIZXhhZ29uTGF5ZXJDb25maWciLCJlbmFibGUzZCIsImVsZXZhdGlvbkJ5RGVzY3JpcHRpb24iLCJjb2xvckJ5RGVzY3JpcHRpb24iLCJ3b3JsZFVuaXRTaXplIiwiZ3JpZCIsImNvdmVyYWdlIiwicGVyY2VudGlsZSIsImVsZXZhdGlvblNjYWxlIiwiX3JlbmRlckhleGFnb25JZExheWVyQ29uZmlnIiwiZWxldmF0aW9uUmFuZ2UiLCJfcmVuZGVyQXJjTGF5ZXJDb25maWciLCJhcmdzIiwiX3JlbmRlckxpbmVMYXllckNvbmZpZyIsInRhcmdldENvbG9yIiwic3Ryb2tlV2lkdGhSYW5nZSIsIl9yZW5kZXJHZW9qc29uTGF5ZXJDb25maWciLCJtZXRhIiwiZmVhdHVyZVR5cGVzIiwicG9seWdvbiIsImZpbGxlZCIsInN0cm9rZWQiLCJsaW5lIiwid2lyZWZyYW1lIiwiaGVpZ2h0IiwicmFkaXVzRmllbGQiLCJyZW5kZXIiLCJpc0FkZGluZyIsImRhdGFJZCIsImZpZWxkcyIsImZpZWxkUGFpcnMiLCJjb21tb25Db25maWdQcm9wIiwib25DaGFuZ2UiLCJyZW5kZXJUZW1wbGF0ZSIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJpZCIsInR5ZXAiLCJjb2x1bW5zIiwidmFsdWUiLCJWaXNDb25maWdTd2l0Y2giLCJwcm9wZXJ0eSIsImxhYmVsIiwiZGVzY3JpcHRpb24iLCJkaXNhYmxlZCIsIm1hcmdpbkJvdHRvbSIsIm1hcmdpblJpZ2h0IiwiVmlzQ29uZmlnU2xpZGVyIiwicmFuZ2UiLCJzdGVwIiwiaXNSYW5nZWQiLCJIaWdoUHJlY2lzaW9uU3dpdGNoIiwiTGF5ZXJDb2xvclNlbGVjdG9yIiwiaGV4IiwidG9TdHJpbmciLCJ0b1VwcGVyQ2FzZSIsIlZpc0NvbG9yU2VsZWN0b3IiLCJDb2xvclJhbmdlQ29uZmlnIiwiY29sb3JSYW5nZSIsIkNoYW5uZWxCeVZhbHVlU2VsZWN0b3IiLCJjaGFubmVsIiwiY2hhbm5lbFNjYWxlVHlwZSIsImRvbWFpbiIsImZpZWxkIiwia2V5Iiwic2NhbGUiLCJzdXBwb3J0ZWRGaWVsZFR5cGVzIiwic3VwcG9ydGVkRmllbGRzIiwiZmlsdGVyIiwiaW5jbHVkZXMiLCJzZWxlY3RlZEZpZWxkIiwic2NhbGVPcHRpb25zIiwic2hvd1NjYWxlIiwiaXNBZ2dyZWdhdGVkIiwiZGVmYXVsdERlc2NyaXB0aW9uIiwidmFsIiwiQWdnckNvbG9yU2NhbGVTZWxlY3RvciIsImNvbG9yQWdnciIsImludGVnZXIiLCJjb2xvclNjYWxlIiwiQWdncmVnYXRpb25UeXBlU2VsZWN0b3IiLCJvcHRpb25zIiwibmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7QUFJQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBRUE7O0FBQ0E7O0FBRUE7Ozs7QUFNQSxJQUFNQSxZQUFZO0FBQ2hCQyxTQUFPLG9CQUFVQyxNQUFWLENBQWlCQyxVQURSO0FBRWhCQyxZQUFVLG9CQUFVRixNQUFWLENBQWlCQyxVQUZYO0FBR2hCRSxhQUFXLG9CQUFVQyxJQUFWLENBQWVILFVBSFY7QUFJaEJJLGNBQVksb0JBQVVDLE1BQVYsQ0FBaUJMLFVBSmI7QUFLaEJNLHFCQUFtQixvQkFBVUgsSUFBVixDQUFlSCxVQUxsQjtBQU1oQk8sbUJBQWlCLG9CQUFVSixJQUFWLENBQWVILFVBTmhCO0FBT2hCUSx3QkFBc0Isb0JBQVVMLElBQVYsQ0FBZUgsVUFQckI7QUFRaEJTLGtDQUFnQyxvQkFBVU4sSUFBVixDQUFlSDtBQVIvQixDQUFsQjs7SUFXcUJVLGlCOzs7Ozs7Ozs4QkFDbkJDLHVCLG9DQUF3QkMsSyxFQUFPO0FBQzdCLFdBQU8sS0FBS0MsNkJBQUwsQ0FBbUNELEtBQW5DLENBQVA7QUFDRCxHOzs4QkFFREUsc0IsbUNBQXVCRixLLEVBQU87QUFDNUIsV0FBTyxLQUFLQyw2QkFBTCxDQUFtQ0QsS0FBbkMsQ0FBUDtBQUNELEc7OzhCQUVEQyw2QixnREFLRztBQUFBLFFBSkRmLEtBSUMsUUFKREEsS0FJQztBQUFBLFFBSERpQixvQkFHQyxRQUhEQSxvQkFHQztBQUFBLFFBRkRDLHVCQUVDLFFBRkRBLHVCQUVDO0FBQUEsUUFEREMsc0JBQ0MsUUFEREEsc0JBQ0M7O0FBQ0QsV0FDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLGlCQUFmO0FBRUUsb0NBQUMsa0JBQUQsRUFBd0JBLHNCQUF4QixDQUZGO0FBR0Usb0NBQUMsc0JBQUQ7QUFDRSxpQkFBU25CLE1BQU1vQixjQUFOLENBQXFCQztBQURoQyxTQUVNSCx1QkFGTixFQUhGO0FBT0dsQixZQUFNc0IsTUFBTixDQUFhQyxVQUFiLEdBQ0MsOEJBQUMsZ0JBQUQsRUFBc0JOLG9CQUF0QixDQURELEdBRUcsSUFUTjtBQVVFLG9DQUFDLGVBQUQsNkJBQ00sZ0NBQWtCTyxPQUR4QixFQUVNUCxvQkFGTixFQVZGO0FBZUUsb0NBQUMsZUFBRCw2QkFDTSxnQ0FBa0JRLE1BRHhCLEVBRU1SLG9CQUZOO0FBR0Usa0JBQVVTLFFBQVExQixNQUFNc0IsTUFBTixDQUFhSyxTQUFyQjtBQUhaLFNBZkY7QUFvQkUsb0NBQUMsc0JBQUQ7QUFDRSxpQkFBUzNCLE1BQU1vQixjQUFOLENBQXFCUTtBQURoQyxTQUVNVix1QkFGTixFQXBCRjtBQXdCRSxvQ0FBQyxlQUFELDZCQUNNLGdDQUFrQlcsV0FEeEIsRUFFTVosb0JBRk47QUFHRSxrQkFBVSxDQUFDakIsTUFBTXNCLE1BQU4sQ0FBYUs7QUFIMUIsU0F4QkY7QUE2QkUsb0NBQUMsZUFBRCw2QkFDTSxnQ0FBa0JHLFdBRHhCLEVBRU1iLG9CQUZOO0FBR0Usa0JBQ0UsQ0FBQ2pCLE1BQU1zQixNQUFOLENBQWFLLFNBQWQsSUFBMkIzQixNQUFNc0IsTUFBTixDQUFhUyxTQUFiLENBQXVCRjtBQUp0RCxTQTdCRjtBQXFDRzdCLFlBQU1nQyxJQUFOLEtBQWUsNkJBQVlDLEtBQTNCLEdBQ0MsOEJBQUMsZUFBRCw2QkFDTSxnQ0FBa0JDLE9BRHhCLEVBRU1qQixvQkFGTixFQURELEdBS0csSUExQ047QUEyQ0dqQixZQUFNZ0MsSUFBTixLQUFlLDZCQUFZQyxLQUEzQixHQUNDLDhCQUFDLGVBQUQsNkJBQ00sZ0NBQWtCRSxTQUR4QixFQUVNbEIsb0JBRk47QUFHRSxlQUFPLEVBSFQ7QUFJRSxrQkFBVSxDQUFDakIsTUFBTXNCLE1BQU4sQ0FBYVMsU0FBYixDQUF1Qkc7QUFKcEMsU0FERCxHQU9HLElBbEROO0FBb0RFLG9DQUFDLG1CQUFELEVBQXlCakIsb0JBQXpCO0FBcERGLEtBREY7QUF3REQsRzs7OEJBRURtQix5Qiw2Q0FLRztBQUFBLFFBSkRwQyxLQUlDLFNBSkRBLEtBSUM7QUFBQSxRQUhEaUIsb0JBR0MsU0FIREEsb0JBR0M7QUFBQSxRQUZERSxzQkFFQyxTQUZEQSxzQkFFQztBQUFBLFFBRERELHVCQUNDLFNBRERBLHVCQUNDOztBQUNELFdBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSxpQkFBZjtBQUVFLG9DQUFDLGVBQUQsNkJBQ00sZ0NBQWtCbUIsYUFEeEIsRUFFTXBCLG9CQUZOLEVBRkY7QUFNRSxvQ0FBQyxlQUFELDZCQUNNLGdDQUFrQnFCLGtCQUR4QixFQUVNckIsb0JBRk4sRUFORjtBQVdFLG9DQUFDLGVBQUQsNkJBQ00sZ0NBQWtCTyxPQUR4QixFQUVNUCxvQkFGTixFQVhGO0FBZ0JFLG9DQUFDLGdCQUFELEVBQXNCQSxvQkFBdEIsQ0FoQkY7QUFpQkUsb0NBQUMsc0JBQUQsRUFBNEJFLHNCQUE1QixDQWpCRjtBQWtCRSxvQ0FBQyxzQkFBRDtBQUNFLGlCQUFTbkIsTUFBTW9CLGNBQU4sQ0FBcUJDO0FBRGhDLFNBRU1ILHVCQUZOLEVBbEJGO0FBc0JFLG9DQUFDLHVCQUFELDZCQUNNLGdDQUFrQnFCLFdBRHhCLEVBRU10QixvQkFGTjtBQUdFLGVBQU9qQixNQUFNc0IsTUFBTixDQUFhQztBQUh0QjtBQXRCRixLQURGO0FBOEJELEc7OzhCQUVEaUIsc0IsbUNBQXVCMUIsSyxFQUFPO0FBQzVCLFdBQU8sS0FBSzJCLDZCQUFMLENBQW1DM0IsS0FBbkMsQ0FBUDtBQUNELEc7OzhCQUVENEIseUIsc0NBQTBCNUIsSyxFQUFPO0FBQy9CLFdBQU8sS0FBSzJCLDZCQUFMLENBQW1DM0IsS0FBbkMsQ0FBUDtBQUNELEc7OzhCQUVEMkIsNkIsaURBS0c7QUFBQSxRQUpEekMsS0FJQyxTQUpEQSxLQUlDO0FBQUEsUUFIRGlCLG9CQUdDLFNBSERBLG9CQUdDO0FBQUEsUUFGREUsc0JBRUMsU0FGREEsc0JBRUM7QUFBQSxRQURERCx1QkFDQyxTQUREQSx1QkFDQztBQUFBLFFBQ01jLElBRE4sR0FDc0JoQyxLQUR0QixDQUNNZ0MsSUFETjtBQUFBLFFBQ1lWLE1BRFosR0FDc0J0QixLQUR0QixDQUNZc0IsTUFEWjtBQUFBLFFBRWtCcUIsUUFGbEIsR0FFc0RyQixNQUZ0RCxDQUVNUyxTQUZOLENBRWtCWSxRQUZsQjtBQUFBLFFBRTZCcEIsVUFGN0IsR0FFc0RELE1BRnRELENBRTZCQyxVQUY3QjtBQUFBLFFBRXlDSSxTQUZ6QyxHQUVzREwsTUFGdEQsQ0FFeUNLLFNBRnpDOztBQUdELFFBQU1pQix5QkFDSiw4Q0FERjtBQUVBLFFBQU1DLHFCQUFxQiw2Q0FBM0I7O0FBRUEsV0FDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLGlCQUFmO0FBQ0Usb0NBQUMsZUFBRCw2QkFDTSxnQ0FBa0JyQixPQUR4QixFQUVNUCxvQkFGTixFQURGO0FBTUUsb0NBQUMsZUFBRCw2QkFDTSxnQ0FBa0I2QixhQUR4QixFQUVNN0Isb0JBRk47QUFHRSxnQkFDRWUsU0FBUyw2QkFBWWUsSUFBckIsR0FBNEIsV0FBNUIsR0FBMEMsZ0JBRDVDO0FBSEYsU0FORjtBQWFFLG9DQUFDLGVBQUQsNkJBQ00sZ0NBQWtCQyxRQUR4QixFQUVNL0Isb0JBRk4sRUFiRjtBQWtCRSxvQ0FBQyxnQkFBRCxFQUFzQkEsb0JBQXRCLENBbEJGO0FBbUJFLG9DQUFDLHNCQUFELEVBQTRCRSxzQkFBNUIsQ0FuQkY7QUFvQkUsb0NBQUMsc0JBQUQ7QUFDRSxpQkFBU25CLE1BQU1vQixjQUFOLENBQXFCQztBQURoQyxTQUVNSCx1QkFGTixFQXBCRjtBQXdCRSxvQ0FBQyx1QkFBRCw2QkFDTSxnQ0FBa0JxQixXQUR4QixFQUVNdEIsb0JBRk47QUFHRSxzQkFBYzRCLGtCQUhoQjtBQUlFLGVBQU90QjtBQUpULFNBeEJGO0FBOEJFLG9DQUFDLGVBQUQsNkJBQ00sZ0NBQWtCMEIsVUFEeEIsRUFFTWhDLG9CQUZOLEVBOUJGO0FBbUNFLG9DQUFDLGVBQUQsNkJBQ00sZ0NBQWtCMEIsUUFEeEIsRUFFTTFCLG9CQUZOLEVBbkNGO0FBdUNHMEIsaUJBQ0MsOEJBQUMsc0JBQUQsNkJBQ016Qix1QkFETjtBQUVFLGlCQUFTbEIsTUFBTW9CLGNBQU4sQ0FBcUJRLElBRmhDO0FBR0UscUJBQWFnQjtBQUhmLFNBREQsR0FNRyxJQTdDTjtBQThDRSxvQ0FBQyx1QkFBRCw2QkFDTSxnQ0FBa0JMLFdBRHhCLEVBRU10QixvQkFGTjtBQUdFLGtCQUFVLGlCQUhaO0FBSUUsZUFBT1U7QUFKVCxTQTlDRjtBQW9ERSxvQ0FBQyxlQUFELDZCQUNNLGdDQUFrQnNCLFVBRHhCLEVBRU1oQyxvQkFGTjtBQUdFLGtCQUFVLHFCQUhaO0FBSUUsa0JBQVUsQ0FBQzBCLFFBQUQsSUFBYyxDQUFDcEIsVUFBRCxJQUFlLENBQUNJO0FBSjFDLFNBcERGO0FBMERFLG9DQUFDLGVBQUQsNkJBQ00sZ0NBQWtCdUIsY0FEeEIsRUFFTWpDLG9CQUZOLEVBMURGO0FBOERFLG9DQUFDLG1CQUFELEVBQXlCQSxvQkFBekI7QUE5REYsS0FERjtBQWtFRCxHOzs4QkFFRGtDLDJCLCtDQUtHO0FBQUEsUUFKRG5ELEtBSUMsU0FKREEsS0FJQztBQUFBLFFBSERpQixvQkFHQyxTQUhEQSxvQkFHQztBQUFBLFFBRkRFLHNCQUVDLFNBRkRBLHNCQUVDO0FBQUEsUUFEREQsdUJBQ0MsU0FEREEsdUJBQ0M7O0FBQ0QsV0FDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLGlCQUFmO0FBRUUsb0NBQUMsa0JBQUQsRUFBd0JDLHNCQUF4QixDQUZGO0FBR0Usb0NBQUMsc0JBQUQ7QUFDRSxpQkFBU25CLE1BQU1vQixjQUFOLENBQXFCQztBQURoQyxTQUVNSCx1QkFGTixFQUhGO0FBT0dsQixZQUFNc0IsTUFBTixDQUFhQyxVQUFiLEdBQ0MsOEJBQUMsZ0JBQUQsRUFBc0JOLG9CQUF0QixDQURELEdBRUcsSUFUTjtBQVVFLG9DQUFDLGVBQUQsNkJBQ00sZ0NBQWtCTyxPQUR4QixFQUVNUCxvQkFGTixFQVZGO0FBZUUsb0NBQUMsc0JBQUQ7QUFDRSxpQkFBU2pCLE1BQU1vQixjQUFOLENBQXFCUTtBQURoQyxTQUVNVix1QkFGTixFQWZGO0FBbUJFLG9DQUFDLGVBQUQsNkJBQ00sZ0NBQWtCZ0MsY0FEeEIsRUFFTWpDLG9CQUZOLEVBbkJGO0FBdUJFLG9DQUFDLGVBQUQsNkJBQ00sZ0NBQWtCbUMsY0FEeEIsRUFFTW5DLG9CQUZOO0FBR0UsZUFBTyxjQUhUO0FBSUUsa0JBQVUsQ0FBQ2pCLE1BQU1zQixNQUFOLENBQWFLO0FBSjFCLFNBdkJGO0FBNkJFLG9DQUFDLG1CQUFELEVBQXlCVixvQkFBekI7QUE3QkYsS0FERjtBQWlDRCxHOzs4QkFFRG9DLHFCLGtDQUFzQkMsSSxFQUFNO0FBQzFCLFdBQU8sS0FBS0Msc0JBQUwsQ0FBNEJELElBQTVCLENBQVA7QUFDRCxHOzs4QkFFREMsc0IsMENBS0c7QUFBQSxRQUpEdkQsS0FJQyxTQUpEQSxLQUlDO0FBQUEsUUFIRGlCLG9CQUdDLFNBSERBLG9CQUdDO0FBQUEsUUFGREUsc0JBRUMsU0FGREEsc0JBRUM7QUFBQSxRQURERCx1QkFDQyxTQUREQSx1QkFDQzs7QUFDRCxXQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsaUJBQWY7QUFFRSxvQ0FBQyxrQkFBRCw2QkFBd0JDLHNCQUF4QixJQUFnRCxPQUFNLGNBQXRELElBRkY7QUFHRSxvQ0FBQyxnQkFBRCw2QkFDTUYsb0JBRE4sRUFFTSxnQ0FBa0J1QyxXQUZ4QixFQUhGO0FBT0Usb0NBQUMsc0JBQUQ7QUFDRSxpQkFBU3hELE1BQU1vQixjQUFOLENBQXFCQztBQURoQyxTQUVNSCx1QkFGTixFQVBGO0FBV0dsQixZQUFNc0IsTUFBTixDQUFhQyxVQUFiLEdBQ0MsOEJBQUMsZ0JBQUQsRUFBc0JOLG9CQUF0QixDQURELEdBRUcsSUFiTjtBQWNFLG9DQUFDLGVBQUQsNkJBQ00sZ0NBQWtCTyxPQUR4QixFQUVNUCxvQkFGTixFQWRGO0FBb0JFLG9DQUFDLGVBQUQsNkJBQ00sZ0NBQWtCa0IsU0FEeEIsRUFFTWxCLG9CQUZOLEVBcEJGO0FBd0JFLG9DQUFDLHNCQUFEO0FBQ0UsaUJBQVNqQixNQUFNb0IsY0FBTixDQUFxQlE7QUFEaEMsU0FFTVYsdUJBRk4sRUF4QkY7QUE0QkUsb0NBQUMsZUFBRCw2QkFDTSxnQ0FBa0J1QyxnQkFEeEIsRUFFTXhDLG9CQUZOO0FBR0Usa0JBQVUsQ0FBQ2pCLE1BQU1zQixNQUFOLENBQWFLO0FBSDFCLFNBNUJGO0FBa0NFLG9DQUFDLG1CQUFELEVBQXlCVixvQkFBekI7QUFsQ0YsS0FERjtBQXNDRCxHOzs4QkFFRHlDLHlCLDZDQUtHO0FBQUEsUUFKRDFELEtBSUMsU0FKREEsS0FJQztBQUFBLFFBSERpQixvQkFHQyxTQUhEQSxvQkFHQztBQUFBLFFBRkRFLHNCQUVDLFNBRkRBLHNCQUVDO0FBQUEsUUFEREQsdUJBQ0MsU0FEREEsdUJBQ0M7QUFBQSxnQ0FDd0RsQixLQUR4RCxDQUNNMkQsSUFETixDQUNhQyxZQURiO0FBQUEsUUFDYUEsWUFEYix5Q0FDNEIsRUFENUI7QUFBQSxRQUMwQzdCLFNBRDFDLEdBQ3dEL0IsS0FEeEQsQ0FDaUNzQixNQURqQyxDQUMwQ1MsU0FEMUM7OztBQUdELFdBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSxpQkFBZjtBQUNFLG9DQUFDLGtCQUFELEVBQXdCWixzQkFBeEIsQ0FERjtBQUVFLG9DQUFDLGVBQUQsNkJBQ00sZ0NBQWtCSyxPQUR4QixFQUVNUCxvQkFGTixFQUZGO0FBU0cyQyxtQkFBYUMsT0FBYixHQUNDLDhCQUFDLGVBQUQsNkJBQ001QyxvQkFETixFQUVNLGdDQUFrQjZDLE1BRnhCLEVBREQsR0FLRyxJQWROO0FBZUUsb0NBQUMsc0JBQUQ7QUFDRSxpQkFBUzlELE1BQU1vQixjQUFOLENBQXFCQztBQURoQyxTQUVNSCx1QkFGTixFQWZGO0FBbUJHbEIsWUFBTXNCLE1BQU4sQ0FBYUMsVUFBYixHQUNDLDhCQUFDLGdCQUFELEVBQXNCTixvQkFBdEIsQ0FERCxHQUVHLElBckJOO0FBd0JHMkMsbUJBQWFDLE9BQWIsR0FDQyw4QkFBQyxlQUFELDZCQUNNNUMsb0JBRE4sRUFFTSxnQ0FBa0I4QyxPQUZ4QixFQURELEdBS0csSUE3Qk47QUErQkdILG1CQUFhSSxJQUFiLElBQXNCSixhQUFhQyxPQUFiLElBQXdCOUIsVUFBVWdDLE9BQXhELEdBQ0M7QUFBQTtBQUFBO0FBQ0Usc0NBQUMsZUFBRCw2QkFDTSxnQ0FBa0I1QixTQUR4QixFQUVNbEIsb0JBRk4sRUFERjtBQUtFLHNDQUFDLHNCQUFEO0FBQ0UsbUJBQVNqQixNQUFNb0IsY0FBTixDQUFxQlE7QUFEaEMsV0FFTVYsdUJBRk4sRUFMRjtBQVNFLHNDQUFDLGVBQUQsNkJBQ00sZ0NBQWtCdUMsZ0JBRHhCLEVBRU14QyxvQkFGTjtBQUdFLG9CQUFVLENBQUNqQixNQUFNc0IsTUFBTixDQUFhSztBQUgxQjtBQVRGLE9BREQsR0FnQkcsSUEvQ047QUFrREdpQyxtQkFBYUMsT0FBYixJQUF3QjlCLFVBQVUrQixNQUFsQyxHQUNDO0FBQUE7QUFBQTtBQUNFLHNDQUFDLGVBQUQsNkJBQ003QyxvQkFETixFQUVNLGdDQUFrQjBCLFFBRnhCLEVBREY7QUFLRSxzQ0FBQyxlQUFELDZCQUNNMUIsb0JBRE4sRUFFTSxnQ0FBa0JnRCxTQUZ4QjtBQUdFLG9CQUFVLENBQUNsQyxVQUFVWTtBQUh2QixXQUxGO0FBVUdaLGtCQUFVWSxRQUFWLEdBQ0MsOEJBQUMsc0JBQUQ7QUFDRSxtQkFBUzNDLE1BQU1vQixjQUFOLENBQXFCOEM7QUFEaEMsV0FFTWhELHVCQUZOLEVBREQsR0FLRyxJQWZOO0FBZ0JFLHNDQUFDLGVBQUQsNkJBQ00sZ0NBQWtCZ0MsY0FEeEIsRUFFTWpDLG9CQUZOO0FBR0Usb0JBQVUsQ0FBQ2MsVUFBVVk7QUFIdkI7QUFoQkYsT0FERCxHQXVCRyxJQXpFTjtBQTRFR2lCLG1CQUFhM0IsS0FBYixHQUNDO0FBQUE7QUFBQTtBQUNFLHNDQUFDLGVBQUQsNkJBQ00sZ0NBQWtCUixNQUR4QixFQUVNUixvQkFGTjtBQUdFLGlCQUFNLGNBSFI7QUFJRSxvQkFBVVMsUUFBUTFCLE1BQU1zQixNQUFOLENBQWE2QyxXQUFyQjtBQUpaLFdBREY7QUFPRSxzQ0FBQyxzQkFBRDtBQUNFLG1CQUFTbkUsTUFBTW9CLGNBQU4sQ0FBcUJLO0FBRGhDLFdBRU1QLHVCQUZOLEVBUEY7QUFXRSxzQ0FBQyxlQUFELDZCQUNNLGdDQUFrQlksV0FEeEIsRUFFTWIsb0JBRk47QUFHRSxvQkFBVSxDQUFDakIsTUFBTXNCLE1BQU4sQ0FBYTZDO0FBSDFCO0FBWEYsT0FERCxHQWtCRyxJQTlGTjtBQWlHRSxvQ0FBQyxtQkFBRCxFQUF5QmxELG9CQUF6QjtBQWpHRixLQURGO0FBcUdELEc7OzhCQUVEbUQsTSxxQkFBUztBQUFBLGlCQU9ILEtBQUt0RCxLQVBGO0FBQUEsUUFFTGQsS0FGSyxVQUVMQSxLQUZLO0FBQUEsUUFHTEcsUUFISyxVQUdMQSxRQUhLO0FBQUEsUUFJTEcsVUFKSyxVQUlMQSxVQUpLO0FBQUEsUUFLTCtELFFBTEssVUFLTEEsUUFMSztBQUFBLFFBTUw3RCxpQkFOSyxVQU1MQSxpQkFOSzs7QUFBQSxnQkFRMkJSLE1BQU1zQixNQUFOLENBQWFnRCxNQUFiLEdBQzlCbkUsU0FBU0gsTUFBTXNCLE1BQU4sQ0FBYWdELE1BQXRCLENBRDhCLEdBRTlCLEVBVkc7QUFBQSw2QkFRQUMsTUFSQTtBQUFBLFFBUUFBLE1BUkEsZ0NBUVMsRUFSVDtBQUFBLFFBUWFDLFVBUmIsU0FRYUEsVUFSYjs7QUFBQSxRQVdBbEQsTUFYQSxHQVdVdEIsS0FYVixDQVdBc0IsTUFYQTs7O0FBYVAsUUFBTW1ELG1CQUFtQjtBQUN2QnpFLGtCQUR1QjtBQUV2Qk0sNEJBRnVCO0FBR3ZCaUU7QUFIdUIsS0FBekI7O0FBTUEsUUFBTXRELGtEQUNEd0QsZ0JBREM7QUFFSkMsZ0JBQVUsS0FBSzVELEtBQUwsQ0FBV0o7QUFGakIsTUFBTjs7QUFLQSxRQUFNUyxvREFDRHNELGdCQURDO0FBRUpDLGdCQUFVbEU7QUFGTixNQUFOOztBQUtBLFFBQU1VLHFEQUNEdUQsZ0JBREM7QUFFSkMsZ0JBQVUsS0FBSzVELEtBQUwsQ0FBV0g7QUFGakIsTUFBTjs7QUFLQSxRQUFNZ0UsaUJBQ0ozRSxNQUFNZ0MsSUFBTixnQkFBd0Isa0NBQXNCaEMsTUFBTWdDLElBQTVCLENBQXhCLGdCQURGOztBQUdBLFdBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSwrQkFBZjtBQUNHNEMsYUFBT0MsSUFBUCxDQUFZMUUsUUFBWixFQUFzQjJFLE1BQXRCLEdBQStCLENBQS9CLElBQ0M7QUFDRSxrQkFBVTNFLFFBRFo7QUFFRSxZQUFJSCxNQUFNK0UsRUFGWjtBQUdFLGtCQUFVL0UsTUFBTWdGLElBQU4sSUFBYzFELE9BQU8yRCxPQUhqQztBQUlFLGdCQUFRM0QsT0FBT2dELE1BSmpCO0FBS0Usa0JBQVU7QUFBQSxpQkFBUzlELGtCQUFrQixFQUFDOEQsUUFBUVksS0FBVCxFQUFsQixDQUFUO0FBQUE7QUFMWixRQUZKO0FBVUU7QUFDRSxlQUFPbEYsS0FEVDtBQUVFLGdCQUFRdUUsTUFGVjtBQUdFLG9CQUFZQyxVQUhkO0FBSUUsMkJBQW1CaEUsaUJBSnJCO0FBS0UseUJBQWlCLEtBQUtNLEtBQUwsQ0FBV0wsZUFMOUI7QUFNRSxtQkFBVyxLQUFLSyxLQUFMLENBQVdWO0FBTnhCLFFBVkY7QUFrQkcsT0FBQ2lFLFFBQUQsSUFDQyxLQUFLTSxjQUFMLENBREQsSUFFQyxLQUFLQSxjQUFMLEVBQXFCO0FBQ25CM0Usb0JBRG1CO0FBRW5CaUIsa0RBRm1CO0FBR25CQyx3REFIbUI7QUFJbkJDO0FBSm1CLE9BQXJCO0FBcEJKLEtBREY7QUE2QkQsRzs7Ozs7a0JBbmRrQlAsaUI7OztBQXNkckJBLGtCQUFrQmIsU0FBbEIsR0FBOEJBLFNBQTlCOztBQUVBOzs7QUFHQSxJQUFNb0Ysa0JBQWtCLFNBQWxCQSxlQUFrQjtBQUFBLDBCQUN0Qm5GLEtBRHNCO0FBQUEsTUFDZCtFLEVBRGMsZUFDZEEsRUFEYztBQUFBLE1BQ1Z6RCxNQURVLGVBQ1ZBLE1BRFU7QUFBQSxNQUV0QjhELFFBRnNCLFNBRXRCQSxRQUZzQjtBQUFBLE1BR3RCVixVQUhzQixTQUd0QkEsUUFIc0I7QUFBQSxNQUl0QlcsS0FKc0IsU0FJdEJBLEtBSnNCO0FBQUEsTUFLdEJDLFdBTHNCLFNBS3RCQSxXQUxzQjtBQUFBLE1BTXRCQyxRQU5zQixTQU10QkEsUUFOc0I7QUFBQSxTQVF0QjtBQUFBO0FBQUEsTUFBa0IsVUFBVTdELFFBQVE2RCxRQUFSLENBQTVCO0FBQ0U7QUFBQTtBQUFBO0FBQWFGLGVBQVMsa0NBQXNCRCxRQUF0QjtBQUF0QixLQURGO0FBRUdFLGtCQUNDO0FBQUE7QUFBQSxRQUFLLFdBQVUsdUJBQWY7QUFDRSw0REFBWSxhQUFhQSxXQUF6QixFQUFzQyxJQUFPUCxFQUFQLFNBQWFLLFFBQW5EO0FBREYsS0FERCxHQUlHLElBTk47QUFPRTtBQUFBO0FBQUEsUUFBSyxXQUFVLG9DQUFmO0FBQ0U7QUFDRSxtQkFBVSwwQkFEWjtBQUVFLGVBQU8sRUFBQ0ksY0FBYyxDQUFmLEVBQWtCQyxhQUFhLE9BQS9CLEVBRlQ7QUFHRSxpQkFBU25FLE9BQU9TLFNBQVAsQ0FBaUJxRCxRQUFqQixDQUhYO0FBSUUsWUFBT0wsRUFBUCxTQUFhSyxRQUpmO0FBS0UsZUFBTyxHQUxUO0FBTUUsa0JBQVU7QUFBQTs7QUFBQSxpQkFBTVYsc0NBQVdVLFFBQVgsSUFBc0IsQ0FBQzlELE9BQU9TLFNBQVAsQ0FBaUJxRCxRQUFqQixDQUF2QixhQUFOO0FBQUEsU0FOWjtBQU9FLGNBQUs7QUFQUDtBQURGO0FBUEYsR0FSc0I7QUFBQSxDQUF4Qjs7QUE2QkE7QUFDTyxJQUFNTSw0Q0FBa0IsU0FBbEJBLGVBQWtCO0FBQUEsTUFDckJwRSxNQURxQixTQUM3QnRCLEtBRDZCLENBQ3JCc0IsTUFEcUI7QUFBQSxNQUU3QjhELFFBRjZCLFNBRTdCQSxRQUY2QjtBQUFBLE1BRzdCQyxLQUg2QixTQUc3QkEsS0FINkI7QUFBQSxNQUk3Qk0sS0FKNkIsU0FJN0JBLEtBSjZCO0FBQUEsTUFLN0JDLElBTDZCLFNBSzdCQSxJQUw2QjtBQUFBLE1BTTdCQyxRQU42QixTQU03QkEsUUFONkI7QUFBQSxNQU83Qk4sUUFQNkIsU0FPN0JBLFFBUDZCO0FBQUEsTUFRN0JiLFVBUjZCLFNBUTdCQSxRQVI2QjtBQUFBLFNBVTdCO0FBQUE7QUFBQSxNQUFrQixVQUFVaEQsUUFBUTZELFFBQVIsQ0FBNUI7QUFDRTtBQUFBO0FBQUE7QUFDRyxhQUFPRixLQUFQLEtBQWlCLFFBQWpCLEdBQ0dBLEtBREgsR0FFRyxPQUFPQSxLQUFQLEtBQWlCLFVBQWpCLEdBQ0VBLE1BQU0vRCxNQUFOLENBREYsR0FFRSxrQ0FBc0I4RCxRQUF0QjtBQUxSLEtBREY7QUFRRTtBQUNFLGdCQUFVTyxNQUFNLENBQU4sQ0FEWjtBQUVFLGdCQUFVQSxNQUFNLENBQU4sQ0FGWjtBQUdFLGNBQVFFLFdBQVd2RSxPQUFPUyxTQUFQLENBQWlCcUQsUUFBakIsRUFBMkIsQ0FBM0IsQ0FBWCxHQUEyQ08sTUFBTSxDQUFOLENBSHJEO0FBSUUsY0FDRUUsV0FBV3ZFLE9BQU9TLFNBQVAsQ0FBaUJxRCxRQUFqQixFQUEyQixDQUEzQixDQUFYLEdBQTJDOUQsT0FBT1MsU0FBUCxDQUFpQnFELFFBQWpCLENBTC9DO0FBT0UsWUFBTVEsSUFQUjtBQVFFLGdCQUFVbEUsUUFBUW1FLFFBQVIsQ0FSWjtBQVNFLGlCQUFXLElBVGI7QUFVRSxnQkFBVTtBQUFBOztBQUFBLGVBQVNuQix3Q0FBV1UsUUFBWCxJQUFzQlMsV0FBV1gsS0FBWCxHQUFtQkEsTUFBTSxDQUFOLENBQXpDLGNBQVQ7QUFBQTtBQVZaO0FBUkYsR0FWNkI7QUFBQSxDQUF4QjtBQWdDUDs7QUFFQSxJQUFNWSxzQkFBc0IsU0FBdEJBLG1CQUFzQjtBQUFBLE1BQUU5RixLQUFGLFVBQUVBLEtBQUY7QUFBQSxNQUFTMEUsUUFBVCxVQUFTQSxRQUFUO0FBQUEsU0FDMUIsOEJBQUMsZUFBRCw2QkFDTSxnQ0FBa0IsY0FBbEIsQ0FETjtBQUVFLFdBQU8xRSxLQUZUO0FBR0UsY0FBVTBFO0FBSFosS0FEMEI7QUFBQSxDQUE1Qjs7QUFRQSxJQUFNcUIscUJBQXFCLFNBQXJCQSxrQkFBcUI7QUFBQSxNQUFFL0YsS0FBRixVQUFFQSxLQUFGO0FBQUEsTUFBU00sVUFBVCxVQUFTQSxVQUFUO0FBQUEsTUFBcUJvRSxRQUFyQixVQUFxQkEsUUFBckI7QUFBQSxNQUErQlcsS0FBL0IsVUFBK0JBLEtBQS9CO0FBQUEsU0FDekI7QUFBQTtBQUFBLE1BQWtCLFVBQVVyRixNQUFNc0IsTUFBTixDQUFhQyxVQUF6QztBQUNFO0FBQUE7QUFBQTtBQUFhOEQsZUFBUztBQUF0QixLQURGO0FBRUU7QUFDRSxhQUFPL0UsVUFEVDtBQUVFLGdCQUFVO0FBQUEsZUFBT29FLFNBQVMsRUFBQ3JELE9BQU8sMEJBQVMyRSxHQUFULENBQVIsRUFBVCxDQUFQO0FBQUEsT0FGWjtBQUdFLHFCQUFlLDhCQUFPaEcsTUFBTXNCLE1BQU4sQ0FBYUQsS0FBcEIsRUFDWjRFLFFBRFksR0FFWkMsV0FGWTtBQUhqQjtBQUZGLEdBRHlCO0FBQUEsQ0FBM0I7O0FBYUEsSUFBTUMsbUJBQW1CLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFbkcsS0FBRixVQUFFQSxLQUFGO0FBQUEsTUFBU00sVUFBVCxVQUFTQSxVQUFUO0FBQUEsTUFBcUJvRSxRQUFyQixVQUFxQkEsUUFBckI7QUFBQSxNQUErQlcsS0FBL0IsVUFBK0JBLEtBQS9CO0FBQUEsTUFBc0NELFFBQXRDLFVBQXNDQSxRQUF0QztBQUFBLFNBQ3ZCO0FBQUE7QUFBQSxNQUFrQixVQUFVcEYsTUFBTXNCLE1BQU4sQ0FBYUMsVUFBekM7QUFDRTtBQUFBO0FBQUE7QUFBYThELGVBQVM7QUFBdEIsS0FERjtBQUVFO0FBQ0UsYUFBTy9FLFVBRFQ7QUFFRSxnQkFBVTtBQUFBOztBQUFBLGVBQU9vRSxzQ0FBV1UsUUFBWCxJQUFzQiwwQkFBU1ksR0FBVCxDQUF0QixjQUFQO0FBQUEsT0FGWjtBQUdFLHFCQUFlLDhCQUNUaEcsTUFBTXNCLE1BQU4sQ0FBYVMsU0FBYixDQUF1QnFELFFBQXZCLEtBQW9DcEYsTUFBTXNCLE1BQU4sQ0FBYUQsS0FEeEMsRUFHWjRFLFFBSFksR0FJWkMsV0FKWTtBQUhqQjtBQUZGLEdBRHVCO0FBQUEsQ0FBekI7O0FBZUEsSUFBTUUsbUJBQW1CLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFcEcsS0FBRixVQUFFQSxLQUFGO0FBQUEsTUFBU00sVUFBVCxVQUFTQSxVQUFUO0FBQUEsTUFBcUJvRSxRQUFyQixVQUFxQkEsUUFBckI7QUFBQSxTQUN2QjtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBREY7QUFFRTtBQUNFLGFBQU9wRSxVQURUO0FBRUUsMEJBQW9CTixNQUFNc0IsTUFBTixDQUFhUyxTQUFiLENBQXVCc0UsVUFGN0M7QUFHRSwwQkFBb0IzQjtBQUh0QjtBQUZGLEdBRHVCO0FBQUEsQ0FBekI7O0FBV0EsSUFBTTRCLHlCQUF5QixTQUF6QkEsc0JBQXlCLFNBT3pCO0FBQUEsTUFOSnRHLEtBTUksVUFOSkEsS0FNSTtBQUFBLE1BTEp1RyxPQUtJLFVBTEpBLE9BS0k7QUFBQSxNQUpKakcsVUFJSSxVQUpKQSxVQUlJO0FBQUEsTUFISm9FLFFBR0ksVUFISkEsUUFHSTtBQUFBLE1BRkpILE1BRUksVUFGSkEsTUFFSTtBQUFBLE1BREplLFdBQ0ksVUFESkEsV0FDSTtBQUFBLE1BRUZrQixnQkFGRSxHQVNBRCxPQVRBLENBRUZDLGdCQUZFO0FBQUEsTUFHRkMsTUFIRSxHQVNBRixPQVRBLENBR0ZFLE1BSEU7QUFBQSxNQUlGQyxLQUpFLEdBU0FILE9BVEEsQ0FJRkcsS0FKRTtBQUFBLE1BS0ZDLEdBTEUsR0FTQUosT0FUQSxDQUtGSSxHQUxFO0FBQUEsTUFNRnZCLFFBTkUsR0FTQW1CLE9BVEEsQ0FNRm5CLFFBTkU7QUFBQSxNQU9GTyxLQVBFLEdBU0FZLE9BVEEsQ0FPRlosS0FQRTtBQUFBLE1BUUZpQixLQVJFLEdBU0FMLE9BVEEsQ0FRRkssS0FSRTs7QUFVSixNQUFNQyxzQkFBc0IsZ0RBQStCTCxnQkFBL0IsQ0FBNUI7QUFDQSxNQUFNTSxrQkFBa0J2QyxPQUFPd0MsTUFBUCxDQUFjO0FBQUEsUUFBRS9FLElBQUYsVUFBRUEsSUFBRjtBQUFBLFdBQ3BDNkUsb0JBQW9CRyxRQUFwQixDQUE2QmhGLElBQTdCLENBRG9DO0FBQUEsR0FBZCxDQUF4QjtBQUdBLE1BQU1pRixnQkFBZ0JqSCxNQUFNc0IsTUFBTixDQUFhb0YsS0FBYixDQUF0QjtBQUNBLE1BQU1RLGVBQ0hELGlCQUFpQiw0QkFBV0EsY0FBY2pGLElBQXpCLEVBQStCNEUsS0FBL0IsQ0FBcUNKLGdCQUFyQyxDQUFsQixJQUNBLEVBRkY7QUFHQSxNQUFNVyxZQUFZLENBQUNuSCxNQUFNb0gsWUFBUCxJQUF1QkYsYUFBYXBDLE1BQWIsR0FBc0IsQ0FBL0Q7QUFDQSxNQUFNdUMsb0NBQWtDakMsUUFBbEMsNkJBQU47O0FBRUEsU0FDRTtBQUNFLGFBQVNtQixRQUFRSSxHQURuQjtBQUVFLGlCQUFhckIsZUFBZStCLGtCQUY5QjtBQUdFLFlBQVFySCxNQUFNc0IsTUFBTixDQUFhbUYsTUFBYixDQUhWO0FBSUUsWUFBUUssZUFKVjtBQUtFLFFBQUk5RyxNQUFNK0UsRUFMWjtBQU1FLHFCQUFpQnpFLFVBTm5CO0FBT0UsU0FBUXFHLEdBQVIsc0JBUEY7QUFRRSxjQUFVdkIsUUFSWjtBQVNFLFdBQU9wRixNQUFNc0IsTUFBTixDQUFhUyxTQUFiLENBQXVCNEQsS0FBdkIsQ0FUVDtBQVVFLGtCQUFjdUIsWUFWaEI7QUFXRSxlQUFXbEgsTUFBTXNCLE1BQU4sQ0FBYXNGLEtBQWIsQ0FYYjtBQVlFLG1CQUFlNUcsTUFBTXNCLE1BQU4sQ0FBYW9GLEtBQWIsQ0FaakI7QUFhRSxlQUFXUyxTQWJiO0FBY0UsaUJBQWE7QUFBQTs7QUFBQSxhQUFPekMsc0NBQVdnQyxLQUFYLElBQW1CWSxHQUFuQixlQUF5QlgsR0FBekIsQ0FBUDtBQUFBLEtBZGY7QUFlRSxpQkFBYTtBQUFBOztBQUFBLGFBQU9qQyxzQ0FBV2tDLEtBQVgsSUFBbUJVLEdBQW5CLGVBQXlCWCxHQUF6QixDQUFQO0FBQUE7QUFmZixJQURGO0FBbUJELENBL0NEOztBQWlEQSxJQUFNWSx5QkFBeUIsU0FBekJBLHNCQUF5QjtBQUFBLE1BQVVqRyxNQUFWLFVBQUV0QixLQUFGLENBQVVzQixNQUFWO0FBQUEsTUFBbUJvRCxRQUFuQixVQUFtQkEsUUFBbkI7QUFBQSxTQUM3QjtBQUNFLFdBQU0sYUFEUjtBQUVFLGFBQ0VwRCxPQUFPQyxVQUFQLEdBQ0ksNEJBQVdELE9BQU9DLFVBQVAsQ0FBa0JTLElBQTdCLEVBQW1DNEUsS0FBbkMsQ0FBeUNZLFNBRDdDLEdBRUksNEJBQVdDLE9BQVgsQ0FBbUJiLEtBQW5CLENBQXlCWSxTQUxqQztBQU9FLGVBQVdsRyxPQUFPb0csVUFQcEI7QUFRRSxjQUFVO0FBQUEsYUFBT2hELFNBQVMsRUFBQ2dELFlBQVlKLEdBQWIsRUFBVCxFQUE0QixPQUE1QixDQUFQO0FBQUE7QUFSWixJQUQ2QjtBQUFBLENBQS9COztBQWFBLElBQU1LLDBCQUEwQixTQUExQkEsdUJBQTBCO0FBQUEsTUFDYjVGLFNBRGEsVUFDOUIvQixLQUQ4QixDQUN0QnNCLE1BRHNCLENBQ2JTLFNBRGE7QUFBQSxNQUU5QjJFLEtBRjhCLFVBRTlCQSxLQUY4QjtBQUFBLE1BRzlCdEIsUUFIOEIsVUFHOUJBLFFBSDhCO0FBQUEsTUFJOUJ3QyxPQUo4QixVQUk5QkEsT0FKOEI7QUFBQSxNQUs5QmxELFVBTDhCLFVBSzlCQSxRQUw4QjtBQUFBLFNBTzlCO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBLHNCQUEwQmdDLFFBQVFBLE1BQU1tQixJQUFkLEdBQXFCLEVBQS9DO0FBQUEsS0FERjtBQUVFO0FBQ0UsZ0JBQVUsQ0FBQ25CLEtBRGI7QUFFRSxxQkFBZTNFLFVBQVVxRCxRQUFWLENBRmpCO0FBR0UsZUFBU3dDLE9BSFg7QUFJRSxtQkFBYSxLQUpmO0FBS0Usa0JBQVksS0FMZDtBQU1FLGdCQUFVO0FBQUE7O0FBQUEsZUFBU2xELHdDQUFXVSxRQUFYLElBQXNCRixLQUF0QixjQUFUO0FBQUE7QUFOWjtBQUZGLEdBUDhCO0FBQUEsQ0FBaEM7QUFtQkEiLCJmaWxlIjoibGF5ZXItY29uZmlndXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtyZ2J9IGZyb20gJ2QzLWNvbG9yJztcbmltcG9ydCB7U3dpdGNofSBmcm9tICdAdWJlci9yZWFjdC1zd2l0Y2gnO1xuXG5pbXBvcnQgUmFuZ2VTbGlkZXIgZnJvbSAnY29tcG9uZW50cy9jb21tb24vcmFuZ2Utc2xpZGVyJztcbmltcG9ydCB7XG4gIFBhbmVsTGFiZWwsXG4gIFNpZGVQYW5lbFNlY3Rpb25cbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IEluZm9IZWxwZXIgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaW5mby1oZWxwZXInO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuXG5pbXBvcnQgVmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yIGZyb20gJy4vdmlzLWNvbmZpZy1ieS1maWVsZC1zZWxlY3Rvcic7XG5pbXBvcnQgTGF5ZXJDb2x1bW5Db25maWcgZnJvbSAnLi9sYXllci1jb2x1bW4tY29uZmlnJztcbmltcG9ydCBDb2xvclJhbmdlU2VsZWN0b3IgZnJvbSAnLi9jb2xvci1yYW5nZS1zZWxlY3Rvcic7XG5pbXBvcnQgRGltZW5zaW9uU2NhbGVTZWxlY3RvciBmcm9tICcuL2RpbWVuc2lvbi1zY2FsZS1zZWxlY3Rvcic7XG5pbXBvcnQgQ29sb3JTaW5nbGVTZWxlY3RvciBmcm9tICcuL2NvbG9yLXNpbmdsZS1zZWxlY3Rvcic7XG5pbXBvcnQgU291cmNlRGF0YVNlbGVjdG9yIGZyb20gJy4uL3NvdXJjZS1kYXRhLXNlbGVjdG9yJztcblxuaW1wb3J0IHtMQVlFUl9WSVNfQ09ORklHU30gZnJvbSAna2VwbGVyZ2wtbGF5ZXJzL2xheWVyLWZhY3RvcnknO1xuXG5pbXBvcnQge2NhcGl0YWxpemVGaXJzdExldHRlcn0gZnJvbSAndXRpbHMvdXRpbHMnO1xuaW1wb3J0IHtoZXhUb1JnYn0gZnJvbSAndXRpbHMvY29sb3ItdXRpbHMnO1xuXG5pbXBvcnQge1xuICBGSUVMRF9PUFRTLFxuICBMQVlFUl9UWVBFUyxcbiAgQ0hBTk5FTF9TQ0FMRV9TVVBQT1JURURfRklFTERTXG59IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBsYXllcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBkYXRhc2V0czogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBvcGVuTW9kYWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHBhbmVsV2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgdXBkYXRlTGF5ZXJDb25maWc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHVwZGF0ZUxheWVyVHlwZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgdXBkYXRlTGF5ZXJWaXNDb25maWc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXJDb25maWd1cmF0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICBfcmVuZGVyUG9pbnRMYXllckNvbmZpZyhwcm9wcykge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJTY2F0dGVycGxvdExheWVyQ29uZmlnKHByb3BzKTtcbiAgfVxuXG4gIF9yZW5kZXJJY29uTGF5ZXJDb25maWcocHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyU2NhdHRlcnBsb3RMYXllckNvbmZpZyhwcm9wcyk7XG4gIH1cblxuICBfcmVuZGVyU2NhdHRlcnBsb3RMYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wc1xuICB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVzaC1zbWFsbC0tdG9wXCI+XG4gICAgICAgIHsvKiBDb2xvciAqL31cbiAgICAgICAgPExheWVyQ29sb3JTZWxlY3RvciB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICAgIHtsYXllci5jb25maWcuY29sb3JGaWVsZCA/IChcbiAgICAgICAgICA8Q29sb3JSYW5nZUNvbmZpZyB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm9wYWNpdHl9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAvPlxuICAgICAgICB7LyogUmFkaXVzICovfVxuICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnJhZGl1c31cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgZGlzYWJsZWQ9e0Jvb2xlYW4obGF5ZXIuY29uZmlnLnNpemVGaWVsZCl9XG4gICAgICAgIC8+XG4gICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZX1cbiAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICAgIDxWaXNDb25maWdTd2l0Y2hcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZml4ZWRSYWRpdXN9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXIuY29uZmlnLnNpemVGaWVsZH1cbiAgICAgICAgLz5cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5yYWRpdXNSYW5nZX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgZGlzYWJsZWQ9e1xuICAgICAgICAgICAgIWxheWVyLmNvbmZpZy5zaXplRmllbGQgfHwgbGF5ZXIuY29uZmlnLnZpc0NvbmZpZy5maXhlZFJhZGl1c1xuICAgICAgICAgIH1cbiAgICAgICAgLz5cbiAgICAgICAgey8qIG91dGxpbmUgKi99XG4gICAgICAgIHtsYXllci50eXBlID09PSBMQVlFUl9UWVBFUy5wb2ludCA/IChcbiAgICAgICAgICA8VmlzQ29uZmlnU3dpdGNoXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3V0bGluZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAge2xheWVyLnR5cGUgPT09IExBWUVSX1RZUEVTLnBvaW50ID8gKFxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy50aGlja25lc3N9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICBsYWJlbD17Jyd9XG4gICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyLmNvbmZpZy52aXNDb25maWcub3V0bGluZX1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAgey8qIGhpZ2ggcHJlY2lzaW9uICovfVxuICAgICAgICA8SGlnaFByZWNpc2lvblN3aXRjaCB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlckNsdXN0ZXJMYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVzaC1zbWFsbC0tdG9wXCI+XG4gICAgICAgIHsvKiBDbHVzdGVyIFJhZGl1cyAqL31cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5jbHVzdGVyUmFkaXVzfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgLz5cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5jbHVzdGVyUmFkaXVzUmFuZ2V9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAvPlxuICAgICAgICB7LyogT3BhY2l0eSAqL31cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5vcGFjaXR5fVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgLz5cbiAgICAgICAgey8qIENvbG9yICovfVxuICAgICAgICA8Q29sb3JSYW5nZUNvbmZpZyB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgIDxBZ2dyQ29sb3JTY2FsZVNlbGVjdG9yIHsuLi5sYXllckNvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgLz5cbiAgICAgICAgPEFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmFnZ3JlZ2F0aW9ufVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICBmaWVsZD17bGF5ZXIuY29uZmlnLmNvbG9yRmllbGR9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlckdyaWRMYXllckNvbmZpZyhwcm9wcykge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJBZ2dyZWdhdGlvbkxheWVyQ29uZmlnKHByb3BzKTtcbiAgfVxuXG4gIF9yZW5kZXJIZXhhZ29uTGF5ZXJDb25maWcocHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyQWdncmVnYXRpb25MYXllckNvbmZpZyhwcm9wcyk7XG4gIH1cblxuICBfcmVuZGVyQWdncmVnYXRpb25MYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICB9KSB7XG4gICAgY29uc3Qge3R5cGUsIGNvbmZpZ30gPSBsYXllcjtcbiAgICBjb25zdCB7dmlzQ29uZmlnOiB7ZW5hYmxlM2R9LCBjb2xvckZpZWxkLCBzaXplRmllbGR9ID0gY29uZmlnO1xuICAgIGNvbnN0IGVsZXZhdGlvbkJ5RGVzY3JpcHRpb24gPVxuICAgICAgJ1doZW4gb2ZmLCBoZWlnaHQgaXMgYmFzZWQgb24gY291bnQgb2YgcG9pbnRzJztcbiAgICBjb25zdCBjb2xvckJ5RGVzY3JpcHRpb24gPSAnV2hlbiBvZmYsIGNvbG9yIGlzIGJhc2VkIG9uIGNvdW50IG9mIHBvaW50cyc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdXNoLXNtYWxsLS10b3BcIj5cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5vcGFjaXR5fVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgLz5cbiAgICAgICAgey8qIENlbGwgc2l6ZSAqL31cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy53b3JsZFVuaXRTaXplfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICBsYWJlbD17YCR7XG4gICAgICAgICAgICB0eXBlID09PSBMQVlFUl9UWVBFUy5ncmlkID8gJ0dyaWQgU2l6ZScgOiAnSGV4YWdvbiBSYWRpdXMnXG4gICAgICAgICAgfSAoa20pYH1cbiAgICAgICAgLz5cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5jb3ZlcmFnZX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICAgIHsvKiBDb2xvciAqL31cbiAgICAgICAgPENvbG9yUmFuZ2VDb25maWcgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICA8QWdnckNvbG9yU2NhbGVTZWxlY3RvciB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICAgIDxBZ2dyZWdhdGlvblR5cGVTZWxlY3RvclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5hZ2dyZWdhdGlvbn1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgZGVzY3JlaXB0aW9uPXtjb2xvckJ5RGVzY3JpcHRpb259XG4gICAgICAgICAgZmllbGQ9e2NvbG9yRmllbGR9XG4gICAgICAgIC8+XG4gICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MucGVyY2VudGlsZX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICAgIHsvKiBFbGV2YXRpb24gKi99XG4gICAgICAgIDxWaXNDb25maWdTd2l0Y2hcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZW5hYmxlM2R9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAvPlxuICAgICAgICB7ZW5hYmxlM2QgPyAoXG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgICBkZXNjcmlwdGlvbj17ZWxldmF0aW9uQnlEZXNjcmlwdGlvbn1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPEFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmFnZ3JlZ2F0aW9ufVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICBwcm9wZXJ0eT17J3NpemVBZ2dyZWdhdGlvbid9XG4gICAgICAgICAgZmllbGQ9e3NpemVGaWVsZH1cbiAgICAgICAgLz5cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5wZXJjZW50aWxlfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICBwcm9wZXJ0eT17J2VsZXZhdGlvblBlcmNlbnRpbGUnfVxuICAgICAgICAgIGRpc2FibGVkPXshZW5hYmxlM2QgfHwgKCFjb2xvckZpZWxkICYmICFzaXplRmllbGQpfVxuICAgICAgICAvPlxuICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmVsZXZhdGlvblNjYWxlfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgLz5cbiAgICAgICAgPEhpZ2hQcmVjaXNpb25Td2l0Y2ggey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIF9yZW5kZXJIZXhhZ29uSWRMYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVzaC1zbWFsbC0tdG9wXCI+XG4gICAgICAgIHsvKiBDb2xvciAqL31cbiAgICAgICAgPExheWVyQ29sb3JTZWxlY3RvciB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICAgIHtsYXllci5jb25maWcuY29sb3JGaWVsZCA/IChcbiAgICAgICAgICA8Q29sb3JSYW5nZUNvbmZpZyB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm9wYWNpdHl9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAvPlxuICAgICAgICB7LyogaGVpZ2h0ICovfVxuICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAvPlxuICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmVsZXZhdGlvblNjYWxlfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgLz5cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5lbGV2YXRpb25SYW5nZX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgbGFiZWw9eydIZWlnaHQgUmFuZ2UnfVxuICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXIuY29uZmlnLnNpemVGaWVsZH1cbiAgICAgICAgLz5cbiAgICAgICAgPEhpZ2hQcmVjaXNpb25Td2l0Y2ggey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIF9yZW5kZXJBcmNMYXllckNvbmZpZyhhcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlckxpbmVMYXllckNvbmZpZyhhcmdzKTtcbiAgfVxuXG4gIF9yZW5kZXJMaW5lTGF5ZXJDb25maWcoe1xuICAgIGxheWVyLFxuICAgIHZpc0NvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHNcbiAgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1c2gtc21hbGwtLXRvcFwiPlxuICAgICAgICB7LyogQ29sb3IgKi99XG4gICAgICAgIDxMYXllckNvbG9yU2VsZWN0b3Igey4uLmxheWVyQ29uZmlndXJhdG9yUHJvcHN9IGxhYmVsPVwiU291cmNlIENvbG9yXCIgLz5cbiAgICAgICAgPFZpc0NvbG9yU2VsZWN0b3JcbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnRhcmdldENvbG9yfVxuICAgICAgICAvPlxuICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgLz5cbiAgICAgICAge2xheWVyLmNvbmZpZy5jb2xvckZpZWxkID8gKFxuICAgICAgICAgIDxDb2xvclJhbmdlQ29uZmlnIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3BhY2l0eX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgIC8+XG5cbiAgICAgICAgey8qIHRoaWNrbmVzcyAqL31cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy50aGlja25lc3N9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAvPlxuICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAvPlxuICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnN0cm9rZVdpZHRoUmFuZ2V9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXIuY29uZmlnLnNpemVGaWVsZH1cbiAgICAgICAgLz5cbiAgICAgICAgey8qIGhpZ2ggcHJlY2lzaW9uICovfVxuICAgICAgICA8SGlnaFByZWNpc2lvblN3aXRjaCB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlckdlb2pzb25MYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICB9KSB7XG4gICAgY29uc3Qge21ldGE6IHtmZWF0dXJlVHlwZXMgPSB7fX0sIGNvbmZpZzoge3Zpc0NvbmZpZ319ID0gbGF5ZXI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdXNoLXNtYWxsLS10b3BcIj5cbiAgICAgICAgPExheWVyQ29sb3JTZWxlY3RvciB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5vcGFjaXR5fVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgLz5cblxuICAgICAgICB7LyogQ29sb3IgQnkgKi99XG5cbiAgICAgICAge2ZlYXR1cmVUeXBlcy5wb2x5Z29uID8gKFxuICAgICAgICAgIDxWaXNDb25maWdTd2l0Y2hcbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5maWxsZWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuY29sb3J9XG4gICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAvPlxuICAgICAgICB7bGF5ZXIuY29uZmlnLmNvbG9yRmllbGQgPyAoXG4gICAgICAgICAgPENvbG9yUmFuZ2VDb25maWcgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICB7LyogU3Ryb2tlIFdpZHRoICovfVxuICAgICAgICB7ZmVhdHVyZVR5cGVzLnBvbHlnb24gPyAoXG4gICAgICAgICAgPFZpc0NvbmZpZ1N3aXRjaFxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnN0cm9rZWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAge2ZlYXR1cmVUeXBlcy5saW5lIHx8IChmZWF0dXJlVHlwZXMucG9seWdvbiAmJiB2aXNDb25maWcuc3Ryb2tlZCkgPyAoXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnRoaWNrbmVzc31cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5zdHJva2VXaWR0aFJhbmdlfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXIuY29uZmlnLnNpemVGaWVsZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHsvKiBFbGV2YXRpb24gKi99XG4gICAgICAgIHtmZWF0dXJlVHlwZXMucG9seWdvbiAmJiB2aXNDb25maWcuZmlsbGVkID8gKFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU3dpdGNoXG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmVuYWJsZTNkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxWaXNDb25maWdTd2l0Y2hcbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mud2lyZWZyYW1lfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IXZpc0NvbmZpZy5lbmFibGUzZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7dmlzQ29uZmlnLmVuYWJsZTNkID8gKFxuICAgICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmhlaWdodH1cbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmVsZXZhdGlvblNjYWxlfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXshdmlzQ29uZmlnLmVuYWJsZTNkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgey8qIFJhZGl1cyAqL31cbiAgICAgICAge2ZlYXR1cmVUeXBlcy5wb2ludCA/IChcbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MucmFkaXVzfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGxhYmVsPVwiUG9pbnQgUmFkaXVzXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e0Jvb2xlYW4obGF5ZXIuY29uZmlnLnJhZGl1c0ZpZWxkKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5yYWRpdXN9XG4gICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5yYWRpdXNSYW5nZX1cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyLmNvbmZpZy5yYWRpdXNGaWVsZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHsvKiB2aXMgU3dpdGNoZXMgKi99XG4gICAgICAgIDxIaWdoUHJlY2lzaW9uU3dpdGNoIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgbGF5ZXIsXG4gICAgICBkYXRhc2V0cyxcbiAgICAgIHBhbmVsV2lkdGgsXG4gICAgICBpc0FkZGluZyxcbiAgICAgIHVwZGF0ZUxheWVyQ29uZmlnXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2ZpZWxkcyA9IFtdLCBmaWVsZFBhaXJzfSA9IGxheWVyLmNvbmZpZy5kYXRhSWRcbiAgICAgID8gZGF0YXNldHNbbGF5ZXIuY29uZmlnLmRhdGFJZF1cbiAgICAgIDoge307XG4gICAgY29uc3Qge2NvbmZpZ30gPSBsYXllcjtcblxuICAgIGNvbnN0IGNvbW1vbkNvbmZpZ1Byb3AgPSB7XG4gICAgICBsYXllcixcbiAgICAgIHBhbmVsV2lkdGgsXG4gICAgICBmaWVsZHNcbiAgICB9O1xuXG4gICAgY29uc3QgdmlzQ29uZmlndXJhdG9yUHJvcHMgPSB7XG4gICAgICAuLi5jb21tb25Db25maWdQcm9wLFxuICAgICAgb25DaGFuZ2U6IHRoaXMucHJvcHMudXBkYXRlTGF5ZXJWaXNDb25maWdcbiAgICB9O1xuXG4gICAgY29uc3QgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyA9IHtcbiAgICAgIC4uLmNvbW1vbkNvbmZpZ1Byb3AsXG4gICAgICBvbkNoYW5nZTogdXBkYXRlTGF5ZXJDb25maWdcbiAgICB9O1xuXG4gICAgY29uc3QgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHMgPSB7XG4gICAgICAuLi5jb21tb25Db25maWdQcm9wLFxuICAgICAgb25DaGFuZ2U6IHRoaXMucHJvcHMudXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnXG4gICAgfTtcblxuICAgIGNvbnN0IHJlbmRlclRlbXBsYXRlID1cbiAgICAgIGxheWVyLnR5cGUgJiYgYF9yZW5kZXIke2NhcGl0YWxpemVGaXJzdExldHRlcihsYXllci50eXBlKX1MYXllckNvbmZpZ2A7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzb2Z0LXRpbnkgbGF5ZXItcGFuZWxfX2NvbmZpZ1wiPlxuICAgICAgICB7T2JqZWN0LmtleXMoZGF0YXNldHMpLmxlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgIDxTb3VyY2VEYXRhU2VsZWN0b3JcbiAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgIGlkPXtsYXllci5pZH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtsYXllci50eWVwICYmIGNvbmZpZy5jb2x1bW5zfVxuICAgICAgICAgICAgZGF0YUlkPXtjb25maWcuZGF0YUlkfVxuICAgICAgICAgICAgb25TZWxlY3Q9e3ZhbHVlID0+IHVwZGF0ZUxheWVyQ29uZmlnKHtkYXRhSWQ6IHZhbHVlfSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgICAgPExheWVyQ29sdW1uQ29uZmlnXG4gICAgICAgICAgbGF5ZXI9e2xheWVyfVxuICAgICAgICAgIGZpZWxkcz17ZmllbGRzfVxuICAgICAgICAgIGZpZWxkUGFpcnM9e2ZpZWxkUGFpcnN9XG4gICAgICAgICAgdXBkYXRlTGF5ZXJDb25maWc9e3VwZGF0ZUxheWVyQ29uZmlnfVxuICAgICAgICAgIHVwZGF0ZUxheWVyVHlwZT17dGhpcy5wcm9wcy51cGRhdGVMYXllclR5cGV9XG4gICAgICAgICAgb3Blbk1vZGFsPXt0aGlzLnByb3BzLm9wZW5Nb2RhbH1cbiAgICAgICAgLz5cbiAgICAgICAgeyFpc0FkZGluZyAmJlxuICAgICAgICAgIHRoaXNbcmVuZGVyVGVtcGxhdGVdICYmXG4gICAgICAgICAgdGhpc1tyZW5kZXJUZW1wbGF0ZV0oe1xuICAgICAgICAgICAgbGF5ZXIsXG4gICAgICAgICAgICB2aXNDb25maWd1cmF0b3JQcm9wcyxcbiAgICAgICAgICAgIGxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzLFxuICAgICAgICAgICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wc1xuICAgICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5MYXllckNvbmZpZ3VyYXRvci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbi8qXG4gKiBDb21wb25lbnRpemUgY29uZmlnIGNvbXBvbmVudCBpbnRvIHB1cmUgZnVuY3Rpb25hbCBjb21wb25lbnRzXG4gKi9cbmNvbnN0IFZpc0NvbmZpZ1N3aXRjaCA9ICh7XG4gIGxheWVyOiB7aWQsIGNvbmZpZ30sXG4gIHByb3BlcnR5LFxuICBvbkNoYW5nZSxcbiAgbGFiZWwsXG4gIGRlc2NyaXB0aW9uLFxuICBkaXNhYmxlZFxufSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbiBkaXNhYmxlZD17Qm9vbGVhbihkaXNhYmxlZCl9PlxuICAgIDxQYW5lbExhYmVsPntsYWJlbCB8fCBjYXBpdGFsaXplRmlyc3RMZXR0ZXIocHJvcGVydHkpfTwvUGFuZWxMYWJlbD5cbiAgICB7ZGVzY3JpcHRpb24gPyAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpc3BsYXktLWlubGluZS1ibG9ja1wiPlxuICAgICAgICA8SW5mb0hlbHBlciBkZXNjcmlwdGlvbj17ZGVzY3JpcHRpb259IGlkPXtgJHtpZH0tJHtwcm9wZXJ0eX1gfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKSA6IG51bGx9XG4gICAgPGRpdiBjbGFzc05hbWU9XCJkaXNwbGF5LS1pbmxpbmUtYmxvY2sgZmxvYXQtLXJpZ2h0XCI+XG4gICAgICA8U3dpdGNoXG4gICAgICAgIGNsYXNzTmFtZT1cIm1pY3JvIHRleHQtdWJlci1ibGFjay00MFwiXG4gICAgICAgIHN0eWxlPXt7bWFyZ2luQm90dG9tOiAwLCBtYXJnaW5SaWdodDogJy0xMHB4J319XG4gICAgICAgIGNoZWNrZWQ9e2NvbmZpZy52aXNDb25maWdbcHJvcGVydHldfVxuICAgICAgICBpZD17YCR7aWR9LSR7cHJvcGVydHl9YH1cbiAgICAgICAgbGFiZWw9eycgJ31cbiAgICAgICAgb25DaGFuZ2U9eygpID0+IG9uQ2hhbmdlKHtbcHJvcGVydHldOiAhY29uZmlnLnZpc0NvbmZpZ1twcm9wZXJ0eV19KX1cbiAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1wYXJhbXMgKi9cbmV4cG9ydCBjb25zdCBWaXNDb25maWdTbGlkZXIgPSAoe1xuICBsYXllcjoge2NvbmZpZ30sXG4gIHByb3BlcnR5LFxuICBsYWJlbCxcbiAgcmFuZ2UsXG4gIHN0ZXAsXG4gIGlzUmFuZ2VkLFxuICBkaXNhYmxlZCxcbiAgb25DaGFuZ2Vcbn0pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24gZGlzYWJsZWQ9e0Jvb2xlYW4oZGlzYWJsZWQpfT5cbiAgICA8UGFuZWxMYWJlbD5cbiAgICAgIHt0eXBlb2YgbGFiZWwgPT09ICdzdHJpbmcnXG4gICAgICAgID8gbGFiZWxcbiAgICAgICAgOiB0eXBlb2YgbGFiZWwgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICA/IGxhYmVsKGNvbmZpZylcbiAgICAgICAgICA6IGNhcGl0YWxpemVGaXJzdExldHRlcihwcm9wZXJ0eSl9XG4gICAgPC9QYW5lbExhYmVsPlxuICAgIDxSYW5nZVNsaWRlclxuICAgICAgbWluVmFsdWU9e3JhbmdlWzBdfVxuICAgICAgbWF4VmFsdWU9e3JhbmdlWzFdfVxuICAgICAgdmFsdWUwPXtpc1JhbmdlZCA/IGNvbmZpZy52aXNDb25maWdbcHJvcGVydHldWzBdIDogcmFuZ2VbMF19XG4gICAgICB2YWx1ZTE9e1xuICAgICAgICBpc1JhbmdlZCA/IGNvbmZpZy52aXNDb25maWdbcHJvcGVydHldWzFdIDogY29uZmlnLnZpc0NvbmZpZ1twcm9wZXJ0eV1cbiAgICAgIH1cbiAgICAgIHN0ZXA9e3N0ZXB9XG4gICAgICBpc1JhbmdlZD17Qm9vbGVhbihpc1JhbmdlZCl9XG4gICAgICBzaG93SW5wdXQ9e3RydWV9XG4gICAgICBvbkNoYW5nZT17dmFsdWUgPT4gb25DaGFuZ2Uoe1twcm9wZXJ0eV06IGlzUmFuZ2VkID8gdmFsdWUgOiB2YWx1ZVsxXX0pfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG4vKiBlc2xpbnQtZW5hYmxlIG1heC1wYXJhbXMgKi9cblxuY29uc3QgSGlnaFByZWNpc2lvblN3aXRjaCA9ICh7bGF5ZXIsIG9uQ2hhbmdlfSkgPT4gKFxuICA8VmlzQ29uZmlnU3dpdGNoXG4gICAgey4uLkxBWUVSX1ZJU19DT05GSUdTWydoaS1wcmVjaXNpb24nXX1cbiAgICBsYXllcj17bGF5ZXJ9XG4gICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAvPlxuKTtcblxuY29uc3QgTGF5ZXJDb2xvclNlbGVjdG9yID0gKHtsYXllciwgcGFuZWxXaWR0aCwgb25DaGFuZ2UsIGxhYmVsfSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbiBkaXNhYmxlZD17bGF5ZXIuY29uZmlnLmNvbG9yRmllbGR9PlxuICAgIDxQYW5lbExhYmVsPntsYWJlbCB8fCAnTGF5ZXIgQ29sb3InfTwvUGFuZWxMYWJlbD5cbiAgICA8Q29sb3JTaW5nbGVTZWxlY3RvclxuICAgICAgd2lkdGg9e3BhbmVsV2lkdGh9XG4gICAgICBzZXRDb2xvcj17aGV4ID0+IG9uQ2hhbmdlKHtjb2xvcjogaGV4VG9SZ2IoaGV4KX0pfVxuICAgICAgc2VsZWN0ZWRDb2xvcj17cmdiKC4uLmxheWVyLmNvbmZpZy5jb2xvcilcbiAgICAgICAgLnRvU3RyaW5nKClcbiAgICAgICAgLnRvVXBwZXJDYXNlKCl9XG4gICAgLz5cbiAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuKTtcblxuY29uc3QgVmlzQ29sb3JTZWxlY3RvciA9ICh7bGF5ZXIsIHBhbmVsV2lkdGgsIG9uQ2hhbmdlLCBsYWJlbCwgcHJvcGVydHl9KSA9PiAoXG4gIDxTaWRlUGFuZWxTZWN0aW9uIGRpc2FibGVkPXtsYXllci5jb25maWcuY29sb3JGaWVsZH0+XG4gICAgPFBhbmVsTGFiZWw+e2xhYmVsIHx8ICdUYXJnZXQgQ29sb3InfTwvUGFuZWxMYWJlbD5cbiAgICA8Q29sb3JTaW5nbGVTZWxlY3RvclxuICAgICAgd2lkdGg9e3BhbmVsV2lkdGh9XG4gICAgICBzZXRDb2xvcj17aGV4ID0+IG9uQ2hhbmdlKHtbcHJvcGVydHldOiBoZXhUb1JnYihoZXgpfSl9XG4gICAgICBzZWxlY3RlZENvbG9yPXtyZ2IoXG4gICAgICAgIC4uLihsYXllci5jb25maWcudmlzQ29uZmlnW3Byb3BlcnR5XSB8fCBsYXllci5jb25maWcuY29sb3IpXG4gICAgICApXG4gICAgICAgIC50b1N0cmluZygpXG4gICAgICAgIC50b1VwcGVyQ2FzZSgpfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbmNvbnN0IENvbG9yUmFuZ2VDb25maWcgPSAoe2xheWVyLCBwYW5lbFdpZHRoLCBvbkNoYW5nZX0pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgPFBhbmVsTGFiZWw+Q29sb3IgUGFsZXR0ZTwvUGFuZWxMYWJlbD5cbiAgICA8Q29sb3JSYW5nZVNlbGVjdG9yXG4gICAgICB3aWR0aD17cGFuZWxXaWR0aH1cbiAgICAgIHNlbGVjdGVkQ29sb3JSYW5nZT17bGF5ZXIuY29uZmlnLnZpc0NvbmZpZy5jb2xvclJhbmdlfVxuICAgICAgb25TZWxlY3RDb2xvclJhbmdlPXtvbkNoYW5nZX1cbiAgICAvPlxuICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4pO1xuXG5jb25zdCBDaGFubmVsQnlWYWx1ZVNlbGVjdG9yID0gKHtcbiAgbGF5ZXIsXG4gIGNoYW5uZWwsXG4gIHBhbmVsV2lkdGgsXG4gIG9uQ2hhbmdlLFxuICBmaWVsZHMsXG4gIGRlc2NyaXB0aW9uXG59KSA9PiB7XG4gIGNvbnN0IHtcbiAgICBjaGFubmVsU2NhbGVUeXBlLFxuICAgIGRvbWFpbixcbiAgICBmaWVsZCxcbiAgICBrZXksXG4gICAgcHJvcGVydHksXG4gICAgcmFuZ2UsXG4gICAgc2NhbGVcbiAgfSA9IGNoYW5uZWw7XG4gIGNvbnN0IHN1cHBvcnRlZEZpZWxkVHlwZXMgPSBDSEFOTkVMX1NDQUxFX1NVUFBPUlRFRF9GSUVMRFNbY2hhbm5lbFNjYWxlVHlwZV07XG4gIGNvbnN0IHN1cHBvcnRlZEZpZWxkcyA9IGZpZWxkcy5maWx0ZXIoKHt0eXBlfSkgPT5cbiAgICBzdXBwb3J0ZWRGaWVsZFR5cGVzLmluY2x1ZGVzKHR5cGUpXG4gICk7XG4gIGNvbnN0IHNlbGVjdGVkRmllbGQgPSBsYXllci5jb25maWdbZmllbGRdO1xuICBjb25zdCBzY2FsZU9wdGlvbnMgPVxuICAgIChzZWxlY3RlZEZpZWxkICYmIEZJRUxEX09QVFNbc2VsZWN0ZWRGaWVsZC50eXBlXS5zY2FsZVtjaGFubmVsU2NhbGVUeXBlXSkgfHxcbiAgICBbXTtcbiAgY29uc3Qgc2hvd1NjYWxlID0gIWxheWVyLmlzQWdncmVnYXRlZCAmJiBzY2FsZU9wdGlvbnMubGVuZ3RoID4gMTtcbiAgY29uc3QgZGVmYXVsdERlc2NyaXB0aW9uID0gYENhbGN1bGF0ZSAke3Byb3BlcnR5fSBiYXNlZCBvbiBzZWxlY3RlZCBmaWVsZGA7XG5cbiAgcmV0dXJuIChcbiAgICA8VmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yXG4gICAgICBjaGFubmVsPXtjaGFubmVsLmtleX1cbiAgICAgIGRlc2NyaXB0aW9uPXtkZXNjcmlwdGlvbiB8fCBkZWZhdWx0RGVzY3JpcHRpb259XG4gICAgICBkb21haW49e2xheWVyLmNvbmZpZ1tkb21haW5dfVxuICAgICAgZmllbGRzPXtzdXBwb3J0ZWRGaWVsZHN9XG4gICAgICBpZD17bGF5ZXIuaWR9XG4gICAgICBpbm5lclBhbmVsV2lkdGg9e3BhbmVsV2lkdGh9XG4gICAgICBrZXk9e2Ake2tleX0tY2hhbm5lbC1zZWxlY3RvcmB9XG4gICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICByYW5nZT17bGF5ZXIuY29uZmlnLnZpc0NvbmZpZ1tyYW5nZV19XG4gICAgICBzY2FsZU9wdGlvbnM9e3NjYWxlT3B0aW9uc31cbiAgICAgIHNjYWxlVHlwZT17bGF5ZXIuY29uZmlnW3NjYWxlXX1cbiAgICAgIHNlbGVjdGVkRmllbGQ9e2xheWVyLmNvbmZpZ1tmaWVsZF19XG4gICAgICBzaG93U2NhbGU9e3Nob3dTY2FsZX1cbiAgICAgIHVwZGF0ZUZpZWxkPXt2YWwgPT4gb25DaGFuZ2Uoe1tmaWVsZF06IHZhbH0sIGtleSl9XG4gICAgICB1cGRhdGVTY2FsZT17dmFsID0+IG9uQ2hhbmdlKHtbc2NhbGVdOiB2YWx9LCBrZXkpfVxuICAgIC8+XG4gICk7XG59O1xuXG5jb25zdCBBZ2dyQ29sb3JTY2FsZVNlbGVjdG9yID0gKHtsYXllcjoge2NvbmZpZ30sIG9uQ2hhbmdlfSkgPT4gKFxuICA8RGltZW5zaW9uU2NhbGVTZWxlY3RvclxuICAgIGxhYmVsPVwiQ29sb3IgU2NhbGVcIlxuICAgIG9wdGlvbnM9e1xuICAgICAgY29uZmlnLmNvbG9yRmllbGRcbiAgICAgICAgPyBGSUVMRF9PUFRTW2NvbmZpZy5jb2xvckZpZWxkLnR5cGVdLnNjYWxlLmNvbG9yQWdnclxuICAgICAgICA6IEZJRUxEX09QVFMuaW50ZWdlci5zY2FsZS5jb2xvckFnZ3JcbiAgICB9XG4gICAgc2NhbGVUeXBlPXtjb25maWcuY29sb3JTY2FsZX1cbiAgICBvblNlbGVjdD17dmFsID0+IG9uQ2hhbmdlKHtjb2xvclNjYWxlOiB2YWx9LCAnY29sb3InKX1cbiAgLz5cbik7XG5cbmNvbnN0IEFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yID0gKHtcbiAgbGF5ZXI6IHtjb25maWc6IHt2aXNDb25maWd9fSxcbiAgZmllbGQsXG4gIHByb3BlcnR5LFxuICBvcHRpb25zLFxuICBvbkNoYW5nZVxufSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICA8UGFuZWxMYWJlbD57YEFnZ3JlZ2F0ZSAke2ZpZWxkID8gZmllbGQubmFtZSA6ICcnfSBieWB9PC9QYW5lbExhYmVsPlxuICAgIDxJdGVtU2VsZWN0b3JcbiAgICAgIGRpc2FibGVkPXshZmllbGR9XG4gICAgICBzZWxlY3RlZEl0ZW1zPXt2aXNDb25maWdbcHJvcGVydHldfVxuICAgICAgb3B0aW9ucz17b3B0aW9uc31cbiAgICAgIG11bHRpU2VsZWN0PXtmYWxzZX1cbiAgICAgIHNlYXJjaGFibGU9e2ZhbHNlfVxuICAgICAgb25DaGFuZ2U9e3ZhbHVlID0+IG9uQ2hhbmdlKHtbcHJvcGVydHldOiB2YWx1ZX0pfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG4vKiBlc2xpbnQtZW5hYmxlIG1heC1wYXJhbXMgKi9cbiJdfQ==