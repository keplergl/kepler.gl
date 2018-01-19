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
            (0, _reactStylematic2.default)(SideBarTitle, {
              onClick: this._onOpenOrClose,
              title: this.props.title
            }),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvc2lkZS1iYXIuanMiXSwibmFtZXMiOlsiREVGQVVMVF9XSURUSCIsImRlZmF1bHRQcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJ0b3AiLCJtaW5pZmllZFdpZHRoIiwiaXNPcGVuIiwib25PcGVuT3JDbG9zZSIsIm5vb3AiLCJwcm9wVHlwZXMiLCJudW1iZXIiLCJib29sIiwiZnVuYyIsIlNpZGVCYXIiLCJfb25PcGVuT3JDbG9zZSIsInByb3BzIiwicmVuZGVyIiwiaG9yaXpvbnRhbE9mZnNldCIsImNvbnRlbnRXaWR0aCIsImNvbnRhaW5lclN0eWxlIiwibGVmdCIsIndyYXBwZXJTdHlsZSIsImlubmVyU3R5bGUiLCJ0aXRsZSIsImNoaWxkcmVuIiwiU2lkZUJhclRpdGxlIiwib25DbGljayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQVBBO0FBU0EsSUFBTUEsZ0JBQWdCLEdBQXRCOztBQUVBLElBQU1DLGVBQWU7QUFDbkJDLFNBQU9GLGFBRFk7QUFFbkJHLFVBQVEsaUJBQU9DLFdBRkk7QUFHbkJDLE9BQUssQ0FIYztBQUluQkMsaUJBQWUsQ0FKSTtBQUtuQkMsVUFBUSxLQUxXO0FBTW5CQyxpQkFBZSxTQUFTQyxJQUFULEdBQWdCLENBQUU7QUFOZCxDQUFyQjs7QUFTQSxJQUFNQyxZQUFZO0FBQ2hCUixTQUFPLG9CQUFVUyxNQUREO0FBRWhCUixVQUFRLG9CQUFVUSxNQUZGO0FBR2hCTixPQUFLLG9CQUFVTSxNQUhDO0FBSWhCSixVQUFRLG9CQUFVSyxJQUpGO0FBS2hCTixpQkFBZSxvQkFBVUssTUFMVDtBQU1oQkgsaUJBQWUsb0JBQVVLO0FBTlQsQ0FBbEI7O0lBU3FCQyxPOzs7Ozs7Ozs7Ozs7MEpBQ25CQyxjLEdBQWlCLFlBQU07QUFDckIsWUFBS0MsS0FBTCxDQUFXUixhQUFYLENBQXlCLEVBQUNELFFBQVEsQ0FBQyxNQUFLUyxLQUFMLENBQVdULE1BQXJCLEVBQXpCO0FBQ0QsSzs7O29CQUVEVSxNLHFCQUFTO0FBQUEsaUJBQzZDLEtBQUtELEtBRGxEO0FBQUEsUUFDQVQsTUFEQSxVQUNBQSxNQURBO0FBQUEsUUFDUUQsYUFEUixVQUNRQSxhQURSO0FBQUEsUUFDdUJKLEtBRHZCLFVBQ3VCQSxLQUR2QjtBQUFBLFFBQzhCRyxHQUQ5QixVQUM4QkEsR0FEOUI7QUFBQSxRQUNtQ0YsTUFEbkMsVUFDbUNBLE1BRG5DOztBQUVQLFFBQU1lLG1CQUFtQlgsU0FBUyxDQUFULEdBQWFELGdCQUFnQkosS0FBdEQ7QUFDQSxRQUFNaUIsZUFBZVosU0FBU0wsS0FBVCxHQUFpQkksYUFBdEM7O0FBRUEsUUFBTWM7QUFFSmYsY0FGSTtBQUdKSCxrQkFISTtBQUlKQyxvQkFKSTtBQUtKa0IsWUFBTUg7QUFMRixNQUFOOztBQVFBLFFBQU1JLGVBQWUsRUFBQ25CLGNBQUQsRUFBckI7O0FBRUEsUUFBTW9CLGFBQWE7QUFDakJyQixhQUFPaUI7QUFEVSxLQUFuQjs7QUFJQSxXQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsVUFBZixFQUEwQixPQUFPQyxjQUFqQztBQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsbUJBQWYsRUFBbUMsT0FBT0UsWUFBMUM7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGlCQUFmLEVBQWlDLE9BQU9DLFVBQXhDO0FBQ0U7QUFBQTtBQUFBO0FBQ0UsMkNBQUMsWUFBRDtBQUNFLHVCQUFTLEtBQUtSLGNBRGhCO0FBRUUscUJBQU8sS0FBS0MsS0FBTCxDQUFXUTtBQUZwQixjQURGO0FBS0csaUJBQUtSLEtBQUwsQ0FBV1M7QUFMZDtBQURGO0FBREY7QUFERixLQURGO0FBZUQsRzs7Ozs7a0JBdkNrQlgsTzs7O0FBMENyQixJQUFNWSxlQUFlLFNBQWZBLFlBQWU7QUFBQSxNQUFFQyxPQUFGLFFBQUVBLE9BQUY7QUFBQSxNQUFXSCxLQUFYLFFBQVdBLEtBQVg7QUFBQSxTQUNuQjtBQUFBO0FBQUEsTUFBSyxXQUFVLGVBQWYsRUFBK0IsU0FBU0csT0FBeEM7QUFDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLGlCQUFmO0FBQWtDSDtBQUFsQyxLQURGO0FBRUU7QUFBQTtBQUFBLFFBQUssV0FBVSxvQkFBZjtBQUNFLDREQURGO0FBQUE7QUFBQTtBQUZGLEdBRG1CO0FBQUEsQ0FBckI7O0FBU0FWLFFBQVFKLFNBQVIsR0FBb0JBLFNBQXBCO0FBQ0FJLFFBQVFiLFlBQVIsR0FBdUJBLFlBQXZCIiwiZmlsZSI6InNpZGUtYmFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3ggY3JlYXRlRWxlbWVudCAqL1xuaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjcmVhdGVFbGVtZW50IGZyb20gJ3JlYWN0LXN0eWxlbWF0aWMnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQge0Fycm93TGVmdH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuXG5pbXBvcnQge3NpZGVCYXJ9IGZyb20gJ3N0eWxlcy9zaWRlLXBhbmVsJztcblxuY29uc3QgREVGQVVMVF9XSURUSCA9IDMzMDtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICB3aWR0aDogREVGQVVMVF9XSURUSCxcbiAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gIHRvcDogMCxcbiAgbWluaWZpZWRXaWR0aDogMCxcbiAgaXNPcGVuOiBmYWxzZSxcbiAgb25PcGVuT3JDbG9zZTogZnVuY3Rpb24gbm9vcCgpIHt9XG59O1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIHRvcDogUHJvcFR5cGVzLm51bWJlcixcbiAgaXNPcGVuOiBQcm9wVHlwZXMuYm9vbCxcbiAgbWluaWZpZWRXaWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgb25PcGVuT3JDbG9zZTogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZGVCYXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICBfb25PcGVuT3JDbG9zZSA9ICgpID0+IHtcbiAgICB0aGlzLnByb3BzLm9uT3Blbk9yQ2xvc2Uoe2lzT3BlbjogIXRoaXMucHJvcHMuaXNPcGVufSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtpc09wZW4sIG1pbmlmaWVkV2lkdGgsIHdpZHRoLCB0b3AsIGhlaWdodH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGhvcml6b250YWxPZmZzZXQgPSBpc09wZW4gPyAwIDogbWluaWZpZWRXaWR0aCAtIHdpZHRoO1xuICAgIGNvbnN0IGNvbnRlbnRXaWR0aCA9IGlzT3BlbiA/IHdpZHRoIDogbWluaWZpZWRXaWR0aDtcblxuICAgIGNvbnN0IGNvbnRhaW5lclN0eWxlID0ge1xuICAgICAgLi4uc2lkZUJhcixcbiAgICAgIHRvcCxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgbGVmdDogaG9yaXpvbnRhbE9mZnNldFxuICAgIH07XG5cbiAgICBjb25zdCB3cmFwcGVyU3R5bGUgPSB7aGVpZ2h0fTtcblxuICAgIGNvbnN0IGlubmVyU3R5bGUgPSB7XG4gICAgICB3aWR0aDogY29udGVudFdpZHRoXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNpZGUtYmFyXCIgc3R5bGU9e2NvbnRhaW5lclN0eWxlfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaWRlLWJhcl9fd3JhcHBlclwiIHN0eWxlPXt3cmFwcGVyU3R5bGV9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2lkZS1iYXJfX2lubmVyXCIgc3R5bGU9e2lubmVyU3R5bGV9PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPFNpZGVCYXJUaXRsZVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuX29uT3Blbk9yQ2xvc2V9XG4gICAgICAgICAgICAgICAgdGl0bGU9e3RoaXMucHJvcHMudGl0bGV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBTaWRlQmFyVGl0bGUgPSAoe29uQ2xpY2ssIHRpdGxlfSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cInNpZGUtYmFyX190b3BcIiBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNpZGUtYmFyX190aXRsZVwiPnt0aXRsZX08L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1dHRvbiBidXR0b24tbGlua1wiPlxuICAgICAgPEFycm93TGVmdCAvPkNvbGxhcHNlXG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuKTtcblxuU2lkZUJhci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5TaWRlQmFyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==