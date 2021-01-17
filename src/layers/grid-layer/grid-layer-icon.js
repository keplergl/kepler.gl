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

export default class GridLayerIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'grid-layer-icon',
    totalColor: 6
  };

  render() {
    return (
      <Base {...this.props}>
        <rect x="11.2" y="11.2" className="cr1" width="13.1" height="13.1" style={{opacity: 0.8}} />
        <rect x="25.4" y="11.2" className="cr2" width="13.1" height="13.1" style={{opacity: 0.8}} />
        <rect x="39.6" y="11.2" width="13.1" height="13.1" className="cr3" />
        <rect x="11.2" y="25.4" className="cr4" width="13.1" height="13.1" style={{opacity: 0.4}} />
        <rect x="25.4" y="25.4" className="cr5" width="13.1" height="13.1" />
        <rect x="39.6" y="25.4" className="cr6" width="13.1" height="13.1" style={{opacity: 0.8}} />
        <rect x="11.2" y="39.6" width="13.1" className="cr1" height="13.1" />
        <rect x="25.4" y="39.6" className="cr2" width="13.1" height="13.1" style={{opacity: 0.4}} />
        <rect x="39.6" y="39.6" className="cr3" width="13.1" height="13.1" style={{opacity: 0.4}} />
      </Base>
    );
  }
}
