import React from 'react';
import styled from 'styled-components';
import {format} from 'd3-format';

import {SidePanelSection, Tooltip} from 'components/common/styled-components';
import {Table, Trash, ArrowRight} from 'components/common/icons';

const defaultRemoveDataset = datasetKey => {};
const numFormat = format(',');

const SourceDataCatelog = styled.div`
  transition: ${props => props.theme.transition};
`;

const DatasetTitle = styled.div`
  color: ${props => props.theme.textColor};
  display: flex;
  align-items: center;
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
  display: inline-block;
  color: ${props => props.theme.textColor};
  font-size: 11px;
  letter-spacing: 0.2px;

  .dataset-name {
    padding: 0 4px 0 12px;
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
    <Square className="dataset-color" color={dataset.color} />
    <span className="dataset-name">{dataset.label}</span>
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
        <DatasetTitle clickable={Boolean(showDatasetTable)}>
          <DatasetTag
            dataset={dataset}
            onClick={
              showDatasetTable ? () => showDatasetTable(dataset.id) : null
            }
          />
          {showDatasetTable ? <ArrowRight height="12px" /> : null}
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

const Square = styled.div`
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: rgb(${props => props.color.join(',')});
`;

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
