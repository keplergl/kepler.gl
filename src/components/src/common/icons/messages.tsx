// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class Messages extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-messages'
  };

  render() {
    return (
      <Base {...this.props}>
        <path d="M52 10H12a8 8 0 0 0-8 8v20a8 8 0 0 0 8 8h4v7c0 .567.455 1 .964 1 .17 0 .345-.031.512-.121L32 46h20a8 8 0 0 0 8-8V18a8 8 0 0 0-8-8zm-8 24H20v-4h24v4zm4-8H16v-4h32v4z" />
      </Base>
    );
  }
}
