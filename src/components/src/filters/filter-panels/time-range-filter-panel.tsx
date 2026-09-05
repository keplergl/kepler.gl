// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import TimeRangeFilterFactory from '../time-range-filter';
import {Clock} from '../../common/icons';
import {TimeRangeFilterPanelComponent} from './types';
import {isSideFilter, getTimelineFromFilter} from '@kepler.gl/utils';
import FilterPanelHeaderFactory from '../../side-panel/filter-panel/filter-panel-header';
import PanelHeaderActionFactory from '../../side-panel/panel-header-action';
import FieldSelectorFactory from '../../common/field-selector';
import {PanelLabel, SidePanelSection, StyledFilterContent} from '../../common/styled-components';
import {getSupportedFilterFields} from './new-filter-panel';
import {ALL_FIELD_TYPES, FILTER_TYPES} from '@kepler.gl/constants';
import TimeSyncedFieldSelectorFactory from './time-synced-field-selector';
import FilterSyncedDatasetPanelFactory from './filter-synced-dataset-panel';
import {FormattedMessage} from '@kepler.gl/localization';

const SYNC_FILTER_ID_LENGTH = 2;

const EndFieldHint = styled.div`
  color: ${props => props.theme.subtextColor};
  font-size: 11px;
  line-height: 1.4;
  margin-top: 6px;
`;

TimeRangeFilterPanelFactory.deps = [
  TimeRangeFilterFactory,
  FilterPanelHeaderFactory,
  FieldSelectorFactory,
  PanelHeaderActionFactory,
  TimeSyncedFieldSelectorFactory,
  FilterSyncedDatasetPanelFactory
];

function TimeRangeFilterPanelFactory(
  TimeRangeFilter: ReturnType<typeof TimeRangeFilterFactory>,
  FilterPanelHeader: ReturnType<typeof FilterPanelHeaderFactory>,
  FieldSelector: ReturnType<typeof FieldSelectorFactory>,
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>,
  TimeSyncedFieldSelector: ReturnType<typeof TimeSyncedFieldSelectorFactory>,
  FilterSyncedDatasetPanel: ReturnType<typeof FilterSyncedDatasetPanelFactory>
) {
  const TimeRangeFilterPanel: TimeRangeFilterPanelComponent = React.memo(
    ({
      idx,
      datasets,
      layers,
      allAvailableFields,
      filter,
      enlargeFilter,
      setFilter,
      setFilterPlot,
      removeFilter,
      toggleAnimation,
      syncTimeFilterWithLayerTimeline
    }) => {
      const onSetFilterValue = useCallback(
        value => setFilter(idx, 'value', value),
        [idx, setFilter]
      );

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

      const onFieldSelector = useCallback(
        (field, valueIndex) => setFilter(idx, 'name', field.name, valueIndex),
        [setFilter, idx]
      );

      const onEndFieldSelector = useCallback(
        (field, valueIndex = 0) => setFilter(idx, 'endName', field ? field.name : null, valueIndex),
        [setFilter, idx]
      );

      const onSourceDataSelector = useCallback(
        value => setFilter(idx, 'dataId', value, 0),
        [idx, setFilter]
      );

      const dataset = datasets[filter.dataId[0]];
      const supportedFields = useMemo(
        () => getSupportedFilterFields(dataset.supportedFilterTypes, allAvailableFields),
        [dataset.supportedFilterTypes, allAvailableFields]
      );

      const endTimeFields = useMemo(() => {
        const startName = Array.isArray(filter.name) ? filter.name[0] : filter.name;
        return supportedFields.filter(
          field => field.type === ALL_FIELD_TYPES.timestamp && field.name !== startName
        );
      }, [supportedFields, filter.name]);

      const isSynced = useMemo(() => {
        return (
          filter.dataId.length >= SYNC_FILTER_ID_LENGTH && filter.type === FILTER_TYPES.timeRange
        );
      }, [filter.dataId, filter.type]);

      const isHistogramVisible = useMemo(
        () => filter.type && !isEnlarged,
        [filter.type, isEnlarged]
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
            {isSynced ? (
              <TimeSyncedFieldSelector />
            ) : (
              <FieldSelector
                inputTheme="secondary"
                fields={supportedFields}
                value={Array.isArray(filter.name) ? filter.name[0] : filter.name}
                erasable={false}
                onSelect={field => onFieldSelector(field, 0)}
              />
            )}
            {panelActions.map(panelAction => (
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
            <FilterSyncedDatasetPanel
              datasets={datasets}
              layers={layers}
              filter={filter}
              idx={idx}
              onFieldSelector={onFieldSelector}
              onSourceDataSelector={onSourceDataSelector}
              setFilter={setFilter}
              supportedFields={supportedFields}
              syncTimeFilterWithLayerTimeline={syncTimeFilterWithLayerTimeline}
            />
            {endTimeFields.length ? (
              <SidePanelSection>
                <PanelLabel htmlFor={`filter-${filter.id}-end-time`}>
                  <FormattedMessage id="filterManager.timeIntervalEndField" />
                </PanelLabel>
                <FieldSelector
                  inputTheme="secondary"
                  fields={endTimeFields}
                  value={Array.isArray(filter.endName) ? filter.endName[0] : filter.endName}
                  placeholder="placeholder.endTimeField"
                  erasable
                  onSelect={field => onEndFieldSelector(field, 0)}
                />
                <EndFieldHint>
                  <FormattedMessage id="filterManager.timeIntervalEndFieldHint" />
                </EndFieldHint>
              </SidePanelSection>
            ) : null}
            {isHistogramVisible && (
              <div className="filter-panel__filter">
                <TimeRangeFilter
                  filter={filter}
                  datasets={datasets}
                  layers={layers}
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
