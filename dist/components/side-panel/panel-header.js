'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  background-color: ', ';\n  padding: 12px 16px 0 16px;\n'], ['\n  background-color: ', ';\n  padding: 12px 16px 0 16px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 16px;\n  width: 100%;\n'], ['\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 16px;\n  width: 100%;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n'], ['\n  display: flex;\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  align-items: center;\n  border-radius: 2px;\n  color: ', ';\n  display: flex;\n  height: 26px;\n  justify-content: center;\n  margin-left: 4px;\n  width: 26px;\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    color: ', ';\n  }\n'], ['\n  align-items: center;\n  border-radius: 2px;\n  color: ', ';\n  display: flex;\n  height: 26px;\n  justify-content: center;\n  margin-left: 4px;\n  width: 26px;\n\n  :hover {\n    cursor: pointer;\n    background-color: ', ';\n    color: ', ';\n  }\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  border-bottom-style: solid;\n  border-bottom-width: 2px;\n  border-bottom-color: ', ';\n  color: ', ';\n  display: flex;\n  height: 30px;\n  justify-content: center;\n  margin-right: 12px;\n  width: 30px;\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n'], ['\n  border-bottom-style: solid;\n  border-bottom-width: 2px;\n  border-bottom-color: ', ';\n  color: ', ';\n  display: flex;\n  height: 30px;\n  justify-content: center;\n  margin-right: 12px;\n  width: 30px;\n\n  :hover {\n    cursor: pointer;\n    color: ', ';\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents3 = require('../common/styled-components');

var _logo = require('../common/logo');

var _logo2 = _interopRequireDefault(_logo);

var _icons = require('../common/icons');

var _defaultSettings = require('../../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PanelHeaderWrapper = _styledComponents2.default.div.attrs({
  className: 'side-side-panel__header'
})(_templateObject, function (props) {
  return props.theme.sidePanelHeaderBg;
});

var PanelHeaderTop = _styledComponents2.default.div.attrs({
  className: 'side-panel__header__top'
})(_templateObject2);

var PanelHeaderBottom = _styledComponents2.default.div.attrs({
  className: 'side-side-panel__header__bottom'
})(_templateObject3);

var PanelTopActions = _styledComponents2.default.div.attrs({
  className: 'side-panel__header__actions'
})(_templateObject3);

var PanelAction = _styledComponents2.default.div.attrs({
  className: 'side-panel__header__actions'
})(_templateObject4, function (props) {
  return props.active ? props.theme.textColorHl : props.theme.subtextColor;
}, function (props) {
  return props.theme.secondaryBtnActBgd;
}, function (props) {
  return props.theme.textColorHl;
});

var PanelTab = _styledComponents2.default.div.attrs({
  className: 'side-panel__tab'
})(_templateObject5, function (props) {
  return props.active ? props.theme.subtextColorActive : 'transparent';
}, function (props) {
  return props.active ? props.theme.subtextColorActive : props.theme.subtextColor;
}, function (props) {
  return props.theme.textColorHl;
});

var defaultActionItems = [{
  id: 'email',
  iconComponent: _icons.Email,
  tooltip: 'Email us with questions',
  onClick: function onClick() {}
}, {
  id: 'docs',
  iconComponent: _icons.Docs,
  tooltip: 'Link to Documentation',
  onClick: function onClick() {}
}, {
  id: 'save',
  iconComponent: _icons.Save,
  tooltip: 'Save Current Map',
  onClick: function onClick() {}
}];

var defaultProps = {
  logoComponent: _logo2.default,
  actionItems: defaultActionItems,
  panels: _defaultSettings.PANELS,
  currentPanel: 'layer'
};

var propTypes = {
  logoComponent: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func]),
  actionItems: _propTypes2.default.array,
  panels: _propTypes2.default.array,
  currentPanel: _propTypes2.default.string,
  togglePanel: _propTypes2.default.func
};

var PanelHeader = function (_Component) {
  (0, _inherits3.default)(PanelHeader, _Component);

  function PanelHeader() {
    (0, _classCallCheck3.default)(this, PanelHeader);
    return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));
  }

  PanelHeader.prototype.render = function render() {
    var _props = this.props,
        actionItems = _props.actionItems,
        panels = _props.panels,
        togglePanel = _props.togglePanel,
        currentPanel = _props.currentPanel;


    return _react2.default.createElement(
      PanelHeaderWrapper,
      null,
      _react2.default.createElement(
        PanelHeaderTop,
        null,
        _react2.default.createElement(this.props.logoComponent, null),
        _react2.default.createElement(
          PanelTopActions,
          null,
          actionItems.map(function (item) {
            return _react2.default.createElement(
              PanelAction,
              {
                key: item.id,
                'data-tip': true,
                'data-for': item.id + '-action'
              },
              _react2.default.createElement(item.iconComponent, { height: '20px' }),
              _react2.default.createElement(
                _styledComponents3.Tooltip,
                {
                  id: item.id + '-action',
                  place: 'bottom',
                  delayShow: 500,
                  effect: 'solid'
                },
                _react2.default.createElement(
                  'span',
                  null,
                  item.tooltip
                )
              )
            );
          })
        )
      ),
      _react2.default.createElement(
        PanelHeaderBottom,
        null,
        panels.map(function (panel) {
          return _react2.default.createElement(
            PanelTab,
            {
              key: panel.id,
              'data-tip': true,
              'data-for': panel.id + '-nav',
              active: currentPanel === panel.id,
              onClick: function onClick() {
                return togglePanel(panel.id);
              }
            },
            _react2.default.createElement(panel.iconComponent, { height: '20px' }),
            _react2.default.createElement(
              _styledComponents3.Tooltip,
              {
                id: panel.id + '-nav',
                effect: 'solid',
                delayShow: 500,
                place: 'bottom'
              },
              _react2.default.createElement(
                'span',
                null,
                panel.label || panel.id
              )
            )
          );
        })
      )
    );
  };

  return PanelHeader;
}(_react.Component);

PanelHeader.defaultProps = defaultProps;
PanelHeader.propTypes = propTypes;

exports.default = PanelHeader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLmpzIl0sIm5hbWVzIjpbIlBhbmVsSGVhZGVyV3JhcHBlciIsImRpdiIsImF0dHJzIiwiY2xhc3NOYW1lIiwicHJvcHMiLCJ0aGVtZSIsInNpZGVQYW5lbEhlYWRlckJnIiwiUGFuZWxIZWFkZXJUb3AiLCJQYW5lbEhlYWRlckJvdHRvbSIsIlBhbmVsVG9wQWN0aW9ucyIsIlBhbmVsQWN0aW9uIiwiYWN0aXZlIiwidGV4dENvbG9ySGwiLCJzdWJ0ZXh0Q29sb3IiLCJzZWNvbmRhcnlCdG5BY3RCZ2QiLCJQYW5lbFRhYiIsInN1YnRleHRDb2xvckFjdGl2ZSIsImRlZmF1bHRBY3Rpb25JdGVtcyIsImlkIiwiaWNvbkNvbXBvbmVudCIsInRvb2x0aXAiLCJvbkNsaWNrIiwiZGVmYXVsdFByb3BzIiwibG9nb0NvbXBvbmVudCIsImFjdGlvbkl0ZW1zIiwicGFuZWxzIiwiY3VycmVudFBhbmVsIiwicHJvcFR5cGVzIiwib25lT2ZUeXBlIiwiZWxlbWVudCIsImZ1bmMiLCJhcnJheSIsInN0cmluZyIsInRvZ2dsZVBhbmVsIiwiUGFuZWxIZWFkZXIiLCJyZW5kZXIiLCJtYXAiLCJpdGVtIiwicGFuZWwiLCJsYWJlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxxQkFBcUIsMkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUMxQ0MsYUFBVztBQUQrQixDQUFqQixDQUFyQixrQkFHZ0I7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlDLGlCQUFyQjtBQUFBLENBSGhCLENBQU47O0FBT0EsSUFBTUMsaUJBQWlCLDJCQUFPTixHQUFQLENBQVdDLEtBQVgsQ0FBaUI7QUFDdENDLGFBQVc7QUFEMkIsQ0FBakIsQ0FBakIsa0JBQU47O0FB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QUFaLFlBREY7QUFFRSx5QkFBTSxRQUZSO0FBR0UsNkJBQVcsR0FIYjtBQUlFLDBCQUFPO0FBSlQ7QUFNRTtBQUFBO0FBQUE7QUFBT21CLHVCQUFLakI7QUFBWjtBQU5GO0FBTkYsYUFEZTtBQUFBLFdBQWhCO0FBREg7QUFGRixPQURGO0FBdUJFO0FBQUMseUJBQUQ7QUFBQTtBQUNHSyxlQUFPVyxHQUFQLENBQVc7QUFBQSxpQkFDVjtBQUFDLG9CQUFEO0FBQUE7QUFDRSxtQkFBS0UsTUFBTXBCLEVBRGI7QUFFRSw4QkFGRjtBQUdFLDBCQUFhb0IsTUFBTXBCLEVBQW5CLFNBSEY7QUFJRSxzQkFBUVEsaUJBQWlCWSxNQUFNcEIsRUFKakM7QUFLRSx1QkFBUztBQUFBLHVCQUFNZSxZQUFZSyxNQUFNcEIsRUFBbEIsQ0FBTjtBQUFBO0FBTFg7QUFPRSwwQ0FBQyxLQUFELENBQU8sYUFBUCxJQUFxQixRQUFPLE1BQTVCLEdBUEY7QUFRRTtBQUFBO0FBQUE7QUFDRSxvQkFBT29CLE1BQU1wQixFQUFiLFNBREY7QUFFRSx3QkFBTyxPQUZUO0FBR0UsMkJBQVcsR0FIYjtBQUlFLHVCQUFNO0FBSlI7QUFNRTtBQUFBO0FBQUE7QUFBT29CLHNCQUFNQyxLQUFOLElBQWVELE1BQU1wQjtBQUE1QjtBQU5GO0FBUkYsV0FEVTtBQUFBLFNBQVg7QUFESDtBQXZCRixLQURGO0FBK0NELEc7Ozs7O0FBR0hnQixZQUFZWixZQUFaLEdBQTJCQSxZQUEzQjtBQUNBWSxZQUFZUCxTQUFaLEdBQXdCQSxTQUF4Qjs7a0JBRWVPLFciLCJmaWxlIjoicGFuZWwtaGVhZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBLZXBsZXJHbExvZ28gZnJvbSAnY29tcG9uZW50cy9jb21tb24vbG9nbyc7XG5pbXBvcnQge0VtYWlsLCBEb2NzLCBTYXZlfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQge1BBTkVMU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBQYW5lbEhlYWRlcldyYXBwZXIgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1zaWRlLXBhbmVsX19oZWFkZXInXG59KWBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxIZWFkZXJCZ307XG4gIHBhZGRpbmc6IDEycHggMTZweCAwIDE2cHg7XG5gO1xuXG5jb25zdCBQYW5lbEhlYWRlclRvcCA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaWRlLXBhbmVsX19oZWFkZXJfX3RvcCdcbn0pYFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIG1hcmdpbi1ib3R0b206IDE2cHg7XG4gIHdpZHRoOiAxMDAlO1xuYDtcblxuY29uc3QgUGFuZWxIZWFkZXJCb3R0b20gPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1zaWRlLXBhbmVsX19oZWFkZXJfX2JvdHRvbSdcbn0pYFxuICBkaXNwbGF5OiBmbGV4O1xuYDtcblxuY29uc3QgUGFuZWxUb3BBY3Rpb25zID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NpZGUtcGFuZWxfX2hlYWRlcl9fYWN0aW9ucydcbn0pYFxuICBkaXNwbGF5OiBmbGV4O1xuYDtcblxuY29uc3QgUGFuZWxBY3Rpb24gPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2lkZS1wYW5lbF9faGVhZGVyX19hY3Rpb25zJ1xufSlgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5hY3RpdmUgPyBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbCA6IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvcn07XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGhlaWdodDogMjZweDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG1hcmdpbi1sZWZ0OiA0cHg7XG4gIHdpZHRoOiAyNnB4O1xuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5QnRuQWN0QmdkfTtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIH1cbmA7XG5cbmNvbnN0IFBhbmVsVGFiID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NpZGUtcGFuZWxfX3RhYidcbn0pYFxuICBib3JkZXItYm90dG9tLXN0eWxlOiBzb2xpZDtcbiAgYm9yZGVyLWJvdHRvbS13aWR0aDogMnB4O1xuICBib3JkZXItYm90dG9tLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUuc3VidGV4dENvbG9yQWN0aXZlIDogJ3RyYW5zcGFyZW50J307XG4gIGNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUuc3VidGV4dENvbG9yQWN0aXZlIDogcHJvcHMudGhlbWUuc3VidGV4dENvbG9yfTtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAzMHB4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgbWFyZ2luLXJpZ2h0OiAxMnB4O1xuICB3aWR0aDogMzBweDtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gIH1cbmA7XG5cbmNvbnN0IGRlZmF1bHRBY3Rpb25JdGVtcyA9IFtcbiAge1xuICAgIGlkOiAnZW1haWwnLFxuICAgIGljb25Db21wb25lbnQ6IEVtYWlsLFxuICAgIHRvb2x0aXA6ICdFbWFpbCB1cyB3aXRoIHF1ZXN0aW9ucycsXG4gICAgb25DbGljazogKCkgPT4ge31cbiAgfSxcbiAge1xuICAgIGlkOiAnZG9jcycsXG4gICAgaWNvbkNvbXBvbmVudDogRG9jcyxcbiAgICB0b29sdGlwOiAnTGluayB0byBEb2N1bWVudGF0aW9uJyxcbiAgICBvbkNsaWNrOiAoKSA9PiB7fVxuICB9LFxuICB7XG4gICAgaWQ6ICdzYXZlJyxcbiAgICBpY29uQ29tcG9uZW50OiBTYXZlLFxuICAgIHRvb2x0aXA6ICdTYXZlIEN1cnJlbnQgTWFwJyxcbiAgICBvbkNsaWNrOiAoKSA9PiB7fVxuICB9XG5dO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGxvZ29Db21wb25lbnQ6IEtlcGxlckdsTG9nbyxcbiAgYWN0aW9uSXRlbXM6IGRlZmF1bHRBY3Rpb25JdGVtcyxcbiAgcGFuZWxzOiBQQU5FTFMsXG4gIGN1cnJlbnRQYW5lbDogJ2xheWVyJ1xufTtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBsb2dvQ29tcG9uZW50OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuZWxlbWVudCwgUHJvcFR5cGVzLmZ1bmNdKSxcbiAgYWN0aW9uSXRlbXM6IFByb3BUeXBlcy5hcnJheSxcbiAgcGFuZWxzOiBQcm9wVHlwZXMuYXJyYXksXG4gIGN1cnJlbnRQYW5lbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgdG9nZ2xlUGFuZWw6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jbGFzcyBQYW5lbEhlYWRlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7YWN0aW9uSXRlbXMsIHBhbmVscywgdG9nZ2xlUGFuZWwsIGN1cnJlbnRQYW5lbH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxQYW5lbEhlYWRlcldyYXBwZXI+XG4gICAgICAgIDxQYW5lbEhlYWRlclRvcD5cbiAgICAgICAgICA8dGhpcy5wcm9wcy5sb2dvQ29tcG9uZW50IC8+XG4gICAgICAgICAgPFBhbmVsVG9wQWN0aW9ucz5cbiAgICAgICAgICAgIHthY3Rpb25JdGVtcy5tYXAoaXRlbSA9PiAoXG4gICAgICAgICAgICAgIDxQYW5lbEFjdGlvblxuICAgICAgICAgICAgICAgIGtleT17aXRlbS5pZH1cbiAgICAgICAgICAgICAgICBkYXRhLXRpcFxuICAgICAgICAgICAgICAgIGRhdGEtZm9yPXtgJHtpdGVtLmlkfS1hY3Rpb25gfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGl0ZW0uaWNvbkNvbXBvbmVudCBoZWlnaHQ9XCIyMHB4XCIgLz5cbiAgICAgICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICAgICAgaWQ9e2Ake2l0ZW0uaWR9LWFjdGlvbmB9XG4gICAgICAgICAgICAgICAgICBwbGFjZT1cImJvdHRvbVwiXG4gICAgICAgICAgICAgICAgICBkZWxheVNob3c9ezUwMH1cbiAgICAgICAgICAgICAgICAgIGVmZmVjdD1cInNvbGlkXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj57aXRlbS50b29sdGlwfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICAgICAgIDwvUGFuZWxBY3Rpb24+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L1BhbmVsVG9wQWN0aW9ucz5cbiAgICAgICAgPC9QYW5lbEhlYWRlclRvcD5cbiAgICAgICAgPFBhbmVsSGVhZGVyQm90dG9tPlxuICAgICAgICAgIHtwYW5lbHMubWFwKHBhbmVsID0+IChcbiAgICAgICAgICAgIDxQYW5lbFRhYlxuICAgICAgICAgICAgICBrZXk9e3BhbmVsLmlkfVxuICAgICAgICAgICAgICBkYXRhLXRpcFxuICAgICAgICAgICAgICBkYXRhLWZvcj17YCR7cGFuZWwuaWR9LW5hdmB9XG4gICAgICAgICAgICAgIGFjdGl2ZT17Y3VycmVudFBhbmVsID09PSBwYW5lbC5pZH1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdG9nZ2xlUGFuZWwocGFuZWwuaWQpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8cGFuZWwuaWNvbkNvbXBvbmVudCBoZWlnaHQ9XCIyMHB4XCIgLz5cbiAgICAgICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgICAgICBpZD17YCR7cGFuZWwuaWR9LW5hdmB9XG4gICAgICAgICAgICAgICAgZWZmZWN0PVwic29saWRcIlxuICAgICAgICAgICAgICAgIGRlbGF5U2hvdz17NTAwfVxuICAgICAgICAgICAgICAgIHBsYWNlPVwiYm90dG9tXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxzcGFuPntwYW5lbC5sYWJlbCB8fCBwYW5lbC5pZH08L3NwYW4+XG4gICAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgIDwvUGFuZWxUYWI+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvUGFuZWxIZWFkZXJCb3R0b20+XG4gICAgICA8L1BhbmVsSGVhZGVyV3JhcHBlcj5cbiAgICApO1xuICB9XG59XG5cblBhbmVsSGVhZGVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblBhbmVsSGVhZGVyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuZXhwb3J0IGRlZmF1bHQgUGFuZWxIZWFkZXI7XG4iXX0=