"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ModalContainerFactory;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

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

var _styledComponents = require("styled-components");

var _reactDom = require("react-dom");

var _reselect = require("reselect");

var _lodash = _interopRequireDefault(require("lodash.get"));

var _document = _interopRequireDefault(require("global/document"));

var _modalDialog = _interopRequireDefault(require("./modals/modal-dialog"));

var _schemas = _interopRequireDefault(require("../schemas"));

var _exportUtils = require("../utils/export-utils");

var _mapInfoUtils = require("../utils/map-info-utils");

var _deleteDataModal = _interopRequireDefault(require("./modals/delete-data-modal"));

var _overwriteMapModal = _interopRequireDefault(require("./modals/overwrite-map-modal"));

var _dataTableModal = _interopRequireDefault(require("./modals/data-table-modal"));

var _loadDataModal = _interopRequireDefault(require("./modals/load-data-modal"));

var _exportImageModal = _interopRequireDefault(require("./modals/export-image-modal"));

var _exportDataModal = _interopRequireDefault(require("./modals/export-data-modal"));

var _exportMapModal = _interopRequireDefault(require("./modals/export-map-modal/export-map-modal"));

var _addMapStyleModal = _interopRequireDefault(require("./modals/add-map-style-modal"));

var _saveMapModal = _interopRequireDefault(require("./modals/save-map-modal"));

var _shareMapModal = _interopRequireDefault(require("./modals/share-map-modal"));

var _mediaBreakpoints = require("../styles/media-breakpoints");

var _defaultSettings = require("../constants/default-settings");

var _keyevent = _interopRequireDefault(require("../constants/keyevent"));

function _templateObject8() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n                width: ", "px;\n              "]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n              ", ";\n              ", "\n            "]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject6() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  max-width: 960px;\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  top: 60px;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  width: 40%;\n  padding: 40px 40px 32px 40px;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    padding: 0;\n    margin: 0 auto;\n  "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    padding: 0;\n  "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  top: 80px;\n  padding: 32px 0 0 0;\n  width: 90vw;\n  max-width: 90vw;\n\n  ", "\n\n  ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var DataTableModalStyle = (0, _styledComponents.css)(_templateObject(), _mediaBreakpoints.media.portable(_templateObject2()), _mediaBreakpoints.media.palm(_templateObject3()));
var smallModalCss = (0, _styledComponents.css)(_templateObject4());
var LoadDataModalStyle = (0, _styledComponents.css)(_templateObject5());
var DefaultStyle = (0, _styledComponents.css)(_templateObject6());
ModalContainerFactory.deps = [_deleteDataModal["default"], _overwriteMapModal["default"], _dataTableModal["default"], _loadDataModal["default"], _exportImageModal["default"], _exportDataModal["default"], _exportMapModal["default"], _addMapStyleModal["default"], _modalDialog["default"], _saveMapModal["default"], _shareMapModal["default"]];

function ModalContainerFactory(DeleteDatasetModal, OverWriteMapModal, DataTableModal, LoadDataModal, ExportImageModal, ExportDataModal, ExportMapModal, AddMapStyleModal, ModalDialog, SaveMapModal, ShareMapModal) {
  var ModalWrapper =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(ModalWrapper, _Component);

    function ModalWrapper() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, ModalWrapper);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(ModalWrapper)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "componentDidMount", function () {
        _document["default"].addEventListener('keyup', _this._onKeyUp);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "cloudProviders", function (props) {
        return props.cloudProviders;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "providerWithStorage", (0, _reselect.createSelector)(_this.cloudProviders, function (cloudProviders) {
        return cloudProviders.filter(function (p) {
          return p.hasPrivateStorage();
        });
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "providerWithShare", (0, _reselect.createSelector)(_this.cloudProviders, function (cloudProviders) {
        return cloudProviders.filter(function (p) {
          return p.hasSharingUrl();
        });
      }));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onKeyUp", function (event) {
        var keyCode = event.keyCode;

        if (keyCode === _keyevent["default"].DOM_VK_ESCAPE) {
          _this._closeModal();
        }
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_closeModal", function () {
        _this.props.uiStateActions.toggleModal(null);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_deleteDataset", function (key) {
        _this.props.visStateActions.removeDataset(key);

        _this._closeModal();
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onAddCustomMapStyle", function () {
        _this.props.mapStyleActions.addCustomMapStyle();

        _this._closeModal();
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onFileUpload", function (blob) {
        _this.props.visStateActions.loadFiles(blob);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onExportImage", function () {
        if (!_this.props.uiState.exportImage.exporting) {
          (0, _exportUtils.exportImage)(_this.props, _this.props.uiState.exportImage);

          _this.props.uiStateActions.cleanupExportImage();

          _this._closeModal();
        }
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onExportData", function () {
        (0, _exportUtils.exportData)(_this.props, _this.props.uiState.exportData);

        _this._closeModal();
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onExportMap", function () {
        var uiState = _this.props.uiState;
        var format = uiState.exportMap.format;
        (format === _defaultSettings.EXPORT_MAP_FORMATS.HTML ? _exportUtils.exportHtml : _exportUtils.exportJson)(_this.props, _this.props.uiState.exportMap[format] || {});

        _this._closeModal();
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_exportFileToCloud", function (_ref) {
        var provider = _ref.provider,
            isPublic = _ref.isPublic,
            overwrite = _ref.overwrite,
            closeModal = _ref.closeModal;
        var toSave = (0, _exportUtils.exportMap)(_this.props);

        _this.props.providerActions.exportFileToCloud({
          mapData: toSave,
          provider: provider,
          options: {
            isPublic: isPublic,
            overwrite: overwrite
          },
          closeModal: closeModal,
          onSuccess: _this.props.onExportToCloudSuccess,
          onError: _this.props.onExportToCloudError
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onSaveMap", function () {
        var overwrite = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var currentProvider = _this.props.providerState.currentProvider;

        var provider = _this.props.cloudProviders.find(function (p) {
          return p.name === currentProvider;
        });

        _this._exportFileToCloud({
          provider: provider,
          isPublic: false,
          overwrite: overwrite,
          closeModal: true
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onOverwriteMap", function () {
        _this._onSaveMap(true);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onShareMapUrl", function (provider) {
        _this._exportFileToCloud({
          provider: provider,
          isPublic: true,
          overwrite: false,
          closeModal: false
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onCloseSaveMap", function () {
        _this.props.providerActions.resetProviderStatus();

        _this._closeModal();
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onLoadCloudMap", function (payload) {
        _this.props.providerActions.loadCloudMap(_objectSpread({}, payload, {
          onSuccess: _this.props.onLoadCloudMapSuccess,
          onError: _this.props.onLoadCloudMapError
        }));
      });
      return _this;
    }

    (0, _createClass2["default"])(ModalWrapper, [{
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        _document["default"].removeEventListener('keyup', this._onKeyUp);
      }
    }, {
      key: "render",

      /* eslint-disable complexity */
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
            containerW = _this$props.containerW,
            containerH = _this$props.containerH,
            mapStyle = _this$props.mapStyle,
            mapState = _this$props.mapState,
            uiState = _this$props.uiState,
            visState = _this$props.visState,
            rootNode = _this$props.rootNode,
            visStateActions = _this$props.visStateActions,
            uiStateActions = _this$props.uiStateActions,
            providerState = _this$props.providerState;
        var currentModal = uiState.currentModal,
            datasetKeyToRemove = uiState.datasetKeyToRemove;
        var datasets = visState.datasets,
            layers = visState.layers,
            editingDataset = visState.editingDataset;
        var template = null;
        var modalProps = {};

        if (currentModal && currentModal.id && currentModal.template) {
          // if currentMdoal template is already provided
          // TODO: need to check whether template is valid
          template = _react["default"].createElement(currentModal.template, null);
          modalProps = currentModal.modalProps;
        } else {
          switch (currentModal) {
            case _defaultSettings.DATA_TABLE_ID:
              var width = containerW * 0.9;
              template = _react["default"].createElement(DataTableModal, {
                width: containerW * 0.9,
                height: containerH * 0.85,
                datasets: datasets,
                dataId: editingDataset,
                showDatasetTable: visStateActions.showDatasetTable,
                sortTableColumn: visStateActions.sortTableColumn,
                pinTableColumn: visStateActions.pinTableColumn,
                copyTableColumn: visStateActions.copyTableColumn
              }); // TODO: we need to make this width consistent with the css rule defined modal.js:32 max-width: 70vw

              modalProps.cssStyle = (0, _styledComponents.css)(_templateObject7(), DataTableModalStyle, _mediaBreakpoints.media.palm(_templateObject8(), width));
              break;

            case _defaultSettings.DELETE_DATA_ID:
              // validate options
              if (datasetKeyToRemove && datasets && datasets[datasetKeyToRemove]) {
                template = _react["default"].createElement(DeleteDatasetModal, {
                  dataset: datasets[datasetKeyToRemove],
                  layers: layers
                });
                modalProps = {
                  title: 'modal.title.deleteDataset',
                  cssStyle: smallModalCss,
                  footer: true,
                  onConfirm: function onConfirm() {
                    return _this2._deleteDataset(datasetKeyToRemove);
                  },
                  onCancel: this._closeModal,
                  confirmButton: {
                    negative: true,
                    large: true,
                    children: 'modal.button.delete'
                  }
                };
              }

              break;
            // in case we add a new case after this one

            case _defaultSettings.ADD_DATA_ID:
              template = _react["default"].createElement(LoadDataModal, (0, _extends2["default"])({}, providerState, {
                onClose: this._closeModal,
                onFileUpload: this._onFileUpload,
                onLoadCloudMap: this._onLoadCloudMap,
                cloudProviders: this.providerWithStorage(this.props),
                onSetCloudProvider: this.props.providerActions.setCloudProvider,
                getSavedMaps: this.props.providerActions.getSavedMaps,
                loadFiles: uiState.loadFiles
              }, uiState.loadFiles));
              modalProps = {
                title: 'modal.title.addDataToMap',
                cssStyle: LoadDataModalStyle,
                footer: false,
                onConfirm: this._closeModal
              };
              break;

            case _defaultSettings.EXPORT_IMAGE_ID:
              template = _react["default"].createElement(ExportImageModal, {
                exportImage: uiState.exportImage,
                mapW: containerW,
                mapH: containerH,
                onUpdateSetting: uiStateActions.setExportImageSetting
              });
              modalProps = {
                title: 'modal.title.exportImage',
                footer: true,
                onCancel: this._closeModal,
                onConfirm: this._onExportImage,
                confirmButton: {
                  large: true,
                  disabled: uiState.exportImage.exporting,
                  children: 'modal.button.download'
                }
              };
              break;

            case _defaultSettings.EXPORT_DATA_ID:
              template = _react["default"].createElement(ExportDataModal, (0, _extends2["default"])({}, uiState.exportData, {
                datasets: datasets,
                applyCPUFilter: this.props.visStateActions.applyCPUFilter,
                onClose: this._closeModal,
                onChangeExportDataType: uiStateActions.setExportDataType,
                onChangeExportSelectedDataset: uiStateActions.setExportSelectedDataset,
                onChangeExportFiltered: uiStateActions.setExportFiltered
              }));
              modalProps = {
                title: 'modal.title.exportData',
                footer: true,
                onCancel: this._closeModal,
                onConfirm: this._onExportData,
                confirmButton: {
                  large: true,
                  children: 'modal.button.export'
                }
              };
              break;

            case _defaultSettings.EXPORT_MAP_ID:
              var keplerGlConfig = _schemas["default"].getConfigToSave({
                mapStyle: mapStyle,
                visState: visState,
                mapState: mapState,
                uiState: uiState
              });

              template = _react["default"].createElement(ExportMapModal, {
                config: keplerGlConfig,
                options: uiState.exportMap,
                onChangeExportMapFormat: uiStateActions.setExportMapFormat,
                onEditUserMapboxAccessToken: uiStateActions.setUserMapboxAccessToken,
                onChangeExportMapHTMLMode: uiStateActions.setExportHTMLMapMode
              });
              modalProps = {
                title: 'modal.title.exportMap',
                footer: true,
                onCancel: this._closeModal,
                onConfirm: this._onExportMap,
                confirmButton: {
                  large: true,
                  children: 'modal.button.export'
                }
              };
              break;

            case _defaultSettings.ADD_MAP_STYLE_ID:
              template = _react["default"].createElement(AddMapStyleModal, {
                mapboxApiAccessToken: this.props.mapboxApiAccessToken,
                mapboxApiUrl: this.props.mapboxApiUrl,
                mapState: this.props.mapState,
                inputStyle: mapStyle.inputStyle,
                inputMapStyle: this.props.mapStyleActions.inputMapStyle,
                loadCustomMapStyle: this.props.mapStyleActions.loadCustomMapStyle
              });
              modalProps = {
                title: 'modal.title.addCustomMapboxStyle',
                footer: true,
                onCancel: this._closeModal,
                onConfirm: this._onAddCustomMapStyle,
                confirmButton: {
                  large: true,
                  disabled: !mapStyle.inputStyle.style,
                  children: 'modal.button.addStyle'
                }
              };
              break;

            case _defaultSettings.SAVE_MAP_ID:
              template = _react["default"].createElement(SaveMapModal, (0, _extends2["default"])({}, providerState, {
                exportImage: uiState.exportImage,
                mapInfo: visState.mapInfo,
                onSetMapInfo: visStateActions.setMapInfo,
                onUpdateImageSetting: uiStateActions.setExportImageSetting,
                cloudProviders: this.providerWithStorage(this.props),
                onSetCloudProvider: this.props.providerActions.setCloudProvider
              }));
              modalProps = {
                title: 'modal.title.saveMap',
                footer: true,
                onCancel: this._closeModal,
                onConfirm: function onConfirm() {
                  return _this2._onSaveMap(false);
                },
                confirmButton: {
                  large: true,
                  disabled: uiState.exportImage.exporting || !(0, _mapInfoUtils.isValidMapInfo)(visState.mapInfo) || !providerState.currentProvider,
                  children: 'modal.button.save'
                }
              };
              break;

            case _defaultSettings.OVERWRITE_MAP_ID:
              template = _react["default"].createElement(OverWriteMapModal, (0, _extends2["default"])({}, providerState, {
                cloudProviders: this.props.cloudProviders,
                title: (0, _lodash["default"])(visState, ['mapInfo', 'title']),
                onSetCloudProvider: this.props.providerActions.setCloudProvider,
                onUpdateImageSetting: uiStateActions.setExportImageSetting
              }));
              modalProps = {
                title: 'Overwrite Existing File?',
                cssStyle: smallModalCss,
                footer: true,
                onConfirm: this._onOverwriteMap,
                onCancel: this._closeModal,
                confirmButton: {
                  large: true,
                  children: 'Yes',
                  disabled: uiState.exportImage.exporting || !(0, _mapInfoUtils.isValidMapInfo)(visState.mapInfo) || !providerState.currentProvider
                }
              };
              break;

            case _defaultSettings.SHARE_MAP_ID:
              template = _react["default"].createElement(ShareMapModal, (0, _extends2["default"])({}, providerState, {
                isReady: !uiState.exportImage.exporting,
                cloudProviders: this.providerWithShare(this.props),
                onExport: this._onShareMapUrl,
                onSetCloudProvider: this.props.providerActions.setCloudProvider,
                onUpdateImageSetting: uiStateActions.setExportImageSetting
              }));
              modalProps = {
                title: 'modal.title.shareURL',
                onCancel: this._onCloseSaveMap
              };
              break;

            default:
              break;
          }
        }

        return this.props.rootNode ? _react["default"].createElement(ModalDialog, (0, _extends2["default"])({
          parentSelector: function parentSelector() {
            return (0, _reactDom.findDOMNode)(rootNode);
          },
          isOpen: Boolean(currentModal),
          onCancel: this._closeModal
        }, modalProps, {
          cssStyle: DefaultStyle.concat(modalProps.cssStyle || '')
        }), template) : null;
      }
      /* eslint-enable complexity */

    }]);
    return ModalWrapper;
  }(_react.Component);

  (0, _defineProperty2["default"])(ModalWrapper, "propTypes", {
    rootNode: _propTypes["default"].object,
    containerW: _propTypes["default"].number,
    containerH: _propTypes["default"].number,
    mapboxApiAccessToken: _propTypes["default"].string.isRequired,
    mapboxApiUrl: _propTypes["default"].string,
    mapState: _propTypes["default"].object.isRequired,
    mapStyle: _propTypes["default"].object.isRequired,
    uiState: _propTypes["default"].object.isRequired,
    visState: _propTypes["default"].object.isRequired,
    visStateActions: _propTypes["default"].object.isRequired,
    uiStateActions: _propTypes["default"].object.isRequired,
    mapStyleActions: _propTypes["default"].object.isRequired,
    onSaveToStorage: _propTypes["default"].func,
    cloudProviders: _propTypes["default"].arrayOf(_propTypes["default"].object)
  });
  return ModalWrapper;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFsLWNvbnRhaW5lci5qcyJdLCJuYW1lcyI6WyJEYXRhVGFibGVNb2RhbFN0eWxlIiwiY3NzIiwibWVkaWEiLCJwb3J0YWJsZSIsInBhbG0iLCJzbWFsbE1vZGFsQ3NzIiwiTG9hZERhdGFNb2RhbFN0eWxlIiwiRGVmYXVsdFN0eWxlIiwiTW9kYWxDb250YWluZXJGYWN0b3J5IiwiZGVwcyIsIkRlbGV0ZURhdGFzZXRNb2RhbEZhY3RvcnkiLCJPdmVyV3JpdGVNYXBNb2RhbEZhY3RvcnkiLCJEYXRhVGFibGVNb2RhbEZhY3RvcnkiLCJMb2FkRGF0YU1vZGFsRmFjdG9yeSIsIkV4cG9ydEltYWdlTW9kYWxGYWN0b3J5IiwiRXhwb3J0RGF0YU1vZGFsRmFjdG9yeSIsIkV4cG9ydE1hcE1vZGFsRmFjdG9yeSIsIkFkZE1hcFN0eWxlTW9kYWxGYWN0b3J5IiwiTW9kYWxEaWFsb2dGYWN0b3J5IiwiU2F2ZU1hcE1vZGFsRmFjdG9yeSIsIlNoYXJlTWFwTW9kYWxGYWN0b3J5IiwiRGVsZXRlRGF0YXNldE1vZGFsIiwiT3ZlcldyaXRlTWFwTW9kYWwiLCJEYXRhVGFibGVNb2RhbCIsIkxvYWREYXRhTW9kYWwiLCJFeHBvcnRJbWFnZU1vZGFsIiwiRXhwb3J0RGF0YU1vZGFsIiwiRXhwb3J0TWFwTW9kYWwiLCJBZGRNYXBTdHlsZU1vZGFsIiwiTW9kYWxEaWFsb2ciLCJTYXZlTWFwTW9kYWwiLCJTaGFyZU1hcE1vZGFsIiwiTW9kYWxXcmFwcGVyIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uS2V5VXAiLCJwcm9wcyIsImNsb3VkUHJvdmlkZXJzIiwiZmlsdGVyIiwicCIsImhhc1ByaXZhdGVTdG9yYWdlIiwiaGFzU2hhcmluZ1VybCIsImV2ZW50Iiwia2V5Q29kZSIsIktleUV2ZW50IiwiRE9NX1ZLX0VTQ0FQRSIsIl9jbG9zZU1vZGFsIiwidWlTdGF0ZUFjdGlvbnMiLCJ0b2dnbGVNb2RhbCIsImtleSIsInZpc1N0YXRlQWN0aW9ucyIsInJlbW92ZURhdGFzZXQiLCJtYXBTdHlsZUFjdGlvbnMiLCJhZGRDdXN0b21NYXBTdHlsZSIsImJsb2IiLCJsb2FkRmlsZXMiLCJ1aVN0YXRlIiwiZXhwb3J0SW1hZ2UiLCJleHBvcnRpbmciLCJjbGVhbnVwRXhwb3J0SW1hZ2UiLCJleHBvcnREYXRhIiwiZm9ybWF0IiwiZXhwb3J0TWFwIiwiRVhQT1JUX01BUF9GT1JNQVRTIiwiSFRNTCIsImV4cG9ydEh0bWwiLCJleHBvcnRKc29uIiwicHJvdmlkZXIiLCJpc1B1YmxpYyIsIm92ZXJ3cml0ZSIsImNsb3NlTW9kYWwiLCJ0b1NhdmUiLCJwcm92aWRlckFjdGlvbnMiLCJleHBvcnRGaWxlVG9DbG91ZCIsIm1hcERhdGEiLCJvcHRpb25zIiwib25TdWNjZXNzIiwib25FeHBvcnRUb0Nsb3VkU3VjY2VzcyIsIm9uRXJyb3IiLCJvbkV4cG9ydFRvQ2xvdWRFcnJvciIsImN1cnJlbnRQcm92aWRlciIsInByb3ZpZGVyU3RhdGUiLCJmaW5kIiwibmFtZSIsIl9leHBvcnRGaWxlVG9DbG91ZCIsIl9vblNhdmVNYXAiLCJyZXNldFByb3ZpZGVyU3RhdHVzIiwicGF5bG9hZCIsImxvYWRDbG91ZE1hcCIsIm9uTG9hZENsb3VkTWFwU3VjY2VzcyIsIm9uTG9hZENsb3VkTWFwRXJyb3IiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiY29udGFpbmVyVyIsImNvbnRhaW5lckgiLCJtYXBTdHlsZSIsIm1hcFN0YXRlIiwidmlzU3RhdGUiLCJyb290Tm9kZSIsImN1cnJlbnRNb2RhbCIsImRhdGFzZXRLZXlUb1JlbW92ZSIsImRhdGFzZXRzIiwibGF5ZXJzIiwiZWRpdGluZ0RhdGFzZXQiLCJ0ZW1wbGF0ZSIsIm1vZGFsUHJvcHMiLCJpZCIsIkRBVEFfVEFCTEVfSUQiLCJ3aWR0aCIsInNob3dEYXRhc2V0VGFibGUiLCJzb3J0VGFibGVDb2x1bW4iLCJwaW5UYWJsZUNvbHVtbiIsImNvcHlUYWJsZUNvbHVtbiIsImNzc1N0eWxlIiwiREVMRVRFX0RBVEFfSUQiLCJ0aXRsZSIsImZvb3RlciIsIm9uQ29uZmlybSIsIl9kZWxldGVEYXRhc2V0Iiwib25DYW5jZWwiLCJjb25maXJtQnV0dG9uIiwibmVnYXRpdmUiLCJsYXJnZSIsImNoaWxkcmVuIiwiQUREX0RBVEFfSUQiLCJfb25GaWxlVXBsb2FkIiwiX29uTG9hZENsb3VkTWFwIiwicHJvdmlkZXJXaXRoU3RvcmFnZSIsInNldENsb3VkUHJvdmlkZXIiLCJnZXRTYXZlZE1hcHMiLCJFWFBPUlRfSU1BR0VfSUQiLCJzZXRFeHBvcnRJbWFnZVNldHRpbmciLCJfb25FeHBvcnRJbWFnZSIsImRpc2FibGVkIiwiRVhQT1JUX0RBVEFfSUQiLCJhcHBseUNQVUZpbHRlciIsInNldEV4cG9ydERhdGFUeXBlIiwic2V0RXhwb3J0U2VsZWN0ZWREYXRhc2V0Iiwic2V0RXhwb3J0RmlsdGVyZWQiLCJfb25FeHBvcnREYXRhIiwiRVhQT1JUX01BUF9JRCIsImtlcGxlckdsQ29uZmlnIiwiS2VwbGVyR2xTY2hlbWEiLCJnZXRDb25maWdUb1NhdmUiLCJzZXRFeHBvcnRNYXBGb3JtYXQiLCJzZXRVc2VyTWFwYm94QWNjZXNzVG9rZW4iLCJzZXRFeHBvcnRIVE1MTWFwTW9kZSIsIl9vbkV4cG9ydE1hcCIsIkFERF9NQVBfU1RZTEVfSUQiLCJtYXBib3hBcGlBY2Nlc3NUb2tlbiIsIm1hcGJveEFwaVVybCIsImlucHV0U3R5bGUiLCJpbnB1dE1hcFN0eWxlIiwibG9hZEN1c3RvbU1hcFN0eWxlIiwiX29uQWRkQ3VzdG9tTWFwU3R5bGUiLCJzdHlsZSIsIlNBVkVfTUFQX0lEIiwibWFwSW5mbyIsInNldE1hcEluZm8iLCJPVkVSV1JJVEVfTUFQX0lEIiwiX29uT3ZlcndyaXRlTWFwIiwiU0hBUkVfTUFQX0lEIiwicHJvdmlkZXJXaXRoU2hhcmUiLCJfb25TaGFyZU1hcFVybCIsIl9vbkNsb3NlU2F2ZU1hcCIsIkJvb2xlYW4iLCJjb25jYXQiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJudW1iZXIiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwib25TYXZlVG9TdG9yYWdlIiwiZnVuYyIsImFycmF5T2YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOztBQUdBOztBQWFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLG1CQUFtQixPQUFHQyxxQkFBSCxxQkFNckJDLHdCQUFNQyxRQU5lLHNCQVVyQkQsd0JBQU1FLElBVmUscUJBQXpCO0FBZUEsSUFBTUMsYUFBYSxPQUFHSixxQkFBSCxxQkFBbkI7QUFLQSxJQUFNSyxrQkFBa0IsT0FBR0wscUJBQUgscUJBQXhCO0FBSUEsSUFBTU0sWUFBWSxPQUFHTixxQkFBSCxxQkFBbEI7QUFJQU8scUJBQXFCLENBQUNDLElBQXRCLEdBQTZCLENBQzNCQywyQkFEMkIsRUFFM0JDLDZCQUYyQixFQUczQkMsMEJBSDJCLEVBSTNCQyx5QkFKMkIsRUFLM0JDLDRCQUwyQixFQU0zQkMsMkJBTjJCLEVBTzNCQywwQkFQMkIsRUFRM0JDLDRCQVIyQixFQVMzQkMsdUJBVDJCLEVBVTNCQyx3QkFWMkIsRUFXM0JDLHlCQVgyQixDQUE3Qjs7QUFjZSxTQUFTWixxQkFBVCxDQUNiYSxrQkFEYSxFQUViQyxpQkFGYSxFQUdiQyxjQUhhLEVBSWJDLGFBSmEsRUFLYkMsZ0JBTGEsRUFNYkMsZUFOYSxFQU9iQyxjQVBhLEVBUWJDLGdCQVJhLEVBU2JDLFdBVGEsRUFVYkMsWUFWYSxFQVdiQyxhQVhhLEVBWWI7QUFBQSxNQUNNQyxZQUROO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FB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LFVBVmpCO0FBV2pCNUgsSUFBQUEsY0FBYyxFQUFFd0gsc0JBQVVDLE1BQVYsQ0FBaUJHLFVBWGhCO0FBWWpCdkgsSUFBQUEsZUFBZSxFQUFFbUgsc0JBQVVDLE1BQVYsQ0FBaUJHLFVBWmpCO0FBYWpCQyxJQUFBQSxlQUFlLEVBQUVMLHNCQUFVTSxJQWJWO0FBY2pCeEksSUFBQUEsY0FBYyxFQUFFa0ksc0JBQVVPLE9BQVYsQ0FBa0JQLHNCQUFVQyxNQUE1QjtBQWRDLEdBRnJCO0FBcVpBLFNBQU94SSxZQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQge2Nzc30gZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtmaW5kRE9NTm9kZX0gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7Y3JlYXRlU2VsZWN0b3J9IGZyb20gJ3Jlc2VsZWN0JztcbmltcG9ydCBnZXQgZnJvbSAnbG9kYXNoLmdldCc7XG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcblxuaW1wb3J0IE1vZGFsRGlhbG9nRmFjdG9yeSBmcm9tICcuL21vZGFscy9tb2RhbC1kaWFsb2cnO1xuaW1wb3J0IEtlcGxlckdsU2NoZW1hIGZyb20gJ3NjaGVtYXMnO1xuaW1wb3J0IHtleHBvcnRKc29uLCBleHBvcnRIdG1sLCBleHBvcnREYXRhLCBleHBvcnRJbWFnZSwgZXhwb3J0TWFwfSBmcm9tICd1dGlscy9leHBvcnQtdXRpbHMnO1xuaW1wb3J0IHtpc1ZhbGlkTWFwSW5mb30gZnJvbSAndXRpbHMvbWFwLWluZm8tdXRpbHMnO1xuXG4vLyBtb2RhbHNcbmltcG9ydCBEZWxldGVEYXRhc2V0TW9kYWxGYWN0b3J5IGZyb20gJy4vbW9kYWxzL2RlbGV0ZS1kYXRhLW1vZGFsJztcbmltcG9ydCBPdmVyV3JpdGVNYXBNb2RhbEZhY3RvcnkgZnJvbSAnLi9tb2RhbHMvb3ZlcndyaXRlLW1hcC1tb2RhbCc7XG5pbXBvcnQgRGF0YVRhYmxlTW9kYWxGYWN0b3J5IGZyb20gJy4vbW9kYWxzL2RhdGEtdGFibGUtbW9kYWwnO1xuaW1wb3J0IExvYWREYXRhTW9kYWxGYWN0b3J5IGZyb20gJy4vbW9kYWxzL2xvYWQtZGF0YS1tb2RhbCc7XG5pbXBvcnQgRXhwb3J0SW1hZ2VNb2RhbEZhY3RvcnkgZnJvbSAnLi9tb2RhbHMvZXhwb3J0LWltYWdlLW1vZGFsJztcbmltcG9ydCBFeHBvcnREYXRhTW9kYWxGYWN0b3J5IGZyb20gJy4vbW9kYWxzL2V4cG9ydC1kYXRhLW1vZGFsJztcbmltcG9ydCBFeHBvcnRNYXBNb2RhbEZhY3RvcnkgZnJvbSAnLi9tb2RhbHMvZXhwb3J0LW1hcC1tb2RhbC9leHBvcnQtbWFwLW1vZGFsJztcbmltcG9ydCBBZGRNYXBTdHlsZU1vZGFsRmFjdG9yeSBmcm9tICcuL21vZGFscy9hZGQtbWFwLXN0eWxlLW1vZGFsJztcbmltcG9ydCBTYXZlTWFwTW9kYWxGYWN0b3J5IGZyb20gJy4vbW9kYWxzL3NhdmUtbWFwLW1vZGFsJztcbmltcG9ydCBTaGFyZU1hcE1vZGFsRmFjdG9yeSBmcm9tICcuL21vZGFscy9zaGFyZS1tYXAtbW9kYWwnO1xuXG4vLyBCcmVha3BvaW50c1xuaW1wb3J0IHttZWRpYX0gZnJvbSAnc3R5bGVzL21lZGlhLWJyZWFrcG9pbnRzJztcblxuLy8gVGVtcGxhdGVcbmltcG9ydCB7XG4gIEFERF9EQVRBX0lELFxuICBEQVRBX1RBQkxFX0lELFxuICBERUxFVEVfREFUQV9JRCxcbiAgRVhQT1JUX0RBVEFfSUQsXG4gIEVYUE9SVF9JTUFHRV9JRCxcbiAgRVhQT1JUX01BUF9JRCxcbiAgQUREX01BUF9TVFlMRV9JRCxcbiAgU0FWRV9NQVBfSUQsXG4gIFNIQVJFX01BUF9JRCxcbiAgT1ZFUldSSVRFX01BUF9JRFxufSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge0VYUE9SVF9NQVBfRk9STUFUU30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IEtleUV2ZW50IGZyb20gJ2NvbnN0YW50cy9rZXlldmVudCc7XG5cbmNvbnN0IERhdGFUYWJsZU1vZGFsU3R5bGUgPSBjc3NgXG4gIHRvcDogODBweDtcbiAgcGFkZGluZzogMzJweCAwIDAgMDtcbiAgd2lkdGg6IDkwdnc7XG4gIG1heC13aWR0aDogOTB2dztcblxuICAke21lZGlhLnBvcnRhYmxlYFxuICAgIHBhZGRpbmc6IDA7XG4gIGB9XG5cbiAgJHttZWRpYS5wYWxtYFxuICAgIHBhZGRpbmc6IDA7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gIGB9XG5gO1xuY29uc3Qgc21hbGxNb2RhbENzcyA9IGNzc2BcbiAgd2lkdGg6IDQwJTtcbiAgcGFkZGluZzogNDBweCA0MHB4IDMycHggNDBweDtcbmA7XG5cbmNvbnN0IExvYWREYXRhTW9kYWxTdHlsZSA9IGNzc2BcbiAgdG9wOiA2MHB4O1xuYDtcblxuY29uc3QgRGVmYXVsdFN0eWxlID0gY3NzYFxuICBtYXgtd2lkdGg6IDk2MHB4O1xuYDtcblxuTW9kYWxDb250YWluZXJGYWN0b3J5LmRlcHMgPSBbXG4gIERlbGV0ZURhdGFzZXRNb2RhbEZhY3RvcnksXG4gIE92ZXJXcml0ZU1hcE1vZGFsRmFjdG9yeSxcbiAgRGF0YVRhYmxlTW9kYWxGYWN0b3J5LFxuICBMb2FkRGF0YU1vZGFsRmFjdG9yeSxcbiAgRXhwb3J0SW1hZ2VNb2RhbEZhY3RvcnksXG4gIEV4cG9ydERhdGFNb2RhbEZhY3RvcnksXG4gIEV4cG9ydE1hcE1vZGFsRmFjdG9yeSxcbiAgQWRkTWFwU3R5bGVNb2RhbEZhY3RvcnksXG4gIE1vZGFsRGlhbG9nRmFjdG9yeSxcbiAgU2F2ZU1hcE1vZGFsRmFjdG9yeSxcbiAgU2hhcmVNYXBNb2RhbEZhY3Rvcnlcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1vZGFsQ29udGFpbmVyRmFjdG9yeShcbiAgRGVsZXRlRGF0YXNldE1vZGFsLFxuICBPdmVyV3JpdGVNYXBNb2RhbCxcbiAgRGF0YVRhYmxlTW9kYWwsXG4gIExvYWREYXRhTW9kYWwsXG4gIEV4cG9ydEltYWdlTW9kYWwsXG4gIEV4cG9ydERhdGFNb2RhbCxcbiAgRXhwb3J0TWFwTW9kYWwsXG4gIEFkZE1hcFN0eWxlTW9kYWwsXG4gIE1vZGFsRGlhbG9nLFxuICBTYXZlTWFwTW9kYWwsXG4gIFNoYXJlTWFwTW9kYWxcbikge1xuICBjbGFzcyBNb2RhbFdyYXBwZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICByb290Tm9kZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgIGNvbnRhaW5lclc6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICBjb250YWluZXJIOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgbWFwYm94QXBpQWNjZXNzVG9rZW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIG1hcGJveEFwaVVybDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIG1hcFN0YXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBtYXBTdHlsZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgdWlTdGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgdmlzU3RhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIHZpc1N0YXRlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgdWlTdGF0ZUFjdGlvbnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIG1hcFN0eWxlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgb25TYXZlVG9TdG9yYWdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgIGNsb3VkUHJvdmlkZXJzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KVxuICAgIH07XG5cbiAgICBjb21wb25lbnREaWRNb3VudCA9ICgpID0+IHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fb25LZXlVcCk7XG4gICAgfTtcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fb25LZXlVcCk7XG4gICAgfVxuXG4gICAgY2xvdWRQcm92aWRlcnMgPSBwcm9wcyA9PiBwcm9wcy5jbG91ZFByb3ZpZGVycztcbiAgICBwcm92aWRlcldpdGhTdG9yYWdlID0gY3JlYXRlU2VsZWN0b3IodGhpcy5jbG91ZFByb3ZpZGVycywgY2xvdWRQcm92aWRlcnMgPT5cbiAgICAgIGNsb3VkUHJvdmlkZXJzLmZpbHRlcihwID0+IHAuaGFzUHJpdmF0ZVN0b3JhZ2UoKSlcbiAgICApO1xuICAgIHByb3ZpZGVyV2l0aFNoYXJlID0gY3JlYXRlU2VsZWN0b3IodGhpcy5jbG91ZFByb3ZpZGVycywgY2xvdWRQcm92aWRlcnMgPT5cbiAgICAgIGNsb3VkUHJvdmlkZXJzLmZpbHRlcihwID0+IHAuaGFzU2hhcmluZ1VybCgpKVxuICAgICk7XG5cbiAgICBfb25LZXlVcCA9IGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgICAgaWYgKGtleUNvZGUgPT09IEtleUV2ZW50LkRPTV9WS19FU0NBUEUpIHtcbiAgICAgICAgdGhpcy5fY2xvc2VNb2RhbCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfY2xvc2VNb2RhbCA9ICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMudWlTdGF0ZUFjdGlvbnMudG9nZ2xlTW9kYWwobnVsbCk7XG4gICAgfTtcblxuICAgIF9kZWxldGVEYXRhc2V0ID0ga2V5ID0+IHtcbiAgICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLnJlbW92ZURhdGFzZXQoa2V5KTtcbiAgICAgIHRoaXMuX2Nsb3NlTW9kYWwoKTtcbiAgICB9O1xuXG4gICAgX29uQWRkQ3VzdG9tTWFwU3R5bGUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLm1hcFN0eWxlQWN0aW9ucy5hZGRDdXN0b21NYXBTdHlsZSgpO1xuICAgICAgdGhpcy5fY2xvc2VNb2RhbCgpO1xuICAgIH07XG5cbiAgICBfb25GaWxlVXBsb2FkID0gYmxvYiA9PiB7XG4gICAgICB0aGlzLnByb3BzLnZpc1N0YXRlQWN0aW9ucy5sb2FkRmlsZXMoYmxvYik7XG4gICAgfTtcblxuICAgIF9vbkV4cG9ydEltYWdlID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnByb3BzLnVpU3RhdGUuZXhwb3J0SW1hZ2UuZXhwb3J0aW5nKSB7XG4gICAgICAgIGV4cG9ydEltYWdlKHRoaXMucHJvcHMsIHRoaXMucHJvcHMudWlTdGF0ZS5leHBvcnRJbWFnZSk7XG4gICAgICAgIHRoaXMucHJvcHMudWlTdGF0ZUFjdGlvbnMuY2xlYW51cEV4cG9ydEltYWdlKCk7XG4gICAgICAgIHRoaXMuX2Nsb3NlTW9kYWwoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX29uRXhwb3J0RGF0YSA9ICgpID0+IHtcbiAgICAgIGV4cG9ydERhdGEodGhpcy5wcm9wcywgdGhpcy5wcm9wcy51aVN0YXRlLmV4cG9ydERhdGEpO1xuICAgICAgdGhpcy5fY2xvc2VNb2RhbCgpO1xuICAgIH07XG5cbiAgICBfb25FeHBvcnRNYXAgPSAoKSA9PiB7XG4gICAgICBjb25zdCB7dWlTdGF0ZX0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qge2Zvcm1hdH0gPSB1aVN0YXRlLmV4cG9ydE1hcDtcbiAgICAgIChmb3JtYXQgPT09IEVYUE9SVF9NQVBfRk9STUFUUy5IVE1MID8gZXhwb3J0SHRtbCA6IGV4cG9ydEpzb24pKFxuICAgICAgICB0aGlzLnByb3BzLFxuICAgICAgICB0aGlzLnByb3BzLnVpU3RhdGUuZXhwb3J0TWFwW2Zvcm1hdF0gfHwge31cbiAgICAgICk7XG4gICAgICB0aGlzLl9jbG9zZU1vZGFsKCk7XG4gICAgfTtcblxuICAgIF9leHBvcnRGaWxlVG9DbG91ZCA9ICh7cHJvdmlkZXIsIGlzUHVibGljLCBvdmVyd3JpdGUsIGNsb3NlTW9kYWx9KSA9PiB7XG4gICAgICBjb25zdCB0b1NhdmUgPSBleHBvcnRNYXAodGhpcy5wcm9wcyk7XG5cbiAgICAgIHRoaXMucHJvcHMucHJvdmlkZXJBY3Rpb25zLmV4cG9ydEZpbGVUb0Nsb3VkKHtcbiAgICAgICAgbWFwRGF0YTogdG9TYXZlLFxuICAgICAgICBwcm92aWRlcixcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGlzUHVibGljLFxuICAgICAgICAgIG92ZXJ3cml0ZVxuICAgICAgICB9LFxuICAgICAgICBjbG9zZU1vZGFsLFxuICAgICAgICBvblN1Y2Nlc3M6IHRoaXMucHJvcHMub25FeHBvcnRUb0Nsb3VkU3VjY2VzcyxcbiAgICAgICAgb25FcnJvcjogdGhpcy5wcm9wcy5vbkV4cG9ydFRvQ2xvdWRFcnJvclxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIF9vblNhdmVNYXAgPSAob3ZlcndyaXRlID0gZmFsc2UpID0+IHtcbiAgICAgIGNvbnN0IHtjdXJyZW50UHJvdmlkZXJ9ID0gdGhpcy5wcm9wcy5wcm92aWRlclN0YXRlO1xuICAgICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLnByb3BzLmNsb3VkUHJvdmlkZXJzLmZpbmQocCA9PiBwLm5hbWUgPT09IGN1cnJlbnRQcm92aWRlcik7XG4gICAgICB0aGlzLl9leHBvcnRGaWxlVG9DbG91ZCh7XG4gICAgICAgIHByb3ZpZGVyLFxuICAgICAgICBpc1B1YmxpYzogZmFsc2UsXG4gICAgICAgIG92ZXJ3cml0ZSxcbiAgICAgICAgY2xvc2VNb2RhbDogdHJ1ZVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIF9vbk92ZXJ3cml0ZU1hcCA9ICgpID0+IHtcbiAgICAgIHRoaXMuX29uU2F2ZU1hcCh0cnVlKTtcbiAgICB9O1xuXG4gICAgX29uU2hhcmVNYXBVcmwgPSBwcm92aWRlciA9PiB7XG4gICAgICB0aGlzLl9leHBvcnRGaWxlVG9DbG91ZCh7cHJvdmlkZXIsIGlzUHVibGljOiB0cnVlLCBvdmVyd3JpdGU6IGZhbHNlLCBjbG9zZU1vZGFsOiBmYWxzZX0pO1xuICAgIH07XG5cbiAgICBfb25DbG9zZVNhdmVNYXAgPSAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLnByb3ZpZGVyQWN0aW9ucy5yZXNldFByb3ZpZGVyU3RhdHVzKCk7XG4gICAgICB0aGlzLl9jbG9zZU1vZGFsKCk7XG4gICAgfTtcblxuICAgIF9vbkxvYWRDbG91ZE1hcCA9IHBheWxvYWQgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5wcm92aWRlckFjdGlvbnMubG9hZENsb3VkTWFwKHtcbiAgICAgICAgLi4ucGF5bG9hZCxcbiAgICAgICAgb25TdWNjZXNzOiB0aGlzLnByb3BzLm9uTG9hZENsb3VkTWFwU3VjY2VzcyxcbiAgICAgICAgb25FcnJvcjogdGhpcy5wcm9wcy5vbkxvYWRDbG91ZE1hcEVycm9yXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgY29udGFpbmVyVyxcbiAgICAgICAgY29udGFpbmVySCxcbiAgICAgICAgbWFwU3R5bGUsXG4gICAgICAgIG1hcFN0YXRlLFxuICAgICAgICB1aVN0YXRlLFxuICAgICAgICB2aXNTdGF0ZSxcbiAgICAgICAgcm9vdE5vZGUsXG4gICAgICAgIHZpc1N0YXRlQWN0aW9ucyxcbiAgICAgICAgdWlTdGF0ZUFjdGlvbnMsXG4gICAgICAgIHByb3ZpZGVyU3RhdGVcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBjb25zdCB7Y3VycmVudE1vZGFsLCBkYXRhc2V0S2V5VG9SZW1vdmV9ID0gdWlTdGF0ZTtcbiAgICAgIGNvbnN0IHtkYXRhc2V0cywgbGF5ZXJzLCBlZGl0aW5nRGF0YXNldH0gPSB2aXNTdGF0ZTtcblxuICAgICAgbGV0IHRlbXBsYXRlID0gbnVsbDtcbiAgICAgIGxldCBtb2RhbFByb3BzID0ge307XG5cbiAgICAgIGlmIChjdXJyZW50TW9kYWwgJiYgY3VycmVudE1vZGFsLmlkICYmIGN1cnJlbnRNb2RhbC50ZW1wbGF0ZSkge1xuICAgICAgICAvLyBpZiBjdXJyZW50TWRvYWwgdGVtcGxhdGUgaXMgYWxyZWFkeSBwcm92aWRlZFxuICAgICAgICAvLyBUT0RPOiBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgdGVtcGxhdGUgaXMgdmFsaWRcbiAgICAgICAgdGVtcGxhdGUgPSA8Y3VycmVudE1vZGFsLnRlbXBsYXRlIC8+O1xuICAgICAgICBtb2RhbFByb3BzID0gY3VycmVudE1vZGFsLm1vZGFsUHJvcHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2l0Y2ggKGN1cnJlbnRNb2RhbCkge1xuICAgICAgICAgIGNhc2UgREFUQV9UQUJMRV9JRDpcbiAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gY29udGFpbmVyVyAqIDAuOTtcbiAgICAgICAgICAgIHRlbXBsYXRlID0gKFxuICAgICAgICAgICAgICA8RGF0YVRhYmxlTW9kYWxcbiAgICAgICAgICAgICAgICB3aWR0aD17Y29udGFpbmVyVyAqIDAuOX1cbiAgICAgICAgICAgICAgICBoZWlnaHQ9e2NvbnRhaW5lckggKiAwLjg1fVxuICAgICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgICBkYXRhSWQ9e2VkaXRpbmdEYXRhc2V0fVxuICAgICAgICAgICAgICAgIHNob3dEYXRhc2V0VGFibGU9e3Zpc1N0YXRlQWN0aW9ucy5zaG93RGF0YXNldFRhYmxlfVxuICAgICAgICAgICAgICAgIHNvcnRUYWJsZUNvbHVtbj17dmlzU3RhdGVBY3Rpb25zLnNvcnRUYWJsZUNvbHVtbn1cbiAgICAgICAgICAgICAgICBwaW5UYWJsZUNvbHVtbj17dmlzU3RhdGVBY3Rpb25zLnBpblRhYmxlQ29sdW1ufVxuICAgICAgICAgICAgICAgIGNvcHlUYWJsZUNvbHVtbj17dmlzU3RhdGVBY3Rpb25zLmNvcHlUYWJsZUNvbHVtbn1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IHdlIG5lZWQgdG8gbWFrZSB0aGlzIHdpZHRoIGNvbnNpc3RlbnQgd2l0aCB0aGUgY3NzIHJ1bGUgZGVmaW5lZCBtb2RhbC5qczozMiBtYXgtd2lkdGg6IDcwdndcbiAgICAgICAgICAgIG1vZGFsUHJvcHMuY3NzU3R5bGUgPSBjc3NgXG4gICAgICAgICAgICAgICR7RGF0YVRhYmxlTW9kYWxTdHlsZX07XG4gICAgICAgICAgICAgICR7bWVkaWEucGFsbWBcbiAgICAgICAgICAgICAgICB3aWR0aDogJHt3aWR0aH1weDtcbiAgICAgICAgICAgICAgYH1cbiAgICAgICAgICAgIGA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIERFTEVURV9EQVRBX0lEOlxuICAgICAgICAgICAgLy8gdmFsaWRhdGUgb3B0aW9uc1xuICAgICAgICAgICAgaWYgKGRhdGFzZXRLZXlUb1JlbW92ZSAmJiBkYXRhc2V0cyAmJiBkYXRhc2V0c1tkYXRhc2V0S2V5VG9SZW1vdmVdKSB7XG4gICAgICAgICAgICAgIHRlbXBsYXRlID0gKFxuICAgICAgICAgICAgICAgIDxEZWxldGVEYXRhc2V0TW9kYWwgZGF0YXNldD17ZGF0YXNldHNbZGF0YXNldEtleVRvUmVtb3ZlXX0gbGF5ZXJzPXtsYXllcnN9IC8+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIG1vZGFsUHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdtb2RhbC50aXRsZS5kZWxldGVEYXRhc2V0JyxcbiAgICAgICAgICAgICAgICBjc3NTdHlsZTogc21hbGxNb2RhbENzcyxcbiAgICAgICAgICAgICAgICBmb290ZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgb25Db25maXJtOiAoKSA9PiB0aGlzLl9kZWxldGVEYXRhc2V0KGRhdGFzZXRLZXlUb1JlbW92ZSksXG4gICAgICAgICAgICAgICAgb25DYW5jZWw6IHRoaXMuX2Nsb3NlTW9kYWwsXG4gICAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbjoge1xuICAgICAgICAgICAgICAgICAgbmVnYXRpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICBsYXJnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiAnbW9kYWwuYnV0dG9uLmRlbGV0ZSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhazsgLy8gaW4gY2FzZSB3ZSBhZGQgYSBuZXcgY2FzZSBhZnRlciB0aGlzIG9uZVxuICAgICAgICAgIGNhc2UgQUREX0RBVEFfSUQ6XG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IChcbiAgICAgICAgICAgICAgPExvYWREYXRhTW9kYWxcbiAgICAgICAgICAgICAgICB7Li4ucHJvdmlkZXJTdGF0ZX1cbiAgICAgICAgICAgICAgICBvbkNsb3NlPXt0aGlzLl9jbG9zZU1vZGFsfVxuICAgICAgICAgICAgICAgIG9uRmlsZVVwbG9hZD17dGhpcy5fb25GaWxlVXBsb2FkfVxuICAgICAgICAgICAgICAgIG9uTG9hZENsb3VkTWFwPXt0aGlzLl9vbkxvYWRDbG91ZE1hcH1cbiAgICAgICAgICAgICAgICBjbG91ZFByb3ZpZGVycz17dGhpcy5wcm92aWRlcldpdGhTdG9yYWdlKHRoaXMucHJvcHMpfVxuICAgICAgICAgICAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcj17dGhpcy5wcm9wcy5wcm92aWRlckFjdGlvbnMuc2V0Q2xvdWRQcm92aWRlcn1cbiAgICAgICAgICAgICAgICBnZXRTYXZlZE1hcHM9e3RoaXMucHJvcHMucHJvdmlkZXJBY3Rpb25zLmdldFNhdmVkTWFwc31cbiAgICAgICAgICAgICAgICBsb2FkRmlsZXM9e3VpU3RhdGUubG9hZEZpbGVzfVxuICAgICAgICAgICAgICAgIHsuLi51aVN0YXRlLmxvYWRGaWxlc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBtb2RhbFByb3BzID0ge1xuICAgICAgICAgICAgICB0aXRsZTogJ21vZGFsLnRpdGxlLmFkZERhdGFUb01hcCcsXG4gICAgICAgICAgICAgIGNzc1N0eWxlOiBMb2FkRGF0YU1vZGFsU3R5bGUsXG4gICAgICAgICAgICAgIGZvb3RlcjogZmFsc2UsXG4gICAgICAgICAgICAgIG9uQ29uZmlybTogdGhpcy5fY2xvc2VNb2RhbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgRVhQT1JUX0lNQUdFX0lEOlxuICAgICAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgICAgIDxFeHBvcnRJbWFnZU1vZGFsXG4gICAgICAgICAgICAgICAgZXhwb3J0SW1hZ2U9e3VpU3RhdGUuZXhwb3J0SW1hZ2V9XG4gICAgICAgICAgICAgICAgbWFwVz17Y29udGFpbmVyV31cbiAgICAgICAgICAgICAgICBtYXBIPXtjb250YWluZXJIfVxuICAgICAgICAgICAgICAgIG9uVXBkYXRlU2V0dGluZz17dWlTdGF0ZUFjdGlvbnMuc2V0RXhwb3J0SW1hZ2VTZXR0aW5nfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1vZGFsUHJvcHMgPSB7XG4gICAgICAgICAgICAgIHRpdGxlOiAnbW9kYWwudGl0bGUuZXhwb3J0SW1hZ2UnLFxuICAgICAgICAgICAgICBmb290ZXI6IHRydWUsXG4gICAgICAgICAgICAgIG9uQ2FuY2VsOiB0aGlzLl9jbG9zZU1vZGFsLFxuICAgICAgICAgICAgICBvbkNvbmZpcm06IHRoaXMuX29uRXhwb3J0SW1hZ2UsXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b246IHtcbiAgICAgICAgICAgICAgICBsYXJnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDogdWlTdGF0ZS5leHBvcnRJbWFnZS5leHBvcnRpbmcsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46ICdtb2RhbC5idXR0b24uZG93bmxvYWQnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIEVYUE9SVF9EQVRBX0lEOlxuICAgICAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgICAgIDxFeHBvcnREYXRhTW9kYWxcbiAgICAgICAgICAgICAgICB7Li4udWlTdGF0ZS5leHBvcnREYXRhfVxuICAgICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgICBhcHBseUNQVUZpbHRlcj17dGhpcy5wcm9wcy52aXNTdGF0ZUFjdGlvbnMuYXBwbHlDUFVGaWx0ZXJ9XG4gICAgICAgICAgICAgICAgb25DbG9zZT17dGhpcy5fY2xvc2VNb2RhbH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZUV4cG9ydERhdGFUeXBlPXt1aVN0YXRlQWN0aW9ucy5zZXRFeHBvcnREYXRhVHlwZX1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZUV4cG9ydFNlbGVjdGVkRGF0YXNldD17dWlTdGF0ZUFjdGlvbnMuc2V0RXhwb3J0U2VsZWN0ZWREYXRhc2V0fVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlRXhwb3J0RmlsdGVyZWQ9e3VpU3RhdGVBY3Rpb25zLnNldEV4cG9ydEZpbHRlcmVkfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1vZGFsUHJvcHMgPSB7XG4gICAgICAgICAgICAgIHRpdGxlOiAnbW9kYWwudGl0bGUuZXhwb3J0RGF0YScsXG4gICAgICAgICAgICAgIGZvb3RlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgb25DYW5jZWw6IHRoaXMuX2Nsb3NlTW9kYWwsXG4gICAgICAgICAgICAgIG9uQ29uZmlybTogdGhpcy5fb25FeHBvcnREYXRhLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uOiB7XG4gICAgICAgICAgICAgICAgbGFyZ2U6IHRydWUsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46ICdtb2RhbC5idXR0b24uZXhwb3J0J1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBFWFBPUlRfTUFQX0lEOlxuICAgICAgICAgICAgY29uc3Qga2VwbGVyR2xDb25maWcgPSBLZXBsZXJHbFNjaGVtYS5nZXRDb25maWdUb1NhdmUoe1xuICAgICAgICAgICAgICBtYXBTdHlsZSxcbiAgICAgICAgICAgICAgdmlzU3RhdGUsXG4gICAgICAgICAgICAgIG1hcFN0YXRlLFxuICAgICAgICAgICAgICB1aVN0YXRlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRlbXBsYXRlID0gKFxuICAgICAgICAgICAgICA8RXhwb3J0TWFwTW9kYWxcbiAgICAgICAgICAgICAgICBjb25maWc9e2tlcGxlckdsQ29uZmlnfVxuICAgICAgICAgICAgICAgIG9wdGlvbnM9e3VpU3RhdGUuZXhwb3J0TWFwfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlRXhwb3J0TWFwRm9ybWF0PXt1aVN0YXRlQWN0aW9ucy5zZXRFeHBvcnRNYXBGb3JtYXR9XG4gICAgICAgICAgICAgICAgb25FZGl0VXNlck1hcGJveEFjY2Vzc1Rva2VuPXt1aVN0YXRlQWN0aW9ucy5zZXRVc2VyTWFwYm94QWNjZXNzVG9rZW59XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VFeHBvcnRNYXBIVE1MTW9kZT17dWlTdGF0ZUFjdGlvbnMuc2V0RXhwb3J0SFRNTE1hcE1vZGV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbW9kYWxQcm9wcyA9IHtcbiAgICAgICAgICAgICAgdGl0bGU6ICdtb2RhbC50aXRsZS5leHBvcnRNYXAnLFxuICAgICAgICAgICAgICBmb290ZXI6IHRydWUsXG4gICAgICAgICAgICAgIG9uQ2FuY2VsOiB0aGlzLl9jbG9zZU1vZGFsLFxuICAgICAgICAgICAgICBvbkNvbmZpcm06IHRoaXMuX29uRXhwb3J0TWFwLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uOiB7XG4gICAgICAgICAgICAgICAgbGFyZ2U6IHRydWUsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46ICdtb2RhbC5idXR0b24uZXhwb3J0J1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBBRERfTUFQX1NUWUxFX0lEOlxuICAgICAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgICAgIDxBZGRNYXBTdHlsZU1vZGFsXG4gICAgICAgICAgICAgICAgbWFwYm94QXBpQWNjZXNzVG9rZW49e3RoaXMucHJvcHMubWFwYm94QXBpQWNjZXNzVG9rZW59XG4gICAgICAgICAgICAgICAgbWFwYm94QXBpVXJsPXt0aGlzLnByb3BzLm1hcGJveEFwaVVybH1cbiAgICAgICAgICAgICAgICBtYXBTdGF0ZT17dGhpcy5wcm9wcy5tYXBTdGF0ZX1cbiAgICAgICAgICAgICAgICBpbnB1dFN0eWxlPXttYXBTdHlsZS5pbnB1dFN0eWxlfVxuICAgICAgICAgICAgICAgIGlucHV0TWFwU3R5bGU9e3RoaXMucHJvcHMubWFwU3R5bGVBY3Rpb25zLmlucHV0TWFwU3R5bGV9XG4gICAgICAgICAgICAgICAgbG9hZEN1c3RvbU1hcFN0eWxlPXt0aGlzLnByb3BzLm1hcFN0eWxlQWN0aW9ucy5sb2FkQ3VzdG9tTWFwU3R5bGV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbW9kYWxQcm9wcyA9IHtcbiAgICAgICAgICAgICAgdGl0bGU6ICdtb2RhbC50aXRsZS5hZGRDdXN0b21NYXBib3hTdHlsZScsXG4gICAgICAgICAgICAgIGZvb3RlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgb25DYW5jZWw6IHRoaXMuX2Nsb3NlTW9kYWwsXG4gICAgICAgICAgICAgIG9uQ29uZmlybTogdGhpcy5fb25BZGRDdXN0b21NYXBTdHlsZSxcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbjoge1xuICAgICAgICAgICAgICAgIGxhcmdlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiAhbWFwU3R5bGUuaW5wdXRTdHlsZS5zdHlsZSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogJ21vZGFsLmJ1dHRvbi5hZGRTdHlsZSdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgU0FWRV9NQVBfSUQ6XG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IChcbiAgICAgICAgICAgICAgPFNhdmVNYXBNb2RhbFxuICAgICAgICAgICAgICAgIHsuLi5wcm92aWRlclN0YXRlfVxuICAgICAgICAgICAgICAgIGV4cG9ydEltYWdlPXt1aVN0YXRlLmV4cG9ydEltYWdlfVxuICAgICAgICAgICAgICAgIG1hcEluZm89e3Zpc1N0YXRlLm1hcEluZm99XG4gICAgICAgICAgICAgICAgb25TZXRNYXBJbmZvPXt2aXNTdGF0ZUFjdGlvbnMuc2V0TWFwSW5mb31cbiAgICAgICAgICAgICAgICBvblVwZGF0ZUltYWdlU2V0dGluZz17dWlTdGF0ZUFjdGlvbnMuc2V0RXhwb3J0SW1hZ2VTZXR0aW5nfVxuICAgICAgICAgICAgICAgIGNsb3VkUHJvdmlkZXJzPXt0aGlzLnByb3ZpZGVyV2l0aFN0b3JhZ2UodGhpcy5wcm9wcyl9XG4gICAgICAgICAgICAgICAgb25TZXRDbG91ZFByb3ZpZGVyPXt0aGlzLnByb3BzLnByb3ZpZGVyQWN0aW9ucy5zZXRDbG91ZFByb3ZpZGVyfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1vZGFsUHJvcHMgPSB7XG4gICAgICAgICAgICAgIHRpdGxlOiAnbW9kYWwudGl0bGUuc2F2ZU1hcCcsXG4gICAgICAgICAgICAgIGZvb3RlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgb25DYW5jZWw6IHRoaXMuX2Nsb3NlTW9kYWwsXG4gICAgICAgICAgICAgIG9uQ29uZmlybTogKCkgPT4gdGhpcy5fb25TYXZlTWFwKGZhbHNlKSxcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbjoge1xuICAgICAgICAgICAgICAgIGxhcmdlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVkOlxuICAgICAgICAgICAgICAgICAgdWlTdGF0ZS5leHBvcnRJbWFnZS5leHBvcnRpbmcgfHxcbiAgICAgICAgICAgICAgICAgICFpc1ZhbGlkTWFwSW5mbyh2aXNTdGF0ZS5tYXBJbmZvKSB8fFxuICAgICAgICAgICAgICAgICAgIXByb3ZpZGVyU3RhdGUuY3VycmVudFByb3ZpZGVyLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiAnbW9kYWwuYnV0dG9uLnNhdmUnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIE9WRVJXUklURV9NQVBfSUQ6XG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IChcbiAgICAgICAgICAgICAgPE92ZXJXcml0ZU1hcE1vZGFsXG4gICAgICAgICAgICAgICAgey4uLnByb3ZpZGVyU3RhdGV9XG4gICAgICAgICAgICAgICAgY2xvdWRQcm92aWRlcnM9e3RoaXMucHJvcHMuY2xvdWRQcm92aWRlcnN9XG4gICAgICAgICAgICAgICAgdGl0bGU9e2dldCh2aXNTdGF0ZSwgWydtYXBJbmZvJywgJ3RpdGxlJ10pfVxuICAgICAgICAgICAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcj17dGhpcy5wcm9wcy5wcm92aWRlckFjdGlvbnMuc2V0Q2xvdWRQcm92aWRlcn1cbiAgICAgICAgICAgICAgICBvblVwZGF0ZUltYWdlU2V0dGluZz17dWlTdGF0ZUFjdGlvbnMuc2V0RXhwb3J0SW1hZ2VTZXR0aW5nfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1vZGFsUHJvcHMgPSB7XG4gICAgICAgICAgICAgIHRpdGxlOiAnT3ZlcndyaXRlIEV4aXN0aW5nIEZpbGU/JyxcbiAgICAgICAgICAgICAgY3NzU3R5bGU6IHNtYWxsTW9kYWxDc3MsXG4gICAgICAgICAgICAgIGZvb3RlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgb25Db25maXJtOiB0aGlzLl9vbk92ZXJ3cml0ZU1hcCxcbiAgICAgICAgICAgICAgb25DYW5jZWw6IHRoaXMuX2Nsb3NlTW9kYWwsXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b246IHtcbiAgICAgICAgICAgICAgICBsYXJnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogJ1llcycsXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6XG4gICAgICAgICAgICAgICAgICB1aVN0YXRlLmV4cG9ydEltYWdlLmV4cG9ydGluZyB8fFxuICAgICAgICAgICAgICAgICAgIWlzVmFsaWRNYXBJbmZvKHZpc1N0YXRlLm1hcEluZm8pIHx8XG4gICAgICAgICAgICAgICAgICAhcHJvdmlkZXJTdGF0ZS5jdXJyZW50UHJvdmlkZXJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgU0hBUkVfTUFQX0lEOlxuICAgICAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgICAgIDxTaGFyZU1hcE1vZGFsXG4gICAgICAgICAgICAgICAgey4uLnByb3ZpZGVyU3RhdGV9XG4gICAgICAgICAgICAgICAgaXNSZWFkeT17IXVpU3RhdGUuZXhwb3J0SW1hZ2UuZXhwb3J0aW5nfVxuICAgICAgICAgICAgICAgIGNsb3VkUHJvdmlkZXJzPXt0aGlzLnByb3ZpZGVyV2l0aFNoYXJlKHRoaXMucHJvcHMpfVxuICAgICAgICAgICAgICAgIG9uRXhwb3J0PXt0aGlzLl9vblNoYXJlTWFwVXJsfVxuICAgICAgICAgICAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcj17dGhpcy5wcm9wcy5wcm92aWRlckFjdGlvbnMuc2V0Q2xvdWRQcm92aWRlcn1cbiAgICAgICAgICAgICAgICBvblVwZGF0ZUltYWdlU2V0dGluZz17dWlTdGF0ZUFjdGlvbnMuc2V0RXhwb3J0SW1hZ2VTZXR0aW5nfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1vZGFsUHJvcHMgPSB7XG4gICAgICAgICAgICAgIHRpdGxlOiAnbW9kYWwudGl0bGUuc2hhcmVVUkwnLFxuICAgICAgICAgICAgICBvbkNhbmNlbDogdGhpcy5fb25DbG9zZVNhdmVNYXBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMucm9vdE5vZGUgPyAoXG4gICAgICAgIDxNb2RhbERpYWxvZ1xuICAgICAgICAgIHBhcmVudFNlbGVjdG9yPXsoKSA9PiBmaW5kRE9NTm9kZShyb290Tm9kZSl9XG4gICAgICAgICAgaXNPcGVuPXtCb29sZWFuKGN1cnJlbnRNb2RhbCl9XG4gICAgICAgICAgb25DYW5jZWw9e3RoaXMuX2Nsb3NlTW9kYWx9XG4gICAgICAgICAgey4uLm1vZGFsUHJvcHN9XG4gICAgICAgICAgY3NzU3R5bGU9e0RlZmF1bHRTdHlsZS5jb25jYXQobW9kYWxQcm9wcy5jc3NTdHlsZSB8fCAnJyl9XG4gICAgICAgID5cbiAgICAgICAgICB7dGVtcGxhdGV9XG4gICAgICAgIDwvTW9kYWxEaWFsb2c+XG4gICAgICApIDogbnVsbDtcbiAgICB9XG4gICAgLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG4gIH1cblxuICByZXR1cm4gTW9kYWxXcmFwcGVyO1xufVxuIl19