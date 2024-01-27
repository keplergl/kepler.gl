// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import Base, {BaseProps} from './base';

export default class Files extends React.Component<Partial<BaseProps>> {
  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-files'
  };

  render() {
    return (
      <Base viewBox="0 0 64 64" {...this.props}>
        <path d="M48.015 58h-32a8 8 0 0 1-8-8V26h48v24a8 8 0 0 1-8 8zm-2-44h-28a6 6 0 0 0-6 6v2h40v-2a6 6 0 0 0-6-6zm-2 26v-6h-4v4h-16v-4h-4v6a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2zm-4-34h-16a4 4 0 0 0-4 4h24a4 4 0 0 0-4-4z" />
      </Base>
    );
  }
}
