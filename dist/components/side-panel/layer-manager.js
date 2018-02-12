'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

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

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  .ui-sortable {\n    display: block;\n    position: relative;\n    overflow: visible;\n    user-select: none;\n\n    :before {\n      content: \' \';\n      display: table;\n    }\n\n    :after {\n      content: \' \';\n      display: table;\n    }\n  }\n\n  .ui-sortable-item.ui-sortable-dragging {\n    position: absolute;\n    z-index: 1688;\n    cursor: move;\n  }\n\n  .ui-sortable-item.ui-sortable-dragging:hover {\n    cursor: move;\n    opacity: 0.5;\n  }\n\n  .ui-sortable-placeholder {\n    display: none;\n  }\n\n  .ui-sortable-placeholder.visible {\n    display: block;\n    opacity: 0;\n    z-index: -1;\n  }\n'], ['\n  .ui-sortable {\n    display: block;\n    position: relative;\n    overflow: visible;\n    user-select: none;\n\n    :before {\n      content: \' \';\n      display: table;\n    }\n\n    :after {\n      content: \' \';\n      display: table;\n    }\n  }\n\n  .ui-sortable-item.ui-sortable-dragging {\n    position: absolute;\n    z-index: 1688;\n    cursor: move;\n  }\n\n  .ui-sortable-item.ui-sortable-dragging:hover {\n    cursor: move;\n    opacity: 0.5;\n  }\n\n  .ui-sortable-placeholder {\n    display: none;\n  }\n\n  .ui-sortable-placeholder.visible {\n    display: block;\n    opacity: 0;\n    z-index: -1;\n  }\n']);

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
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, LayerManager);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = LayerManager.__proto__ || Object.getPrototypeOf(LayerManager)).call.apply(_ref, [this].concat(args))), _this), _this._addEmptyNewLayer = function () {
      _this.props.addLayer();
    }, _this._handleSort = function (order) {
      _this.props.updateLayerOrder(order);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(LayerManager, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          layers = _props.layers,
          datasets = _props.datasets,
          layerOrder = _props.layerOrder,
          openModal = _props.openModal;

      var defaultDataset = Object.keys(datasets)[0];

      var layerActions = {
        layerConfigChange: this.props.layerConfigChange,
        layerVisualChannelConfigChange: this.props.layerVisualChannelConfigChange,
        layerTypeChange: this.props.layerTypeChange,
        layerVisConfigChange: this.props.layerVisConfigChange,
        removeLayer: this.props.removeLayer
      };

      var panelProps = { datasets: datasets, openModal: openModal };

      return _react2.default.createElement(
        StyledSortable,
        { className: 'layer-manager' },
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
    }
  }]);
  return LayerManager;
}(_react.Component);

exports.default = LayerManager;


LayerManager.propTypes = propTypes;

var LayerBlendingSelector = function LayerBlendingSelector(_ref2) {
  var layerBlending = _ref2.layerBlending,
      updateLayerBlending = _ref2.updateLayerBlending;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItbWFuYWdlci5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJhZGRMYXllciIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIiwiZGF0YXNldHMiLCJvYmplY3QiLCJsYXllckJsZW5kaW5nIiwic3RyaW5nIiwibGF5ZXJzIiwiYXJyYXkiLCJsYXllckNvbmZpZ0NoYW5nZSIsImxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSIsImxheWVyVHlwZUNoYW5nZSIsImxheWVyVmlzQ29uZmlnQ2hhbmdlIiwib3Blbk1vZGFsIiwicmVtb3ZlTGF5ZXIiLCJyZW1vdmVEYXRhc2V0Iiwic2hvd0RhdGFzZXRUYWJsZSIsInVwZGF0ZUxheWVyQmxlbmRpbmciLCJ1cGRhdGVMYXllck9yZGVyIiwiU3R5bGVkU29ydGFibGUiLCJkaXYiLCJMYXllck1hbmFnZXIiLCJfYWRkRW1wdHlOZXdMYXllciIsInByb3BzIiwiX2hhbmRsZVNvcnQiLCJvcmRlciIsImxheWVyT3JkZXIiLCJkZWZhdWx0RGF0YXNldCIsIk9iamVjdCIsImtleXMiLCJsYXllckFjdGlvbnMiLCJwYW5lbFByb3BzIiwic2hvd0FkZERhdGFNb2RhbCIsIm1hcCIsImlkeCIsImlkIiwiTGF5ZXJCbGVuZGluZ1NlbGVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFPQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFlBQVUsZ0JBQU1DLFNBQU4sQ0FBZ0JDLElBQWhCLENBQXFCQyxVQURmO0FBRWhCQyxZQUFVLGdCQUFNSCxTQUFOLENBQWdCSSxNQUFoQixDQUF1QkYsVUFGakI7QUFHaEJHLGlCQUFlLGdCQUFNTCxTQUFOLENBQWdCTSxNQUFoQixDQUF1QkosVUFIdEI7QUFJaEJLLFVBQVEsZ0JBQU1QLFNBQU4sQ0FBZ0JRLEtBQWhCLENBQXNCTixVQUpkO0FBS2hCTyxxQkFBbUIsZ0JBQU1ULFNBQU4sQ0FBZ0JDLElBQWhCLENBQXFCQyxVQUx4QjtBQU1oQlEsa0NBQWdDLGdCQUFNVixTQUFOLENBQWdCQyxJQUFoQixDQUFxQkMsVUFOckM7QUFPaEJTLG1CQUFpQixnQkFBTVgsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDLFVBUHRCO0FBUWhCVSx3QkFBc0IsZ0JBQU1aLFNBQU4sQ0FBZ0JDLElBQWhCLENBQXFCQyxVQVIzQjtBQVNoQlcsYUFBVyxnQkFBTWIsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDLFVBVGhCO0FBVWhCWSxlQUFhLGdCQUFNZCxTQUFOLENBQWdCQyxJQUFoQixDQUFxQkMsVUFWbEI7QUFXaEJhLGlCQUFlLGdCQUFNZixTQUFOLENBQWdCQyxJQUFoQixDQUFxQkMsVUFYcEI7QUFZaEJjLG9CQUFrQixnQkFBTWhCLFNBQU4sQ0FBZ0JDLElBQWhCLENBQXFCQyxVQVp2QjtBQWFoQmUsdUJBQXFCLGdCQUFNakIsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDLFVBYjFCO0FBY2hCZ0Isb0JBQWtCLGdCQUFNbEIsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDO0FBZHZCLENBQWxCOztBQWlCQSxJQUFNaUIsaUJBQWlCLDJCQUFPQyxHQUF4QixpQkFBTjs7SUF3Q3FCQyxZOzs7Ozs7Ozs7Ozs7OztnTkFDbkJDLGlCLEdBQW9CLFlBQU07QUFDeEIsWUFBS0MsS0FBTCxDQUFXeEIsUUFBWDtBQUNELEssUUFFRHlCLFcsR0FBYyxpQkFBUztBQUNyQixZQUFLRCxLQUFMLENBQVdMLGdCQUFYLENBQTRCTyxLQUE1QjtBQUNELEs7Ozs7OzZCQUVRO0FBQUEsbUJBQzJDLEtBQUtGLEtBRGhEO0FBQUEsVUFDQWhCLE1BREEsVUFDQUEsTUFEQTtBQUFBLFVBQ1FKLFFBRFIsVUFDUUEsUUFEUjtBQUFBLFVBQ2tCdUIsVUFEbEIsVUFDa0JBLFVBRGxCO0FBQUEsVUFDOEJiLFNBRDlCLFVBQzhCQSxTQUQ5Qjs7QUFFUCxVQUFNYyxpQkFBaUJDLE9BQU9DLElBQVAsQ0FBWTFCLFFBQVosRUFBc0IsQ0FBdEIsQ0FBdkI7O0FBRUEsVUFBTTJCLGVBQWU7QUFDbkJyQiwyQkFBbUIsS0FBS2MsS0FBTCxDQUFXZCxpQkFEWDtBQUVuQkMsd0NBQWdDLEtBQUthLEtBQUwsQ0FBV2IsOEJBRnhCO0FBR25CQyx5QkFBaUIsS0FBS1ksS0FBTCxDQUFXWixlQUhUO0FBSW5CQyw4QkFBc0IsS0FBS1csS0FBTCxDQUFXWCxvQkFKZDtBQUtuQkUscUJBQWEsS0FBS1MsS0FBTCxDQUFXVDtBQUxMLE9BQXJCOztBQVFBLFVBQU1pQixhQUFhLEVBQUM1QixrQkFBRCxFQUFXVSxvQkFBWCxFQUFuQjs7QUFFQSxhQUNFO0FBQUMsc0JBQUQ7QUFBQSxVQUFnQixXQUFVLGVBQTFCO0FBQ0U7QUFDRSxvQkFBVVYsUUFEWjtBQUVFLDRCQUFrQixLQUFLb0IsS0FBTCxDQUFXUCxnQkFGL0I7QUFHRSx5QkFBZSxLQUFLTyxLQUFMLENBQVdSLGFBSDVCO0FBSUU7QUFKRixVQURGO0FBT0U7QUFBQTtBQUFBO0FBQ0UscUJBQVMsS0FBS1EsS0FBTCxDQUFXUyxnQkFEdEI7QUFFRSx3QkFBWSxDQUFDTCxjQUZmO0FBR0UsbUJBQU0sT0FIUjtBQUlFO0FBSkY7QUFNRSxzREFBSyxRQUFPLE1BQVosR0FORjtBQUFBO0FBQUEsU0FQRjtBQWVFLGdGQWZGO0FBZ0JFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUNFLHNCQUFRLEtBQUtILFdBRGY7QUFFRSx5QkFBVSxVQUZaO0FBR0UsMEJBQVcsY0FIYjtBQUlFO0FBSkY7QUFNR0UsdUJBQVdPLEdBQVgsQ0FBZTtBQUFBLHFCQUNkLCtFQUNNRixVQUROLEVBRU1ELFlBRk47QUFHRSwwQkFBVUksR0FIWjtBQUlFLHFCQUFLM0IsT0FBTzJCLEdBQVAsRUFBWUMsRUFKbkI7QUFLRSxxQkFBS0QsR0FMUDtBQU1FLHVCQUFPM0IsT0FBTzJCLEdBQVA7QUFOVCxpQkFEYztBQUFBLGFBQWY7QUFOSDtBQURGLFNBaEJGO0FBbUNFO0FBQUE7QUFBQTtBQUNHUCwyQkFDQztBQUFBO0FBQUEsY0FBUSxTQUFTLEtBQUtMLGlCQUF0QixFQUF5QyxPQUFNLE9BQS9DO0FBQ0Usd0RBQUssUUFBTyxNQUFaLEdBREY7QUFBQTtBQUFBLFdBREQsR0FJRztBQUxOLFNBbkNGO0FBMENFLHNDQUFDLHFCQUFEO0FBQ0UseUJBQWUsS0FBS0MsS0FBTCxDQUFXbEIsYUFENUI7QUFFRSwrQkFBcUIsS0FBS2tCLEtBQUwsQ0FBV047QUFGbEM7QUExQ0YsT0FERjtBQWlERDs7Ozs7a0JBeEVrQkksWTs7O0FBMkVyQkEsYUFBYXZCLFNBQWIsR0FBeUJBLFNBQXpCOztBQUVBLElBQU1zQyx3QkFBd0IsU0FBeEJBLHFCQUF3QjtBQUFBLE1BQUUvQixhQUFGLFNBQUVBLGFBQUY7QUFBQSxNQUFpQlksbUJBQWpCLFNBQWlCQSxtQkFBakI7QUFBQSxTQUM1QjtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBREY7QUFFRTtBQUNFLHFCQUFlWixhQURqQjtBQUVFLGVBQVN1QixPQUFPQyxJQUFQLGtDQUZYO0FBR0UsbUJBQWEsS0FIZjtBQUlFLGtCQUFZLEtBSmQ7QUFLRSxnQkFBVVo7QUFMWjtBQUZGLEdBRDRCO0FBQUEsQ0FBOUIiLCJmaWxlIjoibGF5ZXItbWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFNvcnRhYmxlIGZyb20gJ3JlYWN0LWFueXRoaW5nLXNvcnRhYmxlJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgTGF5ZXJQYW5lbCBmcm9tICcuL2xheWVyLXBhbmVsL2xheWVyLXBhbmVsJztcbmltcG9ydCBTb3VyY2VEYXRhQ2F0YWxvZyBmcm9tICcuL3NvdXJjZS1kYXRhLWNhdGFsb2cnO1xuaW1wb3J0IHtBZGR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBJdGVtU2VsZWN0b3IgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaXRlbS1zZWxlY3Rvci9pdGVtLXNlbGVjdG9yJztcbmltcG9ydCB7XG4gIFBhbmVsTGFiZWwsXG4gIFNpZGVQYW5lbERpdmlkZXIsXG4gIFNpZGVQYW5lbFNlY3Rpb24sXG4gIEJ1dHRvblxufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCB7TEFZRVJfQkxFTkRJTkdTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgYWRkTGF5ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGRhdGFzZXRzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGxheWVyQmxlbmRpbmc6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbGF5ZXJzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgbGF5ZXJDb25maWdDaGFuZ2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgbGF5ZXJUeXBlQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBsYXllclZpc0NvbmZpZ0NoYW5nZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb3Blbk1vZGFsOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICByZW1vdmVMYXllcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVtb3ZlRGF0YXNldDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgc2hvd0RhdGFzZXRUYWJsZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgdXBkYXRlTGF5ZXJCbGVuZGluZzogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgdXBkYXRlTGF5ZXJPcmRlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgU3R5bGVkU29ydGFibGUgPSBzdHlsZWQuZGl2YFxuICAudWktc29ydGFibGUge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgIDpiZWZvcmUge1xuICAgICAgY29udGVudDogJyAnO1xuICAgICAgZGlzcGxheTogdGFibGU7XG4gICAgfVxuXG4gICAgOmFmdGVyIHtcbiAgICAgIGNvbnRlbnQ6ICcgJztcbiAgICAgIGRpc3BsYXk6IHRhYmxlO1xuICAgIH1cbiAgfVxuXG4gIC51aS1zb3J0YWJsZS1pdGVtLnVpLXNvcnRhYmxlLWRyYWdnaW5nIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgei1pbmRleDogMTY4ODtcbiAgICBjdXJzb3I6IG1vdmU7XG4gIH1cblxuICAudWktc29ydGFibGUtaXRlbS51aS1zb3J0YWJsZS1kcmFnZ2luZzpob3ZlciB7XG4gICAgY3Vyc29yOiBtb3ZlO1xuICAgIG9wYWNpdHk6IDAuNTtcbiAgfVxuXG4gIC51aS1zb3J0YWJsZS1wbGFjZWhvbGRlciB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuXG4gIC51aS1zb3J0YWJsZS1wbGFjZWhvbGRlci52aXNpYmxlIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBvcGFjaXR5OiAwO1xuICAgIHotaW5kZXg6IC0xO1xuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllck1hbmFnZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBfYWRkRW1wdHlOZXdMYXllciA9ICgpID0+IHtcbiAgICB0aGlzLnByb3BzLmFkZExheWVyKCk7XG4gIH07XG5cbiAgX2hhbmRsZVNvcnQgPSBvcmRlciA9PiB7XG4gICAgdGhpcy5wcm9wcy51cGRhdGVMYXllck9yZGVyKG9yZGVyKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2xheWVycywgZGF0YXNldHMsIGxheWVyT3JkZXIsIG9wZW5Nb2RhbH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGRlZmF1bHREYXRhc2V0ID0gT2JqZWN0LmtleXMoZGF0YXNldHMpWzBdO1xuXG4gICAgY29uc3QgbGF5ZXJBY3Rpb25zID0ge1xuICAgICAgbGF5ZXJDb25maWdDaGFuZ2U6IHRoaXMucHJvcHMubGF5ZXJDb25maWdDaGFuZ2UsXG4gICAgICBsYXllclZpc3VhbENoYW5uZWxDb25maWdDaGFuZ2U6IHRoaXMucHJvcHMubGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlLFxuICAgICAgbGF5ZXJUeXBlQ2hhbmdlOiB0aGlzLnByb3BzLmxheWVyVHlwZUNoYW5nZSxcbiAgICAgIGxheWVyVmlzQ29uZmlnQ2hhbmdlOiB0aGlzLnByb3BzLmxheWVyVmlzQ29uZmlnQ2hhbmdlLFxuICAgICAgcmVtb3ZlTGF5ZXI6IHRoaXMucHJvcHMucmVtb3ZlTGF5ZXJcbiAgICB9O1xuXG4gICAgY29uc3QgcGFuZWxQcm9wcyA9IHtkYXRhc2V0cywgb3Blbk1vZGFsfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkU29ydGFibGUgY2xhc3NOYW1lPVwibGF5ZXItbWFuYWdlclwiPlxuICAgICAgICA8U291cmNlRGF0YUNhdGFsb2dcbiAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgc2hvd0RhdGFzZXRUYWJsZT17dGhpcy5wcm9wcy5zaG93RGF0YXNldFRhYmxlfVxuICAgICAgICAgIHJlbW92ZURhdGFzZXQ9e3RoaXMucHJvcHMucmVtb3ZlRGF0YXNldH1cbiAgICAgICAgICBzaG93RGVsZXRlRGF0YXNldFxuICAgICAgICAvPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5zaG93QWRkRGF0YU1vZGFsfVxuICAgICAgICAgIGlzSW5hY3RpdmU9eyFkZWZhdWx0RGF0YXNldH1cbiAgICAgICAgICB3aWR0aD1cIjEwNXB4XCJcbiAgICAgICAgICBzZWNvbmRhcnlcbiAgICAgICAgPlxuICAgICAgICAgIDxBZGQgaGVpZ2h0PVwiMTJweFwiIC8+QWRkIERhdGFcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxTaWRlUGFuZWxEaXZpZGVyIC8+XG4gICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICAgIDxTb3J0YWJsZVxuICAgICAgICAgICAgb25Tb3J0PXt0aGlzLl9oYW5kbGVTb3J0fVxuICAgICAgICAgICAgZGlyZWN0aW9uPVwidmVydGljYWxcIlxuICAgICAgICAgICAgc29ydEhhbmRsZT1cInNvcnQtLWhhbmRsZVwiXG4gICAgICAgICAgICBkeW5hbWljXG4gICAgICAgICAgPlxuICAgICAgICAgICAge2xheWVyT3JkZXIubWFwKGlkeCA9PiAoXG4gICAgICAgICAgICAgIDxMYXllclBhbmVsXG4gICAgICAgICAgICAgICAgey4uLnBhbmVsUHJvcHN9XG4gICAgICAgICAgICAgICAgey4uLmxheWVyQWN0aW9uc31cbiAgICAgICAgICAgICAgICBzb3J0RGF0YT17aWR4fVxuICAgICAgICAgICAgICAgIGtleT17bGF5ZXJzW2lkeF0uaWR9XG4gICAgICAgICAgICAgICAgaWR4PXtpZHh9XG4gICAgICAgICAgICAgICAgbGF5ZXI9e2xheWVyc1tpZHhdfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9Tb3J0YWJsZT5cbiAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICB7ZGVmYXVsdERhdGFzZXQgPyAoXG4gICAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e3RoaXMuX2FkZEVtcHR5TmV3TGF5ZXJ9IHdpZHRoPVwiMTA1cHhcIj5cbiAgICAgICAgICAgICAgPEFkZCBoZWlnaHQ9XCIxMnB4XCIgLz5BZGQgTGF5ZXJcbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgIDxMYXllckJsZW5kaW5nU2VsZWN0b3JcbiAgICAgICAgICBsYXllckJsZW5kaW5nPXt0aGlzLnByb3BzLmxheWVyQmxlbmRpbmd9XG4gICAgICAgICAgdXBkYXRlTGF5ZXJCbGVuZGluZz17dGhpcy5wcm9wcy51cGRhdGVMYXllckJsZW5kaW5nfVxuICAgICAgICAvPlxuICAgICAgPC9TdHlsZWRTb3J0YWJsZT5cbiAgICApO1xuICB9XG59XG5cbkxheWVyTWFuYWdlci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmNvbnN0IExheWVyQmxlbmRpbmdTZWxlY3RvciA9ICh7bGF5ZXJCbGVuZGluZywgdXBkYXRlTGF5ZXJCbGVuZGluZ30pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgPFBhbmVsTGFiZWw+TGF5ZXIgQmxlbmRpbmc8L1BhbmVsTGFiZWw+XG4gICAgPEl0ZW1TZWxlY3RvclxuICAgICAgc2VsZWN0ZWRJdGVtcz17bGF5ZXJCbGVuZGluZ31cbiAgICAgIG9wdGlvbnM9e09iamVjdC5rZXlzKExBWUVSX0JMRU5ESU5HUyl9XG4gICAgICBtdWx0aVNlbGVjdD17ZmFsc2V9XG4gICAgICBzZWFyY2hhYmxlPXtmYWxzZX1cbiAgICAgIG9uQ2hhbmdlPXt1cGRhdGVMYXllckJsZW5kaW5nfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG4iXX0=