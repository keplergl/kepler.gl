'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styledComponents = require('../common/styled-components');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VisibilityToggle = function VisibilityToggle(_ref) {
  var id = _ref.id,
      isVisible = _ref.isVisible,
      _onClick = _ref.onClick;
  return _react2.default.createElement(
    'span',
    { className: 'layer--toggle' },
    _react2.default.createElement(
      'a',
      { className: 'hover align--middle',
        'data-tip': true, 'data-for': 'show-' + id,
        onClick: function onClick(e) {
          return _onClick && _onClick(e);
        } },
      _react2.default.createElement('i', {
        className: (0, _classnames2.default)('icon visibility', {
          icon_eye: isVisible,
          'icon_eye-closed': !isVisible
        }) }),
      _react2.default.createElement(
        _styledComponents.Tooltip,
        { id: 'show-' + id, effect: 'solid' },
        _react2.default.createElement(
          'span',
          null,
          isVisible ? 'hide' : 'show'
        )
      )
    )
  );
};

VisibilityToggle.propTypes = {
  id: _react2.default.PropTypes.string,
  isVisible: _react2.default.PropTypes.bool,
  onClick: _react2.default.PropTypes.func
};

exports.default = VisibilityToggle;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi92aXNpYmlsaXR5LXRvZ2dsZS5qcyJdLCJuYW1lcyI6WyJWaXNpYmlsaXR5VG9nZ2xlIiwiaWQiLCJpc1Zpc2libGUiLCJvbkNsaWNrIiwiZSIsImljb25fZXllIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiYm9vbCIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLElBQU1BLG1CQUFtQixTQUFuQkEsZ0JBQW1CO0FBQUEsTUFBRUMsRUFBRixRQUFFQSxFQUFGO0FBQUEsTUFBTUMsU0FBTixRQUFNQSxTQUFOO0FBQUEsTUFBaUJDLFFBQWpCLFFBQWlCQSxPQUFqQjtBQUFBLFNBQ3ZCO0FBQUE7QUFBQSxNQUFNLFdBQVUsZUFBaEI7QUFDRTtBQUFBO0FBQUEsUUFBRyxXQUFVLHFCQUFiO0FBQ0csd0JBREgsRUFDWSxzQkFBa0JGLEVBRDlCO0FBRUcsaUJBQVMsaUJBQUNHLENBQUQ7QUFBQSxpQkFBT0QsWUFBV0EsU0FBUUMsQ0FBUixDQUFsQjtBQUFBLFNBRlo7QUFHRTtBQUNFLG1CQUFXLDBCQUFXLGlCQUFYLEVBQThCO0FBQ3ZDQyxvQkFBVUgsU0FENkI7QUFFdkMsNkJBQW1CLENBQUNBO0FBRm1CLFNBQTlCLENBRGIsR0FIRjtBQVFFO0FBQUE7QUFBQSxVQUFTLGNBQVlELEVBQXJCLEVBQTJCLFFBQU8sT0FBbEM7QUFDRTtBQUFBO0FBQUE7QUFBT0Msc0JBQVksTUFBWixHQUFxQjtBQUE1QjtBQURGO0FBUkY7QUFERixHQUR1QjtBQUFBLENBQXpCOztBQWlCQUYsaUJBQWlCTSxTQUFqQixHQUE2QjtBQUMzQkwsTUFBSSxnQkFBTU0sU0FBTixDQUFnQkMsTUFETztBQUUzQk4sYUFBVyxnQkFBTUssU0FBTixDQUFnQkUsSUFGQTtBQUczQk4sV0FBUyxnQkFBTUksU0FBTixDQUFnQkc7QUFIRSxDQUE3Qjs7a0JBTWVWLGdCIiwiZmlsZSI6InZpc2liaWxpdHktdG9nZ2xlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtUb29sdGlwfSBmcm9tICcuLi9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBWaXNpYmlsaXR5VG9nZ2xlID0gKHtpZCwgaXNWaXNpYmxlLCBvbkNsaWNrfSkgPT4gKFxuICA8c3BhbiBjbGFzc05hbWU9XCJsYXllci0tdG9nZ2xlXCI+XG4gICAgPGEgY2xhc3NOYW1lPVwiaG92ZXIgYWxpZ24tLW1pZGRsZVwiXG4gICAgICAgZGF0YS10aXAgZGF0YS1mb3I9e2BzaG93LSR7aWR9YH1cbiAgICAgICBvbkNsaWNrPXsoZSkgPT4gb25DbGljayAmJiBvbkNsaWNrKGUpfT5cbiAgICAgIDxpXG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnaWNvbiB2aXNpYmlsaXR5Jywge1xuICAgICAgICAgIGljb25fZXllOiBpc1Zpc2libGUsXG4gICAgICAgICAgJ2ljb25fZXllLWNsb3NlZCc6ICFpc1Zpc2libGVcbiAgICAgICAgfSl9Lz5cbiAgICAgIDxUb29sdGlwIGlkPXtgc2hvdy0ke2lkfWB9IGVmZmVjdD1cInNvbGlkXCI+XG4gICAgICAgIDxzcGFuPntpc1Zpc2libGUgPyAnaGlkZScgOiAnc2hvdyd9PC9zcGFuPlxuICAgICAgPC9Ub29sdGlwPlxuICAgIDwvYT5cbiAgPC9zcGFuPlxuKTtcblxuVmlzaWJpbGl0eVRvZ2dsZS5wcm9wVHlwZXMgPSB7XG4gIGlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICBpc1Zpc2libGU6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICBvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgVmlzaWJpbGl0eVRvZ2dsZTtcbiJdfQ==