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

const FreeWindow = props => (
  <Base {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.75665 4.67861C3.75665 4.40246 3.98051 4.17861 4.25665 4.17861H11.7433C12.0195 4.17861 12.2433 4.40246 12.2433 4.67861V11.3214C12.2433 11.5975 12.0195 11.8214 11.7433 11.8214H4.25665C3.98051 11.8214 3.75665 11.5975 3.75665 11.3214V4.67861ZM4.75665 5.17861V10.8214H11.2433V5.17861H4.75665Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.25611 10.2511C2.03735 10.4196 1.7234 10.3789 1.55487 10.1601L0.125822 8.30514C-0.0127244 8.1253 -0.0127244 7.8747 0.125822 7.69486L1.55487 5.83988C1.7234 5.62113 2.03735 5.58041 2.25611 5.74894C2.47486 5.91746 2.51558 6.23142 2.34705 6.45017L1.15308 8L2.34705 9.54983C2.51558 9.76858 2.47486 10.0825 2.25611 10.2511Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.7439 5.76226C13.9626 5.59374 14.2766 5.63446 14.4451 5.85321L15.8742 7.70818C16.0127 7.88802 16.0127 8.13863 15.8742 8.31847L14.4451 10.1734C14.2766 10.3922 13.9626 10.4329 13.7439 10.2644C13.5251 10.0959 13.4844 9.78191 13.6529 9.56316L14.8469 8.01333L13.6529 6.4635C13.4844 6.24474 13.5251 5.93079 13.7439 5.76226Z"
    />
  </Base>
);
FreeWindow.propTypes = {
  /** Set the height of the icon, ex. '16px' */
  height: PropTypes.string
};
FreeWindow.defaultProps = {
  height: '16px',
  viewBox: '0 0 16 16',
  predefinedClassName: 'data-ex-icons-freewindow'
};
export default FreeWindow;
