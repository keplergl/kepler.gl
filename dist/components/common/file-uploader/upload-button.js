"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: inline-block;\n  color: ", ";\n  font-size: 12px;\n  text-decoration: underline;\n\n  :hover {\n    cursor: pointer;\n    font-weight: 500;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var Wrapper = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.textColorLT;
});
/*
Inspired by https://github.com/okonet/react-dropzone/blob/master/src/index.js
*/


var UploadButton =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(UploadButton, _Component);

  function UploadButton() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, UploadButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(UploadButton)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_fileInput", (0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onClick", function () {
      _this._fileInput.current.value = null;

      _this._fileInput.current.click();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_onChange", function (_ref) {
      var files = _ref.target.files;

      if (!files) {
        return;
      }

      _this.props.onUpload(files);
    });
    return _this;
  }

  (0, _createClass2["default"])(UploadButton, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(Wrapper, {
        className: "upload-button"
      }, _react["default"].createElement("input", {
        type: "file",
        ref: this._fileInput,
        style: {
          display: 'none'
        },
        onChange: this._onChange,
        className: "upload-button-input"
      }), _react["default"].createElement("span", {
        className: "file-upload__upload-button-span",
        onClick: this._onClick
      }, this.props.children));
    }
  }]);
  return UploadButton;
}(_react.Component);

exports["default"] = UploadButton;
(0, _defineProperty2["default"])(UploadButton, "propTypes", {
  onUpload: _propTypes["default"].func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWxlLXVwbG9hZGVyL3VwbG9hZC1idXR0b24uanMiXSwibmFtZXMiOlsiV3JhcHBlciIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJ0ZXh0Q29sb3JMVCIsIlVwbG9hZEJ1dHRvbiIsIl9maWxlSW5wdXQiLCJjdXJyZW50IiwidmFsdWUiLCJjbGljayIsImZpbGVzIiwidGFyZ2V0Iiwib25VcGxvYWQiLCJkaXNwbGF5IiwiX29uQ2hhbmdlIiwiX29uQ2xpY2siLCJjaGlsZHJlbiIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsImZ1bmMiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLE9BQU8sR0FBR0MsNkJBQU9DLEdBQVYsb0JBRUYsVUFBQUMsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0MsS0FBTixDQUFZQyxXQUFoQjtBQUFBLENBRkgsQ0FBYjtBQVdBOzs7OztJQUdxQkMsWTs7Ozs7Ozs7Ozs7Ozs7Ozs7bUdBS04sdUI7aUdBRUYsWUFBTTtBQUNmLFlBQUtDLFVBQUwsQ0FBZ0JDLE9BQWhCLENBQXdCQyxLQUF4QixHQUFnQyxJQUFoQzs7QUFDQSxZQUFLRixVQUFMLENBQWdCQyxPQUFoQixDQUF3QkUsS0FBeEI7QUFDRCxLO2tHQUVXLGdCQUF1QjtBQUFBLFVBQVpDLEtBQVksUUFBckJDLE1BQXFCLENBQVpELEtBQVk7O0FBQ2pDLFVBQUksQ0FBQ0EsS0FBTCxFQUFZO0FBQ1Y7QUFDRDs7QUFFRCxZQUFLUixLQUFMLENBQVdVLFFBQVgsQ0FBb0JGLEtBQXBCO0FBQ0QsSzs7Ozs7OzZCQUVRO0FBQ1AsYUFDRSxnQ0FBQyxPQUFEO0FBQVMsUUFBQSxTQUFTLEVBQUM7QUFBbkIsU0FDRTtBQUNFLFFBQUEsSUFBSSxFQUFDLE1BRFA7QUFFRSxRQUFBLEdBQUcsRUFBRSxLQUFLSixVQUZaO0FBR0UsUUFBQSxLQUFLLEVBQUU7QUFBQ08sVUFBQUEsT0FBTyxFQUFFO0FBQVYsU0FIVDtBQUlFLFFBQUEsUUFBUSxFQUFFLEtBQUtDLFNBSmpCO0FBS0UsUUFBQSxTQUFTLEVBQUM7QUFMWixRQURGLEVBUUU7QUFBTSxRQUFBLFNBQVMsRUFBQyxpQ0FBaEI7QUFBa0QsUUFBQSxPQUFPLEVBQUUsS0FBS0M7QUFBaEUsU0FDRyxLQUFLYixLQUFMLENBQVdjLFFBRGQsQ0FSRixDQURGO0FBY0Q7OztFQW5DdUNDLGdCOzs7aUNBQXJCWixZLGVBQ0E7QUFDakJPLEVBQUFBLFFBQVEsRUFBRU0sc0JBQVVDLElBQVYsQ0FBZUM7QUFEUixDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50LCBjcmVhdGVSZWZ9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yTFR9O1xuICBmb250LXNpemU6IDEycHg7XG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIH1cbmA7XG4vKlxuSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL29rb25ldC9yZWFjdC1kcm9wem9uZS9ibG9iL21hc3Rlci9zcmMvaW5kZXguanNcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcGxvYWRCdXR0b24gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9uVXBsb2FkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH07XG5cbiAgX2ZpbGVJbnB1dCA9IGNyZWF0ZVJlZigpO1xuXG4gIF9vbkNsaWNrID0gKCkgPT4ge1xuICAgIHRoaXMuX2ZpbGVJbnB1dC5jdXJyZW50LnZhbHVlID0gbnVsbDtcbiAgICB0aGlzLl9maWxlSW5wdXQuY3VycmVudC5jbGljaygpO1xuICB9O1xuXG4gIF9vbkNoYW5nZSA9ICh7dGFyZ2V0OiB7ZmlsZXN9fSkgPT4ge1xuICAgIGlmICghZmlsZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BzLm9uVXBsb2FkKGZpbGVzKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxXcmFwcGVyIGNsYXNzTmFtZT1cInVwbG9hZC1idXR0b25cIj5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgIHJlZj17dGhpcy5fZmlsZUlucHV0fVxuICAgICAgICAgIHN0eWxlPXt7ZGlzcGxheTogJ25vbmUnfX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fb25DaGFuZ2V9XG4gICAgICAgICAgY2xhc3NOYW1lPVwidXBsb2FkLWJ1dHRvbi1pbnB1dFwiXG4gICAgICAgIC8+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZpbGUtdXBsb2FkX191cGxvYWQtYnV0dG9uLXNwYW5cIiBvbkNsaWNrPXt0aGlzLl9vbkNsaWNrfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9XcmFwcGVyPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==