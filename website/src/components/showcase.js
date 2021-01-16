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

import React, {PureComponent} from 'react';
import styled from 'styled-components';

import {SHOWCASE_ITEMS} from '../content';
import {media} from '../styles';
import Carousel from './common/carousel';

const CarouselContainer = styled.div`
  height: 360px;
  ${media.palm`
    height: 240px;
  `} ${media.desk`
    height: 480px;
  `};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25);
  object-fit: cover;

  width: 420px;
  height: 320px;

  ${media.palm`
    width: 300px;
    height: 200px;
  `} ${media.desk`
    width: 560px;
    height: 420px;
  `};
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const NavItem = styled.div`
  margin: ${props => props.theme.margins.tiny};
  font-size: 10px;
  text-align: center;
  filter: ${props => props.isActive && 'brightness(300%)'};
  transform: ${props => props.isActive && 'scale(1.1)'};
  transition: transform 500ms, filter 500ms;
  cursor: pointer;
  :hover {
    transform: scale(1.1);
  }

  ${media.palm`
    margin: 2px 4px;
    font-size: 8px;
  `};
`;

const NavIcon = styled.img`
  display: block;

  width: 48px;
  height: 48px;

  ${media.palm`
    width: 32px;
    height: 32px;
  `};
`;

const Nav = ({items, selectedIndex, onClick}) => (
  <NavContainer>
    {items.map(({text, icon}, i) => (
      <NavItem key={i} isActive={selectedIndex === i} onClick={() => onClick(i)}>
        <NavIcon src={icon} />
        {text}
      </NavItem>
    ))}
  </NavContainer>
);

class Showcase extends PureComponent {
  state = {
    selectedIndex: 3
  };

  render() {
    return (
      <div>
        <CarouselContainer>
          <Carousel
            selectedIndex={this.state.selectedIndex}
            onChange={i => this.setState({selectedIndex: i})}
          >
            {SHOWCASE_ITEMS.map(({image}, i) => (
              <Image key={`showcase-image-${i}`} src={image} />
            ))}
          </Carousel>
        </CarouselContainer>
        <Nav
          items={SHOWCASE_ITEMS}
          selectedIndex={this.state.selectedIndex}
          onClick={i => this.setState({selectedIndex: i})}
        />
      </div>
    );
  }
}

export default Showcase;
