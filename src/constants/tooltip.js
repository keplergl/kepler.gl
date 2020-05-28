// Copyright (c) 2020 Uber Technologies, Inc.
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
