"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactIntl = require("react-intl");

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 20px;\n  letter-spacing: 1.25px;\n  margin: 18px 0 14px 0;\n  color: ", ";\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledCode = _styledComponents["default"].code(_templateObject(), function (props) {
  return props.theme.titleColorLT;
});

var StyledTitle = _styledComponents["default"].div(_templateObject2(), function (props) {
  return props.theme.titleColorLT;
});

var TripInfoModalFactory = function TripInfoModalFactory() {
  var svgIcons = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var TripInfoModal = function TripInfoModal() {
    return _react["default"].createElement("div", {
      className: "trip-info-modal"
    }, _react["default"].createElement("div", {
      className: "trip-info-modal__description"
    }, _react["default"].createElement("p", null, _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'modal.tripInfo.description1'
    }), _react["default"].createElement("code", null, _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'modal.tripInfo.code'
    })), _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'modal.tripInfo.description2'
    }))), _react["default"].createElement("div", {
      className: "trip-info-modal__example"
    }, _react["default"].createElement(StyledTitle, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'modal.tripInfo.example'
    })), _react["default"].createElement("pre", null, _react["default"].createElement(StyledCode, null, "\n              {\n                \"type\": \"FeatureCollection\",\n                \"features\": [\n                  {\n                    \"type\": \"Feature\",\n                    \"properties\": { \"vendor\":  \"A\",\n                    \"vol\":20},\n                    \"geometry\": {\n                      \"type\": \"LineString\",\n                      \"coordinates\": [\n                        [-74.20986, 40.81773, 0, 1564184363],\n                        [-74.20987, 40.81765, 0, 1564184396],\n                        [-74.20998, 40.81746, 0, 1564184409]\n                      ]\n                    }\n                  }\n                ]\n              }\n            "))));
  };

  return TripInfoModal;
};

var _default = TripInfoModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvdHJpcC1sYXllci90cmlwLWluZm8tbW9kYWwuanMiXSwibmFtZXMiOlsiU3R5bGVkQ29kZSIsInN0eWxlZCIsImNvZGUiLCJwcm9wcyIsInRoZW1lIiwidGl0bGVDb2xvckxUIiwiU3R5bGVkVGl0bGUiLCJkaXYiLCJUcmlwSW5mb01vZGFsRmFjdG9yeSIsInN2Z0ljb25zIiwiVHJpcEluZm9Nb2RhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxVQUFVLEdBQUdDLDZCQUFPQyxJQUFWLG9CQUNMLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsWUFBaEI7QUFBQSxDQURBLENBQWhCOztBQUlBLElBQU1DLFdBQVcsR0FBR0wsNkJBQU9NLEdBQVYscUJBSU4sVUFBQUosS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxZQUFoQjtBQUFBLENBSkMsQ0FBakI7O0FBT0EsSUFBTUcsb0JBQW9CLEdBQUcsU0FBdkJBLG9CQUF1QixHQUFtQjtBQUFBLE1BQWxCQyxRQUFrQix1RUFBUCxFQUFPOztBQUM5QyxNQUFNQyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCO0FBQUEsV0FDcEI7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0UsMkNBQ0UsZ0NBQUMsMkJBQUQ7QUFBa0IsTUFBQSxFQUFFLEVBQUU7QUFBdEIsTUFERixFQUVFLDhDQUNFLGdDQUFDLDJCQUFEO0FBQWtCLE1BQUEsRUFBRSxFQUFFO0FBQXRCLE1BREYsQ0FGRixFQUtFLGdDQUFDLDJCQUFEO0FBQWtCLE1BQUEsRUFBRSxFQUFFO0FBQXRCLE1BTEYsQ0FERixDQURGLEVBVUU7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0UsZ0NBQUMsV0FBRCxRQUNFLGdDQUFDLDJCQUFEO0FBQWtCLE1BQUEsRUFBRSxFQUFFO0FBQXRCLE1BREYsQ0FERixFQUlFLDZDQUNFLGdDQUFDLFVBQUQsZ3NCQURGLENBSkYsQ0FWRixDQURvQjtBQUFBLEdBQXRCOztBQTBDQSxTQUFPQSxhQUFQO0FBQ0QsQ0E1Q0Q7O2VBOENlRixvQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5cbmNvbnN0IFN0eWxlZENvZGUgPSBzdHlsZWQuY29kZWBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGl0bGVDb2xvckxUfTtcbmA7XG5cbmNvbnN0IFN0eWxlZFRpdGxlID0gc3R5bGVkLmRpdmBcbiAgZm9udC1zaXplOiAyMHB4O1xuICBsZXR0ZXItc3BhY2luZzogMS4yNXB4O1xuICBtYXJnaW46IDE4cHggMCAxNHB4IDA7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpdGxlQ29sb3JMVH07XG5gO1xuXG5jb25zdCBUcmlwSW5mb01vZGFsRmFjdG9yeSA9IChzdmdJY29ucyA9IFtdKSA9PiB7XG4gIGNvbnN0IFRyaXBJbmZvTW9kYWwgPSAoKSA9PiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0cmlwLWluZm8tbW9kYWxcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1pbmZvLW1vZGFsX19kZXNjcmlwdGlvblwiPlxuICAgICAgICA8cD5cbiAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLnRyaXBJbmZvLmRlc2NyaXB0aW9uMSd9IC8+XG4gICAgICAgICAgPGNvZGU+XG4gICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLnRyaXBJbmZvLmNvZGUnfSAvPlxuICAgICAgICAgIDwvY29kZT5cbiAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLnRyaXBJbmZvLmRlc2NyaXB0aW9uMid9IC8+XG4gICAgICAgIDwvcD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0cmlwLWluZm8tbW9kYWxfX2V4YW1wbGVcIj5cbiAgICAgICAgPFN0eWxlZFRpdGxlPlxuICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwudHJpcEluZm8uZXhhbXBsZSd9IC8+XG4gICAgICAgIDwvU3R5bGVkVGl0bGU+XG4gICAgICAgIDxwcmU+XG4gICAgICAgICAgPFN0eWxlZENvZGU+XG4gICAgICAgICAgICB7YFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVzXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiRmVhdHVyZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInByb3BlcnRpZXNcIjogeyBcInZlbmRvclwiOiAgXCJBXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidm9sXCI6MjB9LFxuICAgICAgICAgICAgICAgICAgICBcImdlb21ldHJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJMaW5lU3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJjb29yZGluYXRlc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICBbLTc0LjIwOTg2LCA0MC44MTc3MywgMCwgMTU2NDE4NDM2M10sXG4gICAgICAgICAgICAgICAgICAgICAgICBbLTc0LjIwOTg3LCA0MC44MTc2NSwgMCwgMTU2NDE4NDM5Nl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBbLTc0LjIwOTk4LCA0MC44MTc0NiwgMCwgMTU2NDE4NDQwOV1cbiAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGB9XG4gICAgICAgICAgPC9TdHlsZWRDb2RlPlxuICAgICAgICA8L3ByZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xuICByZXR1cm4gVHJpcEluZm9Nb2RhbDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRyaXBJbmZvTW9kYWxGYWN0b3J5O1xuIl19