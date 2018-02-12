'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  margin-top: 10px;\n  color: ', ';\n'], ['\n  margin-top: 10px;\n  color: ', ';\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  color: ', ';\n'], ['\n  color: ', ';\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  background-color: white;\n  border-radius: 4px;\n  border-style: dashed;\n  border-width: 1px;\n  border-color: ', ';\n  height: 414px;\n  padding-top: 60px;\n  text-align: center;\n  width: 100%;\n\n  .file-upload-or {\n    color: ', ';\n    padding-right: 4px;\n  }\n'], ['\n  background-color: white;\n  border-radius: 4px;\n  border-style: dashed;\n  border-width: 1px;\n  border-color: ', ';\n  height: 414px;\n  padding-top: 60px;\n  text-align: center;\n  width: 100%;\n\n  .file-upload-or {\n    color: ', ';\n    padding-right: 4px;\n  }\n']),
    _templateObject4 = (0, _taggedTemplateLiteral3.default)(['\n  color: ', ';\n  font-size: 20px;\n  height: 36px;\n'], ['\n  color: ', ';\n  font-size: 20px;\n  height: 36px;\n']),
    _templateObject5 = (0, _taggedTemplateLiteral3.default)(['\n  color: ', ';\n  margin-bottom: 60px;\n\n  .file-type-row {\n    margin-bottom: 26px;\n  }\n'], ['\n  color: ', ';\n  margin-bottom: 60px;\n\n  .file-type-row {\n    margin-bottom: 26px;\n  }\n']),
    _templateObject6 = (0, _taggedTemplateLiteral3.default)(['\n  .filter-upload__input {\n    visibility: hidden;\n  }\n'], ['\n  .filter-upload__input {\n    visibility: hidden;\n  }\n']),
    _templateObject7 = (0, _taggedTemplateLiteral3.default)(['\n  background-color: ', ';\n  border-radius: 1px;\n  color: white;\n  display: inline-block;\n  font-size: 10px;\n  padding: 1px 4px;\n  position: absolute;\n  top: 18px;\n'], ['\n  background-color: ', ';\n  border-radius: 1px;\n  color: white;\n  display: inline-block;\n  font-size: 10px;\n  padding: 1px 4px;\n  position: absolute;\n  top: 18px;\n']),
    _templateObject8 = (0, _taggedTemplateLiteral3.default)(['\n  display: inline-block;\n  position: relative;\n  padding: 0 4px;\n'], ['\n  display: inline-block;\n  position: relative;\n  padding: 0 4px;\n']);

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

var StyledFileDrop = _styledComponents2.default.div(_templateObject3, function (props) {
  return props.theme.subtextColorLT;
}, function (props) {
  return props.theme.linkBtnColor;
});

var MsgWrapper = _styledComponents2.default.div(_templateObject4, function (props) {
  return props.theme.modalTitleColor;
});

var StyledDragNDropIcon = _styledComponents2.default.div(_templateObject5, fileIconColor);

var StyledFileUpload = _styledComponents2.default.div(_templateObject6);

var FileUpload = function (_Component) {
  (0, _inherits3.default)(FileUpload, _Component);

  function FileUpload() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, FileUpload);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = FileUpload.__proto__ || Object.getPrototypeOf(FileUpload)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
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

  (0, _createClass3.default)(FileUpload, [{
    key: '_renderMessage',
    value: function _renderMessage() {
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
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var dragOver = this.state.dragOver;
      var validFileExt = this.props.validFileExt;

      return _react2.default.createElement(
        StyledFileUpload,
        {
          className: 'file-uploader',
          innerRef: function innerRef(cmp) {
            return _this2.frame = cmp;
          }
        },
        _react2.default.createElement('input', {
          className: 'filter-upload__input',
          type: 'file',
          ref: 'fileInput',
          onChange: this._onChange
        }),
        FileDrop ? _react2.default.createElement(
          FileDrop,
          {
            frame: this.frame,
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
            StyledFileDrop,
            { dragOver: dragOver },
            _react2.default.createElement(
              'div',
              { style: { opacity: dragOver ? 0.5 : 1 } },
              _react2.default.createElement(
                StyledDragNDropIcon,
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
    }
  }]);
  return FileUpload;
}(_react.Component);

var FileNameTag = _styledComponents2.default.div(_templateObject7, function (props) {
  return props.theme.subtextColorLT;
});

var FileTypeIconWrapper = _styledComponents2.default.div(_templateObject8);

var FileTypeIcon = function FileTypeIcon(_ref2) {
  var ext = _ref2.ext;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWxlLXVwbG9hZGVyL2ZpbGUtdXBsb2FkLmpzIl0sIm5hbWVzIjpbIkZpbGVEcm9wIiwiZG9jdW1lbnQiLCJyZXF1aXJlIiwicHJvcFR5cGVzIiwib25GaWxlVXBsb2FkIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJ2YWxpZEZpbGVFeHQiLCJhcnJheSIsImRlZmF1bHRWYWxpZEZpbGVFeHQiLCJkZWZhdWx0UHJvcHMiLCJNRVNTQUdFIiwiQ0hST01FX01TRyIsImZpbGVJY29uQ29sb3IiLCJXYXJuaW5nTXNnIiwic3BhbiIsInByb3BzIiwidGhlbWUiLCJlcnJvckNvbG9yIiwiUG9zaXRpdmVNc2ciLCJwcmltYXJ5QnRuQWN0QmdkIiwiU3R5bGVkRmlsZURyb3AiLCJkaXYiLCJzdWJ0ZXh0Q29sb3JMVCIsImxpbmtCdG5Db2xvciIsIk1zZ1dyYXBwZXIiLCJtb2RhbFRpdGxlQ29sb3IiLCJTdHlsZWREcmFnTkRyb3BJY29uIiwiU3R5bGVkRmlsZVVwbG9hZCIsIkZpbGVVcGxvYWQiLCJzdGF0ZSIsImRyYWdPdmVyIiwiZmlsZXMiLCJlcnJvckZpbGVzIiwiX2lzVmFsaWRGaWxlVHlwZSIsImZpbGVFeHQiLCJmaW5kIiwiZmlsZW5hbWUiLCJlbmRzV2l0aCIsImV4dCIsIkJvb2xlYW4iLCJfaGFuZGxlRmlsZURyb3AiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwibmV4dFN0YXRlIiwiaSIsImxlbmd0aCIsImZpbGUiLCJuYW1lIiwicHVzaCIsInNldFN0YXRlIiwiX3RvZ2dsZURyYWdTdGF0ZSIsIm5ld1N0YXRlIiwiam9pbiIsIm1hcCIsImYiLCJmcmFtZSIsImNtcCIsIl9vbkNoYW5nZSIsIm9wYWNpdHkiLCJfcmVuZGVyTWVzc2FnZSIsIkZpbGVOYW1lVGFnIiwiRmlsZVR5cGVJY29uV3JhcHBlciIsIkZpbGVUeXBlSWNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QTtBQUFjQTtBQUFkLEtBREY7QUFFRSxpREFBTSxRQUFPLE1BQWI7QUFGRixHQURtQjtBQUFBLENBQXJCOztBQU9BVixXQUFXMUIsU0FBWCxHQUF1QkEsU0FBdkI7QUFDQTBCLFdBQVduQixZQUFYLEdBQTBCQSxZQUExQjs7a0JBRWVtQixVIiwiZmlsZSI6ImZpbGUtdXBsb2FkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5cbmltcG9ydCBVcGxvYWRCdXR0b24gZnJvbSAnLi91cGxvYWQtYnV0dG9uJztcbmltcG9ydCB7RmlsZSwgRHJhZ05Ecm9wfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQge2lzQ2hyb21lfSBmcm9tICd1dGlscy91dGlscyc7XG5cbmNvbnN0IEZpbGVEcm9wID1cbiAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyA/IHJlcXVpcmUoJ3JlYWN0LWZpbGUtZHJvcCcpIDogbnVsbDtcbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgb25GaWxlVXBsb2FkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB2YWxpZEZpbGVFeHQ6IFByb3BUeXBlcy5hcnJheVxufTtcblxuLy8gRmlsZS50eXBlIGlzIG5vdCByZWxpYWJsZSBpZiB0aGUgT1MgZG9lcyBub3QgaGF2ZSBhXG4vLyByZWdpc3RlcmVkIG1hcHBpbmcgZm9yIHRoZSBleHRlbnNpb24uXG4vLyBOT1RFOiBTaGFwZWZpbGVzIG11c3QgYmUgaW4gYSBjb21wcmVzc2VkIGZvcm1hdCBzaW5jZVxuLy8gaXQgcmVxdWlyZXMgbXVsdGlwbGUgZmlsZXMgdG8gYmUgcHJlc2VudC5cbmNvbnN0IGRlZmF1bHRWYWxpZEZpbGVFeHQgPSBbXG4gICdjc3YnLFxuICAvLyAndGFyLmd6JyxcbiAgLy8gJ3RneicsXG4gIC8vICd6aXAnLFxuICAvLyAnZ3B4JyxcbiAgJ2ttbCcsXG4gICdqc29uJyxcbiAgJ2dlb2pzb24nXG5dO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIHZhbGlkRmlsZUV4dDogZGVmYXVsdFZhbGlkRmlsZUV4dFxufTtcblxuY29uc3QgTUVTU0FHRSA9ICcgRHJhZyAmIERyb3AgWW91ciBGaWxlKHMpIEhlcmUnO1xuY29uc3QgQ0hST01FX01TRyA9XG4gICcqQ2hyb21lIHVzZXI6IExpbWl0IGZpbGUgc2l6ZSB0byAyNTBtYiwgaWYgbmVlZCB0byB1cGxvYWQgbGFyZ2VyIGZpbGUsIHRyeSBTYWZhcmknO1xuY29uc3QgZmlsZUljb25Db2xvciA9ICcjRDNEOEUwJztcblxuY29uc3QgV2FybmluZ01zZyA9IHN0eWxlZC5zcGFuYFxuICBtYXJnaW4tdG9wOiAxMHB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5lcnJvckNvbG9yfTtcbmA7XG5cbmNvbnN0IFBvc2l0aXZlTXNnID0gc3R5bGVkLnNwYW5gXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnByaW1hcnlCdG5BY3RCZ2R9O1xuYDtcblxuY29uc3QgU3R5bGVkRmlsZURyb3AgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBib3JkZXItc3R5bGU6IGRhc2hlZDtcbiAgYm9yZGVyLXdpZHRoOiAxcHg7XG4gIGJvcmRlci1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3JMVH07XG4gIGhlaWdodDogNDE0cHg7XG4gIHBhZGRpbmctdG9wOiA2MHB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHdpZHRoOiAxMDAlO1xuXG4gIC5maWxlLXVwbG9hZC1vciB7XG4gICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubGlua0J0bkNvbG9yfTtcbiAgICBwYWRkaW5nLXJpZ2h0OiA0cHg7XG4gIH1cbmA7XG5cbmNvbnN0IE1zZ1dyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tb2RhbFRpdGxlQ29sb3J9O1xuICBmb250LXNpemU6IDIwcHg7XG4gIGhlaWdodDogMzZweDtcbmA7XG5cbmNvbnN0IFN0eWxlZERyYWdORHJvcEljb24gPSBzdHlsZWQuZGl2YFxuICBjb2xvcjogJHtmaWxlSWNvbkNvbG9yfTtcbiAgbWFyZ2luLWJvdHRvbTogNjBweDtcblxuICAuZmlsZS10eXBlLXJvdyB7XG4gICAgbWFyZ2luLWJvdHRvbTogMjZweDtcbiAgfVxuYDtcblxuY29uc3QgU3R5bGVkRmlsZVVwbG9hZCA9IHN0eWxlZC5kaXZgXG4gIC5maWx0ZXItdXBsb2FkX19pbnB1dCB7XG4gICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICB9XG5gO1xuXG5jbGFzcyBGaWxlVXBsb2FkIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGUgPSB7XG4gICAgZHJhZ092ZXI6IGZhbHNlLFxuICAgIGZpbGVzOiBudWxsLFxuICAgIGVycm9yRmlsZXM6IFtdXG4gIH07XG5cbiAgX2lzVmFsaWRGaWxlVHlwZSA9IGZpbGVuYW1lID0+IHtcbiAgICBjb25zdCB7dmFsaWRGaWxlRXh0fSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZmlsZUV4dCA9IHZhbGlkRmlsZUV4dC5maW5kKGV4dCA9PiBmaWxlbmFtZS5lbmRzV2l0aChleHQpKTtcblxuICAgIHJldHVybiBCb29sZWFuKGZpbGVFeHQpO1xuICB9O1xuXG4gIF9oYW5kbGVGaWxlRHJvcCA9IChmaWxlcywgZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICBjb25zdCBuZXh0U3RhdGUgPSB7ZmlsZXM6IFtdLCBlcnJvckZpbGVzOiBbXSwgZHJhZ092ZXI6IGZhbHNlfTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBmaWxlID0gZmlsZXNbaV07XG5cbiAgICAgIGlmIChmaWxlICYmIHRoaXMuX2lzVmFsaWRGaWxlVHlwZShmaWxlLm5hbWUpKSB7XG4gICAgICAgIG5leHRTdGF0ZS5maWxlcy5wdXNoKGZpbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dFN0YXRlLmVycm9yRmlsZXMucHVzaChmaWxlLm5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoXG4gICAgICBuZXh0U3RhdGUsXG4gICAgICAoKSA9PlxuICAgICAgICBuZXh0U3RhdGUuZmlsZXMubGVuZ3RoID8gdGhpcy5wcm9wcy5vbkZpbGVVcGxvYWQobmV4dFN0YXRlLmZpbGVzKSA6IG51bGxcbiAgICApO1xuICB9O1xuXG4gIF90b2dnbGVEcmFnU3RhdGUgPSBuZXdTdGF0ZSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZ092ZXI6IG5ld1N0YXRlfSk7XG4gIH07XG5cbiAgX3JlbmRlck1lc3NhZ2UoKSB7XG4gICAgY29uc3Qge2Vycm9yRmlsZXN9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChlcnJvckZpbGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFdhcm5pbmdNc2c+XG4gICAgICAgICAge2BGaWxlICR7ZXJyb3JGaWxlcy5qb2luKCcsICcpfSBpcyBub3Qgc3VwcG9ydGVkLmB9XG4gICAgICAgIDwvV2FybmluZ01zZz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLmZpbGVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4+XG4gICAgICAgIFVwbG9hZGluZy4uLjxQb3NpdGl2ZU1zZz5cbiAgICAgICAgICB7YCR7dGhpcy5zdGF0ZS5maWxlcy5tYXAoZiA9PiBmLm5hbWUpLmpvaW4oJyBhbmQgJyl9Li4uYH1cbiAgICAgICAgPC9Qb3NpdGl2ZU1zZz5cbiAgICAgIDwvc3Bhbj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtkcmFnT3Zlcn0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHt2YWxpZEZpbGVFeHR9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZEZpbGVVcGxvYWRcbiAgICAgICAgY2xhc3NOYW1lPVwiZmlsZS11cGxvYWRlclwiXG4gICAgICAgIGlubmVyUmVmPXtjbXAgPT4gKHRoaXMuZnJhbWUgPSBjbXApfVxuICAgICAgPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBjbGFzc05hbWU9XCJmaWx0ZXItdXBsb2FkX19pbnB1dFwiXG4gICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgIHJlZj1cImZpbGVJbnB1dFwiXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX29uQ2hhbmdlfVxuICAgICAgICAvPlxuICAgICAgICB7RmlsZURyb3AgPyAoXG4gICAgICAgICAgPEZpbGVEcm9wXG4gICAgICAgICAgICBmcmFtZT17dGhpcy5mcmFtZX1cbiAgICAgICAgICAgIHRhcmdldEFsd2F5c1Zpc2libGU9e3RydWV9XG4gICAgICAgICAgICBvbkRyYWdPdmVyPXsoKSA9PiB0aGlzLl90b2dnbGVEcmFnU3RhdGUodHJ1ZSl9XG4gICAgICAgICAgICBvbkRyYWdMZWF2ZT17KCkgPT4gdGhpcy5fdG9nZ2xlRHJhZ1N0YXRlKGZhbHNlKX1cbiAgICAgICAgICAgIG9uRHJvcD17dGhpcy5faGFuZGxlRmlsZURyb3B9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFN0eWxlZEZpbGVEcm9wIGRyYWdPdmVyPXtkcmFnT3Zlcn0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tvcGFjaXR5OiBkcmFnT3ZlciA/IDAuNSA6IDF9fT5cbiAgICAgICAgICAgICAgICA8U3R5bGVkRHJhZ05Ecm9wSWNvbj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsZS10eXBlLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICB7dmFsaWRGaWxlRXh0Lm1hcChleHQgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgIDxGaWxlVHlwZUljb24ga2V5PXtleHR9IGV4dD17ZXh0fSAvPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPERyYWdORHJvcCBoZWlnaHQ9XCI0NHB4XCIgLz5cbiAgICAgICAgICAgICAgICA8L1N0eWxlZERyYWdORHJvcEljb24+XG4gICAgICAgICAgICAgICAgPGRpdj57dGhpcy5fcmVuZGVyTWVzc2FnZSgpfTwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8TXNnV3JhcHBlcj57TUVTU0FHRX08L01zZ1dyYXBwZXI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmlsZS11cGxvYWQtb3JcIj5vcjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8VXBsb2FkQnV0dG9uIG9uVXBsb2FkPXt0aGlzLl9oYW5kbGVGaWxlRHJvcH0+XG4gICAgICAgICAgICAgICAgICBicm93c2UgeW91ciBmaWxlc1xuICAgICAgICAgICAgICAgIDwvVXBsb2FkQnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvU3R5bGVkRmlsZURyb3A+XG4gICAgICAgICAgPC9GaWxlRHJvcD5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDxXYXJuaW5nTXNnPntpc0Nocm9tZSgpID8gQ0hST01FX01TRyA6ICcnfTwvV2FybmluZ01zZz5cbiAgICAgIDwvU3R5bGVkRmlsZVVwbG9hZD5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IEZpbGVOYW1lVGFnID0gc3R5bGVkLmRpdmBcbiAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zdWJ0ZXh0Q29sb3JMVH07XG4gIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgY29sb3I6IHdoaXRlO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGZvbnQtc2l6ZTogMTBweDtcbiAgcGFkZGluZzogMXB4IDRweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDE4cHg7XG5gO1xuXG5jb25zdCBGaWxlVHlwZUljb25XcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHBhZGRpbmc6IDAgNHB4O1xuYDtcblxuY29uc3QgRmlsZVR5cGVJY29uID0gKHtleHR9KSA9PiAoXG4gIDxGaWxlVHlwZUljb25XcmFwcGVyPlxuICAgIDxGaWxlTmFtZVRhZz57ZXh0fTwvRmlsZU5hbWVUYWc+XG4gICAgPEZpbGUgaGVpZ2h0PVwiNTBweFwiIC8+XG4gIDwvRmlsZVR5cGVJY29uV3JhcHBlcj5cbik7XG5cbkZpbGVVcGxvYWQucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuRmlsZVVwbG9hZC5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbmV4cG9ydCBkZWZhdWx0IEZpbGVVcGxvYWQ7XG4iXX0=