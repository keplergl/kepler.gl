// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import styled from 'styled-components';

import {cdnUrl} from '../utils';
import {LinkButton} from './common/styled-components';
import {media} from '../styles';
import MapboxLogo from './mapbox-logo';
import NetlifyLogo from './netlify-logo';
import FoursquareLogo from './foursquare-logo';
import {DEMO_DUCKDB_LINK, DEMO_LINK} from '../constants';

const Container = styled.div`
  background: #242730;
  padding: ${props => props.theme.margins.huge};
`;

const BrandingSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${media.portable`
    flex-direction: column;
    gap: 32px;
  `};
`;

const BrandingContainer = styled.div`
  ${media.portable`
    flex-direction: column;
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

const ButtonContainer = styled.div`
  display: flex;
  height: 48px;
  a {
    width: 160px;
  }

  ${media.portable`
    display: flex;
    justify-content: center;
    width: 100%;

    a {
      width: 50%;
    }
  `};
`;

const CopyrightSection = styled.div`
  display: flex;
  margin-top: 32px;

  ${media.palm`
    display: flex;
    justify-content: center;
    width: 100%;
    flex-direction: column;
  `};
`;

const CopyrightContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  color: ${props => props.theme.footerColor};
  text-align: center;

  a {
    color: ${props => props.theme.linkColor};
    text-decoration: underline;
  }

  p:first-child {
    margin-bottom: ${props => props.theme.margins.small};
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
        <BrandingSection>
          <BrandingContainer>
            <img style={{width: '120px'}} src={cdnUrl('icons/kepler.gl-logo.png')} />
            <ButtonContainer>
              <LinkButton large href={DEMO_LINK}>
                Get Started
              </LinkButton>
              <LinkButton
                large
                href={DEMO_DUCKDB_LINK}
                style={{marginLeft: '5px', backgroundColor: '#20469c'}}
              >
                Try with DuckDB
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
          </BrandingContainer>
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
        </BrandingSection>
        <CopyrightSection>
          <CopyrightContainer>
            <p>Copyright <a href="https://openjsf.org">OpenJS Foundation</a> and kepler.gl contributors. All rights reserved. The <a href="https://openjsf.org">OpenJS Foundation</a> has registered trademarks and uses trademarks. For a list of trademarks of the <a href="https://openjsf.org">OpenJS Foundation</a>, please see our <a href="https://trademark-policy.openjsf.org">Trademark Policy</a> and <a href="https://trademark-list.openjsf.org">Trademark List</a>. Trademarks and logos not indicated on the <a href="https://trademark-list.openjsf.org">list of OpenJS Foundation trademarks</a> are trademarks&trade; or registered&reg; trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.</p>
            <p><a href="https://openjsf.org">The OpenJS Foundation</a> | <a href="https://terms-of-use.openjsf.org">Terms of Use</a> | <a href="https://privacy-policy.openjsf.org">Privacy Policy</a> | <a href="https://bylaws.openjsf.org">Bylaws</a> | <a href="https://code-of-conduct.openjsf.org">Code of Conduct</a> | <a href="https://trademark-policy.openjsf.org">Trademark Policy</a> | <a href="https://trademark-list.openjsf.org">Trademark List</a> | <a href="https://www.linuxfoundation.org/cookies">Cookie Policy</a></p>
          </CopyrightContainer>
        </CopyrightSection>
      </Container>
    );
  }
}
