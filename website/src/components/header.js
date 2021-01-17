// Copyright (c) 2021 Uber Technologies, Inc.
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
