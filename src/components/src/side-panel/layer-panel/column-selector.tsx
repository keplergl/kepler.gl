// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo, ReactNode} from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {PanelLabel} from '../../common/styled-components';
import FieldSelectorFactory from '../../common/field-selector';
import {validateColumn} from '@kepler.gl/reducers';
import {LayerColumn, LayerColumns, EnhancedFieldPair} from '@kepler.gl/types';
import {MinimalField} from '../../common/field-selector';

export type ColumnSelectorProps<FieldOption extends MinimalField> = {
  column: LayerColumn;
  columns: LayerColumns;
  label: string;
  allFields: FieldOption[];
  onSelect: (
    items:
      | ReadonlyArray<string | number | boolean | object>
      | string
      | number
      | boolean
      | object
      | null
  ) => void;
  fieldPairs: EnhancedFieldPair[] | null;
  isActive?: boolean;
};

const ColumnRow = styled.div`
  display: flex;
  margin-bottom: 8px;
  align-items: center;
`;

const ColumnName = styled.div`
  width: 32%;
  line-height: 1.2;
  padding-right: 6px;
`;

const ColumnSelect = styled.div`
  width: 68%;
`;

ColumnSelectorFactory.deps = [FieldSelectorFactory];

const ColumnPanelLabel = styled(PanelLabel).attrs<{children: ReactNode}>({
  className: 'side-panel-subpanel__label'
})`
  font-size: 10px;
`;

function ColumnSelectorFactory(FieldSelector: ReturnType<typeof FieldSelectorFactory>) {
  const ColumnSelector: React.FC<ColumnSelectorProps<any>> = ({
    column,
    columns,
    label,
    allFields,
    onSelect,
    fieldPairs,
    isActive = true
  }) => {
    const isError = useMemo(
      () => isActive && !validateColumn(column, columns, allFields),
      [isActive, column, columns, allFields]
    );
    return (
      <ColumnRow className="layer-config__column__selector">
        <ColumnName className="layer-config__column__name">
          <ColumnPanelLabel>
            <FormattedMessage id={`columns.${label}`} />
            {!column.optional ? `  *` : null}
          </ColumnPanelLabel>
        </ColumnName>
        <ColumnSelect className="layer-config__column__select">
          <FieldSelector
            suggested={fieldPairs as any}
            error={isError}
            fields={allFields}
            value={column.value}
            erasable
            onSelect={onSelect}
          />
        </ColumnSelect>
      </ColumnRow>
    );
  };
  return ColumnSelector;
}

export default ColumnSelectorFactory;
