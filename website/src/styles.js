// Copyright (c) 2018 Uber Technologies, Inc.
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

import {css} from 'styled-components';

export const breakPoints = {
  palm: 588,
  desk: 768
};

export const media = {
  palm: (...args) => css`
    @media (max-width: ${breakPoints.palm}px) {
      ${css(...args)}
    }
  `,

  portable:  (...args) => css`
    @media (max-width: ${breakPoints.desk}px) {
      ${css(...args)}
    }
  `,

  desk: (...args) => css`
    @media (min-width: ${breakPoints.desk + 1}px) {
      ${css(...args)}
    }
  `
};

export const errorColor = '#F9042C';

export const theme = {
  textColor: '#FFFFFF',
  labelColor: '#D0D0D0',
  mapBackground: '#0D1823',
  mapBlocker: '#0B151F',
  footerColor: '#C0C0C0',
  // button:
  primaryBtnBgd: '#0F9668',
  primaryBtnActBgd: '#13B17B',
  primaryBtnColor: '#FFFFFF',
  primaryBtnActColor: '#FFFFFF',
  primaryBtnBgdHover: '#13B17B',
  primaryBtnRadius: '2px',
  secondaryBtnBgd: '#6A7485',
  secondaryBtnActBgd: '#A0A7B4',
  secondaryBtnColor: '#FFFFFF',
  secondaryBtnActColor: '#FFFFFF',
  secondaryBtnBgdHover: '#A0A7B4',
  linkBtnBgd: 'transparent',
  linkBtnActBgd: 'transparent',
  linkBtnColor: '#A0A7B4',
  linkBtnActColor: '#3A414C',
  linkBtnActBgdHover: 'transparent',
  negativeBtnBgd: errorColor,
  negativeBtnActBgd: '#FF193E',
  negativeBtnBgdHover: '#FF193E',
  negativeBtnColor: '#FFFFFF',
  negativeBtnActColor: '#FFFFFF'
};
