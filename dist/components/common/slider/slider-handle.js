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

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  position: absolute;\n  z-index: 10;\n  display: ', ';\n  margin-top: -4px;\n  height: ', ';\n  width: ', ';\n  box-shadow: ', ';\n  background-color: ', ';\n  border-width: 1px;\n  border-style: solid;\n  border-color: ', ';\n\n  :hover {\n    background-color: ', ';\n    cursor: pointer;\n  }\n'], ['\n  position: absolute;\n  z-index: 10;\n  display: ', ';\n  margin-top: -4px;\n  height: ', ';\n  width: ', ';\n  box-shadow: ', ';\n  background-color: ', ';\n  border-width: 1px;\n  border-style: solid;\n  border-color: ', ';\n\n  :hover {\n    background-color: ', ';\n    cursor: pointer;\n  }\n']);

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
  height: _propTypes2.default.number,
  left: _propTypes2.default.string,
  display: _propTypes2.default.bool,
  valueListener: _propTypes2.default.func
};

var defaultProps = {
  left: '50%',
  display: true,
  valueListener: function valueListenerFn() {}
};

var StyledSliderHandle = _styledComponents2.default.span(_templateObject, function (props) {
  return props.hidden ? 'none' : 'block';
}, function (props) {
  return Number.isFinite(props.sliderHandleWidth) ? props.sliderHandleWidth + 'px' : props.theme.sliderHandleHeight;
}, function (props) {
  return Number.isFinite(props.sliderHandleWidth) ? props.sliderHandleWidth + 'px' : props.theme.sliderHandleHeight;
}, function (props) {
  return props.theme.sliderHandleShadow;
}, function (props) {
  return props.theme.sliderHandleColor;
}, function (props) {
  return props.active ? props.theme.selectBorderColor : props.theme.sliderHandleColor;
}, function (props) {
  return props.theme.sliderHandleHoverColor;
});

/**
 *
 * props:
 *  width : default 23
 *  height : default 23
 *  display
 *  left
 *  onMove
 *  valueListener
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
      _this.props.valueListener(e.movementX);
    }, _this.handleTouchStart = function (e) {
      _document2.default.addEventListener('touchend', _this.touchend);
      _document2.default.addEventListener('touchmove', _this.touchmove);
      _this.prevX = e.touches[0].clientX;
      _this.setState({ mouseOver: true });
    }, _this.touchmove = function (e) {
      var deltaX = e.touches[0].clientX - _this.prevX;
      _this.prevX = e.touches[0].clientX;
      _this.props.valueListener(deltaX);
    }, _this.touchend = function () {
      _document2.default.removeEventListener('touchend', _this.touchend);
      _document2.default.removeEventListener('touchmove', _this.touchmove);
      _this.setState({ mouseOver: false });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(SliderHandle, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(StyledSliderHandle, {
        className: (0, _classnames2.default)('range-slider__handle', {
          'range-slider__handle--active': this.state.mouseOver
        }),
        sliderHandleWidth: this.props.sliderHandleWidth,
        active: this.state.mouseOver,
        hidden: !this.props.display,
        style: { left: this.props.left },
        onMouseDown: this.handleMouseDown,
        onTouchStart: this.handleTouchStart
      });
    }
  }]);
  return SliderHandle;
}(_react2.default.Component);

SliderHandle.defaultProps = defaultProps;
SliderHandle.propTypes = propTypes;

exports.default = SliderHandle;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zbGlkZXIvc2xpZGVyLWhhbmRsZS5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJ3aWR0aCIsIm51bWJlciIsImhlaWdodCIsImxlZnQiLCJzdHJpbmciLCJkaXNwbGF5IiwiYm9vbCIsInZhbHVlTGlzdGVuZXIiLCJmdW5jIiwiZGVmYXVsdFByb3BzIiwidmFsdWVMaXN0ZW5lckZuIiwiU3R5bGVkU2xpZGVySGFuZGxlIiwic3BhbiIsInByb3BzIiwiaGlkZGVuIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJzbGlkZXJIYW5kbGVXaWR0aCIsInRoZW1lIiwic2xpZGVySGFuZGxlSGVpZ2h0Iiwic2xpZGVySGFuZGxlU2hhZG93Iiwic2xpZGVySGFuZGxlQ29sb3IiLCJhY3RpdmUiLCJzZWxlY3RCb3JkZXJDb2xvciIsInNsaWRlckhhbmRsZUhvdmVyQ29sb3IiLCJTbGlkZXJIYW5kbGUiLCJzdGF0ZSIsIm1vdXNlT3ZlciIsInByZXZYIiwiaGFuZGxlTW91c2VEb3duIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm1vdXNldXAiLCJtb3VzZW1vdmUiLCJzZXRTdGF0ZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJlIiwicHJldmVudERlZmF1bHQiLCJtb3ZlbWVudFgiLCJoYW5kbGVUb3VjaFN0YXJ0IiwidG91Y2hlbmQiLCJ0b3VjaG1vdmUiLCJ0b3VjaGVzIiwiY2xpZW50WCIsImRlbHRhWCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFNBQU8sb0JBQVVDLE1BREQ7QUFFaEJDLFVBQVEsb0JBQVVELE1BRkY7QUFHaEJFLFFBQU0sb0JBQVVDLE1BSEE7QUFJaEJDLFdBQVMsb0JBQVVDLElBSkg7QUFLaEJDLGlCQUFlLG9CQUFVQztBQUxU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O0FBQzVDLDBDQUFnQyxLQUFLRCxLQUFMLENBQVdDO0FBREMsU0FBbkMsQ0FEYjtBQUlFLDJCQUFtQixLQUFLZCxLQUFMLENBQVdJLGlCQUpoQztBQUtFLGdCQUFRLEtBQUtTLEtBQUwsQ0FBV0MsU0FMckI7QUFNRSxnQkFBUSxDQUFDLEtBQUtkLEtBQUwsQ0FBV1IsT0FOdEI7QUFPRSxlQUFPLEVBQUNGLE1BQU0sS0FBS1UsS0FBTCxDQUFXVixJQUFsQixFQVBUO0FBUUUscUJBQWEsS0FBSzBCLGVBUnBCO0FBU0Usc0JBQWMsS0FBS1M7QUFUckIsUUFERjtBQWFEOzs7RUF0RHdCLGdCQUFNTSxTOztBQXlEakNuQixhQUFhaEIsWUFBYixHQUE0QkEsWUFBNUI7QUFDQWdCLGFBQWExQixTQUFiLEdBQXlCQSxTQUF6Qjs7a0JBRWUwQixZIiwiZmlsZSI6InNsaWRlci1oYW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLFxuICBsZWZ0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICBkaXNwbGF5OiBQcm9wVHlwZXMuYm9vbCxcbiAgdmFsdWVMaXN0ZW5lcjogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgbGVmdDogJzUwJScsXG4gIGRpc3BsYXk6IHRydWUsXG4gIHZhbHVlTGlzdGVuZXI6IGZ1bmN0aW9uIHZhbHVlTGlzdGVuZXJGbigpIHt9XG59O1xuXG5jb25zdCBTdHlsZWRTbGlkZXJIYW5kbGUgPSBzdHlsZWQuc3BhbmBcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAxMDtcbiAgZGlzcGxheTogJHtwcm9wcyA9PiAocHJvcHMuaGlkZGVuID8gJ25vbmUnIDogJ2Jsb2NrJyl9O1xuICBtYXJnaW4tdG9wOiAtNHB4O1xuICBoZWlnaHQ6ICR7cHJvcHMgPT5cbiAgICBOdW1iZXIuaXNGaW5pdGUocHJvcHMuc2xpZGVySGFuZGxlV2lkdGgpXG4gICAgICA/IGAke3Byb3BzLnNsaWRlckhhbmRsZVdpZHRofXB4YFxuICAgICAgOiBwcm9wcy50aGVtZS5zbGlkZXJIYW5kbGVIZWlnaHR9O1xuICB3aWR0aDogJHtwcm9wcyA9PlxuICAgIE51bWJlci5pc0Zpbml0ZShwcm9wcy5zbGlkZXJIYW5kbGVXaWR0aClcbiAgICAgID8gYCR7cHJvcHMuc2xpZGVySGFuZGxlV2lkdGh9cHhgXG4gICAgICA6IHByb3BzLnRoZW1lLnNsaWRlckhhbmRsZUhlaWdodH07XG4gIGJveC1zaGFkb3c6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2xpZGVySGFuZGxlU2hhZG93fTtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zbGlkZXJIYW5kbGVDb2xvcn07XG4gIGJvcmRlci13aWR0aDogMXB4O1xuICBib3JkZXItc3R5bGU6IHNvbGlkO1xuICBib3JkZXItY29sb3I6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy5hY3RpdmVcbiAgICAgID8gcHJvcHMudGhlbWUuc2VsZWN0Qm9yZGVyQ29sb3JcbiAgICAgIDogcHJvcHMudGhlbWUuc2xpZGVySGFuZGxlQ29sb3J9O1xuXG4gIDpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zbGlkZXJIYW5kbGVIb3ZlckNvbG9yfTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbmA7XG5cbi8qKlxuICpcbiAqIHByb3BzOlxuICogIHdpZHRoIDogZGVmYXVsdCAyM1xuICogIGhlaWdodCA6IGRlZmF1bHQgMjNcbiAqICBkaXNwbGF5XG4gKiAgbGVmdFxuICogIG9uTW92ZVxuICogIHZhbHVlTGlzdGVuZXJcbiAqL1xuY2xhc3MgU2xpZGVySGFuZGxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGUgPSB7bW91c2VPdmVyOiBmYWxzZX07XG4gIHByZXZYID0gMDtcblxuICBoYW5kbGVNb3VzZURvd24gPSAoKSA9PiB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2V1cCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZW1vdmUpO1xuICAgIHRoaXMuc2V0U3RhdGUoe21vdXNlT3ZlcjogdHJ1ZX0pO1xuICB9O1xuXG4gIG1vdXNldXAgPSAoKSA9PiB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2V1cCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZW1vdmUpO1xuICAgIHRoaXMuc2V0U3RhdGUoe21vdXNlT3ZlcjogZmFsc2V9KTtcbiAgfTtcblxuICBtb3VzZW1vdmUgPSBlID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy52YWx1ZUxpc3RlbmVyKGUubW92ZW1lbnRYKTtcbiAgfTtcblxuICBoYW5kbGVUb3VjaFN0YXJ0ID0gZSA9PiB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLnRvdWNoZW5kKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnRvdWNobW92ZSk7XG4gICAgdGhpcy5wcmV2WCA9IGUudG91Y2hlc1swXS5jbGllbnRYO1xuICAgIHRoaXMuc2V0U3RhdGUoe21vdXNlT3ZlcjogdHJ1ZX0pO1xuICB9O1xuXG4gIHRvdWNobW92ZSA9IGUgPT4ge1xuICAgIGNvbnN0IGRlbHRhWCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5wcmV2WDtcbiAgICB0aGlzLnByZXZYID0gZS50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgdGhpcy5wcm9wcy52YWx1ZUxpc3RlbmVyKGRlbHRhWCk7XG4gIH07XG5cbiAgdG91Y2hlbmQgPSAoKSA9PiB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLnRvdWNoZW5kKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnRvdWNobW92ZSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7bW91c2VPdmVyOiBmYWxzZX0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZFNsaWRlckhhbmRsZVxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3JhbmdlLXNsaWRlcl9faGFuZGxlJywge1xuICAgICAgICAgICdyYW5nZS1zbGlkZXJfX2hhbmRsZS0tYWN0aXZlJzogdGhpcy5zdGF0ZS5tb3VzZU92ZXJcbiAgICAgICAgfSl9XG4gICAgICAgIHNsaWRlckhhbmRsZVdpZHRoPXt0aGlzLnByb3BzLnNsaWRlckhhbmRsZVdpZHRofVxuICAgICAgICBhY3RpdmU9e3RoaXMuc3RhdGUubW91c2VPdmVyfVxuICAgICAgICBoaWRkZW49eyF0aGlzLnByb3BzLmRpc3BsYXl9XG4gICAgICAgIHN0eWxlPXt7bGVmdDogdGhpcy5wcm9wcy5sZWZ0fX1cbiAgICAgICAgb25Nb3VzZURvd249e3RoaXMuaGFuZGxlTW91c2VEb3dufVxuICAgICAgICBvblRvdWNoU3RhcnQ9e3RoaXMuaGFuZGxlVG91Y2hTdGFydH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuXG5TbGlkZXJIYW5kbGUuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuU2xpZGVySGFuZGxlLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuZXhwb3J0IGRlZmF1bHQgU2xpZGVySGFuZGxlO1xuIl19