"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.UploadButton = void 0;

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

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
@typedef {{
  onUpload: (files: FileList, event: any) => void;
}} UploadButtonProps
*/
var Wrapper = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: inline-block;\n  color: ", ";\n  font-size: 12px;\n  text-decoration: underline;\n\n  :hover {\n    cursor: pointer;\n    font-weight: 500;\n  }\n"])), function (props) {
  return props.theme.textColorLT;
});
/*
Inspired by https://github.com/okonet/react-dropzone/blob/master/src/index.js
*/

/** @augments React.Component<UploadButtonProps> */


var UploadButton = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(UploadButton, _Component);

  var _super = _createSuper(UploadButton);

  function UploadButton() {
    var _this;

    (0, _classCallCheck2["default"])(this, UploadButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_fileInput", /*#__PURE__*/(0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onClick", function () {
      _this._fileInput.current.value = null;

      _this._fileInput.current.click();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onChange", function (event) {
      var files = event.target.files;

      if (!files) {
        return;
      }

      _this.props.onUpload(files, event);
    });
    return _this;
  }

  (0, _createClass2["default"])(UploadButton, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(Wrapper, {
        className: "upload-button"
      }, /*#__PURE__*/_react["default"].createElement("input", {
        type: "file",
        ref: this._fileInput,
        style: {
          display: 'none'
        },
        onChange: this._onChange,
        className: "upload-button-input"
      }), /*#__PURE__*/_react["default"].createElement("span", {
        className: "file-upload__upload-button-span",
        onClick: this._onClick
      }, this.props.children));
    }
  }]);
  return UploadButton;
}(_react.Component);

exports.UploadButton = UploadButton;
var _default = UploadButton;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWxlLXVwbG9hZGVyL3VwbG9hZC1idXR0b24uanMiXSwibmFtZXMiOlsiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJ0ZXh0Q29sb3JMVCIsIlVwbG9hZEJ1dHRvbiIsIl9maWxlSW5wdXQiLCJjdXJyZW50IiwidmFsdWUiLCJjbGljayIsImV2ZW50IiwiZmlsZXMiLCJ0YXJnZXQiLCJvblVwbG9hZCIsImRpc3BsYXkiLCJfb25DaGFuZ2UiLCJfb25DbGljayIsImNoaWxkcmVuIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7Ozs7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLE9BQU8sR0FBR0MsNkJBQU9DLEdBQVYsc1BBRUYsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxXQUFoQjtBQUFBLENBRkgsQ0FBYjtBQVdBO0FBQ0E7QUFDQTs7QUFDQTs7O0lBQ2FDLFk7Ozs7Ozs7Ozs7Ozs7OztnSEFDRSx1QjtpR0FFRixZQUFNO0FBQ2YsWUFBS0MsVUFBTCxDQUFnQkMsT0FBaEIsQ0FBd0JDLEtBQXhCLEdBQWdDLElBQWhDOztBQUNBLFlBQUtGLFVBQUwsQ0FBZ0JDLE9BQWhCLENBQXdCRSxLQUF4QjtBQUNELEs7a0dBRVcsVUFBQUMsS0FBSyxFQUFJO0FBQUEsVUFFUkMsS0FGUSxHQUdmRCxLQUhlLENBRWpCRSxNQUZpQixDQUVSRCxLQUZROztBQUtuQixVQUFJLENBQUNBLEtBQUwsRUFBWTtBQUNWO0FBQ0Q7O0FBRUQsWUFBS1QsS0FBTCxDQUFXVyxRQUFYLENBQW9CRixLQUFwQixFQUEyQkQsS0FBM0I7QUFDRCxLOzs7Ozs7V0FFRCxrQkFBUztBQUNQLDBCQUNFLGdDQUFDLE9BQUQ7QUFBUyxRQUFBLFNBQVMsRUFBQztBQUFuQixzQkFDRTtBQUNFLFFBQUEsSUFBSSxFQUFDLE1BRFA7QUFFRSxRQUFBLEdBQUcsRUFBRSxLQUFLSixVQUZaO0FBR0UsUUFBQSxLQUFLLEVBQUU7QUFBQ1EsVUFBQUEsT0FBTyxFQUFFO0FBQVYsU0FIVDtBQUlFLFFBQUEsUUFBUSxFQUFFLEtBQUtDLFNBSmpCO0FBS0UsUUFBQSxTQUFTLEVBQUM7QUFMWixRQURGLGVBUUU7QUFBTSxRQUFBLFNBQVMsRUFBQyxpQ0FBaEI7QUFBa0QsUUFBQSxPQUFPLEVBQUUsS0FBS0M7QUFBaEUsU0FDRyxLQUFLZCxLQUFMLENBQVdlLFFBRGQsQ0FSRixDQURGO0FBY0Q7OztFQW5DK0JDLGdCOzs7ZUFzQ25CYixZIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50LCBjcmVhdGVSZWZ9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG4vKipcbkB0eXBlZGVmIHt7XG4gIG9uVXBsb2FkOiAoZmlsZXM6IEZpbGVMaXN0LCBldmVudDogYW55KSA9PiB2b2lkO1xufX0gVXBsb2FkQnV0dG9uUHJvcHNcbiovXG5cbmNvbnN0IFdyYXBwZXIgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvckxUfTtcbiAgZm9udC1zaXplOiAxMnB4O1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcblxuICA6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICB9XG5gO1xuLypcbkluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9va29uZXQvcmVhY3QtZHJvcHpvbmUvYmxvYi9tYXN0ZXIvc3JjL2luZGV4LmpzXG4qL1xuLyoqIEBhdWdtZW50cyBSZWFjdC5Db21wb25lbnQ8VXBsb2FkQnV0dG9uUHJvcHM+ICovXG5leHBvcnQgY2xhc3MgVXBsb2FkQnV0dG9uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgX2ZpbGVJbnB1dCA9IGNyZWF0ZVJlZigpO1xuXG4gIF9vbkNsaWNrID0gKCkgPT4ge1xuICAgIHRoaXMuX2ZpbGVJbnB1dC5jdXJyZW50LnZhbHVlID0gbnVsbDtcbiAgICB0aGlzLl9maWxlSW5wdXQuY3VycmVudC5jbGljaygpO1xuICB9O1xuXG4gIF9vbkNoYW5nZSA9IGV2ZW50ID0+IHtcbiAgICBjb25zdCB7XG4gICAgICB0YXJnZXQ6IHtmaWxlc31cbiAgICB9ID0gZXZlbnQ7XG5cbiAgICBpZiAoIWZpbGVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wcy5vblVwbG9hZChmaWxlcywgZXZlbnQpO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFdyYXBwZXIgY2xhc3NOYW1lPVwidXBsb2FkLWJ1dHRvblwiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgcmVmPXt0aGlzLl9maWxlSW5wdXR9XG4gICAgICAgICAgc3R5bGU9e3tkaXNwbGF5OiAnbm9uZSd9fVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLl9vbkNoYW5nZX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJ1cGxvYWQtYnV0dG9uLWlucHV0XCJcbiAgICAgICAgLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmlsZS11cGxvYWRfX3VwbG9hZC1idXR0b24tc3BhblwiIG9uQ2xpY2s9e3RoaXMuX29uQ2xpY2t9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L1dyYXBwZXI+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBVcGxvYWRCdXR0b247XG4iXX0=