"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileUpload = exports["default"] = exports.WarningMsg = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactIntl = require("react-intl");

var _uploadButton = _interopRequireDefault(require("./upload-button"));

var _icons = require("../icons");

var _fileUploadProgress = _interopRequireDefault(require("./file-upload-progress"));

var _fileDrop = _interopRequireDefault(require("./file-drop"));

var _utils = require("../../../utils/utils");

var _userGuides = require("../../../constants/user-guides");

var _reactMarkdown = _interopRequireDefault(require("react-markdown"));

var _mediaBreakpoints = require("../../../styles/media-breakpoints");

var _localization = require("../../../localization");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15, _templateObject16, _templateObject17, _templateObject18;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @typedef {import('./file-upload').FileUploadProps} FileUploadProps */
var fileIconColor = '#D3D8E0';

var LinkRenderer = function LinkRenderer(props) {
  return /*#__PURE__*/_react["default"].createElement("a", {
    href: props.href,
    target: "_blank",
    rel: "noopener noreferrer"
  }, props.children);
};

var StyledUploadMessage = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-size: 14px;\n  margin-bottom: 12px;\n\n  ", ";\n"])), function (props) {
  return props.theme.textColorLT;
}, _mediaBreakpoints.media.portable(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n    font-size: 12px;\n  "]))));

var WarningMsg = _styledComponents["default"].span(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-top: 10px;\n  color: ", ";\n  font-weight: 500;\n"])), function (props) {
  return props.theme.errorColor;
});

exports.WarningMsg = WarningMsg;

var StyledFileDrop = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: white;\n  border-radius: 4px;\n  border-style: ", ";\n  border-width: 1px;\n  border-color: ", ";\n  text-align: center;\n  width: 100%;\n  padding: 48px 8px 0;\n  height: 360px;\n\n  .file-upload-or {\n    color: ", ";\n    padding-right: 4px;\n  }\n\n  .file-type-row {\n    opacity: 0.5;\n  }\n  ", ";\n"])), function (props) {
  return props.dragOver ? 'solid' : 'dashed';
}, function (props) {
  return props.dragOver ? props.theme.textColorLT : props.theme.subtextColorLT;
}, function (props) {
  return props.theme.linkBtnColor;
}, _mediaBreakpoints.media.portable(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n    padding: 16px 4px 0;\n  "]))));

var MsgWrapper = _styledComponents["default"].div(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-size: 20px;\n  height: 36px;\n"])), function (props) {
  return props.theme.modalTitleColor;
});

var StyledDragNDropIcon = _styledComponents["default"].div(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  margin-bottom: 48px;\n\n  ", ";\n  ", ";\n"])), fileIconColor, _mediaBreakpoints.media.portable(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 16px;\n  "]))), _mediaBreakpoints.media.palm(_templateObject9 || (_templateObject9 = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 8px;\n  "]))));

var StyledFileTypeFow = _styledComponents["default"].div(_templateObject10 || (_templateObject10 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 24px;\n  ", ";\n  ", ";\n"])), _mediaBreakpoints.media.portable(_templateObject11 || (_templateObject11 = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 16px;\n  "]))), _mediaBreakpoints.media.palm(_templateObject12 || (_templateObject12 = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 8px;\n  "]))));

var StyledFileUpload = _styledComponents["default"].div(_templateObject13 || (_templateObject13 = (0, _taggedTemplateLiteral2["default"])(["\n  .file-drop {\n    position: relative;\n  }\n"])));

var StyledMessage = _styledComponents["default"].div(_templateObject14 || (_templateObject14 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 32px;\n\n  .loading-action {\n    margin-right: 10px;\n  }\n  .loading-spinner {\n    margin-left: 10px;\n  }\n"])));

var StyledDragFileWrapper = _styledComponents["default"].div(_templateObject15 || (_templateObject15 = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 32px;\n  ", ";\n  ", ";\n"])), _mediaBreakpoints.media.portable(_templateObject16 || (_templateObject16 = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 24px;\n  "]))), _mediaBreakpoints.media.portable(_templateObject17 || (_templateObject17 = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 16px;\n  "]))));

var StyledDisclaimer = (0, _styledComponents["default"])(StyledMessage)(_templateObject18 || (_templateObject18 = (0, _taggedTemplateLiteral2["default"])(["\n  margin: 0 auto;\n"])));

function FileUploadFactory() {
  /** @augments {Component<FileUploadProps>} */
  var FileUpload = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(FileUpload, _Component);

    var _super = _createSuper(FileUpload);

    function FileUpload() {
      var _this;

      (0, _classCallCheck2["default"])(this, FileUpload);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        dragOver: false,
        fileLoading: false,
        files: [],
        errorFiles: []
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "frame", /*#__PURE__*/(0, _react.createRef)());
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_isValidFileType", function (filename) {
        var _this$props$fileExten = _this.props.fileExtensions,
            fileExtensions = _this$props$fileExten === void 0 ? [] : _this$props$fileExten;
        var fileExt = fileExtensions.find(function (ext) {
          return filename.endsWith(ext);
        });
        return Boolean(fileExt);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_handleFileInput", function (fileList, event) {
        if (event) {
          event.stopPropagation();
        }

        var files = (0, _toConsumableArray2["default"])(fileList).filter(Boolean);
        var _this$props$disableEx = _this.props.disableExtensionFilter,
            disableExtensionFilter = _this$props$disableEx === void 0 ? false : _this$props$disableEx; // TODO - move this code out of the component

        var filesToLoad = [];
        var errorFiles = [];

        var _iterator = _createForOfIteratorHelper(files),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var file = _step.value;

            if (disableExtensionFilter || _this._isValidFileType(file.name)) {
              filesToLoad.push(file);
            } else {
              errorFiles.push(file.name);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        var nextState = {
          files: filesToLoad,
          errorFiles: errorFiles,
          dragOver: false
        };

        _this.setState(nextState, function () {
          return nextState.files.length ? _this.props.onFileUpload(nextState.files) : null;
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_toggleDragState", function (newState) {
        _this.setState({
          dragOver: newState
        });
      });
      return _this;
    }

    (0, _createClass2["default"])(FileUpload, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$state = this.state,
            dragOver = _this$state.dragOver,
            files = _this$state.files,
            errorFiles = _this$state.errorFiles;
        var _this$props = this.props,
            fileLoading = _this$props.fileLoading,
            fileLoadingProgress = _this$props.fileLoadingProgress,
            theme = _this$props.theme,
            intl = _this$props.intl;
        var _this$props2 = this.props,
            _this$props2$fileExte = _this$props2.fileExtensions,
            fileExtensions = _this$props2$fileExte === void 0 ? [] : _this$props2$fileExte,
            _this$props2$fileForm = _this$props2.fileFormatNames,
            fileFormatNames = _this$props2$fileForm === void 0 ? [] : _this$props2$fileForm;
        return /*#__PURE__*/_react["default"].createElement(StyledFileUpload, {
          className: "file-uploader",
          ref: this.frame
        }, _fileDrop["default"] ? /*#__PURE__*/_react["default"].createElement(_fileDrop["default"], {
          frame: this.frame.current || document,
          onDragOver: function onDragOver() {
            return _this2._toggleDragState(true);
          },
          onDragLeave: function onDragLeave() {
            return _this2._toggleDragState(false);
          },
          onDrop: this._handleFileInput,
          className: "file-uploader__file-drop"
        }, /*#__PURE__*/_react["default"].createElement(StyledUploadMessage, {
          className: "file-upload__message"
        }, /*#__PURE__*/_react["default"].createElement(_reactMarkdown["default"], {
          source: "".concat(intl.formatMessage({
            id: 'fileUploader.configUploadMessage'
          }, {
            fileFormatNames: fileFormatNames.map(function (format) {
              return "**".concat(format, "**");
            }).join(', ')
          }), "(").concat(_userGuides.GUIDES_FILE_FORMAT_DOC, ")."),
          renderers: {
            link: LinkRenderer
          }
        })), /*#__PURE__*/_react["default"].createElement(StyledFileDrop, {
          dragOver: dragOver
        }, /*#__PURE__*/_react["default"].createElement(StyledFileTypeFow, {
          className: "file-type-row"
        }, fileExtensions.map(function (ext) {
          return /*#__PURE__*/_react["default"].createElement(_icons.FileType, {
            key: ext,
            ext: ext,
            height: "50px",
            fontSize: "9px"
          });
        })), fileLoading ? /*#__PURE__*/_react["default"].createElement(_fileUploadProgress["default"], {
          fileLoadingProgress: fileLoadingProgress,
          theme: theme
        }) : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
          style: {
            opacity: dragOver ? 0.5 : 1
          },
          className: "file-upload-display-message"
        }, /*#__PURE__*/_react["default"].createElement(StyledDragNDropIcon, null, /*#__PURE__*/_react["default"].createElement(_icons.DragNDrop, {
          height: "44px"
        })), errorFiles.length ? /*#__PURE__*/_react["default"].createElement(WarningMsg, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'fileUploader.fileNotSupported',
          values: {
            errorFiles: errorFiles.join(', ')
          }
        })) : null), !files.length ? /*#__PURE__*/_react["default"].createElement(StyledDragFileWrapper, null, /*#__PURE__*/_react["default"].createElement(MsgWrapper, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'fileUploader.message'
        })), /*#__PURE__*/_react["default"].createElement("span", {
          className: "file-upload-or"
        }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'fileUploader.or'
        })), /*#__PURE__*/_react["default"].createElement(_uploadButton["default"], {
          onUpload: this._handleFileInput
        }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'fileUploader.browseFiles'
        }))) : null, /*#__PURE__*/_react["default"].createElement(StyledDisclaimer, null, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'fileUploader.disclaimer'
        }))))) : null, /*#__PURE__*/_react["default"].createElement(WarningMsg, null, (0, _utils.isChrome)() ? /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
          id: 'fileUploader.chromeMessage'
        }) : ''));
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(props, state) {
        if (state.fileLoading && props.fileLoading === false && state.files.length) {
          return {
            files: [],
            fileLoading: props.fileLoading
          };
        }

        return {
          fileLoading: props.fileLoading
        };
      }
    }]);
    return FileUpload;
  }(_react.Component);

  return (0, _reactIntl.injectIntl)(FileUpload);
}

var _default = FileUploadFactory;
exports["default"] = _default;
var FileUpload = FileUploadFactory();
exports.FileUpload = FileUpload;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWxlLXVwbG9hZGVyL2ZpbGUtdXBsb2FkLmpzIl0sIm5hbWVzIjpbImZpbGVJY29uQ29sb3IiLCJMaW5rUmVuZGVyZXIiLCJwcm9wcyIsImhyZWYiLCJjaGlsZHJlbiIsIlN0eWxlZFVwbG9hZE1lc3NhZ2UiLCJzdHlsZWQiLCJkaXYiLCJ0aGVtZSIsInRleHRDb2xvckxUIiwibWVkaWEiLCJwb3J0YWJsZSIsIldhcm5pbmdNc2ciLCJzcGFuIiwiZXJyb3JDb2xvciIsIlN0eWxlZEZpbGVEcm9wIiwiZHJhZ092ZXIiLCJzdWJ0ZXh0Q29sb3JMVCIsImxpbmtCdG5Db2xvciIsIk1zZ1dyYXBwZXIiLCJtb2RhbFRpdGxlQ29sb3IiLCJTdHlsZWREcmFnTkRyb3BJY29uIiwicGFsbSIsIlN0eWxlZEZpbGVUeXBlRm93IiwiU3R5bGVkRmlsZVVwbG9hZCIsIlN0eWxlZE1lc3NhZ2UiLCJTdHlsZWREcmFnRmlsZVdyYXBwZXIiLCJTdHlsZWREaXNjbGFpbWVyIiwiRmlsZVVwbG9hZEZhY3RvcnkiLCJGaWxlVXBsb2FkIiwiZmlsZUxvYWRpbmciLCJmaWxlcyIsImVycm9yRmlsZXMiLCJmaWxlbmFtZSIsImZpbGVFeHRlbnNpb25zIiwiZmlsZUV4dCIsImZpbmQiLCJleHQiLCJlbmRzV2l0aCIsIkJvb2xlYW4iLCJmaWxlTGlzdCIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwiZmlsdGVyIiwiZGlzYWJsZUV4dGVuc2lvbkZpbHRlciIsImZpbGVzVG9Mb2FkIiwiZmlsZSIsIl9pc1ZhbGlkRmlsZVR5cGUiLCJuYW1lIiwicHVzaCIsIm5leHRTdGF0ZSIsInNldFN0YXRlIiwibGVuZ3RoIiwib25GaWxlVXBsb2FkIiwibmV3U3RhdGUiLCJzdGF0ZSIsImZpbGVMb2FkaW5nUHJvZ3Jlc3MiLCJpbnRsIiwiZmlsZUZvcm1hdE5hbWVzIiwiZnJhbWUiLCJGaWxlRHJvcCIsImN1cnJlbnQiLCJkb2N1bWVudCIsIl90b2dnbGVEcmFnU3RhdGUiLCJfaGFuZGxlRmlsZUlucHV0IiwiZm9ybWF0TWVzc2FnZSIsImlkIiwibWFwIiwiZm9ybWF0Iiwiam9pbiIsIkdVSURFU19GSUxFX0ZPUk1BVF9ET0MiLCJsaW5rIiwib3BhY2l0eSIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFFQSxJQUFNQSxhQUFhLEdBQUcsU0FBdEI7O0FBRUEsSUFBTUMsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQUMsS0FBSyxFQUFJO0FBQzVCLHNCQUNFO0FBQUcsSUFBQSxJQUFJLEVBQUVBLEtBQUssQ0FBQ0MsSUFBZjtBQUFxQixJQUFBLE1BQU0sRUFBQyxRQUE1QjtBQUFxQyxJQUFBLEdBQUcsRUFBQztBQUF6QyxLQUNHRCxLQUFLLENBQUNFLFFBRFQsQ0FERjtBQUtELENBTkQ7O0FBT0EsSUFBTUMsbUJBQW1CLEdBQUdDLDZCQUFPQyxHQUFWLGdLQUNkLFVBQUFMLEtBQUs7QUFBQSxTQUFJQSxLQUFLLENBQUNNLEtBQU4sQ0FBWUMsV0FBaEI7QUFBQSxDQURTLEVBS3JCQyx3QkFBTUMsUUFMZSxtSEFBekI7O0FBVU8sSUFBTUMsVUFBVSxHQUFHTiw2QkFBT08sSUFBVixxSkFFWixVQUFBWCxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDTSxLQUFOLENBQVlNLFVBQWhCO0FBQUEsQ0FGTyxDQUFoQjs7OztBQU1QLElBQU1DLGNBQWMsR0FBR1QsNkJBQU9DLEdBQVYsaWFBR0YsVUFBQUwsS0FBSztBQUFBLFNBQUtBLEtBQUssQ0FBQ2MsUUFBTixHQUFpQixPQUFqQixHQUEyQixRQUFoQztBQUFBLENBSEgsRUFLRixVQUFBZCxLQUFLO0FBQUEsU0FBS0EsS0FBSyxDQUFDYyxRQUFOLEdBQWlCZCxLQUFLLENBQUNNLEtB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Qyw4QkFBRDtBQUFrQixVQUFBLEVBQUUsRUFBRTtBQUF0QixVQUFiLEdBQXNFLEVBRHpFLENBeEVGLENBREY7QUE4RUQ7QUFqSndCO0FBQUE7QUFBQSxhQVV6QixrQ0FBZ0M5RCxLQUFoQyxFQUF1Q3FELEtBQXZDLEVBQThDO0FBQzVDLFlBQUlBLEtBQUssQ0FBQ3pCLFdBQU4sSUFBcUI1QixLQUFLLENBQUM0QixXQUFOLEtBQXNCLEtBQTNDLElBQW9EeUIsS0FBSyxDQUFDeEIsS0FBTixDQUFZcUIsTUFBcEUsRUFBNEU7QUFDMUUsaUJBQU87QUFDTHJCLFlBQUFBLEtBQUssRUFBRSxFQURGO0FBRUxELFlBQUFBLFdBQVcsRUFBRTVCLEtBQUssQ0FBQzRCO0FBRmQsV0FBUDtBQUlEOztBQUNELGVBQU87QUFDTEEsVUFBQUEsV0FBVyxFQUFFNUIsS0FBSyxDQUFDNEI7QUFEZCxTQUFQO0FBR0Q7QUFwQndCO0FBQUE7QUFBQSxJQUVGMkMsZ0JBRkU7O0FBb0ozQixTQUFPLDJCQUFXNUMsVUFBWCxDQUFQO0FBQ0Q7O2VBRWNELGlCOztBQUNSLElBQU1DLFVBQVUsR0FBR0QsaUJBQWlCLEVBQXBDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50LCBjcmVhdGVSZWZ9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtpbmplY3RJbnRsfSBmcm9tICdyZWFjdC1pbnRsJztcbmltcG9ydCBVcGxvYWRCdXR0b24gZnJvbSAnLi91cGxvYWQtYnV0dG9uJztcbmltcG9ydCB7RHJhZ05Ecm9wLCBGaWxlVHlwZX0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IEZpbGVVcGxvYWRQcm9ncmVzcyBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9maWxlLXVwbG9hZGVyL2ZpbGUtdXBsb2FkLXByb2dyZXNzJztcbmltcG9ydCBGaWxlRHJvcCBmcm9tICcuL2ZpbGUtZHJvcCc7XG5cbmltcG9ydCB7aXNDaHJvbWV9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7R1VJREVTX0ZJTEVfRk9STUFUX0RPQ30gZnJvbSAnY29uc3RhbnRzL3VzZXItZ3VpZGVzJztcbmltcG9ydCBSZWFjdE1hcmtkb3duIGZyb20gJ3JlYWN0LW1hcmtkb3duJztcbi8vIEJyZWFrcG9pbnRzXG5pbXBvcnQge21lZGlhfSBmcm9tICdzdHlsZXMvbWVkaWEtYnJlYWtwb2ludHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdsb2NhbGl6YXRpb24nO1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi9maWxlLXVwbG9hZCcpLkZpbGVVcGxvYWRQcm9wc30gRmlsZVVwbG9hZFByb3BzICovXG5cbmNvbnN0IGZpbGVJY29uQ29sb3IgPSAnI0QzRDhFMCc7XG5cbmNvbnN0IExpbmtSZW5kZXJlciA9IHByb3BzID0+IHtcbiAgcmV0dXJuIChcbiAgICA8YSBocmVmPXtwcm9wcy5ocmVmfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCI+XG4gICAgICB7cHJvcHMuY2hpbGRyZW59XG4gICAgPC9hPlxuICApO1xufTtcbmNvbnN0IFN0eWxlZFVwbG9hZE1lc3NhZ2UgPSBzdHlsZWQuZGl2YFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JMVH07XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgbWFyZ2luLWJvdHRvbTogMTJweDtcblxuICAke21lZGlhLnBvcnRhYmxlYFxuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgYH07XG5gO1xuXG5leHBvcnQgY29uc3QgV2FybmluZ01zZyA9IHN0eWxlZC5zcGFuYFxuICBtYXJnaW4tdG9wOiAxMHB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5lcnJvckNvbG9yfTtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbmA7XG5cbmNvbnN0IFN0eWxlZEZpbGVEcm9wID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgYm9yZGVyLXN0eWxlOiAke3Byb3BzID0+IChwcm9wcy5kcmFnT3ZlciA/ICdzb2xpZCcgOiAnZGFzaGVkJyl9O1xuICBib3JkZXItd2lkdGg6IDFweDtcbiAgYm9yZGVyLWNvbG9yOiAke3Byb3BzID0+IChwcm9wcy5kcmFnT3ZlciA/IHByb3BzLnRoZW1lLnRleHRDb2xvckxUIDogcHJvcHMudGhlbWUuc3VidGV4dENvbG9yTFQpfTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB3aWR0aDogMTAwJTtcbiAgcGFkZGluZzogNDhweCA4cHggMDtcbiAgaGVpZ2h0OiAzNjBweDtcblxuICAuZmlsZS11cGxvYWQtb3Ige1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxpbmtCdG5Db2xvcn07XG4gICAgcGFkZGluZy1yaWdodDogNHB4O1xuICB9XG5cbiAgLmZpbGUtdHlwZS1yb3cge1xuICAgIG9wYWNpdHk6IDAuNTtcbiAgfVxuICAke21lZGlhLnBvcnRhYmxlYFxuICAgIHBhZGRpbmc6IDE2cHggNHB4IDA7XG4gIGB9O1xuYDtcblxuY29uc3QgTXNnV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1vZGFsVGl0bGVDb2xvcn07XG4gIGZvbnQtc2l6ZTogMjBweDtcbiAgaGVpZ2h0OiAzNnB4O1xuYDtcblxuY29uc3QgU3R5bGVkRHJhZ05Ecm9wSWNvbiA9IHN0eWxlZC5kaXZgXG4gIGNvbG9yOiAke2ZpbGVJY29uQ29sb3J9O1xuICBtYXJnaW4tYm90dG9tOiA0OHB4O1xuXG4gICR7bWVkaWEucG9ydGFibGVgXG4gICAgbWFyZ2luLWJvdHRvbTogMTZweDtcbiAgYH07XG4gICR7bWVkaWEucGFsbWBcbiAgICBtYXJnaW4tYm90dG9tOiA4cHg7XG4gIGB9O1xuYDtcblxuY29uc3QgU3R5bGVkRmlsZVR5cGVGb3cgPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tYm90dG9tOiAyNHB4O1xuICAke21lZGlhLnBvcnRhYmxlYFxuICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XG4gIGB9O1xuICAke21lZGlhLnBhbG1gXG4gICAgbWFyZ2luLWJvdHRvbTogOHB4O1xuICBgfTtcbmA7XG5cbmNvbnN0IFN0eWxlZEZpbGVVcGxvYWQgPSBzdHlsZWQuZGl2YFxuICAuZmlsZS1kcm9wIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZE1lc3NhZ2UgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWFyZ2luLWJvdHRvbTogMzJweDtcblxuICAubG9hZGluZy1hY3Rpb24ge1xuICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgfVxuICAubG9hZGluZy1zcGlubmVyIHtcbiAgICBtYXJnaW4tbGVmdDogMTBweDtcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkRHJhZ0ZpbGVXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgbWFyZ2luLWJvdHRvbTogMzJweDtcbiAgJHttZWRpYS5wb3J0YWJsZWBcbiAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xuICBgfTtcbiAgJHttZWRpYS5wb3J0YWJsZWBcbiAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuICBgfTtcbmA7XG5cbmNvbnN0IFN0eWxlZERpc2NsYWltZXIgPSBzdHlsZWQoU3R5bGVkTWVzc2FnZSlgXG4gIG1hcmdpbjogMCBhdXRvO1xuYDtcblxuZnVuY3Rpb24gRmlsZVVwbG9hZEZhY3RvcnkoKSB7XG4gIC8qKiBAYXVnbWVudHMge0NvbXBvbmVudDxGaWxlVXBsb2FkUHJvcHM+fSAqL1xuICBjbGFzcyBGaWxlVXBsb2FkIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0ZSA9IHtcbiAgICAgIGRyYWdPdmVyOiBmYWxzZSxcbiAgICAgIGZpbGVMb2FkaW5nOiBmYWxzZSxcbiAgICAgIGZpbGVzOiBbXSxcbiAgICAgIGVycm9yRmlsZXM6IFtdXG4gICAgfTtcblxuICAgIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMocHJvcHMsIHN0YXRlKSB7XG4gICAgICBpZiAoc3RhdGUuZmlsZUxvYWRpbmcgJiYgcHJvcHMuZmlsZUxvYWRpbmcgPT09IGZhbHNlICYmIHN0YXRlLmZpbGVzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGZpbGVzOiBbXSxcbiAgICAgICAgICBmaWxlTG9hZGluZzogcHJvcHMuZmlsZUxvYWRpbmdcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZpbGVMb2FkaW5nOiBwcm9wcy5maWxlTG9hZGluZ1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmcmFtZSA9IGNyZWF0ZVJlZigpO1xuXG4gICAgX2lzVmFsaWRGaWxlVHlwZSA9IGZpbGVuYW1lID0+IHtcbiAgICAgIGNvbnN0IHtmaWxlRXh0ZW5zaW9ucyA9IFtdfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBmaWxlRXh0ID0gZmlsZUV4dGVuc2lvbnMuZmluZChleHQgPT4gZmlsZW5hbWUuZW5kc1dpdGgoZXh0KSk7XG5cbiAgICAgIHJldHVybiBCb29sZWFuKGZpbGVFeHQpO1xuICAgIH07XG5cbiAgICAvKiogQHBhcmFtIHtGaWxlTGlzdH0gZmlsZUxpc3QgKi9cbiAgICBfaGFuZGxlRmlsZUlucHV0ID0gKGZpbGVMaXN0LCBldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmaWxlcyA9IFsuLi5maWxlTGlzdF0uZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgICBjb25zdCB7ZGlzYWJsZUV4dGVuc2lvbkZpbHRlciA9IGZhbHNlfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIC8vIFRPRE8gLSBtb3ZlIHRoaXMgY29kZSBvdXQgb2YgdGhlIGNvbXBvbmVudFxuICAgICAgY29uc3QgZmlsZXNUb0xvYWQgPSBbXTtcbiAgICAgIGNvbnN0IGVycm9yRmlsZXMgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICBpZiAoZGlzYWJsZUV4dGVuc2lvbkZpbHRlciB8fCB0aGlzLl9pc1ZhbGlkRmlsZVR5cGUoZmlsZS5uYW1lKSkge1xuICAgICAgICAgIGZpbGVzVG9Mb2FkLnB1c2goZmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXJyb3JGaWxlcy5wdXNoKGZpbGUubmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgbmV4dFN0YXRlID0ge2ZpbGVzOiBmaWxlc1RvTG9hZCwgZXJyb3JGaWxlcywgZHJhZ092ZXI6IGZhbHNlfTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZShuZXh0U3RhdGUsICgpID0+XG4gICAgICAgIG5leHRTdGF0ZS5maWxlcy5sZW5ndGggPyB0aGlzLnByb3BzLm9uRmlsZVVwbG9hZChuZXh0U3RhdGUuZmlsZXMpIDogbnVsbFxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgX3RvZ2dsZURyYWdTdGF0ZSA9IG5ld1N0YXRlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdPdmVyOiBuZXdTdGF0ZX0pO1xuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7ZHJhZ092ZXIsIGZpbGVzLCBlcnJvckZpbGVzfSA9IHRoaXMuc3RhdGU7XG4gICAgICBjb25zdCB7ZmlsZUxvYWRpbmcsIGZpbGVMb2FkaW5nUHJvZ3Jlc3MsIHRoZW1lLCBpbnRsfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCB7ZmlsZUV4dGVuc2lvbnMgPSBbXSwgZmlsZUZvcm1hdE5hbWVzID0gW119ID0gdGhpcy5wcm9wcztcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdHlsZWRGaWxlVXBsb2FkIGNsYXNzTmFtZT1cImZpbGUtdXBsb2FkZXJcIiByZWY9e3RoaXMuZnJhbWV9PlxuICAgICAgICAgIHtGaWxlRHJvcCA/IChcbiAgICAgICAgICAgIDxGaWxlRHJvcFxuICAgICAgICAgICAgICBmcmFtZT17dGhpcy5mcmFtZS5jdXJyZW50IHx8IGRvY3VtZW50fVxuICAgICAgICAgICAgICBvbkRyYWdPdmVyPXsoKSA9PiB0aGlzLl90b2dnbGVEcmFnU3RhdGUodHJ1ZSl9XG4gICAgICAgICAgICAgIG9uRHJhZ0xlYXZlPXsoKSA9PiB0aGlzLl90b2dnbGVEcmFnU3RhdGUoZmFsc2UpfVxuICAgICAgICAgICAgICBvbkRyb3A9e3RoaXMuX2hhbmRsZUZpbGVJbnB1dH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmlsZS11cGxvYWRlcl9fZmlsZS1kcm9wXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFN0eWxlZFVwbG9hZE1lc3NhZ2UgY2xhc3NOYW1lPVwiZmlsZS11cGxvYWRfX21lc3NhZ2VcIj5cbiAgICAgICAgICAgICAgICA8UmVhY3RNYXJrZG93blxuICAgICAgICAgICAgICAgICAgc291cmNlPXtgJHtpbnRsLmZvcm1hdE1lc3NhZ2UoXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBpZDogJ2ZpbGVVcGxvYWRlci5jb25maWdVcGxvYWRNZXNzYWdlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgZmlsZUZvcm1hdE5hbWVzOiBmaWxlRm9ybWF0TmFtZXMubWFwKGZvcm1hdCA9PiBgKioke2Zvcm1hdH0qKmApLmpvaW4oJywgJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgKX0oJHtHVUlERVNfRklMRV9GT1JNQVRfRE9DfSkuYH1cbiAgICAgICAgICAgICAgICAgIHJlbmRlcmVycz17e2xpbms6IExpbmtSZW5kZXJlcn19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9TdHlsZWRVcGxvYWRNZXNzYWdlPlxuICAgICAgICAgICAgICA8U3R5bGVkRmlsZURyb3AgZHJhZ092ZXI9e2RyYWdPdmVyfT5cbiAgICAgICAgICAgICAgICA8U3R5bGVkRmlsZVR5cGVGb3cgY2xhc3NOYW1lPVwiZmlsZS10eXBlLXJvd1wiPlxuICAgICAgICAgICAgICAgICAge2ZpbGVFeHRlbnNpb25zLm1hcChleHQgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8RmlsZVR5cGUga2V5PXtleHR9IGV4dD17ZXh0fSBoZWlnaHQ9XCI1MHB4XCIgZm9udFNpemU9XCI5cHhcIiAvPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC9TdHlsZWRGaWxlVHlwZUZvdz5cbiAgICAgICAgICAgICAgICB7ZmlsZUxvYWRpbmcgPyAoXG4gICAgICAgICAgICAgICAgICA8RmlsZVVwbG9hZFByb2dyZXNzIGZpbGVMb2FkaW5nUHJvZ3Jlc3M9e2ZpbGVMb2FkaW5nUHJvZ3Jlc3N9IHRoZW1lPXt0aGVtZX0gLz5cbiAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7b3BhY2l0eTogZHJhZ092ZXIgPyAwLjUgOiAxfX1cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmaWxlLXVwbG9hZC1kaXNwbGF5LW1lc3NhZ2VcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPFN0eWxlZERyYWdORHJvcEljb24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8RHJhZ05Ecm9wIGhlaWdodD1cIjQ0cHhcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvU3R5bGVkRHJhZ05Ecm9wSWNvbj5cblxuICAgICAgICAgICAgICAgICAgICAgIHtlcnJvckZpbGVzLmxlbmd0aCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxXYXJuaW5nTXNnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPXsnZmlsZVVwbG9hZGVyLmZpbGVOb3RTdXBwb3J0ZWQnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcz17e2Vycm9yRmlsZXM6IGVycm9yRmlsZXMuam9pbignLCAnKX19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L1dhcm5pbmdNc2c+XG4gICAgICAgICAgICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICB7IWZpbGVzLmxlbmd0aCA/IChcbiAgICAgICAgICAgICAgICAgICAgICA8U3R5bGVkRHJhZ0ZpbGVXcmFwcGVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPE1zZ1dyYXBwZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnZmlsZVVwbG9hZGVyLm1lc3NhZ2UnfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Nc2dXcmFwcGVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmlsZS11cGxvYWQtb3JcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydmaWxlVXBsb2FkZXIub3InfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFVwbG9hZEJ1dHRvbiBvblVwbG9hZD17dGhpcy5faGFuZGxlRmlsZUlucHV0fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydmaWxlVXBsb2FkZXIuYnJvd3NlRmlsZXMnfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9VcGxvYWRCdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPC9TdHlsZWREcmFnRmlsZVdyYXBwZXI+XG4gICAgICAgICAgICAgICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgICAgICAgICAgICAgIDxTdHlsZWREaXNjbGFpbWVyPlxuICAgICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnZmlsZVVwbG9hZGVyLmRpc2NsYWltZXInfSAvPlxuICAgICAgICAgICAgICAgICAgICA8L1N0eWxlZERpc2NsYWltZXI+XG4gICAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L1N0eWxlZEZpbGVEcm9wPlxuICAgICAgICAgICAgPC9GaWxlRHJvcD5cbiAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgIDxXYXJuaW5nTXNnPlxuICAgICAgICAgICAge2lzQ2hyb21lKCkgPyA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J2ZpbGVVcGxvYWRlci5jaHJvbWVNZXNzYWdlJ30gLz4gOiAnJ31cbiAgICAgICAgICA8L1dhcm5pbmdNc2c+XG4gICAgICAgIDwvU3R5bGVkRmlsZVVwbG9hZD5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGluamVjdEludGwoRmlsZVVwbG9hZCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZpbGVVcGxvYWRGYWN0b3J5O1xuZXhwb3J0IGNvbnN0IEZpbGVVcGxvYWQgPSBGaWxlVXBsb2FkRmFjdG9yeSgpO1xuIl19