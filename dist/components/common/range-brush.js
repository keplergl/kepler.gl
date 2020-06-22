"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _d3Selection = require("d3-selection");

var _d3Brush = require("d3-brush");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  .selection {\n    stroke: none;\n    fill: ", ";\n    opacity: 1;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledG = _styledComponents["default"].g(_templateObject(), function (props) {
  return props.theme.rangeBrushBgd;
});

var RangeBrush =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(RangeBrush, _Component);

  function RangeBrush() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, RangeBrush);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(RangeBrush)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "rootContainer", (0, _react.createRef)());
    return _this;
  }

  (0, _createClass2["default"])(RangeBrush, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // We want the React app to respond to brush state and vice-versa
      // but d3-brush fires the same events for both user-initiated brushing
      // and programmatic brushing (brush.move). We need these flags to
      // distinguish between the uses.
      //
      // We don't use state because that would trigger another `componentDidUpdate`
      this.brushing = false;
      this.moving = false;
      this.root = (0, _d3Selection.select)(this.rootContainer.current);
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
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props = this.props,
          _this$props$value = (0, _slicedToArray2["default"])(_this$props.value, 2),
          val0 = _this$props$value[0],
          val1 = _this$props$value[1],
          width = _this$props.width;

      var _prevProps$value = (0, _slicedToArray2["default"])(prevProps.value, 2),
          prevVal0 = _prevProps$value[0],
          prevVal1 = _prevProps$value[1];

      if (prevProps.width !== width) {
        // width change should not trigger this._brush
        this.moving = true;
        this.root.call(this.brush);

        this._move(val0, val1);
      }

      if (!this.brushing && !this.moving) {
        if (prevVal0 !== val0 || prevVal1 !== val1) {
          this.moving = true;

          this._move(val0, val1);
        }
      }
    }
  }, {
    key: "_reset",
    value: function _reset() {
      var _this$props$range = (0, _slicedToArray2["default"])(this.props.range, 2),
          minValue = _this$props$range[0],
          maxValue = _this$props$range[1];

      this._onBrush(minValue, maxValue);
    }
  }, {
    key: "_move",
    value: function _move(val0, val1) {
      var _this$props2 = this.props,
          _this$props2$domain = (0, _slicedToArray2["default"])(_this$props2.domain, 2),
          min = _this$props2$domain[0],
          max = _this$props2$domain[1],
          width = _this$props2.width;

      var scale = function scale(x) {
        return (x - min) * width / (max - min);
      };

      this.brush.move(this.root, [scale(val0), scale(val1)]);
    }
  }, {
    key: "_brush",
    value: function _brush(_ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          sel0 = _ref2[0],
          sel1 = _ref2[1];

      var _this$props3 = this.props,
          _this$props3$domain = (0, _slicedToArray2["default"])(_this$props3.domain, 2),
          min = _this$props3$domain[0],
          max = _this$props3$domain[1],
          width = _this$props3.width;

      var invert = function invert(x) {
        return x * (max - min) / width + min;
      };

      this._onBrush(invert(sel0), invert(sel1));
    }
  }, {
    key: "_onBrush",
    value: function _onBrush(val0, val1) {
      var _this$props$value2 = (0, _slicedToArray2["default"])(this.props.value, 2),
          currentVal0 = _this$props$value2[0],
          currentVal1 = _this$props$value2[1];

      if (currentVal0 === val0 && currentVal1 === val1) {
        return;
      }

      this.props.onBrush(val0, val1);
    }
  }, {
    key: "render",
    value: function render() {
      return _react["default"].createElement(StyledG, {
        className: "kg-range-slider__brush",
        ref: this.rootContainer
      });
    }
  }]);
  return RangeBrush;
}(_react.Component);

exports["default"] = RangeBrush;
(0, _defineProperty2["default"])(RangeBrush, "propTypes", {
  domain: _propTypes["default"].arrayOf(_propTypes["default"].number).isRequired,
  onBrush: _propTypes["default"].func.isRequired,
  range: _propTypes["default"].arrayOf(_propTypes["default"].number).isRequired,
  value: _propTypes["default"].arrayOf(_propTypes["default"].number).isRequired,
  width: _propTypes["default"].number.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1icnVzaC5qcyJdLCJuYW1lcyI6WyJTdHlsZWRHIiwic3R5bGVkIiwiZyIsInByb3BzIiwidGhlbWUiLCJyYW5nZUJydXNoQmdkIiwiUmFuZ2VCcnVzaCIsImJydXNoaW5nIiwibW92aW5nIiwicm9vdCIsInJvb3RDb250YWluZXIiLCJjdXJyZW50IiwiYnJ1c2giLCJvbiIsImV2ZW50Iiwic2VsZWN0aW9uIiwiX3Jlc2V0IiwiX2JydXNoIiwiY2FsbCIsInByZXZQcm9wcyIsInZhbHVlIiwidmFsMCIsInZhbDEiLCJ3aWR0aCIsInByZXZWYWwwIiwicHJldlZhbDEiLCJfbW92ZSIsInJhbmdlIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIl9vbkJydXNoIiwiZG9tYWluIiwibWluIiwibWF4Iiwic2NhbGUiLCJ4IiwibW92ZSIsInNlbDAiLCJzZWwxIiwiaW52ZXJ0IiwiY3VycmVudFZhbDAiLCJjdXJyZW50VmFsMSIsIm9uQnJ1c2giLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxPQUFPLEdBQUdDLDZCQUFPQyxDQUFWLG9CQUdELFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsYUFBaEI7QUFBQSxDQUhKLENBQWI7O0lBUXFCQyxVOzs7Ozs7Ozs7Ozs7Ozs7OztzR0FpRUgsdUI7Ozs7Ozt3Q0F4REk7QUFBQTs7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsV0FBS0MsUUFBTCxHQUFnQixLQUFoQjtBQUNBLFdBQUtDLE1BQUwsR0FBYyxLQUFkO0FBRUEsV0FBS0MsSUFBTCxHQUFZLHlCQUFPLEtBQUtDLGFB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cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnQsIGNyZWF0ZVJlZn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtldmVudCwgc2VsZWN0fSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHticnVzaFh9IGZyb20gJ2QzLWJydXNoJztcblxuY29uc3QgU3R5bGVkRyA9IHN0eWxlZC5nYFxuICAuc2VsZWN0aW9uIHtcbiAgICBzdHJva2U6IG5vbmU7XG4gICAgZmlsbDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5yYW5nZUJydXNoQmdkfTtcbiAgICBvcGFjaXR5OiAxO1xuICB9XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYW5nZUJydXNoIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBkb21haW46IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWQsXG4gICAgb25CcnVzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByYW5nZTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZCxcbiAgICB2YWx1ZTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZCxcbiAgICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkXG4gIH07XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gV2Ugd2FudCB0aGUgUmVhY3QgYXBwIHRvIHJlc3BvbmQgdG8gYnJ1c2ggc3RhdGUgYW5kIHZpY2UtdmVyc2FcbiAgICAvLyBidXQgZDMtYnJ1c2ggZmlyZXMgdGhlIHNhbWUgZXZlbnRzIGZvciBib3RoIHVzZXItaW5pdGlhdGVkIGJydXNoaW5nXG4gICAgLy8gYW5kIHByb2dyYW1tYXRpYyBicnVzaGluZyAoYnJ1c2gubW92ZSkuIFdlIG5lZWQgdGhlc2UgZmxhZ3MgdG9cbiAgICAvLyBkaXN0aW5ndWlzaCBiZXR3ZWVuIHRoZSB1c2VzLlxuICAgIC8vXG4gICAgLy8gV2UgZG9uJ3QgdXNlIHN0YXRlIGJlY2F1c2UgdGhhdCB3b3VsZCB0cmlnZ2VyIGFub3RoZXIgYGNvbXBvbmVudERpZFVwZGF0ZWBcblxuICAgIHRoaXMuYnJ1c2hpbmcgPSBmYWxzZTtcbiAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuXG4gICAgdGhpcy5yb290ID0gc2VsZWN0KHRoaXMucm9vdENvbnRhaW5lci5jdXJyZW50KTtcbiAgICB0aGlzLmJydXNoID0gYnJ1c2hYKClcbiAgICAgIC5vbignc3RhcnQnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuYnJ1c2hpbmcgPSB0cnVlO1xuICAgICAgfSlcbiAgICAgIC5vbignYnJ1c2gnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5zZWxlY3Rpb24gPT09IG51bGwgPyB0aGlzLl9yZXNldCgpIDogdGhpcy5fYnJ1c2goZXZlbnQuc2VsZWN0aW9uKTtcbiAgICAgIH0pXG4gICAgICAub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLm1vdmluZyAmJiBldmVudC5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLl9yZXNldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5icnVzaGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLnJvb3QuY2FsbCh0aGlzLmJydXNoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBjb25zdCB7XG4gICAgICB2YWx1ZTogW3ZhbDAsIHZhbDFdLFxuICAgICAgd2lkdGhcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBbcHJldlZhbDAsIHByZXZWYWwxXSA9IHByZXZQcm9wcy52YWx1ZTtcblxuICAgIGlmIChwcmV2UHJvcHMud2lkdGggIT09IHdpZHRoKSB7XG4gICAgICAvLyB3aWR0aCBjaGFuZ2Ugc2hvdWxkIG5vdCB0cmlnZ2VyIHRoaXMuX2JydXNoXG4gICAgICB0aGlzLm1vdmluZyA9IHRydWU7XG4gICAgICB0aGlzLnJvb3QuY2FsbCh0aGlzLmJydXNoKTtcbiAgICAgIHRoaXMuX21vdmUodmFsMCwgdmFsMSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmJydXNoaW5nICYmICF0aGlzLm1vdmluZykge1xuICAgICAgaWYgKHByZXZWYWwwICE9PSB2YWwwIHx8IHByZXZWYWwxICE9PSB2YWwxKSB7XG4gICAgICAgIHRoaXMubW92aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbW92ZSh2YWwwLCB2YWwxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByb290Q29udGFpbmVyID0gY3JlYXRlUmVmKCk7XG5cbiAgX3Jlc2V0KCkge1xuICAgIGNvbnN0IFttaW5WYWx1ZSwgbWF4VmFsdWVdID0gdGhpcy5wcm9wcy5yYW5nZTtcbiAgICB0aGlzLl9vbkJydXNoKG1pblZhbHVlLCBtYXhWYWx1ZSk7XG4gIH1cblxuICBfbW92ZSh2YWwwLCB2YWwxKSB7XG4gICAgY29uc3Qge1xuICAgICAgZG9tYWluOiBbbWluLCBtYXhdLFxuICAgICAgd2lkdGhcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBzY2FsZSA9IHggPT4gKCh4IC0gbWluKSAqIHdpZHRoKSAvIChtYXggLSBtaW4pO1xuICAgIHRoaXMuYnJ1c2gubW92ZSh0aGlzLnJvb3QsIFtzY2FsZSh2YWwwKSwgc2NhbGUodmFsMSldKTtcbiAgfVxuXG4gIF9icnVzaChbc2VsMCwgc2VsMV0pIHtcbiAgICBjb25zdCB7XG4gICAgICBkb21haW46IFttaW4sIG1heF0sXG4gICAgICB3aWR0aFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGludmVydCA9IHggPT4gKHggKiAobWF4IC0gbWluKSkgLyB3aWR0aCArIG1pbjtcbiAgICB0aGlzLl9vbkJydXNoKGludmVydChzZWwwKSwgaW52ZXJ0KHNlbDEpKTtcbiAgfVxuXG4gIF9vbkJydXNoKHZhbDAsIHZhbDEpIHtcbiAgICBjb25zdCB7XG4gICAgICB2YWx1ZTogW2N1cnJlbnRWYWwwLCBjdXJyZW50VmFsMV1cbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmIChjdXJyZW50VmFsMCA9PT0gdmFsMCAmJiBjdXJyZW50VmFsMSA9PT0gdmFsMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvcHMub25CcnVzaCh2YWwwLCB2YWwxKTtcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxTdHlsZWRHIGNsYXNzTmFtZT1cImtnLXJhbmdlLXNsaWRlcl9fYnJ1c2hcIiByZWY9e3RoaXMucm9vdENvbnRhaW5lcn0gLz47XG4gIH1cbn1cbiJdfQ==