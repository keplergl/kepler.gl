// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useRef, useMemo, useCallback, useEffect} from 'react';
import styled, {withTheme, IStyledComponent} from 'styled-components';
import DatasetLabel from '../common/dataset-label';
import DataTableFactory from '../common/data-table';
import {renderedSize} from '../common/data-table/cell-size';
import CanvasHack from '../common/data-table/canvas';
import KeplerTable, {Datasets} from '@kepler.gl/table';
import {UIStateActions} from '@kepler.gl/actions';
import {UiState} from '@kepler.gl/types';
import {getApplicationConfig} from '@kepler.gl/utils';
import {Gear} from '../common/icons';
import Portaled from '../common/portaled';
import DataTableConfigFactory from '../common/data-table/display-format';
import {BaseComponentProps} from '../types';
import {STATS_WIDTH} from '../common/data-table/column-statistics-components';

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
  $active?: boolean;
};

export const DatasetModalTab: IStyledComponent<
  'web',
  DatasetModalTabProps
> = styled.div<DatasetModalTabProps>`
  align-items: center;
  border-bottom: 3px solid ${props => (props.$active ? 'black' : 'transparent')};
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
          $active={dataset === activeDataset}
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
  loadColumnStats?: (dataId: string, fieldName: string | string[]) => void;
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
    uiState,
    loadColumnStats
  }) => {
    const [showConfig, setShowConfig] = useState(false);
    const datasetCellSizeCache = useRef<Record<string, any>>({});

    const enableColumnStats = getApplicationConfig().enableColumnStats;

    const fields = useMemo(
      () => (datasets && dataId ? (datasets[dataId] || {}).fields : undefined),
      [datasets, dataId]
    );

    const columns = useMemo(() => fields?.map(f => f.name) || [], [fields]);

    const colMeta = useMemo(
      () =>
        fields?.reduce(
          (acc, {name, displayName, type, filterProps, format, displayFormat, isLoadingStats}) => ({
            ...acc,
            [name]: {
              name: displayName || name,
              type,
              ...(format ? {format} : {}),
              ...(displayFormat ? {displayFormat} : {}),
              ...(filterProps?.columnStats ? {columnStats: filterProps.columnStats} : {}),
              ...(typeof isLoadingStats === 'boolean' ? {isLoadingStats} : {})
            }
          }),
          {}
        ) || {},
      [fields]
    );

    const [cellSizeCache, setCellSizeCache] = useState<
      Record<string, {row: number; header: number}>
    >({});

    useEffect(() => {
      if (!datasets || !dataId || !datasets[dataId]) {
        setCellSizeCache({});
        return;
      }

      const {fields, dataContainer} = datasets[dataId];
      const cached = datasetCellSizeCache.current[dataId];
      if (
        cached &&
        cached.fields === fields &&
        cached.dataContainer === dataContainer &&
        cached.enableColumnStats === enableColumnStats
      ) {
        setCellSizeCache(cached.cellSizeCache);
        return;
      }

      const nextCache = fields.reduce((acc, field, colIdx) => {
        const size = renderedSize({
          text: {
            dataContainer,
            column: field.displayName
          },
          colIdx,
          type: field.type,
          fontSize: theme.cellFontSize,
          font: theme.fontFamily
        });
        return {
          ...acc,
          [field.name]: enableColumnStats
            ? {
                row: Math.max(size.row, STATS_WIDTH),
                header: Math.max(size.header, STATS_WIDTH)
              }
            : size
        };
      }, {});

      datasetCellSizeCache.current[dataId] = {
        cellSizeCache: nextCache,
        fields,
        dataContainer,
        enableColumnStats
      };
      setCellSizeCache(nextCache);
    }, [dataId, datasets, theme, enableColumnStats]);

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
              hasStats={enableColumnStats}
              loadColumnStats={enableColumnStats ? loadColumnStats : undefined}
            />
          ) : null}
        </TableContainer>
      </StyledModal>
    );
  };

  return withTheme(DataTableModal) as React.ComponentType<Omit<DataTableModalProps, 'theme'>>;
}

export default DataTableModalFactory;
