// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import TimeRangeFilterFactory from '../time-range-filter';
import {Add, Clock} from '../../common/icons';
import FieldPanelWithFieldSelectFactory from './filter-panel-with-field-select';
import {TimeRangeFilterPanelComponent} from './types';
import {isSideFilter, getTimelineFromFilter} from '@kepler.gl/utils';
import FilterPanelHeaderFactory from '../../side-panel/filter-panel/filter-panel-header';
import PanelHeaderActionFactory from '../../side-panel/panel-header-action';
import SourceDataSelectorFactory from '../../side-panel/common/source-data-selector';
import FieldSelectorFactory from '../../common/field-selector';
import {FormattedMessage} from '@kepler.gl/localization';
import {Button, StyledFilterContent} from '../../common/styled-components';
import {getSupportedFilterFields} from './new-filter-panel';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import TippyTooltip from '../../common/tippy-tooltip';

const SyncedDatasetsArea = styled.div`
  display: flex;
  flex-direction: column;
  & > * + * {
    margin-top: 10px;
  }
`;

const SyncedDatasetFieldArea = styled.div`
  padding: 10px;
  border: ${props => props.theme.panelBorder};
  .side-panel-section {
    margin-bottom: 0;
  }
  & > * + * {
    margin-top: 10px;
  }
`;

TimeRangeFilterPanelFactory.deps = [
  FieldPanelWithFieldSelectFactory,
  TimeRangeFilterFactory,
  FilterPanelHeaderFactory,
  SourceDataSelectorFactory,
  FieldSelectorFactory,
  PanelHeaderActionFactory
];

function TimeRangeFilterPanelFactory(
  FieldPanelWithFieldSelect: ReturnType<typeof FieldPanelWithFieldSelectFactory>,
  TimeRangeFilter: ReturnType<typeof TimeRangeFilterFactory>,
  FilterPanelHeader: ReturnType<typeof FilterPanelHeaderFactory>,
  SourceDataSelector: ReturnType<typeof SourceDataSelectorFactory>,
  FieldSelector: ReturnType<typeof FieldSelectorFactory>,
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>
) {
  const TimeRangeFilterPanel: TimeRangeFilterPanelComponent = React.memo(
    ({
      idx,
      datasets,
      allAvailableFields,
      filter,
      enlargeFilter,
      setFilter,
      setFilterPlot,
      removeFilter,
      toggleAnimation
    }) => {
      const onSetFilterValue = useCallback(value => setFilter(idx, 'value', value), [
        idx,
        setFilter
      ]);

      const totalDatasetsNum = useMemo(() => Object.keys(datasets).length, [datasets]);
      const datasetsWithTime = useMemo(() => getDatasetsWithTimeField(datasets), [datasets]);
      const datasetsWithTimeNum = useMemo(() => Object.keys(datasetsWithTime).length, [
        datasetsWithTime
      ]);
      const filterDatasetsNum = useMemo(() => filter.dataId.length, [filter]);
      const onSetFilterPlot = useCallback(
        (newProp, valueIndex) => setFilterPlot(idx, newProp, valueIndex),
        [idx, setFilterPlot]
      );

      const isEnlarged = useMemo(() => !isSideFilter(filter), [filter]);

      const panelActions = useMemo(
        () => [
          {
            id: filter.id,
            onClick: enlargeFilter,
            tooltip: 'tooltip.timePlayback',
            iconComponent: Clock,
            active: isEnlarged
          }
        ],
        [filter.id, isEnlarged, enlargeFilter]
      );

      const onAddSyncedFilter = () => {
        const nextId = Object.keys(datasetsWithTime).find(id => !filter.dataId.includes(id));
        if (!nextId) return;
        const timeFieldNames = getTimeFields(datasets[nextId])?.map(f => f.name);
        if (!timeFieldNames || timeFieldNames.length < 1) return;
        const nextName = timeFieldNames.includes(filter.name[0])
          ? filter.name[0]
          : timeFieldNames[0];
        setFilter(idx, ['dataId', 'name'], [nextId, nextName], filter.dataId.length);
      };

      const onRemoveSyncedFilter = valueIndex => {
        setFilter(idx, 'dataId', null, valueIndex);
      };

      const onSelectSyncedDataset = (datasetId, valueIndex) => {
        setFilter(idx, 'dataId', datasetId, valueIndex);
      };

      const onFieldSelector = (field, valueIndex) => setFilter(idx, 'name', field.name, valueIndex);

      const onSourceDataSelector = useCallback(value => setFilter(idx, 'dataId', value, 0), [
        idx,
        setFilter
      ]);

      const dataset = datasets[filter.dataId[0]];
      const supportedFields = useMemo(
        () => getSupportedFilterFields(dataset.supportedFilterTypes, allAvailableFields),
        [dataset.supportedFilterTypes, allAvailableFields]
      );

      const timeline = getTimelineFromFilter(filter);

      return (
        <>
          <FilterPanelHeader
            datasets={[dataset]}
            allAvailableFields={supportedFields}
            idx={idx}
            filter={filter}
            removeFilter={removeFilter}
          >
            <FieldSelector
              inputTheme="secondary"
              fields={supportedFields}
              value={Array.isArray(filter.name) ? filter.name[0] : filter.name}
              erasable={false}
              onSelect={field => onFieldSelector(field, 0)}
            />
            {panelActions &&
              panelActions.map(panelAction => (
                <PanelHeaderAction
                  id={panelAction.id}
                  key={panelAction.id}
                  onClick={panelAction.onClick}
                  tooltip={panelAction.tooltip}
                  IconComponent={panelAction.iconComponent}
                  active={panelAction.active}
                />
              ))}
          </FilterPanelHeader>
          <StyledFilterContent className="filter-panel__content">
            {totalDatasetsNum > 1 && (
              <SyncedDatasetsArea>
                {/* Only shon when there fiter is not synced */}
                <SourceDataSelector
                  inputTheme="secondary"
                  datasets={datasets}
                  dataId={Array.isArray(filter.dataId) ? filter.dataId[0] : filter.dataId}
                  onSelect={onSourceDataSelector}
                />

                {filter.dataId.slice(1).map((dataId, index) => {
                  const filteredDatasets = {...datasets};
                  for (const id of filter.dataId) {
                    // remove others which are already in the filter
                    if (id !== dataId) delete filteredDatasets[id];
                  }
                  const valueIndex = index + 1;
                  return (
                    <SyncedDatasetFieldArea key={dataId}>
                      <FilterPanelHeader
                        datasets={[datasets[dataId]]}
                        allAvailableFields={supportedFields}
                        idx={idx}
                        filter={filter}
                        removeFilter={() => onRemoveSyncedFilter(valueIndex)}
                      >
                        <FieldSelector
                          inputTheme="secondary"
                          fields={getTimeFields(datasets[dataId])}
                          value={filter.name[valueIndex]}
                          erasable={false}
                          onSelect={field => onFieldSelector(field, valueIndex)}
                        />
                      </FilterPanelHeader>

                      <SourceDataSelector
                        inputTheme="secondary"
                        datasets={filteredDatasets}
                        disabled={filterDatasetsNum >= datasetsWithTimeNum}
                        dataId={dataId}
                        onSelect={datasetId => onSelectSyncedDataset(datasetId, valueIndex)}
                      />
                    </SyncedDatasetFieldArea>
                  );
                })}

                {filterDatasetsNum < datasetsWithTimeNum && (
                  <div>
                    <TippyTooltip
                      delay={[500, 0]}
                      placement="top"
                      render={() => (
                        <div>
                          <FormattedMessage id={'tooltip.timeFilterSync'} />
                        </div>
                      )}
                    >
                      <Button className="add-sync-dataset" small={true} onClick={onAddSyncedFilter}>
                        <Add height="12px" />
                        <FormattedMessage id={'filterManager.timeFilterSync'} />
                      </Button>
                    </TippyTooltip>
                  </div>
                )}
              </SyncedDatasetsArea>
            )}
            {filter.type && !isEnlarged && (
              <div className="filter-panel__filter">
                <TimeRangeFilter
                  filter={filter}
                  datasets={datasets}
                  idx={idx}
                  toggleAnimation={toggleAnimation}
                  setFilter={onSetFilterValue}
                  setFilterPlot={onSetFilterPlot}
                  isAnimatable
                  hideTimeTitle
                  timeline={timeline}
                />
              </div>
            )}
          </StyledFilterContent>
        </>
      );
    }
  );

  TimeRangeFilterPanel.displayName = 'TimeRangeFilterPanel';

  return TimeRangeFilterPanel;
}

export default TimeRangeFilterPanelFactory;

const TIME_FIELD_ANALYZER_TYPES = ['DATE', 'TIME', 'DATETIME'];

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
  return dataset.fields.filter(f => TIME_FIELD_ANALYZER_TYPES.includes(f.analyzerType));
}
