// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {CSSProperties, useState, useCallback} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import Button from './button';
import {ArrowUp, ArrowDown, VertThreeDots, Hash} from '../../common/icons';
import {SORT_ORDER} from '@kepler.gl/constants';
import OptionDropdown, {FormatterDropdown} from './option-dropdown';
import {getFieldFormatLabels} from '@kepler.gl/utils';
import {ColMeta} from '@kepler.gl/types';
import FieldTokenFactory, {FieldTokenProps} from '../../common/field-token';
import {DataTableProps} from './index';

const StyledHeaderCell = styled.div`
  border-bottom: 1px solid ${props => props.theme.headerCellBorderColor};
  border-top: 1px solid ${props => props.theme.headerCellBorderColor};
  padding-top: ${props => props.theme.headerPaddingTop}px;
  padding-right: 0;
  padding-bottom: ${props => props.theme.headerPaddingBottom}px;
  padding-left: ${props => props.theme.cellPaddingSide}px;
  align-items: center;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  background-color: ${props => props.theme.headerCellBackground};

  .n-sort-idx {
    font-size: 9px;
  }
  .details {
    font-weight: 500;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    overflow: hidden;
    flex-grow: 1;

    .col-name {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .col-name__left {
        display: flex;
        align-items: center;
        overflow: hidden;

        svg {
          margin-left: 6px;
        }
      }
      .col-name__name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .more {
    margin-left: 5px;
  }

  .col-name__format svg {
    width: 10px;
    height: 10px;
    stroke-width: 1;
  }
`;

type CellInfo = {
  columnIndex: number;
  isScrolling: boolean;
  isVisible: boolean;
  key: string;
  parent: any;
  rowIndex: number;
  style: CSSProperties;
};

type HeaderCellProps = {
  // passed down from react virtualized Grid
  cellInfo: CellInfo;
  columns: DataTableProps['columns'];
  colMeta?: ColMeta;
  isPinned?: boolean;
  showStats?: boolean;
  props: DataTableProps;
  toggleMoreOptions: (moreOptionsColumn: string) => void;
  moreOptionsColumn: null | string;
};

const HeaderCellFactory = (FieldToken: React.FC<FieldTokenProps>) => {
  const HeaderCell = ({
    cellInfo,
    columns,
    isPinned,
    props,
    toggleMoreOptions,
    moreOptionsColumn
  }: HeaderCellProps) => {
    const {columnIndex, key, style} = cellInfo;
    const {
      colMeta,
      sortColumn,
      sortTableColumn,
      pinTableColumn,
      copyTableColumn,
      setColumnDisplayFormat
    } = props;
    const [showFormatter, setShowFormatter] = useState(false);
    const column = columns[columnIndex];

    const isGhost = column.ghost;
    const isSorted = sortColumn[column];
    const firstCell = columnIndex === 0;
    const isFormatted = Boolean(colMeta[column]?.displayFormat);
    const formatLabels = isFormatted ? getFieldFormatLabels(colMeta[column].type) : [];
    const onSortTable = useCallback(() => sortTableColumn(column), [sortTableColumn, column]);
    const onToggleOptionMenu = useCallback(
      () => toggleMoreOptions(column),
      [toggleMoreOptions, column]
    );
    const onPin = useCallback(() => pinTableColumn(column), [pinTableColumn, column]);
    const onCopy = useCallback(() => copyTableColumn(column), [copyTableColumn, column]);
    const onSetDisplayFormat = useCallback(
      displayFormat => {
        setColumnDisplayFormat({[column]: displayFormat.format});
      },
      [column, setColumnDisplayFormat]
    );

    const onToggleDisplayFormat = useCallback(() => {
      setShowFormatter(!showFormatter);
    }, [showFormatter]);

    return (
      <StyledHeaderCell
        className={classnames('header-cell', {
          [`column-${columnIndex}`]: true,
          'pinned-header-cell': isPinned,
          'first-cell': firstCell
        })}
        key={key}
        style={style}
        onClick={e => {
          e.shiftKey ? sortTableColumn(column) : null;
        }}
        onDoubleClick={onSortTable}
        title={column}
      >
        {isGhost ? (
          <div />
        ) : (
          <>
            <section className="details">
              <div className="col-name">
                <div className="col-name__left">
                  <div className="col-name__name">{colMeta[column].name}</div>
                  <Button className="col-name__sort" onClick={onSortTable}>
                    {isSorted ? (
                      isSorted === SORT_ORDER.ASCENDING ? (
                        <ArrowUp height="14px" />
                      ) : (
                        <ArrowDown height="14px" />
                      )
                    ) : null}
                  </Button>
                  <Button className="col-name__format" onClick={onToggleDisplayFormat}>
                    {isFormatted ? <Hash height="14px" /> : null}
                    <FormatterDropdown
                      left={0}
                      top={0}
                      isOpened={isFormatted && showFormatter}
                      displayFormat={colMeta[column].displayFormat}
                      setDisplayFormat={onSetDisplayFormat}
                      onClose={() => setShowFormatter(false)}
                      formatLabels={formatLabels}
                    />
                  </Button>
                </div>
                <Button className="more" onClick={onToggleOptionMenu}>
                  <VertThreeDots height="14px" />
                </Button>
              </div>
              <FieldToken type={colMeta[column].type} />
            </section>

            <section className="options">
              <OptionDropdown
                isOpened={moreOptionsColumn === column}
                column={column}
                colMeta={colMeta}
                toggleMoreOptions={toggleMoreOptions}
                sortTableColumn={mode => sortTableColumn(column, mode)}
                pinTableColumn={onPin}
                copyTableColumn={onCopy}
                setDisplayFormat={onSetDisplayFormat}
              />
            </section>
          </>
        )}
      </StyledHeaderCell>
    );
  };
  return HeaderCell;
};
HeaderCellFactory.deps = [FieldTokenFactory];
export default HeaderCellFactory;
