// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {DatasetType} from '@kepler.gl/constants';
import {getApplicationConfig} from '@kepler.gl/utils';
import {isTabularDatasetForOps} from '@kepler.gl/table';
import {
  VisStateActions,
  ActionHandler,
  openDeleteModal,
  openReplaceDatasetModal
} from '@kepler.gl/actions';

import {
  Clock,
  Edit,
  Grouping,
  Join,
  Overflow,
  Replace,
  SpatialJoin,
  Suitability,
  Trash
} from '../../common/icons';
import {Tooltip} from '../../common/styled-components';
import Portaled from '../../common/portaled';
import {
  ContextMenuAction,
  ContextMenuAnchor,
  ContextMenuList,
  ContextMenuToggle
} from '../../common/context-menu';

const DatasetMenuToggle = styled(ContextMenuToggle).attrs({as: 'button', type: 'button'})`
  padding: 0;
  border: 0;
  background: transparent;
`;

export type DatasetOpsMenuProps = {
  datasetId: string;
  dataset: {
    type?: string;
    disableDataOperation?: boolean;
    metadata?: {derivedDataset?: unknown};
  };
  addGroupBy?: ActionHandler<typeof VisStateActions.addGroupBy>;
  addJoin?: ActionHandler<typeof VisStateActions.addJoin>;
  addSpatialJoin?: ActionHandler<typeof VisStateActions.addSpatialJoin>;
  addSuitability?: ActionHandler<typeof VisStateActions.addSuitability>;
  replaceDataset?: ActionHandler<typeof openReplaceDatasetModal>;
  showDeleteDataset?: boolean;
  removeDataset?: ActionHandler<typeof openDeleteModal>;
  onToggleRefreshSettings?: () => void;
  refreshSettingsOpen?: boolean;
  onRename?: () => void;
  toggleRef?: React.Ref<HTMLButtonElement>;
};

export function DatasetOpsMenu({
  datasetId,
  dataset,
  addGroupBy,
  addJoin,
  addSpatialJoin,
  addSuitability,
  replaceDataset,
  showDeleteDataset,
  removeDataset,
  onToggleRefreshSettings,
  refreshSettingsOpen,
  onRename,
  toggleRef
}: DatasetOpsMenuProps) {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const opsEnabled = getApplicationConfig().enableDatasetOps !== false;
  const tabular = isTabularDatasetForOps(dataset);
  const showReplace =
    opsEnabled && Boolean(replaceDataset) && tabular && !dataset.metadata?.derivedDataset;
  const showOps =
    opsEnabled && tabular && Boolean(addGroupBy || addJoin || addSpatialJoin || addSuitability);
  const showRemove = Boolean(showDeleteDataset && removeDataset);
  const showRefresh =
    dataset.type === DatasetType.EXTERNALLY_HOSTED && Boolean(onToggleRefreshSettings);
  const tooltipId = `dataset-ops-${datasetId}`;
  const tooltipLabel = intl.formatMessage({id: 'datasetTitle.moreSettings'});

  const onSelect = useCallback(
    (fn?: (id: string) => void) => {
      fn?.(datasetId);
      setOpen(false);
    },
    [datasetId]
  );

  if (!showOps && !showReplace && !showRemove && !showRefresh && !onRename) {
    return null;
  }

  const opItems: ContextMenuAction[] = [];
  if (onRename) {
    opItems.push({
      className: 'dataset-ops-menu__rename',
      labelId: 'datasetTitle.rename',
      Icon: Edit,
      iconHeight: '16px',
      onClick: () => onSelect(onRename)
    });
  }
  if (showRefresh && onToggleRefreshSettings) {
    opItems.push({
      className: 'dataset-ops-menu__refresh-settings',
      labelId: 'datasetTitle.refreshSettings',
      Icon: Clock,
      iconHeight: '16px',
      active: refreshSettingsOpen,
      onClick: () => {
        onToggleRefreshSettings();
        setOpen(false);
      }
    });
  }
  if (showReplace && replaceDataset) {
    opItems.push({
      className: 'dataset-ops-menu__replace',
      labelId: 'datasetOps.replace',
      Icon: Replace,
      iconHeight: '16px',
      onClick: () => onSelect(replaceDataset)
    });
  }
  if (showOps && addGroupBy) {
    opItems.push({
      className: 'dataset-ops-menu__group-by',
      labelId: 'datasetOps.groupBy',
      Icon: Grouping,
      iconHeight: '18px',
      onClick: () => onSelect(addGroupBy)
    });
  }
  if (showOps && addJoin) {
    opItems.push({
      className: 'dataset-ops-menu__join',
      labelId: 'datasetOps.join',
      Icon: Join,
      iconHeight: '14px',
      onClick: () => onSelect(() => addJoin(datasetId))
    });
  }
  if (showOps && addSpatialJoin) {
    opItems.push({
      className: 'dataset-ops-menu__spatial-join',
      labelId: 'datasetOps.spatialJoin',
      Icon: SpatialJoin,
      iconHeight: '14px',
      onClick: () => onSelect(addSpatialJoin)
    });
  }
  if (showOps && addSuitability) {
    opItems.push({
      className: 'dataset-ops-menu__suitability',
      labelId: 'datasetOps.suitability',
      Icon: Suitability,
      iconHeight: '14px',
      onClick: () => onSelect(addSuitability)
    });
  }

  return (
    <>
      <DatasetMenuToggle
        ref={toggleRef}
        className="dataset-action dataset-ops-menu dataset-ops-menu__toggle"
        data-tip
        data-for={tooltipId}
        aria-expanded={open}
        aria-label={tooltipLabel}
        onClick={e => {
          e.stopPropagation();
          setOpen(value => !value);
        }}
      >
        <Overflow height="16px" />
        <Tooltip id={tooltipId} effect="solid">
          <span>
            <FormattedMessage id="datasetTitle.moreSettings" />
          </span>
        </Tooltip>
      </DatasetMenuToggle>
      <Portaled
        component={ContextMenuAnchor}
        isOpened={open}
        left={0}
        top={0}
        onClose={() => setOpen(false)}
      >
        <ContextMenuList
          items={opItems}
          footer={
            showRemove
              ? {
                  className: 'dataset-ops-menu__remove',
                  labelId: 'datasetTitle.removeDataset',
                  Icon: Trash,
                  iconHeight: '16px',
                  onClick: () => onSelect(removeDataset)
                }
              : null
          }
        />
      </Portaled>
    </>
  );
}

export default DatasetOpsMenu;
