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
import styled, {keyframes} from 'styled-components';

const animationName = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Loader = styled.span`
    border-left-color: ${props => props.color || props.theme.primaryBtnBgd};
    animation: _preloader_spin_ 500ms linear infinite;
    border-radius: 50%;
    border-top-color: transparent;
    border-bottom-color: transparent;
    border-right-color: transparent;
    cursor: wait;
    border-style: solid;
    display: block;
    animation-name: ${animationName};
}`;

const LoadingWrapper = styled.div`
  border-radius: 50%;
  border: 3px solid ${props => props.borderColor || props.theme.borderColorLT};
  padding: 2px;
`;

const LoadingSpinner = ({size = 32, color = '', borderColor = '', strokeWidth = 3, gap = 2}) => (
  <LoadingWrapper style={{width: `${size}px`, height: `${size}px`, padding: `${gap}px`}}>
    <Loader
      color={color}
      style={{
        width: `${size - strokeWidth * 2 - gap * 2}px`,
        height: `${size - strokeWidth * 2 - gap * 2}px`
      }}
    />
  </LoadingWrapper>
);

export default LoadingSpinner;
