// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import Base, {BaseProps} from './base';

export default class Picture extends React.Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-minus'
  };

  render() {
    return (
      <Base viewBox="0 0 64 64" {...this.props}>
        <path d="M55 8H9a1 1 0 0 0-1 1v46a1 1 0 0 0 1 1h46a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1zm-3 36H12V12h40v32zM40.508 25.75l8.217 11.05c.98 1.319.047 3.2-1.587 3.2H16.987c-1.863 0-2.698-2.356-1.257-3.547l6.012-4.966a1.97 1.97 0 0 1 2.513 0l3.859 3.187a1.973 1.973 0 0 0 2.843-.347l6.378-8.578a1.973 1.973 0 0 1 3.173 0zM26 21a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
      </Base>
    );
  }
}
