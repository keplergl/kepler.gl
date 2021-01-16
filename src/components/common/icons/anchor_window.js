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

import React from 'react';
import Base from './base';
import PropTypes from 'prop-types';

const AnchorWindow = props => (
  <Base {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.73645 4.67861C2.73645 4.40246 2.96031 4.17861 3.23645 4.17861H11.5177C11.7938 4.17861 12.0177 4.40246 12.0177 4.67861V11.3214C12.0177 11.5975 11.7938 11.8214 11.5177 11.8214H3.23645C2.96031 11.8214 2.73645 11.5975 2.73645 11.3214V4.67861ZM3.73645 5.17861V10.8214H11.0177V5.17861H3.73645Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.5 3.66954C0.776142 3.66954 1 3.8934 1 4.16954L1 11.8304C1 12.1066 0.776143 12.3304 0.5 12.3304C0.223858 12.3304 3.68794e-07 12.1066 3.56723e-07 11.8304L2.18557e-08 4.16954C9.78513e-09 3.8934 0.223858 3.66954 0.5 3.66954Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.7039 5.74894C13.9227 5.58041 14.2366 5.62113 14.4051 5.83988L15.8342 7.69486C15.9727 7.8747 15.9727 8.1253 15.8342 8.30514L14.4051 10.1601C14.2366 10.3789 13.9227 10.4196 13.7039 10.2511C13.4852 10.0825 13.4444 9.76858 13.613 9.54983L14.8069 8L13.613 6.45017C13.4444 6.23142 13.4852 5.91746 13.7039 5.74894Z"
    />
  </Base>
);
AnchorWindow.propTypes = {
  /** Set the height of the icon, ex. '16px' */
  height: PropTypes.string
};
AnchorWindow.defaultProps = {
  height: '16px',
  viewBox: '0 0 16 16',
  predefinedClassName: 'data-ex-icons-anchorwindow'
};
export default AnchorWindow;
