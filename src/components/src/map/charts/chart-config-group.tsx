// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {FormattedMessage} from '@kepler.gl/localization';

import {ArrowDownSmall, ArrowRight} from '../../common/icons';
import {StyledConfigGroupHeader} from '../../side-panel/layer-panel/layer-config-group';

export const ConfigUncollapsibleContent = styled.div.attrs({
  className: 'chart-config-group__content__uncollapsible'
})``;

export const ChartConfigSection = styled.div`
  margin-bottom: 6px;
`;

/**
 * Compact label | control rows, matching Studio chart settings density.
 */
export const ChartConfigSectionWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(72px, 40%) 1fr;
  align-items: center;
  row-gap: 4px;
  column-gap: 6px;
  margin-bottom: 4px;

  .item-selector {
    height: 28px;
  }
  .item-selector__dropdown {
    height: 26px;
  }
  .side-panel-panel__label {
    line-height: 16px;
    margin-bottom: 0;
  }
  .side-panel-section {
    margin-bottom: 0;
  }
  input {
    height: 28px;
  }
`;

const StyledChartConfigGroup = styled.div`
  padding-left: 14px;
  margin-bottom: 10px;
  cursor: auto;
  position: relative;

  .layer-config-group__header {
    margin-bottom: 4px;
  }

  &.disabled {
    opacity: 0.3;
    pointer-events: none;
  }

  &.collapsed {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 0;
    min-height: 28px;

    .layer-config-group__header {
      margin-bottom: 0;
      /* Fixed label column so right-side controls share one start edge. */
      flex: 0 0 80px;
      width: 80px;
      max-width: 80px;
    }

    .chart-config-group__label {
      width: 100%;
    }

    .chart-config-group__label span {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chart-config-group__content {
      flex: 1 1 auto;
      min-width: 0;

      & > *:not(.chart-config-group__content__uncollapsible) {
        overflow: hidden;
        max-height: 0;
        margin: 0;
        padding: 0;
        border: 0;
      }

      .chart-config-group__content__uncollapsible {
        width: 100%;
      }

      .chart-config-group__content__uncollapsible > * {
        margin-bottom: 0;
        width: 100%;
      }
    }
  }
`;

const ConfigGroupContent = styled.div`
  &.disabled {
    opacity: 0.3;
    pointer-events: none;
    * {
      pointer-events: none;
    }
  }
`;

const StyledChartConfigGroupLabel = styled.div`
  line-height: 12px;
  height: 28px;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;

  .chart-config-group__label__prefix {
    position: absolute;
    display: flex;
    align-items: center;
    left: -16px;

    svg {
      color: ${props => props.theme.textColor};
    }
  }

  span {
    color: ${props => props.theme.textColor};
    font-weight: 500;
    letter-spacing: 0.2px;
    text-transform: capitalize;
    margin-left: 2px;
    font-size: 11px;
    width: 80px;
  }
`;

type ChartConfigGroupProps = {
  label: string;
  defaultMessage?: string;
  children?: React.ReactNode;
  expanded?: boolean;
  className?: string;
};

export const ChartConfigGroup: React.FC<ChartConfigGroupProps> = ({
  label,
  defaultMessage,
  children,
  className,
  expanded = false
}) => {
  const [collapsed, setCollapsed] = useState(!expanded);
  const onToggleCollapsed = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  useEffect(() => {
    setCollapsed(!expanded);
  }, [expanded]);

  return (
    <StyledChartConfigGroup className={classnames(className ?? 'chart-config-group', {collapsed})}>
      <StyledConfigGroupHeader onClick={onToggleCollapsed} collapsible>
        <StyledChartConfigGroupLabel className="chart-config-group__label">
          <div className="chart-config-group__label__prefix">
            {collapsed ? <ArrowRight height="12px" /> : <ArrowDownSmall height="12px" />}
          </div>
          <span>
            <FormattedMessage id={label} defaultMessage={defaultMessage || label} />
          </span>
        </StyledChartConfigGroupLabel>
      </StyledConfigGroupHeader>
      <ConfigGroupContent className="chart-config-group__content">{children}</ConfigGroupContent>
    </StyledChartConfigGroup>
  );
};

export default ChartConfigGroup;
