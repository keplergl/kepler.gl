// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import {InputLight} from '../../common/styled-components';
import {
  EXPORT_MAP_FORMATS,
  EXPORT_MAP_FORMAT_OPTIONS,
  KEPLER_GL_NAME,
  KEPLER_GL_WEBSITE,
  MAP_INFO_CHARACTER
} from '@kepler.gl/constants';
import {MapInfo} from '@kepler.gl/types';
import {getApplicationConfig} from '@kepler.gl/utils';
import {
  StyledExportMapModalContent,
  StyledExportMapSection,
  StyledExportMapFormatPanels,
  StyledExportMapFormatPanel,
  CollapsibleExportMapSection,
  ExportMapHelp,
  ExportMapSectionTitle
} from './components';
import ExportHtmlMapFactory from './export-html-map';
import ExportJsonMapFactory from './export-json-map';
import {FormattedMessage} from '@kepler.gl/localization';
import {
  ActionHandler,
  setExportHTMLMapMode,
  setExportIncludeLayerApiKeys,
  setExportMapBranding,
  setExportMapFileName,
  setUserMapboxAccessToken
} from '@kepler.gl/actions';
import ExportFileNameSection from '../export-file-name';

interface ExportMapModalOptions {
  format: string;
  includeLayerApiKeys?: boolean;
  fileName?: string;
  appName?: string;
  appWebsite?: string;
  appIcon?: string;
  appNameColor?: string;
  [key: string]: any;
}

interface ExportMapModalFactoryProps {
  options?: ExportMapModalOptions;
  config: any;
  appName?: string;
  appWebsite?: string;
  mapInfo?: Partial<MapInfo>;
  onEditUserMapboxAccessToken: ActionHandler<typeof setUserMapboxAccessToken>;
  onChangeExportMapHTMLMode?: ActionHandler<typeof setExportHTMLMapMode>;
  onChangeExportMapBranding?: ActionHandler<typeof setExportMapBranding>;
  onChangeExportIncludeLayerApiKeys?: ActionHandler<typeof setExportIncludeLayerApiKeys>;
  onChangeExportMapFormat?: (format: string) => any;
  onChangeExportMapFileName?: ActionHandler<typeof setExportMapFileName>;
  /** Latest name and description. Applied when the map is exported, not while typing. */
  onMapInfoDraft?: (info: {title: string; description: string}) => void;
  mapFormat?: string;
}

const MapInfoInput = styled(InputLight)`
  width: 100%;
  max-width: 380px;
`;

const DEFAULT_APP_NAME_COLOR = '#1FBAD6';

function getAppNameColorInputValue(value: unknown): string {
  return typeof value === 'string' && /^#[\da-f]{6}$/i.test(value)
    ? value
    : DEFAULT_APP_NAME_COLOR;
}

const style = {width: '100%'};

const FormatSelector = styled.div`
  display: flex;
  gap: 8px;
`;

const FormatButton = styled.button.attrs({type: 'button'})<{$selected: boolean}>`
  align-items: center;
  background-color: ${props =>
    props.$selected ? props.theme.selectionBtnActBgd : props.theme.selectionBtnBgd};
  border: 1px solid
    ${props =>
      props.$selected
        ? props.theme.selectionBtnBorderActColor
        : props.theme.selectionBtnBorderColor};
  border-radius: 2px;
  color: ${props => (props.$selected ? props.theme.selectionBtnActColor : props.theme.textColorLT)};
  cursor: pointer;
  display: inline-flex;
  font-family: ${props => props.theme.fontFamilyMedium ?? props.theme.fontFamily};
  font-size: 12px;
  font-weight: 500;
  height: 38px;
  justify-content: center;
  letter-spacing: 0.3px;
  min-width: 92px;
  padding: 0 18px;
  text-transform: uppercase;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.selectionBtnBorderActColor};
    color: ${props => props.theme.selectionBtnActColor};
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${props => props.theme.activeColorLT};
    outline: 0;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

const NO_OP = () => ({} as any);

ExportMapModalFactory.deps = [ExportHtmlMapFactory, ExportJsonMapFactory];

function ExportMapModalFactory(
  ExportHtmlMap: ReturnType<typeof ExportHtmlMapFactory>,
  ExportJsonMap: ReturnType<typeof ExportJsonMapFactory>
) {
  const ExportMapModalUnmemoized = ({
    config = {},
    appName,
    appWebsite,
    onChangeExportMapFormat = NO_OP,
    onChangeExportMapHTMLMode = NO_OP,
    onChangeExportMapBranding = NO_OP,
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
    const htmlOptions = options[EXPORT_MAP_FORMATS.HTML] || {};
    const showCustomExportBranding = getApplicationConfig().enableCustomExportBranding;
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
              <ExportMapSectionTitle>
                <FormattedMessage id={'modal.exportMap.formatTitle'} />
                <ExportMapHelp
                  id="export-map-format-help"
                  label={intl.formatMessage({id: 'modal.exportMap.formatHelpLabel'})}
                >
                  <div>
                    <strong>HTML:</strong> <FormattedMessage id="modal.exportMap.formatHtmlHelp" />
                  </div>
                  <div>
                    <strong>JSON:</strong> <FormattedMessage id="modal.exportMap.formatJsonHelp" />
                  </div>
                </ExportMapHelp>
              </ExportMapSectionTitle>
              <div className="subtitle">
                <FormattedMessage id={'modal.exportMap.formatSubtitle'} />
              </div>
            </div>
            <div className="selection">
              <FormatSelector
                role="group"
                aria-label={intl.formatMessage({id: 'modal.exportMap.formatTitle'})}
              >
                {EXPORT_MAP_FORMAT_OPTIONS.map(op => (
                  <FormatButton
                    key={op.id}
                    $selected={options.format === op.id}
                    aria-pressed={options.format === op.id}
                    disabled={!op.available}
                    onClick={() => onChangeExportMapFormat(op.id)}
                  >
                    {op.label}
                  </FormatButton>
                ))}
              </FormatSelector>
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
                options={htmlOptions}
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
          <CollapsibleExportMapSection
            id="export-map-details"
            title={<FormattedMessage id="modal.exportMap.mapDetailsTitle" />}
          >
            <StyledExportMapSection>
              <div className="description description--centered">
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
              <div className="description description--centered">
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
            {showCustomExportBranding ? (
              <>
                <StyledExportMapSection>
                  <div className="description description--centered">
                    <div className="title">
                      <FormattedMessage id="modal.exportMap.appNameTitle" />
                    </div>
                  </div>
                  <div className="selection">
                    <MapInfoInput
                      id="export-map-app-name"
                      type="text"
                      value={options.appName ?? appName ?? KEPLER_GL_NAME}
                      aria-label={intl.formatMessage({id: 'modal.exportMap.appNameTitle'})}
                      onChange={event => onChangeExportMapBranding({appName: event.target.value})}
                    />
                  </div>
                </StyledExportMapSection>
                <StyledExportMapSection>
                  <div className="description description--centered">
                    <div className="title">
                      <FormattedMessage id="modal.exportMap.appNameColorTitle" />
                    </div>
                  </div>
                  <div className="selection">
                    <MapInfoInput
                      id="export-map-app-name-color"
                      type="color"
                      value={getAppNameColorInputValue(options.appNameColor)}
                      aria-label={intl.formatMessage({id: 'modal.exportMap.appNameColorTitle'})}
                      onChange={event =>
                        onChangeExportMapBranding({appNameColor: event.target.value})
                      }
                    />
                  </div>
                </StyledExportMapSection>
                <StyledExportMapSection>
                  <div className="description description--centered">
                    <div className="title">
                      <FormattedMessage id="modal.exportMap.appWebsiteTitle" />
                    </div>
                  </div>
                  <div className="selection">
                    <MapInfoInput
                      id="export-map-app-website"
                      type="text"
                      value={options.appWebsite ?? appWebsite ?? KEPLER_GL_WEBSITE}
                      aria-label={intl.formatMessage({id: 'modal.exportMap.appWebsiteTitle'})}
                      onChange={event =>
                        onChangeExportMapBranding({appWebsite: event.target.value})
                      }
                    />
                  </div>
                </StyledExportMapSection>
                <StyledExportMapSection>
                  <div className="description description--centered">
                    <div className="title">
                      <FormattedMessage id="modal.exportMap.appIconTitle" />
                    </div>
                  </div>
                  <div className="selection">
                    <MapInfoInput
                      id="export-map-app-icon"
                      type="url"
                      value={options.appIcon ?? ''}
                      aria-label={intl.formatMessage({id: 'modal.exportMap.appIconTitle'})}
                      onChange={event => onChangeExportMapBranding({appIcon: event.target.value})}
                    />
                  </div>
                </StyledExportMapSection>
              </>
            ) : null}
          </CollapsibleExportMapSection>
        </div>
      </StyledExportMapModalContent>
    );
  };

  ExportMapModalUnmemoized.displayName = 'ExportMapModal';

  const ExportMapModal = React.memo(ExportMapModalUnmemoized);

  return ExportMapModal;
}

export default ExportMapModalFactory;
