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

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _chickletedInput = require("../../../common/item-selector/chickleted-input");

var _icons = require("../../../common/icons");

var _dropdownList = _interopRequireDefault(require("../../../common/item-selector/dropdown-list"));

var _styledComponents2 = require("../../../common/styled-components");

var _reactIntl = require("react-intl");

var _reactOnclickoutside = _interopRequireDefault(require("react-onclickoutside"));

var _defaultSettings = require("../../../../constants/default-settings");

var _tooltip = require("../../../../constants/tooltip");

var _dataUtils = require("../../../../utils/data-utils");

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-left: -64px;\n  position: absolute;\n  top: 20px;\n  width: 140px;\n  z-index: 101;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-right: 4px;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: relative;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var TIME_DISPLAY = '2020-05-11 14:00';

var getValue = function getValue(fmt) {
  return fmt[_tooltip.TOOLTIP_KEY];
};

var addDTimeLabel = function addDTimeLabel(formats) {
  return formats.map(function (f) {
    return _objectSpread({}, f, {
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

var ChickletAddonWrapper = _styledComponents["default"].div(_templateObject());

var ChickletAddon = _styledComponents["default"].div(_templateObject2());

var StyledPopover = _styledComponents["default"].div(_templateObject3());

var hashStyles = {
  SHOW: 'SHOW',
  ACTIVE: 'ACTIVE'
};

var IconDiv = _styledComponents["default"].div(_templateObject4(), function (props) {
  return props.status === hashStyles.SHOW ? props.theme.subtextColorActive : props.status === hashStyles.ACTIVE ? props.theme.activeColor : props.theme.textColor;
});

function TooltipChickletFactory(dataId, config, onChange, fields) {
  var TooltipChicklet =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(TooltipChicklet, _Component);

    function TooltipChicklet() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, TooltipChicklet);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(TooltipChicklet)).call.apply(_getPrototypeOf2, [this].concat(args)));
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
            name = _this$props.name,
            remove = _this$props.remove;
        var show = this.state.show;
        var field = config.fieldsToShow[dataId].find(function (fieldToShow) {
          return fieldToShow.name === name;
        });
        var formatLabels = getFormatLabels(fields, field.name);
        var selectionIndex = formatLabels.findIndex(function (fl) {
          return getValue(fl) === field.format;
        });
        if (selectionIndex < 0) selectionIndex = 0;
        var hashStyle = show ? hashStyles.SHOW : selectionIndex ? hashStyles.ACTIVE : null;
        return _react["default"].createElement(_chickletedInput.ChickletButton, {
          ref: function ref(node) {
            return _this2.node = node;
          }
        }, _react["default"].createElement(_chickletedInput.ChickletTag, null, name), formatLabels.length > 1 && _react["default"].createElement(ChickletAddonWrapper, null, _react["default"].createElement(ChickletAddon, {
          "data-tip": true,
          "data-for": "addon-".concat(name)
        }, _react["default"].createElement(IconDiv, {
          status: hashStyle
        }, _react["default"].createElement(_icons.Hash, {
          height: "8px",
          onClick: function onClick(e) {
            e.stopPropagation();

            _this2.setState({
              show: Boolean(!show)
            });
          }
        })), _react["default"].createElement(_styledComponents2.Tooltip, {
          id: "addon-".concat(name),
          effect: "solid"
        }, _react["default"].createElement("span", null, (selectionIndex && formatLabels[selectionIndex]).label || _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'fieldSelector.formatting'
        })))), show && _react["default"].createElement(StyledPopover, null, _react["default"].createElement(_dropdownList["default"], {
          options: formatLabels,
          selectionIndex: selectionIndex,
          displayOption: function displayOption(item) {
            return item.label;
          },
          onOptionSelected: function onOptionSelected(result, e) {
            e.stopPropagation();

            _this2.setState({
              show: false
            });

            var oldFieldsToShow = config.fieldsToShow[dataId];
            var fieldsToShow = oldFieldsToShow.map(function (fieldToShow) {
              return fieldToShow.name === name ? {
                name: name,
                format: getValue(result)
              } : fieldToShow;
            });

            var newConfig = _objectSpread({}, config, {
              fieldsToShow: _objectSpread({}, config.fieldsToShow, (0, _defineProperty2["default"])({}, dataId, fieldsToShow))
            });

            onChange(newConfig);
          }
        }))), _react["default"].createElement(_icons.Delete, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwvdG9vbHRpcC1jb25maWcvdG9vbHRpcC1jaGlja2xldC5qcyJdLCJuYW1lcyI6WyJUSU1FX0RJU1BMQVkiLCJnZXRWYWx1ZSIsImZtdCIsIlRPT0xUSVBfS0VZIiwiYWRkRFRpbWVMYWJlbCIsImZvcm1hdHMiLCJtYXAiLCJmIiwibGFiZWwiLCJ0eXBlIiwiVE9PTFRJUF9GT1JNQVRfVFlQRVMiLCJEQVRFX1RJTUUiLCJEQVRFIiwiZ2V0Rm9ybWF0TGFiZWxzIiwiZmllbGRzIiwiZmllbGROYW1lIiwiZmllbGRUeXBlIiwiZmluZCIsIm5hbWUiLCJ0b29sdGlwVHlwZXMiLCJGSUVMRF9PUFRTIiwiZm9ybWF0IiwidG9vbHRpcCIsImZvcm1hdExhYmVscyIsIk9iamVjdCIsInZhbHVlcyIsIlRPT0xUSVBfRk9STUFUUyIsImZpbHRlciIsInQiLCJpbmNsdWRlcyIsIkNoaWNrbGV0QWRkb25XcmFwcGVyIiwic3R5bGVkIiwiZGl2IiwiQ2hpY2tsZXRBZGRvbiIsIlN0eWxlZFBvcG92ZXIiLCJoYXNoU3R5bGVzIiwiU0hPVyIsIkFDVElWRSIsIkljb25EaXYiLCJwcm9wcyIsInN0YXR1cyIsInRoZW1lIiwic3VidGV4dENvbG9yQWN0aXZlIiwiYWN0aXZlQ29sb3IiLCJ0ZXh0Q29sb3IiLCJUb29sdGlwQ2hpY2tsZXRGYWN0b3J5IiwiZGF0YUlkIiwiY29uZmlnIiwib25DaGFuZ2UiLCJUb29sdGlwQ2hpY2tsZXQiLCJzaG93IiwiZSIsIm5vZGUiLCJjb250YWlucyIsInRhcmdldCIsInNldFN0YXRlIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiaGFuZGxlQ2xpY2tPdXRzaWRlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRpc2FibGVkIiwicmVtb3ZlIiwic3RhdGUiLCJmaWVsZCIsImZpZWxkc1RvU2hvdyIsImZpZWxkVG9TaG93Iiwic2VsZWN0aW9uSW5kZXgiLCJmaW5kSW5kZXgiLCJmbCIsImhhc2hTdHlsZSIsImxlbmd0aCIsInN0b3BQcm9wYWdhdGlvbiIsIkJvb2xlYW4iLCJpdGVtIiwicmVzdWx0Iiwib2xkRmllbGRzVG9TaG93IiwibmV3Q29uZmlnIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZLEdBQUcsa0JBQXJCOztBQUNBLElBQU1DLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQUFDLEdBQUc7QUFBQSxTQUFJQSxHQUFHLENBQUNDLG9CQUFELENBQVA7QUFBQSxDQUFwQjs7QUFFQSxJQUFNQyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQUFDLE9BQU87QUFBQSxTQUMzQkEsT0FBTyxDQUFDQyxHQUFSLENBQVksVUFBQUMsQ0FBQztBQUFBLDZCQUNSQSxDQURRO0FBRVhDLE1BQUFBLEtBQUssRUFDSEQsQ0FBQyxDQUFDRSxJQUFGLEtBQVdDLDhCQUFxQkMsU0FBaEMsSUFBNkNKLENBQUMsQ0FBQ0UsSUFBRixLQUFXQyw4QkFBcUJFLElBQTdFLEdBQ0ksNkJBQWFYLFFBQVEsQ0FBQ00sQ0FBRCxDQUFyQixFQUEwQlAsWUFBMUIsQ0FESixHQUVJTyxDQUFDLENBQUNDO0FBTEc7QUFBQSxHQUFiLENBRDJCO0FBQUEsQ0FBN0I7O0FBU0EsU0FBU0ssZUFBVCxDQUF5QkMsTUFBekIsRUFBaUNDLFNBQWpDLEVBQTRDO0FBQzFDLE1BQU1DLFNBQVMsR0FBR0YsTUFBTSxDQUFDRyxJQUFQLENBQVksVUFBQVYsQ0FBQztBQUFBLFdBQUlBLENBQUMsQ0FBQ1csSUFBRixLQUFXSCxTQUFmO0FBQUEsR0FBYixFQUF1Q04sSUFBekQ7QUFDQSxNQUFNVSxZQUFZLEdBQUlI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Z0JBRGtDOztBQTZGaEUsU0FBTyxxQ0FBZTVCLGVBQWYsQ0FBUDtBQUNEOztlQUVjSixzQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0NoaWNrbGV0QnV0dG9uLCBDaGlja2xldFRhZ30gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaXRlbS1zZWxlY3Rvci9jaGlja2xldGVkLWlucHV0JztcbmltcG9ydCB7SGFzaCwgRGVsZXRlfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQgRHJvcGRvd25MaXN0IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2l0ZW0tc2VsZWN0b3IvZHJvcGRvd24tbGlzdCc7XG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5pbXBvcnQgb25DbGlja091dHNpZGUgZnJvbSAncmVhY3Qtb25jbGlja291dHNpZGUnO1xuaW1wb3J0IHtGSUVMRF9PUFRTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge1RPT0xUSVBfRk9STUFUUywgVE9PTFRJUF9GT1JNQVRfVFlQRVMsIFRPT0xUSVBfS0VZfSBmcm9tICdjb25zdGFudHMvdG9vbHRpcCc7XG5pbXBvcnQge2dldEZvcm1hdHRlcn0gZnJvbSAndXRpbHMvZGF0YS11dGlscyc7XG5cbmNvbnN0IFRJTUVfRElTUExBWSA9ICcyMDIwLTA1LTExIDE0OjAwJztcbmNvbnN0IGdldFZhbHVlID0gZm10ID0+IGZtdFtUT09MVElQX0tFWV07XG5cbmNvbnN0IGFkZERUaW1lTGFiZWwgPSBmb3JtYXRzID0+XG4gIGZvcm1hdHMubWFwKGYgPT4gKHtcbiAgICAuLi5mLFxuICAgIGxhYmVsOlxuICAgICAgZi50eXBlID09PSBUT09MVElQX0ZPUk1BVF9UWVBFUy5EQVRFX1RJTUUgfHwgZi50eXBlID09PSBUT09MVElQX0ZPUk1BVF9UWVBFUy5EQVRFXG4gICAgICAgID8gZ2V0Rm9ybWF0dGVyKGdldFZhbHVlKGYpKShUSU1FX0RJU1BMQVkpXG4gICAgICAgIDogZi5sYWJlbFxuICB9KSk7XG5cbmZ1bmN0aW9uIGdldEZvcm1hdExhYmVscyhmaWVsZHMsIGZpZWxkTmFtZSkge1xuICBjb25zdCBmaWVsZFR5cGUgPSBmaWVsZHMuZmluZChmID0+IGYubmFtZSA9PT0gZmllbGROYW1lKS50eXBlO1xuICBjb25zdCB0b29sdGlwVHlwZXMgPSAoZmllbGRUeXBlICYmIEZJRUxEX09QVFNbZmllbGRUeXBlXS5mb3JtYXQudG9vbHRpcCkgfHwgW107XG4gIGNvbnN0IGZvcm1hdExhYmVscyA9IE9iamVjdC52YWx1ZXMoVE9PTFRJUF9GT1JNQVRTKS5maWx0ZXIodCA9PiB0b29sdGlwVHlwZXMuaW5jbHVkZXModC50eXBlKSk7XG5cbiAgcmV0dXJuIGFkZERUaW1lTGFiZWwoZm9ybWF0TGFiZWxzKTtcbn1cblxuY29uc3QgQ2hpY2tsZXRBZGRvbldyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5gO1xuXG5jb25zdCBDaGlja2xldEFkZG9uID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLXJpZ2h0OiA0cHg7XG5gO1xuXG5jb25zdCBTdHlsZWRQb3BvdmVyID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLWxlZnQ6IC02NHB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMjBweDtcbiAgd2lkdGg6IDE0MHB4O1xuICB6LWluZGV4OiAxMDE7XG5gO1xuXG5jb25zdCBoYXNoU3R5bGVzID0ge1xuICBTSE9XOiAnU0hPVycsXG4gIEFDVElWRTogJ0FDVElWRSdcbn07XG5cbmNvbnN0IEljb25EaXYgPSBzdHlsZWQuZGl2YFxuICBjb2xvcjogJHtwcm9wcyA9PlxuICAgIHByb3BzLnN0YXR1cyA9PT0gaGFzaFN0eWxlcy5TSE9XXG4gICAgICA/IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvckFjdGl2ZVxuICAgICAgOiBwcm9wcy5zdGF0dXMgPT09IGhhc2hTdHlsZXMuQUNUSVZFXG4gICAgICA/IHByb3BzLnRoZW1lLmFjdGl2ZUNvbG9yXG4gICAgICA6IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG5gO1xuZnVuY3Rpb24gVG9vbHRpcENoaWNrbGV0RmFjdG9yeShkYXRhSWQsIGNvbmZpZywgb25DaGFuZ2UsIGZpZWxkcykge1xuICBjbGFzcyBUb29sdGlwQ2hpY2tsZXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRlID0ge1xuICAgICAgc2hvdzogZmFsc2VcbiAgICB9O1xuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZUNsaWNrT3V0c2lkZSwgZmFsc2UpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5oYW5kbGVDbGlja091dHNpZGUsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBoYW5kbGVDbGlja091dHNpZGUgPSBlID0+IHtcbiAgICAgIGlmICh0aGlzLm5vZGUuY29udGFpbnMoZS50YXJnZXQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe3Nob3c6IGZhbHNlfSk7XG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtkaXNhYmxlZCwgbmFtZSwgcmVtb3ZlfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCB7c2hvd30gPSB0aGlzLnN0YXRlO1xuICAgICAgY29uc3QgZmllbGQgPSBjb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF0uZmluZChmaWVsZFRvU2hvdyA9PiBmaWVsZFRvU2hvdy5uYW1lID09PSBuYW1lKTtcbiAgICAgIGNvbnN0IGZvcm1hdExhYmVscyA9IGdldEZvcm1hdExhYmVscyhmaWVsZHMsIGZpZWxkLm5hbWUpO1xuICAgICAgbGV0IHNlbGVjdGlvbkluZGV4ID0gZm9ybWF0TGFiZWxzLmZpbmRJbmRleChmbCA9PiBnZXRWYWx1ZShmbCkgPT09IGZpZWxkLmZvcm1hdCk7XG4gICAgICBpZiAoc2VsZWN0aW9uSW5kZXggPCAwKSBzZWxlY3Rpb25JbmRleCA9IDA7XG4gICAgICBjb25zdCBoYXNoU3R5bGUgPSBzaG93ID8gaGFzaFN0eWxlcy5TSE9XIDogc2VsZWN0aW9uSW5kZXggPyBoYXNoU3R5bGVzLkFDVElWRSA6IG51bGw7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDaGlja2xldEJ1dHRvbiByZWY9e25vZGUgPT4gKHRoaXMubm9kZSA9IG5vZGUpfT5cbiAgICAgICAgICA8Q2hpY2tsZXRUYWc+e25hbWV9PC9DaGlja2xldFRhZz5cbiAgICAgICAgICB7Zm9ybWF0TGFiZWxzLmxlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgICAgPENoaWNrbGV0QWRkb25XcmFwcGVyPlxuICAgICAgICAgICAgICA8Q2hpY2tsZXRBZGRvbiBkYXRhLXRpcCBkYXRhLWZvcj17YGFkZG9uLSR7bmFtZX1gfT5cbiAgICAgICAgICAgICAgICA8SWNvbkRpdiBzdGF0dXM9e2hhc2hTdHlsZX0+XG4gICAgICAgICAgICAgICAgICA8SGFzaFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9XCI4cHhcIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Nob3c6IEJvb2xlYW4oIXNob3cpfSk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvSWNvbkRpdj5cbiAgICAgICAgICAgICAgICA8VG9vbHRpcCBpZD17YGFkZG9uLSR7bmFtZX1gfSBlZmZlY3Q9XCJzb2xpZFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgIHsoc2VsZWN0aW9uSW5kZXggJiYgZm9ybWF0TGFiZWxzW3NlbGVjdGlvbkluZGV4XSkubGFiZWwgfHwgKFxuICAgICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnZmllbGRTZWxlY3Rvci5mb3JtYXR0aW5nJ30gLz5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICAgICAgIDwvQ2hpY2tsZXRBZGRvbj5cbiAgICAgICAgICAgICAge3Nob3cgJiYgKFxuICAgICAgICAgICAgICAgIDxTdHlsZWRQb3BvdmVyPlxuICAgICAgICAgICAgICAgICAgPERyb3Bkb3duTGlzdFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zPXtmb3JtYXRMYWJlbHN9XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkluZGV4PXtzZWxlY3Rpb25JbmRleH1cbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU9wdGlvbj17aXRlbSA9PiBpdGVtLmxhYmVsfVxuICAgICAgICAgICAgICAgICAgICBvbk9wdGlvblNlbGVjdGVkPXsocmVzdWx0LCBlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGRGaWVsZHNUb1Nob3cgPSBjb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF07XG4gICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGRzVG9TaG93ID0gb2xkRmllbGRzVG9TaG93Lm1hcChmaWVsZFRvU2hvdyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmllbGRUb1Nob3cubmFtZSA9PT0gbmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IGdldFZhbHVlKHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogZmllbGRUb1Nob3c7XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3Q29uZmlnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzVG9TaG93OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZy5maWVsZHNUb1Nob3csXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtkYXRhSWRdOiBmaWVsZHNUb1Nob3dcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlKG5ld0NvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvU3R5bGVkUG9wb3Zlcj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvQ2hpY2tsZXRBZGRvbldyYXBwZXI+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8RGVsZXRlIG9uQ2xpY2s9e2Rpc2FibGVkID8gbnVsbCA6IHJlbW92ZX0gLz5cbiAgICAgICAgPC9DaGlja2xldEJ1dHRvbj5cbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvbkNsaWNrT3V0c2lkZShUb29sdGlwQ2hpY2tsZXQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBUb29sdGlwQ2hpY2tsZXRGYWN0b3J5O1xuIl19