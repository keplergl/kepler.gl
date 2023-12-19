// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {MouseEventHandler} from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';

import {Button} from '../../common/styled-components';

const StyledHowToButton = styled.div`
  position: absolute;
  right: 12px;
  top: -4px;
`;

export type HowToButtonProps = {
  onClick: MouseEventHandler;
};

export const HowToButton: React.FC<HowToButtonProps> = ({onClick}: HowToButtonProps) => (
  <StyledHowToButton>
    <Button link small onClick={onClick}>
      <FormattedMessage id={'layerConfiguration.howTo'} />
    </Button>
  </StyledHowToButton>
);

export default HowToButton;
