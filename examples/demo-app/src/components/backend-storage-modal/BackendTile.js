import React from 'react';
import styled from 'styled-components';

const StyledLabel = styled.div`
  font-weight: 600;
  color: ${props => props.theme.primaryBtnBgd};
`;

const StyledTile = styled.div`
  margin: 0 12px 12px 0;
`;

const StyledTileButton = styled.button`
  width: 124px;
  height: 124px;
  margin-bottom: 12px;
  border: 1px solid ${props => props.theme.selectBorderColorLT};
  background-color: #fff;
  cursor: pointer;
  padding: 0;
  outline: 0;
  pointer-events: ${props => props.isConnected ? 'none' : 'auto'}

  :hover {
    border-color: ${props => props.theme.primaryBtnBgd};
  }
`;

const StyledManageOption = styled.a`
  display: block;
  cursor: pointer;
  margin-bottom: 6px;
  color: ${props => props.theme.textColorLT};
  font-size: 11px;
  font-weight: 600;
`;

const noop = () => {};

const BackendTile = ({
  Icon,
  isConnected,
  onConnect,
  onManageStorage,
  onLogout
}) => (
  <StyledTile>
    <StyledTileButton onClick={isConnected() ? noop : onConnect} isConnected={isConnected()}>
      <Icon height="88px" />
      {isConnected() && <StyledLabel>Connected</StyledLabel>}
    </StyledTileButton>

    {isConnected() && <StyledManageOption onClick={onManageStorage}>Manage Storage</StyledManageOption>}
    {isConnected() && <StyledManageOption onClick={onLogout}>Logout</StyledManageOption>}
  </StyledTile>
);

export default BackendTile;
