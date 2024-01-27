// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import styled from 'styled-components';

import {HEADER_NAVS} from '../content';

const StyledLink = styled.a`
  line-height: 58px;
  color: #8d9ba3;
  text-transform: uppercase;
  margin-left: 40px;
  transition: color 500ms;
  display: inline-block;

  :hover {
    color: white;
    cursor: pointer;
  }
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
    margin-top: 20px;
  }

  .icon-github:before {
    content: '\\e904';
  }
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
        </div>
      </StyledHeader>
    );
  }
}
