"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _classnames = _interopRequireDefault(require("classnames"));

var _icons = require("../../common/icons");

var _panelHeaderAction = _interopRequireDefault(require("../panel-header-action"));

var _styledComponents2 = require("../../common/styled-components");

var _localization = require("../../../localization");

var _templateObject;

var StyledMapDropdown = (0, _styledComponents["default"])(_styledComponents2.StyledPanelHeader)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  height: 48px;\n  margin-bottom: 5px;\n  opacity: 1;\n  position: relative;\n  transition: opacity 0.05s ease-in, height 0.25s ease-out;\n\n  &.collapsed {\n    height: 0;\n    margin-bottom: 0;\n    opacity: 0;\n  }\n\n  :hover {\n    cursor: pointer;\n    background-color: ", ";\n  }\n\n  .map-title-block img {\n    margin-right: 12px;\n  }\n\n  .map-preview {\n    border-radius: 3px;\n    height: 30px;\n    width: 40px;\n  }\n"])), function (props) {
  return props.theme.panelBackgroundHover;
});
MapStyleSelectorFactory.deps = [_panelHeaderAction["default"]];

function MapStyleSelectorFactory(PanelHeaderAction) {
  var defaultActionIcons = {
    arrowDown: _icons.ArrowDown
  };

  var MapStyleSelector = function MapStyleSelector(_ref) {
    var mapStyle = _ref.mapStyle,
        onChange = _ref.onChange,
        toggleActive = _ref.toggleActive,
        isSelecting = _ref.isSelecting,
        _ref$actionIcons = _ref.actionIcons,
        actionIcons = _ref$actionIcons === void 0 ? defaultActionIcons : _ref$actionIcons;
    return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.PanelLabel, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'mapManager.mapStyle'
    })), Object.keys(mapStyle.mapStyles).map(function (op) {
      return /*#__PURE__*/_react["default"].createElement(StyledMapDropdown, {
        className: (0, _classnames["default"])('map-dropdown-option', {
          collapsed: !isSelecting && mapStyle.styleType !== op
        }),
        key: op,
        onClick: isSelecting ? function () {
          return onChange(op);
        } : toggleActive
      }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.PanelHeaderContent, {
        className: "map-title-block"
      }, /*#__PURE__*/_react["default"].createElement("img", {
        className: "map-preview",
        src: mapStyle.mapStyles[op].icon
      }), /*#__PURE__*/_react["default"].createElement(_styledComponents2.PanelHeaderTitle, {
        className: "map-preview-name"
      }, mapStyle.mapStyles[op].label)), !isSelecting ? /*#__PURE__*/_react["default"].createElement(PanelHeaderAction, {
        className: "map-dropdown-option__enable-config",
        id: "map-enable-config",
        IconComponent: actionIcons.arrowDown,
        tooltip: 'tooltip.selectBaseMapStyle',
        onClick: toggleActive
      }) : null);
    }));
  };

  return MapStyleSelector;
}

var _default = MapStyleSelectorFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbWFwLXN0eWxlLXBhbmVsL21hcC1zdHlsZS1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJTdHlsZWRNYXBEcm9wZG93biIsIlN0eWxlZFBhbmVsSGVhZGVyIiwicHJvcHMiLCJ0aGVtZSIsInBhbmVsQmFja2dyb3VuZEhvdmVyIiwiTWFwU3R5bGVTZWxlY3RvckZhY3RvcnkiLCJkZXBzIiwiUGFuZWxIZWFkZXJBY3Rpb25GYWN0b3J5IiwiUGFuZWxIZWFkZXJBY3Rpb24iLCJkZWZhdWx0QWN0aW9uSWNvbnMiLCJhcnJvd0Rvd24iLCJBcnJvd0Rvd24iLCJNYXBTdHlsZVNlbGVjdG9yIiwibWFwU3R5bGUiLCJvbkNoYW5nZSIsInRvZ2dsZUFjdGl2ZSIsImlzU2VsZWN0aW5nIiwiYWN0aW9uSWNvbnMiLCJPYmplY3QiLCJrZXlzIiwibWFwU3R5bGVzIiwibWFwIiwib3AiLCJjb2xsYXBzZWQiLCJzdHlsZVR5cGUiLCJpY29uIiwibGFiZWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQU1BOzs7O0FBRUEsSUFBTUEsaUJBQWlCLEdBQUcsa0NBQU9DLG9DQUFQLENBQUgsMmdCQWVDLFVBQUFDLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNDLEtBQU4sQ0FBWUMsb0JBQWhCO0FBQUEsQ0FmTixDQUF2QjtBQTRCQUMsdUJBQXVCLENBQUNDLElBQXhCLEdBQStCLENBQUNDLDZCQUFELENBQS9COztBQUVBLFNBQVNGLHVCQUFULENBQWlDRyxpQkFBakMsRUFBb0Q7QUFDbEQsTUFBTUMsa0JBQWtCLEdBQUc7QUFDekJDLElBQUFBLFNBQVMsRUFBRUM7QUFEYyxHQUEzQjs7QUFHQSxNQUFNQyxnQkFBZ0IsR0FBRyxTQUFuQkEsZ0JBQW1CO0FBQUEsUUFDdkJDLFFBRHVCLFFBQ3ZCQSxRQUR1QjtBQUFBLFFBRXZCQyxRQUZ1QixRQUV2QkEsUUFGdUI7QUFBQSxRQUd2QkMsWUFIdUIsUUFHdkJBLFlBSHVCO0FBQUEsUUFJdkJDLFdBSnVCLFFBSXZCQSxXQUp1QjtBQUFBLGdDQUt2QkMsV0FMdUI7QUFBQSxRQUt2QkEsV0FMdUIsaUNBS1RSLGtCQUxTO0FBQUEsd0JBT3ZCLDBEQUNFLGdDQUFDLDZCQUFELHFCQUNFLGdDQUFDLDhCQUFEO0FBQWtCLE1BQUEsRUFBRSxFQUFFO0FBQXRCLE1BREYsQ0FERixFQUlHUyxNQUFNLENBQUNDLElBQVAsQ0FBWU4sUUFBUSxDQUFDTyxTQUFyQixFQUFnQ0MsR0FBaEMsQ0FBb0MsVUFBQUMsRUFBRTtBQUFBLDBCQUNyQyxnQ0FBQyxpQkFBRDtBQUNFLFFBQUEsU0FBUyxFQUFFLDRCQUFXLHFCQUFYLEVBQWtDO0FBQzNDQyxVQUFBQSxTQUFTLEVBQUUsQ0FBQ1AsV0FBRCxJQUFnQkgsUUFBUSxDQUFDVyxTQUFULEtBQXVCRjtBQURQLFNBQWxDLENBRGI7QUFJRSxRQUFBLEdBQUcsRUFBRUEsRUFKUDtBQUtFLFFBQUEsT0FBTyxFQUFFTixXQUFXLEdBQUc7QUFBQSxpQkFBTUYsUUFBUSxDQUFDUSxFQUFELENBQWQ7QUFBQSxTQUFILEdBQXdCUDtBQUw5QyxzQkFPRSxnQ0FBQyxxQ0FBRDtBQUFvQixRQUFBLFNBQVMsRUFBQztBQUE5QixzQkFDRTtBQUFLLFFBQUEsU0FBUyxFQUFDLGFBQWY7QUFBNkIsUUFBQSxHQUFHLEVBQUVGLFFBQVEsQ0FBQ08sU0FBVCxDQUFtQkUsRUFBbkIsRUFBdUJHO0FBQXpELFFBREYsZUFFRSxnQ0FBQyxtQ0FBRDtBQUFrQixRQUFBLFNBQVMsRUFBQztBQUE1QixTQUNHWixRQUFRLENBQUNPLFNBQVQsQ0FBbUJFLEVBQW5CLEVBQXVCSSxLQUQxQixDQUZGLENBUEYsRUFhRyxDQUFDVixXQUFELGdCQUNDLGdDQUFDLGlCQUFEO0FBQ0UsUUFBQSxTQUFTLEVBQUMsb0NBRFo7QUFFRSxRQUFBLEVBQUUsRUFBQyxtQkFGTDtBQUdFLFFBQUEsYUFBYSxFQUFFQyxXQUFXLENBQUNQLFNBSDdCO0FBSUUsUUFBQSxPQUFPLEVBQUUsNEJBSlg7QUFLRSxRQUFBLE9BQU8sRUFBRUs7QUFMWCxRQURELEdBUUcsSUFyQk4sQ0FEcUM7QUFBQSxLQUF0QyxDQUpILENBUHVCO0FBQUEsR0FBekI7O0FBdUNBLFNBQU9ILGdCQUFQO0FBQ0Q7O2VBRWNQLHVCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge0Fycm93RG93bn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IFBhbmVsSGVhZGVyQWN0aW9uRmFjdG9yeSBmcm9tICdjb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLWFjdGlvbic7XG5cbmltcG9ydCB7XG4gIFBhbmVsSGVhZGVyQ29udGVudCxcbiAgUGFuZWxIZWFkZXJUaXRsZSxcbiAgUGFuZWxMYWJlbCxcbiAgU3R5bGVkUGFuZWxIZWFkZXJcbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuXG5jb25zdCBTdHlsZWRNYXBEcm9wZG93biA9IHN0eWxlZChTdHlsZWRQYW5lbEhlYWRlcilgXG4gIGhlaWdodDogNDhweDtcbiAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICBvcGFjaXR5OiAxO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMC4wNXMgZWFzZS1pbiwgaGVpZ2h0IDAuMjVzIGVhc2Utb3V0O1xuXG4gICYuY29sbGFwc2VkIHtcbiAgICBoZWlnaHQ6IDA7XG4gICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmRIb3Zlcn07XG4gIH1cblxuICAubWFwLXRpdGxlLWJsb2NrIGltZyB7XG4gICAgbWFyZ2luLXJpZ2h0OiAxMnB4O1xuICB9XG5cbiAgLm1hcC1wcmV2aWV3IHtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgaGVpZ2h0OiAzMHB4O1xuICAgIHdpZHRoOiA0MHB4O1xuICB9XG5gO1xuTWFwU3R5bGVTZWxlY3RvckZhY3RvcnkuZGVwcyA9IFtQYW5lbEhlYWRlckFjdGlvbkZhY3RvcnldO1xuXG5mdW5jdGlvbiBNYXBTdHlsZVNlbGVjdG9yRmFjdG9yeShQYW5lbEhlYWRlckFjdGlvbikge1xuICBjb25zdCBkZWZhdWx0QWN0aW9uSWNvbnMgPSB7XG4gICAgYXJyb3dEb3duOiBBcnJvd0Rvd25cbiAgfTtcbiAgY29uc3QgTWFwU3R5bGVTZWxlY3RvciA9ICh7XG4gICAgbWFwU3R5bGUsXG4gICAgb25DaGFuZ2UsXG4gICAgdG9nZ2xlQWN0aXZlLFxuICAgIGlzU2VsZWN0aW5nLFxuICAgIGFjdGlvbkljb25zID0gZGVmYXVsdEFjdGlvbkljb25zXG4gIH0pID0+IChcbiAgICA8ZGl2PlxuICAgICAgPFBhbmVsTGFiZWw+XG4gICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbWFwTWFuYWdlci5tYXBTdHlsZSd9IC8+XG4gICAgICA8L1BhbmVsTGFiZWw+XG4gICAgICB7T2JqZWN0LmtleXMobWFwU3R5bGUubWFwU3R5bGVzKS5tYXAob3AgPT4gKFxuICAgICAgICA8U3R5bGVkTWFwRHJvcGRvd25cbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ21hcC1kcm9wZG93bi1vcHRpb24nLCB7XG4gICAgICAgICAgICBjb2xsYXBzZWQ6ICFpc1NlbGVjdGluZyAmJiBtYXBTdHlsZS5zdHlsZVR5cGUgIT09IG9wXG4gICAgICAgICAgfSl9XG4gICAgICAgICAga2V5PXtvcH1cbiAgICAgICAgICBvbkNsaWNrPXtpc1NlbGVjdGluZyA/ICgpID0+IG9uQ2hhbmdlKG9wKSA6IHRvZ2dsZUFjdGl2ZX1cbiAgICAgICAgPlxuICAgICAgICAgIDxQYW5lbEhlYWRlckNvbnRlbnQgY2xhc3NOYW1lPVwibWFwLXRpdGxlLWJsb2NrXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cIm1hcC1wcmV2aWV3XCIgc3JjPXttYXBTdHlsZS5tYXBTdHlsZXNbb3BdLmljb259IC8+XG4gICAgICAgICAgICA8UGFuZWxIZWFkZXJUaXRsZSBjbGFzc05hbWU9XCJtYXAtcHJldmlldy1uYW1lXCI+XG4gICAgICAgICAgICAgIHttYXBTdHlsZS5tYXBTdHlsZXNbb3BdLmxhYmVsfVxuICAgICAgICAgICAgPC9QYW5lbEhlYWRlclRpdGxlPlxuICAgICAgICAgIDwvUGFuZWxIZWFkZXJDb250ZW50PlxuICAgICAgICAgIHshaXNTZWxlY3RpbmcgPyAoXG4gICAgICAgICAgICA8UGFuZWxIZWFkZXJBY3Rpb25cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWFwLWRyb3Bkb3duLW9wdGlvbl9fZW5hYmxlLWNvbmZpZ1wiXG4gICAgICAgICAgICAgIGlkPVwibWFwLWVuYWJsZS1jb25maWdcIlxuICAgICAgICAgICAgICBJY29uQ29tcG9uZW50PXthY3Rpb25JY29ucy5hcnJvd0Rvd259XG4gICAgICAgICAgICAgIHRvb2x0aXA9eyd0b29sdGlwLnNlbGVjdEJhc2VNYXBTdHlsZSd9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RvZ2dsZUFjdGl2ZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvU3R5bGVkTWFwRHJvcGRvd24+XG4gICAgICApKX1cbiAgICA8L2Rpdj5cbiAgKTtcblxuICByZXR1cm4gTWFwU3R5bGVTZWxlY3Rvcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwU3R5bGVTZWxlY3RvckZhY3Rvcnk7XG4iXX0=