import {
  activeColor,
  activeColorHover,
  borderRadius,
  boxShadow,
  errorColor,
  labelColor,
  panelBackground,
  panelBorder,
  panelBorderLT,
  selectBackground,
  selectBackgroundLT,
  selectBackgroundHover,
  selectBackgroundHoverLT,
  selectColor,
  selectColorLT,
  sidePanelBg,
  textColor,
  transition
} from './base';

const buttonStyle = {
  borderRadius,
  borderStyle: 'solid',
  borderWidth: '2px',
  boxShadow,
  boxSizing: 'border-box',
  cursor: 'pointer',
  display: 'inline-block',
  fontWeight: 400,
  outline: 0,
  textAlign: 'center',
  transition,
  verticalAlign: 'middle'
};

const sizeNormal = {
  fontSize: '13px',
  padding: '7px 14px'
};

const sizeSmall = {
  fontSize: '12px',
  padding: '4px 14px',

  ' .icon': {
    fontSize: '14px',
    marginRight: '3px'
  }
};

const buttonIcon = {
  [' svg']: {
    marginTop: '-3px',
    marginLeft: '-7px',
    marginRight: '3px',
    verticalAlign: 'middle'
  },
  ' .icon': {
    fontSize: '14px',
    marginRight: '3px'
  }
};

const buttonColor = {
  backgroundColor: activeColor,
  borderColor: activeColor,
  color: 'white'
};

const buttonColorHover = {
  backgroundColor: activeColorHover,
  borderColor: activeColorHover
};

const secondaryColor = {
  backgroundColor: 'transparent',
  borderColor: selectBackground,
  color: selectBackground,
  boxShadow: 'none'
};

const secondaryColorHover = {
  backgroundColor: panelBackground,
  borderColor: panelBackground,
  color: textColor
};

const linkButtonColor = {
  color: labelColor,
  backgroundColor: sidePanelBg,
  borderColor: sidePanelBg,
  boxShadow: 'none'
};

const linkButtonColorHover = {
  ...linkButtonColor,
  color: textColor
};

const inactiveButton = {
  opacity: 0.4,
  pointerEvents: 'none'
};

export const button = {
  ' .button': {
    ...buttonStyle,
    ...sizeNormal,
    ...buttonColor,
    ...buttonIcon
  },

  ' .button-small': {
    ...sizeSmall
  },

  ' .button:hover, .button:focus, .button:active': {
    ...buttonColorHover
  },

  ' .button.inactive': {
    ...inactiveButton
  }
};

export const secondaryButton = {
  ' .button-secondary': {
    ...secondaryColor
  },

  ' .button-secondary:hover': {
    ...secondaryColorHover
  }
};

export const linkButton = {
  ' .button.button-link': {
    ...linkButtonColor
  },
  [` .button-link:hover, .button-link:focus, .button-link:active`]: {
    ...linkButtonColorHover
  }
};

const inputBase = {
  transition,
  padding: '4px 10px',
  height: '28px',
  fontSize: '12px',
  outline: 'none'
};

const input = {
  normal: {
    ...inputBase,
    background: selectBackground,
    border: panelBorder,
    color: selectColor
  },
  error: {
    borderColor: errorColor
  },
  hover: {
    background: selectBackgroundHover
  },
  focus: {
    color: selectColor,
    boxShadow: 0
  },
  disabled: {
    pointerEvents: 'none',
    background: selectBackground
  }
};

const inputLight = {
  normal: {
    ...inputBase,
    background: selectBackgroundLT,
    border: panelBorderLT,
    color: selectColorLT
  },
  error: {
    borderColor: errorColor
  },
  hover: {
    background: selectBackgroundHoverLT,
    cursor: 'pointer'
  },
  focus: {
    color: selectColorLT,
    boxShadow: 0
  },
  disabled: {
    pointerEvents: 'none',
    background: selectBackgroundLT
  }
};

function assignInputSelectColor(inputClass, selectClass, colorConfig) {
  const [inputStyle, selectStyle] = [inputClass, selectClass].map(
    className => ({
      [className]: colorConfig.normal,
      [`${className}:hover`]: colorConfig.hover,
      [`${className}.error`]: colorConfig.error,
      [`${className}.focus, ${className}:focus`]: colorConfig.focus,
      [`${className}.disabled`]: colorConfig.disabled
    })
  );

  inputStyle[`${inputClass}.text-input--textarea`] = {
    width: '100%',
    height: 'auto',
    resize: 'none'
  };

  selectStyle[selectClass] = {
    ...selectStyle[selectClass],
    padding: 0,
    border: 0
  };

  selectStyle[` ${selectClass}.disabled`] = {
    opacity: 0.3,
    [' select:disabled']: {...colorConfig.disabled, border: 0}
  };

  selectStyle[` ${selectClass} select`] = {
    ...colorConfig.normal
  };

  selectStyle[` ${selectClass}:hover select`] = {
    ...colorConfig.hover
  };

  selectStyle[` ${selectClass}:after`] = {
    content: `"\\ea74"`,
    fontFamily: 'uber-icons',
    webkitFontSmoothing: 'antialiased',
    position: 'absolute',
    right: '15px',
    transform: 'rotate(180deg)',
    color: labelColor
  };

  return [inputStyle, selectStyle];
}

export const [textInput, select] = assignInputSelectColor(
  ' .text-input',
  ' .select',
  input
);
export const [textInputLight, selectLight] = assignInputSelectColor(
  ' .text-input--light',
  ' .select--light',
  inputLight
);

// TODO: this needs to be removed since we have the styled-component element
// defined in base.js Keep it for now until re reword side-panel.js using styed-components
export const scrollBar = {
  '::-webkit-scrollbar': {
    width: '14px'
  },

  '::-webkit-scrollbar-track': {
    background: sidePanelBg
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    background: panelBackground,
    border: `3px solid ${sidePanelBg}`,

    ':vertical': {
      background: panelBackground
    },

    ':vertical:hover': {
      background: selectBackgroundHover
    }
  }
};
