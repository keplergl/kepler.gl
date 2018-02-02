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

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-left: ', 'px;\n  display: flex;\n  align-items: center;\n  color: ', ';\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n\n  &.disabled {\n    pointer-events: none;\n    opacity: 0.3;\n  }\n'], ['\n  margin-left: ', 'px;\n  display: flex;\n  align-items: center;\n  color: ', ';\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n\n  &.disabled {\n    pointer-events: none;\n    opacity: 0.3;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledComponents3 = require('../common/styled-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  id: _propTypes2.default.string,
  flush: _propTypes2.default.bool,
  tooltip: _propTypes2.default.string,
  onClick: _propTypes2.default.func,
  active: _propTypes2.default.bool,
  disabled: _propTypes2.default.bool,
  hoverColor: _propTypes2.default.string,
  className: _propTypes2.default.string,
  tooltipType: _propTypes2.default.string
};

var defaultProps = {
  onClick: function onClick() {},
  hoverColor: null,
  active: false
};

var HeaderActionWrapper = _styledComponents2.default.div(_templateObject, function (props) {
  return props.flush ? 0 : 8;
}, function (props) {
  return props.active ? props.theme.panelHeaderIconActive : props.theme.panelHeaderIcon;
}, function (props) {
  return props.hoverColor ? props.theme[props.hoverColor] : props.theme.textColorHl;
});

// Need to use react class to access props.component

var PanelHeaderAction = function (_Component) {
  (0, _inherits3.default)(PanelHeaderAction, _Component);

  function PanelHeaderAction() {
    (0, _classCallCheck3.default)(this, PanelHeaderAction);
    return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
  }

  PanelHeaderAction.prototype.render = function render() {
    var _classnames;

    var _props = this.props,
        onClick = _props.onClick,
        tooltip = _props.tooltip,
        id = _props.id,
        active = _props.active,
        flush = _props.flush,
        hoverColor = _props.hoverColor,
        tooltipType = _props.tooltipType,
        disabled = _props.disabled,
        className = _props.className;

    return _react2.default.createElement(
      HeaderActionWrapper,
      {
        className: (0, _classnames3.default)('panel--header__action', (_classnames = { disabled: disabled }, _classnames[className] = className, _classnames)),
        active: active,
        hoverColor: hoverColor,
        flush: flush
      },
      _react2.default.createElement(this.props.IconComponent, {
        'data-tip': true,
        'data-for': tooltip + '_' + id,
        height: '18px',
        onClick: onClick
      }),
      tooltip ? _react2.default.createElement(
        _styledComponents3.Tooltip,
        {
          id: tooltip + '_' + id,
          effect: 'solid',
          delayShow: 500,
          type: tooltipType
        },
        _react2.default.createElement(
          'span',
          null,
          tooltip
        )
      ) : null
    );
  };

  return PanelHeaderAction;
}(_react.Component);

exports.default = PanelHeaderAction;


PanelHeaderAction.defaultProps = defaultProps;
PanelHeaderAction.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLWFjdGlvbi5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJpZCIsInN0cmluZyIsImZsdXNoIiwiYm9vbCIsInRvb2x0aXAiLCJvbkNsaWNrIiwiZnVuYyIsImFjdGl2ZSIsImRpc2FibGVkIiwiaG92ZXJDb2xvciIsImNsYXNzTmFtZSIsInRvb2x0aXBUeXBlIiwiZGVmYXVsdFByb3BzIiwiSGVhZGVyQWN0aW9uV3JhcHBlciIsImRpdiIsInByb3BzIiwidGhlbWUiLCJwYW5lbEhlYWRlckljb25BY3RpdmUiLCJwYW5lbEhlYWRlckljb24iLCJ0ZXh0Q29sb3JIbCIsIlBhbmVsSGVhZGVyQWN0aW9uIiwicmVuZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLE1BQUksb0JBQVVDLE1BREU7QUFFaEJDLFNBQU8sb0JBQVVDLElBRkQ7QUFHaEJDLFdBQVMsb0JBQVVILE1BSEg7QUFJaEJJLFdBQVMsb0JBQVVDLElBSkg7QUFLaEJDLFVBQVEsb0JBQVVKLElBTEY7QUFNaEJLLFlBQVUsb0JBQVVMLElBTko7QUFPaEJNLGNBQVksb0JBQVVSLE1BUE47QUFRaEJTLGFBQVcsb0JBQVVULE1BUkw7QUFTaEJVLGVBQWEsb0JBQVVWO0FBVFAsQ0FBbEI7O0FBWUEsSUFBTVcsZUFBZTtBQUNuQlAsV0FBUyxtQkFBTSxDQUFFLENBREU7QUFFbkJJLGNBQVksSUFGTztBQUduQkYsVUFBUTtBQUhXLENBQXJCOztBQU1BLElBQU1NLHNCQUFzQiwyQkFBT0MsR0FBN0Isa0JBQ1c7QUFBQSxTQUFVQyxNQUFNYixLQUFOLEdBQWMsQ0FBZCxHQUFrQixDQUE1QjtBQUFBLENBRFgsRUFJSztBQUFBLFNBQ1BhLE1BQU1SLE1BQU4sR0FDSVEsTUFBTUMsS0FBTixDQUFZQyxxQkFEaEIsR0FFSUYsTUFBTUMsS0FBTixDQUFZRSxlQUhUO0FBQUEsQ0FKTCxFQVdPO0FBQUEsU0FDUEgsTUFBTU4sVUFBTixHQUNJTSxNQUFNQyxLQUFOLENBQVlELE1BQU1OLFVBQWxCLENBREosR0FFSU0sTUFBTUMsS0FBTixDQUFZRyxXQUhUO0FBQUEsQ0FYUCxDQUFOOztBQXVCQTs7SUFDcUJDLGlCOzs7Ozs7Ozs4QkFDbkJDLE0scUJBQVM7QUFBQTs7QUFBQSxpQkFXSCxLQUFLTixLQVhGO0FBQUEsUUFFTFYsT0FGSyxVQUVMQSxPQUZLO0FBQUEsUUFHTEQsT0FISyxVQUdMQSxPQUhLO0FBQUEsUUFJTEosRUFKSyxVQUlMQSxFQUpLO0FBQUEsUUFLTE8sTUFMSyxVQUtMQSxNQUxLO0FBQUEsUUFNTEwsS0FOSyxVQU1MQSxLQU5LO0FBQUEsUUFPTE8sVUFQSyxVQU9MQSxVQVBLO0FBQUEsUUFRTEUsV0FSSyxVQVFMQSxXQVJLO0FBQUEsUUFTTEgsUUFUSyxVQVNMQSxRQVRLO0FBQUEsUUFVTEUsU0FWSyxVQVVMQSxTQVZLOztBQVlQLFdBQ0U7QUFBQyx5QkFBRDtBQUFBO0FBQ0UsbUJBQVcsMEJBQVcsdUJBQVgsbUJBQXFDRixrQkFBckMsZ0JBQWdERSxTQUFoRCxJQUE0REEsU0FBNUQsZUFEYjtBQUVFLGdCQUFRSCxNQUZWO0FBR0Usb0JBQVlFLFVBSGQ7QUFJRSxlQUFPUDtBQUpUO0FBTUUseUNBQU0sS0FBTixDQUFZLGFBQVo7QUFDRSx3QkFERjtBQUVFLG9CQUFhRSxPQUFiLFNBQXdCSixFQUYxQjtBQUdFLGdCQUFPLE1BSFQ7QUFJRSxpQkFBU0s7QUFKWCxRQU5GO0FBWUdELGdCQUNDO0FBQUE7QUFBQTtBQUNFLGNBQU9BLE9BQVAsU0FBa0JKLEVBRHBCO0FBRUUsa0JBQU8sT0FGVDtBQUdFLHFCQUFXLEdBSGI7QUFJRSxnQkFBTVc7QUFKUjtBQU1FO0FBQUE7QUFBQTtBQUFPUDtBQUFQO0FBTkYsT0FERCxHQVNHO0FBckJOLEtBREY7QUF5QkQsRzs7Ozs7a0JBdENrQmdCLGlCOzs7QUF5Q3JCQSxrQkFBa0JSLFlBQWxCLEdBQWlDQSxZQUFqQztBQUNBUSxrQkFBa0JyQixTQUFsQixHQUE4QkEsU0FBOUIiLCJmaWxlIjoicGFuZWwtaGVhZGVyLWFjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgZmx1c2g6IFByb3BUeXBlcy5ib29sLFxuICB0b29sdGlwOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYyxcbiAgYWN0aXZlOiBQcm9wVHlwZXMuYm9vbCxcbiAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICBob3ZlckNvbG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHRvb2x0aXBUeXBlOiBQcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIG9uQ2xpY2s6ICgpID0+IHt9LFxuICBob3ZlckNvbG9yOiBudWxsLFxuICBhY3RpdmU6IGZhbHNlXG59O1xuXG5jb25zdCBIZWFkZXJBY3Rpb25XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLWxlZnQ6ICR7cHJvcHMgPT4gKHByb3BzLmZsdXNoID8gMCA6IDgpfXB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLmFjdGl2ZVxuICAgICAgPyBwcm9wcy50aGVtZS5wYW5lbEhlYWRlckljb25BY3RpdmVcbiAgICAgIDogcHJvcHMudGhlbWUucGFuZWxIZWFkZXJJY29ufTtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBjb2xvcjogJHtwcm9wcyA9PlxuICAgICAgcHJvcHMuaG92ZXJDb2xvclxuICAgICAgICA/IHByb3BzLnRoZW1lW3Byb3BzLmhvdmVyQ29sb3JdXG4gICAgICAgIDogcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICB9XG5cbiAgJi5kaXNhYmxlZCB7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgb3BhY2l0eTogMC4zO1xuICB9XG5gO1xuXG4vLyBOZWVkIHRvIHVzZSByZWFjdCBjbGFzcyB0byBhY2Nlc3MgcHJvcHMuY29tcG9uZW50XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbEhlYWRlckFjdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBvbkNsaWNrLFxuICAgICAgdG9vbHRpcCxcbiAgICAgIGlkLFxuICAgICAgYWN0aXZlLFxuICAgICAgZmx1c2gsXG4gICAgICBob3ZlckNvbG9yLFxuICAgICAgdG9vbHRpcFR5cGUsXG4gICAgICBkaXNhYmxlZCxcbiAgICAgIGNsYXNzTmFtZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8SGVhZGVyQWN0aW9uV3JhcHBlclxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3BhbmVsLS1oZWFkZXJfX2FjdGlvbicsIHtkaXNhYmxlZCwgW2NsYXNzTmFtZV06IGNsYXNzTmFtZX0pfVxuICAgICAgICBhY3RpdmU9e2FjdGl2ZX1cbiAgICAgICAgaG92ZXJDb2xvcj17aG92ZXJDb2xvcn1cbiAgICAgICAgZmx1c2g9e2ZsdXNofVxuICAgICAgPlxuICAgICAgICA8dGhpcy5wcm9wcy5JY29uQ29tcG9uZW50XG4gICAgICAgICAgZGF0YS10aXBcbiAgICAgICAgICBkYXRhLWZvcj17YCR7dG9vbHRpcH1fJHtpZH1gfVxuICAgICAgICAgIGhlaWdodD1cIjE4cHhcIlxuICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgIC8+XG4gICAgICAgIHt0b29sdGlwID8gKFxuICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICBpZD17YCR7dG9vbHRpcH1fJHtpZH1gfVxuICAgICAgICAgICAgZWZmZWN0PVwic29saWRcIlxuICAgICAgICAgICAgZGVsYXlTaG93PXs1MDB9XG4gICAgICAgICAgICB0eXBlPXt0b29sdGlwVHlwZX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8c3Bhbj57dG9vbHRpcH08L3NwYW4+XG4gICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvSGVhZGVyQWN0aW9uV3JhcHBlcj5cbiAgICApO1xuICB9XG59XG5cblBhbmVsSGVhZGVyQWN0aW9uLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblBhbmVsSGVhZGVyQWN0aW9uLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiJdfQ==