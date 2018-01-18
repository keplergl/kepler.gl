'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnableConfig = undefined;

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  border-left: 4px solid rgb(', ');\n  \n  .label-wrapper {\n    text-align: left;\n    padding-left: 4px !important;\n    \n    label {\n      color: ', ';\n      font-size: 12px;\n    }\n  }\n'], ['\n  border-left: 4px solid rgb(', ');\n  \n  .label-wrapper {\n    text-align: left;\n    padding-left: 4px !important;\n    \n    label {\n      color: ', ';\n      font-size: 12px;\n    }\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _visibilityToggle = require('./visibility-toggle');

var _visibilityToggle2 = _interopRequireDefault(_visibilityToggle);

var _icons = require('./icons');

var _styledComponents3 = require('./styled-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StyledLayerPanelItem = _styledComponents2.default.div(_templateObject, function (props) {
  return props.labelRCGColorValues.join(',');
}, function (props) {
  return props.theme.textColor;
});

var propTypes = {
  // required
  id: _react2.default.PropTypes.string.isRequired,
  isDragNDropEnabled: _react2.default.PropTypes.bool,
  isVisible: _react2.default.PropTypes.bool.isRequired,
  label: _react2.default.PropTypes.string.isRequired,
  onToggleVisibility: _react2.default.PropTypes.func.isRequired,

  // optional
  className: _react2.default.PropTypes.string,
  idx: _react2.default.PropTypes.number,
  isConfigActive: _react2.default.PropTypes.bool,
  labelRCGColorValues: _react2.default.PropTypes.array,
  onUpdateLayerLabel: _react2.default.PropTypes.func,
  removeLayer: _react2.default.PropTypes.func
};

var defaultProps = {
  isDragNDropEnabled: true,
  showRemoveLayer: true
};

var LayerPanelItem = function LayerPanelItem(_ref) {
  var className = _ref.className,
      idx = _ref.idx,
      isConfigActive = _ref.isConfigActive,
      isDragNDropEnabled = _ref.isDragNDropEnabled,
      isVisible = _ref.isVisible,
      label = _ref.label,
      layerId = _ref.layerId,
      labelRCGColorValues = _ref.labelRCGColorValues,
      onToggleVisibility = _ref.onToggleVisibility,
      onUpdateLayerLabel = _ref.onUpdateLayerLabel,
      onToggleEnableConfig = _ref.onToggleEnableConfig,
      removeLayer = _ref.removeLayer,
      showRemoveLayer = _ref.showRemoveLayer;
  return _react2.default.createElement(
    StyledLayerPanelItem,
    {
      className: (0, _classnames2.default)('soft-tiny--ends layout layout--flush\n           layer-panel__header', { 'sort--handle': !isConfigActive }),
      labelRCGColorValues: labelRCGColorValues,
      onClick: onToggleEnableConfig },
    _react2.default.createElement(
      'div',
      { className: 'layout__item two-thirds soft-tiny--left' },
      _react2.default.createElement(
        'div',
        { className: 'layer-panel-item layout layout--flush ' + className },
        isDragNDropEnabled && _react2.default.createElement(
          'div',
          {
            className: 'layout__item one-eighth layer__drag-handle' },
          _react2.default.createElement(_icons.VertDots, null)
        ),
        _react2.default.createElement(
          'div',
          { className: 'layout__item one-eighth' },
          _react2.default.createElement(_visibilityToggle2.default, {
            id: layerId,
            isVisible: isVisible,
            onClick: onToggleVisibility })
        ),
        _react2.default.createElement(
          'div',
          {
            className: 'label-wrapper layout__item three-quarters layer__title' },
          isConfigActive ? _react2.default.createElement(LayerLabelEditor, { label: label, onEdit: onUpdateLayerLabel }) : _react2.default.createElement(
            'label',
            null,
            label
          )
        )
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'layout__item one-third text--right soft-tiny--right' },
      showRemoveLayer && _react2.default.createElement(RemoveLayer, { idx: idx, removeLayer: removeLayer }),
      _react2.default.createElement(EnableConfig, {
        id: layerId,
        isActive: isConfigActive,
        onClick: onToggleEnableConfig })
    )
  );
};

LayerPanelItem.displayName = 'LayerPanelItem';
LayerPanelItem.propTypes = propTypes;
LayerPanelItem.defaultProps = defaultProps;

exports.default = LayerPanelItem;


var LayerLabelEditor = function LayerLabelEditor(_ref2) {
  var label = _ref2.label,
      onEdit = _ref2.onEdit;
  return _react2.default.createElement('input', {
    type: 'text',
    className: 'text-input text-input--borderless flush dark layer__title__editor',
    placeholder: label,
    value: label,
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    onChange: onEdit,
    id: 'input-layer-label' });
};

var EnableConfig = exports.EnableConfig = function EnableConfig(_ref3) {
  var id = _ref3.id,
      isActive = _ref3.isActive,
      onClick = _ref3.onClick,
      disableTooltip = _ref3.disableTooltip;
  return _react2.default.createElement(
    'span',
    { className: 'push-tiny--left layer--toggle' },
    _react2.default.createElement(
      'a',
      { className: 'hover align--middle', 'data-tip': true, 'data-for': 'enable-' + id,
        onClick: onClick },
      _react2.default.createElement('i', { className: (0, _classnames2.default)('icon icon_down-arrow epsilon', {
          'text-uber-blue': isActive
        }) }),
      !disableTooltip && _react2.default.createElement(
        _styledComponents3.Tooltip,
        { id: 'enable-' + id, effect: 'solid' },
        _react2.default.createElement(
          'span',
          null,
          'Settings'
        )
      )
    )
  );
};

var RemoveLayer = function RemoveLayer(_ref4) {
  var idx = _ref4.idx,
      removeLayer = _ref4.removeLayer;
  return _react2.default.createElement(
    'span',
    { className: 'push-tiny--left layer--toggle' },
    _react2.default.createElement(
      'a',
      { className: 'hover align--middle', 'data-tip': true, 'data-for': 'delete-' + idx,
        onClick: function onClick(e) {
          e.stopPropagation();removeLayer(idx);
        } },
      _react2.default.createElement('i', { className: 'icon icon_trash epsilon' }),
      _react2.default.createElement(
        _styledComponents3.Tooltip,
        { id: 'delete-' + idx, effect: 'solid', type: 'error' },
        _react2.default.createElement(
          'span',
          null,
          'Remove layer'
        )
      )
    )
  );
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9sYXllci1wYW5lbC1pdGVtLmpzIl0sIm5hbWVzIjpbIlN0eWxlZExheWVyUGFuZWxJdGVtIiwiZGl2IiwicHJvcHMiLCJsYWJlbFJDR0NvbG9yVmFsdWVzIiwiam9pbiIsInRoZW1lIiwidGV4dENvbG9yIiwicHJvcFR5cGVzIiwiaWQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiaXNEcmFnTkRyb3BFbmFibGVkIiwiYm9vbCIsImlzVmlzaWJsZSIsImxhYmVsIiwib25Ub2dnbGVWaXNpYmlsaXR5IiwiZnVuYyIsImNsYXNzTmFtZSIsImlkeCIsIm51bWJlciIsImlzQ29uZmlnQWN0aXZlIiwiYXJyYXkiLCJvblVwZGF0ZUxheWVyTGFiZWwiLCJyZW1vdmVMYXllciIsImRlZmF1bHRQcm9wcyIsInNob3dSZW1vdmVMYXllciIsIkxheWVyUGFuZWxJdGVtIiwibGF5ZXJJZCIsIm9uVG9nZ2xlRW5hYmxlQ29uZmlnIiwiZGlzcGxheU5hbWUiLCJMYXllckxhYmVsRWRpdG9yIiwib25FZGl0IiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIkVuYWJsZUNvbmZpZyIsImlzQWN0aXZlIiwib25DbGljayIsImRpc2FibGVUb29sdGlwIiwiUmVtb3ZlTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTUEsdUJBQXVCLDJCQUFPQyxHQUE5QixrQkFDeUI7QUFBQSxTQUFTQyxNQUFNQyxtQkFBTixDQUEwQkMsSUFBMUIsQ0FBK0IsR0FBL0IsQ0FBVDtBQUFBLENBRHpCLEVBUVM7QUFBQSxTQUFTRixNQUFNRyxLQUFOLENBQVlDLFNBQXJCO0FBQUEsQ0FSVCxDQUFOOztBQWNBLElBQU1DLFlBQVk7QUFDaEI7QUFDQUMsTUFBSSxnQkFBTUMsU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBRlg7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O0FBR0U7QUFBQTtBQUFBLFVBQVMsZ0JBQWNBLEdBQXZCLEVBQThCLFFBQU8sT0FBckMsRUFBNkMsTUFBSyxPQUFsRDtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQUhGO0FBREYsR0FEa0I7QUFBQSxDQUFwQiIsImZpbGUiOiJsYXllci1wYW5lbC1pdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgVmlzaWJpbGl0eVRvZ2dsZSBmcm9tICcuL3Zpc2liaWxpdHktdG9nZ2xlJztcbmltcG9ydCB7VmVydERvdHN9IGZyb20gJy4vaWNvbnMnO1xuaW1wb3J0IHtUb29sdGlwfSBmcm9tICcuL3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgU3R5bGVkTGF5ZXJQYW5lbEl0ZW0gPSBzdHlsZWQuZGl2YFxuICBib3JkZXItbGVmdDogNHB4IHNvbGlkIHJnYigke3Byb3BzID0+IHByb3BzLmxhYmVsUkNHQ29sb3JWYWx1ZXMuam9pbignLCcpfSk7XG4gIFxuICAubGFiZWwtd3JhcHBlciB7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBwYWRkaW5nLWxlZnQ6IDRweCAhaW1wb3J0YW50O1xuICAgIFxuICAgIGxhYmVsIHtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gICAgICBmb250LXNpemU6IDEycHg7XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIC8vIHJlcXVpcmVkXG4gIGlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGlzRHJhZ05Ecm9wRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIGlzVmlzaWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgb25Ub2dnbGVWaXNpYmlsaXR5OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gIC8vIG9wdGlvbmFsXG4gIGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgaWR4OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBpc0NvbmZpZ0FjdGl2ZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIGxhYmVsUkNHQ29sb3JWYWx1ZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcbiAgb25VcGRhdGVMYXllckxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgcmVtb3ZlTGF5ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGlzRHJhZ05Ecm9wRW5hYmxlZDogdHJ1ZSxcbiAgc2hvd1JlbW92ZUxheWVyOiB0cnVlXG59O1xuXG5jb25zdCBMYXllclBhbmVsSXRlbSA9ICh7XG4gIGNsYXNzTmFtZSwgaWR4LCBpc0NvbmZpZ0FjdGl2ZSxcbiAgaXNEcmFnTkRyb3BFbmFibGVkLCBpc1Zpc2libGUsIGxhYmVsLFxuICBsYXllcklkLCBsYWJlbFJDR0NvbG9yVmFsdWVzLCBvblRvZ2dsZVZpc2liaWxpdHksXG4gIG9uVXBkYXRlTGF5ZXJMYWJlbCwgb25Ub2dnbGVFbmFibGVDb25maWcsIHJlbW92ZUxheWVyLFxuICBzaG93UmVtb3ZlTGF5ZXJcbn0pID0+IChcbiAgPFN0eWxlZExheWVyUGFuZWxJdGVtXG4gICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGBzb2Z0LXRpbnktLWVuZHMgbGF5b3V0IGxheW91dC0tZmx1c2hcbiAgICAgICAgICAgbGF5ZXItcGFuZWxfX2hlYWRlcmAsIHsnc29ydC0taGFuZGxlJzogIWlzQ29uZmlnQWN0aXZlfSl9XG4gICAgbGFiZWxSQ0dDb2xvclZhbHVlcz17bGFiZWxSQ0dDb2xvclZhbHVlc31cbiAgICBvbkNsaWNrPXtvblRvZ2dsZUVuYWJsZUNvbmZpZ30+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJsYXlvdXRfX2l0ZW0gdHdvLXRoaXJkcyBzb2Z0LXRpbnktLWxlZnRcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgbGF5ZXItcGFuZWwtaXRlbSBsYXlvdXQgbGF5b3V0LS1mbHVzaCAke2NsYXNzTmFtZX1gfT5cbiAgICAgICAge1xuICAgICAgICAgIGlzRHJhZ05Ecm9wRW5hYmxlZCAmJiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxheW91dF9faXRlbSBvbmUtZWlnaHRoIGxheWVyX19kcmFnLWhhbmRsZVwiPlxuICAgICAgICAgICAgICA8VmVydERvdHMvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGF5b3V0X19pdGVtIG9uZS1laWdodGhcIj5cbiAgICAgICAgICA8VmlzaWJpbGl0eVRvZ2dsZVxuICAgICAgICAgICAgaWQ9e2xheWVySWR9XG4gICAgICAgICAgICBpc1Zpc2libGU9e2lzVmlzaWJsZX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e29uVG9nZ2xlVmlzaWJpbGl0eX0vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cImxhYmVsLXdyYXBwZXIgbGF5b3V0X19pdGVtIHRocmVlLXF1YXJ0ZXJzIGxheWVyX190aXRsZVwiPlxuICAgICAgICAgIHtpc0NvbmZpZ0FjdGl2ZSA/XG4gICAgICAgICAgICA8TGF5ZXJMYWJlbEVkaXRvciBsYWJlbD17bGFiZWx9IG9uRWRpdD17b25VcGRhdGVMYXllckxhYmVsfS8+IDpcbiAgICAgICAgICAgIDxsYWJlbD57bGFiZWx9PC9sYWJlbD5cbiAgICAgICAgICB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJsYXlvdXRfX2l0ZW0gb25lLXRoaXJkIHRleHQtLXJpZ2h0IHNvZnQtdGlueS0tcmlnaHRcIj5cbiAgICAgIHtzaG93UmVtb3ZlTGF5ZXIgJiYgKDxSZW1vdmVMYXllciBpZHg9e2lkeH0gcmVtb3ZlTGF5ZXI9e3JlbW92ZUxheWVyfS8+KX1cbiAgICAgIDxFbmFibGVDb25maWdcbiAgICAgICAgaWQ9e2xheWVySWR9XG4gICAgICAgIGlzQWN0aXZlPXtpc0NvbmZpZ0FjdGl2ZX1cbiAgICAgICAgb25DbGljaz17b25Ub2dnbGVFbmFibGVDb25maWd9Lz5cbiAgICA8L2Rpdj5cbiAgPC9TdHlsZWRMYXllclBhbmVsSXRlbT5cbik7XG5cbkxheWVyUGFuZWxJdGVtLmRpc3BsYXlOYW1lID0gJ0xheWVyUGFuZWxJdGVtJztcbkxheWVyUGFuZWxJdGVtLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbkxheWVyUGFuZWxJdGVtLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuZXhwb3J0IGRlZmF1bHQgTGF5ZXJQYW5lbEl0ZW07XG5cbmNvbnN0IExheWVyTGFiZWxFZGl0b3IgPSAoe2xhYmVsLCBvbkVkaXR9KSA9PiAoXG4gIDxpbnB1dFxuICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICBjbGFzc05hbWU9XCJ0ZXh0LWlucHV0IHRleHQtaW5wdXQtLWJvcmRlcmxlc3MgZmx1c2ggZGFyayBsYXllcl9fdGl0bGVfX2VkaXRvclwiXG4gICAgcGxhY2Vob2xkZXI9e2xhYmVsfVxuICAgIHZhbHVlPXtsYWJlbH1cbiAgICBvbkNsaWNrPXtlID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgb25DaGFuZ2U9e29uRWRpdH1cbiAgICBpZD1cImlucHV0LWxheWVyLWxhYmVsXCIgLz5cbik7XG5cbmV4cG9ydCBjb25zdCBFbmFibGVDb25maWcgPSAoe2lkLCBpc0FjdGl2ZSwgb25DbGljaywgZGlzYWJsZVRvb2x0aXB9KSA9PiAoXG4gIDxzcGFuIGNsYXNzTmFtZT1cInB1c2gtdGlueS0tbGVmdCBsYXllci0tdG9nZ2xlXCI+XG4gICAgPGEgY2xhc3NOYW1lPVwiaG92ZXIgYWxpZ24tLW1pZGRsZVwiIGRhdGEtdGlwIGRhdGEtZm9yPXtgZW5hYmxlLSR7aWR9YH1cbiAgICAgICBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICAgIDxpIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnaWNvbiBpY29uX2Rvd24tYXJyb3cgZXBzaWxvbicsIHtcbiAgICAgICAgJ3RleHQtdWJlci1ibHVlJzogaXNBY3RpdmVcbiAgICAgIH0pfS8+XG4gICAgICB7IWRpc2FibGVUb29sdGlwICYmIDxUb29sdGlwIGlkPXtgZW5hYmxlLSR7aWR9YH0gZWZmZWN0PVwic29saWRcIj5cbiAgICAgICAgPHNwYW4+U2V0dGluZ3M8L3NwYW4+XG4gICAgICA8L1Rvb2x0aXA+fVxuICAgIDwvYT5cbiAgPC9zcGFuPlxuKTtcblxuY29uc3QgUmVtb3ZlTGF5ZXIgPSAoe2lkeCwgcmVtb3ZlTGF5ZXJ9KSA9PiAoXG4gIDxzcGFuIGNsYXNzTmFtZT1cInB1c2gtdGlueS0tbGVmdCBsYXllci0tdG9nZ2xlXCI+XG4gICAgPGEgY2xhc3NOYW1lPVwiaG92ZXIgYWxpZ24tLW1pZGRsZVwiIGRhdGEtdGlwIGRhdGEtZm9yPXtgZGVsZXRlLSR7aWR4fWB9XG4gICAgICAgb25DbGljaz17KGUpID0+IHtlLnN0b3BQcm9wYWdhdGlvbigpOyByZW1vdmVMYXllcihpZHgpO319PlxuICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uX3RyYXNoIGVwc2lsb25cIi8+XG4gICAgICA8VG9vbHRpcCBpZD17YGRlbGV0ZS0ke2lkeH1gfSBlZmZlY3Q9XCJzb2xpZFwiIHR5cGU9XCJlcnJvclwiPlxuICAgICAgICA8c3Bhbj5SZW1vdmUgbGF5ZXI8L3NwYW4+XG4gICAgICA8L1Rvb2x0aXA+XG4gICAgPC9hPlxuICA8L3NwYW4+XG4pO1xuIl19