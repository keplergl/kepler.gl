import React, {MouseEvent} from 'react';
import {Datasets} from 'reducers';
import KeplerTable from 'utils/table-utils/kepler-table';
import {openDeleteModal} from 'actions/ui-state-actions';
import * as VisStateActions from 'actions/vis-state-actions';

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
  updateTableColor?: typeof VisStateActions.updateTableColor;
  onClick?: (e: MouseEvent) => void;
  onClickSquare?: (e: MouseEvent) => void;
};

export type ShowDataTableProps = {
  id: string;
  showDatasetTable?: typeof VisStateActions.showDatasetTable;
};

export type RemoveDatasetProps = {
  datasetKey: string;
  removeDataset?: typeof openDeleteModal;
};

export type StyledDatasetTitleProps = {
  clickable: boolean;
};

export type DatasetTitleProps = {
  dataset: KeplerTable;
  showDeleteDataset: boolean;
  onTitleClick?: () => void;
  showDatasetTable?: typeof VisStateActions.showDatasetTable;
  updateTableColor: typeof VisStateActions.updateTableColor;
  removeDataset?: typeof openDeleteModal;
};

export type SourceDataCatalogProps = {
  datasets: Datasets;
  showDeleteDataset?: boolean;
  onTitleClick?: () => void;
  showDatasetTable?: typeof VisStateActions.showDatasetTable;
  updateTableColor: typeof VisStateActions.updateTableColor;
  removeDataset?: typeof openDeleteModal;
};

export type DatasetItemProps = {
  value: KeplerTable;
};

export type SourceDataSelectorProps = {
  dataId: string | string[] | null;
  // dataId: string;
  datasets: Datasets;
  disabled: boolean;
  defaultValue: string;
  inputTheme: string;
  onSelect: (
    items:
      | ReadonlyArray<string | number | boolean | object>
      | string
      | number
      | boolean
      | object
      | null
  ) => void;
};
