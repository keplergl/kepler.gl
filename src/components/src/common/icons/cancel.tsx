// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Cancel extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-cancel'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M16.7240288,20.6999691 C14.3839567,23.8581781 13,27.7674688 13,32 C13,42.4934102 21.5065898,51 32,51 C36.2325312,51 40.1418219,49.6160433 43.3000309,47.2759712 L16.7240288,20.6999691 Z M20.2014265,17.106299 L46.893701,43.7985735 C49.4645783,40.5576433 51,36.4581301 51,32 C51,21.5065898 42.4934102,13 32,13 C27.5418699,13 23.4423567,14.5354217 20.2014265,17.106299 Z M32,56 C18.745166,56 8,45.254834 8,32 C8,18.745166 18.745166,8 32,8 C45.254834,8 56,18.745166 56,32 C56,45.254834 45.254834,56 32,56 Z" />
      </Base>
    );
  }
}
