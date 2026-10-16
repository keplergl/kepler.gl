// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import styled from 'styled-components';
import {media} from '@kepler.gl/styles';
import {FormattedMessage} from '@kepler.gl/localization';
import {useIntl} from 'react-intl';
import {StyledExportSection, StyledModalContent, Tooltip} from '../../common/styled-components';
import Checkbox from '../../common/checkbox';
import {ArrowRight, Help, WarningSign} from '../../common/icons';

export const StyledExportMapModalContent = styled(StyledModalContent)`
  padding-top: 8px;
  padding-bottom: 8px;

  ${StyledExportSection} {
    align-items: start;
    column-gap: 24px;
    display: grid;
    grid-template-columns: 180px minmax(0, 1fr);
    margin: 16px 0;

    .description {
      padding-top: 2px;
      width: auto;
    }

    .description.description--centered {
      align-self: center;
      padding-top: 0;
    }

    .selection {
      min-width: 0;
      padding-left: 0;

      select {
        border-color: ${props => props.theme.selectBorderColorLT};
        max-width: 380px;
        width: 100%;
      }
    }
  }

  ${media.portable`
    padding-top: 8px;
    padding-bottom: 8px;

    ${StyledExportSection} {
      grid-template-columns: minmax(0, 1fr);
      row-gap: 8px;

      .description {
        padding-top: 0;
      }
    }

    input[type='text'],
    select,
    [role='status'],
    .export-map-modal__json-options .viewer,
    .export-map-modal__collapsible-section {
      max-width: none;
    }
  `};
`;

export const StyledExportMapSection = styled(StyledExportSection)``;

const StyledLayerApiKeysSection = styled(StyledExportMapSection)`
  && {
    margin: 0 0 16px;
  }

  .kg-checkbox__label {
    margin-bottom: 0;
  }
`;

export const ExportMapSectionTitle = styled.div.attrs({className: 'title'})`
  align-items: center;
  display: flex;
`;

const StyledExportMapHelp = styled.button.attrs({type: 'button'})`
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

const StyledExportMapHelpContent = styled.div`
  max-width: 300px;
  text-align: left;
  white-space: normal;

  > * + * {
    margin-top: 6px;
  }
`;

type ExportMapHelpProps = {
  id: string;
  label: string;
  children: React.ReactNode;
};

export const ExportMapHelp = ({id, label, children}: ExportMapHelpProps) => (
  <StyledExportMapHelp aria-describedby={id} aria-label={label} data-for={id} data-tip>
    <Help aria-hidden height="12px" />
    <Tooltip id={id} effect="solid" place="top">
      <StyledExportMapHelpContent>{children}</StyledExportMapHelpContent>
    </Tooltip>
  </StyledExportMapHelp>
);

export const StyledExportMapFormatPanels = styled.div`
  display: grid;
  margin-top: 0;
  padding-top: 0;
`;

export const StyledExportMapFormatPanel = styled.div<{$active: boolean}>`
  grid-area: 1 / 1;
  display: ${props => (props.$active ? 'block' : 'none')};
  overflow: hidden;

  > div > ${StyledExportSection}:last-child {
    margin-bottom: 0;
  }
`;

const StyledCollapsibleSection = styled.div`
  margin: 4px 0 0;
  max-width: 584px;
  width: 100%;

  ${media.portable`
    max-width: 380px;
  `};
`;

const StyledCollapsibleHeader = styled.button.attrs({type: 'button'})<{$expanded: boolean}>`
  align-items: center;
  background: transparent;
  border: 0;
  color: ${props => props.theme.titleColorLT};
  cursor: pointer;
  display: flex;
  font-family: ${props => props.theme.fontFamilyMedium ?? props.theme.fontFamily};
  font-size: 12px;
  font-weight: 500;
  min-height: 42px;
  padding: 10px 0 10px 4px;
  text-align: left;
  width: 100%;

  &:hover {
    background-color: ${props => props.theme.panelBackgroundLT};
  }

  &:focus-visible {
    box-shadow: inset 0 0 0 2px ${props => props.theme.activeColorLT};
    outline: 0;
  }

  svg {
    margin-right: 6px;
    transform: rotate(${props => (props.$expanded ? 90 : 0)}deg);
    transition: transform 0.2s ease;
  }
`;

const StyledCollapsibleContent = styled.div`
  padding: 2px 0 4px;
`;

type CollapsibleExportMapSectionProps = {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
};

export const CollapsibleExportMapSection = ({
  id,
  title,
  children
}: CollapsibleExportMapSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  const contentId = `${id}-content`;
  const headerId = `${id}-header`;

  return (
    <StyledCollapsibleSection className="export-map-modal__collapsible-section">
      <StyledCollapsibleHeader
        id={headerId}
        $expanded={expanded}
        aria-controls={contentId}
        aria-expanded={expanded}
        onClick={() => setExpanded(value => !value)}
      >
        <ArrowRight aria-hidden height="12px" />
        {title}
      </StyledCollapsibleHeader>
      {expanded ? (
        <StyledCollapsibleContent id={contentId} role="region" aria-labelledby={headerId}>
          {children}
        </StyledCollapsibleContent>
      ) : null}
    </StyledCollapsibleSection>
  );
};

export const StyledWarning = styled.span`
  color: ${props => props.theme.errorColor};
  font-weight: ${props => props.theme.selectFontWeightBold};
`;

const StyledExportMapNotice = styled.div`
  align-items: flex-start;
  background-color: ${props => props.theme.selectBackgroundLT};
  border-left: 2px solid ${props => props.theme.errorColor};
  box-sizing: border-box;
  color: ${props => props.theme.textColorLT};
  display: flex;
  font-size: 11px;
  line-height: 1.45;
  margin-top: 8px;
  max-width: 380px;
  padding: 8px 10px;
  width: 100%;

  svg {
    flex: 0 0 auto;
    margin: 1px 8px 0 0;
  }
`;

const StyledExportMapNoticeCopy = styled.div`
  min-width: 0;
`;

type ExportMapNoticeProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const ExportMapNotice = ({children, ...props}: ExportMapNoticeProps) => (
  <StyledExportMapNotice {...props} role="status">
    <WarningSign aria-hidden height="14px" />
    <StyledExportMapNoticeCopy>{children}</StyledExportMapNoticeCopy>
  </StyledExportMapNotice>
);

export const StyledExportLink = styled.a`
  text-decoration-line: underline !important;
`;

export const ExportMapLink = ({children, ...props}) => (
  <StyledExportLink target="_blank" rel="noopener noreferrer" {...props}>
    {children}
  </StyledExportLink>
);

type IncludeLayerApiKeysToggleProps = {
  id: string;
  checked: boolean;
  onChange: (includeLayerApiKeys: boolean) => void;
};

export const IncludeLayerApiKeysToggle = ({
  id,
  checked,
  onChange
}: IncludeLayerApiKeysToggleProps) => {
  const intl = useIntl();
  const helpId = `${id}-help`;

  return (
    <StyledLayerApiKeysSection>
      <div className="description description--centered">
        <ExportMapSectionTitle>
          <FormattedMessage id="modal.exportMap.includeApiKeysTitle" />
          <ExportMapHelp
            id={helpId}
            label={intl.formatMessage({id: 'modal.exportMap.includeApiKeysHelpLabel'})}
          >
            <FormattedMessage id="modal.exportMap.includeApiKeysSubtitle" />
          </ExportMapHelp>
        </ExportMapSectionTitle>
      </div>
      <div className="selection">
        <Checkbox
          id={id}
          type="checkbox"
          checked={checked}
          label={<FormattedMessage id="modal.exportMap.includeApiKeys" />}
          onChange={event => onChange(event.target.checked)}
        />
      </div>
    </StyledLayerApiKeysSection>
  );
};
