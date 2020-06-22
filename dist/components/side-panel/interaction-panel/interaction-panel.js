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

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _switch = _interopRequireDefault(require("../../common/switch"));

var _brushConfig = _interopRequireDefault(require("./brush-config"));

var _tooltipConfig = _interopRequireDefault(require("./tooltip-config"));

var _styledComponents2 = require("../../common/styled-components");

var _reactIntl = require("react-intl");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  padding-bottom: 6px;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  border-top: 1px solid ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledPanelContent = (0, _styledComponents["default"])(_styledComponents2.PanelContent)(_templateObject(), function (props) {
  return props.theme.panelBorderColor;
});

var StyledInteractionPanel = _styledComponents["default"].div(_templateObject2());

InteractionPanelFactory.deps = [_tooltipConfig["default"], _brushConfig["default"]];

function InteractionPanelFactory(TooltipConfig, BrushConfig) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(InteractionPanel, _Component);

    function InteractionPanel() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, InteractionPanel);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(InteractionPanel)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        isConfigActive: false
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_updateConfig", function (newProp) {
        _this.props.onConfigChange(_objectSpread({}, _this.props.config, {}, newProp));
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
            template = _react["default"].createElement(TooltipConfig, {
              datasets: datasets,
              config: config.config,
              onChange: onChange
            });
            break;

          case 'brush':
            template = _react["default"].createElement(BrushConfig, {
              config: config.config,
              onChange: onChange
            });
            break;

          default:
            break;
        }

        return _react["default"].createElement(StyledInteractionPanel, {
          className: "interaction-panel"
        }, _react["default"].createElement(_styledComponents2.StyledPanelHeader, {
          className: "interaction-panel__header",
          onClick: this._enableConfig
        }, _react["default"].createElement(_styledComponents2.PanelHeaderContent, {
          className: "interaction-panel__header__content"
        }, _react["default"].createElement("div", {
          className: "interaction-panel__header__icon icon"
        }, _react["default"].createElement(config.iconComponent, {
          height: "12px"
        })), _react["default"].createElement("div", {
          className: "interaction-panel__header__title"
        }, _react["default"].createElement(_styledComponents2.PanelHeaderTitle, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: config.label
        })))), _react["default"].createElement("div", {
          className: "interaction-panel__header__actions"
        }, _react["default"].createElement(_switch["default"], {
          checked: config.enabled,
          id: "".concat(config.id, "-toggle"),
          onChange: function onChange() {
            return _this2._updateConfig({
              enabled: !config.enabled
            });
          },
          secondary: true
        }))), config.enabled && template && _react["default"].createElement(StyledPanelContent, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwvaW50ZXJhY3Rpb24tcGFuZWwuanMiXSwibmFtZXMiOlsiU3R5bGVkUGFuZWxDb250ZW50IiwiUGFuZWxDb250ZW50IiwicHJvcHMiLCJ0aGVtZSIsInBhbmVsQm9yZGVyQ29sb3IiLCJTdHlsZWRJbnRlcmFjdGlvblBhbmVsIiwic3R5bGVkIiwiZGl2IiwiSW50ZXJhY3Rpb25QYW5lbEZhY3RvcnkiLCJkZXBzIiwiVG9vbHRpcENvbmZpZ0ZhY3RvcnkiLCJCcnVzaENvbmZpZ0ZhY3RvcnkiLCJUb29sdGlwQ29uZmlnIiwiQnJ1c2hDb25maWciLCJpc0NvbmZpZ0FjdGl2ZSIsIm5ld1Byb3AiLCJvbkNvbmZpZ0NoYW5nZSIsImNvbmZpZyIsInNldFN0YXRlIiwic3RhdGUiLCJkYXRhc2V0cyIsIm9uQ2hhbmdlIiwibmV3Q29uZmlnIiwiX3VwZGF0ZUNvbmZpZyIsInRlbXBsYXRlIiwiaWQiLCJfZW5hYmxlQ29uZmlnIiwibGFiZWwiLCJlbmFibGVkIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFFQTs7QUFNQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsR0FBRyxrQ0FBT0MsK0JBQVAsQ0FBSCxvQkFDRSxVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLGdCQUFoQjtBQUFBLENBRFAsQ0FBeEI7O0FBSUEsSUFBTUMsc0JBQXNCLEdBQUdDLDZCQUFPQyxHQUFWLG9CQUE1Qjs7QUFJQUMsdUJBQXVCLENBQUNDLElBQXhCLEdBQStCLENBQUNDLHlCQUFELEVBQXVCQyx1QkFBdkIsQ0FBL0I7O0FBRUEsU0FB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c0JBQVVDLE1BQVYsQ0FBaUJDLFVBRFY7QUFFakJmLElBQUFBLE1BQU0sRUFBRWEsc0JBQVVDLE1BQVYsQ0FBaUJDLFVBRlI7QUFHakJoQixJQUFBQSxjQUFjLEVBQUVjLHNCQUFVRyxJQUFWLENBQWVEO0FBSGQsR0FEckI7QUF1RUQ7O2VBRWN4Qix1QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IFN3aXRjaCBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zd2l0Y2gnO1xuXG5pbXBvcnQgQnJ1c2hDb25maWdGYWN0b3J5IGZyb20gJy4vYnJ1c2gtY29uZmlnJztcbmltcG9ydCBUb29sdGlwQ29uZmlnRmFjdG9yeSBmcm9tICcuL3Rvb2x0aXAtY29uZmlnJztcblxuaW1wb3J0IHtcbiAgU3R5bGVkUGFuZWxIZWFkZXIsXG4gIFBhbmVsSGVhZGVyVGl0bGUsXG4gIFBhbmVsSGVhZGVyQ29udGVudCxcbiAgUGFuZWxDb250ZW50XG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5cbmNvbnN0IFN0eWxlZFBhbmVsQ29udGVudCA9IHN0eWxlZChQYW5lbENvbnRlbnQpYFxuICBib3JkZXItdG9wOiAxcHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJvcmRlckNvbG9yfTtcbmA7XG5cbmNvbnN0IFN0eWxlZEludGVyYWN0aW9uUGFuZWwgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nLWJvdHRvbTogNnB4O1xuYDtcblxuSW50ZXJhY3Rpb25QYW5lbEZhY3RvcnkuZGVwcyA9IFtUb29sdGlwQ29uZmlnRmFjdG9yeSwgQnJ1c2hDb25maWdGYWN0b3J5XTtcblxuZnVuY3Rpb24gSW50ZXJhY3Rpb25QYW5lbEZhY3RvcnkoVG9vbHRpcENvbmZpZywgQnJ1c2hDb25maWcpIHtcbiAgcmV0dXJuIGNsYXNzIEludGVyYWN0aW9uUGFuZWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBkYXRhc2V0czogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBvbkNvbmZpZ0NoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICAgIH07XG5cbiAgICBzdGF0ZSA9IHtpc0NvbmZpZ0FjdGl2ZTogZmFsc2V9O1xuXG4gICAgX3VwZGF0ZUNvbmZpZyA9IG5ld1Byb3AgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5vbkNvbmZpZ0NoYW5nZSh7XG4gICAgICAgIC4uLnRoaXMucHJvcHMuY29uZmlnLFxuICAgICAgICAuLi5uZXdQcm9wXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgX2VuYWJsZUNvbmZpZyA9ICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2lzQ29uZmlnQWN0aXZlOiAhdGhpcy5zdGF0ZS5pc0NvbmZpZ0FjdGl2ZX0pO1xuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7Y29uZmlnLCBkYXRhc2V0c30gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSBuZXdDb25maWcgPT4gdGhpcy5fdXBkYXRlQ29uZmlnKHtjb25maWc6IG5ld0NvbmZpZ30pO1xuICAgICAgbGV0IHRlbXBsYXRlID0gbnVsbDtcblxuICAgICAgc3dpdGNoIChjb25maWcuaWQpIHtcbiAgICAgICAgY2FzZSAndG9vbHRpcCc6XG4gICAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgICA8VG9vbHRpcENvbmZpZyBkYXRhc2V0cz17ZGF0YXNldHN9IGNvbmZpZz17Y29uZmlnLmNvbmZpZ30gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPlxuICAgICAgICAgICk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnYnJ1c2gnOlxuICAgICAgICAgIHRlbXBsYXRlID0gPEJydXNoQ29uZmlnIGNvbmZpZz17Y29uZmlnLmNvbmZpZ30gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPjtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVkSW50ZXJhY3Rpb25QYW5lbCBjbGFzc05hbWU9XCJpbnRlcmFjdGlvbi1wYW5lbFwiPlxuICAgICAgICAgIDxTdHlsZWRQYW5lbEhlYWRlciBjbGFzc05hbWU9XCJpbnRlcmFjdGlvbi1wYW5lbF9faGVhZGVyXCIgb25DbGljaz17dGhpcy5fZW5hYmxlQ29uZmlnfT5cbiAgICAgICAgICAgIDxQYW5lbEhlYWRlckNvbnRlbnQgY2xhc3NOYW1lPVwiaW50ZXJhY3Rpb24tcGFuZWxfX2hlYWRlcl9fY29udGVudFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImludGVyYWN0aW9uLXBhbmVsX19oZWFkZXJfX2ljb24gaWNvblwiPlxuICAgICAgICAgICAgICAgIDxjb25maWcuaWNvbkNvbXBvbmVudCBoZWlnaHQ9XCIxMnB4XCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW50ZXJhY3Rpb24tcGFuZWxfX2hlYWRlcl9fdGl0bGVcIj5cbiAgICAgICAgICAgICAgICA8UGFuZWxIZWFkZXJUaXRsZT5cbiAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXtjb25maWcubGFiZWx9IC8+XG4gICAgICAgICAgICAgICAgPC9QYW5lbEhlYWRlclRpdGxlPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvUGFuZWxIZWFkZXJDb250ZW50PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnRlcmFjdGlvbi1wYW5lbF9faGVhZGVyX19hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgICAgICBjaGVja2VkPXtjb25maWcuZW5hYmxlZH1cbiAgICAgICAgICAgICAgICBpZD17YCR7Y29uZmlnLmlkfS10b2dnbGVgfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiB0aGlzLl91cGRhdGVDb25maWcoe2VuYWJsZWQ6ICFjb25maWcuZW5hYmxlZH0pfVxuICAgICAgICAgICAgICAgIHNlY29uZGFyeVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9TdHlsZWRQYW5lbEhlYWRlcj5cbiAgICAgICAgICB7Y29uZmlnLmVuYWJsZWQgJiYgdGVtcGxhdGUgJiYgKFxuICAgICAgICAgICAgPFN0eWxlZFBhbmVsQ29udGVudCBjbGFzc05hbWU9XCJpbnRlcmFjdGlvbi1wYW5lbF9fY29udGVudFwiPlxuICAgICAgICAgICAgICB7dGVtcGxhdGV9XG4gICAgICAgICAgICA8L1N0eWxlZFBhbmVsQ29udGVudD5cbiAgICAgICAgICApfVxuICAgICAgICA8L1N0eWxlZEludGVyYWN0aW9uUGFuZWw+XG4gICAgICApO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgSW50ZXJhY3Rpb25QYW5lbEZhY3Rvcnk7XG4iXX0=