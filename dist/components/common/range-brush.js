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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactStylematic = require('react-stylematic');

var _reactStylematic2 = _interopRequireDefault(_reactStylematic);

var _d3Selection = require('d3-selection');

var _d3Brush = require('d3-brush');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @jsx createElement */
var propTypes = {
  domain: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number).isRequired,
  onBrush: _react2.default.PropTypes.func.isRequired,
  range: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number).isRequired,
  value: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number).isRequired,
  width: _react2.default.PropTypes.number.isRequired
};

var style = {
  ' .selection': {
    stroke: 'none'
  }
};

var RangeBrush = function (_React$Component) {
  (0, _inherits3.default)(RangeBrush, _React$Component);

  function RangeBrush() {
    (0, _classCallCheck3.default)(this, RangeBrush);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  RangeBrush.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var _props = this.props,
        _props$range = _props.range,
        min = _props$range[0],
        max = _props$range[1],
        _props$value = _props.value,
        val0 = _props$value[0],
        val1 = _props$value[1];
    // We want the React app to respond to brush state and vice-versa
    // but d3-brush fires the same events for both user-initiated brushing
    // and programmatic brushing (brush.move). We need these flags to
    // distinguish between the uses.
    //
    // We don't use state because that would trigger another `componentDidUpate`

    this.brushing = false;
    this.moving = false;

    this.root = (0, _d3Selection.select)(this.refs.root);
    this.brush = (0, _d3Brush.brushX)().on('start', function () {
      _this2.brushing = true;
    }).on('brush', function () {
      if (_this2.moving) {
        return;
      }

      _d3Selection.event.selection === null ? _this2._reset() : _this2._brush(_d3Selection.event.selection);
    }).on('end', function () {
      if (!_this2.moving && _d3Selection.event.selection === null) {
        _this2._reset();
      }

      _this2.brushing = false;
      _this2.moving = false;
    });

    this.root.call(this.brush);

    if (val0 === min && val1 === max) {
      this._reset();
    }
  };

  RangeBrush.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _props2 = this.props,
        _props2$range = _props2.range,
        min = _props2$range[0],
        max = _props2$range[1],
        _props2$value = _props2.value,
        val0 = _props2$value[0],
        val1 = _props2$value[1],
        width = _props2.width;
    var _prevProps$value = prevProps.value,
        prevVal0 = _prevProps$value[0],
        prevVal1 = _prevProps$value[1];


    if (prevProps.width !== width) {
      this.root.call(this.brush);
      this._move(val0, val1);
    }

    if (!this.brushing && !this.moving) {

      if (val0 === min && val1 === max) {
        this.moving = true;
        this.brush.move(this.root, null);
      }

      if (prevVal0 !== val0 || prevVal1 !== val1) {
        this.moving = true;
        this._move(val0, val1);
      }
    }
  };

  RangeBrush.prototype._reset = function _reset() {
    var _props$range2 = this.props.range,
        minValue = _props$range2[0],
        maxValue = _props$range2[1];

    this.props.onBrush(minValue, maxValue);
  };

  RangeBrush.prototype._move = function _move(val0, val1) {
    var _props3 = this.props,
        _props3$domain = _props3.domain,
        min = _props3$domain[0],
        max = _props3$domain[1],
        width = _props3.width;

    var scale = function scale(x) {
      return (x - min) * width / (max - min);
    };
    this.brush.move(this.root, [scale(val0), scale(val1)]);
  };

  RangeBrush.prototype._brush = function _brush(_ref) {
    var sel0 = _ref[0],
        sel1 = _ref[1];
    var _props4 = this.props,
        _props4$domain = _props4.domain,
        min = _props4$domain[0],
        max = _props4$domain[1],
        onBrush = _props4.onBrush,
        width = _props4.width;

    var invert = function invert(x) {
      return x * (max - min) / width + min;
    };
    onBrush(invert(sel0), invert(sel1));
  };

  RangeBrush.prototype.render = function render() {
    return (0, _reactStylematic2.default)('g', { ref: 'root', style: style });
  };

  return RangeBrush;
}(_react2.default.Component);

exports.default = RangeBrush;
;

RangeBrush.displayName = 'RangeBrush';
RangeBrush.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1icnVzaC5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJkb21haW4iLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsIm9uQnJ1c2giLCJmdW5jIiwicmFuZ2UiLCJ2YWx1ZSIsIndpZHRoIiwic3R5bGUiLCJzdHJva2UiLCJSYW5nZUJydXNoIiwiY29tcG9uZW50RGlkTW91bnQiLCJwcm9wcyIsIm1pbiIsIm1heCIsInZhbDAiLCJ2YWwxIiwiYnJ1c2hpbmciLCJtb3ZpbmciLCJyb290IiwicmVmcyIsImJydXNoIiwib24iLCJzZWxlY3Rpb24iLCJfcmVzZXQiLCJfYnJ1c2giLCJjYWxsIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwicHJldlZhbDAiLCJwcmV2VmFsMSIsIl9tb3ZlIiwibW92ZSIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCJzY2FsZSIsIngiLCJzZWwwIiwic2VsMSIsImludmVydCIsInJlbmRlciIsIkNvbXBvbmVudCIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBSkE7QUFNQSxJQUFNQSxZQUFZO0FBQ2hCQyxVQUFRLGdCQUFNQyxTQUFOLENBQWdCQyxPQUFoQixDQUF3QixnQkFBTUQsU0FBTixDQUFnQkUsTUFBeEMsRUFBZ0RDLFVBRHhDO0FBRWhCQyxXQUFTLGdCQUFNSixTQUFOLENBQWdCSyxJQUFoQixDQUFxQkYsVUFGZDtBQUdoQkcsU0FBTyxnQkFBTU4sU0FBTixDQUFnQkMsT0FBaEIsQ0FBd0IsZ0JBQU1ELFNBQU4sQ0FBZ0JFLE1BQXhDLEVBQWdEQyxVQUh2QztBQUloQkksU0FBTyxnQkFBTVAsU0FBTixDQUFnQkMsT0FBaEIsQ0FBd0IsZ0JBQU1ELFNBQU4sQ0FBZ0JFLE1BQXhDLEVBQWdEQyxVQUp2QztBQUtoQkss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bmdlLWJydXNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3ggY3JlYXRlRWxlbWVudCAqL1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjcmVhdGVFbGVtZW50IGZyb20gJ3JlYWN0LXN0eWxlbWF0aWMnO1xuaW1wb3J0IHtldmVudCwgc2VsZWN0fSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHticnVzaFh9IGZyb20gJ2QzLWJydXNoJztcblxuY29uc3QgcHJvcFR5cGVzID0ge1xuICBkb21haW46IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWQsXG4gIG9uQnJ1c2g6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMubnVtYmVyKS5pc1JlcXVpcmVkLFxuICB2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZCxcbiAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxufTtcblxuY29uc3Qgc3R5bGUgPSB7XG4gICcgLnNlbGVjdGlvbic6IHtcbiAgICBzdHJva2U6ICdub25lJ1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYW5nZUJydXNoIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3Qge3JhbmdlOiBbbWluLCBtYXhdLCB2YWx1ZTogW3ZhbDAsIHZhbDFdfSA9IHRoaXMucHJvcHM7XG4gICAgLy8gV2Ugd2FudCB0aGUgUmVhY3QgYXBwIHRvIHJlc3BvbmQgdG8gYnJ1c2ggc3RhdGUgYW5kIHZpY2UtdmVyc2FcbiAgICAvLyBidXQgZDMtYnJ1c2ggZmlyZXMgdGhlIHNhbWUgZXZlbnRzIGZvciBib3RoIHVzZXItaW5pdGlhdGVkIGJydXNoaW5nXG4gICAgLy8gYW5kIHByb2dyYW1tYXRpYyBicnVzaGluZyAoYnJ1c2gubW92ZSkuIFdlIG5lZWQgdGhlc2UgZmxhZ3MgdG9cbiAgICAvLyBkaXN0aW5ndWlzaCBiZXR3ZWVuIHRoZSB1c2VzLlxuICAgIC8vXG4gICAgLy8gV2UgZG9uJ3QgdXNlIHN0YXRlIGJlY2F1c2UgdGhhdCB3b3VsZCB0cmlnZ2VyIGFub3RoZXIgYGNvbXBvbmVudERpZFVwYXRlYFxuICAgIHRoaXMuYnJ1c2hpbmcgPSBmYWxzZTtcbiAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuXG4gICAgdGhpcy5yb290ID0gc2VsZWN0KHRoaXMucmVmcy5yb290KTtcbiAgICB0aGlzLmJydXNoID0gYnJ1c2hYKClcbiAgICAgIC5vbignc3RhcnQnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuYnJ1c2hpbmcgPSB0cnVlO1xuICAgICAgfSlcbiAgICAgIC5vbignYnJ1c2gnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnNlbGVjdGlvbiA9PT0gbnVsbCA/XG4gICAgICAgICAgdGhpcy5fcmVzZXQoKSA6XG4gICAgICAgICAgdGhpcy5fYnJ1c2goZXZlbnQuc2VsZWN0aW9uKTtcbiAgICAgIH0pXG4gICAgICAub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLm1vdmluZyAmJiBldmVudC5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLl9yZXNldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5icnVzaGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLnJvb3QuY2FsbCh0aGlzLmJydXNoKTtcblxuICAgIGlmICh2YWwwID09PSBtaW4gJiYgdmFsMSA9PT0gbWF4KSB7XG4gICAgICB0aGlzLl9yZXNldCgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBjb25zdCB7cmFuZ2U6IFttaW4sIG1heF0sIHZhbHVlOiBbdmFsMCwgdmFsMV0sIHdpZHRofSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgW3ByZXZWYWwwLCBwcmV2VmFsMV0gPSBwcmV2UHJvcHMudmFsdWU7XG5cbiAgICBpZiAocHJldlByb3BzLndpZHRoICE9PSB3aWR0aCkge1xuICAgICAgdGhpcy5yb290LmNhbGwodGhpcy5icnVzaCk7XG4gICAgICB0aGlzLl9tb3ZlKHZhbDAsIHZhbDEpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5icnVzaGluZyAmJiAhdGhpcy5tb3ZpbmcpIHtcblxuICAgICAgaWYgKHZhbDAgPT09IG1pbiAmJiB2YWwxID09PSBtYXgpIHtcbiAgICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmJydXNoLm1vdmUodGhpcy5yb290LCBudWxsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXZWYWwwICE9PSB2YWwwIHx8IHByZXZWYWwxICE9PSB2YWwxKSB7XG4gICAgICAgIHRoaXMubW92aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbW92ZSh2YWwwLCB2YWwxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfcmVzZXQoKSB7XG4gICAgY29uc3QgW21pblZhbHVlLCBtYXhWYWx1ZV0gPSB0aGlzLnByb3BzLnJhbmdlO1xuICAgIHRoaXMucHJvcHMub25CcnVzaChtaW5WYWx1ZSwgbWF4VmFsdWUpO1xuICB9XG5cbiAgX21vdmUodmFsMCwgdmFsMSkge1xuICAgIGNvbnN0IHtkb21haW46IFttaW4sIG1heF0sIHdpZHRofSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc2NhbGUgPSB4ID0+ICh4IC0gbWluKSAqIHdpZHRoIC8gKG1heCAtIG1pbik7XG4gICAgdGhpcy5icnVzaC5tb3ZlKHRoaXMucm9vdCwgW3NjYWxlKHZhbDApLCBzY2FsZSh2YWwxKV0pO1xuICB9XG5cbiAgX2JydXNoKFtzZWwwLCBzZWwxXSkge1xuICAgIGNvbnN0IHtkb21haW46IFttaW4sIG1heF0sIG9uQnJ1c2gsIHdpZHRofSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaW52ZXJ0ID0geCA9PiB4ICogKG1heCAtIG1pbikgLyB3aWR0aCArIG1pbjtcbiAgICBvbkJydXNoKGludmVydChzZWwwKSwgaW52ZXJ0KHNlbDEpKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGcgcmVmPSdyb290JyBzdHlsZT17c3R5bGV9IC8+XG4gICAgKTtcbiAgfVxufTtcblxuUmFuZ2VCcnVzaC5kaXNwbGF5TmFtZSA9ICdSYW5nZUJydXNoJztcblJhbmdlQnJ1c2gucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuIl19