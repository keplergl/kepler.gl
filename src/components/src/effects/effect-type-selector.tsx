// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled, {withTheme} from 'styled-components';

import ItemSelector from '../common/item-selector/item-selector';
import EffectTypeDropdownListFactory from './effect-type-dropdown-list';
import EffectTypeListItemFactory, {DUMMY_ITEM_ID} from './effect-type-list-item';

export type EffectTypeSelectorProps = {
  options: {type: string; name: string; disabled: boolean}[];
  onSelect: (type: any) => void;
  theme: any;
  onBlur?: () => void;
  onOpen?: () => void;
};

const DropdownWrapper = styled.div`
  border: 0;
  width: 100%;
  left: 0;
  z-index: ${props => props.theme.dropdownWrapperZ};
  width: 297px;
  margin-left: -194px;
  margin-top: 26px;

  .typeahead__input {
    border-color: ${props => props.theme.activeColor};
    border-radius: 4px 4px 0px 0px !important;
  }
  .typeahead__input_box {
    padding: 0px;
  }
  .typeahead__input_icon {
    top: 34px;
    right: 9px;
  }
`;

const StyledEffectTypeSelector = styled.div`
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
  const EffectTypeSelector: React.FC<EffectTypeSelectorProps> = ({
    options,
    onSelect,
    onBlur,
    onOpen
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
      <StyledEffectTypeSelector className="effect-config__type">
        <ItemSelector
          selectedItems={selectedItems}
          options={options}
          multiSelect={false}
          disabled={false}
          placeholder="effectManager.addEffect"
          onChange={onSelect}
          onBlur={onBlur}
          onOpen={onOpen}
          getOptionValue={getOptionValue}
          filterOption="name"
          displayOption={getDisplayOption}
          DropDownLineItemRenderComponent={EffectTypeListItem}
          DropDownRenderComponent={EffectTypeDropdownList}
          DropDownWrapperComponent={DropdownWrapper}
        />
      </StyledEffectTypeSelector>
    );
  };

  return withTheme(EffectTypeSelector);
}

export default EffectTypeSelectorFactory;
