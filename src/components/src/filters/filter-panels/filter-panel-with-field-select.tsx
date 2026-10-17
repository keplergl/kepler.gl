// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import {StyledFilterContent} from '../../common/styled-components';
import FilterPanelHeaderFactory from '../../side-panel/filter-panel/filter-panel-header';
import PanelHeaderActionFactory from '../../side-panel/panel-header-action';
import FieldSelectorFactory from '../../common/field-selector';
import {getSupportedFilterFields} from './new-filter-panel';
import {FilterPanelWithFieldSelectComponent} from './types';
import {KeplerTable} from '@kepler.gl/table';
import FilterInvertToggle from '../filter-invert-toggle';
import FilterSyncedDatasetPanelFactory from './filter-synced-dataset-panel';
import TimeSyncedFieldSelectorFactory from './time-synced-field-selector';

FieldPanelWithFieldSelectFactory.deps = [
  FilterPanelHeaderFactory,
  FieldSelectorFactory,
  PanelHeaderActionFactory,
  FilterSyncedDatasetPanelFactory,
  TimeSyncedFieldSelectorFactory
];

function FieldPanelWithFieldSelectFactory(
  FilterPanelHeader: ReturnType<typeof FilterPanelHeaderFactory>,
  FieldSelector: ReturnType<typeof FieldSelectorFactory>,
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>,
  FilterSyncedDatasetPanel: ReturnType<typeof FilterSyncedDatasetPanelFactory>,
  TimeSyncedFieldSelector: ReturnType<typeof TimeSyncedFieldSelectorFactory>
) {
  const FilterPanelWithFieldSelect: FilterPanelWithFieldSelectComponent = React.memo(
    ({
      children,
      allAvailableFields,
      datasets,
      filter,
      idx,
      removeFilter,
      setFilter,
      panelActions = []
    }) => {
      const onFieldSelector = useCallback(
        (field, valueIndex = 0) => setFilter(idx, 'name', field.name, valueIndex),
        [idx, setFilter]
      );

      const onSourceDataSelector = useCallback(
        value => setFilter(idx, 'dataId', value, 0),
        [idx, setFilter]
      );

      const fieldValue = useMemo(
        () => (Array.isArray(filter.name) ? filter.name[0] : filter.name),
        [filter.name]
      );

      const dataset: KeplerTable = datasets[filter.dataId[0]];
      const supportedFields = useMemo(
        () => getSupportedFilterFields(dataset.supportedFilterTypes, allAvailableFields),
        [dataset.supportedFilterTypes, allAvailableFields]
      );
      const fieldType =
        dataset.fields.find(field => field.name === fieldValue)?.type || filter.fieldType;
      const isSynced = filter.dataId.length > 1;
      const isInversionSupported = filter.dataId.every(
        dataId => !datasets[dataId]?.disableDataOperation
      );
      return (
        <>
          <FilterPanelHeader datasets={[dataset]} filter={filter} removeFilter={removeFilter}>
            {isSynced ? (
              <TimeSyncedFieldSelector type={fieldType} />
            ) : (
              <FieldSelector
                inputTheme="secondary"
                fields={supportedFields}
                value={fieldValue}
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
              filter={filter}
              idx={idx}
              onFieldSelector={onFieldSelector}
              onSourceDataSelector={onSourceDataSelector}
              setFilter={setFilter}
              showSourceDataSelector={Object.keys(datasets).length > 1}
            />
            <FilterInvertToggle
              filter={filter}
              idx={idx}
              setFilter={setFilter}
              isSupported={isInversionSupported}
            />
            {children}
          </StyledFilterContent>
        </>
      );
    }
  );

  FilterPanelWithFieldSelect.displayName = 'FilterPanelWithFieldSelect';

  return FilterPanelWithFieldSelect;
}

export default FieldPanelWithFieldSelectFactory;
