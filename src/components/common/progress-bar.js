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

const StyledProgressBar = styled.div.attrs({
  className: 'progress-bar'
})`
  position: relative;
  border-radius: 0px;
  overflow: hidden;
  background: 'transparent';
`;

const StyledProgressBarBar = styled.div.attrs({
  className: '.progress-bar__bar'
})`
  height: 4px;
  background-color: ${props => props.theme.activeColor};
  border-radius: 0px;
  display: block;
  transition: 'width 0.2s';
`

const ProgressBar = ({
  total = 1,
  current = 0.5
}) => {

  const progress = total > 0 && current !== undefined ?
      `${Math.ceil(current / total * 100)}%` : '0%';

  return (
    <StyledProgressBar>
      <StyledProgressBarBar style={{width: progress}}/>
    </StyledProgressBar>
  );
};

ProgressBar.defaultProps = {
  total: 1,
  current: 0.5
}

export default ProgressBar;
