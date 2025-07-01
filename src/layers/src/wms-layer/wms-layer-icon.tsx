// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {Base} from '../base';

class WMSLayerIcon extends Component {
  static propTypes = {
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string.isRequired)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'wms-layer-icon',
    totalColor: 2,
    viewBox: '0 0 30 30'
  };

  render(): JSX.Element {
    return (
      <Base {...this.props}>
        <g clipPath="url(#clip0_13806_131258)">
          <path
            d="M14.7595 12.2358L1 19.9828L15.2405 28L29 20.2536L14.7595 12.2358Z"
            fill="currentColor"
          />
          <path
            d="M14.7595 7.66919L1 15.4156L15.2405 23.4334L29 15.687L14.7595 7.66919Z"
            fill="#9DA0B9"
          />
          <path d="M14.7595 2L1 9.74639L15.2405 17.7636L29 10.0172L14.7595 2Z" fill="#BFC0D1" />
          <path d="M25.9696 10.8737H4.02124V19.267H25.9696V10.8737Z" fill="currentColor" />
          <path
            d="M5.51221 12.2358H6.77682L7.643 15.9522L8.58367 12.2358H9.64733L10.629 15.9725L11.5235 12.2358H12.6784L11.3341 17.6116H10.0637L9.0693 13.8953L8.05934 17.6116H6.85362L5.51221 12.2358Z"
            fill="white"
          />
          <path
            d="M13.4314 12.2358H15.0812L16.3689 15.5817L17.6393 12.2358H19.2561V17.6116H18.0146V13.8389L16.4884 17.6116H16.0796L14.5453 13.8389V17.6116H13.4314V12.2358Z"
            fill="white"
          />
          <path
            d="M20.1084 15.9274H21.3037C21.3574 16.4088 21.5659 16.8069 22.383 16.8069C22.9304 16.8069 23.293 16.5141 23.293 16.0929C23.293 15.6717 23.0621 15.5141 22.2536 15.3936C20.8429 15.2134 20.2643 14.7995 20.2643 13.7606C20.2643 12.8433 21.0508 12.1592 22.2692 12.1592C23.5107 12.1592 24.2354 12.7003 24.3353 13.7679H23.1851C23.1077 13.2792 22.8149 13.0539 22.2675 13.0539C21.7201 13.0539 21.4423 13.3017 21.4423 13.6626C21.4423 14.0461 21.6196 14.2257 22.4679 14.3468C23.8018 14.5123 24.4889 14.8659 24.4889 15.9797C24.4889 16.937 23.6874 17.6938 22.3841 17.6938C20.8718 17.6943 20.1777 17.0029 20.1084 15.9274Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_13806_131258">
            <rect width="28" height="26" fill="white" transform="translate(1 2)" />
          </clipPath>
        </defs>
      </Base>
    );
  }
}

export default WMSLayerIcon;
