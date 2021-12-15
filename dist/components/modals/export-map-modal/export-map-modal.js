"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _icons = require("../../common/icons");

var _styledComponents = require("../../common/styled-components");

var _defaultSettings = require("../../../constants/default-settings");

var _components = require("./components");

var _exportHtmlMap = _interopRequireDefault(require("./export-html-map"));

var _exportJsonMap = _interopRequireDefault(require("./export-json-map"));

var _localization = require("../../../localization");

// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var propTypes = {
  options: _propTypes["default"].object,
  onEditUserMapboxAccessToken: _propTypes["default"].func.isRequired,
  onChangeExportData: _propTypes["default"].func,
  onChangeExportMapType: _propTypes["default"].func,
  mapFormat: _propTypes["default"].string
};
var style = {
  width: '100%'
};

var NO_OP = function NO_OP() {};

ExportMapModalFactory.deps = [_exportHtmlMap["default"], _exportJsonMap["default"]];

function ExportMapModalFactory(ExportHtmlMap, ExportJsonMap) {
  var ExportMapModalUnmemoized = function ExportMapModalUnmemoized(_ref) {
    var _EXPORT_MAP_FORMATS$H;

    var _ref$config = _ref.config,
        config = _ref$config === void 0 ? {} : _ref$config,
        _ref$onChangeExportDa = _ref.onChangeExportData,
        onChangeExportData = _ref$onChangeExportDa === void 0 ? NO_OP : _ref$onChangeExportDa,
        _ref$onChangeExportMa = _ref.onChangeExportMapFormat,
        onChangeExportMapFormat = _ref$onChangeExportMa === void 0 ? function (format) {} : _ref$onChangeExportMa,
        _ref$onChangeExportMa2 = _ref.onChangeExportMapHTMLMode,
        onChangeExportMapHTMLMode = _ref$onChangeExportMa2 === void 0 ? NO_OP : _ref$onChangeExportMa2,
        _ref$onEditUserMapbox = _ref.onEditUserMapboxAccessToken,
        onEditUserMapboxAccessToken = _ref$onEditUserMapbox === void 0 ? NO_OP : _ref$onEditUserMapbox,
        _ref$options = _ref.options,
        options = _ref$options === void 0 ? {
      format: ''
    } : _ref$options;
    return /*#__PURE__*/_react["default"].createElement(_styledComponents.StyledModalContent, {
      className: "export-map-modal"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: style
    }, /*#__PURE__*/_react["default"].createElement(_components.StyledExportMapSection, null, /*#__PURE__*/_react["default"].createElement("div", {
      className: "description"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "title"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportMap.formatTitle'
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "subtitle"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportMap.formatSubtitle'
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "selection"
    }, _defaultSettings.EXPORT_MAP_FORMAT_OPTIONS.map(function (op) {
      return /*#__PURE__*/_react["default"].createElement(_styledComponents.StyledType, {
        key: op.id,
        selected: options.format === op.id,
        available: op.available,
        onClick: function onClick() {
          return op.available && onChangeExportMapFormat(op.id);
        }
      }, /*#__PURE__*/_react["default"].createElement(_icons.FileType, {
        ext: op.label,
        height: "80px",
        fontSize: "11px"
      }), options.format === op.id && /*#__PURE__*/_react["default"].createElement(_styledComponents.CheckMark, null));
    }))), (_EXPORT_MAP_FORMATS$H = {}, (0, _defineProperty2["default"])(_EXPORT_MAP_FORMATS$H, _defaultSettings.EXPORT_MAP_FORMATS.HTML, /*#__PURE__*/_react["default"].createElement(ExportHtmlMap, {
      onChangeExportMapHTMLMode: onChangeExportMapHTMLMode,
      onEditUserMapboxAccessToken: onEditUserMapboxAccessToken,
      options: options[options.format]
    })), (0, _defineProperty2["default"])(_EXPORT_MAP_FORMATS$H, _defaultSettings.EXPORT_MAP_FORMATS.JSON, /*#__PURE__*/_react["default"].createElement(ExportJsonMap, {
      config: config,
      onChangeExportData: onChangeExportData,
      options: options[options.format]
    })), _EXPORT_MAP_FORMATS$H)[// @ts-ignore
    options.format]));
  };

  ExportMapModalUnmemoized.propTypes = propTypes;
  ExportMapModalUnmemoized.displayName = 'ExportMapModal';

  var ExportMapModal = /*#__PURE__*/_react["default"].memo(ExportMapModalUnmemoized);

  return ExportMapModal;
}

var _default = ExportMapModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9leHBvcnQtbWFwLW1vZGFsL2V4cG9ydC1tYXAtbW9kYWwuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwib3B0aW9ucyIsIlByb3BUeXBlcyIsIm9iamVjdCIsIm9uRWRpdFVzZXJNYXBib3hBY2Nlc3NUb2tlbiIsImZ1bmMiLCJpc1JlcXVpcmVkIiwib25DaGFuZ2VFeHBvcnREYXRhIiwib25DaGFuZ2VFeHBvcnRNYXBUeXBlIiwibWFwRm9ybWF0Iiwic3RyaW5nIiwic3R5bGUiLCJ3aWR0aCIsIk5PX09QIiwiRXhwb3J0TWFwTW9kYWxGYWN0b3J5IiwiZGVwcyIsIkV4cG9ydEh0bWxNYXBGYWN0b3J5IiwiRXhwb3J0SnNvbk1hcEZhY3RvcnkiLCJFeHBvcnRIdG1sTWFwIiwiRXhwb3J0SnNvbk1hcCIsIkV4cG9ydE1hcE1vZGFsVW5tZW1vaXplZCIsImNvbmZpZyIsIm9uQ2hhbmdlRXhwb3J0TWFwRm9ybWF0IiwiZm9ybWF0Iiwib25DaGFuZ2VFeHBvcnRNYXBIVE1MTW9kZSIsIkVYUE9SVF9NQVBfRk9STUFUX09QVElPTlMiLCJtYXAiLCJvcCIsImlkIiwiYXZhaWxhYmxlIiwibGFiZWwiLCJFWFBPUlRfTUFQX0ZPUk1BVFMiLCJIVE1MIiwiSlNPTiIsImRpc3BsYXlOYW1lIiwiRXhwb3J0TWFwTW9kYWwiLCJSZWFjdCIsIm1lbW8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQTdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWFBLElBQU1BLFNBQVMsR0FBRztBQUNoQkMsRUFBQUEsT0FBTyxFQUFFQyxzQkFBVUMsTUFESDtBQUVoQkMsRUFBQUEsMkJBQTJCLEVBQUVG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SSxnQ0FBQyxhQUFEO0FBQ0UsTUFBQSxNQUFNLEVBQUVaLE1BRFY7QUFFRSxNQUFBLGtCQUFrQixFQUFFZCxrQkFGdEI7QUFHRSxNQUFBLE9BQU8sRUFBRU4sT0FBTyxDQUFDQSxPQUFPLENBQUNzQixNQUFUO0FBSGxCLE1BVEosMEJBZ0JFO0FBQ0F0QixJQUFBQSxPQUFPLENBQUNzQixNQWpCVixDQTFCSixDQURGLENBUitCO0FBQUEsR0FBakM7O0FBMkRBSCxFQUFBQSx3QkFBd0IsQ0FBQ3BCLFNBQXpCLEdBQXFDQSxTQUFyQztBQUNBb0IsRUFBQUEsd0JBQXdCLENBQUNjLFdBQXpCLEdBQXVDLGdCQUF2Qzs7QUFFQSxNQUFNQyxjQUFjLGdCQUFHQyxrQkFBTUMsSUFBTixDQUFXakIsd0JBQVgsQ0FBdkI7O0FBRUEsU0FBT2UsY0FBUDtBQUNEOztlQUVjckIscUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IHtGaWxlVHlwZX0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IHtTdHlsZWRNb2RhbENvbnRlbnQsIFN0eWxlZFR5cGUsIENoZWNrTWFya30gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtFWFBPUlRfTUFQX0ZPUk1BVFMsIEVYUE9SVF9NQVBfRk9STUFUX09QVElPTlN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7U3R5bGVkRXhwb3J0TWFwU2VjdGlvbn0gZnJvbSAnLi9jb21wb25lbnRzJztcbmltcG9ydCBFeHBvcnRIdG1sTWFwRmFjdG9yeSBmcm9tICcuL2V4cG9ydC1odG1sLW1hcCc7XG5pbXBvcnQgRXhwb3J0SnNvbk1hcEZhY3RvcnkgZnJvbSAnLi9leHBvcnQtanNvbi1tYXAnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIG9wdGlvbnM6IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uRWRpdFVzZXJNYXBib3hBY2Nlc3NUb2tlbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb25DaGFuZ2VFeHBvcnREYXRhOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25DaGFuZ2VFeHBvcnRNYXBUeXBlOiBQcm9wVHlwZXMuZnVuYyxcbiAgbWFwRm9ybWF0OiBQcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5jb25zdCBzdHlsZSA9IHt3aWR0aDogJzEwMCUnfTtcblxuY29uc3QgTk9fT1AgPSAoKSA9PiB7fTtcblxuRXhwb3J0TWFwTW9kYWxGYWN0b3J5LmRlcHMgPSBbRXhwb3J0SHRtbE1hcEZhY3RvcnksIEV4cG9ydEpzb25NYXBGYWN0b3J5XTtcblxuZnVuY3Rpb24gRXhwb3J0TWFwTW9kYWxGYWN0b3J5KEV4cG9ydEh0bWxNYXAsIEV4cG9ydEpzb25NYXApIHtcbiAgY29uc3QgRXhwb3J0TWFwTW9kYWxVbm1lbW9pemVkID0gKHtcbiAgICBjb25maWcgPSB7fSxcbiAgICBvbkNoYW5nZUV4cG9ydERhdGEgPSBOT19PUCxcbiAgICBvbkNoYW5nZUV4cG9ydE1hcEZvcm1hdCA9IGZvcm1hdCA9PiB7fSxcbiAgICBvbkNoYW5nZUV4cG9ydE1hcEhUTUxNb2RlID0gTk9fT1AsXG4gICAgb25FZGl0VXNlck1hcGJveEFjY2Vzc1Rva2VuID0gTk9fT1AsXG4gICAgb3B0aW9ucyA9IHtmb3JtYXQ6ICcnfVxuICB9KSA9PiAoXG4gICAgPFN0eWxlZE1vZGFsQ29udGVudCBjbGFzc05hbWU9XCJleHBvcnQtbWFwLW1vZGFsXCI+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZX0+XG4gICAgICAgIDxTdHlsZWRFeHBvcnRNYXBTZWN0aW9uPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj5cbiAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5leHBvcnRNYXAuZm9ybWF0VGl0bGUnfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN1YnRpdGxlXCI+XG4gICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuZXhwb3J0TWFwLmZvcm1hdFN1YnRpdGxlJ30gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VsZWN0aW9uXCI+XG4gICAgICAgICAgICB7RVhQT1JUX01BUF9GT1JNQVRfT1BUSU9OUy5tYXAob3AgPT4gKFxuICAgICAgICAgICAgICA8U3R5bGVkVHlwZVxuICAgICAgICAgICAgICAgIGtleT17b3AuaWR9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWQ9e29wdGlvbnMuZm9ybWF0ID09PSBvcC5pZH1cbiAgICAgICAgICAgICAgICBhdmFpbGFibGU9e29wLmF2YWlsYWJsZX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvcC5hdmFpbGFibGUgJiYgb25DaGFuZ2VFeHBvcnRNYXBGb3JtYXQob3AuaWQpfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEZpbGVUeXBlIGV4dD17b3AubGFiZWx9IGhlaWdodD1cIjgwcHhcIiBmb250U2l6ZT1cIjExcHhcIiAvPlxuXG4gICAgICAgICAgICAgICAge29wdGlvbnMuZm9ybWF0ID09PSBvcC5pZCAmJiA8Q2hlY2tNYXJrIC8+fVxuICAgICAgICAgICAgICA8L1N0eWxlZFR5cGU+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9TdHlsZWRFeHBvcnRNYXBTZWN0aW9uPlxuICAgICAgICB7XG4gICAgICAgICAge1xuICAgICAgICAgICAgW0VYUE9SVF9NQVBfRk9STUFUUy5IVE1MXTogKFxuICAgICAgICAgICAgICA8RXhwb3J0SHRtbE1hcFxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlRXhwb3J0TWFwSFRNTE1vZGU9e29uQ2hhbmdlRXhwb3J0TWFwSFRNTE1vZGV9XG4gICAgICAgICAgICAgICAgb25FZGl0VXNlck1hcGJveEFjY2Vzc1Rva2VuPXtvbkVkaXRVc2VyTWFwYm94QWNjZXNzVG9rZW59XG4gICAgICAgICAgICAgICAgb3B0aW9ucz17b3B0aW9uc1tvcHRpb25zLmZvcm1hdF19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgW0VYUE9SVF9NQVBfRk9STUFUUy5KU09OXTogKFxuICAgICAgICAgICAgICA8RXhwb3J0SnNvbk1hcFxuICAgICAgICAgICAgICAgIGNvbmZpZz17Y29uZmlnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlRXhwb3J0RGF0YT17b25DaGFuZ2VFeHBvcnREYXRhfVxuICAgICAgICAgICAgICAgIG9wdGlvbnM9e29wdGlvbnNbb3B0aW9ucy5mb3JtYXRdfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1bXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBvcHRpb25zLmZvcm1hdFxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgPC9kaXY+XG4gICAgPC9TdHlsZWRNb2RhbENvbnRlbnQ+XG4gICk7XG5cbiAgRXhwb3J0TWFwTW9kYWxVbm1lbW9pemVkLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbiAgRXhwb3J0TWFwTW9kYWxVbm1lbW9pemVkLmRpc3BsYXlOYW1lID0gJ0V4cG9ydE1hcE1vZGFsJztcblxuICBjb25zdCBFeHBvcnRNYXBNb2RhbCA9IFJlYWN0Lm1lbW8oRXhwb3J0TWFwTW9kYWxVbm1lbW9pemVkKTtcblxuICByZXR1cm4gRXhwb3J0TWFwTW9kYWw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV4cG9ydE1hcE1vZGFsRmFjdG9yeTtcbiJdfQ==