"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileUpload = exports["default"] = exports.WarningMsg = void 0;

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

var _uploadButton = _interopRequireDefault(require("./upload-button"));

var _icons = require("../icons");

var _loadingSpinner = _interopRequireDefault(require("../loading-spinner"));

var _fileDrop = _interopRequireDefault(require("./file-drop"));

var _utils = require("../../../utils/utils");

var _userGuides = require("../../../constants/user-guides");

var _reactMarkdown = _interopRequireDefault(require("react-markdown"));

var _mediaBreakpoints = require("../../../styles/media-breakpoints");

var _reactIntl = require("react-intl");

function _templateObject19() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin: 0 auto;\n"]);

  _templateObject19 = function _templateObject19() {
    return data;
  };

  return data;
}

function _templateObject18() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 16px;\n  "]);

  _templateObject18 = function _templateObject18() {
    return data;
  };

  return data;
}

function _templateObject17() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 24px;\n  "]);

  _templateObject17 = function _templateObject17() {
    return data;
  };

  return data;
}

function _templateObject16() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 32px;\n  ", ";\n  ", "\n"]);

  _templateObject16 = function _templateObject16() {
    return data;
  };

  return data;
}

function _templateObject15() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 32px;\n\n  .loading-action {\n    margin-right: 10px;\n  }\n  .loading-spinner {\n    margin-left: 10px;\n  }\n"]);

  _templateObject15 = function _templateObject15() {
    return data;
  };

  return data;
}

function _templateObject14() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  .file-drop {\n    position: relative;\n  }\n"]);

  _templateObject14 = function _templateObject14() {
    return data;
  };

  return data;
}

function _templateObject13() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 8px;\n  "]);

  _templateObject13 = function _templateObject13() {
    return data;
  };

  return data;
}

function _templateObject12() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 16px;\n  "]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-bottom: 24px;\n  ", ";\n  ", ";\n"]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 8px;\n  "]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    margin-bottom: 16px;\n  "]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  margin-bottom: 48px;\n\n  ", ";\n  ", ";\n"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-size: 20px;\n  height: 36px;\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    padding: 16px 4px 0;\n  "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: white;\n  border-radius: 4px;\n  border-style: dashed;\n  border-width: 1px;\n  border-color: ", ";\n  text-align: center;\n  width: 100%;\n  padding: 48px 8px 0;\n\n  .file-upload-or {\n    color: ", ";\n    padding-right: 4px;\n  }\n\n  ", ";\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: inline-block;\n  color: ", ";\n  font-weight: 500;\n  margin-right: 8px;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin-top: 10px;\n  color: ", ";\n  font-weight: 500;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    font-size: 12px;\n  "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-size: 14px;\n  margin-bottom: 12px;\n\n  ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

// File.type is not reliable if the OS does not have a
// registered mapping for the extension.
// NOTE: Shapefiles must be in a compressed format since
// it requires multiple files to be present.
var defaultValidFileExt = ['csv', 'json', 'geojson'];
var fileIconColor = '#D3D8E0';

var LinkRenderer = function LinkRenderer(props) {
  return _react["default"].createElement("a", {
    href: props.href,
    target: "_blank",
    rel: "noopener noreferrer"
  }, props.children);
};

var StyledUploadMessage = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.textColorLT;
}, _mediaBreakpoints.media.portable(_templateObject2()));

var WarningMsg = _styledComponents["default"].span(_templateObject3(), function (props) {
  return props.theme.errorColor;
});

exports.WarningMsg = WarningMsg;

var PositiveMsg = _styledComponents["default"].span(_templateObject4(), function (props) {
  return props.theme.primaryBtnActBgd;
});

var StyledFileDrop = _styledComponents["default"].div(_templateObject5(), function (props) {
  return props.theme.subtextColorLT;
}, function (props) {
  return props.theme.linkBtnColor;
}, _mediaBreakpoints.media.portable(_templateObject6()));

var MsgWrapper = _styledComponents["default"].div(_templateObject7(), function (props) {
  return props.theme.modalTitleColor;
});

var StyledDragNDropIcon = _styledComponents["default"].div(_templateObject8(), fileIconColor, _mediaBreakpoints.media.portable(_templateObject9()), _mediaBreakpoints.media.palm(_templateObject10()));

var StyledFileTypeFow = _styledComponents["default"].div(_templateObject11(), _mediaBreakpoints.media.portable(_templateObject12()), _mediaBreakpoints.media.palm(_templateObject13()));

var StyledFileUpload = _styledComponents["default"].div(_templateObject14());

var StyledMessage = _styledComponents["default"].div(_templateObject15());

var StyledDragFileWrapper = _styledComponents["default"].div(_templateObject16(), _mediaBreakpoints.media.portable(_templateObject17()), _mediaBreakpoints.media.portable(_templateObject18()));

var StyledDisclaimer = (0, _styledComponents["default"])(StyledMessage)(_templateObject19());

function FileUploadFactory() {
  var FileUpload =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(FileUpload, _Component);

    function FileUpload() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, FileUpload);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(FileUpload)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        dragOver: false,
        fileLoading: false,
        files: [],
        errorFiles: []
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "frame", (0, _react.createRef)());
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_isValidFileType", function (filename) {
        var validFileExt = _this.props.validFileExt;
        var fileExt = validFileExt.find(function (ext) {
          return filename.endsWith(ext);
        });
        return Boolean(fileExt);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_handleFileInput", function (files, e) {
        if (e) {
          e.stopPropagation();
        }

        var nextState = {
          files: [],
          errorFiles: [],
          dragOver: false
        };

        for (var i = 0; i < files.length; i++) {
          var file = files[i];

          if (file && _this._isValidFileType(file.name)) {
            nextState.files.push(file);
          } else {
            nextState.errorFiles.push(file.name);
          }
        }

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
      key: "_renderMessage",
      value: function _renderMessage() {
        var _this$state = this.state,
            errorFiles = _this$state.errorFiles,
            files = _this$state.files;

        if (errorFiles.length) {
          return _react["default"].createElement(WarningMsg, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
            id: 'fileUploader.filenNotSupported',
            values: {
              errorFiles: errorFiles.join(', ')
            }
          }));
        } else if (this.props.fileLoading && files.length) {
          return _react["default"].createElement(StyledMessage, {
            className: "file-uploader__message"
          }, _react["default"].createElement("div", {
            className: "loading-action"
          }, _react["default"].createElement(_reactIntl.FormattedMessage, {
            id: 'fileUploader.uploading'
          })), _react["default"].createElement("div", null, files.map(function (f, i) {
            return _react["default"].createElement(PositiveMsg, {
              key: i
            }, f.name);
          }), "..."), _react["default"].createElement("div", {
            className: "loading-spinner"
          }, _react["default"].createElement(_loadingSpinner["default"], {
            size: 20
          })));
        }

        return null;
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$state2 = this.state,
            dragOver = _this$state2.dragOver,
            files = _this$state2.files;
        var _this$props = this.props,
            validFileExt = _this$props.validFileExt,
            intl = _this$props.intl;
        return _react["default"].createElement(StyledFileUpload, {
          className: "file-uploader",
          ref: this.frame
        }, _fileDrop["default"] ? _react["default"].createElement(_fileDrop["default"], {
          frame: this.frame.current || document,
          onDragOver: function onDragOver() {
            return _this2._toggleDragState(true);
          },
          onDragLeave: function onDragLeave() {
            return _this2._toggleDragState(false);
          },
          onDrop: this._handleFileInput,
          className: "file-uploader__file-drop"
        }, _react["default"].createElement(StyledUploadMessage, {
          className: "file-upload__message"
        }, _react["default"].createElement(_reactMarkdown["default"], {
          source: "".concat(intl.formatMessage({
            id: 'fileUploader.configUploadMessage'
          }), "(").concat(_userGuides.GUIDES_FILE_FORMAT_DOC, ")."),
          renderers: {
            link: LinkRenderer
          }
        })), _react["default"].createElement(StyledFileDrop, {
          dragOver: dragOver
        }, _react["default"].createElement("div", {
          style: {
            opacity: dragOver ? 0.5 : 1
          }
        }, _react["default"].createElement(StyledDragNDropIcon, null, _react["default"].createElement(StyledFileTypeFow, {
          className: "file-type-row"
        }, validFileExt.map(function (ext) {
          return _react["default"].createElement(_icons.FileType, {
            key: ext,
            ext: ext,
            height: "50px",
            fontSize: "9px"
          });
        })), _react["default"].createElement(_icons.DragNDrop, {
          height: "44px"
        })), _react["default"].createElement("div", null, this._renderMessage())), !files.length ? _react["default"].createElement(StyledDragFileWrapper, null, _react["default"].createElement(MsgWrapper, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'fileUploader.message'
        })), _react["default"].createElement("span", {
          className: "file-upload-or"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'fileUploader.or'
        })), _react["default"].createElement(_uploadButton["default"], {
          onUpload: this._handleFileInput
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'fileUploader.browseFiles'
        }))) : null, _react["default"].createElement(StyledDisclaimer, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'fileUploader.disclaimer'
        })))) : null, _react["default"].createElement(WarningMsg, null, (0, _utils.isChrome)() ? _react["default"].createElement(_reactIntl.FormattedMessage, {
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

  (0, _defineProperty2["default"])(FileUpload, "propTypes", {
    onFileUpload: _propTypes["default"].func.isRequired,
    validFileExt: _propTypes["default"].arrayOf(_propTypes["default"].string),
    fileLoading: _propTypes["default"].bool
  });
  (0, _defineProperty2["default"])(FileUpload, "defaultProps", {
    validFileExt: defaultValidFileExt
  });
  return (0, _reactIntl.injectIntl)(FileUpload);
}

var _default = FileUploadFactory;
exports["default"] = _default;
var FileUpload = FileUploadFactory();
exports.FileUpload = FileUpload;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWxlLXVwbG9hZGVyL2ZpbGUtdXBsb2FkLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRWYWxpZEZpbGVFeHQiLCJmaWxlSWNvbkNvbG9yIiwiTGlua1JlbmRlcmVyIiwicHJvcHMiLCJocmVmIiwiY2hpbGRyZW4iLCJTdHlsZWRVcGxvYWRNZXNzYWdlIiwic3R5bGVkIiwiZGl2IiwidGhlbWUiLCJ0ZXh0Q29sb3JMVCIsIm1lZGlhIiwicG9ydGFibGUiLCJXYXJuaW5nTXNnIiwic3BhbiIsImVycm9yQ29sb3IiLCJQb3NpdGl2ZU1zZyIsInByaW1hcnlCdG5BY3RCZ2QiLCJTdHlsZWRGaWxlRHJvcCIsInN1YnRleHRDb2xvckxUIiwibGlua0J0bkNvbG9yIiwiTXNnV3JhcHBlciIsIm1vZGFsVGl0bGVDb2xvciIsIlN0eWxlZERyYWdORHJvcEljb24iLCJwYWxtIiwiU3R5bGVkRmlsZVR5cGVGb3ciLCJTdHlsZWRGaWxlVXBsb2FkIiwiU3R5bGVkTWVzc2FnZSIsIlN0eWxlZERyYWdGaWxlV3JhcHBlciIsIlN0eWxlZERpc2NsYWltZXIiLCJGaWxlVXBsb2FkRmFjdG9yeSIsIkZpbGVVcGxvYWQiLCJkcmFnT3ZlciIsImZpbGVMb2FkaW5nIiwiZmlsZXMiLCJlcnJvckZpbGVzIiwiZmlsZW5hbWUiLCJ2YWxpZEZpbGVFeHQiLCJmaWxlRXh0IiwiZmluZCIsImV4dCIsImVuZHNXaXRoIiwiQm9vbGVhbiIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJuZXh0U3RhdGUiLCJpIiwibGVuZ3RoIiwiZmlsZSIsIl9pc1ZhbGlkRmlsZVR5cGUiLCJuYW1lIiwicHVzaCIsInNldFN0YXRlIiwib25GaWxlVXBsb2FkIiwibmV3U3RhdGUiLCJzdGF0ZSIsImpvaW4iLCJtYXAiLCJmIiwiaW50bCIsImZyYW1lIiwiRmlsZURyb3AiLCJjdXJyZW50IiwiZG9jdW1lbnQiLCJfdG9nZ2xlRHJhZ1N0YXRlIiwiX2hhbmRsZUZpbGVJbnB1dCIsImZvcm1hdE1lc3NhZ2UiLCJpZCIsIkdVSURFU19GSUxFX0ZPUk1BVF9ET0MiLCJsaW5rIiwib3BhY2l0eSIsIl9yZW5kZXJNZXNzYWdlIiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJhcnJheU9mIiwic3RyaW5nIiwiYm9vbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU1BLG1CQUFtQixHQUFHLENBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsU0FBaEIsQ0FBNUI7QUFFQSxJQUFNQyxhQUFhLEdBQUcsU0FBdEI7O0FBRUEsSUFBTUMsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQUMsS0FBSyxFQUFJO0FBQzVCLFNBQ0U7QUFBRyxJQUFBLElBQUksRUFBRUEsS0FBSyxDQUFDQyxJQUFmO0FBQXFCLElBQUEsTUFBTSxFQUFDLFFBQTVCO0FBQXFDLElBQUEsR0FBRyxFQUFDO0FBQXpDLEtBQ0dELEtBQUssQ0FBQ0UsUUFEVCxDQURGO0FBS0QsQ0FORDs7QUFPQSxJQUFNQyxtQkFBbUIsR0FBR0MsNkJBQU9DLEdBQVYsb0JBQ2QsVUFBQUwsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ00sS0FBTixDQUFZQyxXQUFoQjtBQUFBLENBRFMsRUFLckJDLHdCQUFNQyxRQUxlLHFCQUF6Qjs7QUFVTyxJQUFN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LENBQVA7QUFDRDs7ZUFFY0QsaUI7O0FBQ1IsSUFBTUMsVUFBVSxHQUFHRCxpQkFBaUIsRUFBcEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnQsIGNyZWF0ZVJlZn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgVXBsb2FkQnV0dG9uIGZyb20gJy4vdXBsb2FkLWJ1dHRvbic7XG5pbXBvcnQge0RyYWdORHJvcCwgRmlsZVR5cGV9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBMb2FkaW5nU3Bpbm5lciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9sb2FkaW5nLXNwaW5uZXInO1xuaW1wb3J0IEZpbGVEcm9wIGZyb20gJy4vZmlsZS1kcm9wJztcblxuaW1wb3J0IHtpc0Nocm9tZX0gZnJvbSAndXRpbHMvdXRpbHMnO1xuaW1wb3J0IHtHVUlERVNfRklMRV9GT1JNQVRfRE9DfSBmcm9tICdjb25zdGFudHMvdXNlci1ndWlkZXMnO1xuaW1wb3J0IFJlYWN0TWFya2Rvd24gZnJvbSAncmVhY3QtbWFya2Rvd24nO1xuLy8gQnJlYWtwb2ludHNcbmltcG9ydCB7bWVkaWF9IGZyb20gJ3N0eWxlcy9tZWRpYS1icmVha3BvaW50cyc7XG5pbXBvcnQge0Zvcm1hdHRlZE1lc3NhZ2UsIGluamVjdEludGx9IGZyb20gJ3JlYWN0LWludGwnO1xuXG4vLyBGaWxlLnR5cGUgaXMgbm90IHJlbGlhYmxlIGlmIHRoZSBPUyBkb2VzIG5vdCBoYXZlIGFcbi8vIHJlZ2lzdGVyZWQgbWFwcGluZyBmb3IgdGhlIGV4dGVuc2lvbi5cbi8vIE5PVEU6IFNoYXBlZmlsZXMgbXVzdCBiZSBpbiBhIGNvbXByZXNzZWQgZm9ybWF0IHNpbmNlXG4vLyBpdCByZXF1aXJlcyBtdWx0aXBsZSBmaWxlcyB0byBiZSBwcmVzZW50LlxuY29uc3QgZGVmYXVsdFZhbGlkRmlsZUV4dCA9IFsnY3N2JywgJ2pzb24nLCAnZ2VvanNvbiddO1xuXG5jb25zdCBmaWxlSWNvbkNvbG9yID0gJyNEM0Q4RTAnO1xuXG5jb25zdCBMaW5rUmVuZGVyZXIgPSBwcm9wcyA9PiB7XG4gIHJldHVybiAoXG4gICAgPGEgaHJlZj17cHJvcHMuaHJlZn0gdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiPlxuICAgICAge3Byb3BzLmNoaWxkcmVufVxuICAgIDwvYT5cbiAgKTtcbn07XG5jb25zdCBTdHlsZWRVcGxvYWRNZXNzYWdlID0gc3R5bGVkLmRpdmBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yTFR9O1xuICBmb250LXNpemU6IDE0cHg7XG4gIG1hcmdpbi1ib3R0b206IDEycHg7XG5cbiAgJHttZWRpYS5wb3J0YWJsZWBcbiAgICBmb250LXNpemU6IDEycHg7XG4gIGB9XG5gO1xuXG5leHBvcnQgY29uc3QgV2FybmluZ01zZyA9IHN0eWxlZC5zcGFuYFxuICBtYXJnaW4tdG9wOiAxMHB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5lcnJvckNvbG9yfTtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbmA7XG5cbmNvbnN0IFBvc2l0aXZlTXNnID0gc3R5bGVkLnNwYW5gXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucHJpbWFyeUJ0bkFjdEJnZH07XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIG1hcmdpbi1yaWdodDogOHB4O1xuYDtcblxuY29uc3QgU3R5bGVkRmlsZURyb3AgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBib3JkZXItc3R5bGU6IGRhc2hlZDtcbiAgYm9yZGVyLXdpZHRoOiAxcHg7XG4gIGJvcmRlci1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3JMVH07XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG4gIHBhZGRpbmc6IDQ4cHggOHB4IDA7XG5cbiAgLmZpbGUtdXBsb2FkLW9yIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5saW5rQnRuQ29sb3J9O1xuICAgIHBhZGRpbmctcmlnaHQ6IDRweDtcbiAgfVxuXG4gICR7bWVkaWEucG9ydGFibGVgXG4gICAgcGFkZGluZzogMTZweCA0cHggMDtcbiAgYH07XG5gO1xuXG5jb25zdCBNc2dXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubW9kYWxUaXRsZUNvbG9yfTtcbiAgZm9udC1zaXplOiAyMHB4O1xuICBoZWlnaHQ6IDM2cHg7XG5gO1xuXG5jb25zdCBTdHlsZWREcmFnTkRyb3BJY29uID0gc3R5bGVkLmRpdmBcbiAgY29sb3I6ICR7ZmlsZUljb25Db2xvcn07XG4gIG1hcmdpbi1ib3R0b206IDQ4cHg7XG5cbiAgJHttZWRpYS5wb3J0YWJsZWBcbiAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuICBgfTtcbiAgJHttZWRpYS5wYWxtYFxuICAgIG1hcmdpbi1ib3R0b206IDhweDtcbiAgYH07XG5gO1xuXG5jb25zdCBTdHlsZWRGaWxlVHlwZUZvdyA9IHN0eWxlZC5kaXZgXG4gIG1hcmdpbi1ib3R0b206IDI0cHg7XG4gICR7bWVkaWEucG9ydGFibGVgXG4gICAgbWFyZ2luLWJvdHRvbTogMTZweDtcbiAgYH07XG4gICR7bWVkaWEucGFsbWBcbiAgICBtYXJnaW4tYm90dG9tOiA4cHg7XG4gIGB9O1xuYDtcblxuY29uc3QgU3R5bGVkRmlsZVVwbG9hZCA9IHN0eWxlZC5kaXZgXG4gIC5maWxlLWRyb3Age1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkTWVzc2FnZSA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBtYXJnaW4tYm90dG9tOiAzMnB4O1xuXG4gIC5sb2FkaW5nLWFjdGlvbiB7XG4gICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuICB9XG4gIC5sb2FkaW5nLXNwaW5uZXIge1xuICAgIG1hcmdpbi1sZWZ0OiAxMHB4O1xuICB9XG5gO1xuXG5jb25zdCBTdHlsZWREcmFnRmlsZVdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBtYXJnaW4tYm90dG9tOiAzMnB4O1xuICAke21lZGlhLnBvcnRhYmxlYFxuICAgIG1hcmdpbi1ib3R0b206IDI0cHg7XG4gIGB9O1xuICAke21lZGlhLnBvcnRhYmxlYFxuICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XG4gIGB9XG5gO1xuXG5jb25zdCBTdHlsZWREaXNjbGFpbWVyID0gc3R5bGVkKFN0eWxlZE1lc3NhZ2UpYFxuICBtYXJnaW46IDAgYXV0bztcbmA7XG5cbmZ1bmN0aW9uIEZpbGVVcGxvYWRGYWN0b3J5KCkge1xuICBjbGFzcyBGaWxlVXBsb2FkIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgb25GaWxlVXBsb2FkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgdmFsaWRGaWxlRXh0OiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc3RyaW5nKSxcbiAgICAgIGZpbGVMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbFxuICAgIH07XG5cbiAgICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgICAgdmFsaWRGaWxlRXh0OiBkZWZhdWx0VmFsaWRGaWxlRXh0XG4gICAgfTtcblxuICAgIHN0YXRlID0ge1xuICAgICAgZHJhZ092ZXI6IGZhbHNlLFxuICAgICAgZmlsZUxvYWRpbmc6IGZhbHNlLFxuICAgICAgZmlsZXM6IFtdLFxuICAgICAgZXJyb3JGaWxlczogW11cbiAgICB9O1xuXG4gICAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhwcm9wcywgc3RhdGUpIHtcbiAgICAgIGlmIChzdGF0ZS5maWxlTG9hZGluZyAmJiBwcm9wcy5maWxlTG9hZGluZyA9PT0gZmFsc2UgJiYgc3RhdGUuZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZmlsZXM6IFtdLFxuICAgICAgICAgIGZpbGVMb2FkaW5nOiBwcm9wcy5maWxlTG9hZGluZ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZmlsZUxvYWRpbmc6IHByb3BzLmZpbGVMb2FkaW5nXG4gICAgICB9O1xuICAgIH1cblxuICAgIGZyYW1lID0gY3JlYXRlUmVmKCk7XG5cbiAgICBfaXNWYWxpZEZpbGVUeXBlID0gZmlsZW5hbWUgPT4ge1xuICAgICAgY29uc3Qge3ZhbGlkRmlsZUV4dH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3QgZmlsZUV4dCA9IHZhbGlkRmlsZUV4dC5maW5kKGV4dCA9PiBmaWxlbmFtZS5lbmRzV2l0aChleHQpKTtcblxuICAgICAgcmV0dXJuIEJvb2xlYW4oZmlsZUV4dCk7XG4gICAgfTtcblxuICAgIF9oYW5kbGVGaWxlSW5wdXQgPSAoZmlsZXMsIGUpID0+IHtcbiAgICAgIGlmIChlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IHtmaWxlczogW10sIGVycm9yRmlsZXM6IFtdLCBkcmFnT3ZlcjogZmFsc2V9O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBmaWxlID0gZmlsZXNbaV07XG5cbiAgICAgICAgaWYgKGZpbGUgJiYgdGhpcy5faXNWYWxpZEZpbGVUeXBlKGZpbGUubmFtZSkpIHtcbiAgICAgICAgICBuZXh0U3RhdGUuZmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXh0U3RhdGUuZXJyb3JGaWxlcy5wdXNoKGZpbGUubmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZShuZXh0U3RhdGUsICgpID0+XG4gICAgICAgIG5leHRTdGF0ZS5maWxlcy5sZW5ndGggPyB0aGlzLnByb3BzLm9uRmlsZVVwbG9hZChuZXh0U3RhdGUuZmlsZXMpIDogbnVsbFxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgX3RvZ2dsZURyYWdTdGF0ZSA9IG5ld1N0YXRlID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdPdmVyOiBuZXdTdGF0ZX0pO1xuICAgIH07XG5cbiAgICBfcmVuZGVyTWVzc2FnZSgpIHtcbiAgICAgIGNvbnN0IHtlcnJvckZpbGVzLCBmaWxlc30gPSB0aGlzLnN0YXRlO1xuICAgICAgaWYgKGVycm9yRmlsZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPFdhcm5pbmdNc2c+XG4gICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZVxuICAgICAgICAgICAgICBpZD17J2ZpbGVVcGxvYWRlci5maWxlbk5vdFN1cHBvcnRlZCd9XG4gICAgICAgICAgICAgIHZhbHVlcz17e2Vycm9yRmlsZXM6IGVycm9yRmlsZXMuam9pbignLCAnKX19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvV2FybmluZ01zZz5cbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5maWxlTG9hZGluZyAmJiBmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8U3R5bGVkTWVzc2FnZSBjbGFzc05hbWU9XCJmaWxlLXVwbG9hZGVyX19tZXNzYWdlXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxvYWRpbmctYWN0aW9uXCI+XG4gICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnZmlsZVVwbG9hZGVyLnVwbG9hZGluZyd9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIHtmaWxlcy5tYXAoKGYsIGkpID0+IChcbiAgICAgICAgICAgICAgICA8UG9zaXRpdmVNc2cga2V5PXtpfT57Zi5uYW1lfTwvUG9zaXRpdmVNc2c+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAuLi5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsb2FkaW5nLXNwaW5uZXJcIj5cbiAgICAgICAgICAgICAgPExvYWRpbmdTcGlubmVyIHNpemU9ezIwfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9TdHlsZWRNZXNzYWdlPlxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7ZHJhZ092ZXIsIGZpbGVzfSA9IHRoaXMuc3RhdGU7XG4gICAgICBjb25zdCB7dmFsaWRGaWxlRXh0LCBpbnRsfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdHlsZWRGaWxlVXBsb2FkIGNsYXNzTmFtZT1cImZpbGUtdXBsb2FkZXJcIiByZWY9e3RoaXMuZnJhbWV9PlxuICAgICAgICAgIHtGaWxlRHJvcCA/IChcbiAgICAgICAgICAgIDxGaWxlRHJvcFxuICAgICAgICAgICAgICBmcmFtZT17dGhpcy5mcmFtZS5jdXJyZW50IHx8IGRvY3VtZW50fVxuICAgICAgICAgICAgICBvbkRyYWdPdmVyPXsoKSA9PiB0aGlzLl90b2dnbGVEcmFnU3RhdGUodHJ1ZSl9XG4gICAgICAgICAgICAgIG9uRHJhZ0xlYXZlPXsoKSA9PiB0aGlzLl90b2dnbGVEcmFnU3RhdGUoZmFsc2UpfVxuICAgICAgICAgICAgICBvbkRyb3A9e3RoaXMuX2hhbmRsZUZpbGVJbnB1dH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmlsZS11cGxvYWRlcl9fZmlsZS1kcm9wXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFN0eWxlZFVwbG9hZE1lc3NhZ2UgY2xhc3NOYW1lPVwiZmlsZS11cGxvYWRfX21lc3NhZ2VcIj5cbiAgICAgICAgICAgICAgICA8UmVhY3RNYXJrZG93blxuICAgICAgICAgICAgICAgICAgc291cmNlPXtgJHtpbnRsLmZvcm1hdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBpZDogJ2ZpbGVVcGxvYWRlci5jb25maWdVcGxvYWRNZXNzYWdlJ1xuICAgICAgICAgICAgICAgICAgfSl9KCR7R1VJREVTX0ZJTEVfRk9STUFUX0RPQ30pLmB9XG4gICAgICAgICAgICAgICAgICByZW5kZXJlcnM9e3tsaW5rOiBMaW5rUmVuZGVyZXJ9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvU3R5bGVkVXBsb2FkTWVzc2FnZT5cbiAgICAgICAgICAgICAgPFN0eWxlZEZpbGVEcm9wIGRyYWdPdmVyPXtkcmFnT3Zlcn0+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e29wYWNpdHk6IGRyYWdPdmVyID8gMC41IDogMX19PlxuICAgICAgICAgICAgICAgICAgPFN0eWxlZERyYWdORHJvcEljb24+XG4gICAgICAgICAgICAgICAgICAgIDxTdHlsZWRGaWxlVHlwZUZvdyBjbGFzc05hbWU9XCJmaWxlLXR5cGUtcm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAge3ZhbGlkRmlsZUV4dC5tYXAoZXh0ID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxGaWxlVHlwZSBrZXk9e2V4dH0gZXh0PXtleHR9IGhlaWdodD1cIjUwcHhcIiBmb250U2l6ZT1cIjlweFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvU3R5bGVkRmlsZVR5cGVGb3c+XG4gICAgICAgICAgICAgICAgICAgIDxEcmFnTkRyb3AgaGVpZ2h0PVwiNDRweFwiIC8+XG4gICAgICAgICAgICAgICAgICA8L1N0eWxlZERyYWdORHJvcEljb24+XG4gICAgICAgICAgICAgICAgICA8ZGl2Pnt0aGlzLl9yZW5kZXJNZXNzYWdlKCl9PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgeyFmaWxlcy5sZW5ndGggPyAoXG4gICAgICAgICAgICAgICAgICA8U3R5bGVkRHJhZ0ZpbGVXcmFwcGVyPlxuICAgICAgICAgICAgICAgICAgICA8TXNnV3JhcHBlcj5cbiAgICAgICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J2ZpbGVVcGxvYWRlci5tZXNzYWdlJ30gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9Nc2dXcmFwcGVyPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmaWxlLXVwbG9hZC1vclwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnZmlsZVVwbG9hZGVyLm9yJ30gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8VXBsb2FkQnV0dG9uIG9uVXBsb2FkPXt0aGlzLl9oYW5kbGVGaWxlSW5wdXR9PlxuICAgICAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnZmlsZVVwbG9hZGVyLmJyb3dzZUZpbGVzJ30gLz5cbiAgICAgICAgICAgICAgICAgICAgPC9VcGxvYWRCdXR0b24+XG4gICAgICAgICAgICAgICAgICA8L1N0eWxlZERyYWdGaWxlV3JhcHBlcj5cbiAgICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAgICA8U3R5bGVkRGlzY2xhaW1lcj5cbiAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnZmlsZVVwbG9hZGVyLmRpc2NsYWltZXInfSAvPlxuICAgICAgICAgICAgICAgIDwvU3R5bGVkRGlzY2xhaW1lcj5cbiAgICAgICAgICAgICAgPC9TdHlsZWRGaWxlRHJvcD5cbiAgICAgICAgICAgIDwvRmlsZURyb3A+XG4gICAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgICA8V2FybmluZ01zZz5cbiAgICAgICAgICAgIHtpc0Nocm9tZSgpID8gPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydmaWxlVXBsb2FkZXIuY2hyb21lTWVzc2FnZSd9IC8+IDogJyd9XG4gICAgICAgICAgPC9XYXJuaW5nTXNnPlxuICAgICAgICA8L1N0eWxlZEZpbGVVcGxvYWQ+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbmplY3RJbnRsKEZpbGVVcGxvYWQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBGaWxlVXBsb2FkRmFjdG9yeTtcbmV4cG9ydCBjb25zdCBGaWxlVXBsb2FkID0gRmlsZVVwbG9hZEZhY3RvcnkoKTtcbiJdfQ==