'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  margin-top: 12px;\n'], ['\n  margin-top: 12px;\n']);

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
    return (0, _possibleConstructorReturn3.default)(this, (LayerConfigurator.__proto__ || Object.getPrototypeOf(LayerConfigurator)).apply(this, arguments));
  }

  (0, _createClass3.default)(LayerConfigurator, [{
    key: '_renderPointLayerConfig',
    value: function _renderPointLayerConfig(props) {
      return this._renderScatterplotLayerConfig(props);
    }
  }, {
    key: '_renderIconLayerConfig',
    value: function _renderIconLayerConfig(props) {
      return this._renderScatterplotLayerConfig(props);
    }
  }, {
    key: '_renderScatterplotLayerConfig',
    value: function _renderScatterplotLayerConfig(_ref) {
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
    }
  }, {
    key: '_renderClusterLayerConfig',
    value: function _renderClusterLayerConfig(_ref2) {
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
    }
  }, {
    key: '_renderGridLayerConfig',
    value: function _renderGridLayerConfig(props) {
      return this._renderAggregationLayerConfig(props);
    }
  }, {
    key: '_renderHexagonLayerConfig',
    value: function _renderHexagonLayerConfig(props) {
      return this._renderAggregationLayerConfig(props);
    }
  }, {
    key: '_renderAggregationLayerConfig',
    value: function _renderAggregationLayerConfig(_ref3) {
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
    }
  }, {
    key: '_renderHexagonIdLayerConfig',
    value: function _renderHexagonIdLayerConfig(_ref4) {
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
    }
  }, {
    key: '_renderArcLayerConfig',
    value: function _renderArcLayerConfig(args) {
      return this._renderLineLayerConfig(args);
    }
  }, {
    key: '_renderLineLayerConfig',
    value: function _renderLineLayerConfig(_ref5) {
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
    }
  }, {
    key: '_renderGeojsonLayerConfig',
    value: function _renderGeojsonLayerConfig(_ref6) {
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
    }
  }, {
    key: 'render',
    value: function render() {
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
    }
  }]);
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
      return onChange((0, _defineProperty3.default)({}, field, val), key);
    },
    updateScale: function updateScale(val) {
      return onChange((0, _defineProperty3.default)({}, scale, val), key);
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
        return _onChange4((0, _defineProperty3.default)({}, property, value));
      }
    })
  );
};
/* eslint-enable max-params */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29uZmlndXJhdG9yLmpzIl0sIm5hbWVzIjpbInByb3BUeXBlcyIsImxheWVyIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImRhdGFzZXRzIiwib3Blbk1vZGFsIiwiZnVuYyIsInVwZGF0ZUxheWVyQ29uZmlnIiwidXBkYXRlTGF5ZXJUeXBlIiwidXBkYXRlTGF5ZXJWaXNDb25maWciLCJ1cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWciLCJTdHlsZWRMYXllckNvbmZpZ3VyYXRvciIsImRpdiIsImF0dHJzIiwiY2xhc3NOYW1lIiwiU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3IiLCJMYXllckNvbmZpZ3VyYXRvciIsInByb3BzIiwiX3JlbmRlclNjYXR0ZXJwbG90TGF5ZXJDb25maWciLCJ2aXNDb25maWd1cmF0b3JQcm9wcyIsImxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzIiwibGF5ZXJDb25maWd1cmF0b3JQcm9wcyIsImNvbmZpZyIsImNvbG9yRmllbGQiLCJ2aXN1YWxDaGFubmVscyIsImNvbG9yIiwib3BhY2l0eSIsInNpemVGaWVsZCIsInJhZGl1cyIsIkJvb2xlYW4iLCJyYWRpdXNSYW5nZSIsInZpc0NvbmZpZyIsImZpeGVkUmFkaXVzIiwic2l6ZSIsInR5cGUiLCJwb2ludCIsIm91dGxpbmUiLCJ0aGlja25lc3MiLCJjbHVzdGVyUmFkaXVzIiwiY2x1c3RlclJhZGl1c1JhbmdlIiwiYWdncmVnYXRpb24iLCJfcmVuZGVyQWdncmVnYXRpb25MYXllckNvbmZpZyIsImVuYWJsZTNkIiwiZWxldmF0aW9uQnlEZXNjcmlwdGlvbiIsImNvbG9yQnlEZXNjcmlwdGlvbiIsInBlcmNlbnRpbGUiLCJ3b3JsZFVuaXRTaXplIiwiZ3JpZCIsImNvdmVyYWdlIiwiZWxldmF0aW9uU2NhbGUiLCJlbGV2YXRpb25SYW5nZSIsImFyZ3MiLCJfcmVuZGVyTGluZUxheWVyQ29uZmlnIiwib25DaGFuZ2UiLCJzdHJva2VXaWR0aFJhbmdlIiwibWV0YSIsImZlYXR1cmVUeXBlcyIsInBvbHlnb24iLCJmaWxsZWQiLCJsaW5lIiwic3Ryb2tlZCIsImhlaWdodCIsIndpcmVmcmFtZSIsInJhZGl1c0ZpZWxkIiwiZGF0YUlkIiwiZmllbGRzIiwiZmllbGRQYWlycyIsImNvbW1vbkNvbmZpZ1Byb3AiLCJyZW5kZXJUZW1wbGF0ZSIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJpZCIsInR5ZXAiLCJjb2x1bW5zIiwidmFsdWUiLCJMYXllckNvbG9yU2VsZWN0b3IiLCJsYWJlbCIsInNlbGVjdGVkQ29sb3IiLCJzZXRDb2xvciIsInJnYlZhbHVlIiwiQXJjTGF5ZXJDb2xvclNlbGVjdG9yIiwib25DaGFuZ2VDb25maWciLCJvbkNoYW5nZVZpc0NvbmZpZyIsInRhcmdldENvbG9yIiwiQ29sb3JSYW5nZUNvbmZpZyIsImNvbG9yUmFuZ2UiLCJpc1JhbmdlIiwiQ2hhbm5lbEJ5VmFsdWVTZWxlY3RvciIsImNoYW5uZWwiLCJkZXNjcmlwdGlvbiIsImNoYW5uZWxTY2FsZVR5cGUiLCJkb21haW4iLCJmaWVsZCIsImtleSIsInByb3BlcnR5IiwicmFuZ2UiLCJzY2FsZSIsInN1cHBvcnRlZEZpZWxkVHlwZXMiLCJzdXBwb3J0ZWRGaWVsZHMiLCJmaWx0ZXIiLCJpbmNsdWRlcyIsInNlbGVjdGVkRmllbGQiLCJzY2FsZU9wdGlvbnMiLCJzaG93U2NhbGUiLCJpc0FnZ3JlZ2F0ZWQiLCJkZWZhdWx0RGVzY3JpcHRpb24iLCJ2YWwiLCJBZ2dyQ29sb3JTY2FsZVNlbGVjdG9yIiwiY29sb3JBZ2dyIiwiaW50ZWdlciIsImNvbG9yU2NhbGUiLCJBZ2dyZWdhdGlvblR5cGVTZWxlY3RvciIsIm9wdGlvbnMiLCJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBSUE7Ozs7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QVFBLE1BQU1xQixJQUFkLEdBQXFCLEVBQS9DO0FBQUEsS0FERjtBQUVFO0FBQ0UsZ0JBQVUsQ0FBQ3JCLEtBRGI7QUFFRSxxQkFBZTlELFVBQVVnRSxRQUFWLENBRmpCO0FBR0UsZUFBU2tCLE9BSFg7QUFJRSxtQkFBYSxLQUpmO0FBS0Usa0JBQVksS0FMZDtBQU1FLGdCQUFVO0FBQUEsZUFBUzVELDZDQUFXMEMsUUFBWCxFQUFzQnBCLEtBQXRCLEVBQVQ7QUFBQTtBQU5aO0FBRkYsR0FQOEI7QUFBQSxDQUFoQztBQW1CQSIsImZpbGUiOiJsYXllci1jb25maWd1cmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IHtcbiAgUGFuZWxMYWJlbCxcbiAgU2lkZVBhbmVsU2VjdGlvblxufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgSXRlbVNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2l0ZW0tc2VsZWN0b3IvaXRlbS1zZWxlY3Rvcic7XG5cbmltcG9ydCBWaXNDb25maWdCeUZpZWxkU2VsZWN0b3IgZnJvbSAnLi92aXMtY29uZmlnLWJ5LWZpZWxkLXNlbGVjdG9yJztcbmltcG9ydCBMYXllckNvbHVtbkNvbmZpZyBmcm9tICcuL2xheWVyLWNvbHVtbi1jb25maWcnO1xuaW1wb3J0IERpbWVuc2lvblNjYWxlU2VsZWN0b3IgZnJvbSAnLi9kaW1lbnNpb24tc2NhbGUtc2VsZWN0b3InO1xuaW1wb3J0IENvbG9yU2VsZWN0b3IgZnJvbSAnLi9jb2xvci1zZWxlY3Rvcic7XG5pbXBvcnQgU291cmNlRGF0YVNlbGVjdG9yIGZyb20gJy4uL3NvdXJjZS1kYXRhLXNlbGVjdG9yJztcbmltcG9ydCBWaXNDb25maWdTd2l0Y2ggZnJvbSAnLi92aXMtY29uZmlnLXN3aXRjaCc7XG5pbXBvcnQgVmlzQ29uZmlnU2xpZGVyIGZyb20gJy4vdmlzLWNvbmZpZy1zbGlkZXInO1xuaW1wb3J0IExheWVyQ29uZmlnR3JvdXAgZnJvbSAnLi9sYXllci1jb25maWctZ3JvdXAnO1xuXG5pbXBvcnQge0xBWUVSX1ZJU19DT05GSUdTfSBmcm9tICdrZXBsZXJnbC1sYXllcnMvbGF5ZXItZmFjdG9yeSc7XG5cbmltcG9ydCB7Y2FwaXRhbGl6ZUZpcnN0TGV0dGVyfSBmcm9tICd1dGlscy91dGlscyc7XG5cbmltcG9ydCB7XG4gIEZJRUxEX09QVFMsXG4gIExBWUVSX1RZUEVTLFxuICBDSEFOTkVMX1NDQUxFX1NVUFBPUlRFRF9GSUVMRFNcbn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGxheWVyOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGRhdGFzZXRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIG9wZW5Nb2RhbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgdXBkYXRlTGF5ZXJDb25maWc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHVwZGF0ZUxheWVyVHlwZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgdXBkYXRlTGF5ZXJWaXNDb25maWc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgU3R5bGVkTGF5ZXJDb25maWd1cmF0b3IgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnbGF5ZXItcGFuZWxfX2NvbmZpZydcbn0pYFxuICBtYXJnaW4tdG9wOiAxMnB4O1xuYDtcblxuY29uc3QgU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3IgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnbGF5ZXItcGFuZWxfX2NvbmZpZ19fdmlzdWFsQy1jb25maWcnXG59KWBcbiAgbWFyZ2luLXRvcDogMTJweDtcbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyQ29uZmlndXJhdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgX3JlbmRlclBvaW50TGF5ZXJDb25maWcocHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyU2NhdHRlcnBsb3RMYXllckNvbmZpZyhwcm9wcyk7XG4gIH1cblxuICBfcmVuZGVySWNvbkxheWVyQ29uZmlnKHByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlclNjYXR0ZXJwbG90TGF5ZXJDb25maWcocHJvcHMpO1xuICB9XG5cbiAgX3JlbmRlclNjYXR0ZXJwbG90TGF5ZXJDb25maWcoe1xuICAgIGxheWVyLFxuICAgIHZpc0NvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzLFxuICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHNcbiAgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICAgIHsvKiBDb2xvciAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydjb2xvcid9PlxuICAgICAgICAgIHtsYXllci5jb25maWcuY29sb3JGaWVsZCA/IChcbiAgICAgICAgICAgIDxDb2xvclJhbmdlQ29uZmlnIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPExheWVyQ29sb3JTZWxlY3RvciB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5vcGFjaXR5fVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICB7LyogUmFkaXVzICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J3JhZGl1cyd9PlxuICAgICAgICAgIHshbGF5ZXIuY29uZmlnLnNpemVGaWVsZCA/IChcbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnJhZGl1c31cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICBsYWJlbD17ZmFsc2V9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtCb29sZWFuKGxheWVyLmNvbmZpZy5zaXplRmllbGQpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MucmFkaXVzUmFuZ2V9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e1xuICAgICAgICAgICAgICAgICFsYXllci5jb25maWcuc2l6ZUZpZWxkIHx8IGxheWVyLmNvbmZpZy52aXNDb25maWcuZml4ZWRSYWRpdXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5zaXplfVxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgICAge2xheWVyLmNvbmZpZy5zaXplRmllbGQgPyAoXG4gICAgICAgICAgICA8VmlzQ29uZmlnU3dpdGNoXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5maXhlZFJhZGl1c31cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyLmNvbmZpZy5zaXplRmllbGR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgey8qIG91dGxpbmUgKi99XG4gICAgICAgIHtsYXllci50eXBlID09PSBMQVlFUl9UWVBFUy5wb2ludCA/IChcbiAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm91dGxpbmV9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MudGhpY2tuZXNzfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGxhYmVsPXtmYWxzZX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFsYXllci5jb25maWcudmlzQ29uZmlnLm91dGxpbmV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIHsvKiBoaWdoIHByZWNpc2lvbiAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1NbJ2hpLXByZWNpc2lvbiddfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgLz5cbiAgICAgIDwvU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgKTtcbiAgfVxuXG4gIF9yZW5kZXJDbHVzdGVyTGF5ZXJDb25maWcoe1xuICAgIGxheWVyLFxuICAgIHZpc0NvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHNcbiAgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICAgIHsvKiBDb2xvciAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydjb2xvcid9PlxuICAgICAgICAgIDxDb2xvclJhbmdlQ29uZmlnIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICA8QWdnckNvbG9yU2NhbGVTZWxlY3RvciB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuY29sb3J9XG4gICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3BhY2l0eX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgey8qIENsdXN0ZXIgUmFkaXVzICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J3JhZGl1cyd9PlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5jbHVzdGVyUmFkaXVzfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmNsdXN0ZXJSYWRpdXNSYW5nZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgIHsvKiBBZ2dyZWdhdGlvbiBUeXBlICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2FnZ3JlZ2F0aW9uJ30+XG4gICAgICAgICAgPEFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuYWdncmVnYXRpb259XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICBmaWVsZD17bGF5ZXIuY29uZmlnLmNvbG9yRmllbGR9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgPC9TdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlckdyaWRMYXllckNvbmZpZyhwcm9wcykge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJBZ2dyZWdhdGlvbkxheWVyQ29uZmlnKHByb3BzKTtcbiAgfVxuXG4gIF9yZW5kZXJIZXhhZ29uTGF5ZXJDb25maWcocHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyQWdncmVnYXRpb25MYXllckNvbmZpZyhwcm9wcyk7XG4gIH1cblxuICBfcmVuZGVyQWdncmVnYXRpb25MYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICB9KSB7XG4gICAgY29uc3Qge3R5cGUsIGNvbmZpZ30gPSBsYXllcjtcbiAgICBjb25zdCB7dmlzQ29uZmlnOiB7ZW5hYmxlM2R9LCBjb2xvckZpZWxkLCBzaXplRmllbGR9ID0gY29uZmlnO1xuICAgIGNvbnN0IGVsZXZhdGlvbkJ5RGVzY3JpcHRpb24gPVxuICAgICAgJ1doZW4gb2ZmLCBoZWlnaHQgaXMgYmFzZWQgb24gY291bnQgb2YgcG9pbnRzJztcbiAgICBjb25zdCBjb2xvckJ5RGVzY3JpcHRpb24gPSAnV2hlbiBvZmYsIGNvbG9yIGlzIGJhc2VkIG9uIGNvdW50IG9mIHBvaW50cyc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICAgICB7LyogQ29sb3IgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnY29sb3InfT5cbiAgICAgICAgICA8Q29sb3JSYW5nZUNvbmZpZyB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgPEFnZ3JDb2xvclNjYWxlU2VsZWN0b3Igey4uLmxheWVyQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuYWdncmVnYXRpb259XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICBkZXNjcmVpcHRpb249e2NvbG9yQnlEZXNjcmlwdGlvbn1cbiAgICAgICAgICAgIGZpZWxkPXtjb2xvckZpZWxkfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnBlcmNlbnRpbGV9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3BhY2l0eX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgey8qIENlbGwgc2l6ZSAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydyYWRpdXMnfT5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mud29ybGRVbml0U2l6ZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIGxhYmVsPXtgJHtcbiAgICAgICAgICAgICAgdHlwZSA9PT0gTEFZRVJfVFlQRVMuZ3JpZCA/ICdHcmlkIFNpemUnIDogJ0hleGFnb24gUmFkaXVzJ1xuICAgICAgICAgICAgfSAoa20pYH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5jb3ZlcmFnZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgey8qIEVsZXZhdGlvbiAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZW5hYmxlM2R9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICA+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmVsZXZhdGlvblNjYWxlfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgICBkZXNjcmlwdGlvbj17ZWxldmF0aW9uQnlEZXNjcmlwdGlvbn1cbiAgICAgICAgICAgIGRpc2FibGVkPXshZW5hYmxlM2R9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8QWdncmVnYXRpb25UeXBlU2VsZWN0b3JcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5hZ2dyZWdhdGlvbn1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIHByb3BlcnR5PXsnc2l6ZUFnZ3JlZ2F0aW9uJ31cbiAgICAgICAgICAgIGZpZWxkPXtzaXplRmllbGR9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MucGVyY2VudGlsZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIHByb3BlcnR5PXsnZWxldmF0aW9uUGVyY2VudGlsZSd9XG4gICAgICAgICAgICBkaXNhYmxlZD17IWVuYWJsZTNkIHx8ICghY29sb3JGaWVsZCAmJiAhc2l6ZUZpZWxkKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTWydoaS1wcmVjaXNpb24nXX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICA8L1N0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICk7XG4gIH1cblxuICBfcmVuZGVySGV4YWdvbklkTGF5ZXJDb25maWcoe1xuICAgIGxheWVyLFxuICAgIHZpc0NvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHNcbiAgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICAgIHsvKiBDb2xvciAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydjb2xvcid9PlxuICAgICAgICAgIHtsYXllci5jb25maWcuY29sb3JGaWVsZCA/IChcbiAgICAgICAgICAgIDxDb2xvclJhbmdlQ29uZmlnIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPExheWVyQ29sb3JTZWxlY3RvciB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5vcGFjaXR5fVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAgey8qIGhlaWdodCAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZW5hYmxlM2R9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICA+XG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZWxldmF0aW9uUmFuZ2V9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICB7LyogaGlnaCBwcmVjaXNpb24gKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTWydoaS1wcmVjaXNpb24nXX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICA8L1N0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICk7XG4gIH1cblxuICBfcmVuZGVyQXJjTGF5ZXJDb25maWcoYXJncykge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJMaW5lTGF5ZXJDb25maWcoYXJncyk7XG4gIH1cblxuICBfcmVuZGVyTGluZUxheWVyQ29uZmlnKHtcbiAgICBsYXllcixcbiAgICB2aXNDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzXG4gIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICAgICB7LyogQ29sb3IgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnY29sb3InfT5cbiAgICAgICAgICB7bGF5ZXIuY29uZmlnLmNvbG9yRmllbGQgPyAoXG4gICAgICAgICAgICA8Q29sb3JSYW5nZUNvbmZpZyB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxBcmNMYXllckNvbG9yU2VsZWN0b3JcbiAgICAgICAgICAgICAgbGF5ZXI9e2xheWVyfVxuICAgICAgICAgICAgICBvbkNoYW5nZUNvbmZpZz17bGF5ZXJDb25maWd1cmF0b3JQcm9wcy5vbkNoYW5nZX1cbiAgICAgICAgICAgICAgb25DaGFuZ2VWaXNDb25maWc9e3Zpc0NvbmZpZ3VyYXRvclByb3BzLm9uQ2hhbmdlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5vcGFjaXR5fVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICB7LyogdGhpY2tuZXNzICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J3N0cm9rZSd9PlxuICAgICAgICAgIHtsYXllci5jb25maWcuc2l6ZUZpZWxkID8gKFxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Muc3Ryb2tlV2lkdGhSYW5nZX1cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyLmNvbmZpZy5zaXplRmllbGR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy50aGlja25lc3N9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZX1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgey8qIGhpZ2ggcHJlY2lzaW9uICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHU1snaGktcHJlY2lzaW9uJ119XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAvPlxuICAgICAgPC9TdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlckdlb2pzb25MYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICB9KSB7XG4gICAgY29uc3Qge21ldGE6IHtmZWF0dXJlVHlwZXMgPSB7fX0sIGNvbmZpZzoge3Zpc0NvbmZpZ319ID0gbGF5ZXI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICAgICB7LyogQ29sb3IgQnkgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnY29sb3InfT5cbiAgICAgICAgICB7ZmVhdHVyZVR5cGVzLnBvbHlnb24gPyAoXG4gICAgICAgICAgICA8VmlzQ29uZmlnU3dpdGNoXG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmZpbGxlZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgICB7bGF5ZXIuY29uZmlnLmNvbG9yRmllbGQgPyAoXG4gICAgICAgICAgICA8Q29sb3JSYW5nZUNvbmZpZyB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxMYXllckNvbG9yU2VsZWN0b3Igey4uLmxheWVyQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuXG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm9wYWNpdHl9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuXG4gICAgICAgIHsvKiBTdHJva2UgV2lkdGggKi99XG4gICAgICAgIHtmZWF0dXJlVHlwZXMubGluZSB8fCAoZmVhdHVyZVR5cGVzLnBvbHlnb24gJiYgdmlzQ29uZmlnLnN0cm9rZWQpID8gKFxuICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwXG4gICAgICAgICAgICBsYWJlbD1cInN0cm9rZVwiXG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICB7Li4uKGZlYXR1cmVUeXBlcy5wb2x5Z29uID8gTEFZRVJfVklTX0NPTkZJR1Muc3Ryb2tlZCA6IHt9KX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnRoaWNrbmVzc31cbiAgICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZX1cbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Muc3Ryb2tlV2lkdGhSYW5nZX1cbiAgICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFsYXllci5jb25maWcuc2l6ZUZpZWxkfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICB7LyogRWxldmF0aW9uICovfVxuICAgICAgICB7ZmVhdHVyZVR5cGVzLnBvbHlnb24gJiYgdmlzQ29uZmlnLmZpbGxlZCA/IChcbiAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmVuYWJsZTNkfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmVsZXZhdGlvblNjYWxlfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuaGVpZ2h0fVxuICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFZpc0NvbmZpZ1N3aXRjaFxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy53aXJlZnJhbWV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgey8qIFJhZGl1cyAqL31cbiAgICAgICAge2ZlYXR1cmVUeXBlcy5wb2ludCA/IChcbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MucmFkaXVzfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGxhYmVsPVwiUG9pbnQgUmFkaXVzXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e0Jvb2xlYW4obGF5ZXIuY29uZmlnLnJhZGl1c0ZpZWxkKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5yYWRpdXN9XG4gICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5yYWRpdXNSYW5nZX1cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyLmNvbmZpZy5yYWRpdXNGaWVsZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHsvKiBoaWdoIHByZWNpc2lvbiAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1NbJ2hpLXByZWNpc2lvbiddfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgLz5cbiAgICAgIDwvU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bGF5ZXIsIGRhdGFzZXRzLCB1cGRhdGVMYXllckNvbmZpZ30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtmaWVsZHMgPSBbXSwgZmllbGRQYWlyc30gPSBsYXllci5jb25maWcuZGF0YUlkXG4gICAgICA/IGRhdGFzZXRzW2xheWVyLmNvbmZpZy5kYXRhSWRdXG4gICAgICA6IHt9O1xuICAgIGNvbnN0IHtjb25maWd9ID0gbGF5ZXI7XG5cbiAgICBjb25zdCBjb21tb25Db25maWdQcm9wID0ge1xuICAgICAgbGF5ZXIsXG4gICAgICBmaWVsZHNcbiAgICB9O1xuXG4gICAgY29uc3QgdmlzQ29uZmlndXJhdG9yUHJvcHMgPSB7XG4gICAgICAuLi5jb21tb25Db25maWdQcm9wLFxuICAgICAgb25DaGFuZ2U6IHRoaXMucHJvcHMudXBkYXRlTGF5ZXJWaXNDb25maWdcbiAgICB9O1xuXG4gICAgY29uc3QgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyA9IHtcbiAgICAgIC4uLmNvbW1vbkNvbmZpZ1Byb3AsXG4gICAgICBvbkNoYW5nZTogdXBkYXRlTGF5ZXJDb25maWdcbiAgICB9O1xuXG4gICAgY29uc3QgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHMgPSB7XG4gICAgICAuLi5jb21tb25Db25maWdQcm9wLFxuICAgICAgb25DaGFuZ2U6IHRoaXMucHJvcHMudXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnXG4gICAgfTtcblxuICAgIGNvbnN0IHJlbmRlclRlbXBsYXRlID1cbiAgICAgIGxheWVyLnR5cGUgJiYgYF9yZW5kZXIke2NhcGl0YWxpemVGaXJzdExldHRlcihsYXllci50eXBlKX1MYXllckNvbmZpZ2A7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZExheWVyQ29uZmlndXJhdG9yPlxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2Jhc2ljJ30+XG4gICAgICAgICAge09iamVjdC5rZXlzKGRhdGFzZXRzKS5sZW5ndGggPiAxICYmIChcbiAgICAgICAgICAgIDxTb3VyY2VEYXRhU2VsZWN0b3JcbiAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICBpZD17bGF5ZXIuaWR9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtsYXllci50eWVwICYmIGNvbmZpZy5jb2x1bW5zfVxuICAgICAgICAgICAgICBkYXRhSWQ9e2NvbmZpZy5kYXRhSWR9XG4gICAgICAgICAgICAgIG9uU2VsZWN0PXt2YWx1ZSA9PiB1cGRhdGVMYXllckNvbmZpZyh7ZGF0YUlkOiB2YWx1ZX0pfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxMYXllckNvbHVtbkNvbmZpZ1xuICAgICAgICAgICAgbGF5ZXI9e2xheWVyfVxuICAgICAgICAgICAgZmllbGRzPXtmaWVsZHN9XG4gICAgICAgICAgICBmaWVsZFBhaXJzPXtmaWVsZFBhaXJzfVxuICAgICAgICAgICAgdXBkYXRlTGF5ZXJDb25maWc9e3VwZGF0ZUxheWVyQ29uZmlnfVxuICAgICAgICAgICAgdXBkYXRlTGF5ZXJUeXBlPXt0aGlzLnByb3BzLnVwZGF0ZUxheWVyVHlwZX1cbiAgICAgICAgICAgIG9wZW5Nb2RhbD17dGhpcy5wcm9wcy5vcGVuTW9kYWx9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICB7dGhpc1tyZW5kZXJUZW1wbGF0ZV0gJiZcbiAgICAgICAgICB0aGlzW3JlbmRlclRlbXBsYXRlXSh7XG4gICAgICAgICAgICBsYXllcixcbiAgICAgICAgICAgIHZpc0NvbmZpZ3VyYXRvclByb3BzLFxuICAgICAgICAgICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHMsXG4gICAgICAgICAgICBsYXllckNvbmZpZ3VyYXRvclByb3BzXG4gICAgICAgICAgfSl9XG4gICAgICA8L1N0eWxlZExheWVyQ29uZmlndXJhdG9yPlxuICAgICk7XG4gIH1cbn1cblxuTGF5ZXJDb25maWd1cmF0b3IucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuXG4vKlxuICogQ29tcG9uZW50aXplIGNvbmZpZyBjb21wb25lbnQgaW50byBwdXJlIGZ1bmN0aW9uYWwgY29tcG9uZW50c1xuICovXG5cbmNvbnN0IExheWVyQ29sb3JTZWxlY3RvciA9ICh7bGF5ZXIsIG9uQ2hhbmdlLCBsYWJlbH0pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24gZGlzYWJsZWQ9e2xheWVyLmNvbmZpZy5jb2xvckZpZWxkfT5cbiAgICA8Q29sb3JTZWxlY3RvclxuICAgICAgY29sb3JTZXRzPXtbXG4gICAgICAgIHtcbiAgICAgICAgICBzZWxlY3RlZENvbG9yOiBsYXllci5jb25maWcuY29sb3IsXG4gICAgICAgICAgc2V0Q29sb3I6IHJnYlZhbHVlID0+IG9uQ2hhbmdlKHtjb2xvcjogcmdiVmFsdWV9KVxuICAgICAgICB9XG4gICAgICBdfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbmNvbnN0IEFyY0xheWVyQ29sb3JTZWxlY3RvciA9ICh7bGF5ZXIsIG9uQ2hhbmdlQ29uZmlnLCBvbkNoYW5nZVZpc0NvbmZpZ30pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgPENvbG9yU2VsZWN0b3JcbiAgICAgIGNvbG9yU2V0cz17W1xuICAgICAgICB7XG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcjogbGF5ZXIuY29uZmlnLmNvbG9yLFxuICAgICAgICAgIHNldENvbG9yOiByZ2JWYWx1ZSA9PiBvbkNoYW5nZUNvbmZpZyh7Y29sb3I6IHJnYlZhbHVlfSksXG4gICAgICAgICAgbGFiZWw6ICdTb3VyY2UnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzZWxlY3RlZENvbG9yOlxuICAgICAgICAgICAgbGF5ZXIuY29uZmlnLnZpc0NvbmZpZy50YXJnZXRDb2xvciB8fCBsYXllci5jb25maWcuY29sb3IsXG4gICAgICAgICAgc2V0Q29sb3I6IHJnYlZhbHVlID0+IG9uQ2hhbmdlVmlzQ29uZmlnKHt0YXJnZXRDb2xvcjogcmdiVmFsdWV9KSxcbiAgICAgICAgICBsYWJlbDogJ1RhcmdldCdcbiAgICAgICAgfVxuICAgICAgXX1cbiAgICAvPlxuICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4pO1xuXG5jb25zdCBDb2xvclJhbmdlQ29uZmlnID0gKHtsYXllciwgb25DaGFuZ2V9KSA9PiAoXG4gIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgIDxDb2xvclNlbGVjdG9yXG4gICAgICBjb2xvclNldHM9e1tcbiAgICAgICAge1xuICAgICAgICAgIHNlbGVjdGVkQ29sb3I6IGxheWVyLmNvbmZpZy52aXNDb25maWcuY29sb3JSYW5nZSxcbiAgICAgICAgICBpc1JhbmdlOiB0cnVlLFxuICAgICAgICAgIHNldENvbG9yOiBjb2xvclJhbmdlID0+IG9uQ2hhbmdlKHtjb2xvclJhbmdlfSlcbiAgICAgICAgfVxuICAgICAgXX1cbiAgICAvPlxuICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4pO1xuXG5jb25zdCBDaGFubmVsQnlWYWx1ZVNlbGVjdG9yID0gKHtcbiAgbGF5ZXIsXG4gIGNoYW5uZWwsXG4gIG9uQ2hhbmdlLFxuICBmaWVsZHMsXG4gIGRlc2NyaXB0aW9uXG59KSA9PiB7XG4gIGNvbnN0IHtcbiAgICBjaGFubmVsU2NhbGVUeXBlLFxuICAgIGRvbWFpbixcbiAgICBmaWVsZCxcbiAgICBrZXksXG4gICAgcHJvcGVydHksXG4gICAgcmFuZ2UsXG4gICAgc2NhbGVcbiAgfSA9IGNoYW5uZWw7XG4gIGNvbnN0IHN1cHBvcnRlZEZpZWxkVHlwZXMgPSBDSEFOTkVMX1NDQUxFX1NVUFBPUlRFRF9GSUVMRFNbY2hhbm5lbFNjYWxlVHlwZV07XG4gIGNvbnN0IHN1cHBvcnRlZEZpZWxkcyA9IGZpZWxkcy5maWx0ZXIoKHt0eXBlfSkgPT5cbiAgICBzdXBwb3J0ZWRGaWVsZFR5cGVzLmluY2x1ZGVzKHR5cGUpXG4gICk7XG4gIGNvbnN0IHNlbGVjdGVkRmllbGQgPSBsYXllci5jb25maWdbZmllbGRdO1xuICBjb25zdCBzY2FsZU9wdGlvbnMgPVxuICAgIChzZWxlY3RlZEZpZWxkICYmIEZJRUxEX09QVFNbc2VsZWN0ZWRGaWVsZC50eXBlXS5zY2FsZVtjaGFubmVsU2NhbGVUeXBlXSkgfHxcbiAgICBbXTtcbiAgY29uc3Qgc2hvd1NjYWxlID0gIWxheWVyLmlzQWdncmVnYXRlZCAmJiBzY2FsZU9wdGlvbnMubGVuZ3RoID4gMTtcbiAgY29uc3QgZGVmYXVsdERlc2NyaXB0aW9uID0gYENhbGN1bGF0ZSAke3Byb3BlcnR5fSBiYXNlZCBvbiBzZWxlY3RlZCBmaWVsZGA7XG5cbiAgcmV0dXJuIChcbiAgICA8VmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yXG4gICAgICBjaGFubmVsPXtjaGFubmVsLmtleX1cbiAgICAgIGRlc2NyaXB0aW9uPXtkZXNjcmlwdGlvbiB8fCBkZWZhdWx0RGVzY3JpcHRpb259XG4gICAgICBkb21haW49e2xheWVyLmNvbmZpZ1tkb21haW5dfVxuICAgICAgZmllbGRzPXtzdXBwb3J0ZWRGaWVsZHN9XG4gICAgICBpZD17bGF5ZXIuaWR9XG4gICAgICBrZXk9e2Ake2tleX0tY2hhbm5lbC1zZWxlY3RvcmB9XG4gICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICByYW5nZT17bGF5ZXIuY29uZmlnLnZpc0NvbmZpZ1tyYW5nZV19XG4gICAgICBzY2FsZU9wdGlvbnM9e3NjYWxlT3B0aW9uc31cbiAgICAgIHNjYWxlVHlwZT17bGF5ZXIuY29uZmlnW3NjYWxlXX1cbiAgICAgIHNlbGVjdGVkRmllbGQ9e2xheWVyLmNvbmZpZ1tmaWVsZF19XG4gICAgICBzaG93U2NhbGU9e3Nob3dTY2FsZX1cbiAgICAgIHVwZGF0ZUZpZWxkPXt2YWwgPT4gb25DaGFuZ2Uoe1tmaWVsZF06IHZhbH0sIGtleSl9XG4gICAgICB1cGRhdGVTY2FsZT17dmFsID0+IG9uQ2hhbmdlKHtbc2NhbGVdOiB2YWx9LCBrZXkpfVxuICAgIC8+XG4gICk7XG59O1xuXG5jb25zdCBBZ2dyQ29sb3JTY2FsZVNlbGVjdG9yID0gKHtsYXllcjoge2NvbmZpZ30sIG9uQ2hhbmdlfSkgPT4gKFxuICA8RGltZW5zaW9uU2NhbGVTZWxlY3RvclxuICAgIGxhYmVsPVwiQ29sb3IgU2NhbGVcIlxuICAgIG9wdGlvbnM9e1xuICAgICAgY29uZmlnLmNvbG9yRmllbGRcbiAgICAgICAgPyBGSUVMRF9PUFRTW2NvbmZpZy5jb2xvckZpZWxkLnR5cGVdLnNjYWxlLmNvbG9yQWdnclxuICAgICAgICA6IEZJRUxEX09QVFMuaW50ZWdlci5zY2FsZS5jb2xvckFnZ3JcbiAgICB9XG4gICAgc2NhbGVUeXBlPXtjb25maWcuY29sb3JTY2FsZX1cbiAgICBvblNlbGVjdD17dmFsID0+IG9uQ2hhbmdlKHtjb2xvclNjYWxlOiB2YWx9LCAnY29sb3InKX1cbiAgLz5cbik7XG5cbmNvbnN0IEFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yID0gKHtcbiAgbGF5ZXI6IHtjb25maWc6IHt2aXNDb25maWd9fSxcbiAgZmllbGQsXG4gIHByb3BlcnR5LFxuICBvcHRpb25zLFxuICBvbkNoYW5nZVxufSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICA8UGFuZWxMYWJlbD57YEFnZ3JlZ2F0ZSAke2ZpZWxkID8gZmllbGQubmFtZSA6ICcnfSBieWB9PC9QYW5lbExhYmVsPlxuICAgIDxJdGVtU2VsZWN0b3JcbiAgICAgIGRpc2FibGVkPXshZmllbGR9XG4gICAgICBzZWxlY3RlZEl0ZW1zPXt2aXNDb25maWdbcHJvcGVydHldfVxuICAgICAgb3B0aW9ucz17b3B0aW9uc31cbiAgICAgIG11bHRpU2VsZWN0PXtmYWxzZX1cbiAgICAgIHNlYXJjaGFibGU9e2ZhbHNlfVxuICAgICAgb25DaGFuZ2U9e3ZhbHVlID0+IG9uQ2hhbmdlKHtbcHJvcGVydHldOiB2YWx1ZX0pfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG4vKiBlc2xpbnQtZW5hYmxlIG1heC1wYXJhbXMgKi9cbiJdfQ==