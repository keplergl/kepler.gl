// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import styled from 'styled-components';

import {HEADER_NAVS} from '../content';
import {media} from '../styles';

const StyledLink = styled.a`
  color: ${props => props.theme.navLinkColor};
  text-transform: uppercase;
  transition: color 500ms;

  &:hover {
    color: white;
    cursor: pointer;
  }

  ${media.palm`
    font-size: 12px;
    line-height: 16px;
  `};
`;

const StyledLogo = styled.a`
  height: 24px;
  width: 84px;
  background-image: url('/openjs-foundation.svg');
  background-repeat: no-repeat;
  background-size: 84px 24px;
  display: flex;

  ${media.palm`
    height: 18px;
    width: 76px;
    background-size: 76px 18px;
  `};
`;

const StyledHeader = styled.div`
  max-width: 100%;
  padding: 0 36px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
  position: absolute;
  background: transparent;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;

  .links {
    margin-top: ${props => props.theme.margins.huge};
    display: flex;
    align-items: center;
    gap: 32px;
    text-align: center;
  }

  .icon-github:before {
    content: '\\e904';
  }

  ${media.portable`
    position: fixed;
    flex-direction: column;
    padding: 16px 36px;
    background: ${props => props.theme.darkBackgroundColor};

    .links {
      margin-top: 0;
      gap: 8px;
      justify-content: space-between;
    }
  `};

  ${media.palm`
    padding: 16px 24px;
  `};
`;

export default class Header extends Component {
  render() {
    // const {isMenuOpen, opacity, toggleMenu} = this.props;

    return (
      <StyledHeader className="container stretch">
        <div className="links">
          {HEADER_NAVS.map((item, i) => (
            <StyledLink key={i} href={item.link} target="_blank">
              {item.text}
            </StyledLink>
          ))}
          <StyledLogo href="https://openvisualization.org" target="_blank"/>
        </div>
      </StyledHeader>
    );
  }
}
