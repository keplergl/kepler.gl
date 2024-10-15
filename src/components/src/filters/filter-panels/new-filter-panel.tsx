// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
      const onFieldSelector = useCallback(
        field => setFilter(idx, 'name', field.name),
        [idx, setFilter]
      );

      const onSourceDataSelector = useCallback(
        value => setFilter(idx, 'dataId', value, 0),
        [idx, setFilter]
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
