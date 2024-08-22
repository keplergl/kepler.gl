// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {Icons} from '@kepler.gl/components';
import {Auth0Client} from '@auth0/auth0-spa-js';
import {CLOUD_PROVIDERS_CONFIGURATION} from '../constants/default-settings';

const StyledBanner = styled.div`
  align-items: center;
  background-color: ${props => props.bgColor};
  color: ${props => props.fontColor};
  display: flex;
  height: ${props => props.height}px;
  justify-content: space-between;
  padding: 0 40px;
  position: absolute;
  transition: top 1s;
  width: 100%;
  z-index: 9999;

  svg:hover {
    cursor: pointer;
  }

  top: ${props => (props.visible ? 0 : -100)}px;
`;

const {FOURSQUARE_CLIENT_ID, FOURSQUARE_DOMAIN} = CLOUD_PROVIDERS_CONFIGURATION;

// eslint-disable-next-line no-unused-vars
const auth0 = new Auth0Client({
  domain: FOURSQUARE_DOMAIN,
  clientId: FOURSQUARE_CLIENT_ID,
  scope: FOURSQUARE_AUTH_SCOPE,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: FOURSQUARE_AUTH_AUDIENCE
  },
  cacheLocation: 'localstorage'
});

const Banner = ({
  bgColor = '#1F7CF4',
  fontColor = '#FFFFFF',
  height = 30,
  children,
  onClose,
  show
}) => (
  <StyledBanner
    className="top-banner"
    bgColor={bgColor}
    fontColor={fontColor}
    height={height}
    visible={show}
  >
    <div>{children}</div>
    <Icons.Delete height="14px" onClick={onClose} />
  </StyledBanner>
);

export default Banner;
