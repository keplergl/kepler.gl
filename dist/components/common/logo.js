'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: inline-block;\n  margin-left: 6px;\n'], ['\n  display: inline-block;\n  margin-left: 6px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  font-size: 14px;\n  font-weight: 600;\n  letter-spacing: 1.17px;\n'], ['\n  color: ', ';\n  font-size: 14px;\n  font-weight: 600;\n  letter-spacing: 1.17px;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  font-size: 10px;\n  color: ', ';\n  letter-spacing: 0.83px;\n  line-height: 14px;\n'], ['\n  font-size: 10px;\n  color: ', ';\n  letter-spacing: 0.83px;\n  line-height: 14px;\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  align-items: flex-start;\n'], ['\n  display: flex;\n  align-items: flex-start;\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-top: 3px;\n'], ['\n  margin-top: 3px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LogoTitle = _styledComponents2.default.div(_templateObject);

var LogoName = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.theme.activeColor;
});
var LogoVersion = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.subtextColor;
});

var LogoWrapper = _styledComponents2.default.div(_templateObject4);

var LogoSvgWrapper = _styledComponents2.default.div(_templateObject5);

var LogoSvg = function LogoSvg() {
  return _react2.default.createElement(
    'svg',
    {
      className: 'side-panel-logo__logo',
      width: '22px',
      height: '15px',
      viewBox: '0 0 22 15'
    },
    _react2.default.createElement(
      'g',
      { transform: 'translate(11, -3) rotate(45.000000)' },
      _react2.default.createElement('rect', { fill: '#535C6C', x: '0', y: '5', width: '10', height: '10' }),
      _react2.default.createElement('rect', { fill: '#1FBAD6', x: '5', y: '0', width: '10', height: '10' })
    )
  );
};

var KeplerGlLogo = function KeplerGlLogo() {
  return _react2.default.createElement(
    LogoWrapper,
    { className: 'side-panel-logo' },
    _react2.default.createElement(
      LogoSvgWrapper,
      null,
      _react2.default.createElement(LogoSvg, null)
    ),
    _react2.default.createElement(
      LogoTitle,
      { className: 'logo__title' },
      _react2.default.createElement(
        LogoName,
        { className: 'logo__name' },
        'Kepler.Gl'
      ),
      _react2.default.createElement(
        LogoVersion,
        { className: 'logo__version' },
        'v1.0'
      )
    )
  );
};

exports.default = KeplerGlLogo;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9sb2dvLmpzIl0sIm5hbWVzIjpbIkxvZ29UaXRsZSIsImRpdiIsIkxvZ29OYW1lIiwicHJvcHMiLCJ0aGVtZSIsImFjdGl2ZUNvbG9yIiwiTG9nb1ZlcnNpb24iLCJzdWJ0ZXh0Q29sb3IiLCJMb2dvV3JhcHBlciIsIkxvZ29TdmdXcmFwcGVyIiwiTG9nb1N2ZyIsIktlcGxlckdsTG9nbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFlBQVksMkJBQU9DLEdBQW5CLGlCQUFOOztBQUtBLElBQU1DLFdBQVcsMkJBQU9ELEdBQWxCLG1CQUNLO0FBQUEsU0FBU0UsTUFBTUMsS0FBTixDQUFZQyxXQUFyQjtBQUFBLENBREwsQ0FBTjtBQU1BLElBQU1DLGNBQWMsMkJBQU9MLEdBQXJCLG1CQUVLO0FBQUEsU0FBU0UsTUFBTUMsS0FBTixDQUFZRyxZQUFyQjtBQUFBLENBRkwsQ0FBTjs7QUFPQSxJQUFNQyxjQUFjLDJCQUFPUCxHQUFyQixrQkFBTjs7QUFLQSxJQUFNUSxpQkFBaUIsMkJBQU9SLEdBQXhCLGtCQUFOOztBQUlBLElBQU1TLFVBQVUsU0FBVkEsT0FBVTtBQUFBLFNBQ2Q7QUFBQTtBQUFBO0FBQ0UsaUJBQVUsdUJBRFo7QUFFRSxhQUFNLE1BRlI7QUFHRSxjQUFPLE1BSFQ7QUFJRSxlQUFRO0FBSlY7QUFNRTtBQUFBO0FBQUEsUUFBRyxXQUFVLHFDQUFiO0FBQ0UsOENBQU0sTUFBSyxTQUFYLEVBQXFCLEdBQUUsR0FBdkIsRUFBMkIsR0FBRSxHQUE3QixFQUFpQyxPQUFNLElBQXZDLEVBQTRDLFFBQU8sSUFBbkQsR0FERjtBQUVFLDhDQUFNLE1BQUssU0FBWCxFQUFxQixHQUFFLEdBQXZCLEVBQTJCLEdBQUUsR0FBN0IsRUFBaUMsT0FBTSxJQUF2QyxFQUE0QyxRQUFPLElBQW5EO0FBRkY7QUFORixHQURjO0FBQUEsQ0FBaEI7O0FBY0EsSUFBTUMsZUFBZSxTQUFmQSxZQUFlO0FBQUEsU0FDbkI7QUFBQyxlQUFEO0FBQUEsTUFBYSxXQUFVLGlCQUF2QjtBQUNFO0FBQUMsb0JBQUQ7QUFBQTtBQUNFLG9DQUFDLE9BQUQ7QUFERixLQURGO0FBSUU7QUFBQyxlQUFEO0FBQUEsUUFBVyxXQUFVLGFBQXJCO0FBQ0U7QUFBQyxnQkFBRDtBQUFBLFVBQVUsV0FBVSxZQUFwQjtBQUFBO0FBQUEsT0FERjtBQUVFO0FBQUMsbUJBQUQ7QUFBQSxVQUFhLFdBQVUsZUFBdkI7QUFBQTtBQUFBO0FBRkY7QUFKRixHQURtQjtBQUFBLENBQXJCOztrQkFZZUEsWSIsImZpbGUiOiJsb2dvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5jb25zdCBMb2dvVGl0bGUgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIG1hcmdpbi1sZWZ0OiA2cHg7XG5gO1xuXG5jb25zdCBMb2dvTmFtZSA9IHN0eWxlZC5kaXZgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmFjdGl2ZUNvbG9yfTtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmb250LXdlaWdodDogNjAwO1xuICBsZXR0ZXItc3BhY2luZzogMS4xN3B4O1xuYDtcbmNvbnN0IExvZ29WZXJzaW9uID0gc3R5bGVkLmRpdmBcbiAgZm9udC1zaXplOiAxMHB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3J9O1xuICBsZXR0ZXItc3BhY2luZzogMC44M3B4O1xuICBsaW5lLWhlaWdodDogMTRweDtcbmA7XG5cbmNvbnN0IExvZ29XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG5gO1xuXG5jb25zdCBMb2dvU3ZnV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi10b3A6IDNweDtcbmA7XG5cbmNvbnN0IExvZ29TdmcgPSAoKSA9PiAoXG4gIDxzdmdcbiAgICBjbGFzc05hbWU9XCJzaWRlLXBhbmVsLWxvZ29fX2xvZ29cIlxuICAgIHdpZHRoPVwiMjJweFwiXG4gICAgaGVpZ2h0PVwiMTVweFwiXG4gICAgdmlld0JveD1cIjAgMCAyMiAxNVwiXG4gID5cbiAgICA8ZyB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMTEsIC0zKSByb3RhdGUoNDUuMDAwMDAwKVwiPlxuICAgICAgPHJlY3QgZmlsbD1cIiM1MzVDNkNcIiB4PVwiMFwiIHk9XCI1XCIgd2lkdGg9XCIxMFwiIGhlaWdodD1cIjEwXCIgLz5cbiAgICAgIDxyZWN0IGZpbGw9XCIjMUZCQUQ2XCIgeD1cIjVcIiB5PVwiMFwiIHdpZHRoPVwiMTBcIiBoZWlnaHQ9XCIxMFwiIC8+XG4gICAgPC9nPlxuICA8L3N2Zz5cbik7XG5cbmNvbnN0IEtlcGxlckdsTG9nbyA9ICgpID0+IChcbiAgPExvZ29XcmFwcGVyIGNsYXNzTmFtZT1cInNpZGUtcGFuZWwtbG9nb1wiPlxuICAgIDxMb2dvU3ZnV3JhcHBlcj5cbiAgICAgIDxMb2dvU3ZnIC8+XG4gICAgPC9Mb2dvU3ZnV3JhcHBlcj5cbiAgICA8TG9nb1RpdGxlIGNsYXNzTmFtZT1cImxvZ29fX3RpdGxlXCI+XG4gICAgICA8TG9nb05hbWUgY2xhc3NOYW1lPVwibG9nb19fbmFtZVwiPktlcGxlci5HbDwvTG9nb05hbWU+XG4gICAgICA8TG9nb1ZlcnNpb24gY2xhc3NOYW1lPVwibG9nb19fdmVyc2lvblwiPnYxLjA8L0xvZ29WZXJzaW9uPlxuICAgIDwvTG9nb1RpdGxlPlxuICA8L0xvZ29XcmFwcGVyPlxuKTtcblxuZXhwb3J0IGRlZmF1bHQgS2VwbGVyR2xMb2dvO1xuIl19