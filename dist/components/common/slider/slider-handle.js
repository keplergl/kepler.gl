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

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  position: absolute;\n  z-index: 10;\n  display: ', ';\n  margin-top: -4px;\n  height: ', ';\n  width: ', ';\n  box-shadow: ', ';\n  background-color: ', ';\n  border-width: 1px;\n  border-style: solid;\n  border-color: ', ';\n\n  :hover {\n    background-color: ', ';\n    cursor: pointer;\n  }\n'], ['\n  position: absolute;\n  z-index: 10;\n  display: ', ';\n  margin-top: -4px;\n  height: ', ';\n  width: ', ';\n  box-shadow: ', ';\n  background-color: ', ';\n  border-width: 1px;\n  border-style: solid;\n  border-color: ', ';\n\n  :hover {\n    background-color: ', ';\n    cursor: pointer;\n  }\n']);

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
  return props.theme.sliderHandleHeight;
}, function (props) {
  return props.theme.sliderHandleWidth;
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
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, SliderHandle);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.prevX = 0, _this.state = { mouseOver: false }, _this.handleMouseDown = function () {
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

  SliderHandle.prototype.render = function render() {
    return _react2.default.createElement(StyledSliderHandle, {
      className: (0, _classnames2.default)('range-slider__handle', {
        'range-slider__handle--active': this.state.mouseOver
      }),
      active: this.state.mouseOver,
      hidden: !this.props.display,
      style: { left: this.props.left },
      onMouseDown: this.handleMouseDown,
      onTouchStart: this.handleTouchStart
    });
  };

  return SliderHandle;
}(_react2.default.Component);

SliderHandle.defaultProps = defaultProps;
SliderHandle.propTypes = propTypes;

exports.default = SliderHandle;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zbGlkZXIvc2xpZGVyLWhhbmRsZS5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJ3aWR0aCIsIm51bWJlciIsImhlaWdodCIsImxlZnQiLCJzdHJpbmciLCJkaXNwbGF5IiwiYm9vbCIsInZhbHVlTGlzdGVuZXIiLCJmdW5jIiwiZGVmYXVsdFByb3BzIiwidmFsdWVMaXN0ZW5lckZuIiwiU3R5bGVkU2xpZGVySGFuZGxlIiwic3BhbiIsInByb3BzIiwiaGlkZGVuIiwidGhlbWUiLCJzbGlkZXJIYW5kbGVIZWlnaHQiLCJzbGlkZXJIYW5kbGVXaWR0aCIsInNsaWRlckhhbmRsZVNoYWRvdyIsInNsaWRlckhhbmRsZUNvbG9yIiwiYWN0aXZlIiwic2VsZWN0Qm9yZGVyQ29sb3IiLCJzbGlkZXJIYW5kbGVIb3ZlckNvbG9yIiwiU2xpZGVySGFuZGxlIiwicHJldlgiLCJzdGF0ZSIsIm1vdXNlT3ZlciIsImhhbmRsZU1vdXNlRG93biIsImFkZEV2ZW50TGlzdGVuZXIiLCJtb3VzZXVwIiwibW91c2Vtb3ZlIiwic2V0U3RhdGUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZSIsInByZXZlbnREZWZhdWx0IiwibW92ZW1lbnRYIiwiaGFuZGxlVG91Y2hTdGFydCIsInRvdWNoZW5kIiwidG91Y2htb3ZlIiwidG91Y2hlcyIsImNsaWVudFgiLCJkZWx0YVgiLCJyZW5kZXIiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFNBQU8sb0JBQVVDLE1BREQ7QUFFaEJDLFVBQVEsb0JBQVVELE1BRkY7QUFHaEJFLFFBQU0sb0JBQVVDLE1BSEE7QUFJaEJDLFdBQVMsb0JBQVVDLElBSkg7QUFLaEJDLGlCQUFlLG9CQUFVQztBQUxULENBQWxCOztBQVFBLElB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O0FBTUUsYUFBTyxFQUFDRixNQUFNLEtBQUtVLEtBQUwsQ0FBV1YsSUFBbEIsRUFOVDtBQU9FLG1CQUFhLEtBQUt3QixlQVBwQjtBQVFFLG9CQUFjLEtBQUtTO0FBUnJCLE1BREY7QUFZRCxHOzs7RUFyRHdCLGdCQUFNTyxTOztBQXdEakNwQixhQUFhZCxZQUFiLEdBQTRCQSxZQUE1QjtBQUNBYyxhQUFheEIsU0FBYixHQUF5QkEsU0FBekI7O2tCQUVld0IsWSIsImZpbGUiOiJzbGlkZXItaGFuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gIGhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgbGVmdDogUHJvcFR5cGVzLnN0cmluZyxcbiAgZGlzcGxheTogUHJvcFR5cGVzLmJvb2wsXG4gIHZhbHVlTGlzdGVuZXI6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGxlZnQ6ICc1MCUnLFxuICBkaXNwbGF5OiB0cnVlLFxuICB2YWx1ZUxpc3RlbmVyOiBmdW5jdGlvbiB2YWx1ZUxpc3RlbmVyRm4oKSB7fVxufTtcblxuY29uc3QgU3R5bGVkU2xpZGVySGFuZGxlID0gc3R5bGVkLnNwYW5gXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogMTA7XG4gIGRpc3BsYXk6ICR7cHJvcHMgPT4gKHByb3BzLmhpZGRlbiA/ICdub25lJyA6ICdibG9jaycpfTtcbiAgbWFyZ2luLXRvcDogLTRweDtcbiAgaGVpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNsaWRlckhhbmRsZUhlaWdodH07XG4gIHdpZHRoOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNsaWRlckhhbmRsZVdpZHRofTtcbiAgYm94LXNoYWRvdzogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zbGlkZXJIYW5kbGVTaGFkb3d9O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNsaWRlckhhbmRsZUNvbG9yfTtcbiAgYm9yZGVyLXdpZHRoOiAxcHg7XG4gIGJvcmRlci1zdHlsZTogc29saWQ7XG4gIGJvcmRlci1jb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLmFjdGl2ZVxuICAgICAgPyBwcm9wcy50aGVtZS5zZWxlY3RCb3JkZXJDb2xvclxuICAgICAgOiBwcm9wcy50aGVtZS5zbGlkZXJIYW5kbGVDb2xvcn07XG5cbiAgOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNsaWRlckhhbmRsZUhvdmVyQ29sb3J9O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxuYDtcblxuLyoqXG4gKlxuICogcHJvcHM6XG4gKiAgd2lkdGggOiBkZWZhdWx0IDIzXG4gKiAgaGVpZ2h0IDogZGVmYXVsdCAyM1xuICogIGRpc3BsYXlcbiAqICBsZWZ0XG4gKiAgb25Nb3ZlXG4gKiAgdmFsdWVMaXN0ZW5lclxuICovXG5jbGFzcyBTbGlkZXJIYW5kbGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBwcmV2WCA9IDA7XG4gIHN0YXRlID0ge21vdXNlT3ZlcjogZmFsc2V9O1xuXG4gIGhhbmRsZU1vdXNlRG93biA9ICgpID0+IHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5tb3VzZXVwKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlbW92ZSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7bW91c2VPdmVyOiB0cnVlfSk7XG4gIH07XG5cbiAgbW91c2V1cCA9ICgpID0+IHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5tb3VzZXVwKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlbW92ZSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7bW91c2VPdmVyOiBmYWxzZX0pO1xuICB9O1xuXG4gIG1vdXNlbW92ZSA9IGUgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnByb3BzLnZhbHVlTGlzdGVuZXIoZS5tb3ZlbWVudFgpO1xuICB9O1xuXG4gIGhhbmRsZVRvdWNoU3RhcnQgPSBlID0+IHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMudG91Y2hlbmQpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMudG91Y2htb3ZlKTtcbiAgICB0aGlzLnByZXZYID0gZS50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgdGhpcy5zZXRTdGF0ZSh7bW91c2VPdmVyOiB0cnVlfSk7XG4gIH07XG5cbiAgdG91Y2htb3ZlID0gZSA9PiB7XG4gICAgY29uc3QgZGVsdGFYID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLnByZXZYO1xuICAgIHRoaXMucHJldlggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICB0aGlzLnByb3BzLnZhbHVlTGlzdGVuZXIoZGVsdGFYKTtcbiAgfTtcblxuICB0b3VjaGVuZCA9ICgpID0+IHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMudG91Y2hlbmQpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMudG91Y2htb3ZlKTtcbiAgICB0aGlzLnNldFN0YXRlKHttb3VzZU92ZXI6IGZhbHNlfSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkU2xpZGVySGFuZGxlXG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncmFuZ2Utc2xpZGVyX19oYW5kbGUnLCB7XG4gICAgICAgICAgJ3JhbmdlLXNsaWRlcl9faGFuZGxlLS1hY3RpdmUnOiB0aGlzLnN0YXRlLm1vdXNlT3ZlclxuICAgICAgICB9KX1cbiAgICAgICAgYWN0aXZlPXt0aGlzLnN0YXRlLm1vdXNlT3Zlcn1cbiAgICAgICAgaGlkZGVuPXshdGhpcy5wcm9wcy5kaXNwbGF5fVxuICAgICAgICBzdHlsZT17e2xlZnQ6IHRoaXMucHJvcHMubGVmdH19XG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLmhhbmRsZU1vdXNlRG93bn1cbiAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLmhhbmRsZVRvdWNoU3RhcnR9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cblxuU2xpZGVySGFuZGxlLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblNsaWRlckhhbmRsZS5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IFNsaWRlckhhbmRsZTtcbiJdfQ==