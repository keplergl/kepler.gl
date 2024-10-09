// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {FormattedMessage} from '@kepler.gl/localization';
import styled from 'styled-components';
import {DatasetSquare, Tooltip} from '../..';
import {UpdateTableColorTypes} from './types';
import {RGBColor} from '@kepler.gl/types';
import {VisStateActions, ActionHandler} from '@kepler.gl/actions';

function nop() {
  return;
}

const DatasetTagWrapper = styled.div`
  display: flex;
  color: ${props => props.theme.textColor};
  font-size: 11px;
  letter-spacing: 0.2px;
  overflow: auto;

  .dataset-color {
    flex-shrink: 0;
    margin-top: 3px;
  }

  .dataset-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const DatasetColorPicker = styled.div`
  display: flex;
`;

const UpdateTableColor = ({children, id}: UpdateTableColorTypes) => (
  <DatasetColorPicker
    className="dataset-action update-color"
    data-tip
    data-for={`update-color-${id}`}
  >
    {children}
  </DatasetColorPicker>
);

type MiniDataset = {
  id: string;
  color: RGBColor;
  label?: string;
};

export type DatasetTagProps = {
  id?: string;
  dataset: MiniDataset;
  updateTableColor?: ActionHandler<typeof VisStateActions.updateTableColor>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onClickSquare?: React.MouseEventHandler<HTMLDivElement>;
};

export default function DatasetTagFactory(): React.FC<DatasetTagProps> {
  const DatasetTag = ({
    onClick = nop,
    onClickSquare = nop,
    dataset,
    updateTableColor
  }: DatasetTagProps) => (
    <DatasetTagWrapper className="source-data-tag">
      <UpdateTableColor id={dataset.id}>
        <DatasetSquare
          className="dataset-color"
          backgroundColor={dataset.color}
          onClick={onClickSquare}
          data-tip
          data-for={`update-color-${dataset.id}`}
        />
        {updateTableColor ? (
          <Tooltip id={`update-color-${dataset.id}`} effect="solid">
            <span>
              <FormattedMessage id={'Update color'} />
            </span>
          </Tooltip>
        ) : null}
      </UpdateTableColor>
      <div className="dataset-name" title={dataset.label} onClick={onClick}>
        {dataset.label}
      </div>
    </DatasetTagWrapper>
  );

  return DatasetTag;
}
