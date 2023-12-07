// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base, {BaseProps} from './base';

export default class WarningSign extends Component<Partial<BaseProps>> {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-warning-sign',
    stroke: '#FFF'
  };

  render() {
    return (
      <Base viewBox="0 0 16 16" {...this.props} stroke="none">
        <path
          d="M15.6753 12.0189L10.017 1.60205C9.58989 0.88311 8.83564 0.453735 7.99939 0.453735C7.16314 0.453735 6.40889 0.88311 5.98183 1.60205C5.97861 1.60755 5.97589 1.61305 5.97267 1.61855L0.33317 12.0024C-0.103049 12.7365 -0.111299 13.6181 0.310701 14.3604C0.73367 15.1032 1.49567 15.5463 2.35026 15.5463H13.6173C14.4719 15.5463 15.2652 15.1032 15.6881 14.3604C16.1101 13.6181 16.1019 12.7365 15.6753 12.0189ZM7.06095 5.22339C7.06095 4.70508 7.48111 4.28495 7.99939 4.28495C8.5177 4.28495 8.93783 4.70511 8.93783 5.22339V8.97717C8.93783 9.49542 8.51767 9.91561 7.99939 9.91561C7.48111 9.91561 7.06095 9.49539 7.06095 8.97717V5.22339ZM7.99939 13.6694C7.22317 13.6694 6.5917 13.038 6.5917 12.2617C6.5917 11.4855 7.22314 10.8541 7.99939 10.8541C8.77561 10.8541 9.40705 11.4855 9.40705 12.2617C9.40708 13.038 8.77564 13.6694 7.99939 13.6694Z"
          fill="#F5B766"
        />
        <circle cx="8" cy="12.2773" r="1.43359" fill="#121621" />
        <path
          d="M8 4.28125C8.51992 4.28125 8.94141 4.70273 8.94141 5.22266V8.97266C8.94141 9.49258 8.51992 9.91406 8 9.91406C7.48008 9.91406 7.05859 9.49258 7.05859 8.97266V5.22266C7.05859 4.70273 7.48008 4.28125 8 4.28125Z"
          fill="#121621"
        />
      </Base>
    );
  }
}
