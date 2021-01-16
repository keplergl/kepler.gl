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
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import {ADD_DATA_TO_MAP_DOC} from 'constants/user-guides';
import styled from 'styled-components';
import {StyledExportSection} from 'components/common/styled-components';
import {StyledExportMapSection, StyledWarning, ExportMapLink} from './components';
import {FormattedMessage} from 'localization';

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

const ExportJsonMapUnmemoized = ({config = {}}) => (
  <div>
    <StyledExportMapSection>
      <div className="description" />
      <div className="selection">
        <FormattedMessage id={'modal.exportMap.json.selection'} />
      </div>
    </StyledExportMapSection>
    <StyledJsonExportSection className="export-map-modal__json-options">
      <div className="description">
        <div className="title">
          <FormattedMessage id={'modal.exportMap.json.configTitle'} />
        </div>
        <div className="subtitle">
          <FormattedMessage id={'modal.exportMap.json.configDisclaimer'} />
          <ExportMapLink href={ADD_DATA_TO_MAP_DOC}>addDataToMap</ExportMapLink>.
        </div>
      </div>
      <div className="selection">
        <div className="viewer">
          <JSONPretty id="json-pretty" json={config} />
        </div>
        <div className="disclaimer">
          <StyledWarning>
            <FormattedMessage id={'modal.exportMap.json.disclaimer'} />
          </StyledWarning>
        </div>
      </div>
    </StyledJsonExportSection>
  </div>
);

ExportJsonMapUnmemoized.propTypes = exportJsonPropTypes;

ExportJsonMapUnmemoized.displayName = 'ExportJsonMap';

const ExportJsonMap = React.memo(ExportJsonMapUnmemoized);

const ExportJsonMapFactory = () => ExportJsonMap;

export default ExportJsonMapFactory;
