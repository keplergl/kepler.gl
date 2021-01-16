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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Base from 'components/common/icons/base';

class ClusterLayerIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'cluster-layer-icon',
    totalColor: 5
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          d="M13.6,22.7c2.9-3.6,4.4-6.3,4.4-8c0-2.7-2.2-4.9-4.9-4.9S8.2,12,8.2,14.7c0,1.7,1.5,4.4,4.4,8l0,0
	C12.8,23,13.2,23,13.6,22.7C13.5,22.8,13.6,22.7,13.6,22.7z"
          className="cr1"
        />
        <path
          d="M22.9,57.4c2.5-3.1,3.8-5.5,3.8-7c0-2.4-2-4.4-4.4-4.4S18,48,18,50.4c0,1.5,1.3,3.8,3.8,7l0,0
	c0.3,0.3,0.7,0.4,1,0.1C22.9,57.4,22.9,57.4,22.9,57.4z"
          className="cr2"
        />
        <path
          d="M51.4,22.5c2.8-3.4,4.2-6,4.2-7.6c0-2.6-2.1-4.8-4.8-4.8c-2.6,0-4.8,2.1-4.8,4.8c0,1.6,1.4,4.2,4.2,7.6
	l0,0c0.3,0.3,0.8,0.4,1.1,0.1C51.3,22.5,51.4,22.5,51.4,22.5z"
          className="cr3"
        />
        <path
          d="M49.2,53.8c3.7-4.5,5.5-7.8,5.5-9.9c0-3.3-2.7-6.1-6.1-6.1c-3.3,0-6.1,2.7-6.1,6.1
	c0,2.1,1.8,5.4,5.5,9.9l0,0c0.3,0.3,0.7,0.4,1.1,0.1C49.1,53.8,49.1,53.8,49.2,53.8z"
          className="cr4"
        />
        <path
          d="M31.4,39.6C36.5,33.5,39,29,39,26.1c0-4.4-3.6-8-8-8s-8,3.6-8,8c0,2.9,2.5,7.4,7.6,13.5l0,0
	C30.8,39.8,31.1,39.9,31.4,39.6C31.3,39.7,31.4,39.6,31.4,39.6z"
          className="cr5"
        />
      </Base>
    );
  }
}

export default ClusterLayerIcon;
