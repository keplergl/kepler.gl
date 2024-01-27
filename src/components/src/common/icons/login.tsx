// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Login extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-login'
  };

  render() {
    return (
      <Base {...this.props}>
        <polygon
          id="Path"
          points="26.9730089 40.981391 30.7141656 44.7225477 44.0754395 31.3612739 30.7141656 18 26.9730089 21.7411567 33.9208713 28.6890191 8 28.6890191 8 34.0335286 33.9208713 34.0335286"
        />
        <path d="M50.7560765,8 L13.3445095,8 C10.4050293,8 8,10.4050293 8,13.3445095 L8,24.0335286 L13.3445095,24.0335286 L13.3445095,13.3445095 L50.7560765,13.3445095 L50.7560765,50.7560765 L13.3445095,50.7560765 L13.3445095,40.0670573 L8,40.0670573 L8,50.7560765 C8,53.6955566 10.4050293,56.1005859 13.3445095,56.1005859 L50.7560765,56.1005859 C53.6955566,56.1005859 56.1005859,53.6955566 56.1005859,50.7560765 L56.1005859,13.3445095 C56.1005859,10.4050293 53.6955566,8 50.7560765,8 Z" />
      </Base>
    );
  }
}
