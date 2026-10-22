// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import styled, {withTheme} from 'styled-components';

import {FormattedMessage} from '@kepler.gl/localization';
import {FILTER_TYPES} from '@kepler.gl/constants';
import {areFilterFieldTypesCompatible, getAnimatableVisibleLayers} from '@kepler.gl/utils';

import {Button} from '../../common/styled-components';
import {Add, Trash} from '../../common/icons';
import TippyTooltip from '../../common/tippy-tooltip';
import PanelHeaderActionFactory from '../../side-panel/panel-header-action';
import SourceSelectorFactory from '../../side-panel/common/source-selector';
import SourceDataSelectorFactory from '../../side-panel/common/source-data-selector';
import LayerTypeListItemFactory from '../../side-panel/layer-panel/layer-type-list-item';

const TrashIcon = styled(Trash)`
  cursor: pointer;
  color: ${props => props.theme.fontWhiteColor};
  margin-left: 8px;
`;

const SyncedDatasetsArea = styled.div`
  margin-bottom: 12px;

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

const StyledIconButton = styled.button`
  appearance: none;
  align-items: center;
  background: transparent;
  border: 0;
  color: ${props => props.theme.panelHeaderIcon};
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  width: 16px;
  height: ${props => props.theme.inputBoxHeight};
  margin: 0 0 0 4px;
  padding: 0;
  flex: 0 0 auto;

  &:hover,
  &:focus {
    color: ${props => props.theme.panelHeaderIconHover};
  }

  svg {
    margin-right: 0;
  }
`;

const StyledSourceDataRow = styled.div`
  display: flex;
  align-items: flex-end;

  .data-source-selector {
    flex: 1;
    min-width: 0;
  }
`;

function getFilterFieldType(datasets, filter) {
  const firstDataset = datasets[filter.dataId[0]];
  const firstField = firstDataset?.fields.find(field => field.name === filter.name[0]);

  return firstField?.type || filter.fieldType;
}

function getFieldsByType(dataset, fieldType) {
  if (!dataset || !fieldType) {
    return [];
  }

  return dataset.fields.filter(
    field =>
      areFilterFieldTypesCompatible(fieldType, field.type) &&
      (!dataset.supportedFilterTypes || dataset.supportedFilterTypes.includes(field.type))
  );
}

function getDatasetsWithFieldType(datasets, fieldType) {
  const rv = {};
  for (const id of Object.keys(datasets)) {
    if (getFieldsByType(datasets[id], fieldType).length) {
      rv[id] = datasets[id];
    }
  }
  return rv;
}

function getSelectableDatasets(datasets, compatibleDatasets, filterDataIds, currentDataId) {
  const selectableDatasets = {};
  for (const id of Object.keys(compatibleDatasets)) {
    if (id === currentDataId || !filterDataIds.includes(id)) {
      selectableDatasets[id] = compatibleDatasets[id];
    }
  }

  // Keep malformed or legacy selections visible so users can repair them.
  if (datasets[currentDataId] && !selectableDatasets[currentDataId]) {
    selectableDatasets[currentDataId] = datasets[currentDataId];
  }

  return selectableDatasets;
}

export function DatasetItemFactory(SourceSelector, PanelHeaderAction) {
  const StyledDatasetItemHeader = styled.div`
    display: flex;
    width: 100%;
    min-width: 0;
    border: none;
    height: unset;
    padding: 2px 0;
    background: none;
    align-items: baseline;
  `;

  const StyledSourceSelector = styled(SourceSelector)`
    flex: 1;
    min-width: 0;
    overflow: hidden;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background-color: transparent;
  `;

  // Check if this component already exists
  const DatasetItem = ({
    dataId,
    datasets,
    fields,
    filter,
    index,
    onRemoveSyncedFilter,
    filterDatasetsNum,
    compatibleDatasetsNum,
    onSelectSyncedDataset,
    onFieldSelector,
    addButton
  }) => (
    <div>
      <StyledSeparator />
      <StyledDatasetItemHeader>
        <StyledSourceSelector
          datasets={datasets}
          disabled={filterDatasetsNum >= compatibleDatasetsNum}
          dataId={dataId}
          onSelectDataset={datasetId => onSelectSyncedDataset(datasetId, index)}
          fields={fields}
          fieldValue={filter.name[index]}
          onFieldSelector={field => onFieldSelector(field, index)}
        />
        {addButton}
        <PanelHeaderAction
          id={`${filter.id}-${dataId}`}
          tooltip="tooltip.delete"
          tooltipType="error"
          hoverColor="errorColor"
          onClick={() => onRemoveSyncedFilter(index)}
          IconComponent={Trash}
        />
      </StyledDatasetItemHeader>
    </div>
  );

  return DatasetItem;
}

DatasetItemFactory.deps = [SourceSelectorFactory, PanelHeaderActionFactory];

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

export function SyncedDatasetButtonFactory() {
  const SyncedDatasetButton = ({onAddSyncedFilter}) => {
    const intl = useIntl();
    const label = intl.formatMessage({
      id: 'tooltip.timeFilterSync',
      defaultMessage: 'Add synced filter'
    });

    return (
      <TippyTooltip delay={[500, 0]} placement="top" render={() => <div>{label}</div>}>
        <StyledIconButton
          aria-label={label}
          className="add-sync-dataset"
          type="button"
          onClick={onAddSyncedFilter}
        >
          <Add height="16px" />
        </StyledIconButton>
      </TippyTooltip>
    );
  };

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

type FilterSyncedDatasetPanelProps = {
  datasets: Record<string, any>;
  layers?: ReadonlyArray<any>;
  filter: any;
  setFilter: (...args: any[]) => void;
  idx: number;
  onFieldSelector: (...args: any[]) => void;
  onSourceDataSelector: (...args: any[]) => void;
  syncTimeFilterWithLayerTimeline?: (idx: number, enable: boolean) => void;
  showSourceDataSelector?: boolean;
};

function FilterSyncedDatasetPanelFactory(
  DatasetItem,
  LayerTimeline,
  SourceDataSelector,
  SyncedDatasetButton,
  SyncLayerTimelineButton
) {
  const FilterSyncedDatasetPanel = ({
    datasets,
    layers = [],
    filter,
    setFilter,
    idx,
    onFieldSelector,
    onSourceDataSelector,
    syncTimeFilterWithLayerTimeline,
    showSourceDataSelector = true
  }: FilterSyncedDatasetPanelProps) => {
    const [pendingDataId, setPendingDataId] = useState<string | null>(null);
    const fieldType = useMemo(() => getFilterFieldType(datasets, filter), [datasets, filter]);
    const compatibleDatasets = useMemo(
      () => getDatasetsWithFieldType(datasets, fieldType),
      [datasets, fieldType]
    );
    const filterDatasetsNum = useMemo(() => filter.dataId.length, [filter.dataId]);
    const compatibleDatasetsNum = useMemo(
      () => Object.keys(compatibleDatasets).length,
      [compatibleDatasets]
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
      const nextId = Object.keys(compatibleDatasets).find(id => !filter.dataId.includes(id));
      if (!nextId) return;
      const fieldNames = getFieldsByType(datasets[nextId], fieldType).map(field => field.name);
      if (!fieldNames.length) return;
      const matchingName = fieldNames.find(fieldName => fieldName === filter.name[0]);
      if (matchingName || fieldNames.length === 1) {
        setFilter(
          idx,
          ['dataId', 'name'],
          [nextId, matchingName || fieldNames[0]],
          filter.dataId.length
        );
      } else {
        setPendingDataId(nextId);
      }
    }, [setFilter, idx, compatibleDatasets, datasets, fieldType, filter.dataId, filter.name]);

    const onSelectPendingDataset = useCallback(datasetId => setPendingDataId(datasetId), []);

    const onSelectPendingField = useCallback(
      field => {
        if (!pendingDataId) return;
        setFilter(idx, ['dataId', 'name'], [pendingDataId, field.name], filter.dataId.length);
        setPendingDataId(null);
      },
      [filter.dataId.length, idx, pendingDataId, setFilter]
    );

    const onCancelPendingDataset = useCallback(() => setPendingDataId(null), []);

    const onSyncLayerTimeline = useCallback(
      () => syncTimeFilterWithLayerTimeline?.(idx, true),
      [syncTimeFilterWithLayerTimeline, idx]
    );

    const onRemoveSyncWithLayerTimeline = useCallback(
      () => syncTimeFilterWithLayerTimeline?.(idx, false),
      [syncTimeFilterWithLayerTimeline, idx]
    );

    const isTimeRange = filter.type === FILTER_TYPES.timeRange;
    const animatableLayers = useMemo(
      () => (isTimeRange ? getAnimatableVisibleLayers([...layers]) : []),
      [isTimeRange, layers]
    );

    const isLinkedWithLayerTimeline = isTimeRange && filter.syncedWithLayerTimeline;
    const activePendingDataId =
      pendingDataId && compatibleDatasets[pendingDataId] && !filter.dataId.includes(pendingDataId)
        ? pendingDataId
        : null;
    const canAddSyncedDataset = !activePendingDataId && filterDatasetsNum < compatibleDatasetsNum;

    return (
      <SyncedDatasetsArea>
        {filter.dataId.length > 1 ? (
          <>
            <StyledContentTitle>Datasets</StyledContentTitle>
            {filter.dataId.map((dataId, index) => {
              const selectableDatasets = getSelectableDatasets(
                datasets,
                compatibleDatasets,
                filter.dataId,
                dataId
              );
              return (
                <DatasetItem
                  key={`${dataId}-${index}`}
                  dataId={dataId}
                  index={index}
                  datasets={selectableDatasets}
                  fields={getFieldsByType(datasets[dataId], fieldType)}
                  idx={idx}
                  filter={filter}
                  onRemoveSyncedFilter={onRemoveSyncedFilter}
                  filterDatasetsNum={filterDatasetsNum}
                  compatibleDatasetsNum={compatibleDatasetsNum}
                  onSelectSyncedDataset={onSelectSyncedDataset}
                  onFieldSelector={onFieldSelector}
                  addButton={
                    canAddSyncedDataset && index === filter.dataId.length - 1 ? (
                      <SyncedDatasetButton onAddSyncedFilter={onAddSyncedFilter} />
                    ) : null
                  }
                />
              );
            })}
          </>
        ) : showSourceDataSelector ? (
          <StyledSourceDataRow>
            <SourceDataSelector
              inputTheme="secondary"
              datasets={datasets}
              dataId={Array.isArray(filter.dataId) ? filter.dataId[0] : filter.dataId}
              onSelect={onSourceDataSelector}
            />
            {canAddSyncedDataset ? (
              <SyncedDatasetButton onAddSyncedFilter={onAddSyncedFilter} />
            ) : null}
          </StyledSourceDataRow>
        ) : null}
        {activePendingDataId ? (
          <DatasetItem
            key={`pending-${activePendingDataId}`}
            dataId={activePendingDataId}
            index={filter.dataId.length}
            datasets={getSelectableDatasets(
              datasets,
              compatibleDatasets,
              filter.dataId,
              activePendingDataId
            )}
            fields={getFieldsByType(datasets[activePendingDataId], fieldType)}
            idx={idx}
            filter={filter}
            onRemoveSyncedFilter={onCancelPendingDataset}
            filterDatasetsNum={filterDatasetsNum}
            compatibleDatasetsNum={compatibleDatasetsNum}
            onSelectSyncedDataset={onSelectPendingDataset}
            onFieldSelector={onSelectPendingField}
          />
        ) : null}
        {/** sync time filters with animatable layers */}
        {isTimeRange && syncTimeFilterWithLayerTimeline ? (
          isLinkedWithLayerTimeline ? (
            <>
              <StyledSeparator />
              <LayerTimeline layers={animatableLayers} onDelete={onRemoveSyncWithLayerTimeline} />
            </>
          ) : animatableLayers.length ? (
            <SyncLayerTimelineButton onSyncLayerTimeline={onSyncLayerTimeline} />
          ) : null
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
