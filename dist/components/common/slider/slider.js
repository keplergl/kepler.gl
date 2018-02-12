'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  position: relative;\n  margin-bottom: 12px;\n  background-color: ', ';\n  height: ', ';\n'], ['\n  position: relative;\n  margin-bottom: 12px;\n  background-color: ', ';\n  height: ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  flex-grow: 1;\n  margin-top: ', 'px;\n'], ['\n  flex-grow: 1;\n  margin-top: ', 'px;\n']);

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
  sliderHandleWidth: _propTypes2.default.number,
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
  step: 1,
  sliderHandleWidth: 12,
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

var SliderWrapper = _styledComponents2.default.div(_templateObject2, function (props) {
  return props.isRanged ? 0 : 10;
});

var Slider = function (_React$Component) {
  (0, _inherits3.default)(Slider, _React$Component);

  function Slider() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Slider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Slider.__proto__ || Object.getPrototypeOf(Slider)).call.apply(_ref, [this].concat(args))), _this), _this.ref = undefined, _this._saveRef = function (ref) {
      _this.ref = ref;
    }, _this.slide0Listener = function (x) {
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
    }, _this.calcHandleLeft0 = function (w, l, num) {
      return w === 0 ? 'calc(' + l + '% - ' + _this.props.sliderHandleWidth / 2 + 'px)' : 'calc(' + l + '% - ' + _this.props.sliderHandleWidth / 2 + 'px)';
    }, _this.calcHandleLeft1 = function (w, l) {
      return _this.props.isRanged && w === 0 ? l + '%' : 'calc(' + (l + w) + '% - ' + _this.props.sliderHandleWidth / 2 + 'px)';
    }, _this.createSlider = function (width, v0Left) {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          StyledRangeSlider,
          { className: 'range-slider' },
          _react2.default.createElement(_sliderHandle2.default, {
            className: 'range-slider__handle',
            left: _this.calcHandleLeft0(width, v0Left),
            valueListener: _this.slide0Listener,
            sliderHandleWidth: _this.props.sliderHandleWidth,
            display: _this.props.isRanged
          }),
          _react2.default.createElement(_sliderHandle2.default, {
            className: 'range-slider__handle',
            left: _this.calcHandleLeft1(width, v0Left),
            valueListener: _this.slide1Listener,
            sliderHandleWidth: _this.props.sliderHandleWidth
          }),
          _react2.default.createElement(_sliderBarHandle2.default, {
            width: width,
            v0Left: v0Left,
            enableBarDrag: _this.props.enableBarDrag,
            sliderBarListener: _this.sliderBarListener
          })
        )
      );
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Slider, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          classSet = _props.classSet,
          isRanged = _props.isRanged,
          maxValue = _props.maxValue,
          minValue = _props.minValue,
          value1 = _props.value1;

      var value0 = !isRanged && minValue > 0 ? minValue : this.props.value0;
      var currValDelta = value1 - value0;
      var maxDelta = maxValue - minValue;
      var width = currValDelta / maxDelta * 100;

      var v0Left = (value0 - minValue) / maxDelta * 100;

      return _react2.default.createElement(
        SliderWrapper,
        {
          className: (0, _classnames2.default)((0, _extends3.default)({}, classSet, { slider: true })),
          innerRef: this._saveRef,
          isRanged: isRanged
        },
        this.createSlider(width, v0Left)
      );
    }
  }]);
  return Slider;
}(_react2.default.Component);

Slider.defaultProps = defaultProps;
Slider.propTypes = propTypes;

exports.default = Slider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zbGlkZXIvc2xpZGVyLmpzIl0sIm5hbWVzIjpbIm5vb3AiLCJwcm9wVHlwZXMiLCJ0aXRsZSIsInN0cmluZyIsImlzUmFuZ2VkIiwiYm9vbCIsInZhbHVlMCIsIm51bWJlciIsInZhbHVlMSIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCJzbGlkZXJIYW5kbGVXaWR0aCIsIm9uU2xpZGVyMENoYW5nZSIsImZ1bmMiLCJvbklucHV0MENoYW5nZSIsIm9uU2xpZGVyMUNoYW5nZSIsIm9uSW5wdXQxQ2hhbmdlIiwib25TbGlkZXJCYXJDaGFuZ2UiLCJzdGVwIiwiZW5hYmxlQmFyRHJhZyIsImRlZmF1bHRQcm9wcyIsImRpc2FibGVkIiwiU3R5bGVkUmFuZ2VTbGlkZXIiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwic2xpZGVyQmFyQmdkIiwic2xpZGVyQmFySGVpZ2h0IiwiU2xpZGVyV3JhcHBlciIsIlNsaWRlciIsInJlZiIsInVuZGVmaW5lZCIsIl9zYXZlUmVmIiwic2xpZGUwTGlzdGVuZXIiLCJ4UGVyY2VudCIsIngiLCJvZmZzZXRXaWR0aCIsIm1heERlbHRhIiwidmFsIiwiY2FsbCIsInNsaWRlMUxpc3RlbmVyIiwic2xpZGVyQmFyTGlzdGVuZXIiLCJ2YWwwIiwidmFsMSIsImNhbGNIYW5kbGVMZWZ0MCIsInciLCJsIiwibnVtIiwiY2FsY0hhbmRsZUxlZnQxIiwiY3JlYXRlU2xpZGVyIiwid2lkdGgiLCJ2MExlZnQiLCJjbGFzc1NldCIsImN1cnJWYWxEZWx0YSIsInNsaWRlciIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFQSxTQUFTQSxJQUFULEdBQWdCLENBQUU7O0FBRWxCLElBQU1DLFlBQVk7QUFDaEJDLFNBQU8sb0JBQVVDLE1BREQ7QUFFaEJDLFlBQVUsb0JBQVVDLElBRko7QUFHaEJDLFVBQVEsb0JBQVVDLE1BSEY7QUFJaEJDLFVBQVEsb0JBQVVELE1BSkY7QUFLaEJFLFlBQVUsb0JBQVVGLE1BTEo7QUFNaEJHLFlBQVUsb0JBQVVILE1BTko7QUFPaEJJLHFCQUFtQixvQkFBVUosTUFQYjtBQVFoQkssbUJBQWlCLG9CQUFVQyxJQVJYO0FBU2hCQyxrQkFBZ0Isb0JBQVVELElBVFY7QUFVaEJFLG1CQUFpQixvQkFBVUYsSUFWWDtBQVdoQkcsa0JBQWdCLG9CQUFVSCxJQVhWO0FBWWhCSSxxQkFBbUIsb0JBQVVKLElBWmI7QUFhaEJLLFFBQU0sb0JBQVVYLE1BYkE7QUFjaEJZLGlCQUFlLG9CQUFVZDtBQWRULENBQWxCOztBQWlCQSxJQUFNZSxlQUFlO0FBQ25CbEIsU0FBTyxFQURZO0FBRW5CRSxZQUFVLElBRlM7QUFHbkJFLFVBQVEsQ0FIVztBQUluQkUsVUFBUSxHQUpXO0FBS25CQyxZQUFVLENBTFM7QUFNbkJDLFlBQVUsR0FOUztBQU9uQlEsUUFBTSxDQVBhO0FBUW5CUCxxQkFBbUIsRUFSQTtBQVNuQlEsaUJBQWUsS0FUSTtBQVVuQlAsbUJBQWlCWixJQVZFO0FBV25CYyxrQkFBZ0JkLElBWEc7QUFZbkJlLG1CQUFpQmYsSUFaRTtBQWFuQmdCLGtCQUFnQmhCLElBYkc7QUFjbkJpQixxQkFBbUJqQixJQWRBO0FBZW5CcUIsWUFBVTtBQWZTLENBQXJCOztBQWtCQSxJQUFNQyxvQkFBb0IsMkJBQU9DLEdBQTNCLGtCQUdnQjtBQUFBLFNBQVNDLE1BQU1DLEtBQU4sQ0FBWUMsWUFBckI7QUFBQSxDQUhoQixFQUlNO0FBQUEsU0FBU0YsTUFBTUMsS0FBTixDQUFZRSxlQUFyQjtBQUFBLENBSk4sQ0FBTjs7QUFPQSxJQUFNQyxnQkFBZ0IsMkJBQU9MLEdBQXZCLG1CQUVVO0FBQUEsU0FBU0MsTUFBTXBCLFFBQU4sR0FBaUIsQ0FBakIsR0FBcUIsRUFBOUI7QUFBQSxDQUZWLENBQU47O0lBS015QixNOzs7Ozs7Ozs7Ozs7OztvTUFFSkMsRyxHQUFNQyxTLFFBRU5DLFEsR0FBVyxlQUFPO0FBQ2hCLFlBQUtGLEdBQUwsR0FBV0EsR0FBWDtBQUNELEssUUFFREcsYyxHQUFpQixhQUFLO0FBQ3BCLFVBQU1DLFdBQVdDLElBQUksTUFBS0wsR0FBTCxDQUFTTSxXQUE5QjtBQUNBLFVBQU1DLFdBQVcsTUFBS2IsS0FBTCxDQUFXZCxRQUFYLEdBQXNCLE1BQUtjLEtBQUwsQ0FBV2YsUUFBbEQ7QUFDQSxVQUFNNkIsTUFBTUosV0FBV0csUUFBdkI7QUFDQSxZQUFLYixLQUFMLENBQVdaLGVBQVgsQ0FBMkIyQixJQUEzQixRQUFzQ0QsTUFBTSxNQUFLZCxLQUFMLENBQVdsQixNQUF2RDtBQUNELEssUUFFRGtDLGMsR0FBaUIsYUFBSztBQUNwQixVQUFNTixXQUFXQyxJQUFJLE1BQUtMLEdBQUwsQ0FBU00sV0FBOUI7QUFDQSxVQUFNQyxXQUFXLE1BQUtiLEtBQUwsQ0FBV2QsUUFBWCxHQUFzQixNQUFLYyxLQUFMLENBQVdmLFFBQWxEO0FBQ0EsVUFBTTZCLE1BQU1KLFdBQVdHLFFBQXZCO0FBQ0EsWUFBS2IsS0FBTCxDQUFXVCxlQUFYLENBQTJCdUIsTUFBTSxNQUFLZCxLQUFMLENBQVdoQixNQUE1QztBQUNELEssUUFFRGlDLGlCLEdBQW9CLGFBQUs7QUFDdkIsVUFBTVAsV0FBV0MsSUFBSSxNQUFLTCxHQUFMLENBQVNNLFdBQTlCO0FBQ0EsVUFBTUMsV0FBVyxNQUFLYixLQUFMLENBQVdkLFFBQVgsR0FBc0IsTUFBS2MsS0FBTCxDQUFXZixRQUFsRDtBQUNBLFVBQU02QixNQUFNSixXQUFXRyxRQUF2QjtBQUNBLFVBQU1LLE9BQU9KLE1BQU0sTUFBS2QsS0FBTCxDQUFXbEIsTUFBOUI7QUFDQSxVQUFNcUMsT0FBT0wsTUFBTSxNQUFLZCxLQUFMLENBQVdoQixNQUE5QjtBQUNBLFlBQUtnQixLQUFMLENBQVdQLGlCQUFYLENBQTZCeUIsSUFBN0IsRUFBbUNDLElBQW5DO0FBQ0QsSyxRQUVEQyxlLEdBQWtCLFVBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFPQyxHQUFQLEVBQWU7QUFDL0IsYUFBT0YsTUFBTSxDQUFOLGFBQWtCQyxDQUFsQixZQUEwQixNQUFLdEIsS0FBTCxDQUFXYixpQkFBWCxHQUErQixDQUF6RCxxQkFDR21DLENBREgsWUFDVyxNQUFLdEIsS0FBTCxDQUFXYixpQkFBWCxHQUErQixDQUQxQyxRQUFQO0FBRUQsSyxRQUVEcUMsZSxHQUFrQixVQUFDSCxDQUFELEVBQUlDLENBQUosRUFBVTtBQUMxQixhQUFPLE1BQUt0QixLQUFMLENBQVdwQixRQUFYLElBQXVCeUMsTUFBTSxDQUE3QixHQUNBQyxDQURBLG9CQUVLQSxJQUFJRCxDQUZULGFBRWlCLE1BQUtyQixLQUFMLENBQVdiLGlCQUFYLEdBQStCLENBRmhELFFBQVA7QUFHRCxLLFFBRURzQyxZLEdBQWUsVUFBQ0MsS0FBRCxFQUFRQyxNQUFSLEVBQW1CO0FBQ2hDLGFBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQywyQkFBRDtBQUFBLFlBQW1CLFdBQVUsY0FBN0I7QUFDRTtBQUNFLHVCQUFVLHNCQURaO0FBRUUsa0JBQU0sTUFBS1AsZUFBTCxDQUFxQk0sS0FBckIsRUFBNEJDLE1BQTVCLENBRlI7QUFHRSwyQkFBZSxNQUFLbEIsY0FIdEI7QUFJRSwrQkFBbUIsTUFBS1QsS0FBTCxDQUFXYixpQkFKaEM7QUFLRSxxQkFBUyxNQUFLYSxLQUFMLENBQVdwQjtBQUx0QixZQURGO0FBUUU7QUFDRSx1QkFBVSxzQkFEWjtBQUVFLGtCQUFNLE1BQUs0QyxlQUFMLENBQXFCRSxLQUFyQixFQUE0QkMsTUFBNUIsQ0FGUjtBQUdFLDJCQUFlLE1BQUtYLGNBSHRCO0FBSUUsK0JBQW1CLE1BQUtoQixLQUFMLENBQVdiO0FBSmhDLFlBUkY7QUFjRTtBQUNFLG1CQUFPdUMsS0FEVDtBQUVFLG9CQUFRQyxNQUZWO0FBR0UsMkJBQWUsTUFBSzNCLEtBQUwsQ0FBV0wsYUFINUI7QUFJRSwrQkFBbUIsTUFBS3NCO0FBSjFCO0FBZEY7QUFERixPQURGO0FBeUJELEs7Ozs7OzZCQUVRO0FBQUEsbUJBT0gsS0FBS2pCLEtBUEY7QUFBQSxVQUVMNEIsUUFGSyxVQUVMQSxRQUZLO0FBQUEsVUFHTGhELFFBSEssVUFHTEEsUUFISztBQUFBLFVBSUxNLFFBSkssVUFJTEEsUUFKSztBQUFBLFVBS0xELFFBTEssVUFLTEEsUUFMSztBQUFBLFVBTUxELE1BTkssVUFNTEEsTUFOSzs7QUFRUCxVQUFNRixTQUFTLENBQUNGLFFBQUQsSUFBYUssV0FBVyxDQUF4QixHQUE0QkEsUUFBNUIsR0FBdUMsS0FBS2UsS0FBTCxDQUFXbEIsTUFBakU7QUFDQSxVQUFNK0MsZUFBZTdDLFNBQVNGLE1BQTlCO0FBQ0EsVUFBTStCLFdBQVczQixXQUFXRCxRQUE1QjtBQUNBLFVBQU15QyxRQUFRRyxlQUFlaEIsUUFBZixHQUEwQixHQUF4Qzs7QUFFQSxVQUFNYyxTQUFTLENBQUM3QyxTQUFTRyxRQUFWLElBQXNCNEIsUUFBdEIsR0FBaUMsR0FBaEQ7O0FBRUEsYUFDRTtBQUFDLHFCQUFEO0FBQUE7QUFDRSxxQkFBVyxxREFBZWUsUUFBZixJQUF5QkUsUUFBUSxJQUFqQyxJQURiO0FBRUUsb0JBQVUsS0FBS3RCLFFBRmpCO0FBR0Usb0JBQVU1QjtBQUhaO0FBS0csYUFBSzZDLFlBQUwsQ0FBa0JDLEtBQWxCLEVBQXlCQyxNQUF6QjtBQUxILE9BREY7QUFTRDs7O0VBOUZrQixnQkFBTUksUzs7QUFpRzNCMUIsT0FBT1QsWUFBUCxHQUFzQkEsWUFBdEI7QUFDQVMsT0FBTzVCLFNBQVAsR0FBbUJBLFNBQW5COztrQkFFZTRCLE0iLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgU2xpZGVySGFuZGxlIGZyb20gJy4vc2xpZGVyLWhhbmRsZSc7XG5pbXBvcnQgU2xpZGVyQmFySGFuZGxlIGZyb20gJy4vc2xpZGVyLWJhci1oYW5kbGUnO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaXNSYW5nZWQ6IFByb3BUeXBlcy5ib29sLFxuICB2YWx1ZTA6IFByb3BUeXBlcy5udW1iZXIsXG4gIHZhbHVlMTogUHJvcFR5cGVzLm51bWJlcixcbiAgbWluVmFsdWU6IFByb3BUeXBlcy5udW1iZXIsXG4gIG1heFZhbHVlOiBQcm9wVHlwZXMubnVtYmVyLFxuICBzbGlkZXJIYW5kbGVXaWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgb25TbGlkZXIwQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25JbnB1dDBDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblNsaWRlcjFDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvbklucHV0MUNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uU2xpZGVyQmFyQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgc3RlcDogUHJvcFR5cGVzLm51bWJlcixcbiAgZW5hYmxlQmFyRHJhZzogUHJvcFR5cGVzLmJvb2xcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgdGl0bGU6ICcnLFxuICBpc1JhbmdlZDogdHJ1ZSxcbiAgdmFsdWUwOiAwLFxuICB2YWx1ZTE6IDEwMCxcbiAgbWluVmFsdWU6IDAsXG4gIG1heFZhbHVlOiAxMDAsXG4gIHN0ZXA6IDEsXG4gIHNsaWRlckhhbmRsZVdpZHRoOiAxMixcbiAgZW5hYmxlQmFyRHJhZzogZmFsc2UsXG4gIG9uU2xpZGVyMENoYW5nZTogbm9vcCxcbiAgb25JbnB1dDBDaGFuZ2U6IG5vb3AsXG4gIG9uU2xpZGVyMUNoYW5nZTogbm9vcCxcbiAgb25JbnB1dDFDaGFuZ2U6IG5vb3AsXG4gIG9uU2xpZGVyQmFyQ2hhbmdlOiBub29wLFxuICBkaXNhYmxlZDogZmFsc2Vcbn07XG5cbmNvbnN0IFN0eWxlZFJhbmdlU2xpZGVyID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBtYXJnaW4tYm90dG9tOiAxMnB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNsaWRlckJhckJnZH07XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zbGlkZXJCYXJIZWlnaHR9O1xuYDtcblxuY29uc3QgU2xpZGVyV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGZsZXgtZ3JvdzogMTtcbiAgbWFyZ2luLXRvcDogJHtwcm9wcyA9PiBwcm9wcy5pc1JhbmdlZCA/IDAgOiAxMH1weDtcbmA7XG5cbmNsYXNzIFNsaWRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgcmVmID0gdW5kZWZpbmVkO1xuXG4gIF9zYXZlUmVmID0gcmVmID0+IHtcbiAgICB0aGlzLnJlZiA9IHJlZjtcbiAgfTtcblxuICBzbGlkZTBMaXN0ZW5lciA9IHggPT4ge1xuICAgIGNvbnN0IHhQZXJjZW50ID0geCAvIHRoaXMucmVmLm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IG1heERlbHRhID0gdGhpcy5wcm9wcy5tYXhWYWx1ZSAtIHRoaXMucHJvcHMubWluVmFsdWU7XG4gICAgY29uc3QgdmFsID0geFBlcmNlbnQgKiBtYXhEZWx0YTtcbiAgICB0aGlzLnByb3BzLm9uU2xpZGVyMENoYW5nZS5jYWxsKHRoaXMsIHZhbCArIHRoaXMucHJvcHMudmFsdWUwKTtcbiAgfTtcblxuICBzbGlkZTFMaXN0ZW5lciA9IHggPT4ge1xuICAgIGNvbnN0IHhQZXJjZW50ID0geCAvIHRoaXMucmVmLm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IG1heERlbHRhID0gdGhpcy5wcm9wcy5tYXhWYWx1ZSAtIHRoaXMucHJvcHMubWluVmFsdWU7XG4gICAgY29uc3QgdmFsID0geFBlcmNlbnQgKiBtYXhEZWx0YTtcbiAgICB0aGlzLnByb3BzLm9uU2xpZGVyMUNoYW5nZSh2YWwgKyB0aGlzLnByb3BzLnZhbHVlMSk7XG4gIH07XG5cbiAgc2xpZGVyQmFyTGlzdGVuZXIgPSB4ID0+IHtcbiAgICBjb25zdCB4UGVyY2VudCA9IHggLyB0aGlzLnJlZi5vZmZzZXRXaWR0aDtcbiAgICBjb25zdCBtYXhEZWx0YSA9IHRoaXMucHJvcHMubWF4VmFsdWUgLSB0aGlzLnByb3BzLm1pblZhbHVlO1xuICAgIGNvbnN0IHZhbCA9IHhQZXJjZW50ICogbWF4RGVsdGE7XG4gICAgY29uc3QgdmFsMCA9IHZhbCArIHRoaXMucHJvcHMudmFsdWUwO1xuICAgIGNvbnN0IHZhbDEgPSB2YWwgKyB0aGlzLnByb3BzLnZhbHVlMTtcbiAgICB0aGlzLnByb3BzLm9uU2xpZGVyQmFyQ2hhbmdlKHZhbDAsIHZhbDEpO1xuICB9O1xuXG4gIGNhbGNIYW5kbGVMZWZ0MCA9ICh3LCBsLCBudW0pID0+IHtcbiAgICByZXR1cm4gdyA9PT0gMCA/IGBjYWxjKCR7bH0lIC0gJHt0aGlzLnByb3BzLnNsaWRlckhhbmRsZVdpZHRoIC8gMn1weClgIDpcbiAgICAgIGBjYWxjKCR7bH0lIC0gJHt0aGlzLnByb3BzLnNsaWRlckhhbmRsZVdpZHRoIC8gMn1weClgO1xuICB9O1xuXG4gIGNhbGNIYW5kbGVMZWZ0MSA9ICh3LCBsKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuaXNSYW5nZWQgJiYgdyA9PT0gMFxuICAgICAgPyBgJHtsfSVgXG4gICAgICA6IGBjYWxjKCR7bCArIHd9JSAtICR7dGhpcy5wcm9wcy5zbGlkZXJIYW5kbGVXaWR0aCAvIDJ9cHgpYDtcbiAgfTtcblxuICBjcmVhdGVTbGlkZXIgPSAod2lkdGgsIHYwTGVmdCkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8U3R5bGVkUmFuZ2VTbGlkZXIgY2xhc3NOYW1lPVwicmFuZ2Utc2xpZGVyXCI+XG4gICAgICAgICAgPFNsaWRlckhhbmRsZVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2Utc2xpZGVyX19oYW5kbGVcIlxuICAgICAgICAgICAgbGVmdD17dGhpcy5jYWxjSGFuZGxlTGVmdDAod2lkdGgsIHYwTGVmdCl9XG4gICAgICAgICAgICB2YWx1ZUxpc3RlbmVyPXt0aGlzLnNsaWRlMExpc3RlbmVyfVxuICAgICAgICAgICAgc2xpZGVySGFuZGxlV2lkdGg9e3RoaXMucHJvcHMuc2xpZGVySGFuZGxlV2lkdGh9XG4gICAgICAgICAgICBkaXNwbGF5PXt0aGlzLnByb3BzLmlzUmFuZ2VkfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFNsaWRlckhhbmRsZVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2Utc2xpZGVyX19oYW5kbGVcIlxuICAgICAgICAgICAgbGVmdD17dGhpcy5jYWxjSGFuZGxlTGVmdDEod2lkdGgsIHYwTGVmdCl9XG4gICAgICAgICAgICB2YWx1ZUxpc3RlbmVyPXt0aGlzLnNsaWRlMUxpc3RlbmVyfVxuICAgICAgICAgICAgc2xpZGVySGFuZGxlV2lkdGg9e3RoaXMucHJvcHMuc2xpZGVySGFuZGxlV2lkdGh9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8U2xpZGVyQmFySGFuZGxlXG4gICAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgICB2MExlZnQ9e3YwTGVmdH1cbiAgICAgICAgICAgIGVuYWJsZUJhckRyYWc9e3RoaXMucHJvcHMuZW5hYmxlQmFyRHJhZ31cbiAgICAgICAgICAgIHNsaWRlckJhckxpc3RlbmVyPXt0aGlzLnNsaWRlckJhckxpc3RlbmVyfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU3R5bGVkUmFuZ2VTbGlkZXI+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBjbGFzc1NldCxcbiAgICAgIGlzUmFuZ2VkLFxuICAgICAgbWF4VmFsdWUsXG4gICAgICBtaW5WYWx1ZSxcbiAgICAgIHZhbHVlMVxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHZhbHVlMCA9ICFpc1JhbmdlZCAmJiBtaW5WYWx1ZSA+IDAgPyBtaW5WYWx1ZSA6IHRoaXMucHJvcHMudmFsdWUwO1xuICAgIGNvbnN0IGN1cnJWYWxEZWx0YSA9IHZhbHVlMSAtIHZhbHVlMDtcbiAgICBjb25zdCBtYXhEZWx0YSA9IG1heFZhbHVlIC0gbWluVmFsdWU7XG4gICAgY29uc3Qgd2lkdGggPSBjdXJyVmFsRGVsdGEgLyBtYXhEZWx0YSAqIDEwMDtcblxuICAgIGNvbnN0IHYwTGVmdCA9ICh2YWx1ZTAgLSBtaW5WYWx1ZSkgLyBtYXhEZWx0YSAqIDEwMDtcblxuICAgIHJldHVybiAoXG4gICAgICA8U2xpZGVyV3JhcHBlclxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoey4uLmNsYXNzU2V0LCBzbGlkZXI6IHRydWV9KX1cbiAgICAgICAgaW5uZXJSZWY9e3RoaXMuX3NhdmVSZWZ9XG4gICAgICAgIGlzUmFuZ2VkPXtpc1JhbmdlZH1cbiAgICAgID5cbiAgICAgICAge3RoaXMuY3JlYXRlU2xpZGVyKHdpZHRoLCB2MExlZnQpfVxuICAgICAgPC9TbGlkZXJXcmFwcGVyPlxuICAgICk7XG4gIH1cbn1cblxuU2xpZGVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblNsaWRlci5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG5cbmV4cG9ydCBkZWZhdWx0IFNsaWRlcjtcbiJdfQ==