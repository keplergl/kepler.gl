export const TOOLTIP_FORMAT_TYPES = {
  DATE: 'date',
  DECIMAL: 'decimal',
  PERCENTAGE: 'percentage'
};

export const TOOLTIP_FORMATS = {
  NONE: {
    label: 'None'
  },
  DECIMAL_SHORT: {
    label: '10k',
    format: '.1s',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_SHORT_COMMA: {
    label: '12.3k',
    format: '.3s',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_PERCENT_FULL: {
    label: '.1 → 10%',
    format: '.1%',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_PRECENT_REGULAR: {
    label: '10 → 10%',
    format: '.1%',
    type: TOOLTIP_FORMAT_TYPES.PERCENTAGE
  },
  DECIMAL_INT: {
    label: '12350',
    format: '.4r',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_THREE: {
    label: '12,345.432',
    format: ',.3f',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_DELTA: {
    label: '+12,345.432',
    format: '+,',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_CURRENCY: {
    label: '$12,345.43',
    format: '$,.2f',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DATE_DDMMYYYY: {
    label: '14/01/2019',
    format: '%d/%m/%Y',
    type: TOOLTIP_FORMAT_TYPES.DATE
  },
  DATE_DAY_MMDDYYYY: {
    label: '01/14/2019',
    format: '%m/%d/%Y',
    type: TOOLTIP_FORMAT_TYPES.DATE
  },
  DATE_DAY_YYYYMMDD: {
    label: '2019-01-14',
    format: '%Y-%m-%d',
    type: TOOLTIP_FORMAT_TYPES.DATE
  },
  DATE_FULL: {
    label: '2019-01-14 01:32:10',
    format: '%Y-%m-%d %H:%M:%S',
    type: TOOLTIP_FORMAT_TYPES.DATE
  },
  DATE_FULL_ALT: {
    label: '14-01-2019 01:32:10',
    format: '%d-%m-%Y %H:%M:%S',
    type: TOOLTIP_FORMAT_TYPES.DATE
  },
  DATE_TIME: {
    label: '01:32:10',
    format: '%H:%M:%S',
    type: TOOLTIP_FORMAT_TYPES.DATE
  }
};
