// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';

import {LayerBaseConfig} from '@kepler.gl/layers';
import {
  FieldPair,
  ColumnPairs,
  LayerColumns,
  ColumnLabels,
  EnhancedFieldPair
} from '@kepler.gl/types';
import {toArray} from '@kepler.gl/utils';

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

LayerColumnConfigFactory.deps = [ColumnSelectorFactory];

function LayerColumnConfigFactory(ColumnSelector: ReturnType<typeof ColumnSelectorFactory>) {
  const LayerColumnConfig: React.FC<LayerColumnConfigProps<MinimalField & {fieldIdx: number}>> = ({
    columnPairs,
    fieldPairs,
    columns,
    columnLabels,
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

    if (!Object.keys(columns).length) {
      // don't render if columns is empty
      return <div />;
    }

    return (
      <div>
        <SidePanelSection>
          <div className="layer-config__column">
            {Object.keys(columns).map(key => (
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
