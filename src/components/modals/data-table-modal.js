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
import styled from 'styled-components';
import {MultiGrid} from 'react-virtualized';

import {ALL_FIELD_TYPES} from 'constants/default-settings';
import FieldToken from 'components/common/field-token';
import DatasetLabel from 'components/common/dataset-label';
import {Clock} from 'components/common/icons/index';

const COLUMN_WIDTH = 200;

const CELL_HEADER_HEIGHT = 72;
const CELL_HEIGHT = 48;
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

const dgSettings = {
  sidePadding: '36px',
  verticalPadding: '16px',
  height: '36px'
};

const StyledModal = styled.div`
  min-height: 70vh;
  overflow: hidden;
`;

const DataGridWrapper = styled.div`
  .cell {
    border-right: 0;
    padding: 14px 8px;
    border-bottom: ${props => props.theme.panelBorderLT};
    color: ${props => props.theme.labelColorLT};
    align-items: center;
    justify-content: center;
    display: flex;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    word-wrap: break-spaces;
  }

  .header-cell {
    border-right: 0;
    border-bottom: 0;
    background: ${props => props.theme.panelBackgroundLT};
    color: ${props => props.theme.titleColorLT};
    padding: 14px 0;
  }

  .header-cell:first-child {
    padding-left: ${dgSettings.sidePadding};
  }

  .ReactVirtualized__Grid__innerScrollContainer {
    ${props => props.theme.modalScrollBar};
  }
`;

const tagContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const FieldHeader = ({name, type}) => (
  <div className="header-cell" style={tagContainerStyle}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <div
        style={{
          marginRight: type === 'timestamp' ? '2px' : '18px',
          height: '16px'
        }}
      >
        {type === 'timestamp' ? <Clock height="16px" /> : null}
      </div>
      {name}
    </div>
    <div style={{marginLeft: '18px'}}>
      <FieldToken type={type} />
    </div>
  </div>
);

const Cell = ({name, type}) => {
  const value = type === ALL_FIELD_TYPES.boolean ? String(name) : name;
  return (<div className={`cell ${type}`} title={value}><span>{value}</span></div>);
};

export class Datagrid extends PureComponent {
  _cellRenderer = ({columnIndex, key, rowIndex, style}) => {
    const {columns, rows} = this.props;

    // rowIndex -1 because data rows start rendering at index 1 and we normalize back using the -1 param
    const className = `${rowIndex === 0 ? 'header' : `row-${rowIndex-1}`} column-${columnIndex}`;

    return (
      <div key={key} style={style} className={className}>
        {rowIndex === 0
          ? (<FieldHeader name={columns[columnIndex].name} type={columns[columnIndex].type} />)
          : (<Cell name={rows[rowIndex - 1][columnIndex]} type={columns[columnIndex].type} />)
        }
      </div>
    );
  };

  _rowHeight = ({index}) => {
    const {columns} = this.props;

    return index < columns.length ? CELL_HEADER_HEIGHT : CELL_HEIGHT;
  };

  render() {
    const {columns, height, rows, width} = this.props;

    return (
      <DataGridWrapper>
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

export class DataTableModal extends PureComponent {
  render() {
    const {showDatasetTable, width, height} = this.props;
    const datasets = this.props.datasets;
    const dataId = this.props.dataId;

    if (!datasets || !dataId) {
      return null;
    }

    const activeDataset = datasets[dataId];
    const rows = activeDataset.data;

    const columns = activeDataset.fields
      .filter(({name}) => name !== '_geojson');

    return (
      <StyledModal className="dataset-modal" >
        <DatasetTabs
          activeDataset={activeDataset}
          datasets={datasets}
          showDatasetTable={showDatasetTable}
        />
        <Datagrid
          width={width}
          height={height}
          rows={rows}
          columns={columns}
        />
      </StyledModal>
    );
  }
}

const DatasetCatalog = styled.div`
  display: flex;
  padding: ${dgSettings.verticalPadding} ${dgSettings.sidePadding} 0;
`;

export const DatasetModalTab = styled.div`
  align-items: center;
  border-bottom: 3px solid ${props => (props.active ? 'black' : 'transparent')};
  cursor: pointer;
  display: flex;
  height: 35px;
  margin: 0 3px;
  padding: 0 5px;

  :first-child {
    margin-left: 0;
    padding-left: 0;
  }
`;

export const DatasetTabs = React.memo(({activeDataset, datasets, showDatasetTable}) => (
  <DatasetCatalog className="dataset-modal-catalog">
    {Object.values(datasets).map(dataset => (
      <DatasetModalTab
        className="dataset-modal-tab"
        active={dataset === activeDataset}
        key={dataset.id}
        onClick={() => showDatasetTable(dataset.id)}
      >
        <DatasetLabel dataset={dataset}/>
      </DatasetModalTab>
    ))}
  </DatasetCatalog>
));

DatasetTabs.displayName = 'DatasetTabs';

const DataTableModalFactory = () => DataTableModal;
export default DataTableModalFactory;
