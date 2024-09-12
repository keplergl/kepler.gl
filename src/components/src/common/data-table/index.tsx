// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, createRef, useMemo} from 'react';
import {ScrollSync, AutoSizer, OnScrollParams, GridProps, Index} from 'react-virtualized';
import styled, {withTheme} from 'styled-components';
import classnames from 'classnames';
import {createSelector} from 'reselect';
import get from 'lodash.get';
import debounce from 'lodash.debounce';
import {ArrowDown} from '../icons';

import {CellSizeCache} from './cell-size';

import Grid from './grid';
import HeaderCellFactory from './header-cell';

import {ColMeta} from '@kepler.gl/types';
import {parseFieldValue, getColumnFormatter, DataContainerInterface} from '@kepler.gl/utils';
import {adjustCellsToContainer} from './cell-size';

import {ALL_FIELD_TYPES} from '@kepler.gl/constants';

const defaultHeaderRowHeight = 55;
const defaultHeaderStatsControlHeight = 40;
const defaultRowHeight = 32;
const overscanColumnCount = 10;
const overscanRowCount = 10;
// The default scrollbar width can range anywhere from 12px to 17px
const browserScrollBarWidth = 17;
const fieldToAlignRight = {
  [ALL_FIELD_TYPES.integer]: true,
  [ALL_FIELD_TYPES.real]: true
};

const pinnedClassList = {
  header: 'pinned-columns--header pinned-grid-container',
  rows: 'pinned-columns--rows pinned-grid-container'
};

const unpinnedClassList = {
  header: 'unpinned-columns--header unpinned-grid-container',
  rows: 'unpinned-columns--rows unpinned-grid-container'
};

type ContainerProps = {
  hasCustomScrollBarStyle?: boolean;
};

export const Container = styled.div<ContainerProps>`
  display: flex;
  font-size: 11px;
  flex-grow: 1;
  color: ${props => props.theme.dataTableTextColor};
  width: 100%;
  position: relative;
  .ReactVirtualized__Grid:focus,
  .ReactVirtualized__Grid:active {
    outline: 0;
  }
  .body-grid {
    ${props => props.hasCustomScrollBarStyle && props.theme.modalScrollBar}
  }

  .cell {
    &::-webkit-scrollbar {
      display: none;
    }
  }

  *:focus {
    outline: 0;
  }

  .results-table-wrapper {
    position: relative;
    min-height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    overflow: hidden;

    .scroll-in-ui-thread.pinned-columns--header {
      overflow: hidden;
      border-bottom: 1px solid ${props => props.theme.cellBorderColor};
      padding-bottom: ${browserScrollBarWidth}px;
    }
    .scroll-in-ui-thread.unpinned-columns--header {
      width: 100vw;
      overflow: hidden;
      border-bottom: 1px solid ${props => props.theme.cellBorderColor};
      // leave room for scrollbar
      padding-bottom: ${browserScrollBarWidth}px;
    }

    .scroll-in-ui-thread::after {
      content: '';
      height: 100%;
      left: 0;
      position: absolute;
      pointer-events: none;
      top: 0;
      width: 100%;
    }

    .grid-row {
      position: relative;
      display: flex;
      flex-direction: row;
    }
    .grid-column {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
    }
    .pinned-grid-container {
      flex: 0 0 75px;
      z-index: 10;
      position: absolute;
      left: 0;
      top: 0;
      border-right: 2px solid ${props => props.theme.pinnedGridBorderColor};
    }
    .even-row {
      background-color: ${props => props.theme.evenRowBackground};
    }
    .odd-row {
      background-color: ${props => props.theme.oddRowBackground};
    }
    .cell,
    .header-cell {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      text-align: center;
      overflow: hidden;
      // header border is rendered by header container
      border-bottom: 0;
      .n-sort-idx {
        font-size: 9px;
      }
    }
    .cell {
      border-bottom: 1px solid ${props => props.theme.cellBorderColor};
      border-right: 1px solid ${props => props.theme.cellBorderColor};
      white-space: nowrap;
      overflow: auto;
      padding: 0 ${props => props.theme.cellPaddingSide}px;
      font-size: ${props => props.theme.cellFontSize}px;

      .result-link {
        text-decoration: none;
      }
    }
    .cell.end-cell,
    .header-cell.end-cell {
      border-right: none;
      padding-right: ${props => props.theme.cellPaddingSide + props.theme.edgeCellPaddingSide}px;
    }
    .cell.first-cell,
    .header-cell.first-cell {
      padding-left: ${props => props.theme.cellPaddingSide + props.theme.edgeCellPaddingSide}px;
    }
    .cell.bottom-cell {
      border-bottom: none;
    }
    .cell.align-right {
      align-items: flex-end;
    }
  }

  :focus {
    outline: none;
  }
`;

const defaultColumnWidth = 200;

export type SortColumn = {
  column?: string;
  mode?: string;
};

const columnWidthFunction =
  (columns, cellSizeCache, ghost?) =>
  ({index}) => {
    return (columns[index] || {}).ghost
      ? ghost
      : cellSizeCache[columns[index]] || defaultColumnWidth;
  };

interface GetRowCellProps {
  dataContainer: DataContainerInterface;
  columns: (string & {ghost?: boolean})[];
  column: string;
  colMeta;
  rowIndex: number;
  sortOrder?: number[] | null;
}

/*
 * This is an accessor method used to generalize getting a cell from a data row
 */
const defaultGetRowCell = (
  {dataContainer, columns, column, colMeta, rowIndex, sortOrder}: GetRowCellProps,
  formatter
) => {
  const rowIdx = sortOrder && sortOrder.length ? get(sortOrder, rowIndex) : rowIndex;
  const {type} = colMeta[column];

  const value = dataContainer.valueAt(rowIdx, columns.indexOf(column));
  return value === null || value === undefined || value === ''
    ? ''
    : formatter
    ? formatter(value)
    : parseFieldValue(value, type);
};

type StatsControlProps = {
  top: number;
  showStats?: boolean;
};

const StyledStatsControl = styled.div<StatsControlProps>`
  height: ${props => props.theme.headerStatsControlHeight}px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  position: absolute;
  top: ${props => props.top}px;
  font-family: ${props => props.theme.fontFamilyMedium}px;
  font-size: 12px;
  color: ${props => props.theme.activeColor};
  background-color: ${props => props.theme.headerCellStatsControlBackground};
  :hover {
    cursor: pointer;
  }

  > div {
    padding: 0px 24px;
    display: flex;
    align-items: center;

    svg {
      margin-left: 12px;
      transition: transform 0.5s ease;
      transform: rotate(${props => (props.showStats ? 180 : 0)}deg);
    }
  }
`;

const StatsControl = ({
  top,
  showStats,
  toggleShowStats
}: {
  top: number;
  showStats?: boolean;
  toggleShowStats: () => void;
}) => (
  <StyledStatsControl top={top} showStats={showStats}>
    <div onClick={toggleShowStats}>
      {showStats ? 'Hide Column Stats' : 'Show Column Stats'}
      <ArrowDown height="18px" />
    </div>
  </StyledStatsControl>
);

interface TableSectionProps {
  classList?: {
    header: string;
    rows: string;
  };
  isPinned?: boolean;
  columns: (string & {ghost?: boolean})[];
  headerGridProps?;
  fixedWidth?: number;
  fixedHeight?: number;
  onScroll?: (params: OnScrollParams) => void;
  scrollTop?: number;
  dataGridProps: {
    rowHeight: number | ((params: Index) => number);
    rowCount: number;
  } & Partial<GridProps>;
  columnWidth?;
  setGridRef?: (ref: HTMLDivElement | null) => void;
  headerCellRender?;
  dataCellRender?;
  scrollLeft?: number;
}

export const TableSection = ({
  classList,
  isPinned,
  columns,
  headerGridProps,
  fixedWidth,
  fixedHeight = undefined,
  onScroll,
  scrollTop,
  dataGridProps,
  columnWidth,
  setGridRef = undefined,
  headerCellRender,
  dataCellRender,
  scrollLeft = 0
}: TableSectionProps) => {
  const headerHeight = headerGridProps.height;

  const headerStyle = useMemo(
    () => ({
      height: `${headerHeight}px`
    }),
    [headerHeight]
  );
  const contentStyle = useMemo(
    () => ({
      top: `${headerHeight}px`
    }),
    [headerHeight]
  );

  return (
    <AutoSizer>
      {({width, height}) => {
        const gridDimension = {
          columnCount: columns.length,
          columnWidth,
          width: fixedWidth || width
        };
        const headerGridWidth = fixedWidth || width;
        const dataGridHeight = fixedHeight || height;

        return (
          <>
            <div
              className={classnames('scroll-in-ui-thread', classList?.header)}
              style={headerStyle}
            >
              <Grid
                cellRenderer={headerCellRender}
                {...headerGridProps}
                {...gridDimension}
                height={headerGridProps.height + browserScrollBarWidth}
                width={headerGridWidth}
                scrollLeft={scrollLeft}
                onScroll={onScroll}
              />
            </div>
            <div
              className={classnames('scroll-in-ui-thread', classList?.rows)}
              style={contentStyle}
            >
              <Grid
                cellRenderer={dataCellRender}
                {...dataGridProps}
                {...gridDimension}
                className={isPinned ? 'pinned-grid' : 'body-grid'}
                height={dataGridHeight - headerGridProps.height}
                onScroll={onScroll}
                scrollLeft={scrollLeft}
                scrollTop={scrollTop}
                setGridRef={setGridRef}
              />
            </div>
          </>
        );
      }}
    </AutoSizer>
  );
};

export interface DataTableProps {
  dataId?: string;
  hasStats?: boolean;
  cellSizeCache?: CellSizeCache;
  pinnedColumns?: string[];
  columns: (string & {ghost?: boolean})[];
  fixedWidth?: number;
  theme?: any;
  dataContainer: DataContainerInterface;
  fixedHeight?: number;
  colMeta: ColMeta;
  sortColumn: SortColumn;
  sortTableColumn: (column: string, mode?: string) => void;
  pinTableColumn: (column: string) => void;
  setColumnDisplayFormat: (formats: {[key: string]: string}) => void;
  copyTableColumn: (column: string) => void;
  sortOrder?: number[] | null;
  showStats?: boolean;
  hasCustomScrollBarStyle?: boolean;
  getRowCell?: (renderDataCellProps: GetRowCellProps, formatter: any) => string | number;
}

interface DataTableState {
  cellSizeCache?: CellSizeCache;
  moreOptionsColumn?;
  ghost?;
  showStats?: boolean;
}

DataTableFactory.deps = [HeaderCellFactory];
function DataTableFactory(HeaderCell: ReturnType<typeof HeaderCellFactory>) {
  class DataTable extends Component<DataTableProps, DataTableState> {
    static defaultProps = {
      dataContainer: null,
      pinnedColumns: [],
      colMeta: {},
      cellSizeCache: {},
      sortColumn: {},
      fixedWidth: null,
      fixedHeight: null,
      theme: {},
      hasStats: false,
      hasCustomScrollBarStyle: true
    };

    pinnedGrid: HTMLDivElement | null = null;
    unpinnedGrid: HTMLDivElement | null = null;

    state: DataTableState = {
      cellSizeCache: {},
      moreOptionsColumn: null,
      showStats: true
    };

    componentDidMount() {
      window.addEventListener('resize', this.scaleCellsToWidth);
      this.scaleCellsToWidth();
    }

    componentDidUpdate(prevProps) {
      if (
        this.props.cellSizeCache !== prevProps.cellSizeCache ||
        this.props.pinnedColumns !== prevProps.pinnedColumns
      ) {
        this.scaleCellsToWidth();
      }
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.scaleCellsToWidth);
      // fix Warning: Can't perform a React state update on an unmounted component
      this.setState = () => {
        return;
      };
    }

    root = createRef<HTMLDivElement>();
    columns = (props: DataTableProps) => props.columns;
    pinnedColumns = (props: DataTableProps) => props.pinnedColumns;
    unpinnedColumns = createSelector(this.columns, this.pinnedColumns, (columns, pinnedColumns) =>
      !Array.isArray(pinnedColumns) ? columns : columns.filter(c => !pinnedColumns.includes(c))
    );

    toggleMoreOptions = moreOptionsColumn =>
      this.setState({
        moreOptionsColumn:
          this.state.moreOptionsColumn === moreOptionsColumn ? null : moreOptionsColumn
      });
    toggleShowStats = () => this.setState({showStats: !this.state.showStats});
    getCellSizeCache = () => {
      const {cellSizeCache: propsCache = {}, fixedWidth, pinnedColumns = []} = this.props;
      const unpinnedColumns = this.unpinnedColumns(this.props);

      const width = fixedWidth ? fixedWidth : this.root.current ? this.root.current.clientWidth : 0;

      // pin column border is 2 pixel vs 1 pixel
      const adjustWidth = pinnedColumns.length ? width - 1 : width;
      const {cellSizeCache, ghost} = adjustCellsToContainer(
        adjustWidth,
        propsCache,
        pinnedColumns,
        unpinnedColumns
      ) as {cellSizeCache: CellSizeCache; ghost: number | null | undefined};

      return {
        cellSizeCache,
        ghost
      };
    };

    doScaleCellsToWidth = () => {
      this.setState(this.getCellSizeCache());
    };

    scaleCellsToWidth = debounce(this.doScaleCellsToWidth, 300);

    renderDataCell = (columns, isPinned, props: DataTableProps) => {
      const getRowCell = this.props.getRowCell ?? defaultGetRowCell;
      const DataCellRenderer = cellInfo => {
        const {columnIndex, key, style, rowIndex} = cellInfo;
        const {dataContainer, colMeta} = props;
        const column = columns[columnIndex];
        const isGhost = column.ghost;

        const formatter = isGhost ? null : getColumnFormatter(colMeta[column]);
        const rowCell = isGhost ? '' : getRowCell({...props, column, rowIndex}, formatter);
        const type = isGhost ? null : colMeta[column].type;

        const lastRowIndex = dataContainer ? dataContainer.numRows() - 1 : 0;

        const endCell = columnIndex === columns.length - 1;
        const firstCell = columnIndex === 0;
        const bottomCell = rowIndex === lastRowIndex;
        const alignRight = fieldToAlignRight[Number(type)];

        const cell = (
          <div
            className={classnames('cell', {
              [rowIndex % 2 === 0 ? 'even-row' : 'odd-row']: true,
              [`row-${rowIndex}`]: true,
              'pinned-cell': isPinned,
              'first-cell': firstCell,
              'end-cell': endCell,
              'bottom-cell': bottomCell,
              'align-right': alignRight
            })}
            key={key}
            style={style}
            title={isGhost ? undefined : rowCell}
          >
            {`${rowCell}${endCell ? '\n' : '\t'}`}
          </div>
        );

        return cell;
      };
      return DataCellRenderer;
    };

    renderHeaderCell(columns, isPinned, props, toggleMoreOptions, moreOptionsColumn) {
      const HeaderCellRenderer = cellInfo => (
        <HeaderCell
          cellInfo={cellInfo}
          key={cellInfo.columnIndex}
          columns={columns}
          isPinned={isPinned}
          showStats={this.state.showStats}
          props={props}
          toggleMoreOptions={toggleMoreOptions}
          moreOptionsColumn={moreOptionsColumn}
        />
      );
      return HeaderCellRenderer;
    }
    render() {
      const {
        dataContainer,
        pinnedColumns = [],
        theme = {},
        fixedWidth,
        fixedHeight = 0,
        hasStats,
        hasCustomScrollBarStyle
      } = this.props;
      const unpinnedColumns = this.unpinnedColumns(this.props);

      const {cellSizeCache = {}, moreOptionsColumn, ghost, showStats} = this.state;
      const unpinnedColumnsGhost = ghost
        ? [...unpinnedColumns, {ghost: true} as string & {ghost: boolean}]
        : unpinnedColumns;
      const pinnedColumnsWidth = pinnedColumns.reduce(
        (acc, val) => acc + (get(cellSizeCache, val, 0) as number),
        0
      );

      const hasPinnedColumns = Boolean(pinnedColumns.length);
      const {
        headerRowHeight = defaultHeaderRowHeight,
        headerStatsControlHeight = defaultHeaderStatsControlHeight,
        headerRowWStatsHeight = defaultHeaderRowHeight,
        rowHeight = defaultRowHeight
      } = theme;

      const headerGridProps = {
        cellSizeCache,
        className: 'header-grid',
        height: !hasStats
          ? headerRowHeight
          : showStats
          ? headerRowWStatsHeight
          : headerRowHeight + headerStatsControlHeight,
        rowCount: 1,
        rowHeight: !hasStats
          ? headerRowHeight
          : showStats
          ? headerRowWStatsHeight
          : headerRowHeight + headerStatsControlHeight
      };

      const dataGridProps = {
        cellSizeCache,
        overscanColumnCount,
        overscanRowCount,
        rowCount: dataContainer ? dataContainer.numRows() : 0,
        rowHeight
      };

      return (
        <Container
          className="data-table-container"
          ref={this.root}
          hasCustomScrollBarStyle={hasCustomScrollBarStyle}
        >
          {Object.keys(cellSizeCache).length ? (
            <>
              <ScrollSync>
                {({onScroll, scrollLeft, scrollTop}) => {
                  return (
                    <div className="results-table-wrapper">
                      {hasPinnedColumns && (
                        <div key="pinned-columns" className="pinned-columns grid-row">
                          <TableSection
                            classList={pinnedClassList}
                            isPinned
                            columns={pinnedColumns}
                            headerGridProps={headerGridProps}
                            fixedWidth={pinnedColumnsWidth}
                            onScroll={args => onScroll({...args, scrollLeft})}
                            scrollTop={scrollTop}
                            scrollLeft={scrollLeft}
                            dataGridProps={dataGridProps}
                            setGridRef={pinnedGrid => (this.pinnedGrid = pinnedGrid)}
                            columnWidth={columnWidthFunction(pinnedColumns, cellSizeCache)}
                            headerCellRender={this.renderHeaderCell(
                              pinnedColumns,
                              true,
                              this.props,
                              this.toggleMoreOptions,
                              moreOptionsColumn
                            )}
                            dataCellRender={this.renderDataCell(pinnedColumns, true, this.props)}
                          />
                        </div>
                      )}
                      <div
                        key="unpinned-columns"
                        style={{
                          marginLeft: `${hasPinnedColumns ? `${pinnedColumnsWidth}px` : '0'}`
                        }}
                        className="unpinned-columns grid-column"
                      >
                        <TableSection
                          classList={unpinnedClassList}
                          isPinned={false}
                          columns={unpinnedColumnsGhost}
                          headerGridProps={headerGridProps}
                          fixedWidth={fixedWidth}
                          fixedHeight={fixedHeight}
                          onScroll={onScroll}
                          scrollTop={scrollTop}
                          scrollLeft={scrollLeft}
                          dataGridProps={dataGridProps}
                          setGridRef={unpinnedGrid => (this.unpinnedGrid = unpinnedGrid)}
                          columnWidth={columnWidthFunction(
                            unpinnedColumnsGhost,
                            cellSizeCache,
                            ghost
                          )}
                          headerCellRender={this.renderHeaderCell(
                            unpinnedColumnsGhost,
                            false,
                            this.props,
                            this.toggleMoreOptions,
                            moreOptionsColumn
                          )}
                          dataCellRender={this.renderDataCell(
                            unpinnedColumnsGhost,
                            false,
                            this.props
                          )}
                        />
                      </div>
                    </div>
                  );
                }}
              </ScrollSync>
              {hasStats ? (
                <StatsControl
                  top={headerRowHeight}
                  showStats={showStats}
                  toggleShowStats={this.toggleShowStats}
                />
              ) : null}
            </>
          ) : null}
        </Container>
      );
    }
  }

  return withTheme(DataTable) as React.ComponentType<DataTableProps>;
}

export default DataTableFactory;
