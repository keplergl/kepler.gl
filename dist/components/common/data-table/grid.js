"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _reactVirtualized = require("react-virtualized");

var _lodash = _interopRequireDefault(require("lodash.isequal"));

// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var GridHack =
/*#__PURE__*/
function (_PureComponent) {
  (0, _inherits2["default"])(GridHack, _PureComponent);

  function GridHack() {
    (0, _classCallCheck2["default"])(this, GridHack);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(GridHack).apply(this, arguments));
  }

  (0, _createClass2["default"])(GridHack, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(preProps) {
      /*
       * This hack exists because in react-virtualized the
       * _columnWidthGetter is only called in the constructor
       * even though it is reassigned with new props resulting in
       * a new width for cells not being calculated so we must
       * force trigger a resize.
       *
       * https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/Grid.js#L322
       *
       */
      if (!(0, _lodash["default"])(preProps.cellSizeCache, this.props.cellSizeCache)) {
        this.grid.recomputeGridSize();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props = this.props,
          setGridRef = _this$props.setGridRef,
          rest = (0, _objectWithoutProperties2["default"])(_this$props, ["setGridRef"]);
      return _react["default"].createElement(_reactVirtualized.Grid, (0, _extends2["default"])({
        ref: function ref(x) {
          if (setGridRef) setGridRef(x);
          _this.grid = x;
        },
        key: "grid-hack"
      }, rest));
    }
  }]);
  return GridHack;
}(_react.PureComponent);

exports["default"] = GridHack;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9kYXRhLXRhYmxlL2dyaWQuanMiXSwibmFtZXMiOlsiR3JpZEhhY2siLCJwcmVQcm9wcyIsImNlbGxTaXplQ2FjaGUiLCJwcm9wcyIsImdyaWQiLCJyZWNvbXB1dGVHcmlkU2l6ZSIsInNldEdyaWRSZWYiLCJyZXN0IiwieCIsIlB1cmVDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBTXFCQSxROzs7Ozs7Ozs7Ozs7dUNBQ0FDLFEsRUFBVTtBQUMzQjs7Ozs7Ozs7OztBQVVBLFVBQUksQ0FBQyx3QkFBUUEsUUFBUSxDQUFDQyxhQUFqQixFQUFnQyxLQUFLQyxLQUFMLENBQVdELGFBQTNDLENBQUwsRUFBZ0U7QUFDOUQsYUFBS0UsSUFBTCxDQUFVQyxpQkFBVjtBQUNEO0FBQ0Y7Ozs2QkFFUTtBQUFBOztBQUFBLHdCQUN1QixLQUFLRixLQUQ1QjtBQUFBLFVBQ0FHLFVBREEsZUFDQUEsVUFEQTtBQUFBLFVBQ2VDLElBRGY7QUFFUCxhQUNFLGdDQUFDLHNCQUFEO0FBQ0UsUUFBQSxHQUFHLEVBQUUsYUFBQUMsQ0FBQyxFQUFJO0FBQ1IsY0FBSUYsVUFBSixFQUFnQkEsVUFBVSxDQUFDRSxDQUFELENBQVY7QUFDaEIsVUFBQSxLQUFJLENBQUNKLElBQUwsR0FBWUksQ0FBWjtBQUNELFNBSkg7QUFLRSxRQUFBLEdBQUcsRUFBQztBQUxOLFNBTU1ELElBTk4sRUFERjtBQVVEOzs7RUE3Qm1DRSxvQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge1B1cmVDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7R3JpZH0gZnJvbSAncmVhY3QtdmlydHVhbGl6ZWQnO1xuaW1wb3J0IGlzRXF1YWwgZnJvbSAnbG9kYXNoLmlzZXF1YWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmlkSGFjayBleHRlbmRzIFB1cmVDb21wb25lbnQge1xuICBjb21wb25lbnREaWRVcGRhdGUocHJlUHJvcHMpIHtcbiAgICAvKlxuICAgICAqIFRoaXMgaGFjayBleGlzdHMgYmVjYXVzZSBpbiByZWFjdC12aXJ0dWFsaXplZCB0aGVcbiAgICAgKiBfY29sdW1uV2lkdGhHZXR0ZXIgaXMgb25seSBjYWxsZWQgaW4gdGhlIGNvbnN0cnVjdG9yXG4gICAgICogZXZlbiB0aG91Z2ggaXQgaXMgcmVhc3NpZ25lZCB3aXRoIG5ldyBwcm9wcyByZXN1bHRpbmcgaW5cbiAgICAgKiBhIG5ldyB3aWR0aCBmb3IgY2VsbHMgbm90IGJlaW5nIGNhbGN1bGF0ZWQgc28gd2UgbXVzdFxuICAgICAqIGZvcmNlIHRyaWdnZXIgYSByZXNpemUuXG4gICAgICpcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vYnZhdWdobi9yZWFjdC12aXJ0dWFsaXplZC9ibG9iL21hc3Rlci9zb3VyY2UvR3JpZC9HcmlkLmpzI0wzMjJcbiAgICAgKlxuICAgICAqL1xuICAgIGlmICghaXNFcXVhbChwcmVQcm9wcy5jZWxsU2l6ZUNhY2hlLCB0aGlzLnByb3BzLmNlbGxTaXplQ2FjaGUpKSB7XG4gICAgICB0aGlzLmdyaWQucmVjb21wdXRlR3JpZFNpemUoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge3NldEdyaWRSZWYsIC4uLnJlc3R9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPEdyaWRcbiAgICAgICAgcmVmPXt4ID0+IHtcbiAgICAgICAgICBpZiAoc2V0R3JpZFJlZikgc2V0R3JpZFJlZih4KTtcbiAgICAgICAgICB0aGlzLmdyaWQgPSB4O1xuICAgICAgICB9fVxuICAgICAgICBrZXk9XCJncmlkLWhhY2tcIlxuICAgICAgICB7Li4ucmVzdH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuIl19