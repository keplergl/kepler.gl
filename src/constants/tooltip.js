// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

export const TOOLTIP_FORMAT_TYPES = {
  NONE: 'none',
  DATE: 'date',
  DATE_TIME: 'date_time',
  DECIMAL: 'decimal',
  PERCENTAGE: 'percentage',
  BOOLEAN: 'boolean'
};

export const TOOLTIP_KEY = 'format';

export const TOOLTIP_FORMATS = {
  NONE: {
    id: 'NONE',
    label: 'None',
    format: null,
    type: TOOLTIP_FORMAT_TYPES.NONE
  },
  DECIMAL_SHORT: {
    id: 'DECIMAL_SHORT',
    label: '10k',
    format: '.1s',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_SHORT_COMMA: {
    id: 'DECIMAL_SHORT_COMMA',
    label: '12.3k',
    format: '.3~s',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_PERCENT_FULL_1: {
    id: 'DECIMAL_PERCENT_FULL_1',
    label: '.01 → 1.0%',
    format: '.1%',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_PERCENT_FULL_2: {
    id: 'DECIMAL_PERCENT_FULL_2',
    label: '.01 → 1.00%',
    format: '.2%',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_PRECENT_REGULAR: {
    id: 'DECIMAL_PRECENT_REGULAR',
    label: '12.345 → 12.35%',
    format: '~%',
    type: TOOLTIP_FORMAT_TYPES.PERCENTAGE
  },
  DECIMAL_DECIMAL_FIXED_2: {
    id: 'DECIMAL_DECIMAL_FIXED_2',
    label: '1.23',
    format: '.2f',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_DECIMAL_FIXED_3: {
    id: 'DECIMAL_DECIMAL_FIXED_3',
    label: '1.234',
    format: '.3f',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_INT: {
    id: 'DECIMAL_INT',
    label: '12345 → 12350',
    format: '.4~r',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_THREE: {
    id: 'DECIMAL_THREE',
    label: '12,345.432',
    format: ',.3f',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_DELTA: {
    id: 'DECIMAL_DELTA',
    label: '+12,345.432',
    format: '+,.3f',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DECIMAL_CURRENCY: {
    id: 'DECIMAL_CURRENCY',
    label: '$12,345.43',
    format: '$,.2f',
    type: TOOLTIP_FORMAT_TYPES.DECIMAL
  },
  DATE_L: {
    // 05/29/2020
    id: 'DATE_L',
    label: '',
    format: 'L',
    type: TOOLTIP_FORMAT_TYPES.DATE
  },
  DATE_LL: {
    // September 5 2016
    id: 'DATE_LL',
    label: '',
    format: 'LL',
    type: TOOLTIP_FORMAT_TYPES.DATE
  },
  DATE_dddd_LL: {
    // Monday September 5, 2016
    id: 'DATE_dddd_LL',
    label: '',
    format: 'dddd LL',
    type: TOOLTIP_FORMAT_TYPES.DATE
  },
  DATE_ddd_LL: {
    // Mon September 5, 2016
    id: 'DATE_ddd_LL',
    label: '',
    format: 'ddd LL',
    type: TOOLTIP_FORMAT_TYPES.DATE
  },
  DATE_TIME_L_LT: {
    // 09/05/2016 12:00 AM
    id: 'DATE_TIME_L_LT',
    label: '',
    format: 'L LT',
    type: TOOLTIP_FORMAT_TYPES.DATE_TIME
  },
  DATE_TIME_L_LTS: {
    // 09/05/2016 12:00:00 AM
    id: 'DATE_TIME_L_LTS',
    label: '',
    format: 'L LTS',
    type: TOOLTIP_FORMAT_TYPES.DATE_TIME
  },
  DATE_TIME_LLL: {
    // September 5, 2016 12:00 AM
    id: 'DATE_TIME_LLL',
    label: '',
    format: 'LLL',
    type: TOOLTIP_FORMAT_TYPES.DATE_TIME
  },
  DATE_TIME_LL_LTS: {
    // September 5, 2016 12:00:00 AM
    id: 'DATE_TIME_LL_LTS',
    label: '',
    format: 'LL LTS',
    type: TOOLTIP_FORMAT_TYPES.DATE_TIME
  },
  DATE_TIME_ddd_LLL: {
    // Mon September 5, 2016 12:00 AM
    id: 'DATE_TIME_ddd_LLL',
    label: '',
    format: 'ddd LLL',
    type: TOOLTIP_FORMAT_TYPES.DATE_TIME
  },
  DATE_TIME_LTS: {
    // 12:00:00 AM
    id: 'DATE_TIME_LTS',
    label: '',
    format: 'LTS',
    type: TOOLTIP_FORMAT_TYPES.DATE_TIME
  },
  BOOLEAN_NUM: {
    id: 'BOOLEAN_NUM',
    label: '0 | 1',
    format: '01',
    type: TOOLTIP_FORMAT_TYPES.BOOLEAN
  },
  BOOLEAN_Y_N: {
    id: 'BOOLEAN_Y_N',
    label: 'yes | no',
    format: 'yn',
    type: TOOLTIP_FORMAT_TYPES.BOOLEAN
  }
};

export const COMPARE_TYPES = {
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative'
};
