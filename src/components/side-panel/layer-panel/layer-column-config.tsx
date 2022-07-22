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

import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {PanelLabel, SidePanelSection} from 'components/common/styled-components';
import ColumnSelectorFactory from './column-selector';
import {ColumnPairs, Layer, LayerColumns, LayerBaseConfig} from '@kepler.gl/layers';
import {Field, FieldPair} from 'utils/table-utils/kepler-table';

type LayerColumnConfigProps = {
  columnPairs?: ColumnPairs | null;
  fieldPairs?: FieldPair[];
  columns: LayerColumns;
  columnLabels?: Record<string, string>;
  fields: Field[];
  updateLayerConfig: (newConfig: Partial<LayerBaseConfig>) => void;
  assignColumn: Layer['assignColumn'];
  assignColumnPairs: Layer['assignColumnPairs'];
};

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

LayerColumnConfigFactory.deps = [ColumnSelectorFactory];

function LayerColumnConfigFactory(ColumnSelector: ReturnType<typeof ColumnSelectorFactory>) {
  const LayerColumnConfig: React.FC<LayerColumnConfigProps> = ({
    columnPairs,
    fieldPairs,
    columns,
    columnLabels,
    fields,
    updateLayerConfig,
    assignColumn,
    assignColumnPairs
  }) => {
    const enhancedFieldPairs = useMemo(
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
                fieldPairs={enhancedFieldPairs}
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
