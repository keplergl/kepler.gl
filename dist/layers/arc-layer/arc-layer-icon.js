"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _base = _interopRequireDefault(require("../../components/common/icons/base"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ArcLayerIcon = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(ArcLayerIcon, _Component);

  var _super = _createSuper(ArcLayerIcon);

  function ArcLayerIcon() {
    (0, _classCallCheck2["default"])(this, ArcLayerIcon);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(ArcLayerIcon, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_base["default"], this.props, /*#__PURE__*/_react["default"].createElement("path", {
        d: "M34.5,34.4c-0.6,0-1.2-0.4-1.4-1c-2.7-9.9-8.8-21.7-16.8-22.3c-3.1-0.2-5.6,1.5-7,4.8c-0.3,0.7-1.1,1.1-1.9,0.7 c-0.7-0.3-1.1-1.1-0.7-1.9c1.9-4.3,5.6-6.8,9.8-6.5c9.5,0.7,16.3,13,19.4,24.4c0.2,0.8-0.2,1.5-1,1.7C34.8,34.3,34.6,34.4,34.5,34.4 z",
        className: "cr1"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M6.7,57c0,0-0.1,0-0.1,0c-0.5-0.1-0.9-0.6-0.8-1.1c2.4-17.3,9.6-30.3,17.5-31.8c3.1-0.6,7.8,0.4,12.1,8.3 c0.3,0.5,0.1,1-0.4,1.3c-0.5,0.3-1,0.1-1.3-0.4c-2.1-3.8-5.6-8.2-10.1-7.4C16.6,27.3,9.9,40,7.6,56.2C7.6,56.7,7.2,57,6.7,57z",
        className: "cr2"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M56.8,56.4c-0.8,0-1.4-0.6-1.4-1.4c0-13.5-6.8-24.4-12.9-25.8c-3.5-0.8-5.6,2-6.7,4.4c-0.3,0.7-1.2,1-1.9,0.7 c-0.7-0.3-1-1.2-0.7-1.9c2.2-4.7,5.8-6.9,9.9-6c9,2,15.1,16.4,15.1,28.6C58.3,55.7,57.6,56.4,56.8,56.4z",
        className: "cr3"
      }), /*#__PURE__*/_react["default"].createElement("path", {
        d: "M34.5,32.7c-0.2,0-0.3,0-0.5,0c-1.3-0.3-2.1-1.5-1.8-2.8c3.5-17.4,10.3-20.7,14-21.2c4.4-0.5,8.6,2.3,11,7.4 c0.6,1.2,0,2.6-1.1,3.1c-1.2,0.6-2.6,0-3.1-1.1c-1.5-3.2-3.8-5-6.1-4.7c-1.5,0.2-6.8,2-9.9,17.4C36.6,32,35.6,32.7,34.5,32.7z",
        className: "cr4"
      }));
    }
  }]);
  return ArcLayerIcon;
}(_react.Component);

(0, _defineProperty2["default"])(ArcLayerIcon, "propTypes", {
  /** Set the height of the icon, ex. '16px' */
  height: _propTypes["default"].string,
  colors: _propTypes["default"].arrayOf(_propTypes["default"].string)
});
(0, _defineProperty2["default"])(ArcLayerIcon, "defaultProps", {
  height: '16px',
  predefinedClassName: 'point-layer-icon',
  totalColor: 4
});
var _default = ArcLayerIcon;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvYXJjLWxheWVyL2FyYy1sYXllci1pY29uLmpzIl0sIm5hbWVzIjpbIkFyY0xheWVySWNvbiIsInByb3BzIiwiQ29tcG9uZW50IiwiaGVpZ2h0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiY29sb3JzIiwiYXJyYXlPZiIsInByZWRlZmluZWRDbGFzc05hbWUiLCJ0b3RhbENvbG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7Ozs7O0lBRU1BLFk7Ozs7Ozs7Ozs7OztXQWFKLGtCQUFTO0FBQ1AsMEJBQ0UsZ0NBQUMsZ0JBQUQsRUFBVSxLQUFLQyxLQUFmLGVBQ0U7QUFDRSxRQUFBLENBQUMsRUFBQywrT0FESjtBQUlFLFFBQUEsU0FBUyxFQUFDO0FBSlosUUFERixlQU9FO0FBQ0UsUUFBQSxDQUFDLEVBQUMsaU9BREo7QUFHRSxRQUFBLFNBQVMsRUFBQztBQUhaLFFBUEYsZUFZRTtBQUNFLFFBQUEsQ0FBQyxFQUFDLGdOQURKO0FBR0UsUUFBQSxTQUFTLEVBQUM7QUFIWixRQVpGLGVBaUJFO0FBQ0UsUUFBQSxDQUFDLEVBQUMsb09BREo7QUFHRSxRQUFBLFNBQVMsRUFBQztBQUhaLFFBakJGLENBREY7QUF5QkQ7OztFQXZDd0JDLGdCOztpQ0FBckJGLFksZUFDZTtBQUNqQjtBQUNBRyxFQUFBQSxNQUFNLEVBQUVDLHNCQUFVQyxNQUZEO0FBR2pCQyxFQUFBQSxNQUFNLEVBQUVGLHNCQUFVRyxPQUFWLENBQWtCSCxzQkFBVUMsTUFBNUI7QUFIUyxDO2lDQURmTCxZLGtCQU9rQjtBQUNwQkcsRUFBQUEsTUFBTSxFQUFFLE1BRFk7QUFFcEJLLEVBQUFBLG1CQUFtQixFQUFFLGtCQUZEO0FBR3BCQyxFQUFBQSxVQUFVLEVBQUU7QUFIUSxDO2VBbUNUVCxZIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IEJhc2UgZnJvbSAnY29tcG9uZW50cy9jb21tb24vaWNvbnMvYmFzZSc7XG5cbmNsYXNzIEFyY0xheWVySWNvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLyoqIFNldCB0aGUgaGVpZ2h0IG9mIHRoZSBpY29uLCBleC4gJzE2cHgnICovXG4gICAgaGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNvbG9yczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZylcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGhlaWdodDogJzE2cHgnLFxuICAgIHByZWRlZmluZWRDbGFzc05hbWU6ICdwb2ludC1sYXllci1pY29uJyxcbiAgICB0b3RhbENvbG9yOiA0XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZD1cIk0zNC41LDM0LjRjLTAuNiwwLTEuMi0wLjQtMS40LTFjLTIuNy05LjktOC44LTIxLjctMTYuOC0yMi4zYy0zLjEtMC4yLTUuNiwxLjUtNyw0LjhjLTAuMywwLjctMS4xLDEuMS0xLjksMC43XG5cdGMtMC43LTAuMy0xLjEtMS4xLTAuNy0xLjljMS45LTQuMyw1LjYtNi44LDkuOC02LjVjOS41LDAuNywxNi4zLDEzLDE5LjQsMjQuNGMwLjIsMC44LTAuMiwxLjUtMSwxLjdDMzQuOCwzNC4zLDM0LjYsMzQuNCwzNC41LDM0LjRcblx0elwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiY3IxXCJcbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkPVwiTTYuNyw1N2MwLDAtMC4xLDAtMC4xLDBjLTAuNS0wLjEtMC45LTAuNi0wLjgtMS4xYzIuNC0xNy4zLDkuNi0zMC4zLDE3LjUtMzEuOGMzLjEtMC42LDcuOCwwLjQsMTIuMSw4LjNcblx0YzAuMywwLjUsMC4xLDEtMC40LDEuM2MtMC41LDAuMy0xLDAuMS0xLjMtMC40Yy0yLjEtMy44LTUuNi04LjItMTAuMS03LjRDMTYuNiwyNy4zLDkuOSw0MCw3LjYsNTYuMkM3LjYsNTYuNyw3LjIsNTcsNi43LDU3elwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiY3IyXCJcbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkPVwiTTU2LjgsNTYuNGMtMC44LDAtMS40LTAuNi0xLjQtMS40YzAtMTMuNS02LjgtMjQuNC0xMi45LTI1LjhjLTMuNS0wLjgtNS42LDItNi43LDQuNGMtMC4zLDAuNy0xLjIsMS0xLjksMC43XG5cdGMtMC43LTAuMy0xLTEuMi0wLjctMS45YzIuMi00LjcsNS44LTYuOSw5LjktNmM5LDIsMTUuMSwxNi40LDE1LjEsMjguNkM1OC4zLDU1LjcsNTcuNiw1Ni40LDU2LjgsNTYuNHpcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImNyM1wiXG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZD1cIk0zNC41LDMyLjdjLTAuMiwwLTAuMywwLTAuNSwwYy0xLjMtMC4zLTIuMS0xLjUtMS44LTIuOGMzLjUtMTcuNCwxMC4zLTIwLjcsMTQtMjEuMmM0LjQtMC41LDguNiwyLjMsMTEsNy40XG5cdGMwLjYsMS4yLDAsMi42LTEuMSwzLjFjLTEuMiwwLjYtMi42LDAtMy4xLTEuMWMtMS41LTMuMi0zLjgtNS02LjEtNC43Yy0xLjUsMC4yLTYuOCwyLTkuOSwxNy40QzM2LjYsMzIsMzUuNiwzMi43LDM0LjUsMzIuN3pcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImNyNFwiXG4gICAgICAgIC8+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcmNMYXllckljb247XG4iXX0=