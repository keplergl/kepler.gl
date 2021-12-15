"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = RangePlotFactory;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _rangeBrush = _interopRequireDefault(require("./range-brush"));

var _histogramPlot = _interopRequireDefault(require("./histogram-plot"));

var _lineChart = _interopRequireDefault(require("./line-chart"));

var _utils = require("../../utils/utils");

var _templateObject;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var StyledRangePlot = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: ", "px;\n  display: flex;\n  position: 'relative';\n"])), function (props) {
  return props.theme.sliderBarHeight;
});

RangePlotFactory.deps = [_rangeBrush["default"], _histogramPlot["default"], _lineChart["default"]];

function RangePlotFactory(RangeBrush, HistogramPlot, LineChart) {
  var RangePlot = function RangePlot(_ref) {
    var onBrush = _ref.onBrush,
        range = _ref.range,
        value = _ref.value,
        width = _ref.width,
        plotType = _ref.plotType,
        lineChart = _ref.lineChart,
        histogram = _ref.histogram,
        isEnlarged = _ref.isEnlarged,
        isRanged = _ref.isRanged,
        theme = _ref.theme,
        chartProps = (0, _objectWithoutProperties2["default"])(_ref, ["onBrush", "range", "value", "width", "plotType", "lineChart", "histogram", "isEnlarged", "isRanged", "theme"]);

    var _useState = (0, _react.useState)(false),
        _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
        brushing = _useState2[0],
        setBrushing = _useState2[1];

    var _useState3 = (0, _react.useState)(null),
        _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
        hoveredDP = _useState4[0],
        onMouseMove = _useState4[1];

    var _useState5 = (0, _react.useState)(false),
        _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
        enableChartHover = _useState6[0],
        setEnableChartHover = _useState6[1];

    var height = isEnlarged ? theme.rangePlotHLarge : theme.rangePlotH;
    var onBrushStart = (0, _react.useCallback)(function () {
      setBrushing(true);
      onMouseMove(null);
      setEnableChartHover(false);
    }, [setBrushing, onMouseMove, setEnableChartHover]);
    var onBrushEnd = (0, _react.useCallback)(function () {
      setBrushing(false);
      setEnableChartHover(true);
    }, [setBrushing, setEnableChartHover]);
    var onMouseoverHandle = (0, _react.useCallback)(function () {
      onMouseMove(null);
      setEnableChartHover(false);
    }, [onMouseMove, setEnableChartHover]);
    var onMouseoutHandle = (0, _react.useCallback)(function () {
      setEnableChartHover(true);
    }, [setEnableChartHover]); // JsDom have limited support for SVG, d3 will fail

    var brushComponent = (0, _utils.isTest)() ? null : /*#__PURE__*/_react["default"].createElement(RangeBrush, (0, _extends2["default"])({
      onBrush: onBrush,
      onBrushStart: onBrushStart,
      onBrushEnd: onBrushEnd,
      range: range,
      value: value,
      width: width,
      height: height,
      isRanged: isRanged,
      onMouseoverHandle: onMouseoverHandle,
      onMouseoutHandle: onMouseoutHandle
    }, chartProps));

    var commonProps = _objectSpread({
      width: width,
      value: value,
      height: height,
      margin: isEnlarged ? theme.rangePlotMarginLarge : theme.rangePlotMargin,
      brushComponent: brushComponent,
      brushing: brushing,
      isEnlarged: isEnlarged,
      enableChartHover: enableChartHover,
      onMouseMove: onMouseMove,
      hoveredDP: hoveredDP,
      isRanged: isRanged
    }, chartProps);

    return /*#__PURE__*/_react["default"].createElement(StyledRangePlot, {
      style: {
        height: "".concat(isEnlarged ? theme.rangePlotContainerHLarge : theme.rangePlotContainerH, "px")
      },
      className: "kg-range-slider__plot"
    }, plotType === 'lineChart' && lineChart ? /*#__PURE__*/_react["default"].createElement(LineChart, (0, _extends2["default"])({
      lineChart: lineChart
    }, commonProps)) : /*#__PURE__*/_react["default"].createElement(HistogramPlot, (0, _extends2["default"])({
      histogram: histogram
    }, commonProps)));
  };

  RangePlot.propTypes = {
    value: _propTypes["default"].arrayOf(_propTypes["default"].number).isRequired,
    histogram: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      x0: _propTypes["default"].number,
      x1: _propTypes["default"].number
    })),
    lineChart: _propTypes["default"].object,
    plotType: _propTypes["default"].string,
    isEnlarged: _propTypes["default"].bool,
    onBlur: _propTypes["default"].func,
    width: _propTypes["default"].number.isRequired
  };
  return (0, _styledComponents.withTheme)(RangePlot);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9yYW5nZS1wbG90LmpzIl0sIm5hbWVzIjpbIlN0eWxlZFJhbmdlUGxvdCIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJzbGlkZXJCYXJIZWlnaHQiLCJSYW5nZVBsb3RGYWN0b3J5IiwiZGVwcyIsIlJhbmdlQnJ1c2hGYWN0b3J5IiwiSGlzdG9ncmFtUGxvdEZhY3RvcnkiLCJMaW5lQ2hhcnRGYWN0b3J5IiwiUmFuZ2VCcnVzaCIsIkhpc3RvZ3JhbVBsb3QiLCJMaW5lQ2hhcnQiLCJSYW5nZVBsb3QiLCJvbkJydXNoIiwicmFuZ2UiLCJ2YWx1ZSIsIndpZHRoIiwicGxvdFR5cGUiLCJsaW5lQ2hhcnQiLCJoaXN0b2dyYW0iLCJpc0VubGFyZ2VkIiwiaXNSYW5nZWQiLCJjaGFydFByb3BzIiwiYnJ1c2hpbmciLCJzZXRCcnVzaGluZyIsImhvdmVyZWREUCIsIm9uTW91c2VNb3ZlIiwiZW5hYmxlQ2hhcnRIb3ZlciIsInNldEVuYWJsZUNoYXJ0SG92ZXIiLCJoZWlnaHQiLCJyYW5nZVBsb3RITGFyZ2UiLCJyYW5nZVBsb3RIIiwib25CcnVzaFN0YXJ0Iiwib25CcnVzaEVuZCIsIm9uTW91c2VvdmVySGFuZGxlIiwib25Nb3VzZW91dEhhbmRsZSIsImJydXNoQ29tcG9uZW50IiwiY29tbW9uUHJvcHMiLCJtYXJnaW4iLCJyYW5nZVBsb3RNYXJnaW5MYXJnZSIsInJhbmdlUGxvdE1hcmdpbiIsInJhbmdlUGxvdENvbnRhaW5lckhMYXJnZSIsInJhbmdlUGxvdENvbnRhaW5lckgiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsInNoYXBlIiwieDAiLCJ4MSIsIm9iamVjdCIsInN0cmluZyIsImJvb2wiLCJvbkJsdXIiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FB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LFNBQVMsRUFBRXlCLHNCQUFVQyxPQUFWLENBQ1RELHNCQUFVSSxLQUFWLENBQWdCO0FBQ2RDLE1BQUFBLEVBQUUsRUFBRUwsc0JBQVVFLE1BREE7QUFFZEksTUFBQUEsRUFBRSxFQUFFTixzQkFBVUU7QUFGQSxLQUFoQixDQURTLENBRlM7QUFRcEI1QixJQUFBQSxTQUFTLEVBQUUwQixzQkFBVU8sTUFSRDtBQVNwQmxDLElBQUFBLFFBQVEsRUFBRTJCLHNCQUFVUSxNQVRBO0FBVXBCaEMsSUFBQUEsVUFBVSxFQUFFd0Isc0JBQVVTLElBVkY7QUFXcEJDLElBQUFBLE1BQU0sRUFBRVYsc0JBQVVXLElBWEU7QUFZcEJ2QyxJQUFBQSxLQUFLLEVBQUU0QixzQkFBVUUsTUFBVixDQUFpQkM7QUFaSixHQUF0QjtBQWNBLFNBQU8saUNBQVVuQyxTQUFWLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge3VzZVN0YXRlLCB1c2VDYWxsYmFja30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQsIHt3aXRoVGhlbWV9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBSYW5nZUJydXNoRmFjdG9yeSBmcm9tICcuL3JhbmdlLWJydXNoJztcbmltcG9ydCBIaXN0b2dyYW1QbG90RmFjdG9yeSBmcm9tICcuL2hpc3RvZ3JhbS1wbG90JztcbmltcG9ydCBMaW5lQ2hhcnRGYWN0b3J5IGZyb20gJy4vbGluZS1jaGFydCc7XG5pbXBvcnQge2lzVGVzdH0gZnJvbSAndXRpbHMvdXRpbHMnO1xuXG5jb25zdCBTdHlsZWRSYW5nZVBsb3QgPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tYm90dG9tOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnNsaWRlckJhckhlaWdodH1weDtcbiAgZGlzcGxheTogZmxleDtcbiAgcG9zaXRpb246ICdyZWxhdGl2ZSc7XG5gO1xuXG5SYW5nZVBsb3RGYWN0b3J5LmRlcHMgPSBbUmFuZ2VCcnVzaEZhY3RvcnksIEhpc3RvZ3JhbVBsb3RGYWN0b3J5LCBMaW5lQ2hhcnRGYWN0b3J5XTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmFuZ2VQbG90RmFjdG9yeShSYW5nZUJydXNoLCBIaXN0b2dyYW1QbG90LCBMaW5lQ2hhcnQpIHtcbiAgY29uc3QgUmFuZ2VQbG90ID0gKHtcbiAgICBvbkJydXNoLFxuICAgIHJhbmdlLFxuICAgIHZhbHVlLFxuICAgIHdpZHRoLFxuICAgIHBsb3RUeXBlLFxuICAgIGxpbmVDaGFydCxcbiAgICBoaXN0b2dyYW0sXG4gICAgaXNFbmxhcmdlZCxcbiAgICBpc1JhbmdlZCxcbiAgICB0aGVtZSxcbiAgICAuLi5jaGFydFByb3BzXG4gIH0pID0+IHtcbiAgICBjb25zdCBbYnJ1c2hpbmcsIHNldEJydXNoaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbaG92ZXJlZERQLCBvbk1vdXNlTW92ZV0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbZW5hYmxlQ2hhcnRIb3Zlciwgc2V0RW5hYmxlQ2hhcnRIb3Zlcl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgaGVpZ2h0ID0gaXNFbmxhcmdlZCA/IHRoZW1lLnJhbmdlUGxvdEhMYXJnZSA6IHRoZW1lLnJhbmdlUGxvdEg7XG5cbiAgICBjb25zdCBvbkJydXNoU3RhcnQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgICBzZXRCcnVzaGluZyh0cnVlKTtcbiAgICAgIG9uTW91c2VNb3ZlKG51bGwpO1xuICAgICAgc2V0RW5hYmxlQ2hhcnRIb3ZlcihmYWxzZSk7XG4gICAgfSwgW3NldEJydXNoaW5nLCBvbk1vdXNlTW92ZSwgc2V0RW5hYmxlQ2hhcnRIb3Zlcl0pO1xuXG4gICAgY29uc3Qgb25CcnVzaEVuZCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgIHNldEJydXNoaW5nKGZhbHNlKTtcbiAgICAgIHNldEVuYWJsZUNoYXJ0SG92ZXIodHJ1ZSk7XG4gICAgfSwgW3NldEJydXNoaW5nLCBzZXRFbmFibGVDaGFydEhvdmVyXSk7XG5cbiAgICBjb25zdCBvbk1vdXNlb3ZlckhhbmRsZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgIG9uTW91c2VNb3ZlKG51bGwpO1xuICAgICAgc2V0RW5hYmxlQ2hhcnRIb3ZlcihmYWxzZSk7XG4gICAgfSwgW29uTW91c2VNb3ZlLCBzZXRFbmFibGVDaGFydEhvdmVyXSk7XG5cbiAgICBjb25zdCBvbk1vdXNlb3V0SGFuZGxlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgc2V0RW5hYmxlQ2hhcnRIb3Zlcih0cnVlKTtcbiAgICB9LCBbc2V0RW5hYmxlQ2hhcnRIb3Zlcl0pO1xuXG4gICAgLy8gSnNEb20gaGF2ZSBsaW1pdGVkIHN1cHBvcnQgZm9yIFNWRywgZDMgd2lsbCBmYWlsXG4gICAgY29uc3QgYnJ1c2hDb21wb25lbnQgPSBpc1Rlc3QoKSA/IG51bGwgOiAoXG4gICAgICA8UmFuZ2VCcnVzaFxuICAgICAgICBvbkJydXNoPXtvbkJydXNofVxuICAgICAgICBvbkJydXNoU3RhcnQ9e29uQnJ1c2hTdGFydH1cbiAgICAgICAgb25CcnVzaEVuZD17b25CcnVzaEVuZH1cbiAgICAgICAgcmFuZ2U9e3JhbmdlfVxuICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgIGlzUmFuZ2VkPXtpc1JhbmdlZH1cbiAgICAgICAgb25Nb3VzZW92ZXJIYW5kbGU9e29uTW91c2VvdmVySGFuZGxlfVxuICAgICAgICBvbk1vdXNlb3V0SGFuZGxlPXtvbk1vdXNlb3V0SGFuZGxlfVxuICAgICAgICB7Li4uY2hhcnRQcm9wc31cbiAgICAgIC8+XG4gICAgKTtcblxuICAgIGNvbnN0IGNvbW1vblByb3BzID0ge1xuICAgICAgd2lkdGgsXG4gICAgICB2YWx1ZSxcbiAgICAgIGhlaWdodCxcbiAgICAgIG1hcmdpbjogaXNFbmxhcmdlZCA/IHRoZW1lLnJhbmdlUGxvdE1hcmdpbkxhcmdlIDogdGhlbWUucmFuZ2VQbG90TWFyZ2luLFxuICAgICAgYnJ1c2hDb21wb25lbnQsXG4gICAgICBicnVzaGluZyxcbiAgICAgIGlzRW5sYXJnZWQsXG4gICAgICBlbmFibGVDaGFydEhvdmVyLFxuICAgICAgb25Nb3VzZU1vdmUsXG4gICAgICBob3ZlcmVkRFAsXG4gICAgICBpc1JhbmdlZCxcbiAgICAgIC4uLmNoYXJ0UHJvcHNcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRSYW5nZVBsb3RcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQ6IGAke2lzRW5sYXJnZWQgPyB0aGVtZS5yYW5nZVBsb3RDb250YWluZXJITGFyZ2UgOiB0aGVtZS5yYW5nZVBsb3RDb250YWluZXJIfXB4YFxuICAgICAgICB9fVxuICAgICAgICBjbGFzc05hbWU9XCJrZy1yYW5nZS1zbGlkZXJfX3Bsb3RcIlxuICAgICAgPlxuICAgICAgICB7cGxvdFR5cGUgPT09ICdsaW5lQ2hhcnQnICYmIGxpbmVDaGFydCA/IChcbiAgICAgICAgICA8TGluZUNoYXJ0IGxpbmVDaGFydD17bGluZUNoYXJ0fSB7Li4uY29tbW9uUHJvcHN9IC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPEhpc3RvZ3JhbVBsb3QgaGlzdG9ncmFtPXtoaXN0b2dyYW19IHsuLi5jb21tb25Qcm9wc30gLz5cbiAgICAgICAgKX1cbiAgICAgIDwvU3R5bGVkUmFuZ2VQbG90PlxuICAgICk7XG4gIH07XG5cbiAgUmFuZ2VQbG90LnByb3BUeXBlcyA9IHtcbiAgICB2YWx1ZTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm51bWJlcikuaXNSZXF1aXJlZCxcbiAgICBoaXN0b2dyYW06IFByb3BUeXBlcy5hcnJheU9mKFxuICAgICAgUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgeDA6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgIHgxOiBQcm9wVHlwZXMubnVtYmVyXG4gICAgICB9KVxuICAgICksXG4gICAgbGluZUNoYXJ0OiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIHBsb3RUeXBlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGlzRW5sYXJnZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgIG9uQmx1cjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZFxuICB9O1xuICByZXR1cm4gd2l0aFRoZW1lKFJhbmdlUGxvdCk7XG59XG4iXX0=