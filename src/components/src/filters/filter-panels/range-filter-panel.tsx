// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import RangeFilterFactory from '../range-filter';
import FieldPanelWithFieldSelectFactory from './filter-panel-with-field-select';
import {RangeFilterPanelComponent} from './types';
import {Clock} from '../../common/icons';
import {isSideFilter} from '@kepler.gl/utils';

RangeFilterPanelFactory.deps = [FieldPanelWithFieldSelectFactory, RangeFilterFactory];

function RangeFilterPanelFactory(
  FieldPanelWithFieldSelect: ReturnType<typeof FieldPanelWithFieldSelectFactory>,
  RangeFilterComponent: ReturnType<typeof RangeFilterFactory>
) {
  const RangeFilterPanel: RangeFilterPanelComponent = React.memo(
    ({
      idx,
      datasets,
      allAvailableFields,
      filter,
      removeFilter,
      enlargeFilter,
      setFilter,
      setFilterPlot
    }) => {
      const onSetFilter = useCallback(value => setFilter(idx, 'value', value), [idx, setFilter]);
      const onSetFilterPlot = useCallback(
        (newProp, valueIndex) => setFilterPlot(idx, newProp, valueIndex),
        [idx, setFilterPlot]
      );
      const isEnlarged = !isSideFilter(filter);
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
        [enlargeFilter, filter.id, isEnlarged]
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
            panelActions={panelActions}
          >
            {filter.type && !isEnlarged && (
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
