// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

const TileIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  cursor: pointer;
`;

type TileIconProps = {
  selected?: boolean;
};

const TileIcon = styled.div<TileIconProps>`
  background-color: ${props => props.theme.GREY10};
  color: ${props => (props.selected ? props.theme.BLUE : props.theme.AZURE200)};
`;

type TilesetIconProps = {
  Icon: React.ReactNode;
  name: string;
  onClick: () => void;
  selected?: boolean;
};

const TilesetIcon: React.FC<TilesetIconProps> = ({Icon, name, onClick, selected = false}) => (
  <TileIconContainer onClick={onClick}>
    <TileIcon selected={selected}>{Icon}</TileIcon>
    <div>{name}</div>
  </TileIconContainer>
);

export default TilesetIcon;
