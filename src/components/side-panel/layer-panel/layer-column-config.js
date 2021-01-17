// Copyright (c) 2021 Uber Technologies, Inc.
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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {FormattedMessage} from 'localization';
import {PanelLabel, SidePanelSection} from 'components/common/styled-components';
import ColumnSelectorFactory from './column-selector';

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

LayerColumnConfigFactory.deps = [ColumnSelectorFactory];

function LayerColumnConfigFactory(ColumnSelector) {
  const LayerColumnConfig = ({
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

  LayerColumnConfig.propTypes = {
    columns: PropTypes.object.isRequired,
    fields: PropTypes.arrayOf(PropTypes.any).isRequired,
    assignColumnPairs: PropTypes.func.isRequired,
    assignColumn: PropTypes.func.isRequired,
    updateLayerConfig: PropTypes.func.isRequired,
    columnPairs: PropTypes.object,
    fieldPairs: PropTypes.arrayOf(PropTypes.any),
    columnLabels: PropTypes.object
  };

  return LayerColumnConfig;
}

export default LayerColumnConfigFactory;
