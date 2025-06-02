// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import classnames from 'classnames';
import React, {
  ElementType,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import uniq from 'lodash/uniq';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {SortableContext, useSortable, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import styled, {css} from 'styled-components';
import Portaled from '../../common/portaled';
import {Tooltip} from '../../common/styled-components';
import Typeahead from '../../common/item-selector/typeahead';
import ChickletedInput from '../../common/item-selector/chickleted-input';
import DropdownList, {ListItem} from '../../common/item-selector/dropdown-list';
import {shouldForwardProp} from '../../common/styled-components';
import {toArray} from '@kepler.gl/common-utils';
import {KeyEvent} from '@kepler.gl/constants';
import {ColorMap, ColorUI, HexColor, NestedPartial} from '@kepler.gl/types';
import {
  addCategoricalValuesToColorMap,
  addCustomPaletteColor,
  colorMapToCategoricalColorBreaks,
  colorMapToColorBreaks,
  isNumericColorBreaks,
  resetCategoricalColorMapByIndex,
  removeCategoricalValueFromColorMap,
  removeCustomPaletteColor,
  selectRestCategoricalColorMapByIndex,
  sortCustomPaletteColor,
  updateCustomPaletteColor
} from '@kepler.gl/utils';
import {ColorBreak, ColorBreakOrdinal} from '@kepler.gl/utils';
import {Add, Trash, VertDots} from '../../common/icons';
import {Button, Input} from '../../common/styled-components';
import CustomPicker from './custom-picker';

export type ActionIcons = {
  delete: ElementType;
  sort: ElementType;
  add: ElementType;
};

export type EditColorMapFunc = (v: number, i: number) => void;
export type SetColorUIFunc = (newConfig: NestedPartial<ColorUI>) => void;

/**
 * EditableColorRange
 */
export type EditableColorRangeProps = {
  item: ColorBreak;
  isLast: boolean;
  index: number;
  editColorMap?: EditColorMapFunc;
  editable: boolean;
};

export type CustomPaletteProps = {
  customPalette: ColorUI['customPalette'];
  setColorPaletteUI: SetColorUIFunc;
  showSketcher: number | boolean;
  ordinalDomain?: string[] | number[];
  actionIcons?: ActionIcons;
  onApply: (e: React.MouseEvent) => void;
  onCancel: () => void;
};

export type CustomPaletteInputProps = {
  index: number;
  isSorting: boolean;
  color: HexColor;
  colorBreaks: ColorBreakOrdinal[] | ColorBreak[] | null;
  inputColorHex: (index: number, v: HexColor) => void;
  editColorMapValue: EditColorMapFunc;
  actionIcons?: ActionIcons;
  disableAppend?: boolean;
  disableDelete?: boolean;
  onDelete: (index: number) => void;
  onAdd: (index: number) => void;
  onToggleSketcher: (index: number) => void;
};

const defaultActionIcons = {
  delete: Trash,
  sort: VertDots,
  add: Add
};

const dragHandleActive = css`
  .layer__drag-handle {
    color: ${props => props.theme.textColorHl};
    opacity: 1;
    cursor: move;
  }
`;

export const ColorPaletteItem = styled.div`
  display: flex;
  align-items: center;
  padding-top: 2px;
  padding-bottom: 2px;
  z-index: ${props => props.theme.dropdownWrapperZ + 1};
  justify-content: space-between;

  .custom-palette-input__left {
    display: flex;
    align-items: center;
  }

  .custom-palette-input__right {
    display: flex;
    align-items: center;
    padding-right: 6px;
  }

  &:not(.sorting):not(.disabled) {
    &:hover {
      background-color: ${props => props.theme.panelBackgroundHover};
      ${dragHandleActive};
    }
  }

  &.sorting-colors {
    background-color: ${props => props.theme.panelBackgroundHover};
    ${dragHandleActive};
  }
`;

const StyledDragHandle = styled.div`
  display: flex;
  align-items: center;
  opacity: 0;
`;

const StyledAction = styled.div`
  color: ${props => props.theme.subtextColor};
  svg {
    &:hover {
      color: ${props => props.theme.subtextColorActive};
    }
  }

  margin-left: 4px;
  &:hover {
    cursor: pointer;
  }
`;

export const DividerLine = styled.div`
  height: 1px;
  background-color: ${props => props.theme.dropdownListBorderTop};
  margin-top: 8px;
`;

export const ColorSwatch = styled.div.attrs({
  className: 'custom-palette__swatch'
})`
  background-color: ${props => props.color};
  width: 32px;
  height: 18px;
  display: inline-block;
  &:hover {
    box-shadow: ${props => props.theme.boxShadow};
    cursor: pointer;
  }
`;

const StyledButtonContainer = styled.div`
  margin-top: 11px;
  display: flex;
  direction: rtl;
  padding: 0 12px;
`;

const StyledAddStepContainer = styled.div`
  margin-top: 11px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 12px;
  color: ${props => props.theme.inputColor};
  .addcolor {
    margin-top: 4px;
  }
`;

const StyledInput = styled(Input).withConfig({shouldForwardProp})<{
  width: string;
  textAlign: string;
}>`
  width: ${props => props.width ?? '100%'};
  text-align: ${props => props.textAlign ?? 'end'};
  pointer-events: ${props => (props.disabled ? 'none' : 'all')};
`;

const InputText = styled.div.withConfig({shouldForwardProp})<{width: string; textAlign: string}>`
  ${props => props.theme.input};
  background-color: transparent;
  border-color: transparent;
  width: ${props => props.width ?? '100%'};
  text-align: ${props => props.textAlign ?? 'end'};

  &:hover {
    cursor: auto;
    background-color: transparent;
    border-color: transparent;
  }
`;

type SortableItemProps = {
  id: string;
  children: (listeners: any) => React.ReactNode;
  className?: string;
  isSorting: boolean;
};

const SortableItem = ({id, children, isSorting}: SortableItemProps) => {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0
  };
  return (
    <ColorPaletteItem
      ref={setNodeRef}
      style={style}
      className={classnames('custom-palette__sortable-items', {sorting: isSorting || isDragging})}
      {...attributes}
    >
      {children(listeners)}
    </ColorPaletteItem>
  );
};

type WrappedSortableContainerProps = {
  children?: React.ReactNode;
  className?: string;
  onSortEnd: (event: DragEndEvent) => void;
  onSortStart: () => void;
};

const WrappedSortableContainer = ({
  children,
  className,
  onSortEnd,
  onSortStart
}: WrappedSortableContainerProps) => {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onSortEnd}
      onDragStart={onSortStart}
    >
      <SortableContext
        items={React.Children.map(children, (_, index) => `${index}`) || []}
        strategy={verticalListSortingStrategy}
      >
        <div className={className}>{children}</div>
      </SortableContext>
    </DndContext>
  );
};

type DragHandleProps = PropsWithChildren<{className?: string}>;
const DragHandle = ({className, children, ...listeners}: DragHandleProps) => (
  <StyledDragHandle className={className} {...listeners}>
    {children}
  </StyledDragHandle>
);

export type ColorPaletteInputProps = {
  value: string | number;
  onChange: (val: unknown) => void;
  id: string;
  width: string;
  textAlign: string;
  editable: boolean;
};

export const ColorPaletteInput = ({
  value,
  onChange,
  id,
  width,
  textAlign,
  editable
}: ColorPaletteInputProps) => {
  const [stateValue, setValue] = useState(value);
  const inputRef = useRef(null);
  useEffect(() => {
    setValue(value);
  }, [value]);

  const onKeyDown = useCallback(
    e => {
      switch (e.keyCode) {
        case KeyEvent.DOM_VK_ENTER:
        case KeyEvent.DOM_VK_RETURN:
          onChange(stateValue);
          if (inputRef !== null) {
            // @ts-ignore
            inputRef?.current.blur();
          }
          break;
        default:
          break;
      }
    },
    [onChange, stateValue]
  );

  const _onChange = useCallback(e => setValue(e.target.value), [setValue]);
  const onBlur = useCallback(() => onChange(stateValue), [onChange, stateValue]);

  return editable ? (
    <StyledInput
      ref={inputRef}
      className="custom-palette-hex__input"
      value={stateValue}
      onChange={_onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      id={id}
      width={width}
      textAlign={textAlign}
      secondary
    />
  ) : (
    <InputText className="custom-palette-hex__input__text" width={width} textAlign={textAlign}>
      {value}
    </InputText>
  );
};

const Dash = styled.div`
  width: 6px;
  border-top: 1px solid ${props => props.theme.subtextColor};
  margin-left: 4px;
  margin-right: 4px;
`;

const StyledRangeInput = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 12px;
`;

const StyledColorHexInput = styled.div`
  margin-left: 12px;
`;

export const EditableColorRange: React.FC<EditableColorRangeProps> = ({
  item,
  isLast,
  index,
  editColorMap,
  editable
}) => {
  const noMinBound = !Number.isFinite(item.inputs[0]) && index === 0;
  const noMaxBound = !Number.isFinite(item.inputs[1]) && isLast;
  const onChangeLeft = useCallback(
    val => {
      if (editable && editColorMap) editColorMap(parseFloat(val), index - 1);
    },
    [editColorMap, index, editable]
  );
  const onChangeRight = useCallback(
    val => {
      if (editable && editColorMap) editColorMap(parseFloat(val), index);
    },
    [editColorMap, index, editable]
  );

  return (
    <StyledRangeInput>
      <ColorPaletteInput
        value={noMinBound ? 'Less' : item.inputs[0].toString()}
        id={`color-palette-input-${index}-left`}
        width="50px"
        textAlign="end"
        editable={noMinBound ? false : editable}
        onChange={onChangeLeft}
      />
      <Dash />
      <ColorPaletteInput
        value={noMaxBound ? 'More' : item.inputs[1].toString()}
        id={`color-palette-input-${index}-right`}
        width="50px"
        textAlign="end"
        onChange={onChangeRight}
        editable={noMaxBound ? false : editable}
      />
    </StyledRangeInput>
  );
};

export const AddColorStop = ({onColorAdd, IconComponent}) => (
  <StyledAction onClick={onColorAdd} className="addcolor">
    <IconComponent height="14px" />
  </StyledAction>
);

export const DeleteColorStop = ({onColorDelete, IconComponent}) => (
  <StyledAction onClick={onColorDelete} className="trashbin">
    <IconComponent height="14px" />
  </StyledAction>
);

export const CustomPaletteInput: React.FC<CustomPaletteInputProps> = ({
  index,
  isSorting,
  color,
  colorBreaks,
  inputColorHex,
  editColorMapValue,
  actionIcons = defaultActionIcons,
  disableAppend,
  disableDelete,
  onDelete,
  onAdd,
  onToggleSketcher
}) => {
  const onClickSwtach = useCallback(() => onToggleSketcher(index), [onToggleSketcher, index]);
  const onColorInput = useCallback(v => inputColorHex(index, v), [inputColorHex, index]);
  const onColorDelete = useCallback(() => onDelete(index), [onDelete, index]);
  const onColorAdd = useCallback(() => onAdd(index), [onAdd, index]);
  const showHexInput = !colorBreaks;

  return (
    <SortableItem id={`${index}`} isSorting={isSorting}>
      {listeners => (
        <>
          <div className="custom-palette-input__left">
            <DragHandle className="layer__drag-handle" {...listeners}>
              <actionIcons.sort height="20px" />
            </DragHandle>
            <ColorSwatch color={color} onClick={onClickSwtach} />
            {showHexInput ? (
              <StyledColorHexInput>
                <ColorPaletteInput
                  value={color.toUpperCase()}
                  onChange={onColorInput}
                  id={`input-layer-label-${index}`}
                  editable
                  textAlign="left"
                  width="70px"
                />
              </StyledColorHexInput>
            ) : null}
            {isNumericColorBreaks(colorBreaks) ? (
              <EditableColorRange
                item={colorBreaks[index]}
                isLast={index === colorBreaks.length - 1}
                index={index}
                editColorMap={editColorMapValue}
                editable
              />
            ) : null}
          </div>
          <div className="custom-palette-input__right">
            {!disableAppend ? (
              <AddColorStop onColorAdd={onColorAdd} IconComponent={actionIcons.add} />
            ) : null}
            {!disableDelete ? (
              <DeleteColorStop onColorDelete={onColorDelete} IconComponent={actionIcons.delete} />
            ) : null}
          </div>
        </>
      )}
    </SortableItem>
  );
};

const StyledCategoricalValuePickerWrapper = styled.div.attrs({
  className: 'categorical-value-picker'
})`
  width: 150px;
  color: ${props => props.theme.inputColor};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  column-gap: 8px;
  align-items: center;
  cursor: pointer;
`;

type StyledCategoricalValuePickerProps = {noBorder: boolean};
const StyledCategoricalValuePicker = styled.div<StyledCategoricalValuePickerProps>`
  width: fit-content;
  font-size: 11px;
  border-bottom: ${props => (props.noBorder ? '' : '1px dashed')};
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100px;
`;

type DropdownValuesWrapperProps = {width: number};
const DropdownValuesWrapper = styled.div<DropdownValuesWrapperProps>`
  border: 0;
  width: 100%;
  left: 0;
  z-index: ${props => props.theme.dropdownWrapperZ};
  width: ${props => props.width}px;
`;

type SelectedValuesWrapperProps = {width: number; height: number};
const SelectedValuesWrapper = styled(DropdownValuesWrapper)<SelectedValuesWrapperProps>`
  width: ${props => props.width}px;
  max-height: ${props => props.height}px;
  overflow: auto;

  .custom-palette-chickleted-input {
    padding: 8px;
    background-color: ${props => props.theme.dropdownWrapperZ};
  }
`;

const StyledDropdownHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: ${props => props.theme.inputColor};
  padding: 0 8px;
  font-size: 10px;

  .button {
    margin: 0;
    padding: 0;
    width: fit-content;
  }
`;

const StyledTooltipContent = styled.div`
  padding: 8px;
  width: 150px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const NUMBER_VALUES_IN_TOOLTIP = 10;

const CategoricalSelectorContext = React.createContext({
  onSelectRest: () => null,
  onReset: () => null
});

// Categorical values dropdownlist:
// extending DropdownList and adding 'Select the Rest' and 'Reset' buttons
class ModifiedDropdownList extends DropdownList {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <CategoricalSelectorContext.Consumer>
          {context => (
            <>
              <StyledDropdownHeader>
                <Button link size="smal" onClick={context.onSelectRest}>
                  Select the Rest
                </Button>
                <Button link size="smal" onClick={context.onReset}>
                  Reset
                </Button>
              </StyledDropdownHeader>
              <DividerLine />
              <DropdownList {...this.props} />
            </>
          )}
        </CategoricalSelectorContext.Consumer>
      </>
    );
  }
}

export type CategoricalSelectorProps = {
  index: number;
  selectedValues: (string | number | null)[];
  allValues: string[] | number[];
  addColorMapValue?: (v: (number | string | null)[], i: number) => void;
  removeColorMapValue?: (v: number | string, i: number) => void;
  resetColorMapValue?: (i: number) => void;
  selectRestColorMapValue?: (i: number) => void;
  editable?: boolean;
};

// Categorical values selector for editing categorical values
export const CategoricalSelector: React.FC<CategoricalSelectorProps> = ({
  index,
  selectedValues,
  allValues,
  addColorMapValue,
  removeColorMapValue,
  resetColorMapValue,
  selectRestColorMapValue,
  editable = true
}: CategoricalSelectorProps) => {
  const [showTypeahead, setShowTypeahead] = useState(false);

  const onOptionSelected = useCallback(
    value => {
      const previousSelected = toArray(selectedValues);
      const items = uniq(previousSelected.concat(toArray(value)));
      addColorMapValue?.(items, index);
    },
    [selectedValues, index, addColorMapValue]
  );

  const onOpenDropdown = useCallback(() => {
    setShowTypeahead(true);
  }, []);

  const onCloseDropdown = useCallback(() => {
    setShowTypeahead(false);
  }, []);

  const onRemoveItem = useCallback(
    value => {
      removeColorMapValue?.(value, index);
    },
    [index, removeColorMapValue]
  );

  const onReset = useCallback(() => {
    resetColorMapValue?.(index);
    setShowTypeahead(false);
    return null;
  }, [resetColorMapValue, index]);

  const onSelectRest = useCallback(() => {
    selectRestColorMapValue?.(index);
    setShowTypeahead(false);
    return null;
  }, [selectRestColorMapValue, index]);

  return (
    <StyledCategoricalValuePickerWrapper>
      {editable && <Add height="12px" onClick={onOpenDropdown} />}
      <StyledCategoricalValuePicker
        noBorder={selectedValues.length === 0 || !editable}
        onClick={onOpenDropdown}
        data-tip
        data-for={`category-values-${index}`}
      >
        {selectedValues.length === 0
          ? 'Add Value'
          : selectedValues.length === 1
          ? selectedValues[0]
          : `${selectedValues.length} selected`}
        {selectedValues.length > 1 && (
          <Tooltip id={`category-values-${index}`} place="top" interactive={true}>
            <StyledTooltipContent>
              {selectedValues.slice(0, NUMBER_VALUES_IN_TOOLTIP).map((value, i) => (
                <div key={i}>{value}</div>
              ))}
              {selectedValues.length > NUMBER_VALUES_IN_TOOLTIP && <div>...</div>}
            </StyledTooltipContent>
          </Tooltip>
        )}
      </StyledCategoricalValuePicker>
      {editable && (
        <Portaled left={0} top={0} isOpened={showTypeahead} onClose={onCloseDropdown}>
          {selectedValues.length > 1 && (
            <SelectedValuesWrapper width={250} height={200}>
              <ChickletedInput
                className={'custom-palette-chickleted-input'}
                selectedItems={selectedValues}
                placeholder={''}
                removeItem={onRemoveItem}
                onClick={() => null}
                CustomChickletComponent={null}
              />
            </SelectedValuesWrapper>
          )}
          <DropdownValuesWrapper width={250}>
            <div style={{position: 'relative'}}>
              <CategoricalSelectorContext.Provider
                value={{
                  onReset,
                  onSelectRest
                }}
              >
                <Typeahead
                  customClasses={{
                    results: 'list-selector',
                    input: 'typeahead__input',
                    listItem: 'list__item',
                    listAnchor: 'list__item__anchor'
                  }}
                  options={allValues}
                  placeholder={'Search'}
                  onOptionSelected={onOptionSelected}
                  customListComponent={ModifiedDropdownList}
                  customListItemComponent={ListItem}
                  searchable={true}
                  showOptionsWhenEmpty
                  selectedItems={selectedValues}
                />
              </CategoricalSelectorContext.Provider>
            </div>
          </DropdownValuesWrapper>
        </Portaled>
      )}
    </StyledCategoricalValuePickerWrapper>
  );
};

export type CategoricalCustomPaletteInputProps = {
  index: number;
  isSorting: boolean;
  color: HexColor;
  colorMap?: ColorMap | null;
  addColorMapValue: (v: (number | string | null)[], i: number) => void;
  removeColorMapValue: (v: number | string, i: number) => void;
  resetColorMapValue: (i: number) => void;
  selectRestColorMapValue: (i: number) => void;
  actionIcons?: ActionIcons;
  onDelete: (index: number) => void;
  onAdd: (index: number) => void;
  onToggleSketcher: (index: number) => void;
  allValues: string[] | number[];
  disableDelete?: boolean;
};

export const CategoricalCustomPaletteInput: React.FC<CategoricalCustomPaletteInputProps> = ({
  index,
  isSorting,
  color,
  colorMap,
  actionIcons = defaultActionIcons,
  onDelete,
  disableDelete,
  onToggleSketcher,
  addColorMapValue,
  removeColorMapValue,
  resetColorMapValue,
  selectRestColorMapValue,
  allValues
}: CategoricalCustomPaletteInputProps) => {
  const selectedValues: (number | string | null)[] = useMemo(() => {
    if (!colorMap || !colorMap[index]) return [];
    const value = colorMap[index][0];
    const values = Array.isArray(value) ? value : value !== null ? [value] : [];
    return values;
  }, [colorMap, index]);

  const onClickSwtach = useCallback(() => onToggleSketcher(index), [onToggleSketcher, index]);
  const onColorDelete = useCallback(() => onDelete(index), [onDelete, index]);

  return (
    <SortableItem id={`${index}`} isSorting={isSorting}>
      {listeners => (
        <>
          <div className="custom-palette-input__left">
            <DragHandle className="layer__drag-handle" {...listeners}>
              <actionIcons.sort height="20px" />
            </DragHandle>
            <ColorSwatch color={color} onClick={onClickSwtach} />
            {colorMap && colorMap[index] && (
              <CategoricalSelector
                selectedValues={selectedValues}
                allValues={allValues}
                addColorMapValue={addColorMapValue}
                removeColorMapValue={removeColorMapValue}
                resetColorMapValue={resetColorMapValue}
                selectRestColorMapValue={selectRestColorMapValue}
                index={index}
              />
            )}
          </div>
          <div className="custom-palette-input__right">
            {!disableDelete ? (
              <DeleteColorStop onColorDelete={onColorDelete} IconComponent={actionIcons.delete} />
            ) : null}
          </div>
        </>
      )}
    </SortableItem>
  );
};

export const BottomAction = ({onCancel, onConfirm}) => (
  <StyledButtonContainer>
    <Button className="confirm-apply__button" small onClick={onConfirm}>
      Confirm
    </Button>
    <Button link small onClick={onCancel}>
      Cancel
    </Button>
  </StyledButtonContainer>
);

const StyledCustomPalette = styled.div.attrs({
  className: 'custom-palette'
})`
  margin-top: 8px;
`;

function CustomPaletteFactory(): React.FC<CustomPaletteProps> {
  const CustomPalette: React.FC<CustomPaletteProps> = ({
    ordinalDomain,
    customPalette,
    setColorPaletteUI,
    showSketcher,
    actionIcons = defaultActionIcons,
    onCancel,
    onApply
  }) => {
    const [isSorting, setIsSorting] = useState(false);
    const {colors, colorMap} = customPalette;
    const colorBreaks = useMemo(
      () =>
        colorMap
          ? customPalette.type === 'custom'
            ? colorMapToColorBreaks(colorMap)
            : colorMapToCategoricalColorBreaks(colorMap)
          : null,
      [customPalette.type, colorMap]
    );

    const onPickerUpdate = useCallback(
      color => {
        if (color && Number.isFinite(showSketcher)) {
          const newCustomPalette = updateCustomPaletteColor(
            customPalette,
            Number(showSketcher),
            color.hex
          );
          setColorPaletteUI({
            customPalette: newCustomPalette
          });
        }
      },
      [customPalette, showSketcher, setColorPaletteUI]
    );
    const onToggleSketcher = useCallback(
      val => {
        setColorPaletteUI({
          showSketcher: val
        });
      },
      [setColorPaletteUI]
    );
    const onDelete = useCallback(
      index => {
        const newCustomPalette = removeCustomPaletteColor(customPalette, index);
        setColorPaletteUI({
          customPalette: newCustomPalette
        });
      },
      [customPalette, setColorPaletteUI]
    );

    const onAdd = useCallback(
      index => {
        // add color at the end
        const newCustomPalette = addCustomPaletteColor(customPalette, index);
        setColorPaletteUI({
          customPalette: newCustomPalette
        });
      },
      [customPalette, setColorPaletteUI]
    );

    const onAddCategoricalStep = useCallback(() => {
      onAdd(colors.length - 1);
    }, [colors.length, onAdd]);

    const onSwatchClose = useCallback(() => {
      onToggleSketcher(false);
    }, [onToggleSketcher]);

    const onConfirm = useCallback(
      event => {
        event.stopPropagation();
        event.preventDefault();
        onCancel();
        onApply(event);
      },
      [onCancel, onApply]
    );

    const onSortEnd = useCallback(
      (event: DragEndEvent) => {
        const {active, over} = event;
        if (over && active.id !== over.id) {
          const oldIndex = colors.findIndex((_, index) => `${index}` === active.id);
          const newIndex = colors.findIndex((_, index) => `${index}` === over.id);
          const newCustomPalette = sortCustomPaletteColor(customPalette, oldIndex, newIndex);
          setColorPaletteUI({
            customPalette: newCustomPalette
          });
        }
        setIsSorting(false);
      },
      [colors, customPalette, setIsSorting, setColorPaletteUI]
    );

    const onSortStart = useCallback(() => {
      setIsSorting(true);
    }, [setIsSorting]);

    const inputColorHex = useCallback(
      (index, value) => {
        const newCustomPalette = updateCustomPaletteColor(customPalette, index, value);
        // setColors(newColors);
        setColorPaletteUI({
          customPalette: newCustomPalette
        });
      },
      [customPalette, setColorPaletteUI]
    );

    const editColorMapValue = useCallback(
      (value, index) => {
        if (!customPalette.colorMap) {
          return;
        }
        const newColorMap = customPalette.colorMap.map(
          (cm, i) => (i === index ? [value, cm[1]] : cm) as [string, string]
        );

        // sort the user inputs in case the break values are not ordered
        const breaks = newColorMap
          .map(cm => cm[0] as string | null)
          .slice(0, -1)
          .sort((a, b) => Number(a) - Number(b))
          .concat(null);
        const sortedNewColorMap: ColorMap = newColorMap.map((cm, i) => [breaks[i], cm[1]]);

        setColorPaletteUI({
          customPalette: {
            ...customPalette,
            colorMap: sortedNewColorMap
          }
        });
      },
      [setColorPaletteUI, customPalette]
    );

    // remove a selected category item from a color map
    const removeCategoricalColorMapValue = useCallback(
      (item, index) => {
        if (!colorMap) {
          return;
        }
        setColorPaletteUI({
          customPalette: {
            ...customPalette,
            colorMap: removeCategoricalValueFromColorMap(colorMap, item, index)
          }
        });
      },
      [setColorPaletteUI, customPalette, colorMap]
    );

    // add selected categorical items to a color map
    const addCategoricalColorMapValue = useCallback(
      (items, index) => {
        if (!colorMap) {
          return;
        }
        setColorPaletteUI({
          customPalette: {
            ...customPalette,
            colorMap: addCategoricalValuesToColorMap(colorMap, items, index)
          }
        });
      },
      [setColorPaletteUI, customPalette, colorMap]
    );

    // reset a color map
    const resetCategoricalColorMapValue = useCallback(
      index => {
        if (!colorMap) {
          return;
        }
        setColorPaletteUI({
          customPalette: {
            ...customPalette,
            colorMap: resetCategoricalColorMapByIndex(colorMap, index)
          }
        });
      },
      [setColorPaletteUI, customPalette, colorMap]
    );

    // select the rest values for a color map
    const selectRestCategoricalColorMap = useCallback(
      index => {
        if (!colorMap) {
          return;
        }
        setColorPaletteUI({
          customPalette: {
            ...customPalette,
            colorMap: selectRestCategoricalColorMapByIndex(colorMap, index, ordinalDomain)
          }
        });
      },
      [setColorPaletteUI, customPalette, colorMap, ordinalDomain]
    );

    return (
      <StyledCustomPalette>
        <WrappedSortableContainer
          className="custom-palette__sortable-container"
          onSortEnd={onSortEnd}
          onSortStart={onSortStart}
        >
          {colors.map((color, index) =>
            customPalette.type === 'custom' ? (
              <CustomPaletteInput
                key={index}
                colorBreaks={colorBreaks}
                index={index}
                isSorting={isSorting}
                color={color}
                inputColorHex={inputColorHex}
                disableAppend={colors.length >= 20}
                disableDelete={colors.length <= 2}
                actionIcons={actionIcons}
                onAdd={onAdd}
                onDelete={onDelete}
                onToggleSketcher={onToggleSketcher}
                editColorMapValue={editColorMapValue}
              />
            ) : (
              ordinalDomain && (
                <CategoricalCustomPaletteInput
                  key={index}
                  colorMap={colorMap}
                  index={index}
                  isSorting={isSorting}
                  color={color}
                  actionIcons={actionIcons}
                  onAdd={onAdd}
                  onDelete={onDelete}
                  disableDelete={colors.length <= 2}
                  onToggleSketcher={onToggleSketcher}
                  addColorMapValue={addCategoricalColorMapValue}
                  removeColorMapValue={removeCategoricalColorMapValue}
                  resetColorMapValue={resetCategoricalColorMapValue}
                  selectRestColorMapValue={selectRestCategoricalColorMap}
                  allValues={ordinalDomain}
                />
              )
            )
          )}
        </WrappedSortableContainer>
        {customPalette.type === 'customOrdinal' && (
          <StyledAddStepContainer>
            <AddColorStop onColorAdd={onAddCategoricalStep} IconComponent={actionIcons.add} />
            <Button link size="smal" onClick={onAddCategoricalStep}>
              Add Step
            </Button>
          </StyledAddStepContainer>
        )}
        <DividerLine />
        {/* Cancel or Confirm Buttons */}
        <BottomAction onCancel={onCancel} onConfirm={onConfirm} />
        <Portaled isOpened={showSketcher !== false} left={280} top={-300} onClose={onSwatchClose}>
          <CustomPicker color={colors[Number(showSketcher)]} onChange={onPickerUpdate} />
        </Portaled>
      </StyledCustomPalette>
    );
  };

  return CustomPalette;
}

export default CustomPaletteFactory;
