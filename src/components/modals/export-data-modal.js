// Copyright (c) 2019 Uber Technologies, Inc.
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

import {EXPORT_DATA_TYPE_OPTIONS} from 'constants/default-settings';
import {FileType} from 'components/common/icons';
import {
  StyledModalContent,
  StyledExportSection,
  StyledFilteredOption,
  StyledType
} from 'components/common/styled-components';

const propTypes = {
  datasets: PropTypes.object.isRequired,
  selectedDataset: PropTypes.string,
  dataType: PropTypes.string.isRequired,
  filtered: PropTypes.bool.isRequired,
  // callbacks
  onClose: PropTypes.func.isRequired,
  onChangeExportSelectedDataset: PropTypes.func.isRequired,
  onChangeExportDataType: PropTypes.func.isRequired,
  onChangeExportFiltered: PropTypes.func.isRequired
};

const getDataRowCount = (datasets, selectedDataset, filtered) => {
  const selectedData = datasets[selectedDataset];
  if (!selectedData) {
    return `${Object.keys(datasets).length} Files ` ;
  }
  const {allData, data} = selectedData;
  const rowCount = filtered ? data.length : allData.length;
  return `${rowCount.toLocaleString()} Rows`;
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
  <StyledModalContent className="export-data-modal">
    <div>
      <StyledExportSection>
        <div className="description">
          <div className="title">
            Dataset
          </div>
          <div className="subtitle">
            Choose the datasets you want to export
          </div>
        </div>
        <div className="selection">
          <select value={selectedDataset} onChange={e => onChangeExportSelectedDataset(e.target.value)}>
          {['All'].concat(Object.keys(datasets)).map(d => (
            <option key={d} value={d}>{(datasets[d] && datasets[d].label) || d}</option>
          ))}
          </select>
        </div>
      </StyledExportSection>
      <StyledExportSection>
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
            <StyledType
              key={op.id}
              selected={dataType === op.id}
              available={op.available}
              onClick={() => op.available && onChangeExportDataType(op.id)}
            >
              <FileType ext={op.label} height="80px" fontSize="11px" />
            </StyledType>
          )}
        </div>
      </StyledExportSection>
      <StyledExportSection>
        <div className="description">
          <div className="title">
            Filter Data
          </div>
          <div className="subtitle">
            You can choose exporting original data or filtered data
          </div>
        </div>
        <div className="selection">
          <StyledFilteredOption selected={!filtered} onClick={() => onChangeExportFiltered(false)}>
            <div className="filtered-title">Unfiltered Data</div>
            <div className="filtered-subtitle">{getDataRowCount(datasets, selectedDataset, false)}</div>
          </StyledFilteredOption>
          <StyledFilteredOption selected={filtered} onClick={() => onChangeExportFiltered(true)}>
            <div className="filtered-title">Filtered Data</div>
            <div className="filtered-subtitle">{getDataRowCount(datasets, selectedDataset, true)}</div>
          </StyledFilteredOption>
        </div>
      </StyledExportSection>
    </div>
  </StyledModalContent>
);

ExportDataModal.propTypes = propTypes;

const ExportDataModalFactory = () => ExportDataModal;
export default ExportDataModalFactory;
