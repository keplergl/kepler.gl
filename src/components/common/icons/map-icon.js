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

class MapIcon extends Component {
  static propTypes = {
    /** Set the height of the icon, ex. '16px' */
    height: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    height: '16px',
    predefinedClassName: 'data-ex-icons-map-icon',
    totalColor: 1
  };

  render() {
    return (
      <Base {...this.props} viewBox={'0 0 602 602'}>
        <g>
          <path
            d="M573.864,323.679l25.6-201.737L409.988,50.046L197.993,151.289L0,67.678l27.935,220.105L2.223,506.009l208.665,39.135
			l200.136-38.125l189.865,43.823L573.864,323.679z M210.855,522.625L26.64,488.076l23.732-199.335L26.803,103.007l171.761,72.543
			L410.987,74.083l164.331,62.361l-23.755,187.142l23.648,198.602l-163.764-37.782L210.855,522.625z"
          />
          <path
            d="M506.021,405.449c-5.509,0-10.604,1.596-15.049,4.167c-17.531-12.832-35.583-27.904-36.47-47.735
			c-1.217-27.195,15.439-53.227-3.623-78.182c-18.625-24.382-66.301-7.944-84.73-26.264c2.873-4.617,4.593-10.01,4.593-15.844
			c0-16.671-13.519-30.192-30.187-30.192c-16.68,0-30.192,13.515-30.192,30.192c0,9.561,4.534,17.98,11.467,23.513
			c-2.907,7.358-4.729,15.167-5.048,23.141c-0.496,12.596,3.121,25.126,0.391,37.634c-2.252,10.391-16.875,9.729-24.757,9.788
			c-19.875,0.177-48.202-3.57-61.023,10.462c-3.783-2.843-8.207-4.812-13.077-5.621c-2.87-25.848,2.098-51.102-20.824-70.985
			c-14.736-12.794-38.846-18.344-52.438-32.719c2.873-4.619,4.61-10.031,4.61-15.871c0-16.674-13.515-30.198-30.189-30.198
			c-16.668,0-30.192,13.515-30.192,30.198c0,16.668,13.515,30.183,30.192,30.183c5.562,0,10.707-1.604,15.179-4.229
			c10.048,10.083,23.915,16.784,36.892,23.56c16.529,8.627,28.844,19.698,31.108,39.283c1.241,10.734,0.762,21.291,1.46,31.854
			c-12.135,3.918-20.978,15.16-20.978,28.602c0,16.681,13.515,30.192,30.195,30.192c16.668,0,30.189-13.512,30.189-30.192
			c0-3.942-0.81-7.701-2.189-11.159c10.024-18.063,56.066-5.745,73.423-11.55c12.644-4.238,17.13-16.083,18.247-28.365
			c1.063-11.473-2.637-22.757-0.91-34.283c0.686-4.69,1.867-9.224,3.439-13.55c1.644,0.271,3.311,0.502,5.024,0.502
			c5.308,0,10.22-1.489,14.559-3.904c18.684,18.713,55.768,6.174,79.328,20.271c28.017,16.754-0.792,64.046,8.051,89.309
			c6.123,17.472,22.13,30.499,37.994,42.232c-2.902,4.64-4.664,10.084-4.664,15.953c0,16.681,13.507,30.192,30.198,30.192
			c16.657,0,30.192-13.512,30.192-30.192C536.213,418.979,522.689,405.449,506.021,405.449z"
          />
        </g>
      </Base>
    );
  }
}

export default MapIcon;
