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

import React from 'react';
import styled, {css} from 'styled-components';
import {media} from '../../styles';

const containerStyles = css`
  background: white;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const VerticalContainer = styled.div`
  ${containerStyles} width: 350px;
  height: 400px;

  ${media.palm`
    width: 100%;
    height: auto;
  `};
`;

const HorizontalContainer = styled.div`
  ${containerStyles} height: 150px;
  display: flex;
  ${media.palm`
    height: auto;
    display: block;
  `};
`;

const Content = styled.div`
  padding: ${props => props.theme.margins.medium};

  ${media.palm`
    padding: ${props => props.theme.margins.small};
  `};
`;

const VerticalCardImage = styled.img`
  display: block;
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const HorizontalCardImage = styled.img`
  height: 150px;
  width: 150px;
  object-fit: cover;
  ${media.palm`
    width: 100%;
    height: 100px;
  `};
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Description = styled.div`
  font-size: 14px;
  color: #777;
  margin-bottom: 8px;
  height: ${props => (props.size === 'small' ? '40px' : '80px')};
  line-height: 1.5;
`;

const Link = styled.div`
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  color: black;
`;

export const VerticalCard = ({
  title,
  description,
  image,
  linkText,
  linkUrl
}) => (
  <VerticalContainer>
    <VerticalCardImage src={image} />
    <Content>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <Link>{linkText}</Link>
    </Content>
  </VerticalContainer>
);

export const HorizontalCard = ({
  title,
  description,
  image,
  linkText,
  linkUrl
}) => (
  <HorizontalContainer>
    <HorizontalCardImage src={image} />
    <Content>
      <Title>{title}</Title>
      <Description size="small">{description}</Description>
      <Link>{linkText}</Link>
    </Content>
  </HorizontalContainer>
);
