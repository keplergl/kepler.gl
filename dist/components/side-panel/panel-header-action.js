'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  margin-left: ', 'px;\n  display: flex;\n  align-items: center;\n  color: ', ';\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n\n  &.disabled {\n    pointer-events: none;\n    opacity: 0.3;\n  }\n'], ['\n  margin-left: ', 'px;\n  display: flex;\n  align-items: center;\n  color: ', ';\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n\n  &.disabled {\n    pointer-events: none;\n    opacity: 0.3;\n  }\n']);

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
    return (0, _possibleConstructorReturn3.default)(this, (PanelHeaderAction.__proto__ || Object.getPrototypeOf(PanelHeaderAction)).apply(this, arguments));
  }

  (0, _createClass3.default)(PanelHeaderAction, [{
    key: 'render',
    value: function render() {
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
          className: (0, _classnames3.default)('panel--header__action', (0, _defineProperty3.default)({ disabled: disabled }, className, className)),
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
    }
  }]);
  return PanelHeaderAction;
}(_react.Component);

exports.default = PanelHeaderAction;


PanelHeaderAction.defaultProps = defaultProps;
PanelHeaderAction.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLWFjdGlvbi5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJpZCIsInN0cmluZyIsImZsdXNoIiwiYm9vbCIsInRvb2x0aXAiLCJvbkNsaWNrIiwiZnVuYyIsImFjdGl2ZSIsImRpc2FibGVkIiwiaG92ZXJDb2xvciIsImNsYXNzTmFtZSIsInRvb2x0aXBUeXBlIiwiZGVmYXVsdFByb3BzIiwiSGVhZGVyQWN0aW9uV3JhcHBlciIsImRpdiIsInByb3BzIiwidGhlbWUiLCJwYW5lbEhlYWRlckljb25BY3RpdmUiLCJwYW5lbEhlYWRlckljb24iLCJ0ZXh0Q29sb3JIbCIsIlBhbmVsSGVhZGVyQWN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsWUFBWTtBQUNoQkMsTUFBSSxvQkFBVUMsTUFERTtBQUVoQkMsU0FBTyxvQkFBVUMsSUFGRDtBQUdoQkMsV0FBUyxvQkFBVUgsTUFISDtBQUloQkksV0FBUyxvQkFBVUMsSUFKSDtBQUtoQkMsVUFBUSxvQkFBVUosSUFMRjtBQU1oQkssWUFBVSxvQkFBVUwsSUFOSjtBQU9oQk0sY0FBWSxvQkFBVVIsTUFQTjtBQVFoQlMsYUFBVyxvQkFBVVQsTUFSTDtBQVNoQlUsZUFBYSxvQkFBVVY7QUFUUCxDQUFsQjs7QUFZQSxJQUFNVyxlQUFlO0FBQ25CUCxXQUFTLG1CQUFNLENBQUUsQ0FERTtBQUVuQkksY0FBWSxJQUZPO0FBR25CRixVQUFRO0FBSFcsQ0FBckI7O0FBTUEsSUFBTU0sc0JBQXNCLDJCQUFPQyxHQUE3QixrQkFDVztBQUFBLFNBQVVDLE1BQU1iLEtBQU4sR0FBYyxDQUFkLEdBQWtCLENBQTVCO0FBQUEsQ0FEWCxFQUlLO0FBQUEsU0FDUGEsTUFBTVIsTUFBTixHQUNJUSxNQUFNQyxLQUFOLENBQVlDLHFCQURoQixHQUVJRixNQUFNQyxLQUFOLENBQVlFLGVBSFQ7QUFBQSxDQUpMLEVBV087QUFBQSxTQUNQSCxNQUFNTixVQUFOLEdBQ0lNLE1BQU1DLEtBQU4sQ0FBWUQsTUFBTU4sVUFBbEIsQ0FESixHQUVJTSxNQUFNQyxLQUFOLENBQVlHLFdBSFQ7QUFBQSxDQVhQLENBQU47O0FBdUJBOztJQUNxQkMsaUI7Ozs7Ozs7Ozs7NkJBQ1Y7QUFBQSxtQkFXSCxLQUFLTCxLQVhGO0FBQUEsVUFFTFYsT0FGSyxVQUVMQSxPQUZLO0FBQUEsVUFHTEQsT0FISyxVQUdMQSxPQUhLO0FBQUEsVUFJTEosRUFKSyxVQUlMQSxFQUpLO0FBQUEsVUFLTE8sTUFMSyxVQUtMQSxNQUxLO0FBQUEsVUFNTEwsS0FOSyxVQU1MQSxLQU5LO0FBQUEsVUFPTE8sVUFQSyxVQU9MQSxVQVBLO0FBQUEsVUFRTEUsV0FSSyxVQVFMQSxXQVJLO0FBQUEsVUFTTEgsUUFUSyxVQVNMQSxRQVRLO0FBQUEsVUFVTEUsU0FWSyxVQVVMQSxTQVZLOztBQVlQLGFBQ0U7QUFBQywyQkFBRDtBQUFBO0FBQ0UscUJBQVcsMEJBQVcsdUJBQVgsa0NBQXFDRixrQkFBckMsSUFBZ0RFLFNBQWhELEVBQTREQSxTQUE1RCxFQURiO0FBRUUsa0JBQVFILE1BRlY7QUFHRSxzQkFBWUUsVUFIZDtBQUlFLGlCQUFPUDtBQUpUO0FBTUUsMkNBQU0sS0FBTixDQUFZLGFBQVo7QUFDRSwwQkFERjtBQUVFLHNCQUFhRSxPQUFiLFNBQXdCSixFQUYxQjtBQUdFLGtCQUFPLE1BSFQ7QUFJRSxtQkFBU0s7QUFKWCxVQU5GO0FBWUdELGtCQUNDO0FBQUE7QUFBQTtBQUNFLGdCQUFPQSxPQUFQLFNBQWtCSixFQURwQjtBQUVFLG9CQUFPLE9BRlQ7QUFHRSx1QkFBVyxHQUhiO0FBSUUsa0JBQU1XO0FBSlI7QUFNRTtBQUFBO0FBQUE7QUFBT1A7QUFBUDtBQU5GLFNBREQsR0FTRztBQXJCTixPQURGO0FBeUJEOzs7OztrQkF0Q2tCZ0IsaUI7OztBQXlDckJBLGtCQUFrQlIsWUFBbEIsR0FBaUNBLFlBQWpDO0FBQ0FRLGtCQUFrQnJCLFNBQWxCLEdBQThCQSxTQUE5QiIsImZpbGUiOiJwYW5lbC1oZWFkZXItYWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7VG9vbHRpcH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBmbHVzaDogUHJvcFR5cGVzLmJvb2wsXG4gIHRvb2x0aXA6IFByb3BUeXBlcy5zdHJpbmcsXG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICBhY3RpdmU6IFByb3BUeXBlcy5ib29sLFxuICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGhvdmVyQ29sb3I6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgdG9vbHRpcFR5cGU6IFByb3BUeXBlcy5zdHJpbmdcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgb25DbGljazogKCkgPT4ge30sXG4gIGhvdmVyQ29sb3I6IG51bGwsXG4gIGFjdGl2ZTogZmFsc2Vcbn07XG5cbmNvbnN0IEhlYWRlckFjdGlvbldyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tbGVmdDogJHtwcm9wcyA9PiAocHJvcHMuZmx1c2ggPyAwIDogOCl9cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlXG4gICAgICA/IHByb3BzLnRoZW1lLnBhbmVsSGVhZGVySWNvbkFjdGl2ZVxuICAgICAgOiBwcm9wcy50aGVtZS5wYW5lbEhlYWRlckljb259O1xuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGNvbG9yOiAke3Byb3BzID0+XG4gICAgICBwcm9wcy5ob3ZlckNvbG9yXG4gICAgICAgID8gcHJvcHMudGhlbWVbcHJvcHMuaG92ZXJDb2xvcl1cbiAgICAgICAgOiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIH1cblxuICAmLmRpc2FibGVkIHtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICBvcGFjaXR5OiAwLjM7XG4gIH1cbmA7XG5cbi8vIE5lZWQgdG8gdXNlIHJlYWN0IGNsYXNzIHRvIGFjY2VzcyBwcm9wcy5jb21wb25lbnRcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhbmVsSGVhZGVyQWN0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIG9uQ2xpY2ssXG4gICAgICB0b29sdGlwLFxuICAgICAgaWQsXG4gICAgICBhY3RpdmUsXG4gICAgICBmbHVzaCxcbiAgICAgIGhvdmVyQ29sb3IsXG4gICAgICB0b29sdGlwVHlwZSxcbiAgICAgIGRpc2FibGVkLFxuICAgICAgY2xhc3NOYW1lXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxIZWFkZXJBY3Rpb25XcmFwcGVyXG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncGFuZWwtLWhlYWRlcl9fYWN0aW9uJywge2Rpc2FibGVkLCBbY2xhc3NOYW1lXTogY2xhc3NOYW1lfSl9XG4gICAgICAgIGFjdGl2ZT17YWN0aXZlfVxuICAgICAgICBob3ZlckNvbG9yPXtob3ZlckNvbG9yfVxuICAgICAgICBmbHVzaD17Zmx1c2h9XG4gICAgICA+XG4gICAgICAgIDx0aGlzLnByb3BzLkljb25Db21wb25lbnRcbiAgICAgICAgICBkYXRhLXRpcFxuICAgICAgICAgIGRhdGEtZm9yPXtgJHt0b29sdGlwfV8ke2lkfWB9XG4gICAgICAgICAgaGVpZ2h0PVwiMThweFwiXG4gICAgICAgICAgb25DbGljaz17b25DbGlja31cbiAgICAgICAgLz5cbiAgICAgICAge3Rvb2x0aXAgPyAoXG4gICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgIGlkPXtgJHt0b29sdGlwfV8ke2lkfWB9XG4gICAgICAgICAgICBlZmZlY3Q9XCJzb2xpZFwiXG4gICAgICAgICAgICBkZWxheVNob3c9ezUwMH1cbiAgICAgICAgICAgIHR5cGU9e3Rvb2x0aXBUeXBlfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxzcGFuPnt0b29sdGlwfTwvc3Bhbj5cbiAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9IZWFkZXJBY3Rpb25XcmFwcGVyPlxuICAgICk7XG4gIH1cbn1cblxuUGFuZWxIZWFkZXJBY3Rpb24uZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuUGFuZWxIZWFkZXJBY3Rpb24ucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuIl19