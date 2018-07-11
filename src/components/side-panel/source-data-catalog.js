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
import {format} from 'd3-format';

import {SidePanelSection, Tooltip, DatasetSquare, CenterFlexbox} from 'components/common/styled-components';
import {Table, Trash, ArrowRight} from 'components/common/icons';

const defaultRemoveDataset = datasetKey => {};
const numFormat = format(',');

const SourceDataCatelog = styled.div`
  transition: ${props => props.theme.transition};
`;

const DatasetTitle = styled.div`
  color: ${props => props.theme.textColor};
  display: flex;
  align-items: flex-start;

  .source-data-arrow {
    height: 16px;
  }
  :hover {
    color: ${props =>
      props.clickable ? props.theme.textColorHl : props.theme.textColor};
    cursor: ${props => (props.clickable ? 'pointer' : 'auto')};

    .dataset-action {
      color: ${props => props.theme.textColorHl};
      opacity: 1;
    }

    .dataset-action:hover {
      color: white;
    }
  }
`;

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

const DataTagAction = styled.div`
  margin-left: 12px;
  height: 16px;
  opacity: 0;
`;

const DataRowCount = styled.div`
  font-size: 11px;
  color: ${props => props.theme.subtextColor};
  padding-left: 19px;
`;

export const DatasetTag = ({onClick, dataset}) => (
  <DatasetTagWrapper className="source-data-tag" onClick={onClick}>
    <DatasetSquare className="dataset-color" color={dataset.color} />
    <div className="dataset-name">{dataset.label}</div>
  </DatasetTagWrapper>
);

const SourceDataCatalog = ({
  datasets,
  showDatasetTable,
  removeDataset,
  showDeleteDataset = false
}) => (
  <SourceDataCatelog className="source-data-catalog">
    {Object.values(datasets).map((dataset, index) => (
      <SidePanelSection key={dataset.id}>
        <DatasetTitle className="source-data-title" clickable={Boolean(showDatasetTable)}>
          <DatasetTag
            dataset={dataset}
            onClick={
              showDatasetTable ? () => showDatasetTable(dataset.id) : null
            }
          />
          {showDatasetTable ?
            <CenterFlexbox className="source-data-arrow">
              <ArrowRight height="12px" />
            </CenterFlexbox> : null}
          {showDatasetTable ? (
            <ShowDataTable
              id={dataset.id}
              showDatasetTable={showDatasetTable}
            />
          ) : null}
          {showDeleteDataset ? (
            <RemoveDataset
              datasetKey={dataset.id}
              removeDataset={removeDataset}
            />
          ) : null}
        </DatasetTitle>
        {showDatasetTable ? (
          <DataRowCount className="source-data-rows">{`${numFormat(
            dataset.allData.length
          )} rows`}</DataRowCount>
        ) : null}
      </SidePanelSection>
    ))}
  </SourceDataCatelog>
);

const ShowDataTable = ({id, showDatasetTable}) => (
  <DataTagAction
    className="dataset-action show-data-table"
    data-tip
    data-for={`data-table-${id}`}
  >
    <Table height="16px" onClick={() => showDatasetTable(id)} />
    <Tooltip id={`data-table-${id}`} effect="solid">
      <span>Show data table</span>
    </Tooltip>
  </DataTagAction>
);

const RemoveDataset = ({datasetKey, removeDataset = defaultRemoveDataset}) => (
  <DataTagAction
    className="dataset-action remove-dataset"
    data-tip
    data-for={`delete-${datasetKey}`}
  >
    <Trash
      height="16px"
      onClick={e => {
        e.stopPropagation();
        removeDataset(datasetKey);
      }}
    />
    <Tooltip id={`delete-${datasetKey}`} effect="solid" type="error">
      <span>Remove dataset</span>
    </Tooltip>
  </DataTagAction>
);

export default SourceDataCatalog;
