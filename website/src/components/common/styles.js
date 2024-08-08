// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';

import styled from 'styled-components';
import {media} from '../../styles';
import {cdnUrl} from '../../utils';

export const StyledCaption = styled.div`
  max-width: unset;
  text-align: center;
  margin-bottom: 32px;
  margin-top: 6rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${media.palm`
    width: auto;
    padding-top: 0;
    margin-right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0px;
  `} .kg-home__caption__subtitle {
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 20px;
    line-height: 1.3;

    ${media.palm`
      font-size: 20px;
    `};
  }

  .kg-home__caption__description {
    font-size: 14px;
    color: ${props => props.theme.labelColor};
    line-height: 24px;
    margin-bottom: 32px;
    max-width: 400px;

    span.t-bold {
      color: ${props => props.theme.textColor};
      font-weight: 500;
    }

    ${media.palm`
      margin-bottom: 32px;
      text-align: center;
      font-size: 12px;
    `};
  }
`;

export const BackgroundImage = styled.img`
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 70%;
  object-fit: cover;
  background: #0f1d29;
`;

export const Container = styled.div`
  padding: ${props => props.theme.margins.huge};
  color: white;
  position: relative;

  ${media.palm`
    padding-top: ${props => props.theme.margins.large};
  `};
`;

export const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${media.palm`
    margin-top: 3rem;
  `};
`;

export const Logo = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 120px;
  ${media.palm`
    position: inherit;
    margin-top: ${props => props.theme.margins.normal};
    margin-bottom: ${props => props.theme.margins.small};
  `};
`;

/* eslint-disable react/display-name */
export const HeroImage = React.forwardRef((props, ref) => (
  <BackgroundImage {...props} ref={ref} src={cdnUrl('hero/kepler.gl-background.png')} />
));

export const LogoImage = React.forwardRef(props => (
  <Logo {...props} src={cdnUrl('icons/kepler.gl-logo.png')} />
));
/* eslint-enable react/display-name */
