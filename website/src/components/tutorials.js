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

import {media} from '../styles';
import {TUTORIALS} from '../content';
import {HorizontalCard} from './common/card';
import StaggeredScrollAnimation from './common/staggered-scroll-animation';
import {LinkButton, CenteredContent} from './common/styled-components';

const Container = styled.div`
  margin: 0 auto;
  max-width: 1500px;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-gap: ${props => props.theme.margins.medium};
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  grid-auto-flow: dense;
  margin-bottom: ${props => props.theme.margins.large};
  ${media.palm`
    display: block;
  `};
`;

const StyledCardContainer = styled.a`
  display: block;
  color: black;
  cursor: pointer;
  transition: transform 350ms;
  :hover {
    transform: scale3d(1.05, 1.05, 1.05);
  }
  ${media.palm`
    margin-bottom:  ${props => props.theme.margins.small};
  `};
`;

const CardContainer = ({linkUrl, children}) => (
  <StyledCardContainer href={linkUrl} target="_blank">
    {children}
  </StyledCardContainer>
);

class Tutorials extends PureComponent {
  render() {
    return (
      <Container>
        <StaggeredScrollAnimation Container={CardsContainer}>
          {TUTORIALS.map(({title, description, image, url}, i) => (
            <CardContainer linkUrl={url} key={`tutorial-${i}`}>
              <HorizontalCard
                title={title}
                description={description}
                image={image}
                linkText="Read Now"
              />
            </CardContainer>
          ))}
        </StaggeredScrollAnimation>
        <CenteredContent>
          <LinkButton outline large target="_blank" href="https://medium.com/vis-gl">
            Read More
          </LinkButton>
        </CenteredContent>
      </Container>
    );
  }
}

export default Tutorials;
