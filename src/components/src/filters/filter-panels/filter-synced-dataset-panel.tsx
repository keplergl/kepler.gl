// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';

import {FormattedMessage} from '@kepler.gl/localization';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {getAnimatableLayers} from '@kepler.gl/utils';

import {Button} from '../../common/styled-components';
import {Add} from '../../common/icons';
import TippyTooltip from '../../common/tippy-tooltip';
import FilterPanelHeaderFactory from '../../side-panel/filter-panel/filter-panel-header';
import SourceSelectorFactory from '../../side-panel/common/source-selector';
import SourceDataSelectorFactory from '../../side-panel/common/source-data-selector';

const SyncedDatasetsArea = styled.div`
  display: grid;
  align-items: center;
  grid-auto-rows: min-content;
  grid-auto-flow: row;
`;

const StyledContentTitle = styled.div`
  color: ${props => props.theme.subtextColor};
  margin-bottom: 8px;
`;

const StyledSeparator = styled.div`
  border-left: 1px dashed ${props => props.theme.subtextColor};
  height: 16px;
  margin-left: 8px;
`;

const StyledButton = styled(Button)`
  margin-top: 2px;
  padding: 2px;
`;

function getDatasetsWithTimeField(datasets) {
  const rv = {};
  for (const id of Object.keys(datasets)) {
    // TODO: change to
    if (datasets[id].fields.some(f => f.type === ALL_FIELD_TYPES.timestamp)) {
      rv[id] = datasets[id];
    }
  }
  return rv;
}

function getTimeFields(dataset) {
  return dataset.fields.filter(f => f.type === ALL_FIELD_TYPES.timestamp);
}

function DatasetItemFactory(SourceSelector, FilterPanelHeader) {
  const StyledFilterPanelHeader = styled(FilterPanelHeader)`
    display: flex;
    border: none;
    height: unset;
    padding: 2px 0;
    background: none;
    align-items: baseline;
  `;

  const StyledSourceSelector = styled(SourceSelector)`
    flex: 1;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background-color: transparent;
  `;

  const DatasetItem = ({
    dataId,
    datasets,
    supportedFields,
    idx,
    filter,
    index,
    onRemoveSyncedFilter,
    filterDatasetsNum,
    datasetsWithTimeNum,
    onSelectSyncedDataset,
    onFieldSelector
  }) => (
    <div>
      <StyledSeparator />
      <StyledFilterPanelHeader
        datasets={[datasets[dataId]]}
        allAvailableFields={supportedFields}
        idx={idx}
        filter={filter}
        removeFilter={() => onRemoveSyncedFilter(index)}
      >
        <StyledSourceSelector
          datasets={datasets}
          disabled={filterDatasetsNum >= datasetsWithTimeNum}
          dataId={dataId}
          onSelectDataset={datasetId => onSelectSyncedDataset(datasetId, index)}
          fields={getTimeFields(datasets[dataId])}
          fieldValue={filter.name[index]}
          onFieldSelector={field => onFieldSelector(field, index)}
        />
      </StyledFilterPanelHeader>
    </div>
  );

  return DatasetItem;
}

DatasetItemFactory.deps = [SourceSelectorFactory, FilterPanelHeaderFactory];

function SyncedDatasetButtonFactory() {
  const SyncedDatasetButton = ({onAddSyncedFilter}) => (
    <div>
      <StyledSeparator />
      <TippyTooltip
        delay={[500, 0]}
        placement="top"
        render={() => (
          <div>
            <FormattedMessage id={'tooltip.timeFilterSync'} />
          </div>
        )}
      >
        <StyledButton className="add-sync-dataset" secondary={true} onClick={onAddSyncedFilter}>
          <Add height="12px" />
          <FormattedMessage id={'filterManager.timeFilterSync'} />
        </StyledButton>
      </TippyTooltip>
    </div>
  );

  return SyncedDatasetButton;
}

function SyncLayerTimelineButtonFactory() {
  const SyncLayerTimelineButton = ({onSyncLayerTimeline}) => (
    <div>
      <StyledSeparator />
      <TippyTooltip
        delay={[500, 0]}
        placement="top"
        render={() => (
          <div>
            <FormattedMessage id={'tooltip.timeLayerSync'} />
          </div>
        )}
      >
        <StyledButton className="add-sync-dataset" secondary={true} onClick={onSyncLayerTimeline}>
          <Add height="12px" />
          <FormattedMessage id={'filterManager.timeLayerSync'} />
        </StyledButton>
      </TippyTooltip>
    </div>
  );

  return SyncLayerTimelineButton;
}

function UnsyncLayerTimelineButtonFactory() {
  const UnsyncLayerTimelineButton = ({onSyncLayerTimeline}) => (
    <div>
      <StyledSeparator />
      <TippyTooltip
        delay={[500, 0]}
        placement="top"
        render={() => (
          <div>
            <FormattedMessage id={'tooltip.timeLayerUnsync'} />
          </div>
        )}
      >
        <StyledButton className="add-sync-dataset" secondary={true} onClick={onSyncLayerTimeline}>
          <Add height="12px" />
          <FormattedMessage id={'filterManager.timeLayerUnsync'} />
        </StyledButton>
      </TippyTooltip>
    </div>
  );

  return UnsyncLayerTimelineButton;
}

function FilterSyncedDatasetPanelFactory(
  DatasetItem,
  SourceDataSelector,
  SyncedDatasetButton,
  SyncLayerTimelineButton,
  UnsyncLayerTimelineButton
) {
  const FilterSyncedDatasetPanel = ({
    datasets,
    layers,
    filter,
    setFilter,
    idx,
    supportedFields,
    onFieldSelector,
    onSourceDataSelector,
    syncTimeFilterWithLayerTimeline
  }) => {
    const datasetsWithTime = useMemo(() => getDatasetsWithTimeField(datasets), [datasets]);
    const filterDatasetsNum = useMemo(() => filter.dataId.length, [filter.dataId]);
    const datasetsWithTimeNum = useMemo(() => Object.keys(datasetsWithTime).length, [
      datasetsWithTime
    ]);

    const onRemoveSyncedFilter = useCallback(
      valueIndex => {
        setFilter(idx, 'dataId', null, valueIndex);
      },
      [idx, setFilter]
    );

    const onSelectSyncedDataset = useCallback(
      (datasetId, valueIndex) => {
        setFilter(idx, 'dataId', datasetId, valueIndex);
      },
      [setFilter, idx]
    );

    const onAddSyncedFilter = useCallback(() => {
      const nextId = Object.keys(datasetsWithTime).find(id => !filter.dataId.includes(id));
      if (!nextId) return;
      const timeFieldNames = getTimeFields(datasets[nextId])?.map(f => f.name);
      if (!timeFieldNames || timeFieldNames.length < 1) return;
      const nextName = timeFieldNames.includes(filter.name[0]) ? filter.name[0] : timeFieldNames[0];
      setFilter(idx, ['dataId', 'name'], [nextId, nextName], filter.dataId.length);
    }, [setFilter, idx, datasetsWithTime, datasets, filter.dataId, filter.name]);

    const onSyncLayerTimeline = useCallback(() => syncTimeFilterWithLayerTimeline(idx, true), [
      syncTimeFilterWithLayerTimeline,
      idx
    ]);

    const onRemoveSyncWithLayerTimeline = useCallback(
      () => syncTimeFilterWithLayerTimeline(idx, false),
      [syncTimeFilterWithLayerTimeline, idx]
    );

    const tripLayers = useMemo(() => getAnimatableLayers(layers).filter(l => l.type === 'trip'), [
      layers
    ]);

    const isLinkedWithLayerTimeline = useMemo(() => filter.syncedWithLayerTimeline, [filter]);

    return (
      <SyncedDatasetsArea>
        {filter.dataId.length > 1 ? (
          <>
            <StyledContentTitle>Datasets</StyledContentTitle>
            {filter.dataId.map((dataId, index) => {
              return (
                <DatasetItem
                  key={dataId}
                  dataId={dataId}
                  index={index}
                  datasets={datasets}
                  supportedFields={supportedFields}
                  idx={idx}
                  filter={filter}
                  onRemoveSyncedFilter={onRemoveSyncedFilter}
                  filterDatasetsNum={filterDatasetsNum}
                  datasetsWithTimeNum={datasetsWithTimeNum}
                  onSelectSyncedDataset={onSelectSyncedDataset}
                  onFieldSelector={onFieldSelector}
                />
              );
            })}
          </>
        ) : (
          <>
            <SourceDataSelector
              inputTheme="secondary"
              datasets={datasets}
              dataId={Array.isArray(filter.dataId) ? filter.dataId[0] : filter.dataId}
              onSelect={onSourceDataSelector}
            />
          </>
        )}
        {isLinkedWithLayerTimeline ? (
          <UnsyncLayerTimelineButton onSyncLayerTimeline={onRemoveSyncWithLayerTimeline} />
        ) : (
          <>
            {tripLayers.length && (
              <SyncLayerTimelineButton onSyncLayerTimeline={onSyncLayerTimeline} />
            )}
          </>
        )}
        {filterDatasetsNum < datasetsWithTimeNum && (
          <SyncedDatasetButton onAddSyncedFilter={onAddSyncedFilter} />
        )}
      </SyncedDatasetsArea>
    );
  };

  FilterSyncedDatasetPanel.displayName = 'FilterSyncedDatasetPanel';

  return FilterSyncedDatasetPanel;
}

FilterSyncedDatasetPanelFactory.deps = [
  DatasetItemFactory,
  SourceDataSelectorFactory,
  SyncedDatasetButtonFactory,
  SyncLayerTimelineButtonFactory,
  UnsyncLayerTimelineButtonFactory
];

export default FilterSyncedDatasetPanelFactory;
