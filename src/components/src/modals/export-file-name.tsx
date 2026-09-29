// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import {FormattedMessage} from '@kepler.gl/localization';

import {InputLight, StyledExportSection} from '../common/styled-components';

const FileNameSection = styled(StyledExportSection)<{$compact?: boolean}>`
  ${props => (props.$compact ? 'margin: 8px 0 12px;' : '')}
`;

const StyledFileNameInput = styled(InputLight)`
  width: 100%;
  max-width: 320px;
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
  return (
    <FileNameSection $compact={compact}>
      <div className="description">
        <div className="title">
          <FormattedMessage id="modal.exportFileName.title" />
        </div>
        <div className="subtitle">
          <FormattedMessage id="modal.exportFileName.subtitle" />
        </div>
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
