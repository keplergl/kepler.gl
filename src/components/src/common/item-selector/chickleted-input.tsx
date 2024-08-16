// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ElementType, MouseEventHandler, ReactNode, useMemo, useCallback} from 'react';

import styled from 'styled-components';
import {DndContext, DragOverlay, pointerWithin} from '@dnd-kit/core';
import {SortableContext, useSortable, arrayMove} from '@dnd-kit/sortable';
import {restrictToParentElement} from '@dnd-kit/modifiers';

import Delete from '../icons/delete';
import {FormattedMessage} from '@kepler.gl/localization';

type Item = string | number | boolean | object | undefined;
interface ChickletedInputProps {
  // required properties
  onClick: MouseEventHandler<HTMLDivElement>;
  removeItem: (item: Item, e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;

  // optional properties
  selectedItems?: any[];
  disabled?: boolean;
  displayOption?: (item: Item) => string;
  focus?: boolean;
  error?: boolean;
  placeholder?: string;
  inputTheme?: string;
  CustomChickletComponent?: ElementType;
  className?: string;
  reorderItems?: (newOrder: any) => void;
}

interface ChickletButtonProps {
  inputTheme?: string;
}

export const ChickletButton = styled.div<ChickletButtonProps>`
  background: ${props =>
    props.inputTheme === 'light' ? props.theme.chickletBgdLT : props.theme.chickletBgd};
  border-radius: 1px;
  color: ${props =>
    props.inputTheme === 'light' ? props.theme.textColorLT : props.theme.textColor};
  font-size: 11px;
  line-height: 20px;
  margin: 4px 10px 4px 3px;
  padding: 2px 6px;
  display: flex;
  align-items: center;
  max-width: calc(100% - 8px);

  :hover {
    color: ${props =>
      props.inputTheme === 'light' ? props.theme.textColorHlLT : props.theme.textColorHl};
  }
`;

const DND_MODIFIERS = [restrictToParentElement];
export const ChickletTag = styled.span`
  margin-right: 10px;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;

  :hover {
    overflow: visible;
  }
`;

interface ChickletProps {
  disabled?: boolean;
  name: ReactNode;
  remove?: MouseEventHandler<SVGSVGElement>;
  inputTheme?: string;
}

const Chicklet = ({disabled, name, remove, inputTheme}: ChickletProps) => (
  <ChickletButton inputTheme={inputTheme}>
    <ChickletTag>{name}</ChickletTag>
    <Delete onClick={disabled ? undefined : remove} />
  </ChickletButton>
);

interface ChickletedInputContainerProps {
  inputTheme?: string;
  hasPlaceholder?: boolean;
}

const ChickletedInputContainer = styled.div<ChickletedInputContainerProps>`
  ${props =>
    props.inputTheme === 'secondary'
      ? props.theme.secondaryChickletedInput
      : props.inputTheme === 'light'
      ? props.theme.chickletedInputLT
      : props.theme.chickletedInput}

  color: ${props =>
    props.hasPlaceholder ? props.theme.selectColorPlaceHolder : props.theme.selectColor};
  overflow: hidden;
`;

const ChickletedItem = ({
  item,
  removeItem,
  displayOption,
  CustomChickletComponent,
  inputTheme,
  disabled,
  itemId
}) => {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
    id: itemId
  });
  const chickletProps = useMemo(
    () => ({
      inputTheme,
      disabled,
      name: displayOption(item),
      displayOption,
      item,
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
      remove: e => removeItem(item, e)
    }),
    [
      item,
      removeItem,
      displayOption,
      inputTheme,
      disabled,
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    ]
  );
  return CustomChickletComponent ? (
    <CustomChickletComponent {...chickletProps} />
  ) : (
    <Chicklet {...chickletProps} />
  );
};

const ChickletedInput: React.FC<ChickletedInputProps> = ({
  disabled,
  onClick,
  className,
  selectedItems = [],
  placeholder = '',
  removeItem,
  reorderItems = d => d,
  displayOption = d => String(d),
  inputTheme,
  CustomChickletComponent
}) => {
  const selectedItemIds = useMemo(
    () => selectedItems.map(item => displayOption(item)),
    [displayOption, selectedItems]
  );
  const handleDragEnd = useCallback(
    ({active, over}) => {
      if (!over) return;
      if (active.id !== over.id) {
        const oldIndex = selectedItemIds.findIndex(itemId => itemId === active.id);
        const newIndex = selectedItemIds.findIndex(itemId => itemId === over.id);
        reorderItems(arrayMove(selectedItems, oldIndex, newIndex));
      }
    },
    [selectedItemIds, selectedItems, reorderItems]
  );

  return (
    <ChickletedInputContainer
      className={`${className} chickleted-input`}
      onClick={onClick}
      inputTheme={inputTheme}
      hasPlaceholder={!selectedItems || !selectedItems.length}
    >
      <DndContext
        onDragEnd={handleDragEnd}
        modifiers={DND_MODIFIERS}
        collisionDetection={pointerWithin}
        autoScroll={false}
      >
        <SortableContext items={selectedItemIds}>
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => (
              <ChickletedItem
                item={item}
                itemId={displayOption(item)}
                removeItem={removeItem}
                displayOption={displayOption}
                CustomChickletComponent={CustomChickletComponent}
                disabled={disabled}
                inputTheme={inputTheme}
                key={`${displayOption(item)}_${index}`}
              />
            ))
          ) : (
            <span className={`${className} chickleted-input__placeholder`}>
              <FormattedMessage id={placeholder || 'placeholder.enterValue'} />
            </span>
          )}
        </SortableContext>
        <DragOverlay dropAnimation={null} />
      </DndContext>
    </ChickletedInputContainer>
  );
};

export default ChickletedInput;
