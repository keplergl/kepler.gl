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

import React from 'react';
import styled, {withTheme} from 'styled-components';
import DatasetLabel from 'components/common/dataset-label';
import DataTableFactory from 'components/common/data-table';
import {createSelector} from 'reselect';
import {renderedSize} from 'components/common/data-table/cell-size';
import CanvasHack from 'components/common/data-table/canvas';

const dgSettings = {
  sidePadding: '38px',
  verticalPadding: '16px',
  height: '36px'
};

const StyledModal = styled.div`
  min-height: 70vh;
  overflow: hidden;
`;

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
        <DatasetLabel dataset={dataset} />
      </DatasetModalTab>
    ))}
  </DatasetCatalog>
));

DatasetTabs.displayName = 'DatasetTabs';

DataTableModalFactory.deps = [DataTableFactory];

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 70vh;
  max-height: 70vh;
`;

function DataTableModalFactory(DataTable) {
  class DataTableModal extends React.Component {
    datasetCellSizeCache = {};
    dataId = props => props.dataId;
    datasets = props => props.datasets;
    fields = props => (props.datasets[props.dataId] || {}).fields;
    columns = createSelector(this.fields, fields => fields.map(f => f.name));
    colMeta = createSelector(this.fields, fields =>
      fields.reduce(
        (acc, {name, type}) => ({
          ...acc,
          [name]: type
        }),
        {}
      )
    );
    cellSizeCache = createSelector(this.dataId, this.datasets, (dataId, datasets) => {
      if (!this.props.datasets[dataId]) {
        return {};
      }
      const {fields, allData} = this.props.datasets[dataId];

      let showCalculate = null;
      if (!this.datasetCellSizeCache[dataId]) {
        showCalculate = true;
      } else if (
        this.datasetCellSizeCache[dataId].fields !== fields ||
        this.datasetCellSizeCache[dataId].allData !== allData
      ) {
        showCalculate = true;
      }

      if (!showCalculate) {
        return this.datasetCellSizeCache[dataId].cellSizeCache;
      }

      const cellSizeCache = fields.reduce(
        (acc, field, colIdx) => ({
          ...acc,
          [field.name]: renderedSize({
            text: {
              rows: allData,
              column: field.name
            },
            colIdx,
            type: field.type,
            fontSize: this.props.theme.cellFontSize,
            font: this.props.theme.fontFamily
          })
        }),
        {}
      );
      // save it to cache
      this.datasetCellSizeCache[dataId] = {
        cellSizeCache,
        fields,
        allData
      };
      return cellSizeCache;
    });

    render() {
      const {datasets, dataId, showDatasetTable} = this.props;
      if (!datasets || !dataId) {
        return null;
      }

      const activeDataset = datasets[dataId];
      const columns = this.columns(this.props);
      const colMeta = this.colMeta(this.props);
      const cellSizeCache = this.cellSizeCache(this.props);

      return (
        <StyledModal className="dataset-modal" id="dataset-modal">
          <CanvasHack />
          <TableContainer>
            <DatasetTabs
              activeDataset={activeDataset}
              datasets={datasets}
              showDatasetTable={showDatasetTable}
            />
            {datasets[dataId] ? (
              <DataTable
                key={dataId}
                dataId={dataId}
                columns={columns}
                colMeta={colMeta}
                cellSizeCache={cellSizeCache}
                rows={activeDataset.allData}
                pinnedColumns={activeDataset.pinnedColumns}
                sortOrder={activeDataset.sortOrder}
                sortColumn={activeDataset.sortColumn}
                copyTableColumn={this.props.copyTableColumn}
                pinTableColumn={this.props.pinTableColumn}
                sortTableColumn={this.props.sortTableColumn}
              />
            ) : null}
          </TableContainer>
        </StyledModal>
      );
    }
  }

  return withTheme(DataTableModal);
}

export default DataTableModalFactory;
