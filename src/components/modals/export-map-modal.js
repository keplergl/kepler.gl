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
import {GITHUB_EXPORT_HTML_MAP, MAPBOX_ACCESS_TOKEN} from 'constants/user-guides';

const StyledExportMapModal = styled.div`
  padding: ${props => props.theme.modalPadding};

  .title {
    font-weight: 500;
    color: ${props => props.theme.textColorLT};
    font-size: 12px;
  }

  .description {
    color: ${props => props.theme.textColor};
    font-size: 11px;
  }
`;

const StyledSection = styled.div`
  margin: 24px 0;
`;

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

const propTypes = {
  exportHtml: PropTypes.object,
  onExportMapboxAccessToken: PropTypes.func.isRequired
};

const ExportMapModal = ({
  exportHtml,
  onExportMapboxAccessToken
}) => (
  <StyledExportMapModal>
    <div className="export-map-modal">
      <div className="title">
        Export your map into a single html file
      </div>
      <div className="subtitle">
        You will be able to save your map into an interactive html file.
      </div>

      <StyledSection>
        <div>
          Please provide your <a style={{textDecorationLine: 'underline'}} href={MAPBOX_ACCESS_TOKEN}>Mapbox access token</a>
        </div>
        <StyledInput
          onChange={e => onExportMapboxAccessToken(e.target.value)}
          type="text"
          placeholder="Mapbox access token"
          value={exportHtml ? exportHtml.exportMapboxAccessToken : ''}
        />
        <div>
          * <a style={{textDecorationLine: 'underline'}} href={GITHUB_EXPORT_HTML_MAP}>How to update an existing map token</a>
        </div>
      </StyledSection>

    </div>
  </StyledExportMapModal>
);

ExportMapModal.propTypes = propTypes;

const exportMapModalFactory = () => ExportMapModal;
export default exportMapModalFactory;
