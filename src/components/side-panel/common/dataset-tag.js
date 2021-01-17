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
import styled from 'styled-components';
import {DatasetSquare} from 'components/common/styled-components';

const DatasetTagWrapper = styled.div`
  display: flex;
  color: ${props => props.theme.textColor};
  font-size: 11px;
  letter-spacing: 0.2px;
  overflow: auto;

  .dataset-color {
    flex-shrink: 0;
    margin-top: 5px;
  }

  .dataset-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default function DatasetTagFactory() {
  const DatasetTag = ({onClick, dataset}) => (
    <DatasetTagWrapper className="source-data-tag" onClick={onClick}>
      <DatasetSquare className="dataset-color" color={dataset.color} />
      <div className="dataset-name" title={dataset.label}>
        {dataset.label}
      </div>
    </DatasetTagWrapper>
  );

  return DatasetTag;
}
