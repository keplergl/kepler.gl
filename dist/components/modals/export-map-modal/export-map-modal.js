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

var _reactIntl = require("react-intl");

// Copyright (c) 2020 Uber Technologies, Inc.
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
  var ExportMapModal = _react["default"].memo(function (_ref) {
    var _EXPORT_MAP_FORMATS$H;

    var _ref$config = _ref.config,
        config = _ref$config === void 0 ? {} : _ref$config,
        _ref$onChangeExportDa = _ref.onChangeExportData,
        onChangeExportData = _ref$onChangeExportDa === void 0 ? NO_OP : _ref$onChangeExportDa,
        _ref$onChangeExportMa = _ref.onChangeExportMapFormat,
        onChangeExportMapFormat = _ref$onChangeExportMa === void 0 ? NO_OP : _ref$onChangeExportMa,
        _ref$onChangeExportMa2 = _ref.onChangeExportMapHTMLMode,
        onChangeExportMapHTMLMode = _ref$onChangeExportMa2 === void 0 ? NO_OP : _ref$onChangeExportMa2,
        _ref$onEditUserMapbox = _ref.onEditUserMapboxAccessToken,
        onEditUserMapboxAccessToken = _ref$onEditUserMapbox === void 0 ? NO_OP : _ref$onEditUserMapbox,
        _ref$options = _ref.options,
        options = _ref$options === void 0 ? {} : _ref$options;
    return _react["default"].createElement(_styledComponents.StyledModalContent, {
      className: "export-map-modal"
    }, _react["default"].createElement("div", {
      style: style
    }, _react["default"].createElement(_components.StyledExportMapSection, null, _react["default"].createElement("div", {
      className: "description"
    }, _react["default"].createElement("div", {
      className: "title"
    }, _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'modal.exportMap.formatTitle'
    })), _react["default"].createElement("div", {
      className: "subtitle"
    }, _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'modal.exportMap.formatSubtitle'
    }))), _react["default"].createElement("div", {
      className: "selection"
    }, _defaultSettings.EXPORT_MAP_FORMAT_OPTIONS.map(function (op) {
      return _react["default"].createElement(_styledComponents.StyledType, {
        key: op.id,
        selected: options.format === op.id,
        available: op.available,
        onClick: function onClick() {
          return op.available && onChangeExportMapFormat(op.id);
        }
      }, _react["default"].createElement(_icons.FileType, {
        ext: op.label,
        height: "80px",
        fontSize: "11px"
      }));
    }))), (_EXPORT_MAP_FORMATS$H = {}, (0, _defineProperty2["default"])(_EXPORT_MAP_FORMATS$H, _defaultSettings.EXPORT_MAP_FORMATS.HTML, _react["default"].createElement(ExportHtmlMap, {
      onChangeExportMapHTMLMode: onChangeExportMapHTMLMode,
      onEditUserMapboxAccessToken: onEditUserMapboxAccessToken,
      options: options[options.format]
    })), (0, _defineProperty2["default"])(_EXPORT_MAP_FORMATS$H, _defaultSettings.EXPORT_MAP_FORMATS.JSON, _react["default"].createElement(ExportJsonMap, {
      config: config,
      onChangeExportData: onChangeExportData,
      options: options[options.format]
    })), _EXPORT_MAP_FORMATS$H)[options.format]));
  });

  ExportMapModal.propTypes = propTypes;
  ExportMapModal.displayName = 'ExportMapModal';
  return ExportMapModal;
}

var _default = ExportMapModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9leHBvcnQtbWFwLW1vZGFsL2V4cG9ydC1tYXAtbW9kYWwuanMiXSwibmFtZXMiOlsicHJvcFR5cGVzIiwib3B0aW9ucyIsIlByb3BUeXBlcyIsIm9iamVjdCIsIm9uRWRpdFVzZXJNYXBib3hBY2Nlc3NUb2tlbiIsImZ1bmMiLCJpc1JlcXVpcmVkIiwib25DaGFuZ2VFeHBvcnREYXRhIiwib25DaGFuZ2VFeHBvcnRNYXBUeXBlIiwibWFwRm9ybWF0Iiwic3RyaW5nIiwic3R5bGUiLCJ3aWR0aCIsIk5PX09QIiwiRXhwb3J0TWFwTW9kYWxGYWN0b3J5IiwiZGVwcyIsIkV4cG9ydEh0bWxNYXBGYWN0b3J5IiwiRXhwb3J0SnNvbk1hcEZhY3RvcnkiLCJFeHBvcnRIdG1sTWFwIiwiRXhwb3J0SnNvbk1hcCIsIkV4cG9ydE1hcE1vZGFsIiwiUmVhY3QiLCJtZW1vIiwiY29uZmlnIiwib25DaGFuZ2VFeHBvcnRNYXBGb3JtYXQiLCJvbkNoYW5nZUV4cG9ydE1hcEhUTUxNb2RlIiwiRVhQT1JUX01BUF9GT1JNQVRfT1BUSU9OUyIsIm1hcCIsIm9wIiwiaWQiLCJmb3JtYXQiLCJhdmFpbGFibGUiLCJsYWJlbCIsIkVYUE9SVF9NQVBfRk9STUFUUyIsIkhUTUwiLCJKU09OIiwiZGlzcGxheU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQTdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWFBLElBQU1BLFNBQVMsR0FBRztBQUNoQkMsRUFBQUEsT0FBTyxFQUFFQyxzQkFBVUMsTUFESDtBQUVoQkMsRUFBQUEsMkJBQTJCLEVBQUVGLHNCQUFVRyxJQUFWLENBQWVDLFVBRjVCO0FBR2hCQyxFQUFBQSxrQkFBa0IsRUFBRUwsc0JBQVVHLElBSGQ7QUFJaEJHLEVBQUFBLHFCQUFxQixFQUFFTixzQkFBVUcsSUFKakI7QUFLaEJJLEVBQUFBLFNBQVMsRUFBRVAsc0JBQVVRO0FBTEwsQ0FBbEI7QUFRQSxJQUFNQyxLQUFLLEdBQUc7QUFBQ0MsRUFBQUEsS0FBSyxFQUFFO0FBQVIsQ0FBZDs7QUFFQSxJQUFNQyxLQUFLLEdBQUcsU0FBUkEsS0FBUSxHQUFNLENBQUUsQ0FBdEI7O0FBRUFDLHFCQUFxQixDQUFDQyxJQUF0QixHQUE2QixDQUFDQyx5QkFBRCxFQUF1QkMseUJBQXZCLENBQTdCOztBQUVBLFNBQVNILHFCQUFULENBQStCSSxhQUEvQixFQUE4Q0MsYUFBOUMsRUFBNkQ7QUFDM0QsTUFBTUMsY0FBYyxHQUFHQyxrQkFBTUMsSUFBTixDQUNyQjtBQUFBOztBQUFBLDJCQUNFQyxNQURGO0FBQUEsUUFDRUEsTUFERiw0QkFDVyxFQURYO0FBQUEscUNBRUVoQixrQkFGRjtBQUFBLFFBRUVBLGtCQUZGLHNDQUV1Qk0sS0FGdkI7QUFBQSxxQ0FHRVcsdUJBSEY7QUFBQSxRQUdFQSx1QkFIRixzQ0FHNEJYLEtBSDVCO0FBQUEsc0NBSUVZLHlCQUpGO0FBQUEsUUFJRUEseUJBSkYsdUNBSThCWixLQUo5QjtBQUFBLHFDQUtFVCwyQkFMRjtBQUFBLFFBS0VBLDJCQUxGLHNDQUtnQ1MsS0FMaEM7QUFBQSw0QkFNRVosT0FORjtBQUFBLFFBTUVBLE9BTkYsNkJBTVksRUFOWjtBQUFBLFdBUUUsZ0NBQUMsb0NBQUQ7QUFBb0IsTUFBQSxTQUFTLEVBQUM7QUFBOUIsT0FDRTtBQUFLLE1BQUEsS0FBSyxFQUFFVTtBQUFaLE9BQ0UsZ0NBQUMsa0NBQUQsUUFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRSxnQ0FBQywyQkFBRDtBQUFrQixNQUFBLEVBQUUsRUFBRTtBQUF0QixNQURGLENBREYsRUFJRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRSxnQ0FBQywyQkFBRDtBQUFrQixNQUFBLEVBQUUsRUFBRTtBQUF0QixNQURGLENBSkYsQ0FERixFQVNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNHZSwyQ0FBMEJDLEdBQTFCLENBQThCLFVBQUFDLEVBQUU7QUFBQSxhQUMvQixnQ0FBQyw0QkFBRDtBQUNFLFFBQUEsR0FBRyxFQUFFQSxFQUFFLENBQUNDLEVBRFY7QUFFRSxRQUFBLFFBQVEsRUFBRTVCLE9BQU8sQ0FBQzZCLE1BQVIsS0FBbUJGLEVBQUUsQ0FBQ0MsRUFGbEM7QUFHRSxRQUFBLFNBQVMsRUFBRUQsRUFBRSxDQUFDRyxTQUhoQjtBQUlFLFFBQUEsT0FBTyxFQUFFO0FBQUEsaUJBQU1ILEVBQUUsQ0FBQ0csU0FBSCxJQUFnQlAsdUJBQXVCLENBQUNJLEVBQUUsQ0FBQ0MsRUFBSixDQUE3QztBQUFBO0FBSlgsU0FNRSxnQ0FBQyxlQUFEO0FBQVUsUUFBQSxHQUFHLEVBQUVELEVBQUUsQ0FBQ0ksS0FBbEI7QUFBeUIsUUFBQSxNQUFNLEVBQUMsTUFBaEM7QUFBdUMsUUFBQSxRQUFRLEVBQUM7QUFBaEQsUUFORixDQUQrQjtBQUFBLEtBQWhDLENBREgsQ0FURixDQURGLEVBd0JJLHFGQUNHQyxvQ0FBbUJDLElBRHRCLEVBRUksZ0NBQUMsYUFBRDtBQUNFLE1BQUEseUJBQXlCLEVBQUVULHlCQUQ3QjtBQUVFLE1BQUEsMkJBQTJCLEVBQUVyQiwyQkFGL0I7QUFHRSxNQUFBLE9BQU8sRUFBRUgsT0FBTyxDQUFDQSxPQUFPLENBQUM2QixNQUFUO0FBSGxCLE1BRkosMkRBUUdHLG9DQUFtQkUsSUFSdEIsRUFTSSxnQ0FBQyxhQUFEO0FBQ0UsTUFBQSxNQUFNLEVBQUVaLE1BRFY7QUFFRSxNQUFBLGtCQUFrQixFQUFFaEIsa0JBRnRCO0FBR0UsTUFBQSxPQUFPLEVBQUVOLE9BQU8sQ0FBQ0EsT0FBTyxDQUFDNkIsTUFBVDtBQUhsQixNQVRKLDBCQWVFN0IsT0FBTyxDQUFDNkIsTUFmVixDQXhCSixDQURGLENBUkY7QUFBQSxHQURxQixDQUF2Qjs7QUF3REFWLEVBQUFBLGNBQWMsQ0FBQ3BCLFNBQWYsR0FBMkJBLFNBQTNCO0FBRUFvQixFQUFBQSxjQUFjLENBQUNnQixXQUFmLEdBQTZCLGdCQUE3QjtBQUVBLFNBQU9oQixjQUFQO0FBQ0Q7O2VBRWNOLHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCB7RmlsZVR5cGV9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCB7U3R5bGVkTW9kYWxDb250ZW50LCBTdHlsZWRUeXBlfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge0VYUE9SVF9NQVBfRk9STUFUUywgRVhQT1JUX01BUF9GT1JNQVRfT1BUSU9OU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtTdHlsZWRFeHBvcnRNYXBTZWN0aW9ufSBmcm9tICcuL2NvbXBvbmVudHMnO1xuaW1wb3J0IEV4cG9ydEh0bWxNYXBGYWN0b3J5IGZyb20gJy4vZXhwb3J0LWh0bWwtbWFwJztcbmltcG9ydCBFeHBvcnRKc29uTWFwRmFjdG9yeSBmcm9tICcuL2V4cG9ydC1qc29uLW1hcCc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ3JlYWN0LWludGwnO1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIG9wdGlvbnM6IFByb3BUeXBlcy5vYmplY3QsXG4gIG9uRWRpdFVzZXJNYXBib3hBY2Nlc3NUb2tlbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb25DaGFuZ2VFeHBvcnREYXRhOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25DaGFuZ2VFeHBvcnRNYXBUeXBlOiBQcm9wVHlwZXMuZnVuYyxcbiAgbWFwRm9ybWF0OiBQcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5jb25zdCBzdHlsZSA9IHt3aWR0aDogJzEwMCUnfTtcblxuY29uc3QgTk9fT1AgPSAoKSA9PiB7fTtcblxuRXhwb3J0TWFwTW9kYWxGYWN0b3J5LmRlcHMgPSBbRXhwb3J0SHRtbE1hcEZhY3RvcnksIEV4cG9ydEpzb25NYXBGYWN0b3J5XTtcblxuZnVuY3Rpb24gRXhwb3J0TWFwTW9kYWxGYWN0b3J5KEV4cG9ydEh0bWxNYXAsIEV4cG9ydEpzb25NYXApIHtcbiAgY29uc3QgRXhwb3J0TWFwTW9kYWwgPSBSZWFjdC5tZW1vKFxuICAgICh7XG4gICAgICBjb25maWcgPSB7fSxcbiAgICAgIG9uQ2hhbmdlRXhwb3J0RGF0YSA9IE5PX09QLFxuICAgICAgb25DaGFuZ2VFeHBvcnRNYXBGb3JtYXQgPSBOT19PUCxcbiAgICAgIG9uQ2hhbmdlRXhwb3J0TWFwSFRNTE1vZGUgPSBOT19PUCxcbiAgICAgIG9uRWRpdFVzZXJNYXBib3hBY2Nlc3NUb2tlbiA9IE5PX09QLFxuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfSkgPT4gKFxuICAgICAgPFN0eWxlZE1vZGFsQ29udGVudCBjbGFzc05hbWU9XCJleHBvcnQtbWFwLW1vZGFsXCI+XG4gICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAgICA8U3R5bGVkRXhwb3J0TWFwU2VjdGlvbj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPlxuICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuZXhwb3J0TWFwLmZvcm1hdFRpdGxlJ30gLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VidGl0bGVcIj5cbiAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydE1hcC5mb3JtYXRTdWJ0aXRsZSd9IC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdGlvblwiPlxuICAgICAgICAgICAgICB7RVhQT1JUX01BUF9GT1JNQVRfT1BUSU9OUy5tYXAob3AgPT4gKFxuICAgICAgICAgICAgICAgIDxTdHlsZWRUeXBlXG4gICAgICAgICAgICAgICAgICBrZXk9e29wLmlkfVxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ9e29wdGlvbnMuZm9ybWF0ID09PSBvcC5pZH1cbiAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZT17b3AuYXZhaWxhYmxlfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb3AuYXZhaWxhYmxlICYmIG9uQ2hhbmdlRXhwb3J0TWFwRm9ybWF0KG9wLmlkKX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8RmlsZVR5cGUgZXh0PXtvcC5sYWJlbH0gaGVpZ2h0PVwiODBweFwiIGZvbnRTaXplPVwiMTFweFwiIC8+XG4gICAgICAgICAgICAgICAgPC9TdHlsZWRUeXBlPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvU3R5bGVkRXhwb3J0TWFwU2VjdGlvbj5cbiAgICAgICAgICB7XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFtFWFBPUlRfTUFQX0ZPUk1BVFMuSFRNTF06IChcbiAgICAgICAgICAgICAgICA8RXhwb3J0SHRtbE1hcFxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2VFeHBvcnRNYXBIVE1MTW9kZT17b25DaGFuZ2VFeHBvcnRNYXBIVE1MTW9kZX1cbiAgICAgICAgICAgICAgICAgIG9uRWRpdFVzZXJNYXBib3hBY2Nlc3NUb2tlbj17b25FZGl0VXNlck1hcGJveEFjY2Vzc1Rva2VufVxuICAgICAgICAgICAgICAgICAgb3B0aW9ucz17b3B0aW9uc1tvcHRpb25zLmZvcm1hdF19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgW0VYUE9SVF9NQVBfRk9STUFUUy5KU09OXTogKFxuICAgICAgICAgICAgICAgIDxFeHBvcnRKc29uTWFwXG4gICAgICAgICAgICAgICAgICBjb25maWc9e2NvbmZpZ31cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlRXhwb3J0RGF0YT17b25DaGFuZ2VFeHBvcnREYXRhfVxuICAgICAgICAgICAgICAgICAgb3B0aW9ucz17b3B0aW9uc1tvcHRpb25zLmZvcm1hdF19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVtvcHRpb25zLmZvcm1hdF1cbiAgICAgICAgICB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9TdHlsZWRNb2RhbENvbnRlbnQ+XG4gICAgKVxuICApO1xuXG4gIEV4cG9ydE1hcE1vZGFsLnByb3BUeXBlcyA9IHByb3BUeXBlcztcblxuICBFeHBvcnRNYXBNb2RhbC5kaXNwbGF5TmFtZSA9ICdFeHBvcnRNYXBNb2RhbCc7XG5cbiAgcmV0dXJuIEV4cG9ydE1hcE1vZGFsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBFeHBvcnRNYXBNb2RhbEZhY3Rvcnk7XG4iXX0=