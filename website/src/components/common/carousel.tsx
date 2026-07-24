// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import styled from 'styled-components';
import {Waypoint as WaypointBase} from 'react-waypoint';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Waypoint = WaypointBase as any;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  min-height: 200px;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  transform-style: preserve-3d;
  perspective-origin: center;
`;

interface ItemProps {
  $tX?: number;
  $tZ?: number;
}

const Item = styled.div<ItemProps>`
  position: absolute;
  transition: transform 1s;
  cursor: pointer;
  transform: perspective(600px) translate3d(${props => props.$tX}%, 0, ${props => props.$tZ}px);
`;

interface CarouselProps {
  children?: React.ReactNode[];
  selectedIndex: number;
  xOffset?: number;
  zOffset?: number;
  onChange?: (index: number) => void;
}

interface CarouselState {
  isVisible: boolean;
}

export default class Carousel extends PureComponent<CarouselProps, CarouselState> {
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
        <div>
          <Container>
            <Content>
              {(children || []).map((item, i) => {
                const translateX = isVisible ? (i - selectedIndex) * (xOffset || 0) : 0;
                const translateZ = -Math.abs(i - selectedIndex) * (zOffset || 0);
                return (
                  <Item
                    key={`carousel-item-${i}`}
                    $tX={translateX}
                    $tZ={translateZ}
                    onClick={() => {
                      this.props.onChange?.(i);
                    }}
                  >
                    {item}
                  </Item>
                );
              })}
            </Content>
          </Container>
        </div>
      </Waypoint>
    );
  }
}
