// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class AnnotationText extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-annotation-text'
  };

  render() {
    return (
      <Base viewBox="0 0 64 64" {...this.props}>
        <text
          x="4"
          y="48"
          fontSize="42"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          fill="currentColor"
        >
          A
        </text>
        <text
          x="36"
          y="48"
          fontSize="42"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          fill="currentColor"
        >
          a
        </text>
      </Base>
    );
  }
}
