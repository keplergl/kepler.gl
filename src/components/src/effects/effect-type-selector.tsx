import React, {useMemo} from 'react';
import styled, {withTheme} from 'styled-components';

import ItemSelector from '../common/item-selector/item-selector';
import EffectTypeDropdownListFactory from './effect-type-dropdown-list';
import EffectTypeListItemFactory, {DUMMY_ITEM_ID} from './effect-type-list-item';

export type EffectTypeSelectorProps = {
  options: {type: string; name: string; disabled: boolean}[];
  onSelect: (type: any) => void;
  theme: any;
};

const DropdownWrapper = styled.div`
  border: 0;
  width: 100%;
  left: 0;
  z-index: ${props => props.theme.dropdownWrapperZ};
  width: 297px;
  margin-left: -194px;
  margin-top: 26px;
  .typeahead__input_icon {
    top: 41px;
  }
`;

const StyledLayerTypeSelector = styled.div`
  .item-selector .item-selector__dropdown {
    padding: 4px 10px 4px 10px;
    background-color: ${props => props.theme.secondaryBtnBgd};
    border-radius: ${props => props.theme.primaryBtnRadius};
    font-size: ${props => props.theme.primaryBtnFontSizeDefault};
    border: none;
    :hover {
      background-color: ${props => props.theme.secondaryBtnBgdHover};
    }
    .item-selector__dropdown__value {
      color: ${props => props.theme.secondaryBtnActColor};
    }
  }
`;

const getDisplayOption = op => op.name;
const getOptionValue = op => op.type;

EffectTypeSelectorFactory.deps = [EffectTypeListItemFactory, EffectTypeDropdownListFactory];

function EffectTypeSelectorFactory(EffectTypeListItem, EffectTypeDropdownList) {
  const LayerTypeSelector: React.FC<EffectTypeSelectorProps> = ({
    options,
    onSelect
  }: EffectTypeSelectorProps) => {
    // Make sure effect type selector has dummy as selection
    const selectedItems = useMemo(() => {
      return [
        {
          type: DUMMY_ITEM_ID,
          name: DUMMY_ITEM_ID
        }
      ];
    }, []);

    return (
      <StyledLayerTypeSelector className="effect-config__type">
        <ItemSelector
          selectedItems={selectedItems}
          options={options}
          multiSelect={false}
          disabled={false}
          placeholder="effectManager.addEffect"
          onChange={onSelect}
          getOptionValue={getOptionValue}
          filterOption="name"
          displayOption={getDisplayOption}
          DropDownLineItemRenderComponent={EffectTypeListItem}
          DropDownRenderComponent={EffectTypeDropdownList}
          DropDownWrapperComponent={DropdownWrapper}
        />
      </StyledLayerTypeSelector>
    );
  };

  return withTheme(LayerTypeSelector);
}

export default EffectTypeSelectorFactory;
