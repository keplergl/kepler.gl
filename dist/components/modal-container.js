"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ModalContainerFactory;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = require("styled-components");

var _reactDom = require("react-dom");

var _reselect = require("reselect");

var _lodash = _interopRequireDefault(require("lodash.get"));

var _document = _interopRequireDefault(require("global/document"));

var _defaultSettings = require("../constants/default-settings");

var _modalDialog = _interopRequireDefault(require("./modals/modal-dialog"));

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

var _keyevent = _interopRequireDefault(require("../constants/keyevent"));

var _visStateSelectors = require("../reducers/vis-state-selectors");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var DataTableModalStyle = (0, _styledComponents.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  top: 80px;\n  padding: 32px 0 0 0;\n  width: 90vw;\n  max-width: 90vw;\n\n  ", " ", ";\n"])), _mediaBreakpoints.media.portable(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n    padding: 0;\n  "]))), _mediaBreakpoints.media.palm(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n    padding: 0;\n    margin: 0 auto;\n  "]))));
var smallModalCss = (0, _styledComponents.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  width: 40%;\n  padding: 40px 40px 32px 40px;\n"])));
var LoadDataModalStyle = (0, _styledComponents.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n  top: 60px;\n"])));
var DefaultStyle = (0, _styledComponents.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2["default"])(["\n  max-width: 960px;\n"])));
ModalContainerFactory.deps = [_deleteDataModal["default"], _overwriteMapModal["default"], _dataTableModal["default"], _loadDataModal["default"], _exportImageModal["default"], _exportDataModal["default"], _exportMapModal["default"], _addMapStyleModal["default"], _modalDialog["default"], _saveMapModal["default"], _shareMapModal["default"]];

function ModalContainerFactory(DeleteDatasetModal, OverWriteMapModal, DataTableModal, LoadDataModal, ExportImageModal, ExportDataModal, ExportMapModal, AddMapStyleModal, ModalDialog, SaveMapModal, ShareMapModal) {
  /** @typedef {import('./modal-container').ModalContainerProps} ModalContainerProps */

  /** @augments React.Component<ModalContainerProps> */
  var ModalContainer = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(ModalContainer, _Component);

    var _super = _createSuper(ModalContainer);

    function ModalContainer() {
      var _this;

      (0, _classCallCheck2["default"])(this, ModalContainer);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
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
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onFileUpload", function (fileList) {
        _this.props.visStateActions.loadFiles(fileList);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onExportImage", function () {
        if (!_this.props.uiState.exportImage.processing) {
          (0, _exportUtils.exportImage)(_this.props, "".concat(_this.props.appName, ".png"));

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
          // @ts-ignore
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
        var currentProvider = _this.props.providerState.currentProvider; // @ts-ignore

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
        _this.props.providerActions.loadCloudMap(_objectSpread(_objectSpread({}, payload), {}, {
          onSuccess: _this.props.onLoadCloudMapSuccess,
          onError: _this.props.onLoadCloudMapError
        }));
      });
      return _this;
    }

    (0, _createClass2["default"])(ModalContainer, [{
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        _document["default"].removeEventListener('keyup', this._onKeyUp);
      }
    }, {
      key: "render",
      value:
      /* eslint-disable complexity */
      function render() {
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
        var modalProps = {}; // TODO - currentModal is a string
        // @ts-ignore

        if (currentModal && currentModal.id && currentModal.template) {
          // if currentMdoal template is already provided
          // TODO: need to check whether template is valid
          // @ts-ignore
          template = /*#__PURE__*/_react["default"].createElement(currentModal.template, null); // @ts-ignore

          modalProps = currentModal.modalProps;
        } else {
          switch (currentModal) {
            case _defaultSettings.DATA_TABLE_ID:
              var width = containerW * 0.9;
              template = /*#__PURE__*/_react["default"].createElement(DataTableModal, {
                width: containerW * 0.9,
                height: containerH * 0.85,
                datasets: datasets,
                dataId: editingDataset,
                showDatasetTable: visStateActions.showDatasetTable,
                sortTableColumn: visStateActions.sortTableColumn,
                pinTableColumn: visStateActions.pinTableColumn,
                copyTableColumn: visStateActions.copyTableColumn
              }); // TODO: we need to make this width consistent with the css rule defined modal.js:32 max-width: 70vw

              modalProps.cssStyle = (0, _styledComponents.css)(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2["default"])(["\n              ", ";\n              ", ";\n            "])), DataTableModalStyle, _mediaBreakpoints.media.palm(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2["default"])(["\n                width: ", "px;\n              "])), width));
              break;

            case _defaultSettings.DELETE_DATA_ID:
              // validate options
              if (datasetKeyToRemove && datasets && datasets[datasetKeyToRemove]) {
                template = /*#__PURE__*/_react["default"].createElement(DeleteDatasetModal, {
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
              template = /*#__PURE__*/_react["default"].createElement(LoadDataModal, (0, _extends2["default"])({}, providerState, {
                onClose: this._closeModal,
                onFileUpload: this._onFileUpload,
                onLoadCloudMap: this._onLoadCloudMap,
                cloudProviders: this.providerWithStorage(this.props),
                onSetCloudProvider: this.props.providerActions.setCloudProvider,
                getSavedMaps: this.props.providerActions.getSavedMaps,
                loadFiles: uiState.loadFiles,
                fileLoading: visState.fileLoading,
                fileLoadingProgress: visState.fileLoadingProgress,
                fileFormatNames: (0, _visStateSelectors.getFileFormatNames)(this.props.visState),
                fileExtensions: (0, _visStateSelectors.getFileExtensions)(this.props.visState)
              }));
              modalProps = {
                title: 'modal.title.addDataToMap',
                cssStyle: LoadDataModalStyle,
                footer: false,
                onConfirm: this._closeModal
              };
              break;

            case _defaultSettings.EXPORT_IMAGE_ID:
              template = /*#__PURE__*/_react["default"].createElement(ExportImageModal, {
                exportImage: uiState.exportImage,
                mapW: containerW,
                mapH: containerH,
                onUpdateImageSetting: uiStateActions.setExportImageSetting,
                cleanupExportImage: uiStateActions.cleanupExportImage
              });
              modalProps = {
                title: 'modal.title.exportImage',
                cssStyle: '',
                footer: true,
                onCancel: this._closeModal,
                onConfirm: this._onExportImage,
                confirmButton: {
                  large: true,
                  disabled: uiState.exportImage.processing,
                  children: 'modal.button.download'
                }
              };
              break;

            case _defaultSettings.EXPORT_DATA_ID:
              template = /*#__PURE__*/_react["default"].createElement(ExportDataModal, (0, _extends2["default"])({}, uiState.exportData, {
                supportedDataTypes: _defaultSettings.EXPORT_DATA_TYPE_OPTIONS,
                datasets: datasets,
                applyCPUFilter: this.props.visStateActions.applyCPUFilter,
                onClose: this._closeModal,
                onChangeExportDataType: uiStateActions.setExportDataType,
                onChangeExportSelectedDataset: uiStateActions.setExportSelectedDataset,
                onChangeExportFiltered: uiStateActions.setExportFiltered
              }));
              modalProps = {
                title: 'modal.title.exportData',
                cssStyle: '',
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
              var keplerGlConfig = visState.schema.getConfigToSave({
                mapStyle: mapStyle,
                visState: visState,
                mapState: mapState,
                uiState: uiState
              });
              template = /*#__PURE__*/_react["default"].createElement(ExportMapModal, {
                config: keplerGlConfig,
                options: uiState.exportMap,
                onChangeExportMapFormat: uiStateActions.setExportMapFormat,
                onEditUserMapboxAccessToken: uiStateActions.setUserMapboxAccessToken,
                onChangeExportMapHTMLMode: uiStateActions.setExportHTMLMapMode
              });
              modalProps = {
                title: 'modal.title.exportMap',
                cssStyle: '',
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
              template = /*#__PURE__*/_react["default"].createElement(AddMapStyleModal, {
                mapboxApiAccessToken: this.props.mapboxApiAccessToken,
                mapboxApiUrl: this.props.mapboxApiUrl,
                mapState: this.props.mapState,
                inputStyle: mapStyle.inputStyle,
                inputMapStyle: this.props.mapStyleActions.inputMapStyle,
                loadCustomMapStyle: this.props.mapStyleActions.loadCustomMapStyle
              });
              modalProps = {
                title: 'modal.title.addCustomMapboxStyle',
                cssStyle: '',
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
              template = /*#__PURE__*/_react["default"].createElement(SaveMapModal, (0, _extends2["default"])({}, providerState, {
                exportImage: uiState.exportImage,
                mapInfo: visState.mapInfo,
                onSetMapInfo: visStateActions.setMapInfo,
                cloudProviders: this.providerWithStorage(this.props),
                onSetCloudProvider: this.props.providerActions.setCloudProvider,
                cleanupExportImage: uiStateActions.cleanupExportImage,
                onUpdateImageSetting: uiStateActions.setExportImageSetting
              }));
              modalProps = {
                title: 'modal.title.saveMap',
                cssStyle: '',
                footer: true,
                onCancel: this._closeModal,
                onConfirm: function onConfirm() {
                  return _this2._onSaveMap(false);
                },
                confirmButton: {
                  large: true,
                  disabled: uiState.exportImage.processing || !(0, _mapInfoUtils.isValidMapInfo)(visState.mapInfo) || !providerState.currentProvider,
                  children: 'modal.button.save'
                }
              };
              break;

            case _defaultSettings.OVERWRITE_MAP_ID:
              template = /*#__PURE__*/_react["default"].createElement(OverWriteMapModal, (0, _extends2["default"])({}, providerState, {
                cloudProviders: this.props.cloudProviders,
                title: (0, _lodash["default"])(visState, ['mapInfo', 'title']),
                onSetCloudProvider: this.props.providerActions.setCloudProvider,
                onUpdateImageSetting: uiStateActions.setExportImageSetting,
                cleanupExportImage: uiStateActions.cleanupExportImage
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
                  disabled: uiState.exportImage.processing || !(0, _mapInfoUtils.isValidMapInfo)(visState.mapInfo) || !providerState.currentProvider
                }
              };
              break;

            case _defaultSettings.SHARE_MAP_ID:
              template = /*#__PURE__*/_react["default"].createElement(ShareMapModal, (0, _extends2["default"])({}, providerState, {
                isReady: !uiState.exportImage.processing,
                cloudProviders: this.providerWithShare(this.props),
                onExport: this._onShareMapUrl,
                onSetCloudProvider: this.props.providerActions.setCloudProvider,
                cleanupExportImage: uiStateActions.cleanupExportImage,
                onUpdateImageSetting: uiStateActions.setExportImageSetting
              }));
              modalProps = {
                title: 'modal.title.shareURL',
                cssStyle: '',
                onCancel: this._onCloseSaveMap
              };
              break;

            default:
              break;
          }
        }

        return this.props.rootNode ? /*#__PURE__*/_react["default"].createElement(ModalDialog, (0, _extends2["default"])({
          parentSelector: function parentSelector() {
            return (0, _reactDom.findDOMNode)(rootNode);
          },
          isOpen: Boolean(currentModal),
          onCancel: this._closeModal
        }, modalProps, {
          cssStyle: DefaultStyle.concat(modalProps.cssStyle)
        }), template) : null;
      }
      /* eslint-enable complexity */

    }]);
    return ModalContainer;
  }(_react.Component);

  (0, _defineProperty2["default"])(ModalContainer, "propTypes", {
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
  return ModalContainer;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFsLWNvbnRhaW5lci5qcyJdLCJuYW1lcyI6WyJEYXRhVGFibGVNb2RhbFN0eWxlIiwiY3NzIiwibWVkaWEiLCJwb3J0YWJsZSIsInBhbG0iLCJzbWFsbE1vZGFsQ3NzIiwiTG9hZERhdGFNb2RhbFN0eWxlIiwiRGVmYXVsdFN0eWxlIiwiTW9kYWxDb250YWluZXJGYWN0b3J5IiwiZGVwcyIsIkRlbGV0ZURhdGFzZXRNb2RhbEZhY3RvcnkiLCJPdmVyV3JpdGVNYXBNb2RhbEZhY3RvcnkiLCJEYXRhVGFibGVNb2RhbEZhY3RvcnkiLCJMb2FkRGF0YU1vZGFsRmFjdG9yeSIsIkV4cG9ydEltYWdlTW9kYWxGYWN0b3J5IiwiRXhwb3J0RGF0YU1vZGFsRmFjdG9yeSIsIkV4cG9ydE1hcE1vZGFsRmFjdG9yeSIsIkFkZE1hcFN0eWxlTW9kYWxGYWN0b3J5IiwiTW9kYWxEaWFsb2dGYWN0b3J5IiwiU2F2ZU1hcE1vZGFsRmFjdG9yeSIsIlNoYXJlTWFwTW9kYWxGYWN0b3J5IiwiRGVsZXRlRGF0YXNldE1vZGFsIiwiT3ZlcldyaXRlTWFwTW9kYWwiLCJEYXRhVGFibGVNb2RhbCIsIkxvYWREYXRhTW9kYWwiLCJFeHBvcnRJbWFnZU1vZGFsIiwiRXhwb3J0RGF0YU1vZGFsIiwiRXhwb3J0TWFwTW9kYWwiLCJBZGRNYXBTdHlsZU1vZGFsIiwiTW9kYWxEaWFsb2ciLCJTYXZlTWFwTW9kYWwiLCJTaGFyZU1hcE1vZGFsIiwiTW9kYWxDb250YWluZXIiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25LZXlVcCIsInByb3BzIiwiY2xvdWRQcm92aWRlcnMiLCJmaWx0ZXIiLCJwIiwiaGFzUHJpdmF0ZVN0b3JhZ2UiLCJoYXNTaGFyaW5nVXJsIiwiZXZlbnQiLCJrZXlDb2RlIiwiS2V5RXZlbnQiLCJET01fVktfRVNDQVBFIiwiX2Nsb3NlTW9kYWwiLCJ1aVN0YXRlQWN0aW9ucyIsInRvZ2dsZU1vZGFsIiwia2V5IiwidmlzU3RhdGVBY3Rpb25zIiwicmVtb3ZlRGF0YXNldCIsIm1hcFN0eWxlQWN0aW9ucyIsImFkZEN1c3RvbU1hcFN0eWxlIiwiZmlsZUxpc3QiLCJsb2FkRmlsZXMiLCJ1aVN0YXRlIiwiZXhwb3J0SW1hZ2UiLCJwcm9jZXNzaW5nIiwiYXBwTmFtZSIsImNsZWFudXBFeHBvcnRJbWFnZSIsImV4cG9ydERhdGEiLCJmb3JtYXQiLCJleHBvcnRNYXAiLCJFWFBPUlRfTUFQX0ZPUk1BVFMiLCJIVE1MIiwiZXhwb3J0SHRtbCIsImV4cG9ydEpzb24iLCJwcm92aWRlciIsImlzUHVibGljIiwib3ZlcndyaXRlIiwiY2xvc2VNb2RhbCIsInRvU2F2ZSIsInByb3ZpZGVyQWN0aW9ucyIsImV4cG9ydEZpbGVUb0Nsb3VkIiwibWFwRGF0YSIsIm9wdGlvbnMiLCJvblN1Y2Nlc3MiLCJvbkV4cG9ydFRvQ2xvdWRTdWNjZXNzIiwib25FcnJvciIsIm9uRXhwb3J0VG9DbG91ZEVycm9yIiwiY3VycmVudFByb3ZpZGVyIiwicHJvdmlkZXJTdGF0ZSIsImZpbmQiLCJuYW1lIiwiX2V4cG9ydEZpbGVUb0Nsb3VkIiwiX29uU2F2ZU1hcCIsInJlc2V0UHJvdmlkZXJTdGF0dXMiLCJwYXlsb2FkIiwibG9hZENsb3VkTWFwIiwib25Mb2FkQ2xvdWRNYXBTdWNjZXNzIiwib25Mb2FkQ2xvdWRNYXBFcnJvciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJjb250YWluZXJXIiwiY29udGFpbmVySCIsIm1hcFN0eWxlIiwibWFwU3RhdGUiLCJ2aXNTdGF0ZSIsInJvb3ROb2RlIiwiY3VycmVudE1vZGFsIiwiZGF0YXNldEtleVRvUmVtb3ZlIiwiZGF0YXNldHMiLCJsYXllcnMiLCJlZGl0aW5nRGF0YXNldCIsInRlbXBsYXRlIiwibW9kYWxQcm9wcyIsImlkIiwiREFUQV9UQUJMRV9JRCIsIndpZHRoIiwic2hvd0RhdGFzZXRUYWJsZSIsInNvcnRUYWJsZUNvbHVtbiIsInBpblRhYmxlQ29sdW1uIiwiY29weVRhYmxlQ29sdW1uIiwiY3NzU3R5bGUiLCJERUxFVEVfREFUQV9JRCIsInRpdGxlIiwiZm9vdGVyIiwib25Db25maXJtIiwiX2RlbGV0ZURhdGFzZXQiLCJvbkNhbmNlbCIsImNvbmZpcm1CdXR0b24iLCJuZWdhdGl2ZSIsImxhcmdlIiwiY2hpbGRyZW4iLCJBRERfREFUQV9JRCIsIl9vbkZpbGVVcGxvYWQiLCJfb25Mb2FkQ2xvdWRNYXAiLCJwcm92aWRlcldpdGhTdG9yYWdlIiwic2V0Q2xvdWRQcm92aWRlciIsImdldFNhdmVkTWFwcyIsImZpbGVMb2FkaW5nIiwiZmlsZUxvYWRpbmdQcm9ncmVzcyIsIkVYUE9SVF9JTUFHRV9JRCIsInNldEV4cG9ydEltYWdlU2V0dGluZyIsIl9vbkV4cG9ydEltYWdlIiwiZGlzYWJsZWQiLCJFWFBPUlRfREFUQV9JRCIsIkVYUE9SVF9EQVRBX1RZUEVfT1BUSU9OUyIsImFwcGx5Q1BVRmlsdGVyIiwic2V0RXhwb3J0RGF0YVR5cGUiLCJzZXRFeHBvcnRTZWxlY3RlZERhdGFzZXQiLCJzZXRFeHBvcnRGaWx0ZXJlZCIsIl9vbkV4cG9ydERhdGEiLCJFWFBPUlRfTUFQX0lEIiwia2VwbGVyR2xDb25maWciLCJzY2hlbWEiLCJnZXRDb25maWdUb1NhdmUiLCJzZXRFeHBvcnRNYXBGb3JtYXQiLCJzZXRVc2VyTWFwYm94QWNjZXNzVG9rZW4iLCJzZXRFeHBvcnRIVE1MTWFwTW9kZSIsIl9vbkV4cG9ydE1hcCIsIkFERF9NQVBfU1RZTEVfSUQiLCJtYXBib3hBcGlBY2Nlc3NUb2tlbiIsIm1hcGJveEFwaVVybCIsImlucHV0U3R5bGUiLCJpbnB1dE1hcFN0eWxlIiwibG9hZEN1c3RvbU1hcFN0eWxlIiwiX29uQWRkQ3VzdG9tTWFwU3R5bGUiLCJzdHlsZSIsIlNBVkVfTUFQX0lEIiwibWFwSW5mbyIsInNldE1hcEluZm8iLCJPVkVSV1JJVEVfTUFQX0lEIiwiX29uT3ZlcndyaXRlTWFwIiwiU0hBUkVfTUFQX0lEIiwicHJvdmlkZXJXaXRoU2hhcmUiLCJfb25TaGFyZU1hcFVybCIsIl9vbkNsb3NlU2F2ZU1hcCIsIkJvb2xlYW4iLCJjb25jYXQiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJudW1iZXIiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwib25TYXZlVG9TdG9yYWdlIiwiZnVuYyIsImFycmF5T2YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOztBQWdCQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsbUJBQW1CLE9BQUdDLHFCQUFILG9MQU1yQkMsd0JBQU1DLFFBTmUsK0dBUWxCRCx3QkFBTUUsSUFSWSxtSUFBekI7QUFhQSxJQUFNQyxhQUFhLE9BQUdKLHFCQUFILDJJQUFuQjtBQUtBLElBQU1LLGtCQUFrQixPQUFHTCxxQkFBSCx5R0FBeEI7QUFJQSxJQUFNTSxZQUFZLE9BQUdOLHFCQUFILGdIQUFsQjtBQUlBTyxxQkFBcUIsQ0FBQ0MsSUFBdEIsR0FBNkIsQ0FDM0JDLDJCQUQyQixFQUUzQkMsNkJBRjJCLEVBRzNCQywwQkFIMkIsRUFJM0JDLHlCQUoyQixFQUszQkMsNEJBTDJCLEVBTTNCQywyQkFOMkIsRUFPM0JDLDBCQVAyQixFQVEzQkMsNEJBUjJCLEVBUzNCQyx1QkFUMkIsRUFVM0JDLHdCQVYyQixFQVczQkMseUJBWDJCLENBQTdCOztBQWNlLFNBQVNaLHFCQUFULENBQ2JhLGtCQURhLEVBRWJDLGlCQUZhLEVBR2JDLGNBSGEsRUFJYkMsYUFKYSxFQUtiQyxnQkFMYSxFQU1iQyxlQU5hLEVBT2JDLGNBUGEsRUFRYkMsZ0JBUmEsRUFTYkMsV0FUYSxFQVViQyxZQVZhLEVBV2JDLGFBWGEsRUFZYjtBQUNBOztBQUNBO0FBRkEsTUFHTUMsY0FITjtBQUFBOztBQUFBOztBQUFBO0FB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VGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtjc3N9IGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7ZmluZERPTU5vZGV9IGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQge2NyZWF0ZVNlbGVjdG9yfSBmcm9tICdyZXNlbGVjdCc7XG5pbXBvcnQgZ2V0IGZyb20gJ2xvZGFzaC5nZXQnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5cbmltcG9ydCB7RVhQT1JUX0RBVEFfVFlQRV9PUFRJT05TfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQgTW9kYWxEaWFsb2dGYWN0b3J5IGZyb20gJy4vbW9kYWxzL21vZGFsLWRpYWxvZyc7XG5pbXBvcnQge2V4cG9ydEpzb24sIGV4cG9ydEh0bWwsIGV4cG9ydERhdGEsIGV4cG9ydEltYWdlLCBleHBvcnRNYXB9IGZyb20gJ3V0aWxzL2V4cG9ydC11dGlscyc7XG5pbXBvcnQge2lzVmFsaWRNYXBJbmZvfSBmcm9tICd1dGlscy9tYXAtaW5mby11dGlscyc7XG5cbi8vIG1vZGFsc1xuaW1wb3J0IERlbGV0ZURhdGFzZXRNb2RhbEZhY3RvcnkgZnJvbSAnLi9tb2RhbHMvZGVsZXRlLWRhdGEtbW9kYWwnO1xuaW1wb3J0IE92ZXJXcml0ZU1hcE1vZGFsRmFjdG9yeSBmcm9tICcuL21vZGFscy9vdmVyd3JpdGUtbWFwLW1vZGFsJztcbmltcG9ydCBEYXRhVGFibGVNb2RhbEZhY3RvcnkgZnJvbSAnLi9tb2RhbHMvZGF0YS10YWJsZS1tb2RhbCc7XG5pbXBvcnQgTG9hZERhdGFNb2RhbEZhY3RvcnkgZnJvbSAnLi9tb2RhbHMvbG9hZC1kYXRhLW1vZGFsJztcbmltcG9ydCBFeHBvcnRJbWFnZU1vZGFsRmFjdG9yeSBmcm9tICcuL21vZGFscy9leHBvcnQtaW1hZ2UtbW9kYWwnO1xuaW1wb3J0IEV4cG9ydERhdGFNb2RhbEZhY3RvcnkgZnJvbSAnLi9tb2RhbHMvZXhwb3J0LWRhdGEtbW9kYWwnO1xuaW1wb3J0IEV4cG9ydE1hcE1vZGFsRmFjdG9yeSBmcm9tICcuL21vZGFscy9leHBvcnQtbWFwLW1vZGFsL2V4cG9ydC1tYXAtbW9kYWwnO1xuaW1wb3J0IEFkZE1hcFN0eWxlTW9kYWxGYWN0b3J5IGZyb20gJy4vbW9kYWxzL2FkZC1tYXAtc3R5bGUtbW9kYWwnO1xuaW1wb3J0IFNhdmVNYXBNb2RhbEZhY3RvcnkgZnJvbSAnLi9tb2RhbHMvc2F2ZS1tYXAtbW9kYWwnO1xuaW1wb3J0IFNoYXJlTWFwTW9kYWxGYWN0b3J5IGZyb20gJy4vbW9kYWxzL3NoYXJlLW1hcC1tb2RhbCc7XG5cbi8vIEJyZWFrcG9pbnRzXG5pbXBvcnQge21lZGlhfSBmcm9tICdzdHlsZXMvbWVkaWEtYnJlYWtwb2ludHMnO1xuXG4vLyBUZW1wbGF0ZVxuaW1wb3J0IHtcbiAgQUREX0RBVEFfSUQsXG4gIERBVEFfVEFCTEVfSUQsXG4gIERFTEVURV9EQVRBX0lELFxuICBFWFBPUlRfREFUQV9JRCxcbiAgRVhQT1JUX0lNQUdFX0lELFxuICBFWFBPUlRfTUFQX0lELFxuICBBRERfTUFQX1NUWUxFX0lELFxuICBTQVZFX01BUF9JRCxcbiAgU0hBUkVfTUFQX0lELFxuICBPVkVSV1JJVEVfTUFQX0lEXG59IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7RVhQT1JUX01BUF9GT1JNQVRTfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQgS2V5RXZlbnQgZnJvbSAnY29uc3RhbnRzL2tleWV2ZW50JztcbmltcG9ydCB7Z2V0RmlsZUZvcm1hdE5hbWVzLCBnZXRGaWxlRXh0ZW5zaW9uc30gZnJvbSAnLi4vcmVkdWNlcnMvdmlzLXN0YXRlLXNlbGVjdG9ycyc7XG5cbmNvbnN0IERhdGFUYWJsZU1vZGFsU3R5bGUgPSBjc3NgXG4gIHRvcDogODBweDtcbiAgcGFkZGluZzogMzJweCAwIDAgMDtcbiAgd2lkdGg6IDkwdnc7XG4gIG1heC13aWR0aDogOTB2dztcblxuICAke21lZGlhLnBvcnRhYmxlYFxuICAgIHBhZGRpbmc6IDA7XG4gIGB9ICR7bWVkaWEucGFsbWBcbiAgICBwYWRkaW5nOiAwO1xuICAgIG1hcmdpbjogMCBhdXRvO1xuICBgfTtcbmA7XG5jb25zdCBzbWFsbE1vZGFsQ3NzID0gY3NzYFxuICB3aWR0aDogNDAlO1xuICBwYWRkaW5nOiA0MHB4IDQwcHggMzJweCA0MHB4O1xuYDtcblxuY29uc3QgTG9hZERhdGFNb2RhbFN0eWxlID0gY3NzYFxuICB0b3A6IDYwcHg7XG5gO1xuXG5jb25zdCBEZWZhdWx0U3R5bGUgPSBjc3NgXG4gIG1heC13aWR0aDogOTYwcHg7XG5gO1xuXG5Nb2RhbENvbnRhaW5lckZhY3RvcnkuZGVwcyA9IFtcbiAgRGVsZXRlRGF0YXNldE1vZGFsRmFjdG9yeSxcbiAgT3ZlcldyaXRlTWFwTW9kYWxGYWN0b3J5LFxuICBEYXRhVGFibGVNb2RhbEZhY3RvcnksXG4gIExvYWREYXRhTW9kYWxGYWN0b3J5LFxuICBFeHBvcnRJbWFnZU1vZGFsRmFjdG9yeSxcbiAgRXhwb3J0RGF0YU1vZGFsRmFjdG9yeSxcbiAgRXhwb3J0TWFwTW9kYWxGYWN0b3J5LFxuICBBZGRNYXBTdHlsZU1vZGFsRmFjdG9yeSxcbiAgTW9kYWxEaWFsb2dGYWN0b3J5LFxuICBTYXZlTWFwTW9kYWxGYWN0b3J5LFxuICBTaGFyZU1hcE1vZGFsRmFjdG9yeVxuXTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTW9kYWxDb250YWluZXJGYWN0b3J5KFxuICBEZWxldGVEYXRhc2V0TW9kYWwsXG4gIE92ZXJXcml0ZU1hcE1vZGFsLFxuICBEYXRhVGFibGVNb2RhbCxcbiAgTG9hZERhdGFNb2RhbCxcbiAgRXhwb3J0SW1hZ2VNb2RhbCxcbiAgRXhwb3J0RGF0YU1vZGFsLFxuICBFeHBvcnRNYXBNb2RhbCxcbiAgQWRkTWFwU3R5bGVNb2RhbCxcbiAgTW9kYWxEaWFsb2csXG4gIFNhdmVNYXBNb2RhbCxcbiAgU2hhcmVNYXBNb2RhbFxuKSB7XG4gIC8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL21vZGFsLWNvbnRhaW5lcicpLk1vZGFsQ29udGFpbmVyUHJvcHN9IE1vZGFsQ29udGFpbmVyUHJvcHMgKi9cbiAgLyoqIEBhdWdtZW50cyBSZWFjdC5Db21wb25lbnQ8TW9kYWxDb250YWluZXJQcm9wcz4gKi9cbiAgY2xhc3MgTW9kYWxDb250YWluZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIC8vIFRPRE8gLSByZW1vdmUgd2hlbiBwcm9wIHR5cGVzIGFyZSBmdWxseSBleHBvcnRlZFxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICByb290Tm9kZTogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgIGNvbnRhaW5lclc6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICBjb250YWluZXJIOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgbWFwYm94QXBpQWNjZXNzVG9rZW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIG1hcGJveEFwaVVybDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIG1hcFN0YXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBtYXBTdHlsZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgdWlTdGF0ZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgdmlzU3RhdGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIHZpc1N0YXRlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgdWlTdGF0ZUFjdGlvbnM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIG1hcFN0eWxlQWN0aW9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgb25TYXZlVG9TdG9yYWdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgIGNsb3VkUHJvdmlkZXJzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KVxuICAgIH07XG4gICAgY29tcG9uZW50RGlkTW91bnQgPSAoKSA9PiB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX29uS2V5VXApO1xuICAgIH07XG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX29uS2V5VXApO1xuICAgIH1cblxuICAgIGNsb3VkUHJvdmlkZXJzID0gcHJvcHMgPT4gcHJvcHMuY2xvdWRQcm92aWRlcnM7XG4gICAgcHJvdmlkZXJXaXRoU3RvcmFnZSA9IGNyZWF0ZVNlbGVjdG9yKHRoaXMuY2xvdWRQcm92aWRlcnMsIGNsb3VkUHJvdmlkZXJzID0+XG4gICAgICBjbG91ZFByb3ZpZGVycy5maWx0ZXIocCA9PiBwLmhhc1ByaXZhdGVTdG9yYWdlKCkpXG4gICAgKTtcbiAgICBwcm92aWRlcldpdGhTaGFyZSA9IGNyZWF0ZVNlbGVjdG9yKHRoaXMuY2xvdWRQcm92aWRlcnMsIGNsb3VkUHJvdmlkZXJzID0+XG4gICAgICBjbG91ZFByb3ZpZGVycy5maWx0ZXIocCA9PiBwLmhhc1NoYXJpbmdVcmwoKSlcbiAgICApO1xuXG4gICAgX29uS2V5VXAgPSBldmVudCA9PiB7XG4gICAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICAgIGlmIChrZXlDb2RlID09PSBLZXlFdmVudC5ET01fVktfRVNDQVBFKSB7XG4gICAgICAgIHRoaXMuX2Nsb3NlTW9kYWwoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX2Nsb3NlTW9kYWwgPSAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLnRvZ2dsZU1vZGFsKG51bGwpO1xuICAgIH07XG5cbiAgICBfZGVsZXRlRGF0YXNldCA9IGtleSA9PiB7XG4gICAgICB0aGlzLnByb3BzLnZpc1N0YXRlQWN0aW9ucy5yZW1vdmVEYXRhc2V0KGtleSk7XG4gICAgICB0aGlzLl9jbG9zZU1vZGFsKCk7XG4gICAgfTtcblxuICAgIF9vbkFkZEN1c3RvbU1hcFN0eWxlID0gKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5tYXBTdHlsZUFjdGlvbnMuYWRkQ3VzdG9tTWFwU3R5bGUoKTtcbiAgICAgIHRoaXMuX2Nsb3NlTW9kYWwoKTtcbiAgICB9O1xuXG4gICAgX29uRmlsZVVwbG9hZCA9IGZpbGVMaXN0ID0+IHtcbiAgICAgIHRoaXMucHJvcHMudmlzU3RhdGVBY3Rpb25zLmxvYWRGaWxlcyhmaWxlTGlzdCk7XG4gICAgfTtcblxuICAgIF9vbkV4cG9ydEltYWdlID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnByb3BzLnVpU3RhdGUuZXhwb3J0SW1hZ2UucHJvY2Vzc2luZykge1xuICAgICAgICBleHBvcnRJbWFnZSh0aGlzLnByb3BzLCBgJHt0aGlzLnByb3BzLmFwcE5hbWV9LnBuZ2ApO1xuICAgICAgICB0aGlzLnByb3BzLnVpU3RhdGVBY3Rpb25zLmNsZWFudXBFeHBvcnRJbWFnZSgpO1xuICAgICAgICB0aGlzLl9jbG9zZU1vZGFsKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9vbkV4cG9ydERhdGEgPSAoKSA9PiB7XG4gICAgICBleHBvcnREYXRhKHRoaXMucHJvcHMsIHRoaXMucHJvcHMudWlTdGF0ZS5leHBvcnREYXRhKTtcbiAgICAgIHRoaXMuX2Nsb3NlTW9kYWwoKTtcbiAgICB9O1xuXG4gICAgX29uRXhwb3J0TWFwID0gKCkgPT4ge1xuICAgICAgY29uc3Qge3VpU3RhdGV9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHtmb3JtYXR9ID0gdWlTdGF0ZS5leHBvcnRNYXA7XG4gICAgICAoZm9ybWF0ID09PSBFWFBPUlRfTUFQX0ZPUk1BVFMuSFRNTCA/IGV4cG9ydEh0bWwgOiBleHBvcnRKc29uKShcbiAgICAgICAgdGhpcy5wcm9wcyxcbiAgICAgICAgdGhpcy5wcm9wcy51aVN0YXRlLmV4cG9ydE1hcFtmb3JtYXRdIHx8IHt9XG4gICAgICApO1xuICAgICAgdGhpcy5fY2xvc2VNb2RhbCgpO1xuICAgIH07XG5cbiAgICBfZXhwb3J0RmlsZVRvQ2xvdWQgPSAoe3Byb3ZpZGVyLCBpc1B1YmxpYywgb3ZlcndyaXRlLCBjbG9zZU1vZGFsfSkgPT4ge1xuICAgICAgY29uc3QgdG9TYXZlID0gZXhwb3J0TWFwKHRoaXMucHJvcHMpO1xuXG4gICAgICB0aGlzLnByb3BzLnByb3ZpZGVyQWN0aW9ucy5leHBvcnRGaWxlVG9DbG91ZCh7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgbWFwRGF0YTogdG9TYXZlLFxuICAgICAgICBwcm92aWRlcixcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGlzUHVibGljLFxuICAgICAgICAgIG92ZXJ3cml0ZVxuICAgICAgICB9LFxuICAgICAgICBjbG9zZU1vZGFsLFxuICAgICAgICBvblN1Y2Nlc3M6IHRoaXMucHJvcHMub25FeHBvcnRUb0Nsb3VkU3VjY2VzcyxcbiAgICAgICAgb25FcnJvcjogdGhpcy5wcm9wcy5vbkV4cG9ydFRvQ2xvdWRFcnJvclxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIF9vblNhdmVNYXAgPSAob3ZlcndyaXRlID0gZmFsc2UpID0+IHtcbiAgICAgIGNvbnN0IHtjdXJyZW50UHJvdmlkZXJ9ID0gdGhpcy5wcm9wcy5wcm92aWRlclN0YXRlO1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLnByb3BzLmNsb3VkUHJvdmlkZXJzLmZpbmQocCA9PiBwLm5hbWUgPT09IGN1cnJlbnRQcm92aWRlcik7XG4gICAgICB0aGlzLl9leHBvcnRGaWxlVG9DbG91ZCh7XG4gICAgICAgIHByb3ZpZGVyLFxuICAgICAgICBpc1B1YmxpYzogZmFsc2UsXG4gICAgICAgIG92ZXJ3cml0ZSxcbiAgICAgICAgY2xvc2VNb2RhbDogdHJ1ZVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIF9vbk92ZXJ3cml0ZU1hcCA9ICgpID0+IHtcbiAgICAgIHRoaXMuX29uU2F2ZU1hcCh0cnVlKTtcbiAgICB9O1xuXG4gICAgX29uU2hhcmVNYXBVcmwgPSBwcm92aWRlciA9PiB7XG4gICAgICB0aGlzLl9leHBvcnRGaWxlVG9DbG91ZCh7cHJvdmlkZXIsIGlzUHVibGljOiB0cnVlLCBvdmVyd3JpdGU6IGZhbHNlLCBjbG9zZU1vZGFsOiBmYWxzZX0pO1xuICAgIH07XG5cbiAgICBfb25DbG9zZVNhdmVNYXAgPSAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLnByb3ZpZGVyQWN0aW9ucy5yZXNldFByb3ZpZGVyU3RhdHVzKCk7XG4gICAgICB0aGlzLl9jbG9zZU1vZGFsKCk7XG4gICAgfTtcblxuICAgIF9vbkxvYWRDbG91ZE1hcCA9IHBheWxvYWQgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5wcm92aWRlckFjdGlvbnMubG9hZENsb3VkTWFwKHtcbiAgICAgICAgLi4ucGF5bG9hZCxcbiAgICAgICAgb25TdWNjZXNzOiB0aGlzLnByb3BzLm9uTG9hZENsb3VkTWFwU3VjY2VzcyxcbiAgICAgICAgb25FcnJvcjogdGhpcy5wcm9wcy5vbkxvYWRDbG91ZE1hcEVycm9yXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgY29udGFpbmVyVyxcbiAgICAgICAgY29udGFpbmVySCxcbiAgICAgICAgbWFwU3R5bGUsXG4gICAgICAgIG1hcFN0YXRlLFxuICAgICAgICB1aVN0YXRlLFxuICAgICAgICB2aXNTdGF0ZSxcbiAgICAgICAgcm9vdE5vZGUsXG4gICAgICAgIHZpc1N0YXRlQWN0aW9ucyxcbiAgICAgICAgdWlTdGF0ZUFjdGlvbnMsXG4gICAgICAgIHByb3ZpZGVyU3RhdGVcbiAgICAgIH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qge2N1cnJlbnRNb2RhbCwgZGF0YXNldEtleVRvUmVtb3ZlfSA9IHVpU3RhdGU7XG4gICAgICBjb25zdCB7ZGF0YXNldHMsIGxheWVycywgZWRpdGluZ0RhdGFzZXR9ID0gdmlzU3RhdGU7XG5cbiAgICAgIGxldCB0ZW1wbGF0ZSA9IG51bGw7XG4gICAgICBsZXQgbW9kYWxQcm9wcyA9IHt9O1xuXG4gICAgICAvLyBUT0RPIC0gY3VycmVudE1vZGFsIGlzIGEgc3RyaW5nXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBpZiAoY3VycmVudE1vZGFsICYmIGN1cnJlbnRNb2RhbC5pZCAmJiBjdXJyZW50TW9kYWwudGVtcGxhdGUpIHtcbiAgICAgICAgLy8gaWYgY3VycmVudE1kb2FsIHRlbXBsYXRlIGlzIGFscmVhZHkgcHJvdmlkZWRcbiAgICAgICAgLy8gVE9ETzogbmVlZCB0byBjaGVjayB3aGV0aGVyIHRlbXBsYXRlIGlzIHZhbGlkXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGVtcGxhdGUgPSA8Y3VycmVudE1vZGFsLnRlbXBsYXRlIC8+O1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG1vZGFsUHJvcHMgPSBjdXJyZW50TW9kYWwubW9kYWxQcm9wcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXRjaCAoY3VycmVudE1vZGFsKSB7XG4gICAgICAgICAgY2FzZSBEQVRBX1RBQkxFX0lEOlxuICAgICAgICAgICAgY29uc3Qgd2lkdGggPSBjb250YWluZXJXICogMC45O1xuICAgICAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgICAgIDxEYXRhVGFibGVNb2RhbFxuICAgICAgICAgICAgICAgIHdpZHRoPXtjb250YWluZXJXICogMC45fVxuICAgICAgICAgICAgICAgIGhlaWdodD17Y29udGFpbmVySCAqIDAuODV9XG4gICAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICAgIGRhdGFJZD17ZWRpdGluZ0RhdGFzZXR9XG4gICAgICAgICAgICAgICAgc2hvd0RhdGFzZXRUYWJsZT17dmlzU3RhdGVBY3Rpb25zLnNob3dEYXRhc2V0VGFibGV9XG4gICAgICAgICAgICAgICAgc29ydFRhYmxlQ29sdW1uPXt2aXNTdGF0ZUFjdGlvbnMuc29ydFRhYmxlQ29sdW1ufVxuICAgICAgICAgICAgICAgIHBpblRhYmxlQ29sdW1uPXt2aXNTdGF0ZUFjdGlvbnMucGluVGFibGVDb2x1bW59XG4gICAgICAgICAgICAgICAgY29weVRhYmxlQ29sdW1uPXt2aXNTdGF0ZUFjdGlvbnMuY29weVRhYmxlQ29sdW1ufVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gVE9ETzogd2UgbmVlZCB0byBtYWtlIHRoaXMgd2lkdGggY29uc2lzdGVudCB3aXRoIHRoZSBjc3MgcnVsZSBkZWZpbmVkIG1vZGFsLmpzOjMyIG1heC13aWR0aDogNzB2d1xuICAgICAgICAgICAgbW9kYWxQcm9wcy5jc3NTdHlsZSA9IGNzc2BcbiAgICAgICAgICAgICAgJHtEYXRhVGFibGVNb2RhbFN0eWxlfTtcbiAgICAgICAgICAgICAgJHttZWRpYS5wYWxtYFxuICAgICAgICAgICAgICAgIHdpZHRoOiAke3dpZHRofXB4O1xuICAgICAgICAgICAgICBgfTtcbiAgICAgICAgICAgIGA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIERFTEVURV9EQVRBX0lEOlxuICAgICAgICAgICAgLy8gdmFsaWRhdGUgb3B0aW9uc1xuICAgICAgICAgICAgaWYgKGRhdGFzZXRLZXlUb1JlbW92ZSAmJiBkYXRhc2V0cyAmJiBkYXRhc2V0c1tkYXRhc2V0S2V5VG9SZW1vdmVdKSB7XG4gICAgICAgICAgICAgIHRlbXBsYXRlID0gKFxuICAgICAgICAgICAgICAgIDxEZWxldGVEYXRhc2V0TW9kYWwgZGF0YXNldD17ZGF0YXNldHNbZGF0YXNldEtleVRvUmVtb3ZlXX0gbGF5ZXJzPXtsYXllcnN9IC8+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIG1vZGFsUHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdtb2RhbC50aXRsZS5kZWxldGVEYXRhc2V0JyxcbiAgICAgICAgICAgICAgICBjc3NTdHlsZTogc21hbGxNb2RhbENzcyxcbiAgICAgICAgICAgICAgICBmb290ZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgb25Db25maXJtOiAoKSA9PiB0aGlzLl9kZWxldGVEYXRhc2V0KGRhdGFzZXRLZXlUb1JlbW92ZSksXG4gICAgICAgICAgICAgICAgb25DYW5jZWw6IHRoaXMuX2Nsb3NlTW9kYWwsXG4gICAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbjoge1xuICAgICAgICAgICAgICAgICAgbmVnYXRpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICBsYXJnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiAnbW9kYWwuYnV0dG9uLmRlbGV0ZSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhazsgLy8gaW4gY2FzZSB3ZSBhZGQgYSBuZXcgY2FzZSBhZnRlciB0aGlzIG9uZVxuICAgICAgICAgIGNhc2UgQUREX0RBVEFfSUQ6XG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IChcbiAgICAgICAgICAgICAgPExvYWREYXRhTW9kYWxcbiAgICAgICAgICAgICAgICB7Li4ucHJvdmlkZXJTdGF0ZX1cbiAgICAgICAgICAgICAgICBvbkNsb3NlPXt0aGlzLl9jbG9zZU1vZGFsfVxuICAgICAgICAgICAgICAgIG9uRmlsZVVwbG9hZD17dGhpcy5fb25GaWxlVXBsb2FkfVxuICAgICAgICAgICAgICAgIG9uTG9hZENsb3VkTWFwPXt0aGlzLl9vbkxvYWRDbG91ZE1hcH1cbiAgICAgICAgICAgICAgICBjbG91ZFByb3ZpZGVycz17dGhpcy5wcm92aWRlcldpdGhTdG9yYWdlKHRoaXMucHJvcHMpfVxuICAgICAgICAgICAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcj17dGhpcy5wcm9wcy5wcm92aWRlckFjdGlvbnMuc2V0Q2xvdWRQcm92aWRlcn1cbiAgICAgICAgICAgICAgICBnZXRTYXZlZE1hcHM9e3RoaXMucHJvcHMucHJvdmlkZXJBY3Rpb25zLmdldFNhdmVkTWFwc31cbiAgICAgICAgICAgICAgICBsb2FkRmlsZXM9e3VpU3RhdGUubG9hZEZpbGVzfVxuICAgICAgICAgICAgICAgIGZpbGVMb2FkaW5nPXt2aXNTdGF0ZS5maWxlTG9hZGluZ31cbiAgICAgICAgICAgICAgICBmaWxlTG9hZGluZ1Byb2dyZXNzPXt2aXNTdGF0ZS5maWxlTG9hZGluZ1Byb2dyZXNzfVxuICAgICAgICAgICAgICAgIGZpbGVGb3JtYXROYW1lcz17Z2V0RmlsZUZvcm1hdE5hbWVzKHRoaXMucHJvcHMudmlzU3RhdGUpfVxuICAgICAgICAgICAgICAgIGZpbGVFeHRlbnNpb25zPXtnZXRGaWxlRXh0ZW5zaW9ucyh0aGlzLnByb3BzLnZpc1N0YXRlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBtb2RhbFByb3BzID0ge1xuICAgICAgICAgICAgICB0aXRsZTogJ21vZGFsLnRpdGxlLmFkZERhdGFUb01hcCcsXG4gICAgICAgICAgICAgIGNzc1N0eWxlOiBMb2FkRGF0YU1vZGFsU3R5bGUsXG4gICAgICAgICAgICAgIGZvb3RlcjogZmFsc2UsXG4gICAgICAgICAgICAgIG9uQ29uZmlybTogdGhpcy5fY2xvc2VNb2RhbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgRVhQT1JUX0lNQUdFX0lEOlxuICAgICAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgICAgIDxFeHBvcnRJbWFnZU1vZGFsXG4gICAgICAgICAgICAgICAgZXhwb3J0SW1hZ2U9e3VpU3RhdGUuZXhwb3J0SW1hZ2V9XG4gICAgICAgICAgICAgICAgbWFwVz17Y29udGFpbmVyV31cbiAgICAgICAgICAgICAgICBtYXBIPXtjb250YWluZXJIfVxuICAgICAgICAgICAgICAgIG9uVXBkYXRlSW1hZ2VTZXR0aW5nPXt1aVN0YXRlQWN0aW9ucy5zZXRFeHBvcnRJbWFnZVNldHRpbmd9XG4gICAgICAgICAgICAgICAgY2xlYW51cEV4cG9ydEltYWdlPXt1aVN0YXRlQWN0aW9ucy5jbGVhbnVwRXhwb3J0SW1hZ2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbW9kYWxQcm9wcyA9IHtcbiAgICAgICAgICAgICAgdGl0bGU6ICdtb2RhbC50aXRsZS5leHBvcnRJbWFnZScsXG4gICAgICAgICAgICAgIGNzc1N0eWxlOiAnJyxcbiAgICAgICAgICAgICAgZm9vdGVyOiB0cnVlLFxuICAgICAgICAgICAgICBvbkNhbmNlbDogdGhpcy5fY2xvc2VNb2RhbCxcbiAgICAgICAgICAgICAgb25Db25maXJtOiB0aGlzLl9vbkV4cG9ydEltYWdlLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uOiB7XG4gICAgICAgICAgICAgICAgbGFyZ2U6IHRydWUsXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6IHVpU3RhdGUuZXhwb3J0SW1hZ2UucHJvY2Vzc2luZyxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogJ21vZGFsLmJ1dHRvbi5kb3dubG9hZCdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgRVhQT1JUX0RBVEFfSUQ6XG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IChcbiAgICAgICAgICAgICAgPEV4cG9ydERhdGFNb2RhbFxuICAgICAgICAgICAgICAgIHsuLi51aVN0YXRlLmV4cG9ydERhdGF9XG4gICAgICAgICAgICAgICAgc3VwcG9ydGVkRGF0YVR5cGVzPXtFWFBPUlRfREFUQV9UWVBFX09QVElPTlN9XG4gICAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICAgIGFwcGx5Q1BVRmlsdGVyPXt0aGlzLnByb3BzLnZpc1N0YXRlQWN0aW9ucy5hcHBseUNQVUZpbHRlcn1cbiAgICAgICAgICAgICAgICBvbkNsb3NlPXt0aGlzLl9jbG9zZU1vZGFsfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlRXhwb3J0RGF0YVR5cGU9e3VpU3RhdGVBY3Rpb25zLnNldEV4cG9ydERhdGFUeXBlfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlRXhwb3J0U2VsZWN0ZWREYXRhc2V0PXt1aVN0YXRlQWN0aW9ucy5zZXRFeHBvcnRTZWxlY3RlZERhdGFzZXR9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VFeHBvcnRGaWx0ZXJlZD17dWlTdGF0ZUFjdGlvbnMuc2V0RXhwb3J0RmlsdGVyZWR9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbW9kYWxQcm9wcyA9IHtcbiAgICAgICAgICAgICAgdGl0bGU6ICdtb2RhbC50aXRsZS5leHBvcnREYXRhJyxcbiAgICAgICAgICAgICAgY3NzU3R5bGU6ICcnLFxuICAgICAgICAgICAgICBmb290ZXI6IHRydWUsXG4gICAgICAgICAgICAgIG9uQ2FuY2VsOiB0aGlzLl9jbG9zZU1vZGFsLFxuICAgICAgICAgICAgICBvbkNvbmZpcm06IHRoaXMuX29uRXhwb3J0RGF0YSxcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbjoge1xuICAgICAgICAgICAgICAgIGxhcmdlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiAnbW9kYWwuYnV0dG9uLmV4cG9ydCdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgRVhQT1JUX01BUF9JRDpcbiAgICAgICAgICAgIGNvbnN0IGtlcGxlckdsQ29uZmlnID0gdmlzU3RhdGUuc2NoZW1hLmdldENvbmZpZ1RvU2F2ZSh7XG4gICAgICAgICAgICAgIG1hcFN0eWxlLFxuICAgICAgICAgICAgICB2aXNTdGF0ZSxcbiAgICAgICAgICAgICAgbWFwU3RhdGUsXG4gICAgICAgICAgICAgIHVpU3RhdGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGVtcGxhdGUgPSAoXG4gICAgICAgICAgICAgIDxFeHBvcnRNYXBNb2RhbFxuICAgICAgICAgICAgICAgIGNvbmZpZz17a2VwbGVyR2xDb25maWd9XG4gICAgICAgICAgICAgICAgb3B0aW9ucz17dWlTdGF0ZS5leHBvcnRNYXB9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2VFeHBvcnRNYXBGb3JtYXQ9e3VpU3RhdGVBY3Rpb25zLnNldEV4cG9ydE1hcEZvcm1hdH1cbiAgICAgICAgICAgICAgICBvbkVkaXRVc2VyTWFwYm94QWNjZXNzVG9rZW49e3VpU3RhdGVBY3Rpb25zLnNldFVzZXJNYXBib3hBY2Nlc3NUb2tlbn1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZUV4cG9ydE1hcEhUTUxNb2RlPXt1aVN0YXRlQWN0aW9ucy5zZXRFeHBvcnRIVE1MTWFwTW9kZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBtb2RhbFByb3BzID0ge1xuICAgICAgICAgICAgICB0aXRsZTogJ21vZGFsLnRpdGxlLmV4cG9ydE1hcCcsXG4gICAgICAgICAgICAgIGNzc1N0eWxlOiAnJyxcbiAgICAgICAgICAgICAgZm9vdGVyOiB0cnVlLFxuICAgICAgICAgICAgICBvbkNhbmNlbDogdGhpcy5fY2xvc2VNb2RhbCxcbiAgICAgICAgICAgICAgb25Db25maXJtOiB0aGlzLl9vbkV4cG9ydE1hcCxcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbjoge1xuICAgICAgICAgICAgICAgIGxhcmdlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiAnbW9kYWwuYnV0dG9uLmV4cG9ydCdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgQUREX01BUF9TVFlMRV9JRDpcbiAgICAgICAgICAgIHRlbXBsYXRlID0gKFxuICAgICAgICAgICAgICA8QWRkTWFwU3R5bGVNb2RhbFxuICAgICAgICAgICAgICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuPXt0aGlzLnByb3BzLm1hcGJveEFwaUFjY2Vzc1Rva2VufVxuICAgICAgICAgICAgICAgIG1hcGJveEFwaVVybD17dGhpcy5wcm9wcy5tYXBib3hBcGlVcmx9XG4gICAgICAgICAgICAgICAgbWFwU3RhdGU9e3RoaXMucHJvcHMubWFwU3RhdGV9XG4gICAgICAgICAgICAgICAgaW5wdXRTdHlsZT17bWFwU3R5bGUuaW5wdXRTdHlsZX1cbiAgICAgICAgICAgICAgICBpbnB1dE1hcFN0eWxlPXt0aGlzLnByb3BzLm1hcFN0eWxlQWN0aW9ucy5pbnB1dE1hcFN0eWxlfVxuICAgICAgICAgICAgICAgIGxvYWRDdXN0b21NYXBTdHlsZT17dGhpcy5wcm9wcy5tYXBTdHlsZUFjdGlvbnMubG9hZEN1c3RvbU1hcFN0eWxlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1vZGFsUHJvcHMgPSB7XG4gICAgICAgICAgICAgIHRpdGxlOiAnbW9kYWwudGl0bGUuYWRkQ3VzdG9tTWFwYm94U3R5bGUnLFxuICAgICAgICAgICAgICBjc3NTdHlsZTogJycsXG4gICAgICAgICAgICAgIGZvb3RlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgb25DYW5jZWw6IHRoaXMuX2Nsb3NlTW9kYWwsXG4gICAgICAgICAgICAgIG9uQ29uZmlybTogdGhpcy5fb25BZGRDdXN0b21NYXBTdHlsZSxcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbjoge1xuICAgICAgICAgICAgICAgIGxhcmdlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiAhbWFwU3R5bGUuaW5wdXRTdHlsZS5zdHlsZSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogJ21vZGFsLmJ1dHRvbi5hZGRTdHlsZSdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgU0FWRV9NQVBfSUQ6XG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IChcbiAgICAgICAgICAgICAgPFNhdmVNYXBNb2RhbFxuICAgICAgICAgICAgICAgIHsuLi5wcm92aWRlclN0YXRlfVxuICAgICAgICAgICAgICAgIGV4cG9ydEltYWdlPXt1aVN0YXRlLmV4cG9ydEltYWdlfVxuICAgICAgICAgICAgICAgIG1hcEluZm89e3Zpc1N0YXRlLm1hcEluZm99XG4gICAgICAgICAgICAgICAgb25TZXRNYXBJbmZvPXt2aXNTdGF0ZUFjdGlvbnMuc2V0TWFwSW5mb31cbiAgICAgICAgICAgICAgICBjbG91ZFByb3ZpZGVycz17dGhpcy5wcm92aWRlcldpdGhTdG9yYWdlKHRoaXMucHJvcHMpfVxuICAgICAgICAgICAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcj17dGhpcy5wcm9wcy5wcm92aWRlckFjdGlvbnMuc2V0Q2xvdWRQcm92aWRlcn1cbiAgICAgICAgICAgICAgICBjbGVhbnVwRXhwb3J0SW1hZ2U9e3VpU3RhdGVBY3Rpb25zLmNsZWFudXBFeHBvcnRJbWFnZX1cbiAgICAgICAgICAgICAgICBvblVwZGF0ZUltYWdlU2V0dGluZz17dWlTdGF0ZUFjdGlvbnMuc2V0RXhwb3J0SW1hZ2VTZXR0aW5nfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1vZGFsUHJvcHMgPSB7XG4gICAgICAgICAgICAgIHRpdGxlOiAnbW9kYWwudGl0bGUuc2F2ZU1hcCcsXG4gICAgICAgICAgICAgIGNzc1N0eWxlOiAnJyxcbiAgICAgICAgICAgICAgZm9vdGVyOiB0cnVlLFxuICAgICAgICAgICAgICBvbkNhbmNlbDogdGhpcy5fY2xvc2VNb2RhbCxcbiAgICAgICAgICAgICAgb25Db25maXJtOiAoKSA9PiB0aGlzLl9vblNhdmVNYXAoZmFsc2UpLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uOiB7XG4gICAgICAgICAgICAgICAgbGFyZ2U6IHRydWUsXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6XG4gICAgICAgICAgICAgICAgICB1aVN0YXRlLmV4cG9ydEltYWdlLnByb2Nlc3NpbmcgfHxcbiAgICAgICAgICAgICAgICAgICFpc1ZhbGlkTWFwSW5mbyh2aXNTdGF0ZS5tYXBJbmZvKSB8fFxuICAgICAgICAgICAgICAgICAgIXByb3ZpZGVyU3RhdGUuY3VycmVudFByb3ZpZGVyLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiAnbW9kYWwuYnV0dG9uLnNhdmUnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIE9WRVJXUklURV9NQVBfSUQ6XG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IChcbiAgICAgICAgICAgICAgPE92ZXJXcml0ZU1hcE1vZGFsXG4gICAgICAgICAgICAgICAgey4uLnByb3ZpZGVyU3RhdGV9XG4gICAgICAgICAgICAgICAgY2xvdWRQcm92aWRlcnM9e3RoaXMucHJvcHMuY2xvdWRQcm92aWRlcnN9XG4gICAgICAgICAgICAgICAgdGl0bGU9e2dldCh2aXNTdGF0ZSwgWydtYXBJbmZvJywgJ3RpdGxlJ10pfVxuICAgICAgICAgICAgICAgIG9uU2V0Q2xvdWRQcm92aWRlcj17dGhpcy5wcm9wcy5wcm92aWRlckFjdGlvbnMuc2V0Q2xvdWRQcm92aWRlcn1cbiAgICAgICAgICAgICAgICBvblVwZGF0ZUltYWdlU2V0dGluZz17dWlTdGF0ZUFjdGlvbnMuc2V0RXhwb3J0SW1hZ2VTZXR0aW5nfVxuICAgICAgICAgICAgICAgIGNsZWFudXBFeHBvcnRJbWFnZT17dWlTdGF0ZUFjdGlvbnMuY2xlYW51cEV4cG9ydEltYWdlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1vZGFsUHJvcHMgPSB7XG4gICAgICAgICAgICAgIHRpdGxlOiAnT3ZlcndyaXRlIEV4aXN0aW5nIEZpbGU/JyxcbiAgICAgICAgICAgICAgY3NzU3R5bGU6IHNtYWxsTW9kYWxDc3MsXG4gICAgICAgICAgICAgIGZvb3RlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgb25Db25maXJtOiB0aGlzLl9vbk92ZXJ3cml0ZU1hcCxcbiAgICAgICAgICAgICAgb25DYW5jZWw6IHRoaXMuX2Nsb3NlTW9kYWwsXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b246IHtcbiAgICAgICAgICAgICAgICBsYXJnZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogJ1llcycsXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6XG4gICAgICAgICAgICAgICAgICB1aVN0YXRlLmV4cG9ydEltYWdlLnByb2Nlc3NpbmcgfHxcbiAgICAgICAgICAgICAgICAgICFpc1ZhbGlkTWFwSW5mbyh2aXNTdGF0ZS5tYXBJbmZvKSB8fFxuICAgICAgICAgICAgICAgICAgIXByb3ZpZGVyU3RhdGUuY3VycmVudFByb3ZpZGVyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFNIQVJFX01BUF9JRDpcbiAgICAgICAgICAgIHRlbXBsYXRlID0gKFxuICAgICAgICAgICAgICA8U2hhcmVNYXBNb2RhbFxuICAgICAgICAgICAgICAgIHsuLi5wcm92aWRlclN0YXRlfVxuICAgICAgICAgICAgICAgIGlzUmVhZHk9eyF1aVN0YXRlLmV4cG9ydEltYWdlLnByb2Nlc3Npbmd9XG4gICAgICAgICAgICAgICAgY2xvdWRQcm92aWRlcnM9e3RoaXMucHJvdmlkZXJXaXRoU2hhcmUodGhpcy5wcm9wcyl9XG4gICAgICAgICAgICAgICAgb25FeHBvcnQ9e3RoaXMuX29uU2hhcmVNYXBVcmx9XG4gICAgICAgICAgICAgICAgb25TZXRDbG91ZFByb3ZpZGVyPXt0aGlzLnByb3BzLnByb3ZpZGVyQWN0aW9ucy5zZXRDbG91ZFByb3ZpZGVyfVxuICAgICAgICAgICAgICAgIGNsZWFudXBFeHBvcnRJbWFnZT17dWlTdGF0ZUFjdGlvbnMuY2xlYW51cEV4cG9ydEltYWdlfVxuICAgICAgICAgICAgICAgIG9uVXBkYXRlSW1hZ2VTZXR0aW5nPXt1aVN0YXRlQWN0aW9ucy5zZXRFeHBvcnRJbWFnZVNldHRpbmd9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbW9kYWxQcm9wcyA9IHtcbiAgICAgICAgICAgICAgdGl0bGU6ICdtb2RhbC50aXRsZS5zaGFyZVVSTCcsXG4gICAgICAgICAgICAgIGNzc1N0eWxlOiAnJyxcbiAgICAgICAgICAgICAgb25DYW5jZWw6IHRoaXMuX29uQ2xvc2VTYXZlTWFwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnJvb3ROb2RlID8gKFxuICAgICAgICA8TW9kYWxEaWFsb2dcbiAgICAgICAgICBwYXJlbnRTZWxlY3Rvcj17KCkgPT4gZmluZERPTU5vZGUocm9vdE5vZGUpfVxuICAgICAgICAgIGlzT3Blbj17Qm9vbGVhbihjdXJyZW50TW9kYWwpfVxuICAgICAgICAgIG9uQ2FuY2VsPXt0aGlzLl9jbG9zZU1vZGFsfVxuICAgICAgICAgIHsuLi5tb2RhbFByb3BzfVxuICAgICAgICAgIGNzc1N0eWxlPXtEZWZhdWx0U3R5bGUuY29uY2F0KG1vZGFsUHJvcHMuY3NzU3R5bGUpfVxuICAgICAgICA+XG4gICAgICAgICAge3RlbXBsYXRlfVxuICAgICAgICA8L01vZGFsRGlhbG9nPlxuICAgICAgKSA6IG51bGw7XG4gICAgfVxuICAgIC8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuICB9XG5cbiAgcmV0dXJuIE1vZGFsQ29udGFpbmVyO1xufVxuIl19