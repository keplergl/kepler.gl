// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {openDeleteModal, VisStateActions, ActionHandler} from '@kepler.gl/actions';
import {RGBColor} from '@kepler.gl/types';
import KeplerTable from '@kepler.gl/table';

export type PanelMeta = {
  id: string;
  label: string;
  iconComponent: React.ElementType;
  onClick: null;
};

export type UpdateTableColorTypes = {
  id: string;
  children: React.ReactNode;
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
  className?: string;
};
