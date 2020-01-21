// Copyright (c) 2020 Uber Technologies, Inc.
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

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {MultiGrid} from 'react-virtualized';
import styled, {withTheme}from 'styled-components';
import {createSelector} from 'reselect';
import classnames from 'classnames';
import FieldToken from 'components/common/field-token';
import {Clock} from 'components/common/icons/index';
import {parseFieldValue} from 'utils/data-utils';
import {ALL_FIELD_TYPES} from 'constants';

const DataGridWrapper = styled.div`
  width: 100%;
  overflow-x: auto;

  .ReactVirtualized__Grid:focus,
  .ReactVirtualized__Grid:active {
    outline: 0;
  }
  .ReactVirtualized__Grid__innerScrollContainer {
    ${props => props.theme.modalScrollBar};
  }

  .ReactVirtualized__Grid {
    .column-0 .cell {
      padding-left: ${props => props.theme.gridPaddingSide}px;
    }

    .header-0 .header-cell {
      padding-left: ${props => props.theme.gridPaddingSide}px;
    }

    .cell {
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: ${props => props.theme.cellPaddingSide}px;
    }

    .last {
      .cell {
        padding-right: ${props => props.theme.gridPaddingSide}px;
      }
      .header-cell {
        padding-right: ${props => props.theme.gridPaddingSide}px;
      }
    }
  }
`;

const StyledFieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  border-right: 0;
  border-bottom: 0;
  background: ${props => props.theme.panelBackgroundLT};
  color: ${props => props.theme.titleColorLT};
  height: 100%;

  .header-content {
    display: flex;
    flex-direction: column;
  }

  .label-wrapper {
    display: flex;
    align-items: center;
  }

  .icon-wrapper {
    margin-right: ${props => props.type === 'timestamp' ? '2px' : '0'};
    height: 16px;
  }
`;

export const FieldHeaderFactory = () => {
  const Header = ({className, value, type}) => (
    <StyledFieldHeader className={className || ''} type={type} title={value}>
      <div className="field-header-content">
        <div className="label-wrapper">
          <div className="icon-wrapper">
            {type === 'timestamp' ? <Clock height="16px" /> : null}
          </div>
          <span>{value}</span>
        </div>
        <div className="field-wrapper">
          <FieldToken type={type} />
        </div>
      </div>
    </StyledFieldHeader>
  );

  Header.displayName = 'Header';

  return Header;
};

const StyledCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 0;
  border-bottom: ${props => props.theme.panelBorderLT};
  color: ${props => props.theme.labelColorLT};
  text-overflow: ellipsis;
  height: 100%;
  width: 100%;

  span {
    text-overflow: ellipsis;
    white-space: pre-wrap;
    word-wrap: break-word;
    width: 100%;
  }
`;

export const CellFactory = () => {
  const Cell = ({className, value}) => (
    <StyledCell className={className || ''} title={value}>
      <span>{value}</span>
    </StyledCell>
  );

  Cell.displayName = 'Cell';

  return Cell;
};

DataGridFactory.deps = [
  FieldHeaderFactory,
  CellFactory
];

function DataGridFactory(
  FieldHeader,
  Cell
) {
  class DataGrid extends PureComponent {
    static propTypes = {
      theme: PropTypes.object,
      columns: PropTypes.arrayOf(PropTypes.object).isRequired,
      height: PropTypes.number.isRequired,
      rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)).isRequired,
      width: PropTypes.number.isRequired
    };

    columnsSelector = props => props.columns;
    hasGeojson = createSelector(this.columnsSelector, columns =>
      columns.some(c => c.type === ALL_FIELD_TYPES.geojson)
    );

    _cellRenderer = ({columnIndex, key, rowIndex, style}) => {
      const {columns, rows} = this.props;
      const isLast = columnIndex === columns.length - 1;
      const type = columns[columnIndex].type;

      // rowIndex -1 because data rows start rendering at index 1 and we normalize back using the -1 param
      const className = classnames({
        last: isLast,
        [`header-${columnIndex}`]: rowIndex === 0,
        [`row-${rowIndex-1} column-${columnIndex}`]: rowIndex > 0
      });

      return (
        <div key={key} style={style} className={className}>
          {rowIndex === 0
            ? (<FieldHeader className={`header-cell ${type}`} value={columns[columnIndex].name} type={type} />)
            : (<Cell className={`cell ${type}`} value={parseFieldValue(rows[rowIndex - 1][columnIndex], type)} type={type} />)
          }
        </div>
      );
    };

    _rowHeight = ({index}) => index === 0
      ? this.props.theme.cellHeaderHeight
      : this.hasGeojson(this.props) ? this.props.theme.extendCellHeight : this.props.theme.cellHeight;

    _columnWidth = ({index}) => {
      const isGeojsonField = this.props.columns[index].type === ALL_FIELD_TYPES.geojson;
      return isGeojsonField ? this.props.theme.extendColumnWidth : this.props.theme.columnWidth;
    };

    render() {
      const {columns, height, rows, theme, width} = this.props;

      return (
        <DataGridWrapper className="datagrid-wrapper">
          <MultiGrid
            cellRenderer={this._cellRenderer}
            columnWidth={this._columnWidth}
            columnCount={columns.length}
            fixedRowCount={1}
            enableFixedRowScroll={true}
            width={width || theme.gridDefaultWidth}
            height={height || theme.gridDefaultHeight}
            rowHeight={this._rowHeight}
            rowCount={rows.length + 1}
            hideTopRightGridScrollbar={true}
            hideBottomLeftGridScrollbar={true}
          />
        </DataGridWrapper>
      );
    }
  }

  DataGrid.displayName = 'DataGrid';

  // Wrapping the component using withTheme because we need to
  // access variables outside styled-components context
  return withTheme(DataGrid);
}

export default DataGridFactory;
