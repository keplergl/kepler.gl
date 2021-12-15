"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.getChildPos = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _lodash = _interopRequireDefault(require("lodash.debounce"));

var _lodash2 = _interopRequireDefault(require("lodash.isequal"));

var _exenv = require("exenv");

var _styledComponents = require("styled-components");

var _context = require("../context");

var _reactModal = _interopRequireDefault(require("react-modal"));

var _window = _interopRequireDefault(require("global/window"));

var _base = require("../../styles/base");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var listeners = {};

var startListening = function startListening() {
  return Object.keys(listeners).forEach(function (key) {
    return listeners[key]();
  });
};

var getPageOffset = function getPageOffset() {
  return {
    x: _window["default"].pageXOffset !== undefined ? _window["default"].pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft,
    y: _window["default"].pageYOffset !== undefined ? _window["default"].pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
  };
};

var addEventListeners = function addEventListeners() {
  if (document && document.body) document.body.addEventListener('mousewheel', (0, _lodash["default"])(startListening, 100, true));

  _window["default"].addEventListener('resize', (0, _lodash["default"])(startListening, 50, true));
};

var getChildPos = function getChildPos(_ref) {
  var offsets = _ref.offsets,
      rect = _ref.rect,
      childRect = _ref.childRect,
      pageOffset = _ref.pageOffset,
      padding = _ref.padding;
  var topOffset = offsets.topOffset,
      leftOffset = offsets.leftOffset,
      rightOffset = offsets.rightOffset;
  var anchorLeft = leftOffset !== undefined;

  var pos = _objectSpread({
    top: pageOffset.y + rect.top + (topOffset || 0)
  }, anchorLeft ? {
    left: pageOffset.x + rect.left + leftOffset
  } : {
    right: _window["default"].innerWidth - rect.right - pageOffset.x + (rightOffset || 0)
  });

  var leftOrRight = anchorLeft ? 'left' : 'right';

  if (pos[leftOrRight] && pos[leftOrRight] < 0) {
    pos[leftOrRight] = padding;
  } else if (pos[leftOrRight] && pos[leftOrRight] + childRect.width > _window["default"].innerWidth) {
    pos[leftOrRight] = _window["default"].innerWidth - childRect.width - padding;
  }

  if (pos.top < 0) {
    pos.top = padding;
  } else if (pos.top + childRect.height > _window["default"].innerHeight) {
    pos.top = _window["default"].innerHeight - childRect.height - padding;
  }

  return pos;
};

exports.getChildPos = getChildPos;

if (_exenv.canUseDOM) {
  if (document.body) {
    addEventListeners();
  } else {
    document.addEventListener('DOMContentLoaded', addEventListeners);
  }
}

var listenerIdCounter = 0;

function subscribe(fn) {
  listenerIdCounter += 1;
  var id = listenerIdCounter;
  listeners[id] = fn;
  return function () {
    return delete listeners[id];
  };
}

var defaultModalStyle = {
  content: {
    top: 0,
    left: 0,
    border: 0,
    right: 'auto',
    bottom: 'auto',
    padding: '0px 0px 0px 0px'
  },
  overlay: {
    right: 'auto',
    bottom: 'auto',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
};
var WINDOW_PAD = 40;

var noop = function noop() {};

var Portaled = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(Portaled, _Component);

  var _super = _createSuper(Portaled);

  function Portaled() {
    var _this;

    (0, _classCallCheck2["default"])(this, Portaled);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
      pos: null,
      isVisible: false
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "element", /*#__PURE__*/(0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "child", /*#__PURE__*/(0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleScroll", function () {
      if (_this.child.current) {
        var rect = _this.element.current.getBoundingClientRect();

        var childRect = _this.child.current && _this.child.current.getBoundingClientRect();

        var pageOffset = getPageOffset();
        var _this$props = _this.props,
            topOffset = _this$props.top,
            leftOffset = _this$props.left,
            rightOffset = _this$props.right;
        var pos = getChildPos({
          offsets: {
            topOffset: topOffset,
            leftOffset: leftOffset,
            rightOffset: rightOffset
          },
          rect: rect,
          childRect: childRect,
          pageOffset: pageOffset,
          padding: WINDOW_PAD
        });

        if (!(0, _lodash2["default"])(pos, _this.state.pos)) {
          _this.setState({
            pos: pos
          });
        }
      }
    });
    return _this;
  }

  (0, _createClass2["default"])(Portaled, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // relative
      this.unsubscribe = subscribe(this.handleScroll);
      this.handleScroll();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;

      var didOpen = this.props.isOpened && !prevProps.isOpened;
      var didClose = !this.props.isOpened && prevProps.isOpened;

      if (didOpen || didClose) {
        _window["default"].requestAnimationFrame(function () {
          if (_this2._unmounted) return;

          _this2.setState({
            isVisible: didOpen
          });
        });
      }

      this.handleScroll();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._unmounted = true; // @ts-ignore

      this.unsubscribe();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props2 = this.props,
          Comp = _this$props2.component,
          overlayZIndex = _this$props2.overlayZIndex,
          isOpened = _this$props2.isOpened,
          onClose = _this$props2.onClose,
          children = _this$props2.children,
          modalProps = _this$props2.modalProps,
          _this$props2$modalSty = _this$props2.modalStyle,
          modalStyle = _this$props2$modalSty === void 0 ? {} : _this$props2$modalSty;
      var _this$state = this.state,
          isVisible = _this$state.isVisible,
          pos = _this$state.pos;

      var newModalStyle = _objectSpread(_objectSpread({}, defaultModalStyle), {}, {
        content: _objectSpread({}, modalStyle.content || {}),
        overlay: _objectSpread(_objectSpread(_objectSpread({}, defaultModalStyle.overlay), modalStyle.overlay || {}), {}, {
          // needs to be on top of existing modal
          zIndex: overlayZIndex || 9999
        })
      });

      return /*#__PURE__*/_react["default"].createElement(_context.RootContext.Consumer, null, function (context) {
        return /*#__PURE__*/_react["default"].createElement(Comp, {
          ref: _this3.element
        }, isOpened ? /*#__PURE__*/_react["default"].createElement(_reactModal["default"], (0, _extends2["default"])({
          className: "modal-portal"
        }, modalProps, {
          ariaHideApp: false,
          isOpen: true,
          style: newModalStyle,
          parentSelector: function parentSelector() {
            // React modal issue: https://github.com/reactjs/react-modal/issues/769
            // failed to execute removeChild on parent node when it is already unmounted
            return (// @ts-ignore
              context && context.current || {
                removeChild: function removeChild() {},
                appendChild: function appendChild() {}
              }
            );
          },
          onRequestClose: onClose
        }), /*#__PURE__*/_react["default"].createElement("div", {
          className: "portaled-content",
          key: "item",
          style: _objectSpread({
            position: 'fixed',
            opacity: isVisible ? 1 : 0,
            top: _this3.state.top,
            transition: _this3.props.theme.transition,
            marginTop: isVisible ? '0px' : '14px'
          }, pos)
        }, /*#__PURE__*/_react["default"].createElement("div", {
          ref: _this3.child,
          style: {
            position: 'absolute',
            zIndex: overlayZIndex ? overlayZIndex + 1 : 10000
          }
        }, children))) : null);
      });
    }
  }]);
  return Portaled;
}(_react.Component);

(0, _defineProperty2["default"])(Portaled, "defaultProps", {
  component: 'div',
  onClose: noop,
  theme: _base.theme
});

var _default = (0, _styledComponents.withTheme)(Portaled);

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wb3J0YWxlZC5qcyJdLCJuYW1lcyI6WyJsaXN0ZW5lcnMiLCJzdGFydExpc3RlbmluZyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwiZ2V0UGFnZU9mZnNldCIsIngiLCJ3aW5kb3ciLCJwYWdlWE9mZnNldCIsInVuZGVmaW5lZCIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsInBhcmVudE5vZGUiLCJzY3JvbGxMZWZ0IiwieSIsInBhZ2VZT2Zmc2V0Iiwic2Nyb2xsVG9wIiwiYWRkRXZlbnRMaXN0ZW5lcnMiLCJhZGRFdmVudExpc3RlbmVyIiwiZ2V0Q2hpbGRQb3MiLCJvZmZzZXRzIiwicmVjdCIsImNoaWxkUmVjdCIsInBhZ2VPZmZzZXQiLCJwYWRkaW5nIiwidG9wT2Zmc2V0IiwibGVmdE9mZnNldCIsInJpZ2h0T2Zmc2V0IiwiYW5jaG9yTGVmdCIsInBvcyIsInRvcCIsImxlZnQiLCJyaWdodCIsImlubmVyV2lkdGgiLCJsZWZ0T3JSaWdodCIsIndpZHRoIiwiaGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJjYW5Vc2VET00iLCJsaXN0ZW5lcklkQ291bnRlciIsInN1YnNjcmliZSIsImZuIiwiaWQiLCJkZWZhdWx0TW9kYWxTdHlsZSIsImNvbnRlbnQiLCJib3JkZXIiLCJib3R0b20iLCJvdmVybGF5IiwiYmFja2dyb3VuZENvbG9yIiwiV0lORE9XX1BBRCIsIm5vb3AiLCJQb3J0YWxlZCIsImlzVmlzaWJsZSIsImNoaWxkIiwiY3VycmVudCIsImVsZW1lbnQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJwcm9wcyIsInN0YXRlIiwic2V0U3RhdGUiLCJ1bnN1YnNjcmliZSIsImhhbmRsZVNjcm9sbCIsInByZXZQcm9wcyIsImRpZE9wZW4iLCJpc09wZW5lZCIsImRpZENsb3NlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiX3VubW91bnRlZCIsIkNvbXAiLCJjb21wb25lbnQiLCJvdmVybGF5WkluZGV4Iiwib25DbG9zZSIsImNoaWxkcmVuIiwibW9kYWxQcm9wcyIsIm1vZGFsU3R5bGUiLCJuZXdNb2RhbFN0eWxlIiwiekluZGV4IiwiY29udGV4dCIsInJlbW92ZUNoaWxkIiwiYXBwZW5kQ2hpbGQiLCJwb3NpdGlvbiIsIm9wYWNpdHkiLCJ0cmFuc2l0aW9uIiwidGhlbWUiLCJtYXJnaW5Ub3AiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFNBQVMsR0FBRyxFQUFsQjs7QUFFQSxJQUFNQyxjQUFjLEdBQUcsU0FBakJBLGNBQWlCO0FBQUEsU0FBTUMsTUFBTSxDQUFDQyxJQUFQLENBQVlILFNBQVosRUFBdUJJLE9BQXZCLENBQStCLFVBQUFDLEdBQUc7QUFBQSxXQUFJTCxTQUFTLENBQUNLLEdBQUQsQ0FBVCxFQUFKO0FBQUEsR0FBbEMsQ0FBTjtBQUFBLENBQXZCOztBQUVBLElBQU1DLGFBQWEsR0FBRyxTQUFoQkEsYUFBZ0I7QUFBQSxTQUFPO0FBQzNCQyxJQUFBQSxDQUFDLEVBQ0NDLG1CQUFPQyxXQUFQLEtBQXVCQyxTQUF2QixHQUNJRixtQkFBT0MsV0FEWCxHQUVJLENBQUNFLFFBQVEsQ0FBQ0MsZUFBVCxJQUE0QkQsUUFBUSxDQUFDRSxJQUFULENBQWNDLFVBQTFDLElBQXdESCxRQUFRLENBQUNFLElBQWxFLEVBQXdFRSxVQUpuRDtBQUszQkMsSUFBQUEsQ0FBQyxFQUNDUixtQkFBT1MsV0FBUCxLQUF1QlAsU0FBdkIsR0FDSUYsbUJBQU9TLFdBRFgsR0FFSSxDQUFDTixRQUFRLENBQUNDLGVBQVQsSUFBNEJELFFBQVEsQ0FBQ0UsSUFBVCxDQUFjQyxVQUExQyxJQUF3REgsUUFBUSxDQUFDRSxJQUFsRSxFQUF3RUs7QUFSbkQsR0FBUDtBQUFBLENBQXRCOztBQVdBLElB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LFVBREw7QUFFTEosWUFBQUEsTUFBTSxFQUFFTixhQUFhLEdBQUdBLGFBQWEsR0FBRyxDQUFuQixHQUF1QjtBQUZ2QztBQUZULFdBT0dFLFFBUEgsQ0FiRixDQW5CRixDQURPLEdBNENMLElBN0NOLENBRE07QUFBQSxPQURWLENBREY7QUFxREQ7OztFQWhKb0JhLGdCOztpQ0FBakJsQyxRLGtCQUNrQjtBQUNwQmtCLEVBQUFBLFNBQVMsRUFBRSxLQURTO0FBRXBCRSxFQUFBQSxPQUFPLEVBQUVyQixJQUZXO0FBR3BCaUMsRUFBQUEsS0FBSyxFQUFMQTtBQUhvQixDOztlQWtKVCxpQ0FBVWhDLFFBQVYsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudCwgY3JlYXRlUmVmfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnbG9kYXNoLmRlYm91bmNlJztcbmltcG9ydCBpc0VxdWFsIGZyb20gJ2xvZGFzaC5pc2VxdWFsJztcblxuaW1wb3J0IHtjYW5Vc2VET019IGZyb20gJ2V4ZW52JztcbmltcG9ydCB7d2l0aFRoZW1lfSBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQge1Jvb3RDb250ZXh0fSBmcm9tICdjb21wb25lbnRzL2NvbnRleHQnO1xuaW1wb3J0IE1vZGFsIGZyb20gJ3JlYWN0LW1vZGFsJztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQge3RoZW1lfSBmcm9tICdzdHlsZXMvYmFzZSc7XG5cbmNvbnN0IGxpc3RlbmVycyA9IHt9O1xuXG5jb25zdCBzdGFydExpc3RlbmluZyA9ICgpID0+IE9iamVjdC5rZXlzKGxpc3RlbmVycykuZm9yRWFjaChrZXkgPT4gbGlzdGVuZXJzW2tleV0oKSk7XG5cbmNvbnN0IGdldFBhZ2VPZmZzZXQgPSAoKSA9PiAoe1xuICB4OlxuICAgIHdpbmRvdy5wYWdlWE9mZnNldCAhPT0gdW5kZWZpbmVkXG4gICAgICA/IHdpbmRvdy5wYWdlWE9mZnNldFxuICAgICAgOiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZSB8fCBkb2N1bWVudC5ib2R5KS5zY3JvbGxMZWZ0LFxuICB5OlxuICAgIHdpbmRvdy5wYWdlWU9mZnNldCAhPT0gdW5kZWZpbmVkXG4gICAgICA/IHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICAgOiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZSB8fCBkb2N1bWVudC5ib2R5KS5zY3JvbGxUb3Bcbn0pO1xuXG5jb25zdCBhZGRFdmVudExpc3RlbmVycyA9ICgpID0+IHtcbiAgaWYgKGRvY3VtZW50ICYmIGRvY3VtZW50LmJvZHkpXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJywgZGVib3VuY2Uoc3RhcnRMaXN0ZW5pbmcsIDEwMCwgdHJ1ZSkpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZGVib3VuY2Uoc3RhcnRMaXN0ZW5pbmcsIDUwLCB0cnVlKSk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Q2hpbGRQb3MgPSAoe29mZnNldHMsIHJlY3QsIGNoaWxkUmVjdCwgcGFnZU9mZnNldCwgcGFkZGluZ30pID0+IHtcbiAgY29uc3Qge3RvcE9mZnNldCwgbGVmdE9mZnNldCwgcmlnaHRPZmZzZXR9ID0gb2Zmc2V0cztcblxuICBjb25zdCBhbmNob3JMZWZ0ID0gbGVmdE9mZnNldCAhPT0gdW5kZWZpbmVkO1xuICBjb25zdCBwb3MgPSB7XG4gICAgdG9wOiBwYWdlT2Zmc2V0LnkgKyByZWN0LnRvcCArICh0b3BPZmZzZXQgfHwgMCksXG4gICAgLi4uKGFuY2hvckxlZnRcbiAgICAgID8ge2xlZnQ6IHBhZ2VPZmZzZXQueCArIHJlY3QubGVmdCArIGxlZnRPZmZzZXR9XG4gICAgICA6IHtyaWdodDogd2luZG93LmlubmVyV2lkdGggLSByZWN0LnJpZ2h0IC0gcGFnZU9mZnNldC54ICsgKHJpZ2h0T2Zmc2V0IHx8IDApfSlcbiAgfTtcblxuICBjb25zdCBsZWZ0T3JSaWdodCA9IGFuY2hvckxlZnQgPyAnbGVmdCcgOiAncmlnaHQnO1xuXG4gIGlmIChwb3NbbGVmdE9yUmlnaHRdICYmIHBvc1tsZWZ0T3JSaWdodF0gPCAwKSB7XG4gICAgcG9zW2xlZnRPclJpZ2h0XSA9IHBhZGRpbmc7XG4gIH0gZWxzZSBpZiAocG9zW2xlZnRPclJpZ2h0XSAmJiBwb3NbbGVmdE9yUmlnaHRdICsgY2hpbGRSZWN0LndpZHRoID4gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICBwb3NbbGVmdE9yUmlnaHRdID0gd2luZG93LmlubmVyV2lkdGggLSBjaGlsZFJlY3Qud2lkdGggLSBwYWRkaW5nO1xuICB9XG5cbiAgaWYgKHBvcy50b3AgPCAwKSB7XG4gICAgcG9zLnRvcCA9IHBhZGRpbmc7XG4gIH0gZWxzZSBpZiAocG9zLnRvcCArIGNoaWxkUmVjdC5oZWlnaHQgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICBwb3MudG9wID0gd2luZG93LmlubmVySGVpZ2h0IC0gY2hpbGRSZWN0LmhlaWdodCAtIHBhZGRpbmc7XG4gIH1cblxuICByZXR1cm4gcG9zO1xufTtcblxuaWYgKGNhblVzZURPTSkge1xuICBpZiAoZG9jdW1lbnQuYm9keSkge1xuICAgIGFkZEV2ZW50TGlzdGVuZXJzKCk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGFkZEV2ZW50TGlzdGVuZXJzKTtcbiAgfVxufVxuXG5sZXQgbGlzdGVuZXJJZENvdW50ZXIgPSAwO1xuZnVuY3Rpb24gc3Vic2NyaWJlKGZuKSB7XG4gIGxpc3RlbmVySWRDb3VudGVyICs9IDE7XG4gIGNvbnN0IGlkID0gbGlzdGVuZXJJZENvdW50ZXI7XG4gIGxpc3RlbmVyc1tpZF0gPSBmbjtcbiAgcmV0dXJuICgpID0+IGRlbGV0ZSBsaXN0ZW5lcnNbaWRdO1xufVxuXG5jb25zdCBkZWZhdWx0TW9kYWxTdHlsZSA9IHtcbiAgY29udGVudDoge1xuICAgIHRvcDogMCxcbiAgICBsZWZ0OiAwLFxuICAgIGJvcmRlcjogMCxcbiAgICByaWdodDogJ2F1dG8nLFxuICAgIGJvdHRvbTogJ2F1dG8nLFxuICAgIHBhZGRpbmc6ICcwcHggMHB4IDBweCAwcHgnXG4gIH0sXG4gIG92ZXJsYXk6IHtcbiAgICByaWdodDogJ2F1dG8nLFxuICAgIGJvdHRvbTogJ2F1dG8nLFxuICAgIHdpZHRoOiAnMTAwdncnLFxuICAgIGhlaWdodDogJzEwMHZoJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDApJ1xuICB9XG59O1xuXG5jb25zdCBXSU5ET1dfUEFEID0gNDA7XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcblxuY2xhc3MgUG9ydGFsZWQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNvbXBvbmVudDogJ2RpdicsXG4gICAgb25DbG9zZTogbm9vcCxcbiAgICB0aGVtZVxuICB9O1xuXG4gIHN0YXRlID0ge1xuICAgIHBvczogbnVsbCxcbiAgICBpc1Zpc2libGU6IGZhbHNlXG4gIH07XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gcmVsYXRpdmVcbiAgICB0aGlzLnVuc3Vic2NyaWJlID0gc3Vic2NyaWJlKHRoaXMuaGFuZGxlU2Nyb2xsKTtcbiAgICB0aGlzLmhhbmRsZVNjcm9sbCgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGNvbnN0IGRpZE9wZW4gPSB0aGlzLnByb3BzLmlzT3BlbmVkICYmICFwcmV2UHJvcHMuaXNPcGVuZWQ7XG4gICAgY29uc3QgZGlkQ2xvc2UgPSAhdGhpcy5wcm9wcy5pc09wZW5lZCAmJiBwcmV2UHJvcHMuaXNPcGVuZWQ7XG4gICAgaWYgKGRpZE9wZW4gfHwgZGlkQ2xvc2UpIHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fdW5tb3VudGVkKSByZXR1cm47XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzVmlzaWJsZTogZGlkT3Blbn0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVTY3JvbGwoKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuX3VubW91bnRlZCA9IHRydWU7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIGVsZW1lbnQgPSBjcmVhdGVSZWYoKTtcbiAgY2hpbGQgPSBjcmVhdGVSZWYoKTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxuICBoYW5kbGVTY3JvbGwgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuY2hpbGQuY3VycmVudCkge1xuICAgICAgY29uc3QgcmVjdCA9IHRoaXMuZWxlbWVudC5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgY2hpbGRSZWN0ID0gdGhpcy5jaGlsZC5jdXJyZW50ICYmIHRoaXMuY2hpbGQuY3VycmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHBhZ2VPZmZzZXQgPSBnZXRQYWdlT2Zmc2V0KCk7XG4gICAgICBjb25zdCB7dG9wOiB0b3BPZmZzZXQsIGxlZnQ6IGxlZnRPZmZzZXQsIHJpZ2h0OiByaWdodE9mZnNldH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBjb25zdCBwb3MgPSBnZXRDaGlsZFBvcyh7XG4gICAgICAgIG9mZnNldHM6IHt0b3BPZmZzZXQsIGxlZnRPZmZzZXQsIHJpZ2h0T2Zmc2V0fSxcbiAgICAgICAgcmVjdCxcbiAgICAgICAgY2hpbGRSZWN0LFxuICAgICAgICBwYWdlT2Zmc2V0LFxuICAgICAgICBwYWRkaW5nOiBXSU5ET1dfUEFEXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFpc0VxdWFsKHBvcywgdGhpcy5zdGF0ZS5wb3MpKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3Bvc30pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgLy8gcmVsYXRpdmVcbiAgICAgIGNvbXBvbmVudDogQ29tcCxcbiAgICAgIG92ZXJsYXlaSW5kZXgsXG4gICAgICBpc09wZW5lZCxcbiAgICAgIG9uQ2xvc2UsXG5cbiAgICAgIC8vIE1vZGFsXG4gICAgICBjaGlsZHJlbixcbiAgICAgIG1vZGFsUHJvcHMsXG4gICAgICBtb2RhbFN0eWxlID0ge31cbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHtpc1Zpc2libGUsIHBvc30gPSB0aGlzLnN0YXRlO1xuXG4gICAgY29uc3QgbmV3TW9kYWxTdHlsZSA9IHtcbiAgICAgIC4uLmRlZmF1bHRNb2RhbFN0eWxlLFxuICAgICAgY29udGVudDoge1xuICAgICAgICAuLi4obW9kYWxTdHlsZS5jb250ZW50IHx8IHt9KVxuICAgICAgfSxcbiAgICAgIG92ZXJsYXk6IHtcbiAgICAgICAgLi4uZGVmYXVsdE1vZGFsU3R5bGUub3ZlcmxheSxcbiAgICAgICAgLi4uKG1vZGFsU3R5bGUub3ZlcmxheSB8fCB7fSksXG4gICAgICAgIC8vIG5lZWRzIHRvIGJlIG9uIHRvcCBvZiBleGlzdGluZyBtb2RhbFxuICAgICAgICB6SW5kZXg6IG92ZXJsYXlaSW5kZXggfHwgOTk5OVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFJvb3RDb250ZXh0LkNvbnN1bWVyPlxuICAgICAgICB7Y29udGV4dCA9PiAoXG4gICAgICAgICAgPENvbXAgcmVmPXt0aGlzLmVsZW1lbnR9PlxuICAgICAgICAgICAge2lzT3BlbmVkID8gKFxuICAgICAgICAgICAgICA8TW9kYWxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtb2RhbC1wb3J0YWxcIlxuICAgICAgICAgICAgICAgIHsuLi5tb2RhbFByb3BzfVxuICAgICAgICAgICAgICAgIGFyaWFIaWRlQXBwPXtmYWxzZX1cbiAgICAgICAgICAgICAgICBpc09wZW5cbiAgICAgICAgICAgICAgICBzdHlsZT17bmV3TW9kYWxTdHlsZX1cbiAgICAgICAgICAgICAgICBwYXJlbnRTZWxlY3Rvcj17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgLy8gUmVhY3QgbW9kYWwgaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9yZWFjdGpzL3JlYWN0LW1vZGFsL2lzc3Vlcy83NjlcbiAgICAgICAgICAgICAgICAgIC8vIGZhaWxlZCB0byBleGVjdXRlIHJlbW92ZUNoaWxkIG9uIHBhcmVudCBub2RlIHdoZW4gaXQgaXMgYWxyZWFkeSB1bm1vdW50ZWRcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgKGNvbnRleHQgJiYgY29udGV4dC5jdXJyZW50KSB8fCB7XG4gICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQ2hpbGQ6ICgpID0+IHt9LFxuICAgICAgICAgICAgICAgICAgICAgIGFwcGVuZENoaWxkOiAoKSA9PiB7fVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgb25SZXF1ZXN0Q2xvc2U9e29uQ2xvc2V9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwb3J0YWxlZC1jb250ZW50XCJcbiAgICAgICAgICAgICAgICAgIGtleT1cIml0ZW1cIlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IGlzVmlzaWJsZSA/IDEgOiAwLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUudG9wLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB0aGlzLnByb3BzLnRoZW1lLnRyYW5zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpblRvcDogaXNWaXNpYmxlID8gJzBweCcgOiAnMTRweCcsXG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgLi4ucG9zXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgcmVmPXt0aGlzLmNoaWxkfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogb3ZlcmxheVpJbmRleCA/IG92ZXJsYXlaSW5kZXggKyAxIDogMTAwMDBcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvTW9kYWw+XG4gICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICA8L0NvbXA+XG4gICAgICAgICl9XG4gICAgICA8L1Jvb3RDb250ZXh0LkNvbnN1bWVyPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgd2l0aFRoZW1lKFBvcnRhbGVkKTtcbiJdfQ==