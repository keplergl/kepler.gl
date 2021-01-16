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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Waypoint} from 'react-waypoint';

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  min-height: 200px;
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
  transform: perspective(600px)
    translate3d(${props => props.tX}%, 0, ${props => props.tZ}px);
`;

export default class Carousel extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    selectedIndex: PropTypes.number.isRequired,
    xOffset: PropTypes.number,
    zOffset: PropTypes.number
  };

  static defaultProps = {
    xOffset: 15,
    zOffset: 60
  };

  state = {
    isVisible: false
  };

  _onWaypointEnter = () => {
    this.setState({isVisible: true});
  };

  _onWaypointLeave = () => {
    this.setState({isVisible: false});
  };

  render() {
    const {selectedIndex, children, xOffset, zOffset} = this.props;
    const {isVisible} = this.state;
    return (
      <Waypoint onEnter={this._onWaypointEnter} onLeave={this._onWaypointLeave}>
        <Container>
          <Content>
            {children.map((item, i) => {
              const translateX = isVisible ? (i - selectedIndex) * xOffset : 0;
              const translateZ = -Math.abs(i - selectedIndex) * zOffset;
              return (
                <Item
                  key={`carousel-item-${i}`}
                  tX={translateX}
                  tZ={translateZ}
                  onClick={() => {
                    this.props.onChange(i);
                  }}
                >
                  {item}
                </Item>
              );
            })}
          </Content>
        </Container>
      </Waypoint>
    );
  }
}
