import React from 'react';
import ItemSelector from '../common/item-selector/item-selector';
import {PanelLabel, SidePanelSection} from '../common/styled-components';

const SingleSelectFilter = ({filter, setFilter}) => (
  <SidePanelSection>
    <PanelLabel>Value equals</PanelLabel>
    <ItemSelector
      selectedItems={filter.value}
      placeholder="Select a Value"
      options={filter.domain}
      multiSelect={false}
      searchable={false}
      displayOption={d => String(d)}
      getOptionValue={d => d}
      onChange={setFilter}
    />
  </SidePanelSection>
);

export default SingleSelectFilter;
