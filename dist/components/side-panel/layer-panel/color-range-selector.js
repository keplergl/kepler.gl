"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColorPaletteGroup = exports.PaletteConfig = exports["default"] = exports.ALL_STEPS = exports.ALL_TYPES = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash.uniq"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reselect = require("reselect");

var _itemSelector = _interopRequireDefault(require("../../common/item-selector/item-selector"));

var _styledComponents2 = require("../../common/styled-components");

var _switch = _interopRequireDefault(require("../../common/switch"));

var _colorPalette = _interopRequireDefault(require("./color-palette"));

var _customPalette = _interopRequireDefault(require("./custom-palette"));

var _colorRanges = require("../../../constants/color-ranges");

var _dataUtils = require("../../../utils/data-utils");

var _colorUtils = require("../../../utils/color-utils");

var _localization = require("../../../localization");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ALL_TYPES = (0, _lodash["default"])(_colorRanges.COLOR_RANGES.map(function (c) {
  return c.type;
}).filter(function (ctype) {
  return ctype;
}).concat(['all', 'custom']));
exports.ALL_TYPES = ALL_TYPES;
var ALL_STEPS = (0, _lodash["default"])(_colorRanges.COLOR_RANGES.map(function (d) {
  return d.colors.length;
})).sort(_dataUtils.numberSort);
exports.ALL_STEPS = ALL_STEPS;

var StyledColorConfig = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 12px 12px 0 12px;\n"])));

var StyledColorRangeSelector = _styledComponents["default"].div.attrs({
  className: 'color-range-selector'
})(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  padding-bottom: 12px;\n"])));

var StyledPaletteConfig = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 8px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  .color-palette__config__label {\n    flex-grow: 1;\n  }\n  .color-palette__config__select {\n    flex-grow: 1;\n  }\n  .item-selector .item-selector__dropdown {\n    ", ";\n  }\n"])), function (props) {
  return props.theme.secondaryInput;
});

var CONFIG_SETTINGS = {
  type: {
    type: 'select',
    options: ALL_TYPES
  },
  steps: {
    type: 'select',
    options: ALL_STEPS
  },
  reversed: {
    type: 'switch',
    options: [true, false]
  },
  custom: {
    label: 'customPalette',
    type: 'switch',
    options: [true, false]
  }
};

var ColorRangeSelect = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ColorRangeSelect, _Component);

  var _super = _createSuper(ColorRangeSelect);

  function ColorRangeSelect() {
    var _this;

    (0, _classCallCheck2["default"])(this, ColorRangeSelect);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "colorRangesSelector", function (props) {
      return props.colorRanges;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "configTypeSelector", function (props) {
      return props.colorPaletteUI.colorRangeConfig.type;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "configStepSelector", function (props) {
      return props.colorPaletteUI.colorRangeConfig.steps;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "filteredColorRange", (0, _reselect.createSelector)(_this.colorRangesSelector, _this.configTypeSelector, _this.configStepSelector, function (colorRanges, type, steps) {
      return colorRanges.filter(function (colorRange) {
        var isType = type === 'all' || type === colorRange.type;
        var isStep = Number(steps) === colorRange.colors.length;
        return isType && isStep;
      });
    }));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_updateConfig", function (_ref) {
      var key = _ref.key,
          value = _ref.value;

      _this._setColorRangeConfig((0, _defineProperty2["default"])({}, key, value));
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onSetCustomPalette", function (config) {
      _this.props.setColorPaletteUI({
        customPalette: config
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_setColorRangeConfig", function (newConfig) {
      _this.props.setColorPaletteUI({
        colorRangeConfig: newConfig
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onCustomPaletteCancel", function (newConfig) {
      _this.props.setColorPaletteUI({
        showSketcher: false,
        colorRangeConfig: {
          custom: false
        }
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onToggleSketcher", function (val) {
      _this.props.setColorPaletteUI({
        showSketcher: val
      });
    });
    return _this;
  }

  (0, _createClass2["default"])(ColorRangeSelect, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props$colorPale = this.props.colorPaletteUI,
          customPalette = _this$props$colorPale.customPalette,
          showSketcher = _this$props$colorPale.showSketcher,
          colorRangeConfig = _this$props$colorPale.colorRangeConfig;
      var filteredColorRanges = this.filteredColorRange(this.props);
      return /*#__PURE__*/_react["default"].createElement(StyledColorRangeSelector, null, /*#__PURE__*/_react["default"].createElement(StyledColorConfig, null, (colorRangeConfig.custom ? ['custom'] : Object.keys(colorRangeConfig)).map(function (key) {
        return /*#__PURE__*/_react["default"].createElement(PaletteConfig, {
          key: key,
          label: CONFIG_SETTINGS[key].label || key,
          config: CONFIG_SETTINGS[key],
          value: colorRangeConfig[key],
          onChange: function onChange(value) {
            return _this2._updateConfig({
              key: key,
              value: value
            });
          }
        });
      })), colorRangeConfig.custom ? /*#__PURE__*/_react["default"].createElement(_customPalette["default"], {
        customPalette: customPalette,
        showSketcher: showSketcher,
        selected: this.props.selectedColorRange,
        onApply: this.props.onSelectColorRange,
        onToggleSketcher: this._onToggleSketcher,
        setCustomPalette: this._onSetCustomPalette,
        onCancel: this._onCustomPaletteCancel
      }) : /*#__PURE__*/_react["default"].createElement(ColorPaletteGroup, {
        colorRanges: filteredColorRanges,
        onSelect: this.props.onSelectColorRange,
        selected: this.props.selectedColorRange,
        reversed: colorRangeConfig.reversed
      }));
    }
  }]);
  return ColorRangeSelect;
}(_react.Component);

exports["default"] = ColorRangeSelect;
(0, _defineProperty2["default"])(ColorRangeSelect, "propTypes", {
  colorPaletteUI: _propTypes["default"].object.isRequired,
  selectedColorRange: _propTypes["default"].object.isRequired,
  onSelectColorRange: _propTypes["default"].func.isRequired,
  setColorPaletteUI: _propTypes["default"].func.isRequired,
  // optional
  colorRanges: _propTypes["default"].arrayOf(_propTypes["default"].any)
});
(0, _defineProperty2["default"])(ColorRangeSelect, "defaultProps", {
  colorRanges: _colorRanges.COLOR_RANGES,
  onSelectColorRange: function onSelectColorRange() {},
  setColorPaletteUI: function setColorPaletteUI() {}
});

var PaletteConfig = function PaletteConfig(_ref2) {
  var label = _ref2.label,
      value = _ref2.value,
      _ref2$config = _ref2.config,
      type = _ref2$config.type,
      options = _ref2$config.options,
      _onChange = _ref2.onChange;
  return /*#__PURE__*/_react["default"].createElement(StyledPaletteConfig, {
    className: "color-palette__config",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "color-palette__config__label"
  }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.PanelLabel, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: "color.".concat(label)
  }))), type === 'select' && /*#__PURE__*/_react["default"].createElement("div", {
    className: "color-palette__config__select"
  }, /*#__PURE__*/_react["default"].createElement(_itemSelector["default"], {
    selectedItems: value,
    options: options,
    multiSelect: false,
    searchable: false,
    onChange: _onChange
  })), type === 'switch' && /*#__PURE__*/_react["default"].createElement(_switch["default"], {
    checked: value,
    id: "".concat(label, "-toggle"),
    onChange: function onChange() {
      return _onChange(!value);
    },
    secondary: true
  }));
};

exports.PaletteConfig = PaletteConfig;

var StyledColorRange = _styledComponents["default"].div.attrs({
  className: 'color-palette-outer'
})(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 0 8px;\n  :hover {\n    background-color: ", ";\n    cursor: pointer;\n  }\n"])), function (props) {
  return props.theme.panelBackgroundHover;
});

var ColorPaletteGroup = function ColorPaletteGroup(_ref3) {
  var reversed = _ref3.reversed,
      onSelect = _ref3.onSelect,
      selected = _ref3.selected,
      colorRanges = _ref3.colorRanges;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "color-palette__group"
  }, colorRanges.map(function (colorRange, i) {
    return /*#__PURE__*/_react["default"].createElement(StyledColorRange, {
      key: "".concat(colorRange.name, "-").concat(i),
      onClick: function onClick(e) {
        return onSelect(reversed ? (0, _colorUtils.reverseColorRange)(true, colorRange) : colorRange, e);
      }
    }, /*#__PURE__*/_react["default"].createElement(_colorPalette["default"], {
      colors: colorRange.colors,
      isReversed: reversed,
      isSelected: colorRange.name === selected.name && reversed === Boolean(selected.reversed)
    }));
  }));
};

exports.ColorPaletteGroup = ColorPaletteGroup;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3ItcmFuZ2Utc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiQUxMX1RZUEVTIiwiQ09MT1JfUkFOR0VTIiwibWFwIiwiYyIsInR5cGUiLCJmaWx0ZXIiLCJjdHlwZSIsImNvbmNhdCIsIkFMTF9TVEVQUyIsImQiLCJjb2xvcnMiLCJsZW5ndGgiLCJzb3J0IiwibnVtYmVyU29ydCIsIlN0eWxlZENvbG9yQ29uZmlnIiwic3R5bGVkIiwiZGl2IiwiU3R5bGVkQ29sb3JSYW5nZVNlbGVjdG9yIiwiYXR0cnMiLCJjbGFzc05hbWUiLCJTdHlsZWRQYWxldHRlQ29uZmlnIiwicHJvcHMiLCJ0aGVtZSIsInNlY29uZGFyeUlucHV0IiwiQ09ORklHX1NFVFRJTkdTIiwib3B0aW9ucyIsInN0ZXBzIiwicmV2ZXJzZWQiLCJjdXN0b20iLCJsYWJlbCIsIkNvbG9yUmFuZ2VTZWxlY3QiLCJjb2xvclJhbmdlcyIsImNvbG9yUGFsZXR0ZVVJIiwiY29sb3JSYW5nZUNvbmZpZyIsImNvbG9yUmFuZ2VzU2VsZWN0b3IiLCJjb25maWdUeXBlU2VsZWN0b3IiLCJjb25maWdTdGVwU2VsZWN0b3IiLCJjb2xvclJhbmdlIiwiaXNUeXBlIiwiaXNTdGVwIiwiTnVtYmVyIiwia2V5IiwidmFsdWUiLCJfc2V0Q29sb3JSYW5nZUNvbmZpZyIsImNvbmZpZyIsInNldENvbG9yUGFsZXR0ZVVJIiwiY3VzdG9tUGFsZXR0ZSIsIm5ld0NvbmZpZyIsInNob3dTa2V0Y2hlciIsInZhbCIsImZpbHRlcmVkQ29sb3JSYW5nZXMiLCJmaWx0ZXJlZENvbG9yUmFuZ2UiLCJPYmplY3QiLCJrZXlzIiwiX3VwZGF0ZUNvbmZpZyIsInNlbGVjdGVkQ29sb3JSYW5nZSIsIm9uU2VsZWN0Q29sb3JSYW5nZSIsIl9vblRvZ2dsZVNrZXRjaGVyIiwiX29uU2V0Q3VzdG9tUGFsZXR0ZSIsIl9vbkN1c3RvbVBhbGV0dGVDYW5jZWwiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZnVuYyIsImFycmF5T2YiLCJhbnkiLCJQYWxldHRlQ29uZmlnIiwib25DaGFuZ2UiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwiU3R5bGVkQ29sb3JSYW5nZSIsInBhbmVsQmFja2dyb3VuZEhvdmVyIiwiQ29sb3JQYWxldHRlR3JvdXAiLCJvblNlbGVjdCIsInNlbGVjdGVkIiwiaSIsIm5hbWUiLCJCb29sZWFuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRU8sSUFBTUEsU0FBUyxHQUFHLHdCQUN2QkMsMEJBQWFDLEdBQWIsQ0FBaUIsVUFBQUMsQ0FBQztBQUFBLFNBQUlBLENBQUMsQ0FBQ0MsSUFBTjtBQUFBLENBQWxCLEVBQ0dDLE1BREgsQ0FDVSxVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSjtBQUFBLENBRGYsRUFFR0MsTUFGSCxDQUVVLENBQUMsS0FBRCxFQUFRLFFBQVIsQ0FGVixDQUR1QixDQUFsQjs7QUFNQSxJQUFNQyxTQUFTLEdBQUcsd0JBQUtQLDBCQUFhQyxHQUFiLENBQWlCLFVBQUFPLENBQUM7QUFBQSxTQUFJQSxDQUFDLENBQUNDLE1BQUYsQ0FBU0MsTUFBYjtBQUFBLENBQWxCLENBQUwsRUFBNkNDLElBQTdDLENBQWtEQyxxQkFBbEQsQ0FBbEI7OztBQUVQLElBQU1DLGlCQUFpQixHQUFHQyw2QkFBT0MsR0FBVixzSEFBdkI7O0FBSUEsSUFBTUMsd0JBQXdCLEdBQUdGLDZCQUFPQyxHQUFQLENBQVdFLEtBQVgsQ0FBaUI7QUFDaERDLEVBQUFBLFNBQVMsRUFBRTtBQURxQyxDQUFqQixDQUFILG1IQUE5Qjs7QUFNQSxJQUFNQyxtQkFBbUIsR0FBR0wsNkJBQU9DLEdBQVYsbVhBWW5CLFVB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QyxRQUFGLFNBQUVBLFFBQUY7QUFBQSxNQUFZK0MsUUFBWixTQUFZQSxRQUFaO0FBQUEsTUFBc0JDLFFBQXRCLFNBQXNCQSxRQUF0QjtBQUFBLE1BQWdDNUMsV0FBaEMsU0FBZ0NBLFdBQWhDO0FBQUEsc0JBQy9CO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNHQSxXQUFXLENBQUM3QixHQUFaLENBQWdCLFVBQUNtQyxVQUFELEVBQWF1QyxDQUFiO0FBQUEsd0JBQ2YsZ0NBQUMsZ0JBQUQ7QUFDRSxNQUFBLEdBQUcsWUFBS3ZDLFVBQVUsQ0FBQ3dDLElBQWhCLGNBQXdCRCxDQUF4QixDQURMO0FBRUUsTUFBQSxPQUFPLEVBQUUsaUJBQUFQLENBQUM7QUFBQSxlQUFJSyxRQUFRLENBQUMvQyxRQUFRLEdBQUcsbUNBQWtCLElBQWxCLEVBQXdCVSxVQUF4QixDQUFILEdBQXlDQSxVQUFsRCxFQUE4RGdDLENBQTlELENBQVo7QUFBQTtBQUZaLG9CQUlFLGdDQUFDLHdCQUFEO0FBQ0UsTUFBQSxNQUFNLEVBQUVoQyxVQUFVLENBQUMzQixNQURyQjtBQUVFLE1BQUEsVUFBVSxFQUFFaUIsUUFGZDtBQUdFLE1BQUEsVUFBVSxFQUFFVSxVQUFVLENBQUN3QyxJQUFYLEtBQW9CRixRQUFRLENBQUNFLElBQTdCLElBQXFDbEQsUUFBUSxLQUFLbUQsT0FBTyxDQUFDSCxRQUFRLENBQUNoRCxRQUFWO0FBSHZFLE1BSkYsQ0FEZTtBQUFBLEdBQWhCLENBREgsQ0FEK0I7QUFBQSxDQUExQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB1bmlxIGZyb20gJ2xvZGFzaC51bmlxJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuXG5pbXBvcnQgSXRlbVNlbGVjdG9yIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2l0ZW0tc2VsZWN0b3IvaXRlbS1zZWxlY3Rvcic7XG5pbXBvcnQge1BhbmVsTGFiZWx9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBTd2l0Y2ggZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3dpdGNoJztcbmltcG9ydCBDb2xvclBhbGV0dGUgZnJvbSAnLi9jb2xvci1wYWxldHRlJztcbmltcG9ydCBDdXN0b21QYWxldHRlIGZyb20gJy4vY3VzdG9tLXBhbGV0dGUnO1xuaW1wb3J0IHtDT0xPUl9SQU5HRVN9IGZyb20gJ2NvbnN0YW50cy9jb2xvci1yYW5nZXMnO1xuaW1wb3J0IHtudW1iZXJTb3J0fSBmcm9tICd1dGlscy9kYXRhLXV0aWxzJztcbmltcG9ydCB7cmV2ZXJzZUNvbG9yUmFuZ2V9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAnbG9jYWxpemF0aW9uJztcblxuZXhwb3J0IGNvbnN0IEFMTF9UWVBFUyA9IHVuaXEoXG4gIENPTE9SX1JBTkdFUy5tYXAoYyA9PiBjLnR5cGUpXG4gICAgLmZpbHRlcihjdHlwZSA9PiBjdHlwZSlcbiAgICAuY29uY2F0KFsnYWxsJywgJ2N1c3RvbSddKVxuKTtcblxuZXhwb3J0IGNvbnN0IEFMTF9TVEVQUyA9IHVuaXEoQ09MT1JfUkFOR0VTLm1hcChkID0+IGQuY29sb3JzLmxlbmd0aCkpLnNvcnQobnVtYmVyU29ydCk7XG5cbmNvbnN0IFN0eWxlZENvbG9yQ29uZmlnID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZzogMTJweCAxMnB4IDAgMTJweDtcbmA7XG5cbmNvbnN0IFN0eWxlZENvbG9yUmFuZ2VTZWxlY3RvciA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdjb2xvci1yYW5nZS1zZWxlY3Rvcidcbn0pYFxuICBwYWRkaW5nLWJvdHRvbTogMTJweDtcbmA7XG5cbmNvbnN0IFN0eWxlZFBhbGV0dGVDb25maWcgPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tYm90dG9tOiA4cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgLmNvbG9yLXBhbGV0dGVfX2NvbmZpZ19fbGFiZWwge1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgfVxuICAuY29sb3ItcGFsZXR0ZV9fY29uZmlnX19zZWxlY3Qge1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgfVxuICAuaXRlbS1zZWxlY3RvciAuaXRlbS1zZWxlY3Rvcl9fZHJvcGRvd24ge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Vjb25kYXJ5SW5wdXR9O1xuICB9XG5gO1xuXG5jb25zdCBDT05GSUdfU0VUVElOR1MgPSB7XG4gIHR5cGU6IHtcbiAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICBvcHRpb25zOiBBTExfVFlQRVNcbiAgfSxcbiAgc3RlcHM6IHtcbiAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICBvcHRpb25zOiBBTExfU1RFUFNcbiAgfSxcbiAgcmV2ZXJzZWQ6IHtcbiAgICB0eXBlOiAnc3dpdGNoJyxcbiAgICBvcHRpb25zOiBbdHJ1ZSwgZmFsc2VdXG4gIH0sXG4gIGN1c3RvbToge1xuICAgIGxhYmVsOiAnY3VzdG9tUGFsZXR0ZScsXG4gICAgdHlwZTogJ3N3aXRjaCcsXG4gICAgb3B0aW9uczogW3RydWUsIGZhbHNlXVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xvclJhbmdlU2VsZWN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjb2xvclBhbGV0dGVVSTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHNlbGVjdGVkQ29sb3JSYW5nZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIG9uU2VsZWN0Q29sb3JSYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzZXRDb2xvclBhbGV0dGVVSTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAvLyBvcHRpb25hbFxuICAgIGNvbG9yUmFuZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KVxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgY29sb3JSYW5nZXM6IENPTE9SX1JBTkdFUyxcbiAgICBvblNlbGVjdENvbG9yUmFuZ2U6ICgpID0+IHt9LFxuICAgIHNldENvbG9yUGFsZXR0ZVVJOiAoKSA9PiB7fVxuICB9O1xuXG4gIGNvbG9yUmFuZ2VzU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5jb2xvclJhbmdlcztcbiAgY29uZmlnVHlwZVNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuY29sb3JQYWxldHRlVUkuY29sb3JSYW5nZUNvbmZpZy50eXBlO1xuICBjb25maWdTdGVwU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5jb2xvclBhbGV0dGVVSS5jb2xvclJhbmdlQ29uZmlnLnN0ZXBzO1xuICBmaWx0ZXJlZENvbG9yUmFuZ2UgPSBjcmVhdGVTZWxlY3RvcihcbiAgICB0aGlzLmNvbG9yUmFuZ2VzU2VsZWN0b3IsXG4gICAgdGhpcy5jb25maWdUeXBlU2VsZWN0b3IsXG4gICAgdGhpcy5jb25maWdTdGVwU2VsZWN0b3IsXG4gICAgKGNvbG9yUmFuZ2VzLCB0eXBlLCBzdGVwcykgPT4ge1xuICAgICAgcmV0dXJuIGNvbG9yUmFuZ2VzLmZpbHRlcihjb2xvclJhbmdlID0+IHtcbiAgICAgICAgY29uc3QgaXNUeXBlID0gdHlwZSA9PT0gJ2FsbCcgfHwgdHlwZSA9PT0gY29sb3JSYW5nZS50eXBlO1xuICAgICAgICBjb25zdCBpc1N0ZXAgPSBOdW1iZXIoc3RlcHMpID09PSBjb2xvclJhbmdlLmNvbG9ycy5sZW5ndGg7XG5cbiAgICAgICAgcmV0dXJuIGlzVHlwZSAmJiBpc1N0ZXA7XG4gICAgICB9KTtcbiAgICB9XG4gICk7XG5cbiAgX3VwZGF0ZUNvbmZpZyA9ICh7a2V5LCB2YWx1ZX0pID0+IHtcbiAgICB0aGlzLl9zZXRDb2xvclJhbmdlQ29uZmlnKHtba2V5XTogdmFsdWV9KTtcbiAgfTtcblxuICBfb25TZXRDdXN0b21QYWxldHRlID0gY29uZmlnID0+IHtcbiAgICB0aGlzLnByb3BzLnNldENvbG9yUGFsZXR0ZVVJKHtcbiAgICAgIGN1c3RvbVBhbGV0dGU6IGNvbmZpZ1xuICAgIH0pO1xuICB9O1xuXG4gIF9zZXRDb2xvclJhbmdlQ29uZmlnID0gbmV3Q29uZmlnID0+IHtcbiAgICB0aGlzLnByb3BzLnNldENvbG9yUGFsZXR0ZVVJKHtcbiAgICAgIGNvbG9yUmFuZ2VDb25maWc6IG5ld0NvbmZpZ1xuICAgIH0pO1xuICB9O1xuXG4gIF9vbkN1c3RvbVBhbGV0dGVDYW5jZWwgPSBuZXdDb25maWcgPT4ge1xuICAgIHRoaXMucHJvcHMuc2V0Q29sb3JQYWxldHRlVUkoe1xuICAgICAgc2hvd1NrZXRjaGVyOiBmYWxzZSxcbiAgICAgIGNvbG9yUmFuZ2VDb25maWc6IHtjdXN0b206IGZhbHNlfVxuICAgIH0pO1xuICB9O1xuXG4gIF9vblRvZ2dsZVNrZXRjaGVyID0gdmFsID0+IHtcbiAgICB0aGlzLnByb3BzLnNldENvbG9yUGFsZXR0ZVVJKHtcbiAgICAgIHNob3dTa2V0Y2hlcjogdmFsXG4gICAgfSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtjdXN0b21QYWxldHRlLCBzaG93U2tldGNoZXIsIGNvbG9yUmFuZ2VDb25maWd9ID0gdGhpcy5wcm9wcy5jb2xvclBhbGV0dGVVSTtcblxuICAgIGNvbnN0IGZpbHRlcmVkQ29sb3JSYW5nZXMgPSB0aGlzLmZpbHRlcmVkQ29sb3JSYW5nZSh0aGlzLnByb3BzKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkQ29sb3JSYW5nZVNlbGVjdG9yPlxuICAgICAgICA8U3R5bGVkQ29sb3JDb25maWc+XG4gICAgICAgICAgeyhjb2xvclJhbmdlQ29uZmlnLmN1c3RvbSA/IFsnY3VzdG9tJ10gOiBPYmplY3Qua2V5cyhjb2xvclJhbmdlQ29uZmlnKSkubWFwKGtleSA9PiAoXG4gICAgICAgICAgICA8UGFsZXR0ZUNvbmZpZ1xuICAgICAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICAgICAgbGFiZWw9e0NPTkZJR19TRVRUSU5HU1trZXldLmxhYmVsIHx8IGtleX1cbiAgICAgICAgICAgICAgY29uZmlnPXtDT05GSUdfU0VUVElOR1Nba2V5XX1cbiAgICAgICAgICAgICAgdmFsdWU9e2NvbG9yUmFuZ2VDb25maWdba2V5XX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3ZhbHVlID0+IHRoaXMuX3VwZGF0ZUNvbmZpZyh7a2V5LCB2YWx1ZX0pfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9TdHlsZWRDb2xvckNvbmZpZz5cblxuICAgICAgICB7Y29sb3JSYW5nZUNvbmZpZy5jdXN0b20gPyAoXG4gICAgICAgICAgPEN1c3RvbVBhbGV0dGVcbiAgICAgICAgICAgIGN1c3RvbVBhbGV0dGU9e2N1c3RvbVBhbGV0dGV9XG4gICAgICAgICAgICBzaG93U2tldGNoZXI9e3Nob3dTa2V0Y2hlcn1cbiAgICAgICAgICAgIHNlbGVjdGVkPXt0aGlzLnByb3BzLnNlbGVjdGVkQ29sb3JSYW5nZX1cbiAgICAgICAgICAgIG9uQXBwbHk9e3RoaXMucHJvcHMub25TZWxlY3RDb2xvclJhbmdlfVxuICAgICAgICAgICAgb25Ub2dnbGVTa2V0Y2hlcj17dGhpcy5fb25Ub2dnbGVTa2V0Y2hlcn1cbiAgICAgICAgICAgIHNldEN1c3RvbVBhbGV0dGU9e3RoaXMuX29uU2V0Q3VzdG9tUGFsZXR0ZX1cbiAgICAgICAgICAgIG9uQ2FuY2VsPXt0aGlzLl9vbkN1c3RvbVBhbGV0dGVDYW5jZWx9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8Q29sb3JQYWxldHRlR3JvdXBcbiAgICAgICAgICAgIGNvbG9yUmFuZ2VzPXtmaWx0ZXJlZENvbG9yUmFuZ2VzfVxuICAgICAgICAgICAgb25TZWxlY3Q9e3RoaXMucHJvcHMub25TZWxlY3RDb2xvclJhbmdlfVxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb2xvclJhbmdlfVxuICAgICAgICAgICAgcmV2ZXJzZWQ9e2NvbG9yUmFuZ2VDb25maWcucmV2ZXJzZWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIDwvU3R5bGVkQ29sb3JSYW5nZVNlbGVjdG9yPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFBhbGV0dGVDb25maWcgPSAoe2xhYmVsLCB2YWx1ZSwgY29uZmlnOiB7dHlwZSwgb3B0aW9uc30sIG9uQ2hhbmdlfSkgPT4gKFxuICA8U3R5bGVkUGFsZXR0ZUNvbmZpZyBjbGFzc05hbWU9XCJjb2xvci1wYWxldHRlX19jb25maWdcIiBvbkNsaWNrPXtlID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sb3ItcGFsZXR0ZV9fY29uZmlnX19sYWJlbFwiPlxuICAgICAgPFBhbmVsTGFiZWw+XG4gICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXtgY29sb3IuJHtsYWJlbH1gfSAvPlxuICAgICAgPC9QYW5lbExhYmVsPlxuICAgIDwvZGl2PlxuICAgIHt0eXBlID09PSAnc2VsZWN0JyAmJiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbG9yLXBhbGV0dGVfX2NvbmZpZ19fc2VsZWN0XCI+XG4gICAgICAgIDxJdGVtU2VsZWN0b3JcbiAgICAgICAgICBzZWxlY3RlZEl0ZW1zPXt2YWx1ZX1cbiAgICAgICAgICBvcHRpb25zPXtvcHRpb25zfVxuICAgICAgICAgIG11bHRpU2VsZWN0PXtmYWxzZX1cbiAgICAgICAgICBzZWFyY2hhYmxlPXtmYWxzZX1cbiAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApfVxuICAgIHt0eXBlID09PSAnc3dpdGNoJyAmJiAoXG4gICAgICA8U3dpdGNoIGNoZWNrZWQ9e3ZhbHVlfSBpZD17YCR7bGFiZWx9LXRvZ2dsZWB9IG9uQ2hhbmdlPXsoKSA9PiBvbkNoYW5nZSghdmFsdWUpfSBzZWNvbmRhcnkgLz5cbiAgICApfVxuICA8L1N0eWxlZFBhbGV0dGVDb25maWc+XG4pO1xuXG5jb25zdCBTdHlsZWRDb2xvclJhbmdlID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ2NvbG9yLXBhbGV0dGUtb3V0ZXInXG59KWBcbiAgcGFkZGluZzogMCA4cHg7XG4gIDpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmRIb3Zlcn07XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgQ29sb3JQYWxldHRlR3JvdXAgPSAoe3JldmVyc2VkLCBvblNlbGVjdCwgc2VsZWN0ZWQsIGNvbG9yUmFuZ2VzfSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cImNvbG9yLXBhbGV0dGVfX2dyb3VwXCI+XG4gICAge2NvbG9yUmFuZ2VzLm1hcCgoY29sb3JSYW5nZSwgaSkgPT4gKFxuICAgICAgPFN0eWxlZENvbG9yUmFuZ2VcbiAgICAgICAga2V5PXtgJHtjb2xvclJhbmdlLm5hbWV9LSR7aX1gfVxuICAgICAgICBvbkNsaWNrPXtlID0+IG9uU2VsZWN0KHJldmVyc2VkID8gcmV2ZXJzZUNvbG9yUmFuZ2UodHJ1ZSwgY29sb3JSYW5nZSkgOiBjb2xvclJhbmdlLCBlKX1cbiAgICAgID5cbiAgICAgICAgPENvbG9yUGFsZXR0ZVxuICAgICAgICAgIGNvbG9ycz17Y29sb3JSYW5nZS5jb2xvcnN9XG4gICAgICAgICAgaXNSZXZlcnNlZD17cmV2ZXJzZWR9XG4gICAgICAgICAgaXNTZWxlY3RlZD17Y29sb3JSYW5nZS5uYW1lID09PSBzZWxlY3RlZC5uYW1lICYmIHJldmVyc2VkID09PSBCb29sZWFuKHNlbGVjdGVkLnJldmVyc2VkKX1cbiAgICAgICAgLz5cbiAgICAgIDwvU3R5bGVkQ29sb3JSYW5nZT5cbiAgICApKX1cbiAgPC9kaXY+XG4pO1xuIl19