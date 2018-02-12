'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

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

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  z-index: 99;\n  height: 100%;\n  width: ', 'px;\n  display: flex;\n  transition: width 250ms;\n  position: absolute;\n  padding: ', 'px;\n'], ['\n  z-index: 99;\n  height: 100%;\n  width: ', 'px;\n  display: flex;\n  transition: width 250ms;\n  position: absolute;\n  padding: ', 'px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  transition: left 250ms, right 250ms;\n  left: ', 'px;\n  align-items: stretch;\n  flex-grow: 1;\n'], ['\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  transition: left 250ms, right 250ms;\n  left: ', 'px;\n  align-items: stretch;\n  flex-grow: 1;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  background-color: ', ';\n  border-radius: 1px;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n'], ['\n  background-color: ', ';\n  border-radius: 1px;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  align-items: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  justify-content: center;\n  background-color: ', ';\n  border-radius: 1px;\n  color: ', ';\n  display: flex;\n  height: 20px;\n  position: absolute;\n  right: -8px;\n  top: ', 'px;\n  width: 20px;\n\n  :hover {\n    cursor: pointer;\n    box-shadow: none;\n    background-color: ', ';\n  }\n'], ['\n  align-items: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  justify-content: center;\n  background-color: ', ';\n  border-radius: 1px;\n  color: ', ';\n  display: flex;\n  height: 20px;\n  position: absolute;\n  right: -8px;\n  top: ', 'px;\n  width: 20px;\n\n  :hover {\n    cursor: pointer;\n    box-shadow: none;\n    background-color: ', ';\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _icons = require('../common/icons');

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
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, SideBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = SideBar.__proto__ || Object.getPrototypeOf(SideBar)).call.apply(_ref, [this].concat(args))), _this), _this._onOpenOrClose = function () {
      _this.props.onOpenOrClose({ isOpen: !_this.props.isOpen });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(SideBar, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          isOpen = _props.isOpen,
          minifiedWidth = _props.minifiedWidth,
          width = _props.width;

      var horizontalOffset = isOpen ? 0 : minifiedWidth - width;

      return _react2.default.createElement(
        StyledSidePanelContainer,
        {
          width: isOpen ? width : 0,
          className: 'side-panel--container'
        },
        _react2.default.createElement(
          SideBarContainer,
          { className: 'side-bar', style: { width: width + 'px' },
            left: horizontalOffset },
          isOpen ? _react2.default.createElement(
            SideBarInner,
            { className: 'side-bar__inner' },
            this.props.children
          ) : null,
          _react2.default.createElement(
            CollapseButton,
            {
              className: 'side-bar__close',
              onClick: this._onOpenOrClose
            },
            _react2.default.createElement(_icons.ArrowRight, {
              height: '12px',
              style: { transform: 'rotate(' + (isOpen ? 180 : 0) + 'deg)' }
            })
          )
        )
      );
    }
  }]);
  return SideBar;
}(_react.Component);

exports.default = SideBar;


SideBar.propTypes = propTypes;
SideBar.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvc2lkZS1iYXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdFByb3BzIiwid2lkdGgiLCJtaW5pZmllZFdpZHRoIiwiaXNPcGVuIiwib25PcGVuT3JDbG9zZSIsIm5vb3AiLCJwcm9wVHlwZXMiLCJudW1iZXIiLCJib29sIiwiZnVuYyIsIlN0eWxlZFNpZGVQYW5lbENvbnRhaW5lciIsImRpdiIsInByb3BzIiwidGhlbWUiLCJzaWRlUGFuZWwiLCJtYXJnaW4iLCJTaWRlQmFyQ29udGFpbmVyIiwibGVmdCIsIlNpZGVCYXJJbm5lciIsInNpZGVQYW5lbEJnIiwiQ29sbGFwc2VCdXR0b24iLCJzaWRlQmFyQ2xvc2VCdG5CZ2QiLCJzaWRlQmFyQ2xvc2VCdG5Db2xvciIsInNpZGVCYXJDbG9zZUJ0bkJnZEhvdmVyIiwiU2lkZUJhciIsIl9vbk9wZW5PckNsb3NlIiwiaG9yaXpvbnRhbE9mZnNldCIsImNoaWxkcmVuIiwidHJhbnNmb3JtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsZUFBZTtBQUNuQkMsU0FBTyxHQURZO0FBRW5CQyxpQkFBZSxDQUZJO0FBR25CQyxVQUFRLElBSFc7QUFJbkJDLGlCQUFlLFNBQVNDLElBQVQsR0FBZ0IsQ0FBRTtBQUpkLENBQXJCOztBQU9BLElBQU1DLFlBQVk7QUFDaEJMLFNBQU8sb0JBQVVNLE1BREQ7QUFFaEJKLFVBQVEsb0JBQVVLLElBRkY7QUFHaEJOLGlCQUFlLG9CQUFVSyxNQUhUO0FBSWhCSCxpQkFBZSxvQkFBVUs7QUFKVCxDQUFsQjs7QUFPQSxJQUFNQywyQkFBMkIsMkJBQU9DLEdBQWxDLGtCQUdLO0FBQUEsU0FBU0MsTUFBTVgsS0FBTixHQUFjLElBQUlXLE1BQU1DLEtBQU4sQ0FBWUMsU0FBWixDQUFzQkMsTUFBakQ7QUFBQSxDQUhMLEVBT087QUFBQSxTQUFTSCxNQUFNQyxLQUFOLENBQVlDLFNBQVosQ0FBc0JDLE1BQS9CO0FBQUEsQ0FQUCxDQUFOOztBQVVBLElBQU1DLG1CQUFtQiwyQkFBT0wsR0FBMUIsbUJBR0k7QUFBQSxTQUFTQyxNQUFNSyxJQUFmO0FBQUEsQ0FISixDQUFOOztBQVFBLElBQU1DLGVBQWUsMkJBQU9QLEdBQXRCLG1CQUNnQjtBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWU0sV0FBckI7QUFBQSxDQURoQixDQUFOOztBQVFBLElBQU1DLGlCQUFpQiwyQkFBT1QsR0FBeEIsbUJBSWdCO0FBQUEsU0FBU0MsTUFBTUMsS0FBTixDQUFZUSxrQkFBckI7QUFBQSxDQUpoQixFQU1LO0FBQUEsU0FBU1QsTUFBTUMsS0FBTixDQUFZUyxvQkFBckI7QUFBQSxDQU5MLEVBV0c7QUFBQSxTQUFTVixNQUFNQyxLQUFOLENBQVlDLFNBQVosQ0FBc0JDLE1BQS9CO0FBQUEsQ0FYSCxFQWlCa0I7QUFBQSxTQUFTSCxNQUFNQyxLQUFOLENBQVlVLHVCQUFyQjtBQUFBLENBakJsQixDQUFOOztJQXFCcUJDLE87Ozs7Ozs7Ozs7Ozs7O3NNQUNuQkMsYyxHQUFpQixZQUFNO0FBQ3JCLFlBQUtiLEtBQUwsQ0FBV1IsYUFBWCxDQUF5QixFQUFDRCxRQUFRLENBQUMsTUFBS1MsS0FBTCxDQUFXVCxNQUFyQixFQUF6QjtBQUNELEs7Ozs7OzZCQUVRO0FBQUEsbUJBQ2dDLEtBQUtTLEtBRHJDO0FBQUEsVUFDQVQsTUFEQSxVQUNBQSxNQURBO0FBQUEsVUFDUUQsYUFEUixVQUNRQSxhQURSO0FBQUEsVUFDdUJELEtBRHZCLFVBQ3VCQSxLQUR2Qjs7QUFFUCxVQUFNeUIsbUJBQW1CdkIsU0FBUyxDQUFULEdBQWFELGdCQUFnQkQsS0FBdEQ7O0FBRUEsYUFDRTtBQUFDLGdDQUFEO0FBQUE7QUFDRSxpQkFBT0UsU0FBU0YsS0FBVCxHQUFpQixDQUQxQjtBQUVFLHFCQUFVO0FBRlo7QUFJRTtBQUFDLDBCQUFEO0FBQUEsWUFBa0IsV0FBVSxVQUE1QixFQUF1QyxPQUFPLEVBQUNBLE9BQVVBLEtBQVYsT0FBRCxFQUE5QztBQUNrQixrQkFBTXlCLGdCQUR4QjtBQUVHdkIsbUJBQ0M7QUFBQyx3QkFBRDtBQUFBLGNBQWMsV0FBVSxpQkFBeEI7QUFDRyxpQkFBS1MsS0FBTCxDQUFXZTtBQURkLFdBREQsR0FJRyxJQU5OO0FBT0U7QUFBQywwQkFBRDtBQUFBO0FBQ0UseUJBQVUsaUJBRFo7QUFFRSx1QkFBUyxLQUFLRjtBQUZoQjtBQUlFO0FBQ0Usc0JBQU8sTUFEVDtBQUVFLHFCQUFPLEVBQUNHLHdCQUFxQnpCLFNBQVMsR0FBVCxHQUFlLENBQXBDLFVBQUQ7QUFGVDtBQUpGO0FBUEY7QUFKRixPQURGO0FBd0JEOzs7OztrQkFqQ2tCcUIsTzs7O0FBb0NyQkEsUUFBUWxCLFNBQVIsR0FBb0JBLFNBQXBCO0FBQ0FrQixRQUFReEIsWUFBUixHQUF1QkEsWUFBdkIiLCJmaWxlIjoic2lkZS1iYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7QXJyb3dSaWdodH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIHdpZHRoOiAzMDAsXG4gIG1pbmlmaWVkV2lkdGg6IDAsXG4gIGlzT3BlbjogdHJ1ZSxcbiAgb25PcGVuT3JDbG9zZTogZnVuY3Rpb24gbm9vcCgpIHt9XG59O1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBpc09wZW46IFByb3BUeXBlcy5ib29sLFxuICBtaW5pZmllZFdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbk9wZW5PckNsb3NlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuY29uc3QgU3R5bGVkU2lkZVBhbmVsQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgei1pbmRleDogOTk7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMud2lkdGggKyAyICogcHJvcHMudGhlbWUuc2lkZVBhbmVsLm1hcmdpbn1weDtcbiAgZGlzcGxheTogZmxleDtcbiAgdHJhbnNpdGlvbjogd2lkdGggMjUwbXM7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcGFkZGluZzogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWwubWFyZ2lufXB4O1xuYDtcblxuY29uc3QgU2lkZUJhckNvbnRhaW5lciA9IHN0eWxlZC5kaXZgXG4gIGJveC1zaGFkb3c6IDAgMXB4IDNweCByZ2JhKDAsIDAsIDAsIDAuMik7XG4gIHRyYW5zaXRpb246IGxlZnQgMjUwbXMsIHJpZ2h0IDI1MG1zO1xuICBsZWZ0OiAke3Byb3BzID0+IHByb3BzLmxlZnR9cHg7XG4gIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuICBmbGV4LWdyb3c6IDE7XG5gO1xuXG5jb25zdCBTaWRlQmFySW5uZXIgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVQYW5lbEJnfTtcbiAgYm9yZGVyLXJhZGl1czogMXB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBoZWlnaHQ6IDEwMCU7XG5gO1xuXG5jb25zdCBDb2xsYXBzZUJ1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJveC1zaGFkb3c6IDAgMXB4IDNweCByZ2JhKDAsIDAsIDAsIDAuMik7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNpZGVCYXJDbG9zZUJ0bkJnZH07XG4gIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZUJhckNsb3NlQnRuQ29sb3J9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDIwcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IC04cHg7XG4gIHRvcDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zaWRlUGFuZWwubWFyZ2lufXB4O1xuICB3aWR0aDogMjBweDtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBib3gtc2hhZG93OiBub25lO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2lkZUJhckNsb3NlQnRuQmdkSG92ZXJ9O1xuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWRlQmFyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgX29uT3Blbk9yQ2xvc2UgPSAoKSA9PiB7XG4gICAgdGhpcy5wcm9wcy5vbk9wZW5PckNsb3NlKHtpc09wZW46ICF0aGlzLnByb3BzLmlzT3Blbn0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7aXNPcGVuLCBtaW5pZmllZFdpZHRoLCB3aWR0aH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGhvcml6b250YWxPZmZzZXQgPSBpc09wZW4gPyAwIDogbWluaWZpZWRXaWR0aCAtIHdpZHRoO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRTaWRlUGFuZWxDb250YWluZXJcbiAgICAgICAgd2lkdGg9e2lzT3BlbiA/IHdpZHRoIDogMH1cbiAgICAgICAgY2xhc3NOYW1lPVwic2lkZS1wYW5lbC0tY29udGFpbmVyXCJcbiAgICAgID5cbiAgICAgICAgPFNpZGVCYXJDb250YWluZXIgY2xhc3NOYW1lPVwic2lkZS1iYXJcIiBzdHlsZT17e3dpZHRoOiBgJHt3aWR0aH1weGB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0PXtob3Jpem9udGFsT2Zmc2V0fT5cbiAgICAgICAgICB7aXNPcGVuID8gKFxuICAgICAgICAgICAgPFNpZGVCYXJJbm5lciBjbGFzc05hbWU9XCJzaWRlLWJhcl9faW5uZXJcIj5cbiAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICAgICAgICA8L1NpZGVCYXJJbm5lcj5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICA8Q29sbGFwc2VCdXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInNpZGUtYmFyX19jbG9zZVwiXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLl9vbk9wZW5PckNsb3NlfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxBcnJvd1JpZ2h0XG4gICAgICAgICAgICAgIGhlaWdodD1cIjEycHhcIlxuICAgICAgICAgICAgICBzdHlsZT17e3RyYW5zZm9ybTogYHJvdGF0ZSgke2lzT3BlbiA/IDE4MCA6IDB9ZGVnKWB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0NvbGxhcHNlQnV0dG9uPlxuICAgICAgICA8L1NpZGVCYXJDb250YWluZXI+XG4gICAgICA8L1N0eWxlZFNpZGVQYW5lbENvbnRhaW5lcj5cbiAgICApO1xuICB9XG59XG5cblNpZGVCYXIucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuU2lkZUJhci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=