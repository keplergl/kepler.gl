// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {ComponentType, useMemo} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import PanelHeaderActionFactory from '../../side-panel/panel-header-action';
import {Trash} from '../../common/icons';
import {createLinearGradient} from '@kepler.gl/utils';
import {StyledPanelHeader, StyledPanelHeaderProps} from '../../common/styled-components';
import {RGBColor, Filter} from '@kepler.gl/types';
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
  flex: 2;
  width: 90%;
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
      [removeFilter, actionIcons]
    );
    return (
      <StyledFilterHeader
        className={classnames('filter-panel__header', className)}
        $labelRCGColorValues={datasets.map(d => d.color)}
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
