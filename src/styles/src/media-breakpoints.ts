// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {css} from 'styled-components';

// These are useful for test or when theme doesn't define them
export const breakPointValues = {
  palm: 588,
  desk: 768
};

/**
 * Contains media rules for different device types
 * @namespace
 * @property {object}  media
 * @property {string}  media.palm - rule for palm devices
 * @property {string}  media.portable - rule for portable devices
 * @property {string}  media.desk - rule for desktops
 */

export const media = {
  palm: (first, ...args) => css`
    @media (max-width: ${props => (props.theme.breakPoints || breakPointValues).palm}px) {
      ${css(first, ...args)};
    }
  `,

  portable: (first, ...args) => css`
    @media (max-width: ${props => (props.theme.breakPoints || breakPointValues).desk}px) {
      ${css(first, ...args)};
    }
  `,

  desk: (first, ...args) => css`
    @media (min-width: ${props => (props.theme.breakPoints || breakPointValues).desk + 1}px) {
      ${css(first, ...args)};
    }
  `
};
