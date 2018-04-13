// Copyright (c) 2018 Uber Technologies, Inc.
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

import {File} from 'components/common/icons';

const FileNameTag = styled.div`
  background-color: currentColor;
  border-radius: 1px;
  display: inline-block;
  padding: 0 4px;
  position: absolute;
  top: 45%;
  left: 10%;

  .text {
    color: white;
    font-size: ${props => props.fontSize};
  }
`;

const FileTypeIconWrapper = styled.div`
  display: inline-block;
  position: relative;
  color: currentColor;
  height: ${props => props.height};
`;

const FileTypeIcon = ({ext, height, fontSize}) => (
  <FileTypeIconWrapper height={height}>
    <File height={height} />
    <FileNameTag fontSize={fontSize}>
      <div className="text">{ext}</div>
    </FileNameTag>
  </FileTypeIconWrapper>
);

export default FileTypeIcon;
