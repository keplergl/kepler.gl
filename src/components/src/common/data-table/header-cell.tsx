// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {CSSProperties, useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import Button from './button';
import {ArrowUp, ArrowDown, VertThreeDots, Hash} from '../../common/icons';
import {SORT_ORDER} from '@kepler.gl/constants';
import OptionDropdown, {FormatterDropdown} from './option-dropdown';
import {ColumnStatsType, getFieldFormatLabels} from '@kepler.gl/utils';
import {ColMeta} from '@kepler.gl/types';
import FieldTokenFactory, {FieldTokenProps} from '../../common/field-token';
import {DataTableProps} from './index';
import LoadingSpinner from '../loading-spinner';
import ColumnStatisticsCategorical from './column-statistics-categoric';
import ColumnStatisticsNumericFactory, {
  ColumnStatisticsNumericProps
} from './column-statistics-numeric';
import ColumnStatisticsTimeFactory, {ColumnStatisticsTimeProps} from './column-statistics-time';

const StyledHeaderCell = styled.div<{$hasStats?: boolean; $firstCell?: boolean}>`
  border-bottom: 1px solid ${props => props.theme.headerCellBorderColor};
  border-top: 1px solid ${props => props.theme.headerCellBorderColor};
  border-right: ${props => (props.$hasStats ? `1px solid ${props.theme.cellBorderColor}` : 'none')};
  padding-top: ${props => (props.$hasStats ? 0 : props.theme.headerPaddingTop)}px;
  padding-right: 0;
  padding-bottom: ${props => (props.$hasStats ? 0 : props.theme.headerPaddingBottom)}px;
  padding-left: ${props => (props.$hasStats ? 0 : props.theme.cellPaddingSide)}px;
  align-items: ${props => (props.$hasStats ? 'stretch' : 'center')};
  justify-content: ${props => (props.$hasStats ? 'flex-start' : 'space-between')};
  display: flex;
  flex-direction: ${props => (props.$hasStats ? 'column' : 'row')};
  background-color: ${props => props.theme.headerCellBackground};
  overflow: hidden;

  .n-sort-idx {
    font-size: 9px;
  }
  .header-cell__top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: ${props => props.theme.headerRowHeight}px;
    flex: 0 0 auto;
    box-sizing: border-box;
    padding-top: ${props => props.theme.headerPaddingTop}px;
    padding-bottom: ${props => props.theme.headerPaddingBottom}px;
    padding-left: ${props =>
      props.$firstCell
        ? props.theme.cellPaddingSide + props.theme.edgeCellPaddingSide
        : props.theme.cellPaddingSide}px;
  }
  .details {
    font-weight: 500;
    font-size: ${props => props.theme.cellFontSize}px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    overflow: hidden;
    flex-grow: 1;

    .col-name {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-left: 6px;
      min-width: 0;
      flex: 1;

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

type StyledBottomStatsProps = {
  $showStats?: boolean;
};

const StyledBottomStats = styled.div<StyledBottomStatsProps>`
  background-color: ${props => props.theme.headerCellStatsBackground};
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
  opacity: ${props => (props.$showStats ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
  pointer-events: ${props => (props.$showStats ? 'auto' : 'none')};
  width: 100%;
`;

const StyledLoading = styled.div`
  width: 100%;
  padding-top: 16px;
  display: flex;
  justify-content: center;
`;

const StyledStatsSpacer = styled.div`
  height: ${props => props.theme.headerStatsControlHeight}px;
  width: 100%;
  flex-grow: 0;
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

export type HeaderCellProps = {
  // passed down from react virtualized Grid
  cellInfo: CellInfo;
  columns: DataTableProps['columns'];
  colMeta?: ColMeta;
  isPinned?: boolean;
  showStats?: boolean;
  props: DataTableProps;
  toggleMoreOptions: (moreOptionsColumn: string) => void;
  moreOptionsColumn: null | string;
  style: CSSProperties;
};

function HeaderCellFactory(
  FieldToken: React.FC<FieldTokenProps>,
  ColumnStatisticsNumeric: React.FC<ColumnStatisticsNumericProps>,
  ColumnStatisticsTime: React.FC<ColumnStatisticsTimeProps>
) {
  const ColumnStatisticsSection: React.FC<{
    columnStats: any;
    type: string;
    format?: string;
  }> = ({columnStats, type, format}) => {
    switch (columnStats.type) {
      case ColumnStatsType.numeric:
        return <ColumnStatisticsNumeric {...columnStats} type={type} />;
      case ColumnStatsType.categorical:
        return <ColumnStatisticsCategorical {...columnStats} />;
      case ColumnStatsType.time:
        return <ColumnStatisticsTime {...columnStats} format={format} />;
      default:
        return <div />;
    }
  };

  const HeaderCell = ({
    cellInfo,
    columns,
    isPinned,
    showStats,
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
      setColumnDisplayFormat,
      hasStats,
      dataId,
      loadColumnStats
    } = props;
    const [showFormatter, setShowFormatter] = useState(false);
    const column = columns[columnIndex];

    const isGhost = Boolean(column.ghost);
    const isSorted = isGhost ? false : sortColumn[column];
    const firstCell = columnIndex === 0;
    const {columnStats, isLoadingStats, type, format} = colMeta[isGhost ? '' : column] || {};
    const isFormatted = isGhost ? false : Boolean(colMeta[column]?.displayFormat);
    const formatLabels = isFormatted && !isGhost ? getFieldFormatLabels(colMeta[column].type) : [];

    useEffect(() => {
      if (
        !isGhost &&
        !columnStats &&
        !isLoadingStats &&
        dataId &&
        showStats &&
        hasStats &&
        loadColumnStats
      ) {
        loadColumnStats(dataId, column);
      }
    }, [
      isGhost,
      columnStats,
      isLoadingStats,
      column,
      dataId,
      showStats,
      hasStats,
      loadColumnStats
    ]);

    const onSortTable = useCallback(() => {
      if (!isGhost) sortTableColumn?.(column);
    }, [sortTableColumn, isGhost, column]);
    const onToggleOptionMenu = useCallback(() => {
      if (!isGhost) toggleMoreOptions(column);
    }, [toggleMoreOptions, isGhost, column]);
    const onPin = useCallback(() => {
      if (!isGhost) pinTableColumn(column);
    }, [pinTableColumn, isGhost, column]);
    const onCopy = useCallback(() => {
      if (!isGhost) copyTableColumn(column);
    }, [copyTableColumn, isGhost, column]);
    const onSetDisplayFormat = useCallback(
      displayFormat => {
        if (!isGhost) setColumnDisplayFormat?.({[column]: displayFormat.format});
      },
      [column, isGhost, setColumnDisplayFormat]
    );

    const onToggleDisplayFormat = useCallback(() => {
      setShowFormatter(!showFormatter);
    }, [showFormatter]);

    const headerDetails = isGhost ? (
      <div />
    ) : (
      <>
        <section
          className="details"
          onClick={e => {
            if (e.shiftKey && !isGhost) sortTableColumn?.(column);
          }}
          onDoubleClick={onSortTable}
        >
          <FieldToken type={colMeta[column].type} />
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
        </section>

        <section className="options">
          <OptionDropdown
            isOpened={moreOptionsColumn === column}
            column={column}
            colMeta={colMeta}
            toggleMoreOptions={toggleMoreOptions}
            sortTableColumn={sortTableColumn ? mode => sortTableColumn(column, mode) : undefined}
            pinTableColumn={onPin}
            copyTableColumn={onCopy}
            setDisplayFormat={setColumnDisplayFormat ? onSetDisplayFormat : undefined}
          />
        </section>
      </>
    );

    return (
      <StyledHeaderCell
        className={classnames('header-cell', {
          [`column-${columnIndex}`]: true,
          'pinned-header-cell': isPinned,
          'first-cell': firstCell
        })}
        key={key}
        style={style}
        $hasStats={Boolean(hasStats)}
        $firstCell={firstCell}
        title={isGhost ? undefined : column}
      >
        {hasStats && !isGhost ? (
          <div className="header-cell__top">{headerDetails}</div>
        ) : (
          headerDetails
        )}
        {hasStats && !isGhost ? <StyledStatsSpacer /> : null}
        {hasStats && !isGhost ? (
          <StyledBottomStats className="bottom-stats" $showStats={showStats}>
            {isLoadingStats ? (
              <StyledLoading>
                <LoadingSpinner />
              </StyledLoading>
            ) : columnStats ? (
              <ColumnStatisticsSection columnStats={columnStats} type={type} format={format} />
            ) : null}
          </StyledBottomStats>
        ) : null}
      </StyledHeaderCell>
    );
  };
  return HeaderCell;
}
HeaderCellFactory.deps = [
  FieldTokenFactory,
  ColumnStatisticsNumericFactory,
  ColumnStatisticsTimeFactory
];
export default HeaderCellFactory;
