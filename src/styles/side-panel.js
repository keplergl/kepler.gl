import {DIMENSIONS} from '../constants/default-settings';
import {
  button,
  linkButton,
  secondaryButton,
  textInput,
  textInputLight,
  select,
  selectLight,
  scrollBar
} from './ui';

import {
  activeColor,
  borderRadius,
  boxShadow,
  labelColor,
  labelHoverColor,
  panelActiveBg,
  panelBackground,
  panelBorder,
  selectBackground,
  selectBackgroundHover,
  selectColor,
  sideNavBg,
  sidePanelBg,
  textColor
} from './base';

const tooltipBg = '#F8F8F9';
const tooltipColor = '#333334';

const tooltipClass = ' .__react_component_tooltip';

export const tooltip = {
  [tooltipClass]: {
    background: tooltipBg,
    fontSize: '9.5px',
    color: tooltipColor,
    fontWeight: 500,
    padding: '7px 18px'
  },
  [`${tooltipClass}.place-top`]: {
    ':after': {
      borderTopColor: tooltipBg
    }
  },
  [`${tooltipClass}.place-right`]: {
    marginLeft: '30px',
    ':after': {
      borderRightColor: tooltipBg
    }
  }
};

export const infoHelper = {
  ' .info-helper': {
    display: 'inline-block',
    marginLeft: '10px',

    ' .icon': {
      color: labelColor
    },
    ' .icon:hover': {
      color: activeColor
    },

    ' .info-helper__content': {
      maxWidth: '100px'
    }
  }
};

export const sideNav = {
  ' .side-navi': {
    position: 'absolute',
    height: '100%',
    background: sideNavBg,
    width: `${DIMENSIONS.sideNavW}px`,
    zIndex: 100,

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: '120px',

    [' ul']: {
      margin: 0
    },

    ' .side-navi__item': {
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.5px',
      background: sideNavBg,
      padding: '12px 10px',
      margin: 0,
      borderLeftWidth: '3px',
      borderLeftStyle: 'solid',
      borderLeftColor: sideNavBg,

      [' a']: {
        color: textColor
      }
    },

    ' .side-navi__item:hover': {
      cursor: 'pointer',
      [' a']: {
        color: 'white'
      }
    },

    ' .side-navi__item.active': {
      background: sidePanelBg,
      borderLeftColor: activeColor
    },

    ' .side-navi__item .icon': {
      marginRight: '8px',
      fontSize: '14px'
    }
  },

  ' .side-navi.collapsed': {
    width: `${DIMENSIONS.sideNavC}px`
  }
};

export const inputs = {
  display: 'flex',
  justifyContent: 'space-between',
  ' input': {
    width: '70px'
  }
};

export const slider = {
  ' .slider-input': {
    marginTop: '-12px'
  },

  ' .range-slider': {
    marginTop: '-18px',
    marginBottom: '12px'
  }
};

export const accordion = {
  ' .accordion': {
    border: panelBorder,
    borderBottom: 0,

    ' .accordion__item': {
      borderTop: 0,
      borderLeft: 0,
      borderRight: 0,
      borderBottom: panelBorder,
      color: selectColor,
      fontSize: '12px',
      background: selectBackground,

      ' .icon': {
        top: '12px',
        color: labelColor
      },

      ' .accordion__item__link': {
        padding: '6px 12px 6px 18px',
        color: selectColor,
        borderBottom: '1px solid transparent'
      },

      ' .accordion__item__link:hover': {
        padding: '6px 12px 6px 18px',
        backgroundColor: 'transparent'
      }
    },

    ' .accordion__item.active': {
      backgroundColor: panelBackground,

      ' .accordion__item__link': {
        backgroundColor: 'transparent',
        borderBottom: panelBorder,
        borderLeft: 'solid 2px transparent'
      }
    },

    ' .accordion__item.active:hover': {
      backgroundColor: panelBackground
    },

    ' .accordion__item:hover': {
      background: selectBackgroundHover
    }
  },

  ' .accordion:hover': {
    borderBottom: 0,
    backgroundColor: selectBackgroundHover
  }
};

export const colorPaletteSelector = {
  ' .color-palette-selector': {
    ' .color-palette__config': {
      margin: '4px 12px 4px 24px',
      display: 'flex',
      justifyContent: 'space-between',

      ' .color-palette__config__slider': {
        flexGrow: 2,
        margin: '3px 10px 0 50px',
        display: 'flex',

        ' .color-palette__config__slider__slider': {
          flexGrow: 2
        },

        ' .color-palette__config__slider__number': {
          marginLeft: '16px'
        }
      }
    },

    ' .color-ranges': {
      display: 'flex',
      paddingTop: '5px',
      paddingBottom: '5px',
      marginBottom: '8px',
      borderLeftStyle: 'solid',
      borderLeftWidth: '3px',
      borderLeftColor: 'transparent',

      [':first-child']: {
        marginTop: '10px'
      },

      ' .radio': {
        marginLeft: '12px',
        marginTop: '-2px'
      },

      ['svg']: {
        marginTop: '2px'
      }
    },

    ' .color-ranges.selected': {
      borderLeftColor: activeColor
    },

    [' .select']: {
      background: 'transparent',
      border: 0,

      [' select']: {
        background: 'transparent',
        border: 0,
        paddingRight: '36px'
      },

      ':after': {
        color: labelColor,
        right: '8px'
      }
    },
    [' .select:hover']: {
      ':after': {
        color: 'white'
      }
    }
  }
};

export const sideBar = {
  position: 'absolute',
  float: 'left',
  backgroundColor: sidePanelBg,
  zIndex: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  transition: 'left 250ms, right 250ms',

  ' .side-bar__wrapper': {
    overflowY: 'overlay',
    overflowX: 'visible',
    position: 'relative',
    ...scrollBar
  },

  ' .side-bar__inner': {
    position: 'absolute',
    textAlign: 'left',
    zIndex: 1,
    right: 0
  },

  ' .side-bar__top': {
    display: 'flex',
    padding: `12px 0px 0px ${24 + DIMENSIONS.sideNavC}px`,
    justifyContent: 'space-between',

    ' .button.button-link': {
      paddingRight: '24px'
    }
  },

  ' .side-bar__title': {
    fontSize: '20px',
    lineHeight: '40px',
    textTransform: 'capitalize',
    color: 'white'
  }
};

export const sidePanel = {
  ...textInput,
  ...textInputLight,
  ...select,
  ...selectLight,
  ...infoHelper,
  ...sideNav,
  ...slider,
  ...accordion,
  ...colorPaletteSelector,
  ...button,
  ...linkButton,
  ...secondaryButton,

  zIndex: 99,
  height: '100%',
  display: 'flex',
  position: 'absolute',

  ' .side-panel': {
    background: sidePanelBg,
    padding: `6px 24px 24px ${DIMENSIONS.sideNavC + 24}px`
  },

  ' .layer-panel': {
    color: textColor,
    fontSize: '12px',
    background: panelBackground,
    boxShadow,
    borderRadius,
    marginBottom: '8px',

    ' .layer__drag-handle': {
      marginLeft: '-14px',

      [' path']: {
        fill: selectBackground
      },

      ' :hover': {
        cursor: 'move'
      },

      ' :hover path': {
        fill: labelHoverColor
      }
    },

    ' .layer__title': {
      paddingLeft: '4px',
      [' span']: {
        fontSize: '12px'
      },
      ' .text-input--borderless': {
        height: '26px',
        background: selectBackground,
        border: panelBorder,
        fontSize: '12px',
        paddingLeft: '8px'
      }
    },

    ' .layer-panel__header': {
      borderLeftWidth: '4px',
      borderLeftStyle: 'solid',

      ' .icon': {
        fontSize: '17px',
        color: labelColor
      },

      ' .icon:hover': {
        color: labelHoverColor
      },

      ' .icon_trash:hover': {
        color: '#CA3B27'
      },

      ' .icon.icon_eye': {
        color: activeColor
      }
    },

    ' .layer-panel__header.no-highlight': {
      borderLeftWidth: 0
    },

    ' .panel': {
      background: panelBackground,
      border: panelBorder,
      borderBottom: panelBorder,

      ' .panel__content': {
        padding: '12px'
      }
    },

    ' label:before': {
      background: '#282727',
      border: panelBorder
    },

    ' .radio:before': {
      background: '#282727',
      border: panelBorder
    }
  },

  ' .layer-panel.ui-sortable-dragging': {
    background: selectBackground
  },

  ' .layer-panel:hover': {
    background: panelActiveBg
  },

  ' .layer-panel.active': {
    background: panelActiveBg,
    ' .layer-panel__config': {
      borderTop: panelBorder
    }
  },

  ' .layer-panel.dragging': {
    cursor: 'move'
  },

  ' .layer-panel__header:hover': {
    cursor: 'pointer'
  },

  ' .map-style__panel .layer-panel__header': {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 24px',

    ' .label': {
      marginBottom: 0
    }
  },

  ' .color--block': {
    width: '32px',
    height: '14px',
    position: 'absolute',
    marginTop: '10px',
    marginLeft: '13px',
    zIndex: 99
  }
};

export const mapStyleSelector = {
  padding: '12px 24px',

  ' .layer-group__header': {
    fontSize: '12px',
    color: labelColor
  },

  ' .panel .top__right': {
    textAlign: 'right',
    fontSize: '11px',
    color: labelColor,
    marginBottom: '6px',
    [' a']: {
      color: labelColor
    },
    ' .icon': {
      marginRight: '5px'
    }
  },

  ' .layer-group__select': {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',

    ' .layer-group__name': {
      color: selectColor,
      margin: 0
    },

    ' .layer-group__switch': {
      display: 'flex',
      ' .layer--toggle': {
        paddingTop: '5px'
      }
    }
  },

  ' .map-dropdown-option': {
    display: 'flex',
    justifyContent: 'space-between',
    border: panelBorder,
    background: panelBackground,
    height: '50px',
    marginBottom: '5px',
    opacity: 1,
    padding: '10px',
    position: 'relative',
    transition: 'opacity .05s ease-in, height .25s ease-out',

    ' .map-title-block': {
      display: 'flex'
    },

    ' .map-preview': {
      border: 'thin solid #212122',
      borderRadius: '3px',
      height: '30px',
      width: '40px'
    },

    ' .map-preview-name': {
      color: selectColor,
      fontSize: '10px',
      marginLeft: '10px',
      marginTop: '5px'
    }
  },

  ' .layer--toggle': {
    ' .icon': {
      fontSize: '17px',
      color: labelColor,
      marginLeft: '6px'
    },

    ' .icon:hover': {
      color: '#C6C6C6'
    },

    ' .icon.active': {
      color: activeColor
    },

    ' .icon.disabled': {
      cursor: 'default',
      opacity: 0.2,
      color: labelColor
    }
  },

  ' .map-dropdown-option:hover': {
    cursor: 'pointer',
    color: 'white',
    background: panelActiveBg
  },

  ' .map-dropdown-option.collapsed': {
    height: '0px',
    marginBottom: 0,
    padding: 0,
    opacity: 0
  }
};
