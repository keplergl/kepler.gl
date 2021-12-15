"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.MapInfoPanel = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _cloudTile = _interopRequireDefault(require("./cloud-tile"));

var _imageModalContainer = _interopRequireDefault(require("./image-modal-container"));

var _providerModalContainer = _interopRequireDefault(require("./provider-modal-container"));

var _statusPanel = _interopRequireWildcard(require("./status-panel"));

var _defaultSettings = require("../../constants/default-settings");

var _styledComponents2 = require("../common/styled-components");

var _imagePreview = _interopRequireDefault(require("../common/image-preview"));

var _localization = require("../../localization");

var _templateObject;

/** @typedef {import('./save-map-modal').SaveMapModalProps} SaveMapModalProps */
var StyledSaveMapModal = _styledComponents["default"].div.attrs({
  className: 'save-map-modal'
})(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  .save-map-modal-content {\n    min-height: 400px;\n    flex-direction: column;\n  }\n\n  .description {\n    width: 300px;\n  }\n\n  .image-preview-panel {\n    width: 300px;\n\n    .image-preview {\n      padding: 0;\n    }\n  }\n\n  .map-info-panel {\n    flex-direction: column;\n  }\n\n  .save-map-modal-description {\n    .modal-section-subtitle {\n      margin-left: 6px;\n    }\n  }\n"])));

var nop = function nop(_) {};

var MapInfoPanel = function MapInfoPanel(_ref) {
  var _ref$mapInfo = _ref.mapInfo,
      mapInfo = _ref$mapInfo === void 0 ? {
    description: '',
    title: ''
  } : _ref$mapInfo,
      characterLimits = _ref.characterLimits,
      onChangeInput = _ref.onChangeInput;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "selection map-info-panel"
  }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.StyledModalSection, {
    className: "save-map-modal-name"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "modal-section-title"
  }, "Name*"), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.InputLight, {
    id: "map-title",
    type: "text",
    value: mapInfo.title,
    onChange: function onChange(e) {
      return onChangeInput('title', e);
    },
    placeholder: "Type map title"
  }))), /*#__PURE__*/_react["default"].createElement(_styledComponents2.StyledModalSection, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "save-map-modal-description",
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "modal-section-title"
  }, "Description"), /*#__PURE__*/_react["default"].createElement("div", {
    className: "modal-section-subtitle"
  }, "(optional)")), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.TextAreaLight, {
    rows: "3",
    id: "map-description",
    style: {
      resize: 'none'
    },
    value: mapInfo.description,
    onChange: function onChange(e) {
      return onChangeInput('description', e);
    },
    placeholder: "Type map description"
  })), /*#__PURE__*/_react["default"].createElement(_styledComponents2.StyledModalInputFootnote, {
    className: "save-map-modal-description__footnote",
    error: characterLimits.description && mapInfo.description.length > characterLimits.description
  }, mapInfo.description.length, "/", characterLimits.description || _defaultSettings.MAP_INFO_CHARACTER.description, ' ', "characters")));
};

exports.MapInfoPanel = MapInfoPanel;

function SaveMapModalFactory() {
  /**
   * @type {React.FunctionComponent<SaveMapModalProps>}
   */
  var SaveMapModal = function SaveMapModal(_ref2) {
    var mapInfo = _ref2.mapInfo,
        exportImage = _ref2.exportImage,
        _ref2$characterLimits = _ref2.characterLimits,
        characterLimits = _ref2$characterLimits === void 0 ? {} : _ref2$characterLimits,
        cloudProviders = _ref2.cloudProviders,
        isProviderLoading = _ref2.isProviderLoading,
        currentProvider = _ref2.currentProvider,
        providerError = _ref2.providerError,
        onSetCloudProvider = _ref2.onSetCloudProvider,
        onUpdateImageSetting = _ref2.onUpdateImageSetting,
        cleanupExportImage = _ref2.cleanupExportImage,
        onSetMapInfo = _ref2.onSetMapInfo;

    var onChangeInput = function onChangeInput(key, _ref3) {
      var value = _ref3.target.value;
      onSetMapInfo((0, _defineProperty2["default"])({}, key, value));
    };

    var provider = currentProvider ? cloudProviders.find(function (p) {
      return p.name === currentProvider;
    }) : null;
    return /*#__PURE__*/_react["default"].createElement(_providerModalContainer["default"], {
      onSetCloudProvider: onSetCloudProvider,
      cloudProviders: cloudProviders,
      currentProvider: currentProvider
    }, /*#__PURE__*/_react["default"].createElement(_imageModalContainer["default"], {
      currentProvider: currentProvider,
      cloudProviders: cloudProviders,
      onUpdateImageSetting: onUpdateImageSetting,
      cleanupExportImage: cleanupExportImage
    }, /*#__PURE__*/_react["default"].createElement(StyledSaveMapModal, null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.StyledModalContent, {
      className: "save-map-modal-content"
    }, /*#__PURE__*/_react["default"].createElement(_styledComponents2.StyledExportSection, {
      disabled: isProviderLoading
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "description"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "title"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.saveMap.title'
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "subtitle"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: 'modal.saveMap.subtitle'
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "selection"
    }, cloudProviders.map(function (cloudProvider) {
      return /*#__PURE__*/_react["default"].createElement(_cloudTile["default"], {
        key: cloudProvider.name,
        onSelect: function onSelect() {
          return onSetCloudProvider(cloudProvider.name);
        },
        onSetCloudProvider: onSetCloudProvider,
        cloudProvider: cloudProvider,
        isSelected: cloudProvider.name === currentProvider,
        isConnected: Boolean(cloudProvider.getAccessToken && cloudProvider.getAccessToken())
      });
    }))), provider && provider.getManagementUrl && /*#__PURE__*/_react["default"].createElement(_styledComponents2.StyledExportSection, {
      style: {
        margin: '2px 0'
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "description"
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: "selection"
    }, /*#__PURE__*/_react["default"].createElement("a", {
      key: 1,
      href: provider.getManagementUrl(),
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        textDecoration: 'underline'
      }
    }, "Go to your Kepler.gl ", provider.displayName, " page"))), /*#__PURE__*/_react["default"].createElement(_styledComponents2.StyledExportSection, null, /*#__PURE__*/_react["default"].createElement("div", {
      className: "description image-preview-panel"
    }, /*#__PURE__*/_react["default"].createElement(_imagePreview["default"], {
      exportImage: exportImage,
      width: _defaultSettings.MAP_THUMBNAIL_DIMENSION.width,
      showDimension: false
    })), isProviderLoading ? /*#__PURE__*/_react["default"].createElement("div", {
      className: "selection map-saving-animation"
    }, /*#__PURE__*/_react["default"].createElement(_statusPanel.UploadAnimation, {
      icon: provider && provider.icon
    })) : /*#__PURE__*/_react["default"].createElement(MapInfoPanel, {
      mapInfo: mapInfo,
      characterLimits: characterLimits,
      onChangeInput: onChangeInput
    })), providerError ? /*#__PURE__*/_react["default"].createElement(_statusPanel["default"], {
      isLoading: false,
      error: providerError,
      providerIcon: provider && provider.icon
    }) : null))));
  };

  SaveMapModal.defaultProps = {
    characterLimits: _defaultSettings.MAP_INFO_CHARACTER,
    cloudProviders: [],
    providerError: null,
    isProviderLoading: false,
    onSetCloudProvider: nop,
    onUpdateImageSetting: nop
  };
  return SaveMapModal;
}

var _default = SaveMapModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9zYXZlLW1hcC1tb2RhbC5qcyJdLCJuYW1lcyI6WyJTdHlsZWRTYXZlTWFwTW9kYWwiLCJzdHlsZWQiLCJkaXYiLCJhdHRycyIsImNsYXNzTmFtZSIsIm5vcCIsIl8iLCJNYXBJbmZvUGFuZWwiLCJtYXBJbmZvIiwiZGVzY3JpcHRpb24iLCJ0aXRsZSIsImNoYXJhY3RlckxpbWl0cyIsIm9uQ2hhbmdlSW5wdXQiLCJlIiwiZGlzcGxheSIsInJlc2l6ZSIsImxlbmd0aCIsIk1BUF9JTkZPX0NIQVJBQ1RFUiIsIlNhdmVNYXBNb2RhbEZhY3RvcnkiLCJTYXZlTWFwTW9kYWwiLCJleHBvcnRJbWFnZSIsImNsb3VkUHJvdmlkZXJzIiwiaXNQcm92aWRlckxvYWRpbmciLCJjdXJyZW50UHJvdmlkZXIiLCJwcm92aWRlckVycm9yIiwib25TZXRDbG91ZFByb3ZpZGVyIiwib25VcGRhdGVJbWFnZVNldHRpbmciLCJjbGVhbnVwRXhwb3J0SW1hZ2UiLCJvblNldE1hcEluZm8iLCJrZXkiLCJ2YWx1ZSIsInRhcmdldCIsInByb3ZpZGVyIiwiZmluZCIsInAiLCJuYW1lIiwibWFwIiwiY2xvdWRQcm92aWRlciIsIkJvb2xlYW4iLCJnZXRBY2Nlc3NUb2tlbiIsImdldE1hbmFnZW1lbnRVcmwiLCJtYXJnaW4iLCJ0ZXh0RGVjb3JhdGlvbiIsImRpc3BsYXlOYW1lIiwiTUFQX1RIVU1CTkFJTF9ESU1FTlNJT04iLCJ3aWR0aCIsImljb24iLCJkZWZhdWx0UHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFFQTs7QUFRQTs7QUFDQTs7OztBQUVBO0FBRUEsSUFBTUEsa0JBQWtCLEdBQUdDLDZCQUFPQyxHQUFQLENBQVdDLEtBQVgsQ0FBaUI7QUFDMUNDLEVBQUFBLFNBQVMsRUFBRTtBQUQrQixDQUFqQixDQUFILGllQUF4Qjs7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LFNBQVMsRUFBQztBQUFmLG9CQUNFLGdDQUFDLDRCQUFEO0FBQWlCLE1BQUEsSUFBSSxFQUFFVSxRQUFRLElBQUlBLFFBQVEsQ0FBQ2M7QUFBNUMsTUFERixDQURnQixnQkFLaEIsZ0NBQUMsWUFBRDtBQUNFLE1BQUEsT0FBTyxFQUFFdEMsT0FEWDtBQUVFLE1BQUEsZUFBZSxFQUFFRyxlQUZuQjtBQUdFLE1BQUEsYUFBYSxFQUFFQztBQUhqQixNQWJKLENBekNGLEVBNkRHWSxhQUFhLGdCQUNaLGdDQUFDLHVCQUFEO0FBQ0UsTUFBQSxTQUFTLEVBQUUsS0FEYjtBQUVFLE1BQUEsS0FBSyxFQUFFQSxhQUZUO0FBR0UsTUFBQSxZQUFZLEVBQUVRLFFBQVEsSUFBSUEsUUFBUSxDQUFDYztBQUhyQyxNQURZLEdBTVYsSUFuRU4sQ0FERixDQU5GLENBTEYsQ0FERjtBQXNGRCxHQXhHRDs7QUEwR0EzQixFQUFBQSxZQUFZLENBQUM0QixZQUFiLEdBQTRCO0FBQzFCcEMsSUFBQUEsZUFBZSxFQUFFTSxtQ0FEUztBQUUxQkksSUFBQUEsY0FBYyxFQUFFLEVBRlU7QUFHMUJHLElBQUFBLGFBQWEsRUFBRSxJQUhXO0FBSTFCRixJQUFBQSxpQkFBaUIsRUFBRSxLQUpPO0FBSzFCRyxJQUFBQSxrQkFBa0IsRUFBRXBCLEdBTE07QUFNMUJxQixJQUFBQSxvQkFBb0IsRUFBRXJCO0FBTkksR0FBNUI7QUFTQSxTQUFPYyxZQUFQO0FBQ0Q7O2VBRWNELG1CIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IENsb3VkVGlsZSBmcm9tICcuL2Nsb3VkLXRpbGUnO1xuaW1wb3J0IEltYWdlTW9kYWxDb250YWluZXIgZnJvbSAnLi9pbWFnZS1tb2RhbC1jb250YWluZXInO1xuaW1wb3J0IFByb3ZpZGVyTW9kYWxDb250YWluZXIgZnJvbSAnLi9wcm92aWRlci1tb2RhbC1jb250YWluZXInO1xuaW1wb3J0IFN0YXR1c1BhbmVsLCB7VXBsb2FkQW5pbWF0aW9ufSBmcm9tICcuL3N0YXR1cy1wYW5lbCc7XG5cbmltcG9ydCB7TUFQX1RIVU1CTkFJTF9ESU1FTlNJT04sIE1BUF9JTkZPX0NIQVJBQ1RFUn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5pbXBvcnQge1xuICBTdHlsZWRNb2RhbENvbnRlbnQsXG4gIElucHV0TGlnaHQsXG4gIFRleHRBcmVhTGlnaHQsXG4gIFN0eWxlZEV4cG9ydFNlY3Rpb24sXG4gIFN0eWxlZE1vZGFsU2VjdGlvbixcbiAgU3R5bGVkTW9kYWxJbnB1dEZvb3Rub3RlXG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBJbWFnZVByZXZpZXcgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaW1hZ2UtcHJldmlldyc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ2xvY2FsaXphdGlvbic7XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NhdmUtbWFwLW1vZGFsJykuU2F2ZU1hcE1vZGFsUHJvcHN9IFNhdmVNYXBNb2RhbFByb3BzICovXG5cbmNvbnN0IFN0eWxlZFNhdmVNYXBNb2RhbCA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdzYXZlLW1hcC1tb2RhbCdcbn0pYFxuICAuc2F2ZS1tYXAtbW9kYWwtY29udGVudCB7XG4gICAgbWluLWhlaWdodDogNDAwcHg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgfVxuXG4gIC5kZXNjcmlwdGlvbiB7XG4gICAgd2lkdGg6IDMwMHB4O1xuICB9XG5cbiAgLmltYWdlLXByZXZpZXctcGFuZWwge1xuICAgIHdpZHRoOiAzMDBweDtcblxuICAgIC5pbWFnZS1wcmV2aWV3IHtcbiAgICAgIHBhZGRpbmc6IDA7XG4gICAgfVxuICB9XG5cbiAgLm1hcC1pbmZvLXBhbmVsIHtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB9XG5cbiAgLnNhdmUtbWFwLW1vZGFsLWRlc2NyaXB0aW9uIHtcbiAgICAubW9kYWwtc2VjdGlvbi1zdWJ0aXRsZSB7XG4gICAgICBtYXJnaW4tbGVmdDogNnB4O1xuICAgIH1cbiAgfVxuYDtcblxuY29uc3Qgbm9wID0gXyA9PiB7fTtcblxuZXhwb3J0IGNvbnN0IE1hcEluZm9QYW5lbCA9ICh7XG4gIG1hcEluZm8gPSB7ZGVzY3JpcHRpb246ICcnLCB0aXRsZTogJyd9LFxuICBjaGFyYWN0ZXJMaW1pdHMsXG4gIG9uQ2hhbmdlSW5wdXRcbn0pID0+IChcbiAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Rpb24gbWFwLWluZm8tcGFuZWxcIj5cbiAgICA8U3R5bGVkTW9kYWxTZWN0aW9uIGNsYXNzTmFtZT1cInNhdmUtbWFwLW1vZGFsLW5hbWVcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtc2VjdGlvbi10aXRsZVwiPk5hbWUqPC9kaXY+XG4gICAgICA8ZGl2PlxuICAgICAgICA8SW5wdXRMaWdodFxuICAgICAgICAgIGlkPVwibWFwLXRpdGxlXCJcbiAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgdmFsdWU9e21hcEluZm8udGl0bGV9XG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4gb25DaGFuZ2VJbnB1dCgndGl0bGUnLCBlKX1cbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIlR5cGUgbWFwIHRpdGxlXCJcbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvU3R5bGVkTW9kYWxTZWN0aW9uPlxuICAgIDxTdHlsZWRNb2RhbFNlY3Rpb24+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNhdmUtbWFwLW1vZGFsLWRlc2NyaXB0aW9uXCIgc3R5bGU9e3tkaXNwbGF5OiAnZmxleCd9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1zZWN0aW9uLXRpdGxlXCI+RGVzY3JpcHRpb248L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1zZWN0aW9uLXN1YnRpdGxlXCI+KG9wdGlvbmFsKTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2PlxuICAgICAgICA8VGV4dEFyZWFMaWdodFxuICAgICAgICAgIHJvd3M9XCIzXCJcbiAgICAgICAgICBpZD1cIm1hcC1kZXNjcmlwdGlvblwiXG4gICAgICAgICAgc3R5bGU9e3tyZXNpemU6ICdub25lJ319XG4gICAgICAgICAgdmFsdWU9e21hcEluZm8uZGVzY3JpcHRpb259XG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4gb25DaGFuZ2VJbnB1dCgnZGVzY3JpcHRpb24nLCBlKX1cbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIlR5cGUgbWFwIGRlc2NyaXB0aW9uXCJcbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPFN0eWxlZE1vZGFsSW5wdXRGb290bm90ZVxuICAgICAgICBjbGFzc05hbWU9XCJzYXZlLW1hcC1tb2RhbC1kZXNjcmlwdGlvbl9fZm9vdG5vdGVcIlxuICAgICAgICBlcnJvcj17XG4gICAgICAgICAgY2hhcmFjdGVyTGltaXRzLmRlc2NyaXB0aW9uICYmIG1hcEluZm8uZGVzY3JpcHRpb24ubGVuZ3RoID4gY2hhcmFjdGVyTGltaXRzLmRlc2NyaXB0aW9uXG4gICAgICAgIH1cbiAgICAgID5cbiAgICAgICAge21hcEluZm8uZGVzY3JpcHRpb24ubGVuZ3RofS97Y2hhcmFjdGVyTGltaXRzLmRlc2NyaXB0aW9uIHx8IE1BUF9JTkZPX0NIQVJBQ1RFUi5kZXNjcmlwdGlvbn17JyAnfVxuICAgICAgICBjaGFyYWN0ZXJzXG4gICAgICA8L1N0eWxlZE1vZGFsSW5wdXRGb290bm90ZT5cbiAgICA8L1N0eWxlZE1vZGFsU2VjdGlvbj5cbiAgPC9kaXY+XG4pO1xuXG5mdW5jdGlvbiBTYXZlTWFwTW9kYWxGYWN0b3J5KCkge1xuICAvKipcbiAgICogQHR5cGUge1JlYWN0LkZ1bmN0aW9uQ29tcG9uZW50PFNhdmVNYXBNb2RhbFByb3BzPn1cbiAgICovXG4gIGNvbnN0IFNhdmVNYXBNb2RhbCA9ICh7XG4gICAgbWFwSW5mbyxcbiAgICBleHBvcnRJbWFnZSxcbiAgICBjaGFyYWN0ZXJMaW1pdHMgPSB7fSxcbiAgICBjbG91ZFByb3ZpZGVycyxcbiAgICBpc1Byb3ZpZGVyTG9hZGluZyxcbiAgICBjdXJyZW50UHJvdmlkZXIsXG4gICAgcHJvdmlkZXJFcnJvcixcbiAgICBvblNldENsb3VkUHJvdmlkZXIsXG4gICAgb25VcGRhdGVJbWFnZVNldHRpbmcsXG4gICAgY2xlYW51cEV4cG9ydEltYWdlLFxuICAgIG9uU2V0TWFwSW5mb1xuICB9KSA9PiB7XG4gICAgY29uc3Qgb25DaGFuZ2VJbnB1dCA9IChrZXksIHt0YXJnZXQ6IHt2YWx1ZX19KSA9PiB7XG4gICAgICBvblNldE1hcEluZm8oe1trZXldOiB2YWx1ZX0pO1xuICAgIH07XG4gICAgY29uc3QgcHJvdmlkZXIgPSBjdXJyZW50UHJvdmlkZXIgPyBjbG91ZFByb3ZpZGVycy5maW5kKHAgPT4gcC5uYW1lID09PSBjdXJyZW50UHJvdmlkZXIpIDogbnVsbDtcblxuICAgIHJldHVybiAoXG4gICAgICA8UHJvdmlkZXJNb2RhbENvbnRhaW5lclxuICAgICAgICBvblNldENsb3VkUHJvdmlkZXI9e29uU2V0Q2xvdWRQcm92aWRlcn1cbiAgICAgICAgY2xvdWRQcm92aWRlcnM9e2Nsb3VkUHJvdmlkZXJzfVxuICAgICAgICBjdXJyZW50UHJvdmlkZXI9e2N1cnJlbnRQcm92aWRlcn1cbiAgICAgID5cbiAgICAgICAgPEltYWdlTW9kYWxDb250YWluZXJcbiAgICAgICAgICBjdXJyZW50UHJvdmlkZXI9e2N1cnJlbnRQcm92aWRlcn1cbiAgICAgICAgICBjbG91ZFByb3ZpZGVycz17Y2xvdWRQcm92aWRlcnN9XG4gICAgICAgICAgb25VcGRhdGVJbWFnZVNldHRpbmc9e29uVXBkYXRlSW1hZ2VTZXR0aW5nfVxuICAgICAgICAgIGNsZWFudXBFeHBvcnRJbWFnZT17Y2xlYW51cEV4cG9ydEltYWdlfVxuICAgICAgICA+XG4gICAgICAgICAgPFN0eWxlZFNhdmVNYXBNb2RhbD5cbiAgICAgICAgICAgIDxTdHlsZWRNb2RhbENvbnRlbnQgY2xhc3NOYW1lPVwic2F2ZS1tYXAtbW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgICA8U3R5bGVkRXhwb3J0U2VjdGlvbiBkaXNhYmxlZD17aXNQcm92aWRlckxvYWRpbmd9PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5zYXZlTWFwLnRpdGxlJ30gLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWJ0aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLnNhdmVNYXAuc3VidGl0bGUnfSAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Rpb25cIj5cbiAgICAgICAgICAgICAgICAgIHtjbG91ZFByb3ZpZGVycy5tYXAoY2xvdWRQcm92aWRlciA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxDbG91ZFRpbGVcbiAgICAgICAgICAgICAgICAgICAgICBrZXk9e2Nsb3VkUHJvdmlkZXIubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdD17KCkgPT4gb25TZXRDbG91ZFByb3ZpZGVyKGNsb3VkUHJvdmlkZXIubmFtZSl9XG4gICAgICAgICAgICAgICAgICAgICAgb25TZXRDbG91ZFByb3ZpZGVyPXtvblNldENsb3VkUHJvdmlkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgY2xvdWRQcm92aWRlcj17Y2xvdWRQcm92aWRlcn1cbiAgICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkPXtjbG91ZFByb3ZpZGVyLm5hbWUgPT09IGN1cnJlbnRQcm92aWRlcn1cbiAgICAgICAgICAgICAgICAgICAgICBpc0Nvbm5lY3RlZD17Qm9vbGVhbihcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3VkUHJvdmlkZXIuZ2V0QWNjZXNzVG9rZW4gJiYgY2xvdWRQcm92aWRlci5nZXRBY2Nlc3NUb2tlbigpXG4gICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L1N0eWxlZEV4cG9ydFNlY3Rpb24+XG4gICAgICAgICAgICAgIHtwcm92aWRlciAmJiBwcm92aWRlci5nZXRNYW5hZ2VtZW50VXJsICYmIChcbiAgICAgICAgICAgICAgICA8U3R5bGVkRXhwb3J0U2VjdGlvbiBzdHlsZT17e21hcmdpbjogJzJweCAwJ319PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiIC8+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICAgIGtleT17MX1cbiAgICAgICAgICAgICAgICAgICAgICBocmVmPXtwcm92aWRlci5nZXRNYW5hZ2VtZW50VXJsKCl9XG4gICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3RleHREZWNvcmF0aW9uOiAndW5kZXJsaW5lJ319XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICBHbyB0byB5b3VyIEtlcGxlci5nbCB7cHJvdmlkZXIuZGlzcGxheU5hbWV9IHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9TdHlsZWRFeHBvcnRTZWN0aW9uPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8U3R5bGVkRXhwb3J0U2VjdGlvbj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlc2NyaXB0aW9uIGltYWdlLXByZXZpZXctcGFuZWxcIj5cbiAgICAgICAgICAgICAgICAgIDxJbWFnZVByZXZpZXdcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0SW1hZ2U9e2V4cG9ydEltYWdlfVxuICAgICAgICAgICAgICAgICAgICB3aWR0aD17TUFQX1RIVU1CTkFJTF9ESU1FTlNJT04ud2lkdGh9XG4gICAgICAgICAgICAgICAgICAgIHNob3dEaW1lbnNpb249e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7aXNQcm92aWRlckxvYWRpbmcgPyAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdGlvbiBtYXAtc2F2aW5nLWFuaW1hdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8VXBsb2FkQW5pbWF0aW9uIGljb249e3Byb3ZpZGVyICYmIHByb3ZpZGVyLmljb259IC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgPE1hcEluZm9QYW5lbFxuICAgICAgICAgICAgICAgICAgICBtYXBJbmZvPXttYXBJbmZvfVxuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJMaW1pdHM9e2NoYXJhY3RlckxpbWl0c31cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2VJbnB1dD17b25DaGFuZ2VJbnB1dH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9TdHlsZWRFeHBvcnRTZWN0aW9uPlxuICAgICAgICAgICAgICB7cHJvdmlkZXJFcnJvciA/IChcbiAgICAgICAgICAgICAgICA8U3RhdHVzUGFuZWxcbiAgICAgICAgICAgICAgICAgIGlzTG9hZGluZz17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICBlcnJvcj17cHJvdmlkZXJFcnJvcn1cbiAgICAgICAgICAgICAgICAgIHByb3ZpZGVySWNvbj17cHJvdmlkZXIgJiYgcHJvdmlkZXIuaWNvbn1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgIDwvU3R5bGVkTW9kYWxDb250ZW50PlxuICAgICAgICAgIDwvU3R5bGVkU2F2ZU1hcE1vZGFsPlxuICAgICAgICA8L0ltYWdlTW9kYWxDb250YWluZXI+XG4gICAgICA8L1Byb3ZpZGVyTW9kYWxDb250YWluZXI+XG4gICAgKTtcbiAgfTtcblxuICBTYXZlTWFwTW9kYWwuZGVmYXVsdFByb3BzID0ge1xuICAgIGNoYXJhY3RlckxpbWl0czogTUFQX0lORk9fQ0hBUkFDVEVSLFxuICAgIGNsb3VkUHJvdmlkZXJzOiBbXSxcbiAgICBwcm92aWRlckVycm9yOiBudWxsLFxuICAgIGlzUHJvdmlkZXJMb2FkaW5nOiBmYWxzZSxcbiAgICBvblNldENsb3VkUHJvdmlkZXI6IG5vcCxcbiAgICBvblVwZGF0ZUltYWdlU2V0dGluZzogbm9wXG4gIH07XG5cbiAgcmV0dXJuIFNhdmVNYXBNb2RhbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2F2ZU1hcE1vZGFsRmFjdG9yeTtcbiJdfQ==