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

var _reactIntl = require("react-intl");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  height: 48px;\n  margin-bottom: 5px;\n  opacity: 1;\n  position: relative;\n  transition: opacity 0.05s ease-in, height 0.25s ease-out;\n\n  &.collapsed {\n    height: 0;\n    margin-bottom: 0;\n    opacity: 0;\n  }\n\n  :hover {\n    cursor: pointer;\n    background-color: ", ";\n  }\n\n  .map-title-block img {\n    margin-right: 12px;\n  }\n\n  .map-preview {\n    border-radius: 3px;\n    height: 30px;\n    width: 40px;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledMapDropdown = (0, _styledComponents["default"])(_styledComponents2.StyledPanelHeader)(_templateObject(), function (props) {
  return props.theme.panelBackgroundHover;
});

function MapStyleSelectorFactory() {
  var MapStyleSelector = function MapStyleSelector(_ref) {
    var mapStyle = _ref.mapStyle,
        onChange = _ref.onChange,
        toggleActive = _ref.toggleActive,
        isSelecting = _ref.isSelecting;
    return _react["default"].createElement("div", null, _react["default"].createElement(_styledComponents2.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'mapManager.mapStyle'
    })), Object.keys(mapStyle.mapStyles).map(function (op) {
      return _react["default"].createElement(StyledMapDropdown, {
        className: (0, _classnames["default"])('map-dropdown-option', {
          collapsed: !isSelecting && mapStyle.styleType !== op
        }),
        key: op,
        onClick: isSelecting ? function () {
          return onChange(op);
        } : toggleActive
      }, _react["default"].createElement(_styledComponents2.PanelHeaderContent, {
        className: "map-title-block"
      }, _react["default"].createElement("img", {
        className: "map-preview",
        src: mapStyle.mapStyles[op].icon
      }), _react["default"].createElement(_styledComponents2.PanelHeaderTitle, {
        className: "map-preview-name"
      }, mapStyle.mapStyles[op].label)), !isSelecting ? _react["default"].createElement(_panelHeaderAction["default"], {
        className: "map-dropdown-option__enable-config",
        id: "map-enable-config",
        IconComponent: _icons.ArrowDown,
        tooltip: 'tooltip.selectBaseMapStyle',
        onClick: toggleActive
      }) : null);
    }));
  };

  return MapStyleSelector;
}

var _default = MapStyleSelectorFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbWFwLXN0eWxlLXBhbmVsL21hcC1zdHlsZS1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJTdHlsZWRNYXBEcm9wZG93biIsIlN0eWxlZFBhbmVsSGVhZGVyIiwicHJvcHMiLCJ0aGVtZSIsInBhbmVsQmFja2dyb3VuZEhvdmVyIiwiTWFwU3R5bGVTZWxlY3RvckZhY3RvcnkiLCJNYXBTdHlsZVNlbGVjdG9yIiwibWFwU3R5bGUiLCJvbkNoYW5nZSIsInRvZ2dsZUFjdGl2ZSIsImlzU2VsZWN0aW5nIiwiT2JqZWN0Iiwia2V5cyIsIm1hcFN0eWxlcyIsIm1hcCIsIm9wIiwiY29sbGFwc2VkIiwic3R5bGVUeXBlIiwiaWNvbiIsImxhYmVsIiwiQXJyb3dEb3duIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFNQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsaUJBQWlCLEdBQUcsa0NBQU9DLG9DQUFQLENBQUgsb0JBZUMsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxvQkFBaEI7QUFBQSxDQWZOLENBQXZCOztBQTZCQSxTQUFTQyx1QkFBVCxHQUFtQztBQUNqQyxNQUFNQyxnQkFBZ0IsR0FBRyxTQUFuQkEsZ0JBQW1CO0FBQUEsUUFBRUMsUUFBRixRQUFFQSxRQUFGO0FBQUEsUUFBWUMsUUFBWixRQUFZQSxRQUFaO0FBQUEsUUFBc0JDLFlBQXRCLFFBQXNCQSxZQUF0QjtBQUFBLFFBQW9DQyxXQUFwQyxRQUFvQ0EsV0FBcEM7QUFBQSxXQUN2Qiw2Q0FDRSxnQ0FBQyw2QkFBRCxRQUNFLGdDQUFDLDJCQUFEO0FBQWtCLE1BQUEsRUFBRSxFQUFFO0FBQXRCLE1BREYsQ0FERixFQUlHQyxNQUFNLENBQUNDLElBQVAsQ0FBWUwsUUFBUSxDQUFDTSxTQUFyQixFQUFnQ0MsR0FBaEMsQ0FBb0MsVUFBQUMsRUFBRTtBQUFBLGFBQ3JDLGdDQUFDLGlCQUFEO0FBQ0UsUUFBQSxTQUFTLEVBQUUsNEJBQVcscUJBQVgsRUFBa0M7QUFDM0NDLFVBQUFBLFNBQVMsRUFBRSxDQUFDTixXQUFELElBQWdCSCxRQUFRLENBQUNVLFNBQVQsS0FBdUJGO0FBRFAsU0FBbEMsQ0FEYjtBQUlFLFFBQUEsR0FBRyxFQUFFQSxFQUpQO0FBS0UsUUFBQSxPQUFPLEVBQUVMLFdBQVcsR0FBRztBQUFBLGlCQUFNRixRQUFRLENBQUNPLEVBQUQsQ0FBZDtBQUFBLFNBQUgsR0FBd0JOO0FBTDlDLFNBT0UsZ0NBQUMscUNBQUQ7QUFBb0IsUUFBQSxTQUFTLEVBQUM7QUFBOUIsU0FDRTtBQUFLLFFBQUEsU0FBUyxFQUFDLGFBQWY7QUFBNkIsUUFBQSxHQUFHLEVBQUVGLFFBQVEsQ0FBQ00sU0FBVCxDQUFtQkUsRUFBbkIsRUFBdUJHO0FBQXpELFFBREYsRUFFRSxnQ0FBQyxtQ0FBRDtBQUFrQixRQUFBLFNBQVMsRUFBQztBQUE1QixTQUNHWCxRQUFRLENBQUNNLFNBQVQsQ0FBbUJFLEVBQW5CLEVBQXVCSSxLQUQxQixDQUZGLENBUEYsRUFhRyxDQUFDVCxXQUFELEdBQ0MsZ0NBQUMsNkJBQUQ7QUFDRSxRQUFBLFNBQVMsRUFBQyxvQ0FEWjtBQUVFLFFBQUEsRUFBRSxFQUFDLG1CQUZMO0FBR0UsUUFBQSxhQUFhLEVBQUVVLGdCQUhqQjtBQUlFLFFBQUEsT0FBTyxFQUFFLDRCQUpYO0FBS0UsUUFBQSxPQUFPLEVBQUVYO0FBTFgsUUFERCxHQVFHLElBckJOLENBRHFDO0FBQUEsS0FBdEMsQ0FKSCxDQUR1QjtBQUFBLEdBQXpCOztBQWlDQSxTQUFPSCxnQkFBUDtBQUNEOztlQUVjRCx1QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtBcnJvd0Rvd259IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBQYW5lbEhlYWRlckFjdGlvbiBmcm9tICdjb21wb25lbnRzL3NpZGUtcGFuZWwvcGFuZWwtaGVhZGVyLWFjdGlvbic7XG5cbmltcG9ydCB7XG4gIFBhbmVsSGVhZGVyQ29udGVudCxcbiAgUGFuZWxIZWFkZXJUaXRsZSxcbiAgUGFuZWxMYWJlbCxcbiAgU3R5bGVkUGFuZWxIZWFkZXJcbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdyZWFjdC1pbnRsJztcblxuY29uc3QgU3R5bGVkTWFwRHJvcGRvd24gPSBzdHlsZWQoU3R5bGVkUGFuZWxIZWFkZXIpYFxuICBoZWlnaHQ6IDQ4cHg7XG4gIG1hcmdpbi1ib3R0b206IDVweDtcbiAgb3BhY2l0eTogMTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMDVzIGVhc2UtaW4sIGhlaWdodCAwLjI1cyBlYXNlLW91dDtcblxuICAmLmNvbGxhcHNlZCB7XG4gICAgaGVpZ2h0OiAwO1xuICAgIG1hcmdpbi1ib3R0b206IDA7XG4gICAgb3BhY2l0eTogMDtcbiAgfVxuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kSG92ZXJ9O1xuICB9XG5cbiAgLm1hcC10aXRsZS1ibG9jayBpbWcge1xuICAgIG1hcmdpbi1yaWdodDogMTJweDtcbiAgfVxuXG4gIC5tYXAtcHJldmlldyB7XG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgIGhlaWdodDogMzBweDtcbiAgICB3aWR0aDogNDBweDtcbiAgfVxuYDtcblxuZnVuY3Rpb24gTWFwU3R5bGVTZWxlY3RvckZhY3RvcnkoKSB7XG4gIGNvbnN0IE1hcFN0eWxlU2VsZWN0b3IgPSAoe21hcFN0eWxlLCBvbkNoYW5nZSwgdG9nZ2xlQWN0aXZlLCBpc1NlbGVjdGluZ30pID0+IChcbiAgICA8ZGl2PlxuICAgICAgPFBhbmVsTGFiZWw+XG4gICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbWFwTWFuYWdlci5tYXBTdHlsZSd9IC8+XG4gICAgICA8L1BhbmVsTGFiZWw+XG4gICAgICB7T2JqZWN0LmtleXMobWFwU3R5bGUubWFwU3R5bGVzKS5tYXAob3AgPT4gKFxuICAgICAgICA8U3R5bGVkTWFwRHJvcGRvd25cbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ21hcC1kcm9wZG93bi1vcHRpb24nLCB7XG4gICAgICAgICAgICBjb2xsYXBzZWQ6ICFpc1NlbGVjdGluZyAmJiBtYXBTdHlsZS5zdHlsZVR5cGUgIT09IG9wXG4gICAgICAgICAgfSl9XG4gICAgICAgICAga2V5PXtvcH1cbiAgICAgICAgICBvbkNsaWNrPXtpc1NlbGVjdGluZyA/ICgpID0+IG9uQ2hhbmdlKG9wKSA6IHRvZ2dsZUFjdGl2ZX1cbiAgICAgICAgPlxuICAgICAgICAgIDxQYW5lbEhlYWRlckNvbnRlbnQgY2xhc3NOYW1lPVwibWFwLXRpdGxlLWJsb2NrXCI+XG4gICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cIm1hcC1wcmV2aWV3XCIgc3JjPXttYXBTdHlsZS5tYXBTdHlsZXNbb3BdLmljb259IC8+XG4gICAgICAgICAgICA8UGFuZWxIZWFkZXJUaXRsZSBjbGFzc05hbWU9XCJtYXAtcHJldmlldy1uYW1lXCI+XG4gICAgICAgICAgICAgIHttYXBTdHlsZS5tYXBTdHlsZXNbb3BdLmxhYmVsfVxuICAgICAgICAgICAgPC9QYW5lbEhlYWRlclRpdGxlPlxuICAgICAgICAgIDwvUGFuZWxIZWFkZXJDb250ZW50PlxuICAgICAgICAgIHshaXNTZWxlY3RpbmcgPyAoXG4gICAgICAgICAgICA8UGFuZWxIZWFkZXJBY3Rpb25cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWFwLWRyb3Bkb3duLW9wdGlvbl9fZW5hYmxlLWNvbmZpZ1wiXG4gICAgICAgICAgICAgIGlkPVwibWFwLWVuYWJsZS1jb25maWdcIlxuICAgICAgICAgICAgICBJY29uQ29tcG9uZW50PXtBcnJvd0Rvd259XG4gICAgICAgICAgICAgIHRvb2x0aXA9eyd0b29sdGlwLnNlbGVjdEJhc2VNYXBTdHlsZSd9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RvZ2dsZUFjdGl2ZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvU3R5bGVkTWFwRHJvcGRvd24+XG4gICAgICApKX1cbiAgICA8L2Rpdj5cbiAgKTtcblxuICByZXR1cm4gTWFwU3R5bGVTZWxlY3Rvcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwU3R5bGVTZWxlY3RvckZhY3Rvcnk7XG4iXX0=