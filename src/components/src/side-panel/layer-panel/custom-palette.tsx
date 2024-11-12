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
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableElementProps,
  SortableHandle
} from 'react-sortable-hoc';
import styled, {StyledComponent, css} from 'styled-components';
import Portaled from '../../common/portaled';

import {KeyEvent} from '@kepler.gl/constants';
import {ColorUI, HexColor} from '@kepler.gl/types';
import {colorMapToColorBreaks, isNumericColorBreaks} from '@kepler.gl/utils';
import {
  addCustomPaletteColor,
  removeCustomPaletteColor,
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
export type SetColorUIFunc = (
  newConfig: Partial<{[key in keyof ColorUI]: ColorUI[keyof ColorUI]}>
) => void;

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
  padding-top: 6px;
  padding-bottom: 6px;
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

  :not(.sorting):not(.disabled) {
    :hover {
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
    :hover {
      color: ${props => props.theme.subtextColorActive};
    }
  }

  margin-left: 4px;
  :hover {
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
  :hover {
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

const StyledInput = styled(
  Input as StyledComponent<'input', any, {width: string; textAlign: string; disabled: boolean}, any>
)`
  width: ${props => props.width ?? '100%'};
  text-align: ${props => props.textAlign ?? 'end'};
  pointer-events: ${props => (props.disabled ? 'none' : 'all')};
`;

const InputText = styled.div<{width: string; textAlign: string}>`
  ${props => props.theme.input};
  background-color: transparent;
  border-color: transparent;
  width: ${props => props.width ?? '100%'};
  text-align: ${props => props.textAlign ?? 'end'};

  :hover {
    cursor: auto;
    background-color: transparent;
    border-color: transparent;
  }
`;

type SortableItemProps = SortableElementProps & {
  children?: React.ReactNode;
  className?: string;
  isSorting: boolean;
};

const SortableItem = SortableElement<SortableItemProps>(({children, isSorting}) => (
  <ColorPaletteItem className={classnames('custom-palette__sortable-items', {sorting: isSorting})}>
    {children}
  </ColorPaletteItem>
));

type WrappedSortableContainerProps = SortableContainerProps & {
  children?: React.ReactNode;
  className?: string;
};

// TODO: Should className be applied to the div here?
const WrappedSortableContainer = SortableContainer<WrappedSortableContainerProps>(
  ({children, className}) => <div className={className}>{children}</div>
);

type DragHandleProps = PropsWithChildren<{className?: string; listeners?: unknown}>;

export const DragHandle = SortableHandle<DragHandleProps>(({className, children}) => (
  <StyledDragHandle className={className}>{children}</StyledDragHandle>
));

export const ColorPaletteInput = ({value, onChange, id, width, textAlign, editable}) => {
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
  const noMinBound = item.inputs[0] === null && index === 0;
  const noMaxBound = item.inputs[1] === null && isLast;
  const onChangeLeft = useCallback(
    val => {
      if (editable && editColorMap) editColorMap(parseFloat(val), index - 1);
      return;
    },
    [editColorMap, index, editable]
  );
  const onChangeRight = useCallback(
    val => {
      if (editable && editColorMap) editColorMap(parseFloat(val), index);
      return;
    },
    [editColorMap, index, editable]
  );

  return (
    <StyledRangeInput>
      <ColorPaletteInput
        value={noMinBound ? 'Less' : item.inputs[0]}
        id={`color-palette-input-${index}-left`}
        width="50px"
        textAlign="end"
        editable={noMinBound ? false : editable}
        onChange={onChangeLeft}
      />
      <Dash />
      <ColorPaletteInput
        value={noMaxBound ? 'More' : item.inputs[1]}
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
    <SortableItem index={index} isSorting={isSorting}>
      <div className="custom-palette-input__left">
        <DragHandle className="layer__drag-handle">
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
        <AddColorStop onColorAdd={onColorAdd} IconComponent={actionIcons.add} />
        {!disableDelete ? (
          <DeleteColorStop onColorDelete={onColorDelete} IconComponent={actionIcons.delete} />
        ) : null}
      </div>
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
      () => (colorMap ? colorMapToColorBreaks(colorMap) : null),
      [colorMap]
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
      ({oldIndex, newIndex}) => {
        const newCustomPalette = sortCustomPaletteColor(customPalette, oldIndex, newIndex);
        setColorPaletteUI({
          customPalette: newCustomPalette
        });
        setIsSorting(false);
      },
      [customPalette, setColorPaletteUI, setIsSorting]
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
        const newColorMap = customPalette.colorMap.map((cm, i) =>
          i === index ? [value, cm[1]] : cm
        );
        setColorPaletteUI({
          customPalette: {
            ...customPalette,
            colorMap: newColorMap
          }
        });
      },
      [setColorPaletteUI, customPalette]
    );

    return (
      <StyledCustomPalette>
        <WrappedSortableContainer
          className="custom-palette__sortable-container"
          onSortEnd={onSortEnd}
          onSortStart={onSortStart}
          lockAxis="y"
          helperClass="sorting-colors"
          useDragHandle
        >
          {colors.map((color, index) => (
            <CustomPaletteInput
              key={index}
              colorBreaks={colorBreaks}
              index={index}
              isSorting={isSorting}
              color={color}
              inputColorHex={inputColorHex}
              disableDelete={colors.length <= 2}
              actionIcons={actionIcons}
              onAdd={onAdd}
              onDelete={onDelete}
              onToggleSketcher={onToggleSketcher}
              editColorMapValue={editColorMapValue}
            />
          ))}
        </WrappedSortableContainer>
        <DividerLine />
        {/* Cancel or Confirm Buttons */}
        <BottomAction onCancel={onCancel} onConfirm={onConfirm} />
        <Portaled isOpened={showSketcher !== false} left={280} top={-300}>
          <CustomPicker
            color={colors[Number(showSketcher)]}
            onChange={onPickerUpdate}
            onSwatchClose={onSwatchClose}
          />
        </Portaled>
      </StyledCustomPalette>
    );
  };

  return CustomPalette;
}

export default CustomPaletteFactory;
