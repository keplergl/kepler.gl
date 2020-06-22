"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColorPaletteGroup = exports.PaletteConfig = exports["default"] = exports.ALL_STEPS = exports.ALL_TYPES = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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

var _reactIntl = require("react-intl");

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 0 8px;\n  :hover {\n    background-color: ", ";\n    cursor: pointer;\n  }\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 8px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  .color-palette__config__label {\n    flex-grow: 1;\n  }\n  .color-palette__config__select {\n    flex-grow: 1;\n  }\n  .item-selector .item-selector__dropdown {\n    ", ";\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  padding-bottom: 12px;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 12px 12px 0 12px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

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

var StyledColorConfig = _styledComponents["default"].div(_templateObject());

var StyledColorRangeSelector = _styledComponents["default"].div.attrs({
  className: 'color-range-selector'
})(_templateObject2());

var StyledPaletteConfig = _styledComponents["default"].div(_templateObject3(), function (props) {
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

var ColorRangeSelect =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ColorRangeSelect, _Component);

  function ColorRangeSelect() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, ColorRangeSelect);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(ColorRangeSelect)).call.apply(_getPrototypeOf2, [this].concat(args)));
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
      return _react["default"].createElement(StyledColorRangeSelector, null, _react["default"].createElement(StyledColorConfig, null, (colorRangeConfig.custom ? ['custom'] : Object.keys(colorRangeConfig)).map(function (key) {
        return _react["default"].createElement(PaletteConfig, {
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
      })), colorRangeConfig.custom ? _react["default"].createElement(_customPalette["default"], {
        customPalette: customPalette,
        showSketcher: showSketcher,
        selected: this.props.selectedColorRange,
        onApply: this.props.onSelectColorRange,
        onToggleSketcher: this._onToggleSketcher,
        setCustomPalette: this._onSetCustomPalette,
        onCancel: this._onCustomPaletteCancel
      }) : _react["default"].createElement(ColorPaletteGroup, {
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
  return _react["default"].createElement(StyledPaletteConfig, {
    className: "color-palette__config",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, _react["default"].createElement("div", {
    className: "color-palette__config__label"
  }, _react["default"].createElement(_styledComponents2.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: "color.".concat(label)
  }))), type === 'select' && _react["default"].createElement("div", {
    className: "color-palette__config__select"
  }, _react["default"].createElement(_itemSelector["default"], {
    selectedItems: value,
    options: options,
    multiSelect: false,
    searchable: false,
    onChange: _onChange
  })), type === 'switch' && _react["default"].createElement(_switch["default"], {
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
})(_templateObject4(), function (props) {
  return props.theme.panelBackgroundHover;
});

var ColorPaletteGroup = function ColorPaletteGroup(_ref3) {
  var reversed = _ref3.reversed,
      onSelect = _ref3.onSelect,
      selected = _ref3.selected,
      colorRanges = _ref3.colorRanges;
  return _react["default"].createElement("div", {
    className: "color-palette__group"
  }, colorRanges.map(function (colorRange, i) {
    return _react["default"].createElement(StyledColorRange, {
      key: "".concat(colorRange.name, "-").concat(i),
      onClick: function onClick(e) {
        return onSelect(reversed ? (0, _colorUtils.reverseColorRange)(true, colorRange) : colorRange, e);
      }
    }, _react["default"].createElement(_colorPalette["default"], {
      colors: colorRange.colors,
      isReversed: reversed,
      isSelected: colorRange.name === selected.name && reversed === Boolean(selected.reversed)
    }));
  }));
};

exports.ColorPaletteGroup = ColorPaletteGroup;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvY29sb3ItcmFuZ2Utc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiQUxMX1RZUEVTIiwiQ09MT1JfUkFOR0VTIiwibWFwIiwiYyIsInR5cGUiLCJmaWx0ZXIiLCJjdHlwZSIsImNvbmNhdCIsIkFMTF9TVEVQUyIsImQiLCJjb2xvcnMiLCJsZW5ndGgiLCJzb3J0IiwibnVtYmVyU29ydCIsIlN0eWxlZENvbG9yQ29uZmlnIiwic3R5bGVkIiwiZGl2IiwiU3R5bGVkQ29sb3JSYW5nZVNlbGVjdG9yIiwiYXR0cnMiLCJjbGFzc05hbWUiLCJTdHlsZWRQYWxldHRlQ29uZmlnIiwicHJvcHMiLCJ0aGVtZSIsInNlY29uZGFyeUlucHV0IiwiQ09ORklHX1NFVFRJTkdTIiwib3B0aW9ucyIsInN0ZXBzIiwicmV2ZXJzZWQiLCJjdXN0b20iLCJsYWJlbCIsIkNvbG9yUmFuZ2VTZWxlY3QiLCJjb2xvclJhbmdlcyIsImNvbG9yUGFsZXR0ZVVJIiwiY29sb3JSYW5nZUNvbmZpZyIsImNvbG9yUmFuZ2VzU2VsZWN0b3IiLCJjb25maWdUeXBlU2VsZWN0b3IiLCJjb25maWdTdGVwU2VsZWN0b3IiLCJjb2xvclJhbmdlIiwiaXNUeXBlIiwiaXNTdGVwIiwiTnVtYmVyIiwia2V5IiwidmFsdWUiLCJfc2V0Q29sb3JSYW5nZUNvbmZpZyIsImNvbmZpZyIsInNldENvbG9yUGFsZXR0ZVVJIiwiY3VzdG9tUGFsZXR0ZSIsIm5ld0NvbmZpZyIsInNob3dTa2V0Y2hlciIsInZhbCIsImZpbHRlcmVkQ29sb3JSYW5nZXMiLCJmaWx0ZXJlZENvbG9yUmFuZ2UiLCJPYmplY3QiLCJrZXlzIiwiX3VwZGF0ZUNvbmZpZyIsInNlbGVjdGVkQ29sb3JSYW5nZSIsIm9uU2VsZWN0Q29sb3JSYW5nZSIsIl9vblRvZ2dsZVNrZXRjaGVyIiwiX29uU2V0Q3VzdG9tUGFsZXR0ZSIsIl9vbkN1c3RvbVBhbGV0dGVDYW5jZWwiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZnVuYyIsImFycmF5T2YiLCJhbnkiLCJQYWxldHRlQ29uZmlnIiwib25DaGFuZ2UiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwiU3R5bGVkQ29sb3JSYW5nZSIsInBhbmVsQmFja2dyb3VuZEhvdmVyIiwiQ29sb3JQYWxldHRlR3JvdXAiLCJvblNlbGVjdCIsInNlbGVjdGVkIiwiaSIsIm5hbWUiLCJCb29sZWFuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLElBQU1BLFNBQVMsR0FBRyx3QkFDdkJDLDBCQUFhQyxHQUFiLENBQWlCLFVBQUFDLENBQUM7QUFBQSxTQUFJQSxDQUFDLENBQUNDLElBQU47QUFBQSxDQUFsQixFQUNHQyxNQURILENBQ1UsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUo7QUFBQSxDQURmLEVBRUdDLE1BRkgsQ0FFVSxDQUFDLEtBQUQsRUFBUSxRQUFSLENBRlYsQ0FEdUIsQ0FBbEI7O0FBTUEsSUFBTUMsU0FBUyxHQUFHLHdCQUFLUCwwQkFBYUMsR0FBYixDQUFpQixVQUFBTyxDQUFDO0FBQUEsU0FBSUEsQ0FBQyxDQUFDQyxNQUFGLENBQVNDLE1BQWI7QUFBQSxDQUFsQixDQUFMLEVBQTZDQyxJQUE3QyxDQUFrREMscUJBQWxELENBQWxCOzs7QUFFUCxJQUFNQyxpQkFBaUIsR0FBR0MsNkJBQU9DLEdBQVYsbUJBQXZCOztBQUlBLElBQU1DLHdCQUF3QixHQUFHRiw2QkFBT0MsR0FBUCxDQUFXRSxLQUFYLENBQWlCO0FBQ2hEQyxFQUFBQSxTQUFTLEVBQUU7QUFEcUMsQ0FBakIsQ0FBSCxvQkFBOUI7O0FBTUEsSUFBTUMs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QSxpQkFBb0I7QUFBQSxNQUFFOUMsUUFBRixTQUFFQSxRQUFGO0FBQUEsTUFBWStDLFFBQVosU0FBWUEsUUFBWjtBQUFBLE1BQXNCQyxRQUF0QixTQUFzQkEsUUFBdEI7QUFBQSxNQUFnQzVDLFdBQWhDLFNBQWdDQSxXQUFoQztBQUFBLFNBQy9CO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNHQSxXQUFXLENBQUM3QixHQUFaLENBQWdCLFVBQUNtQyxVQUFELEVBQWF1QyxDQUFiO0FBQUEsV0FDZixnQ0FBQyxnQkFBRDtBQUNFLE1BQUEsR0FBRyxZQUFLdkMsVUFBVSxDQUFDd0MsSUFBaEIsY0FBd0JELENBQXhCLENBREw7QUFFRSxNQUFBLE9BQU8sRUFBRSxpQkFBQVAsQ0FBQztBQUFBLGVBQUlLLFFBQVEsQ0FBQy9DLFFBQVEsR0FBRyxtQ0FBa0IsSUFBbEIsRUFBd0JVLFVBQXhCLENBQUgsR0FBeUNBLFVBQWxELEVBQThEZ0MsQ0FBOUQsQ0FBWjtBQUFBO0FBRlosT0FJRSxnQ0FBQyx3QkFBRDtBQUNFLE1BQUEsTUFBTSxFQUFFaEMsVUFBVSxDQUFDM0IsTUFEckI7QUFFRSxNQUFBLFVBQVUsRUFBRWlCLFFBRmQ7QUFHRSxNQUFBLFVBQVUsRUFBRVUsVUFBVSxDQUFDd0MsSUFBWCxLQUFvQkYsUUFBUSxDQUFDRSxJQUE3QixJQUFxQ2xELFFBQVEsS0FBS21ELE9BQU8sQ0FBQ0gsUUFBUSxDQUFDaEQsUUFBVjtBQUh2RSxNQUpGLENBRGU7QUFBQSxHQUFoQixDQURILENBRCtCO0FBQUEsQ0FBMUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgdW5pcSBmcm9tICdsb2Rhc2gudW5pcSc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcblxuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuaW1wb3J0IHtQYW5lbExhYmVsfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgU3dpdGNoIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N3aXRjaCc7XG5pbXBvcnQgQ29sb3JQYWxldHRlIGZyb20gJy4vY29sb3ItcGFsZXR0ZSc7XG5pbXBvcnQgQ3VzdG9tUGFsZXR0ZSBmcm9tICcuL2N1c3RvbS1wYWxldHRlJztcbmltcG9ydCB7Q09MT1JfUkFOR0VTfSBmcm9tICdjb25zdGFudHMvY29sb3ItcmFuZ2VzJztcbmltcG9ydCB7bnVtYmVyU29ydH0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5pbXBvcnQge3JldmVyc2VDb2xvclJhbmdlfSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ3JlYWN0LWludGwnO1xuXG5leHBvcnQgY29uc3QgQUxMX1RZUEVTID0gdW5pcShcbiAgQ09MT1JfUkFOR0VTLm1hcChjID0+IGMudHlwZSlcbiAgICAuZmlsdGVyKGN0eXBlID0+IGN0eXBlKVxuICAgIC5jb25jYXQoWydhbGwnLCAnY3VzdG9tJ10pXG4pO1xuXG5leHBvcnQgY29uc3QgQUxMX1NURVBTID0gdW5pcShDT0xPUl9SQU5HRVMubWFwKGQgPT4gZC5jb2xvcnMubGVuZ3RoKSkuc29ydChudW1iZXJTb3J0KTtcblxuY29uc3QgU3R5bGVkQ29sb3JDb25maWcgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nOiAxMnB4IDEycHggMCAxMnB4O1xuYDtcblxuY29uc3QgU3R5bGVkQ29sb3JSYW5nZVNlbGVjdG9yID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ2NvbG9yLXJhbmdlLXNlbGVjdG9yJ1xufSlgXG4gIHBhZGRpbmctYm90dG9tOiAxMnB4O1xuYDtcblxuY29uc3QgU3R5bGVkUGFsZXR0ZUNvbmZpZyA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi1ib3R0b206IDhweDtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAuY29sb3ItcGFsZXR0ZV9fY29uZmlnX19sYWJlbCB7XG4gICAgZmxleC1ncm93OiAxO1xuICB9XG4gIC5jb2xvci1wYWxldHRlX19jb25maWdfX3NlbGVjdCB7XG4gICAgZmxleC1ncm93OiAxO1xuICB9XG4gIC5pdGVtLXNlbGVjdG9yIC5pdGVtLXNlbGVjdG9yX19kcm9wZG93biB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dH07XG4gIH1cbmA7XG5cbmNvbnN0IENPTkZJR19TRVRUSU5HUyA9IHtcbiAgdHlwZToge1xuICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgIG9wdGlvbnM6IEFMTF9UWVBFU1xuICB9LFxuICBzdGVwczoge1xuICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgIG9wdGlvbnM6IEFMTF9TVEVQU1xuICB9LFxuICByZXZlcnNlZDoge1xuICAgIHR5cGU6ICdzd2l0Y2gnLFxuICAgIG9wdGlvbnM6IFt0cnVlLCBmYWxzZV1cbiAgfSxcbiAgY3VzdG9tOiB7XG4gICAgbGFiZWw6ICdjdXN0b21QYWxldHRlJyxcbiAgICB0eXBlOiAnc3dpdGNoJyxcbiAgICBvcHRpb25zOiBbdHJ1ZSwgZmFsc2VdXG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbG9yUmFuZ2VTZWxlY3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNvbG9yUGFsZXR0ZVVJOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0ZWRDb2xvclJhbmdlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgb25TZWxlY3RDb2xvclJhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNldENvbG9yUGFsZXR0ZVVJOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIC8vIG9wdGlvbmFsXG4gICAgY29sb3JSYW5nZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjb2xvclJhbmdlczogQ09MT1JfUkFOR0VTLFxuICAgIG9uU2VsZWN0Q29sb3JSYW5nZTogKCkgPT4ge30sXG4gICAgc2V0Q29sb3JQYWxldHRlVUk6ICgpID0+IHt9XG4gIH07XG5cbiAgY29sb3JSYW5nZXNTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmNvbG9yUmFuZ2VzO1xuICBjb25maWdUeXBlU2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5jb2xvclBhbGV0dGVVSS5jb2xvclJhbmdlQ29uZmlnLnR5cGU7XG4gIGNvbmZpZ1N0ZXBTZWxlY3RvciA9IHByb3BzID0+IHByb3BzLmNvbG9yUGFsZXR0ZVVJLmNvbG9yUmFuZ2VDb25maWcuc3RlcHM7XG4gIGZpbHRlcmVkQ29sb3JSYW5nZSA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHRoaXMuY29sb3JSYW5nZXNTZWxlY3RvcixcbiAgICB0aGlzLmNvbmZpZ1R5cGVTZWxlY3RvcixcbiAgICB0aGlzLmNvbmZpZ1N0ZXBTZWxlY3RvcixcbiAgICAoY29sb3JSYW5nZXMsIHR5cGUsIHN0ZXBzKSA9PiB7XG4gICAgICByZXR1cm4gY29sb3JSYW5nZXMuZmlsdGVyKGNvbG9yUmFuZ2UgPT4ge1xuICAgICAgICBjb25zdCBpc1R5cGUgPSB0eXBlID09PSAnYWxsJyB8fCB0eXBlID09PSBjb2xvclJhbmdlLnR5cGU7XG4gICAgICAgIGNvbnN0IGlzU3RlcCA9IE51bWJlcihzdGVwcykgPT09IGNvbG9yUmFuZ2UuY29sb3JzLmxlbmd0aDtcblxuICAgICAgICByZXR1cm4gaXNUeXBlICYmIGlzU3RlcDtcbiAgICAgIH0pO1xuICAgIH1cbiAgKTtcblxuICBfdXBkYXRlQ29uZmlnID0gKHtrZXksIHZhbHVlfSkgPT4ge1xuICAgIHRoaXMuX3NldENvbG9yUmFuZ2VDb25maWcoe1trZXldOiB2YWx1ZX0pO1xuICB9O1xuXG4gIF9vblNldEN1c3RvbVBhbGV0dGUgPSBjb25maWcgPT4ge1xuICAgIHRoaXMucHJvcHMuc2V0Q29sb3JQYWxldHRlVUkoe1xuICAgICAgY3VzdG9tUGFsZXR0ZTogY29uZmlnXG4gICAgfSk7XG4gIH07XG5cbiAgX3NldENvbG9yUmFuZ2VDb25maWcgPSBuZXdDb25maWcgPT4ge1xuICAgIHRoaXMucHJvcHMuc2V0Q29sb3JQYWxldHRlVUkoe1xuICAgICAgY29sb3JSYW5nZUNvbmZpZzogbmV3Q29uZmlnXG4gICAgfSk7XG4gIH07XG5cbiAgX29uQ3VzdG9tUGFsZXR0ZUNhbmNlbCA9IG5ld0NvbmZpZyA9PiB7XG4gICAgdGhpcy5wcm9wcy5zZXRDb2xvclBhbGV0dGVVSSh7XG4gICAgICBzaG93U2tldGNoZXI6IGZhbHNlLFxuICAgICAgY29sb3JSYW5nZUNvbmZpZzoge2N1c3RvbTogZmFsc2V9XG4gICAgfSk7XG4gIH07XG5cbiAgX29uVG9nZ2xlU2tldGNoZXIgPSB2YWwgPT4ge1xuICAgIHRoaXMucHJvcHMuc2V0Q29sb3JQYWxldHRlVUkoe1xuICAgICAgc2hvd1NrZXRjaGVyOiB2YWxcbiAgICB9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2N1c3RvbVBhbGV0dGUsIHNob3dTa2V0Y2hlciwgY29sb3JSYW5nZUNvbmZpZ30gPSB0aGlzLnByb3BzLmNvbG9yUGFsZXR0ZVVJO1xuXG4gICAgY29uc3QgZmlsdGVyZWRDb2xvclJhbmdlcyA9IHRoaXMuZmlsdGVyZWRDb2xvclJhbmdlKHRoaXMucHJvcHMpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRDb2xvclJhbmdlU2VsZWN0b3I+XG4gICAgICAgIDxTdHlsZWRDb2xvckNvbmZpZz5cbiAgICAgICAgICB7KGNvbG9yUmFuZ2VDb25maWcuY3VzdG9tID8gWydjdXN0b20nXSA6IE9iamVjdC5rZXlzKGNvbG9yUmFuZ2VDb25maWcpKS5tYXAoa2V5ID0+IChcbiAgICAgICAgICAgIDxQYWxldHRlQ29uZmlnXG4gICAgICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgICAgICBsYWJlbD17Q09ORklHX1NFVFRJTkdTW2tleV0ubGFiZWwgfHwga2V5fVxuICAgICAgICAgICAgICBjb25maWc9e0NPTkZJR19TRVRUSU5HU1trZXldfVxuICAgICAgICAgICAgICB2YWx1ZT17Y29sb3JSYW5nZUNvbmZpZ1trZXldfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17dmFsdWUgPT4gdGhpcy5fdXBkYXRlQ29uZmlnKHtrZXksIHZhbHVlfSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L1N0eWxlZENvbG9yQ29uZmlnPlxuXG4gICAgICAgIHtjb2xvclJhbmdlQ29uZmlnLmN1c3RvbSA/IChcbiAgICAgICAgICA8Q3VzdG9tUGFsZXR0ZVxuICAgICAgICAgICAgY3VzdG9tUGFsZXR0ZT17Y3VzdG9tUGFsZXR0ZX1cbiAgICAgICAgICAgIHNob3dTa2V0Y2hlcj17c2hvd1NrZXRjaGVyfVxuICAgICAgICAgICAgc2VsZWN0ZWQ9e3RoaXMucHJvcHMuc2VsZWN0ZWRDb2xvclJhbmdlfVxuICAgICAgICAgICAgb25BcHBseT17dGhpcy5wcm9wcy5vblNlbGVjdENvbG9yUmFuZ2V9XG4gICAgICAgICAgICBvblRvZ2dsZVNrZXRjaGVyPXt0aGlzLl9vblRvZ2dsZVNrZXRjaGVyfVxuICAgICAgICAgICAgc2V0Q3VzdG9tUGFsZXR0ZT17dGhpcy5fb25TZXRDdXN0b21QYWxldHRlfVxuICAgICAgICAgICAgb25DYW5jZWw9e3RoaXMuX29uQ3VzdG9tUGFsZXR0ZUNhbmNlbH1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxDb2xvclBhbGV0dGVHcm91cFxuICAgICAgICAgICAgY29sb3JSYW5nZXM9e2ZpbHRlcmVkQ29sb3JSYW5nZXN9XG4gICAgICAgICAgICBvblNlbGVjdD17dGhpcy5wcm9wcy5vblNlbGVjdENvbG9yUmFuZ2V9XG4gICAgICAgICAgICBzZWxlY3RlZD17dGhpcy5wcm9wcy5zZWxlY3RlZENvbG9yUmFuZ2V9XG4gICAgICAgICAgICByZXZlcnNlZD17Y29sb3JSYW5nZUNvbmZpZy5yZXZlcnNlZH1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9TdHlsZWRDb2xvclJhbmdlU2VsZWN0b3I+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgUGFsZXR0ZUNvbmZpZyA9ICh7bGFiZWwsIHZhbHVlLCBjb25maWc6IHt0eXBlLCBvcHRpb25zfSwgb25DaGFuZ2V9KSA9PiAoXG4gIDxTdHlsZWRQYWxldHRlQ29uZmlnIGNsYXNzTmFtZT1cImNvbG9yLXBhbGV0dGVfX2NvbmZpZ1wiIG9uQ2xpY2s9e2UgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX0+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb2xvci1wYWxldHRlX19jb25maWdfX2xhYmVsXCI+XG4gICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9e2Bjb2xvci4ke2xhYmVsfWB9IC8+XG4gICAgICA8L1BhbmVsTGFiZWw+XG4gICAgPC9kaXY+XG4gICAge3R5cGUgPT09ICdzZWxlY3QnICYmIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sb3ItcGFsZXR0ZV9fY29uZmlnX19zZWxlY3RcIj5cbiAgICAgICAgPEl0ZW1TZWxlY3RvclxuICAgICAgICAgIHNlbGVjdGVkSXRlbXM9e3ZhbHVlfVxuICAgICAgICAgIG9wdGlvbnM9e29wdGlvbnN9XG4gICAgICAgICAgbXVsdGlTZWxlY3Q9e2ZhbHNlfVxuICAgICAgICAgIHNlYXJjaGFibGU9e2ZhbHNlfVxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICl9XG4gICAge3R5cGUgPT09ICdzd2l0Y2gnICYmIChcbiAgICAgIDxTd2l0Y2ggY2hlY2tlZD17dmFsdWV9IGlkPXtgJHtsYWJlbH0tdG9nZ2xlYH0gb25DaGFuZ2U9eygpID0+IG9uQ2hhbmdlKCF2YWx1ZSl9IHNlY29uZGFyeSAvPlxuICAgICl9XG4gIDwvU3R5bGVkUGFsZXR0ZUNvbmZpZz5cbik7XG5cbmNvbnN0IFN0eWxlZENvbG9yUmFuZ2UgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnY29sb3ItcGFsZXR0ZS1vdXRlcidcbn0pYFxuICBwYWRkaW5nOiAwIDhweDtcbiAgOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZEhvdmVyfTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBDb2xvclBhbGV0dGVHcm91cCA9ICh7cmV2ZXJzZWQsIG9uU2VsZWN0LCBzZWxlY3RlZCwgY29sb3JSYW5nZXN9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiY29sb3ItcGFsZXR0ZV9fZ3JvdXBcIj5cbiAgICB7Y29sb3JSYW5nZXMubWFwKChjb2xvclJhbmdlLCBpKSA9PiAoXG4gICAgICA8U3R5bGVkQ29sb3JSYW5nZVxuICAgICAgICBrZXk9e2Ake2NvbG9yUmFuZ2UubmFtZX0tJHtpfWB9XG4gICAgICAgIG9uQ2xpY2s9e2UgPT4gb25TZWxlY3QocmV2ZXJzZWQgPyByZXZlcnNlQ29sb3JSYW5nZSh0cnVlLCBjb2xvclJhbmdlKSA6IGNvbG9yUmFuZ2UsIGUpfVxuICAgICAgPlxuICAgICAgICA8Q29sb3JQYWxldHRlXG4gICAgICAgICAgY29sb3JzPXtjb2xvclJhbmdlLmNvbG9yc31cbiAgICAgICAgICBpc1JldmVyc2VkPXtyZXZlcnNlZH1cbiAgICAgICAgICBpc1NlbGVjdGVkPXtjb2xvclJhbmdlLm5hbWUgPT09IHNlbGVjdGVkLm5hbWUgJiYgcmV2ZXJzZWQgPT09IEJvb2xlYW4oc2VsZWN0ZWQucmV2ZXJzZWQpfVxuICAgICAgICAvPlxuICAgICAgPC9TdHlsZWRDb2xvclJhbmdlPlxuICAgICkpfVxuICA8L2Rpdj5cbik7XG4iXX0=