// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';

import {FileType} from '../../common/icons';
import {StyledType, CheckMark} from '../../common/styled-components';
import {EXPORT_MAP_FORMATS, EXPORT_MAP_FORMAT_OPTIONS} from '@kepler.gl/constants';
import {
  StyledExportMapModalContent,
  StyledExportMapSection,
  StyledExportMapFormatPanels,
  StyledExportMapFormatPanel
} from './components';
import ExportHtmlMapFactory from './export-html-map';
import ExportJsonMapFactory from './export-json-map';
import {FormattedMessage} from '@kepler.gl/localization';
import {ActionHandler, setExportHTMLMapMode, setUserMapboxAccessToken} from '@kepler.gl/actions';

interface ExportMapModalFactoryProps {
  options?: {format: string};
  config: any;
  onEditUserMapboxAccessToken: ActionHandler<typeof setUserMapboxAccessToken>;
  onChangeExportMapHTMLMode?: ActionHandler<typeof setExportHTMLMapMode>;
  onChangeExportMapFormat?: (format: string) => any;
  mapFormat?: string;
}

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
    onEditUserMapboxAccessToken = NO_OP,
    options = {format: ''}
  }: ExportMapModalFactoryProps) => (
    <StyledExportMapModalContent className="export-map-modal">
      <div style={style}>
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
              onEditUserMapboxAccessToken={onEditUserMapboxAccessToken}
              options={options[EXPORT_MAP_FORMATS.HTML]}
            />
          </StyledExportMapFormatPanel>
          {options.format === EXPORT_MAP_FORMATS.JSON ? (
            <StyledExportMapFormatPanel $active>
              <ExportJsonMap config={config} />
            </StyledExportMapFormatPanel>
          ) : null}
        </StyledExportMapFormatPanels>
      </div>
    </StyledExportMapModalContent>
  );

  ExportMapModalUnmemoized.displayName = 'ExportMapModal';

  const ExportMapModal = React.memo(ExportMapModalUnmemoized);

  return ExportMapModal;
}

export default ExportMapModalFactory;
