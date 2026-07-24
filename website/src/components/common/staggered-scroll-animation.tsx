// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import {Waypoint as WaypointBase} from 'react-waypoint';
import styled from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Waypoint = WaypointBase as any;

interface FadeInProps {
  $isVisible?: boolean;
  delay?: number;
}

const FadeIn = styled.div<FadeInProps>`
  opacity: ${props => (props.$isVisible ? '1.0' : '0.0')};
  transform: ${props => (props.$isVisible ? undefined : 'translateY(10px)')};
  transition: ${props => `opacity 350ms ${props.delay}ms, transform 350ms ${props.delay}ms`};
`;

interface StaggeredScrollAnimationProps {
  duration?: number;
  delay?: number;
  animateOnce?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Container?: any;
  scrollOffsetTop?: number;
  children?: React.ReactNode;
}

interface StaggeredScrollAnimationState {
  isVisible: boolean;
}

export default class StaggeredScrollAnimation extends PureComponent<
  StaggeredScrollAnimationProps,
  StaggeredScrollAnimationState
> {
  static defaultProps = {
    duration: 500,
    delay: 150,
    animateOnce: true,
    Container: 'div',
    scrollOffsetTop: -100
  };

  state = {
    isVisible: false
  };

  _onWaypointEnter = () => {
    this.setState({isVisible: true});
  };

  _onWaypointLeave = () => {
    const {animateOnce} = this.props;
    if (!animateOnce) {
      this.setState({isVisible: false});
    }
  };

  render() {
    const {isVisible} = this.state;
    const {delay, children, Container, scrollOffsetTop} = this.props;
    return (
      <Waypoint
        onEnter={this._onWaypointEnter}
        onLeave={this._onWaypointLeave}
        topOffset={scrollOffsetTop}
      >
        <div>
          <Container>
            {React.Children.map(children, (item, i) => (
              <FadeIn key={i} $isVisible={isVisible} delay={(delay || 0) * i}>
                {item}
              </FadeIn>
            ))}
          </Container>
        </div>
      </Waypoint>
    );
  }
}
