'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  height: 24px;\n  width: 40px;\n  padding: 4px 6px;\n  margin-left: ', 'px;\n'], ['\n  height: 24px;\n  width: 40px;\n  padding: 4px 6px;\n  margin-left: ', 'px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  display: flex;\n  position: relative;\n'], ['\n  display: flex;\n  position: relative;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  margin-top: 6px;\n  display: flex;\n  justify-content: space-between;\n'], ['\n  margin-top: 6px;\n  display: flex;\n  justify-content: space-between;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _rangePlot = require('./range-plot');

var _rangePlot2 = _interopRequireDefault(_rangePlot);

var _slider = require('./slider/slider');

var _slider2 = _interopRequireDefault(_slider);

var _styledComponents3 = require('./styled-components');

var _dataUtils = require('../../utils/data-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  range: _propTypes2.default.arrayOf(_propTypes2.default.number).isRequired,
  value0: _propTypes2.default.number.isRequired,
  value1: _propTypes2.default.number.isRequired,
  onChange: _propTypes2.default.func.isRequired,
  histogram: _propTypes2.default.array,
  isRanged: _propTypes2.default.bool,
  isEnlarged: _propTypes2.default.bool,
  showInput: _propTypes2.default.bool,
  inputTheme: _propTypes2.default.string,
  step: _propTypes2.default.number,
  sliderHandleWidth: _propTypes2.default.number,
  xAxis: _propTypes2.default.func
};

var defaultProps = {
  isEnlarged: false,
  isRanged: true,
  showInput: true,
  sliderHandleWidth: 12,
  onChange: function onChange() {}
};

var SliderInput = _styledComponents3.Input.extend(_templateObject, function (props) {
  return props.flush ? 0 : 24;
});

var SliderWrapper = _styledComponents2.default.div(_templateObject2);

var RangeInputWrapper = _styledComponents2.default.div(_templateObject3);

var RangeSlider = function (_Component) {
  (0, _inherits3.default)(RangeSlider, _Component);

  function RangeSlider() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, RangeSlider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = RangeSlider.__proto__ || Object.getPrototypeOf(RangeSlider)).call.apply(_ref, [this].concat(args))), _this), _this.state = { value0: 0, value1: 1, width: 288 }, _this._setValueFromProps = function (props) {
      var value0 = props.value0,
          value1 = props.value1;


      if (!isNaN(value0) && !isNaN(value1)) {
        _this.setState({ value0: value0, value1: value1 });
      }
    }, _this._isVal0InRange = function (val) {
      var _this$props = _this.props,
          value1 = _this$props.value1,
          range = _this$props.range;


      return Boolean(val >= range[0] && val <= value1);
    }, _this._isVal1InRange = function (val) {
      var _this$props2 = _this.props,
          range = _this$props2.range,
          value0 = _this$props2.value0;


      return Boolean(val <= range[1] && val >= value0);
    }, _this._roundValToStep = function (val) {
      var _this$props3 = _this.props,
          range = _this$props3.range,
          step = _this$props3.step;


      return (0, _dataUtils.roundValToStep)(range[0], step, val);
    }, _this._setRangeVal1 = function (val) {
      var _this$props4 = _this.props,
          value0 = _this$props4.value0,
          onChange = _this$props4.onChange;

      val = Number(val);

      if (_this._isVal1InRange(val)) {
        onChange([value0, _this._roundValToStep(val)]);
        return true;
      }
      return false;
    }, _this._setRangeVal0 = function (val) {
      var _this$props5 = _this.props,
          value1 = _this$props5.value1,
          onChange = _this$props5.onChange;

      val = Number(val);

      if (_this._isVal0InRange(val)) {
        onChange([_this._roundValToStep(val), value1]);
        return true;
      }
      return false;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(RangeSlider, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._setValueFromProps(this.props);
      this._resize();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this._setValueFromProps(nextProps);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._resize();
    }
  }, {
    key: '_resize',
    value: function _resize() {
      var width = this.sliderContainer.offsetWidth;
      if (width !== this.state.width) {
        this.setState({ width: width });
      }
    }
  }, {
    key: '_renderInput',
    value: function _renderInput(key) {
      var _this2 = this;

      var setRange = key === 'value0' ? this._setRangeVal0 : this._setRangeVal1;
      var update = function update(e) {
        if (!setRange(e.target.value)) {
          _this2.setState((0, _defineProperty3.default)({}, key, _this2.state[key]));
        }
      };

      return _react2.default.createElement(SliderInput, {
        className: 'range-slider__input',
        type: 'number',
        innerRef: function innerRef(comp) {
          _this2['input-' + key] = comp;
        },
        id: 'filter-' + key,
        value: this.state[key],
        onChange: function onChange(e) {
          _this2.setState((0, _defineProperty3.default)({}, key, e.target.value));
        },
        onKeyPress: function onKeyPress(e) {
          if (e.key === 'Enter') {
            update(e);
            _this2['input-' + key].blur();
          }
        },
        onBlur: update,
        flush: key === 'value0',
        secondary: this.props.inputTheme === 'secondary'
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          isRanged = _props.isRanged,
          showInput = _props.showInput,
          histogram = _props.histogram,
          lineChart = _props.lineChart,
          plotType = _props.plotType,
          isEnlarged = _props.isEnlarged,
          range = _props.range,
          onChange = _props.onChange,
          value0 = _props.value0,
          value1 = _props.value1,
          sliderHandleWidth = _props.sliderHandleWidth;


      var height = this.props.xAxis ? '24px' : '16px';
      var width = this.state.width;

      var plotWidth = width - sliderHandleWidth;

      return _react2.default.createElement(
        'div',
        { className: 'range-slider', style: { width: '100%', padding: '0 6px' },
          ref: function ref(comp) {
            _this3.sliderContainer = comp;
          } },
        histogram && histogram.length ? _react2.default.createElement(_rangePlot2.default, {
          histogram: histogram,
          lineChart: lineChart,
          plotType: plotType,
          isEnlarged: isEnlarged,
          onBrush: function onBrush(val0, val1) {
            onChange([_this3._roundValToStep(val0), _this3._roundValToStep(val1)]);
          },
          range: range,
          value: [value0, value1],
          width: plotWidth
        }) : null,
        _react2.default.createElement(
          SliderWrapper,
          {
            style: { height: height },
            className: 'range-slider__slider' },
          this.props.xAxis ? _react2.default.createElement(this.props.xAxis, { width: plotWidth, domain: range }) : null,
          _react2.default.createElement(_slider2.default, {
            showValues: false,
            isRanged: isRanged,
            minValue: range[0],
            maxValue: range[1],
            value0: value0,
            value1: value1,
            handleWidth: sliderHandleWidth,
            onSlider0Change: this._setRangeVal0,
            onSlider1Change: this._setRangeVal1,
            onSliderBarChange: function onSliderBarChange(val0, val1) {
              if (_this3._isVal1InRange(val1) && _this3._isVal0InRange(val0)) {
                onChange([_this3._roundValToStep(val0), _this3._roundValToStep(val1)]);
              }
            },
            enableBarDrag: true
          }),
          !isRanged && showInput ? this._renderInput('value1') : null
        ),
        isRanged && showInput ? _react2.default.createElement(
          RangeInputWrapper,
          { className: 'range-slider__input-group' },
          this._renderInput('value0'),
          this._renderInput('value1')
        ) : null
      );
    }
  }]);
  return RangeSlider;
}(_react.Component);

exports.default = RangeSlider;


RangeSlider.propTypes = propTypes;
RangeSlider.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1zbGlkZXIuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwicmFuZ2UiLCJhcnJheU9mIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsInZhbHVlMCIsInZhbHVlMSIsIm9uQ2hhbmdlIiwiZnVuYyIsImhpc3RvZ3JhbSIsImFycmF5IiwiaXNSYW5nZWQiLCJib29sIiwiaXNFbmxhcmdlZCIsInNob3dJbnB1dCIsImlucHV0VGhlbWUiLCJzdHJpbmciLCJzdGVwIiwic2xpZGVySGFuZGxlV2lkdGgiLCJ4QXhpcyIsImRlZmF1bHRQcm9wcyIsIlNsaWRlcklucHV0IiwiZXh0ZW5kIiwicHJvcHMiLCJmbHVzaCIsIlNsaWRlcldyYXBwZXIiLCJkaXYiLCJSYW5nZUlucHV0V3JhcHBlciIsIlJhbmdlU2xpZGVyIiwic3RhdGUiLCJ3aWR0aCIsIl9zZXRWYWx1ZUZyb21Qcm9wcyIsImlzTmFOIiwic2V0U3RhdGUiLCJfaXNWYWwwSW5SYW5nZSIsIkJvb2xlYW4iLCJ2YWwiLCJfaXNWYWwxSW5SYW5nZSIsIl9yb3VuZFZhbFRvU3RlcCIsIl9zZXRSYW5nZVZhbDEiLCJOdW1iZXIiLCJfc2V0UmFuZ2VWYWwwIiwiX3Jlc2l6ZSIsIm5leHRQcm9wcyIsInNsaWRlckNvbnRhaW5lciIsIm9mZnNldFdpZHRoIiwia2V5Iiwic2V0UmFuZ2UiLCJ1cGRhdGUiLCJlIiwidGFyZ2V0IiwidmFsdWUiLCJjb21wIiwiYmx1ciIsImxpbmVDaGFydCIsInBsb3RUeXBlIiwiaGVpZ2h0IiwicGxvdFdpZHRoIiwicGFkZGluZyIsImxlbmd0aCIsInZhbDAiLCJ2YWwxIiwiX3JlbmRlcklucHV0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFNB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a0JBQUksT0FBS3hCLGNBQUwsQ0FBb0J3QixJQUFwQixLQUE2QixPQUFLM0IsY0FBTCxDQUFvQjBCLElBQXBCLENBQWpDLEVBQTREO0FBQzFEckQseUJBQVMsQ0FDUCxPQUFLK0IsZUFBTCxDQUFxQnNCLElBQXJCLENBRE8sRUFFUCxPQUFLdEIsZUFBTCxDQUFxQnVCLElBQXJCLENBRk8sQ0FBVDtBQUlEO0FBQ0YsYUFqQkg7QUFrQkU7QUFsQkYsWUFKRjtBQXdCRyxXQUFDbEQsUUFBRCxJQUFhRyxTQUFiLEdBQXlCLEtBQUtnRCxZQUFMLENBQWtCLFFBQWxCLENBQXpCLEdBQXVEO0FBeEIxRCxTQXJCRjtBQStDR25ELG9CQUFZRyxTQUFaLEdBQXdCO0FBQUMsMkJBQUQ7QUFBQSxZQUFtQixXQUFVLDJCQUE3QjtBQUN0QixlQUFLZ0QsWUFBTCxDQUFrQixRQUFsQixDQURzQjtBQUV0QixlQUFLQSxZQUFMLENBQWtCLFFBQWxCO0FBRnNCLFNBQXhCLEdBR3NCO0FBbER6QixPQURGO0FBc0REOzs7OztrQkFqTGtCbEMsVzs7O0FBb0xyQkEsWUFBWTVCLFNBQVosR0FBd0JBLFNBQXhCO0FBQ0E0QixZQUFZUixZQUFaLEdBQTJCQSxZQUEzQiIsImZpbGUiOiJyYW5nZS1zbGlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IFJhbmdlUGxvdCBmcm9tICcuL3JhbmdlLXBsb3QnO1xuaW1wb3J0IFNsaWRlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zbGlkZXIvc2xpZGVyJztcbmltcG9ydCB7SW5wdXR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IHtyb3VuZFZhbFRvU3RlcH0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgcmFuZ2U6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWQsXG4gIHZhbHVlMDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICB2YWx1ZTE6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGhpc3RvZ3JhbTogUHJvcFR5cGVzLmFycmF5LFxuICBpc1JhbmdlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGlzRW5sYXJnZWQ6IFByb3BUeXBlcy5ib29sLFxuICBzaG93SW5wdXQ6IFByb3BUeXBlcy5ib29sLFxuICBpbnB1dFRoZW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzdGVwOiBQcm9wVHlwZXMubnVtYmVyLFxuICBzbGlkZXJIYW5kbGVXaWR0aDogUHJvcFR5cGVzLm51bWJlcixcbiAgeEF4aXM6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGlzRW5sYXJnZWQ6IGZhbHNlLFxuICBpc1JhbmdlZDogdHJ1ZSxcbiAgc2hvd0lucHV0OiB0cnVlLFxuICBzbGlkZXJIYW5kbGVXaWR0aDogMTIsXG4gIG9uQ2hhbmdlOiAoKSA9PiB7fVxufTtcblxuY29uc3QgU2xpZGVySW5wdXQgPSBJbnB1dC5leHRlbmRgXG4gIGhlaWdodDogMjRweDtcbiAgd2lkdGg6IDQwcHg7XG4gIHBhZGRpbmc6IDRweCA2cHg7XG4gIG1hcmdpbi1sZWZ0OiAke3Byb3BzID0+IHByb3BzLmZsdXNoID8gMCA6IDI0fXB4O1xuYDtcblxuY29uc3QgU2xpZGVyV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbmA7XG5cbmNvbnN0IFJhbmdlSW5wdXRXcmFwcGVyID1zdHlsZWQuZGl2YFxuICBtYXJnaW4tdG9wOiA2cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJhbmdlU2xpZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGUgPSB7dmFsdWUwOiAwLCB2YWx1ZTE6IDEsIHdpZHRoOiAyODh9O1xuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuX3NldFZhbHVlRnJvbVByb3BzKHRoaXMucHJvcHMpO1xuICAgIHRoaXMuX3Jlc2l6ZSgpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICB0aGlzLl9zZXRWYWx1ZUZyb21Qcm9wcyhuZXh0UHJvcHMpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHRoaXMuX3Jlc2l6ZSgpO1xuICB9XG5cbiAgX3NldFZhbHVlRnJvbVByb3BzID0gcHJvcHMgPT4ge1xuICAgIGNvbnN0IHt2YWx1ZTAsIHZhbHVlMX0gPSBwcm9wcztcblxuICAgIGlmICghaXNOYU4odmFsdWUwKSAmJiAhaXNOYU4odmFsdWUxKSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7dmFsdWUwLCB2YWx1ZTF9KTtcbiAgICB9XG4gIH07XG5cbiAgX2lzVmFsMEluUmFuZ2UgPSB2YWwgPT4ge1xuICAgIGNvbnN0IHt2YWx1ZTEsIHJhbmdlfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gQm9vbGVhbih2YWwgPj0gcmFuZ2VbMF0gJiYgdmFsIDw9IHZhbHVlMSk7XG4gIH07XG5cbiAgX2lzVmFsMUluUmFuZ2UgPSB2YWwgPT4ge1xuICAgIGNvbnN0IHtyYW5nZSwgdmFsdWUwfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gQm9vbGVhbih2YWwgPD0gcmFuZ2VbMV0gJiYgdmFsID49IHZhbHVlMCk7XG4gIH07XG5cbiAgX3JvdW5kVmFsVG9TdGVwID0gdmFsID0+IHtcbiAgICBjb25zdCB7cmFuZ2UsIHN0ZXB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiByb3VuZFZhbFRvU3RlcChyYW5nZVswXSwgc3RlcCwgdmFsKTtcbiAgfTtcblxuICBfc2V0UmFuZ2VWYWwxID0gdmFsID0+IHtcbiAgICBjb25zdCB7dmFsdWUwLCBvbkNoYW5nZX0gPSB0aGlzLnByb3BzO1xuICAgIHZhbCA9IE51bWJlcih2YWwpO1xuXG4gICAgaWYgKHRoaXMuX2lzVmFsMUluUmFuZ2UodmFsKSkge1xuICAgICAgb25DaGFuZ2UoW3ZhbHVlMCwgdGhpcy5fcm91bmRWYWxUb1N0ZXAodmFsKV0pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBfc2V0UmFuZ2VWYWwwID0gdmFsID0+IHtcbiAgICBjb25zdCB7dmFsdWUxLCBvbkNoYW5nZX0gPSB0aGlzLnByb3BzO1xuICAgIHZhbCA9IE51bWJlcih2YWwpO1xuXG4gICAgaWYgKHRoaXMuX2lzVmFsMEluUmFuZ2UodmFsKSkge1xuICAgICAgb25DaGFuZ2UoW3RoaXMuX3JvdW5kVmFsVG9TdGVwKHZhbCksIHZhbHVlMV0pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBfcmVzaXplKCkge1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5zbGlkZXJDb250YWluZXIub2Zmc2V0V2lkdGg7XG4gICAgaWYgKHdpZHRoICE9PSB0aGlzLnN0YXRlLndpZHRoKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHt3aWR0aH0pO1xuICAgIH1cbiAgfVxuXG4gIF9yZW5kZXJJbnB1dChrZXkpIHtcbiAgICBjb25zdCBzZXRSYW5nZSA9IGtleSA9PT0gJ3ZhbHVlMCcgPyB0aGlzLl9zZXRSYW5nZVZhbDAgOiB0aGlzLl9zZXRSYW5nZVZhbDE7XG4gICAgY29uc3QgdXBkYXRlID0gZSA9PiB7XG4gICAgICBpZiAoIXNldFJhbmdlKGUudGFyZ2V0LnZhbHVlKSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtba2V5XTogdGhpcy5zdGF0ZVtrZXldfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8U2xpZGVySW5wdXRcbiAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2Utc2xpZGVyX19pbnB1dFwiXG4gICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICBpbm5lclJlZj17Y29tcCA9PiB7XG4gICAgICAgICAgdGhpc1tgaW5wdXQtJHtrZXl9YF0gPSBjb21wO1xuICAgICAgICB9fVxuICAgICAgICBpZD17YGZpbHRlci0ke2tleX1gfVxuICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZVtrZXldfVxuICAgICAgICBvbkNoYW5nZT17ZSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7W2tleV06IGUudGFyZ2V0LnZhbHVlfSk7XG4gICAgICAgIH19XG4gICAgICAgIG9uS2V5UHJlc3M9e2UgPT4ge1xuICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgdXBkYXRlKGUpO1xuICAgICAgICAgICAgdGhpc1tgaW5wdXQtJHtrZXl9YF0uYmx1cigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfX1cbiAgICAgICAgb25CbHVyPXt1cGRhdGV9XG4gICAgICAgIGZsdXNoPXtrZXkgPT09ICd2YWx1ZTAnfVxuICAgICAgICBzZWNvbmRhcnk9e3RoaXMucHJvcHMuaW5wdXRUaGVtZSA9PT0gJ3NlY29uZGFyeSd9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgaXNSYW5nZWQsXG4gICAgICBzaG93SW5wdXQsXG4gICAgICBoaXN0b2dyYW0sXG4gICAgICBsaW5lQ2hhcnQsXG4gICAgICBwbG90VHlwZSxcbiAgICAgIGlzRW5sYXJnZWQsXG4gICAgICByYW5nZSxcbiAgICAgIG9uQ2hhbmdlLFxuICAgICAgdmFsdWUwLFxuICAgICAgdmFsdWUxLFxuICAgICAgc2xpZGVySGFuZGxlV2lkdGhcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMucHJvcHMueEF4aXMgPyAnMjRweCcgOiAnMTZweCc7XG4gICAgY29uc3Qge3dpZHRofSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgcGxvdFdpZHRoID0gIHdpZHRoIC0gc2xpZGVySGFuZGxlV2lkdGg7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyYW5nZS1zbGlkZXJcIiBzdHlsZT17e3dpZHRoOiAnMTAwJScsIHBhZGRpbmc6ICcwIDZweCd9fVxuICAgICAgICAgcmVmPXtjb21wID0+IHtcbiAgICAgICAgICAgdGhpcy5zbGlkZXJDb250YWluZXIgPSBjb21wO1xuICAgICAgICAgfX0+XG4gICAgICAgIHtoaXN0b2dyYW0gJiYgaGlzdG9ncmFtLmxlbmd0aCA/IChcbiAgICAgICAgICA8UmFuZ2VQbG90XG4gICAgICAgICAgICBoaXN0b2dyYW09e2hpc3RvZ3JhbX1cbiAgICAgICAgICAgIGxpbmVDaGFydD17bGluZUNoYXJ0fVxuICAgICAgICAgICAgcGxvdFR5cGU9e3Bsb3RUeXBlfVxuICAgICAgICAgICAgaXNFbmxhcmdlZD17aXNFbmxhcmdlZH1cbiAgICAgICAgICAgIG9uQnJ1c2g9eyh2YWwwLCB2YWwxKSA9PiB7XG4gICAgICAgICAgICAgIG9uQ2hhbmdlKFtcbiAgICAgICAgICAgICAgICB0aGlzLl9yb3VuZFZhbFRvU3RlcCh2YWwwKSxcbiAgICAgICAgICAgICAgICB0aGlzLl9yb3VuZFZhbFRvU3RlcCh2YWwxKVxuICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICByYW5nZT17cmFuZ2V9XG4gICAgICAgICAgICB2YWx1ZT17W3ZhbHVlMCwgdmFsdWUxXX1cbiAgICAgICAgICAgIHdpZHRoPXtwbG90V2lkdGh9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDxTbGlkZXJXcmFwcGVyXG4gICAgICAgICAgc3R5bGU9e3toZWlnaHR9fVxuICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLXNsaWRlcl9fc2xpZGVyXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMueEF4aXMgPyA8dGhpcy5wcm9wcy54QXhpcyB3aWR0aD17cGxvdFdpZHRofSBkb21haW49e3JhbmdlfS8+IDogbnVsbH1cbiAgICAgICAgICA8U2xpZGVyXG4gICAgICAgICAgICBzaG93VmFsdWVzPXtmYWxzZX1cbiAgICAgICAgICAgIGlzUmFuZ2VkPXtpc1JhbmdlZH1cbiAgICAgICAgICAgIG1pblZhbHVlPXtyYW5nZVswXX1cbiAgICAgICAgICAgIG1heFZhbHVlPXtyYW5nZVsxXX1cbiAgICAgICAgICAgIHZhbHVlMD17dmFsdWUwfVxuICAgICAgICAgICAgdmFsdWUxPXt2YWx1ZTF9XG4gICAgICAgICAgICBoYW5kbGVXaWR0aD17c2xpZGVySGFuZGxlV2lkdGh9XG4gICAgICAgICAgICBvblNsaWRlcjBDaGFuZ2U9e3RoaXMuX3NldFJhbmdlVmFsMH1cbiAgICAgICAgICAgIG9uU2xpZGVyMUNoYW5nZT17dGhpcy5fc2V0UmFuZ2VWYWwxfVxuICAgICAgICAgICAgb25TbGlkZXJCYXJDaGFuZ2U9eyh2YWwwLCB2YWwxKSA9PiB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLl9pc1ZhbDFJblJhbmdlKHZhbDEpICYmIHRoaXMuX2lzVmFsMEluUmFuZ2UodmFsMCkpIHtcbiAgICAgICAgICAgICAgICBvbkNoYW5nZShbXG4gICAgICAgICAgICAgICAgICB0aGlzLl9yb3VuZFZhbFRvU3RlcCh2YWwwKSxcbiAgICAgICAgICAgICAgICAgIHRoaXMuX3JvdW5kVmFsVG9TdGVwKHZhbDEpXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBlbmFibGVCYXJEcmFnXG4gICAgICAgICAgLz5cbiAgICAgICAgICB7IWlzUmFuZ2VkICYmIHNob3dJbnB1dCA/IHRoaXMuX3JlbmRlcklucHV0KCd2YWx1ZTEnKSA6IG51bGx9XG4gICAgICAgIDwvU2xpZGVyV3JhcHBlcj5cbiAgICAgICAge2lzUmFuZ2VkICYmIHNob3dJbnB1dCA/IDxSYW5nZUlucHV0V3JhcHBlciBjbGFzc05hbWU9XCJyYW5nZS1zbGlkZXJfX2lucHV0LWdyb3VwXCI+XG4gICAgICAgICAge3RoaXMuX3JlbmRlcklucHV0KCd2YWx1ZTAnKX1cbiAgICAgICAgICB7dGhpcy5fcmVuZGVySW5wdXQoJ3ZhbHVlMScpfVxuICAgICAgICA8L1JhbmdlSW5wdXRXcmFwcGVyPiA6IG51bGx9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblJhbmdlU2xpZGVyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblJhbmdlU2xpZGVyLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==