// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Simplified Google Drive mark (public domain geometry), adapted for IconWrapper.
import React, {Component} from 'react';
import {Icons} from '@kepler.gl/components';
import PropTypes from 'prop-types';

export default class GoogleDriveIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-google-drive',
    totalColor: 1
  };

  render() {
    return (
      <Icons.IconWrapper {...this.props} viewBox="0 0 87.3 78">
        <path
          d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z"
          fill="#0066da"
        />
        <path
          d="M43.65 25L29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.2 48.35c-.8 1.4-1.2 2.95-1.2 4.5h27.5L43.65 25z"
          fill="#00ac47"
        />
        <path
          d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.85l5.25 9.1 8.45 14.7z"
          fill="#ea4335"
        />
        <path
          d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2L43.65 25z"
          fill="#00832d"
        />
        <path
          d="M59.85 53H27.5l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2L59.85 53z"
          fill="#2684fc"
        />
        <path
          d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.2 28h27.45c0-1.55-.4-3.1-1.2-4.5l-12.7-22z"
          fill="#ffba00"
        />
      </Icons.IconWrapper>
    );
  }
}
