// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import styled from 'styled-components';
import {FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton} from 'react-share';

import {cdnUrl} from '../utils';
import {LinkButton} from './common/styled-components';
import {media} from '../styles';
import MapboxLogo from './mapbox-logo';
import NetlifyLogo from './netlify-logo';
import FoursquareLogo from './foursquare-logo';
import {DEMO_LINK} from '../constants';

const Container = styled.div`
  background: #242730;
  padding: ${props => props.theme.margins.huge};
`;

const LogosContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${media.palm`
    flex-direction: column;
  `};
`;

const BrandingContainer = styled.div`
  ${media.palm`
    margin-top: ${props => props.theme.margins.small};
  `};

  display: flex;
  gap: 20px;
  align-items: center;
`;

const CreatedBy = styled.div`
  display: inline-flex;
  align-items: center;
  color: ${props => props.theme.footerColor};
  font-size: 11px;
  justify-content: center;
  letter-spacing: 0.5px;
  line-height: 14px;
  width: 100%;
  z-index: 101;
`;

const StyledLogo = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 4px;
  position: relative;
  margin-left: 1.8rem;
  margin-top: 0;
  margin-bottom: 0;

  a {
    color: #e5e5e4;
    letter-spacing: 2px;
  }

  :before {
    content: '';
    background: url(${cdnUrl('icons/viz_logo_bw.png')}) no-repeat;
    background-size: cover;
    height: 20px;
    width: 24px;
    position: absolute;
    top: -5px;
    left: -25px;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  margin-top: 32px;

  ${media.palm`
    display: flex;
    justify-content: center;
    width: 100%;
    flex-direction: column;
  `};
`;

const ButtonContainer = styled.div`
  display: flex;
  a {
    width: 160px;
  }

  ${media.palm`
    display: flex;
    justify-content: center;
    width: 100%;

    a {
      width: 50%;
    }
  `};
`;

const SocialContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;

  .SocialMediaShareButton {
    margin-right: 5px;
  }

  ${media.palm`
    display: flex;
    justify-content: center;
    margin-top: 12px;
    width: 100%;
  `};
`;

const GITHUB_BUTTON_STYLE = {marginLeft: '5px'};

export default class Footer extends PureComponent {
  render() {
    return (
      <Container>
        <LogosContainer>
          <img style={{width: '120px'}} src={cdnUrl('icons/kepler.gl-logo.png')} />
          <BrandingContainer>
            <img src={cdnUrl('icons/uber.svg')} />
            <MapboxLogo />
            <NetlifyLogo />
            <FoursquareLogo />
            <CreatedBy>
              created by
              <StyledLogo className="fg">
                <a target="_blank" rel="noopener noreferrer" href="http://vis.gl">
                  VIS.GL
                </a>
              </StyledLogo>
            </CreatedBy>
          </BrandingContainer>
        </LogosContainer>
        <ButtonSection>
          <ButtonContainer>
            <LinkButton large href={DEMO_LINK}>
              Get Started
            </LinkButton>
            <LinkButton
              large
              outlineDark
              href="https://github.com/keplergl/kepler.gl"
              style={GITHUB_BUTTON_STYLE}
            >
              <img src={cdnUrl('icons/github.svg')} /> Github
            </LinkButton>
          </ButtonContainer>
          <SocialContainer>
            <FacebookShareButton url="https://kepler.gl/">
              <FacebookIcon size={32} />
            </FacebookShareButton>{' '}
            <TwitterShareButton url="https://kepler.gl/" hashtags={['keplergl']}>
              <TwitterIcon size={32} />
            </TwitterShareButton>
          </SocialContainer>
        </ButtonSection>
      </Container>
    );
  }
}
