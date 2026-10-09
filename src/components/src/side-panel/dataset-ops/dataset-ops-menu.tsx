// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {getApplicationConfig} from '@kepler.gl/utils';
import {isTabularDatasetForOps} from '@kepler.gl/table';
import {
  VisStateActions,
  ActionHandler,
  openDeleteModal,
  openReplaceDatasetModal
} from '@kepler.gl/actions';

import {
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
  removeDataset
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
  const tooltipId = `dataset-ops-${datasetId}`;
  const tooltipLabel = intl.formatMessage({id: 'datasetTitle.moreSettings'});

  const onSelect = useCallback(
    (fn?: (id: string) => void) => {
      fn?.(datasetId);
      setOpen(false);
    },
    [datasetId]
  );

  if (!showOps && !showReplace && !showRemove) {
    return null;
  }

  if (!opsEnabled && showRemove) {
    const removeTooltipId = `remove-dataset-${datasetId}`;
    const removeLabel = intl.formatMessage({id: 'datasetTitle.removeDataset'});
    return (
      <ContextMenuToggle
        className="dataset-action dataset-ops-menu__remove"
        data-tip
        data-for={removeTooltipId}
        role="button"
        aria-label={removeLabel}
        onClick={e => {
          e.stopPropagation();
          removeDataset?.(datasetId);
        }}
      >
        <Trash height="16px" />
        <Tooltip id={removeTooltipId} effect="solid">
          <span>
            <FormattedMessage id="datasetTitle.removeDataset" />
          </span>
        </Tooltip>
      </ContextMenuToggle>
    );
  }

  const opItems: ContextMenuAction[] = [];
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
      <ContextMenuToggle
        className="dataset-action dataset-ops-menu dataset-ops-menu__toggle"
        data-tip
        data-for={tooltipId}
        role="button"
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
      </ContextMenuToggle>
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
