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
import styled from 'styled-components';
import JSONPretty from 'react-json-pretty';
import {GITHUB_EXPORT_HTML_MAP} from 'constants/user-guides';
import {FileType} from 'components/common/icons';
import {
  StyledModalContent,
  StyledExportSection,
  StyledType
} from 'components/common/styled-components';
import {EXPORT_MAP_FORMAT, EXPORT_MAP_FORMAT_OPTIONS} from 'constants/default-settings';

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.inputPadding};
  color: ${props => props.error ? 'red' : props.theme.titleColorLT};
  height: ${props => props.theme.inputBoxHeight};
  outline: 0;
  font-size: ${props => props.theme.inputFontSize};
  
  :active,
  :focus,
  &.focus,
  &.active {
    outline: 0;
  }
`;

const DISCLAIMER = "* If you don't provide your own token, the map may fail to display at any time as we rotate ours to avoid misuse." +
  " You can change the Mapbox token later using the following instructions: ";

const exportHtmlPropTypes = {
  options: PropTypes.object,
  onEditUserMapboxAccessToken: PropTypes.func.isRequired
};

const ExportHtmlMap = ({
  options = {},
  onEditUserMapboxAccessToken = () => {}
}) => (
  <div>
    <StyledExportSection className="export-map-modal__html-options">
      <div className="description">
        <div className="title">
          Please provide your Mapbox access token
        </div>
        <div className="subtitle">
          Export your map into a single html file
        </div>
      </div>
      <div className="selection">
        <StyledInput
          onChange={e => onEditUserMapboxAccessToken(e.target.value)}
          type="text"
          placeholder="Mapbox access token"
          value={options ? options.userMapboxToken : ''}
        />
      </div>
    </StyledExportSection>
    <StyledExportSection>
      <div>
        {DISCLAIMER} <a style={{textDecorationLine: 'underline'}}
                        href={GITHUB_EXPORT_HTML_MAP}
                        target="_blank"
                        rel="noopener noreferrer">How to update an existing map token.</a>
      </div>
    </StyledExportSection>
  </div>
);

ExportHtmlMap.propTypes = exportHtmlPropTypes;

const StyledJsonExportSection = styled(StyledExportSection)`
  .note {
    color: ${props => props.theme.errorColor};
    font-size: 11px;
  }
  
  .viewer {
    border: 1px solid ${props => props.theme.selectBorderColorLT};
    background-color: white;
    border-radius: 2px;
    display: inline-block;
    font: inherit;
    line-height: 1.5em;
    padding: 0.5em 3.5em 0.5em 1em;
    margin: 0;
    box-sizing: border-box;
    height: 300px;
    width: 100%;
    overflow-y: scroll;
  }
`;

const exportJsonPropTypes = {
  options: PropTypes.object
};

const ExportJsonMap = ({
  config = {}
}) => (
  <div>
    <StyledJsonExportSection className="export-map-modal__json-options">
      <div className="description">
        <div className="title">
          Current Config
        </div>
        <div className="subtitle">
          You can copy or export the current Kepler.gl configuration.
        </div>
        <div className="note">
          * kepler.gl map config is coupled with loaded datasets.
          dataId key is used to bind layers and filters to a specific dataset.
          If you try to upload a configuration with a specific dataId you also need to make sure
          you existing dataset id match the dataId/s in the config.
        </div>
      </div>
      <div className="selection">
        <div className="viewer">
          <JSONPretty id="json-pretty" json={config}/>
        </div>
      </div>
    </StyledJsonExportSection>
  </div>
);

ExportJsonMap.propTypes = exportJsonPropTypes;

const propTypes = {
  options: PropTypes.object,
  onEditUserMapboxAccessToken: PropTypes.func.isRequired,
  onChangeExportData: PropTypes.func,
  onChangeExportMapType: PropTypes.func,
  mapFormat: PropTypes.string
};

const ExportMapModal = ({
  config = {},
  onChangeExportData = () => {},
  onChangeExportMapFormat  = () => {},
  onEditUserMapboxAccessToken = () => {},
  options = {}
}) => (
  <StyledModalContent className="export-map-modal">
    <div style={{width: '100%'}}>
      <StyledExportSection>
        <div className="description">
          <div className="title">
            Map format
          </div>
          <div className="subtitle">
            Choose the format to export your map to
          </div>
        </div>
        <div className="selection">
          {EXPORT_MAP_FORMAT_OPTIONS.map(op =>
            <StyledType
              key={op.id}
              selected={options.format === op.id}
              available={op.available}
              onClick={() => op.available && onChangeExportMapFormat(op.id)}
            >
              <FileType ext={op.label} height="80px" fontSize="11px" />
            </StyledType>
          )}
        </div>
      </StyledExportSection>
      {{
        [EXPORT_MAP_FORMAT.HTML]:  (
          <ExportHtmlMap
            options={options[options.format]}
            onEditUserMapboxAccessToken={onEditUserMapboxAccessToken}
          />
        ),
        [EXPORT_MAP_FORMAT.JSON]: (
          <ExportJsonMap
            config={config}
            onChangeExportData={onChangeExportData}
            options={options[options.format]}
          />
        )
      }[options.format]}
    </div>
  </StyledModalContent>
);

ExportMapModal.propTypes = propTypes;

const ExportMapModalFactory = () => ExportMapModal;

export default ExportMapModalFactory;
