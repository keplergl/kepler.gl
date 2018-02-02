'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _class;

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  font-size: 12px;\n  border-radius: 1px;\n  margin-bottom: 8px;\n  \n  &.dragging {\n    cursor: move;\n  }\n'], ['\n  font-size: 12px;\n  border-radius: 1px;\n  margin-bottom: 8px;\n  \n  &.dragging {\n    cursor: move;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactAnythingSortable = require('react-anything-sortable');

var _layerConfigurator = require('./layer-configurator');

var _layerConfigurator2 = _interopRequireDefault(_layerConfigurator);

var _layerPanelHeader = require('./layer-panel-header');

var _layerPanelHeader2 = _interopRequireDefault(_layerPanelHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  layer: _propTypes2.default.object.isRequired,
  datasets: _propTypes2.default.object.isRequired,
  idx: _propTypes2.default.number.isRequired,
  layerConfigChange: _propTypes2.default.func.isRequired,
  layerTypeChange: _propTypes2.default.func.isRequired,
  openModal: _propTypes2.default.func.isRequired,
  removeLayer: _propTypes2.default.func.isRequired,
  onCloseConfig: _propTypes2.default.func,

  layerVisConfigChange: _propTypes2.default.func,
  layerVisualChannelConfigChange: _propTypes2.default.func
};

var PanelWrapper = _styledComponents2.default.div(_templateObject);

var LayerPanel = (0, _reactAnythingSortable.sortable)(_class = function (_Component) {
  (0, _inherits3.default)(LayerPanel, _Component);

  function LayerPanel() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, LayerPanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.updateLayerConfig = function (newProp) {
      _this.props.layerConfigChange(_this.props.layer, newProp);
    }, _this.updateLayerType = function (newType) {
      _this.props.layerTypeChange(_this.props.layer, newType);
    }, _this.updateLayerVisConfig = function (newVisConfig) {
      _this.props.layerVisConfigChange(_this.props.layer, newVisConfig);
    }, _this.updateLayerVisualChannelConfig = function (newConfig, channel, scaleKey) {
      _this.props.layerVisualChannelConfigChange(_this.props.layer, newConfig, channel, scaleKey);
    }, _this._updateLayerLabel = function (_ref) {
      var value = _ref.target.value;

      _this.updateLayerConfig({ label: value });
    }, _this._toggleVisibility = function (e) {
      e.stopPropagation();
      var isVisible = !_this.props.layer.config.isVisible;
      _this.updateLayerConfig({ isVisible: isVisible });
    }, _this._toggleEnableConfig = function (e) {
      e.stopPropagation();
      var isConfigActive = _this.props.layer.config.isConfigActive;

      _this.updateLayerConfig({ isConfigActive: !isConfigActive });
    }, _this._removeLayer = function (e) {
      e.stopPropagation();
      _this.props.removeLayer(_this.props.idx);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  LayerPanel.prototype.render = function render() {
    var _props = this.props,
        layer = _props.layer,
        idx = _props.idx,
        datasets = _props.datasets;
    var config = layer.config;
    var isConfigActive = config.isConfigActive;


    return _react2.default.createElement(
      PanelWrapper,
      {
        active: isConfigActive,
        className: 'layer-panel ' + this.props.className,
        style: this.props.style,
        onMouseDown: this.props.onMouseDown,
        onTouchStart: this.props.onTouchStart
      },
      _react2.default.createElement(_layerPanelHeader2.default, {
        isConfigActive: isConfigActive,
        id: layer.id,
        idx: idx,
        isVisible: config.isVisible,
        label: config.label,
        labelRCGColorValues: datasets[config.dataId].color,
        layerType: layer.type,
        onToggleEnableConfig: this._toggleEnableConfig,
        onToggleVisibility: this._toggleVisibility,
        onUpdateLayerLabel: this._updateLayerLabel,
        onRemoveLayer: this._removeLayer
      }),
      isConfigActive && _react2.default.createElement(_layerConfigurator2.default, {
        layer: layer,
        datasets: datasets,
        openModal: this.props.openModal,
        updateLayerConfig: this.updateLayerConfig,
        updateLayerVisualChannelConfig: this.updateLayerVisualChannelConfig,
        updateLayerType: this.updateLayerType,
        updateLayerVisConfig: this.updateLayerVisConfig
      })
    );
  };

  return LayerPanel;
}(_react.Component)) || _class;

exports.default = LayerPanel;


LayerPanel.propTypes = propTypes;
LayerPanel.displayName = 'LayerPanel';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItcGFuZWwuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwibGF5ZXIiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZGF0YXNldHMiLCJpZHgiLCJudW1iZXIiLCJsYXllckNvbmZpZ0NoYW5nZSIsImZ1bmMiLCJsYXllclR5cGVDaGFuZ2UiLCJvcGVuTW9kYWwiLCJyZW1vdmVMYXllciIsIm9uQ2xvc2VDb25maWciLCJsYXllclZpc0NvbmZpZ0NoYW5nZSIsImxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZSIsIlBhbmVsV3JhcHBlciIsImRpdiIsIkxheWVyUGFuZWwiLCJ1cGRhdGVMYXllckNvbmZpZyIsInByb3BzIiwibmV3UHJvcCIsInVwZGF0ZUxheWVyVHlwZSIsIm5ld1R5cGUiLCJ1cGRhdGVMYXllclZpc0NvbmZpZyIsIm5ld1Zpc0NvbmZpZyIsInVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZyIsIm5ld0NvbmZpZyIsImNoYW5uZWwiLCJzY2FsZUtleSIsIl91cGRhdGVMYXllckxhYmVsIiwidmFsdWUiLCJ0YXJnZXQiLCJsYWJlbCIsIl90b2dnbGVWaXNpYmlsaXR5IiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsImlzVmlzaWJsZSIsImNvbmZpZyIsIl90b2dnbGVFbmFibGVDb25maWciLCJpc0NvbmZpZ0FjdGl2ZSIsIl9yZW1vdmVMYXllciIsInJlbmRlciIsImNsYXNzTmFtZSIsInN0eWxlIiwib25Nb3VzZURvd24iLCJvblRvdWNoU3RhcnQiLCJpZCIsImRhdGFJZCIsImNvbG9yIiwidHlwZSIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxTQUFPLG9CQUFV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Z0JOLGNBRGxCO0FBRUUsWUFBSXRDLE1BQU02QyxFQUZaO0FBR0UsYUFBS3pDLEdBSFA7QUFJRSxtQkFBV2dDLE9BQU9ELFNBSnBCO0FBS0UsZUFBT0MsT0FBT0wsS0FMaEI7QUFNRSw2QkFBcUI1QixTQUFTaUMsT0FBT1UsTUFBaEIsRUFBd0JDLEtBTi9DO0FBT0UsbUJBQVcvQyxNQUFNZ0QsSUFQbkI7QUFRRSw4QkFBc0IsS0FBS1gsbUJBUjdCO0FBU0UsNEJBQW9CLEtBQUtMLGlCQVQzQjtBQVVFLDRCQUFvQixLQUFLSixpQkFWM0I7QUFXRSx1QkFBZSxLQUFLVztBQVh0QixRQVBGO0FBb0JHRCx3QkFDQztBQUNFLGVBQU90QyxLQURUO0FBRUUsa0JBQVVHLFFBRlo7QUFHRSxtQkFBVyxLQUFLZSxLQUFMLENBQVdULFNBSHhCO0FBSUUsMkJBQW1CLEtBQUtRLGlCQUoxQjtBQUtFLHdDQUFnQyxLQUFLTyw4QkFMdkM7QUFNRSx5QkFBaUIsS0FBS0osZUFOeEI7QUFPRSw4QkFBc0IsS0FBS0U7QUFQN0I7QUFyQkosS0FERjtBQWtDRCxHOzs7OztrQkFqRmtCTixVOzs7QUFvRnJCQSxXQUFXakIsU0FBWCxHQUF1QkEsU0FBdkI7QUFDQWlCLFdBQVdpQyxXQUFYLEdBQXlCLFlBQXpCIiwiZmlsZSI6ImxheWVyLXBhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge3NvcnRhYmxlfSBmcm9tICdyZWFjdC1hbnl0aGluZy1zb3J0YWJsZSc7XG5cbmltcG9ydCBMYXllckNvbmZpZ3VyYXRvciBmcm9tICcuL2xheWVyLWNvbmZpZ3VyYXRvcic7XG5pbXBvcnQgTGF5ZXJQYW5lbEhlYWRlciBmcm9tICcuL2xheWVyLXBhbmVsLWhlYWRlcic7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgbGF5ZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZGF0YXNldHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgaWR4OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGxheWVyQ29uZmlnQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBsYXllclR5cGVDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9wZW5Nb2RhbDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVtb3ZlTGF5ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uQ2xvc2VDb25maWc6IFByb3BUeXBlcy5mdW5jLFxuXG4gIGxheWVyVmlzQ29uZmlnQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgbGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuY29uc3QgUGFuZWxXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZm9udC1zaXplOiAxMnB4O1xuICBib3JkZXItcmFkaXVzOiAxcHg7XG4gIG1hcmdpbi1ib3R0b206IDhweDtcbiAgXG4gICYuZHJhZ2dpbmcge1xuICAgIGN1cnNvcjogbW92ZTtcbiAgfVxuYDtcblxuQHNvcnRhYmxlXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllclBhbmVsIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgdXBkYXRlTGF5ZXJDb25maWcgPSBuZXdQcm9wID0+IHtcbiAgICB0aGlzLnByb3BzLmxheWVyQ29uZmlnQ2hhbmdlKHRoaXMucHJvcHMubGF5ZXIsIG5ld1Byb3ApO1xuICB9O1xuXG4gIHVwZGF0ZUxheWVyVHlwZSA9IG5ld1R5cGUgPT4ge1xuICAgIHRoaXMucHJvcHMubGF5ZXJUeXBlQ2hhbmdlKHRoaXMucHJvcHMubGF5ZXIsIG5ld1R5cGUpO1xuICB9O1xuXG4gIHVwZGF0ZUxheWVyVmlzQ29uZmlnID0gbmV3VmlzQ29uZmlnID0+IHtcbiAgICB0aGlzLnByb3BzLmxheWVyVmlzQ29uZmlnQ2hhbmdlKHRoaXMucHJvcHMubGF5ZXIsIG5ld1Zpc0NvbmZpZyk7XG4gIH07XG5cbiAgdXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnID0gKG5ld0NvbmZpZywgY2hhbm5lbCwgc2NhbGVLZXkpID0+IHtcbiAgICB0aGlzLnByb3BzLmxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ0NoYW5nZShcbiAgICAgIHRoaXMucHJvcHMubGF5ZXIsXG4gICAgICBuZXdDb25maWcsXG4gICAgICBjaGFubmVsLFxuICAgICAgc2NhbGVLZXlcbiAgICApO1xuICB9O1xuXG4gIF91cGRhdGVMYXllckxhYmVsID0gKHt0YXJnZXQ6IHt2YWx1ZX19KSA9PiB7XG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7bGFiZWw6IHZhbHVlfSk7XG4gIH07XG5cbiAgX3RvZ2dsZVZpc2liaWxpdHkgPSBlID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IGlzVmlzaWJsZSA9ICF0aGlzLnByb3BzLmxheWVyLmNvbmZpZy5pc1Zpc2libGU7XG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7aXNWaXNpYmxlfSk7XG4gIH07XG5cbiAgX3RvZ2dsZUVuYWJsZUNvbmZpZyA9IGUgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3Qge2xheWVyOiB7Y29uZmlnOiB7aXNDb25maWdBY3RpdmV9fX0gPSB0aGlzLnByb3BzO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJDb25maWcoe2lzQ29uZmlnQWN0aXZlOiAhaXNDb25maWdBY3RpdmV9KTtcbiAgfTtcblxuICBfcmVtb3ZlTGF5ZXIgPSBlID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMucHJvcHMucmVtb3ZlTGF5ZXIodGhpcy5wcm9wcy5pZHgpO1xuICB9O1xuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2xheWVyLCBpZHgsIGRhdGFzZXRzfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2NvbmZpZ30gPSBsYXllcjtcbiAgICBjb25zdCB7aXNDb25maWdBY3RpdmV9ID0gY29uZmlnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxQYW5lbFdyYXBwZXJcbiAgICAgICAgYWN0aXZlPXtpc0NvbmZpZ0FjdGl2ZX1cbiAgICAgICAgY2xhc3NOYW1lPXtgbGF5ZXItcGFuZWwgJHt0aGlzLnByb3BzLmNsYXNzTmFtZX1gfVxuICAgICAgICBzdHlsZT17dGhpcy5wcm9wcy5zdHlsZX1cbiAgICAgICAgb25Nb3VzZURvd249e3RoaXMucHJvcHMub25Nb3VzZURvd259XG4gICAgICAgIG9uVG91Y2hTdGFydD17dGhpcy5wcm9wcy5vblRvdWNoU3RhcnR9XG4gICAgICA+XG4gICAgICAgIDxMYXllclBhbmVsSGVhZGVyXG4gICAgICAgICAgaXNDb25maWdBY3RpdmU9e2lzQ29uZmlnQWN0aXZlfVxuICAgICAgICAgIGlkPXtsYXllci5pZH1cbiAgICAgICAgICBpZHg9e2lkeH1cbiAgICAgICAgICBpc1Zpc2libGU9e2NvbmZpZy5pc1Zpc2libGV9XG4gICAgICAgICAgbGFiZWw9e2NvbmZpZy5sYWJlbH1cbiAgICAgICAgICBsYWJlbFJDR0NvbG9yVmFsdWVzPXtkYXRhc2V0c1tjb25maWcuZGF0YUlkXS5jb2xvcn1cbiAgICAgICAgICBsYXllclR5cGU9e2xheWVyLnR5cGV9XG4gICAgICAgICAgb25Ub2dnbGVFbmFibGVDb25maWc9e3RoaXMuX3RvZ2dsZUVuYWJsZUNvbmZpZ31cbiAgICAgICAgICBvblRvZ2dsZVZpc2liaWxpdHk9e3RoaXMuX3RvZ2dsZVZpc2liaWxpdHl9XG4gICAgICAgICAgb25VcGRhdGVMYXllckxhYmVsPXt0aGlzLl91cGRhdGVMYXllckxhYmVsfVxuICAgICAgICAgIG9uUmVtb3ZlTGF5ZXI9e3RoaXMuX3JlbW92ZUxheWVyfVxuICAgICAgICAvPlxuICAgICAgICB7aXNDb25maWdBY3RpdmUgJiYgKFxuICAgICAgICAgIDxMYXllckNvbmZpZ3VyYXRvclxuICAgICAgICAgICAgbGF5ZXI9e2xheWVyfVxuICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgb3Blbk1vZGFsPXt0aGlzLnByb3BzLm9wZW5Nb2RhbH1cbiAgICAgICAgICAgIHVwZGF0ZUxheWVyQ29uZmlnPXt0aGlzLnVwZGF0ZUxheWVyQ29uZmlnfVxuICAgICAgICAgICAgdXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnPXt0aGlzLnVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZ31cbiAgICAgICAgICAgIHVwZGF0ZUxheWVyVHlwZT17dGhpcy51cGRhdGVMYXllclR5cGV9XG4gICAgICAgICAgICB1cGRhdGVMYXllclZpc0NvbmZpZz17dGhpcy51cGRhdGVMYXllclZpc0NvbmZpZ31cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9QYW5lbFdyYXBwZXI+XG4gICAgKTtcbiAgfVxufVxuXG5MYXllclBhbmVsLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbkxheWVyUGFuZWwuZGlzcGxheU5hbWUgPSAnTGF5ZXJQYW5lbCc7XG4iXX0=