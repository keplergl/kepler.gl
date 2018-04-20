// Copyright (c) 2018 Uber Technologies, Inc.
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
  placeholder: PropTypes.string
};

const ChickletButton = styled.div`
  background: ${props => props.theme.panelActiveBg};
  border-radius: 1px;
  color: ${props => props.theme.textColor};
  font-size: 11px;
  line-height: 20px;
  margin: 3px 10px 3px 3px;
  padding: 4px 6px;
  display: flex;
  align-items: center;
  max-width: calc(100% - 8px);

  :hover {
    color: ${props => props.theme.textColorHl};
  }
`;

const ChickletTag = styled.span`
  margin-right: 10px;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;

  :hover {
    overflow: visible;
  }
`;

const Chicklet = ({disabled, name, remove}) => (
  <ChickletButton>
    <ChickletTag>{name}</ChickletTag>
    <Delete height="10px" onClick={disabled ? null : remove} />
  </ChickletButton>
);

const ChickletedInputContainer = styled.div`
  ${props => props.theme.chickletedInput}
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
  displayOption = d => d
}) => (
  <ChickletedInputContainer
    className={`${className} chickleted-input`}
    focus={focus}
    disabled={disabled}
    error={error}
    onClick={onClick}
  >
    {selectedItems.length > 0
      ? selectedItems.map((item, i) => (
          <Chicklet
            disabled={disabled}
            key={`${displayOption(item)}_${i}`}
            name={displayOption(item)}
            remove={e => removeItem(item, e)}
          />
        ))
      : placeholder}
  </ChickletedInputContainer>
);

ChickletedInput.propTypes = propTypes;

export default ChickletedInput;
