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

import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DatasetTagFactory from '../common/dataset-tag';
import {FieldListItemFactory} from '../../common/field-selector';
import {Input, Button} from 'components/common/styled-components';
import {addDataToMap} from 'kepler.gl/actions';
import {Delete, Reset} from 'components/common/icons';
// import {ALL_FIELD_TYPES} from 'constants/default-settings';

const StyledColumnsPanel = styled.div`
  margin-bottom: 12px;
  border-radius: 1px;
`;

const StyledDatasetHeader = styled.div`
  padding: 16px;
  background-color: ${props => props.theme.panelBackground};
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

const StyledFieldsPanel = styled.div`
  padding: 16px;
  background-color: ${props => props.theme.panelBackground};
`;

const StyledFieldControls = styled.div`
  color: ${props => props.theme.textColor};
  font-size: 11px;
  margin-bottom: 16px;
  position: relative;

  .columns-panel_input {
    margin-top: 8px;
  }
`;

const StyledButtonsContainter = styled.div`
  position: absolute;
  right: 8px;
  top: 34px;
  color: ${props => props.theme.textColor};
`;

const IconButton = styled(Button)`
  padding: 2px 2px;
  background: transparent;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    background: transparent;
  }

  svg {
    margin: 0;
  }
`;

ColumnsPanelFactory.deps = [DatasetTagFactory, FieldListItemFactory];

function ColumnsPanelFactory(DatasetTag, FieldListItem) {
  return class ColumnsPanel extends Component {
    static propTypes = {
      datasets: PropTypes.object,
      columnsConfig: PropTypes.object,
      dispatch: PropTypes.func
    };

    updateColumnsConfig = columnsConfig => {
      this.props.dispatch(
        addDataToMap({
          options: {
            keepExistingConfig: true
          },
          config: {
            version: 'v1',
            config: {
              visState: {
                columnsConfig
              }
            }
          }
        })
      );
    };

    _onChange = (dataId, fieldId, value) => {
      const {columnsConfig} = this.props;
      const datasetColumns = columnsConfig[dataId] || {};
      datasetColumns[fieldId] = value;
      columnsConfig[dataId] = datasetColumns;
      this.updateColumnsConfig(columnsConfig);
    };

    _getValue = (dataId, fieldId) => {
      return (this.props.columnsConfig[dataId] || {})[fieldId];
    };

    _clear = (dataId, fieldId) => {
      this._onChange(dataId, fieldId, '');
    };

    _reset = (dataId, fieldId) => {
      this._onChange(dataId, fieldId, fieldId);
    };

    _renderFieldControls = (field, dataset) => {
      const inputValue = this._getValue(dataset.id, field.id);
      return (
        <StyledFieldControls key={field.id}>
          <FieldListItem value={field} className="columns-panel_field" />
          <Input
            className="columns-panel_input"
            id={`${dataset.id}-${field.id}`}
            type="text"
            value={inputValue}
            onChange={({target: {value}}) => this._onChange(dataset.id, field.id, value)}
            secondary={true}
            placeholder={field.name}
          />
          <StyledButtonsContainter>
            {inputValue && (
              <IconButton
                className="input-button"
                onClick={() => this._clear(dataset.id, field.id)}
              >
                <Delete height={'12px'} />
              </IconButton>
            )}
            <IconButton className="input-button" onClick={() => this._reset(dataset.id, field.id)}>
              <Reset height={'12px'} />
            </IconButton>
          </StyledButtonsContainter>
        </StyledFieldControls>
      );
    };

    _renderDatasetPanel = (dataId, datasets) => {
      return (
        <Fragment key={dataId}>
          <StyledDatasetHeader>
            <DatasetTag dataset={datasets[dataId]} />
          </StyledDatasetHeader>
          <StyledFieldsPanel>
            {datasets[dataId].fields.map(field =>
              this._renderFieldControls(field, datasets[dataId])
            )}
          </StyledFieldsPanel>
        </Fragment>
      );
    };

    render() {
      const {datasets} = this.props;
      return (
        <StyledColumnsPanel className="filter-panel">
          {Object.keys(datasets).map(dataId => this._renderDatasetPanel(dataId, datasets))}
        </StyledColumnsPanel>
      );
    }
  };
}

export default ColumnsPanelFactory;
