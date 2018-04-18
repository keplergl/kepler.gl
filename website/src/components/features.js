import React, {PureComponent} from 'react';
import styled, {keyframes} from 'styled-components';

import {FEATURES} from '../content/features';

const FeatureContainer = styled.div`
  text-align: center;
  width: 400px;
  padding: 24px;
  margin: 5px;
`;

const FeatureImage = styled.img`
  border-radius: 50px;
  width: 75px;
  height: 75px;
`

const FeatureTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

const FeatureDescription = styled.div`
  font-size: 16px;
  color: #535353;
`;

const SectionBody = styled.div`
  display: flex;
  justify-content: center;
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
      <SectionBody>
        {FEATURES.map(({title, description, image}) => (
          <Feature title={title} description={description} image={image}/>
        ))}
      </SectionBody>
    );
  }
}

export default Features;
