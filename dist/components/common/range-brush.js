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

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  .selection {\n    stroke: none;\n    fill: ', ';\n    opacity: 1;\n  }\n'], ['\n  .selection {\n    stroke: none;\n    fill: ', ';\n    opacity: 1;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _d3Selection = require('d3-selection');

var _d3Brush = require('d3-brush');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  domain: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number).isRequired,
  onBrush: _react2.default.PropTypes.func.isRequired,
  range: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number).isRequired,
  value: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number).isRequired,
  width: _react2.default.PropTypes.number.isRequired
};

var StyledG = _styledComponents2.default.g(_templateObject, function (props) {
  return props.theme.rangeBrushBgd;
});

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

    this.root = (0, _d3Selection.select)(this.rootContainer);
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
    var _this3 = this;

    return _react2.default.createElement(StyledG, { className: 'range-slider__brush',
      innerRef: function innerRef(comp) {
        _this3.rootContainer = comp;
      } });
  };

  return RangeBrush;
}(_react2.default.Component);

exports.default = RangeBrush;


RangeBrush.displayName = 'RangeBrush';
RangeBrush.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1icnVzaC5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJkb21haW4iLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsIm9uQnJ1c2giLCJmdW5jIiwicmFuZ2UiLCJ2YWx1ZSIsIndpZHRoIiwiU3R5bGVkRyIsImciLCJwcm9wcyIsInRoZW1lIiwicmFuZ2VCcnVzaEJnZCIsIlJhbmdlQnJ1c2giLCJjb21wb25lbnREaWRNb3VudCIsIm1pbiIsIm1heCIsInZhbDAiLCJ2YWwxIiwiYnJ1c2hpbmciLCJtb3ZpbmciLCJyb290Iiwicm9vdENvbnRhaW5lciIsImJydXNoIiwib24iLCJzZWxlY3Rpb24iLCJfcmVzZXQiLCJfYnJ1c2giLCJjYWxsIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwicHJldlZhbDAiLCJwcmV2VmFsMSIsIl9tb3ZlIiwibW92ZSIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCJzY2FsZSIsIngiLCJzZWwwIiwic2VsMSIsImludmVydCIsInJlbmRlciIsImNvbXAiLCJDb21wb25lbnQiLCJkaXNwbGF5TmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFVBQVEsZ0JBQU1DLFNBQU4sQ0FBZ0JDLE9BQWhCLENBQXdCLGdCQUFNRCxTQUFOLENBQWdCRSxNQUF4QyxFQUFnREMsVUFEeEM7QUFFaEJDLFdBQVMsZ0JBQU1KLFNBQU4sQ0FBZ0JLLElBQWhCLENBQXFCRixVQUZkO0FBR2hCRyxTQUFPLGdCQUFNTixTQUFOLENBQWdCQyxPQUFoQixDQUF3QixnQkFBTUQsU0FBTixDQUFnQkUsTUFBeEMsRUFBZ0RDLFVBSHZDO0FBSWhCSSxTQUFPLGdCQUFNUCxTQUFOLENBQWdCQyxPQUFoQixDQUF3QixnQkFBTUQs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QUFQO0FBSUQsRzs7O0VBcEZxQyxnQkFBTUMsUzs7a0JBQXpCL0IsVTs7O0FBdUZyQkEsV0FBV2dDLFdBQVgsR0FBeUIsWUFBekI7QUFDQWhDLFdBQVdoQixTQUFYLEdBQXVCQSxTQUF2QiIsImZpbGUiOiJyYW5nZS1icnVzaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7ZXZlbnQsIHNlbGVjdH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7YnJ1c2hYfSBmcm9tICdkMy1icnVzaCc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgZG9tYWluOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMubnVtYmVyKS5pc1JlcXVpcmVkLFxuICBvbkJydXNoOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICByYW5nZTogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZCxcbiAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWQsXG4gIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IFN0eWxlZEcgPSBzdHlsZWQuZ2BcbiAgLnNlbGVjdGlvbiB7XG4gICAgc3Ryb2tlOiBub25lO1xuICAgIGZpbGw6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucmFuZ2VCcnVzaEJnZH07XG4gICAgb3BhY2l0eTogMTtcbiAgfVxuYDtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJhbmdlQnJ1c2ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCB7cmFuZ2U6IFttaW4sIG1heF0sIHZhbHVlOiBbdmFsMCwgdmFsMV19ID0gdGhpcy5wcm9wcztcbiAgICAvLyBXZSB3YW50IHRoZSBSZWFjdCBhcHAgdG8gcmVzcG9uZCB0byBicnVzaCBzdGF0ZSBhbmQgdmljZS12ZXJzYVxuICAgIC8vIGJ1dCBkMy1icnVzaCBmaXJlcyB0aGUgc2FtZSBldmVudHMgZm9yIGJvdGggdXNlci1pbml0aWF0ZWQgYnJ1c2hpbmdcbiAgICAvLyBhbmQgcHJvZ3JhbW1hdGljIGJydXNoaW5nIChicnVzaC5tb3ZlKS4gV2UgbmVlZCB0aGVzZSBmbGFncyB0b1xuICAgIC8vIGRpc3Rpbmd1aXNoIGJldHdlZW4gdGhlIHVzZXMuXG4gICAgLy9cbiAgICAvLyBXZSBkb24ndCB1c2Ugc3RhdGUgYmVjYXVzZSB0aGF0IHdvdWxkIHRyaWdnZXIgYW5vdGhlciBgY29tcG9uZW50RGlkVXBhdGVgXG4gICAgdGhpcy5icnVzaGluZyA9IGZhbHNlO1xuICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG5cbiAgICB0aGlzLnJvb3QgPSBzZWxlY3QodGhpcy5yb290Q29udGFpbmVyKTtcbiAgICB0aGlzLmJydXNoID0gYnJ1c2hYKClcbiAgICAgIC5vbignc3RhcnQnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuYnJ1c2hpbmcgPSB0cnVlO1xuICAgICAgfSlcbiAgICAgIC5vbignYnJ1c2gnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnNlbGVjdGlvbiA9PT0gbnVsbCA/IHRoaXMuX3Jlc2V0KCkgOiB0aGlzLl9icnVzaChldmVudC5zZWxlY3Rpb24pO1xuICAgICAgfSlcbiAgICAgIC5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMubW92aW5nICYmIGV2ZW50LnNlbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJydXNoaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG4gICAgICB9KTtcblxuICAgIHRoaXMucm9vdC5jYWxsKHRoaXMuYnJ1c2gpO1xuXG4gICAgaWYgKHZhbDAgPT09IG1pbiAmJiB2YWwxID09PSBtYXgpIHtcbiAgICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGNvbnN0IHtyYW5nZTogW21pbiwgbWF4XSwgdmFsdWU6IFt2YWwwLCB2YWwxXSwgd2lkdGh9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBbcHJldlZhbDAsIHByZXZWYWwxXSA9IHByZXZQcm9wcy52YWx1ZTtcblxuICAgIGlmIChwcmV2UHJvcHMud2lkdGggIT09IHdpZHRoKSB7XG4gICAgICB0aGlzLnJvb3QuY2FsbCh0aGlzLmJydXNoKTtcbiAgICAgIHRoaXMuX21vdmUodmFsMCwgdmFsMSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmJydXNoaW5nICYmICF0aGlzLm1vdmluZykge1xuICAgICAgaWYgKHZhbDAgPT09IG1pbiAmJiB2YWwxID09PSBtYXgpIHtcbiAgICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmJydXNoLm1vdmUodGhpcy5yb290LCBudWxsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXZWYWwwICE9PSB2YWwwIHx8IHByZXZWYWwxICE9PSB2YWwxKSB7XG4gICAgICAgIHRoaXMubW92aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbW92ZSh2YWwwLCB2YWwxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfcmVzZXQoKSB7XG4gICAgY29uc3QgW21pblZhbHVlLCBtYXhWYWx1ZV0gPSB0aGlzLnByb3BzLnJhbmdlO1xuICAgIHRoaXMucHJvcHMub25CcnVzaChtaW5WYWx1ZSwgbWF4VmFsdWUpO1xuICB9XG5cbiAgX21vdmUodmFsMCwgdmFsMSkge1xuICAgIGNvbnN0IHtkb21haW46IFttaW4sIG1heF0sIHdpZHRofSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc2NhbGUgPSB4ID0+ICh4IC0gbWluKSAqIHdpZHRoIC8gKG1heCAtIG1pbik7XG4gICAgdGhpcy5icnVzaC5tb3ZlKHRoaXMucm9vdCwgW3NjYWxlKHZhbDApLCBzY2FsZSh2YWwxKV0pO1xuICB9XG5cbiAgX2JydXNoKFtzZWwwLCBzZWwxXSkge1xuICAgIGNvbnN0IHtkb21haW46IFttaW4sIG1heF0sIG9uQnJ1c2gsIHdpZHRofSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaW52ZXJ0ID0geCA9PiB4ICogKG1heCAtIG1pbikgLyB3aWR0aCArIG1pbjtcbiAgICBvbkJydXNoKGludmVydChzZWwwKSwgaW52ZXJ0KHNlbDEpKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPFN0eWxlZEcgY2xhc3NOYW1lPVwicmFuZ2Utc2xpZGVyX19icnVzaFwiXG4gICAgICAgICAgICAgICAgICAgIGlubmVyUmVmPXtjb21wID0+IHtcbiAgICAgIHRoaXMucm9vdENvbnRhaW5lciA9IGNvbXA7XG4gICAgfX0vPjtcbiAgfVxufVxuXG5SYW5nZUJydXNoLmRpc3BsYXlOYW1lID0gJ1JhbmdlQnJ1c2gnO1xuUmFuZ2VCcnVzaC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG4iXX0=