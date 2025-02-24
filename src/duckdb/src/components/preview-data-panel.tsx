// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';
import React, {useCallback, useMemo, useState, CSSProperties} from 'react';
import {withTheme} from 'styled-components';

import {DataTable, renderedSize} from '@kepler.gl/components';
import {arrowSchemaToFields} from '@kepler.gl/processors';
import {parseFieldValue, createDataContainer, DataForm} from '@kepler.gl/utils';

type BaseComponentProps = {
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_ROWS_TO_CALCULATE_PREVIEW = 100;
// min Cellsize should take into account option button and field token
const minCellSize = 80;
// option buttons and field token
const optionButtonWidth = 20;
const pinButton = 20;
const cellPadding = 20;

export type ColMeta = {
  [key: string]: {
    colIdx: number;
    name: string;
    displayName: string;
    type: string;
  };
};

export type DataTableStyle = {
  minCellSize?: number;
  cellPadding?: number;
  fontSize?: number;
  font?: string;
  optionsButton?: number;
};

export type QueryResult = {
  table: arrow.Table;
  tableDuckDBTypes: Record<string, string>;
};

export type PreviewDataPanelProps = BaseComponentProps & {
  result: QueryResult;
  rowsToCalculatePreview?: number;
  theme?: any;
  setColumnDisplayFormat?: (formats: {[key: string]: string}) => void;
  defaultPinnedColumns?: string[];
  dataTableStyle: DataTableStyle;
  onAddResultToMap: (result: QueryResult) => void;
};

const PreviewDataPanelWOTheme: React.FC<PreviewDataPanelProps> = ({
  result,
  rowsToCalculatePreview = DEFAULT_ROWS_TO_CALCULATE_PREVIEW,
  defaultPinnedColumns = [],
  theme
}) => {
  const [pinnedColumns, setPinnedColumns] = useState<string[]>(defaultPinnedColumns);
  const fields = useMemo(
    () => arrowSchemaToFields(result.table, result.tableDuckDBTypes),
    [result]
  );
  const dataContainer = useMemo(() => {
    const cols = [...Array(result.table.numCols).keys()].map(i => result.table.getChildAt(i));

    const dataContainer = createDataContainer(cols, {
      fields,
      inputDataFormat: DataForm.COLS_ARRAY
    });
    return dataContainer;
  }, [result, fields]);

  const columns = useMemo(() => fields.map(f => f.name), [fields]);
  const colMeta = useMemo(
    () =>
      fields.reduce(
        (acc, {name, displayName, type, displayFormat}, colIdx) => ({
          ...acc,
          [name]: {
            // because '' || 'aaa' = 'aaa'
            name: displayName !== undefined ? displayName : name,
            displayName,
            displayFormat,
            type,
            colIdx
          }
        }),
        {}
      ),
    [fields]
  );
  const copyTableColumn = useCallback(
    column => {
      const {colIdx, type} = colMeta[column];
      const text = dataContainer
        .mapIndex(row => parseFieldValue(dataContainer.valueAt(row.index, colIdx), type))
        .join('\n');
      navigator?.clipboard.writeText(text);
    },
    [colMeta, dataContainer]
  );
  const pinTableColumn = useCallback(
    column =>
      pinnedColumns.includes(column)
        ? setPinnedColumns(pinnedColumns.filter(c => c !== column))
        : setPinnedColumns([...pinnedColumns, column]),
    [pinnedColumns]
  );

  // TODO Potentially costly operation for non row based data containers. Revisit sorting below.
  const dataTableStyle = useMemo(
    () => ({
      minCellSize,
      cellPadding,
      optionsButton:
        theme.fieldTokenWidth + theme.fieldTokenRightMargin + optionButtonWidth + pinButton,
      fontSize: theme.cellFontSize,
      font: theme.fontFamily
    }),
    [theme]
  );
  const cellSizeCache = useMemo(() => {
    return columns.reduce((acc, column) => {
      const {colIdx, displayName, type} = colMeta[column];
      return {
        ...acc,
        [column]: renderedSize({
          text: {
            dataContainer,
            column: displayName
          },
          colIdx,
          type,
          numRowsToCalculate: rowsToCalculatePreview,
          ...dataTableStyle
        })
      };
    }, {});
  }, [columns, colMeta, dataContainer, rowsToCalculatePreview, dataTableStyle]);

  return (
    <DataTable
      colMeta={colMeta}
      columns={columns}
      cellSizeCache={cellSizeCache}
      dataContainer={dataContainer}
      pinnedColumns={pinnedColumns}
      copyTableColumn={copyTableColumn}
      pinTableColumn={pinTableColumn}
    />
  );
};

export const PreviewDataPanel = withTheme(
  PreviewDataPanelWOTheme
) as React.FC<PreviewDataPanelProps>;
