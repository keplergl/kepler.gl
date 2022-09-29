import React, {CSSProperties} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {Button} from '../../common/styled-components';
import {ArrowUp, ArrowDown, VertThreeDots} from '../../common/icons';
import OptionDropdown from './option-dropdown';
import {SORT_ORDER} from '@kepler.gl/constants';
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

  &:hover {
    .more {
      color: ${props => props.theme.headerCellIconColor};
    }
  }
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
      cursor: pointer;

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
      }
    }
  }

  .more {
    color: transparent;
    margin-left: 5px;
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
  isPinned?: boolean;
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
    const {colMeta, sortColumn = {}, sortTableColumn, pinTableColumn, copyTableColumn} = props;
    const column = columns[columnIndex];

    const isGhost = column.ghost;
    const isSorted = sortColumn[column];
    const firstCell = columnIndex === 0;
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
        onDoubleClick={() => sortTableColumn(column)}
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
                  <Button className="col-name__sort" onClick={() => sortTableColumn(column)}>
                    {isSorted ? (
                      isSorted === SORT_ORDER.ASCENDING ? (
                        <ArrowUp height="14px" />
                      ) : (
                        <ArrowDown height="14px" />
                      )
                    ) : null}
                  </Button>
                </div>
                <Button className="more" onClick={() => toggleMoreOptions(column)}>
                  <VertThreeDots height="14px" />
                </Button>
              </div>
              <FieldToken type={colMeta[column].type} />
            </section>

            <section className="options">
              <OptionDropdown
                isOpened={moreOptionsColumn === column}
                column={column}
                toggleMoreOptions={toggleMoreOptions}
                sortTableColumn={mode => sortTableColumn(column, mode)}
                pinTableColumn={() => pinTableColumn(column)}
                copyTableColumn={() => copyTableColumn(column)}
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
