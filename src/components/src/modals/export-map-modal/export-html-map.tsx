// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {StyledExportSection, StyledType, CheckMark} from '../../common/styled-components';
import {StyledExportMapSection, StyledWarning, ExportMapLink} from './components';
import {
  EXPORT_HTML_MAP_MODE_OPTIONS,
  EXPORT_HTML_MAP_DOC,
  EXPORT_HTML_MAP_MODES_DOC
} from '@kepler.gl/constants';
import styled from 'styled-components';
import {injectIntl} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {IntlShape} from 'react-intl';

import {setUserMapboxAccessToken, setExportHTMLMapMode, ActionHandler} from '@kepler.gl/actions';

const ExportMapStyledExportSection = styled(StyledExportSection)`
  .disclaimer {
    font-size: ${props => props.theme.inputFontSize};
    color: ${props => props.theme.inputColor};
    margin-top: 12px;
  }
`;

interface StyledInputProps {
  error?: boolean;
}

const StyledInput = styled.input<StyledInputProps>`
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

type ExportHtmlMapProps = {
  onChangeExportMapHTMLMode: ActionHandler<typeof setExportHTMLMapMode>;
  onEditUserMapboxAccessToken: ActionHandler<typeof setUserMapboxAccessToken>;
  options: {
    userMapboxToken?: string;
    mode?: string;
  };
};

type IntlProps = {
  intl: IntlShape;
};

function ExportHtmlMapFactory(): React.ComponentType<ExportHtmlMapProps> {
  /** @type {typeof import('./export-html-map').ExportHtmlMap} */
  const ExportHtmlMap: React.FC<ExportHtmlMapProps & IntlProps> = ({
    onChangeExportMapHTMLMode = () => {
      return;
    },
    onEditUserMapboxAccessToken = () => {
      return;
    },
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
