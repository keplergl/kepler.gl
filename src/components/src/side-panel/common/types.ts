import React from 'react';
import {openDeleteModal, VisStateActions, ActionHandler} from '@kepler.gl/actions';
import {RGBColor} from '@kepler.gl/types';
import KeplerTable, {Datasets} from '@kepler.gl/table';

type MiniDataset = {
  id: string;
  color: RGBColor;
  label?: string;
};

export type PanelMeta = {
  id: string;
  label: string;
  iconComponent: React.ElementType;
  onClick: null;
};

export type DatasetInfoProps = {
  dataset: KeplerTable;
};

export type UpdateTableColorTypes = {
  id: string;
  children: React.ReactNode;
};

export type DatasetTagProps = {
  id?: string;
  dataset: MiniDataset;
  updateTableColor?: ActionHandler<typeof VisStateActions.updateTableColor>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onClickSquare?: React.MouseEventHandler<HTMLDivElement>;
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

export type SelectableDataset = {
  label?: string;
  id: string;
  color: RGBColor;
};

export type SourceDataSelectorProps = {
  dataId: string | string[] | null;
  datasets: {[id: string]: SelectableDataset};
  disabled?: boolean;
  defaultValue?: string;
  inputTheme?: string;
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
