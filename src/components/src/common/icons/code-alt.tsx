// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';

export default class CodeAlt extends Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-codealt'
  };

  render() {
    return (
      <Base viewBox="0 0 64 64" {...this.props}>
        <path d="M27.768 13.97v4.803a1.2 1.2 0 0 1-1.201 1.2H22.964v8.407a3.603 3.603 0 0 1-3.602 3.603 3.603 3.603 0 0 1 3.602 3.603v8.406H26.567a1.2 1.2 0 0 1 1.2 1.201v4.804a1.2 1.2 0 0 1-1.2 1.2h-6.005a4.804 4.804 0 0 1-4.803-4.803v-7.206a3.603 3.603 0 0 0-3.603-3.602H9.754a1.196 1.196 0 0 1-1.19-1.176h-.01v-4.829c0-.663.537-1.2 1.2-1.2h2.402a3.603 3.603 0 0 0 3.603-3.604v-7.205a4.804 4.804 0 0 1 4.803-4.804h6.005a1.2 1.2 0 0 1 1.2 1.201v.002zm27.584 21.616h-2.401a3.603 3.603 0 0 0-3.603 3.602v7.206a4.804 4.804 0 0 1-4.804 4.804H38.54a1.2 1.2 0 0 1-1.201-1.201V45.193c0-.663.537-1.2 1.2-1.2H42.143v-8.407a3.603 3.603 0 0 1 3.603-3.603 3.603 3.603 0 0 1-3.603-3.603v-8.406H38.54a1.2 1.2 0 0 1-1.201-1.201v-4.804c0-.663.537-1.2 1.2-1.2h6.005a4.804 4.804 0 0 1 4.804 4.803v7.205a3.603 3.603 0 0 0 3.603 3.603h2.401c.654 0 1.175.526 1.19 1.176h.011v4.829a1.2 1.2 0 0 1-1.2 1.2z" />
      </Base>
    );
  }
}
