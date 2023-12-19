// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import {classList} from '../common/item-selector/dropdown-list';

export type EffectTypeDropdownListItem = {
  type: string;
  name: string;
  disabled: boolean;
};

export type EffectTypeDropdownListProps = {
  onOptionSelected: (string) => void;
  options: EffectTypeDropdownListItem[];
  selectedItems: EffectTypeDropdownListItem[];
  selectionIndex: number;
  customListItemComponent: React.FC<{value: EffectTypeDropdownListItem; isTile?: boolean}>;
};

const DropdownListWrapper = styled.div`
  ${props => props.theme.dropdownList};
  background-color: ${props => props.theme.dropdownListBgd};
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  padding: 24px 0 12px 0;
  max-height: 430px;
  justify-content: center;
`;

const StyledDropdownListItem = styled.div`
  margin: 0px 4px 8px 4px;

  &.disabled {
    pointer-events: none;
    opacity: 0.3;
  }

  :hover {
    cursor: pointer;
    .effect-type-selector__item__label {
      color: ${props => props.theme.effectPanelTextMain};
    }
  }
`;

export function EffectTypeDropdownListFactory() {
  const EffectTypeDropdownList: React.FC<EffectTypeDropdownListProps> = ({
    onOptionSelected,
    options,
    selectedItems,
    selectionIndex,
    customListItemComponent
  }: EffectTypeDropdownListProps) => {
    const onSelectOption = useCallback(
      (e, value) => {
        e.preventDefault();
        onOptionSelected(value);
      },
      [onOptionSelected]
    );

    const ListItemComponent = customListItemComponent;

    return (
      <DropdownListWrapper className={classList.list}>
        {options.map((value, i) => (
          <StyledDropdownListItem
            className={classNames('effect-type-selector__item', {
              selected: selectedItems.find(it => it.type === value.type),
              hover: selectionIndex === i,
              disabled: value.disabled
            })}
            key={`${value.type}_${i}`}
            onMouseDown={e => onSelectOption(e, value)}
            onClick={e => onSelectOption(e, value)}
          >
            <ListItemComponent value={value} isTile />
          </StyledDropdownListItem>
        ))}
      </DropdownListWrapper>
    );
  };

  return EffectTypeDropdownList;
}

export default EffectTypeDropdownListFactory;
