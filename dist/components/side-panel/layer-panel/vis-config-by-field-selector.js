"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactIntl = require("react-intl");

var _styledComponents = require("../../common/styled-components");

var _fieldSelector = _interopRequireDefault(require("../../common/field-selector"));

var _infoHelper = _interopRequireDefault(require("../../common/info-helper"));

var _dimensionScaleSelector = _interopRequireDefault(require("./dimension-scale-selector"));

var _utils = require("../../../utils/utils");

// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var VisConfigByFieldSelector =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(VisConfigByFieldSelector, _Component);

  function VisConfigByFieldSelector() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, VisConfigByFieldSelector);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(VisConfigByFieldSelector)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_updateVisByField", function (val) {
      _this.props.updateField(val);
    });
    return _this;
  }

  (0, _createClass2["default"])(VisConfigByFieldSelector, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          property = _this$props.property,
          showScale = _this$props.showScale,
          selectedField = _this$props.selectedField,
          description = _this$props.description,
          label = _this$props.label,
          intl = _this$props.intl,
          _this$props$scaleOpti = _this$props.scaleOptions,
          scaleOptions = _this$props$scaleOpti === void 0 ? [] : _this$props$scaleOpti;
      return _react["default"].createElement(_styledComponents.SidePanelSection, null, _react["default"].createElement(_styledComponents.SidePanelSection, null, _react["default"].createElement(_styledComponents.PanelLabelWrapper, null, _react["default"].createElement(_styledComponents.PanelLabel, null, label && _react["default"].createElement(_reactIntl.FormattedMessage, {
        id: label
      }) || _react["default"].createElement(_reactIntl.FormattedMessage, {
        id: "layer.propertyBasedOn",
        values: {
          property: intl.formatMessage({
            id: "property.".concat((0, _utils.camelize)(property)),
            defaultMessage: property
          })
        }
      })), description && _react["default"].createElement(_infoHelper["default"], {
        description: description,
        property: property,
        id: "".concat(this.props.id, "-").concat(property)
      })), _react["default"].createElement(_fieldSelector["default"], {
        fields: this.props.fields,
        value: selectedField && selectedField.name,
        placeholder: this.props.placeholder,
        onSelect: this._updateVisByField,
        erasable: true
      })), _react["default"].createElement("div", null, showScale ? _react["default"].createElement(_dimensionScaleSelector["default"], {
        scaleType: this.props.scaleType,
        options: scaleOptions,
        label: "".concat(property, " scale"),
        onSelect: this.props.updateScale,
        disabled: scaleOptions.length < 2
      }) : null));
    }
  }]);
  return VisConfigByFieldSelector;
}(_react.Component);

(0, _defineProperty2["default"])(VisConfigByFieldSelector, "propTypes", {
  channel: _propTypes["default"].string.isRequired,
  fields: _propTypes["default"].arrayOf(_propTypes["default"].any).isRequired,
  id: _propTypes["default"].string.isRequired,
  property: _propTypes["default"].string.isRequired,
  showScale: _propTypes["default"].bool.isRequired,
  updateField: _propTypes["default"].func.isRequired,
  updateScale: _propTypes["default"].func.isRequired,
  // optional
  scaleType: _propTypes["default"].string,
  selectedField: _propTypes["default"].object,
  description: _propTypes["default"].string,
  label: _propTypes["default"].string,
  placeholder: _propTypes["default"].string
});

var _default = (0, _reactIntl.injectIntl)(VisConfigByFieldSelector);

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvdmlzLWNvbmZpZy1ieS1maWVsZC1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJWaXNDb25maWdCeUZpZWxkU2VsZWN0b3IiLCJ2YWwiLCJwcm9wcyIsInVwZGF0ZUZpZWxkIiwicHJvcGVydHkiLCJzaG93U2NhbGUiLCJzZWxlY3RlZEZpZWxkIiwiZGVzY3JpcHRpb24iLCJsYWJlbCIsImludGwiLCJzY2FsZU9wdGlvbnMiLCJmb3JtYXRNZXNzYWdlIiwiaWQiLCJkZWZhdWx0TWVzc2FnZSIsImZpZWxkcyIsIm5hbWUiLCJwbGFjZWhvbGRlciIsIl91cGRhdGVWaXNCeUZpZWxkIiwic2NhbGVUeXBlIiwidXBkYXRlU2NhbGUiLCJsZW5ndGgiLCJDb21wb25lbnQiLCJjaGFubmVsIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsImFycmF5T2YiLCJhbnkiLCJib29sIiwiZnVuYyIsIm9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUE1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFZTUEsd0I7Ozs7Ozs7Ozs7Ozs7Ozs7OzBHQWtCZ0IsVUFBQUMsR0FBRyxFQUFJO0FBQ3pCLFlBQUtDLEtBQUwsQ0FBV0MsV0FBWCxDQUF1QkYsR0FBdkI7QUFDRCxLOzs7Ozs7NkJBRVE7QUFBQSx3QkFTSCxLQUFLQyxLQVRGO0FBQUEsVUFFTEUsUUFGSyxlQUVMQSxRQUZLO0FBQUEsVUFHTEMsU0FISyxlQUdMQSxTQUhLO0FBQUEsVUFJTEMsYUFKSyxlQUlMQSxhQUpLO0FBQUEsVUFLTEMsV0FMSyxlQUtMQSxXQUxLO0FBQUEsVUFNTEMsS0FOSyxlQU1MQSxLQU5LO0FBQUEsVUFPTEMsSUFQSyxlQU9MQSxJQVBLO0FBQUEsOENBUUxDLFlBUks7QUFBQSxVQVFMQSxZQVJLLHNDQVFVLEVBUlY7QUFXUCxhQUNFLGdDQUFDLGtDQUFELFFBQ0UsZ0NBQUMsa0NBQUQsUUFDRSxnQ0FBQyxtQ0FBRCxRQUNFLGdDQUFDLDRCQUFELFFBQ0lGLEtBQUssSUFBSSxnQ0FBQywyQkFBRDtBQUFrQixRQUFBLEVBQUUsRUFBRUE7QUFBdEIsUUFBVixJQUNDLGdDQUFDLDJCQUFEO0FBQ0UsUUFBQSxFQUFFLEVBQUMsdUJBREw7QUFFRSxRQUFBLE1BQU0sRUFBRTtBQUNOSixVQUFBQSxRQUFRLEVBQUVLLElBQUksQ0FBQ0UsYUFBTCxDQUFtQjtBQUMzQkMsWUFBQUEsRUFBRSxxQkFBYyxxQkFBU1IsUUFBVCxDQUFkLENBRHlCO0FBRTNCUyxZQUFBQSxjQUFjLEVBQUVUO0FBRlcsV0FBbkI7QUFESjtBQUZWLFFBRkosQ0FERixFQWNHRyxXQUFXLElBQ1YsZ0NBQUMsc0JBQUQ7QUFDRSxRQUFBLFdBQVcsRUFBRUEsV0FEZjtBQUVFLFFBQUEsUUFBUSxFQUFFSCxRQUZaO0FBR0UsUUFBQSxFQUFFLFlBQUssS0FBS0YsS0FBTCxDQUFXVSxFQUFoQixjQUFzQlIsUUFBdEI7QUFISixRQWZKLENBREYsRUF1QkUsZ0NBQUMseUJBQUQ7QUFDRSxRQUFBLE1BQU0sRUFBRSxLQUFLRixLQUFMLENBQVdZLE1BRHJCO0FBRUUsUUFBQSxLQUFLLEVBQUVSLGFBQWEsSUFBSUEsYUFBYSxDQUFDUyxJQUZ4QztBQUdFLFFBQUEsV0FBVyxFQUFFLEtBQUtiLEtBQUwsQ0FBV2MsV0FIMUI7QUFJRSxRQUFBLFFBQVEsRUFBRSxLQUFLQyxpQkFKakI7QUFLRSxRQUFBLFFBQVE7QUFMVixRQXZCRixDQURGLEVBZ0NFLDZDQUNHWixTQUFTLEdBQ1IsZ0NBQUMsa0NBQUQ7QUFDRSxRQUFBLFNBQVMsRUFBRSxLQUFLSCxLQUFMLENBQVdnQixTQUR4QjtBQUVFLFFBQUEsT0FBTyxFQUFFUixZQUZYO0FBR0UsUUFBQSxLQUFLLFlBQUtOLFFBQUwsV0FIUDtBQUlFLFFBQUEsUUFBUSxFQUFFLEtBQUtGLEtBQUwsQ0FBV2lCLFdBSnZCO0FBS0UsUUFBQSxRQUFRLEVBQUVULFlBQVksQ0FBQ1UsTUFBYixHQUFzQjtBQUxsQyxRQURRLEdBUU4sSUFUTixDQWhDRixDQURGO0FBOENEOzs7RUEvRW9DQyxnQjs7aUNBQWpDckIsd0IsZUFDZTtBQUNqQnNCLEVBQUFBLE9BQU8sRUFBRUMsc0JBQVVDLE1BQVYsQ0FBaUJDLFVBRFQ7QUFFakJYLEVBQUFBLE1BQU0sRUFBRVMsc0JBQVVHLE9BQVYsQ0FBa0JILHNCQUFVSSxHQUE1QixFQUFpQ0YsVUFGeEI7QUFHakJiLEVBQUFBLEVBQUUsRUFBRVcsc0JBQVVDLE1BQVYsQ0FBaUJDLFVBSEo7QUFJakJyQixFQUFBQSxRQUFRLEVBQUVtQixzQkFBVUMsTUFBVixDQUFpQkMsVUFKVjtBQUtqQnBCLEVBQUFBLFNBQVMsRUFBRWtCLHNCQUFVSyxJQUFWLENBQWVILFVBTFQ7QUFNakJ0QixFQUFBQSxXQUFXLEVBQUVvQixzQkFBVU0sSUFBVixDQUFlSixVQU5YO0FBT2pCTixFQUFBQSxXQUFXLEVBQUVJLHNCQUFVTSxJQUFWLENBQWVKLFVBUFg7QUFTakI7QUFDQVAsRUFBQUEsU0FBUyxFQUFFSyxzQkFBVUMsTUFWSjtBQVdqQmxCLEVBQUFBLGFBQWEsRUFBRWlCLHNCQUFVTyxNQVhSO0FBWWpCdkIsRUFBQUEsV0FBVyxFQUFFZ0Isc0JBQVVDLE1BWk47QUFhakJoQixFQUFBQSxLQUFLLEVBQUVlLHNCQUFVQyxNQWJBO0FBY2pCUixFQUFBQSxXQUFXLEVBQUVPLHNCQUFVQztBQWROLEM7O2VBaUZOLDJCQUFXeEIsd0JBQVgsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZSwgaW5qZWN0SW50bH0gZnJvbSAncmVhY3QtaW50bCc7XG5cbmltcG9ydCB7UGFuZWxMYWJlbCwgUGFuZWxMYWJlbFdyYXBwZXIsIFNpZGVQYW5lbFNlY3Rpb259IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBGaWVsZFNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ZpZWxkLXNlbGVjdG9yJztcbmltcG9ydCBJbmZvSGVscGVyIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2luZm8taGVscGVyJztcbmltcG9ydCBEaW1lbnNpb25TY2FsZVNlbGVjdG9yIGZyb20gJy4vZGltZW5zaW9uLXNjYWxlLXNlbGVjdG9yJztcbmltcG9ydCB7Y2FtZWxpemV9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuY2xhc3MgVmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjaGFubmVsOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgZmllbGRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KS5pc1JlcXVpcmVkLFxuICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgcHJvcGVydHk6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBzaG93U2NhbGU6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlRmllbGQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlU2NhbGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBvcHRpb25hbFxuICAgIHNjYWxlVHlwZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzZWxlY3RlZEZpZWxkOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGRlc2NyaXB0aW9uOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHBsYWNlaG9sZGVyOiBQcm9wVHlwZXMuc3RyaW5nXG4gIH07XG5cbiAgX3VwZGF0ZVZpc0J5RmllbGQgPSB2YWwgPT4ge1xuICAgIHRoaXMucHJvcHMudXBkYXRlRmllbGQodmFsKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHJvcGVydHksXG4gICAgICBzaG93U2NhbGUsXG4gICAgICBzZWxlY3RlZEZpZWxkLFxuICAgICAgZGVzY3JpcHRpb24sXG4gICAgICBsYWJlbCxcbiAgICAgIGludGwsXG4gICAgICBzY2FsZU9wdGlvbnMgPSBbXVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8UGFuZWxMYWJlbFdyYXBwZXI+XG4gICAgICAgICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgICAgICAgeyhsYWJlbCAmJiA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17bGFiZWx9IC8+KSB8fCAoXG4gICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgIGlkPVwibGF5ZXIucHJvcGVydHlCYXNlZE9uXCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlcz17e1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eTogaW50bC5mb3JtYXRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICBpZDogYHByb3BlcnR5LiR7Y2FtZWxpemUocHJvcGVydHkpfWAsXG4gICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdE1lc3NhZ2U6IHByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L1BhbmVsTGFiZWw+XG4gICAgICAgICAgICB7ZGVzY3JpcHRpb24gJiYgKFxuICAgICAgICAgICAgICA8SW5mb0hlbHBlclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uPXtkZXNjcmlwdGlvbn1cbiAgICAgICAgICAgICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICAgICAgICAgICAgaWQ9e2Ake3RoaXMucHJvcHMuaWR9LSR7cHJvcGVydHl9YH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9QYW5lbExhYmVsV3JhcHBlcj5cbiAgICAgICAgICA8RmllbGRTZWxlY3RvclxuICAgICAgICAgICAgZmllbGRzPXt0aGlzLnByb3BzLmZpZWxkc31cbiAgICAgICAgICAgIHZhbHVlPXtzZWxlY3RlZEZpZWxkICYmIHNlbGVjdGVkRmllbGQubmFtZX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgb25TZWxlY3Q9e3RoaXMuX3VwZGF0ZVZpc0J5RmllbGR9XG4gICAgICAgICAgICBlcmFzYWJsZVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7c2hvd1NjYWxlID8gKFxuICAgICAgICAgICAgPERpbWVuc2lvblNjYWxlU2VsZWN0b3JcbiAgICAgICAgICAgICAgc2NhbGVUeXBlPXt0aGlzLnByb3BzLnNjYWxlVHlwZX1cbiAgICAgICAgICAgICAgb3B0aW9ucz17c2NhbGVPcHRpb25zfVxuICAgICAgICAgICAgICBsYWJlbD17YCR7cHJvcGVydHl9IHNjYWxlYH1cbiAgICAgICAgICAgICAgb25TZWxlY3Q9e3RoaXMucHJvcHMudXBkYXRlU2NhbGV9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtzY2FsZU9wdGlvbnMubGVuZ3RoIDwgMn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5qZWN0SW50bChWaXNDb25maWdCeUZpZWxkU2VsZWN0b3IpO1xuIl19