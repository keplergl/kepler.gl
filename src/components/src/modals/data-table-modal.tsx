// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled, {withTheme} from 'styled-components';
import DatasetLabel from '../common/dataset-label';
import DataTableFactory from '../common/data-table';
import {createSelector} from 'reselect';
import {renderedSize} from '../common/data-table/cell-size';
import CanvasHack from '../common/data-table/canvas';
import KeplerTable, {Datasets} from '@kepler.gl/table';
import {UIStateActions} from '@kepler.gl/actions';
import {UiState} from '@kepler.gl/types';
import {Gear} from '../common/icons';
import Portaled from '../common/portaled';
import DataTableConfigFactory from '../common/data-table/display-format';

const MIN_STATS_CELL_SIZE = 122;
const DEFAULT_SORT_COLUMN = {};

// sidePadding changes from 38 to 68, 30px for configuration button
const dgSettings = {
  sidePadding: '68px',
  verticalPadding: '16px',
  height: '36px'
};

const StyledModal = styled.div`
  min-height: 85vh;
  overflow: hidden;
  display: flex;
`;

const DatasetCatalog = styled.div`
  display: flex;
  padding: ${dgSettings.verticalPadding} ${dgSettings.sidePadding} 0 0;

  .overflow-horizontal {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    flex-direction: row;
    ${props => props.theme.modalScrollBar}
  }
`;

interface DatasetModalTabProps {
  active?: boolean;
}

export const DatasetModalTab = styled.div<DatasetModalTabProps>`
  align-items: center;
  border-bottom: 3px solid ${props => (props.active ? 'black' : 'transparent')};
  cursor: pointer;
  display: flex;
  height: 35px;
  margin: 0 3px;
  padding: 0 5px;

  :hover {
    border-bottom: 3px solid black;
  }
`;

const StyledConfigureButton = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 24px;
  right: 48px;
  svg {
    stroke: black;
  }
  cursor: pointer;
`;

interface DatasetTabsUnmemoizedProps {
  activeDataset: KeplerTable;
  datasets: Datasets;
  showDatasetTable: (id: string) => void;
}

const DatasetTabsUnmemoized: React.FC<DatasetTabsUnmemoizedProps> = ({
  activeDataset,
  datasets,
  showDatasetTable
}) => (
  <DatasetCatalog className="dataset-modal-catalog">
    <div className="overflow-horizontal">
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
    </div>
  </DatasetCatalog>
);

export const DatasetTabs = React.memo(DatasetTabsUnmemoized);

DatasetTabs.displayName = 'DatasetTabs';

DataTableModalFactory.deps = [DataTableFactory, DataTableConfigFactory];

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 100%;
  max-height: 100%;
  max-width: 100%;
`;

interface DataTableModalProps {
  theme: any;
  dataId?: string;
  sortTableColumn: (id: string, column: string, mode?: string) => void;
  pinTableColumn: (id: string, column: string) => void;
  copyTableColumn: (id: string, column: string) => void;
  datasets: Datasets;
  showDatasetTable: (id: string) => void;
  showTab?: boolean;
  setColumnDisplayFormat: (
    dataId: string,
    formats: {
      column: string;
      displayFormat: string;
    }
  ) => void;
  uiStateActions: typeof UIStateActions;
  uiState: UiState;
}

function DataTableModalFactory(
  DataTable: ReturnType<typeof DataTableFactory>,
  DataTableConfig: ReturnType<typeof DataTableConfigFactory>
): React.ComponentType<Omit<DataTableModalProps, 'theme'>> {
  class DataTableModal extends React.Component<DataTableModalProps> {
    state = {
      showConfig: false
    };

    datasetCellSizeCache = {};
    dataId = ({dataId = ''}: DataTableModalProps) => dataId;
    datasets = (props: DataTableModalProps) => props.datasets;
    fields = ({datasets, dataId = ''}: DataTableModalProps) => (datasets[dataId] || {}).fields;
    columns = createSelector(this.fields, fields => fields.map(f => f.name));
    colMeta = createSelector([this.fields, this.datasets], fields =>
      fields.reduce(
        (acc, {name, displayName, type, filterProps, format, displayFormat}) => ({
          ...acc,
          [name]: {
            name: displayName || name,
            type,
            ...(format ? {format} : {}),
            ...(displayFormat ? {displayFormat} : {}),
            ...(filterProps?.columnStats ? {columnStats: filterProps.columnStats} : {})
          }
        }),
        {}
      )
    );

    cellSizeCache = createSelector(this.dataId, this.datasets, (dataId, datasets) => {
      if (!datasets[dataId]) {
        return {};
      }
      const {fields, dataContainer} = datasets[dataId];

      let showCalculate: boolean | null = null;
      if (!this.datasetCellSizeCache[dataId]) {
        showCalculate = true;
      } else if (
        this.datasetCellSizeCache[dataId].fields !== fields ||
        this.datasetCellSizeCache[dataId].dataContainer !== dataContainer
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
              dataContainer,
              column: field.displayName
            },
            colIdx,
            type: field.type,
            fontSize: this.props.theme.cellFontSize,
            font: this.props.theme.fontFamily,
            minCellSize: MIN_STATS_CELL_SIZE
          })
        }),
        {}
      );
      // save it to cache
      this.datasetCellSizeCache[dataId] = {
        cellSizeCache,
        fields,
        dataContainer
      };
      return cellSizeCache;
    });

    copyTableColumn = (column: string) => {
      const {dataId = '', copyTableColumn} = this.props;
      copyTableColumn(dataId, column);
    };

    pinTableColumn = (column: string) => {
      const {dataId = '', pinTableColumn} = this.props;
      pinTableColumn(dataId, column);
    };

    sortTableColumn = (column: string, mode?: string) => {
      const {dataId = '', sortTableColumn} = this.props;
      sortTableColumn(dataId, column, mode);
    };

    setColumnDisplayFormat = formats => {
      const {dataId, setColumnDisplayFormat} = this.props;
      if (dataId) setColumnDisplayFormat(dataId, formats);
    };

    onOpenConfig = () => {
      this.setState({showConfig: true});
    };

    onCloseConfig = () => {
      this.setState({showConfig: false});
    };

    render() {
      const {datasets, dataId, showDatasetTable, showTab = true} = this.props;
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
            {showTab ? (
              <DatasetTabs
                activeDataset={activeDataset}
                datasets={datasets}
                showDatasetTable={showDatasetTable}
              />
            ) : null}
            <StyledConfigureButton className="display-config-button">
              <Gear onClick={this.onOpenConfig} />
              <Portaled
                right={240}
                top={20}
                isOpened={this.state.showConfig}
                onClose={this.onCloseConfig}
              >
                <DataTableConfig
                  columns={columns}
                  colMeta={colMeta}
                  setColumnDisplayFormat={this.setColumnDisplayFormat}
                  onClose={this.onCloseConfig}
                />
              </Portaled>
            </StyledConfigureButton>
            {datasets[dataId] ? (
              <DataTable
                key={dataId}
                dataId={dataId}
                columns={columns}
                colMeta={colMeta}
                cellSizeCache={cellSizeCache}
                dataContainer={activeDataset.dataContainer}
                pinnedColumns={activeDataset.pinnedColumns}
                sortOrder={activeDataset.sortOrder}
                sortColumn={activeDataset.sortColumn || DEFAULT_SORT_COLUMN}
                copyTableColumn={this.copyTableColumn}
                pinTableColumn={this.pinTableColumn}
                sortTableColumn={this.sortTableColumn}
                setColumnDisplayFormat={this.setColumnDisplayFormat}
                hasStats={false}
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
