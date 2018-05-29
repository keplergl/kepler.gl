import React, {Component} from 'react';
// import {Link} from 'react-router';
import styled from 'styled-components';

import {HEADER_NAVS} from '../content';

const StyledLink = styled.a`
  line-height: 58px;
  color: #8d9ba3;
  text-transform: uppercase;
  margin-left: 40px;
  border-style: solid;
  border-width: 3px 0 0;
  border-color: transparent;
:hover {
  border-color: #8d9ba3;
}
`;

const StyledHeader = styled.div`
  max-width: 100%;
  padding: 0 24px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
  display: flex;
  
`;

export default class Header extends Component {
  render() {
    // const {isMenuOpen, opacity, toggleMenu} = this.props;

    return (
      <StyledHeader className="container stretch">
        <div className="links">
          {HEADER_NAVS.map((item, i) => (
            <StyledLink key={i} href={item.link}>
              {item.text}
            </StyledLink>
          ))}
        </div>
      </StyledHeader>
    );
  }
}
