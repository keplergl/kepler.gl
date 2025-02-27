// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import {StyledFilterContent} from '../../common/styled-components';
import FilterPanelHeaderFactory from '../../side-panel/filter-panel/filter-panel-header';
import PanelHeaderActionFactory from '../../side-panel/panel-header-action';
import SourceDataSelectorFactory from '../../side-panel/common/source-data-selector';
import FieldSelectorFactory from '../../common/field-selector';
import {getSupportedFilterFields} from './new-filter-panel';
import {FilterPanelWithFieldSelectComponent} from './types';
import {KeplerTable} from '@kepler.gl/table';

FieldPanelWithFieldSelectFactory.deps = [
  FilterPanelHeaderFactory,
  SourceDataSelectorFactory,
  FieldSelectorFactory,
  PanelHeaderActionFactory
];

function FieldPanelWithFieldSelectFactory(
  FilterPanelHeader: ReturnType<typeof FilterPanelHeaderFactory>,
  SourceDataSelector: ReturnType<typeof SourceDataSelectorFactory>,
  FieldSelector: ReturnType<typeof FieldSelectorFactory>,
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>
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
        field => setFilter(idx, 'name', field.name),
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
      return (
        <>
          <FilterPanelHeader datasets={[dataset]} filter={filter} removeFilter={removeFilter}>
            <FieldSelector
              inputTheme="secondary"
              fields={supportedFields}
              value={fieldValue}
              erasable={false}
              onSelect={onFieldSelector}
            />
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
            {Object.keys(datasets).length > 1 && (
              <SourceDataSelector
                inputTheme="secondary"
                datasets={datasets}
                dataId={filter.dataId}
                onSelect={onSourceDataSelector}
              />
            )}
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
