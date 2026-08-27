// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import {format} from 'd3-format';
import {useIntl} from 'react-intl';

import {
  DatasetType,
  DATASET_REFRESH_CUSTOM_VALUE,
  DATASET_REFRESH_DEFAULT_CUSTOM_MS,
  DATASET_REFRESH_INTERVAL_OPTIONS,
  getDatasetRefreshIntervalMs,
  isPresetDatasetRefreshInterval,
  parseCustomRefreshIntervalMs
} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import {DataContainerInterface} from '@kepler.gl/utils';
import {VisStateActions, ActionHandler} from '@kepler.gl/actions';
import {Reset} from '../../common/icons';
import {Tooltip} from '../../common/styled-components';
import DatasetRefreshProgressIcon from './dataset-refresh-progress';

const numFormat = format(',');

type MiniDataset = {
  id: string;
  dataContainer: DataContainerInterface;
  type?: string;
  metadata?: {
    refreshIntervalMs?: number;
    refreshStatus?: string;
    refreshError?: string;
    refreshProgress?: number;
  };
};

export type DatasetInfoProps = {
  dataset: MiniDataset;
  showRefreshSettings?: boolean;
  refreshDataset?: ActionHandler<typeof VisStateActions.refreshDataset>;
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

const StyledRefreshing = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.theme.textColorHl};
`;

const StyledRefreshSettings = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const StyledRefreshLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 0;
`;

const StyledRefreshSelect = styled.select`
  ${props => props.theme.input};
  height: 18px;
  font-size: 11px;
  padding: 0 4px;
  width: auto;
  max-width: 96px;
  cursor: pointer;
  background-color: transparent;
`;

const StyledCustomSeconds = styled.input`
  ${props => props.theme.input};
  height: 18px;
  font-size: 11px;
  padding: 0 4px;
  width: 44px;
  background-color: transparent;
`;

const StyledCustomUnit = styled.span`
  font-size: 11px;
`;

const StyledRefreshError = styled.div`
  width: 100%;
  font-size: 11px;
  color: ${props => props.theme.errorColor};
`;

const StyledRefreshNow = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${props => props.theme.subtextColor};
  cursor: pointer;
  width: 14px;
  height: 14px;

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    color: ${props => props.theme.textColorHl};
  }
`;

export default function DatasetInfoFactory() {
  const DatasetInfo: React.FC<DatasetInfoProps> = ({
    dataset,
    showRefreshSettings,
    refreshDataset,
    updateDatasetProps
  }) => {
    const intl = useIntl();
    const isRemote = dataset.type === DatasetType.EXTERNALLY_HOSTED;
    const intervalMs = getDatasetRefreshIntervalMs(dataset.metadata);
    const matchingOption = DATASET_REFRESH_INTERVAL_OPTIONS.find(
      option => option.value === intervalMs
    );
    const isCustomInterval = intervalMs > 0 && !isPresetDatasetRefreshInterval(intervalMs);
    const [customMode, setCustomMode] = useState(isCustomInterval);
    const [customSeconds, setCustomSeconds] = useState(() =>
      String(Math.max(1, Math.round((intervalMs || DATASET_REFRESH_DEFAULT_CUSTOM_MS) / 1000)))
    );
    const showCustomInput = customMode || isCustomInterval;
    const selectValue = showCustomInput
      ? DATASET_REFRESH_CUSTOM_VALUE
      : String(matchingOption ? matchingOption.value : 0);

    useEffect(() => {
      const ms = getDatasetRefreshIntervalMs(dataset.metadata);
      const custom = ms > 0 && !isPresetDatasetRefreshInterval(ms);
      setCustomMode(custom);
      setCustomSeconds(
        String(Math.max(1, Math.round((ms || DATASET_REFRESH_DEFAULT_CUSTOM_MS) / 1000)))
      );
    }, [dataset.id, dataset.metadata?.refreshIntervalMs]);

    const spinning = dataset.metadata?.refreshStatus === 'loading';
    const progress =
      typeof dataset.metadata?.refreshProgress === 'number'
        ? dataset.metadata.refreshProgress
        : undefined;
    const showPercent = spinning && typeof progress === 'number' && progress > 0 && progress < 100;
    const showRefreshControls = Boolean(
      showRefreshSettings && isRemote && (refreshDataset || updateDatasetProps)
    );

    const onRefreshNow = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!spinning) {
          refreshDataset?.(dataset.id);
        }
      },
      [dataset.id, refreshDataset, spinning]
    );

    const commitCustomInterval = useCallback(
      (secondsText: string) => {
        const nextMs = parseCustomRefreshIntervalMs(secondsText);
        if (nextMs == null) {
          setCustomSeconds(
            String(
              Math.max(1, Math.round((intervalMs || DATASET_REFRESH_DEFAULT_CUSTOM_MS) / 1000))
            )
          );
          return;
        }
        setCustomSeconds(String(nextMs / 1000));
        if (nextMs !== intervalMs) {
          updateDatasetProps?.(dataset.id, {metadata: {refreshIntervalMs: nextMs}});
        }
      },
      [dataset.id, intervalMs, updateDatasetProps]
    );

    const onRefreshIntervalChange = useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.stopPropagation();
        const value = event.target.value;
        if (value === DATASET_REFRESH_CUSTOM_VALUE) {
          const seconds = Math.max(
            1,
            Math.round((intervalMs || DATASET_REFRESH_DEFAULT_CUSTOM_MS) / 1000)
          );
          setCustomMode(true);
          setCustomSeconds(String(seconds));
          if (!intervalMs) {
            updateDatasetProps?.(dataset.id, {
              metadata: {refreshIntervalMs: seconds * 1000}
            });
          }
          return;
        }
        setCustomMode(false);
        updateDatasetProps?.(dataset.id, {
          metadata: {refreshIntervalMs: Number(value) || 0}
        });
      },
      [dataset.id, intervalMs, updateDatasetProps]
    );

    return (
      <StyledDataRowCount className="source-data-rows" aria-busy={spinning}>
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
        {spinning ? (
          <StyledRefreshing className="dataset-refresh-status">
            <DatasetRefreshProgressIcon percent={progress} size={12} />
            <FormattedMessage
              id={showPercent ? 'datasetInfo.refreshingPercent' : 'datasetInfo.refreshing'}
              values={{percent: Math.round(progress ?? 0)}}
            />
          </StyledRefreshing>
        ) : null}
        {showRefreshControls ? (
          <StyledRefreshSettings
            className="dataset-refresh-settings"
            onClick={event => event.stopPropagation()}
          >
            {updateDatasetProps ? (
              <StyledRefreshLabel>
                <FormattedMessage id="datasetInfo.refreshInterval" />
                <StyledRefreshSelect
                  aria-label={intl.formatMessage({id: 'datasetInfo.refreshInterval'})}
                  value={selectValue}
                  onChange={onRefreshIntervalChange}
                >
                  {DATASET_REFRESH_INTERVAL_OPTIONS.map(option => (
                    <option key={option.value} value={String(option.value)}>
                      {intl.formatMessage({id: option.labelId})}
                    </option>
                  ))}
                  <option value={DATASET_REFRESH_CUSTOM_VALUE}>
                    {intl.formatMessage({id: 'datasetTitle.refreshCustom'})}
                  </option>
                </StyledRefreshSelect>
                {showCustomInput ? (
                  <>
                    <StyledCustomSeconds
                      type="number"
                      min={1}
                      step={1}
                      inputMode="numeric"
                      className="dataset-refresh-custom-seconds"
                      aria-label={intl.formatMessage({id: 'datasetInfo.refreshCustomSeconds'})}
                      value={customSeconds}
                      onChange={event => {
                        event.stopPropagation();
                        setCustomSeconds(event.target.value);
                      }}
                      onBlur={event => commitCustomInterval(event.target.value)}
                      onKeyDown={event => {
                        event.stopPropagation();
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          commitCustomInterval(customSeconds);
                          (event.target as HTMLInputElement).blur();
                        }
                      }}
                    />
                    <StyledCustomUnit>s</StyledCustomUnit>
                  </>
                ) : null}
              </StyledRefreshLabel>
            ) : null}
            {refreshDataset ? (
              <StyledRefreshNow
                type="button"
                className="dataset-refresh-now"
                aria-label={intl.formatMessage({id: 'datasetTitle.refreshDataset'})}
                data-tip
                data-for={`refresh-now-${dataset.id}`}
                disabled={spinning}
                onClick={onRefreshNow}
              >
                <Reset height="14px" />
                <Tooltip id={`refresh-now-${dataset.id}`} effect="solid">
                  <span>
                    <FormattedMessage id={'datasetTitle.refreshDataset'} />
                  </span>
                </Tooltip>
              </StyledRefreshNow>
            ) : null}
            {dataset.metadata?.refreshError ? (
              <StyledRefreshError>{dataset.metadata.refreshError}</StyledRefreshError>
            ) : null}
          </StyledRefreshSettings>
        ) : null}
      </StyledDataRowCount>
    );
  };

  return DatasetInfo;
}
