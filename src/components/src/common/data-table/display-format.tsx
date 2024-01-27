// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';

import {getFieldFormatLabels} from '@kepler.gl/utils';
import {ALL_FIELD_TYPES, TooltipFormat} from '@kepler.gl/constants';
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
  defaultFormat: string;
  options: TooltipFormat[];
  columns: {name: string}[];
  colMeta: ColMeta;
  setColumnDisplayFormat: (formats: {[key: string]: string}) => void;
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
}: DataTableConfigProps) => {
  const [showFormatter, setShowFormatter] = useState(false);
  const [format, setFormat] = useState(defaultFormat);

  const onSetDisplayFormat = useCallback(
    (option: TooltipFormat) => {
      setFormat(option.label);
      const formats: {[key: string]: string} = columns.reduce((prev, col) => {
        prev[col.name] = option.format;
        return prev;
      }, {});
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
  const getColumnsByFieldType = (columns: string[], colMeta: ColMeta, fieldType: string) => {
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
