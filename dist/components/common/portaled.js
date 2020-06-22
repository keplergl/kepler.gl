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

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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

var Portaled =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Portaled, _Component);

  function Portaled() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2["default"])(this, Portaled);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(Portaled)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "state", {
      pos: null,
      isVisible: false
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "element", (0, _react.createRef)());
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "child", (0, _react.createRef)());
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
      this._unmounted = true;
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
          modalProps = _this$props2.modalProps;
      var _this$state = this.state,
          isVisible = _this$state.isVisible,
          pos = _this$state.pos;

      var modalStyle = _objectSpread({}, defaultModalStyle, {
        overlay: _objectSpread({}, defaultModalStyle.overlay, {
          // needs to be on top of existing modal
          zIndex: overlayZIndex || 9999
        })
      });

      return _react["default"].createElement(_context.RootContext.Consumer, null, function (context) {
        return _react["default"].createElement(Comp, {
          ref: _this3.element
        }, isOpened ? _react["default"].createElement(_reactModal["default"], (0, _extends2["default"])({
          className: "modal-portal"
        }, modalProps, {
          ariaHideApp: false,
          isOpen: true,
          style: modalStyle,
          parentSelector: function parentSelector() {
            // React modal issue: https://github.com/reactjs/react-modal/issues/769
            // failed to execute removeChild on parent node when it is already unmounted
            return context && context.current || {
              removeChild: function removeChild() {},
              appendChild: function appendChild() {}
            };
          },
          onRequestClose: onClose
        }), _react["default"].createElement("div", {
          className: "portaled-content",
          key: "item",
          style: _objectSpread({
            position: 'fixed',
            opacity: isVisible ? 1 : 0,
            top: _this3.state.top,
            transition: _this3.props.theme.transition,
            marginTop: isVisible ? '0px' : '14px'
          }, pos)
        }, _react["default"].createElement("div", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wb3J0YWxlZC5qcyJdLCJuYW1lcyI6WyJsaXN0ZW5lcnMiLCJzdGFydExpc3RlbmluZyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwiZ2V0UGFnZU9mZnNldCIsIngiLCJ3aW5kb3ciLCJwYWdlWE9mZnNldCIsInVuZGVmaW5lZCIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsInBhcmVudE5vZGUiLCJzY3JvbGxMZWZ0IiwieSIsInBhZ2VZT2Zmc2V0Iiwic2Nyb2xsVG9wIiwiYWRkRXZlbnRMaXN0ZW5lcnMiLCJhZGRFdmVudExpc3RlbmVyIiwiZ2V0Q2hpbGRQb3MiLCJvZmZzZXRzIiwicmVjdCIsImNoaWxkUmVjdCIsInBhZ2VPZmZzZXQiLCJwYWRkaW5nIiwidG9wT2Zmc2V0IiwibGVmdE9mZnNldCIsInJpZ2h0T2Zmc2V0IiwiYW5jaG9yTGVmdCIsInBvcyIsInRvcCIsImxlZnQiLCJyaWdodCIsImlubmVyV2lkdGgiLCJsZWZ0T3JSaWdodCIsIndpZHRoIiwiaGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJjYW5Vc2VET00iLCJsaXN0ZW5lcklkQ291bnRlciIsInN1YnNjcmliZSIsImZuIiwiaWQiLCJkZWZhdWx0TW9kYWxTdHlsZSIsImNvbnRlbnQiLCJib3JkZXIiLCJib3R0b20iLCJvdmVybGF5IiwiYmFja2dyb3VuZENvbG9yIiwiV0lORE9XX1BBRCIsIm5vb3AiLCJQb3J0YWxlZCIsImlzVmlzaWJsZSIsImNoaWxkIiwiY3VycmVudCIsImVsZW1lbnQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJwcm9wcyIsInN0YXRlIiwic2V0U3RhdGUiLCJ1bnN1YnNjcmliZSIsImhhbmRsZVNjcm9sbCIsInByZXZQcm9wcyIsImRpZE9wZW4iLCJpc09wZW5lZCIsImRpZENsb3NlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiX3VubW91bnRlZCIsIkNvbXAiLCJjb21wb25lbnQiLCJvdmVybGF5WkluZGV4Iiwib25DbG9zZSIsImNoaWxkcmVuIiwibW9kYWxQcm9wcyIsIm1vZGFsU3R5bGUiLCJ6SW5kZXgiLCJjb250ZXh0IiwicmVtb3ZlQ2hpbGQiLCJhcHBlbmRDaGlsZCIsInBvc2l0aW9uIiwib3BhY2l0eSIsInRyYW5zaXRpb24iLCJ0aGVtZSIsIm1hcmdpblRvcCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUcsRUFBbEI7O0FBRUEsSUFBTUMsY0FBYyxHQUFHLFNBQWpCQSxjQUFpQjtBQUFBLFNBQU1DLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSCxTQUFaLEVBQXVCSSxPQUF2QixDQUErQixVQUFBQyxHQUFHO0FBQUEsV0FBSUwsU0FBUyxDQUFDSyxHQUFELENBQVQsRUFBSjtBQUFBLEdBQWxDLENBQU47QUFBQSxDQUF2Qjs7QUFFQSxJQUFNQyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCO0FBQUEsU0FBTztBQUMzQkMsSUFBQUEsQ0FBQyxFQUNDQyxtQkFBT0MsV0FBUCxLQUF1QkMsU0FBdkIsR0FDSUYsbUJBQU9DLFdBRFgsR0FFSSxDQUFDRSxRQUFRLENBQUNDLGVBQVQsSUFBNEJELFFBQVEsQ0FBQ0UsSUFBVCxDQUFjQyxVQUExQyxJQUF3REgsUUFBUSxDQUFDRSxJQUFsRSxFQUF3RUUsVUFKbkQ7QUFLM0JDLElBQUFBLENBQUMsRUFDQ1IsbUJBQU9TLFdBQVAsS0FBdUJQLFNBQXZCLEdBQ0lGLG1CQUFPUyxXQURYLEdBRUksQ0FBQ04sUUFBUSxDQUFDQyxlQUFULElBQTRCRCxRQUFRLENBQUNFLElBQVQsQ0FBY0MsVUFBMUMsSUFBd0RILFFBQVEsQ0FBQ0UsSUFBbEUsRUFBd0VLO0FBUm5ELEdBQVA7QUFBQSxDQUF0Qjs7QUFXQSxJQUFNQyxpQkFBaUIsR0FBRyxTQUFw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QUFFckIsSUFGVztBQUdwQmdDLEVBQUFBLEtBQUssRUFBTEE7QUFIb0IsQzs7ZUEwSVQsaUNBQVUvQixRQUFWLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgUmVhY3QsIHtDb21wb25lbnQsIGNyZWF0ZVJlZn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ2xvZGFzaC5kZWJvdW5jZSc7XG5pbXBvcnQgaXNFcXVhbCBmcm9tICdsb2Rhc2guaXNlcXVhbCc7XG5cbmltcG9ydCB7Y2FuVXNlRE9NfSBmcm9tICdleGVudic7XG5pbXBvcnQge3dpdGhUaGVtZX0gZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHtSb290Q29udGV4dH0gZnJvbSAnY29tcG9uZW50cy9jb250ZXh0JztcbmltcG9ydCBNb2RhbCBmcm9tICdyZWFjdC1tb2RhbCc7XG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IHt0aGVtZX0gZnJvbSAnc3R5bGVzL2Jhc2UnO1xuXG5jb25zdCBsaXN0ZW5lcnMgPSB7fTtcblxuY29uc3Qgc3RhcnRMaXN0ZW5pbmcgPSAoKSA9PiBPYmplY3Qua2V5cyhsaXN0ZW5lcnMpLmZvckVhY2goa2V5ID0+IGxpc3RlbmVyc1trZXldKCkpO1xuXG5jb25zdCBnZXRQYWdlT2Zmc2V0ID0gKCkgPT4gKHtcbiAgeDpcbiAgICB3aW5kb3cucGFnZVhPZmZzZXQgIT09IHVuZGVmaW5lZFxuICAgICAgPyB3aW5kb3cucGFnZVhPZmZzZXRcbiAgICAgIDogKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fCBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUgfHwgZG9jdW1lbnQuYm9keSkuc2Nyb2xsTGVmdCxcbiAgeTpcbiAgICB3aW5kb3cucGFnZVlPZmZzZXQgIT09IHVuZGVmaW5lZFxuICAgICAgPyB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICAgIDogKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fCBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUgfHwgZG9jdW1lbnQuYm9keSkuc2Nyb2xsVG9wXG59KTtcblxuY29uc3QgYWRkRXZlbnRMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gIGlmIChkb2N1bWVudCAmJiBkb2N1bWVudC5ib2R5KVxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsIGRlYm91bmNlKHN0YXJ0TGlzdGVuaW5nLCAxMDAsIHRydWUpKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGRlYm91bmNlKHN0YXJ0TGlzdGVuaW5nLCA1MCwgdHJ1ZSkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldENoaWxkUG9zID0gKHtvZmZzZXRzLCByZWN0LCBjaGlsZFJlY3QsIHBhZ2VPZmZzZXQsIHBhZGRpbmd9KSA9PiB7XG4gIGNvbnN0IHt0b3BPZmZzZXQsIGxlZnRPZmZzZXQsIHJpZ2h0T2Zmc2V0fSA9IG9mZnNldHM7XG5cbiAgY29uc3QgYW5jaG9yTGVmdCA9IGxlZnRPZmZzZXQgIT09IHVuZGVmaW5lZDtcbiAgY29uc3QgcG9zID0ge1xuICAgIHRvcDogcGFnZU9mZnNldC55ICsgcmVjdC50b3AgKyAodG9wT2Zmc2V0IHx8IDApLFxuICAgIC4uLihhbmNob3JMZWZ0XG4gICAgICA/IHtsZWZ0OiBwYWdlT2Zmc2V0LnggKyByZWN0LmxlZnQgKyBsZWZ0T2Zmc2V0fVxuICAgICAgOiB7cmlnaHQ6IHdpbmRvdy5pbm5lcldpZHRoIC0gcmVjdC5yaWdodCAtIHBhZ2VPZmZzZXQueCArIChyaWdodE9mZnNldCB8fCAwKX0pXG4gIH07XG5cbiAgY29uc3QgbGVmdE9yUmlnaHQgPSBhbmNob3JMZWZ0ID8gJ2xlZnQnIDogJ3JpZ2h0JztcblxuICBpZiAocG9zW2xlZnRPclJpZ2h0XSAmJiBwb3NbbGVmdE9yUmlnaHRdIDwgMCkge1xuICAgIHBvc1tsZWZ0T3JSaWdodF0gPSBwYWRkaW5nO1xuICB9IGVsc2UgaWYgKHBvc1tsZWZ0T3JSaWdodF0gJiYgcG9zW2xlZnRPclJpZ2h0XSArIGNoaWxkUmVjdC53aWR0aCA+IHdpbmRvdy5pbm5lcldpZHRoKSB7XG4gICAgcG9zW2xlZnRPclJpZ2h0XSA9IHdpbmRvdy5pbm5lcldpZHRoIC0gY2hpbGRSZWN0LndpZHRoIC0gcGFkZGluZztcbiAgfVxuXG4gIGlmIChwb3MudG9wIDwgMCkge1xuICAgIHBvcy50b3AgPSBwYWRkaW5nO1xuICB9IGVsc2UgaWYgKHBvcy50b3AgKyBjaGlsZFJlY3QuaGVpZ2h0ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgcG9zLnRvcCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIGNoaWxkUmVjdC5oZWlnaHQgLSBwYWRkaW5nO1xuICB9XG5cbiAgcmV0dXJuIHBvcztcbn07XG5cbmlmIChjYW5Vc2VET00pIHtcbiAgaWYgKGRvY3VtZW50LmJvZHkpIHtcbiAgICBhZGRFdmVudExpc3RlbmVycygpO1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBhZGRFdmVudExpc3RlbmVycyk7XG4gIH1cbn1cblxubGV0IGxpc3RlbmVySWRDb3VudGVyID0gMDtcbmZ1bmN0aW9uIHN1YnNjcmliZShmbikge1xuICBsaXN0ZW5lcklkQ291bnRlciArPSAxO1xuICBjb25zdCBpZCA9IGxpc3RlbmVySWRDb3VudGVyO1xuICBsaXN0ZW5lcnNbaWRdID0gZm47XG4gIHJldHVybiAoKSA9PiBkZWxldGUgbGlzdGVuZXJzW2lkXTtcbn1cblxuY29uc3QgZGVmYXVsdE1vZGFsU3R5bGUgPSB7XG4gIGNvbnRlbnQ6IHtcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogMCxcbiAgICBib3JkZXI6IDAsXG4gICAgcmlnaHQ6ICdhdXRvJyxcbiAgICBib3R0b206ICdhdXRvJyxcbiAgICBwYWRkaW5nOiAnMHB4IDBweCAwcHggMHB4J1xuICB9LFxuICBvdmVybGF5OiB7XG4gICAgcmlnaHQ6ICdhdXRvJyxcbiAgICBib3R0b206ICdhdXRvJyxcbiAgICB3aWR0aDogJzEwMHZ3JyxcbiAgICBoZWlnaHQ6ICcxMDB2aCcsXG4gICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgwLCAwLCAwLCAwKSdcbiAgfVxufTtcblxuY29uc3QgV0lORE9XX1BBRCA9IDQwO1xuXG5jb25zdCBub29wID0gKCkgPT4ge307XG5cbmNsYXNzIFBvcnRhbGVkIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjb21wb25lbnQ6ICdkaXYnLFxuICAgIG9uQ2xvc2U6IG5vb3AsXG4gICAgdGhlbWVcbiAgfTtcblxuICBzdGF0ZSA9IHtcbiAgICBwb3M6IG51bGwsXG4gICAgaXNWaXNpYmxlOiBmYWxzZVxuICB9O1xuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vIHJlbGF0aXZlXG4gICAgdGhpcy51bnN1YnNjcmliZSA9IHN1YnNjcmliZSh0aGlzLmhhbmRsZVNjcm9sbCk7XG4gICAgdGhpcy5oYW5kbGVTY3JvbGwoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBjb25zdCBkaWRPcGVuID0gdGhpcy5wcm9wcy5pc09wZW5lZCAmJiAhcHJldlByb3BzLmlzT3BlbmVkO1xuICAgIGNvbnN0IGRpZENsb3NlID0gIXRoaXMucHJvcHMuaXNPcGVuZWQgJiYgcHJldlByb3BzLmlzT3BlbmVkO1xuICAgIGlmIChkaWRPcGVuIHx8IGRpZENsb3NlKSB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3VubW91bnRlZCkgcmV0dXJuO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc1Zpc2libGU6IGRpZE9wZW59KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlU2Nyb2xsKCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLl91bm1vdW50ZWQgPSB0cnVlO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIGVsZW1lbnQgPSBjcmVhdGVSZWYoKTtcbiAgY2hpbGQgPSBjcmVhdGVSZWYoKTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGxleGl0eVxuICBoYW5kbGVTY3JvbGwgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuY2hpbGQuY3VycmVudCkge1xuICAgICAgY29uc3QgcmVjdCA9IHRoaXMuZWxlbWVudC5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgY29uc3QgY2hpbGRSZWN0ID0gdGhpcy5jaGlsZC5jdXJyZW50ICYmIHRoaXMuY2hpbGQuY3VycmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHBhZ2VPZmZzZXQgPSBnZXRQYWdlT2Zmc2V0KCk7XG4gICAgICBjb25zdCB7dG9wOiB0b3BPZmZzZXQsIGxlZnQ6IGxlZnRPZmZzZXQsIHJpZ2h0OiByaWdodE9mZnNldH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICBjb25zdCBwb3MgPSBnZXRDaGlsZFBvcyh7XG4gICAgICAgIG9mZnNldHM6IHt0b3BPZmZzZXQsIGxlZnRPZmZzZXQsIHJpZ2h0T2Zmc2V0fSxcbiAgICAgICAgcmVjdCxcbiAgICAgICAgY2hpbGRSZWN0LFxuICAgICAgICBwYWdlT2Zmc2V0LFxuICAgICAgICBwYWRkaW5nOiBXSU5ET1dfUEFEXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFpc0VxdWFsKHBvcywgdGhpcy5zdGF0ZS5wb3MpKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3Bvc30pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgLy8gcmVsYXRpdmVcbiAgICAgIGNvbXBvbmVudDogQ29tcCxcbiAgICAgIG92ZXJsYXlaSW5kZXgsXG4gICAgICBpc09wZW5lZCxcbiAgICAgIG9uQ2xvc2UsXG5cbiAgICAgIC8vIE1vcmRhbFxuICAgICAgY2hpbGRyZW4sXG4gICAgICBtb2RhbFByb3BzXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCB7aXNWaXNpYmxlLCBwb3N9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGNvbnN0IG1vZGFsU3R5bGUgPSB7XG4gICAgICAuLi5kZWZhdWx0TW9kYWxTdHlsZSxcbiAgICAgIG92ZXJsYXk6IHtcbiAgICAgICAgLi4uZGVmYXVsdE1vZGFsU3R5bGUub3ZlcmxheSxcbiAgICAgICAgLy8gbmVlZHMgdG8gYmUgb24gdG9wIG9mIGV4aXN0aW5nIG1vZGFsXG4gICAgICAgIHpJbmRleDogb3ZlcmxheVpJbmRleCB8fCA5OTk5XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Um9vdENvbnRleHQuQ29uc3VtZXI+XG4gICAgICAgIHtjb250ZXh0ID0+IChcbiAgICAgICAgICA8Q29tcCByZWY9e3RoaXMuZWxlbWVudH0+XG4gICAgICAgICAgICB7aXNPcGVuZWQgPyAoXG4gICAgICAgICAgICAgIDxNb2RhbFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1vZGFsLXBvcnRhbFwiXG4gICAgICAgICAgICAgICAgey4uLm1vZGFsUHJvcHN9XG4gICAgICAgICAgICAgICAgYXJpYUhpZGVBcHA9e2ZhbHNlfVxuICAgICAgICAgICAgICAgIGlzT3BlblxuICAgICAgICAgICAgICAgIHN0eWxlPXttb2RhbFN0eWxlfVxuICAgICAgICAgICAgICAgIHBhcmVudFNlbGVjdG9yPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAvLyBSZWFjdCBtb2RhbCBpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL3JlYWN0anMvcmVhY3QtbW9kYWwvaXNzdWVzLzc2OVxuICAgICAgICAgICAgICAgICAgLy8gZmFpbGVkIHRvIGV4ZWN1dGUgcmVtb3ZlQ2hpbGQgb24gcGFyZW50IG5vZGUgd2hlbiBpdCBpcyBhbHJlYWR5IHVubW91bnRlZFxuICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgKGNvbnRleHQgJiYgY29udGV4dC5jdXJyZW50KSB8fCB7XG4gICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQ2hpbGQ6ICgpID0+IHt9LFxuICAgICAgICAgICAgICAgICAgICAgIGFwcGVuZENoaWxkOiAoKSA9PiB7fVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgb25SZXF1ZXN0Q2xvc2U9e29uQ2xvc2V9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwb3J0YWxlZC1jb250ZW50XCJcbiAgICAgICAgICAgICAgICAgIGtleT1cIml0ZW1cIlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IGlzVmlzaWJsZSA/IDEgOiAwLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUudG9wLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB0aGlzLnByb3BzLnRoZW1lLnRyYW5zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpblRvcDogaXNWaXNpYmxlID8gJzBweCcgOiAnMTRweCcsXG4gICAgICAgICAgICAgICAgICAgIC4uLnBvc1xuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIHJlZj17dGhpcy5jaGlsZH1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IG92ZXJsYXlaSW5kZXggPyBvdmVybGF5WkluZGV4ICsgMSA6IDEwMDAwXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L01vZGFsPlxuICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgPC9Db21wPlxuICAgICAgICApfVxuICAgICAgPC9Sb290Q29udGV4dC5Db25zdW1lcj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHdpdGhUaGVtZShQb3J0YWxlZCk7XG4iXX0=