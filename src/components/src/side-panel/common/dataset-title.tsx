// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useRef, useState} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';

import {Table} from '@kepler.gl/layers';
import {Tooltip} from '../../common/styled-components';
import {Clock, WarningSign} from '../../common/icons';
import {DatasetType} from '@kepler.gl/constants';
import DatasetTagFactory from './dataset-tag';
import CustomPicker from '../layer-panel/custom-picker';
import {Portaled} from '../..';
import {rgbToHex} from '@kepler.gl/utils';
import {
  openDeleteModal,
  openReplaceDatasetModal,
  VisStateActions,
  ActionHandler
} from '@kepler.gl/actions';
import {RGBColor} from '@kepler.gl/types';
import {StyledDatasetTitleProps, ShowDataTableProps} from './types';
import DatasetOpsMenu from '../dataset-ops/dataset-ops-menu';

const StyledDatasetTitle = styled.div<StyledDatasetTitleProps>`
  color: ${props => props.theme.textColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  .source-data-tag {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .dataset-action {
    color: ${props => props.theme.panelHeaderIcon};
  }

  &:hover {
    cursor: ${props => (props.$clickable ? 'pointer' : 'auto')};

    .dataset-name {
      color: ${props => (props.$clickable ? props.theme.textColorHl : props.theme.textColor)};
    }

    .dataset-action {
      opacity: 1;
    }

    .dataset-action:hover {
      color: ${props => props.theme.panelHeaderIconHover};
    }
  }
`;

const DatasetTitleHeader = styled.div<{$clickable?: boolean}>`
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
  overflow: hidden;
  cursor: ${props => (props.$clickable ? 'pointer' : 'auto')};
`;

const DatasetAction = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  position: relative;
`;

const DataTagAction = styled.div<{$alwaysVisible?: boolean}>`
  margin-left: 8px;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: ${props => (props.$alwaysVisible ? 1 : 0)};
`;

const DataTagActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  width: 16px;
  height: 16px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  opacity: 0;

  &:focus-visible {
    opacity: 1;
    outline: 1px solid ${props => props.theme.textColorHl};
    outline-offset: 1px;
  }
`;

const StyledRefreshError = styled.div`
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  height: 16px;
  flex-shrink: 0;
`;

type MiniDataset = {
  id: string;
  color: RGBColor;
  label?: string;
  disableDataOperation?: boolean;
  type?: string;
  metadata?: {
    refreshError?: string;
    derivedDataset?: unknown;
  };
};

export type DatasetTitleProps = {
  dataset: MiniDataset;
  showDeleteDataset: boolean;
  onTitleClick?: () => void;
  showDatasetTable?: ActionHandler<typeof VisStateActions.showDatasetTable>;
  updateTableColor: ActionHandler<typeof VisStateActions.updateTableColor>;
  removeDataset?: ActionHandler<typeof openDeleteModal>;
  onToggleRefreshSettings?: () => void;
  addGroupBy?: ActionHandler<typeof VisStateActions.addGroupBy>;
  addJoin?: ActionHandler<typeof VisStateActions.addJoin>;
  addSpatialJoin?: ActionHandler<typeof VisStateActions.addSpatialJoin>;
  replaceDataset?: ActionHandler<typeof openReplaceDatasetModal>;
};

const ShowDataTable = ({id, showDatasetTable}: ShowDataTableProps) => (
  <DataTagAction
    $alwaysVisible
    className="dataset-action show-data-table"
    data-tip
    data-for={`data-table-${id}`}
  >
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

const RefreshDatasetSettings = ({id, onToggle}: {id: string; onToggle?: () => void}) => {
  const intl = useIntl();
  return (
    <DataTagActionButton
      type="button"
      className="dataset-action refresh-dataset-settings"
      data-tip
      data-for={`refresh-settings-${id}`}
      aria-label={intl.formatMessage({id: 'datasetTitle.refreshSettings'})}
      onClick={e => {
        e.stopPropagation();
        onToggle?.();
      }}
    >
      <Clock height="16px" />
      <Tooltip id={`refresh-settings-${id}`} effect="solid">
        <span>
          <FormattedMessage id={'datasetTitle.refreshSettings'} />
        </span>
      </Tooltip>
    </DataTagActionButton>
  );
};

const RefreshErrorIcon = ({id, message}: {id: string; message: string}) => (
  <StyledRefreshError
    className="dataset-refresh-error"
    data-tip
    data-for={`refresh-error-${id}`}
    onClick={e => e.stopPropagation()}
    role="img"
    aria-label={message}
  >
    <WarningSign height="14px" />
    <Tooltip id={`refresh-error-${id}`} type="error" effect="solid">
      <span>
        <FormattedMessage id="datasetTitle.refreshFailed" />
        {': '}
        {message}
      </span>
    </Tooltip>
  </StyledRefreshError>
);

const DatasetTitleRoot = styled.div`
  min-width: 0;
  overflow: hidden;
`;

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
    updateTableColor,
    onToggleRefreshSettings,
    addGroupBy,
    addJoin,
    addSpatialJoin,
    replaceDataset
  }) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const root = useRef(null);
    const datasetId = dataset.id;
    const _handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        setDisplayColorPicker(!displayColorPicker);
      },
      [setDisplayColorPicker, displayColorPicker]
    );

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
          if (dataset.disableDataOperation) return;
          showDatasetTable(datasetId);
        }
      },
      [onTitleClick, showDatasetTable, datasetId, dataset.disableDataOperation]
    );

    const isRemote = dataset.type === DatasetType.EXTERNALLY_HOSTED;
    const refreshError = dataset.metadata?.refreshError;

    return (
      <DatasetTitleRoot className="custom-palette-panel" ref={root}>
        <StyledDatasetTitle
          className="source-data-title"
          $clickable={Boolean(showDatasetTable || onTitleClick)}
        >
          <DatasetTitleHeader $clickable={Boolean(showDatasetTable || onTitleClick)}>
            <DatasetTag
              dataset={dataset}
              onClick={_onClickTitle}
              updateTableColor={updateTableColor}
              onClickSquare={_handleClick}
            />
            {refreshError ? <RefreshErrorIcon id={datasetId} message={refreshError} /> : null}
          </DatasetTitleHeader>
          <Portaled
            isOpened={displayColorPicker !== false}
            left={110}
            top={-50}
            onClose={_handleClosePicker}
          >
            <div onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
              <CustomPicker color={rgbToHex(dataset.color)} onChange={_handleCustomPicker} />
            </div>
          </Portaled>
          <DatasetAction>
            {showDatasetTable && !dataset.disableDataOperation ? (
              <ShowDataTable id={datasetId} showDatasetTable={showDatasetTable} />
            ) : null}
            <DatasetOpsMenu
              datasetId={datasetId}
              dataset={dataset}
              addGroupBy={addGroupBy}
              addJoin={addJoin}
              addSpatialJoin={addSpatialJoin}
              replaceDataset={replaceDataset}
              showDeleteDataset={showDeleteDataset}
              removeDataset={removeDataset}
            />
            {onToggleRefreshSettings && isRemote ? (
              <RefreshDatasetSettings id={datasetId} onToggle={onToggleRefreshSettings} />
            ) : null}
          </DatasetAction>
        </StyledDatasetTitle>
      </DatasetTitleRoot>
    );
  };

  return DatasetTitle;
}
