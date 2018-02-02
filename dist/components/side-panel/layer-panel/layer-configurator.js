'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-top: 12px;\n'], ['\n  margin-top: 12px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledComponents3 = require('../../common/styled-components');

var _itemSelector = require('../../common/item-selector/item-selector');

var _itemSelector2 = _interopRequireDefault(_itemSelector);

var _visConfigByFieldSelector = require('./vis-config-by-field-selector');

var _visConfigByFieldSelector2 = _interopRequireDefault(_visConfigByFieldSelector);

var _layerColumnConfig = require('./layer-column-config');

var _layerColumnConfig2 = _interopRequireDefault(_layerColumnConfig);

var _dimensionScaleSelector = require('./dimension-scale-selector');

var _dimensionScaleSelector2 = _interopRequireDefault(_dimensionScaleSelector);

var _colorSelector = require('./color-selector');

var _colorSelector2 = _interopRequireDefault(_colorSelector);

var _sourceDataSelector = require('../source-data-selector');

var _sourceDataSelector2 = _interopRequireDefault(_sourceDataSelector);

var _visConfigSwitch = require('./vis-config-switch');

var _visConfigSwitch2 = _interopRequireDefault(_visConfigSwitch);

var _visConfigSlider = require('./vis-config-slider');

var _visConfigSlider2 = _interopRequireDefault(_visConfigSlider);

var _layerConfigGroup = require('./layer-config-group');

var _layerConfigGroup2 = _interopRequireDefault(_layerConfigGroup);

var _layerFactory = require('../../../keplergl-layers/layer-factory');

var _utils = require('../../../utils/utils');

var _defaultSettings = require('../../../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  layer: _propTypes2.default.object.isRequired,
  datasets: _propTypes2.default.object.isRequired,
  openModal: _propTypes2.default.func.isRequired,
  updateLayerConfig: _propTypes2.default.func.isRequired,
  updateLayerType: _propTypes2.default.func.isRequired,
  updateLayerVisConfig: _propTypes2.default.func.isRequired,
  updateLayerVisualChannelConfig: _propTypes2.default.func.isRequired
};

var StyledLayerConfigurator = _styledComponents2.default.div.attrs({
  className: 'layer-panel__config'
})(_templateObject);

var StyledLayerVisualConfigurator = _styledComponents2.default.div.attrs({
  className: 'layer-panel__config__visualC-config'
})(_templateObject);

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
      StyledLayerVisualConfigurator,
      null,
      _react2.default.createElement(
        _layerConfigGroup2.default,
        { label: 'color' },
        layer.config.colorField ? _react2.default.createElement(ColorRangeConfig, visConfiguratorProps) : _react2.default.createElement(LayerColorSelector, layerConfiguratorProps),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.color
        }, layerChannelConfigProps)),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps))
      ),
      _react2.default.createElement(
        _layerConfigGroup2.default,
        { label: 'radius' },
        !layer.config.sizeField ? _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.radius, visConfiguratorProps, {
          label: false,
          disabled: Boolean(layer.config.sizeField)
        })) : _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.radiusRange, visConfiguratorProps, {
          disabled: !layer.config.sizeField || layer.config.visConfig.fixedRadius
        })),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.size
        }, layerChannelConfigProps)),
        layer.config.sizeField ? _react2.default.createElement(_visConfigSwitch2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.fixedRadius, visConfiguratorProps, {
          disabled: !layer.config.sizeField
        })) : null
      ),
      layer.type === _defaultSettings.LAYER_TYPES.point ? _react2.default.createElement(
        _layerConfigGroup2.default,
        (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.outline, visConfiguratorProps),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.thickness, visConfiguratorProps, {
          label: false,
          disabled: !layer.config.visConfig.outline
        }))
      ) : null,
      _react2.default.createElement(_layerConfigGroup2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS['hi-precision'], visConfiguratorProps))
    );
  };

  LayerConfigurator.prototype._renderClusterLayerConfig = function _renderClusterLayerConfig(_ref2) {
    var layer = _ref2.layer,
        visConfiguratorProps = _ref2.visConfiguratorProps,
        layerConfiguratorProps = _ref2.layerConfiguratorProps,
        layerChannelConfigProps = _ref2.layerChannelConfigProps;

    return _react2.default.createElement(
      StyledLayerVisualConfigurator,
      null,
      _react2.default.createElement(
        _layerConfigGroup2.default,
        { label: 'color' },
        _react2.default.createElement(ColorRangeConfig, visConfiguratorProps),
        _react2.default.createElement(AggrColorScaleSelector, layerConfiguratorProps),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.color
        }, layerChannelConfigProps)),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps))
      ),
      _react2.default.createElement(
        _layerConfigGroup2.default,
        { label: 'radius' },
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.clusterRadius, visConfiguratorProps)),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.clusterRadiusRange, visConfiguratorProps))
      ),
      _react2.default.createElement(
        _layerConfigGroup2.default,
        { label: 'aggregation' },
        _react2.default.createElement(AggregationTypeSelector, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.aggregation, visConfiguratorProps, {
          field: layer.config.colorField
        }))
      )
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
      StyledLayerVisualConfigurator,
      null,
      _react2.default.createElement(
        _layerConfigGroup2.default,
        { label: 'color' },
        _react2.default.createElement(ColorRangeConfig, visConfiguratorProps),
        _react2.default.createElement(AggrColorScaleSelector, layerConfiguratorProps),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.color
        }, layerChannelConfigProps)),
        _react2.default.createElement(AggregationTypeSelector, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.aggregation, visConfiguratorProps, {
          descreiption: colorByDescription,
          field: colorField
        })),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.percentile, visConfiguratorProps)),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps))
      ),
      _react2.default.createElement(
        _layerConfigGroup2.default,
        { label: 'radius' },
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.worldUnitSize, visConfiguratorProps, {
          label: (type === _defaultSettings.LAYER_TYPES.grid ? 'Grid Size' : 'Hexagon Radius') + ' (km)'
        })),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.coverage, visConfiguratorProps))
      ),
      _react2.default.createElement(
        _layerConfigGroup2.default,
        (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.enable3d, visConfiguratorProps),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.elevationScale, visConfiguratorProps)),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({}, layerChannelConfigProps, {
          channel: layer.visualChannels.size,
          description: elevationByDescription,
          disabled: !enable3d
        })),
        _react2.default.createElement(AggregationTypeSelector, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.aggregation, visConfiguratorProps, {
          property: 'sizeAggregation',
          field: sizeField
        })),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.percentile, visConfiguratorProps, {
          property: 'elevationPercentile',
          disabled: !enable3d || !colorField && !sizeField
        }))
      ),
      _react2.default.createElement(_layerConfigGroup2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS['hi-precision'], visConfiguratorProps))
    );
  };

  LayerConfigurator.prototype._renderHexagonIdLayerConfig = function _renderHexagonIdLayerConfig(_ref4) {
    var layer = _ref4.layer,
        visConfiguratorProps = _ref4.visConfiguratorProps,
        layerConfiguratorProps = _ref4.layerConfiguratorProps,
        layerChannelConfigProps = _ref4.layerChannelConfigProps;

    return _react2.default.createElement(
      StyledLayerVisualConfigurator,
      null,
      _react2.default.createElement(
        _layerConfigGroup2.default,
        { label: 'color' },
        layer.config.colorField ? _react2.default.createElement(ColorRangeConfig, visConfiguratorProps) : _react2.default.createElement(LayerColorSelector, layerConfiguratorProps),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.color
        }, layerChannelConfigProps)),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps))
      ),
      _react2.default.createElement(
        _layerConfigGroup2.default,
        (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.enable3d, visConfiguratorProps),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.size
        }, layerChannelConfigProps)),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.elevationRange, visConfiguratorProps))
      ),
      _react2.default.createElement(_layerConfigGroup2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS['hi-precision'], visConfiguratorProps))
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
      StyledLayerVisualConfigurator,
      null,
      _react2.default.createElement(
        _layerConfigGroup2.default,
        { label: 'color' },
        layer.config.colorField ? _react2.default.createElement(ColorRangeConfig, visConfiguratorProps) : _react2.default.createElement(ArcLayerColorSelector, {
          layer: layer,
          onChangeConfig: layerConfiguratorProps.onChange,
          onChangeVisConfig: visConfiguratorProps.onChange
        }),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.color
        }, layerChannelConfigProps)),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps))
      ),
      _react2.default.createElement(
        _layerConfigGroup2.default,
        { label: 'stroke' },
        layer.config.sizeField ? _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.strokeWidthRange, visConfiguratorProps, {
          disabled: !layer.config.sizeField
        })) : _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.thickness, visConfiguratorProps)),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.size
        }, layerChannelConfigProps))
      ),
      _react2.default.createElement(_layerConfigGroup2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS['hi-precision'], visConfiguratorProps))
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
      StyledLayerVisualConfigurator,
      null,
      _react2.default.createElement(
        _layerConfigGroup2.default,
        { label: 'color' },
        featureTypes.polygon ? _react2.default.createElement(_visConfigSwitch2.default, (0, _extends3.default)({}, visConfiguratorProps, _layerFactory.LAYER_VIS_CONFIGS.filled)) : null,
        layer.config.colorField ? _react2.default.createElement(ColorRangeConfig, visConfiguratorProps) : _react2.default.createElement(LayerColorSelector, layerConfiguratorProps),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.color
        }, layerChannelConfigProps)),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps))
      ),
      featureTypes.line || featureTypes.polygon && visConfig.stroked ? _react2.default.createElement(
        _layerConfigGroup2.default,
        (0, _extends3.default)({
          label: 'stroke'
        }, visConfiguratorProps, featureTypes.polygon ? _layerFactory.LAYER_VIS_CONFIGS.stroked : {}),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.thickness, visConfiguratorProps)),
          _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
            channel: layer.visualChannels.size
          }, layerChannelConfigProps)),
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.strokeWidthRange, visConfiguratorProps, {
            disabled: !layer.config.sizeField
          }))
        )
      ) : null,
      featureTypes.polygon && visConfig.filled ? _react2.default.createElement(
        _layerConfigGroup2.default,
        (0, _extends3.default)({}, visConfiguratorProps, _layerFactory.LAYER_VIS_CONFIGS.enable3d),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.elevationScale, visConfiguratorProps)),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.height
        }, layerChannelConfigProps)),
        _react2.default.createElement(_visConfigSwitch2.default, (0, _extends3.default)({}, visConfiguratorProps, _layerFactory.LAYER_VIS_CONFIGS.wireframe))
      ) : null,
      featureTypes.point ? _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.radius, visConfiguratorProps, {
          label: 'Point Radius',
          disabled: Boolean(layer.config.radiusField)
        })),
        _react2.default.createElement(ChannelByValueSelector, (0, _extends3.default)({
          channel: layer.visualChannels.radius
        }, layerChannelConfigProps)),
        _react2.default.createElement(_visConfigSlider2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS.radiusRange, visConfiguratorProps, {
          disabled: !layer.config.radiusField
        }))
      ) : null,
      _react2.default.createElement(_layerConfigGroup2.default, (0, _extends3.default)({}, _layerFactory.LAYER_VIS_CONFIGS['hi-precision'], visConfiguratorProps))
    );
  };

  LayerConfigurator.prototype.render = function render() {
    var _props = this.props,
        layer = _props.layer,
        datasets = _props.datasets,
        updateLayerConfig = _props.updateLayerConfig;

    var _ref7 = layer.config.dataId ? datasets[layer.config.dataId] : {},
        _ref7$fields = _ref7.fields,
        fields = _ref7$fields === undefined ? [] : _ref7$fields,
        fieldPairs = _ref7.fieldPairs;

    var config = layer.config;


    var commonConfigProp = {
      layer: layer,
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
      StyledLayerConfigurator,
      null,
      _react2.default.createElement(
        _layerConfigGroup2.default,
        { label: 'basic' },
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
        })
      ),
      this[renderTemplate] && this[renderTemplate]({
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

var LayerColorSelector = function LayerColorSelector(_ref8) {
  var layer = _ref8.layer,
      onChange = _ref8.onChange,
      label = _ref8.label;
  return _react2.default.createElement(
    _styledComponents3.SidePanelSection,
    { disabled: layer.config.colorField },
    _react2.default.createElement(_colorSelector2.default, {
      colorSets: [{
        selectedColor: layer.config.color,
        setColor: function setColor(rgbValue) {
          return onChange({ color: rgbValue });
        }
      }]
    })
  );
};

var ArcLayerColorSelector = function ArcLayerColorSelector(_ref9) {
  var layer = _ref9.layer,
      onChangeConfig = _ref9.onChangeConfig,
      onChangeVisConfig = _ref9.onChangeVisConfig;
  return _react2.default.createElement(
    _styledComponents3.SidePanelSection,
    null,
    _react2.default.createElement(_colorSelector2.default, {
      colorSets: [{
        selectedColor: layer.config.color,
        setColor: function setColor(rgbValue) {
          return onChangeConfig({ color: rgbValue });
        },
        label: 'Source'
      }, {
        selectedColor: layer.config.visConfig.targetColor || layer.config.color,
        setColor: function setColor(rgbValue) {
          return onChangeVisConfig({ targetColor: rgbValue });
        },
        label: 'Target'
      }]
    })
  );
};

var ColorRangeConfig = function ColorRangeConfig(_ref10) {
  var layer = _ref10.layer,
      onChange = _ref10.onChange;
  return _react2.default.createElement(
    _styledComponents3.SidePanelSection,
    null,
    _react2.default.createElement(_colorSelector2.default, {
      colorSets: [{
        selectedColor: layer.config.visConfig.colorRange,
        isRange: true,
        setColor: function setColor(colorRange) {
          return onChange({ colorRange: colorRange });
        }
      }]
    })
  );
};

var ChannelByValueSelector = function ChannelByValueSelector(_ref11) {
  var layer = _ref11.layer,
      channel = _ref11.channel,
      onChange = _ref11.onChange,
      fields = _ref11.fields,
      description = _ref11.description;
  var channelScaleType = channel.channelScaleType,
      domain = channel.domain,
      field = channel.field,
      key = channel.key,
      property = channel.property,
      range = channel.range,
      scale = channel.scale;

  var supportedFieldTypes = _defaultSettings.CHANNEL_SCALE_SUPPORTED_FIELDS[channelScaleType];
  var supportedFields = fields.filter(function (_ref12) {
    var type = _ref12.type;
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
    key: key + '-channel-selector',
    property: property,
    range: layer.config.visConfig[range],
    scaleOptions: scaleOptions,
    scaleType: layer.config[scale],
    selectedField: layer.config[field],
    showScale: showScale,
    updateField: function updateField(val) {
      var _onChange;

      return onChange((_onChange = {}, _onChange[field] = val, _onChange), key);
    },
    updateScale: function updateScale(val) {
      var _onChange2;

      return onChange((_onChange2 = {}, _onChange2[scale] = val, _onChange2), key);
    }
  });
};

var AggrColorScaleSelector = function AggrColorScaleSelector(_ref13) {
  var config = _ref13.layer.config,
      onChange = _ref13.onChange;
  return _react2.default.createElement(_dimensionScaleSelector2.default, {
    label: 'Color Scale',
    options: config.colorField ? _defaultSettings.FIELD_OPTS[config.colorField.type].scale.colorAggr : _defaultSettings.FIELD_OPTS.integer.scale.colorAggr,
    scaleType: config.colorScale,
    onSelect: function onSelect(val) {
      return onChange({ colorScale: val }, 'color');
    }
  });
};

var AggregationTypeSelector = function AggregationTypeSelector(_ref14) {
  var visConfig = _ref14.layer.config.visConfig,
      field = _ref14.field,
      property = _ref14.property,
      options = _ref14.options,
      _onChange4 = _ref14.onChange;
  return _react2.default.createElement(
    _styledComponents3.SidePanelSection,
    null,
    _react2.default.createElement(
      _styledComponents3.PanelLabel,
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
        var _onChange3;

        return _onChange4((_onChange3 = {}, _onChange3[property] = value, _onChange3));
      }
    })
  );
};
/* eslint-enable max-params */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29uZmlndXJhdG9yLmpzIl0sIm5hbWVzIjpbInByb3BUeXBlcyIsImxheWVyIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImRhdGFzZXRzIiwib3Blbk1vZGFsIiwiZnVuYyIsInVwZGF0ZUxheWVyQ29uZmlnIiwidXBkYXRlTGF5ZXJUeXBlIiwidXBkYXRlTGF5ZXJWaXNDb25maWciLCJ1cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWciLCJTdHlsZWRMYXllckNvbmZpZ3VyYXRvciIsImRpdiIsImF0dHJzIiwiY2xhc3NOYW1lIiwiU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3IiLCJMYXllckNvbmZpZ3VyYXRvciIsIl9yZW5kZXJQb2ludExheWVyQ29uZmlnIiwicHJvcHMiLCJfcmVuZGVyU2NhdHRlcnBsb3RMYXllckNvbmZpZyIsIl9yZW5kZXJJY29uTGF5ZXJDb25maWciLCJ2aXNDb25maWd1cmF0b3JQcm9wcyIsImxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzIiwibGF5ZXJDb25maWd1cmF0b3JQcm9wcyIsImNvbmZpZyIsImNvbG9yRmllbGQiLCJ2aXN1YWxDaGFubmVscyIsImNvbG9yIiwib3BhY2l0eSIsInNpemVGaWVsZCIsInJhZGl1cyIsIkJvb2xlYW4iLCJyYWRpdXNSYW5nZSIsInZpc0NvbmZpZyIsImZpeGVkUmFkaXVzIiwic2l6ZSIsInR5cGUiLCJwb2ludCIsIm91dGxpbmUiLCJ0aGlja25lc3MiLCJfcmVuZGVyQ2x1c3RlckxheWVyQ29uZmlnIiwiY2x1c3RlclJhZGl1cyIsImNsdXN0ZXJSYWRpdXNSYW5nZSIsImFnZ3JlZ2F0aW9uIiwiX3JlbmRlckdyaWRMYXllckNvbmZpZyIsIl9yZW5kZXJBZ2dyZWdhdGlvbkxheWVyQ29uZmlnIiwiX3JlbmRlckhleGFnb25MYXllckNvbmZpZyIsImVuYWJsZTNkIiwiZWxldmF0aW9uQnlEZXNjcmlwdGlvbiIsImNvbG9yQnlEZXNjcmlwdGlvbiIsInBlcmNlbnRpbGUiLCJ3b3JsZFVuaXRTaXplIiwiZ3JpZCIsImNvdmVyYWdlIiwiZWxldmF0aW9uU2NhbGUiLCJfcmVuZGVySGV4YWdvbklkTGF5ZXJDb25maWciLCJlbGV2YXRpb25SYW5nZSIsIl9yZW5kZXJBcmNMYXllckNvbmZpZyIsImFyZ3MiLCJfcmVuZGVyTGluZUxheWVyQ29uZmlnIiwib25DaGFuZ2UiLCJzdHJva2VXaWR0aFJhbmdlIiwiX3JlbmRlckdlb2pzb25MYXllckNvbmZpZyIsIm1ldGEiLCJmZWF0dXJlVHlwZXMiLCJwb2x5Z29uIiwiZmlsbGVkIiwibGluZSIsInN0cm9rZWQiLCJoZWlnaHQiLCJ3aXJlZnJhbWUiLCJyYWRpdXNGaWVsZCIsInJlbmRlciIsImRhdGFJZCIsImZpZWxkcyIsImZpZWxkUGFpcnMiLCJjb21tb25Db25maWdQcm9wIiwicmVuZGVyVGVtcGxhdGUiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiaWQiLCJ0eWVwIiwiY29sdW1ucyIsInZhbHVlIiwiTGF5ZXJDb2xvclNlbGVjdG9yIiwibGFiZWwiLCJzZWxlY3RlZENvbG9yIiwic2V0Q29sb3IiLCJyZ2JWYWx1ZSIsIkFyY0xheWVyQ29sb3JTZWxlY3RvciIsIm9uQ2hhbmdlQ29uZmlnIiwib25DaGFuZ2VWaXNDb25maWciLCJ0YXJnZXRDb2xvciIsIkNvbG9yUmFuZ2VDb25maWciLCJjb2xvclJhbmdlIiwiaXNSYW5nZSIsIkNoYW5uZWxCeVZhbHVlU2VsZWN0b3IiLCJjaGFubmVsIiwiZGVzY3JpcHRpb24iLCJjaGFubmVsU2NhbGVUeXBlIiwiZG9tYWluIiwiZmllbGQiLCJrZXkiLCJwcm9wZXJ0eSIsInJhbmdlIiwic2NhbGUiLCJzdXBwb3J0ZWRGaWVsZFR5cGVzIiwic3VwcG9ydGVkRmllbGRzIiwiZmlsdGVyIiwiaW5jbHVkZXMiLCJzZWxlY3RlZEZpZWxkIiwic2NhbGVPcHRpb25zIiwic2hvd1NjYWxlIiwiaXNBZ2dyZWdhdGVkIiwiZGVmYXVsdERlc2NyaXB0aW9uIiwidmFsIiwiQWdnckNvbG9yU2NhbGVTZWxlY3RvciIsImNvbG9yQWdnciIsImludGVnZXIiLCJjb2xvclNjYWxlIiwiQWdncmVnYXRpb25UeXBlU2VsZWN0b3IiLCJvcHRpb25zIiwibmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFJQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFFQTs7QUFFQTs7OztBQU1BLElBQU1BLFlBQVk7QUFDaEJDLFNBQU8sb0JBQVVDLE1BQVYsQ0FBaUJDLFVBRFI7QUFFaEJDLFlBQVUsb0JBQVVGLE1BQVYsQ0FBaUJDLFVBRlg7QUFHaEJFLGFBQVcsb0JBQVVDLElBQVYsQ0FBZUgsVUFIVjtBQUloQkkscUJBQW1CLG9CQUFVRCxJQUFWLENBQWVILFVBSmxCO0FBS2hCSyxtQkFBaUIsb0JBQVVGLElBQVYsQ0FBZUgsVUFMaEI7QUFNaEJNLHdCQUFzQixvQkFBVUgsSUFBVixDQUFlSCxVQU5yQjtBQU9oQk8sa0NBQWdDLG9CQUFVSixJQUFWLENBQWVIO0FBUC9CLENBQWxCOztBQVVBLElBQU1RLDBCQUEwQiwyQkFBT0MsR0FBUCxDQUFXQyxLQUFYLENBQWlCO0FBQy9DQyxhQUFXO0FBRG9DLENBQWpCLENBQTFCLGlCQUFOOztBQU1BLElBQU1DLGdDQUFnQywyQkFBT0gsR0FBUCxDQUFXQyxLQUFYLENBQWlCO0FBQ3JEQyxhQUFXO0FBRDBDLENBQWpCLENBQWhDLGlCQUFOOztJQU1xQkUsaUI7Ozs7Ozs7OzhCQUNuQkMsdUIsb0NBQXdCQyxLLEVBQU87QUFDN0IsV0FBTyxLQUFLQyw2QkFBTCxDQUFtQ0QsS0FBbkMsQ0FBUDtBQUNELEc7OzhCQUVERSxzQixtQ0FBdUJGLEssRUFBTztBQUM1QixXQUFPLEtBQUtDLDZCQUFMLENBQW1DRCxLQUFu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cEI7QUFRRSxjQUFVO0FBQUEsYUFBTzVELFNBQVMsRUFBQzRELFlBQVlKLEdBQWIsRUFBVCxFQUE0QixPQUE1QixDQUFQO0FBQUE7QUFSWixJQUQ2QjtBQUFBLENBQS9COztBQWFBLElBQU1LLDBCQUEwQixTQUExQkEsdUJBQTBCO0FBQUEsTUFDYnhGLFNBRGEsVUFDOUJoQyxLQUQ4QixDQUN0QnVCLE1BRHNCLENBQ2JTLFNBRGE7QUFBQSxNQUU5QnFFLEtBRjhCLFVBRTlCQSxLQUY4QjtBQUFBLE1BRzlCRSxRQUg4QixVQUc5QkEsUUFIOEI7QUFBQSxNQUk5QmtCLE9BSjhCLFVBSTlCQSxPQUo4QjtBQUFBLE1BSzlCOUQsVUFMOEIsVUFLOUJBLFFBTDhCO0FBQUEsU0FPOUI7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQUEsc0JBQTBCMEMsUUFBUUEsTUFBTXFCLElBQWQsR0FBcUIsRUFBL0M7QUFBQSxLQURGO0FBRUU7QUFDRSxnQkFBVSxDQUFDckIsS0FEYjtBQUVFLHFCQUFlckUsVUFBVXVFLFFBQVYsQ0FGakI7QUFHRSxlQUFTa0IsT0FIWDtBQUlFLG1CQUFhLEtBSmY7QUFLRSxrQkFBWSxLQUxkO0FBTUUsZ0JBQVU7QUFBQTs7QUFBQSxlQUFTOUQsd0NBQVc0QyxRQUFYLElBQXNCcEIsS0FBdEIsY0FBVDtBQUFBO0FBTlo7QUFGRixHQVA4QjtBQUFBLENBQWhDO0FBbUJBIiwiZmlsZSI6ImxheWVyLWNvbmZpZ3VyYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQge1xuICBQYW5lbExhYmVsLFxuICBTaWRlUGFuZWxTZWN0aW9uXG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBJdGVtU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaXRlbS1zZWxlY3Rvci9pdGVtLXNlbGVjdG9yJztcblxuaW1wb3J0IFZpc0NvbmZpZ0J5RmllbGRTZWxlY3RvciBmcm9tICcuL3Zpcy1jb25maWctYnktZmllbGQtc2VsZWN0b3InO1xuaW1wb3J0IExheWVyQ29sdW1uQ29uZmlnIGZyb20gJy4vbGF5ZXItY29sdW1uLWNvbmZpZyc7XG5pbXBvcnQgRGltZW5zaW9uU2NhbGVTZWxlY3RvciBmcm9tICcuL2RpbWVuc2lvbi1zY2FsZS1zZWxlY3Rvcic7XG5pbXBvcnQgQ29sb3JTZWxlY3RvciBmcm9tICcuL2NvbG9yLXNlbGVjdG9yJztcbmltcG9ydCBTb3VyY2VEYXRhU2VsZWN0b3IgZnJvbSAnLi4vc291cmNlLWRhdGEtc2VsZWN0b3InO1xuaW1wb3J0IFZpc0NvbmZpZ1N3aXRjaCBmcm9tICcuL3Zpcy1jb25maWctc3dpdGNoJztcbmltcG9ydCBWaXNDb25maWdTbGlkZXIgZnJvbSAnLi92aXMtY29uZmlnLXNsaWRlcic7XG5pbXBvcnQgTGF5ZXJDb25maWdHcm91cCBmcm9tICcuL2xheWVyLWNvbmZpZy1ncm91cCc7XG5cbmltcG9ydCB7TEFZRVJfVklTX0NPTkZJR1N9IGZyb20gJ2tlcGxlcmdsLWxheWVycy9sYXllci1mYWN0b3J5JztcblxuaW1wb3J0IHtjYXBpdGFsaXplRmlyc3RMZXR0ZXJ9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuaW1wb3J0IHtcbiAgRklFTERfT1BUUyxcbiAgTEFZRVJfVFlQRVMsXG4gIENIQU5ORUxfU0NBTEVfU1VQUE9SVEVEX0ZJRUxEU1xufSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgbGF5ZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgb3Blbk1vZGFsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB1cGRhdGVMYXllckNvbmZpZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgdXBkYXRlTGF5ZXJUeXBlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB1cGRhdGVMYXllclZpc0NvbmZpZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgdXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBTdHlsZWRMYXllckNvbmZpZ3VyYXRvciA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdsYXllci1wYW5lbF9fY29uZmlnJ1xufSlgXG4gIG1hcmdpbi10b3A6IDEycHg7XG5gO1xuXG5jb25zdCBTdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvciA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdsYXllci1wYW5lbF9fY29uZmlnX192aXN1YWxDLWNvbmZpZydcbn0pYFxuICBtYXJnaW4tdG9wOiAxMnB4O1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXJDb25maWd1cmF0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICBfcmVuZGVyUG9pbnRMYXllckNvbmZpZyhwcm9wcykge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJTY2F0dGVycGxvdExheWVyQ29uZmlnKHByb3BzKTtcbiAgfVxuXG4gIF9yZW5kZXJJY29uTGF5ZXJDb25maWcocHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyU2NhdHRlcnBsb3RMYXllckNvbmZpZyhwcm9wcyk7XG4gIH1cblxuICBfcmVuZGVyU2NhdHRlcnBsb3RMYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wc1xuICB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICAgICAgey8qIENvbG9yICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2NvbG9yJ30+XG4gICAgICAgICAge2xheWVyLmNvbmZpZy5jb2xvckZpZWxkID8gKFxuICAgICAgICAgICAgPENvbG9yUmFuZ2VDb25maWcgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8TGF5ZXJDb2xvclNlbGVjdG9yIHsuLi5sYXllckNvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm9wYWNpdHl9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuXG4gICAgICAgIHsvKiBSYWRpdXMgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsncmFkaXVzJ30+XG4gICAgICAgICAgeyFsYXllci5jb25maWcuc2l6ZUZpZWxkID8gKFxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MucmFkaXVzfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGxhYmVsPXtmYWxzZX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e0Jvb2xlYW4obGF5ZXIuY29uZmlnLnNpemVGaWVsZCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5yYWRpdXNSYW5nZX1cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17XG4gICAgICAgICAgICAgICAgIWxheWVyLmNvbmZpZy5zaXplRmllbGQgfHwgbGF5ZXIuY29uZmlnLnZpc0NvbmZpZy5maXhlZFJhZGl1c1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7bGF5ZXIuY29uZmlnLnNpemVGaWVsZCA/IChcbiAgICAgICAgICAgIDxWaXNDb25maWdTd2l0Y2hcbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmZpeGVkUmFkaXVzfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXIuY29uZmlnLnNpemVGaWVsZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICB7Lyogb3V0bGluZSAqL31cbiAgICAgICAge2xheWVyLnR5cGUgPT09IExBWUVSX1RZUEVTLnBvaW50ID8gKFxuICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3V0bGluZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy50aGlja25lc3N9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgbGFiZWw9e2ZhbHNlfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyLmNvbmZpZy52aXNDb25maWcub3V0bGluZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAgey8qIGhpZ2ggcHJlY2lzaW9uICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHU1snaGktcHJlY2lzaW9uJ119XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAvPlxuICAgICAgPC9TdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlckNsdXN0ZXJMYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICAgICAgey8qIENvbG9yICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2NvbG9yJ30+XG4gICAgICAgICAgPENvbG9yUmFuZ2VDb25maWcgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgIDxBZ2dyQ29sb3JTY2FsZVNlbGVjdG9yIHsuLi5sYXllckNvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5vcGFjaXR5fVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICB7LyogQ2x1c3RlciBSYWRpdXMgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsncmFkaXVzJ30+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmNsdXN0ZXJSYWRpdXN9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuY2x1c3RlclJhZGl1c1JhbmdlfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAgey8qIEFnZ3JlZ2F0aW9uIFR5cGUgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnYWdncmVnYXRpb24nfT5cbiAgICAgICAgICA8QWdncmVnYXRpb25UeXBlU2VsZWN0b3JcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5hZ2dyZWdhdGlvbn1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIGZpZWxkPXtsYXllci5jb25maWcuY29sb3JGaWVsZH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICA8L1N0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICk7XG4gIH1cblxuICBfcmVuZGVyR3JpZExheWVyQ29uZmlnKHByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlckFnZ3JlZ2F0aW9uTGF5ZXJDb25maWcocHJvcHMpO1xuICB9XG5cbiAgX3JlbmRlckhleGFnb25MYXllckNvbmZpZyhwcm9wcykge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJBZ2dyZWdhdGlvbkxheWVyQ29uZmlnKHByb3BzKTtcbiAgfVxuXG4gIF9yZW5kZXJBZ2dyZWdhdGlvbkxheWVyQ29uZmlnKHtcbiAgICBsYXllcixcbiAgICB2aXNDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzXG4gIH0pIHtcbiAgICBjb25zdCB7dHlwZSwgY29uZmlnfSA9IGxheWVyO1xuICAgIGNvbnN0IHt2aXNDb25maWc6IHtlbmFibGUzZH0sIGNvbG9yRmllbGQsIHNpemVGaWVsZH0gPSBjb25maWc7XG4gICAgY29uc3QgZWxldmF0aW9uQnlEZXNjcmlwdGlvbiA9XG4gICAgICAnV2hlbiBvZmYsIGhlaWdodCBpcyBiYXNlZCBvbiBjb3VudCBvZiBwb2ludHMnO1xuICAgIGNvbnN0IGNvbG9yQnlEZXNjcmlwdGlvbiA9ICdXaGVuIG9mZiwgY29sb3IgaXMgYmFzZWQgb24gY291bnQgb2YgcG9pbnRzJztcblxuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICAgIHsvKiBDb2xvciAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydjb2xvcid9PlxuICAgICAgICAgIDxDb2xvclJhbmdlQ29uZmlnIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICA8QWdnckNvbG9yU2NhbGVTZWxlY3RvciB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuY29sb3J9XG4gICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8QWdncmVnYXRpb25UeXBlU2VsZWN0b3JcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5hZ2dyZWdhdGlvbn1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIGRlc2NyZWlwdGlvbj17Y29sb3JCeURlc2NyaXB0aW9ufVxuICAgICAgICAgICAgZmllbGQ9e2NvbG9yRmllbGR9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MucGVyY2VudGlsZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5vcGFjaXR5fVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICB7LyogQ2VsbCBzaXplICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J3JhZGl1cyd9PlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy53b3JsZFVuaXRTaXplfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgbGFiZWw9e2Ake1xuICAgICAgICAgICAgICB0eXBlID09PSBMQVlFUl9UWVBFUy5ncmlkID8gJ0dyaWQgU2l6ZScgOiAnSGV4YWdvbiBSYWRpdXMnXG4gICAgICAgICAgICB9IChrbSlgfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmNvdmVyYWdlfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICB7LyogRWxldmF0aW9uICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5lbmFibGUzZH1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgID5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZWxldmF0aW9uU2NhbGV9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZX1cbiAgICAgICAgICAgIGRlc2NyaXB0aW9uPXtlbGV2YXRpb25CeURlc2NyaXB0aW9ufVxuICAgICAgICAgICAgZGlzYWJsZWQ9eyFlbmFibGUzZH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxBZ2dyZWdhdGlvblR5cGVTZWxlY3RvclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmFnZ3JlZ2F0aW9ufVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgcHJvcGVydHk9eydzaXplQWdncmVnYXRpb24nfVxuICAgICAgICAgICAgZmllbGQ9e3NpemVGaWVsZH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5wZXJjZW50aWxlfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgcHJvcGVydHk9eydlbGV2YXRpb25QZXJjZW50aWxlJ31cbiAgICAgICAgICAgIGRpc2FibGVkPXshZW5hYmxlM2QgfHwgKCFjb2xvckZpZWxkICYmICFzaXplRmllbGQpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1NbJ2hpLXByZWNpc2lvbiddfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgLz5cbiAgICAgIDwvU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgKTtcbiAgfVxuXG4gIF9yZW5kZXJIZXhhZ29uSWRMYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICAgICAgey8qIENvbG9yICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2NvbG9yJ30+XG4gICAgICAgICAge2xheWVyLmNvbmZpZy5jb2xvckZpZWxkID8gKFxuICAgICAgICAgICAgPENvbG9yUmFuZ2VDb25maWcgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8TGF5ZXJDb2xvclNlbGVjdG9yIHsuLi5sYXllckNvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm9wYWNpdHl9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICB7LyogaGVpZ2h0ICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5lbmFibGUzZH1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgID5cbiAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZX1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5lbGV2YXRpb25SYW5nZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgIHsvKiBoaWdoIHByZWNpc2lvbiAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1NbJ2hpLXByZWNpc2lvbiddfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgLz5cbiAgICAgIDwvU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgKTtcbiAgfVxuXG4gIF9yZW5kZXJBcmNMYXllckNvbmZpZyhhcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlckxpbmVMYXllckNvbmZpZyhhcmdzKTtcbiAgfVxuXG4gIF9yZW5kZXJMaW5lTGF5ZXJDb25maWcoe1xuICAgIGxheWVyLFxuICAgIHZpc0NvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHNcbiAgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICAgIHsvKiBDb2xvciAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydjb2xvcid9PlxuICAgICAgICAgIHtsYXllci5jb25maWcuY29sb3JGaWVsZCA/IChcbiAgICAgICAgICAgIDxDb2xvclJhbmdlQ29uZmlnIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPEFyY0xheWVyQ29sb3JTZWxlY3RvclxuICAgICAgICAgICAgICBsYXllcj17bGF5ZXJ9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlQ29uZmlnPXtsYXllckNvbmZpZ3VyYXRvclByb3BzLm9uQ2hhbmdlfVxuICAgICAgICAgICAgICBvbkNoYW5nZVZpc0NvbmZpZz17dmlzQ29uZmlndXJhdG9yUHJvcHMub25DaGFuZ2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm9wYWNpdHl9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuXG4gICAgICAgIHsvKiB0aGlja25lc3MgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnc3Ryb2tlJ30+XG4gICAgICAgICAge2xheWVyLmNvbmZpZy5zaXplRmllbGQgPyAoXG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5zdHJva2VXaWR0aFJhbmdlfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXIuY29uZmlnLnNpemVGaWVsZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnRoaWNrbmVzc31cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5zaXplfVxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICB7LyogaGlnaCBwcmVjaXNpb24gKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTWydoaS1wcmVjaXNpb24nXX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICA8L1N0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICk7XG4gIH1cblxuICBfcmVuZGVyR2VvanNvbkxheWVyQ29uZmlnKHtcbiAgICBsYXllcixcbiAgICB2aXNDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzXG4gIH0pIHtcbiAgICBjb25zdCB7bWV0YToge2ZlYXR1cmVUeXBlcyA9IHt9fSwgY29uZmlnOiB7dmlzQ29uZmlnfX0gPSBsYXllcjtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICAgIHsvKiBDb2xvciBCeSAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydjb2xvcid9PlxuICAgICAgICAgIHtmZWF0dXJlVHlwZXMucG9seWdvbiA/IChcbiAgICAgICAgICAgIDxWaXNDb25maWdTd2l0Y2hcbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZmlsbGVkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgIHtsYXllci5jb25maWcuY29sb3JGaWVsZCA/IChcbiAgICAgICAgICAgIDxDb2xvclJhbmdlQ29uZmlnIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPExheWVyQ29sb3JTZWxlY3RvciB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgIC8+XG5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3BhY2l0eX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgey8qIFN0cm9rZSBXaWR0aCAqL31cbiAgICAgICAge2ZlYXR1cmVUeXBlcy5saW5lIHx8IChmZWF0dXJlVHlwZXMucG9seWdvbiAmJiB2aXNDb25maWcuc3Ryb2tlZCkgPyAoXG4gICAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICAgIGxhYmVsPVwic3Ryb2tlXCJcbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIHsuLi4oZmVhdHVyZVR5cGVzLnBvbHlnb24gPyBMQVlFUl9WSVNfQ09ORklHUy5zdHJva2VkIDoge30pfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MudGhpY2tuZXNzfVxuICAgICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5zaXplfVxuICAgICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5zdHJva2VXaWR0aFJhbmdlfVxuICAgICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyLmNvbmZpZy5zaXplRmllbGR9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHsvKiBFbGV2YXRpb24gKi99XG4gICAgICAgIHtmZWF0dXJlVHlwZXMucG9seWdvbiAmJiB2aXNDb25maWcuZmlsbGVkID8gKFxuICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwXG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZW5hYmxlM2R9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZWxldmF0aW9uU2NhbGV9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5oZWlnaHR9XG4gICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU3dpdGNoXG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLndpcmVmcmFtZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICB7LyogUmFkaXVzICovfVxuICAgICAgICB7ZmVhdHVyZVR5cGVzLnBvaW50ID8gKFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5yYWRpdXN9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgbGFiZWw9XCJQb2ludCBSYWRpdXNcIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17Qm9vbGVhbihsYXllci5jb25maWcucmFkaXVzRmllbGQpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnJhZGl1c31cbiAgICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnJhZGl1c1JhbmdlfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXIuY29uZmlnLnJhZGl1c0ZpZWxkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgey8qIGhpZ2ggcHJlY2lzaW9uICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHU1snaGktcHJlY2lzaW9uJ119XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAvPlxuICAgICAgPC9TdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtsYXllciwgZGF0YXNldHMsIHVwZGF0ZUxheWVyQ29uZmlnfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2ZpZWxkcyA9IFtdLCBmaWVsZFBhaXJzfSA9IGxheWVyLmNvbmZpZy5kYXRhSWRcbiAgICAgID8gZGF0YXNldHNbbGF5ZXIuY29uZmlnLmRhdGFJZF1cbiAgICAgIDoge307XG4gICAgY29uc3Qge2NvbmZpZ30gPSBsYXllcjtcblxuICAgIGNvbnN0IGNvbW1vbkNvbmZpZ1Byb3AgPSB7XG4gICAgICBsYXllcixcbiAgICAgIGZpZWxkc1xuICAgIH07XG5cbiAgICBjb25zdCB2aXNDb25maWd1cmF0b3JQcm9wcyA9IHtcbiAgICAgIC4uLmNvbW1vbkNvbmZpZ1Byb3AsXG4gICAgICBvbkNoYW5nZTogdGhpcy5wcm9wcy51cGRhdGVMYXllclZpc0NvbmZpZ1xuICAgIH07XG5cbiAgICBjb25zdCBsYXllckNvbmZpZ3VyYXRvclByb3BzID0ge1xuICAgICAgLi4uY29tbW9uQ29uZmlnUHJvcCxcbiAgICAgIG9uQ2hhbmdlOiB1cGRhdGVMYXllckNvbmZpZ1xuICAgIH07XG5cbiAgICBjb25zdCBsYXllckNoYW5uZWxDb25maWdQcm9wcyA9IHtcbiAgICAgIC4uLmNvbW1vbkNvbmZpZ1Byb3AsXG4gICAgICBvbkNoYW5nZTogdGhpcy5wcm9wcy51cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWdcbiAgICB9O1xuXG4gICAgY29uc3QgcmVuZGVyVGVtcGxhdGUgPVxuICAgICAgbGF5ZXIudHlwZSAmJiBgX3JlbmRlciR7Y2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGxheWVyLnR5cGUpfUxheWVyQ29uZmlnYDtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkTGF5ZXJDb25maWd1cmF0b3I+XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnYmFzaWMnfT5cbiAgICAgICAgICB7T2JqZWN0LmtleXMoZGF0YXNldHMpLmxlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgICAgPFNvdXJjZURhdGFTZWxlY3RvclxuICAgICAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgICAgIGlkPXtsYXllci5pZH1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2xheWVyLnR5ZXAgJiYgY29uZmlnLmNvbHVtbnN9XG4gICAgICAgICAgICAgIGRhdGFJZD17Y29uZmlnLmRhdGFJZH1cbiAgICAgICAgICAgICAgb25TZWxlY3Q9e3ZhbHVlID0+IHVwZGF0ZUxheWVyQ29uZmlnKHtkYXRhSWQ6IHZhbHVlfSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPExheWVyQ29sdW1uQ29uZmlnXG4gICAgICAgICAgICBsYXllcj17bGF5ZXJ9XG4gICAgICAgICAgICBmaWVsZHM9e2ZpZWxkc31cbiAgICAgICAgICAgIGZpZWxkUGFpcnM9e2ZpZWxkUGFpcnN9XG4gICAgICAgICAgICB1cGRhdGVMYXllckNvbmZpZz17dXBkYXRlTGF5ZXJDb25maWd9XG4gICAgICAgICAgICB1cGRhdGVMYXllclR5cGU9e3RoaXMucHJvcHMudXBkYXRlTGF5ZXJUeXBlfVxuICAgICAgICAgICAgb3Blbk1vZGFsPXt0aGlzLnByb3BzLm9wZW5Nb2RhbH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgIHt0aGlzW3JlbmRlclRlbXBsYXRlXSAmJlxuICAgICAgICAgIHRoaXNbcmVuZGVyVGVtcGxhdGVdKHtcbiAgICAgICAgICAgIGxheWVyLFxuICAgICAgICAgICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgICAgICAgICBsYXllckNoYW5uZWxDb25maWdQcm9wcyxcbiAgICAgICAgICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHNcbiAgICAgICAgICB9KX1cbiAgICAgIDwvU3R5bGVkTGF5ZXJDb25maWd1cmF0b3I+XG4gICAgKTtcbiAgfVxufVxuXG5MYXllckNvbmZpZ3VyYXRvci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbi8qXG4gKiBDb21wb25lbnRpemUgY29uZmlnIGNvbXBvbmVudCBpbnRvIHB1cmUgZnVuY3Rpb25hbCBjb21wb25lbnRzXG4gKi9cblxuY29uc3QgTGF5ZXJDb2xvclNlbGVjdG9yID0gKHtsYXllciwgb25DaGFuZ2UsIGxhYmVsfSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbiBkaXNhYmxlZD17bGF5ZXIuY29uZmlnLmNvbG9yRmllbGR9PlxuICAgIDxDb2xvclNlbGVjdG9yXG4gICAgICBjb2xvclNldHM9e1tcbiAgICAgICAge1xuICAgICAgICAgIHNlbGVjdGVkQ29sb3I6IGxheWVyLmNvbmZpZy5jb2xvcixcbiAgICAgICAgICBzZXRDb2xvcjogcmdiVmFsdWUgPT4gb25DaGFuZ2Uoe2NvbG9yOiByZ2JWYWx1ZX0pXG4gICAgICAgIH1cbiAgICAgIF19XG4gICAgLz5cbiAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuKTtcblxuY29uc3QgQXJjTGF5ZXJDb2xvclNlbGVjdG9yID0gKHtsYXllciwgb25DaGFuZ2VDb25maWcsIG9uQ2hhbmdlVmlzQ29uZmlnfSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICA8Q29sb3JTZWxlY3RvclxuICAgICAgY29sb3JTZXRzPXtbXG4gICAgICAgIHtcbiAgICAgICAgICBzZWxlY3RlZENvbG9yOiBsYXllci5jb25maWcuY29sb3IsXG4gICAgICAgICAgc2V0Q29sb3I6IHJnYlZhbHVlID0+IG9uQ2hhbmdlQ29uZmlnKHtjb2xvcjogcmdiVmFsdWV9KSxcbiAgICAgICAgICBsYWJlbDogJ1NvdXJjZSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNlbGVjdGVkQ29sb3I6XG4gICAgICAgICAgICBsYXllci5jb25maWcudmlzQ29uZmlnLnRhcmdldENvbG9yIHx8IGxheWVyLmNvbmZpZy5jb2xvcixcbiAgICAgICAgICBzZXRDb2xvcjogcmdiVmFsdWUgPT4gb25DaGFuZ2VWaXNDb25maWcoe3RhcmdldENvbG9yOiByZ2JWYWx1ZX0pLFxuICAgICAgICAgIGxhYmVsOiAnVGFyZ2V0J1xuICAgICAgICB9XG4gICAgICBdfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbmNvbnN0IENvbG9yUmFuZ2VDb25maWcgPSAoe2xheWVyLCBvbkNoYW5nZX0pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgPENvbG9yU2VsZWN0b3JcbiAgICAgIGNvbG9yU2V0cz17W1xuICAgICAgICB7XG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcjogbGF5ZXIuY29uZmlnLnZpc0NvbmZpZy5jb2xvclJhbmdlLFxuICAgICAgICAgIGlzUmFuZ2U6IHRydWUsXG4gICAgICAgICAgc2V0Q29sb3I6IGNvbG9yUmFuZ2UgPT4gb25DaGFuZ2Uoe2NvbG9yUmFuZ2V9KVxuICAgICAgICB9XG4gICAgICBdfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbmNvbnN0IENoYW5uZWxCeVZhbHVlU2VsZWN0b3IgPSAoe1xuICBsYXllcixcbiAgY2hhbm5lbCxcbiAgb25DaGFuZ2UsXG4gIGZpZWxkcyxcbiAgZGVzY3JpcHRpb25cbn0pID0+IHtcbiAgY29uc3Qge1xuICAgIGNoYW5uZWxTY2FsZVR5cGUsXG4gICAgZG9tYWluLFxuICAgIGZpZWxkLFxuICAgIGtleSxcbiAgICBwcm9wZXJ0eSxcbiAgICByYW5nZSxcbiAgICBzY2FsZVxuICB9ID0gY2hhbm5lbDtcbiAgY29uc3Qgc3VwcG9ydGVkRmllbGRUeXBlcyA9IENIQU5ORUxfU0NBTEVfU1VQUE9SVEVEX0ZJRUxEU1tjaGFubmVsU2NhbGVUeXBlXTtcbiAgY29uc3Qgc3VwcG9ydGVkRmllbGRzID0gZmllbGRzLmZpbHRlcigoe3R5cGV9KSA9PlxuICAgIHN1cHBvcnRlZEZpZWxkVHlwZXMuaW5jbHVkZXModHlwZSlcbiAgKTtcbiAgY29uc3Qgc2VsZWN0ZWRGaWVsZCA9IGxheWVyLmNvbmZpZ1tmaWVsZF07XG4gIGNvbnN0IHNjYWxlT3B0aW9ucyA9XG4gICAgKHNlbGVjdGVkRmllbGQgJiYgRklFTERfT1BUU1tzZWxlY3RlZEZpZWxkLnR5cGVdLnNjYWxlW2NoYW5uZWxTY2FsZVR5cGVdKSB8fFxuICAgIFtdO1xuICBjb25zdCBzaG93U2NhbGUgPSAhbGF5ZXIuaXNBZ2dyZWdhdGVkICYmIHNjYWxlT3B0aW9ucy5sZW5ndGggPiAxO1xuICBjb25zdCBkZWZhdWx0RGVzY3JpcHRpb24gPSBgQ2FsY3VsYXRlICR7cHJvcGVydHl9IGJhc2VkIG9uIHNlbGVjdGVkIGZpZWxkYDtcblxuICByZXR1cm4gKFxuICAgIDxWaXNDb25maWdCeUZpZWxkU2VsZWN0b3JcbiAgICAgIGNoYW5uZWw9e2NoYW5uZWwua2V5fVxuICAgICAgZGVzY3JpcHRpb249e2Rlc2NyaXB0aW9uIHx8IGRlZmF1bHREZXNjcmlwdGlvbn1cbiAgICAgIGRvbWFpbj17bGF5ZXIuY29uZmlnW2RvbWFpbl19XG4gICAgICBmaWVsZHM9e3N1cHBvcnRlZEZpZWxkc31cbiAgICAgIGlkPXtsYXllci5pZH1cbiAgICAgIGtleT17YCR7a2V5fS1jaGFubmVsLXNlbGVjdG9yYH1cbiAgICAgIHByb3BlcnR5PXtwcm9wZXJ0eX1cbiAgICAgIHJhbmdlPXtsYXllci5jb25maWcudmlzQ29uZmlnW3JhbmdlXX1cbiAgICAgIHNjYWxlT3B0aW9ucz17c2NhbGVPcHRpb25zfVxuICAgICAgc2NhbGVUeXBlPXtsYXllci5jb25maWdbc2NhbGVdfVxuICAgICAgc2VsZWN0ZWRGaWVsZD17bGF5ZXIuY29uZmlnW2ZpZWxkXX1cbiAgICAgIHNob3dTY2FsZT17c2hvd1NjYWxlfVxuICAgICAgdXBkYXRlRmllbGQ9e3ZhbCA9PiBvbkNoYW5nZSh7W2ZpZWxkXTogdmFsfSwga2V5KX1cbiAgICAgIHVwZGF0ZVNjYWxlPXt2YWwgPT4gb25DaGFuZ2Uoe1tzY2FsZV06IHZhbH0sIGtleSl9XG4gICAgLz5cbiAgKTtcbn07XG5cbmNvbnN0IEFnZ3JDb2xvclNjYWxlU2VsZWN0b3IgPSAoe2xheWVyOiB7Y29uZmlnfSwgb25DaGFuZ2V9KSA9PiAoXG4gIDxEaW1lbnNpb25TY2FsZVNlbGVjdG9yXG4gICAgbGFiZWw9XCJDb2xvciBTY2FsZVwiXG4gICAgb3B0aW9ucz17XG4gICAgICBjb25maWcuY29sb3JGaWVsZFxuICAgICAgICA/IEZJRUxEX09QVFNbY29uZmlnLmNvbG9yRmllbGQudHlwZV0uc2NhbGUuY29sb3JBZ2dyXG4gICAgICAgIDogRklFTERfT1BUUy5pbnRlZ2VyLnNjYWxlLmNvbG9yQWdnclxuICAgIH1cbiAgICBzY2FsZVR5cGU9e2NvbmZpZy5jb2xvclNjYWxlfVxuICAgIG9uU2VsZWN0PXt2YWwgPT4gb25DaGFuZ2Uoe2NvbG9yU2NhbGU6IHZhbH0sICdjb2xvcicpfVxuICAvPlxuKTtcblxuY29uc3QgQWdncmVnYXRpb25UeXBlU2VsZWN0b3IgPSAoe1xuICBsYXllcjoge2NvbmZpZzoge3Zpc0NvbmZpZ319LFxuICBmaWVsZCxcbiAgcHJvcGVydHksXG4gIG9wdGlvbnMsXG4gIG9uQ2hhbmdlXG59KSA9PiAoXG4gIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgIDxQYW5lbExhYmVsPntgQWdncmVnYXRlICR7ZmllbGQgPyBmaWVsZC5uYW1lIDogJyd9IGJ5YH08L1BhbmVsTGFiZWw+XG4gICAgPEl0ZW1TZWxlY3RvclxuICAgICAgZGlzYWJsZWQ9eyFmaWVsZH1cbiAgICAgIHNlbGVjdGVkSXRlbXM9e3Zpc0NvbmZpZ1twcm9wZXJ0eV19XG4gICAgICBvcHRpb25zPXtvcHRpb25zfVxuICAgICAgbXVsdGlTZWxlY3Q9e2ZhbHNlfVxuICAgICAgc2VhcmNoYWJsZT17ZmFsc2V9XG4gICAgICBvbkNoYW5nZT17dmFsdWUgPT4gb25DaGFuZ2Uoe1twcm9wZXJ0eV06IHZhbHVlfSl9XG4gICAgLz5cbiAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuKTtcbi8qIGVzbGludC1lbmFibGUgbWF4LXBhcmFtcyAqL1xuIl19