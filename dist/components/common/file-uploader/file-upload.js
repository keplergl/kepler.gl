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
    _templateObject7 = (0, _taggedTemplateLiteralLoose3.default)(['\n  display: inline-block;\n  position: relative;\n  padding: 0 4px;\n'], ['\n  display: inline-block;\n  position: relative;\n  padding: 0 4px;\n']); /*global window */


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWxlLXVwbG9hZGVyL2ZpbGUtdXBsb2FkLmpzIl0sIm5hbWVzIjpbIkZpbGVEcm9wIiwiZG9jdW1lbnQiLCJyZXF1aXJlIiwicHJvcFR5cGVzIiwib25GaWxlVXBsb2FkIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJ2YWxpZEZpbGVFeHQiLCJhcnJheSIsImRlZmF1bHRWYWxpZEZpbGVFeHQiLCJkZWZhdWx0UHJvcHMiLCJNRVNTQUdFIiwiQ0hST01FX01TRyIsImZpbGVJY29uQ29sb3IiLCJXYXJuaW5nTXNnIiwic3BhbiIsInByb3BzIiwidGhlbWUiLCJlcnJvckNvbG9yIiwiUG9zaXRpdmVNc2ciLCJwcmltYXJ5QnRuQWN0QmdkIiwiRmlsZURyb3BXcmFwcGVyIiwiZGl2Iiwic3VidGV4dENvbG9yTFQiLCJsaW5rQnRuQ29sb3IiLCJNc2dXcmFwcGVyIiwibW9kYWxUaXRsZUNvbG9yIiwiRHJhZ05Ecm9wSWNvbldyYXBwZXIiLCJGaWxlVXBsb2FkIiwic3RhdGUiLCJkcmFnT3ZlciIsImZpbGVzIiwiZXJyb3JGaWxlcyIsIl9pc1ZhbGlkRmlsZVR5cGUiLCJmaWxlRXh0IiwiZmluZCIsImZpbGVuYW1lIiwiZW5kc1dpdGgiLCJleHQiLCJCb29sZWFuIiwiX2hhbmRsZUZpbGVEcm9wIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIm5leHRTdGF0ZSIsImkiLCJsZW5ndGgiLCJmaWxlIiwibmFtZSIsInB1c2giLCJzZXRTdGF0ZSIsIl90b2dnbGVEcmFnU3RhdGUiLCJuZXdTdGF0ZSIsIl9yZW5kZXJNZXNzYWdlIiwiam9pbiIsIm1hcCIsImYiLCJyZW5kZXIiLCJfb25DaGFuZ2UiLCJyZWZzIiwiZnJhbWUiLCJvcGFjaXR5IiwiRmlsZU5hbWVUYWciLCJGaWxlVHlwZUljb25XcmFwcGVyIiwiRmlsZVR5cGVJY29uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBOQUFB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T0FWLFdBQVd6QixTQUFYLEdBQXVCQSxTQUF2QjtBQUNBeUIsV0FBV2xCLFlBQVgsR0FBMEJBLFlBQTFCOztrQkFFZWtCLFUiLCJmaWxlIjoiZmlsZS11cGxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKmdsb2JhbCB3aW5kb3cgKi9cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQgVXBsb2FkQnV0dG9uIGZyb20gJy4vdXBsb2FkLWJ1dHRvbic7XG5pbXBvcnQge0ZpbGUsIERyYWdORHJvcH0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IHtpc0Nocm9tZX0gZnJvbSAndXRpbHMvdXRpbHMnO1xuXG5jb25zdCBGaWxlRHJvcCA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyByZXF1aXJlKCdyZWFjdC1maWxlLWRyb3AnKSA6IG51bGw7XG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIG9uRmlsZVVwbG9hZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgdmFsaWRGaWxlRXh0OiBQcm9wVHlwZXMuYXJyYXlcbn07XG5cbi8vIEZpbGUudHlwZSBpcyBub3QgcmVsaWFibGUgaWYgdGhlIE9TIGRvZXMgbm90IGhhdmUgYVxuLy8gcmVnaXN0ZXJlZCBtYXBwaW5nIGZvciB0aGUgZXh0ZW5zaW9uLlxuLy8gTk9URTogU2hhcGVmaWxlcyBtdXN0IGJlIGluIGEgY29tcHJlc3NlZCBmb3JtYXQgc2luY2Vcbi8vIGl0IHJlcXVpcmVzIG11bHRpcGxlIGZpbGVzIHRvIGJlIHByZXNlbnQuXG5jb25zdCBkZWZhdWx0VmFsaWRGaWxlRXh0ID0gW1xuICAnY3N2JyxcbiAgLy8gJ3Rhci5neicsXG4gIC8vICd0Z3onLFxuICAvLyAnemlwJyxcbiAgLy8gJ2dweCcsXG4gICdrbWwnLFxuICAnanNvbicsXG4gICdnZW9qc29uJ1xuXTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICB2YWxpZEZpbGVFeHQ6IGRlZmF1bHRWYWxpZEZpbGVFeHRcbn07XG5cbmNvbnN0IE1FU1NBR0UgPSAnIERyYWcgJiBEcm9wIFlvdXIgRmlsZShzKSBIZXJlJztcbmNvbnN0IENIUk9NRV9NU0cgPVxuICAnKkNocm9tZSB1c2VyOiBMaW1pdCBmaWxlIHNpemUgdG8gMjUwbWIsIGlmIG5lZWQgdG8gdXBsb2FkIGxhcmdlciBmaWxlLCB0cnkgU2FmYXJpJztcbmNvbnN0IGZpbGVJY29uQ29sb3IgPSAnI0QzRDhFMCc7XG5cbmNvbnN0IFdhcm5pbmdNc2cgPSBzdHlsZWQuc3BhbmBcbiAgbWFyZ2luLXRvcDogMTBweDtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZXJyb3JDb2xvcn07XG5gO1xuXG5jb25zdCBQb3NpdGl2ZU1zZyA9IHN0eWxlZC5zcGFuYFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wcmltYXJ5QnRuQWN0QmdkfTtcbmA7XG5cbmNvbnN0IEZpbGVEcm9wV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIGJvcmRlci1zdHlsZTogZGFzaGVkO1xuICBib3JkZXItd2lkdGg6IDFweDtcbiAgYm9yZGVyLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvckxUfTtcbiAgaGVpZ2h0OiA0MTRweDtcbiAgcGFkZGluZy10b3A6IDYwcHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG5cbiAgLmZpbGUtdXBsb2FkLW9yIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5saW5rQnRuQ29sb3J9O1xuICAgIHBhZGRpbmctcmlnaHQ6IDRweDtcbiAgfVxuYDtcblxuY29uc3QgTXNnV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1vZGFsVGl0bGVDb2xvcn07XG4gIGZvbnQtc2l6ZTogMjBweDtcbiAgaGVpZ2h0OiAzNnB4O1xuYDtcblxuY29uc3QgRHJhZ05Ecm9wSWNvbldyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBjb2xvcjogJHtmaWxlSWNvbkNvbG9yfTtcbiAgbWFyZ2luLWJvdHRvbTogNjBweDtcblxuICAuZmlsZS10eXBlLXJvdyB7XG4gICAgbWFyZ2luLWJvdHRvbTogMjZweDtcbiAgfVxuYDtcblxuY2xhc3MgRmlsZVVwbG9hZCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRlID0ge1xuICAgIGRyYWdPdmVyOiBmYWxzZSxcbiAgICBmaWxlczogbnVsbCxcbiAgICBlcnJvckZpbGVzOiBbXVxuICB9O1xuXG4gIF9pc1ZhbGlkRmlsZVR5cGUgPSBmaWxlbmFtZSA9PiB7XG4gICAgY29uc3Qge3ZhbGlkRmlsZUV4dH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGZpbGVFeHQgPSB2YWxpZEZpbGVFeHQuZmluZChleHQgPT4gZmlsZW5hbWUuZW5kc1dpdGgoZXh0KSk7XG5cbiAgICByZXR1cm4gQm9vbGVhbihmaWxlRXh0KTtcbiAgfTtcblxuICBfaGFuZGxlRmlsZURyb3AgPSAoZmlsZXMsIGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgY29uc3QgbmV4dFN0YXRlID0ge2ZpbGVzOiBbXSwgZXJyb3JGaWxlczogW10sIGRyYWdPdmVyOiBmYWxzZX07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZmlsZSA9IGZpbGVzW2ldO1xuXG4gICAgICBpZiAoZmlsZSAmJiB0aGlzLl9pc1ZhbGlkRmlsZVR5cGUoZmlsZS5uYW1lKSkge1xuICAgICAgICBuZXh0U3RhdGUuZmlsZXMucHVzaChmaWxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHRTdGF0ZS5lcnJvckZpbGVzLnB1c2goZmlsZS5uYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgbmV4dFN0YXRlLFxuICAgICAgKCkgPT5cbiAgICAgICAgbmV4dFN0YXRlLmZpbGVzLmxlbmd0aCA/IHRoaXMucHJvcHMub25GaWxlVXBsb2FkKG5leHRTdGF0ZS5maWxlcykgOiBudWxsXG4gICAgKTtcbiAgfTtcblxuICBfdG9nZ2xlRHJhZ1N0YXRlID0gbmV3U3RhdGUgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdPdmVyOiBuZXdTdGF0ZX0pO1xuICB9O1xuXG4gIF9yZW5kZXJNZXNzYWdlKCkge1xuICAgIGNvbnN0IHtlcnJvckZpbGVzfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAoZXJyb3JGaWxlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxXYXJuaW5nTXNnPlxuICAgICAgICAgIHtgRmlsZSAke2Vycm9yRmlsZXMuam9pbignLCAnKX0gaXMgbm90IHN1cHBvcnRlZC5gfVxuICAgICAgICA8L1dhcm5pbmdNc2c+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZS5maWxlcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuPlxuICAgICAgICBVcGxvYWRpbmcuLi48UG9zaXRpdmVNc2c+XG4gICAgICAgICAge2Ake3RoaXMuc3RhdGUuZmlsZXMubWFwKGYgPT4gZi5uYW1lKS5qb2luKCcgYW5kICcpfS4uLmB9XG4gICAgICAgIDwvUG9zaXRpdmVNc2c+XG4gICAgICA8L3NwYW4+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7ZHJhZ092ZXJ9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7dmFsaWRGaWxlRXh0fSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsZS11cGxvYWRlclwiIHJlZj1cImZyYW1lXCI+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICByZWY9XCJmaWxlSW5wdXRcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImhpZGRlblwiXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX29uQ2hhbmdlfVxuICAgICAgICAvPlxuICAgICAgICB7RmlsZURyb3AgPyAoXG4gICAgICAgICAgPEZpbGVEcm9wXG4gICAgICAgICAgICBmcmFtZT17dGhpcy5yZWZzLmZyYW1lfVxuICAgICAgICAgICAgdGFyZ2V0QWx3YXlzVmlzaWJsZT17dHJ1ZX1cbiAgICAgICAgICAgIG9uRHJhZ092ZXI9eygpID0+IHRoaXMuX3RvZ2dsZURyYWdTdGF0ZSh0cnVlKX1cbiAgICAgICAgICAgIG9uRHJhZ0xlYXZlPXsoKSA9PiB0aGlzLl90b2dnbGVEcmFnU3RhdGUoZmFsc2UpfVxuICAgICAgICAgICAgb25Ecm9wPXt0aGlzLl9oYW5kbGVGaWxlRHJvcH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8RmlsZURyb3BXcmFwcGVyIGRyYWdPdmVyPXtkcmFnT3Zlcn0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tvcGFjaXR5OiBkcmFnT3ZlciA/IDAuNSA6IDF9fT5cbiAgICAgICAgICAgICAgICA8RHJhZ05Ecm9wSWNvbldyYXBwZXI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbGUtdHlwZS1yb3dcIj5cbiAgICAgICAgICAgICAgICAgICAge3ZhbGlkRmlsZUV4dC5tYXAoZXh0ID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8RmlsZVR5cGVJY29uIGtleT17ZXh0fSBleHQ9e2V4dH0gLz5cbiAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxEcmFnTkRyb3AgaGVpZ2h0PVwiNDRweFwiLz5cbiAgICAgICAgICAgICAgICA8L0RyYWdORHJvcEljb25XcmFwcGVyPlxuICAgICAgICAgICAgICAgIDxkaXY+e3RoaXMuX3JlbmRlck1lc3NhZ2UoKX08L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPE1zZ1dyYXBwZXI+e01FU1NBR0V9PC9Nc2dXcmFwcGVyPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZpbGUtdXBsb2FkLW9yXCI+b3I8L3NwYW4+XG4gICAgICAgICAgICAgICAgPFVwbG9hZEJ1dHRvbiBvblVwbG9hZD17dGhpcy5faGFuZGxlRmlsZURyb3B9PlxuICAgICAgICAgICAgICAgICAgYnJvd3NlIHlvdXIgZmlsZXNcbiAgICAgICAgICAgICAgICA8L1VwbG9hZEJ1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L0ZpbGVEcm9wV3JhcHBlcj5cbiAgICAgICAgICA8L0ZpbGVEcm9wPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPFdhcm5pbmdNc2c+e2lzQ2hyb21lKCkgPyBDSFJPTUVfTVNHIDogJyd9PC9XYXJuaW5nTXNnPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBGaWxlTmFtZVRhZyA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc3VidGV4dENvbG9yTFR9O1xuICBib3JkZXItcmFkaXVzOiAxcHg7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBmb250LXNpemU6IDEwcHg7XG4gIHBhZGRpbmc6IDFweCA0cHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAxOHB4O1xuYDtcblxuY29uc3QgRmlsZVR5cGVJY29uV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBwYWRkaW5nOiAwIDRweDtcbmA7XG5cbmNvbnN0IEZpbGVUeXBlSWNvbiA9ICh7ZXh0fSkgPT4gKFxuICA8RmlsZVR5cGVJY29uV3JhcHBlcj5cbiAgICA8RmlsZU5hbWVUYWc+e2V4dH08L0ZpbGVOYW1lVGFnPlxuICAgIDxGaWxlIGhlaWdodD1cIjUwcHhcIiAvPlxuICA8L0ZpbGVUeXBlSWNvbldyYXBwZXI+XG4pO1xuXG5GaWxlVXBsb2FkLnByb3BUeXBlcyA9IHByb3BUeXBlcztcbkZpbGVVcGxvYWQuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuXG5leHBvcnQgZGVmYXVsdCBGaWxlVXBsb2FkO1xuIl19