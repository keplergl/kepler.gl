import React from 'react';
import {PanelLabel, SidePanelSection} from '../../common/styled-components';
import ItemSelector from '../../common/item-selector/item-selector';

const DimensionScaleSelector = ({label, onSelect, options, scaleType, disabled = false}) => {
  return (
    <SidePanelSection>
      <PanelLabel>{label || 'Scale'}</PanelLabel>
      <ItemSelector
        disabled={disabled}
        selectedItems={scaleType}
        options={options}
        multiSelect={false}
        searchable={false}
        onChange={onSelect}/>
    </SidePanelSection>
  );
};

export default DimensionScaleSelector;
