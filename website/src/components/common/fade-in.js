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
import Waypoint from 'react-waypoint';

export default class FadeIn extends PureComponent {
  state = {
    isVisible: null,
  }

  _onWaypointEnter = () => {
    this.setState({isVisible: true});
  }

  _onWaypointLeave = () => {
    this.setState({isVisible: false});
  }

  render() {
    const {isVisible} = this.state;
    const {transitionDelay = 0} = this.props;
    return (
      <Waypoint
        onEnter={this._onWaypointEnter}
        onLeave={this._onWaypointLeave}>
        <div style={{
          opacity: isVisible ? 1.0 : 0.0,
          transform: isVisible ? undefined: 'translate(0, 5px)',
          transition: `opacity 1s ${transitionDelay}ms, transform 1s ${transitionDelay}ms`,
        }}>
          {this.props.children}
        </div>
      </Waypoint>
    )
  }
}