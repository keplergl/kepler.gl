// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled from 'styled-components';
import {format} from 'd3-format';
import {useIntl} from 'react-intl';

import {
  DatasetType,
  DATASET_REFRESH_INTERVAL_OPTIONS,
  getDatasetRefreshIntervalMs
} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import {DataContainerInterface} from '@kepler.gl/utils';
import {VisStateActions, ActionHandler} from '@kepler.gl/actions';

const numFormat = format(',');

type MiniDataset = {
  id: string;
  dataContainer: DataContainerInterface;
  type?: string;
  metadata?: {
    refreshIntervalMs?: number;
    refreshStatus?: string;
    refreshError?: string;
  };
};

export type DatasetInfoProps = {
  dataset: MiniDataset;
  updateDatasetProps?: ActionHandler<typeof VisStateActions.updateDatasetProps>;
};

const StyledDataRowCount = styled.div`
  font-size: 11px;
  color: ${props => props.theme.subtextColor};
  padding-left: 19px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const StyledRefreshSelect = styled.select`
  ${props => props.theme.input};
  height: 18px;
  font-size: 11px;
  padding: 0 4px;
  width: auto;
  max-width: 72px;
  cursor: pointer;
  background-color: transparent;
`;

const StyledRefreshLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 0;
`;

export default function DatasetInfoFactory() {
  const DatasetInfo: React.FC<DatasetInfoProps> = ({dataset, updateDatasetProps}) => {
    const intl = useIntl();
    const isRemote = dataset.type === DatasetType.EXTERNALLY_HOSTED;
    const intervalMs = getDatasetRefreshIntervalMs(dataset.metadata);
    const matchingOption = DATASET_REFRESH_INTERVAL_OPTIONS.find(
      option => option.value === intervalMs
    );
    const selectValue = matchingOption ? intervalMs : 0;

    const onRefreshIntervalChange = useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.stopPropagation();
        updateDatasetProps?.(dataset.id, {
          metadata: {refreshIntervalMs: Number(event.target.value) || 0}
        });
      },
      [dataset.id, updateDatasetProps]
    );

    return (
      <StyledDataRowCount className="source-data-rows">
        <FormattedMessage
          id={
            dataset.type === DatasetType.VECTOR_TILE
              ? 'datasetInfo.vectorTile'
              : dataset.type === DatasetType.RASTER_TILE
              ? 'datasetInfo.rasterTile'
              : dataset.type === DatasetType.WMS_TILE
              ? 'datasetInfo.wmsTile'
              : dataset.type === DatasetType.TILE_3D
              ? 'datasetInfo.tile3d'
              : dataset.type === DatasetType.BITMAP
              ? 'datasetInfo.bitmap'
              : isRemote
              ? 'datasetInfo.remoteFile'
              : 'datasetInfo.rowCount'
          }
          values={{rowCount: numFormat(dataset.dataContainer.numRows())}}
        />
        {isRemote && updateDatasetProps ? (
          <StyledRefreshLabel
            className="dataset-refresh-interval"
            onClick={event => event.stopPropagation()}
          >
            <FormattedMessage id="datasetInfo.refreshInterval" />
            <StyledRefreshSelect
              aria-label={intl.formatMessage({id: 'datasetInfo.refreshInterval'})}
              value={selectValue}
              onChange={onRefreshIntervalChange}
            >
              {DATASET_REFRESH_INTERVAL_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {intl.formatMessage({id: option.labelId})}
                </option>
              ))}
            </StyledRefreshSelect>
          </StyledRefreshLabel>
        ) : null}
      </StyledDataRowCount>
    );
  };

  return DatasetInfo;
}
