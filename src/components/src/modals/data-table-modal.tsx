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
import {FormattedMessage} from '@kepler.gl/localization';
import {UiState} from '@kepler.gl/types';
import {
  collectColumnValues,
  ColumnStats,
  computeColumnStats,
  createIndexedDataContainer,
  DataContainerInterface,
  getApplicationConfig
} from '@kepler.gl/utils';
import {Gear} from '../common/icons';
import Portaled from '../common/portaled';
import DataTableConfigFactory from '../common/data-table/display-format';
import {SelectionButton} from '../common/styled-components';
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

const DataViewBar = styled.div.attrs({
  className: 'data-view-controls'
})`
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.dropdownListBorderTopLT || '#D3D8E0'};
  display: flex;
  flex: 0 0 auto;
  padding: 8px 16px 12px;
`;

const DataViewLabel = styled.div.attrs({
  className: 'data-view-label'
})`
  color: ${props => props.theme.textColorLT};
  font-size: 14px;
  font-weight: 600;
  margin-right: 12px;
`;

const DataViewButton = styled(SelectionButton)`
  color: ${props => (props.selected ? props.theme.selectionBtnActColor : props.theme.textColorLT)};
  font-size: 12px;
  font-weight: 500;
`;

const DataViewRowCount = styled.div.attrs({
  className: 'data-view-row-count'
})`
  color: ${props => props.theme.subtextColorLT};
  font-size: 12px;
  margin-left: 6px;
`;

/**
 * Row indexes to display for the filtered view, in the active table sort order.
 * Indexes stay in the parent dataset so an indexed container can map them.
 */
function filteredDisplayIndexes(
  filteredIdxCPU: number[] | null | undefined,
  sortOrder: number[] | null | undefined
): number[] {
  if (!filteredIdxCPU) {
    return [];
  }
  if (!sortOrder?.length) {
    return filteredIdxCPU;
  }
  const filtered = new Set(filteredIdxCPU);
  return sortOrder.filter(index => filtered.has(index));
}

function filteredColumnValues(
  field: {fieldIdx?: number; filterProps?: object | null},
  dataContainer: DataContainerInterface,
  filteredIdxCPU: number[]
): unknown[] {
  const mappedValue =
    field.filterProps &&
    'mappedValue' in field.filterProps &&
    Array.isArray(field.filterProps.mappedValue)
      ? field.filterProps.mappedValue
      : undefined;
  if (mappedValue && mappedValue.length === dataContainer.numRows()) {
    return filteredIdxCPU.map(index => mappedValue[index]);
  }
  return collectColumnValues(
    createIndexedDataContainer(dataContainer, filteredIdxCPU),
    field.fieldIdx ?? 0
  );
}

type FilteredColumnStatsState = {
  key: number[] | undefined;
  stats: Record<string, ColumnStats>;
  loading: Record<string, boolean>;
};

const EMPTY_FILTERED_COLUMN_STATS: FilteredColumnStatsState = {
  key: undefined,
  stats: {},
  loading: {}
};

function tableDataForView(
  dataContainer: DataContainerInterface,
  filteredIdxCPU: number[] | null | undefined,
  sortOrder: number[] | null | undefined,
  showFiltered: boolean
): {dataContainer: DataContainerInterface; sortOrder: number[] | null | undefined} {
  if (!showFiltered) {
    return {dataContainer, sortOrder};
  }
  return {
    dataContainer: createIndexedDataContainer(
      dataContainer,
      filteredDisplayIndexes(filteredIdxCPU, sortOrder)
    ),
    sortOrder: null
  };
}

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
  applyCPUFilter?: (dataId: string | string[]) => void;
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
    applyCPUFilter,
    setColumnDisplayFormat: setColumnDisplayFormatProp,
    uiStateActions,
    uiState,
    loadColumnStats
  }) => {
    const [showConfig, setShowConfig] = useState(false);
    const [showFiltered, setShowFiltered] = useState(false);
    const datasetCellSizeCache = useRef<Record<string, any>>({});
    // Dataset id whose CPU filter was requested for the current filtered view.
    const lastFilteredId = useRef<string | null>(null);

    const enableColumnStats = getApplicationConfig().enableColumnStats;

    const fields = useMemo(
      () => (datasets && dataId ? (datasets[dataId] || {}).fields : undefined),
      [datasets, dataId]
    );

    const columns = useMemo(() => fields?.map(f => f.name) || [], [fields]);
    const [filteredColumnStats, setFilteredColumnStats] = useState<FilteredColumnStatsState>(
      EMPTY_FILTERED_COLUMN_STATS
    );
    const loadingColumnNames = useRef<Set<string>>(new Set());
    const filteredStatsKey = useRef<number[] | undefined>(undefined);

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

    const requestFilteredData = useCallback(
      (id: string) => {
        if (!id || !applyCPUFilter) {
          return;
        }
        lastFilteredId.current = id;
        applyCPUFilter(id);
      },
      [applyCPUFilter]
    );

    const onSelectAllData = useCallback(() => {
      setShowFiltered(false);
    }, []);

    const onSelectFilteredData = useCallback(() => {
      if (dataId) {
        requestFilteredData(dataId);
      }
      setShowFiltered(true);
    }, [dataId, requestFilteredData]);

    const onShowDatasetTable = useCallback(
      (id: string) => {
        if (showFiltered) {
          requestFilteredData(id);
        }
        if (showDatasetTable) {
          showDatasetTable(id);
        }
      },
      [requestFilteredData, showDatasetTable, showFiltered]
    );

    // Cover dataId changes that do not go through the dataset tabs.
    useEffect(() => {
      if (!showFiltered || !dataId || lastFilteredId.current === dataId) {
        return;
      }
      requestFilteredData(dataId);
    }, [dataId, requestFilteredData, showFiltered]);

    const activeDataset = datasets && dataId ? datasets[dataId] : undefined;
    const sourceContainer = activeDataset?.dataContainer;
    const filteredIdxCPU = activeDataset?.filteredIdxCPU;
    const sortOrder = activeDataset?.sortOrder;

    const displayData = useMemo(
      () =>
        sourceContainer
          ? tableDataForView(sourceContainer, filteredIdxCPU, sortOrder, showFiltered)
          : null,
      [filteredIdxCPU, showFiltered, sortOrder, sourceContainer]
    );

    const filteredStatsKeyValue =
      showFiltered && Array.isArray(filteredIdxCPU) ? filteredIdxCPU : undefined;
    if (filteredStatsKey.current !== filteredStatsKeyValue) {
      filteredStatsKey.current = filteredStatsKeyValue;
      loadingColumnNames.current = new Set();
    }

    const visibleFilteredStats =
      filteredColumnStats.key === filteredStatsKeyValue
        ? filteredColumnStats.stats
        : EMPTY_FILTERED_COLUMN_STATS.stats;
    const visibleFilteredLoading =
      filteredColumnStats.key === filteredStatsKeyValue
        ? filteredColumnStats.loading
        : EMPTY_FILTERED_COLUMN_STATS.loading;

    const handleLoadColumnStats = useCallback(
      (id: string, fieldName: string | string[]) => {
        const indexes = filteredStatsKey.current;
        if (!showFiltered || !indexes || !sourceContainer) {
          loadColumnStats?.(id, fieldName);
          return;
        }

        const names = (Array.isArray(fieldName) ? fieldName : [fieldName]).filter(
          name => !visibleFilteredStats[name] && !loadingColumnNames.current.has(name)
        );
        if (!names.length || !fields) {
          return;
        }

        names.forEach(name => loadingColumnNames.current.add(name));
        setFilteredColumnStats(current => {
          const base = current.key === indexes ? current : {key: indexes, stats: {}, loading: {}};
          const loading = {...base.loading};
          names.forEach(name => {
            loading[name] = true;
          });
          return {...base, loading};
        });

        const container = sourceContainer;
        const fieldsToScan = fields;
        void (async () => {
          await new Promise(resolve => {
            setTimeout(resolve, 0);
          });
          if (filteredStatsKey.current !== indexes) {
            return;
          }

          const computed: Record<string, ColumnStats> = {};
          for (const name of names) {
            const field = fieldsToScan.find(candidate => candidate.name === name);
            if (!field) {
              continue;
            }
            computed[name] = computeColumnStats(
              filteredColumnValues(field, container, indexes),
              field.type
            );
            if (filteredStatsKey.current !== indexes) {
              return;
            }
          }

          setFilteredColumnStats(current => {
            if (filteredStatsKey.current !== indexes) {
              return current;
            }
            const base = current.key === indexes ? current : {key: indexes, stats: {}, loading: {}};
            const loading = {...base.loading};
            names.forEach(name => {
              loadingColumnNames.current.delete(name);
              delete loading[name];
            });
            return {key: indexes, stats: {...base.stats, ...computed}, loading};
          });
        })();
      },
      [fields, loadColumnStats, showFiltered, sourceContainer, visibleFilteredStats]
    );

    const colMeta = useMemo(
      () =>
        fields?.reduce(
          (acc, {name, displayName, type, filterProps, format, displayFormat, isLoadingStats}) => {
            const waitingForFilter = showFiltered && !Array.isArray(filteredIdxCPU);
            const stats = showFiltered ? visibleFilteredStats[name] : filterProps?.columnStats;
            const loading = showFiltered
              ? waitingForFilter || Boolean(visibleFilteredLoading[name])
              : isLoadingStats;

            return {
              ...acc,
              [name]: {
                name: displayName || name,
                type,
                ...(format ? {format} : {}),
                ...(displayFormat ? {displayFormat} : {}),
                ...(stats ? {columnStats: stats} : {}),
                ...(typeof loading === 'boolean' ? {isLoadingStats: loading} : {})
              }
            };
          },
          {}
        ) || {},
      [fields, filteredIdxCPU, showFiltered, visibleFilteredLoading, visibleFilteredStats]
    );

    let rowCount: number | undefined;
    if (!sourceContainer || (showFiltered && !filteredIdxCPU)) {
      rowCount = undefined;
    } else if (showFiltered) {
      rowCount = displayData?.dataContainer.numRows();
    } else {
      rowCount = sourceContainer.numRows();
    }

    if (!datasets || !dataId || !activeDataset || !displayData) {
      return null;
    }

    return (
      <StyledModal className="dataset-modal" id="dataset-modal">
        <CanvasHack />
        <TableContainer>
          {showTab ? (
            <DatasetTabs
              activeDataset={activeDataset}
              datasets={datasets}
              showDatasetTable={onShowDatasetTable}
            />
          ) : null}
          <DataViewBar>
            <DataViewLabel>
              <FormattedMessage id="modal.dataTable.show" />
            </DataViewLabel>
            <DataViewButton
              className="data-view-all"
              selected={!showFiltered}
              onClick={onSelectAllData}
              role="button"
              aria-pressed={!showFiltered}
            >
              <FormattedMessage id="modal.dataTable.allData" />
            </DataViewButton>
            <DataViewButton
              className="data-view-filtered"
              selected={showFiltered}
              onClick={onSelectFilteredData}
              role="button"
              aria-pressed={showFiltered}
            >
              <FormattedMessage id="modal.dataTable.filteredData" />
            </DataViewButton>
            <DataViewRowCount>
              {rowCount === undefined ? (
                '-'
              ) : (
                <FormattedMessage id="modal.dataTable.rowCount" values={{rowCount}} />
              )}
            </DataViewRowCount>
          </DataViewBar>
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
              key={`${dataId}-${showFiltered ? 'filtered' : 'all'}`}
              dataId={dataId}
              columns={columns}
              colMeta={colMeta}
              cellSizeCache={cellSizeCache}
              dataContainer={displayData.dataContainer}
              pinnedColumns={activeDataset.pinnedColumns}
              sortOrder={displayData.sortOrder}
              sortColumn={activeDataset.sortColumn || DEFAULT_SORT_COLUMN}
              copyTableColumn={handleCopyTableColumn}
              pinTableColumn={handlePinTableColumn}
              sortTableColumn={handleSortTableColumn}
              setColumnDisplayFormat={handleSetColumnDisplayFormat}
              hasStats={enableColumnStats}
              loadColumnStats={enableColumnStats ? handleLoadColumnStats : undefined}
            />
          ) : null}
        </TableContainer>
      </StyledModal>
    );
  };

  return withTheme(DataTableModal) as React.ComponentType<Omit<DataTableModalProps, 'theme'>>;
}

export default DataTableModalFactory;
