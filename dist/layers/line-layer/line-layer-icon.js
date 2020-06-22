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

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _base = _interopRequireDefault(require("../../components/common/icons/base"));

// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var LineLayerIcon =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(LineLayerIcon, _Component);

  function LineLayerIcon() {
    (0, _classCallCheck2["default"])(this, LineLayerIcon);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(LineLayerIcon).apply(this, arguments));
  }

  (0, _createClass2["default"])(LineLayerIcon, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement(_base["default"], this.props, _react["default"].createElement("path", {
        d: "M57.8,58.3c-0.4,0-0.8-0.2-1.1-0.5L33.1,32.1c-0.6-0.6-0.5-1.6,0.1-2.1c0.6-0.6,1.6-0.5,2.1,0.1l23.7,25.8 c0.6,0.6,0.5,1.6-0.1,2.1C58.5,58.2,58.2,58.3,57.8,58.3z",
        className: "cr1"
      }), _react["default"].createElement("path", {
        d: "M34.2,33.6c-0.6,0-1.2-0.2-1.7-0.6c-1-0.9-1.1-2.5-0.2-3.5l18.5-21c0.9-1,2.5-1.1,3.5-0.2c1,0.9,1.1,2.5,0.2,3.5L36,32.7 C35.5,33.3,34.9,33.6,34.2,33.6z",
        className: "cr2"
      }), _react["default"].createElement("path", {
        d: "M34.2,32.6c-0.5,0-1-0.3-1.3-0.8L20.7,10.2c-0.4-0.7-0.1-1.6,0.6-2c0.7-0.4,1.6-0.1,2,0.6l12.1,21.6c0.4,0.7,0.1,1.6-0.6,2 C34.7,32.5,34.4,32.6,34.2,32.6z",
        className: "cr3"
      }), _react["default"].createElement("path", {
        d: "M15.8,58.4c-0.3,0-0.6-0.1-0.9-0.3c-0.7-0.5-0.8-1.4-0.4-2.1l18.3-25.8c0.5-0.7,1.4-0.8,2.1-0.4s0.8,1.4,0.4,2.1L17.1,57.7 C16.8,58.2,16.3,58.4,15.8,58.4z",
        className: "cr4"
      }), _react["default"].createElement("path", {
        d: "M34.2,32.1c-0.1,0-0.3,0-0.4-0.1l-28.5-14c-0.5-0.2-0.7-0.8-0.5-1.3c0.2-0.5,0.8-0.7,1.3-0.5l28.5,14 c0.5,0.2,0.7,0.8,0.5,1.3C34.9,31.9,34.5,32.1,34.2,32.1z",
        className: "cr5"
      }));
    }
  }]);
  return LineLayerIcon;
}(_react.Component);

exports["default"] = LineLayerIcon;
(0, _defineProperty2["default"])(LineLayerIcon, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string,
  colors: _propTypes["default"].arrayOf(_propTypes["default"].string)
});
(0, _defineProperty2["default"])(LineLayerIcon, "defaultProps", {
  height: '16px',
  predefinedClassName: 'line-layer-icon',
  totalColor: 5
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvbGluZS1sYXllci9saW5lLWxheWVyLWljb24uanMiXSwibmFtZXMiOlsiTGluZUxheWVySWNvbiIsInByb3BzIiwiQ29tcG9uZW50IiwiaGVpZ2h0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiY29sb3JzIiwiYXJyYXlPZiIsInByZWRlZmluZWRDbGFzc05hbWUiLCJ0b3RhbENvbG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUF0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFNcUJBLGE7Ozs7Ozs7Ozs7Ozs2QkFhVjtBQUNQLGFBQ0UsZ0NBQUMsZ0JBQUQsRUFBVSxLQUFLQyxLQUFmLEVBQ0U7QUFDRSxRQUFBLENBQUMsRUFBQyxnS0FESjtBQUdFLFFBQUEsU0FBUyxFQUFDO0FBSFosUUFERixFQU1FO0FBQ0UsUUFBQSxDQUFDLEVBQUMsc0pBREo7QUFHRSxRQUFBLFNBQVMsRUFBQztBQUhaLFFBTkYsRUFXRTtBQUNFLFFBQUEsQ0FBQyxFQUFDLHdKQURKO0FBR0UsUUFBQSxTQUFTLEVBQUM7QUFIWixRQVhGLEVBZ0JFO0FBQ0UsUUFBQSxDQUFDLEVBQUMsd0pBREo7QUFHRSxRQUFBLFNBQVMsRUFBQztBQUhaLFFBaEJGLEVBcUJFO0FBQ0UsUUFBQSxDQUFDLEVBQUMsMkpBREo7QUFHRSxRQUFBLFNBQVMsRUFBQztBQUhaLFFBckJGLENBREY7QUE2QkQ7OztFQTNDd0NDLGdCOzs7aUNBQXRCRixhLGVBQ0E7QUFDakI7QUFDQUcsRUFBQUEsTUFBTSxFQUFFQyxzQkFBVUMsTUFGRDtBQUdqQkMsRUFBQUEsTUFBTSxFQUFFRixzQkFBVUcsT0FBVixDQUFrQkgsc0JBQVVDLE1BQTVCO0FBSFMsQztpQ0FEQUwsYSxrQkFPRztBQUNwQkcsRUFBQUEsTUFBTSxFQUFFLE1BRFk7QUFFcEJLLEVBQUFBLG1CQUFtQixFQUFFLGlCQUZEO0FBR3BCQyxFQUFBQSxVQUFVLEVBQUU7QUFIUSxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEJhc2UgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVMYXllckljb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBjb2xvcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgICBwcmVkZWZpbmVkQ2xhc3NOYW1lOiAnbGluZS1sYXllci1pY29uJyxcbiAgICB0b3RhbENvbG9yOiA1XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZD1cIk01Ny44LDU4LjNjLTAuNCwwLTAuOC0wLjItMS4xLTAuNUwzMy4xLDMyLjFjLTAuNi0wLjYtMC41LTEuNiwwLjEtMi4xYzAuNi0wLjYsMS42LTAuNSwyLjEsMC4xbDIzLjcsMjUuOFxuICAgICAgICAgIGMwLjYsMC42LDAuNSwxLjYtMC4xLDIuMUM1OC41LDU4LjIsNTguMiw1OC4zLDU3LjgsNTguM3pcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImNyMVwiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZD1cIk0zNC4yLDMzLjZjLTAuNiwwLTEuMi0wLjItMS43LTAuNmMtMS0wLjktMS4xLTIuNS0wLjItMy41bDE4LjUtMjFjMC45LTEsMi41LTEuMSwzLjUtMC4yYzEsMC45LDEuMSwyLjUsMC4yLDMuNUwzNiwzMi43XG4gICAgICAgICAgQzM1LjUsMzMuMywzNC45LDMzLjYsMzQuMiwzMy42elwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiY3IyXCJcbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkPVwiTTM0LjIsMzIuNmMtMC41LDAtMS0wLjMtMS4zLTAuOEwyMC43LDEwLjJjLTAuNC0wLjctMC4xLTEuNiwwLjYtMmMwLjctMC40LDEuNi0wLjEsMiwwLjZsMTIuMSwyMS42YzAuNCwwLjcsMC4xLDEuNi0wLjYsMlxuICAgICAgICAgIEMzNC43LDMyLjUsMzQuNCwzMi42LDM0LjIsMzIuNnpcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImNyM1wiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZD1cIk0xNS44LDU4LjRjLTAuMywwLTAuNi0wLjEtMC45LTAuM2MtMC43LTAuNS0wLjgtMS40LTAuNC0yLjFsMTguMy0yNS44YzAuNS0wLjcsMS40LTAuOCwyLjEtMC40czAuOCwxLjQsMC40LDIuMUwxNy4xLDU3LjdcbiAgICAgICAgICBDMTYuOCw1OC4yLDE2LjMsNTguNCwxNS44LDU4LjR6XCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJjcjRcIlxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGQ9XCJNMzQuMiwzMi4xYy0wLjEsMC0wLjMsMC0wLjQtMC4xbC0yOC41LTE0Yy0wLjUtMC4yLTAuNy0wLjgtMC41LTEuM2MwLjItMC41LDAuOC0wLjcsMS4zLTAuNWwyOC41LDE0XG4gICAgICAgICAgYzAuNSwwLjIsMC43LDAuOCwwLjUsMS4zQzM0LjksMzEuOSwzNC41LDMyLjEsMzQuMiwzMi4xelwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiY3I1XCJcbiAgICAgICAgLz5cbiAgICAgIDwvQmFzZT5cbiAgICApO1xuICB9XG59XG4iXX0=