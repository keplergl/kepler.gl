// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {Settings} from '../../common/icons';
import Switch from '../../common/switch';
import PanelHeaderActionFactory from '../panel-header-action';
import {HeaderActions} from './map-info-config';
import {
  PanelHeaderContent,
  PanelHeaderTitle,
  StyledPanelHeader
} from '../../common/styled-components';

const PanelHeaderAction = PanelHeaderActionFactory();

export const CameraPanel = styled.section`
  padding-bottom: 6px;
`;

// Keep the existing panel action's layout and colors, with a keyboard-operable target.
export const CameraIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
  }
  &:disabled {
    cursor: default;
  }
`;

const AccessibleHeaderActions = styled(HeaderActions)`
  .camera-toggle-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
  .kg-checkbox:focus-within {
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
  return (
    <StyledPanelHeader className={open ? 'is-open' : undefined} onClick={onToggleOpen}>
      <PanelHeaderContent>
        <div className="icon">
          <Icon height="16px" aria-hidden="true" />
        </div>
        <div>
          <PanelHeaderTitle>{title}</PanelHeaderTitle>
        </div>
      </PanelHeaderContent>
      <AccessibleHeaderActions onClick={event => event.stopPropagation()}>
        <CameraIconButton
          type="button"
          aria-label={title}
          aria-expanded={open}
          aria-controls={`${id}-content`}
          onClick={onToggleOpen}
        >
          <PanelHeaderAction
            id={`${id}-config`}
            className={open ? 'is-open' : undefined}
            tooltip="tooltip.interactionSettings"
            active={open}
            flush
            IconComponent={Settings}
          />
        </CameraIconButton>
        <Switch
          id={`${id}-toggle`}
          secondary
          checked={enabled}
          disabled={!onToggleEnabled}
          label={<span className="camera-toggle-label">{enableLabel}</span>}
          onChange={onToggleEnabled}
        />
      </AccessibleHeaderActions>
    </StyledPanelHeader>
  );
}
