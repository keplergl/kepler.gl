import {RGBColor} from '../../reducers/types';
import {Layer} from 'layers';
import {Filter} from '../reducers/vis-state-updaters';
import {Dataset} from '../../reducers/vis-state-updaters';
import {DataContainerInterface} from './data-container-interface';

export type Field = {
  analyzerType: string;
  id?: string;
  name: string;
  displayName: string;
  format: string;
  type: string;
  fieldIdx: number;
  valueAccessor(v: {index: number}): any;
  filterProps?: any;
  metadata?: any;
  displayName: string;
};

export type GpuFilter = {
  filterRange: number[][];
  filterValueUpdateTriggers: any;
  filterValueAccessor: (
    dc: DataContainerInterface
  ) => (
    getIndex?: (any) => number,
    getData?: (dc: DataContainerInterface, d: any, fieldIndex: number) => any
  ) => (d: any) => number;
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

export type FilterDatasetOpt = {
  // only allow cpu filtering
  cpuOnly?: boolean;
  // ignore filter for domain calculation
  ignoreDomain?: boolean;
};

export function sortDatasetByColumn(dataset: KeplerTable, column: string, mode?: string): Dataset;

export function findPointFieldPairs(fields: Field[]): FieldPair[];

export class KeplerTable {
  readonly id: string;

  constructor(schema: {
    info?: ProtoDataset['info'];
    data: ProtoDataset['data'];
    color: RGBColor;
    metadata?: ProtoDataset['metadata'];
    supportedFilterTypes?: ProtoDataset['supportedFilterTypes'];
  });
  type?: string;
  label: string;
  color: RGBColor;

  // fields and data
  fields: Field[];

  dataContainer: DataContainerInterface;

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
  supportedFilterTypes: string[] | undefined;
  // table-injected metadata
  metadata: object;

  // methods
  getColumnField(columnName: string): Field | undefined;
  getColumnFieldIdx(columnName: string): number;
  getColumnFilterDomain(field: Field): FieldDomain;
  getColumnLayerDomain(field: Field, scaleType: string): number[] | string[] | [number, number];
  getValue(columnName: string, rowIdx: number): any;
  updateColumnField(fieldIdx: number, newField: Field): void;
  updateTableColor(newColor: RGBColor): void;
  getColumnFilterProps(fieldName: string): Field['filterProps'] | null | undefined;
  filterTable(filters: Filter[], layers: Layer[], opt?: FilterDatasetOpt): KeplerTable;
  filterTableCPU(filters: Filter[], layers: Layer[]): KeplerTable;

  // private methods
  _assetField(fieldName: string, condition: any): void;
}

export function copyTable<T extends {}>(original: T): T;
export function copyTableAndUpdate<T extends {}>(original: T, options: Partial<T>): T;
export function getFieldValueAccessor<
  F extends {
    type: Field['type'];
    format: Field['format'];
  }
>(f: F, i: number): FieldValueAccessor;
export function pinTableColumns(dataset: KeplerTable, column: string): KeplerTable;
export default KeplerTable;
