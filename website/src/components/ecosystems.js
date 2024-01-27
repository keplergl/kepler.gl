// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import styled from 'styled-components';

import {ECOSYSTEM} from '../content';
import {media} from '../styles';
import StaggeredScrollAnimation from './common/staggered-scroll-animation';
import {GithubButton} from './common/styled-components';

const FeaturesContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${props => props.theme.margins.large};
`;

const FeatureContainer = styled.div`
  text-align: center;
  width: 350px;
  padding: 24px;
  margin: ${props => props.theme.margins.small};
  display: flex;
  flex-direction: column;
  align-items: center;
  ${media.palm`
    margin: 0px;
    margin-bottom: ${props => props.theme.margins.small}
  `};
`;

const FeatureImage = styled.img`
  width: 75px;
  height: 75px;
`;

const FeatureTitle = styled.div`
  font-size: 20px;
  font-weight: 400;
  margin-bottom: ${props => props.theme.margins.small};
  margin-top: ${props => props.theme.margins.small};
`;

const Feature = ({title, image, githubUrl}) => (
  <FeatureContainer>
    <FeatureImage src={image} />
    <FeatureTitle>{title}</FeatureTitle>
    <GithubButton href={githubUrl} style={{marginTop: '2rem'}} />
  </FeatureContainer>
);

class Ecosystems extends PureComponent {
  render() {
    return (
      <div>
        <StaggeredScrollAnimation Container={FeaturesContainer}>
          {ECOSYSTEM.map(({title, description, image, githubUrl}, i) => (
            <Feature
              key={`feature-${i}`}
              title={title}
              description={description}
              image={image}
              githubUrl={githubUrl}
            />
          ))}
        </StaggeredScrollAnimation>
      </div>
    );
  }
}

export default Ecosystems;
