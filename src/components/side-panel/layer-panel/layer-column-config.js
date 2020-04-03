// Copyright (c) 2020 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {FormattedMessage} from 'react-intl';
import FieldSelector from 'components/common/field-selector';
import {createSelector} from 'reselect';

import {PanelLabel, SidePanelSection} from 'components/common/styled-components';

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default class LayerColumnConfig extends Component {
  static propTypes = {
    columns: PropTypes.object.isRequired,
    fields: PropTypes.arrayOf(PropTypes.any).isRequired,
    assignColumnPairs: PropTypes.func.isRequired,
    assignColumn: PropTypes.func.isRequired,
    updateLayerConfig: PropTypes.func.isRequired,
    columnPairs: PropTypes.object,
    fieldPairs: PropTypes.arrayOf(PropTypes.any),
    columnLabels: PropTypes.object
  };

  columnPairs = props => props.columnPairs;
  fieldPairs = props => props.fieldPairs;
  fieldPairsSelector = createSelector(
    this.columnPairs,
    this.fieldPairs,
    (columnPairs, fieldPairs) =>
      columnPairs
        ? fieldPairs.map(fp => ({
            name: fp.defaultName,
            type: 'point',
            pair: fp.pair
          }))
        : null
  );

  _updateColumn(key, value) {
    const {columnPairs, assignColumnPairs, assignColumn} = this.props;

    const columns =
      value && value.pair && columnPairs
        ? assignColumnPairs(key, value.pair)
        : assignColumn(key, value);

    this.props.updateLayerConfig({columns});
  }

  render() {
    const {columns, columnLabels, fields} = this.props;

    const fieldPairs = this.fieldPairsSelector(this.props);

    return (
      <div>
        <SidePanelSection>
          <div className="layer-config__column">
            <TopRow>
              <PanelLabel><FormattedMessage id={'columns.title'} /></PanelLabel>
              <PanelLabel>
                <FormattedMessage id="layer.required" />
              </PanelLabel>
            </TopRow>
            {Object.keys(columns).map(key => (
              <ColumnSelector
                column={columns[key]}
                label={(columnLabels && columnLabels[key]) || key}
                key={key}
                allFields={fields}
                fieldPairs={fieldPairs}
                onSelect={val => this._updateColumn(key, val)}
              />
            ))}
          </div>
        </SidePanelSection>
      </div>
    );
  }
}

const ColumnRow = styled.div`
  display: flex;
  margin-bottom: 8px;
  align-items: center;
`;

const ColumnName = styled.div`
  width: 30%;
`;
const ColumnSelect = styled.div`
  width: 70%;
`;

const ColumnSelector = ({column, label, allFields, onSelect, fieldPairs}) => (
  <ColumnRow className="layer-config__column__selector">
    <ColumnName className="layer-config__column__name">
      <PanelLabel>
        <FormattedMessage id={`columns.${label}`} />
      </PanelLabel>
      {!column.optional ? <PanelLabel>{`  *`}</PanelLabel> : null}
    </ColumnName>
    <ColumnSelect className="layer-config__column__select">
      <FieldSelector
        suggested={fieldPairs}
        error={!column.optional && !column.value}
        fields={allFields}
        value={column.value}
        erasable={Boolean(column.optional)}
        onSelect={onSelect}
      />
    </ColumnSelect>
  </ColumnRow>
);
