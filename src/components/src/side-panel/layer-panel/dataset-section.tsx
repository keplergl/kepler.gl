// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
