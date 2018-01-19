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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHlsZXMvc2lkZS1wYW5lbC5qcyJdLCJuYW1lcyI6WyJ0b29sdGlwQmciLCJ0b29sdGlwQ29sb3IiLCJ0b29sdGlwQ2xhc3MiLCJ0b29sdGlwIiwiYmFja2dyb3VuZCIsImZvbnRTaXplIiwiY29sb3IiLCJmb250V2VpZ2h0IiwicGFkZGluZyIsImJvcmRlclRvcENvbG9yIiwibWFyZ2luTGVmdCIsImJvcmRlclJpZ2h0Q29sb3IiLCJpbmZvSGVscGVyIiwiZGlzcGxheSIsIm1heFdpZHRoIiwic2lkZU5hdiIsInBvc2l0aW9uIiwiaGVpZ2h0Iiwid2lkdGgiLCJzaWRlTmF2VyIsInpJbmRleCIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsInBhZGRpbmdCb3R0b20iLCJtYXJnaW4iLCJsZXR0ZXJTcGFjaW5nIiwiYm9yZGVyTGVmdFdpZHRoIiwiYm9yZGVyTGVmdFN0eWxlIiwiYm9yZGVyTGVmdENvbG9yIiwiY3Vyc29yIiwibWFyZ2luUmlnaHQiLCJzaWRlTmF2QyIsImlucHV0cyIsInNsaWRlciIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImFjY29yZGlvbiIsImJvcmRlciIsImJvcmRlckJvdHRvbSIsImJvcmRlclRvcCIsImJvcmRlckxlZnQiLCJib3JkZXJSaWdodCIsInRvcCIsImJhY2tncm91bmRDb2xvciIsImNvbG9yUGFsZXR0ZVNlbGVjdG9yIiwiZmxleEdyb3ciLCJwYWRkaW5nVG9wIiwicGFkZGluZ1JpZ2h0IiwicmlnaHQiLCJzaWRlQmFyIiwiZmxvYXQiLCJib3hTaGFkb3ciLCJ0cmFuc2l0aW9uIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwidGV4dEFsaWduIiwibGluZUhlaWdodCIsInRleHRUcmFuc2Zvcm0iLCJzaWRlUGFuZWwiLCJib3JkZXJSYWRpdXMiLCJmaWxsIiwicGFkZGluZ0xlZnQiLCJtYXBTdHlsZVNlbGVjdG9yIiwib3BhY2l0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7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LGVBRk87QUFHdkJlLDZCQUh1QjtBQUl2QmpDLHFDQUp1QjtBQUt2QmEsWUFBUSxNQUxlO0FBTXZCa0Isa0JBQWMsS0FOUztBQU92QjRCLGFBQVMsQ0FQYztBQVF2QnZELGFBQVMsTUFSYztBQVN2QlEsY0FBVSxVQVRhO0FBVXZCb0MsZ0JBQVksNENBVlc7O0FBWXZCLHlCQUFxQjtBQUNuQnZDLGVBQVM7QUFEVSxLQVpFOztBQWdCdkIscUJBQWlCO0FBQ2Z3QixjQUFRLG9CQURPO0FBRWZzQixvQkFBYyxLQUZDO0FBR2YxQyxjQUFRLE1BSE87QUFJZkMsYUFBTztBQUpRLEtBaEJNOztBQXVCdkIsMEJBQXNCO0FBQ3BCWiw4QkFEb0I7QUFFcEJELGdCQUFVLE1BRlU7QUFHcEJLLGtCQUFZLE1BSFE7QUFJcEJ3QixpQkFBVztBQUpTO0FBdkJDLEdBdkNLOztBQXNFOUIscUJBQW1CO0FBQ2pCLGNBQVU7QUFDUjdCLGdCQUFVLE1BREY7QUFFUkMsNkJBRlE7QUFHUkksa0JBQVk7QUFISixLQURPOztBQU9qQixvQkFBZ0I7QUFDZEosYUFBTztBQURPLEtBUEM7O0FBV2pCLHFCQUFpQjtBQUNmQTtBQURlLEtBWEE7O0FBZWpCLHVCQUFtQjtBQUNqQnVCLGNBQVEsU0FEUztBQUVqQmtDLGVBQVMsR0FGUTtBQUdqQnpEO0FBSGlCO0FBZkYsR0F0RVc7O0FBNEY5QixpQ0FBK0I7QUFDN0J1QixZQUFRLFNBRHFCO0FBRTdCdkIsV0FBTyxPQUZzQjtBQUc3QkY7QUFINkIsR0E1RkQ7O0FBa0c5QixxQ0FBbUM7QUFDakNhLFlBQVEsS0FEeUI7QUFFakNrQixrQkFBYyxDQUZtQjtBQUdqQzNCLGFBQVMsQ0FId0I7QUFJakN1RCxhQUFTO0FBSndCO0FBbEdMLENBQXpCIiwiZmlsZSI6InNpZGUtcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RJTUVOU0lPTlN9IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7XG4gIGJ1dHRvbixcbiAgbGlua0J1dHRvbixcbiAgc2Vjb25kYXJ5QnV0dG9uLFxuICB0ZXh0SW5wdXQsXG4gIHRleHRJbnB1dExpZ2h0LFxuICBzZWxlY3QsXG4gIHNlbGVjdExpZ2h0LFxuICBzY3JvbGxCYXJcbn0gZnJvbSAnLi91aSc7XG5cbmltcG9ydCB7XG4gIGFjdGl2ZUNvbG9yLFxuICBib3JkZXJSYWRpdXMsXG4gIGJveFNoYWRvdyxcbiAgbGFiZWxDb2xvcixcbiAgbGFiZWxIb3ZlckNvbG9yLFxuICBwYW5lbEFjdGl2ZUJnLFxuICBwYW5lbEJhY2tncm91bmQsXG4gIHBhbmVsQm9yZGVyLFxuICBzZWxlY3RCYWNrZ3JvdW5kLFxuICBzZWxlY3RCYWNrZ3JvdW5kSG92ZXIsXG4gIHNlbGVjdENvbG9yLFxuICBzaWRlTmF2QmcsXG4gIHNpZGVQYW5lbEJnLFxuICB0ZXh0Q29sb3Jcbn0gZnJvbSAnLi9iYXNlJztcblxuY29uc3QgdG9vbHRpcEJnID0gJyNGOEY4RjknO1xuY29uc3QgdG9vbHRpcENvbG9yID0gJyMzMzMzMzQnO1xuXG5jb25zdCB0b29sdGlwQ2xhc3MgPSAnIC5fX3JlYWN0X2NvbXBvbmVudF90b29sdGlwJztcblxuZXhwb3J0IGNvbnN0IHRvb2x0aXAgPSB7XG4gIFt0b29sdGlwQ2xhc3NdOiB7XG4gICAgYmFja2dyb3VuZDogdG9vbHRpcEJnLFxuICAgIGZvbnRTaXplOiAnOS41cHgnLFxuICAgIGNvbG9yOiB0b29sdGlwQ29sb3IsXG4gICAgZm9udFdlaWdodDogNTAwLFxuICAgIHBhZGRpbmc6ICc3cHggMThweCdcbiAgfSxcbiAgW2Ake3Rvb2x0aXBDbGFzc30ucGxhY2UtdG9wYF06IHtcbiAgICAnOmFmdGVyJzoge1xuICAgICAgYm9yZGVyVG9wQ29sb3I6IHRvb2x0aXBCZ1xuICAgIH1cbiAgfSxcbiAgW2Ake3Rvb2x0aXBDbGFzc30ucGxhY2UtcmlnaHRgXToge1xuICAgIG1hcmdpbkxlZnQ6ICczMHB4JyxcbiAgICAnOmFmdGVyJzoge1xuICAgICAgYm9yZGVyUmlnaHRDb2xvcjogdG9vbHRpcEJnXG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgaW5mb0hlbHBlciA9IHtcbiAgJyAuaW5mby1oZWxwZXInOiB7XG4gICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgbWFyZ2luTGVmdDogJzEwcHgnLFxuXG4gICAgJyAuaWNvbic6IHtcbiAgICAgIGNvbG9yOiBsYWJlbENvbG9yXG4gICAgfSxcbiAgICAnIC5pY29uOmhvdmVyJzoge1xuICAgICAgY29sb3I6IGFjdGl2ZUNvbG9yXG4gICAgfSxcblxuICAgICcgLmluZm8taGVscGVyX19jb250ZW50Jzoge1xuICAgICAgbWF4V2lkdGg6ICcxMDBweCdcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzaWRlTmF2ID0ge1xuICAnIC5zaWRlLW5hdmknOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgYmFja2dyb3VuZDogc2lkZU5hdkJnLFxuICAgIHdpZHRoOiBgJHtESU1FTlNJT05TLnNpZGVOYXZXfXB4YCxcbiAgICB6SW5kZXg6IDEwMCxcblxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuICAgIHBhZGRpbmdCb3R0b206ICcxMjBweCcsXG5cbiAgICBbJyB1bCddOiB7XG4gICAgICBtYXJnaW46IDBcbiAgICB9LFxuXG4gICAgJyAuc2lkZS1uYXZpX19pdGVtJzoge1xuICAgICAgZm9udFNpemU6ICcxMXB4JyxcbiAgICAgIGZvbnRXZWlnaHQ6IDUwMCxcbiAgICAgIGxldHRlclNwYWNpbmc6ICcwLjVweCcsXG4gICAgICBiYWNrZ3JvdW5kOiBzaWRlTmF2QmcsXG4gICAgICBwYWRkaW5nOiAnMTJweCAxMHB4JyxcbiAgICAgIG1hcmdpbjogMCxcbiAgICAgIGJvcmRlckxlZnRXaWR0aDogJzNweCcsXG4gICAgICBib3JkZXJMZWZ0U3R5bGU6ICdzb2xpZCcsXG4gICAgICBib3JkZXJMZWZ0Q29sb3I6IHNpZGVOYXZCZyxcblxuICAgICAgWycgYSddOiB7XG4gICAgICAgIGNvbG9yOiB0ZXh0Q29sb3JcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJyAuc2lkZS1uYXZpX19pdGVtOmhvdmVyJzoge1xuICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICBbJyBhJ106IHtcbiAgICAgICAgY29sb3I6ICd3aGl0ZSdcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJyAuc2lkZS1uYXZpX19pdGVtLmFjdGl2ZSc6IHtcbiAgICAgIGJhY2tncm91bmQ6IHNpZGVQYW5lbEJnLFxuICAgICAgYm9yZGVyTGVmdENvbG9yOiBhY3RpdmVDb2xvclxuICAgIH0sXG5cbiAgICAnIC5zaWRlLW5hdmlfX2l0ZW0gLmljb24nOiB7XG4gICAgICBtYXJnaW5SaWdodDogJzhweCcsXG4gICAgICBmb250U2l6ZTogJzE0cHgnXG4gICAgfVxuICB9LFxuXG4gICcgLnNpZGUtbmF2aS5jb2xsYXBzZWQnOiB7XG4gICAgd2lkdGg6IGAke0RJTUVOU0lPTlMuc2lkZU5hdkN9cHhgXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpbnB1dHMgPSB7XG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgJyBpbnB1dCc6IHtcbiAgICB3aWR0aDogJzcwcHgnXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzbGlkZXIgPSB7XG4gICcgLnNsaWRlci1pbnB1dCc6IHtcbiAgICBtYXJnaW5Ub3A6ICctMTJweCdcbiAgfSxcblxuICAnIC5yYW5nZS1zbGlkZXInOiB7XG4gICAgbWFyZ2luVG9wOiAnLTE4cHgnLFxuICAgIG1hcmdpbkJvdHRvbTogJzEycHgnXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBhY2NvcmRpb24gPSB7XG4gICcgLmFjY29yZGlvbic6IHtcbiAgICBib3JkZXI6IHBhbmVsQm9yZGVyLFxuICAgIGJvcmRlckJvdHRvbTogMCxcblxuICAgICcgLmFjY29yZGlvbl9faXRlbSc6IHtcbiAgICAgIGJvcmRlclRvcDogMCxcbiAgICAgIGJvcmRlckxlZnQ6IDAsXG4gICAgICBib3JkZXJSaWdodDogMCxcbiAgICAgIGJvcmRlckJvdHRvbTogcGFuZWxCb3JkZXIsXG4gICAgICBjb2xvcjogc2VsZWN0Q29sb3IsXG4gICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgYmFja2dyb3VuZDogc2VsZWN0QmFja2dyb3VuZCxcblxuICAgICAgJyAuaWNvbic6IHtcbiAgICAgICAgdG9wOiAnMTJweCcsXG4gICAgICAgIGNvbG9yOiBsYWJlbENvbG9yXG4gICAgICB9LFxuXG4gICAgICAnIC5hY2NvcmRpb25fX2l0ZW1fX2xpbmsnOiB7XG4gICAgICAgIHBhZGRpbmc6ICc2cHggMTJweCA2cHggMThweCcsXG4gICAgICAgIGNvbG9yOiBzZWxlY3RDb2xvcixcbiAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkIHRyYW5zcGFyZW50J1xuICAgICAgfSxcblxuICAgICAgJyAuYWNjb3JkaW9uX19pdGVtX19saW5rOmhvdmVyJzoge1xuICAgICAgICBwYWRkaW5nOiAnNnB4IDEycHggNnB4IDE4cHgnLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJyAuYWNjb3JkaW9uX19pdGVtLmFjdGl2ZSc6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogcGFuZWxCYWNrZ3JvdW5kLFxuXG4gICAgICAnIC5hY2NvcmRpb25fX2l0ZW1fX2xpbmsnOiB7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgYm9yZGVyQm90dG9tOiBwYW5lbEJvcmRlcixcbiAgICAgICAgYm9yZGVyTGVmdDogJ3NvbGlkIDJweCB0cmFuc3BhcmVudCdcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJyAuYWNjb3JkaW9uX19pdGVtLmFjdGl2ZTpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogcGFuZWxCYWNrZ3JvdW5kXG4gICAgfSxcblxuICAgICcgLmFjY29yZGlvbl9faXRlbTpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmQ6IHNlbGVjdEJhY2tncm91bmRIb3ZlclxuICAgIH1cbiAgfSxcblxuICAnIC5hY2NvcmRpb246aG92ZXInOiB7XG4gICAgYm9yZGVyQm90dG9tOiAwLFxuICAgIGJhY2tncm91bmRDb2xvcjogc2VsZWN0QmFja2dyb3VuZEhvdmVyXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBjb2xvclBhbGV0dGVTZWxlY3RvciA9IHtcbiAgJyAuY29sb3ItcGFsZXR0ZS1zZWxlY3Rvcic6IHtcbiAgICAnIC5jb2xvci1wYWxldHRlX19jb25maWcnOiB7XG4gICAgICBtYXJnaW46ICc0cHggMTJweCA0cHggMjRweCcsXG4gICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuXG4gICAgICAnIC5jb2xvci1wYWxldHRlX19jb25maWdfX3NsaWRlcic6IHtcbiAgICAgICAgZmxleEdyb3c6IDIsXG4gICAgICAgIG1hcmdpbjogJzNweCAxMHB4IDAgNTBweCcsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcblxuICAgICAgICAnIC5jb2xvci1wYWxldHRlX19jb25maWdfX3NsaWRlcl9fc2xpZGVyJzoge1xuICAgICAgICAgIGZsZXhHcm93OiAyXG4gICAgICAgIH0sXG5cbiAgICAgICAgJyAuY29sb3ItcGFsZXR0ZV9fY29uZmlnX19zbGlkZXJfX251bWJlcic6IHtcbiAgICAgICAgICBtYXJnaW5MZWZ0OiAnMTZweCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAnIC5jb2xvci1yYW5nZXMnOiB7XG4gICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICBwYWRkaW5nVG9wOiAnNXB4JyxcbiAgICAgIHBhZGRpbmdCb3R0b206ICc1cHgnLFxuICAgICAgbWFyZ2luQm90dG9tOiAnOHB4JyxcbiAgICAgIGJvcmRlckxlZnRTdHlsZTogJ3NvbGlkJyxcbiAgICAgIGJvcmRlckxlZnRXaWR0aDogJzNweCcsXG4gICAgICBib3JkZXJMZWZ0Q29sb3I6ICd0cmFuc3BhcmVudCcsXG5cbiAgICAgIFsnOmZpcnN0LWNoaWxkJ106IHtcbiAgICAgICAgbWFyZ2luVG9wOiAnMTBweCdcbiAgICAgIH0sXG5cbiAgICAgICcgLnJhZGlvJzoge1xuICAgICAgICBtYXJnaW5MZWZ0OiAnMTJweCcsXG4gICAgICAgIG1hcmdpblRvcDogJy0ycHgnXG4gICAgICB9LFxuXG4gICAgICBbJ3N2ZyddOiB7XG4gICAgICAgIG1hcmdpblRvcDogJzJweCdcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJyAuY29sb3ItcmFuZ2VzLnNlbGVjdGVkJzoge1xuICAgICAgYm9yZGVyTGVmdENvbG9yOiBhY3RpdmVDb2xvclxuICAgIH0sXG5cbiAgICBbJyAuc2VsZWN0J106IHtcbiAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICBib3JkZXI6IDAsXG5cbiAgICAgIFsnIHNlbGVjdCddOiB7XG4gICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIGJvcmRlcjogMCxcbiAgICAgICAgcGFkZGluZ1JpZ2h0OiAnMzZweCdcbiAgICAgIH0sXG5cbiAgICAgICc6YWZ0ZXInOiB7XG4gICAgICAgIGNvbG9yOiBsYWJlbENvbG9yLFxuICAgICAgICByaWdodDogJzhweCdcbiAgICAgIH1cbiAgICB9LFxuICAgIFsnIC5zZWxlY3Q6aG92ZXInXToge1xuICAgICAgJzphZnRlcic6IHtcbiAgICAgICAgY29sb3I6ICd3aGl0ZSdcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzaWRlQmFyID0ge1xuICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgZmxvYXQ6ICdsZWZ0JyxcbiAgYmFja2dyb3VuZENvbG9yOiBzaWRlUGFuZWxCZyxcbiAgekluZGV4OiAxMCxcbiAgYm94U2hhZG93OiAnMCAxcHggM3B4IHJnYmEoMCwwLDAsMC4yKScsXG4gIHRyYW5zaXRpb246ICdsZWZ0IDI1MG1zLCByaWdodCAyNTBtcycsXG5cbiAgJyAuc2lkZS1iYXJfX3dyYXBwZXInOiB7XG4gICAgb3ZlcmZsb3dZOiAnb3ZlcmxheScsXG4gICAgb3ZlcmZsb3dYOiAndmlzaWJsZScsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgLi4uc2Nyb2xsQmFyXG4gIH0sXG5cbiAgJyAuc2lkZS1iYXJfX2lubmVyJzoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRleHRBbGlnbjogJ2xlZnQnLFxuICAgIHpJbmRleDogMSxcbiAgICByaWdodDogMFxuICB9LFxuXG4gICcgLnNpZGUtYmFyX190b3AnOiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIHBhZGRpbmc6IGAxMnB4IDBweCAwcHggJHsyNCArIERJTUVOU0lPTlMuc2lkZU5hdkN9cHhgLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG5cbiAgICAnIC5idXR0b24uYnV0dG9uLWxpbmsnOiB7XG4gICAgICBwYWRkaW5nUmlnaHQ6ICcyNHB4J1xuICAgIH1cbiAgfSxcblxuICAnIC5zaWRlLWJhcl9fdGl0bGUnOiB7XG4gICAgZm9udFNpemU6ICcyMHB4JyxcbiAgICBsaW5lSGVpZ2h0OiAnNDBweCcsXG4gICAgdGV4dFRyYW5zZm9ybTogJ2NhcGl0YWxpemUnLFxuICAgIGNvbG9yOiAnd2hpdGUnXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzaWRlUGFuZWwgPSB7XG4gIC4uLnRleHRJbnB1dCxcbiAgLi4udGV4dElucHV0TGlnaHQsXG4gIC4uLnNlbGVjdCxcbiAgLi4uc2VsZWN0TGlnaHQsXG4gIC4uLmluZm9IZWxwZXIsXG4gIC4uLnNpZGVOYXYsXG4gIC4uLnNsaWRlcixcbiAgLi4uYWNjb3JkaW9uLFxuICAuLi5jb2xvclBhbGV0dGVTZWxlY3RvcixcbiAgLi4uYnV0dG9uLFxuICAuLi5saW5rQnV0dG9uLFxuICAuLi5zZWNvbmRhcnlCdXR0b24sXG5cbiAgekluZGV4OiA5OSxcbiAgaGVpZ2h0OiAnMTAwJScsXG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG5cbiAgJyAuc2lkZS1wYW5lbCc6IHtcbiAgICBiYWNrZ3JvdW5kOiBzaWRlUGFuZWxCZyxcbiAgICBwYWRkaW5nOiBgNnB4IDI0cHggMjRweCAke0RJTUVOU0lPTlMuc2lkZU5hdkMgKyAyNH1weGBcbiAgfSxcblxuICAnIC5sYXllci1wYW5lbCc6IHtcbiAgICBjb2xvcjogdGV4dENvbG9yLFxuICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgYmFja2dyb3VuZDogcGFuZWxCYWNrZ3JvdW5kLFxuICAgIGJveFNoYWRvdyxcbiAgICBib3JkZXJSYWRpdXMsXG4gICAgbWFyZ2luQm90dG9tOiAnOHB4JyxcblxuICAgICcgLmxheWVyX19kcmFnLWhhbmRsZSc6IHtcbiAgICAgIG1hcmdpbkxlZnQ6ICctMTRweCcsXG5cbiAgICAgIFsnIHBhdGgnXToge1xuICAgICAgICBmaWxsOiBzZWxlY3RCYWNrZ3JvdW5kXG4gICAgICB9LFxuXG4gICAgICAnIDpob3Zlcic6IHtcbiAgICAgICAgY3Vyc29yOiAnbW92ZSdcbiAgICAgIH0sXG5cbiAgICAgICcgOmhvdmVyIHBhdGgnOiB7XG4gICAgICAgIGZpbGw6IGxhYmVsSG92ZXJDb2xvclxuICAgICAgfVxuICAgIH0sXG5cbiAgICAnIC5sYXllcl9fdGl0bGUnOiB7XG4gICAgICBwYWRkaW5nTGVmdDogJzRweCcsXG4gICAgICBbJyBzcGFuJ106IHtcbiAgICAgICAgZm9udFNpemU6ICcxMnB4J1xuICAgICAgfSxcbiAgICAgICcgLnRleHQtaW5wdXQtLWJvcmRlcmxlc3MnOiB7XG4gICAgICAgIGhlaWdodDogJzI2cHgnLFxuICAgICAgICBiYWNrZ3JvdW5kOiBzZWxlY3RCYWNrZ3JvdW5kLFxuICAgICAgICBib3JkZXI6IHBhbmVsQm9yZGVyLFxuICAgICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgICBwYWRkaW5nTGVmdDogJzhweCdcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJyAubGF5ZXItcGFuZWxfX2hlYWRlcic6IHtcbiAgICAgIGJvcmRlckxlZnRXaWR0aDogJzRweCcsXG4gICAgICBib3JkZXJMZWZ0U3R5bGU6ICdzb2xpZCcsXG5cbiAgICAgICcgLmljb24nOiB7XG4gICAgICAgIGZvbnRTaXplOiAnMTdweCcsXG4gICAgICAgIGNvbG9yOiBsYWJlbENvbG9yXG4gICAgICB9LFxuXG4gICAgICAnIC5pY29uOmhvdmVyJzoge1xuICAgICAgICBjb2xvcjogbGFiZWxIb3ZlckNvbG9yXG4gICAgICB9LFxuXG4gICAgICAnIC5pY29uX3RyYXNoOmhvdmVyJzoge1xuICAgICAgICBjb2xvcjogJyNDQTNCMjcnXG4gICAgICB9LFxuXG4gICAgICAnIC5pY29uLmljb25fZXllJzoge1xuICAgICAgICBjb2xvcjogYWN0aXZlQ29sb3JcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJyAubGF5ZXItcGFuZWxfX2hlYWRlci5uby1oaWdobGlnaHQnOiB7XG4gICAgICBib3JkZXJMZWZ0V2lkdGg6IDBcbiAgICB9LFxuXG4gICAgJyAucGFuZWwnOiB7XG4gICAgICBiYWNrZ3JvdW5kOiBwYW5lbEJhY2tncm91bmQsXG4gICAgICBib3JkZXI6IHBhbmVsQm9yZGVyLFxuICAgICAgYm9yZGVyQm90dG9tOiBwYW5lbEJvcmRlcixcblxuICAgICAgJyAucGFuZWxfX2NvbnRlbnQnOiB7XG4gICAgICAgIHBhZGRpbmc6ICcxMnB4J1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAnIGxhYmVsOmJlZm9yZSc6IHtcbiAgICAgIGJhY2tncm91bmQ6ICcjMjgyNzI3JyxcbiAgICAgIGJvcmRlcjogcGFuZWxCb3JkZXJcbiAgICB9LFxuXG4gICAgJyAucmFkaW86YmVmb3JlJzoge1xuICAgICAgYmFja2dyb3VuZDogJyMyODI3MjcnLFxuICAgICAgYm9yZGVyOiBwYW5lbEJvcmRlclxuICAgIH1cbiAgfSxcblxuICAnIC5sYXllci1wYW5lbC51aS1zb3J0YWJsZS1kcmFnZ2luZyc6IHtcbiAgICBiYWNrZ3JvdW5kOiBzZWxlY3RCYWNrZ3JvdW5kXG4gIH0sXG5cbiAgJyAubGF5ZXItcGFuZWw6aG92ZXInOiB7XG4gICAgYmFja2dyb3VuZDogcGFuZWxBY3RpdmVCZ1xuICB9LFxuXG4gICcgLmxheWVyLXBhbmVsLmFjdGl2ZSc6IHtcbiAgICBiYWNrZ3JvdW5kOiBwYW5lbEFjdGl2ZUJnLFxuICAgICcgLmxheWVyLXBhbmVsX19jb25maWcnOiB7XG4gICAgICBib3JkZXJUb3A6IHBhbmVsQm9yZGVyXG4gICAgfVxuICB9LFxuXG4gICcgLmxheWVyLXBhbmVsLmRyYWdnaW5nJzoge1xuICAgIGN1cnNvcjogJ21vdmUnXG4gIH0sXG5cbiAgJyAubGF5ZXItcGFuZWxfX2hlYWRlcjpob3Zlcic6IHtcbiAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICB9LFxuXG4gICcgLm1hcC1zdHlsZV9fcGFuZWwgLmxheWVyLXBhbmVsX19oZWFkZXInOiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgcGFkZGluZzogJzEycHggMjRweCcsXG5cbiAgICAnIC5sYWJlbCc6IHtcbiAgICAgIG1hcmdpbkJvdHRvbTogMFxuICAgIH1cbiAgfSxcblxuICAnIC5jb2xvci0tYmxvY2snOiB7XG4gICAgd2lkdGg6ICczMnB4JyxcbiAgICBoZWlnaHQ6ICcxNHB4JyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBtYXJnaW5Ub3A6ICcxMHB4JyxcbiAgICBtYXJnaW5MZWZ0OiAnMTNweCcsXG4gICAgekluZGV4OiA5OVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgbWFwU3R5bGVTZWxlY3RvciA9IHtcbiAgcGFkZGluZzogJzEycHggMjRweCcsXG5cbiAgJyAubGF5ZXItZ3JvdXBfX2hlYWRlcic6IHtcbiAgICBmb250U2l6ZTogJzEycHgnLFxuICAgIGNvbG9yOiBsYWJlbENvbG9yXG4gIH0sXG5cbiAgJyAucGFuZWwgLnRvcF9fcmlnaHQnOiB7XG4gICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgIGZvbnRTaXplOiAnMTFweCcsXG4gICAgY29sb3I6IGxhYmVsQ29sb3IsXG4gICAgbWFyZ2luQm90dG9tOiAnNnB4JyxcbiAgICBbJyBhJ106IHtcbiAgICAgIGNvbG9yOiBsYWJlbENvbG9yXG4gICAgfSxcbiAgICAnIC5pY29uJzoge1xuICAgICAgbWFyZ2luUmlnaHQ6ICc1cHgnXG4gICAgfVxuICB9LFxuXG4gICcgLmxheWVyLWdyb3VwX19zZWxlY3QnOiB7XG4gICAgbWFyZ2luQm90dG9tOiAnMTBweCcsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG5cbiAgICAnIC5sYXllci1ncm91cF9fbmFtZSc6IHtcbiAgICAgIGNvbG9yOiBzZWxlY3RDb2xvcixcbiAgICAgIG1hcmdpbjogMFxuICAgIH0sXG5cbiAgICAnIC5sYXllci1ncm91cF9fc3dpdGNoJzoge1xuICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgJyAubGF5ZXItLXRvZ2dsZSc6IHtcbiAgICAgICAgcGFkZGluZ1RvcDogJzVweCdcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgJyAubWFwLWRyb3Bkb3duLW9wdGlvbic6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBib3JkZXI6IHBhbmVsQm9yZGVyLFxuICAgIGJhY2tncm91bmQ6IHBhbmVsQmFja2dyb3VuZCxcbiAgICBoZWlnaHQ6ICc1MHB4JyxcbiAgICBtYXJnaW5Cb3R0b206ICc1cHgnLFxuICAgIG9wYWNpdHk6IDEsXG4gICAgcGFkZGluZzogJzEwcHgnLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IC4wNXMgZWFzZS1pbiwgaGVpZ2h0IC4yNXMgZWFzZS1vdXQnLFxuXG4gICAgJyAubWFwLXRpdGxlLWJsb2NrJzoge1xuICAgICAgZGlzcGxheTogJ2ZsZXgnXG4gICAgfSxcblxuICAgICcgLm1hcC1wcmV2aWV3Jzoge1xuICAgICAgYm9yZGVyOiAndGhpbiBzb2xpZCAjMjEyMTIyJyxcbiAgICAgIGJvcmRlclJhZGl1czogJzNweCcsXG4gICAgICBoZWlnaHQ6ICczMHB4JyxcbiAgICAgIHdpZHRoOiAnNDBweCdcbiAgICB9LFxuXG4gICAgJyAubWFwLXByZXZpZXctbmFtZSc6IHtcbiAgICAgIGNvbG9yOiBzZWxlY3RDb2xvcixcbiAgICAgIGZvbnRTaXplOiAnMTBweCcsXG4gICAgICBtYXJnaW5MZWZ0OiAnMTBweCcsXG4gICAgICBtYXJnaW5Ub3A6ICc1cHgnXG4gICAgfVxuICB9LFxuXG4gICcgLmxheWVyLS10b2dnbGUnOiB7XG4gICAgJyAuaWNvbic6IHtcbiAgICAgIGZvbnRTaXplOiAnMTdweCcsXG4gICAgICBjb2xvcjogbGFiZWxDb2xvcixcbiAgICAgIG1hcmdpbkxlZnQ6ICc2cHgnXG4gICAgfSxcblxuICAgICcgLmljb246aG92ZXInOiB7XG4gICAgICBjb2xvcjogJyNDNkM2QzYnXG4gICAgfSxcblxuICAgICcgLmljb24uYWN0aXZlJzoge1xuICAgICAgY29sb3I6IGFjdGl2ZUNvbG9yXG4gICAgfSxcblxuICAgICcgLmljb24uZGlzYWJsZWQnOiB7XG4gICAgICBjdXJzb3I6ICdkZWZhdWx0JyxcbiAgICAgIG9wYWNpdHk6IDAuMixcbiAgICAgIGNvbG9yOiBsYWJlbENvbG9yXG4gICAgfVxuICB9LFxuXG4gICcgLm1hcC1kcm9wZG93bi1vcHRpb246aG92ZXInOiB7XG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgY29sb3I6ICd3aGl0ZScsXG4gICAgYmFja2dyb3VuZDogcGFuZWxBY3RpdmVCZ1xuICB9LFxuXG4gICcgLm1hcC1kcm9wZG93bi1vcHRpb24uY29sbGFwc2VkJzoge1xuICAgIGhlaWdodDogJzBweCcsXG4gICAgbWFyZ2luQm90dG9tOiAwLFxuICAgIHBhZGRpbmc6IDAsXG4gICAgb3BhY2l0eTogMFxuICB9XG59O1xuIl19