// Copyright (c) 2019 Uber Technologies, Inc.
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
import {MultiGrid} from 'react-virtualized';
import styled from 'styled-components';
import FieldToken from 'components/common/field-token';
import {Clock} from 'components/common/icons/index';
import {ALL_FIELD_TYPES} from 'constants/default-settings';

const COLUMN_WIDTH = 200;
const CELL_HEADER_HEIGHT = 72;
const CELL_HEIGHT = 48;
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

const DataGridWrapper = styled.div`
  .ReactVirtualized__Grid__innerScrollContainer {
    ${props => props.theme.modalScrollBar};
  }
`;

const StyledFieldHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-right: 0;
  border-bottom: 0;
  background: ${props => props.theme.panelBackgroundLT};
  color: ${props => props.theme.titleColorLT};
  height: 100%;
  
  .label-wrapper {
    display: flex;
    align-items: center;
  }
  
  .icon-wrapper {
    marginRight: ${props => props.type === 'timestamp' ? '2px' : '0'};
    height: 16px;
  }
`;

const FieldHeaderTemplate = ({name, type}) => (
  <StyledFieldHeader type={type}>
    <div className="label-wrapper">
      <div className="icon-wrapper">
        {type === 'timestamp' ? <Clock height="16px" /> : null}
      </div>
      <span>{name}</span>
    </div>
    <div className="field-wrapper">
      <FieldToken type={type} />
    </div>
  </StyledFieldHeader>
);

export const FieldHeaderFactory = () => FieldHeaderTemplate;

const StyledCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-right: 0;
  border-bottom: ${props => props.theme.panelBorderLT};
  color: ${props => props.theme.labelColorLT};
  text-overflow: ellipsis;
  white-space: pre-wrap;
  word-wrap: break-spaces;
  height: 100%;
`;

const CellTemplate = ({name, type}) => {
  const value = type === ALL_FIELD_TYPES.boolean ? String(name) : name;
  return (<StyledCell title={value}><span>{value}</span></StyledCell>);
};

export const CellFactory = () => CellTemplate;

DataGridFactory.deps = [
  FieldHeaderFactory,
  CellFactory
];

function DataGridFactory(
  FieldHeader,
  Cell
) {
  class DataGrid extends PureComponent {
    _cellRenderer = ({columnIndex, key, rowIndex, style}) => {
      const {columns, rows} = this.props;

      // rowIndex -1 because data rows start rendering at index 1 and we normalize back using the -1 param
      const className = `${rowIndex === 0
        ? `header-${columnIndex}`
        : `row-${rowIndex-1}`} column-${columnIndex}`;

      const type = columns[columnIndex].type;

      return (
        <div key={key} style={style} className={className}>
          {rowIndex === 0
            ? (<FieldHeader className={`header-cell ${type}`} name={columns[columnIndex].name} type={type} />)
            : (<Cell className={`cell ${type}`} name={rows[rowIndex - 1][columnIndex]} type={type} />)
          }
        </div>
      );
    };

    _rowHeight = ({index}) => index === 0 ? CELL_HEADER_HEIGHT : CELL_HEIGHT;

    render() {
      const {columns, height, rows, width} = this.props;

      return (
        <DataGridWrapper className="datagrid-wrapper">
          <MultiGrid
            cellRenderer={this._cellRenderer}
            columnWidth={COLUMN_WIDTH}
            columnCount={columns.length}
            fixedRowCount={1}
            enableFixedRowScroll={true}
            width={width || DEFAULT_WIDTH}
            height={height || DEFAULT_HEIGHT}
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

  return DataGrid;
}

export default DataGridFactory;
