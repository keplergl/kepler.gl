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

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  z-index: 99;\n  height: 100%;\n  width: ', 'px;\n  display: flex;\n  transition: width 250ms;\n  position: absolute;\n  padding: ', 'px;\n'], ['\n  z-index: 99;\n  height: 100%;\n  width: ', 'px;\n  display: flex;\n  transition: width 250ms;\n  position: absolute;\n  padding: ', 'px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  transition: left 250ms, right 250ms;\n  left: ', 'px;\n  align-items: stretch;\n  flex-grow: 1;\n'], ['\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  transition: left 250ms, right 250ms;\n  left: ', 'px;\n  align-items: stretch;\n  flex-grow: 1;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  background-color: ', ';\n  border-radius: 1px;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n'], ['\n  background-color: ', ';\n  border-radius: 1px;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  align-items: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  justify-content: center;\n  background-color: ', ';\n  border-radius: 1px;\n  color: ', ';\n  display: flex;\n  height: 20px;\n  position: absolute;\n  right: -8px;\n  top: ', 'px;\n  width: 20px;\n\n  :hover {\n    cursor: pointer;\n    box-shadow: none;\n    background-color: ', ';\n  }\n'], ['\n  align-items: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  justify-content: center;\n  background-color: ', ';\n  border-radius: 1px;\n  color: ', ';\n  display: flex;\n  height: 20px;\n  position: absolute;\n  right: -8px;\n  top: ', 'px;\n  width: 20px;\n\n  :hover {\n    cursor: pointer;\n    box-shadow: none;\n    background-color: ', ';\n  }\n']); /** @jsx createElement */


var _reactStylematic = require('react-stylematic');

var _reactStylematic2 = _interopRequireDefault(_reactStylematic);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _icons = require('../common/icons');

var _sidePanel = require('../../styles/side-panel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultProps = {
  width: 300,
  minifiedWidth: 0,
  isOpen: true,
  onOpenOrClose: function noop() {}
};

var propTypes = {
  width: _propTypes2.default.number,
  isOpen: _propTypes2.default.bool,
  minifiedWidth: _propTypes2.default.number,
  onOpenOrClose: _propTypes2.default.func
};

var StyledSidePanelContainer = _styledComponents2.default.div(_templateObject, function (props) {
  return props.width + 2 * props.theme.sidePanel.margin;
}, function (props) {
  return props.theme.sidePanel.margin;
});

var SideBarContainer = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.left;
});

var SideBarInner = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.sidePanelBg;
});

var CollapseButton = _styledComponents2.default.div(_templateObject4, function (props) {
  return props.theme.sideBarCloseBtnBgd;
}, function (props) {
  return props.theme.sideBarCloseBtnColor;
}, function (props) {
  return props.theme.sidePanel.margin;
}, function (props) {
  return props.theme.sideBarCloseBtnBgdHover;
});

var SideBar = function (_Component) {
  (0, _inherits3.default)(SideBar, _Component);

  function SideBar() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, SideBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this._onOpenOrClose = function () {
      _this.props.onOpenOrClose({ isOpen: !_this.props.isOpen });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  SideBar.prototype.render = function render() {
    var _props = this.props,
        isOpen = _props.isOpen,
        minifiedWidth = _props.minifiedWidth,
        width = _props.width;

    var horizontalOffset = isOpen ? 0 : minifiedWidth - width;

    return (0, _reactStylematic2.default)(
      StyledSidePanelContainer,
      {
        width: isOpen ? width : 0,
        className: 'side-panel--container'
      },
      (0, _reactStylematic2.default)(
        SideBarContainer,
        { className: 'side-bar', style: { width: width + 'px' },
          left: horizontalOffset },
        isOpen ? (0, _reactStylematic2.default)(
          SideBarInner,
          { className: 'side-bar__inner' },
          this.props.children
        ) : null,
        (0, _reactStylematic2.default)(
          CollapseButton,
          {
            className: 'side-bar__close',
            onClick: this._onOpenOrClose
          },
          (0, _reactStylematic2.default)(_icons.ArrowRight, {
            height: '12px',
            style: { transform: 'rotate(' + (isOpen ? 180 : 0) + 'deg)' }
          })
        )
      )
    );
  };

  return SideBar;
}(_react.Component);

exports.default = SideBar;


SideBar.propTypes = propTypes;
SideBar.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvc2lkZS1iYXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdFByb3BzIiwid2lkdGgiLCJtaW5pZmllZFdpZHRoIiwiaXNPcGVuIiwib25PcGVuT3JDbG9zZSIsIm5vb3AiLCJwcm9wVHlwZXMiLCJudW1iZXIiLCJib29sIiwiZnVuYyIsIlN0eWxlZFNpZGVQYW5lbENvbnRhaW5lciIsImRpdiIsInByb3BzIiwidGhlbWUiLCJzaWRlUGFuZWwiLCJtYXJnaW4iLCJTaWRlQmFyQ29udGFpbmVyIiwibGVmdCIsIlNpZGVCYXJJbm5lciIsInNpZGVQYW5lbEJnIiwiQ29sbGFwc2VCdXR0b24iLCJzaWRlQmFyQ2xvc2VCdG5CZ2QiLCJzaWRlQmFyQ2xvc2VCdG5Db2xvciIsInNpZGVCYXJDbG9zZUJ0bkJnZEhvdmVyIiwiU2lkZUJhciIsIl9vbk9wZW5PckNsb3NlIiwicmVuZGVyIiwiaG9yaXpvbnRhbE9mZnNldCIsImNoaWxkcmVuIiwidHJhbnNmb3JtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzeUJBQUE7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUdBLElBQU1BLGVBQWU7QUFDbkJDLFNBQU8sR0FEWTtBQUVuQkMsaUJBQWUsQ0FGSTtBQUduQkMsVUFBUSxJQUhXO0FBSW5CQyxpQkFBZSxTQUFTQyxJQUFULEdBQWdCLENBQUU7QUFKZCxDQUFyQjs7QUFPQSxJQUFNQyxZQUFZO0FBQ2hCTCxTQUFPLG9CQUFVTSxNQUREO0FBRWhCSixVQUFRLG9CQUFVSyxJQUZGO0FBR2hCTixpQkFBZSxvQkFBVUssTUFIVDtBQUloQkgsaUJBQWUsb0JBQVVLO0FBSlQsQ0FBbEI7O0FBT0EsSUFBTUMsMkJBQTJCLDJCQUFPQyxHQUFsQyxrQkFHSztBQUFBLFNBQVNDLE1BQU1YLEtBQU4sR0FBYyxJQUFJVyxNQUFNQyxLQUFOLENBQVlDLFNBQVosQ0FBc0JDLE1BQWpEO0FBQUEsQ0FITCxFQU9PO0FBQUEsU0FBU0gsTUFBTUMsS0FBTixDQUFZQyxTQUFaLENBQXNCQyxNQUEvQjtBQUFBLENBUFAsQ0FBTjs7QUFVQSxJQUFNQyxtQkFBbUIsMkJBQU9MLEdBQTFCLG1CQUdJO0FBQUEsU0FBU0MsTUFBTUssSUFBZjtBQUFBLENBSEosQ0FBTjs7QUFRQSxJQUFNQyxlQUFlLDJCQUFPUCxHQUF0QixtQkFDZ0I7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlNLFdBQXJCO0FBQUEsQ0FEaEIsQ0FBTjs7QUFRQSxJQUFNQyxpQkFBaUIsMkJBQU9ULEdBQXhCLG1CQUlnQjtBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWVEsa0JBQXJCO0FBQUEsQ0FKaEIsRUFNSztBQUFBLFNBQVNULE1BQU1DLEtBQU4sQ0FBWVMsb0JBQXJCO0FBQUEsQ0FOTCxFQVdHO0FBQUEsU0FBU1YsTUFBTUMsS0FBTixDQUFZQyxTQUFaLENBQXNCQyxNQUEvQjtBQUFBLENBWEgsRUFpQmtCO0FBQUEsU0FBU0gsTUFBTUMsS0FBTixDQUFZVSx1QkFBckI7QUFBQSxDQWpCbEIsQ0FBTjs7SUFxQnFCQyxPOzs7Ozs7Ozs7Ozs7MEpBQ25CQyxjLEdBQWlCLFlBQU07QUFDckIsWUFBS2IsS0FBTCxDQUFXUixhQUFYLENBQXlCLEVBQUNELFFBQVEsQ0FBQyxNQUFLUyxLQUFMLENBQVdULE1BQXJCLEVBQXpCO0FBQ0QsSzs7O29CQUVEdUIsTSxxQkFBUztBQUFBLGlCQUNnQyxLQUFLZCxLQURyQztBQUFBLFFBQ0FULE1BREEsVUFDQUEsTUFEQTtBQUFBLFFBQ1FELGFBRFIsVUFDUUEsYUFEUjtBQUFBLFFBQ3VCRCxLQUR2QixVQUN1QkEsS0FEdkI7O0FBRVAsUUFBTTBCLG1CQUFtQnhCLFNBQVMsQ0FBVCxHQUFhRCxnQkFBZ0JELEtBQXREOztBQUVBLFdBQ0U7QUFBQyw4QkFBRDtBQUFBO0FBQ0UsZUFBT0UsU0FBU0YsS0FBVCxHQUFpQixDQUQxQjtBQUVFLG1CQUFVO0FBRlo7QUFJRTtBQUFDLHdCQUFEO0FBQUEsVUFBa0IsV0FBVSxVQUE1QixFQUF1QyxPQUFPLEVBQUNBLE9BQVVBLEtBQVYsT0FBRCxFQUE5QztBQUNrQixnQkFBTTBCLGdCQUR4QjtBQUVHeEIsaUJBQ0M7QUFBQyxzQkFBRDtBQUFBLFlBQWMsV0FBVSxpQkFBeEI7QUFDRyxlQUFLUyxLQUFMLENBQVdnQjtBQURkLFNBREQsR0FJRyxJQU5OO0FBT0U7QUFBQyx3QkFBRDtBQUFBO0FBQ0UsdUJBQVUsaUJBRFo7QUFFRSxxQkFBUyxLQUFLSDtBQUZoQjtBQUlFO0FBQ0Usb0JBQU8sTUFEVDtBQUVFLG1CQUFPLEVBQUNJLHdCQUFxQjFCLFNBQVMsR0FBVCxHQUFlLENBQXBDLFVBQUQ7QUFGVDtBQUpGO0FBUEY7QUFKRixLQURGO0FBd0JELEc7Ozs7O2tCQWpDa0JxQixPOzs7QUFvQ3JCQSxRQUFRbEIsU0FBUixHQUFvQkEsU0FBcEI7QUFDQWtCLFFBQVF4QixZQUFSLEdBQXVCQSxZQUF2QiIsImZpbGUiOiJzaWRlLWJhci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGNyZWF0ZUVsZW1lbnQgKi9cbmltcG9ydCBjcmVhdGVFbGVtZW50IGZyb20gJ3JlYWN0LXN0eWxlbWF0aWMnO1xuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtBcnJvd1JpZ2h0fSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5cbmltcG9ydCB7c2lkZUJhcn0gZnJvbSAnc3R5bGVzL3NpZGUtcGFuZWwnO1xuaW1wb3J0IHtzaWRlUGFuZWx9IGZyb20gJ3N0eWxlcy9zaWRlLXBhbmVsJztcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICB3aWR0aDogMzAwLFxuICBtaW5pZmllZFdpZHRoOiAwLFxuICBpc09wZW46IHRydWUsXG4gIG9uT3Blbk9yQ2xvc2U6IGZ1bmN0aW9uIG5vb3AoKSB7fVxufTtcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgaXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgbWluaWZpZWRXaWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgb25PcGVuT3JDbG9zZTogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmNvbnN0IFN0eWxlZFNpZGVQYW5lbENvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIHotaW5kZXg6IDk5O1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAke3Byb3BzID0+IHByb3BzLndpZHRoICsgMiAqIHByb3BzLnRoZW1lLnNpZGVQYW5lbC5tYXJnaW59cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHRyYW5zaXRpb246IHdpZHRoIDI1MG1zO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHBhZGRpbmc6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsLm1hcmdpbn1weDtcbmA7XG5cbmNvbnN0IFNpZGVCYXJDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICBib3gtc2hhZG93OiAwIDFweCAzcHggcmdiYSgwLCAwLCAwLCAwLjIpO1xuICB0cmFuc2l0aW9uOiBsZWZ0IDI1MG1zLCByaWdodCAyNTBtcztcbiAgbGVmdDogJHtwcm9wcyA9PiBwcm9wcy5sZWZ0fXB4O1xuICBhbGlnbi1pdGVtczogc3RyZXRjaDtcbiAgZmxleC1ncm93OiAxO1xuYDtcblxuY29uc3QgU2lkZUJhcklubmVyID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWxCZ307XG4gIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgaGVpZ2h0OiAxMDAlO1xuYDtcblxuY29uc3QgQ29sbGFwc2VCdXR0b24gPSBzdHlsZWQuZGl2YFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBib3gtc2hhZG93OiAwIDFweCAzcHggcmdiYSgwLCAwLCAwLCAwLjIpO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlQmFyQ2xvc2VCdG5CZ2R9O1xuICBib3JkZXItcmFkaXVzOiAxcHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVCYXJDbG9zZUJ0bkNvbG9yfTtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAyMHB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHJpZ2h0OiAtOHB4O1xuICB0b3A6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZVBhbmVsLm1hcmdpbn1weDtcbiAgd2lkdGg6IDIwcHg7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYm94LXNoYWRvdzogbm9uZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVCYXJDbG9zZUJ0bkJnZEhvdmVyfTtcbiAgfVxuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2lkZUJhciBleHRlbmRzIENvbXBvbmVudCB7XG4gIF9vbk9wZW5PckNsb3NlID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMub25PcGVuT3JDbG9zZSh7aXNPcGVuOiAhdGhpcy5wcm9wcy5pc09wZW59KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2lzT3BlbiwgbWluaWZpZWRXaWR0aCwgd2lkdGh9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBob3Jpem9udGFsT2Zmc2V0ID0gaXNPcGVuID8gMCA6IG1pbmlmaWVkV2lkdGggLSB3aWR0aDtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkU2lkZVBhbmVsQ29udGFpbmVyXG4gICAgICAgIHdpZHRoPXtpc09wZW4gPyB3aWR0aCA6IDB9XG4gICAgICAgIGNsYXNzTmFtZT1cInNpZGUtcGFuZWwtLWNvbnRhaW5lclwiXG4gICAgICA+XG4gICAgICAgIDxTaWRlQmFyQ29udGFpbmVyIGNsYXNzTmFtZT1cInNpZGUtYmFyXCIgc3R5bGU9e3t3aWR0aDogYCR7d2lkdGh9cHhgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdD17aG9yaXpvbnRhbE9mZnNldH0+XG4gICAgICAgICAge2lzT3BlbiA/IChcbiAgICAgICAgICAgIDxTaWRlQmFySW5uZXIgY2xhc3NOYW1lPVwic2lkZS1iYXJfX2lubmVyXCI+XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICAgICAgPC9TaWRlQmFySW5uZXI+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgPENvbGxhcHNlQnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJzaWRlLWJhcl9fY2xvc2VcIlxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5fb25PcGVuT3JDbG9zZX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8QXJyb3dSaWdodFxuICAgICAgICAgICAgICBoZWlnaHQ9XCIxMnB4XCJcbiAgICAgICAgICAgICAgc3R5bGU9e3t0cmFuc2Zvcm06IGByb3RhdGUoJHtpc09wZW4gPyAxODAgOiAwfWRlZylgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Db2xsYXBzZUJ1dHRvbj5cbiAgICAgICAgPC9TaWRlQmFyQ29udGFpbmVyPlxuICAgICAgPC9TdHlsZWRTaWRlUGFuZWxDb250YWluZXI+XG4gICAgKTtcbiAgfVxufVxuXG5TaWRlQmFyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblNpZGVCYXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19