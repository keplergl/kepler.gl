// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useRef, useState} from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';

import {Table} from '@kepler.gl/layers';
import {CenterFlexbox, Tooltip} from '../../common/styled-components';
import {ArrowRight, Trash} from '../../common/icons';
import DatasetTagFactory from './dataset-tag';
import CustomPicker from '../layer-panel/custom-picker';
import {Portaled} from '../..';
import {rgbToHex} from '@kepler.gl/utils';
import {openDeleteModal, VisStateActions, ActionHandler} from '@kepler.gl/actions';
import {RGBColor} from '@kepler.gl/types';
import {StyledDatasetTitleProps, RemoveDatasetProps, ShowDataTableProps} from './types';

const StyledDatasetTitle = styled.div<StyledDatasetTitleProps>`
  color: ${props => props.theme.textColor};
  display: flex;
  align-items: flex-start;

  .source-data-arrow {
    height: 16px;
  }
  :hover {
    cursor: ${props => (props.clickable ? 'pointer' : 'auto')};

    .dataset-name {
      color: ${props => (props.clickable ? props.theme.textColorHl : props.theme.textColor)};
    }

    .dataset-action {
      color: ${props => props.theme.textColor};
      opacity: 1;
    }

    .dataset-action:hover {
      color: ${props => props.theme.textColorHl};
    }
  }
`;

const DataTagAction = styled.div`
  margin-left: 12px;
  height: 16px;
  opacity: 0;
`;

type MiniDataset = {
  id: string;
  color: RGBColor;
  label?: string;
};

export type DatasetTitleProps = {
  dataset: MiniDataset;
  showDeleteDataset: boolean;
  onTitleClick?: () => void;
  showDatasetTable?: ActionHandler<typeof VisStateActions.showDatasetTable>;
  updateTableColor: ActionHandler<typeof VisStateActions.updateTableColor>;
  removeDataset?: ActionHandler<typeof openDeleteModal>;
};

const ShowDataTable = ({id, showDatasetTable}: ShowDataTableProps) => (
  <DataTagAction className="dataset-action show-data-table" data-tip data-for={`data-table-${id}`}>
    <Table
      height="16px"
      onClick={e => {
        e.stopPropagation();
        showDatasetTable?.(id);
      }}
    />
    <Tooltip id={`data-table-${id}`} effect="solid">
      <span>
        <FormattedMessage id={'datasetTitle.showDataTable'} />
      </span>
    </Tooltip>
  </DataTagAction>
);

const RemoveDataset = ({datasetKey, removeDataset}: RemoveDatasetProps) => (
  <DataTagAction
    className="dataset-action remove-dataset"
    data-tip
    data-for={`delete-${datasetKey}`}
  >
    <Trash
      height="16px"
      onClick={e => {
        e.stopPropagation();
        removeDataset?.(datasetKey);
      }}
    />
    <Tooltip id={`delete-${datasetKey}`} effect="solid" type="error">
      <span>
        <FormattedMessage id={'datasetTitle.removeDataset'} />
      </span>
    </Tooltip>
  </DataTagAction>
);

DatasetTitleFactory.deps = [DatasetTagFactory];

export default function DatasetTitleFactory(
  DatasetTag: ReturnType<typeof DatasetTagFactory>
): React.FC<DatasetTitleProps> {
  const DatasetTitle: React.FC<DatasetTitleProps> = ({
    showDatasetTable,
    showDeleteDataset,
    onTitleClick,
    removeDataset,
    dataset,
    updateTableColor
  }) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const root = useRef(null);
    const datasetId = dataset.id;
    const _handleClick = useCallback(() => {
      setDisplayColorPicker(!displayColorPicker);
    }, [setDisplayColorPicker, displayColorPicker]);

    const _handleClosePicker = useCallback(() => {
      setDisplayColorPicker(false);
    }, [setDisplayColorPicker]);
    const _handleCustomPicker = useCallback(
      (color: {rgb: Record<string, number>}) => {
        updateTableColor(datasetId, [color.rgb.r, color.rgb.g, color.rgb.b]);
      },
      [updateTableColor, datasetId]
    );

    const _onClickTitle = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (typeof onTitleClick === 'function') {
          onTitleClick();
        } else if (typeof showDatasetTable === 'function') {
          showDatasetTable(datasetId);
        }
      },
      [onTitleClick, showDatasetTable, datasetId]
    );

    return (
      <div className="custom-palette-panel" ref={root}>
        <StyledDatasetTitle
          className="source-data-title"
          clickable={Boolean(showDatasetTable || onTitleClick)}
        >
          <DatasetTag
            dataset={dataset}
            onClick={_onClickTitle}
            updateTableColor={updateTableColor}
            onClickSquare={_handleClick}
          />
          <Portaled
            isOpened={displayColorPicker !== false}
            left={110}
            top={-50}
            onClose={_handleClosePicker}
          >
            <CustomPicker
              color={rgbToHex(dataset.color)}
              onChange={_handleCustomPicker}
              onSwatchClose={_handleClosePicker}
            />
          </Portaled>
          {showDatasetTable ? (
            <CenterFlexbox className="source-data-arrow">
              <ArrowRight height="12px" />
            </CenterFlexbox>
          ) : null}
          {showDatasetTable ? (
            <ShowDataTable id={datasetId} showDatasetTable={showDatasetTable} />
          ) : null}
          {showDeleteDataset ? (
            <RemoveDataset datasetKey={datasetId} removeDataset={removeDataset} />
          ) : null}
        </StyledDatasetTitle>
      </div>
    );
  };

  return DatasetTitle;
}
