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
import styled, {css} from 'styled-components';

const containerStyles = css`
  background: white;
  box-shadow: 0px 12px 48px rgba(0, 0, 0, 0.18);
  border-radius: 4px;
`;

const VerticalContainer = styled.div`
  ${containerStyles}
  width: 400px;
  height: 450px;
`;

const HorizontalContainer = styled.div`
  ${containerStyles}
  height: 150px;
  display: flex;
`;

const Content = styled.div`
  padding: 24px;
`;

const VerticalCardImage = styled.img`
  width: 400px;
  height: 250px;
  object-fit: cover;
`;

const HorizontalCardImage = styled.img`
  height: 150px;
  width: 150px;
  object-fit: cover;
`

const Title = styled.div`
  font-size: 20px;
`;

const Description = styled.div`
  font-size: 14px;
  color: #777;
`

export const VerticalCard = ({title, description, image}) => (
  <VerticalContainer>
    <VerticalCardImage src={image}  />
    <Content>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Content>
  </VerticalContainer>
);

export const HorizontalCard = ({title, description, image}) => (
  <HorizontalContainer>
    <HorizontalCardImage src={image} />
    <Content>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Content>
  </HorizontalContainer>
);
