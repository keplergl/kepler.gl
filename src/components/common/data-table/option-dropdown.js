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
import Portaled from 'components/common/portaled';
import DropdownList from 'components/common/item-selector/dropdown-list';
import {SORT_ORDER, TABLE_OPTION, TABLE_OPTION_LIST} from 'constants/default-settings';

const ListItem = ({value}) => (
  <div>
    <value.icon height="13px" />
    {value.display}
  </div>
);

const StyledOptionsDropdown = styled.div`
  .list-selector {
    border-top: 0;
    width: max-content;
    padding: 8px 0;
  }

  .list__item > div {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
    line-height: 18px;

    svg {
      margin-right: 5px;
    }
  }
`;

const OptionDropdown = props => {
  const {
    isOpened,
    column,
    toggleMoreOptions,
    sortTableColumn,
    pinTableColumn,
    copyTableColumn
  } = props;
  const onOptionSelected = useCallback(
    ({value}) => {
      switch (value) {
        case TABLE_OPTION.SORT_ASC:
          sortTableColumn(SORT_ORDER.ASCENDING);
          break;
        case TABLE_OPTION.SORT_DES:
          sortTableColumn(SORT_ORDER.DESCENDING);
          break;
        case TABLE_OPTION.UNSORT:
          sortTableColumn(SORT_ORDER.UNSORT);
          break;
        case TABLE_OPTION.PIN:
          pinTableColumn();
          break;
        case TABLE_OPTION.UNPIN:
          pinTableColumn();
          break;
        case TABLE_OPTION.COPY:
          copyTableColumn();
          break;
        default:
          break;
      }

      toggleMoreOptions(column);
    },
    [column, sortTableColumn, pinTableColumn, copyTableColumn, toggleMoreOptions]
  );

  const options = TABLE_OPTION_LIST.filter(op => !op.condition || op.condition(props));

  return (
    <Portaled right={120} top={20} isOpened={isOpened} onClose={() => toggleMoreOptions(column)}>
      <StyledOptionsDropdown className="more-options">
        <DropdownList
          displayOption={d => d.display}
          options={options}
          customListItemComponent={ListItem}
          onOptionSelected={onOptionSelected}
          light
        />
      </StyledOptionsDropdown>
    </Portaled>
  );
};

export default OptionDropdown;
