// Copyright (c) 2022 Uber Technologies, Inc.
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

import React, {Component, createRef, MouseEventHandler, MouseEvent} from 'react';
import classnames from 'classnames';
import styled, {css} from 'styled-components';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import Portaled from 'components/common/portaled';

import {Button, InlineInput} from 'components/common/styled-components';
import {VertDots, Trash} from 'components/common/icons';
import ColorPalette from './color-palette';
import CustomPicker from './custom-picker';
import {arrayMove} from '@kepler.gl/layers';
import {ColorRange} from '@kepler.gl/constants';
import {NestedPartial} from '@kepler.gl/types';

type CustomPaletteProps = {
  customPalette: ColorRange;
  showSketcher?: boolean | number;
  setCustomPalette: (c: NestedPartial<ColorRange>) => void;
  onCancel: () => void;
  onToggleSketcher: (i: boolean | number) => void;
  onApply: (p: ColorRange, e: MouseEvent) => void;
};

const dragHandleActive = css`
  .layer__drag-handle {
    color: ${props => props.theme.textColorHl};
    opacity: 1;
    cursor: move;
  }
`;

const StyledSortableItem = styled.div`
  display: flex;
  align-items: center;
  padding-top: 6px;
  padding-bottom: 6px;
  z-index: ${props => props.theme.dropdownWrapperZ + 1};

  :not(.sorting) {
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

const StyledTrash = styled.div`
  color: ${props => props.theme.textColor};
  svg {
    :hover {
      color: ${props => props.theme.subtextColorActive};
    }
  }
  height: 12px;
  margin-left: auto;
  margin-right: 12px;
  :hover {
    cursor: pointer;
  }
`;

const StyledLine = styled.div`
  width: calc(100% - 16px);
  height: 1px;
  background-color: ${props => props.theme.labelColor};
  margin-top: 8px;
  margin-left: 8px;
`;

const StyledSwatch = styled.div.attrs({
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

const StyledColorRange = styled.div`
  padding: 0 8px;
  :hover {
    background-color: ${props => props.theme.panelBackgroundHover};
    cursor: pointer;
  }
`;

const StyledButtonContainer = styled.div`
  margin-top: 11px;
  display: flex;
  direction: rtl;
`;

const StyledInlineInput = styled.div`
  margin-left: 12px;
  input {
    color: ${props => props.theme.textColorHl};
    font-size: 10px;
  }
`;

const SortableItem = SortableElement(({children, isSorting}) => (
  <StyledSortableItem
    className={classnames('custom-palette__sortable-items', {sorting: isSorting})}
  >
    {children}
  </StyledSortableItem>
));

// TODO: Should className be applied to the div here?
const WrappedSortableContainer = SortableContainer(({children, className}) => (
  <div className={className}>{children}</div>
));

const DragHandle = SortableHandle(({className, children}) => (
  <StyledDragHandle className={className}>{children}</StyledDragHandle>
));

class CustomPalette extends Component<CustomPaletteProps> {
  state = {
    isSorting: false
  };

  root = createRef<HTMLDivElement>();

  _setColorPaletteUI(colors: string[]) {
    this.props.setCustomPalette({
      colors
    });
  }

  _onPickerUpdate = (color: {hex: string}) => {
    const {colors} = this.props.customPalette;
    const newColors = [...colors];
    newColors[this.props.showSketcher as number] = color.hex;
    this._setColorPaletteUI(newColors);
  };

  _onColorDelete = (index: number) => {
    const {colors} = this.props.customPalette;
    const newColors = [...colors];
    if (newColors.length > 1) {
      newColors.splice(index, 1);
    }
    this._setColorPaletteUI(newColors);
  };

  _onColorAdd = () => {
    const {colors} = this.props.customPalette;
    // add the last color
    const newColors = [...colors, colors[colors.length - 1]];
    this._setColorPaletteUI(newColors);
  };

  _onSwatchClick = (index: number) => {
    this.props.onToggleSketcher(index);
  };

  _onSwatchClose = () => {
    this.props.onToggleSketcher(false);
  };

  _onApply: MouseEventHandler = event => {
    event.stopPropagation();
    event.preventDefault();

    this.props.onCancel();
    this.props.onApply(this.props.customPalette, event);
  };

  _onSortEnd = ({oldIndex, newIndex}) => {
    const {colors} = this.props.customPalette;
    const newColors = arrayMove(colors, oldIndex, newIndex);
    this._setColorPaletteUI(newColors);
    this.setState({isSorting: false});
  };

  _onSortStart = () => {
    this.setState({isSorting: true});
  };

  _inputColorHex = (index: number, {target: {value}}) => {
    const {colors} = this.props.customPalette;
    const newColors = [...colors];
    newColors[index] = value.toUpperCase();
    this._setColorPaletteUI(newColors);
  };

  render() {
    const {colors} = this.props.customPalette;

    return (
      <div className="custom-palette-panel" ref={this.root}>
        <StyledColorRange>
          <ColorPalette colors={colors} />
        </StyledColorRange>
        <WrappedSortableContainer
          className="custom-palette-container"
          onSortEnd={this._onSortEnd}
          onSortStart={this._onSortStart}
          lockAxis="y"
          helperClass="sorting-colors"
          useDragHandle
        >
          {colors.map((color, index) => (
            <SortableItem key={index} index={index} isSorting={this.state.isSorting}>
              <DragHandle className="layer__drag-handle">
                <VertDots height="20px" />
              </DragHandle>
              <StyledSwatch color={color} onClick={() => this._onSwatchClick(index)} />
              <StyledInlineInput>
                <InlineInput
                  type="text"
                  className="custom-palette-hex__input"
                  value={color.toUpperCase()}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  onChange={e => this._inputColorHex(index, e)}
                  id={`input-layer-label-${index}`}
                />
              </StyledInlineInput>
              <StyledTrash onClick={() => this._onColorDelete(index)}>
                <Trash className="trashbin" />
              </StyledTrash>
            </SortableItem>
          ))}
        </WrappedSortableContainer>
        {/* Add Step Button */}
        <Button className="add-step__button" link onClick={this._onColorAdd}>
          + Add Step
        </Button>
        <StyledLine />
        {/* Cancel or Confirm Buttons */}
        <StyledButtonContainer>
          <Button className="confirm-apply__button" link onClick={this._onApply}>
            Confirm
          </Button>
          <Button link onClick={this.props.onCancel}>
            Cancel
          </Button>
        </StyledButtonContainer>

        <Portaled isOpened={this.props.showSketcher !== false} left={280} top={-300}>
          <CustomPicker
            color={colors[this.props.showSketcher as number]}
            onChange={this._onPickerUpdate}
            onSwatchClose={this._onSwatchClose}
          />
        </Portaled>
      </div>
    );
  }
}

export default CustomPalette;
