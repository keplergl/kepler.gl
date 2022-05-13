import React, {MouseEvent} from 'react';
import {Datasets, RGBColor} from 'reducers';
import KeplerTable from 'utils/table-utils/kepler-table';

export type DatasetInfoProps = {
  dataset: KeplerTable;
};

export type UpdateTableColorTypes = {
  id: string;
  children: React.ReactNode;
};

export type DatasetTagProps = {
  id?: string;
  dataset: KeplerTable;
  updateTableColor?: (d: string, c?: RGBColor) => void;
  onClick?: (e: MouseEvent) => void;
  onClickSquare?: (e: MouseEvent) => void;
};

export type ShowDataTableProps = {
  id: string;
  showDatasetTable: (i: string) => void;
};

export type RemoveDatasetProps = {
  datasetKey: string;
  removeDataset?: (d: string) => void;
};

export type StyledDatasetTitleProps = {
  clickable: boolean;
};

export type DatasetTitleProps = {
  dataset: KeplerTable;
  showDatasetTable?: (i: string) => void;
  showDeleteDataset: boolean;
  onTitleClick?: () => void;
  updateTableColor?: (d: string, c?: RGBColor) => void;
  removeDataset?: (d: string) => void;
};

export type SourceDataCatalogProps = {
  datasets: Datasets;
  showDatasetTable?: (i: string) => void;
  showDeleteDataset?: boolean;
  onTitleClick?: () => void;
  updateTableColor?: (d: string, c?: RGBColor) => void;
  removeDataset?: (d: string) => void;
};

export type DatasetItemProps = {
  value: KeplerTable;
};

export type SourceDataSelectorProps = {
  dataId: string | string[];
  datasets: Datasets;
  disabled: boolean;
  defaultValue?: string;
  inputTheme: string;
  onSelect: (items: ReadonlyArray<string | number | boolean | object> | null) => void;
};
