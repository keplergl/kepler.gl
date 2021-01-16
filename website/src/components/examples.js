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

import {EXAMPLES} from '../content';
import {media} from '../styles';
import StaggeredScrollAnimation from './common/staggered-scroll-animation';
import {VerticalCard} from './common/card';
import {LinkButton, CenteredContent} from './common/styled-components';
import {DEMO_LINK} from '../constants';

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${props => props.theme.margins.large};
  ${media.palm`
    display: block;
  `};
`;

const StyledCardContainer = styled.a`
  display: block;
  margin: ${props => props.theme.margins.small};
  color: black;
  cursor: pointer;
  transition: transform 350ms;
  :hover {
    transform: scale3d(1.05, 1.05, 1.05);
  }
  ${media.palm`
    margin: 0px;
    margin-bottom: ${props => props.theme.margins.small}
  `};
`;

const CardContainer = ({linkUrl, children}) => (
  <StyledCardContainer href={linkUrl} target="_blank">
    {children}
  </StyledCardContainer>
);

class Examples extends PureComponent {
  render() {
    return (
      <div>
        <StaggeredScrollAnimation Container={CardsContainer}>
          {EXAMPLES.map(({title, description, image, url}, i) => (
            <CardContainer linkUrl={url} key={`example-${i}`}>
              <VerticalCard
                title={title}
                description={description}
                image={image}
                linkText="Explore Map"
              />
            </CardContainer>
          ))}
        </StaggeredScrollAnimation>
        <CenteredContent>
          <LinkButton outline large href={DEMO_LINK}>
            See More
          </LinkButton>
        </CenteredContent>
      </div>
    );
  }
}

export default Examples;
