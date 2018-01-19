import React from 'react';
import ItemSelector from '../common/item-selector/item-selector';
import {PanelLabel} from '../common/styled-components';

const MultiSelectFilter = ({filter, setFilter}) => (
  <div>
    <PanelLabel htmlFor={`filter-${filter.id}`}>Values in</PanelLabel>
    <ItemSelector
      options={filter.domain}
      selectedItems={filter.value}
      onChange={setFilter}
    />
  </div>
);

export default MultiSelectFilter;
