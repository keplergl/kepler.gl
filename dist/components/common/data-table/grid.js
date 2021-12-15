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

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireWildcard(require("react"));

var _reactVirtualized = require("react-virtualized");

var _lodash = _interopRequireDefault(require("lodash.isequal"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var GridHack = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2["default"])(GridHack, _PureComponent);

  var _super = _createSuper(GridHack);

  function GridHack() {
    (0, _classCallCheck2["default"])(this, GridHack);
    return _super.apply(this, arguments);
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
      return /*#__PURE__*/_react["default"].createElement(_reactVirtualized.Grid, (0, _extends2["default"])({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9kYXRhLXRhYmxlL2dyaWQuanMiXSwibmFtZXMiOlsiR3JpZEhhY2siLCJwcmVQcm9wcyIsImNlbGxTaXplQ2FjaGUiLCJwcm9wcyIsImdyaWQiLCJyZWNvbXB1dGVHcmlkU2l6ZSIsInNldEdyaWRSZWYiLCJyZXN0IiwieCIsIlB1cmVDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7OztJQUVxQkEsUTs7Ozs7Ozs7Ozs7O1dBQ25CLDRCQUFtQkMsUUFBbkIsRUFBNkI7QUFDM0I7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSSxVQUFJLENBQUMsd0JBQVFBLFFBQVEsQ0FBQ0MsYUFBakIsRUFBZ0MsS0FBS0MsS0FBTCxDQUFXRCxhQUEzQyxDQUFMLEVBQWdFO0FBQzlELGFBQUtFLElBQUwsQ0FBVUMsaUJBQVY7QUFDRDtBQUNGOzs7V0FFRCxrQkFBUztBQUFBOztBQUFBLHdCQUN1QixLQUFLRixLQUQ1QjtBQUFBLFVBQ0FHLFVBREEsZUFDQUEsVUFEQTtBQUFBLFVBQ2VDLElBRGY7QUFFUCwwQkFDRSxnQ0FBQyxzQkFBRDtBQUNFLFFBQUEsR0FBRyxFQUFFLGFBQUFDLENBQUMsRUFBSTtBQUNSLGNBQUlGLFVBQUosRUFBZ0JBLFVBQVUsQ0FBQ0UsQ0FBRCxDQUFWO0FBQ2hCLFVBQUEsS0FBSSxDQUFDSixJQUFMLEdBQVlJLENBQVo7QUFDRCxTQUpIO0FBS0UsUUFBQSxHQUFHLEVBQUM7QUFMTixTQU1NRCxJQU5OLEVBREY7QUFVRDs7O0VBN0JtQ0Usb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtQdXJlQ29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge0dyaWR9IGZyb20gJ3JlYWN0LXZpcnR1YWxpemVkJztcbmltcG9ydCBpc0VxdWFsIGZyb20gJ2xvZGFzaC5pc2VxdWFsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZEhhY2sgZXh0ZW5kcyBQdXJlQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZVByb3BzKSB7XG4gICAgLypcbiAgICAgKiBUaGlzIGhhY2sgZXhpc3RzIGJlY2F1c2UgaW4gcmVhY3QtdmlydHVhbGl6ZWQgdGhlXG4gICAgICogX2NvbHVtbldpZHRoR2V0dGVyIGlzIG9ubHkgY2FsbGVkIGluIHRoZSBjb25zdHJ1Y3RvclxuICAgICAqIGV2ZW4gdGhvdWdoIGl0IGlzIHJlYXNzaWduZWQgd2l0aCBuZXcgcHJvcHMgcmVzdWx0aW5nIGluXG4gICAgICogYSBuZXcgd2lkdGggZm9yIGNlbGxzIG5vdCBiZWluZyBjYWxjdWxhdGVkIHNvIHdlIG11c3RcbiAgICAgKiBmb3JjZSB0cmlnZ2VyIGEgcmVzaXplLlxuICAgICAqXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL2J2YXVnaG4vcmVhY3QtdmlydHVhbGl6ZWQvYmxvYi9tYXN0ZXIvc291cmNlL0dyaWQvR3JpZC5qcyNMMzIyXG4gICAgICpcbiAgICAgKi9cbiAgICBpZiAoIWlzRXF1YWwocHJlUHJvcHMuY2VsbFNpemVDYWNoZSwgdGhpcy5wcm9wcy5jZWxsU2l6ZUNhY2hlKSkge1xuICAgICAgdGhpcy5ncmlkLnJlY29tcHV0ZUdyaWRTaXplKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtzZXRHcmlkUmVmLCAuLi5yZXN0fSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxHcmlkXG4gICAgICAgIHJlZj17eCA9PiB7XG4gICAgICAgICAgaWYgKHNldEdyaWRSZWYpIHNldEdyaWRSZWYoeCk7XG4gICAgICAgICAgdGhpcy5ncmlkID0geDtcbiAgICAgICAgfX1cbiAgICAgICAga2V5PVwiZ3JpZC1oYWNrXCJcbiAgICAgICAgey4uLnJlc3R9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==