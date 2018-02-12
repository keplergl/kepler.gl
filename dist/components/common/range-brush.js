'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  .selection {\n    stroke: none;\n    fill: ', ';\n    opacity: 1;\n  }\n'], ['\n  .selection {\n    stroke: none;\n    fill: ', ';\n    opacity: 1;\n  }\n']);

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
    return (0, _possibleConstructorReturn3.default)(this, (RangeBrush.__proto__ || Object.getPrototypeOf(RangeBrush)).apply(this, arguments));
  }

  (0, _createClass3.default)(RangeBrush, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          _props$range = (0, _slicedToArray3.default)(_props.range, 2),
          min = _props$range[0],
          max = _props$range[1],
          _props$value = (0, _slicedToArray3.default)(_props.value, 2),
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
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _props2 = this.props,
          _props2$range = (0, _slicedToArray3.default)(_props2.range, 2),
          min = _props2$range[0],
          max = _props2$range[1],
          _props2$value = (0, _slicedToArray3.default)(_props2.value, 2),
          val0 = _props2$value[0],
          val1 = _props2$value[1],
          width = _props2.width;

      var _prevProps$value = (0, _slicedToArray3.default)(prevProps.value, 2),
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
    }
  }, {
    key: '_reset',
    value: function _reset() {
      var _props$range2 = (0, _slicedToArray3.default)(this.props.range, 2),
          minValue = _props$range2[0],
          maxValue = _props$range2[1];

      this.props.onBrush(minValue, maxValue);
    }
  }, {
    key: '_move',
    value: function _move(val0, val1) {
      var _props3 = this.props,
          _props3$domain = (0, _slicedToArray3.default)(_props3.domain, 2),
          min = _props3$domain[0],
          max = _props3$domain[1],
          width = _props3.width;

      var scale = function scale(x) {
        return (x - min) * width / (max - min);
      };
      this.brush.move(this.root, [scale(val0), scale(val1)]);
    }
  }, {
    key: '_brush',
    value: function _brush(_ref) {
      var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
          sel0 = _ref2[0],
          sel1 = _ref2[1];

      var _props4 = this.props,
          _props4$domain = (0, _slicedToArray3.default)(_props4.domain, 2),
          min = _props4$domain[0],
          max = _props4$domain[1],
          onBrush = _props4.onBrush,
          width = _props4.width;

      var invert = function invert(x) {
        return x * (max - min) / width + min;
      };
      onBrush(invert(sel0), invert(sel1));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(StyledG, { className: 'range-slider__brush',
        innerRef: function innerRef(comp) {
          _this3.rootContainer = comp;
        } });
    }
  }]);
  return RangeBrush;
}(_react2.default.Component);

exports.default = RangeBrush;


RangeBrush.displayName = 'RangeBrush';
RangeBrush.propTypes = propTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1icnVzaC5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJkb21haW4iLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsIm9uQnJ1c2giLCJmdW5jIiwicmFuZ2UiLCJ2YWx1ZSIsIndpZHRoIiwiU3R5bGVkRyIsImciLCJwcm9wcyIsInRoZW1lIiwicmFuZ2VCcnVzaEJnZCIsIlJhbmdlQnJ1c2giLCJtaW4iLCJtYXgiLCJ2YWwwIiwidmFsMSIsImJydXNoaW5nIiwibW92aW5nIiwicm9vdCIsInJvb3RDb250YWluZXIiLCJicnVzaCIsIm9uIiwic2VsZWN0aW9uIiwiX3Jlc2V0IiwiX2JydXNoIiwiY2FsbCIsInByZXZQcm9wcyIsInByZXZWYWwwIiwicHJldlZhbDEiLCJfbW92ZSIsIm1vdmUiLCJtaW5WYWx1ZSIsIm1heFZhbHVlIiwic2NhbGUiLCJ4Iiwic2VsMCIsInNlbDEiLCJpbnZlcnQiLCJjb21wIiwiQ29tcG9uZW50IiwiZGlzcGxheU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLFlBQVk7QUFDaEJDLFVBQVEsZ0JBQU1DLFNBQU4sQ0FBZ0JDLE9BQWhCLENBQXdCLGdCQUFNRCxTQUFOLENBQWdCRSxNQUF4QyxFQUFnREMsVUFEeEM7QUFFaEJDLFdBQVMsZ0JBQU1KLFNBQU4sQ0FBZ0JLLElBQWhCLENBQXFCRixVQUZkO0FBR2hCRyxTQUFPLGdCQUFNTixTQUFOLENBQWdCQyxPQUFoQixDQUF3QixnQkFBTUQsU0FBTixDQUFnQkUsTUFBeEMsRUFBZ0RDLFVBSHZDO0FBSWhCSSxTQUFPLGdCQUFNUCxTQUFOLENBQWdCQyxPQUFoQixDQUF3QixnQkFBTUQsU0FBTixDQUFnQkUsTUFBeEMsRUFBZ0RDLFVBSnZDO0FBS2hCSyxTQUFP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QSxTQUF2QiIsImZpbGUiOiJyYW5nZS1icnVzaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7ZXZlbnQsIHNlbGVjdH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7YnJ1c2hYfSBmcm9tICdkMy1icnVzaCc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgZG9tYWluOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMubnVtYmVyKS5pc1JlcXVpcmVkLFxuICBvbkJydXNoOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICByYW5nZTogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoUmVhY3QuUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZCxcbiAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5udW1iZXIpLmlzUmVxdWlyZWQsXG4gIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWRcbn07XG5cbmNvbnN0IFN0eWxlZEcgPSBzdHlsZWQuZ2BcbiAgLnNlbGVjdGlvbiB7XG4gICAgc3Ryb2tlOiBub25lO1xuICAgIGZpbGw6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucmFuZ2VCcnVzaEJnZH07XG4gICAgb3BhY2l0eTogMTtcbiAgfVxuYDtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJhbmdlQnJ1c2ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCB7cmFuZ2U6IFttaW4sIG1heF0sIHZhbHVlOiBbdmFsMCwgdmFsMV19ID0gdGhpcy5wcm9wcztcbiAgICAvLyBXZSB3YW50IHRoZSBSZWFjdCBhcHAgdG8gcmVzcG9uZCB0byBicnVzaCBzdGF0ZSBhbmQgdmljZS12ZXJzYVxuICAgIC8vIGJ1dCBkMy1icnVzaCBmaXJlcyB0aGUgc2FtZSBldmVudHMgZm9yIGJvdGggdXNlci1pbml0aWF0ZWQgYnJ1c2hpbmdcbiAgICAvLyBhbmQgcHJvZ3JhbW1hdGljIGJydXNoaW5nIChicnVzaC5tb3ZlKS4gV2UgbmVlZCB0aGVzZSBmbGFncyB0b1xuICAgIC8vIGRpc3Rpbmd1aXNoIGJldHdlZW4gdGhlIHVzZXMuXG4gICAgLy9cbiAgICAvLyBXZSBkb24ndCB1c2Ugc3RhdGUgYmVjYXVzZSB0aGF0IHdvdWxkIHRyaWdnZXIgYW5vdGhlciBgY29tcG9uZW50RGlkVXBhdGVgXG4gICAgdGhpcy5icnVzaGluZyA9IGZhbHNlO1xuICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG5cbiAgICB0aGlzLnJvb3QgPSBzZWxlY3QodGhpcy5yb290Q29udGFpbmVyKTtcbiAgICB0aGlzLmJydXNoID0gYnJ1c2hYKClcbiAgICAgIC5vbignc3RhcnQnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuYnJ1c2hpbmcgPSB0cnVlO1xuICAgICAgfSlcbiAgICAgIC5vbignYnJ1c2gnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnNlbGVjdGlvbiA9PT0gbnVsbCA/IHRoaXMuX3Jlc2V0KCkgOiB0aGlzLl9icnVzaChldmVudC5zZWxlY3Rpb24pO1xuICAgICAgfSlcbiAgICAgIC5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMubW92aW5nICYmIGV2ZW50LnNlbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJydXNoaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG4gICAgICB9KTtcblxuICAgIHRoaXMucm9vdC5jYWxsKHRoaXMuYnJ1c2gpO1xuXG4gICAgaWYgKHZhbDAgPT09IG1pbiAmJiB2YWwxID09PSBtYXgpIHtcbiAgICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGNvbnN0IHtyYW5nZTogW21pbiwgbWF4XSwgdmFsdWU6IFt2YWwwLCB2YWwxXSwgd2lkdGh9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBbcHJldlZhbDAsIHByZXZWYWwxXSA9IHByZXZQcm9wcy52YWx1ZTtcblxuICAgIGlmIChwcmV2UHJvcHMud2lkdGggIT09IHdpZHRoKSB7XG4gICAgICB0aGlzLnJvb3QuY2FsbCh0aGlzLmJydXNoKTtcbiAgICAgIHRoaXMuX21vdmUodmFsMCwgdmFsMSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmJydXNoaW5nICYmICF0aGlzLm1vdmluZykge1xuICAgICAgaWYgKHZhbDAgPT09IG1pbiAmJiB2YWwxID09PSBtYXgpIHtcbiAgICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmJydXNoLm1vdmUodGhpcy5yb290LCBudWxsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXZWYWwwICE9PSB2YWwwIHx8IHByZXZWYWwxICE9PSB2YWwxKSB7XG4gICAgICAgIHRoaXMubW92aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fbW92ZSh2YWwwLCB2YWwxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfcmVzZXQoKSB7XG4gICAgY29uc3QgW21pblZhbHVlLCBtYXhWYWx1ZV0gPSB0aGlzLnByb3BzLnJhbmdlO1xuICAgIHRoaXMucHJvcHMub25CcnVzaChtaW5WYWx1ZSwgbWF4VmFsdWUpO1xuICB9XG5cbiAgX21vdmUodmFsMCwgdmFsMSkge1xuICAgIGNvbnN0IHtkb21haW46IFttaW4sIG1heF0sIHdpZHRofSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc2NhbGUgPSB4ID0+ICh4IC0gbWluKSAqIHdpZHRoIC8gKG1heCAtIG1pbik7XG4gICAgdGhpcy5icnVzaC5tb3ZlKHRoaXMucm9vdCwgW3NjYWxlKHZhbDApLCBzY2FsZSh2YWwxKV0pO1xuICB9XG5cbiAgX2JydXNoKFtzZWwwLCBzZWwxXSkge1xuICAgIGNvbnN0IHtkb21haW46IFttaW4sIG1heF0sIG9uQnJ1c2gsIHdpZHRofSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgaW52ZXJ0ID0geCA9PiB4ICogKG1heCAtIG1pbikgLyB3aWR0aCArIG1pbjtcbiAgICBvbkJydXNoKGludmVydChzZWwwKSwgaW52ZXJ0KHNlbDEpKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPFN0eWxlZEcgY2xhc3NOYW1lPVwicmFuZ2Utc2xpZGVyX19icnVzaFwiXG4gICAgICAgICAgICAgICAgICAgIGlubmVyUmVmPXtjb21wID0+IHtcbiAgICAgIHRoaXMucm9vdENvbnRhaW5lciA9IGNvbXA7XG4gICAgfX0vPjtcbiAgfVxufVxuXG5SYW5nZUJydXNoLmRpc3BsYXlOYW1lID0gJ1JhbmdlQnJ1c2gnO1xuUmFuZ2VCcnVzaC5wcm9wVHlwZXMgPSBwcm9wVHlwZXM7XG4iXX0=