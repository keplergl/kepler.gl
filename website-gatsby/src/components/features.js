// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import styled from 'styled-components';

import {cdnUrl} from '../utils';
import {FEATURES} from '../content';
import {media} from '../styles';
import StaggeredScrollAnimation from './common/staggered-scroll-animation';
import {LinkButton, CenteredContent} from './common/styled-components';

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
  font-weight: 500;
  margin-bottom: ${props => props.theme.margins.small};
`;

const FeatureDescription = styled.div`
  font-size: 16px;
  color: #535353;
`;

const Feature = ({title, description, image}) => (
  <FeatureContainer>
    <FeatureImage src={image} />
    <FeatureTitle>{title}</FeatureTitle>
    <FeatureDescription>{description}</FeatureDescription>
  </FeatureContainer>
);

class Features extends PureComponent {
  render() {
    return (
      <div>
        <StaggeredScrollAnimation Container={FeaturesContainer}>
          {FEATURES.map(({title, description, image}, i) => (
            <Feature
              key={`feature-${i}`}
              title={title}
              description={description}
              image={image}
            />
          ))}
        </StaggeredScrollAnimation>
        <CenteredContent>
          <LinkButton large outline href="https://github.com/keplergl/kepler.gl">
            <img src={cdnUrl('icons/github-black.svg')} /> Open Source
          </LinkButton>
        </CenteredContent>
      </div>
    );
  }
}

export default Features;
