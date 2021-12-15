"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _d3Selection = require("d3-selection");

var _d3Brush = require("d3-brush");

var _dataUtils = require("../../utils/data-utils");

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var StyledG = _styledComponents["default"].g(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  .selection {\n    stroke: none;\n    fill: ", ";\n    fill-opacity: ", ";\n  }\n  .handle {\n    fill: ", ";\n    fill-opacity: 0.3;\n  }\n"])), function (props) {
  return props.isRanged ? props.theme.rangeBrushBgd : props.theme.BLUE2;
}, function (props) {
  return props.isRanged ? 0.3 : 1;
}, function (props) {
  return props.theme.BLUE2;
});

function moveRight(startSel, selection) {
  var _startSel = (0, _slicedToArray2["default"])(startSel, 1),
      startSel0 = _startSel[0];

  var _selection = (0, _slicedToArray2["default"])(selection, 1),
      sel0 = _selection[0];

  return Boolean(startSel0 === sel0);
} // style brush resize handle
// https://github.com/crossfilter/crossfilter/blob/gh-pages/index.html#L466


var getHandlePath = function getHandlePath(props) {
  return function brushResizePath(d) {
    var e = Number(d.type === 'e');
    var x = e ? 1 : -1;
    var h = 39;
    var w = 4.5;
    var y = (props.height - h) / 2;
    return "M".concat(0.5 * x, ",").concat(y, "c").concat(2.5 * x, ",0,").concat(w * x, ",2,").concat(w * x, ",").concat(w, "v").concat(h - w * 2, "c0,2.5,").concat(-2 * x, ",").concat(w, ",").concat(-w * x, ",").concat(w, "V").concat(y, "z");
  };
};

function RangeBrushFactory() {
  var RangeBrush = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(RangeBrush, _Component);

    var _super = _createSuper(RangeBrush);

    function RangeBrush() {
      var _this;

      (0, _classCallCheck2["default"])(this, RangeBrush);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "rootContainer", /*#__PURE__*/(0, _react.createRef)());
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_brushed", function (evt) {
        var _this2;

        // Ignore brush events which don't have an underlying sourceEvent
        if (!evt.sourceEvent) return;

        var _evt$selection = (0, _slicedToArray2["default"])(evt.selection, 2),
            sel0 = _evt$selection[0],
            sel1 = _evt$selection[1];

        var right = moveRight(_this._startSel, evt.selection);

        var _this$props = _this.props,
            _this$props$range = (0, _slicedToArray2["default"])(_this$props.range, 2),
            min = _this$props$range[0],
            max = _this$props$range[1],
            step = _this$props.step,
            width = _this$props.width,
            marks = _this$props.marks,
            isRanged = _this$props.isRanged;

        var invert = function invert(x) {
          return x * (max - min) / width + min;
        };

        var d0 = invert(sel0);
        var d1 = invert(sel1);
        d0 = (0, _dataUtils.normalizeSliderValue)(d0, min, step, marks);
        d1 = (0, _dataUtils.normalizeSliderValue)(d1, min, step, marks);
        if (isRanged) _this._move(d0, d1);else (_this2 = _this)._move.apply(_this2, (0, _toConsumableArray2["default"])(right ? [d1, d1] : [d0, d0]));
        if (isRanged) _this._onBrush(d0, d1);else _this._onBrush(right ? d1 : d0);
      });
      return _this;
    }

    (0, _createClass2["default"])(RangeBrush, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this3 = this;

        // We want the React app to respond to brush state and vice-versa
        // but d3-brush fires the same events for both user-initiated brushing
        // and programmatic brushing (brush.move). We need these flags to
        // distinguish between the uses.
        //
        // We don't use state because that would trigger another `componentDidUpdate`
        var _this$props2 = this.props,
            theme = _this$props2.theme,
            isRanged = _this$props2.isRanged,
            onMouseoverHandle = _this$props2.onMouseoverHandle,
            onMouseoutHandle = _this$props2.onMouseoutHandle;
        this.brushing = false;
        this.moving = false;
        this.root = (0, _d3Selection.select)(this.rootContainer.current);
        this.brush = (0, _d3Brush.brushX)().handleSize(3).on('start', function (event) {
          if (typeof _this3.props.onBrushStart === 'function') _this3.props.onBrushStart();
          _this3._startSel = event.selection;
        }).on('brush', function (event) {
          if (_this3.moving) {
            return;
          }

          if (event.selection) {
            _this3._lastSel = event.selection;
            _this3.brushing = true;

            _this3._brushed(event);
          }
        }).on('end', function (event) {
          if (!event.selection) {
            if (_this3.brushing) {
              // handle null selection
              _this3._click(_this3._lastSel);
            } else if (_this3._startSel) {
              // handle click
              _this3._click(_this3._startSel);
            }
          }

          if (typeof _this3.props.onBrushEnd === 'function') _this3.props.onBrushEnd();
          _this3.brushing = false;
          _this3.moving = false;
        });
        this.root.call(this.brush);
        var brushResizePath = getHandlePath(this.props);
        this.handle = this.root.selectAll('.handle--custom').data([{
          type: 'w'
        }, {
          type: 'e'
        }]).enter().append('path').attr('class', 'handle--custom').attr('display', isRanged ? null : 'none').attr('fill', theme ? theme.sliderHandleColor : '#D3D8E0').attr('cursor', 'ew-resize').attr('d', brushResizePath).on('mouseover', function () {
          if (onMouseoverHandle) onMouseoverHandle();
        }).on('mouseout', function () {
          if (onMouseoutHandle) onMouseoutHandle();
        });

        var _this$props$value = (0, _slicedToArray2["default"])(this.props.value, 2),
            val0 = _this$props$value[0],
            val1 = _this$props$value[1];

        this.moving = true;

        this._move(val0, val1);
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        var _this$props3 = this.props,
            _this$props3$value = (0, _slicedToArray2["default"])(_this$props3.value, 2),
            val0 = _this$props3$value[0],
            val1 = _this$props3$value[1],
            width = _this$props3.width;

        var _prevProps$value = (0, _slicedToArray2["default"])(prevProps.value, 2),
            prevVal0 = _prevProps$value[0],
            prevVal1 = _prevProps$value[1];

        if (prevProps.width !== width) {
          // width change should not trigger this._brushed
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

        if (!this.props.isRanged) {
          this.handle.attr('display', 'none');
        }
      }
    }, {
      key: "_click",
      value: function _click(selection) {
        // fake brush
        this.brushing = true;

        this._brushed({
          sourceEvent: {},
          selection: selection
        });
      }
    }, {
      key: "_move",
      value: function _move(val0, val1) {
        var _this$props4 = this.props,
            _this$props4$range = (0, _slicedToArray2["default"])(_this$props4.range, 2),
            min = _this$props4$range[0],
            max = _this$props4$range[1],
            width = _this$props4.width,
            isRanged = _this$props4.isRanged;

        if (width && max - min) {
          var scale = function scale(x) {
            return (x - min) * width / (max - min);
          };

          if (!isRanged) {
            // only draw a 1 pixel line
            this.brush.move(this.root, [scale(val0), scale(val0) + 1]);
          } else {
            this.brush.move(this.root, [scale(val0), scale(val1)]);
            this.handle.attr('display', null).attr('transform', function (d, i) {
              return "translate(".concat([i === 0 ? scale(val0) : scale(val1), 0], ")");
            });
          }
        }
      }
    }, {
      key: "_onBrush",
      value: function _onBrush(val0, val1) {
        var _this$props5 = this.props,
            isRanged = _this$props5.isRanged,
            _this$props5$value = (0, _slicedToArray2["default"])(_this$props5.value, 2),
            currentVal0 = _this$props5$value[0],
            currentVal1 = _this$props5$value[1];

        if (currentVal0 === val0 && currentVal1 === val1) {
          return;
        }

        if (isRanged) {
          this.props.onBrush(val0, val1);
        } else {
          this.props.onBrush(val0, val0);
        }
      }
    }, {
      key: "render",
      value: function render() {
        var isRanged = this.props.isRanged;
        return /*#__PURE__*/_react["default"].createElement(StyledG, {
          className: "kg-range-slider__brush",
          isRanged: isRanged,
          ref: this.rootContainer
        });
      }
    }]);
    return RangeBrush;
  }(_react.Component);

  (0, _defineProperty2["default"])(RangeBrush, "propTypes", {
    onBrush: _propTypes["default"].func.isRequired,
    range: _propTypes["default"].arrayOf(_propTypes["default"].number).isRequired,
    value: _propTypes["default"].arrayOf(_propTypes["default"].number).isRequired,
    width: _propTypes["default"].number.isRequired,
    isRanged: _propTypes["default"].bool
  });
  (0, _defineProperty2["default"])(RangeBrush, "defaultProps", {
    isRanged: true
  });
  return (0, _styledComponents.withTheme)(RangeBrush);
}

var _default = RangeBrushFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1icnVzaC5qcyJdLCJuYW1lcyI6WyJTdHlsZWRHIiwic3R5bGVkIiwiZyIsInByb3BzIiwiaXNSYW5nZWQiLCJ0aGVtZSIsInJhbmdlQnJ1c2hCZ2QiLCJCTFVFMiIsIm1vdmVSaWdodCIsInN0YXJ0U2VsIiwic2VsZWN0aW9uIiwic3RhcnRTZWwwIiwic2VsMCIsIkJvb2xlYW4iLCJnZXRIYW5kbGVQYXRoIiwiYnJ1c2hSZXNpemVQYXRoIiwiZCIsImUiLCJOdW1iZXIiLCJ0eXBlIiwieCIsImgiLCJ3IiwieSIsImhlaWdodCIsIlJhbmdlQnJ1c2hGYWN0b3J5IiwiUmFuZ2VCcnVzaCIsImV2dCIsInNvdXJjZUV2ZW50Iiwic2VsMSIsInJpZ2h0IiwiX3N0YXJ0U2VsIiwicmFuZ2UiLCJtaW4iLCJtYXgiLCJzdGVwIiwid2lkdGgiLCJtYXJrcyIsImludmVydCIsImQwIiwiZDEiLCJfbW92ZSIsIl9vbkJydXNoIiwib25Nb3VzZW92ZXJIYW5kbGUiLCJvbk1vdXNlb3V0SGFuZGxlIiwiYnJ1c2hpbmciLCJtb3ZpbmciLCJyb290Iiwicm9vdENvbnRhaW5lciIsImN1cnJlbnQiLCJicnVzaCIsImhhbmRsZVNpemUiLCJvbiIsImV2ZW50Iiwib25CcnVzaFN0YXJ0IiwiX2xhc3RTZWwiLCJfYnJ1c2hlZCIsIl9jbGljayIsIm9uQnJ1c2hFbmQiLCJjYWxsIiwiaGFuZGxlIiwic2VsZWN0QWxsIiwiZGF0YSIsImVudGVyIiwiYXBwZW5kIiwiYXR0ciIsInNsaWRlckhhbmRsZUNvbG9yIiwidmFsdWUiLCJ2YWwwIiwidmFsMSIsInByZXZQcm9wcyIsInByZXZWYWwwIiwicHJldlZhbDEiLCJzY2FsZSIsIm1vdmUiLCJpIiwiY3VycmVudFZhbDAiLCJjdXJyZW50VmFsMSIsIm9uQnJ1c2giLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImFycmF5T2YiLCJudW1i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QUU7QUFEVSxHQVZHO0FBaU0zQixTQUFPLGlDQUFVc0IsVUFBVixDQUFQO0FBQ0Q7O2VBRWNELGlCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50LCBjcmVhdGVSZWZ9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkLCB7d2l0aFRoZW1lfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge3NlbGVjdH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7YnJ1c2hYfSBmcm9tICdkMy1icnVzaCc7XG5pbXBvcnQge25vcm1hbGl6ZVNsaWRlclZhbHVlfSBmcm9tICd1dGlscy9kYXRhLXV0aWxzJztcblxuY29uc3QgU3R5bGVkRyA9IHN0eWxlZC5nYFxuICAuc2VsZWN0aW9uIHtcbiAgICBzdHJva2U6IG5vbmU7XG4gICAgZmlsbDogJHtwcm9wcyA9PiAocHJvcHMuaXNSYW5nZWQgPyBwcm9wcy50aGVtZS5yYW5nZUJydXNoQmdkIDogcHJvcHMudGhlbWUuQkxVRTIpfTtcbiAgICBmaWxsLW9wYWNpdHk6ICR7cHJvcHMgPT4gKHByb3BzLmlzUmFuZ2VkID8gMC4zIDogMSl9O1xuICB9XG4gIC5oYW5kbGUge1xuICAgIGZpbGw6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuQkxVRTJ9O1xuICAgIGZpbGwtb3BhY2l0eTogMC4zO1xuICB9XG5gO1xuXG5mdW5jdGlvbiBtb3ZlUmlnaHQoc3RhcnRTZWwsIHNlbGVjdGlvbikge1xuICBjb25zdCBbc3RhcnRTZWwwXSA9IHN0YXJ0U2VsO1xuICBjb25zdCBbc2VsMF0gPSBzZWxlY3Rpb247XG5cbiAgcmV0dXJuIEJvb2xlYW4oc3RhcnRTZWwwID09PSBzZWwwKTtcbn1cbi8vIHN0eWxlIGJydXNoIHJlc2l6ZSBoYW5kbGVcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9jcm9zc2ZpbHRlci9jcm9zc2ZpbHRlci9ibG9iL2doLXBhZ2VzL2luZGV4Lmh0bWwjTDQ2NlxuY29uc3QgZ2V0SGFuZGxlUGF0aCA9IHByb3BzID0+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGJydXNoUmVzaXplUGF0aChkKSB7XG4gICAgY29uc3QgZSA9IE51bWJlcihkLnR5cGUgPT09ICdlJyk7XG4gICAgY29uc3QgeCA9IGUgPyAxIDogLTE7XG4gICAgY29uc3QgaCA9IDM5O1xuICAgIGNvbnN0IHcgPSA0LjU7XG4gICAgY29uc3QgeSA9IChwcm9wcy5oZWlnaHQgLSBoKSAvIDI7XG4gICAgcmV0dXJuIGBNJHswLjUgKiB4fSwke3l9YyR7Mi41ICogeH0sMCwke3cgKiB4fSwyLCR7dyAqIHh9LCR7d312JHtoIC0gdyAqIDJ9YzAsMi41LCR7LTIgKlxuICAgICAgeH0sJHt3fSwkey13ICogeH0sJHt3fVYke3l9emA7XG4gIH07XG59O1xuXG5mdW5jdGlvbiBSYW5nZUJydXNoRmFjdG9yeSgpIHtcbiAgY2xhc3MgUmFuZ2VCcnVzaCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgIG9uQnJ1c2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICByYW5nZTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZCxcbiAgICAgIHZhbHVlOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubnVtYmVyKS5pc1JlcXVpcmVkLFxuICAgICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICAgIGlzUmFuZ2VkOiBQcm9wVHlwZXMuYm9vbFxuICAgIH07XG5cbiAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICAgaXNSYW5nZWQ6IHRydWVcbiAgICB9O1xuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAvLyBXZSB3YW50IHRoZSBSZWFjdCBhcHAgdG8gcmVzcG9uZCB0byBicnVzaCBzdGF0ZSBhbmQgdmljZS12ZXJzYVxuICAgICAgLy8gYnV0IGQzLWJydXNoIGZpcmVzIHRoZSBzYW1lIGV2ZW50cyBmb3IgYm90aCB1c2VyLWluaXRpYXRlZCBicnVzaGluZ1xuICAgICAgLy8gYW5kIHByb2dyYW1tYXRpYyBicnVzaGluZyAoYnJ1c2gubW92ZSkuIFdlIG5lZWQgdGhlc2UgZmxhZ3MgdG9cbiAgICAgIC8vIGRpc3Rpbmd1aXNoIGJldHdlZW4gdGhlIHVzZXMuXG4gICAgICAvL1xuICAgICAgLy8gV2UgZG9uJ3QgdXNlIHN0YXRlIGJlY2F1c2UgdGhhdCB3b3VsZCB0cmlnZ2VyIGFub3RoZXIgYGNvbXBvbmVudERpZFVwZGF0ZWBcbiAgICAgIGNvbnN0IHt0aGVtZSwgaXNSYW5nZWQsIG9uTW91c2VvdmVySGFuZGxlLCBvbk1vdXNlb3V0SGFuZGxlfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIHRoaXMuYnJ1c2hpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG5cbiAgICAgIHRoaXMucm9vdCA9IHNlbGVjdCh0aGlzLnJvb3RDb250YWluZXIuY3VycmVudCk7XG4gICAgICB0aGlzLmJydXNoID0gYnJ1c2hYKClcbiAgICAgICAgLmhhbmRsZVNpemUoMylcbiAgICAgICAgLm9uKCdzdGFydCcsIGV2ZW50ID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucHJvcHMub25CcnVzaFN0YXJ0ID09PSAnZnVuY3Rpb24nKSB0aGlzLnByb3BzLm9uQnJ1c2hTdGFydCgpO1xuICAgICAgICAgIHRoaXMuX3N0YXJ0U2VsID0gZXZlbnQuc2VsZWN0aW9uO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ2JydXNoJywgZXZlbnQgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZXZlbnQuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9sYXN0U2VsID0gZXZlbnQuc2VsZWN0aW9uO1xuICAgICAgICAgICAgdGhpcy5icnVzaGluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9icnVzaGVkKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignZW5kJywgZXZlbnQgPT4ge1xuICAgICAgICAgIGlmICghZXZlbnQuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5icnVzaGluZykge1xuICAgICAgICAgICAgICAvLyBoYW5kbGUgbnVsbCBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgdGhpcy5fY2xpY2sodGhpcy5fbGFzdFNlbCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3N0YXJ0U2VsKSB7XG4gICAgICAgICAgICAgIC8vIGhhbmRsZSBjbGlja1xuICAgICAgICAgICAgICB0aGlzLl9jbGljayh0aGlzLl9zdGFydFNlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLm9uQnJ1c2hFbmQgPT09ICdmdW5jdGlvbicpIHRoaXMucHJvcHMub25CcnVzaEVuZCgpO1xuXG4gICAgICAgICAgdGhpcy5icnVzaGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICB0aGlzLnJvb3QuY2FsbCh0aGlzLmJydXNoKTtcbiAgICAgIGNvbnN0IGJydXNoUmVzaXplUGF0aCA9IGdldEhhbmRsZVBhdGgodGhpcy5wcm9wcyk7XG4gICAgICB0aGlzLmhhbmRsZSA9IHRoaXMucm9vdFxuICAgICAgICAuc2VsZWN0QWxsKCcuaGFuZGxlLS1jdXN0b20nKVxuICAgICAgICAuZGF0YShbe3R5cGU6ICd3J30sIHt0eXBlOiAnZSd9XSlcbiAgICAgICAgLmVudGVyKClcbiAgICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdoYW5kbGUtLWN1c3RvbScpXG4gICAgICAgIC5hdHRyKCdkaXNwbGF5JywgaXNSYW5nZWQgPyBudWxsIDogJ25vbmUnKVxuICAgICAgICAuYXR0cignZmlsbCcsIHRoZW1lID8gdGhlbWUuc2xpZGVySGFuZGxlQ29sb3IgOiAnI0QzRDhFMCcpXG4gICAgICAgIC5hdHRyKCdjdXJzb3InLCAnZXctcmVzaXplJylcbiAgICAgICAgLmF0dHIoJ2QnLCBicnVzaFJlc2l6ZVBhdGgpXG4gICAgICAgIC5vbignbW91c2VvdmVyJywgKCkgPT4ge1xuICAgICAgICAgIGlmIChvbk1vdXNlb3ZlckhhbmRsZSkgb25Nb3VzZW92ZXJIYW5kbGUoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHtcbiAgICAgICAgICBpZiAob25Nb3VzZW91dEhhbmRsZSkgb25Nb3VzZW91dEhhbmRsZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qge1xuICAgICAgICB2YWx1ZTogW3ZhbDAsIHZhbDFdXG4gICAgICB9ID0gdGhpcy5wcm9wcztcbiAgICAgIHRoaXMubW92aW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuX21vdmUodmFsMCwgdmFsMSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgICAgY29uc3Qge1xuICAgICAgICB2YWx1ZTogW3ZhbDAsIHZhbDFdLFxuICAgICAgICB3aWR0aFxuICAgICAgfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBbcHJldlZhbDAsIHByZXZWYWwxXSA9IHByZXZQcm9wcy52YWx1ZTtcblxuICAgICAgaWYgKHByZXZQcm9wcy53aWR0aCAhPT0gd2lkdGgpIHtcbiAgICAgICAgLy8gd2lkdGggY2hhbmdlIHNob3VsZCBub3QgdHJpZ2dlciB0aGlzLl9icnVzaGVkXG4gICAgICAgIHRoaXMubW92aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yb290LmNhbGwodGhpcy5icnVzaCk7XG4gICAgICAgIHRoaXMuX21vdmUodmFsMCwgdmFsMSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5icnVzaGluZyAmJiAhdGhpcy5tb3ZpbmcpIHtcbiAgICAgICAgaWYgKHByZXZWYWwwICE9PSB2YWwwIHx8IHByZXZWYWwxICE9PSB2YWwxKSB7XG4gICAgICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX21vdmUodmFsMCwgdmFsMSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLnByb3BzLmlzUmFuZ2VkKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlLmF0dHIoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJvb3RDb250YWluZXIgPSBjcmVhdGVSZWYoKTtcblxuICAgIF9jbGljayhzZWxlY3Rpb24pIHtcbiAgICAgIC8vIGZha2UgYnJ1c2hcbiAgICAgIHRoaXMuYnJ1c2hpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5fYnJ1c2hlZCh7c291cmNlRXZlbnQ6IHt9LCBzZWxlY3Rpb259KTtcbiAgICB9XG5cbiAgICBfbW92ZSh2YWwwLCB2YWwxKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHJhbmdlOiBbbWluLCBtYXhdLFxuICAgICAgICB3aWR0aCxcbiAgICAgICAgaXNSYW5nZWRcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBpZiAod2lkdGggJiYgbWF4IC0gbWluKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlID0geCA9PiAoKHggLSBtaW4pICogd2lkdGgpIC8gKG1heCAtIG1pbik7XG4gICAgICAgIGlmICghaXNSYW5nZWQpIHtcbiAgICAgICAgICAvLyBvbmx5IGRyYXcgYSAxIHBpeGVsIGxpbmVcbiAgICAgICAgICB0aGlzLmJydXNoLm1vdmUodGhpcy5yb290LCBbc2NhbGUodmFsMCksIHNjYWxlKHZhbDApICsgMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYnJ1c2gubW92ZSh0aGlzLnJvb3QsIFtzY2FsZSh2YWwwKSwgc2NhbGUodmFsMSldKTtcblxuICAgICAgICAgIHRoaXMuaGFuZGxlXG4gICAgICAgICAgICAuYXR0cignZGlzcGxheScsIG51bGwpXG4gICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+IGB0cmFuc2xhdGUoJHtbaSA9PT0gMCA/IHNjYWxlKHZhbDApIDogc2NhbGUodmFsMSksIDBdfSlgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9icnVzaGVkID0gZXZ0ID0+IHtcbiAgICAgIC8vIElnbm9yZSBicnVzaCBldmVudHMgd2hpY2ggZG9uJ3QgaGF2ZSBhbiB1bmRlcmx5aW5nIHNvdXJjZUV2ZW50XG4gICAgICBpZiAoIWV2dC5zb3VyY2VFdmVudCkgcmV0dXJuO1xuICAgICAgY29uc3QgW3NlbDAsIHNlbDFdID0gZXZ0LnNlbGVjdGlvbjtcbiAgICAgIGNvbnN0IHJpZ2h0ID0gbW92ZVJpZ2h0KHRoaXMuX3N0YXJ0U2VsLCBldnQuc2VsZWN0aW9uKTtcblxuICAgICAgY29uc3Qge1xuICAgICAgICByYW5nZTogW21pbiwgbWF4XSxcbiAgICAgICAgc3RlcCxcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIG1hcmtzLFxuICAgICAgICBpc1JhbmdlZFxuICAgICAgfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBpbnZlcnQgPSB4ID0+ICh4ICogKG1heCAtIG1pbikpIC8gd2lkdGggKyBtaW47XG4gICAgICBsZXQgZDAgPSBpbnZlcnQoc2VsMCk7XG4gICAgICBsZXQgZDEgPSBpbnZlcnQoc2VsMSk7XG5cbiAgICAgIGQwID0gbm9ybWFsaXplU2xpZGVyVmFsdWUoZDAsIG1pbiwgc3RlcCwgbWFya3MpO1xuICAgICAgZDEgPSBub3JtYWxpemVTbGlkZXJWYWx1ZShkMSwgbWluLCBzdGVwLCBtYXJrcyk7XG5cbiAgICAgIGlmIChpc1JhbmdlZCkgdGhpcy5fbW92ZShkMCwgZDEpO1xuICAgICAgZWxzZSB0aGlzLl9tb3ZlKC4uLihyaWdodCA/IFtkMSwgZDFdIDogW2QwLCBkMF0pKTtcblxuICAgICAgaWYgKGlzUmFuZ2VkKSB0aGlzLl9vbkJydXNoKGQwLCBkMSk7XG4gICAgICBlbHNlIHRoaXMuX29uQnJ1c2gocmlnaHQgPyBkMSA6IGQwKTtcbiAgICB9O1xuXG4gICAgX29uQnJ1c2godmFsMCwgdmFsMSkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBpc1JhbmdlZCxcbiAgICAgICAgdmFsdWU6IFtjdXJyZW50VmFsMCwgY3VycmVudFZhbDFdXG4gICAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgaWYgKGN1cnJlbnRWYWwwID09PSB2YWwwICYmIGN1cnJlbnRWYWwxID09PSB2YWwxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzUmFuZ2VkKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25CcnVzaCh2YWwwLCB2YWwxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHJvcHMub25CcnVzaCh2YWwwLCB2YWwwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7aXNSYW5nZWR9ID0gdGhpcy5wcm9wcztcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdHlsZWRHIGNsYXNzTmFtZT1cImtnLXJhbmdlLXNsaWRlcl9fYnJ1c2hcIiBpc1JhbmdlZD17aXNSYW5nZWR9IHJlZj17dGhpcy5yb290Q29udGFpbmVyfSAvPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHdpdGhUaGVtZShSYW5nZUJydXNoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFuZ2VCcnVzaEZhY3Rvcnk7XG4iXX0=