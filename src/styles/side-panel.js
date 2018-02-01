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
  textColor
} from './base';

export const slider = {
  ' .slider-input': {
    marginTop: '-12px'
  },

  ' .range-slider': {
    marginTop: '-18px',
    marginBottom: '12px'
  }
};

export const sidePanel = {
  ...select,
  ...selectLight,
  // ...infoHelper,
  // ...colorPaletteSelector,
  // ...button,
  // ...linkButton,
  // ...secondaryButton,

  ' .layer-panel': {

    // ' .layer__drag-handle': {
      // marginLeft: '-14px',
      //
      // [' path']: {
      //   fill: selectBackground
      // },

    //   ' :hover': {
    //     cursor: 'move'
    //   },
    //
    //   ' :hover path': {
    //     fill: labelHoverColor
    //   }
    // },

    // ' .layer__title': {
    //   paddingLeft: '4px',
    //   [' span']: {
    //     fontSize: '12px'
    //   },
    //   ' .text-input--borderless': {
    //     height: '26px',
    //     background: selectBackground,
    //     border: panelBorder,
    //     fontSize: '12px',
    //     paddingLeft: '8px'
    //   }
    // },

    //' .layer-panel__header': {
      //
      // ' .icon': {
      //   fontSize: '17px',
      //   color: labelColor
      // },
      //
      // ' .icon:hover': {
      //   color: labelHoverColor
      // },
      //
      // ' .icon_trash:hover': {
      //   color: '#CA3B27'
      // },
      //
      // ' .icon.icon_eye': {
      //   color: activeColor
      // }
    //},
    //
    // ' .layer-panel__header.no-highlight': {
    //   borderLeftWidth: 0
    // },

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
  }
};

export const mapStyleSelector = {
  ' .layer-group__header': {
    fontSize: '12px',
    color: labelColor
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

    // ' .map-title-block': {
    //   display: 'flex'
    // },
    //
    // ' .map-preview': {
    //   border: 'thin solid #212122',
    //   borderRadius: '3px',
    //   height: '30px',
    //   width: '40px'
    // },
    //
    // ' .map-preview-name': {
    //   color: selectColor,
    //   fontSize: '10px',
    //   marginLeft: '10px',
    //   marginTop: '5px'
    // }
  },

  // ' .layer--toggle': {
  //   ' .icon': {
  //     fontSize: '17px',
  //     color: labelColor,
  //     marginLeft: '6px'
  //   },
  //
  //   ' .icon:hover': {
  //     color: '#C6C6C6'
  //   },
  //
  //   ' .icon.active': {
  //     color: activeColor
  //   },
  //
  //   ' .icon.disabled': {
  //     cursor: 'default',
  //     opacity: 0.2,
  //     color: labelColor
  //   }
  // },

  // ' .map-dropdown-option:hover': {
  //   cursor: 'pointer',
  //   color: 'white',
  //   background: panelActiveBg
  // },

  // ' .map-dropdown-option.collapsed': {
  //   height: '0px',
  //   marginBottom: 0,
  //   padding: 0,
  //   opacity: 0
  // }
};
