"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _chickletedInput = require("../../../common/item-selector/chickleted-input");

var _icons = require("../../../common/icons");

var _dropdownList = _interopRequireDefault(require("../../../common/item-selector/dropdown-list"));

var _styledComponents2 = require("../../../common/styled-components");

var _localization = require("../../../../localization");

var _reactOnclickoutside = _interopRequireDefault(require("react-onclickoutside"));

var _defaultSettings = require("../../../../constants/default-settings");

var _tooltip = require("../../../../constants/tooltip");

var _dataUtils = require("../../../../utils/data-utils");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var TIME_DISPLAY = '2020-05-11 14:00';

var getValue = function getValue(fmt) {
  return fmt[_tooltip.TOOLTIP_KEY];
};

var addDTimeLabel = function addDTimeLabel(formats) {
  return formats.map(function (f) {
    return _objectSpread(_objectSpread({}, f), {}, {
      label: f.type === _tooltip.TOOLTIP_FORMAT_TYPES.DATE_TIME || f.type === _tooltip.TOOLTIP_FORMAT_TYPES.DATE ? (0, _dataUtils.getFormatter)(getValue(f))(TIME_DISPLAY) : f.label
    });
  });
};

function getFormatLabels(fields, fieldName) {
  var fieldType = fields.find(function (f) {
    return f.name === fieldName;
  }).type;
  var tooltipTypes = fieldType && _defaultSettings.FIELD_OPTS[fieldType].format.tooltip || [];
  var formatLabels = Object.values(_tooltip.TOOLTIP_FORMATS).filter(function (t) {
    return tooltipTypes.includes(t.type);
  });
  return addDTimeLabel(formatLabels);
}

var ChickletAddonWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  position: relative;\n"])));

var ChickletAddon = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-right: 4px;\n"])));

var StyledPopover = _styledComponents["default"].div(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-left: -64px;\n  position: absolute;\n  top: 20px;\n  width: 140px;\n  z-index: 101;\n"])));

var hashStyles = {
  SHOW: 'SHOW',
  ACTIVE: 'ACTIVE'
};

var IconDiv = _styledComponents["default"].div.attrs({
  className: 'tooltip-chicklet__icon'
})(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n"])), function (props) {
  return props.status === hashStyles.SHOW ? props.theme.subtextColorActive : props.status === hashStyles.ACTIVE ? props.theme.activeColor : props.theme.textColor;
});

function getFormatTooltip(formatLabels, format) {
  if (!format) {
    return null;
  }

  var formatLabel = formatLabels.find(function (fl) {
    return getValue(fl) === format;
  });

  if (formatLabel) {
    return formatLabel.label;
  }

  return (0, _typeof2["default"])(format) === 'object' ? JSON.stringify(format, null, 2) : String(format);
}

function TooltipChickletFactory(dataId, config, onChange, fields) {
  var TooltipChicklet = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(TooltipChicklet, _Component);

    var _super = _createSuper(TooltipChicklet);

    function TooltipChicklet() {
      var _this;

      (0, _classCallCheck2["default"])(this, TooltipChicklet);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        show: false
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleClickOutside", function (e) {
        if (_this.node.contains(e.target)) {
          return;
        }

        _this.setState({
          show: false
        });
      });
      return _this;
    }

    (0, _createClass2["default"])(TooltipChicklet, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside, false);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside, false);
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
            disabled = _this$props.disabled,
            item = _this$props.item,
            displayOption = _this$props.displayOption,
            remove = _this$props.remove;
        var show = this.state.show;
        var tooltipField = config.fieldsToShow[dataId].find(function (fieldToShow) {
          return fieldToShow.name === item.name;
        });

        if (!tooltipField) {
          return null;
        }

        var formatLabels = getFormatLabels(fields, tooltipField.name);
        var hasFormat = Boolean(tooltipField.format);
        var selectionIndex = formatLabels.findIndex(function (fl) {
          return getValue(fl) === tooltipField.format;
        });
        var hashStyle = show ? hashStyles.SHOW : hasFormat ? hashStyles.ACTIVE : null;
        return /*#__PURE__*/_react["default"].createElement(_chickletedInput.ChickletButton, {
          ref: function ref(node) {
            return _this2.node = node;
          }
        }, /*#__PURE__*/_react["default"].createElement(_chickletedInput.ChickletTag, null, displayOption(item)), formatLabels.length > 1 && /*#__PURE__*/_react["default"].createElement(ChickletAddonWrapper, null, /*#__PURE__*/_react["default"].createElement(ChickletAddon, {
          "data-tip": true,
          "data-for": "addon-".concat(tooltipField.name)
        }, /*#__PURE__*/_react["default"].createElement(IconDiv, {
          status: hashStyle
        }, /*#__PURE__*/_react["default"].createElement(_icons.Hash, {
          height: "8px",
          onClick: function onClick(e) {
            e.stopPropagation();

            _this2.setState({
              show: Boolean(!show)
            });
          }
        })), /*#__PURE__*/_react["default"].createElement(_styledComponents2.Tooltip, {
          id: "addon-".concat(tooltipField.name),
          effect: "solid"
        }, /*#__PURE__*/_react["default"].createElement("span", null, hasFormat ? getFormatTooltip(formatLabels, tooltipField.format) : /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'fieldSelector.formatting'
        })))), show && /*#__PURE__*/_react["default"].createElement(StyledPopover, null, /*#__PURE__*/_react["default"].createElement(_dropdownList["default"], {
          options: formatLabels,
          selectionIndex: selectionIndex,
          displayOption: function displayOption(_ref) {
            var label = _ref.label;
            return label;
          },
          onOptionSelected: function onOptionSelected(result, e) {
            e.stopPropagation();

            _this2.setState({
              show: false
            });

            var oldFieldsToShow = config.fieldsToShow[dataId];
            var fieldsToShow = oldFieldsToShow.map(function (fieldToShow) {
              return fieldToShow.name === tooltipField.name ? {
                name: tooltipField.name,
                format: getValue(result)
              } : fieldToShow;
            });

            var newConfig = _objectSpread(_objectSpread({}, config), {}, {
              fieldsToShow: _objectSpread(_objectSpread({}, config.fieldsToShow), {}, (0, _defineProperty2["default"])({}, dataId, fieldsToShow))
            });

            onChange(newConfig);
          }
        }))), /*#__PURE__*/_react["default"].createElement(_icons.Delete, {
          onClick: disabled ? null : remove
        }));
      }
    }]);
    return TooltipChicklet;
  }(_react.Component);

  return (0, _reactOnclickoutside["default"])(TooltipChicklet);
}

var _default = TooltipChickletFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwvdG9vbHRpcC1jb25maWcvdG9vbHRpcC1jaGlja2xldC5qcyJdLCJuYW1lcyI6WyJUSU1FX0RJU1BMQVkiLCJnZXRWYWx1ZSIsImZtdCIsIlRPT0xUSVBfS0VZIiwiYWRkRFRpbWVMYWJlbCIsImZvcm1hdHMiLCJtYXAiLCJmIiwibGFiZWwiLCJ0eXBlIiwiVE9PTFRJUF9GT1JNQVRfVFlQRVMiLCJEQVRFX1RJTUUiLCJEQVRFIiwiZ2V0Rm9ybWF0TGFiZWxzIiwiZmllbGRzIiwiZmllbGROYW1lIiwiZmllbGRUeXBlIiwiZmluZCIsIm5hbWUiLCJ0b29sdGlwVHlwZXMiLCJGSUVMRF9PUFRTIiwiZm9ybWF0IiwidG9vbHRpcCIsImZvcm1hdExhYmVscyIsIk9iamVjdCIsInZhbHVlcyIsIlRPT0xUSVBfRk9STUFUUyIsImZpbHRlciIsInQiLCJpbmNsdWRlcyIsIkNoaWNrbGV0QWRkb25XcmFwcGVyIiwic3R5bGVkIiwiZGl2IiwiQ2hpY2tsZXRBZGRvbiIsIlN0eWxlZFBvcG92ZXIiLCJoYXNoU3R5bGVzIiwiU0hPVyIsIkFDVElWRSIsIkljb25EaXYiLCJhdHRycyIsImNsYXNzTmFtZSIsInByb3BzIiwic3RhdHVzIiwidGhlbWUiLCJzdWJ0ZXh0Q29sb3JBY3RpdmUiLCJhY3RpdmVDb2xvciIsInRleHRDb2xvciIsImdldEZvcm1hdFRvb2x0aXAiLCJmb3JtYXRMYWJlbCIsImZsIiwiSlNPTiIsInN0cmluZ2lmeSIsIlN0cmluZyIsIlRvb2x0aXBDaGlja2xldEZhY3RvcnkiLCJkYXRhSWQiLCJjb25maWciLCJvbkNoYW5nZSIsIlRvb2x0aXBDaGlja2xldCIsInNob3ciLCJlIiwibm9kZSIsImNvbnRhaW5zIiwidGFyZ2V0Iiwic2V0U3RhdGUiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYW5kbGVDbGlja091dHNpZGUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzYWJsZWQiLCJpdGVtIiwiZGlzcGxheU9wdGlvbiIsInJlbW92ZSIsInN0YXRlIiwidG9vbHRpcEZpZWxkIiwiZmllbGRzVG9TaG93IiwiZmllbGRUb1Nob3ciLCJoYXNGb3JtYXQiLCJCb29sZWFuIiwic2VsZWN0aW9uSW5kZXgiLCJmaW5kSW5kZXgiLCJoYXNoU3R5bGUiLCJsZW5ndGgiLCJzdG9wUHJvcGFnYXRpb24iLCJyZXN1bHQiLCJvbGRGaWVsZHNUb1Nob3ciLCJuZXdDb25maWciLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZLEdBQUcsa0JBQXJCOztBQUNBLElBQU1DLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQUFDLEdBQUc7QUFBQSxTQUFJQSxHQUFHLENBQUNDLG9CQUFELENBQVA7QUFBQSxDQUFwQjs7QUFFQSxJQUFNQyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQUFDLE9BQU87QUFBQSxTQUMzQkEsT0FBTyxDQUFDQyxHQUFSLENBQVksVUFBQUMsQ0FBQztBQUFBLDJDQUNSQSxDQURRO0FBRVhDLE1BQUFBLEtBQUssRUFDSEQsQ0FBQyxDQUFDRSxJQUFGLEtBQVdDLDhCQUFxQkMsU0FBaEMsSUFBNkNKLENBQUMsQ0FBQ0UsSUFBRixLQUFXQyw4QkFBcUJFLElBQTdFLEdBQ0ksNkJBQWFYLFFBQVEsQ0FBQ00sQ0FBRCxDQUFyQixFQUEwQlAsWUFBMUIsQ0FESixHQUVJTyxDQUFDLENBQUNDO0FBTEc7QUFBQSxHQUFiLENBRDJCO0FBQUEsQ0FBN0I7O0FBU0EsU0FBU0ssZUFBVCxDQUF5QkMsTUFBekIsRUFBaUNDLFNBQWpDLEVBQTRDO0FBQzFDLE1BQU1DLFNBQVMsR0FBR0YsTUFBTSxDQUFDRyxJQUFQLENBQVksVUFBQVYsQ0FB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QUFhQSxLQUFiO0FBQUEsV0FIakI7QUFJRSxVQUFBLGdCQUFnQixFQUFFLDBCQUFDMkUsTUFBRCxFQUFTeEIsQ0FBVCxFQUFlO0FBQy9CQSxZQUFBQSxDQUFDLENBQUN1QixlQUFGOztBQUNBLFlBQUEsTUFBSSxDQUFDbkIsUUFBTCxDQUFjO0FBQ1pMLGNBQUFBLElBQUksRUFBRTtBQURNLGFBQWQ7O0FBSUEsZ0JBQU0wQixlQUFlLEdBQUc3QixNQUFNLENBQUNtQixZQUFQLENBQW9CcEIsTUFBcEIsQ0FBeEI7QUFDQSxnQkFBTW9CLFlBQVksR0FBR1UsZUFBZSxDQUFDOUUsR0FBaEIsQ0FBb0IsVUFBQXFFLFdBQVcsRUFBSTtBQUN0RCxxQkFBT0EsV0FBVyxDQUFDekQsSUFBWixLQUFxQnVELFlBQVksQ0FBQ3ZELElBQWxDLEdBQ0g7QUFDRUEsZ0JBQUFBLElBQUksRUFBRXVELFlBQVksQ0FBQ3ZELElBRHJCO0FBRUVHLGdCQUFBQSxNQUFNLEVBQUVwQixRQUFRLENBQUNrRixNQUFEO0FBRmxCLGVBREcsR0FLSFIsV0FMSjtBQU1ELGFBUG9CLENBQXJCOztBQVFBLGdCQUFNVSxTQUFTLG1DQUNWOUIsTUFEVTtBQUVibUIsY0FBQUEsWUFBWSxrQ0FDUG5CLE1BQU0sQ0FBQ21CLFlBREEsNENBRVRwQixNQUZTLEVBRUFvQixZQUZBO0FBRkMsY0FBZjs7QUFPQWxCLFlBQUFBLFFBQVEsQ0FBQzZCLFNBQUQsQ0FBUjtBQUNEO0FBM0JILFVBREYsQ0F0QkosQ0FISixlQTJERSxnQ0FBQyxhQUFEO0FBQVEsVUFBQSxPQUFPLEVBQUVqQixRQUFRLEdBQUcsSUFBSCxHQUFVRztBQUFuQyxVQTNERixDQURGO0FBK0REO0FBbEc2RDtBQUFBO0FBQUEsSUFDbENlLGdCQURrQzs7QUFvR2hFLFNBQU8scUNBQWU3QixlQUFmLENBQVA7QUFDRDs7ZUFFY0osc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtDaGlja2xldEJ1dHRvbiwgQ2hpY2tsZXRUYWd9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2l0ZW0tc2VsZWN0b3IvY2hpY2tsZXRlZC1pbnB1dCc7XG5pbXBvcnQge0hhc2gsIERlbGV0ZX0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IERyb3Bkb3duTGlzdCBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2Ryb3Bkb3duLWxpc3QnO1xuaW1wb3J0IHtUb29sdGlwfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ2xvY2FsaXphdGlvbic7XG5pbXBvcnQgb25DbGlja091dHNpZGUgZnJvbSAncmVhY3Qtb25jbGlja291dHNpZGUnO1xuaW1wb3J0IHtGSUVMRF9PUFRTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge1RPT0xUSVBfRk9STUFUUywgVE9PTFRJUF9GT1JNQVRfVFlQRVMsIFRPT0xUSVBfS0VZfSBmcm9tICdjb25zdGFudHMvdG9vbHRpcCc7XG5pbXBvcnQge2dldEZvcm1hdHRlcn0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmNvbnN0IFRJTUVfRElTUExBWSA9ICcyMDIwLTA1LTExIDE0OjAwJztcbmNvbnN0IGdldFZhbHVlID0gZm10ID0+IGZtdFtUT09MVElQX0tFWV07XG5cbmNvbnN0IGFkZERUaW1lTGFiZWwgPSBmb3JtYXRzID0+XG4gIGZvcm1hdHMubWFwKGYgPT4gKHtcbiAgICAuLi5mLFxuICAgIGxhYmVsOlxuICAgICAgZi50eXBlID09PSBUT09MVElQX0ZPUk1BVF9UWVBFUy5EQVRFX1RJTUUgfHwgZi50eXBlID09PSBUT09MVElQX0ZPUk1BVF9UWVBFUy5EQVRFXG4gICAgICAgID8gZ2V0Rm9ybWF0dGVyKGdldFZhbHVlKGYpKShUSU1FX0RJU1BMQVkpXG4gICAgICAgIDogZi5sYWJlbFxuICB9KSk7XG5cbmZ1bmN0aW9uIGdldEZvcm1hdExhYmVscyhmaWVsZHMsIGZpZWxkTmFtZSkge1xuICBjb25zdCBmaWVsZFR5cGUgPSBmaWVsZHMuZmluZChmID0+IGYubmFtZSA9PT0gZmllbGROYW1lKS50eXBlO1xuICBjb25zdCB0b29sdGlwVHlwZXMgPSAoZmllbGRUeXBlICYmIEZJRUxEX09QVFNbZmllbGRUeXBlXS5mb3JtYXQudG9vbHRpcCkgfHwgW107XG4gIGNvbnN0IGZvcm1hdExhYmVscyA9IE9iamVjdC52YWx1ZXMoVE9PTFRJUF9GT1JNQVRTKS5maWx0ZXIodCA9PiB0b29sdGlwVHlwZXMuaW5jbHVkZXModC50eXBlKSk7XG5cbiAgcmV0dXJuIGFkZERUaW1lTGFiZWwoZm9ybWF0TGFiZWxzKTtcbn1cblxuY29uc3QgQ2hpY2tsZXRBZGRvbldyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5gO1xuXG5jb25zdCBDaGlja2xldEFkZG9uID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLXJpZ2h0OiA0cHg7XG5gO1xuXG5jb25zdCBTdHlsZWRQb3BvdmVyID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLWxlZnQ6IC02NHB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMjBweDtcbiAgd2lkdGg6IDE0MHB4O1xuICB6LWluZGV4OiAxMDE7XG5gO1xuXG5jb25zdCBoYXNoU3R5bGVzID0ge1xuICBTSE9XOiAnU0hPVycsXG4gIEFDVElWRTogJ0FDVElWRSdcbn07XG5cbmNvbnN0IEljb25EaXYgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAndG9vbHRpcC1jaGlja2xldF9faWNvbidcbn0pYFxuICBjb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLnN0YXR1cyA9PT0gaGFzaFN0eWxlcy5TSE9XXG4gICAgICA/IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvckFjdGl2ZVxuICAgICAgOiBwcm9wcy5zdGF0dXMgPT09IGhhc2hTdHlsZXMuQUNUSVZFXG4gICAgICA/IHByb3BzLnRoZW1lLmFjdGl2ZUNvbG9yXG4gICAgICA6IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG5gO1xuXG5mdW5jdGlvbiBnZXRGb3JtYXRUb29sdGlwKGZvcm1hdExhYmVscywgZm9ybWF0KSB7XG4gIGlmICghZm9ybWF0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgZm9ybWF0TGFiZWwgPSBmb3JtYXRMYWJlbHMuZmluZChmbCA9PiBnZXRWYWx1ZShmbCkgPT09IGZvcm1hdCk7XG4gIGlmIChmb3JtYXRMYWJlbCkge1xuICAgIHJldHVybiBmb3JtYXRMYWJlbC5sYWJlbDtcbiAgfVxuICByZXR1cm4gdHlwZW9mIGZvcm1hdCA9PT0gJ29iamVjdCcgPyBKU09OLnN0cmluZ2lmeShmb3JtYXQsIG51bGwsIDIpIDogU3RyaW5nKGZvcm1hdCk7XG59XG5cbmZ1bmN0aW9uIFRvb2x0aXBDaGlja2xldEZhY3RvcnkoZGF0YUlkLCBjb25maWcsIG9uQ2hhbmdlLCBmaWVsZHMpIHtcbiAgY2xhc3MgVG9vbHRpcENoaWNrbGV0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0ZSA9IHtcbiAgICAgIHNob3c6IGZhbHNlXG4gICAgfTtcblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVDbGlja091dHNpZGUsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlQ2xpY2tPdXRzaWRlLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2tPdXRzaWRlID0gZSA9PiB7XG4gICAgICBpZiAodGhpcy5ub2RlLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHtzaG93OiBmYWxzZX0pO1xuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7ZGlzYWJsZWQsIGl0ZW0sIGRpc3BsYXlPcHRpb24sIHJlbW92ZX0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qge3Nob3d9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIGNvbnN0IHRvb2x0aXBGaWVsZCA9IGNvbmZpZy5maWVsZHNUb1Nob3dbZGF0YUlkXS5maW5kKFxuICAgICAgICBmaWVsZFRvU2hvdyA9PiBmaWVsZFRvU2hvdy5uYW1lID09PSBpdGVtLm5hbWVcbiAgICAgICk7XG4gICAgICBpZiAoIXRvb2x0aXBGaWVsZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZvcm1hdExhYmVscyA9IGdldEZvcm1hdExhYmVscyhmaWVsZHMsIHRvb2x0aXBGaWVsZC5uYW1lKTtcbiAgICAgIGNvbnN0IGhhc0Zvcm1hdCA9IEJvb2xlYW4odG9vbHRpcEZpZWxkLmZvcm1hdCk7XG4gICAgICBjb25zdCBzZWxlY3Rpb25JbmRleCA9IGZvcm1hdExhYmVscy5maW5kSW5kZXgoZmwgPT4gZ2V0VmFsdWUoZmwpID09PSB0b29sdGlwRmllbGQuZm9ybWF0KTtcbiAgICAgIGNvbnN0IGhhc2hTdHlsZSA9IHNob3cgPyBoYXNoU3R5bGVzLlNIT1cgOiBoYXNGb3JtYXQgPyBoYXNoU3R5bGVzLkFDVElWRSA6IG51bGw7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDaGlja2xldEJ1dHRvbiByZWY9e25vZGUgPT4gKHRoaXMubm9kZSA9IG5vZGUpfT5cbiAgICAgICAgICA8Q2hpY2tsZXRUYWc+e2Rpc3BsYXlPcHRpb24oaXRlbSl9PC9DaGlja2xldFRhZz5cbiAgICAgICAgICB7Zm9ybWF0TGFiZWxzLmxlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgICAgPENoaWNrbGV0QWRkb25XcmFwcGVyPlxuICAgICAgICAgICAgICA8Q2hpY2tsZXRBZGRvbiBkYXRhLXRpcCBkYXRhLWZvcj17YGFkZG9uLSR7dG9vbHRpcEZpZWxkLm5hbWV9YH0+XG4gICAgICAgICAgICAgICAgPEljb25EaXYgc3RhdHVzPXtoYXNoU3R5bGV9PlxuICAgICAgICAgICAgICAgICAgPEhhc2hcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiOHB4XCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtzaG93OiBCb29sZWFuKCFzaG93KX0pO1xuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L0ljb25EaXY+XG4gICAgICAgICAgICAgICAgPFRvb2x0aXAgaWQ9e2BhZGRvbi0ke3Rvb2x0aXBGaWVsZC5uYW1lfWB9IGVmZmVjdD1cInNvbGlkXCI+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAge2hhc0Zvcm1hdCA/IChcbiAgICAgICAgICAgICAgICAgICAgICBnZXRGb3JtYXRUb29sdGlwKGZvcm1hdExhYmVscywgdG9vbHRpcEZpZWxkLmZvcm1hdClcbiAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J2ZpZWxkU2VsZWN0b3IuZm9ybWF0dGluZyd9IC8+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICAgICAgICA8L0NoaWNrbGV0QWRkb24+XG4gICAgICAgICAgICAgIHtzaG93ICYmIChcbiAgICAgICAgICAgICAgICA8U3R5bGVkUG9wb3Zlcj5cbiAgICAgICAgICAgICAgICAgIDxEcm9wZG93bkxpc3RcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz17Zm9ybWF0TGFiZWxzfVxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25JbmRleD17c2VsZWN0aW9uSW5kZXh9XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlPcHRpb249eyh7bGFiZWx9KSA9PiBsYWJlbH1cbiAgICAgICAgICAgICAgICAgICAgb25PcHRpb25TZWxlY3RlZD17KHJlc3VsdCwgZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93OiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkRmllbGRzVG9TaG93ID0gY29uZmlnLmZpZWxkc1RvU2hvd1tkYXRhSWRdO1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkc1RvU2hvdyA9IG9sZEZpZWxkc1RvU2hvdy5tYXAoZmllbGRUb1Nob3cgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpZWxkVG9TaG93Lm5hbWUgPT09IHRvb2x0aXBGaWVsZC5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdG9vbHRpcEZpZWxkLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IGdldFZhbHVlKHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogZmllbGRUb1Nob3c7XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3Q29uZmlnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzVG9TaG93OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZy5maWVsZHNUb1Nob3csXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtkYXRhSWRdOiBmaWVsZHNUb1Nob3dcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlKG5ld0NvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvU3R5bGVkUG9wb3Zlcj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvQ2hpY2tsZXRBZGRvbldyYXBwZXI+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8RGVsZXRlIG9uQ2xpY2s9e2Rpc2FibGVkID8gbnVsbCA6IHJlbW92ZX0gLz5cbiAgICAgICAgPC9DaGlja2xldEJ1dHRvbj5cbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvbkNsaWNrT3V0c2lkZShUb29sdGlwQ2hpY2tsZXQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBUb29sdGlwQ2hpY2tsZXRGYWN0b3J5O1xuIl19