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

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n   .ui-sortable {\n    display: block;\n    position: relative;\n    overflow: visible;\n    user-select: none;\n\n    :before {\n      content: " ";\n      display: table\n    };\n    \n    :after {\n      content: " ";\n      display: table\n    }\n  };\n\n   .ui-sortable-item.ui-sortable-dragging {\n    position: absolute;\n    z-index: 1688;\n    cursor: move\n  };\n\n   .ui-sortable-item.ui-sortable-dragging:hover {\n    cursor: move;\n    opacity: 0.5\n  };\n\n   .ui-sortable-placeholder {\n    display: none\n  };\n\n   .ui-sortable-placeholder.visible {\n    display: block;\n    opacity: 0;\n    z-index: -1\n  }\n'], ['\n   .ui-sortable {\n    display: block;\n    position: relative;\n    overflow: visible;\n    user-select: none;\n\n    :before {\n      content: " ";\n      display: table\n    };\n    \n    :after {\n      content: " ";\n      display: table\n    }\n  };\n\n   .ui-sortable-item.ui-sortable-dragging {\n    position: absolute;\n    z-index: 1688;\n    cursor: move\n  };\n\n   .ui-sortable-item.ui-sortable-dragging:hover {\n    cursor: move;\n    opacity: 0.5\n  };\n\n   .ui-sortable-placeholder {\n    display: none\n  };\n\n   .ui-sortable-placeholder.visible {\n    display: block;\n    opacity: 0;\n    z-index: -1\n  }\n']);

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
        showDeleteDataset: true }),
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
          { onSort: this._handleSort,
            direction: 'vertical',
            sortHandle: 'sort--handle',
            dynamic: true },
          layerOrder.map(function (idx) {
            return _react2.default.createElement(_layerPanel2.default, (0, _extends3.default)({}, panelProps, layerActions, {
              sortData: idx,
              key: layers[idx].id,
              idx: idx,
              layer: layers[idx] }));
          })
        )
      ),
      _react2.default.createElement(
        _styledComponents3.SidePanelSection,
        null,
        defaultDataset ? _react2.default.createElement(
          _styledComponents3.Button,
          {
            onClick: this._addEmptyNewLayer,
            width: '105px' },
          _react2.default.createElement(_icons.Add, { height: '12px' }),
          'Add Layer'
        ) : null
      ),
      _react2.default.createElement(LayerBlendingSelector, {
        layerBlending: this.props.layerBlending,
        updateLayerBlending: this.props.updateLayerBlending })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJhZGRMYXllciIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwicGFuZWxXaWR0aCIsIm51bWJlciIsImRhdGFzZXRzIiwib2JqZWN0IiwibGF5ZXJCbGVuZGluZyIsInN0cmluZyIsImxheWVycyIsImFycmF5IiwibGF5ZXJDb25maWdDaGFuZ2UiLCJsYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2UiLCJsYXllclR5cGVDaGFuZ2UiLCJsYXllclZpc0NvbmZpZ0NoYW5nZSIsIm9wZW5Nb2RhbCIsInJlbW92ZUxheWVyIiwicmVtb3ZlRGF0YXNldCIsInNob3dEYXRhc2V0VGFibGUiLCJ1cGRhdGVMYXllckJsZW5kaW5nIiwidXBkYXRlTGF5ZXJPcmRlciIsIlN0eWxlZFNvcnRhYmxlIiwiZGl2IiwiTGF5ZXJNYW5hZ2VyIiwiX2FkZEVtcHR5TmV3TGF5ZXIiLCJwcm9wcyIsIl9oYW5kbGVTb3J0Iiwib3JkZXIiLCJyZW5kZXIiLCJsYXllck9yZGVyIiwiZGVmYXVsdERhdGFzZXQiLCJPYmplY3QiLCJrZXlzIiwibGF5ZXJBY3Rpb25zIiwicGFuZWxQcm9wcyIsInNob3dBZGREYXRhTW9kYWwiLCJtYXAiLCJpZHgiLCJpZCIsIkxheWVyQmxlbmRpbmdTZWxlY3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFlBQVUsZ0JBQU1DLFNBQU4sQ0FBZ0JDLElBQWhCLENBQXFCQyxVQURmO0FBRWhCQyxjQUFZLGdCQUFNSCxTQUFOLENBQWdCSSxNQUFoQixDQUF1QkYsVUFGbkI7QUFHaEJHLFlBQVUsZ0JBQU1MLFNB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Q01GLFVBRE4sRUFFTUQsWUFGTjtBQUdFLHdCQUFVSSxHQUhaO0FBSUUsbUJBQUs1QixPQUFPNEIsR0FBUCxFQUFZQyxFQUpuQjtBQUtFLG1CQUFLRCxHQUxQO0FBTUUscUJBQU81QixPQUFPNEIsR0FBUCxDQU5ULElBRGM7QUFBQSxXQUFmO0FBSkg7QUFEQSxPQWRGO0FBOEJFO0FBQUE7QUFBQTtBQUNDUCx5QkFBaUI7QUFBQTtBQUFBO0FBQ2hCLHFCQUFTLEtBQUtOLGlCQURFO0FBRWhCLG1CQUFNLE9BRlU7QUFHaEIsc0RBQUssUUFBTyxNQUFaLEdBSGdCO0FBQUE7QUFBQSxTQUFqQixHQUlXO0FBTFosT0E5QkY7QUFxQ0Usb0NBQUMscUJBQUQ7QUFDRSx1QkFBZSxLQUFLQyxLQUFMLENBQVdsQixhQUQ1QjtBQUVFLDZCQUFxQixLQUFLa0IsS0FBTCxDQUFXTixtQkFGbEM7QUFyQ0YsS0FERjtBQTJDRCxHOzs7OztrQkFuRWtCSSxZOzs7QUFzRXJCQSxhQUFhekIsU0FBYixHQUF5QkEsU0FBekI7O0FBRUEsSUFBTXlDLHdCQUF3QixTQUF4QkEscUJBQXdCO0FBQUEsTUFBRWhDLGFBQUYsUUFBRUEsYUFBRjtBQUFBLE1BQWlCWSxtQkFBakIsUUFBaUJBLG1CQUFqQjtBQUFBLFNBQzVCO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FERjtBQUVFO0FBQ0UscUJBQWVaLGFBRGpCO0FBRUUsZUFBU3dCLE9BQU9DLElBQVAsa0NBRlg7QUFHRSxtQkFBYSxLQUhmO0FBSUUsa0JBQVksS0FKZDtBQUtFLGdCQUFVYjtBQUxaO0FBRkYsR0FENEI7QUFBQSxDQUE5QiIsImZpbGUiOiJsYXllci1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgU29ydGFibGUgZnJvbSAncmVhY3QtYW55dGhpbmctc29ydGFibGUnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCBMYXllclBhbmVsIGZyb20gJy4vbGF5ZXItcGFuZWwvbGF5ZXItcGFuZWwnO1xuaW1wb3J0IFNvdXJjZURhdGFDYXRhbG9nIGZyb20gJy4vc291cmNlLWRhdGEtY2F0YWxvZyc7XG5pbXBvcnQge0FkZH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IHtQYW5lbExhYmVsLCBTaWRlUGFuZWxEaXZpZGVyLCBTaWRlUGFuZWxTZWN0aW9uLCBCdXR0b259IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IHtMQVlFUl9CTEVORElOR1N9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBhZGRMYXllcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcGFuZWxXaWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBkYXRhc2V0czogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBsYXllckJsZW5kaW5nOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGxheWVyczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gIGxheWVyQ29uZmlnQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBsYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGxheWVyVHlwZUNoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgbGF5ZXJWaXNDb25maWdDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9wZW5Nb2RhbDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVtb3ZlTGF5ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlbW92ZURhdGFzZXQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHNob3dEYXRhc2V0VGFibGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHVwZGF0ZUxheWVyQmxlbmRpbmc6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHVwZGF0ZUxheWVyT3JkZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IFN0eWxlZFNvcnRhYmxlID0gc3R5bGVkLmRpdmBcbiAgIC51aS1zb3J0YWJsZSB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuXG4gICAgOmJlZm9yZSB7XG4gICAgICBjb250ZW50OiBcIiBcIjtcbiAgICAgIGRpc3BsYXk6IHRhYmxlXG4gICAgfTtcbiAgICBcbiAgICA6YWZ0ZXIge1xuICAgICAgY29udGVudDogXCIgXCI7XG4gICAgICBkaXNwbGF5OiB0YWJsZVxuICAgIH1cbiAgfTtcblxuICAgLnVpLXNvcnRhYmxlLWl0ZW0udWktc29ydGFibGUtZHJhZ2dpbmcge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB6LWluZGV4OiAxNjg4O1xuICAgIGN1cnNvcjogbW92ZVxuICB9O1xuXG4gICAudWktc29ydGFibGUtaXRlbS51aS1zb3J0YWJsZS1kcmFnZ2luZzpob3ZlciB7XG4gICAgY3Vyc29yOiBtb3ZlO1xuICAgIG9wYWNpdHk6IDAuNVxuICB9O1xuXG4gICAudWktc29ydGFibGUtcGxhY2Vob2xkZXIge1xuICAgIGRpc3BsYXk6IG5vbmVcbiAgfTtcblxuICAgLnVpLXNvcnRhYmxlLXBsYWNlaG9sZGVyLnZpc2libGUge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG9wYWNpdHk6IDA7XG4gICAgei1pbmRleDogLTFcbiAgfVxuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5ZXJNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICBfYWRkRW1wdHlOZXdMYXllciA9ICgpID0+IHtcbiAgICB0aGlzLnByb3BzLmFkZExheWVyKCk7XG4gIH07XG5cbiAgX2hhbmRsZVNvcnQgPSAob3JkZXIpID0+IHtcbiAgICB0aGlzLnByb3BzLnVwZGF0ZUxheWVyT3JkZXIob3JkZXIpO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bGF5ZXJzLCBkYXRhc2V0cywgbGF5ZXJPcmRlciwgcGFuZWxXaWR0aCwgb3Blbk1vZGFsfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZGVmYXVsdERhdGFzZXQgPSBPYmplY3Qua2V5cyhkYXRhc2V0cylbMF07XG5cbiAgICBjb25zdCBsYXllckFjdGlvbnMgPSB7XG4gICAgICBsYXllckNvbmZpZ0NoYW5nZTogdGhpcy5wcm9wcy5sYXllckNvbmZpZ0NoYW5nZSxcbiAgICAgIGxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZTogdGhpcy5wcm9wcy5sYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2UsXG4gICAgICBsYXllclR5cGVDaGFuZ2U6IHRoaXMucHJvcHMubGF5ZXJUeXBlQ2hhbmdlLFxuICAgICAgbGF5ZXJWaXNDb25maWdDaGFuZ2U6IHRoaXMucHJvcHMubGF5ZXJWaXNDb25maWdDaGFuZ2UsXG4gICAgICByZW1vdmVMYXllcjogdGhpcy5wcm9wcy5yZW1vdmVMYXllclxuICAgIH07XG5cbiAgICBjb25zdCBwYW5lbFByb3BzID0ge2RhdGFzZXRzLCBwYW5lbFdpZHRoLCBvcGVuTW9kYWx9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRTb3J0YWJsZT5cbiAgICAgICAgPFNvdXJjZURhdGFDYXRhbG9nXG4gICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgIHNob3dEYXRhc2V0VGFibGU9e3RoaXMucHJvcHMuc2hvd0RhdGFzZXRUYWJsZX1cbiAgICAgICAgICByZW1vdmVEYXRhc2V0PXt0aGlzLnByb3BzLnJlbW92ZURhdGFzZXR9XG4gICAgICAgICAgc2hvd0RlbGV0ZURhdGFzZXQvPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5zaG93QWRkRGF0YU1vZGFsfVxuICAgICAgICAgIGlzSW5hY3RpdmU9eyFkZWZhdWx0RGF0YXNldH1cbiAgICAgICAgICB3aWR0aD1cIjEwNXB4XCJcbiAgICAgICAgICBzZWNvbmRhcnlcbiAgICAgICAgPlxuICAgICAgICAgIDxBZGQgaGVpZ2h0PVwiMTJweFwiLz5BZGQgRGF0YTwvQnV0dG9uPlxuICAgICAgICA8U2lkZVBhbmVsRGl2aWRlci8+XG4gICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICA8U29ydGFibGUgb25Tb3J0PXt0aGlzLl9oYW5kbGVTb3J0fVxuICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uPVwidmVydGljYWxcIlxuICAgICAgICAgICAgICAgICAgc29ydEhhbmRsZT1cInNvcnQtLWhhbmRsZVwiXG4gICAgICAgICAgICAgICAgICBkeW5hbWljPlxuICAgICAgICAgIHtsYXllck9yZGVyLm1hcChpZHggPT4gKFxuICAgICAgICAgICAgPExheWVyUGFuZWxcbiAgICAgICAgICAgICAgey4uLnBhbmVsUHJvcHN9XG4gICAgICAgICAgICAgIHsuLi5sYXllckFjdGlvbnN9XG4gICAgICAgICAgICAgIHNvcnREYXRhPXtpZHh9XG4gICAgICAgICAgICAgIGtleT17bGF5ZXJzW2lkeF0uaWR9XG4gICAgICAgICAgICAgIGlkeD17aWR4fVxuICAgICAgICAgICAgICBsYXllcj17bGF5ZXJzW2lkeF19Lz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9Tb3J0YWJsZT5cbiAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAge2RlZmF1bHREYXRhc2V0ID8gPEJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuX2FkZEVtcHR5TmV3TGF5ZXJ9XG4gICAgICAgICAgd2lkdGg9XCIxMDVweFwiPlxuICAgICAgICAgIDxBZGQgaGVpZ2h0PVwiMTJweFwiLz5BZGQgTGF5ZXJcbiAgICAgICAgPC9CdXR0b24+IDogbnVsbH1cbiAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICA8TGF5ZXJCbGVuZGluZ1NlbGVjdG9yXG4gICAgICAgICAgbGF5ZXJCbGVuZGluZz17dGhpcy5wcm9wcy5sYXllckJsZW5kaW5nfVxuICAgICAgICAgIHVwZGF0ZUxheWVyQmxlbmRpbmc9e3RoaXMucHJvcHMudXBkYXRlTGF5ZXJCbGVuZGluZ30vPlxuICAgICAgPC9TdHlsZWRTb3J0YWJsZT5cbiAgICApO1xuICB9XG59XG5cbkxheWVyTWFuYWdlci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmNvbnN0IExheWVyQmxlbmRpbmdTZWxlY3RvciA9ICh7bGF5ZXJCbGVuZGluZywgdXBkYXRlTGF5ZXJCbGVuZGluZ30pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgPFBhbmVsTGFiZWw+TGF5ZXIgQmxlbmRpbmc8L1BhbmVsTGFiZWw+XG4gICAgPEl0ZW1TZWxlY3RvclxuICAgICAgc2VsZWN0ZWRJdGVtcz17bGF5ZXJCbGVuZGluZ31cbiAgICAgIG9wdGlvbnM9e09iamVjdC5rZXlzKExBWUVSX0JMRU5ESU5HUyl9XG4gICAgICBtdWx0aVNlbGVjdD17ZmFsc2V9XG4gICAgICBzZWFyY2hhYmxlPXtmYWxzZX1cbiAgICAgIG9uQ2hhbmdlPXt1cGRhdGVMYXllckJsZW5kaW5nfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG4iXX0=