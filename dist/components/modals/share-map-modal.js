"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ShareMapUrlModalFactory;
exports.SharingUrl = exports.StyleSharingUrl = exports.StyledInputLabel = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

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

var _reactIntl = require("react-intl");

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  min-height: 500px;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  padding: 24px 72px 40px 72px;\n  margin: 0 -72px -40px -72px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  width: 100%;\n  display: flex;\n  margin-bottom: 14px;\n  flex-direction: column;\n\n  input {\n    border-right: 0;\n  }\n\n  .button {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: 12px;\n  color: ", ";\n  letter-spacing: 0.2px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledInputLabel = _styledComponents["default"].label(_templateObject(), function (props) {
  return props.theme.textColorLT;
});

exports.StyledInputLabel = StyledInputLabel;

var StyleSharingUrl = _styledComponents["default"].div.attrs({
  className: 'sharing-url'
})(_templateObject2());

exports.StyleSharingUrl = StyleSharingUrl;

var SharingUrl = function SharingUrl(_ref) {
  var url = _ref.url,
      message = _ref.message;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      copied = _useState2[0],
      setCopy = _useState2[1];

  return _react["default"].createElement(StyleSharingUrl, null, _react["default"].createElement(StyledInputLabel, null, message), _react["default"].createElement("div", {
    style: {
      display: 'flex'
    }
  }, _react["default"].createElement(_styledComponents2.InputLight, {
    type: "text",
    value: url,
    readOnly: true,
    selected: true
  }), _react["default"].createElement(_reactCopyToClipboard.CopyToClipboard, {
    text: url,
    onCopy: function onCopy() {
      return setCopy(true);
    }
  }, _react["default"].createElement(_styledComponents2.Button, {
    width: "80px"
  }, copied ? 'Copied!' : 'Copy'))));
};

exports.SharingUrl = SharingUrl;

var nop = function nop() {};

var StyledShareMapModal = (0, _styledComponents["default"])(_styledComponents2.StyledModalContent)(_templateObject3());

var StyledInnerDiv = _styledComponents["default"].div(_templateObject4());

function ShareMapUrlModalFactory() {
  var ShareMapUrlModal =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(ShareMapUrlModal, _Component);

    function ShareMapUrlModal() {
      (0, _classCallCheck2["default"])(this, ShareMapUrlModal);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ShareMapUrlModal).apply(this, arguments));
    }

    (0, _createClass2["default"])(ShareMapUrlModal, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            isProviderLoading = _this$props.isProviderLoading,
            isReady = _this$props.isReady,
            onExport = _this$props.onExport,
            cloudProviders = _this$props.cloudProviders,
            currentProvider = _this$props.currentProvider,
            providerError = _this$props.providerError,
            successInfo = _this$props.successInfo,
            onSetCloudProvider = _this$props.onSetCloudProvider,
            onUpdateImageSetting = _this$props.onUpdateImageSetting;
        var shareUrl = successInfo.shareUrl,
            folderLink = successInfo.folderLink;
        var provider = currentProvider ? cloudProviders.find(function (p) {
          return p.name === currentProvider;
        }) : null;
        return _react["default"].createElement(_styledComponents.ThemeProvider, {
          theme: _base.themeLT
        }, _react["default"].createElement(_providerModalContainer["default"], {
          onSetCloudProvider: onSetCloudProvider,
          cloudProviders: cloudProviders,
          currentProvider: currentProvider
        }, _react["default"].createElement(_imageModalContainer["default"], {
          currentProvider: currentProvider,
          cloudProviders: cloudProviders,
          onUpdateImageSetting: onUpdateImageSetting
        }, _react["default"].createElement(StyledShareMapModal, {
          className: "export-cloud-modal"
        }, _react["default"].createElement(StyledInnerDiv, null, _react["default"].createElement(_styledComponents2.StyledExportSection, null, _react["default"].createElement("div", {
          className: "description"
        }, _react["default"].createElement("div", {
          className: "title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.shareMap.shareUriTitle'
        })), _react["default"].createElement("div", {
          className: "subtitle"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.shareMap.shareUriSubtitle'
        }))), _react["default"].createElement("div", {
          className: "selection"
        }, _react["default"].createElement("div", {
          className: "title warning"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.shareMap.shareDisclaimer'
        })))), _react["default"].createElement(_styledComponents2.StyledExportSection, {
          disabled: isProviderLoading
        }, _react["default"].createElement("div", {
          className: "description"
        }, _react["default"].createElement("div", {
          className: "title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.shareMap.cloudTitle'
        })), _react["default"].createElement("div", {
          className: "subtitle"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.shareMap.cloudSubtitle'
        }))), _react["default"].createElement("div", {
          className: "selection"
        }, cloudProviders.map(function (cloudProvider) {
          return _react["default"].createElement(_cloudTile["default"], {
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
        }))), isProviderLoading || providerError ? _react["default"].createElement(_statusPanel["default"], {
          isLoading: isProviderLoading,
          error: providerError,
          providerIcon: provider && provider.icon
        }) : null, shareUrl && _react["default"].createElement(_styledComponents2.StyledExportSection, null, _react["default"].createElement("div", {
          className: "description"
        }, _react["default"].createElement("div", {
          className: "title"
        }, "Share Url")), _react["default"].createElement("div", {
          className: "selection"
        }, _react["default"].createElement(SharingUrl, {
          key: 0,
          url: shareUrl
        }), provider && folderLink && _react["default"].createElement("a", {
          key: 1,
          href: folderLink,
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            textDecoration: 'underline'
          }
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.shareMap.gotoPage',
          values: {
            currentProvider: currentProvider
          }
        })))))))));
      }
    }]);
    return ShareMapUrlModal;
  }(_react.Component);

  (0, _defineProperty2["default"])(ShareMapUrlModal, "defaultProps", {
    isProviderLoading: false,
    onExport: nop,
    cloudProviders: [],
    currentProvider: null,
    providerError: null,
    successInfo: {},
    onSetCloudProvider: nop,
    onUpdateImageSetting: nop
  });
  return ShareMapUrlModal;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9zaGFyZS1tYXAtbW9kYWwuanMiXSwibmFtZXMiOlsiU3R5bGVkSW5wdXRMYWJlbCIsInN0eWxlZCIsImxhYmVsIiwicHJvcHMiLCJ0aGVtZSIsInRleHRDb2xvckxUIiwiU3R5bGVTaGFyaW5nVXJsIiwiZGl2IiwiYXR0cnMiLCJjbGFzc05hbWUiLCJTaGFyaW5nVXJsIiwidXJsIiwibWVzc2FnZSIsImNvcGllZCIsInNldENvcHkiLCJkaXNwbGF5Iiwibm9wIiwiU3R5bGVkU2hhcmVNYXBNb2RhbCIsIlN0eWxlZE1vZGFsQ29udGVudCIsIlN0eWxlZElubmVyRGl2IiwiU2hhcmVNYXBVcmxNb2RhbEZhY3RvcnkiLCJTaGFyZU1hcFVybE1vZGFsIiwiaXNQcm92aWRlckxvYWRpbmciLCJpc1JlYWR5Iiwib25FeHBvcnQiLCJjbG91ZFByb3ZpZGVycyIsImN1cnJlbnRQcm92aWRlciIsInByb3ZpZGVyRXJyb3IiLCJzdWNjZXNzSW5mbyIsIm9uU2V0Q2xvdWRQcm92aWRlciIsIm9uVXBkYXRlSW1hZ2VTZXR0aW5nIiwic2hhcmVVcmwiLCJmb2xkZXJMaW5rIiwicHJvdmlkZXIiLCJmaW5kIiwicCIsIm5hbWUiLCJ0aGVtZUxUIiwibWFwIiwiY2xvdWRQcm92aWRlciIsIkJvb2xlYW4iLCJnZXRBY2Nlc3NUb2tlbiIsImljb24iLCJ0ZXh0RGVjb3JhdGlvbiIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFNQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRU8sSUFBTUEsZ0JBQWdCLEdBQUdDLDZCQUFPQyxLQUFWLG9CQUVsQixVQUFBQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFdBQWhCO0FB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QztBQUVwQkUsSUFBQUEsUUFBUSxFQUFFUixHQUZVO0FBR3BCUyxJQUFBQSxjQUFjLEVBQUUsRUFISTtBQUlwQkMsSUFBQUEsZUFBZSxFQUFFLElBSkc7QUFLcEJDLElBQUFBLGFBQWEsRUFBRSxJQUxLO0FBTXBCQyxJQUFBQSxXQUFXLEVBQUUsRUFOTztBQU9wQkMsSUFBQUEsa0JBQWtCLEVBQUViLEdBUEE7QUFRcEJjLElBQUFBLG9CQUFvQixFQUFFZDtBQVJGLEdBRndCO0FBMkhoRCxTQUFPSyxnQkFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7dXNlU3RhdGUsIENvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCwge1RoZW1lUHJvdmlkZXJ9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7Q29weVRvQ2xpcGJvYXJkfSBmcm9tICdyZWFjdC1jb3B5LXRvLWNsaXBib2FyZCc7XG5pbXBvcnQge3RoZW1lTFR9IGZyb20gJ3N0eWxlcy9iYXNlJztcbmltcG9ydCBJbWFnZU1vZGFsQ29udGFpbmVyIGZyb20gJy4vaW1hZ2UtbW9kYWwtY29udGFpbmVyJztcbmltcG9ydCBQcm92aWRlck1vZGFsQ29udGFpbmVyIGZyb20gJy4vcHJvdmlkZXItbW9kYWwtY29udGFpbmVyJztcblxuaW1wb3J0IHtcbiAgU3R5bGVkTW9kYWxDb250ZW50LFxuICBTdHlsZWRFeHBvcnRTZWN0aW9uLFxuICBJbnB1dExpZ2h0LFxuICBCdXR0b25cbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IENsb3VkVGlsZSBmcm9tICcuL2Nsb3VkLXRpbGUnO1xuaW1wb3J0IFN0YXR1c1BhbmVsIGZyb20gJy4vc3RhdHVzLXBhbmVsJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5cbmV4cG9ydCBjb25zdCBTdHlsZWRJbnB1dExhYmVsID0gc3R5bGVkLmxhYmVsYFxuICBmb250LXNpemU6IDEycHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckxUfTtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMnB4O1xuYDtcblxuZXhwb3J0IGNvbnN0IFN0eWxlU2hhcmluZ1VybCA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzaGFyaW5nLXVybCdcbn0pYFxuICB3aWR0aDogMTAwJTtcbiAgZGlzcGxheTogZmxleDtcbiAgbWFyZ2luLWJvdHRvbTogMTRweDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblxuICBpbnB1dCB7XG4gICAgYm9yZGVyLXJpZ2h0OiAwO1xuICB9XG5cbiAgLmJ1dHRvbiB7XG4gICAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogMDtcbiAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xuICB9XG5gO1xuXG5leHBvcnQgY29uc3QgU2hhcmluZ1VybCA9ICh7dXJsLCBtZXNzYWdlfSkgPT4ge1xuICBjb25zdCBbY29waWVkLCBzZXRDb3B5XSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgcmV0dXJuIChcbiAgICA8U3R5bGVTaGFyaW5nVXJsPlxuICAgICAgPFN0eWxlZElucHV0TGFiZWw+e21lc3NhZ2V9PC9TdHlsZWRJbnB1dExhYmVsPlxuICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4J319PlxuICAgICAgICA8SW5wdXRMaWdodCB0eXBlPVwidGV4dFwiIHZhbHVlPXt1cmx9IHJlYWRPbmx5IHNlbGVjdGVkIC8+XG4gICAgICAgIDxDb3B5VG9DbGlwYm9hcmQgdGV4dD17dXJsfSBvbkNvcHk9eygpID0+IHNldENvcHkodHJ1ZSl9PlxuICAgICAgICAgIDxCdXR0b24gd2lkdGg9XCI4MHB4XCI+e2NvcGllZCA/ICdDb3BpZWQhJyA6ICdDb3B5J308L0J1dHRvbj5cbiAgICAgICAgPC9Db3B5VG9DbGlwYm9hcmQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L1N0eWxlU2hhcmluZ1VybD5cbiAgKTtcbn07XG5jb25zdCBub3AgPSAoKSA9PiB7fTtcblxuY29uc3QgU3R5bGVkU2hhcmVNYXBNb2RhbCA9IHN0eWxlZChTdHlsZWRNb2RhbENvbnRlbnQpYFxuICBwYWRkaW5nOiAyNHB4IDcycHggNDBweCA3MnB4O1xuICBtYXJnaW46IDAgLTcycHggLTQwcHggLTcycHg7XG5gO1xuXG5jb25zdCBTdHlsZWRJbm5lckRpdiA9IHN0eWxlZC5kaXZgXG4gIG1pbi1oZWlnaHQ6IDUwMHB4O1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2hhcmVNYXBVcmxNb2RhbEZhY3RvcnkoKSB7XG4gIGNsYXNzIFNoYXJlTWFwVXJsTW9kYWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBpc1Byb3ZpZGVyTG9hZGluZzogZmFsc2UsXG4gICAgICBvbkV4cG9ydDogbm9wLFxuICAgICAgY2xvdWRQcm92aWRlcnM6IFtdLFxuICAgICAgY3VycmVudFByb3ZpZGVyOiBudWxsLFxuICAgICAgcHJvdmlkZXJFcnJvcjogbnVsbCxcbiAgICAgIHN1Y2Nlc3NJbmZvOiB7fSxcbiAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcjogbm9wLFxuICAgICAgb25VcGRhdGVJbWFnZVNldHRpbmc6IG5vcFxuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGlzUHJvdmlkZXJMb2FkaW5nLFxuICAgICAgICBpc1JlYWR5LFxuICAgICAgICBvbkV4cG9ydCxcbiAgICAgICAgY2xvdWRQcm92aWRlcnMsXG4gICAgICAgIGN1cnJlbnRQcm92aWRlcixcbiAgICAgICAgcHJvdmlkZXJFcnJvcixcbiAgICAgICAgc3VjY2Vzc0luZm8sXG4gICAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcixcbiAgICAgICAgb25VcGRhdGVJbWFnZVNldHRpbmdcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qge3NoYXJlVXJsLCBmb2xkZXJMaW5rfSA9IHN1Y2Nlc3NJbmZvO1xuICAgICAgY29uc3QgcHJvdmlkZXIgPSBjdXJyZW50UHJvdmlkZXJcbiAgICAgICAgPyBjbG91ZFByb3ZpZGVycy5maW5kKHAgPT4gcC5uYW1lID09PSBjdXJyZW50UHJvdmlkZXIpXG4gICAgICAgIDogbnVsbDtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRoZW1lUHJvdmlkZXIgdGhlbWU9e3RoZW1lTFR9PlxuICAgICAgICAgIDxQcm92aWRlck1vZGFsQ29udGFpbmVyXG4gICAgICAgICAgICBvblNldENsb3VkUHJvdmlkZXI9e29uU2V0Q2xvdWRQcm92aWRlcn1cbiAgICAgICAgICAgIGNsb3VkUHJvdmlkZXJzPXtjbG91ZFByb3ZpZGVyc31cbiAgICAgICAgICAgIGN1cnJlbnRQcm92aWRlcj17Y3VycmVudFByb3ZpZGVyfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxJbWFnZU1vZGFsQ29udGFpbmVyXG4gICAgICAgICAgICAgIGN1cnJlbnRQcm92aWRlcj17Y3VycmVudFByb3ZpZGVyfVxuICAgICAgICAgICAgICBjbG91ZFByb3ZpZGVycz17Y2xvdWRQcm92aWRlcnN9XG4gICAgICAgICAgICAgIG9uVXBkYXRlSW1hZ2VTZXR0aW5nPXtvblVwZGF0ZUltYWdlU2V0dGluZ31cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFN0eWxlZFNoYXJlTWFwTW9kYWwgY2xhc3NOYW1lPVwiZXhwb3J0LWNsb3VkLW1vZGFsXCI+XG4gICAgICAgICAgICAgICAgPFN0eWxlZElubmVyRGl2PlxuICAgICAgICAgICAgICAgICAgPFN0eWxlZEV4cG9ydFNlY3Rpb24+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLnNoYXJlTWFwLnNoYXJlVXJpVGl0bGUnfSAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VidGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuc2hhcmVNYXAuc2hhcmVVcmlTdWJ0aXRsZSd9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGUgd2FybmluZ1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5zaGFyZU1hcC5zaGFyZURpc2NsYWltZXInfSAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvU3R5bGVkRXhwb3J0U2VjdGlvbj5cbiAgICAgICAgICAgICAgICAgIDxTdHlsZWRFeHBvcnRTZWN0aW9uIGRpc2FibGVkPXtpc1Byb3ZpZGVyTG9hZGluZ30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLnNoYXJlTWFwLmNsb3VkVGl0bGUnfSAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VidGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuc2hhcmVNYXAuY2xvdWRTdWJ0aXRsZSd9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtjbG91ZFByb3ZpZGVycy5tYXAoY2xvdWRQcm92aWRlciA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q2xvdWRUaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17Y2xvdWRQcm92aWRlci5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdD17KCkgPT4gb25FeHBvcnQoY2xvdWRQcm92aWRlcil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcj17b25TZXRDbG91ZFByb3ZpZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbG91ZFByb3ZpZGVyPXtjbG91ZFByb3ZpZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25OYW1lPVwiVXBsb2FkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTZWxlY3RlZD17Y2xvdWRQcm92aWRlci5uYW1lID09PSBjdXJyZW50UHJvdmlkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29ubmVjdGVkPXtCb29sZWFuKGNsb3VkUHJvdmlkZXIuZ2V0QWNjZXNzVG9rZW4oKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVhZHk9e2lzUmVhZHl9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvU3R5bGVkRXhwb3J0U2VjdGlvbj5cbiAgICAgICAgICAgICAgICAgIHtpc1Byb3ZpZGVyTG9hZGluZyB8fCBwcm92aWRlckVycm9yID8gKFxuICAgICAgICAgICAgICAgICAgICA8U3RhdHVzUGFuZWxcbiAgICAgICAgICAgICAgICAgICAgICBpc0xvYWRpbmc9e2lzUHJvdmlkZXJMb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgICAgIGVycm9yPXtwcm92aWRlckVycm9yfVxuICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVySWNvbj17cHJvdmlkZXIgJiYgcHJvdmlkZXIuaWNvbn1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICAgICAge3NoYXJlVXJsICYmIChcbiAgICAgICAgICAgICAgICAgICAgPFN0eWxlZEV4cG9ydFNlY3Rpb24+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPlNoYXJlIFVybDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VsZWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8U2hhcmluZ1VybCBrZXk9ezB9IHVybD17c2hhcmVVcmx9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7cHJvdmlkZXIgJiYgZm9sZGVyTGluayAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXsxfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY9e2ZvbGRlckxpbmt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3RleHREZWNvcmF0aW9uOiAndW5kZXJsaW5lJ319XG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9eydtb2RhbC5zaGFyZU1hcC5nb3RvUGFnZSd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM9e3tjdXJyZW50UHJvdmlkZXJ9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvU3R5bGVkRXhwb3J0U2VjdGlvbj5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPC9TdHlsZWRJbm5lckRpdj5cbiAgICAgICAgICAgICAgPC9TdHlsZWRTaGFyZU1hcE1vZGFsPlxuICAgICAgICAgICAgPC9JbWFnZU1vZGFsQ29udGFpbmVyPlxuICAgICAgICAgIDwvUHJvdmlkZXJNb2RhbENvbnRhaW5lcj5cbiAgICAgICAgPC9UaGVtZVByb3ZpZGVyPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gU2hhcmVNYXBVcmxNb2RhbDtcbn1cbiJdfQ==