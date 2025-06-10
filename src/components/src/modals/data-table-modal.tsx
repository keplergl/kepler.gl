// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useRef, useMemo, useCallback} from 'react';
import styled, {withTheme, IStyledComponent} from 'styled-components';
import DatasetLabel from '../common/dataset-label';
import DataTableFactory from '../common/data-table';
import {renderedSize} from '../common/data-table/cell-size';
import CanvasHack from '../common/data-table/canvas';
import KeplerTable, {Datasets} from '@kepler.gl/table';
import {UIStateActions} from '@kepler.gl/actions';
import {UiState} from '@kepler.gl/types';
import {Gear} from '../common/icons';
import Portaled from '../common/portaled';
import DataTableConfigFactory from '../common/data-table/display-format';
import {BaseComponentProps} from '../types';

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

export type DatasetModalTabProps = BaseComponentProps & {
  active?: boolean;
};

export const DatasetModalTab: IStyledComponent<
  'web',
  DatasetModalTabProps
> = styled.div<DatasetModalTabProps>`
  align-items: center;
  border-bottom: 3px solid ${props => (props.active ? 'black' : 'transparent')};
  cursor: pointer;
  display: flex;
  height: 35px;
  margin: 0 3px;
  padding: 0 5px;

  &:hover {
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
      {Object.values(datasets).map((dataset: KeplerTable) => (
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
  const DataTableModal: React.FC<DataTableModalProps> = ({
    theme,
    dataId = '',
    sortTableColumn,
    pinTableColumn,
    copyTableColumn: copyTableColumnProp,
    datasets,
    showDatasetTable,
    showTab = true,
    setColumnDisplayFormat: setColumnDisplayFormatProp,
    uiStateActions,
    uiState
  }) => {
    const [showConfig, setShowConfig] = useState(false);
    const datasetCellSizeCache = useRef<Record<string, any>>({});

    const fields = useMemo(() => (datasets[dataId] || {}).fields, [datasets, dataId]);

    const columns = useMemo(() => fields?.map(f => f.name) || [], [fields]);

    const colMeta = useMemo(
      () =>
        fields?.reduce(
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
        ) || {},
      [fields]
    );

    const cellSizeCache = useMemo(() => {
      if (!datasets[dataId]) {
        return {};
      }
      const {fields, dataContainer} = datasets[dataId];

      let showCalculate: boolean | null = null;
      if (!datasetCellSizeCache.current[dataId]) {
        showCalculate = true;
      } else if (
        datasetCellSizeCache.current[dataId].fields !== fields ||
        datasetCellSizeCache.current[dataId].dataContainer !== dataContainer
      ) {
        showCalculate = true;
      }

      if (!showCalculate) {
        return datasetCellSizeCache.current[dataId].cellSizeCache;
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
            fontSize: theme.cellFontSize,
            font: theme.fontFamily,
            minCellSize: MIN_STATS_CELL_SIZE
          })
        }),
        {}
      );

      // save it to cache
      datasetCellSizeCache.current[dataId] = {
        cellSizeCache,
        fields,
        dataContainer
      };
      return cellSizeCache;
    }, [dataId, datasets, theme]);

    const handleCopyTableColumn = useCallback(
      (column: string) => {
        copyTableColumnProp(dataId, column);
      },
      [copyTableColumnProp, dataId]
    );

    const handlePinTableColumn = useCallback(
      (column: string) => {
        pinTableColumn(dataId, column);
      },
      [pinTableColumn, dataId]
    );

    const handleSortTableColumn = useCallback(
      (column: string, mode?: string) => {
        sortTableColumn(dataId, column, mode);
      },
      [sortTableColumn, dataId]
    );

    const handleSetColumnDisplayFormat = useCallback(
      formats => {
        if (dataId) setColumnDisplayFormatProp(dataId, formats);
      },
      [setColumnDisplayFormatProp, dataId]
    );

    const onOpenConfig = useCallback(() => {
      setShowConfig(true);
    }, []);

    const onCloseConfig = useCallback(() => {
      setShowConfig(false);
    }, []);

    if (!datasets || !dataId) {
      return null;
    }

    const activeDataset = datasets[dataId];

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
            <Gear onClick={onOpenConfig} />
            <Portaled right={240} top={20} isOpened={showConfig} onClose={onCloseConfig}>
              <DataTableConfig
                columns={columns}
                colMeta={colMeta}
                setColumnDisplayFormat={handleSetColumnDisplayFormat}
                onClose={onCloseConfig}
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
              copyTableColumn={handleCopyTableColumn}
              pinTableColumn={handlePinTableColumn}
              sortTableColumn={handleSortTableColumn}
              setColumnDisplayFormat={handleSetColumnDisplayFormat}
              hasStats={false}
            />
          ) : null}
        </TableContainer>
      </StyledModal>
    );
  };

  return withTheme(DataTableModal) as React.ComponentType<Omit<DataTableModalProps, 'theme'>>;
}

export default DataTableModalFactory;
