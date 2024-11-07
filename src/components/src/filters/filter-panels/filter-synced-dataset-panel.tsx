// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled, {withTheme} from 'styled-components';

import {FormattedMessage} from '@kepler.gl/localization';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {getAnimatableVisibleLayers} from '@kepler.gl/utils';

import {Button} from '../../common/styled-components';
import {Add, Trash} from '../../common/icons';
import TippyTooltip from '../../common/tippy-tooltip';
import FilterPanelHeaderFactory from '../../side-panel/filter-panel/filter-panel-header';
import SourceSelectorFactory from '../../side-panel/common/source-selector';
import SourceDataSelectorFactory from '../../side-panel/common/source-data-selector';
import LayerTypeListItemFactory from '../../side-panel/layer-panel/layer-type-list-item';

const TrashIcon = styled(Trash)`
  cursor: pointer;
  color: ${props => props.theme.fontWhiteColor};
  margin-left: 8px;
`;

const SyncedDatasetsArea = styled.div`
  display: grid;
  align-items: center;
  grid-auto-rows: min-content;
  grid-auto-flow: row;

  .side-panel-section {
    margin-bottom: 0;
  }
`;

const StyledContentTitle = styled.div`
  color: ${props => props.theme.subtextColor};
  margin-bottom: 8px;
`;

const StyledSeparator = styled.div`
  border-left: 1px dashed ${props => props.theme.subtextColor};
  height: 16px;
  margin: 4px 0 4px 8px;
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

  // Check if this component already exists
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

const StyledLayerTimeline = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLayerList = styled.div`
  flex: 1;
`;

function LayerTimelineFactory(LayerTypeListItem) {
  const StyledLayerTypeListItem = styled(LayerTypeListItem)`
    background-color: ${props => props.theme.dropdownListHighlightBg};
    padding: 4px;
  `;

  const LayerTimeline = ({layers, theme, onDelete}) => (
    <StyledLayerTimeline>
      <StyledLayerList>
        {layers.map(layer => (
          <StyledLayerTypeListItem
            key={layer.id}
            value={{icon: layer.layerIcon, label: layer.name}}
            theme={{...theme, layerTypeIconSizeSM: 24}}
          />
        ))}
      </StyledLayerList>
      <TrashIcon height="12px" width="12px" onClick={onDelete} />
    </StyledLayerTimeline>
  );

  return withTheme(LayerTimeline);
}

LayerTimelineFactory.deps = [LayerTypeListItemFactory];

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

function FilterSyncedDatasetPanelFactory(
  DatasetItem,
  LayerTimeline,
  SourceDataSelector,
  SyncedDatasetButton,
  SyncLayerTimelineButton
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
    const datasetsWithTimeNum = useMemo(
      () => Object.keys(datasetsWithTime).length,
      [datasetsWithTime]
    );

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

    const onSyncLayerTimeline = useCallback(
      () => syncTimeFilterWithLayerTimeline(idx, true),
      [syncTimeFilterWithLayerTimeline, idx]
    );

    const onRemoveSyncWithLayerTimeline = useCallback(
      () => syncTimeFilterWithLayerTimeline(idx, false),
      [syncTimeFilterWithLayerTimeline, idx]
    );

    const animatableLayers = useMemo(() => getAnimatableVisibleLayers(layers), [layers]);

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
          <>
            <StyledSeparator />
            <LayerTimeline layers={animatableLayers} onDelete={onRemoveSyncWithLayerTimeline} />
          </>
        ) : (
          <>
            {animatableLayers.length ? (
              <SyncLayerTimelineButton onSyncLayerTimeline={onSyncLayerTimeline} />
            ) : null}
          </>
        )}
        {filterDatasetsNum < datasetsWithTimeNum ? (
          <SyncedDatasetButton onAddSyncedFilter={onAddSyncedFilter} />
        ) : null}
      </SyncedDatasetsArea>
    );
  };

  FilterSyncedDatasetPanel.displayName = 'FilterSyncedDatasetPanel';

  return FilterSyncedDatasetPanel;
}

FilterSyncedDatasetPanelFactory.deps = [
  DatasetItemFactory,
  LayerTimelineFactory,
  SourceDataSelectorFactory,
  SyncedDatasetButtonFactory,
  SyncLayerTimelineButtonFactory
];

export default FilterSyncedDatasetPanelFactory;
