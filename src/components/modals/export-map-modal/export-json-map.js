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

import React from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import {GITHUB_ADD_DATA_TO_MAP} from 'constants/user-guides';
import {MAP_CONFIG_DESCRIPTION} from 'constants/default-settings';
import styled from 'styled-components';
import {
  StyledExportSection
} from 'components/common/styled-components';
import {
  StyledExportMapSection,
  StyledWarning,
  ExportMapLink
} from './components';

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
    height: 180px;
    width: 100%;
    overflow-y: scroll;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-width: 600px;
  }
`;

const exportJsonPropTypes = {
  options: PropTypes.object
};

const ExportJsonMap = React.memo(({
  config = {}
}) => (
  <div>
    <StyledExportMapSection>
      <div className="description" />
      <div className="selection">
        Export current map data and config into a single Json file. You can later open the same map by uploading this file to kepler.gl.
      </div>
    </StyledExportMapSection>
    <StyledJsonExportSection className="export-map-modal__json-options">
      <div className="description">
        <div className="title">
          Map Config
        </div>
        <div className="subtitle">
          {MAP_CONFIG_DESCRIPTION}
          <ExportMapLink href={GITHUB_ADD_DATA_TO_MAP}>
            addDataToMap
          </ExportMapLink>.
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
));

ExportJsonMap.propTypes = exportJsonPropTypes;

ExportJsonMap.displayName = 'ExportJsonMap';

const ExportJsonMapFactory = () => ExportJsonMap;

export default ExportJsonMapFactory;
