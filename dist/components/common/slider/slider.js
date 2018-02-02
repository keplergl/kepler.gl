'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  position: relative;\n  margin-bottom: 12px;\n  background-color: ', ';\n  height: ', ';\n'], ['\n  position: relative;\n  margin-bottom: 12px;\n  background-color: ', ';\n  height: ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  ', ';\n'], ['\n  ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  flex-grow: 1;\n  margin-top: ', 'px;\n'], ['\n  flex-grow: 1;\n  margin-top: ', 'px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _sliderHandle = require('./slider-handle');

var _sliderHandle2 = _interopRequireDefault(_sliderHandle);

var _sliderBarHandle = require('./slider-bar-handle');

var _sliderBarHandle2 = _interopRequireDefault(_sliderBarHandle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function noop() {}

var propTypes = {
  title: _propTypes2.default.string,
  isRanged: _propTypes2.default.bool,
  value0: _propTypes2.default.number,
  value1: _propTypes2.default.number,
  minValue: _propTypes2.default.number,
  maxValue: _propTypes2.default.number,
  showValues: _propTypes2.default.bool,
  onSlider0Change: _propTypes2.default.func,
  onInput0Change: _propTypes2.default.func,
  onSlider1Change: _propTypes2.default.func,
  onInput1Change: _propTypes2.default.func,
  onSliderBarChange: _propTypes2.default.func,
  step: _propTypes2.default.number,
  enableBarDrag: _propTypes2.default.bool
};

var defaultProps = {
  title: '',
  isRanged: true,
  value0: 0,
  value1: 100,
  minValue: 0,
  maxValue: 100,
  showValues: true,
  step: 1,
  enableBarDrag: false,
  onSlider0Change: noop,
  onInput0Change: noop,
  onSlider1Change: noop,
  onInput1Change: noop,
  onSliderBarChange: noop,
  disabled: false
};

var StyledRangeSlider = _styledComponents2.default.div(_templateObject, function (props) {
  return props.theme.sliderBarBgd;
}, function (props) {
  return props.theme.sliderBarHeight;
});

var SliderInput = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.theme.input;
});

var SliderWrapper = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.isRanged ? 0 : 10;
});

var Slider = function (_React$Component) {
  (0, _inherits3.default)(Slider, _React$Component);

  function Slider() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Slider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this._saveRef = function (ref) {
      _this.ref = ref;
    }, _this.handleWidth = 12, _this.ref = undefined, _this.slide0Listener = function (x) {
      var xPercent = x / _this.ref.offsetWidth;
      var maxDelta = _this.props.maxValue - _this.props.minValue;
      var val = xPercent * maxDelta;
      _this.props.onSlider0Change.call(_this, val + _this.props.value0);
    }, _this.slide1Listener = function (x) {
      var xPercent = x / _this.ref.offsetWidth;
      var maxDelta = _this.props.maxValue - _this.props.minValue;
      var val = xPercent * maxDelta;
      _this.props.onSlider1Change(val + _this.props.value1);
    }, _this.sliderBarListener = function (x) {
      var xPercent = x / _this.ref.offsetWidth;
      var maxDelta = _this.props.maxValue - _this.props.minValue;
      var val = xPercent * maxDelta;
      var val0 = val + _this.props.value0;
      var val1 = val + _this.props.value1;
      _this.props.onSliderBarChange(val0, val1);
    }, _this.input0Listener = function (e) {
      _this.props.onInput0Change(Number(e.target.value), true);
    }, _this.input1Listener = function (e) {
      _this.props.onInput1Change(Number(e.target.value), true);
    }, _this.calcHandleLeft0 = function (w, l, num) {
      return w === 0 ? 'calc(l% - ' + _this.handleWidth / 2 + ' px)' : l + '%';
    }, _this.calcHandleLeft1 = function (w, l) {
      return _this.props.isRanged && w === 0 ? 'calc(l% - ' + _this.handleWidth + 'px)' : 'calc(' + (l + w) + '% - ' + _this.handleWidth + 'px)';
    }, _this.onBlur0 = function () {
      _this.props.onInput0Change(_this.props.value0, false);
    }, _this.onBlur1 = function () {
      _this.props.onInput1Change(_this.props.value1, false);
    }, _this.createSlider = function (width, length) {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          StyledRangeSlider,
          { className: 'range-slider' },
          _react2.default.createElement(_sliderHandle2.default, {
            className: 'range-slider__handle',
            left: _this.calcHandleLeft0(width, length),
            valueListener: _this.slide0Listener,
            display: _this.props.isRanged
          }),
          _react2.default.createElement(_sliderHandle2.default, {
            className: 'range-slider__handle',
            left: _this.calcHandleLeft1(width, length),
            valueListener: _this.slide1Listener
          }),
          _react2.default.createElement(_sliderBarHandle2.default, {
            width: width,
            length: length,
            enableBarDrag: _this.props.enableBarDrag,
            sliderBarListener: _this.sliderBarListener
          })
        )
      );
    }, _this.createInput0 = function () {
      return _react2.default.createElement(
        'span',
        {
          className: (0, _classnames2.default)({
            'position--relative': true,
            hidden: !_this.props.showValues || !_this.props.isRanged
          })
        },
        _react2.default.createElement('input', {
          className: 'range-slider__input hard text-input borderless one-quarter float--left bg-transparent',
          step: _this.props.step,
          type: 'number',
          value: _this.props.value0,
          onChange: _this.input0Listener,
          onBlur: _this.onBlur0,
          disabled: _this.props.disabled
        })
      );
    }, _this.createInput1 = function () {
      return _react2.default.createElement(
        'span',
        {
          className: (0, _classnames2.default)({
            hidden: !_this.props.showValues
          })
        },
        _react2.default.createElement(SliderInput, {
          className: 'range-slider__input',
          step: _this.props.step,
          type: 'number',
          value: _this.props.value1,
          onChange: _this.input1Listener,
          onBlur: _this.onBlur1,
          disabled: _this.props.disabled
        })
      );
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  Slider.prototype.componentDidMount = function componentDidMount() {
    this.handleWidth = this.ref.getElementsByClassName('range-slider__handle')[1].offsetWidth;
  };

  Slider.prototype.render = function render() {
    var _props = this.props,
        classSet = _props.classSet,
        isRanged = _props.isRanged,
        maxValue = _props.maxValue,
        minValue = _props.minValue,
        value0 = _props.value0,
        value1 = _props.value1;

    var value = !isRanged && minValue > 0 ? minValue : value0;
    var currValDelta = value1 - value;
    var maxDelta = maxValue - minValue;
    var width = currValDelta / maxDelta * 100;

    var length = (value - minValue) / maxDelta * 100;
    return _react2.default.createElement(
      SliderWrapper,
      {
        className: (0, _classnames2.default)((0, _extends3.default)({}, classSet, { slider: true })),
        innerRef: this._saveRef,
        isRanged: isRanged
      },
      this.createSlider(width, length)
    );
  };

  return Slider;
}(_react2.default.Component);

Slider.defaultProps = defaultProps;
Slider.propTypes = propTypes;

exports.default = Slider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zbGlkZXIvc2xpZGVyLmpzIl0sIm5hbWVzIjpbIm5vb3AiLCJwcm9wVHlwZXMiLCJ0aXRsZSIsInN0cmluZyIsImlzUmFuZ2VkIiwiYm9vbCIsInZhbHVlMCIsIm51bWJlciIsInZhbHVlMSIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCJzaG93VmFsdWVzIiwib25TbGlkZXIwQ2hhbmdlIiwiZnVuYyIsIm9uSW5wdXQwQ2hhbmdlIiwib25TbGlkZXIxQ2hhbmdlIiwib25JbnB1dDFDaGFuZ2UiLCJvblNsaWRlckJhckNoYW5nZSIsInN0ZXAiLCJlbmFibGVCYXJEcmFnIiwiZGVmYXVsdFByb3BzIiwiZGlzYWJsZWQiLCJTdHlsZWRSYW5nZVNsaWRlciIsImRpdiIsInByb3BzIiwidGhlbWUiLCJzbGlkZXJCYXJCZ2QiLCJzbGlkZXJCYXJIZWlnaHQiLCJTbGlkZXJJbnB1dCIsImlucHV0IiwiU2xpZGVyV3JhcHBlciIsIlNsaWRlciIsIl9zYXZlUmVmIiwicmVmIiwiaGFuZGxlV2lkdGgiLCJ1bmRlZmluZWQiLCJzbGlkZTBMaXN0ZW5lciIsInhQZXJjZW50IiwieCIsIm9mZnNldFdpZHRoIiwibWF4RGVsdGEiLCJ2YWwiLCJjYWxsIiwic2xpZGUxTGlzdGVuZXIiLCJzbGlkZXJCYXJMaXN0ZW5lciIsInZhbDAiLCJ2YWwxIiwiaW5wdXQwTGlzdGVuZXIiLCJOdW1iZXIiLCJlIiwidGFyZ2V0IiwidmFsdWUiLCJpbnB1dDFMaXN0ZW5lciIsImNhbGNIYW5kbGVMZWZ0MCIsInciLCJsIiwibnVtIiwiY2FsY0hhbmRsZUxlZnQxIiwib25CbHVyMCIsIm9uQmx1cjEiLCJjcmVhdGVTbGlkZXIiLCJ3aWR0aCIsImxlbmd0aCIsImNyZWF0ZUlucHV0MCIsImhpZGRlbiIsImNyZWF0ZUlucHV0MSIsImNvbXBvbmVudERpZE1vdW50IiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsInJlbmRlciIsImNsYXNzU2V0IiwiY3VyclZhbERlbHRhIiwic2xpZGVyIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVNBLElBQVQsR0FBZ0IsQ0FBRTs7QUFFbEIsSUFBTUMsWUFBWTtBQUNoQkMsU0FBTyxvQkFBVUMsTUFERDtBQUVoQkMsWUFBVSxvQkFBVUMsSUFGSjtBQUdoQkMsVUFBUSxvQkFBVUMsTUFIRjtBQUloQkMsVUFBUSxvQkFBVUQsTUFKRjtBQUtoQkUsWUFBVSxvQkFBVUYsTUFMSjtBQU1oQkcsWUFBVSxvQkFBVUgsTUFOSjtBQU9oQkksY0FBWSxvQkFBVU4sSUFQTjtBQVFoQk8sbUJBQWlCLG9CQUFVQyxJQVJYO0FBU2hCQyxrQkFBZ0Isb0JBQVVELElBVFY7QUFVaEJFLG1CQUFpQixvQkFBVUYsSUFWWDtBQVdoQkcsa0JBQWdCLG9CQUFVSCxJQVhWO0FBWWhCSSxxQkFBbUIsb0JBQVVKLElBWmI7QUFhaEJLLFFBQU0sb0JBQVVYLE1BYkE7QUFjaEJZLGlCQUFlLG9CQUFVZDtBQWRULENBQWxCOztBQWlCQSxJQUFNZSxlQUFlO0FBQ25CbEIsU0FBTyxFQURZO0FBRW5CRSxZQUFVLElBRlM7QUFHbkJFLFVBQVEsQ0FIVztBQUluQkUsVUFBUSxHQUpXO0FBS25CQyxZQUFVLENBTFM7QUFNbkJDLFlBQVUsR0FOUztBQU9uQkMsY0FBWSxJQVBPO0FBUW5CTyxRQUFNLENBUmE7QUFTbkJDLGlCQUFlLEtBVEk7QUFVbkJQLG1CQUFpQlosSUFWRTtBQVduQmMsa0JBQWdCZCxJQVhHO0FBWW5CZSxtQkFBaUJmLElBWkU7QUFhbkJnQixrQkFBZ0JoQixJQWJHO0FBY25CaUIscUJBQW1CakIsSUFkQTtBQWVuQnFCLFlBQVU7QUFmUyxDQUFyQjs7QUFrQkEsSUFBTUMsb0JBQW9CLDJCQUFPQyxHQUEzQixrQkFHZ0I7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlDLFlBQXJCO0FBQUEsQ0FIaEIsRUFJTTtBQUFBLFNBQVNGLE1BQU1DLEtBQU4sQ0FBWUUsZUFBckI7QUFBQSxDQUpOLENBQU47O0FBT0EsSUFBTUMsY0FBYywyQkFBT0wsR0FBckIsbUJBQ0Y7QUFBQSxTQUFTQyxNQUFNQyxLQUFOLENBQVlJLEtBQXJCO0FBQUEsQ0FERSxDQUFOOztBQUlBLElBQU1DLGdCQUFnQiwyQkFBT1AsR0FBdkIsbUJBRVU7QUFBQSxTQUFTQyxNQUFNcEIsUUFBTixHQUFpQixDQUFqQixHQUFxQixFQUE5QjtBQUFBLENBRlYsQ0FBTjs7SUFLTTJCLE07Ozs7Ozs7Ozs7OztzS0FFSkMsUSxHQUFXLGVBQU87QUFDaEIsWUFBS0MsR0FBTCxHQUFXQSxHQUFYO0FBQ0QsSyxRQVFEQyxXLEdBQWMsRSxRQUNkRCxHLEdBQU1FLFMsUUFFTkMsYyxHQUFpQixhQUFLO0FBQ3BCLFVBQU1DLFdBQVdDLElBQUksTUFBS0wsR0FBTCxDQUFTTSxXQUE5QjtBQUNBLFVBQU1DLFdBQVcsTUFBS2hCLEtBQUwsQ0FBV2QsUUFBWCxHQUFzQixNQUFLYyxLQUFMLENBQVdmLFFBQWxEO0FBQ0EsVUFBTWdDLE1BQU1KLFdBQVdHLFFBQXZCO0FBQ0EsWUFBS2hCLEtBQUwsQ0FBV1osZUFBWCxDQUEyQjhCLElBQTNCLFFBQXNDRCxNQUFNLE1BQUtqQixLQUFMLENBQVdsQixNQUF2RDtBQUNELEssUUFFRHFDLGMsR0FBaUIsYUFBSztBQUNwQixVQUFNTixXQUFXQyxJQUFJLE1BQUtMLEdBQUwsQ0FBU00sV0FBOUI7QUFDQSxVQUFNQyxXQUFXLE1BQUtoQixLQUFMLENBQVdkLFFBQVgsR0FBc0IsTUFBS2MsS0FBTCxDQUFXZixRQUFsRDtBQUNBLFVBQU1nQyxNQUFNSixXQUFXRyxRQUF2QjtBQUNBLFlBQUtoQixLQUFMLENBQVdULGVBQVgsQ0FBMkIwQixNQUFNLE1BQUtqQixLQUFMLENBQVdoQixNQUE1QztBQUNELEssUUFFRG9DLGlCLEdBQW9CLGFBQUs7QUFDdkIsVUFBTVAsV0FBV0MsSUFBSSxNQUFLTCxHQUFMLENBQVNNLFdBQTlCO0FBQ0EsVUFBTUMsV0FBVyxNQUFLaEIsS0FBTCxDQUFXZCxRQUFYLEdBQXNCLE1BQUtjLEtBQUwsQ0FBV2YsUUFBbEQ7QUFDQSxVQUFNZ0MsTUFBTUosV0FBV0csUUFBdkI7QUFDQSxVQUFNSyxPQUFPSixNQUFNLE1BQUtqQixLQUFMLENBQVdsQixNQUE5QjtBQUNBLFVBQU13QyxPQUFPTCxNQUFNLE1BQUtqQixLQUFMLENBQVdoQixNQUE5QjtBQUNBLFlBQUtnQixLQUFMLENBQVdQLGlCQUFYLENBQTZCNEIsSUFBN0IsRUFBbUNDLElBQW5DO0FBQ0QsSyxRQUVEQyxjLEdBQWlCLGFBQUs7QUFDcEIsWUFBS3ZCLEtBQUwsQ0FBV1YsY0FBWCxDQUEwQmtDLE9BQU9DLEVBQUVDLE1BQUYsQ0FBU0MsS0FBaEIsQ0FBMUIsRUFBa0QsSUFBbEQ7QUFDRCxLLFFBRURDLGMsR0FBaUIsYUFBSztBQUNwQixZQUFLNUIsS0FBTCxDQUFXUixjQUFYLENBQTBCZ0MsT0FBT0MsRUFBRUMsTUFBRixDQUFTQyxLQUFoQixDQUExQixFQUFrRCxJQUFsRDtBQUNELEssUUFFREUsZSxHQUFrQixVQUFDQyxDQUFELEVBQUlDLENBQUosRUFBT0MsR0FBUCxFQUFlO0FBQy9CLGFBQU9GLE1BQU0sQ0FBTixrQkFBdUIsTUFBS3BCLFdBQUwsR0FBbUIsQ0FBMUMsWUFBdURxQixDQUF2RCxNQUFQO0FBQ0QsSyxRQUVERSxlLEdBQWtCLFVBQUNILENBQUQsRUFBSUMsQ0FBSixFQUFVO0FBQzFCLGFBQU8sTUFBSy9CLEtBQUwsQ0FBV3BCLFFBQVgsSUFBdUJrRCxNQUFNLENBQTdCLGtCQUNVLE1BQUtwQixXQURmLHNCQUVLcUIsSUFBSUQsQ0FGVCxhQUVpQixNQUFLcEIsV0FGdEIsUUFBUDtBQUdELEssUUFFRHdCLE8sR0FBVSxZQUFNO0FBQ2QsWUFBS2xDLEtBQUwsQ0FBV1YsY0FBWCxDQUEwQixNQUFLVSxLQUFMLENBQVdsQixNQUFyQyxFQUE2QyxLQUE3QztBQUNELEssUUFFRHFELE8sR0FBVSxZQUFNO0FBQ2QsWUFBS25DLEtBQUwsQ0FBV1IsY0FBWCxDQUEwQixNQUFLUSxLQUFMLENBQVdoQixNQUFyQyxFQUE2QyxLQUE3QztBQUNELEssUUFFRG9ELFksR0FBZSxVQUFDQyxLQUFELEVBQVFDLE1BQVIsRUFBbUI7QUFDaEMsYUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFDLDJCQUFEO0FBQUEsWUFBbUIsV0FBVSxjQUE3QjtBQUNFO0FBQ0UsdUJBQVUsc0JBRFo7QUFFRSxrQkFBTSxNQUFLVCxlQUFMLENBQXFCUSxLQUFyQixFQUE0QkMsTUFBNUIsQ0FGUjtBQUdFLDJCQUFlLE1BQUsxQixjQUh0QjtBQUlFLHFCQUFTLE1BQUtaLEtBQUwsQ0FBV3BCO0FBSnRCLFlBREY7QUFPRTtBQUNFLHVCQUFVLHNCQURaO0FBRUUsa0JBQU0sTUFBS3FELGVBQUwsQ0FBcUJJLEtBQXJCLEVBQTRCQyxNQUE1QixDQUZSO0FBR0UsMkJBQWUsTUFBS25CO0FBSHRCLFlBUEY7QUFZRTtBQUNFLG1CQUFPa0IsS0FEVDtBQUVFLG9CQUFRQyxNQUZWO0FBR0UsMkJBQWUsTUFBS3RDLEtBQUwsQ0FBV0wsYUFINUI7QUFJRSwrQkFBbUIsTUFBS3lCO0FBSjFCO0FBWkY7QUFERixPQURGO0FBdUJELEssUUFFRG1CLFksR0FBZSxZQUFNO0FBQ25CLGFBQ0U7QUFBQTtBQUFBO0FBQ0UscUJBQVcsMEJBQVc7QUFDcEIsa0NBQXNCLElBREY7QUFFcEJDLG9CQUFRLENBQUMsTUFBS3hDLEtBQUwsQ0FBV2IsVUFBWixJQUEwQixDQUFDLE1BQUthLEtBQUwsQ0FBV3BCO0FBRjFCLFdBQVg7QUFEYjtBQU1FO0FBQ0UscUJBQVUsdUZBRFo7QUFFRSxnQkFBTSxNQUFLb0IsS0FBTCxDQUFXTixJQUZuQjtBQUdFLGdCQUFNLFFBSFI7QUFJRSxpQkFBTyxNQUFLTSxLQUFMLENBQVdsQixNQUpwQjtBQUtFLG9CQUFVLE1BQUt5QyxjQUxqQjtBQU1FLGtCQUFRLE1BQUtXLE9BTmY7QUFPRSxvQkFBVSxNQUFLbEMsS0FBTCxDQUFXSDtBQVB2QjtBQU5GLE9BREY7QUFrQkQsSyxRQUVENEMsWSxHQUFlLFlBQU07QUFDbkIsYUFDRTtBQUFBO0FBQUE7QUFDRSxxQkFBVywwQkFBVztBQUNwQkQsb0JBQVEsQ0FBQyxNQUFLeEMsS0FBTCxDQUFXYjtBQURBLFdBQVg7QUFEYjtBQUtFLHNDQUFDLFdBQUQ7QUFDRSxxQkFBVSxxQkFEWjtBQUVFLGdCQUFNLE1BQUthLEtBQUwsQ0FBV04sSUFGbkI7QUFHRSxnQkFBTSxRQUhSO0FBSUUsaUJBQU8sTUFBS00sS0FBTCxDQUFXaEIsTUFKcEI7QUFLRSxvQkFBVSxNQUFLNEMsY0FMakI7QUFNRSxrQkFBUSxNQUFLTyxPQU5mO0FBT0Usb0JBQVUsTUFBS25DLEtBQUwsQ0FBV0g7QUFQdkI7QUFMRixPQURGO0FBaUJELEs7OzttQkEzSEQ2QyxpQixnQ0FBb0I7QUFDbEIsU0FBS2hDLFdBQUwsR0FBbUIsS0FBS0QsR0FBTCxDQUFTa0Msc0JBQVQsQ0FDakIsc0JBRGlCLEVBRWpCLENBRmlCLEVBRWQ1QixXQUZMO0FBR0QsRzs7bUJBeUhENkIsTSxxQkFBUztBQUFBLGlCQVFILEtBQUs1QyxLQVJGO0FBQUEsUUFFTDZDLFFBRkssVUFFTEEsUUFGSztBQUFBLFFBR0xqRSxRQUhLLFVBR0xBLFFBSEs7QUFBQSxRQUlMTSxRQUpLLFVBSUxBLFFBSks7QUFBQSxRQUtMRCxRQUxLLFVBS0xBLFFBTEs7QUFBQSxRQU1MSCxNQU5LLFVBTUxBLE1BTks7QUFBQSxRQU9MRSxNQVBLLFVBT0xBLE1BUEs7O0FBU1AsUUFBTTJDLFFBQVEsQ0FBQy9DLFFBQUQsSUFBYUssV0FBVyxDQUF4QixHQUE0QkEsUUFBNUIsR0FBdUNILE1BQXJEO0FBQ0EsUUFBTWdFLGVBQWU5RCxTQUFTMkMsS0FBOUI7QUFDQSxRQUFNWCxXQUFXOUIsV0FBV0QsUUFBNUI7QUFDQSxRQUFNb0QsUUFBUVMsZUFBZTlCLFFBQWYsR0FBMEIsR0FBeEM7O0FBRUEsUUFBTXNCLFNBQVMsQ0FBQ1gsUUFBUTFDLFFBQVQsSUFBcUIrQixRQUFyQixHQUFnQyxHQUEvQztBQUNBLFdBQ0U7QUFBQyxtQkFBRDtBQUFBO0FBQ0UsbUJBQVcscURBQWU2QixRQUFmLElBQXlCRSxRQUFRLElBQWpDLElBRGI7QUFFRSxrQkFBVSxLQUFLdkMsUUFGakI7QUFHRSxrQkFBVTVCO0FBSFo7QUFLRyxXQUFLd0QsWUFBTCxDQUFrQkMsS0FBbEIsRUFBeUJDLE1BQXpCO0FBTEgsS0FERjtBQVdELEc7OztFQTdKa0IsZ0JBQU1VLFM7O0FBZ0szQnpDLE9BQU9YLFlBQVAsR0FBc0JBLFlBQXRCO0FBQ0FXLE9BQU85QixTQUFQLEdBQW1CQSxTQUFuQjs7a0JBRWU4QixNIiwiZmlsZSI6InNsaWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IFNsaWRlckhhbmRsZSBmcm9tICcuL3NsaWRlci1oYW5kbGUnO1xuaW1wb3J0IFNsaWRlckJhckhhbmRsZSBmcm9tICcuL3NsaWRlci1iYXItaGFuZGxlJztcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGlzUmFuZ2VkOiBQcm9wVHlwZXMuYm9vbCxcbiAgdmFsdWUwOiBQcm9wVHlwZXMubnVtYmVyLFxuICB2YWx1ZTE6IFByb3BUeXBlcy5udW1iZXIsXG4gIG1pblZhbHVlOiBQcm9wVHlwZXMubnVtYmVyLFxuICBtYXhWYWx1ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgc2hvd1ZhbHVlczogUHJvcFR5cGVzLmJvb2wsXG4gIG9uU2xpZGVyMENoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uSW5wdXQwQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25TbGlkZXIxQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25JbnB1dDFDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblNsaWRlckJhckNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIHN0ZXA6IFByb3BUeXBlcy5udW1iZXIsXG4gIGVuYWJsZUJhckRyYWc6IFByb3BUeXBlcy5ib29sXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIHRpdGxlOiAnJyxcbiAgaXNSYW5nZWQ6IHRydWUsXG4gIHZhbHVlMDogMCxcbiAgdmFsdWUxOiAxMDAsXG4gIG1pblZhbHVlOiAwLFxuICBtYXhWYWx1ZTogMTAwLFxuICBzaG93VmFsdWVzOiB0cnVlLFxuICBzdGVwOiAxLFxuICBlbmFibGVCYXJEcmFnOiBmYWxzZSxcbiAgb25TbGlkZXIwQ2hhbmdlOiBub29wLFxuICBvbklucHV0MENoYW5nZTogbm9vcCxcbiAgb25TbGlkZXIxQ2hhbmdlOiBub29wLFxuICBvbklucHV0MUNoYW5nZTogbm9vcCxcbiAgb25TbGlkZXJCYXJDaGFuZ2U6IG5vb3AsXG4gIGRpc2FibGVkOiBmYWxzZVxufTtcblxuY29uc3QgU3R5bGVkUmFuZ2VTbGlkZXIgPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIG1hcmdpbi1ib3R0b206IDEycHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2xpZGVyQmFyQmdkfTtcbiAgaGVpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNsaWRlckJhckhlaWdodH07XG5gO1xuXG5jb25zdCBTbGlkZXJJbnB1dCA9IHN0eWxlZC5kaXZgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXR9O1xuYDtcblxuY29uc3QgU2xpZGVyV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGZsZXgtZ3JvdzogMTtcbiAgbWFyZ2luLXRvcDogJHtwcm9wcyA9PiBwcm9wcy5pc1JhbmdlZCA/IDAgOiAxMH1weDtcbmA7XG5cbmNsYXNzIFNsaWRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgX3NhdmVSZWYgPSByZWYgPT4ge1xuICAgIHRoaXMucmVmID0gcmVmO1xuICB9O1xuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuaGFuZGxlV2lkdGggPSB0aGlzLnJlZi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxuICAgICAgJ3JhbmdlLXNsaWRlcl9faGFuZGxlJ1xuICAgIClbMV0ub2Zmc2V0V2lkdGg7XG4gIH1cblxuICBoYW5kbGVXaWR0aCA9IDEyO1xuICByZWYgPSB1bmRlZmluZWQ7XG5cbiAgc2xpZGUwTGlzdGVuZXIgPSB4ID0+IHtcbiAgICBjb25zdCB4UGVyY2VudCA9IHggLyB0aGlzLnJlZi5vZmZzZXRXaWR0aDtcbiAgICBjb25zdCBtYXhEZWx0YSA9IHRoaXMucHJvcHMubWF4VmFsdWUgLSB0aGlzLnByb3BzLm1pblZhbHVlO1xuICAgIGNvbnN0IHZhbCA9IHhQZXJjZW50ICogbWF4RGVsdGE7XG4gICAgdGhpcy5wcm9wcy5vblNsaWRlcjBDaGFuZ2UuY2FsbCh0aGlzLCB2YWwgKyB0aGlzLnByb3BzLnZhbHVlMCk7XG4gIH07XG5cbiAgc2xpZGUxTGlzdGVuZXIgPSB4ID0+IHtcbiAgICBjb25zdCB4UGVyY2VudCA9IHggLyB0aGlzLnJlZi5vZmZzZXRXaWR0aDtcbiAgICBjb25zdCBtYXhEZWx0YSA9IHRoaXMucHJvcHMubWF4VmFsdWUgLSB0aGlzLnByb3BzLm1pblZhbHVlO1xuICAgIGNvbnN0IHZhbCA9IHhQZXJjZW50ICogbWF4RGVsdGE7XG4gICAgdGhpcy5wcm9wcy5vblNsaWRlcjFDaGFuZ2UodmFsICsgdGhpcy5wcm9wcy52YWx1ZTEpO1xuICB9O1xuXG4gIHNsaWRlckJhckxpc3RlbmVyID0geCA9PiB7XG4gICAgY29uc3QgeFBlcmNlbnQgPSB4IC8gdGhpcy5yZWYub2Zmc2V0V2lkdGg7XG4gICAgY29uc3QgbWF4RGVsdGEgPSB0aGlzLnByb3BzLm1heFZhbHVlIC0gdGhpcy5wcm9wcy5taW5WYWx1ZTtcbiAgICBjb25zdCB2YWwgPSB4UGVyY2VudCAqIG1heERlbHRhO1xuICAgIGNvbnN0IHZhbDAgPSB2YWwgKyB0aGlzLnByb3BzLnZhbHVlMDtcbiAgICBjb25zdCB2YWwxID0gdmFsICsgdGhpcy5wcm9wcy52YWx1ZTE7XG4gICAgdGhpcy5wcm9wcy5vblNsaWRlckJhckNoYW5nZSh2YWwwLCB2YWwxKTtcbiAgfTtcblxuICBpbnB1dDBMaXN0ZW5lciA9IGUgPT4ge1xuICAgIHRoaXMucHJvcHMub25JbnB1dDBDaGFuZ2UoTnVtYmVyKGUudGFyZ2V0LnZhbHVlKSwgdHJ1ZSk7XG4gIH07XG5cbiAgaW5wdXQxTGlzdGVuZXIgPSBlID0+IHtcbiAgICB0aGlzLnByb3BzLm9uSW5wdXQxQ2hhbmdlKE51bWJlcihlLnRhcmdldC52YWx1ZSksIHRydWUpO1xuICB9O1xuXG4gIGNhbGNIYW5kbGVMZWZ0MCA9ICh3LCBsLCBudW0pID0+IHtcbiAgICByZXR1cm4gdyA9PT0gMCA/IGBjYWxjKGwlIC0gJHt0aGlzLmhhbmRsZVdpZHRoIC8gMn0gcHgpYCA6IGAke2x9JWA7XG4gIH07XG5cbiAgY2FsY0hhbmRsZUxlZnQxID0gKHcsIGwpID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5pc1JhbmdlZCAmJiB3ID09PSAwXG4gICAgICA/IGBjYWxjKGwlIC0gJHt0aGlzLmhhbmRsZVdpZHRofXB4KWBcbiAgICAgIDogYGNhbGMoJHtsICsgd30lIC0gJHt0aGlzLmhhbmRsZVdpZHRofXB4KWA7XG4gIH07XG5cbiAgb25CbHVyMCA9ICgpID0+IHtcbiAgICB0aGlzLnByb3BzLm9uSW5wdXQwQ2hhbmdlKHRoaXMucHJvcHMudmFsdWUwLCBmYWxzZSk7XG4gIH07XG5cbiAgb25CbHVyMSA9ICgpID0+IHtcbiAgICB0aGlzLnByb3BzLm9uSW5wdXQxQ2hhbmdlKHRoaXMucHJvcHMudmFsdWUxLCBmYWxzZSk7XG4gIH07XG5cbiAgY3JlYXRlU2xpZGVyID0gKHdpZHRoLCBsZW5ndGgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPFN0eWxlZFJhbmdlU2xpZGVyIGNsYXNzTmFtZT1cInJhbmdlLXNsaWRlclwiPlxuICAgICAgICAgIDxTbGlkZXJIYW5kbGVcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLXNsaWRlcl9faGFuZGxlXCJcbiAgICAgICAgICAgIGxlZnQ9e3RoaXMuY2FsY0hhbmRsZUxlZnQwKHdpZHRoLCBsZW5ndGgpfVxuICAgICAgICAgICAgdmFsdWVMaXN0ZW5lcj17dGhpcy5zbGlkZTBMaXN0ZW5lcn1cbiAgICAgICAgICAgIGRpc3BsYXk9e3RoaXMucHJvcHMuaXNSYW5nZWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8U2xpZGVySGFuZGxlXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1zbGlkZXJfX2hhbmRsZVwiXG4gICAgICAgICAgICBsZWZ0PXt0aGlzLmNhbGNIYW5kbGVMZWZ0MSh3aWR0aCwgbGVuZ3RoKX1cbiAgICAgICAgICAgIHZhbHVlTGlzdGVuZXI9e3RoaXMuc2xpZGUxTGlzdGVuZXJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8U2xpZGVyQmFySGFuZGxlXG4gICAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgICBsZW5ndGg9e2xlbmd0aH1cbiAgICAgICAgICAgIGVuYWJsZUJhckRyYWc9e3RoaXMucHJvcHMuZW5hYmxlQmFyRHJhZ31cbiAgICAgICAgICAgIHNsaWRlckJhckxpc3RlbmVyPXt0aGlzLnNsaWRlckJhckxpc3RlbmVyfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3R5bGVkUmFuZ2VTbGlkZXI+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9O1xuXG4gIGNyZWF0ZUlucHV0MCA9ICgpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW5cbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHtcbiAgICAgICAgICAncG9zaXRpb24tLXJlbGF0aXZlJzogdHJ1ZSxcbiAgICAgICAgICBoaWRkZW46ICF0aGlzLnByb3BzLnNob3dWYWx1ZXMgfHwgIXRoaXMucHJvcHMuaXNSYW5nZWRcbiAgICAgICAgfSl9XG4gICAgICA+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLXNsaWRlcl9faW5wdXQgaGFyZCB0ZXh0LWlucHV0IGJvcmRlcmxlc3Mgb25lLXF1YXJ0ZXIgZmxvYXQtLWxlZnQgYmctdHJhbnNwYXJlbnRcIlxuICAgICAgICAgIHN0ZXA9e3RoaXMucHJvcHMuc3RlcH1cbiAgICAgICAgICB0eXBlPXsnbnVtYmVyJ31cbiAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZTB9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaW5wdXQwTGlzdGVuZXJ9XG4gICAgICAgICAgb25CbHVyPXt0aGlzLm9uQmx1cjB9XG4gICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuZGlzYWJsZWR9XG4gICAgICAgIC8+XG4gICAgICA8L3NwYW4+XG4gICAgKTtcbiAgfTtcblxuICBjcmVhdGVJbnB1dDEgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh7XG4gICAgICAgICAgaGlkZGVuOiAhdGhpcy5wcm9wcy5zaG93VmFsdWVzXG4gICAgICAgIH0pfVxuICAgICAgPlxuICAgICAgICA8U2xpZGVySW5wdXRcbiAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1zbGlkZXJfX2lucHV0XCJcbiAgICAgICAgICBzdGVwPXt0aGlzLnByb3BzLnN0ZXB9XG4gICAgICAgICAgdHlwZT17J251bWJlcid9XG4gICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWUxfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmlucHV0MUxpc3RlbmVyfVxuICAgICAgICAgIG9uQmx1cj17dGhpcy5vbkJsdXIxfVxuICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfVxuICAgICAgICAvPlxuICAgICAgPC9zcGFuPlxuICAgICk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNsYXNzU2V0LFxuICAgICAgaXNSYW5nZWQsXG4gICAgICBtYXhWYWx1ZSxcbiAgICAgIG1pblZhbHVlLFxuICAgICAgdmFsdWUwLFxuICAgICAgdmFsdWUxXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgdmFsdWUgPSAhaXNSYW5nZWQgJiYgbWluVmFsdWUgPiAwID8gbWluVmFsdWUgOiB2YWx1ZTA7XG4gICAgY29uc3QgY3VyclZhbERlbHRhID0gdmFsdWUxIC0gdmFsdWU7XG4gICAgY29uc3QgbWF4RGVsdGEgPSBtYXhWYWx1ZSAtIG1pblZhbHVlO1xuICAgIGNvbnN0IHdpZHRoID0gY3VyclZhbERlbHRhIC8gbWF4RGVsdGEgKiAxMDA7XG5cbiAgICBjb25zdCBsZW5ndGggPSAodmFsdWUgLSBtaW5WYWx1ZSkgLyBtYXhEZWx0YSAqIDEwMDtcbiAgICByZXR1cm4gKFxuICAgICAgPFNsaWRlcldyYXBwZXJcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKHsuLi5jbGFzc1NldCwgc2xpZGVyOiB0cnVlfSl9XG4gICAgICAgIGlubmVyUmVmPXt0aGlzLl9zYXZlUmVmfVxuICAgICAgICBpc1JhbmdlZD17aXNSYW5nZWR9XG4gICAgICA+XG4gICAgICAgIHt0aGlzLmNyZWF0ZVNsaWRlcih3aWR0aCwgbGVuZ3RoKX1cbiAgICAgICAgey8qdGhpcy5jcmVhdGVJbnB1dDAoKSovfVxuICAgICAgICB7Lyp0aGlzLmNyZWF0ZUlucHV0MSgpKi99XG4gICAgICA8L1NsaWRlcldyYXBwZXI+XG4gICAgKTtcbiAgfVxufVxuXG5TbGlkZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuU2xpZGVyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuZXhwb3J0IGRlZmF1bHQgU2xpZGVyO1xuIl19