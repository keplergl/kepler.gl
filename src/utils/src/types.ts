import {Field} from './table-utils/kepler-table';

export type RowData = {
  [key: string]: string | null;
}[];

export type ProcessorResult = {fields: Field[]; rows: any[][]} | null;
