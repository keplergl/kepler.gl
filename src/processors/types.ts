import {Field} from 'utils/table-utils/kepler-table';

export type FileCacheItem = {
  data: any;
  info: {
    id?: string;
    label: string;
    format: string;
  };
};

export type RowData = {
  [key: string]: string | null;
}[];

export type ProcessorResult = {fields: Field[]; rows: any[][]} | null;
