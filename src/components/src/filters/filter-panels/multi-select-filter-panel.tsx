// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import MultiSelectFilterFactory from '../multi-select-filter';
import {MultiSelectFilter} from '@kepler.gl/types';
import FieldPanelWithFieldSelectFactory from './filter-panel-with-field-select';
import {FilterPanelComponent} from './types';

MultiSelectFilterPanelFactory.deps = [FieldPanelWithFieldSelectFactory, MultiSelectFilterFactory];

function MultiSelectFilterPanelFactory(
  FieldPanelWithFieldSelect: ReturnType<typeof FieldPanelWithFieldSelectFactory>,
  MultiSelectFilterComponent: ReturnType<typeof MultiSelectFilterFactory>
) {
  const MultiSelectFilterPanel: FilterPanelComponent<MultiSelectFilter> = React.memo(
    ({idx, datasets, allAvailableFields, filter, setFilter, removeFilter}) => {
      const onSetFilter = useCallback(value => setFilter(idx, 'value', value), [idx, setFilter]);

      return (
        <div className="multi-select-filter-panel">
          <FieldPanelWithFieldSelect
            allAvailableFields={allAvailableFields}
            datasets={datasets}
            filter={filter}
            idx={idx}
            removeFilter={removeFilter}
            setFilter={setFilter}
          >
            {filter.type && (
              <div className="filter-panel__filter">
                <MultiSelectFilterComponent filter={filter} setFilter={onSetFilter} />
              </div>
            )}
          </FieldPanelWithFieldSelect>
        </div>
      );
    }
  );

  MultiSelectFilterPanel.displayName = 'MultiSelectFilterPanel';

  return MultiSelectFilterPanel;
}

export default MultiSelectFilterPanelFactory;
