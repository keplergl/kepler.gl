"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _rangeSlider = _interopRequireDefault(require("../../common/range-slider"));

var _styledComponents = require("../../common/styled-components");

var _interactionUtils = require("../../../utils/interaction-utils");

var _reactIntl = require("react-intl");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

BrushConfigFactory.deps = [_rangeSlider["default"]];

function BrushConfigFactory(RangeSlider) {
  var BrushConfig = function BrushConfig(_ref) {
    var config = _ref.config,
        _onChange = _ref.onChange;
    return _react["default"].createElement(_styledComponents.SidePanelSection, null, _react["default"].createElement(_styledComponents.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'misc.brushRadius'
    })), _react["default"].createElement(RangeSlider, {
      range: _interactionUtils.BRUSH_CONFIG.range,
      value0: 0,
      value1: config.size || 10 / 2,
      step: 0.1,
      isRanged: false,
      onChange: function onChange(value) {
        return _onChange(_objectSpread({}, config, {
          size: value[1]
        }));
      },
      inputTheme: "secondary"
    }));
  };

  return BrushConfig;
}

var _default = BrushConfigFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwvYnJ1c2gtY29uZmlnLmpzIl0sIm5hbWVzIjpbIkJydXNoQ29uZmlnRmFjdG9yeSIsImRlcHMiLCJSYW5nZVNsaWRlckZhY3RvcnkiLCJSYW5nZVNsaWRlciIsIkJydXNoQ29uZmlnIiwiY29uZmlnIiwib25DaGFuZ2UiLCJCUlVTSF9DT05GSUciLCJyYW5nZSIsInNpemUiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBQSxrQkFBa0IsQ0FBQ0MsSUFBbkIsR0FBMEIsQ0FBQ0MsdUJBQUQsQ0FBMUI7O0FBRUEsU0FBU0Ysa0JBQVQsQ0FBNEJHLFdBQTVCLEVBQXlDO0FBQ3ZDLE1BQU1DLFdBQVcsR0FBRyxTQUFkQSxXQUFjO0FBQUEsUUFBRUMsTUFBRixRQUFFQSxNQUFGO0FBQUEsUUFBVUMsU0FBVixRQUFVQSxRQUFWO0FBQUEsV0FDbEIsZ0NBQUMsa0NBQUQsUUFDRSxnQ0FBQyw0QkFBRCxRQUNFLGdDQUFDLDJCQUFEO0FBQWtCLE1BQUEsRUFBRSxFQUFFO0FBQXRCLE1BREYsQ0FERixFQUlFLGdDQUFDLFdBQUQ7QUFDRSxNQUFBLEtBQUssRUFBRUMsK0JBQWFDLEtBRHRCO0FBRUUsTUFBQSxNQUFNLEVBQUUsQ0FGVjtBQUdFLE1BQUEsTUFBTSxFQUFFSCxNQUFNLENBQUNJLElBQVAsSUFBZSxLQUFLLENBSDlCO0FBSUUsTUFBQSxJQUFJLEVBQUUsR0FKUjtBQUtFLE1BQUEsUUFBUSxFQUFFLEtBTFo7QUFNRSxNQUFBLFFBQVEsRUFBRSxrQkFBQUMsS0FBSztBQUFBLGVBQUlKLFNBQVEsbUJBQUtELE1BQUw7QUFBYUksVUFBQUEsSUFBSSxFQUFFQyxLQUFLLENBQUMsQ0FBRDtBQUF4QixXQUFaO0FBQUEsT0FOakI7QUFPRSxNQUFBLFVBQVUsRUFBQztBQVBiLE1BSkYsQ0FEa0I7QUFBQSxHQUFwQjs7QUFpQkEsU0FBT04sV0FBUDtBQUNEOztlQUVjSixrQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmFuZ2VTbGlkZXJGYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3JhbmdlLXNsaWRlcic7XG5cbmltcG9ydCB7UGFuZWxMYWJlbCwgU2lkZVBhbmVsU2VjdGlvbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtCUlVTSF9DT05GSUd9IGZyb20gJ3V0aWxzL2ludGVyYWN0aW9uLXV0aWxzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5cbkJydXNoQ29uZmlnRmFjdG9yeS5kZXBzID0gW1JhbmdlU2xpZGVyRmFjdG9yeV07XG5cbmZ1bmN0aW9uIEJydXNoQ29uZmlnRmFjdG9yeShSYW5nZVNsaWRlcikge1xuICBjb25zdCBCcnVzaENvbmZpZyA9ICh7Y29uZmlnLCBvbkNoYW5nZX0pID0+IChcbiAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgIDxQYW5lbExhYmVsPlxuICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21pc2MuYnJ1c2hSYWRpdXMnfSAvPlxuICAgICAgPC9QYW5lbExhYmVsPlxuICAgICAgPFJhbmdlU2xpZGVyXG4gICAgICAgIHJhbmdlPXtCUlVTSF9DT05GSUcucmFuZ2V9XG4gICAgICAgIHZhbHVlMD17MH1cbiAgICAgICAgdmFsdWUxPXtjb25maWcuc2l6ZSB8fCAxMCAvIDJ9XG4gICAgICAgIHN0ZXA9ezAuMX1cbiAgICAgICAgaXNSYW5nZWQ9e2ZhbHNlfVxuICAgICAgICBvbkNoYW5nZT17dmFsdWUgPT4gb25DaGFuZ2Uoey4uLmNvbmZpZywgc2l6ZTogdmFsdWVbMV19KX1cbiAgICAgICAgaW5wdXRUaGVtZT1cInNlY29uZGFyeVwiXG4gICAgICAvPlxuICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgKTtcblxuICByZXR1cm4gQnJ1c2hDb25maWc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJydXNoQ29uZmlnRmFjdG9yeTtcbiJdfQ==