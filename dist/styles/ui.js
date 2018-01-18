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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHlsZXMvdWkuanMiXSwibmFtZXMiOlsiYnV0dG9uU3R5bGUiLCJib3JkZXJSYWRpdXMiLCJib3JkZXJTdHlsZSIsImJvcmRlcldpZHRoIiwiYm94U2hhZG93IiwiYm94U2l6aW5nIiwiY3Vyc29yIiwiZGlzcGxheSIsImZvbnRXZWlnaHQiLCJvdXRsaW5lIiwidGV4dEFsaWduIiwidHJhbnNpdGlvbiIsInZlcnRpY2FsQWxpZ24iLCJzaXplTm9ybWFsIiwiZm9udFNpemUiLCJwYWRkaW5nIiwic2l6ZVNtYWxsIiwibWFyZ2luUmlnaHQiLCJidXR0b25JY29uIiwibWFyZ2luVG9wIiwibWFyZ2luTGVmdCIsImJ1dHRvbkNvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwiYm9yZGVyQ29sb3IiLCJjb2xvciIsImJ1dHRvbkNvbG9ySG92ZXIiLCJzZWNvbmRhcnlDb2xvciIsInNlY29uZGFyeUNvbG9ySG92ZXIiLCJsaW5rQnV0dG9uQ29sb3IiLCJsaW5rQnV0dG9uQ29sb3JIb3ZlciIsImluYWN0aXZlQnV0dG9uIiwib3BhY2l0eSIsInBvaW50ZXJFdmVudHMiLCJidXR0b24iLCJzZWNvbmRhcnlCdXR0b24iLCJsaW5rQnV0dG9uIiwiaW5wdXRCYXNlIiwiaGVpZ2h0IiwiaW5wdXQiLCJub3JtYWwiLCJiYWNrZ3JvdW5kIiwiYm9yZGVyIiwiZXJyb3IiLCJob3ZlciIsImZvY3VzIiwiZGlzYWJsZWQiLCJpbnB1dExpZ2h0IiwiYXNzaWduSW5wdXRTZWxlY3RDb2xvciIsImlucHV0Q2xhc3MiLCJzZWxlY3RDbGFzcyIsImNvbG9yQ29uZmlnIiwibWFwIiwiY2xhc3NOYW1lIiwiaW5wdXRTdHlsZSIsInNlbGVjdFN0eWxlIiwid2lkdGgiLCJyZXNpemUiLCJjb250ZW50IiwiZm9udEZhbWlseSIsIndlYmtpdEZvbnRTbW9vdGhpbmciLCJwb3NpdGlvbiIsInJpZ2h0IiwidHJhbnNmb3JtIiwidGV4dElucHV0Iiwic2VsZWN0IiwidGV4dElucHV0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WUFGeUI7QUFHckNDLHlCQUFxQixhQUhnQjtBQUlyQ0MsY0FBVSxVQUoyQjtBQUtyQ0MsV0FBTyxNQUw4QjtBQU1yQ0MsZUFBVyxnQkFOMEI7QUFPckN0QztBQVBxQyxHQUF2Qzs7QUFVQSxTQUFPLENBQUM2QixVQUFELEVBQWFDLFdBQWIsQ0FBUDtBQUNEOzs0QkFFa0NQLHVCQUF1QixjQUF2QixFQUF1QyxVQUF2QyxFQUFtRFQsS0FBbkQsQzs7SUFBckJ5QixTO0lBQVdDLE07Ozs7NkJBQ29CakIsdUJBQXVCLHFCQUF2QixFQUE4QyxpQkFBOUMsRUFBaUVELFVBQWpFLEM7O0lBQS9CbUIsYztJQUFnQkMsVzs7QUFFOUI7QUFDQTs7OztBQUNPLElBQU1DLGdDQUFZO0FBQ3ZCLHlCQUF1QjtBQUNyQlosV0FBTztBQURjLEdBREE7O0FBS3ZCLCtCQUE2QjtBQUMzQmY7QUFEMkIsR0FMTjs7QUFTdkIsK0JBQTZCO0FBQzNCdkMsa0JBQWMsTUFEYTtBQUUzQnVDLHFDQUYyQjtBQUczQkMsNENBSDJCOztBQUszQixpQkFBYTtBQUNYRDtBQURXLEtBTGM7O0FBUzNCLHVCQUFtQjtBQUNqQkE7QUFEaUI7QUFUUTtBQVROLENBQWxCIiwiZmlsZSI6InVpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgYWN0aXZlQ29sb3IsXG4gIGFjdGl2ZUNvbG9ySG92ZXIsXG4gIGJvcmRlclJhZGl1cyxcbiAgYm94U2hhZG93LFxuICBlcnJvckNvbG9yLFxuICBsYWJlbENvbG9yLFxuICBwYW5lbEJhY2tncm91bmQsXG4gIHBhbmVsQm9yZGVyLFxuICBwYW5lbEJvcmRlckxULFxuICBzZWxlY3RCYWNrZ3JvdW5kLFxuICBzZWxlY3RCYWNrZ3JvdW5kTFQsXG4gIHNlbGVjdEJhY2tncm91bmRIb3ZlcixcbiAgc2VsZWN0QmFja2dyb3VuZEhvdmVyTFQsXG4gIHNlbGVjdENvbG9yLFxuICBzZWxlY3RDb2xvckxULFxuICBzaWRlUGFuZWxCZyxcbiAgdGV4dENvbG9yLFxuICB0cmFuc2l0aW9uXG59IGZyb20gJy4vYmFzZSc7XG5cbmNvbnN0IGJ1dHRvblN0eWxlID0ge1xuICBib3JkZXJSYWRpdXMsXG4gIGJvcmRlclN0eWxlOiAnc29saWQnLFxuICBib3JkZXJXaWR0aDogJzJweCcsXG4gIGJveFNoYWRvdyxcbiAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gIGN1cnNvcjogJ3BvaW50ZXInLFxuICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgZm9udFdlaWdodDogNDAwLFxuICBvdXRsaW5lOiAwLFxuICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICB0cmFuc2l0aW9uLFxuICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJ1xufTtcblxuY29uc3Qgc2l6ZU5vcm1hbCA9IHtcbiAgZm9udFNpemU6ICcxM3B4JyxcbiAgcGFkZGluZzogJzdweCAxNHB4J1xufTtcblxuY29uc3Qgc2l6ZVNtYWxsID0ge1xuICBmb250U2l6ZTogJzEycHgnLFxuICBwYWRkaW5nOiAnNHB4IDE0cHgnLFxuXG4gICcgLmljb24nOiB7XG4gICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICBtYXJnaW5SaWdodDogJzNweCdcbiAgfVxufTtcblxuY29uc3QgYnV0dG9uSWNvbiA9IHtcbiAgWycgc3ZnJ106IHtcbiAgICBtYXJnaW5Ub3A6ICctM3B4JyxcbiAgICBtYXJnaW5MZWZ0OiAnLTdweCcsXG4gICAgbWFyZ2luUmlnaHQ6ICczcHgnLFxuICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnXG4gIH0sXG4gICcgLmljb24nOiB7XG4gICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICBtYXJnaW5SaWdodDogJzNweCdcbiAgfVxufTtcblxuY29uc3QgYnV0dG9uQ29sb3IgPSB7XG4gIGJhY2tncm91bmRDb2xvcjogYWN0aXZlQ29sb3IsXG4gIGJvcmRlckNvbG9yOiBhY3RpdmVDb2xvcixcbiAgY29sb3I6ICd3aGl0ZSdcbn07XG5cbmNvbnN0IGJ1dHRvbkNvbG9ySG92ZXIgPSB7XG4gIGJhY2tncm91bmRDb2xvcjogYWN0aXZlQ29sb3JIb3ZlcixcbiAgYm9yZGVyQ29sb3I6IGFjdGl2ZUNvbG9ySG92ZXJcbn07XG5cbmNvbnN0IHNlY29uZGFyeUNvbG9yID0ge1xuICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gIGJvcmRlckNvbG9yOiBzZWxlY3RCYWNrZ3JvdW5kLFxuICBjb2xvcjogc2VsZWN0QmFja2dyb3VuZCxcbiAgYm94U2hhZG93OiAnbm9uZSdcbn07XG5cbmNvbnN0IHNlY29uZGFyeUNvbG9ySG92ZXIgPSB7XG4gIGJhY2tncm91bmRDb2xvcjogcGFuZWxCYWNrZ3JvdW5kLFxuICBib3JkZXJDb2xvcjogcGFuZWxCYWNrZ3JvdW5kLFxuICBjb2xvcjogdGV4dENvbG9yXG59O1xuXG5jb25zdCBsaW5rQnV0dG9uQ29sb3IgPSB7XG4gIGNvbG9yOiBsYWJlbENvbG9yLFxuICBiYWNrZ3JvdW5kQ29sb3I6IHNpZGVQYW5lbEJnLFxuICBib3JkZXJDb2xvcjogc2lkZVBhbmVsQmcsXG4gIGJveFNoYWRvdzogJ25vbmUnXG59O1xuXG5jb25zdCBsaW5rQnV0dG9uQ29sb3JIb3ZlciA9IHtcbiAgLi4ubGlua0J1dHRvbkNvbG9yLFxuICBjb2xvcjogdGV4dENvbG9yXG59O1xuXG5jb25zdCBpbmFjdGl2ZUJ1dHRvbiA9IHtcbiAgb3BhY2l0eTogMC40LFxuICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbn07XG5cbmV4cG9ydCBjb25zdCBidXR0b24gPSB7XG4gICcgLmJ1dHRvbic6IHtcbiAgICAuLi5idXR0b25TdHlsZSxcbiAgICAuLi5zaXplTm9ybWFsLFxuICAgIC4uLmJ1dHRvbkNvbG9yLFxuICAgIC4uLmJ1dHRvbkljb25cbiAgfSxcblxuICAnIC5idXR0b24tc21hbGwnOiB7XG4gICAgLi4uc2l6ZVNtYWxsXG4gIH0sXG5cbiAgJyAuYnV0dG9uOmhvdmVyLCAuYnV0dG9uOmZvY3VzLCAuYnV0dG9uOmFjdGl2ZSc6IHtcbiAgICAuLi5idXR0b25Db2xvckhvdmVyXG4gIH0sXG5cbiAgJyAuYnV0dG9uLmluYWN0aXZlJzoge1xuICAgIC4uLmluYWN0aXZlQnV0dG9uXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzZWNvbmRhcnlCdXR0b24gPSB7XG4gICcgLmJ1dHRvbi1zZWNvbmRhcnknOiB7XG4gICAgLi4uc2Vjb25kYXJ5Q29sb3JcbiAgfSxcblxuICAnIC5idXR0b24tc2Vjb25kYXJ5OmhvdmVyJzoge1xuICAgIC4uLnNlY29uZGFyeUNvbG9ySG92ZXJcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGxpbmtCdXR0b24gPSB7XG4gICcgLmJ1dHRvbi5idXR0b24tbGluayc6IHtcbiAgICAuLi5saW5rQnV0dG9uQ29sb3JcbiAgfSxcbiAgW2AgLmJ1dHRvbi1saW5rOmhvdmVyLCAuYnV0dG9uLWxpbms6Zm9jdXMsIC5idXR0b24tbGluazphY3RpdmVgXToge1xuICAgIC4uLmxpbmtCdXR0b25Db2xvckhvdmVyXG4gIH1cbn07XG5cbmNvbnN0IGlucHV0QmFzZSA9IHtcbiAgdHJhbnNpdGlvbixcbiAgcGFkZGluZzogJzRweCAxMHB4JyxcbiAgaGVpZ2h0OiAnMjhweCcsXG4gIGZvbnRTaXplOiAnMTJweCcsXG4gIG91dGxpbmU6ICdub25lJ1xufTtcblxuY29uc3QgaW5wdXQgPSB7XG4gIG5vcm1hbDoge1xuICAgIC4uLmlucHV0QmFzZSxcbiAgICBiYWNrZ3JvdW5kOiBzZWxlY3RCYWNrZ3JvdW5kLFxuICAgIGJvcmRlcjogcGFuZWxCb3JkZXIsXG4gICAgY29sb3I6IHNlbGVjdENvbG9yXG4gIH0sXG4gIGVycm9yOiB7XG4gICAgYm9yZGVyQ29sb3I6IGVycm9yQ29sb3JcbiAgfSxcbiAgaG92ZXI6IHtcbiAgICBiYWNrZ3JvdW5kOiBzZWxlY3RCYWNrZ3JvdW5kSG92ZXJcbiAgfSxcbiAgZm9jdXM6IHtcbiAgICBjb2xvcjogc2VsZWN0Q29sb3IsXG4gICAgYm94U2hhZG93OiAwXG4gIH0sXG4gIGRpc2FibGVkOiB7XG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgIGJhY2tncm91bmQ6IHNlbGVjdEJhY2tncm91bmRcbiAgfVxufTtcblxuY29uc3QgaW5wdXRMaWdodCA9IHtcbiAgbm9ybWFsOiB7XG4gICAgLi4uaW5wdXRCYXNlLFxuICAgIGJhY2tncm91bmQ6IHNlbGVjdEJhY2tncm91bmRMVCxcbiAgICBib3JkZXI6IHBhbmVsQm9yZGVyTFQsXG4gICAgY29sb3I6IHNlbGVjdENvbG9yTFRcbiAgfSxcbiAgZXJyb3I6IHtcbiAgICBib3JkZXJDb2xvcjogZXJyb3JDb2xvclxuICB9LFxuICBob3Zlcjoge1xuICAgIGJhY2tncm91bmQ6IHNlbGVjdEJhY2tncm91bmRIb3ZlckxULFxuICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gIH0sXG4gIGZvY3VzOiB7XG4gICAgY29sb3I6IHNlbGVjdENvbG9yTFQsXG4gICAgYm94U2hhZG93OiAwXG4gIH0sXG4gIGRpc2FibGVkOiB7XG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgIGJhY2tncm91bmQ6IHNlbGVjdEJhY2tncm91bmRMVFxuICB9XG59O1xuXG5mdW5jdGlvbiBhc3NpZ25JbnB1dFNlbGVjdENvbG9yKGlucHV0Q2xhc3MsIHNlbGVjdENsYXNzLCBjb2xvckNvbmZpZykge1xuICBjb25zdCBbaW5wdXRTdHlsZSwgc2VsZWN0U3R5bGVdID0gW2lucHV0Q2xhc3MsIHNlbGVjdENsYXNzXS5tYXAoY2xhc3NOYW1lID0+ICh7XG4gICAgW2NsYXNzTmFtZV06IGNvbG9yQ29uZmlnLm5vcm1hbCxcbiAgICBbYCR7Y2xhc3NOYW1lfTpob3ZlcmBdOiBjb2xvckNvbmZpZy5ob3ZlcixcbiAgICBbYCR7Y2xhc3NOYW1lfS5lcnJvcmBdOiBjb2xvckNvbmZpZy5lcnJvcixcbiAgICBbYCR7Y2xhc3NOYW1lfS5mb2N1cywgJHtjbGFzc05hbWV9OmZvY3VzYF06IGNvbG9yQ29uZmlnLmZvY3VzLFxuICAgIFtgJHtjbGFzc05hbWV9LmRpc2FibGVkYF06IGNvbG9yQ29uZmlnLmRpc2FibGVkXG4gIH0pKTtcblxuICBpbnB1dFN0eWxlW2Ake2lucHV0Q2xhc3N9LnRleHQtaW5wdXQtLXRleHRhcmVhYF0gPSB7XG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICdhdXRvJyxcbiAgICByZXNpemU6ICdub25lJ1xuICB9O1xuXG4gIHNlbGVjdFN0eWxlW3NlbGVjdENsYXNzXSA9IHtcbiAgICAuLi5zZWxlY3RTdHlsZVtzZWxlY3RDbGFzc10sXG4gICAgcGFkZGluZzogMCxcbiAgICBib3JkZXI6IDBcbiAgfTtcblxuICBzZWxlY3RTdHlsZVtgICR7c2VsZWN0Q2xhc3N9LmRpc2FibGVkYF0gPSB7XG4gICAgb3BhY2l0eTogMC4zLFxuICAgIFsnIHNlbGVjdDpkaXNhYmxlZCddOiB7Li4uY29sb3JDb25maWcuZGlzYWJsZWQsIGJvcmRlcjogMH1cbiAgfTtcblxuICBzZWxlY3RTdHlsZVtgICR7c2VsZWN0Q2xhc3N9IHNlbGVjdGBdID0ge1xuICAgIC4uLmNvbG9yQ29uZmlnLm5vcm1hbFxuICB9O1xuXG4gIHNlbGVjdFN0eWxlW2AgJHtzZWxlY3RDbGFzc306aG92ZXIgc2VsZWN0YF0gPSB7XG4gICAgLi4uY29sb3JDb25maWcuaG92ZXJcbiAgfTtcblxuICBzZWxlY3RTdHlsZVtgICR7c2VsZWN0Q2xhc3N9OmFmdGVyYF0gPSB7XG4gICAgY29udGVudDogYFwiXFxcXGVhNzRcImAsXG4gICAgZm9udEZhbWlseTogJ3ViZXItaWNvbnMnLFxuICAgIHdlYmtpdEZvbnRTbW9vdGhpbmc6ICdhbnRpYWxpYXNlZCcsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgcmlnaHQ6ICcxNXB4JyxcbiAgICB0cmFuc2Zvcm06ICdyb3RhdGUoMTgwZGVnKScsXG4gICAgY29sb3I6IGxhYmVsQ29sb3JcbiAgfTtcblxuICByZXR1cm4gW2lucHV0U3R5bGUsIHNlbGVjdFN0eWxlXTtcbn1cblxuZXhwb3J0IGNvbnN0IFt0ZXh0SW5wdXQsIHNlbGVjdF0gPSBhc3NpZ25JbnB1dFNlbGVjdENvbG9yKCcgLnRleHQtaW5wdXQnLCAnIC5zZWxlY3QnLCBpbnB1dCk7XG5leHBvcnQgY29uc3QgW3RleHRJbnB1dExpZ2h0LCBzZWxlY3RMaWdodF0gPSBhc3NpZ25JbnB1dFNlbGVjdENvbG9yKCcgLnRleHQtaW5wdXQtLWxpZ2h0JywgJyAuc2VsZWN0LS1saWdodCcsIGlucHV0TGlnaHQpO1xuXG4vLyBUT0RPOiB0aGlzIG5lZWRzIHRvIGJlIHJlbW92ZWQgc2luY2Ugd2UgaGF2ZSB0aGUgc3R5bGVkLWNvbXBvbmVudCBlbGVtZW50XG4vLyBkZWZpbmVkIGluIGJhc2UuanMgS2VlcCBpdCBmb3Igbm93IHVudGlsIHJlIHJld29yZCBzaWRlLXBhbmVsLmpzIHVzaW5nIHN0eWVkLWNvbXBvbmVudHNcbmV4cG9ydCBjb25zdCBzY3JvbGxCYXIgPSB7XG4gICc6Oi13ZWJraXQtc2Nyb2xsYmFyJzoge1xuICAgIHdpZHRoOiAnMTRweCdcbiAgfSxcblxuICAnOjotd2Via2l0LXNjcm9sbGJhci10cmFjayc6IHtcbiAgICBiYWNrZ3JvdW5kOiBzaWRlUGFuZWxCZ1xuICB9LFxuXG4gICc6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iJzoge1xuICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgIGJhY2tncm91bmQ6IHBhbmVsQmFja2dyb3VuZCxcbiAgICBib3JkZXI6IGAzcHggc29saWQgJHtzaWRlUGFuZWxCZ31gLFxuXG4gICAgJzp2ZXJ0aWNhbCc6IHtcbiAgICAgIGJhY2tncm91bmQ6IHBhbmVsQmFja2dyb3VuZFxuICAgIH0sXG5cbiAgICAnOnZlcnRpY2FsOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZDogc2VsZWN0QmFja2dyb3VuZEhvdmVyXG4gICAgfVxuICB9XG59O1xuIl19