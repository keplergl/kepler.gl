'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapStyleSelector = exports.sidePanel = exports.slider = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defaultSettings = require('../constants/default-settings');

var _ui = require('./ui');

var _base = require('./base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slider = exports.slider = {
  ' .slider-input': {
    marginTop: '-12px'
  },

  ' .range-slider': {
    marginTop: '-18px',
    marginBottom: '12px'
  }
};

var sidePanel = exports.sidePanel = (0, _extends3.default)({}, _ui.select, _ui.selectLight, {
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
});

var mapStyleSelector = exports.mapStyleSelector = {
  ' .layer-group__header': {
    fontSize: '12px',
    color: _base.labelColor
  },

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
    transition: 'opacity .05s ease-in, height .25s ease-out'

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
  }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHlsZXMvc2lkZS1wYW5lbC5qcyJdLCJuYW1lcyI6WyJzbGlkZXIiLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJzaWRlUGFuZWwiLCJiYWNrZ3JvdW5kIiwiYm9yZGVyIiwiYm9yZGVyQm90dG9tIiwicGFkZGluZyIsImN1cnNvciIsImRpc3BsYXkiLCJqdXN0aWZ5Q29udGVudCIsIm1hcFN0eWxlU2VsZWN0b3IiLCJmb250U2l6ZSIsImNvbG9yIiwibWFyZ2luIiwicGFkZGluZ1RvcCIsImhlaWdodCIsIm9wYWNpdHkiLCJwb3NpdGlvbiIsInRyYW5zaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBV0E7Ozs7QUFlTyxJQUFNQSwwQkFBUztBQUNwQixvQkFBa0I7QUFDaEJDLGVBQVc7QUFESyxHQURFOztBQUtwQixvQkFBa0I7QUFDaEJBLGVBQVcsT0FESztBQUVoQkMsa0JBQWM7QUFGRTtBQUxFLENBQWY7O0FBV0EsSUFBTUM7QUFHWDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFpQjs7QUFFZjtBQUNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQVc7QUFDVEMsdUNBRFM7QUFFVEMsK0JBRlM7QUFHVEMscUNBSFM7O0FBS1QsMEJBQW9CO0FBQ2xCQyxpQkFBUztBQURTO0FBTFgsS0F4REk7O0FBa0VmLHFCQUFpQjtBQUNmSCxrQkFBWSxTQURHO0FBRWZDO0FBRmUsS0FsRUY7O0FBdUVmLHNCQUFrQjtBQUNoQkQsa0JBQVksU0FESTtBQUVoQkM7QUFGZ0I7QUF2RUgsR0FUTjs7QUFzRlgsd0NBQXNDO0FBQ3BDRDtBQURvQyxHQXRGM0I7O0FBMEZYLGlDQUErQjtBQUM3QkksWUFBUTtBQURxQixHQTFGcEI7O0FBOEZYLDZDQUEyQztBQUN6Q0MsYUFBUyxNQURnQztBQUV6Q0Msb0JBQWdCLGVBRnlCO0FBR3pDSCxhQUFTLFdBSGdDOztBQUt6QyxlQUFXO0FBQ1RMLG9CQUFjO0FBREw7QUFMOEI7QUE5RmhDLEVBQU47O0FBeUdBLElBQU1TLDhDQUFtQjtBQUM5QiwyQkFBeUI7QUFDdkJDLGNBQVUsTUFEYTtBQUV2QkM7QUFGdUIsR0FESzs7QUFNOUIsMkJBQXlCO0FBQ3ZCWCxrQkFBYyxNQURTO0FBRXZCTyxhQUFTLE1BRmM7QUFHdkJDLG9CQUFnQixlQUhPOztBQUt2QiwyQkFBdUI7QUFDckJHLDhCQURxQjtBQUVyQkMsY0FBUTtBQUZhLEtBTEE7O0FBVXZCLDZCQUF5QjtBQUN2QkwsZUFBUyxNQURjO0FBRXZCLHlCQUFtQjtBQUNqQk0sb0JBQVk7QUFESztBQUZJO0FBVkYsR0FOSzs7QUF3QjlCLDJCQUF5QjtBQUN2Qk4sYUFBUyxNQURjO0FBRXZCQyxvQkFBZ0IsZUFGTztBQUd2QkwsNkJBSHVCO0FBSXZCRCxxQ0FKdUI7QUFLdkJZLFlBQVEsTUFMZTtBQU12QmQsa0JBQWMsS0FOUztBQU92QmUsYUFBUyxDQVBjO0FBUXZCVixhQUFTLE1BUmM7QUFTdkJXLGNBQVUsVUFUYTtBQVV2QkMsZ0JBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTVCdUI7O0FBK0J6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF4RjhCLENBQXpCIiwiZmlsZSI6InNpZGUtcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RJTUVOU0lPTlN9IGZyb20gJy4uL2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7XG4gIGJ1dHRvbixcbiAgbGlua0J1dHRvbixcbiAgc2Vjb25kYXJ5QnV0dG9uLFxuICB0ZXh0SW5wdXQsXG4gIHRleHRJbnB1dExpZ2h0LFxuICBzZWxlY3QsXG4gIHNlbGVjdExpZ2h0LFxuICBzY3JvbGxCYXJcbn0gZnJvbSAnLi91aSc7XG5cbmltcG9ydCB7XG4gIGFjdGl2ZUNvbG9yLFxuICBib3JkZXJSYWRpdXMsXG4gIGJveFNoYWRvdyxcbiAgbGFiZWxDb2xvcixcbiAgbGFiZWxIb3ZlckNvbG9yLFxuICBwYW5lbEFjdGl2ZUJnLFxuICBwYW5lbEJhY2tncm91bmQsXG4gIHBhbmVsQm9yZGVyLFxuICBzZWxlY3RCYWNrZ3JvdW5kLFxuICBzZWxlY3RCYWNrZ3JvdW5kSG92ZXIsXG4gIHNlbGVjdENvbG9yLFxuICB0ZXh0Q29sb3Jcbn0gZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGNvbnN0IHNsaWRlciA9IHtcbiAgJyAuc2xpZGVyLWlucHV0Jzoge1xuICAgIG1hcmdpblRvcDogJy0xMnB4J1xuICB9LFxuXG4gICcgLnJhbmdlLXNsaWRlcic6IHtcbiAgICBtYXJnaW5Ub3A6ICctMThweCcsXG4gICAgbWFyZ2luQm90dG9tOiAnMTJweCdcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNpZGVQYW5lbCA9IHtcbiAgLi4uc2VsZWN0LFxuICAuLi5zZWxlY3RMaWdodCxcbiAgLy8gLi4uaW5mb0hlbHBlcixcbiAgLy8gLi4uY29sb3JQYWxldHRlU2VsZWN0b3IsXG4gIC8vIC4uLmJ1dHRvbixcbiAgLy8gLi4ubGlua0J1dHRvbixcbiAgLy8gLi4uc2Vjb25kYXJ5QnV0dG9uLFxuXG4gICcgLmxheWVyLXBhbmVsJzoge1xuXG4gICAgLy8gJyAubGF5ZXJfX2RyYWctaGFuZGxlJzoge1xuICAgICAgLy8gbWFyZ2luTGVmdDogJy0xNHB4JyxcbiAgICAgIC8vXG4gICAgICAvLyBbJyBwYXRoJ106IHtcbiAgICAgIC8vICAgZmlsbDogc2VsZWN0QmFja2dyb3VuZFxuICAgICAgLy8gfSxcblxuICAgIC8vICAgJyA6aG92ZXInOiB7XG4gICAgLy8gICAgIGN1cnNvcjogJ21vdmUnXG4gICAgLy8gICB9LFxuICAgIC8vXG4gICAgLy8gICAnIDpob3ZlciBwYXRoJzoge1xuICAgIC8vICAgICBmaWxsOiBsYWJlbEhvdmVyQ29sb3JcbiAgICAvLyAgIH1cbiAgICAvLyB9LFxuXG4gICAgLy8gJyAubGF5ZXJfX3RpdGxlJzoge1xuICAgIC8vICAgcGFkZGluZ0xlZnQ6ICc0cHgnLFxuICAgIC8vICAgWycgc3BhbiddOiB7XG4gICAgLy8gICAgIGZvbnRTaXplOiAnMTJweCdcbiAgICAvLyAgIH0sXG4gICAgLy8gICAnIC50ZXh0LWlucHV0LS1ib3JkZXJsZXNzJzoge1xuICAgIC8vICAgICBoZWlnaHQ6ICcyNnB4JyxcbiAgICAvLyAgICAgYmFja2dyb3VuZDogc2VsZWN0QmFja2dyb3VuZCxcbiAgICAvLyAgICAgYm9yZGVyOiBwYW5lbEJvcmRlcixcbiAgICAvLyAgICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICAvLyAgICAgcGFkZGluZ0xlZnQ6ICc4cHgnXG4gICAgLy8gICB9XG4gICAgLy8gfSxcblxuICAgIC8vJyAubGF5ZXItcGFuZWxfX2hlYWRlcic6IHtcbiAgICAgIC8vXG4gICAgICAvLyAnIC5pY29uJzoge1xuICAgICAgLy8gICBmb250U2l6ZTogJzE3cHgnLFxuICAgICAgLy8gICBjb2xvcjogbGFiZWxDb2xvclxuICAgICAgLy8gfSxcbiAgICAgIC8vXG4gICAgICAvLyAnIC5pY29uOmhvdmVyJzoge1xuICAgICAgLy8gICBjb2xvcjogbGFiZWxIb3ZlckNvbG9yXG4gICAgICAvLyB9LFxuICAgICAgLy9cbiAgICAgIC8vICcgLmljb25fdHJhc2g6aG92ZXInOiB7XG4gICAgICAvLyAgIGNvbG9yOiAnI0NBM0IyNydcbiAgICAgIC8vIH0sXG4gICAgICAvL1xuICAgICAgLy8gJyAuaWNvbi5pY29uX2V5ZSc6IHtcbiAgICAgIC8vICAgY29sb3I6IGFjdGl2ZUNvbG9yXG4gICAgICAvLyB9XG4gICAgLy99LFxuICAgIC8vXG4gICAgLy8gJyAubGF5ZXItcGFuZWxfX2hlYWRlci5uby1oaWdobGlnaHQnOiB7XG4gICAgLy8gICBib3JkZXJMZWZ0V2lkdGg6IDBcbiAgICAvLyB9LFxuXG4gICAgJyAucGFuZWwnOiB7XG4gICAgICBiYWNrZ3JvdW5kOiBwYW5lbEJhY2tncm91bmQsXG4gICAgICBib3JkZXI6IHBhbmVsQm9yZGVyLFxuICAgICAgYm9yZGVyQm90dG9tOiBwYW5lbEJvcmRlcixcblxuICAgICAgJyAucGFuZWxfX2NvbnRlbnQnOiB7XG4gICAgICAgIHBhZGRpbmc6ICcxMnB4J1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAnIGxhYmVsOmJlZm9yZSc6IHtcbiAgICAgIGJhY2tncm91bmQ6ICcjMjgyNzI3JyxcbiAgICAgIGJvcmRlcjogcGFuZWxCb3JkZXJcbiAgICB9LFxuXG4gICAgJyAucmFkaW86YmVmb3JlJzoge1xuICAgICAgYmFja2dyb3VuZDogJyMyODI3MjcnLFxuICAgICAgYm9yZGVyOiBwYW5lbEJvcmRlclxuICAgIH1cbiAgfSxcblxuICAnIC5sYXllci1wYW5lbC51aS1zb3J0YWJsZS1kcmFnZ2luZyc6IHtcbiAgICBiYWNrZ3JvdW5kOiBzZWxlY3RCYWNrZ3JvdW5kXG4gIH0sXG5cbiAgJyAubGF5ZXItcGFuZWxfX2hlYWRlcjpob3Zlcic6IHtcbiAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICB9LFxuXG4gICcgLm1hcC1zdHlsZV9fcGFuZWwgLmxheWVyLXBhbmVsX19oZWFkZXInOiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG4gICAgcGFkZGluZzogJzEycHggMjRweCcsXG5cbiAgICAnIC5sYWJlbCc6IHtcbiAgICAgIG1hcmdpbkJvdHRvbTogMFxuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IG1hcFN0eWxlU2VsZWN0b3IgPSB7XG4gICcgLmxheWVyLWdyb3VwX19oZWFkZXInOiB7XG4gICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICBjb2xvcjogbGFiZWxDb2xvclxuICB9LFxuXG4gICcgLmxheWVyLWdyb3VwX19zZWxlY3QnOiB7XG4gICAgbWFyZ2luQm90dG9tOiAnMTBweCcsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG5cbiAgICAnIC5sYXllci1ncm91cF9fbmFtZSc6IHtcbiAgICAgIGNvbG9yOiBzZWxlY3RDb2xvcixcbiAgICAgIG1hcmdpbjogMFxuICAgIH0sXG5cbiAgICAnIC5sYXllci1ncm91cF9fc3dpdGNoJzoge1xuICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgJyAubGF5ZXItLXRvZ2dsZSc6IHtcbiAgICAgICAgcGFkZGluZ1RvcDogJzVweCdcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgJyAubWFwLWRyb3Bkb3duLW9wdGlvbic6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBib3JkZXI6IHBhbmVsQm9yZGVyLFxuICAgIGJhY2tncm91bmQ6IHBhbmVsQmFja2dyb3VuZCxcbiAgICBoZWlnaHQ6ICc1MHB4JyxcbiAgICBtYXJnaW5Cb3R0b206ICc1cHgnLFxuICAgIG9wYWNpdHk6IDEsXG4gICAgcGFkZGluZzogJzEwcHgnLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IC4wNXMgZWFzZS1pbiwgaGVpZ2h0IC4yNXMgZWFzZS1vdXQnLFxuXG4gICAgLy8gJyAubWFwLXRpdGxlLWJsb2NrJzoge1xuICAgIC8vICAgZGlzcGxheTogJ2ZsZXgnXG4gICAgLy8gfSxcbiAgICAvL1xuICAgIC8vICcgLm1hcC1wcmV2aWV3Jzoge1xuICAgIC8vICAgYm9yZGVyOiAndGhpbiBzb2xpZCAjMjEyMTIyJyxcbiAgICAvLyAgIGJvcmRlclJhZGl1czogJzNweCcsXG4gICAgLy8gICBoZWlnaHQ6ICczMHB4JyxcbiAgICAvLyAgIHdpZHRoOiAnNDBweCdcbiAgICAvLyB9LFxuICAgIC8vXG4gICAgLy8gJyAubWFwLXByZXZpZXctbmFtZSc6IHtcbiAgICAvLyAgIGNvbG9yOiBzZWxlY3RDb2xvcixcbiAgICAvLyAgIGZvbnRTaXplOiAnMTBweCcsXG4gICAgLy8gICBtYXJnaW5MZWZ0OiAnMTBweCcsXG4gICAgLy8gICBtYXJnaW5Ub3A6ICc1cHgnXG4gICAgLy8gfVxuICB9LFxuXG4gIC8vICcgLmxheWVyLS10b2dnbGUnOiB7XG4gIC8vICAgJyAuaWNvbic6IHtcbiAgLy8gICAgIGZvbnRTaXplOiAnMTdweCcsXG4gIC8vICAgICBjb2xvcjogbGFiZWxDb2xvcixcbiAgLy8gICAgIG1hcmdpbkxlZnQ6ICc2cHgnXG4gIC8vICAgfSxcbiAgLy9cbiAgLy8gICAnIC5pY29uOmhvdmVyJzoge1xuICAvLyAgICAgY29sb3I6ICcjQzZDNkM2J1xuICAvLyAgIH0sXG4gIC8vXG4gIC8vICAgJyAuaWNvbi5hY3RpdmUnOiB7XG4gIC8vICAgICBjb2xvcjogYWN0aXZlQ29sb3JcbiAgLy8gICB9LFxuICAvL1xuICAvLyAgICcgLmljb24uZGlzYWJsZWQnOiB7XG4gIC8vICAgICBjdXJzb3I6ICdkZWZhdWx0JyxcbiAgLy8gICAgIG9wYWNpdHk6IDAuMixcbiAgLy8gICAgIGNvbG9yOiBsYWJlbENvbG9yXG4gIC8vICAgfVxuICAvLyB9LFxuXG4gIC8vICcgLm1hcC1kcm9wZG93bi1vcHRpb246aG92ZXInOiB7XG4gIC8vICAgY3Vyc29yOiAncG9pbnRlcicsXG4gIC8vICAgY29sb3I6ICd3aGl0ZScsXG4gIC8vICAgYmFja2dyb3VuZDogcGFuZWxBY3RpdmVCZ1xuICAvLyB9LFxuXG4gIC8vICcgLm1hcC1kcm9wZG93bi1vcHRpb24uY29sbGFwc2VkJzoge1xuICAvLyAgIGhlaWdodDogJzBweCcsXG4gIC8vICAgbWFyZ2luQm90dG9tOiAwLFxuICAvLyAgIHBhZGRpbmc6IDAsXG4gIC8vICAgb3BhY2l0eTogMFxuICAvLyB9XG59O1xuIl19