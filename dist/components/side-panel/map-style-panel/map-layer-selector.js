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

var _panelHeaderAction = _interopRequireDefault(require("../panel-header-action"));

var _icons = require("../../common/icons");

var _styledComponents2 = require("../../common/styled-components");

var _localization = require("../../../localization");

var _utils = require("../../../utils/utils");

var _templateObject, _templateObject2, _templateObject3;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var StyledInteractionPanel = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  padding-bottom: 12px;\n"])));

var StyledLayerGroupItem = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 10px;\n  display: flex;\n  justify-content: space-between;\n\n  &:last-child {\n    margin-bottom: 0;\n  }\n\n  .layer-group__visibility-toggle {\n    margin-right: 12px;\n  }\n"])));

var LayerLabel = (0, _styledComponents["default"])(_styledComponents2.PanelLabelBold)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n"])), function (props) {
  return props.active ? props.theme.textColor : props.theme.labelColor;
});
LayerGroupSelectorFactory.deps = [_panelHeaderAction["default"]];

function LayerGroupSelectorFactory(PanelHeaderAction) {
  var defaultActionIcons = {
    visible: _icons.EyeSeen,
    hidden: _icons.EyeUnseen
  };

  var LayerGroupSelector = function LayerGroupSelector(_ref) {
    var layers = _ref.layers,
        editableLayers = _ref.editableLayers,
        onChange = _ref.onChange,
        topLayers = _ref.topLayers,
        _ref$actionIcons = _ref.actionIcons,
        actionIcons = _ref$actionIcons === void 0 ? defaultActionIcons : _ref$actionIcons;
    return /*#__PURE__*/_react["default"].createElement(StyledInteractionPanel, {
      className: "map-style__layer-group__selector"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "layer-group__header"
    }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.PanelLabel, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'mapLayers.title'
    }))), /*#__PURE__*/_react["default"].createElement(_styledComponents2.PanelContent, {
      className: "map-style__layer-group"
    }, editableLayers.map(function (slug) {
      return /*#__PURE__*/_react["default"].createElement(StyledLayerGroupItem, {
        className: "layer-group__select",
        key: slug
      }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.PanelLabelWrapper, null, /*#__PURE__*/_react["default"].createElement(PanelHeaderAction, {
        className: "layer-group__visibility-toggle",
        id: "".concat(slug, "-toggle"),
        tooltip: layers[slug] ? 'tooltip.hide' : 'tooltip.show',
        onClick: function onClick() {
          return onChange({
            visibleLayerGroups: _objectSpread(_objectSpread({}, layers), {}, (0, _defineProperty2["default"])({}, slug, !layers[slug]))
          });
        },
        IconComponent: layers[slug] ? actionIcons.visible : actionIcons.hidden,
        active: layers[slug],
        flush: true
      }), /*#__PURE__*/_react["default"].createElement(LayerLabel, {
        active: layers[slug]
      }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
        id: "mapLayers.".concat((0, _utils.camelize)(slug))
      }))), /*#__PURE__*/_react["default"].createElement(_styledComponents2.CenterFlexbox, {
        className: "layer-group__bring-top"
      }, /*#__PURE__*/_react["default"].createElement(PanelHeaderAction, {
        id: "".concat(slug, "-top"),
        tooltip: "tooltip.moveToTop",
        disabled: !layers[slug],
        IconComponent: _icons.Upload,
        active: topLayers[slug],
        onClick: function onClick() {
          return onChange({
            topLayerGroups: _objectSpread(_objectSpread({}, topLayers), {}, (0, _defineProperty2["default"])({}, slug, !topLayers[slug]))
          });
        }
      })));
    })));
  };

  return LayerGroupSelector;
}

var _default = LayerGroupSelectorFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbWFwLXN0eWxlLXBhbmVsL21hcC1sYXllci1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJTdHlsZWRJbnRlcmFjdGlvblBhbmVsIiwic3R5bGVkIiwiZGl2IiwiU3R5bGVkTGF5ZXJHcm91cEl0ZW0iLCJMYXllckxhYmVsIiwiUGFuZWxMYWJlbEJvbGQiLCJwcm9wcyIsImFjdGl2ZSIsInRoZW1lIiwidGV4dENvbG9yIiwibGFiZWxDb2xvciIsIkxheWVyR3JvdXBTZWxlY3RvckZhY3RvcnkiLCJkZXBzIiwiUGFuZWxIZWFkZXJBY3Rpb25GYWN0b3J5IiwiUGFuZWxIZWFkZXJBY3Rpb24iLCJkZWZhdWx0QWN0aW9uSWNvbnMiLCJ2aXNpYmxlIiwiRXllU2VlbiIsImhpZGRlbiIsIkV5ZVVuc2VlbiIsIkxheWVyR3JvdXBTZWxlY3RvciIsImxheWVycyIsImVkaXRhYmxlTGF5ZXJzIiwib25DaGFuZ2UiLCJ0b3BMYXllcnMiLCJhY3Rpb25JY29ucyIsIm1hcCIsInNsdWciLCJ2aXNpYmxlTGF5ZXJHcm91cHMiLCJVcGxvYWQiLCJ0b3BMYXllckdyb3VwcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFPQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNQSxzQkFBc0IsR0FBR0MsNkJBQU9DLEdBQVYsaUhBQTVCOztBQUlBLElBQU1DLG9CQUFvQixHQUFHRiw2QkFBT0MsR0FBViw0UkFBMUI7O0FBY0EsSUFBTUUsVUFBVSxHQUFHLGtDQUFPQyxpQ0FBUCxDQUFILDJHQUNMLFVBQUFDLEtBQUs7QUFBQSxTQUFLQSxLQUFLLENBQUNDLE1BQU4sR0FBZUQsS0FBSyxDQUFDRSxLQUFOLENBQVlDLFNBQTNCLEdBQXVDSCxLQUFLLENBQUNFLEtBQU4sQ0FBWUUsVUFBeEQ7QUFBQSxDQURBLENBQWhCO0FBSUFDLHlCQUF5QixDQUFDQyxJQUExQixH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b2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgUGFuZWxIZWFkZXJBY3Rpb25GYWN0b3J5IGZyb20gJ2NvbXBvbmVudHMvc2lkZS1wYW5lbC9wYW5lbC1oZWFkZXItYWN0aW9uJztcbmltcG9ydCB7RXllU2VlbiwgRXllVW5zZWVuLCBVcGxvYWR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcblxuaW1wb3J0IHtcbiAgUGFuZWxMYWJlbCxcbiAgUGFuZWxDb250ZW50LFxuICBQYW5lbExhYmVsQm9sZCxcbiAgUGFuZWxMYWJlbFdyYXBwZXIsXG4gIENlbnRlckZsZXhib3hcbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuaW1wb3J0IHtjYW1lbGl6ZX0gZnJvbSAndXRpbHMvdXRpbHMnO1xuXG5jb25zdCBTdHlsZWRJbnRlcmFjdGlvblBhbmVsID0gc3R5bGVkLmRpdmBcbiAgcGFkZGluZy1ib3R0b206IDEycHg7XG5gO1xuXG5jb25zdCBTdHlsZWRMYXllckdyb3VwSXRlbSA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcblxuICAmOmxhc3QtY2hpbGQge1xuICAgIG1hcmdpbi1ib3R0b206IDA7XG4gIH1cblxuICAubGF5ZXItZ3JvdXBfX3Zpc2liaWxpdHktdG9nZ2xlIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDEycHg7XG4gIH1cbmA7XG5cbmNvbnN0IExheWVyTGFiZWwgPSBzdHlsZWQoUGFuZWxMYWJlbEJvbGQpYFxuICBjb2xvcjogJHtwcm9wcyA9PiAocHJvcHMuYWN0aXZlID8gcHJvcHMudGhlbWUudGV4dENvbG9yIDogcHJvcHMudGhlbWUubGFiZWxDb2xvcil9O1xuYDtcblxuTGF5ZXJHcm91cFNlbGVjdG9yRmFjdG9yeS5kZXBzID0gW1BhbmVsSGVhZGVyQWN0aW9uRmFjdG9yeV07XG5cbmZ1bmN0aW9uIExheWVyR3JvdXBTZWxlY3RvckZhY3RvcnkoUGFuZWxIZWFkZXJBY3Rpb24pIHtcbiAgY29uc3QgZGVmYXVsdEFjdGlvbkljb25zID0ge1xuICAgIHZpc2libGU6IEV5ZVNlZW4sXG4gICAgaGlkZGVuOiBFeWVVbnNlZW5cbiAgfTtcbiAgY29uc3QgTGF5ZXJHcm91cFNlbGVjdG9yID0gKHtcbiAgICBsYXllcnMsXG4gICAgZWRpdGFibGVMYXllcnMsXG4gICAgb25DaGFuZ2UsXG4gICAgdG9wTGF5ZXJzLFxuICAgIGFjdGlvbkljb25zID0gZGVmYXVsdEFjdGlvbkljb25zXG4gIH0pID0+IChcbiAgICA8U3R5bGVkSW50ZXJhY3Rpb25QYW5lbCBjbGFzc05hbWU9XCJtYXAtc3R5bGVfX2xheWVyLWdyb3VwX19zZWxlY3RvclwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYXllci1ncm91cF9faGVhZGVyXCI+XG4gICAgICAgIDxQYW5lbExhYmVsPlxuICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbWFwTGF5ZXJzLnRpdGxlJ30gLz5cbiAgICAgICAgPC9QYW5lbExhYmVsPlxuICAgICAgPC9kaXY+XG4gICAgICA8UGFuZWxDb250ZW50IGNsYXNzTmFtZT1cIm1hcC1zdHlsZV9fbGF5ZXItZ3JvdXBcIj5cbiAgICAgICAge2VkaXRhYmxlTGF5ZXJzLm1hcChzbHVnID0+IChcbiAgICAgICAgICA8U3R5bGVkTGF5ZXJHcm91cEl0ZW0gY2xhc3NOYW1lPVwibGF5ZXItZ3JvdXBfX3NlbGVjdFwiIGtleT17c2x1Z30+XG4gICAgICAgICAgICA8UGFuZWxMYWJlbFdyYXBwZXI+XG4gICAgICAgICAgICAgIDxQYW5lbEhlYWRlckFjdGlvblxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxheWVyLWdyb3VwX192aXNpYmlsaXR5LXRvZ2dsZVwiXG4gICAgICAgICAgICAgICAgaWQ9e2Ake3NsdWd9LXRvZ2dsZWB9XG4gICAgICAgICAgICAgICAgdG9vbHRpcD17bGF5ZXJzW3NsdWddID8gJ3Rvb2x0aXAuaGlkZScgOiAndG9vbHRpcC5zaG93J31cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PlxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2Uoe1xuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlTGF5ZXJHcm91cHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAuLi5sYXllcnMsXG4gICAgICAgICAgICAgICAgICAgICAgW3NsdWddOiAhbGF5ZXJzW3NsdWddXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEljb25Db21wb25lbnQ9e2xheWVyc1tzbHVnXSA/IGFjdGlvbkljb25zLnZpc2libGUgOiBhY3Rpb25JY29ucy5oaWRkZW59XG4gICAgICAgICAgICAgICAgYWN0aXZlPXtsYXllcnNbc2x1Z119XG4gICAgICAgICAgICAgICAgZmx1c2hcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPExheWVyTGFiZWwgYWN0aXZlPXtsYXllcnNbc2x1Z119PlxuICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXtgbWFwTGF5ZXJzLiR7Y2FtZWxpemUoc2x1Zyl9YH0gLz5cbiAgICAgICAgICAgICAgPC9MYXllckxhYmVsPlxuICAgICAgICAgICAgPC9QYW5lbExhYmVsV3JhcHBlcj5cbiAgICAgICAgICAgIDxDZW50ZXJGbGV4Ym94IGNsYXNzTmFtZT1cImxheWVyLWdyb3VwX19icmluZy10b3BcIj5cbiAgICAgICAgICAgICAgPFBhbmVsSGVhZGVyQWN0aW9uXG4gICAgICAgICAgICAgICAgaWQ9e2Ake3NsdWd9LXRvcGB9XG4gICAgICAgICAgICAgICAgdG9vbHRpcD1cInRvb2x0aXAubW92ZVRvVG9wXCJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyc1tzbHVnXX1cbiAgICAgICAgICAgICAgICBJY29uQ29tcG9uZW50PXtVcGxvYWR9XG4gICAgICAgICAgICAgICAgYWN0aXZlPXt0b3BMYXllcnNbc2x1Z119XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlKHtcbiAgICAgICAgICAgICAgICAgICAgdG9wTGF5ZXJHcm91cHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAuLi50b3BMYXllcnMsXG4gICAgICAgICAgICAgICAgICAgICAgW3NsdWddOiAhdG9wTGF5ZXJzW3NsdWddXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9DZW50ZXJGbGV4Ym94PlxuICAgICAgICAgIDwvU3R5bGVkTGF5ZXJHcm91cEl0ZW0+XG4gICAgICAgICkpfVxuICAgICAgPC9QYW5lbENvbnRlbnQ+XG4gICAgPC9TdHlsZWRJbnRlcmFjdGlvblBhbmVsPlxuICApO1xuXG4gIHJldHVybiBMYXllckdyb3VwU2VsZWN0b3I7XG59XG5cbmV4cG9ydCBkZWZhdWx0IExheWVyR3JvdXBTZWxlY3RvckZhY3Rvcnk7XG4iXX0=