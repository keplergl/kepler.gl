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

import React, {PureComponent} from 'react';
import styled from 'styled-components';
import {FormattedMessage} from 'localization';

import {CenterFlexbox, Tooltip} from 'components/common/styled-components';
import {ArrowRight, Table, Trash} from 'components/common/icons';
import DatasetTagFactory from 'components/side-panel/common/dataset-tag';

function nop(_) {}

const StyledDatasetTitle = styled.div`
  color: ${props => props.theme.textColor};
  display: flex;
  align-items: flex-start;

  .source-data-arrow {
    height: 16px;
  }
  :hover {
    cursor: ${props => (props.clickable ? 'pointer' : 'auto')};

    .dataset-name {
      color: ${props => (props.clickable ? props.theme.textColorHl : props.theme.textColor)};
    }

    .dataset-action {
      color: ${props => props.theme.textColor};
      opacity: 1;
    }

    .dataset-action:hover {
      color: ${props => props.theme.textColorHl};
    }
  }
`;

const DataTagAction = styled.div`
  margin-left: 12px;
  height: 16px;
  opacity: 0;
`;

const ShowDataTable = ({id, showDatasetTable = nop}) => (
  <DataTagAction className="dataset-action show-data-table" data-tip data-for={`data-table-${id}`}>
    <Table
      height="16px"
      onClick={e => {
        e.stopPropagation();
        showDatasetTable(id);
      }}
    />
    <Tooltip id={`data-table-${id}`} effect="solid">
      <span>
        <FormattedMessage id={'datasetTitle.showDataTable'} />
      </span>
    </Tooltip>
  </DataTagAction>
);

const RemoveDataset = ({datasetKey, removeDataset = nop}) => (
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
      <span>
        <FormattedMessage id={'datasetTitle.removeDataset'} />
      </span>
    </Tooltip>
  </DataTagAction>
);

DatasetTitleFactory.deps = [DatasetTagFactory];

export default function DatasetTitleFactory(DatasetTag) {
  class DatasetTitle extends PureComponent {
    _onClickTitle = e => {
      e.stopPropagation();
      if (typeof this.props.onTitleClick === 'function') {
        this.props.onTitleClick();
      } else if (typeof this.props.showDatasetTable === 'function') {
        this.props.showDatasetTable(this.props.dataset.id);
      }
    };

    render() {
      const {
        showDatasetTable,
        showDeleteDataset,
        onTitleClick,
        removeDataset,
        dataset
      } = this.props;

      return (
        <StyledDatasetTitle
          className="source-data-title"
          clickable={Boolean(showDatasetTable || onTitleClick)}
        >
          <DatasetTag dataset={dataset} onClick={this._onClickTitle} />
          {showDatasetTable ? (
            <CenterFlexbox className="source-data-arrow">
              <ArrowRight height="12px" />
            </CenterFlexbox>
          ) : null}
          {showDatasetTable ? (
            <ShowDataTable id={dataset.id} showDatasetTable={showDatasetTable} />
          ) : null}
          {showDeleteDataset ? (
            <RemoveDataset datasetKey={dataset.id} removeDataset={removeDataset} />
          ) : null}
        </StyledDatasetTitle>
      );
    }
  }

  return DatasetTitle;
}
