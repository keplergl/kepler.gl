"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactIntl = require("react-intl");

var _localization = require("../../../localization");

var _styledComponents2 = require("../../common/styled-components");

var _datasetTag = _interopRequireDefault(require("../common/dataset-tag"));

var _tooltipChicklet = _interopRequireDefault(require("./tooltip-config/tooltip-chicklet"));

var _switch = _interopRequireDefault(require("../../common/switch"));

var _itemSelector = _interopRequireDefault(require("../../common/item-selector/item-selector"));

var _tooltip = require("../../../constants/tooltip");

var _fieldSelector = _interopRequireDefault(require("../../common/field-selector"));

var _templateObject, _templateObject2, _templateObject3;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var TooltipConfigWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  .item-selector > div > div {\n    overflow: visible;\n  }\n"])));

var ButtonWrapper = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  display: inherit;\n  padding: 0;\n\n  .button.clear-all {\n    background: transparent;\n    color: ", ";\n    margin: 0 0 0 8px;\n    padding: 0;\n\n    &:hover {\n      color: ", ";\n    }\n  }\n"])), function (props) {
  return props.theme.subtextColor;
}, function (props) {
  return props.theme.textColor;
});

var CompareSwitchWrapper = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  display: flex;\n  font-size: ", ";\n  justify-content: space-between;\n  line-height: 11px;\n  margin-bottom: 8px;\n"])), function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.inputFontSize;
});

TooltipConfigFactory.deps = [_datasetTag["default"], _fieldSelector["default"]];

function TooltipConfigFactory(DatasetTag, FieldSelector) {
  var DatasetTooltipConfig = function DatasetTooltipConfig(_ref) {
    var config = _ref.config,
        onChange = _ref.onChange,
        dataset = _ref.dataset;
    var dataId = dataset.id;
    return /*#__PURE__*/_react["default"].createElement(_styledComponents2.SidePanelSection, {
      key: dataId
    }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.SBFlexboxNoMargin, null, /*#__PURE__*/_react["default"].createElement(DatasetTag, {
      dataset: dataset
    }), Boolean(config.fieldsToShow[dataId].length) && /*#__PURE__*/_react["default"].createElement(ButtonWrapper, null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.Button, {
      className: "clear-all",
      onClick: function onClick() {
        var newConfig = _objectSpread(_objectSpread({}, config), {}, {
          fieldsToShow: _objectSpread(_objectSpread({}, config.fieldsToShow), {}, (0, _defineProperty2["default"])({}, dataId, []))
        });

        onChange(newConfig);
      },
      width: "54px",
      secondary: true
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: "fieldSelector.clearAll"
    })))), /*#__PURE__*/_react["default"].createElement(FieldSelector, {
      fields: dataset.fields,
      value: config.fieldsToShow[dataId],
      onSelect: function onSelect(selected) {
        var newConfig = _objectSpread(_objectSpread({}, config), {}, {
          fieldsToShow: _objectSpread(_objectSpread({}, config.fieldsToShow), {}, (0, _defineProperty2["default"])({}, dataId, selected.map(function (f) {
            return config.fieldsToShow[dataId].find(function (tooltipField) {
              return tooltipField.name === f.name;
            }) || {
              name: f.name,
              // default initial tooltip is null
              format: null
            };
          })))
        });

        onChange(newConfig);
      },
      closeOnSelect: false,
      multiSelect: true,
      inputTheme: "secondary",
      CustomChickletComponent: (0, _tooltipChicklet["default"])(dataId, config, onChange, dataset.fields)
    }));
  };

  var TooltipConfig = function TooltipConfig(_ref2) {
    var config = _ref2.config,
        datasets = _ref2.datasets,
        _onChange = _ref2.onChange,
        intl = _ref2.intl;
    return /*#__PURE__*/_react["default"].createElement(TooltipConfigWrapper, null, Object.keys(config.fieldsToShow).map(function (dataId) {
      return /*#__PURE__*/_react["default"].createElement(DatasetTooltipConfig, {
        key: dataId,
        config: config,
        onChange: _onChange,
        dataset: datasets[dataId]
      });
    }), /*#__PURE__*/_react["default"].createElement(CompareSwitchWrapper, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: "compare.modeLabel"
    }), /*#__PURE__*/_react["default"].createElement(_switch["default"], {
      checked: config.compareMode,
      id: "compare-mode-toggle",
      onChange: function onChange() {
        var newConfig = _objectSpread(_objectSpread({}, config), {}, {
          compareMode: !config.compareMode
        });

        _onChange(newConfig);
      },
      secondary: true
    })), /*#__PURE__*/_react["default"].createElement(_styledComponents2.SidePanelSection, null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.PanelLabel, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: "compare.typeLabel"
    })), /*#__PURE__*/_react["default"].createElement(_itemSelector["default"], {
      disabled: !config.compareMode,
      displayOption: function displayOption(d) {
        return intl.formatMessage({
          id: "compare.types.".concat(d)
        });
      },
      selectedItems: config.compareType,
      options: Object.values(_tooltip.COMPARE_TYPES),
      multiSelect: false,
      searchable: false,
      inputTheme: 'secondary',
      getOptionValue: function getOptionValue(d) {
        return d;
      },
      onChange: function onChange(option) {
        var newConfig = _objectSpread(_objectSpread({}, config), {}, {
          compareType: option
        });

        _onChange(newConfig);
      }
    })));
  };

  return (0, _reactIntl.injectIntl)(TooltipConfig);
}

var _default = TooltipConfigFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwvdG9vbHRpcC1jb25maWcuanMiXSwibmFtZXMiOlsiVG9vbHRpcENvbmZpZ1dyYXBwZXIiLCJzdHlsZWQiLCJkaXYiLCJCdXR0b25XcmFwcGVyIiwicHJvcHMiLCJ0aGVtZSIsInN1YnRleHRDb2xvciIsInRleHRDb2xvciIsIkNvbXBhcmVTd2l0Y2hXcmFwcGVyIiwibGFiZWxDb2xvciIsImlucHV0Rm9udFNpemUiLCJUb29sdGlwQ29uZmlnRmFjdG9yeSIsImRlcHMiLCJEYXRhc2V0VGFnRmFjdG9yeSIsIkZpZWxkU2VsZWN0b3JGYWN0b3J5IiwiRGF0YXNldFRhZyIsIkZpZWxkU2VsZWN0b3IiLCJEYXRhc2V0VG9vbHRpcENvbmZpZyIsImNvbmZpZyIsIm9uQ2hhbmdlIiwiZGF0YXNldCIsImRhdGFJZCIsImlkIiwiQm9vbGVhbiIsImZpZWxkc1RvU2hvdyIsImxlbmd0aCIsIm5ld0NvbmZpZyIsImZpZWxkcyIsInNlbGVjdGVkIiwibWFwIiwiZiIsImZpbmQiLCJ0b29sdGlwRmllbGQiLCJuYW1lIiwiZm9ybWF0IiwiVG9vbHRpcENvbmZpZyIsImRhdGFzZXRzIiwiaW50bCIsIk9iamVjdCIsImtleXMiLCJjb21wYXJlTW9kZSIsImQiLCJmb3JtYXRNZXNzYWdlIiwiY29tcGFyZVR5cGUiLCJ2YWx1ZXMiLCJDT01QQVJFX1RZUEVTIiwib3B0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQU1BOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLG9CQUFvQixHQUFHQyw2QkFBT0MsR0FBVixxSkFBMUI7O0FBTUEsSUFBTUMsYUFBYSxHQUFHRiw2QkFBT0MsR0FBVixrU0FNTixVQUFBRSxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlD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QVEsRUFBRSxDQUFDUixNQUFNLENBQUNzQixXQURwQjtBQUVFLE1BQUEsYUFBYSxFQUFFLHVCQUFBQyxDQUFDO0FBQUEsZUFDZEosSUFBSSxDQUFDSyxhQUFMLENBQW1CO0FBQ2pCcEIsVUFBQUEsRUFBRSwwQkFBbUJtQixDQUFuQjtBQURlLFNBQW5CLENBRGM7QUFBQSxPQUZsQjtBQU9FLE1BQUEsYUFBYSxFQUFFdkIsTUFBTSxDQUFDeUIsV0FQeEI7QUFRRSxNQUFBLE9BQU8sRUFBRUwsTUFBTSxDQUFDTSxNQUFQLENBQWNDLHNCQUFkLENBUlg7QUFTRSxNQUFBLFdBQVcsRUFBRSxLQVRmO0FBVUUsTUFBQSxVQUFVLEVBQUUsS0FWZDtBQVdFLE1BQUEsVUFBVSxFQUFFLFdBWGQ7QUFZRSxNQUFBLGNBQWMsRUFBRSx3QkFBQUosQ0FBQztBQUFBLGVBQUlBLENBQUo7QUFBQSxPQVpuQjtBQWFFLE1BQUEsUUFBUSxFQUFFLGtCQUFBSyxNQUFNLEVBQUk7QUFDbEIsWUFBTXBCLFNBQVMsbUNBQ1ZSLE1BRFU7QUFFYnlCLFVBQUFBLFdBQVcsRUFBRUc7QUFGQSxVQUFmOztBQUlBM0IsUUFBQUEsU0FBUSxDQUFDTyxTQUFELENBQVI7QUFDRDtBQW5CSCxNQUpGLENBeEJGLENBREY7QUFxREQsR0F0REQ7O0FBd0RBLFNBQU8sMkJBQVdTLGFBQVgsQ0FBUDtBQUNEOztlQUVjeEIsb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge2luamVjdEludGx9IGZyb20gJ3JlYWN0LWludGwnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuXG5pbXBvcnQge1xuICBTaWRlUGFuZWxTZWN0aW9uLFxuICBTQkZsZXhib3hOb01hcmdpbixcbiAgQnV0dG9uLFxuICBQYW5lbExhYmVsXG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBEYXRhc2V0VGFnRmFjdG9yeSBmcm9tICdjb21wb25lbnRzL3NpZGUtcGFuZWwvY29tbW9uL2RhdGFzZXQtdGFnJztcbmltcG9ydCBUb29sdGlwQ2hpY2tsZXRGYWN0b3J5IGZyb20gJy4vdG9vbHRpcC1jb25maWcvdG9vbHRpcC1jaGlja2xldCc7XG5pbXBvcnQgU3dpdGNoIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N3aXRjaCc7XG5pbXBvcnQgSXRlbVNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2l0ZW0tc2VsZWN0b3IvaXRlbS1zZWxlY3Rvcic7XG5pbXBvcnQge0NPTVBBUkVfVFlQRVN9IGZyb20gJ2NvbnN0YW50cy90b29sdGlwJztcbmltcG9ydCBGaWVsZFNlbGVjdG9yRmFjdG9yeSBmcm9tICcuLi8uLi9jb21tb24vZmllbGQtc2VsZWN0b3InO1xuXG5jb25zdCBUb29sdGlwQ29uZmlnV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIC5pdGVtLXNlbGVjdG9yID4gZGl2ID4gZGl2IHtcbiAgICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgfVxuYDtcblxuY29uc3QgQnV0dG9uV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGluaGVyaXQ7XG4gIHBhZGRpbmc6IDA7XG5cbiAgLmJ1dHRvbi5jbGVhci1hbGwge1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvcn07XG4gICAgbWFyZ2luOiAwIDAgMCA4cHg7XG4gICAgcGFkZGluZzogMDtcblxuICAgICY6aG92ZXIge1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgICB9XG4gIH1cbmA7XG5cbmNvbnN0IENvbXBhcmVTd2l0Y2hXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGFiZWxDb2xvcn07XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZvbnQtc2l6ZTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dEZvbnRTaXplfTtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBsaW5lLWhlaWdodDogMTFweDtcbiAgbWFyZ2luLWJvdHRvbTogOHB4O1xuYDtcblxuVG9vbHRpcENvbmZpZ0ZhY3RvcnkuZGVwcyA9IFtEYXRhc2V0VGFnRmFjdG9yeSwgRmllbGRTZWxlY3RvckZhY3RvcnldO1xuZnVuY3Rpb24gVG9vbHRpcENvbmZpZ0ZhY3RvcnkoRGF0YXNldFRhZywgRmllbGRTZWxlY3Rvcikge1xuICBjb25zdCBEYXRhc2V0VG9vbHRpcENvbmZpZyA9ICh7Y29uZmlnLCBvbkNoYW5nZSwgZGF0YXNldH0pID0+IHtcbiAgICBjb25zdCBkYXRhSWQgPSBkYXRhc2V0LmlkO1xuICAgIHJldHVybiAoXG4gICAgICA8U2lkZVBhbmVsU2VjdGlvbiBrZXk9e2RhdGFJZH0+XG4gICAgICAgIDxTQkZsZXhib3hOb01hcmdpbj5cbiAgICAgICAgICA8RGF0YXNldFRhZyBkYXRhc2V0PXtkYXRhc2V0fSAvPlxuICAgICAgICAgIHtCb29sZWFuKGNvbmZpZy5maWVsZHNUb1Nob3dbZGF0YUlkXS5sZW5ndGgpICYmIChcbiAgICAgICAgICAgIDxCdXR0b25XcmFwcGVyPlxuICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xlYXItYWxsXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBuZXdDb25maWcgPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzVG9TaG93OiB7XG4gICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLmZpZWxkc1RvU2hvdyxcbiAgICAgICAgICAgICAgICAgICAgICBbZGF0YUlkXTogW11cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlKG5ld0NvbmZpZyk7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICB3aWR0aD1cIjU0cHhcIlxuICAgICAgICAgICAgICAgIHNlY29uZGFyeVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9XCJmaWVsZFNlbGVjdG9yLmNsZWFyQWxsXCIgLz5cbiAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8L0J1dHRvbldyYXBwZXI+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9TQkZsZXhib3hOb01hcmdpbj5cbiAgICAgICAgPEZpZWxkU2VsZWN0b3JcbiAgICAgICAgICBmaWVsZHM9e2RhdGFzZXQuZmllbGRzfVxuICAgICAgICAgIHZhbHVlPXtjb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF19XG4gICAgICAgICAgb25TZWxlY3Q9e3NlbGVjdGVkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0NvbmZpZyA9IHtcbiAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICBmaWVsZHNUb1Nob3c6IHtcbiAgICAgICAgICAgICAgICAuLi5jb25maWcuZmllbGRzVG9TaG93LFxuICAgICAgICAgICAgICAgIFtkYXRhSWRdOiBzZWxlY3RlZC5tYXAoXG4gICAgICAgICAgICAgICAgICBmID0+XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5maWVsZHNUb1Nob3dbZGF0YUlkXS5maW5kKFxuICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXBGaWVsZCA9PiB0b29sdGlwRmllbGQubmFtZSA9PT0gZi5uYW1lXG4gICAgICAgICAgICAgICAgICAgICkgfHwge1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGYubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IGluaXRpYWwgdG9vbHRpcCBpcyBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBvbkNoYW5nZShuZXdDb25maWcpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgY2xvc2VPblNlbGVjdD17ZmFsc2V9XG4gICAgICAgICAgbXVsdGlTZWxlY3RcbiAgICAgICAgICBpbnB1dFRoZW1lPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICBDdXN0b21DaGlja2xldENvbXBvbmVudD17VG9vbHRpcENoaWNrbGV0RmFjdG9yeShkYXRhSWQsIGNvbmZpZywgb25DaGFuZ2UsIGRhdGFzZXQuZmllbGRzKX1cbiAgICAgICAgLz5cbiAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IFRvb2x0aXBDb25maWcgPSAoe2NvbmZpZywgZGF0YXNldHMsIG9uQ2hhbmdlLCBpbnRsfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8VG9vbHRpcENvbmZpZ1dyYXBwZXI+XG4gICAgICAgIHtPYmplY3Qua2V5cyhjb25maWcuZmllbGRzVG9TaG93KS5tYXAoZGF0YUlkID0+IChcbiAgICAgICAgICA8RGF0YXNldFRvb2x0aXBDb25maWdcbiAgICAgICAgICAgIGtleT17ZGF0YUlkfVxuICAgICAgICAgICAgY29uZmlnPXtjb25maWd9XG4gICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgICBkYXRhc2V0PXtkYXRhc2V0c1tkYXRhSWRdfVxuICAgICAgICAgIC8+XG4gICAgICAgICkpfVxuICAgICAgICA8Q29tcGFyZVN3aXRjaFdyYXBwZXI+XG4gICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9XCJjb21wYXJlLm1vZGVMYWJlbFwiIC8+XG4gICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgY2hlY2tlZD17Y29uZmlnLmNvbXBhcmVNb2RlfVxuICAgICAgICAgICAgaWQ9XCJjb21wYXJlLW1vZGUtdG9nZ2xlXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IG5ld0NvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICAuLi5jb25maWcsXG4gICAgICAgICAgICAgICAgY29tcGFyZU1vZGU6ICFjb25maWcuY29tcGFyZU1vZGVcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgb25DaGFuZ2UobmV3Q29uZmlnKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBzZWNvbmRhcnlcbiAgICAgICAgICAvPlxuICAgICAgICA8L0NvbXBhcmVTd2l0Y2hXcmFwcGVyPlxuICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPVwiY29tcGFyZS50eXBlTGFiZWxcIiAvPlxuICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICA8SXRlbVNlbGVjdG9yXG4gICAgICAgICAgICBkaXNhYmxlZD17IWNvbmZpZy5jb21wYXJlTW9kZX1cbiAgICAgICAgICAgIGRpc3BsYXlPcHRpb249e2QgPT5cbiAgICAgICAgICAgICAgaW50bC5mb3JtYXRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBpZDogYGNvbXBhcmUudHlwZXMuJHtkfWBcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbXM9e2NvbmZpZy5jb21wYXJlVHlwZX1cbiAgICAgICAgICAgIG9wdGlvbnM9e09iamVjdC52YWx1ZXMoQ09NUEFSRV9UWVBFUyl9XG4gICAgICAgICAgICBtdWx0aVNlbGVjdD17ZmFsc2V9XG4gICAgICAgICAgICBzZWFyY2hhYmxlPXtmYWxzZX1cbiAgICAgICAgICAgIGlucHV0VGhlbWU9eydzZWNvbmRhcnknfVxuICAgICAgICAgICAgZ2V0T3B0aW9uVmFsdWU9e2QgPT4gZH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvcHRpb24gPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuZXdDb25maWcgPSB7XG4gICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgIGNvbXBhcmVUeXBlOiBvcHRpb25cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgb25DaGFuZ2UobmV3Q29uZmlnKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgPC9Ub29sdGlwQ29uZmlnV3JhcHBlcj5cbiAgICApO1xuICB9O1xuXG4gIHJldHVybiBpbmplY3RJbnRsKFRvb2x0aXBDb25maWcpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBUb29sdGlwQ29uZmlnRmFjdG9yeTtcbiJdfQ==