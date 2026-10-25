// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {InputLight, StyledExportSection} from '../../common/styled-components';
import {
  ExportMapHelp,
  ExportMapLink,
  ExportMapNotice,
  ExportMapSectionTitle,
  IncludeLayerApiKeysToggle
} from './components';
import {EXPORT_HTML_MAP_MODE_OPTIONS, EXPORT_HTML_MAP_DOC} from '@kepler.gl/constants';
import styled from 'styled-components';
import {injectIntl} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {IntlShape} from 'react-intl';

import {
  setUserMapboxAccessToken,
  setExportHTMLMapMode,
  setExportIncludeLayerApiKeys,
  ActionHandler
} from '@kepler.gl/actions';

const ExportMapStyledExportSection = styled(StyledExportSection)`
  .selection {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const StyledInput = styled(InputLight)`
  max-width: 380px;
  width: 100%;
`;

type ExportHtmlMapProps = {
  onChangeExportMapHTMLMode: ActionHandler<typeof setExportHTMLMapMode>;
  onChangeExportIncludeLayerApiKeys: ActionHandler<typeof setExportIncludeLayerApiKeys>;
  onEditUserMapboxAccessToken: ActionHandler<typeof setUserMapboxAccessToken>;
  includeLayerApiKeys?: boolean;
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
    onChangeExportIncludeLayerApiKeys = () => {
      return;
    },
    onEditUserMapboxAccessToken = () => {
      return;
    },
    includeLayerApiKeys = false,
    options = {},
    intl
  }) => {
    const hasCustomToken = Boolean(options.userMapboxToken?.trim());

    return (
      <div>
        <IncludeLayerApiKeysToggle
          id="export-include-layer-api-keys-html"
          checked={includeLayerApiKeys}
          onChange={onChangeExportIncludeLayerApiKeys}
        />
        <ExportMapStyledExportSection className="export-map-modal__html-options">
          <div className="description">
            <label className="title" htmlFor="export-map-mapbox-token">
              <FormattedMessage id={'modal.exportMap.html.tokenTitle'} />
            </label>
            <div className="subtitle">
              <FormattedMessage id={'modal.exportMap.html.tokenSubtitle'} />
            </div>
          </div>
          <div className="selection">
            <StyledInput
              id="export-map-mapbox-token"
              aria-describedby="export-map-token-guidance"
              aria-label={intl.formatMessage({id: 'modal.exportMap.html.tokenTitle'})}
              onChange={e => onEditUserMapboxAccessToken(e.target.value)}
              type="text"
              placeholder={intl.formatMessage({id: 'modal.exportMap.html.tokenPlaceholder'})}
              value={options.userMapboxToken ?? ''}
            />
            <ExportMapNotice id="export-map-token-guidance">
              <FormattedMessage
                id={
                  hasCustomToken
                    ? 'modal.exportMap.html.tokenEmbeddedNotice'
                    : 'modal.exportMap.html.tokenSharedNotice'
                }
              />{' '}
              <ExportMapLink href={EXPORT_HTML_MAP_DOC}>
                <FormattedMessage id={'modal.exportMap.html.tokenUpdate'} />
              </ExportMapLink>
            </ExportMapNotice>
          </div>
        </ExportMapStyledExportSection>
        <ExportMapStyledExportSection>
          <div className="description">
            <ExportMapSectionTitle>
              <label htmlFor="export-map-html-mode">
                <FormattedMessage id={'modal.exportMap.html.modeTitle'} />
              </label>
              <ExportMapHelp
                id="export-map-html-mode-help"
                label={intl.formatMessage({id: 'modal.exportMap.html.modeHelpLabel'})}
              >
                <div>
                  <strong>
                    <FormattedMessage id="modal.exportMap.html.read" />:
                  </strong>{' '}
                  <FormattedMessage id="modal.exportMap.html.modeReadHelp" />
                </div>
                <div>
                  <strong>
                    <FormattedMessage id="modal.exportMap.html.edit" />:
                  </strong>{' '}
                  <FormattedMessage id="modal.exportMap.html.modeEditHelp" />
                </div>
              </ExportMapHelp>
            </ExportMapSectionTitle>
            <div className="subtitle">
              <FormattedMessage id={'modal.exportMap.html.modeSubtitle1'} />
            </div>
          </div>
          <div className="selection">
            <select
              id="export-map-html-mode"
              aria-label={intl.formatMessage({id: 'modal.exportMap.html.modeTitle'})}
              value={options.mode ?? EXPORT_HTML_MAP_MODE_OPTIONS[0].id}
              onChange={event => onChangeExportMapHTMLMode(event.target.value)}
            >
              {EXPORT_HTML_MAP_MODE_OPTIONS.map(mode => (
                <option key={mode.id} value={mode.id} disabled={!mode.available}>
                  {intl.formatMessage({id: mode.label})}
                </option>
              ))}
            </select>
          </div>
        </ExportMapStyledExportSection>
      </div>
    );
  };

  ExportHtmlMap.displayName = 'ExportHtmlMap';

  return injectIntl(ExportHtmlMap);
}

export default ExportHtmlMapFactory;
