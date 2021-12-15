"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _localization = require("../../localization");

var _templateObject, _templateObject2;

var StyledCode = _styledComponents["default"].code(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n"])), function (props) {
  return props.theme.titleColorLT;
});

var StyledTitle = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 20px;\n  letter-spacing: 1.25px;\n  margin: 18px 0 14px 0;\n  color: ", ";\n"])), function (props) {
  return props.theme.titleColorLT;
});

var TripInfoModalFactory = function TripInfoModalFactory() {
  var svgIcons = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var TripInfoModal = function TripInfoModal() {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "trip-info-modal"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "trip-info-modal__description"
    }, /*#__PURE__*/_react["default"].createElement("p", null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.tripInfo.description1'
    }), /*#__PURE__*/_react["default"].createElement("code", null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.tripInfo.code'
    })), /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.tripInfo.description2'
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "trip-info-modal__example"
    }, /*#__PURE__*/_react["default"].createElement(StyledTitle, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.tripInfo.example'
    })), /*#__PURE__*/_react["default"].createElement("pre", null, /*#__PURE__*/_react["default"].createElement(StyledCode, null, "\n              {\n                \"type\": \"FeatureCollection\",\n                \"features\": [\n                  {\n                    \"type\": \"Feature\",\n                    \"properties\": { \"vendor\":  \"A\",\n                    \"vol\":20},\n                    \"geometry\": {\n                      \"type\": \"LineString\",\n                      \"coordinates\": [\n                        [-74.20986, 40.81773, 0, 1564184363],\n                        [-74.20987, 40.81765, 0, 1564184396],\n                        [-74.20998, 40.81746, 0, 1564184409]\n                      ]\n                    }\n                  }\n                ]\n              }\n            "))));
  };

  return TripInfoModal;
};

var _default = TripInfoModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvdHJpcC1sYXllci90cmlwLWluZm8tbW9kYWwuanMiXSwibmFtZXMiOlsiU3R5bGVkQ29kZSIsInN0eWxlZCIsImNvZGUiLCJwcm9wcyIsInRoZW1lIiwidGl0bGVDb2xvckxUIiwiU3R5bGVkVGl0bGUiLCJkaXYiLCJUcmlwSW5mb01vZGFsRmFjdG9yeSIsInN2Z0ljb25zIiwiVHJpcEluZm9Nb2RhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxVQUFVLEdBQUdDLDZCQUFPQyxJQUFWLHlHQUNMLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsWUFBaEI7QUFBQSxDQURBLENBQWhCOztBQUlBLElBQU1DLFdBQVcsR0FBR0wsNkJBQU9NLEdBQVYsb0xBSU4sVUFBQUosS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxZQUFoQjtBQUFBLENBSkMsQ0FBakI7O0FBT0EsSUFBTUcsb0JBQW9CLEdBQUcsU0FBdkJBLG9CQUF1QixHQUFtQjtBQUFBLE1BQWxCQyxRQUFrQix1RUFBUCxFQUFPOztBQUM5QyxNQUFNQyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCO0FBQUEsd0JBQ3BCO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixvQkFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0Usd0RBQ0UsZ0NBQUMsOEJBQUQ7QUFBa0IsTUFBQSxFQUFFLEVBQUU7QUFBdEIsTUFERixlQUVFLDJEQUNFLGdDQUFDLDhCQUFEO0FBQWtCLE1BQUEsRUFBRSxFQUFFO0FBQXRCLE1BREYsQ0FGRixlQUtFLGdDQUFDLDhCQUFEO0FBQWtCLE1BQUEsRUFBRSxFQUFFO0FBQXRCLE1BTEYsQ0FERixDQURGLGVBVUU7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLG9CQUNFLGdDQUFDLFdBQUQscUJBQ0UsZ0NBQUMsOEJBQUQ7QUFBa0IsTUFBQSxFQUFFLEVBQUU7QUFBdEIsTUFERixDQURGLGVBSUUsMERBQ0UsZ0NBQUMsVUFBRCxnc0JBREYsQ0FKRixDQVZGLENBRG9CO0FBQUEsR0FBdEI7O0FBMENBLFNBQU9BLGFBQVA7QUFDRCxDQTVDRDs7ZUE4Q2VGLG9CIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuXG5jb25zdCBTdHlsZWRDb2RlID0gc3R5bGVkLmNvZGVgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlQ29sb3JMVH07XG5gO1xuXG5jb25zdCBTdHlsZWRUaXRsZSA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtc2l6ZTogMjBweDtcbiAgbGV0dGVyLXNwYWNpbmc6IDEuMjVweDtcbiAgbWFyZ2luOiAxOHB4IDAgMTRweCAwO1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50aXRsZUNvbG9yTFR9O1xuYDtcblxuY29uc3QgVHJpcEluZm9Nb2RhbEZhY3RvcnkgPSAoc3ZnSWNvbnMgPSBbXSkgPT4ge1xuICBjb25zdCBUcmlwSW5mb01vZGFsID0gKCkgPT4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1pbmZvLW1vZGFsXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRyaXAtaW5mby1tb2RhbF9fZGVzY3JpcHRpb25cIj5cbiAgICAgICAgPHA+XG4gICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC50cmlwSW5mby5kZXNjcmlwdGlvbjEnfSAvPlxuICAgICAgICAgIDxjb2RlPlxuICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC50cmlwSW5mby5jb2RlJ30gLz5cbiAgICAgICAgICA8L2NvZGU+XG4gICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC50cmlwSW5mby5kZXNjcmlwdGlvbjInfSAvPlxuICAgICAgICA8L3A+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1pbmZvLW1vZGFsX19leGFtcGxlXCI+XG4gICAgICAgIDxTdHlsZWRUaXRsZT5cbiAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLnRyaXBJbmZvLmV4YW1wbGUnfSAvPlxuICAgICAgICA8L1N0eWxlZFRpdGxlPlxuICAgICAgICA8cHJlPlxuICAgICAgICAgIDxTdHlsZWRDb2RlPlxuICAgICAgICAgICAge2BcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJmZWF0dXJlc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHsgXCJ2ZW5kb3JcIjogIFwiQVwiLFxuICAgICAgICAgICAgICAgICAgICBcInZvbFwiOjIwfSxcbiAgICAgICAgICAgICAgICAgICAgXCJnZW9tZXRyeVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiTGluZVN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgWy03NC4yMDk4NiwgNDAuODE3NzMsIDAsIDE1NjQxODQzNjNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgWy03NC4yMDk4NywgNDAuODE3NjUsIDAsIDE1NjQxODQzOTZdLFxuICAgICAgICAgICAgICAgICAgICAgICAgWy03NC4yMDk5OCwgNDAuODE3NDYsIDAsIDE1NjQxODQ0MDldXG4gICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBgfVxuICAgICAgICAgIDwvU3R5bGVkQ29kZT5cbiAgICAgICAgPC9wcmU+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbiAgcmV0dXJuIFRyaXBJbmZvTW9kYWw7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBUcmlwSW5mb01vZGFsRmFjdG9yeTtcbiJdfQ==