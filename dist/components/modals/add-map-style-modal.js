"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactMapGl = _interopRequireDefault(require("react-map-gl"));

var _styledComponents2 = require("../common/styled-components");

var _mediaBreakpoints = require("../../styles/media-breakpoints");

var _mapboxUtils = require("../../utils/map-style-utils/mapbox-utils");

var _reactIntl = require("react-intl");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  font-weight: 500;\n\n  :hover {\n    cursor: pointer;\n  }\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background: ", ";\n  border-radius: 4px;\n  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.18);\n  width: ", "px;\n  height: ", "px;\n  position: relative;\n\n  .preview-image-placeholder {\n    position: absolute;\n    top: 0;\n    left: 0;\n  }\n\n  .preview-image-spinner {\n    position: absolute;\n    left: calc(50% - 25px);\n    top: calc(50% - 25px);\n  }\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    margin-left: unset;\n    .preview-title {\n      margin-top: 0px;\n    }\n  "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n    margin-left: 32px;\n  "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  margin-left: 116px;\n  flex-shrink: 0;\n\n  .preview-title {\n    font-weight: 500;\n    font-size: 10px;\n    padding: 8px 0px;\n  }\n\n  .preview-title.error {\n    color: ", ";\n  }\n\n  ", ";\n\n  ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var MapH = 190;
var MapW = 264;
var ErrorMsg = {
  styleError: 'Failed to load map style, make sure it is published. For private style, paste in your access token.'
};

var PreviewMap = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.errorColor;
}, _mediaBreakpoints.media.portable(_templateObject2()), _mediaBreakpoints.media.palm(_templateObject3()));

var StyledPreviewImage = _styledComponents["default"].div(_templateObject4(), function (props) {
  return props.theme.modalImagePlaceHolder;
}, MapW, MapH);

var InlineLink = _styledComponents["default"].a(_templateObject5());

function AddMapStyleModalFactory() {
  var AddMapStyleModal =
  /*#__PURE__*/
  function (_Component) {
    (0, _inherits2["default"])(AddMapStyleModal, _Component);

    function AddMapStyleModal() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, AddMapStyleModal);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(AddMapStyleModal)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
        reRenderKey: 0,
        previousToken: null
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "loadMapStyleJson", function (style) {
        _this.props.loadCustomMapStyle({
          style: style,
          error: false
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "loadMapStyleError", function () {
        _this.props.loadCustomMapStyle({
          error: true
        });
      });
      return _this;
    }

    (0, _createClass2["default"])(AddMapStyleModal, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        var _this2 = this;

        var map = this.mapRef && this.mapRef.getMap();

        if (map && this._map !== map) {
          this._map = map;
          map.on('style.load', function () {
            var style = map.getStyle();

            _this2.loadMapStyleJson(style);
          });
          map.on('error', function () {
            _this2.loadMaoStyleError();
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        var _this$props = this.props,
            inputStyle = _this$props.inputStyle,
            mapState = _this$props.mapState,
            mapboxApiUrl = _this$props.mapboxApiUrl,
            intl = _this$props.intl;
        var mapboxApiAccessToken = inputStyle.accessToken || this.props.mapboxApiAccessToken;

        var mapProps = _objectSpread({}, mapState, {
          mapboxApiUrl: mapboxApiUrl,
          mapboxApiAccessToken: mapboxApiAccessToken,
          preserveDrawingBuffer: true,
          transformRequest: _mapboxUtils.transformRequest
        });

        return _react["default"].createElement("div", {
          className: "add-map-style-modal"
        }, _react["default"].createElement(_styledComponents2.StyledModalContent, null, _react["default"].createElement(_styledComponents2.StyledModalVerticalPanel, null, _react["default"].createElement(_styledComponents2.StyledModalSection, null, _react["default"].createElement("div", {
          className: "modal-section-title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.addStyle.publishTitle'
        })), _react["default"].createElement("div", {
          className: "modal-section-subtitle"
        }, intl.formatMessage({
          id: 'modal.addStyle.publishSubtitle1'
        }), _react["default"].createElement(InlineLink, {
          target: "_blank",
          href: "https://www.mapbox.com/studio/styles/"
        }, ' ', "mapbox"), ' ', intl.formatMessage({
          id: 'modal.addStyle.publishSubtitle2'
        }), _react["default"].createElement(InlineLink, {
          target: "_blank",
          href: "https://www.mapbox.com/help/studio-manual-publish/"
        }, ' ', intl.formatMessage({
          id: 'modal.addStyle.publishSubtitle3'
        })), ' ', intl.formatMessage({
          id: 'modal.addStyle.publishSubtitle4'
        })), _react["default"].createElement("div", {
          className: "modal-section-subtitle"
        }, intl.formatMessage({
          id: 'modal.addStyle.publishSubtitle5'
        }), _react["default"].createElement(InlineLink, {
          target: "_blank",
          href: "https://www.mapbox.com/help/how-access-tokens-work/"
        }, ' ', intl.formatMessage({
          id: 'modal.addStyle.publishSubtitle6'
        })), ' ', intl.formatMessage({
          id: 'modal.addStyle.publishSubtitle7'
        })), _react["default"].createElement(_styledComponents2.InputLight, {
          type: "text",
          value: inputStyle.accessToken || '',
          onChange: function onChange(_ref) {
            var value = _ref.target.value;
            return _this3.props.inputMapStyle({
              accessToken: value
            });
          },
          placeholder: intl.formatMessage({
            id: 'modal.addStyle.exampleToken'
          })
        })), _react["default"].createElement(_styledComponents2.StyledModalSection, null, _react["default"].createElement("div", {
          className: "modal-section-title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.addStyle.pasteTitle'
        })), _react["default"].createElement("div", {
          className: "modal-section-subtitle"
        }, intl.formatMessage({
          id: 'modal.addStyle.pasteSubtitle1'
        }), _react["default"].createElement(InlineLink, {
          target: "_blank",
          href: "https://www.mapbox.com/help/studio-manual-publish/#style-url"
        }, ' ', intl.formatMessage({
          id: 'modal.addStyle.pasteSubtitle2'
        }))), _react["default"].createElement(_styledComponents2.InputLight, {
          type: "text",
          value: inputStyle.url || '',
          onChange: function onChange(_ref2) {
            var value = _ref2.target.value;
            return _this3.props.inputMapStyle({
              url: value
            });
          },
          placeholder: "e.g. mapbox://styles/uberdataviz/abcdefghijklmnopq"
        })), _react["default"].createElement(_styledComponents2.StyledModalSection, null, _react["default"].createElement("div", {
          className: "modal-section-title"
        }, _react["default"].createElement(_reactIntl.FormattedMessage, {
          id: 'modal.addStyle.namingTitle'
        })), _react["default"].createElement(_styledComponents2.InputLight, {
          type: "text",
          value: inputStyle.label || '',
          onChange: function onChange(_ref3) {
            var value = _ref3.target.value;
            return _this3.props.inputMapStyle({
              label: value
            });
          }
        }))), _react["default"].createElement(PreviewMap, null, _react["default"].createElement("div", {
          className: (0, _classnames["default"])('preview-title', {
            error: inputStyle.error
          })
        }, inputStyle.error ? ErrorMsg.styleError : inputStyle.style && inputStyle.style.name || ''), _react["default"].createElement(StyledPreviewImage, {
          className: "preview-image"
        }, !inputStyle.isValid ? _react["default"].createElement("div", {
          className: "preview-image-spinner"
        }) : _react["default"].createElement(_styledComponents2.StyledMapContainer, null, _react["default"].createElement(_reactMapGl["default"], (0, _extends2["default"])({}, mapProps, {
          ref: function ref(el) {
            _this3.mapRef = el;
          },
          key: this.state.reRenderKey,
          width: MapW,
          height: MapH,
          mapStyle: inputStyle.url
        })))))));
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(props, state) {
        if (props.inputStyle && props.inputStyle.accessToken && props.inputStyle.accessToken !== state.previousToken) {
          // toke has changed
          // ReactMapGl doesn't re-create map when token has changed
          // here we force the map to update
          return {
            reRenderKey: state.reRenderKey + 1,
            previousToken: props.inputStyle.accessToken
          };
        }

        return null;
      }
    }]);
    return AddMapStyleModal;
  }(_react.Component);

  (0, _defineProperty2["default"])(AddMapStyleModal, "propTypes", {
    inputMapStyle: _propTypes["default"].func.isRequired,
    inputStyle: _propTypes["default"].object.isRequired,
    loadCustomMapStyle: _propTypes["default"].func.isRequired,
    mapboxApiAccessToken: _propTypes["default"].string.isRequired,
    mapboxApiUrl: _propTypes["default"].string.isRequired,
    mapState: _propTypes["default"].object.isRequired
  });
  return (0, _reactIntl.injectIntl)((0, _reactLifecyclesCompat.polyfill)(AddMapStyleModal));
}

var _default = AddMapStyleModalFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21vZGFscy9hZGQtbWFwLXN0eWxlLW1vZGFsLmpzIl0sIm5hbWVzIjpbIk1hcEgiLCJNYXBXIiwiRXJyb3JNc2ciLCJzdHlsZUVycm9yIiwiUHJldmlld01hcCIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJlcnJvckNvbG9yIiwibWVkaWEiLCJwb3J0YWJsZSIsInBhbG0iLCJTdHlsZWRQcmV2aWV3SW1hZ2UiLCJtb2RhbEltYWdlUGxhY2VIb2xkZXIiLCJJbmxpbmVMaW5rIiwiYSIsIkFkZE1hcFN0eWxlTW9kYWxGYWN0b3J5IiwiQWRkTWFwU3R5bGVNb2RhbCIsInJlUmVuZGVyS2V5IiwicHJldmlvdXNUb2tlbiIsInN0eWxlIiwibG9hZEN1c3RvbU1hcFN0eWxlIiwiZXJyb3IiLCJtYXAiLCJtYXBSZWYiLCJnZXRNYXAiLCJfbWFwIiwib24iLCJnZXRTdHlsZSIsImxvYWRNYXBTdHlsZUpzb24iLCJsb2FkTWFvU3R5bGVFcnJvciIsImlucHV0U3R5bGUiLCJtYXBTdGF0ZSIsIm1hcGJveEFwaVVybCIsImludGwiLCJtYXBib3hBcGlBY2Nlc3NUb2tlbiIsImFjY2Vzc1Rva2VuIiwibWFwUHJvcHMiLCJwcmVzZXJ2ZURyYXdpbmdCdWZmZXIiLCJ0cmFuc2Zvcm1SZXF1ZXN0IiwiZm9ybWF0TWVzc2FnZSIsImlkIiwidmFsdWUiLCJ0YXJnZXQiLCJpbnB1dE1hcFN0eWxlIiwidXJsIiwibGFiZWwiLCJuYW1lIiwiaXNWYWxpZCIsImVsIiwic3RhdGUiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsIm9iamVjdCIsInN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBT0E7O0FBR0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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Z0JBQVQsQ0FBWCxDQUFQO0FBQ0Q7O2VBRWNELHVCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge3BvbHlmaWxsfSBmcm9tICdyZWFjdC1saWZlY3ljbGVzLWNvbXBhdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNsYXNzbmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBNYXBib3hHTE1hcCBmcm9tICdyZWFjdC1tYXAtZ2wnO1xuaW1wb3J0IHtcbiAgU3R5bGVkTW9kYWxDb250ZW50LFxuICBJbnB1dExpZ2h0LFxuICBTdHlsZWRNYXBDb250YWluZXIsXG4gIFN0eWxlZE1vZGFsVmVydGljYWxQYW5lbCxcbiAgU3R5bGVkTW9kYWxTZWN0aW9uXG59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7bWVkaWF9IGZyb20gJ3N0eWxlcy9tZWRpYS1icmVha3BvaW50cyc7XG5cbi8vIFV0aWxzXG5pbXBvcnQge3RyYW5zZm9ybVJlcXVlc3R9IGZyb20gJ3V0aWxzL21hcC1zdHlsZS11dGlscy9tYXBib3gtdXRpbHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlLCBpbmplY3RJbnRsfSBmcm9tICdyZWFjdC1pbnRsJztcblxuY29uc3QgTWFwSCA9IDE5MDtcbmNvbnN0IE1hcFcgPSAyNjQ7XG5jb25zdCBFcnJvck1zZyA9IHtcbiAgc3R5bGVFcnJvcjpcbiAgICAnRmFpbGVkIHRvIGxvYWQgbWFwIHN0eWxlLCBtYWtlIHN1cmUgaXQgaXMgcHVibGlzaGVkLiBGb3IgcHJpdmF0ZSBzdHlsZSwgcGFzdGUgaW4geW91ciBhY2Nlc3MgdG9rZW4uJ1xufTtcblxuY29uc3QgUHJldmlld01hcCA9IHN0eWxlZC5kaXZgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBtYXJnaW4tbGVmdDogMTE2cHg7XG4gIGZsZXgtc2hyaW5rOiAwO1xuXG4gIC5wcmV2aWV3LXRpdGxlIHtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgICBwYWRkaW5nOiA4cHggMHB4O1xuICB9XG5cbiAgLnByZXZpZXctdGl0bGUuZXJyb3Ige1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmVycm9yQ29sb3J9O1xuICB9XG5cbiAgJHttZWRpYS5wb3J0YWJsZWBcbiAgICBtYXJnaW4tbGVmdDogMzJweDtcbiAgYH07XG5cbiAgJHttZWRpYS5wYWxtYFxuICAgIG1hcmdpbi1sZWZ0OiB1bnNldDtcbiAgICAucHJldmlldy10aXRsZSB7XG4gICAgICBtYXJnaW4tdG9wOiAwcHg7XG4gICAgfVxuICBgfTtcbmA7XG5cbmNvbnN0IFN0eWxlZFByZXZpZXdJbWFnZSA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUubW9kYWxJbWFnZVBsYWNlSG9sZGVyfTtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBib3gtc2hhZG93OiAwIDhweCAxNnB4IDAgcmdiYSgwLCAwLCAwLCAwLjE4KTtcbiAgd2lkdGg6ICR7TWFwV31weDtcbiAgaGVpZ2h0OiAke01hcEh9cHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAucHJldmlldy1pbWFnZS1wbGFjZWhvbGRlciB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiAwO1xuICB9XG5cbiAgLnByZXZpZXctaW1hZ2Utc3Bpbm5lciB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGxlZnQ6IGNhbGMoNTAlIC0gMjVweCk7XG4gICAgdG9wOiBjYWxjKDUwJSAtIDI1cHgpO1xuICB9XG5gO1xuXG5jb25zdCBJbmxpbmVMaW5rID0gc3R5bGVkLmFgXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG5cbiAgOmhvdmVyIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cbmA7XG5cbmZ1bmN0aW9uIEFkZE1hcFN0eWxlTW9kYWxGYWN0b3J5KCkge1xuICBjbGFzcyBBZGRNYXBTdHlsZU1vZGFsIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgICAgaW5wdXRNYXBTdHlsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIGlucHV0U3R5bGU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGxvYWRDdXN0b21NYXBTdHlsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICBtYXBib3hBcGlVcmw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgIG1hcFN0YXRlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbiAgICB9O1xuXG4gICAgc3RhdGUgPSB7XG4gICAgICByZVJlbmRlcktleTogMCxcbiAgICAgIHByZXZpb3VzVG9rZW46IG51bGxcbiAgICB9O1xuXG4gICAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyhwcm9wcywgc3RhdGUpIHtcbiAgICAgIGlmIChcbiAgICAgICAgcHJvcHMuaW5wdXRTdHlsZSAmJlxuICAgICAgICBwcm9wcy5pbnB1dFN0eWxlLmFjY2Vzc1Rva2VuICYmXG4gICAgICAgIHByb3BzLmlucHV0U3R5bGUuYWNjZXNzVG9rZW4gIT09IHN0YXRlLnByZXZpb3VzVG9rZW5cbiAgICAgICkge1xuICAgICAgICAvLyB0b2tlIGhhcyBjaGFuZ2VkXG4gICAgICAgIC8vIFJlYWN0TWFwR2wgZG9lc24ndCByZS1jcmVhdGUgbWFwIHdoZW4gdG9rZW4gaGFzIGNoYW5nZWRcbiAgICAgICAgLy8gaGVyZSB3ZSBmb3JjZSB0aGUgbWFwIHRvIHVwZGF0ZVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmVSZW5kZXJLZXk6IHN0YXRlLnJlUmVuZGVyS2V5ICsgMSxcbiAgICAgICAgICBwcmV2aW91c1Rva2VuOiBwcm9wcy5pbnB1dFN0eWxlLmFjY2Vzc1Rva2VuXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICAgIGNvbnN0IG1hcCA9IHRoaXMubWFwUmVmICYmIHRoaXMubWFwUmVmLmdldE1hcCgpO1xuICAgICAgaWYgKG1hcCAmJiB0aGlzLl9tYXAgIT09IG1hcCkge1xuICAgICAgICB0aGlzLl9tYXAgPSBtYXA7XG5cbiAgICAgICAgbWFwLm9uKCdzdHlsZS5sb2FkJywgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0eWxlID0gbWFwLmdldFN0eWxlKCk7XG4gICAgICAgICAgdGhpcy5sb2FkTWFwU3R5bGVKc29uKHN0eWxlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWFwLm9uKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgICB0aGlzLmxvYWRNYW9TdHlsZUVycm9yKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxvYWRNYXBTdHlsZUpzb24gPSBzdHlsZSA9PiB7XG4gICAgICB0aGlzLnByb3BzLmxvYWRDdXN0b21NYXBTdHlsZSh7c3R5bGUsIGVycm9yOiBmYWxzZX0pO1xuICAgIH07XG5cbiAgICBsb2FkTWFwU3R5bGVFcnJvciA9ICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMubG9hZEN1c3RvbU1hcFN0eWxlKHtlcnJvcjogdHJ1ZX0pO1xuICAgIH07XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7aW5wdXRTdHlsZSwgbWFwU3RhdGUsIG1hcGJveEFwaVVybCwgaW50bH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBjb25zdCBtYXBib3hBcGlBY2Nlc3NUb2tlbiA9IGlucHV0U3R5bGUuYWNjZXNzVG9rZW4gfHwgdGhpcy5wcm9wcy5tYXBib3hBcGlBY2Nlc3NUb2tlbjtcbiAgICAgIGNvbnN0IG1hcFByb3BzID0ge1xuICAgICAgICAuLi5tYXBTdGF0ZSxcbiAgICAgICAgbWFwYm94QXBpVXJsLFxuICAgICAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlLFxuICAgICAgICB0cmFuc2Zvcm1SZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFkZC1tYXAtc3R5bGUtbW9kYWxcIj5cbiAgICAgICAgICA8U3R5bGVkTW9kYWxDb250ZW50PlxuICAgICAgICAgICAgPFN0eWxlZE1vZGFsVmVydGljYWxQYW5lbD5cbiAgICAgICAgICAgICAgPFN0eWxlZE1vZGFsU2VjdGlvbj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLXNlY3Rpb24tdGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnbW9kYWwuYWRkU3R5bGUucHVibGlzaFRpdGxlJ30gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLXNlY3Rpb24tc3VidGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgIHtpbnRsLmZvcm1hdE1lc3NhZ2Uoe2lkOiAnbW9kYWwuYWRkU3R5bGUucHVibGlzaFN1YnRpdGxlMSd9KX1cbiAgICAgICAgICAgICAgICAgIDxJbmxpbmVMaW5rIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJodHRwczovL3d3dy5tYXBib3guY29tL3N0dWRpby9zdHlsZXMvXCI+XG4gICAgICAgICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgICAgICAgIG1hcGJveFxuICAgICAgICAgICAgICAgICAgPC9JbmxpbmVMaW5rPnsnICd9XG4gICAgICAgICAgICAgICAgICB7aW50bC5mb3JtYXRNZXNzYWdlKHtpZDogJ21vZGFsLmFkZFN0eWxlLnB1Ymxpc2hTdWJ0aXRsZTInfSl9XG4gICAgICAgICAgICAgICAgICA8SW5saW5lTGlua1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly93d3cubWFwYm94LmNvbS9oZWxwL3N0dWRpby1tYW51YWwtcHVibGlzaC9cIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgICAgICAgICB7aW50bC5mb3JtYXRNZXNzYWdlKHtpZDogJ21vZGFsLmFkZFN0eWxlLnB1Ymxpc2hTdWJ0aXRsZTMnfSl9XG4gICAgICAgICAgICAgICAgICA8L0lubGluZUxpbms+eycgJ31cbiAgICAgICAgICAgICAgICAgIHtpbnRsLmZvcm1hdE1lc3NhZ2Uoe2lkOiAnbW9kYWwuYWRkU3R5bGUucHVibGlzaFN1YnRpdGxlNCd9KX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLXNlY3Rpb24tc3VidGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgIHtpbnRsLmZvcm1hdE1lc3NhZ2Uoe2lkOiAnbW9kYWwuYWRkU3R5bGUucHVibGlzaFN1YnRpdGxlNSd9KX1cbiAgICAgICAgICAgICAgICAgIDxJbmxpbmVMaW5rXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgICAgICAgIGhyZWY9XCJodHRwczovL3d3dy5tYXBib3guY29tL2hlbHAvaG93LWFjY2Vzcy10b2tlbnMtd29yay9cIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgICAgICAgICB7aW50bC5mb3JtYXRNZXNzYWdlKHtpZDogJ21vZGFsLmFkZFN0eWxlLnB1Ymxpc2hTdWJ0aXRsZTYnfSl9XG4gICAgICAgICAgICAgICAgICA8L0lubGluZUxpbms+eycgJ31cbiAgICAgICAgICAgICAgICAgIHtpbnRsLmZvcm1hdE1lc3NhZ2Uoe2lkOiAnbW9kYWwuYWRkU3R5bGUucHVibGlzaFN1YnRpdGxlNyd9KX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8SW5wdXRMaWdodFxuICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgdmFsdWU9e2lucHV0U3R5bGUuYWNjZXNzVG9rZW4gfHwgJyd9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHt0YXJnZXQ6IHt2YWx1ZX19KSA9PiB0aGlzLnByb3BzLmlucHV0TWFwU3R5bGUoe2FjY2Vzc1Rva2VuOiB2YWx1ZX0pfVxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e2ludGwuZm9ybWF0TWVzc2FnZSh7aWQ6ICdtb2RhbC5hZGRTdHlsZS5leGFtcGxlVG9rZW4nfSl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9TdHlsZWRNb2RhbFNlY3Rpb24+XG4gICAgICAgICAgICAgIDxTdHlsZWRNb2RhbFNlY3Rpb24+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1zZWN0aW9uLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17J21vZGFsLmFkZFN0eWxlLnBhc3RlVGl0bGUnfSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtc2VjdGlvbi1zdWJ0aXRsZVwiPlxuICAgICAgICAgICAgICAgICAge2ludGwuZm9ybWF0TWVzc2FnZSh7aWQ6ICdtb2RhbC5hZGRTdHlsZS5wYXN0ZVN1YnRpdGxlMSd9KX1cbiAgICAgICAgICAgICAgICAgIDxJbmxpbmVMaW5rXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgICAgICAgIGhyZWY9XCJodHRwczovL3d3dy5tYXBib3guY29tL2hlbHAvc3R1ZGlvLW1hbnVhbC1wdWJsaXNoLyNzdHlsZS11cmxcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgICAgICAgICB7aW50bC5mb3JtYXRNZXNzYWdlKHtpZDogJ21vZGFsLmFkZFN0eWxlLnBhc3RlU3VidGl0bGUyJ30pfVxuICAgICAgICAgICAgICAgICAgPC9JbmxpbmVMaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxJbnB1dExpZ2h0XG4gICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17aW5wdXRTdHlsZS51cmwgfHwgJyd9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHt0YXJnZXQ6IHt2YWx1ZX19KSA9PiB0aGlzLnByb3BzLmlucHV0TWFwU3R5bGUoe3VybDogdmFsdWV9KX1cbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZS5nLiBtYXBib3g6Ly9zdHlsZXMvdWJlcmRhdGF2aXovYWJjZGVmZ2hpamtsbW5vcHFcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvU3R5bGVkTW9kYWxTZWN0aW9uPlxuICAgICAgICAgICAgICA8U3R5bGVkTW9kYWxTZWN0aW9uPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtc2VjdGlvbi10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9eydtb2RhbC5hZGRTdHlsZS5uYW1pbmdUaXRsZSd9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPElucHV0TGlnaHRcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtpbnB1dFN0eWxlLmxhYmVsIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh7dGFyZ2V0OiB7dmFsdWV9fSkgPT4gdGhpcy5wcm9wcy5pbnB1dE1hcFN0eWxlKHtsYWJlbDogdmFsdWV9KX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L1N0eWxlZE1vZGFsU2VjdGlvbj5cbiAgICAgICAgICAgIDwvU3R5bGVkTW9kYWxWZXJ0aWNhbFBhbmVsPlxuICAgICAgICAgICAgPFByZXZpZXdNYXA+XG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3ByZXZpZXctdGl0bGUnLCB7XG4gICAgICAgICAgICAgICAgICBlcnJvcjogaW5wdXRTdHlsZS5lcnJvclxuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2lucHV0U3R5bGUuZXJyb3JcbiAgICAgICAgICAgICAgICAgID8gRXJyb3JNc2cuc3R5bGVFcnJvclxuICAgICAgICAgICAgICAgICAgOiAoaW5wdXRTdHlsZS5zdHlsZSAmJiBpbnB1dFN0eWxlLnN0eWxlLm5hbWUpIHx8ICcnfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPFN0eWxlZFByZXZpZXdJbWFnZSBjbGFzc05hbWU9XCJwcmV2aWV3LWltYWdlXCI+XG4gICAgICAgICAgICAgICAgeyFpbnB1dFN0eWxlLmlzVmFsaWQgPyAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByZXZpZXctaW1hZ2Utc3Bpbm5lclwiIC8+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIDxTdHlsZWRNYXBDb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDxNYXBib3hHTE1hcFxuICAgICAgICAgICAgICAgICAgICAgIHsuLi5tYXBQcm9wc31cbiAgICAgICAgICAgICAgICAgICAgICByZWY9e2VsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFwUmVmID0gZWw7XG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICBrZXk9e3RoaXMuc3RhdGUucmVSZW5kZXJLZXl9XG4gICAgICAgICAgICAgICAgICAgICAgd2lkdGg9e01hcFd9XG4gICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PXtNYXBIfVxuICAgICAgICAgICAgICAgICAgICAgIG1hcFN0eWxlPXtpbnB1dFN0eWxlLnVybH1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvU3R5bGVkTWFwQ29udGFpbmVyPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvU3R5bGVkUHJldmlld0ltYWdlPlxuICAgICAgICAgICAgPC9QcmV2aWV3TWFwPlxuICAgICAgICAgIDwvU3R5bGVkTW9kYWxDb250ZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGluamVjdEludGwocG9seWZpbGwoQWRkTWFwU3R5bGVNb2RhbCkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBBZGRNYXBTdHlsZU1vZGFsRmFjdG9yeTtcbiJdfQ==