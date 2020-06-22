"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ModalFooter = exports.ModalTitle = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactIntl = require("react-intl");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactModal = _interopRequireDefault(require("react-modal"));

var _icons = require("./icons");

var _styledComponents2 = require("./styled-components");

var _mediaBreakpoints = require("../../styles/media-breakpoints");

function _templateObject13() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    padding-left: 0;\n    padding-right: 0;\n  "]);

  _templateObject13 = function _templateObject13() {
    return data;
  };

  return data;
}

function _templateObject12() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    padding-left: 24px;\n    padding-right: 24px;\n  "]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  top: 0;\n  left: 0;\n  transition: ", ";\n  padding-left: 40px;\n  padding-right: 40px;\n\n  ", ";\n\n  ", ";\n\n  :focus {\n    outline: 0;\n  }\n"]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject10() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: flex-end;\n"]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  display: flex;\n  justify-content: flex-end;\n  z-index: ", ";\n  position: absolute;\n  top: 24px;\n  right: 24px;\n\n  :hover {\n    cursor: pointer;\n  }\n"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    padding-top: 16px;\n  "]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    padding-top: 24px;\n  "]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  width: 100%;\n  left: 0;\n  bottom: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  padding-top: 24px;\n  ", ";\n\n  ", ";\n  z-index: ", ";\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: ", ";\n  color: ", ";\n  margin-bottom: 10px;\n  position: relative;\n  z-index: ", ";\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: relative;\n  z-index: ", ";\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    max-width: 100vw;\n  "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    padding: 12px 36px 24px;\n    max-width: 80vw;\n  "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  overflow-y: auto;\n  max-width: 70vw;\n  max-height: 85vh;\n  padding: 24px 72px 40px;\n  position: relative;\n  top: 92px;\n  left: 0;\n  right: 0;\n  margin: 0 auto;\n  background-color: #ffffff;\n  border-radius: 4px;\n  transition: ", ";\n  box-sizing: border-box;\n  font-size: 12px;\n  color: ", ";\n\n  ", "\n\n  ", "\n\n  ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var ModalContentWrapper = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.transition;
}, function (props) {
  return props.theme.labelColorLT;
}, _mediaBreakpoints.media.portable(_templateObject2()), _mediaBreakpoints.media.palm(_templateObject3()), function (props) {
  return props.cssStyle || '';
});

var ModalContent = _styledComponents["default"].div(_templateObject4(), function (props) {
  return props.theme.modalContentZ;
});

var ModalTitle = _styledComponents["default"].div(_templateObject5(), function (props) {
  return props.theme.modalTitleFontSize;
}, function (props) {
  return props.theme.modalTitleColor;
}, function (props) {
  return props.theme.modalTitleZ;
});

exports.ModalTitle = ModalTitle;

var StyledModalFooter = _styledComponents["default"].div(_templateObject6(), _mediaBreakpoints.media.portable(_templateObject7()), _mediaBreakpoints.media.palm(_templateObject8()), function (props) {
  return props.theme.modalFooterZ;
});

var CloseButton = _styledComponents["default"].div(_templateObject9(), function (props) {
  return props.theme.titleColorLT;
}, function (props) {
  return props.theme.modalButtonZ;
});

var FooterActionWrapper = _styledComponents["default"].div(_templateObject10());

var defaultCancelButton = {
  link: true,
  large: true,
  children: 'modal.button.defaultCancel'
};
var defaultConfirmButton = {
  large: true,
  width: '160px',
  children: 'modal.button.defaultConfirm'
};

var ModalFooter = function ModalFooter(_ref) {
  var cancel = _ref.cancel,
      confirm = _ref.confirm,
      cancelButton = _ref.cancelButton,
      confirmButton = _ref.confirmButton;

  var cancelButtonProps = _objectSpread({}, defaultCancelButton, {}, cancelButton);

  var confirmButtonProps = _objectSpread({}, defaultConfirmButton, {}, confirmButton);

  return _react["default"].createElement(StyledModalFooter, {
    className: "modal--footer"
  }, _react["default"].createElement(FooterActionWrapper, null, _react["default"].createElement(_styledComponents2.Button, (0, _extends2["default"])({
    className: "modal--footer--cancel-button"
  }, cancelButtonProps, {
    onClick: cancel
  }), _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: cancelButtonProps.children
  })), _react["default"].createElement(_styledComponents2.Button, (0, _extends2["default"])({
    className: "modal--footer--confirm-button"
  }, confirmButtonProps, {
    onClick: confirm
  }), _react["default"].createElement(_reactIntl.FormattedMessage, {
    id: confirmButtonProps.children
  }))));
};

exports.ModalFooter = ModalFooter;

var ModalDialog =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ModalDialog, _Component);

  function ModalDialog() {
    (0, _classCallCheck2["default"])(this, ModalDialog);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ModalDialog).apply(this, arguments));
  }

  (0, _createClass2["default"])(ModalDialog, [{
    key: "render",
    value: function render() {
      var props = this.props;
      return _react["default"].createElement(_reactModal["default"], (0, _extends2["default"])({
        className: this.props.className
      }, props, {
        ariaHideApp: false,
        style: {
          overlay: _objectSpread({
            backgroundColor: props.theme && props.theme.modalOverlayBgd || 'rgba(0, 0, 0, 0.5)',
            zIndex: props.theme && props.theme.modalOverLayZ || 1000
          }, props.style)
        }
      }), _react["default"].createElement(ModalContentWrapper, {
        className: "modal--wrapper",
        cssStyle: props.cssStyle,
        footer: props.footer
      }, props.close && _react["default"].createElement(CloseButton, {
        className: "modal--close",
        onClick: props.onCancel
      }, _react["default"].createElement(_icons.Delete, {
        height: "14px"
      })), _react["default"].createElement("div", null, props.title && _react["default"].createElement(ModalTitle, {
        className: "modal--title"
      }, _react["default"].createElement(_reactIntl.FormattedMessage, {
        id: props.title
      })), _react["default"].createElement(ModalContent, {
        className: "modal--body"
      }, props.children), props.footer && _react["default"].createElement(ModalFooter, {
        cancel: props.onCancel,
        confirm: props.onConfirm,
        cancelButton: props.cancelButton,
        confirmButton: props.confirmButton
      }))));
    }
  }]);
  return ModalDialog;
}(_react.Component);

(0, _defineProperty2["default"])(ModalDialog, "propTypes", {
  footer: _propTypes["default"].bool,
  close: _propTypes["default"].bool,
  onConfirm: _propTypes["default"].func,
  onCancel: _propTypes["default"].func,
  confirmButton: _propTypes["default"].object,
  confirmButtonLabel: _propTypes["default"].string,
  cancelButton: _propTypes["default"].object,
  cancelButtonLabel: _propTypes["default"].string,
  cssStyle: _propTypes["default"].arrayOf(_propTypes["default"].any)
});
(0, _defineProperty2["default"])(ModalDialog, "defaultProps", {
  footer: false,
  close: true,
  onConfirm: function onConfirm() {},
  onCancel: function onCancel() {},
  cancelButton: defaultCancelButton,
  confirmButton: defaultConfirmButton,
  cssStyle: []
});
var StyledModal = (0, _styledComponents["default"])(ModalDialog)(_templateObject11(), function (props) {
  return props.theme.transition;
}, _mediaBreakpoints.media.portable(_templateObject12()), _mediaBreakpoints.media.palm(_templateObject13()));
var _default = StyledModal;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9tb2RhbC5qcyJdLCJuYW1lcyI6WyJNb2RhbENvbnRlbnRXcmFwcGVyIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInRyYW5zaXRpb24iLCJsYWJlbENvbG9yTFQiLCJtZWRpYSIsInBvcnRhYmxlIiwicGFsbSIsImNzc1N0eWxlIiwiTW9kYWxDb250ZW50IiwibW9kYWxDb250ZW50WiIsIk1vZGFsVGl0bGUiLCJtb2RhbFRpdGxlRm9udFNpemUiLCJtb2RhbFRpdGxlQ29sb3IiLCJtb2RhbFRpdGxlWiIsIlN0eWxlZE1vZGFsRm9vdGVyIiwibW9kYWxGb290ZXJaIiwiQ2xvc2VCdXR0b24iLCJ0aXRsZUNvbG9yTFQiLCJtb2RhbEJ1dHRvbloiLCJGb290ZXJBY3Rpb25XcmFwcGVyIiwiZGVmYXVsdENhbmNlbEJ1dHRvbiIsImxpbmsiLCJsYXJnZSIsImNoaWxkcmVuIiwiZGVmYXVsdENvbmZpcm1CdXR0b24iLCJ3aWR0aCIsIk1vZGFsRm9vdGVyIiwiY2FuY2VsIiwiY29uZmlybSIsImNhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b24iLCJjYW5jZWxCdXR0b25Qcm9wcyIsImNvbmZpcm1CdXR0b25Qcm9wcyIsIk1vZGFsRGlhbG9nIiwiY2xhc3NOYW1lIiwib3ZlcmxheSIsImJhY2tncm91bmRDb2xvciIsIm1vZGFsT3ZlcmxheUJnZCIsInpJbmRleCIsIm1vZGFsT3ZlckxheVoiLCJzdHlsZSIsImZvb3RlciIsImNsb3NlIiwib25DYW5jZWwiLCJ0aXRsZSIsIm9uQ29uZmlybSIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsImJvb2wiLCJmdW5jIiwib2JqZWN0IiwiY29uZmlybUJ1dHRvbkxhYmVsIiwic3RyaW5nIiwiY2FuY2VsQnV0dG9uTGFiZWwiLCJhcnJheU9mIiwiYW55IiwiU3R5bGVkTW9kYWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9C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VE8sQztpQ0FEZnRCLFcsa0JBYWtCO0FBQ3BCUSxFQUFBQSxNQUFNLEVBQUUsS0FEWTtBQUVwQkMsRUFBQUEsS0FBSyxFQUFFLElBRmE7QUFHcEJHLEVBQUFBLFNBQVMsRUFBRSxxQkFBTSxDQUFFLENBSEM7QUFJcEJGLEVBQUFBLFFBQVEsRUFBRSxvQkFBTSxDQUFFLENBSkU7QUFLcEJkLEVBQUFBLFlBQVksRUFBRVQsbUJBTE07QUFNcEJVLEVBQUFBLGFBQWEsRUFBRU4sb0JBTks7QUFPcEJqQixFQUFBQSxRQUFRLEVBQUU7QUFQVSxDO0FBMER4QixJQUFNaUQsV0FBVyxHQUFHLGtDQUFPdkIsV0FBUCxDQUFILHNCQUdELFVBQUFqQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFVBQWhCO0FBQUEsQ0FISixFQU9iRSx3QkFBTUMsUUFQTyx1QkFZYkQsd0JBQU1FLElBWk8sc0JBQWpCO2VBc0Jla0QsVyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAncmVhY3QtaW50bCc7XG5cbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IE1vZGFsIGZyb20gJ3JlYWN0LW1vZGFsJztcbmltcG9ydCB7RGVsZXRlfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pY29ucyc7XG5pbXBvcnQge0J1dHRvbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHttZWRpYX0gZnJvbSAnc3R5bGVzL21lZGlhLWJyZWFrcG9pbnRzJztcblxuY29uc3QgTW9kYWxDb250ZW50V3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIG92ZXJmbG93LXk6IGF1dG87XG4gIG1heC13aWR0aDogNzB2dztcbiAgbWF4LWhlaWdodDogODV2aDtcbiAgcGFkZGluZzogMjRweCA3MnB4IDQwcHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdG9wOiA5MnB4O1xuICBsZWZ0OiAwO1xuICByaWdodDogMDtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgdHJhbnNpdGlvbjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50cmFuc2l0aW9ufTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5sYWJlbENvbG9yTFR9O1xuXG4gICR7bWVkaWEucG9ydGFibGVgXG4gICAgcGFkZGluZzogMTJweCAzNnB4IDI0cHg7XG4gICAgbWF4LXdpZHRoOiA4MHZ3O1xuICBgfVxuXG4gICR7bWVkaWEucGFsbWBcbiAgICBtYXgtd2lkdGg6IDEwMHZ3O1xuICBgfVxuXG4gICR7cHJvcHMgPT4gcHJvcHMuY3NzU3R5bGUgfHwgJyd9O1xuYDtcblxuY29uc3QgTW9kYWxDb250ZW50ID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1vZGFsQ29udGVudFp9O1xuYDtcblxuZXhwb3J0IGNvbnN0IE1vZGFsVGl0bGUgPSBzdHlsZWQuZGl2YFxuICBmb250LXNpemU6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubW9kYWxUaXRsZUZvbnRTaXplfTtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubW9kYWxUaXRsZUNvbG9yfTtcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1vZGFsVGl0bGVafTtcbmA7XG5cbmNvbnN0IFN0eWxlZE1vZGFsRm9vdGVyID0gc3R5bGVkLmRpdmBcbiAgd2lkdGg6IDEwMCU7XG4gIGxlZnQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgcGFkZGluZy10b3A6IDI0cHg7XG4gICR7bWVkaWEucG9ydGFibGVgXG4gICAgcGFkZGluZy10b3A6IDI0cHg7XG4gIGB9O1xuXG4gICR7bWVkaWEucGFsbWBcbiAgICBwYWRkaW5nLXRvcDogMTZweDtcbiAgYH07XG4gIHotaW5kZXg6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubW9kYWxGb290ZXJafTtcbmA7XG5cbmNvbnN0IENsb3NlQnV0dG9uID0gc3R5bGVkLmRpdmBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGl0bGVDb2xvckxUfTtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgei1pbmRleDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tb2RhbEJ1dHRvblp9O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMjRweDtcbiAgcmlnaHQ6IDI0cHg7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbmA7XG5cbmNvbnN0IEZvb3RlckFjdGlvbldyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuYDtcblxuY29uc3QgZGVmYXVsdENhbmNlbEJ1dHRvbiA9IHtcbiAgbGluazogdHJ1ZSxcbiAgbGFyZ2U6IHRydWUsXG4gIGNoaWxkcmVuOiAnbW9kYWwuYnV0dG9uLmRlZmF1bHRDYW5jZWwnXG59O1xuXG5jb25zdCBkZWZhdWx0Q29uZmlybUJ1dHRvbiA9IHtcbiAgbGFyZ2U6IHRydWUsXG4gIHdpZHRoOiAnMTYwcHgnLFxuICBjaGlsZHJlbjogJ21vZGFsLmJ1dHRvbi5kZWZhdWx0Q29uZmlybSdcbn07XG5cbmV4cG9ydCBjb25zdCBNb2RhbEZvb3RlciA9ICh7Y2FuY2VsLCBjb25maXJtLCBjYW5jZWxCdXR0b24sIGNvbmZpcm1CdXR0b259KSA9PiB7XG4gIGNvbnN0IGNhbmNlbEJ1dHRvblByb3BzID0gey4uLmRlZmF1bHRDYW5jZWxCdXR0b24sIC4uLmNhbmNlbEJ1dHRvbn07XG4gIGNvbnN0IGNvbmZpcm1CdXR0b25Qcm9wcyA9IHsuLi5kZWZhdWx0Q29uZmlybUJ1dHRvbiwgLi4uY29uZmlybUJ1dHRvbn07XG4gIHJldHVybiAoXG4gICAgPFN0eWxlZE1vZGFsRm9vdGVyIGNsYXNzTmFtZT1cIm1vZGFsLS1mb290ZXJcIj5cbiAgICAgIDxGb290ZXJBY3Rpb25XcmFwcGVyPlxuICAgICAgICA8QnV0dG9uIGNsYXNzTmFtZT1cIm1vZGFsLS1mb290ZXItLWNhbmNlbC1idXR0b25cIiB7Li4uY2FuY2VsQnV0dG9uUHJvcHN9IG9uQ2xpY2s9e2NhbmNlbH0+XG4gICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9e2NhbmNlbEJ1dHRvblByb3BzLmNoaWxkcmVufSAvPlxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvbiBjbGFzc05hbWU9XCJtb2RhbC0tZm9vdGVyLS1jb25maXJtLWJ1dHRvblwiIHsuLi5jb25maXJtQnV0dG9uUHJvcHN9IG9uQ2xpY2s9e2NvbmZpcm19PlxuICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXtjb25maXJtQnV0dG9uUHJvcHMuY2hpbGRyZW59IC8+XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Gb290ZXJBY3Rpb25XcmFwcGVyPlxuICAgIDwvU3R5bGVkTW9kYWxGb290ZXI+XG4gICk7XG59O1xuXG5jbGFzcyBNb2RhbERpYWxvZyBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZm9vdGVyOiBQcm9wVHlwZXMuYm9vbCxcbiAgICBjbG9zZTogUHJvcFR5cGVzLmJvb2wsXG4gICAgb25Db25maXJtOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkNhbmNlbDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgY29uZmlybUJ1dHRvbjogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBjb25maXJtQnV0dG9uTGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgY2FuY2VsQnV0dG9uOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGNhbmNlbEJ1dHRvbkxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNzc1N0eWxlOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuYW55KVxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgZm9vdGVyOiBmYWxzZSxcbiAgICBjbG9zZTogdHJ1ZSxcbiAgICBvbkNvbmZpcm06ICgpID0+IHt9LFxuICAgIG9uQ2FuY2VsOiAoKSA9PiB7fSxcbiAgICBjYW5jZWxCdXR0b246IGRlZmF1bHRDYW5jZWxCdXR0b24sXG4gICAgY29uZmlybUJ1dHRvbjogZGVmYXVsdENvbmZpcm1CdXR0b24sXG4gICAgY3NzU3R5bGU6IFtdXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtwcm9wc30gPSB0aGlzO1xuICAgIHJldHVybiAoXG4gICAgICA8TW9kYWxcbiAgICAgICAgY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzTmFtZX1cbiAgICAgICAgey4uLnByb3BzfVxuICAgICAgICBhcmlhSGlkZUFwcD17ZmFsc2V9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgb3ZlcmxheToge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAocHJvcHMudGhlbWUgJiYgcHJvcHMudGhlbWUubW9kYWxPdmVybGF5QmdkKSB8fCAncmdiYSgwLCAwLCAwLCAwLjUpJyxcbiAgICAgICAgICAgIHpJbmRleDogKHByb3BzLnRoZW1lICYmIHByb3BzLnRoZW1lLm1vZGFsT3ZlckxheVopIHx8IDEwMDAsXG4gICAgICAgICAgICAvLyBpbiBjYXNlIHdlIHdhbnQgdG8gb3ZlcnJpZGUgdGhlIG1vZGFsIGRpYWxvZyBzdHlsZVxuICAgICAgICAgICAgLi4ucHJvcHMuc3R5bGVcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxNb2RhbENvbnRlbnRXcmFwcGVyXG4gICAgICAgICAgY2xhc3NOYW1lPVwibW9kYWwtLXdyYXBwZXJcIlxuICAgICAgICAgIGNzc1N0eWxlPXtwcm9wcy5jc3NTdHlsZX1cbiAgICAgICAgICBmb290ZXI9e3Byb3BzLmZvb3Rlcn1cbiAgICAgICAgPlxuICAgICAgICAgIHtwcm9wcy5jbG9zZSAmJiAoXG4gICAgICAgICAgICA8Q2xvc2VCdXR0b24gY2xhc3NOYW1lPVwibW9kYWwtLWNsb3NlXCIgb25DbGljaz17cHJvcHMub25DYW5jZWx9PlxuICAgICAgICAgICAgICA8RGVsZXRlIGhlaWdodD1cIjE0cHhcIiAvPlxuICAgICAgICAgICAgPC9DbG9zZUJ1dHRvbj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICB7cHJvcHMudGl0bGUgJiYgKFxuICAgICAgICAgICAgICA8TW9kYWxUaXRsZSBjbGFzc05hbWU9XCJtb2RhbC0tdGl0bGVcIj5cbiAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17cHJvcHMudGl0bGV9IC8+XG4gICAgICAgICAgICAgIDwvTW9kYWxUaXRsZT5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8TW9kYWxDb250ZW50IGNsYXNzTmFtZT1cIm1vZGFsLS1ib2R5XCI+e3Byb3BzLmNoaWxkcmVufTwvTW9kYWxDb250ZW50PlxuICAgICAgICAgICAge3Byb3BzLmZvb3RlciAmJiAoXG4gICAgICAgICAgICAgIDxNb2RhbEZvb3RlclxuICAgICAgICAgICAgICAgIGNhbmNlbD17cHJvcHMub25DYW5jZWx9XG4gICAgICAgICAgICAgICAgY29uZmlybT17cHJvcHMub25Db25maXJtfVxuICAgICAgICAgICAgICAgIGNhbmNlbEJ1dHRvbj17cHJvcHMuY2FuY2VsQnV0dG9ufVxuICAgICAgICAgICAgICAgIGNvbmZpcm1CdXR0b249e3Byb3BzLmNvbmZpcm1CdXR0b259XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsQ29udGVudFdyYXBwZXI+XG4gICAgICA8L01vZGFsPlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgU3R5bGVkTW9kYWwgPSBzdHlsZWQoTW9kYWxEaWFsb2cpYFxuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHRyYW5zaXRpb246ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudHJhbnNpdGlvbn07XG4gIHBhZGRpbmctbGVmdDogNDBweDtcbiAgcGFkZGluZy1yaWdodDogNDBweDtcblxuICAke21lZGlhLnBvcnRhYmxlYFxuICAgIHBhZGRpbmctbGVmdDogMjRweDtcbiAgICBwYWRkaW5nLXJpZ2h0OiAyNHB4O1xuICBgfTtcblxuICAke21lZGlhLnBhbG1gXG4gICAgcGFkZGluZy1sZWZ0OiAwO1xuICAgIHBhZGRpbmctcmlnaHQ6IDA7XG4gIGB9O1xuXG4gIDpmb2N1cyB7XG4gICAgb3V0bGluZTogMDtcbiAgfVxuYDtcblxuZXhwb3J0IGRlZmF1bHQgU3R5bGVkTW9kYWw7XG4iXX0=