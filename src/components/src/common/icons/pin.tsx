// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import Base, {BaseProps} from './base';
import styled from 'styled-components';

const StyledBase = styled(Base)`
  transform: rotate(30deg);
`;

export default class Pin extends Component<Partial<BaseProps>> {
  static defaultProps = {
    size: 'tiny',
    predefinedClassName: 'data-ex-icons-pin'
  };

  render() {
    return (
      <StyledBase {...this.props}>
        <path d="M36 35.476V59a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V35.476C21.103 33.696 16 27.453 16 20c0-8.836 7.163-16 16-16s16 7.164 16 16c0 7.453-5.103 13.697-12 15.476z" />
      </StyledBase>
    );
  }
}
