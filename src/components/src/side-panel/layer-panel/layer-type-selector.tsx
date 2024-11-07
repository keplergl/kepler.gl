// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled, {withTheme} from 'styled-components';

import LayerTypeDropdownListFactory, {LayerTypeOption} from './layer-type-dropdown-list';
import LayerTypeListItemFactory from './layer-type-list-item';
import ItemSelector from '../../common/item-selector/item-selector';

import {SidePanelSection} from '../../common/styled-components';

type Option = {
  id: string;
  label: string;
  icon: any; //
  requireData: any; //
};

export type LayerTypeSelectorProps = {
  selected: string | null;
  onSelect: (
    items:
      | readonly (string | number | boolean | object)[]
      | string
      | number
      | boolean
      | object
      | null
  ) => void;
  options: LayerTypeOption[];
  // TODO add correct type after Theme typing
  theme: Record<string, string>;
  disabled: boolean;
};

const StyledLayerTypeSelector = styled.div`
  .item-selector .item-selector__dropdown {
    padding: 4px 10px 4px 10px;
  }
`;

LayerTypeSelectorFactory.deps = [LayerTypeListItemFactory, LayerTypeDropdownListFactory];

const getDisplayOption = (op: Option) => op.label;
const getOptionValue = (op: Option) => op.id;

function LayerTypeSelectorFactory(
  LayerTypeListItem: ReturnType<typeof LayerTypeListItemFactory>,
  LayerTypeDropdownList: ReturnType<typeof LayerTypeDropdownListFactory>
) {
  const LayerTypeSelector: React.FC<LayerTypeSelectorProps> = ({
    selected,
    options,
    onSelect,
    disabled
  }) => {
    const selectedItems = useMemo(
      () => options.find(op => op.id === selected),
      [options, selected]
    );

    return (
      <SidePanelSection>
        <StyledLayerTypeSelector className="layer-config__type">
          <ItemSelector
            selectedItems={selectedItems}
            options={options}
            multiSelect={false}
            disabled={disabled}
            placeholder="placeholder.selectType"
            onChange={onSelect}
            getOptionValue={getOptionValue}
            filterOption="label"
            displayOption={getDisplayOption}
            DropDownLineItemRenderComponent={LayerTypeListItem}
            DropDownRenderComponent={LayerTypeDropdownList}
          />
        </StyledLayerTypeSelector>
      </SidePanelSection>
    );
  };

  return withTheme(LayerTypeSelector);
}

export default LayerTypeSelectorFactory;
