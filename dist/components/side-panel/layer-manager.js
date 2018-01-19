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

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  .ui-sortable {\n    display: block;\n    position: relative;\n    overflow: visible;\n    user-select: none;\n\n    :before {\n      content: \' \';\n      display: table;\n    }\n\n    :after {\n      content: \' \';\n      display: table;\n    }\n  }\n\n  .ui-sortable-item.ui-sortable-dragging {\n    position: absolute;\n    z-index: 1688;\n    cursor: move;\n  }\n\n  .ui-sortable-item.ui-sortable-dragging:hover {\n    cursor: move;\n    opacity: 0.5;\n  }\n\n  .ui-sortable-placeholder {\n    display: none;\n  }\n\n  .ui-sortable-placeholder.visible {\n    display: block;\n    opacity: 0;\n    z-index: -1;\n  }\n'], ['\n  .ui-sortable {\n    display: block;\n    position: relative;\n    overflow: visible;\n    user-select: none;\n\n    :before {\n      content: \' \';\n      display: table;\n    }\n\n    :after {\n      content: \' \';\n      display: table;\n    }\n  }\n\n  .ui-sortable-item.ui-sortable-dragging {\n    position: absolute;\n    z-index: 1688;\n    cursor: move;\n  }\n\n  .ui-sortable-item.ui-sortable-dragging:hover {\n    cursor: move;\n    opacity: 0.5;\n  }\n\n  .ui-sortable-placeholder {\n    display: none;\n  }\n\n  .ui-sortable-placeholder.visible {\n    display: block;\n    opacity: 0;\n    z-index: -1;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAnythingSortable = require('react-anything-sortable');

var _reactAnythingSortable2 = _interopRequireDefault(_reactAnythingSortable);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _layerPanel = require('./layer-panel/layer-panel');

var _layerPanel2 = _interopRequireDefault(_layerPanel);

var _sourceDataCatalog = require('./source-data-catalog');

var _sourceDataCatalog2 = _interopRequireDefault(_sourceDataCatalog);

var _icons = require('../common/icons');

var _itemSelector = require('../common/item-selector/item-selector');

var _itemSelector2 = _interopRequireDefault(_itemSelector);

var _styledComponents3 = require('../common/styled-components');

var _defaultSettings = require('../../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  addLayer: _react2.default.PropTypes.func.isRequired,
  panelWidth: _react2.default.PropTypes.number.isRequired,
  datasets: _react2.default.PropTypes.object.isRequired,
  layerBlending: _react2.default.PropTypes.string.isRequired,
  layers: _react2.default.PropTypes.array.isRequired,
  layerConfigChange: _react2.default.PropTypes.func.isRequired,
  layerVisualChannelConfigChange: _react2.default.PropTypes.func.isRequired,
  layerTypeChange: _react2.default.PropTypes.func.isRequired,
  layerVisConfigChange: _react2.default.PropTypes.func.isRequired,
  openModal: _react2.default.PropTypes.func.isRequired,
  removeLayer: _react2.default.PropTypes.func.isRequired,
  removeDataset: _react2.default.PropTypes.func.isRequired,
  showDatasetTable: _react2.default.PropTypes.func.isRequired,
  updateLayerBlending: _react2.default.PropTypes.func.isRequired,
  updateLayerOrder: _react2.default.PropTypes.func.isRequired
};

var StyledSortable = _styledComponents2.default.div(_templateObject);

var LayerManager = function (_Component) {
  (0, _inherits3.default)(LayerManager, _Component);

  function LayerManager() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, LayerManager);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this._addEmptyNewLayer = function () {
      _this.props.addLayer();
    }, _this._handleSort = function (order) {
      _this.props.updateLayerOrder(order);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  LayerManager.prototype.render = function render() {
    var _props = this.props,
        layers = _props.layers,
        datasets = _props.datasets,
        layerOrder = _props.layerOrder,
        panelWidth = _props.panelWidth,
        openModal = _props.openModal;

    var defaultDataset = Object.keys(datasets)[0];

    var layerActions = {
      layerConfigChange: this.props.layerConfigChange,
      layerVisualChannelConfigChange: this.props.layerVisualChannelConfigChange,
      layerTypeChange: this.props.layerTypeChange,
      layerVisConfigChange: this.props.layerVisConfigChange,
      removeLayer: this.props.removeLayer
    };

    var panelProps = { datasets: datasets, panelWidth: panelWidth, openModal: openModal };

    return _react2.default.createElement(
      StyledSortable,
      null,
      _react2.default.createElement(_sourceDataCatalog2.default, {
        datasets: datasets,
        showDatasetTable: this.props.showDatasetTable,
        removeDataset: this.props.removeDataset,
        showDeleteDataset: true
      }),
      _react2.default.createElement(
        _styledComponents3.Button,
        {
          onClick: this.props.showAddDataModal,
          isInactive: !defaultDataset,
          width: '105px',
          secondary: true
        },
        _react2.default.createElement(_icons.Add, { height: '12px' }),
        'Add Data'
      ),
      _react2.default.createElement(_styledComponents3.SidePanelDivider, null),
      _react2.default.createElement(
        _styledComponents3.SidePanelSection,
        null,
        _react2.default.createElement(
          _reactAnythingSortable2.default,
          {
            onSort: this._handleSort,
            direction: 'vertical',
            sortHandle: 'sort--handle',
            dynamic: true
          },
          layerOrder.map(function (idx) {
            return _react2.default.createElement(_layerPanel2.default, (0, _extends3.default)({}, panelProps, layerActions, {
              sortData: idx,
              key: layers[idx].id,
              idx: idx,
              layer: layers[idx]
            }));
          })
        )
      ),
      _react2.default.createElement(
        _styledComponents3.SidePanelSection,
        null,
        defaultDataset ? _react2.default.createElement(
          _styledComponents3.Button,
          { onClick: this._addEmptyNewLayer, width: '105px' },
          _react2.default.createElement(_icons.Add, { height: '12px' }),
          'Add Layer'
        ) : null
      ),
      _react2.default.createElement(LayerBlendingSelector, {
        layerBlending: this.props.layerBlending,
        updateLayerBlending: this.props.updateLayerBlending
      })
    );
  };

  return LayerManager;
}(_react.Component);

exports.default = LayerManager;


LayerManager.propTypes = propTypes;

var LayerBlendingSelector = function LayerBlendingSelector(_ref) {
  var layerBlending = _ref.layerBlending,
      updateLayerBlending = _ref.updateLayerBlending;
  return _react2.default.createElement(
    _styledComponents3.SidePanelSection,
    null,
    _react2.default.createElement(
      _styledComponents3.PanelLabel,
      null,
      'Layer Blending'
    ),
    _react2.default.createElement(_itemSelector2.default, {
      selectedItems: layerBlending,
      options: Object.keys(_defaultSettings.LAYER_BLENDINGS),
      multiSelect: false,
      searchable: false,
      onChange: updateLayerBlending
    })
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJhZGRMYXllciIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwicGFuZWxXaWR0aCIsIm51bWJlciIsImRhdGFzZXRzIiwib2JqZWN0IiwibGF5ZXJCbGVuZGluZyIsInN0cmluZyIsImxheWVycyIsImFycmF5IiwibGF5ZXJDb25maWdDaGFuZ2UiLCJsYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2UiLCJsYXllclR5cGVDaGFuZ2UiLCJsYXllclZpc0NvbmZpZ0NoYW5nZSIsIm9wZW5Nb2RhbCIsInJlbW92ZUxheWVyIiwicmVtb3ZlRGF0YXNldCIsInNob3dEYXRhc2V0VGFibGUiLCJ1cGRhdGVMYXllckJsZW5kaW5nIiwidXBkYXRlTGF5ZXJPcmRlciIsIlN0eWxlZFNvcnRhYmxlIiwiZGl2IiwiTGF5ZXJNYW5hZ2VyIiwiX2FkZEVtcHR5TmV3TGF5ZXIiLCJwcm9wcyIsIl9oYW5kbGVTb3J0Iiwib3JkZXIiLCJyZW5kZXIiLCJsYXllck9yZGVyIiwiZGVmYXVsdERhdGFzZXQiLCJPYmplY3QiLCJrZXlzIiwibGF5ZXJBY3Rpb25zIiwicGFuZWxQcm9wcyIsInNob3dBZGREYXRhTW9kYWwiLCJtYXAiLCJpZHgiLCJpZCIsIkxheWVyQmxlbmRpbmdTZWxlY3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFPQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFlBQVUsZ0JBQU1DLFNBQU4sQ0FBZ0JDLElBQWhCLENBQXFCQyxVQURmO0FBRWhCQyxjQUFZLGdCQUFNSCxTQUFOLENBQWdCSSxNQUFoQixDQUF1QkYsVUFGbkI7QUFHaEJHLFlBQVUsZ0JBQU1MLFNB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RCxZQUZOO0FBR0Usd0JBQVVJLEdBSFo7QUFJRSxtQkFBSzVCLE9BQU80QixHQUFQLEVBQVlDLEVBSm5CO0FBS0UsbUJBQUtELEdBTFA7QUFNRSxxQkFBTzVCLE9BQU80QixHQUFQO0FBTlQsZUFEYztBQUFBLFdBQWY7QUFOSDtBQURGLE9BaEJGO0FBbUNFO0FBQUE7QUFBQTtBQUNHUCx5QkFDQztBQUFBO0FBQUEsWUFBUSxTQUFTLEtBQUtOLGlCQUF0QixFQUF5QyxPQUFNLE9BQS9DO0FBQ0Usc0RBQUssUUFBTyxNQUFaLEdBREY7QUFBQTtBQUFBLFNBREQsR0FJRztBQUxOLE9BbkNGO0FBMENFLG9DQUFDLHFCQUFEO0FBQ0UsdUJBQWUsS0FBS0MsS0FBTCxDQUFXbEIsYUFENUI7QUFFRSw2QkFBcUIsS0FBS2tCLEtBQUwsQ0FBV047QUFGbEM7QUExQ0YsS0FERjtBQWlERCxHOzs7OztrQkF4RWtCSSxZOzs7QUEyRXJCQSxhQUFhekIsU0FBYixHQUF5QkEsU0FBekI7O0FBRUEsSUFBTXlDLHdCQUF3QixTQUF4QkEscUJBQXdCO0FBQUEsTUFBRWhDLGFBQUYsUUFBRUEsYUFBRjtBQUFBLE1BQWlCWSxtQkFBakIsUUFBaUJBLG1CQUFqQjtBQUFBLFNBQzVCO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FERjtBQUVFO0FBQ0UscUJBQWVaLGFBRGpCO0FBRUUsZUFBU3dCLE9BQU9DLElBQVAsa0NBRlg7QUFHRSxtQkFBYSxLQUhmO0FBSUUsa0JBQVksS0FKZDtBQUtFLGdCQUFVYjtBQUxaO0FBRkYsR0FENEI7QUFBQSxDQUE5QiIsImZpbGUiOiJsYXllci1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgU29ydGFibGUgZnJvbSAncmVhY3QtYW55dGhpbmctc29ydGFibGUnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCBMYXllclBhbmVsIGZyb20gJy4vbGF5ZXItcGFuZWwvbGF5ZXItcGFuZWwnO1xuaW1wb3J0IFNvdXJjZURhdGFDYXRhbG9nIGZyb20gJy4vc291cmNlLWRhdGEtY2F0YWxvZyc7XG5pbXBvcnQge0FkZH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IHtcbiAgUGFuZWxMYWJlbCxcbiAgU2lkZVBhbmVsRGl2aWRlcixcbiAgU2lkZVBhbmVsU2VjdGlvbixcbiAgQnV0dG9uXG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IHtMQVlFUl9CTEVORElOR1N9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBhZGRMYXllcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcGFuZWxXaWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBkYXRhc2V0czogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBsYXllckJsZW5kaW5nOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGxheWVyczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGxheWVyQ29uZmlnQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBsYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGxheWVyVHlwZUNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgbGF5ZXJWaXNDb25maWdDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9wZW5Nb2RhbDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVtb3ZlTGF5ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlbW92ZURhdGFzZXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHNob3dEYXRhc2V0VGFibGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHVwZGF0ZUxheWVyQmxlbmRpbmc6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHVwZGF0ZUxheWVyT3JkZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IFN0eWxlZFNvcnRhYmxlID0gc3R5bGVkLmRpdmBcbiAgLnVpLXNvcnRhYmxlIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICA6YmVmb3JlIHtcbiAgICAgIGNvbnRlbnQ6ICcgJztcbiAgICAgIGRpc3BsYXk6IHRhYmxlO1xuICAgIH1cblxuICAgIDphZnRlciB7XG4gICAgICBjb250ZW50OiAnICc7XG4gICAgICBkaXNwbGF5OiB0YWJsZTtcbiAgICB9XG4gIH1cblxuICAudWktc29ydGFibGUtaXRlbS51aS1zb3J0YWJsZS1kcmFnZ2luZyB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHotaW5kZXg6IDE2ODg7XG4gICAgY3Vyc29yOiBtb3ZlO1xuICB9XG5cbiAgLnVpLXNvcnRhYmxlLWl0ZW0udWktc29ydGFibGUtZHJhZ2dpbmc6aG92ZXIge1xuICAgIGN1cnNvcjogbW92ZTtcbiAgICBvcGFjaXR5OiAwLjU7XG4gIH1cblxuICAudWktc29ydGFibGUtcGxhY2Vob2xkZXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cblxuICAudWktc29ydGFibGUtcGxhY2Vob2xkZXIudmlzaWJsZSB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgb3BhY2l0eTogMDtcbiAgICB6LWluZGV4OiAtMTtcbiAgfVxuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXJNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgX2FkZEVtcHR5TmV3TGF5ZXIgPSAoKSA9PiB7XG4gICAgdGhpcy5wcm9wcy5hZGRMYXllcigpO1xuICB9O1xuXG4gIF9oYW5kbGVTb3J0ID0gb3JkZXIgPT4ge1xuICAgIHRoaXMucHJvcHMudXBkYXRlTGF5ZXJPcmRlcihvcmRlcik7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtsYXllcnMsIGRhdGFzZXRzLCBsYXllck9yZGVyLCBwYW5lbFdpZHRoLCBvcGVuTW9kYWx9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBkZWZhdWx0RGF0YXNldCA9IE9iamVjdC5rZXlzKGRhdGFzZXRzKVswXTtcblxuICAgIGNvbnN0IGxheWVyQWN0aW9ucyA9IHtcbiAgICAgIGxheWVyQ29uZmlnQ2hhbmdlOiB0aGlzLnByb3BzLmxheWVyQ29uZmlnQ2hhbmdlLFxuICAgICAgbGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlOiB0aGlzLnByb3BzLmxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSxcbiAgICAgIGxheWVyVHlwZUNoYW5nZTogdGhpcy5wcm9wcy5sYXllclR5cGVDaGFuZ2UsXG4gICAgICBsYXllclZpc0NvbmZpZ0NoYW5nZTogdGhpcy5wcm9wcy5sYXllclZpc0NvbmZpZ0NoYW5nZSxcbiAgICAgIHJlbW92ZUxheWVyOiB0aGlzLnByb3BzLnJlbW92ZUxheWVyXG4gICAgfTtcblxuICAgIGNvbnN0IHBhbmVsUHJvcHMgPSB7ZGF0YXNldHMsIHBhbmVsV2lkdGgsIG9wZW5Nb2RhbH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZFNvcnRhYmxlPlxuICAgICAgICA8U291cmNlRGF0YUNhdGFsb2dcbiAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgc2hvd0RhdGFzZXRUYWJsZT17dGhpcy5wcm9wcy5zaG93RGF0YXNldFRhYmxlfVxuICAgICAgICAgIHJlbW92ZURhdGFzZXQ9e3RoaXMucHJvcHMucmVtb3ZlRGF0YXNldH1cbiAgICAgICAgICBzaG93RGVsZXRlRGF0YXNldFxuICAgICAgICAvPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5zaG93QWRkRGF0YU1vZGFsfVxuICAgICAgICAgIGlzSW5hY3RpdmU9eyFkZWZhdWx0RGF0YXNldH1cbiAgICAgICAgICB3aWR0aD1cIjEwNXB4XCJcbiAgICAgICAgICBzZWNvbmRhcnlcbiAgICAgICAgPlxuICAgICAgICAgIDxBZGQgaGVpZ2h0PVwiMTJweFwiIC8+QWRkIERhdGFcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxTaWRlUGFuZWxEaXZpZGVyIC8+XG4gICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgIDxTb3J0YWJsZVxuICAgICAgICAgICAgb25Tb3J0PXt0aGlzLl9oYW5kbGVTb3J0fVxuICAgICAgICAgICAgZGlyZWN0aW9uPVwidmVydGljYWxcIlxuICAgICAgICAgICAgc29ydEhhbmRsZT1cInNvcnQtLWhhbmRsZVwiXG4gICAgICAgICAgICBkeW5hbWljXG4gICAgICAgICAgPlxuICAgICAgICAgICAge2xheWVyT3JkZXIubWFwKGlkeCA9PiAoXG4gICAgICAgICAgICAgIDxMYXllclBhbmVsXG4gICAgICAgICAgICAgICAgey4uLnBhbmVsUHJvcHN9XG4gICAgICAgICAgICAgICAgey4uLmxheWVyQWN0aW9uc31cbiAgICAgICAgICAgICAgICBzb3J0RGF0YT17aWR4fVxuICAgICAgICAgICAgICAgIGtleT17bGF5ZXJzW2lkeF0uaWR9XG4gICAgICAgICAgICAgICAgaWR4PXtpZHh9XG4gICAgICAgICAgICAgICAgbGF5ZXI9e2xheWVyc1tpZHhdfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9Tb3J0YWJsZT5cbiAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICB7ZGVmYXVsdERhdGFzZXQgPyAoXG4gICAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e3RoaXMuX2FkZEVtcHR5TmV3TGF5ZXJ9IHdpZHRoPVwiMTA1cHhcIj5cbiAgICAgICAgICAgICAgPEFkZCBoZWlnaHQ9XCIxMnB4XCIgLz5BZGQgTGF5ZXJcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgIDxMYXllckJsZW5kaW5nU2VsZWN0b3JcbiAgICAgICAgICBsYXllckJsZW5kaW5nPXt0aGlzLnByb3BzLmxheWVyQmxlbmRpbmd9XG4gICAgICAgICAgdXBkYXRlTGF5ZXJCbGVuZGluZz17dGhpcy5wcm9wcy51cGRhdGVMYXllckJsZW5kaW5nfVxuICAgICAgICAvPlxuICAgICAgPC9TdHlsZWRTb3J0YWJsZT5cbiAgICApO1xuICB9XG59XG5cbkxheWVyTWFuYWdlci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmNvbnN0IExheWVyQmxlbmRpbmdTZWxlY3RvciA9ICh7bGF5ZXJCbGVuZGluZywgdXBkYXRlTGF5ZXJCbGVuZGluZ30pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgPFBhbmVsTGFiZWw+TGF5ZXIgQmxlbmRpbmc8L1BhbmVsTGFiZWw+XG4gICAgPEl0ZW1TZWxlY3RvclxuICAgICAgc2VsZWN0ZWRJdGVtcz17bGF5ZXJCbGVuZGluZ31cbiAgICAgIG9wdGlvbnM9e09iamVjdC5rZXlzKExBWUVSX0JMRU5ESU5HUyl9XG4gICAgICBtdWx0aVNlbGVjdD17ZmFsc2V9XG4gICAgICBzZWFyY2hhYmxlPXtmYWxzZX1cbiAgICAgIG9uQ2hhbmdlPXt1cGRhdGVMYXllckJsZW5kaW5nfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG4iXX0=