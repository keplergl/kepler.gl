// Copyright (c) 2018 Uber Technologies, Inc.
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
