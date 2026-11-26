// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {MouseEventHandler, useMemo, useCallback} from 'react';

import styled, {IStyledComponent} from 'styled-components';
import {
  closestCenter,
  CollisionDetection,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {SortableContext, sortableKeyboardCoordinates, useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {restrictToParentElement} from '@dnd-kit/modifiers';

import {FormattedMessage} from '@kepler.gl/localization';
import {useIntl} from 'react-intl';
import {arrayMove} from '@kepler.gl/common-utils';

import Delete from '../icons/delete';
import VertDots from '../icons/vert-dots';
import {BaseComponentProps} from '../../types';
import {shouldForwardProp} from '../styled-components';

export type ChickletButtonProps = BaseComponentProps & {
  $inputTheme?: string;
  ref?: (node: HTMLElement | null) => void;
};

export const ChickletButton: IStyledComponent<
  'web',
  ChickletButtonProps
> = styled.div<ChickletButtonProps>`
  background: ${props =>
    props.$inputTheme === 'light' ? props.theme.chickletBgdLT : props.theme.chickletBgd};
  border-radius: 1px;
  color: ${props =>
    props.$inputTheme === 'light' ? props.theme.textColorLT : props.theme.textColor};
  font-size: 11px;
  line-height: 20px;
  margin: 4px 10px 4px 3px;
  padding: 2px 6px;
  display: flex;
  align-items: center;
  max-width: calc(100% - 8px);

  &:hover {
    color: ${props =>
      props.$inputTheme === 'light' ? props.theme.textColorHlLT : props.theme.textColorHl};
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

const ChickletDragHandle = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0;
  margin-right: 4px;
  border: 0;
  background: none;
  color: inherit;
  cursor: grab;
  touch-action: none;
`;

const getSelectedItemId = (item, displayOption, sortableDefault: boolean) =>
  // Field display names need not be unique; keep the name as the identity when sorting.
  sortableDefault && typeof item?.name === 'string' ? item.name : displayOption(item);

const sortableCollision: CollisionDetection = args =>
  args.pointerCoordinates ? pointerWithin(args) : closestCenter(args);

interface ChickletProps {
  disabled?: boolean;
  name: string;
  remove?: MouseEventHandler<SVGSVGElement>;
  inputTheme?: string;
  sortable?: ReturnType<typeof useSortable>;
}

const SortableChickletHandle = ({
  name,
  sortable
}: {
  name: string;
  sortable: ReturnType<typeof useSortable>;
}) => {
  const intl = useIntl();
  return (
    <ChickletDragHandle
      type="button"
      ref={sortable.setActivatorNodeRef}
      {...sortable.attributes}
      {...sortable.listeners}
      aria-label={intl.formatMessage({id: 'fieldSelector.reorderField'}, {field: name})}
      onClick={event => event.stopPropagation()}
    >
      <VertDots height="12px" aria-hidden="true" />
    </ChickletDragHandle>
  );
};

const Chicklet = ({disabled, name, remove, inputTheme, sortable}: ChickletProps) => (
  <ChickletButton
    $inputTheme={inputTheme}
    ref={sortable?.setNodeRef}
    style={
      sortable
        ? {
            transform: CSS.Translate.toString(sortable.transform),
            transition: sortable.transition,
            zIndex: sortable.isDragging ? 1 : undefined,
            position: sortable.isDragging ? 'relative' : undefined
          }
        : undefined
    }
  >
    {sortable && <SortableChickletHandle name={name} sortable={sortable} />}
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
  itemId,
  sortableDefault
}) => {
  const sortable = useSortable({id: itemId});
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = sortable;
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
    <Chicklet {...chickletProps} sortable={sortableDefault ? sortable : undefined} />
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
  reorderItems,
  displayOption = d => String(d),
  inputTheme,
  CustomChickletComponent
}) => {
  const sortableDefault = Boolean(reorderItems && !CustomChickletComponent && !disabled);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
  );
  const selectedItemIds = useMemo(
    () => selectedItems.map(item => getSelectedItemId(item, displayOption, sortableDefault)),
    [displayOption, selectedItems, sortableDefault]
  );
  const handleDragEnd = useCallback(
    ({active, over}) => {
      if (!over || !reorderItems) return;
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
        collisionDetection={sortableDefault ? sortableCollision : pointerWithin}
        sensors={sortableDefault ? sensors : undefined}
        autoScroll={false}
      >
        <SortableContext items={selectedItemIds}>
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => (
              <ChickletedItem
                item={item}
                itemId={selectedItemIds[index]}
                removeItem={removeItem}
                displayOption={displayOption}
                CustomChickletComponent={CustomChickletComponent}
                disabled={disabled}
                sortableDefault={sortableDefault}
                inputTheme={inputTheme}
                key={
                  sortableDefault ? selectedItemIds[index] : `${selectedItemIds[index]}_${index}`
                }
              />
            ))
          ) : (
            <span className={`${className} chickleted-input__placeholder`}>
              <FormattedMessage id={placeholder || 'placeholder.enterValue'} />
            </span>
          )}
        </SortableContext>
        {/* Default sortable chips move in place and use their own measured drag rectangle. */}
        {!sortableDefault && <DragOverlay dropAnimation={null} />}
      </DndContext>
    </ChickletedInputContainer>
  );
};

export default ChickletedInput;
