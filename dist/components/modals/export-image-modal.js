"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _imagePreview = _interopRequireDefault(require("../common/image-preview"));

var _defaultSettings = require("../../constants/default-settings");

var _styledComponents2 = require("../common/styled-components");

var _switch = _interopRequireDefault(require("../common/switch"));

var _reactIntl = require("react-intl");

var _localization = require("../../localization");

var _templateObject;

var ImageOptionList = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  width: 250px;\n\n  .image-option-section {\n    .image-option-section-title {\n      font-weight: 500;\n      font-size: 14px;\n    }\n  }\n\n  .button-list {\n    display: flex;\n    flex-direction: row;\n    padding: 8px 0px;\n  }\n\n  input {\n    margin-right: 8px;\n  }\n"])));

var ExportImageModalFactory = function ExportImageModalFactory() {
  /** @type {typeof import('./export-image-modal').ExportImageModal} */
  var ExportImageModal = function ExportImageModal(_ref) {
    var mapW = _ref.mapW,
        mapH = _ref.mapH,
        exportImage = _ref.exportImage,
        onUpdateImageSetting = _ref.onUpdateImageSetting,
        cleanupExportImage = _ref.cleanupExportImage,
        intl = _ref.intl;
    var legend = exportImage.legend,
        ratio = exportImage.ratio,
        resolution = exportImage.resolution;
    (0, _react.useEffect)(function () {
      onUpdateImageSetting({
        exporting: true
      });
      return cleanupExportImage;
    }, [onUpdateImageSetting, cleanupExportImage]);
    (0, _react.useEffect)(function () {
      if (mapH !== exportImage.mapH || mapW !== exportImage.mapW) {
        onUpdateImageSetting({
          mapH: mapH,
          mapW: mapW
        });
      }
    }, [mapH, mapW, exportImage, onUpdateImageSetting]);
    return /*#__PURE__*/_react["default"].createElement(_styledComponents2.StyledModalContent, {
      className: "export-image-modal"
    }, /*#__PURE__*/_react["default"].createElement(ImageOptionList, null, /*#__PURE__*/_react["default"].createElement("div", {
      className: "image-option-section"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "image-option-section-title"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportImage.ratioTitle'
    })), /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportImage.ratioDescription'
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: "button-list",
      id: "export-image-modal__option_ratio"
    }, _defaultSettings.EXPORT_IMG_RATIO_OPTIONS.filter(function (op) {
      return !op.hidden;
    }).map(function (op) {
      return /*#__PURE__*/_react["default"].createElement(_styledComponents2.SelectionButton, {
        key: op.id,
        selected: ratio === op.id,
        onClick: function onClick() {
          return onUpdateImageSetting({
            ratio: op.id
          });
        }
      }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
        id: op.label
      }), ratio === op.id && /*#__PURE__*/_react["default"].createElement(_styledComponents2.CheckMark, null));
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "image-option-section"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "image-option-section-title"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportImage.resolutionTitle'
    })), /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportImage.resolutionDescription'
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: "button-list",
      id: "export-image-modal__option_resolution"
    }, _defaultSettings.EXPORT_IMG_RESOLUTION_OPTIONS.map(function (op) {
      return /*#__PURE__*/_react["default"].createElement(_styledComponents2.SelectionButton, {
        key: op.id,
        selected: resolution === op.id,
        onClick: function onClick() {
          return op.available && onUpdateImageSetting({
            resolution: op.id
          });
        }
      }, op.label, resolution === op.id && /*#__PURE__*/_react["default"].createElement(_styledComponents2.CheckMark, null));
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "image-option-section"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "image-option-section-title"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.exportImage.mapLegendTitle'
    })), /*#__PURE__*/_react["default"].createElement(_switch["default"], {
      type: "checkbox",
      id: "add-map-legend",
      checked: legend,
      label: intl.formatMessage({
        id: 'modal.exportImage.mapLegendAdd'
      }),
      onChange: function onChange() {
        return onUpdateImageSetting({
          legend: !legend
        });
      }
    }))), /*#__PURE__*/_react["default"].createElement(_imagePreview["default"], {
      exportImage: exportImage
    }));
  };

  return (0, _reactIntl.injectIntl)(ExportImageModal);
};

var _default = ExportImageModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9leHBvcnQtaW1hZ2UtbW9kYWwuanMiXSwibmFtZXMiOlsiSW1hZ2VPcHRpb25MaXN0Iiwic3R5bGVkIiwiZGl2IiwiRXhwb3J0SW1hZ2VNb2RhbEZhY3RvcnkiLCJFeHBvcnRJbWFnZU1vZGFsIiwibWFwVyIsIm1hcEgiLCJleHBvcnRJbWFnZSIsIm9uVXBkYXRlSW1hZ2VTZXR0aW5nIiwiY2xlYW51cEV4cG9ydEltYWdlIiwiaW50bCIsImxlZ2VuZCIsInJhdGlvIiwicmVzb2x1dGlvbiIsImV4cG9ydGluZyIsIkVYUE9SVF9JTUdfUkFUSU9fT1BUSU9OUyIsImZpbHRlciIsIm9wIiwiaGlkZGVuIiwibWFwIiwiaWQiLCJsYWJlbCIsIkVYUE9SVF9JTUdfUkVTT0xVVElPTl9PUFRJT05TIiwiYXZhaWxhYmxlIiwiZm9ybWF0TWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBLElBQU1BLGVBQWUsR0FBR0MsNkJBQU9DLEdBQVYsNmJBQXJCOztBQXdCQSxJQUFNQyx1QkFBdUIsR0FBRyxTQUExQkEsdUJBQTBCLEdBQU07QUFDcEM7QUFDQSxNQUFNQyxnQkFBZ0IsR0FBRyxTQUFuQkEsZ0JBQW1CLE9BT25CO0FBQUEsUUFOSkMsSUFNSSxRQU5KQSxJQU1JO0FBQUEsUUFMSkMsSUFLSSxRQUxKQSxJQUtJO0FBQUEsUUFKSkMsV0FJSSxRQUpKQSxXQUlJO0FBQUEsUUFISkMsb0JBR0ksUUFISkEsb0JBR0k7QUFBQSxRQUZKQyxrQkFFSSxRQUZKQSxrQkFFSTtBQUFBLFFBREpDLElBQ0ksUUFESkEsSUFDSTtBQUFBLFFBQ0dDLE1BREgsR0FDZ0NKLFdBRGhDLENBQ0dJLE1BREg7QUFBQSxRQUNXQyxLQURYLEdBQ2dDTCxXQURoQyxDQUNXSyxLQURYO0FBQUEsUUFDa0JDLFVBRGxCLEdBQ2dDTixX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RixlQXFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLG9CQUNFLGdDQUFDLDhCQUFEO0FBQWtCLE1BQUEsRUFBRSxFQUFFO0FBQXRCLE1BREYsQ0FERixlQUlFLGdDQUFDLGtCQUFEO0FBQ0UsTUFBQSxJQUFJLEVBQUMsVUFEUDtBQUVFLE1BQUEsRUFBRSxFQUFDLGdCQUZMO0FBR0UsTUFBQSxPQUFPLEVBQUVULE1BSFg7QUFJRSxNQUFBLEtBQUssRUFBRUQsSUFBSSxDQUFDYyxhQUFMLENBQW1CO0FBQUNKLFFBQUFBLEVBQUUsRUFBRTtBQUFMLE9BQW5CLENBSlQ7QUFLRSxNQUFBLFFBQVEsRUFBRTtBQUFBLGVBQU1aLG9CQUFvQixDQUFDO0FBQUNHLFVBQUFBLE1BQU0sRUFBRSxDQUFDQTtBQUFWLFNBQUQsQ0FBMUI7QUFBQTtBQUxaLE1BSkYsQ0FyQ0YsQ0FERixlQW1ERSxnQ0FBQyx3QkFBRDtBQUFjLE1BQUEsV0FBVyxFQUFFSjtBQUEzQixNQW5ERixDQURGO0FBdURELEdBakZEOztBQW1GQSxTQUFPLDJCQUFXSCxnQkFBWCxDQUFQO0FBQ0QsQ0F0RkQ7O2VBd0ZlRCx1QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge3VzZUVmZmVjdH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgSW1hZ2VQcmV2aWV3IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ltYWdlLXByZXZpZXcnO1xuXG5pbXBvcnQge0VYUE9SVF9JTUdfUkFUSU9fT1BUSU9OUywgRVhQT1JUX0lNR19SRVNPTFVUSU9OX09QVElPTlN9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcblxuaW1wb3J0IHtTdHlsZWRNb2RhbENvbnRlbnQsIFNlbGVjdGlvbkJ1dHRvbiwgQ2hlY2tNYXJrfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgU3dpdGNoIGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N3aXRjaCc7XG5pbXBvcnQge2luamVjdEludGx9IGZyb20gJ3JlYWN0LWludGwnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuXG5jb25zdCBJbWFnZU9wdGlvbkxpc3QgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgd2lkdGg6IDI1MHB4O1xuXG4gIC5pbWFnZS1vcHRpb24tc2VjdGlvbiB7XG4gICAgLmltYWdlLW9wdGlvbi1zZWN0aW9uLXRpdGxlIHtcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgfVxuICB9XG5cbiAgLmJ1dHRvbi1saXN0IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgcGFkZGluZzogOHB4IDBweDtcbiAgfVxuXG4gIGlucHV0IHtcbiAgICBtYXJnaW4tcmlnaHQ6IDhweDtcbiAgfVxuYDtcblxuY29uc3QgRXhwb3J0SW1hZ2VNb2RhbEZhY3RvcnkgPSAoKSA9PiB7XG4gIC8qKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9leHBvcnQtaW1hZ2UtbW9kYWwnKS5FeHBvcnRJbWFnZU1vZGFsfSAqL1xuICBjb25zdCBFeHBvcnRJbWFnZU1vZGFsID0gKHtcbiAgICBtYXBXLFxuICAgIG1hcEgsXG4gICAgZXhwb3J0SW1hZ2UsXG4gICAgb25VcGRhdGVJbWFnZVNldHRpbmcsXG4gICAgY2xlYW51cEV4cG9ydEltYWdlLFxuICAgIGludGxcbiAgfSkgPT4ge1xuICAgIGNvbnN0IHtsZWdlbmQsIHJhdGlvLCByZXNvbHV0aW9ufSA9IGV4cG9ydEltYWdlO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgIG9uVXBkYXRlSW1hZ2VTZXR0aW5nKHtcbiAgICAgICAgZXhwb3J0aW5nOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBjbGVhbnVwRXhwb3J0SW1hZ2U7XG4gICAgfSwgW29uVXBkYXRlSW1hZ2VTZXR0aW5nLCBjbGVhbnVwRXhwb3J0SW1hZ2VdKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICBpZiAobWFwSCAhPT0gZXhwb3J0SW1hZ2UubWFwSCB8fCBtYXBXICE9PSBleHBvcnRJbWFnZS5tYXBXKSB7XG4gICAgICAgIG9uVXBkYXRlSW1hZ2VTZXR0aW5nKHtcbiAgICAgICAgICBtYXBILFxuICAgICAgICAgIG1hcFdcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwgW21hcEgsIG1hcFcsIGV4cG9ydEltYWdlLCBvblVwZGF0ZUltYWdlU2V0dGluZ10pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRNb2RhbENvbnRlbnQgY2xhc3NOYW1lPVwiZXhwb3J0LWltYWdlLW1vZGFsXCI+XG4gICAgICAgIDxJbWFnZU9wdGlvbkxpc3Q+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWFnZS1vcHRpb24tc2VjdGlvblwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWFnZS1vcHRpb24tc2VjdGlvbi10aXRsZVwiPlxuICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydEltYWdlLnJhdGlvVGl0bGUnfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydEltYWdlLnJhdGlvRGVzY3JpcHRpb24nfSAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidXR0b24tbGlzdFwiIGlkPVwiZXhwb3J0LWltYWdlLW1vZGFsX19vcHRpb25fcmF0aW9cIj5cbiAgICAgICAgICAgICAge0VYUE9SVF9JTUdfUkFUSU9fT1BUSU9OUy5maWx0ZXIob3AgPT4gIW9wLmhpZGRlbikubWFwKG9wID0+IChcbiAgICAgICAgICAgICAgICA8U2VsZWN0aW9uQnV0dG9uXG4gICAgICAgICAgICAgICAgICBrZXk9e29wLmlkfVxuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3JhdGlvID09PSBvcC5pZH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uVXBkYXRlSW1hZ2VTZXR0aW5nKHtyYXRpbzogb3AuaWR9KX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17b3AubGFiZWx9IC8+XG4gICAgICAgICAgICAgICAgICB7cmF0aW8gPT09IG9wLmlkICYmIDxDaGVja01hcmsgLz59XG4gICAgICAgICAgICAgICAgPC9TZWxlY3Rpb25CdXR0b24+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWFnZS1vcHRpb24tc2VjdGlvblwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWFnZS1vcHRpb24tc2VjdGlvbi10aXRsZVwiPlxuICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmV4cG9ydEltYWdlLnJlc29sdXRpb25UaXRsZSd9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuZXhwb3J0SW1hZ2UucmVzb2x1dGlvbkRlc2NyaXB0aW9uJ30gLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnV0dG9uLWxpc3RcIiBpZD1cImV4cG9ydC1pbWFnZS1tb2RhbF9fb3B0aW9uX3Jlc29sdXRpb25cIj5cbiAgICAgICAgICAgICAge0VYUE9SVF9JTUdfUkVTT0xVVElPTl9PUFRJT05TLm1hcChvcCA9PiAoXG4gICAgICAgICAgICAgICAgPFNlbGVjdGlvbkJ1dHRvblxuICAgICAgICAgICAgICAgICAga2V5PXtvcC5pZH1cbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtyZXNvbHV0aW9uID09PSBvcC5pZH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9wLmF2YWlsYWJsZSAmJiBvblVwZGF0ZUltYWdlU2V0dGluZyh7cmVzb2x1dGlvbjogb3AuaWR9KX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7b3AubGFiZWx9XG4gICAgICAgICAgICAgICAgICB7cmVzb2x1dGlvbiA9PT0gb3AuaWQgJiYgPENoZWNrTWFyayAvPn1cbiAgICAgICAgICAgICAgICA8L1NlbGVjdGlvbkJ1dHRvbj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltYWdlLW9wdGlvbi1zZWN0aW9uXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltYWdlLW9wdGlvbi1zZWN0aW9uLXRpdGxlXCI+XG4gICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuZXhwb3J0SW1hZ2UubWFwTGVnZW5kVGl0bGUnfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgIGlkPVwiYWRkLW1hcC1sZWdlbmRcIlxuICAgICAgICAgICAgICBjaGVja2VkPXtsZWdlbmR9XG4gICAgICAgICAgICAgIGxhYmVsPXtpbnRsLmZvcm1hdE1lc3NhZ2Uoe2lkOiAnbW9kYWwuZXhwb3J0SW1hZ2UubWFwTGVnZW5kQWRkJ30pfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4gb25VcGRhdGVJbWFnZVNldHRpbmcoe2xlZ2VuZDogIWxlZ2VuZH0pfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9JbWFnZU9wdGlvbkxpc3Q+XG4gICAgICAgIDxJbWFnZVByZXZpZXcgZXhwb3J0SW1hZ2U9e2V4cG9ydEltYWdlfSAvPlxuICAgICAgPC9TdHlsZWRNb2RhbENvbnRlbnQ+XG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4gaW5qZWN0SW50bChFeHBvcnRJbWFnZU1vZGFsKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEV4cG9ydEltYWdlTW9kYWxGYWN0b3J5O1xuIl19