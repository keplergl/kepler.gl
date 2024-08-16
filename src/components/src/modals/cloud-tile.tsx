// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import {Logout, Login} from '../common/icons';
import {CenterVerticalFlexbox, Button, CheckMark} from '../common/styled-components';
import {Provider, CloudUser} from '@kepler.gl/cloud-providers';
import {useCloudListProvider} from '../hooks/use-cloud-list-provider';

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
  position: relative;
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
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
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

const NewTag = styled.div`
  width: 37px;
  height: 19px;
  display: flex;
  align-content: center;
  justify-content: center;
  border-radius: 8px;
  padding: 4px 8px;
  background-color: #EDE9F9;
  color: #8863F8;
  position: absolute;
  left: 35%;
  top: -8px
  z-index: 500;
  font-size: 11px;
  line-height: 10px;
`;

export const StyledWarning = styled.span`
  color: ${props => props.theme.errorColor};
  font-weight: ${props => props.theme.selectFontWeightBold};
`;

interface CloudTileProps {
  actionName?: string | null;
  // cloud provider class
  provider: Provider;
}

/**
 * this component display a provider and allows users to select and set the current provider
 * @param provider
 * @param actionName
 * @constructor
 */
const CloudTile: React.FC<CloudTileProps> = ({provider, actionName}) => {
  const [user, setUser] = useState<CloudUser | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {provider: currentProvider, setProvider} = useCloudListProvider();
  const isSelected = provider === currentProvider;

  useEffect(() => {
    if (!provider) {
      return;
    }
    setError(null);
    setIsLoading(true);
    setError(null);
    provider
      .getUser()
      .then(setUser)
      .catch(setError)
      .finally(() => {
        setError(null);
        setIsLoading(false);
      });
  }, [provider]);

  const onLogin = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const user = await provider.login();
      setUser(user);
      setProvider(provider);
    } catch (error) {
      setError(error as Error);
    }
    setIsLoading(false);
  }, [provider, setProvider]);

  const onSelect = useCallback(async () => {
    if (isLoading) {
      return;
    }
    if (user) {
      setProvider(provider);
      return;
    }
    try {
      await onLogin();
      setProvider(provider);
    } catch (err) {
      setError(err as Error);
      setProvider(null);
    }
  }, [setProvider, provider, user, isLoading, onLogin]);

  const onLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await provider.logout();
    } catch (error) {
      setError(error as Error);
    }
    setIsLoading(false);
    setUser(null);
    setProvider(null);
  }, [provider, setProvider]);

  const {displayName, name} = provider;

  return (
    <StyledBox>
      {provider.isNew ? <NewTag>New</NewTag> : null}
      <div />
      <StyledTileWrapper onClick={onSelect} selected={isSelected}>
        <StyledCloudName>{displayName || name}</StyledCloudName>
        {provider.icon ? <provider.icon height="64px" /> : null}
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <>{user ? <StyledUserName>{actionName || user.name}</StyledUserName> : null}</>
        )}
        {isSelected ? <CheckMark /> : null}
      </StyledTileWrapper>
      {user || error ? <LogoutButton onClick={onLogout} /> : <LoginButton onClick={onLogin} />}
      {error ? <StyledWarning>{error.message}</StyledWarning> : null}
    </StyledBox>
  );
};

export default CloudTile;
