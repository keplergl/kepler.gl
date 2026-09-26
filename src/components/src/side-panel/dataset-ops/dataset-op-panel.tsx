// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';

import {Button, Input, PanelLabel, SidePanelSection, Tooltip} from '../../common/styled-components';
import {ArrowLeft, ArrowRight, Help} from '../../common/icons';

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  height: 100%;
  width: 100%;
  color: ${props => props.theme.textColor};
`;

const BackButton = styled(Button)`
  flex-shrink: 0;
  padding: 0;
  margin-bottom: 12px;
  justify-content: flex-start;

  svg {
    margin-right: 6px;
  }
`;

const Header = styled.div<{hasDescription?: boolean}>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-bottom: ${props => (props.hasDescription ? '8px' : '12px')};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  svg {
    flex-shrink: 0;
    color: ${props => props.theme.subtextColor};
  }
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
`;

const Description = styled.div.attrs({
  className: 'dataset-ops-panel__description'
})`
  flex-shrink: 0;
  font-size: 12px;
  line-height: 1.4;
  color: ${props => props.theme.textColor};
  margin-bottom: 16px;
`;

const HelpButton = styled.span.attrs({
  className: 'dataset-ops-panel__help'
})`
  display: inline-flex;
  align-items: center;
  color: ${props => props.theme.labelColor};
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.textColorHl};
  }
`;

const HelpText = styled.div`
  max-width: 240px;
  line-height: 1.4;
  white-space: normal;
  text-align: left;
`;

const CollapsibleHeader = styled.div.attrs({
  className: 'dataset-ops-collapsible__header'
})<{isOpen?: boolean}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  color: ${props => props.theme.subtextColor};
  margin-bottom: 6px;
  cursor: pointer;
  svg.collapsible-arrow {
    margin-left: 4px;
    transition: transform 0.2s ease;
    transform: rotate(${props => (props.isOpen ? 90 : 0)}deg);
  }
`;

const SelectAllButton = styled.span.attrs({
  className: 'dataset-ops-collapsible__select-all'
})`
  margin-left: auto;
  color: ${props => props.theme.activeColor};
  font-size: 11px;
`;

export function CollapsibleSection({
  titleId,
  helpId,
  selectAll,
  onToggleSelectAll,
  children
}: {
  titleId: string;
  helpId?: string;
  selectAll?: boolean;
  onToggleSelectAll?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <SidePanelSection className="dataset-ops-collapsible">
      <CollapsibleHeader isOpen={open} onClick={() => setOpen(!open)}>
        <span>
          <FormattedMessage id={titleId} />
        </span>
        <ArrowRight className="collapsible-arrow" height="12px" />
        {helpId ? (
          <span onClick={event => event.stopPropagation()}>
            <DatasetOpHelp helpId={helpId} />
          </span>
        ) : null}
        {open && onToggleSelectAll ? (
          <SelectAllButton
            onClick={event => {
              event.stopPropagation();
              onToggleSelectAll();
            }}
          >
            <FormattedMessage id={selectAll ? 'datasetOps.unselectAll' : 'datasetOps.selectAll'} />
          </SelectAllButton>
        ) : null}
      </CollapsibleHeader>
      {open ? children : null}
    </SidePanelSection>
  );
}

export function DatasetOpHelp({helpId}: {helpId: string}) {
  const tooltipId = `${helpId.replace(/\./g, '-')}-help`;
  return (
    <HelpButton data-tip data-for={tooltipId} aria-label="Help">
      <Help height="14px" />
      <Tooltip id={tooltipId} effect="solid" place="right">
        <HelpText>
          <FormattedMessage id={helpId} />
        </HelpText>
      </Tooltip>
    </HelpButton>
  );
}

const Body = styled.div.attrs({
  className: 'dataset-ops-panel__body'
})`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  ${props => props.theme.sidePanelScrollBar};
`;

const Error = styled.div`
  color: ${props => props.theme.errorColor};
  font-size: 11px;
  margin-bottom: 8px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
  padding-top: 12px;
`;

/** Column lists scroll with the panel body so the dialog stays within the side panel. */
export const ScrollableColumnList = styled.div.attrs({
  className: 'dataset-ops-column-list'
})`
  overflow-x: hidden;
  padding-right: 4px;
`;

export function DatasetOpPanel({
  titleId,
  titleHelpId,
  titleIcon,
  descriptionId,
  error,
  onClose,
  onRun,
  canRun,
  children
}: {
  titleId: string;
  titleHelpId?: string;
  titleIcon?: React.ReactNode;
  descriptionId?: string;
  error?: string | null;
  onClose: () => void;
  onRun: () => void;
  canRun: boolean;
  children: React.ReactNode;
}) {
  return (
    <Panel className="dataset-ops-panel">
      <BackButton className="dataset-ops-panel__back" link type="button" onClick={onClose}>
        <ArrowLeft height="16px" />
        <FormattedMessage id="datasetOps.back" />
      </BackButton>
      <Header hasDescription={Boolean(descriptionId)}>
        <TitleRow>
          {titleIcon}
          <Title>
            <FormattedMessage id={titleId} />
          </Title>
          {titleHelpId ? <DatasetOpHelp helpId={titleHelpId} /> : null}
        </TitleRow>
      </Header>
      {descriptionId ? (
        <Description>
          <FormattedMessage id={descriptionId} />
        </Description>
      ) : null}
      {error ? <Error>{error}</Error> : null}
      <Body>{children}</Body>
      <Actions>
        <Button secondary small type="button" onClick={onClose}>
          <FormattedMessage id="datasetOps.cancel" />
        </Button>
        <Button small type="button" disabled={!canRun} onClick={onRun}>
          <FormattedMessage id="datasetOps.run" />
        </Button>
      </Actions>
    </Panel>
  );
}

export function ResultNameInput({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <SidePanelSection>
      <PanelLabel>
        <FormattedMessage id="datasetOps.resultName" />
      </PanelLabel>
      <Input type="text" value={value} onChange={e => onChange(e.target.value)} />
    </SidePanelSection>
  );
}

export function fieldNameFromSelector(value: unknown): string | null {
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    return fieldNameFromSelector(value[0]);
  }
  if (typeof value === 'object' && value && 'name' in value) {
    return String((value as {name: unknown}).name);
  }
  return null;
}

export default DatasetOpPanel;
