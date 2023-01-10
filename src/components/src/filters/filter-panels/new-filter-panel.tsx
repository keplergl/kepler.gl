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
import {StyledFilterContent} from '../../common/styled-components';
import FilterPanelHeaderFactory from '../../side-panel/filter-panel/filter-panel-header';
import SourceDataSelectorFactory from '../../side-panel/common/source-data-selector';
import FieldSelectorFactory from '../../common/field-selector';
import {FilterPanelComponent} from './types';
import {KeplerTable} from '@kepler.gl/table';
import {Field, FilterBase, LineChart} from '@kepler.gl/types';

NewFilterPanelFactory.deps = [
  FilterPanelHeaderFactory,
  SourceDataSelectorFactory,
  FieldSelectorFactory
];

export function getSupportedFilterFields(
  supportedFilterTypes: KeplerTable['supportedFilterTypes'],
  fields: Field[]
) {
  return supportedFilterTypes
    ? fields.filter(field => supportedFilterTypes.includes(field.type))
    : fields;
}

function NewFilterPanelFactory(
  FilterPanelHeader: ReturnType<typeof FilterPanelHeaderFactory>,
  SourceDataSelector: ReturnType<typeof SourceDataSelectorFactory>,
  FieldSelector: ReturnType<typeof FieldSelectorFactory>
) {
  const NewFilterPanel: FilterPanelComponent<FilterBase<LineChart>> = React.memo(
    ({idx, filter, datasets, allAvailableFields, setFilter, removeFilter}) => {
      const onFieldSelector = useCallback(field => setFilter(idx, 'name', field.name), [
        idx,
        setFilter
      ]);

      const onSourceDataSelector = useCallback(value => setFilter(idx, 'dataId', value), [
        idx,
        setFilter
      ]);

      const dataset: KeplerTable = datasets[filter.dataId[0]];
      const supportedFields = useMemo(
        () => getSupportedFilterFields(dataset.supportedFilterTypes, allAvailableFields),
        [dataset.supportedFilterTypes, allAvailableFields]
      );

      return (
        <>
          <FilterPanelHeader datasets={[dataset]} filter={filter} removeFilter={removeFilter}>
            <FieldSelector
              inputTheme="secondary"
              fields={supportedFields}
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
          </StyledFilterContent>
        </>
      );
    }
  );

  NewFilterPanel.displayName = 'NewFilterPanel';

  return NewFilterPanel;
}

export default NewFilterPanelFactory;
