export const COLORS = {
  'uber-blue': '#11939A',
  'uber-black-40': '#939393',
  'uber-black-95': '#1C1B1B',
  'uber-yellow-20': '#FEFAE7',
  'uber-yellow': '#ECAB20',
  'uber-orange': '#CA3B27',
  'uber-orange-20': '#FEEFEB'
};

export const INPUT = {
  primary: {
    background: '#494949',
    color: '#C6C6C6',
    border: '1px solid #717171',

    '.disabled': {
      background: '#282727',
      color: '#717171'
    },

    ':hover': {
      border: `1px solid ${COLORS['uber-blue']}`
    },

    ':focus': {
      border: '1px solid #11939A'
    }
  },

  secondary: {
    background: 'transparent',
    color: '#C6C6C6'
  }
};

export const CLOSE_ICON = {
  position: 'absolute',
  [' path']: {
    fill: COLORS['uber-black-40']
  },
  ' :hover': {
    cursor: 'pointer'
  },

  ' :hover path': {
    fill: COLORS['uber-black-95']
  }
};

export const mapPopover = {
  fontSize: '11px',
  fontWeight: 500,
  backgroundColor: 'white',
  zIndex: 1001,
  position: 'absolute',
  padding: '12px 12px 12px 12px',
  ' .gutter': {
    height: '18px'
  },
  overflowX: 'scroll',

  ' .popover-pin': {
    position: 'absolute',
    left: '50%',
    marginLeft: '8px',
    transform: 'rotate(30deg)',
    top: '10px',
    [' path']: {
      fill: COLORS['uber-orange']
    },
    ' :hover': {
      cursor: 'pointer'
    },

    ' :hover path': {
      fill: COLORS['uber-orange-20']
    }
  },
  ' .popover-table': {
    marginBottom: 0,

    td: {
      color: COLORS['uber-black-95']
    }
  },

  ' .popover-table tbody': {
    border: 0
  },

  ' .popover-table th, .popover-table td, .popover-table th, .popover-table td': {
    padding: '3px 6px'
  }
};
