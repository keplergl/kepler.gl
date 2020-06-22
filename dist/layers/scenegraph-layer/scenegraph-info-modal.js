"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _styledComponents2 = require("../../components/common/styled-components");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 20px;\n  letter-spacing: 1.25px;\n  margin: 18px 0 14px 0;\n  color: ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledTitle = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.titleColorLT;
});

var ExampleTable = function ExampleTable() {
  return _react["default"].createElement(_styledComponents2.Table, {
    className: "scenegraph-example-table"
  }, _react["default"].createElement("thead", null, _react["default"].createElement("tr", null, _react["default"].createElement("th", null, "point_lat"), _react["default"].createElement("th", null, "point_lng"), _react["default"].createElement("th", null, "alt"))), _react["default"].createElement("tbody", null, _react["default"].createElement("tr", null, _react["default"].createElement("td", null, "37.769897"), _react["default"].createElement("td", null, "-122.41168"), _react["default"].createElement("td", null, "0")), _react["default"].createElement("tr", null, _react["default"].createElement("td", null, "37.806928"), _react["default"].createElement("td", null, "-122.40218"), _react["default"].createElement("td", null, "0")), _react["default"].createElement("tr", null, _react["default"].createElement("td", null, "37.778564"), _react["default"].createElement("td", null, "-122.39096"), _react["default"].createElement("td", null, "1000")), _react["default"].createElement("tr", null, _react["default"].createElement("td", null, "37.745995"), _react["default"].createElement("td", null, "-122.30220"), _react["default"].createElement("td", null, "2000")), _react["default"].createElement("tr", null, _react["default"].createElement("td", null, "37.329841"), _react["default"].createElement("td", null, "-122.103847"), _react["default"].createElement("td", null, "3000"))));
};

var ScenegraphInfoModalFactory = function ScenegraphInfoModalFactory() {
  var ScenegraphInfoModal = function ScenegraphInfoModal() {
    return _react["default"].createElement("div", {
      className: "scenegraph-info-modal"
    }, _react["default"].createElement("div", {
      className: "scenegraph-info-modal__description"
    }, _react["default"].createElement("span", null, "In your csv you can specify points with optional altitude. The models will show at each point you specify. You can use a sample model or upload one in", ' '), _react["default"].createElement("code", null, "glTF (GLB or Embedded)"), _react["default"].createElement("span", null, " format.")), _react["default"].createElement("div", {
      className: "scenegraph-info-modal__example"
    }, _react["default"].createElement(StyledTitle, null, "Example:"), _react["default"].createElement(ExampleTable, null)), _react["default"].createElement("div", {
      className: "scenegraph-info-modal__icons"
    }, _react["default"].createElement(StyledTitle, null, "Sample Models"), _react["default"].createElement("div", null, "Duck"), _react["default"].createElement("div", null, "Use your own model")));
  };

  return ScenegraphInfoModal;
};

var _default = ScenegraphInfoModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvc2NlbmVncmFwaC1sYXllci9zY2VuZWdyYXBoLWluZm8tbW9kYWwuanMiXSwibmFtZXMiOlsiU3R5bGVkVGl0bGUiLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwidGl0bGVDb2xvckxUIiwiRXhhbXBsZVRhYmxlIiwiU2NlbmVncmFwaEluZm9Nb2RhbEZhY3RvcnkiLCJTY2VuZWdyYXBoSW5mb01vZGFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsV0FBVyxHQUFHQyw2QkFBT0MsR0FBVixvQkFJTixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFlBQWhCO0FBQUEsQ0FKQyxDQUFqQjs7QUFPQSxJQUFNQyxZQUFZLEdBQUcsU0FBZkEsWUFBZTtBQUFBLFNBQ25CLGdDQUFDLHdCQUFEO0FBQU8sSUFBQSxTQUFTLEVBQUM7QUFBakIsS0FDRSwrQ0FDRSw0Q0FDRSx3REFERixFQUVFLHdEQUZGLEVBR0Usa0RBSEYsQ0FERixDQURGLEVBUUUsK0NBQ0UsNENBQ0Usd0RBREYsRUFFRSx5REFGRixFQUdFLGdEQUhGLENBREYsRUFNRSw0Q0FDRSx3REFERixFQUVFLHlEQUZGLEVBR0UsZ0RBSEYsQ0FORixFQVdFLDRDQUNFLHdEQURGLEVBRUUseURBRkYsRUFHRSxtREFIRixDQVhGLEVBZ0JFLDRDQUNFLHdEQURGLEVBRUUseURBRkYsRUFHRSxtREFIRixDQWhCRixFQXFCRSw0Q0FDRSx3REFERixFQUVFLDBEQUZGLEVBR0UsbURBSEYsQ0FyQkYsQ0FSRixDQURtQjtBQUFBLENBQXJCOztBQXVDQSxJQUFNQywwQkFBMEIsR0FBRyxTQUE3QkEsMEJBQTZCLEdBQU07QUFDdkMsTUFBTUMsbUJBQW1CLEdBQUcsU0FBdEJBLG1CQUFzQjtBQUFBLFdBQzFCO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNFLHdNQUVpRSxHQUZqRSxDQURGLEVBS0UsdUVBTEYsRUFNRSx5REFORixDQURGLEVBU0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0UsZ0NBQUMsV0FBRCxtQkFERixFQUVFLGdDQUFDLFlBQUQsT0FGRixDQVRGLEVBYUU7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0UsZ0NBQUMsV0FBRCx3QkFERixFQUVFLG9EQUZGLEVBR0Usa0VBSEYsQ0FiRixDQUQwQjtBQUFBLEdBQTVCOztBQXNCQSxTQUFPQSxtQkFBUDtBQUNELENBeEJEOztlQTBCZUQsMEIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge1RhYmxlfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5cbmNvbnN0IFN0eWxlZFRpdGxlID0gc3R5bGVkLmRpdmBcbiAgZm9udC1zaXplOiAyMHB4O1xuICBsZXR0ZXItc3BhY2luZzogMS4yNXB4O1xuICBtYXJnaW46IDE4cHggMCAxNHB4IDA7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlQ29sb3JMVH07XG5gO1xuXG5jb25zdCBFeGFtcGxlVGFibGUgPSAoKSA9PiAoXG4gIDxUYWJsZSBjbGFzc05hbWU9XCJzY2VuZWdyYXBoLWV4YW1wbGUtdGFibGVcIj5cbiAgICA8dGhlYWQ+XG4gICAgICA8dHI+XG4gICAgICAgIDx0aD5wb2ludF9sYXQ8L3RoPlxuICAgICAgICA8dGg+cG9pbnRfbG5nPC90aD5cbiAgICAgICAgPHRoPmFsdDwvdGg+XG4gICAgICA8L3RyPlxuICAgIDwvdGhlYWQ+XG4gICAgPHRib2R5PlxuICAgICAgPHRyPlxuICAgICAgICA8dGQ+MzcuNzY5ODk3PC90ZD5cbiAgICAgICAgPHRkPi0xMjIuNDExNjg8L3RkPlxuICAgICAgICA8dGQ+MDwvdGQ+XG4gICAgICA8L3RyPlxuICAgICAgPHRyPlxuICAgICAgICA8dGQ+MzcuODA2OTI4PC90ZD5cbiAgICAgICAgPHRkPi0xMjIuNDAyMTg8L3RkPlxuICAgICAgICA8dGQ+MDwvdGQ+XG4gICAgICA8L3RyPlxuICAgICAgPHRyPlxuICAgICAgICA8dGQ+MzcuNzc4NTY0PC90ZD5cbiAgICAgICAgPHRkPi0xMjIuMzkwOTY8L3RkPlxuICAgICAgICA8dGQ+MTAwMDwvdGQ+XG4gICAgICA8L3RyPlxuICAgICAgPHRyPlxuICAgICAgICA8dGQ+MzcuNzQ1OTk1PC90ZD5cbiAgICAgICAgPHRkPi0xMjIuMzAyMjA8L3RkPlxuICAgICAgICA8dGQ+MjAwMDwvdGQ+XG4gICAgICA8L3RyPlxuICAgICAgPHRyPlxuICAgICAgICA8dGQ+MzcuMzI5ODQxPC90ZD5cbiAgICAgICAgPHRkPi0xMjIuMTAzODQ3PC90ZD5cbiAgICAgICAgPHRkPjMwMDA8L3RkPlxuICAgICAgPC90cj5cbiAgICA8L3Rib2R5PlxuICA8L1RhYmxlPlxuKTtcblxuY29uc3QgU2NlbmVncmFwaEluZm9Nb2RhbEZhY3RvcnkgPSAoKSA9PiB7XG4gIGNvbnN0IFNjZW5lZ3JhcGhJbmZvTW9kYWwgPSAoKSA9PiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzY2VuZWdyYXBoLWluZm8tbW9kYWxcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2NlbmVncmFwaC1pbmZvLW1vZGFsX19kZXNjcmlwdGlvblwiPlxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICBJbiB5b3VyIGNzdiB5b3UgY2FuIHNwZWNpZnkgcG9pbnRzIHdpdGggb3B0aW9uYWwgYWx0aXR1ZGUuIFRoZSBtb2RlbHMgd2lsbCBzaG93IGF0IGVhY2hcbiAgICAgICAgICBwb2ludCB5b3Ugc3BlY2lmeS4gWW91IGNhbiB1c2UgYSBzYW1wbGUgbW9kZWwgb3IgdXBsb2FkIG9uZSBpbnsnICd9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPGNvZGU+Z2xURiAoR0xCIG9yIEVtYmVkZGVkKTwvY29kZT5cbiAgICAgICAgPHNwYW4+IGZvcm1hdC48L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2NlbmVncmFwaC1pbmZvLW1vZGFsX19leGFtcGxlXCI+XG4gICAgICAgIDxTdHlsZWRUaXRsZT5FeGFtcGxlOjwvU3R5bGVkVGl0bGU+XG4gICAgICAgIDxFeGFtcGxlVGFibGUgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzY2VuZWdyYXBoLWluZm8tbW9kYWxfX2ljb25zXCI+XG4gICAgICAgIDxTdHlsZWRUaXRsZT5TYW1wbGUgTW9kZWxzPC9TdHlsZWRUaXRsZT5cbiAgICAgICAgPGRpdj5EdWNrPC9kaXY+XG4gICAgICAgIDxkaXY+VXNlIHlvdXIgb3duIG1vZGVsPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcblxuICByZXR1cm4gU2NlbmVncmFwaEluZm9Nb2RhbDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNjZW5lZ3JhcGhJbmZvTW9kYWxGYWN0b3J5O1xuIl19