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

var _class, _temp, _initialiseProps; /** @jsx createElement */


var _reactStylematic = require('react-stylematic');

var _reactStylematic2 = _interopRequireDefault(_reactStylematic);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactSlider = require('@uber/react-slider');

var _dataUtils = require('../../utils/data-utils');

var _rangePlot = require('./range-plot');

var _rangePlot2 = _interopRequireDefault(_rangePlot);

var _sidePanel = require('../../styles/side-panel');

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
  step: _propTypes2.default.number,
  width: _propTypes2.default.number,
  xAxis: _propTypes2.default.element
};

var RangeSlider = (_temp = _class = function (_Component) {
  (0, _inherits3.default)(RangeSlider, _Component);

  function RangeSlider(props) {
    (0, _classCallCheck3.default)(this, RangeSlider);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));

    _initialiseProps.call(_this);

    _this.state = { value0: 0, value1: 1 };
    return _this;
  }

  RangeSlider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this._setValueFromProps(nextProps);
  };

  RangeSlider.prototype.componentDidMount = function componentDidMount() {
    this._setValueFromProps(this.props);
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
        xAxis = _props.xAxis;

    var height = xAxis ? '24px' : '16px';
    return (0, _reactStylematic2.default)(
      'div',
      { style: { height: height, marginTop: '-25px', position: 'relative' } },
      xAxis,
      (0, _reactStylematic2.default)(_reactSlider.Slider, {
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
      })
    );
  };

  RangeSlider.prototype._renderInput = function _renderInput(key) {
    var _this3 = this;

    var type = 'text-input';
    var setRange = key === 'value0' ? this._setRangeVal0 : this._setRangeVal1;
    var update = function update(e) {
      if (!setRange(e.target.value)) {
        var _this3$setState;

        _this3.setState((_this3$setState = {}, _this3$setState[key] = _this3.state[key], _this3$setState));
      }
    };

    return (0, _reactStylematic2.default)('input', {
      className: type + ' ' + type + '--small dark dark-primary',
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
      onBlur: update });
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


    return (0, _reactStylematic2.default)(
      'div',
      null,
      histogram && histogram.length ? (0, _reactStylematic2.default)(_rangePlot2.default, {
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
      (0, _reactStylematic2.default)(
        'div',
        { style: _sidePanel.inputs },
        isRanged && showInput && this._renderInput('value0'),
        showInput && this._renderInput('value1')
      )
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1zbGlkZXIuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwibWluVmFsdWUiLCJudW1iZXIiLCJpc1JlcXVpcmVkIiwibWF4VmFsdWUiLCJ2YWx1ZTAiLCJ2YWx1ZTEiLCJvbkNoYW5nZSIsImZ1bmMiLCJoaXN0b2dyYW0iLCJhcnJheSIsImlzUmFuZ2VkIiwiYm9vbCIsImlzRW5sYXJnZWQiLCJzaG93SW5wdXQiLCJzdGVwIiwid2lkdGgiLCJ4QXhpcyIsImVsZW1lbnQiLCJSYW5nZVNsaWRlciIsInByb3BzIiwic3RhdGUiLCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIiwibmV4dFByb3BzIiwiX3NldFZhbHVlRnJvbVByb3BzIiwiY29tcG9uZW50RGlkTW91bnQiLCJfcmVuZGVyU2xpZGVyIiwiaGVpZ2h0IiwibWFyZ2luVG9wIiwicG9zaXRpb24iLCJfc2V0UmFuZ2VWYWwwIiwiX3NldFJhbmdlVmFsMSIsInZhbDAiLCJ2YWwxIiwiX2lzVmFsMUluUmFuZ2UiLCJfaXNWYWwwSW5SYW5nZSIsIl9yb3VuZFZhbFRvU3RlcCIsIl9yZW5kZXJJbnB1dCIsImtleSIsInR5cGUiLCJzZXRSYW5nZSIsInVwZGF0ZSIsImUiLCJ0YXJnZXQiLCJ2YWx1ZSIsInNldFN0YXRlIiwicmVuZGVyIiwibGluZUNoYXJ0IiwicGxvdFR5cGUiLCJsZW5ndGgiLCJpc05hTiIsInZhbCIsIkJvb2xlYW4iLCJOdW1iZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUNBQUE7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxZQUFZO0FBQ2hCQyxZQUFVLG9CQUFVQyxNQUFWLENBQWlCQyxVQURYO0FBRWhCQyxZQUFVLG9CQUFVRixNQUFWLENBQWlCQyxVQUZYO0FBR2hCRSxVQUFRLG9CQUFVSCxNQUFWLENBQWlCQyxVQUhUO0FB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QUNSYyxJQURRLFdBQ1JBLElBRFE7OztBQUd6QixXQUFPLCtCQUFlZCxRQUFmLEVBQXlCYyxJQUF6QixFQUErQm9DLEdBQS9CLENBQVA7QUFDRCxHOztPQUVEcEIsYSxHQUFnQixVQUFDb0IsR0FBRCxFQUFTO0FBQUEsa0JBQ0ksT0FBSy9CLEtBRFQ7QUFBQSxRQUNoQmYsTUFEZ0IsV0FDaEJBLE1BRGdCO0FBQUEsUUFDUkUsUUFEUSxXQUNSQSxRQURROztBQUV2QjRDLFVBQU1FLE9BQU9GLEdBQVAsQ0FBTjs7QUFFQSxRQUFJLE9BQUtqQixjQUFMLENBQW9CaUIsR0FBcEIsQ0FBSixFQUE4QjtBQUM1QjVDLGVBQVMsQ0FBQ0YsTUFBRCxFQUFTLE9BQUsrQixlQUFMLENBQXFCZSxHQUFyQixDQUFULENBQVQ7QUFDQSxhQUFPLElBQVA7QUFDRDtBQUNELFdBQU8sS0FBUDtBQUNELEc7O09BRURyQixhLEdBQWdCLFVBQUNxQixHQUFELEVBQVM7QUFBQSxrQkFDSSxPQUFLL0IsS0FEVDtBQUFBLFFBQ2hCZCxNQURnQixXQUNoQkEsTUFEZ0I7QUFBQSxRQUNSQyxRQURRLFdBQ1JBLFFBRFE7O0FBRXZCNEMsVUFBTUUsT0FBT0YsR0FBUCxDQUFOOztBQUVBLFFBQUksT0FBS2hCLGNBQUwsQ0FBb0JnQixHQUFwQixDQUFKLEVBQThCO0FBQzVCNUMsZUFBUyxDQUFDLE9BQUs2QixlQUFMLENBQXFCZSxHQUFyQixDQUFELEVBQTRCN0MsTUFBNUIsQ0FBVDtBQUNBLGFBQU8sSUFBUDtBQUNEO0FBQ0QsV0FBTyxLQUFQO0FBQ0QsRzs7a0JBNURrQmEsVzs7O0FBa0pyQkEsWUFBWW5CLFNBQVosR0FBd0JBLFNBQXhCIiwiZmlsZSI6InJhbmdlLXNsaWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IGNyZWF0ZUVsZW1lbnQgKi9cbmltcG9ydCBjcmVhdGVFbGVtZW50IGZyb20gJ3JlYWN0LXN0eWxlbWF0aWMnO1xuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtTbGlkZXJ9IGZyb20gJ0B1YmVyL3JlYWN0LXNsaWRlcic7XG5pbXBvcnQge3JvdW5kVmFsVG9TdGVwfSBmcm9tICd1dGlscy9kYXRhLXV0aWxzJztcbmltcG9ydCBSYW5nZVBsb3QgZnJvbSAnLi9yYW5nZS1wbG90JztcbmltcG9ydCB7aW5wdXRzfSBmcm9tICdzdHlsZXMvc2lkZS1wYW5lbCc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgbWluVmFsdWU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgbWF4VmFsdWU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgdmFsdWUwOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHZhbHVlMTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaGlzdG9ncmFtOiBQcm9wVHlwZXMuYXJyYXksXG4gIGlzUmFuZ2VkOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNFbmxhcmdlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHNob3dJbnB1dDogUHJvcFR5cGVzLmJvb2wsXG4gIHN0ZXA6IFByb3BUeXBlcy5udW1iZXIsXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICB4QXhpczogUHJvcFR5cGVzLmVsZW1lbnRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJhbmdlU2xpZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHt2YWx1ZTA6IDAsIHZhbHVlMTogMX07XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIHRoaXMuX3NldFZhbHVlRnJvbVByb3BzKG5leHRQcm9wcyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9zZXRWYWx1ZUZyb21Qcm9wcyh0aGlzLnByb3BzKTtcbiAgfVxuXG4gIF9zZXRWYWx1ZUZyb21Qcm9wcyA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHt2YWx1ZTAsIHZhbHVlMX0gPSBwcm9wcztcblxuICAgIGlmICghaXNOYU4odmFsdWUwKSAmJiAhaXNOYU4odmFsdWUxKSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7dmFsdWUwLCB2YWx1ZTF9KTtcbiAgICB9XG4gIH07XG5cbiAgX2lzVmFsMEluUmFuZ2UgPSAodmFsKSA9PiB7XG4gICAgY29uc3Qge3ZhbHVlMSwgbWluVmFsdWV9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiBCb29sZWFuKHZhbCA+PSBtaW5WYWx1ZSAmJiB2YWwgPD0gdmFsdWUxKTtcbiAgfTtcblxuICBfaXNWYWwxSW5SYW5nZSA9ICh2YWwpID0+IHtcbiAgICBjb25zdCB7bWF4VmFsdWUsIHZhbHVlMH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIEJvb2xlYW4odmFsIDw9IG1heFZhbHVlICYmIHZhbCA+PSB2YWx1ZTApO1xuICB9O1xuXG4gIF9yb3VuZFZhbFRvU3RlcCA9ICh2YWwpID0+IHtcbiAgICBjb25zdCB7bWluVmFsdWUsIHN0ZXB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiByb3VuZFZhbFRvU3RlcChtaW5WYWx1ZSwgc3RlcCwgdmFsKTtcbiAgfTtcblxuICBfc2V0UmFuZ2VWYWwxID0gKHZhbCkgPT4ge1xuICAgIGNvbnN0IHt2YWx1ZTAsIG9uQ2hhbmdlfSA9IHRoaXMucHJvcHM7XG4gICAgdmFsID0gTnVtYmVyKHZhbCk7XG5cbiAgICBpZiAodGhpcy5faXNWYWwxSW5SYW5nZSh2YWwpKSB7XG4gICAgICBvbkNoYW5nZShbdmFsdWUwLCB0aGlzLl9yb3VuZFZhbFRvU3RlcCh2YWwpXSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIF9zZXRSYW5nZVZhbDAgPSAodmFsKSA9PiB7XG4gICAgY29uc3Qge3ZhbHVlMSwgb25DaGFuZ2V9ID0gdGhpcy5wcm9wcztcbiAgICB2YWwgPSBOdW1iZXIodmFsKTtcblxuICAgIGlmICh0aGlzLl9pc1ZhbDBJblJhbmdlKHZhbCkpIHtcbiAgICAgIG9uQ2hhbmdlKFt0aGlzLl9yb3VuZFZhbFRvU3RlcCh2YWwpLCB2YWx1ZTFdKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgX3JlbmRlclNsaWRlcigpIHtcbiAgICBjb25zdCB7aXNSYW5nZWQsIG1pblZhbHVlLCBtYXhWYWx1ZSwgb25DaGFuZ2UsIHZhbHVlMCwgdmFsdWUxLCB4QXhpc30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGhlaWdodCA9IHhBeGlzID8gJzI0cHgnIDogJzE2cHgnO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7aGVpZ2h0LCBtYXJnaW5Ub3A6ICctMjVweCcsIHBvc2l0aW9uOiAncmVsYXRpdmUnfX0+XG4gICAgICAgIHt4QXhpc31cbiAgICAgICAgPFNsaWRlclxuICAgICAgICAgIHNob3dWYWx1ZXM9e2ZhbHNlfVxuICAgICAgICAgIGlzUmFuZ2VkPXtpc1JhbmdlZH1cbiAgICAgICAgICBlbmFibGVCYXJEcmFnPXt0cnVlfVxuICAgICAgICAgIG1pblZhbHVlPXttaW5WYWx1ZX1cbiAgICAgICAgICBtYXhWYWx1ZT17bWF4VmFsdWV9XG4gICAgICAgICAgdmFsdWUwPXt2YWx1ZTB9XG4gICAgICAgICAgdmFsdWUxPXt2YWx1ZTF9XG4gICAgICAgICAgb25TbGlkZXIwQ2hhbmdlPXt0aGlzLl9zZXRSYW5nZVZhbDB9XG4gICAgICAgICAgb25TbGlkZXIxQ2hhbmdlPXt0aGlzLl9zZXRSYW5nZVZhbDF9XG4gICAgICAgICAgb25TbGlkZXJCYXJDaGFuZ2U9eyh2YWwwLCB2YWwxKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5faXNWYWwxSW5SYW5nZSh2YWwxKSAmJiB0aGlzLl9pc1ZhbDBJblJhbmdlKHZhbDApKSB7XG4gICAgICAgICAgICAgIG9uQ2hhbmdlKFt0aGlzLl9yb3VuZFZhbFRvU3RlcCh2YWwwKSwgdGhpcy5fcm91bmRWYWxUb1N0ZXAodmFsMSldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIF9yZW5kZXJJbnB1dChrZXkpIHtcbiAgICBjb25zdCB0eXBlID0gJ3RleHQtaW5wdXQnO1xuICAgIGNvbnN0IHNldFJhbmdlID0ga2V5ID09PSAndmFsdWUwJyA/IHRoaXMuX3NldFJhbmdlVmFsMCA6IHRoaXMuX3NldFJhbmdlVmFsMTtcbiAgICBjb25zdCB1cGRhdGUgPSAoZSkgPT4ge1xuICAgICAgaWYgKCFzZXRSYW5nZShlLnRhcmdldC52YWx1ZSkpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7W2tleV06IHRoaXMuc3RhdGVba2V5XX0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGlucHV0XG4gICAgICAgIGNsYXNzTmFtZT17YCR7dHlwZX0gJHt0eXBlfS0tc21hbGwgZGFyayBkYXJrLXByaW1hcnlgfVxuICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgaWQ9e2BmaWx0ZXItJHtrZXl9YH1cbiAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGVba2V5XX1cbiAgICAgICAgb25DaGFuZ2U9e2UgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1trZXldOiBlLnRhcmdldC52YWx1ZX0pO1xuICAgICAgICB9fVxuICAgICAgICBvbktleVByZXNzPXtlID0+IHtcbiAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIHVwZGF0ZShlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIG9uQmx1cj17dXBkYXRlfT5cbiAgICAgIDwvaW5wdXQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7aXNSYW5nZWQsIHNob3dJbnB1dCwgIGhpc3RvZ3JhbSwgbGluZUNoYXJ0LCBwbG90VHlwZSxcbiAgICAgIGlzRW5sYXJnZWQsIG1heFZhbHVlLCBtaW5WYWx1ZSwgb25DaGFuZ2UsIHZhbHVlMCwgdmFsdWUxLCB3aWR0aH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIHtoaXN0b2dyYW0gJiYgaGlzdG9ncmFtLmxlbmd0aCA/XG4gICAgICAgICAgPFJhbmdlUGxvdFxuICAgICAgICAgICAgaGlzdG9ncmFtPXtoaXN0b2dyYW19XG4gICAgICAgICAgICBsaW5lQ2hhcnQ9e2xpbmVDaGFydH1cbiAgICAgICAgICAgIHBsb3RUeXBlPXtwbG90VHlwZX1cbiAgICAgICAgICAgIGlzRW5sYXJnZWQ9e2lzRW5sYXJnZWR9XG4gICAgICAgICAgICBvbkJydXNoPXsodmFsMCwgdmFsMSkgPT4ge1xuICAgICAgICAgICAgICBvbkNoYW5nZShbdGhpcy5fcm91bmRWYWxUb1N0ZXAodmFsMCksIHRoaXMuX3JvdW5kVmFsVG9TdGVwKHZhbDEpXSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgcmFuZ2U9e1ttaW5WYWx1ZSwgbWF4VmFsdWVdfVxuICAgICAgICAgICAgdmFsdWU9e1t2YWx1ZTAsIHZhbHVlMV19XG4gICAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgLz4gOiBudWxsXG4gICAgICAgIH1cbiAgICAgICAge3RoaXMuX3JlbmRlclNsaWRlcigpfVxuICAgICAgICA8ZGl2IHN0eWxlPXtpbnB1dHN9PlxuICAgICAgICAgIHtpc1JhbmdlZCAmJiBzaG93SW5wdXQgJiYgdGhpcy5fcmVuZGVySW5wdXQoJ3ZhbHVlMCcpfVxuICAgICAgICAgIHtzaG93SW5wdXQgJiYgdGhpcy5fcmVuZGVySW5wdXQoJ3ZhbHVlMScpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuUmFuZ2VTbGlkZXIucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuIl19