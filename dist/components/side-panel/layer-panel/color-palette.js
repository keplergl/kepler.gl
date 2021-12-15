"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _templateObject, _templateObject2, _templateObject3;

var propTypes = {
  colors: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
  height: _propTypes["default"].number,
  className: _propTypes["default"].string,
  isSelected: _propTypes["default"].bool,
  isReversed: _propTypes["default"].bool
};
var defaultProps = {
  height: 10,
  colors: [],
  className: '',
  isSelected: false,
  isReversed: false
};

var PaletteWrapper = _styledComponents["default"].div.attrs({
  className: 'color-range-palette__inner'
})(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  border-radius: 2px;\n  display: flex;\n  flex-direction: row;\n  flex-grow: 1;\n  justify-content: space-between;\n  overflow: hidden;\n"])));

var PaletteContainer = _styledComponents["default"].div.attrs({
  className: 'color-range-palette'
})(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-grow: 1;\n  border-width: 1px;\n  border-style: solid;\n  border-color: ", ";\n  padding: 4px;\n  border-radius: 4px;\n"])), function (props) {
  return props.isSelected ? '#FFFFFF' : 'transparent';
});

var StyledColorBlock = _styledComponents["default"].div.attrs({
  className: 'color-range-palette__block'
})(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  flex-grow: 1;\n"])));

var ColorPalette = function ColorPalette(_ref) {
  var colors = _ref.colors,
      height = _ref.height,
      className = _ref.className,
      isSelected = _ref.isSelected,
      isReversed = _ref.isReversed;
  return /*#__PURE__*/_react["default"].createElement(PaletteContainer, {
    className: className,
    isSelected: isSelected
  }, /*#__PURE__*/_react["default"].createElement(PaletteWrapper, {
    style: {
      height: height,
      transform: "scale(".concat(isReversed ? -1 : 1, ", 1)")
    }
  }, colors.map(function (color, index) {
    return /*#__PURE__*/_react["default"].createElement(StyledColorBlock, {
      key: "".concat(color, "-").concat(index),
      style: {
        backgroundColor: color
      }
    });
  })));
};

ColorPalette.propTypes = propTypes;
ColorPalette.defaultProps = defaultProps;
var _default = ColorPalette;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3ItcGFsZXR0ZS5qcyJdLCJuYW1lcyI6WyJwcm9wVHlwZXMiLCJjb2xvcnMiLCJQcm9wVHlwZXMiLCJhcnJheU9mIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImhlaWdodCIsIm51bWJlciIsImNsYXNzTmFtZSIsImlzU2VsZWN0ZWQiLCJib29sIiwiaXNSZXZlcnNlZCIsImRlZmF1bHRQcm9wcyIsIlBhbGV0dGVXcmFwcGVyIiwic3R5bGVkIiwiZGl2IiwiYXR0cnMiLCJQYWxldHRlQ29udGFpbmVyIiwicHJvcHMiLCJTdHlsZWRDb2xvckJsb2NrIiwiQ29sb3JQYWxldHRlIiwidHJhbnNmb3JtIiwibWFwIiwiY29sb3IiLCJpbmRleCIsImJhY2tncm91bmRDb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUc7QUFDaEJDLEVBQUFBLE1BQU0sRUFBRUMsc0JBQVVDLE9BQVYsQ0FBa0JELHNCQUFVRSxNQUE1QixFQUFvQ0MsVUFENUI7QUFFaEJDLEVBQUFBLE1BQU0sRUFBRUosc0JBQVVLLE1BRkY7QUFHaEJDLEVBQUFBLFNBQVMsRUFBRU4sc0JBQVVFLE1BSEw7QUFJaEJLLEVBQUFBLFVBQVUsRUFBRVAsc0JBQVVRLElBSk47QUFLaEJDLEVBQUFBLFVBQVUsRUFBRVQsc0JBQVVRO0FBTE4sQ0FBbEI7QUFRQSxJQUFNRSxZQUFZLEdBQUc7QUFDbkJOLEVBQUFBLE1BQU0sRUFBRSxFQURXO0FBRW5CTCxFQUFBQSxNQUFNLEVBQUUsRUFGVztBQUduQk8sRUFBQUEsU0FBUyxFQUFFLEVBSFE7QUFJbkJDLEVBQUFBLFVBQVUsRUFBRSxLQUpPO0FBS25CRSxFQUFBQSxVQUFVLEVBQUU7QUFMTyxDQUFyQjs7QUFRQSxJQUFNRSxjQUFjLEdBQUdDLDZCQUFPQyxHQUFQLENBQVdDLEtBQVgsQ0FBaUI7QUFDdENSLEVBQUFBLFNBQVMsRUFBRTtBQUQyQixDQUFqQixDQUFILGtPQUFwQjs7QUFXQSxJQUFNUyxnQkFBZ0IsR0FBR0gsNkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUN4Q1IsRUFBQUEsU0FBUyxFQUFFO0FBRDZCLENBQWpCLENBQUgsMk9BT0osVUFBQVUsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ1QsVUFBTixHQUFtQixTQUFuQixHQUErQixhQUFwQztBQUFBLENBUEQsQ0FBdEI7O0FBWUEsSUFBTVUsZ0JBQWdCLEdBQUdMLDZCQUFPQyxHQUFQLENBQVdDLEtBQVgsQ0FBaUI7QUFDeENSLEVBQUFBLFNBQVMsRUFBRTtBQUQ2QixDQUFqQixDQUFILDJHQUF0Qjs7QUFNQSxJQUFNWSxZQUFZLEdBQUcsU0FBZkEsWUFBZTtBQUFBLE1BQUVuQixNQUFGLFFBQUVBLE1BQUY7QUFBQSxNQUFVSyxNQUFWLFFBQVVBLE1BQVY7QUFBQSxNQUFrQkUsU0FBbEIsUUFBa0JBLFNBQWxCO0FBQUEsTUFBNkJDLFVBQTdCLFFBQTZCQSxVQUE3QjtBQUFBLE1BQXlDRSxVQUF6QyxRQUF5Q0EsVUFBekM7QUFBQSxzQkFDbkIsZ0NBQUMsZ0JBQUQ7QUFBa0IsSUFBQSxTQUFTLEVBQUVILFNBQTdCO0FBQXdDLElBQUEsVUFBVSxFQUFFQztBQUFwRCxrQkFDRSxnQ0FBQyxjQUFEO0FBQWdCLElBQUEsS0FBSyxFQUFFO0FBQUNILE1BQUFBLE1BQU0sRUFBTkEsTUFBRDtBQUFTZSxNQUFBQSxTQUFTLGtCQUFXVixVQUFVLEdBQUcsQ0FBQyxDQUFKLEdBQVEsQ0FBN0I7QUFBbEI7QUFBdkIsS0FDR1YsTUFBTSxDQUFDcUIsR0FBUCxDQUFXLFVBQUNDLEtBQUQsRUFBUUMsS0FBUjtBQUFBLHdCQUNWLGdDQUFDLGdCQUFEO0FBQWtCLE1BQUEsR0FBRyxZQUFLRCxLQUFMLGNBQWNDLEtBQWQsQ0FBckI7QUFBNEMsTUFBQSxLQUFLLEVBQUU7QUFBQ0MsUUFBQUEsZUFBZSxFQUFFRjtBQUFsQjtBQUFuRCxNQURVO0FBQUEsR0FBWCxDQURILENBREYsQ0FEbUI7QUFBQSxDQUFyQjs7QUFVQUgsWUFBWSxDQUFDcEIsU0FBYixHQUF5QkEsU0FBekI7QUFDQW9CLFlBQVksQ0FBQ1IsWUFBYixHQUE0QkEsWUFBNUI7ZUFFZVEsWSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgY29sb3JzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKS5pc1JlcXVpcmVkLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIsXG4gIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaXNTZWxlY3RlZDogUHJvcFR5cGVzLmJvb2wsXG4gIGlzUmV2ZXJzZWQ6IFByb3BUeXBlcy5ib29sXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGhlaWdodDogMTAsXG4gIGNvbG9yczogW10sXG4gIGNsYXNzTmFtZTogJycsXG4gIGlzU2VsZWN0ZWQ6IGZhbHNlLFxuICBpc1JldmVyc2VkOiBmYWxzZVxufTtcblxuY29uc3QgUGFsZXR0ZVdyYXBwZXIgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnY29sb3ItcmFuZ2UtcGFsZXR0ZV9faW5uZXInXG59KWBcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBmbGV4LWdyb3c6IDE7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbmA7XG5cbmNvbnN0IFBhbGV0dGVDb250YWluZXIgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnY29sb3ItcmFuZ2UtcGFsZXR0ZSdcbn0pYFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWdyb3c6IDE7XG4gIGJvcmRlci13aWR0aDogMXB4O1xuICBib3JkZXItc3R5bGU6IHNvbGlkO1xuICBib3JkZXItY29sb3I6ICR7cHJvcHMgPT4gKHByb3BzLmlzU2VsZWN0ZWQgPyAnI0ZGRkZGRicgOiAndHJhbnNwYXJlbnQnKX07XG4gIHBhZGRpbmc6IDRweDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuYDtcblxuY29uc3QgU3R5bGVkQ29sb3JCbG9jayA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdjb2xvci1yYW5nZS1wYWxldHRlX19ibG9jaydcbn0pYFxuICBmbGV4LWdyb3c6IDE7XG5gO1xuXG5jb25zdCBDb2xvclBhbGV0dGUgPSAoe2NvbG9ycywgaGVpZ2h0LCBjbGFzc05hbWUsIGlzU2VsZWN0ZWQsIGlzUmV2ZXJzZWR9KSA9PiAoXG4gIDxQYWxldHRlQ29udGFpbmVyIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBpc1NlbGVjdGVkPXtpc1NlbGVjdGVkfT5cbiAgICA8UGFsZXR0ZVdyYXBwZXIgc3R5bGU9e3toZWlnaHQsIHRyYW5zZm9ybTogYHNjYWxlKCR7aXNSZXZlcnNlZCA/IC0xIDogMX0sIDEpYH19PlxuICAgICAge2NvbG9ycy5tYXAoKGNvbG9yLCBpbmRleCkgPT4gKFxuICAgICAgICA8U3R5bGVkQ29sb3JCbG9jayBrZXk9e2Ake2NvbG9yfS0ke2luZGV4fWB9IHN0eWxlPXt7YmFja2dyb3VuZENvbG9yOiBjb2xvcn19IC8+XG4gICAgICApKX1cbiAgICA8L1BhbGV0dGVXcmFwcGVyPlxuICA8L1BhbGV0dGVDb250YWluZXI+XG4pO1xuXG5Db2xvclBhbGV0dGUucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuQ29sb3JQYWxldHRlLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuZXhwb3J0IGRlZmF1bHQgQ29sb3JQYWxldHRlO1xuIl19