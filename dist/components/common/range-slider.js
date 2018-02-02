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

var _class, _temp, _initialiseProps;

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  height: 24px;\n  width: 40px;\n  padding: 4px 6px;\n  margin-left: ', 'px;\n'], ['\n  height: 24px;\n  width: 40px;\n  padding: 4px 6px;\n  margin-left: ', 'px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: flex;\n  position: relative;\n'], ['\n  display: flex;\n  position: relative;\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-top: 6px;\n  display: flex;\n  justify-content: space-between;\n'], ['\n  margin-top: 6px;\n  display: flex;\n  justify-content: space-between;\n']);

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
  minValue: _propTypes2.default.number.isRequired,
  maxValue: _propTypes2.default.number.isRequired,
  value0: _propTypes2.default.number.isRequired,
  value1: _propTypes2.default.number.isRequired,
  onChange: _propTypes2.default.func.isRequired,
  histogram: _propTypes2.default.array,
  isRanged: _propTypes2.default.bool,
  isEnlarged: _propTypes2.default.bool,
  showInput: _propTypes2.default.bool,
  inputTheme: _propTypes2.default.string,
  step: _propTypes2.default.number,
  width: _propTypes2.default.number,
  xAxis: _propTypes2.default.element
};

var SliderInput = _styledComponents3.Input.extend(_templateObject, function (props) {
  return props.flush ? 0 : 12;
});

var SliderWrapper = _styledComponents2.default.div(_templateObject2);

var RangeInputWrapper = _styledComponents2.default.div(_templateObject3);

var RangeSlider = (_temp = _class = function (_Component) {
  (0, _inherits3.default)(RangeSlider, _Component);

  function RangeSlider(props) {
    (0, _classCallCheck3.default)(this, RangeSlider);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

    _initialiseProps.call(_this);

    _this.state = { value0: 0, value1: 1 };
    return _this;
  }

  RangeSlider.prototype.componentDidMount = function componentDidMount() {
    this._setValueFromProps(this.props);
  };

  RangeSlider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this._setValueFromProps(nextProps);
  };

  RangeSlider.prototype._renderSlider = function _renderSlider() {
    var _this2 = this;

    var _props = this.props,
        isRanged = _props.isRanged,
        minValue = _props.minValue,
        maxValue = _props.maxValue,
        onChange = _props.onChange,
        value0 = _props.value0,
        value1 = _props.value1,
        xAxis = _props.xAxis,
        showInput = _props.showInput;

    var height = xAxis ? '24px' : '16px';
    return _react2.default.createElement(
      SliderWrapper,
      { style: { height: height }, className: 'range-slider__slider' },
      xAxis,
      _react2.default.createElement(_slider2.default, {
        showValues: false,
        isRanged: isRanged,
        enableBarDrag: true,
        minValue: minValue,
        maxValue: maxValue,
        value0: value0,
        value1: value1,
        onSlider0Change: this._setRangeVal0,
        onSlider1Change: this._setRangeVal1,
        onSliderBarChange: function onSliderBarChange(val0, val1) {
          if (_this2._isVal1InRange(val1) && _this2._isVal0InRange(val0)) {
            onChange([_this2._roundValToStep(val0), _this2._roundValToStep(val1)]);
          }
        }
      }),
      !isRanged && showInput ? this._renderInput('value1') : null
    );
  };

  RangeSlider.prototype._renderInput = function _renderInput(key) {
    var _this3 = this;

    var setRange = key === 'value0' ? this._setRangeVal0 : this._setRangeVal1;
    var update = function update(e) {
      if (!setRange(e.target.value)) {
        var _this3$setState;

        _this3.setState((_this3$setState = {}, _this3$setState[key] = _this3.state[key], _this3$setState));
      }
    };

    return _react2.default.createElement(SliderInput, {
      className: 'range-slider__input',
      type: 'number',
      id: 'filter-' + key,
      value: this.state[key],
      onChange: function onChange(e) {
        var _this3$setState2;

        _this3.setState((_this3$setState2 = {}, _this3$setState2[key] = e.target.value, _this3$setState2));
      },
      onKeyPress: function onKeyPress(e) {
        if (e.key === 'Enter') {
          update(e);
        }
      },
      onBlur: update,
      flush: key === 'value0',
      secondary: this.props.inputTheme === 'secondary'
    });
  };

  RangeSlider.prototype.render = function render() {
    var _this4 = this;

    var _props2 = this.props,
        isRanged = _props2.isRanged,
        showInput = _props2.showInput,
        histogram = _props2.histogram,
        lineChart = _props2.lineChart,
        plotType = _props2.plotType,
        isEnlarged = _props2.isEnlarged,
        maxValue = _props2.maxValue,
        minValue = _props2.minValue,
        onChange = _props2.onChange,
        value0 = _props2.value0,
        value1 = _props2.value1,
        width = _props2.width;


    return _react2.default.createElement(
      'div',
      { className: 'range-slider' },
      histogram && histogram.length ? _react2.default.createElement(_rangePlot2.default, {
        histogram: histogram,
        lineChart: lineChart,
        plotType: plotType,
        isEnlarged: isEnlarged,
        onBrush: function onBrush(val0, val1) {
          onChange([_this4._roundValToStep(val0), _this4._roundValToStep(val1)]);
        },
        range: [minValue, maxValue],
        value: [value0, value1],
        width: width
      }) : null,
      this._renderSlider(),
      isRanged && showInput ? _react2.default.createElement(
        RangeInputWrapper,
        { className: 'range-slider__input-group' },
        this._renderInput('value0'),
        this._renderInput('value1')
      ) : null
    );
  };

  return RangeSlider;
}(_react.Component), _initialiseProps = function _initialiseProps() {
  var _this5 = this;

  this._setValueFromProps = function (props) {
    var value0 = props.value0,
        value1 = props.value1;


    if (!isNaN(value0) && !isNaN(value1)) {
      _this5.setState({ value0: value0, value1: value1 });
    }
  };

  this._isVal0InRange = function (val) {
    var _props3 = _this5.props,
        value1 = _props3.value1,
        minValue = _props3.minValue;


    return Boolean(val >= minValue && val <= value1);
  };

  this._isVal1InRange = function (val) {
    var _props4 = _this5.props,
        maxValue = _props4.maxValue,
        value0 = _props4.value0;


    return Boolean(val <= maxValue && val >= value0);
  };

  this._roundValToStep = function (val) {
    var _props5 = _this5.props,
        minValue = _props5.minValue,
        step = _props5.step;


    return (0, _dataUtils.roundValToStep)(minValue, step, val);
  };

  this._setRangeVal1 = function (val) {
    var _props6 = _this5.props,
        value0 = _props6.value0,
        onChange = _props6.onChange;

    val = Number(val);

    if (_this5._isVal1InRange(val)) {
      onChange([value0, _this5._roundValToStep(val)]);
      return true;
    }
    return false;
  };

  this._setRangeVal0 = function (val) {
    var _props7 = _this5.props,
        value1 = _props7.value1,
        onChange = _props7.onChange;

    val = Number(val);

    if (_this5._isVal0InRange(val)) {
      onChange([_this5._roundValToStep(val), value1]);
      return true;
    }
    return false;
  };
}, _temp);
exports.default = RangeSlider;


RangeSlider.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1zbGlkZXIuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwibWluVmFsdWUiLCJudW1iZXIiLCJpc1JlcXVpcmVkIiwibWF4VmFsdWUiLCJ2YWx1ZTAiLCJ2YWx1ZTEiLCJvbkNoYW5nZSIsImZ1bmMiLCJoaXN0b2dyYW0iLCJhcnJheSIsImlzUmFuZ2VkIiwiYm9vbCIsImlzRW5sYXJnZWQiLCJzaG93SW5wdXQiLCJpbnB1dFRoZW1lIiwic3RyaW5nIiwic3RlcCIsIndpZHRoIiwieEF4aXMiLCJlbGVtZW50IiwiU2xpZGVySW5wdXQiLCJleHRlbmQiLCJwcm9wcyIsImZsdXNoIiwiU2xpZGVyV3JhcHBlciIsImRpdiIsIlJhbmdlSW5wdXRXcmFwcGVyIiwiUmFuZ2VTbGlkZXIiLCJzdGF0ZSIsImNvbXBvbmVudERpZE1vdW50IiwiX3NldFZhbHVlRnJvbVByb3BzIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsIl9yZW5kZXJTbGlkZXIiLCJoZWlnaHQiLCJfc2V0UmFuZ2VWYWwwIiwiX3NldFJhbmdlVmFsMSIsInZhbDAiLCJ2YWwxIiwiX2lzVmFsMUluUmFuZ2UiLCJfaXNWYWwwSW5SYW5nZSIsIl9yb3VuZFZhbFRvU3RlcCIsIl9yZW5kZXJJbnB1dCIsImtleSIsInNldFJhbmdlIiwidXBkYXRlIiwiZSIsInRhcmdldCIsInZhbHVlIiwic2V0U3RhdGUiLCJyZW5kZXIiLCJsaW5lQ2hhcnQiLCJwbG90VHlwZSIsImxlbmd0aCIsImlzTmFOIiwiQm9vbGVhbiIsInZhbCIsIk51bWJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxZQUFVLG9CQUFVQyxNQUFWLENBQWlCQyxVQURYO0FBRWhC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S21DLGVBQUwsQ0FBcUJlLEdBQXJCLENBQUQsRUFBNEJuRCxNQUE1QixDQUFUO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7QUFDRCxXQUFPLEtBQVA7QUFDRCxHOztrQkE1RGtCc0IsVzs7O0FBK0tyQkEsWUFBWTVCLFNBQVosR0FBd0JBLFNBQXhCIiwiZmlsZSI6InJhbmdlLXNsaWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgUmFuZ2VQbG90IGZyb20gJy4vcmFuZ2UtcGxvdCc7XG5pbXBvcnQgU2xpZGVyIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3NsaWRlci9zbGlkZXInO1xuaW1wb3J0IHtJbnB1dCwgU2Vjb25kYXJ5SW5wdXR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IHtyb3VuZFZhbFRvU3RlcH0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgbWluVmFsdWU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgbWF4VmFsdWU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgdmFsdWUwOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHZhbHVlMTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaGlzdG9ncmFtOiBQcm9wVHlwZXMuYXJyYXksXG4gIGlzUmFuZ2VkOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNFbmxhcmdlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHNob3dJbnB1dDogUHJvcFR5cGVzLmJvb2wsXG4gIGlucHV0VGhlbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHN0ZXA6IFByb3BUeXBlcy5udW1iZXIsXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICB4QXhpczogUHJvcFR5cGVzLmVsZW1lbnRcbn07XG5cbmNvbnN0IFNsaWRlcklucHV0ID0gSW5wdXQuZXh0ZW5kYFxuICBoZWlnaHQ6IDI0cHg7XG4gIHdpZHRoOiA0MHB4O1xuICBwYWRkaW5nOiA0cHggNnB4O1xuICBtYXJnaW4tbGVmdDogJHtwcm9wcyA9PiBwcm9wcy5mbHVzaCA/IDAgOiAxMn1weDtcbmA7XG5cbmNvbnN0IFNsaWRlcldyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5gO1xuXG5jb25zdCBSYW5nZUlucHV0V3JhcHBlciA9c3R5bGVkLmRpdmBcbiAgbWFyZ2luLXRvcDogNnB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYW5nZVNsaWRlciBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7dmFsdWUwOiAwLCB2YWx1ZTE6IDF9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fc2V0VmFsdWVGcm9tUHJvcHModGhpcy5wcm9wcyk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIHRoaXMuX3NldFZhbHVlRnJvbVByb3BzKG5leHRQcm9wcyk7XG4gIH1cblxuICBfc2V0VmFsdWVGcm9tUHJvcHMgPSBwcm9wcyA9PiB7XG4gICAgY29uc3Qge3ZhbHVlMCwgdmFsdWUxfSA9IHByb3BzO1xuXG4gICAgaWYgKCFpc05hTih2YWx1ZTApICYmICFpc05hTih2YWx1ZTEpKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHt2YWx1ZTAsIHZhbHVlMX0pO1xuICAgIH1cbiAgfTtcblxuICBfaXNWYWwwSW5SYW5nZSA9IHZhbCA9PiB7XG4gICAgY29uc3Qge3ZhbHVlMSwgbWluVmFsdWV9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiBCb29sZWFuKHZhbCA+PSBtaW5WYWx1ZSAmJiB2YWwgPD0gdmFsdWUxKTtcbiAgfTtcblxuICBfaXNWYWwxSW5SYW5nZSA9IHZhbCA9PiB7XG4gICAgY29uc3Qge21heFZhbHVlLCB2YWx1ZTB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiBCb29sZWFuKHZhbCA8PSBtYXhWYWx1ZSAmJiB2YWwgPj0gdmFsdWUwKTtcbiAgfTtcblxuICBfcm91bmRWYWxUb1N0ZXAgPSB2YWwgPT4ge1xuICAgIGNvbnN0IHttaW5WYWx1ZSwgc3RlcH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIHJvdW5kVmFsVG9TdGVwKG1pblZhbHVlLCBzdGVwLCB2YWwpO1xuICB9O1xuXG4gIF9zZXRSYW5nZVZhbDEgPSB2YWwgPT4ge1xuICAgIGNvbnN0IHt2YWx1ZTAsIG9uQ2hhbmdlfSA9IHRoaXMucHJvcHM7XG4gICAgdmFsID0gTnVtYmVyKHZhbCk7XG5cbiAgICBpZiAodGhpcy5faXNWYWwxSW5SYW5nZSh2YWwpKSB7XG4gICAgICBvbkNoYW5nZShbdmFsdWUwLCB0aGlzLl9yb3VuZFZhbFRvU3RlcCh2YWwpXSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIF9zZXRSYW5nZVZhbDAgPSB2YWwgPT4ge1xuICAgIGNvbnN0IHt2YWx1ZTEsIG9uQ2hhbmdlfSA9IHRoaXMucHJvcHM7XG4gICAgdmFsID0gTnVtYmVyKHZhbCk7XG5cbiAgICBpZiAodGhpcy5faXNWYWwwSW5SYW5nZSh2YWwpKSB7XG4gICAgICBvbkNoYW5nZShbdGhpcy5fcm91bmRWYWxUb1N0ZXAodmFsKSwgdmFsdWUxXSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIF9yZW5kZXJTbGlkZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgaXNSYW5nZWQsXG4gICAgICBtaW5WYWx1ZSxcbiAgICAgIG1heFZhbHVlLFxuICAgICAgb25DaGFuZ2UsXG4gICAgICB2YWx1ZTAsXG4gICAgICB2YWx1ZTEsXG4gICAgICB4QXhpcyxcbiAgICAgIHNob3dJbnB1dFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGhlaWdodCA9IHhBeGlzID8gJzI0cHgnIDogJzE2cHgnO1xuICAgIHJldHVybiAoXG4gICAgICA8U2xpZGVyV3JhcHBlciBzdHlsZT17e2hlaWdodH19IGNsYXNzTmFtZT1cInJhbmdlLXNsaWRlcl9fc2xpZGVyXCI+XG4gICAgICAgIHt4QXhpc31cbiAgICAgICAgPFNsaWRlclxuICAgICAgICAgIHNob3dWYWx1ZXM9e2ZhbHNlfVxuICAgICAgICAgIGlzUmFuZ2VkPXtpc1JhbmdlZH1cbiAgICAgICAgICBlbmFibGVCYXJEcmFnPXt0cnVlfVxuICAgICAgICAgIG1pblZhbHVlPXttaW5WYWx1ZX1cbiAgICAgICAgICBtYXhWYWx1ZT17bWF4VmFsdWV9XG4gICAgICAgICAgdmFsdWUwPXt2YWx1ZTB9XG4gICAgICAgICAgdmFsdWUxPXt2YWx1ZTF9XG4gICAgICAgICAgb25TbGlkZXIwQ2hhbmdlPXt0aGlzLl9zZXRSYW5nZVZhbDB9XG4gICAgICAgICAgb25TbGlkZXIxQ2hhbmdlPXt0aGlzLl9zZXRSYW5nZVZhbDF9XG4gICAgICAgICAgb25TbGlkZXJCYXJDaGFuZ2U9eyh2YWwwLCB2YWwxKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5faXNWYWwxSW5SYW5nZSh2YWwxKSAmJiB0aGlzLl9pc1ZhbDBJblJhbmdlKHZhbDApKSB7XG4gICAgICAgICAgICAgIG9uQ2hhbmdlKFtcbiAgICAgICAgICAgICAgICB0aGlzLl9yb3VuZFZhbFRvU3RlcCh2YWwwKSxcbiAgICAgICAgICAgICAgICB0aGlzLl9yb3VuZFZhbFRvU3RlcCh2YWwxKVxuICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICB7IWlzUmFuZ2VkICYmIHNob3dJbnB1dCA/IHRoaXMuX3JlbmRlcklucHV0KCd2YWx1ZTEnKSA6IG51bGx9XG4gICAgICA8L1NsaWRlcldyYXBwZXI+XG4gICAgKTtcbiAgfVxuXG4gIF9yZW5kZXJJbnB1dChrZXkpIHtcbiAgICBjb25zdCBzZXRSYW5nZSA9IGtleSA9PT0gJ3ZhbHVlMCcgPyB0aGlzLl9zZXRSYW5nZVZhbDAgOiB0aGlzLl9zZXRSYW5nZVZhbDE7XG4gICAgY29uc3QgdXBkYXRlID0gZSA9PiB7XG4gICAgICBpZiAoIXNldFJhbmdlKGUudGFyZ2V0LnZhbHVlKSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtba2V5XTogdGhpcy5zdGF0ZVtrZXldfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8U2xpZGVySW5wdXRcbiAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2Utc2xpZGVyX19pbnB1dFwiXG4gICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICBpZD17YGZpbHRlci0ke2tleX1gfVxuICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZVtrZXldfVxuICAgICAgICBvbkNoYW5nZT17ZSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7W2tleV06IGUudGFyZ2V0LnZhbHVlfSk7XG4gICAgICAgIH19XG4gICAgICAgIG9uS2V5UHJlc3M9e2UgPT4ge1xuICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgdXBkYXRlKGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfX1cbiAgICAgICAgb25CbHVyPXt1cGRhdGV9XG4gICAgICAgIGZsdXNoPXtrZXkgPT09ICd2YWx1ZTAnfVxuICAgICAgICBzZWNvbmRhcnk9e3RoaXMucHJvcHMuaW5wdXRUaGVtZSA9PT0gJ3NlY29uZGFyeSd9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgaXNSYW5nZWQsXG4gICAgICBzaG93SW5wdXQsXG4gICAgICBoaXN0b2dyYW0sXG4gICAgICBsaW5lQ2hhcnQsXG4gICAgICBwbG90VHlwZSxcbiAgICAgIGlzRW5sYXJnZWQsXG4gICAgICBtYXhWYWx1ZSxcbiAgICAgIG1pblZhbHVlLFxuICAgICAgb25DaGFuZ2UsXG4gICAgICB2YWx1ZTAsXG4gICAgICB2YWx1ZTEsXG4gICAgICB3aWR0aFxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmFuZ2Utc2xpZGVyXCI+XG4gICAgICAgIHtoaXN0b2dyYW0gJiYgaGlzdG9ncmFtLmxlbmd0aCA/IChcbiAgICAgICAgICA8UmFuZ2VQbG90XG4gICAgICAgICAgICBoaXN0b2dyYW09e2hpc3RvZ3JhbX1cbiAgICAgICAgICAgIGxpbmVDaGFydD17bGluZUNoYXJ0fVxuICAgICAgICAgICAgcGxvdFR5cGU9e3Bsb3RUeXBlfVxuICAgICAgICAgICAgaXNFbmxhcmdlZD17aXNFbmxhcmdlZH1cbiAgICAgICAgICAgIG9uQnJ1c2g9eyh2YWwwLCB2YWwxKSA9PiB7XG4gICAgICAgICAgICAgIG9uQ2hhbmdlKFtcbiAgICAgICAgICAgICAgICB0aGlzLl9yb3VuZFZhbFRvU3RlcCh2YWwwKSxcbiAgICAgICAgICAgICAgICB0aGlzLl9yb3VuZFZhbFRvU3RlcCh2YWwxKVxuICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICByYW5nZT17W21pblZhbHVlLCBtYXhWYWx1ZV19XG4gICAgICAgICAgICB2YWx1ZT17W3ZhbHVlMCwgdmFsdWUxXX1cbiAgICAgICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAge3RoaXMuX3JlbmRlclNsaWRlcigpfVxuICAgICAgICB7aXNSYW5nZWQgJiYgc2hvd0lucHV0ID8gPFJhbmdlSW5wdXRXcmFwcGVyIGNsYXNzTmFtZT1cInJhbmdlLXNsaWRlcl9faW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgICB7dGhpcy5fcmVuZGVySW5wdXQoJ3ZhbHVlMCcpfVxuICAgICAgICAgIHt0aGlzLl9yZW5kZXJJbnB1dCgndmFsdWUxJyl9XG4gICAgICAgIDwvUmFuZ2VJbnB1dFdyYXBwZXI+IDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuUmFuZ2VTbGlkZXIucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuIl19