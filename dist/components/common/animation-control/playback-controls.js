"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.AnimationWindowControl = exports.IconButton = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _classnames = _interopRequireDefault(require("classnames"));

var _localization = require("../../../localization");

var _styledComponents2 = require("../styled-components");

var _animationSpeedSlider = _interopRequireDefault(require("./animation-speed-slider"));

var _icons = require("../icons");

var _defaultSettings = require("../../../constants/default-settings");

var _dataUtils = require("../../../utils/data-utils");

var _templateObject, _templateObject2, _templateObject3, _DEFAULT_ANIMATE_ITEM;

var DELAY_SHOW = 500;
var DEFAULT_BUTTON_HEIGHT = '20px';

var StyledAnimationControls = _styledComponents["default"].div(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  position: relative;\n\n  &.disabled {\n    opacity: 0.4;\n    pointer-events: none;\n  }\n"])));

var StyledSpeedControl = _styledComponents["default"].div(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  display: flex;\n  align-items: center;\n\n  .animation-control__speed-slider {\n    left: 0;\n  }\n"])));

var IconButton = (0, _styledComponents["default"])(_styledComponents2.Button)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  width: ", "px;\n  height: 32px;\n  color: ", ";\n  background-color: ", ";\n  border-radius: 4px;\n  margin-left: 7px;\n  border: 0;\n  padding: 0;\n\n  .__react_component_tooltip {\n    font-family: ", ";\n  }\n  svg {\n    margin: 0;\n  }\n  &.active {\n    background-color: ", ";\n  }\n"])), function (props) {
  return props.collapsed ? 0 : 32;
}, function (props) {
  return props.theme.playbackButtonColor;
}, function (props) {
  return props.theme.playbackButtonBgColor;
}, function (props) {
  return props.theme.fontFamily;
}, function (props) {
  return props.theme.playbackButtonActBgColor;
});
exports.IconButton = IconButton;

function nop() {}

var DEFAULT_ICONS = {
  /* eslint-disable react/display-name */
  reset: function reset(_) {
    return /*#__PURE__*/_react["default"].createElement(_icons.Reset, {
      height: "18px"
    });
  },
  play: function play(_) {
    return /*#__PURE__*/_react["default"].createElement(_icons.Play, {
      height: "18px"
    });
  },
  pause: function pause(_) {
    return /*#__PURE__*/_react["default"].createElement(_icons.Pause, {
      height: "18px"
    });
  },

  /* eslint-enable react/display-name */
  speed: _icons.Rocket,
  animationFree: _icons.FreeWindow,
  animationIncremental: _icons.AnchorWindow
};
var DEFAULT_ANIMATE_ITEMS = (_DEFAULT_ANIMATE_ITEM = {}, (0, _defineProperty2["default"])(_DEFAULT_ANIMATE_ITEM, _defaultSettings.ANIMATION_WINDOW.free, {
  id: _defaultSettings.ANIMATION_WINDOW.free,
  icon: DEFAULT_ICONS.animationFree,
  tooltip: 'tooltip.animationByWindow'
}), (0, _defineProperty2["default"])(_DEFAULT_ANIMATE_ITEM, _defaultSettings.ANIMATION_WINDOW.incremental, {
  id: _defaultSettings.ANIMATION_WINDOW.incremental,
  icon: DEFAULT_ICONS.animationIncremental,
  tooltip: 'tooltip.animationByIncremental'
}), _DEFAULT_ANIMATE_ITEM);

var AnimationWindowControl = function AnimationWindowControl(_ref) {
  var _onClick = _ref.onClick,
      selected = _ref.selected,
      onHide = _ref.onHide,
      height = _ref.height,
      animationItems = _ref.animationItems,
      _ref$btnStyle = _ref.btnStyle,
      btnStyle = _ref$btnStyle === void 0 ? {} : _ref$btnStyle;
  return /*#__PURE__*/_react["default"].createElement("div", null, Object.values(animationItems).filter(function (item) {
    return item.id !== selected;
  }).map(function (item) {
    return /*#__PURE__*/_react["default"].createElement(IconButton, (0, _extends2["default"])({
      key: item.id,
      "data-tip": true,
      "data-for": "".concat(item.id, "-tooltip"),
      className: "playback-control-button",
      onClick: function onClick() {
        _onClick(item.id);

        onHide();
      }
    }, btnStyle), /*#__PURE__*/_react["default"].createElement(item.icon, {
      height: height
    }), item.tooltip ? /*#__PURE__*/_react["default"].createElement(_styledComponents2.Tooltip, {
      id: "".concat(item.id, "-tooltip"),
      effect: "solid",
      place: "top"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: item.tooltip
    })) : null);
  }));
};

exports.AnimationWindowControl = AnimationWindowControl;
PlaybackControlsFactory.deps = [_animationSpeedSlider["default"]];

function PlaybackControlsFactory(AnimationSpeedSlider) {
  // eslint-disable-next-line complexity
  var PlaybackControls = function PlaybackControls(_ref2) {
    var _ref2$isAnimatable = _ref2.isAnimatable,
        isAnimatable = _ref2$isAnimatable === void 0 ? true : _ref2$isAnimatable,
        isAnimating = _ref2.isAnimating,
        width = _ref2.width,
        speed = _ref2.speed,
        _ref2$animationWindow = _ref2.animationWindow,
        animationWindow = _ref2$animationWindow === void 0 ? _defaultSettings.ANIMATION_WINDOW.free : _ref2$animationWindow,
        setFilterAnimationWindow = _ref2.setFilterAnimationWindow,
        updateAnimationSpeed = _ref2.updateAnimationSpeed,
        _ref2$pauseAnimation = _ref2.pauseAnimation,
        pauseAnimation = _ref2$pauseAnimation === void 0 ? nop : _ref2$pauseAnimation,
        _ref2$resetAnimation = _ref2.resetAnimation,
        resetAnimation = _ref2$resetAnimation === void 0 ? nop : _ref2$resetAnimation,
        _ref2$startAnimation = _ref2.startAnimation,
        startAnimation = _ref2$startAnimation === void 0 ? nop : _ref2$startAnimation,
        _ref2$playbackIcons = _ref2.playbackIcons,
        playbackIcons = _ref2$playbackIcons === void 0 ? DEFAULT_ICONS : _ref2$playbackIcons,
        _ref2$animationItems = _ref2.animationItems,
        animationItems = _ref2$animationItems === void 0 ? DEFAULT_ANIMATE_ITEMS : _ref2$animationItems,
        _ref2$buttonStyle = _ref2.buttonStyle,
        buttonStyle = _ref2$buttonStyle === void 0 ? 'secondary' : _ref2$buttonStyle,
        _ref2$buttonHeight = _ref2.buttonHeight,
        buttonHeight = _ref2$buttonHeight === void 0 ? DEFAULT_BUTTON_HEIGHT : _ref2$buttonHeight;

    var _useState = (0, _react.useState)(false),
        _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
        isSpeedControlVisible = _useState2[0],
        toggleSpeedControl = _useState2[1];

    var _useState3 = (0, _react.useState)(false),
        _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
        showAnimationWindowControl = _useState4[0],
        setShowAnimationWindowControl = _useState4[1];

    var toggleAnimationWindowControl = (0, _react.useCallback)(function () {
      setShowAnimationWindowControl(!showAnimationWindowControl);
    }, [showAnimationWindowControl, setShowAnimationWindowControl]);
    var btnStyle = buttonStyle ? (0, _defineProperty2["default"])({}, buttonStyle, true) : {};
    var hideAndShowSpeedControl = (0, _react.useCallback)(function () {
      if (!isSpeedControlVisible) {
        toggleSpeedControl(true);
      } else {
        // TODO: A HACK to allow input onblur get triggered before the input is unmounted
        // A better solution should be invested, see https://github.com/facebook/react/issues/12363
        window.setTimeout(function () {
          return toggleSpeedControl(false);
        }, 200);
      }
    }, [isSpeedControlVisible, toggleSpeedControl]);
    return /*#__PURE__*/_react["default"].createElement(StyledAnimationControls, {
      className: (0, _classnames["default"])('playback-controls', {
        disabled: !isAnimatable
      }),
      style: {
        width: "".concat(width, "px")
      }
    }, setFilterAnimationWindow ? /*#__PURE__*/_react["default"].createElement(IconButton, (0, _extends2["default"])({
      "data-tip": true,
      "data-for": "animate-window",
      className: (0, _classnames["default"])('playback-control-button', {
        active: showAnimationWindowControl
      }),
      onClick: toggleAnimationWindowControl
    }, btnStyle), function () {
      if (animationItems[animationWindow]) {
        var WindowIcon = animationItems[animationWindow].icon;
        return /*#__PURE__*/_react["default"].createElement(WindowIcon, {
          height: buttonHeight
        });
      }

      return null;
    }(), animationItems[animationWindow] && animationItems[animationWindow].tooltip ? /*#__PURE__*/_react["default"].createElement(_styledComponents2.Tooltip, {
      id: "animate-window",
      place: "top",
      delayShow: 500,
      effect: "solid"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: animationItems[animationWindow].tooltip
    })) : null) : null, showAnimationWindowControl ? /*#__PURE__*/_react["default"].createElement(AnimationWindowControl, {
      onClick: setFilterAnimationWindow,
      selected: animationWindow,
      onHide: toggleAnimationWindowControl,
      height: buttonHeight,
      btnStyle: btnStyle,
      animationItems: animationItems
    }) : null, showAnimationWindowControl || !updateAnimationSpeed ? null : /*#__PURE__*/_react["default"].createElement(StyledSpeedControl, null, /*#__PURE__*/_react["default"].createElement(IconButton, (0, _extends2["default"])({
      "data-tip": true,
      "data-for": "animate-speed",
      className: "playback-control-button"
    }, btnStyle, {
      onClick: hideAndShowSpeedControl
    }), /*#__PURE__*/_react["default"].createElement(playbackIcons.speed, {
      height: buttonHeight
    }), /*#__PURE__*/_react["default"].createElement(_styledComponents2.Tooltip, {
      id: "animate-speed",
      place: "top",
      delayShow: DELAY_SHOW,
      effect: "solid"
    }, /*#__PURE__*/_react["default"].createElement("span", null, (0, _dataUtils.preciseRound)(speed, 1), "x"))), isSpeedControlVisible ? /*#__PURE__*/_react["default"].createElement(AnimationSpeedSlider, {
      onHide: hideAndShowSpeedControl,
      updateAnimationSpeed: updateAnimationSpeed,
      speed: speed
    }) : null), showAnimationWindowControl ? null : /*#__PURE__*/_react["default"].createElement(IconButton, (0, _extends2["default"])({
      "data-tip": true,
      "data-for": "animate-reset",
      className: "playback-control-button",
      onClick: resetAnimation
    }, btnStyle), /*#__PURE__*/_react["default"].createElement(playbackIcons.reset, {
      height: buttonHeight
    }), /*#__PURE__*/_react["default"].createElement(_styledComponents2.Tooltip, {
      id: "animate-reset",
      place: "top",
      delayShow: DELAY_SHOW,
      effect: "solid"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: "tooltip.reset"
    }))), showAnimationWindowControl ? null : /*#__PURE__*/_react["default"].createElement(IconButton, (0, _extends2["default"])({
      "data-tip": true,
      "data-for": "animate-play-pause",
      className: (0, _classnames["default"])('playback-control-button', {
        active: isAnimating
      }),
      onClick: isAnimating ? pauseAnimation : startAnimation,
      hide: isSpeedControlVisible
    }, btnStyle), isAnimating ? /*#__PURE__*/_react["default"].createElement(playbackIcons.pause, {
      height: buttonHeight
    }) : /*#__PURE__*/_react["default"].createElement(playbackIcons.play, {
      height: buttonHeight
    }), /*#__PURE__*/_react["default"].createElement(_styledComponents2.Tooltip, {
      id: "animate-play-pause",
      place: "top",
      delayShow: DELAY_SHOW,
      effect: "solid"
    }, /*#__PURE__*/_react["default"].createElement(_localization.FormattedMessage, {
      id: isAnimating ? 'tooltip.pause' : 'tooltip.play'
    }))));
  };

  return PlaybackControls;
}

var _default = PlaybackControlsFactory;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9hbmltYXRpb24tY29udHJvbC9wbGF5YmFjay1jb250cm9scy5qcyJdLCJuYW1lcyI6WyJERUxBWV9TSE9XIiwiREVGQVVMVF9CVVRUT05fSEVJR0hUIiwiU3R5bGVkQW5pbWF0aW9uQ29udHJvbHMiLCJzdHlsZWQiLCJkaXYiLCJTdHlsZWRTcGVlZENvbnRyb2wiLCJJY29uQnV0dG9uIiwiQnV0dG9uIiwicHJvcHMiLCJjb2xsYXBzZWQiLCJ0aGVtZSIsInBsYXliYWNrQnV0dG9uQ29sb3IiLCJwbGF5YmFja0J1dHRvbkJnQ29sb3IiLCJmb250RmFtaWx5IiwicGxheWJhY2tCdXR0b25BY3RCZ0NvbG9yIiwibm9wIiwiREVGQVVMVF9JQ09OUyIsInJlc2V0IiwiXyIsInBsYXkiLCJwYXVzZSIsInNwZWVkIiwiUm9ja2V0IiwiYW5pbWF0aW9uRnJlZSIsIkZyZWVXaW5kb3ciLCJhbmltYXRpb25JbmNyZW1lbnRhbCIsIkFuY2hvcldpbmRvdyIsIkRFRkFVTFRfQU5JTUFURV9JVEVNUyIsIkFOSU1BVElPTl9XSU5ET1ciLCJmcmVlIiwiaWQiLCJpY29uIiwidG9vbHRpcCIsImluY3JlbWVudGFsIiwiQW5pbWF0aW9uV2luZG93Q29udHJvbCIsIm9uQ2xpY2siLCJzZWxlY3RlZCIsIm9uSGlkZSIsImhlaWdodCIsImFuaW1hdGlvbkl0ZW1zIiwiYnRuU3R5bGUiLCJPYmplY3QiLCJ2YWx1ZXMiLCJmaWx0ZXIiLCJpdGVtIiwibWFwIiwiUGxheWJhY2tDb250cm9sc0ZhY3RvcnkiLCJkZXBzIiwiQW5pbWF0aW9uU3BlZWRTbGlkZXJGYWN0b3J5IiwiQW5pbWF0aW9uU3BlZWRTbGlkZXIiLCJQbGF5YmFja0NvbnRyb2xzIiwiaXNBbmltYXRhYmxlIiwiaXNBbmltYXRpbmciLCJ3aWR0aCIsImFuaW1hdGlvbldpbmRvdyIsInNldEZpbHRlckFuaW1hdGlvbldpbmRvdyIsInVwZGF0ZUFuaW1hdGlvblNwZWVkIiwicGF1c2VBbmltYXRpb24iLCJyZXNldEFuaW1hdGlvbiIsInN0YXJ0QW5pbWF0aW9uIiwicGxheWJhY2tJY29ucyIsImJ1dHRvblN0eWxlIiwiYnV0dG9uSGVpZ2h0IiwiaXNTcGVlZENvbnRyb2xWaXNpYmxlIiwidG9nZ2xlU3BlZWRDb250cm9sIiwic2hvd0FuaW1hdGlvbldpbmRvd0NvbnRyb2wiLCJzZXRTaG93QW5pbWF0aW9uV2luZG93Q29udHJvbCIsInRvZ2dsZUFuaW1hdGlvbldpbmRvd0NvbnRyb2wiLCJoaWRlQW5kU2hvd1NwZWVkQ29udHJvbCIsIndpbmRvdyIsInNldFRpbWVvdXQiLCJkaXNhYmxlZCIsImFjdGl2ZSIsIldpbmRvd0ljb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxVQUFVLEdBQUcsR0FBbkI7QUFDQSxJQUFNQyxxQkFBcUIsR0FBRyxNQUE5Qjs7QUFFQSxJQUFNQyx1QkFBdUIsR0FBR0MsNkJBQU9DLEdBQVYsc01BQTdCOztBQVVBLElBQU1DLGtCQUFrQixHQUFHRiw2QkFBT0MsR0FBViwrTEFBeEI7O0FBU08sSUFBTUUsVUFBVSxHQUFHLGtDQUFPQyx5QkFBUCxDQUFILCtYQUNaLFVBQUFDLEtBQUs7QUFBQSxTQUFLQSxLQUFLLENBQUNDLFNBQU4sR0FBa0IsQ0FBbEIsR0FBc0IsRUFBM0I7QUFBQSxDQURPLEVBR1osVUFBQUQsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0UsS0FBTixDQUFZQyxtQkFBaEI7QUFBQSxDQUhPLEVBSUQsVUFBQUgsS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0UsS0FBTixDQUFZRSxxQkFBaEI7QUFBQSxDQUpKLEVBV0osVUFBQUosS0FBSztBQUFBLFNBQUlBLEtBQUssQ0FBQ0UsS0FBTixDQUFZRyxVQUFoQjtBQUFBLENBWEQsRUFpQkMsVUFBQUwsS0FBSztBQUFBLFNBQUlBLEtBQUss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RUFBRUE7QUFBNUIsTUFYSixlQWFFLGdDQUFDLDBCQUFEO0FBQVMsTUFBQSxFQUFFLEVBQUMsb0JBQVo7QUFBaUMsTUFBQSxLQUFLLEVBQUMsS0FBdkM7QUFBNkMsTUFBQSxTQUFTLEVBQUU5RCxVQUF4RDtBQUFvRSxNQUFBLE1BQU0sRUFBQztBQUEzRSxvQkFDRSxnQ0FBQyw4QkFBRDtBQUFrQixNQUFBLEVBQUUsRUFBRW9ELFdBQVcsR0FBRyxlQUFILEdBQXFCO0FBQXRELE1BREYsQ0FiRixDQXBGSixDQURGO0FBeUdELEdBMUlEOztBQTJJQSxTQUFPRixnQkFBUDtBQUNEOztlQUVjSix1QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge3VzZVN0YXRlLCB1c2VDYWxsYmFja30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdzdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7Rm9ybWF0dGVkTWVzc2FnZX0gZnJvbSAnbG9jYWxpemF0aW9uJztcbmltcG9ydCB7QnV0dG9uLCBUb29sdGlwfSBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgQW5pbWF0aW9uU3BlZWRTbGlkZXJGYWN0b3J5IGZyb20gJy4vYW5pbWF0aW9uLXNwZWVkLXNsaWRlcic7XG5pbXBvcnQge1Jlc2V0LCBQbGF5LCBQYXVzZSwgUm9ja2V0LCBBbmNob3JXaW5kb3csIEZyZWVXaW5kb3d9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcbmltcG9ydCB7QU5JTUFUSU9OX1dJTkRPV30gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtwcmVjaXNlUm91bmR9IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuXG5jb25zdCBERUxBWV9TSE9XID0gNTAwO1xuY29uc3QgREVGQVVMVF9CVVRUT05fSEVJR0hUID0gJzIwcHgnO1xuXG5jb25zdCBTdHlsZWRBbmltYXRpb25Db250cm9scyA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAmLmRpc2FibGVkIHtcbiAgICBvcGFjaXR5OiAwLjQ7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIH1cbmA7XG5cbmNvbnN0IFN0eWxlZFNwZWVkQ29udHJvbCA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgLmFuaW1hdGlvbi1jb250cm9sX19zcGVlZC1zbGlkZXIge1xuICAgIGxlZnQ6IDA7XG4gIH1cbmA7XG5cbmV4cG9ydCBjb25zdCBJY29uQnV0dG9uID0gc3R5bGVkKEJ1dHRvbilgXG4gIHdpZHRoOiAke3Byb3BzID0+IChwcm9wcy5jb2xsYXBzZWQgPyAwIDogMzIpfXB4O1xuICBoZWlnaHQ6IDMycHg7XG4gIGNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBsYXliYWNrQnV0dG9uQ29sb3J9O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLnRoZW1lLnBsYXliYWNrQnV0dG9uQmdDb2xvcn07XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgbWFyZ2luLWxlZnQ6IDdweDtcbiAgYm9yZGVyOiAwO1xuICBwYWRkaW5nOiAwO1xuXG4gIC5fX3JlYWN0X2NvbXBvbmVudF90b29sdGlwIHtcbiAgICBmb250LWZhbWlseTogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5mb250RmFtaWx5fTtcbiAgfVxuICBzdmcge1xuICAgIG1hcmdpbjogMDtcbiAgfVxuICAmLmFjdGl2ZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy50aGVtZS5wbGF5YmFja0J1dHRvbkFjdEJnQ29sb3J9O1xuICB9XG5gO1xuXG5mdW5jdGlvbiBub3AoKSB7fVxuY29uc3QgREVGQVVMVF9JQ09OUyA9IHtcbiAgLyogZXNsaW50LWRpc2FibGUgcmVhY3QvZGlzcGxheS1uYW1lICovXG4gIHJlc2V0OiBfID0+IDxSZXNldCBoZWlnaHQ9XCIxOHB4XCIgLz4sXG4gIHBsYXk6IF8gPT4gPFBsYXkgaGVpZ2h0PVwiMThweFwiIC8+LFxuICBwYXVzZTogXyA9PiA8UGF1c2UgaGVpZ2h0PVwiMThweFwiIC8+LFxuICAvKiBlc2xpbnQtZW5hYmxlIHJlYWN0L2Rpc3BsYXktbmFtZSAqL1xuICBzcGVlZDogUm9ja2V0LFxuICBhbmltYXRpb25GcmVlOiBGcmVlV2luZG93LFxuICBhbmltYXRpb25JbmNyZW1lbnRhbDogQW5jaG9yV2luZG93XG59O1xuXG5jb25zdCBERUZBVUxUX0FOSU1BVEVfSVRFTVMgPSB7XG4gIFtBTklNQVRJT05fV0lORE9XLmZyZWVdOiB7XG4gICAgaWQ6IEFOSU1BVElPTl9XSU5ET1cuZnJlZSxcbiAgICBpY29uOiBERUZBVUxUX0lDT05TLmFuaW1hdGlvbkZyZWUsXG4gICAgdG9vbHRpcDogJ3Rvb2x0aXAuYW5pbWF0aW9uQnlXaW5kb3cnXG4gIH0sXG4gIFtBTklNQVRJT05fV0lORE9XLmluY3JlbWVudGFsXToge1xuICAgIGlkOiBBTklNQVRJT05fV0lORE9XLmluY3JlbWVudGFsLFxuICAgIGljb246IERFRkFVTFRfSUNPTlMuYW5pbWF0aW9uSW5jcmVtZW50YWwsXG4gICAgdG9vbHRpcDogJ3Rvb2x0aXAuYW5pbWF0aW9uQnlJbmNyZW1lbnRhbCdcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IEFuaW1hdGlvbldpbmRvd0NvbnRyb2wgPSAoe1xuICBvbkNsaWNrLFxuICBzZWxlY3RlZCxcbiAgb25IaWRlLFxuICBoZWlnaHQsXG4gIGFuaW1hdGlvbkl0ZW1zLFxuICBidG5TdHlsZSA9IHt9XG59KSA9PiAoXG4gIDxkaXY+XG4gICAge09iamVjdC52YWx1ZXMoYW5pbWF0aW9uSXRlbXMpXG4gICAgICAuZmlsdGVyKGl0ZW0gPT4gaXRlbS5pZCAhPT0gc2VsZWN0ZWQpXG4gICAgICAubWFwKGl0ZW0gPT4gKFxuICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgIGtleT17aXRlbS5pZH1cbiAgICAgICAgICBkYXRhLXRpcFxuICAgICAgICAgIGRhdGEtZm9yPXtgJHtpdGVtLmlkfS10b29sdGlwYH1cbiAgICAgICAgICBjbGFzc05hbWU9XCJwbGF5YmFjay1jb250cm9sLWJ1dHRvblwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgb25DbGljayhpdGVtLmlkKTtcbiAgICAgICAgICAgIG9uSGlkZSgpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgey4uLmJ0blN0eWxlfVxuICAgICAgICA+XG4gICAgICAgICAgPGl0ZW0uaWNvbiBoZWlnaHQ9e2hlaWdodH0gLz5cbiAgICAgICAgICB7aXRlbS50b29sdGlwID8gKFxuICAgICAgICAgICAgPFRvb2x0aXAgaWQ9e2Ake2l0ZW0uaWR9LXRvb2x0aXBgfSBlZmZlY3Q9XCJzb2xpZFwiIHBsYWNlPVwidG9wXCI+XG4gICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXtpdGVtLnRvb2x0aXB9IC8+XG4gICAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgICkpfVxuICA8L2Rpdj5cbik7XG5cblBsYXliYWNrQ29udHJvbHNGYWN0b3J5LmRlcHMgPSBbQW5pbWF0aW9uU3BlZWRTbGlkZXJGYWN0b3J5XTtcbmZ1bmN0aW9uIFBsYXliYWNrQ29udHJvbHNGYWN0b3J5KEFuaW1hdGlvblNwZWVkU2xpZGVyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb21wbGV4aXR5XG4gIGNvbnN0IFBsYXliYWNrQ29udHJvbHMgPSAoe1xuICAgIGlzQW5pbWF0YWJsZSA9IHRydWUsXG4gICAgaXNBbmltYXRpbmcsXG4gICAgd2lkdGgsXG4gICAgc3BlZWQsXG4gICAgYW5pbWF0aW9uV2luZG93ID0gQU5JTUFUSU9OX1dJTkRPVy5mcmVlLFxuICAgIHNldEZpbHRlckFuaW1hdGlvbldpbmRvdyxcbiAgICB1cGRhdGVBbmltYXRpb25TcGVlZCxcbiAgICBwYXVzZUFuaW1hdGlvbiA9IG5vcCxcbiAgICByZXNldEFuaW1hdGlvbiA9IG5vcCxcbiAgICBzdGFydEFuaW1hdGlvbiA9IG5vcCxcbiAgICBwbGF5YmFja0ljb25zID0gREVGQVVMVF9JQ09OUyxcbiAgICBhbmltYXRpb25JdGVtcyA9IERFRkFVTFRfQU5JTUFURV9JVEVNUyxcbiAgICBidXR0b25TdHlsZSA9ICdzZWNvbmRhcnknLFxuICAgIGJ1dHRvbkhlaWdodCA9IERFRkFVTFRfQlVUVE9OX0hFSUdIVFxuICB9KSA9PiB7XG4gICAgY29uc3QgW2lzU3BlZWRDb250cm9sVmlzaWJsZSwgdG9nZ2xlU3BlZWRDb250cm9sXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbc2hvd0FuaW1hdGlvbldpbmRvd0NvbnRyb2wsIHNldFNob3dBbmltYXRpb25XaW5kb3dDb250cm9sXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICAgIGNvbnN0IHRvZ2dsZUFuaW1hdGlvbldpbmRvd0NvbnRyb2wgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgICBzZXRTaG93QW5pbWF0aW9uV2luZG93Q29udHJvbCghc2hvd0FuaW1hdGlvbldpbmRvd0NvbnRyb2wpO1xuICAgIH0sIFtzaG93QW5pbWF0aW9uV2luZG93Q29udHJvbCwgc2V0U2hvd0FuaW1hdGlvbldpbmRvd0NvbnRyb2xdKTtcbiAgICBjb25zdCBidG5TdHlsZSA9IGJ1dHRvblN0eWxlID8ge1tidXR0b25TdHlsZV06IHRydWV9IDoge307XG5cbiAgICBjb25zdCBoaWRlQW5kU2hvd1NwZWVkQ29udHJvbCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgIGlmICghaXNTcGVlZENvbnRyb2xWaXNpYmxlKSB7XG4gICAgICAgIHRvZ2dsZVNwZWVkQ29udHJvbCh0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRPRE86IEEgSEFDSyB0byBhbGxvdyBpbnB1dCBvbmJsdXIgZ2V0IHRyaWdnZXJlZCBiZWZvcmUgdGhlIGlucHV0IGlzIHVubW91bnRlZFxuICAgICAgICAvLyBBIGJldHRlciBzb2x1dGlvbiBzaG91bGQgYmUgaW52ZXN0ZWQsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzEyMzYzXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHRvZ2dsZVNwZWVkQ29udHJvbChmYWxzZSksIDIwMCk7XG4gICAgICB9XG4gICAgfSwgW2lzU3BlZWRDb250cm9sVmlzaWJsZSwgdG9nZ2xlU3BlZWRDb250cm9sXSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRBbmltYXRpb25Db250cm9sc1xuICAgICAgICBjbGFzc05hbWU9e2NsYXNzbmFtZXMoJ3BsYXliYWNrLWNvbnRyb2xzJywge1xuICAgICAgICAgIGRpc2FibGVkOiAhaXNBbmltYXRhYmxlXG4gICAgICAgIH0pfVxuICAgICAgICBzdHlsZT17e3dpZHRoOiBgJHt3aWR0aH1weGB9fVxuICAgICAgPlxuICAgICAgICB7LyoqIFdpbmRvdyAqL31cbiAgICAgICAge3NldEZpbHRlckFuaW1hdGlvbldpbmRvdyA/IChcbiAgICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgICAgZGF0YS10aXBcbiAgICAgICAgICAgIGRhdGEtZm9yPVwiYW5pbWF0ZS13aW5kb3dcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdwbGF5YmFjay1jb250cm9sLWJ1dHRvbicsIHthY3RpdmU6IHNob3dBbmltYXRpb25XaW5kb3dDb250cm9sfSl9XG4gICAgICAgICAgICBvbkNsaWNrPXt0b2dnbGVBbmltYXRpb25XaW5kb3dDb250cm9sfVxuICAgICAgICAgICAgey4uLmJ0blN0eWxlfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoYW5pbWF0aW9uSXRlbXNbYW5pbWF0aW9uV2luZG93XSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IFdpbmRvd0ljb24gPSBhbmltYXRpb25JdGVtc1thbmltYXRpb25XaW5kb3ddLmljb247XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxXaW5kb3dJY29uIGhlaWdodD17YnV0dG9uSGVpZ2h0fSAvPjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICB7YW5pbWF0aW9uSXRlbXNbYW5pbWF0aW9uV2luZG93XSAmJiBhbmltYXRpb25JdGVtc1thbmltYXRpb25XaW5kb3ddLnRvb2x0aXAgPyAoXG4gICAgICAgICAgICAgIDxUb29sdGlwIGlkPVwiYW5pbWF0ZS13aW5kb3dcIiBwbGFjZT1cInRvcFwiIGRlbGF5U2hvdz17NTAwfSBlZmZlY3Q9XCJzb2xpZFwiPlxuICAgICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXthbmltYXRpb25JdGVtc1thbmltYXRpb25XaW5kb3ddLnRvb2x0aXB9IC8+XG4gICAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAge3Nob3dBbmltYXRpb25XaW5kb3dDb250cm9sID8gKFxuICAgICAgICAgIDxBbmltYXRpb25XaW5kb3dDb250cm9sXG4gICAgICAgICAgICBvbkNsaWNrPXtzZXRGaWx0ZXJBbmltYXRpb25XaW5kb3d9XG4gICAgICAgICAgICBzZWxlY3RlZD17YW5pbWF0aW9uV2luZG93fVxuICAgICAgICAgICAgb25IaWRlPXt0b2dnbGVBbmltYXRpb25XaW5kb3dDb250cm9sfVxuICAgICAgICAgICAgaGVpZ2h0PXtidXR0b25IZWlnaHR9XG4gICAgICAgICAgICBidG5TdHlsZT17YnRuU3R5bGV9XG4gICAgICAgICAgICBhbmltYXRpb25JdGVtcz17YW5pbWF0aW9uSXRlbXN9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgey8qKiBTcGVlZCAqL31cbiAgICAgICAge3Nob3dBbmltYXRpb25XaW5kb3dDb250cm9sIHx8ICF1cGRhdGVBbmltYXRpb25TcGVlZCA/IG51bGwgOiAoXG4gICAgICAgICAgPFN0eWxlZFNwZWVkQ29udHJvbD5cbiAgICAgICAgICAgIDxJY29uQnV0dG9uXG4gICAgICAgICAgICAgIGRhdGEtdGlwXG4gICAgICAgICAgICAgIGRhdGEtZm9yPVwiYW5pbWF0ZS1zcGVlZFwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInBsYXliYWNrLWNvbnRyb2wtYnV0dG9uXCJcbiAgICAgICAgICAgICAgey4uLmJ0blN0eWxlfVxuICAgICAgICAgICAgICBvbkNsaWNrPXtoaWRlQW5kU2hvd1NwZWVkQ29udHJvbH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHBsYXliYWNrSWNvbnMuc3BlZWQgaGVpZ2h0PXtidXR0b25IZWlnaHR9IC8+XG4gICAgICAgICAgICAgIDxUb29sdGlwIGlkPVwiYW5pbWF0ZS1zcGVlZFwiIHBsYWNlPVwidG9wXCIgZGVsYXlTaG93PXtERUxBWV9TSE9XfSBlZmZlY3Q9XCJzb2xpZFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuPntwcmVjaXNlUm91bmQoc3BlZWQsIDEpfXg8L3NwYW4+XG4gICAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgICAgICAgIHtpc1NwZWVkQ29udHJvbFZpc2libGUgPyAoXG4gICAgICAgICAgICAgIDxBbmltYXRpb25TcGVlZFNsaWRlclxuICAgICAgICAgICAgICAgIG9uSGlkZT17aGlkZUFuZFNob3dTcGVlZENvbnRyb2x9XG4gICAgICAgICAgICAgICAgdXBkYXRlQW5pbWF0aW9uU3BlZWQ9e3VwZGF0ZUFuaW1hdGlvblNwZWVkfVxuICAgICAgICAgICAgICAgIHNwZWVkPXtzcGVlZH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIDwvU3R5bGVkU3BlZWRDb250cm9sPlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiogUmVzZXQgKi99XG4gICAgICAgIHtzaG93QW5pbWF0aW9uV2luZG93Q29udHJvbCA/IG51bGwgOiAoXG4gICAgICAgICAgPEljb25CdXR0b25cbiAgICAgICAgICAgIGRhdGEtdGlwXG4gICAgICAgICAgICBkYXRhLWZvcj1cImFuaW1hdGUtcmVzZXRcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicGxheWJhY2stY29udHJvbC1idXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17cmVzZXRBbmltYXRpb259XG4gICAgICAgICAgICB7Li4uYnRuU3R5bGV9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHBsYXliYWNrSWNvbnMucmVzZXQgaGVpZ2h0PXtidXR0b25IZWlnaHR9IC8+XG4gICAgICAgICAgICA8VG9vbHRpcCBpZD1cImFuaW1hdGUtcmVzZXRcIiBwbGFjZT1cInRvcFwiIGRlbGF5U2hvdz17REVMQVlfU0hPV30gZWZmZWN0PVwic29saWRcIj5cbiAgICAgICAgICAgICAgPEZvcm1hdHRlZE1lc3NhZ2UgaWQ9XCJ0b29sdGlwLnJlc2V0XCIgLz5cbiAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICA8L0ljb25CdXR0b24+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qKiBQbGF5IGFuZCBwYXVzZSAqL31cbiAgICAgICAge3Nob3dBbmltYXRpb25XaW5kb3dDb250cm9sID8gbnVsbCA6IChcbiAgICAgICAgICA8SWNvbkJ1dHRvblxuICAgICAgICAgICAgZGF0YS10aXBcbiAgICAgICAgICAgIGRhdGEtZm9yPVwiYW5pbWF0ZS1wbGF5LXBhdXNlXCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NuYW1lcygncGxheWJhY2stY29udHJvbC1idXR0b24nLCB7YWN0aXZlOiBpc0FuaW1hdGluZ30pfVxuICAgICAgICAgICAgb25DbGljaz17aXNBbmltYXRpbmcgPyBwYXVzZUFuaW1hdGlvbiA6IHN0YXJ0QW5pbWF0aW9ufVxuICAgICAgICAgICAgaGlkZT17aXNTcGVlZENvbnRyb2xWaXNpYmxlfVxuICAgICAgICAgICAgey4uLmJ0blN0eWxlfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtpc0FuaW1hdGluZyA/IChcbiAgICAgICAgICAgICAgPHBsYXliYWNrSWNvbnMucGF1c2UgaGVpZ2h0PXtidXR0b25IZWlnaHR9IC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8cGxheWJhY2tJY29ucy5wbGF5IGhlaWdodD17YnV0dG9uSGVpZ2h0fSAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxUb29sdGlwIGlkPVwiYW5pbWF0ZS1wbGF5LXBhdXNlXCIgcGxhY2U9XCJ0b3BcIiBkZWxheVNob3c9e0RFTEFZX1NIT1d9IGVmZmVjdD1cInNvbGlkXCI+XG4gICAgICAgICAgICAgIDxGb3JtYXR0ZWRNZXNzYWdlIGlkPXtpc0FuaW1hdGluZyA/ICd0b29sdGlwLnBhdXNlJyA6ICd0b29sdGlwLnBsYXknfSAvPlxuICAgICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICAgIDwvSWNvbkJ1dHRvbj5cbiAgICAgICAgKX1cbiAgICAgIDwvU3R5bGVkQW5pbWF0aW9uQ29udHJvbHM+XG4gICAgKTtcbiAgfTtcbiAgcmV0dXJuIFBsYXliYWNrQ29udHJvbHM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXliYWNrQ29udHJvbHNGYWN0b3J5O1xuIl19