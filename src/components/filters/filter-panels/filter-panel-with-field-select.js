// Copyright (c) 2020 Uber Technologies, Inc.
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

import React, {useMemo} from 'react';
import {StyledFilterContent} from 'components/common/styled-components';
import FilterPanelHeaderFactory from 'components/side-panel/filter-panel/filter-panel-header';
import SourceDataSelectorFactory from 'components/side-panel/common/source-data-selector';
import FilterPanelHeaderActionsFactory from './filter-panel-header-actions';
import SourcePairSelectorFactory from './source-pair-selector';

FieldPanelWithFieldSelectFactory.deps = [
  FilterPanelHeaderFactory,
  SourceDataSelectorFactory,
  FilterPanelHeaderActionsFactory,
  SourcePairSelectorFactory
];

function FieldPanelWithFieldSelectFactory(
  FilterPanelHeader,
  SourceDataSelector,
  FilterPanelHeaderActions,
  SourcePairSelector
) {
  const FilterPanelWithFieldSelect = React.memo(
    ({
      allAvailableFields,
      children,
      datasets,
      filter,
      idx,
      removeFilter,
      setFilter,
      panelActions = []
    }) => {
      const filterDatasets = useMemo(() => filter.dataId.map(datasetId => datasets[datasetId]), [
        filter.dataId
      ]);

      return (
        <>
          <FilterPanelHeader datasets={filterDatasets}>
            <SourcePairSelector
              idx={idx}
              filter={filter}
              datasets={datasets}
              allAvailableFields={allAvailableFields}
              setFilter={setFilter}
            />
            <FilterPanelHeaderActions
              actions={panelActions}
              filter={filter}
              removeFilter={removeFilter}
            />
          </FilterPanelHeader>
          <StyledFilterContent className="filter-panel__content">{children}</StyledFilterContent>
        </>
      );
    }
  );

  FilterPanelWithFieldSelect.displayName = 'FilterPanelWithFieldSelect';

  return React.memo(FilterPanelWithFieldSelect);
}

export default FieldPanelWithFieldSelectFactory;
