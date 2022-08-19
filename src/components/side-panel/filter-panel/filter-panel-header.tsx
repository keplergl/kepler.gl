// Copyright (c) 2022 Uber Technologies, Inc.
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

import React, {ComponentType} from 'react';
import styled from 'styled-components';
import PanelHeaderActionFactory from 'components/side-panel/panel-header-action';
import {Trash} from 'components/common/icons';
import {createLinearGradient} from '@kepler.gl/utils';
import {StyledPanelHeader, StyledPanelHeaderProps} from 'components/common/styled-components';
import {RGBColor, Filter} from '@kepler.gl/types';
import KeplerTable from 'reducers/table-utils/kepler-table';

interface StyledFilterHeaderProps extends StyledPanelHeaderProps {
  $labelRCGColorValues: RGBColor[];
}

export const StyledFilterHeader = styled(StyledPanelHeader)<StyledFilterHeaderProps>`
  cursor: pointer;
  padding: 10px 12px;

  .field-selector {
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
`;

type FilterPanelHeaderProps = {
  children: React.ReactNode;
  datasets: KeplerTable[];
  filter: Filter;
  removeFilter: () => void;
  actionIcons?: Record<string, ComponentType>;
};

FilterPanelHeaderFactory.deps = [PanelHeaderActionFactory];

function FilterPanelHeaderFactory(
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>
): React.ComponentType<FilterPanelHeaderProps> {
  const defaultActionIcons = {
    delete: Trash
  };
  const FilterPanelHeader = ({
    children,
    datasets,
    filter,
    removeFilter,
    actionIcons = defaultActionIcons
  }: FilterPanelHeaderProps) => (
    <StyledFilterHeader
      className="filter-panel__header"
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
