"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.MapInfoPanel = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _cloudTile = _interopRequireDefault(require("./cloud-tile"));

var _imageModalContainer = _interopRequireDefault(require("./image-modal-container"));

var _providerModalContainer = _interopRequireDefault(require("./provider-modal-container"));

var _statusPanel = _interopRequireWildcard(require("./status-panel"));

var _defaultSettings = require("../../constants/default-settings");

var _styledComponents2 = require("../common/styled-components");

var _imagePreview = _interopRequireDefault(require("../common/image-preview"));

var _reactIntl = require("react-intl");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  .save-map-modal-content {\n    min-height: 400px;\n    flex-direction: column;\n  }\n\n  .description {\n    width: 300px;\n  }\n\n  .image-preview-panel {\n    width: 300px;\n\n    .image-preview {\n      padding: 0;\n    }\n  }\n\n  .map-info-panel {\n    flex-direction: column;\n  }\n\n  .save-map-modal-description {\n    .modal-section-subtitle {\n      margin-left: 6px;\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledSaveMapModal = _styledComponents["default"].div.attrs({
  className: 'save-map-modal'
})(_templateObject());

var nop = function nop() {};

var MapInfoPanel = function MapInfoPanel(_ref) {
  var _ref$mapInfo = _ref.mapInfo,
      mapInfo = _ref$mapInfo === void 0 ? {
    description: '',
    title: ''
  } : _ref$mapInfo,
      characterLimits = _ref.characterLimits,
      onChangeInput = _ref.onChangeInput;
  return _react["default"].createElement("div", {
    className: "selection map-info-panel"
  }, _react["default"].createElement(_styledComponents2.StyledModalSection, {
    className: "save-map-modal-name"
  }, _react["default"].createElement("div", {
    className: "modal-section-title"
  }, "Name*"), _react["default"].createElement("div", null, _react["default"].createElement(_styledComponents2.InputLight, {
    id: "map-title",
    type: "text",
    value: mapInfo.title,
    onChange: function onChange(e) {
      return onChangeInput('title', e);
    },
    placeholder: "Type map title"
  }))), _react["default"].createElement(_styledComponents2.StyledModalSection, null, _react["default"].createElement("div", {
    className: "save-map-modal-description",
    style: {
      display: 'flex'
    }
  }, _react["default"].createElement("div", {
    className: "modal-section-title"
  }, "Description"), _react["default"].createElement("div", {
    className: "modal-section-subtitle"
  }, "(optional)")), _react["default"].createElement("div", null, _react["default"].createElement(_styledComponents2.TextAreaLight, {
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
  })), _react["default"].createElement(_styledComponents2.StyledModalInputFootnote, {
    className: "save-map-modal-description__footnote",
    error: characterLimits.description && mapInfo.description.length > characterLimits.description
  }, mapInfo.description.length, "/", characterLimits.description || _defaultSettings.MAP_INFO_CHARACTER.description, ' ', "characters")));
};

exports.MapInfoPanel = MapInfoPanel;

function SaveMapModalFactory() {
  var SaveMapModal =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(SaveMapModal, _Component);

    function SaveMapModal() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, SaveMapModal);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(SaveMapModal)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onChangeInput", function (key, e) {
        var value = e.target.value;

        _this.props.onSetMapInfo((0, _defineProperty2["default"])({}, key, value));
      });
      return _this;
    }

    (0, _createClass2["default"])(SaveMapModal, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            mapInfo = _this$props.mapInfo,
            exportImage = _this$props.exportImage,
            _this$props$character = _this$props.characterLimits,
            characterLimits = _this$props$character === void 0 ? {} : _this$props$character,
            cloudProviders = _this$props.cloudProviders,
            isProviderLoading = _this$props.isProviderLoading,
            currentProvider = _this$props.currentProvider,
            providerError = _this$props.providerError,
            onSetCloudProvider = _this$props.onSetCloudProvider,
            onUpdateImageSetting = _this$props.onUpdateImageSetting;
        var provider = currentProvider ? cloudProviders.find(function (p) {
          return p.name === currentProvider;
        }) : null;
        return _react["default"].createElement(_providerModalContainer["default"], {
          onSetCloudProvider: onSetCloudProvider,
          cloudProviders: cloudProviders,
          currentProvider: currentProvider
        }, _react["default"].createElement(_imageModalContainer["default"], {
          currentProvider: currentProvider,
          cloudProviders: cloudProviders,
          onUpdateImageSetting: onUpdateImageSetting
        }, _react["default"].createElement(StyledSaveMapModal, null, _react["default"].createElement(_styledComponents2.StyledModalContent, {
          className: "save-map-modal-content"
        }, _react["default"].createElement(_styledComponents2.StyledExportSection, {
          disabled: isProviderLoading
        }, _react["default"].createElement("div", {
          className: "description"
        }, _react["default"].createElement("div", {
          className: "title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.saveMap.title'
        })), _react["default"].createElement("div", {
          className: "subtitle"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.saveMap.subtitle'
        }))), _react["default"].createElement("div", {
          className: "selection"
        }, cloudProviders.map(function (cloudProvider) {
          return _react["default"].createElement(_cloudTile["default"], {
            key: cloudProvider.name,
            onSelect: function onSelect() {
              return onSetCloudProvider(cloudProvider.name);
            },
            onSetCloudProvider: onSetCloudProvider,
            cloudProvider: cloudProvider,
            isSelected: cloudProvider.name === currentProvider,
            isConnected: Boolean(cloudProvider.getAccessToken && cloudProvider.getAccessToken())
          });
        }))), provider && provider.getManagementUrl && _react["default"].createElement(_styledComponents2.StyledExportSection, {
          style: {
            margin: '2px 0'
          }
        }, _react["default"].createElement("div", {
          className: "description"
        }), _react["default"].createElement("div", {
          className: "selection"
        }, _react["default"].createElement("a", {
          key: 1,
          href: provider.getManagementUrl(),
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            textDecoration: 'underline'
          }
        }, "Go to your Kepler.gl ", provider.displayName, " page"))), _react["default"].createElement(_styledComponents2.StyledExportSection, null, _react["default"].createElement("div", {
          className: "description image-preview-panel"
        }, _react["default"].createElement(_imagePreview["default"], {
          exportImage: exportImage,
          width: _defaultSettings.MAP_THUMBNAIL_DIMENSION.width,
          showDimension: false
        })), isProviderLoading ? _react["default"].createElement("div", {
          className: "selection map-saving-animation"
        }, _react["default"].createElement(_statusPanel.UploadAnimation, {
          icon: provider && provider.icon
        })) : _react["default"].createElement(MapInfoPanel, {
          mapInfo: mapInfo,
          characterLimits: characterLimits,
          onChangeInput: this._onChangeInput
        })), providerError ? _react["default"].createElement(_statusPanel["default"], {
          isLoading: false,
          error: providerError,
          providerIcon: provider && provider.icon
        }) : null))));
      }
    }]);
    return SaveMapModal;
  }(_react.Component);

  (0, _defineProperty2["default"])(SaveMapModal, "propTypes", {
    exportImage: _propTypes["default"].object.isRequired,
    mapInfo: _propTypes["default"].object.isRequired,
    isProviderLoading: _propTypes["default"].bool.isRequired,
    thumbWidth: _propTypes["default"].number,
    thumbHeight: _propTypes["default"].number,
    characterLimits: _propTypes["default"].object,
    cloudProviders: _propTypes["default"].arrayOf(_propTypes["default"].object),
    currentProvider: _propTypes["default"].string,
    onSetMapInfo: _propTypes["default"].func.isRequired,
    onSetCloudProvider: _propTypes["default"].func.isRequired,
    onUpdateImageSetting: _propTypes["default"].func.isRequired
  });
  (0, _defineProperty2["default"])(SaveMapModal, "defaultProps", {
    characterLimits: _defaultSettings.MAP_INFO_CHARACTER,
    cloudProviders: [],
    currentProvider: null,
    providerError: null,
    isProviderLoading: false,
    onSetCloudProvider: nop,
    onUpdateImageSetting: nop
  });
  return SaveMapModal;
}

var _default = SaveMapModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9zYXZlLW1hcC1tb2RhbC5qcyJdLCJuYW1lcyI6WyJTdHlsZWRTYXZlTWFwTW9kYWwiLCJzdHlsZWQiLCJkaXYiLCJhdHRycyIsImNsYXNzTmFtZSIsIm5vcCIsIk1hcEluZm9QYW5lbCIsIm1hcEluZm8iLCJkZXNjcmlwdGlvbiIsInRpdGxlIiwiY2hhcmFjdGVyTGltaXRzIiwib25DaGFuZ2VJbnB1dCIsImUiLCJkaXNwbGF5IiwicmVzaXplIiwibGVuZ3RoIiwiTUFQX0lORk9fQ0hBUkFDVEVSIiwiU2F2ZU1hcE1vZGFsRmFjdG9yeSIsIlNhdmVNYXBNb2RhbCIsImtleSIsInZhbHVlIiwidGFyZ2V0IiwicHJvcHMiLCJvblNldE1hcEluZm8iLCJleHBvcnRJbWFnZSIsImNsb3VkUHJvdmlkZXJzIiwiaXNQcm92aWRlckxvYWRpbmciLCJjdXJyZW50UHJvdmlkZXIiLCJwcm92aWRlckVycm9yIiwib25TZXRDbG91ZFByb3ZpZGVyIiwib25VcGRhdGVJbWFnZVNldHRpbmciLCJwcm92aWRlciIsImZpbmQiLCJwIiwibmFtZSIsIm1hcCIsImNsb3VkUHJvdmlkZXIiLCJCb29sZWFuIiwiZ2V0QWNjZXNzVG9rZW4iLCJnZXRNYW5hZ2VtZW50VXJsIiwibWFyZ2luIiwidGV4dERlY29yYXRpb24iLCJkaXNwbGF5TmFtZSIsIk1BUF9USFVNQk5BSUxfRElNRU5TSU9OIiwid2lkdGgiLCJpY29uIiwiX29uQ2hhbmdlSW5wdXQiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiYm9vbCIsInRodW1iV2lkdGgiLCJudW1iZXIiLCJ0aHVtYkhlaWdodCIsImFycmF5T2YiLCJzdHJpbmciLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FB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QVNqQmpDLElBQUFBLFlBQVksRUFBRXlCLHNCQUFVUyxJQUFWLENBQWVQLFVBVFo7QUFVakJyQixJQUFBQSxrQkFBa0IsRUFBRW1CLHNCQUFVUyxJQUFWLENBQWVQLFVBVmxCO0FBV2pCcEIsSUFBQUEsb0JBQW9CLEVBQUVrQixzQkFBVVMsSUFBVixDQUFlUDtBQVhwQixHQUZRO0FBQUEsbUNBQ3ZCaEMsWUFEdUIsa0JBZ0JMO0FBQ3BCUixJQUFBQSxlQUFlLEVBQUVNLG1DQURHO0FBRXBCUyxJQUFBQSxjQUFjLEVBQUUsRUFGSTtBQUdwQkUsSUFBQUEsZUFBZSxFQUFFLElBSEc7QUFJcEJDLElBQUFBLGFBQWEsRUFBRSxJQUpLO0FBS3BCRixJQUFBQSxpQkFBaUIsRUFBRSxLQUxDO0FBTXBCRyxJQUFBQSxrQkFBa0IsRUFBRXhCLEdBTkE7QUFPcEJ5QixJQUFBQSxvQkFBb0IsRUFBRXpCO0FBUEYsR0FoQks7QUF3STdCLFNBQU9hLFlBQVA7QUFDRDs7ZUFFY0QsbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBDbG91ZFRpbGUgZnJvbSAnLi9jbG91ZC10aWxlJztcbmltcG9ydCBJbWFnZU1vZGFsQ29udGFpbmVyIGZyb20gJy4vaW1hZ2UtbW9kYWwtY29udGFpbmVyJztcbmltcG9ydCBQcm92aWRlck1vZGFsQ29udGFpbmVyIGZyb20gJy4vcHJvdmlkZXItbW9kYWwtY29udGFpbmVyJztcblxuaW1wb3J0IFN0YXR1c1BhbmVsLCB7VXBsb2FkQW5pbWF0aW9ufSBmcm9tICcuL3N0YXR1cy1wYW5lbCc7XG5cbmltcG9ydCB7TUFQX1RIVU1CTkFJTF9ESU1FTlNJT04sIE1BUF9JTkZPX0NIQVJBQ1RFUn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5pbXBvcnQge1xuICBTdHlsZWRNb2RhbENvbnRlbnQsXG4gIElucHV0TGlnaHQsXG4gIFRleHRBcmVhTGlnaHQsXG4gIFN0eWxlZEV4cG9ydFNlY3Rpb24sXG4gIFN0eWxlZE1vZGFsU2VjdGlvbixcbiAgU3R5bGVkTW9kYWxJbnB1dEZvb3Rub3RlXG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBJbWFnZVByZXZpZXcgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaW1hZ2UtcHJldmlldyc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2V9IGZyb20gJ3JlYWN0LWludGwnO1xuXG5jb25zdCBTdHlsZWRTYXZlTWFwTW9kYWwgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnc2F2ZS1tYXAtbW9kYWwnXG59KWBcbiAgLnNhdmUtbWFwLW1vZGFsLWNvbnRlbnQge1xuICAgIG1pbi1oZWlnaHQ6IDQwMHB4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIH1cblxuICAuZGVzY3JpcHRpb24ge1xuICAgIHdpZHRoOiAzMDBweDtcbiAgfVxuXG4gIC5pbWFnZS1wcmV2aWV3LXBhbmVsIHtcbiAgICB3aWR0aDogMzAwcHg7XG5cbiAgICAuaW1hZ2UtcHJldmlldyB7XG4gICAgICBwYWRkaW5nOiAwO1xuICAgIH1cbiAgfVxuXG4gIC5tYXAtaW5mby1wYW5lbCB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgfVxuXG4gIC5zYXZlLW1hcC1tb2RhbC1kZXNjcmlwdGlvbiB7XG4gICAgLm1vZGFsLXNlY3Rpb24tc3VidGl0bGUge1xuICAgICAgbWFyZ2luLWxlZnQ6IDZweDtcbiAgICB9XG4gIH1cbmA7XG5cbmNvbnN0IG5vcCA9ICgpID0+IHt9O1xuXG5leHBvcnQgY29uc3QgTWFwSW5mb1BhbmVsID0gKHtcbiAgbWFwSW5mbyA9IHtkZXNjcmlwdGlvbjogJycsIHRpdGxlOiAnJ30sXG4gIGNoYXJhY3RlckxpbWl0cyxcbiAgb25DaGFuZ2VJbnB1dFxufSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdGlvbiBtYXAtaW5mby1wYW5lbFwiPlxuICAgIDxTdHlsZWRNb2RhbFNlY3Rpb24gY2xhc3NOYW1lPVwic2F2ZS1tYXAtbW9kYWwtbmFtZVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1zZWN0aW9uLXRpdGxlXCI+TmFtZSo8L2Rpdj5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxJbnB1dExpZ2h0XG4gICAgICAgICAgaWQ9XCJtYXAtdGl0bGVcIlxuICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICB2YWx1ZT17bWFwSW5mby50aXRsZX1cbiAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBvbkNoYW5nZUlucHV0KCd0aXRsZScsIGUpfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVHlwZSBtYXAgdGl0bGVcIlxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9TdHlsZWRNb2RhbFNlY3Rpb24+XG4gICAgPFN0eWxlZE1vZGFsU2VjdGlvbj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2F2ZS1tYXAtbW9kYWwtZGVzY3JpcHRpb25cIiBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4J319PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLXNlY3Rpb24tdGl0bGVcIj5EZXNjcmlwdGlvbjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLXNlY3Rpb24tc3VidGl0bGVcIj4ob3B0aW9uYWwpPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxUZXh0QXJlYUxpZ2h0XG4gICAgICAgICAgcm93cz1cIjNcIlxuICAgICAgICAgIGlkPVwibWFwLWRlc2NyaXB0aW9uXCJcbiAgICAgICAgICBzdHlsZT17e3Jlc2l6ZTogJ25vbmUnfX1cbiAgICAgICAgICB2YWx1ZT17bWFwSW5mby5kZXNjcmlwdGlvbn1cbiAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBvbkNoYW5nZUlucHV0KCdkZXNjcmlwdGlvbicsIGUpfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVHlwZSBtYXAgZGVzY3JpcHRpb25cIlxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8U3R5bGVkTW9kYWxJbnB1dEZvb3Rub3RlXG4gICAgICAgIGNsYXNzTmFtZT1cInNhdmUtbWFwLW1vZGFsLWRlc2NyaXB0aW9uX19mb290bm90ZVwiXG4gICAgICAgIGVycm9yPXtcbiAgICAgICAgICBjaGFyYWN0ZXJMaW1pdHMuZGVzY3JpcHRpb24gJiYgbWFwSW5mby5kZXNjcmlwdGlvbi5sZW5ndGggPiBjaGFyYWN0ZXJMaW1pdHMuZGVzY3JpcHRpb25cbiAgICAgICAgfVxuICAgICAgPlxuICAgICAgICB7bWFwSW5mby5kZXNjcmlwdGlvbi5sZW5ndGh9L3tjaGFyYWN0ZXJMaW1pdHMuZGVzY3JpcHRpb24gfHwgTUFQX0lORk9fQ0hBUkFDVEVSLmRlc2NyaXB0aW9ufXsnICd9XG4gICAgICAgIGNoYXJhY3RlcnNcbiAgICAgIDwvU3R5bGVkTW9kYWxJbnB1dEZvb3Rub3RlPlxuICAgIDwvU3R5bGVkTW9kYWxTZWN0aW9uPlxuICA8L2Rpdj5cbik7XG5cbmZ1bmN0aW9uIFNhdmVNYXBNb2RhbEZhY3RvcnkoKSB7XG4gIGNsYXNzIFNhdmVNYXBNb2RhbCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgIGV4cG9ydEltYWdlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBtYXBJbmZvOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBpc1Byb3ZpZGVyTG9hZGluZzogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICAgIHRodW1iV2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICB0aHVtYkhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgIGNoYXJhY3RlckxpbWl0czogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgIGNsb3VkUHJvdmlkZXJzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KSxcbiAgICAgIGN1cnJlbnRQcm92aWRlcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIG9uU2V0TWFwSW5mbzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIG9uVXBkYXRlSW1hZ2VTZXR0aW5nOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gICAgfTtcblxuICAgIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBjaGFyYWN0ZXJMaW1pdHM6IE1BUF9JTkZPX0NIQVJBQ1RFUixcbiAgICAgIGNsb3VkUHJvdmlkZXJzOiBbXSxcbiAgICAgIGN1cnJlbnRQcm92aWRlcjogbnVsbCxcbiAgICAgIHByb3ZpZGVyRXJyb3I6IG51bGwsXG4gICAgICBpc1Byb3ZpZGVyTG9hZGluZzogZmFsc2UsXG4gICAgICBvblNldENsb3VkUHJvdmlkZXI6IG5vcCxcbiAgICAgIG9uVXBkYXRlSW1hZ2VTZXR0aW5nOiBub3BcbiAgICB9O1xuXG4gICAgX29uQ2hhbmdlSW5wdXQgPSAoa2V5LCBlKSA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHRhcmdldDoge3ZhbHVlfVxuICAgICAgfSA9IGU7XG4gICAgICB0aGlzLnByb3BzLm9uU2V0TWFwSW5mbyh7W2tleV06IHZhbHVlfSk7XG4gICAgfTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgbWFwSW5mbyxcbiAgICAgICAgZXhwb3J0SW1hZ2UsXG4gICAgICAgIGNoYXJhY3RlckxpbWl0cyA9IHt9LFxuICAgICAgICBjbG91ZFByb3ZpZGVycyxcbiAgICAgICAgaXNQcm92aWRlckxvYWRpbmcsXG4gICAgICAgIGN1cnJlbnRQcm92aWRlcixcbiAgICAgICAgcHJvdmlkZXJFcnJvcixcbiAgICAgICAgb25TZXRDbG91ZFByb3ZpZGVyLFxuICAgICAgICBvblVwZGF0ZUltYWdlU2V0dGluZ1xuICAgICAgfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBwcm92aWRlciA9IGN1cnJlbnRQcm92aWRlclxuICAgICAgICA/IGNsb3VkUHJvdmlkZXJzLmZpbmQocCA9PiBwLm5hbWUgPT09IGN1cnJlbnRQcm92aWRlcilcbiAgICAgICAgOiBudWxsO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UHJvdmlkZXJNb2RhbENvbnRhaW5lclxuICAgICAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcj17b25TZXRDbG91ZFByb3ZpZGVyfVxuICAgICAgICAgIGNsb3VkUHJvdmlkZXJzPXtjbG91ZFByb3ZpZGVyc31cbiAgICAgICAgICBjdXJyZW50UHJvdmlkZXI9e2N1cnJlbnRQcm92aWRlcn1cbiAgICAgICAgPlxuICAgICAgICAgIDxJbWFnZU1vZGFsQ29udGFpbmVyXG4gICAgICAgICAgICBjdXJyZW50UHJvdmlkZXI9e2N1cnJlbnRQcm92aWRlcn1cbiAgICAgICAgICAgIGNsb3VkUHJvdmlkZXJzPXtjbG91ZFByb3ZpZGVyc31cbiAgICAgICAgICAgIG9uVXBkYXRlSW1hZ2VTZXR0aW5nPXtvblVwZGF0ZUltYWdlU2V0dGluZ31cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8U3R5bGVkU2F2ZU1hcE1vZGFsPlxuICAgICAgICAgICAgICA8U3R5bGVkTW9kYWxDb250ZW50IGNsYXNzTmFtZT1cInNhdmUtbWFwLW1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICA8U3R5bGVkRXhwb3J0U2VjdGlvbiBkaXNhYmxlZD17aXNQcm92aWRlckxvYWRpbmd9PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5zYXZlTWFwLnRpdGxlJ30gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3VidGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLnNhdmVNYXAuc3VidGl0bGUnfSAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZWxlY3Rpb25cIj5cbiAgICAgICAgICAgICAgICAgICAge2Nsb3VkUHJvdmlkZXJzLm1hcChjbG91ZFByb3ZpZGVyID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8Q2xvdWRUaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2Nsb3VkUHJvdmlkZXIubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0PXsoKSA9PiBvblNldENsb3VkUHJvdmlkZXIoY2xvdWRQcm92aWRlci5uYW1lKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcj17b25TZXRDbG91ZFByb3ZpZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvdWRQcm92aWRlcj17Y2xvdWRQcm92aWRlcn1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ9e2Nsb3VkUHJvdmlkZXIubmFtZSA9PT0gY3VycmVudFByb3ZpZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDb25uZWN0ZWQ9e0Jvb2xlYW4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3VkUHJvdmlkZXIuZ2V0QWNjZXNzVG9rZW4gJiYgY2xvdWRQcm92aWRlci5nZXRBY2Nlc3NUb2tlbigpXG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9TdHlsZWRFeHBvcnRTZWN0aW9uPlxuICAgICAgICAgICAgICAgIHtwcm92aWRlciAmJiBwcm92aWRlci5nZXRNYW5hZ2VtZW50VXJsICYmIChcbiAgICAgICAgICAgICAgICAgIDxTdHlsZWRFeHBvcnRTZWN0aW9uIHN0eWxlPXt7bWFyZ2luOiAnMnB4IDAnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIiAvPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlbGVjdGlvblwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9ezF9XG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmPXtwcm92aWRlci5nZXRNYW5hZ2VtZW50VXJsKCl9XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3RleHREZWNvcmF0aW9uOiAndW5kZXJsaW5lJ319XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgR28gdG8geW91ciBLZXBsZXIuZ2wge3Byb3ZpZGVyLmRpc3BsYXlOYW1lfSBwYWdlXG4gICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvU3R5bGVkRXhwb3J0U2VjdGlvbj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDxTdHlsZWRFeHBvcnRTZWN0aW9uPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvbiBpbWFnZS1wcmV2aWV3LXBhbmVsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxJbWFnZVByZXZpZXdcbiAgICAgICAgICAgICAgICAgICAgICBleHBvcnRJbWFnZT17ZXhwb3J0SW1hZ2V9XG4gICAgICAgICAgICAgICAgICAgICAgd2lkdGg9e01BUF9USFVNQk5BSUxfRElNRU5TSU9OLndpZHRofVxuICAgICAgICAgICAgICAgICAgICAgIHNob3dEaW1lbnNpb249e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICB7aXNQcm92aWRlckxvYWRpbmcgPyAoXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VsZWN0aW9uIG1hcC1zYXZpbmctYW5pbWF0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPFVwbG9hZEFuaW1hdGlvbiBpY29uPXtwcm92aWRlciAmJiBwcm92aWRlci5pY29ufSAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgIDxNYXBJbmZvUGFuZWxcbiAgICAgICAgICAgICAgICAgICAgICBtYXBJbmZvPXttYXBJbmZvfVxuICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlckxpbWl0cz17Y2hhcmFjdGVyTGltaXRzfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlSW5wdXQ9e3RoaXMuX29uQ2hhbmdlSW5wdXR9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvU3R5bGVkRXhwb3J0U2VjdGlvbj5cbiAgICAgICAgICAgICAgICB7cHJvdmlkZXJFcnJvciA/IChcbiAgICAgICAgICAgICAgICAgIDxTdGF0dXNQYW5lbFxuICAgICAgICAgICAgICAgICAgICBpc0xvYWRpbmc9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgICBlcnJvcj17cHJvdmlkZXJFcnJvcn1cbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJJY29uPXtwcm92aWRlciAmJiBwcm92aWRlci5pY29ufVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgPC9TdHlsZWRNb2RhbENvbnRlbnQ+XG4gICAgICAgICAgICA8L1N0eWxlZFNhdmVNYXBNb2RhbD5cbiAgICAgICAgICA8L0ltYWdlTW9kYWxDb250YWluZXI+XG4gICAgICAgIDwvUHJvdmlkZXJNb2RhbENvbnRhaW5lcj5cbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHJldHVybiBTYXZlTWFwTW9kYWw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNhdmVNYXBNb2RhbEZhY3Rvcnk7XG4iXX0=