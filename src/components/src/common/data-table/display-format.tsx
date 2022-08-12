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

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';

import {getFieldFormatLabels} from '@kepler.gl/utils';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {ColMeta, ColMetaProps} from '@kepler.gl/types';

import {InputLight} from '../../common/styled-components';
import {FormatterDropdown} from './option-dropdown';

const StyledConfigPanel = styled.div`
  background-color: ${props => props.theme.headerCellBackground};
  box-shadow: 0 10px 18px 0 rgb(0 0 0 / 36%);
  flex-grow: 1;
`;
const StyledConfigPanelContent = styled.div`
  padding: 20px;
  min-width: 230px;
  max-height: 400px;
  overflow: overlay;
`;

const StyledTableConfigGroup = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  input {
    cursor: pointer !important;
    width: 184px;
    height: 22px;
  }
`;

export type DataTableConfigProps = {
  title: string;
  id: string;
  defaultFormat: any; // ! fix this
  options: any;
  columns: {name: string}[];
  colMeta: ColMeta;
  setColumnDisplayFormat: (formats: {column: string; displayFormat: string}) => void;
  onClose: () => void;
};

export const NumberFormatConfig: React.FC<DataTableConfigProps> = ({
  title,
  id,
  defaultFormat,
  options,
  columns,
  setColumnDisplayFormat,
  onClose
}) => {
  const [showFormatter, setShowFormatter] = useState(false);
  const [format, setFormat] = useState(defaultFormat);

  const onSetDisplayFormat = useCallback(
    option => {
      setFormat(option.label);
      const formats = columns.reduce((prev, col) => {
        prev[col.name] = option.format;
        return prev;
      }, {} as {column: string; displayFormat: string});
      setColumnDisplayFormat(formats);
      onClose();
    },
    [columns, setColumnDisplayFormat, onClose]
  );

  return (
    <StyledTableConfigGroup>
      <InputLight
        id={id}
        type="text"
        value={title}
        data-tip={format}
        readOnly
        onClick={() => setShowFormatter(true)}
      />
      <FormatterDropdown
        left={-185}
        top={10}
        isOpened={showFormatter}
        displayFormat={format}
        setDisplayFormat={onSetDisplayFormat}
        onClose={() => setShowFormatter(false)}
        formatLabels={options}
      />
    </StyledTableConfigGroup>
  );
};

function DataTableConfigFactory() {
  const getColumnsByFieldType = (columns, colMeta: ColMeta, fieldType: string) => {
    const result: ColMetaProps[] = [];
    columns.forEach(colName => {
      if (colMeta[colName]?.type === fieldType) {
        result.push(colMeta[colName]);
      }
    });
    return result;
  };

  const DataTableConfig = ({columns, colMeta, setColumnDisplayFormat, onClose}) => {
    const formatConfigs = [
      {
        title: '# Set Integer Number Format',
        id: 'input-iteger-format',
        displayType: ALL_FIELD_TYPES.integer
      },
      {
        title: '# Set Float Number Format',
        id: 'input-float-format',
        displayType: ALL_FIELD_TYPES.real
      },
      {
        title: '# Set Timestamp Format',
        id: 'input-datetime-format',
        displayType: ALL_FIELD_TYPES.timestamp
      },
      {
        title: '# Set Date Format',
        id: 'input-date-format',
        displayType: ALL_FIELD_TYPES.date
      },
      {
        title: '# Set Boolean Format',
        id: 'input-bool-format',
        displayType: ALL_FIELD_TYPES.boolean
      }
    ];

    return (
      <StyledConfigPanel>
        <StyledConfigPanelContent>
          {formatConfigs.map((config, index) => (
            <NumberFormatConfig
              title={`${config.title}`}
              key={index}
              id={config.id}
              defaultFormat={'None'}
              colMeta={colMeta}
              options={getFieldFormatLabels(`${config.displayType}`)}
              columns={getColumnsByFieldType(columns, colMeta, `${config.displayType}`)}
              setColumnDisplayFormat={setColumnDisplayFormat}
              onClose={onClose}
            />
          ))}
        </StyledConfigPanelContent>
      </StyledConfigPanel>
    );
  };
  return DataTableConfig;
}

export default DataTableConfigFactory;
