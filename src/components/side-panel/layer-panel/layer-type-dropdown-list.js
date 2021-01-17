// Copyright (c) 2021 Uber Technologies, Inc.
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

import React, {useCallback} from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {classList} from '../../common/item-selector/dropdown-list';

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
  const LayerTypeDropdownList = ({
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

    const Component = customListItemComponent;

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
            onMouseDown={e => onSelectOption(e, value)}
            onClick={e => onSelectOption(e, value)}
          >
            <Component value={value} isTile />
          </StyledDropdownListItem>
        ))}
      </DropdownListWrapper>
    );
  };

  return LayerTypeDropdownList;
}

export default LayerTypeDropdownListFactory;
