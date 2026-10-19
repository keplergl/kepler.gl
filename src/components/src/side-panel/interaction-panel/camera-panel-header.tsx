// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {ArrowDown, ArrowUp} from '../../common/icons';
import Switch from '../../common/switch';
import {
  PanelHeaderContent,
  PanelHeaderTitle,
  StyledPanelHeader
} from '../../common/styled-components';

export const CameraPanel = styled.section`
  padding-bottom: 6px;
`;

const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  height: 100%;
  min-width: 0;
  padding: 0 16px 0 0;
  border: 0;
  background: transparent;
  color: ${props => props.theme.textColor};
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
  }
`;

const Toggle = styled.div`
  .kg-checkbox {
    margin: 0;
  }
  .camera-toggle-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
  &:focus-within {
    outline: 2px solid ${props => props.theme.activeColor};
  }
`;

export default function CameraPanelHeader({
  id,
  title,
  enableLabel,
  open,
  enabled,
  onToggleOpen,
  onToggleEnabled,
  Icon
}: {
  id: string;
  title: string;
  enableLabel: string;
  open: boolean;
  enabled: boolean;
  onToggleOpen: () => void;
  onToggleEnabled?: () => void;
  Icon: React.ElementType;
}) {
  const Chevron = open ? ArrowUp : ArrowDown;
  return (
    <StyledPanelHeader className={open ? 'is-open' : undefined}>
      <ExpandButton
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-content`}
        onClick={onToggleOpen}
      >
        <PanelHeaderContent as="span">
          <span className="icon">
            <Icon height="16px" aria-hidden="true" />
          </span>
          <PanelHeaderTitle>{title}</PanelHeaderTitle>
        </PanelHeaderContent>
        <Chevron height="12px" aria-hidden="true" />
      </ExpandButton>
      <Toggle>
        <Switch
          id={`${id}-toggle`}
          secondary
          checked={enabled}
          disabled={!onToggleEnabled}
          label={<span className="camera-toggle-label">{enableLabel}</span>}
          onChange={onToggleEnabled}
        />
      </Toggle>
    </StyledPanelHeader>
  );
}
