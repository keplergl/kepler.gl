'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  position: relative;\n  background-color: ', ';\n  height: ', ';\n  border-radius: ', ';\n\n  :hover {\n    cursor: pointer;\n  }\n'], ['\n  position: relative;\n  background-color: ', ';\n  height: ', ';\n  border-radius: ', ';\n\n  :hover {\n    cursor: pointer;\n  }\n']);

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  width: _propTypes2.default.number,
  left: _propTypes2.default.string,
  sliderBarListener: _propTypes2.default.func,
  enableBarDrag: _propTypes2.default.bool
};

var defaultProps = {
  sliderBarListener: function sliderBarListenerTn() {},
  enableBarDrag: false
};

var StyledSlider = _styledComponents2.default.div(_templateObject, function (props) {
  return props.active ? props.theme.sliderBarHoverColor : props.theme.sliderBarColor;
}, function (props) {
  return props.theme.sliderBarHeight;
}, function (props) {
  return props.theme.sliderBarRadius;
});
/**
 *
 * props:
 *  width : default 23
 *  height : default 23
 *  left
 *  onMove
 *  sliderBarListener
 */

var SliderHandle = function (_React$Component) {
  (0, _inherits3.default)(SliderHandle, _React$Component);

  function SliderHandle() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, SliderHandle);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = SliderHandle.__proto__ || Object.getPrototypeOf(SliderHandle)).call.apply(_ref, [this].concat(args))), _this), _this.state = { mouseOver: false }, _this.prevX = 0, _this.handleMouseDown = function () {
      _document2.default.addEventListener('mouseup', _this.mouseup);
      _document2.default.addEventListener('mousemove', _this.mousemove);
      _this.setState({ mouseOver: true });
    }, _this.mouseup = function () {
      _document2.default.removeEventListener('mouseup', _this.mouseup);
      _document2.default.removeEventListener('mousemove', _this.mousemove);
      _this.setState({ mouseOver: false });
    }, _this.mousemove = function (e) {
      e.preventDefault();
      _this.props.sliderBarListener(e.movementX);
    }, _this.handleTouchStart = function (e) {
      _document2.default.addEventListener('touchend', _this.touchend);
      _document2.default.addEventListener('touchmove', _this.touchmove);
      _this.prevX = e.touches[0].clientX;
      _this.setState({ mouseOver: true });
    }, _this.touchmove = function (e) {
      var deltaX = e.touches[0].clientX - _this.prevX;
      _this.prevX = e.touches[0].clientX;
      _this.props.sliderBarListener(deltaX);
    }, _this.touchend = function () {
      _document2.default.removeEventListener('touchend', _this.touchend);
      _document2.default.removeEventListener('touchmove', _this.touchmove);
      _this.setState({ mouseOver: false });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(SliderHandle, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(StyledSlider, {
        active: this.state.mouseOver,
        className: (0, _classnames2.default)('range-slider__bar', {
          'range-slider__bar--active': this.state.mouseOver
        }),
        style: {
          width: this.props.width + '%',
          left: this.props.v0Left + '%'
        },
        onMouseDown: this.props.enableBarDrag && this.handleMouseDown,
        onTouchStart: this.props.enableBarDrag && this.handleTouchStart
      });
    }
  }]);
  return SliderHandle;
}(_react2.default.Component);

SliderHandle.propTypes = propTypes;
SliderHandle.defaultProps = defaultProps;

exports.default = SliderHandle;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zbGlkZXIvc2xpZGVyLWJhci1oYW5kbGUuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwid2lkdGgiLCJudW1iZXIiLCJsZWZ0Iiwic3RyaW5nIiwic2xpZGVyQmFyTGlzdGVuZXIiLCJmdW5jIiwiZW5hYmxlQmFyRHJhZyIsImJvb2wiLCJkZWZhdWx0UHJvcHMiLCJzbGlkZXJCYXJMaXN0ZW5lclRuIiwiU3R5bGVkU2xpZGVyIiwiZGl2IiwicHJvcHMiLCJhY3RpdmUiLCJ0aGVtZSIsInNsaWRlckJhckhvdmVyQ29sb3IiLCJzbGlkZXJCYXJDb2xvciIsInNsaWRlckJhckhlaWdodCIsInNsaWRlckJhclJhZGl1cyIsIlNsaWRlckhhbmRsZSIsInN0YXRlIiwibW91c2VPdmVyIiwicHJldlgiLCJoYW5kbGVNb3VzZURvd24iLCJhZGRFdmVudExpc3RlbmVyIiwibW91c2V1cCIsIm1vdXNlbW92ZSIsInNldFN0YXRlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIm1vdmVtZW50WCIsImhhbmRsZVRvdWNoU3RhcnQiLCJ0b3VjaGVuZCIsInRvdWNobW92ZSIsInRvdWNoZXMiLCJjbGllbnRYIiwiZGVsdGFYIiwidjBMZWZ0IiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsWUFBWTtBQUNoQkMsU0FBTyxvQkFBVUMsTUFERDtBQUVoQkMsUUFBTSxvQkFBVUMsTUFGQTtBQUdoQkMscUJBQW1CLG9CQUFVQyxJQUhiO0FBSWhCQyxpQkFBZSxvQkFBVUM7QUFKVCxDQUFsQjs7QUFPQSxJQUFNQyxlQUFlO0FBQ25CSixxQkFBbUIsU0FBU0ssbUJBQVQsR0FBK0IsQ0FBRSxDQURqQztBQUVuQkgsaUJBQWU7QUFGSSxDQUFyQjs7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WyJpbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgbGVmdDogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2xpZGVyQmFyTGlzdGVuZXI6IFByb3BUeXBlcy5mdW5jLFxuICBlbmFibGVCYXJEcmFnOiBQcm9wVHlwZXMuYm9vbFxufTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBzbGlkZXJCYXJMaXN0ZW5lcjogZnVuY3Rpb24gc2xpZGVyQmFyTGlzdGVuZXJUbigpIHt9LFxuICBlbmFibGVCYXJEcmFnOiBmYWxzZVxufTtcblxuY29uc3QgU3R5bGVkU2xpZGVyID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+XG4gICAgcHJvcHMuYWN0aXZlXG4gICAgICA/IHByb3BzLnRoZW1lLnNsaWRlckJhckhvdmVyQ29sb3JcbiAgICAgIDogcHJvcHMudGhlbWUuc2xpZGVyQmFyQ29sb3J9O1xuICBoZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2xpZGVyQmFySGVpZ2h0fTtcbiAgYm9yZGVyLXJhZGl1czogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zbGlkZXJCYXJSYWRpdXN9O1xuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG5gO1xuLyoqXG4gKlxuICogcHJvcHM6XG4gKiAgd2lkdGggOiBkZWZhdWx0IDIzXG4gKiAgaGVpZ2h0IDogZGVmYXVsdCAyM1xuICogIGxlZnRcbiAqICBvbk1vdmVcbiAqICBzbGlkZXJCYXJMaXN0ZW5lclxuICovXG5jbGFzcyBTbGlkZXJIYW5kbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0ZSA9IHttb3VzZU92ZXI6IGZhbHNlfTtcbiAgcHJldlggPSAwO1xuXG4gIGhhbmRsZU1vdXNlRG93biA9ICgpID0+IHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5tb3VzZXVwKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlbW92ZSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7bW91c2VPdmVyOiB0cnVlfSk7XG4gIH07XG5cbiAgbW91c2V1cCA9ICgpID0+IHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5tb3VzZXVwKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlbW92ZSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7bW91c2VPdmVyOiBmYWxzZX0pO1xuICB9O1xuXG4gIG1vdXNlbW92ZSA9IGUgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnByb3BzLnNsaWRlckJhckxpc3RlbmVyKGUubW92ZW1lbnRYKTtcbiAgfTtcblxuICBoYW5kbGVUb3VjaFN0YXJ0ID0gZSA9PiB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLnRvdWNoZW5kKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnRvdWNobW92ZSk7XG4gICAgdGhpcy5wcmV2WCA9IGUudG91Y2hlc1swXS5jbGllbnRYO1xuICAgIHRoaXMuc2V0U3RhdGUoe21vdXNlT3ZlcjogdHJ1ZX0pO1xuICB9O1xuXG4gIHRvdWNobW92ZSA9IGUgPT4ge1xuICAgIGNvbnN0IGRlbHRhWCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5wcmV2WDtcbiAgICB0aGlzLnByZXZYID0gZS50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgdGhpcy5wcm9wcy5zbGlkZXJCYXJMaXN0ZW5lcihkZWx0YVgpO1xuICB9O1xuXG4gIHRvdWNoZW5kID0gKCkgPT4ge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy50b3VjaGVuZCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy50b3VjaG1vdmUpO1xuICAgIHRoaXMuc2V0U3RhdGUoe21vdXNlT3ZlcjogZmFsc2V9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRTbGlkZXJcbiAgICAgICAgYWN0aXZlPXt0aGlzLnN0YXRlLm1vdXNlT3Zlcn1cbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdyYW5nZS1zbGlkZXJfX2JhcicsIHtcbiAgICAgICAgICAncmFuZ2Utc2xpZGVyX19iYXItLWFjdGl2ZSc6IHRoaXMuc3RhdGUubW91c2VPdmVyXG4gICAgICAgIH0pfVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiBgJHt0aGlzLnByb3BzLndpZHRofSVgLFxuICAgICAgICAgIGxlZnQ6IGAke3RoaXMucHJvcHMudjBMZWZ0fSVgXG4gICAgICAgIH19XG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnByb3BzLmVuYWJsZUJhckRyYWcgJiYgdGhpcy5oYW5kbGVNb3VzZURvd259XG4gICAgICAgIG9uVG91Y2hTdGFydD17dGhpcy5wcm9wcy5lbmFibGVCYXJEcmFnICYmIHRoaXMuaGFuZGxlVG91Y2hTdGFydH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuXG5TbGlkZXJIYW5kbGUucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuU2xpZGVySGFuZGxlLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuZXhwb3J0IGRlZmF1bHQgU2xpZGVySGFuZGxlO1xuIl19