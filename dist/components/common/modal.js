"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ModalFooter = exports.ModalTitle = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _localization = require("../../localization");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactModal = _interopRequireDefault(require("react-modal"));

var _icons = require("./icons");

var _styledComponents2 = require("./styled-components");

var _mediaBreakpoints = require("../../styles/media-breakpoints");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var ModalContentWrapper = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  overflow-y: auto;\n  max-width: 70vw;\n  max-height: 85vh;\n  padding: 24px 72px 40px;\n  position: relative;\n  top: 92px;\n  left: 0;\n  right: 0;\n  margin: 0 auto;\n  background-color: #ffffff;\n  border-radius: 4px;\n  transition: ", ";\n  box-sizing: border-box;\n  font-size: 12px;\n  color: ", ";\n\n  ", "\n\n  ", "\n\n  ", ";\n"])), function (props) {
  return props.theme.transition;
}, function (props) {
  return props.theme.labelColorLT;
}, _mediaBreakpoints.media.portable(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n    padding: 12px 36px 24px;\n    max-width: 80vw;\n  "]))), _mediaBreakpoints.media.palm(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n    max-width: 100vw;\n  "]))), function (props) {
  return props.cssStyle || '';
});

var ModalContent = _styledComponents["default"].div(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  position: relative;\n  z-index: ", ";\n"])), function (props) {
  return props.theme.modalContentZ;
});

var ModalTitle = _styledComponents["default"].div(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n  font-size: ", ";\n  color: ", ";\n  margin-bottom: 10px;\n  position: relative;\n  z-index: ", ";\n"])), function (props) {
  return props.theme.modalTitleFontSize;
}, function (props) {
  return props.theme.modalTitleColor;
}, function (props) {
  return props.theme.modalTitleZ;
});

exports.ModalTitle = ModalTitle;

var StyledModalFooter = _styledComponents["default"].div(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2["default"])(["\n  width: 100%;\n  left: 0;\n  bottom: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  padding-top: 24px;\n  ", ";\n\n  ", ";\n  z-index: ", ";\n"])), _mediaBreakpoints.media.portable(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2["default"])(["\n    padding-top: 24px;\n  "]))), _mediaBreakpoints.media.palm(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2["default"])(["\n    padding-top: 16px;\n  "]))), function (props) {
  return props.theme.modalFooterZ;
});

var CloseButton = _styledComponents["default"].div(_templateObject9 || (_templateObject9 = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  display: flex;\n  justify-content: flex-end;\n  z-index: ", ";\n  position: absolute;\n  top: 24px;\n  right: 24px;\n\n  :hover {\n    cursor: pointer;\n  }\n"])), function (props) {
  return props.theme.titleColorLT;
}, function (props) {
  return props.theme.modalButtonZ;
});

var FooterActionWrapper = _styledComponents["default"].div(_templateObject10 || (_templateObject10 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  justify-content: flex-end;\n"])));

var defaultCancelButton = {
  link: true,
  large: true,
  children: 'modal.button.defaultCancel'
};
var defaultConfirmButton = {
  cta: true,
  large: true,
  width: '160px',
  children: 'modal.button.defaultConfirm'
};

var ModalFooter = function ModalFooter(_ref) {
  var cancel = _ref.cancel,
      confirm = _ref.confirm,
      cancelButton = _ref.cancelButton,
      confirmButton = _ref.confirmButton;

  var cancelButtonProps = _objectSpread(_objectSpread({}, defaultCancelButton), cancelButton);

  var confirmButtonProps = _objectSpread(_objectSpread({}, defaultConfirmButton), confirmButton);

  return /*#__PURE__*/_react["default"].createElement(StyledModalFooter, {
    className: "modal--footer"
  }, /*#__PURE__*/_react["default"].createElement(FooterActionWrapper, null, /*#__PURE__*/_react["default"].createElement(_styledComponents2.Button, (0, _extends2["default"])({
    className: "modal--footer--cancel-button"
  }, cancelButtonProps, {
    onClick: cancel
  }), /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: cancelButtonProps.children
  })), /*#__PURE__*/_react["default"].createElement(_styledComponents2.Button, (0, _extends2["default"])({
    className: "modal--footer--confirm-button"
  }, confirmButtonProps, {
    onClick: confirm
  }), /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
    id: confirmButtonProps.children
  }))));
};

exports.ModalFooter = ModalFooter;

var ModalDialog = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ModalDialog, _Component);

  var _super = _createSuper(ModalDialog);

  function ModalDialog() {
    (0, _classCallCheck2["default"])(this, ModalDialog);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(ModalDialog, [{
    key: "render",
    value: function render() {
      var props = this.props;
      return /*#__PURE__*/_react["default"].createElement(_reactModal["default"], (0, _extends2["default"])({
        className: this.props.className
      }, props, {
        ariaHideApp: false,
        style: {
          overlay: _objectSpread({
            backgroundColor: props.theme && props.theme.modalOverlayBgd || 'rgba(0, 0, 0, 0.5)',
            zIndex: props.theme && props.theme.modalOverLayZ || 1000
          }, props.style)
        }
      }), /*#__PURE__*/_react["default"].createElement(ModalContentWrapper, {
        className: "modal--wrapper",
        cssStyle: props.cssStyle,
        footer: props.footer
      }, props.close && /*#__PURE__*/_react["default"].createElement(CloseButton, {
        className: "modal--close",
        onClick: props.onCancel
      }, /*#__PURE__*/_react["default"].createElement(_icons.Delete, {
        height: "14px"
      })), /*#__PURE__*/_react["default"].createElement("div", null, props.title && /*#__PURE__*/_react["default"].createElement(ModalTitle, {
        className: "modal--title"
      }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
        id: props.title
      })), /*#__PURE__*/_react["default"].createElement(ModalContent, {
        className: "modal--body"
      }, props.children), props.footer && /*#__PURE__*/_react["default"].createElement(ModalFooter, {
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
var StyledModal = (0, _styledComponents["default"])(ModalDialog)(_templateObject11 || (_templateObject11 = (0, _taggedTemplateLiteral2["default"])(["\n  top: 0;\n  left: 0;\n  transition: ", ";\n  padding-left: 40px;\n  padding-right: 40px;\n\n  ", ";\n\n  ", ";\n\n  :focus {\n    outline: 0;\n  }\n"])), function (props) {
  return props.theme.transition;
}, _mediaBreakpoints.media.portable(_templateObject12 || (_templateObject12 = (0, _taggedTemplateLiteral2["default"])(["\n    padding-left: 24px;\n    padding-right: 24px;\n  "]))), _mediaBreakpoints.media.palm(_templateObject13 || (_templateObject13 = (0, _taggedTemplateLiteral2["default"])(["\n    padding-left: 0;\n    padding-right: 0;\n  "]))));
var _default = StyledModal;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9tb2RhbC5qcyJdLCJuYW1lcyI6WyJNb2RhbENvbnRlbnRXcmFwcGVyIiwic3R5bGVkIiwiZGl2IiwicHJvcHMiLCJ0aGVtZSIsInRyYW5zaXRpb24iLCJsYWJlbENvbG9yTFQiLCJtZWRpYSIsInBvcnRhYmxlIiwicGFsbSIsImNzc1N0eWxlIiwiTW9kYWxDb250ZW50IiwibW9kYWxDb250ZW50WiIsIk1vZGFsVGl0bGUiLCJtb2RhbFRpdGxlRm9udFNpemUiLCJtb2RhbFRpdGxlQ29sb3IiLCJtb2RhbFRpdGxlWiIsIlN0eWxlZE1vZGFsRm9vdGVyIiwibW9kYWxGb290ZXJaIiwiQ2xvc2VCdXR0b24iLCJ0aXRsZUNvbG9yTFQiLCJtb2RhbEJ1dHRvbloiLCJGb290ZXJBY3Rpb25XcmFwcGVyIiwiZGVmYXVsdENhbmNlbEJ1dHRvbiIsImxpbmsiLCJsYXJnZSIsImNoaWxkcmVuIiwiZGVmYXVsdENvbmZpcm1CdXR0b24iLCJjdGEiLCJ3aWR0aCIsIk1vZGFsRm9vdGVyIiwiY2FuY2VsIiwiY29uZmlybSIsImNhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b24iLCJjYW5jZWxCdXR0b25Qcm9wcyIsImNvbmZpcm1CdXR0b25Qcm9wcyIsIk1vZGFsRGlhbG9nIiwiY2xhc3NOYW1lIiwib3ZlcmxheSIsImJhY2tncm91bmRDb2xvciIsIm1vZGFsT3ZlcmxheUJnZCIsInpJbmRleCIsIm1vZGFsT3ZlckxheVoiLCJzdHlsZSIsImZvb3RlciIsImNsb3NlIiwib25DYW5jZWwiLCJ0aXRsZSIsIm9uQ29uZmlybSIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsImJvb2wiLCJmdW5jIiwib2JqZWN0IiwiY29uZmlybUJ1dHRvbkxhYmVsIiwic3RyaW5nIiwiY2FuY2VsQnV0dG9uTGFiZWwiLCJhcnJheU9mIiwiYW55IiwiU3R5bGVkTW9kYWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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LElBRmE7QUFHcEJHLEVBQUFBLFNBQVMsRUFBRSxxQkFBTSxDQUFFLENBSEM7QUFJcEJGLEVBQUFBLFFBQVEsRUFBRSxvQkFBTSxDQUFFLENBSkU7QUFLcEJkLEVBQUFBLFlBQVksRUFBRVYsbUJBTE07QUFNcEJXLEVBQUFBLGFBQWEsRUFBRVAsb0JBTks7QUFPcEJqQixFQUFBQSxRQUFRLEVBQUU7QUFQVSxDO0FBMER4QixJQUFNa0QsV0FBVyxHQUFHLGtDQUFPdkIsV0FBUCxDQUFILGtQQUdELFVBQUFsQyxLQUFLO0FBQUEsU0FBSUEsS0FBSyxDQUFDQyxLQUFOLENBQVlDLFVBQWhCO0FBQUEsQ0FISixFQU9iRSx3QkFBTUMsUUFQTyxtSkFZYkQsd0JBQU1FLElBWk8sNElBQWpCO2VBc0JlbUQsVyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAnbG9jYWxpemF0aW9uJztcblxuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgTW9kYWwgZnJvbSAncmVhY3QtbW9kYWwnO1xuaW1wb3J0IHtEZWxldGV9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCB7QnV0dG9ufSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge21lZGlhfSBmcm9tICdzdHlsZXMvbWVkaWEtYnJlYWtwb2ludHMnO1xuXG5jb25zdCBNb2RhbENvbnRlbnRXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgb3ZlcmZsb3cteTogYXV0bztcbiAgbWF4LXdpZHRoOiA3MHZ3O1xuICBtYXgtaGVpZ2h0OiA4NXZoO1xuICBwYWRkaW5nOiAyNHB4IDcycHggNDBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0b3A6IDkycHg7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICBtYXJnaW46IDAgYXV0bztcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICB0cmFuc2l0aW9uOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRyYW5zaXRpb259O1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBmb250LXNpemU6IDEycHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxhYmVsQ29sb3JMVH07XG5cbiAgJHttZWRpYS5wb3J0YWJsZWBcbiAgICBwYWRkaW5nOiAxMnB4IDM2cHggMjRweDtcbiAgICBtYXgtd2lkdGg6IDgwdnc7XG4gIGB9XG5cbiAgJHttZWRpYS5wYWxtYFxuICAgIG1heC13aWR0aDogMTAwdnc7XG4gIGB9XG5cbiAgJHtwcm9wcyA9PiBwcm9wcy5jc3NTdHlsZSB8fCAnJ307XG5gO1xuXG5jb25zdCBNb2RhbENvbnRlbnQgPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubW9kYWxDb250ZW50Wn07XG5gO1xuXG5leHBvcnQgY29uc3QgTW9kYWxUaXRsZSA9IHN0eWxlZC5kaXZgXG4gIGZvbnQtc2l6ZTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tb2RhbFRpdGxlRm9udFNpemV9O1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tb2RhbFRpdGxlQ29sb3J9O1xuICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubW9kYWxUaXRsZVp9O1xuYDtcblxuY29uc3QgU3R5bGVkTW9kYWxGb290ZXIgPSBzdHlsZWQuZGl2YFxuICB3aWR0aDogMTAwJTtcbiAgbGVmdDogMDtcbiAgYm90dG9tOiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICBwYWRkaW5nLXRvcDogMjRweDtcbiAgJHttZWRpYS5wb3J0YWJsZWBcbiAgICBwYWRkaW5nLXRvcDogMjRweDtcbiAgYH07XG5cbiAgJHttZWRpYS5wYWxtYFxuICAgIHBhZGRpbmctdG9wOiAxNnB4O1xuICBgfTtcbiAgei1pbmRleDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5tb2RhbEZvb3Rlclp9O1xuYDtcblxuY29uc3QgQ2xvc2VCdXR0b24gPSBzdHlsZWQuZGl2YFxuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50aXRsZUNvbG9yTFR9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICB6LWluZGV4OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLm1vZGFsQnV0dG9uWn07XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAyNHB4O1xuICByaWdodDogMjRweDtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgfVxuYDtcblxuY29uc3QgRm9vdGVyQWN0aW9uV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG5gO1xuXG5jb25zdCBkZWZhdWx0Q2FuY2VsQnV0dG9uID0ge1xuICBsaW5rOiB0cnVlLFxuICBsYXJnZTogdHJ1ZSxcbiAgY2hpbGRyZW46ICdtb2RhbC5idXR0b24uZGVmYXVsdENhbmNlbCdcbn07XG5cbmNvbnN0IGRlZmF1bHRDb25maXJtQnV0dG9uID0ge1xuICBjdGE6IHRydWUsXG4gIGxhcmdlOiB0cnVlLFxuICB3aWR0aDogJzE2MHB4JyxcbiAgY2hpbGRyZW46ICdtb2RhbC5idXR0b24uZGVmYXVsdENvbmZpcm0nXG59O1xuXG5leHBvcnQgY29uc3QgTW9kYWxGb290ZXIgPSAoe2NhbmNlbCwgY29uZmlybSwgY2FuY2VsQnV0dG9uLCBjb25maXJtQnV0dG9ufSkgPT4ge1xuICBjb25zdCBjYW5jZWxCdXR0b25Qcm9wcyA9IHsuLi5kZWZhdWx0Q2FuY2VsQnV0dG9uLCAuLi5jYW5jZWxCdXR0b259O1xuICBjb25zdCBjb25maXJtQnV0dG9uUHJvcHMgPSB7Li4uZGVmYXVsdENvbmZpcm1CdXR0b24sIC4uLmNvbmZpcm1CdXR0b259O1xuICByZXR1cm4gKFxuICAgIDxTdHlsZWRNb2RhbEZvb3RlciBjbGFzc05hbWU9XCJtb2RhbC0tZm9vdGVyXCI+XG4gICAgICA8Rm9vdGVyQWN0aW9uV3JhcHBlcj5cbiAgICAgICAgPEJ1dHRvbiBjbGFzc05hbWU9XCJtb2RhbC0tZm9vdGVyLS1jYW5jZWwtYnV0dG9uXCIgey4uLmNhbmNlbEJ1dHRvblByb3BzfSBvbkNsaWNrPXtjYW5jZWx9PlxuICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXtjYW5jZWxCdXR0b25Qcm9wcy5jaGlsZHJlbn0gLz5cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b24gY2xhc3NOYW1lPVwibW9kYWwtLWZvb3Rlci0tY29uZmlybS1idXR0b25cIiB7Li4uY29uZmlybUJ1dHRvblByb3BzfSBvbkNsaWNrPXtjb25maXJtfT5cbiAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17Y29uZmlybUJ1dHRvblByb3BzLmNoaWxkcmVufSAvPlxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvRm9vdGVyQWN0aW9uV3JhcHBlcj5cbiAgICA8L1N0eWxlZE1vZGFsRm9vdGVyPlxuICApO1xufTtcblxuY2xhc3MgTW9kYWxEaWFsb2cgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGZvb3RlcjogUHJvcFR5cGVzLmJvb2wsXG4gICAgY2xvc2U6IFByb3BUeXBlcy5ib29sLFxuICAgIG9uQ29uZmlybTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25DYW5jZWw6IFByb3BUeXBlcy5mdW5jLFxuICAgIGNvbmZpcm1CdXR0b246IFByb3BUeXBlcy5vYmplY3QsXG4gICAgY29uZmlybUJ1dHRvbkxhYmVsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNhbmNlbEJ1dHRvbjogUHJvcFR5cGVzLm9iamVjdCxcbiAgICBjYW5jZWxCdXR0b25MYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBjc3NTdHlsZTogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSlcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGZvb3RlcjogZmFsc2UsXG4gICAgY2xvc2U6IHRydWUsXG4gICAgb25Db25maXJtOiAoKSA9PiB7fSxcbiAgICBvbkNhbmNlbDogKCkgPT4ge30sXG4gICAgY2FuY2VsQnV0dG9uOiBkZWZhdWx0Q2FuY2VsQnV0dG9uLFxuICAgIGNvbmZpcm1CdXR0b246IGRlZmF1bHRDb25maXJtQnV0dG9uLFxuICAgIGNzc1N0eWxlOiBbXVxuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7cHJvcHN9ID0gdGhpcztcbiAgICByZXR1cm4gKFxuICAgICAgPE1vZGFsXG4gICAgICAgIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWV9XG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgYXJpYUhpZGVBcHA9e2ZhbHNlfVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIG92ZXJsYXk6IHtcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKHByb3BzLnRoZW1lICYmIHByb3BzLnRoZW1lLm1vZGFsT3ZlcmxheUJnZCkgfHwgJ3JnYmEoMCwgMCwgMCwgMC41KScsXG4gICAgICAgICAgICB6SW5kZXg6IChwcm9wcy50aGVtZSAmJiBwcm9wcy50aGVtZS5tb2RhbE92ZXJMYXlaKSB8fCAxMDAwLFxuICAgICAgICAgICAgLy8gaW4gY2FzZSB3ZSB3YW50IHRvIG92ZXJyaWRlIHRoZSBtb2RhbCBkaWFsb2cgc3R5bGVcbiAgICAgICAgICAgIC4uLnByb3BzLnN0eWxlXG4gICAgICAgICAgfVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8TW9kYWxDb250ZW50V3JhcHBlclxuICAgICAgICAgIGNsYXNzTmFtZT1cIm1vZGFsLS13cmFwcGVyXCJcbiAgICAgICAgICBjc3NTdHlsZT17cHJvcHMuY3NzU3R5bGV9XG4gICAgICAgICAgZm9vdGVyPXtwcm9wcy5mb290ZXJ9XG4gICAgICAgID5cbiAgICAgICAgICB7cHJvcHMuY2xvc2UgJiYgKFxuICAgICAgICAgICAgPENsb3NlQnV0dG9uIGNsYXNzTmFtZT1cIm1vZGFsLS1jbG9zZVwiIG9uQ2xpY2s9e3Byb3BzLm9uQ2FuY2VsfT5cbiAgICAgICAgICAgICAgPERlbGV0ZSBoZWlnaHQ9XCIxNHB4XCIgLz5cbiAgICAgICAgICAgIDwvQ2xvc2VCdXR0b24+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAge3Byb3BzLnRpdGxlICYmIChcbiAgICAgICAgICAgICAgPE1vZGFsVGl0bGUgY2xhc3NOYW1lPVwibW9kYWwtLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9e3Byb3BzLnRpdGxlfSAvPlxuICAgICAgICAgICAgICA8L01vZGFsVGl0bGU+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPE1vZGFsQ29udGVudCBjbGFzc05hbWU9XCJtb2RhbC0tYm9keVwiPntwcm9wcy5jaGlsZHJlbn08L01vZGFsQ29udGVudD5cbiAgICAgICAgICAgIHtwcm9wcy5mb290ZXIgJiYgKFxuICAgICAgICAgICAgICA8TW9kYWxGb290ZXJcbiAgICAgICAgICAgICAgICBjYW5jZWw9e3Byb3BzLm9uQ2FuY2VsfVxuICAgICAgICAgICAgICAgIGNvbmZpcm09e3Byb3BzLm9uQ29uZmlybX1cbiAgICAgICAgICAgICAgICBjYW5jZWxCdXR0b249e3Byb3BzLmNhbmNlbEJ1dHRvbn1cbiAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uPXtwcm9wcy5jb25maXJtQnV0dG9ufVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbENvbnRlbnRXcmFwcGVyPlxuICAgICAgPC9Nb2RhbD5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IFN0eWxlZE1vZGFsID0gc3R5bGVkKE1vZGFsRGlhbG9nKWBcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB0cmFuc2l0aW9uOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRyYW5zaXRpb259O1xuICBwYWRkaW5nLWxlZnQ6IDQwcHg7XG4gIHBhZGRpbmctcmlnaHQ6IDQwcHg7XG5cbiAgJHttZWRpYS5wb3J0YWJsZWBcbiAgICBwYWRkaW5nLWxlZnQ6IDI0cHg7XG4gICAgcGFkZGluZy1yaWdodDogMjRweDtcbiAgYH07XG5cbiAgJHttZWRpYS5wYWxtYFxuICAgIHBhZGRpbmctbGVmdDogMDtcbiAgICBwYWRkaW5nLXJpZ2h0OiAwO1xuICBgfTtcblxuICA6Zm9jdXMge1xuICAgIG91dGxpbmU6IDA7XG4gIH1cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IFN0eWxlZE1vZGFsO1xuIl19