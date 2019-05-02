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
import {GITHUB_EXPORT_HTML_MAP, GITHUB_ADD_DATA_TO_MAP} from 'constants/user-guides';
import {FileType} from 'components/common/icons';
import {
  StyledModalContent,
  StyledExportSection,
  StyledType
} from 'components/common/styled-components';
import {
  DISCLAIMER,
  EXPORT_MAP_FORMAT,
  EXPORT_MAP_FORMAT_OPTIONS,
  MAP_CONFIG_DESCRIPTION,
  TOKEN_MISUSE_WARNING
} from 'constants/default-settings';

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

const StyledWarning = styled.span`
  color: ${props => props.theme.errorColor};
  font-weight: ${props => props.theme.selectFontWeightBold};
`;

const StyledLink = styled.a`
  text-decoration-line: underline !important;
`;

const INTRA_SECTION_MARGING = '8px';

const ExportMapStyledExportSection = styled(StyledExportSection)`
  .disclaimer {
    font-size: ${props => props.theme.inputFontSize};
    color: ${props => props.theme.inputColor};
    margin-top: 12px;
  }
`;

const Link = ({children, ...props}) => (
  <StyledLink target="_blank"
              rel="noopener noreferrer" {...props}>
    {children}
  </StyledLink>
);

const exportHtmlPropTypes = {
  options: PropTypes.object,
  onEditUserMapboxAccessToken: PropTypes.func.isRequired
};

const ExportHtmlMap = ({
  options = {},
  onEditUserMapboxAccessToken = () => {}
}) => (
  <div>
    <StyledExportSection style={{marginTop: INTRA_SECTION_MARGING}}>
      <div className="description" />
      <div className="selection">
        Export your map into an interactive html file.
      </div>
    </StyledExportSection>
    <ExportMapStyledExportSection className="export-map-modal__html-options">
      <div className="description">
        <div className="title">
          Mapbox access token
        </div>
        <div className="subtitle">
          Use your own Mapbox access token in the html (optional)
        </div>
      </div>
      <div className="selection">
        <StyledInput
          onChange={e => onEditUserMapboxAccessToken(e.target.value)}
          type="text"
          placeholder="Paste your Mapbox access token"
          value={options ? options.userMapboxToken : ''}
        />
        <div className="disclaimer">
          <StyledWarning>{TOKEN_MISUSE_WARNING}</StyledWarning>
          <span>{DISCLAIMER}</span>
          <Link href={GITHUB_EXPORT_HTML_MAP}>
            How to update an existing map token.
          </Link>
        </div>
      </div>
    </ExportMapStyledExportSection>
  </div>
);

ExportHtmlMap.propTypes = exportHtmlPropTypes;

const StyledJsonExportSection = styled(ExportMapStyledExportSection)`
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
    height: 180px;
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
    <StyledExportSection style={{marginTop: INTRA_SECTION_MARGING}}>
      <div className="description" />
      <div className="selection">
        Export current map data and config into a single Json file. You can later open the same map by uploading this file to kepler.gl.
      </div>
    </StyledExportSection>
    <StyledJsonExportSection className="export-map-modal__json-options">
      <div className="description">
        <div className="title">
          Map Config
        </div>
        <div className="subtitle">
          {MAP_CONFIG_DESCRIPTION}
          <Link href={GITHUB_ADD_DATA_TO_MAP}>
            addDataToMap
          </Link>.
        </div>
      </div>
      <div className="selection">
        <div className="viewer">
          <JSONPretty id="json-pretty" json={config}/>
        </div>
        <div className="disclaimer">
          <StyledWarning>
            * Map config is coupled with loaded datasets. ‘dataId’ is used to bind layers, filters, and tooltips to a specific dataset. When passing this config to addDataToMap, make sure the dataset id matches the dataId/s in this config.
          </StyledWarning>
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
      <StyledExportSection style={{marginBottom: INTRA_SECTION_MARGING}}>
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
