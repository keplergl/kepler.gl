// Copyright (c) 2022 Uber Technologies, Inc.
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
            {filter.type && !filter.enlarged && (
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
