import React, {MouseEvent} from 'react';
import KeplerTable from 'utils/table-utils/kepler-table';
import {openDeleteModal, VisStateActions, ActionHandler} from '@kepler.gl/actions';
import {Datasets} from 'reducers';

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
  updateTableColor?: ActionHandler<typeof VisStateActions.updateTableColor>;
  onClick?: (e: MouseEvent) => void;
  onClickSquare?: (e: MouseEvent) => void;
};

export type ShowDataTableProps = {
  id: string;
  showDatasetTable?: ActionHandler<typeof VisStateActions.showDatasetTable>;
};

export type RemoveDatasetProps = {
  datasetKey: string;
  removeDataset?: ActionHandler<typeof openDeleteModal>;
};

export type StyledDatasetTitleProps = {
  clickable: boolean;
};

export type DatasetTitleProps = {
  dataset: KeplerTable;
  showDeleteDataset: boolean;
  onTitleClick?: () => void;
  showDatasetTable?: ActionHandler<typeof VisStateActions.showDatasetTable>;
  updateTableColor: ActionHandler<typeof VisStateActions.updateTableColor>;
  removeDataset?: ActionHandler<typeof openDeleteModal>;
};

export type SourceDataCatalogProps = {
  datasets: Datasets;
  showDeleteDataset?: boolean;
  onTitleClick?: () => void;
  showDatasetTable?: ActionHandler<typeof VisStateActions.showDatasetTable>;
  updateTableColor: ActionHandler<typeof VisStateActions.updateTableColor>;
  removeDataset?: ActionHandler<typeof openDeleteModal>;
};

export type DatasetItemProps = {
  value: KeplerTable;
};

export type SourceDataSelectorProps = {
  dataId: string | string[] | null;
  datasets: Datasets;
  disabled: boolean;
  defaultValue?: string;
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
