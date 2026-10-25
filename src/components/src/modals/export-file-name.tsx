// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import {FormattedMessage} from '@kepler.gl/localization';

import {Help} from '../common/icons';
import {InputLight, StyledExportSection, Tooltip} from '../common/styled-components';

const FileNameSection = styled(StyledExportSection)<{$compact?: boolean}>`
  ${props => (props.$compact ? 'margin: 8px 0 12px;' : '')}
`;

const StyledFileNameInput = styled(InputLight)`
  width: 100%;
  max-width: 380px;
`;

const FileNameTitle = styled.div`
  align-items: center;
  display: flex;
`;

const FileNameHelp = styled.button.attrs({type: 'button'})`
  align-items: center;
  background: transparent;
  border: 0;
  color: ${props => props.theme.labelColor};
  cursor: help;
  display: inline-flex;
  margin-left: 6px;
  padding: 0;

  &:hover,
  &:focus {
    color: ${props => props.theme.textColorHl};
  }
`;

const FileNameHelpContent = styled.div`
  max-width: 220px;
  text-align: left;
  white-space: normal;
`;

export type ExportFileNameSectionProps = {
  fileName?: string;
  onChange: (fileName: string) => void;
  inputId?: string;
  compact?: boolean;
};

const ExportFileNameSection: React.FC<ExportFileNameSectionProps> = ({
  fileName = '',
  onChange,
  inputId = 'export-file-name',
  compact
}) => {
  const intl = useIntl();
  const helpId = `${inputId}-extension-help`;
  return (
    <FileNameSection $compact={compact}>
      <div className={compact ? 'description description--centered' : 'description'}>
        <FileNameTitle className="title">
          <FormattedMessage id="modal.exportFileName.title" />
          <FileNameHelp
            aria-describedby={helpId}
            aria-label={intl.formatMessage({id: 'modal.exportFileName.subtitle'})}
            data-for={helpId}
            data-tip
          >
            <Help aria-hidden height="12px" />
            <Tooltip id={helpId} effect="solid" place="top">
              <FileNameHelpContent>
                <FormattedMessage id="modal.exportFileName.subtitle" />
              </FileNameHelpContent>
            </Tooltip>
          </FileNameHelp>
        </FileNameTitle>
      </div>
      <div className="selection">
        <StyledFileNameInput
          id={inputId}
          type="text"
          value={fileName}
          placeholder={intl.formatMessage({id: 'modal.exportFileName.placeholder'})}
          aria-label={intl.formatMessage({id: 'modal.exportFileName.title'})}
          onChange={event => onChange(event.target.value)}
          onMouseDown={event => event.stopPropagation()}
        />
      </div>
    </FileNameSection>
  );
};

export default ExportFileNameSection;
