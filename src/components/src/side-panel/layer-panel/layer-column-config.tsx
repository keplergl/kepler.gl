// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import {LayerBaseConfig} from '@kepler.gl/layers';
import {
  FieldPair,
  ColumnPairs,
  LayerColumns,
  ColumnLabels,
  EnhancedFieldPair,
  ColumnGroup
} from '@kepler.gl/types';
import {toArray} from '@kepler.gl/common-utils';

import ColumnSelectorFactory from './column-selector';
import {MinimalField} from '../../common/field-selector';
import {SidePanelSection} from '../../common/styled-components';

export type LayerColumnConfigProps<FieldOption extends MinimalField> = {
  columns: LayerColumns;
  fields: FieldOption[];
  assignColumnPairs: (key: string, pair: FieldPair) => LayerColumns;
  assignColumn: (key: string, field: FieldOption) => LayerColumns;
  updateLayerConfig: (newConfig: Partial<LayerBaseConfig>) => void;
  updateLayerType?: (newType: string) => void;
  columnPairs?: ColumnPairs | null;
  fieldPairs?: FieldPair[];
  columnLabels: ColumnLabels | null;
  columnGroups?: ColumnGroup[] | null;
  isActive: boolean;
};

/**
 * only provide suggested field pairs if there is a match,
 * otherwise the user can select a suggested field pair that will create invalid columns and a hard crash
 */
function getValidFieldPairsSuggestionsForColumn(
  enhancedFieldPairs: EnhancedFieldPair[] | null,
  columnPairs: ColumnPairs | null | undefined,
  columnKey: string
): EnhancedFieldPair[] | null {
  if (enhancedFieldPairs && columnPairs?.[columnKey]) {
    const columnPair = columnPairs[columnKey];
    const matchingFieldPairs = enhancedFieldPairs.filter(({pair}) => {
      return toArray(columnPair.fieldPairKey).some(fieldPairKey =>
        Object.prototype.hasOwnProperty.call(pair, fieldPairKey)
      );
    });
    return matchingFieldPairs.length > 0 ? matchingFieldPairs : null;
  }
  return null;
}

function columnHasValue(column?: {value?: unknown; fieldIdx?: number}): boolean {
  return Boolean(
    column && column.value != null && typeof column.fieldIdx === 'number' && column.fieldIdx > -1
  );
}

function inferActiveColumnGroup(
  columnGroups: ColumnGroup[] | null | undefined,
  columns: LayerColumns
): string | null {
  if (!columnGroups?.length) {
    return null;
  }
  // Only infer from filled columns — never fall back to the first tab, or an
  // intentional switch to an empty group (e.g. GeoJSON) gets immediately undone.
  const withValues = columnGroups.find(group =>
    group.columns.some(key => columnHasValue(columns[key]))
  );
  return withValues?.key ?? null;
}

function clearColumnKeys(columns: LayerColumns, keys: string[]): LayerColumns {
  return keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: {
        ...acc[key],
        value: null,
        fieldIdx: -1
      }
    }),
    {...columns}
  );
}

const ColumnGroupTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({theme}) => theme.panelBorderColor || theme.dropdownListBorderTop};
  margin-bottom: 8px;
  .column-group-tab {
    padding: 6px 0;
    margin: 0 10px 0 0;
    color: ${({theme}) => theme.subtextColor};
    border-bottom: 2px solid transparent;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2px;
    &.active {
      color: ${({theme}) => theme.textColorHl};
      border-bottom-color: ${({theme}) => theme.panelToggleBorderColor};
    }
    &:hover {
      cursor: pointer;
      color: ${({theme}) => theme.textColorHl};
    }
  }
`;

LayerColumnConfigFactory.deps = [ColumnSelectorFactory];

function LayerColumnConfigFactory(ColumnSelector: ReturnType<typeof ColumnSelectorFactory>) {
  const LayerColumnConfig: React.FC<LayerColumnConfigProps<MinimalField & {fieldIdx: number}>> = ({
    columnPairs,
    fieldPairs,
    columns,
    columnLabels,
    columnGroups,
    fields,
    updateLayerConfig,
    assignColumn,
    assignColumnPairs,
    isActive
  }) => {
    const enhancedFieldPairs: EnhancedFieldPair[] | null = useMemo(
      () =>
        columnPairs && fieldPairs
          ? fieldPairs.map(fp => ({
              name: fp.defaultName,
              type: 'point',
              pair: fp.pair
            }))
          : null,
      [columnPairs, fieldPairs]
    );

    const groupedColumnKeys = useMemo(() => {
      const keys = new Set<string>();
      (columnGroups || []).forEach(group => group.columns.forEach(key => keys.add(key)));
      return keys;
    }, [columnGroups]);

    const inferredGroupKey = useMemo(
      () => inferActiveColumnGroup(columnGroups, columns),
      [columnGroups, columns]
    );

    const [activeGroupKey, setActiveGroupKey] = useState<string | null>(
      () => inferredGroupKey || columnGroups?.[0]?.key || null
    );

    // Follow column values when they imply a different group (e.g. auto-config
    // fills GeoJSON). Do not snap back to Lat/Lng just because the active tab is empty.
    useEffect(() => {
      if (!inferredGroupKey || inferredGroupKey === activeGroupKey) {
        return;
      }
      const activeHasValues = Boolean(
        activeGroupKey &&
          columnGroups
            ?.find(g => g.key === activeGroupKey)
            ?.columns.some(key => columnHasValue(columns[key]))
      );
      if (!activeHasValues) {
        setActiveGroupKey(inferredGroupKey);
      }
    }, [inferredGroupKey, activeGroupKey, columnGroups, columns]);

    const onUpdateColumn = useCallback(
      (key, value) => {
        const assignedColumns =
          value && value.pair && columnPairs
            ? assignColumnPairs(key, value.pair)
            : assignColumn(key, value);

        updateLayerConfig({columns: assignedColumns});
      },
      [updateLayerConfig, columnPairs, assignColumnPairs, assignColumn]
    );

    const onSelectColumnGroup = useCallback(
      (groupKey: string) => {
        if (groupKey === activeGroupKey) {
          return;
        }
        setActiveGroupKey(groupKey);

        const otherKeys = (columnGroups || [])
          .filter(group => group.key !== groupKey)
          .flatMap(group => group.columns);

        if (!otherKeys.length) {
          return;
        }

        // Start from full layer columns (assignColumn reads/returns complete config.columns).
        const base = assignColumn(otherKeys[0], null as any);
        const remaining = otherKeys.slice(1);
        updateLayerConfig({
          columns: remaining.length ? clearColumnKeys(base, remaining) : base
        });
      },
      [activeGroupKey, assignColumn, columnGroups, updateLayerConfig]
    );

    const visibleColumnKeys = useMemo(() => {
      const allKeys = Object.keys(columns);
      if (!columnGroups?.length || !activeGroupKey) {
        return allKeys;
      }
      const activeGroup = columnGroups.find(group => group.key === activeGroupKey);
      const activeKeys = (activeGroup?.columns || []).filter(key => key in columns);
      const rest = allKeys.filter(key => !groupedColumnKeys.has(key));
      // Position group first, then attribute columns.
      return [...activeKeys, ...rest];
    }, [columns, columnGroups, activeGroupKey, groupedColumnKeys]);

    if (!Object.keys(columns).length) {
      return <div />;
    }

    return (
      <div>
        {columnGroups && columnGroups.length > 1 ? (
          <ColumnGroupTabs className="layer-config__column-groups">
            {columnGroups.map(group => (
              <div
                key={group.key}
                className={classnames('column-group-tab', {
                  active: group.key === activeGroupKey
                })}
                onClick={() => onSelectColumnGroup(group.key)}
              >
                {group.label}
              </div>
            ))}
          </ColumnGroupTabs>
        ) : null}
        <SidePanelSection>
          <div className="layer-config__column">
            {visibleColumnKeys.map(key => (
              <ColumnSelector
                column={columns[key]}
                columns={columns}
                label={(columnLabels && columnLabels[key]) || key}
                key={key}
                allFields={fields}
                fieldPairs={getValidFieldPairsSuggestionsForColumn(
                  enhancedFieldPairs,
                  columnPairs,
                  key
                )}
                onSelect={val => onUpdateColumn(key, val)}
                isActive={isActive}
              />
            ))}
          </div>
        </SidePanelSection>
      </div>
    );
  };

  return LayerColumnConfig;
}

export default LayerColumnConfigFactory;
