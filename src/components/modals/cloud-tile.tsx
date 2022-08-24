// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {ReactNode} from 'react';
import styled from 'styled-components';
import {Logout, Login} from 'components/common/icons';
import {CenterVerticalFlexbox, Button, CheckMark} from 'components/common/styled-components';
import LoadingSpinner from 'components/common/loading-spinner';
import {Provider} from '@kepler.gl/cloud-providers';

interface StyledTileWrapperProps {
  selected?: boolean;
}

const StyledTileWrapper = styled.div.attrs({
  className: 'provider-tile__wrapper'
})<StyledTileWrapperProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 2px;
  border: 1px solid
    ${props => (props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT)};
  color: ${props => (props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT)};
  cursor: pointer;
  font-weight: 500;
  width: 120px;
  height: 168px;
  background-color: #ffffff;
  transition: ${props => props.theme.transition};
  position: relative;
  :hover {
    border: 1px solid ${props => props.theme.primaryBtnBgd};
    color: ${props => props.theme.primaryBtnBgd};
  }

  .button {
    margin-top: 20px;
  }
`;

const StyledBox = styled(CenterVerticalFlexbox)`
  margin-right: 12px;
`;

const StyledCloudName = styled.div`
  font-size: 12px;
  margin-top: 12px;
  margin-bottom: 4px;
`;

const StyledUserName = styled.div`
  font-size: 11px;
  margin-top: 8px;
  text-align: center;
  color: ${props => props.theme.primaryBtnActBgd};
  overflow: hidden;
  width: 100px;
  text-overflow: ellipsis;
`;

interface OnClickProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const LoginButton = ({onClick}: OnClickProps) => (
  <Button className="login-button" link small onClick={onClick}>
    <Login />
    Login
  </Button>
);

const LogoutButton = ({onClick}: OnClickProps) => (
  <Button className="logout-button" link small onClick={onClick}>
    <Logout />
    Logout
  </Button>
);

interface ActionButtonProps {
  isConnected?: boolean;
  actionName?: ReactNode | null;
  isReady?: boolean;
}

const ActionButton = ({isConnected, actionName = null, isReady}: ActionButtonProps) =>
  isConnected && actionName ? (
    <Button className="cloud-tile__action" small secondary disabled={!isReady}>
      {isReady ? actionName : <LoadingSpinner size={12} />}
    </Button>
  ) : null;

interface CloudTileProps {
  onSelect?: React.MouseEventHandler<HTMLDivElement>;
  // default to login
  onConnect?: React.MouseEventHandler<HTMLDivElement> | null;
  // default to logout
  onLogout?: React.MouseEventHandler<HTMLDivElement> | null;
  // action name
  actionName?: ReactNode | null;
  // cloud provider class
  cloudProvider: Provider;
  // function to take after login or logout
  onSetCloudProvider;
  // whether provider is selected as currentProvider
  isSelected?: boolean;
  // whether user has logged in
  isConnected?: boolean;
  isReady?: boolean;
}

const CloudTile: React.FC<CloudTileProps> = ({
  // action when click on the tile
  onSelect,
  // default to login
  onConnect = null,
  // default to logout
  onLogout = null,
  // action name
  actionName = null,
  // cloud provider class
  cloudProvider,
  // function to take after login or logout
  onSetCloudProvider,
  // whether provider is selected as currentProvider
  isSelected,
  // whether user has logged in
  isConnected,

  isReady = true
}) => {
  const userName =
    typeof cloudProvider.getUserName === 'function' ? cloudProvider.getUserName() : null;

  const onClickConnect =
    typeof onConnect === 'function'
      ? onConnect
      : () => cloudProvider.login(() => onSetCloudProvider(cloudProvider.name));

  const onClickLogout =
    typeof onLogout === 'function'
      ? onLogout
      : () => cloudProvider.logout(() => (isSelected ? onSetCloudProvider(null) : null));

  return (
    <StyledBox>
      <StyledTileWrapper onClick={isConnected ? onSelect : onClickConnect} selected={isSelected}>
        <StyledCloudName>{cloudProvider.displayName || cloudProvider.name}</StyledCloudName>
        {cloudProvider.icon ? <cloudProvider.icon height="64px" /> : null}
        <ActionButton isConnected={isConnected} actionName={actionName} isReady={isReady} />
        {userName && <StyledUserName>{userName}</StyledUserName>}
        {isSelected && <CheckMark />}
      </StyledTileWrapper>
      {isConnected ? (
        <LogoutButton onClick={onClickLogout} />
      ) : (
        <LoginButton onClick={onClickConnect} />
      )}
    </StyledBox>
  );
};

export default CloudTile;
