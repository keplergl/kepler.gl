// Copyright (c) 2022 Uber Technologies, Inc.
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
import {FormattedMessage} from '@kepler.gl/localization';
import {Add} from 'components/common/icons';
import {Button} from 'components/common/styled-components';

import SourceDataCatalogFactory from '../common/source-data-catalog';
import {Datasets} from '../../../utils';
import * as UiStateActions from 'actions/ui-state-actions';
import * as VisStateActions from 'actions/vis-state-actions';
import {ActionHandler} from 'actions';

type AddDataButtonProps = {
  onClick: () => void;
  isInactive: boolean;
};

type DatasetSectionProps = {
  datasets: Datasets;
  defaultDataset: string;
  showDatasetList: boolean;
  showDeleteDataset: boolean;
  showDatasetTable: ActionHandler<typeof VisStateActions.showDatasetTable>;
  updateTableColor: ActionHandler<typeof VisStateActions.updateTableColor>;
  removeDataset: ActionHandler<typeof UiStateActions.openDeleteModal>;
  showAddDataModal: () => void;
};

const StyledDatasetTitle = styled.div<{showDatasetList: boolean}>`
  line-height: ${props => props.theme.sidePanelTitleLineHeight};
  font-weight: 400;
  letter-spacing: 1.25px;
  color: ${props => props.theme.subtextColor};
  font-size: 11px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => (props.showDatasetList ? '16px' : '4px')};
`;

const StyledDatasetSection = styled.div`
  margin: 0 -32px 0 -16px;
  padding: 0 32px 0 16px;
  border-bottom: 1px solid ${props => props.theme.sidePanelBorderColor};
`;

export function AddDataButtonFactory() {
  const AddDataButton: React.FC<AddDataButtonProps> = ({onClick, isInactive}) => (
    <Button
      className="add-data-button"
      onClick={onClick}
      inactive={!isInactive}
      width="105px"
      secondary
    >
      <Add height="12px" />
      <FormattedMessage id={'layerManager.addData'} />
    </Button>
  );

  return AddDataButton;
}

DatasetSectionFactory.deps = [SourceDataCatalogFactory, AddDataButtonFactory];

function DatasetSectionFactory(
  SourceDataCatalog: ReturnType<typeof SourceDataCatalogFactory>,
  AddDataButton: ReturnType<typeof AddDataButtonFactory>
) {
  const DatasetSection: React.FC<DatasetSectionProps> = props => {
    const {
      datasets,
      showDatasetTable,
      updateTableColor,
      showDeleteDataset,
      removeDataset,
      showDatasetList,
      showAddDataModal,
      defaultDataset
    } = props;
    const datasetCount = Object.keys(datasets).length;

    return (
      <StyledDatasetSection>
        <StyledDatasetTitle showDatasetList={showDatasetList}>
          <span>Datasets ({datasetCount})</span>
          <AddDataButton onClick={showAddDataModal} isInactive={!defaultDataset} />
        </StyledDatasetTitle>
        {showDatasetList && (
          <SourceDataCatalog
            datasets={datasets}
            showDatasetTable={showDatasetTable}
            updateTableColor={updateTableColor}
            removeDataset={removeDataset}
            showDeleteDataset={showDeleteDataset}
          />
        )}
      </StyledDatasetSection>
    );
  };

  return DatasetSection;
}

export default DatasetSectionFactory;
