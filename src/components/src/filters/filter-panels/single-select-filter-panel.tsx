// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import SingleSelectFilterFactory from '../single-select-filter';
import {SelectFilter} from '@kepler.gl/types';
import FieldPanelWithFieldSelectFactory from './filter-panel-with-field-select';
import {FilterPanelComponent} from './types';

SingleSelectFilterPanelFactory.deps = [FieldPanelWithFieldSelectFactory, SingleSelectFilterFactory];

function SingleSelectFilterPanelFactory(
  FieldPanelWithFieldSelect: ReturnType<typeof FieldPanelWithFieldSelectFactory>,
  SingleSelectFilter: ReturnType<typeof SingleSelectFilterFactory>
) {
  const SingleSelectFilterPanel: FilterPanelComponent<SelectFilter> = React.memo(
    ({idx, datasets, allAvailableFields, filter, setFilter, removeFilter}) => {
      const onSetFilter = useCallback(value => setFilter(idx, 'value', value), [idx, setFilter]);

      return (
        <div className="single-select-filter-panel">
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
                <SingleSelectFilter filter={filter} setFilter={onSetFilter} />
              </div>
            )}
          </FieldPanelWithFieldSelect>
        </div>
      );
    }
  );

  SingleSelectFilterPanel.displayName = 'SingleSelectFilterPanel';

  return SingleSelectFilterPanel;
}

export default SingleSelectFilterPanelFactory;
