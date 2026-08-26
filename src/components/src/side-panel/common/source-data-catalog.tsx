// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';

import {openDeleteModal, VisStateActions, ActionHandler} from '@kepler.gl/actions';
import {DatasetType} from '@kepler.gl/constants';
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
  type?: string;
  metadata?: Record<string, any>;
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
  refreshDataset?: ActionHandler<typeof VisStateActions.refreshDataset>;
  updateDatasetProps?: ActionHandler<typeof VisStateActions.updateDatasetProps>;
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
    showDeleteDataset = false,
    refreshDataset,
    updateDatasetProps
  }: SourceDataCatalogProps) => {
    const [openRefreshSettingsId, setOpenRefreshSettingsId] = useState<string | null>(null);

    const onToggleRefreshSettings = useCallback((datasetId: string) => {
      setOpenRefreshSettingsId(current => (current === datasetId ? null : datasetId));
    }, []);

    return (
      <SourceDataCatalogWrapper className="source-data-catalog">
        {Object.values(datasets).map(dataset => {
          const showRefreshSettings = openRefreshSettingsId === dataset.id;
          const isRefreshing = dataset.metadata?.refreshStatus === 'loading';
          const showInfo = Boolean(showDatasetTable) || showRefreshSettings || isRefreshing;

          return (
            <SidePanelSection key={dataset.id}>
              <DatasetTitle
                showDatasetTable={showDatasetTable}
                showDeleteDataset={showDeleteDataset}
                removeDataset={removeDataset}
                dataset={dataset}
                onTitleClick={onTitleClick}
                updateTableColor={updateTableColor}
                onToggleRefreshSettings={
                  (refreshDataset || updateDatasetProps) &&
                  dataset.type === DatasetType.EXTERNALLY_HOSTED
                    ? () => onToggleRefreshSettings(dataset.id)
                    : undefined
                }
              />
              {showInfo ? (
                <DatasetInfo
                  dataset={dataset}
                  showRefreshSettings={showRefreshSettings}
                  refreshDataset={refreshDataset}
                  updateDatasetProps={updateDatasetProps}
                />
              ) : null}
            </SidePanelSection>
          );
        })}
      </SourceDataCatalogWrapper>
    );
  };

  return SourceDataCatalog;
}

export default SourceDataCatalogFactory;
