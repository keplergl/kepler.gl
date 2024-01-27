// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

import {openDeleteModal, VisStateActions, ActionHandler} from '@kepler.gl/actions';
import {DataContainerInterface} from '@kepler.gl/utils';
import {RGBColor} from '@kepler.gl/types';

import {SidePanelSection} from '../../common/styled-components';
import DatasetTitleFactory from './dataset-title';
import DatasetInfoFactory from './dataset-info';

const SourceDataCatalogWrapper = styled.div`
  transition: ${props => props.theme.transition};
`;

type MiniDataset = {
  id: string;
  color: RGBColor;
  label?: string;
  dataContainer: DataContainerInterface;
};

type MiniDatasets = {
  [key: string]: MiniDataset;
};

export type SourceDataCatalogProps = {
  datasets: MiniDatasets;
  showDeleteDataset?: boolean;
  onTitleClick?: () => void;
  showDatasetTable?: ActionHandler<typeof VisStateActions.showDatasetTable>;
  updateTableColor: ActionHandler<typeof VisStateActions.updateTableColor>;
  removeDataset?: ActionHandler<typeof openDeleteModal>;
};

SourceDataCatalogFactory.deps = [DatasetTitleFactory, DatasetInfoFactory];

function SourceDataCatalogFactory(
  DatasetTitle: ReturnType<typeof DatasetTitleFactory>,
  DatasetInfo: ReturnType<typeof DatasetInfoFactory>
) {
  const SourceDataCatalog: React.FC<SourceDataCatalogProps> = ({
    datasets,
    showDatasetTable,
    removeDataset,
    onTitleClick,
    updateTableColor,
    showDeleteDataset = false
  }: SourceDataCatalogProps) => (
    <SourceDataCatalogWrapper className="source-data-catalog">
      {Object.values(datasets).map(dataset => (
        <SidePanelSection key={dataset.id}>
          <DatasetTitle
            showDatasetTable={showDatasetTable}
            showDeleteDataset={showDeleteDataset}
            removeDataset={removeDataset}
            dataset={dataset}
            onTitleClick={onTitleClick}
            updateTableColor={updateTableColor}
          />
          {showDatasetTable ? <DatasetInfo dataset={dataset} /> : null}
        </SidePanelSection>
      ))}
    </SourceDataCatalogWrapper>
  );

  return SourceDataCatalog;
}

export default SourceDataCatalogFactory;
