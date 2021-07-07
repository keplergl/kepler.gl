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
import Base from './base';

export default class House extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-house'
  };

  render() {
    return (
      <Base {...this.props}>
        //<path d="M23.015 56h-9a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v44a2 2 0 0 1-2 2zm29-2V10a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v44a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2z" />
        
          <rect
             style={{fill:'#000000', fillOpacity: 1, stroke: null, strokeWidth: 38.4583}}
             width="23.970343"
             height="48.05875"
             x="12.065826"
             y="7.8554053"
             ry="3.1089358" 
          />
          <rect
             style={{fill: '#4d4d4d', fillOpacity:1, stroke:null, strokeWidth: 38.0833}}
             width="22.577076"
             height="22.944777"
             x="29.437925"
             y="32.930508"
             ry="2.8263042" />
          <g
             transform="matrix(0.15363043,0,0,0.07136293,-0.65374923,23.420607)">
            <path
            style={{color:'#000000', fill:'#4d4d4d'}}
               d="M 269.90234,24.990234 196.57812,151.99023 h 65.46485 81.18359 z m 0,65.025391 17.00977,29.462895 h -34.01953 z"
          />
          </g>
      </Base>
    );
  }
}
