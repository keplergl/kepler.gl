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

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _switch = _interopRequireDefault(require("../../common/switch"));

var _brushConfig = _interopRequireDefault(require("./brush-config"));

var _tooltipConfig = _interopRequireDefault(require("./tooltip-config"));

var _styledComponents2 = require("../../common/styled-components");

var _localization = require("../../../localization");

var _templateObject;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var StyledInteractionPanel = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  padding-bottom: 6px;\n"])));

InteractionPanelFactory.deps = [_tooltipConfig["default"], _brushConfig["default"]];

function InteractionPanelFactory(TooltipConfig, BrushConfig) {
  var _class, _temp;

  return _temp = _class = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(InteractionPanel, _Component);

    var _super = _createSuper(InteractionPanel);

    function InteractionPanel() {
      var _this;

      (0, _classCallCheck2["default"])(this, InteractionPanel);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        isConfigActive: false
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_updateConfig", function (newProp) {
        _this.props.onConfigChange(_objectSpread(_objectSpread({}, _this.props.config), newProp));
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_enableConfig", function () {
        _this.setState({
          isConfigActive: !_this.state.isConfigActive
        });
      });
      return _this;
    }

    (0, _createClass2["default"])(InteractionPanel, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
            config = _this$props.config,
            datasets = _this$props.datasets;

        var onChange = function onChange(newConfig) {
          return _this2._updateConfig({
            config: newConfig
          });
        };

        var template = null;

        switch (config.id) {
          case 'tooltip':
            template = /*#__PURE__*/_react["default"].createElement(TooltipConfig, {
              datasets: datasets,
              config: config.config,
              onChange: onChange
            });
            break;

          case 'brush':
            template = /*#__PURE__*/_react["default"].createElement(BrushConfig, {
              config: config.config,
              onChange: onChange
            });
            break;

          default:
            break;
        }

        return /*#__PURE__*/_react["default"].createElement(StyledInteractionPanel, {
          className: "interaction-panel"
        }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.StyledPanelHeader, {
          className: "interaction-panel__header",
          onClick: this._enableConfig
        }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.PanelHeaderContent, {
          className: "interaction-panel__header__content"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "interaction-panel__header__icon icon"
        }, /*#__PURE__*/_react["default"].createElement(config.iconComponent, {
          height: "16px"
        })), /*#__PURE__*/_react["default"].createElement("div", {
          className: "interaction-panel__header__title"
        }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.PanelHeaderTitle, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: config.label
        })))), /*#__PURE__*/_react["default"].createElement("div", {
          className: "interaction-panel__header__actions"
        }, /*#__PURE__*/_react["default"].createElement(_switch["default"], {
          checked: config.enabled,
          id: "".concat(config.id, "-toggle"),
          onChange: function onChange() {
            return _this2._updateConfig({
              enabled: !config.enabled
            });
          },
          secondary: true
        }))), config.enabled && template && /*#__PURE__*/_react["default"].createElement(_styledComponents2.PanelContent, {
          className: "interaction-panel__content"
        }, template));
      }
    }]);
    return InteractionPanel;
  }(_react.Component), (0, _defineProperty2["default"])(_class, "propTypes", {
    datasets: _propTypes["default"].object.isRequired,
    config: _propTypes["default"].object.isRequired,
    onConfigChange: _propTypes["default"].func.isRequired
  }), _temp;
}

var _default = InteractionPanelFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwuanMiXSwibmFtZXMiOlsiU3R5bGVkSW50ZXJhY3Rpb25QYW5lbCIsInN0eWxlZCIsImRpdiIsIkludGVyYWN0aW9uUGFuZWxGYWN0b3J5IiwiZGVwcyIsIlRvb2x0aXBDb25maWdGYWN0b3J5IiwiQnJ1c2hDb25maWdGYWN0b3J5IiwiVG9vbHRpcENvbmZpZyIsIkJydXNoQ29uZmlnIiwiaXNDb25maWdBY3RpdmUiLCJuZXdQcm9wIiwicHJvcHMiLCJvbkNvbmZpZ0NoYW5nZSIsImNvbmZpZyIsInNldFN0YXRlIiwic3RhdGUiLCJkYXRhc2V0cyIsIm9uQ2hhbmdlIiwibmV3Q29uZmlnIiwiX3VwZGF0ZUNvbmZpZyIsInRlbXBsYXRlIiwiaWQiLCJfZW5hYmxlQ29uZmlnIiwibGFiZWwiLCJlbmFibGVkIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFFQTs7QUFNQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsc0JBQXNCLEdBQUdDLDZCQUFPQyxHQUFWLGdIQUE1Qjs7QUFJQUMsdUJBQXVCLENBQUNDLElBQXhCLEdBQStCLENBQUNDLHlCQUFELEVBQXVCQyx1QkFBdkIsQ0FBL0I7O0FBRUEsU0FBU0gsdUJBQVQsQ0FBaUNJLGFBQWpDLEVBQWdEQyxXQUFoRCxFQUE2RDtBQUFBOztBQUMzRDtBQUFBOztBQUFBOztBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsZ0dBT1U7QUFBQ0MsUUFBQUEsY0FBYyxFQUFFO0FBQWpCLE9BUFY7QUFBQSx3R0FTa0IsVUFBQUMsT0FBTyxFQUFJO0FBQ3pCLGNBQUtDLEtBQUws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VWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBTd2l0Y2ggZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3dpdGNoJztcblxuaW1wb3J0IEJydXNoQ29uZmlnRmFjdG9yeSBmcm9tICcuL2JydXNoLWNvbmZpZyc7XG5pbXBvcnQgVG9vbHRpcENvbmZpZ0ZhY3RvcnkgZnJvbSAnLi90b29sdGlwLWNvbmZpZyc7XG5cbmltcG9ydCB7XG4gIFN0eWxlZFBhbmVsSGVhZGVyLFxuICBQYW5lbEhlYWRlclRpdGxlLFxuICBQYW5lbEhlYWRlckNvbnRlbnQsXG4gIFBhbmVsQ29udGVudFxufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ2xvY2FsaXphdGlvbic7XG5cbmNvbnN0IFN0eWxlZEludGVyYWN0aW9uUGFuZWwgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nLWJvdHRvbTogNnB4O1xuYDtcblxuSW50ZXJhY3Rpb25QYW5lbEZhY3RvcnkuZGVwcyA9IFtUb29sdGlwQ29uZmlnRmFjdG9yeSwgQnJ1c2hDb25maWdGYWN0b3J5XTtcblxuZnVuY3Rpb24gSW50ZXJhY3Rpb25QYW5lbEZhY3RvcnkoVG9vbHRpcENvbmZpZywgQnJ1c2hDb25maWcpIHtcbiAgcmV0dXJuIGNsYXNzIEludGVyYWN0aW9uUGFuZWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBkYXRhc2V0czogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBvbkNvbmZpZ0NoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICAgIH07XG5cbiAgICBzdGF0ZSA9IHtpc0NvbmZpZ0FjdGl2ZTogZmFsc2V9O1xuXG4gICAgX3VwZGF0ZUNvbmZpZyA9IG5ld1Byb3AgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5vbkNvbmZpZ0NoYW5nZSh7XG4gICAgICAgIC4uLnRoaXMucHJvcHMuY29uZmlnLFxuICAgICAgICAuLi5uZXdQcm9wXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgX2VuYWJsZUNvbmZpZyA9ICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2lzQ29uZmlnQWN0aXZlOiAhdGhpcy5zdGF0ZS5pc0NvbmZpZ0FjdGl2ZX0pO1xuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7Y29uZmlnLCBkYXRhc2V0c30gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSBuZXdDb25maWcgPT4gdGhpcy5fdXBkYXRlQ29uZmlnKHtjb25maWc6IG5ld0NvbmZpZ30pO1xuICAgICAgbGV0IHRlbXBsYXRlID0gbnVsbDtcblxuICAgICAgc3dpdGNoIChjb25maWcuaWQpIHtcbiAgICAgICAgY2FzZSAndG9vbHRpcCc6XG4gICAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgICA8VG9vbHRpcENvbmZpZyBkYXRhc2V0cz17ZGF0YXNldHN9IGNvbmZpZz17Y29uZmlnLmNvbmZpZ30gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPlxuICAgICAgICAgICk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnYnJ1c2gnOlxuICAgICAgICAgIHRlbXBsYXRlID0gPEJydXNoQ29uZmlnIGNvbmZpZz17Y29uZmlnLmNvbmZpZ30gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPjtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkSW50ZXJhY3Rpb25QYW5lbCBjbGFzc05hbWU9XCJpbnRlcmFjdGlvbi1wYW5lbFwiPlxuICAgICAgICAgIDxTdHlsZWRQYW5lbEhlYWRlciBjbGFzc05hbWU9XCJpbnRlcmFjdGlvbi1wYW5lbF9faGVhZGVyXCIgb25DbGljaz17dGhpcy5fZW5hYmxlQ29uZmlnfT5cbiAgICAgICAgICAgIDxQYW5lbEhlYWRlckNvbnRlbnQgY2xhc3NOYW1lPVwiaW50ZXJhY3Rpb24tcGFuZWxfX2hlYWRlcl9fY29udGVudFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImludGVyYWN0aW9uLXBhbmVsX19oZWFkZXJfX2ljb24gaWNvblwiPlxuICAgICAgICAgICAgICAgIDxjb25maWcuaWNvbkNvbXBvbmVudCBoZWlnaHQ9XCIxNnB4XCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW50ZXJhY3Rpb24tcGFuZWxfX2hlYWRlcl9fdGl0bGVcIj5cbiAgICAgICAgICAgICAgICA8UGFuZWxIZWFkZXJUaXRsZT5cbiAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXtjb25maWcubGFiZWx9IC8+XG4gICAgICAgICAgICAgICAgPC9QYW5lbEhlYWRlclRpdGxlPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvUGFuZWxIZWFkZXJDb250ZW50PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnRlcmFjdGlvbi1wYW5lbF9faGVhZGVyX19hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgICAgICBjaGVja2VkPXtjb25maWcuZW5hYmxlZH1cbiAgICAgICAgICAgICAgICBpZD17YCR7Y29uZmlnLmlkfS10b2dnbGVgfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiB0aGlzLl91cGRhdGVDb25maWcoe2VuYWJsZWQ6ICFjb25maWcuZW5hYmxlZH0pfVxuICAgICAgICAgICAgICAgIHNlY29uZGFyeVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9TdHlsZWRQYW5lbEhlYWRlcj5cbiAgICAgICAgICB7Y29uZmlnLmVuYWJsZWQgJiYgdGVtcGxhdGUgJiYgKFxuICAgICAgICAgICAgPFBhbmVsQ29udGVudCBjbGFzc05hbWU9XCJpbnRlcmFjdGlvbi1wYW5lbF9fY29udGVudFwiPnt0ZW1wbGF0ZX08L1BhbmVsQ29udGVudD5cbiAgICAgICAgICApfVxuICAgICAgICA8L1N0eWxlZEludGVyYWN0aW9uUGFuZWw+XG4gICAgICApO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgSW50ZXJhY3Rpb25QYW5lbEZhY3Rvcnk7XG4iXX0=