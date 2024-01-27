// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
