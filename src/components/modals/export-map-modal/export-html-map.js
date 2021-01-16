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
import {StyledExportSection, StyledType, CheckMark} from 'components/common/styled-components';
import {StyledExportMapSection, StyledWarning, ExportMapLink} from './components';
import {EXPORT_HTML_MAP_MODE_OPTIONS} from 'constants/default-settings';
import {EXPORT_HTML_MAP_DOC, EXPORT_HTML_MAP_MODES_DOC} from 'constants/user-guides';
import styled from 'styled-components';
import {injectIntl} from 'react-intl';
import {FormattedMessage} from 'localization';

const ExportMapStyledExportSection = styled(StyledExportSection)`
  .disclaimer {
    font-size: ${props => props.theme.inputFontSize};
    color: ${props => props.theme.inputColor};
    margin-top: 12px;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.inputPadding};
  color: ${props => (props.error ? 'red' : props.theme.titleColorLT)};
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

const BigStyledTile = styled(StyledType)`
  height: unset;
  width: unset;
  img {
    width: 180px;
    height: 120px;
  }
`;

function ExportHtmlMapFactory() {
  /** @type {typeof import('./export-html-map').ExportHtmlMap} */
  const ExportHtmlMap = ({
    onChangeExportMapHTMLMode = mode => {},
    onEditUserMapboxAccessToken = token => {},
    options = {},
    intl
  }) => (
    <div>
      <StyledExportMapSection>
        <div className="description" />
        <div className="selection">
          <FormattedMessage id={'modal.exportMap.html.selection'} />
        </div>
      </StyledExportMapSection>
      <ExportMapStyledExportSection className="export-map-modal__html-options">
        <div className="description">
          <div className="title">
            <FormattedMessage id={'modal.exportMap.html.tokenTitle'} />
          </div>
          <div className="subtitle">
            <FormattedMessage id={'modal.exportMap.html.tokenSubtitle'} />
          </div>
        </div>
        <div className="selection">
          <StyledInput
            onChange={e => onEditUserMapboxAccessToken(e.target.value)}
            type="text"
            placeholder={intl.formatMessage({id: 'modal.exportMap.html.tokenPlaceholder'})}
            value={options ? options.userMapboxToken : ''}
          />
          <div className="disclaimer">
            <StyledWarning>
              <FormattedMessage id={'modal.exportMap.html.tokenMisuseWarning'} />
            </StyledWarning>
            <FormattedMessage id={'modal.exportMap.html.tokenDisclaimer'} />
            <ExportMapLink href={EXPORT_HTML_MAP_DOC}>
              <FormattedMessage id={'modal.exportMap.html.tokenUpdate'} />
            </ExportMapLink>
          </div>
        </div>
      </ExportMapStyledExportSection>
      <ExportMapStyledExportSection>
        <div className="description">
          <div className="title">
            <FormattedMessage id={'modal.exportMap.html.modeTitle'} />
          </div>
          <div className="subtitle">
            <FormattedMessage id={'modal.exportMap.html.modeSubtitle1'} />
            <a href={EXPORT_HTML_MAP_MODES_DOC}>
              <FormattedMessage id={'modal.exportMap.html.modeSubtitle2'} />
            </a>
          </div>
        </div>
        <div className="selection">
          {EXPORT_HTML_MAP_MODE_OPTIONS.map(mode => (
            <BigStyledTile
              key={mode.id}
              selected={options.mode === mode.id}
              available={mode.available}
              onClick={() => mode.available && onChangeExportMapHTMLMode(mode.id)}
            >
              <img src={mode.url} alt="" />
              <p>
                <FormattedMessage
                  id={'modal.exportMap.html.modeDescription'}
                  values={{mode: intl.formatMessage({id: mode.label})}}
                />
              </p>
              {options.mode === mode.id && <CheckMark />}
            </BigStyledTile>
          ))}
        </div>
      </ExportMapStyledExportSection>
    </div>
  );

  ExportHtmlMap.displayName = 'ExportHtmlMap';

  return injectIntl(ExportHtmlMap);
}

export default ExportHtmlMapFactory;
