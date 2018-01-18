'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapStyleSelector = exports.sidePanel = exports.sideBar = exports.colorPaletteSelector = exports.accordion = exports.slider = exports.inputs = exports.sideNav = exports.infoHelper = exports.tooltip = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _tooltip, _sideNavi__item, _sideNavi__itemHo, _sideNavi, _colorRanges, _select, _colorPaletteSele, _layer__dragHandle, _layer__title, _panelTop__right;

var _defaultSettings = require('../constants/default-settings');

var _ui = require('./ui');

var _base = require('./base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tooltipBg = '#F8F8F9';
var tooltipColor = '#333334';

var tooltipClass = ' .__react_component_tooltip';

var tooltip = exports.tooltip = (_tooltip = {}, _tooltip[tooltipClass] = {
  background: tooltipBg,
  fontSize: '9.5px',
  color: tooltipColor,
  fontWeight: 500,
  padding: '7px 18px'
}, _tooltip[tooltipClass + '.place-top'] = {
  ':after': {
    borderTopColor: tooltipBg
  }
}, _tooltip[tooltipClass + '.place-right'] = {
  marginLeft: '30px',
  ':after': {
    borderRightColor: tooltipBg
  }
}, _tooltip);

var infoHelper = exports.infoHelper = {
  ' .info-helper': {
    display: 'inline-block',
    marginLeft: '10px',

    ' .icon': {
      color: _base.labelColor
    },
    ' .icon:hover': {
      color: _base.activeColor
    },

    ' .info-helper__content': {
      maxWidth: '100px'
    }
  }
};

var sideNav = exports.sideNav = {
  ' .side-navi': (_sideNavi = {
    position: 'absolute',
    height: '100%',
    background: _base.sideNavBg,
    width: _defaultSettings.DIMENSIONS.sideNavW + 'px',
    zIndex: 100,

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: '120px'

  }, _sideNavi[' ul'] = {
    margin: 0
  }, _sideNavi[' .side-navi__item'] = (_sideNavi__item = {
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.5px',
    background: _base.sideNavBg,
    padding: '12px 10px',
    margin: 0,
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: _base.sideNavBg

  }, _sideNavi__item[' a'] = {
    color: _base.textColor
  }, _sideNavi__item), _sideNavi[' .side-navi__item:hover'] = (_sideNavi__itemHo = {
    cursor: 'pointer'
  }, _sideNavi__itemHo[' a'] = {
    color: 'white'
  }, _sideNavi__itemHo), _sideNavi[' .side-navi__item.active'] = {
    background: _base.sidePanelBg,
    borderLeftColor: _base.activeColor
  }, _sideNavi[' .side-navi__item .icon'] = {
    marginRight: '8px',
    fontSize: '14px'
  }, _sideNavi),

  ' .side-navi.collapsed': {
    width: _defaultSettings.DIMENSIONS.sideNavC + 'px'
  }
};

var inputs = exports.inputs = {
  display: 'flex',
  justifyContent: 'space-between',
  ' input': {
    width: '70px'
  }
};

var slider = exports.slider = {
  ' .slider-input': {
    marginTop: '-12px'
  },

  ' .range-slider': {
    marginTop: '-18px',
    marginBottom: '12px'
  }
};

var accordion = exports.accordion = {
  ' .accordion': {

    border: _base.panelBorder,
    borderBottom: 0,

    ' .accordion__item': {
      borderTop: 0,
      borderLeft: 0,
      borderRight: 0,
      borderBottom: _base.panelBorder,
      color: _base.selectColor,
      fontSize: '12px',
      background: _base.selectBackground,

      ' .icon': {
        top: '12px',
        color: _base.labelColor
      },

      ' .accordion__item__link': {
        padding: '6px 12px 6px 18px',
        color: _base.selectColor,
        borderBottom: '1px solid transparent'
      },

      ' .accordion__item__link:hover': {
        padding: '6px 12px 6px 18px',
        backgroundColor: 'transparent'
      }
    },

    ' .accordion__item.active': {
      backgroundColor: _base.panelBackground,

      ' .accordion__item__link': {
        backgroundColor: 'transparent',
        borderBottom: _base.panelBorder,
        borderLeft: 'solid 2px transparent'
      }
    },

    ' .accordion__item.active:hover': {
      backgroundColor: _base.panelBackground
    },

    ' .accordion__item:hover': {
      background: _base.selectBackgroundHover
    }
  },

  ' .accordion:hover': {
    borderBottom: 0,
    backgroundColor: _base.selectBackgroundHover
  }
};

var colorPaletteSelector = exports.colorPaletteSelector = {
  ' .color-palette-selector': (_colorPaletteSele = {
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

    ' .color-ranges': (_colorRanges = {
      display: 'flex',
      paddingTop: '5px',
      paddingBottom: '5px',
      marginBottom: '8px',
      borderLeftStyle: 'solid',
      borderLeftWidth: '3px',
      borderLeftColor: 'transparent'

    }, _colorRanges[':first-child'] = {
      marginTop: '10px'
    }, _colorRanges[' .radio'] = {
      marginLeft: '12px',
      marginTop: '-2px'
    }, _colorRanges['svg'] = {
      marginTop: '2px'
    }, _colorRanges),

    ' .color-ranges.selected': {
      borderLeftColor: _base.activeColor
    }

  }, _colorPaletteSele[' .select'] = (_select = {
    background: 'transparent',
    border: 0

  }, _select[' select'] = {
    background: 'transparent',
    border: 0,
    paddingRight: '36px'
  }, _select[':after'] = {
    color: _base.labelColor,
    right: '8px'
  }, _select), _colorPaletteSele[' .select:hover'] = {
    ':after': {
      color: 'white'
    }
  }, _colorPaletteSele)
};

var sideBar = exports.sideBar = {
  position: 'absolute',
  float: 'left',
  backgroundColor: _base.sidePanelBg,
  zIndex: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  transition: 'left 250ms, right 250ms',

  ' .side-bar__wrapper': (0, _extends3.default)({
    overflowY: 'overlay',
    overflowX: 'visible',
    position: 'relative'
  }, _ui.scrollBar),

  ' .side-bar__inner': {
    position: 'absolute',
    textAlign: 'left',
    zIndex: 1,
    right: 0
  },

  ' .side-bar__top': {
    display: 'flex',
    padding: '12px 0px 0px ' + (24 + _defaultSettings.DIMENSIONS.sideNavC) + 'px',
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

var sidePanel = exports.sidePanel = (0, _extends3.default)({}, _ui.textInput, _ui.textInputLight, _ui.select, _ui.selectLight, infoHelper, sideNav, slider, accordion, colorPaletteSelector, _ui.button, _ui.linkButton, _ui.secondaryButton, {

  zIndex: 99,
  height: '100%',
  display: 'flex',
  position: 'absolute',

  ' .side-panel': {
    background: _base.sidePanelBg,
    padding: '6px 24px 24px ' + (_defaultSettings.DIMENSIONS.sideNavC + 24) + 'px'
  },

  ' .layer-panel': {
    color: _base.textColor,
    fontSize: '12px',
    background: _base.panelBackground,
    boxShadow: _base.boxShadow,
    borderRadius: _base.borderRadius,
    marginBottom: '8px',

    ' .layer__drag-handle': (_layer__dragHandle = {
      marginLeft: '-14px'

    }, _layer__dragHandle[' path'] = {
      fill: _base.selectBackground
    }, _layer__dragHandle[' :hover'] = {
      cursor: 'move'
    }, _layer__dragHandle[' :hover path'] = {
      fill: _base.labelHoverColor
    }, _layer__dragHandle),

    ' .layer__title': (_layer__title = {
      paddingLeft: '4px'
    }, _layer__title[' span'] = {
      fontSize: '12px'
    }, _layer__title[' .text-input--borderless'] = {
      height: '26px',
      background: _base.selectBackground,
      border: _base.panelBorder,
      fontSize: '12px',
      paddingLeft: '8px'
    }, _layer__title),

    ' .layer-panel__header': {
      borderLeftWidth: '4px',
      borderLeftStyle: 'solid',

      ' .icon': {
        fontSize: '17px',
        color: _base.labelColor
      },

      ' .icon:hover': {
        color: _base.labelHoverColor
      },

      ' .icon_trash:hover': {
        color: '#CA3B27'
      },

      ' .icon.icon_eye': {
        color: _base.activeColor
      }
    },

    ' .layer-panel__header.no-highlight': {
      borderLeftWidth: 0
    },

    ' .panel': {
      background: _base.panelBackground,
      border: _base.panelBorder,
      borderBottom: _base.panelBorder,

      ' .panel__content': {
        padding: '12px'
      }
    },

    ' label:before': {
      background: '#282727',
      border: _base.panelBorder
    },

    ' .radio:before': {
      background: '#282727',
      border: _base.panelBorder
    }
  },

  ' .layer-panel.ui-sortable-dragging': {
    background: _base.selectBackground
  },

  ' .layer-panel:hover': {
    background: _base.panelActiveBg
  },

  ' .layer-panel.active': {
    background: _base.panelActiveBg,
    ' .layer-panel__config': {
      borderTop: _base.panelBorder
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
});

var mapStyleSelector = exports.mapStyleSelector = {
  padding: '12px 24px',

  ' .layer-group__header': {
    fontSize: '12px',
    color: _base.labelColor
  },

  ' .panel .top__right': (_panelTop__right = {
    textAlign: 'right',
    fontSize: '11px',
    color: _base.labelColor,
    marginBottom: '6px'
  }, _panelTop__right[' a'] = {
    color: _base.labelColor
  }, _panelTop__right[' .icon'] = {
    marginRight: '5px'
  }, _panelTop__right),

  ' .layer-group__select': {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',

    ' .layer-group__name': {
      color: _base.selectColor,
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
    border: _base.panelBorder,
    background: _base.panelBackground,
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
      color: _base.selectColor,
      fontSize: '10px',
      marginLeft: '10px',
      marginTop: '5px'
    }
  },

  ' .layer--toggle': {
    ' .icon': {
      fontSize: '17px',
      color: _base.labelColor,
      marginLeft: '6px'
    },

    ' .icon:hover': {
      color: '#C6C6C6'
    },

    ' .icon.active': {
      color: _base.activeColor
    },

    ' .icon.disabled': {
      cursor: 'default',
      opacity: 0.2,
      color: _base.labelColor
    }
  },

  ' .map-dropdown-option:hover': {
    cursor: 'pointer',
    color: 'white',
    background: _base.panelActiveBg
  },

  ' .map-dropdown-option.collapsed': {
    height: '0px',
    marginBottom: 0,
    padding: 0,
    opacity: 0
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHlsZXMvc2lkZS1wYW5lbC5qcyJdLCJuYW1lcyI6WyJ0b29sdGlwQmciLCJ0b29sdGlwQ29sb3IiLCJ0b29sdGlwQ2xhc3MiLCJ0b29sdGlwIiwiYmFja2dyb3VuZCIsImZvbnRTaXplIiwiY29sb3IiLCJmb250V2VpZ2h0IiwicGFkZGluZyIsImJvcmRlclRvcENvbG9yIiwibWFyZ2luTGVmdCIsImJvcmRlclJpZ2h0Q29sb3IiLCJpbmZvSGVscGVyIiwiZGlzcGxheSIsIm1heFdpZHRoIiwic2lkZU5hdiIsInBvc2l0aW9uIiwiaGVpZ2h0Iiwid2lkdGgiLCJzaWRlTmF2VyIsInpJbmRleCIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsInBhZGRpbmdCb3R0b20iLCJtYXJnaW4iLCJsZXR0ZXJTcGFjaW5nIiwiYm9yZGVyTGVmdFdpZHRoIiwiYm9yZGVyTGVmdFN0eWxlIiwiYm9yZGVyTGVmdENvbG9yIiwiY3Vyc29yIiwibWFyZ2luUmlnaHQiLCJzaWRlTmF2QyIsImlucHV0cyIsInNsaWRlciIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImFjY29yZGlvbiIsImJvcmRlciIsImJvcmRlckJvdHRvbSIsImJvcmRlclRvcCIsImJvcmRlckxlZnQiLCJib3JkZXJSaWdodCIsInRvcCIsImJhY2tncm91bmRDb2xvciIsImNvbG9yUGFsZXR0ZVNlbGVjdG9yIiwiZmxleEdyb3ciLCJwYWRkaW5nVG9wIiwicGFkZGluZ1JpZ2h0IiwicmlnaHQiLCJzaWRlQmFyIiwiZmxvYXQiLCJib3hTaGFkb3ciLCJ0cmFuc2l0aW9uIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwidGV4dEFsaWduIiwibGluZUhlaWdodCIsInRleHRUcmFuc2Zvcm0iLCJzaWRlUGFuZWwiLCJib3JkZXJSYWRpdXMiLCJmaWxsIiwicGFkZGluZ0xlZnQiLCJtYXBTdHlsZVNlbGVjdG9yIiwib3BhY2l0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7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QixlQUZPO0FBR3ZCZSw2QkFIdUI7QUFJdkJqQyxxQ0FKdUI7QUFLdkJhLFlBQVEsTUFMZTtBQU12QmtCLGtCQUFjLEtBTlM7QUFPdkI0QixhQUFTLENBUGM7QUFRdkJ2RCxhQUFTLE1BUmM7QUFTdkJRLGNBQVUsVUFUYTtBQVV2Qm9DLGdCQUFZLDRDQVZXOztBQVl2Qix5QkFBcUI7QUFDbkJ2QyxlQUFTO0FBRFUsS0FaRTs7QUFnQnZCLHFCQUFpQjtBQUNmd0IsY0FBUSxvQkFETztBQUVmc0Isb0JBQWMsS0FGQztBQUdmMUMsY0FBUSxNQUhPO0FBSWZDLGFBQU87QUFKUSxLQWhCTTs7QUF1QnZCLDBCQUFzQjtBQUNwQlosOEJBRG9CO0FBRXBCRCxnQkFBVSxNQUZVO0FBR3BCSyxrQkFBWSxNQUhRO0FBSXBCd0IsaUJBQVc7QUFKUztBQXZCQyxHQXZDSzs7QUFzRTlCLHFCQUFtQjtBQUNqQixjQUFVO0FBQ1I3QixnQkFBVSxNQURGO0FBRVJDLDZCQUZRO0FBR1JJLGtCQUFZO0FBSEosS0FETzs7QUFPakIsb0JBQWdCO0FBQ2RKLGFBQU87QUFETyxLQVBDOztBQVdqQixxQkFBaUI7QUFDZkE7QUFEZSxLQVhBOztBQWVqQix1QkFBbUI7QUFDakJ1QixjQUFRLFNBRFM7QUFFakJrQyxlQUFTLEdBRlE7QUFHakJ6RDtBQUhpQjtBQWZGLEdBdEVXOztBQTRGOUIsaUNBQStCO0FBQzdCdUIsWUFBUSxTQURxQjtBQUU3QnZCLFdBQU8sT0FGc0I7QUFHN0JGO0FBSDZCLEdBNUZEOztBQWtHOUIscUNBQW1DO0FBQ2pDYSxZQUFRLEtBRHlCO0FBRWpDa0Isa0JBQWMsQ0FGbUI7QUFHakMzQixhQUFTLENBSHdCO0FBSWpDdUQsYUFBUztBQUp3QjtBQWxHTCxDQUF6QiIsImZpbGUiOiJzaWRlLXBhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtESU1FTlNJT05TfSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge1xuICBidXR0b24sXG4gIGxpbmtCdXR0b24sXG4gIHNlY29uZGFyeUJ1dHRvbixcbiAgdGV4dElucHV0LFxuICB0ZXh0SW5wdXRMaWdodCxcbiAgc2VsZWN0LFxuICBzZWxlY3RMaWdodCxcbiAgc2Nyb2xsQmFyXG59IGZyb20gJy4vdWknO1xuXG5pbXBvcnQge1xuICBhY3RpdmVDb2xvcixcbiAgYm9yZGVyUmFkaXVzLFxuICBib3hTaGFkb3csXG4gIGxhYmVsQ29sb3IsXG4gIGxhYmVsSG92ZXJDb2xvcixcbiAgcGFuZWxBY3RpdmVCZyxcbiAgcGFuZWxCYWNrZ3JvdW5kLFxuICBwYW5lbEJvcmRlcixcbiAgc2VsZWN0QmFja2dyb3VuZCxcbiAgc2VsZWN0QmFja2dyb3VuZEhvdmVyLFxuICBzZWxlY3RDb2xvcixcbiAgc2lkZU5hdkJnLFxuICBzaWRlUGFuZWxCZyxcbiAgdGV4dENvbG9yXG59IGZyb20gJy4vYmFzZSc7XG5cbmNvbnN0IHRvb2x0aXBCZyA9ICcjRjhGOEY5JztcbmNvbnN0IHRvb2x0aXBDb2xvciA9ICcjMzMzMzM0JztcblxuY29uc3QgdG9vbHRpcENsYXNzID0gJyAuX19yZWFjdF9jb21wb25lbnRfdG9vbHRpcCc7XG5cbmV4cG9ydCBjb25zdCB0b29sdGlwID0ge1xuICBbdG9vbHRpcENsYXNzXToge1xuICAgIGJhY2tncm91bmQ6IHRvb2x0aXBCZyxcbiAgICBmb250U2l6ZTogJzkuNXB4JyxcbiAgICBjb2xvcjogdG9vbHRpcENvbG9yLFxuICAgIGZvbnRXZWlnaHQ6IDUwMCxcbiAgICBwYWRkaW5nOiAnN3B4IDE4cHgnXG4gIH0sXG4gIFtgJHt0b29sdGlwQ2xhc3N9LnBsYWNlLXRvcGBdOiB7XG4gICAgJzphZnRlcic6IHtcbiAgICAgIGJvcmRlclRvcENvbG9yOiB0b29sdGlwQmdcbiAgICB9XG4gIH0sXG4gIFtgJHt0b29sdGlwQ2xhc3N9LnBsYWNlLXJpZ2h0YF06IHtcbiAgICBtYXJnaW5MZWZ0OiAnMzBweCcsXG4gICAgJzphZnRlcic6IHtcbiAgICAgIGJvcmRlclJpZ2h0Q29sb3I6IHRvb2x0aXBCZ1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGluZm9IZWxwZXIgPSB7XG4gICcgLmluZm8taGVscGVyJzoge1xuICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgIG1hcmdpbkxlZnQ6ICcxMHB4JyxcblxuICAgICcgLmljb24nOiB7XG4gICAgICBjb2xvcjogbGFiZWxDb2xvclxuICAgIH0sXG4gICAgJyAuaWNvbjpob3Zlcic6IHtcbiAgICAgIGNvbG9yOiBhY3RpdmVDb2xvclxuICAgIH0sXG5cbiAgICAnIC5pbmZvLWhlbHBlcl9fY29udGVudCc6IHtcbiAgICAgIG1heFdpZHRoOiAnMTAwcHgnXG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3Qgc2lkZU5hdiA9IHtcbiAgJyAuc2lkZS1uYXZpJzoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIGJhY2tncm91bmQ6IHNpZGVOYXZCZyxcbiAgICB3aWR0aDogYCR7RElNRU5TSU9OUy5zaWRlTmF2V31weGAsXG4gICAgekluZGV4OiAxMDAsXG5cbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBwYWRkaW5nQm90dG9tOiAnMTIwcHgnLFxuXG4gICAgWycgdWwnXToge1xuICAgICAgbWFyZ2luOiAwXG4gICAgfSxcblxuICAgICcgLnNpZGUtbmF2aV9faXRlbSc6IHtcbiAgICAgIGZvbnRTaXplOiAnMTFweCcsXG4gICAgICBmb250V2VpZ2h0OiA1MDAsXG4gICAgICBsZXR0ZXJTcGFjaW5nOiAnMC41cHgnLFxuICAgICAgYmFja2dyb3VuZDogc2lkZU5hdkJnLFxuICAgICAgcGFkZGluZzogJzEycHggMTBweCcsXG4gICAgICBtYXJnaW46IDAsXG4gICAgICBib3JkZXJMZWZ0V2lkdGg6ICczcHgnLFxuICAgICAgYm9yZGVyTGVmdFN0eWxlOiAnc29saWQnLFxuICAgICAgYm9yZGVyTGVmdENvbG9yOiBzaWRlTmF2QmcsXG5cbiAgICAgIFsnIGEnXToge1xuICAgICAgICBjb2xvcjogdGV4dENvbG9yXG4gICAgICB9XG4gICAgfSxcblxuICAgICcgLnNpZGUtbmF2aV9faXRlbTpob3Zlcic6IHtcbiAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgWycgYSddOiB7XG4gICAgICAgIGNvbG9yOiAnd2hpdGUnXG4gICAgICB9XG4gICAgfSxcblxuICAgICcgLnNpZGUtbmF2aV9faXRlbS5hY3RpdmUnOiB7XG4gICAgICBiYWNrZ3JvdW5kOiBzaWRlUGFuZWxCZyxcbiAgICAgIGJvcmRlckxlZnRDb2xvcjogYWN0aXZlQ29sb3JcbiAgICB9LFxuXG4gICAgJyAuc2lkZS1uYXZpX19pdGVtIC5pY29uJzoge1xuICAgICAgbWFyZ2luUmlnaHQ6ICc4cHgnLFxuICAgICAgZm9udFNpemU6ICcxNHB4J1xuICAgIH1cbiAgfSxcblxuICAnIC5zaWRlLW5hdmkuY29sbGFwc2VkJzoge1xuICAgIHdpZHRoOiBgJHtESU1FTlNJT05TLnNpZGVOYXZDfXB4YFxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgaW5wdXRzID0ge1xuICBkaXNwbGF5OiAnZmxleCcsXG4gIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICcgaW5wdXQnOiB7XG4gICAgd2lkdGg6ICc3MHB4J1xuICB9XG59O1xuXG5leHBvcnQgY29uc3Qgc2xpZGVyID0ge1xuICAnIC5zbGlkZXItaW5wdXQnOiB7XG4gICAgbWFyZ2luVG9wOiAnLTEycHgnXG4gIH0sXG5cbiAgJyAucmFuZ2Utc2xpZGVyJzoge1xuICAgIG1hcmdpblRvcDogJy0xOHB4JyxcbiAgICBtYXJnaW5Cb3R0b206ICcxMnB4J1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgYWNjb3JkaW9uID0ge1xuICAnIC5hY2NvcmRpb24nOiB7XG5cbiAgICBib3JkZXI6IHBhbmVsQm9yZGVyLFxuICAgIGJvcmRlckJvdHRvbTogMCxcblxuICAgICcgLmFjY29yZGlvbl9faXRlbSc6IHtcbiAgICAgIGJvcmRlclRvcDogMCxcbiAgICAgIGJvcmRlckxlZnQ6IDAsXG4gICAgICBib3JkZXJSaWdodDogMCxcbiAgICAgIGJvcmRlckJvdHRvbTogcGFuZWxCb3JkZXIsXG4gICAgICBjb2xvcjogc2VsZWN0Q29sb3IsXG4gICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgYmFja2dyb3VuZDogc2VsZWN0QmFja2dyb3VuZCxcblxuICAgICAgJyAuaWNvbic6IHtcbiAgICAgICAgdG9wOiAnMTJweCcsXG4gICAgICAgIGNvbG9yOiBsYWJlbENvbG9yXG4gICAgICB9LFxuXG4gICAgICAnIC5hY2NvcmRpb25fX2l0ZW1fX2xpbmsnOiB7XG4gICAgICAgIHBhZGRpbmc6ICc2cHggMTJweCA2cHggMThweCcsXG4gICAgICAgIGNvbG9yOiBzZWxlY3RDb2xvcixcbiAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkIHRyYW5zcGFyZW50J1xuICAgICAgfSxcblxuICAgICAgJyAuYWNjb3JkaW9uX19pdGVtX19saW5rOmhvdmVyJzoge1xuICAgICAgICBwYWRkaW5nOiAnNnB4IDEycHggNnB4IDE4cHgnLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJyAuYWNjb3JkaW9uX19pdGVtLmFjdGl2ZSc6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogcGFuZWxCYWNrZ3JvdW5kLFxuXG4gICAgICAnIC5hY2NvcmRpb25fX2l0ZW1fX2xpbmsnOiB7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgYm9yZGVyQm90dG9tOiBwYW5lbEJvcmRlcixcbiAgICAgICAgYm9yZGVyTGVmdDogJ3NvbGlkIDJweCB0cmFuc3BhcmVudCdcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJyAuYWNjb3JkaW9uX19pdGVtLmFjdGl2ZTpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogcGFuZWxCYWNrZ3JvdW5kXG4gICAgfSxcblxuICAgICcgLmFjY29yZGlvbl9faXRlbTpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmQ6IHNlbGVjdEJhY2tncm91bmRIb3ZlclxuICAgIH1cbiAgfSxcblxuICAnIC5hY2NvcmRpb246aG92ZXInOiB7XG4gICAgYm9yZGVyQm90dG9tOiAwLFxuICAgIGJhY2tncm91bmRDb2xvcjogc2VsZWN0QmFja2dyb3VuZEhvdmVyXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBjb2xvclBhbGV0dGVTZWxlY3RvciA9IHtcbiAgJyAuY29sb3ItcGFsZXR0ZS1zZWxlY3Rvcic6IHtcbiAgICAnIC5jb2xvci1wYWxldHRlX19jb25maWcnOiB7XG4gICAgICBtYXJnaW46ICc0cHggMTJweCA0cHggMjRweCcsXG4gICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuXG4gICAgICAnIC5jb2xvci1wYWxldHRlX19jb25maWdfX3NsaWRlcic6IHtcbiAgICAgICAgZmxleEdyb3c6IDIsXG4gICAgICAgIG1hcmdpbjogJzNweCAxMHB4IDAgNTBweCcsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcblxuICAgICAgICAnIC5jb2xvci1wYWxldHRlX19jb25maWdfX3NsaWRlcl9fc2xpZGVyJzoge1xuICAgICAgICAgIGZsZXhHcm93OiAyXG4gICAgICAgIH0sXG5cbiAgICAgICAgJyAuY29sb3ItcGFsZXR0ZV9fY29uZmlnX19zbGlkZXJfX251bWJlcic6IHtcbiAgICAgICAgICBtYXJnaW5MZWZ0OiAnMTZweCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAnIC5jb2xvci1yYW5nZXMnOiB7XG4gICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICBwYWRkaW5nVG9wOiAnNXB4JyxcbiAgICAgIHBhZGRpbmdCb3R0b206ICc1cHgnLFxuICAgICAgbWFyZ2luQm90dG9tOiAnOHB4JyxcbiAgICAgIGJvcmRlckxlZnRTdHlsZTogJ3NvbGlkJyxcbiAgICAgIGJvcmRlckxlZnRXaWR0aDogJzNweCcsXG4gICAgICBib3JkZXJMZWZ0Q29sb3I6ICd0cmFuc3BhcmVudCcsXG5cbiAgICAgIFsnOmZpcnN0LWNoaWxkJ106IHtcbiAgICAgICAgbWFyZ2luVG9wOiAnMTBweCdcbiAgICAgIH0sXG5cbiAgICAgICcgLnJhZGlvJzoge1xuICAgICAgICBtYXJnaW5MZWZ0OiAnMTJweCcsXG4gICAgICAgIG1hcmdpblRvcDogJy0ycHgnXG4gICAgICB9LFxuXG4gICAgICBbJ3N2ZyddOiB7XG4gICAgICAgIG1hcmdpblRvcDogJzJweCdcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJyAuY29sb3ItcmFuZ2VzLnNlbGVjdGVkJzoge1xuICAgICAgYm9yZGVyTGVmdENvbG9yOiBhY3RpdmVDb2xvclxuICAgIH0sXG5cbiAgICBbJyAuc2VsZWN0J106IHtcbiAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICBib3JkZXI6IDAsXG5cbiAgICAgIFsnIHNlbGVjdCddOiB7XG4gICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgcGFkZGluZ1JpZ2h0OiAnMzZweCdcbiAgICAgIH0sXG5cbiAgICAgICc6YWZ0ZXInOiB7XG4gICAgICAgIGNvbG9yOiBsYWJlbENvbG9yLFxuICAgICAgICByaWdodDogJzhweCdcbiAgICAgIH1cbiAgICB9LFxuICAgIFsnIC5zZWxlY3Q6aG92ZXInXToge1xuICAgICAgJzphZnRlcic6IHtcbiAgICAgICAgY29sb3I6ICd3aGl0ZSdcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzaWRlQmFyID0ge1xuICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgZmxvYXQ6ICdsZWZ0JyxcbiAgYmFja2dyb3VuZENvbG9yOiBzaWRlUGFuZWxCZyxcbiAgekluZGV4OiAxMCxcbiAgYm94U2hhZG93OiAnMCAxcHggM3B4IHJnYmEoMCwwLDAsMC4yKScsXG4gIHRyYW5zaXRpb246ICdsZWZ0IDI1MG1zLCByaWdodCAyNTBtcycsXG5cbiAgJyAuc2lkZS1iYXJfX3dyYXBwZXInOiB7XG4gICAgb3ZlcmZsb3dZOiAnb3ZlcmxheScsXG4gICAgb3ZlcmZsb3dYOiAndmlzaWJsZScsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgLi4uc2Nyb2xsQmFyXG4gIH0sXG5cbiAgJyAuc2lkZS1iYXJfX2lubmVyJzoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRleHRBbGlnbjogJ2xlZnQnLFxuICAgIHpJbmRleDogMSxcbiAgICByaWdodDogMFxuICB9LFxuXG4gICcgLnNpZGUtYmFyX190b3AnOiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIHBhZGRpbmc6IGAxMnB4IDBweCAwcHggJHsyNCArIERJTUVOU0lPTlMuc2lkZU5hdkN9cHhgLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG5cbiAgICAnIC5idXR0b24uYnV0dG9uLWxpbmsnOiB7XG4gICAgICBwYWRkaW5nUmlnaHQ6ICcyNHB4J1xuICAgIH1cbiAgfSxcblxuICAnIC5zaWRlLWJhcl9fdGl0bGUnOiB7XG4gICAgZm9udFNpemU6ICcyMHB4JyxcbiAgICBsaW5lSGVpZ2h0OiAnNDBweCcsXG4gICAgdGV4dFRyYW5zZm9ybTogJ2NhcGl0YWxpemUnLFxuICAgIGNvbG9yOiAnd2hpdGUnXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzaWRlUGFuZWwgPSB7XG4gIC4uLnRleHRJbnB1dCxcbiAgLi4udGV4dElucHV0TGlnaHQsXG4gIC4uLnNlbGVjdCxcbiAgLi4uc2VsZWN0TGlnaHQsXG4gIC4uLmluZm9IZWxwZXIsXG4gIC4uLnNpZGVOYXYsXG4gIC4uLnNsaWRlcixcbiAgLi4uYWNjb3JkaW9uLFxuICAuLi5jb2xvclBhbGV0dGVTZWxlY3RvcixcbiAgLi4uYnV0dG9uLFxuICAuLi5saW5rQnV0dG9uLFxuICAuLi5zZWNvbmRhcnlCdXR0b24sXG5cbiAgekluZGV4OiA5OSxcbiAgaGVpZ2h0OiAnMTAwJScsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG5cbiAgJyAuc2lkZS1wYW5lbCc6IHtcbiAgICBiYWNrZ3JvdW5kOiBzaWRlUGFuZWxCZyxcbiAgICBwYWRkaW5nOiBgNnB4IDI0cHggMjRweCAke0RJTUVOU0lPTlMuc2lkZU5hdkMgKyAyNH1weGBcbiAgfSxcblxuICAnIC5sYXllci1wYW5lbCc6IHtcbiAgICBjb2xvcjogdGV4dENvbG9yLFxuICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgYmFja2dyb3VuZDogcGFuZWxCYWNrZ3JvdW5kLFxuICAgIGJveFNoYWRvdyxcbiAgICBib3JkZXJSYWRpdXMsXG4gICAgbWFyZ2luQm90dG9tOiAnOHB4JyxcblxuICAgICcgLmxheWVyX19kcmFnLWhhbmRsZSc6IHtcbiAgICAgIG1hcmdpbkxlZnQ6ICctMTRweCcsXG5cbiAgICAgIFsnIHBhdGgnXToge1xuICAgICAgICBmaWxsOiBzZWxlY3RCYWNrZ3JvdW5kXG4gICAgICB9LFxuXG4gICAgICAnIDpob3Zlcic6IHtcbiAgICAgICAgY3Vyc29yOiAnbW92ZSdcbiAgICAgIH0sXG5cbiAgICAgICcgOmhvdmVyIHBhdGgnOiB7XG4gICAgICAgIGZpbGw6IGxhYmVsSG92ZXJDb2xvclxuICAgICAgfVxuICAgIH0sXG5cbiAgICAnIC5sYXllcl9fdGl0bGUnOiB7XG4gICAgICBwYWRkaW5nTGVmdDogJzRweCcsXG4gICAgICBbJyBzcGFuJ106IHtcbiAgICAgICAgZm9udFNpemU6ICcxMnB4J1xuICAgICAgfSxcbiAgICAgICcgLnRleHQtaW5wdXQtLWJvcmRlcmxlc3MnOiB7XG4gICAgICAgIGhlaWdodDogJzI2cHgnLFxuICAgICAgICBiYWNrZ3JvdW5kOiBzZWxlY3RCYWNrZ3JvdW5kLFxuICAgICAgICBib3JkZXI6IHBhbmVsQm9yZGVyLFxuICAgICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgICBwYWRkaW5nTGVmdDogJzhweCdcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJyAubGF5ZXItcGFuZWxfX2hlYWRlcic6IHtcbiAgICAgIGJvcmRlckxlZnRXaWR0aDogJzRweCcsXG4gICAgICBib3JkZXJMZWZ0U3R5bGU6ICdzb2xpZCcsXG5cbiAgICAgICcgLmljb24nOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMTdweCcsXG4gICAgICAgIGNvbG9yOiBsYWJlbENvbG9yXG4gICAgICB9LFxuXG4gICAgICAnIC5pY29uOmhvdmVyJzoge1xuICAgICAgICBjb2xvcjogbGFiZWxIb3ZlckNvbG9yXG4gICAgICB9LFxuXG4gICAgICAnIC5pY29uX3RyYXNoOmhvdmVyJzoge1xuICAgICAgICBjb2xvcjogJyNDQTNCMjcnXG4gICAgICB9LFxuXG4gICAgICAnIC5pY29uLmljb25fZXllJzoge1xuICAgICAgICBjb2xvcjogYWN0aXZlQ29sb3JcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJyAubGF5ZXItcGFuZWxfX2hlYWRlci5uby1oaWdobGlnaHQnOiB7XG4gICAgICBib3JkZXJMZWZ0V2lkdGg6IDBcbiAgICB9LFxuXG4gICAgJyAucGFuZWwnOiB7XG4gICAgICBiYWNrZ3JvdW5kOiBwYW5lbEJhY2tncm91bmQsXG4gICAgICBib3JkZXI6IHBhbmVsQm9yZGVyLFxuICAgICAgYm9yZGVyQm90dG9tOiBwYW5lbEJvcmRlcixcblxuICAgICAgJyAucGFuZWxfX2NvbnRlbnQnOiB7XG4gICAgICAgIHBhZGRpbmc6ICcxMnB4J1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAnIGxhYmVsOmJlZm9yZSc6IHtcbiAgICAgIGJhY2tncm91bmQ6ICcjMjgyNzI3JyxcbiAgICAgIGJvcmRlcjogcGFuZWxCb3JkZXJcbiAgICB9LFxuXG4gICAgJyAucmFkaW86YmVmb3JlJzoge1xuICAgICAgYmFja2dyb3VuZDogJyMyODI3MjcnLFxuICAgICAgYm9yZGVyOiBwYW5lbEJvcmRlclxuICAgIH1cbiAgfSxcblxuICAnIC5sYXllci1wYW5lbC51aS1zb3J0YWJsZS1kcmFnZ2luZyc6IHtcbiAgICBiYWNrZ3JvdW5kOiBzZWxlY3RCYWNrZ3JvdW5kXG4gIH0sXG5cbiAgJyAubGF5ZXItcGFuZWw6aG92ZXInOiB7XG4gICAgYmFja2dyb3VuZDogcGFuZWxBY3RpdmVCZ1xuICB9LFxuXG4gICcgLmxheWVyLXBhbmVsLmFjdGl2ZSc6IHtcbiAgICBiYWNrZ3JvdW5kOiBwYW5lbEFjdGl2ZUJnLFxuICAgICcgLmxheWVyLXBhbmVsX19jb25maWcnOiB7XG4gICAgICBib3JkZXJUb3A6IHBhbmVsQm9yZGVyXG4gICAgfVxuICB9LFxuXG4gICcgLmxheWVyLXBhbmVsLmRyYWdnaW5nJzoge1xuICAgIGN1cnNvcjogJ21vdmUnXG4gIH0sXG5cbiAgJyAubGF5ZXItcGFuZWxfX2hlYWRlcjpob3Zlcic6IHtcbiAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICB9LFxuXG4gICcgLm1hcC1zdHlsZV9fcGFuZWwgLmxheWVyLXBhbmVsX19oZWFkZXInOiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgcGFkZGluZzogJzEycHggMjRweCcsXG5cbiAgICAnIC5sYWJlbCc6IHtcbiAgICAgIG1hcmdpbkJvdHRvbTogMFxuICAgIH1cbiAgfSxcblxuICAnIC5jb2xvci0tYmxvY2snOiB7XG4gICAgd2lkdGg6ICczMnB4JyxcbiAgICBoZWlnaHQ6ICcxNHB4JyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBtYXJnaW5Ub3A6ICcxMHB4JyxcbiAgICBtYXJnaW5MZWZ0OiAnMTNweCcsXG4gICAgekluZGV4OiA5OVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgbWFwU3R5bGVTZWxlY3RvciA9IHtcbiAgcGFkZGluZzogJzEycHggMjRweCcsXG5cbiAgJyAubGF5ZXItZ3JvdXBfX2hlYWRlcic6IHtcbiAgICBmb250U2l6ZTogJzEycHgnLFxuICAgIGNvbG9yOiBsYWJlbENvbG9yXG4gIH0sXG5cbiAgJyAucGFuZWwgLnRvcF9fcmlnaHQnOiB7XG4gICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgIGZvbnRTaXplOiAnMTFweCcsXG4gICAgY29sb3I6IGxhYmVsQ29sb3IsXG4gICAgbWFyZ2luQm90dG9tOiAnNnB4JyxcbiAgICBbJyBhJ106IHtcbiAgICAgIGNvbG9yOiBsYWJlbENvbG9yXG4gICAgfSxcbiAgICAnIC5pY29uJzoge1xuICAgICAgbWFyZ2luUmlnaHQ6ICc1cHgnXG4gICAgfVxuICB9LFxuXG4gICcgLmxheWVyLWdyb3VwX19zZWxlY3QnOiB7XG4gICAgbWFyZ2luQm90dG9tOiAnMTBweCcsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG5cbiAgICAnIC5sYXllci1ncm91cF9fbmFtZSc6IHtcbiAgICAgIGNvbG9yOiBzZWxlY3RDb2xvcixcbiAgICAgIG1hcmdpbjogMFxuICAgIH0sXG5cbiAgICAnIC5sYXllci1ncm91cF9fc3dpdGNoJzoge1xuICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgJyAubGF5ZXItLXRvZ2dsZSc6IHtcbiAgICAgICAgcGFkZGluZ1RvcDogJzVweCdcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgJyAubWFwLWRyb3Bkb3duLW9wdGlvbic6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBib3JkZXI6IHBhbmVsQm9yZGVyLFxuICAgIGJhY2tncm91bmQ6IHBhbmVsQmFja2dyb3VuZCxcbiAgICBoZWlnaHQ6ICc1MHB4JyxcbiAgICBtYXJnaW5Cb3R0b206ICc1cHgnLFxuICAgIG9wYWNpdHk6IDEsXG4gICAgcGFkZGluZzogJzEwcHgnLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IC4wNXMgZWFzZS1pbiwgaGVpZ2h0IC4yNXMgZWFzZS1vdXQnLFxuXG4gICAgJyAubWFwLXRpdGxlLWJsb2NrJzoge1xuICAgICAgZGlzcGxheTogJ2ZsZXgnXG4gICAgfSxcblxuICAgICcgLm1hcC1wcmV2aWV3Jzoge1xuICAgICAgYm9yZGVyOiAndGhpbiBzb2xpZCAjMjEyMTIyJyxcbiAgICAgIGJvcmRlclJhZGl1czogJzNweCcsXG4gICAgICBoZWlnaHQ6ICczMHB4JyxcbiAgICAgIHdpZHRoOiAnNDBweCdcbiAgICB9LFxuXG4gICAgJyAubWFwLXByZXZpZXctbmFtZSc6IHtcbiAgICAgIGNvbG9yOiBzZWxlY3RDb2xvcixcbiAgICAgIGZvbnRTaXplOiAnMTBweCcsXG4gICAgICBtYXJnaW5MZWZ0OiAnMTBweCcsXG4gICAgICBtYXJnaW5Ub3A6ICc1cHgnXG4gICAgfVxuICB9LFxuXG4gICcgLmxheWVyLS10b2dnbGUnOiB7XG4gICAgJyAuaWNvbic6IHtcbiAgICAgIGZvbnRTaXplOiAnMTdweCcsXG4gICAgICBjb2xvcjogbGFiZWxDb2xvcixcbiAgICAgIG1hcmdpbkxlZnQ6ICc2cHgnXG4gICAgfSxcblxuICAgICcgLmljb246aG92ZXInOiB7XG4gICAgICBjb2xvcjogJyNDNkM2QzYnXG4gICAgfSxcblxuICAgICcgLmljb24uYWN0aXZlJzoge1xuICAgICAgY29sb3I6IGFjdGl2ZUNvbG9yXG4gICAgfSxcblxuICAgICcgLmljb24uZGlzYWJsZWQnOiB7XG4gICAgICBjdXJzb3I6ICdkZWZhdWx0JyxcbiAgICAgIG9wYWNpdHk6IDAuMixcbiAgICAgIGNvbG9yOiBsYWJlbENvbG9yXG4gICAgfVxuICB9LFxuXG4gICcgLm1hcC1kcm9wZG93bi1vcHRpb246aG92ZXInOiB7XG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgY29sb3I6ICd3aGl0ZScsXG4gICAgYmFja2dyb3VuZDogcGFuZWxBY3RpdmVCZ1xuICB9LFxuXG4gICcgLm1hcC1kcm9wZG93bi1vcHRpb24uY29sbGFwc2VkJzoge1xuICAgIGhlaWdodDogJzBweCcsXG4gICAgbWFyZ2luQm90dG9tOiAwLFxuICAgIHBhZGRpbmc6IDAsXG4gICAgb3BhY2l0eTogMFxuICB9XG59O1xuIl19