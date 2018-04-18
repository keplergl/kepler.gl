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
