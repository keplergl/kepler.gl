"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactIntl = require("react-intl");

var _localization = require("../../localization");

var _styledComponents = require("./styled-components");

var _icons = require("./icons");

var _styledComponents2 = _interopRequireDefault(require("styled-components"));

var _utils = require("../../utils/utils");

var _templateObject;

var StyledInfoHelper = _styledComponents2["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  margin-left: 10px;\n  color: ", ";\n  display: inline-flex;\n  .info-helper__content {\n    width: ", ";\n    max-width: ", ";\n  }\n  :hover {\n    cursor: pointer;\n    color: ", ";\n  }\n"])), function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.width ? "".concat(props.width, "px") : 'auto';
}, function (props) {
  return props.width ? 'auto' : '100px';
}, function (props) {
  return props.theme.textColorHl;
});

function InfoHelperFactory() {
  var propTypes = {
    description: _propTypes["default"].string.isRequired,
    containerClass: _propTypes["default"].string
  };

  var InfoHelper = function InfoHelper(_ref) {
    var description = _ref.description,
        property = _ref.property,
        containerClass = _ref.containerClass,
        width = _ref.width,
        id = _ref.id;
    // TODO: move intl out
    var intl = (0, _reactIntl.useIntl)();
    return /*#__PURE__*/_react["default"].createElement(StyledInfoHelper, {
      className: "info-helper ".concat(containerClass || ''),
      width: width,
      "data-tip": true,
      "data-for": id
    }, /*#__PURE__*/_react["default"].createElement(_icons.Docs, {
      height: "16px"
    }), /*#__PURE__*/_react["default"].createElement(_styledComponents.Tooltip, {
      id: id,
      effect: "solid"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "info-helper__content"
    }, description && /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: description,
      defaultValue: description,
      values: {
        property: intl.formatMessage({
          id: property ? "property.".concat((0, _utils.camelize)(property)) : 'misc.empty'
        })
      }
    }))));
  };

  InfoHelper.propTypes = propTypes;
  return InfoHelper;
}

var _default = InfoHelperFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pbmZvLWhlbHBlci5qcyJdLCJuYW1lcyI6WyJTdHlsZWRJbmZvSGVscGVyIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsImxhYmVsQ29sb3IiLCJ3aWR0aCIsInRleHRDb2xvckhsIiwiSW5mb0hlbHBlckZhY3RvcnkiLCJwcm9wVHlwZXMiLCJkZXNjcmlwdGlvbiIsIlByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJjb250YWluZXJDbGFzcyIsIkluZm9IZWxwZXIiLCJwcm9wZXJ0eSIsImlkIiwiaW50bCIsImZvcm1hdE1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsSUFBTUEsZ0JBQWdCLEdBQUdDLDhCQUFPQyxHQUFWLGlUQUdYLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsVUFBaEI7QUFBQSxDQUhNLEVBTVQsVUFBQUYsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ0csS0FBTixhQUFpQkgsS0FBSyxDQUFDRyxLQUF2QixVQUFtQyxNQUF4QztBQUFBLENBTkksRUFPTCxVQUFBSCxLQUFLO0FBQUEsU0FBS0EsS0FBSyxDQUFDRyxLQUFOLEdBQWMsTUFBZCxHQUF1QixPQUE1QjtBQUFBLENBUEEsRUFXVCxVQUFBSCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlHLFdBQWhCO0FBQUEsQ0FYSSxDQUF0Qjs7QUFlQSxTQUFTQyxpQkFBVCxHQUE2QjtBQUMzQixNQUFNQyxTQUFTLEdBQUc7QUFDaEJDLElBQUFBLFdBQVcsRUFBRUMsc0JBQVVDLE1BQVYsQ0FBaUJDLFVBRGQ7QUFFaEJDLElBQUFBLGNBQWMsRUFBRUgsc0JBQVVDO0FBRlYsR0FBbEI7O0FBSUEsTUFBTUcsVUFBVSxHQUFHLFNBQWJBLFVBQWEsT0FBd0Q7QUFBQSxRQUF0REwsV0FBc0QsUUFBdERBLFdBQXNEO0FBQUEsUUFBekNNLFFBQXlDLFFBQXpDQSxRQUF5QztBQUFBLFFBQS9CRixjQUErQixRQUEvQkEsY0FBK0I7QUFBQSxRQUFmUixLQUFlLFFBQWZBLEtBQWU7QUFBQSxRQUFSVyxFQUFRLFFBQVJBLEVBQVE7QUFDekU7QUFDQSxRQUFNQyxJQUFJLEdBQUcseUJBQWI7QUFFQSx3QkFDRSxnQ0FBQyxnQkFBRDtBQUNFLE1BQUEsU0FBUyx3QkFBaUJKLGNBQWMsSUFBSSxFQUFuQyxDQURYO0FBRUUsTUFBQSxLQUFLLEVBQUVSLEtBRlQ7QUFHRSxzQkFIRjtBQUlFLGtCQUFVVztBQUpaLG9CQU1FLGdDQUFDLFdBQUQ7QUFBTSxNQUFBLE1BQU0sRUFBQztBQUFiLE1BTkYsZUFPRSxnQ0FBQyx5QkFBRDtBQUFTLE1BQUEsRUFBRSxFQUFFQSxFQUFiO0FBQWlCLE1BQUEsTUFBTSxFQUFDO0FBQXhCLG9CQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNHUCxXQUFXLGlCQUNWLGdDQUFDLDhCQUFEO0FBQ0UsTUFBQSxFQUFFLEVBQUVBLFdBRE47QUFFRSxNQUFBLFlBQVksRUFBRUEsV0FGaEI7QUFHRSxNQUFBLE1BQU0sRUFBRTtBQUNOTSxRQUFBQSxRQUFRLEVBQUVFLElBQUksQ0FBQ0MsYUFBTCxDQUFtQjtBQUMzQkYsVUFBQUEsRUFBRSxFQUFFRCxRQUFRLHNCQUFlLHFCQUFTQSxRQUFULENBQWYsSUFBc0M7QUFEdkIsU0FBbkI7QUFESjtBQUhWLE1BRkosQ0FERixDQVBGLENBREY7QUF5QkQsR0E3QkQ7O0FBOEJBRCxFQUFBQSxVQUFVLENBQUNOLFNBQVgsR0FBdUJBLFNBQXZCO0FBQ0EsU0FBT00sVUFBUDtBQUNEOztlQUVjUCxpQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHt1c2VJbnRsfSBmcm9tICdyZWFjdC1pbnRsJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAnbG9jYWxpemF0aW9uJztcbmltcG9ydCB7VG9vbHRpcH0gZnJvbSAnLi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0RvY3N9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtjYW1lbGl6ZX0gZnJvbSAndXRpbHMvdXRpbHMnO1xuXG5jb25zdCBTdHlsZWRJbmZvSGVscGVyID0gc3R5bGVkLmRpdmBcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWFyZ2luLWxlZnQ6IDEwcHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3J9O1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgLmluZm8taGVscGVyX19jb250ZW50IHtcbiAgICB3aWR0aDogJHtwcm9wcyA9PiAocHJvcHMud2lkdGggPyBgJHtwcm9wcy53aWR0aH1weGAgOiAnYXV0bycpfTtcbiAgICBtYXgtd2lkdGg6ICR7cHJvcHMgPT4gKHByb3BzLndpZHRoID8gJ2F1dG8nIDogJzEwMHB4Jyl9O1xuICB9XG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckhsfTtcbiAgfVxuYDtcblxuZnVuY3Rpb24gSW5mb0hlbHBlckZhY3RvcnkoKSB7XG4gIGNvbnN0IHByb3BUeXBlcyA9IHtcbiAgICBkZXNjcmlwdGlvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNvbnRhaW5lckNsYXNzOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH07XG4gIGNvbnN0IEluZm9IZWxwZXIgPSAoe2Rlc2NyaXB0aW9uLCBwcm9wZXJ0eSwgY29udGFpbmVyQ2xhc3MsIHdpZHRoLCBpZH0pID0+IHtcbiAgICAvLyBUT0RPOiBtb3ZlIGludGwgb3V0XG4gICAgY29uc3QgaW50bCA9IHVzZUludGwoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkSW5mb0hlbHBlclxuICAgICAgICBjbGFzc05hbWU9e2BpbmZvLWhlbHBlciAke2NvbnRhaW5lckNsYXNzIHx8ICcnfWB9XG4gICAgICAgIHdpZHRoPXt3aWR0aH1cbiAgICAgICAgZGF0YS10aXBcbiAgICAgICAgZGF0YS1mb3I9e2lkfVxuICAgICAgPlxuICAgICAgICA8RG9jcyBoZWlnaHQ9XCIxNnB4XCIgLz5cbiAgICAgICAgPFRvb2x0aXAgaWQ9e2lkfSBlZmZlY3Q9XCJzb2xpZFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5mby1oZWxwZXJfX2NvbnRlbnRcIj5cbiAgICAgICAgICAgIHtkZXNjcmlwdGlvbiAmJiAoXG4gICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlXG4gICAgICAgICAgICAgICAgaWQ9e2Rlc2NyaXB0aW9ufVxuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17ZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgdmFsdWVzPXt7XG4gICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogaW50bC5mb3JtYXRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHByb3BlcnR5ID8gYHByb3BlcnR5LiR7Y2FtZWxpemUocHJvcGVydHkpfWAgOiAnbWlzYy5lbXB0eSdcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvVG9vbHRpcD5cbiAgICAgIDwvU3R5bGVkSW5mb0hlbHBlcj5cbiAgICApO1xuICB9O1xuICBJbmZvSGVscGVyLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiAgcmV0dXJuIEluZm9IZWxwZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEluZm9IZWxwZXJGYWN0b3J5O1xuIl19