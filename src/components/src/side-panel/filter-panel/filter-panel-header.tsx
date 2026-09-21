// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {PanelHeaderActionIcon} from '../../side-panel/panel-header-action';
import PanelHeaderActionFactory from '../../side-panel/panel-header-action';
import {CodeAlt, Trash} from '../../common/icons';
import {createLinearGradient} from '@kepler.gl/utils';
import {StyledPanelHeader, StyledPanelHeaderProps} from '../../common/styled-components';
import {RGBColor, Filter, Field} from '@kepler.gl/types';
import {KeplerTable} from '@kepler.gl/table';
import FilterJsonEditorFactory from './filter-json-editor';
import {isJsonEditorEnabled} from '../../common/json-editor-utils';

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

export type FilterPanelHeaderActionItem = {
  key: string;
  tooltip: string;
  onClick: (event?: React.MouseEvent) => void;
  icon: PanelHeaderActionIcon;
  tooltipType?: 'error' | 'dark' | 'success' | 'warning';
  hoverColor?: string;
  active?: boolean;
};

export type FilterPanelHeaderProps = {
  className?: string;
  datasets: KeplerTable[];
  filter: Filter;
  removeFilter: () => void;
  actionItems?: FilterPanelHeaderActionItem[];
  actionIcons?: {
    delete: ComponentType;
    json?: ComponentType;
  };
  allAvailableFields?: Field[];
  idx?: number;
  children: React.ReactNode;
};

FilterPanelHeaderFactory.deps = [PanelHeaderActionFactory, FilterJsonEditorFactory];

function FilterPanelHeaderFactory(
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>,
  FilterJsonEditor: ReturnType<typeof FilterJsonEditorFactory>
): React.ComponentType<FilterPanelHeaderProps> {
  const defaultActionIcons = {
    delete: Trash,
    json: CodeAlt
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
    const [isJsonEditorActive, setIsJsonEditorActive] = useState(false);
    const showJsonEditor = isJsonEditorEnabled('filter');
    const toggleJsonEditor = useCallback((event?: React.MouseEvent) => {
      event?.stopPropagation();
      setIsJsonEditorActive(active => !active);
    }, []);
    const closeJsonEditor = useCallback((event?: React.MouseEvent) => {
      event?.stopPropagation();
      setIsJsonEditorActive(false);
    }, []);

    const items: FilterPanelHeaderActionItem[] = useMemo(() => {
      const baseItems: FilterPanelHeaderActionItem[] = actionItems ?? [
        {
          key: 'delete',
          tooltip: 'tooltip.delete',
          onClick: removeFilter,
          icon: actionIcons.delete as PanelHeaderActionIcon,
          tooltipType: 'error',
          hoverColor: 'errorColor'
        }
      ];
      if (!showJsonEditor) {
        return baseItems;
      }
      return [
        {
          key: 'json',
          tooltip: 'tooltip.editFilterJson',
          onClick: toggleJsonEditor,
          icon: (actionIcons.json || CodeAlt) as PanelHeaderActionIcon,
          active: isJsonEditorActive
        },
        ...baseItems
      ];
    }, [
      removeFilter,
      actionIcons,
      actionItems,
      showJsonEditor,
      toggleJsonEditor,
      isJsonEditorActive
    ]);
    return (
      <>
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
              tooltipType={item.tooltipType}
              onClick={item.onClick}
              hoverColor={item.hoverColor}
              IconComponent={item.icon}
              active={item.active}
            />
          ))}
        </StyledFilterHeader>
        {isJsonEditorActive ? <FilterJsonEditor filter={filter} onClose={closeJsonEditor} /> : null}
      </>
    );
  };

  return FilterPanelHeader;
}

export default FilterPanelHeaderFactory;
