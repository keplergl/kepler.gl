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


const items = [
  {text: 'A', color: '#af2b2b'},
  {text: 'B', color: '#af5f2a'},
  {text: 'C', color: '#b7ae2a'},
  {text: 'D', color: '#52b527'},
  {text: 'E', color: '#24af8d'},
  {text: 'F', color: '#2442af'},
  {text: 'G', color: '#9822aa'}
];

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  transform-style: preserve-3d;
  perspective-origin: center;
`;

const Item = styled.div`
  position: absolute;
  transition: transform 1s;
  cursor: pointer;
`;

const TestItem = styled.div`
  width: 300px;
  height: 250px;
  color: white;
  background: ${props => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 200ms;
`;


const VISIBLE_Z = 9999;

export default class Carousel extends PureComponent {
  state = {
    selectedIndex: 3
  }

  render() {
    const {selectedIndex} = this.props;
    const selectedAngle = selectedIndex * -1 *  (360 / items.length);
    const {children} = this.props;
    return (
      <Container>
        <Content>
          {children.map((item, i) => {
            const translateX = (i - selectedIndex) * 60;
            const translateZ = -Math.abs(i - selectedIndex) * 50;
            // const scale = 1.0 - Math.abs((i - selectedIndex) / 10);
            const zIndex = VISIBLE_Z - Math.abs(i - selectedIndex);
            const scale = 1;
            return (
              <Item style={{
                transform: `perspective(600px) translate3d(${translateX}px, 0, ${translateZ}px)`,
                // zIndex: VISIBLE_Z - Math.abs(selectedIndex - i)
              }} onClick={() => {
                this.props.onChange(i);
              }}>
                {item}
              </Item>
            )
          })}
        </Content>
      </Container>
    );
  }
}