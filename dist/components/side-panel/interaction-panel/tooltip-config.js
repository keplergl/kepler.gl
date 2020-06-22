"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactIntl = require("react-intl");

var _styledComponents2 = require("../../common/styled-components");

var _fieldSelector = _interopRequireDefault(require("../../common/field-selector"));

var _datasetTag = _interopRequireDefault(require("../common/dataset-tag"));

var _tooltipChicklet = _interopRequireDefault(require("./tooltip-config/tooltip-chicklet"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: inherit;\n  padding: 0;\n\n  .button.clear-all {\n    background: transparent;\n    color: ", ";\n    margin: 0 0 0 8px;\n    padding: 0;\n\n    &:hover {\n      color: ", ";\n    }\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  .item-selector > div > div {\n    overflow: visible;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

TooltipConfigFactory.deps = [_datasetTag["default"]];

var TooltipConfigWrapper = _styledComponents["default"].div(_templateObject());

var ButtonWrapper = _styledComponents["default"].div(_templateObject2(), function (props) {
  return props.theme.subtextColor;
}, function (props) {
  return props.theme.textColor;
});

function TooltipConfigFactory(DatasetTag) {
  var TooltipConfig =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(TooltipConfig, _Component);

    function TooltipConfig() {
      (0, _classCallCheck2["default"])(this, TooltipConfig);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(TooltipConfig).apply(this, arguments));
    }

    (0, _createClass2["default"])(TooltipConfig, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            config = _this$props.config,
            datasets = _this$props.datasets,
            onChange = _this$props.onChange;
        return _react["default"].createElement(TooltipConfigWrapper, null, Object.keys(config.fieldsToShow).map(function (dataId) {
          return _react["default"].createElement(_styledComponents2.SidePanelSection, {
            key: dataId
          }, _react["default"].createElement(_styledComponents2.SBFlexboxNoMargin, null, _react["default"].createElement(DatasetTag, {
            dataset: datasets[dataId]
          }), Boolean(config.fieldsToShow[dataId].length) && _react["default"].createElement(ButtonWrapper, null, _react["default"].createElement(_styledComponents2.Button, {
            className: "clear-all",
            onClick: function onClick() {
              var newConfig = _objectSpread({}, config, {
                fieldsToShow: _objectSpread({}, config.fieldsToShow, (0, _defineProperty2["default"])({}, dataId, []))
              });

              onChange(newConfig);
            },
            width: "48px",
            secondary: true
          }, _react["default"].createElement(_reactIntl.FormattedMessage, {
            id: "fieldSelector.clearAll"
          })))), _react["default"].createElement(_fieldSelector["default"], {
            fields: datasets[dataId].fields,
            value: config.fieldsToShow[dataId],
            onSelect: function onSelect(fieldsToShow) {
              var newConfig = _objectSpread({}, config, {
                fieldsToShow: _objectSpread({}, config.fieldsToShow, (0, _defineProperty2["default"])({}, dataId, fieldsToShow))
              });

              onChange(newConfig);
            },
            closeOnSelect: false,
            multiSelect: true,
            inputTheme: "secondary",
            CustomChickletComponent: (0, _tooltipChicklet["default"])(dataId, config, onChange, datasets[dataId].fields)
          }));
        }));
      }
    }]);
    return TooltipConfig;
  }(_react.Component);

  return TooltipConfig;
}

var _default = TooltipConfigFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwvdG9vbHRpcC1jb25maWcuanMiXSwibmFtZXMiOlsiVG9vbHRpcENvbmZpZ0ZhY3RvcnkiLCJkZXBzIiwiRGF0YXNldFRhZ0ZhY3RvcnkiLCJUb29sdGlwQ29uZmlnV3JhcHBlciIsInN0eWxlZCIsImRpdiIsIkJ1dHRvbldyYXBwZXIiLCJwcm9wcyIsInRoZW1lIiwic3VidGV4dENvbG9yIiwidGV4dENvbG9yIiwiRGF0YXNldFRhZyIsIlRvb2x0aXBDb25maWciLCJjb25maWciLCJkYXRhc2V0cyIsIm9uQ2hhbmdlIiwiT2JqZWN0Iiwia2V5cyIsImZpZWxkc1RvU2hvdyIsIm1hcCIsImRhdGFJZCIsIkJvb2xlYW4iLCJsZW5ndGgiLCJuZXdDb25maWciLCJmaWVsZHMiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUFBLG9CQUFvQixDQUFDQyxJQUFyQixHQUE0QixDQUFDQyxzQkFBRCxDQUE1Qjs7QUFFQSxJQUFNQyxvQkFBb0IsR0FBR0MsNkJBQU9DLEdBQVYsbUJBQTFCOztBQU1BLElBQU1DLGFBQWEsR0FBR0YsNkJBQU9DLEdBQVYscUJBTU4sVUFBQUUsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxZQUFoQjtBQUFBLENBTkMsRUFXSixVQUFBRixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlFLFNBQWhCO0FBQUEsQ0FYRCxDQUFuQjs7QUFnQkEsU0FBU1Ysb0JBQVQsQ0FBOEJXLFVBQTlCLEVBQTBDO0FBQUEsTUFDbENDLGFBRGtDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSwrQkFFN0I7QUFBQSwwQkFDOEIsS0FBS0wsS0FEbkM7QUFBQSxZQUNBTSxNQURBLGVBQ0FBLE1BREE7QUFBQSxZQUNRQyxRQURSLGVBQ1FBLFFBRFI7QUFBQSxZQUNrQkMsUUFEbEIsZUFDa0JBLFFBRGxCO0FBRVAsZUFDRSxnQ0FBQyxvQkFBRCxRQUNHQyxNQUFNLENBQUNDLElBQVAsQ0FBWUosTUFBTSxDQUFDSyxZQUFuQixFQUFpQ0MsR0FBakMsQ0FBcUMsVUFBQUMsTUFBTTtBQUFBLGlCQUMxQyxnQ0FBQyxtQ0FBRDtBQUFrQixZQUFBLEdBQUcsRUFBRUE7QUFBdkIsYUFDRSxnQ0FBQyxvQ0FBRCxRQUNFLGdDQUFDLFVBQUQ7QUFBWSxZQUFBLE9BQU8sRUFBRU4sUUFBUSxDQUFDTSxNQUFEO0FBQTdCLFlBREYsRUFFR0MsT0FBTyxDQUFDUixNQUFNLENBQUNLLFlBQVAsQ0FBb0JFLE1BQXBCLEVBQTRCRSxNQUE3QixDQUFQLElBQ0MsZ0NBQUMsYUFBRCxRQUNFLGdDQUFDLHlCQUFEO0FBQ0UsWUFBQSxTQUFTLEVBQUMsV0FEWjtBQUVFLFlBQUEsT0FBTyxFQUFFLG1CQUFNO0FBQ2Isa0JBQU1DLFNBQVMscUJBQ1ZWLE1BRFU7QUFFYkssZ0JBQUFBLFlBQVksb0JBQ1BMLE1BQU0sQ0FBQ0ssWUFEQSx1Q0FFVEUsTUFGUyxFQUVBLEVBRkE7QUFGQyxnQkFBZjs7QUFPQUwsY0FBQUEsUUFBUSxDQUFDUSxTQUFELENBQVI7QUFDRCxhQVhIO0FBWUUsWUFBQSxLQUFLLEVBQUMsTUFaUjtBQWFFLFlBQUEsU0FBUztBQWJYLGFBZUUsZ0NBQUMsMkJBQUQ7QUFBa0IsWUFBQSxFQUFFLEVBQUM7QUFBckIsWUFmRixDQURGLENBSEosQ0FERixFQXlCRSxnQ0FBQyx5QkFBRDtBQUNFLFlBQUEsTUFBTSxFQUFFVCxRQUFRLENBQUNNLE1BQUQsQ0FBUixDQUFpQkksTUFEM0I7QUFFRSxZQUFBLEtBQUssRUFBRVgsTUFBTSxDQUFDSyxZQUFQLENBQW9CRSxNQUFwQixDQUZUO0FBR0UsWUFBQSxRQUFRLEVBQUUsa0JBQUFGLFlBQVksRUFBSTtBQUN4QixrQkFBTUssU0FBUyxxQkFDVlYsTUFEVTtBQUViSyxnQkFBQUEsWUFBWSxvQkFDUEwsTUFBTSxDQUFDSyxZQURBLHVDQUVURSxNQUZTLEVBRUFGLFlBRkE7QUFGQyxnQkFBZjs7QUFPQUgsY0FBQUEsUUFBUSxDQUFDUSxTQUFELENBQVI7QUFDRCxhQVpIO0FBYUUsWUFBQSxhQUFhLEVBQUUsS0FiakI7QUFjRSxZQUFBLFdBQVcsTUFkYjtBQWVFLFlBQUEsVUFBVSxFQUFDLFdBZmI7QUFnQkUsWUFBQSx1QkFBdUIsRUFBRSxpQ0FDdkJILE1BRHVCLEVBRXZCUCxNQUZ1QixFQUd2QkUsUUFIdUIsRUFJdkJELFFBQVEsQ0FBQ00sTUFBRCxDQUFSLENBQWlCSSxNQUpNO0FBaEIzQixZQXpCRixDQUQwQztBQUFBLFNBQTNDLENBREgsQ0FERjtBQXVERDtBQTNEcUM7QUFBQTtBQUFBLElBQ1pDLGdCQURZOztBQThEeEMsU0FBT2IsYUFBUDtBQUNEOztlQUVjWixvQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ3JlYWN0LWludGwnO1xuaW1wb3J0IHtTaWRlUGFuZWxTZWN0aW9uLCBTQkZsZXhib3hOb01hcmdpbiwgQnV0dG9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgRmllbGRTZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9maWVsZC1zZWxlY3Rvcic7XG5pbXBvcnQgRGF0YXNldFRhZ0ZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9zaWRlLXBhbmVsL2NvbW1vbi9kYXRhc2V0LXRhZyc7XG5pbXBvcnQgVG9vbHRpcENoaWNrbGV0RmFjdG9yeSBmcm9tICcuL3Rvb2x0aXAtY29uZmlnL3Rvb2x0aXAtY2hpY2tsZXQnO1xuXG5Ub29sdGlwQ29uZmlnRmFjdG9yeS5kZXBzID0gW0RhdGFzZXRUYWdGYWN0b3J5XTtcblxuY29uc3QgVG9vbHRpcENvbmZpZ1dyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICAuaXRlbS1zZWxlY3RvciA+IGRpdiA+IGRpdiB7XG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XG4gIH1cbmA7XG5cbmNvbnN0IEJ1dHRvbldyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBpbmhlcml0O1xuICBwYWRkaW5nOiAwO1xuXG4gIC5idXR0b24uY2xlYXItYWxsIHtcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3J9O1xuICAgIG1hcmdpbjogMCAwIDAgOHB4O1xuICAgIHBhZGRpbmc6IDA7XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gICAgfVxuICB9XG5gO1xuXG5mdW5jdGlvbiBUb29sdGlwQ29uZmlnRmFjdG9yeShEYXRhc2V0VGFnKSB7XG4gIGNsYXNzIFRvb2x0aXBDb25maWcgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtjb25maWcsIGRhdGFzZXRzLCBvbkNoYW5nZX0gPSB0aGlzLnByb3BzO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRvb2x0aXBDb25maWdXcmFwcGVyPlxuICAgICAgICAgIHtPYmplY3Qua2V5cyhjb25maWcuZmllbGRzVG9TaG93KS5tYXAoZGF0YUlkID0+IChcbiAgICAgICAgICAgIDxTaWRlUGFuZWxTZWN0aW9uIGtleT17ZGF0YUlkfT5cbiAgICAgICAgICAgICAgPFNCRmxleGJveE5vTWFyZ2luPlxuICAgICAgICAgICAgICAgIDxEYXRhc2V0VGFnIGRhdGFzZXQ9e2RhdGFzZXRzW2RhdGFJZF19IC8+XG4gICAgICAgICAgICAgICAge0Jvb2xlYW4oY29uZmlnLmZpZWxkc1RvU2hvd1tkYXRhSWRdLmxlbmd0aCkgJiYgKFxuICAgICAgICAgICAgICAgICAgPEJ1dHRvbldyYXBwZXI+XG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGVhci1hbGxcIlxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0NvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHNUb1Nob3c6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5jb25maWcuZmllbGRzVG9TaG93LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkYXRhSWRdOiBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2UobmV3Q29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiNDhweFwiXG4gICAgICAgICAgICAgICAgICAgICAgc2Vjb25kYXJ5XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD1cImZpZWxkU2VsZWN0b3IuY2xlYXJBbGxcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvQnV0dG9uV3JhcHBlcj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L1NCRmxleGJveE5vTWFyZ2luPlxuICAgICAgICAgICAgICA8RmllbGRTZWxlY3RvclxuICAgICAgICAgICAgICAgIGZpZWxkcz17ZGF0YXNldHNbZGF0YUlkXS5maWVsZHN9XG4gICAgICAgICAgICAgICAgdmFsdWU9e2NvbmZpZy5maWVsZHNUb1Nob3dbZGF0YUlkXX1cbiAgICAgICAgICAgICAgICBvblNlbGVjdD17ZmllbGRzVG9TaG93ID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0NvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICBmaWVsZHNUb1Nob3c6IHtcbiAgICAgICAgICAgICAgICAgICAgICAuLi5jb25maWcuZmllbGRzVG9TaG93LFxuICAgICAgICAgICAgICAgICAgICAgIFtkYXRhSWRdOiBmaWVsZHNUb1Nob3dcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlKG5ld0NvbmZpZyk7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBjbG9zZU9uU2VsZWN0PXtmYWxzZX1cbiAgICAgICAgICAgICAgICBtdWx0aVNlbGVjdFxuICAgICAgICAgICAgICAgIGlucHV0VGhlbWU9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICAgIEN1c3RvbUNoaWNrbGV0Q29tcG9uZW50PXtUb29sdGlwQ2hpY2tsZXRGYWN0b3J5KFxuICAgICAgICAgICAgICAgICAgZGF0YUlkLFxuICAgICAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2UsXG4gICAgICAgICAgICAgICAgICBkYXRhc2V0c1tkYXRhSWRdLmZpZWxkc1xuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvVG9vbHRpcENvbmZpZ1dyYXBwZXI+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBUb29sdGlwQ29uZmlnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBUb29sdGlwQ29uZmlnRmFjdG9yeTtcbiJdfQ==