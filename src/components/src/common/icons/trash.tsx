// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Trash extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-trash'
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.09647 1.76979C6.21891 1.64735 6.38496 1.57857 6.55811 1.57857H9.4424C9.61554 1.57857 9.7816 1.64735 9.90404 1.76979C10.0265 1.89222 10.0953 2.05828 10.0953 2.23143V2.88429H5.90525V2.23143C5.90525 2.05828 5.97404 1.89222 6.09647 1.76979ZM4.32668 2.88429V2.23143C4.32668 1.63962 4.56178 1.07204 4.98025 0.65357C5.39873 0.235096 5.9663 0 6.55811 0H9.4424C10.0342 0 10.6018 0.235096 11.0203 0.65357C11.4387 1.07204 11.6738 1.63962 11.6738 2.23143V2.88429L14.4896 2.88429C14.9256 2.88429 15.2789 3.23766 15.2789 3.67357C15.2789 4.10948 14.9256 4.46286 14.4896 4.46286H13.837V13.7686C13.837 14.3604 13.6019 14.928 13.1835 15.3464C12.765 15.7649 12.1974 16 11.6056 16H4.3949C3.80308 16 3.23551 15.7649 2.81704 15.3464C2.39856 14.928 2.16347 14.3604 2.16347 13.7686V4.46286H1.51035C1.07444 4.46286 0.721069 4.10948 0.721069 3.67357C0.721069 3.23766 1.07444 2.88429 1.51035 2.88429L4.32668 2.88429ZM3.74204 13.7686V4.46286H12.2585V13.7686C12.2585 13.9417 12.1897 14.1078 12.0673 14.2302C11.9448 14.3526 11.7788 14.4214 11.6056 14.4214H4.3949C4.22175 14.4214 4.05569 14.3526 3.93326 14.2302C3.81082 14.1078 3.74204 13.9417 3.74204 13.7686Z"
        />
      </Base>
    );
  }
}
