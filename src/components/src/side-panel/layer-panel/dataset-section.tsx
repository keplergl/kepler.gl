// Copyright (c) 2023 Uber Technologies, Inc.
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
import {Add} from '../../common/icons';
import {Button} from '../../common/styled-components';

import SourceDataCatalogFactory from '../common/source-data-catalog';
import {UIStateActions, VisStateActions, ActionHandler} from '@kepler.gl/actions';
import {Datasets} from '@kepler.gl/table';

type AddDataButtonProps = {
  onClick: () => void;
  isInactive: boolean;
};

type DatasetSectionProps = {
  datasets: Datasets;
  showDatasetList?: boolean;
  showDeleteDataset?: boolean;
  showDatasetTable: ActionHandler<typeof VisStateActions.showDatasetTable>;
  updateTableColor: ActionHandler<typeof VisStateActions.updateTableColor>;
  removeDataset: ActionHandler<typeof UIStateActions.openDeleteModal>;
  showAddDataModal: () => void;
};

const StyledDatasetTitle = styled.div<{showDatasetList?: boolean}>`
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
  border-bottom: 1px solid ${props => props.theme.sidePanelBorderColor};
`;

export function AddDataButtonFactory() {
  const AddDataButton: React.FC<AddDataButtonProps> = React.memo(({onClick, isInactive}) => (
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
  ));
  AddDataButton.displayName = 'AddDataButton';
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
      showAddDataModal
    } = props;
    const datasetCount = Object.keys(datasets).length;

    return (
      <StyledDatasetSection>
        <StyledDatasetTitle showDatasetList={showDatasetList}>
          <span>Datasets{datasetCount ? `(${datasetCount})` : ''}</span>
          <AddDataButton onClick={showAddDataModal} isInactive={!datasetCount} />
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
