// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useMemo} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import PanelHeaderActionFactory from '../../side-panel/panel-header-action';
import {Trash} from '../../common/icons';
import {createLinearGradient} from '@kepler.gl/utils';
import {StyledPanelHeader, StyledPanelHeaderProps} from '../../common/styled-components';
import {RGBColor, Filter, Field} from '@kepler.gl/types';
import {KeplerTable} from '@kepler.gl/table';

interface StyledFilterHeaderProps extends StyledPanelHeaderProps {
  $labelRCGColorValues: RGBColor[];
}

export const StyledFilterHeader = styled(StyledPanelHeader)<StyledFilterHeaderProps>`
  cursor: pointer;
  padding: 10px 12px;

  .field-selector {
    width: 100%;
    flex: 2;
  }

  border-left: 3px solid;
  ${props =>
    props.$labelRCGColorValues && props.$labelRCGColorValues.length > 0
      ? `border-image: ${createLinearGradient('bottom', props.$labelRCGColorValues)} 3;`
      : 'border-color: transparent;'};
`;

const StyledChildrenContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export type FilterPanelHeaderProps = {
  className?: string;
  datasets: KeplerTable[];
  filter: Filter;
  removeFilter: () => void;
  actionItems?: {
    key: string;
    tooltip: string;
    onClick: () => void;
    icon: React.ElementType;
  }[];
  actionIcons?: {
    delete: ComponentType;
  };
  allAvailableFields?: Field[];
  idx?: number;
  children: React.ReactNode;
};

FilterPanelHeaderFactory.deps = [PanelHeaderActionFactory];

function FilterPanelHeaderFactory(
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>
): React.ComponentType<FilterPanelHeaderProps> {
  const defaultActionIcons = {
    delete: Trash
  };
  const FilterPanelHeader: React.FC<FilterPanelHeaderProps> = ({
    children,
    className = '',
    datasets,
    filter,
    removeFilter,
    actionItems,
    actionIcons = defaultActionIcons
  }: FilterPanelHeaderProps) => {
    const items = useMemo(
      () =>
        actionItems ?? [
          {
            key: 'delete',
            tooltip: 'tooltip.delete',
            onClick: removeFilter,
            icon: actionIcons.delete
          }
        ],
      [removeFilter, actionIcons, actionItems]
    );
    return (
      <StyledFilterHeader
        className={classnames('filter-panel__header', className)}
        $labelRCGColorValues={datasets.map((d: KeplerTable) => d.color)}
      >
        <StyledChildrenContainer>{children}</StyledChildrenContainer>
        {items.map(item => (
          <PanelHeaderAction
            key={item.key}
            id={filter.id}
            tooltip={item.tooltip}
            tooltipType="error"
            onClick={item.onClick}
            hoverColor={'errorColor'}
            IconComponent={item.icon}
          />
        ))}
      </StyledFilterHeader>
    );
  };

  return FilterPanelHeader;
}

export default FilterPanelHeaderFactory;
