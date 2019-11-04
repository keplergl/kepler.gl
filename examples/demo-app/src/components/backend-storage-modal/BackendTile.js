import React from 'react';
import styled from 'styled-components';
import LogoutIcon from '../icons/logout-icon';

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
  border: 1px solid ${props => props.isConnected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT};
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

const StyledLogoutIconOption = styled(LogoutIcon)`
  margin-right: 6px;
  vertical-align: text-top;
`;

const noop = () => {};

const BackendTile = ({
  Icon,
  isConnected,
  onConnect,
  onLogout
}) => (
  <StyledTile>
    <StyledTileButton onClick={isConnected() ? noop : onConnect} isConnected={isConnected()}>
      <Icon height="88px" />
      {isConnected() && <StyledLabel>Connected</StyledLabel>}
    </StyledTileButton>

    {isConnected() &&
      <StyledManageOption onClick={onLogout}>
        <StyledLogoutIconOption />
        Logout
      </StyledManageOption>
    }
  </StyledTile>
);

export default BackendTile;
