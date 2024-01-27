// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, MouseEvent} from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {classList} from '../../common/item-selector/dropdown-list';

export type LayerTypeOption = {
  disabled?: boolean;
  id: string;
  label: string;
  icon: React.ElementType;
};

type LayerTypeDropdownListProps = {
  onOptionSelected: (
    value: {
      icon: React.ElementType;
      label: string;
    },
    e: MouseEvent
  ) => void;
  options: LayerTypeOption[];
  selectedItems: LayerTypeOption[];
  selectionIndex: number | null;
  customListItemComponent: React.FC<{value: LayerTypeOption; isTile?: boolean}>;
};

const DropdownListWrapper = styled.div`
  ${props => props.theme.dropdownList};
  background-color: ${props => props.theme.dropdownListBgd};
  border-top: 1px solid ${props => props.theme.dropdownListBorderTop};
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: ${props => props.theme.layerTypeIconPdL}px 0 0 ${props => props.theme.layerTypeIconPdL}px;
`;

const StyledDropdownListItem = styled.div`
  padding-bottom: ${props => props.theme.layerTypeIconPdL}px;
  padding-right: ${props => props.theme.layerTypeIconPdL}px;

  &.disabled {
    pointer-events: none;
    opacity: 0.3;
  }

  &.selected {
    .layer-type-selector__item__icon {
      border: 1px solid #caf2f4;
    }
  }

  :hover,
  &.selected {
    cursor: pointer;
    .layer-type-selector__item__icon {
      color: ${props => props.theme.activeColor};
    }

    .layer-type-selector__item__label {
      color: ${props => props.theme.textColor};
    }
  }
`;

export function LayerTypeDropdownListFactory() {
  const LayerTypeDropdownList: React.FC<LayerTypeDropdownListProps> = ({
    onOptionSelected,
    options,
    selectedItems,
    selectionIndex,
    customListItemComponent
  }) => {
    const onSelectOption = useCallback(
      (e, value) => {
        e.preventDefault();
        onOptionSelected(value, e);
      },
      [onOptionSelected]
    );

    const ListItemComponent = customListItemComponent;

    return (
      <DropdownListWrapper className={classList.list}>
        {options.map((value, i) => (
          <StyledDropdownListItem
            className={classNames('layer-type-selector__item', {
              selected: selectedItems.find(it => it.id === value.id),
              hover: selectionIndex === i,
              disabled: value.disabled
            })}
            key={`${value.id}_${i}`}
            onMouseDown={(e: MouseEvent) => onSelectOption(e, value)}
            onClick={(e: MouseEvent) => onSelectOption(e, value)}
          >
            <ListItemComponent value={value} isTile />
          </StyledDropdownListItem>
        ))}
      </DropdownListWrapper>
    );
  };

  return LayerTypeDropdownList;
}

export default LayerTypeDropdownListFactory;
