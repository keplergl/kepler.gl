"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.COMPARE_TYPES = exports.TOOLTIP_FORMATS = exports.TOOLTIP_KEY = exports.TOOLTIP_FORMAT_TYPES = void 0;
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
var TOOLTIP_FORMAT_TYPES = {
  NONE: 'none',
  DATE: 'date',
  DATE_TIME: 'date_time',
  DECIMAL: 'decimal',
  PERCENTAGE: 'percentage',
  BOOLEAN: 'boolean'
};
exports.TOOLTIP_FORMAT_TYPES = TOOLTIP_FORMAT_TYPES;
var TOOLTIP_KEY = 'format';
exports.TOOLTIP_KEY = TOOLTIP_KEY;
var TOOLTIP_FORMATS = {
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
exports.TOOLTIP_FORMATS = TOOLTIP_FORMATS;
var COMPARE_TYPES = {
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative'
};
exports.COMPARE_TYPES = COMPARE_TYPES;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdGFudHMvdG9vbHRpcC5qcyJdLCJuYW1lcyI6WyJUT09MVElQX0ZPUk1BVF9UWVBFUyIsIk5PTkUiLCJEQVRFIiwiREFURV9USU1FIiwiREVDSU1BTCIsIlBFUkNFTlRBR0UiLCJCT09MRUFOIiwiVE9PTFRJUF9LRVkiLCJUT09MVElQX0ZPUk1BVFMiLCJpZCIsImxhYmVsIiwiZm9ybWF0IiwidHlwZSIsIkRFQ0lNQUxfU0hPUlQiLCJERUNJTUFMX1NIT1JUX0NPTU1BIiwiREVDSU1BTF9QRVJDRU5UX0ZVTExfMSIsIkRFQ0lNQUxfUEVSQ0VOVF9GVUxMXzIiLCJERUNJTUFMX1BSRUNFTlRfUkVHVUxBUiIsIkRFQ0lNQUxfREVDSU1BTF9GSVhFRF8yIiwiREVDSU1BTF9ERUNJTUFMX0ZJWEVEXzMiLCJERUNJTUFMX0lOVCIsIkRFQ0lNQUxfVEhSRUUiLCJERUNJTUFMX0RFTFRBIiwiREVDSU1BTF9DVVJSRU5DWSIsIkRBVEVfTCIsIkRBVEVfTEwiLCJEQVRFX2RkZGRfTEwiLCJEQVRFX2RkZF9MTCIsIkRBVEVfVElNRV9MX0xUIiwiREFURV9USU1FX0xfTFRTIiwiREFURV9USU1FX0xMTCIsIkRBVEVfVElNRV9MTF9MVFMiLCJEQVRFX1RJTUVfZGRkX0xMTCIsIkRBVEVfVElNRV9MVFMiLCJCT09MRUFOX05VTSIsIkJPT0xFQU5fWV9OIiwiQ09NUEFSRV9UWVBFUyIsIkFCU09MVVRFIiwiUkVMQVRJVkUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRU8sSUFBTUEsb0JBQW9CLEdBQUc7QUFDbENDLEVBQUFBLElBQUksRUFBRSxNQUQ0QjtBQUVsQ0MsRUFBQUEsSUFBSSxFQUFFLE1BRjRCO0FBR2xDQyxFQUFBQSxTQUFTLEVBQUUsV0FIdUI7QUFJbENDLEVBQUFBLE9B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QkFBb0IsQ0FBQ0c7QUFMZCxHQXhJYztBQStJN0IrQixFQUFBQSxXQUFXLEVBQUU7QUFDWHpCLElBQUFBLEVBQUUsRUFBRSxhQURPO0FBRVhDLElBQUFBLEtBQUssRUFBRSxPQUZJO0FBR1hDLElBQUFBLE1BQU0sRUFBRSxJQUhHO0FBSVhDLElBQUFBLElBQUksRUFBRVosb0JBQW9CLENBQUNNO0FBSmhCLEdBL0lnQjtBQXFKN0I2QixFQUFBQSxXQUFXLEVBQUU7QUFDWDFCLElBQUFBLEVBQUUsRUFBRSxhQURPO0FBRVhDLElBQUFBLEtBQUssRUFBRSxVQUZJO0FBR1hDLElBQUFBLE1BQU0sRUFBRSxJQUhHO0FBSVhDLElBQUFBLElBQUksRUFBRVosb0JBQW9CLENBQUNNO0FBSmhCO0FBckpnQixDQUF4Qjs7QUE2SkEsSUFBTThCLGFBQWEsR0FBRztBQUMzQkMsRUFBQUEsUUFBUSxFQUFFLFVBRGlCO0FBRTNCQyxFQUFBQSxRQUFRLEVBQUU7QUFGaUIsQ0FBdEIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5leHBvcnQgY29uc3QgVE9PTFRJUF9GT1JNQVRfVFlQRVMgPSB7XG4gIE5PTkU6ICdub25lJyxcbiAgREFURTogJ2RhdGUnLFxuICBEQVRFX1RJTUU6ICdkYXRlX3RpbWUnLFxuICBERUNJTUFMOiAnZGVjaW1hbCcsXG4gIFBFUkNFTlRBR0U6ICdwZXJjZW50YWdlJyxcbiAgQk9PTEVBTjogJ2Jvb2xlYW4nXG59O1xuXG5leHBvcnQgY29uc3QgVE9PTFRJUF9LRVkgPSAnZm9ybWF0JztcblxuZXhwb3J0IGNvbnN0IFRPT0xUSVBfRk9STUFUUyA9IHtcbiAgTk9ORToge1xuICAgIGlkOiAnTk9ORScsXG4gICAgbGFiZWw6ICdOb25lJyxcbiAgICBmb3JtYXQ6IG51bGwsXG4gICAgdHlwZTogVE9PTFRJUF9GT1JNQVRfVFlQRVMuTk9ORVxuICB9LFxuICBERUNJTUFMX1NIT1JUOiB7XG4gICAgaWQ6ICdERUNJTUFMX1NIT1JUJyxcbiAgICBsYWJlbDogJzEwaycsXG4gICAgZm9ybWF0OiAnLjFzJyxcbiAgICB0eXBlOiBUT09MVElQX0ZPUk1BVF9UWVBFUy5ERUNJTUFMXG4gIH0sXG4gIERFQ0lNQUxfU0hPUlRfQ09NTUE6IHtcbiAgICBpZDogJ0RFQ0lNQUxfU0hPUlRfQ09NTUEnLFxuICAgIGxhYmVsOiAnMTIuM2snLFxuICAgIGZvcm1hdDogJy4zfnMnLFxuICAgIHR5cGU6IFRPT0xUSVBfRk9STUFUX1RZUEVTLkRFQ0lNQUxcbiAgfSxcbiAgREVDSU1BTF9QRVJDRU5UX0ZVTExfMToge1xuICAgIGlkOiAnREVDSU1BTF9QRVJDRU5UX0ZVTExfMScsXG4gICAgbGFiZWw6ICcuMDEg4oaSIDEuMCUnLFxuICAgIGZvcm1hdDogJy4xJScsXG4gICAgdHlwZTogVE9PTFRJUF9GT1JNQVRfVFlQRVMuREVDSU1BTFxuICB9LFxuICBERUNJTUFMX1BFUkNFTlRfRlVMTF8yOiB7XG4gICAgaWQ6ICdERUNJTUFMX1BFUkNFTlRfRlVMTF8yJyxcbiAgICBsYWJlbDogJy4wMSDihpIgMS4wMCUnLFxuICAgIGZvcm1hdDogJy4yJScsXG4gICAgdHlwZTogVE9PTFRJUF9GT1JNQVRfVFlQRVMuREVDSU1BTFxuICB9LFxuICBERUNJTUFMX1BSRUNFTlRfUkVHVUxBUjoge1xuICAgIGlkOiAnREVDSU1BTF9QUkVDRU5UX1JFR1VMQVInLFxuICAgIGxhYmVsOiAnMTIuMzQ1IOKGkiAxMi4zNSUnLFxuICAgIGZvcm1hdDogJ34lJyxcbiAgICB0eXBlOiBUT09MVElQX0ZPUk1BVF9UWVBFUy5QRVJDRU5UQUdFXG4gIH0sXG4gIERFQ0lNQUxfREVDSU1BTF9GSVhFRF8yOiB7XG4gICAgaWQ6ICdERUNJTUFMX0RFQ0lNQUxfRklYRURfMicsXG4gICAgbGFiZWw6ICcxLjIzJyxcbiAgICBmb3JtYXQ6ICcuMmYnLFxuICAgIHR5cGU6IFRPT0xUSVBfRk9STUFUX1RZUEVTLkRFQ0lNQUxcbiAgfSxcbiAgREVDSU1BTF9ERUNJTUFMX0ZJWEVEXzM6IHtcbiAgICBpZDogJ0RFQ0lNQUxfREVDSU1BTF9GSVhFRF8zJyxcbiAgICBsYWJlbDogJzEuMjM0JyxcbiAgICBmb3JtYXQ6ICcuM2YnLFxuICAgIHR5cGU6IFRPT0xUSVBfRk9STUFUX1RZUEVTLkRFQ0lNQUxcbiAgfSxcbiAgREVDSU1BTF9JTlQ6IHtcbiAgICBpZDogJ0RFQ0lNQUxfSU5UJyxcbiAgICBsYWJlbDogJzEyMzQ1IOKGkiAxMjM1MCcsXG4gICAgZm9ybWF0OiAnLjR+cicsXG4gICAgdHlwZTogVE9PTFRJUF9GT1JNQVRfVFlQRVMuREVDSU1BTFxuICB9LFxuICBERUNJTUFMX1RIUkVFOiB7XG4gICAgaWQ6ICdERUNJTUFMX1RIUkVFJyxcbiAgICBsYWJlbDogJzEyLDM0NS40MzInLFxuICAgIGZvcm1hdDogJywuM2YnLFxuICAgIHR5cGU6IFRPT0xUSVBfRk9STUFUX1RZUEVTLkRFQ0lNQUxcbiAgfSxcbiAgREVDSU1BTF9ERUxUQToge1xuICAgIGlkOiAnREVDSU1BTF9ERUxUQScsXG4gICAgbGFiZWw6ICcrMTIsMzQ1LjQzMicsXG4gICAgZm9ybWF0OiAnKywuM2YnLFxuICAgIHR5cGU6IFRPT0xUSVBfRk9STUFUX1RZUEVTLkRFQ0lNQUxcbiAgfSxcbiAgREVDSU1BTF9DVVJSRU5DWToge1xuICAgIGlkOiAnREVDSU1BTF9DVVJSRU5DWScsXG4gICAgbGFiZWw6ICckMTIsMzQ1LjQzJyxcbiAgICBmb3JtYXQ6ICckLC4yZicsXG4gICAgdHlwZTogVE9PTFRJUF9GT1JNQVRfVFlQRVMuREVDSU1BTFxuICB9LFxuICBEQVRFX0w6IHtcbiAgICAvLyAwNS8yOS8yMDIwXG4gICAgaWQ6ICdEQVRFX0wnLFxuICAgIGxhYmVsOiAnJyxcbiAgICBmb3JtYXQ6ICdMJyxcbiAgICB0eXBlOiBUT09MVElQX0ZPUk1BVF9UWVBFUy5EQVRFXG4gIH0sXG4gIERBVEVfTEw6IHtcbiAgICAvLyBTZXB0ZW1iZXIgNSAyMDE2XG4gICAgaWQ6ICdEQVRFX0xMJyxcbiAgICBsYWJlbDogJycsXG4gICAgZm9ybWF0OiAnTEwnLFxuICAgIHR5cGU6IFRPT0xUSVBfRk9STUFUX1RZUEVTLkRBVEVcbiAgfSxcbiAgREFURV9kZGRkX0xMOiB7XG4gICAgLy8gTW9uZGF5IFNlcHRlbWJlciA1LCAyMDE2XG4gICAgaWQ6ICdEQVRFX2RkZGRfTEwnLFxuICAgIGxhYmVsOiAnJyxcbiAgICBmb3JtYXQ6ICdkZGRkIExMJyxcbiAgICB0eXBlOiBUT09MVElQX0ZPUk1BVF9UWVBFUy5EQVRFXG4gIH0sXG4gIERBVEVfZGRkX0xMOiB7XG4gICAgLy8gTW9uIFNlcHRlbWJlciA1LCAyMDE2XG4gICAgaWQ6ICdEQVRFX2RkZF9MTCcsXG4gICAgbGFiZWw6ICcnLFxuICAgIGZvcm1hdDogJ2RkZCBMTCcsXG4gICAgdHlwZTogVE9PTFRJUF9GT1JNQVRfVFlQRVMuREFURVxuICB9LFxuICBEQVRFX1RJTUVfTF9MVDoge1xuICAgIC8vIDA5LzA1LzIwMTYgMTI6MDAgQU1cbiAgICBpZDogJ0RBVEVfVElNRV9MX0xUJyxcbiAgICBsYWJlbDogJycsXG4gICAgZm9ybWF0OiAnTCBMVCcsXG4gICAgdHlwZTogVE9PTFRJUF9GT1JNQVRfVFlQRVMuREFURV9USU1FXG4gIH0sXG4gIERBVEVfVElNRV9MX0xUUzoge1xuICAgIC8vIDA5LzA1LzIwMTYgMTI6MDA6MDAgQU1cbiAgICBpZDogJ0RBVEVfVElNRV9MX0xUUycsXG4gICAgbGFiZWw6ICcnLFxuICAgIGZvcm1hdDogJ0wgTFRTJyxcbiAgICB0eXBlOiBUT09MVElQX0ZPUk1BVF9UWVBFUy5EQVRFX1RJTUVcbiAgfSxcbiAgREFURV9USU1FX0xMTDoge1xuICAgIC8vIFNlcHRlbWJlciA1LCAyMDE2IDEyOjAwIEFNXG4gICAgaWQ6ICdEQVRFX1RJTUVfTExMJyxcbiAgICBsYWJlbDogJycsXG4gICAgZm9ybWF0OiAnTExMJyxcbiAgICB0eXBlOiBUT09MVElQX0ZPUk1BVF9UWVBFUy5EQVRFX1RJTUVcbiAgfSxcbiAgREFURV9USU1FX0xMX0xUUzoge1xuICAgIC8vIFNlcHRlbWJlciA1LCAyMDE2IDEyOjAwOjAwIEFNXG4gICAgaWQ6ICdEQVRFX1RJTUVfTExfTFRTJyxcbiAgICBsYWJlbDogJycsXG4gICAgZm9ybWF0OiAnTEwgTFRTJyxcbiAgICB0eXBlOiBUT09MVElQX0ZPUk1BVF9UWVBFUy5EQVRFX1RJTUVcbiAgfSxcbiAgREFURV9USU1FX2RkZF9MTEw6IHtcbiAgICAvLyBNb24gU2VwdGVtYmVyIDUsIDIwMTYgMTI6MDAgQU1cbiAgICBpZDogJ0RBVEVfVElNRV9kZGRfTExMJyxcbiAgICBsYWJlbDogJycsXG4gICAgZm9ybWF0OiAnZGRkIExMTCcsXG4gICAgdHlwZTogVE9PTFRJUF9GT1JNQVRfVFlQRVMuREFURV9USU1FXG4gIH0sXG4gIERBVEVfVElNRV9MVFM6IHtcbiAgICAvLyAxMjowMDowMCBBTVxuICAgIGlkOiAnREFURV9USU1FX0xUUycsXG4gICAgbGFiZWw6ICcnLFxuICAgIGZvcm1hdDogJ0xUUycsXG4gICAgdHlwZTogVE9PTFRJUF9GT1JNQVRfVFlQRVMuREFURV9USU1FXG4gIH0sXG4gIEJPT0xFQU5fTlVNOiB7XG4gICAgaWQ6ICdCT09MRUFOX05VTScsXG4gICAgbGFiZWw6ICcwIHwgMScsXG4gICAgZm9ybWF0OiAnMDEnLFxuICAgIHR5cGU6IFRPT0xUSVBfRk9STUFUX1RZUEVTLkJPT0xFQU5cbiAgfSxcbiAgQk9PTEVBTl9ZX046IHtcbiAgICBpZDogJ0JPT0xFQU5fWV9OJyxcbiAgICBsYWJlbDogJ3llcyB8IG5vJyxcbiAgICBmb3JtYXQ6ICd5bicsXG4gICAgdHlwZTogVE9PTFRJUF9GT1JNQVRfVFlQRVMuQk9PTEVBTlxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgQ09NUEFSRV9UWVBFUyA9IHtcbiAgQUJTT0xVVEU6ICdhYnNvbHV0ZScsXG4gIFJFTEFUSVZFOiAncmVsYXRpdmUnXG59O1xuIl19