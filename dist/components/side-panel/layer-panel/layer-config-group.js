"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.StyledConfigGroupHeader = exports.StyledLayerConfigGroup = exports.ConfigGroupCollapsibleHeader = exports.ConfigGroupCollapsibleContent = exports.StyledLayerConfigGroupAction = exports.StyledLayerConfigGroupLabel = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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

function _templateObject7() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  &.disabled {\n    opacity: 0.3;\n    pointer-events: none;\n    * {\n      pointer-events: none;\n    }\n  }\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 12px;\n\n  :hover {\n    cursor: pointer;\n    .layer-config-group__label {\n      color: ", ";\n      border-left: 2px solid ", ";\n    }\n\n    .layer-config-group__action {\n      color: ", ";\n    }\n  }\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  padding-left: 18px;\n  margin-bottom: 12px;\n\n  &.disabled {\n    opacity: 0.3;\n    pointer-events: none;\n  }\n  &.collapsed {\n    .layer-config-group__header__collapsible {\n      overflow: visible;\n      max-height: 600px;\n    }\n    .layer-config-group__content {\n      .layer-config-group__content__collapsible {\n        overflow: hidden;\n        max-height: 0;\n      }\n    }\n  }\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  overflow: visible;\n  overflow: hidden;\n  max-height: 0;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  overflow: visible;\n  transition: max-height 0.3s ease-out;\n  height: max-content;\n  max-height: 600px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n  color: ", ";\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  border-left: 2px solid ", ";\n  line-height: 12px;\n  margin-left: -12px;\n  padding-left: 10px;\n  display: flex;\n  align-items: center;\n\n  span {\n    color: ", ";\n    font-size: 12px;\n    font-weight: 500;\n    letter-spacing: 0.2px;\n    text-transform: capitalize;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledLayerConfigGroupLabel = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.labelColor;
}, function (props) {
  return props.theme.textColor;
});

exports.StyledLayerConfigGroupLabel = StyledLayerConfigGroupLabel;

var StyledLayerConfigGroupAction = _styledComponents["default"].div(_templateObject2(), function (props) {
  return props.theme.textColor;
});

exports.StyledLayerConfigGroupAction = StyledLayerConfigGroupAction;

var ConfigGroupCollapsibleContent = _styledComponents["default"].div.attrs({
  className: 'layer-config-group__content__collapsible'
})(_templateObject3());

exports.ConfigGroupCollapsibleContent = ConfigGroupCollapsibleContent;

var ConfigGroupCollapsibleHeader = _styledComponents["default"].div.attrs({
  className: 'layer-config-group__header__collapsible'
})(_templateObject4());

exports.ConfigGroupCollapsibleHeader = ConfigGroupCollapsibleHeader;

var StyledLayerConfigGroup = _styledComponents["default"].div(_templateObject5());

exports.StyledLayerConfigGroup = StyledLayerConfigGroup;

var StyledConfigGroupHeader = _styledComponents["default"].div(_templateObject6(), function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.textColorHl;
}, function (props) {
  return props.theme.textColorHl;
});

exports.StyledConfigGroupHeader = StyledConfigGroupHeader;

var ConfigGroupContent = _styledComponents["default"].div(_templateObject7());

var LayerConfigGroup =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(LayerConfigGroup, _Component);

  function LayerConfigGroup() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, LayerConfigGroup);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(LayerConfigGroup)).call.apply(_getPrototypeOf2, [this].concat(args)));
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
      return _react["default"].createElement(StyledLayerConfigGroup, {
        className: (0, _classnames["default"])('layer-config-group', {
          collapsed: collapsed,
          disabled: disabled
        })
      }, _react["default"].createElement(StyledConfigGroupHeader, {
        className: "layer-config-group__header",
        onClick: function onClick() {
          return _this2.setState({
            collapsed: !_this2.state.collapsed
          });
        }
      }, _react["default"].createElement(StyledLayerConfigGroupLabel, {
        className: "layer-config-group__label"
      }, _react["default"].createElement("span", null, _react["default"].createElement(_reactIntl.FormattedMessage, {
        id: label || 'misc.empty'
      })), description && _react["default"].createElement(_infoHelper["default"], {
        description: description,
        id: label
      })), _react["default"].createElement(StyledLayerConfigGroupAction, {
        className: "layer-config-group__action"
      }, property ? _react["default"].createElement(_switch["default"], {
        checked: layer.config.visConfig[property],
        id: "".concat(layer.id, "-").concat(property),
        onChange: function onChange() {
          return _onChange2((0, _defineProperty2["default"])({}, property, !layer.config.visConfig[property]));
        }
      }) : null, collapsible ? _react["default"].createElement(_icons.VertThreeDots, {
        height: "18px"
      }) : null)), _react["default"].createElement(ConfigGroupContent, {
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
var _default = LayerConfigGroup;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29uZmlnLWdyb3VwLmpzIl0sIm5hbWVzIjpbIlN0eWxlZExheWVyQ29uZmlnR3JvdXBMYWJlbCIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJsYWJlbENvbG9yIiwidGV4dENvbG9yIiwiU3R5bGVkTGF5ZXJDb25maWdHcm91cEFjdGlvbiIsIkNvbmZpZ0dyb3VwQ29sbGFwc2libGVDb250ZW50IiwiYXR0cnMiLCJjbGFzc05hbWUiLCJDb25maWdHcm91cENvbGxhcHNpYmxlSGVhZGVyIiwiU3R5bGVkTGF5ZXJDb25maWdHcm91cCIsIlN0eWxlZENvbmZpZ0dyb3VwSGVhZGVyIiwidGV4dENvbG9ySGwiLCJDb25maWdHcm91cENvbnRlbnQiLCJMYXllckNvbmZpZ0dyb3VwIiwiY29sbGFwc2VkIiwibGFiZWwiLCJjaGlsZHJlbiIsInByb3BlcnR5IiwibGF5ZXIiLCJvbkNoYW5nZSIsImNvbGxhcHNpYmxlIiwiZGVzY3JpcHRpb24iLCJkaXNhYmxlZCIsInN0YXRlIiwic2V0U3RhdGUiLCJjb25maWciLCJ2aXNDb25maWciLCJpZCIsImV4cGFuZGVkIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLElBQU1BLDJCQUEyQixHQUFHQyw2QkFBT0MsR0FBVixvQkFDYixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFVBQWhCO0FBQUEsQ0FEUSxFQVMzQixVQUFBRixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlFLFNBQWhCO0FB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LENBQUNPLE1BQU4sQ0FBYUMsU0FBYixDQUF1QlQsUUFBdkIsQ0FBZixFQUFkO0FBQUE7QUFIWixRQURPLEdBTUwsSUFQTixFQVFHRyxXQUFXLEdBQUcsZ0NBQUMsb0JBQUQ7QUFBZSxRQUFBLE1BQU0sRUFBQztBQUF0QixRQUFILEdBQXFDLElBUm5ELENBVkYsQ0FERixFQXNCRSxnQ0FBQyxrQkFBRDtBQUNFLFFBQUEsU0FBUyxFQUFFLDRCQUFXLDZCQUFYLEVBQTBDO0FBQ25ERSxVQUFBQSxRQUFRLEVBQUVMLFFBQVEsSUFBSSxDQUFDQyxLQUFLLENBQUNPLE1BQU4sQ0FBYUMsU0FBYixDQUF1QlQsUUFBdkI7QUFENEIsU0FBMUM7QUFEYixTQUtHRCxRQUxILENBdEJGLENBREY7QUFnQ0Q7Ozs2Q0EzRCtCaEIsSyxFQUFPdUIsSyxFQUFPO0FBQzVDO0FBQ0EsVUFBSXZCLEtBQUssQ0FBQzRCLFFBQU4sSUFBa0JMLEtBQUssQ0FBQ1QsU0FBNUIsRUFBdUM7QUFDckMsZUFBTztBQUFDQSxVQUFBQSxTQUFTLEVBQUU7QUFBWixTQUFQO0FBQ0Q7O0FBRUQsYUFBTyxJQUFQO0FBQ0Q7OztFQWhCNEJlLGdCOztpQ0FBekJoQixnQixrQkFDa0I7QUFDcEJPLEVBQUFBLFdBQVcsRUFBRSxLQURPO0FBRXBCUSxFQUFBQSxRQUFRLEVBQUUsS0FGVTtBQUdwQlQsRUFBQUEsUUFBUSxFQUFFLG9CQUFNLENBQUUsQ0FIRTtBQUlwQkUsRUFBQUEsV0FBVyxFQUFFLElBSk87QUFLcEJDLEVBQUFBLFFBQVEsRUFBRTtBQUxVLEM7QUFzRXhCLHFDQUFTVCxnQkFBVDtlQUVlQSxnQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtwb2x5ZmlsbH0gZnJvbSAncmVhY3QtbGlmZWN5Y2xlcy1jb21wYXQnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5pbXBvcnQgU3dpdGNoIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N3aXRjaCc7XG5pbXBvcnQgSW5mb0hlbHBlciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pbmZvLWhlbHBlcic7XG5pbXBvcnQge1ZlcnRUaHJlZURvdHN9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcblxuZXhwb3J0IGNvbnN0IFN0eWxlZExheWVyQ29uZmlnR3JvdXBMYWJlbCA9IHN0eWxlZC5kaXZgXG4gIGJvcmRlci1sZWZ0OiAycHggc29saWQgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yfTtcbiAgbGluZS1oZWlnaHQ6IDEycHg7XG4gIG1hcmdpbi1sZWZ0OiAtMTJweDtcbiAgcGFkZGluZy1sZWZ0OiAxMHB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gIHNwYW4ge1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMnB4O1xuICAgIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgU3R5bGVkTGF5ZXJDb25maWdHcm91cEFjdGlvbiA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG5gO1xuXG5leHBvcnQgY29uc3QgQ29uZmlnR3JvdXBDb2xsYXBzaWJsZUNvbnRlbnQgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnbGF5ZXItY29uZmlnLWdyb3VwX19jb250ZW50X19jb2xsYXBzaWJsZSdcbn0pYFxuICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgdHJhbnNpdGlvbjogbWF4LWhlaWdodCAwLjNzIGVhc2Utb3V0O1xuICBoZWlnaHQ6IG1heC1jb250ZW50O1xuICBtYXgtaGVpZ2h0OiA2MDBweDtcbmA7XG5cbmV4cG9ydCBjb25zdCBDb25maWdHcm91cENvbGxhcHNpYmxlSGVhZGVyID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ2xheWVyLWNvbmZpZy1ncm91cF9faGVhZGVyX19jb2xsYXBzaWJsZSdcbn0pYFxuICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgbWF4LWhlaWdodDogMDtcbmA7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRMYXllckNvbmZpZ0dyb3VwID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZy1sZWZ0OiAxOHB4O1xuICBtYXJnaW4tYm90dG9tOiAxMnB4O1xuXG4gICYuZGlzYWJsZWQge1xuICAgIG9wYWNpdHk6IDAuMztcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgfVxuICAmLmNvbGxhcHNlZCB7XG4gICAgLmxheWVyLWNvbmZpZy1ncm91cF9faGVhZGVyX19jb2xsYXBzaWJsZSB7XG4gICAgICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgICAgIG1heC1oZWlnaHQ6IDYwMHB4O1xuICAgIH1cbiAgICAubGF5ZXItY29uZmlnLWdyb3VwX19jb250ZW50IHtcbiAgICAgIC5sYXllci1jb25maWctZ3JvdXBfX2NvbnRlbnRfX2NvbGxhcHNpYmxlIHtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgbWF4LWhlaWdodDogMDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRDb25maWdHcm91cEhlYWRlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgbWFyZ2luLWJvdHRvbTogMTJweDtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAubGF5ZXItY29uZmlnLWdyb3VwX19sYWJlbCB7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgICBib3JkZXItbGVmdDogMnB4IHNvbGlkICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9ySGx9O1xuICAgIH1cblxuICAgIC5sYXllci1jb25maWctZ3JvdXBfX2FjdGlvbiB7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBDb25maWdHcm91cENvbnRlbnQgPSBzdHlsZWQuZGl2YFxuICAmLmRpc2FibGVkIHtcbiAgICBvcGFjaXR5OiAwLjM7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgKiB7XG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICB9XG4gIH1cbmA7XG5cbmNsYXNzIExheWVyQ29uZmlnR3JvdXAgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNvbGxhcHNpYmxlOiBmYWxzZSxcbiAgICBleHBhbmRlZDogZmFsc2UsXG4gICAgb25DaGFuZ2U6ICgpID0+IHt9LFxuICAgIGRlc2NyaXB0aW9uOiBudWxsLFxuICAgIGRpc2FibGVkOiBmYWxzZVxuICB9O1xuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHMsIHN0YXRlKSB7XG4gICAgLy8gIGludm9rZWQgYWZ0ZXIgYSBjb21wb25lbnQgaXMgaW5zdGFudGlhdGVkIGFzIHdlbGwgYXMgYmVmb3JlIGl0IGlzIHJlLXJlbmRlcmVkXG4gICAgaWYgKHByb3BzLmV4cGFuZGVkICYmIHN0YXRlLmNvbGxhcHNlZCkge1xuICAgICAgcmV0dXJuIHtjb2xsYXBzZWQ6IGZhbHNlfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIGNvbGxhcHNlZDogdHJ1ZVxuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBsYWJlbCxcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgcHJvcGVydHksXG4gICAgICBsYXllcixcbiAgICAgIG9uQ2hhbmdlLFxuICAgICAgY29sbGFwc2libGUsXG4gICAgICBkZXNjcmlwdGlvbixcbiAgICAgIGRpc2FibGVkXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCB7Y29sbGFwc2VkfSA9IHRoaXMuc3RhdGU7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZExheWVyQ29uZmlnR3JvdXAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdsYXllci1jb25maWctZ3JvdXAnLCB7Y29sbGFwc2VkLCBkaXNhYmxlZH0pfT5cbiAgICAgICAgPFN0eWxlZENvbmZpZ0dyb3VwSGVhZGVyXG4gICAgICAgICAgY2xhc3NOYW1lPVwibGF5ZXItY29uZmlnLWdyb3VwX19oZWFkZXJcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoe2NvbGxhcHNlZDogIXRoaXMuc3RhdGUuY29sbGFwc2VkfSl9XG4gICAgICAgID5cbiAgICAgICAgICA8U3R5bGVkTGF5ZXJDb25maWdHcm91cExhYmVsIGNsYXNzTmFtZT1cImxheWVyLWNvbmZpZy1ncm91cF9fbGFiZWxcIj5cbiAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17bGFiZWwgfHwgJ21pc2MuZW1wdHknfSAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAge2Rlc2NyaXB0aW9uICYmIDxJbmZvSGVscGVyIGRlc2NyaXB0aW9uPXtkZXNjcmlwdGlvbn0gaWQ9e2xhYmVsfSAvPn1cbiAgICAgICAgICA8L1N0eWxlZExheWVyQ29uZmlnR3JvdXBMYWJlbD5cbiAgICAgICAgICA8U3R5bGVkTGF5ZXJDb25maWdHcm91cEFjdGlvbiBjbGFzc05hbWU9XCJsYXllci1jb25maWctZ3JvdXBfX2FjdGlvblwiPlxuICAgICAgICAgICAge3Byb3BlcnR5ID8gKFxuICAgICAgICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgICAgICAgY2hlY2tlZD17bGF5ZXIuY29uZmlnLnZpc0NvbmZpZ1twcm9wZXJ0eV19XG4gICAgICAgICAgICAgICAgaWQ9e2Ake2xheWVyLmlkfS0ke3Byb3BlcnR5fWB9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eygpID0+IG9uQ2hhbmdlKHtbcHJvcGVydHldOiAhbGF5ZXIuY29uZmlnLnZpc0NvbmZpZ1twcm9wZXJ0eV19KX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAge2NvbGxhcHNpYmxlID8gPFZlcnRUaHJlZURvdHMgaGVpZ2h0PVwiMThweFwiIC8+IDogbnVsbH1cbiAgICAgICAgICA8L1N0eWxlZExheWVyQ29uZmlnR3JvdXBBY3Rpb24+XG4gICAgICAgIDwvU3R5bGVkQ29uZmlnR3JvdXBIZWFkZXI+XG4gICAgICAgIDxDb25maWdHcm91cENvbnRlbnRcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ2xheWVyLWNvbmZpZy1ncm91cF9fY29udGVudCcsIHtcbiAgICAgICAgICAgIGRpc2FibGVkOiBwcm9wZXJ0eSAmJiAhbGF5ZXIuY29uZmlnLnZpc0NvbmZpZ1twcm9wZXJ0eV1cbiAgICAgICAgICB9KX1cbiAgICAgICAgPlxuICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgPC9Db25maWdHcm91cENvbnRlbnQ+XG4gICAgICA8L1N0eWxlZExheWVyQ29uZmlnR3JvdXA+XG4gICAgKTtcbiAgfVxufVxuXG5wb2x5ZmlsbChMYXllckNvbmZpZ0dyb3VwKTtcblxuZXhwb3J0IGRlZmF1bHQgTGF5ZXJDb25maWdHcm91cDtcbiJdfQ==