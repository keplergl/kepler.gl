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
`;
const PaginationBar = styled.div`
  width: 50px;
  height: 4px;
  background: white;
  opacity: ${props => (props.isActive ? '1.0' : '0.5')};
  transition: opacity 200ms;
`;

const Pagination = ({items, selectedIndex, onChange}) => (
  <PaginationContainer>
    {items.map((item, index) => (
      <PaginationBarWrapper key={index} onClick={() => onChange(index)}>
        <PaginationBar isActive={index === selectedIndex} />
      </PaginationBarWrapper>
    ))}
  </PaginationContainer>
);

export default class Swipeable extends PureComponent {
  render() {
    const {children, onChange, selectedIndex} = this.props;
    return (
      <div>
        <SwipeableViews
          enableMouseEvents
          index={selectedIndex}
          onChange={onChange}>
          {children}
        </SwipeableViews>
        <Pagination
          items={children}
          selectedIndex={selectedIndex}
          onChange={onChange}
        />
      </div>
    );
  }
}
