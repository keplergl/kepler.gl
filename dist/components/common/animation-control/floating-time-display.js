"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = FloatingTimeDisplayFactory;

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

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _moment = _interopRequireDefault(require("moment"));

var _reselect = require("reselect");

var _icons = require("../icons");

var _defaultSettings = require("../../../constants/default-settings");

var _styledComponents2 = require("../styled-components");

function _templateObject7() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  margin: 0 12px;\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  display: flex;\n  font-size: 14px;\n  font-weight: 500;\n  justify-content: center;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  color: ", ";\n  display: flex;\n  font-size: 12px;\n  font-weight: 500;\n  justify-content: center;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  align-items: center;\n  display: flex;\n  flex-direction: row;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  background-color: ", ";\n  border-radius: ", "px;\n  bottom: ", ";\n  color: ", ";\n  display: flex;\n  height: ", "px;\n  justify-content: center;\n  left: calc(50% - 88px);\n  min-width: ", "px;\n  opacity: ", ";\n  padding: ", ";\n  position: absolute;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var StyledTimeDisplay = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return props.theme.timeDisplayBorderRadius;
}, function (props) {
  return "calc(100% + ".concat(props.theme.bottomPanelGap, "px)");
}, function (props) {
  return props.theme.titleTextColor;
}, function (props) {
  return props.theme.timeDisplayHeight;
}, function (props) {
  return props.theme.timeDisplayMinWidth;
}, function (props) {
  return props.theme.timeDisplayOpacity;
}, function (props) {
  return props.theme.timeDisplayPadding;
});

var StyledTimeDisplayGroups = _styledComponents["default"].div(_templateObject2());

var StyledTimeDisplayRows = _styledComponents["default"].div(_templateObject3());

var StyledTimeDisplayTop = _styledComponents["default"].div.attrs({
  className: 'animation-control__time-display__top'
})(_templateObject4(), function (props) {
  return props.theme.textColor;
});

var StyledTimeDisplayBottom = _styledComponents["default"].div.attrs({
  className: 'animation-control__time-display__bottom'
})(_templateObject5(), function (props) {
  return props.theme.titleTextColor;
});

var StyledTimeValueGroup = _styledComponents["default"].div.attrs({
  className: 'animation-control__time-value-group'
})(_templateObject6());

var StyledHorizontalBar = _styledComponents["default"].div.attrs({
  className: 'animation-control__horizontal-bar'
})(_templateObject7());

var TimeDivider = function TimeDivider() {
  return _react["default"].createElement(StyledHorizontalBar, null, _react["default"].createElement(_icons.Minus, {
    height: "12px"
  }));
};

var TimeDisplayRow = function TimeDisplayRow(_ref) {
  var _ref$timeValues = _ref.timeValues,
      timeValues = _ref$timeValues === void 0 ? [] : _ref$timeValues;
  return _react["default"].createElement(_styledComponents2.CenterFlexbox, null, _react["default"].createElement("div", null, timeValues[0]), timeValues[1] ? _react["default"].createElement(TimeDivider, null) : null, timeValues[1] ? _react["default"].createElement("div", null, timeValues[1]) : null);
};

function FloatingTimeDisplayFactory() {
  var FloatingTimeDisplay =
  /*#__PURE__*/
  function (_PureComponent) {
    (0, _inherits2["default"])(FloatingTimeDisplay, _PureComponent);

    function FloatingTimeDisplay() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2["default"])(this, FloatingTimeDisplay);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(FloatingTimeDisplay)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "timeSelector", function (props) {
        return props.currentTime;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "formatSelector", function (props) {
        return props.format;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "displayTimeSelector", (0, _reselect.createSelector)(_this.timeSelector, _this.formatSelector, function (currentTime, format) {
        var groupTime = Array.isArray(currentTime) ? currentTime : [currentTime];
        return groupTime.reduce(function (accu, curr) {
          var displayDateTime = _moment["default"].utc(curr).format(format);

          var _displayDateTime$spli = displayDateTime.split(' '),
              _displayDateTime$spli2 = (0, _slicedToArray2["default"])(_displayDateTime$spli, 2),
              displayDate = _displayDateTime$spli2[0],
              displayTime = _displayDateTime$spli2[1];

          if (!accu.displayDate.includes(displayDate)) {
            accu.displayDate.push(displayDate);
          }

          accu.displayTime.push(displayTime);
          return accu;
        }, {
          displayDate: [],
          displayTime: []
        });
      }));
      return _this;
    }

    (0, _createClass2["default"])(FloatingTimeDisplay, [{
      key: "render",
      value: function render() {
        var _this$displayTimeSele = this.displayTimeSelector(this.props),
            displayDate = _this$displayTimeSele.displayDate,
            displayTime = _this$displayTimeSele.displayTime;

        var twoGroups = displayDate.length === 2 && displayTime.length === 2;
        var bottomRow = displayTime.length ? displayTime : displayDate.length ? displayDate : null;
        var topRow = displayDate.length && displayTime.length ? displayDate : null;
        return _react["default"].createElement(StyledTimeDisplay, {
          className: "animation-control__time-display"
        }, twoGroups ? _react["default"].createElement(StyledTimeDisplayGroups, null, _react["default"].createElement(StyledTimeValueGroup, null, _react["default"].createElement(StyledTimeDisplayTop, null, displayDate[0]), _react["default"].createElement(StyledTimeDisplayBottom, null, displayTime[0])), _react["default"].createElement(TimeDivider, null), _react["default"].createElement(StyledTimeValueGroup, null, _react["default"].createElement(StyledTimeDisplayTop, null, displayDate[1]), _react["default"].createElement(StyledTimeDisplayBottom, null, displayTime[1]))) : _react["default"].createElement(StyledTimeDisplayRows, null, topRow ? _react["default"].createElement(StyledTimeDisplayTop, null, _react["default"].createElement(TimeDisplayRow, {
          timeValues: topRow
        })) : null, bottomRow ? _react["default"].createElement(StyledTimeDisplayBottom, null, _react["default"].createElement(TimeDisplayRow, {
          timeValues: bottomRow
        })) : null));
      }
    }]);
    return FloatingTimeDisplay;
  }(_react.PureComponent);

  FloatingTimeDisplay.defaultProps = {
    format: _defaultSettings.DEFAULT_TIME_FORMAT,
    currentTime: null
  };
  return FloatingTimeDisplay;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9hbmltYXRpb24tY29udHJvbC9mbG9hdGluZy10aW1lLWRpc3BsYXkuanMiXSwibmFtZXMiOlsiU3R5bGVkVGltZURpc3BsYXkiLCJzdHlsZWQiLCJkaXYiLCJwcm9wcyIsInRoZW1lIiwicGFuZWxCYWNrZ3JvdW5kIiwidGltZURpc3BsYXlCb3JkZXJSYWRpdXMiLCJib3R0b21QYW5lbEdhcCIsInRpdGxlVGV4dENvbG9yIiwidGltZURpc3BsYXlIZWlnaHQiLCJ0aW1lRGlzcGxheU1pbldpZHRoIiwidGltZURpc3BsYXlPcGFjaXR5IiwidGltZURpc3BsYXlQYWRkaW5nIiwiU3R5bGVkVGltZURpc3BsYXlHcm91cHMiLCJTdHlsZWRUaW1lRGlzcGxheVJvd3MiLCJTdHlsZWRUaW1lRGlzcGxheVRvcCIsImF0dHJzIiwiY2xhc3NOYW1lIiwidGV4dENvbG9yIiwiU3R5bGVkVGltZURpc3BsYXlCb3R0b20iLCJTdHlsZWRUaW1lVmFsdWVHcm91cCIsIlN0eWxlZEhvcml6b250YWxCYXIiLCJUaW1lRGl2aWRlciIsIlRpbWVEaXNwbGF5Um93IiwidGltZVZhbHVlcyIsIkZsb2F0aW5nVGltZURpc3BsYXlGYWN0b3J5IiwiRmxvYXRpbmdUaW1lRGlzcGxheSIsImN1cnJlbnRUaW1lIiwiZm9ybWF0IiwidGltZVNlbGVjdG9yIiwiZm9ybWF0U2VsZWN0b3IiLCJncm91cFRpbWUiLCJBcnJheSIsImlzQXJyYXkiLCJyZWR1Y2UiLCJhY2N1IiwiY3VyciIsImRpc3BsYXlEYXRlVGltZSIsIm1vbWVudCIsInV0YyIsInNwbGl0IiwiZGlzcGxheURhdGUiLCJkaXNwbGF5VGltZSIsImluY2x1ZGVzIiwicHVzaCIsImRpc3BsYXlUaW1lU2VsZWN0b3IiLCJ0d29Hcm91cHMiLCJsZW5ndGgiLCJib3R0b21Sb3ciLCJ0b3BSb3ciLCJQdXJlQ29tcG9uZW50IiwiZGVmYXVsdFByb3BzIiwiREVGQVVMVF9USU1F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QyxjQUFEO0FBQWdCLFVBQUEsVUFBVSxFQUFFQTtBQUE1QixVQURGLENBRFEsR0FJTixJQVZOLENBaEJKLENBREY7QUFnQ0Q7QUFoRWdEO0FBQUE7QUFBQSxJQUNqQkUsb0JBRGlCOztBQW1FbkR4QixFQUFBQSxtQkFBbUIsQ0FBQ3lCLFlBQXBCLEdBQW1DO0FBQ2pDdkIsSUFBQUEsTUFBTSxFQUFFd0Isb0NBRHlCO0FBRWpDekIsSUFBQUEsV0FBVyxFQUFFO0FBRm9CLEdBQW5DO0FBS0EsU0FBT0QsbUJBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge1B1cmVDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtjcmVhdGVTZWxlY3Rvcn0gZnJvbSAncmVzZWxlY3QnO1xuaW1wb3J0IHtNaW51c30gZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMnO1xuaW1wb3J0IHtERUZBVUxUX1RJTUVfRk9STUFUfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge0NlbnRlckZsZXhib3h9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgU3R5bGVkVGltZURpc3BsYXkgPSBzdHlsZWQuZGl2YFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZH07XG4gIGJvcmRlci1yYWRpdXM6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGltZURpc3BsYXlCb3JkZXJSYWRpdXN9cHg7XG4gIGJvdHRvbTogJHtwcm9wcyA9PiBgY2FsYygxMDAlICsgJHtwcm9wcy50aGVtZS5ib3R0b21QYW5lbEdhcH1weClgfTtcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGl0bGVUZXh0Q29sb3J9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGltZURpc3BsYXlIZWlnaHR9cHg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBsZWZ0OiBjYWxjKDUwJSAtIDg4cHgpO1xuICBtaW4td2lkdGg6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGltZURpc3BsYXlNaW5XaWR0aH1weDtcbiAgb3BhY2l0eTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50aW1lRGlzcGxheU9wYWNpdHl9O1xuICBwYWRkaW5nOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRpbWVEaXNwbGF5UGFkZGluZ307XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbmA7XG5cbmNvbnN0IFN0eWxlZFRpbWVEaXNwbGF5R3JvdXBzID0gc3R5bGVkLmRpdmBcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbmA7XG5cbmNvbnN0IFN0eWxlZFRpbWVEaXNwbGF5Um93cyA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuYDtcblxuY29uc3QgU3R5bGVkVGltZURpc3BsYXlUb3AgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnYW5pbWF0aW9uLWNvbnRyb2xfX3RpbWUtZGlzcGxheV9fdG9wJ1xufSlgXG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5gO1xuXG5jb25zdCBTdHlsZWRUaW1lRGlzcGxheUJvdHRvbSA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdhbmltYXRpb24tY29udHJvbF9fdGltZS1kaXNwbGF5X19ib3R0b20nXG59KWBcbiAgY29sb3I6ICR7cHJvcHMgPT4gcHJvcHMudGhlbWUudGl0bGVUZXh0Q29sb3J9O1xuICBkaXNwbGF5OiBmbGV4O1xuICBmb250LXNpemU6IDE0cHg7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuYDtcblxuY29uc3QgU3R5bGVkVGltZVZhbHVlR3JvdXAgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnYW5pbWF0aW9uLWNvbnRyb2xfX3RpbWUtdmFsdWUtZ3JvdXAnXG59KWBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbmA7XG5cbmNvbnN0IFN0eWxlZEhvcml6b250YWxCYXIgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnYW5pbWF0aW9uLWNvbnRyb2xfX2hvcml6b250YWwtYmFyJ1xufSlgXG4gIG1hcmdpbjogMCAxMnB4O1xuYDtcblxuY29uc3QgVGltZURpdmlkZXIgPSAoKSA9PiAoXG4gIDxTdHlsZWRIb3Jpem9udGFsQmFyPlxuICAgIDxNaW51cyBoZWlnaHQ9XCIxMnB4XCIgLz5cbiAgPC9TdHlsZWRIb3Jpem9udGFsQmFyPlxuKTtcblxuY29uc3QgVGltZURpc3BsYXlSb3cgPSAoe3RpbWVWYWx1ZXMgPSBbXX0pID0+IChcbiAgPENlbnRlckZsZXhib3g+XG4gICAgPGRpdj57dGltZVZhbHVlc1swXX08L2Rpdj5cbiAgICB7dGltZVZhbHVlc1sxXSA/IDxUaW1lRGl2aWRlciAvPiA6IG51bGx9XG4gICAge3RpbWVWYWx1ZXNbMV0gPyA8ZGl2Pnt0aW1lVmFsdWVzWzFdfTwvZGl2PiA6IG51bGx9XG4gIDwvQ2VudGVyRmxleGJveD5cbik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEZsb2F0aW5nVGltZURpc3BsYXlGYWN0b3J5KCkge1xuICBjbGFzcyBGbG9hdGluZ1RpbWVEaXNwbGF5IGV4dGVuZHMgUHVyZUNvbXBvbmVudCB7XG4gICAgdGltZVNlbGVjdG9yID0gcHJvcHMgPT4gcHJvcHMuY3VycmVudFRpbWU7XG4gICAgZm9ybWF0U2VsZWN0b3IgPSBwcm9wcyA9PiBwcm9wcy5mb3JtYXQ7XG4gICAgZGlzcGxheVRpbWVTZWxlY3RvciA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgICAgdGhpcy50aW1lU2VsZWN0b3IsXG4gICAgICB0aGlzLmZvcm1hdFNlbGVjdG9yLFxuICAgICAgKGN1cnJlbnRUaW1lLCBmb3JtYXQpID0+IHtcbiAgICAgICAgY29uc3QgZ3JvdXBUaW1lID0gQXJyYXkuaXNBcnJheShjdXJyZW50VGltZSkgPyBjdXJyZW50VGltZSA6IFtjdXJyZW50VGltZV07XG4gICAgICAgIHJldHVybiBncm91cFRpbWUucmVkdWNlKFxuICAgICAgICAgIChhY2N1LCBjdXJyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkaXNwbGF5RGF0ZVRpbWUgPSBtb21lbnQudXRjKGN1cnIpLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICAgICAgY29uc3QgW2Rpc3BsYXlEYXRlLCBkaXNwbGF5VGltZV0gPSBkaXNwbGF5RGF0ZVRpbWUuc3BsaXQoJyAnKTtcblxuICAgICAgICAgICAgaWYgKCFhY2N1LmRpc3BsYXlEYXRlLmluY2x1ZGVzKGRpc3BsYXlEYXRlKSkge1xuICAgICAgICAgICAgICBhY2N1LmRpc3BsYXlEYXRlLnB1c2goZGlzcGxheURhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWNjdS5kaXNwbGF5VGltZS5wdXNoKGRpc3BsYXlUaW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIGFjY3U7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7ZGlzcGxheURhdGU6IFtdLCBkaXNwbGF5VGltZTogW119XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnN0IHtkaXNwbGF5RGF0ZSwgZGlzcGxheVRpbWV9ID0gdGhpcy5kaXNwbGF5VGltZVNlbGVjdG9yKHRoaXMucHJvcHMpO1xuICAgICAgY29uc3QgdHdvR3JvdXBzID0gZGlzcGxheURhdGUubGVuZ3RoID09PSAyICYmIGRpc3BsYXlUaW1lLmxlbmd0aCA9PT0gMjtcbiAgICAgIGNvbnN0IGJvdHRvbVJvdyA9IGRpc3BsYXlUaW1lLmxlbmd0aCA/IGRpc3BsYXlUaW1lIDogZGlzcGxheURhdGUubGVuZ3RoID8gZGlzcGxheURhdGUgOiBudWxsO1xuICAgICAgY29uc3QgdG9wUm93ID0gZGlzcGxheURhdGUubGVuZ3RoICYmIGRpc3BsYXlUaW1lLmxlbmd0aCA/IGRpc3BsYXlEYXRlIDogbnVsbDtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlZFRpbWVEaXNwbGF5IGNsYXNzTmFtZT1cImFuaW1hdGlvbi1jb250cm9sX190aW1lLWRpc3BsYXlcIj5cbiAgICAgICAgICB7dHdvR3JvdXBzID8gKFxuICAgICAgICAgICAgPFN0eWxlZFRpbWVEaXNwbGF5R3JvdXBzPlxuICAgICAgICAgICAgICA8U3R5bGVkVGltZVZhbHVlR3JvdXA+XG4gICAgICAgICAgICAgICAgey8qIFRpbWUgU3RhcnQgKi99XG4gICAgICAgICAgICAgICAgPFN0eWxlZFRpbWVEaXNwbGF5VG9wPntkaXNwbGF5RGF0ZVswXX08L1N0eWxlZFRpbWVEaXNwbGF5VG9wPlxuICAgICAgICAgICAgICAgIDxTdHlsZWRUaW1lRGlzcGxheUJvdHRvbT57ZGlzcGxheVRpbWVbMF19PC9TdHlsZWRUaW1lRGlzcGxheUJvdHRvbT5cbiAgICAgICAgICAgICAgPC9TdHlsZWRUaW1lVmFsdWVHcm91cD5cbiAgICAgICAgICAgICAgPFRpbWVEaXZpZGVyIC8+XG4gICAgICAgICAgICAgIDxTdHlsZWRUaW1lVmFsdWVHcm91cD5cbiAgICAgICAgICAgICAgICB7LyogVGltZSBFbmQgKi99XG4gICAgICAgICAgICAgICAgPFN0eWxlZFRpbWVEaXNwbGF5VG9wPntkaXNwbGF5RGF0ZVsxXX08L1N0eWxlZFRpbWVEaXNwbGF5VG9wPlxuICAgICAgICAgICAgICAgIDxTdHlsZWRUaW1lRGlzcGxheUJvdHRvbT57ZGlzcGxheVRpbWVbMV19PC9TdHlsZWRUaW1lRGlzcGxheUJvdHRvbT5cbiAgICAgICAgICAgICAgPC9TdHlsZWRUaW1lVmFsdWVHcm91cD5cbiAgICAgICAgICAgIDwvU3R5bGVkVGltZURpc3BsYXlHcm91cHM+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxTdHlsZWRUaW1lRGlzcGxheVJvd3M+XG4gICAgICAgICAgICAgIHt0b3BSb3cgPyAoXG4gICAgICAgICAgICAgICAgPFN0eWxlZFRpbWVEaXNwbGF5VG9wPlxuICAgICAgICAgICAgICAgICAgPFRpbWVEaXNwbGF5Um93IHRpbWVWYWx1ZXM9e3RvcFJvd30gLz5cbiAgICAgICAgICAgICAgICA8L1N0eWxlZFRpbWVEaXNwbGF5VG9wPlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAge2JvdHRvbVJvdyA/IChcbiAgICAgICAgICAgICAgICA8U3R5bGVkVGltZURpc3BsYXlCb3R0b20+XG4gICAgICAgICAgICAgICAgICA8VGltZURpc3BsYXlSb3cgdGltZVZhbHVlcz17Ym90dG9tUm93fSAvPlxuICAgICAgICAgICAgICAgIDwvU3R5bGVkVGltZURpc3BsYXlCb3R0b20+XG4gICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgPC9TdHlsZWRUaW1lRGlzcGxheVJvd3M+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9TdHlsZWRUaW1lRGlzcGxheT5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgRmxvYXRpbmdUaW1lRGlzcGxheS5kZWZhdWx0UHJvcHMgPSB7XG4gICAgZm9ybWF0OiBERUZBVUxUX1RJTUVfRk9STUFULFxuICAgIGN1cnJlbnRUaW1lOiBudWxsXG4gIH07XG5cbiAgcmV0dXJuIEZsb2F0aW5nVGltZURpc3BsYXk7XG59XG4iXX0=