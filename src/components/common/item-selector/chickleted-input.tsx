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

import React, {ElementType, MouseEventHandler, ReactNode} from 'react';

import styled from 'styled-components';
import Delete from '../icons/delete';
import {FormattedMessage} from 'localization';

interface ChickletedInput {
  // required properties
  onClick: MouseEventHandler<HTMLDivElement>;
  removeItem: Function;

  // optional properties
  selectedItems?: any[];
  disabled?: boolean;
  displayOption?: Function;
  focus?: boolean;
  error?: boolean;
  placeholder?: string;
  inputTheme?: string;
  CustomChickletComponent?: ElementType;
  className?: string;
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

const ChickletedInput = ({
  disabled,
  onClick,
  className,
  selectedItems = [],
  placeholder = '',
  removeItem,
  displayOption = d => d,
  inputTheme,
  CustomChickletComponent
}: ChickletedInput) => (
  <ChickletedInputContainer
    className={`${className} chickleted-input`}
    onClick={onClick}
    inputTheme={inputTheme}
    hasPlaceholder={!selectedItems || !selectedItems.length}
  >
    {selectedItems.length > 0 ? (
      selectedItems.map((item, i) => {
        const chickletProps = {
          inputTheme,
          disabled,
          key: `${displayOption(item)}_${i}`,
          name: displayOption(item),
          displayOption,
          item,
          remove: e => removeItem(item, e)
        };
        return CustomChickletComponent ? (
          <CustomChickletComponent {...chickletProps} />
        ) : (
          <Chicklet {...chickletProps} />
        );
      })
    ) : (
      <span className={`${className} chickleted-input__placeholder`}>
        <FormattedMessage id={placeholder || 'placeholder.enterValue'} />
      </span>
    )}
  </ChickletedInputContainer>
);

export default ChickletedInput;
