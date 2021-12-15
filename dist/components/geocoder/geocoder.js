"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.testForCoordinates = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _classnames = _interopRequireDefault(require("classnames"));

var _mapbox = _interopRequireDefault(require("mapbox"));

var _reactIntl = require("react-intl");

var _viewportMercatorProject = require("viewport-mercator-project");

var _keyevent = _interopRequireDefault(require("../../constants/keyevent"));

var _styledComponents2 = require("../common/styled-components");

var _icons = require("../common/icons");

var _templateObject;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// matches only valid coordinates
var COORDINATE_REGEX_STRING = '^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?),\\s*[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)';
var COORDINATE_REGEX = RegExp(COORDINATE_REGEX_STRING);
var PLACEHOLDER = 'Enter an address or coordinates, ex 37.79,-122.40';
var debounceTimeout = null;

var testForCoordinates = function testForCoordinates(query) {
  var isValid = COORDINATE_REGEX.test(query.trim());

  if (!isValid) {
    return [isValid, query];
  }

  var tokens = query.trim().split(',');
  return [isValid, Number(tokens[0]), Number(tokens[1])];
};

exports.testForCoordinates = testForCoordinates;

var StyledContainer = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  position: relative;\n  color: ", ";\n\n  .geocoder-input {\n    box-shadow: ", ";\n\n    .geocoder-input__search {\n      position: absolute;\n      height: ", "px;\n      width: 30px;\n      padding-left: 6px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: ", ";\n    }\n\n    input {\n      padding: 4px 36px;\n      height: ", "px;\n      caret-color: unset;\n    }\n  }\n\n  .geocoder-results {\n    box-shadow: ", ";\n    background-color: ", ";\n    position: absolute;\n    width: ", "px;\n    margin-top: ", "px;\n  }\n\n  .geocoder-item {\n    ", ";\n    ", ";\n\n    &.active {\n      background-color: ", ";\n    }\n  }\n\n  .remove-result {\n    position: absolute;\n    right: 16px;\n    top: 0px;\n    height: ", "px;\n    display: flex;\n    align-items: center;\n\n    :hover {\n      cursor: pointer;\n      color: ", ";\n    }\n  }\n"])), function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.boxShadow;
}, function (props) {
  return props.theme.geocoderInputHeight;
}, function (props) {
  return props.theme.subtextColor;
}, function (props) {
  return props.theme.geocoderInputHeight;
}, function (props) {
  return props.theme.boxShadow;
}, function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return Number.isFinite(props.width) ? props.width : props.theme.geocoderWidth;
}, function (props) {
  return props.theme.dropdownWapperMargin;
}, function (props) {
  return props.theme.dropdownListItem;
}, function (props) {
  return props.theme.textTruncate;
}, function (props) {
  return props.theme.dropdownListHighlightBg;
}, function (props) {
  return props.theme.geocoderInputHeight;
}, function (props) {
  return props.theme.textColorHl;
});
/** @type {import('./geocoder').GeocoderComponent} */


var GeoCoder = function GeoCoder(_ref) {
  var mapboxApiAccessToken = _ref.mapboxApiAccessToken,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      _ref$limit = _ref.limit,
      limit = _ref$limit === void 0 ? 5 : _ref$limit,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === void 0 ? 300 : _ref$timeout,
      _ref$formatItem = _ref.formatItem,
      formatItem = _ref$formatItem === void 0 ? function (item) {
    return item.place_name;
  } : _ref$formatItem,
      viewport = _ref.viewport,
      onSelected = _ref.onSelected,
      onDeleteMarker = _ref.onDeleteMarker,
      transitionDuration = _ref.transitionDuration,
      pointZoom = _ref.pointZoom,
      width = _ref.width,
      intl = _ref.intl;

  var _useState = (0, _react.useState)(''),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      inputValue = _useState2[0],
      setInputValue = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      showResults = _useState4[0],
      setShowResults = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      showDelete = _useState6[0],
      setShowDelete = _useState6[1];
  /** @type {import('./geocoder').Results} */


  var initialResults = [];

  var _useState7 = (0, _react.useState)(initialResults),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      results = _useState8[0],
      setResults = _useState8[1];

  var _useState9 = (0, _react.useState)(0),
      _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
      selectedIndex = _useState10[0],
      setSelectedIndex = _useState10[1];

  var client = (0, _react.useMemo)(function () {
    return new _mapbox["default"](mapboxApiAccessToken);
  }, [mapboxApiAccessToken]);
  var onChange = (0, _react.useCallback)(function (event) {
    var queryString = event.target.value;
    setInputValue(queryString);

    var _testForCoordinates = testForCoordinates(queryString),
        _testForCoordinates2 = (0, _slicedToArray2["default"])(_testForCoordinates, 3),
        hasValidCoordinates = _testForCoordinates2[0],
        longitude = _testForCoordinates2[1],
        latitude = _testForCoordinates2[2];

    if (hasValidCoordinates) {
      setResults([{
        center: [latitude, longitude],
        place_name: queryString
      }]);
    } else {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var response;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(limit > 0 && Boolean(queryString))) {
                  _context.next = 11;
                  break;
                }

                _context.prev = 1;
                _context.next = 4;
                return client.geocodeForward(queryString, {
                  limit: limit
                });

              case 4:
                response = _context.sent;

                if (response.entity.features) {
                  setShowResults(true);
                  setResults(response.entity.features);
                }

                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](1);
                // TODO: show geocode error
                // eslint-disable-next-line no-console
                console.log(_context.t0);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 8]]);
      })), timeout);
    }
  }, [client, limit, timeout, setResults, setShowResults]);
  var onBlur = (0, _react.useCallback)(function () {
    setTimeout(function () {
      setShowResults(false);
    }, timeout);
  }, [setShowResults, timeout]);
  var onFocus = (0, _react.useCallback)(function () {
    return setShowResults(true);
  }, [setShowResults]);
  var onItemSelected = (0, _react.useCallback)(function (item) {
    var newViewport = new _viewportMercatorProject.WebMercatorViewport(viewport);
    var bbox = item.bbox,
        center = item.center;
    newViewport = bbox ? newViewport.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]) : {
      longitude: center[0],
      latitude: center[1],
      zoom: pointZoom
    };
    var _newViewport = newViewport,
        longitude = _newViewport.longitude,
        latitude = _newViewport.latitude,
        zoom = _newViewport.zoom;
    onSelected(_objectSpread(_objectSpread({}, viewport), {
      longitude: longitude,
      latitude: latitude,
      zoom: zoom,
      transitionDuration: transitionDuration
    }), item);
    setShowResults(false);
    setInputValue(formatItem(item));
    setShowDelete(true);
  }, [viewport, onSelected, transitionDuration, pointZoom, formatItem]);
  var onMarkDeleted = (0, _react.useCallback)(function () {
    setShowDelete(false);
    setInputValue('');
    onDeleteMarker();
  }, [onDeleteMarker]);
  var onKeyDown = (0, _react.useCallback)(function (e) {
    if (!results || results.length === 0) {
      return;
    }

    switch (e.keyCode) {
      case _keyevent["default"].DOM_VK_UP:
        setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : selectedIndex);
        break;

      case _keyevent["default"].DOM_VK_DOWN:
        setSelectedIndex(selectedIndex < results.length - 1 ? selectedIndex + 1 : selectedIndex);
        break;

      case _keyevent["default"].DOM_VK_ENTER:
      case _keyevent["default"].DOM_VK_RETURN:
        if (results[selectedIndex]) {
          onItemSelected(results[selectedIndex]);
        }

        break;

      default:
        break;
    }
  }, [results, selectedIndex, setSelectedIndex, onItemSelected]);
  return /*#__PURE__*/_react["default"].createElement(StyledContainer, {
    className: className,
    width: width
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "geocoder-input"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "geocoder-input__search"
  }, /*#__PURE__*/_react["default"].createElement(_icons.Search, {
    height: "20px"
  })), /*#__PURE__*/_react["default"].createElement(_styledComponents2.Input, {
    type: "text",
    onChange: onChange,
    onBlur: onBlur,
    onFocus: onFocus,
    onKeyDown: onKeyDown,
    value: inputValue,
    placeholder: intl ? intl.formatMessage({
      id: 'geocoder.title',
      defaultMessage: PLACEHOLDER
    }) : PLACEHOLDER
  }), showDelete ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "remove-result"
  }, /*#__PURE__*/_react["default"].createElement(_icons.Delete, {
    height: "12px",
    onClick: onMarkDeleted
  })) : null), showResults ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "geocoder-results"
  }, results.map(function (item, index) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: index,
      className: (0, _classnames["default"])('geocoder-item', {
        active: selectedIndex === index
      }),
      onClick: function onClick() {
        return onItemSelected(item);
      }
    }, formatItem(item));
  })) : null);
};

var _default = (0, _reactIntl.injectIntl)(GeoCoder);

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2dlb2NvZGVyL2dlb2NvZGVyLmpzIl0sIm5hbWVzIjpbIkNPT1JESU5BVEVfUkVHRVhfU1RSSU5HIiwiQ09PUkRJTkFURV9SRUdFWCIsIlJlZ0V4cCIsIlBMQUNFSE9MREVSIiwiZGVib3VuY2VUaW1lb3V0IiwidGVzdEZvckNvb3JkaW5hdGVzIiwicXVlcnkiLCJpc1ZhbGlkIiwidGVzdCIsInRyaW0iLCJ0b2tlbnMiLCJzcGxpdCIsIk51bWJlciIsIlN0eWxlZENvbnRhaW5lciIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJ0ZXh0Q29sb3IiLCJib3hTaGFkb3ciLCJnZW9jb2RlcklucHV0SGVpZ2h0Iiwic3VidGV4dENvbG9yIiwicGFuZWxCYWNrZ3JvdW5kIiwiaXNGaW5pdGUiLCJ3aWR0aCIsImdlb2NvZGVyV2lkdGgiLCJkcm9wZG93bldhcHBlck1hcmdpbiIsImRyb3Bkb3duTGlzdEl0ZW0iLCJ0ZXh0VHJ1bmNhdGUiLCJkcm9wZG93bkxpc3RIaWdobGlnaHRCZyIsInRleHRDb2xvckhsIiwiR2VvQ29kZXIiLCJtYXBib3hBcGlBY2Nlc3NUb2tlbiIsImNsYXNzTmFtZSIsImxpbWl0IiwidGltZW91dCIsImZvcm1hdEl0ZW0iLCJpdGVtIiwicGxhY2VfbmFtZSIsInZpZXdwb3J0Iiwib25TZWxlY3RlZCIsIm9uRGVsZXRlTWFya2VyIiwidHJhbnNpdGlvbkR1cmF0aW9uIiwicG9pbnRab29tIiwiaW50bCIsImlucHV0VmFsdWUiLCJzZXRJbnB1dFZhbHVlIiwic2hvd1Jlc3VsdHMiLCJzZXRTaG93UmVzdWx0cyIsInNob3dEZWxldGUiLCJzZXRTaG93RGVsZXRlIiwiaW5pdGlhbFJlc3VsdHMiLCJyZXN1bHRzIiwic2V0UmVzdWx0cyIsInNlbGVjdGVkSW5kZXgiLCJzZXRTZWxlY3RlZEluZGV4IiwiY2xpZW50IiwiTWFwYm94Q2xpZW50Iiwib25DaGFuZ2UiLCJldmVudCIsInF1ZXJ5U3RyaW5nIiwidGFyZ2V0IiwidmFsdWUiLCJoYXNWYWxpZENvb3JkaW5hdGVzIiwibG9uZ2l0dWRlIiwibGF0aXR1ZGUiLCJjZW50ZXIiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiQm9vbGVhbiIsImdlb2NvZGVGb3J3YXJkIiwicmVzcG9uc2UiLCJlbnRpdHkiLCJmZWF0dXJlcyIsImNvbnNvbGUiLCJsb2ciLCJvbkJsdXIiLCJvbkZvY3VzIiwib25JdGVtU2VsZWN0ZWQiLCJuZXdWaWV3cG9ydCIsIldlYk1lcmNhdG9yVmlld3BvcnQiLCJiYm94IiwiZml0Qm91bmRzIiwiem9vbSIsIm9uTWFya0RlbGV0ZWQiLCJvbktleURvd24iLCJlIiwibGVuZ3RoIiwia2V5Q29kZSIsIktleUV2ZW50IiwiRE9NX1ZLX1VQIiwiRE9NX1ZLX0RPV04iLCJET01fVktfRU5URVIiLCJET01fVktfUkVUVVJOIiwiZm9ybWF0TWVzc2FnZSIsImlkIiwiZGVmYXVsdE1lc3NhZ2UiLCJtYXAiLCJpbmRleCIsImFjdGl2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBO0FBQ0EsSUFBTUEsdUJBQXVCLEdBQzNCLG1HQURGO0FBRUEsSUFBTUMsZ0JBQWdCLEdBQUdDLE1BQU0sQ0FBQ0YsdUJBQUQsQ0FBL0I7QUFFQSxJQUFNRyxXQUFXLEdBQUcsbURBQXBCO0FBRUEsSUFBSUMsZUFBZSxHQUFHLElBQXRCOztBQUVPLElBQU1DLGtCQUFrQixHQUFHLFNBQXJCQSxrQkFBcUIsQ0FBQUMsS0FBSyxFQUFJO0FBQ3pDLE1BQU1DLE9BQU8sR0FBR04sZ0JBQWdCLENBQUNPLElBQWpCLENBQXNCRixLQUFLLENBQUNHLElBQU4sRUFBdEIsQ0FBaEI7O0FBRUEsTUFBSSxDQUFDRixPQUFMLEVBQWM7QUFDWixXQUFPLENBQUNBLE9BQUQsRUFBVUQsS0FBVixDQUFQO0FBQ0Q7O0FBRUQsTUFBTUks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Q0FMYixDQURXO0FBQUEsR0FBWixDQURILENBRFUsR0FZUixJQXJDTixDQURGO0FBeUNELENBaEtEOztlQWtLZSwyQkFBV04sUUFBWCxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7dXNlQ2FsbGJhY2ssIHVzZU1lbW8sIHVzZVN0YXRlfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IE1hcGJveENsaWVudCBmcm9tICdtYXBib3gnO1xuaW1wb3J0IHtpbmplY3RJbnRsfSBmcm9tICdyZWFjdC1pbnRsJztcbmltcG9ydCB7V2ViTWVyY2F0b3JWaWV3cG9ydH0gZnJvbSAndmlld3BvcnQtbWVyY2F0b3ItcHJvamVjdCc7XG5pbXBvcnQgS2V5RXZlbnQgZnJvbSAnY29uc3RhbnRzL2tleWV2ZW50JztcbmltcG9ydCB7SW5wdXR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7U2VhcmNoLCBEZWxldGV9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcblxuLy8gbWF0Y2hlcyBvbmx5IHZhbGlkIGNvb3JkaW5hdGVzXG5jb25zdCBDT09SRElOQVRFX1JFR0VYX1NUUklORyA9XG4gICdeWy0rXT8oWzEtOF0/XFxcXGQoXFxcXC5cXFxcZCspP3w5MChcXFxcLjArKT8pLFxcXFxzKlstK10/KDE4MChcXFxcLjArKT98KCgxWzAtN11cXFxcZCl8KFsxLTldP1xcXFxkKSkoXFxcXC5cXFxcZCspPyknO1xuY29uc3QgQ09PUkRJTkFURV9SRUdFWCA9IFJlZ0V4cChDT09SRElOQVRFX1JFR0VYX1NUUklORyk7XG5cbmNvbnN0IFBMQUNFSE9MREVSID0gJ0VudGVyIGFuIGFkZHJlc3Mgb3IgY29vcmRpbmF0ZXMsIGV4IDM3Ljc5LC0xMjIuNDAnO1xuXG5sZXQgZGVib3VuY2VUaW1lb3V0ID0gbnVsbDtcblxuZXhwb3J0IGNvbnN0IHRlc3RGb3JDb29yZGluYXRlcyA9IHF1ZXJ5ID0+IHtcbiAgY29uc3QgaXNWYWxpZCA9IENPT1JESU5BVEVfUkVHRVgudGVzdChxdWVyeS50cmltKCkpO1xuXG4gIGlmICghaXNWYWxpZCkge1xuICAgIHJldHVybiBbaXNWYWxpZCwgcXVlcnldO1xuICB9XG5cbiAgY29uc3QgdG9rZW5zID0gcXVlcnkudHJpbSgpLnNwbGl0KCcsJyk7XG5cbiAgcmV0dXJuIFtpc1ZhbGlkLCBOdW1iZXIodG9rZW5zWzBdKSwgTnVtYmVyKHRva2Vuc1sxXSldO1xufTtcblxuY29uc3QgU3R5bGVkQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuXG4gIC5nZW9jb2Rlci1pbnB1dCB7XG4gICAgYm94LXNoYWRvdzogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5ib3hTaGFkb3d9O1xuXG4gICAgLmdlb2NvZGVyLWlucHV0X19zZWFyY2gge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgaGVpZ2h0OiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmdlb2NvZGVySW5wdXRIZWlnaHR9cHg7XG4gICAgICB3aWR0aDogMzBweDtcbiAgICAgIHBhZGRpbmctbGVmdDogNnB4O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnN1YnRleHRDb2xvcn07XG4gICAgfVxuXG4gICAgaW5wdXQge1xuICAgICAgcGFkZGluZzogNHB4IDM2cHg7XG4gICAgICBoZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZ2VvY29kZXJJbnB1dEhlaWdodH1weDtcbiAgICAgIGNhcmV0LWNvbG9yOiB1bnNldDtcbiAgICB9XG4gIH1cblxuICAuZ2VvY29kZXItcmVzdWx0cyB7XG4gICAgYm94LXNoYWRvdzogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5ib3hTaGFkb3d9O1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kfTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgd2lkdGg6ICR7cHJvcHMgPT4gKE51bWJlci5pc0Zpbml0ZShwcm9wcy53aWR0aCkgPyBwcm9wcy53aWR0aCA6IHByb3BzLnRoZW1lLmdlb2NvZGVyV2lkdGgpfXB4O1xuICAgIG1hcmdpbi10b3A6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25XYXBwZXJNYXJnaW59cHg7XG4gIH1cblxuICAuZ2VvY29kZXItaXRlbSB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5kcm9wZG93bkxpc3RJdGVtfTtcbiAgICAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRUcnVuY2F0ZX07XG5cbiAgICAmLmFjdGl2ZSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmRyb3Bkb3duTGlzdEhpZ2hsaWdodEJnfTtcbiAgICB9XG4gIH1cblxuICAucmVtb3ZlLXJlc3VsdCB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHJpZ2h0OiAxNnB4O1xuICAgIHRvcDogMHB4O1xuICAgIGhlaWdodDogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5nZW9jb2RlcklucHV0SGVpZ2h0fXB4O1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgIDpob3ZlciB7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgfVxuICB9XG5gO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9nZW9jb2RlcicpLkdlb2NvZGVyQ29tcG9uZW50fSAqL1xuY29uc3QgR2VvQ29kZXIgPSAoe1xuICBtYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgY2xhc3NOYW1lID0gJycsXG4gIGxpbWl0ID0gNSxcbiAgdGltZW91dCA9IDMwMCxcbiAgZm9ybWF0SXRlbSA9IGl0ZW0gPT4gaXRlbS5wbGFjZV9uYW1lLFxuICB2aWV3cG9ydCxcbiAgb25TZWxlY3RlZCxcbiAgb25EZWxldGVNYXJrZXIsXG4gIHRyYW5zaXRpb25EdXJhdGlvbixcbiAgcG9pbnRab29tLFxuICB3aWR0aCxcbiAgaW50bFxufSkgPT4ge1xuICBjb25zdCBbaW5wdXRWYWx1ZSwgc2V0SW5wdXRWYWx1ZV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtzaG93UmVzdWx0cywgc2V0U2hvd1Jlc3VsdHNdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbc2hvd0RlbGV0ZSwgc2V0U2hvd0RlbGV0ZV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIC8qKiBAdHlwZSB7aW1wb3J0KCcuL2dlb2NvZGVyJykuUmVzdWx0c30gKi9cbiAgY29uc3QgaW5pdGlhbFJlc3VsdHMgPSBbXTtcbiAgY29uc3QgW3Jlc3VsdHMsIHNldFJlc3VsdHNdID0gdXNlU3RhdGUoaW5pdGlhbFJlc3VsdHMpO1xuICBjb25zdCBbc2VsZWN0ZWRJbmRleCwgc2V0U2VsZWN0ZWRJbmRleF0gPSB1c2VTdGF0ZSgwKTtcblxuICBjb25zdCBjbGllbnQgPSB1c2VNZW1vKCgpID0+IG5ldyBNYXBib3hDbGllbnQobWFwYm94QXBpQWNjZXNzVG9rZW4pLCBbbWFwYm94QXBpQWNjZXNzVG9rZW5dKTtcblxuICBjb25zdCBvbkNoYW5nZSA9IHVzZUNhbGxiYWNrKFxuICAgIGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0IHF1ZXJ5U3RyaW5nID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgc2V0SW5wdXRWYWx1ZShxdWVyeVN0cmluZyk7XG4gICAgICBjb25zdCBbaGFzVmFsaWRDb29yZGluYXRlcywgbG9uZ2l0dWRlLCBsYXRpdHVkZV0gPSB0ZXN0Rm9yQ29vcmRpbmF0ZXMocXVlcnlTdHJpbmcpO1xuICAgICAgaWYgKGhhc1ZhbGlkQ29vcmRpbmF0ZXMpIHtcbiAgICAgICAgc2V0UmVzdWx0cyhbe2NlbnRlcjogW2xhdGl0dWRlLCBsb25naXR1ZGVdLCBwbGFjZV9uYW1lOiBxdWVyeVN0cmluZ31dKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNsZWFyVGltZW91dChkZWJvdW5jZVRpbWVvdXQpO1xuICAgICAgICBkZWJvdW5jZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgICAgICBpZiAobGltaXQgPiAwICYmIEJvb2xlYW4ocXVlcnlTdHJpbmcpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNsaWVudC5nZW9jb2RlRm9yd2FyZChxdWVyeVN0cmluZywge2xpbWl0fSk7XG4gICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lbnRpdHkuZmVhdHVyZXMpIHtcbiAgICAgICAgICAgICAgICBzZXRTaG93UmVzdWx0cyh0cnVlKTtcbiAgICAgICAgICAgICAgICBzZXRSZXN1bHRzKHJlc3BvbnNlLmVudGl0eS5mZWF0dXJlcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgLy8gVE9ETzogc2hvdyBnZW9jb2RlIGVycm9yXG4gICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBbY2xpZW50LCBsaW1pdCwgdGltZW91dCwgc2V0UmVzdWx0cywgc2V0U2hvd1Jlc3VsdHNdXG4gICk7XG5cbiAgY29uc3Qgb25CbHVyID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2V0U2hvd1Jlc3VsdHMoZmFsc2UpO1xuICAgIH0sIHRpbWVvdXQpO1xuICB9LCBbc2V0U2hvd1Jlc3VsdHMsIHRpbWVvdXRdKTtcblxuICBjb25zdCBvbkZvY3VzID0gdXNlQ2FsbGJhY2soKCkgPT4gc2V0U2hvd1Jlc3VsdHModHJ1ZSksIFtzZXRTaG93UmVzdWx0c10pO1xuXG4gIGNvbnN0IG9uSXRlbVNlbGVjdGVkID0gdXNlQ2FsbGJhY2soXG4gICAgaXRlbSA9PiB7XG4gICAgICBsZXQgbmV3Vmlld3BvcnQgPSBuZXcgV2ViTWVyY2F0b3JWaWV3cG9ydCh2aWV3cG9ydCk7XG4gICAgICBjb25zdCB7YmJveCwgY2VudGVyfSA9IGl0ZW07XG5cbiAgICAgIG5ld1ZpZXdwb3J0ID0gYmJveFxuICAgICAgICA/IG5ld1ZpZXdwb3J0LmZpdEJvdW5kcyhbXG4gICAgICAgICAgICBbYmJveFswXSwgYmJveFsxXV0sXG4gICAgICAgICAgICBbYmJveFsyXSwgYmJveFszXV1cbiAgICAgICAgICBdKVxuICAgICAgICA6IHtcbiAgICAgICAgICAgIGxvbmdpdHVkZTogY2VudGVyWzBdLFxuICAgICAgICAgICAgbGF0aXR1ZGU6IGNlbnRlclsxXSxcbiAgICAgICAgICAgIHpvb206IHBvaW50Wm9vbVxuICAgICAgICAgIH07XG5cbiAgICAgIGNvbnN0IHtsb25naXR1ZGUsIGxhdGl0dWRlLCB6b29tfSA9IG5ld1ZpZXdwb3J0O1xuXG4gICAgICBvblNlbGVjdGVkKHsuLi52aWV3cG9ydCwgLi4ue2xvbmdpdHVkZSwgbGF0aXR1ZGUsIHpvb20sIHRyYW5zaXRpb25EdXJhdGlvbn19LCBpdGVtKTtcblxuICAgICAgc2V0U2hvd1Jlc3VsdHMoZmFsc2UpO1xuICAgICAgc2V0SW5wdXRWYWx1ZShmb3JtYXRJdGVtKGl0ZW0pKTtcbiAgICAgIHNldFNob3dEZWxldGUodHJ1ZSk7XG4gICAgfSxcbiAgICBbdmlld3BvcnQsIG9uU2VsZWN0ZWQsIHRyYW5zaXRpb25EdXJhdGlvbiwgcG9pbnRab29tLCBmb3JtYXRJdGVtXVxuICApO1xuXG4gIGNvbnN0IG9uTWFya0RlbGV0ZWQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc2V0U2hvd0RlbGV0ZShmYWxzZSk7XG4gICAgc2V0SW5wdXRWYWx1ZSgnJyk7XG4gICAgb25EZWxldGVNYXJrZXIoKTtcbiAgfSwgW29uRGVsZXRlTWFya2VyXSk7XG5cbiAgY29uc3Qgb25LZXlEb3duID0gdXNlQ2FsbGJhY2soXG4gICAgZSA9PiB7XG4gICAgICBpZiAoIXJlc3VsdHMgfHwgcmVzdWx0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgY2FzZSBLZXlFdmVudC5ET01fVktfVVA6XG4gICAgICAgICAgc2V0U2VsZWN0ZWRJbmRleChzZWxlY3RlZEluZGV4ID4gMCA/IHNlbGVjdGVkSW5kZXggLSAxIDogc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS2V5RXZlbnQuRE9NX1ZLX0RPV046XG4gICAgICAgICAgc2V0U2VsZWN0ZWRJbmRleChzZWxlY3RlZEluZGV4IDwgcmVzdWx0cy5sZW5ndGggLSAxID8gc2VsZWN0ZWRJbmRleCArIDEgOiBzZWxlY3RlZEluZGV4KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXlFdmVudC5ET01fVktfRU5URVI6XG4gICAgICAgIGNhc2UgS2V5RXZlbnQuRE9NX1ZLX1JFVFVSTjpcbiAgICAgICAgICBpZiAocmVzdWx0c1tzZWxlY3RlZEluZGV4XSkge1xuICAgICAgICAgICAgb25JdGVtU2VsZWN0ZWQocmVzdWx0c1tzZWxlY3RlZEluZGV4XSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0sXG4gICAgW3Jlc3VsdHMsIHNlbGVjdGVkSW5kZXgsIHNldFNlbGVjdGVkSW5kZXgsIG9uSXRlbVNlbGVjdGVkXVxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPFN0eWxlZENvbnRhaW5lciBjbGFzc05hbWU9e2NsYXNzTmFtZX0gd2lkdGg9e3dpZHRofT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VvY29kZXItaW5wdXRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnZW9jb2Rlci1pbnB1dF9fc2VhcmNoXCI+XG4gICAgICAgICAgPFNlYXJjaCBoZWlnaHQ9XCIyMHB4XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgb25CbHVyPXtvbkJsdXJ9XG4gICAgICAgICAgb25Gb2N1cz17b25Gb2N1c31cbiAgICAgICAgICBvbktleURvd249e29uS2V5RG93bn1cbiAgICAgICAgICB2YWx1ZT17aW5wdXRWYWx1ZX1cbiAgICAgICAgICBwbGFjZWhvbGRlcj17XG4gICAgICAgICAgICBpbnRsXG4gICAgICAgICAgICAgID8gaW50bC5mb3JtYXRNZXNzYWdlKHtpZDogJ2dlb2NvZGVyLnRpdGxlJywgZGVmYXVsdE1lc3NhZ2U6IFBMQUNFSE9MREVSfSlcbiAgICAgICAgICAgICAgOiBQTEFDRUhPTERFUlxuICAgICAgICAgIH1cbiAgICAgICAgLz5cbiAgICAgICAge3Nob3dEZWxldGUgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZW1vdmUtcmVzdWx0XCI+XG4gICAgICAgICAgICA8RGVsZXRlIGhlaWdodD1cIjEycHhcIiBvbkNsaWNrPXtvbk1hcmtEZWxldGVkfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7c2hvd1Jlc3VsdHMgPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2VvY29kZXItcmVzdWx0c1wiPlxuICAgICAgICAgIHtyZXN1bHRzLm1hcCgoaXRlbSwgaW5kZXgpID0+IChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdnZW9jb2Rlci1pdGVtJywge2FjdGl2ZTogc2VsZWN0ZWRJbmRleCA9PT0gaW5kZXh9KX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25JdGVtU2VsZWN0ZWQoaXRlbSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtmb3JtYXRJdGVtKGl0ZW0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IG51bGx9XG4gICAgPC9TdHlsZWRDb250YWluZXI+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbmplY3RJbnRsKEdlb0NvZGVyKTtcbiJdfQ==