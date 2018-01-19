'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnableConfig = undefined;

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  border-left: 4px solid rgb(', ');\n\n  .label-wrapper {\n    text-align: left;\n    padding-left: 4px !important;\n\n    label {\n      color: ', ';\n      font-size: 12px;\n    }\n  }\n'], ['\n  border-left: 4px solid rgb(', ');\n\n  .label-wrapper {\n    text-align: left;\n    padding-left: 4px !important;\n\n    label {\n      color: ', ';\n      font-size: 12px;\n    }\n  }\n']);

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
      onClick: onToggleEnableConfig
    },
    _react2.default.createElement(
      'div',
      { className: 'layout__item two-thirds soft-tiny--left' },
      _react2.default.createElement(
        'div',
        { className: 'layer-panel-item layout layout--flush ' + className },
        isDragNDropEnabled && _react2.default.createElement(
          'div',
          { className: 'layout__item one-eighth layer__drag-handle' },
          _react2.default.createElement(_icons.VertDots, null)
        ),
        _react2.default.createElement(
          'div',
          { className: 'layout__item one-eighth' },
          _react2.default.createElement(_visibilityToggle2.default, {
            id: layerId,
            isVisible: isVisible,
            onClick: onToggleVisibility
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'label-wrapper layout__item three-quarters layer__title' },
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
        onClick: onToggleEnableConfig
      })
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
    id: 'input-layer-label'
  });
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
      {
        className: 'hover align--middle',
        'data-tip': true,
        'data-for': 'enable-' + id,
        onClick: onClick
      },
      _react2.default.createElement('i', {
        className: (0, _classnames2.default)('icon icon_down-arrow epsilon', {
          'text-uber-blue': isActive
        })
      }),
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
      {
        className: 'hover align--middle',
        'data-tip': true,
        'data-for': 'delete-' + idx,
        onClick: function onClick(e) {
          e.stopPropagation();
          removeLayer(idx);
        }
      },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9sYXllci1wYW5lbC1pdGVtLmpzIl0sIm5hbWVzIjpbIlN0eWxlZExheWVyUGFuZWxJdGVtIiwiZGl2IiwicHJvcHMiLCJsYWJlbFJDR0NvbG9yVmFsdWVzIiwiam9pbiIsInRoZW1lIiwidGV4dENvbG9yIiwicHJvcFR5cGVzIiwiaWQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiaXNEcmFnTkRyb3BFbmFibGVkIiwiYm9vbCIsImlzVmlzaWJsZSIsImxhYmVsIiwib25Ub2dnbGVWaXNpYmlsaXR5IiwiZnVuYyIsImNsYXNzTmFtZSIsImlkeCIsIm51bWJlciIsImlzQ29uZmlnQWN0aXZlIiwiYXJyYXkiLCJvblVwZGF0ZUxheWVyTGFiZWwiLCJyZW1vdmVMYXllciIsImRlZmF1bHRQcm9wcyIsInNob3dSZW1vdmVMYXllciIsIkxheWVyUGFuZWxJdGVtIiwibGF5ZXJJZCIsIm9uVG9nZ2xlRW5hYmxlQ29uZmlnIiwiZGlzcGxheU5hbWUiLCJMYXllckxhYmVsRWRpdG9yIiwib25FZGl0IiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIkVuYWJsZUNvbmZpZyIsImlzQWN0aXZlIiwib25DbGljayIsImRpc2FibGVUb29sdGlwIiwiUmVtb3ZlTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTUEsdUJBQXVCLDJCQUFPQyxHQUE5QixrQkFDeUI7QUFBQSxTQUFTQyxNQUFNQyxtQkFBTixDQUEwQkMsSUFBMUIsQ0FBK0IsR0FBL0IsQ0FBVDtBQUFBLENBRHpCLEVBUVM7QUFBQSxTQUFTRixNQUFNRyxLQUFOLENBQVlDLFNBQXJCO0FBQUEsQ0FSVCxDQUFOOztBQWNBLElBQU1DLFlBQVk7QUFDaEI7QUFDQUMsTUFBSSxnQkFBTUMsU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBRlg7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O0FBVUU7QUFBQTtBQUFBLFVBQVMsZ0JBQWNBLEdBQXZCLEVBQThCLFFBQU8sT0FBckMsRUFBNkMsTUFBSyxPQUFsRDtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQVZGO0FBREYsR0FEa0I7QUFBQSxDQUFwQiIsImZpbGUiOiJsYXllci1wYW5lbC1pdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgVmlzaWJpbGl0eVRvZ2dsZSBmcm9tICcuL3Zpc2liaWxpdHktdG9nZ2xlJztcbmltcG9ydCB7VmVydERvdHN9IGZyb20gJy4vaWNvbnMnO1xuaW1wb3J0IHtUb29sdGlwfSBmcm9tICcuL3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgU3R5bGVkTGF5ZXJQYW5lbEl0ZW0gPSBzdHlsZWQuZGl2YFxuICBib3JkZXItbGVmdDogNHB4IHNvbGlkIHJnYigke3Byb3BzID0+IHByb3BzLmxhYmVsUkNHQ29sb3JWYWx1ZXMuam9pbignLCcpfSk7XG5cbiAgLmxhYmVsLXdyYXBwZXIge1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgcGFkZGluZy1sZWZ0OiA0cHggIWltcG9ydGFudDtcblxuICAgIGxhYmVsIHtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gICAgICBmb250LXNpemU6IDEycHg7XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIC8vIHJlcXVpcmVkXG4gIGlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGlzRHJhZ05Ecm9wRW5hYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIGlzVmlzaWJsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgb25Ub2dnbGVWaXNpYmlsaXR5OiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gIC8vIG9wdGlvbmFsXG4gIGNsYXNzTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgaWR4OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICBpc0NvbmZpZ0FjdGl2ZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gIGxhYmVsUkNHQ29sb3JWYWx1ZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcbiAgb25VcGRhdGVMYXllckxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgcmVtb3ZlTGF5ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGlzRHJhZ05Ecm9wRW5hYmxlZDogdHJ1ZSxcbiAgc2hvd1JlbW92ZUxheWVyOiB0cnVlXG59O1xuXG5jb25zdCBMYXllclBhbmVsSXRlbSA9ICh7XG4gIGNsYXNzTmFtZSxcbiAgaWR4LFxuICBpc0NvbmZpZ0FjdGl2ZSxcbiAgaXNEcmFnTkRyb3BFbmFibGVkLFxuICBpc1Zpc2libGUsXG4gIGxhYmVsLFxuICBsYXllcklkLFxuICBsYWJlbFJDR0NvbG9yVmFsdWVzLFxuICBvblRvZ2dsZVZpc2liaWxpdHksXG4gIG9uVXBkYXRlTGF5ZXJMYWJlbCxcbiAgb25Ub2dnbGVFbmFibGVDb25maWcsXG4gIHJlbW92ZUxheWVyLFxuICBzaG93UmVtb3ZlTGF5ZXJcbn0pID0+IChcbiAgPFN0eWxlZExheWVyUGFuZWxJdGVtXG4gICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFxuICAgICAgYHNvZnQtdGlueS0tZW5kcyBsYXlvdXQgbGF5b3V0LS1mbHVzaFxuICAgICAgICAgICBsYXllci1wYW5lbF9faGVhZGVyYCxcbiAgICAgIHsnc29ydC0taGFuZGxlJzogIWlzQ29uZmlnQWN0aXZlfVxuICAgICl9XG4gICAgbGFiZWxSQ0dDb2xvclZhbHVlcz17bGFiZWxSQ0dDb2xvclZhbHVlc31cbiAgICBvbkNsaWNrPXtvblRvZ2dsZUVuYWJsZUNvbmZpZ31cbiAgPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwibGF5b3V0X19pdGVtIHR3by10aGlyZHMgc29mdC10aW55LS1sZWZ0XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YGxheWVyLXBhbmVsLWl0ZW0gbGF5b3V0IGxheW91dC0tZmx1c2ggJHtjbGFzc05hbWV9YH0+XG4gICAgICAgIHtpc0RyYWdORHJvcEVuYWJsZWQgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGF5b3V0X19pdGVtIG9uZS1laWdodGggbGF5ZXJfX2RyYWctaGFuZGxlXCI+XG4gICAgICAgICAgICA8VmVydERvdHMgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYXlvdXRfX2l0ZW0gb25lLWVpZ2h0aFwiPlxuICAgICAgICAgIDxWaXNpYmlsaXR5VG9nZ2xlXG4gICAgICAgICAgICBpZD17bGF5ZXJJZH1cbiAgICAgICAgICAgIGlzVmlzaWJsZT17aXNWaXNpYmxlfVxuICAgICAgICAgICAgb25DbGljaz17b25Ub2dnbGVWaXNpYmlsaXR5fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxhYmVsLXdyYXBwZXIgbGF5b3V0X19pdGVtIHRocmVlLXF1YXJ0ZXJzIGxheWVyX190aXRsZVwiPlxuICAgICAgICAgIHtpc0NvbmZpZ0FjdGl2ZSA/IChcbiAgICAgICAgICAgIDxMYXllckxhYmVsRWRpdG9yIGxhYmVsPXtsYWJlbH0gb25FZGl0PXtvblVwZGF0ZUxheWVyTGFiZWx9IC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxsYWJlbD57bGFiZWx9PC9sYWJlbD5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwibGF5b3V0X19pdGVtIG9uZS10aGlyZCB0ZXh0LS1yaWdodCBzb2Z0LXRpbnktLXJpZ2h0XCI+XG4gICAgICB7c2hvd1JlbW92ZUxheWVyICYmIDxSZW1vdmVMYXllciBpZHg9e2lkeH0gcmVtb3ZlTGF5ZXI9e3JlbW92ZUxheWVyfSAvPn1cbiAgICAgIDxFbmFibGVDb25maWdcbiAgICAgICAgaWQ9e2xheWVySWR9XG4gICAgICAgIGlzQWN0aXZlPXtpc0NvbmZpZ0FjdGl2ZX1cbiAgICAgICAgb25DbGljaz17b25Ub2dnbGVFbmFibGVDb25maWd9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICA8L1N0eWxlZExheWVyUGFuZWxJdGVtPlxuKTtcblxuTGF5ZXJQYW5lbEl0ZW0uZGlzcGxheU5hbWUgPSAnTGF5ZXJQYW5lbEl0ZW0nO1xuTGF5ZXJQYW5lbEl0ZW0ucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuTGF5ZXJQYW5lbEl0ZW0uZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuXG5leHBvcnQgZGVmYXVsdCBMYXllclBhbmVsSXRlbTtcblxuY29uc3QgTGF5ZXJMYWJlbEVkaXRvciA9ICh7bGFiZWwsIG9uRWRpdH0pID0+IChcbiAgPGlucHV0XG4gICAgdHlwZT1cInRleHRcIlxuICAgIGNsYXNzTmFtZT1cInRleHQtaW5wdXQgdGV4dC1pbnB1dC0tYm9yZGVybGVzcyBmbHVzaCBkYXJrIGxheWVyX190aXRsZV9fZWRpdG9yXCJcbiAgICBwbGFjZWhvbGRlcj17bGFiZWx9XG4gICAgdmFsdWU9e2xhYmVsfVxuICAgIG9uQ2xpY2s9e2UgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICBvbkNoYW5nZT17b25FZGl0fVxuICAgIGlkPVwiaW5wdXQtbGF5ZXItbGFiZWxcIlxuICAvPlxuKTtcblxuZXhwb3J0IGNvbnN0IEVuYWJsZUNvbmZpZyA9ICh7aWQsIGlzQWN0aXZlLCBvbkNsaWNrLCBkaXNhYmxlVG9vbHRpcH0pID0+IChcbiAgPHNwYW4gY2xhc3NOYW1lPVwicHVzaC10aW55LS1sZWZ0IGxheWVyLS10b2dnbGVcIj5cbiAgICA8YVxuICAgICAgY2xhc3NOYW1lPVwiaG92ZXIgYWxpZ24tLW1pZGRsZVwiXG4gICAgICBkYXRhLXRpcFxuICAgICAgZGF0YS1mb3I9e2BlbmFibGUtJHtpZH1gfVxuICAgICAgb25DbGljaz17b25DbGlja31cbiAgICA+XG4gICAgICA8aVxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ2ljb24gaWNvbl9kb3duLWFycm93IGVwc2lsb24nLCB7XG4gICAgICAgICAgJ3RleHQtdWJlci1ibHVlJzogaXNBY3RpdmVcbiAgICAgICAgfSl9XG4gICAgICAvPlxuICAgICAgeyFkaXNhYmxlVG9vbHRpcCAmJiAoXG4gICAgICAgIDxUb29sdGlwIGlkPXtgZW5hYmxlLSR7aWR9YH0gZWZmZWN0PVwic29saWRcIj5cbiAgICAgICAgICA8c3Bhbj5TZXR0aW5nczwvc3Bhbj5cbiAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgKX1cbiAgICA8L2E+XG4gIDwvc3Bhbj5cbik7XG5cbmNvbnN0IFJlbW92ZUxheWVyID0gKHtpZHgsIHJlbW92ZUxheWVyfSkgPT4gKFxuICA8c3BhbiBjbGFzc05hbWU9XCJwdXNoLXRpbnktLWxlZnQgbGF5ZXItLXRvZ2dsZVwiPlxuICAgIDxhXG4gICAgICBjbGFzc05hbWU9XCJob3ZlciBhbGlnbi0tbWlkZGxlXCJcbiAgICAgIGRhdGEtdGlwXG4gICAgICBkYXRhLWZvcj17YGRlbGV0ZS0ke2lkeH1gfVxuICAgICAgb25DbGljaz17ZSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJlbW92ZUxheWVyKGlkeCk7XG4gICAgICB9fVxuICAgID5cbiAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbl90cmFzaCBlcHNpbG9uXCIgLz5cbiAgICAgIDxUb29sdGlwIGlkPXtgZGVsZXRlLSR7aWR4fWB9IGVmZmVjdD1cInNvbGlkXCIgdHlwZT1cImVycm9yXCI+XG4gICAgICAgIDxzcGFuPlJlbW92ZSBsYXllcjwvc3Bhbj5cbiAgICAgIDwvVG9vbHRpcD5cbiAgICA8L2E+XG4gIDwvc3Bhbj5cbik7XG4iXX0=