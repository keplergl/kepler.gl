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

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';

import {ColumnPairs, LayerColumns, LayerBaseConfig} from '@kepler.gl/layers';
import {FormattedMessage} from '@kepler.gl/localization';
import {FieldPair, Field} from '@kepler.gl/types';
import {toArray} from '@kepler.gl/utils';

import ColumnSelectorFactory from './column-selector';
import {MinimalField} from '../../common/field-selector';
import {PanelLabel, SidePanelSection} from '../../common/styled-components';

export type LayerColumnConfigProps<FieldOption extends MinimalField> = {
  columns: LayerColumns;
  fields: FieldOption[];
  assignColumnPairs: (key: string, pair: string) => LayerColumns;
  assignColumn: (key: string, field: FieldOption) => LayerColumns;
  updateLayerConfig: (newConfig: Partial<LayerBaseConfig>) => void;
  columnPairs?: ColumnPairs | null;
  fieldPairs?: FieldPair[];
  columnLabels?: Record<string, string>;
};

export type EnhancedFieldPair = {
  name: string;
  type: 'point';
  pair: FieldPair['pair'];
};

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

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
        pair.hasOwnProperty(fieldPairKey)
      );
    });
    return matchingFieldPairs.length > 0 ? matchingFieldPairs : null;
  } else {
    return null;
  }
}

LayerColumnConfigFactory.deps = [ColumnSelectorFactory];

function LayerColumnConfigFactory(ColumnSelector: ReturnType<typeof ColumnSelectorFactory>) {
  const LayerColumnConfig: React.FC<LayerColumnConfigProps<Field>> = ({
    columnPairs,
    fieldPairs,
    columns,
    columnLabels,
    fields,
    updateLayerConfig,
    assignColumn,
    assignColumnPairs
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
            <TopRow>
              <PanelLabel>
                <FormattedMessage id={'columns.title'} />
              </PanelLabel>
              <PanelLabel>
                <FormattedMessage id="layer.required" />
              </PanelLabel>
            </TopRow>
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
