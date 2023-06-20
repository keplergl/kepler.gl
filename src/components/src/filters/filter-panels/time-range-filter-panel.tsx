// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
