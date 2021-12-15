"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _reactVis = require("react-vis");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _dataUtils = require("../../utils/data-utils");

var _templateObject, _templateObject2;

var LineChartWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  .rv-xy-plot {\n    /* important for rendering hint */\n    position: relative;\n  }\n  .rv-xy-plot__inner {\n    /* important to show axis */\n    overflow: visible;\n  }\n\n  .rv-xy-plot__grid-lines__line {\n    stroke: ", ";\n    stroke-dasharray: 1px 4px;\n  }\n\n  .rv-xy-plot__axis__tick__text {\n    font-size: 9px;\n    fill: ", ";\n  }\n"])), function (props) {
  return props.theme.histogramFillOutRange;
}, function (props) {
  return props.theme.textColor;
});

var StyledHint = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: #d3d8e0;\n  border-radius: 2px;\n  color: ", ";\n  font-size: 9px;\n  margin: 4px;\n  padding: 3px 6px;\n  pointer-events: none;\n  user-select: none;\n"])), function (props) {
  return props.theme.textColorLT;
});

var HintContent = function HintContent(_ref) {
  var x = _ref.x,
      y = _ref.y,
      format = _ref.format;
  return /*#__PURE__*/_react["default"].createElement(StyledHint, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "hint--x"
  }, format(x)), /*#__PURE__*/_react["default"].createElement("div", {
    className: "row"
  }, y));
};

var MARGIN = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
};

function LineChartFactory() {
  var LineChart = function LineChart(_ref2) {
    var brushComponent = _ref2.brushComponent,
        brushing = _ref2.brushing,
        color = _ref2.color,
        enableChartHover = _ref2.enableChartHover,
        height = _ref2.height,
        hoveredDP = _ref2.hoveredDP,
        isEnlarged = _ref2.isEnlarged,
        lineChart = _ref2.lineChart,
        margin = _ref2.margin,
        onMouseMove = _ref2.onMouseMove,
        width = _ref2.width,
        timezone = _ref2.timezone,
        timeFormat = _ref2.timeFormat;
    var series = lineChart.series,
        yDomain = lineChart.yDomain;
    var brushData = (0, _react.useMemo)(function () {
      return [{
        x: series[0].x,
        y: yDomain[1],
        customComponent: function customComponent() {
          return brushComponent;
        }
      }];
    }, [series, yDomain, brushComponent]);
    var hintFormatter = (0, _react.useMemo)(function () {
      return (0, _dataUtils.datetimeFormatter)(timezone)(timeFormat);
    }, [timezone, timeFormat]);
    return /*#__PURE__*/_react["default"].createElement(LineChartWrapper, {
      style: {
        marginTop: "".concat(margin.top, "px")
      }
    }, /*#__PURE__*/_react["default"].createElement(_reactVis.XYPlot, {
      xType: "time",
      width: width,
      height: height,
      margin: MARGIN,
      onMouseLeave: function onMouseLeave() {
        onMouseMove(null);
      }
    }, /*#__PURE__*/_react["default"].createElement(_reactVis.HorizontalGridLines, {
      tickTotal: 3
    }), /*#__PURE__*/_react["default"].createElement(_reactVis.LineSeries, {
      style: {
        fill: 'none'
      },
      strokeWidth: 2,
      color: color,
      data: series,
      onNearestX: enableChartHover ? onMouseMove : null
    }), /*#__PURE__*/_react["default"].createElement(_reactVis.MarkSeries, {
      data: hoveredDP ? [hoveredDP] : [],
      color: color,
      size: 3
    }), /*#__PURE__*/_react["default"].createElement(_reactVis.CustomSVGSeries, {
      data: brushData
    }), isEnlarged && /*#__PURE__*/_react["default"].createElement(_reactVis.YAxis, {
      tickTotal: 3
    }), hoveredDP && enableChartHover && !brushing ? /*#__PURE__*/_react["default"].createElement(_reactVis.Hint, {
      value: hoveredDP
    }, /*#__PURE__*/_react["default"].createElement(HintContent, (0, _extends2["default"])({}, hoveredDP, {
      format: hintFormatter
    }))) : null));
  };

  return LineChart;
}

var _default = LineChartFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9saW5lLWNoYXJ0LmpzIl0sIm5hbWVzIjpbIkxpbmVDaGFydFdyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwiaGlzdG9ncmFtRmlsbE91dFJhbmdlIiwidGV4dENvbG9yIiwiU3R5bGVkSGludCIsInRleHRDb2xvckxUIiwiSGludENvbnRlbnQiLCJ4IiwieSIsImZvcm1hdCIsIk1BUkdJTiIsInRvcCIsImJvdHRvbSIsImxlZnQiLCJyaWdodCIsIkxpbmVDaGFydEZhY3RvcnkiLCJMaW5lQ2hhcnQiLCJicnVzaENvbXBvbmVudCIsImJydXNoaW5nIiwiY29sb3IiLCJlbmFibGVDaGFydEhvdmVyIiwiaGVpZ2h0IiwiaG92ZXJlZERQIiwiaXNFbmxhcmdlZCIsImxpbmVDaGFydCIsIm1hcmdpbiIsIm9uTW91c2VNb3ZlIiwid2lkdGgiLCJ0aW1lem9uZSIsInRpbWVGb3JtYXQiLCJzZXJpZXMiLCJ5RG9tYWluIiwiYnJ1c2hEYXRhIiwiY3VzdG9tQ29tcG9uZW50IiwiaGludEZvcm1hdHRlciIsIm1hcmdpblRvcCIsImZpbGwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFTQTs7QUFDQTs7OztBQUVBLElBQU1BLGdCQUFnQixHQUFHQyw2QkFBT0MsR0FBVixvYkFXUixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLHFCQUFoQjtBQUFBLENBWEcsRUFpQlYsVUFBQUYsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZRSxTQUFoQjtBQUFBLENBakJLLENBQXRCOztBQXFCQSxJQUFNQyxVQUFVLEdBQUdOLDZCQUFPQyxHQUFWLHVRQUdMLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUksV0FBaEI7QUFBQSxDQUhBLENBQWhCOztBQVdBLElBQU1DLFdBQVcsR0FBRyxTQUFk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aUI7QUFML0MsTUFWRixlQWlCRSxnQ0FBQyxvQkFBRDtBQUFZLE1BQUEsSUFBSSxFQUFFSixTQUFTLEdBQUcsQ0FBQ0EsU0FBRCxDQUFILEdBQWlCLEVBQTVDO0FBQWdELE1BQUEsS0FBSyxFQUFFSCxLQUF2RDtBQUE4RCxNQUFBLElBQUksRUFBRTtBQUFwRSxNQWpCRixlQWtCRSxnQ0FBQyx5QkFBRDtBQUFpQixNQUFBLElBQUksRUFBRWE7QUFBdkIsTUFsQkYsRUFtQkdULFVBQVUsaUJBQUksZ0NBQUMsZUFBRDtBQUFPLE1BQUEsU0FBUyxFQUFFO0FBQWxCLE1BbkJqQixFQW9CR0QsU0FBUyxJQUFJRixnQkFBYixJQUFpQyxDQUFDRixRQUFsQyxnQkFDQyxnQ0FBQyxjQUFEO0FBQU0sTUFBQSxLQUFLLEVBQUVJO0FBQWIsb0JBQ0UsZ0NBQUMsV0FBRCxnQ0FBaUJBLFNBQWpCO0FBQTRCLE1BQUEsTUFBTSxFQUFFWTtBQUFwQyxPQURGLENBREQsR0FJRyxJQXhCTixDQURGLENBREY7QUE4QkQsR0F2REQ7O0FBd0RBLFNBQU9sQixTQUFQO0FBQ0Q7O2VBRWNELGdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7dXNlTWVtb30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgSG9yaXpvbnRhbEdyaWRMaW5lcyxcbiAgTGluZVNlcmllcyxcbiAgWFlQbG90LFxuICBDdXN0b21TVkdTZXJpZXMsXG4gIEhpbnQsXG4gIFlBeGlzLFxuICBNYXJrU2VyaWVzXG59IGZyb20gJ3JlYWN0LXZpcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7ZGF0ZXRpbWVGb3JtYXR0ZXJ9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuXG5jb25zdCBMaW5lQ2hhcnRXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgLnJ2LXh5LXBsb3Qge1xuICAgIC8qIGltcG9ydGFudCBmb3IgcmVuZGVyaW5nIGhpbnQgKi9cbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIH1cbiAgLnJ2LXh5LXBsb3RfX2lubmVyIHtcbiAgICAvKiBpbXBvcnRhbnQgdG8gc2hvdyBheGlzICovXG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XG4gIH1cblxuICAucnYteHktcGxvdF9fZ3JpZC1saW5lc19fbGluZSB7XG4gICAgc3Ryb2tlOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmhpc3RvZ3JhbUZpbGxPdXRSYW5nZX07XG4gICAgc3Ryb2tlLWRhc2hhcnJheTogMXB4IDRweDtcbiAgfVxuXG4gIC5ydi14eS1wbG90X19heGlzX190aWNrX190ZXh0IHtcbiAgICBmb250LXNpemU6IDlweDtcbiAgICBmaWxsOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZEhpbnQgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZDNkOGUwO1xuICBib3JkZXItcmFkaXVzOiAycHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckxUfTtcbiAgZm9udC1zaXplOiA5cHg7XG4gIG1hcmdpbjogNHB4O1xuICBwYWRkaW5nOiAzcHggNnB4O1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG5gO1xuXG5jb25zdCBIaW50Q29udGVudCA9ICh7eCwgeSwgZm9ybWF0fSkgPT4gKFxuICA8U3R5bGVkSGludD5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhpbnQtLXhcIj57Zm9ybWF0KHgpfTwvZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+e3l9PC9kaXY+XG4gIDwvU3R5bGVkSGludD5cbik7XG5cbmNvbnN0IE1BUkdJTiA9IHt0b3A6IDAsIGJvdHRvbTogMCwgbGVmdDogMCwgcmlnaHQ6IDB9O1xuZnVuY3Rpb24gTGluZUNoYXJ0RmFjdG9yeSgpIHtcbiAgY29uc3QgTGluZUNoYXJ0ID0gKHtcbiAgICBicnVzaENvbXBvbmVudCxcbiAgICBicnVzaGluZyxcbiAgICBjb2xvcixcbiAgICBlbmFibGVDaGFydEhvdmVyLFxuICAgIGhlaWdodCxcbiAgICBob3ZlcmVkRFAsXG4gICAgaXNFbmxhcmdlZCxcbiAgICBsaW5lQ2hhcnQsXG4gICAgbWFyZ2luLFxuICAgIG9uTW91c2VNb3ZlLFxuICAgIHdpZHRoLFxuICAgIHRpbWV6b25lLFxuICAgIHRpbWVGb3JtYXRcbiAgfSkgPT4ge1xuICAgIGNvbnN0IHtzZXJpZXMsIHlEb21haW59ID0gbGluZUNoYXJ0O1xuXG4gICAgY29uc3QgYnJ1c2hEYXRhID0gdXNlTWVtbygoKSA9PiB7XG4gICAgICByZXR1cm4gW3t4OiBzZXJpZXNbMF0ueCwgeTogeURvbWFpblsxXSwgY3VzdG9tQ29tcG9uZW50OiAoKSA9PiBicnVzaENvbXBvbmVudH1dO1xuICAgIH0sIFtzZXJpZXMsIHlEb21haW4sIGJydXNoQ29tcG9uZW50XSk7XG4gICAgY29uc3QgaGludEZvcm1hdHRlciA9IHVzZU1lbW8oKCkgPT4gZGF0ZXRpbWVGb3JtYXR0ZXIodGltZXpvbmUpKHRpbWVGb3JtYXQpLCBbXG4gICAgICB0aW1lem9uZSxcbiAgICAgIHRpbWVGb3JtYXRcbiAgICBdKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8TGluZUNoYXJ0V3JhcHBlciBzdHlsZT17e21hcmdpblRvcDogYCR7bWFyZ2luLnRvcH1weGB9fT5cbiAgICAgICAgPFhZUGxvdFxuICAgICAgICAgIHhUeXBlPVwidGltZVwiXG4gICAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgIG1hcmdpbj17TUFSR0lOfVxuICAgICAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4ge1xuICAgICAgICAgICAgb25Nb3VzZU1vdmUobnVsbCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxIb3Jpem9udGFsR3JpZExpbmVzIHRpY2tUb3RhbD17M30gLz5cbiAgICAgICAgICA8TGluZVNlcmllc1xuICAgICAgICAgICAgc3R5bGU9e3tmaWxsOiAnbm9uZSd9fVxuICAgICAgICAgICAgc3Ryb2tlV2lkdGg9ezJ9XG4gICAgICAgICAgICBjb2xvcj17Y29sb3J9XG4gICAgICAgICAgICBkYXRhPXtzZXJpZXN9XG4gICAgICAgICAgICBvbk5lYXJlc3RYPXtlbmFibGVDaGFydEhvdmVyID8gb25Nb3VzZU1vdmUgOiBudWxsfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPE1hcmtTZXJpZXMgZGF0YT17aG92ZXJlZERQID8gW2hvdmVyZWREUF0gOiBbXX0gY29sb3I9e2NvbG9yfSBzaXplPXszfSAvPlxuICAgICAgICAgIDxDdXN0b21TVkdTZXJpZXMgZGF0YT17YnJ1c2hEYXRhfSAvPlxuICAgICAgICAgIHtpc0VubGFyZ2VkICYmIDxZQXhpcyB0aWNrVG90YWw9ezN9IC8+fVxuICAgICAgICAgIHtob3ZlcmVkRFAgJiYgZW5hYmxlQ2hhcnRIb3ZlciAmJiAhYnJ1c2hpbmcgPyAoXG4gICAgICAgICAgICA8SGludCB2YWx1ZT17aG92ZXJlZERQfT5cbiAgICAgICAgICAgICAgPEhpbnRDb250ZW50IHsuLi5ob3ZlcmVkRFB9IGZvcm1hdD17aGludEZvcm1hdHRlcn0gLz5cbiAgICAgICAgICAgIDwvSGludD5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9YWVBsb3Q+XG4gICAgICA8L0xpbmVDaGFydFdyYXBwZXI+XG4gICAgKTtcbiAgfTtcbiAgcmV0dXJuIExpbmVDaGFydDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTGluZUNoYXJ0RmFjdG9yeTtcbiJdfQ==