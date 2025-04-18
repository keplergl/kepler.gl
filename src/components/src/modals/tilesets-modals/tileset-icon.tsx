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
  color: ${props =>
    props.selected ? props.theme.primaryBtnBgdHover : props.theme.secondaryBtnBgd};
  opacity: ${props => (props.selected ? 1 : 0.5)};
`;

const TileLabel = styled.div<TileIconProps>`
  font-weight: ${props => (props.selected ? 'bold' : 'normal')};
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
    <TileLabel selected={selected}>{name}</TileLabel>
  </TileIconContainer>
);

export default TilesetIcon;
