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
      onBlur: update
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1zbGlkZXIuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwibWluVmFsdWUiLCJudW1iZXIiLCJpc1JlcXVpcmVkIiwibWF4VmFsdWUiLCJ2YWx1ZTAiLCJ2YWx1ZTEiLCJvbkNoYW5nZSIsImZ1bmMiLCJoaXN0b2dyYW0iLCJhcnJheSIsImlzUmFuZ2VkIiwiYm9vbCIsImlzRW5sYXJnZWQiLCJzaG93SW5wdXQiLCJzdGVwIiwid2lkdGgiLCJ4QXhpcyIsImVsZW1lbnQiLCJSYW5nZVNsaWRlciIsInByb3BzIiwic3RhdGUiLCJjb21wb25lbnREaWRNb3VudCIsIl9zZXRWYWx1ZUZyb21Qcm9wcyIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJfcmVuZGVyU2xpZGVyIiwiaGVpZ2h0IiwibWFyZ2luVG9wIiwicG9zaXRpb24iLCJfc2V0UmFuZ2VWYWwwIiwiX3NldFJhbmdlVmFsMSIsInZhbDAiLCJ2YWwxIiwiX2lzVmFsMUluUmFuZ2UiLCJfaXNWYWwwSW5SYW5nZSIsIl9yb3VuZFZhbFRvU3RlcCIsIl9yZW5kZXJJbnB1dCIsImtleSIsInR5cGUiLCJzZXRSYW5nZSIsInVwZGF0ZSIsImUiLCJ0YXJnZXQiLCJ2YWx1ZSIsInNldFN0YXRlIiwicmVuZGVyIiwibGluZUNoYXJ0IiwicGxvdFR5cGUiLCJsZW5ndGgiLCJpc05hTiIsIkJvb2xlYW4iLCJ2YWwiLCJOdW1iZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUNBQUE7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBRUEsSUFBTUEsWUFBWTtBQUNoQkMsWUFBVSxvQkFBVUMsTUFBVixDQUFpQkMsVUFEWDtBQUVoQkMsWUFBVSxvQkFBVUYsTUFBVixDQUFpQkMsVUFGWDtBQUdoQkUsVUFBUSxvQkFBVUgsTUFBVixDQUFpQkMsVUFIVDtBQUlo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T0FBS1gsS0FEWDtBQUFBLFFBQ2RmLE1BRGMsV0FDZEEsTUFEYztBQUFBLFFBQ05FLFFBRE0sV0FDTkEsUUFETTs7QUFFckI2QyxVQUFNQyxPQUFPRCxHQUFQLENBQU47O0FBRUEsUUFBSSxPQUFLbEIsY0FBTCxDQUFvQmtCLEdBQXBCLENBQUosRUFBOEI7QUFDNUI3QyxlQUFTLENBQUNGLE1BQUQsRUFBUyxPQUFLK0IsZUFBTCxDQUFxQmdCLEdBQXJCLENBQVQsQ0FBVDtBQUNBLGFBQU8sSUFBUDtBQUNEO0FBQ0QsV0FBTyxLQUFQO0FBQ0QsRzs7T0FFRHRCLGEsR0FBZ0IsZUFBTztBQUFBLGtCQUNNLE9BQUtWLEtBRFg7QUFBQSxRQUNkZCxNQURjLFdBQ2RBLE1BRGM7QUFBQSxRQUNOQyxRQURNLFdBQ05BLFFBRE07O0FBRXJCNkMsVUFBTUMsT0FBT0QsR0FBUCxDQUFOOztBQUVBLFFBQUksT0FBS2pCLGNBQUwsQ0FBb0JpQixHQUFwQixDQUFKLEVBQThCO0FBQzVCN0MsZUFBUyxDQUFDLE9BQUs2QixlQUFMLENBQXFCZ0IsR0FBckIsQ0FBRCxFQUE0QjlDLE1BQTVCLENBQVQ7QUFDQSxhQUFPLElBQVA7QUFDRDtBQUNELFdBQU8sS0FBUDtBQUNELEc7O2tCQTVEa0JhLFc7OztBQTRLckJBLFlBQVluQixTQUFaLEdBQXdCQSxTQUF4QiIsImZpbGUiOiJyYW5nZS1zbGlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBjcmVhdGVFbGVtZW50ICovXG5pbXBvcnQgY3JlYXRlRWxlbWVudCBmcm9tICdyZWFjdC1zdHlsZW1hdGljJztcbmltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtTbGlkZXJ9IGZyb20gJ0B1YmVyL3JlYWN0LXNsaWRlcic7XG5pbXBvcnQge3JvdW5kVmFsVG9TdGVwfSBmcm9tICd1dGlscy9kYXRhLXV0aWxzJztcbmltcG9ydCBSYW5nZVBsb3QgZnJvbSAnLi9yYW5nZS1wbG90JztcbmltcG9ydCB7aW5wdXRzfSBmcm9tICdzdHlsZXMvc2lkZS1wYW5lbCc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgbWluVmFsdWU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgbWF4VmFsdWU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgdmFsdWUwOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHZhbHVlMTogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaGlzdG9ncmFtOiBQcm9wVHlwZXMuYXJyYXksXG4gIGlzUmFuZ2VkOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNFbmxhcmdlZDogUHJvcFR5cGVzLmJvb2wsXG4gIHNob3dJbnB1dDogUHJvcFR5cGVzLmJvb2wsXG4gIHN0ZXA6IFByb3BUeXBlcy5udW1iZXIsXG4gIHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxuICB4QXhpczogUHJvcFR5cGVzLmVsZW1lbnRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJhbmdlU2xpZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHt2YWx1ZTA6IDAsIHZhbHVlMTogMX07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9zZXRWYWx1ZUZyb21Qcm9wcyh0aGlzLnByb3BzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgdGhpcy5fc2V0VmFsdWVGcm9tUHJvcHMobmV4dFByb3BzKTtcbiAgfVxuXG4gIF9zZXRWYWx1ZUZyb21Qcm9wcyA9IHByb3BzID0+IHtcbiAgICBjb25zdCB7dmFsdWUwLCB2YWx1ZTF9ID0gcHJvcHM7XG5cbiAgICBpZiAoIWlzTmFOKHZhbHVlMCkgJiYgIWlzTmFOKHZhbHVlMSkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3ZhbHVlMCwgdmFsdWUxfSk7XG4gICAgfVxuICB9O1xuXG4gIF9pc1ZhbDBJblJhbmdlID0gdmFsID0+IHtcbiAgICBjb25zdCB7dmFsdWUxLCBtaW5WYWx1ZX0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIEJvb2xlYW4odmFsID49IG1pblZhbHVlICYmIHZhbCA8PSB2YWx1ZTEpO1xuICB9O1xuXG4gIF9pc1ZhbDFJblJhbmdlID0gdmFsID0+IHtcbiAgICBjb25zdCB7bWF4VmFsdWUsIHZhbHVlMH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIEJvb2xlYW4odmFsIDw9IG1heFZhbHVlICYmIHZhbCA+PSB2YWx1ZTApO1xuICB9O1xuXG4gIF9yb3VuZFZhbFRvU3RlcCA9IHZhbCA9PiB7XG4gICAgY29uc3Qge21pblZhbHVlLCBzdGVwfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gcm91bmRWYWxUb1N0ZXAobWluVmFsdWUsIHN0ZXAsIHZhbCk7XG4gIH07XG5cbiAgX3NldFJhbmdlVmFsMSA9IHZhbCA9PiB7XG4gICAgY29uc3Qge3ZhbHVlMCwgb25DaGFuZ2V9ID0gdGhpcy5wcm9wcztcbiAgICB2YWwgPSBOdW1iZXIodmFsKTtcblxuICAgIGlmICh0aGlzLl9pc1ZhbDFJblJhbmdlKHZhbCkpIHtcbiAgICAgIG9uQ2hhbmdlKFt2YWx1ZTAsIHRoaXMuX3JvdW5kVmFsVG9TdGVwKHZhbCldKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgX3NldFJhbmdlVmFsMCA9IHZhbCA9PiB7XG4gICAgY29uc3Qge3ZhbHVlMSwgb25DaGFuZ2V9ID0gdGhpcy5wcm9wcztcbiAgICB2YWwgPSBOdW1iZXIodmFsKTtcblxuICAgIGlmICh0aGlzLl9pc1ZhbDBJblJhbmdlKHZhbCkpIHtcbiAgICAgIG9uQ2hhbmdlKFt0aGlzLl9yb3VuZFZhbFRvU3RlcCh2YWwpLCB2YWx1ZTFdKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgX3JlbmRlclNsaWRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBpc1JhbmdlZCxcbiAgICAgIG1pblZhbHVlLFxuICAgICAgbWF4VmFsdWUsXG4gICAgICBvbkNoYW5nZSxcbiAgICAgIHZhbHVlMCxcbiAgICAgIHZhbHVlMSxcbiAgICAgIHhBeGlzXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaGVpZ2h0ID0geEF4aXMgPyAnMjRweCcgOiAnMTZweCc7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3toZWlnaHQsIG1hcmdpblRvcDogJy0yNXB4JywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5cbiAgICAgICAge3hBeGlzfVxuICAgICAgICA8U2xpZGVyXG4gICAgICAgICAgc2hvd1ZhbHVlcz17ZmFsc2V9XG4gICAgICAgICAgaXNSYW5nZWQ9e2lzUmFuZ2VkfVxuICAgICAgICAgIGVuYWJsZUJhckRyYWc9e3RydWV9XG4gICAgICAgICAgbWluVmFsdWU9e21pblZhbHVlfVxuICAgICAgICAgIG1heFZhbHVlPXttYXhWYWx1ZX1cbiAgICAgICAgICB2YWx1ZTA9e3ZhbHVlMH1cbiAgICAgICAgICB2YWx1ZTE9e3ZhbHVlMX1cbiAgICAgICAgICBvblNsaWRlcjBDaGFuZ2U9e3RoaXMuX3NldFJhbmdlVmFsMH1cbiAgICAgICAgICBvblNsaWRlcjFDaGFuZ2U9e3RoaXMuX3NldFJhbmdlVmFsMX1cbiAgICAgICAgICBvblNsaWRlckJhckNoYW5nZT17KHZhbDAsIHZhbDEpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc1ZhbDFJblJhbmdlKHZhbDEpICYmIHRoaXMuX2lzVmFsMEluUmFuZ2UodmFsMCkpIHtcbiAgICAgICAgICAgICAgb25DaGFuZ2UoW1xuICAgICAgICAgICAgICAgIHRoaXMuX3JvdW5kVmFsVG9TdGVwKHZhbDApLFxuICAgICAgICAgICAgICAgIHRoaXMuX3JvdW5kVmFsVG9TdGVwKHZhbDEpXG4gICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlcklucHV0KGtleSkge1xuICAgIGNvbnN0IHR5cGUgPSAndGV4dC1pbnB1dCc7XG4gICAgY29uc3Qgc2V0UmFuZ2UgPSBrZXkgPT09ICd2YWx1ZTAnID8gdGhpcy5fc2V0UmFuZ2VWYWwwIDogdGhpcy5fc2V0UmFuZ2VWYWwxO1xuICAgIGNvbnN0IHVwZGF0ZSA9IGUgPT4ge1xuICAgICAgaWYgKCFzZXRSYW5nZShlLnRhcmdldC52YWx1ZSkpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7W2tleV06IHRoaXMuc3RhdGVba2V5XX0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGlucHV0XG4gICAgICAgIGNsYXNzTmFtZT17YCR7dHlwZX0gJHt0eXBlfS0tc21hbGwgZGFyayBkYXJrLXByaW1hcnlgfVxuICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgaWQ9e2BmaWx0ZXItJHtrZXl9YH1cbiAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGVba2V5XX1cbiAgICAgICAgb25DaGFuZ2U9e2UgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1trZXldOiBlLnRhcmdldC52YWx1ZX0pO1xuICAgICAgICB9fVxuICAgICAgICBvbktleVByZXNzPXtlID0+IHtcbiAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIHVwZGF0ZShlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIG9uQmx1cj17dXBkYXRlfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGlzUmFuZ2VkLFxuICAgICAgc2hvd0lucHV0LFxuICAgICAgaGlzdG9ncmFtLFxuICAgICAgbGluZUNoYXJ0LFxuICAgICAgcGxvdFR5cGUsXG4gICAgICBpc0VubGFyZ2VkLFxuICAgICAgbWF4VmFsdWUsXG4gICAgICBtaW5WYWx1ZSxcbiAgICAgIG9uQ2hhbmdlLFxuICAgICAgdmFsdWUwLFxuICAgICAgdmFsdWUxLFxuICAgICAgd2lkdGhcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7aGlzdG9ncmFtICYmIGhpc3RvZ3JhbS5sZW5ndGggPyAoXG4gICAgICAgICAgPFJhbmdlUGxvdFxuICAgICAgICAgICAgaGlzdG9ncmFtPXtoaXN0b2dyYW19XG4gICAgICAgICAgICBsaW5lQ2hhcnQ9e2xpbmVDaGFydH1cbiAgICAgICAgICAgIHBsb3RUeXBlPXtwbG90VHlwZX1cbiAgICAgICAgICAgIGlzRW5sYXJnZWQ9e2lzRW5sYXJnZWR9XG4gICAgICAgICAgICBvbkJydXNoPXsodmFsMCwgdmFsMSkgPT4ge1xuICAgICAgICAgICAgICBvbkNoYW5nZShbXG4gICAgICAgICAgICAgICAgdGhpcy5fcm91bmRWYWxUb1N0ZXAodmFsMCksXG4gICAgICAgICAgICAgICAgdGhpcy5fcm91bmRWYWxUb1N0ZXAodmFsMSlcbiAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgcmFuZ2U9e1ttaW5WYWx1ZSwgbWF4VmFsdWVdfVxuICAgICAgICAgICAgdmFsdWU9e1t2YWx1ZTAsIHZhbHVlMV19XG4gICAgICAgICAgICB3aWR0aD17d2lkdGh9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIHt0aGlzLl9yZW5kZXJTbGlkZXIoKX1cbiAgICAgICAgPGRpdiBzdHlsZT17aW5wdXRzfT5cbiAgICAgICAgICB7aXNSYW5nZWQgJiYgc2hvd0lucHV0ICYmIHRoaXMuX3JlbmRlcklucHV0KCd2YWx1ZTAnKX1cbiAgICAgICAgICB7c2hvd0lucHV0ICYmIHRoaXMuX3JlbmRlcklucHV0KCd2YWx1ZTEnKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblJhbmdlU2xpZGVyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiJdfQ==