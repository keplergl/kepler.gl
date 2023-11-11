// Copyright (c) 2023 Uber Technologies, Inc.
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

import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import {Logout, Login} from '../common/icons';
import {CenterVerticalFlexbox, Button, CheckMark} from '../common/styled-components';
import {Provider} from '@kepler.gl/cloud-providers';
import {useCloudListProvider} from '../hooks/use-cloud-list-provider';
import {CloudUser} from '@kepler.gl/cloud-providers/src/provider';

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

interface CloudTileProps {
  actionName?: string | null;
  // cloud provider class
  provider: Provider;
}

const CloudTile: React.FC<CloudTileProps> = ({provider, actionName}) => {
  const [user, setUser] = useState<CloudUser | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {provider: currentProvider, setProvider} = useCloudListProvider();
  const isSelected = provider === currentProvider;

  useEffect(() => {
    if (provider.getAccessToken()) {
      setError(null);
      setIsLoading(true);
      setError(null);
      provider
        .getUser()
        .then(user => setUser(user))
        .catch(setError)
        .finally(() => setIsLoading(false));
    }
  }, [provider]);

  const login = useCallback(async () => {
    try {
      const user = await provider.login();
      setUser(user);
      setProvider(provider);
    } catch (error) {
      setError(error as Error);
    }
  }, [provider]);

  const select = useCallback(async () => {
    if (isLoading) {
      return;
    }
    if (!user) {
      await login();
    }
    setProvider(provider);
  }, [setProvider, provider, user, isLoading]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await provider.logout();
    } catch (error) {
      setError(error as Error);
    }
    setIsLoading(false);
    setUser(null);
    setProvider(null);
  }, [provider]);

  const {displayName, name} = provider;

  return (
    <StyledBox>
      <StyledTileWrapper onClick={select} selected={isSelected}>
        <StyledCloudName>{displayName || name}</StyledCloudName>
        {provider.icon ? <provider.icon height="64px" /> : null}
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <>{user ? <StyledUserName>{actionName || user.name}</StyledUserName> : null}</>
        )}
        {isSelected ? <CheckMark /> : null}
      </StyledTileWrapper>
      {user ? <LogoutButton onClick={logout} /> : <LoginButton onClick={login} />}
      {error ? <div>{error.message}</div> : null}
    </StyledBox>
  );
};

export default CloudTile;
