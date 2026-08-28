// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 72px;
`;

const SlidesWrapper = styled.div`
  overflow: hidden;
  width: 100%;
`;

const SlidesTrack = styled.div`
  display: flex;
  transition: transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1);
  transform: translateX(${props => -(props.$index || 0) * 100}%);
`;

const Slide = styled.div`
  flex: 0 0 100%;
  min-width: 0;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
`;

// To increase click area for better usuablity
const PaginationBarWrapper = styled.div`
  padding: 16px 0px;
  cursor: pointer;
  margin-left: 2px;
  :first-child {
    margin-left: 0px;
  }
`;
const PaginationBar = styled.div`
  width: 50px;
  height: 4px;
  background: white;
  opacity: ${props => (props.$isActive ? '1.0' : '0.5')};
  transition: opacity 200ms;
`;

const Pagination = ({items, selectedIndex, onChange}) => (
  <PaginationContainer>
    {items.map((item, index) => (
      <PaginationBarWrapper key={index} onClick={() => onChange(index)}>
        <PaginationBar $isActive={index === selectedIndex} />
      </PaginationBarWrapper>
    ))}
  </PaginationContainer>
);

export default class Swipeable extends PureComponent {
  render() {
    const {children, onChange, selectedIndex} = this.props;
    return (
      <Container>
        <SlidesWrapper>
          <SlidesTrack $index={selectedIndex}>
            {React.Children.map(children, (child, i) => (
              <Slide key={i}>{child}</Slide>
            ))}
          </SlidesTrack>
        </SlidesWrapper>
        <div>
          <Pagination items={children} selectedIndex={selectedIndex} onChange={onChange} />
        </div>
      </Container>
    );
  }
}
