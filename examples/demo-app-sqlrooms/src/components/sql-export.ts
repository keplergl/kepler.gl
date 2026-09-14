// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {Table} from 'apache-arrow';
import {valueToString} from '@sqlrooms/data-table';
import {csvFormatRows} from 'd3-dsv';

export function queryResultToCsv(table: Table): string {
  const fields = table.schema.fields;
  const columns = fields.map((_, index) => table.getChildAt(index));
  const rows = Array.from({length: table.numRows}, (_, row) =>
    fields.map((field, col) => {
      const value = columns[col]?.get(row);
      return value == null ? '' : valueToString(field.type, value);
    })
  );
  return csvFormatRows([fields.map(field => field.name), ...rows]);
}

export function downloadQueryResult(table: Table) {
  const blob = new Blob([queryResultToCsv(table)], {type: 'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'query-result.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
