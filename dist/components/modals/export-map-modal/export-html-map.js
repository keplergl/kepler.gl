"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = require("../../common/styled-components");

var _components = require("./components");

var _defaultSettings = require("../../../constants/default-settings");

var _userGuides = require("../../../constants/user-guides");

var _styledComponents2 = _interopRequireDefault(require("styled-components"));

var _reactIntl = require("react-intl");

var _localization = require("../../../localization");

var _templateObject, _templateObject2, _templateObject3;

var ExportMapStyledExportSection = (0, _styledComponents2["default"])(_styledComponents.StyledExportSection)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  .disclaimer {\n    font-size: ", ";\n    color: ", ";\n    margin-top: 12px;\n  }\n"])), function (props) {
  return props.theme.inputFontSize;
}, function (props) {
  return props.theme.inputColor;
});

var StyledInput = _styledComponents2["default"].input(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  width: 100%;\n  padding: ", ";\n  color: ", ";\n  height: ", ";\n  outline: 0;\n  font-size: ", ";\n\n  :active,\n  :focus,\n  &.focus,\n  &.active {\n    outline: 0;\n  }\n"])), function (props) {
  return props.theme.inputPadding;
}, function (props) {
  return props.error ? 'red' : props.theme.titleColorLT;
}, function (props) {
  return props.theme.inputBoxHeight;
}, function (props) {
  return props.theme.inputFontSize;
});

var BigStyledTile = (0, _styledComponents2["default"])(_styledComponents.StyledType)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  height: unset;\n  width: unset;\n  img {\n    width: 180px;\n    height: 120px;\n  }\n"])));

function ExportHtmlMapFactory() {
  /** @type {typeof import('./export-html-map').ExportHtmlMap} */
  var ExportHtmlMap = function ExportHtmlMap(_ref) {
    var _ref$onChangeExportMa = _ref.onChangeExportMapHTMLMode,
        onChangeExportMapHTMLMode = _ref$onChangeExportMa === void 0 ? function (mode) {} : _ref$onChangeExportMa,
        _ref$onEditUserMapbox = _ref.onEditUserMapboxAccessToken,
        onEditUserMapboxAccessToken = _ref$onEditUserMapbox === void 0 ? function (token) {} : _ref$onEditUserMapbox,
        _ref$options = _ref.options,
        options = _ref$options === void 0 ? {} : _ref$options,
        intl = _ref.intl;
    return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_components.StyledExportMapSection, null, /*#__PURE__*/_react["default"].createElement("div", {
      className: "description"
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: "selection"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportMap.html.selection'
    }))), /*#__PURE__*/_react["default"].createElement(ExportMapStyledExportSection, {
      className: "export-map-modal__html-options"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "description"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "title"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportMap.html.tokenTitle'
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "subtitle"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportMap.html.tokenSubtitle'
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "selection"
    }, /*#__PURE__*/_react["default"].createElement(StyledInput, {
      onChange: function onChange(e) {
        return onEditUserMapboxAccessToken(e.target.value);
      },
      type: "text",
      placeholder: intl.formatMessage({
        id: 'modal.exportMap.html.tokenPlaceholder'
      }),
      value: options ? options.userMapboxToken : ''
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: "disclaimer"
    }, /*#__PURE__*/_react["default"].createElement(_components.StyledWarning, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportMap.html.tokenMisuseWarning'
    })), /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportMap.html.tokenDisclaimer'
    }), /*#__PURE__*/_react["default"].createElement(_components.ExportMapLink, {
      href: _userGuides.EXPORT_HTML_MAP_DOC
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportMap.html.tokenUpdate'
    }))))), /*#__PURE__*/_react["default"].createElement(ExportMapStyledExportSection, null, /*#__PURE__*/_react["default"].createElement("div", {
      className: "description"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "title"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportMap.html.modeTitle'
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "subtitle"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportMap.html.modeSubtitle1'
    }), /*#__PURE__*/_react["default"].createElement("a", {
      href: _userGuides.EXPORT_HTML_MAP_MODES_DOC
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportMap.html.modeSubtitle2'
    })))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "selection"
    }, _defaultSettings.EXPORT_HTML_MAP_MODE_OPTIONS.map(function (mode) {
      return /*#__PURE__*/_react["default"].createElement(BigStyledTile, {
        key: mode.id,
        selected: options.mode === mode.id,
        available: mode.available,
        onClick: function onClick() {
          return mode.available && onChangeExportMapHTMLMode(mode.id);
        }
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: mode.url,
        alt: ""
      }), /*#__PURE__*/_react["default"].createElement("p", null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
        id: 'modal.exportMap.html.modeDescription',
        values: {
          mode: intl.formatMessage({
            id: mode.label
          })
        }
      })), options.mode === mode.id && /*#__PURE__*/_react["default"].createElement(_styledComponents.CheckMark, null));
    }))));
  };

  ExportHtmlMap.displayName = 'ExportHtmlMap';
  return (0, _reactIntl.injectIntl)(ExportHtmlMap);
}

var _default = ExportHtmlMapFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9leHBvcnQtbWFwLW1vZGFsL2V4cG9ydC1odG1sLW1hcC5qcyJdLCJuYW1lcyI6WyJFeHBvcnRNYXBTdHlsZWRFeHBvcnRTZWN0aW9uIiwiU3R5bGVkRXhwb3J0U2VjdGlvbiIsInByb3BzIiwidGhlbWUiLCJpbnB1dEZvbnRTaXplIiwiaW5wdXRDb2xvciIsIlN0eWxlZElucHV0Iiwic3R5bGVkIiwiaW5wdXQiLCJpbnB1dFBhZGRpbmciLCJlcnJvciIsInRpdGxlQ29sb3JMVCIsImlucHV0Qm94SGVpZ2h0IiwiQmlnU3R5bGVkVGlsZSIsIlN0eWxlZFR5cGUiLCJFeHBvcnRIdG1sTWFwRmFjdG9yeSIsIkV4cG9ydEh0bWxNYXAiLCJvbkNoYW5nZUV4cG9ydE1hcEhUTUxNb2RlIiwibW9kZSIsIm9uRWRpdFVzZXJNYXBib3hBY2Nlc3NUb2tlbiIsInRva2VuIiwib3B0aW9ucyIsImludGwiLCJlIiwidGFyZ2V0IiwidmFsdWUiLCJmb3JtYXRNZXNzYWdlIiwiaWQiLCJ1c2VyTWFwYm94VG9rZW4iLCJFWFBPUlRfSFRNTF9NQVBfRE9DIiwiRVhQT1JUX0hUTUxfTUFQX01PREVTX0RPQyIsIkVYUE9SVF9IVE1MX01BUF9NT0RFX09QVElPTlMiLCJtYXAiLCJhdmFpbGFibGUiLCJ1cmwiLCJsYWJlbCIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLDRCQUE0QixHQUFHLG1DQUFPQyxxQ0FBUCxDQUFILDhLQUVqQixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLGFBQWhCO0FBQUEsQ0FGWSxFQUdyQixVQUFBRixLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlFLFVBQWhCO0FBQUEsQ0FIZ0IsQ0FBbEM7O0FBUUEsSUFB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QTRCLGVBQTVCO0FBRUEsU0FBTywyQkFBV3BCLGFBQVgsQ0FBUDtBQUNEOztlQUVjRCxvQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1N0eWxlZEV4cG9ydFNlY3Rpb24sIFN0eWxlZFR5cGUsIENoZWNrTWFya30gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtTdHlsZWRFeHBvcnRNYXBTZWN0aW9uLCBTdHlsZWRXYXJuaW5nLCBFeHBvcnRNYXBMaW5rfSBmcm9tICcuL2NvbXBvbmVudHMnO1xuaW1wb3J0IHtFWFBPUlRfSFRNTF9NQVBfTU9ERV9PUFRJT05TfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge0VYUE9SVF9IVE1MX01BUF9ET0MsIEVYUE9SVF9IVE1MX01BUF9NT0RFU19ET0N9IGZyb20gJ2NvbnN0YW50cy91c2VyLWd1aWRlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7aW5qZWN0SW50bH0gZnJvbSAncmVhY3QtaW50bCc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ2xvY2FsaXphdGlvbic7XG5cbmNvbnN0IEV4cG9ydE1hcFN0eWxlZEV4cG9ydFNlY3Rpb24gPSBzdHlsZWQoU3R5bGVkRXhwb3J0U2VjdGlvbilgXG4gIC5kaXNjbGFpbWVyIHtcbiAgICBmb250LXNpemU6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRGb250U2l6ZX07XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRDb2xvcn07XG4gICAgbWFyZ2luLXRvcDogMTJweDtcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkSW5wdXQgPSBzdHlsZWQuaW5wdXRgXG4gIHdpZHRoOiAxMDAlO1xuICBwYWRkaW5nOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0UGFkZGluZ307XG4gIGNvbG9yOiAke3Byb3BzID0+IChwcm9wcy5lcnJvciA/ICdyZWQnIDogcHJvcHMudGhlbWUudGl0bGVDb2xvckxUKX07XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dEJveEhlaWdodH07XG4gIG91dGxpbmU6IDA7XG4gIGZvbnQtc2l6ZTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dEZvbnRTaXplfTtcblxuICA6YWN0aXZlLFxuICA6Zm9jdXMsXG4gICYuZm9jdXMsXG4gICYuYWN0aXZlIHtcbiAgICBvdXRsaW5lOiAwO1xuICB9XG5gO1xuXG5jb25zdCBCaWdTdHlsZWRUaWxlID0gc3R5bGVkKFN0eWxlZFR5cGUpYFxuICBoZWlnaHQ6IHVuc2V0O1xuICB3aWR0aDogdW5zZXQ7XG4gIGltZyB7XG4gICAgd2lkdGg6IDE4MHB4O1xuICAgIGhlaWdodDogMTIwcHg7XG4gIH1cbmA7XG5cbmZ1bmN0aW9uIEV4cG9ydEh0bWxNYXBGYWN0b3J5KCkge1xuICAvKiogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZXhwb3J0LWh0bWwtbWFwJykuRXhwb3J0SHRtbE1hcH0gKi9cbiAgY29uc3QgRXhwb3J0SHRtbE1hcCA9ICh7XG4gICAgb25DaGFuZ2VFeHBvcnRNYXBIVE1MTW9kZSA9IG1vZGUgPT4ge30sXG4gICAgb25FZGl0VXNlck1hcGJveEFjY2Vzc1Rva2VuID0gdG9rZW4gPT4ge30sXG4gICAgb3B0aW9ucyA9IHt9LFxuICAgIGludGxcbiAgfSkgPT4gKFxuICAgIDxkaXY+XG4gICAgICA8U3R5bGVkRXhwb3J0TWFwU2VjdGlvbj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VsZWN0aW9uXCI+XG4gICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRNYXAuaHRtbC5zZWxlY3Rpb24nfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvU3R5bGVkRXhwb3J0TWFwU2VjdGlvbj5cbiAgICAgIDxFeHBvcnRNYXBTdHlsZWRFeHBvcnRTZWN0aW9uIGNsYXNzTmFtZT1cImV4cG9ydC1tYXAtbW9kYWxfX2h0bWwtb3B0aW9uc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPlxuICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRNYXAuaHRtbC50b2tlblRpdGxlJ30gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1YnRpdGxlXCI+XG4gICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydE1hcC5odG1sLnRva2VuU3VidGl0bGUnfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Rpb25cIj5cbiAgICAgICAgICA8U3R5bGVkSW5wdXRcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IG9uRWRpdFVzZXJNYXBib3hBY2Nlc3NUb2tlbihlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17aW50bC5mb3JtYXRNZXNzYWdlKHtpZDogJ21vZGFsLmV4cG9ydE1hcC5odG1sLnRva2VuUGxhY2Vob2xkZXInfSl9XG4gICAgICAgICAgICB2YWx1ZT17b3B0aW9ucyA/IG9wdGlvbnMudXNlck1hcGJveFRva2VuIDogJyd9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpc2NsYWltZXJcIj5cbiAgICAgICAgICAgIDxTdHlsZWRXYXJuaW5nPlxuICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydE1hcC5odG1sLnRva2VuTWlzdXNlV2FybmluZyd9IC8+XG4gICAgICAgICAgICA8L1N0eWxlZFdhcm5pbmc+XG4gICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydE1hcC5odG1sLnRva2VuRGlzY2xhaW1lcid9IC8+XG4gICAgICAgICAgICA8RXhwb3J0TWFwTGluayBocmVmPXtFWFBPUlRfSFRNTF9NQVBfRE9DfT5cbiAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRNYXAuaHRtbC50b2tlblVwZGF0ZSd9IC8+XG4gICAgICAgICAgICA8L0V4cG9ydE1hcExpbms+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9FeHBvcnRNYXBTdHlsZWRFeHBvcnRTZWN0aW9uPlxuICAgICAgPEV4cG9ydE1hcFN0eWxlZEV4cG9ydFNlY3Rpb24+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydE1hcC5odG1sLm1vZGVUaXRsZSd9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWJ0aXRsZVwiPlxuICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRNYXAuaHRtbC5tb2RlU3VidGl0bGUxJ30gLz5cbiAgICAgICAgICAgIDxhIGhyZWY9e0VYUE9SVF9IVE1MX01BUF9NT0RFU19ET0N9PlxuICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydE1hcC5odG1sLm1vZGVTdWJ0aXRsZTInfSAvPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Rpb25cIj5cbiAgICAgICAgICB7RVhQT1JUX0hUTUxfTUFQX01PREVfT1BUSU9OUy5tYXAobW9kZSA9PiAoXG4gICAgICAgICAgICA8QmlnU3R5bGVkVGlsZVxuICAgICAgICAgICAgICBrZXk9e21vZGUuaWR9XG4gICAgICAgICAgICAgIHNlbGVjdGVkPXtvcHRpb25zLm1vZGUgPT09IG1vZGUuaWR9XG4gICAgICAgICAgICAgIGF2YWlsYWJsZT17bW9kZS5hdmFpbGFibGV9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG1vZGUuYXZhaWxhYmxlICYmIG9uQ2hhbmdlRXhwb3J0TWFwSFRNTE1vZGUobW9kZS5pZCl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXttb2RlLnVybH0gYWx0PVwiXCIgLz5cbiAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgIGlkPXsnbW9kYWwuZXhwb3J0TWFwLmh0bWwubW9kZURlc2NyaXB0aW9uJ31cbiAgICAgICAgICAgICAgICAgIHZhbHVlcz17e21vZGU6IGludGwuZm9ybWF0TWVzc2FnZSh7aWQ6IG1vZGUubGFiZWx9KX19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICB7b3B0aW9ucy5tb2RlID09PSBtb2RlLmlkICYmIDxDaGVja01hcmsgLz59XG4gICAgICAgICAgICA8L0JpZ1N0eWxlZFRpbGU+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9FeHBvcnRNYXBTdHlsZWRFeHBvcnRTZWN0aW9uPlxuICAgIDwvZGl2PlxuICApO1xuXG4gIEV4cG9ydEh0bWxNYXAuZGlzcGxheU5hbWUgPSAnRXhwb3J0SHRtbE1hcCc7XG5cbiAgcmV0dXJuIGluamVjdEludGwoRXhwb3J0SHRtbE1hcCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV4cG9ydEh0bWxNYXBGYWN0b3J5O1xuIl19