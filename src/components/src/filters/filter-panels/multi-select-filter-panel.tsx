// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import MultiSelectFilterFactory from '../multi-select-filter';
import {MultiSelectFilter} from '@kepler.gl/types';
import {DatasetType} from '@kepler.gl/constants';
import FieldPanelWithFieldSelectFactory from './filter-panel-with-field-select';
import {FilterPanelProps} from './types';
import {Expand} from '../../common/icons';
import {isSideFilter} from '@kepler.gl/utils';

type MultiSelectFilterPanelProps = FilterPanelProps<MultiSelectFilter> & {
  enlargeFilter: () => void;
};

MultiSelectFilterPanelFactory.deps = [FieldPanelWithFieldSelectFactory, MultiSelectFilterFactory];

function MultiSelectFilterPanelFactory(
  FieldPanelWithFieldSelect: ReturnType<typeof FieldPanelWithFieldSelectFactory>,
  MultiSelectFilterComponent: ReturnType<typeof MultiSelectFilterFactory>
) {
  const MultiSelectFilterPanel: React.FC<MultiSelectFilterPanelProps> = React.memo(
    ({idx, datasets, allAvailableFields, filter, setFilter, removeFilter, enlargeFilter}) => {
      const onSetFilter = useCallback(value => setFilter(idx, 'value', value), [idx, setFilter]);

      const isEnlarged = !isSideFilter(filter);
      const panelActions = useMemo(
        () => [
          {
            id: filter.id,
            onClick: enlargeFilter,
            tooltip: 'tooltip.floatingFilter',
            iconComponent: Expand,
            active: isEnlarged
          }
        ],
        [enlargeFilter, filter.id, isEnlarged]
      );

      return (
        <div className="multi-select-filter-panel">
          <FieldPanelWithFieldSelect
            allAvailableFields={allAvailableFields}
            datasets={datasets}
            filter={filter}
            idx={idx}
            removeFilter={removeFilter}
            setFilter={setFilter}
            panelActions={panelActions}
          >
            {!isEnlarged && (
              <div className="filter-panel__filter">
                <MultiSelectFilterComponent
                  filter={filter}
                  setFilter={onSetFilter}
                  allowCustomValues={filter.dataId.some(
                    id => datasets[id]?.type === DatasetType.VECTOR_TILE
                  )}
                />
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
