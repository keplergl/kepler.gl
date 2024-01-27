// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
