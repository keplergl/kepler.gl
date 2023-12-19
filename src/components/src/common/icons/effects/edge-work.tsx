// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from '../base';

export default class EdgeWork extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-edge-work'
  };

  render() {
    return (
      <Base {...this.props}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_129_11274)">
            <path d="M4.06642 1.90479L1.90479 6.33314L2.53682 6.64166L4.11683 3.40484L5.98457 6.65718L8.0826 3.33597L10.0205 6.71046L11.7371 3.38925L13.4983 6.45609L14.1082 6.10584L11.7045 1.92037L9.98798 5.24157L8.11129 1.97365L6.01326 5.29486L4.06642 1.90479Z" />
            <path d="M4.06593 5.36231L6.01361 9.09299L8.11163 5.43967L9.98765 9.03309L11.7042 5.37976L14.1026 9.97369L13.4791 10.2992L11.7374 6.96301L10.0208 10.6163L8.08225 6.9031L5.98423 10.5564L4.11732 6.98045L2.55385 10.5037L1.91099 10.2184L4.06593 5.36231Z" />
            <path d="M4.06642 9.28959L6.01326 12.6797L8.11129 9.35845L9.98798 12.6264L11.7045 9.30517L14.1082 13.4906L13.4983 13.8409L11.7371 10.7741L10.0205 14.0953L8.0826 10.7208L5.98457 14.042L4.11683 10.7896L2.53682 14.0265L1.90479 13.7179L4.06642 9.28959Z" />
          </g>
          <defs>
            <clipPath id="clip0_129_11274">
              <rect width="16" height="16" />
            </clipPath>
          </defs>
        </svg>
      </Base>
    );
  }
}
