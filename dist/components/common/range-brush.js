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


RangeBrush.displayName = 'RangeBrush';
RangeBrush.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1icnVzaC5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJkb21haW4iLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsIm9uQnJ1c2giLCJmdW5jIiwicmFuZ2UiLCJ2YWx1ZSIsIndpZHRoIiwic3R5bGUiLCJzdHJva2UiLCJSYW5nZUJydXNoIiwiY29tcG9uZW50RGlkTW91bnQiLCJwcm9wcyIsIm1pbiIsIm1heCIsInZhbDAiLCJ2YWwxIiwiYnJ1c2hpbmciLCJtb3ZpbmciLCJyb290IiwicmVmcyIsImJydXNoIiwib24iLCJzZWxlY3Rpb24iLCJfcmVzZXQiLCJfYnJ1c2giLCJjYWxsIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwicHJldlZhbDAiLCJwcmV2VmFsMSIsIl9tb3ZlIiwibW92ZSIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCJzY2FsZSIsIngiLCJzZWwwIiwic2VsMSIsImludmVydCIsInJlbmRlciIsIkNvbXBvbmVudCIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBSkE7QUFNQSxJQUFNQSxZQUFZO0FBQ2hCQyxVQUFRLGdCQUFNQyxTQUFOLENBQWdCQyxPQUFoQixDQUF3QixnQkFBTUQsU0FBTixDQUFnQkUsTUFBeEMsRUFBZ0RDLFVBRHhDO0FBRWhCQyxXQUFTLGdCQUFNSixTQUFOLENBQWdCSyxJQUFoQixDQUFxQkYsVUFGZDtBQUdoQkcsU0FBTyxnQkFBTU4sU0FBTixDQUFnQkMsT0FBaEIsQ0FBd0IsZ0JBQU1ELFNBQU4sQ0FBZ0JFLE1BQXhDLEVBQWdEQyxVQUh2QztBQUloQkksU0FBTyxnQkFBTVAsU0FBTixDQUFnQkMsT0FBaEIsQ0FBd0IsZ0JBQU1ELFNBQU4sQ0FBZ0JFLE1BQXhDLEVBQWdEQyxVQUp2QztBQUtoQkss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Z2UtYnJ1c2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBjcmVhdGVFbGVtZW50ICovXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNyZWF0ZUVsZW1lbnQgZnJvbSAncmVhY3Qtc3R5bGVtYXRpYyc7XG5pbXBvcnQge2V2ZW50LCBzZWxlY3R9IGZyb20gJ2QzLXNlbGVjdGlvbic7XG5pbXBvcnQge2JydXNoWH0gZnJvbSAnZDMtYnJ1c2gnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIGRvbWFpbjogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZCxcbiAgb25CcnVzaDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmFuZ2U6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWQsXG4gIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMubnVtYmVyKS5pc1JlcXVpcmVkLFxuICB3aWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG59O1xuXG5jb25zdCBzdHlsZSA9IHtcbiAgJyAuc2VsZWN0aW9uJzoge1xuICAgIHN0cm9rZTogJ25vbmUnXG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJhbmdlQnJ1c2ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCB7cmFuZ2U6IFttaW4sIG1heF0sIHZhbHVlOiBbdmFsMCwgdmFsMV19ID0gdGhpcy5wcm9wcztcbiAgICAvLyBXZSB3YW50IHRoZSBSZWFjdCBhcHAgdG8gcmVzcG9uZCB0byBicnVzaCBzdGF0ZSBhbmQgdmljZS12ZXJzYVxuICAgIC8vIGJ1dCBkMy1icnVzaCBmaXJlcyB0aGUgc2FtZSBldmVudHMgZm9yIGJvdGggdXNlci1pbml0aWF0ZWQgYnJ1c2hpbmdcbiAgICAvLyBhbmQgcHJvZ3JhbW1hdGljIGJydXNoaW5nIChicnVzaC5tb3ZlKS4gV2UgbmVlZCB0aGVzZSBmbGFncyB0b1xuICAgIC8vIGRpc3Rpbmd1aXNoIGJldHdlZW4gdGhlIHVzZXMuXG4gICAgLy9cbiAgICAvLyBXZSBkb24ndCB1c2Ugc3RhdGUgYmVjYXVzZSB0aGF0IHdvdWxkIHRyaWdnZXIgYW5vdGhlciBgY29tcG9uZW50RGlkVXBhdGVgXG4gICAgdGhpcy5icnVzaGluZyA9IGZhbHNlO1xuICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG5cbiAgICB0aGlzLnJvb3QgPSBzZWxlY3QodGhpcy5yZWZzLnJvb3QpO1xuICAgIHRoaXMuYnJ1c2ggPSBicnVzaFgoKVxuICAgICAgLm9uKCdzdGFydCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5icnVzaGluZyA9IHRydWU7XG4gICAgICB9KVxuICAgICAgLm9uKCdicnVzaCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMubW92aW5nKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQuc2VsZWN0aW9uID09PSBudWxsID8gdGhpcy5fcmVzZXQoKSA6IHRoaXMuX2JydXNoKGV2ZW50LnNlbGVjdGlvbik7XG4gICAgICB9KVxuICAgICAgLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5tb3ZpbmcgJiYgZXZlbnQuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5fcmVzZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYnJ1c2hpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tb3ZpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5yb290LmNhbGwodGhpcy5icnVzaCk7XG5cbiAgICBpZiAodmFsMCA9PT0gbWluICYmIHZhbDEgPT09IG1heCkge1xuICAgICAgdGhpcy5fcmVzZXQoKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgY29uc3Qge3JhbmdlOiBbbWluLCBtYXhdLCB2YWx1ZTogW3ZhbDAsIHZhbDFdLCB3aWR0aH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IFtwcmV2VmFsMCwgcHJldlZhbDFdID0gcHJldlByb3BzLnZhbHVlO1xuXG4gICAgaWYgKHByZXZQcm9wcy53aWR0aCAhPT0gd2lkdGgpIHtcbiAgICAgIHRoaXMucm9vdC5jYWxsKHRoaXMuYnJ1c2gpO1xuICAgICAgdGhpcy5fbW92ZSh2YWwwLCB2YWwxKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuYnJ1c2hpbmcgJiYgIXRoaXMubW92aW5nKSB7XG4gICAgICBpZiAodmFsMCA9PT0gbWluICYmIHZhbDEgPT09IG1heCkge1xuICAgICAgICB0aGlzLm1vdmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuYnJ1c2gubW92ZSh0aGlzLnJvb3QsIG51bGwpO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJldlZhbDAgIT09IHZhbDAgfHwgcHJldlZhbDEgIT09IHZhbDEpIHtcbiAgICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLl9tb3ZlKHZhbDAsIHZhbDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9yZXNldCgpIHtcbiAgICBjb25zdCBbbWluVmFsdWUsIG1heFZhbHVlXSA9IHRoaXMucHJvcHMucmFuZ2U7XG4gICAgdGhpcy5wcm9wcy5vbkJydXNoKG1pblZhbHVlLCBtYXhWYWx1ZSk7XG4gIH1cblxuICBfbW92ZSh2YWwwLCB2YWwxKSB7XG4gICAgY29uc3Qge2RvbWFpbjogW21pbiwgbWF4XSwgd2lkdGh9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBzY2FsZSA9IHggPT4gKHggLSBtaW4pICogd2lkdGggLyAobWF4IC0gbWluKTtcbiAgICB0aGlzLmJydXNoLm1vdmUodGhpcy5yb290LCBbc2NhbGUodmFsMCksIHNjYWxlKHZhbDEpXSk7XG4gIH1cblxuICBfYnJ1c2goW3NlbDAsIHNlbDFdKSB7XG4gICAgY29uc3Qge2RvbWFpbjogW21pbiwgbWF4XSwgb25CcnVzaCwgd2lkdGh9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBpbnZlcnQgPSB4ID0+IHggKiAobWF4IC0gbWluKSAvIHdpZHRoICsgbWluO1xuICAgIG9uQnJ1c2goaW52ZXJ0KHNlbDApLCBpbnZlcnQoc2VsMSkpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZyByZWY9XCJyb290XCIgc3R5bGU9e3N0eWxlfSAvPjtcbiAgfVxufVxuXG5SYW5nZUJydXNoLmRpc3BsYXlOYW1lID0gJ1JhbmdlQnJ1c2gnO1xuUmFuZ2VCcnVzaC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG4iXX0=