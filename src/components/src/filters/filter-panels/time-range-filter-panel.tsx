// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import TimeRangeFilterFactory from '../time-range-filter';
import {Clock} from '../../common/icons';
import FieldPanelWithFieldSelectFactory from './filter-panel-with-field-select';
import {TimeRangeFilterPanelComponent} from './types';
import {isSideFilter, getTimelineFromFilter} from '@kepler.gl/utils';

TimeRangeFilterPanelFactory.deps = [FieldPanelWithFieldSelectFactory, TimeRangeFilterFactory];

function TimeRangeFilterPanelFactory(
  FieldPanelWithFieldSelect: ReturnType<typeof FieldPanelWithFieldSelectFactory>,
  TimeRangeFilter: ReturnType<typeof TimeRangeFilterFactory>
) {
  const StyledFieldPanelWithFieldSelect = styled(FieldPanelWithFieldSelect)`
    .field-selector {
      width: 90%;
    }
  `;

  const TimeRangeFilterPanel: TimeRangeFilterPanelComponent = React.memo(
    ({
      idx,
      datasets,
      allAvailableFields,
      filter,
      enlargeFilter,
      setFilter,
      removeFilter,
      toggleAnimation
    }) => {
      const onSetFilter = useCallback(value => setFilter(idx, 'value', value), [idx, setFilter]);

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

      const timeline = getTimelineFromFilter(filter);

      return (
        <>
          <StyledFieldPanelWithFieldSelect
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
                <TimeRangeFilter
                  filter={filter}
                  toggleAnimation={toggleAnimation}
                  setFilter={onSetFilter}
                  isAnimatable
                  hideTimeTitle
                  timeline={timeline}
                />
              </div>
            )}
          </StyledFieldPanelWithFieldSelect>
        </>
      );
    }
  );

  TimeRangeFilterPanel.displayName = 'TimeRangeFilterPanel';

  return TimeRangeFilterPanel;
}

export default TimeRangeFilterPanelFactory;
