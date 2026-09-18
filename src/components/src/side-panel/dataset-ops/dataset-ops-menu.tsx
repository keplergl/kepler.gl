// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {getApplicationConfig} from '@kepler.gl/utils';
import {isTabularDatasetForOps} from '@kepler.gl/table';
import {VisStateActions, ActionHandler} from '@kepler.gl/actions';

import {VertDots} from '../../common/icons';
import Portaled from '../../common/portaled';

const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
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
  }
`;

const Menu = styled.div`
  min-width: 160px;
  background: ${props => props.theme.dropdownListBgd};
  box-shadow: ${props => props.theme.dropdownListShadow};
  border-radius: 2px;
  padding: 6px 0;
`;

const MenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: 0;
  background: transparent;
  color: ${props => props.theme.textColor};
  text-align: left;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: ${props => props.theme.dropdownListHighlightBg};
    color: ${props => props.theme.textColorHl};
  }
`;

export type DatasetOpsMenuProps = {
  datasetId: string;
  dataset: {type?: string; disableDataOperation?: boolean};
  addGroupBy?: ActionHandler<typeof VisStateActions.addGroupBy>;
  addJoin?: ActionHandler<typeof VisStateActions.addJoin>;
  addSpatialJoin?: ActionHandler<typeof VisStateActions.addSpatialJoin>;
};

export function DatasetOpsMenu({
  datasetId,
  dataset,
  addGroupBy,
  addJoin,
  addSpatialJoin
}: DatasetOpsMenuProps) {
  const [open, setOpen] = useState(false);
  const enabled =
    getApplicationConfig().enableDatasetOps !== false && isTabularDatasetForOps(dataset);

  const onSelect = useCallback(
    (fn?: (id: string) => void) => {
      fn?.(datasetId);
      setOpen(false);
    },
    [datasetId]
  );

  if (!enabled || (!addGroupBy && !addJoin && !addSpatialJoin)) {
    return null;
  }

  return (
    <span className="dataset-ops-menu">
      <MenuButton
        className="dataset-action dataset-ops-menu__toggle"
        type="button"
        aria-label="Dataset operations"
        onClick={e => {
          e.stopPropagation();
          setOpen(value => !value);
        }}
      >
        <VertDots height="14px" />
      </MenuButton>
      <Portaled isOpened={open} left={16} top={16} onClose={() => setOpen(false)}>
        <Menu>
          {addGroupBy ? (
            <MenuItem
              className="dataset-ops-menu__group-by"
              type="button"
              onClick={() => onSelect(addGroupBy)}
            >
              <FormattedMessage id="datasetOps.groupBy" />
            </MenuItem>
          ) : null}
          {addJoin ? (
            <MenuItem
              className="dataset-ops-menu__join"
              type="button"
              onClick={() => onSelect(() => addJoin(datasetId))}
            >
              <FormattedMessage id="datasetOps.join" />
            </MenuItem>
          ) : null}
          {addSpatialJoin ? (
            <MenuItem
              className="dataset-ops-menu__spatial-join"
              type="button"
              onClick={() => onSelect(addSpatialJoin)}
            >
              <FormattedMessage id="datasetOps.spatialJoin" />
            </MenuItem>
          ) : null}
        </Menu>
      </Portaled>
    </span>
  );
}

export default DatasetOpsMenu;
