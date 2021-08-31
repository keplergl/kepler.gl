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

export function sortDatasetByColumn(dataset: Dataset, column: string, mode?: string): Dataset;

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
  label?: string;
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
  supportedFilterTypes?: string[];
  // table-injected metadata
  metadata?: object;

  // methods
  getColumnField(columnName: string): Field | undefined;
  getColumnFieldIdx(columnName: string): number;
  getColumnDomain(columnName: string): any[];

  getValue(columnName: string, rowIdx: number): any;
  updateColumnField(fieldIdx: number, newField: Field): void;
  getColumnFilterProps(fieldName: string): Field['filterProps'] | null | undefined;
  filterTable(filters: Filter[], layers: Layer[], opt?: FilterDatasetOpt): KeplerTable;
  filterTableCPU(filters: Filter[], layers: Layer[]): KeplerTable;
}

export default KeplerTable;
