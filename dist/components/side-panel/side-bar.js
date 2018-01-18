'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactStylematic = require('react-stylematic');

var _reactStylematic2 = _interopRequireDefault(_reactStylematic);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _icons = require('../common/icons');

var _sidePanel = require('../../styles/side-panel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @jsx createElement */
var DEFAULT_WIDTH = 330;

var defaultProps = {
  width: DEFAULT_WIDTH,
  height: _window2.default.innerHeight,
  top: 0,
  minifiedWidth: 0,
  isOpen: false,
  onOpenOrClose: function noop() {}
};

var propTypes = {
  width: _propTypes2.default.number,
  height: _propTypes2.default.number,
  top: _propTypes2.default.number,
  isOpen: _propTypes2.default.bool,
  minifiedWidth: _propTypes2.default.number,
  onOpenOrClose: _propTypes2.default.func
};

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
        width = _props.width,
        top = _props.top,
        height = _props.height;

    var horizontalOffset = isOpen ? 0 : minifiedWidth - width;
    var contentWidth = isOpen ? width : minifiedWidth;

    var containerStyle = (0, _extends3.default)({}, _sidePanel.sideBar, {
      top: top,
      width: width,
      height: height,
      left: horizontalOffset
    });

    var wrapperStyle = { height: height };

    var innerStyle = {
      width: contentWidth
    };

    return (0, _reactStylematic2.default)(
      'div',
      { className: 'side-bar', style: containerStyle },
      (0, _reactStylematic2.default)(
        'div',
        { className: 'side-bar__wrapper', style: wrapperStyle },
        (0, _reactStylematic2.default)(
          'div',
          { className: 'side-bar__inner', style: innerStyle },
          (0, _reactStylematic2.default)(
            'div',
            null,
            (0, _reactStylematic2.default)(SideBarTitle, { onClick: this._onOpenOrClose, title: this.props.title }),
            this.props.children
          )
        )
      )
    );
  };

  return SideBar;
}(_react.Component);

exports.default = SideBar;


var SideBarTitle = function SideBarTitle(_ref) {
  var onClick = _ref.onClick,
      title = _ref.title;
  return (0, _reactStylematic2.default)(
    'div',
    { className: 'side-bar__top', onClick: onClick },
    (0, _reactStylematic2.default)(
      'div',
      { className: 'side-bar__title' },
      title
    ),
    (0, _reactStylematic2.default)(
      'div',
      { className: 'button button-link' },
      (0, _reactStylematic2.default)(_icons.ArrowLeft, null),
      'Collapse'
    )
  );
};

SideBar.propTypes = propTypes;
SideBar.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvc2lkZS1iYXIuanMiXSwibmFtZXMiOlsiREVGQVVMVF9XSURUSCIsImRlZmF1bHRQcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJ0b3AiLCJtaW5pZmllZFdpZHRoIiwiaXNPcGVuIiwib25PcGVuT3JDbG9zZSIsIm5vb3AiLCJwcm9wVHlwZXMiLCJudW1iZXIiLCJib29sIiwiZnVuYyIsIlNpZGVCYXIiLCJfb25PcGVuT3JDbG9zZSIsInByb3BzIiwicmVuZGVyIiwiaG9yaXpvbnRhbE9mZnNldCIsImNvbnRlbnRXaWR0aCIsImNvbnRhaW5lclN0eWxlIiwibGVmdCIsIndyYXBwZXJTdHlsZSIsImlubmVyU3R5bGUiLCJ0aXRsZSIsImNoaWxkcmVuIiwiU2lkZUJhclRpdGxlIiwib25DbGljayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBUEE7QUFTQSxJQUFNQSxnQkFBZ0IsR0FBdEI7O0FBRUEsSUFBT0MsZUFBZTtBQUNwQkMsU0FBT0YsYUFEYTtBQUVwQkcsVUFBUSxpQkFBT0MsV0FGSztBQUdwQkMsT0FBSyxDQUhlO0FBSXBCQyxpQkFBZSxDQUpLO0FBS3BCQyxVQUFRLEtBTFk7QUFNcEJDLGlCQUFlLFNBQVNDLElBQVQsR0FBZ0IsQ0FBRTtBQU5iLENBQXRCOztBQVNBLElBQU1DLFlBQVk7QUFDaEJSLFNBQU8sb0JBQVVTLE1BREQ7QUFFaEJSLFVBQVEsb0JBQVVRLE1BRkY7QUFHaEJOLE9BQUssb0JBQVVNLE1BSEM7QUFJaEJKLFVBQVEsb0JBQVVLLElBSkY7QUFLaEJOLGlCQUFlLG9CQUFVSyxNQUxUO0FBTWhCSCxpQkFBZSxvQkFBVUs7QUFOVCxDQUFsQjs7SUFTcUJDLE87Ozs7Ozs7Ozs7OzswSkFFbkJDLGMsR0FBaUIsWUFBTTtBQUNyQixZQUFLQyxLQUFMLENBQVdSLGFBQVgsQ0FBeUIsRUFBQ0QsUUFBUSxDQUFDLE1BQUtTLEtBQUwsQ0FBV1QsTUFBckIsRUFBekI7QUFDRCxLOzs7b0JBRURVLE0scUJBQVM7QUFBQSxpQkFDNkMsS0FBS0QsS0FEbEQ7QUFBQSxRQUNBVCxNQURBLFVBQ0FBLE1BREE7QUFBQSxRQUNRRCxhQURSLFVBQ1FBLGFBRFI7QUFBQSxRQUN1QkosS0FEdkIsVUFDdUJBLEtBRHZCO0FBQUEsUUFDOEJHLEdBRDlCLFVBQzhCQSxHQUQ5QjtBQUFBLFFBQ21DRixNQURuQyxVQUNtQ0EsTUFEbkM7O0FBRVAsUUFBTWUsbUJBQW1CWCxTQUFTLENBQVQsR0FBYUQsZ0JBQWdCSixLQUF0RDtBQUNBLFFBQU1pQixlQUFlWixTQUFTTCxLQUFULEdBQWlCSSxhQUF0Qzs7QUFFQSxRQUFNYztBQUVKZixjQUZJO0FBR0pILGtCQUhJO0FBSUpDLG9CQUpJO0FBS0prQixZQUFNSDtBQUxGLE1BQU47O0FBUUEsUUFBTUksZUFBZSxFQUFDbkIsY0FBRCxFQUFyQjs7QUFFQSxRQUFNb0IsYUFBYTtBQUNqQnJCLGFBQU9pQjtBQURVLEtBQW5COztBQUlBLFdBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSxVQUFmLEVBQTBCLE9BQU9DLGNBQWpDO0FBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxtQkFBZixFQUFtQyxPQUFPRSxZQUExQztBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsaUJBQWYsRUFBaUMsT0FBT0MsVUFBeEM7QUFDRTtBQUFBO0FBQUE7QUFDRSwyQ0FBQyxZQUFELElBQWMsU0FBUyxLQUFLUixjQUE1QixFQUE0QyxPQUFPLEtBQUtDLEtBQUwsQ0FBV1EsS0FBOUQsR0FERjtBQUVHLGlCQUFLUixLQUFMLENBQVdTO0FBRmQ7QUFERjtBQURGO0FBREYsS0FERjtBQVlELEc7Ozs7O2tCQXJDa0JYLE87OztBQXdDckIsSUFBTVksZUFBZSxTQUFmQSxZQUFlO0FBQUEsTUFBRUMsT0FBRixRQUFFQSxPQUFGO0FBQUEsTUFBV0gsS0FBWCxRQUFXQSxLQUFYO0FBQUEsU0FDbkI7QUFBQTtBQUFBLE1BQUssV0FBVSxlQUFmLEVBQStCLFNBQVNHLE9BQXhDO0FBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSxpQkFBZjtBQUFrQ0g7QUFBbEMsS0FERjtBQUVFO0FBQUE7QUFBQSxRQUFLLFdBQVUsb0JBQWY7QUFDRSw0REFERjtBQUFBO0FBQUE7QUFGRixHQURtQjtBQUFBLENBQXJCOztBQVNBVixRQUFRSixTQUFSLEdBQW9CQSxTQUFwQjtBQUNBSSxRQUFRYixZQUFSLEdBQXVCQSxZQUF2QiIsImZpbGUiOiJzaWRlLWJhci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGNyZWF0ZUVsZW1lbnQgKi9cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNyZWF0ZUVsZW1lbnQgZnJvbSAncmVhY3Qtc3R5bGVtYXRpYyc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7QXJyb3dMZWZ0fSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5cbmltcG9ydCB7c2lkZUJhcn0gZnJvbSAnc3R5bGVzL3NpZGUtcGFuZWwnO1xuXG5jb25zdCBERUZBVUxUX1dJRFRIID0gMzMwO1xuXG5jb25zdCAgZGVmYXVsdFByb3BzID0ge1xuICB3aWR0aDogREVGQVVMVF9XSURUSCxcbiAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gIHRvcDogMCxcbiAgbWluaWZpZWRXaWR0aDogMCxcbiAgaXNPcGVuOiBmYWxzZSxcbiAgb25PcGVuT3JDbG9zZTogZnVuY3Rpb24gbm9vcCgpIHt9XG59O1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIHRvcDogUHJvcFR5cGVzLm51bWJlcixcbiAgaXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgbWluaWZpZWRXaWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgb25PcGVuT3JDbG9zZTogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZGVCYXIgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gIF9vbk9wZW5PckNsb3NlID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMub25PcGVuT3JDbG9zZSh7aXNPcGVuOiAhdGhpcy5wcm9wcy5pc09wZW59KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2lzT3BlbiwgbWluaWZpZWRXaWR0aCwgd2lkdGgsIHRvcCwgaGVpZ2h0fSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaG9yaXpvbnRhbE9mZnNldCA9IGlzT3BlbiA/IDAgOiBtaW5pZmllZFdpZHRoIC0gd2lkdGg7XG4gICAgY29uc3QgY29udGVudFdpZHRoID0gaXNPcGVuID8gd2lkdGggOiBtaW5pZmllZFdpZHRoO1xuXG4gICAgY29uc3QgY29udGFpbmVyU3R5bGUgPSB7XG4gICAgICAuLi5zaWRlQmFyLFxuICAgICAgdG9wLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBsZWZ0OiBob3Jpem9udGFsT2Zmc2V0XG4gICAgfTtcblxuICAgIGNvbnN0IHdyYXBwZXJTdHlsZSA9IHtoZWlnaHR9O1xuXG4gICAgY29uc3QgaW5uZXJTdHlsZSA9IHtcbiAgICAgIHdpZHRoOiBjb250ZW50V2lkdGhcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2lkZS1iYXJcIiBzdHlsZT17Y29udGFpbmVyU3R5bGV9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNpZGUtYmFyX193cmFwcGVyXCIgc3R5bGU9e3dyYXBwZXJTdHlsZX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaWRlLWJhcl9faW5uZXJcIiBzdHlsZT17aW5uZXJTdHlsZX0+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8U2lkZUJhclRpdGxlIG9uQ2xpY2s9e3RoaXMuX29uT3Blbk9yQ2xvc2V9IHRpdGxlPXt0aGlzLnByb3BzLnRpdGxlfS8+XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBTaWRlQmFyVGl0bGUgPSAoe29uQ2xpY2ssIHRpdGxlfSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cInNpZGUtYmFyX190b3BcIiBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNpZGUtYmFyX190aXRsZVwiPnt0aXRsZX08L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1dHRvbiBidXR0b24tbGlua1wiPlxuICAgICAgPEFycm93TGVmdC8+Q29sbGFwc2VcbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4pO1xuXG5TaWRlQmFyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblNpZGVCYXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19