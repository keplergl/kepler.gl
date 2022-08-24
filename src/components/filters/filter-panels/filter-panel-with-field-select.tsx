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

import React, {useCallback, useMemo} from 'react';
import {StyledFilterContent} from 'components/common/styled-components';
import FilterPanelHeaderFactory from 'components/side-panel/filter-panel/filter-panel-header';
import PanelHeaderActionFactory from 'components/side-panel/panel-header-action';
import SourceDataSelectorFactory from 'components/side-panel/common/source-data-selector';
import FieldSelectorFactory from '../../common/field-selector';
import {getSupportedFilterFields} from './new-filter-panel';
import {FilterPanelWithFieldSelectComponent} from './types';
import KeplerTable from 'reducers/table-utils/kepler-table';

FieldPanelWithFieldSelectFactory.deps = [
  FilterPanelHeaderFactory,
  SourceDataSelectorFactory,
  FieldSelectorFactory,
  PanelHeaderActionFactory
];

function FieldPanelWithFieldSelectFactory(
  FilterPanelHeader: ReturnType<typeof FilterPanelHeaderFactory>,
  SourceDataSelector: ReturnType<typeof SourceDataSelectorFactory>,
  FieldSelector: ReturnType<typeof FieldSelectorFactory>,
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>
) {
  const FilterPanelWithFieldSelect: FilterPanelWithFieldSelectComponent = React.memo(
    ({
      children,
      allAvailableFields,
      datasets,
      filter,
      idx,
      removeFilter,
      setFilter,
      panelActions = []
    }) => {
      const onFieldSelector = useCallback(field => setFilter(idx, 'name', field.name), [
        idx,
        setFilter
      ]);

      const onSourceDataSelector = useCallback(value => setFilter(idx, 'dataId', [value]), [
        idx,
        setFilter
      ]);

      const fieldValue = useMemo(
        () => (Array.isArray(filter.name) ? filter.name[0] : filter.name),
        [filter.name]
      );

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
              value={fieldValue}
              erasable={false}
              onSelect={onFieldSelector}
            />
            {panelActions?.map(panelAction => (
              <PanelHeaderAction
                id={panelAction.id}
                key={panelAction.id}
                onClick={panelAction.onClick}
                tooltip={panelAction.tooltip}
                IconComponent={panelAction.iconComponent}
                active={panelAction.active}
              />
            ))}
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
            {children}
          </StyledFilterContent>
        </>
      );
    }
  );

  FilterPanelWithFieldSelect.displayName = 'FilterPanelWithFieldSelect';

  return FilterPanelWithFieldSelect;
}

export default FieldPanelWithFieldSelectFactory;
