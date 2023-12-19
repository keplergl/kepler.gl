// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from '../base';

export default class BrightnessContrast extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-brightness-contrast'
  };

  render() {
    return (
      <Base {...this.props}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.381 2.28577H7.6191V3.42862H8.381V2.28577Z" />
          <path d="M13.7143 7.6191H12.5715V8.381H13.7143V7.6191Z" />
          <path d="M7.6191 12.5715H8.381V13.7143H7.6191V12.5715Z" />
          <path d="M3.42862 7.6191H2.28577V8.381H3.42862V7.6191Z" />
          <path d="M3.63645 4.22943L4.22137 3.6445L5.09876 4.52189L4.51383 5.10682L3.63645 4.22943Z" />
          <path d="M11.7725 3.64043L10.8951 4.51782L11.48 5.10274L12.3574 4.22535L11.7725 3.64043Z" />
          <path d="M10.8963 11.4812L11.4812 10.8963L12.3586 11.7737L11.7736 12.3586L10.8963 11.4812Z" />
          <path d="M3.42862 11.9645L4.34377 11.0477L4.95243 11.6589L4.03728 12.5715L3.42862 11.9645Z" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.09524 5.1493C6.65907 4.77256 7.32195 4.57148 8.00005 4.57148C8.90937 4.57148 9.78144 4.9327 10.4244 5.57569C11.0674 6.21867 11.4286 7.09074 11.4286 8.00005C11.4286 8.67816 11.2275 9.34104 10.8508 9.90486C10.4741 10.4687 9.9386 10.9081 9.31211 11.1676C8.68562 11.4271 7.99625 11.495 7.33117 11.3627C6.66609 11.2305 6.05518 10.9039 5.57569 10.4244C5.09619 9.94492 4.76965 9.33401 4.63736 8.66893C4.50507 8.00385 4.57297 7.31448 4.83247 6.68799C5.09197 6.06151 5.53142 5.52604 6.09524 5.1493ZM6.18178 9.81833C6.66402 10.3006 7.31807 10.5715 8.00005 10.5715V5.42862C7.31807 5.42862 6.66402 5.69954 6.18178 6.18178C5.69954 6.66401 5.42862 7.31807 5.42862 8.00005C5.42862 8.68204 5.69954 9.33609 6.18178 9.81833Z"
          />
        </svg>
      </Base>
    );
  }
}
