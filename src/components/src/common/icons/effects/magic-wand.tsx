// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from '../base';

export default class MagicWand extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '2 2 20 20',
    predefinedClassName: 'data-ex-icons-effects-magic-wand'
  };

  render() {
    return (
      <Base {...this.props}>
        <g clipPath="url(#clip0_129_11251)">
          <path d="M18.7071 16L10 7.29298C9.80957 7.11112 9.55636 7.00964 9.29301 7.00964C9.02967 7.00964 8.77645 7.11112 8.58599 7.29298L7.29299 8.58598C7.10576 8.77365 7.00061 9.02792 7.00061 9.29301C7.00061 9.5581 7.10576 9.81237 7.29299 10L15.9995 18.7071C16.1872 18.8943 16.4415 18.9994 16.7066 18.9994C16.9716 18.9994 17.2259 18.8943 17.4136 18.7071L18.7071 17.4138C18.8 17.321 18.8736 17.2108 18.9239 17.0895C18.9742 16.9682 19 16.8381 19 16.7068C19 16.5755 18.9742 16.4455 18.9239 16.3242C18.8736 16.2028 18.8 16.0929 18.7071 16ZM8.00004 9.29298L9.29299 8.00003L11.793 10.5L10.4997 11.7935L7.99969 9.29348L8.00004 9.29298ZM16.7066 18L11.2066 12.5005L12.5 11.2071L18 16.7071L16.7066 18Z" />
          <path d="M5.99999 11L5 12L5.99999 13L6.99998 12L5.99999 11Z" />
          <path d="M12 5.00001L11 6L12 6.99999L13 6L12 5.00001Z" />
          <path d="M5.99999 5.00001L5 6L5.99999 6.99999L6.99998 6L5.99999 5.00001Z" />
        </g>
        <defs>
          <clipPath id="clip0_129_11251">
            <rect width="16" height="16" transform="translate(4 4)" />
          </clipPath>
        </defs>{' '}
      </Base>
    );
  }
}
