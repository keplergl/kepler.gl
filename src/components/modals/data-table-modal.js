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

import React, {Component} from 'react';
import {createSelector} from 'reselect';
import styled from 'styled-components';
import {VariableSizeGrid as Grid} from 'react-window';
import Autosizer from 'react-virtualized-auto-sizer';

import {ALL_FIELD_TYPES} from 'constants/default-settings';
import FieldToken from 'components/common/field-token';
import DatasetLabel from 'components/common/dataset-label';
import {Clock} from 'components/common/icons/index';

// Breakpoints
import {media} from 'styles/media-breakpoints';

const COLUMN_SIZE = {
  [ALL_FIELD_TYPES.timestamp]: 200,
  [ALL_FIELD_TYPES.date]: 150,
  [ALL_FIELD_TYPES.point]: 150,
  [ALL_FIELD_TYPES.string]: 150
};

const DEFAULT_COLUMN_WIDTH = 100;
const HEADER_HEIGHT = 72;

const dgSettings = {
  sidePadding: 36,
  verticalPadding: 16,
  height: 36
};

const StyledModal = styled.div`
  height: 70vh;
  overflow: hidden;
  ${media.palm`
    margin: 0 -36px;
  `}
  
  .header {
    border-right: 0;
    border-bottom: 0;
    background: ${props => props.theme.panelBackgroundLT};
    color: ${props => props.theme.titleColorLT};
    padding: 14px 8px 14px 0;
  }
  .cell {
    padding: 14px 8px;
    border-right: 0;
    border-bottom: ${props => props.theme.panelBorderLT};
  }
 
`;

const tagContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const HeaderRenderer = React.memo(({columnIndex, data, rowIndex, style}) => {
  const item = data[columnIndex];

  return (
    <div className="header" style={{...style, ...tagContainerStyle}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div>
          {item.type === 'timestamp' ? <Clock height="16px" /> : null}
        </div>
        {item.name}
      </div>
      <div>
        <FieldToken type={item.type} />
      </div>
    </div>
  );
});

const CellRenderer = React.memo(({columnIndex, data, rowIndex, style}) => {
  const item = data[rowIndex][columnIndex];

  return (
    <div
      className="cell"
      style={style}
      key={`${rowIndex}-${columnIndex}`}>
      {item}
    </div>
  );
});

export class DataTableModal extends Component {

  headerGrid = React.createRef();

  datasetsSelector = props => props.datasets;
  dataIdSelector = props => props.dataId;
  activeDatasetSelector = createSelector(
    this.datasetsSelector,
    this.dataIdSelector,
    (datasets, dataId) => datasets[dataId]
  );
  columnsSelector = createSelector(
    this.activeDatasetSelector,
    dataset => dataset.fields.filter(({name}) => name !== '_geojson')
  );
  rowsSelector = createSelector(
    this.activeDatasetSelector,
    dataset => dataset.data
  );

  headerRowHeight = () => 72;
  cellRowHeight = () => 48;
  columnWidth = index => COLUMN_SIZE[this.columnsSelector(this.props)[index].type] || DEFAULT_COLUMN_WIDTH;
  onRowScrolling = ({scrollLeft}) => this.headerGrid.current.scrollTo({scrollLeft});

  render() {
    const {showDatasetTable} = this.props;

    const datasets = this.datasetsSelector(this.props);
    const dataId = this.dataIdSelector(this.props);

    if (!datasets || !dataId) {
      return null;
    }

    const activeDataset = this.activeDatasetSelector(this.props);
    const columns = this.columnsSelector(this.props);
    const rows = this.rowsSelector(this.props);

    return (
      <StyledModal className="dataset-modal" >
        <DatasetTabs
          activeDataset={activeDataset}
          datasets={datasets}
          showDatasetTable={showDatasetTable}
        />
        <Autosizer>
          {({height, width}) => (
            [
              <Grid
                className="headers"
                columnCount={columns.length}
                columnWidth={this.columnWidth}
                height={HEADER_HEIGHT}
                rowCount={1}
                rowHeight={this.headerRowHeight}
                width={width}
                itemData={columns}
                // hold onto a reference to the header grid component
                // so we can set the scroll position later
                ref={this.headerGrid}
                // hide the overflow so the scroll bar never shows
                // in the header grid
                style={{
                  // disable scrolling in the header
                  overflowX: 'hidden',
                  overflowY: 'hidden'
                }}
              >
                {HeaderRenderer}
              </Grid>,
              <Grid
                className="rows"
                columnCount={columns.length}
                columnWidth={this.columnWidth}
                height={height - dgSettings.height - dgSettings.verticalPadding - HEADER_HEIGHT}
                rowCount={rows.length}
                rowHeight={this.cellRowHeight}
                width={width}
                itemData={rows}
                // When a scroll occurs in the body grid,
                // synchronize the scroll position of the header grid
                onScroll={this.onRowScrolling}
              >
                {CellRenderer}
              </Grid>
            ]
          )}
        </Autosizer>
      </StyledModal>
    );
  }
}

const DatasetCatalog = styled.div`
  display: flex;
  padding: ${dgSettings.verticalPadding}px ${dgSettings.sidePadding}px 0;
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

const DataTableModalFactory = () => DataTableModal;
export default DataTableModalFactory;
