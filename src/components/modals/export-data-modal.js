// Copyright (c) 2018 Uber Technologies, Inc.
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
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {EXPORT_DATA_TYPE_OPTIONS} from 'constants/default-settings';
import {FileType} from 'components/common/icons';
import {StyledModalContent} from 'components/common/styled-components';

const StyledExportDataSection = styled.div`
  display: flex;
  flex-direction: row;
  margin: 35px 0;
  width: 100%;

  .description {
    width: 185px;
    
    .title {
      font-weight: 500;
      color: ${props => props.theme.textColorLT};
      font-size: 12px;
    }
    .subtitle {
      color: ${props => props.theme.textColor};
      font-size: 11px;
    }
  }

  .selection {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    padding-left: 50px;

    select {
      background-color: white;
      border-radius: 1px;
      display: inline-block;
      font: inherit;
      line-height: 1.5em;
      padding: 0.5em 3.5em 0.5em 1em;
      margin: 0;      
      box-sizing: border-box;
      appearance: none;
      width: 250px;
      height: 36px;

      background-image:
        linear-gradient(45deg, transparent 50%, gray 50%),
        linear-gradient(135deg, gray 50%, transparent 50%),
        linear-gradient(to right, #ccc, #ccc);
      background-position:
        calc(100% - 20px) calc(1em + 2px),
        calc(100% - 15px) calc(1em + 2px),
        calc(100% - 2.5em) 4.5em;
      background-size:
        5px 5px,
        5px 5px,
        1px 1.5em;
      background-repeat: no-repeat;
    }

    select:focus {
      background-image:
        linear-gradient(45deg, green 50%, transparent 50%),
        linear-gradient(135deg, transparent 50%, green 50%),
        linear-gradient(to right, #ccc, #ccc);
      background-position:
        calc(100% - 15px) 1em,
        calc(100% - 20px) 1em,
        calc(100% - 2.5em) 4.5em;
      background-size:
        5px 5px,
        5px 5px,
        1px 1.5em;
      background-repeat: no-repeat;
      border-color: green;
      outline: 0;
    }
  }
`;

const StyledDataType = styled.div`
  border-radius: 2px;
  border: 1px solid ${props => props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT};
  color: ${props => props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT};
  cursor: pointer;
  font-weight: 500;
  height: 100px;
  margin: 4px;
  padding: 6px 10px;
  width: 100px;

  :hover {
    color: ${props => props.available && props.theme.primaryBtnBgd};
    border: 1px solid ${props => props.available && props.theme.primaryBtnBgd};
  }
`;

const StyledFilteredDataOption = styled.div`
  align-items: center;
  border-radius: 2px;
  border: 1px solid ${props => props.selected ? props.theme.primaryBtnBgd : props.theme.selectBorderColorLT};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 60px;
  justify-content: center;
  margin: 4px;
  padding: 8px 12px;
  width: 140px;

  :hover {
    border: 1px solid ${props => props.theme.primaryBtnBgd};
  }

  .filtered-title {
    color: ${props => props.theme.textColorLT};
    font-size: 12px;
    font-weight: 500;
  }
  .filtered-subtitle {
    color: ${props => props.theme.textColor};
    font-size: 11px;
  }
`;

const propTypes = {
  datasets: PropTypes.object.isRequired,
  selectedDataset: PropTypes.string,
  dataType: PropTypes.string.isRequired,
  filtered: PropTypes.bool.isRequired,
  // callbacks
  onClose: PropTypes.func.isRequired,
  onChangeExportSelectedDataset: PropTypes.func.isRequired,
  onChangeExportDataType: PropTypes.func.isRequired,
  onChangeExportFiltered: PropTypes.func.isRequired,
  onChangeExportConfig: PropTypes.func.isRequired
};

const getDataRowCount = (datasets, selectedDataset, filtered) => {
  const selectedData = datasets[selectedDataset];
  if (!selectedData) {
    return `${Object.keys(datasets).length} Files ` ;
  }
  const {allData, data} = selectedData;
  const rowCount = filtered ? data.length : allData.length;
  return `${rowCount.toLocaleString('en')} Rows`;
};

const ExportDataModal = ({
  datasets,
  selectedDataset,
  dataType,
  filtered,
  config,
  // callbacks:
  onChangeExportDataType,
  onChangeExportSelectedDataset,
  onChangeExportFiltered
}) => (
  <div className="export-data-modal">
    <StyledModalContent>
      <div>
        <StyledExportDataSection>
          <div className="description">
            <div className="title">
              Dataset
            </div>
            <div className="subtitle">
              Choose the datasets you want to export
            </div>
          </div>
          <div className="selection">
            <select value={selectedDataset} onChange={e => onChangeExportSelectedDataset({dataset: e.target.value})}>
            {['All'].concat(Object.keys(datasets)).map(d => (
              <option key={d} value={d}>{(datasets[d] && datasets[d].label) || d}</option>
            ))}
            </select>
          </div>
        </StyledExportDataSection>

        <StyledExportDataSection>
          <div className="description">
            <div className="title">
              Data Type
            </div>
            <div className="subtitle">
              Choose the type of data you want to export
            </div>
          </div>
          <div className="selection">
            {EXPORT_DATA_TYPE_OPTIONS.map(op =>
              <StyledDataType
                key={op.id}
                selected={dataType === op.id}
                available={op.available}
                onClick={() => op.available && onChangeExportDataType({dataType: op.id})}
              >
                <FileType ext={op.label} height="80px" fontSize="11px" />
              </StyledDataType>
            )}
          </div>
        </StyledExportDataSection>

        <StyledExportDataSection>
          <div className="description">
            <div className="title">
              Filter Data
            </div>
            <div className="subtitle">
              You can choose exporting original data or filtered data
            </div>
          </div>
          <div className="selection">
            <StyledFilteredDataOption selected={!filtered} onClick={() => onChangeExportFiltered({filtered: false})}>
              <div className="filtered-title">Unfiltered Data</div>
              <div className="filtered-subtitle">{getDataRowCount(datasets, selectedDataset, false)}</div>
            </StyledFilteredDataOption>
            <StyledFilteredDataOption selected={filtered} onClick={() => onChangeExportFiltered({filtered: true})}>
              <div className="filtered-title">Filtered Data</div>
              <div className="filtered-subtitle">{getDataRowCount(datasets, selectedDataset, true)}</div>
            </StyledFilteredDataOption>
          </div>
        </StyledExportDataSection>

      </div>
    </StyledModalContent>
  </div>
);

ExportDataModal.propTypes = propTypes;

const ExportDataModalFactory = () => ExportDataModal;
export default ExportDataModalFactory;
