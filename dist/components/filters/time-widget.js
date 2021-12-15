"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeWidgetTopFactory = TimeWidgetTopFactory;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _styledComponents2 = require("../common/styled-components");

var _icons = require("../common/icons");

var _timeRangeSlider = _interopRequireDefault(require("../common/time-range-slider"));

var _fieldSelector = _interopRequireDefault(require("../common/field-selector"));

var _floatingTimeDisplay = _interopRequireDefault(require("../common/animation-control/floating-time-display"));

var _timeRangeFilter = require("./time-range-filter");

var _templateObject, _templateObject2, _templateObject3;

var TOP_SECTION_HEIGHT = '36px';
var TimeBottomWidgetInner = (0, _styledComponents["default"])(_styledComponents2.BottomWidgetInner)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 6px 32px 24px 32px;\n"])));

var TopSectionWrapper = _styledComponents["default"].div.attrs({
  className: 'time-widget--top'
})(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n  color: ", ";\n  height: ", ";\n\n  .bottom-widget__y-axis {\n    flex-grow: 1;\n    margin-left: 20px;\n  }\n\n  .bottom-widget__field-select {\n    width: 160px;\n    display: inline-block;\n\n    .item-selector__dropdown {\n      background: transparent;\n      padding: 4px 10px 4px 4px;\n      border-color: transparent;\n\n      :active,\n      :focus,\n      &.focus,\n      &.active {\n        background: transparent;\n        border-color: transparent;\n      }\n    }\n\n    .item-selector__dropdown:hover {\n      background: transparent;\n      border-color: transparent;\n\n      .item-selector__dropdown__value {\n        color: ", ";\n      }\n    }\n  }\n\n  .animation-control__speed-control {\n    margin-right: -12px;\n\n    .animation-control__speed-slider {\n      right: calc(0% - 48px);\n    }\n  }\n"])), function (props) {
  return props.theme.labelColor;
}, TOP_SECTION_HEIGHT, function (props) {
  return props.hoverColor ? props.theme[props.hoverColor] : props.theme.textColorHl;
});

var StyledTitle = (0, _styledComponents["default"])(_styledComponents2.CenterFlexbox)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  flex-grow: 0;\n  color: ", ";\n  margin-right: 10px;\n\n  .bottom-widget__icon {\n    margin-right: 6px;\n  }\n  .bottom-widget__icon.speed {\n    margin-right: 0;\n  }\n"])), function (props) {
  return props.theme.textColor;
});
TimeWidgetTopFactory.deps = [_fieldSelector["default"]];

function TimeWidgetTopFactory(FieldSelector) {
  var TimeWidgetTop = function TimeWidgetTop(_ref) {
    var filter = _ref.filter,
        readOnly = _ref.readOnly,
        datasets = _ref.datasets,
        setFilterPlot = _ref.setFilterPlot,
        index = _ref.index,
        onClose = _ref.onClose;
    var yAxisFields = (0, _react.useMemo)(function () {
      return ((datasets[filter.dataId[0]] || {}).fields || []).filter(function (f) {
        return f.type === 'integer' || f.type === 'real';
      });
    }, [datasets, filter.dataId]);

    var _setFilterPlotYAxis = (0, _react.useCallback)(function (value) {
      return setFilterPlot(index, {
        yAxis: value
      });
    }, [setFilterPlot, index]);

    return /*#__PURE__*/_react["default"].createElement(TopSectionWrapper, null, /*#__PURE__*/_react["default"].createElement(StyledTitle, {
      className: "bottom-widget__field"
    }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.CenterFlexbox, {
      className: "bottom-widget__icon"
    }, /*#__PURE__*/_react["default"].createElement(_icons.Clock, {
      height: "15px"
    })), /*#__PURE__*/_react["default"].createElement(_styledComponents2.SelectTextBold, null, filter.name)), /*#__PURE__*/_react["default"].createElement(StyledTitle, {
      className: "bottom-widget__y-axis"
    }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.CenterFlexbox, {
      className: "bottom-widget__icon"
    }, /*#__PURE__*/_react["default"].createElement(_icons.LineChart, {
      height: "15px"
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "bottom-widget__field-select"
    }, /*#__PURE__*/_react["default"].createElement(FieldSelector, {
      fields: yAxisFields,
      placement: "top",
      id: "selected-time-widget-field",
      value: filter.yAxis ? filter.yAxis.name : null,
      onSelect: _setFilterPlotYAxis,
      placeholder: "placeholder.yAxis",
      erasable: true,
      showToken: false
    }))), !readOnly ? /*#__PURE__*/_react["default"].createElement(_styledComponents2.CenterFlexbox, null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.IconRoundSmall, null, /*#__PURE__*/_react["default"].createElement(_icons.Close, {
      height: "12px",
      onClick: onClose
    }))) : null);
  };

  return TimeWidgetTop;
}

TimeWidgetFactory.deps = [_timeRangeSlider["default"], _floatingTimeDisplay["default"], TimeWidgetTopFactory];

function TimeWidgetFactory(TimeRangeSlider, FloatingTimeDisplay, TimeWidgetTop) {
  var TimeWidget = function TimeWidget(_ref2) {
    var datasets = _ref2.datasets,
        filter = _ref2.filter,
        index = _ref2.index,
        readOnly = _ref2.readOnly,
        showTimeDisplay = _ref2.showTimeDisplay,
        setFilterAnimationTime = _ref2.setFilterAnimationTime,
        resetAnimation = _ref2.resetAnimation,
        isAnimatable = _ref2.isAnimatable,
        updateAnimationSpeed = _ref2.updateAnimationSpeed,
        toggleAnimation = _ref2.toggleAnimation,
        enlargeFilter = _ref2.enlargeFilter,
        setFilterPlot = _ref2.setFilterPlot,
        setFilterAnimationWindow = _ref2.setFilterAnimationWindow;

    var _updateAnimationSpeed = (0, _react.useCallback)(function (speed) {
      return updateAnimationSpeed(index, speed);
    }, [updateAnimationSpeed, index]);

    var _toggleAnimation = (0, _react.useCallback)(function () {
      return toggleAnimation(index);
    }, [toggleAnimation, index]);

    var _onClose = (0, _react.useCallback)(function () {
      return enlargeFilter(index);
    }, [enlargeFilter, index]);

    var _setFilterAnimationWindow = (0, _react.useCallback)(function (animationWindow) {
      return setFilterAnimationWindow({
        id: filter.id,
        animationWindow: animationWindow
      });
    }, [setFilterAnimationWindow, filter.id]);

    var timeSliderOnChange = (0, _react.useCallback)(function (value) {
      return setFilterAnimationTime(index, 'value', value);
    }, [setFilterAnimationTime, index]);
    return /*#__PURE__*/_react["default"].createElement(TimeBottomWidgetInner, {
      className: "bottom-widget--inner"
    }, /*#__PURE__*/_react["default"].createElement(TimeWidgetTop, {
      filter: filter,
      readOnly: readOnly,
      datasets: datasets,
      setFilterPlot: setFilterPlot,
      index: index,
      onClose: _onClose
    }), /*#__PURE__*/_react["default"].createElement(TimeRangeSlider, (0, _extends2["default"])({}, (0, _timeRangeFilter.timeRangeSliderFieldsSelector)(filter), {
      onChange: timeSliderOnChange,
      toggleAnimation: _toggleAnimation,
      updateAnimationSpeed: _updateAnimationSpeed,
      setFilterAnimationWindow: _setFilterAnimationWindow,
      hideTimeTitle: showTimeDisplay,
      resetAnimation: resetAnimation,
      isAnimatable: isAnimatable
    })), showTimeDisplay ? /*#__PURE__*/_react["default"].createElement(FloatingTimeDisplay, {
      currentTime: filter.value,
      defaultTimeFormat: filter.defaultTimeFormat,
      timeFormat: filter.timeFormat,
      timezone: filter.timezone
    }) : null);
  };

  return /*#__PURE__*/_react["default"].memo(TimeWidget);
}

var _default = TimeWidgetFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2ZpbHRlcnMvdGltZS13aWRnZXQuanMiXSwibmFtZXMiOlsiVE9QX1NFQ1RJT05fSEVJR0hUIiwiVGltZUJvdHRvbVdpZGdldElubmVyIiwiQm90dG9tV2lkZ2V0SW5uZXIiLCJUb3BTZWN0aW9uV3JhcHBlciIsInN0eWxlZCIsImRpdiIsImF0dHJzIiwiY2xhc3NOYW1lIiwicHJvcHMiLCJ0aGVtZSIsImxhYmVsQ29sb3IiLCJob3ZlckNvbG9yIiwidGV4dENvbG9ySGwiLCJTdHlsZWRUaXRsZSIsIkNlbnRlckZsZXhib3giLCJ0ZXh0Q29sb3IiLCJUaW1lV2lkZ2V0VG9wRmFjdG9yeSIsImRlcHMiLCJGaWVsZFNlbGVjdG9yRmFjdG9yeSIsIkZpZWxkU2VsZWN0b3IiLCJUaW1lV2lkZ2V0VG9wIiwiZmlsdGVyIiwicmVhZE9ubHkiLCJkYXRhc2V0cyIsInNldEZpbHRlclBsb3QiLCJpbmRleCIsIm9uQ2xvc2UiLCJ5QXhpc0ZpZWxkcyIsImRhdGFJZCIsImZpZWxkcyIsImYiLCJ0eXBlIiwiX3NldEZpbHRlclBsb3RZQXhpcyIsInZhbHVlIiwieUF4aXMiLCJuYW1lIiwiVGltZVdpZGdldEZhY3RvcnkiLCJUaW1lUmFuZ2VTbGlkZXJGYWN0b3J5IiwiRmxvYXRpbmdUaW1lRGlzcGxheUZhY3RvcnkiLCJUaW1lUmFuZ2VTbGlkZXIiLCJGbG9hdGluZ1RpbWVEaXNwbGF5IiwiVGltZVdpZGdldCIsInNob3dUaW1lRGlzcGxheSIsInNldEZpbHRlckFuaW1hdGlvblRpbWUiLCJyZXNldEFuaW1hdGlvbiIsImlzQW5pbWF0YWJsZSIsInVwZGF0ZUFuaW1hdGlvblNwZWVkIiwidG9nZ2xlQW5pbWF0aW9uIiwiZW5sYXJnZUZpbHRlciIsInNldEZpbHRlckFuaW1hdGlvbldpbmRvdyIsIl91cGRhdGVBbmltYXRpb25TcGVlZCIsInNwZWVkIiwiX3RvZ2dsZUFuaW1hdGlvbiIsIl9vbkNsb3NlIiwiX3NldEZpbHRlckFuaW1hdGlvbldpbmRvdyIsImFuaW1hdGlvbldpbmRvdyIsImlkIiwidGltZVNsaWRlck9uQ2hhbmdlIiwiZGVmYXVsdFRpbWVGb3JtYXQiLCJ0aW1lRm9ybWF0IiwidGltZXpvbmUiLCJSZWFjdCIsIm1lbW8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBTUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsR0FBRyxNQUEzQjtBQUVBLElBQU1DLHFCQUFxQixHQUFHLGtDQUFPQyxvQ0FBUCxDQUFILHdIQUEzQjs7QUFHQSxJQUFNQyxpQkFBaUIsR0FBR0MsNkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUN6Q0MsRUFBQUEsU0FBUyxFQUFFO0FBRDhCLENBQWpCLENBQUgseTlCQU1aLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsVUFBaEI7QUFBQSxDQU5PLEVBT1hWLGtCQVBXLEVBcUNOLFVBQUFRLEtBQUs7QUFBQSxTQUNaQSxLQUFLLENBQUNHLFVBQU4sR0FBbUJILEtBQUssQ0FBQ0MsS0FBTixDQUFZRCxLQUFLLENBQUNHLFVBQWxCLENBQW5CLEdBQW1ESCxLQUFLLENBQUNDLEtBQU4sQ0FBWUcsV0FEbkQ7QUFBQSxDQXJDQyxDQUF2Qjs7QUFvREEsSUFBTUMsV0FBVyxHQUFHLGtDQUFPQyxnQ0FBUCxDQUFILHVRQUVOLFVBQUFOLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWU0sU0FBaEI7QUFBQSxDQUZDLENBQWpCO0FBYUFDLG9CQUFvQixDQUFDQyxJQUFyQixHQUE0QixDQUFDQyx5QkFBRCxDQUE1Qjs7QUFDTyxTQUFTRixvQkFBVCxDQUE4QkcsYUFBOUIsRUFBNkM7QUFDbEQsTUFBTUMsYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixPQUFpRTtBQUFBLFFBQS9EQyxNQUErRCxRQUEvREEsTUFBK0Q7QUFBQSxRQUF2REMsUUFBdUQsUUFBdkRBLFFBQXVEO0FB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Q0FBMUI7QUFBQSxLQUFqQixFQUFvRSxDQUM3RlUsc0JBRDZGLEVBRTdGbEIsS0FGNkYsQ0FBcEUsQ0FBM0I7QUFLQSx3QkFDRSxnQ0FBQyxxQkFBRDtBQUF1QixNQUFBLFNBQVMsRUFBQztBQUFqQyxvQkFDRSxnQ0FBQyxhQUFEO0FBQ0UsTUFBQSxNQUFNLEVBQUVKLE1BRFY7QUFFRSxNQUFBLFFBQVEsRUFBRUMsUUFGWjtBQUdFLE1BQUEsUUFBUSxFQUFFQyxRQUhaO0FBSUUsTUFBQSxhQUFhLEVBQUVDLGFBSmpCO0FBS0UsTUFBQSxLQUFLLEVBQUVDLEtBTFQ7QUFNRSxNQUFBLE9BQU8sRUFBRTRCO0FBTlgsTUFERixlQVNFLGdDQUFDLGVBQUQsZ0NBQ00sb0RBQThCaEMsTUFBOUIsQ0FETjtBQUVFLE1BQUEsUUFBUSxFQUFFb0Msa0JBRlo7QUFHRSxNQUFBLGVBQWUsRUFBRUwsZ0JBSG5CO0FBSUUsTUFBQSxvQkFBb0IsRUFBRUYscUJBSnhCO0FBS0UsTUFBQSx3QkFBd0IsRUFBRUkseUJBTDVCO0FBTUUsTUFBQSxhQUFhLEVBQUVaLGVBTmpCO0FBT0UsTUFBQSxjQUFjLEVBQUVFLGNBUGxCO0FBUUUsTUFBQSxZQUFZLEVBQUVDO0FBUmhCLE9BVEYsRUFtQkdILGVBQWUsZ0JBQ2QsZ0NBQUMsbUJBQUQ7QUFDRSxNQUFBLFdBQVcsRUFBRXJCLE1BQU0sQ0FBQ1ksS0FEdEI7QUFFRSxNQUFBLGlCQUFpQixFQUFFWixNQUFNLENBQUNxQyxpQkFGNUI7QUFHRSxNQUFBLFVBQVUsRUFBRXJDLE1BQU0sQ0FBQ3NDLFVBSHJCO0FBSUUsTUFBQSxRQUFRLEVBQUV0QyxNQUFNLENBQUN1QztBQUpuQixNQURjLEdBT1osSUExQk4sQ0FERjtBQThCRCxHQWhFRDs7QUFrRUEsc0JBQU9DLGtCQUFNQyxJQUFOLENBQVdyQixVQUFYLENBQVA7QUFDRDs7ZUFFY0wsaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHt1c2VDYWxsYmFjaywgdXNlTWVtb30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge1xuICBTZWxlY3RUZXh0Qm9sZCxcbiAgSWNvblJvdW5kU21hbGwsXG4gIENlbnRlckZsZXhib3gsXG4gIEJvdHRvbVdpZGdldElubmVyXG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Q2xvc2UsIENsb2NrLCBMaW5lQ2hhcnR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBUaW1lUmFuZ2VTbGlkZXJGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3RpbWUtcmFuZ2Utc2xpZGVyJztcbmltcG9ydCBGaWVsZFNlbGVjdG9yRmFjdG9yeSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9maWVsZC1zZWxlY3Rvcic7XG5pbXBvcnQgRmxvYXRpbmdUaW1lRGlzcGxheUZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9jb21tb24vYW5pbWF0aW9uLWNvbnRyb2wvZmxvYXRpbmctdGltZS1kaXNwbGF5JztcbmltcG9ydCB7dGltZVJhbmdlU2xpZGVyRmllbGRzU2VsZWN0b3J9IGZyb20gJy4vdGltZS1yYW5nZS1maWx0ZXInO1xuXG5jb25zdCBUT1BfU0VDVElPTl9IRUlHSFQgPSAnMzZweCc7XG5cbmNvbnN0IFRpbWVCb3R0b21XaWRnZXRJbm5lciA9IHN0eWxlZChCb3R0b21XaWRnZXRJbm5lcilgXG4gIHBhZGRpbmc6IDZweCAzMnB4IDI0cHggMzJweDtcbmA7XG5jb25zdCBUb3BTZWN0aW9uV3JhcHBlciA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICd0aW1lLXdpZGdldC0tdG9wJ1xufSlgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgd2lkdGg6IDEwMCU7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICBoZWlnaHQ6ICR7VE9QX1NFQ1RJT05fSEVJR0hUfTtcblxuICAuYm90dG9tLXdpZGdldF9feS1heGlzIHtcbiAgICBmbGV4LWdyb3c6IDE7XG4gICAgbWFyZ2luLWxlZnQ6IDIwcHg7XG4gIH1cblxuICAuYm90dG9tLXdpZGdldF9fZmllbGQtc2VsZWN0IHtcbiAgICB3aWR0aDogMTYwcHg7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXG4gICAgLml0ZW0tc2VsZWN0b3JfX2Ryb3Bkb3duIHtcbiAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgICAgcGFkZGluZzogNHB4IDEwcHggNHB4IDRweDtcbiAgICAgIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XG5cbiAgICAgIDphY3RpdmUsXG4gICAgICA6Zm9jdXMsXG4gICAgICAmLmZvY3VzLFxuICAgICAgJi5hY3RpdmUge1xuICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICAgICAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAuaXRlbS1zZWxlY3Rvcl9fZHJvcGRvd246aG92ZXIge1xuICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgICBib3JkZXItY29sb3I6IHRyYW5zcGFyZW50O1xuXG4gICAgICAuaXRlbS1zZWxlY3Rvcl9fZHJvcGRvd25fX3ZhbHVlIHtcbiAgICAgICAgY29sb3I6ICR7cHJvcHMgPT5cbiAgICAgICAgICBwcm9wcy5ob3ZlckNvbG9yID8gcHJvcHMudGhlbWVbcHJvcHMuaG92ZXJDb2xvcl0gOiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLmFuaW1hdGlvbi1jb250cm9sX19zcGVlZC1jb250cm9sIHtcbiAgICBtYXJnaW4tcmlnaHQ6IC0xMnB4O1xuXG4gICAgLmFuaW1hdGlvbi1jb250cm9sX19zcGVlZC1zbGlkZXIge1xuICAgICAgcmlnaHQ6IGNhbGMoMCUgLSA0OHB4KTtcbiAgICB9XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZFRpdGxlID0gc3R5bGVkKENlbnRlckZsZXhib3gpYFxuICBmbGV4LWdyb3c6IDA7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIG1hcmdpbi1yaWdodDogMTBweDtcblxuICAuYm90dG9tLXdpZGdldF9faWNvbiB7XG4gICAgbWFyZ2luLXJpZ2h0OiA2cHg7XG4gIH1cbiAgLmJvdHRvbS13aWRnZXRfX2ljb24uc3BlZWQge1xuICAgIG1hcmdpbi1yaWdodDogMDtcbiAgfVxuYDtcblxuVGltZVdpZGdldFRvcEZhY3RvcnkuZGVwcyA9IFtGaWVsZFNlbGVjdG9yRmFjdG9yeV07XG5leHBvcnQgZnVuY3Rpb24gVGltZVdpZGdldFRvcEZhY3RvcnkoRmllbGRTZWxlY3Rvcikge1xuICBjb25zdCBUaW1lV2lkZ2V0VG9wID0gKHtmaWx0ZXIsIHJlYWRPbmx5LCBkYXRhc2V0cywgc2V0RmlsdGVyUGxvdCwgaW5kZXgsIG9uQ2xvc2V9KSA9PiB7XG4gICAgY29uc3QgeUF4aXNGaWVsZHMgPSB1c2VNZW1vKFxuICAgICAgKCkgPT5cbiAgICAgICAgKChkYXRhc2V0c1tmaWx0ZXIuZGF0YUlkWzBdXSB8fCB7fSkuZmllbGRzIHx8IFtdKS5maWx0ZXIoXG4gICAgICAgICAgZiA9PiBmLnR5cGUgPT09ICdpbnRlZ2VyJyB8fCBmLnR5cGUgPT09ICdyZWFsJ1xuICAgICAgICApLFxuICAgICAgW2RhdGFzZXRzLCBmaWx0ZXIuZGF0YUlkXVxuICAgICk7XG4gICAgY29uc3QgX3NldEZpbHRlclBsb3RZQXhpcyA9IHVzZUNhbGxiYWNrKHZhbHVlID0+IHNldEZpbHRlclBsb3QoaW5kZXgsIHt5QXhpczogdmFsdWV9KSwgW1xuICAgICAgc2V0RmlsdGVyUGxvdCxcbiAgICAgIGluZGV4XG4gICAgXSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUb3BTZWN0aW9uV3JhcHBlcj5cbiAgICAgICAgPFN0eWxlZFRpdGxlIGNsYXNzTmFtZT1cImJvdHRvbS13aWRnZXRfX2ZpZWxkXCI+XG4gICAgICAgICAgPENlbnRlckZsZXhib3ggY2xhc3NOYW1lPVwiYm90dG9tLXdpZGdldF9faWNvblwiPlxuICAgICAgICAgICAgPENsb2NrIGhlaWdodD1cIjE1cHhcIiAvPlxuICAgICAgICAgIDwvQ2VudGVyRmxleGJveD5cbiAgICAgICAgICA8U2VsZWN0VGV4dEJvbGQ+e2ZpbHRlci5uYW1lfTwvU2VsZWN0VGV4dEJvbGQ+XG4gICAgICAgIDwvU3R5bGVkVGl0bGU+XG4gICAgICAgIDxTdHlsZWRUaXRsZSBjbGFzc05hbWU9XCJib3R0b20td2lkZ2V0X195LWF4aXNcIj5cbiAgICAgICAgICA8Q2VudGVyRmxleGJveCBjbGFzc05hbWU9XCJib3R0b20td2lkZ2V0X19pY29uXCI+XG4gICAgICAgICAgICA8TGluZUNoYXJ0IGhlaWdodD1cIjE1cHhcIiAvPlxuICAgICAgICAgIDwvQ2VudGVyRmxleGJveD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvdHRvbS13aWRnZXRfX2ZpZWxkLXNlbGVjdFwiPlxuICAgICAgICAgICAgPEZpZWxkU2VsZWN0b3JcbiAgICAgICAgICAgICAgZmllbGRzPXt5QXhpc0ZpZWxkc31cbiAgICAgICAgICAgICAgcGxhY2VtZW50PVwidG9wXCJcbiAgICAgICAgICAgICAgaWQ9XCJzZWxlY3RlZC10aW1lLXdpZGdldC1maWVsZFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtmaWx0ZXIueUF4aXMgPyBmaWx0ZXIueUF4aXMubmFtZSA6IG51bGx9XG4gICAgICAgICAgICAgIG9uU2VsZWN0PXtfc2V0RmlsdGVyUGxvdFlBeGlzfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cInBsYWNlaG9sZGVyLnlBeGlzXCJcbiAgICAgICAgICAgICAgZXJhc2FibGVcbiAgICAgICAgICAgICAgc2hvd1Rva2VuPXtmYWxzZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvU3R5bGVkVGl0bGU+XG4gICAgICAgIHshcmVhZE9ubHkgPyAoXG4gICAgICAgICAgPENlbnRlckZsZXhib3g+XG4gICAgICAgICAgICA8SWNvblJvdW5kU21hbGw+XG4gICAgICAgICAgICAgIDxDbG9zZSBoZWlnaHQ9XCIxMnB4XCIgb25DbGljaz17b25DbG9zZX0gLz5cbiAgICAgICAgICAgIDwvSWNvblJvdW5kU21hbGw+XG4gICAgICAgICAgPC9DZW50ZXJGbGV4Ym94PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvVG9wU2VjdGlvbldyYXBwZXI+XG4gICAgKTtcbiAgfTtcbiAgcmV0dXJuIFRpbWVXaWRnZXRUb3A7XG59XG5cblRpbWVXaWRnZXRGYWN0b3J5LmRlcHMgPSBbVGltZVJhbmdlU2xpZGVyRmFjdG9yeSwgRmxvYXRpbmdUaW1lRGlzcGxheUZhY3RvcnksIFRpbWVXaWRnZXRUb3BGYWN0b3J5XTtcbmZ1bmN0aW9uIFRpbWVXaWRnZXRGYWN0b3J5KFRpbWVSYW5nZVNsaWRlciwgRmxvYXRpbmdUaW1lRGlzcGxheSwgVGltZVdpZGdldFRvcCkge1xuICBjb25zdCBUaW1lV2lkZ2V0ID0gKHtcbiAgICBkYXRhc2V0cyxcbiAgICBmaWx0ZXIsXG4gICAgaW5kZXgsXG4gICAgcmVhZE9ubHksXG4gICAgc2hvd1RpbWVEaXNwbGF5LFxuICAgIHNldEZpbHRlckFuaW1hdGlvblRpbWUsXG4gICAgcmVzZXRBbmltYXRpb24sXG4gICAgaXNBbmltYXRhYmxlLFxuICAgIHVwZGF0ZUFuaW1hdGlvblNwZWVkLFxuICAgIHRvZ2dsZUFuaW1hdGlvbixcbiAgICBlbmxhcmdlRmlsdGVyLFxuICAgIHNldEZpbHRlclBsb3QsXG4gICAgc2V0RmlsdGVyQW5pbWF0aW9uV2luZG93XG4gIH0pID0+IHtcbiAgICBjb25zdCBfdXBkYXRlQW5pbWF0aW9uU3BlZWQgPSB1c2VDYWxsYmFjayhzcGVlZCA9PiB1cGRhdGVBbmltYXRpb25TcGVlZChpbmRleCwgc3BlZWQpLCBbXG4gICAgICB1cGRhdGVBbmltYXRpb25TcGVlZCxcbiAgICAgIGluZGV4XG4gICAgXSk7XG5cbiAgICBjb25zdCBfdG9nZ2xlQW5pbWF0aW9uID0gdXNlQ2FsbGJhY2soKCkgPT4gdG9nZ2xlQW5pbWF0aW9uKGluZGV4KSwgW3RvZ2dsZUFuaW1hdGlvbiwgaW5kZXhdKTtcblxuICAgIGNvbnN0IF9vbkNsb3NlID0gdXNlQ2FsbGJhY2soKCkgPT4gZW5sYXJnZUZpbHRlcihpbmRleCksIFtlbmxhcmdlRmlsdGVyLCBpbmRleF0pO1xuXG4gICAgY29uc3QgX3NldEZpbHRlckFuaW1hdGlvbldpbmRvdyA9IHVzZUNhbGxiYWNrKFxuICAgICAgYW5pbWF0aW9uV2luZG93ID0+IHNldEZpbHRlckFuaW1hdGlvbldpbmRvdyh7aWQ6IGZpbHRlci5pZCwgYW5pbWF0aW9uV2luZG93fSksXG4gICAgICBbc2V0RmlsdGVyQW5pbWF0aW9uV2luZG93LCBmaWx0ZXIuaWRdXG4gICAgKTtcblxuICAgIGNvbnN0IHRpbWVTbGlkZXJPbkNoYW5nZSA9IHVzZUNhbGxiYWNrKHZhbHVlID0+IHNldEZpbHRlckFuaW1hdGlvblRpbWUoaW5kZXgsICd2YWx1ZScsIHZhbHVlKSwgW1xuICAgICAgc2V0RmlsdGVyQW5pbWF0aW9uVGltZSxcbiAgICAgIGluZGV4XG4gICAgXSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFRpbWVCb3R0b21XaWRnZXRJbm5lciBjbGFzc05hbWU9XCJib3R0b20td2lkZ2V0LS1pbm5lclwiPlxuICAgICAgICA8VGltZVdpZGdldFRvcFxuICAgICAgICAgIGZpbHRlcj17ZmlsdGVyfVxuICAgICAgICAgIHJlYWRPbmx5PXtyZWFkT25seX1cbiAgICAgICAgICBkYXRhc2V0cz17ZGF0YXNldHN9XG4gICAgICAgICAgc2V0RmlsdGVyUGxvdD17c2V0RmlsdGVyUGxvdH1cbiAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgb25DbG9zZT17X29uQ2xvc2V9XG4gICAgICAgIC8+XG4gICAgICAgIDxUaW1lUmFuZ2VTbGlkZXJcbiAgICAgICAgICB7Li4udGltZVJhbmdlU2xpZGVyRmllbGRzU2VsZWN0b3IoZmlsdGVyKX1cbiAgICAgICAgICBvbkNoYW5nZT17dGltZVNsaWRlck9uQ2hhbmdlfVxuICAgICAgICAgIHRvZ2dsZUFuaW1hdGlvbj17X3RvZ2dsZUFuaW1hdGlvbn1cbiAgICAgICAgICB1cGRhdGVBbmltYXRpb25TcGVlZD17X3VwZGF0ZUFuaW1hdGlvblNwZWVkfVxuICAgICAgICAgIHNldEZpbHRlckFuaW1hdGlvbldpbmRvdz17X3NldEZpbHRlckFuaW1hdGlvbldpbmRvd31cbiAgICAgICAgICBoaWRlVGltZVRpdGxlPXtzaG93VGltZURpc3BsYXl9XG4gICAgICAgICAgcmVzZXRBbmltYXRpb249e3Jlc2V0QW5pbWF0aW9ufVxuICAgICAgICAgIGlzQW5pbWF0YWJsZT17aXNBbmltYXRhYmxlfVxuICAgICAgICAvPlxuICAgICAgICB7c2hvd1RpbWVEaXNwbGF5ID8gKFxuICAgICAgICAgIDxGbG9hdGluZ1RpbWVEaXNwbGF5XG4gICAgICAgICAgICBjdXJyZW50VGltZT17ZmlsdGVyLnZhbHVlfVxuICAgICAgICAgICAgZGVmYXVsdFRpbWVGb3JtYXQ9e2ZpbHRlci5kZWZhdWx0VGltZUZvcm1hdH1cbiAgICAgICAgICAgIHRpbWVGb3JtYXQ9e2ZpbHRlci50aW1lRm9ybWF0fVxuICAgICAgICAgICAgdGltZXpvbmU9e2ZpbHRlci50aW1lem9uZX1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvVGltZUJvdHRvbVdpZGdldElubmVyPlxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIFJlYWN0Lm1lbW8oVGltZVdpZGdldCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVXaWRnZXRGYWN0b3J5O1xuIl19