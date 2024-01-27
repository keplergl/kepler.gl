// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {PanelLabel} from '../../common/styled-components';
import FieldSelectorFactory from '../../common/field-selector';
import {validateColumn} from '@kepler.gl/reducers';
import {LayerColumn, LayerColumns} from '@kepler.gl/layers';
import {Field, FieldPair} from '@kepler.gl/types';

type Pair = {
  name: string;
  type: string;
  pair: FieldPair['pair'];
};

type ColumnSelectorProps = {
  column: LayerColumn;
  columns: LayerColumns;
  label: string;
  allFields: Field[];
  onSelect: (
    items:
      | ReadonlyArray<string | number | boolean | object>
      | string
      | number
      | boolean
      | object
      | null
  ) => void;
  fieldPairs?: Pair[] | null;
};

const ColumnRow = styled.div`
  display: flex;
  margin-bottom: 8px;
  align-items: center;
`;

const ColumnName = styled.div`
  width: 27%;
  line-height: 1.2;
  padding-right: 6px;
`;

const ColumnSelect = styled.div`
  width: 73%;
`;

ColumnSelectorFactory.deps = [FieldSelectorFactory];

function ColumnSelectorFactory(FieldSelector: ReturnType<typeof FieldSelectorFactory>) {
  const ColumnSelector: React.FC<ColumnSelectorProps> = ({
    column,
    columns,
    label,
    allFields,
    onSelect,
    fieldPairs
  }) => (
    <ColumnRow className="layer-config__column__selector">
      <ColumnName className="layer-config__column__name">
        <PanelLabel>
          <FormattedMessage id={`columns.${label}`} />
          {!column.optional ? `  *` : null}
        </PanelLabel>
      </ColumnName>
      <ColumnSelect className="layer-config__column__select">
        <FieldSelector
          suggested={fieldPairs}
          error={!validateColumn(column, columns, allFields)}
          fields={allFields}
          value={column.value}
          erasable={Boolean(column.optional)}
          onSelect={onSelect}
        />
      </ColumnSelect>
    </ColumnRow>
  );
  return ColumnSelector;
}

export default ColumnSelectorFactory;
