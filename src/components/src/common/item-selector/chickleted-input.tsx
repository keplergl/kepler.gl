// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {MouseEventHandler, ReactNode, useMemo, useCallback} from 'react';

import styled, {IStyledComponent} from 'styled-components';
import {DndContext, DragOverlay, pointerWithin} from '@dnd-kit/core';
import {SortableContext, useSortable} from '@dnd-kit/sortable';
import {restrictToParentElement} from '@dnd-kit/modifiers';

import {FormattedMessage} from '@kepler.gl/localization';
import {arrayMove} from '@kepler.gl/common-utils';

import Delete from '../icons/delete';
import {BaseComponentProps} from '../../types';
import {shouldForwardProp} from '../styled-components';

export type ChickletButtonProps = BaseComponentProps & {
  inputTheme?: string;
  ref?: (node: HTMLElement | null) => void;
};

export const ChickletButton: IStyledComponent<
  'web',
  ChickletButtonProps
> = styled.div<ChickletButtonProps>`
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

  &:hover {
    color: ${props =>
      props.inputTheme === 'light' ? props.theme.textColorHlLT : props.theme.textColorHl};
  }
`;

const DND_MODIFIERS = [restrictToParentElement];
export const ChickletTag: IStyledComponent<'web'> = styled.span`
  margin-right: 10px;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;

  &:hover {
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
    <Delete height="16px" onClick={disabled ? undefined : remove} />
  </ChickletButton>
);

export type ChickletedInputContainerProps = BaseComponentProps & {
  inputTheme?: string;
  hasPlaceholder?: boolean;
  focus?: HTMLInputElement['focus'];
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
};

const ChickletedInputContainer: IStyledComponent<
  'web',
  ChickletedInputContainerProps
> = styled.div.withConfig({shouldForwardProp})<ChickletedInputContainerProps>`
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

type Item = string | number | boolean | object | undefined;

export type ChickletedInputProps = ChickletedInputContainerProps & {
  selectedItems?: any[];
  placeholder?: string;
  CustomChickletComponent?: React.ComponentType<any> | null;
  reorderItems?: (newOrder: any) => void;
  displayOption?: (item: Item) => string;
  removeItem: (item: Item, e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
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
