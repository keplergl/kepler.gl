'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _templateObject = (0, _taggedTemplateLiteralLoose3.default)(['\n  margin-top: 10px;\n  color: ', ';\n'], ['\n  margin-top: 10px;\n  color: ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n'], ['\n  color: ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteralLoose3.default)(['\n  background-color: white;\n  border-radius: 4px;\n  border-style: dashed;\n  border-width: 1px;\n  border-color: ', ';\n  height: 414px;\n  padding-top: 60px;\n  text-align: center;\n  width: 100%;\n\n  .file-upload-or {\n    color: ', ';\n    padding-right: 4px;\n  }\n'], ['\n  background-color: white;\n  border-radius: 4px;\n  border-style: dashed;\n  border-width: 1px;\n  border-color: ', ';\n  height: 414px;\n  padding-top: 60px;\n  text-align: center;\n  width: 100%;\n\n  .file-upload-or {\n    color: ', ';\n    padding-right: 4px;\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  font-size: 20px;\n  height: 36px;\n'], ['\n  color: ', ';\n  font-size: 20px;\n  height: 36px;\n']),
    _templateObject5 = (0, _taggedTemplateLiteralLoose3.default)(['\n  color: ', ';\n  margin-bottom: 60px;\n\n  .file-type-row {\n    margin-bottom: 26px;\n  }\n'], ['\n  color: ', ';\n  margin-bottom: 60px;\n\n  .file-type-row {\n    margin-bottom: 26px;\n  }\n']),
    _templateObject6 = (0, _taggedTemplateLiteralLoose3.default)(['\n  background-color: ', ';\n  border-radius: 1px;\n  color: white;\n  display: inline-block;\n  font-size: 10px;\n  padding: 1px 4px;\n  position: absolute;\n  top: 18px;\n'], ['\n  background-color: ', ';\n  border-radius: 1px;\n  color: white;\n  display: inline-block;\n  font-size: 10px;\n  padding: 1px 4px;\n  position: absolute;\n  top: 18px;\n']),
    _templateObject7 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: inline-block;\n  position: relative;\n  padding: 0 4px;\n'], ['\n  display: inline-block;\n  position: relative;\n  padding: 0 4px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _uploadButton = require('./upload-button');

var _uploadButton2 = _interopRequireDefault(_uploadButton);

var _icons = require('../icons');

var _utils = require('../../../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FileDrop = typeof document !== 'undefined' ? require('react-file-drop') : null;
var propTypes = {
  onFileUpload: _propTypes2.default.func.isRequired,
  validFileExt: _propTypes2.default.array
};

// File.type is not reliable if the OS does not have a
// registered mapping for the extension.
// NOTE: Shapefiles must be in a compressed format since
// it requires multiple files to be present.
var defaultValidFileExt = ['csv',
// 'tar.gz',
// 'tgz',
// 'zip',
// 'gpx',
'kml', 'json', 'geojson'];

var defaultProps = {
  validFileExt: defaultValidFileExt
};

var MESSAGE = ' Drag & Drop Your File(s) Here';
var CHROME_MSG = '*Chrome user: Limit file size to 250mb, if need to upload larger file, try Safari';
var fileIconColor = '#D3D8E0';

var WarningMsg = _styledComponents2.default.span(_templateObject, function (props) {
  return props.theme.errorColor;
});

var PositiveMsg = _styledComponents2.default.span(_templateObject2, function (props) {
  return props.theme.primaryBtnActBgd;
});

var FileDropWrapper = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.subtextColorLT;
}, function (props) {
  return props.theme.linkBtnColor;
});

var MsgWrapper = _styledComponents2.default.div(_templateObject4, function (props) {
  return props.theme.modalTitleColor;
});

var DragNDropIconWrapper = _styledComponents2.default.div(_templateObject5, fileIconColor);

var FileUpload = function (_Component) {
  (0, _inherits3.default)(FileUpload, _Component);

  function FileUpload() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, FileUpload);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
      dragOver: false,
      files: null,
      errorFiles: []
    }, _this._isValidFileType = function (filename) {
      var validFileExt = _this.props.validFileExt;

      var fileExt = validFileExt.find(function (ext) {
        return filename.endsWith(ext);
      });

      return Boolean(fileExt);
    }, _this._handleFileDrop = function (files, e) {
      e.stopPropagation();

      var nextState = { files: [], errorFiles: [], dragOver: false };
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
    }, _this._toggleDragState = function (newState) {
      _this.setState({ dragOver: newState });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  FileUpload.prototype._renderMessage = function _renderMessage() {
    var errorFiles = this.state.errorFiles;


    if (errorFiles.length) {
      return _react2.default.createElement(
        WarningMsg,
        null,
        'File ' + errorFiles.join(', ') + ' is not supported.'
      );
    }

    if (!this.state.files) {
      return null;
    }

    return _react2.default.createElement(
      'span',
      null,
      'Uploading...',
      _react2.default.createElement(
        PositiveMsg,
        null,
        this.state.files.map(function (f) {
          return f.name;
        }).join(' and ') + '...'
      )
    );
  };

  FileUpload.prototype.render = function render() {
    var _this2 = this;

    var dragOver = this.state.dragOver;
    var validFileExt = this.props.validFileExt;

    return _react2.default.createElement(
      'div',
      { className: 'file-uploader', ref: 'frame' },
      _react2.default.createElement('input', {
        type: 'file',
        ref: 'fileInput',
        className: 'hidden',
        onChange: this._onChange
      }),
      FileDrop ? _react2.default.createElement(
        FileDrop,
        {
          frame: this.refs.frame,
          targetAlwaysVisible: true,
          onDragOver: function onDragOver() {
            return _this2._toggleDragState(true);
          },
          onDragLeave: function onDragLeave() {
            return _this2._toggleDragState(false);
          },
          onDrop: this._handleFileDrop
        },
        _react2.default.createElement(
          FileDropWrapper,
          { dragOver: dragOver },
          _react2.default.createElement(
            'div',
            { style: { opacity: dragOver ? 0.5 : 1 } },
            _react2.default.createElement(
              DragNDropIconWrapper,
              null,
              _react2.default.createElement(
                'div',
                { className: 'file-type-row' },
                validFileExt.map(function (ext) {
                  return _react2.default.createElement(FileTypeIcon, { key: ext, ext: ext });
                })
              ),
              _react2.default.createElement(_icons.DragNDrop, { height: '44px' })
            ),
            _react2.default.createElement(
              'div',
              null,
              this._renderMessage()
            )
          ),
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              MsgWrapper,
              null,
              MESSAGE
            ),
            _react2.default.createElement(
              'span',
              { className: 'file-upload-or' },
              'or'
            ),
            _react2.default.createElement(
              _uploadButton2.default,
              { onUpload: this._handleFileDrop },
              'browse your files'
            )
          )
        )
      ) : null,
      _react2.default.createElement(
        WarningMsg,
        null,
        (0, _utils.isChrome)() ? CHROME_MSG : ''
      )
    );
  };

  return FileUpload;
}(_react.Component);

var FileNameTag = _styledComponents2.default.div(_templateObject6, function (props) {
  return props.theme.subtextColorLT;
});

var FileTypeIconWrapper = _styledComponents2.default.div(_templateObject7);

var FileTypeIcon = function FileTypeIcon(_ref) {
  var ext = _ref.ext;
  return _react2.default.createElement(
    FileTypeIconWrapper,
    null,
    _react2.default.createElement(
      FileNameTag,
      null,
      ext
    ),
    _react2.default.createElement(_icons.File, { height: '50px' })
  );
};

FileUpload.propTypes = propTypes;
FileUpload.defaultProps = defaultProps;

exports.default = FileUpload;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWxlLXVwbG9hZGVyL2ZpbGUtdXBsb2FkLmpzIl0sIm5hbWVzIjpbIkZpbGVEcm9wIiwiZG9jdW1lbnQiLCJyZXF1aXJlIiwicHJvcFR5cGVzIiwib25GaWxlVXBsb2FkIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJ2YWxpZEZpbGVFeHQiLCJhcnJheSIsImRlZmF1bHRWYWxpZEZpbGVFeHQiLCJkZWZhdWx0UHJvcHMiLCJNRVNTQUdFIiwiQ0hST01FX01TRyIsImZpbGVJY29uQ29sb3IiLCJXYXJuaW5nTXNnIiwic3BhbiIsInByb3BzIiwidGhlbWUiLCJlcnJvckNvbG9yIiwiUG9zaXRpdmVNc2ciLCJwcmltYXJ5QnRuQWN0QmdkIiwiRmlsZURyb3BXcmFwcGVyIiwiZGl2Iiwic3VidGV4dENvbG9yTFQiLCJsaW5rQnRuQ29sb3IiLCJNc2dXcmFwcGVyIiwibW9kYWxUaXRsZUNvbG9yIiwiRHJhZ05Ecm9wSWNvbldyYXBwZXIiLCJGaWxlVXBsb2FkIiwic3RhdGUiLCJkcmFnT3ZlciIsImZpbGVzIiwiZXJyb3JGaWxlcyIsIl9pc1ZhbGlkRmlsZVR5cGUiLCJmaWxlRXh0IiwiZmluZCIsImZpbGVuYW1lIiwiZW5kc1dpdGgiLCJleHQiLCJCb29sZWFuIiwiX2hhbmRsZUZpbGVEcm9wIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIm5leHRTdGF0ZSIsImkiLCJsZW5ndGgiLCJmaWxlIiwibmFtZSIsInB1c2giLCJzZXRTdGF0ZSIsIl90b2dnbGVEcmFnU3RhdGUiLCJuZXdTdGF0ZSIsIl9yZW5kZXJNZXNzYWdlIiwiam9pbiIsIm1hcCIsImYiLCJyZW5kZXIiLCJfb25DaGFuZ2UiLCJyZWZzIiwiZnJhbWUiLCJvcGFjaXR5IiwiRmlsZU5hbWVUYWciLCJGaWxlVHlwZUljb25XcmFwcGVyIiwiRmlsZVR5cGVJY29uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFB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QVd6QixTQUFYLEdBQXVCQSxTQUF2QjtBQUNBeUIsV0FBV2xCLFlBQVgsR0FBMEJBLFlBQTFCOztrQkFFZWtCLFUiLCJmaWxlIjoiZmlsZS11cGxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuaW1wb3J0IFVwbG9hZEJ1dHRvbiBmcm9tICcuL3VwbG9hZC1idXR0b24nO1xuaW1wb3J0IHtGaWxlLCBEcmFnTkRyb3B9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCB7aXNDaHJvbWV9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuY29uc3QgRmlsZURyb3AgPVxuICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnID8gcmVxdWlyZSgncmVhY3QtZmlsZS1kcm9wJykgOiBudWxsO1xuY29uc3QgcHJvcFR5cGVzID0ge1xuICBvbkZpbGVVcGxvYWQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHZhbGlkRmlsZUV4dDogUHJvcFR5cGVzLmFycmF5XG59O1xuXG4vLyBGaWxlLnR5cGUgaXMgbm90IHJlbGlhYmxlIGlmIHRoZSBPUyBkb2VzIG5vdCBoYXZlIGFcbi8vIHJlZ2lzdGVyZWQgbWFwcGluZyBmb3IgdGhlIGV4dGVuc2lvbi5cbi8vIE5PVEU6IFNoYXBlZmlsZXMgbXVzdCBiZSBpbiBhIGNvbXByZXNzZWQgZm9ybWF0IHNpbmNlXG4vLyBpdCByZXF1aXJlcyBtdWx0aXBsZSBmaWxlcyB0byBiZSBwcmVzZW50LlxuY29uc3QgZGVmYXVsdFZhbGlkRmlsZUV4dCA9IFtcbiAgJ2NzdicsXG4gIC8vICd0YXIuZ3onLFxuICAvLyAndGd6JyxcbiAgLy8gJ3ppcCcsXG4gIC8vICdncHgnLFxuICAna21sJyxcbiAgJ2pzb24nLFxuICAnZ2VvanNvbidcbl07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgdmFsaWRGaWxlRXh0OiBkZWZhdWx0VmFsaWRGaWxlRXh0XG59O1xuXG5jb25zdCBNRVNTQUdFID0gJyBEcmFnICYgRHJvcCBZb3VyIEZpbGUocykgSGVyZSc7XG5jb25zdCBDSFJPTUVfTVNHID1cbiAgJypDaHJvbWUgdXNlcjogTGltaXQgZmlsZSBzaXplIHRvIDI1MG1iLCBpZiBuZWVkIHRvIHVwbG9hZCBsYXJnZXIgZmlsZSwgdHJ5IFNhZmFyaSc7XG5jb25zdCBmaWxlSWNvbkNvbG9yID0gJyNEM0Q4RTAnO1xuXG5jb25zdCBXYXJuaW5nTXNnID0gc3R5bGVkLnNwYW5gXG4gIG1hcmdpbi10b3A6IDEwcHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmVycm9yQ29sb3J9O1xuYDtcblxuY29uc3QgUG9zaXRpdmVNc2cgPSBzdHlsZWQuc3BhbmBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucHJpbWFyeUJ0bkFjdEJnZH07XG5gO1xuXG5jb25zdCBGaWxlRHJvcFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBib3JkZXItc3R5bGU6IGRhc2hlZDtcbiAgYm9yZGVyLXdpZHRoOiAxcHg7XG4gIGJvcmRlci1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3JMVH07XG4gIGhlaWdodDogNDE0cHg7XG4gIHBhZGRpbmctdG9wOiA2MHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHdpZHRoOiAxMDAlO1xuXG4gIC5maWxlLXVwbG9hZC1vciB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGlua0J0bkNvbG9yfTtcbiAgICBwYWRkaW5nLXJpZ2h0OiA0cHg7XG4gIH1cbmA7XG5cbmNvbnN0IE1zZ1dyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tb2RhbFRpdGxlQ29sb3J9O1xuICBmb250LXNpemU6IDIwcHg7XG4gIGhlaWdodDogMzZweDtcbmA7XG5cbmNvbnN0IERyYWdORHJvcEljb25XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgY29sb3I6ICR7ZmlsZUljb25Db2xvcn07XG4gIG1hcmdpbi1ib3R0b206IDYwcHg7XG5cbiAgLmZpbGUtdHlwZS1yb3cge1xuICAgIG1hcmdpbi1ib3R0b206IDI2cHg7XG4gIH1cbmA7XG5cbmNsYXNzIEZpbGVVcGxvYWQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0ZSA9IHtcbiAgICBkcmFnT3ZlcjogZmFsc2UsXG4gICAgZmlsZXM6IG51bGwsXG4gICAgZXJyb3JGaWxlczogW11cbiAgfTtcblxuICBfaXNWYWxpZEZpbGVUeXBlID0gZmlsZW5hbWUgPT4ge1xuICAgIGNvbnN0IHt2YWxpZEZpbGVFeHR9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBmaWxlRXh0ID0gdmFsaWRGaWxlRXh0LmZpbmQoZXh0ID0+IGZpbGVuYW1lLmVuZHNXaXRoKGV4dCkpO1xuXG4gICAgcmV0dXJuIEJvb2xlYW4oZmlsZUV4dCk7XG4gIH07XG5cbiAgX2hhbmRsZUZpbGVEcm9wID0gKGZpbGVzLCBlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIGNvbnN0IG5leHRTdGF0ZSA9IHtmaWxlczogW10sIGVycm9yRmlsZXM6IFtdLCBkcmFnT3ZlcjogZmFsc2V9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGZpbGUgPSBmaWxlc1tpXTtcblxuICAgICAgaWYgKGZpbGUgJiYgdGhpcy5faXNWYWxpZEZpbGVUeXBlKGZpbGUubmFtZSkpIHtcbiAgICAgICAgbmV4dFN0YXRlLmZpbGVzLnB1c2goZmlsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0U3RhdGUuZXJyb3JGaWxlcy5wdXNoKGZpbGUubmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgIG5leHRTdGF0ZSxcbiAgICAgICgpID0+XG4gICAgICAgIG5leHRTdGF0ZS5maWxlcy5sZW5ndGggPyB0aGlzLnByb3BzLm9uRmlsZVVwbG9hZChuZXh0U3RhdGUuZmlsZXMpIDogbnVsbFxuICAgICk7XG4gIH07XG5cbiAgX3RvZ2dsZURyYWdTdGF0ZSA9IG5ld1N0YXRlID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtkcmFnT3ZlcjogbmV3U3RhdGV9KTtcbiAgfTtcblxuICBfcmVuZGVyTWVzc2FnZSgpIHtcbiAgICBjb25zdCB7ZXJyb3JGaWxlc30gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKGVycm9yRmlsZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8V2FybmluZ01zZz5cbiAgICAgICAgICB7YEZpbGUgJHtlcnJvckZpbGVzLmpvaW4oJywgJyl9IGlzIG5vdCBzdXBwb3J0ZWQuYH1cbiAgICAgICAgPC9XYXJuaW5nTXNnPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGUuZmlsZXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8c3Bhbj5cbiAgICAgICAgVXBsb2FkaW5nLi4uPFBvc2l0aXZlTXNnPlxuICAgICAgICAgIHtgJHt0aGlzLnN0YXRlLmZpbGVzLm1hcChmID0+IGYubmFtZSkuam9pbignIGFuZCAnKX0uLi5gfVxuICAgICAgICA8L1Bvc2l0aXZlTXNnPlxuICAgICAgPC9zcGFuPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2RyYWdPdmVyfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qge3ZhbGlkRmlsZUV4dH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbGUtdXBsb2FkZXJcIiByZWY9XCJmcmFtZVwiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgcmVmPVwiZmlsZUlucHV0XCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJoaWRkZW5cIlxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLl9vbkNoYW5nZX1cbiAgICAgICAgLz5cbiAgICAgICAge0ZpbGVEcm9wID8gKFxuICAgICAgICAgIDxGaWxlRHJvcFxuICAgICAgICAgICAgZnJhbWU9e3RoaXMucmVmcy5mcmFtZX1cbiAgICAgICAgICAgIHRhcmdldEFsd2F5c1Zpc2libGU9e3RydWV9XG4gICAgICAgICAgICBvbkRyYWdPdmVyPXsoKSA9PiB0aGlzLl90b2dnbGVEcmFnU3RhdGUodHJ1ZSl9XG4gICAgICAgICAgICBvbkRyYWdMZWF2ZT17KCkgPT4gdGhpcy5fdG9nZ2xlRHJhZ1N0YXRlKGZhbHNlKX1cbiAgICAgICAgICAgIG9uRHJvcD17dGhpcy5faGFuZGxlRmlsZURyb3B9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEZpbGVEcm9wV3JhcHBlciBkcmFnT3Zlcj17ZHJhZ092ZXJ9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7b3BhY2l0eTogZHJhZ092ZXIgPyAwLjUgOiAxfX0+XG4gICAgICAgICAgICAgICAgPERyYWdORHJvcEljb25XcmFwcGVyPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWxlLXR5cGUtcm93XCI+XG4gICAgICAgICAgICAgICAgICAgIHt2YWxpZEZpbGVFeHQubWFwKGV4dCA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgPEZpbGVUeXBlSWNvbiBrZXk9e2V4dH0gZXh0PXtleHR9IC8+XG4gICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8RHJhZ05Ecm9wIGhlaWdodD1cIjQ0cHhcIiAvPlxuICAgICAgICAgICAgICAgIDwvRHJhZ05Ecm9wSWNvbldyYXBwZXI+XG4gICAgICAgICAgICAgICAgPGRpdj57dGhpcy5fcmVuZGVyTWVzc2FnZSgpfTwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8TXNnV3JhcHBlcj57TUVTU0FHRX08L01zZ1dyYXBwZXI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmlsZS11cGxvYWQtb3JcIj5vcjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8VXBsb2FkQnV0dG9uIG9uVXBsb2FkPXt0aGlzLl9oYW5kbGVGaWxlRHJvcH0+XG4gICAgICAgICAgICAgICAgICBicm93c2UgeW91ciBmaWxlc1xuICAgICAgICAgICAgICAgIDwvVXBsb2FkQnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvRmlsZURyb3BXcmFwcGVyPlxuICAgICAgICAgIDwvRmlsZURyb3A+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgICA8V2FybmluZ01zZz57aXNDaHJvbWUoKSA/IENIUk9NRV9NU0cgOiAnJ308L1dhcm5pbmdNc2c+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IEZpbGVOYW1lVGFnID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3JMVH07XG4gIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgY29sb3I6IHdoaXRlO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGZvbnQtc2l6ZTogMTBweDtcbiAgcGFkZGluZzogMXB4IDRweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDE4cHg7XG5gO1xuXG5jb25zdCBGaWxlVHlwZUljb25XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHBhZGRpbmc6IDAgNHB4O1xuYDtcblxuY29uc3QgRmlsZVR5cGVJY29uID0gKHtleHR9KSA9PiAoXG4gIDxGaWxlVHlwZUljb25XcmFwcGVyPlxuICAgIDxGaWxlTmFtZVRhZz57ZXh0fTwvRmlsZU5hbWVUYWc+XG4gICAgPEZpbGUgaGVpZ2h0PVwiNTBweFwiIC8+XG4gIDwvRmlsZVR5cGVJY29uV3JhcHBlcj5cbik7XG5cbkZpbGVVcGxvYWQucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuRmlsZVVwbG9hZC5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbmV4cG9ydCBkZWZhdWx0IEZpbGVVcGxvYWQ7XG4iXX0=