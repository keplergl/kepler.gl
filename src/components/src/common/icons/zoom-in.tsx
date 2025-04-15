// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class ZoomIn extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    viewBox: '0 0 16 16',
    predefinedClassName: 'data-ex-icons-zoom-in'
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.85938 3.84995C7.85938 3.49097 7.56836 3.19995 7.20937 3.19995C6.85039 3.19995 6.55938 3.49097 6.55938 3.84995V6.54449H3.84995C3.49097 6.54449 3.19995 6.83551 3.19995 7.19449C3.19995 7.55348 3.49097 7.84449 3.84995 7.84449H6.55937V10.55C6.55937 10.9089 6.85039 11.2 7.20937 11.2C7.56836 11.2 7.85937 10.9089 7.85937 10.55V7.84449H10.55C10.9089 7.84449 11.2 7.55348 11.2 7.19449C11.2 6.83551 10.9089 6.54449 10.55 6.54449H7.85938V3.84995Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.1 7.2C12.1 9.90619 9.90619 12.1 7.2 12.1C4.4938 12.1 2.3 9.90619 2.3 7.2C2.3 4.4938 4.4938 2.3 7.2 2.3C9.90619 2.3 12.1 4.4938 12.1 7.2ZM11.0938 12.0251C10.0295 12.885 8.67487 13.4 7.2 13.4C3.77583 13.4 1 10.6242 1 7.2C1 3.77583 3.77583 1 7.2 1C10.6242 1 13.4 3.77583 13.4 7.2C13.4 8.68104 12.8807 10.0408 12.0143 11.1071L14.7721 13.8649C15.0259 14.1187 15.0259 14.5303 14.7721 14.7841C14.5182 15.038 14.1067 15.038 13.8528 14.7841L11.0938 12.0251Z"
        />
      </Base>
    );
  }
}
