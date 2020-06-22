"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _window = _interopRequireDefault(require("global/window"));

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

/**
 * Copied from https://github.com/sarink/react-file-drop
 * For React 16.8 compatibility
 */
var FileDrop =
/*#__PURE__*/
function (_React$PureComponent) {
  (0, _inherits2["default"])(FileDrop, _React$PureComponent);

  function FileDrop(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, FileDrop);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(FileDrop).call(this, props));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "resetDragging", function () {
      _this.frameDragCounter = 0;

      _this.setState({
        draggingOverFrame: false,
        draggingOverTarget: false
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleWindowDragOverOrDrop", function (event) {
      // This prevents the browser from trying to load whatever file the user dropped on the window
      event.preventDefault();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleFrameDrag", function (event) {
      // Only allow dragging of files
      if (!FileDrop.eventHasFiles(event)) return; // We are listening for events on the 'frame', so every time the user drags over any element in the frame's tree,
      // the event bubbles up to the frame. By keeping count of how many "dragenters" we get, we can tell if they are still
      // "draggingOverFrame" (b/c you get one "dragenter" initially, and one "dragenter"/one "dragleave" for every bubble)
      // This is far better than a "dragover" handler, which would be calling `setState` continuously.

      _this.frameDragCounter += event.type === 'dragenter' ? 1 : -1;

      if (_this.frameDragCounter === 1) {
        _this.setState({
          draggingOverFrame: true
        });

        if (_this.props.onFrameDragEnter) _this.props.onFrameDragEnter(event);
        return;
      }

      if (_this.frameDragCounter === 0) {
        _this.setState({
          draggingOverFrame: false
        });

        if (_this.props.onFrameDragLeave) _this.props.onFrameDragLeave(event);
        return;
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleFrameDrop", function (event) {
      event.preventDefault();

      if (!_this.state.draggingOverTarget) {
        _this.resetDragging();

        if (_this.props.onFrameDrop) _this.props.onFrameDrop(event);
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleDragOver", function (event) {
      if (FileDrop.eventHasFiles(event)) {
        _this.setState({
          draggingOverTarget: true
        });

        if (!FileDrop.isIE() && _this.props.dropEffect) event.dataTransfer.dropEffect = _this.props.dropEffect;
        if (_this.props.onDragOver) _this.props.onDragOver(event);
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleDragLeave", function (event) {
      _this.setState({
        draggingOverTarget: false
      });

      if (_this.props.onDragLeave) _this.props.onDragLeave(event);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "handleDrop", function (event) {
      if (_this.props.onDrop && FileDrop.eventHasFiles(event)) {
        var files = event.dataTransfer ? event.dataTransfer.files : null;

        _this.props.onDrop(files, event);
      }

      _this.resetDragging();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "stopFrameListeners", function (frame) {
      if (frame) {
        frame.removeEventListener('dragenter', _this.handleFrameDrag);
        frame.removeEventListener('dragleave', _this.handleFrameDrag);
        frame.removeEventListener('drop', _this.handleFrameDrop);
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "startFrameListeners", function (frame) {
      if (frame) {
        frame.addEventListener('dragenter', _this.handleFrameDrag);
        frame.addEventListener('dragleave', _this.handleFrameDrag);
        frame.addEventListener('drop', _this.handleFrameDrop);
      }
    });
    _this.frameDragCounter = 0;
    _this.state = {
      draggingOverFrame: false,
      draggingOverTarget: false
    };
    return _this;
  }

  (0, _createClass2["default"])(FileDrop, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.startFrameListeners(this.props.frame);
      this.resetDragging();

      _window["default"].addEventListener('dragover', this.handleWindowDragOverOrDrop);

      _window["default"].addEventListener('drop', this.handleWindowDragOverOrDrop);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.frame !== this.props.frame) {
        this.resetDragging();
        this.stopFrameListeners(prevProps.frame);
        this.startFrameListeners(this.props.frame);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stopFrameListeners(this.props.frame);

      _window["default"].removeEventListener('dragover', this.handleWindowDragOverOrDrop);

      _window["default"].removeEventListener('drop', this.handleWindowDragOverOrDrop);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          targetClassName = _this$props.targetClassName,
          draggingOverFrameClassName = _this$props.draggingOverFrameClassName,
          draggingOverTargetClassName = _this$props.draggingOverTargetClassName;
      var _this$state = this.state,
          draggingOverTarget = _this$state.draggingOverTarget,
          draggingOverFrame = _this$state.draggingOverFrame;
      var fileDropTargetClassName = targetClassName;
      if (draggingOverFrame) fileDropTargetClassName += " ".concat(draggingOverFrameClassName);
      if (draggingOverTarget) fileDropTargetClassName += " ".concat(draggingOverTargetClassName);
      return _react["default"].createElement("div", {
        className: className,
        onDragOver: this.handleDragOver,
        onDragLeave: this.handleDragLeave,
        onDrop: this.handleDrop
      }, _react["default"].createElement("div", {
        className: fileDropTargetClassName
      }, children));
    }
  }]);
  return FileDrop;
}(_react["default"].PureComponent);

(0, _defineProperty2["default"])(FileDrop, "isIE", function () {
  return _window["default"] && _window["default"].navigator && ((_window["default"].navigator.userAgent || []).includes('MSIE') || (_window["default"].navigator.appVersion || []).includes('Trident/'));
});
(0, _defineProperty2["default"])(FileDrop, "eventHasFiles", function (event) {
  // In most browsers this is an array, but in IE11 it's an Object :(
  var hasFiles = false;

  if (event.dataTransfer) {
    var types = event.dataTransfer.types;

    for (var keyOrIndex in types) {
      if (types[keyOrIndex] === 'Files') {
        hasFiles = true;
        break;
      }
    }
  }

  return hasFiles;
});
(0, _defineProperty2["default"])(FileDrop, "propTypes", {
  className: _propTypes["default"].string,
  targetClassName: _propTypes["default"].string,
  draggingOverFrameClassName: _propTypes["default"].string,
  draggingOverTargetClassName: _propTypes["default"].string,
  onDragOver: _propTypes["default"].func,
  onDragLeave: _propTypes["default"].func,
  onDrop: _propTypes["default"].func,
  dropEffect: _propTypes["default"].oneOf(['copy', 'move', 'link', 'none']),
  frame: function frame(props, propName, componentName) {
    var prop = props[propName];

    if (prop === null) {
      return new Error("Warning: Required prop `".concat(propName, "` was not specified in `").concat(componentName, "`"));
    }

    if (prop !== document && prop !== _window["default"] && !(prop instanceof HTMLElement)) {
      return new Error("Warning: Prop `".concat(propName, "` must be one of the following: document, HTMLElement!"));
    }
  },
  onFrameDragEnter: _propTypes["default"].func,
  onFrameDragLeave: _propTypes["default"].func,
  onFrameDrop: _propTypes["default"].func
});
(0, _defineProperty2["default"])(FileDrop, "defaultProps", {
  dropEffect: 'copy',
  frame: _window["default"] ? _window["default"].document : undefined,
  className: 'file-drop',
  targetClassName: 'file-drop-target',
  draggingOverFrameClassName: 'file-drop-dragging-over-frame',
  draggingOverTargetClassName: 'file-drop-dragging-over-target'
});
var _default = FileDrop;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9maWxlLXVwbG9hZGVyL2ZpbGUtZHJvcC5qcyJdLCJuYW1lcyI6WyJGaWxlRHJvcCIsInByb3BzIiwiZnJhbWVEcmFnQ291bnRlciIsInNldFN0YXRlIiwiZHJhZ2dpbmdPdmVyRnJhbWUiLCJkcmFnZ2luZ092ZXJUYXJnZXQiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiZXZlbnRIYXNGaWxlcyIsInR5cGUiLCJvbkZyYW1lRHJhZ0VudGVyIiwib25GcmFtZURyYWdMZWF2ZSIsInN0YXRlIiwicmVzZXREcmFnZ2luZyIsIm9uRnJhbWVEcm9wIiwiaXNJRSIsImRyb3BFZmZlY3QiLCJkYXRhVHJhbnNmZXIiLCJvbkRyYWdPdmVyIiwib25EcmFnTGVhdmUiLCJvbkRyb3AiLCJmaWxlcyIsImZyYW1lIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImhhbmRsZUZyYW1lRHJhZyIsImhhbmRsZUZyYW1lRHJvcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzdGFydEZyYW1lTGlzdGVuZXJzIiwid2luZG93IiwiaGFuZGxlV2luZG93RHJhZ092ZXJPckRyb3AiLCJwcmV2UHJvcHMiLCJzdG9wRnJhbWVMaXN0ZW5lcnMiLCJjaGlsZHJlbiIsImNsYXNzTmFtZSIsInRhcmdldENsYXNzTmFtZSIsImRyYWdnaW5nT3ZlckZyYW1lQ2xhc3NOYW1lIiwiZHJhZ2dpbmdPdmVyVGFyZ2V0Q2xhc3NOYW1lIiwiZmlsZURyb3BUYXJnZXRDbGFzc05hbWUiLCJoYW5kbGVEcmFnT3ZlciIsImhhbmRsZURyYWdMZWF2ZSIsImhhbmRsZURyb3AiLCJSZWFjdCIsIlB1cmVDb21wb25lbnQiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJpbmNsdWRlcyIsImFwcFZlcnNpb24iLCJoYXNGaWxlcyIsInR5cGVzIiwia2V5T3JJbmRleCIsIlByb3BUeXBlcyIsInN0cmluZyIsImZ1bmMiLCJvbmVPZiIsInByb3BOYW1lIiwiY29tcG9uZW50TmFtZSIsInByb3AiLCJFcnJvciIsImRvY3VtZW50IiwiSFRNTEVsZW1lbnQiLCJ1bmRlZmluZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JBOztBQUNBOztBQUNBOztBQTFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7OztJQVFNQSxROzs7OztBQTJESixvQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBO0FBQ2pCLG9IQUFNQSxLQUFOO0FBRGlCLHNHQTJCSCxZQUFNO0FBQ3BCLFlBQUtDLGdCQUFMLEdBQXdCLENBQXhCOztBQUNBLFlBQUtDLFFBQUwsQ0FBYztBQUFDQyxRQUFBQSxpQkFBaUIsRUFBRSxLQUFwQjtBQUEyQkMsUUFBQUEsa0JBQWtCLEVBQUU7QUFBL0MsT0FBZDtBQUNELEtBOUJrQjtBQUFBLG1IQWdDVSxVQUFBQyxLQUFLLEVBQUk7QUFDcEM7QUFDQUEsTUFBQUEsS0FBSyxDQUFDQyxjQUFOO0FBQ0QsS0FuQ2tCO0FBQUEsd0dBcUNELFVBQUFELEtBQUssRUFBSTtBQUN6QjtBQUNBLFVBQUksQ0FBQ04sUUFBUSxDQUFDUSxhQUFULENBQXVCRixLQUF2QixDQUFMLEVBQW9DLE9BRlgsQ0FJekI7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsWUFBS0osZ0JBQUwsSUFBeUJJLEtBQUssQ0FBQ0csSUFBTixLQUFlLFdBQWYsR0FBNkIsQ0FBN0IsR0FBaUMsQ0FBQyxDQUEzRDs7QUFFQSxVQUFJLE1BQUtQLGdCQUFMLEtBQTBCLENBQTlCLEVBQWlDO0FBQy9CLGNBQUtDLFFBQUwsQ0FBYztBQUFDQyxVQUFBQSxpQkFBaUIsRUFBRTtBQUFwQixTQUFkOztBQUNBLFlBQUksTUFBS0gsS0FBTCxDQUFXUyxnQkFBZixFQUFpQyxNQUFLVCxLQUFMLENBQVdTLGdCQUFYLENBQTRCSixLQUE1QjtBQUNqQztBQUNEOztBQUVELFVBQUksTUFBS0osZ0JBQUwsS0FBMEIsQ0FBOUIsRUFBaUM7QUFDL0IsY0FBS0MsUUFBTCxDQUFjO0FBQUNDLFVBQUFBLGlCQUFpQixFQUFFO0FBQXBCLFNBQWQ7O0FBQ0EsWUFBSSxNQUFLSCxLQUFMLENBQVdVLGdCQUFmLEVBQWlDLE1BQUtWLEtBQUwsQ0FBV1UsZ0JBQVgsQ0FBNEJMLEtBQTVCO0FBQ2pDO0FBQ0Q7QUFDRixLQTFEa0I7QUFBQSx3R0E0REQsVUFBQUEsS0FBSyxFQUFJO0FBQ3pCQSxNQUFBQSxLQUFLLENBQUNDLGNBQU47O0FBQ0EsVUFBSSxDQUFDLE1BQUtLLEtBQUwsQ0FBV1Asa0JBQWhCLEVBQW9DO0FBQ2xDLGNBQUtRLGFBQUw7O0FBQ0EsWUFBSSxNQUFLWixLQUFMLENBQVdhLFdBQWYsRUFBNEIsTUFBS2IsS0FBTCxDQUFXYSxXQUFYLENBQXVCUixLQUF2QjtBQUM3QjtBQUNGLEtBbEVrQjtBQUFBLHVHQW9FRixVQUFBQSxLQUFLLEVBQUk7QUFDeEIsVUFBSU4sUUFBUSxDQUFDUSxhQUFULENBQXVCRixLQUF2QixDQUFKLEVBQW1DO0FBQ2pDLGNBQUtILFFBQUwsQ0FBYztBQUFDRSxVQUFBQSxrQkFBa0IsRUFBRTtBQUFyQixTQUFkOztBQUNBLFlBQUksQ0FBQ0wsUUFBUSxDQUFDZSxJQUFULEVBQUQsSUFBb0IsTUFBS2QsS0FBTCxDQUFXZSxVQUFuQyxFQUNFVixLQUFLLENBQUNXLFlBQU4sQ0FBbUJELFVBQW5CLEdBQWdDLE1BQUtmLEtBQUwsQ0FBV2UsVUFBM0M7QUFDRixZQUFJLE1BQUtmLEtBQUwsQ0FBV2lCLFVBQWYsRUFBMkIsTUFBS2pCLEtBQUwsQ0FBV2lCLFVBQVgsQ0FBc0JaLEtBQXRCO0FBQzVCO0FBQ0YsS0EzRWtCO0FBQUEsd0dBNkVELFVBQUFBLEtBQUssRUFBSTtBQUN6QixZQUFLSCxRQUFMLENBQWM7QUFBQ0UsUUFBQUEsa0JBQWtCLEVBQUU7QUFBckIsT0FBZDs7QUFDQSxVQUFJLE1BQUtKLEtBQUwsQ0FBV2tCLFdBQWYsRUFBNEIsTUFBS2xCLEtBQUwsQ0FBV2tCLFdBQVgsQ0FBdUJiLEtBQXZCO0FBQzdCLEtBaEZrQjtBQUFBLG1HQWtGTixVQUFBQSxLQUFLLEVBQUk7QUFDcEIsVUFBSSxNQUFLTCxLQUFMLENBQVdtQixNQUFYLElBQXFCcEIsUUFBUSxDQUFDUSxhQUFULENBQXVCRixLQUF2QixDQUF6QixFQUF3RDtBQUN0RCxZQUFNZSxLQUFLLEdBQUdmLEtBQUssQ0FBQ1csWUFBTixHQUFxQlgsS0FBSyxDQUFDVyxZQUFOLENBQW1CSSxLQUF4QyxHQUFnRCxJQUE5RDs7QUFDQSxjQUFLcEIsS0FBTCxDQUFXbUIsTUFBWCxDQUFrQkMsS0FBbEIsRUFBeUJmLEtBQXpCO0FBQ0Q7O0FBQ0QsWUFBS08sYUFBTDtBQUNELEtBeEZrQjtBQUFBLDJHQTBGRSxVQUFBUyxLQUFLLEVBQUk7QUFDNUIsVUFBSUEsS0FBSixFQUFXO0FBQ1RBLFFBQUFBLEtBQUssQ0FBQ0MsbUJBQU4sQ0FBMEIsV0FBMUIsRUFBdUMsTUFBS0MsZUFBNUM7QUFDQUYsUUFBQUEsS0FBSyxDQUFDQyxtQkFBTixDQUEwQixXQUExQixFQUF1QyxNQUFLQyxlQUE1QztBQUNBRixRQUFBQSxLQUFLLENBQUNDLG1CQUFOLENBQTBCLE1BQTFCLEVBQWtDLE1BQUtFLGVBQXZDO0FBQ0Q7QUFDRixLQWhHa0I7QUFBQSw0R0FrR0csVUFBQUgsS0FBSyxFQUFJO0FBQzdCLFVBQUlBLEtBQUosRUFBVztBQUNUQSxRQUFBQSxLQUFLLENBQUNJLGdCQUFOLENBQXVCLFdBQXZCLEVBQW9DLE1BQUtGLGVBQXpDO0FBQ0FGLFFBQUFBLEtBQUssQ0FBQ0ksZ0JBQU4sQ0FBdUIsV0FBdkIsRUFBb0MsTUFBS0YsZUFBekM7QUFDQUYsUUFBQUEsS0FBSyxDQUFDSSxnQkFBTixDQUF1QixNQUF2QixFQUErQixNQUFLRCxlQUFwQztBQUNEO0FBQ0YsS0F4R2tCO0FBRWpCLFVBQUt2QixnQkFBTCxHQUF3QixDQUF4QjtBQUNBLFVBQUtVLEtBQUwsR0FBYTtBQUFDUixNQUFBQSxpQkFBaUIsRUFBRSxLQUFwQjtBQUEyQkMsTUFBQUEsa0JBQWtCLEVBQUU7QUFBL0MsS0FBYjtBQUhpQjtBQUlsQjs7Ozt3Q0FFbUI7QUFDbEIsV0FBS3NCLG1CQUFMLENBQXlCLEtBQUsxQixLQUFMLENBQVdxQixLQUFwQztBQUNBLFdBQUtULGFBQUw7O0FBQ0FlLHlCQUFPRixnQkFBUCxDQUF3QixVQUF4QixFQUFvQyxLQUFLRywwQkFBekM7O0FBQ0FELHlCQUFPRixnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxLQUFLRywwQkFBckM7QUFDRDs7O3VDQUVrQkMsUyxFQUFXO0FBQzVCLFVBQUlBLFNBQVMsQ0FBQ1IsS0FBVixLQUFvQixLQUFLckIsS0FBTCxDQUFXcUIsS0FBbkMsRUFBMEM7QUFDeEMsYUFBS1QsYUFBTDtBQUNBLGFBQUtrQixrQkFBTCxDQUF3QkQsU0FBUyxDQUFDUixLQUFsQztBQUNBLGFBQUtLLG1CQUFMLENBQXlCLEtBQUsxQixLQUFMLENBQVdxQixLQUFwQztBQUNEO0FBQ0Y7OzsyQ0FFc0I7QUFDckIsV0FBS1Msa0JBQUwsQ0FBd0IsS0FBSzlCLEtBQUwsQ0FBV3FCLEtBQW5DOztBQUNBTSx5QkFBT0wsbUJBQVAsQ0FBMkIsVUFBM0IsRUFBdUMsS0FBS00sMEJBQTVDOztBQUNBRCx5QkFBT0wsbUJBQVAsQ0FBMkIsTUFBM0IsRUFBbUMsS0FBS00sMEJBQXhDO0FBQ0Q7Ozs2QkFpRlE7QUFBQSx3QkFPSCxLQUFLNUIsS0FQRjtBQUFBLFVBRUwrQixRQUZLLGVBRUxBLFFBRks7QUFBQSxVQUdMQyxTQUhLLGVBR0xBLFNBSEs7QUFBQSxVQUlMQyxlQUpLLGVBSUxBLGVBSks7QUFBQSxVQUtMQywwQkFMSyxlQUtMQSwwQkFMSztBQUFBLFVBTUxDLDJCQU5LLGVBTUxBLDJCQU5LO0FBQUEsd0JBUXlDLEtBQUt4QixLQVI5QztBQUFBLFVBUUFQLGtCQVJBLGVBUUFBLGtCQVJBO0FBQUEsVUFRb0JELGlCQVJwQixlQVFvQkEsaUJBUnBCO0FBVVAsVUFBSWlDLHVCQUF1QixHQUFHSCxlQUE5QjtBQUNBLFVBQUk5QixpQkFBSixFQUF1QmlDLHVCQUF1QixlQUFRRiwwQkFBUixDQUF2QjtBQUN2QixVQUFJOUIsa0JBQUosRUFBd0JnQyx1QkFBdUIsZUFBUUQsMkJBQVIsQ0FBdkI7QUFFeEIsYUFDRTtBQUNFLFFBQUEsU0FBUyxFQUFFSCxTQURiO0FBRUUsUUFBQSxVQUFVLEVBQUUsS0FBS0ssY0FGbkI7QUFHRSxRQUFBLFdBQVcsRUFBRSxLQUFLQyxlQUhwQjtBQUlFLFFBQUEsTUFBTSxFQUFFLEtBQUtDO0FBSmYsU0FNRTtBQUFLLFFBQUEsU0FBUyxFQUFFSDtBQUFoQixTQUEwQ0wsUUFBMUMsQ0FORixDQURGO0FBVUQ7OztFQTdMb0JTLGtCQUFNQyxhOztpQ0FBdkIxQyxRLFVBQ1U7QUFBQSxTQUNaNEIsc0JBQ0FBLG1CQUFPZSxTQURQLEtBRUMsQ0FBQ2YsbUJBQU9lLFNBQVAsQ0FBaUJDLFNBQWpCLElBQThCLEVBQS9CLEVBQW1DQyxRQUFuQyxDQUE0QyxNQUE1QyxLQUNDLENBQUNqQixtQkFBT2UsU0FBUCxDQUFpQkcsVUFBakIsSUFBK0IsRUFBaEMsRUFBb0NELFFBQXBDLENBQTZDLFVBQTdDLENBSEYsQ0FEWTtBQUFBLEM7aUNBRFY3QyxRLG1CQU9tQixVQUFBTSxLQUFLLEVBQUk7QUFDOUI7QUFFQSxNQUFJeUMsUUFBUSxHQUFHLEtBQWY7O0FBQ0EsTUFBSXpDLEtBQUssQ0FBQ1csWUFBVixFQUF3QjtBQUN0QixRQUFNK0IsS0FBSyxHQUFHMUMsS0FBSyxDQUFDVyxZQUFOLENBQW1CK0IsS0FBakM7O0FBQ0EsU0FBSyxJQUFNQyxVQUFYLElBQXlCRCxLQUF6QixFQUFnQztBQUM5QixVQUFJQSxLQUFLLENBQUNDLFVBQUQsQ0FBTCxLQUFzQixPQUExQixFQUFtQztBQUNqQ0YsUUFBQUEsUUFBUSxHQUFHLElBQVg7QUFDQTtBQUNEO0FBQ0Y7QUFDRjs7QUFDRCxTQUFPQSxRQUFQO0FBQ0QsQztpQ0FyQkcvQyxRLGVBdUJlO0FBQ2pCaUMsRUFBQUEsU0FBUyxFQUFFaUIsc0JBQVVDLE1BREo7QUFFakJqQixFQUFBQSxlQUFlLEVBQUVnQixzQkFBVUMsTUFGVjtBQUdqQmhCLEVBQUFBLDBCQUEwQixFQUFFZSxzQkFBVUMsTUFIckI7QUFJakJmLEVBQUFBLDJCQUEyQixFQUFFYyxzQkFBVUMsTUFKdEI7QUFLakJqQyxFQUFBQSxVQUFVLEVBQUVnQyxzQkFBVUUsSUFMTDtBQU1qQmpDLEVBQUFBLFdBQVcsRUFBRStCLHNCQUFVRSxJQU5OO0FBT2pCaEMsRUFBQUEsTUFBTSxFQUFFOEIsc0JBQVVFLElBUEQ7QUFRakJwQyxFQUFBQSxVQUFVLEVBQUVrQyxzQkFBVUcsS0FBVixDQUFnQixDQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLE1BQWpCLEVBQXlCLE1BQXpCLENBQWhCLENBUks7QUFTakIvQixFQUFBQSxLQUFLLEVBQUUsZUFBQ3JCLEtBQUQsRUFBUXFELFFBQVIsRUFBa0JDLGFBQWxCLEVBQW9DO0FBQ3pDLFFBQU1DLElBQUksR0FBR3ZELEtBQUssQ0FBQ3FELFFBQUQsQ0FBbEI7O0FBQ0EsUUFBSUUsSUFBSSxLQUFLLElBQWIsRUFBbUI7QUFDakIsYUFBTyxJQUFJQyxLQUFKLG1DQUN1QkgsUUFEdkIscUNBQzREQyxhQUQ1RCxPQUFQO0FBR0Q7O0FBQ0QsUUFBSUMsSUFBSSxLQUFLRSxRQUFULElBQXFCRixJQUFJLEtBQUs1QixrQkFBOUIsSUFBd0MsRUFBRTRCLElBQUksWUFBWUcsV0FBbEIsQ0FBNUMsRUFBNEU7QUFDMUUsYUFBTyxJQUFJRixLQUFKLDBCQUNjSCxRQURkLDREQUFQO0FBR0Q7QUFDRixHQXJCZ0I7QUFzQmpCNUMsRUFBQUEsZ0JBQWdCLEVBQUV3QyxzQkFBVUUsSUF0Qlg7QUF1QmpCekMsRUFBQUEsZ0JBQWdCLEVBQUV1QyxzQkFBVUUsSUF2Qlg7QUF3QmpCdEMsRUFBQUEsV0FBVyxFQUFFb0Msc0JBQVVFO0FBeEJOLEM7aUNBdkJmcEQsUSxrQkFrRGtCO0FBQ3BCZ0IsRUFBQUEsVUFBVSxFQUFFLE1BRFE7QUFFcEJNLEVBQUFBLEtBQUssRUFBRU0scUJBQVNBLG1CQUFPOEIsUUFBaEIsR0FBMkJFLFNBRmQ7QUFHcEIzQixFQUFBQSxTQUFTLEVBQUUsV0FIUztBQUlwQkMsRUFBQUEsZUFBZSxFQUFFLGtCQUpHO0FBS3BCQyxFQUFBQSwwQkFBMEIsRUFBRSwrQkFMUjtBQU1wQkMsRUFBQUEsMkJBQTJCLEVBQUU7QUFOVCxDO2VBOElUcEMsUSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8qKlxuICogQ29waWVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Nhcmluay9yZWFjdC1maWxlLWRyb3BcbiAqIEZvciBSZWFjdCAxNi44IGNvbXBhdGliaWxpdHlcbiAqL1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuXG5jbGFzcyBGaWxlRHJvcCBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQge1xuICBzdGF0aWMgaXNJRSA9ICgpID0+XG4gICAgd2luZG93ICYmXG4gICAgd2luZG93Lm5hdmlnYXRvciAmJlxuICAgICgod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQgfHwgW10pLmluY2x1ZGVzKCdNU0lFJykgfHxcbiAgICAgICh3aW5kb3cubmF2aWdhdG9yLmFwcFZlcnNpb24gfHwgW10pLmluY2x1ZGVzKCdUcmlkZW50LycpKTtcblxuICBzdGF0aWMgZXZlbnRIYXNGaWxlcyA9IGV2ZW50ID0+IHtcbiAgICAvLyBJbiBtb3N0IGJyb3dzZXJzIHRoaXMgaXMgYW4gYXJyYXksIGJ1dCBpbiBJRTExIGl0J3MgYW4gT2JqZWN0IDooXG5cbiAgICBsZXQgaGFzRmlsZXMgPSBmYWxzZTtcbiAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyKSB7XG4gICAgICBjb25zdCB0eXBlcyA9IGV2ZW50LmRhdGFUcmFuc2Zlci50eXBlcztcbiAgICAgIGZvciAoY29uc3Qga2V5T3JJbmRleCBpbiB0eXBlcykge1xuICAgICAgICBpZiAodHlwZXNba2V5T3JJbmRleF0gPT09ICdGaWxlcycpIHtcbiAgICAgICAgICBoYXNGaWxlcyA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0ZpbGVzO1xuICB9O1xuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHRhcmdldENsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkcmFnZ2luZ092ZXJGcmFtZUNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkcmFnZ2luZ092ZXJUYXJnZXRDbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgb25EcmFnT3ZlcjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25EcmFnTGVhdmU6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uRHJvcDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgZHJvcEVmZmVjdDogUHJvcFR5cGVzLm9uZU9mKFsnY29weScsICdtb3ZlJywgJ2xpbmsnLCAnbm9uZSddKSxcbiAgICBmcmFtZTogKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkgPT4ge1xuICAgICAgY29uc3QgcHJvcCA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmIChwcm9wID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoXG4gICAgICAgICAgYFdhcm5pbmc6IFJlcXVpcmVkIHByb3AgXFxgJHtwcm9wTmFtZX1cXGAgd2FzIG5vdCBzcGVjaWZpZWQgaW4gXFxgJHtjb21wb25lbnROYW1lfVxcYGBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9wICE9PSBkb2N1bWVudCAmJiBwcm9wICE9PSB3aW5kb3cgJiYgIShwcm9wIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoXG4gICAgICAgICAgYFdhcm5pbmc6IFByb3AgXFxgJHtwcm9wTmFtZX1cXGAgbXVzdCBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZzogZG9jdW1lbnQsIEhUTUxFbGVtZW50IWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uRnJhbWVEcmFnRW50ZXI6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uRnJhbWVEcmFnTGVhdmU6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uRnJhbWVEcm9wOiBQcm9wVHlwZXMuZnVuY1xuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgZHJvcEVmZmVjdDogJ2NvcHknLFxuICAgIGZyYW1lOiB3aW5kb3cgPyB3aW5kb3cuZG9jdW1lbnQgOiB1bmRlZmluZWQsXG4gICAgY2xhc3NOYW1lOiAnZmlsZS1kcm9wJyxcbiAgICB0YXJnZXRDbGFzc05hbWU6ICdmaWxlLWRyb3AtdGFyZ2V0JyxcbiAgICBkcmFnZ2luZ092ZXJGcmFtZUNsYXNzTmFtZTogJ2ZpbGUtZHJvcC1kcmFnZ2luZy1vdmVyLWZyYW1lJyxcbiAgICBkcmFnZ2luZ092ZXJUYXJnZXRDbGFzc05hbWU6ICdmaWxlLWRyb3AtZHJhZ2dpbmctb3Zlci10YXJnZXQnXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5mcmFtZURyYWdDb3VudGVyID0gMDtcbiAgICB0aGlzLnN0YXRlID0ge2RyYWdnaW5nT3ZlckZyYW1lOiBmYWxzZSwgZHJhZ2dpbmdPdmVyVGFyZ2V0OiBmYWxzZX07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnN0YXJ0RnJhbWVMaXN0ZW5lcnModGhpcy5wcm9wcy5mcmFtZSk7XG4gICAgdGhpcy5yZXNldERyYWdnaW5nKCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgdGhpcy5oYW5kbGVXaW5kb3dEcmFnT3Zlck9yRHJvcCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCB0aGlzLmhhbmRsZVdpbmRvd0RyYWdPdmVyT3JEcm9wKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBpZiAocHJldlByb3BzLmZyYW1lICE9PSB0aGlzLnByb3BzLmZyYW1lKSB7XG4gICAgICB0aGlzLnJlc2V0RHJhZ2dpbmcoKTtcbiAgICAgIHRoaXMuc3RvcEZyYW1lTGlzdGVuZXJzKHByZXZQcm9wcy5mcmFtZSk7XG4gICAgICB0aGlzLnN0YXJ0RnJhbWVMaXN0ZW5lcnModGhpcy5wcm9wcy5mcmFtZSk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdG9wRnJhbWVMaXN0ZW5lcnModGhpcy5wcm9wcy5mcmFtZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgdGhpcy5oYW5kbGVXaW5kb3dEcmFnT3Zlck9yRHJvcCk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCB0aGlzLmhhbmRsZVdpbmRvd0RyYWdPdmVyT3JEcm9wKTtcbiAgfVxuXG4gIHJlc2V0RHJhZ2dpbmcgPSAoKSA9PiB7XG4gICAgdGhpcy5mcmFtZURyYWdDb3VudGVyID0gMDtcbiAgICB0aGlzLnNldFN0YXRlKHtkcmFnZ2luZ092ZXJGcmFtZTogZmFsc2UsIGRyYWdnaW5nT3ZlclRhcmdldDogZmFsc2V9KTtcbiAgfTtcblxuICBoYW5kbGVXaW5kb3dEcmFnT3Zlck9yRHJvcCA9IGV2ZW50ID0+IHtcbiAgICAvLyBUaGlzIHByZXZlbnRzIHRoZSBicm93c2VyIGZyb20gdHJ5aW5nIHRvIGxvYWQgd2hhdGV2ZXIgZmlsZSB0aGUgdXNlciBkcm9wcGVkIG9uIHRoZSB3aW5kb3dcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xuXG4gIGhhbmRsZUZyYW1lRHJhZyA9IGV2ZW50ID0+IHtcbiAgICAvLyBPbmx5IGFsbG93IGRyYWdnaW5nIG9mIGZpbGVzXG4gICAgaWYgKCFGaWxlRHJvcC5ldmVudEhhc0ZpbGVzKGV2ZW50KSkgcmV0dXJuO1xuXG4gICAgLy8gV2UgYXJlIGxpc3RlbmluZyBmb3IgZXZlbnRzIG9uIHRoZSAnZnJhbWUnLCBzbyBldmVyeSB0aW1lIHRoZSB1c2VyIGRyYWdzIG92ZXIgYW55IGVsZW1lbnQgaW4gdGhlIGZyYW1lJ3MgdHJlZSxcbiAgICAvLyB0aGUgZXZlbnQgYnViYmxlcyB1cCB0byB0aGUgZnJhbWUuIEJ5IGtlZXBpbmcgY291bnQgb2YgaG93IG1hbnkgXCJkcmFnZW50ZXJzXCIgd2UgZ2V0LCB3ZSBjYW4gdGVsbCBpZiB0aGV5IGFyZSBzdGlsbFxuICAgIC8vIFwiZHJhZ2dpbmdPdmVyRnJhbWVcIiAoYi9jIHlvdSBnZXQgb25lIFwiZHJhZ2VudGVyXCIgaW5pdGlhbGx5LCBhbmQgb25lIFwiZHJhZ2VudGVyXCIvb25lIFwiZHJhZ2xlYXZlXCIgZm9yIGV2ZXJ5IGJ1YmJsZSlcbiAgICAvLyBUaGlzIGlzIGZhciBiZXR0ZXIgdGhhbiBhIFwiZHJhZ292ZXJcIiBoYW5kbGVyLCB3aGljaCB3b3VsZCBiZSBjYWxsaW5nIGBzZXRTdGF0ZWAgY29udGludW91c2x5LlxuICAgIHRoaXMuZnJhbWVEcmFnQ291bnRlciArPSBldmVudC50eXBlID09PSAnZHJhZ2VudGVyJyA/IDEgOiAtMTtcblxuICAgIGlmICh0aGlzLmZyYW1lRHJhZ0NvdW50ZXIgPT09IDEpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdnaW5nT3ZlckZyYW1lOiB0cnVlfSk7XG4gICAgICBpZiAodGhpcy5wcm9wcy5vbkZyYW1lRHJhZ0VudGVyKSB0aGlzLnByb3BzLm9uRnJhbWVEcmFnRW50ZXIoZXZlbnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZyYW1lRHJhZ0NvdW50ZXIgPT09IDApIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdnaW5nT3ZlckZyYW1lOiBmYWxzZX0pO1xuICAgICAgaWYgKHRoaXMucHJvcHMub25GcmFtZURyYWdMZWF2ZSkgdGhpcy5wcm9wcy5vbkZyYW1lRHJhZ0xlYXZlKGV2ZW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH07XG5cbiAgaGFuZGxlRnJhbWVEcm9wID0gZXZlbnQgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmRyYWdnaW5nT3ZlclRhcmdldCkge1xuICAgICAgdGhpcy5yZXNldERyYWdnaW5nKCk7XG4gICAgICBpZiAodGhpcy5wcm9wcy5vbkZyYW1lRHJvcCkgdGhpcy5wcm9wcy5vbkZyYW1lRHJvcChldmVudCk7XG4gICAgfVxuICB9O1xuXG4gIGhhbmRsZURyYWdPdmVyID0gZXZlbnQgPT4ge1xuICAgIGlmIChGaWxlRHJvcC5ldmVudEhhc0ZpbGVzKGV2ZW50KSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZ2dpbmdPdmVyVGFyZ2V0OiB0cnVlfSk7XG4gICAgICBpZiAoIUZpbGVEcm9wLmlzSUUoKSAmJiB0aGlzLnByb3BzLmRyb3BFZmZlY3QpXG4gICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gdGhpcy5wcm9wcy5kcm9wRWZmZWN0O1xuICAgICAgaWYgKHRoaXMucHJvcHMub25EcmFnT3ZlcikgdGhpcy5wcm9wcy5vbkRyYWdPdmVyKGV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgaGFuZGxlRHJhZ0xlYXZlID0gZXZlbnQgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdnaW5nT3ZlclRhcmdldDogZmFsc2V9KTtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkRyYWdMZWF2ZSkgdGhpcy5wcm9wcy5vbkRyYWdMZWF2ZShldmVudCk7XG4gIH07XG5cbiAgaGFuZGxlRHJvcCA9IGV2ZW50ID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5vbkRyb3AgJiYgRmlsZURyb3AuZXZlbnRIYXNGaWxlcyhldmVudCkpIHtcbiAgICAgIGNvbnN0IGZpbGVzID0gZXZlbnQuZGF0YVRyYW5zZmVyID8gZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzIDogbnVsbDtcbiAgICAgIHRoaXMucHJvcHMub25Ecm9wKGZpbGVzLCBldmVudCk7XG4gICAgfVxuICAgIHRoaXMucmVzZXREcmFnZ2luZygpO1xuICB9O1xuXG4gIHN0b3BGcmFtZUxpc3RlbmVycyA9IGZyYW1lID0+IHtcbiAgICBpZiAoZnJhbWUpIHtcbiAgICAgIGZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIHRoaXMuaGFuZGxlRnJhbWVEcmFnKTtcbiAgICAgIGZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIHRoaXMuaGFuZGxlRnJhbWVEcmFnKTtcbiAgICAgIGZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCB0aGlzLmhhbmRsZUZyYW1lRHJvcCk7XG4gICAgfVxuICB9O1xuXG4gIHN0YXJ0RnJhbWVMaXN0ZW5lcnMgPSBmcmFtZSA9PiB7XG4gICAgaWYgKGZyYW1lKSB7XG4gICAgICBmcmFtZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCB0aGlzLmhhbmRsZUZyYW1lRHJhZyk7XG4gICAgICBmcmFtZS5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCB0aGlzLmhhbmRsZUZyYW1lRHJhZyk7XG4gICAgICBmcmFtZS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgdGhpcy5oYW5kbGVGcmFtZURyb3ApO1xuICAgIH1cbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hpbGRyZW4sXG4gICAgICBjbGFzc05hbWUsXG4gICAgICB0YXJnZXRDbGFzc05hbWUsXG4gICAgICBkcmFnZ2luZ092ZXJGcmFtZUNsYXNzTmFtZSxcbiAgICAgIGRyYWdnaW5nT3ZlclRhcmdldENsYXNzTmFtZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtkcmFnZ2luZ092ZXJUYXJnZXQsIGRyYWdnaW5nT3ZlckZyYW1lfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBsZXQgZmlsZURyb3BUYXJnZXRDbGFzc05hbWUgPSB0YXJnZXRDbGFzc05hbWU7XG4gICAgaWYgKGRyYWdnaW5nT3ZlckZyYW1lKSBmaWxlRHJvcFRhcmdldENsYXNzTmFtZSArPSBgICR7ZHJhZ2dpbmdPdmVyRnJhbWVDbGFzc05hbWV9YDtcbiAgICBpZiAoZHJhZ2dpbmdPdmVyVGFyZ2V0KSBmaWxlRHJvcFRhcmdldENsYXNzTmFtZSArPSBgICR7ZHJhZ2dpbmdPdmVyVGFyZ2V0Q2xhc3NOYW1lfWA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICAgb25EcmFnT3Zlcj17dGhpcy5oYW5kbGVEcmFnT3Zlcn1cbiAgICAgICAgb25EcmFnTGVhdmU9e3RoaXMuaGFuZGxlRHJhZ0xlYXZlfVxuICAgICAgICBvbkRyb3A9e3RoaXMuaGFuZGxlRHJvcH1cbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2ZpbGVEcm9wVGFyZ2V0Q2xhc3NOYW1lfT57Y2hpbGRyZW59PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZpbGVEcm9wO1xuIl19