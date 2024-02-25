// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType} from 'react';
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
    actionIcons = defaultActionIcons
  }: FilterPanelHeaderProps) => (
    <StyledFilterHeader
      className={classnames('filter-panel__header', className)}
      $labelRCGColorValues={datasets.map((d: KeplerTable) => d.color)}
    >
      <StyledChildrenContainer>{children}</StyledChildrenContainer>
      <PanelHeaderAction
        id={filter.id}
        tooltip="tooltip.delete"
        tooltipType="error"
        onClick={removeFilter}
        hoverColor={'errorColor'}
        IconComponent={actionIcons.delete}
      />
    </StyledFilterHeader>
  );

  return FilterPanelHeader;
}

export default FilterPanelHeaderFactory;
