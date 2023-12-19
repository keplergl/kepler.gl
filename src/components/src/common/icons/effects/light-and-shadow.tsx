// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from '../base';

export default class LightAndShadow extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-light-and-shadow'
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.91925 7.57675C2.13661 4.40791 4.776 1.90479 8.00002 1.90479C11.3663 1.90479 14.0953 4.63372 14.0953 8.00002C14.0953 11.3663 11.3663 14.0953 8.00002 14.0953C4.74735 14.0953 2.08974 11.5475 1.91403 8.33866H1.90479V7.57675H1.91925ZM8.00002 12.4021V13.4701C6.784 13.4701 5.66065 13.0733 4.75239 12.4021H8.00002ZM8.00002 11.6402V10.3704H3.0688C3.29618 10.8426 3.58938 11.2771 3.9365 11.662V11.6402H8.00002ZM8.00002 9.60849V8.33866H2.54025C2.56708 8.77796 2.64576 9.20325 2.77025 9.60849H8.00002ZM8.00002 7.57675V6.3069H2.79701C2.66543 6.71153 2.57974 7.13686 2.54607 7.57675H8.00002ZM8.00002 2.52994V3.51325H4.87018C5.75697 2.8935 6.83604 2.52994 8.00002 2.52994ZM3.9941 4.27516H8.00002V5.54499H3.11048C3.34449 5.07982 3.64294 4.65264 3.9941 4.27516Z"
        />
      </Base>
    );
  }
}
