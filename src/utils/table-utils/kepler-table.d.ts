import {RGBColor, RGBAColor, Millisecond} from '../../reducers/types';

export type Field = {
  analyzerType: string;
  id?: string;
  name: string;
  format: string;
  // tableFieldIndex: number;
  type: string;
  valueAccessor(v: any[]): any;
  filterProps?: any;
};

export type GpuFilter = {
  filterRange: number[][];
  filterValueUpdateTriggers: any;
  filterValueAccessor: any;
};

export type FieldPair = {
  defaultName: string;
  pair: {
    [key: string]: {
      fieldIdx: number;
      value: string;
    };
  };
  suffix: string[];
};

export type FilterRecord = {
  dynamicDomain: Filter[];
  fixedDomain: Filter[];
  cpu: Filter[];
  gpu: Filter[];
};

export class KeplerTable {
  constructor(schema: {info?: object, data: any, color: RGBColor});
  id: string;
  label?: string;
  color: RGBColor;

  // fields and data
  fields: Field[];
  allData: any[][];

  allIndexes: number[];
  filteredIndex: number[];
  filteredIdxCPU?: number[];
  filteredIndexForDomain: number[];
  fieldPairs: FieldPair[];
  gpuFilter: GpuFilter;
  filterRecord?: FilterRecord;
  filterRecordCPU?: FilterRecord;
  changedFilters?: any;

  // table-injected metadata
  sortColumn?: {
    // column name: sorted idx
    [key: string]: string; // ASCENDING | DESCENDING | UNSORT
  };
  sortOrder?: number[] | null;

  pinnedColumns?: string[];
  // table-injected metadata
  metadata?: object;


  // methods
  getColumnField(columnName: string): Field | undefined;
  getColumnFieldIdx(columnName: string): number;
  getColumnDomain(columnName: string): any[];

  getValue(columnName: string, rowIdx: number): any;
  updateColumnField(fieldIdx: number, newField: Field): void;
}

export default KeplerTable;
