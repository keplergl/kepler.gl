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
import {FormattedMessage} from 'localization';
import styled from 'styled-components';
import {DatasetSquare, Tooltip} from 'components';

function nop(_) {}

const DatasetTagWrapper = styled.div`
  display: flex;
  color: ${props => props.theme.textColor};
  font-size: 11px;
  letter-spacing: 0.2px;
  overflow: auto;

  .dataset-color {
    flex-shrink: 0;
    margin-top: 3px;
  }

  .dataset-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const DatasetColorPicker = styled.div`
  display: flex;
`;

const UpdateDatasetColor = ({id, updateDatasetColor = nop, children}) => (
  <DatasetColorPicker
    className="dataset-action update-color"
    data-tip
    data-for={`update-color-${id}`}
    onClick={e => {
      e.stopPropagation();
      updateDatasetColor(id);
    }}
  >
    {children}
    <Tooltip id={`update-color-${id}`} effect="solid">
      <span>
        <FormattedMessage id={'Update color'} />
      </span>
    </Tooltip>
  </DatasetColorPicker>
);

export default function DatasetTagFactory() {
  const DatasetTag = ({onClick, onClickSquare, dataset, updateDatasetColor}) => (
    <DatasetTagWrapper
      className="source-data-tag"
      updateDatasetColor={updateDatasetColor}
    >
      <UpdateDatasetColor id={dataset.id} updateDatasetColor={updateDatasetColor}>
        <DatasetSquare 
          className="dataset-color" 
          color={dataset.color} 
          onClick={onClickSquare}
        />
      </UpdateDatasetColor>
      <div className="dataset-name" title={dataset.label} onClick={onClick}>
        {dataset.label}
      </div>
    </DatasetTagWrapper>
  );

  return DatasetTag;
}
