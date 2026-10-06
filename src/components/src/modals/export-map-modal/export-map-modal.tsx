// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import {FileType} from '../../common/icons';
import {StyledType, CheckMark, InputLight} from '../../common/styled-components';
import {
  EXPORT_MAP_FORMATS,
  EXPORT_MAP_FORMAT_OPTIONS,
  MAP_INFO_CHARACTER
} from '@kepler.gl/constants';
import {MapInfo} from '@kepler.gl/types';
import {
  StyledExportMapModalContent,
  StyledExportMapSection,
  StyledExportMapFormatPanels,
  StyledExportMapFormatPanel
} from './components';
import ExportHtmlMapFactory from './export-html-map';
import ExportJsonMapFactory from './export-json-map';
import {FormattedMessage} from '@kepler.gl/localization';
import {
  ActionHandler,
  setExportHTMLMapMode,
  setExportIncludeLayerApiKeys,
  setExportMapFileName,
  setUserMapboxAccessToken
} from '@kepler.gl/actions';
import ExportFileNameSection from '../export-file-name';

interface ExportMapModalOptions {
  format: string;
  includeLayerApiKeys?: boolean;
  fileName?: string;
  [key: string]: any;
}

interface ExportMapModalFactoryProps {
  options?: ExportMapModalOptions;
  config: any;
  mapInfo?: Partial<MapInfo>;
  onEditUserMapboxAccessToken: ActionHandler<typeof setUserMapboxAccessToken>;
  onChangeExportMapHTMLMode?: ActionHandler<typeof setExportHTMLMapMode>;
  onChangeExportIncludeLayerApiKeys?: ActionHandler<typeof setExportIncludeLayerApiKeys>;
  onChangeExportMapFormat?: (format: string) => any;
  onChangeExportMapFileName?: ActionHandler<typeof setExportMapFileName>;
  /** Latest name and description. Applied when the map is exported, not while typing. */
  onMapInfoDraft?: (info: {title: string; description: string}) => void;
  mapFormat?: string;
}

const MapInfoInput = styled(InputLight)`
  width: 100%;
  max-width: 320px;
`;

const style = {width: '100%'};

const CompactType = styled(StyledType)`
  height: 64px;
  width: 64px;
  padding: 4px;
`;

const NO_OP = () => ({} as any);

ExportMapModalFactory.deps = [ExportHtmlMapFactory, ExportJsonMapFactory];

function ExportMapModalFactory(
  ExportHtmlMap: ReturnType<typeof ExportHtmlMapFactory>,
  ExportJsonMap: ReturnType<typeof ExportJsonMapFactory>
) {
  const ExportMapModalUnmemoized = ({
    config = {},
    onChangeExportMapFormat = NO_OP,
    onChangeExportMapHTMLMode = NO_OP,
    onChangeExportIncludeLayerApiKeys = NO_OP,
    onChangeExportMapFileName = NO_OP,
    onEditUserMapboxAccessToken = NO_OP,
    onMapInfoDraft = NO_OP,
    mapInfo,
    options = {format: ''}
  }: ExportMapModalFactoryProps) => {
    const intl = useIntl();
    const [draftTitle, setDraftTitle] = useState(mapInfo?.title ?? '');
    const [draftDescription, setDraftDescription] = useState(mapInfo?.description ?? '');
    return (
      <StyledExportMapModalContent className="export-map-modal">
        <div style={style}>
          <ExportFileNameSection
            fileName={options.fileName}
            inputId="export-map-file-name"
            compact
            onChange={onChangeExportMapFileName}
          />
          <StyledExportMapSection>
            <div className="description">
              <div className="title">
                <FormattedMessage id="modal.exportMap.nameTitle" />
              </div>
            </div>
            <div className="selection">
              <MapInfoInput
                id="export-map-name"
                type="text"
                value={draftTitle}
                maxLength={MAP_INFO_CHARACTER.title}
                aria-label={intl.formatMessage({id: 'modal.exportMap.nameTitle'})}
                onChange={event => {
                  const title = event.target.value;
                  setDraftTitle(title);
                  onMapInfoDraft({title, description: draftDescription});
                }}
              />
            </div>
          </StyledExportMapSection>
          <StyledExportMapSection>
            <div className="description">
              <div className="title">
                <FormattedMessage id="modal.exportMap.descriptionTitle" />
              </div>
            </div>
            <div className="selection">
              <MapInfoInput
                id="export-map-description"
                type="text"
                value={draftDescription}
                maxLength={MAP_INFO_CHARACTER.description}
                aria-label={intl.formatMessage({id: 'modal.exportMap.descriptionTitle'})}
                onChange={event => {
                  const description = event.target.value;
                  setDraftDescription(description);
                  onMapInfoDraft({title: draftTitle, description});
                }}
              />
            </div>
          </StyledExportMapSection>
          <StyledExportMapSection>
            <div className="description">
              <div className="title">
                <FormattedMessage id={'modal.exportMap.formatTitle'} />
              </div>
              <div className="subtitle">
                <FormattedMessage id={'modal.exportMap.formatSubtitle'} />
              </div>
            </div>
            <div className="selection">
              {EXPORT_MAP_FORMAT_OPTIONS.map(op => (
                <CompactType
                  key={op.id}
                  selected={options.format === op.id}
                  onClick={() => op.available && onChangeExportMapFormat(op.id)}
                >
                  <FileType ext={op.label} height="48px" fontSize="10px" />

                  {options.format === op.id && <CheckMark />}
                </CompactType>
              ))}
            </div>
          </StyledExportMapSection>
          <StyledExportMapFormatPanels>
            <StyledExportMapFormatPanel
              $active={options.format === EXPORT_MAP_FORMATS.HTML}
              aria-hidden={options.format !== EXPORT_MAP_FORMATS.HTML}
              inert={options.format !== EXPORT_MAP_FORMATS.HTML ? true : undefined}
            >
              <ExportHtmlMap
                onChangeExportMapHTMLMode={onChangeExportMapHTMLMode}
                onChangeExportIncludeLayerApiKeys={onChangeExportIncludeLayerApiKeys}
                onEditUserMapboxAccessToken={onEditUserMapboxAccessToken}
                includeLayerApiKeys={Boolean(options.includeLayerApiKeys)}
                options={options[EXPORT_MAP_FORMATS.HTML]}
              />
            </StyledExportMapFormatPanel>
            {options.format === EXPORT_MAP_FORMATS.JSON ? (
              <StyledExportMapFormatPanel $active>
                <ExportJsonMap
                  config={config}
                  includeLayerApiKeys={Boolean(options.includeLayerApiKeys)}
                  onChangeExportIncludeLayerApiKeys={onChangeExportIncludeLayerApiKeys}
                />
              </StyledExportMapFormatPanel>
            ) : null}
          </StyledExportMapFormatPanels>
        </div>
      </StyledExportMapModalContent>
    );
  };

  ExportMapModalUnmemoized.displayName = 'ExportMapModal';

  const ExportMapModal = React.memo(ExportMapModalUnmemoized);

  return ExportMapModal;
}

export default ExportMapModalFactory;
