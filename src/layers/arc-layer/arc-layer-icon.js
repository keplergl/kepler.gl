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

class ArcLayerIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'point-layer-icon',
    totalColor: 4
  };

  render() {
    return (
      <Base {...this.props}>
        <path
          d="M34.5,34.4c-0.6,0-1.2-0.4-1.4-1c-2.7-9.9-8.8-21.7-16.8-22.3c-3.1-0.2-5.6,1.5-7,4.8c-0.3,0.7-1.1,1.1-1.9,0.7
	c-0.7-0.3-1.1-1.1-0.7-1.9c1.9-4.3,5.6-6.8,9.8-6.5c9.5,0.7,16.3,13,19.4,24.4c0.2,0.8-0.2,1.5-1,1.7C34.8,34.3,34.6,34.4,34.5,34.4
	z"
          className="cr1"
        />
        <path
          d="M6.7,57c0,0-0.1,0-0.1,0c-0.5-0.1-0.9-0.6-0.8-1.1c2.4-17.3,9.6-30.3,17.5-31.8c3.1-0.6,7.8,0.4,12.1,8.3
	c0.3,0.5,0.1,1-0.4,1.3c-0.5,0.3-1,0.1-1.3-0.4c-2.1-3.8-5.6-8.2-10.1-7.4C16.6,27.3,9.9,40,7.6,56.2C7.6,56.7,7.2,57,6.7,57z"
          className="cr2"
        />
        <path
          d="M56.8,56.4c-0.8,0-1.4-0.6-1.4-1.4c0-13.5-6.8-24.4-12.9-25.8c-3.5-0.8-5.6,2-6.7,4.4c-0.3,0.7-1.2,1-1.9,0.7
	c-0.7-0.3-1-1.2-0.7-1.9c2.2-4.7,5.8-6.9,9.9-6c9,2,15.1,16.4,15.1,28.6C58.3,55.7,57.6,56.4,56.8,56.4z"
          className="cr3"
        />
        <path
          d="M34.5,32.7c-0.2,0-0.3,0-0.5,0c-1.3-0.3-2.1-1.5-1.8-2.8c3.5-17.4,10.3-20.7,14-21.2c4.4-0.5,8.6,2.3,11,7.4
	c0.6,1.2,0,2.6-1.1,3.1c-1.2,0.6-2.6,0-3.1-1.1c-1.5-3.2-3.8-5-6.1-4.7c-1.5,0.2-6.8,2-9.9,17.4C36.6,32,35.6,32.7,34.5,32.7z"
          className="cr4"
        />
      </Base>
    );
  }
}

export default ArcLayerIcon;
