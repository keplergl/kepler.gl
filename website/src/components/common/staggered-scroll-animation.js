// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Waypoint} from 'react-waypoint';
import styled from 'styled-components';

const FadeIn = styled.div`
  opacity: ${props => (props.isVisible ? '1.0' : '0.0')};
  transform: ${props => (props.isVisible ? undefined : 'translateY(10px)')};
  transition: ${props => `opacity 350ms ${props.delay}ms, transform 350ms ${props.delay}ms`};
`;

export default class StaggeredScrollAnimation extends PureComponent {
  static propTypes = {
    duration: PropTypes.number,
    delay: PropTypes.number,
    animateOnce: PropTypes.bool,
    Container: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.element,
      PropTypes.func,
      PropTypes.string
    ]),
    scrollOffsetTop: PropTypes.number
  };

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
        <Container>
          {React.Children.map(children, (item, i) => (
            <FadeIn key={i} isVisible={isVisible} delay={delay * i}>
              {item}
            </FadeIn>
          ))}
        </Container>
      </Waypoint>
    );
  }
}
