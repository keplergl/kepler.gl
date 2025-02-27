// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import RangeFilterFactory from '../range-filter';
import {RangeFilter} from '@kepler.gl/types';
import FieldPanelWithFieldSelectFactory from './filter-panel-with-field-select';
import {FilterPanelComponent} from './types';

RangeFilterPanelFactory.deps = [FieldPanelWithFieldSelectFactory, RangeFilterFactory];

function RangeFilterPanelFactory(
  FieldPanelWithFieldSelect: ReturnType<typeof FieldPanelWithFieldSelectFactory>,
  RangeFilterComponent: ReturnType<typeof RangeFilterFactory>
) {
  const RangeFilterPanel: FilterPanelComponent<RangeFilter> = React.memo(
    ({idx, datasets, allAvailableFields, filter, removeFilter, setFilter, setFilterPlot}) => {
      const onSetFilter = useCallback(value => setFilter(idx, 'value', value), [idx, setFilter]);
      const onSetFilterPlot = useCallback(
        (newProp, valueIndex) => setFilterPlot(idx, newProp, valueIndex),
        [idx, setFilterPlot]
      );

      return (
        <div className="range-filter-panel">
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
                <RangeFilterComponent
                  filter={filter}
                  setFilter={onSetFilter}
                  setFilterPlot={onSetFilterPlot}
                />
              </div>
            )}
          </FieldPanelWithFieldSelect>
        </div>
      );
    }
  );

  RangeFilterPanel.displayName = 'RangeFilterPanel';

  return RangeFilterPanel;
}

export default RangeFilterPanelFactory;
