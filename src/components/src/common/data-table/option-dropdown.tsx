// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import Portaled from '../portaled';
import DropdownList from '../item-selector/dropdown-list';
import {
  SORT_ORDER,
  TABLE_OPTION,
  TABLE_OPTION_LIST,
  TooltipFormat,
  TableOption
} from '@kepler.gl/constants';
import {getFieldFormatLabels} from '@kepler.gl/utils';
import {ColMeta} from '@kepler.gl/types';
import {ArrowDown, ArrowUp, Clipboard, Pin, Cancel, Hash} from '../icons';

const ListItem = ({value}) => (
  <div>
    <value.icon height="13px" />
    {value.display}
  </div>
);

// make hash icon smaller
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

    .data-ex-icons-hash {
      width: 10px;
      height: 10px;
      stroke-width: 1px;
      margin-left: 2px;
      margin-right: 6px;
    }
  }
`;

const StyledPopover = styled.div`
  width: 184px;
  height: 160px;
  z-index: 101;
  .list-selector {
    max-height: 160px;
  }
  .hover:after {
    content: '\\2713';
    margin-left: 5px;
  }
`;

export type FormatterDropdownProps = {
  left: number;
  top: number;
  isOpened: boolean;
  displayFormat?: string;
  setDisplayFormat: (displayFormat: TooltipFormat) => void;
  onClose: () => void;
  formatLabels: TooltipFormat[];
};

export const FormatterDropdown: React.FC<FormatterDropdownProps> = (
  props: FormatterDropdownProps
) => {
  const {
    left,
    top,
    isOpened,
    displayFormat = 'None',
    setDisplayFormat,
    onClose,
    formatLabels
  } = props;
  const selectionIndex = formatLabels.findIndex(label => label.format === displayFormat);

  const onSelectDisplayFormat = useCallback(
    result => {
      setDisplayFormat(result);
      onClose();
    },
    [setDisplayFormat, onClose]
  );

  return (
    <Portaled left={left} top={top} isOpened={isOpened} onClose={onClose}>
      <StyledPopover className="formatter-popover">
        <DropdownList
          options={formatLabels}
          selectionIndex={selectionIndex}
          displayOption={option => (option as TooltipFormat).label}
          onOptionSelected={onSelectDisplayFormat}
          light
        />
      </StyledPopover>
    </Portaled>
  );
};

export interface OptionDropdownProps {
  isOpened?: boolean;
  column: string;
  colMeta: ColMeta;
  toggleMoreOptions: (column: string) => void;
  sortTableColumn: (sort: string) => void;
  pinTableColumn: () => void;
  copyTableColumn: () => void;
  setDisplayFormat: (displayFormat: any) => void;
  sortMode?: string;
  isSorted?: string;
  isPinned?: boolean;
}

const OptionDropdown = (props: OptionDropdownProps) => {
  const {
    isOpened,
    column,
    colMeta,
    toggleMoreOptions,
    sortTableColumn,
    pinTableColumn,
    copyTableColumn,
    setDisplayFormat
  } = props;
  const [showFormatter, setShowFormatter] = useState(false);
  const onOptionSelected: (v: TableOption) => void = useCallback(
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
        case TABLE_OPTION.FORMAT_COLUMN:
          setShowFormatter(true);
          return;
        default:
          break;
      }

      toggleMoreOptions(column);
    },
    [column, sortTableColumn, pinTableColumn, copyTableColumn, toggleMoreOptions]
  );

  const TABLE_OPTION_LIST_ICONS = {
    Pin,
    ArrowDown,
    ArrowUp,
    Clipboard,
    Cancel,
    Hash
  };

  const formatLabels = getFieldFormatLabels(colMeta[column].type);
  const options = TABLE_OPTION_LIST.filter(op => {
    // cant use conditions because it creates a circular dependency
    // TODO: move condition clause out of default-settings TABLE_OPTION_LIST
    const validToFormat = op.value !== TABLE_OPTION.FORMAT_COLUMN || formatLabels.length;
    return (!op.condition || op.condition(props)) && validToFormat;
  }).map(op => ({
    ...op,
    icon: TABLE_OPTION_LIST_ICONS[op.icon]
  }));

  const onClose = useCallback(() => {
    setShowFormatter(false);
    toggleMoreOptions(column);
  }, [column, toggleMoreOptions]);

  return (
    <Portaled right={120} top={20} isOpened={isOpened} onClose={onClose}>
      <StyledOptionsDropdown className="more-options">
        <DropdownList
          displayOption={d => (d as TableOption).display}
          options={options}
          customListItemComponent={ListItem}
          onOptionSelected={onOptionSelected}
          light
        />
        <FormatterDropdown
          left={120}
          top={-10}
          isOpened={Boolean(isOpened && showFormatter)}
          formatLabels={formatLabels}
          displayFormat={colMeta[column]?.displayFormat}
          setDisplayFormat={setDisplayFormat}
          onClose={onClose}
        />
      </StyledOptionsDropdown>
    </Portaled>
  );
};

export default OptionDropdown;
