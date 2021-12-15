"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ShareMapUrlModalFactory;
exports.SharingUrl = exports.StyleSharingUrl = exports.StyledInputLabel = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _reactCopyToClipboard = require("react-copy-to-clipboard");

var _base = require("../../styles/base");

var _imageModalContainer = _interopRequireDefault(require("./image-modal-container"));

var _providerModalContainer = _interopRequireDefault(require("./provider-modal-container"));

var _styledComponents2 = require("../common/styled-components");

var _cloudTile = _interopRequireDefault(require("./cloud-tile"));

var _statusPanel = _interopRequireDefault(require("./status-panel"));

var _localization = require("../../localization");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

var StyledInputLabel = _styledComponents["default"].label(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 12px;\n  color: ", ";\n  letter-spacing: 0.2px;\n"])), function (props) {
  return props.theme.textColorLT;
});

exports.StyledInputLabel = StyledInputLabel;

var StyleSharingUrl = _styledComponents["default"].div.attrs({
  className: 'sharing-url'
})(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  width: 100%;\n  display: flex;\n  margin-bottom: 14px;\n  flex-direction: column;\n\n  input {\n    border-right: 0;\n  }\n\n  .button {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n  }\n"])));

exports.StyleSharingUrl = StyleSharingUrl;

var SharingUrl = function SharingUrl(_ref) {
  var url = _ref.url,
      _ref$message = _ref.message,
      message = _ref$message === void 0 ? '' : _ref$message;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      copied = _useState2[0],
      setCopy = _useState2[1];

  return /*#__PURE__*/_react["default"].createElement(StyleSharingUrl, null, /*#__PURE__*/_react["default"].createElement(StyledInputLabel, null, message), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.InputLight, {
    type: "text",
    value: url,
    readOnly: true,
    selected: true
  }), /*#__PURE__*/_react["default"].createElement(_reactCopyToClipboard.CopyToClipboard, {
    text: url,
    onCopy: function onCopy() {
      return setCopy(true);
    }
  }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.Button, {
    width: "80px"
  }, copied ? 'Copied!' : 'Copy'))));
};

exports.SharingUrl = SharingUrl;

var nop = function nop() {};

var StyledShareMapModal = (0, _styledComponents["default"])(_styledComponents2.StyledModalContent)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 24px 72px 40px 72px;\n  margin: 0 -72px -40px -72px;\n"])));

var StyledInnerDiv = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  min-height: 500px;\n"])));

function ShareMapUrlModalFactory() {
  var ShareMapUrlModal = function ShareMapUrlModal(_ref2) {
    var isProviderLoading = _ref2.isProviderLoading,
        isReady = _ref2.isReady,
        onExport = _ref2.onExport,
        cloudProviders = _ref2.cloudProviders,
        currentProvider = _ref2.currentProvider,
        providerError = _ref2.providerError,
        successInfo = _ref2.successInfo,
        onSetCloudProvider = _ref2.onSetCloudProvider,
        onUpdateImageSetting = _ref2.onUpdateImageSetting,
        cleanupExportImage = _ref2.cleanupExportImage;
    var shareUrl = successInfo.shareUrl,
        folderLink = successInfo.folderLink;
    var provider = currentProvider ? cloudProviders.find(function (p) {
      return p.name === currentProvider;
    }) : null;
    return /*#__PURE__*/_react["default"].createElement(_styledComponents.ThemeProvider, {
      theme: _base.themeLT
    }, /*#__PURE__*/_react["default"].createElement(_providerModalContainer["default"], {
      onSetCloudProvider: onSetCloudProvider,
      cloudProviders: cloudProviders,
      currentProvider: currentProvider
    }, /*#__PURE__*/_react["default"].createElement(_imageModalContainer["default"], {
      currentProvider: currentProvider,
      cloudProviders: cloudProviders,
      onUpdateImageSetting: onUpdateImageSetting,
      cleanupExportImage: cleanupExportImage
    }, /*#__PURE__*/_react["default"].createElement(StyledShareMapModal, {
      className: "export-cloud-modal"
    }, /*#__PURE__*/_react["default"].createElement(StyledInnerDiv, null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.StyledExportSection, null, /*#__PURE__*/_react["default"].createElement("div", {
      className: "description"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "title"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.shareMap.shareUriTitle'
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "subtitle"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.shareMap.shareUriSubtitle'
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "selection"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "title warning"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.shareMap.shareDisclaimer'
    })))), /*#__PURE__*/_react["default"].createElement(_styledComponents2.StyledExportSection, {
      disabled: isProviderLoading
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "description"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "title"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.shareMap.cloudTitle'
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "subtitle"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.shareMap.cloudSubtitle'
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "selection"
    }, cloudProviders.map(function (cloudProvider) {
      return /*#__PURE__*/_react["default"].createElement(_cloudTile["default"], {
        key: cloudProvider.name,
        onSelect: function onSelect() {
          return onExport(cloudProvider);
        },
        onSetCloudProvider: onSetCloudProvider,
        cloudProvider: cloudProvider,
        actionName: "Upload",
        isSelected: cloudProvider.name === currentProvider,
        isConnected: Boolean(cloudProvider.getAccessToken()),
        isReady: isReady
      });
    }))), isProviderLoading || providerError ? /*#__PURE__*/_react["default"].createElement(_statusPanel["default"], {
      isLoading: isProviderLoading,
      error: providerError,
      providerIcon: provider && provider.icon
    }) : null, shareUrl && /*#__PURE__*/_react["default"].createElement(_styledComponents2.StyledExportSection, null, /*#__PURE__*/_react["default"].createElement("div", {
      className: "description"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "title"
    }, "Share Url")), /*#__PURE__*/_react["default"].createElement("div", {
      className: "selection"
    }, /*#__PURE__*/_react["default"].createElement(SharingUrl, {
      key: 0,
      url: shareUrl
    }), provider && folderLink && /*#__PURE__*/_react["default"].createElement("a", {
      key: 1,
      href: folderLink,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        textDecoration: 'underline'
      }
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.shareMap.gotoPage',
      values: {
        currentProvider: currentProvider
      }
    })))))))));
  };

  ShareMapUrlModal.defaultProps = {
    isProviderLoading: false,
    onExport: nop,
    cloudProviders: [],
    currentProvider: null,
    providerError: null,
    successInfo: {},
    onSetCloudProvider: nop,
    onUpdateImageSetting: nop
  };
  return ShareMapUrlModal;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9zaGFyZS1tYXAtbW9kYWwuanMiXSwibmFtZXMiOlsiU3R5bGVkSW5wdXRMYWJlbCIsInN0eWxlZCIsImxhYmVsIiwicHJvcHMiLCJ0aGVtZSIsInRleHRDb2xvckxUIiwiU3R5bGVTaGFyaW5nVXJsIiwiZGl2IiwiYXR0cnMiLCJjbGFzc05hbWUiLCJTaGFyaW5nVXJsIiwidXJsIiwibWVzc2FnZSIsImNvcGllZCIsInNldENvcHkiLCJkaXNwbGF5Iiwibm9wIiwiU3R5bGVkU2hhcmVNYXBNb2RhbCIsIlN0eWxlZE1vZGFsQ29udGVudCIsIlN0eWxlZElubmVyRGl2IiwiU2hhcmVNYXBVcmxNb2RhbEZhY3RvcnkiLCJTaGFyZU1hcFVybE1vZGFsIiwiaXNQcm92aWRlckxvYWRpbmciLCJpc1JlYWR5Iiwib25FeHBvcnQiLCJjbG91ZFByb3ZpZGVycyIsImN1cnJlbnRQcm92aWRlciIsInByb3ZpZGVyRXJyb3IiLCJzdWNjZXNzSW5mbyIsIm9uU2V0Q2xvdWRQcm92aWRlciIsIm9uVXBkYXRlSW1hZ2VTZXR0aW5nIiwiY2xlYW51cEV4cG9ydEltYWdlIiwic2hhcmVVcmwiLCJmb2xkZXJMaW5rIiwicHJvdmlkZXIiLCJmaW5kIiwicCIsIm5hbWUiLCJ0aGVtZUxUIiwibWFwIiwiY2xvdWRQcm92aWRlciIsIkJvb2xlYW4iLCJnZXRBY2Nlc3NUb2tlbiIsImljb24iLCJ0ZXh0RGVjb3JhdGlvbiIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFNQTs7QUFDQTs7QUFDQTs7OztBQUVPLElBQU1BLGdCQUFnQixHQUFHQyw2QkFBT0MsS0FBVix1SkFFbEIsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxXQUFoQjtBQUFBLENBRmEsQ0FBdEI7Ozs7QUFNQSxJQUFN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RUFBRSxLQURXO0FBRTlCRSxJQUFBQSxRQUFRLEVBQUVSLEdBRm9CO0FBRzlCUyxJQUFBQSxjQUFjLEVBQUUsRUFIYztBQUk5QkMsSUFBQUEsZUFBZSxFQUFFLElBSmE7QUFLOUJDLElBQUFBLGFBQWEsRUFBRSxJQUxlO0FBTTlCQyxJQUFBQSxXQUFXLEVBQUUsRUFOaUI7QUFPOUJDLElBQUFBLGtCQUFrQixFQUFFYixHQVBVO0FBUTlCYyxJQUFBQSxvQkFBb0IsRUFBRWQ7QUFSUSxHQUFoQztBQVdBLFNBQU9LLGdCQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHt1c2VTdGF0ZX0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCwge1RoZW1lUHJvdmlkZXJ9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Q29weVRvQ2xpcGJvYXJkfSBmcm9tICdyZWFjdC1jb3B5LXRvLWNsaXBib2FyZCc7XG5pbXBvcnQge3RoZW1lTFR9IGZyb20gJ3N0eWxlcy9iYXNlJztcbmltcG9ydCBJbWFnZU1vZGFsQ29udGFpbmVyIGZyb20gJy4vaW1hZ2UtbW9kYWwtY29udGFpbmVyJztcbmltcG9ydCBQcm92aWRlck1vZGFsQ29udGFpbmVyIGZyb20gJy4vcHJvdmlkZXItbW9kYWwtY29udGFpbmVyJztcblxuaW1wb3J0IHtcbiAgU3R5bGVkTW9kYWxDb250ZW50LFxuICBTdHlsZWRFeHBvcnRTZWN0aW9uLFxuICBJbnB1dExpZ2h0LFxuICBCdXR0b25cbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IENsb3VkVGlsZSBmcm9tICcuL2Nsb3VkLXRpbGUnO1xuaW1wb3J0IFN0YXR1c1BhbmVsIGZyb20gJy4vc3RhdHVzLXBhbmVsJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAnbG9jYWxpemF0aW9uJztcblxuZXhwb3J0IGNvbnN0IFN0eWxlZElucHV0TGFiZWwgPSBzdHlsZWQubGFiZWxgXG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yTFR9O1xuICBsZXR0ZXItc3BhY2luZzogMC4ycHg7XG5gO1xuXG5leHBvcnQgY29uc3QgU3R5bGVTaGFyaW5nVXJsID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ3NoYXJpbmctdXJsJ1xufSlgXG4gIHdpZHRoOiAxMDAlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBtYXJnaW4tYm90dG9tOiAxNHB4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXG4gIGlucHV0IHtcbiAgICBib3JkZXItcmlnaHQ6IDA7XG4gIH1cblxuICAuYnV0dG9uIHtcbiAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAwO1xuICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBTaGFyaW5nVXJsID0gKHt1cmwsIG1lc3NhZ2UgPSAnJ30pID0+IHtcbiAgY29uc3QgW2NvcGllZCwgc2V0Q29weV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIHJldHVybiAoXG4gICAgPFN0eWxlU2hhcmluZ1VybD5cbiAgICAgIDxTdHlsZWRJbnB1dExhYmVsPnttZXNzYWdlfTwvU3R5bGVkSW5wdXRMYWJlbD5cbiAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCd9fT5cbiAgICAgICAgPElucHV0TGlnaHQgdHlwZT1cInRleHRcIiB2YWx1ZT17dXJsfSByZWFkT25seSBzZWxlY3RlZCAvPlxuICAgICAgICA8Q29weVRvQ2xpcGJvYXJkIHRleHQ9e3VybH0gb25Db3B5PXsoKSA9PiBzZXRDb3B5KHRydWUpfT5cbiAgICAgICAgICA8QnV0dG9uIHdpZHRoPVwiODBweFwiPntjb3BpZWQgPyAnQ29waWVkIScgOiAnQ29weSd9PC9CdXR0b24+XG4gICAgICAgIDwvQ29weVRvQ2xpcGJvYXJkPlxuICAgICAgPC9kaXY+XG4gICAgPC9TdHlsZVNoYXJpbmdVcmw+XG4gICk7XG59O1xuY29uc3Qgbm9wID0gKCkgPT4ge307XG5cbmNvbnN0IFN0eWxlZFNoYXJlTWFwTW9kYWwgPSBzdHlsZWQoU3R5bGVkTW9kYWxDb250ZW50KWBcbiAgcGFkZGluZzogMjRweCA3MnB4IDQwcHggNzJweDtcbiAgbWFyZ2luOiAwIC03MnB4IC00MHB4IC03MnB4O1xuYDtcblxuY29uc3QgU3R5bGVkSW5uZXJEaXYgPSBzdHlsZWQuZGl2YFxuICBtaW4taGVpZ2h0OiA1MDBweDtcbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNoYXJlTWFwVXJsTW9kYWxGYWN0b3J5KCkge1xuICBjb25zdCBTaGFyZU1hcFVybE1vZGFsID0gKHtcbiAgICBpc1Byb3ZpZGVyTG9hZGluZyxcbiAgICBpc1JlYWR5LFxuICAgIG9uRXhwb3J0LFxuICAgIGNsb3VkUHJvdmlkZXJzLFxuICAgIGN1cnJlbnRQcm92aWRlcixcbiAgICBwcm92aWRlckVycm9yLFxuICAgIHN1Y2Nlc3NJbmZvLFxuICAgIG9uU2V0Q2xvdWRQcm92aWRlcixcbiAgICBvblVwZGF0ZUltYWdlU2V0dGluZyxcbiAgICBjbGVhbnVwRXhwb3J0SW1hZ2VcbiAgfSkgPT4ge1xuICAgIGNvbnN0IHtzaGFyZVVybCwgZm9sZGVyTGlua30gPSBzdWNjZXNzSW5mbztcbiAgICBjb25zdCBwcm92aWRlciA9IGN1cnJlbnRQcm92aWRlciA/IGNsb3VkUHJvdmlkZXJzLmZpbmQocCA9PiBwLm5hbWUgPT09IGN1cnJlbnRQcm92aWRlcikgOiBudWxsO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxUaGVtZVByb3ZpZGVyIHRoZW1lPXt0aGVtZUxUfT5cbiAgICAgICAgPFByb3ZpZGVyTW9kYWxDb250YWluZXJcbiAgICAgICAgICBvblNldENsb3VkUHJvdmlkZXI9e29uU2V0Q2xvdWRQcm92aWRlcn1cbiAgICAgICAgICBjbG91ZFByb3ZpZGVycz17Y2xvdWRQcm92aWRlcnN9XG4gICAgICAgICAgY3VycmVudFByb3ZpZGVyPXtjdXJyZW50UHJvdmlkZXJ9XG4gICAgICAgID5cbiAgICAgICAgICA8SW1hZ2VNb2RhbENvbnRhaW5lclxuICAgICAgICAgICAgY3VycmVudFByb3ZpZGVyPXtjdXJyZW50UHJvdmlkZXJ9XG4gICAgICAgICAgICBjbG91ZFByb3ZpZGVycz17Y2xvdWRQcm92aWRlcnN9XG4gICAgICAgICAgICBvblVwZGF0ZUltYWdlU2V0dGluZz17b25VcGRhdGVJbWFnZVNldHRpbmd9XG4gICAgICAgICAgICBjbGVhbnVwRXhwb3J0SW1hZ2U9e2NsZWFudXBFeHBvcnRJbWFnZX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8U3R5bGVkU2hhcmVNYXBNb2RhbCBjbGFzc05hbWU9XCJleHBvcnQtY2xvdWQtbW9kYWxcIj5cbiAgICAgICAgICAgICAgPFN0eWxlZElubmVyRGl2PlxuICAgICAgICAgICAgICAgIDxTdHlsZWRFeHBvcnRTZWN0aW9uPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5zaGFyZU1hcC5zaGFyZVVyaVRpdGxlJ30gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VidGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLnNoYXJlTWFwLnNoYXJlVXJpU3VidGl0bGUnfSAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Rpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZSB3YXJuaW5nXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5zaGFyZU1hcC5zaGFyZURpc2NsYWltZXInfSAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvU3R5bGVkRXhwb3J0U2VjdGlvbj5cbiAgICAgICAgICAgICAgICA8U3R5bGVkRXhwb3J0U2VjdGlvbiBkaXNhYmxlZD17aXNQcm92aWRlckxvYWRpbmd9PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5zaGFyZU1hcC5jbG91ZFRpdGxlJ30gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VidGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLnNoYXJlTWFwLmNsb3VkU3VidGl0bGUnfSAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Rpb25cIj5cbiAgICAgICAgICAgICAgICAgICAge2Nsb3VkUHJvdmlkZXJzLm1hcChjbG91ZFByb3ZpZGVyID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8Q2xvdWRUaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2Nsb3VkUHJvdmlkZXIubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0PXsoKSA9PiBvbkV4cG9ydChjbG91ZFByb3ZpZGVyKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcj17b25TZXRDbG91ZFByb3ZpZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvdWRQcm92aWRlcj17Y2xvdWRQcm92aWRlcn1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU9XCJVcGxvYWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17Y2xvdWRQcm92aWRlci5uYW1lID09PSBjdXJyZW50UHJvdmlkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nvbm5lY3RlZD17Qm9vbGVhbihjbG91ZFByb3ZpZGVyLmdldEFjY2Vzc1Rva2VuKCkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgaXNSZWFkeT17aXNSZWFkeX1cbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvU3R5bGVkRXhwb3J0U2VjdGlvbj5cbiAgICAgICAgICAgICAgICB7aXNQcm92aWRlckxvYWRpbmcgfHwgcHJvdmlkZXJFcnJvciA/IChcbiAgICAgICAgICAgICAgICAgIDxTdGF0dXNQYW5lbFxuICAgICAgICAgICAgICAgICAgICBpc0xvYWRpbmc9e2lzUHJvdmlkZXJMb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICBlcnJvcj17cHJvdmlkZXJFcnJvcn1cbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJJY29uPXtwcm92aWRlciAmJiBwcm92aWRlci5pY29ufVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgICB7c2hhcmVVcmwgJiYgKFxuICAgICAgICAgICAgICAgICAgPFN0eWxlZEV4cG9ydFNlY3Rpb24+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+U2hhcmUgVXJsPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxTaGFyaW5nVXJsIGtleT17MH0gdXJsPXtzaGFyZVVybH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICB7cHJvdmlkZXIgJiYgZm9sZGVyTGluayAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9ezF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY9e2ZvbGRlckxpbmt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3RleHREZWNvcmF0aW9uOiAndW5kZXJsaW5lJ319XG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9eydtb2RhbC5zaGFyZU1hcC5nb3RvUGFnZSd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzPXt7Y3VycmVudFByb3ZpZGVyfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvU3R5bGVkRXhwb3J0U2VjdGlvbj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L1N0eWxlZElubmVyRGl2PlxuICAgICAgICAgICAgPC9TdHlsZWRTaGFyZU1hcE1vZGFsPlxuICAgICAgICAgIDwvSW1hZ2VNb2RhbENvbnRhaW5lcj5cbiAgICAgICAgPC9Qcm92aWRlck1vZGFsQ29udGFpbmVyPlxuICAgICAgPC9UaGVtZVByb3ZpZGVyPlxuICAgICk7XG4gIH07XG5cbiAgU2hhcmVNYXBVcmxNb2RhbC5kZWZhdWx0UHJvcHMgPSB7XG4gICAgaXNQcm92aWRlckxvYWRpbmc6IGZhbHNlLFxuICAgIG9uRXhwb3J0OiBub3AsXG4gICAgY2xvdWRQcm92aWRlcnM6IFtdLFxuICAgIGN1cnJlbnRQcm92aWRlcjogbnVsbCxcbiAgICBwcm92aWRlckVycm9yOiBudWxsLFxuICAgIHN1Y2Nlc3NJbmZvOiB7fSxcbiAgICBvblNldENsb3VkUHJvdmlkZXI6IG5vcCxcbiAgICBvblVwZGF0ZUltYWdlU2V0dGluZzogbm9wXG4gIH07XG5cbiAgcmV0dXJuIFNoYXJlTWFwVXJsTW9kYWw7XG59XG4iXX0=