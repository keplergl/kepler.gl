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
