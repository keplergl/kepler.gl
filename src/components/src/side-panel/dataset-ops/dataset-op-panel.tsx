// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';

import {Button, Input, PanelLabel, SidePanelSection} from '../../common/styled-components';
import {Close} from '../../common/icons';

const Panel = styled.div`
  width: 320px;
  background: ${props => props.theme.panelBackground};
  border-radius: 4px;
  box-shadow: ${props => props.theme.dropdownListShadow};
  padding: 12px;
  color: ${props => props.theme.textColor};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: 500;
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
  margin-top: 12px;
`;

const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0;
`;

export function DatasetOpPanel({
  titleId,
  error,
  onClose,
  onRun,
  canRun,
  children
}: {
  titleId: string;
  error?: string | null;
  onClose: () => void;
  onRun: () => void;
  canRun: boolean;
  children: React.ReactNode;
}) {
  return (
    <Panel className="dataset-ops-panel">
      <Header>
        <FormattedMessage id={titleId} />
        <CloseButton type="button" onClick={onClose} aria-label="Close">
          <Close height="12px" />
        </CloseButton>
      </Header>
      {error ? <Error>{error}</Error> : null}
      {children}
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
