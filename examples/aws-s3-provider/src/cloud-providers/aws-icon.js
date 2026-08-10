// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {Icons} from '@kepler.gl/components';
import PropTypes from 'prop-types';

/** Simplified AWS mark for the cloud provider tile. */
export default class AwsIcon extends Component {
  static propTypes = {
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-aws',
    totalColor: 1
  };

  render() {
    return (
      <Icons.IconWrapper {...this.props} viewBox="0 0 64 64">
        <path
          fill="#FF9900"
          d="M18.2 36.5c0 .4.1.7.3 1l8.2 9.6c.4.5 1.1.6 1.6.3.5-.4.6-1.1.3-1.6l-8.2-9.6c-.3-.4-.9-.5-1.3-.2-.5.3-.8.8-.9 1.5zm29.3-1.5c-.4-.3-1-.2-1.3.2l-8.2 9.6c-.4.5-.2 1.2.3 1.6.5.4 1.2.2 1.6-.3l8.2-9.6c.2-.3.3-.6.3-1 0-.7-.3-1.2-.9-1.5zM32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8zm0 44c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z"
        />
      </Icons.IconWrapper>
    );
  }
}
