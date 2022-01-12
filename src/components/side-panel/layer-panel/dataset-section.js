import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from 'localization';
import {Add} from 'components/common/icons';
import {Button} from 'components/common/styled-components';

import SourceDataCatalogFactory from '../common/source-data-catalog';

const StyledDatasetTitle = styled.div`
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
  const AddDataButton = ({onClick, isInactive}) => (
    <Button
      className="add-data-button"
      onClick={onClick}
      isInactive={!isInactive}
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

function DatasetSectionFactory(SourceDataCatalog, AddDataButton) {
  const DatasetSection = props => {
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
