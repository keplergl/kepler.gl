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

import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from 'localization';
import {PanelLabel} from '../..';
import FieldSelectorFactory from 'components/common/field-selector';
import {validateColumn} from 'reducers/vis-state-merger';

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

function ColumnSelectorFactory(FieldSelector) {
  const ColumnSelector = ({column, columns, label, allFields, onSelect, fieldPairs}) => (
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
