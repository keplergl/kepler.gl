// Copyright (c) 2020 Uber Technologies, Inc.
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

import React from 'react';
import styled from 'styled-components';
import {Logout, Login} from 'components/common/icons';
import {
  CenterVerticalFlexbox,
  Button
} from 'components/common/styled-components';

const StyledTileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 2px;
  border: 1px solid
    ${props =>
      props.selected
        ? props.theme.primaryBtnBgd
        : props.theme.selectBorderColorLT};
  color: ${props =>
    props.selected
      ? props.theme.primaryBtnBgd
      : props.theme.selectBorderColorLT};
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

const CheckMark = styled.span.attrs({
  className: 'checkbox-inner'
})`
  background-color: ${props => props.theme.primaryBtnBgd};
  position: absolute;
  bottom: 0;
  right: 0;
  display: block;
  width: 16px;
  height: 16px;
  border-top-left-radius: 2px;

  :after {
    position: absolute;
    display: table;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg) scale(1) translate(-50%, -50%);
    opacity: 1;
    content: ' ';
    top: 50%;
    left: 25%;
    width: 5.7px;
    height: 9.1px;
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

const LoginButton = ({onClick}) => (
  <Button link small onClick={onClick}>
    <Login />
    Login
  </Button>
);

const LogoutButton = ({onClick}) => (
  <Button link small onClick={onClick}>
    <Logout />
    Logout
  </Button>
);

// eslint-disable-next-line complexity
const CloudTile = ({
  // action when click on the tile
  onSelect,
  // default to login
  onConnect,
  // default to logout
  onLogout,
  // action name
  actionName,
  // cloud provider class
  cloudProvider,
  // function to take after login or logout
  onSetCloudProvider,
  // whether provider is selected as currentProvider
  isSelected
}) => {
  const isConnected = Boolean(cloudProvider.getAccessToken());
  const userName =
    typeof cloudProvider.getUserName === 'function'
      ? cloudProvider.getUserName()
      : null;
  const onClickConnect =
    typeof onConnect === 'function'
      ? onConnect
      : () => cloudProvider.login(() => onSetCloudProvider(cloudProvider.name));

  const onClickLogout =
    typeof onLogout === 'function'
      ? onLogout
      : () => cloudProvider.logout(() => onSetCloudProvider(null));

  return (
    <StyledBox>
      <StyledTileWrapper
        onClick={isConnected ? onSelect : onClickConnect}
        selected={isSelected}
      >
        <StyledCloudName>
          {cloudProvider.displayName || cloudProvider.name}
        </StyledCloudName>
        {cloudProvider.icon ? <cloudProvider.icon height="64px" /> : null}
        {isConnected && actionName ? (
          <Button className="cloud-tile__action" small secondary>
            {actionName}
          </Button>
        ) : null}
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
