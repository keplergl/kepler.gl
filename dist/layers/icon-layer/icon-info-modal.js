"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _d3Shape = require("d3-shape");

var _styledComponents2 = require("../../components/common/styled-components");

var _localization = require("../../localization");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

var lineFunction = (0, _d3Shape.line)().x(function (d) {
  return d[0] * 10;
}).y(function (d) {
  return d[1] * 10;
});

var IconShape = function IconShape(_ref) {
  var mesh = _ref.mesh;
  return /*#__PURE__*/_react["default"].createElement("svg", {
    width: "20px",
    height: "20px"
  }, /*#__PURE__*/_react["default"].createElement("g", {
    transform: "translate(10, 10)"
  }, mesh.cells.map(function (cell, i) {
    return /*#__PURE__*/_react["default"].createElement("path", {
      key: i,
      fill: "#000000",
      d: lineFunction(cell.map(function (idx) {
        return mesh.positions[idx];
      }))
    });
  })));
};

var StyledIconItem = (0, _styledComponents["default"])(_styledComponents2.CenterFlexbox)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  padding-left: 6px;\n  width: 180px;\n  height: 48px;\n  margin-right: 12px;\n\n  .icon-table_item__name {\n    margin-left: 12px;\n  }\n"])));

var StyledCode = _styledComponents["default"].code(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n"])), function (props) {
  return props.theme.titleColorLT;
});

var StyledTitle = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 20px;\n  letter-spacing: 1.25px;\n  margin: 18px 0 14px 0;\n  color: ", ";\n"])), function (props) {
  return props.theme.titleColorLT;
});

var IconItem = function IconItem(_ref2) {
  var _ref2$icon = _ref2.icon,
      id = _ref2$icon.id,
      mesh = _ref2$icon.mesh;
  return /*#__PURE__*/_react["default"].createElement(StyledIconItem, {
    className: "icon-table__item"
  }, /*#__PURE__*/_react["default"].createElement(IconShape, {
    className: "icon-table__item__shape",
    mesh: mesh
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "icon-table_item__name"
  }, /*#__PURE__*/_react["default"].createElement(StyledCode, null, id)));
};

var ExampleTable = function ExampleTable() {
  return /*#__PURE__*/_react["default"].createElement(_styledComponents2.Table, {
    className: "icon-example-table"
  }, /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", null, /*#__PURE__*/_react["default"].createElement("th", null, "point_lat"), /*#__PURE__*/_react["default"].createElement("th", null, "point_lng"), /*#__PURE__*/_react["default"].createElement("th", null, "icon"))), /*#__PURE__*/_react["default"].createElement("tbody", null, /*#__PURE__*/_react["default"].createElement("tr", null, /*#__PURE__*/_react["default"].createElement("td", null, "37.769897"), /*#__PURE__*/_react["default"].createElement("td", null, "-122.41168"), /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement(StyledCode, null, "android"))), /*#__PURE__*/_react["default"].createElement("tr", null, /*#__PURE__*/_react["default"].createElement("td", null, "37.806928"), /*#__PURE__*/_react["default"].createElement("td", null, "-122.40218"), /*#__PURE__*/_react["default"].createElement("td", null)), /*#__PURE__*/_react["default"].createElement("tr", null, /*#__PURE__*/_react["default"].createElement("td", null, "37.778564"), /*#__PURE__*/_react["default"].createElement("td", null, "-122.39096"), /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement(StyledCode, null, "calendar"))), /*#__PURE__*/_react["default"].createElement("tr", null, /*#__PURE__*/_react["default"].createElement("td", null, "37.745995"), /*#__PURE__*/_react["default"].createElement("td", null, "-122.30220"), /*#__PURE__*/_react["default"].createElement("td", null)), /*#__PURE__*/_react["default"].createElement("tr", null, /*#__PURE__*/_react["default"].createElement("td", null, "37.329841"), /*#__PURE__*/_react["default"].createElement("td", null, "-122.103847"), /*#__PURE__*/_react["default"].createElement("td", null, /*#__PURE__*/_react["default"].createElement(StyledCode, null, "control-off")))));
};

var IconTable = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: flex-start;\n  flex-wrap: wrap;\n"])));

var IconInfoModalFactory = function IconInfoModalFactory() {
  var svgIcons = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var IconInfoModal = function IconInfoModal() {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon-info-modal"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon-info-modal__description"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.iconInfo.description1'
    }), ' ', /*#__PURE__*/_react["default"].createElement("code", null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.iconInfo.code'
    })), /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.iconInfo.description2'
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon-info-modal__example"
    }, /*#__PURE__*/_react["default"].createElement(StyledTitle, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.iconInfo.example'
    })), /*#__PURE__*/_react["default"].createElement(ExampleTable, null)), /*#__PURE__*/_react["default"].createElement("div", {
      className: "icon-info-modal__icons"
    }, /*#__PURE__*/_react["default"].createElement(StyledTitle, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.iconInfo.icons'
    })), /*#__PURE__*/_react["default"].createElement(IconTable, {
      className: "icon-info-modal__icons__table"
    }, svgIcons.map(function (icon) {
      return /*#__PURE__*/_react["default"].createElement(IconItem, {
        key: icon.id,
        icon: icon
      });
    }))));
  };

  return IconInfoModal;
};

var _default = IconInfoModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvaWNvbi1sYXllci9pY29uLWluZm8tbW9kYWwuanMiXSwibmFtZXMiOlsibGluZUZ1bmN0aW9uIiwieCIsImQiLCJ5IiwiSWNvblNoYXBlIiwibWVzaCIsImNlbGxzIiwibWFwIiwiY2VsbCIsImkiLCJpZHgiLCJwb3NpdGlvbnMiLCJTdHlsZWRJY29uSXRlbSIsIkNlbnRlckZsZXhib3giLCJTdHlsZWRDb2RlIiwic3R5bGVkIiwiY29kZSIsInByb3BzIiwidGhlbWUiLCJ0aXRsZUNvbG9yTFQiLCJTdHlsZWRUaXRsZSIsImRpdiIsIkljb25JdGVtIiwiaWNvbiIsImlkIiwiRXhhbXBsZVRhYmxlIiwiSWNvblRhYmxlIiwiSWNvbkluZm9Nb2RhbEZhY3RvcnkiLCJzdmdJY29ucyIsIkljb25JbmZvTW9kYWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTUEsWUFBWSxHQUFHLHFCQUNsQkMsQ0FEa0IsQ0FDaEIsVUFBQUMsQ0FBQztBQUFBLFNBQUlBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTyxFQUFYO0FBQUEsQ0FEZSxFQUVsQkMsQ0FGa0IsQ0FFaEIsVUFBQUQsQ0FBQztBQUFBLFNBQUlBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTyxFQUFYO0FBQUEsQ0FGZSxDQUFyQjs7QUFJQSxJQUFNRSxTQUFTLEdBQUcsU0FBWkEsU0FBWTtBQUFBLE1BQUVDLElBQUYsUUFBRUEsSUFBRjtBQUFBLHNCQUNoQjtBQUFLLElBQUEsS0FBSyxFQUFDLE1BQVg7QUFBa0IsSUFBQSxNQUFNLEVBQUM7QUFBekIsa0JBQ0U7QUFBRyxJQUFBLFNBQVMsRUFBQztBQUFiLEtBQ0dBLElBQUksQ0FBQ0MsS0FBTCxDQUFXQyxHQUFYLENBQWUsVUFBQ0MsSUFBRCxFQUFPQyxDQUFQO0FBQUEsd0JBQ2Q7QUFBTSxNQUFBLEdBQUcsRUFBRUEsQ0FBWDtBQUFjLE1BQUEsSUFB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OEJBQUQ7QUFBa0IsTUFBQSxFQUFFLEVBQUU7QUFBdEIsTUFERixDQURGLGVBSUUsZ0NBQUMsU0FBRDtBQUFXLE1BQUEsU0FBUyxFQUFDO0FBQXJCLE9BQ0dELFFBQVEsQ0FBQ3JCLEdBQVQsQ0FBYSxVQUFBZ0IsSUFBSTtBQUFBLDBCQUNoQixnQ0FBQyxRQUFEO0FBQVUsUUFBQSxHQUFHLEVBQUVBLElBQUksQ0FBQ0MsRUFBcEI7QUFBd0IsUUFBQSxJQUFJLEVBQUVEO0FBQTlCLFFBRGdCO0FBQUEsS0FBakIsQ0FESCxDQUpGLENBZEYsQ0FEb0I7QUFBQSxHQUF0Qjs7QUE0QkEsU0FBT00sYUFBUDtBQUNELENBOUJEOztlQWdDZUYsb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2xpbmV9IGZyb20gJ2QzLXNoYXBlJztcbmltcG9ydCB7VGFibGUsIENlbnRlckZsZXhib3h9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAnbG9jYWxpemF0aW9uJztcblxuY29uc3QgbGluZUZ1bmN0aW9uID0gbGluZSgpXG4gIC54KGQgPT4gZFswXSAqIDEwKVxuICAueShkID0+IGRbMV0gKiAxMCk7XG5cbmNvbnN0IEljb25TaGFwZSA9ICh7bWVzaH0pID0+IChcbiAgPHN2ZyB3aWR0aD1cIjIwcHhcIiBoZWlnaHQ9XCIyMHB4XCI+XG4gICAgPGcgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDEwLCAxMClcIj5cbiAgICAgIHttZXNoLmNlbGxzLm1hcCgoY2VsbCwgaSkgPT4gKFxuICAgICAgICA8cGF0aCBrZXk9e2l9IGZpbGw9XCIjMDAwMDAwXCIgZD17bGluZUZ1bmN0aW9uKGNlbGwubWFwKGlkeCA9PiBtZXNoLnBvc2l0aW9uc1tpZHhdKSl9IC8+XG4gICAgICApKX1cbiAgICA8L2c+XG4gIDwvc3ZnPlxuKTtcblxuY29uc3QgU3R5bGVkSWNvbkl0ZW0gPSBzdHlsZWQoQ2VudGVyRmxleGJveClgXG4gIHBhZGRpbmctbGVmdDogNnB4O1xuICB3aWR0aDogMTgwcHg7XG4gIGhlaWdodDogNDhweDtcbiAgbWFyZ2luLXJpZ2h0OiAxMnB4O1xuXG4gIC5pY29uLXRhYmxlX2l0ZW1fX25hbWUge1xuICAgIG1hcmdpbi1sZWZ0OiAxMnB4O1xuICB9XG5gO1xuXG5jb25zdCBTdHlsZWRDb2RlID0gc3R5bGVkLmNvZGVgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlQ29sb3JMVH07XG5gO1xuXG5jb25zdCBTdHlsZWRUaXRsZSA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtc2l6ZTogMjBweDtcbiAgbGV0dGVyLXNwYWNpbmc6IDEuMjVweDtcbiAgbWFyZ2luOiAxOHB4IDAgMTRweCAwO1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50aXRsZUNvbG9yTFR9O1xuYDtcblxuY29uc3QgSWNvbkl0ZW0gPSAoe2ljb246IHtpZCwgbWVzaH19KSA9PiAoXG4gIDxTdHlsZWRJY29uSXRlbSBjbGFzc05hbWU9XCJpY29uLXRhYmxlX19pdGVtXCI+XG4gICAgPEljb25TaGFwZSBjbGFzc05hbWU9XCJpY29uLXRhYmxlX19pdGVtX19zaGFwZVwiIG1lc2g9e21lc2h9IC8+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJpY29uLXRhYmxlX2l0ZW1fX25hbWVcIj5cbiAgICAgIDxTdHlsZWRDb2RlPntpZH08L1N0eWxlZENvZGU+XG4gICAgPC9kaXY+XG4gIDwvU3R5bGVkSWNvbkl0ZW0+XG4pO1xuXG5jb25zdCBFeGFtcGxlVGFibGUgPSAoKSA9PiAoXG4gIDxUYWJsZSBjbGFzc05hbWU9XCJpY29uLWV4YW1wbGUtdGFibGVcIj5cbiAgICA8dGhlYWQ+XG4gICAgICA8dHI+XG4gICAgICAgIDx0aD5wb2ludF9sYXQ8L3RoPlxuICAgICAgICA8dGg+cG9pbnRfbG5nPC90aD5cbiAgICAgICAgPHRoPmljb248L3RoPlxuICAgICAgPC90cj5cbiAgICA8L3RoZWFkPlxuICAgIDx0Ym9keT5cbiAgICAgIDx0cj5cbiAgICAgICAgPHRkPjM3Ljc2OTg5NzwvdGQ+XG4gICAgICAgIDx0ZD4tMTIyLjQxMTY4PC90ZD5cbiAgICAgICAgPHRkPlxuICAgICAgICAgIDxTdHlsZWRDb2RlPmFuZHJvaWQ8L1N0eWxlZENvZGU+XG4gICAgICAgIDwvdGQ+XG4gICAgICA8L3RyPlxuICAgICAgPHRyPlxuICAgICAgICA8dGQ+MzcuODA2OTI4PC90ZD5cbiAgICAgICAgPHRkPi0xMjIuNDAyMTg8L3RkPlxuICAgICAgICA8dGQgLz5cbiAgICAgIDwvdHI+XG4gICAgICA8dHI+XG4gICAgICAgIDx0ZD4zNy43Nzg1NjQ8L3RkPlxuICAgICAgICA8dGQ+LTEyMi4zOTA5NjwvdGQ+XG4gICAgICAgIDx0ZD5cbiAgICAgICAgICA8U3R5bGVkQ29kZT5jYWxlbmRhcjwvU3R5bGVkQ29kZT5cbiAgICAgICAgPC90ZD5cbiAgICAgIDwvdHI+XG4gICAgICA8dHI+XG4gICAgICAgIDx0ZD4zNy43NDU5OTU8L3RkPlxuICAgICAgICA8dGQ+LTEyMi4zMDIyMDwvdGQ+XG4gICAgICAgIDx0ZCAvPlxuICAgICAgPC90cj5cbiAgICAgIDx0cj5cbiAgICAgICAgPHRkPjM3LjMyOTg0MTwvdGQ+XG4gICAgICAgIDx0ZD4tMTIyLjEwMzg0NzwvdGQ+XG4gICAgICAgIDx0ZD5cbiAgICAgICAgICA8U3R5bGVkQ29kZT5jb250cm9sLW9mZjwvU3R5bGVkQ29kZT5cbiAgICAgICAgPC90ZD5cbiAgICAgIDwvdHI+XG4gICAgPC90Ym9keT5cbiAgPC9UYWJsZT5cbik7XG5cbmNvbnN0IEljb25UYWJsZSA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBmbGV4LXdyYXA6IHdyYXA7XG5gO1xuXG5jb25zdCBJY29uSW5mb01vZGFsRmFjdG9yeSA9IChzdmdJY29ucyA9IFtdKSA9PiB7XG4gIGNvbnN0IEljb25JbmZvTW9kYWwgPSAoKSA9PiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJpY29uLWluZm8tbW9kYWxcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaWNvbi1pbmZvLW1vZGFsX19kZXNjcmlwdGlvblwiPlxuICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmljb25JbmZvLmRlc2NyaXB0aW9uMSd9IC8+eycgJ31cbiAgICAgICAgPGNvZGU+XG4gICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5pY29uSW5mby5jb2RlJ30gLz5cbiAgICAgICAgPC9jb2RlPlxuICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmljb25JbmZvLmRlc2NyaXB0aW9uMid9IC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaWNvbi1pbmZvLW1vZGFsX19leGFtcGxlXCI+XG4gICAgICAgIDxTdHlsZWRUaXRsZT5cbiAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmljb25JbmZvLmV4YW1wbGUnfSAvPlxuICAgICAgICA8L1N0eWxlZFRpdGxlPlxuICAgICAgICA8RXhhbXBsZVRhYmxlIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaWNvbi1pbmZvLW1vZGFsX19pY29uc1wiPlxuICAgICAgICA8U3R5bGVkVGl0bGU+XG4gICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5pY29uSW5mby5pY29ucyd9IC8+XG4gICAgICAgIDwvU3R5bGVkVGl0bGU+XG4gICAgICAgIDxJY29uVGFibGUgY2xhc3NOYW1lPVwiaWNvbi1pbmZvLW1vZGFsX19pY29uc19fdGFibGVcIj5cbiAgICAgICAgICB7c3ZnSWNvbnMubWFwKGljb24gPT4gKFxuICAgICAgICAgICAgPEljb25JdGVtIGtleT17aWNvbi5pZH0gaWNvbj17aWNvbn0gLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9JY29uVGFibGU+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcblxuICByZXR1cm4gSWNvbkluZm9Nb2RhbDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEljb25JbmZvTW9kYWxGYWN0b3J5O1xuIl19