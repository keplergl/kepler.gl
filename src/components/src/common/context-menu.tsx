// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';

import {BaseProps} from './icons';

export const ContextMenuToggle = styled.div`
  margin-left: 8px;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: ${props => props.theme.panelHeaderIcon};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.panelHeaderIconHover};
  }
`;

export const ContextMenuAnchor = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 16px;
  pointer-events: none;
`;

export const ContextMenu = styled.div`
  min-width: 160px;
  width: max-content;
  background: ${props => props.theme.dropdownListBgd};
  box-shadow: ${props => props.theme.tooltipBoxShadow};
  border-radius: 4px;
  overflow: hidden;
`;

const ContextMenuItem = styled.button<{$active?: boolean}>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
  padding: 0 8px;
  border: 0;
  background: transparent;
  color: ${props => (props.$active ? props.theme.textColorHl : props.theme.textColor)};
  text-align: left;
  cursor: pointer;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.dropdownListHighlightBg};
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
    pointer-events: none;
  }
`;

const ContextMenuItemIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 6px;
  flex-shrink: 0;
  color: ${props => props.theme.subtextColor};
`;

export const ContextMenuSeparator = styled.div`
  border-top: 1px solid ${props => props.theme.dropdownListHighlightBg};
`;

export type ContextMenuAction = {
  className: string;
  labelId: string;
  Icon: React.ComponentType<Partial<BaseProps>>;
  iconHeight: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  active?: boolean;
};

export function ContextMenuActionButton({action}: {action: ContextMenuAction}) {
  return (
    <ContextMenuItem
      className={action.className}
      type="button"
      disabled={action.disabled}
      $active={action.active}
      onClick={event => {
        event.stopPropagation();
        action.onClick(event);
      }}
    >
      <ContextMenuItemIcon>
        <action.Icon height={action.iconHeight} />
      </ContextMenuItemIcon>
      <FormattedMessage id={action.labelId} />
    </ContextMenuItem>
  );
}

export function ContextMenuList({
  items,
  footer,
  className
}: {
  items: ContextMenuAction[];
  footer?: ContextMenuAction | null;
  className?: string;
}) {
  return (
    <ContextMenu className={className}>
      {items.map(item => (
        <ContextMenuActionButton key={item.className} action={item} />
      ))}
      {items.length > 0 && footer ? <ContextMenuSeparator /> : null}
      {footer ? <ContextMenuActionButton action={footer} /> : null}
    </ContextMenu>
  );
}
