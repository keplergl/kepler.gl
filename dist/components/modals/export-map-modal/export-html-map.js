"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = require("../../common/styled-components");

var _components = require("./components");

var _defaultSettings = require("../../../constants/default-settings");

var _userGuides = require("../../../constants/user-guides");

var _styledComponents2 = _interopRequireDefault(require("styled-components"));

var _reactIntl = require("react-intl");

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  height: unset;\n  width: unset;\n  img {\n    width: 180px;\n    height: 120px;\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  width: 100%;\n  padding: ", ";\n  color: ", ";\n  height: ", ";\n  outline: 0;\n  font-size: ", ";\n\n  :active,\n  :focus,\n  &.focus,\n  &.active {\n    outline: 0;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  .disclaimer {\n    font-size: ", ";\n    color: ", ";\n    margin-top: 12px;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var NO_OP = function NO_OP() {};

var ExportMapStyledExportSection = (0, _styledComponents2["default"])(_styledComponents.StyledExportSection)(_templateObject(), function (props) {
  return props.theme.inputFontSize;
}, function (props) {
  return props.theme.inputColor;
});

var StyledInput = _styledComponents2["default"].input(_templateObject2(), function (props) {
  return props.theme.inputPadding;
}, function (props) {
  return props.error ? 'red' : props.theme.titleColorLT;
}, function (props) {
  return props.theme.inputBoxHeight;
}, function (props) {
  return props.theme.inputFontSize;
});

var BigStyledTile = (0, _styledComponents2["default"])(_styledComponents.StyledType)(_templateObject3());
var exportHtmlPropTypes = {
  options: _propTypes["default"].object,
  onEditUserMapboxAccessToken: _propTypes["default"].func.isRequired
};

var ExportHtmlMap = _react["default"].memo(function (_ref) {
  var _ref$onChangeExportMa = _ref.onChangeExportMapHTMLMode,
      onChangeExportMapHTMLMode = _ref$onChangeExportMa === void 0 ? NO_OP : _ref$onChangeExportMa,
      _ref$onEditUserMapbox = _ref.onEditUserMapboxAccessToken,
      onEditUserMapboxAccessToken = _ref$onEditUserMapbox === void 0 ? NO_OP : _ref$onEditUserMapbox,
      _ref$options = _ref.options,
      options = _ref$options === void 0 ? {} : _ref$options,
      intl = _ref.intl;
  return _react["default"].createElement("div", null, _react["default"].createElement(_components.StyledExportMapSection, null, _react["default"].createElement("div", {
    className: "description"
  }), _react["default"].createElement("div", {
    className: "selection"
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.exportMap.html.selection'
  }))), _react["default"].createElement(ExportMapStyledExportSection, {
    className: "export-map-modal__html-options"
  }, _react["default"].createElement("div", {
    className: "description"
  }, _react["default"].createElement("div", {
    className: "title"
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.exportMap.html.tokenTitle'
  })), _react["default"].createElement("div", {
    className: "subtitle"
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.exportMap.html.tokenSubtitle'
  }))), _react["default"].createElement("div", {
    className: "selection"
  }, _react["default"].createElement(StyledInput, {
    onChange: function onChange(e) {
      return onEditUserMapboxAccessToken(e.target.value);
    },
    type: "text",
    placeholder: intl.formatMessage({
      id: 'modal.exportMap.html.tokenPlaceholder'
    }),
    value: options ? options.userMapboxToken : ''
  }), _react["default"].createElement("div", {
    className: "disclaimer"
  }, _react["default"].createElement(_components.StyledWarning, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.exportMap.html.tokenMisuseWarning'
  })), _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.exportMap.html.tokenDisclaimer'
  }), _react["default"].createElement(_components.ExportMapLink, {
    href: _userGuides.EXPORT_HTML_MAP_DOC
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.exportMap.html.tokenUpdate'
  }))))), _react["default"].createElement(ExportMapStyledExportSection, null, _react["default"].createElement("div", {
    className: "description"
  }, _react["default"].createElement("div", {
    className: "title"
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.exportMap.html.modeTitle'
  })), _react["default"].createElement("div", {
    className: "subtitle"
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.exportMap.html.modeSubtitle1'
  }), _react["default"].createElement("a", {
    href: _userGuides.EXPORT_HTML_MAP_MODES_DOC
  }, _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: 'modal.exportMap.html.modeSubtitle2'
  })))), _react["default"].createElement("div", {
    className: "selection"
  }, _defaultSettings.EXPORT_HTML_MAP_MODE_OPTIONS.map(function (mode) {
    return _react["default"].createElement(BigStyledTile, {
      key: mode.id,
      selected: options.mode === mode.id,
      available: mode.available,
      onClick: function onClick() {
        return mode.available && onChangeExportMapHTMLMode(mode.id);
      }
    }, _react["default"].createElement("img", {
      src: mode.url,
      alt: ""
    }), _react["default"].createElement("p", null, _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'modal.exportMap.html.modeDescription',
      values: {
        mode: intl.formatMessage({
          id: mode.label
        })
      }
    })));
  }))));
});

ExportHtmlMap.propTypes = exportHtmlPropTypes;
ExportHtmlMap.displayName = 'ExportHtmlMap';

var ExportHtmlMapFactory = function ExportHtmlMapFactory() {
  return (0, _reactIntl.injectIntl)(ExportHtmlMap);
};

var _default = ExportHtmlMapFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9leHBvcnQtbWFwLW1vZGFsL2V4cG9ydC1odG1sLW1hcC5qcyJdLCJuYW1lcyI6WyJOT19PUCIsIkV4cG9ydE1hcFN0eWxlZEV4cG9ydFNlY3Rpb24iLCJTdHlsZWRFeHBvcnRTZWN0aW9uIiwicHJvcHMiLCJ0aGVtZSIsImlucHV0Rm9udFNpemUiLCJpbnB1dENvbG9yIiwiU3R5bGVkSW5wdXQiLCJzdHlsZWQiLCJpbnB1dCIsImlucHV0UGFkZGluZyIsImVycm9yIiwidGl0bGVDb2xvckxUIiwiaW5wdXRCb3hIZWlnaHQiLCJCaWdTdHlsZWRUaWxlIiwiU3R5bGVkVHlwZSIsImV4cG9ydEh0bWxQcm9wVHlwZXMiLCJvcHRpb25zIiwiUHJvcFR5cGVzIiwib2JqZWN0Iiwib25FZGl0VXNlck1hcGJveEFjY2Vzc1Rva2VuIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJFeHBvcnRIdG1sTWFwIiwiUmVhY3QiLCJtZW1vIiwib25DaGFuZ2VFeHBvcnRNYXBIVE1MTW9kZSIsImludGwiLCJlIiwidGFyZ2V0IiwidmFsdWUiLCJmb3JtYXRNZXNzYWdlIiwiaWQiLCJ1c2VyTWFwYm94VG9rZW4iLCJFWFBPUlRfSFRNTF9NQVBfRE9DIiwiRVhQT1JUX0hUTUxfTUFQX01PREVTX0RPQyIsIkVYUE9SVF9IVE1MX01BUF9NT0RFX09QVElPTlMiLCJtYXAiLCJtb2RlIiwiYXZhaWxhYmxlIiwidXJsIiwibGFiZWwiLCJwcm9wVHlwZXMiLCJkaXNwbGF5TmFtZSIsIkV4cG9ydEh0bWxNYXBGYWN0b3J5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxLQUFLLEdBQUcsU0FBUkEsS0FBUSxHQUFNLENBQUUsQ0FBdEI7O0FBRUEsSUFBTUMsNEJBQTRCLEdBQUcs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RztBQUFWLFNBQW5CO0FBQVA7QUFGVixNQURGLENBUEYsQ0FEb0M7QUFBQSxHQUFyQyxDQURILENBWkYsQ0FsQ0YsQ0FORjtBQUFBLENBRG9CLENBQXRCOztBQTRFQWxCLGFBQWEsQ0FBQ21CLFNBQWQsR0FBMEIxQixtQkFBMUI7QUFFQU8sYUFBYSxDQUFDb0IsV0FBZCxHQUE0QixlQUE1Qjs7QUFFQSxJQUFNQyxvQkFBb0IsR0FBRyxTQUF2QkEsb0JBQXVCO0FBQUEsU0FBTSwyQkFBV3JCLGFBQVgsQ0FBTjtBQUFBLENBQTdCOztlQUVlcUIsb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7U3R5bGVkRXhwb3J0U2VjdGlvbiwgU3R5bGVkVHlwZX0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtTdHlsZWRFeHBvcnRNYXBTZWN0aW9uLCBTdHlsZWRXYXJuaW5nLCBFeHBvcnRNYXBMaW5rfSBmcm9tICcuL2NvbXBvbmVudHMnO1xuaW1wb3J0IHtFWFBPUlRfSFRNTF9NQVBfTU9ERV9PUFRJT05TfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge0VYUE9SVF9IVE1MX01BUF9ET0MsIEVYUE9SVF9IVE1MX01BUF9NT0RFU19ET0N9IGZyb20gJ2NvbnN0YW50cy91c2VyLWd1aWRlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZSwgaW5qZWN0SW50bH0gZnJvbSAncmVhY3QtaW50bCc7XG5cbmNvbnN0IE5PX09QID0gKCkgPT4ge307XG5cbmNvbnN0IEV4cG9ydE1hcFN0eWxlZEV4cG9ydFNlY3Rpb24gPSBzdHlsZWQoU3R5bGVkRXhwb3J0U2VjdGlvbilgXG4gIC5kaXNjbGFpbWVyIHtcbiAgICBmb250LXNpemU6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRGb250U2l6ZX07XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuaW5wdXRDb2xvcn07XG4gICAgbWFyZ2luLXRvcDogMTJweDtcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkSW5wdXQgPSBzdHlsZWQuaW5wdXRgXG4gIHdpZHRoOiAxMDAlO1xuICBwYWRkaW5nOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmlucHV0UGFkZGluZ307XG4gIGNvbG9yOiAke3Byb3BzID0+IChwcm9wcy5lcnJvciA/ICdyZWQnIDogcHJvcHMudGhlbWUudGl0bGVDb2xvckxUKX07XG4gIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dEJveEhlaWdodH07XG4gIG91dGxpbmU6IDA7XG4gIGZvbnQtc2l6ZTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5pbnB1dEZvbnRTaXplfTtcblxuICA6YWN0aXZlLFxuICA6Zm9jdXMsXG4gICYuZm9jdXMsXG4gICYuYWN0aXZlIHtcbiAgICBvdXRsaW5lOiAwO1xuICB9XG5gO1xuXG5jb25zdCBCaWdTdHlsZWRUaWxlID0gc3R5bGVkKFN0eWxlZFR5cGUpYFxuICBoZWlnaHQ6IHVuc2V0O1xuICB3aWR0aDogdW5zZXQ7XG4gIGltZyB7XG4gICAgd2lkdGg6IDE4MHB4O1xuICAgIGhlaWdodDogMTIwcHg7XG4gIH1cbmA7XG5cbmNvbnN0IGV4cG9ydEh0bWxQcm9wVHlwZXMgPSB7XG4gIG9wdGlvbnM6IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uRWRpdFVzZXJNYXBib3hBY2Nlc3NUb2tlbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTtcblxuY29uc3QgRXhwb3J0SHRtbE1hcCA9IFJlYWN0Lm1lbW8oXG4gICh7XG4gICAgb25DaGFuZ2VFeHBvcnRNYXBIVE1MTW9kZSA9IE5PX09QLFxuICAgIG9uRWRpdFVzZXJNYXBib3hBY2Nlc3NUb2tlbiA9IE5PX09QLFxuICAgIG9wdGlvbnMgPSB7fSxcbiAgICBpbnRsXG4gIH0pID0+IChcbiAgICA8ZGl2PlxuICAgICAgPFN0eWxlZEV4cG9ydE1hcFNlY3Rpb24+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIiAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdGlvblwiPlxuICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuZXhwb3J0TWFwLmh0bWwuc2VsZWN0aW9uJ30gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L1N0eWxlZEV4cG9ydE1hcFNlY3Rpb24+XG4gICAgICA8RXhwb3J0TWFwU3R5bGVkRXhwb3J0U2VjdGlvbiBjbGFzc05hbWU9XCJleHBvcnQtbWFwLW1vZGFsX19odG1sLW9wdGlvbnNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj5cbiAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuZXhwb3J0TWFwLmh0bWwudG9rZW5UaXRsZSd9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWJ0aXRsZVwiPlxuICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRNYXAuaHRtbC50b2tlblN1YnRpdGxlJ30gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VsZWN0aW9uXCI+XG4gICAgICAgICAgPFN0eWxlZElucHV0XG4gICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBvbkVkaXRVc2VyTWFwYm94QWNjZXNzVG9rZW4oZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e2ludGwuZm9ybWF0TWVzc2FnZSh7aWQ6ICdtb2RhbC5leHBvcnRNYXAuaHRtbC50b2tlblBsYWNlaG9sZGVyJ30pfVxuICAgICAgICAgICAgdmFsdWU9e29wdGlvbnMgPyBvcHRpb25zLnVzZXJNYXBib3hUb2tlbiA6ICcnfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaXNjbGFpbWVyXCI+XG4gICAgICAgICAgICA8U3R5bGVkV2FybmluZz5cbiAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRNYXAuaHRtbC50b2tlbk1pc3VzZVdhcm5pbmcnfSAvPlxuICAgICAgICAgICAgPC9TdHlsZWRXYXJuaW5nPlxuICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRNYXAuaHRtbC50b2tlbkRpc2NsYWltZXInfSAvPlxuICAgICAgICAgICAgPEV4cG9ydE1hcExpbmsgaHJlZj17RVhQT1JUX0hUTUxfTUFQX0RPQ30+XG4gICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuZXhwb3J0TWFwLmh0bWwudG9rZW5VcGRhdGUnfSAvPlxuICAgICAgICAgICAgPC9FeHBvcnRNYXBMaW5rPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRXhwb3J0TWFwU3R5bGVkRXhwb3J0U2VjdGlvbj5cbiAgICAgIDxFeHBvcnRNYXBTdHlsZWRFeHBvcnRTZWN0aW9uPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPlxuICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRNYXAuaHRtbC5tb2RlVGl0bGUnfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VidGl0bGVcIj5cbiAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuZXhwb3J0TWFwLmh0bWwubW9kZVN1YnRpdGxlMSd9IC8+XG4gICAgICAgICAgICA8YSBocmVmPXtFWFBPUlRfSFRNTF9NQVBfTU9ERVNfRE9DfT5cbiAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRNYXAuaHRtbC5tb2RlU3VidGl0bGUyJ30gLz5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VsZWN0aW9uXCI+XG4gICAgICAgICAge0VYUE9SVF9IVE1MX01BUF9NT0RFX09QVElPTlMubWFwKG1vZGUgPT4gKFxuICAgICAgICAgICAgPEJpZ1N0eWxlZFRpbGVcbiAgICAgICAgICAgICAga2V5PXttb2RlLmlkfVxuICAgICAgICAgICAgICBzZWxlY3RlZD17b3B0aW9ucy5tb2RlID09PSBtb2RlLmlkfVxuICAgICAgICAgICAgICBhdmFpbGFibGU9e21vZGUuYXZhaWxhYmxlfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBtb2RlLmF2YWlsYWJsZSAmJiBvbkNoYW5nZUV4cG9ydE1hcEhUTUxNb2RlKG1vZGUuaWQpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8aW1nIHNyYz17bW9kZS51cmx9IGFsdD1cIlwiIC8+XG4gICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlXG4gICAgICAgICAgICAgICAgICBpZD17J21vZGFsLmV4cG9ydE1hcC5odG1sLm1vZGVEZXNjcmlwdGlvbid9XG4gICAgICAgICAgICAgICAgICB2YWx1ZXM9e3ttb2RlOiBpbnRsLmZvcm1hdE1lc3NhZ2Uoe2lkOiBtb2RlLmxhYmVsfSl9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvQmlnU3R5bGVkVGlsZT5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0V4cG9ydE1hcFN0eWxlZEV4cG9ydFNlY3Rpb24+XG4gICAgPC9kaXY+XG4gIClcbik7XG5cbkV4cG9ydEh0bWxNYXAucHJvcFR5cGVzID0gZXhwb3J0SHRtbFByb3BUeXBlcztcblxuRXhwb3J0SHRtbE1hcC5kaXNwbGF5TmFtZSA9ICdFeHBvcnRIdG1sTWFwJztcblxuY29uc3QgRXhwb3J0SHRtbE1hcEZhY3RvcnkgPSAoKSA9PiBpbmplY3RJbnRsKEV4cG9ydEh0bWxNYXApO1xuXG5leHBvcnQgZGVmYXVsdCBFeHBvcnRIdG1sTWFwRmFjdG9yeTtcbiJdfQ==