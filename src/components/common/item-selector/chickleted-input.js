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

import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import Delete from '../icons/delete';
import {FormattedMessage} from 'localization';

const propTypes = {
  // required properties
  onClick: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,

  // optional properties
  selectedItems: PropTypes.arrayOf(PropTypes.any),
  disabled: PropTypes.bool,
  displayOption: PropTypes.func,
  focus: PropTypes.bool,
  error: PropTypes.bool,
  placeholder: PropTypes.string,
  inputTheme: PropTypes.string
};

export const ChickletButton = styled.div`
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

const Chicklet = ({disabled, name, remove, inputTheme}) => (
  <ChickletButton inputTheme={inputTheme}>
    <ChickletTag>{name}</ChickletTag>
    <Delete onClick={disabled ? null : remove} />
  </ChickletButton>
);

const ChickletedInputContainer = styled.div`
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
  focus,
  disabled,
  error,
  onClick,
  className,
  selectedItems = [],
  placeholder = '',
  removeItem,
  displayOption = d => d,
  inputTheme,
  CustomChickletComponent
}) => (
  <ChickletedInputContainer
    className={`${className} chickleted-input`}
    focus={focus}
    disabled={disabled}
    error={error}
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

ChickletedInput.propTypes = propTypes;

export default ChickletedInput;
