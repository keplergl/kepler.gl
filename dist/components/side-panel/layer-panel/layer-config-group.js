"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayerConfigGroupLabelFactory = LayerConfigGroupLabelFactory;
exports["default"] = exports.StyledLayerConfigGroup = exports.ConfigGroupCollapsibleHeader = exports.ConfigGroupCollapsibleContent = exports.StyledLayerConfigGroupAction = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _classnames = _interopRequireDefault(require("classnames"));

var _reactIntl = require("react-intl");

var _switch = _interopRequireDefault(require("../../common/switch"));

var _infoHelper = _interopRequireDefault(require("../../common/info-helper"));

var _icons = require("../../common/icons");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var StyledLayerConfigGroupAction = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  color: ", ";\n"])), function (props) {
  return props.theme.textColor;
});

exports.StyledLayerConfigGroupAction = StyledLayerConfigGroupAction;

var ConfigGroupCollapsibleContent = _styledComponents["default"].div.attrs({
  className: 'layer-config-group__content__collapsible'
})(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  overflow: visible;\n  transition: max-height 0.3s ease-out;\n  height: max-content;\n  max-height: 600px;\n"])));

exports.ConfigGroupCollapsibleContent = ConfigGroupCollapsibleContent;

var ConfigGroupCollapsibleHeader = _styledComponents["default"].div.attrs({
  className: 'layer-config-group__header__collapsible'
})(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  overflow: visible;\n  overflow: hidden;\n  max-height: 0;\n"])));

exports.ConfigGroupCollapsibleHeader = ConfigGroupCollapsibleHeader;

var StyledLayerConfigGroup = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  padding-left: ", "px;\n  margin-bottom: ", "px;\n\n  &.disabled {\n    opacity: 0.3;\n    pointer-events: none;\n  }\n  &.collapsed {\n    .layer-config-group__header__collapsible {\n      overflow: visible;\n      max-height: 600px;\n    }\n    .layer-config-group__content {\n      .layer-config-group__content__collapsible {\n        overflow: hidden;\n        max-height: 0;\n      }\n    }\n  }\n"])), function (props) {
  return props.theme.layerConfigGroupPaddingLeft;
}, function (props) {
  return props.theme.layerConfigGroupMarginBottom;
});

exports.StyledLayerConfigGroup = StyledLayerConfigGroup;

var StyledConfigGroupHeader = _styledComponents["default"].div(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 12px;\n\n  :hover {\n    cursor: pointer;\n    .layer-config-group__label {\n      color: ", ";\n    }\n\n    .layer-config-group__action {\n      color: ", ";\n    }\n  }\n"])), function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.textColorHl;
});

var ConfigGroupContent = _styledComponents["default"].div(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2["default"])(["\n  &.disabled {\n    opacity: 0.3;\n    pointer-events: none;\n    * {\n      pointer-events: none;\n    }\n  }\n"])));

LayerConfigGroupLabelFactory.deps = [_infoHelper["default"]];

function LayerConfigGroupLabelFactory(InfoHelper) {
  var StyledLayerConfigGroupLabel = _styledComponents["default"].div(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2["default"])(["\n    border-left: ", " solid\n      ", ";\n    line-height: 12px;\n    margin-left: ", ";\n    padding-left: ", ";\n\n    display: flex;\n    align-items: center;\n\n    span {\n      color: ", ";\n      font-weight: 500;\n      letter-spacing: 0.2px;\n      text-transform: capitalize;\n      margin-left: ", ";\n      font-size: ", ";\n    }\n  "])), function (props) {
    return props.theme.layerConfigGroupLabelBorderLeft;
  }, function (props) {
    return props.theme.labelColor;
  }, function (props) {
    return props.theme.layerConfigGroupLabelMargin;
  }, function (props) {
    return props.theme.layerConfigGroupLabelPadding;
  }, function (props) {
    return props.theme.textColor;
  }, function (props) {
    return props.theme.layerConfigGroupLabelLabelMargin;
  }, function (props) {
    return props.theme.layerConfigGroupLabelLabelFontSize;
  });

  var LayerConfigGroupLabel = function LayerConfigGroupLabel(_ref) {
    var label = _ref.label,
        description = _ref.description;
    return /*#__PURE__*/_react["default"].createElement(StyledLayerConfigGroupLabel, {
      className: "layer-config-group__label"
    }, /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_reactIntl.FormattedMessage, {
      id: label || 'misc.empty',
      defaultMessage: label
    })), description && /*#__PURE__*/_react["default"].createElement(InfoHelper, {
      description: description,
      id: label
    }));
  };

  return LayerConfigGroupLabel;
}

LayerConfigGroupFactory.deps = [LayerConfigGroupLabelFactory];

function LayerConfigGroupFactory(LayerConfigGroupLabel) {
  var LayerConfigGroup = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(LayerConfigGroup, _Component);

    var _super = _createSuper(LayerConfigGroup);

    function LayerConfigGroup() {
      var _this;

      (0, _classCallCheck2["default"])(this, LayerConfigGroup);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        collapsed: true
      });
      return _this;
    }

    (0, _createClass2["default"])(LayerConfigGroup, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
            label = _this$props.label,
            children = _this$props.children,
            property = _this$props.property,
            layer = _this$props.layer,
            _onChange2 = _this$props.onChange,
            collapsible = _this$props.collapsible,
            description = _this$props.description,
            disabled = _this$props.disabled;
        var collapsed = this.state.collapsed;
        return /*#__PURE__*/_react["default"].createElement(StyledLayerConfigGroup, {
          className: (0, _classnames["default"])('layer-config-group', {
            collapsed: collapsed,
            disabled: disabled
          })
        }, /*#__PURE__*/_react["default"].createElement(StyledConfigGroupHeader, {
          className: "layer-config-group__header",
          onClick: function onClick() {
            return _this2.setState({
              collapsed: !_this2.state.collapsed
            });
          }
        }, /*#__PURE__*/_react["default"].createElement(LayerConfigGroupLabel, {
          label: label,
          description: description
        }), /*#__PURE__*/_react["default"].createElement(StyledLayerConfigGroupAction, {
          className: "layer-config-group__action"
        }, property ? /*#__PURE__*/_react["default"].createElement(_switch["default"], {
          checked: layer.config.visConfig[property],
          id: "".concat(layer.id, "-").concat(property),
          onChange: function onChange() {
            return _onChange2((0, _defineProperty2["default"])({}, property, !layer.config.visConfig[property]));
          }
        }) : null, collapsible ? /*#__PURE__*/_react["default"].createElement(_icons.VertThreeDots, {
          height: "18px"
        }) : null)), /*#__PURE__*/_react["default"].createElement(ConfigGroupContent, {
          className: (0, _classnames["default"])('layer-config-group__content', {
            disabled: property && !layer.config.visConfig[property]
          })
        }, children));
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(props, state) {
        //  invoked after a component is instantiated as well as before it is re-rendered
        if (props.expanded && state.collapsed) {
          return {
            collapsed: false
          };
        }

        return null;
      }
    }]);
    return LayerConfigGroup;
  }(_react.Component);

  (0, _defineProperty2["default"])(LayerConfigGroup, "defaultProps", {
    collapsible: false,
    expanded: false,
    onChange: function onChange() {},
    description: null,
    disabled: false
  });
  (0, _reactLifecyclesCompat.polyfill)(LayerConfigGroup);
  return LayerConfigGroup;
}

var _default = LayerConfigGroupFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29uZmlnLWdyb3VwLmpzIl0sIm5hbWVzIjpbIlN0eWxlZExheWVyQ29uZmlnR3JvdXBBY3Rpb24iLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwidGV4dENvbG9yIiwiQ29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQiLCJhdHRycyIsImNsYXNzTmFtZSIsIkNvbmZpZ0dyb3VwQ29sbGFwc2libGVIZWFkZXIiLCJTdHlsZWRMYXllckNvbmZpZ0dyb3VwIiwibGF5ZXJDb25maWdHcm91cFBhZGRpbmdMZWZ0IiwibGF5ZXJDb25maWdHcm91cE1hcmdpbkJvdHRvbSIsIlN0eWxlZENvbmZpZ0dyb3VwSGVhZGVyIiwidGV4dENvbG9ySGwiLCJDb25maWdHcm91cENvbnRlbnQiLCJMYXllckNvbmZpZ0dyb3VwTGFiZWxGYWN0b3J5IiwiZGVwcyIsIkluZm9IZWxwZXJGYWN0b3J5IiwiSW5mb0hlbHBlciIsIlN0eWxlZExheWVyQ29uZmlnR3JvdXBMYWJlbCIsImxheWVyQ29uZmlnR3JvdXBMYWJlbEJvcmRlckxlZnQiLCJsYWJlbENvbG9yIiwibGF5ZXJDb25maWdHcm91cExhYmVsTWFyZ2luIiwibGF5ZXJDb25maWdHcm91cExhYmVsUGFkZGluZyIsImxheWVyQ29uZmlnR3JvdXBMYWJlbExhYmVsTWFyZ2luIiwibGF5ZXJDb25maWdHcm91cExhYmVsTGFiZWxGb250U2l6ZSIsIkxheWVyQ29uZmlnR3JvdXBMYWJlbCIsImxhYmVsIiwiZGVzY3JpcHRpb24iLCJMYXllckNvbmZpZ0dyb3VwRmFjdG9yeSIsIkxheWVyQ29uZmlnR3JvdXAiLCJjb2xsYXBzZWQiLCJjaGlsZHJlbiIsInByb3BlcnR5IiwibGF5ZXIiLCJvbkNoYW5nZSIsImNvbGxhcHNpYmxlIiwiZGlzYWJsZWQiLCJzdGF0ZSIsInNldFN0YXRlIiwiY29uZmlnIiwidmlzQ29uZmln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QVcsRUFBRSxLQURPO0FBRXBCTyxJQUFBQSxRQUFRLEVBQUUsS0FGVTtBQUdwQlIsSUFBQUEsUUFBUSxFQUFFLG9CQUFNLENBQUUsQ0FIRTtBQUlwQlAsSUFBQUEsV0FBVyxFQUFFLElBSk87QUFLcEJTLElBQUFBLFFBQVEsRUFBRTtBQUxVLEdBRjhCO0FBbUV0RCx1Q0FBU1AsZ0JBQVQ7QUFFQSxTQUFPQSxnQkFBUDtBQUNEOztlQUVjRCx1QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtwb2x5ZmlsbH0gZnJvbSAncmVhY3QtbGlmZWN5Y2xlcy1jb21wYXQnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5pbXBvcnQgU3dpdGNoIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N3aXRjaCc7XG5pbXBvcnQgSW5mb0hlbHBlckZhY3RvcnkgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaW5mby1oZWxwZXInO1xuaW1wb3J0IHtWZXJ0VGhyZWVEb3RzfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRMYXllckNvbmZpZ0dyb3VwQWN0aW9uID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbmA7XG5cbmV4cG9ydCBjb25zdCBDb25maWdHcm91cENvbGxhcHNpYmxlQ29udGVudCA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdsYXllci1jb25maWctZ3JvdXBfX2NvbnRlbnRfX2NvbGxhcHNpYmxlJ1xufSlgXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xuICB0cmFuc2l0aW9uOiBtYXgtaGVpZ2h0IDAuM3MgZWFzZS1vdXQ7XG4gIGhlaWdodDogbWF4LWNvbnRlbnQ7XG4gIG1heC1oZWlnaHQ6IDYwMHB4O1xuYDtcblxuZXhwb3J0IGNvbnN0IENvbmZpZ0dyb3VwQ29sbGFwc2libGVIZWFkZXIgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnbGF5ZXItY29uZmlnLWdyb3VwX19oZWFkZXJfX2NvbGxhcHNpYmxlJ1xufSlgXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBtYXgtaGVpZ2h0OiAwO1xuYDtcblxuZXhwb3J0IGNvbnN0IFN0eWxlZExheWVyQ29uZmlnR3JvdXAgPSBzdHlsZWQuZGl2YFxuICBwYWRkaW5nLWxlZnQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGF5ZXJDb25maWdHcm91cFBhZGRpbmdMZWZ0fXB4O1xuICBtYXJnaW4tYm90dG9tOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxheWVyQ29uZmlnR3JvdXBNYXJnaW5Cb3R0b219cHg7XG5cbiAgJi5kaXNhYmxlZCB7XG4gICAgb3BhY2l0eTogMC4zO1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB9XG4gICYuY29sbGFwc2VkIHtcbiAgICAubGF5ZXItY29uZmlnLWdyb3VwX19oZWFkZXJfX2NvbGxhcHNpYmxlIHtcbiAgICAgIG92ZXJmbG93OiB2aXNpYmxlO1xuICAgICAgbWF4LWhlaWdodDogNjAwcHg7XG4gICAgfVxuICAgIC5sYXllci1jb25maWctZ3JvdXBfX2NvbnRlbnQge1xuICAgICAgLmxheWVyLWNvbmZpZy1ncm91cF9fY29udGVudF9fY29sbGFwc2libGUge1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICBtYXgtaGVpZ2h0OiAwO1xuICAgICAgfVxuICAgIH1cbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkQ29uZmlnR3JvdXBIZWFkZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIG1hcmdpbi1ib3R0b206IDEycHg7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgLmxheWVyLWNvbmZpZy1ncm91cF9fbGFiZWwge1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICAgIH1cblxuICAgIC5sYXllci1jb25maWctZ3JvdXBfX2FjdGlvbiB7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBDb25maWdHcm91cENvbnRlbnQgPSBzdHlsZWQuZGl2YFxuICAmLmRpc2FibGVkIHtcbiAgICBvcGFjaXR5OiAwLjM7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgKiB7XG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICB9XG4gIH1cbmA7XG5cbkxheWVyQ29uZmlnR3JvdXBMYWJlbEZhY3RvcnkuZGVwcyA9IFtJbmZvSGVscGVyRmFjdG9yeV07XG5cbmV4cG9ydCBmdW5jdGlvbiBMYXllckNvbmZpZ0dyb3VwTGFiZWxGYWN0b3J5KEluZm9IZWxwZXIpIHtcbiAgY29uc3QgU3R5bGVkTGF5ZXJDb25maWdHcm91cExhYmVsID0gc3R5bGVkLmRpdmBcbiAgICBib3JkZXItbGVmdDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYXllckNvbmZpZ0dyb3VwTGFiZWxCb3JkZXJMZWZ0fSBzb2xpZFxuICAgICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgICBsaW5lLWhlaWdodDogMTJweDtcbiAgICBtYXJnaW4tbGVmdDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYXllckNvbmZpZ0dyb3VwTGFiZWxNYXJnaW59O1xuICAgIHBhZGRpbmctbGVmdDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYXllckNvbmZpZ0dyb3VwTGFiZWxQYWRkaW5nfTtcblxuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgIHNwYW4ge1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICBsZXR0ZXItc3BhY2luZzogMC4ycHg7XG4gICAgICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcbiAgICAgIG1hcmdpbi1sZWZ0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxheWVyQ29uZmlnR3JvdXBMYWJlbExhYmVsTWFyZ2lufTtcbiAgICAgIGZvbnQtc2l6ZTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYXllckNvbmZpZ0dyb3VwTGFiZWxMYWJlbEZvbnRTaXplfTtcbiAgICB9XG4gIGA7XG5cbiAgY29uc3QgTGF5ZXJDb25maWdHcm91cExhYmVsID0gKHtsYWJlbCwgZGVzY3JpcHRpb259KSA9PiAoXG4gICAgPFN0eWxlZExheWVyQ29uZmlnR3JvdXBMYWJlbCBjbGFzc05hbWU9XCJsYXllci1jb25maWctZ3JvdXBfX2xhYmVsXCI+XG4gICAgICA8c3Bhbj5cbiAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9e2xhYmVsIHx8ICdtaXNjLmVtcHR5J30gZGVmYXVsdE1lc3NhZ2U9e2xhYmVsfSAvPlxuICAgICAgPC9zcGFuPlxuICAgICAge2Rlc2NyaXB0aW9uICYmIDxJbmZvSGVscGVyIGRlc2NyaXB0aW9uPXtkZXNjcmlwdGlvbn0gaWQ9e2xhYmVsfSAvPn1cbiAgICA8L1N0eWxlZExheWVyQ29uZmlnR3JvdXBMYWJlbD5cbiAgKTtcblxuICByZXR1cm4gTGF5ZXJDb25maWdHcm91cExhYmVsO1xufVxuXG5MYXllckNvbmZpZ0dyb3VwRmFjdG9yeS5kZXBzID0gW0xheWVyQ29uZmlnR3JvdXBMYWJlbEZhY3RvcnldO1xuXG5mdW5jdGlvbiBMYXllckNvbmZpZ0dyb3VwRmFjdG9yeShMYXllckNvbmZpZ0dyb3VwTGFiZWwpIHtcbiAgY2xhc3MgTGF5ZXJDb25maWdHcm91cCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIGNvbGxhcHNpYmxlOiBmYWxzZSxcbiAgICAgIGV4cGFuZGVkOiBmYWxzZSxcbiAgICAgIG9uQ2hhbmdlOiAoKSA9PiB7fSxcbiAgICAgIGRlc2NyaXB0aW9uOiBudWxsLFxuICAgICAgZGlzYWJsZWQ6IGZhbHNlXG4gICAgfTtcblxuICAgIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHMsIHN0YXRlKSB7XG4gICAgICAvLyAgaW52b2tlZCBhZnRlciBhIGNvbXBvbmVudCBpcyBpbnN0YW50aWF0ZWQgYXMgd2VsbCBhcyBiZWZvcmUgaXQgaXMgcmUtcmVuZGVyZWRcbiAgICAgIGlmIChwcm9wcy5leHBhbmRlZCAmJiBzdGF0ZS5jb2xsYXBzZWQpIHtcbiAgICAgICAgcmV0dXJuIHtjb2xsYXBzZWQ6IGZhbHNlfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgc3RhdGUgPSB7XG4gICAgICBjb2xsYXBzZWQ6IHRydWVcbiAgICB9O1xuXG4gICAgcmVuZGVyKCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBsYWJlbCxcbiAgICAgICAgY2hpbGRyZW4sXG4gICAgICAgIHByb3BlcnR5LFxuICAgICAgICBsYXllcixcbiAgICAgICAgb25DaGFuZ2UsXG4gICAgICAgIGNvbGxhcHNpYmxlLFxuICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgZGlzYWJsZWRcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBjb25zdCB7Y29sbGFwc2VkfSA9IHRoaXMuc3RhdGU7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdHlsZWRMYXllckNvbmZpZ0dyb3VwIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnbGF5ZXItY29uZmlnLWdyb3VwJywge2NvbGxhcHNlZCwgZGlzYWJsZWR9KX0+XG4gICAgICAgICAgPFN0eWxlZENvbmZpZ0dyb3VwSGVhZGVyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJsYXllci1jb25maWctZ3JvdXBfX2hlYWRlclwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHtjb2xsYXBzZWQ6ICF0aGlzLnN0YXRlLmNvbGxhcHNlZH0pfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwTGFiZWwgbGFiZWw9e2xhYmVsfSBkZXNjcmlwdGlvbj17ZGVzY3JpcHRpb259IC8+XG4gICAgICAgICAgICA8U3R5bGVkTGF5ZXJDb25maWdHcm91cEFjdGlvbiBjbGFzc05hbWU9XCJsYXllci1jb25maWctZ3JvdXBfX2FjdGlvblwiPlxuICAgICAgICAgICAgICB7cHJvcGVydHkgPyAoXG4gICAgICAgICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgICAgICAgY2hlY2tlZD17bGF5ZXIuY29uZmlnLnZpc0NvbmZpZ1twcm9wZXJ0eV19XG4gICAgICAgICAgICAgICAgICBpZD17YCR7bGF5ZXIuaWR9LSR7cHJvcGVydHl9YH1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiBvbkNoYW5nZSh7W3Byb3BlcnR5XTogIWxheWVyLmNvbmZpZy52aXNDb25maWdbcHJvcGVydHldfSl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgIHtjb2xsYXBzaWJsZSA/IDxWZXJ0VGhyZWVEb3RzIGhlaWdodD1cIjE4cHhcIiAvPiA6IG51bGx9XG4gICAgICAgICAgICA8L1N0eWxlZExheWVyQ29uZmlnR3JvdXBBY3Rpb24+XG4gICAgICAgICAgPC9TdHlsZWRDb25maWdHcm91cEhlYWRlcj5cbiAgICAgICAgICA8Q29uZmlnR3JvdXBDb250ZW50XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ2xheWVyLWNvbmZpZy1ncm91cF9fY29udGVudCcsIHtcbiAgICAgICAgICAgICAgZGlzYWJsZWQ6IHByb3BlcnR5ICYmICFsYXllci5jb25maWcudmlzQ29uZmlnW3Byb3BlcnR5XVxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgIDwvQ29uZmlnR3JvdXBDb250ZW50PlxuICAgICAgICA8L1N0eWxlZExheWVyQ29uZmlnR3JvdXA+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHBvbHlmaWxsKExheWVyQ29uZmlnR3JvdXApO1xuXG4gIHJldHVybiBMYXllckNvbmZpZ0dyb3VwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBMYXllckNvbmZpZ0dyb3VwRmFjdG9yeTtcbiJdfQ==