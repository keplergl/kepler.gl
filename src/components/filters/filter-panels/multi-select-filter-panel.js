// Copyright (c) 2019 Uber Technologies, Inc.
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
import MultiSelectFilterFactory from 'components/filters/multi-select-filter';
import {StyledFilterContent} from 'components/common/styled-components';
import FilterPanelHeaderFactory from 'components/side-panel/filter-panel/filter-panel-header';
import FieldSelector from 'components/common/field-selector';
import SourceDataSelectorFactory from 'components/side-panel/common/source-data-selector';

MultiSelectFilterPanelFactory.deps = [
  FilterPanelHeaderFactory,
  MultiSelectFilterFactory,
  SourceDataSelectorFactory
];

function MultiSelectFilterPanelFactory(
  FilterPanelHeader,
  MultiSelectFilter,
  SourceDataSelector
) {
  const MultiSelectFilterPanel = React.memo(({
    idx,
    datasets,
    allAvailableFields,
    filter,
    isAnyFilterAnimating,
    enlargeFilter,
    setFilter,
    removeFilter,
    toggleAnimation
  }) => {
    const onFieldSelector = useCallback(field =>
      setFilter(idx, 'name', field.name),
      [idx, setFilter]
    );

    const onSourceDataSelector = useCallback(value =>
        setFilter(idx, 'dataId', value),
      [idx, setFilter]
    );

    const onSetFilter = useCallback(value =>
        setFilter(idx, 'value', value),
      [idx, setFilter]);

    return (
      <>
        <FilterPanelHeader
          datasets={[datasets[filter.dataId[0]]]}
          allAvailableFields={allAvailableFields}
          idx={idx}
          filter={filter}
          removeFilter={removeFilter}
        >
          <FieldSelector
            inputTheme="secondary"
            fields={allAvailableFields}
            value={Array.isArray(filter.name) ? filter.name[0] : filter.name}
            erasable={false}
            onSelect={onFieldSelector}
          />
        </FilterPanelHeader>
        <StyledFilterContent className="filter-panel__content">
          {Object.keys(datasets).length > 1 && (
            <SourceDataSelector
              inputTheme="secondary"
              datasets={datasets}
              disabled={filter.freeze}
              dataId={filter.dataId}
              onSelect={onSourceDataSelector}
            />
          )}
          {filter.type && !filter.enlarged && (
            <div className="filter-panel__filter">
              <MultiSelectFilter
                filter={filter}
                idx={idx}
                isAnyFilterAnimating={isAnyFilterAnimating}
                toggleAnimation={toggleAnimation}
                setFilter={onSetFilter}
              />
            </div>
          )}
        </StyledFilterContent>
      </>
    );
  });

  MultiSelectFilterPanel.displayName = 'MultiSelectFilterPanel';

  return MultiSelectFilterPanel;
}

export default MultiSelectFilterPanelFactory;
