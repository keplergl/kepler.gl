import React, {PureComponent} from 'react';
import styled from 'styled-components';
import SwipeableViews from 'react-swipeable-views';

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
`
const PaginationBar = styled.div`
  width: 50px;
  height: 4px;
  background: white;
  opacity: ${props => props.isActive ? '1.0' : '0.5'};
  transition: opacity 200ms;
`;

const Pagination = ({items, selectedIndex, onChange}) => (
  <PaginationContainer>
    {items.map((item, index) => (
      <PaginationBarWrapper onClick={() => onChange(index)}>
        <PaginationBar isActive={index === selectedIndex} />
      </PaginationBarWrapper>
    ))}
  </PaginationContainer>
);

export default class Swipeable extends PureComponent {
  state = {
    selectedIndex: 0
  };

  _onChange = index => {
    this.setState({selectedIndex: index});
  };

  render() {
    const {children} = this.props;
    const {selectedIndex} = this.state;
    return (
      <div>
        <SwipeableViews index={selectedIndex} onChange={this._onChange}>
          {children}
        </SwipeableViews>
        <Pagination
          items={children}
          selectedIndex={selectedIndex}
          onChange={this._onChange}
        />
      </div>
    );
  }
}
