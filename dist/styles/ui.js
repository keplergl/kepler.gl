'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scrollBar = exports.selectLight = exports.textInputLight = exports.select = exports.textInput = exports.linkButton = exports.secondaryButton = exports.button = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _buttonIcon, _linkButton;

var _base = require('./base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buttonStyle = {
  borderRadius: _base.borderRadius,
  borderStyle: 'solid',
  borderWidth: '2px',
  boxShadow: _base.boxShadow,
  boxSizing: 'border-box',
  cursor: 'pointer',
  display: 'inline-block',
  fontWeight: 400,
  outline: 0,
  textAlign: 'center',
  transition: _base.transition,
  verticalAlign: 'middle'
};

var sizeNormal = {
  fontSize: '13px',
  padding: '7px 14px'
};

var sizeSmall = {
  fontSize: '12px',
  padding: '4px 14px',

  ' .icon': {
    fontSize: '14px',
    marginRight: '3px'
  }
};

var buttonIcon = (_buttonIcon = {}, _buttonIcon[' svg'] = {
  marginTop: '-3px',
  marginLeft: '-7px',
  marginRight: '3px',
  verticalAlign: 'middle'
}, _buttonIcon[' .icon'] = {
  fontSize: '14px',
  marginRight: '3px'
}, _buttonIcon);

var buttonColor = {
  backgroundColor: _base.activeColor,
  borderColor: _base.activeColor,
  color: 'white'
};

var buttonColorHover = {
  backgroundColor: _base.activeColorHover,
  borderColor: _base.activeColorHover
};

var secondaryColor = {
  backgroundColor: 'transparent',
  borderColor: _base.selectBackground,
  color: _base.selectBackground,
  boxShadow: 'none'
};

var secondaryColorHover = {
  backgroundColor: _base.panelBackground,
  borderColor: _base.panelBackground,
  color: _base.textColor
};

var linkButtonColor = {
  color: _base.labelColor,
  backgroundColor: _base.sidePanelBg,
  borderColor: _base.sidePanelBg,
  boxShadow: 'none'
};

var linkButtonColorHover = (0, _extends3.default)({}, linkButtonColor, {
  color: _base.textColor
});

var inactiveButton = {
  opacity: 0.4,
  pointerEvents: 'none'
};

var button = exports.button = {
  ' .button': (0, _extends3.default)({}, buttonStyle, sizeNormal, buttonColor, buttonIcon),

  ' .button-small': (0, _extends3.default)({}, sizeSmall),

  ' .button:hover, .button:focus, .button:active': (0, _extends3.default)({}, buttonColorHover),

  ' .button.inactive': (0, _extends3.default)({}, inactiveButton)
};

var secondaryButton = exports.secondaryButton = {
  ' .button-secondary': (0, _extends3.default)({}, secondaryColor),

  ' .button-secondary:hover': (0, _extends3.default)({}, secondaryColorHover)
};

var linkButton = exports.linkButton = (_linkButton = {
  ' .button.button-link': (0, _extends3.default)({}, linkButtonColor)
}, _linkButton[' .button-link:hover, .button-link:focus, .button-link:active'] = (0, _extends3.default)({}, linkButtonColorHover), _linkButton);

var inputBase = {
  transition: _base.transition,
  padding: '4px 10px',
  height: '28px',
  fontSize: '12px',
  outline: 'none'
};

var input = {
  normal: (0, _extends3.default)({}, inputBase, {
    background: _base.selectBackground,
    border: _base.panelBorder,
    color: _base.selectColor
  }),
  error: {
    borderColor: _base.errorColor
  },
  hover: {
    background: _base.selectBackgroundHover
  },
  focus: {
    color: _base.selectColor,
    boxShadow: 0
  },
  disabled: {
    pointerEvents: 'none',
    background: _base.selectBackground
  }
};

var inputLight = {
  normal: (0, _extends3.default)({}, inputBase, {
    background: _base.selectBackgroundLT,
    border: _base.panelBorderLT,
    color: _base.selectColorLT
  }),
  error: {
    borderColor: _base.errorColor
  },
  hover: {
    background: _base.selectBackgroundHoverLT,
    cursor: 'pointer'
  },
  focus: {
    color: _base.selectColorLT,
    boxShadow: 0
  },
  disabled: {
    pointerEvents: 'none',
    background: _base.selectBackgroundLT
  }
};

function assignInputSelectColor(inputClass, selectClass, colorConfig) {
  var _selectStyle;

  var _map = [inputClass, selectClass].map(function (className) {
    var _ref;

    return _ref = {}, _ref[className] = colorConfig.normal, _ref[className + ':hover'] = colorConfig.hover, _ref[className + '.error'] = colorConfig.error, _ref[className + '.focus, ' + className + ':focus'] = colorConfig.focus, _ref[className + '.disabled'] = colorConfig.disabled, _ref;
  }),
      inputStyle = _map[0],
      selectStyle = _map[1];

  inputStyle[inputClass + '.text-input--textarea'] = {
    width: '100%',
    height: 'auto',
    resize: 'none'
  };

  selectStyle[selectClass] = (0, _extends3.default)({}, selectStyle[selectClass], {
    padding: 0,
    border: 0
  });

  selectStyle[' ' + selectClass + '.disabled'] = (_selectStyle = {
    opacity: 0.3
  }, _selectStyle[' select:disabled'] = (0, _extends3.default)({}, colorConfig.disabled, { border: 0 }), _selectStyle);

  selectStyle[' ' + selectClass + ' select'] = (0, _extends3.default)({}, colorConfig.normal);

  selectStyle[' ' + selectClass + ':hover select'] = (0, _extends3.default)({}, colorConfig.hover);

  selectStyle[' ' + selectClass + ':after'] = {
    content: '"\\ea74"',
    fontFamily: 'uber-icons',
    webkitFontSmoothing: 'antialiased',
    position: 'absolute',
    right: '15px',
    transform: 'rotate(180deg)',
    color: _base.labelColor
  };

  return [inputStyle, selectStyle];
}

var _assignInputSelectCol = assignInputSelectColor(' .text-input', ' .select', input);

var textInput = _assignInputSelectCol[0],
    select = _assignInputSelectCol[1];
exports.textInput = textInput;
exports.select = select;

var _assignInputSelectCol2 = assignInputSelectColor(' .text-input--light', ' .select--light', inputLight);

var textInputLight = _assignInputSelectCol2[0],
    selectLight = _assignInputSelectCol2[1];

// TODO: this needs to be removed since we have the styled-component element
// defined in base.js Keep it for now until re reword side-panel.js using styed-components

exports.textInputLight = textInputLight;
exports.selectLight = selectLight;
var scrollBar = exports.scrollBar = {
  '::-webkit-scrollbar': {
    width: '14px'
  },

  '::-webkit-scrollbar-track': {
    background: _base.sidePanelBg
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    background: _base.panelBackground,
    border: '3px solid ' + _base.sidePanelBg,

    ':vertical': {
      background: _base.panelBackground
    },

    ':vertical:hover': {
      background: _base.selectBackgroundHover
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHlsZXMvdWkuanMiXSwibmFtZXMiOlsiYnV0dG9uU3R5bGUiLCJib3JkZXJSYWRpdXMiLCJib3JkZXJTdHlsZSIsImJvcmRlcldpZHRoIiwiYm94U2hhZG93IiwiYm94U2l6aW5nIiwiY3Vyc29yIiwiZGlzcGxheSIsImZvbnRXZWlnaHQiLCJvdXRsaW5lIiwidGV4dEFsaWduIiwidHJhbnNpdGlvbiIsInZlcnRpY2FsQWxpZ24iLCJzaXplTm9ybWFsIiwiZm9udFNpemUiLCJwYWRkaW5nIiwic2l6ZVNtYWxsIiwibWFyZ2luUmlnaHQiLCJidXR0b25JY29uIiwibWFyZ2luVG9wIiwibWFyZ2luTGVmdCIsImJ1dHRvbkNvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwiYm9yZGVyQ29sb3IiLCJjb2xvciIsImJ1dHRvbkNvbG9ySG92ZXIiLCJzZWNvbmRhcnlDb2xvciIsInNlY29uZGFyeUNvbG9ySG92ZXIiLCJsaW5rQnV0dG9uQ29sb3IiLCJsaW5rQnV0dG9uQ29sb3JIb3ZlciIsImluYWN0aXZlQnV0dG9uIiwib3BhY2l0eSIsInBvaW50ZXJFdmVudHMiLCJidXR0b24iLCJzZWNvbmRhcnlCdXR0b24iLCJsaW5rQnV0dG9uIiwiaW5wdXRCYXNlIiwiaGVpZ2h0IiwiaW5wdXQiLCJub3JtYWwiLCJiYWNrZ3JvdW5kIiwiYm9yZGVyIiwiZXJyb3IiLCJob3ZlciIsImZvY3VzIiwiZGlzYWJsZWQiLCJpbnB1dExpZ2h0IiwiYXNzaWduSW5wdXRTZWxlY3RDb2xvciIsImlucHV0Q2xhc3MiLCJzZWxlY3RDbGFzcyIsImNvbG9yQ29uZmlnIiwibWFwIiwiY2xhc3NOYW1lIiwiaW5wdXRTdHlsZSIsInNlbGVjdFN0eWxlIiwid2lkdGgiLCJyZXNpemUiLCJjb250ZW50IiwiZm9udEZhbWlseSIsIndlYmtpdEZvbnRTbW9vdGhpbmciLCJwb3NpdGlvbiIsInJpZ2h0IiwidHJhbnNmb3JtIiwidGV4dElucHV0Iiwic2VsZWN0IiwidGV4dElucHV0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Q0MseUJBQXFCLGFBSGdCO0FBSXJDQyxjQUFVLFVBSjJCO0FBS3JDQyxXQUFPLE1BTDhCO0FBTXJDQyxlQUFXLGdCQU4wQjtBQU9yQ3RDO0FBUHFDLEdBQXZDOztBQVVBLFNBQU8sQ0FBQzZCLFVBQUQsRUFBYUMsV0FBYixDQUFQO0FBQ0Q7OzRCQUVrQ1AsdUJBQ2pDLGNBRGlDLEVBRWpDLFVBRmlDLEVBR2pDVCxLQUhpQyxDOztJQUFyQnlCLFM7SUFBV0MsTTs7Ozs2QkFLb0JqQix1QkFDM0MscUJBRDJDLEVBRTNDLGlCQUYyQyxFQUczQ0QsVUFIMkMsQzs7SUFBL0JtQixjO0lBQWdCQyxXOztBQU05QjtBQUNBOzs7O0FBQ08sSUFBTUMsZ0NBQVk7QUFDdkIseUJBQXVCO0FBQ3JCWixXQUFPO0FBRGMsR0FEQTs7QUFLdkIsK0JBQTZCO0FBQzNCZjtBQUQyQixHQUxOOztBQVN2QiwrQkFBNkI7QUFDM0J2QyxrQkFBYyxNQURhO0FBRTNCdUMscUNBRjJCO0FBRzNCQyw0Q0FIMkI7O0FBSzNCLGlCQUFhO0FBQ1hEO0FBRFcsS0FMYzs7QUFTM0IsdUJBQW1CO0FBQ2pCQTtBQURpQjtBQVRRO0FBVE4sQ0FBbEIiLCJmaWxlIjoidWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBhY3RpdmVDb2xvcixcbiAgYWN0aXZlQ29sb3JIb3ZlcixcbiAgYm9yZGVyUmFkaXVzLFxuICBib3hTaGFkb3csXG4gIGVycm9yQ29sb3IsXG4gIGxhYmVsQ29sb3IsXG4gIHBhbmVsQmFja2dyb3VuZCxcbiAgcGFuZWxCb3JkZXIsXG4gIHBhbmVsQm9yZGVyTFQsXG4gIHNlbGVjdEJhY2tncm91bmQsXG4gIHNlbGVjdEJhY2tncm91bmRMVCxcbiAgc2VsZWN0QmFja2dyb3VuZEhvdmVyLFxuICBzZWxlY3RCYWNrZ3JvdW5kSG92ZXJMVCxcbiAgc2VsZWN0Q29sb3IsXG4gIHNlbGVjdENvbG9yTFQsXG4gIHNpZGVQYW5lbEJnLFxuICB0ZXh0Q29sb3IsXG4gIHRyYW5zaXRpb25cbn0gZnJvbSAnLi9iYXNlJztcblxuY29uc3QgYnV0dG9uU3R5bGUgPSB7XG4gIGJvcmRlclJhZGl1cyxcbiAgYm9yZGVyU3R5bGU6ICdzb2xpZCcsXG4gIGJvcmRlcldpZHRoOiAnMnB4JyxcbiAgYm94U2hhZG93LFxuICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgY3Vyc29yOiAncG9pbnRlcicsXG4gIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICBmb250V2VpZ2h0OiA0MDAsXG4gIG91dGxpbmU6IDAsXG4gIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gIHRyYW5zaXRpb24sXG4gIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnXG59O1xuXG5jb25zdCBzaXplTm9ybWFsID0ge1xuICBmb250U2l6ZTogJzEzcHgnLFxuICBwYWRkaW5nOiAnN3B4IDE0cHgnXG59O1xuXG5jb25zdCBzaXplU21hbGwgPSB7XG4gIGZvbnRTaXplOiAnMTJweCcsXG4gIHBhZGRpbmc6ICc0cHggMTRweCcsXG5cbiAgJyAuaWNvbic6IHtcbiAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgIG1hcmdpblJpZ2h0OiAnM3B4J1xuICB9XG59O1xuXG5jb25zdCBidXR0b25JY29uID0ge1xuICBbJyBzdmcnXToge1xuICAgIG1hcmdpblRvcDogJy0zcHgnLFxuICAgIG1hcmdpbkxlZnQ6ICctN3B4JyxcbiAgICBtYXJnaW5SaWdodDogJzNweCcsXG4gICAgdmVydGljYWxBbGlnbjogJ21pZGRsZSdcbiAgfSxcbiAgJyAuaWNvbic6IHtcbiAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgIG1hcmdpblJpZ2h0OiAnM3B4J1xuICB9XG59O1xuXG5jb25zdCBidXR0b25Db2xvciA9IHtcbiAgYmFja2dyb3VuZENvbG9yOiBhY3RpdmVDb2xvcixcbiAgYm9yZGVyQ29sb3I6IGFjdGl2ZUNvbG9yLFxuICBjb2xvcjogJ3doaXRlJ1xufTtcblxuY29uc3QgYnV0dG9uQ29sb3JIb3ZlciA9IHtcbiAgYmFja2dyb3VuZENvbG9yOiBhY3RpdmVDb2xvckhvdmVyLFxuICBib3JkZXJDb2xvcjogYWN0aXZlQ29sb3JIb3ZlclxufTtcblxuY29uc3Qgc2Vjb25kYXJ5Q29sb3IgPSB7XG4gIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgYm9yZGVyQ29sb3I6IHNlbGVjdEJhY2tncm91bmQsXG4gIGNvbG9yOiBzZWxlY3RCYWNrZ3JvdW5kLFxuICBib3hTaGFkb3c6ICdub25lJ1xufTtcblxuY29uc3Qgc2Vjb25kYXJ5Q29sb3JIb3ZlciA9IHtcbiAgYmFja2dyb3VuZENvbG9yOiBwYW5lbEJhY2tncm91bmQsXG4gIGJvcmRlckNvbG9yOiBwYW5lbEJhY2tncm91bmQsXG4gIGNvbG9yOiB0ZXh0Q29sb3Jcbn07XG5cbmNvbnN0IGxpbmtCdXR0b25Db2xvciA9IHtcbiAgY29sb3I6IGxhYmVsQ29sb3IsXG4gIGJhY2tncm91bmRDb2xvcjogc2lkZVBhbmVsQmcsXG4gIGJvcmRlckNvbG9yOiBzaWRlUGFuZWxCZyxcbiAgYm94U2hhZG93OiAnbm9uZSdcbn07XG5cbmNvbnN0IGxpbmtCdXR0b25Db2xvckhvdmVyID0ge1xuICAuLi5saW5rQnV0dG9uQ29sb3IsXG4gIGNvbG9yOiB0ZXh0Q29sb3Jcbn07XG5cbmNvbnN0IGluYWN0aXZlQnV0dG9uID0ge1xuICBvcGFjaXR5OiAwLjQsXG4gIHBvaW50ZXJFdmVudHM6ICdub25lJ1xufTtcblxuZXhwb3J0IGNvbnN0IGJ1dHRvbiA9IHtcbiAgJyAuYnV0dG9uJzoge1xuICAgIC4uLmJ1dHRvblN0eWxlLFxuICAgIC4uLnNpemVOb3JtYWwsXG4gICAgLi4uYnV0dG9uQ29sb3IsXG4gICAgLi4uYnV0dG9uSWNvblxuICB9LFxuXG4gICcgLmJ1dHRvbi1zbWFsbCc6IHtcbiAgICAuLi5zaXplU21hbGxcbiAgfSxcblxuICAnIC5idXR0b246aG92ZXIsIC5idXR0b246Zm9jdXMsIC5idXR0b246YWN0aXZlJzoge1xuICAgIC4uLmJ1dHRvbkNvbG9ySG92ZXJcbiAgfSxcblxuICAnIC5idXR0b24uaW5hY3RpdmUnOiB7XG4gICAgLi4uaW5hY3RpdmVCdXR0b25cbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNlY29uZGFyeUJ1dHRvbiA9IHtcbiAgJyAuYnV0dG9uLXNlY29uZGFyeSc6IHtcbiAgICAuLi5zZWNvbmRhcnlDb2xvclxuICB9LFxuXG4gICcgLmJ1dHRvbi1zZWNvbmRhcnk6aG92ZXInOiB7XG4gICAgLi4uc2Vjb25kYXJ5Q29sb3JIb3ZlclxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgbGlua0J1dHRvbiA9IHtcbiAgJyAuYnV0dG9uLmJ1dHRvbi1saW5rJzoge1xuICAgIC4uLmxpbmtCdXR0b25Db2xvclxuICB9LFxuICBbYCAuYnV0dG9uLWxpbms6aG92ZXIsIC5idXR0b24tbGluazpmb2N1cywgLmJ1dHRvbi1saW5rOmFjdGl2ZWBdOiB7XG4gICAgLi4ubGlua0J1dHRvbkNvbG9ySG92ZXJcbiAgfVxufTtcblxuY29uc3QgaW5wdXRCYXNlID0ge1xuICB0cmFuc2l0aW9uLFxuICBwYWRkaW5nOiAnNHB4IDEwcHgnLFxuICBoZWlnaHQ6ICcyOHB4JyxcbiAgZm9udFNpemU6ICcxMnB4JyxcbiAgb3V0bGluZTogJ25vbmUnXG59O1xuXG5jb25zdCBpbnB1dCA9IHtcbiAgbm9ybWFsOiB7XG4gICAgLi4uaW5wdXRCYXNlLFxuICAgIGJhY2tncm91bmQ6IHNlbGVjdEJhY2tncm91bmQsXG4gICAgYm9yZGVyOiBwYW5lbEJvcmRlcixcbiAgICBjb2xvcjogc2VsZWN0Q29sb3JcbiAgfSxcbiAgZXJyb3I6IHtcbiAgICBib3JkZXJDb2xvcjogZXJyb3JDb2xvclxuICB9LFxuICBob3Zlcjoge1xuICAgIGJhY2tncm91bmQ6IHNlbGVjdEJhY2tncm91bmRIb3ZlclxuICB9LFxuICBmb2N1czoge1xuICAgIGNvbG9yOiBzZWxlY3RDb2xvcixcbiAgICBib3hTaGFkb3c6IDBcbiAgfSxcbiAgZGlzYWJsZWQ6IHtcbiAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgYmFja2dyb3VuZDogc2VsZWN0QmFja2dyb3VuZFxuICB9XG59O1xuXG5jb25zdCBpbnB1dExpZ2h0ID0ge1xuICBub3JtYWw6IHtcbiAgICAuLi5pbnB1dEJhc2UsXG4gICAgYmFja2dyb3VuZDogc2VsZWN0QmFja2dyb3VuZExULFxuICAgIGJvcmRlcjogcGFuZWxCb3JkZXJMVCxcbiAgICBjb2xvcjogc2VsZWN0Q29sb3JMVFxuICB9LFxuICBlcnJvcjoge1xuICAgIGJvcmRlckNvbG9yOiBlcnJvckNvbG9yXG4gIH0sXG4gIGhvdmVyOiB7XG4gICAgYmFja2dyb3VuZDogc2VsZWN0QmFja2dyb3VuZEhvdmVyTFQsXG4gICAgY3Vyc29yOiAncG9pbnRlcidcbiAgfSxcbiAgZm9jdXM6IHtcbiAgICBjb2xvcjogc2VsZWN0Q29sb3JMVCxcbiAgICBib3hTaGFkb3c6IDBcbiAgfSxcbiAgZGlzYWJsZWQ6IHtcbiAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgYmFja2dyb3VuZDogc2VsZWN0QmFja2dyb3VuZExUXG4gIH1cbn07XG5cbmZ1bmN0aW9uIGFzc2lnbklucHV0U2VsZWN0Q29sb3IoaW5wdXRDbGFzcywgc2VsZWN0Q2xhc3MsIGNvbG9yQ29uZmlnKSB7XG4gIGNvbnN0IFtpbnB1dFN0eWxlLCBzZWxlY3RTdHlsZV0gPSBbaW5wdXRDbGFzcywgc2VsZWN0Q2xhc3NdLm1hcChcbiAgICBjbGFzc05hbWUgPT4gKHtcbiAgICAgIFtjbGFzc05hbWVdOiBjb2xvckNvbmZpZy5ub3JtYWwsXG4gICAgICBbYCR7Y2xhc3NOYW1lfTpob3ZlcmBdOiBjb2xvckNvbmZpZy5ob3ZlcixcbiAgICAgIFtgJHtjbGFzc05hbWV9LmVycm9yYF06IGNvbG9yQ29uZmlnLmVycm9yLFxuICAgICAgW2Ake2NsYXNzTmFtZX0uZm9jdXMsICR7Y2xhc3NOYW1lfTpmb2N1c2BdOiBjb2xvckNvbmZpZy5mb2N1cyxcbiAgICAgIFtgJHtjbGFzc05hbWV9LmRpc2FibGVkYF06IGNvbG9yQ29uZmlnLmRpc2FibGVkXG4gICAgfSlcbiAgKTtcblxuICBpbnB1dFN0eWxlW2Ake2lucHV0Q2xhc3N9LnRleHQtaW5wdXQtLXRleHRhcmVhYF0gPSB7XG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICdhdXRvJyxcbiAgICByZXNpemU6ICdub25lJ1xuICB9O1xuXG4gIHNlbGVjdFN0eWxlW3NlbGVjdENsYXNzXSA9IHtcbiAgICAuLi5zZWxlY3RTdHlsZVtzZWxlY3RDbGFzc10sXG4gICAgcGFkZGluZzogMCxcbiAgICBib3JkZXI6IDBcbiAgfTtcblxuICBzZWxlY3RTdHlsZVtgICR7c2VsZWN0Q2xhc3N9LmRpc2FibGVkYF0gPSB7XG4gICAgb3BhY2l0eTogMC4zLFxuICAgIFsnIHNlbGVjdDpkaXNhYmxlZCddOiB7Li4uY29sb3JDb25maWcuZGlzYWJsZWQsIGJvcmRlcjogMH1cbiAgfTtcblxuICBzZWxlY3RTdHlsZVtgICR7c2VsZWN0Q2xhc3N9IHNlbGVjdGBdID0ge1xuICAgIC4uLmNvbG9yQ29uZmlnLm5vcm1hbFxuICB9O1xuXG4gIHNlbGVjdFN0eWxlW2AgJHtzZWxlY3RDbGFzc306aG92ZXIgc2VsZWN0YF0gPSB7XG4gICAgLi4uY29sb3JDb25maWcuaG92ZXJcbiAgfTtcblxuICBzZWxlY3RTdHlsZVtgICR7c2VsZWN0Q2xhc3N9OmFmdGVyYF0gPSB7XG4gICAgY29udGVudDogYFwiXFxcXGVhNzRcImAsXG4gICAgZm9udEZhbWlseTogJ3ViZXItaWNvbnMnLFxuICAgIHdlYmtpdEZvbnRTbW9vdGhpbmc6ICdhbnRpYWxpYXNlZCcsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgcmlnaHQ6ICcxNXB4JyxcbiAgICB0cmFuc2Zvcm06ICdyb3RhdGUoMTgwZGVnKScsXG4gICAgY29sb3I6IGxhYmVsQ29sb3JcbiAgfTtcblxuICByZXR1cm4gW2lucHV0U3R5bGUsIHNlbGVjdFN0eWxlXTtcbn1cblxuZXhwb3J0IGNvbnN0IFt0ZXh0SW5wdXQsIHNlbGVjdF0gPSBhc3NpZ25JbnB1dFNlbGVjdENvbG9yKFxuICAnIC50ZXh0LWlucHV0JyxcbiAgJyAuc2VsZWN0JyxcbiAgaW5wdXRcbik7XG5leHBvcnQgY29uc3QgW3RleHRJbnB1dExpZ2h0LCBzZWxlY3RMaWdodF0gPSBhc3NpZ25JbnB1dFNlbGVjdENvbG9yKFxuICAnIC50ZXh0LWlucHV0LS1saWdodCcsXG4gICcgLnNlbGVjdC0tbGlnaHQnLFxuICBpbnB1dExpZ2h0XG4pO1xuXG4vLyBUT0RPOiB0aGlzIG5lZWRzIHRvIGJlIHJlbW92ZWQgc2luY2Ugd2UgaGF2ZSB0aGUgc3R5bGVkLWNvbXBvbmVudCBlbGVtZW50XG4vLyBkZWZpbmVkIGluIGJhc2UuanMgS2VlcCBpdCBmb3Igbm93IHVudGlsIHJlIHJld29yZCBzaWRlLXBhbmVsLmpzIHVzaW5nIHN0eWVkLWNvbXBvbmVudHNcbmV4cG9ydCBjb25zdCBzY3JvbGxCYXIgPSB7XG4gICc6Oi13ZWJraXQtc2Nyb2xsYmFyJzoge1xuICAgIHdpZHRoOiAnMTRweCdcbiAgfSxcblxuICAnOjotd2Via2l0LXNjcm9sbGJhci10cmFjayc6IHtcbiAgICBiYWNrZ3JvdW5kOiBzaWRlUGFuZWxCZ1xuICB9LFxuXG4gICc6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iJzoge1xuICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgIGJhY2tncm91bmQ6IHBhbmVsQmFja2dyb3VuZCxcbiAgICBib3JkZXI6IGAzcHggc29saWQgJHtzaWRlUGFuZWxCZ31gLFxuXG4gICAgJzp2ZXJ0aWNhbCc6IHtcbiAgICAgIGJhY2tncm91bmQ6IHBhbmVsQmFja2dyb3VuZFxuICAgIH0sXG5cbiAgICAnOnZlcnRpY2FsOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZDogc2VsZWN0QmFja2dyb3VuZEhvdmVyXG4gICAgfVxuICB9XG59O1xuIl19