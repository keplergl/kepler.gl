"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = GeocoderPanelFactory;
exports.GeocoderPanel = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

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

var _styledComponents2 = require("./common/styled-components");

var _reactIntl = require("react-intl");

var _reactMapboxGlGeocoder = _interopRequireDefault(require("react-mapbox-gl-geocoder"));

var _processors = _interopRequireDefault(require("../processors"));

var _actions = require("../actions");

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  font-size: ", ";\n\n  .react-geocoder {\n    position: relative;\n  }\n\n  .react-geocoder input {\n    ", ";\n  }\n\n  .react-geocoder-results {\n    background-color: ", ";\n    position: absolute;\n    width: 43.5em;\n  }\n\n  .react-geocoder-item {\n    ", ";\n    ", ";\n  }\n\n  .remove-layer {\n    background: transparent;\n    border: none;\n    bottom: 28px;\n    color: ", ";\n    cursor: pointer;\n    display: inline;\n    font-size: 16px;\n    padding: 2px 8px;\n    position: absolute;\n    right: 16px;\n\n    :hover,\n    :focus,\n    :active {\n      background: transparent !important;\n      border: none;\n      box-shadow: 0;\n      color: ", ";\n      opacity: 0.6;\n      outline: none;\n    }\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  padding: 0.5em 1em;\n  position: absolute;\n  top: 20px;\n  left: 50%;\n  margin-left: -20em;\n  width: 40em;\n  box-sizing: border-box;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var GEOCODER_DATASET_NAME = 'geocoder_dataset';
var QUERY_PARAMS = {};
var GEO_OFFSET = 0.1;
var ICON_LAYER = {
  id: 'geocoder_layer',
  type: 'icon',
  config: {
    label: 'Geocoder Layer',
    color: [255, 0, 0],
    dataId: GEOCODER_DATASET_NAME,
    columns: {
      lat: 'lt',
      lng: 'ln',
      icon: 'icon',
      label: 'text'
    },
    isVisible: true,
    hidden: true,
    visConfig: {
      radius: 80
    }
  }
};

var GeocoderPanelContent = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.panelBackground;
});

var GeocoderWrapper = _styledComponents["default"].div(_templateObject2(), function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.fontSize;
}, function (props) {
  return props.theme.secondaryInput;
}, function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return props.theme.dropdownListItem;
}, function (props) {
  return props.theme.textTruncate;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.textColor;
});

function generateGeocoderDataset(lat, lon, text) {
  return {
    data: _processors["default"].processRowObject([{
      lt: lat,
      ln: lon,
      icon: 'place',
      text: text
    }]),
    id: GEOCODER_DATASET_NAME,
    info: {
      hidden: true,
      id: GEOCODER_DATASET_NAME,
      label: GEOCODER_DATASET_NAME
    }
  };
}

function isValid(key) {
  return /pk\..*\..*/.test(key);
}

var GeocoderPanel =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(GeocoderPanel, _Component);

  function GeocoderPanel() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, GeocoderPanel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(GeocoderPanel)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
      selectedGeoItem: null
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onSelected", function () {
      var viewport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var geoItem = arguments.length > 1 ? arguments[1] : undefined;

      var _geoItem$center = (0, _slicedToArray2["default"])(geoItem.center, 2),
          lon = _geoItem$center[0],
          lat = _geoItem$center[1],
          text = geoItem.text,
          bbox = geoItem.bbox;

      _this.removeGeocoderDataset();

      _this.props.dispatch((0, _actions.addDataToMap)({
        datasets: [generateGeocoderDataset(lat, lon, text)],
        options: {
          keepExistingConfig: true
        },
        config: {
          version: 'v1',
          config: {
            visState: {
              layers: [ICON_LAYER]
            }
          }
        }
      }));

      _this.props.dispatch((0, _actions.fitBounds)(bbox || [lon - GEO_OFFSET, lat - GEO_OFFSET, lon + GEO_OFFSET, lat + GEO_OFFSET]));

      _this.setState({
        selectedGeoItem: geoItem
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "removeMarker", function () {
      _this.setState({
        selectedGeoItem: null
      });

      _this.removeGeocoderDataset();
    });
    return _this;
  }

  (0, _createClass2["default"])(GeocoderPanel, [{
    key: "removeGeocoderDataset",
    value: function removeGeocoderDataset() {
      this.props.dispatch((0, _actions.removeDataset)(GEOCODER_DATASET_NAME));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          isGeocoderEnabled = _this$props.isGeocoderEnabled,
          mapboxApiAccessToken = _this$props.mapboxApiAccessToken;
      return _react["default"].createElement(GeocoderPanelContent, {
        className: "geocoder-panel",
        style: {
          display: isGeocoderEnabled ? 'block' : 'none'
        }
      }, _react["default"].createElement(_styledComponents2.SidePanelSection, null, _react["default"].createElement(_styledComponents2.PanelLabel, null, _react["default"].createElement(_reactIntl.FormattedMessage, {
        id: 'geocoder.title'
      })), _react["default"].createElement(GeocoderWrapper, null, isValid(mapboxApiAccessToken) && _react["default"].createElement(_reactMapboxGlGeocoder["default"], {
        mapboxApiAccessToken: mapboxApiAccessToken,
        onSelected: this.onSelected,
        hideOnSelect: true,
        pointZoom: 15,
        viewport: {},
        queryParams: QUERY_PARAMS
      }), this.state.selectedGeoItem && _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-primary remove-layer",
        onClick: this.removeMarker,
        title: "Remove marker"
      }, "\xD7"))));
    }
  }]);
  return GeocoderPanel;
}(_react.Component);

exports.GeocoderPanel = GeocoderPanel;
(0, _defineProperty2["default"])(GeocoderPanel, "propTypes", {
  isGeocoderEnabled: _propTypes["default"].bool.isRequired,
  mapboxApiAccessToken: _propTypes["default"].string.isRequired
});

function GeocoderPanelFactory() {
  return GeocoderPanel;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL2dlb2NvZGVyLXBhbmVsLmpzIl0sIm5hbWVzIjpbIkdFT0NPREVSX0RBVEFTRVRfTkFNRSIsIlFVRVJZX1BBUkFNUyIsIkdFT19PRkZTRVQiLCJJQ09OX0xBWUVSIiwiaWQiLCJ0eXBlIiwiY29uZmlnIiwibGFiZWwiLCJjb2xvciIsImRhdGFJZCIsImNvbHVtbnMiLCJsYXQiLCJsbmciLCJpY29uIiwiaXNWaXNpYmxlIiwiaGlkZGVuIiwidmlzQ29uZmlnIiwicmFkaXVzIiwiR2VvY29kZXJQYW5lbENvbnRlbnQiLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwicGFuZWxCYWNrZ3JvdW5kIiwiR2VvY29kZXJXcmFwcGVyIiwidGV4dENvbG9yIiwiZm9udFNpemUiLCJzZWNvbmRhcnlJbnB1dCIsImRyb3Bkb3duTGlzdEl0ZW0iLCJ0ZXh0VHJ1bmNhdGUiLCJnZW5lcmF0ZUdlb2NvZGVyRGF0YXNldCIsImxvbiIsInRleHQiLCJkYXRhIiwiUHJvY2Vzc29ycyIsInByb2Nlc3NSb3dPYmplY3QiLCJsdCIsImxuIiwiaW5mbyIsImlzVmFsaWQiLCJrZXkiLCJ0ZXN0IiwiR2VvY29kZXJQYW5lbCIsInNlbGVjdGVkR2VvSXRlbSIsInZpZXdwb3J0IiwiZ2VvSXRlbSIsImNlbnRlciIsImJib3giLCJyZW1vdmVHZW9jb2RlckRhdGFzZXQiLCJkaXNwYXRjaCIsImRhdGFzZXRzIiwib3B0aW9ucyIsImtlZXBFeGlzdGluZ0NvbmZpZyIsInZlcnNpb24iLCJ2aXNTdGF0ZSIsImxheWVycyIsInNldFN0YXRlIiwiaXNHZW9jb2RlckVuYWJsZWQiLCJtYXBib3hBcGlBY2Nlc3NUb2tlbiIsImRpc3BsYXkiLCJvblNlbGVjdGVkIiwic3RhdGUiLCJyZW1vdmVNYXJrZXIiLCJDb21wb25lbnQiLCJQcm9wVHlwZXMiLCJib29sIiwiaXNSZXF1aXJlZCIsInN0cmluZyIsIkdlb2NvZGVyUGFuZWxGYWN0b3J5Il0sIm1hcHBp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QmUsRUFBQUEsaUJBQWlCLEVBQUVPLHNCQUFVQyxJQUFWLENBQWVDLFVBRGpCO0FBRWpCUixFQUFBQSxvQkFBb0IsRUFBRU0sc0JBQVVHLE1BQVYsQ0FBaUJEO0FBRnRCLEM7O0FBMEZOLFNBQVNFLG9CQUFULEdBQWdDO0FBQzdDLFNBQU8xQixhQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7U2lkZVBhbmVsU2VjdGlvbiwgUGFuZWxMYWJlbH0gZnJvbSAnLi9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtGb3JtYXR0ZWRNZXNzYWdlfSBmcm9tICdyZWFjdC1pbnRsJztcbmltcG9ydCBHZW9jb2RlciBmcm9tICdyZWFjdC1tYXBib3gtZ2wtZ2VvY29kZXInO1xuaW1wb3J0IFByb2Nlc3NvcnMgZnJvbSAncHJvY2Vzc29ycyc7XG5pbXBvcnQge2ZpdEJvdW5kcywgYWRkRGF0YVRvTWFwLCByZW1vdmVEYXRhc2V0fSBmcm9tICdhY3Rpb25zJztcblxuY29uc3QgR0VPQ09ERVJfREFUQVNFVF9OQU1FID0gJ2dlb2NvZGVyX2RhdGFzZXQnO1xuY29uc3QgUVVFUllfUEFSQU1TID0ge307XG5jb25zdCBHRU9fT0ZGU0VUID0gMC4xO1xuY29uc3QgSUNPTl9MQVlFUiA9IHtcbiAgaWQ6ICdnZW9jb2Rlcl9sYXllcicsXG4gIHR5cGU6ICdpY29uJyxcbiAgY29uZmlnOiB7XG4gICAgbGFiZWw6ICdHZW9jb2RlciBMYXllcicsXG4gICAgY29sb3I6IFsyNTUsIDAsIDBdLFxuICAgIGRhdGFJZDogR0VPQ09ERVJfREFUQVNFVF9OQU1FLFxuICAgIGNvbHVtbnM6IHtcbiAgICAgIGxhdDogJ2x0JyxcbiAgICAgIGxuZzogJ2xuJyxcbiAgICAgIGljb246ICdpY29uJyxcbiAgICAgIGxhYmVsOiAndGV4dCdcbiAgICB9LFxuICAgIGlzVmlzaWJsZTogdHJ1ZSxcbiAgICBoaWRkZW46IHRydWUsXG4gICAgdmlzQ29uZmlnOiB7XG4gICAgICByYWRpdXM6IDgwXG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBHZW9jb2RlclBhbmVsQ29udGVudCA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQtY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUucGFuZWxCYWNrZ3JvdW5kfTtcbiAgcGFkZGluZzogMC41ZW0gMWVtO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMjBweDtcbiAgbGVmdDogNTAlO1xuICBtYXJnaW4tbGVmdDogLTIwZW07XG4gIHdpZHRoOiA0MGVtO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuYDtcblxuY29uc3QgR2VvY29kZXJXcmFwcGVyID0gc3R5bGVkLmRpdmBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgZm9udC1zaXplOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmZvbnRTaXplfTtcblxuICAucmVhY3QtZ2VvY29kZXIge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgfVxuXG4gIC5yZWFjdC1nZW9jb2RlciBpbnB1dCB7XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5zZWNvbmRhcnlJbnB1dH07XG4gIH1cblxuICAucmVhY3QtZ2VvY29kZXItcmVzdWx0cyB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wYW5lbEJhY2tncm91bmR9O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB3aWR0aDogNDMuNWVtO1xuICB9XG5cbiAgLnJlYWN0LWdlb2NvZGVyLWl0ZW0ge1xuICAgICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuZHJvcGRvd25MaXN0SXRlbX07XG4gICAgJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0VHJ1bmNhdGV9O1xuICB9XG5cbiAgLnJlbW92ZS1sYXllciB7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGJvdHRvbTogMjhweDtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3J9O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBkaXNwbGF5OiBpbmxpbmU7XG4gICAgZm9udC1zaXplOiAxNnB4O1xuICAgIHBhZGRpbmc6IDJweCA4cHg7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHJpZ2h0OiAxNnB4O1xuXG4gICAgOmhvdmVyLFxuICAgIDpmb2N1cyxcbiAgICA6YWN0aXZlIHtcbiAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gICAgICBib3JkZXI6IG5vbmU7XG4gICAgICBib3gtc2hhZG93OiAwO1xuICAgICAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGV4dENvbG9yfTtcbiAgICAgIG9wYWNpdHk6IDAuNjtcbiAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgfVxuICB9XG5gO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUdlb2NvZGVyRGF0YXNldChsYXQsIGxvbiwgdGV4dCkge1xuICByZXR1cm4ge1xuICAgIGRhdGE6IFByb2Nlc3NvcnMucHJvY2Vzc1Jvd09iamVjdChbXG4gICAgICB7XG4gICAgICAgIGx0OiBsYXQsXG4gICAgICAgIGxuOiBsb24sXG4gICAgICAgIGljb246ICdwbGFjZScsXG4gICAgICAgIHRleHRcbiAgICAgIH1cbiAgICBdKSxcbiAgICBpZDogR0VPQ09ERVJfREFUQVNFVF9OQU1FLFxuICAgIGluZm86IHtcbiAgICAgIGhpZGRlbjogdHJ1ZSxcbiAgICAgIGlkOiBHRU9DT0RFUl9EQVRBU0VUX05BTUUsXG4gICAgICBsYWJlbDogR0VPQ09ERVJfREFUQVNFVF9OQU1FXG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkKGtleSkge1xuICByZXR1cm4gL3BrXFwuLipcXC4uKi8udGVzdChrZXkpO1xufVxuXG5leHBvcnQgY2xhc3MgR2VvY29kZXJQYW5lbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgaXNHZW9jb2RlckVuYWJsZWQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgbWFwYm94QXBpQWNjZXNzVG9rZW46IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZFxuICB9O1xuXG4gIHN0YXRlID0ge1xuICAgIHNlbGVjdGVkR2VvSXRlbTogbnVsbFxuICB9O1xuXG4gIHJlbW92ZUdlb2NvZGVyRGF0YXNldCgpIHtcbiAgICB0aGlzLnByb3BzLmRpc3BhdGNoKHJlbW92ZURhdGFzZXQoR0VPQ09ERVJfREFUQVNFVF9OQU1FKSk7XG4gIH1cblxuICBvblNlbGVjdGVkID0gKHZpZXdwb3J0ID0gbnVsbCwgZ2VvSXRlbSkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGNlbnRlcjogW2xvbiwgbGF0XSxcbiAgICAgIHRleHQsXG4gICAgICBiYm94XG4gICAgfSA9IGdlb0l0ZW07XG4gICAgdGhpcy5yZW1vdmVHZW9jb2RlckRhdGFzZXQoKTtcbiAgICB0aGlzLnByb3BzLmRpc3BhdGNoKFxuICAgICAgYWRkRGF0YVRvTWFwKHtcbiAgICAgICAgZGF0YXNldHM6IFtnZW5lcmF0ZUdlb2NvZGVyRGF0YXNldChsYXQsIGxvbiwgdGV4dCldLFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAga2VlcEV4aXN0aW5nQ29uZmlnOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIHZlcnNpb246ICd2MScsXG4gICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICB2aXNTdGF0ZToge1xuICAgICAgICAgICAgICBsYXllcnM6IFtJQ09OX0xBWUVSXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMucHJvcHMuZGlzcGF0Y2goXG4gICAgICBmaXRCb3VuZHMoYmJveCB8fCBbbG9uIC0gR0VPX09GRlNFVCwgbGF0IC0gR0VPX09GRlNFVCwgbG9uICsgR0VPX09GRlNFVCwgbGF0ICsgR0VPX09GRlNFVF0pXG4gICAgKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkR2VvSXRlbTogZ2VvSXRlbVxuICAgIH0pO1xuICB9O1xuXG4gIHJlbW92ZU1hcmtlciA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkR2VvSXRlbTogbnVsbFxuICAgIH0pO1xuICAgIHRoaXMucmVtb3ZlR2VvY29kZXJEYXRhc2V0KCk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtpc0dlb2NvZGVyRW5hYmxlZCwgbWFwYm94QXBpQWNjZXNzVG9rZW59ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPEdlb2NvZGVyUGFuZWxDb250ZW50XG4gICAgICAgIGNsYXNzTmFtZT1cImdlb2NvZGVyLXBhbmVsXCJcbiAgICAgICAgc3R5bGU9e3tkaXNwbGF5OiBpc0dlb2NvZGVyRW5hYmxlZCA/ICdibG9jaycgOiAnbm9uZSd9fVxuICAgICAgPlxuICAgICAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgICAgICA8UGFuZWxMYWJlbD5cbiAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXsnZ2VvY29kZXIudGl0bGUnfSAvPlxuICAgICAgICAgIDwvUGFuZWxMYWJlbD5cbiAgICAgICAgICA8R2VvY29kZXJXcmFwcGVyPlxuICAgICAgICAgICAge2lzVmFsaWQobWFwYm94QXBpQWNjZXNzVG9rZW4pICYmIChcbiAgICAgICAgICAgICAgPEdlb2NvZGVyXG4gICAgICAgICAgICAgICAgbWFwYm94QXBpQWNjZXNzVG9rZW49e21hcGJveEFwaUFjY2Vzc1Rva2VufVxuICAgICAgICAgICAgICAgIG9uU2VsZWN0ZWQ9e3RoaXMub25TZWxlY3RlZH1cbiAgICAgICAgICAgICAgICBoaWRlT25TZWxlY3RcbiAgICAgICAgICAgICAgICBwb2ludFpvb209ezE1fVxuICAgICAgICAgICAgICAgIHZpZXdwb3J0PXt7fX1cbiAgICAgICAgICAgICAgICBxdWVyeVBhcmFtcz17UVVFUllfUEFSQU1TfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHt0aGlzLnN0YXRlLnNlbGVjdGVkR2VvSXRlbSAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnkgcmVtb3ZlLWxheWVyXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnJlbW92ZU1hcmtlcn1cbiAgICAgICAgICAgICAgICB0aXRsZT1cIlJlbW92ZSBtYXJrZXJcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgJnRpbWVzO1xuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9HZW9jb2RlcldyYXBwZXI+XG4gICAgICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgIDwvR2VvY29kZXJQYW5lbENvbnRlbnQ+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHZW9jb2RlclBhbmVsRmFjdG9yeSgpIHtcbiAgcmV0dXJuIEdlb2NvZGVyUGFuZWw7XG59XG4iXX0=