// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {getApplicationConfig} from '@kepler.gl/utils';
import {isTabularDatasetForOps} from '@kepler.gl/table';
import {VisStateActions, ActionHandler, openDeleteModal} from '@kepler.gl/actions';

import {BaseProps, Grouping, Join, Overflow, SpatialJoin, Trash} from '../../common/icons';
import {Tooltip} from '../../common/styled-components';
import Portaled from '../../common/portaled';

const MenuToggle = styled.div`
  margin-left: 8px;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

const PortalAnchor = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 16px;
  pointer-events: none;
`;

const Menu = styled.div`
  min-width: 160px;
  width: max-content;
  background: ${props => props.theme.dropdownListBgd};
  box-shadow: ${props => props.theme.tooltipBoxShadow};
  border-radius: 4px;
  overflow: hidden;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
  padding: 0 8px;
  border: 0;
  background: transparent;
  color: ${props => props.theme.textColor};
  text-align: left;
  cursor: pointer;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.dropdownListHighlightBg};
  }
`;

const MenuItemIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 6px;
  flex-shrink: 0;
  color: ${props => props.theme.subtextColor};
`;

const MenuSeparator = styled.div`
  border-top: 1px solid ${props => props.theme.dropdownListHighlightBg};
`;

type MenuAction = {
  className: string;
  labelId: string;
  Icon: React.ComponentType<Partial<BaseProps>>;
  iconHeight: string;
  onClick: () => void;
};

export type DatasetOpsMenuProps = {
  datasetId: string;
  dataset: {type?: string; disableDataOperation?: boolean};
  addGroupBy?: ActionHandler<typeof VisStateActions.addGroupBy>;
  addJoin?: ActionHandler<typeof VisStateActions.addJoin>;
  addSpatialJoin?: ActionHandler<typeof VisStateActions.addSpatialJoin>;
  showDeleteDataset?: boolean;
  removeDataset?: ActionHandler<typeof openDeleteModal>;
};

export function DatasetOpsMenu({
  datasetId,
  dataset,
  addGroupBy,
  addJoin,
  addSpatialJoin,
  showDeleteDataset,
  removeDataset
}: DatasetOpsMenuProps) {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const showOps =
    getApplicationConfig().enableDatasetOps !== false &&
    isTabularDatasetForOps(dataset) &&
    Boolean(addGroupBy || addJoin || addSpatialJoin);
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

  if (!showOps && !showRemove) {
    return null;
  }

  const opItems: MenuAction[] = [];
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

  return (
    <>
      <MenuToggle
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
      </MenuToggle>
      <Portaled
        component={PortalAnchor}
        isOpened={open}
        left={0}
        top={0}
        onClose={() => setOpen(false)}
      >
        <Menu>
          {opItems.map(item => (
            <MenuItem
              key={item.className}
              className={item.className}
              type="button"
              onClick={item.onClick}
            >
              <MenuItemIcon>
                <item.Icon height={item.iconHeight} />
              </MenuItemIcon>
              <FormattedMessage id={item.labelId} />
            </MenuItem>
          ))}
          {opItems.length > 0 && showRemove ? <MenuSeparator /> : null}
          {showRemove ? (
            <MenuItem
              className="dataset-ops-menu__remove"
              type="button"
              onClick={() => onSelect(removeDataset)}
            >
              <MenuItemIcon>
                <Trash height="16px" />
              </MenuItemIcon>
              <FormattedMessage id="datasetTitle.removeDataset" />
            </MenuItem>
          ) : null}
        </Menu>
      </Portaled>
    </>
  );
}

export default DatasetOpsMenu;
