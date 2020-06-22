"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = MapPopoverFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _layerHoverInfo = _interopRequireDefault(require("./layer-hover-info"));

var _coordinateInfo = _interopRequireDefault(require("./coordinate-info"));

var _icons = require("../common/icons");

var _errorBoundary = _interopRequireDefault(require("../common/error-boundary"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  position: absolute;\n  left: 50%;\n  transform: rotate(30deg);\n  top: 10px;\n  color: ", ";\n\n  :hover {\n    cursor: pointer;\n    color: ", ";\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  ", ";\n  font-size: 11px;\n  font-weight: 500;\n  background-color: ", ";\n  color: ", ";\n  z-index: 1000;\n  position: absolute;\n  overflow-x: auto;\n\n  .gutter {\n    height: 6px;\n  }\n\n  table {\n    margin: 2px 12px 12px 12px;\n    width: auto;\n\n    tbody {\n      border-top: transparent;\n      border-bottom: transparent;\n    }\n\n    td {\n      border-color: transparent;\n      padding: 4px;\n      color: ", ";\n    }\n\n    td.row__value {\n      text-align: right;\n      font-weight: 500;\n      color: ", ";\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var MAX_WIDTH = 500;
var MAX_HEIGHT = 600;

var StyledMapPopover = _styledComponents["default"].div(_templateObject(), function (props) {
  return props.theme.scrollBar;
}, function (props) {
  return props.theme.panelBackground;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.textColor;
}, function (props) {
  return props.theme.textColorHl;
});

var StyledPin = _styledComponents["default"].div(_templateObject2(), function (props) {
  return props.theme.primaryBtnBgd;
}, function (props) {
  return props.theme.linkBtnColor;
});

MapPopoverFactory.deps = [_layerHoverInfo["default"], _coordinateInfo["default"]];

function MapPopoverFactory(LayerHoverInfo, CoordinateInfo) {
  var MapPopover =
  /*#__PURE__*/
  function (_PureComponent) {
    (0, _inherits2["default"])(MapPopover, _PureComponent);

    function MapPopover(props) {
      var _this;

      (0, _classCallCheck2["default"])(this, MapPopover);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MapPopover).call(this, props));
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "popover", (0, _react.createRef)());
      _this.state = {
        width: 380,
        height: 160
      };
      return _this;
    }

    (0, _createClass2["default"])(MapPopover, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this._setContainerSize();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        this._setContainerSize();
      }
    }, {
      key: "_setContainerSize",
      value: function _setContainerSize() {
        var node = this.popover.current;

        if (!node) {
          return;
        }

        var width = Math.min(Math.round(node.scrollWidth), MAX_WIDTH);
        var height = Math.min(Math.round(node.scrollHeight), MAX_HEIGHT);

        if (width !== this.state.width || height !== this.state.height) {
          this.setState({
            width: width,
            height: height
          });
        }
      }
    }, {
      key: "_getPosition",
      value: function _getPosition(x, y) {
        var topOffset = 20;
        var leftOffset = 20;
        var _this$props = this.props,
            mapW = _this$props.mapW,
            mapH = _this$props.mapH;
        var _this$state = this.state,
            width = _this$state.width,
            height = _this$state.height;
        var pos = {};

        if (x + leftOffset + width > mapW) {
          pos.right = mapW - x + leftOffset;
        } else {
          pos.left = x + leftOffset;
        }

        if (y + topOffset + height > mapH) {
          pos.bottom = 10;
        } else {
          pos.top = y + topOffset;
        }

        return pos;
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props2 = this.props,
            x = _this$props2.x,
            y = _this$props2.y,
            freezed = _this$props2.freezed,
            coordinate = _this$props2.coordinate,
            layerHoverProp = _this$props2.layerHoverProp;
        var style = Number.isFinite(x) && Number.isFinite(y) ? this._getPosition(x, y) : {};
        return _react["default"].createElement(_errorBoundary["default"], null, _react["default"].createElement(StyledMapPopover, {
          ref: this.popover,
          className: "map-popover",
          style: _objectSpread({}, style, {
            maxWidth: MAX_WIDTH
          })
        }, freezed ? _react["default"].createElement("div", {
          className: "map-popover__top"
        }, _react["default"].createElement("div", {
          className: "gutter"
        }), _react["default"].createElement(StyledPin, {
          className: "popover-pin",
          onClick: this.props.onClose
        }, _react["default"].createElement(_icons.Pin, {
          height: "16px"
        }))) : null, Array.isArray(coordinate) && _react["default"].createElement(CoordinateInfo, {
          coordinate: coordinate
        }), layerHoverProp && _react["default"].createElement(LayerHoverInfo, layerHoverProp)));
      }
    }]);
    return MapPopover;
  }(_react.PureComponent);

  (0, _defineProperty2["default"])(MapPopover, "propTypes", {
    layerHoverProp: _propTypes["default"].object,
    coordinate: _propTypes["default"].oneOfType([_propTypes["default"].array, _propTypes["default"].bool]),
    freezed: _propTypes["default"].bool,
    x: _propTypes["default"].number,
    y: _propTypes["default"].number,
    mapW: _propTypes["default"].number.isRequired,
    mapH: _propTypes["default"].number.isRequired,
    onClose: _propTypes["default"].func.isRequired
  });
  return MapPopover;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL21hcC9tYXAtcG9wb3Zlci5qcyJdLCJuYW1lcyI6WyJNQVhfV0lEVEgiLCJNQVhfSEVJR0hUIiwiU3R5bGVkTWFwUG9wb3ZlciIsInN0eWxlZCIsImRpdiIsInByb3BzIiwidGhlbWUiLCJzY3JvbGxCYXIiLCJwYW5lbEJhY2tncm91bmQiLCJ0ZXh0Q29sb3IiLCJ0ZXh0Q29sb3JIbCIsIlN0eWxlZFBpbiIsInByaW1hcnlCdG5CZ2QiLCJsaW5rQnRuQ29sb3IiLCJNYXBQb3BvdmVyRmFjdG9yeSIsImRlcHMiLCJMYXllckhvdmVySW5mb0ZhY3RvcnkiLCJDb29yZGluYXRlSW5mb0ZhY3RvcnkiLCJMYXllckhvdmVySW5mbyIsIkNvb3JkaW5hdGVJbmZvIiwiTWFwUG9wb3ZlciIsInN0YXRlIiwid2lkdGgiLCJoZWlnaHQiLCJfc2V0Q29udGFpbmVyU2l6ZSIsIm5vZGUiLCJwb3BvdmVyIiwiY3VycmVudCIsIk1hdGgiLCJtaW4iLCJyb3VuZCIsInNjcm9sbFdpZHRoIiwic2Nyb2xsSGVpZ2h0Iiwic2V0U3RhdGUiLCJ4IiwieSIsInRvcE9mZnNldCIsImxlZnRPZmZzZXQiLCJtYXBXIiwibWFwSCIsInBvcyIsInJpZ2h0IiwibGVmdCIsImJvdHRvbSIsInRvcCIsImZyZWV6ZWQiLCJjb29yZGluYXRlIiwibGF5ZXJIb3ZlclByb3AiLCJzdHlsZSIsIk51bWJlciIsImlzRmluaXRlIiwiX2dldFBvc2l0aW9uIiwibWF4V2lkdGgiLCJvbkNsb3NlIiwiQXJyYXkiLCJpc0FycmF5IiwiUHVyZUNvbXBvbmVudCIsIlByb3BUeXBlcyIsIm9iamVjdCIsIm9uZU9mVHlwZSIsImFycmF5IiwiYm9vbCIsIm51bWJlciIsImlzUmVxdWlyZWQiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7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LyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtQdXJlQ29tcG9uZW50LCBjcmVhdGVSZWZ9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBMYXllckhvdmVySW5mb0ZhY3RvcnkgZnJvbSAnLi9sYXllci1ob3Zlci1pbmZvJztcbmltcG9ydCBDb29yZGluYXRlSW5mb0ZhY3RvcnkgZnJvbSAnLi9jb29yZGluYXRlLWluZm8nO1xuaW1wb3J0IHtQaW59IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCBFcnJvckJvdW5kYXJ5IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2Vycm9yLWJvdW5kYXJ5JztcblxuY29uc3QgTUFYX1dJRFRIID0gNTAwO1xuY29uc3QgTUFYX0hFSUdIVCA9IDYwMDtcblxuY29uc3QgU3R5bGVkTWFwUG9wb3ZlciA9IHN0eWxlZC5kaXZgXG4gICR7cHJvcHMgPT4gcHJvcHMudGhlbWUuc2Nyb2xsQmFyfTtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBmb250LXdlaWdodDogNTAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBhbmVsQmFja2dyb3VuZH07XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gIHotaW5kZXg6IDEwMDA7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgb3ZlcmZsb3cteDogYXV0bztcblxuICAuZ3V0dGVyIHtcbiAgICBoZWlnaHQ6IDZweDtcbiAgfVxuXG4gIHRhYmxlIHtcbiAgICBtYXJnaW46IDJweCAxMnB4IDEycHggMTJweDtcbiAgICB3aWR0aDogYXV0bztcblxuICAgIHRib2R5IHtcbiAgICAgIGJvcmRlci10b3A6IHRyYW5zcGFyZW50O1xuICAgICAgYm9yZGVyLWJvdHRvbTogdHJhbnNwYXJlbnQ7XG4gICAgfVxuXG4gICAgdGQge1xuICAgICAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgIHBhZGRpbmc6IDRweDtcbiAgICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnRleHRDb2xvcn07XG4gICAgfVxuXG4gICAgdGQucm93X192YWx1ZSB7XG4gICAgICB0ZXh0LWFsaWduOiByaWdodDtcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS50ZXh0Q29sb3JIbH07XG4gICAgfVxuICB9XG5gO1xuXG5jb25zdCBTdHlsZWRQaW4gPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDUwJTtcbiAgdHJhbnNmb3JtOiByb3RhdGUoMzBkZWcpO1xuICB0b3A6IDEwcHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnByaW1hcnlCdG5CZ2R9O1xuXG4gIDpob3ZlciB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLmxpbmtCdG5Db2xvcn07XG4gIH1cbmA7XG5cbk1hcFBvcG92ZXJGYWN0b3J5LmRlcHMgPSBbTGF5ZXJIb3ZlckluZm9GYWN0b3J5LCBDb29yZGluYXRlSW5mb0ZhY3RvcnldO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNYXBQb3BvdmVyRmFjdG9yeShMYXllckhvdmVySW5mbywgQ29vcmRpbmF0ZUluZm8pIHtcbiAgY2xhc3MgTWFwUG9wb3ZlciBleHRlbmRzIFB1cmVDb21wb25lbnQge1xuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBsYXllckhvdmVyUHJvcDogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgIGNvb3JkaW5hdGU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5hcnJheSwgUHJvcFR5cGVzLmJvb2xdKSxcbiAgICAgIGZyZWV6ZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgICAgeDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgIHk6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICBtYXBXOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBtYXBIOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICBvbkNsb3NlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICBzdXBlcihwcm9wcyk7XG4gICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICB3aWR0aDogMzgwLFxuICAgICAgICBoZWlnaHQ6IDE2MFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgIHRoaXMuX3NldENvbnRhaW5lclNpemUoKTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgICB0aGlzLl9zZXRDb250YWluZXJTaXplKCk7XG4gICAgfVxuXG4gICAgcG9wb3ZlciA9IGNyZWF0ZVJlZigpO1xuXG4gICAgX3NldENvbnRhaW5lclNpemUoKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5wb3BvdmVyLmN1cnJlbnQ7XG4gICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB3aWR0aCA9IE1hdGgubWluKE1hdGgucm91bmQobm9kZS5zY3JvbGxXaWR0aCksIE1BWF9XSURUSCk7XG4gICAgICBjb25zdCBoZWlnaHQgPSBNYXRoLm1pbihNYXRoLnJvdW5kKG5vZGUuc2Nyb2xsSGVpZ2h0KSwgTUFYX0hFSUdIVCk7XG5cbiAgICAgIGlmICh3aWR0aCAhPT0gdGhpcy5zdGF0ZS53aWR0aCB8fCBoZWlnaHQgIT09IHRoaXMuc3RhdGUuaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3dpZHRoLCBoZWlnaHR9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfZ2V0UG9zaXRpb24oeCwgeSkge1xuICAgICAgY29uc3QgdG9wT2Zmc2V0ID0gMjA7XG4gICAgICBjb25zdCBsZWZ0T2Zmc2V0ID0gMjA7XG4gICAgICBjb25zdCB7bWFwVywgbWFwSH0gPSB0aGlzLnByb3BzO1xuICAgICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIGNvbnN0IHBvcyA9IHt9O1xuICAgICAgaWYgKHggKyBsZWZ0T2Zmc2V0ICsgd2lkdGggPiBtYXBXKSB7XG4gICAgICAgIHBvcy5yaWdodCA9IG1hcFcgLSB4ICsgbGVmdE9mZnNldDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvcy5sZWZ0ID0geCArIGxlZnRPZmZzZXQ7XG4gICAgICB9XG5cbiAgICAgIGlmICh5ICsgdG9wT2Zmc2V0ICsgaGVpZ2h0ID4gbWFwSCkge1xuICAgICAgICBwb3MuYm90dG9tID0gMTA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwb3MudG9wID0geSArIHRvcE9mZnNldDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBvcztcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7eCwgeSwgZnJlZXplZCwgY29vcmRpbmF0ZSwgbGF5ZXJIb3ZlclByb3B9ID0gdGhpcy5wcm9wcztcblxuICAgICAgY29uc3Qgc3R5bGUgPSBOdW1iZXIuaXNGaW5pdGUoeCkgJiYgTnVtYmVyLmlzRmluaXRlKHkpID8gdGhpcy5fZ2V0UG9zaXRpb24oeCwgeSkgOiB7fTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEVycm9yQm91bmRhcnk+XG4gICAgICAgICAgPFN0eWxlZE1hcFBvcG92ZXJcbiAgICAgICAgICAgIHJlZj17dGhpcy5wb3BvdmVyfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwibWFwLXBvcG92ZXJcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgICAgICAgIG1heFdpZHRoOiBNQVhfV0lEVEhcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2ZyZWV6ZWQgPyAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFwLXBvcG92ZXJfX3RvcFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3V0dGVyXCIgLz5cbiAgICAgICAgICAgICAgICA8U3R5bGVkUGluIGNsYXNzTmFtZT1cInBvcG92ZXItcGluXCIgb25DbGljaz17dGhpcy5wcm9wcy5vbkNsb3NlfT5cbiAgICAgICAgICAgICAgICAgIDxQaW4gaGVpZ2h0PVwiMTZweFwiIC8+XG4gICAgICAgICAgICAgICAgPC9TdHlsZWRQaW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICB7QXJyYXkuaXNBcnJheShjb29yZGluYXRlKSAmJiA8Q29vcmRpbmF0ZUluZm8gY29vcmRpbmF0ZT17Y29vcmRpbmF0ZX0gLz59XG4gICAgICAgICAgICB7bGF5ZXJIb3ZlclByb3AgJiYgPExheWVySG92ZXJJbmZvIHsuLi5sYXllckhvdmVyUHJvcH0gLz59XG4gICAgICAgICAgPC9TdHlsZWRNYXBQb3BvdmVyPlxuICAgICAgICA8L0Vycm9yQm91bmRhcnk+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBNYXBQb3BvdmVyO1xufVxuIl19