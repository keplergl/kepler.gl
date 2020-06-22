"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.OverwriteMapModal = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _styledComponents2 = require("../common/styled-components");

var _statusPanel = require("./status-panel");

var _imageModalContainer = _interopRequireDefault(require("./image-modal-container"));

var _reactIntl = require("react-intl");

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 24px 12px;\n  min-height: 220px;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-top: 24px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  font-weight: 600;\n  color: black;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-top: 24px;\n  font-size: 14px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledMsg = _styledComponents["default"].div(_templateObject());

var StyledTitle = _styledComponents["default"].span(_templateObject2());

var StyledIcon = _styledComponents["default"].div(_templateObject3());

var StyledOverwriteMapModal = (0, _styledComponents["default"])(_styledComponents2.CenterVerticalFlexbox)(_templateObject4());

var OverwriteMapModalFactory = function OverwriteMapModalFactory() {
  var OverwriteMapModal = function OverwriteMapModal(_ref) {
    var mapSaved = _ref.mapSaved,
        title = _ref.title,
        currentProvider = _ref.currentProvider,
        cloudProviders = _ref.cloudProviders,
        isProviderLoading = _ref.isProviderLoading,
        onUpdateImageSetting = _ref.onUpdateImageSetting,
        onSetCloudProvider = _ref.onSetCloudProvider;
    var provider = cloudProviders.find(function (cp) {
      return cp.name === currentProvider;
    });
    return _react["default"].createElement(_imageModalContainer["default"], {
      currentProvider: currentProvider,
      cloudProviders: cloudProviders,
      onUpdateImageSetting: onUpdateImageSetting,
      onSetCloudProvider: onSetCloudProvider
    }, _react["default"].createElement(StyledOverwriteMapModal, {
      className: "overwrite-map-modal"
    }, isProviderLoading ? _react["default"].createElement(StyledMsg, null, _react["default"].createElement(StyledTitle, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'modal.overwriteMap.title'
    })), _react["default"].createElement(_statusPanel.UploadAnimation, {
      icon: provider && provider.icon
    })) : _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement(StyledIcon, null, provider && provider.icon ? _react["default"].createElement(provider.icon, {
      height: "64px"
    }) : null), _react["default"].createElement(StyledMsg, {
      className: "overwrite-map-msg"
    }, _react["default"].createElement(StyledTitle, null, title), _react["default"].createElement(_reactIntl.FormattedMessage, {
      id: 'modal.overwriteMap.alreadyExists',
      values: {
        mapSaved: mapSaved
      }
    })))));
  };

  return OverwriteMapModal;
};

var OverwriteMapModal = OverwriteMapModalFactory();
exports.OverwriteMapModal = OverwriteMapModal;
var _default = OverwriteMapModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9vdmVyd3JpdGUtbWFwLW1vZGFsLmpzIl0sIm5hbWVzIjpbIlN0eWxlZE1zZyIsInN0eWxlZCIsImRpdiIsIlN0eWxlZFRpdGxlIiwic3BhbiIsIlN0eWxlZEljb24iLCJTdHlsZWRPdmVyd3JpdGVNYXBNb2RhbCIsIkNlbnRlclZlcnRpY2FsRmxleGJveCIsIk92ZXJ3cml0ZU1hcE1vZGFsRmFjdG9yeSIsIk92ZXJ3cml0ZU1hcE1vZGFsIiwibWFwU2F2ZWQiLCJ0aXRsZSIsImN1cnJlbnRQcm92aWRlciIsImNsb3VkUHJvdmlkZXJzIiwiaXNQcm92aWRlckxvYWRpbmciLCJvblVwZGF0ZUltYWdlU2V0dGluZyIsIm9uU2V0Q2xvdWRQcm92aWRlciIsInByb3ZpZGVyIiwiZmluZCIsImNwIiwibmFtZSIsImljb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUdDLDZCQUFPQyxHQUFWLG1CQUFmOztBQUtBLElBQU1DLFdBQVcsR0FBR0YsNkJBQU9HLElBQVYsb0JBQWpCOztBQUtBLElBQU1DLFVBQVUsR0FBR0osNkJBQU9DLEdBQVYsb0JBQWhCOztBQUlBLElBQU1JLHVCQUF1QixHQUFHLGtDQUFPQyx3Q0FBUCxDQUFILG9CQUE3Qjs7QUFLQSxJQUFNQyx3QkFBd0IsR0FBRyxTQUEzQkEsd0JBQTJCLEdBQU07QUFDckMsTUFBTUMsaUJBQWlCLEdBQUcsU0FBcEJBLGlCQUFvQixPQVFwQjtBQUFBLFFBUEpDLFFBT0ksUUFQSkEsUUFPSTtBQUFBLFFBTkpDLEtBTUksUUFOSkEsS0FNSTtBQUFBLFFBTEpDLGVBS0ksUUFMSkEsZUFLSTtBQUFBLFFBSkpDLGNBSUksUUFKSkEsY0FJSTtBQUFBLFFBSEpDLGlCQUdJLFFBSEpBLGlCQUdJO0FBQUEsUUFGSkMsb0JBRUksUUFGSkEsb0JBRUk7QUFBQSxRQURKQyxrQkFDSSxRQURKQSxrQkFDSTtBQUNKLFFBQU1DLFFBQVEsR0FBR0osY0FBYyxDQUFDSyxJQUFmLENBQW9CLFVBQUFDLEVBQUU7QUFBQSxhQUFJQSxFQUFFLENBQUNDLElBQUgsS0FBWVIsZUFBaEI7QUFBQSxLQUF0QixDQUFqQjtBQUNBLFdBQ0UsZ0NBQUMsK0JBQUQ7QUFDRSxNQUFBLGVBQWUsRUFBRUEsZUFEbkI7QUFFRSxNQUFBLGNBQWMsRUFBRUMsY0FGbEI7QUFHRSxNQUFBLG9CQUFvQixFQUFFRSxvQkFIeEI7QUFJRSxNQUFBLGtCQUFrQixFQUFFQztBQUp0QixPQU1FLGdDQUFDLHVCQUFEO0FBQXlCLE1BQUEsU0FBUyxFQUFDO0FBQW5DLE9BQ0dGLGlCQUFpQixHQUNoQixnQ0FBQyxTQUFELFFBQ0UsZ0NBQUMsV0FBRCxRQUNFLGdDQUFDLDJCQUFEO0FBQWtCLE1BQUEsRUFBRSxFQUFFO0FBQXRCLE1BREYsQ0FERixFQUlFLGdDQUFDLDRCQUFEO0FBQWlCLE1BQUEsSUFBSSxFQUFFRyxRQUFRLElBQUlBLFFBQVEsQ0FBQ0k7QUFBNUMsTUFKRixDQURnQixHQVFoQixrRUFDRSxnQ0FBQyxVQUFELFFBQ0dKLFFBQVEsSUFBSUEsUUFBUSxDQUFDSSxJQUFyQixHQUE0QixnQ0FBQyxRQUFELENBQVUsSUFBVjtBQUFlLE1BQUEsTUFBTSxFQUFDO0FBQXRCLE1BQTVCLEdBQThELElBRGpFLENBREYsRUFJRSxnQ0FBQyxTQUFEO0FBQVcsTUFBQSxTQUFTLEVBQUM7QUFBckIsT0FDRSxnQ0FBQyxXQUFELFFBQWNWLEtBQWQsQ0FERixFQUVFLGdDQUFDLDJCQUFEO0FBQWtCLE1BQUEsRUFBRSxFQUFFLGtDQUF0QjtBQUEwRCxNQUFBLE1BQU0sRUFBRTtBQUFDRCxRQUFBQSxRQUFRLEVBQVJBO0FBQUQ7QUFBbEUsTUFGRixDQUpGLENBVEosQ0FORixDQURGO0FBNkJELEdBdkNEOztBQXdDQSxTQUFPRCxpQkFBUDtBQUNELENBMUNEOztBQTRDTyxJQUFNQSxpQkFBaUIsR0FBR0Qsd0JBQXdCLEVBQWxEOztlQUVRQSx3QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Q2VudGVyVmVydGljYWxGbGV4Ym94fSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge1VwbG9hZEFuaW1hdGlvbn0gZnJvbSAnLi9zdGF0dXMtcGFuZWwnO1xuaW1wb3J0IEltYWdlTW9kYWxDb250YWluZXIgZnJvbSAnLi9pbWFnZS1tb2RhbC1jb250YWluZXInO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdyZWFjdC1pbnRsJztcblxuY29uc3QgU3R5bGVkTXNnID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLXRvcDogMjRweDtcbiAgZm9udC1zaXplOiAxNHB4O1xuYDtcblxuY29uc3QgU3R5bGVkVGl0bGUgPSBzdHlsZWQuc3BhbmBcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgY29sb3I6IGJsYWNrO1xuYDtcblxuY29uc3QgU3R5bGVkSWNvbiA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi10b3A6IDI0cHg7XG5gO1xuXG5jb25zdCBTdHlsZWRPdmVyd3JpdGVNYXBNb2RhbCA9IHN0eWxlZChDZW50ZXJWZXJ0aWNhbEZsZXhib3gpYFxuICBwYWRkaW5nOiAyNHB4IDEycHg7XG4gIG1pbi1oZWlnaHQ6IDIyMHB4O1xuYDtcblxuY29uc3QgT3ZlcndyaXRlTWFwTW9kYWxGYWN0b3J5ID0gKCkgPT4ge1xuICBjb25zdCBPdmVyd3JpdGVNYXBNb2RhbCA9ICh7XG4gICAgbWFwU2F2ZWQsXG4gICAgdGl0bGUsXG4gICAgY3VycmVudFByb3ZpZGVyLFxuICAgIGNsb3VkUHJvdmlkZXJzLFxuICAgIGlzUHJvdmlkZXJMb2FkaW5nLFxuICAgIG9uVXBkYXRlSW1hZ2VTZXR0aW5nLFxuICAgIG9uU2V0Q2xvdWRQcm92aWRlclxuICB9KSA9PiB7XG4gICAgY29uc3QgcHJvdmlkZXIgPSBjbG91ZFByb3ZpZGVycy5maW5kKGNwID0+IGNwLm5hbWUgPT09IGN1cnJlbnRQcm92aWRlcik7XG4gICAgcmV0dXJuIChcbiAgICAgIDxJbWFnZU1vZGFsQ29udGFpbmVyXG4gICAgICAgIGN1cnJlbnRQcm92aWRlcj17Y3VycmVudFByb3ZpZGVyfVxuICAgICAgICBjbG91ZFByb3ZpZGVycz17Y2xvdWRQcm92aWRlcnN9XG4gICAgICAgIG9uVXBkYXRlSW1hZ2VTZXR0aW5nPXtvblVwZGF0ZUltYWdlU2V0dGluZ31cbiAgICAgICAgb25TZXRDbG91ZFByb3ZpZGVyPXtvblNldENsb3VkUHJvdmlkZXJ9XG4gICAgICA+XG4gICAgICAgIDxTdHlsZWRPdmVyd3JpdGVNYXBNb2RhbCBjbGFzc05hbWU9XCJvdmVyd3JpdGUtbWFwLW1vZGFsXCI+XG4gICAgICAgICAge2lzUHJvdmlkZXJMb2FkaW5nID8gKFxuICAgICAgICAgICAgPFN0eWxlZE1zZz5cbiAgICAgICAgICAgICAgPFN0eWxlZFRpdGxlPlxuICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwub3ZlcndyaXRlTWFwLnRpdGxlJ30gLz5cbiAgICAgICAgICAgICAgPC9TdHlsZWRUaXRsZT5cbiAgICAgICAgICAgICAgPFVwbG9hZEFuaW1hdGlvbiBpY29uPXtwcm92aWRlciAmJiBwcm92aWRlci5pY29ufSAvPlxuICAgICAgICAgICAgPC9TdHlsZWRNc2c+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxTdHlsZWRJY29uPlxuICAgICAgICAgICAgICAgIHtwcm92aWRlciAmJiBwcm92aWRlci5pY29uID8gPHByb3ZpZGVyLmljb24gaGVpZ2h0PVwiNjRweFwiIC8+IDogbnVsbH1cbiAgICAgICAgICAgICAgPC9TdHlsZWRJY29uPlxuICAgICAgICAgICAgICA8U3R5bGVkTXNnIGNsYXNzTmFtZT1cIm92ZXJ3cml0ZS1tYXAtbXNnXCI+XG4gICAgICAgICAgICAgICAgPFN0eWxlZFRpdGxlPnt0aXRsZX08L1N0eWxlZFRpdGxlPlxuICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwub3ZlcndyaXRlTWFwLmFscmVhZHlFeGlzdHMnfSB2YWx1ZXM9e3ttYXBTYXZlZH19IC8+XG4gICAgICAgICAgICAgIDwvU3R5bGVkTXNnPlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9TdHlsZWRPdmVyd3JpdGVNYXBNb2RhbD5cbiAgICAgIDwvSW1hZ2VNb2RhbENvbnRhaW5lcj5cbiAgICApO1xuICB9O1xuICByZXR1cm4gT3ZlcndyaXRlTWFwTW9kYWw7XG59O1xuXG5leHBvcnQgY29uc3QgT3ZlcndyaXRlTWFwTW9kYWwgPSBPdmVyd3JpdGVNYXBNb2RhbEZhY3RvcnkoKTtcblxuZXhwb3J0IGRlZmF1bHQgT3ZlcndyaXRlTWFwTW9kYWxGYWN0b3J5O1xuIl19