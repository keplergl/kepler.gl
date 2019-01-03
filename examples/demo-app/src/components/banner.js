// Copyright (c) 2019 Uber Technologies, Inc.
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
import styled from 'styled-components';
import {Icons} from 'kepler.gl/components';

const StyledBanner = styled.div`
  align-items: center;
  background-color: ${props => props.bgColor};
  color: ${props => props.fontColor};
  display: flex;
  height: ${props => props.height}px;
  justify-content: space-between;
  padding: 0 40px;
  position: absolute;
  transition: top 1s;
  width: 100%;
  z-index: 9999;

  svg:hover {
    cursor: pointer;
  }
`;

const Banner = ({bgColor = '#1F7CF4', fontColor = '#FFFFFF', height = 30, children, onClose, show}) => (
  <StyledBanner className="top-banner"
  bgColor={bgColor}
  fontColor={fontColor}
  height={height}
  style={{top: show ? 0 : `-100px`}}>
    <div>
      {children}
    </div>
    <Icons.Delete height="14px" onClick={onClose}/>
  </StyledBanner>
);

export default Banner;
