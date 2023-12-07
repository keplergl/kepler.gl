// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {css} from 'styled-components';

export const breakPoints = {
  palm: 588,
  desk: 768
};

export const media = {
  palm: (...args) => css`
    @media (max-width: ${breakPoints.palm}px) {
      ${css(...args)};
    }
  `,

  portable: (...args) => css`
    @media (max-width: ${breakPoints.desk}px) {
      ${css(...args)};
    }
  `,

  desk: (...args) => css`
    @media (min-width: ${breakPoints.desk + 1}px) {
      ${css(...args)};
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
  primaryBtnBgd: '#005CD2',
  primaryBtnActBgd: '#13B17B',
  primaryBtnColor: '#FFFFFF',
  primaryBtnActColor: '#FFFFFF',
  primaryBtnBgdHover: '#1f7cf4',
  primaryBtnRadius: '2px',
  secondaryBtnBgd: '#6A7485',
  secondaryBtnActBgd: '#A0A7B4',
  secondaryBtnColor: '#FFFFFF',
  secondaryBtnActColor: '#FFFFFF',
  secondaryBtnBgdHover: '#A0A7B4',
  outlineBtnBgd: 'transparent',
  outlineBtnBgdHover: 'rgba(0, 0, 0, 0.05)',
  outlineBtnActColor: '#000000',
  outlineBtnColor: '#000000',
  outlineDarkBtnBgd: 'transparent',
  outlineDarkBtnBgdHover: 'rgba(255, 255, 255, 0.05)',
  outlineDarkBtnActColor: '#ffffff',
  outlineDarkBtnColor: '#ffffff',
  linkBtnBgd: 'transparent',
  linkBtnActBgd: 'transparent',
  linkBtnColor: '#A0A7B4',
  linkBtnActColor: '#3A414C',
  linkBtnActBgdHover: 'transparent',
  negativeBtnBgd: errorColor,
  negativeBtnActBgd: '#FF193E',
  negativeBtnBgdHover: '#FF193E',
  negativeBtnColor: '#FFFFFF',
  negativeBtnActColor: '#FFFFFF',
  btnTransition: '350ms color, 350ms background',
  linkColor: '#A0A7B4',
  darkBackgroundColor: '#242730',
  margins: {
    tiny: '0.5rem',
    small: '1.0rem',
    medium: '1.5rem',
    large: '2.0rem',
    huge: '2.5rem'
  }
};
